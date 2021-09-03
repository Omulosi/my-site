---
title: "Python Decorators"
description: ""
author: "John Paul"
date: "2018-11-10"
tags: [python, programming]
---

Before embarking on this cool topic of **python decorators**, let's first talk
about the concept of **higher order functions**.

In python, functions are treated as **first class objects**. This simply means
that they can be passed in as parameters, they can act as return values in other
functions, they can be defined inside other functions, they can even be assigned
to variables besides their traditional role as a means of abstraction.

Higher order functions are functions that manipulate other functions. They
accept other functions as arguments, can have other functions defined in their
local environments and can also return other functions. Treating functions as
first class objects is what makes all this possible. Let's look at some
examples to make all this concrete.

```python
# passing functions as arguments
def doTwice(f, x):
  """
  Takes a function f and applies it twice.
  >>> doTwice(square, 2)
  16
  """
  return f(f(x))

# Returning functions as values
def doTwiceMaker(f):
  """
  A function that returns a function

  >>> twosquare = doTwiceMaker(square)
  >>> twosquare(2)
  >>> 16

  same as below
  >>> doTwiceMaker(square)(2)
  >>> 16
  """
  return lambda x: f(f(x))

 # Nested definitions of functions
 def doTwiceMaker(f):
   """
   Function defined inside another function.
   """
   def twoF(x):
     return f(f(x))
   return twoF
```

We can see from the examples demonstrated above that functions can be passed
in as parameters, returned as values or defined inside other functions.

Let's examine the third example which has a nested function definition in a
little more detail. Here, the local `def` statement only affects the current
local scope of the function in question (doTwiceMaker). The `twoF` function
will only be in scope while `doTwiceMaker` is being evaluated.

The locally defined `twoF` function also has access to the **name bindings**
in the scope in which it is defined (i.e. the `doTwiceMaker` function). Hence,
the variable `f` referenced in its body refers to the name `f` which is a
formal parameter of the `doTwiceMaker` function, its parent. In general,
nested function definitions have access to names that are defined in their
parent functions, including their formal parameters
( the vice-versa scenario doesn't apply though).
This discipline of sharing names among nested definitions is called **lexical
scoping**.

**Inner functions will always have access to the names in the
environment where they are defined, not where they are called**. You should
always remember this.

Now that we have covered most of what you will need to understand
**decorators**, jump right in.

### Python Decorators

Simply put, a python decorator is a function that takes another function as
a parameter and adds extra functionality to it. In a way, it is a type
of higher order function. This function is basically used to "wrap" other
functions. It takes in a **function as input** and returns a **new function** that
pre-processes the inputs or post-processes the outputs of the original
function.

Say you have a stand alone function that need not be modified. To
extend its functionality, just pass it to the decorator. The decorator
will then return a new function in place of the original one
with the desired functionality added.

For example, suppose you want to print the type of the output that a function
returns. We can define a decorator that adds this functionality.

```python
def typePrinter(func):
  """ A decorator for printing the type of output a function returns."""
  def wrapper(*args, **kwargs):
    output = func(*args, **kwargs)      # calls the original decorated function
    print("Output type:", type(output)) # process before finishing
    return output                       # Return function output
  return wrapper
```

The outer function, `typePrinter` returns a new function `wrapper`. Since
wrapper accepts \*args and \*\*kwargs as arguments, the input function `func`
could accept any number of positional or key-word arguments.

Let us now apply our decorator to a function.

```python
def mul(a, b):
  return a * b

# Apply the decorator to mul function
mul = typePrinter(mul)
```

We have defined a function `mul` that returns the product of two inputs.
Thereafter, we have called the `typePrinter` decorator, passing in `mul` as a
paramter. The return value of this decorator call is again assigned to a
variable called mul. Note that this particular **mul** does not reference the
original function. It points to the new function returned by the decorator.
The new function is basically the wrapper that was defined in the decorator,
with its **func** value pointing to the original **mul** that was passed to
the decorator call.

Now calling `mul` actually calls `wrapper`, which then calls the original
`mul`.

```python
>>> mul(3, 4)
Output type: <class 'int'>
12
>>> mul(3.0, 4.0)
Output type: <class 'float'>
12.0
```

The decorator pattern is so common that it has a special syntax. To apply a
decorator to a function, we can simply tag the function's definition with an
**@** symbol and the decorator name. The previous code can then be expressed more
succintly as shown below.

```python
#
# Apply the decorator. This is similar to:
# mul = typePrinter(mul)
#
@typePrinter
def mul(a, b):
  return a * b

```

Let's look at another example. This time, we are going to use a decorator to
print how long it takes a given function to run.

```python
import time

def timer(func):
  def wrapper(*args, **kwargs):
    start = time.time()
    result = func(*args, **kwargs)
    print('Time to run: '.format(time.time() - start))
    return result
  return wrapper

# Usage
@timer
def double(x):
  return 2 * x

# Results
>>> double(2)
Time to run: 3.814697265625e-06
4

```

This decorator creates a function called wrapper that adds new functionality to
the original function without modifying it.

In summary, a decorator is just a normal function. It takes a function as a
parameter and when called, it returns a different function with some added
functionality.
