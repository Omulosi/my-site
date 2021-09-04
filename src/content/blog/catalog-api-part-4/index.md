---
title: "Building Web APIs with flask - Part 4: Authentication and Authorization"
description: ""
author: "John Paul"
date: "2019-03-11"
tags: ["flask", "python"]
---

The backend of our application is now nicely set up. We have tested that all
the API endpoints are working as expected. This section will incorporate
authentication and authorization to our API. We will use an external package
for this purpose that makes everything that much easy, the
[Flask-JWT-Extended]() extension.

Before proceeding, let's create and shift to a new feature branch
for authentication.

`(venv)$ git checkout -b ft-jwt-authentication`

Let' now start creating tests for the authentication endpoints.
The specification for these endpoints is listed below.

- `POST /auth/v1/signup` - create a user account
- `POST /auth/v1/signin` - login a user

In your `tests` directory, create a new file called `test_auth.py` and add the
following code.

```python
"""
tests.v1.test_auth
~~~~~~~~~~~~~~~~~~

Tests for authentication
"""

import json
import pytest

#
# SAMPLE INPUT DATA
#

VALID_USER_DATA = {'email': 'user@example.com', 'password': 'youcantguess#4'}
# email should not be empty
INVALID_USER_EMAIL_1 = {'email': '', 'password': 'youcantguess#4'}
# email should not be blank
INVALID_USER_EMAIL_2 = {'email': '  ', 'password': 'youcantguess#4'}
# email should have correct format
INVALID_USER_EMAIL_3 = {'email': 'example.com', 'password': 'youcantguess#4'}
# email field should be present
INVALID_USER_EMAIL_4 = {'password': 'youcantguess#4'}

# password should not be empty
INVALID_USER_PASSWORD_1 = {'email': 'user@example.com', 'password': ''}
# password should not be blank
INVALID_USER_PASSWORD_2 = {'email': 'user@example.com', 'password': '  '}
# password should be at least 3 characters long
INVALID_USER_PASSWORD_3 = {'email': 'user@example.com', 'password': 'abc'}
# password should include a number and a special character
INVALID_USER_PASSWORD_4 = {'email': 'user@example.com', 'password': 'secret'}
INVALID_USER_PASSWORD_5 = {'email': 'user@example.com', 'password': '93secret'}
INVALID_USER_PASSWORD_6 = {'email': 'user@example.com', 'password': '#sec%ret'}
# password field should be present
INVALID_USER_PASSWORD_7 = {'email': 'user@example.com',}

# user should be unique
USER_ALREADY_EXISTS = {'email': 'user@example.com', 'password':
        'youcantguess#4'}
# user should have valid credentials, if email and password both have the
# correct format
INVALID_USER_CREDENTIALS = {'email': 'sneakyuser@example.com', 'password':
        'iamsneaky#9'}

@pytest.mark.parametrize(('path'), (
    ('/api/v1/auth/signup'),
    ('/api/v1/auth/signin')))
def test_authentication_with_valid_data(client, path, auth):
    """
    Tests for the signup and signin endpoints when valid and correctly
    formatted data is supplied.

    args:
        - client - application client for making requests
        - path - URI for signin/signup.
    """

    if 'signup' in path:
        response = client.post(path, data=VALID_USER_DATA)
        assert response.status_code == 201
    if 'signin' in path:
        create_user_response = auth.signup(**VALID_USER_DATA)
        assert create_user_response.status_code == 201
        # user now exists in the test database, okay to query
        response = client.post(path, data=VALID_USER_DATA)
        assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert 'data' in data
    assert 'access_token' in data['data'][0]
    assert 'user' in data['data'][0]

@pytest.mark.parametrize(('invalid_user_data', 'message'),(
                        # user signup
                        (INVALID_USER_EMAIL_1, 'Invalid email format'),
                        (INVALID_USER_EMAIL_2, 'Invalid email format'),
                        (INVALID_USER_EMAIL_3, 'Invalid email format'),
                        (INVALID_USER_EMAIL_4, 'Invalid email format'),
                        (INVALID_USER_PASSWORD_1, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_2, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_3, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_4, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_5, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_6, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_7, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (USER_ALREADY_EXISTS, 'User already exists'),
                        ))
def test_signup_with_invalid_data(client, auth, invalid_user_data, message):
    # pre-create a user to test user already exists fucntionality
    auth.signup(**VALID_USER_DATA)
    # Invalid signup
    response = client.post('/api/v1/auth/signup', data=invalid_user_data)
    assert response.status_code == 400
    data = json.loads(response.data.decode('utf-8'))
    # check that response has correct format
    assert 'status' in data
    assert 'error' in data
    assert message in data['error']


@pytest.mark.parametrize(('invalid_user_data', 'message'),(
                        # user signin
                        (INVALID_USER_EMAIL_1, 'Invalid email format'),
                        (INVALID_USER_EMAIL_2, 'Invalid email format'),
                        (INVALID_USER_EMAIL_3, 'Invalid email format'),
                        (INVALID_USER_EMAIL_4, 'Invalid email format'),
                        (INVALID_USER_PASSWORD_1, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_2, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_3, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_4, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_5, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_6, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        (INVALID_USER_PASSWORD_7, 'Invalid password. Should be'
                            ' at least 5 characters long and include a number'
                            ' and a special character'),
                        ))
def test_signin_with_invalid_data(client, auth, invalid_user_data, message):
    # create a user before proceeding
    auth.signup(**VALID_USER_DATA)

    # Invalid signin
    response = client.post('/api/v1/auth/signin', data=invalid_user_data)
    assert response.status_code == 400
    data = json.loads(response.data.decode('utf-8'))
    # check that response has correct format
    assert 'status' in data
    assert 'error' in data
    assert message in data['error']

def test_signin_with_invalid_credentials(client, auth):
    # create a user before proceeding
    auth.signup(**VALID_USER_DATA)

    # signin with invalid credentials
    response = client.post('/api/v1/auth/signin', data=INVALID_USER_CREDENTIALS)
    assert response.status_code == 401
    assert b'status' in response.data
    assert b'error' in response.data

```

