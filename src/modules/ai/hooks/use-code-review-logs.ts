import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCodeReviewLog,
  getCodeReviewLogsBySession,
  getRecentCodeReviewLogs,
  deleteCodeReviewLog,
} from "../actions/code-review-logs";

export function useCodeReviewLogsBySession(sessionId: string) {
  return useQuery({
    queryKey: ["code-review-logs", "session", sessionId],
    queryFn: () => getCodeReviewLogsBySession(sessionId),
    enabled: !!sessionId,
  });
}

export function useRecentCodeReviewLogs(workspaceId: string, limit = 20) {
  return useQuery({
    queryKey: ["code-review-logs", "recent", workspaceId, limit],
    queryFn: () => getRecentCodeReviewLogs(workspaceId, limit),
  });
}

export function useCreateCodeReviewLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      sessionId: string;
      response: string;
      model: string;
      tone?: string;
      duration: number;
      codeSnapshot?: string;
      commentsSnapshot?: any;
      status?: string;
      error?: string;
    }) => createCodeReviewLog(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["code-review-logs", "session", data.sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["code-review-logs", "recent"],
      });
      queryClient.invalidateQueries({
        queryKey: ["code-review-session", data.sessionId],
      });
    },
  });
}

export function useDeleteCodeReviewLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCodeReviewLog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["code-review-logs"],
      });
    },
  });
}
