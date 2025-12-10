import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  Select, 
  Modal, 
  message, 
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  List,
  Avatar
} from 'antd';
import { PlayCircleOutlined, ExportOutlined, TrophyOutlined } from '@ant-design/icons';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment';

const Lottery = () => {
  const [candidates, setCandidates] = useState([]);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lotteryModalVisible, setLotteryModalVisible] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [socket, setSocket] = useState(null);

  const prizeLevels = [
    { value: '三等奖', label: '三等奖', color: 'green' },
    { value: '二等奖', label: '二等奖', color: 'blue' },
    { value: '一等奖', label: '一等奖', color: 'gold' },
  ];

  useEffect(() => {
    // 初始化Socket连接
    const newSocket = io('http://localhost:3000');
    newSocket.emit('register', { type: 'admin' });
    
    newSocket.on('lottery_result', (data) => {
      setIsDrawing(false);
      setCurrentWinner(data.winner);
      fetchWinners();
      message.success(`恭喜 ${data.winner.name} 中得${data.prizeLevel}！`);
    });

    setSocket(newSocket);

    // 初始数据加载
    fetchCandidates();
    fetchWinners();

    return () => newSocket.close();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('/api/lottery/candidates');
      setCandidates(response.data.data);
    } catch (error) {
      message.error('获取抽奖候选人失败');
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await axios.get('/api/lottery/winners');
      setWinners(response.data.data);
    } catch (error) {
      message.error('获取中奖记录失败');
    }
  };

  const startLottery = () => {
    if (!selectedPrize) {
      message.warning('请先选择奖项等级');
      return;
    }

    if (candidates.length === 0) {
      message.warning('没有可抽奖的候选人');
      return;
    }

    setIsDrawing(true);
    setCurrentWinner(null);
    
    // 发送抽奖请求到服务器
    socket.emit('start_lottery', { prizeLevel: selectedPrize });
  };

  const exportWinners = async () => {
    try {
      const response = await axios.get('/api/lottery/export');
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `中奖名单_${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`;
      link.click();
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  const candidatesColumns = [
    {
      title: '头像',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (url) => (
        <Avatar src={url} icon={<TrophyOutlined />} />
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
  ];

  const winnersColumns = [
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
      title: '奖项',
      dataIndex: 'prize_level',
      key: 'prize_level',
      render: (level) => {
        const prize = prizeLevels.find(p => p.value === level);
        return <Tag color={prize?.color}>{level}</Tag>;
      }
    },
    {
      title: '中奖时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const prizeStats = prizeLevels.map(prize => {
    const count = winners.filter(w => w.prize_level === prize.value).length;
    return { ...prize, count };
  });

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {prizeStats.map(prize => (
          <Col span={8} key={prize.value}>
            <Card>
              <Statistic
                title={prize.value}
                value={prize.count}
                prefix={<TrophyOutlined style={{ color: prize.color }} />}
                valueStyle={{ color: prize.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="抽奖控制" extra={
            <Space>
              <Select
                placeholder="选择奖项等级"
                value={selectedPrize}
                onChange={setSelectedPrize}
                style={{ width: 120 }}
              >
                {prizeLevels.map(prize => (
                  <Select.Option key={prize.value} value={prize.value}>
                    {prize.label}
                  </Select.Option>
                ))}
              </Select>
              
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={startLottery}
                loading={isDrawing}
                disabled={!selectedPrize}
              >
                开始抽奖
              </Button>
              
              <Button
                icon={<ExportOutlined />}
                onClick={exportWinners}
              >
                导出名单
              </Button>
            </Space>
          }>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {isDrawing && (
                <div style={{ fontSize: '18px', color: '#1890ff' }}>
                  抽奖进行中...
                </div>
              )}
              
              {currentWinner && (
                <div>
                  <Avatar 
                    size={80} 
                    src={currentWinner.avatar_url} 
                    style={{ marginBottom: 16 }}
                  />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 8 }}>
                    {currentWinner.name}
                  </div>
                  <div style={{ fontSize: '16px', color: '#666', marginBottom: 8 }}>
                    {currentWinner.department}
                  </div>
                  <Tag color={prizeLevels.find(p => p.value === selectedPrize)?.color}>
                    {selectedPrize}
                  </Tag>
                </div>
              )}
              
              {!isDrawing && !currentWinner && (
                <div style={{ color: '#999' }}>
                  选择奖项后点击开始抽奖
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={`抽奖候选人 (${candidates.length}人)`}>
            <Table
              columns={candidatesColumns}
              dataSource={candidates}
              pagination={{ pageSize: 5 }}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Card title="中奖记录" style={{ marginTop: 16 }}>
        <Table
          columns={winnersColumns}
          dataSource={winners}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          rowKey="created_at"
        />
      </Card>
    </div>
  );
};

export default Lottery;