import { useState } from 'react'
import {
  Card,
  Tabs,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
  message,
} from 'antd'
import {
  SearchOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  EnvironmentOutlined,
  DatabaseOutlined,
  StarOutlined,
  PlusOutlined,
  DownloadOutlined,
  MailOutlined,
} from '@ant-design/icons'

const { Text } = Typography
const { Option } = Select

// 模拟海关数据
const customsData = [
  { key: '1', company: 'ABC Trading Co.', country: '美国', product: 'LED灯具', hsCode: '9405.42', amount: '$125,000', date: '2026-05-28', times: 12 },
  { key: '2', company: 'Global Import Ltd.', country: '英国', product: '陶瓷餐具', hsCode: '6911.10', amount: '$89,500', date: '2026-05-25', times: 8 },
  { key: '3', company: 'Sunrise GmbH', country: '德国', product: '电动工具', hsCode: '8467.21', amount: '$234,000', date: '2026-05-20', times: 15 },
  { key: '4', company: 'Pacific Corp', country: '澳大利亚', product: '服装面料', hsCode: '5208.52', amount: '$67,800', date: '2026-05-18', times: 6 },
  { key: '5', company: 'EuroTrade SA', country: '法国', product: '化工原料', hsCode: '2915.39', amount: '$456,000', date: '2026-05-15', times: 22 },
  { key: '6', company: 'Nordic Import AB', country: '瑞典', product: '家具配件', hsCode: '9403.60', amount: '$98,200', date: '2026-05-12', times: 9 },
  { key: '7', company: 'Asia Pacific Ltd.', country: '日本', product: '电子元件', hsCode: '8542.31', amount: '$178,500', date: '2026-05-10', times: 11 },
  { key: '8', company: 'Dubai Trading LLC', country: '阿联酋', product: '建筑材料', hsCode: '6907.21', amount: '$312,000', date: '2026-05-08', times: 18 },
]

// 模拟企业数据
const companyData = [
  { key: '1', company: 'TechVision Inc.', country: '美国', industry: '电子科技', size: '200-500人', type: '进口商', website: 'www.techvision.com', kp: 'John Smith (采购总监)', email: 'john@techvision.com' },
  { key: '2', company: 'Royal Home Ltd.', country: '英国', industry: '家居用品', size: '50-200人', type: '分销商', website: 'www.royalhome.co.uk', kp: 'Emma Wilson (采购经理)', email: 'emma@royalhome.co.uk' },
  { key: '3', company: 'Deutsche Maschinen', country: '德国', industry: '机械设备', size: '500-1000人', type: '制造商', website: 'www.dm-gmbh.de', kp: 'Hans Mueller (CEO)', email: 'hans@dm-gmbh.de' },
  { key: '4', company: 'Southern Cross Trading', country: '澳大利亚', industry: '综合贸易', size: '100-200人', type: '贸易商', website: 'www.sct.com.au', kp: 'Mike Brown (总经理)', email: 'mike@sct.com.au' },
  { key: '5', company: 'Le Commerce Francais', country: '法国', industry: '化工产品', size: '200-500人', type: '进口商', website: 'www.lcf.fr', kp: 'Pierre Dupont (采购总监)', email: 'pierre@lcf.fr' },
]

// 模拟LinkedIn数据
const linkedinData = [
  { key: '1', name: 'Sarah Johnson', title: 'Procurement Director', company: 'TechVision Inc.', country: '美国', industry: '电子科技', linkedin: 'linkedin.com/in/sarah-j' },
  { key: '2', name: 'James Wilson', title: 'Sourcing Manager', company: 'Royal Home Ltd.', country: '英国', industry: '家居用品', linkedin: 'linkedin.com/in/james-w' },
  { key: '3', name: 'Anna Schmidt', title: 'VP of Supply Chain', company: 'Deutsche Maschinen', country: '德国', industry: '机械设备', linkedin: 'linkedin.com/in/anna-s' },
  { key: '4', name: 'David Lee', title: 'Purchasing Manager', company: 'Samsung Electronics', country: '韩国', industry: '电子科技', linkedin: 'linkedin.com/in/david-l' },
  { key: '5', name: 'Maria Garcia', title: 'Category Manager', company: 'Iberia Trade SA', country: '西班牙', industry: '食品饮料', linkedin: 'linkedin.com/in/maria-g' },
]

