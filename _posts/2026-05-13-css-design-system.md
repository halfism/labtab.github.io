---
layout: post
title: "CSS 设计系统实战：从零搭建你的组件库"
date: 2026-05-13 10:30:00 +0800
categories: [设计]
tags: [CSS, 设计系统, 组件库, Sass]
toc: true
comments: true
excerpt: "一套好的设计系统是团队协作的基石。本文介绍如何用 CSS 自定义属性和 Sass 从零构建一个可扩展的设计系统。"
---

## 什么是设计系统

设计系统不只是 UI 组件库，它是**团队共同遵守的设计语言**——包括颜色规范、字体比例、间距系统、交互规则。

一个好的设计系统能做到：
- 保证 UI 视觉一致性
- 加速开发（复用而非重复）
- 降低沟通成本（设计师与开发者说同一种语言）

## 第一步：Design Tokens（设计令牌）

Design Tokens 是设计系统的原子，将抽象的设计决策存储为具名变量。

### 颜色系统

不要直接使用颜色值，要赋予语义：

```scss
// ❌ 反例：硬编码颜色
.button { background: #6c63ff; }

// ✅ 正例：语义化命名
:root {
  /* Primitive tokens（基础颜色） */
  --color-purple-500: #6c63ff;
  --color-purple-600: #5a52e0;
  --color-blue-500:   #3b82f6;

  /* Semantic tokens（语义颜色） */
  --color-primary:     var(--color-purple-500);
  --color-primary-hover: var(--color-purple-600);
  --color-bg-base:     #0f0a1e;
  --color-text-primary: #e8e6f0;
}

.button { background: var(--color-primary); }
```

### 间距系统

使用 4px 基础单位（`base-4` 系统）：

```scss
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### 字体比例

使用模块化比例（Modular Scale），本例采用 `1.25` 比例（Major Third）：

```scss
:root {
  --text-xs:   0.64rem;   /* 10.2px */
  --text-sm:   0.8rem;    /* 12.8px */
  --text-base: 1rem;      /* 16px   */
  --text-lg:   1.25rem;   /* 20px   */
  --text-xl:   1.563rem;  /* 25px   */
  --text-2xl:  1.953rem;  /* 31px   */
  --text-3xl:  2.441rem;  /* 39px   */
}
```

## 第二步：组件设计

### Button 组件

一个完整的 Button 应该覆盖所有状态（default, hover, focus, active, disabled）和变体（primary, secondary, ghost）：

```scss
.btn {
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: var(--text-sm);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  /* Focus 可访问性 */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Disabled 状态 */
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Primary 变体 */
  &--primary {
    background: var(--color-primary);
    color: white;

    &:hover { background: var(--color-primary-hover); }
  }

  /* Ghost 变体 */
  &--ghost {
    background: transparent;
    border-color: var(--color-primary);
    color: var(--color-primary);

    &:hover { background: rgba(108, 99, 255, 0.1); }
  }

  /* Size 变体 */
  &--sm { padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }
  &--lg { padding: var(--space-3) var(--space-6); font-size: var(--text-lg); }
}
```

### Card 组件（复合组件）

```scss
.card {
  background: var(--color-surface);
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  overflow: hidden;

  &__header {
    padding: var(--space-4) var(--space-6);
    border-bottom: 1px solid var(--color-border);
  }

  &__body {
    padding: var(--space-6);
  }

  &__footer {
    padding: var(--space-4) var(--space-6);
    border-top: 1px solid var(--color-border);
    background: rgba(255, 255, 255, 0.02);
  }
}
```

## 第三步：文档化

每个组件都需要文档，包括：
- 使用场景
- Props/变体说明
- Do & Don't 示例
- 无障碍注意事项

> 没有文档的组件库，等于没有路标的城市。

## 深色模式支持

使用 CSS 自定义属性，深色模式切换只需重新定义根变量：

```scss
/* 浅色模式（默认） */
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-border: #e5e7eb;
}

/* 深色模式（系统自动或手动切换） */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f0a1e;
    --color-text: #e8e6f0;
    --color-border: rgba(168, 139, 250, 0.15);
  }
}

/* 手动切换 */
[data-theme="dark"] {
  --color-bg: #0f0a1e;
  --color-text: #e8e6f0;
}
```

---

设计系统是长期投资，初期会增加一些工作量，但随着项目规模增长，它带来的一致性和开发效率提升是巨大的。
