import React, { Fragment, createElement, useEffect } from 'react';
import { createBus, useBus, encodeSearchString, parsePathParams, parseQueryString, split, range } from './util';

let canNavigate = true;

const routes = [],
	routeStore = createBus(null),
	pathStore = createBus(location.pathname + location.search),
	paramStore = createBus({}),
	queryParamStore = createBus({});

// Called by changeRoute to update the internal state or by defineRoute to set the initial state
const setRoute = route => {
	routeStore.update(route);
	pathStore.update(location.pathname + location.search);
	paramStore.update(parsePathParams(route, location.pathname));
	queryParamStore.update(parseQueryString(location.search));
};

export const defineRoute = (name, path, component, layout = Fragment) => {
	const patterns = split(path);
	const route = {
		name,
		path,
		component,
		layout,
		patterns,
		'test': to => {
			const splitted = split(to);
			if (path === '*') return true;
			const pathFitsTo = splitted.every((part, i) => {
				if (i in patterns) return (part === patterns[i] || patterns[i].startsWith(':'));
			});
			if (pathFitsTo) return patterns.every((pattern, i) => { // to fits path
				if (pattern.endsWith('?')) return true;
				if (pattern.startsWith(':')) return (i in splitted);
				return (splitted[i] === pattern);
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

// Called to react to a change in the URL and apply that change to internal state
const changeRoute = () => {
	if (!canNavigate) return history.pushState(null, null, pathStore.state);
	const route = routes.find(r => r.test(location.pathname));
	if (route) setRoute(route);
};

// Call changeRoute when user navigates with the browser (out of our control)
window.onpopstate = changeRoute;

// Navigation primitive used by all navigation functions
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

// Returns the route name (from your defineRoute)
export const useRouteName = () => useBus(routeStore).name;

// Useful only for debugging really
export const useParams = () => useBus(paramStore);

export const useParam = (key, defaultValue) => {
	const p = useBus(paramStore);
	return (key in p) ? p[key] : defaultValue;
};

export const useQueryParam = (key, defaultValue) => {
	const p = useBus(queryParamStore);
	return (key in p) ? p[key] : defaultValue;
};

export const useUnsavedChanges = (active, callback) => {
	useEffect(() => {
		const preventDefault = e => {
			e.preventDefault();
			e.returnValue = '';
		};
		if (active) addEventListener('beforeunload', preventDefault);
		return () => removeEventListener('beforeunload', preventDefault);
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
	goBack(steps = 1) {
		if (canNavigate) history.go(steps * -1);
	},
};

const Router = () => {
	const route = useBus(routeStore);
	if (!route) return null;
	return createElement(route.layout, null, createElement(route.component));
};

export default Router;

// Initialize the link handler
document.addEventListener('click', e => {
	if (e.metaKey || e.ctrlKey || e.defaultPrevented) return;

	const link = e.composedPath().find(el => el.tagName === 'A');
	if (link) {
		if (link.target === '_blank') return;
		if (link.hostname === location.hostname) {
			e.preventDefault();
			navigate(link.href);
		}
	}
});