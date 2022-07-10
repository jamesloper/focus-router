<p align="center">
<img src="https://jamesloper.com/assets/focus.png" height="92" alt="Focus Router"/>
</p>

**This router is the most golfed router ever made, and it's no slouch!** Focus Router is used across all my companies (and one has multi-million dollar revenue). Focus Router's goal is to be opinionated, thorough, and handy.

## About

While other routers have routes defined in `<Route/>` tags, Focus Router routes are be defined outside of React, and this provides some excellent advantages.

## Example

Here is an example of a simple React app which has a Home Page route, demonstrating the focus of Focus Router.

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

You can put a bunch of these next to each other to define all the routes. You can put these at the root level, I like to put them in App.js (CRA) or main.js (Meteor). Focus Router will prioritize higher routes first when matching.

```javascript
defineRoute(name, path, component, layout);
```

| Name      | Type                   | Description                                                                                                                          |
|-----------|------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| name      | String *(Required)*    | A unique name for the route. Can be passed as the first argument to `navigation.go()`                                                |
| path      | String *(Required)*    | A pattern to be used to match the requested route name. Similar to path-to-regex but without the regex! For example "/blog/post/:id" |
| component | Component *(Required)* | Component to render                                                                                                                  |
| layout    | Component *(Optional)* | Component to wrap the component with                                                                                                 |

## Router React Component

```javascript
import Router from 'focus-router';
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

## Navigation

``` javascript
import { navigation } from 'focus-router';
```

``` javascript
navigation.go(target, params, queryParams, opts)
```

| Prop     | Type                | Description                                                                                                                                                                                                                                                                                      |
|----------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `target` | Boolean, (Optional) | Can be a path or a route name to navigate to. If it begins with a slash, it is considered a path, and will be navigated to without care as to params or queryParams. If it is a route name, a path will be formed from the route name, params, and queryParams internally and then navigated to. |
| `opts`   | Object, (Optional)  | Navigation options, which are `replaceState` (defaults to false) and `scrollToTop` (defaults to true).                                                                                                                                                                                           |

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
import { useParams } from 'focus-router';
```

Simply returns all the params in the current path as an object.

``` javascript
import { useParam } from 'focus-router';
```

```javascript
useParam(key, defaultValue)
```

| Argument       | Type               | Description                                          |
|----------------|--------------------|------------------------------------------------------|
| `key`          | String, (Required) | The name of the param to extract from the URL        |
| `defaultValue` | String, (Optional) | Value to return if the key is not present in the URL |

#### Example

```javascript
const id = useParam('id', null);
```

## URL Query Params

``` javascript
import { useQueryParam } from 'focus-router';
```

#### Example

```javascript
const search = useQueryParam('search', '');
```

| Argument       | Type               | Description                                              |
|----------------|--------------------|----------------------------------------------------------|
| `key`          | String, (Required) | The name of the param to extract from the end of the URL |
| `defaultValue` | String, (Optional) | Value to return if the key is not present in the URL     |

## Create Link

``` javascript
import { createLink } from 'focus-router';
```

Returns a URL that can be navigated to. This can be useful to create a dynamic `<a>` tag, or to dynamically go to different routes. `params` and `queryParams` are encoded within the string.

| Argument       | Type               | Description                                                                      |
|----------------|--------------------|----------------------------------------------------------------------------------|
| `routeName`    | String, (Required) | must match a route name from a `defineRoute()`.                                  |
| `params`       | Object, (Optional) | params to be placed into the path specified in the route matching the route name |
| `queryParams`  | Object, (Optional) | params to be placed after a `?` at the end the URL                               |

## Use Route Name

``` javascript
import { useRouteName } from 'focus-router';
```

Returns the name *(String)* of the currently presented route.

## Prevent Navigation

``` javascript
import { useUnsavedChanges } from 'focus-router';
```

Using this will cause navigating away from the current URL (such as clicking a link or using the back button) to be ignored. When the stack is empty, the browser's native Save Changes modal will be presented.

| Prop          | Type                 | Description                                    |
|---------------|----------------------|------------------------------------------------|
| `active`      | Boolean, (Optional)  | Turns the effect on or off                     |
| `callback`    | Function, (Optional) | Called when any user action has been prevented |

## Bonus Utils

These handy utils are there if you need them, only because focus router needs them internally.

```javascript
import { 
  encodeQueryString, 
  encodeSearchString, 
  parsePathParams, 
  createBus, 
  useBus
} from 'focus-router/util';
```