The code above tests the `signin` and `signup` endpoints. Much of it is
self-explanatory. Refer to _Part 1_ if anything does not make sense,
especially the `pytest.mark.parametrize` decorator.

Since some test views will require that a user already exists before running
the tests, the `conftest` module has been updated with the following code.

```python
# tests.v1.conftest

# ... previous code

class AuthActions(object):
    """
    This class provides methods for quickly creating a user, signing in the
    user or logging out the user.
    """
    def __init__(self, client):
        self._client = client

    def signup(self, **kwargs):
        return self._client.post('/api/v1/auth/signup', data=kwargs)

    def login(self, **kwargs):
        return self._client.post('/api/v1/auth/signin', data=kwargs)

    def logout(self, **kwargs):
        return self._client.post('/api/v1/auth/logout', data=kwargs)

@pytest.fixture
def auth(client):
    return AuthActions(client)

```

Here, we have written an `AuthActions` class with methods that sign up,
sign in or log out the user. Then we have created an `auth` fixture which
we use to pass in the app client to the class. This is the client we use
to make requests for each test.

Then, in test functions which require a user to created or logged in before
tests are executed, we pass in the `auth` fixture as an argument and use it in
the function body to quickly perform these operations. Remember from **part
3** that when a fixture is passed in to a test function, it is called and the
returned value is what is used in the function body. In this case, the
returned value will be an instance of the `AuthActions` class with a client
for making requests already initialized.

All this limits code repetition and streamlines the entire process.

Run the tests.

`(venv)$ pytest`

All the authentication tests should fail as expected.

**Flask-JWT-Extended** provides support for using JSON Web Tokens (JWT) for
protecting views. To install it, run the command below.

