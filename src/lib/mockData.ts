import type { Customer, FollowUp, EmailTemplate, EmailCampaign, EmailSequence, Task } from './supabase'

// ============ 模拟客户数据 ============

export const mockCustomers: Customer[] = [
  {
    id: '1', user_id: 'mock-user', company_name: 'Berlin Trading GmbH', country: '德国', industry: '电子元器件',
    contact_person: 'Hans Mueller', email: 'hans@berlin-trading.de', phone: '+49-30-1234567',
    website: '', stage: 'negotiating', priority: 'A', source: 'LinkedIn',
    notes: '对LED驱动器系列有浓厚兴趣，已发送第二轮报价',
    created_at: '2026-05-02T00:00:00Z', updated_at: '2026-06-05T00:00:00Z',
  },
  {
    id: '2', user_id: 'mock-user', company_name: 'Tokyo Electronics Corp.', country: '日本', industry: '消费电子',
    contact_person: 'Yuki Tanaka', email: 'y.tanaka@tokyo-elec.jp', phone: '+81-3-9876543',
    website: '', stage: 'quoted', priority: 'A', source: 'Google Maps',
    notes: '需要大批量蓝牙耳机，等待最终确认',
    created_at: '2026-04-28T00:00:00Z', updated_at: '2026-06-03T00:00:00Z',
  },
  {
    id: '3', user_id: 'mock-user', company_name: 'Paris Fashion Group', country: '法国', industry: '纺织服装',
    contact_person: 'Marie Dupont', email: 'marie@paris-fashion.fr', phone: '+33-1-4567890',
    website: '', stage: 'interested', priority: 'B', source: '展会',
    notes: '对2027春夏面料系列感兴趣，已寄送样品',
    created_at: '2026-04-20T00:00:00Z', updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '4', user_id: 'mock-user', company_name: 'Sydney Mining Solutions', country: '澳大利亚', industry: '矿业设备',
    contact_person: 'James Wilson', email: 'j.wilson@sydney-mining.com.au', phone: '+61-2-3456789',
    website: '', stage: 'lead', priority: 'C', source: 'LinkedIn',
    notes: '通过LinkedIn获取，需要进一步了解需求',
    created_at: '2026-05-10T00:00:00Z', updated_at: '2026-05-28T00:00:00Z',
  },
  {
    id: '5', user_id: 'mock-user', company_name: 'Dubai Construction LLC', country: '阿联酋', industry: '建筑材料',
    contact_person: 'Ahmed Al-Rashid', email: 'ahmed@dubai-construction.ae', phone: '+971-4-5678901',
    website: '', stage: 'closed', priority: 'A', source: '海关数据',
    notes: '首批瓷砖订单已签订，金额$120,000',
    created_at: '2026-03-15T00:00:00Z', updated_at: '2026-06-04T00:00:00Z',
  },
  {
    id: '6', user_id: 'mock-user', company_name: 'Seoul Semiconductor Ltd.', country: '韩国', industry: '半导体',
    contact_person: 'Park Ji-hoon', email: 'jhpark@seoul-semi.co.kr', phone: '+82-2-6789012',
    website: '', stage: 'quoted', priority: 'A', source: '企业图谱',
    notes: '芯片封装材料报价已发送，等待反馈',
    created_at: '2026-04-25T00:00:00Z', updated_at: '2026-06-02T00:00:00Z',
  },
  {
    id: '7', user_id: 'mock-user', company_name: 'London Pharma Ltd.', country: '英国', industry: '医药化工',
    contact_person: 'Emily Thompson', email: 'e.thompson@london-pharma.co.uk', phone: '+44-20-7890123',
    website: '', stage: 'interested', priority: 'B', source: 'Google Maps',
    notes: '对药用辅料感兴趣，已安排下周视频会议',
    created_at: '2026-05-05T00:00:00Z', updated_at: '2026-05-30T00:00:00Z',
  },
  {
    id: '8', user_id: 'mock-user', company_name: 'Sao Paulo Import S.A.', country: '巴西', industry: '日用百货',
    contact_person: 'Carlos Silva', email: 'carlos@sp-import.com.br', phone: '+55-11-8901234',
    website: '', stage: 'lead', priority: 'C', source: '展会',
    notes: '广交会上认识，对家居用品有兴趣',
    created_at: '2026-05-12T00:00:00Z', updated_at: '2026-05-25T00:00:00Z',
  },
  {
    id: '9', user_id: 'mock-user', company_name: 'Mumbai Textiles Pvt.', country: '印度', industry: '纺织服装',
    contact_person: 'Rajesh Patel', email: 'rajesh@mumbai-textiles.in', phone: '+91-22-9012345',
    website: '', stage: 'negotiating', priority: 'A', source: '海关数据',
    notes: '价格谈判中，对方要求再降5%',
    created_at: '2026-04-10T00:00:00Z', updated_at: '2026-06-06T00:00:00Z',
  },
  {
    id: '10', user_id: 'mock-user', company_name: 'Toronto Tech Inc.', country: '加拿大', industry: '电子元器件',
    contact_person: 'Michael Brown', email: 'm.brown@toronto-tech.ca', phone: '+1-416-0123456',
    website: '', stage: 'closed', priority: 'B', source: 'LinkedIn',
    notes: '传感器模块订单完成交付，客户满意度良好',
    created_at: '2026-03-01T00:00:00Z', updated_at: '2026-05-20T00:00:00Z',
  },
]

