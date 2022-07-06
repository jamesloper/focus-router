<center>
<img src="https://jamesloper.com/assets/focus.png" height="92" alt="Focus Router"/>
</center>

**This router is the most golfed router ever made, but it's also no slouch!** Focus Router is used across all my companies (and one has multi-million dollar revenue), and is in use in 4 personal projects. Focus Router's goal is to be opinionated, thorough, and handy.

# The Mission

While other routers have routes defined in `<Route/>` tags, Focus Router routes are be defined outside of React, and this provides some excellent advantages.

Here is an example of a simple React app which has a Home Page route, demonstrating the radical simplicity and focus of Focus Router.

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import Router, { defineRoute } from 'focus-router';

defineRoute('HomePage', '/', () => (
  <div>Home Page</div>
));

createRoot(document.getElementById('root')).render(<Router/>);
```

Aside from simplicity, Focus Router has a better feature set than React Router (55 KB), yet is smaller than Wouter (1.5 KB). Both suffer from a lack of focus (on the right things), which is why this router exists!

1. No need to use `<Link/>`. Just use plain `<a>`tags
2. Swap `useState` for `useParam` or `useQueryParam` to use a browser history-backed global state
3. Supports an omission from nearly all libraries, disabling navigation with `useUnsavedChanges()`
4. Minimal re-renders and maximum micro-optimization

# Install

```bash
npm install focus-router
```

# Documentation

Let's jump in to documentation by going over the most important function first.

## Route Definition

```javascript
import { defineRoute } from 'focus-router';
```

```javascript
defineRoute(name, path, component, layout);
```

You can put a bunch of these next to each other to define all the routes. You can put these at the root level, I like to put them in App.js (CRA) or main.js (Meteor). Focus Router will prioritize higher routes first when matching.

| Name      | Type                   | Description                                                                                                                          |
|-----------|------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| name      | String *(Required)*    | A unique name for the route. Can be passed as the first argument to `navigation.go()`                                                |
| path      | String *(Required)*    | A pattern to be used to match the requested route name. Similar to path-to-regex but without the regex! For example "/blog/post/:id" |
| component | Component *(Required)* | Component to render                                                                                                                  |
| layout    | Component *(Optional)* | Component to wrap the component with                                                                                                 |

## Render the active route

```javascript
import Router from 'focus-router';
```

```javascript
<Route/>
```

This component will simply render the component for whichever route is active.

Putting these two together, here is an example app!

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import Router, { defineRoute } from 'focus-router';

const Home () => {
  return <div>home</div>
};

const About () => {
  return <div>about</div>
};

defineRoute('Home', '/', Home);
defineRoute('About', '/about', About);
defineRoute('NotFound', '*', () => {
  return <div>not found</div>
});

const App = () => (
  <div>
    <h1>Hello World</h1>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/test">Not Found</a>
    <Router/>
  </div>
);

createRoot(document.getElementById('root')).render(<App/>);
```

## Create Link

``` javascript
import { createLink } from 'focus-router';
```

```javascript
createLink(routeName, params, queryParams)
```

Not generally needed, but it returns a URL that can be navigated to. This can be useful to create a dynamic A tag, or to dynamically go to different places depending on some user actions. `params` and `queryParams` are encoded within the string.

| Argument       | Type               | Description                                                                      |
|----------------|--------------------|----------------------------------------------------------------------------------|
| `routeName`    | String, (Required) | must match a route name from a `defineRoute()`.                                  |
| `params`       | Object, (Optional) | params to be placed into the path specified in the route matching the route name |
| `queryParams`  | Object, (Optional) | params to be placed in the `?` at the end the URL                                |

## Use Route Name

``` javascript
import { useRouteName } from 'focus-router';
```

``` javascript
useRouteName()
```

Returns the name *(String)* of the currently presented route.

## Prevent Navigation

``` javascript
import { useUnsavedChanges } from 'focus-router';
```

``` javascript
useUnsavedChanges(active, callback)
```

| Prop          | Type                 | Description                                                                                                                                                                                               |
|---------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `active`      | Boolean, (Optional)  | will cause navigating away from the current URL (such as clicking a link or using the back button) to be ignored. When the stack is exhausted, the browser's native Save Changes modal will be presented. |
| `callback`    | Function, (Optional) | is called when an action has been prevented                                                                                                                                                               |

## Navigation

``` javascript
import { navigation } from 'focus-router';
```

``` javascript
navigation.go(target, params, queryParams, opts)
```

| Prop     | Type                | Description                                                                                                                                                                                                                                                                                     |
|----------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `target` | Boolean, (Optional) | can be a path or a route name to navigate to. If it begins with a slash, it is considered a path, and will be navigated to without care as to params or queryParams. If it is a route name, a path will be formed from the route name, params, and queryParams internally and then navigated to. |
| `opts`   | Object, (Optional)  | navigation options, which are `replaceState` (defaults to false) and `scrollToTop` (defaults to true).                                                                                                                                                                                          |

- `{replaceState: true}` will replace the state, instead of adding to the state history.
- `{scrollToTop: false}` will maintain the scroll position across navigations.

``` javascript
navigation.setParams(params, opts)
```

Shortcut for `navigation.go`, only changes the params *(Object)*.

``` javascript
navigation.setQueryParams(params, opts)
```

Shortcut for `navigation.go`, only changes the query params *(Object)*.

## URL Params

``` javascript
import { useParam } from 'focus-router';
```

```javascript
useParam(key, defaultValue)
```

#### Example

```javascript
const [selected, setSelected] = useParam('selected');
```

## URL Query Params

``` javascript
import { useQueryParam } from 'focus-router';
```

#### Example

```javascript
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
