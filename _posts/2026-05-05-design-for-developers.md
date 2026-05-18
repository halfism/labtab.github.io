---
layout: post
title: "开发者的设计课：让你的项目看起来专业"
date: 2026-05-05 10:00:00 +0800
categories: [设计]
tags: [UI设计, 视觉设计, 前端, 设计原则]
toc: true
comments: true
excerpt: "大多数开发者写的代码很好，但界面总是差那么一口气。这篇文章总结了我从做个人主页过程中学到的几条设计原则，不需要设计背景，照着做就有效果。"
---

## 你的界面为什么看起来「不够好」

有一种现象非常普遍：同一个功能，技术实现一模一样，但有的界面让人觉得「专业」，有的让人觉得「外包给了实习生」。

差别通常不在颜色，不在字体，而在于几个你可能从没注意过的细节。

---

## 原则一：留白不够，一切白费

这是开发者最常犯的错误。我们习惯性地把空间「利用起来」，结果把界面做成了表格。

```
❌ 错误思维：空白 = 浪费空间
✅ 正确思维：空白 = 呼吸感 = 重点更突出
```

**对比两种 Hero 区域的 padding：**

```css
/* ❌ 开发者版本 */
.hero {
  padding: 20px;
}

/* ✅ 设计师版本 */
.hero {
  padding: 6rem 0;     /* 上下大留白 */
  min-height: 100vh;   /* 占满一屏 */
}

.hero__content {
  max-width: 640px;    /* 内容不要太宽 */
  margin: 0 auto;
}
```

经验法则：**你觉得留白够了，再加 50%。**

---

## 原则二：颜色只用三层

一个专业的界面，通常只有三种颜色：

| 层次 | 用途 | 占比 |
|------|------|------|
| 主色 | CTA 按钮、链接、强调 | ~10% |
| 中性色 | 文字、边框、背景 | ~85% |
| 辅助色 | 标签、徽章、状态 | ~5% |

以我的主页为例：

```css
/* 主色：蓝色，只用在最重要的地方 */
.btn-primary  { background: #2563EB; }
.name-highlight { color: #2563EB; }
.nav-logo { color: #2563EB; }

/* 中性色系：从深到浅的灰度梯级 */
.text-heading   { color: #0F172A; }  /* 几乎黑 */
.text-body      { color: #475569; }  /* 深灰 */
.text-caption   { color: #94A3B8; }  /* 浅灰 */
.bg-card        { color: #F8FAFC; }  /* 近白 */
```

**不要用超过 2 个彩色**。每增加一个颜色，设计的复杂度就翻倍。

---

## 原则三：字体大小要有对比度

开发者喜欢把所有文字设成 `14px` 或 `16px`，然后用 `font-weight: bold` 做区分。这样页面会显得「一团浆糊」。

正确做法是建立明显的**视觉层级**：

```css
/* 层级 1：页面主标题（英雄区域） */
.h1 { font-size: 3.5rem;  font-weight: 800; line-height: 1.1; }

/* 层级 2：区域标题 */
.h2 { font-size: 2rem;    font-weight: 700; line-height: 1.2; }

/* 层级 3：卡片标题 */
.h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; }

/* 正文 */
.body { font-size: 1rem;  font-weight: 400; line-height: 1.7; }

/* 辅助文字（日期、标签） */
.caption { font-size: 0.875rem; color: #94A3B8; }
```

`h1` 和 `body` 之间的大小差距要**足够明显**，通常是 3-4 倍。

---

## 原则四：卡片要有「浮起来」的感觉

现代 UI 中的卡片通常不用粗边框，而是用轻微的阴影来表达层次：

```css
/* ❌ 老派做法：实线边框 */
.card {
  border: 1px solid #ccc;
}

/* ✅ 现代做法：阴影 + 细边框 */
.card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  background: white;
}

/* 悬停：卡片上浮 */
.card:hover {
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 16px 40px rgba(0, 0, 0, 0.06);
  transform: translateY(-4px);
  transition: all 0.3s ease;
}
```

---

## 原则五：按钮层级要清晰

一个页面通常有「主操作」和「次操作」，按钮样式要体现这个差别：

```tsx
{/* 主操作：实心蓝，最显眼 */}
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
  查看我的作品
</button>

{/* 次操作：描边，低调但清晰 */}
<button className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2">
  <GithubIcon size={18} />
  GitHub
</button>

{/* 危险操作：红色，让用户警觉 */}
<button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
  删除项目
</button>
```

**原则：一个页面只能有一个「最重要」的按钮。**

---

## 一个快速检查清单

在发布你的界面之前，问自己：

- [ ] 各元素之间有足够的间距吗？
- [ ] 颜色不超过 3 种吗？
- [ ] 标题和正文的大小差距明显吗？
- [ ] 在手机上看起来正常吗？
- [ ] 最重要的操作按钮是最显眼的那个吗？
- [ ] 删掉一半内容，页面是不是更好了？

---

设计是可以学习的技能，不是天赋。把上面几条原则反复练习，3 个月后你会发现自己的审美有质的提升。

> 最好的设计，是让用户感觉不到设计的存在。
