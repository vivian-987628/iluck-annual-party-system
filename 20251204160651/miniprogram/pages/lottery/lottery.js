const app = getApp();

Page({
  data: {
    userInfo: null,
    employeeInfo: null,
    hasCheckin: false,
    lotteryStatus: 'waiting', // waiting, drawing, finished
    currentPrize: null,
    winners: [],
    myPrize: null,
    isDrawing: false
  },

  onLoad() {
    this.loadUserInfo();
    this.initSocket();
  },

  onShow() {
    this.loadUserInfo();
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

  initSocket() {
    if (app.globalData.socket && app.globalData.socketStatus === 'connected') {
      app.globalData.socket.on('lottery_result', (data) => {
        this.handleLotteryResult(data);
      });
    }
  },

  handleLotteryResult(data) {
    const { employeeInfo } = this.data;
    
    this.setData({
      lotteryStatus: 'finished',
      currentPrize: data.prizeLevel,
      winners: [...this.data.winners, data.winner],
      isDrawing: false
    });

    // 检查是否是自己中奖
    if (employeeInfo && data.winner.id === employeeInfo.id) {
      this.setData({ myPrize: data.prizeLevel });
      this.showWinAnimation();
    }
  },

  showWinAnimation() {
    wx.showModal({
      title: '🎉 恭喜中奖！',
      content: `您中了${this.data.myPrize}！请到领奖处领取奖品。`,
      showCancel: false,
      confirmText: '太棒了！',
      success: () => {
        // 震动庆祝
        wx.vibrateLong();
      }
    });
  },

  viewAllWinners() {
    wx.request({
      url: `${app.globalData.serverUrl}/api/lottery/winners`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          const winners = res.data.data;
          let winnersText = '🏆 中奖名单 🏆\n\n';
          
          winners.forEach((winner, index) => {
            winnersText += `${winner.name} (${winner.department}) - ${winner.prize_level}\n`;
          });

          wx.showModal({
            title: '中奖名单',
            content: winnersText,
            showCancel: false,
            confirmText: '确定'
          });
        }
      },
      fail: () => {
        app.showError('获取中奖名单失败');
      }
    });
  },

  onShareLottery() {
    return {
      title: 'iLuck年会抽奖进行中，快来参与！',
      path: '/pages/lottery/lottery',
      imageUrl: '/images/lottery-share.jpg'
    };
  }
});