# 使用Gitee部署iLuck年会系统

## 🚀 快速部署方案（无需GitHub）

由于GitHub访问问题，我们使用Gitee作为代码托管平台，配合Vercel和Railway进行部署。

### 第1步：注册账号

1. **Gitee账号**：https://gitee.com/
   - 手机号注册，快速便捷
   - 免费私有仓库

2. **Vercel账号**：https://vercel.com/
   - 使用邮箱注册
   - 支持Gitee登录

3. **Railway账号**：https://railway.app/
   - 使用GitHub或邮箱注册
   - 后续可导入Gitee项目

### 第2步：上传代码到Gitee

#### 方法A：网页上传（简单）
1. 登录Gitee
2. 点击右上角 "+" → "新建仓库"
3. 仓库名称：`iluck-annual-party-system`
4. 选择"公开"或"私有"
5. 点击"创建"
6. 在仓库页面点击"上传文件"
7. 将整个项目文件夹拖拽上传

#### 方法B：Git命令上传（推荐）
```bash
# 1. 安装Git（如果未安装）
# 下载地址：https://git-scm.com/download/win

# 2. 配置Git用户信息
git config --global user.name "您的姓名"
git config --global user.email "您的邮箱"

# 3. 在项目目录初始化Git仓库
cd c:/Users/Administrator/CodeBuddy/20251204160651
git init
git add .
git commit -m "iLuck年会系统初始版本"

# 4. 添加Gitee远程仓库
git remote add origin https://gitee.com/您的用户名/iluck-annual-party-system.git

# 5. 推送代码
git push -u origin master
```

### 第3步：部署管理后台到Vercel

1. **登录Vercel**
   - 访问：https://vercel.com/
   - 点击 "Sign Up" 注册
   - 选择 "Continue with GitHub" 或邮箱注册

2. **导入项目**
   - 登录后点击 "New Project"
   - 选择 "Import Git Repository"
   - 输入Gitee仓库地址：`https://gitee.com/您的用户名/iluck-annual-party-system.git`
   - 点击 "Import"

3. **配置项目**
   - **Project Name**: `iluck-admin`
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（约2-3分钟）
   - 获得管理后台网址：`https://iluck-admin.vercel.app`

### 第4步：部署大屏幕到Vercel

1. **再次新建项目**
   - 在Vercel点击 "New Project"
   - 选择相同的Gitee仓库
   - **Root Directory**: `screen`
   - **Framework Preset**: `Other`
   - **Build Command**: 留空
   - **Output Directory**: 留空
   - **Install Command**: 留空

2. **部署**
   - 点击 "Deploy"
   - 获得大屏幕网址：`https://iluck-screen.vercel.app`

### 第5步：部署后端到Railway

#### 方法A：直接文件上传
1. **登录Railway**
   - 访问：https://railway.app/
   - 使用GitHub或邮箱登录

2. **新建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 如果无法连接GitHub，选择 "Provide a public Git repository"
   - 输入Gitee仓库地址

3. **配置环境变量**
   - 在项目设置中添加：
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **部署**
   - Railway会自动检测Node.js项目
   - 自动安装依赖并启动
   - 获得API地址：`https://your-project.up.railway.app`

#### 方法B：使用云服务器（备选）
如果Railway无法访问，可以使用国内云服务器：

1. **阿里云ECS**
   - 购买ECS服务器（1核2G即可）
   - 使用Workbench上传文件
   - 安装Node.js并运行

2. **腾讯云CVM**
   - 购买CVM实例
   - 使用Cloud Studio在线开发
   - 一键部署

### 第6步：配置微信小程序

1. **修改服务器地址**
   - 打开 `miniprogram/app.js`
   - 修改第3行的服务器地址：
   ```javascript
   const BASE_URL = 'https://your-project.up.railway.app'; // 替换为您的API地址
   ```

2. **重新上传小程序**
   - 在微信开发者工具中
   - 点击 "上传"
   - 填写版本号和备注

### 🎉 部署完成！

您将获得以下访问地址：
- **管理后台**: https://iluck-admin.vercel.app
- **大屏幕**: https://iluck-screen.vercel.app  
- **API接口**: https://your-project.up.railway.app

### 📱 测试访问

1. **测试管理后台**
   - 访问管理后台网址
   - 使用默认账号：admin / iluck2024

2. **测试大屏幕**
   - 访问大屏幕网址
   - 应该显示iLuck年会系统界面

3. **测试微信小程序**
   - 使用微信开发者工具预览
   - 扫码测试各项功能

### 🔧 常见问题解决

#### 问题1：Vercel部署失败
- 检查Root Directory是否正确
- 确认package.json存在
- 查看部署日志

#### 问题2：Railway无法连接Gitee
- 使用GitHub作为中转
- 或直接使用云服务器

#### 问题3：跨域问题
- 在server/app.js中已配置CORS
- 确认前端请求地址正确

### 📞 技术支持

如遇问题，请联系：
- 📧 技术支持：support@iluck.com
- 💬 QQ群：123456789
- 📱 微信：iluck-support

我们提供免费的远程部署协助服务！