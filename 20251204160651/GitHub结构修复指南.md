# 🔧 GitHub 仓库结构修复指南

## 🚨 问题诊断
从你提供的 GitHub 仓库信息看，文件结构混乱，导致 Render 无法正确部署。

## ✅ 正确的仓库结构应该是：

```
iluck-annual-party-system/
├── 📁 render-deploy/          ← Render 部署专用
│   ├── package.json
│   └── server.js
├── 📁 admin/                  ← 管理后台
│   ├── package.json
│   ├── vercel.json
│   └── (其他前端文件)
├── 📁 miniprogram/            ← 微信小程序
│   ├── app.js
│   └── (其他小程序文件)
├── 📁 screen/                 ← 大屏幕
│   ├── script.js
│   └── (其他大屏幕文件)
└── README.md
```

## ❌ 当前可能的问题结构：

```
iluck-annual-party-system/
├── render-deploy/             ← 可能存在但内容不对
├── app.js                     ← 在根目录，应该在 miniprogram/
├── index.js                   ← 在根目录，应该在某个文件夹里
├── package.json               ← 在根目录，会让 Render 混淆
├── script.js                  ← 在根目录，应该在 screen/
├── vercel.json                ← 在根目录，应该在 admin/
└── ...
```

## 🛠️ 修复步骤

### 第1步：检查当前仓库结构
1. 访问：https://github.com/vivian-987628/iluck-annual-party-system
2. 刷新页面，等待文件列表加载
3. 确认每个文件的位置

### 第2步：如果 render-deploy 文件夹有问题，重新创建

1. **在 GitHub 上直接创建 render-deploy/package.json：**
   - 点击 "Add file" → "Create new file"
   - 文件名：`render-deploy/package.json`
   - 内容复制下面的内容

2. **创建 render-deploy/server.js：**
   - 点击 "Add file" → "Create new file"
   - 文件名：`render-deploy/server.js`
   - 内容复制下面的内容

### 第3步：删除根目录的错误文件
如果根目录有这些文件，需要删除或移动：
- ❌ 根目录的 `package.json`（会干扰 Render）
- ❌ 根目录的 `app.js`（应该在 miniprogram）
- ❌ 根目录的 `script.js`（应该在 screen）
- ❌ 根目录的 `vercel.json`（应该在 admin）

## 📝 render-deploy/package.json 内容：

```json
{
  "name": "iluck-api",
  "version": "1.0.0",
  "description": "iLuck年会系统后端API - Render部署版",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "xlsx": "^0.18.5",
    "uuid": "^9.0.0",
    "moment": "^2.29.4",
    "sqlite3": "^5.1.6"
  },
  "engines": {
    "node": "18.x"
  },
  "repository": {
    "url": "https://github.com/vivian-987628/iluck-annual-party-system"
  },
  "license": "MIT"
}
```

## 📝 render-deploy/server.js 开头部分：

```javascript
// iLuck年会系统 - Render部署版服务器
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Render需要监听的端口
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'iLuck年会系统API运行正常',
    version: '1.0.0',
    platform: 'Render.com'
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

// 基础API端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## 🚀 完成后重新部署

1. 确认 render-deploy 文件夹包含正确的两个文件
2. 确认根目录没有干扰的 package.json
3. 到 Render 重新创建 Web Service
4. 使用以下配置：
   - Root Directory: `render-deploy`
   - Build Command: `npm install`
   - Start Command: `node server.js`

## ✅ 验证方法

部署成功后，访问：
`https://你的服务名.onrender.com`

应该看到：
```json
{
  "message": "iLuck年会系统API运行正常",
  "version": "1.0.0", 
  "platform": "Render.com"
}
```

---

**现在请先检查并修复 GitHub 仓库的文件结构！**