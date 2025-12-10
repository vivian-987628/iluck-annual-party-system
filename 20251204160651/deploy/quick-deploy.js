// iLuck年会系统 - 快速部署脚本
// 自动部署到免费云平台

const fs = require('fs');
const path = require('path');

class QuickDeploy {
  constructor() {
    this.projectPath = process.cwd();
    this.deployConfig = {
      vercel: {
        adminUrl: '',
        screenUrl: ''
      },
      railway: {
        apiUrl: ''
      }
    };
  }

  async start() {
    console.log('🚀 iLuck年会系统 - 快速部署向导');
    console.log('='.repeat(50));
    
    try {
      await this.showOptions();
    } catch (error) {
      console.error('❌ 部署过程中发生错误:', error.message);
    }
  }

  async showOptions() {
    console.log('\n📋 请选择部署方案:');
    console.log('1. Vercel + Railway (推荐，完全免费)');
    console.log('2. Render.com (简单易用)');
    console.log('3. Netlify + Supabase (高级用户)');
    console.log('4. 查看部署教程');
    
    // 在实际环境中，这里会有用户输入
    // 为了演示，我们直接执行方案1
    await this.deployVercelRailway();
  }

  async deployVercelRailway() {
    console.log('\n🎯 开始部署到 Vercel + Railway...');
    console.log('='.repeat(50));
    
    // 1. 准备Vercel配置
    await this.prepareVercelConfig();
    
    // 2. 准备Railway配置
    await this.prepareRailwayConfig();
    
    // 3. 生成部署脚本
    await this.generateDeployScripts();
    
    // 4. 显示部署步骤
    await this.showDeploySteps();
  }

  async prepareVercelConfig() {
    console.log('\n📦 准备Vercel配置...');
    
    // 管理后台配置
    const adminVercelConfig = {
      "version": 2,
      "builds": [
        {
          "src": "package.json",
          "use": "@vercel/static-build",
          "config": {
            "distDir": "build"
          }
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "/index.html"
        }
      ]
    };
    
    // 大屏幕配置
    const screenVercelConfig = {
      "version": 2,
      "routes": [
        {
          "src": "/(.*)",
          "dest": "/$1"
        }
      ]
    };
    
    // 写入配置文件
    fs.writeFileSync(
      path.join(this.projectPath, 'admin/vercel.json'),
      JSON.stringify(adminVercelConfig, null, 2)
    );
    
    fs.writeFileSync(
      path.join(this.projectPath, 'screen/vercel.json'),
      JSON.stringify(screenVercelConfig, null, 2)
    );
    
    console.log('   ✅ Vercel配置文件已生成');
  }

  async prepareRailwayConfig() {
    console.log('📦 准备Railway配置...');
    
    const railwayConfig = {
      "build": {
        "builder": "NIXPACKS"
      },
      "deploy": {
        "startCommand": "npm start",
        "healthcheckPath": "/api/health",
        "healthcheckTimeout": 100,
        "restartPolicyType": "ON_FAILURE"
      }
    };
    
    fs.writeFileSync(
      path.join(this.projectPath, 'railway.json'),
      JSON.stringify(railwayConfig, null, 2)
    );
    
    // 创建健康检查接口
    await this.createHealthCheck();
    
    console.log('   ✅ Railway配置文件已生成');
  }

  async createHealthCheck() {
    const healthCheckRoute = `
// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
`;
    
    const appPath = path.join(this.projectPath, 'server/app.js');
    let appContent = fs.readFileSync(appPath, 'utf8');
    
    // 在路由配置前添加健康检查
    const routesIndex = appContent.indexOf('// 路由');
    if (routesIndex > 0) {
      appContent = appContent.slice(0, routesIndex) + 
                  healthCheckRoute + 
                  appContent.slice(routesIndex);
      
      fs.writeFileSync(appPath, appContent);
    }
    
    console.log('   ✅ 健康检查接口已添加');
  }

  async generateDeployScripts() {
    console.log('📜 生成部署脚本...');
    
    // Vercel部署脚本
    const vercelDeployScript = `#!/bin/bash
echo "🚀 部署管理后台到Vercel..."
cd admin
npx vercel --prod
echo "✅ 管理后台部署完成！"
echo "📋 请复制返回的URL，这是您的管理后台地址"
`;

    // 大屏幕部署脚本
    const screenDeployScript = `#!/bin/bash
echo "🚀 部署大屏幕到Vercel..."
cd screen
npx vercel --prod
echo "✅ 大屏幕部署完成！"
echo "📋 请复制返回的URL，这是您的大屏幕地址"
`;

    // Railway部署脚本
    const railwayDeployScript = `#!/bin/bash
echo "🚀 部署后端到Railway..."
echo "📋 请按以下步骤操作："
echo "1. 访问 https://railway.app/"
echo "2. 使用GitHub账号登录"
echo "3. 点击 'New Project'"
echo "4. 选择 'Deploy from GitHub repo'"
echo "5. 选择此项目仓库"
echo "6. 等待部署完成"
echo "7. 复制返回的URL，这是您的API地址"
`;

    fs.writeFileSync(
      path.join(this.projectPath, 'deploy/deploy-admin.sh'),
      vercelDeployScript
    );
    
    fs.writeFileSync(
      path.join(this.projectPath, 'deploy/deploy-screen.sh'),
      screenDeployScript
    );
    
    fs.writeFileSync(
      path.join(this.projectPath, 'deploy/deploy-backend.sh'),
      railwayDeployScript
    );
    
    // 设置执行权限
    fs.chmodSync(path.join(this.projectPath, 'deploy/deploy-admin.sh'), '755');
    fs.chmodSync(path.join(this.projectPath, 'deploy/deploy-screen.sh'), '755');
    fs.chmodSync(path.join(this.projectPath, 'deploy/deploy-backend.sh'), '755');
    
    console.log('   ✅ 部署脚本已生成');
  }

