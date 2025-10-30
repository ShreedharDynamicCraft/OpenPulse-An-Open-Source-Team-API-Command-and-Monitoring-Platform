import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  sendChatMessage,
  getChatMessages,
  requestAICodeReview,
  addMessageReaction,
  removeMessageReaction,
  getMessageReplies,
  deleteMessageForMe,
  deleteMessageForEveryone,
} from "../actions/chat";
import { getActivityLogs } from "../actions/activity-logs";
import { useUser } from "@clerk/nextjs";

/**
 * Hook to fetch chat messages with infinite scroll
 */
export function useWorkspaceChat(workspaceId: string) {
  return useInfiniteQuery({
    queryKey: ["workspace-chat", workspaceId],
    queryFn: async ({ pageParam }) => {
      const result = await getChatMessages(workspaceId, pageParam, 50);
      if (!result.success) {
        throw new Error(result.error);
      }
      return {
        messages: result.messages || [],
        nextCursor: result.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });
}

/**
 * Hook to send a chat message
 */
export function useSendMessage(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      content: string;
      type?: "TEXT" | "CODE" | "FILE";
      codeLanguage?: string;
      parentId?: string;
      attachmentUrl?: string;
      attachmentName?: string;
      attachmentType?: string;
      attachmentSize?: number;
    }) => {
      const result = await sendChatMessage({
        workspaceId,
        ...data,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.message;
    },
    onSuccess: () => {
      // Invalidate and refetch chat messages
      queryClient.invalidateQueries({ queryKey: ["workspace-chat", workspaceId] });
    },
  });
}

/**
 * Hook to request AI code review
 */
export function useAICodeReview(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      code?: string;
      githubUrl?: string;
      language?: string;
      context?: string;
      type?: "review" | "explain" | "optimize" | "test";
      parentId?: string;
    }) => {
      const result = await requestAICodeReview({
        workspaceId,
        ...data,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return {
        userMessage: result.userMessage,
        aiMessage: result.aiMessage,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-chat", workspaceId] });
    },
  });
}

/**
 * Hook to add a reaction to a message
 */
export function useAddReaction(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { messageId: string; emoji: string }) => {
      const result = await addMessageReaction({
        messageId: data.messageId,
        emoji: data.emoji,
        workspaceId,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.reaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-chat", workspaceId] });
    },
  });
}

/**
 * Hook to remove a reaction from a message
 */
export function useRemoveReaction(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { messageId: string; emoji: string }) => {
      const result = await removeMessageReaction({
        messageId: data.messageId,
        emoji: data.emoji,
        workspaceId,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-chat", workspaceId] });
    },
  });
}

/**
 * Hook to get thread replies for a message
 */
export function useMessageReplies(messageId: string, workspaceId: string) {
  return useQuery({
    queryKey: ["message-replies", messageId],
    queryFn: async () => {
      const result = await getMessageReplies(messageId, workspaceId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.replies || [];
    },
    enabled: !!messageId,
  });
}

/**
 * Hook to fetch activity logs with infinite scroll
 */
export function useActivityLogs(
  workspaceId: string,
  options: {
    type?: "TEST_RUN" | "COLLECTION_RUN" | "ERROR" | "SYSTEM" | "DEPLOYMENT" | "BUILD" | "API_CALL";
    userId?: string;
    status?: string;
  } = {}
) {
  return useInfiniteQuery({
    queryKey: ["activity-logs", workspaceId, options],
    queryFn: async ({ pageParam }) => {
      const result = await getActivityLogs(workspaceId, {
        cursor: pageParam,
        limit: 50,
        ...options,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return {
        logs: result.logs || [],
        nextCursor: result.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

/**
 * Hook to get online workspace members (simulated)
 */
export function useOnlineUsers(workspaceId: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: ["online-users", workspaceId],
    queryFn: async () => {
      // In a real app, this would check presence via WebSocket or polling
      // For now, return current user as online
      return user ? [{ id: user.id, name: user.fullName || "You" }] : [];
    },
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

/**
 * Hook to delete a message for yourself only
 */
export function useDeleteMessageForMe(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { messageId: string }) => {
      const result = await deleteMessageForMe({
        workspaceId,
        messageId: data.messageId,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-chat", workspaceId] });
    },
  });
}

/**
 * Hook to delete a message for everyone (sender only)
 */
export function useDeleteMessageForEveryone(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { messageId: string }) => {
      const result = await deleteMessageForEveryone({
        workspaceId,
        messageId: data.messageId,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-chat", workspaceId] });
    },
  });
}
