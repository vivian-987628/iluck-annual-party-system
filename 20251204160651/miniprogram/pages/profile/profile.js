const app = getApp();

Page({
  data: {
    userInfo: null,
    employeeInfo: null,
    hasCheckin: false,
    checkinData: null,
    gameRecords: [],
    lotteryHistory: []
  },

  onLoad() {
    this.loadUserInfo();
    this.loadUserRecords();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo;
    const employeeInfo = app.globalData.employeeInfo;
    const hasCheckin = app.globalData.hasCheckin;
    const checkinData = wx.getStorageSync('checkinData');

    this.setData({
      userInfo,
      employeeInfo,
      hasCheckin,
      checkinData
    });
  },

  loadUserRecords() {
    // 模拟加载用户记录
    this.setData({
      gameRecords: [
        {
          gameType: '摇一摇',
          score: 85,
          rank: 5,
          time: '2024-12-31 15:30'
        }
      ],
      lotteryHistory: [
        {
          prize: '三等奖',
          time: '2024-12-31 16:00'
        }
      ]
    });
  },

  // 获取用户信息
  getUserProfile() {
    app.getUserInfo().then(userInfo => {
      this.setData({ userInfo });
      app.showSuccess('获取用户信息成功');
    }).catch(error => {
      app.showError('获取用户信息失败');
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '退出登录后将清除所有本地数据',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.clearStorageSync();
          
          // 清除全局状态
          app.globalData.userInfo = null;
          app.globalData.employeeInfo = null;
          app.globalData.hasCheckin = false;
          
          // 断开Socket连接
          if (app.globalData.socket) {
            app.globalData.socket.disconnect();
          }
          
          app.showSuccess('已退出登录');
          
          // 重新加载页面
          this.onLoad();
        }
      }
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'iLuck年会系统 - 互动抽奖',
      path: '/pages/index/index',
      imageUrl: '/images/share-banner.jpg'
    };
  }
});