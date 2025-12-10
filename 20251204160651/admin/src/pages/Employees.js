import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Upload, 
  Modal, 
  Form, 
  Input, 
  message, 
  Space,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic
} from 'antd';
import { UploadOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import axios from 'axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data.data);
    } catch (error) {
      message.error('获取员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values) => {
    try {
      await axios.post('/api/employees', values);
      message.success('添加员工成功');
      setModalVisible(false);
      form.resetFields();
      fetchEmployees();
    } catch (error) {
      message.error('添加员工失败');
    }
  };

  const handleImport = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const response = await axios.post('/api/employees/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      message.success(response.data.message);
      fetchEmployees();
    } catch (error) {
      message.error('导入失败: ' + (error.response?.data?.message || '未知错误'));
    } finally {
      setUploading(false);
    }
    
    return false; // 阻止默认上传行为
  };

  const exportTemplate = () => {
    const csvContent = '姓名,部门,电话,邮箱\n张三,技术部,13800138000,zhangsan@company.com\n李四,市场部,13800138001,lisi@company.com';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '员工导入模板.csv';
    link.click();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => new Date(time).toLocaleString(),
    },
  ];

  const stats = {
    total: employees.length,
    departments: [...new Set(employees.map(emp => emp.department))].length,
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总员工数"
              value={stats.total}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="部门数量"
              value={stats.departments}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="导入状态"
              value="正常"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="员工管理">
        <Space style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            添加员工
          </Button>
          
          <Upload
            accept=".xlsx,.xls,.csv"
            beforeUpload={handleImport}
            showUploadList={false}
          >
            <Button 
              icon={<UploadOutlined />}
              loading={uploading}
            >
              批量导入
            </Button>
          </Upload>
          
          <Button 
            icon={<ExportOutlined />}
            onClick={exportTemplate}
          >
            下载模板
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="添加员工"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="电话"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;