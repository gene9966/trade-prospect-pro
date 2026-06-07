-- ============================================
-- TradeProspect Pro 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 客户表
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  industry TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'contacted', 'interested', 'quoted', 'negotiating', 'closed', 'lost')),
  priority TEXT DEFAULT 'B' CHECK (priority IN ('A', 'B', 'C')),
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. 跟进记录表
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'note' CHECK (type IN ('email', 'phone', 'meeting', 'note')),
  content TEXT NOT NULL,
  next_follow_up TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. 邮件模板表
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom' CHECK (type IN ('development', 'follow_up', 'quote', 'holiday', 'custom')),
  language TEXT DEFAULT 'zh',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. 邮件活动表
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'completed', 'paused')),
  total_sent INTEGER DEFAULT 0,
  open_rate NUMERIC(5,2) DEFAULT 0,
  reply_rate NUMERIC(5,2) DEFAULT 0,
  bounce_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. 自动化序列表
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom' CHECK (type IN ('new_customer', 'inquiry', 'quote', 'custom')),
  email_count INTEGER DEFAULT 3,
  interval_days INTEGER DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. 任务表
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- 行级安全策略 (RLS)
-- 确保用户只能访问自己的数据
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 客户表策略
CREATE POLICY "Users can view own customers" ON customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own customers" ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own customers" ON customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own customers" ON customers FOR DELETE USING (auth.uid() = user_id);

-- 跟进记录策略
CREATE POLICY "Users can view own follow_ups" ON follow_ups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own follow_ups" ON follow_ups FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 邮件模板策略
CREATE POLICY "Users can view own templates" ON email_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own templates" ON email_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON email_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON email_templates FOR DELETE USING (auth.uid() = user_id);

-- 邮件活动策略
CREATE POLICY "Users can view own campaigns" ON email_campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON email_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自动化序列策略
CREATE POLICY "Users can view own sequences" ON email_sequences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sequences" ON email_sequences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sequences" ON email_sequences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sequences" ON email_sequences FOR DELETE USING (auth.uid() = user_id);

-- 任务策略
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 自动更新 updated_at 字段
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 插入示例数据（可选）
-- ============================================

-- 示例邮件模板
INSERT INTO email_templates (user_id, name, type, language, subject, body, variables) VALUES
('00000000-0000-0000-0000-000000000000', '通用开发信', 'development', 'zh', '合作邀请 - {{company_name}}',
 '尊敬的{{contact_person}}，\n\n我们是{{my_company}}，专业从事{{product}}行业多年。了解到贵公司在{{country}}市场有良好的业务基础，希望能与您建立合作关系。\n\n我们的产品优势：\n- 价格竞争力强\n- 质量认证齐全\n- 交货期稳定\n\n期待您的回复！\n\n此致\n{{my_name}}',
 '["company_name","contact_person","country","my_company","product","my_name"]'),

('00000000-0000-0000-0000-000000000000', '跟进邮件', 'follow_up', 'en', 'Following up - {{company_name}}',
 'Dear {{contact_person}},\n\nI hope this email finds you well. I wanted to follow up on my previous email regarding our {{product}} offerings.\n\nWe have recently launched new models that might interest you. Would you be available for a quick call this week?\n\nBest regards,\n{{my_name}}',
 '["company_name","contact_person","product","my_name"]'),

('00000000-0000-0000-0000-000000000000', '报价模板', 'quote', 'zh', '报价单 - {{product}}',
 '尊敬的{{contact_person}}，\n\n感谢您对{{product}}的关注。以下是我们的报价：\n\n产品：{{product}}\n单价：{{price}}\nMOQ：{{moq}}\n交货期：{{delivery}}\n付款方式：{{payment}}\n\n报价有效期30天。如有任何问题，请随时联系。\n\n此致\n{{my_name}}',
 '["contact_person","product","price","moq","delivery","payment","my_name"]');
