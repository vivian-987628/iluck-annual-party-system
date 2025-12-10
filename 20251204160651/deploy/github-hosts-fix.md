# GitHub访问修复指南

## 方法一：使用Hosts文件修复GitHub访问

### Windows系统：
1. 打开记事本（管理员身份）
2. 文件 → 打开 → C:\Windows\System32\drivers\etc\hosts
3. 在文件末尾添加以下内容：

```
# GitHub Hosts Fix - 2024年最新
140.82.112.3 github.com
140.82.112.4 github.com
140.82.114.9 codeload.github.com
199.232.69.194 github.global.ssl.fastly.net
185.199.108.153 assets-cdn.github.com
185.199.109.153 assets-cdn.github.com
185.199.110.153 assets-cdn.github.com
185.199.111.153 assets-cdn.github.com
```

4. 保存文件
5. 刷新DNS：打开CMD（管理员）运行 `ipconfig /flushdns`

### Mac/Linux系统：
```bash
sudo vim /etc/hosts
# 添加上述IP地址
sudo dscacheutil -flushcache
```

## 方法二：使用GitHub桌面版

下载GitHub Desktop客户端：
- 官方下载：https://desktop.github.com/
- 国内镜像：https://hub.fastgit.xyz/desktop/desktop/releases/

## 方法三：使用Gitee作为替代

1. 注册Gitee账号：https://gitee.com/
2. 创建仓库
3. 上传代码到Gitee
4. 使用Gitee进行部署

## 方法四：使用代码托管平台替代

### 可选平台：
- **Gitee**：https://gitee.com/ （国内）
- **Coding**：https://coding.net/ （腾讯云）
- **GitLab**：https://gitlab.com/ （国际）
- **Bitbucket**：https://bitbucket.org/ （Atlassian）

## 方法五：使用VPN服务

推荐VPN服务：
- 蓝灯：https://lantern.io/
- ExpressVPN
- NordVPN

## 应急方案：直接部署到云服务器

如果GitHub无法访问，可以直接部署到云服务器：

### 阿里云部署步骤：
1. 购买阿里云ECS服务器
2. 使用FTP工具上传项目文件
3. 在服务器上安装Node.js
4. 运行部署脚本

### 腾讯云部署步骤：
1. 购买腾讯云CVM
2. 使用Cloud Studio在线开发
3. 一键部署到云端

## 推荐的应急部署流程

### 使用Gitee + Vercel + Railway：

1. **上传代码到Gitee**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://gitee.com/your-username/iluck-system.git
   git push -u origin master
   ```

2. **部署到Vercel**
   - 登录 https://vercel.com/
   - 选择 "Import Git Repository"
   - 输入Gitee仓库地址
   - 配置Root Directory

3. **部署到Railway**
   - 登录 https://railway.app/
   - 选择 "Deploy from GitHub repo"
   - 输入Gitee仓库地址
   - 自动部署

## 联系支持

如果以上方法都无法解决，请联系：
- 📧 技术支持：support@iluck.com
- 💬 QQ群：123456789
- 📱 微信：iluck-support

我们会为您提供远程协助部署服务。