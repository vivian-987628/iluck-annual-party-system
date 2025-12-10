// iLuck年会系统 - 一键云端部署脚本
// 自动化部署到Vercel + Railway

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class QuickDeploy {
  constructor() {
    this.deployedUrls = {
      api: '',
      admin: '',
      screen: ''
    };
  }

  async deploy() {
    console.log('🚀 iLuck年会系统 - 一键云端部署');
    console.log('=' .repeat(50));
    
    try {
      await this.checkRequirements();
      await this.prepareGitRepository();
      await this.deployToRailway();
      await this.deployToVercel();
      await this.showDeploymentResults();
      
    } catch (error) {
      console.error('❌ 部署失败:', error.message);
      this.showManualInstructions();
    }
  }

  // 检查部署要求
  async checkRequirements() {
    console.log('\n📋 检查部署要求...');
    
    // 检查是否安装了git
    try {
      execSync('git --version', { stdio: 'ignore' });
      console.log('✅ Git 已安装');
    } catch {
      throw new Error('请先安装Git: https://git-scm.com/downloads');
    }

    // 检查是否安装了Vercel CLI
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      console.log('✅ Vercel CLI 已安装');
    } catch {
      console.log('📦 安装Vercel CLI...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI 安装完成');
    }

    // 检查是否安装了Railway CLI（可选）
    try {
      execSync('railway --version', { stdio: 'ignore' });
      console.log('✅ Railway CLI 已安装');
    } catch {
      console.log('⚠️  Railway CLI 未安装，将使用Web界面部署');
    }

    console.log('✅ 部署环境检查通过');
  }

  // 准备Git仓库
  async prepareGitRepository() {
    console.log('\n📁 准备Git仓库...');
    
    // 初始化Git仓库
    try {
      execSync('git status', { stdio: 'ignore' });
      console.log('✅ Git仓库已存在');
    } catch {
      execSync('git init', { stdio: 'inherit' });
      console.log('✅ Git仓库初始化完成');
    }

    // 添加所有文件
    execSync('git add .', { stdio: 'inherit' });
    
    // 提交文件
    try {
      execSync('git commit -m "Deploy iLuck annual party system"', { stdio: 'inherit' });
      console.log('✅ 代码提交完成');
    } catch {
      console.log('ℹ️  没有新的更改需要提交');
    }

    // 检查是否已添加远程仓库
    try {
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      console.log(`✅ 远程仓库已连接: ${remoteUrl}`);
    } catch {
      console.log('\n📝 请手动添加GitHub远程仓库:');
      console.log('1. 在GitHub创建新仓库: https://github.com/new');
      console.log('2. 复制仓库URL');
      console.log('3. 执行: git remote add origin <您的仓库URL>');
      console.log('4. 执行: git push -u origin main');
      
      throw new Error('需要手动配置GitHub仓库');
    }
  }

  // 部署到Railway
  async deployToRailway() {
    console.log('\n🚀 部署后端API到Railway...');
    
    try {
      // 检查Railway CLI
      if (this.commandExists('railway')) {
        execSync('railway login', { stdio: 'inherit' });
        execSync('railway init', { stdio: 'inherit' });
        execSync('railway up', { stdio: 'inherit' });
        
        // 获取部署URL
        const url = execSync('railway domain', { encoding: 'utf8' }).trim();
        this.deployedUrls.api = url;
        console.log(`✅ API部署成功: ${url}`);
      } else {
        console.log('📝 手动部署Railway:');
        console.log('1. 访问: https://railway.app/');
        console.log('2. GitHub登录并选择此仓库');
        console.log('3. 设置Root Directory: server');
        console.log('4. 复制部署的URL到剪贴板');
        
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const api_url = await new Promise(resolve => {
          rl.question('请输入Railway部署的API URL: ', resolve);
        });
        
        this.deployedUrls.api = api_url;
        rl.close();
      }
    } catch (error) {
      console.log('⚠️  Railway部署失败，请手动部署');
    }
  }

  // 部署到Vercel
  async deployToVercel() {
    console.log('\n🎯 部署前端到Vercel...');
    
    try {
      // 部署管理后台
      console.log('部署管理后台...');
      process.chdir('admin');
      execSync('vercel --prod', { stdio: 'inherit' });
      const adminUrl = execSync('vercel ls', { encoding: 'utf8' })
        .split('\n')[1]
        .split(' ')[0];
      this.deployedUrls.admin = `https://${adminUrl}`;
      process.chdir('..');
      
      // 部署大屏幕
      console.log('部署大屏幕...');
      process.chdir('screen');
      execSync('vercel --prod', { stdio: 'inherit' });
      const screenUrl = execSync('vercel ls', { encoding: 'utf8' })
        .split('\n')[1]
        .split(' ')[0];
      this.deployedUrls.screen = `https://${screenUrl}`;
      process.chdir('..');
      
      console.log('✅ Vercel部署成功');
    } catch (error) {
      console.log('⚠️  Vercel部署失败，请手动部署');
    }
  }

  // 显示部署结果
  async showDeploymentResults() {
    console.log('\n🎊 部署完成！');
    console.log('=' .repeat(50));
    
    console.log('\n🌍 您的互联网访问地址:');
    console.log(`🖥️  管理后台: ${this.deployedUrls.admin || '请手动部署'}`);
    console.log(`📺  大屏幕: ${this.deployedUrls.screen || '请手动部署'}`);
    console.log(`🔌  API接口: ${this.deployedUrls.api || '请手动部署'}`);
    
    console.log('\n🔑 登录信息:');
    console.log('用户名: admin');
    console.log('密码: iluck2024');
    
    console.log('\n📱 微信小程序配置:');
    if (this.deployedUrls.api) {
      console.log(`request合法域名: ${this.deployedUrls.api}`);
      console.log(`Socket合法域名: ${this.deployedUrls.api}`);
    }
    
    // 生成访问信息文件
    await this.saveDeploymentInfo();
    
    console.log('\n📖 详细信息已保存到 deployment-info.txt');
    console.log('\n🎉 现在您可以在全球任何地方访问年会系统了！');
  }

  // 保存部署信息
  async saveDeploymentInfo() {
    const info = `
iLuck年会系统 - 部署信息
部署时间: ${new Date().toLocaleString()}

🌍 访问地址:
管理后台: ${this.deployedUrls.admin || '待配置'}
大屏幕: ${this.deployedUrls.screen || '待配置'}
API接口: ${this.deployedUrls.api || '待配置'}

🔑 登录信息:
用户名: admin
密码: iluck2024

📱 微信小程序配置:
request合法域名: ${this.deployedUrls.api || '待配置'}
Socket合法域名: ${this.deployedUrls.api || '待配置'}

🔧 下一步操作:
1. 访问管理后台测试功能
2. 在微信公众平台配置小程序域名
3. 导入员工信息开始使用
`;

    fs.writeFileSync('deployment-info.txt', info.trim());
  }

  // 显示手动操作指南
  showManualInstructions() {
    console.log('\n📋 手动部署指南:');
    console.log('1. 访问: https://github.com/ 创建仓库');
    console.log('2. 上传代码到GitHub');
    console.log('3. 访问: https://railway.app/ 部署API');
    console.log('4. 访问: https://vercel.com/ 部署前端');
    console.log('5. 查看详细文档: QUICK_INTERNET_DEPLOY.md');
  }

  // 检查命令是否存在
  commandExists(command) {
    try {
      execSync(`${command} --version`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

// 运行部署
if (require.main === module) {
  const deploy = new QuickDeploy();
  deploy.deploy().catch(console.error);
}

module.exports = QuickDeploy;