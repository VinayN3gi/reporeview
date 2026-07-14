import { api } from "@/trpc/react";
import { useState, useEffect, useCallback, useMemo } from "react";

export function useProject() {
  const { data: projects, isLoading } = api.project.getProjects.useQuery();
  const [rawProjectId, setRawProjectId] = useState<string | null>(null);

  // Initialize selected projectId from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedProjectId");
      if (saved) {
        setRawProjectId(saved);
      }
    }
  }, []);

  // Listen for storage changes from other hook instances (e.g. sidebar → dashboard)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "selectedProjectId" && e.newValue) {
        setRawProjectId(e.newValue);
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Custom event listener for same-tab cross-component sync
  useEffect(() => {
    function handleProjectChange(e: Event) {
      const customEvent = e as CustomEvent<string>;
      setRawProjectId(customEvent.detail);
    }
    window.addEventListener("projectChanged", handleProjectChange);
    return () => window.removeEventListener("projectChanged", handleProjectChange);
  }, []);

  // When projects load, auto-select the first project if the saved one is invalid.
  // Also clear stale localStorage entries when the project list is empty.
  useEffect(() => {
    if (!projects) return; // still loading

    if (projects.length === 0) {
      // No projects exist — clear any stale selection
      setRawProjectId(null);
      localStorage.removeItem("selectedProjectId");
      return;
    }

    if (!rawProjectId || !projects.some((p) => p.id === rawProjectId)) {
      const defaultId = projects[0]!.id;
      setRawProjectId(defaultId);
      localStorage.setItem("selectedProjectId", defaultId);
    }
  }, [projects, rawProjectId]);

  const selectProject = useCallback((id: string) => {
    setRawProjectId(id);
    localStorage.setItem("selectedProjectId", id);
    // Dispatch custom event so other hook instances in the same tab update
    window.dispatchEvent(new CustomEvent("projectChanged", { detail: id }));
  }, []);

  // Only expose a validated projectId — one that actually exists in the projects list.
  // While projects are still loading, return null to prevent queries with stale IDs.
  const projectId = useMemo(() => {
    if (!projects) return null; // projects still loading, don't trust localStorage
    if (rawProjectId && projects.some((p) => p.id === rawProjectId)) {
      return rawProjectId;
    }
    return null;
  }, [projects, rawProjectId]);

  const project = projects?.find((p) => p.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId: selectProject,
    isLoading,
  };
}
