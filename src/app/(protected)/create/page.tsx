"use client";

import React from "react";
import { FileText, KeyRound, ArrowRight, Loader2, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";

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

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

export default function CreateProjectPage() {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const utils = api.useUtils();

  const createProject = api.project.createProject.useMutation({
    onSuccess: (data) => {
      toast.success("Project Created Successfully", {
        description: `Successfully linked and created the project "${data.name}".`,
      });
      reset();
      void utils.project.getProjects.invalidate();
    },
    onError: (err) => {
      toast.error("Failed to Create Project", {
        description: err.message || "An unexpected error occurred while linking the repository.",
      });
    },
  });

  const loading = createProject.isPending;

  function onSubmit(data: FormInput) {
    createProject.mutate({
      name: data.projectName,
      githubUrl: data.repoUrl,
    });
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-6 px-4">
      {/* Centered GitHub Linking Form Container */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <GithubIcon className="h-3.5 w-3.5" />
            Integrations
          </div>
          <h1 className="font-bold text-3xl tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Link your Github Repository
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the URL of your repository to link it and start reviewing.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium flex items-center gap-2 text-foreground/85">
              <FileText className="h-4 w-4 text-primary/80" />
              Project Name
            </Label>
            <Input
              id="projectName"
              {...register("projectName", { required: true })}
              placeholder="my-awesome-project"
              className="h-10 bg-background/50 border-input/60 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all rounded-lg"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repoUrl" className="text-sm font-medium flex items-center gap-2 text-foreground/85">
              <Link2 className="h-4 w-4 text-primary/80" />
              Github URL
            </Label>
            <Input
              id="repoUrl"
              {...register("repoUrl", { required: true })}
              placeholder="https://github.com/username/repository"
              type="url"
              className="h-10 bg-background/50 border-input/60 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all rounded-lg"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubToken" className="text-sm font-medium flex items-center gap-2 text-foreground/85">
              <KeyRound className="h-4 w-4 text-primary/80" />
              GitHub Token <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="githubToken"
              {...register("githubToken")}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              type="password"
              className="h-10 bg-background/50 border-input/60 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all rounded-lg"
              disabled={loading}
            />
            <p className="text-[11px] text-muted-foreground px-0.5">
              Provide a personal access token for private repositories.
            </p>
          </div>

          {/* Submit & Reset Buttons */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>Create Project</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => reset()}
              className="h-11 px-4 rounded-xl border border-border hover:bg-accent hover:text-accent-foreground font-semibold transition-all cursor-pointer"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
