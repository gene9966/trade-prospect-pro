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
  Modal,
  Alert,
  Empty,
  Spin,
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
  CheckCircleOutlined,
  LoadingOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { searchCustomers, getCountryList, getIndustryList } from '../lib/customerSearch'
import type { SearchResult } from '../lib/customerSearch'
import { customerApi } from '../lib/supabase'
import { isSupabaseConfigured } from '../lib/useSupabase'

const { Text, Title } = Typography
const { Option } = Select

function FindCustomers() {
  const [activeTab, setActiveTab] = useState('search')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchSource, setSearchSource] = useState('')
  const [searchDone, setSearchDone] = useState(false)

  // 搜索参数
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')

  // 导入状态
  const [importing, setImporting] = useState<string[]>([])
  const [importedKeys, setImportedKeys] = useState<Set<string>>(new Set())

  // 模拟LinkedIn数据（保留展示）
  const linkedinData = [
    { key: '1', name: 'Sarah Johnson', title: 'Procurement Director', company: 'TechVision Inc.', country: '美国', industry: '电子科技', linkedin: 'linkedin.com/in/sarah-j' },
    { key: '2', name: 'James Wilson', title: 'Sourcing Manager', company: 'Royal Home Ltd.', country: '英国', industry: '家居用品', linkedin: 'linkedin.com/in/james-w' },
    { key: '3', name: 'Anna Schmidt', title: 'VP of Supply Chain', company: 'Deutsche Maschinen', country: '德国', industry: '机械设备', linkedin: 'linkedin.com/in/anna-s' },
    { key: '4', name: 'David Lee', title: 'Purchasing Manager', company: 'Samsung Electronics', country: '韩国', industry: '电子科技', linkedin: 'linkedin.com/in/david-l' },
    { key: '5', name: 'Maria Garcia', title: 'Category Manager', company: 'Iberia Trade SA', country: '西班牙', industry: '食品饮料', linkedin: 'linkedin.com/in/maria-g' },
  ]

  // 模拟海关数据（保留展示）
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

  const countryList = getCountryList()
  const industryList = getIndustryList()

  // 真实搜索
  const handleRealSearch = async () => {
    if (!keyword.trim()) {
      message.warning('请输入搜索关键词')
      return
    }

    setSearchLoading(true)
    setSearchDone(false)
    try {
      const result = await searchCustomers({
        keyword: keyword.trim(),
        industry: industry || undefined,
        country: country || undefined,
        city: city || undefined,
      })

      setSearchResults(result.results)
      setSearchSource(result.source)
      setSearchDone(true)

      if (result.results.length > 0) {
        message.success(`搜索完成！找到 ${result.total} 条结果（来源：${result.source}）`)
      } else {
        message.info('未找到相关企业，请尝试更换关键词或地区')
      }
    } catch (error: any) {
      message.error(error.message || '搜索失败，请稍后重试')
      setSearchResults([])
      setSearchSource('')
      setSearchDone(true)
    } finally {
      setSearchLoading(false)
    }
  }

  // 导入单个客户到系统
  const handleImportOne = async (record: SearchResult) => {
    if (!isSupabaseConfigured()) {
      message.error('数据库未配置，无法导入')
      return
    }

    setImporting(prev => [...prev, record.key])
    try {
      const { error } = await customerApi.insert({
        company_name: record.company_name,
        country: record.country,
        industry: record.industry || industry || '未分类',
        contact_person: '',
        email: '',
        phone: record.phone || '',
        website: record.website || '',
        stage: 'lead',
        priority: 'B',
        source: `在线搜索 (${searchSource})`,
        notes: `地址: ${record.address}\n搜索来源: ${searchSource}\n导入时间: ${new Date().toLocaleString('zh-CN')}`,
      })

      if (error) throw error

      setImportedKeys(prev => new Set(prev).add(record.key))
      message.success(`已导入：${record.company_name}`)
    } catch (error: any) {
      message.error(`导入失败：${error.message}`)
    } finally {
      setImporting(prev => prev.filter(k => k !== record.key))
    }
  }

  // 批量导入所有搜索结果
  const handleImportAll = async () => {
    if (!isSupabaseConfigured()) {
      message.error('数据库未配置，无法导入')
      return
    }

    const toImport = searchResults.filter(r => !importedKeys.has(r.key))
    if (toImport.length === 0) {
      message.info('没有可导入的新客户')
      return
    }

    Modal.confirm({
      title: '批量导入确认',
      content: `即将导入 ${toImport.length} 个客户到您的客户管理系统，确认继续？`,
      okText: '确认导入',
      cancelText: '取消',
      onOk: async () => {
        let successCount = 0
        let failCount = 0

        for (const record of toImport) {
          try {
            const { error } = await customerApi.insert({
              company_name: record.company_name,
              country: record.country,
              industry: record.industry || industry || '未分类',
              contact_person: '',
              email: '',
              phone: record.phone || '',
              website: record.website || '',
              stage: 'lead',
              priority: 'B',
              source: `在线搜索 (${searchSource})`,
              notes: `地址: ${record.address}\n搜索来源: ${searchSource}\n导入时间: ${new Date().toLocaleString('zh-CN')}`,
            })

            if (error) {
              failCount++
            } else {
              successCount++
              setImportedKeys(prev => new Set(prev).add(record.key))
            }
          } catch {
            failCount++
          }
        }

        if (successCount > 0) {
          message.success(`成功导入 ${successCount} 个客户${failCount > 0 ? `，${failCount} 个失败` : ''}`)
        } else {
          message.error(`导入失败 ${failCount} 个`)
        }
      },
    })
  }

  // 导出搜索结果为CSV
  const handleExportCSV = () => {
    if (searchResults.length === 0) {
      message.info('没有可导出的数据')
      return
    }

    const headers = ['公司名称', '国家', '城市', '地址', '电话', '网站', '行业', '类型']
    const rows = searchResults.map(r => [
      r.company_name, r.country, r.city, r.address,
      r.phone, r.website, r.industry, r.type
    ])

    const csvContent = '\uFEFF' + [headers, ...rows].map(row =>
      row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `客户搜索结果_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    message.success('导出成功！')
  }

  // 搜索结果表格列
  const searchColumns = [
    {
      title: '公司名称',
      dataIndex: 'company_name',
      key: 'company_name',
      render: (text: string, record: SearchResult) => (
        <div>
          <Text strong>{text}</Text>
          {record.website && (
            <div><a href={record.website.startsWith('http') ? record.website : `https://${record.website}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#1890ff' }}>{record.website}</a></div>
          )}
        </div>
      ),
    },
    { title: '国家', dataIndex: 'country', key: 'country', render: (v: string) => v ? <Tag color="blue">{v}</Tag> : '-' },
    { title: '城市', dataIndex: 'city', key: 'city' },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true, width: 200 },
    { title: '电话', dataIndex: 'phone', key: 'phone', render: (v: string) => v || '-' },
    { title: '行业', dataIndex: 'industry', key: 'industry', render: (v: string) => v ? <Tag color="green">{v}</Tag> : '-' },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: SearchResult) => (
        <Space>
          {importedKeys.has(record.key) ? (
            <Tooltip title="已导入">
              <Tag icon={<CheckCircleOutlined />} color="success">已导入</Tag>
            </Tooltip>
          ) : (
            <Tooltip title="导入到客户库">
              <Button
                type="link"
                size="small"
                icon={<ImportOutlined />}
                loading={importing.includes(record.key)}
                onClick={() => handleImportOne(record)}
              >
                导入
              </Button>
            </Tooltip>
          )}
          {record.latitude && record.longitude && (
            <Tooltip title="在地图中查看">
              <Button
                type="link"
                size="small"
                icon={<EnvironmentOutlined />}
                onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${record.latitude}&mlon=${record.longitude}#map=15/${record.latitude}/${record.longitude}`, '_blank')}
              >
                地图
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

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
          <Tooltip title="添加到客户库"><Button type="link" size="small" icon={<PlusOutlined />}>添加</Button></Tooltip>
          <Tooltip title="发送开发信"><Button type="link" size="small" icon={<MailOutlined />}>发邮件</Button></Tooltip>
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

  return (
    <div>
      <Alert
        message="💡 搜索提示"
        description="输入产品关键词（英文效果更好，如 machinery、industrial equipment）+ 选择目标国家和行业，即可搜索全球真实企业数据。搜索结果可一键导入客户管理系统。"
        type="info"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'search',
            label: (
              <span><SearchOutlined /> 在线搜索</span>
            ),
            children: (
              <>
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={[16, 12]}>
                    <Col xs={24} sm={8}>
                      <Input
                        placeholder="输入产品关键词，如：machinery, LED lighting"
                        prefix={<SearchOutlined />}
                        size="large"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        onPressEnter={handleRealSearch}
                      />
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select
                        placeholder="行业分类"
                        size="large"
                        style={{ width: '100%' }}
                        value={industry || undefined}
                        onChange={setIndustry}
                        allowClear
                      >
                        {industryList.map(i => (
                          <Option key={i.value} value={i.value}>{i.label}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Select
                        placeholder="目标国家"
                        size="large"
                        style={{ width: '100%' }}
                        value={country || undefined}
                        onChange={setCountry}
                        allowClear
                        showSearch
                      >
                        {countryList.map(c => (
                          <Option key={c.value} value={c.value}>{c.label}</Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Input
                        placeholder="城市（可选）"
                        size="large"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        onPressEnter={handleRealSearch}
                      />
                    </Col>
                    <Col xs={24} sm={4}>
                      <Button
                        type="primary"
                        size="large"
                        icon={searchLoading ? <LoadingOutlined /> : <SearchOutlined />}
                        loading={searchLoading}
                        onClick={handleRealSearch}
                        block
                      >
                        {searchLoading ? '搜索中...' : '搜索企业'}
                      </Button>
                    </Col>
                  </Row>
                </Card>

                <Card
                  title={
                    <Space>
                      <span>搜索结果</span>
                      {searchDone && searchResults.length > 0 && (
                        <Tag color="blue">{searchResults.length} 条</Tag>
                      )}
                      {searchSource && <Tag color="green">来源: {searchSource}</Tag>}
                    </Space>
                  }
                  extra={
                    <Space>
                      {searchResults.length > 0 && (
                        <>
                          <Button icon={<ImportOutlined />} type="primary" ghost onClick={handleImportAll}>
                            全部导入
                          </Button>
                          <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
                            导出CSV
                          </Button>
                        </>
                      )}
                    </Space>
                  }
                >
                  {searchLoading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <Spin size="large" tip="正在搜索全球企业数据..." />
                      <div style={{ marginTop: 16, color: '#999' }}>
                        正在从 OpenStreetMap 搜索真实企业信息，请稍候...
                      </div>
                    </div>
                  ) : searchDone && searchResults.length === 0 ? (
                    <Empty
                      description={
                        <div>
                          <p>未找到相关企业</p>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            建议：使用英文关键词搜索效果更好，如 "machinery"、"industrial equipment"、"wholesale"
                          </Text>
                        </div>
                      }
                    >
                      <Button type="primary" onClick={() => {
                        setKeyword('machinery')
                        setIndustry('机械设备')
                        handleRealSearch()
                      }}>
                        试试搜索 "machinery"
                      </Button>
                    </Empty>
                  ) : searchResults.length > 0 ? (
                    <Table
                      dataSource={searchResults}
                      columns={searchColumns}
                      pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条结果` }}
                      size="small"
                      scroll={{ x: 1000 }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <SearchOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                      <Title level={4} type="secondary">搜索全球真实企业</Title>
                      <Text type="secondary">
                        输入产品关键词和目标国家，搜索海外采购商、分销商、制造商等企业信息
                      </Text>
                      <div style={{ marginTop: 24 }}>
                        <Space>
                          <Button onClick={() => { setKeyword('machinery'); setIndustry('机械设备'); setCountry('德国'); }}>机械设备 - 德国</Button>
                          <Button onClick={() => { setKeyword('electronics'); setIndustry('电子科技'); setCountry('美国'); }}>电子科技 - 美国</Button>
                          <Button onClick={() => { setKeyword('wholesale'); setIndustry('家居用品'); setCountry('英国'); }}>家居用品 - 英国</Button>
                        </Space>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            ),
          },
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
                      <Button type="primary" size="large" icon={<SearchOutlined />} block>搜索</Button>
                    </Col>
                  </Row>
                </Card>
                <Card title="搜索结果" extra={<Button icon={<DownloadOutlined />}>导出数据</Button>}>
                  <Table dataSource={customsData} columns={customsColumns} pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条结果` }} size="small" />
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
              <Card>
                <Empty description="企业图谱功能已整合到「在线搜索」中，请使用在线搜索功能查找真实企业信息。" />
              </Card>
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
                  <Table dataSource={linkedinData} columns={linkedinColumns} pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条结果` }} size="small" />
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
              <Card>
                <Empty description="地图拓客功能已整合到「在线搜索」中，搜索结果支持在 OpenStreetMap 中查看企业位置。" />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}

export default FindCustomers
