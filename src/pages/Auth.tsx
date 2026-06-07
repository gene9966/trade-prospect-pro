import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, Tabs, message } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { authApi } from '../lib/supabase'

const { Title, Text } = Typography

function Auth() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true)
    const { error } = await authApi.signIn(values.email, values.password)
    setLoading(false)
    if (error) {
      message.error('登录失败：' + error.message)
      return
    }
    message.success('登录成功！')
    navigate('/')
  }

  const handleRegister = async (values: { email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次密码不一致')
      return
    }
    setLoading(true)
    const { error } = await authApi.signUp(values.email, values.password)
    setLoading(false)
    if (error) {
      message.error('注册失败：' + error.message)
      return
    }
    message.success('注册成功！正在自动登录...')
    // 注册成功后自动登录
    const { error: loginError } = await authApi.signIn(values.email, values.password)
    if (!loginError) {
      navigate('/')
    } else {
      message.info('请使用注册的账号登录')
      setActiveTab('login')
    }
  }

  const items = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large" block>
              登 录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form onFinish={handleRegister} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large" block>
              注 册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card style={{ width: 420, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: 8 }}>
            TradeProspect Pro
          </Title>
          <Text type="secondary">外贸客户开发系统</Text>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={items} />

        <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: 12 }}>
          免费云端版 · 数据安全存储
        </Text>
      </Card>
    </div>
  )
}

export default Auth
