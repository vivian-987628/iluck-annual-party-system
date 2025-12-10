// iLuck年会系统 - 大屏幕脚本（部署版）
// 请确保config.js中的API地址正确

// API配置 - ⚠️ 请修改为您的实际API地址
const API_CONFIG = {
    baseUrl: 'https://your-glitch-project.glitch.me',
    wsUrl: 'https://your-glitch-project.glitch.me'
};

// 连接状态
let socket = null;
let connectionStatus = 'disconnected';

// DOM元素
const checkinSection = document.getElementById('checkinSection');
const lotterySection = document.getElementById('lotterySection');
const gameSection = document.getElementById('gameSection');

const totalCount = document.getElementById('totalCount');
const checkedInCount = document.getElementById('checkedInCount');
const checkinRate = document.getElementById('checkinRate');
const checkinWall = document.getElementById('checkinWall');

const lotteryTitle = document.getElementById('lotteryTitle');
const lotteryResult = document.getElementById('lotteryResult');
const winnerAvatar = document.getElementById('winnerAvatar');
const winnerName = document.getElementById('winnerName');
const winnerDept = document.getElementById('winnerDept');

const gameLeaderboard = document.getElementById('gameLeaderboard');

// 数据存储
let appData = {
    employees: [],
    checkins: [],
    winners: [],
    gameScores: []
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 iLuck大屏幕系统启动');
    
    // 更新时间显示
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 连接WebSocket
    connectWebSocket();
    
    // 加载初始数据
    loadInitialData();
    
    // 绑定键盘事件
    bindKeyboardEvents();
});

// 连接WebSocket
function connectWebSocket() {
    try {
        // 使用Socket.IO连接
        const script = document.createElement('script');
        script.src = `${API_CONFIG.wsUrl}/socket.io/socket.io.js`;
        script.onload = function() {
            socket = io(API_CONFIG.wsUrl, {
                transports: ['websocket', 'polling']
            });
            
            setupSocketEvents();
        };
        document.head.appendChild(script);
        
    } catch (error) {
        console.error('❌ WebSocket连接失败:', error);
        showConnectionError();
    }
}

// 设置WebSocket事件
function setupSocketEvents() {
    if (!socket) return;
    
    socket.on('connect', function() {
        console.log('✅ 连接成功');
        connectionStatus = 'connected';
        showConnectionStatus('已连接');
        
        // 注册为大屏幕客户端
        socket.emit('register', { 
            type: 'screen', 
            userId: 'screen-' + Date.now() 
        });
    });
    
    socket.on('disconnect', function() {
        console.log('❌ 连接断开');
        connectionStatus = 'disconnected';
        showConnectionStatus('连接断开');
    });
    
    socket.on('connect_error', function(error) {
        console.error('❌ 连接错误:', error);
        connectionStatus = 'error';
        showConnectionStatus('连接错误');
    });
    
    // 签到更新事件
    socket.on('checkin_update', function(data) {
        console.log('📝 收到签到更新:', data);
        handleCheckinUpdate(data);
    });
    
    // 抽奖结果事件
    socket.on('lottery_result', function(data) {
        console.log('🎁 收到抽奖结果:', data);
        handleLotteryResult(data);
    });
    
    // 游戏更新事件
    socket.on('game_update', function(data) {
        console.log('🎮 收到游戏更新:', data);
        handleGameUpdate(data);
    });
}

// 加载初始数据
async function loadInitialData() {
    try {
        // 模拟初始数据
        appData.employees = [
            { id: 1, name: '张三', department: '技术部' },
            { id: 2, name: '李四', department: '市场部' },
            { id: 3, name: '王五', department: '销售部' },
            { id: 4, name: '赵六', department: '人事部' },
            { id: 5, name: '钱七', department: '财务部' }
        ];
        
        updateCheckinStats();
        console.log('📊 初始数据加载完成');
        
    } catch (error) {
        console.error('❌ 加载初始数据失败:', error);
    }
}

// 处理签到更新
function handleCheckinUpdate(data) {
    if (!appData.checkins.find(c => c.id === data.id)) {
        appData.checkins.push(data);
        updateCheckinStats();
        addAvatarToWall(data);
        showNotification(`${data.name} (${data.department}) 签到成功！`);
    }
}

