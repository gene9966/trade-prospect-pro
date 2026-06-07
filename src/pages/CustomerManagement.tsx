import React, { useState, useEffect } from 'react';
import {
  Table, Card, Input, Select, Button, Tag, Drawer, Space, Typography,
  Descriptions, Timeline, Divider, Row, Col, Tooltip,
  message, Popconfirm, Form, Modal
} from 'antd';
import {
  PlusOutlined, SearchOutlined, PhoneOutlined, MailOutlined,
  GlobalOutlined, BankOutlined, UserOutlined, EditOutlined,
  DeleteOutlined, EyeOutlined
} from '@ant-design/icons';
import { customerApi, followUpApi, type Customer, type FollowUp, stageMap, stageReverseMap } from '../lib/supabase';

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState('');
  const [stageFilter, setStageFilter] = useState<string | undefined>(undefined);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [followRecords, setFollowRecords] = useState<FollowUp[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  // 加载客户数据
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const { data, error } = await customerApi.getAll();
    setLoading(false);
    if (error) {
      message.error('加载客户数据失败：' + error.message);
      return;
    }
    const list = data || [];
    setCustomers(list);
    setFilteredCustomers(list);
  };

  const loadFollowRecords = async (customerId: string) => {
    const { data, error } = await followUpApi.getByCustomer(customerId);
    if (error) {
      message.error('加载跟进记录失败：' + error.message);
      return;
    }
    setFollowRecords(data || []);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(value, stageFilter);
  };

  const handleStageFilter = (value: string | undefined) => {
    setStageFilter(value);
    applyFilters(searchText, value);
  };

  const applyFilters = (search: string, stage: string | undefined) => {
    let result = [...customers];
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.company_name?.toLowerCase().includes(lower) ||
          c.contact_person?.toLowerCase().includes(lower) ||
          c.country?.toLowerCase().includes(lower) ||
          c.email?.toLowerCase().includes(lower)
      );
    }
    if (stage) {
      result = result.filter((c) => c.stage === stageReverseMap[stage]);
    }
    setFilteredCustomers(result);
    setCurrentPage(1);
  };

  const showDrawer = (record: Customer) => {
    setSelectedCustomer(record);
    loadFollowRecords(record.id);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedCustomer(null);
    setFollowRecords([]);
  };

  const handleAddCustomer = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setEditingId(record.id);
    form.setFieldsValue({
      company_name: record.company_name,
      country: record.country,
      industry: record.industry,
      contact_person: record.contact_person,
      email: record.email,
      phone: record.phone,
      website: record.website,
      stage: record.stage,
      priority: record.priority,
      source: record.source,
      notes: record.notes,
    });
    setModalVisible(true);
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    if (editingId) {
      const { error } = await customerApi.update(editingId, values);
      setLoading(false);
      if (error) {
        message.error('更新失败：' + error.message);
        return;
      }
      message.success('客户更新成功');
    } else {
      const { error } = await customerApi.insert(values);
      setLoading(false);
      if (error) {
        message.error('添加失败：' + error.message);
        return;
      }
      message.success('客户添加成功');
    }
    setModalVisible(false);
    loadCustomers();
  };

  const handleDelete = async (id: string) => {
    const { error } = await customerApi.delete(id);
    if (error) {
      message.error('删除失败：' + error.message);
      return;
    }
    message.success('删除成功');
    loadCustomers();
  };

  const pipelineData = [
    { stage: '线索', count: customers.filter((c) => c.stage === 'lead').length, color: '#d9d9d9' },
    { stage: '意向', count: customers.filter((c) => c.stage === 'interested').length, color: '#1890ff' },
    { stage: '报价', count: customers.filter((c) => c.stage === 'quoted').length, color: '#faad14' },
    { stage: '谈判', count: customers.filter((c) => c.stage === 'negotiating').length, color: '#722ed1' },
    { stage: '成交', count: customers.filter((c) => c.stage === 'closed').length, color: '#52c41a' },
  ];

  const columns = [
    {
      title: '公司名称',
      dataIndex: 'company_name',
      key: 'company_name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
      render: (text: string) => (
        <Space>
          <GlobalOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      render: (text: string) => (
        <Space>
          <BankOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        const info = stageMap[stage] || { label: stage, color: 'default' };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: '联系人',
      dataIndex: 'contact_person',
      key: 'contact_person',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <Space>
          <MailOutlined />
          <Text copyable>{text}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Customer) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} onClick={() => showDrawer(record)} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="确定删除该客户？" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="删除">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        <UserOutlined /> 客户管理 (CRM)
      </Title>

      {/* Pipeline 概览 */}
      <Card style={{ marginBottom: 16 }} size="small">
        <Text strong style={{ marginBottom: 12, display: 'block' }}>
          商机 Pipeline
        </Text>
        <Row gutter={16} align="middle">
          {pipelineData.map((item) => (
            <Col key={item.stage} flex="auto">
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    height: 32,
                    backgroundColor: item.color,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.stage === '线索' ? '#333' : '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}
                >
                  {item.stage}: {item.count}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 搜索和筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="搜索公司名、联系人、国家、邮箱..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          <Col>
            <Select
              placeholder="筛选阶段"
              style={{ width: 140 }}
              allowClear
              onChange={handleStageFilter}
              size="large"
            >
              <Option value="线索">线索</Option>
              <Option value="意向">意向</Option>
              <Option value="报价">报价</Option>
              <Option value="谈判">谈判</Option>
              <Option value="成交">成交</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAddCustomer}>
              添加客户
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 客户列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredCustomers.length,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条客户记录`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      {/* 客户详情抽屉 */}
      <Drawer
        title={selectedCustomer ? `${selectedCustomer.company_name} - 客户详情` : '客户详情'}
        placement="right"
        width={600}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {selectedCustomer && (
          <div>
            <Title level={5}>基本信息</Title>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="公司名称">{selectedCustomer.company_name}</Descriptions.Item>
              <Descriptions.Item label="联系人">{selectedCustomer.contact_person}</Descriptions.Item>
              <Descriptions.Item label="邮箱">
                <a href={`mailto:${selectedCustomer.email}`}>{selectedCustomer.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="电话">{selectedCustomer.phone}</Descriptions.Item>
              <Descriptions.Item label="国家">{selectedCustomer.country}</Descriptions.Item>
              <Descriptions.Item label="行业">{selectedCustomer.industry}</Descriptions.Item>
              <Descriptions.Item label="阶段">
                <Tag color={stageMap[selectedCustomer.stage]?.color}>{stageMap[selectedCustomer.stage]?.label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={selectedCustomer.priority === 'A' ? 'red' : selectedCustomer.priority === 'B' ? 'orange' : 'blue'}>
                  {selectedCustomer.priority}级
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>跟进记录</Title>
            {followRecords.length === 0 ? (
              <Text type="secondary">暂无跟进记录</Text>
            ) : (
              <Timeline
                items={followRecords.map((record) => ({
                  color: record.type === 'email' ? 'blue' : record.type === 'phone' ? 'green' : record.type === 'meeting' ? 'purple' : 'orange',
                  children: (
                    <div>
                      <Text type="secondary">{new Date(record.created_at).toLocaleDateString()}</Text>
                      <Tag style={{ marginLeft: 8 }}>{record.type === 'email' ? '邮件' : record.type === 'phone' ? '电话' : record.type === 'meeting' ? '会议' : '备注'}</Tag>
                      <div style={{ marginTop: 4 }}>{record.content}</div>
                    </div>
                  ),
                }))}
              />
            )}

            <Divider />

            <Title level={5}>备注</Title>
            <Text>{selectedCustomer.notes || '暂无备注'}</Text>

            <Divider />

            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => { closeDrawer(); handleEdit(selectedCustomer); }}>
                编辑客户
              </Button>
              <Button icon={<PhoneOutlined />}>发起跟进</Button>
              <Button icon={<MailOutlined />}>发送邮件</Button>
            </Space>
          </div>
        )}
      </Drawer>

      {/* 添加/编辑客户弹窗 */}
      <Modal
        title={editingId ? '编辑客户' : '添加客户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="company_name" label="公司名称" rules={[{ required: true, message: '请输入公司名称' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="country" label="国家" rules={[{ required: true, message: '请输入国家' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="industry" label="行业">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contact_person" label="联系人">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱">
                <Input type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="电话">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="website" label="网站">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="source" label="客户来源">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="stage" label="阶段" initialValue="lead">
                <Select>
                  <Option value="lead">线索</Option>
                  <Option value="contacted">初步接触</Option>
                  <Option value="interested">意向</Option>
                  <Option value="quoted">报价</Option>
                  <Option value="negotiating">谈判</Option>
                  <Option value="closed">成交</Option>
                  <Option value="lost">流失</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" initialValue="B">
                <Select>
                  <Option value="A">A级 - 高</Option>
                  <Option value="B">B级 - 中</Option>
                  <Option value="C">C级 - 低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
