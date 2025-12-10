const app = getApp();

Page({
  data: {
    userInfo: null,
    employeeInfo: null,
    hasCheckin: false,
    eventInfo: {
      title: 'iLuck 2024 年会盛典',
      date: '2024年12月31日',
      location: '公司大礼堂',
      status: '进行中'
    },
    stats: {
      totalEmployees: 0,
      checkedInCount: 0,
      lotteryWinners: 0
    },
    activities: [
      {
        id: 1,
        title: '签到入场',
        desc: '扫码签到，领取纪念品',
        icon: '📝',
        status: 'available',
        page: '/pages/checkin/checkin'
      },
      {
        id: 2,
        title: '幸运抽奖',
        desc: '多重好礼等你来拿',
        icon: '🎁',
        status: 'available',
        page: '/pages/lottery/lottery'
      },
      {
        id: 3,
        title: '摇一摇游戏',
        desc: '激情互动，赢取大奖',
        icon: '🎮',
        status: 'available',
        page: '/pages/game/game'
      }
    ]
  },

  onLoad() {
    this.loadUserInfo();
    this.loadStats();
  },

  onShow() {
    this.loadUserInfo();
    this.loadStats();
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
  },

  loadStats() {
    // 模拟获取统计数据，实际应该从服务器获取
    this.setData({
      stats: {
        totalEmployees: 200,
        checkedInCount: 156,
        lotteryWinners: 45
      }
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

  // 跳转到活动页面
  navigateToActivity(e) {
    const { page, status } = e.currentTarget.dataset;
    
    if (status === 'locked') {
      app.showError('该活动暂未开始');
      return;
    }

    if (status === 'checkin_required' && !this.data.hasCheckin) {
      app.showError('请先完成签到');
      return;
    }

    wx.navigateTo({
      url: page
    });
  },

  // 预览图片
  previewImage() {
    wx.previewImage({
      urls: ['/images/event-banner.jpg'],
      current: '/images/event-banner.jpg'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: 'iLuck年会系统 - 互动抽奖',
      path: '/pages/index/index',
      imageUrl: '/images/share-banner.jpg'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'iLuck年会系统 - 互动抽奖',
      imageUrl: '/images/share-banner.jpg'
    };
  }
});