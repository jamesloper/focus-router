<center>
<img src="https://jamesloper.com/assets/focus.png" height="92" alt="Focus Router"/>
</center>

**This router is the most golfed router ever made, but it's also no slouch!** Focus Router is used across all my companies (and one has multi-million dollar revenue), and is in use in 4 personal projects.

# The Focus Router Mission

While other routers have `<Route/>`, focus-router is a 100% static router. This means routes can be defined outside of React, and this provides some excellent advantages.

Here is an example of a simple React app which has a Home Page route, demonstrating the radical simplicity and focus of focus-router.

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import Router, { defineRoute } from 'focus-router';

defineRoute('HomePage', '/', () => (
  <div>Home Page</div>
));

createRoot(document.getElementById('root')).render(<Router/>);
```

Aside from simplicity, focus router has a better feature set than React Router (55KB), yet is smaller than Wouter (1.5KB). Both suffer from a lack of focus (on the right things), which is why this router exists!

# Opinionated, Thorough and Handy

1. *Opinionated:* Automatically binds `<a>` tags.
2. *Thorough:* Supports disabling navigation with `useUnsavedChanges()`
3. *Handy:* You can instantly swap a `useState` for `useParam` or `useQueryParam` to move the state to history-backed global state.

# Install

```bash
npm install focus-router
```

# Documentation

``` javascript
import Router, { 
  defineRoute,
  navigation, 
  useQueryParam, 
  useParam, 
  useRouteName, 
  usePath,
  useUnsavedChanges,
  createLink,
} from 'focus-router';
```

## `defineRoute(name, path, component, layout)`

```javascript
import { defineRoute } from 'focus-router';
```

You can put a bunch of these next to each other to define all the routes. You can put these at the root level, I like to put them in App.js (CRA) or main.js (Meteor).

| Name      | Type      | Description                                                                                                  |
|-----------|-----------|--------------------------------------------------------------------------------------------------------------|
| name      | String    | A unique name for the route. Can be passed as the first argument to `navigation.go()`                        |
| path      | String    | A pattern to be used to match the requested route name. Very similar to path-to-regex but without the regex! |
| component | Component | React Component to render (not React element)                                                                |
| layout    | Component | Component to wrap the component in                                                                           |

## `<Route/>`

This component will simply render the component for whichever route is active.

Here is an example app!

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import Router, { defineRoute } from 'focus-router';
import Home from './imports/pages/Home';
import Login from './imports/pages/Login';

defineRoute('Home', '/', Home);
defineRoute('Login', '/login', Login);

const App = () => (
  <div>
    <h1>Hello World</h1>
    <Router/>
  </div>
);

createRoot(document.getElementById('root')).render(<App/>);
```

## `createLink(routeName, params, queryParams)`

``` javascript
import { createLink } from 'focus-router';'
```

Not generally needed, but it returns a URL that can be navigated to. This can be useful to create a dynamic A tag, or to dynamically go to different places depending on some user actions. `params` and `queryParams` are encoded within the string.

- `routeName` *(String)* must match a route name from a `defineRoute()`.
- `params` *(Object, optional)* params to be placed into the path specified in the route matching the route name
- `queryParams` *(Object, optional)* params to be placed in the `?` at the end the URL

## `useRouteName()`

``` javascript
import { useRouteName } from 'focus-router';'
```

Returns the name *(String)* of the currently presented route.

## `useUnsavedChanges(active, callback)`

``` javascript
import { useUnsavedChanges } from 'focus-router';'
```

- `active` *(Boolean, default = true)* will cause navigating away from the current URL (such as clicking a link or using the back button) to be ignored. When the stack is exhausted, the browser's native Save Changes modal will be presented.
- `callback` *(Function, optional)* is called when an action has been prevented.

## `navigation`

``` javascript
import { navigation } from 'focus-router';'
```

## `navigation.go(target, params, queryParams, opts)`

- `target` *(String)* may be a path or a route name to navigate to. If it begins with a slash, it is considered a path, and will be navigated to without care as to params or queryParams. If it is a route name, a path will be formed from the route name, params, and queryParams internally and then navigated to.

- `opts` *(Object)* are some navigation options, which are `replaceState` (defaults to false) and `scrollToTop` (defaults to true).

    - `{replaceState: true}` will replace the state, instead of adding to the state history.
    - `{scrollToTop: false}` will maintain the scroll position across navigations.

## `navigation.setParams(params, opts)`

Shortcut for `navigation.go`, only changes the params *(Object)*.

## `navigation.setQueryParams(params, opts)`

Shortcut for `navigation.go`, only changes the query params *(Object)*.

## `useParam(key, defaultValue)`

``` javascript
import { useParam } from 'focus-router';'

const [selected, setSelected] = useParam('selected');
```

## `useQueryParam(key, defaultValue)`

``` javascript
import { useQueryParam } from 'focus-router';'

const [search, setSearch] = useQueryParam('search');
```

## Bonus Utils

These handy utils are there if you need them, only because focus router needs them internally.

```javascript
import { 
  encodeQueryString, 
  encodeSearchString, 
  parsePathParams, 
  createBus, 
} from 'focus-router/util';
```
