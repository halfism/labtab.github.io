---
layout: post
title: "我是如何从零搭建个人主页的"
date: 2026-05-07 09:00:00 +0800
categories: [项目]
tags: [个人主页, Next.js, TailwindCSS, 全栈开发]
toc: true
comments: true
excerpt: "从最初的一张草图，到现在你看到的 halfism.com —— 记录这个主页从 0 到 1 的完整建设过程，包括技术选型、设计决策和踩过的坑。"
---

## 为什么要做个人主页

程序员需要一个「数字名片」。

GitHub profile 太技术化，微信朋友圈太私人化，LinkedIn 太商务化。我需要一个**完全属于自己的地方**，能展示我是谁、做过什么、擅长什么。

更重要的是——做个人主页本身就是一个很好的练手项目，能把设计、前端、部署各个环节都走一遍。

---

## 技术选型

最终选择的技术栈：

| 层次 | 选择 | 理由 |
|------|------|------|
| 框架 | Next.js 15 | SSG + ISR，SEO 友好，部署简单 |
| 样式 | Tailwind CSS | 原子化 CSS，开发速度快 |
| 动效 | Framer Motion | 声明式动画，与 React 集成完美 |
| 部署 | Vercel | 零配置，自动 HTTPS，全球 CDN |
| 字体 | Geist | Vercel 出品，现代等宽风格 |

**为什么不用 Vue/Nuxt？**

纯个人偏好。React 生态的组件库和工具链更丰富，而且 Next.js 的 App Router 在静态生成场景下体验非常流畅。

---

## 设计过程

### 第一稿：过度设计

第一版设计稿我塞了太多东西：粒子动画背景、3D 翻转卡片、视差滚动……结果页面加载 3 秒，移动端完全不可用。

这给了我一个重要教训：**炫技 ≠ 好设计**。

### 第二稿：极简主义

砍掉所有「酷炫」效果，只保留核心信息：

```
✓ 我是谁（一句话介绍）
✓ 我做过什么（项目卡片）
✓ 联系方式
✗ 删掉了：技能雷达图、时间轴动画、滚动视差
```

### 最终配色方案

```css
:root {
  /* 主色调：专业蓝 */
  --color-primary: #2563EB;      /* blue-600 */
  --color-primary-light: #3B82F6; /* blue-500 */

  /* 背景：干净的白 */
  --color-bg: #FFFFFF;
  --color-bg-subtle: #F8FAFC;    /* slate-50 */

  /* 文字层次 */
  --color-text-primary: #0F172A;  /* slate-900 */
  --color-text-secondary: #475569; /* slate-600 */
  --color-text-muted: #94A3B8;    /* slate-400 */
}
```

白底 + 蓝色强调 + 深灰文字，这套配色**永远不会过时**。

---

## Hero 区域实现

主页的第一屏是最重要的，用户在 3 秒内决定要不要继续看。

```tsx
// components/Hero.tsx
export default function Hero() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* 左侧：文字内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
            <span>👋</span>
            <span>欢迎来到我的个人主页</span>
          </div>

          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            你好，我是{' '}
            <span className="text-blue-600">halfism</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            一位热爱通过代码创造有意义且高效解决方案的开发者。
            <br />
            专注于构建现代 Web 应用与提升用户体验。
          </p>

          <div className="flex gap-4">
            <a href="#projects"
               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              查看我的作品
            </a>
            <a href="https://github.com/halfism"
               className="px-6 py-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors flex items-center gap-2 text-slate-700">
              <GitHubIcon size={18} />
              GitHub
            </a>
          </div>
        </motion.div>

        {/* 右侧：装饰卡片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <HeroCard />
        </motion.div>
      </div>
    </section>
  );
}
```

### 右侧浮动卡片

那个「全栈开发」的浮动卡片用的是纯 CSS 实现：

```tsx
function HeroCard() {
  return (
    <div className="relative w-64 h-80 mx-auto">
      {/* 主卡片 */}
      <div className="absolute inset-0 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-white text-4xl font-bold">H</span>
        </div>
        <span className="text-slate-700 font-medium">halfism</span>
      </div>

      {/* 角标：全栈开发 */}
      <div className="absolute -top-3 -right-3 bg-white border border-slate-100 rounded-lg px-3 py-1.5 shadow-md text-sm text-slate-600">
        全栈开发
      </div>
    </div>
  );
}
```

---

## 导航栏设计

导航栏需要在滚动时有微妙的变化：

```tsx
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 w-full z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm'
        : 'bg-transparent'
    )}>
      {/* ... */}
    </nav>
  );
}
```

滚动后：`bg-white/80 backdrop-blur-md` —— 这个毛玻璃效果是现代网站的标配。

---

## 性能优化结果

最终 Lighthouse 得分：

```
Performance:    98 ✅
Accessibility:  97 ✅
Best Practices: 100 ✅
SEO:            100 ✅
```

关键优化：
- 所有图片使用 `next/image` 自动 WebP 转换
- 字体使用 `next/font` 零布局偏移加载
- 删掉了所有第三方分析脚本

---

## 反思

做完这个主页，我最大的体会：

> **简单是最难的事情。** 知道什么不该放，比知道放什么更难。

主页现在每个月帮我接到 2-3 个有趣的外包项目和开源协作邀请，ROI 远超预期。

如果你也想做个人主页，我的建议是：**先想清楚受众是谁，再决定放什么内容。**

---

源码已开源：[github.com/halfism/halfism.com](https://github.com/halfism)
