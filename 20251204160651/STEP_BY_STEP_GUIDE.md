# 🚀 iLuck年会系统 - 方案一详细部署步骤

## 📋 准备工作（需要准备的账号）

1. **Glitch账号** - https://glitch.com/
   - 使用Google或GitHub账号登录
   - 完全免费

2. **GitHub账号** - https://github.com/
   - 如果没有，请先注册
   - 用于部署到Vercel

3. **Vercel账号** - https://vercel.com/
   - 使用GitHub账号登录
   - 完全免费

---

## 🔧 第一步：部署后端到Glitch（预计3分钟）

### 1.1 创建Glitch项目
1. 打开 https://glitch.com/
2. 点击 "Log in to Glitch" 使用Google或GitHub登录
3. 点击 "New Project"
4. 选择 "hello-express" 模板

### 1.2 配置项目代码
1. **删除默认文件**：
   - 只保留 `package.json` 和 `.env` 文件
   
2. **修改 package.json**：
   - 打开 package.json 文件
   - 复制 `glitch-deploy/package.json` 的内容替换
   
3. **创建 server.js**：
   - 新建 server.js 文件
   - 复制 `glitch-deploy/server.js` 的内容

### 1.3 启动项目
1. Glitch会自动安装依赖
2. 点击 "Show" 按钮预览
3. 应该看到：`{"message": "iLuck年会系统API运行正常"}`

### 1.4 获取API地址
1. 复制项目URL（格式：`https://项目名.glitch.me`）
2. **保存这个地址**，下一步需要用到

---

## 🎨 第二步：部署管理后台到Vercel（预计2分钟）

### 2.1 配置API地址
1. 打开 `admin/src/config.js` 文件
2. 找到这一行：
   ```javascript
   export const API_BASE_URL = 'https://your-glitch-project.glitch.me';
   ```
3. 替换为您的实际Glitch地址

### 2.2 部署到Vercel
1. **访问 Vercel**：
   - 打开 https://vercel.com/
   - 点击 "Sign Up" 使用GitHub账号登录

2. **创建新项目**：
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 如果代码不在GitHub，先上传到GitHub

3. **配置项目设置**：
   - **Root Directory**: `admin`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **环境变量配置**：
   - 在Environment Variables中添加：
     - `REACT_APP_API_URL`: 您的Glitch地址
     - `REACT_APP_WS_URL`: 您的Glitch地址

5. **点击 "Deploy"**
6. 等待部署完成（约1分钟）

---

## 📺 第三步：部署大屏幕到Vercel（预计1分钟）

### 3.1 配置大屏幕脚本
1. 打开 `screen/script-updated.js` 文件
2. 找到这一行：
   ```javascript
   const API_CONFIG = {
       baseUrl: 'https://your-glitch-project.glitch.me',
       wsUrl: 'https://your-glitch-project.glitch.me'
   };
   ```
3. 替换为您的实际Glitch地址

### 3.2 部署大屏幕
1. **在Vercel中再次点击 "New Project"**
2. **配置项目设置**：
   - **Root Directory**: `screen`
   - **Framework Preset**: `Other`
   - **Build Command**: 留空
   - **Output Directory**: 留空

3. **点击 "Deploy"**
4. 等待部署完成

---

## ✅ 第四步：测试部署（预计2分钟）

### 4.1 获取访问地址
您应该获得3个地址：

| 服务 | 地址格式 | 说明 |
|------|----------|------|
| 🖥️ 管理后台 | `https://项目名.vercel.app` | 员工管理界面 |
| 📺 大屏幕 | `https://项目名-xxx.vercel.app` | 现场展示界面 |
| 🔌 API接口 | `https://项目名.glitch.me` | 后端API服务 |

### 4.2 测试步骤
1. **访问管理后台**：
   - 打开管理后台地址
   - 使用账号：admin / iluck2024 登录
   - 应该看到系统仪表板

2. **访问大屏幕**：
   - 打开大屏幕地址
   - 应该看到年会界面
   - 按键盘数字键1/2/3切换视图

3. **测试连接**：
   - 在管理后台添加员工
   - 观察大屏幕是否实时更新
   - 测试抽奖功能

---

## 🔧 故障排除

### 问题1：Glitch项目无法启动
**解决方案**：
1. 检查 `package.json` 是否正确
2. 查看Glitch控制台的错误信息
3. 重新粘贴 `server.js` 内容

### 问题2：Vercel部署失败
**解决方案**：
1. 检查GitHub仓库代码是否正确
2. 确认Root Directory设置正确
3. 查看Vercel部署日志

### 问题3：前端无法连接后端
**解决方案**：
1. 确认API地址配置正确（在config.js和script.js中）
2. 检查Glitch项目是否在线（访问API地址测试）
3. 查看浏览器控制台错误信息

### 问题4：WebSocket连接失败
**解决方案**：
1. 确认使用https协议
2. 检查CORS配置
3. 尝试在Glitch中重新启动项目

---

## 📱 微信小程序配置（可选）

如果您需要使用微信小程序：

1. **登录微信公众平台**
2. **开发管理** → **开发设置** → **服务器域名**
3. **添加域名**：
   ```
   request合法域名: https://您的Glitch地址
   Socket合法域名: https://您的Glitch地址
   ```

---

## 🎊 部署完成！

恭喜！您的iLuck年会系统已经成功部署到云端！

**特点**：
- ✅ 完全免费
- ✅ 国内无需翻墙即可访问
- ✅ 自动HTTPS
- ✅ 实时数据同步
- ✅ 全球CDN加速

**保存这些重要信息**：
- 🖥️ 管理后台地址：[您的地址]
- 📺 大屏幕地址：[您的地址]
- 🔌 API接口地址：[您的地址]
- 🔑 登录账号：admin / iluck2024

现在您可以在任何地方访问年会系统了！🚀

---

## 🆘 需要帮助？

如果遇到问题：
1. **查看详细文档**：`CHINA_DEPLOY_GUIDE.md`
2. **检查控制台错误**：F12查看浏览器控制台
3. **重新部署**：删除项目重新创建
4. **联系支持**：提供具体的错误信息

部署成功的标志：能够正常登录管理后台并看到系统界面！