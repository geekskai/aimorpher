<a href="https://www.aimorpher.com">
  <img alt="aimorpher.com" src="./public/og.png">
  <h1 align="center">aimorpher.com</h1>
</a>

<p align="center">
  Turn your resume into a professional website in seconds. Powered by Together.ai & Llama 3.3.
</p>

<p align="center">
  <a href="#english">English</a> | <a href="#chinese">中文</a>
</p>

---

## English

### 🚀 Features

- **One-Click Conversion**: Upload your LinkedIn PDF or resume and get a professional website instantly
- **AI-Powered**: Uses Together.ai's Llama 3.3 for intelligent content extraction
- **Real-time Editing**: Edit your resume content with live preview
- **Custom URLs**: Get your personalized URL (e.g., aimorpher.com/yourname)
- **Responsive Design**: Looks great on all devices
- **SEO Optimized**: Built-in SEO with Open Graph support
- **100% Free & Open Source**: No hidden costs, fully open source

### 🛠 Tech Stack

- **AI/LLM**: Together.ai with Llama 3.3 for content extraction
- **Framework**: Next.js 14 with App Router
- **Authentication**: Clerk for user management
- **Database**: Upstash Redis for data storage
- **File Storage**: Cloudflare R2 for PDF storage
- **Styling**: Tailwind CSS + shadcn/ui components
- **Deployment**: Vercel for hosting
- **Analytics**: Plausible (optional)

### 🎯 How It Works

1. **Sign Up**: Create an account with Clerk authentication
2. **Upload**: Upload your LinkedIn PDF or resume (supports PDF format only)
3. **AI Processing**: Llama 3.3 extracts and structures your information
4. **Customize**: Edit and customize your content with real-time preview
5. **Publish**: Get your personalized website URL and share it with the world

### 🚀 Quick Start

#### Prerequisites

- Node.js 18+ and pnpm
- Together.ai account for AI processing
- Upstash Redis database
- Cloudflare R2 bucket for file storage
- Clerk account for authentication

#### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/geekskai/aimorpher.git
   cd aimorpher
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your API keys:

   ```env
   # Together.ai
   TOGETHER_API_KEY=your_together_api_key

   # Upstash Redis
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token

   # Cloudflare R2
   R2_ACCOUNT_ID=your_r2_account_id
   R2_ACCESS_KEY_ID=your_r2_access_key
   R2_SECRET_ACCESS_KEY=your_r2_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_ENDPOINT=your_r2_endpoint

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### 📁 Project Structure

## Tech stack

- Together.ai for the LLM
- Vercel's AI SDK as the LLM framework
- Clerk for authentication
- Next.js app router
- Helicone for observability
- Cloudflare R2 for object storage (PDFs)
- Upstash redis for my DB
- Vercel for hosting

## How it works

1. Create an account on the site with Clerk
2. Upload a PDF which gets uploaded to R2 and does a safety check with Llama Guard
3. Send the PDF as context to Qwen 2.5 72B to extract out relevant information with structured outputs (JSON mode)
4. Get all the information & put it on a dynamic route for the user to be able to view & publish their site

## Cloning & running

1. Fork or clone the repo
2. Create an account at [Together AI](https://togetherai.link) for the LLM
3. Create an account at [Upstash](https://upstash.com/) for the Redis DB
4. Create an account at [Cloudflare](https://cloudflare.com/) for the R2 bucket
5. Create a `.env` (use the `.example.env` for reference) and replace the API keys
6. Run `pnpm install` and `pnpm run dev` to install dependencies and run locally

## Future tasks

- [ ] Change llama 3.3 to Qwen 2.5 on the app
- [ ] Add Helicone for observability
- [ ] add error logging to make sure to fix any bugs
- [ ] add ability to get to the "preview" page if you have a site already
- [ ] ability to edit links in the site
- [ ] ability to edit any section in the site
- [ ] add themes that you can toggle on (start with ghibli)
- [ ] Delete previously uploaded resume when we upload a new one
