import React, { useState, useEffect } from 'react';
import {
  Card, Tabs, Table, Button, Space, Typography, Tag, Modal, Form,
  Input, Select, DatePicker, Row, Col, message, Tooltip, Checkbox
} from 'antd';
import {
  PlusOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CalendarOutlined, DeleteOutlined,
  FlagOutlined, UserOutlined
} from '@ant-design/icons';
import { taskApi, type Task } from '../lib/supabase';

const { Title, Text } = Typography;
const { Option } = Select;

const priorityColorMap: Record<string, string> = {
  'high': 'red',
  'medium': 'orange',
  'low': 'blue',
};

const priorityLabelMap: Record<string, string> = {
  'high': '紧急',
  'medium': '中',
  'low': '低',
};

// const typeIconMap: Record<string, React.ReactNode> = {
//   '邮件': <span style={{ color: '#1890ff' }}>✉</span>,
//   '会议': <span style={{ color: '#722ed1' }}>📹</span>,
//   '快递': <span style={{ color: '#fa8c16' }}>📦</span>,
//   '跟进': <span style={{ color: '#52c41a' }}>🔄</span>,
//   '数据录入': <span style={{ color: '#13c2c2' }}>📝</span>,
//   '文档': <span style={{ color: '#eb2f96' }}>📄</span>,
//   '电话': <span style={{ color: '#faad14' }}>📞</span>,
//   '报告': <span style={{ color: '#2f54eb' }}>📊</span>,
//   '谈判': <span style={{ color: '#f5222d' }}>🤝</span>,
// };

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 加载任务数据
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const { data, error } = await taskApi.getAll();
    setLoading(false);
    if (error) {
      message.error('加载任务失败：' + error.message);
      return;
    }
    setTasks(data || []);
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const { error } = await taskApi.toggleStatus(id, newStatus);
    if (error) {
      message.error('更新失败：' + error.message);
      return;
    }
    message.success('任务状态已更新');
    loadTasks();
  };

  const handleDelete = async (id: string) => {
    const { error } = await taskApi.delete(id);
    if (error) {
      message.error('删除失败：' + error.message);
      return;
    }
    message.success('任务已删除');
    loadTasks();
  };

  const handleCreateTask = async () => {
    try {
      const values = await form.validateFields();
      const { error } = await taskApi.insert({
        title: values.title,
        customer_id: null,
        customer_name: values.customer || '-',
        priority: values.priority,
        due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: values.notes || '',
      });
      if (error) {
        message.error('创建失败：' + error.message);
        return;
      }
      message.success('任务创建成功');
      setModalVisible(false);
      form.resetFields();
      loadTasks();
    } catch (e) {
      // validation error
    }
  };

  const columns = [
    {
      title: '状态',
      key: 'status',
      width: 50,
      render: (_: unknown, record: Task) => (
        <Checkbox
          checked={record.status === 'completed'}
          onChange={() => handleToggleStatus(record.id, record.status)}
        />
      ),
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <Text delete={record.status === 'completed'} style={{ fontWeight: 500 }}>
          {text}
        </Text>
      ),
    },
    {
      title: '关联客户',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (text: string) => <Tag color={priorityColorMap[text]} icon={<FlagOutlined />}>{priorityLabelMap[text]}</Tag>,
      sorter: (a: Task, b: Task) => {
        const order = { 'high': 0, 'medium': 1, 'low': 2 };
        return order[a.priority] - order[b.priority];
      },
    },
    {
      title: '截止时间',
      dataIndex: 'due_date',
      key: 'due_date',
      sorter: (a: Task, b: Task) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
      render: (text: string) => {
        const isOverdue = new Date(text) < new Date() && new Date(text).toDateString() !== new Date().toDateString();
        return <Text type={isOverdue ? 'danger' : undefined}>{text}</Text>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'} icon={status === 'completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {status === 'completed' ? '已完成' : '待办'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Task) => (
        <Space>
          <Tooltip title="删除">
            <Button type="link" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* -- 日历视图 -- */
  const generateCalendarDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { day: number; tasks: Task[] }[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTasks = tasks.filter((t) => t.due_date === dateStr);
      days.push({ day: i, tasks: dayTasks });
    }
    return { firstDay, days, year, month: month + 1 };
  };

  const { firstDay, days, year, month } = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const tabItems = [
    {
      key: 'list',
      label: <span><CheckCircleOutlined /> 任务列表</span>,
      children: (
        <div>
          <Space style={{ marginBottom: 16 }}>
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <Button
                key={f}
                type={filter === f ? 'primary' : 'default'}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '全部' : f === 'pending' ? '待办' : '已完成'} ({f === 'all' ? tasks.length : tasks.filter((t) => t.status === f).length})
              </Button>
            ))}
            <div style={{ flex: 1 }} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
              新建任务
            </Button>
          </Space>
          <Table columns={columns} dataSource={filteredTasks} rowKey="id" loading={loading} />
        </div>
      ),
    },
    {
      key: 'calendar',
      label: <span><CalendarOutlined /> 日历视图</span>,
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 18 }}>{year}年{month}月</Text>
          </div>
          <Row gutter={[4, 4]}>
            {weekDays.map((d) => (
              <Col key={d} span={3} style={{ textAlign: 'center', fontWeight: 'bold', padding: 8 }}>
                {d}
              </Col>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <Col key={`empty-${i}`} span={3} />
            ))}
            {days.map(({ day, tasks: dayTasks }) => (
              <Col key={day} span={3}>
                <Card
                  size="small"
                  style={{
                    minHeight: 80,
                    backgroundColor: dayTasks.length > 0 ? '#e6f7ff' : '#fafafa',
                    borderColor: dayTasks.some((t) => t.priority === 'high') ? '#ff4d4f' : '#d9d9d9',
                  }}
                  bodyStyle={{ padding: 8 }}
                >
                  <Text strong>{day}</Text>
                  {dayTasks.map((t) => (
                    <div key={t.id} style={{ marginTop: 2 }}>
                      <Tag
                        color={priorityColorMap[t.priority]}
                        style={{ fontSize: 11, padding: '0 4px', margin: 0, width: '100%' }}
                      >
                        {t.title.length > 8 ? t.title.substring(0, 8) + '...' : t.title}
                      </Tag>
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        <ClockCircleOutlined /> 任务日程
      </Title>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 新建任务弹窗 */}
      <Modal
        title="新建任务"
        open={modalVisible}
        onOk={handleCreateTask}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="任务名称" name="title" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input placeholder="输入任务名称" />
          </Form.Item>
          <Form.Item label="关联客户" name="customer">
            <Input placeholder="输入关联客户名称（可选）" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级' }]} initialValue="medium">
                <Select placeholder="选择优先级">
                  <Option value="high">紧急</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="截止时间" name="due_date" rules={[{ required: true, message: '请选择截止时间' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="选择截止日期" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="任务描述" name="notes">
            <Input.TextArea rows={3} placeholder="输入任务描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
