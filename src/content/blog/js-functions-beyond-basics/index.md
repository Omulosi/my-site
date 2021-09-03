---
title: "JavaScript functions: Beyond the Basics"
description: ""
author: "John Paul"
date: "2019-09-08"
categories: ["javascript"]
---

Let's talk about functions. Not the easy peasy stuff that you can grasp in a few
hours or minutes. This post will delve a little deeper into the concept of
functions, from the perspective of the JavaScript programming language.

## The Basics

Functions are an abstraction, a way to manage complexity by encapsulating
related logic and naming it for later reuse. Every language defines a way of
creating functions.

Functions in JavaScript, just like in any other language, have their own local
scope. This is a local environment specific to a given function where all
computation takes place.

There are three main ways of creating functions in
JavaScript. Let's review them.

### Function declaration method

Below is a function declaration:

```javascript
function add(x, y) {
  return x + y
}
```

### Function expression

In JavaScript, we can define functions as expressions.

```javascript
const add = function (x, y) {
  return x + y
}
```

### Arrow functions

Lastly, we have arrow functions.

```javascript
const add = (x, y) => {
  return x + y
}
```

Arrow functions are the new kid on the block. They have their own peculiarities
which we'll look into later.

`x` and `y` are the parameters to the functions.

### Callling a function

To call a function, we use the following expression:

```javascript
const sum = add(2, 3)
```

Let's go through what happens when the you run this expression.

First, a binding is created in the local environment/scope of the function that
associates each named parameter with the corresponding value. Here, `x` will be
bound to `2` and `y` to `3`. A binding is simply a way to associate a name to a
value. The `x` and `y` variables are internal to the function, they get defined
when you call the function and are initialized with the values that you pass in
as parameters.

Finally, when the return expression gets executed, `x` is replaced by the value
it points to. Same for `y`. A result is calculated and returned to the scope where
the function was called. This would be the global scope for this particular
example. The result is assigned to the sum variable.

## Beyond the basics

In this section, I'm going to present a series of examples that highlight particular
concepts in functions, ask you to guess how the execution would proceed, and try
to explain as simply as I can what's going on. I find this method to be more
instructive when I'm trying to learn something new. Learning by doing and taking
things apart to discover their essence and understand them bottom up.

Let's start with a simple one.

```javascript
function jump(y) {
  y = null
}

let x = 10
jump(x)
console.log(x)
```

**What is x?**

If you think it's the number 10, you are absolutely right. `jump` cannot change
the value of x. When called, the value of x is what is passed to the function,
not the reference. So x will keep pointing to its original value (10),
and y will now have the value of 10. This is what's referred to as passing
parameters by value. It's usually what happens when you pass primitives to
functions (as opposed to objects). This is not peculiar to JavaScript alone, but
is common in most programming languages.

Here is another example.

```javascript
const add = (x, y) => x + y

function addf(first) {
  return function (second) {
    return first + second
  }
}

// addf(2)(3) => 5
```

Here, we have defined a function `addf` that takes one parameter, and returns
another function, which takes a second parameter and adds them. It basically
performs addition from two invocations.

In JavaScript, we can define functions inside other functions or pass them as
values, just like we would some primitive value.

When you first call `addf` passing to it the number 2, say, a new function is
returned. When you again call this new function passing to it 3 as a paramter,
the sum of the first value you initially passed to `addf` and the value you
passed to the returned function defined inside `addf`, gets calculated and
returned.

JavaScript functions keep a memory of the scope where they were defined.
They thus have access to all variables that are defined in that scope or in the
parent of that scope or in the parent of the parent of that scope...you get the
picture.

In this example, the function defined inside `addf` has access to the scope of
`addf`, **even if it is called outside of this scope**. This is what is called
**Lexical scope**. Lexical scope simply means that locally defined functions
have access to the name bindings in the scope in which they are defined. Inner
functions will have access to the names in the environment where they are
defined (**not where they are called**).

For more, check out [this excellent article](https://javascript.info/closure).

Yet another example.

```javascript
const add = (x, y) => x + y
const mul = (x, y) => x * y

function liftf(binary) {
  return function (first) {
    return function (second) {
      return binary(first, second)
    }
  }
}

// Invocations
const addf = liftf(add)
addf(3)(4) // => 7
liftf(mul)(5)(6) // => 30
```

The `liftf` function takes a binary function(takes two params) and makes it
callable with two invocations as shown in the examples. It takes a binary
function and returns a function which takes the first argument which returns
a function that takes the second argument which returns the result of passing
the first and second argument to the binary function.

This example can also be explained using similar principles as the previous
ones. It's all about lexical scopes and closures.

When you initially invoke `liftf` passing to it the `add` binary function, it
returns the first nested function which gets assigned to `addf`. Calling `addf` and
passing it the first argument (3) returns another function, the innermost
nested function. This innermost function has only one expression. When called
with the second argument (4), the return expression gets executed. The first and
second arguments are passed to the add binary function and their sum is
returned. The innermost function accesses the first argument by looking inside
out. This is how variables are resolved in JavaScript. The initial search starts
in the current scope, and if the variable is defined there, the search goes one
step higher to the immediate parent scope, and so on and so forth till the value
of the variable is resolved. An error results if the variable is not defined in
any of environments/scopes that get searched.

Still some more.

Let's define a function called curry that takes a binary function and an
argument and returns a function that can take a second argument.

```javascript
function curry(binary, first) {
  return function (second) {
    return binary(first, second)
  }
}

// Invocations
let add2 = curry(add, 2)
add2(5) // --> 7

curry(mul, 5)(6) // --> 6
```

The `curry` function takes multiple arguments and returns a function that takes
a single argument. The first argument that's passed to `curry` will be used
every time we call the returned function. The nested function has access to the first
argument passed to the function that encloses it. This is closure. We have
already touched on it.

The process of transforming a function with multiple arguments into multiple
functions that take a single argument is called **currying**. For example `f(a, b, c)` being transformed into `f(a)(b)(c)`.

Check out the example below.

```javascript
const add = (x, y) => x + y

function curry(f) {
  return function (a) {
    return function (b) {
      return f(a, b)
    }
  }
}

// Invocations
const curryAdd = curry(add)
curryAdd(1)(2) // --> 3
```

This example follows the principles we have already discussed.

You can find more advanced implementations in libraries such as [lodash](https://lodash.com/docs#curry).
