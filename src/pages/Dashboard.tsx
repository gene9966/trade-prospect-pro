import type { FC } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  List,
  Avatar,
  Typography,
  Space,
} from 'antd'
import {
  UserAddOutlined,
  MailOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const { Text } = Typography

// 模拟数据
const trendData = [
  { month: '1月', customers: 45, emails: 320, replies: 28 },
  { month: '2月', customers: 52, emails: 380, replies: 35 },
  { month: '3月', customers: 48, emails: 350, replies: 32 },
  { month: '4月', customers: 65, emails: 420, replies: 45 },
  { month: '5月', customers: 72, emails: 480, replies: 52 },
  { month: '6月', customers: 85, emails: 550, replies: 68 },
]

const sourceData = [
  { name: '海关数据', value: 35, color: '#1890ff' },
  { name: 'LinkedIn', value: 25, color: '#52c41a' },
  { name: 'Google Maps', value: 20, color: '#faad14' },
  { name: '企业图谱', value: 15, color: '#f5222d' },
  { name: '其他', value: 5, color: '#722ed1' },
]

const recentCustomers = [
  { key: '1', name: 'ABC Trading Co.', country: '美国', industry: '电子产品', stage: '意向', date: '2026-06-05' },
  { key: '2', name: 'Global Import Ltd.', country: '英国', industry: '家居用品', stage: '报价', date: '2026-06-04' },
  { key: '3', name: 'Sunrise GmbH', country: '德国', industry: '机械设备', stage: '线索', date: '2026-06-03' },
  { key: '4', name: 'Pacific Corp', country: '澳大利亚', industry: '服装纺织', stage: '成交', date: '2026-06-02' },
  { key: '5', name: 'EuroTrade SA', country: '法国', industry: '化工产品', stage: '谈判', date: '2026-06-01' },
]

const todoList = [
  { title: '跟进 ABC Trading Co. 的报价反馈', priority: 'high', time: '今天 14:00' },
  { title: '发送开发信给新挖掘的50个客户', priority: 'high', time: '今天 16:00' },
  { title: '准备 Global Import Ltd. 的产品样品', priority: 'medium', time: '明天 10:00' },
  { title: '更新 Sunrise GmbH 的跟进记录', priority: 'medium', time: '明天 15:00' },
  { title: '参加线上展会准备会议', priority: 'low', time: '后天 09:00' },
]

const stageData = [
  { stage: '线索', count: 156, target: 200 },
  { stage: '初步接触', count: 89, target: 120 },
  { stage: '需求确认', count: 45, target: 60 },
  { stage: '方案报价', count: 28, target: 40 },
  { stage: '谈判', count: 15, target: 20 },
  { stage: '成交', count: 8, target: 15 },
]

const columns = [
  { title: '客户名称', dataIndex: 'name', key: 'name' },
  { title: '国家', dataIndex: 'country', key: 'country' },
  { title: '行业', dataIndex: 'industry', key: 'industry' },
  {
    title: '阶段',
    dataIndex: 'stage',
    key: 'stage',
    render: (stage: string) => {
      const colorMap: Record<string, string> = {
        线索: 'default',
        意向: 'processing',
        报价: 'warning',
        谈判: 'purple',
        成交: 'success',
      }
      return <Tag color={colorMap[stage] || 'default'}>{stage}</Tag>
    },
  },
  { title: '添加日期', dataIndex: 'date', key: 'date' },
]

const Dashboard: FC = () => {
  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月新增客户"
              value={85}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={<RiseOutlined style={{ color: '#52c41a', fontSize: 14 }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>较上月增长 18.5%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月发送邮件"
              value={550}
              prefix={<MailOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={<RiseOutlined style={{ color: '#52c41a', fontSize: 14 }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>较上月增长 14.6%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="客户回复率"
              value={12.4}
              prefix={<TeamOutlined />}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>较上月下降 2.1%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="预计成交金额"
              value={128500}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix={<RiseOutlined style={{ color: '#52c41a', fontSize: 14 }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>较上月增长 25.3%</Text>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="业绩趋势" extra={<Text type="secondary">最近6个月</Text>}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="customers" stackId="1" stroke="#1890ff" fill="#1890ff" fillOpacity={0.6} name="新增客户" />
                <Area type="monotone" dataKey="emails" stackId="1" stroke="#52c41a" fill="#52c41a" fillOpacity={0.6} name="发送邮件" />
                <Area type="monotone" dataKey="replies" stackId="1" stroke="#faad14" fill="#faad14" fillOpacity={0.6} name="客户回复" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="客户来源分布">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 销售漏斗 + 待办事项 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="销售漏斗">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {stageData.map((item) => (
                <div key={item.stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{item.stage}</Text>
                    <Text type="secondary">{item.count} / {item.target}</Text>
                  </div>
                  <Progress
                    percent={Math.round((item.count / item.target) * 100)}
                    size="small"
                    status={item.count >= item.target ? 'success' : 'active'}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="待办事项" extra={<a href="/tasks">查看全部</a>}>
            <List
              dataSource={todoList}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor:
                            item.priority === 'high'
                              ? '#f5222d'
                              : item.priority === 'medium'
                              ? '#faad14'
                              : '#52c41a',
                        }}
                        size="small"
                      >
                        {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                      </Avatar>
                    }
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近客户 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="最近添加的客户" extra={<a href="/customers">查看全部</a>}>
            <Table
              dataSource={recentCustomers}
              columns={columns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
