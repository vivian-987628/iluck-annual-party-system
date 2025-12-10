# 🚀 iLuck年会系统 - 5分钟互联网部署指南

## 🎯 最简单的免费部署方案

### 方案：Vercel + Railway（完全免费）

---

## 📋 部署前准备

1. **注册账号**
   - GitHub账号：https://github.com/
   - Vercel账号：https://vercel.com/
   - Railway账号：https://railway.app/

2. **上传代码到GitHub**
   - 创建新仓库
   - 上传项目代码

---

## 🚀 部署步骤

### 第一步：部署后端到Railway（2分钟）

1. **访问** https://railway.app/
2. **GitHub登录**
3. **点击** "New Project"
4. **选择** "Deploy from GitHub repo"
5. **选择** 您的项目仓库
6. **等待** 部署完成（自动）
7. **复制** 返回的URL（这是您的API地址）

### 第二步：部署管理后台到Vercel（1分钟）

1. **访问** https://vercel.com/
2. **GitHub登录**
3. **点击** "New Project"
4. **选择** 同一个仓库
5. **设置** Root Directory: `admin`
6. **点击** "Deploy"
7. **复制** 返回的URL（这是管理后台地址）

### 第三步：部署大屏幕到Vercel（1分钟）

1. **再次点击** "New Project"
2. **选择** 同一个仓库
3. **设置** Root Directory: `screen`
4. **点击** "Deploy"
5. **复制** 返回的URL（这是大屏幕地址）

### 第四步：配置微信小程序（1分钟）

1. **修改** `miniprogram/app.js`：
   ```javascript
   globalData: {
     serverUrl: 'https://您的Railway地址'  // 替换为实际地址
   }
   ```

2. **重新上传** 代码到GitHub（自动重新部署）

---

## 🌐 部署完成后的地址

您将获得3个互联网地址：

```
管理后台: https://your-app-name.vercel.app
大屏幕:   https://your-screen-name.vercel.app  
API接口:   https://your-project-name.up.railway.app
```

---

## 📱 微信小程序配置

登录微信公众平台 → 开发 → 开发设置 → 服务器域名：

```
request合法域名: https://your-project-name.up.railway.app
Socket合法域名: https://your-project-name.up.railway.app
```

---

## ✅ 部署验证

### 1. 测试管理后台
- 访问您的管理后台地址
- 登录：admin / iluck2024
- 查看数据看板

### 2. 测试大屏幕
- 访问您的大屏幕地址
- 看到炫酷的年会界面

### 3. 测试小程序
- 用微信开发者工具打开小程序
- 配置正确的服务器地址
- 测试签到功能

---

## 🎉 部署成功！

恭喜！您的iLuck年会系统已成功部署到互联网！

**特点：**
- ✅ 完全免费
- ✅ 全球访问
- ✅ 自动HTTPS
- ✅ 自动部署
- ✅ 高性能CDN

**维护：**
- 代码推送到GitHub自动更新
- 无需服务器维护
- 自动扩容缩容

---

## 🆘 常见问题

### Q: Railway部署失败？
A: 检查package.json是否正确，确保有start命令

### Q: Vercel部署失败？  
A: 检查build命令和输出目录设置

### Q: 小程序连接失败？
A: 检查域名白名单配置和serverUrl设置

### Q: 如何自定义域名？
A: 在Vercel和Railway控制台添加自定义域名

---

## 📞 技术支持

如遇问题，请联系：
- 📧 support@iluck.com
- 💬 QQ群：123456789
- 📱 微信：iluck-support

---

**🎊 现在您可以在世界任何地方访问您的年会系统了！**