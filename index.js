// iLuck年会系统 - Vercel Serverless API
// 适配Vercel Serverless Functions

const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('http');

// 模拟数据库存储
let employees = [
  { id: 1, name: '张三', department: '技术部', phone: '13800138001', email: 'zhangsan@company.com' },
  { id: 2, name: '李四', department: '市场部', phone: '13800138002', email: 'lisi@company.com' },
  { id: 3, name: '王五', department: '销售部', phone: '13800138003', email: 'wangwu@company.com' },
  { id: 4, name: '赵六', department: '人事部', phone: '13800138004', email: 'zhaoliu@company.com' },
  { id: 5, name: '钱七', department: '财务部', phone: '13800138005', email: 'qianqi@company.com' }
];

let checkins = [];
let winners = [];
let gameScores = [];

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// WebSocket部分 - 在Vercel中使用简单轮询替代
const ioClients = new Set();

// API路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', platform: 'Vercel', timestamp: new Date().toISOString() });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'iLuck年会系统API运行正常',
    version: '1.0.0',
    platform: 'Vercel Serverless',
    endpoints: [
      '/api/employees',
      '/api/lottery', 
      '/api/game'
    ]
  });
});

// 员工管理
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

app.get('/api/employees/checkin/stats', (req, res) => {
  const total = employees.length;
  const checkedIn = checkins.length;
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
  
  const deptStats = {};
  checkins.forEach(checkin => {
    deptStats[checkin.department] = (deptStats[checkin.department] || 0) + 1;
  });
  
  res.json({ total, checkedIn, rate, departments: deptStats });
});

// 抽奖管理
app.get('/api/lottery/candidates', (req, res) => {
  const winnerIds = winners.map(w => w.employeeId);
  const candidates = checkins.filter(checkin => 
    !winnerIds.includes(checkin.employeeId)
  ).map(checkin => ({
    id: checkin.employeeId,
    name: checkin.name,
    department: checkin.department,
    avatar: checkin.avatarUrl || `https://ui-avatars.com/api/?name=${checkin.name}&background=random`,
    checkinTime: checkin.checkinTime
  }));
  
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

app.post('/api/lottery/start', (req, res) => {
  const { prizeLevel } = req.body;
  const winnerIds = winners.map(w => w.employeeId);
  const candidates = checkins.filter(checkin => 
    !winnerIds.includes(checkin.employeeId)
  );
  
  if (candidates.length === 0) {
    return res.status(400).json({ message: '没有足够的候选人' });
  }
  
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
  
  winners.push(lotteryResult);
  
  res.json({
    message: '抽奖完成',
    result: lotteryResult
  });
});

// 游戏管理
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

// 签到
app.post('/api/checkin', (req, res) => {
  const result = {
    ...req.body,
    id: Date.now(),
    checkinTime: new Date(),
    avatarUrl: req.body.avatarUrl || `https://ui-avatars.com/api/?name=${req.body.name}&background=random`
  };
  
  checkins.push(result);
  
  res.json({
    message: '签到成功',
    data: result
  });
});

// 获取最新事件（用于替代WebSocket）
app.get('/api/events', (req, res) => {
  const { since } = req.query;
  const sinceTime = since ? new Date(since) : new Date(0);
  
  const recentEvents = [
    ...checkins.filter(c => new Date(c.checkinTime) > sinceTime),
    ...winners.filter(w => new Date(w.winTime) > sinceTime),
    ...gameScores.filter(g => new Date(g.timestamp) > sinceTime)
  ].sort((a, b) => new Date(b.timestamp || b.checkinTime || b.winTime) - new Date(a.timestamp || a.checkinTime || a.winTime));
  
  res.json({
    events: recentEvents.slice(0, 50),
    timestamp: new Date().toISOString()
  });
});

// Vercel导出
module.exports = (req, res) => {
  app(req, res);
};