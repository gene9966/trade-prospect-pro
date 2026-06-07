import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============ 类型定义 ============

export interface Customer {
  id: string
  user_id: string
  company_name: string
  country: string
  industry: string
  contact_person: string
  email: string
  phone: string
  website: string
  stage: 'lead' | 'contacted' | 'interested' | 'quoted' | 'negotiating' | 'closed' | 'lost'
  priority: 'A' | 'B' | 'C'
  source: string
  notes: string
  created_at: string
  updated_at: string
}

export interface FollowUp {
  id: string
  customer_id: string
  user_id: string
  type: 'email' | 'phone' | 'meeting' | 'note'
  content: string
  next_follow_up: string | null
  created_at: string
}

export interface EmailTemplate {
  id: string
  user_id: string
  name: string
  type: 'development' | 'follow_up' | 'quote' | 'holiday' | 'custom'
  language: string
  subject: string
  body: string
  variables: string
  created_at: string
  updated_at: string
}

export interface EmailCampaign {
  id: string
  user_id: string
  name: string
  template_id: string
  status: 'draft' | 'sending' | 'completed' | 'paused'
  total_sent: number
  open_rate: number
  reply_rate: number
  bounce_rate: number
  created_at: string
}

export interface EmailSequence {
  id: string
  user_id: string
  name: string
  type: 'new_customer' | 'inquiry' | 'quote' | 'custom'
  email_count: number
  interval_days: number
  status: 'active' | 'paused' | 'completed'
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  customer_id: string | null
  customer_name: string
  priority: 'high' | 'medium' | 'low'
  due_date: string
  status: 'pending' | 'completed'
  notes: string
  created_at: string
}

// ============ 阶段映射 ============

export const stageMap: Record<string, { label: string; color: string }> = {
  lead: { label: '线索', color: 'default' },
  contacted: { label: '初步接触', color: 'processing' },
  interested: { label: '意向', color: 'processing' },
  quoted: { label: '报价', color: 'warning' },
  negotiating: { label: '谈判', color: 'purple' },
  closed: { label: '成交', color: 'success' },
  lost: { label: '流失', color: 'error' },
}

export const stageReverseMap: Record<string, string> = {
  '线索': 'lead',
  '初步接触': 'contacted',
  '意向': 'interested',
  '报价': 'quoted',
  '谈判': 'negotiating',
  '成交': 'closed',
  '流失': 'lost',
}

// ============ 数据库操作封装 ============

// 客户
export const customerApi = {
  getAll: () => supabase.from('customers').select('*').order('created_at', { ascending: false }),
  getById: (id: string) => supabase.from('customers').select('*').eq('id', id).single(),
  insert: (data: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    supabase.from('customers').insert(data).select().single(),
  update: (id: string, data: Partial<Customer>) =>
    supabase.from('customers').update(data).eq('id', id).select().single(),
  delete: (id: string) => supabase.from('customers').delete().eq('id', id),
  search: (keyword: string) =>
    supabase.from('customers').select('*').or(`company_name.ilike.%${keyword}%,contact_person.ilike.%${keyword}%,country.ilike.%${keyword}%,email.ilike.%${keyword}%`),
}

// 跟进记录
export const followUpApi = {
  getByCustomer: (customerId: string) =>
    supabase.from('follow_ups').select('*').eq('customer_id', customerId).order('created_at', { ascending: false }),
  insert: (data: Omit<FollowUp, 'id' | 'user_id' | 'created_at'>) =>
    supabase.from('follow_ups').insert(data).select().single(),
}

// 邮件模板
export const emailTemplateApi = {
  getAll: () => supabase.from('email_templates').select('*').order('created_at', { ascending: false }),
  insert: (data: Omit<EmailTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    supabase.from('email_templates').insert(data).select().single(),
  update: (id: string, data: Partial<EmailTemplate>) =>
    supabase.from('email_templates').update(data).eq('id', id).select().single(),
  delete: (id: string) => supabase.from('email_templates').delete().eq('id', id),
}

// 邮件活动
export const emailCampaignApi = {
  getAll: () => supabase.from('email_campaigns').select('*').order('created_at', { ascending: false }),
  insert: (data: Omit<EmailCampaign, 'id' | 'user_id' | 'created_at'>) =>
    supabase.from('email_campaigns').insert(data).select().single(),
}

// 自动化序列
export const emailSequenceApi = {
  getAll: () => supabase.from('email_sequences').select('*').order('created_at', { ascending: false }),
  insert: (data: Omit<EmailSequence, 'id' | 'user_id' | 'created_at'>) =>
    supabase.from('email_sequences').insert(data).select().single(),
  update: (id: string, data: Partial<EmailSequence>) =>
    supabase.from('email_sequences').update(data).eq('id', id).select().single(),
  delete: (id: string) => supabase.from('email_sequences').delete().eq('id', id),
}

// 任务
export const taskApi = {
  getAll: () => supabase.from('tasks').select('*').order('created_at', { ascending: false }),
  insert: (data: Omit<Task, 'id' | 'user_id' | 'created_at'>) =>
    supabase.from('tasks').insert(data).select().single(),
  update: (id: string, data: Partial<Task>) =>
    supabase.from('tasks').update(data).eq('id', id).select().single(),
  delete: (id: string) => supabase.from('tasks').delete().eq('id', id),
  toggleStatus: (id: string, status: 'pending' | 'completed') =>
    supabase.from('tasks').update({ status }).eq('id', id).select().single(),
}

// 认证
export const authApi = {
  signUp: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback: (event: string, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
}
