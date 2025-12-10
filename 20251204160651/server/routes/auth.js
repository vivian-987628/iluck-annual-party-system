const express = require('express');
const router = express.Router();

// 简单的管理员认证
router.post('/admin', (req, res) => {
  const { username, password } = req.body;
  
  // 简单验证，实际项目应该使用更安全的认证方式
  if (username === 'admin' && password === 'iluck2024') {
    res.json({ 
      success: true, 
      token: 'admin_token_' + Date.now(),
      user: { username, role: 'admin' }
    });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

module.exports = router;