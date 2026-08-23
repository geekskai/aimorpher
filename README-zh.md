<a href="https://www.aimorpher.com">
  <img alt="aimorpher.com" src="https://aimorpher.com/opengraph-image">
  <h1 align="center">aimorpher.com</h1>
</a>

<p align="center">
  将简历、GitHub 和精选项目转换为面向技术求职的专业网站。
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="#中文">中文</a>
</p>

---

## 🚀 功能特性

- **一键转换**：上传 LinkedIn PDF 或简历，瞬间生成专业网站
- **AI 驱动**：使用 Together.ai 的 Qwen3 Next 进行结构化内容提取
- **实时编辑**：支持实时预览的简历内容编辑
- **项目与链接**：展示精选项目、GitHub、作品和技术文章
- **隐私控制**：决定哪些联系方式和简历字段公开显示
- **职业化主题**：提供 Signal、Studio 和 Terminal 三种主页样式
- **个性化 URL**：获得专属 URL（如：aimorpher.com/你的名字）
- **响应式设计**：在所有设备上都有出色的显示效果
- **SEO 优化**：内置 SEO 优化和 Open Graph 支持
- **免费核心能力与开源代码**：免费发布完整主页，Pro 为可选付费试点

## 🛠 技术栈

- **AI/大语言模型**：Together.ai + Qwen3 Next 用于内容提取
- **前端框架**：Next.js 15 with App Router
- **身份验证**：Clerk 用户管理系统 geekskai666
- **数据库**：Upstash Redis 数据存储
- **文件存储**：Cloudflare R2 PDF 存储
- **UI 样式**：Tailwind CSS + shadcn/ui 组件库
- **部署平台**：Vercel 托管
- **数据分析**：Plausible（可选）
- **监控观测**：Helicone LLM 可观测性

## 🎯 工作原理

1. **用户注册**：使用 Clerk 身份验证系统创建账户
2. **文件上传**：上传 LinkedIn PDF 或简历文件（仅支持 PDF 格式）
3. **AI 智能处理**：Qwen3 Next 提取并结构化您的个人信息
4. **内容自定义**：审核隐私、项目、链接和主页样式
5. **一键发布**：获得个性化网站 URL 并与世界分享您的专业形象

## 🚀 快速开始

### 环境要求

- Node.js 18+ 和 pnpm 包管理器
- Together.ai 账户（用于 AI 处理）
- Upstash Redis 数据库
- Cloudflare R2 存储桶（用于文件存储）
- Clerk 账户（用于身份验证）

### 安装步骤

1. **克隆项目仓库**

   ```bash
   git clone https://github.com/geekskai/aimorpher.git
   cd aimorpher
   ```

2. **安装项目依赖**

   ```bash
   pnpm install
   ```

3. **配置环境变量**

   复制环境变量模板：

   ```bash
   cp .env.example .env.local
   ```

   在 `.env.local` 文件中填入您的 API 密钥：

   ```env
   # Together.ai API配置
   TOGETHER_API_KEY=your_together_api_key

   # Upstash Redis配置
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token

   # Cloudflare R2存储配置
   R2_ACCOUNT_ID=your_r2_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key
   R2_SECRET_ACCESS_KEY=your_r2_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_ENDPOINT=your_r2_endpoint

   # Clerk身份验证配置
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # 网站基础URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **启动开发服务器**

   ```bash
   pnpm dev
   ```

5. **访问应用**

   在浏览器中打开 `http://localhost:3000`

### 🏗 项目架构
