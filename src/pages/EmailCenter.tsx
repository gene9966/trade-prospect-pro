import React, { useState } from 'react';
import {
  Card, Tabs, Table, Button, Space, Typography, Tag, Input, Select,
  Row, Col, Statistic, Progress, Modal, Form, message, Badge, Tooltip, Divider
} from 'antd';
import {
  MailOutlined, SendOutlined, PlusOutlined, EyeOutlined,
  EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined,
  FileTextOutlined, BarChartOutlined, RobotOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/* ========== 模拟数据 ========== */

const mockTemplates = [
  { key: '1', name: '首次联系 - 英文', type: '首次联系', language: '英文', createdAt: '2026-05-20', status: '已发布' },
  { key: '2', name: '产品报价 - 英文', type: '报价跟进', language: '英文', createdAt: '2026-05-18', status: '已发布' },
  { key: '3', name: '展会邀请 - 中文', type: '活动邀请', language: '中文', createdAt: '2026-05-15', status: '草稿' },
  { key: '4', name: '节日问候 - 多语言', type: '节日问候', language: '英文/中文/西班牙文', createdAt: '2026-05-10', status: '已发布' },
  { key: '5', name: '样品确认 - 英文', type: '样品跟进', language: '英文', createdAt: '2026-05-08', status: '已发布' },
  { key: '6', name: '催促回复 - 英文', type: '催促跟进', language: '英文', createdAt: '2026-04-28', status: '草稿' },
];

const mockTracking = [
  { key: '1', recipient: 'Hans Mueller', company: 'Berlin Trading GmbH', subject: 'LED驱动器报价更新', sentAt: '2026-06-05 10:30', status: '已打开', openedAt: '2026-06-05 15:22', replied: false },
  { key: '2', recipient: 'Yuki Tanaka', company: 'Tokyo Electronics Corp.', subject: '蓝牙耳机批量报价', sentAt: '2026-06-03 09:15', status: '已回复', openedAt: '2026-06-03 11:40', replied: true },
  { key: '3', recipient: 'Marie Dupont', company: 'Paris Fashion Group', subject: '2027春夏面料系列', sentAt: '2026-06-01 14:00', status: '已打开', openedAt: '2026-06-02 08:30', replied: false },
  { key: '4', recipient: 'James Wilson', company: 'Sydney Mining Solutions', subject: '矿业设备产品目录', sentAt: '2026-05-28 16:45', status: '退信', openedAt: '-', replied: false },
  { key: '5', recipient: 'Ahmed Al-Rashid', company: 'Dubai Construction LLC', subject: '瓷砖订单确认函', sentAt: '2026-05-25 11:20', status: '已回复', openedAt: '2026-05-25 14:10', replied: true },
  { key: '6', recipient: 'Emily Thompson', company: 'London Pharma Ltd.', subject: '药用辅料产品介绍', sentAt: '2026-05-20 08:50', status: '未打开', openedAt: '-', replied: false },
  { key: '7', recipient: 'Carlos Silva', company: 'Sao Paulo Import S.A.', subject: '家居用品报价单', sentAt: '2026-05-18 13:30', status: '已打开', openedAt: '2026-05-19 10:15', replied: false },
];

const mockSequences = [
  { key: '1', name: '新线索开发序列', type: '首次联系', emailCount: 5, status: '运行中', triggerCount: 32, replyCount: 8 },
  { key: '2', name: '展会跟进序列', type: '活动跟进', emailCount: 3, status: '运行中', triggerCount: 15, replyCount: 5 },
  { key: '3', name: '报价催促序列', type: '报价跟进', emailCount: 4, status: '已暂停', triggerCount: 20, replyCount: 3 },
  { key: '4', name: '样品确认序列', type: '样品跟进', emailCount: 3, status: '运行中', triggerCount: 10, replyCount: 6 },
  { key: '5', name: '节日祝福序列', type: '节日问候', emailCount: 1, status: '已完成', triggerCount: 50, replyCount: 12 },
];

/* ========== 组件 ========== */

const EmailCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [sendForm] = Form.useForm();
  const [sequenceModalVisible, setSequenceModalVisible] = useState(false);

  /* -- 邮件模板 -- */
  const templateColumns = [
    { title: '模板名称', dataIndex: 'name', key: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
    { title: '语言', dataIndex: 'language', key: 'language' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Badge status={s === '已发布' ? 'success' : 'default'} text={s} /> },
    {
      title: '操作', key: 'action', render: () => (
        <Space>
          <Tooltip title="编辑"><Button type="link" icon={<EditOutlined />} size="small" /></Tooltip>
          <Tooltip title="预览"><Button type="link" icon={<EyeOutlined />} size="small" /></Tooltip>
          <Tooltip title="删除"><Button type="link" danger icon={<DeleteOutlined />} size="small" /></Tooltip>
        </Space>
      ),
    },
  ];

  /* -- 发送追踪 -- */
  const trackingColumns = [
    { title: '收件人', dataIndex: 'recipient', key: 'recipient' },
    { title: '公司', dataIndex: 'company', key: 'company' },
    { title: '主题', dataIndex: 'subject', key: 'subject', ellipsis: true },
    { title: '发送时间', dataIndex: 'sentAt', key: 'sentAt' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const map: Record<string, { color: string; icon: React.ReactNode }> = {
          '已打开': { color: 'blue', icon: <MailOutlined /> },
          '已回复': { color: 'green', icon: <CheckCircleOutlined /> },
          '退信': { color: 'red', icon: <CloseCircleOutlined /> },
          '未打开': { color: 'default', icon: <ClockCircleOutlined /> },
        };
        const info = map[s] || { color: 'default', icon: null };
        return <Tag color={info.color} icon={info.icon}>{s}</Tag>;
      },
    },
    { title: '打开时间', dataIndex: 'openedAt', key: 'openedAt' },
    {
      title: '已回复', dataIndex: 'replied', key: 'replied',
      render: (r: boolean) => r ? <Tag color="success">是</Tag> : <Tag>否</Tag>,
    },
  ];

  /* -- 自动化序列 -- */
  const sequenceColumns = [
    { title: '序列名称', dataIndex: 'name', key: 'name', render: (t: string) => <Text strong>{t}</Text> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag>{t}</Tag> },
    { title: '邮件数', dataIndex: 'emailCount', key: 'emailCount', render: (n: number) => `${n} 封` },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: string) => {
        const map: Record<string, { color: string; icon: React.ReactNode }> = {
          '运行中': { color: 'processing', icon: <PlayCircleOutlined /> },
          '已暂停': { color: 'warning', icon: <PauseCircleOutlined /> },
          '已完成': { color: 'success', icon: <CheckCircleOutlined /> },
        };
        const info = map[s] || { color: 'default', icon: null };
        return <Tag color={info.color} icon={info.icon}>{s}</Tag>;
      },
    },
    { title: '触发数', dataIndex: 'triggerCount', key: 'triggerCount' },
    { title: '回复数', dataIndex: 'replyCount', key: 'replyCount' },
    {
      title: '回复率', key: 'replyRate',
      render: (_: unknown, record: typeof mockSequences[0]) => {
        const rate = Math.round((record.replyCount / record.triggerCount) * 100);
        return <Progress percent={rate} size="small" status={rate >= 30 ? 'success' : 'normal'} />;
      },
    },
    {
      title: '操作', key: 'action', render: (_: unknown, record: typeof mockSequences[0]) => (
        <Space>
          <Tooltip title={record.status === '运行中' ? '暂停' : '启动'}>
            <Button
              type="link"
              icon={record.status === '运行中' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              size="small"
              onClick={() => message.info(record.status === '运行中' ? '序列已暂停' : '序列已启动')}
            />
          </Tooltip>
          <Tooltip title="编辑"><Button type="link" icon={<EditOutlined />} size="small" /></Tooltip>
          <Tooltip title="查看统计"><Button type="link" icon={<BarChartOutlined />} size="small" /></Tooltip>
          <Tooltip title="删除"><Button type="link" danger icon={<DeleteOutlined />} size="small" /></Tooltip>
        </Space>
      ),
    },
  ];

  const handleSendEmail = () => {
    sendForm.validateFields().then(() => {
      message.success('邮件已加入发送队列（演示）');
      sendForm.resetFields();
    });
  };

  const handleCreateSequence = () => {
    setSequenceModalVisible(false);
    message.success('序列创建成功（演示）');
  };

  const tabItems = [
    {
      key: 'templates',
      label: <span><FileTextOutlined /> 邮件模板</span>,
      children: (
        <div>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('新建模板（演示）')}>
              新建模板
            </Button>
          </div>
          <Table columns={templateColumns} dataSource={mockTemplates} rowKey="key" pagination={false} />
        </div>
      ),
    },
    {
      key: 'send',
      label: <span><SendOutlined /> 邮件发送</span>,
      children: (
        <Row gutter={24}>
          <Col span={16}>
            <Card title="撰写邮件">
              <Form form={sendForm} layout="vertical">
                <Form.Item label="收件人" name="recipients" rules={[{ required: true, message: '请选择收件人' }]}>
                  <Select mode="multiple" placeholder="选择客户或输入邮箱地址" style={{ width: '100%' }}>
                    <Option value="hans@berlin-trading.de">Hans Mueller - Berlin Trading GmbH</Option>
                    <Option value="y.tanaka@tokyo-elec.jp">Yuki Tanaka - Tokyo Electronics Corp.</Option>
                    <Option value="marie@paris-fashion.fr">Marie Dupont - Paris Fashion Group</Option>
                    <Option value="ahmed@dubai-construction.ae">Ahmed Al-Rashid - Dubai Construction LLC</Option>
                    <Option value="rajesh@mumbai-textiles.in">Rajesh Patel - Mumbai Textiles Pvt.</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="主题行" name="subject" rules={[{ required: true, message: '请输入主题行' }]}>
                  <Input placeholder="输入邮件主题..." />
                </Form.Item>
                <Form.Item label="选择模板" name="template">
                  <Select placeholder="选择邮件模板（可选）" allowClear>
                    <Option value="1">首次联系 - 英文</Option>
                    <Option value="2">产品报价 - 英文</Option>
                    <Option value="3">展会邀请 - 中文</Option>
                    <Option value="5">样品确认 - 英文</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="邮件正文">
                  <TextArea rows={8} placeholder="输入邮件正文，或选择模板后编辑..." />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" icon={<SendOutlined />} onClick={handleSendEmail}>
                      立即发送
                    </Button>
                    <Button>保存草稿</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="变量替换提示" size="small">
              <div style={{ lineHeight: 2.2 }}>
                <div><Tag color="blue">{`{{company_name}}`}</Tag> - 收件人公司名</div>
                <div><Tag color="blue">{`{{contact_name}}`}</Tag> - 收件人姓名</div>
                <div><Tag color="blue">{`{{country}}`}</Tag> - 收件人国家</div>
                <div><Tag color="blue">{`{{product_name}}`}</Tag> - 产品名称</div>
                <div><Tag color="blue">{`{{price}}`}</Tag> - 报价金额</div>
                <div><Tag color="blue">{`{{sender_name}}`}</Tag> - 发件人姓名</div>
                <div><Tag color="blue">{`{{sender_company}}`}</Tag> - 发件人公司</div>
              </div>
              <Divider />
              <Text type="secondary" style={{ fontSize: 12 }}>
                使用模板发送时，系统会自动替换上述变量为对应客户的实际信息。
              </Text>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: 'tracking',
      label: <span><BarChartOutlined /> 发送追踪</span>,
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card size="small">
                <Statistic title="总发送数" value={156} prefix={<SendOutlined />} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic title="打开率" value={68.5} suffix="%" prefix={<EyeOutlined />} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic title="回复率" value={24.3} suffix="%" prefix={<CheckCircleOutlined />} valueStyle={{ color: '#722ed1' }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic title="退信率" value={3.2} suffix="%" prefix={<ExclamationCircleOutlined />} valueStyle={{ color: '#ff4d4f' }} />
              </Card>
            </Col>
          </Row>
          <Table columns={trackingColumns} dataSource={mockTracking} rowKey="key" />
        </div>
      ),
    },
    {
      key: 'sequences',
      label: <span><RobotOutlined /> 自动化序列</span>,
      children: (
        <div>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setSequenceModalVisible(true)}>
              新建序列
            </Button>
          </div>
          <Table columns={sequenceColumns} dataSource={mockSequences} rowKey="key" pagination={false} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        <MailOutlined /> 邮件中心
      </Title>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* 新建序列弹窗 */}
      <Modal
        title="新建自动化序列"
        open={sequenceModalVisible}
        onOk={handleCreateSequence}
        onCancel={() => setSequenceModalVisible(false)}
        okText="创建"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="序列名称" rules={[{ required: true, message: '请输入序列名称' }]}>
            <Input placeholder="例如：新线索开发序列" />
          </Form.Item>
          <Form.Item label="序列类型">
            <Select placeholder="选择序列类型">
              <Option value="首次联系">首次联系</Option>
              <Option value="报价跟进">报价跟进</Option>
              <Option value="活动跟进">活动跟进</Option>
              <Option value="样品跟进">样品跟进</Option>
              <Option value="节日问候">节日问候</Option>
            </Select>
          </Form.Item>
          <Form.Item label="邮件数量">
            <Input type="number" placeholder="序列中的邮件数量" defaultValue={3} />
          </Form.Item>
          <Form.Item label="触发条件">
            <Select placeholder="选择触发条件">
              <Option value="新线索">新线索加入时</Option>
              <Option value="阶段变更">客户阶段变更时</Option>
              <Option value="手动触发">手动触发</Option>
            </Select>
          </Form.Item>
          <Form.Item label="间隔设置">
            <Input placeholder="例如：第1封立即发送，第2封3天后，第3封7天后" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmailCenter;
