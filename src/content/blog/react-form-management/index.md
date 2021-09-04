---
layout: post
title: "Form Management in React"
description: ""
author: "John Paul"
date: "2019-09-14"
tags: ["react", "javascript"]
---

Forms are the lingua franca of getting external data from users into out
applications. The are different from other html elements in that they naturally
maintain state. However, we may want to keep track of the information gathered
from forms in our JavaScript code as this may be more convenient.

This is usually achieved using a technique called controlled components. We
basically maintain the state from forms in our components rather than have the
forms do this themselves. This ensures we have the so called **single source of
truth** in our components by having all the state data in one place. This is
done by having a `handleChange` function that will set the component state
whenever a user interacts with the input. The `input` fields are given an
`onChange` event that responds to user interaction and call the `handleChange`
handler that transfers form data to component state.

Let's start with an example.

```javascript
const Form = () => {
  const [inputValue, setInputValue] = useState("")

  const changeHandler = event => {
    setInputValue(event.target.value)
  }

  return (
    <div className="App">
      <form>
        <label>
          Favorite Ice Cream:
          <input type="text" onChange={changeHandler} />
        </label>
      </form>
    </div>
  )
}
```

The `Form` component shown above ensures that the component state stays in sync
with the input data.

To handle multiple inputs, we can use the following naive implementation.

```javascript
import React, { useState } from "react"
import "./App.css"

function App() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const handleNameChange = event => {
    setName(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    console.log(name)
    console.log(password)
  }

  return (
    <div className="App">
      {console.log({ name })}
      {console.log({ password })}
      <form onSubmit={event => handleSubmit(event)}>
        <label>
          Username:
          <input type="text" onChange={event => handleNameChange(event)} />
        </label>
        <label>
          Password:
          <input type="text" onChange={event => handlePasswordChange(event)} />
        </label>
        <button>Submit!</button>
      </form>
    </div>
  )
}

export default App
```

This gets tired pretty quick. What we have, say 20 input fields to keep track
of? A better way would be use an object tha will have the names of the input fields
as keys and their data as values. This would be accomplished as below.

```javascript
import React, { useState } from "react"
import "./App.css"

function App() {
  const [user, setUser] = useState({ name: "", password: "" })

  const handleChange = event => {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  const handleSubmit = event => {
    event.preventDefault()
    console.log(user.name)
    console.log(user.password)
  }

  return (
    <div className="App">
      {console.log(user)}
      <form onSubmit={event => handleSubmit(event)}>
        <label>
          Username:
          <input type="text" onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="text" onChange={handleChange} />
        </label>
        <button>Submit!</button>
      </form>
    </div>
  )
}

export default App
```

Here, we have used the spread operator to create a new object literal with
copies of the original keys and values. We have also used a computed property to
set a new key-value pair for the input data in question and replace its original
data with the current data.

To learn more about managing forms in React, check out [this](https://reactjs.org/docs/forms.html)
article in their docs.
