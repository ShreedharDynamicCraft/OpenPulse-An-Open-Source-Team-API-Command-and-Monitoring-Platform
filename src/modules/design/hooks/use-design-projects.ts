"use client";

import { useEffect, useState } from "react";
import { getDesignProjects } from "../actions/projects";

interface DesignProject {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  parentId: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    files: number;
    children: number;
  };
}

export function useDesignProjects(workspaceId: string | undefined) {
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getDesignProjects(workspaceId);
        
        if (result.success && result.projects) {
          setProjects(result.projects);
        } else {
          setError(result.error || "Failed to load projects");
        }
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [workspaceId]);

  const refresh = async () => {
    if (!workspaceId) return;
    
    try {
      const result = await getDesignProjects(workspaceId);
      if (result.success && result.projects) {
        setProjects(result.projects);
      }
    } catch (err) {
      console.error("Error refreshing projects:", err);
    }
  };

  return { projects, loading, error, refresh };
}
