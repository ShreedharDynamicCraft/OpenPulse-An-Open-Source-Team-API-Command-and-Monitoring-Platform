"use server";

import db from "@/lib/db";
import { sendRequest } from "@/modules/request/actions";
import { logCollectionRun, logTestRun } from "@/modules/workspace/actions/activity-logs";
import { auth } from "@clerk/nextjs/server";

export interface BatchTestResult {
  requestId: string;
  requestName: string;
  method: string;
  url: string;
  status: "success" | "failed" | "pending";
  statusCode?: number;
  responseTime?: number;
  errorMessage?: string;
  response?: any;
}

export interface CollectionRunResult {
  collectionId: string;
  collectionName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalDuration: number;
  results: BatchTestResult[];
  startTime: Date;
  endTime: Date;
}

/**
 * Run all requests in a collection as a batch test
 */
export async function runCollectionBatch(
  workspaceId: string,
  collectionId: string,
  options?: {
    stopOnError?: boolean;
    delay?: number; // ms between requests
    parallel?: boolean; // Run tests in parallel
  }
): Promise<CollectionRunResult> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const startTime = new Date();

  // Get collection and all its requests
  const collection = await db.collection.findUnique({
    where: { id: collectionId },
    include: {
      requests: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  const results: BatchTestResult[] = [];
  let totalDuration = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;

  // Helper function to run a single request
  const runSingleRequest = async (request: any): Promise<BatchTestResult> => {
    const requestStartTime = Date.now();

    try {
      // Parse request data
      const headers = request.headers ? JSON.parse(JSON.stringify(request.headers)) : {};
      const params = request.parameters ? JSON.parse(JSON.stringify(request.parameters)) : {};
      const body = request.body ? JSON.parse(JSON.stringify(request.body)) : null;

      // Execute request
      const response = await sendRequest({
        method: request.method,
        url: request.url,
        headers,
        params,
        body,
      });

      const responseTime = Date.now() - requestStartTime;
      const statusCode = response.status || 0;
      const isSuccess = statusCode >= 200 && statusCode < 400;

      // Log individual test run
      await logTestRun({
        workspaceId,
        requestId: request.id,
        status: isSuccess ? "success" : "failed",
        statusCode,
        duration: responseTime,
        response: response.data,
      });

      return {
        requestId: request.id,
        requestName: request.name,
        method: request.method,
        url: request.url,
        status: isSuccess ? "success" : "failed",
        statusCode,
        responseTime,
        response: response.data,
      };
    } catch (error: any) {
      const responseTime = Date.now() - requestStartTime;

      // Log failed test
      await logTestRun({
        workspaceId,
        requestId: request.id,
        status: "failed",
        statusCode: 0,
        duration: responseTime,
        response: { error: error.message },
      });

      return {
        requestId: request.id,
        requestName: request.name,
        method: request.method,
        url: request.url,
        status: "failed",
        errorMessage: error.message,
        responseTime,
      };
    }
  };

  // Run tests based on options
  if (options?.parallel) {
    // Run all tests in parallel
    const promises = collection.requests.map((request) => runSingleRequest(request));
    results.push(...(await Promise.all(promises)));
  } else {
    // Run tests sequentially
    for (const request of collection.requests) {
      const result = await runSingleRequest(request);
      results.push(result);

      // Update counters
      if (result.status === "success") {
        passedTests++;
      } else if (result.status === "failed") {
        failedTests++;
        // Stop on first error if option is set
        if (options?.stopOnError) {
          skippedTests = collection.requests.length - results.length;
          break;
        }
      }

      totalDuration += result.responseTime || 0;

      // Add delay between requests if specified
      if (options?.delay && options.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, options.delay));
      }
    }
  }

  const endTime = new Date();

  // Calculate stats if parallel
  if (options?.parallel) {
    passedTests = results.filter((r) => r.status === "success").length;
    failedTests = results.filter((r) => r.status === "failed").length;
    totalDuration = results.reduce((sum, r) => sum + (r.responseTime || 0), 0);
  }

  // Log collection run
  await logCollectionRun({
    workspaceId,
    collectionId,
    status: failedTests === 0 ? "success" : "failed",
    totalTests: collection.requests.length,
    passedTests,
    failedTests,
    duration: totalDuration,
  });

  return {
    collectionId,
    collectionName: collection.name,
    totalTests: collection.requests.length,
    passedTests,
    failedTests,
    skippedTests,
    totalDuration,
    results,
    startTime,
    endTime,
  };
}

/**
 * Run multiple collections in sequence
 */
export async function runMultipleCollections(
  workspaceId: string,
  collectionIds: string[],
  options?: {
    stopOnError?: boolean;
    delay?: number;
  }
): Promise<CollectionRunResult[]> {
  const results: CollectionRunResult[] = [];

  for (const collectionId of collectionIds) {
    const result = await runCollectionBatch(workspaceId, collectionId, options);
    results.push(result);

    // Stop if any collection fails and stopOnError is true
    if (options?.stopOnError && result.failedTests > 0) {
      break;
    }

    // Add delay between collections
    if (options?.delay) {
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    }
  }

  return results;
}

/**
 * Get batch run history for a collection
 */
export async function getCollectionRunHistory(
  collectionId: string,
  limit: number = 10
) {
  const logs = await db.activityLog.findMany({
    where: {
      collectionId,
      type: "COLLECTION_RUN",
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs;
}
