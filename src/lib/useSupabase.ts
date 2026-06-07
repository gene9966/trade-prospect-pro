import { useState, useEffect, useCallback } from 'react'
import { customerApi, followUpApi, emailTemplateApi, emailCampaignApi, emailSequenceApi, taskApi } from './supabase'
import type { Customer, FollowUp, EmailTemplate, EmailCampaign, EmailSequence, Task } from './supabase'
import {
  mockCustomers, mockFollowUps, mockEmailTemplates,
  mockEmailCampaigns, mockEmailSequences, mockTasks,
} from './mockData'

// ============ Supabase 配置检测 ============

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  return !!(url && key && !url.includes('placeholder'))
}

// ============ useCustomers Hook ============

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (isSupabaseConfigured()) {
        const { data, error: err } = await customerApi.getAll()
        if (err) throw err
        setCustomers(data || [])
      } else {
        setCustomers(mockCustomers)
      }
    } catch (err: any) {
      setError(err.message || '获取客户数据失败')
      // 降级到模拟数据
      setCustomers(mockCustomers)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const addCustomer = async (data: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (isSupabaseConfigured()) {
      const { data: newCustomer, error: err } = await customerApi.insert(data)
      if (err) throw err
      setCustomers((prev) => [newCustomer!, ...prev])
      return newCustomer
    } else {
      const newCustomer: Customer = {
        ...data,
        id: String(Date.now()),
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setCustomers((prev) => [newCustomer, ...prev])
      return newCustomer
    }
  }

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    if (isSupabaseConfigured()) {
      const { data: updated, error: err } = await customerApi.update(id, data)
      if (err) throw err
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated! : c)))
      return updated
    } else {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data, updated_at: new Date().toISOString() } : c))
      )
      return customers.find((c) => c.id === id)
    }
  }

  const deleteCustomer = async (id: string) => {
    if (isSupabaseConfigured()) {
      const { error: err } = await customerApi.delete(id)
      if (err) throw err
    }
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  return { customers, loading, error, refresh: fetchCustomers, addCustomer, updateCustomer, deleteCustomer }
}

// ============ useFollowUps Hook ============

export function useFollowUps(customerId?: string) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFollowUps = useCallback(async (cid?: string) => {
    if (!cid) return
    setLoading(true)
    try {
      if (isSupabaseConfigured()) {
        const { data, error: err } = await followUpApi.getByCustomer(cid)
        if (err) throw err
        setFollowUps(data || [])
      } else {
        setFollowUps(mockFollowUps.filter((f) => f.customer_id === cid))
      }
    } catch {
      setFollowUps(mockFollowUps.filter((f) => f.customer_id === cid))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (customerId) {
      fetchFollowUps(customerId)
    }
  }, [customerId, fetchFollowUps])

  const addFollowUp = async (data: Omit<FollowUp, 'id' | 'user_id' | 'created_at'>) => {
    if (isSupabaseConfigured()) {
      const { data: newFollowUp, error: err } = await followUpApi.insert(data)
      if (err) throw err
      setFollowUps((prev) => [newFollowUp!, ...prev])
      return newFollowUp
    } else {
      const newFollowUp: FollowUp = {
        ...data,
        id: `f${Date.now()}`,
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
      }
      setFollowUps((prev) => [newFollowUp, ...prev])
      return newFollowUp
    }
  }

  return { followUps, loading, refresh: fetchFollowUps, addFollowUp }
}

// ============ useEmailTemplates Hook ============

export function useEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (isSupabaseConfigured()) {
        const { data, error: err } = await emailTemplateApi.getAll()
        if (err) throw err
        setTemplates(data || [])
      } else {
        setTemplates(mockEmailTemplates)
      }
    } catch (err: any) {
      setError(err.message || '获取模板数据失败')
      setTemplates(mockEmailTemplates)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const addTemplate = async (data: Omit<EmailTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (isSupabaseConfigured()) {
      const { data: newTemplate, error: err } = await emailTemplateApi.insert(data)
      if (err) throw err
      setTemplates((prev) => [newTemplate!, ...prev])
      return newTemplate
    } else {
      const newTemplate: EmailTemplate = {
        ...data,
        id: String(Date.now()),
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setTemplates((prev) => [newTemplate, ...prev])
      return newTemplate
    }
  }

  const updateTemplate = async (id: string, data: Partial<EmailTemplate>) => {
    if (isSupabaseConfigured()) {
      const { data: updated, error: err } = await emailTemplateApi.update(id, data)
      if (err) throw err
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated! : t)))
      return updated
    } else {
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } : t))
      )
      return templates.find((t) => t.id === id)
    }
  }

  const deleteTemplate = async (id: string) => {
    if (isSupabaseConfigured()) {
      const { error: err } = await emailTemplateApi.delete(id)
      if (err) throw err
    }
    setTemplates((prev) => prev.filter((t) => t.id !== id))
  }

  return { templates, loading, error, refresh: fetchTemplates, addTemplate, updateTemplate, deleteTemplate }
}

