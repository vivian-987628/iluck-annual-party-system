# ⚙️ Vercel 环境变量配置指南

## 🎯 配置目标
让管理后台能够正确连接到 Railway 后端 API

---

## 📋 配置步骤

### 第1步：访问 Vercel 控制台
1. 打开：https://vercel.com/dashboard
2. 找到你的年会系统项目
3. 点击项目名称进入项目页面

### 第2步：进入环境变量设置
1. 在项目页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Environment Variables"
3. 点击 "Add" 添加新的环境变量

### 第3步：添加必要的环境变量

#### 变量1：REACT_APP_API_URL
- **Name**: `REACT_APP_API_URL`
- **Value**: `https://你的Railway地址`（稍后替换）
- **Environment**: `Production`, `Preview`, `Development`（全选）

#### 变量2：REACT_APP_WS_URL  
- **Name**: `REACT_APP_WS_URL`
- **Value**: `https://你的Railway地址`（稍后替换）
- **Environment**: `Production`, `Preview`, `Development`（全选）

### 第4步：保存配置
1. 点击 "Save" 保存环境变量
2. Vercel 可能会提示需要重新部署
3. 如果提示，点击 "Redeploy" 重新部署

---

## 🔧 示例配置

假设你的 Railway 地址是 `https://年会系统-2024.up.railway.app`，那么配置如下：

```
REACT_APP_API_URL = https://年会系统-2024.up.railway.app
REACT_APP_WS_URL = https://年会系统-2024.up.railway.app
```

---

## ⚠️ 重要提醒

1. **先获取 Railway 地址**：完成 Railway 部署后再配置这些变量
2. **使用 HTTPS**：确保地址以 https:// 开头
3. **重新部署**：添加环境变量后需要重新部署项目
4. **检查配置**：部署后检查控制台网络请求是否指向正确的地址

---

## 🧪 验证配置

配置完成后：

1. **重新部署项目**
2. **打开管理后台**
3. **按 F12 打开开发者工具**
4. **查看 Console**：应该看到类似日志：
   ```
   🔧 当前API配置: {API_BASE_URL: "https://你的Railway地址", ...}
   🌐 API端点: {EMPLOYEES: "https://你的Railway地址/api/employees", ...}
   ```

5. **查看 Network**：API 请求应该指向 Railway 地址

---

## 🆘 常见问题

### Q: 环境变量不生效？
A: 
- 确保变量名以 `REACT_APP_` 开头
- 重新部署项目
- 检查变量拼写是否正确

### Q: API 请求仍然指向 localhost？
A: 
- 检查环境变量是否正确设置
- 确认项目已经重新部署
- 清除浏览器缓存

### Q: WebSocket 连接失败？
A: 
- 确认 WS_URL 环境变量设置正确
- 检查 Railway 项目是否正在运行
- 查看 Network 面板中的 WebSocket 连接状态

---

## 📝 配置清单

完成配置后请确认：

- [ ] 已获取 Railway 地址
- [ ] 已添加 REACT_APP_API_URL 环境变量
- [ ] 已添加 REACT_APP_WS_URL 环境变量
- [ ] 项目已重新部署
- [ ] 控制台显示正确的 API 地址
- [ ] 网络请求指向 Railway 地址

---

## 🎉 下一步

完成 Vercel 配置后：

1. **配置小程序 serverUrl**
2. **设置微信域名白名单**
3. **测试完整功能**

---

**配置完成，管理后台就能连接到云端后端了！** 🚀