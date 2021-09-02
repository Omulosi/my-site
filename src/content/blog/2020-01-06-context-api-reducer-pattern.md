---
layout: post
title: "React ContextAPI and the Reducer Pattern"
description: ""
author: "John Paul"
date: "2020-01-06"
categories: ["react"]
---

Performing logic on data within components becomes more difficult as the amount of data
increases. Consequently, as components grow and deal with larger sets of data,
the storing and transportation of state across the entire application increasingly
becomes more and more cumbersome as well.

At the end of this post, you should be able to understand:

- what reducers are
- why we may have need for using reducers
- how to use the ContextAPI and reducers to manage global state

## What is a Reducer?

At its simplest, a reducer is just a function.

In React, a reducer function returns new state given the current state
and some action to perform. It's API is as so:

```js
;(state, action) => newState
```

The `state` param is the current state that we need to update.

The action is an object which is used to specify how the state should be
updated by the reducer. It has to define a required property called `type`
which specifies what changes will be made to the state by the reducer

Using this `type` property, we can perform conditional state transformations in our
application depending on the type of actions that we dispatch to the reducer.

The action can also take an extra property that may be used to pass extra data
to the reducer. This data may also be used it making state updates.

Structuring the reducer this way allows for a very predictable state management system.

It's important that the reducer not modify the initial state and instead returns
a completely new state object i.e. it should be a pure function with no side effects.

This enforces the property of immutability in our apps. Ensuring that we have a single immutable
state tree where all changes are explicitly handled by actions has several benefits.

For one, it makes it easy to predict how the state tree is going to change based on actions that
are dispatched. It is also easy to predict which action will be dispatched based on some
event or interaction. All this leads to very predictable state management.

Let's see an example of what a typical reducer function may look like.

```js
const initialState = { count: 0 }
const reducer = (state, action) => {
  // we pass in the value we want to look at (action.type):
  switch (action.type) {
    // then we make a "case" for each possible value we expect:
    case "increment":
      return { count: state.count + 1 }
    case "decrement":
      return { count: state.count - 1 }
    // finally, we give a "catch-all" which is just to return state untouched. Never leave this out. There should always be a default:
    default:
      return state
  }
}

reducer(initialState, { type: "increment" })
reducer(initialState, { type: "decrement" })
```

## Why use a Reducer?

Reducers provide one way of dealing with this problem. Combined with context API, reducers
offer an elegant way of managing global state.

Reducers makes it easy to predict how the state tree is going to change based on actions that
are dispatched. They also make it easy to predict which action will be dispatched based on some
event or interaction. All this leads to a very predictable state management.

Reducer functions are the perfect fit for managing changes in state while maintaining the immutability we want in our components.

## Managing state using Reducers

Reducers provide an efficient way of managing complex state.

Before we proceed to how this can be accomplished, let's first look into the `useReducer` hook.

`useReducer` is an alternative to `useState` and is especially preferrable when we have complex
state logic or a lot of state properties in a component.

It accepts a reducer of type `(state, action) => newState` (that we build), as well as an initial state.

```js
const [state, dispatch] = useReducer(reducer, initialState)
```

It then returns the current state and a dispatch method.

The `dispatch` method is used to 'dispatch' an action to our reducer.

Let's make all this concrete with an example.

```js
import React, { useReducer } from "react"

const initialState = { count: 0 }
// Initial count is established

// We will use the same reducer we created in the previous section
function reducer(state, action) {
  switch (action.type) {
    case "INCREASE":
      return { count: state.count + 1 }
    case "DECREASE":
      return { count: state.count - 1 }
    default:
      return state
  }
}

// Create a functional component
function Counter() {
  // Use the useReducer hook by destructuring its two properties: state, and dispatch and pass in the reducer and the initialState to the useReducer function
  const [state, dispatch] = useReducer(reducer, initialState)

  // Return JSX that displays the count for the user
  // Note the two button elements which allow the user to increase and decrease the count.  Each of them contains an onClick event that dispatches the desired action object, with its given type.  Each action, when fired, is dispatched to the reducer and the appropriate logic is applied.
  return (
    <>
      {/* Note, we have access to the current state and the dispatch method from the useReducer hook, so we can utilize them to display the count as well as couple the dispatching of the actions from the appropriate buttons.*/}
      <div className="count">Count: {state.count}</div>
      <button onClick={() => dispatch({ type: "INCREASE" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREASE" })}>-1</button>
    </>
  )
}
```

## Managing global state using Reducers and the Context API

Reducers and the Context API can be used to easily manage global state for the app.

Let's continue with the example from the previous section to see how this can be accomplished.

```js
import React, { useReducer, createContext } from "react"

const initialState = { count: 0 }

// Define the reducer function
function CounterReducer(state, action) {
  switch (action.type) {
    case "INCREASE":
      return { count: state.count + 1 }
    case "DECREASE":
      return { count: state.count - 1 }
    default:
      return state
  }
}

// Create the Context object
const CounterContext = createContext()

const CounterContextProvider = props => {
  // Use reducer to provide a hook for updating state.
  // This hook is what will be passed to the Provider to be consumed
  // by nested components
  const counterHook = useReducer(CounterReducer, initialState)

  return (
    // Pass the counterHook to the Provider
    <CounterContext.Provider value={counterHook}>
      {props.children}
    </CounterContext.Provider>
  )
}

// This is the App level component.
// Wrap the counter component with the CounterContextProvider

const App = props => {
  return (
    <CounterContextProvider>
      <Counter />
    </CounterContextProvider>
  )
}

// Create a functional component
function Counter() {
  // consume value provided by CounterContext. This value is a hook
  // that's destructured to obtain state and a dispatch method
  const counterHook = useContext(CounterContext)
  const [state, dispatch] = counterHook

  return (
    <>
      <div className="count">Count: {state.count}</div>
      <button onClick={() => dispatch({ type: "INCREASE" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREASE" })}>-1</button>
    </>
  )
}
```

In this example, we have created a reducer function for managing state changes called `CounterReducer`.
We then created a context object using the `createContext` function from React.

The `CounterContextProvider` function returns a `CounterContext.Provider` component into which
we pass a `counterHook` for updating state changes. The `counterHook` is created using the `useReducer` hook.
The `useReducer` takes the `CounterReducer` and the initial state and returns two values, state and a dispatch
method. These values are assigned to `counterHook` which get passed as a value to the Provider.

The `Counter` component, which implements the core functionality for the app, is wrapped using
the `CounterContextProvider`. Basically, we're using **composition** to provide global state to
the nested component.

In the `Counter` component, we use the `useContext` hook to consume the data passed using the Provider.
We the destructure it to obtain our counter state and the dispatch function for updating the state.

Using this pattern streamlines the way we use Context and reducers to manage global state.
