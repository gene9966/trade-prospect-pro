import React, { useState } from 'react';
import {
  Card, Row, Col, Typography, Select, Statistic, Space
} from 'antd';
import {
  UserOutlined, TeamOutlined, PlusCircleOutlined, PercentageOutlined,
  RiseOutlined, GlobalOutlined, BarChartOutlined, FunnelPlotOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

const { Title, Text } = Typography;

/* ========== 模拟数据 ========== */

const customerGrowthData = [
  { month: '1月', 新增客户: 12, 累计客户: 45 },
  { month: '2月', 新增客户: 18, 累计客户: 63 },
  { month: '3月', 新增客户: 15, 累计客户: 78 },
  { month: '4月', 新增客户: 22, 累计客户: 100 },
  { month: '5月', 新增客户: 28, 累计客户: 128 },
  { month: '6月', 新增客户: 20, 累计客户: 148 },
];

const countryDistributionData = [
  { name: '德国', value: 18, color: '#1890ff' },
  { name: '日本', value: 14, color: '#52c41a' },
  { name: '法国', value: 12, color: '#faad14' },
  { name: '澳大利亚', value: 10, color: '#ff4d4f' },
  { name: '阿联酋', value: 9, color: '#722ed1' },
  { name: '韩国', value: 8, color: '#13c2c2' },
  { name: '英国', value: 8, color: '#eb2f96' },
  { name: '巴西', value: 7, color: '#fa8c16' },
  { name: '印度', value: 8, color: '#2f54eb' },
  { name: '加拿大', value: 6, color: '#a0d911' },
];

const industryDistributionData = [
  { industry: '电子元器件', count: 28 },
  { industry: '消费电子', count: 22 },
  { industry: '纺织服装', count: 18 },
  { industry: '矿业设备', count: 15 },
  { industry: '建筑材料', count: 14 },
  { industry: '半导体', count: 12 },
  { industry: '医药化工', count: 11 },
  { industry: '日用百货', count: 10 },
  { industry: '机械设备', count: 10 },
  { industry: '汽车配件', count: 8 },
];

const emailFunnelData = [
  { stage: '发送', value: 1560, rate: '100%' },
  { stage: '打开', value: 1068, rate: '68.5%' },
  { stage: '点击', value: 530, rate: '34.0%' },
  { stage: '回复', value: 379, rate: '24.3%' },
  { stage: '成交', value: 85, rate: '5.4%' },
];

const funnelColors = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#ff4d4f'];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const statsCards = [
    { title: '总客户数', value: 148, icon: <UserOutlined />, color: '#1890ff', suffix: '家' },
    { title: '活跃客户', value: 86, icon: <TeamOutlined />, color: '#52c41a', suffix: '家' },
    { title: '本月新增', value: 20, icon: <PlusCircleOutlined />, color: '#faad14', suffix: '家' },
    { title: '转化率', value: 18.2, icon: <PercentageOutlined />, color: '#722ed1', suffix: '%' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          <BarChartOutlined /> 数据分析
        </Title>
        <Space>
          <CalendarOutlined style={{ color: '#999' }} />
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 140 }}>
            <Select.Option value="7days">最近7天</Select.Option>
            <Select.Option value="30days">最近30天</Select.Option>
            <Select.Option value="3months">最近3个月</Select.Option>
            <Select.Option value="6months">最近6个月</Select.Option>
            <Select.Option value="1year">最近1年</Select.Option>
          </Select>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statsCards.map((item) => (
          <Col span={6} key={item.title}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={<span style={{ color: item.color, marginRight: 8 }}>{item.icon}</span>}
                suffix={item.suffix}
                valueStyle={{ color: item.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 第一行图表：客户增长 + 国家分布 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={14}>
          <Card title={<span><RiseOutlined /> 客户增长趋势</span>}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="新增客户" stroke="#1890ff" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="累计客户" stroke="#52c41a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={10}>
          <Card title={<span><GlobalOutlined /> 客户国家分布</span>}>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={countryDistributionData}
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={{ strokeWidth: 1 }}
                >
                  {countryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} 家`, '客户数']} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 第二行图表：行业分布 + 邮件漏斗 */}
      <Row gutter={16}>
        <Col span={14}>
          <Card title={<span><BarChartOutlined /> 行业分布</span>}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={industryDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="industry" width={80} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value} 家`, '客户数']} />
                <Bar dataKey="count" fill="#1890ff" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={10}>
          <Card title={<span><FunnelPlotOutlined /> 邮件效果漏斗</span>}>
            <div style={{ padding: '20px 0' }}>
              {emailFunnelData.map((item, index) => {
                const maxVal = emailFunnelData[0].value;
                const widthPercent = (item.value / maxVal) * 100;
                return (
                  <div key={item.stage} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text strong>{item.stage}</Text>
                      <Text>
                        {item.value} ({item.rate})
                      </Text>
                    </div>
                    <div
                      style={{
                        width: `${widthPercent}%`,
                        height: 36,
                        backgroundColor: funnelColors[index],
                        borderRadius: 4,
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 14,
                        transition: 'width 0.3s',
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text type="secondary">
                发送 → 打开 → 点击 → 回复 → 成交
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
