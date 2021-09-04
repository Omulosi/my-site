---
title: "Building Web APIs with Flask - Part 2"
description: ""
author: "John Paul"
date: "2019-03-08"
tags: ["flask", "python"]
---

In [part 1]({{ '/flask/python/2019/03/07/catalog-api-part1.html'| relative_url }})
of this series, we set up the database and defined the data
models for our application.

In this section, we are going to design our API endpoints following the
Representational State Transfer(REST) pattern. When web service APIs are
designed in a way to adhere to the [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)
constraints, they are called **RESTFul APIs**. In such APIs, resources are
logically segregated and can be accessed and manipulated using HTTP requests.

## Creating the API endpoints

We have to first identify the application's resources and the actions that we
will apply on these resources. The notion of a **resource** is key in REST.
There isn't a restriction on what can be a resource. Go with what makes the
most logical sense.

For this simple application, our resource will be **items**. Some of
the actions we can perform on items include:

- create an item
- get a list of items
- retrieve one item only
- update an item
- delete an item

These actions are essentially CRUD operations and we will implement them
using HTTP methods. In REST, each resource generally has a **URI** ( as we had
discussed earlier in part 1) that provides the interface through which
interaction with the resource occurs. The nature of these interactions, their
effect on the resources so to speak, are defined using HTTP methods.

This is how we will map the API calls to the actions defined above:

- `GET /items/1` - gets an item with id #1
- `GET /items` - gets a collection of items
- `POST /items` - creates an item
- `PATCH /items/1` - changes an item with id #1
- `DELETE /items/1` - deletes an item with id #1

The resource will also have a respresentation. Some of the popular
representations include:

- XML
- HTML
- JSON

When you request a resource, its represenatation is provided. In this
application, we will represent our resource using JSON.

REST URIs should always represent resources in a way that's meaningful to the
client. Think nouns, not verbs, when crafting your URIs, as the example above
shows. Consider using plurals.

Note that the HTTP methods should be used for what they are logically
intended. For example, a **GET** should only retrieve an item or a collection
of items and should have appropriate return codes.

## Building the API interface

