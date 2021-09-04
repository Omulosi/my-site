---
title: "Vim: Vundle Plugin Manager"
description: ""
author: "John Paul"
date: "2019-02-13"
tags: ["vim"]
---

This article assumes you are a fairly competent vim user. Vim by default is a
very lightweight editor with minimal capabilities. That is why it has a very
rich ecosystem meant to extend its features, using plugins.

Plugins provide
the extra functionality needed to make it more productive. To make this
process as pain-free and as straightforwars as possible, **plugin managers**
have been developed. These are plugins used to manage other plugins. A number
of them exist, with the two most popular being
[pathogen](https://github.com/tpope/vim-pathogen) and
[vundle](https://github.com/VundleVim/Vundle.vim). I will mainly focus on
vundle bacause that is what I am most familiar with.

## Vundle Plugin Manager

Vundle automates the process of installing vim plugins. It also automatically
carries out such tasks as tracking plugins, updating and even uninstalling
them.

To install vundle, refer to its
[documentation](https://github.com/VundleVim/Vundle.vim#quick-start){:target="\_blank"}.
The instructions are pretty straightforward.

To install a plugin, add it to the `.vimrc` file using the format
`<repo_name>/<plugin_name>` (for plugins contained in a github repo). Use the
template described in the vundle
[documentation](https://github.com/VundleVim/Vundle.vim#quick-start). The
`.vimrc` file is usually located in your home directory if you are using a
Unix machine.

Start your vim editor by typing `vim` at the command line and execute the
following command: `:PluginInstall`. Vundle automatically provides this
command for installing plugins specified in the `.vimrc` file. The
installation process is automatic and if everything goes well, a message to
the effect will be displayed. Vim will alert you in case of any error. And
that's all there is to it.

When plugins get installed without a plugin manager (vundle in our case),
everything gets sort of mixed up, making it hard to track
different plugins. Normally when a plugin is installed, the plugin
and all its relevant configuration files are stored in the `~/.vim` directory.
It is then split into different subdirectories based on functionality.
Additional plugins are also use this same directory hence files from different
plugins get mixed up in different directories making it very hard to track
them. Vundle resolves these issues.

It does this by first creating a top-level directory called `bundle` in the
`~/.vim` directory. It then creates a separate folder for each plugin in the
`bundle` directory. Each plugin re-creates its own directory structure
inside the directory specific to it. No more mix up. Everything gets contained
in a modular structure that is easy to track and maintain.

Vundle also provides some convenient interface commands for managing plugins.
We have already looked at `:PluginInstall` used to install plugins. Others
include `PluginList`, `PluginSearch`, `PluginClean` e.t.c. See `:h vundle` for
more details.
