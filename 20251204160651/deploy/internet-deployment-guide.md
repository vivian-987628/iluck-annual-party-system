# iLuck年会系统 - 互联网部署完整指南

## 🌐 部署方案概览

### 方案一：云服务器部署（推荐企业用户）
- **成本**：约100-300元/月
- **优势**：完全控制、性能稳定、数据安全
- **适合**：企业年会、重要活动

### 方案二：免费云平台部署（推荐个人用户）
- **成本**：免费
- **优势**：零成本、快速部署
- **适合**：小型活动、测试使用

---

## 🚀 方案一：云服务器部署

### 第一步：购买云服务器

**推荐配置：**
- **阿里云ECS**：2核4G，5Mbps带宽
- **腾讯云CVM**：2核4G，5Mbps带宽
- **华为云ECS**：2核4G，5Mbps带宽

**预估成本：**
- 服务器：约100-200元/月
- 域名：约50-100元/年
- SSL证书：免费（Let's Encrypt）

### 第二步：服务器环境配置

连接服务器后执行：
```bash
# 下载并运行环境配置脚本
wget https://your-domain.com/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

### 第三步：上传项目代码

```bash
# 方式1：使用Git
git clone https://github.com/your-username/iluck-annual-party-system.git /var/www/iluck-system

# 方式2：使用SCP（本地执行）
scp -r ./iluck-annual-party-system root@your-server-ip:/var/www/iluck-system
```

### 第四步：部署应用

```bash
cd /var/www/iluck-system
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

### 第五步：配置域名

1. **域名解析设置：**
   - A记录：@ → 服务器IP
   - A记录：www → 服务器IP

2. **微信小程序域名配置：**
   - 登录微信公众平台
   - 设置服务器域名：`https://your-domain.com`
   - 设置Socket域名：`https://your-domain.com`

---

## 🆓 方案二：免费云平台部署

### 方案2.1：Vercel + Railway 组合

#### 后端部署到Railway

1. **准备代码：**
```bash
# 创建railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

2. **部署步骤：**
   - 访问 https://railway.app/
   - GitHub登录
   - New Project → Deploy from GitHub
   - 选择项目仓库
   - 自动部署完成

#### 前端部署到Vercel

1. **管理后台部署：**
   - 访问 https://vercel.com/
   - GitHub登录
   - Import Project → 选择仓库
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `build`

2. **大屏幕部署：**
   - New Project → 选择仓库
   - Root Directory: `screen`
   - Build Command: `echo "No build needed"`
   - Output Directory: `.`

### 方案2.2：Render.com 全栈部署

1. **访问** https://render.com/
2. **GitHub登录**
3. **New Web Service**
4. **连接GitHub仓库**
5. **配置：**
   - Build Command: `npm install && cd admin && npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `NODE_ENV=production`

### 方案2.3：Netlify + Supabase

#### 前端部署到Netlify

1. **管理后台：**
   - 访问 https://netlify.com/
   - 拖拽 `admin/build` 文件夹
   - 自动获得访问地址

2. **大屏幕：**
   - 拖拽 `screen` 文件夹
   - 自动获得访问地址

#### 后端部署到Supabase

1. **访问** https://supabase.com/
2. **创建新项目**
3. **SQL Editor → 创建表结构**
4. **Edge Functions → 部署API**

---

## 📱 微信小程序配置

### 域名白名单设置

登录微信公众平台 → 开发 → 开发管理 → 开发设置：

**服务器域名：**
```
request合法域名：https://your-domain.com
uploadFile合法域名：https://your-domain.com
downloadFile合法域名：https://your-domain.com
```

**Socket域名：**
```
合法域名：https://your-domain.com
```

**业务域名：**
```
合法域名：https://your-domain.com
```

### 小程序代码修改

修改 `miniprogram/app.js`：
```javascript
// 将服务器URL改为您的域名
globalData: {
  serverUrl: 'https://your-domain.com'
}
```

---

## 🔧 配置文件模板

### Nginx配置模板

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 管理后台
    location / {
        root /var/www/iluck-system/admin/build;
        try_files $uri $uri/ /index.html;
    }
    
    # 大屏幕
    location /screen {
        alias /var/www/iluck-system/screen;
        index index.html;
    }
    
    # API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### PM2配置模板

```javascript
module.exports = {
  apps: [
    {
      name: 'iluck-server',
      script: 'server/app.js',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
```

---

## 🚀 快速部署命令

### 云服务器一键部署

```bash
# 1. 连接服务器
ssh root@your-server-ip

# 2. 下载项目
git clone https://github.com/your-username/iluck-annual-party-system.git
cd iluck-annual-party-system

# 3. 运行部署脚本
chmod +x deploy/setup-server.sh
./deploy/setup-server.sh

# 4. 修改配置
nano deploy/deploy.sh  # 修改域名和邮箱

# 5. 部署应用
./deploy/deploy.sh
```

### 免费平台快速部署

```bash
# 1. Fork项目到GitHub
# 2. 访问 Vercel.com 导入前端
# 3. 访问 Railway.app 导入后端
# 4. 修改小程序域名配置
```

---

## 📊 部署后测试清单

### 基础功能测试
- [ ] 管理后台可以正常访问
- [ ] 大屏幕可以正常显示
- [ ] API接口响应正常
- [ ] WebSocket连接稳定

### 微信小程序测试
- [ ] 小程序可以正常启动
- [ ] 签到功能正常
- [ ] 抽奖功能正常
- [ ] 游戏功能正常

### 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] API响应时间 < 500ms
- [ ] WebSocket连接稳定
- [ ] 支持50+并发用户

---

## 🔍 故障排除

### 常见问题

**1. 端口被占用**
```bash
# 查看端口占用
sudo netstat -tlnp | grep :3000
# 杀死进程
sudo kill -9 PID
```

**2. Nginx配置错误**
```bash
# 检查配置
sudo nginx -t
# 重启Nginx
sudo systemctl restart nginx
```

**3. PM2进程异常**
```bash
# 查看状态
pm2 status
# 查看日志
pm2 logs
# 重启应用
pm2 restart all
```

**4. SSL证书问题**
```bash
# 手动获取证书
sudo certbot --nginx -d your-domain.com
# 强制续期
sudo certbot renew --force-renewal
```

---

## 📞 技术支持

### 部署服务
- **远程部署协助**：提供远程桌面协助
- **服务器代购**：协助购买和配置云服务器
- **域名备案**：协助完成域名备案流程

### 联系方式
- **技术支持邮箱**：support@iluck.com
- **部署指导QQ群**：123456789
- **微信技术支持**：iluck-support

---

## 🎉 部署成功标志

部署完成后，您应该能够：

1. **通过互联网访问管理后台**
   - 访问：https://your-domain.com
   - 登录：admin / iluck2024

2. **通过互联网访问大屏幕**
   - 访问：https://your-domain.com/screen
   - 看到炫酷的大屏幕界面

3. **微信小程序正常使用**
   - 扫码进入小程序
   - 完成签到、抽奖、游戏功能

4. **实时数据同步**
   - 管理后台操作实时同步到大屏幕
   - 小程序数据实时更新

**🎊 恭喜！您的iLuck年会系统已成功部署到互联网！**