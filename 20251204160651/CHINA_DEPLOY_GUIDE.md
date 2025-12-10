# 🇨🇳 iLuck年会系统 - 国内网络优化部署方案

## 🌏 国内网络访问性分析

### ✅ 完全可访问（无需翻墙）
- **Vercel**: ✅ 在中国有CDN，访问速度快
- **Netlify**: ✅ 访问正常
- **国内云服务器**: ✅ 最快最稳定

### ❌ 访问有问题（需要翻墙）
- **Railway**: ❌ 国内经常无法访问
- **GitHub Pages**: ⚠️ 时好时坏
- **Heroku**: ❌ 基本无法访问

---

## 🎯 推荐部署方案

### 方案一：Vercel + 免费API服务（推荐，完全免费）

#### 1. 后端API - Glitch（无需翻墙）
- **平台**: https://glitch.com/
- **访问**: ✅ 国内完全可访问
- **成本**: 完全免费
- **限制**: 项目休眠后需要重新唤醒（5-10秒）

#### 2. 前端 - Vercel
- **平台**: https://vercel.com/
- **访问**: ✅ 国内有CDN，速度快
- **成本**: 完全免费
- **优势**: 自动HTTPS，全球CDN

### 方案二：国内云服务器（最稳定，成本最低）

#### 1. 后端 + 前端 - 阿里云/腾讯云
- **成本**: 学生机9.9元/月，正常50-100元/月
- **速度**: 国内访问极速
- **备案**: 需要备案（约1-2周）

### 方案三：纯静态方案（无后端，最简单）

使用本地数据库，无需后端服务器：
- **数据存储**: localStorage + IndexedDB
- **部署**: 纯静态网站到Vercel
- **限制**: 无法实现实时多设备同步

---

## 🚀 方案一详细步骤（推荐）

### 第一步：部署后端到Glitch（2分钟）

1. **访问** https://glitch.com/
2. **注册账号**（Google或GitHub登录）
3. **创建新项目** → "New Project"
4. **选择** "hello-express" 模板
5. **替换** server文件夹内容
6. **复制** 项目URL（如：https://your-project.glitch.me）

### 第二步：部署前端到Vercel（2分钟）

1. **修改API地址**
   ```javascript
   // admin/src/config.js
   export const API_URL = 'https://your-project.glitch.me';
   ```

2. **部署到Vercel**
   - 访问 https://vercel.com/
   - GitHub登录
   - 新建项目 → 选择仓库
   - Root Directory: admin
   - Deploy

### 第三步：部署大屏幕（1分钟）

1. **Vercel新建项目**
2. **Root Directory**: screen
3. **配置API地址**
4. **Deploy**

---

## 🇨🇳 国内云服务器部署方案

### 1. 购买服务器

#### 阿里云学生机
- **价格**: 9.9元/月
- **配置**: 1核2G，1M带宽
- **购买**: https://developer.aliyun.com/plan/student

#### 腾讯云学生机
- **价格**: 10元/月  
- **配置**: 1核2G，1M带宽
- **购买**: https://cloud.tencent.com/act/campus

### 2. 服务器配置

```bash
# 连接服务器
ssh root@your-server-ip

# 安装Node.js
curl -sL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# 安装PM2
npm install -g pm2

# 上传代码（使用scp或git clone）
git clone https://github.com/your-repo/iluck-annual-party-system.git
cd iluck-annual-party-system

# 安装依赖
npm install
cd admin && npm install && cd ..

# 启动服务
pm2 start server/app.js --name "iluck-api"
pm2 start admin/build --name "iluck-admin" --spa
```

### 3. 域名和备案

1. **购买域名**（阿里云/腾讯云）
2. **申请备案**（1-2周）
3. **配置域名解析**
4. **安装SSL证书**（Let's Encrypt免费）

---

## 🎮 纯静态方案（最简单）

如果不需要实时多设备同步，可以完全去掉后端：

### 技术方案
- **数据存储**: localStorage（本地存储）
- **抽奖算法**: 前端JavaScript实现
- **实时同步**: 使用WebSocket服务（如Pusher免费版）

### 优势
- ✅ 零服务器成本
- ✅ 无需维护
- ✅ 访问速度极快
- ✅ 永久在线

### 限制
- ❌ 无法实现跨设备数据同步
- ❌ 数据存储在浏览器本地

---

## 📊 方案对比

| 方案 | 成本 | 速度 | 稳定性 | 开发复杂度 | 推荐指数 |
|------|------|------|--------|------------|----------|
| Vercel + Glitch | 免费 | 快 | 良好 | 低 | ⭐⭐⭐⭐⭐ |
| 国内云服务器 | 10元/月 | 极快 | 稳定 | 中 | ⭐⭐⭐⭐ |
| 纯静态方案 | 免费 | 极快 | 稳定 | 低 | ⭐⭐⭐ |

---

## 🎯 我的推荐

### 如果您是**个人使用**或**小型年会**：
选择 **Vercel + Glitch** 方案
- 完全免费
- 无需翻墙
- 5分钟即可部署完成

### 如果您是**企业使用**或**大型年会**：
选择 **国内云服务器** 方案
- 访问速度最快
- 数据最安全
- 支持大量并发

### 如果您是**临时使用**或**测试**：
选择 **纯静态方案**
- 最简单快捷
- 零成本
- 立即可用

---

## 📞 下一步操作

请告诉我您选择哪个方案，我将为您提供详细的操作指南：

1. **回复 "方案一"** - 我指导您完成Vercel + Glitch部署
2. **回复 "方案二"** - 我指导您购买配置国内服务器
3. **回复 "方案三"** - 我帮您改造为纯静态方案

或者如果您有其他特殊需求，请告诉我！