// ============ 模拟跟进记录 ============

export const mockFollowUps: FollowUp[] = [
  {
    id: 'f1', customer_id: '1', user_id: 'mock-user', type: 'email',
    content: '发送第二轮报价单，LED驱动器单价调整为$2.8/个',
    next_follow_up: '2026-06-12', created_at: '2026-06-05T10:00:00Z',
  },
  {
    id: 'f2', customer_id: '1', user_id: 'mock-user', type: 'meeting',
    content: '视频会议，讨论技术参数和交期要求',
    next_follow_up: '2026-06-01', created_at: '2026-05-28T14:00:00Z',
  },
  {
    id: 'f3', customer_id: '1', user_id: 'mock-user', type: 'note',
    content: '寄送样品，DHL运单号：1234567890',
    next_follow_up: null, created_at: '2026-05-15T09:00:00Z',
  },
  {
    id: 'f4', customer_id: '1', user_id: 'mock-user', type: 'email',
    content: '初次联系，发送公司产品目录',
    next_follow_up: '2026-05-10', created_at: '2026-05-02T08:00:00Z',
  },
  {
    id: 'f5', customer_id: '2', user_id: 'mock-user', type: 'email',
    content: '发送蓝牙耳机批量报价单',
    next_follow_up: '2026-06-10', created_at: '2026-06-03T09:15:00Z',
  },
  {
    id: 'f6', customer_id: '3', user_id: 'mock-user', type: 'note',
    content: '寄送2027春夏面料样品',
    next_follow_up: '2026-06-08', created_at: '2026-06-01T14:00:00Z',
  },
  {
    id: 'f7', customer_id: '5', user_id: 'mock-user', type: 'email',
    content: '瓷砖订单确认函已发送',
    next_follow_up: null, created_at: '2026-05-25T11:20:00Z',
  },
  {
    id: 'f8', customer_id: '9', user_id: 'mock-user', type: 'phone',
    content: '电话沟通价格，对方要求再降5%',
    next_follow_up: '2026-06-07', created_at: '2026-06-06T10:00:00Z',
  },
]

// ============ 模拟邮件模板 ============

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1', user_id: 'mock-user', name: '首次联系 - 英文', type: 'development', language: '英文',
    subject: 'Introduction to Our Products', body: 'Dear {{contact_name}},\n\nWe are {{sender_company}}...',
    variables: 'contact_name,sender_company,product_name', created_at: '2026-05-20T00:00:00Z', updated_at: '2026-05-20T00:00:00Z',
  },
  {
    id: '2', user_id: 'mock-user', name: '产品报价 - 英文', type: 'quote', language: '英文',
    subject: 'Quotation for {{product_name}}', body: 'Dear {{contact_name}},\n\nPlease find attached...',
    variables: 'contact_name,product_name,price', created_at: '2026-05-18T00:00:00Z', updated_at: '2026-05-18T00:00:00Z',
  },
  {
    id: '3', user_id: 'mock-user', name: '展会邀请 - 中文', type: 'holiday', language: '中文',
    subject: '诚邀参加2026年广交会', body: '尊敬的{{contact_name}}，\n\n诚挚邀请您参加...',
    variables: 'contact_name,company_name', created_at: '2026-05-15T00:00:00Z', updated_at: '2026-05-15T00:00:00Z',
  },
  {
    id: '4', user_id: 'mock-user', name: '节日问候 - 多语言', type: 'holiday', language: '英文/中文/西班牙文',
    subject: 'Happy Holidays from {{sender_company}}', body: 'Dear {{contact_name}},\n\nWishing you...',
    variables: 'contact_name,sender_company,sender_name', created_at: '2026-05-10T00:00:00Z', updated_at: '2026-05-10T00:00:00Z',
  },
  {
    id: '5', user_id: 'mock-user', name: '样品确认 - 英文', type: 'follow_up', language: '英文',
    subject: 'Sample Confirmation - {{product_name}}', body: 'Dear {{contact_name}},\n\nWe have sent...',
    variables: 'contact_name,product_name', created_at: '2026-05-08T00:00:00Z', updated_at: '2026-05-08T00:00:00Z',
  },
  {
    id: '6', user_id: 'mock-user', name: '催促回复 - 英文', type: 'follow_up', language: '英文',
    subject: 'Following Up on Our Previous Email', body: 'Dear {{contact_name}},\n\nI hope this email...',
    variables: 'contact_name,product_name', created_at: '2026-04-28T00:00:00Z', updated_at: '2026-04-28T00:00:00Z',
  },
]

