import { api } from "@/trpc/react";
import { useState, useEffect } from "react";

export function useProject() {
  const { data: projects, isLoading } = api.project.getProjects.useQuery();
  const [projectId, setProjectId] = useState<string | null>(null);

  // Initialize selected projectId from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedProjectId");
      if (saved) {
        setProjectId(saved);
      }
    }
  }, []);

  // Sync selected projectId to localStorage and select the first project if none is active
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    if (!projectId || !projects.some((p) => p.id === projectId)) {
      const defaultId = projects[0]!.id;
      setProjectId(defaultId);
      localStorage.setItem("selectedProjectId", defaultId);
    }
  }, [projects, projectId]);

  const selectProject = (id: string) => {
    setProjectId(id);
    localStorage.setItem("selectedProjectId", id);
  };

  const project = projects?.find((p) => p.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId: selectProject,
    isLoading,
  };
}