`(venv)$ pip install flask-jwt-extended`

To set up and configure **Flask-JWT-Extended**, add the following code
to the `__init__.py` file in the `app` package.

```python
# app/__init__.py

from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config=Config):
    """Create the application instance"""

    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from app.api.v1 import bp
    app.register_blueprint(bp, url_prefix='/api/v1')

    return app

from . import models
```

In the `.env` file, add a `SECRET_KEY` environment variable. One way of
generating a hard to decipher key is by using the `os.urandom` function.

Then in the config file, under the `Config` class, add the following line:

`JWT_SECRET_KEY = os.getenv('SECRET_KEY')`

In the `__init__.py` file of `app.api.v1` package, add the following endpoints
just below the **Item** endpoints.

```python
# ... previous code
from .auth import SignUp, SignIn
# Authenticaion routes
api.add_resource(
        SignUP,
        '/auth/signup',
        )

api.add_resource(
        SignIn,
        '/auth/signin',
        )
```

Here, the `SignUP` and `SignIn` resources have been imported from the `auth`
module that we are yet to create.

In the `app.api.v1` package, create a module called `auth.py` and add the following
code to it.

```python
"""
app.api.v1.auth
~~~~~~~~~~~~~~

Authentication views

"""

from flask_jwt_extended import create_access_token
from flask_restful import Resource, reqparse
from .common.utils import (valid_email, valid_password)
from .common.errors import raise_error
from app.models import User
from app import db

parser = reqparse.RequestParser()
parser.add_argument('email', type=str)
parser.add_argument('password', type=str)

class SignUP(Resource):

    def post(self):
        args = parser.parse_args()
        email = args.get('email') or ''
        password = args.get('password') or ''

        # validate input data
        if not valid_email(email):
            return raise_error(400, "Invalid email format")
        if not valid_password(password):
            return raise_error(400, "Invalid password. Should be at least 5 "
                    "characters long and include a number and a special "
                    "character")

        user = User.query.filter_by(email=email).first()
        if user is not None:
            return raise_error(400, "User already exists")
        user = User(email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        data = {}
        data['access_token'] = create_access_token(identity=email)
        data['user'] = user.serialize

        response = {
                "status": 201,
                "data": [data]
                }

        return response, 201

class SignIn(Resource):

    def post(self):
        args = parser.parse_args()
        email = args.get('email') or ''
        password = args.get('password') or ''

        if not valid_email(email):
            return raise_error(400, "Invalid email format")
        if not valid_password(password):
            return raise_error(400, "Invalid password. Should be at least 5 "
                    "characters long and include a number and a special "
                    "character")

        user = User.query.filter_by(email=email).first()
        if user is None:
            return raise_error(401, "Invalid email. This user does not exist")
        if not user.check_password(password):
            return raise_error(401, "Wrong password")

        data = {}
        data['access_token'] = create_access_token(identity=email)
        data['user'] = user.serialize

        response = {
                "status": 200,
                "data": [data]
                }

        return response
```

The **SignUp** and **SignIn** endpoints first validate the input data before
proceeding with any further processing. Much of the code is completely
self-explanatory and there isn't much that can be added by way of further
analysis.

We have also added new validation functions in the `utils.py` module in the
`common` package, namely `validate_email` and `validate_password`.

```python
"""
app.api.v1.common.utils
~~~~~~~~~~~~~~~~~~~~~~~~

some common utility functions
"""
import re
import string
from flask import jsonify

EMAIL_PATTERN = re.compile(r".+@[\w]+\.[\w]")

# ... previous code

def valid_email(email):
    if EMAIL_PATTERN.match(email):
        return email

def valid_password(password):
    special_char_present = False
    for char in password:
        if char in string.punctuation:
            special_char_present = special_char_present or True
    digit_present = False
    for char in password:
        digit_present = digit_present or char.isdigit()

    if special_char_present and digit_present:
        if len(password) >= 5:
            return True
```