// ============ 模拟邮件活动 ============

export const mockEmailCampaigns: EmailCampaign[] = [
  {
    id: '1', user_id: 'mock-user', name: 'LED驱动器推广活动', template_id: '2', status: 'completed',
    total_sent: 45, open_rate: 72.5, reply_rate: 18.2, bounce_rate: 2.1, created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '2', user_id: 'mock-user', name: '蓝牙耳机批量报价', template_id: '2', status: 'sending',
    total_sent: 32, open_rate: 68.8, reply_rate: 24.3, bounce_rate: 3.1, created_at: '2026-06-03T00:00:00Z',
  },
  {
    id: '3', user_id: 'mock-user', name: '面料系列推广', template_id: '1', status: 'draft',
    total_sent: 0, open_rate: 0, reply_rate: 0, bounce_rate: 0, created_at: '2026-06-05T00:00:00Z',
  },
  {
    id: '4', user_id: 'mock-user', name: '节日问候活动', template_id: '4', status: 'completed',
    total_sent: 156, open_rate: 68.5, reply_rate: 12.4, bounce_rate: 3.2, created_at: '2026-05-25T00:00:00Z',
  },
  {
    id: '5', user_id: 'mock-user', name: '样品确认跟进', template_id: '5', status: 'paused',
    total_sent: 20, open_rate: 65.0, reply_rate: 30.0, bounce_rate: 1.5, created_at: '2026-05-20T00:00:00Z',
  },
]

// ============ 模拟邮件追踪数据 ============

export const mockTracking = [
  { key: '1', recipient: 'Hans Mueller', company: 'Berlin Trading GmbH', subject: 'LED驱动器报价更新', sentAt: '2026-06-05 10:30', status: '已打开', openedAt: '2026-06-05 15:22', replied: false },
  { key: '2', recipient: 'Yuki Tanaka', company: 'Tokyo Electronics Corp.', subject: '蓝牙耳机批量报价', sentAt: '2026-06-03 09:15', status: '已回复', openedAt: '2026-06-03 11:40', replied: true },
  { key: '3', recipient: 'Marie Dupont', company: 'Paris Fashion Group', subject: '2027春夏面料系列', sentAt: '2026-06-01 14:00', status: '已打开', openedAt: '2026-06-02 08:30', replied: false },
  { key: '4', recipient: 'James Wilson', company: 'Sydney Mining Solutions', subject: '矿业设备产品目录', sentAt: '2026-05-28 16:45', status: '退信', openedAt: '-', replied: false },
  { key: '5', recipient: 'Ahmed Al-Rashid', company: 'Dubai Construction LLC', subject: '瓷砖订单确认函', sentAt: '2026-05-25 11:20', status: '已回复', openedAt: '2026-05-25 14:10', replied: true },
  { key: '6', recipient: 'Emily Thompson', company: 'London Pharma Ltd.', subject: '药用辅料产品介绍', sentAt: '2026-05-20 08:50', status: '未打开', openedAt: '-', replied: false },
  { key: '7', recipient: 'Carlos Silva', company: 'Sao Paulo Import S.A.', subject: '家居用品报价单', sentAt: '2026-05-18 13:30', status: '已打开', openedAt: '2026-05-19 10:15', replied: false },
]

// ============ 模拟自动化序列 ============

export const mockEmailSequences: EmailSequence[] = [
  {
    id: '1', user_id: 'mock-user', name: '新线索开发序列', type: 'new_customer',
    email_count: 5, interval_days: 3, status: 'active', created_at: '2026-05-01T00:00:00Z',
  },
  {
    id: '2', user_id: 'mock-user', name: '展会跟进序列', type: 'custom',
    email_count: 3, interval_days: 5, status: 'active', created_at: '2026-05-10T00:00:00Z',
  },
  {
    id: '3', user_id: 'mock-user', name: '报价催促序列', type: 'quote',
    email_count: 4, interval_days: 2, status: 'paused', created_at: '2026-04-20T00:00:00Z',
  },
  {
    id: '4', user_id: 'mock-user', name: '样品确认序列', type: 'inquiry',
    email_count: 3, interval_days: 4, status: 'active', created_at: '2026-05-15T00:00:00Z',
  },
  {
    id: '5', user_id: 'mock-user', name: '节日祝福序列', type: 'custom',
    email_count: 1, interval_days: 0, status: 'completed', created_at: '2026-04-28T00:00:00Z',
  },
]

