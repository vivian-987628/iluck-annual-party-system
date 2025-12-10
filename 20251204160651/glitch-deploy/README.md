# iLuck年会系统 - Glitch部署版

## 🚀 Glitch平台部署步骤

### 第一步：创建项目

1. 访问 https://glitch.com/
2. 登录账号（Google或GitHub）
3. 点击 "New Project"
4. 选择 "hello-express" 模板

### 第二步：上传代码

1. 删除默认的文件（保留package.json）
2. 将以下文件内容复制到对应文件：
   - `server.js` - 主服务器文件
   - `package.json` - 依赖配置
   - `README.md` - 说明文件

### 第三步：启动项目

1. Glitch会自动安装依赖
2. 项目自动启动
3. 复制项目URL（格式：https://项目名.glitch.me）

### 第四步：测试API

访问您的项目URL，应该看到：
```json
{
  "message": "iLuck年会系统API运行正常",
  "version": "1.0.0"
}
```

## 📱 API端点

- `GET /` - 系统状态
- `GET /api/employees` - 员工列表
- `POST /api/employees` - 添加员工
- `GET /api/lottery/candidates` - 抽奖候选人
- `GET /api/lottery/winners` - 中奖记录
- `POST /api/game/score` - 游戏成绩
- `/socket.io/` - WebSocket连接

## 🔌 WebSocket事件

### 客户端注册
```javascript
socket.emit('register', { type: 'admin|screen|miniprogram', userId: 'xxx' });
```

### 签到事件
```javascript
socket.emit('checkin', { name: '姓名', department: '部门' });
```

### 抽奖事件
```javascript
socket.emit('start_lottery', { prizeLevel: '一等奖' });
```

### 游戏事件
```javascript
socket.emit('game_shake', { userId: 'xxx', score: 100 });
```

## ⚠️ 注意事项

1. **免费限制**: Glitch免费版项目5分钟无活动会休眠，重新访问需要5-10秒唤醒
2. **数据持久化**: 使用Glitch的.prefs存储重要数据
3. **并发限制**: 免费版有并发连接数限制
4. **域名**: 项目URL可能会变化，需要及时更新前端配置

## 🔧 故障排除

### 项目无法启动
1. 检查package.json是否正确
2. 查看Glitch控制台错误日志
3. 确保所有依赖都已正确安装

### API无法访问
1. 检查项目是否在线
2. 尝试刷新页面唤醒项目
3. 查看网络连接状态

### WebSocket连接失败
1. 检查前端配置的API地址是否正确
2. 确保项目URL格式正确（包含https://）
3. 检查浏览器控制台错误信息

---

部署完成后，请复制您的Glitch项目URL，然后进行下一步前端部署。