#!/bin/bash

# iLuck年会系统 - 服务器环境配置脚本
# 适用于Ubuntu 20.04 LTS

echo "🚀 开始配置iLuck年会系统服务器环境..."
echo "================================================="

# 更新系统
echo "📦 更新系统包..."
sudo apt update && sudo apt upgrade -y

# 安装Node.js
echo "📦 安装Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2进程管理器
echo "📦 安装PM2..."
sudo npm install -g pm2

# 安装Nginx
echo "📦 安装Nginx..."
sudo apt install -y nginx

# 安装Python（用于大屏幕服务）
echo "📦 安装Python..."
sudo apt install -y python3 python3-pip

# 安装Git
echo "📦 安装Git..."
sudo apt install -y git

# 配置防火墙
echo "🔒 配置防火墙..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# 创建应用目录
echo "📁 创建应用目录..."
sudo mkdir -p /var/www/iluck-system
sudo chown -R $USER:$USER /var/www/iluck-system

# 安装SSL证书工具
echo "🔐 安装Certbot..."
sudo apt install -y certbot python3-certbot-nginx

echo "✅ 服务器环境配置完成！"
echo "================================================="
echo "下一步："
echo "1. 上传项目代码到 /var/www/iluck-system"
echo "2. 运行部署脚本 deploy.sh"
echo "3. 配置域名和SSL证书"