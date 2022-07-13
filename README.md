```bash
npm install focus-router
```

<p>
<img src="https://jamesloper.com/assets/focus.png" height="110" alt="Focus Router"/>
</p>

**A router for React.** This is the most golfed router ever made, and it's no slouch! Focus Router is used across all my companies (one with multi-million dollar revenue). Focus Router's goal is to be opinionated, thorough, and handy.

## About

Most React routers have routes defined in `<Route/>` tags, however I have come to consider this an overuse of Components. Routes are global and to mesh with this finding, I started writing Focus Router with route definitions made outside of React. Focus Router began to basically write itself, resulting in some very clean code.

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

Aside from simplicity, Focus Router has a fuller feature set than React Router (55 KB) which suffers from a lack of focus, which is why this router exists!

1. No need to use `<Link/>`. Just use plain `<a>`tags
2. Swap `useState` for `useParam` or `useQueryParam` to use a browser history-backed global state
3. Supports an omission from nearly all routers-- disabling navigation with `useUnsavedChanges()`
4. Minimal re-renders and maximum micro-optimization

# Documentation

Let's jump in to documentation by going over the most important function first.

## Route Definition

```javascript
import { defineRoute } from 'focus-router';
```

You can put a bunch of these next to each other to define all the routes. You can put these at the root level, even in the same file as `createRoot`. Focus Router will prioritize higher routes first when matching.

```javascript
defineRoute(name, path, component, layout);
```

| Name      | Type                   | Description                                                                                                        |
|-----------|------------------------|--------------------------------------------------------------------------------------------------------------------|
| name      | String *(Required)*    | A unique name for the route. Can be passed as the first argument to `navigation.go()`                              |
| path      | String *(Required)*    | A pattern such as `/blog`. Navigating to a URL that looks like this pattern will cause the route to become active. |
| component | Component *(Required)* | A component to render.                                                                                             |
| layout    | Component *(Optional)* | A component to wrap the component in.                                                                              |

You can re-use concepts from other routers based on [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) (eg: React Router, React Navigation and FlowRouter). Although path-to-regexp is not used, the following paths are all still valid when brought forth to Focus Router:

- `"/blog/:postId"`
- `"/search/:term?"`
- `"*"`

## React Component: `<Router/>`

```javascript
import Router from 'focus-router';
```

This will simply render the component for whichever route is active.

### Putting these two together, here is an example app...

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

You can click between routes, use the back button, and navigate to a non-existent page to see the Not Found route.

## Navigation

``` javascript
import { navigation } from 'focus-router';
```

You can use `navigation` to navigate programmatically, such as after receiving data from an API, when the user clicks a button, etc. There are multiple functions to facilitate navigation as follows:

``` javascript
navigation.go(target, params, queryParams, opts)
```

| Argument | Type                 | Description                                                                                                                                                                                                                         |
|----------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `target` | Boolean *(Optional)* | A path or a route name to navigate to. If `target` starts with a slash, it will immediately be navigated to and `params` and `queryParams` are ignored. If target is a `routeName`, a path will be created using all the arguments. |
| `opts`   | Object *(Optional)*  | Navigation options, which are `replaceState` (defaults to false) and `scrollToTop` (defaults to true).                                                                                                                              |

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

| Argument       | Type                | Description                                                     |
|----------------|---------------------|-----------------------------------------------------------------|
| `routeName`    | String *(Required)* | Must match a route name from a `defineRoute()`.                 |
| `params`       | Object *(Optional)* | Params to encode into the path corresponding to the `routeName` |
| `queryParams`  | Object *(Optional)* | Params to encode into the query string                          |

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

| Argument | Type                 | Description                                    |
|----------|----------------------|------------------------------------------------|
| `active` | Boolean *(Optional)* | Turns the effect on or off                     |

## Bonus Utils

These handy utils are there if you need them, only because focus router needs them internally.

```javascript
import { 
  createBus, 
  useBus,
  encodeQueryString, 
  encodeSearchString, 
  parsePathParams
} from 'focus-router/util';
```

*tempus fugit*