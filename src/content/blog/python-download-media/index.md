---
title: "Downloading Media Files in Python using the requests library"
description: ""
author: "John Paul"
date: "2019-09-22"
tags: ["python"]
---

In this post, we'll look at ways that you can use to quickly and efficiently
download media files from the internet. Media files here would include videos
and images.

The requests library is some sort of a swiss army knife when it comes to all
things related to http requests in Python. I'll use this library to show you how you can
dowload stuff.

## Downloading images

Let's start with an example.

```python

import requests

# Fake url. Use a valid url that points to an image in your examples

img_url = 'https://www.mycats.com/my-cat.jpeg'
resp = requests.get(img_url, allow_redirects=True)

with open('my-image-name.jpeg', 'wb') as f:
f.write(resp.content)

{% endhighlight %}

And that's all there is to it. Pretty neat.

## Downloading videos

Downloading videos using the requests is equally straightforward.

Check out the example that follows.

{% highlight python%}
video_url = 'www.cars.com/toyoto.mp4'

resp = requests.get(video_url, stream=True)
with open(video_path, 'wb') as in_file:
for chunk in resp.iter_content(chunk_size=1024):
if chunk:
in_file.write(chunk)
in_file.flush()

```

When downloading videos, it's best to set the `stream` flag to `True`. This
ensures that `requests` streams the content instead of downloading the entire
thing into memory before it's given back to you.

We then iterate over the streamed content chunk by chunk using the `iter_content`
method. This downloads the file part by part. In our case, the video will be
downloaded in 1024 byte chunks.

That's all the code you'll need to download a video, of course with some
customizations depending on the complexity of your project.
