import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCodeReviewProject,
  getCodeReviewProjects,
  deleteCodeReviewProject,
} from "../actions/code-review-projects";

export function useCodeReviewProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["code-review-projects", workspaceId],
    queryFn: () => getCodeReviewProjects(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createCodeReviewProject(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["code-review-projects", workspaceId] });
    },
  });
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteCodeReviewProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["code-review-projects", workspaceId] });
    },
  });
}
