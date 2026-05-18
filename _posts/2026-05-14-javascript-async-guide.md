---
layout: post
title: "JavaScript 异步编程完全指南：从回调到 async/await"
date: 2026-05-15 09:00:00 +0800
categories: [技术]
tags: [JavaScript, 异步, Promise, async/await]
toc: true
comments: true
excerpt: "深入理解 JavaScript 异步编程的演进历程，从回调地狱到 Promise 链，再到优雅的 async/await 语法。"
---

## 为什么需要异步编程

JavaScript 是单线程语言，但 Web 开发中存在大量耗时操作——网络请求、文件读写、定时器……如果这些操作同步执行，页面会直接"卡死"。

异步编程正是为了解决这个问题：**让耗时操作在后台运行，主线程继续响应用户交互**。

## 第一代：回调函数

最早的异步方案，简单直接，但嵌套多层后形成"回调地狱"：

```javascript
getUserData(userId, function(user) {
  getOrders(user.id, function(orders) {
    getOrderDetail(orders[0].id, function(detail) {
      // 嵌套三层，已经开始混乱...
      renderPage(detail, function(result) {
        // 嵌套四层，维护噩梦 😱
        console.log('done');
      });
    });
  });
});
```

**问题：**
- 代码横向增长，难以阅读
- 错误处理复杂，每层都要 `if (err) return cb(err)`
- 无法使用 `try/catch`

## 第二代：Promise

ES6 引入 Promise，将异步操作包装成对象，支持链式调用：

```javascript
getUserData(userId)
  .then(user => getOrders(user.id))
  .then(orders => getOrderDetail(orders[0].id))
  .then(detail => renderPage(detail))
  .then(result => console.log('done'))
  .catch(err => console.error('出错了:', err));
```

**核心状态机：**

```
pending → fulfilled (成功，触发 .then)
pending → rejected  (失败，触发 .catch)
```

**手写一个简单的 Promise：**

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.handlers = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.handlers.forEach(h => h.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.handlers.forEach(h => h.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handlers.push({
        onFulfilled: (value) => {
          try { resolve(onFulfilled(value)); } catch(e) { reject(e); }
        },
        onRejected: (reason) => {
          try { resolve(onRejected ? onRejected(reason) : Promise.reject(reason)); } catch(e) { reject(e); }
        }
      });
    });
  }
}
```

## 第三代：async/await

ES2017 的语法糖，让异步代码写起来像同步代码：

```javascript
async function fetchUserPage(userId) {
  try {
    const user = await getUserData(userId);
    const orders = await getOrders(user.id);
    const detail = await getOrderDetail(orders[0].id);
    const result = await renderPage(detail);
    console.log('done');
    return result;
  } catch (err) {
    console.error('出错了:', err);
    throw err;
  }
}
```

**并行执行多个请求：**

```javascript
// 顺序执行（慢）
const user = await getUser(id);
const settings = await getSettings(id); // 等 user 完成后才执行

// 并行执行（快）
const [user, settings] = await Promise.all([
  getUser(id),
  getSettings(id)  // 同时发起
]);
```

## 常用 Promise 工具方法

| 方法 | 说明 | 用途 |
|------|------|------|
| `Promise.all()` | 全部成功才 resolve | 并行请求多个接口 |
| `Promise.allSettled()` | 等所有完成（无论成败）| 批量操作，统计结果 |
| `Promise.race()` | 第一个完成即 resolve | 超时控制 |
| `Promise.any()` | 第一个成功即 resolve | 多个备用接口 |

**超时控制示例：**

```javascript
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('请求超时')), ms)
  );
  return Promise.race([promise, timeout]);
}

const data = await withTimeout(fetchData(), 5000);
```

## 最佳实践

1. **避免在 async 函数中使用 `forEach`**，改用 `for...of` 或 `Promise.all`
2. **总是处理 rejected 状态**，否则会产生未捕获的 Promise 异常
3. **适当使用并行**，`await` 是顺序执行，多个独立请求应该并行

```javascript
// ❌ 错误：串行执行，慢
for (const id of userIds) {
  await processUser(id);
}

// ✅ 正确：并行执行，快
await Promise.all(userIds.map(id => processUser(id)));
```

---

掌握异步编程是 JavaScript 进阶的必经之路。从回调到 async/await，每一代方案都是对前一代痛点的改进。
