---
title: "Adding pagination to your Jekyll site"
description: ""
author: "John Paul"
date: "2019-09-08"
categories: ["jekyll"]
---

In blogs, it's pretty common to list posts over multiple pages. Jekyll provides
a way to automatically list your posts over multiple numbered pages. Having to
scroll over a long list of numerous posts can be pretty annoying and results in
poor user experience.

So, how can you add pagination to your site? The process is pretty simple. All
we have to do is leverage Jekyll's plugin system. Plugins are a way to quickly
add extra functionality to a Jekyll site without too much hastle.

For pagination, Jekyll offers a pagination plugin called `jekyll-paginate`. To
add this plugin to your site, locate your `_config.yml` file and under the
plugins section, add the `jekyll-paginate` plugin. Then run `gem install jekyll-paginate`.

Adding the plugin is just the first step. Still in the `_config.yml` file, add
the following settings:

```rb
# Number of listings per page
paginate: 5

# Paginate path
paginate_path: /blog/page:num/
```

The paginate setting specifies the maximum number of posts per page. The
`paginate_path` setting specifies where each pagination page will be output i.e
the first 5 posts will be output in the `/blog/page1/` directory and so on.

Then in the file where you have your post listings (this would be where you loop
through `site.posts`), change `site.posts` to `paginator.posts`. The
`jekyll-paginate` plugin provides a paginator liquid object that you can use to
loop through all the posts.

Finally, to display the pagination links at the bottom of the page, add the
following code to the file in which you loop through the posts.

{% highlight html %}
{% raw %}

<!-- Pagination links -->
<div class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path }}" class="previous">
      Previous
    </a>
  {% else %}
    <span class="previous">Previous</span>
  {% endif %}
  <span class="page_number ">
    Pag;e: {{ paginator.page }} of {{ paginator.total_pages }}
  </span>
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path }}" class="next">Next</a>
  {% else %}
    <span class="next ">Next</span>
  {% endif %}
</div>

{% endraw %}
{% endhighlight %}

And that's it.
