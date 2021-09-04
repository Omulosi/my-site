---
title: "React ContextAPI"
description: ""
author: "John Paul"
date: "2020-01-06"
tags: ["react"]
---

At the end of this post, you should be able to:

- Describe what the Context API is and the problem it solves
- Provide data to the component tree using a context provider
- Consume data from a context object in nested components

## What is the Context API

In a typical application, state is usually passed down from parent to children
components using props. Some scenarios usually force you to pass props through intermediate
components, which may not necessarily use the prop in question, a situation called prop drilling.
This quickly becomes cumbersome and difficult to scale in large applications.

Such cases arise when:

- You have global data that is shared by many React components e.g locale preference or UI theme.
- You need to pass props deeply nested elements

The Context API is used to solve this problem. It provides a different way for passing
data around components.

Context provides a way to globally share data by doing away with the need for
passing props through intermediate components. This is especially helpful when
the data to be shared needs to be accessible to many components at different nesting
levels.

## Using Context API

Context API allows us to create what is called a `Context Object`.

Creating a `Context Object` is a simple as executing the following code.

```js
import { createContext } from "react"
const ContextObject = createObject()
```

This is all there is to creating a Context Object.

This object provides us with two important components:

- `ContextObject.Provider`
- `ContextObject.Consumer`

The `Provider` component accepts a single prop called `value`. This prop is used to provide
data across the app.

This is how we provide data across the app using the provider component.

```js
# prev code

<ContextObject.Provider value={dataToPassDown}>
	<NestedComponent />
	<AnotherNestedComponet />
</ContextObject.Provider>
```

Any nested component is now able to read the data passed down, no matter how deep it is in the tree.

So, how do we access the data passed to the nested components?

Inside the relevant component, we execute the following code.

```js
// Imports the useContext hook from react
import { useContext } from "react"

// Imports the context object you have already created.
// This is the object from which you'll extract the data passed
// to the Provider using the value prop.
import { ContextObject } from "../contexts"

// Get the data
const myData = useContext(ContextObject)

// Now you are ready to use the data in your component
```

This method uses [React Hooks](https://reactjs.org/docs/hooks-intro.html) to consume data
from the context object.

Another method for consuming data from the context object involves defining a `contextType`
property in a **class component**.

```js
import { ContextObject } from '../contexts';

class NestedComponent extends React.Component {
  static contextType = ContextObject;

  const myData = this.context;
}
```

Here, we define a `contextType` property on a class component and assign to it the
**Context Object**.

We then consume the data provided by the Context Object's Provider using `this.context`.

This method allows to subscribe to only a single context
