---
layout: post
title: "Setting Up a Modern Development Environment"
date: 2026-05-16 14:00:00 +0800
categories: [Tech]
tags: [Development, Tools, Productivity]
toc: true
comments: true
excerpt: "A guide to setting up a productive development environment with modern tools and workflows."
---

## Why Your Dev Environment Matters

A well-configured development environment can significantly boost your productivity. In this post, I'll share my current setup and the tools I find essential.

## Essential Tools

### Terminal

A good terminal is the foundation of any dev setup. Here are my recommendations:

- **Windows Terminal** — Great for Windows users, supports tabs and panes
- **iTerm2** — The gold standard for macOS
- **Alacritty** — Cross-platform, GPU-accelerated

### Code Editor

Visual Studio Code remains my editor of choice for its extensibility and performance:

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono",
  "editor.fontLigatures": true,
  "editor.minimap.enabled": false,
  "workbench.colorTheme": "One Dark Pro"
}
```

### Version Control

Git is non-negotiable. Here are some useful aliases:

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
```

## Package Managers

Different ecosystems require different package managers:

| Language | Manager | Lock File |
|----------|---------|-----------|
| Node.js  | pnpm    | pnpm-lock.yaml |
| Python   | uv      | uv.lock |
| Ruby     | Bundler | Gemfile.lock |
| Rust     | Cargo   | Cargo.lock |

## Conclusion

The key is finding tools that work for you and investing time in configuring them properly. The upfront cost pays dividends in daily productivity.

> "First, solve the problem. Then, write the code." — John Johnson
