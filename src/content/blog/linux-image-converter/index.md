---
title: "Converting images from the linux command line"
description: ""
author: "John Paul"
date: "2019-09-28"
tags: ["linux"]
---

There are times when you might have need for converting between different
image formats. This is pretty easy to accomplish in Linux with the ImageMagick
software utility suite. ImageMagick is the swiss-army knife of command line
image manipulation tools. It's fast, efficient and easy to use.

To check whether it's already installed, run the following command.

```bash
$which convert
```

This will display the location of the convert binary, if imagemagick is
installed. If not, install it using the following command:

```bash
$sudo apt-get install imagemagick
```

## Usage

To convert between different image formats, we use the `convert` utility. Run
the following command.

```bash
$ convert example.png example.jpg
```

This command will convert `example.png` to `example.jpg`. You can use any name
for the output image file. The general command is as follows.

```
$ convert input_file [options] output_file
```

You can also resize your images.

```
$ convert example.jpg -resize 500x200 example-result.jpg
```

`convert` will try to preserve the aspect ratio of the image.

If you want to change the quality of your images, this is also possible.

```
$ convert example.png -quality 90 example-new.jpg
```

You may want to do this if you have, say a large `.png` file that you want to
convert to a smaller `jpg` file. In this case, you will reduce the quality of
the original `png` file and then convert to the smaller `jpg` file.

You can rotate images too.

```
$ convert example.png -rotate 90 example.png
```

`convert` also allows you to create **GIFs**. If you have several `jpg` files in
some directory, you can make them into a gif using the following command.

```
$ convert *.jpg test.gif
```

`convert` is a nifty tool that offers a plethora of options for manipulating your
images. We've barely scratched the surface, there's still so much more that if
offers.

Check the [convert man page](https://linux.die.net/man/1/convert)
to learn more of its features and use cases
