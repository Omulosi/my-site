---
title: "Managing pdf files in Linux"
description: ""
author: "John Paul"
date: "2019-02-01"
tags: ["linux"]
---

Managing `pdf` files is relatively easy in Linux. It does not take too much imagination.
Linux comes pre-packaged with easy to use commands for managing your `pdf` files. By managing
here I mean splitting or merging or coverting from `docx` to `pdf`. These are what we shall cover.

## Merging pdf files

`pdftk` is a free command-line tool used to split or merge pdf files in linux.

Use `apt` package manager to install it.

`sudo apt-get install pdftk`

Then, to merge two or more pdf files, use the command below.

`pdftk file1.pdf file2.pdf ... cat outfile.pdf`

Another tool for merging pdf files is called **poppler**. This is a free PDF
rendering library.

Install it as follows.

`sudo apt-get install poppler-utils`

Using it is as simple as executing a command such as the one below.

`pdf-unite file1.pdf file2.pdf ... outfile.pdf`

## Converting docx files to pdf

Linux comes with a command called `lowriter` that is used to convert files
form docx to pdf format. This command is part of the libreoffice suite so
there is no need to install anything.

To use it, execute:

`lowriter --convert-to pdf x.docx`