The `validate_email` function basically uses a regular expression to check
that the email is of the correct format. The `validate_password` function uses
manual pattern matching using strings to check that the password adheres to
the specifications established earlier in our tests.

Finally, let's update our `User` model as follows.

```python

# ..  previous code

class User(db.Model):

    __tablename__ = 'users'

    # ... previous code

    @property
    def serialize(self):
        return {'id': self.id,
                'username': self.username,
                'email': self.email,
                'firstname': self.firstname,
                'lastname': self.lastname,
                'createdon': self.createdon.strftime('%a, %d %b %Y %H:%M %p')
                }


    # ... next code

```

Here, we have added a `serialize` method that returns the pertinent fields we
want displayed in a JSON serializable (basically a sequence) format. The
method has been decorated with a decorator called `property`. This permits us
to call an instance of this class using the expression `user.serialize`
instead of `user.serialize`. This is just for aethestics and personal style.

Run the tests again.

`(venv)$ pytest`

The tests should now pass.

Commit your changes to version control and push them to the remote repo.
Ensure everything works before proceeding.

### Protecting API Endpoints.

Protecting our API endpoints is a simple matter of decorating them with the
`jwt_required()` decorator supplied by **Flask-JWT-Extended**. To get the
identity of a **JWT** in a protected endpoint, use the `get_jwt_identity()`
function.

To protect our endpoints, we will add the `jwt_required` decorator to each
one. In the `items.py` module, add the following code.

```python

# ... previous code

from flask_jwt_extended import jwt_required, get_jwt_identity

class ItemAPI(Resource):

    @jwt_required
    def post(self):
        # ... code

    @jwt_required
    def get(self, id=None):
        # ... code

    @jwt_required
    def patch(self, id, field):
        # ... code

    @jwt_required
    def delete(self, id):
        # ... code

```

To create custom error messages, update the `errors.py` in the `common`
package as follows.

```python
"""
app.api.v1.common.errors
~~~~~~~~~~~~~~~~~~~~~~~~~

Custom error messages
"""

from flask import jsonify
from app import jwt

def raise_error(status_code, message):
    """
    Return a custom error message
    """
    response = jsonify({"status": status_code,
                        "error": message})
    response.status_code = status_code

    return response

@jwt.invalid_token_loader
def invalid_token_callback(error_msg):
    """
    Returns a custom 422 error message when a user
    provides an invalid token.

    error: Bad authorizaation header
    """
    return raise_error(422, error_msg)

@jwt.unauthorized_loader
def unauthorized_callback(error_msg):
    """
    Called when invalid credentials are provided.

    error: Unauthorized
    """
    return raise_error(401, error_msg)

@jwt.expired_token_loader
def expired_token_callback():
    """
    Returns a custom error message when a user provides
    an expired token
    """
    return raise_error(401, "Token has expired")

@jwt.revoked_token_loader
def revoked_token_callback():
    """
    Returns a custom error message when a user provides
    an expired token
    """
    return raise_error(401, "Token has been revoked")
```

These decorators are provided by `flask-jwt-extended`. Whenever an error is
raised, the appropriate callback is called and a custom error response is
returned.

Update the tests to incorporate authentication functionality as follows.

