const express = require('express');
const router = express.Router();
const Database = require('../database');

const db = new Database();

// 记录游戏成绩
router.post('/score', async (req, res) => {
  try {
    const gameData = req.body;
    const result = await db.recordGameScore(gameData);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取游戏排行榜
router.get('/leaderboard', async (req, res) => {
  try {
    const { gameType = 'shake', limit = 10 } = req.query;
    const leaderboard = await db.getGameLeaderboard(gameType, parseInt(limit));
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;