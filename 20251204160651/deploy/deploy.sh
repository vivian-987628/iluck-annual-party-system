#!/bin/bash

# iLuck年会系统 - 自动部署脚本

echo "🚀 开始部署iLuck年会系统..."
echo "================================================="

# 设置变量
APP_DIR="/var/www/iluck-system"
DOMAIN="your-domain.com"  # 请替换为您的域名
EMAIL="admin@your-domain.com"  # 请替换为您的邮箱

# 进入应用目录
cd $APP_DIR

# 安装后端依赖
echo "📦 安装后端依赖..."
npm install

# 安装前端依赖并构建
echo "📦 安装前端依赖..."
cd admin
npm install
npm run build
cd ..

# 创建必要目录
echo "📁 创建数据目录..."
mkdir -p data uploads logs

# 设置权限
echo "🔐 设置文件权限..."
chmod -R 755 .
chmod -R 777 data uploads logs

# 配置Nginx
echo "🌐 配置Nginx..."
sudo tee /etc/nginx/sites-available/iluck-system > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # 管理后台
    location / {
        root $APP_DIR/admin/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # 大屏幕
    location /screen {
        alias $APP_DIR/screen;
        index index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # WebSocket代理
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # 静态文件
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用站点
sudo ln -sf /etc/nginx/sites-available/iluck-system /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 使用PM2启动应用
echo "🚀 启动应用..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# 获取SSL证书
echo "🔐 获取SSL证书..."
sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# 设置SSL自动续期
echo "🔄 设置SSL自动续期..."
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ 部署完成！"
echo "================================================="
echo "🌐 访问地址："
echo "   管理后台: https://$DOMAIN"
echo "   大屏幕: https://$DOMAIN/screen"
echo ""
echo "📱 微信小程序配置："
echo "   服务器域名: https://$DOMAIN"
echo "   Socket域名: https://$DOMAIN"
echo ""
echo "🔧 管理命令："
echo "   查看状态: pm2 status"
echo "   重启应用: pm2 restart all"
echo "   查看日志: pm2 logs"
echo ""
echo "📁 重要目录："
echo "   应用目录: $APP_DIR"
echo "   数据目录: $APP_DIR/data"
echo "   日志目录: $APP_DIR/logs"
echo "   上传目录: $APP_DIR/uploads"