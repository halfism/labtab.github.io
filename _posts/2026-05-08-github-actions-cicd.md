---
layout: post
title: "用 GitHub Actions 实现全自动 CI/CD 流水线"
date: 2026-05-08 11:00:00 +0800
categories: [DevOps]
tags: [GitHub Actions, CI/CD, 自动化, Docker]
toc: true
comments: true
excerpt: "从零配置一条完整的 CI/CD 流水线：代码 lint → 单元测试 → 构建 Docker 镜像 → 自动部署，每次 push 全自动完成。"
---

## 什么是 CI/CD

- **CI（持续集成）**：每次代码提交后自动运行测试，快速发现问题
- **CD（持续部署）**：测试通过后自动部署到生产环境

GitHub Actions 将这两者整合在一起，配置文件直接存在仓库里，版本可追踪。

## 基础概念

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:                         # 触发条件
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:                     # 一个 Job
    runs-on: ubuntu-latest  # 运行环境
    steps:                  # 步骤列表
      - uses: actions/checkout@v4
      - run: npm test
```

**核心概念对应关系：**

| 概念 | 类比 | 说明 |
|------|------|------|
| Workflow | 整条流水线 | 一个 `.yml` 文件 |
| Job | 一个工序 | 独立的虚拟机，可并行 |
| Step | 一个操作 | 顺序执行 |
| Action | 预制模块 | `uses: xxx` 引用 |

## 实战：Node.js 项目完整流水线

```yaml
name: Full CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # =====================
  # Job 1: 代码质量检查
  # =====================
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run typecheck

  # =====================
  # Job 2: 单元测试
  # =====================
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint        # 依赖 lint Job 先完成
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Run tests with coverage
        run: npm test -- --coverage

      - name: Upload coverage report
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  # =====================
  # Job 3: 构建 Docker 镜像
  # =====================
  build:
    name: Build & Push Image
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'   # 只在 main 分支构建
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=git-
            type=raw,value=latest

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha     # GitHub Actions 缓存层
          cache-to: type=gha,mode=max

  # =====================
  # Job 4: 自动部署
  # =====================
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    environment: production    # 需要手动审批（可选）

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ghcr.io/${{ github.repository }}:latest
            docker-compose up -d --no-deps app
            docker system prune -f
```

## 使用 Secrets 管理敏感信息

绝对不要在代码里硬编码密码、API Key！在仓库 **Settings → Secrets and variables → Actions** 中添加：

```yaml
# 使用方式
- name: Deploy
  env:
    API_KEY: ${{ secrets.MY_API_KEY }}    # 从 Secrets 读取
    DATABASE_URL: ${{ vars.DB_URL }}       # 从 Variables 读取（非敏感）
```

## 优化构建速度

```yaml
# 缓存依赖安装
- uses: actions/setup-node@v4
  with:
    cache: 'npm'          # 自动缓存 node_modules

# 缓存自定义目录
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

## PR 检查保护

在 **Settings → Branches → Branch protection rules** 中：
- 启用 "Require status checks to pass before merging"
- 选中 `lint` 和 `test` 这两个 Job
- 这样有 bug 的 PR 就无法合并到 main

---

GitHub Actions 的魅力在于它完全是代码化的——流水线配置存在仓库里，和业务代码同版本管理，任何人都能看到和修改。这才是真正的 Infrastructure as Code。
