import { api } from "@/trpc/react";
import { useState, useEffect, useCallback } from "react";

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

  // Listen for storage changes from other hook instances (e.g. sidebar → dashboard)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "selectedProjectId" && e.newValue) {
        setProjectId(e.newValue);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Custom event listener for same-tab cross-component sync
  useEffect(() => {
    function handleProjectChange(e: Event) {
      const customEvent = e as CustomEvent<string>;
      setProjectId(customEvent.detail);
    }
    window.addEventListener("projectChanged", handleProjectChange);
    return () => window.removeEventListener("projectChanged", handleProjectChange);
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

  const selectProject = useCallback((id: string) => {
    setProjectId(id);
    localStorage.setItem("selectedProjectId", id);
    // Dispatch custom event so other hook instances in the same tab update
    window.dispatchEvent(new CustomEvent("projectChanged", { detail: id }));
  }, []);

  const project = projects?.find((p) => p.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId: selectProject,
    isLoading,
  };
}