// ============ useEmailCampaigns Hook ============

export function useEmailCampaigns() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (isSupabaseConfigured()) {
        const { data, error: err } = await emailCampaignApi.getAll()
        if (err) throw err
        setCampaigns(data || [])
      } else {
        setCampaigns(mockEmailCampaigns)
      }
    } catch (err: any) {
      setError(err.message || '获取活动数据失败')
      setCampaigns(mockEmailCampaigns)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const addCampaign = async (data: Omit<EmailCampaign, 'id' | 'user_id' | 'created_at'>) => {
    if (isSupabaseConfigured()) {
      const { data: newCampaign, error: err } = await emailCampaignApi.insert(data)
      if (err) throw err
      setCampaigns((prev) => [newCampaign!, ...prev])
      return newCampaign
    } else {
      const newCampaign: EmailCampaign = {
        ...data,
        id: String(Date.now()),
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
      }
      setCampaigns((prev) => [newCampaign, ...prev])
      return newCampaign
    }
  }

  return { campaigns, loading, error, refresh: fetchCampaigns, addCampaign }
}

// ============ useEmailSequences Hook ============

export function useEmailSequences() {
  const [sequences, setSequences] = useState<EmailSequence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSequences = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (isSupabaseConfigured()) {
        const { data, error: err } = await emailSequenceApi.getAll()
        if (err) throw err
        setSequences(data || [])
      } else {
        setSequences(mockEmailSequences)
      }
    } catch (err: any) {
      setError(err.message || '获取序列数据失败')
      setSequences(mockEmailSequences)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSequences()
  }, [fetchSequences])

  const addSequence = async (data: Omit<EmailSequence, 'id' | 'user_id' | 'created_at'>) => {
    if (isSupabaseConfigured()) {
      const { data: newSequence, error: err } = await emailSequenceApi.insert(data)
      if (err) throw err
      setSequences((prev) => [newSequence!, ...prev])
      return newSequence
    } else {
      const newSequence: EmailSequence = {
        ...data,
        id: String(Date.now()),
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
      }
      setSequences((prev) => [newSequence, ...prev])
      return newSequence
    }
  }

  const updateSequence = async (id: string, data: Partial<EmailSequence>) => {
    if (isSupabaseConfigured()) {
      const { data: updated, error: err } = await emailSequenceApi.update(id, data)
      if (err) throw err
      setSequences((prev) => prev.map((s) => (s.id === id ? updated! : s)))
      return updated
    } else {
      setSequences((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      )
      return sequences.find((s) => s.id === id)
    }
  }

  const deleteSequence = async (id: string) => {
    if (isSupabaseConfigured()) {
      const { error: err } = await emailSequenceApi.delete(id)
      if (err) throw err
    }
    setSequences((prev) => prev.filter((s) => s.id !== id))
  }

  return { sequences, loading, error, refresh: fetchSequences, addSequence, updateSequence, deleteSequence }
}

// ============ useTasks Hook ============

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (isSupabaseConfigured()) {
        const { data, error: err } = await taskApi.getAll()
        if (err) throw err
        setTasks(data || [])
      } else {
        setTasks(mockTasks)
      }
    } catch (err: any) {
      setError(err.message || '获取任务数据失败')
      setTasks(mockTasks)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = async (data: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
    if (isSupabaseConfigured()) {
      const { data: newTask, error: err } = await taskApi.insert(data)
      if (err) throw err
      setTasks((prev) => [newTask!, ...prev])
      return newTask
    } else {
      const newTask: Task = {
        ...data,
        id: String(Date.now()),
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
      }
      setTasks((prev) => [newTask, ...prev])
      return newTask
    }
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    if (isSupabaseConfigured()) {
      const { data: updated, error: err } = await taskApi.update(id, data)
      if (err) throw err
      setTasks((prev) => prev.map((t) => (t.id === id ? updated! : t)))
      return updated
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      )
      return tasks.find((t) => t.id === id)
    }
  }

  const deleteTask = async (id: string) => {
    if (isSupabaseConfigured()) {
      const { error: err } = await taskApi.delete(id)
      if (err) throw err
    }
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const newStatus = task.status === 'pending' ? 'completed' : 'pending'
    if (isSupabaseConfigured()) {
      const { data: updated, error: err } = await taskApi.toggleStatus(id, newStatus)
      if (err) throw err
      setTasks((prev) => prev.map((t) => (t.id === id ? updated! : t)))
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      )
    }
  }

  return { tasks, loading, error, refresh: fetchTasks, addTask, updateTask, deleteTask, toggleTask }
}
