const app = getApp();

Page({
  data: {
    userInfo: null,
    employeeInfo: null,
    hasCheckin: false,
    gameStatus: 'idle', // idle, playing, finished
    score: 0,
    timeLeft: 30,
    maxScore: 0,
    shakeCount: 0,
    gameStartTime: null,
    leaderboard: [],
    isShaking: false,
    lastShakeTime: 0,
    shakeThreshold: 15,
    animationData: null
  },

  onLoad() {
    this.loadUserInfo();
    this.initGame();
  },

  onShow() {
    this.loadUserInfo();
  },

  onUnload() {
    // 清理定时器
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    const employeeInfo = app.globalData.employeeInfo;
    const hasCheckin = app.globalData.hasCheckin;

    this.setData({
      userInfo,
      employeeInfo,
      hasCheckin
    });

    if (!hasCheckin) {
      app.showError('请先完成签到');
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/checkin/checkin'
        });
      }, 1500);
    }
  },

  initGame() {
    // 监听设备方向变化
    this.startDeviceMotionListening();
  },

  startDeviceMotionListening() {
    wx.startDeviceMotionListening({
      interval: 'normal',
      success: () => {
        console.log('开始监听设备方向');
        this.onDeviceMotionChange();
      },
      fail: (error) => {
        console.error('监听设备方向失败:', error);
        app.showError('无法启动摇一摇功能');
      }
    });
  },

  onDeviceMotionChange() {
    wx.onDeviceMotionChange((res) => {
      if (this.data.gameStatus !== 'playing') return;

      const now = Date.now();
      const { lastShakeTime, shakeThreshold } = this.data;
      
      // 防抖处理
      if (now - lastShakeTime < 100) return;

      const { x, y, z } = res.acceleration;
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      if (acceleration > shakeThreshold) {
        this.handleShake();
        this.setData({ lastShakeTime: now });
      }
    });
  },

  handleShake() {
    if (this.data.isShaking) return;

    this.setData({ isShaking: true });

    // 增加分数
    const newScore = this.data.score + Math.floor(Math.random() * 5) + 1;
    const newShakeCount = this.data.shakeCount + 1;

    this.setData({
      score: newScore,
      shakeCount: newShakeCount
    });

    // 震动反馈
    wx.vibrateShort({
      type: 'medium'
    });

    // 发送分数到服务器
    this.sendScoreToServer(newScore);

    // 播放摇动动画
    this.playShakeAnimation();

    setTimeout(() => {
      this.setData({ isShaking: false });
    }, 200);
  },

  playShakeAnimation() {
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out'
    });

    animation.scale(1.1).rotate(5).step();
    animation.scale(1).rotate(0).step();

    this.setData({
      animationData: animation.export()
    });
  },

  sendScoreToServer(score) {
    if (app.globalData.socket && app.globalData.socketStatus === 'connected') {
      app.globalData.socket.emit('game_shake', {
        userId: this.data.employeeInfo?.id || 'anonymous',
        score: score,
        timestamp: new Date().toISOString()
      });
    }
  },

  startGame() {
    if (this.data.gameStatus === 'playing') return;

    this.setData({
      gameStatus: 'playing',
      score: 0,
      shakeCount: 0,
      timeLeft: 30,
      gameStartTime: Date.now()
    });

    // 开始倒计时
    this.gameTimer = setInterval(() => {
      const newTimeLeft = this.data.timeLeft - 1;
      
      if (newTimeLeft <= 0) {
        this.endGame();
      } else {
        this.setData({ timeLeft: newTimeLeft });
      }
    }, 1000);

    app.showSuccess('游戏开始！');
  },

  endGame() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }

    const { score, maxScore } = this.data;
    const finalScore = Math.max(score, maxScore);

    this.setData({
      gameStatus: 'finished',
      maxScore: finalScore
    });

    // 保存游戏记录
    this.saveGameRecord(finalScore);

    // 停止监听设备方向
    wx.stopDeviceMotionListening();

    app.showSuccess(`游戏结束！最终得分：${finalScore}`);
  },

  saveGameRecord(score) {
    const gameRecord = {
      employeeId: this.data.employeeInfo?.id,
      gameType: 'shake',
      score: score,
      gameTime: new Date().toISOString()
    };

    // 发送到服务器
    wx.request({
      url: `${app.globalData.serverUrl}/api/game/score`,
      method: 'POST',
      data: gameRecord,
      success: (res) => {
        console.log('游戏记录保存成功');
      },
      fail: (error) => {
        console.error('游戏记录保存失败:', error);
      }
    });
  },

  restartGame() {
    this.setData({
      gameStatus: 'idle',
      score: 0,
      shakeCount: 0,
      timeLeft: 30
    });

    // 重新开始监听设备方向
    this.startDeviceMotionListening();
  },

  viewLeaderboard() {
    wx.request({
      url: `${app.globalData.serverUrl}/api/game/leaderboard`,
      method: 'GET',
      data: {
        gameType: 'shake',
        limit: 10
      },
      success: (res) => {
        if (res.data.success) {
          this.setData({ leaderboard: res.data.data });
          this.showLeaderboardModal();
        }
      },
      fail: (error) => {
        app.showError('获取排行榜失败');
      }
    });
  },

  showLeaderboardModal() {
    const { leaderboard } = this.data;
    let leaderboardText = '🏆 摇一摇排行榜 🏆\n\n';
    
    leaderboard.forEach((item, index) => {
      const medals = ['🥇', '🥈', '🥉'];
      const medal = medals[index] || `${index + 1}.`;
      leaderboardText += `${medal} ${item.name} - ${item.score}分\n`;
    });

    wx.showModal({
      title: '排行榜',
      content: leaderboardText,
      showCancel: false,
      confirmText: '确定'
    });
  },

  // 分享游戏
  onShareGame() {
    const { maxScore } = this.data;
    return {
      title: `我在iLuck年会摇一摇游戏中获得了${maxScore}分！`,
      path: '/pages/game/game',
      imageUrl: '/images/game-share.jpg'
    };
  }
});