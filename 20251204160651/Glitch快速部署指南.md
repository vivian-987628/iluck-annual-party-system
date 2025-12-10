# 🚀 Glitch 后端部署 - 2分钟完成

## 🎯 为什么选择 Glitch？

- ✅ **国内完全可访问** - 无需翻墙
- ✅ **完全免费** - 无任何费用
- ✅ **自动HTTPS** - 安全加密
- ✅ **实时部署** - 修改代码立即生效
- ✅ **WebSocket支持** - 完美支持实时通信

---

## ⚡ 2分钟部署步骤

### 第1步：访问 Glitch（30秒）
1. 打开浏览器：https://glitch.com/
2. 点击 "Sign in" 使用 GitHub 账号登录
3. 登录后点击 "New Project"

### 第2步：创建项目（30秒）
1. 选择 "hello-express" 模板
2. 等待项目创建完成
3. 删除默认的 `server.js` 文件

### 第3步：上传后端代码（1分钟）

#### 方法A：拖拽上传（推荐）
1. 打开你的项目文件夹：`c:/Users/Administrator/CodeBuddy/20251204160651/server/`
2. 将整个 `server` 文件夹拖拽到 Glitch 编辑器中
3. Glitch 会自动上传所有文件

#### 方法B：复制粘贴
1. 打开 `server/app.js` 文件
2. 复制所有内容到 Glitch 的 `server.js`
3. 逐个复制其他必要文件

### 第4步：获取项目地址（10秒）
1. 在 Glitch 左上角找到你的项目名称
2. 点击 "Share" → "Live Site"
3. 复制显示的 URL（格式：`https://项目名.glitch.me`）

**🎉 恭喜！后端已经部署完成！**

---

## 🔧 Glitch 项目配置

### 检查 package.json
确保 Glitch 的 `package.json` 包含：

```json
{
  "name": "iluck-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
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
  }
}
```

### 环境变量设置
在 Glitch 项目中：
1. 点击左侧 `.env` 文件
2. 添加以下环境变量：
```
NODE_ENV=production
PORT=3000
```

---

## 🧪 测试部署

### 1. 基础连接测试
在浏览器访问：
```
https://你的项目名.glitch.me/api/health
```
应该看到：`{"status": "ok", "message": "API服务正常运行"}`

### 2. 数据库测试
访问：
```
https://你的项目名.glitch.me/api/employees
```
应该返回空的员工列表：`{"success": true, "data": []}`

---

## ⚠️ 重要说明

### 项目休眠机制
- **休眠时间**：5分钟无访问自动休眠
- **唤醒时间**：首次访问需要 5-10 秒唤醒
- **解决方案**：每几分钟访问一次保持活跃

### 流量限制
- **免费额度**：1000小时/月
- **年会使用**：完全足够
- **超限处理**：月底重置，或升级到付费版

---

## 🔄 与 Vercel 配合

### 1. 更新 Vercel 环境变量
在 Vercel 控制台：
```
REACT_APP_API_URL = https://你的项目名.glitch.me
REACT_APP_WS_URL = https://你的项目名.glitch.me
```

### 2. 重新部署 Vercel
- 在 Vercel 项目页面点击 "Redeploy"
- 等待部署完成

### 3. 更新小程序配置
修改 `miniprogram/app.js`：
```javascript
serverUrl: 'https://你的项目名.glitch.me'
```

---

## 🎯 部署验证清单

完成部署后，请逐一测试：

### ✅ 后端测试
- [ ] Glitch 项目正常运行
- [ ] API健康检查通过
- [ ] 数据库连接正常
- [ ] WebSocket 服务启动

### ✅ 前端测试
- [ ] Vercel 管理后台可访问
- [ ] API请求指向 Glitch 地址
- [ ] 管理后台登录成功
- [ ] 员工管理功能正常

### ✅ 小程序测试
- [ ] 可以连接到 Glitch 服务器
- [ ] 签到功能正常
- [ ] 实时通信正常

---

## 🆘 常见问题

### Q: Glitch 显示 "Error"？
A: 检查 server.js 中的端口设置，应该使用 `process.env.PORT`

### Q: API 请求失败？
A: 检查 CORS 配置，确保允许跨域请求

### Q: WebSocket 连接失败？
A: 检查 Socket.io 的配置，确保监听正确的端口

### Q: 数据库错误？
A: Glitch 重启后数据库会重置，这是正常现象

---

## 🌟 优势总结

选择 Glitch 的好处：

1. **零配置** - 无需复杂的服务器配置
2. **即时生效** - 代码修改立即生效
3. **稳定可靠** - 由专业团队维护
4. **完全免费** - 个人使用完全免费
5. **国内友好** - 无需翻墙即可访问

---

## 🚀 开始部署

现在立即开始：
1. 访问：https://glitch.com/
2. 创建新项目
3. 上传 server 文件夹内容
4. 获取项目地址
5. 配置 Vercel 和小程序

**2分钟后，你的年会系统就可以在全球访问了！** 🎊

---

## 📞 技术支持

如需帮助：
- 📧 邮箱：support@iluck.com
- 💬 QQ群：123456789
- 📱 微信：iluck-support

**立即部署，让年会系统跑起来！** 🚀