import { useMutation } from "@tanstack/react-query";
import {
  analyzeTestResultsAction,
  summarizeApiResponseAction,
  optimizeEndpointAction,
  generateTestCasesFromSchemaAction,
} from "../actions/response-analysis";

/**
 * Hook to analyze test results with AI
 */
export function useAnalyzeTestResults(workspaceId: string) {
  return useMutation({
    mutationFn: async (data: {
      testResults: Array<{
        name: string;
        method: string;
        url: string;
        status: "success" | "failed" | "error";
        statusCode?: number;
        responseTime?: number;
        errorMessage?: string;
      }>;
      context?: string;
    }) => {
      const result = await analyzeTestResultsAction({
        workspaceId,
        ...data,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
  });
}

/**
 * Hook to get plain English summary of API response
 */
export function useSummarizeResponse(workspaceId: string) {
  return useMutation({
    mutationFn: async (data: {
      method: string;
      url: string;
      statusCode: number;
      responseTime: number;
      responseBody: any;
      requestHeaders?: Record<string, string>;
      responseHeaders?: Record<string, string>;
      context?: string;
    }) => {
      const result = await summarizeApiResponseAction({
        workspaceId,
        ...data,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
  });
}

/**
 * Hook to get endpoint optimization tips
 */
export function useOptimizeEndpoint(workspaceId: string) {
  return useMutation({
    mutationFn: async (data: {
      method: string;
      url: string;
      requestBody?: any;
      responseTime: number;
      statusCode: number;
      responseSize?: number;
      requestHeaders?: Record<string, string>;
      code?: string;
      context?: string;
    }) => {
      const result = await optimizeEndpointAction({
        workspaceId,
        ...data,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
  });
}

/**
 * Hook to auto-generate test cases from schema
 */
export function useGenerateTestsFromSchema(workspaceId: string) {
  return useMutation({
    mutationFn: async (data: {
      endpoint: string;
      method: string;
      responseSchema?: any;
      sampleResponse?: any;
      requestSchema?: any;
      description?: string;
      numberOfTests?: number;
    }) => {
      const result = await generateTestCasesFromSchemaAction({
        workspaceId,
        ...data,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return result;
    },
  });
}