// 处理抽奖结果
function handleLotteryResult(data) {
    showLotteryAnimation(data);
    appData.winners.push(data.winner);
}

// 处理游戏更新
function handleGameUpdate(data) {
    updateGameLeaderboard(data);
}

// 更新签到统计
function updateCheckinStats() {
    const total = appData.employees.length;
    const checkedIn = appData.checkins.length;
    const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
    
    totalCount.textContent = total;
    checkedInCount.textContent = checkedIn;
    checkinRate.textContent = rate + '%';
}

// 添加头像到签到墙
function addAvatarToWall(checkinData) {
    const avatarElement = document.createElement('div');
    avatarElement.className = 'avatar-item';
    avatarElement.innerHTML = `
        <div class="avatar-img">
            <img src="https://ui-avatars.com/api/?name=${checkinData.name}&background=random" alt="${checkinData.name}">
        </div>
        <div class="avatar-name">${checkinData.name}</div>
        <div class="avatar-dept">${checkinData.department}</div>
    `;
    
    checkinWall.appendChild(avatarElement);
    
    // 添加动画效果
    avatarElement.style.opacity = '0';
    avatarElement.style.transform = 'scale(0)';
    
    setTimeout(() => {
        avatarElement.style.transition = 'all 0.5s ease';
        avatarElement.style.opacity = '1';
        avatarElement.style.transform = 'scale(1)';
    }, 100);
}

// 显示抽奖动画
function showLotteryResult(data) {
    lotteryTitle.textContent = data.prizeLevel;
    
    // 设置中奖者信息
    winnerAvatar.innerHTML = `<img src="https://ui-avatars.com/api/?name=${data.winner.name}&background=random" alt="${data.winner.name}">`;
    winnerName.textContent = data.winner.name;
    winnerDept.textContent = data.winner.department;
    
    // 切换到大屏幕视图
    showSection('lottery');
    
    // 显示抽奖结果
    lotteryResult.style.display = 'block';
}

// 更新游戏排行榜
function updateGameLeaderboard(data) {
    // 这里可以实现更复杂的排行榜逻辑
    console.log('游戏数据更新:', data);
}

// 显示指定区域
function showSection(sectionName) {
    checkinSection.style.display = sectionName === 'checkin' ? 'block' : 'none';
    lotterySection.style.display = sectionName === 'lottery' ? 'block' : 'none';
    gameSection.style.display = sectionName === 'game' ? 'block' : 'none';
}

// 更新日期时间
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long'
    });
    const timeStr = now.toLocaleTimeString('zh-CN');
    
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.textContent = `${dateStr} ${timeStr}`;
    }
}

// 显示连接状态
function showConnectionStatus(status) {
    console.log('🔗 连接状态:', status);
    // 可以在界面上显示连接状态指示器
}

// 显示连接错误
function showConnectionError() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'connection-error';
    errorMessage.innerHTML = `
        <div class="error-icon">⚠️</div>
        <div class="error-text">无法连接到服务器</div>
        <div class="error-hint">请检查API地址配置: ${API_CONFIG.baseUrl}</div>
    `;
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 绑定键盘事件
function bindKeyboardEvents() {
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case '1':
                showSection('checkin');
                console.log('📋 切换到签到视图');
                break;
            case '2':
                showSection('lottery');
                console.log('🎁 切换到抽奖视图');
                break;
            case '3':
                showSection('game');
                console.log('🎮 切换到游戏视图');
                break;
            case 'Escape':
                if (lotteryResult.style.display === 'block') {
                    lotteryResult.style.display = 'none';
                }
                break;
        }
    });
}

// 导出给全局使用
window.iLuckScreen = {
    connectWebSocket,
    showSection,
    appData,
    API_CONFIG
};

console.log('🎯 iLuck大屏幕脚本加载完成');
console.log('🌐 API配置:', API_CONFIG);
console.log('⌨️  快捷键: 1-签到, 2-抽奖, 3-游戏, ESC-关闭');