  async showDeploySteps() {
    console.log('\n📋 部署步骤说明:');
    console.log('='.repeat(50));
    
    console.log('\n🔧 第一步：准备GitHub仓库');
    console.log('1. 访问 https://github.com/');
    console.log('2. 创建新仓库（公开或私有）');
    console.log('3. 上传项目代码到仓库');
    
    console.log('\n🚀 第二步：部署后端（Railway）');
    console.log('1. 访问 https://railway.app/');
    console.log('2. 使用GitHub账号登录');
    console.log('3. 点击 "New Project"');
    console.log('4. 选择 "Deploy from GitHub repo"');
    console.log('5. 选择您的项目仓库');
    console.log('6. 等待部署完成（约2-3分钟）');
    console.log('7. 复制返回的URL（这是您的API地址）');
    
    console.log('\n🖥️ 第三步：部署管理后台（Vercel）');
    console.log('1. 访问 https://vercel.com/');
    console.log('2. 使用GitHub账号登录');
    console.log('3. 点击 "New Project"');
    console.log('4. 选择您的项目仓库');
    console.log('5. Root Directory 设置为: admin');
    console.log('6. Build Command: npm run build');
    console.log('7. Output Directory: build');
    console.log('8. 点击 "Deploy"');
    console.log('9. 部署完成后复制URL（这是管理后台地址）');
    
    console.log('\n📺 第四步：部署大屏幕（Vercel）');
    console.log('1. 再次点击 "New Project"');
    console.log('2. 选择同一个仓库');
    console.log('3. Root Directory 设置为: screen');
    console.log('4. Build Command: echo "No build needed"');
    console.log('5. Output Directory: .');
    console.log('6. 点击 "Deploy"');
    console.log('7. 部署完成后复制URL（这是大屏幕地址）');
    
    console.log('\n📱 第五步：配置微信小程序');
    console.log('1. 修改 miniprogram/app.js 中的 serverUrl');
    console.log('2. 将其改为您的Railway API地址');
    console.log('3. 在微信公众平台配置域名白名单');
    
    console.log('\n🎉 部署完成！');
    console.log('您将获得3个互联网地址：');
    console.log('- 管理后台：https://your-app.vercel.app');
    console.log('- 大屏幕：https://your-screen.vercel.app');
    console.log('- API接口：https://your-app.up.railway.app');
    
    console.log('\n📋 重要提醒：');
    console.log('✅ 所有服务都是免费的');
    console.log('✅ 支持自定义域名');
    console.log('✅ 自动HTTPS证书');
    console.log('✅ 全球CDN加速');
    
    await this.generateConfigFile();
  }

  async generateConfigFile() {
    const configTemplate = `
# iLuck年会系统 - 部署配置记录

## 🌐 部署地址（请填写实际部署后的地址）

### 管理后台
- Vercel URL: https://your-app.vercel.app
- 自定义域名: https://admin.your-domain.com

### 大屏幕
- Vercel URL: https://your-screen.vercel.app
- 自定义域名: https://screen.your-domain.com

### 后端API
- Railway URL: https://your-app.up.railway.app
- API地址: https://your-app.up.railway.app/api

### WebSocket
- Socket地址: https://your-app.up.railway.app

## 📱 微信小程序配置

### 服务器域名设置
登录微信公众平台 → 开发 → 开发设置 → 开发设置：

\`\`\`
request合法域名: https://your-app.up.railway.app
uploadFile合法域名: https://your-app.up.railway.app
downloadFile合法域名: https://your-app.up.railway.app
Socket合法域名: https://your-app.up.railway.app
\`\`\`

### 代码修改
修改 \`miniprogram/app.js\`:
\`\`\`javascript
globalData: {
  serverUrl: 'https://your-app.up.railway.app'
}
\`\`\`

## 🔧 管理命令

### Vercel管理
\`\`\`bash
# 安装Vercel CLI
npm i -g vercel

# 管理后台
cd admin && vercel --prod

# 大屏幕
cd screen && vercel --prod
\`\`\`

### Railway管理
\`\`\`bash
# 访问 https://railway.app/dashboard
# 查看日志、重启服务、环境变量等
\`\`\`

## 📊 监控和维护

### 性能监控
- Vercel Analytics: 访问统计
- Railway Metrics: 服务器监控

### 日志查看
- Vercel Functions Logs
- Railway Logs

### 自动部署
- GitHub推送自动触发部署
- 支持预览部署
`;

    fs.writeFileSync(
      path.join(this.projectPath, 'deploy-config.md'),
      configTemplate
    );
    
    console.log('\n📄 已生成配置文件: deploy-config.md');
    console.log('请记录您的实际部署地址到该文件中');
  }
}

// 运行部署向导
if (require.main === module) {
  const deploy = new QuickDeploy();
  deploy.start().catch(console.error);
}

module.exports = QuickDeploy;