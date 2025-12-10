class iLuckScreen {
    constructor() {
        this.socket = null;
        this.currentView = 'checkin'; // checkin, lottery, game
        this.checkinData = {
            total: 0,
            checkedIn: 0,
            recentCheckins: []
        };
        this.gameData = {
            players: [],
            leaderboard: []
        };
        
        this.init();
    }

    init() {
        this.connectSocket();
        this.updateDateTime();
        this.showSection('checkin');
        
        // 每秒更新时间
        setInterval(() => this.updateDateTime(), 1000);
    }

    connectSocket() {
        this.socket = io('https://your-project.onrender.com');
        
        this.socket.on('connect', () => {
            console.log('大屏幕连接成功');
            this.socket.emit('register', { type: 'screen' });
        });

        this.socket.on('checkin_update', (data) => {
            this.handleCheckinUpdate(data);
        });

        this.socket.on('lottery_result', (data) => {
            this.handleLotteryResult(data);
        });

        this.socket.on('game_update', (data) => {
            this.handleGameUpdate(data);
        });

        this.socket.on('game_start', (data) => {
            this.handleGameStart(data);
        });

        this.socket.on('game_stop', (data) => {
            this.handleGameStop(data);
        });
    }

    updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const timeStr = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const datetimeElement = document.getElementById('datetime');
        if (datetimeElement) {
            datetimeElement.textContent = `${dateStr} ${timeStr}`;
        }
    }

    showSection(sectionName) {
        // 隐藏所有区域
        document.getElementById('checkinSection').style.display = 'none';
        document.getElementById('lotterySection').style.display = 'none';
        document.getElementById('gameSection').style.display = 'none';
        
        // 显示指定区域
        document.getElementById(`${sectionName}Section`).style.display = 'block';
        this.currentView = sectionName;
    }

    handleCheckinUpdate(data) {
        this.checkinData.checkedIn++;
        this.checkinData.recentCheckins.unshift(data);
        
        // 限制最近签到记录数量
        if (this.checkinData.recentCheckins.length > 50) {
            this.checkinData.recentCheckins.pop();
        }
        
        this.updateCheckinDisplay();
        this.addCheckinAvatar(data);
    }

    updateCheckinDisplay() {
        const totalCountEl = document.getElementById('totalCount');
        const checkedInCountEl = document.getElementById('checkedInCount');
        const checkinRateEl = document.getElementById('checkinRate');
        
        if (totalCountEl) totalCountEl.textContent = this.checkinData.total;
        if (checkedInCountEl) checkedInCountEl.textContent = this.checkinData.checkedIn;
        
        const rate = this.checkinData.total > 0 
            ? Math.round((this.checkinData.checkedIn / this.checkinData.total) * 100) 
            : 0;
        if (checkinRateEl) checkinRateEl.textContent = `${rate}%`;
    }

    addCheckinAvatar(data) {
        const wall = document.getElementById('checkinWall');
        if (!wall) return;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'checkin-avatar';
        
        if (data.avatarUrl) {
            avatarDiv.innerHTML = `<img src="${data.avatarUrl}" alt="${data.name}">`;
        } else {
            avatarDiv.textContent = data.name.charAt(0);
        }
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = data.name;
        avatarDiv.appendChild(nameSpan);
        
        wall.insertBefore(avatarDiv, wall.firstChild);
        
        // 限制头像数量
        while (wall.children.length > 50) {
            wall.removeChild(wall.lastChild);
        }
    }

    handleLotteryResult(data) {
        this.showSection('lottery');
        
        const titleEl = document.getElementById('lotteryTitle');
        const canvasEl = document.getElementById('lotteryCanvas');
        const resultEl = document.getElementById('lotteryResult');
        const winnerAvatarEl = document.getElementById('winnerAvatar');
        const winnerNameEl = document.getElementById('winnerName');
        const winnerDeptEl = document.getElementById('winnerDept');
        
        if (titleEl) titleEl.textContent = data.prizeLevel;
        
        // 显示抽奖动画
        if (canvasEl) {
            canvasEl.innerHTML = '<div style="font-size: 2rem;">🎲 抽奖中... 🎲</div>';
            canvasEl.parentElement.classList.add('lottery-animation');
        }
        
        // 3秒后显示结果
        setTimeout(() => {
            if (canvasEl) {
                canvasEl.parentElement.classList.remove('lottery-animation');
                canvasEl.style.display = 'none';
            }
            
            if (resultEl) {
                resultEl.style.display = 'block';
                
                if (winnerAvatarEl) {
                    if (data.winner.avatar_url) {
                        winnerAvatarEl.innerHTML = `<img src="${data.winner.avatar_url}" alt="${data.winner.name}">`;
                    } else {
                        winnerAvatarEl.textContent = data.winner.name.charAt(0);
                        winnerAvatarEl.style.display = 'flex';
                        winnerAvatarEl.style.alignItems = 'center';
                        winnerAvatarEl.style.justifyContent = 'center';
                        winnerAvatarEl.style.fontSize = '3rem';
                    }
                }
                
                if (winnerNameEl) winnerNameEl.textContent = data.winner.name;
                if (winnerDeptEl) winnerDeptEl.textContent = data.winner.department;
            }
            
            // 10秒后返回签到页面
            setTimeout(() => {
                this.showSection('checkin');
                this.resetLotteryDisplay();
            }, 10000);
        }, 3000);
    }

    resetLotteryDisplay() {
        const canvasEl = document.getElementById('lotteryCanvas');
        const resultEl = document.getElementById('lotteryResult');
        
        if (canvasEl) {
            canvasEl.style.display = 'flex';
            canvasEl.innerHTML = '';
        }
        
        if (resultEl) {
            resultEl.style.display = 'none';
        }
    }

    handleGameStart(data) {
        this.showSection('game');
        this.gameData.players = [];
        this.updateGameDisplay();
    }

    handleGameStop(data) {
        // 游戏结束，显示最终排行榜
        setTimeout(() => {
            this.showSection('checkin');
        }, 5000);
    }

    handleGameUpdate(data) {
        // 更新玩家分数
        const existingPlayer = this.gameData.players.find(p => p.userId === data.userId);
        if (existingPlayer) {
            existingPlayer.score = data.score;
        } else {
            this.gameData.players.push({
                userId: data.userId,
                score: data.score,
                timestamp: data.timestamp
            });
        }
        
        // 排序并更新显示
        this.gameData.players.sort((a, b) => b.score - a.score);
        this.updateGameDisplay();
    }

    updateGameDisplay() {
        const leaderboardEl = document.getElementById('gameLeaderboard');
        if (!leaderboardEl) return;
        
        leaderboardEl.innerHTML = '';
        
        // 显示前10名
        const topPlayers = this.gameData.players.slice(0, 10);
        
        topPlayers.forEach((player, index) => {
            const card = document.createElement('div');
            card.className = 'player-card';
            
            const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
            const rankColor = rankColors[index] || '#4ECDC4';
            
            card.innerHTML = `
                <div class="player-rank" style="color: ${rankColor}">
                    #${index + 1}
                </div>
                <div class="player-name">玩家 ${player.userId}</div>
                <div class="player-score">${player.score}</div>
            `;
            
            leaderboardEl.appendChild(card);
        });
        
        if (topPlayers.length === 0) {
            leaderboardEl.innerHTML = '<div style="text-align: center; font-size: 1.5rem; opacity: 0.7;">等待玩家加入...</div>';
        }
    }

    // 设置总人数（从管理后台获取）
    setTotalCount(count) {
        this.checkinData.total = count;
        this.updateCheckinDisplay();
    }
}

// 初始化大屏幕应用
document.addEventListener('DOMContentLoaded', () => {
    window.iLuckScreen = new iLuckScreen();
    
    // 模拟设置总人数（实际应该从后端获取）
    setTimeout(() => {
        window.iLuckScreen.setTotalCount(200);
    }, 1000);
});

// 键盘控制（用于演示）
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case '1':
            window.iLuckScreen.showSection('checkin');
            break;
        case '2':
            window.iLuckScreen.showSection('lottery');
            break;
        case '3':
            window.iLuckScreen.showSection('game');
            break;
    }
});