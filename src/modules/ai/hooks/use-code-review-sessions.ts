import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCodeReviewSession,
  updateCodeReviewSession,
  getCodeReviewSessions,
  getCodeReviewSessionsByProject,
  getCodeReviewSession,
  deleteCodeReviewSession,
  toggleSessionFavorite,
} from "../actions/code-review-sessions";
import { ReviewType, ReviewSessionType } from "@prisma/client";

export function useCodeReviewSessions(workspaceId: string) {
  return useQuery({
    queryKey: ["code-review-sessions", workspaceId],
    queryFn: () => getCodeReviewSessions(workspaceId),
  });
}

export function useCodeReviewSessionsByProject(projectId: string) {
  return useQuery({
    queryKey: ["code-review-sessions", "project", projectId],
    queryFn: () => getCodeReviewSessionsByProject(projectId),
    enabled: !!projectId,
  });
}

export function useCodeReviewSession(id: string) {
  return useQuery({
    queryKey: ["code-review-session", id],
    queryFn: () => getCodeReviewSession(id),
    enabled: !!id,
  });
}

export function useCreateCodeReviewSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      workspaceId: string;
      userId: string;
      projectId?: string;
      sessionType?: ReviewSessionType;
      reviewType: ReviewType;
      name: string;
      description?: string;
      code?: string;
      language?: string;
      filesPaths?: any;
      tone?: string;
      model: string;
      originalComments?: any;
      tags?: any;
      isFavorite?: boolean;
    }) => createCodeReviewSession(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["code-review-sessions", variables.workspaceId],
      });
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["code-review-sessions", "project", variables.projectId],
        });
      }
    },
  });
}

export function useUpdateCodeReviewSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
        code?: string;
        language?: string;
        tone?: string;
        model?: string;
        originalComments?: any;
        tags?: any;
        isFavorite?: boolean;
      };
    }) => updateCodeReviewSession(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["code-review-session", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["code-review-sessions", data.workspaceId],
      });
      if (data.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["code-review-sessions", "project", data.projectId],
        });
      }
    },
  });
}

export function useDeleteCodeReviewSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCodeReviewSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["code-review-sessions"],
      });
    },
  });
}

export function useToggleSessionFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      toggleSessionFavorite(id, isFavorite),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["code-review-session", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["code-review-sessions"],
      });
    },
  });
}
