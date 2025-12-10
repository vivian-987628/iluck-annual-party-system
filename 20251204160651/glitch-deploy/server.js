// iLuck年会系统 - Glitch部署版服务器
// 适配Glitch平台的配置

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const Database = require('./database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Glitch需要监听的端口
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 初始化数据库
const db = new Database();

// API路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'iLuck年会系统API运行正常',
    version: '1.0.0',
    endpoints: [
      '/api/employees',
      '/api/lottery', 
      '/api/game',
      '/socket.io/'
    ]
  });
});

// 员工管理路由
app.get('/api/employees', (req, res) => {
  res.json({ message: '员工管理API', data: [] });
});

app.post('/api/employees', (req, res) => {
  res.json({ message: '员工添加成功' });
});

// 抽奖管理路由
app.get('/api/lottery/candidates', (req, res) => {
  // 模拟候选人数据
  const candidates = [
    { id: 1, name: '张三', department: '技术部', avatar: 'https://via.placeholder.com/100' },
    { id: 2, name: '李四', department: '市场部', avatar: 'https://via.placeholder.com/100' },
    { id: 3, name: '王五', department: '销售部', avatar: 'https://via.placeholder.com/100' },
    { id: 4, name: '赵六', department: '人事部', avatar: 'https://via.placeholder.com/100' },
    { id: 5, name: '钱七', department: '财务部', avatar: 'https://via.placeholder.com/100' }
  ];
  res.json({ candidates });
});

app.get('/api/lottery/winners', (req, res) => {
  res.json({ winners: [] });
});

// 游戏管理路由
app.get('/api/game/leaderboard', (req, res) => {
  res.json({ leaderboard: [] });
});

app.post('/api/game/score', (req, res) => {
  res.json({ message: '游戏成绩记录成功' });
});

// WebSocket连接管理
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('客户端连接:', socket.id);
  
  // 注册客户端类型
  socket.on('register', (data) => {
    connectedClients.set(socket.id, {
      type: data.type, // 'admin', 'screen', 'miniprogram'
      userId: data.userId,
      joinTime: new Date()
    });
    
    socket.join(data.type);
    console.log(`${data.type} 客户端注册成功:`, socket.id);
  });

  // 签到事件
  socket.on('checkin', (data) => {
    const result = {
      ...data,
      id: Date.now(),
      timestamp: new Date()
    };
    
    // 广播给大屏幕和管理后台
    io.to('screen').emit('checkin_update', result);
    io.to('admin').emit('checkin_update', result);
    socket.emit('checkin_success', result);
  });

  // 抽奖事件
  socket.on('start_lottery', (data) => {
    // 获取候选人（模拟数据）
    const candidates = [
      { id: 1, name: '张三', department: '技术部', avatar: 'https://via.placeholder.com/100' },
      { id: 2, name: '李四', department: '市场部', avatar: 'https://via.placeholder.com/100' },
      { id: 3, name: '王五', department: '销售部', avatar: 'https://via.placeholder.com/100' },
      { id: 4, name: '赵六', department: '人事部', avatar: 'https://via.placeholder.com/100' },
      { id: 5, name: '钱七', department: '财务部', avatar: 'https://via.placeholder.com/100' }
    ];
    
    // 随机选择中奖者
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    
    const lotteryResult = {
      winner: {
        ...winner,
        checkinTime: new Date()
      },
      prizeLevel: data.prizeLevel,
      timestamp: new Date()
    };
    
    // 广播中奖结果
    io.emit('lottery_result', lotteryResult);
    console.log('抽奖完成:', lotteryResult);
  });

  // 游戏数据
  socket.on('game_shake', (data) => {
    const gameUpdate = {
      userId: data.userId,
      score: data.score,
      timestamp: new Date()
    };
    
    // 广播游戏数据
    io.to('screen').emit('game_update', gameUpdate);
  });

  // 断开连接
  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    console.log('客户端断开连接:', socket.id);
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 iLuck年会系统API服务器运行在端口 ${PORT}`);
  console.log(`🌐 访问地址: ${process.env.PROJECT_DOMAIN || 'localhost'}`);
});

module.exports = { app, io };