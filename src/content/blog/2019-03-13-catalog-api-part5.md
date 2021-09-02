---
title: "Building Web APIs with flask - Part 5: Blacklist and Token Revoking"
description: ""
author: "John Paul"
date: "2019-03-13"
categories: ["flask", "python"]
---

In [Part 4]({{ '/flask/python/2019/03/12/catalog-api-part4.html'| relative_url }})
of this series, we looked at authentication and authorizarion. In
this part, we are going to go in depth on how you can revoke your tokens so
that they may no longer access your endpoints.

Before we embark on this, let's first see how to create `refresh tokens` for
our endpoints.

### Refresh Tokens

Suppose your access token gets stolen by an attacker. He may use it to access
your protected endpoints in your stead. To combat this, we incorporate refresh
tokens in our app. This method works by granting access tokens a much shorter
lifespan than refresh tokens. Then, when the evil attacker lays hold of your
precious access token, the damage he may do will be limited somewhat. He'll
only have a very small window to afflict you with any significant heartache
from the mess he may cause.

When the access token expires, as it will frequently do, the refresh token
is used to generate a brand new access token to be used for any subsequent
access to your enpoints. Until it expires, which will require you to generate
a new access token using the long lived refresh token and so on...

Let's modify our `auth.py` module to include the following code.

```python

"""
app.api.v1.auth
~~~~~~~~~~~~~~

Authentication views

"""

from flask_jwt_extended import create_access_token, create_refresh_token
from flask_restful import Resource, reqparse
from app.models import User
from app import db
from .common.utils import valid_email, valid_password
from .common.errors import raise_error

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
        #: set username to be same as email if it's not provided
        user = User(email=email, username=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        ###################################################
        ###################################################

        #: Create both access and refresh tokens
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)

        ###################################################
        ###################################################

        data = {}
        data['access_token'] = access_token
        data['refresh_token'] = refresh_token
        data['user'] = user.serialize

        response = {
                "status": 201,
                "data": [data]
                }

        return response, 201

class SignIn(Resource):

    def post(self):
        args = parser.parse_args()
        email = args.get('email', None)
        password = args.get('password', None)

        if email is None:
            return raise_error(400, "Missing 'email' in body")
        if password is None:
            return raise_error(400, "Missing 'password' in body")

        user = User.query.filter_by(email=email).first()
        if user is None or not user.check_password(password):
            return raise_error(401, "Bad email or password")

        #########################################################
        #########################################################
        # Create our JWTs
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)

        #########################################################
        #########################################################

        data = {}
        data['access_token'] = access_token
        data['refresh_token'] = refresh_token
        data['user'] = user.serialize

        response = {
                "status": 200,
                "data": [data]
                }

        return response

```

We have imported the `create_refresh_token` function from `flask_jwt_extended`
which operates in a similar manner to its cousin `create_access_token`, only
that the refresh token has a much longer expiration period. Both tokens are
returned in our response. The access token will be used for as long as it is
valid after which the refresh token will be used to generate a new access
token.

A new endpoint for generating a new access token using the refresh token needs
to be created.

Add the following code to the `app.api.v1.__init__.py` file.

```python

# app.api.v1.__init__

# ..previous code

from .auth import RefreshToken

api.add_resource(
        RefreshToken,
        '/auth/refresh',
        )

```

The `RefreshToken` resource is defined as shown in the following piece of
code.

```python

"""
app.api.v1.auth
~~~~~~~~~~~~~~

Authentication views

"""

# ...previous code

from flask_jwt_extended import jwt_refresh_token_required, get_jwt_identity

# ... previous code

class RefreshToken(Resource):
    """
    Creates a new access token
    """

    @jwt_refresh_token_required
    def post(self):
        """
        Returns a new access token
        """
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user)
        add_token_to_database(new_token, current_app.config['JWT_IDENTITY_CLAIM'])

        return {
            'status': 200,
            'data': [{'access_token': new_token
                     }]
            }
```

The `jwt_refresh_token_required` decorator is used to insure that only a valid
refresh token can be used to access this endpoint. The `get_jwt_identity`
function is used to get the identity of the refresh token used to access this
endpoint. This identity is then used to create a new access token.

The following is the test for our refresh token endpoint.

```python
"""
tests.v1.test_auth
~~~~~~~~~~~~~~~~~~

Tests for authentication
"""
# ... prev code

from .util import make_token_header

# ... previous code

def test_token_refresh(client, auth):

    auth.signup()
    refresh_token = auth.refresh_token
    access_token = auth.access_token
    bad_token = auth.refresh_token + '@'
    refresh_token_header = make_token_header(refresh_token)
    access_token_header = make_token_header(access_token)
    bad_token_header = make_token_header(bad_token)


    response = client.post('/auth/refresh', headers=refresh_token_header)
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))['data'][0]
    assert 'access_token' in data

    # Return bad authorization header error for all other cases
    response = client.post('/auth/refresh', headers=access_token_header)
    assert response.status_code == 422

    response = client.post('/auth/refresh', headers=bad_token_header)
    assert response.status_code == 422

```

Remember to update the `AuthActions` class in the `conftest` module to
return a refresh token also.

Run `pytest` and see to it that all tests pass.

Now to the more interesting part of this section, revoking tokens.

### Blacklist and Token Revoking

As I explained at the start of this section, revoking a token simply means
making it useless. These isn't much to how this is accomplished.

The concept is simple.

First we'd need a storage location for our tokens. This can either be a
traditional database or an in memory storage such as **redis**. Both have
their pros and cons. I will mostly focus on the database.

This storage location is what is referred to as the **blacklist**. It is used
to store user tokens and any metadata about the tokens. Each token accessing
an endpoint is compared against the blacklist to check whether it's revoked or
not.

This comparison check should be done each time a token is used to access an
endpoint.

If a given token is revoked, access is denied. It is, as it were, in the
dreaded blacklist.

And that's the crux of the entire process. Pretty simple, right?

**Flask-JWT-Extended** has a host of features that make implementing this
process as painless as possible.This is accomplished using ... you got it,
[decorators]({{ '/python/programming/2018/11/10/python-decorators.html' |
relative_url }}).

Let's flesh out these ideas by writing code.

As usual, our very first step will be to write tests for the features we are
going to implement.
