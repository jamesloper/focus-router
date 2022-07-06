import React, { Fragment, createElement, useEffect } from 'react';
import { createBus, encodeSearchString, parsePathParams, parseQueryString, split } from './util';

let canNavigate = true;

const routes = [], // When you use <Route/>, this gets filled up
	routeStore = createBus(null),
	pathStore = createBus(location.pathname + location.search),
	paramStore = createBus({}),
	queryParamStore = createBus({});

const setRoute = route => {
	routeStore.update(route);
	pathStore.update(location.pathname + location.search);
	paramStore.update(parsePathParams(route, location.pathname));
	queryParamStore.update(parseQueryString(location.search));
};

export const defineRoute = (name, path, component, layout = Fragment) => {
	if (routes.some(r => r.name === name)) return;

	const patterns = split(path); // Looks like ['users', 'bob']
	const route = {
		name,
		path,
		component,
		layout,
		patterns,
		'test': (to) => {
			if (path === '*') return true;
			return split(to).every((part, i) => {
				if (!(i in patterns)) return false;
				const pattern = patterns[i];
				if (pattern.startsWith(':')) return !pattern.endsWith('?'); // param match
				return (part === pattern); // text match
			});
		},
		'createPath': (params = {}) => '/' + patterns.map(pattern => {
			if (pattern.startsWith(':')) return params[pattern.slice(1)];
			return pattern;
		}).join('/'),
	};
	routes.push(route);

	// Also the first successful match becomes the current route!
	if (!routeStore.state && route.test(location.pathname)) setRoute(route);
};

const changeRoute = () => {
	if (!canNavigate) return history.pushState(null, null, pathStore.state);
	const route = routes.find(r => r.test(location.pathname));
	if (route) setRoute(route);
};

window.onpopstate = changeRoute;

const navigate = (to, opts = {}) => {
	if (!canNavigate) return;

	opts = {'replaceState': false, 'scrollToTop': true, ...opts}; // set defaults for opts
	history[opts.replaceState ? 'replaceState' : 'pushState'](null, null, to);
	if (opts.scrollToTop) setTimeout(() => scrollTo(0, 0), 0);
	changeRoute();
};

export const createLink = (routeName, params, queryParams) => {
	const route = routes.find(r => r.name === routeName);
	if (!route) return console.error(`Route "${routeName}" does not exist`);
	return route.createPath(params) + encodeSearchString(queryParams);
};

export const useRouteName = () => routeStore.use().name;

export const useParam = (key, fallback) => {
	const params = paramStore.use();
	return [
		(key in params) ? params[key] : fallback,
		(val, opts) => navigation.setParams({[key]: val}, opts),
	];
};

export const useQueryParam = (key, fallback) => {
	const params = queryParamStore.use();
	return [
		(key in params) ? params[key] : fallback,
		(val, opts) => navigation.setQueryParams({[key]: val}, opts),
	];
};

const preventDefault = e => {
	e.preventDefault();
	e.returnValue = '';
};

export const useUnsavedChanges = (active) => {
	useEffect(() => {
		if (active) window.addEventListener('beforeunload', preventDefault);
		return () => window.removeEventListener('beforeunload', preventDefault);
	}, [active]);

	useEffect(() => {
		canNavigate = !active;
		return () => canNavigate = null;
	}, [active]);
};

export const navigation = {
	go(target, params = {}, queryParams = {}, opts = {}) {
		if (target.startsWith('/')) return navigate(target, opts);
		navigate(createLink(target, params, queryParams), opts);
	},
	setParams(params, opts) {
		navigate(routeStore.state.createPath(params) + location.search, opts);
	},
	setQueryParams(params, opts) {
		navigate(location.pathname + encodeSearchString({...queryParamStore.state, ...params}), opts);
	},
	back() {
		if (canNavigate) history.back();
	},
	goBack(steps) {
		if (canNavigate) history.go(steps * -1);
	},
};

const Router = () => {
	const route = routeStore.use();
	if (!route) return null;
	return createElement(route.layout, null, createElement(route.component, {navigation}));
};

export default Router;

// Initialize the link handler
document.addEventListener('click', e => {
	if (e.metaKey || e.ctrlKey || e.defaultPrevented) return;

	e.preventDefault();
	const link = e.composedPath().find(el => el.tagName === 'A');
	if (link && link.hostname === location.hostname) {
		e.preventDefault();
		navigate(link.href);
	}
});