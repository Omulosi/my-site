---
layout: post
title: "Fundamentals of React Routing"
date: "2019-09-17"
categories: ["react", "javascript"]
---

Single page applications have become all the rage nowadays.
They take the concept of separation of
concerns to a whole new level; the front end and backend are clearly demarcated
and can be developed independently.

Single page applications have necessitated the need for **client side routing**.
This is basically a way for the browser to take care of URL history. When you
click on a link, the request is prevented from going to the server even though
the URL changes. The change in URL triggers a change in state resulting in a
different view being presented to the user. All this is managed by JavaScript.

Modern browsers have better computation capabilities enabling us to do things
that were not possible previously. Such as maintaining state and memory and
using that memory to tell the Browser what to display when a resource is
requested.

When you click a URL, instead of the browser asking for that resource from the
server, JavaScript prevents this. The resource that's already available then
gets rendered out instead. This is made that more efficient and smooth in React
which uses component based architecture.

### The History API

Before proceeding, let's look into the history API that's provided by modern
browsers. This API is what underlies client side routing in single page
applications and provides an abstraction that keeps track of the URLs visited by
a user.

The default behavior in browsers is that if you change a URL, it triggers a
roundtrip to some remote server and a full page refresh. This takes time and
resources, and is especially wasteful when you are navigating to a page that's
substantially similar to the current page.

HTML5 history API lets you tell a browser to change the URL but only download
say half a page (This could be accomplished with ajax). It creates some sort
of illusion. Basically, you would interrupt the navigation, load the part of
the new page that is different and swap in the changed content, then finally
update the browser location bar with the new URL for the current resource on
display.

All this happens without really navigating to the new page or doing a full page
refresh. But since the page has a a similar look to what the new page would have
anyway, and a similar URL, the user never notices the difference.

## React Router

Well, what would all this have to do with React? A lot, it turns out.
The history API is what underlies some of the core functionality of
React Router.

We are going to investigate how React Router works using a simple example.
Hopefully, by the end of this post of you will have a great
understanding of how to accomplish routing in your react app, besides
getting a general feel for the inner workings of
[React Router](https://reacttraining.com/react-router/web/api/Switch).

### Getting started

To install react router, run the following command.

```
npm install react-router-dom
```

This assumes you already have a react app. The quickest way to create one is to
use the [create react app](https://github.com/facebook/create-react-app),
proposed by Facebook.

To use react router, import it as follows.

```
import { BrowserRouter as Router } from "react-router-dom"
```

Then use it as your base component to wrap your entire app.

```javascript
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
)
```

Now every time you register a router, a `history` and `match` object are
automatically passed to it as props. Only the routes will receive these special
props, even though you've wrapped your entire app with `BrowserRouter`.

After doing this, you need to set up your routes using the `Route` component.
This is imported using the following expression.

```javascript
import { Route } from "react-router-dom"
```

The `Route` component lets us specify what components will be mounted when we
navigate to a specfic route. For example, to mount an `About` component when we
visit an `/about` url, the following expression is used.

```javascript
<Route path="/about" component={About} />
```

To exactly match a specific path such that the corresponding component only
gets rendered when a URL matches it exacly, the `exact` prop is used.

```javascript
<Route exact path="/" component={Home} />
```

In traditional server-side routing, we normally use **anchor** tags to point to
a resource. In client side routing, we cannot use this method. Anchor tags by
default request resources from a server. React provides a `Link` component in
lieu of the anchor tag. This is how it's used.

```javascript
import { Link } from "react-router-dom"

;<Link to="/">Home</Link>
```

#### Dynamic routing

Dynamic routes have an element/section that is not static, and that changes
depending on the resource a user wants. For example, requesting a specific user
resource using a user ID. Dynamic routes are prepended by a colon, `:`.

```javascript
<Route path="/users/:userID" component={User} />
```

Any component mounted via the `Route` component will receive a prop called
`match`. This match object is what is used to access the paramter that's passed
in from the URL. This is accomplised as follows.

```javascript
const userID = props.match.params.userID
```

The above code would be located in the component that was mounted using the
dynamic URL as the path to be matched. A common way of how this is done is to
invoke the expression in a `useEffect` hook.

```javascript
useEffect(() => {
  const id = props.match.params.userId
  // do something with the id
}, [props.match.params.userId])
```

Check out [this pen](https://codesandbox.io/s/o4nomn5p49) for a more complete
example.

### Render props

The `Route` component has a prop called `render` which provides a way to pass
extra props/data to the components pointed to by the Route. The render prop takes a
function that returns a component that'll be rendered when a URL matches the
Route's path.

Let's see an example to make all this concrete.

```javascript
<Route
  path="/some/path"
  render={props => (
    <MyComponent {...props} someProp={someData} anotherProp={anotherData} />
  )}
/>
```

The data that you may want to pass to your "render prop" component would
normally come from an API.

### Navigating using the built-in history object

There will usually be instances when we need to load different routes or
components in response to events other than the user clicking a link e.g.
navigating to a new page after a promise has resolved and new data is available.

This is accomplished using the `history` prop passed to components by `Route`.

Look at the following example:

```javascript
function Home(props) {
  return (
    <div className="view">
      <h1>Home Component</h1>
      <p>This is the Home page.</p>
      <button onClick={greet}>Greet Luke</button>
    </div>
  )

  function greet() {
    props.history.push("/greet/Luke")
  }
}
```

The `greet` function provides another way, other than using the `Link`
component, to navigate to the `/greet/Luke` route. Both would have the same
effect i.e. causing the `Route` component whose path points to `/greet/Luke` to
mount the appropriate component.
