---
title: "Managing disk partitions in Linux"
description: ""
author: "John Paul"
date: "2019-01-31"
tags: ["linux"]
---

The `fdisk` (format disk/fixed disk) command is used to view, create, resize,
delete, change, copy and/or move partitions on a hard-drive. You must use the
command as root.

To list all disk partitions:

`fdisk -l`

To view a specific disk partion, use a command such as the one below:

`fdisk -l /dev/sda`

To check the size of a partition, use the command illustrated below:

`fdisk -s /dev/sda2`

To get full information on disk space usage, the `df` command comes in handy.

`df`

`df -a`

To get the results in a more human readable form:

`df -h`

To get the information in bytes or MB, use either one of the commands below.

`df -k`

`df -m`
