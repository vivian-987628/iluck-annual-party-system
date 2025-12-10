# 🚀 iLuck年会系统 - Render部署方案（推荐）

## ⚠️ 重要更新：Glitch即将停服

由于Glitch将在2025年7月8日停止服务，我们切换到**Render.com**平台。

**Render优势**：
- ✅ 完全免费
- ✅ 长期稳定（不会突然停服）
- ✅ 国内外访问正常
- ✅ 自动从GitHub部署
- ✅ 支持WebSocket

---

## 🎯 新的推荐方案：Render + Vercel

| 服务 | 平台 | 成本 | 优势 |
|------|------|------|------|
| 后端API | Render.com | 免费 | 稳定可靠 |
| 前端 | Vercel | 免费 | 国内CDN |
| 部署方式 | GitHub | 免费 | 自动同步 |

---

## 📋 部署前准备（3分钟）

### 1. 准备账号
- **GitHub账号**：https://github.com/signup（如果没有）
- **Render账号**：https://render.com/（使用GitHub登录）

### 2. 上传代码到GitHub
1. 登录GitHub
2. 创建新仓库：`iluck-annual-party-system`
3. 上传项目代码

---

## 🚀 第一步：部署后端到Render（2分钟）

### 1.1 创建Render服务
1. **访问** https://render.com/
2. **点击** "Sign Up" → 用GitHub账号登录
3. **点击** "New +" → "Web Service"

### 1.2 配置服务
1. **连接GitHub仓库**：
   - 选择 `iluck-annual-party-system` 仓库
   - Root Directory: `render-deploy`

2. **运行环境设置**：
   - Name: `iluck-api`
   - Runtime: `Node 18`
   - Build Command: `npm install`
   - Start Command: `node server.js`

3. **点击** "Create Web Service"

### 1.3 等待部署
- Render会自动安装依赖并启动服务
- 大约需要2-3分钟
- 部署完成后获得API地址

---

## 🎨 第二步：部署前端到Vercel（同之前）

### 2.1 更新API地址
在 `admin/src/config.js` 中：
```javascript
export const API_BASE_URL = 'https://您的render服务地址.onrender.com';
```

### 2.2 部署到Vercel
1. 访问 https://vercel.com/
2. 部署管理后台（Root Directory: `admin`）
3. 部署大屏幕（Root Directory: `screen`）

---

## 🌐 最终访问地址

| 服务 | 地址格式 |
|------|----------|
| 🔌 API接口 | `https://iluck-api.onrender.com` |
| 🖥️ 管理后台 | `https://iluck-admin.vercel.app` |
| 📺 大屏幕 | `https://iluck-screen.vercel.app` |

---

## ✅ Render部署优势

### 相比Glitch的优势：
- ✅ **长期稳定**：没有停服风险
- ✅ **自动部署**：代码推送到GitHub自动更新
- ✅ **更好性能**：更强的免费配置
- ✅ **SSL证书**：自动配置HTTPS

### 免费额度：
- ✅ 750小时/月（足够24/7运行）
- ✅ 512MB内存
- ✅ 无限带宽
- ✅ 自动休眠（有访问时秒醒）

---

## 🔧 故障排除

### Render部署问题：
1. **检查日志**：在Render控制台查看Build Log
2. **确认端口**：确保使用process.env.PORT
3. **重启服务**：在Render控制台手动重启

### 前端连接问题：
1. **确认API地址**：检查config.js中的地址
2. **检查CORS**：确保后端允许跨域
3. **等待启动**：Render首次部署需要几分钟

---

## 📱 使用流程

1. **部署完成**：获得三个访问地址
2. **登录管理后台**：admin / iluck2024
3. **测试连接**：添加员工，查看大屏幕同步
4. **开始使用**：进行签到、抽奖、游戏

---

## 🎊 部署成功标志

✅ 访问API地址看到：`{"message": "iLuck年会系统API运行正常"}`
✅ 管理后台正常登录
✅ 大屏幕能接收实时数据

---

## 🆘 需要帮助？

如果遇到问题：
1. **查看详细文档**：`STEP_BY_STEP_GUIDE.md`
2. **检查部署日志**：Render和Vercel都有详细日志
3. **联系支持**：提供具体错误信息

---

## 💡 为什么选择Render？

1. **稳定性**：由Google Cloud支持，不会突然停服
2. **易用性**：界面简单，支持中文
3. **自动化**：从GitHub自动部署和更新
4. **免费额度充足**：完全满足年会系统需求

**现在您可以放心部署，不用担心服务突然停止了！** 🚀