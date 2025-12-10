const app = getApp();

Page({
  data: {
    userInfo: null,
    employeeInfo: null,
    hasCheckin: false,
    checkinData: null,
    departments: [
      '技术部',
      '市场部',
      '销售部',
      '人事部',
      '财务部',
      '运营部',
      '产品部',
      '设计部'
    ],
    form: {
      name: '',
      department: '',
      phone: ''
    },
    showDepartmentPicker: false
  },

  onLoad() {
    this.loadUserInfo();
    this.checkCheckinStatus();
  },

  onShow() {
    this.loadUserInfo();
    this.checkCheckinStatus();
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

    // 如果已有员工信息，填充表单
    if (employeeInfo) {
      this.setData({
        'form.name': employeeInfo.name,
        'form.department': employeeInfo.department,
        'form.phone': employeeInfo.phone || ''
      });
    }
  },

  checkCheckinStatus() {
    if (app.globalData.hasCheckin) {
      this.loadCheckinData();
    }
  },

  loadCheckinData() {
    // 从本地存储获取签到数据
    const checkinData = wx.getStorageSync('checkinData');
    if (checkinData) {
      this.setData({ checkinData });
    }
  },

  // 选择部门
  showDepartmentActionSheet() {
    const { departments } = this.data;
    wx.showActionSheet({
      itemList: departments,
      success: (res) => {
        this.setData({
          'form.department': departments[res.tapIndex]
        });
      }
    });
  },

  // 输入框变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`form.${field}`]: value
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

  // 提交签到
  submitCheckin() {
    const { form, userInfo } = this.data;

    // 验证表单
    if (!userInfo) {
      app.showError('请先获取用户信息');
      return;
    }

    if (!form.name.trim()) {
      app.showError('请输入姓名');
      return;
    }

    if (!form.department) {
      app.showError('请选择部门');
      return;
    }

    app.showLoading('签到中...');

    // 构建签到数据
    const checkinData = {
      employeeId: Date.now(), // 临时ID，实际应该从服务器获取
      name: form.name,
      department: form.department,
      phone: form.phone,
      avatarUrl: userInfo.avatarUrl,
      checkinTime: new Date().toISOString()
    };

    // 模拟API调用
    setTimeout(() => {
      // 保存签到数据
      wx.setStorageSync('checkinData', checkinData);
      wx.setStorageSync('employeeInfo', {
        id: checkinData.employeeId,
        name: form.name,
        department: form.department,
        phone: form.phone
      });

      // 更新全局状态
      app.setEmployeeInfo({
        id: checkinData.employeeId,
        name: form.name,
        department: form.department,
        phone: form.phone
      });
      app.setCheckinStatus(true);

      // 发送签到事件到服务器
      if (app.globalData.socket && app.globalData.socketStatus === 'connected') {
        app.globalData.socket.emit('checkin', checkinData);
      }

      this.setData({
        hasCheckin: true,
        checkinData,
        employeeInfo: {
          id: checkinData.employeeId,
          name: form.name,
          department: form.department,
          phone: form.phone
        }
      });

      app.hideLoading();
      app.showSuccess('签到成功！');
      
      // 震动反馈
      wx.vibrateShort();
    }, 1500);
  },

  // 重新签到
  reCheckin() {
    wx.showModal({
      title: '确认重新签到',
      content: '重新签到将覆盖之前的签到记录，确定继续吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            hasCheckin: false,
            checkinData: null,
            form: {
              name: '',
              department: '',
              phone: ''
            }
          });
          
          // 清除签到状态
          wx.removeStorageSync('checkinData');
          app.setCheckinStatus(false);
        }
      }
    });
  },

  // 分享签到成功
  onShareCheckin() {
    const { checkinData } = this.data;
    return {
      title: `我已完成${checkinData.department}的签到！`,
      path: '/pages/index/index',
      imageUrl: '/images/checkin-share.jpg'
    };
  }
});