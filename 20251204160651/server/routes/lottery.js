const express = require('express');
const router = express.Router();
const Database = require('../database');

const db = new Database();

// 获取抽奖候选人
router.get('/candidates', async (req, res) => {
  try {
    const { prizeLevel } = req.query;
    const candidates = await db.getLotteryCandidates(prizeLevel);
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取中奖记录
router.get('/winners', async (req, res) => {
  try {
    const winners = await db.getLotteryWinners();
    res.json({ success: true, data: winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 导出中奖名单
router.get('/export', async (req, res) => {
  try {
    const winners = await db.getLotteryWinners();
    
    // 生成CSV格式
    let csv = '姓名,部门,奖项,中奖时间\n';
    winners.forEach(winner => {
      csv += `${winner.name},${winner.department},${winner.prize_level},${winner.created_at}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=lottery_winners.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;