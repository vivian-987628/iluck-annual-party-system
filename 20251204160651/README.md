# iLuck智能年会互动系统

## 项目概述

iLuck智能年会互动系统是一个集签到、抽奖、游戏于一体的年会互动平台，支持200人并发，提供流畅的实时互动体验。

## 技术架构

- **后端服务**: Node.js + Express + Socket.io + SQLite
- **Web管理后台**: React + Ant Design
- **大屏幕显示**: HTML5 + CSS3 + JavaScript
- **微信小程序**: 原生小程序开发

## 功能特性

### 1. 员工签到模块
- ✅ 微信扫码签到
- ✅ 批量导入员工信息
- ✅ 实时签到统计
- ✅ 3D签到动画展示
- ✅ 签到数据看板

### 2. 智能抽奖模块
- ✅ 多级奖项管理
- ✅ 动态抽奖池管理
- ✅ 炫酷抽奖动画
- ✅ 实时结果推送
- ✅ 中奖名单导出

### 3. 互动游戏模块
- ✅ 摇一摇竞技游戏
- ✅ 实时排名显示
- ✅ 游戏成绩统计
- ✅ 重力感应识别

## 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
# 安装后端依赖
npm install

# 安装管理后台依赖
cd admin && npm install

# 返回根目录
cd ..
```

### 启动服务

```bash
# 启动后端服务
npm run dev

# 启动管理后台（新终端）
npm run admin

# 启动大屏幕服务（新终端）
cd screen && python -m http.server 8080
```

### 访问地址

- **管理后台**: http://localhost:3001
- **大屏幕**: http://localhost:8080
- **后端API**: http://localhost:3000

## 项目结构

```
iluck-annual-party-system/
├── server/                 # 后端服务
│   ├── app.js             # 主应用文件
│   ├── database.js        # 数据库操作
│   └── routes/            # API路由
├── admin/                 # Web管理后台
│   ├── src/               # React源码
│   └── public/            # 静态资源
├── screen/                # 大屏幕页面
│   ├── index.html         # 主页面
│   ├── style.css          # 样式文件
│   └── script.js          # 交互脚本
├── miniprogram/           # 微信小程序
│   ├── pages/             # 页面文件
│   ├── app.js             # 小程序入口
│   └── app.json           # 配置文件
├── data/                  # 数据存储
└── uploads/               # 文件上传
```

## 使用说明

### 1. 管理后台操作

1. 访问 http://localhost:3001
2. 使用默认账号登录：admin / iluck2024
3. 在"员工管理"页面导入员工信息
4. 在"抽奖管理"页面设置奖项并开始抽奖
5. 在"游戏管理"页面启动互动游戏

### 2. 大屏幕展示

1. 访问 http://localhost:8080
2. 大屏幕会自动连接WebSocket服务
3. 实时显示签到、抽奖、游戏数据
4. 支持键盘快捷键切换视图（1/2/3）

### 3. 微信小程序使用

1. 使用微信开发者工具打开miniprogram目录
2. 配置AppID（测试可使用测试号）
3. 用户扫码进入小程序
4. 完成签到后可参与抽奖和游戏

## API接口

### 员工管理
- `GET /api/employees` - 获取员工列表
- `POST /api/employees` - 添加员工
- `POST /api/employees/import` - 批量导入员工
- `GET /api/employees/checkin/stats` - 获取签到统计

### 抽奖管理
- `GET /api/lottery/candidates` - 获取抽奖候选人
- `GET /api/lottery/winners` - 获取中奖记录
- `GET /api/lottery/export` - 导出中奖名单

### 游戏管理
- `POST /api/game/score` - 记录游戏成绩
- `GET /api/game/leaderboard` - 获取排行榜

## WebSocket事件

### 客户端注册
```javascript
socket.emit('register', { type: 'admin|screen|miniprogram', userId: 'xxx' });
```

### 签到事件
```javascript
// 客户端发送
socket.emit('checkin', checkinData);

// 服务端广播
socket.broadcast.emit('checkin_update', checkinData);
```

### 抽奖事件
```javascript
// 管理端发送
socket.emit('start_lottery', { prizeLevel: '一等奖' });

// 服务端广播
socket.broadcast.emit('lottery_result', lotteryData);
```

### 游戏事件
```javascript
// 小程序发送
socket.emit('game_shake', { userId: 'xxx', score: 100 });

// 服务端广播
socket.broadcast.emit('game_update', gameData);
```

## 部署说明

### 生产环境部署

1. **环境变量配置**
```bash
export NODE_ENV=production
export PORT=3000
export DB_PATH=/path/to/database.db
```

2. **使用PM2部署**
```bash
npm install -g pm2
pm2 start server/app.js --name "iluck-server"
pm2 start admin/build --name "iluck-admin" --spa
```

3. **Nginx配置**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
    
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    location / {
        root /path/to/admin/build;
        try_files $uri $uri/ /index.html;
    }
}
```

## 性能优化

- WebSocket连接池管理
- 数据库查询优化
- 静态资源CDN加速
- 前端代码分割
- 图片懒加载

## 安全考虑

- API接口鉴权
- 输入数据验证
- SQL注入防护
- XSS攻击防护
- CSRF防护

## 故障排除

### 常见问题

1. **WebSocket连接失败**
   - 检查防火墙设置
   - 确认端口是否开放
   - 检查CORS配置

2. **数据库连接错误**
   - 检查数据库文件权限
   - 确认SQLite版本兼容性

3. **小程序无法连接**
   - 检查域名白名单配置
   - 确认HTTPS证书配置

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交代码
4. 发起Pull Request

## 许可证

MIT License

## 联系方式

- 项目维护者：iLuck Team
- 邮箱：support@iluck.com
- 文档：https://docs.iluck.com