To build the rest of the API, we are going to use an extension called
[Flask-RESTful](https://flask-restful.readthedocs.io/en/latest/){:target="\_blank}.
This extension integrates seamlessly with flask and will allow us to quickly
build the API.

We will first create and move to a new feature branch.

`(venv)$ git checkout -b ft-api-endpoints`

Install Flask-RESTful with the following command.

`(venv)pip install flask-restful`

We will now set up flask-restful in our application. Add the following code in
the `app.api.v1` package.

```python

# __init__.py

from flask import Blueprint
from flask_restful import Api

bp = Blueprint('catalog', __name__)
api = Api(bp)

from app.api.v1 import views
```

Here, we have created a new blueprint called catalog and initialized the Api class
from flask restful. This instance is what we will use to create our API
routes. We have also imported a yet to be created `views.py` module.

In the `__init__.py` file in the app package, update `create_app` function as
follows.

```python
# ... previous code

def create_app(config=Config):

    # ...

    from app.api.v1 import bp
    app.register_blueprint(bp, url_prefix="/api/v1")

    # ...
```

The code added above registers the blueprint we had created earlier. All the
routes for accessing our API endpoints will be prepended with the url prefix
defined in the blueprint registration function.

Let's now start building up our API endpoints.

In the app.api.v1 package, create a `views.py` module and populate it with the
following skeletal code.

```python
# app.api.v1.views

from flask_restful import Resource
from . import api

class ItemAPI(Resource):

    def get(self, id=None):
        # Return item data
        pass

    def post(self):
        # create new item
        pass

    def patch(self, id, field):
        # make changes to an item on the given field with given id
        pass

    def delete(self, id):
        # Delete item with given ID
        pass


api.add_resource(
    ItemAPI,
    '/items',
    '/items/<int:id>'
    '/items/<int:id>/<string:field>'
    )
```

To create an API using Flask-RESTful, subclass the **Resource** class. Then the HTTP
methods used to acccess the API are implemented as class methods. The routes
are added as indicated in the last line. We can specify multiple routes as
needed for any given API.

### Unit tests for API endpoints

Before we start building our API views, we are going to write unit tests for
all the API endpoints. Writing unit tests lets us check that the code we write
works the way we expect it to. Flask provides a test client that simulates
requests to the application and returns the response data. This way, we won't
need to run the server.

Also, we should test as much of our code as possible, covering every
conceivable path through it. The higher the coverage, the more comfortable we
can be that making changes won't result in undesired consequences.

We will use the [pytest](https://pytest.readthedocs.io/){:target="\_blank"}
testing framework and
[coverage](https://coverage.readthedocs.io/){:target="\_blank"} to test and
measure our code.

Install them both.

`(venv)$ pip install pytest coverage`

Update the `requirements.txt` file as follows.

`(venv)$ pip freeze | grep -v "pkg-resources" > requirements.txt`

The `grep -v "pkg-resources"` excludes any name that matches this pattern.
This will prevent installation problems during deployment and continuos
integration later on.

#### Setup and Fixtures

Lets now add the configuration variables for testing. Update the `config.py`
module as follows.

```python
# config.py

# ...

class TestConfig(Config):

    TESTING = True
    SQLALCHEMT_DATABASE_URI = os.getenv('TEST_DATABASE_URL')
```

Update the `.env` file with a new environment variable `TEST_DATABASE_URL` to
point to a test database. This is the database we will use for all our tests.
In my case, I have called it **catalog_testdb** so the database url will have
the following format:

`postgresql+psycopg2://jp:catalog12@localhost:5432/catalog_testdb`

Setting TESTING to `True` tells Flask that the app is in test mode. Flask then
changes some internal behavior to make testing much easier. The installed
Flask extensions also use this flag to make testing them easier.

With the configuration all set up, we will now start writing our test code.
The tests will be located in the `tests.v1` package from the application
root.

Pytest has the notion of _fixtures_ which are basically set up functions that
are pre-processed before any test function is executed. The framework has made
a provision for a configuration file of sorts which is used to collect all the
fixtures in one place. This file should be labelled `conftest.py` and will be
automatically detected by pytest.

Lets populate this file with our fixtures to set up our tests. Create a
`conftest.py` module and add the following code.

```python
# tests.v1.conftest

import pytest
from app import create_app, db
from config import TestConfig

@pytest.fixture
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.drop_all()
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

```

The `app` fixture will call the `create_app` application factory function,
passing `TestConfig` to configure the application and the database for
testing.

The `client` fixture calls `app.test_client()` with the application object
created by the `app` fixture. The tests we are going to write will use this
client to make requests to the application without running the server.

To use a fixture, pass the name of the fixture as a parameter to the test function. Pytest
will then know to call the fixture function and pass the returned value to
the test function in question.

#### Test modules

Our test code will be in modules that begin with `test_` and each function in
the modules will also start with `test_`.

We will begin by testing our models.

Create a `test_models.py` module and add the following code.

```python
import pytest
from app.models import Item

def test_create_items(app):
    with app.app_context():
        item1 = Item(itemname='stick', description='hockey stick',
        category='hockey')
        item2 = Item(itemname='jersey', description='play uniforms',
        category='soccer')

        db.session.add(item1)
        db.session.add(item2)
        db.session.commit()

        items = Item.query.all()
        assert len(items) == 2
        assert item1.category == 'hockey'
        assert item2.category == 'soccer'

        assert bool(item1.createdby) is False
        assert bool(item2.createdby) is False

```

The above module tests whether database operations work correctly. Run pytest
and check that all the tests pass.

`(venv)$ pytest`

Next, we are going to add tests for each of our API endpoints.

Create a new module called `test_views.py`. Add the following code to this
module.

```python
# tests.v1.test_views
import json
import pytest


# test data
TEST_ITEM = {'itemname': 'ball', 'category': 'soccer',
             'description':'something to kick'}

def test_create_item(client):
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 201
    assert response.headers['Location'] is not None

    # Invalid requests
    # blank fields should not be in input data
    response = client.post('/api/v1/items', data={'itemname': '', 'category': '',
                                                  'description':''})
    assert response.status_code == 400
    response = client.post('/api/v1/items', data={'itemname':' ',
                                                  'category':'   ', 'description':'   '})
    assert response.status_code == 400

    # Test all three fields should be present
    response = client.post('/api/v1/items', data={'itemname':'ball', 'category':'soccer'})
    assert response.status_code == 400
    response = client.post('/api/v1/items', data={'itemname':'jersey'})
    assert response.status_code == 400


def test_get_an_item(client):
    # Add some test data to the database
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 201

    response = client.get('/api/v1/items/1')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert len(data['data']) == 1
    item = data['data'][0]
    assert len(item) > 0

    # test invalid requests

    # Non-existent id
    response = client.get('/api/v1/items/99999')
    assert response.status_code == 404
    # Invalid ID type - bad request
    response = client.get('/api/v1/items/item1')
    assert response.status_code == 400

def test_get_item_collection(client):
    response = client.get('/api/v1/items')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert not data['data'] # Nothing yet

    # Create some test_items
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 201
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 201

    response = client.get('/api/v1/items')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert len(data['data']) == 2

@pytest.mark.parametrize(('path', 'data', 'invalid_field', 'invalid_id'), (
    ('/api/v1/items/1/itemname',
     {'itemname': 'new-name'},
     {'category': 'new-category'},
     '/api/v1/items/9999/itemname'
    ),
    #
    ('/api/v1/items/1/category',
     {'category': 'new-category'},
     {'itemname': 'new-name'},
     '/api/v1/items/9999/category'
    ),
    #
    ('/api/v1/items/1/description',
     {'description': 'new-description'},
     {'category': 'new-category'},
     '/api/v1/items/9999/description'
    )))
def test_patch_an_item(client, path, data, invalid_field, invalid_id):
    """ Tests for patch endpoint"""
    # Item does not exist
    response = client.patch(path, data=data)
    assert response.status_code == 404
    assert b'status' in response.data
    assert b'error' in response.data

    # create test data
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 201

    # patch an item: success
    response = client.patch(path, data=data)
    assert response.status_code == 200
    resp_data = json.loads(response.data.decode('utf-8'))['data'][0]
    # check that the value in input data used to update the field is
    # present in the json response of this request
    assert True in [v in resp_data.values() for v in data.values()]

    # Non-matching fields: error
    response = client.patch(path, data=invalid_field)
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

    # Too many fields
    response = client.patch(path, data={'category':'cricket',
                                        'description': 'bowling game'})
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

    response = client.patch(path,
                            data={'category':'cricket',
                                  'itemname': 'bat',
                                  'description': 'blowling game'})
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

    # Non-existent id
    response = client.patch(invalid_id, data=data)
    assert response.status_code == 404
    assert b'status' in response.data
    assert b'error' in response.data

    # invalid update field
    response = client.patch('/api/v1/items/1/product',
                            data=data)
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

def test_delete_item(client):
    # Item does not exist
    response = client.delete('/api/v1/items/1')
    assert response.status_code == 404

    # create test data
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 201

    # successful delete
    response = client.delete('/api/v1/items/1')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))['data']
    assert data[0]['id'] == 1

    # Non-existent id
    response = client.delete('/api/v1/items/99999')
    assert response.status_code == 404

    # Invalid id type, should be an int
    response = client.delete('/api/v1/items/item-1')
    assert response.status_code == 400


```

The code above details the tests for our endpoints. The tests are mostly
self-explanatory.

Each test function takes a `client` argument, which is matched to the pytest
fixture we had defined earlier in the `conftest.py` module. This argument,
rather the matching pytest fixture, is called and the return value passed to
the test function. This returned values is the client that we then use to make
endpoint requests in our tests. Pytest automatically accomplishes this.

The `pytest.mark.parametrize` decorator used to decorate the
`test_patch_an_item` function allows us to run this function more than once
using the arguments that have been provided in the decorator. The first tuple
specifies the name of the arguments we'll have to use in the test function and
the tuples that follow specify matching values for each argument. This is done
to limit code repetition.

Let's now run the tests.

`(venv)$ pytest`

The tests should fail.

We are now going to implement each API endpoint such that all the unit tests
pertatining to it pass. After implementing each endpoint, run the tests and
keep on adding to/modifying the code in question until all the relevant tests
pass.

### Building the API endpoints

Create a module called `views.py` in the `app.api.v1` package. Add the
following code to this module.

```python
"""
app.api.v1.views
~~~~~~~~~~~~~~~~~
RESTFul API for Item model

"""

from flask_restful import Resource, reqparse, url_for
from app.models import Item
from app import db
from .common.errors import raise_error
from .common.utils import valid_item_name, valid_category, valid_description

parser = reqparse.RequestParser()
parser.add_argument('itemname', type=str, help='item name not provided')
parser.add_argument('category', type=str, help='category not provided')
parser.add_argument('description', type=str, help='description not provided')

class ItemAPI(Resource):

    def post(self):
        # create new item
        args = parser.parse_args()
        item_name = args['itemname']
        category = args['category']
        description = args['description']

        # Validate inout data
        if not valid_item_name(item_name):
            return raise_error(400, "Invalid item name")
        if not valid_category(category):
            return raise_error(400, "Invalid category name")
        if not valid_description(description):
            return raise_error(400, "Invalid description")

        item = Item(itemname=item_name, category=category, description=description)
        db.session.add(item)
        db.session.commit()
        uri = url_for('catalog.item', id=item.id, _external=True)

        output = {}
        output['status'] = 201
        output['message'] = 'Created a new item'
        data = item.serialize
        data['uri'] = uri
        output['data'] = [data]

        return output, 201, {'Location': uri}

    def get(self, id=None):
        # Return item data
        if id is None:
            # Return a collection of all items
            all_items = Item.query.all()
            output = {}
            output['status'] = 200
            data = all_items
            if all_items:
                data = [item.serialize for item in all_items]
            output['data'] = data

            return output

        if not id.isnumeric():
            return raise_error(400, "Item ID should be an integer")
        item_id = int(id)
        item = Item.query.get(item_id)
        if not item:
            return raise_error(404, "Requested item does not exist")

        output = {}
        output['status'] = 200
        output['data'] = [item.serialize]

        return output

    def patch(self, id, field):
        # update item with given ID
        if not id.isnumeric():
            return raise_error(400, "Item ID should be an integer")
        if field not in ('itemname', 'category', 'description'):
            return raise_error(400, "Invalid field name")

        parser = reqparse.RequestParser()
        parser.add_argument(field, type=str, required=True)

        try:
            args = parser.parse_args(strict=True)
        except:
            error_msg = "Invalid input data. Only {} field should be provided".format(field)
            return raise_error(400, error_msg)

        new_field_value = args.get(field)
        if field == 'itemname':
            new_field_value = valid_item_name(new_field_value)
        elif field == 'category':
            new_field_value = valid_category(new_field_value)
        elif field == 'description':
            new_field_value = valid_description(new_field_value)
        if not new_field_value:
            return raise_error(400, "{} field is invalid".format(field))

        item_id = int(id)
        item = Item.query.get(item_id)

        if not item:
            return raise_error(404, "Item does not exist")
        if field == 'itemname':
            item.itemname = new_field_value
        if field == 'description':
            item.description = new_field_value
        if field == "category":
            item.category = new_field_value

        db.session.commit()

        output = {}
        data = item.serialize
        output['status'] = 200
        data['message'] = 'successfully updated item {}'.format(field)
        output['data'] = [data]

        return output

    def delete(self, id):
        # Delete item with given ID
        if not id.isnumeric():
            return raise_error(400, "Item ID should be an integer")
        item_id = int(id)
        item = Item.query.get(item_id)
        if not item:
            return raise_error(404, "Item does not exist")
        db.session.delete(item)
        db.session.commit()

        output = {}
        message = 'Item has been deleted'
        output['status'] = 200
        output['data'] = [{'id': item_id, 'message': message}]
        return output

```

The module above contains the complete code for the implementation of each
of our endpoints. The class `ItemAPI` is used to enclose all the
functionality/actions that will be performed on this resource.
These actions are implemented as class methods that match the name of the http
method that pertains to the action in question.

The `post` method is used to implement the **create item** endpoint. Here, the
reqparse object provided by **Flask-Restful** has been used to parse and
collect input data into a convenient dictionary. The data is then validated
using validation functions whose implementation we'll see shortly.

The return value is automatically converted to a json output. This is one of
the advantages of using **Flask-Restful**.

The `get` method is used to retrieve one item or a collection of items. The
`patch` method is used to update a specified field supplied by the client.
Finally, the `get` method is used to delete an item given an ID.

The routes for these endpoints are defined in the `__init__.py` file of the
`app.api.v1` package. This location provides a convenient location where all
routes can be gathered in one place.

```python
# __init__.py

from flask import Blueprint
from flask_restful import Api

bp = Blueprint('catalog', __name__)
api = Api(bp)

from .views import ItemAPI

# routes for item resource
api.add_resource(
    ItemAPI,
    '/items',
    '/items/<id>',
    '/items/<id>/<field>',
    endpoint='item'
    )
```

A package called `common` has also been defined in the `app.api.v1` package.
This package contains modules with helper functions for validations and custom
error generation.

```python
"""
app.api.v1.common.errors
~~~~~~~~~~~~~~~~~~~~~~~~~

Custom error messages
"""

from flask import jsonify

def raise_error(status_code, message):
    """
    Return a custom error message
    """
    response = jsonify({"status": status_code,
                        "error": message})
    response.status_code = status_code

    return response
```

```python
"""
app.api.v1.common.utils
~~~~~~~~~~~~~~~~~~~~~~~~

some common utility functions
"""

import re
from flask import jsonify

def valid_item_name(name):
    if name:
        name = name.strip()
    return name if name else None

def valid_category(category):
    if category:
        category = category.strip()
    return category if category else None

def valid_description(description):
    if description:
        description = description.strip()
    return description if description else None
```

Before running our tests, we'll create a `setup.cfg` in the application
root to specify some configuration values that will govern how the
tests will run. This file is largely self-explanatory as shown below.

```
[tool:pytest]
testpaths = tests

[coverage:run]
branch = True
source =
    app
```

We are now ready to run our tests. Execute the following commands.

`pytest`

`coverage run -m pytest`

To view the coverage report on the terminal, run:

`coverage report`

Note that the above are mostly finished artifacts. In the development process,
after writing the tests, one would generally add some code, test the
implementaion bit by bit, add some more tests and so on until all the tests
pass...I hope you get the picture.

This is generally what [Test Driven Development](https://code.tutsplus.com/tutorials/beginning-test-driven-development-in-python--net-30137){:target="\_blank"} entails. You write tests that you expect will fail,
make the tests pass, refactor, rinse repeat. The tests become an integral part
of your development process, not just an annoying afterthought.

As a last step, let's now merge this feature branch to master.

```
$(venv) git add -A
$(venv) git commit -m "Complete API endpoint implementation
$(venv) git checkout master
$(venv) git merge ft-api-endpoints
$(venv) git push -u origin master
```

In
[part 3]({{ '/flask/python/2019/03/10/catalog-api-part3.html'| relative_url }}),
we are going to deviate a little and talk about Continuous Integration.
