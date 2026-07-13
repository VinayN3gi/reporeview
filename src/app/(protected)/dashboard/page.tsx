"use client";

import React, { useState } from "react";
import { useProject } from "@/hooks/use-project";
import {
  ExternalLink,
  Users,
  Archive,
  Bot,
  Monitor,
  Upload,
  GitBranch,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import CommitCard from "./commit-card";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Dummy commit data per project keyed by project id — fallback to generic
function getDummyCommits(projectName: string) {
  return [
    {
      id: "1",
      author: "Tomaz Bratanic",
      avatar: "TB",
      action: "committed",
      timeAgo: "4 days ago",
      title: `Add support for more LLM models (#186)`,
      bullets: [
        `Added support for AWS Bedrock models [chains.py, env.example, pull_model.Dockerfile]`,
        `Added support for \`gpt-4o\` and \`gpt-4-turbo\` models [chains.py, env.example, pull_model.Dockerfile]`,
        `Updated the list of supported models in \`pull_model.Dockerfile\``,
      ],
    },
    {
      id: "2",
      author: "Sarah Chen",
      avatar: "SC",
      action: "committed",
      timeAgo: "5 days ago",
      title: `Fix authentication middleware for edge runtime (#185)`,
      bullets: [
        `Updated middleware.ts to handle Supabase SSR cookies properly`,
        `Fixed redirect loop on protected routes`,
        `Added error boundary for auth failures`,
      ],
    },
    {
      id: "3",
      author: "Alex Rivera",
      avatar: "AR",
      action: "committed",
      timeAgo: "1 week ago",
      title: `Refactor database schema and add indexes (#184)`,
      bullets: [
        `Added composite index on [userId, createdAt] for projects table`,
        `Optimized query performance for project listing endpoint`,
        `Updated Prisma schema with new relations`,
      ],
    },
    {
      id: "4",
      author: "Jordan Lee",
      avatar: "JL",
      action: "committed",
      timeAgo: "1 week ago",
      title: `Implement dark mode support across all components (#183)`,
      bullets: [
        `Added CSS custom properties for dark theme colors`,
        `Updated Card, Badge, and Button components with dark variants`,
        `Fixed contrast issues in sidebar navigation`,
      ],
    },
  ];
}

export default function DashboardPage() {
  const { project, isLoading } = useProject();
  const [question, setQuestion] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <GitBranch className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No project selected</h2>
          <p className="text-sm text-muted-foreground">
            Create a new project or select an existing one from the sidebar to get started.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Create Project
          </Link>
        </div>
      </div>
    );
  }

  const commits = getDummyCommits(project.name);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* GitHub Link Banner + Actions Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* GitHub Linked Badge */}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
        >
          <GithubIcon className="h-4.5 w-4.5" />
          <span>This project is linked to {project.githubUrl}</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-card hover:bg-accent text-foreground rounded-xl text-sm font-semibold transition-all hover:shadow-sm active:scale-[0.98] cursor-pointer">
            <Users className="h-4 w-4 text-muted-foreground" />
            Invite a team member!
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-card hover:bg-accent text-foreground rounded-xl text-sm font-semibold transition-all hover:shadow-sm active:scale-[0.98] cursor-pointer">
            <Archive className="h-4 w-4 text-muted-foreground" />
            Archive
          </button>
        </div>
      </div>

      {/* Two Column Cards: Ask a Question + Create Meeting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Ask a Question Card */}
        <div className="group relative overflow-hidden border border-border bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
          {/* Subtle gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
          <div className="relative space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Ask a question
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Repo Review has knowledge of the codebase. Ask anything about{" "}
                <span className="font-semibold text-foreground/80">{project.name}</span>.
              </p>
            </div>

            {/* Question Input */}
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Which file should I edit to change the home page?"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <Link
              href="/qa"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
            >
              <Bot className="h-4 w-4" />
              Ask Repo Review!
            </Link>
          </div>
        </div>

        {/* Create a New Meeting Card */}
        <div className="group relative overflow-hidden border border-border bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-transparent pointer-events-none" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center border border-border/50">
              <Monitor className="h-8 w-8 text-foreground/70" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Create a new meeting</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                Analyse your meeting with Repo Review.
                <br />
                <span className="text-xs font-medium text-primary/80">Powered by AI.</span>
              </p>
            </div>
            <Link
              href="/meetings"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-foreground/80 text-foreground rounded-xl text-sm font-bold hover:bg-foreground hover:text-background transition-all active:scale-[0.98]"
            >
              <Upload className="h-4 w-4" />
              Upload Meeting
            </Link>
          </div>
        </div>
      </div>

      {/* Commit Activity Feed — Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[17px] top-6 bottom-6 w-[2px] bg-border" />

        <div className="flex flex-col gap-3">
          {commits.map((commit) => (
            <div key={commit.id} className="relative flex items-start gap-4">
              {/* Author avatar on the timeline */}
              <div className="relative z-10 shrink-0 mt-4">
                <img
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${commit.author}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&textColor=36454f&fontSize=42`}
                  alt={commit.author}
                  className="h-9 w-9 rounded-full border-2 border-background shadow-sm bg-muted"
                />
              </div>

              {/* Card */}
              <div className="flex-1 min-w-0">
                <CommitCard
                  author={commit.author}
                  timeAgo={commit.timeAgo}
                  title={commit.title}
                  bullets={commit.bullets}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
