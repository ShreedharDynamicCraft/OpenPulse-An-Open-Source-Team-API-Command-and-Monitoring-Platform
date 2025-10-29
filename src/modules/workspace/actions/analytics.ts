"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import type { ActivityLog } from "@prisma/client";

export interface AnalyticsData {
  totalRequests: number;
  successCount: number;
  failedCount: number;
  requestsLast24h: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalCollections: number;
  activeCollections: number;
  methodBreakdown: Record<string, number>;
  responseTimeTrend: Array<{ date: string; avgTime: number }>;
  topCollections: Array<{
    id: string;
    name: string;
    requestCount: number;
    successRate: number;
  }>;
}

export async function getAnalytics(
  workspaceId: string
): Promise<AnalyticsData> {
  const session = await auth();

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
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
    throw new Error("Workspace not found or access denied");
  }

  // Get all activity logs for this workspace
  const logs = await db.activityLog.findMany({
    where: {
      workspaceId,
      type: {
        in: ["TEST_RUN", "COLLECTION_RUN"],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate metrics
  const totalRequests = logs.length;
  const successCount = logs.filter((log: ActivityLog) => log.status === "success").length;
  const failedCount = totalRequests - successCount;

  // Last 24h requests
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  const requestsLast24h = logs.filter(
    (log: ActivityLog) => log.createdAt >= yesterday
  ).length;

  // Response times
  const responseTimes = logs
    .map((log: ActivityLog) => log.duration || 0)
    .filter((time: number) => time > 0);
  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
      : 0;
  const minResponseTime =
    responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  const maxResponseTime =
    responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

  // Collections
  const collections = await db.collection.findMany({
    where: { workspaceId },
    include: { requests: true },
  });
  const totalCollections = collections.length;
  const activeCollections = collections.filter(
    (c: any) => c.requests.length > 0
  ).length;

  // Method breakdown
  const methodBreakdown: Record<string, number> = {};
  logs.forEach((log: ActivityLog) => {
    const method = (log.details as any)?.method || "UNKNOWN";
    methodBreakdown[method] = (methodBreakdown[method] || 0) + 1;
  });

  // Response time trend (last 7 days)
  const responseTimeTrend: Array<{ date: string; avgTime: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayLogs = logs.filter((log: ActivityLog) => {
      const logDate = log.createdAt.toISOString().split("T")[0];
      return logDate === dateStr;
    });

    const dayTimes = dayLogs
      .map((log: ActivityLog) => log.duration || 0)
      .filter((time: number) => time > 0);

    const avgTime =
      dayTimes.length > 0
        ? dayTimes.reduce((a: number, b: number) => a + b, 0) / dayTimes.length
        : 0;

    responseTimeTrend.push({ date: dateStr, avgTime });
  }

  // Top collections
  const collectionStats = collections.map((collection: any) => {
    const collectionLogs = logs.filter(
      (log: ActivityLog) => log.collectionId === collection.id
    );
    const successLogs = collectionLogs.filter(
      (log: ActivityLog) => log.status === "success"
    );
    const successRate =
      collectionLogs.length > 0
        ? (successLogs.length / collectionLogs.length) * 100
        : 0;

    return {
      id: collection.id,
      name: collection.name,
      requestCount: collectionLogs.length,
      successRate,
    };
  });

  const topCollections = collectionStats
    .sort((a, b) => b.requestCount - a.requestCount)
    .slice(0, 5);

  return {
    totalRequests,
    successCount,
    failedCount,
    requestsLast24h,
    averageResponseTime,
    minResponseTime,
    maxResponseTime,
    totalCollections,
    activeCollections,
    methodBreakdown,
    responseTimeTrend,
    topCollections,
  };
}
