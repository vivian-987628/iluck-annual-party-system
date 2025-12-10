import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Select, 
  message, 
  Space,
  Row,
  Col,
  Statistic,
  Progress,
  Tag
} from 'antd';
import { PlayCircleOutlined, TrophyOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment';

const Games = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, finished
  const [selectedGame, setSelectedGame] = useState('shake');
  const [socket, setSocket] = useState(null);
  const [realtimeScores, setRealtimeScores] = useState([]);

  const gameTypes = [
    { value: 'shake', label: '摇一摇', color: '#1890ff' },
    { value: 'quiz', label: '知识问答', color: '#52c41a' },
    { value: 'lucky', label: '幸运转盘', color: '#faad14' },
  ];

  useEffect(() => {
    // 初始化Socket连接
    const newSocket = io('http://localhost:3000');
    newSocket.emit('register', { type: 'admin' });
    
    newSocket.on('game_update', (data) => {
      setRealtimeScores(prev => {
        const existing = prev.findIndex(item => item.userId === data.userId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    setSocket(newSocket);

    // 初始数据加载
    fetchLeaderboard();

    return () => newSocket.close();
  }, [selectedGame]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/game/leaderboard', {
        params: { gameType: selectedGame, limit: 50 }
      });
      setLeaderboard(response.data.data);
    } catch (error) {
      message.error('获取排行榜失败');
    }
  };

  const startGame = () => {
    setGameStatus('playing');
    setRealtimeScores([]);
    message.success('游戏开始！');
    
    // 这里可以发送游戏开始信号到大屏幕
    socket?.emit('game_start', { gameType: selectedGame });
  };

  const stopGame = () => {
    setGameStatus('finished');
    message.success('游戏结束！');
    
    // 发送游戏结束信号
    socket?.emit('game_stop', { gameType: selectedGame });
    
    // 刷新排行榜
    setTimeout(fetchLeaderboard, 1000);
  };

  const resetGame = () => {
    setGameStatus('idle');
    setRealtimeScores([]);
    message.info('游戏已重置');
  };

  const columns = [
    {
      title: '排名',
      key: 'rank',
      render: (_, record, index) => (
        <Tag color={index < 3 ? ['gold', 'silver', '#cd7f32'][index] : 'default'}>
          #{index + 1}
        </Tag>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '分数',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {score}
        </span>
      ),
    },
    {
      title: '游戏时间',
      dataIndex: 'game_time',
      key: 'game_time',
      render: (time) => moment(time).format('HH:mm:ss'),
    },
  ];

  const realtimeColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '当前分数',
      dataIndex: 'score',
      key: 'score',
      render: (score) => (
        <Progress 
          percent={Math.min(score, 100)} 
          size="small" 
          format={() => score}
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => moment(time).format('HH:mm:ss'),
    },
  ];

  const gameStats = {
    totalPlayers: leaderboard.length,
    avgScore: leaderboard.length > 0 
      ? Math.round(leaderboard.reduce((sum, item) => sum + item.score, 0) / leaderboard.length)
      : 0,
    highScore: leaderboard.length > 0 ? Math.max(...leaderboard.map(item => item.score)) : 0,
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="参与人数"
              value={gameStats.totalPlayers}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均分数"
              value={gameStats.avgScore}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="最高分数"
              value={gameStats.highScore}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="游戏控制" extra={
            <Space>
              <Select
                placeholder="选择游戏类型"
                value={selectedGame}
                onChange={setSelectedGame}
                style={{ width: 120 }}
                disabled={gameStatus === 'playing'}
              >
                {gameTypes.map(game => (
                  <Select.Option key={game.value} value={game.value}>
                    {game.label}
                  </Select.Option>
                ))}
              </Select>
              
              {gameStatus === 'idle' && (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={startGame}
                >
                  开始游戏
                </Button>
              )}
              
              {gameStatus === 'playing' && (
                <Button
                  danger
                  onClick={stopGame}
                >
                  结束游戏
                </Button>
              )}
              
              <Button
                icon={<ReloadOutlined />}
                onClick={resetGame}
              >
                重置
              </Button>
            </Space>
          }>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '18px', marginBottom: 16 }}>
                游戏状态: <Tag color={gameStatus === 'playing' ? 'green' : gameStatus === 'finished' ? 'blue' : 'default'}>
                  {gameStatus === 'playing' ? '进行中' : gameStatus === 'finished' ? '已结束' : '待开始'}
                </Tag>
              </div>
              
              <div style={{ fontSize: '16px', color: '#666' }}>
                当前游戏: <Tag color={gameTypes.find(g => g.value === selectedGame)?.color}>
                  {gameTypes.find(g => g.value === selectedGame)?.label}
                </Tag>
              </div>
              
              {gameStatus === 'playing' && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '14px', color: '#999' }}>
                    实时参与人数: {realtimeScores.length}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="实时分数">
            <Table
              columns={realtimeColumns}
              dataSource={realtimeScores}
              pagination={false}
              size="small"
              rowKey="userId"
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="排行榜" style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={leaderboard}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          rowKey="game_time"
        />
      </Card>
    </div>
  );
};

export default Games;