# TradeProspect Pro 云端部署指南

> 将外贸客户开发系统部署为免费云端应用

## 技术方案

- **前端托管**：Vercel（免费）
- **后端数据库**：Supabase（免费 PostgreSQL + API + 认证）
- **总费用**：**完全免费**

---

## 第一步：创建 Supabase 项目（后端）

### 1.1 注册 Supabase
1. 访问 https://supabase.com
2. 点击 "Start your project"，用 GitHub 账号登录
3. 创建新组织（Organization），名称随意

### 1.2 创建项目
1. 点击 "New Project"
2. 填写项目信息：
   - **Name**：`trade-prospect-pro`
   - **Database Password**：设置一个强密码（记下来！）
   - **Region**：选择离你最近的区域（如 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`）
3. 点击 "Create new project"，等待约 2 分钟

### 1.3 获取连接信息
项目创建完成后，进入项目 Dashboard：

1. 点击左侧菜单 **Settings** → **API**
2. 复制以下两个值（后面需要用到）：
   - **Project URL**（如：`https://xxxxxxxxxxxx.supabase.co`）
   - **anon public** API Key（以 `eyJ...` 开头）

### 1.4 创建数据库表
1. 点击左侧菜单 **SQL Editor**
2. 点击 **New query**
3. 打开项目中的 `supabase-schema.sql` 文件，复制全部内容
4. 粘贴到 SQL Editor 中，点击 **Run**
5. 等待执行完成（约 10 秒）

> ✅ 此时数据库已创建好：customers、follow_ups、email_templates、email_campaigns、email_sequences、tasks 共 6 张表，以及安全策略（RLS）。

---

## 第二步：部署到 Vercel（前端）

### 2.1 准备代码
确保你的代码已推送到 GitHub（Vercel 需要从 GitHub 部署）：

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 创建新仓库，然后推送
git remote add origin https://github.com/你的用户名/trade-prospect-pro.git
git branch -M main
git push -u origin main
```

### 2.2 注册 Vercel
1. 访问 https://vercel.com
2. 点击 "Sign Up"，用 GitHub 账号登录
3. 授权 Vercel 访问你的 GitHub 仓库

### 2.3 导入项目
1. 在 Vercel Dashboard 点击 **Add New...** → **Project**
2. 找到你的 `trade-prospect-pro` 仓库，点击 **Import**
3. 配置项目：
   - **Framework Preset**：选择 `Vite`
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`
4. 展开 **Environment Variables**，添加两个变量：

   | 变量名 | 值 |
   |--------|-----|
   | `VITE_SUPABASE_URL` | 你的 Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | 你的 Supabase anon public API Key |

5. 点击 **Deploy**，等待约 2 分钟

### 2.4 访问你的云端应用
部署完成后，Vercel 会提供一个域名（如 `https://trade-prospect-pro.vercel.app`），点击即可访问！

---

## 第三步：配置 Supabase 认证（可选但推荐）

为了让用户能注册和登录，需要在 Supabase 中配置认证：

1. 在 Supabase Dashboard，点击左侧 **Authentication** → **Providers**
2. 确保 **Email** 提供商已启用（默认就是启用的）
3. 点击 **URL Configuration**，添加你的 Vercel 域名到 **Site URL** 和 **Redirect URLs**

---

## 免费额度说明

| 服务 | 免费额度 | 说明 |
|------|----------|------|
| **Vercel** | 每月 100GB 流量 | 个人项目完全够用 |
| **Supabase 数据库** | 500MB 存储 | 可存储数万条客户记录 |
| **Supabase API** | 无限请求 | 无限制 |
| **Supabase 认证** | 无限用户 | 无限制 |

> 对于中小外贸团队（5-50人），免费额度完全足够使用。

---

## 常见问题

### Q: 部署后页面显示空白？
A: 检查浏览器控制台是否有报错。通常是环境变量没配置正确，或 Supabase URL/Key 填错了。

### Q: 数据库连接失败？
A: 确认 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 环境变量已正确添加到 Vercel。

### Q: 如何更新已部署的应用？
A: 直接修改代码并 `git push` 到 GitHub，Vercel 会自动重新部署。

### Q: 能否使用自定义域名？
A: 可以！在 Vercel 项目设置中添加自定义域名（如 `crm.yourcompany.com`）。

---

## 项目文件说明

```
trade-prospect-pro/
├── src/
│   ├── lib/supabase.ts       # Supabase 客户端配置 + API 封装
│   ├── pages/
│   │   ├── Auth.tsx          # 登录/注册页面
│   │   ├── CustomerManagement.tsx  # 客户管理（已接入真实API）
│   │   ├── Tasks.tsx         # 任务日程（已接入真实API）
│   │   └── ...               # 其他页面
│   ├── App.tsx               # 路由 + 登录状态管理
│   └── ...
├── supabase-schema.sql       # 数据库初始化脚本
├── vercel.json               # Vercel 路由配置
└── DEPLOY.md                 # 本部署指南
```

---

## 下一步扩展

当前已实现的核心功能：
- ✅ 用户注册/登录
- ✅ 客户管理（增删改查、Pipeline、跟进记录）
- ✅ 任务日程（列表+日历视图）

可继续扩展：
- 📧 邮件模板管理（已预留 API）
- 📊 数据分析图表
- 🔍 找客户模块（海关数据等需要接入第三方 API）
- 👥 团队协作（多用户数据隔离已支持）
