"use client";

import { useMutation } from "@tanstack/react-query";
import {
  generateEmpatheticReviewAction,
  reviewGitHubRepositoryAction,
  fetchGitHubRepoFiles,
} from "../actions/code-review";

/**
 * Hook for generating empathetic code reviews
 */
export function useEmpatheticReview(workspaceId: string) {
  return useMutation({
    mutationFn: async (data: {
      code: string;
      language: string;
      comments: string[];
      tone?: "gentle" | "balanced" | "direct";
      model?: "gemini-2.0-flash-exp";
    }) => {
      const result = await generateEmpatheticReviewAction({
        workspaceId,
        ...data,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to generate empathetic review");
      }

      return result;
    },
  });
}

/**
 * Hook for reviewing GitHub repositories
 */
export function useGitHubRepoReview(workspaceId: string) {
  return useMutation({
    mutationFn: async (data: {
      repoUrl: string;
      files: Array<{ path: string; content: string; language: string }>;
      tone?: "gentle" | "balanced" | "direct";
      model?: "gemini-2.0-flash-exp";
    }) => {
      const result = await reviewGitHubRepositoryAction({
        workspaceId,
        ...data,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to review GitHub repository");
      }

      return result;
    },
  });
}

/**
 * Hook for fetching GitHub repository files
 */
export function useFetchGitHubRepo(workspaceId: string) {
  return useMutation({
    mutationFn: async (data: { repoUrl: string }) => {
      const result = await fetchGitHubRepoFiles({
        workspaceId,
        ...data,
      });

      if (!result.success) {
        const error = "error" in result ? result.error : "Failed to fetch repository files";
        throw new Error(error);
      }

      return result;
    },
  });
}
