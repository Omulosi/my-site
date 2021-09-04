---
title: "Managing multiple python versions with pyenv"
description: ""
author: "John Paul"
date: "2018-11-17"
tags: ["python", "programming"]
---

**Pyenv** is a super simple utility that makes working with different **python**
versions a breeze. If you have used ruby before, then most certainly you know about
`rbenv`, that swiss knife of ruby utilities that makes installing and managing
ruby packages very easy and without too much hustle. `pyenv` is also along those
lines but for the python environment. This quick guide will only cover using pyenv
in a linux environment.

## Installing pyenv

1.  First clone the `pyenv` repo where you want it installed. You may want to do this
    under `$HOME/.pyenv`, though any other folder is still fine. It's up to
    you. Use the command below to clone the repo into a .pyenv folder in your
    home directory.

    `git clone https://github.com/pyenv/pyenv.git ~/.pyenv`

2.  Define an environment variable called **PYENV_ROOT**. Make it point to the
    location of the pyenv repo you cloned in step one above. Then add
    `PYENV_ROOT/bin` to your `$PATH`. This will allow you to use the `pyenv`
    command from the command-line. Use the following commands.

    ```bash
    $ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
    $ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
    ```

3.  Add a `pyenv init` command to your shell to enable shims and
    autocompletion. Shims are lightweight executables that reroute your
    commands to pyenv.

    ```bash
    $ echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv
    init -)"\nfi' >> ~/.bash_profile
    ```

4.  Restart your shell so the changes to path take effect. (Another option is
    to source your `.bashrc` file). Use either of the following commands:

        	`$ exec "$SHELL"`

        	`$ source ~/.bashrc`

## Using pyenv to manage multiple python versions

After carrying out the above steps successfully, using `pyenv` to manage
multiple python verisions is easy and straightforward.

Start by viewing all the available python versions:

`$ pyenv install -l`

Installing a particular python version is a breeze. For example, to instal
python2.6.6, simple execute the following command.

`$ pyenv install 2.6.6`

You can view all the python versions available to pyenv as so:

`$ pyenv versions`

Your default python version set by the system is not changed by pyenv unlesss
you explicitly tell it to. To check the global python version:

`$ python --version`

To set a new global version using pyenv:

`$ pyenv global 2.6.6`

Another feature of pyenv is that it allows you to install different python
versions of python local to particular directory which is pretty cool. For
example, say you are building a project using Python 3.6.6. Simply navigate to
the project folder and set a local python version (3.6.6 for our case) for
that project.

```bash
$ cd new_python_project/
$ pyenv local 3.6.6
```

To revert to the default python interpreter that was initially installed:

`$ pyenv local system`

or

`$ pyenv global system`

## Uninstalling pyenv

1. Remove the `pyenv init` line from your `.bashrc` or `.bash_profile` file.

2. Delete the root directory. This is the directory into which you cloned the
   pyenv executables from github.

   `$ rm -rf $(pyenv root)`

That's the long and short of it.

Check out this [article]() on how to use virtual environments with pyenv.