// ============ 模拟任务数据 ============

export const mockTasks: Task[] = [
  {
    id: '1', user_id: 'mock-user', title: '发送LED驱动器报价单', customer_id: '1',
    customer_name: 'Berlin Trading GmbH', priority: 'high', due_date: '2026-06-07',
    status: 'pending', notes: '根据上次谈判结果，更新报价并发送给Hans Mueller', created_at: '2026-06-05T00:00:00Z',
  },
  {
    id: '2', user_id: 'mock-user', title: '安排与Marie Dupont视频会议', customer_id: '3',
    customer_name: 'Paris Fashion Group', priority: 'high', due_date: '2026-06-08',
    status: 'pending', notes: '讨论2027春夏面料系列的详细需求', created_at: '2026-06-04T00:00:00Z',
  },
  {
    id: '3', user_id: 'mock-user', title: '寄送蓝牙耳机样品', customer_id: '2',
    customer_name: 'Tokyo Electronics Corp.', priority: 'high', due_date: '2026-06-10',
    status: 'pending', notes: '确认Yuki Tanaka的收货地址后安排DHL快递', created_at: '2026-06-03T00:00:00Z',
  },
  {
    id: '4', user_id: 'mock-user', title: '更新Dubai Construction订单状态', customer_id: '5',
    customer_name: 'Dubai Construction LLC', priority: 'medium', due_date: '2026-06-09',
    status: 'pending', notes: '跟进首批瓷砖订单的生产进度', created_at: '2026-06-02T00:00:00Z',
  },
  {
    id: '5', user_id: 'mock-user', title: '回复London Pharma技术咨询', customer_id: '7',
    customer_name: 'London Pharma Ltd.', priority: 'medium', due_date: '2026-06-06',
    status: 'completed', notes: '回复关于药用辅料技术规格的邮件', created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '6', user_id: 'mock-user', title: '整理广交会客户名片', customer_id: '8',
    customer_name: 'Sao Paulo Import S.A.', priority: 'low', due_date: '2026-06-12',
    status: 'pending', notes: '将广交会上收集的名片信息录入CRM系统', created_at: '2026-05-28T00:00:00Z',
  },
  {
    id: '7', user_id: 'mock-user', title: '准备芯片封装材料技术文档', customer_id: '6',
    customer_name: 'Seoul Semiconductor Ltd.', priority: 'high', due_date: '2026-06-06',
    status: 'completed', notes: '整理技术规格书和测试报告发送给Park Ji-hoon', created_at: '2026-05-30T00:00:00Z',
  },
  {
    id: '8', user_id: 'mock-user', title: '跟进Sydney Mining需求确认', customer_id: '4',
    customer_name: 'Sydney Mining Solutions', priority: 'medium', due_date: '2026-06-15',
    status: 'pending', notes: '电话联系James Wilson确认矿业设备具体需求', created_at: '2026-05-25T00:00:00Z',
  },
  {
    id: '9', user_id: 'mock-user', title: '准备季度销售报告', customer_id: null,
    customer_name: '-', priority: 'low', due_date: '2026-06-20',
    status: 'pending', notes: '汇总Q2客户开发、邮件营销、订单数据', created_at: '2026-05-20T00:00:00Z',
  },
  {
    id: '10', user_id: 'mock-user', title: '与Mumbai Textiles价格谈判', customer_id: '9',
    customer_name: 'Mumbai Textiles Pvt.', priority: 'high', due_date: '2026-06-07',
    status: 'pending', notes: '准备价格让步方案，目标降价3%以内', created_at: '2026-06-06T00:00:00Z',
  },
]

// ============ Dashboard 模拟数据 ============

export const mockTrendData = [
  { month: '1月', customers: 45, emails: 320, replies: 28 },
  { month: '2月', customers: 52, emails: 380, replies: 35 },
  { month: '3月', customers: 48, emails: 350, replies: 32 },
  { month: '4月', customers: 65, emails: 420, replies: 45 },
  { month: '5月', customers: 72, emails: 480, replies: 52 },
  { month: '6月', customers: 85, emails: 550, replies: 68 },
]

export const mockSourceData = [
  { name: '海关数据', value: 35, color: '#1890ff' },
  { name: 'LinkedIn', value: 25, color: '#52c41a' },
  { name: 'Google Maps', value: 20, color: '#faad14' },
  { name: '企业图谱', value: 15, color: '#f5222d' },
  { name: '其他', value: 5, color: '#722ed1' },
]

export const mockStageData = [
  { stage: '线索', count: 156, target: 200 },
  { stage: '初步接触', count: 89, target: 120 },
  { stage: '需求确认', count: 45, target: 60 },
  { stage: '方案报价', count: 28, target: 40 },
  { stage: '谈判', count: 15, target: 20 },
  { stage: '成交', count: 8, target: 15 },
]
