import { useState, useEffect } from 'react';

export const split = path => path.split('/').slice(1); // split -> slice is 30% faster

export const parseQueryString = str => Object.fromEntries(new URLSearchParams(str));

export const encodeQueryString = (obj = {}) => {
	const res = new URLSearchParams();
	for (let key in obj) if (obj[key] !== null) res.set(key, obj[key]);
	return res.toString();
};

export const encodeSearchString = (obj) => {
	const qs = encodeQueryString(obj);
	return qs ? '?' + qs : '';
};

export const parsePathParams = (route, pathname) => {
	const parts = split(pathname);
	return route.patterns.reduce((res, pattern, i) => {
		if (pattern.startsWith(':')) {
			const end = pattern.endsWith('?') ? -1 : Infinity;
			res[pattern.slice(1, end)] = parts[i];
		}
		if (pattern === '*') res[i] = parts[i];
		return res;
	}, {});
};

export const createBus = (defaultState) => {
	let listeners = [];
	const ref = {
		state: defaultState,
		update(newState) {
			if (ref.state !== newState) {
				ref.state = newState;
				listeners.forEach(cb => cb(newState));
			}
		},
		on(setState) {
			listeners.push(setState);
			return () => listeners = listeners.filter(fn => fn !== setState);
		},
	};
	return ref;
};

export const useBus = (bus) => {
	const [state, setState] = useState(bus.state);
	useEffect(() => bus.on(setState), []);
	return state;
};
