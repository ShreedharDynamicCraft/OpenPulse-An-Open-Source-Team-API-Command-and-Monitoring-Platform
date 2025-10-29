"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
  analyzeTestResults,
  summarizeApiResponse,
  optimizeEndpoint,
  generateTestCasesFromSchema,
} from "@/lib/gemini-ai";

/**
 * Analyze test results and provide AI-powered suggestions
 */
export async function analyzeTestResultsAction(data: {
  workspaceId: string;
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
}) {
  const session = await auth();

  if (!session?.userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: data.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: { userId: session.userId },
          },
        },
      ],
    },
  });

  if (!workspace) {
    return { success: false, error: "Workspace not found or access denied" };
  }

  return await analyzeTestResults({
    testResults: data.testResults,
    context: data.context,
  });
}

/**
 * Generate plain English summary of API response
 */
export async function summarizeApiResponseAction(data: {
  workspaceId: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  responseBody: any;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  context?: string;
}) {
  const session = await auth();

  if (!session?.userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: data.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: { userId: session.userId },
          },
        },
      ],
    },
  });

  if (!workspace) {
    return { success: false, error: "Workspace not found or access denied" };
  }

  return await summarizeApiResponse({
    method: data.method,
    url: data.url,
    statusCode: data.statusCode,
    responseTime: data.responseTime,
    responseBody: data.responseBody,
    requestHeaders: data.requestHeaders,
    responseHeaders: data.responseHeaders,
    context: data.context,
  });
}

/**
 * Get AI-powered endpoint optimization tips
 */
export async function optimizeEndpointAction(data: {
  workspaceId: string;
  method: string;
  url: string;
  requestBody?: any;
  responseTime: number;
  statusCode: number;
  responseSize?: number;
  requestHeaders?: Record<string, string>;
  code?: string;
  context?: string;
}) {
  const session = await auth();

  if (!session?.userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: data.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: { userId: session.userId },
          },
        },
      ],
    },
  });

  if (!workspace) {
    return { success: false, error: "Workspace not found or access denied" };
  }

  return await optimizeEndpoint({
    method: data.method,
    url: data.url,
    requestBody: data.requestBody,
    responseTime: data.responseTime,
    statusCode: data.statusCode,
    responseSize: data.responseSize,
    requestHeaders: data.requestHeaders,
    code: data.code,
    context: data.context,
  });
}

/**
 * Auto-generate test cases from API schema or response
 */
export async function generateTestCasesFromSchemaAction(data: {
  workspaceId: string;
  endpoint: string;
  method: string;
  responseSchema?: any;
  sampleResponse?: any;
  requestSchema?: any;
  description?: string;
  numberOfTests?: number;
}) {
  const session = await auth();

  if (!session?.userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: data.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: { userId: session.userId },
          },
        },
      ],
    },
  });

  if (!workspace) {
    return { success: false, error: "Workspace not found or access denied" };
  }

  return await generateTestCasesFromSchema({
    endpoint: data.endpoint,
    method: data.method,
    responseSchema: data.responseSchema,
    sampleResponse: data.sampleResponse,
    requestSchema: data.requestSchema,
    description: data.description,
    numberOfTests: data.numberOfTests,
  });
}
