"use client";

import React, { useState } from "react";
import { FileText, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !repoUrl) {
      toast.error("Please fill in the Project Name and Repository URL.");
      return;
    }

    setLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Checking credits and validating repository...",
        success: () => {
          setLoading(false);
          return "Validation successful! 150 credits required to scan this repository.";
        },
        error: () => {
          setLoading(false);
          return "Failed to validate repository. Please check your URL.";
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-6 px-4 md:px-8">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 max-w-5xl w-full items-center">
        {/* Left Side: Vector Illustration */}
        <div className="md:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square rounded-full bg-slate-100/50 dark:bg-slate-800/20 p-6 border border-border/20 shadow-xs flex items-center justify-center">
            <img
              src="/github-illustration.png"
              alt="Developer working at laptop illustration"
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal rounded-full"
            />
          </div>
        </div>

        {/* Right Side: GitHub Linking Form */}
        <div className="md:col-span-7 flex flex-col gap-6 w-full max-w-md md:pl-4">
          <div className="space-y-2">
            <h1 className="text-[26px] md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Link your GitHub Repository
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Enter the URL of your GitHub repository to link it to Dionysus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Name Field */}
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <Input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={loading}
                className="pl-11 h-12 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-sm font-medium rounded-xl transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-slate-900 dark:text-white placeholder:text-slate-400/80 dark:placeholder:text-slate-500"
              />
            </div>

            {/* GitHub Repository URL Field */}
            <div className="relative">
              <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <Input
                type="text"
                placeholder="Github Repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={loading}
                className="pl-11 h-12 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-sm font-medium rounded-xl transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-slate-900 dark:text-white placeholder:text-slate-400/80 dark:placeholder:text-slate-500"
              />
            </div>

            {/* GitHub Token Field */}
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <Input
                type="password"
                placeholder="GitHub Token (optional, for private repositories)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={loading}
                className="pl-11 h-12 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-sm font-medium rounded-xl transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-slate-900 dark:text-white placeholder:text-slate-400/80 dark:placeholder:text-slate-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Check Credits</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
