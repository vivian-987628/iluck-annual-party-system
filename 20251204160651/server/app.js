const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const Database = require('./database');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const lotteryRoutes = require('./routes/lottery');
const gameRoutes = require('./routes/game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 初始化数据库
const db = new Database();

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/lottery', lotteryRoutes);
app.use('/api/game', gameRoutes);

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
  socket.on('checkin', async (data) => {
    try {
      const result = await db.addCheckin(data);
      io.to('screen').emit('checkin_update', result);
      io.to('admin').emit('checkin_update', result);
      socket.emit('checkin_success', result);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // 抽奖事件
  socket.on('start_lottery', async (data) => {
    try {
      const candidates = await db.getLotteryCandidates(data.prizeLevel);
      const winner = candidates[Math.floor(Math.random() * candidates.length)];
      
      if (winner) {
        await db.recordLotteryWinner(winner.id, data.prizeLevel);
        
        io.emit('lottery_result', {
          winner: winner,
          prizeLevel: data.prizeLevel,
          timestamp: new Date()
        });
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // 游戏数据
  socket.on('game_shake', (data) => {
    io.to('screen').emit('game_update', {
      userId: data.userId,
      score: data.score,
      timestamp: new Date()
    });
  });

  // 断开连接
  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    console.log('客户端断开连接:', socket.id);
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`iLuck年会系统服务器运行在端口 ${PORT}`);
});

module.exports = { app, io };