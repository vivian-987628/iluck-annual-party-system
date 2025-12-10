const axios = require('axios');
const io = require('socket.io-client');

// 测试配置
const SERVER_URL = 'http://localhost:3000';
const TEST_EMPLOYEE = {
  name: '测试员工',
  department: '技术部',
  phone: '13800138000',
  email: 'test@example.com'
};

class SystemTest {
  constructor() {
    this.serverUrl = SERVER_URL;
    this.testResults = [];
  }

  async runTests() {
    console.log('🚀 开始系统测试...\n');

    try {
      // 测试服务器连接
      await this.testServerConnection();
      
      // 测试API接口
      await this.testEmployeeAPI();
      await this.testLotteryAPI();
      await this.testGameAPI();
      
      // 测试WebSocket连接
      await this.testWebSocketConnection();
      
      // 显示测试结果
      this.showResults();
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error.message);
    }
  }

  async testServerConnection() {
    try {
      const response = await axios.get(`${this.serverUrl}/`, { timeout: 5000 });
      this.addResult('服务器连接', true, '服务器响应正常');
    } catch (error) {
      this.addResult('服务器连接', false, error.message);
    }
  }

  async testEmployeeAPI() {
    try {
      // 测试添加员工
      const addResponse = await axios.post(`${this.serverUrl}/api/employees`, TEST_EMPLOYEE);
      this.addResult('添加员工API', addResponse.data.success, '成功添加测试员工');
      
      // 测试获取员工列表
      const listResponse = await axios.get(`${this.serverUrl}/api/employees`);
      this.addResult('获取员工列表API', listResponse.data.success, `共${listResponse.data.data.length}名员工`);
      
      // 测试签到统计
      const statsResponse = await axios.get(`${this.serverUrl}/api/employees/checkin/stats`);
      this.addResult('签到统计API', statsResponse.data.success, '统计数据获取成功');
      
    } catch (error) {
      this.addResult('员工API', false, error.message);
    }
  }

  async testLotteryAPI() {
    try {
      // 测试获取抽奖候选人
      const candidatesResponse = await axios.get(`${this.serverUrl}/api/lottery/candidates`);
      this.addResult('抽奖候选人API', candidatesResponse.data.success, `找到${candidatesResponse.data.data.length}名候选人`);
      
      // 测试获取中奖记录
      const winnersResponse = await axios.get(`${this.serverUrl}/api/lottery/winners`);
      this.addResult('中奖记录API', winnersResponse.data.success, `共${winnersResponse.data.data.length}条中奖记录`);
      
    } catch (error) {
      this.addResult('抽奖API', false, error.message);
    }
  }

  async testGameAPI() {
    try {
      // 测试获取排行榜
      const leaderboardResponse = await axios.get(`${this.serverUrl}/api/game/leaderboard`);
      this.addResult('游戏排行榜API', leaderboardResponse.data.success, '排行榜数据获取成功');
      
    } catch (error) {
      this.addResult('游戏API', false, error.message);
    }
  }

  async testWebSocketConnection() {
    return new Promise((resolve) => {
      const socket = io(this.serverUrl);
      
      const timeout = setTimeout(() => {
        this.addResult('WebSocket连接', false, '连接超时');
        socket.disconnect();
        resolve();
      }, 5000);
      
      socket.on('connect', () => {
        clearTimeout(timeout);
        this.addResult('WebSocket连接', true, 'Socket连接成功');
        
        // 测试事件注册
        socket.emit('register', { type: 'test', userId: 'test-user' });
        this.addResult('Socket事件注册', true, '客户端注册成功');
        
        socket.disconnect();
        resolve();
      });
      
      socket.on('connect_error', (error) => {
        clearTimeout(timeout);
        this.addResult('WebSocket连接', false, error.message);
        resolve();
      });
    });
  }

  addResult(testName, success, message) {
    this.testResults.push({
      name: testName,
      success,
      message
    });
    
    const status = success ? '✅' : '❌';
    console.log(`${status} ${testName}: ${message}`);
  }

  showResults() {
    console.log('\n📊 测试结果汇总:');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;
    
    console.log(`总测试数: ${total}`);
    console.log(`通过数: ${passed}`);
    console.log(`失败数: ${total - passed}`);
    console.log(`通过率: ${Math.round((passed / total) * 100)}%`);
    
    if (passed === total) {
      console.log('\n🎉 所有测试通过！系统运行正常。');
    } else {
      console.log('\n⚠️  部分测试失败，请检查系统配置。');
    }
    
    console.log('\n📝 详细结果:');
    this.testResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`  ${status} ${result.name}: ${result.message}`);
    });
  }
}

// 运行测试
if (require.main === module) {
  const tester = new SystemTest();
  tester.runTests().catch(console.error);
}

module.exports = SystemTest;