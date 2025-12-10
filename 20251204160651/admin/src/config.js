// iLuck年会系统 - 配置文件
// 请根据您的部署环境修改以下配置

// API服务器地址
// ⚠️ 重要：请将下面的地址替换为您的Glitch项目地址
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-project.glitch.me';

// WebSocket连接地址
export const WS_URL = process.env.REACT_APP_WS_URL || 'https://your-project.glitch.me';

// 应用配置
export const APP_CONFIG = {
  name: 'iLuck年会系统',
  version: '1.0.0',
  description: '智能年会互动系统'
};

// 本地开发配置
export const DEV_CONFIG = {
  // 本地开发时使用
  API_BASE_URL: 'http://localhost:3000',
  WS_URL: 'http://localhost:3000'
};

// 生产环境配置
export const PROD_CONFIG = {
  // 生产环境使用
  API_BASE_URL: process.env.REACT_APP_API_URL || API_BASE_URL,
  WS_URL: process.env.REACT_APP_WS_URL || WS_URL
};

// 根据环境自动选择配置
export const CONFIG = process.env.NODE_ENV === 'development' ? DEV_CONFIG : PROD_CONFIG;

// 导出常用的API地址
export const API_ENDPOINTS = {
  // 员工管理
  EMPLOYEES: `${CONFIG.API_BASE_URL}/api/employees`,
  
  // 抽奖管理
  LOTTERY_CANDIDATES: `${CONFIG.API_BASE_URL}/api/lottery/candidates`,
  LOTTERY_WINNERS: `${CONFIG.API_BASE_URL}/api/lottery/winners`,
  
  // 游戏管理
  GAME_LEADERBOARD: `${CONFIG.API_BASE_URL}/api/game/leaderboard`,
  GAME_SCORE: `${CONFIG.API_BASE_URL}/api/game/score`
};

console.log('🔧 当前API配置:', CONFIG);
console.log('🌐 API端点:', API_ENDPOINTS);