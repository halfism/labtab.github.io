# labtab

A personal tech blog built with Jekyll, deployed on GitHub Pages.

## Features

- Dark theme with neumorphism & glassmorphism design
- Client-side search (Ctrl+K)
- Categories & tags
- Giscus comments (GitHub Discussions)
- Responsive design
- RSS feed & SEO optimized

## How to Add a New Post

1. Create a new Markdown file in `_posts/` with the format: `YYYY-MM-DD-title.md`
2. Add front matter at the top:

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

3. Write your content in Markdown below the front matter
4. Push to `main` branch — GitHub Actions will build and deploy automatically

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

## Setup Comments

1. Enable GitHub Discussions on this repository
2. Create a "Blog Comments" category
3. Visit [giscus.app](https://giscus.app) to get your repo_id and category_id
4. Update `_config.yml` with the IDs

## License

MIT