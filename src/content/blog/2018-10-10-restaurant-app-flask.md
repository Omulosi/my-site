---
title: "Restaurant Web Application with Flask"
description: ""
author: "John Paul"
date: "2018-10-10"
categories: ["python", "programming"]
---

In this project, we are going to build a Restaurant web application. This application will display a list of restaurants and their menus. It will provide functionality for adding, deleting or modifying any given restaurant and/or any one of its menu items.

This app will be powered by Python 3 and the [Flask](https://flask.pocoo.org/) framework.

Prerequisites:

- Python - specifically solid understanding of classes, objects and inheritance.
- Minimal SQL
- HTML/CSS

## Project Setup

Time to setup our project and begin building our app.

First create a directory where you will host your application. Let's call it `restaurant_app`.

```
$mkdir restaurant_app && cd restaurant_app
```

Create a virtual environment. We will call it `flask_env`. This folder contains all the necessary executables and an isolated `Python` environment that will ensure all our dependencies and versions will be local to this application, free from interference by any other application.

```
$python3 -m venv flask_env
```

We will then create a package for our application. We will call this package `app`. This package will be located in the `restaurant_app` directory.

```
$mkdir app
$touch app/__init__.py
```

In Python, a package is basically a directory with an `__init__.py` file inside it. Packages can be imported and modules inside the package can be imported too using dot notation. When you import a package, the `__init__.py` file executes and defines a name-space that the package will expose to the outside world.

Packages are a way of organizing code (they make it easier to locate your files), especially in large programs. They also make imports more informative and simplify your module search path.

We will then activate our virtual environment as so:

```
$source flask_env/bin/activate
```

Finally, we install `flask`. In the top-level directory, run:

```
$pip install flask
```

We are now good to go.

Like anything worth doing in life, we have to come up with a plan before embarking on our project. This project is going to follow a variant of iterative development. Iterative development simply means that instead of coding up the entire application in one fell swoop, we are going to do it bit by bit in manageable chunks, testing and debugging at each stage, and adding features cumulatively as we go along.

## Restaurant App

As a first step, we are going to come up with mock ups of all the pages that the application will have. Try to imagine some of the typical scenarios a user will encounter as he/she interacts with the site. Here, you can use any wireframing tool that you prefer or just the good ol' paper and pencil.

The mock-ups should not be anything elaborate. Just come up with a good enough layout that will show what you want to be displayed to the user.

The application will have a total of eight web pages (according to my calculation and preferences, could be more though). We will design a URL for each web page. The URLs and their descriptions are summarized below.

| URL                                               | Description             |
| ------------------------------------------------- | ----------------------- |
| '/restaurants' and '/ '                           | show all restaurants    |
| '/restaurant/new/'                                | create a new restaurant |
| '/restaurant/< rest_id >/edit/'                   | edit a restaurant       |
| '/restaurant/< rest_id >/delete'                  | delete a restaurant     |
| '/restaurant/< rest_id >/menu'                    | show a restaurant menu  |
| '/restaurant/< rest_id >/menu/new'                | create a new menu item  |
| '/restaurant/< rest_id >/menu/< menu_id >/edit'   | edit a menu item        |
| '/restaurant/< rest_id >/menu/< menu_id >/delete' | delete a menu item      |

.

### Routing

Next, we are going to implement our view functions. Here, we will add the routes to all our pages.

In the `__init_._py` file in the `app` package, add the following code:

```python
from flask import Flask

app = Flask(__name__)

from app import routes
```

We have imported the `Flask` class and then created an instance of this class, passing `__name__` as a parameter. This instance is then assigned to the variable `app`. `__name__` refers to the name of the application package. It is used here so that Flask will know from where to look for tempates, static files and so on.

We then import a routes module. This has not yet been defined but we will do so presently.

Create a `routes.py` module in the `app` package. Add the following code to the module.

```python

# app/routes.py

from app import app
from flask import render_template

# view functions

@app.route('/')
@app.route('/restaurants')
def showRestaurants():
    #This page wil show all my restaurants.
    return render_template('restaurant.html', restaurants=restaurants)

@app.route('/restaurant/new')
def newRestaurant():
    # This page will be for making a new restaurant.
    return render_template('newRestaurant.html')

@app.route('/restaurant/<int:restaurant_id>/edit/')
def editRestaurant(restaurant_id):
    # This page will be for editing restaurant
    return render_template('editRestaurant.html')

@app.route('/restaurant/<int:restaurant_id>/delete')
def deleteRestaurant(restaurant_id):
    # This page will be for deleting restaurant
    return render_template('deleteRestaurant.html')

@app.route('/restaurant/<int:restaurant_id>/')
@app.route('/restaurant/<int:restaurant_id>/menu')
def showMenu(restaurant_id):
    # This page is the menu for restaurant
    return render_template('menu.html')

@app.route('/restaurant/<int:restaurant_id>/menu/new')
def newMenuItem(restaurant_id):
    # This page is for making a new menu item for restaurant
    return render_template('newMenuItem.html')

@app.route('/restaurant/<int:restaurant_id>/menu/<int:menu_id>/edit')
def editMenuItem(restaurant_id, menu_id):
    # This page is for editing menu item"
    return render_template('editMenuItem.html')

@app.route('/restaurant/<int:restaurant_id>/menu/<int:menu_id>/delete')
def deleteMenuItem(restaurant_id, menu_id):
    # This page is for deleting menu item %s
    return render_template('deleteMenuItem.html')
```

Create a directory called **templates** and add an html file for each view function as indicated in the code above.

Templates are a way of enforcing separation of concerns in our application. They make it possible to separate the logic of our application from the layout/presentation. Besides, it'd quickly become burdensome to manually generate html from within our Python code. Flask comes already preconfigured with a template engine called [Jinja2](https://jinja.pocoo.org/docs/2.10/) that makes all this pretty straightforward.

The `@app.route()` decorators are used to bind the view functions to the corresponding URLs. Navigating to a given URL will cause the corresponding view function to be executed. Ensure all the routes work before proceeding further.

Check out the templates' code from the projects [github repo](https://Omulosi.github.io).

Some of the templates include forms used to collect information from the user. A flask extension called called `flask-wtf` makes it easy to build forms by abstracting away all the messy HTML code. We can then create a form by defining a class and using class variables to specify the form fields. The form is then instantiated in the view functions and passed to an HTML template where it is rendered.

To learn more about creating forms using the `flask-wtf` extension, check out [this resource](https://www.tutorialspoint.com/flask/flask_wtf.htm).

The code below shows how to define form fields using the `flask-wtf` package.

```python
# app/forms.py

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, RadioField, TextAreaField

class newRestaurantForm(FlaskForm):
    name = StringField("Name")
    submit = SubmitField("Create")

class editRestaurantForm(FlaskForm):
    name = StringField("Name")
    submit = SubmitField("Edit")

class deleteRestaurantForm(FlaskForm):
    submit = SubmitField("Delete")

class deleteMenuForm(FlaskForm):
    submit = SubmitField("Delete")

class addMenuForm(FlaskForm):
    name = StringField("Name")
    price = StringField("Price")
    description = TextAreaField("Description")
    course = RadioField("Course", choices=[('appetizer', 'Appetizer'),('entree','Entree'),
        ('dessert','Dessert'),('beverage','Beverage')])
    submit = SubmitField("Add")

class editMenuForm(FlaskForm):
    name = StringField("Name")
    price = StringField("Price")
    description = TextAreaField("Description")
    course = RadioField("Course", choices=[('appetizer', 'Appetizer'),('entree','Entree'),
        ('dessert','Dessert'),('beverage','Beverage')])
    submit = SubmitField("Edit")
```

The following code shows how to instantiate the forms and pass them to the templates for rendering.

```python
# app/forms.py

from app import app
from flask import render_template
from app.forms import newRestaurantForm, editRestaurantForm, deleteRestaurantForm, addMenuForm, editMenuForm, deleteMenuForm
#
# view functions
#

@app.route('/')
@app.route('/restaurants')
def showRestaurants():
    # This page wil show all my restaurants.
    return render_template('restaurant.html', restaurants=restaurants)

@app.route('/restaurant/new')
def newRestaurant():
    # This page will be for making a new restaurant.
    form = newRestaurantForm()
    return render_template('newRestaurant.html', form=form)

@app.route('/restaurant/<int:restaurant_id>/edit/')
def editRestaurant(restaurant_id):
    # This page will be for editing restaurant
    form = editRestaurantForm()
    return render_template('editRestaurant.html', form=form)

@app.route('/restaurant/<int:restaurant_id>/delete')
def deleteRestaurant(restaurant_id):
    # This page will be for deleting restaurant
    form = deleteRestaurantForm()
    return render_template('deleteRestaurant.html', form=form)

@app.route('/restaurant/<int:restaurant_id>/')
@app.route('/restaurant/<int:restaurant_id>/menu')
def showMenu(restaurant_id):
    # This page is the menu for restaurant
    return render_template('menu.html')

@app.route('/restaurant/<int:restaurant_id>/menu/new')
def newMenuItem(restaurant_id):
    # This page is for making a new menu item for restaurant
    #form = addMenuForm()
    form = addMenuForm()
    return render_template('newMenuItem.html', form=form)

@app.route('/restaurant/<int:restaurant_id>/menu/<int:menu_id>/edit')
def editMenuItem(restaurant_id, menu_id):
    # This page is for editing menu item"
    form = editMenuForm()
    return render_template('editMenuItem.html', form=form)

@app.route('/restaurant/<int:restaurant_id>/menu/<int:menu_id>/delete')
def deleteMenuItem(restaurant_id, menu_id):
    # This page is for deleting menu item %s
    form = editMenuForm()
    return render_template('deleteMenuItem.html', form=form)
```

All templates that render forms need to have a `form.hidden_tag()` statement defined just the before the form fields are created. This statement is there for security reasons and is used to protect the form against **Cross-Site Request Forgery** attacks.

To make all this possible, the `flask-wtf` extension uses the `SECRET_KEY` configuration variable to generate hidden tokens that protect the form.

We will define all our configuration variables in a `config.py` module at the top-level directory of our application, in keeping with the separation of concerns principle. We will use a class to structure and store all our configuration variables, starting with this `SECRET_KEY`.

```python
# restaurant_app/config.py
import os
class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')

```

The configuration variable will be loaded from an environment variable with a similar name. A quick way to generate a random key is to use python's `os` module.

```
>>> import os
>>> os.urandom(24)
b'\xc8m\xd6\xc1]Y\xf4\x0bb3\xe9%\x9c[\x81v\xfbf#\xb1S\n\x92\xc5'
>>>
```

The random string can then be copied and used to set the `SECRET-KEY` environment variable.

```
$ export SECRET-KEY=b'\xc8m\xd6\xc1]Y\xf4\x0bb3\xe9%\x9c[\x81v\xfbf#\xb1S\n\x92\xc5'
```

To pass the configuration variables to our flask app, we will use the `app.config.from_object()` method. In the `__init__.py` file, add the following code.

```python
# app/__init__.py

from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

from app import routes
```

Now **Flask** has access to all the configuration variables.

### Receiving Data from Users

By default, our view functions will only accept `GET` requests. To implement `POST` requests, we have to instruct them explicitly using the `methods` argument in the `@app.route()` decorator. A typical example will be as follows:

{% highlight python linenos %}

# previous code ...

@app.route('/restaurant/new', methods=['GET', 'POST'])

# ...

{% endhighlight %}

We will collect data from users using forms. We have already defined the
structure of our forms using the `flask-wtf` package. To build the forms from
inside our templates, we have to first instantiate them in the view functions
and pass the instances to the corresponding templates using the
`render_template` function from flask. From here, rendering the forms is
pretty easy. The form instances know how to render themselves in HTML. Below,
you can see the new menu item template which is stored in
app/templates/newMenuItem.html:

{% highlight html %}
{% raw %}
<% extends 'base.html' %>

<% block content %>

<section class="container content-box">
     <div class="row text-center new">
         <div class="col-md-12 col-lg-12">
            <h2 class="text-center">Add a new Menu Item</h2>
            <form action="" method="post" novalidate>
                {{ form.hidden_tag() }}
                <div class="form-group">
                    {{ form.name.label(class_='form-label') }}<br>
                    {{ form.name(size=32, class_='form-control')}}<br>
                    {% for error in form.name.errors %}
                    <span style="color: red">[{{error}}]</span>
                    {% endfor %}
                </div>
                <div class="form-group">
                    {{ form.price.label(class_='form-label') }}<br>
                    {{ form.price(size=32, class_='form-control')}}<br>
                    {% for error in form.name.errors %}
                    <span style="color: red">[{{error}}]</span>
                    {% endfor %}
                </div>
                <div class="form-group">
                    {{ form.course.label(class_='form-label') }}<br>
                    {% for subfield in form.course %}
                        <tr>
                            <td>{{ subfield }}</td>
                            <td>{{ subfield.label }}</td>
                            &nbsp;&nbsp;
                        </tr>
                    {% endfor %}
                </div>
                <div class="form-group">
                    {{ form.description.label(class_='form-label') }}<br>
                    {{ form.description(cols=32, rows=15, class_='form-control') }}<br>
                    {% for error in form.description.errors %}
                    <span style="color: red">[{{error}}]</span>
                    {% endfor %}
                </div>

                {{ form.submit(class_='btn btn-modify') }}
                <a href="{{ url_for('showMenu', restaurant_id=restaurant_id)}}" class="btn btn-modify">Cancel</a>
            </form>

        </div>
     </div>

</section>
<% endblock %>

{% endraw %}
{% endhighlight %}
