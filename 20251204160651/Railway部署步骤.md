# 🚀 Railway 后端部署步骤

## 📋 当前状态
✅ 代码已上传到 GitHub  
✅ Vercel 项目已关联  
🎯 **现在需要：部署后端 API**

---

## ⚡ Railway 部署（2分钟完成）

### 第1步：访问 Railway
1. 打开浏览器：https://railway.app/
2. 点击右上角 "Login" 
3. 选择 "Login with GitHub" 
4. 授权 Railway 访问你的 GitHub

### 第2步：创建新项目
1. 登录后，点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 在仓库列表中找到你的年会系统项目
4. 点击 "Import"

### 第3步：配置项目
1. Railway 会自动检测到 Node.js 项目
2. 确认以下配置：
   - **Root Directory**: 留空（自动检测）
   - **Start Command**: `npm start`（自动设置）
   - **Port**: 3000（自动设置）

### 第4步：开始部署
1. 点击 "Deploy Now"
2. 等待部署完成（通常 1-2 分钟）
3. 部署成功后会显示绿色 ✅ 标志

### 第5步：获取 API 地址
1. 部署完成后，点击顶部的项目名称
2. 找到 "Settings" 选项卡
3. 在 "General" 中找到你的项目 URL
4. 复制这个地址（格式：`https://xxx.up.railway.app`）

**⚠️ 重要：请复制这个地址，下一步需要用到！**

---

## 🔧 验证部署

部署完成后，在浏览器中访问：
```
https://你的Railway地址/api/health
```

如果看到健康检查信息，说明部署成功！

---

## 📱 接下来做什么？

获取 Railway 地址后，你需要：

1. **更新小程序配置**
   - 修改 `miniprogram/app.js` 中的 serverUrl
   - 替换为你的 Railway 地址

2. **配置微信域名**
   - 在微信公众平台添加域名白名单

---

## 🆘 常见问题

### Q: 找不到我的 GitHub 仓库？
A: 确保你的仓库是公开的，或者已经授权 Railway 访问私有仓库

### Q: 部署失败？
A: 检查 package.json 中的 start 命令是否为 `"start": "node server/app.js"`

### Q: 如何查看部署日志？
A: 在 Railway 项目页面点击 "Logs" 选项卡

---

## 🎉 成功标志

当你看到以下情况，说明部署成功：

1. **项目状态**：绿色 ✅ 标志
2. **URL 可访问**：可以打开生成的 Railway 地址
3. **API 响应**：访问 `/api/health` 有返回
4. **日志正常**：没有明显的错误信息

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Railway 的部署日志
2. 确认代码已正确上传到 GitHub
3. 联系技术支持：support@iluck.com

---

**立即开始部署，让后端 API 运行起来！** 🚀