import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Progress } from 'antd';
import { UserOutlined, CheckCircleOutlined, GiftOutlined, TrophyOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [lotteryWinners, setLotteryWinners] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 初始化Socket连接
    const newSocket = io('http://localhost:3000');
    newSocket.emit('register', { type: 'admin' });
    
    newSocket.on('checkin_update', (data) => {
      fetchCheckinStats();
    });

    newSocket.on('lottery_result', (data) => {
      fetchLotteryWinners();
    });

    setSocket(newSocket);

    // 初始数据加载
    fetchCheckinStats();
    fetchLotteryWinners();

    return () => newSocket.close();
  }, []);

  const fetchCheckinStats = async () => {
    try {
      const response = await axios.get('/api/employees/checkin/stats');
      const { stats, recentCheckins } = response.data.data;
      
      setStats(stats);
      setRecentCheckins(recentCheckins);
    } catch (error) {
      console.error('获取签到统计失败:', error);
    }
  };

  const fetchLotteryWinners = async () => {
    try {
      const response = await axios.get('/api/lottery/winners');
      setLotteryWinners(response.data.data);
    } catch (error) {
      console.error('获取中奖记录失败:', error);
    }
  };

  // 计算总体统计数据
  const totalEmployees = stats?.reduce((sum, dept) => sum + dept.total_count, 0) || 0;
  const totalCheckedIn = stats?.reduce((sum, dept) => sum + dept.checked_in_count, 0) || 0;
  const checkinRate = totalEmployees > 0 ? Math.round((totalCheckedIn / totalEmployees) * 100) : 0;

  // 部门分布数据
  const departmentData = stats?.map(dept => ({
    name: dept.department,
    value: dept.checked_in_count,
    total: dept.total_count
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const recentCheckinsColumns = [
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
      title: '签到时间',
      dataIndex: 'checkin_time',
      key: 'checkin_time',
      render: (time) => moment(time).format('HH:mm:ss')
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
        const colors = {
          '一等奖': 'gold',
          '二等奖': 'blue',
          '三等奖': 'green'
        };
        return <Tag color={colors[level]}>{level}</Tag>;
      }
    },
    {
      title: '中奖时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => moment(time).format('HH:mm:ss')
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总员工数"
              value={totalEmployees}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已签到"
              value={totalCheckedIn}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="签到率"
              value={checkinRate}
              suffix="%"
              prefix={<Progress percent={checkinRate} size="small" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="中奖人数"
              value={lotteryWinners.length}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="部门签到分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, total }) => `${name}: ${value}/${total}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="部门签到统计">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="已签到" />
                <Bar dataKey="total" fill="#82ca9d" name="总人数" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="最近签到">
            <Table
              columns={recentCheckinsColumns}
              dataSource={recentCheckins}
              pagination={{ pageSize: 5 }}
              size="small"
              rowKey="checkin_time"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="中奖记录">
            <Table
              columns={winnersColumns}
              dataSource={lotteryWinners}
              pagination={{ pageSize: 5 }}
              size="small"
              rowKey="created_at"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;