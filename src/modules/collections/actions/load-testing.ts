"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { sendRequest } from "@/modules/request/actions";
import { logTestRun } from "@/modules/workspace/actions/activity-logs";

export interface LoadTestConfig {
  workspaceId: string;
  requestId: string;
  numberOfRequests: number; // Total requests to send
  concurrentUsers?: number; // Simultaneous requests (default: 1)
  rampUpTime?: number; // Milliseconds to gradually increase load
  delayBetweenRequests?: number; // Milliseconds between each request
  timeout?: number; // Request timeout in milliseconds
}

export interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  totalDuration: number;
  results: Array<{
    requestNumber: number;
    status: "success" | "failed" | "timeout";
    statusCode?: number;
    responseTime: number;
    timestamp: number;
    errorMessage?: string;
  }>;
  rateLimitDetected: boolean;
  rateLimitInfo?: {
    firstDetectedAt: number;
    count: number;
    headers?: Record<string, string>;
  };
}

export async function runLoadTest(
  config: LoadTestConfig
): Promise<LoadTestResult> {
  const session = await auth();

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  // Get request details
  const request = await db.request.findUnique({
    where: { id: config.requestId },
    include: { collection: true },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  const startTime = Date.now();
  const results: LoadTestResult["results"] = [];
  const responseTimes: number[] = [];
  
  let rateLimitDetected = false;
  let rateLimitInfo: LoadTestResult["rateLimitInfo"];

  const concurrentUsers = config.concurrentUsers || 1;
  const requestsPerBatch = Math.ceil(config.numberOfRequests / concurrentUsers);

  // Run load test
  for (let batch = 0; batch < concurrentUsers; batch++) {
    const batchPromises: Promise<void>[] = [];

    for (let i = 0; i < requestsPerBatch; i++) {
      const requestNumber = batch * requestsPerBatch + i + 1;
      if (requestNumber > config.numberOfRequests) break;

      // Ramp-up delay
      const rampUpDelay = config.rampUpTime
        ? (config.rampUpTime / config.numberOfRequests) * requestNumber
        : 0;

      const requestPromise = (async () => {
        if (rampUpDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, rampUpDelay));
        }

        const requestStartTime = Date.now();

        try {
          const response = await sendRequest({
            method: request.method,
            url: request.url,
            headers: (request.headers as any) || {},
            body: request.body,
          });

          const responseTime = Date.now() - requestStartTime;
          responseTimes.push(responseTime);

          const statusCode = response.status || 0;
          const isSuccess = statusCode >= 200 && statusCode < 400;

          // Detect rate limiting (429 or 503)
          if (statusCode === 429 || statusCode === 503) {
            if (!rateLimitDetected) {
              rateLimitDetected = true;
              rateLimitInfo = {
                firstDetectedAt: requestNumber,
                count: 1,
                headers: (response.headers as any) || {},
              };
            } else if (rateLimitInfo) {
              rateLimitInfo.count++;
            }
          }

          results.push({
            requestNumber,
            status: isSuccess ? "success" : "failed",
            statusCode,
            responseTime,
            timestamp: requestStartTime,
          });

          // Log to activity
          await logTestRun({
            workspaceId: config.workspaceId,
            requestId: config.requestId,
            status: isSuccess ? "success" : "failed",
            statusCode,
            duration: responseTime,
            response: response.data,
          });
        } catch (error: any) {
          const responseTime = Date.now() - requestStartTime;

          results.push({
            requestNumber,
            status: error.message?.includes("timeout") ? "timeout" : "failed",
            responseTime,
            timestamp: requestStartTime,
            errorMessage: error.message,
          });
        }

        // Delay between requests
        if (config.delayBetweenRequests && requestNumber < config.numberOfRequests) {
          await new Promise((resolve) =>
            setTimeout(resolve, config.delayBetweenRequests)
          );
        }
      })();

      batchPromises.push(requestPromise);
    }

    // Wait for batch to complete before starting next batch
    if (concurrentUsers === 1) {
      await Promise.all(batchPromises);
    }
  }

  // If concurrent, wait for all
  if (concurrentUsers > 1) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay to ensure all complete
  }

  const totalDuration = Date.now() - startTime;
  const successfulRequests = results.filter((r) => r.status === "success").length;
  const failedRequests = results.filter((r) => r.status === "failed").length;

  const avgResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
  const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
  const requestsPerSecond = (config.numberOfRequests / totalDuration) * 1000;

  return {
    totalRequests: config.numberOfRequests,
    successfulRequests,
    failedRequests,
    averageResponseTime: avgResponseTime,
    minResponseTime,
    maxResponseTime,
    requestsPerSecond,
    totalDuration,
    results,
    rateLimitDetected,
    rateLimitInfo,
  };
}
