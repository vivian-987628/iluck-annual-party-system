const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// 模拟数据库数据
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user1', password: 'user123', role: 'user' }
];

const prizes = [
  { id: 1, name: '一等奖 iPhone 15', count: 1, probability: 0.01 },
  { id: 2, name: '二等奖 iPad Air', count: 2, probability: 0.05 },
  { id: 3, name: '三等奖 AirPods', count: 5, probability: 0.15 },
  { id: 4, name: '参与奖 红包', count: 50, probability: 0.79 }
];

// 用户登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 获取奖品列表
app.get('/api/prizes', (req, res) => {
  res.json(prizes);
});

// 抽奖功能
app.post('/api/draw', (req, res) => {
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const prize of prizes) {
    cumulativeProbability += prize.probability;
    if (random <= cumulativeProbability && prize.count > 0) {
      prize.count--;
      return res.json({ 
        success: true, 
        prize: prize 
      });
    }
  }
  
  res.json({ success: false, message: '未中奖' });
});

// 获取抽奖记录
app.get('/api/records', (req, res) => {
  res.json([]);
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 API文档: http://localhost:${PORT}/health`);
});

module.exports = app;
