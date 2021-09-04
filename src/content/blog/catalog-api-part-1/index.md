---
title: "Building Web APIs with Flask - Part 1"
description: ""
author: "John Paul"
date: "2019-03-07"
tags: ["flask", "python"]
---

In this project we are going to design a RESTFul API for a _Catalog
Application_. This will be a simple application that provides a list of items
within a variety of categories.

## Key features of the application

- users can create an item
- Users can edit an item
- Users can delete an item
- Users can view a list of all items
- Users can view a list of items from a partcular category

APIs are basically a convenient way for clients to consume data. They should be
well designed so that other developers can easily use them without too much
hassle or wasting countless hours just trying to decipher them.

Some of the key terms related to API design include resources, collections and
URLs. I will briefly describe these below.

- **Resource** - an object. A representation of something. It can be _created_
  _updated_ or _deleted_.
- **Collections** - a set of resources
- **URL** - a Uniform Resource Locator. A path used to locate a resource and
  perform some actions on it.

## Getting Started

This project will use the [Flask](http://flask.pocoo.org/docs/1.0/) framework to build the API. The
flask framework is easy to use and there are ample resources online to get up
to speed. If you are not familiar with it, the [flask tutorial](http://flask.pocoo.org/docs/1.0/tutorial/)
provides an excellent introduction. You should be fairly good in python with a thorough
grounding in the fundamental concepts like functions, classes and decorators
to follow along.

I am also going to touch on how to use version control to keep track of
changes, some aspects of test-driven development and continuous integration.

To set up our project, create a github repository called **catalog**(or
whatever name you want) and clone it to whatever directory you find
convenient.

Then create a virtual environment called `venv` and activate it
(This assumes you already have `python` installed on your system).

```bash
$ python3 -m venv venv
$ source venv/bin/activate
```

Install the flask package.

```bash
$ pip install flask
$ pip freeze > requirements.txt
```

We will use branching to build our application. Create a branch called
`develop` and move to it.

`$ git checkout -b develop`

Set the directory structure. The structure should be similar to the example
displayed below.

![directory structure]({{ '/assets/img/folder_tree1.png' | relative_url }})

The **app** package will contain the main application. The **tests** package
will contain our tests. Within the app package, is an **api** package with
subpackages for different versions of our api. These packages will contain the
main code for our API.

Add and commit your changes to the repository.

```bash
(venv)$ git add -A
(venv)$ git commit -m "Initial directory structure"
```

Lets begin by first coming up with a model to represent the data that our
application will be built out of.

## Data Model and Database

The next step will involve coming up with an appropriate model to represent
the data in our application. This application will have two tables: a
**Users** table and an **Items** table. A user can create many items. Each
item will fall within a particular category.

These are some of the key fields associated with the users table:

- username
- email
- password_hash
- firstname
- lastname
- createdon

Similarly, the items table will have the following fields:

- item-name
- description
- createdon
- image
- category
- user_id (to point to the user who created it)

We will begin with the fields listed above as a start.

Before, we continue, let's discuss how to incorporate databases in flask.

Flask does not support databases natively. But extensions are available which
provide better integration with an application. In this project, we will use
the Flask-SQLAlchemy extension. This extension provides a flask-friendly
wrapper to the popular
[SQLAlchemy](https://docs.sqlalchemy.org/en/latest/index.html) package.

Let's create a new feature branch from where we will set up our database models.

```
(venv)$ git checkout -b ft-database-models
```

To install Flask-SQLAlchemy, run the command below. (Ensure your virtual
environment is activated).

```bash
(venv)$ pip install flask-sqlalchemy
```

We will also install the
[Flask-Migrate](https://github.com/miguelgrinberg/flask-migrate) extension.
This extension is a wrapper for
[Alembic](https://bitbucket.org/zzzeek/alembic), a database migration
framework for SQLAlchemy.

Database migrations refer to the process of updating the structure of a
relational database with all data contained therein when that structure is modified.
This process is a pain when done manually. Flask-Migrate streamlines everything
and provides a robust way to make future changes to your database.

To install Flask-mIgrate, run:

`(venv)$ pip install flask-migrate`

We also need to install [psycopg2](http://initd.org/psycopg/docs/), a database
connector for PostgreSQL, to connect to the database.

`(venv)$ pip install pscyopg2-binary`

Next, we will configure Flask-SQLAlchemy. We will use the [Postgresql]()
database. This post assumes you already have Postgresql installed in your
computer. Check
[this article](https://www.fullstackpython.com/blog/postgresql-python-3-psycopg2-ubuntu-1604.html){:target="\_blank"}
on how to install Postgresql in Linux systems(For those using a Linux
environment). Follow the instructions
on how to create a new user and a database in the PostgreSQL server before
continuing.

Before adding configuration variables for the database, install the
[python-dotenv](https://pypi.org/project/python-dotenv/){:target="\_blank"}
package. This package is used to read configuration values
from a `.env` file and add them to the environment. Thereafter, we can use the
`os` module to read these values into our application.

`(venv)$ pip install python-dotenv`

Let's make all this concrete.

In the `config.py` file, add the code below.

{% highlight python linenos %}

# config.py

import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(**file**))
load_dotenv(dotenv_path=os.path.join(basedir, '.env'))

class Config(object):
SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
SQLALCHEMY_TRACK_MODIFICATIONS = False

{% endhighlight %}

Here, we first import the `os` module and create an absolute path to the
directory where this file is located. We then load the configuration values to
the environment using the `load_dotenv` function.

The `config` module is used to hold our configuration values. It is structured
using classes with class attributes as configuration variables.

Flask-SQLAlchemy takes the location of the application's database from the
`SQLALCHEMY_DATABASE_URI` configuration variable. In turn, the value for the
database url is obtained from the environment variable named `DATABASE_URL`.

**Database Urls** for connecting to a database using SQLAlchemy have the
format `dialect+driver://username:password@host:port/database`.

Create a `.env` file at the topmost directory in your folder structure
and add the following line.

```
DATABASE_URL=postgresql+psycopg2://paul:catalog12@localhost:5432/catalog
```

The database we will be using is named **catalog**.

The `SQLALCHEMY_TRACK_MODIFICATIONS` configuration option is set to `False` so
as not to signal the application everytime a change is made to the database.

To setup the database, add the following code to the `app/__init__.py` file:

```python

# app\_\_init\_\_.py

from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app(config=Config):
"""Creates the application instance"""

    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    migrate.init_app(app, db)

    return app

from . import models

```

This script uses the application factory pattern to create the flask app.

First we do all the necessary imports. Here, we have imported the `Flask`,
`SQLAlchemy`, `Migrate` and `Config` classes. Then we have initialized a
database instance, `db`, using SQLAlchemy object, and a Flask-Migrate
instance, `migrate`, using the Flask-Migrate object.

A Flask application is an instance of the `Flask` class. Everything about the
application, such as configuration and URLs will be registered with this
class.

The Flask instance is created in the `create_app` function. This function is
called an _application factory_ function. It returns an instance of a Flask
application. Any configuration, registration, and other setup the application
needs happens inside this function.The `app.config.from_object` line loads
configuration values that the app will use from the `Config` object.

Finally, we import a `models` module using a relative import. The last line basically says
import a models module from the current package(denoted by a `.`(period)).
This module will define the structure of the database.

### Database Models

We will represent the data that will be stored in the database using
_classes_. Each class will represent a table and the associated class
attributes will represent the columns. The **ORM** layer within SQLAlchemy will
then map these classes to the appropriate database tables.

Create a `models.py` file in the `app` package and add the following code.

```python
# app.models

from datetime import datetime
from . import db

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(140))
    firstname = db.Column(db.String(64))
    lastname = db.Column(db.String(64))
    createdon = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    items = db.relationship('Item', backref='createdby', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.formar(self.username)

class Item(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    itemname = db.Column(db.String(64))
    description = db.Column(db.String(300))
    category = db.Column(db.String(64), index=True)
    createdon = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Item {}>'.formar(self.itemname)
```

The `User` class subclasses `db.Model`, a base class inherited by all
SQLAlchmey data models. The class defines several fields which are instances
of the `db.Column` class, which takes a field type plus extra optional
arguments. The `__repr__` method is a special method that defines how this
class will be diplayed when it's printed. Some fields are indexed which
ensures that searching/sorting using these fields will be much faster.

The `items` field, initialized using `db.relationship`, is a virtual field
that is used to conveniently obtain all the items created by a user. This is
accomplished by running a command that follows the format `user.items`. The
`backref` argument creates a virtual field in the `Item` table called
`createdby`. This field is used to get the user who created the item.
This can be accomplished using a command such as `item.createdby`.

The `Item` class represents items created by a user. In the createdon field,
the default option is given a datetime function that is automatically called
whenever a new record is created in the table represented by this class. The
`user_id` field defines a foreign key relationship, i.e, it references the
`id` of the user who created the item in question.

#### Database Migration

With the initial database structure setup, we are now going to perform
database migration operations using Alembic. The **Flask-Migrate** extension
we installed earlier provides convenient commands for this. These commands are
exposed through the `flaski db` command.

Before proceeding, we need to create a database in our Postgreql server.
Follow [this
article](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04#top)
to create one.

Run the following commands to apply the changes to the database.

```bash
$(venv) flask db init
$(venv) flask db migrate
$(venv) flask db
```

The first command creates a migration repository and the second command
populates the migration scripts previously created with the changes to be
applied. In both cases, the database remains unchanged. The last command is
the one that applies the changes.

Henceforth, whenever you make changes to your models, generate a new
migration script using `flask db migrate` then apply the changes to the
database with `flask db upgrade`.

Use `flask db downgrade` to undo the previous migration.

#### Password Hashing

It's generally a bad idea to store plain text passwords in your database because of
the security risk involved. Instead, we usually store password hashes.
[This blog post](http://dustwell.com/how-to-handle-passwords-bcrypt.html)
offers an excellent explanation for this.

To hash users' passwords, we will use the
[Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/en/latest/) extension.

`(venv)$ pip install flask-bcrypt`

Add the following code to your `app/__init__.py` file.

```python
# app\__init__.py
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt # <-- new line

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt() # <-- new line

def create_app(config=Config):
    """Creates the application instance"""

    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app) # <-- new line

    return app

from . import models

```

Update the `models.py` module as follows.

```python

# ... previous code

from . import bcrypt

class User(db.Model):
    # ... previous code

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

# ... previous code

```

Here, we have added two methods to the `models` module. The `set_password`
module uses bcrypt to generate a new password hash while the `check_password`
method uses bcrypt to check the validity of a password. If password is valid,
it returns `True` else `False`.

Finally, apply the changes to the database.

```
(venv)$ flask db migrate -m "password hashing in user model"
(venv)$ flask db upgrade
```

#### Testing our database implementation

We are now going to test our database implemenation so far in the python
interpreter to see how everything works.

From your top-level directory (the folder containing `venv`), fire up the
python interpreter.

Import the database models, db instance and create_app function.

```bash
>>> from app.models import User, Item
>>> from app import db, create_app
```

Before proceeding, note that we cannot execute the database commands just yet.
SQLAlchemy has to first be bound to an application instance. Since the db
instance imported here was defined globally, there's no way of telling
SQLAlchemy which application to use. To resolve, we are to create and push an
application context.

An application context allows us to work within a given application. This
happens automatically in view functions. However, we have to manually create
one when we are in the interactive shell.

To learn more about application contexts, checkout this
[article](http://flask-sqlalchemy.pocoo.org/2.3/contexts/).

To create the application context, run the following commands.

```
>>> app = create_app()
>>> app.app_context().push()
```

We are now ready to run the database commands.

```
>>> u1 = User(username='john', email='john@example')
>>> u1.set_password('john')
>>> u2 = User(username='jane', email='jane@example')
>>> u2.set_password('jane')
>>> db.session.add(u1)
>>> db.session.add(u2)
>>> db.session.commit()
>>> users = User.query.all()
>>> users
[<User john>, <User jane>]
>>> j = users[0]
>>> j.check_password('john')
True
>>> j.check_password('alex')
False
>>> it = Item(itemname='ball', description='football', category='soccer',
createdby=j)
>>> db.session.add(it)
>>> db.session.commit()
>>> j.items.all()
[<Item ball>]
>>> Item.query.get(1)
[<Item ball>]
```

We can see that our database is mostly operating as expected.

#### Commit the changes

Add and commit all changes to the version control. Run the following commands.

```
$(venv)$ git add -A
$(venv)$ git status
$(venv)$ git commit -m "Add and configure database models"
$(venv)$ git checkout master
$(venv)$ git merge ft-database-models
$(venv)$ git push -u origin master
```
