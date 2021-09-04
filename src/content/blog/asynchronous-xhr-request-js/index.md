---
title: "Making Asynchronous JavaScript Requests with XHR"
date: "2019-09-06"
tags: ["javascript", "programming"]
---

AJAX stands for **Asynchronous JavaScript and XML**. It was coined ca. 2005 by
_Jesse James Garret_ when it became a popular technique of using XMLHttpRequest
to fetch data in XML format and modify the current page in place.

Nowadays, AJAX stands for the concept of requesting data asynchronously.
Asynchronous request is when you request for some data and without pausing to
wait for some data, just move on and do something else.

Why was this approach important? You might ask.

In the traditional server-rendered web apps, the client computer makes a request
for a web page. The server then creates and returns the requested page to the
client. Finally the client loads the new page and displays the information.

If a user interacts the page, say to add or remove something by submitting a
form, the cycle starts all over again. Another request is made and the server
returns a totally new page which the client loads and presents to the user
again.

XMLHttpRequest was later introduced to fix this problem. It allowed the browser
to make http requests from JavaScript and update the current page in place
without fetching an entire site from the server. Instead of the synchronous
model of waiting for a whole page, the user interface would update
asynchronously as the user kept working.

## Creating an Asynchronous Request with XHR

Just like how `document` is provided by the JavaScript engine for manipulating
the DOM, the engine also provides a way to make asynchronous requests through an
`XMLHttpRequest` object. This object is created using the XMLHttpRequest
constructor function.

```js
const xhr = new XMLHttpRequest() // Creates an XHMHttpRequest object
```

When an XMLHttpReqeuest is created, nothing happens. This is just an initial
stage. You still have to set it up with events for handling success or failure
and finally the request has to be sent explicitly.

## Handling success

To handle a successful response, we set the `onload` property on the object to a
function that'll handle it. Check out the example below.

```js
function handleSuccess() {
  // this here, points to the XHR object. responseText is a property of the XHR
  // object that contains the response/requested data
  console.log(this.responseText)
}

// Add the onload event to the XHR object

const xhr = new XMLHttpReqeuest()
xhr.onload = handleSuccess
```

## Handling errors

Handling errors is done similarly to handling success. Create a function that'll
handle the error and add it to the object as an `onerror` event.

```js
function handleErrors() {
  console.log("There was an error")
}

xhr.onerror = handleError
```

## Making the request

After creating the XHR object and setting it up with the `onload` and `onerror`
events for handling successful responses or errors respectively, we need to make
the request.

The request is created using the `open` method using the following pattern.

```js
xhr.open(<Method>, <URL>);
```

The method can be one of `GET`, `POST`, `PUT`, or `DELETE`.

You can also optionally include a header with the request. This is done with the
`setRequestHeader`. The `setRequestHeader()` method should be called after
calling `open()`.

```js
xhr.setRequestHeader(<header>, <value>); // syntax for setting request header
```

Finally, send/execute the request using the `send()` method.

```js
xhr.send()
```

It's not pretty, but that's all there is to it.

## Summary

To send asynchronous http requests with JavaScript, follow these steps:

- Create an XHR object with `XMLHttpReqeuest` constructor function.
- Set the http method and url to send the request to using `open`.
- Create a function that will run upon a successful fetch. Use it to set the
  `onload` property.
- Create a function that will run when an error occurs. use it to set the
  `onerror` property.
- Optionally set a request header using the `setRequestHeader` method.
- Send the request using the `send` method.

To use the response, use the `.responseText`. It holds the request for the async
requests response.

That's quite a lot of code for sending a request. Thankfully, there are third
party libraries that have made all this less of a pain. Like `jQuery` or the
`fetch` API or `axios`. Check them out.
