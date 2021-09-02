---
title: "Python: Recursive Functions"
description: ""
author: "John Paul"
date: "2018-09-24"
tags: ["python", "programming"]
---

To the uninitiated, recursive functions may seem like stuff of magic. Truth be
told, my first attempt at cracking them was mostly fruitless and quite
frustrating. The trick is to keep at them and to keep practicing. When you
finally 'get them', there is no better feeling.

Let's start at the beginning by reviewing functions. You must first understand that
functions are objects in python. This has important consequences. For one,
you can pass them as parameters, assign them to variables or define them inside
other functions.A function can return another function too!
They are first-class objects, so to speak.

Recursive functions are a special class of functions that call themselves, either
directly or indirectly. Executing the body of such a function may require that the
function be applied multiple times.

### Structure of a Recursive Function

1. One or more base cases, usually the smallest input.
2. One or more ways of reducing the problem, and then solving the
   smaller problem using recursion.
3. One or more ways of using the solution to each smaller
   problem to solve a larger problem.

Lets make everything a bit more concrete by looking at an example. Say you want
to compute the factorial of a number using recursion. A factorial of a number is
simply the number multiplied by increasingly smaller versions of itself till
number one so for example the factorial of 4 will be `4! = 4 * 3 * 2 * 1` (The exclamation after 4 denotes factorial). Computing a factorial is especially amenable to recursive techniques.

The recursive factorial function is as indicated below.

{% highlight python %}
def factorial(n):
if n == 0:
return 1
else:
return n \* factorial(n - 1)
{% endhighlight %}

A general pattern of recursive functions is to use a conditional statement
to demarcate the base case and the recursive case.

In the above code snippet, the body of the function begins with a base case.
The base case represents the behavior of the function when the input is
simplest. In `factorial`, this value is zero and a value of 1 is returned. Some
functions have multiple base cases.

The `else` clause is the recursive part. This part simplifies the original
problem. It does this by reducing it to a simpler version
of itself and extending this solution to the simpler version by using a simple
mathematical operation. Computing the `factorial` of `n - 1` is simpler
than computing the `factorial` of `n`. The solution from the simpler version
of the problem is then simply multiplied by `n` to obtain the solution to
the original problem.

But here is the big question, how do we know that `factorial` is correct? The
answer requires we take a 'leap of faith'. Stop worrying that factorial is
recursive and just assume that it will return the right answer.

All you have to do is first verify the base cases. Are they correct?
Are they exhaustive? Then harness the power of functional abstraction.
Don't concern yourself with all the pesky details of how the function's body is implemented. Just assume that `factorial(n - 1)` is correct and then verify that `factorial(n)` is correct.

In this example, we have reduced one version of a problem to a simpler version
of the same problem, plus some simple operations to obtain a final answer i.e. `factorial(n)` was reduced to `n * factorial(n - 1)`. This is a common pattern
that you will see again and again as you explore recursion further.

We can conceptualize the process of creating a recursive function into the
following three steps.

1. Wishful thinking
2. Decomposition of the problem
3. Identification of the smallest problem that cannot be decomposed.

Wishful thinking means that, given a problem, you assume that you already have
a function that solves a smaller version of the same problem. Now comes the
fun part. You have to come up with a way of using the solution from this smaller
sized problem to obtain the full solution. In this example, we have combined
`factorial(n - 1)` with a set of simple operations to obtain the solution to the
extended problem i.e. `n * factorial(n - 1)`.

It's important to note that this step may require some ingenuity. Develop a
strategy before you jump into coding.

The last step is to consider the smallest sized problem that you can solve
directly. This is the so called base case. It will terminate the recursive calls.

Lets see another example.

Say you want to multiply two numbers, a and b, recursively. Lets define a
function called `mult(a, b)` that solves this problem.

We can reduce this problem to a simpler version of itself by defining another
function `mult(a, b - 1)`. To obtain the solution to the original extended
problem, we combine this solution with a simple set of operations. Given that
`a` multiplied by `b` is simply `a` added `b` number of times, then all we have to
do is add `a` to this smaller version of the problem. The solution then becomes
`a + mult(a, b - 1)`.

For this example, the smallest problem will be when `b` is zero. These will be
the simplest inputs. For this case, the solution will be zero.

Now let's put everything together:

{% highlight python %}
def mult(a, b):
if b == 0:
return 0
else:
return a + mult(a, b - 1)
{% endhighlight %}

Let's look at yet another example.

Suppose we are asked to write a recursive implementation of `summation`, a
function which takes a positive integer `n` and a function `term`. It then
applies term to every number from `1` to `n` inclusive and returns the sum of
the results.

The signature of this function is `summation(n, term)`.

We will follow the steps we enumerated previously. First we are going to bank on
the good ol' **_wishful thinking_** and assume that we have a function of the same
nature that solves a simpler version of our problem.

What would a simpler version of our problem look like? There can only be one
possibility here. Among the function parameters, only `n` can decrease further. `term` is a function and thus won't change. Therefore the solution to the simpler version of our problem becomes `summation(n - 1, term)`. We are
simply assuming that this function will return `term(n-1) + term(n-2) + ...`

Trusting that this solution is correct(_wishful thinking_), we have to find a
way of combining it with some simple operations to obtain the full solution.
From the problem definition, we can easily determine that we need to add
`term(n)` to this solution. Hence the correct solution becomes
`term(n) + summation(n - 1, term)`.

The simplest version of the problem will be when `n` is 1. This determines the
base case. At this point, all we have to do is just return `term(1)`. No
more recursive calls.

The solution we obtain is at once simple and elegant.

{% highlight python %}

def summation(n, term):
"""Return the sum of the first n terms in
the sequence defined by term. Use recursion.
"""
assert n >= 1
if n == 1:
return term(n)
return term(n) + summation(n - 1, term)

{% endhighlight %}

### Summary

We have seen that a recursive function is a function that calls itself in its body, either directly or indirectly. Recursive functions have three important components:

1. Base case(s), the simplest possible form of the problem you're trying to solve.
2. Recursive case(s), where the function calls itself with a simpler argument as part of the computation.
3. Using the recursive calls plus some simple operations to solve the full problem.
