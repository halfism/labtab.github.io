---
layout: post
title: "2026 全栈开发者技能树：我的学习路线图"
date: 2026-05-03 08:00:00 +0800
categories: [技能]
tags: [全栈开发, 学习路线, React, Node.js, 职业规划]
toc: true
comments: true
excerpt: "从前端到后端，从部署到监控 —— 分享我作为全栈开发者的完整技能树，以及每个方向我认为最值得投入时间的内容。"
---

## 关于「全栈」的真相

「全栈开发」这个词经常被滥用。有人用它代表「什么都懂一点」，有人用它代表「一个人干多个人的活」。

我理解的全栈是：**在项目的整个生命周期里，能独立做技术决策，不受限于某一层**。这不意味着前后端都要做到专家级别，而是需要足够宽的视野和足够深的某个核心专长。

---

## 技能树全景

```
全栈开发者
├── 前端（Browser）
│   ├── 基础三件套：HTML / CSS / JavaScript (ES2025)
│   ├── 框架：React 19 ← 主力
│   │   ├── Next.js 15（SSR / SSG / RSC）
│   │   ├── 状态管理：Zustand / TanStack Query
│   │   └── 测试：Vitest + Testing Library
│   ├── 样式：Tailwind CSS + CSS Modules
│   ├── 构建：Vite / Turbopack
│   └── 性能：Core Web Vitals / Bundle Analysis
│
├── 后端（Server）
│   ├── 语言：TypeScript (Node.js) ← 主力
│   │   ├── 框架：Hono / Express / Fastify
│   │   └── 全栈：Next.js API Routes / tRPC
│   ├── 数据库
│   │   ├── 关系型：PostgreSQL + Prisma ORM
│   │   ├── 文档型：MongoDB（适合内容场景）
│   │   └── 缓存：Redis
│   ├── 认证：NextAuth.js / Clerk / JWT
│   └── API 设计：REST / GraphQL / tRPC
│
├── 基础设施（Infra）
│   ├── 容器：Docker + Docker Compose
│   ├── 云服务：Vercel / Cloudflare / AWS
│   ├── CI/CD：GitHub Actions
│   └── 监控：Sentry / Uptime
│
└── 软技能
    ├── 版本控制：Git（不只是 commit）
    ├── 系统设计：数据建模 / API 设计
    └── 沟通：写文档 / Code Review
```

---

## 前端：我的核心方向

### React 生态系的选择逻辑

2026 年 React 已经是前端的「通用语」，就像后端的 SQL 一样。不是因为它最好，而是因为生态系最大，遇到问题最容易找到答案。

我的 React 开发典型配置：

```typescript
// package.json 关键依赖
{
  "dependencies": {
    "next": "^15.0.0",           // 全栈框架
    "react": "^19.0.0",
    "@tanstack/react-query": "^5.0.0", // 服务端状态管理
    "zustand": "^5.0.0",         // 客户端状态管理
    "framer-motion": "^11.0.0",  // 动效
    "lucide-react": "^0.400.0"   // 图标
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
```

### 我最常用的 React 模式

**1. 数据获取（Server Components + TanStack Query）**

```tsx
// 服务端组件：SEO 友好，无 loading 状态
async function ProjectList() {
  const projects = await getProjects(); // 直接 await，不需要 useEffect
  return (
    <div className="grid grid-cols-3 gap-6">
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  );
}

// 客户端实时数据：用 TanStack Query
function LiveStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 30_000, // 每 30 秒刷新
  });

  if (isLoading) return <Skeleton />;
  return <StatsCard data={data} />;
}
```

**2. 表单处理（React 19 useActionState）**

```tsx
// React 19 新范式：Server Actions + useActionState
function ContactForm() {
  const [state, action, isPending] = useActionState(
    submitContactForm,
    { success: false, error: null }
  );

  return (
    <form action={action}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button disabled={isPending}>
        {isPending ? '发送中...' : '发送消息'}
      </button>
      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

---

## 后端：类型安全优先

### tRPC：前后端类型共享

这是我近两年最喜欢的技术之一。tRPC 让你在前端调用后端函数时，TypeScript 类型完全共享，不需要手写 API 文档：

```typescript
// server/router.ts
const appRouter = router({
  getProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      return await db.user.findUnique({
        where: { username: input.username }
      });
    }),

  updateBio: protectedProcedure
    .input(z.object({ bio: z.string().max(200) }))
    .mutation(async ({ input, ctx }) => {
      return await db.user.update({
        where: { id: ctx.user.id },
        data: { bio: input.bio }
      });
    }),
});

// client/profile.tsx —— 完整的类型推断，无需手写！
const { data } = trpc.getProfile.useQuery({ username: 'halfism' });
//      ^? { id: string; username: string; bio: string; ... }
```

### 数据库：Prisma + PostgreSQL

```prisma
// schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
  authorId  String

  tags      Tag[]
}
```

---

## 部署：我的默认方案

```
小项目/个人项目：Vercel（免费，零配置）
    ↓ 超出免费额度或需要定制
中等项目：Cloudflare Pages + Workers
    ↓ 需要完整控制权
大项目：Docker + fly.io 或自建 VPS
```

一键部署脚本：

```bash
# 本地构建测试
npm run build

# 推送触发自动部署（GitHub Actions → Vercel）
git push origin main

# 手动触发（紧急情况）
vercel --prod
```

---

## 2026 年新增的技术

今年我重点研究了几个方向：

1. **AI 集成**：用 Vercel AI SDK 在应用里嵌入 LLM 能力，现在是标配了
2. **React Server Components**：真正理解并用好 RSC 边界
3. **Web Assembly**：在浏览器端做计算密集型任务（图像处理、加密）
4. **Edge Runtime**：把计算推到离用户最近的节点

---

## 给想入门全栈的建议

学习顺序很重要。我的建议：

```
Month 1-2:  扎实的 HTML/CSS/JS 基础
Month 3-4:  React 核心概念 + 一个完整项目
Month 5-6:  Next.js + 一个带数据库的项目
Month 7-8:  Docker + 部署一个真实应用
Month 9-12: 深度专项（选前端/后端/DevOps之一）
```

不要跟着教程走，**要自己想项目、自己做**。哪怕是个 Todo App，自己想清楚数据结构再做，比跟着教程做 10 个项目学到的都多。
