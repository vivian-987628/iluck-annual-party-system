// iLuck年会系统 - Render部署版服务器
// 适配Render.com平台的配置

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Render需要监听的端口
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据存储（内存中，实际项目应使用数据库）
let employees = [];
let checkins = [];
let winners = [];
let gameScores = [];

// 模拟员工数据
const mockEmployees = [
  { id: 1, name: '张三', department: '技术部', phone: '13800138001', email: 'zhangsan@company.com' },
  { id: 2, name: '李四', department: '市场部', phone: '13800138002', email: 'lisi@company.com' },
  { id: 3, name: '王五', department: '销售部', phone: '13800138003', email: 'wangwu@company.com' },
  { id: 4, name: '赵六', department: '人事部', phone: '13800138004', email: 'zhaoliu@company.com' },
  { id: 5, name: '钱七', department: '财务部', phone: '13800138005', email: 'qianqi@company.com' }
];

employees = mockEmployees;

// API路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'iLuck年会系统API运行正常',
    version: '1.0.0',
    platform: 'Render.com',
    endpoints: [
      '/api/employees',
      '/api/lottery', 
      '/api/game',
      '/socket.io/'
    ]
  });
});

// 健康检查（Render需要）
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 员工管理路由
app.get('/api/employees', (req, res) => {
  res.json({ 
    message: '员工列表获取成功',
    data: employees,
    total: employees.length
  });
});

app.post('/api/employees', (req, res) => {
  const newEmployee = {
    id: employees.length + 1,
    ...req.body,
    createdAt: new Date()
  };
  employees.push(newEmployee);
  res.json({ 
    message: '员工添加成功',
    data: newEmployee
  });
});

app.post('/api/employees/import', (req, res) => {
  const { employees: importedEmployees } = req.body;
  if (Array.isArray(importedEmployees)) {
    employees = [...employees, ...importedEmployees.map((emp, index) => ({
      id: employees.length + index + 1,
      ...emp,
      createdAt: new Date()
    }))];
  }
  res.json({ 
    message: '员工批量导入成功',
    count: importedEmployees.length
  });
});

app.get('/api/employees/checkin/stats', (req, res) => {
  const total = employees.length;
  const checkedIn = checkins.length;
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  
  res.json({
    total,
    checkedIn,
    rate,
    departments: getDepartmentStats()
  });
});

// 抽奖管理路由
app.get('/api/lottery/candidates', (req, res) => {
  // 获取已签到且未中奖的员工
  const checkedInEmployees = checkins.map(c => c.employeeId);
  const winnerIds = winners.map(w => w.employeeId);
  
  const candidates = checkins.filter(checkin => 
    !winnerIds.includes(checkin.employeeId)
  ).map(checkin => {
    const employee = employees.find(emp => emp.id === checkin.employeeId);
    return {
      id: checkin.employeeId,
      name: checkin.name,
      department: checkin.department,
      avatar: checkin.avatarUrl || `https://ui-avatars.com/api/?name=${checkin.name}&background=random`,
      checkinTime: checkin.checkinTime
    };
  });
  
  res.json({ 
    message: '抽奖候选人获取成功',
    candidates,
    total: candidates.length
  });
});

app.get('/api/lottery/winners', (req, res) => {
  res.json({
    message: '中奖记录获取成功',
    winners,
    total: winners.length
  });
});

app.get('/api/lottery/export', (req, res) => {
  const excelData = winners.map(winner => ({
    '姓名': winner.name,
    '部门': winner.department,
    '奖项': winner.prizeLevel,
    '中奖时间': winner.winTime
  }));
  
  res.json({
    message: '中奖名单导出成功',
    data: excelData
  });
});

// 游戏管理路由
app.get('/api/game/leaderboard', (req, res) => {
  const leaderboard = gameScores.sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((score, index) => ({
      rank: index + 1,
      ...score
    }));
  
  res.json({
    message: '排行榜获取成功',
    leaderboard,
    total: gameScores.length
  });
});

app.post('/api/game/score', (req, res) => {
  const { userId, name, department, score } = req.body;
  
  const existingScore = gameScores.find(s => s.userId === userId);
  if (existingScore) {
    existingScore.score = score;
    existingScore.timestamp = new Date();
  } else {
    gameScores.push({
      userId,
      name,
      department,
      score,
      timestamp: new Date()
    });
  }
  
  res.json({
    message: '游戏成绩记录成功',
    data: { userId, score }
  });
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
      checkinTime: new Date(),
      avatarUrl: data.avatarUrl || `https://ui-avatars.com/api/?name=${data.name}&background=random`
    };
    
    // 保存签到记录
    checkins.push(result);
    
    // 广播给大屏幕和管理后台
    io.to('screen').emit('checkin_update', result);
    io.to('admin').emit('checkin_update', result);
    socket.emit('checkin_success', result);
    
    console.log('签到成功:', result.name);
  });

  // 抽奖事件
  socket.on('start_lottery', (data) => {
    const { prizeLevel } = data;
    
    // 获取候选人
    const checkedInEmployees = checkins.map(c => c.employeeId);
    const winnerIds = winners.map(w => w.employeeId);
    
    const candidates = checkins.filter(checkin => 
      !winnerIds.includes(checkin.employeeId)
    );
    
    if (candidates.length === 0) {
      socket.emit('error', { message: '没有足够的候选人' });
      return;
    }
    
    // 随机选择中奖者
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    
    const lotteryResult = {
      winner: {
        employeeId: winner.employeeId,
        name: winner.name,
        department: winner.department,
        avatar: winner.avatarUrl,
        checkinTime: winner.checkinTime
      },
      prizeLevel,
      winTime: new Date()
    };
    
    // 保存中奖记录
    winners.push(lotteryResult);
    
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
    
    // 更新游戏分数
    const existingScore = gameScores.find(s => s.userId === data.userId);
    if (existingScore) {
      existingScore.score = data.score;
      existingScore.timestamp = new Date();
    }
    
    // 广播游戏数据
    io.to('screen').emit('game_update', gameUpdate);
    console.log('游戏数据更新:', gameUpdate);
  });

  // 断开连接
  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    console.log('客户端断开连接:', socket.id);
  });
});

// 工具函数
function getDepartmentStats() {
  const stats = {};
  checkins.forEach(checkin => {
    stats[checkin.department] = (stats[checkin.department] || 0) + 1;
  });
  return stats;
}

// 启动服务器
server.listen(PORT, () => {
  console.log(`🚀 iLuck年会系统API服务器运行在端口 ${PORT}`);
  console.log(`🌐 访问地址: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
  console.log(`💚 平台: Render.com - 长期稳定部署`);
  console.log(`👥 初始化员工数据: ${employees.length}人`);
});

module.exports = { app, io };