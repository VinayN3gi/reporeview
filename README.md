# RepoReview

RepoReview is an intelligent, AI-powered platform designed to help developers and teams understand and interact with their GitHub repositories. By ingesting your codebase and generating semantic vector embeddings, RepoReview allows you to ask complex technical questions about your code and get highly accurate, context-aware answers.

Say goodbye to endless grepping and code digging—just ask your repository!

## Features

- **AI Codebase Q&A (RAG)**: Ask technical questions about your code and get accurate answers backed by the context of your files.
- **Automated Repository Ingestion**: Easily link your GitHub repositories. The app automatically fetches, reads, and indexes the code.
- **Semantic Search**: Powered by Google's Gemini models and PostgreSQL's pgvector for blazingly fast and accurate code retrieval.
- **Code Summarization**: Automatically generates concise, onboarding-friendly summaries for every indexed file.
- **Modern UI/UX**: Built with Next.js App Router, Tailwind CSS, and Shadcn UI for a responsive, sleek user experience.
- **Secure Authentication**: Integrated with Supabase for robust user authentication and session management.

## Screenshots

Here is a glimpse of RepoReview in action:

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="./public/repo_review_1.png" alt="Dashboard" width="45%" />
  <img src="./public/repo_review_2.png" alt="Repository Overview" width="45%" />
  <img src="./public/repo_review_3.png" alt="Q&A Feature" width="45%" />
  <img src="./public/repo_review_4.png" alt="Code Summaries" width="45%" />
  <img src="./public/reepo_review_5.png" alt="Settings" width="45%" />
</div>

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) (with pgvector) & [Prisma](https://www.prisma.io/)
- **AI & Embeddings**: [Google Gemini (GenAI)](https://aistudio.google.com/) & Langchain
- **Authentication**: [Supabase](https://supabase.com/)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18+)
- npm or yarn or pnpm
- A PostgreSQL database with the pgvector extension enabled.
- A Google Gemini API Key.
- A Supabase project for Authentication.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/reporeview.git
cd reporeview
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` or `.env` file in the root directory. **Do not commit this file to version control.**

You will need to provide the following configuration variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/reporeview?schema=public"

# Supabase Auth Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Setup the Database

Push the Prisma schema to your database to create the necessary tables and vector indices:

```bash
npm run db:push
npm run db:generate
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
