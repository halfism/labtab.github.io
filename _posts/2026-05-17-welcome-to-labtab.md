---
layout: post
title: "Welcome to labtab"
date: 2026-05-17 10:00:00 +0800
categories: [Blog]
tags: [Jekyll, GitHub Pages, Introduction]
toc: true
comments: true
excerpt: "Welcome to my personal blog! Here I share thoughts on code, design, and technology."
---

## Hello World

Welcome to **labtab** — my new personal blog built with Jekyll and deployed on GitHub Pages.

This blog features a custom dark theme with **neumorphism** and **glassmorphism** design elements, inspired by the Orion UI Kit aesthetic.

## What You'll Find Here

I'll be writing about:

- Web development techniques and best practices
- Software engineering insights
- Design systems and UI/UX explorations
- Open source contributions and discoveries

## How This Blog Works

This blog is powered by [Jekyll](https://jekyllrb.com/), a static site generator that transforms Markdown files into a beautiful website.

### Adding a New Post

To create a new post, simply add a Markdown file to the `_posts` directory with the following naming convention:

```
YYYY-MM-DD-your-post-title.md
```

Each post starts with front matter like this:

```yaml
---
layout: post
title: "Your Post Title"
date: 2026-05-17 10:00:00 +0800
categories: [Category]
tags: [tag1, tag2]
toc: true
comments: true
---
```

### Code Highlighting

The blog supports syntax highlighting for various languages:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return { message: 'Welcome to labtab' };
}
```

```python
def fibonacci(n):
    """Generate fibonacci sequence."""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
```

## Features

Here's what's included in this blog:

1. **Search** — Press `Ctrl+K` to search through all posts
2. **Categories & Tags** — Organized content navigation
3. **Comments** — Powered by Giscus (GitHub Discussions)
4. **Responsive** — Looks great on all devices
5. **Dark Theme** — Easy on the eyes with purple-blue accents

> "The best way to learn is to build and share." — A wise developer

## What's Next

Stay tuned for upcoming posts. I'm excited to share my journey and learnings with you.

---

*Thanks for reading! Feel free to leave a comment below.*
