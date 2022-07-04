import { useState, useEffect } from 'react';

export const split = path => path.split('/').slice(1);

export const parseQueryString = str => Object.fromEntries(new URLSearchParams(str));

export const encodeQueryString = (obj = {}) => {
	const res = new URLSearchParams();
	for (let key in obj) res.set(key, obj[key]);
	return res.toString();
};

export const encodeSearchString = (obj) => {
	const qs = encodeQueryString(obj);
	return qs ? '?' + qs : '';
};

export const parsePathParams = (route, pathname) => {
	const parts = split(pathname);
	return route.patterns.reduce((res, pattern, i) => {
		if (pattern.startsWith(':')) res[pattern.slice(1)] = parts[i];
		return res;
	}, {});
};

export const createBus = (defaultState) => {
	let listeners = [];
	const ref = {
		state: defaultState,
		update(newState) {
			if (ref.state === newState) return;
			ref.state = newState;
			listeners.forEach(cb => cb(newState));
		},
		use() {
			const [state, setState] = useState(ref.state);
			useEffect(() => {
				listeners.push(setState);
				return () => listeners = listeners.filter(fn => fn !== setState);
			}, []);
			return state;
		},
	};
	return ref;
};