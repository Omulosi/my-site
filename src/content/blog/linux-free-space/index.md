---
title: "Freeing up space in your Linux system"
description: ""
author: "John Paul"
date: "2019-09-08"
tags: ["linux"]
---

Occasionally, there are times when your disk would get full. This may have some
adverse side effects on your system. Linux provides a number of ways to free
disk space.

But first, you need to analyze what files and folders are taking up most of the
disk space. Linux provides a nifty tool for this called `ncdu`. It'll analyze
and compute the disk usage of all files and folders in your system. It even
allows you to check disk usage by sub-folders and so on so that you can be prety
sure of what is eating up all that space, and delete the unnecesary stuff that
won't have any long term effects.

Almost always, the `~/.cache` folder will contain stuff that may have been
accessed ages ago.

Use the following command to check all files that were accessed more than a year
ago.

```
find ~/.cache/ -depth -type f -atime +365
```

To delete them, run:

```
find ~/.cache/ -type f -atime +365 -delete
```

Check what's eating up most of your space and delete the superflous stuff. The
`ncdu` tool makes this pretty easy. It's important you don't get into the habit
of deleting stuff especially when you are starting out. You might delete something
that may have detrimental effects to your system, so proceed with caution.