// 模拟Google Maps数据
const mapsData = [
  { key: '1', company: 'Euro Wholesale Center', country: '荷兰', city: '阿姆斯特丹', address: 'Keizersgracht 123', phone: '+31 20 123 4567', rating: 4.5, type: '批发商' },
  { key: '2', company: 'Asia Market Hub', country: '美国', city: '洛杉矶', address: '123 Main St, LA', phone: '+1 213 456 7890', rating: 4.2, type: '零售商' },
  { key: '3', company: 'Middle East Trading Co.', country: '阿联酋', city: '迪拜', address: 'Deira, Dubai', phone: '+971 4 567 8901', rating: 4.8, type: '贸易商' },
  { key: '4', company: 'Africa Import Solutions', country: '南非', city: '约翰内斯堡', address: 'Sandton, Johannesburg', phone: '+27 11 234 5678', rating: 4.0, type: '进口商' },
]

function FindCustomers() {
  const [activeTab, setActiveTab] = useState('customs')
  const [searchLoading, setSearchLoading] = useState(false)

  const handleSearch = () => {
    setSearchLoading(true)
    setTimeout(() => {
      setSearchLoading(false)
      message.success('搜索完成，共找到 156 条结果')
    }, 1500)
  }

  const customsColumns = [
    { title: '采购商', dataIndex: 'company', key: 'company' },
    { title: '国家', dataIndex: 'country', key: 'country' },
    { title: '产品', dataIndex: 'product', key: 'product' },
    { title: 'HS编码', dataIndex: 'hsCode', key: 'hsCode' },
    { title: '交易金额', dataIndex: 'amount', key: 'amount' },
    { title: '交易次数', dataIndex: 'times', key: 'times', render: (v: number) => <Badge count={v} showZero style={{ backgroundColor: '#1890ff' }} /> },
    { title: '最近交易', dataIndex: 'date', key: 'date' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="添加到客户库">
            <Button type="link" size="small" icon={<PlusOutlined />}>添加</Button>
          </Tooltip>
          <Tooltip title="发送开发信">
            <Button type="link" size="small" icon={<MailOutlined />}>发邮件</Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const companyColumns = [
    { title: '公司名称', dataIndex: 'company', key: 'company' },
    { title: '国家', dataIndex: 'country', key: 'country' },
    { title: '行业', dataIndex: 'industry', key: 'industry' },
    { title: '规模', dataIndex: 'size', key: 'size' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '关键决策人', dataIndex: 'kp', key: 'kp' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<PlusOutlined />}>添加</Button>
          <Button type="link" size="small" icon={<StarOutlined />}>收藏</Button>
        </Space>
      ),
    },
  ]

  const linkedinColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '职位', dataIndex: 'title', key: 'title' },
    { title: '公司', dataIndex: 'company', key: 'company' },
    { title: '国家', dataIndex: 'country', key: 'country' },
    { title: '行业', dataIndex: 'industry', key: 'industry' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<PlusOutlined />}>添加</Button>
          <Button type="link" size="small" icon={<MailOutlined />}>发邮件</Button>
        </Space>
      ),
    },
  ]

  const mapsColumns = [
    { title: '公司名称', dataIndex: 'company', key: 'company' },
    { title: '国家', dataIndex: 'country', key: 'country' },
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    { title: '评分', dataIndex: 'rating', key: 'rating', render: (v: number) => <Text style={{ color: '#faad14' }}>{'★'.repeat(Math.floor(v))} {v}</Text> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (v: string) => <Tag color="green">{v}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<PlusOutlined />}>添加</Button>
          <Button type="link" size="small" icon={<EnvironmentOutlined />}>地图</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'customs',
            label: (
              <span><DatabaseOutlined /> 海关数据</span>
            ),
            children: (
              <>
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Input placeholder="输入产品关键词，如：LED灯具" prefix={<SearchOutlined />} size="large" />
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="HS编码" size="large" style={{ width: '100%' }}>
                        <Option value="94">94章 - 家具</Option>
                        <Option value="85">85章 - 电子产品</Option>
                        <Option value="84">84章 - 机械</Option>
                        <Option value="69">69章 - 陶瓷</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="目标国家" size="large" style={{ width: '100%' }}>
                        <Option value="us">美国</Option>
                        <Option value="uk">英国</Option>
                        <Option value="de">德国</Option>
                        <Option value="fr">法国</Option>
                        <Option value="au">澳大利亚</Option>
                        <Option value="jp">日本</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="时间范围" size="large" style={{ width: '100%' }} defaultValue="1y">
                        <Option value="6m">最近6个月</Option>
                        <Option value="1y">最近1年</Option>
                        <Option value="2y">最近2年</Option>
                        <Option value="3y">最近3年</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Button type="primary" size="large" icon={<SearchOutlined />} loading={searchLoading} onClick={handleSearch} block>
                        搜索
                      </Button>
                    </Col>
                  </Row>
                </Card>
                <Card title="搜索结果" extra={<Button icon={<DownloadOutlined />}>导出数据</Button>}>
                  <Table
                    dataSource={customsData}
                    columns={customsColumns}
                    pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条结果` }}
                    size="small"
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'company',
            label: (
              <span><GlobalOutlined /> 企业图谱</span>
            ),
            children: (
              <>
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Input placeholder="输入公司名称或关键词" prefix={<SearchOutlined />} size="large" />
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="行业分类" size="large" style={{ width: '100%' }}>
                        <Option value="electronics">电子科技</Option>
                        <Option value="home">家居用品</Option>
                        <Option value="machinery">机械设备</Option>
                        <Option value="textile">服装纺织</Option>
                        <Option value="chemical">化工产品</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="业务类型" size="large" style={{ width: '100%' }}>
                        <Option value="importer">进口商</Option>
                        <Option value="distributor">分销商</Option>
                        <Option value="manufacturer">制造商</Option>
                        <Option value="trader">贸易商</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="公司规模" size="large" style={{ width: '100%' }}>
                        <Option value="small">1-50人</Option>
                        <Option value="medium">50-200人</Option>
                        <Option value="large">200-500人</Option>
                        <Option value="enterprise">500人以上</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Button type="primary" size="large" icon={<SearchOutlined />} block>搜索</Button>
                    </Col>
                  </Row>
                </Card>
                <Card title="搜索结果" extra={<Button icon={<DownloadOutlined />}>导出数据</Button>}>
                  <Table
                    dataSource={companyData}
                    columns={companyColumns}
                    pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条结果` }}
                    size="small"
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'linkedin',
            label: (
              <span><LinkedinOutlined /> LinkedIn挖掘</span>
            ),
            children: (
              <>
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Input placeholder="输入职位关键词，如：Procurement Manager" prefix={<SearchOutlined />} size="large" />
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="行业" size="large" style={{ width: '100%' }}>
                        <Option value="tech">电子科技</Option>
                        <Option value="home">家居用品</Option>
                        <Option value="machinery">机械设备</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="地区" size="large" style={{ width: '100%' }}>
                        <Option value="na">北美</Option>
                        <Option value="eu">欧洲</Option>
                        <Option value="sea">东南亚</Option>
                        <Option value="me">中东</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="公司规模" size="large" style={{ width: '100%' }}>
                        <Option value="1-50">1-50人</Option>
                        <Option value="51-200">51-200人</Option>
                        <Option value="201-500">201-500人</Option>
                        <Option value="500+">500人以上</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Button type="primary" size="large" icon={<SearchOutlined />} block>搜索</Button>
                    </Col>
                  </Row>
                </Card>
                <Card title="搜索结果" extra={<Button icon={<DownloadOutlined />}>导出数据</Button>}>
                  <Table
                    dataSource={linkedinData}
                    columns={linkedinColumns}
                    pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条结果` }}
                    size="small"
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'maps',
            label: (
              <span><EnvironmentOutlined /> 地图拓客</span>
            ),
            children: (
              <>
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Input placeholder="输入产品关键词" prefix={<SearchOutlined />} size="large" />
                    </Col>
                    <Col xs={12} sm={4}>
                      <Input placeholder="城市/地区" size="large" />
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="行业类别" size="large" style={{ width: '100%' }}>
                        <Option value="wholesale">批发商</Option>
                        <Option value="retail">零售商</Option>
                        <Option value="distributor">分销商</Option>
                        <Option value="importer">进口商</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select placeholder="搜索半径" size="large" style={{ width: '100%' }}>
                        <Option value="5">5公里</Option>
                        <Option value="10">10公里</Option>
                        <Option value="25">25公里</Option>
                        <Option value="50">50公里</Option>
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Button type="primary" size="large" icon={<SearchOutlined />} block>搜索</Button>
                    </Col>
                  </Row>
                </Card>
                <Card title="搜索结果" extra={<Button icon={<DownloadOutlined />}>导出数据</Button>}>
                  <Table
                    dataSource={mapsData}
                    columns={mapsColumns}
                    pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条结果` }}
                    size="small"
                  />
                </Card>
              </>
            ),
          },
        ]}
      />
    </div>
  )
}

export default FindCustomers