```python

# tests.v1.test_items

import json
import pytest
from .util import make_token_header


# test data
TEST_ITEM = {'itemname': 'ball', 'category': 'soccer',
             'description':'something to kick'}

def test_create_item(client, auth):
    # No token, unauthorized error
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 401

    # Create a user and aquire the access token
    auth.signup()
    access_token = auth.access_token
    token_header = make_token_header(access_token)
    invalid_token_header = make_token_header(access_token + 'k')

    # Invalid token, 422 error
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=invalid_token_header)
    assert response.status_code == 422

    # use the token to access endpoint
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=token_header)
    assert response.status_code == 201
    assert response.headers['Location'] is not None

    # Invalid requests
    # blank fields should not be in input data
    response = client.post('/api/v1/items', data={'itemname': '', 'category': '',
                                                  'description':''},
                                                  headers=token_header)
    assert response.status_code == 400
    response = client.post('/api/v1/items', data={'itemname':' ',
                                                  'category':'   ', 'description':'   '},
                                                  headers=token_header)
    assert response.status_code == 400

    # Test all three fields should be present
    response = client.post('/api/v1/items', data={'itemname':'ball', 'category':'soccer'},
            headers=token_header)
    assert response.status_code == 400
    response = client.post('/api/v1/items', data={'itemname':'jersey'},
            headers=token_header)
    assert response.status_code == 400


def test_get_an_item(client, auth):
    # No token, unauthorized error
    response = client.post('/api/v1/items', data=TEST_ITEM)
    assert response.status_code == 401

    # Create a user and aquire the access token
    auth.signup()
    access_token = auth.access_token
    token_header = make_token_header(access_token)
    invalid_token_header = make_token_header(access_token + 'k')

    # Invalid token
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=invalid_token_header)
    assert response.status_code == 422

    # Add some test data to the database
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=token_header)
    assert response.status_code == 201

    response = client.get('/api/v1/items/1', headers=token_header)
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert len(data['data']) == 1
    item = data['data'][0]
    assert len(item) > 0

    # test invalid requests

    # Non-existent id
    response = client.get('/api/v1/items/99999', headers=token_header)
    assert response.status_code == 404
    # Invalid ID type - bad request
    response = client.get('/api/v1/items/item1', headers=token_header)
    assert response.status_code == 400

def test_get_item_collection(client, auth):
    # No token, unauhorized error
    response = client.get('/api/v1/items')
    assert response.status_code == 401

    # Create a user and aquire the access token
    auth.signup()
    access_token = auth.access_token
    token_header = make_token_header(access_token)
    invalid_token_header = make_token_header(access_token + 'k')

    # Invalid token
    response = client.get('/api/v1/items', headers=invalid_token_header)
    assert response.status_code == 422

    response = client.get('/api/v1/items', headers=token_header)
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert not data['data'] # Nothing yet

    # Create some test_items
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=token_header)
    assert response.status_code == 201
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=token_header)
    assert response.status_code == 201

    response = client.get('/api/v1/items', headers=token_header)
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
def test_patch_an_item(client, auth, path, data, invalid_field, invalid_id):
    """ Tests for patch endpoint"""
    # No token header, unauthorized error
    response = client.patch(path, data=data)
    assert response.status_code == 401

    # Create a user and aquire the access token
    auth.signup()
    access_token = auth.access_token
    token_header = make_token_header(access_token)
    invalid_token_header = make_token_header(access_token + 'k')

    # Invalid token
    response = client.patch(path, data=data, headers=invalid_token_header)
    assert response.status_code == 422

    # Item does not exist
    response = client.patch(path, data=data, headers=token_header)
    assert response.status_code == 404
    assert b'status' in response.data
    assert b'error' in response.data

    # create test data
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=token_header)
    assert response.status_code == 201

    # patch an item: success
    response = client.patch(path, data=data, headers=token_header)
    assert response.status_code == 200
    resp_data = json.loads(response.data.decode('utf-8'))['data'][0]
    # check that the value in input data used to update the field is
    # present in the json response of this request
    assert True in [v in resp_data.values() for v in data.values()]

    # Non-matching fields: error
    response = client.patch(path, data=invalid_field, headers=token_header)
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

    # Too many fields
    response = client.patch(path, data={'category':'cricket',
                                        'description': 'bowling game'},
                                        headers=token_header)
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

    response = client.patch(path,
                            data={'category':'cricket',
                                  'itemname': 'bat',
                                  'description': 'blowling game'},
                            headers=token_header)
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

    # Non-existent id
    response = client.patch(invalid_id, data=data, headers=token_header)
    assert response.status_code == 404
    assert b'status' in response.data
    assert b'error' in response.data

    # invalid update field
    response = client.patch('/api/v1/items/1/product',
                            data=data, headers=token_header)
    assert response.status_code == 400
    assert b'status' in response.data
    assert b'error' in response.data

def test_delete_item(client, auth):
    # No token, 401 error
    response = client.delete('/api/v1/items/1')
    assert response.status_code == 401

    # Create a user and acquire the access token
    auth.signup()
    access_token = auth.access_token
    token_header = make_token_header(access_token)
    invalid_token_header = make_token_header(access_token + 'k')

    # Invalid token
    response = client.delete('/api/v1/items/1', headers=invalid_token_header)
    assert response.status_code == 422

    # Item does not exist
    response = client.delete('/api/v1/items/1', headers=token_header)
    assert response.status_code == 404

    # create test data
    response = client.post('/api/v1/items', data=TEST_ITEM, headers=token_header)
    assert response.status_code == 201

    # successful delete
    response = client.delete('/api/v1/items/1', headers=token_header)
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))['data']
    assert data[0]['id'] == 1

    # Non-existent id
    response = client.delete('/api/v1/items/99999', headers=token_header)
    assert response.status_code == 404

    # Invalid id type, should be an int
    response = client.delete('/api/v1/items/item-1', headers=token_header)
    assert response.status_code == 400

```

