import React, { useState } from 'react';
import {
  Card, Tabs, Table, Button, Space, Typography, Form, Input, Select,
  Row, Col, Tag, Modal, Upload, message, Divider, Switch, Avatar, Badge, Tooltip
} from 'antd';
import {
  UserOutlined, TeamOutlined, MailOutlined, InboxOutlined,
  ExportOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  SettingOutlined, LockOutlined,
  DownloadOutlined, KeyOutlined, SafetyOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

/* ========== 模拟数据 ========== */

const mockTeamMembers = [
  { key: '1', name: '张伟', role: '管理员', email: 'zhangwei@company.com', status: '在线', avatar: 'ZW', department: '销售部' },
  { key: '2', name: '李娜', role: '销售经理', email: 'lina@company.com', status: '在线', avatar: 'LN', department: '销售部' },
  { key: '3', name: '王磊', role: '销售专员', email: 'wanglei@company.com', status: '离线', avatar: 'WL', department: '销售部' },
  { key: '4', name: '赵敏', role: '市场专员', email: 'zhaomin@company.com', status: '在线', avatar: 'ZM', department: '市场部' },
  { key: '5', name: '陈浩', role: '销售专员', email: 'chenhao@company.com', status: '忙碌', avatar: 'CH', department: '销售部' },
  { key: '6', name: '刘芳', role: '数据分析师', email: 'liufang@company.com', status: '在线', avatar: 'LF', department: '运营部' },
];

const mockEmails = [
  { key: '1', email: 'sales@company.com', type: '企业邮箱', smtp: 'smtp.company.com', port: 465, ssl: true, status: '已验证', lastSync: '2026-06-06 10:30' },
  { key: '2', email: 'marketing@company.com', type: '企业邮箱', smtp: 'smtp.company.com', port: 465, ssl: true, status: '已验证', lastSync: '2026-06-06 10:28' },
  { key: '3', email: 'zhangwei@gmail.com', type: 'Gmail', smtp: 'smtp.gmail.com', port: 587, ssl: true, status: '已验证', lastSync: '2026-06-06 09:15' },
];

/* ========== 组件 ========== */

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [profileForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  /* -- 账号设置 -- */
  const handleSaveProfile = () => {
    profileForm.validateFields().then(() => {
      message.success('个人信息已保存');
    });
  };

  /* -- 团队管理 -- */
  const teamColumns = [
    {
      title: '成员', dataIndex: 'name', key: 'name',
      render: (name: string, record: typeof mockTeamMembers[0]) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>{record.avatar}</Avatar>
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.department}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '角色', dataIndex: 'role', key: 'role',
      render: (role: string) => <Tag color={role === '管理员' ? 'red' : role === '销售经理' ? 'blue' : 'default'}>{role}</Tag>,
    },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => {
        const map: Record<string, { color: string; text: string }> = {
          '在线': { color: 'success', text: '在线' },
          '离线': { color: 'default', text: '离线' },
          '忙碌': { color: 'warning', text: '忙碌' },
        };
        const info = map[status] || { color: 'default', text: status };
        return <Badge status={info.color as any} text={info.text} />;
      },
    },
    {
      title: '操作', key: 'action',
      render: () => (
        <Space>
          <Tooltip title="编辑"><Button type="link" icon={<EditOutlined />} size="small" /></Tooltip>
          <Tooltip title="重置密码"><Button type="link" icon={<KeyOutlined />} size="small" /></Tooltip>
          <Tooltip title="删除"><Button type="link" danger icon={<DeleteOutlined />} size="small" /></Tooltip>
        </Space>
      ),
    },
  ];

  /* -- 邮箱配置 -- */
  const emailColumns = [
    {
      title: '邮箱地址', dataIndex: 'email', key: 'email',
      render: (email: string) => <Text strong><MailOutlined style={{ marginRight: 8 }} />{email}</Text>,
    },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
    { title: 'SMTP服务器', dataIndex: 'smtp', key: 'smtp' },
    { title: '端口', dataIndex: 'port', key: 'port' },
    {
      title: 'SSL', dataIndex: 'ssl', key: 'ssl',
      render: (ssl: boolean) => ssl ? <Tag color="success">已启用</Tag> : <Tag>未启用</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => <Badge status={s === '已验证' ? 'success' : 'error'} text={s} />,
    },
    { title: '最后同步', dataIndex: 'lastSync', key: 'lastSync' },
    {
      title: '操作', key: 'action',
      render: () => (
        <Space>
          <Tooltip title="测试连接"><Button type="link" icon={<SafetyOutlined />} size="small" /></Tooltip>
          <Tooltip title="编辑"><Button type="link" icon={<EditOutlined />} size="small" /></Tooltip>
          <Tooltip title="删除"><Button type="link" danger icon={<DeleteOutlined />} size="small" /></Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddEmail = () => {
    emailForm.validateFields().then(() => {
      setEmailModalVisible(false);
      emailForm.resetFields();
      message.success('邮箱添加成功，正在验证...');
    });
  };

  const handleInviteMember = () => {
    setInviteModalVisible(false);
    message.success('邀请已发送（演示）');
  };

  const tabItems = [
    {
      key: 'account',
      label: <span><UserOutlined /> 账号设置</span>,
      children: (
        <Row gutter={24}>
          <Col span={16}>
            <Card title="个人信息">
              <Form
                form={profileForm}
                layout="vertical"
                initialValues={{
                  name: '张伟',
                  company: '深圳市XX进出口有限公司',
                  position: '外贸销售总监',
                  email: 'zhangwei@company.com',
                  phone: '+86-138-0013-8000',
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="公司名称" name="company" rules={[{ required: true, message: '请输入公司名称' }]}>
                      <Input prefix={<GlobalOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="职位" name="position">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="手机号" name="phone">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="时区">
                      <Select defaultValue="Asia/Shanghai">
                        <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                        <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                        <Option value="Europe/London">英国标准时间 (UTC+0)</Option>
                        <Option value="Asia/Tokyo">日本标准时间 (UTC+9)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" onClick={handleSaveProfile}>
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="安全设置" size="small">
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>修改密码</Text>
                  <Button type="link" icon={<LockOutlined />}>修改</Button>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>两步验证</Text>
                  <Switch defaultChecked size="small" />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>登录通知</Text>
                  <Switch defaultChecked size="small" />
                </div>
              </div>
              <Divider />
              <Text type="secondary" style={{ fontSize: 12 }}>
                上次登录：2026-06-06 09:15<br />
                登录IP：192.168.1.100<br />
                登录地点：深圳市南山区
              </Text>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'team',
      label: <span><TeamOutlined /> 团队管理</span>,
      children: (
        <div>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setInviteModalVisible(true)}>
              邀请成员
            </Button>
          </div>
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={6}><Text type="secondary">总成员：6 人</Text></Col>
              <Col span={6}><Text type="secondary">在线：4 人</Text></Col>
              <Col span={6}><Text type="secondary">管理员：1 人</Text></Col>
              <Col span={6}><Text type="secondary">本月活跃：5 人</Text></Col>
            </Row>
          </Card>
          <Table columns={teamColumns} dataSource={mockTeamMembers} rowKey="key" pagination={false} />
        </div>
      ),
    },
    {
      key: 'email',
      label: <span><MailOutlined /> 邮箱配置</span>,
      children: (
        <div>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setEmailModalVisible(true)}>
              添加邮箱
            </Button>
          </div>
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={6}><Text type="secondary">已配置邮箱：3 个</Text></Col>
              <Col span={6}><Text type="secondary">已验证：3 个</Text></Col>
              <Col span={6}><Text type="secondary">今日发送：45 封</Text></Col>
              <Col span={6}><Text type="secondary">发送限额剩余：955 封</Text></Col>
            </Row>
          </Card>
          <Table columns={emailColumns} dataSource={mockEmails} rowKey="key" pagination={false} />
        </div>
      ),
    },
    {
      key: 'data',
      label: <span><InboxOutlined /> 数据导入导出</span>,
      children: (
        <Row gutter={24}>
          <Col span={12}>
            <Card title="数据导入">
              <Paragraph type="secondary">
                支持导入 Excel (.xlsx, .xls) 和 CSV (.csv) 格式的客户数据文件。
                文件大小限制为 10MB，单次最多导入 5000 条记录。
              </Paragraph>
              <Dragger
                name="file"
                multiple={false}
                accept=".xlsx,.xls,.csv"
                showUploadList={true}
                beforeUpload={() => {
                  message.success('文件上传成功，正在解析...（演示）');
                  return false;
                }}
                style={{ padding: 20 }}
              >
                <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#1890ff', fontSize: 48 }} /></p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">支持 .xlsx、.xls、.csv 格式</p>
              </Dragger>
              <Divider />
              <div>
                <Text strong>下载导入模板：</Text>
                <div style={{ marginTop: 8 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block icon={<DownloadOutlined />} onClick={() => message.info('模板下载中...（演示）')}>
                      客户信息导入模板 (.xlsx)
                    </Button>
                    <Button block icon={<DownloadOutlined />} onClick={() => message.info('模板下载中...（演示）')}>
                      邮件联系人导入模板 (.xlsx)
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="数据导出">
              <Paragraph type="secondary">
                选择需要导出的数据类型，系统将生成对应的数据文件供下载。
              </Paragraph>
              <Form layout="vertical">
                <Form.Item label="导出数据类型">
                  <Select defaultValue="customers" placeholder="选择数据类型">
                    <Option value="customers">客户信息</Option>
                    <Option value="emails">邮件记录</Option>
                    <Option value="tasks">任务数据</Option>
                    <Option value="tracking">发送追踪数据</Option>
                    <Option value="all">全部数据</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="导出格式">
                  <Select defaultValue="xlsx" placeholder="选择导出格式">
                    <Option value="xlsx">Excel (.xlsx)</Option>
                    <Option value="csv">CSV (.csv)</Option>
                    <Option value="json">JSON (.json)</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="时间范围">
                  <Select defaultValue="all" placeholder="选择时间范围">
                    <Option value="all">全部时间</Option>
                    <Option value="30days">最近30天</Option>
                    <Option value="3months">最近3个月</Option>
                    <Option value="6months">最近6个月</Option>
                    <Option value="1year">最近1年</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" icon={<ExportOutlined />} block onClick={() => message.success('数据导出成功（演示）')}>
                    导出数据
                  </Button>
                </Form.Item>
              </Form>
              <Divider />
              <div>
                <Text strong>快速导出：</Text>
                <div style={{ marginTop: 8 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button block icon={<DownloadOutlined />} onClick={() => message.success('导出成功（演示）')}>
                      导出全部客户数据 (148条)
                    </Button>
                    <Button block icon={<DownloadOutlined />} onClick={() => message.success('导出成功（演示）')}>
                      导出本月邮件记录 (156条)
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        <SettingOutlined /> 系统设置
      </Title>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 添加邮箱弹窗 */}
      <Modal
        title="添加邮箱"
        open={emailModalVisible}
        onOk={handleAddEmail}
        onCancel={() => {
          setEmailModalVisible(false);
          emailForm.resetFields();
        }}
        okText="添加并验证"
        cancelText="取消"
      >
        <Form form={emailForm} layout="vertical">
          <Form.Item label="邮箱地址" name="email" rules={[{ required: true, type: 'email', message: '请输入有效邮箱地址' }]}>
            <Input placeholder="例如：sales@company.com" />
          </Form.Item>
          <Form.Item label="邮箱类型">
            <Select placeholder="选择邮箱类型">
              <Option value="enterprise">企业邮箱</Option>
              <Option value="gmail">Gmail</Option>
              <Option value="outlook">Outlook / Office365</Option>
              <Option value="yahoo">Yahoo</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Divider>SMTP 配置</Divider>
          <Form.Item label="SMTP 服务器" name="smtp" rules={[{ required: true, message: '请输入SMTP服务器地址' }]}>
            <Input placeholder="例如：smtp.company.com" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="端口" name="port" initialValue={465}>
                <Input type="number" placeholder="465" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="加密方式">
                <Select defaultValue="ssl">
                  <Option value="ssl">SSL</Option>
                  <Option value="tls">TLS</Option>
                  <Option value="none">无加密</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="用户名" name="username">
            <Input placeholder="通常与邮箱地址相同" />
          </Form.Item>
          <Form.Item label="密码 / 授权码" name="password" rules={[{ required: true, message: '请输入密码或授权码' }]}>
            <Input.Password placeholder="输入邮箱密码或应用专用授权码" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 邀请成员弹窗 */}
      <Modal
        title="邀请团队成员"
        open={inviteModalVisible}
        onOk={handleInviteMember}
        onCancel={() => setInviteModalVisible(false)}
        okText="发送邀请"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="邮箱地址" rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}>
            <Input placeholder="输入被邀请人的邮箱地址" />
          </Form.Item>
          <Form.Item label="角色">
            <Select placeholder="选择角色">
              <Option value="admin">管理员</Option>
              <Option value="manager">销售经理</Option>
              <Option value="sales">销售专员</Option>
              <Option value="marketing">市场专员</Option>
              <Option value="analyst">数据分析师</Option>
            </Select>
          </Form.Item>
          <Form.Item label="部门">
            <Select placeholder="选择部门">
              <Option value="sales">销售部</Option>
              <Option value="marketing">市场部</Option>
              <Option value="operations">运营部</Option>
              <Option value="admin">行政部</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
