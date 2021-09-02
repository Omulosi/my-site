---
title: "Customizing CSS in your Jekyll theme"
description: ""
author: "John Paul"
date: "2018-09-25"
categories: ["jekyll", "css"]
---

Jekyll has an extensive theme system that allows you to customize the look and feel
of your site. Themes usually come pre-packaged with their own styles and templates.
However, these styles can easily be overridden by your site's content. The
following steps provide a quick way of incorporating a custom css stylesheet to
your site thereby extending or overriding the styles provided by the theme used
to generate your site. I will demonstrate this process using the `minima`
theme, a default theme that Jekyll uses if you do not specify one.

- Jekyll uses a `main.scss` file, found in the **/assets** folder of the
  theme's directory to generate the `main.css` file. This is the `main.css` that
  is located in the **sites** folder after you start the engine. To use your own custom styles, create a local **/assets** directory in your site's root and in
  it put your our own version of the `main.scss` file. Then populate it with
  the code below.
  {% highlight css%}

  ***

  ***

  @import "minima";
  {% endhighlight%}
  This statement imports the styles already predefined in the theme.
  You have to include the two triple dashes to enable this file to be
  processed by jekyll.

- Add your custom css styles below the import statement. Then serve the
  site afresh.

If you omit these steps, your site may display some weird behaviors. For
example, syntax highlighting of code snippets may not work properly.

Check out the [Jekyll docs][jekyll-docs] for more information.

[jekyll-docs]: https://jekyllrb.com/docs/themes