Note that we have added an `auth` fixture to each test function to compute the
access tokens and geneate the token headers for accessing each endpoint. The
token header is then passed to each request using the `headers` key.

Appropriate error responses should be generated for the cases where the token
header is either invalid or missing.

The update to the `auth` fixture in the `conftest` module is shown below.

```python

# tests.v1.conftest

# ... previous code

class AuthActions(object):
    """
    This class provides methods for authenticating users.
    """

    DEFAULT_USER_LOGINS = {'email':'user@example.com', 'password':'r@78hy'}

    def __init__(self, client):
        self._client = client
        self.access_token = None

    def signup(self, **kwargs):
        user_data = kwargs
        if not kwargs:
            user_data = self.DEFAULT_USER_LOGINS
        response =  self._client.post('/api/v1/auth/signup', data=user_data)
        data = json.loads(response.data.decode('utf-8'))
        self.access_token = data['data'][0]['access_token']

        return response

    def login(self, **kwargs):
        user_data = kwargs
        if not kwargs:
            user_data = self.DEFAULT_USER_LOGINS
        response =  self._client.post('/api/v1/auth/signin', data=user_data)
        data = json.loads(response.data.decode('utf-8'))
        self.access_token = data['data'][0]['access_token']

        return response


    def logout(self, **kwargs):
        return self._client.delete('/api/v1/auth/logout')

@pytest.fixture
def auth(client):
    return AuthActions(client)

```

The `auth` fixture is initialized by passing it as a parameter to the test
functions. Then when we call `auth.signup`, we create a new user and a new
access token. These are used subsequently in the rest of the tests.

The `make_token_header` function is a helper function for creating a new
header. This header is called the `Authorization` header. All helper functions
for our tests will be defined in the `util` module in `tests.v1` package.

```python

# tests.v1.util

def make_token_header(token):
    return {'Authorization: Bearer {}'.format(token)}

```

Run the tests once more and ensure they all pass.

Push the changes you have made to this branch to the remote repo.

`(venv)$ git push origin ft-jwt-authentication`

If everything went well, you should get a passing build.

Note that the process we have undergone to reach here is not typical of the
actual development process. Along the way you'd normally add to your features
bit by bit, tweaking stuff here and there, adding new tests that you hadn't
thought of before but are critical nonetheless and so on and so forth
until everything is swell. Only that you may never be actually _done_. You may
need to refactor your code to make it more readable and more efficient as needs
arise. Development can turn out to be a very non-linear process.

Next we are going to add functionality for blacklists and token revocation.
Check out [part 5]({{ '/flask/python/2019/03/13/catalog-api-part5.html'| relative_url }})
of this series for more.
