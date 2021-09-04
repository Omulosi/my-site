---
title: "Building Web APIs with flask - Part 3: Continuous Integration using Travis CI"
description: ""
author: "John Paul"
date: "2019-03-10"
tags: ["flask", "python"]
---

In this part, we are going to cover how to set up Continuous Integration (CI)
using [TravisCI](https://travis-ci.org/)

Let's consider this scenario.

You want to build a new feature for your application. So you create a new
feature branch, add the necessary tests that this feature would need to pass,
and proceed to build the feature. Adding code and testing till you are done,
i.e. when all the tests pass. Then you push your changes to the remote repo
containing the project.

Pushing the changes to the remote triggers a remote server that automatically
builds and executes the tests on your changes. The build can either pass or
fail. A failing build definitely means your changes cannot be incorporated
into the main development branch, at least not just yet. You need to fix the
offending bug and try again. A passing build means the probability of your
changes breaking up everything is minimal. So, depending on the workflow under
which you are working, you raise a pull request and hopefully your changes and
brand new feature get merged into the main branch smoothly.

You do this every time there's a new feature to be developed. The changes you
make/the feature you develop may be a small thing that can be done in a few
hours or may be a major change, either way you ensure you push your changes
as often and as early as possible, not waiting till it's too complex or
'mature' enough. Tests get run as early and as frequently as possible.
Possible bugs get caught the moment they arise, and considering that the
changes made are mostly bite-sized chunks, the bugs get quickly resolved.

The scenario described above is an inkling of what agile development and
Continuous Integration involve.

[Continuous
Integration](https://martinfowler.com/articles/continuousIntegration.html){:target="\_blank"}
or CI is the process whereby changes are automatically built and tested as
often and as early as possible. This is very important especially when it
comes to collaboration. It enables developers focus on their core task of
problem solving without worrying too much about what bugs they may introduce
to the codebase each time a change is made. It builds confidence that you are
developing a stable software.

We will implement CI in our project using the popular
[TravisCI](https://travis-ci.org/){:target="\_blank"}. This is a Continous
Integration service that provides external servers which automatically build
and test your changes every time you make a commit.

To get set, register on their [site](https://travis-ci.org/){:target="\_blank"}
and follow the set up instructions to link up your github respository (I
assume you already have a github account).

With everything set up, we are now going to add a badge to the README file. In
your travis account, navigate to the home page and click the badge at the top,
the one reading `build failing`.

![Travis Badge]({{ '/assets/img/travis.png' | relative_url }})

In the dialog box that appears, copy the markdown link and paste it at the top
of your README file in your local repository. The badge is used to signal
whether the changes you have committed passed all tests or not, without having
to go to the TravisCI site.

Then in your local repo, create `.travis.yml` file. This is the configuration
file for travis and will be used to tell the remote CI server what commands
to run. Populate the file with the following code.

```yml
language: python
python:
  - "3.5.2"
env:
  global:
    - TEST_DATABASE_URL="postgresql+psycopg2://jp:cavier@localhost:5432/catalog_testdb"
services:
  - postgresql
install:
  - pip install -r requirements.txt
before_script:
  - psql -c 'create database catalog_testdb;' -U postgres
  - psql -c "create user jp with password 'cavier';" -U postgres
script:
  - pytest
after_success:
  - coveralls
```

A `.yml` file uses the **YAML** language, a data serialization language to
organize data. Data in a YAML file is basically organized as key-value pair, with a
colon separating them. When more than one value is to be represenated by a
key, each value is prepended by a dash. Indentation is used to make file more
readable.

The `language` key specifies the language(s) used by your application, in this
case Python.The `python` key specifies the version of the language used. `env`
is used to set environment variables. `services` specifies an external service
required during running og tests.`install` specifies installation command for
the app's dependencies. `before_script` and `script` set the stage for running
the tests. After all tests pass, the command `coveralls` is run to get the
coverage report. We will cover this shortly.

Commit this file using git.

Code-coverage is the ying to testing's yang. They go hand in hand. It
represents fraction of the application's code that get covered by the tests.
This value is given as percentage.

We will use coveralls to get the code-coverage. Go to
[Coveralls](https://coveralls.io/){:target="\_blank"} site and create an
account. Follow the instructions for linking it up with your github account.

Add your repository to be tracked by coveralls.

Make a copy of the `repo_token` that's normally generated after everything is
set up.

Just as you did in TravisCI, click on the coveralls badge and copy the
markdown link. Ensure it points to your main branch, for our case it's the
master branch. Paste the link just after the travis link in your README file.

Coveralls also requires a configuration file. This file is called
`.coveralls.yml`. Create in your application's root and populate it as
follows.

```yml
repo_token: yCt6NqkWYr5KjwLHTTeI7Ja5NxZ7Pnu2m
service_name: travis-ci
```

In your local repo, run the following command.

`(venv)$ pip install python-coveralls`

This installs the necessary tools for obtaining the code coverage.

Update the requirements file.

`(venv)$ pip freeze | grep -v "pkg-resources" > requirements.txt`

Add and commit your changes.

Push the changes to the remote repo.

`(venv)$ git push remote origin`

The build in TracisCI's server should start automatically. You can
observe the entire process from your TravisCI's account.

When everything proceeds as expected, the build badge in your README should
turn to green and the coverage badge should indicate the percentage of code
covered.

![Readme badges]({{ '/assets/img/readme_badges.png' | relative_url }})

Next, we are going to implement **authentication** using [JSON Web
Tokens](https://jwt.io/introduction/){:target="\_blank"}.

Checkout [part 4]({{ '/flask/python/2019/03/11/catalog-api-part4.html'| relative_url }})
