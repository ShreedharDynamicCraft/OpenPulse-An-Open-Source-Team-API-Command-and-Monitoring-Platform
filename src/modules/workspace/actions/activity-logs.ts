"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { sendChatMessage } from "./chat";
import { revalidatePath } from "next/cache";

export type LogType = "TEST_RUN" | "COLLECTION_RUN" | "ERROR" | "SYSTEM" | "DEPLOYMENT" | "BUILD" | "API_CALL";

/**
 * Log an activity and optionally post to chat
 */
export async function logActivity(data: {
  workspaceId: string;
  type: LogType;
  title: string;
  details: Record<string, any>;
  status?: string;
  duration?: number;
  statusCode?: number;
  requestId?: string;
  collectionId?: string;
  postToChat?: boolean;
}) {
  try {
    const { userId } = await auth();

    // Create activity log
    const log = await db.activityLog.create({
      data: {
        workspaceId: data.workspaceId,
        userId: userId || undefined,
        type: data.type,
        title: data.title,
        details: data.details,
        status: data.status,
        duration: data.duration,
        statusCode: data.statusCode,
        requestId: data.requestId,
        collectionId: data.collectionId,
      },
    });

    // Post to chat if requested
    if (data.postToChat) {
      const statusEmoji = data.status === "success" ? "✅" : data.status === "failed" ? "❌" : "⚠️";
      
      let chatContent = `${statusEmoji} **${data.title}**\n\n`;
      
      if (data.statusCode) {
        chatContent += `Status: ${data.statusCode}\n`;
      }
      
      if (data.duration) {
        chatContent += `Duration: ${data.duration}ms\n`;
      }
      
      if (data.details) {
        chatContent += `\n\`\`\`json\n${JSON.stringify(data.details, null, 2)}\n\`\`\``;
      }

      await sendChatMessage({
        workspaceId: data.workspaceId,
        content: chatContent,
        type: "SYSTEM",
      });

      // Update log with chat reference
      await db.activityLog.update({
        where: { id: log.id },
        data: { relatedChatId: log.id }, // You might want to use the actual chat message ID
      });
    }

    revalidatePath(`/workspace/${data.workspaceId}/logs`);

    return { success: true, log };
  } catch (error: any) {
    console.error("Log activity error:", error);
    return { success: false, error: error.message || "Failed to log activity" };
  }
}

/**
 * Get activity logs for a workspace with pagination and filters
 */
export async function getActivityLogs(
  workspaceId: string,
  options: {
    cursor?: string;
    limit?: number;
    type?: LogType;
    userId?: string;
    status?: string;
  } = {}
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify membership
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: currentUserId,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this workspace" };
    }

    const limit = options.limit || 50;

    // Build where clause
    const where: any = {
      workspaceId: workspaceId,
    };

    if (options.type) {
      where.type = options.type;
    }

    if (options.userId) {
      where.userId = options.userId;
    }

    if (options.status) {
      where.status = options.status;
    }

    // Get logs
    const logs = await db.activityLog.findMany({
      where,
      take: limit + 1,
      ...(options.cursor && {
        cursor: {
          id: options.cursor,
        },
        skip: 1,
      }),
      orderBy: {
        createdAt: "desc",
      },
    });

    const hasMore = logs.length > limit;
    const logsToReturn = hasMore ? logs.slice(0, -1) : logs;

    // Get user info for each log
    const logsWithUserInfo = await Promise.all(
      logsToReturn.map(async (log) => {
        let userName = "System";

        if (log.userId) {
          const member = await db.workspaceMember.findFirst({
            where: {
              userId: log.userId,
              workspaceId: workspaceId,
            },
            include: {
              user: true,
            },
          });

          if (member) {
            userName = member.user.name;
          }
        }

        return {
          ...log,
          userName,
        };
      })
    );

    return {
      success: true,
      logs: logsWithUserInfo,
      nextCursor: hasMore ? logsToReturn[logsToReturn.length - 1].id : null,
    };
  } catch (error: any) {
    console.error("Get activity logs error:", error);
    return { success: false, error: error.message || "Failed to fetch activity logs" };
  }
}

/**
 * Helper to log test run completion
 */
export async function logTestRun(data: {
  workspaceId: string;
  requestId: string;
  status: "success" | "failed";
  statusCode: number;
  duration: number;
  response: any;
  postToChat?: boolean;
}) {
  return logActivity({
    workspaceId: data.workspaceId,
    type: "TEST_RUN",
    title: `Test run ${data.status === "success" ? "completed" : "failed"}`,
    details: {
      requestId: data.requestId,
      response: data.response,
    },
    status: data.status,
    duration: data.duration,
    statusCode: data.statusCode,
    requestId: data.requestId,
    postToChat: data.postToChat,
  });
}

/**
 * Helper to log collection run
 */
export async function logCollectionRun(data: {
  workspaceId: string;
  collectionId: string;
  status: "success" | "failed";
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  postToChat?: boolean;
}) {
  return logActivity({
    workspaceId: data.workspaceId,
    type: "COLLECTION_RUN",
    title: `Collection run ${data.status === "success" ? "completed" : "failed"}`,
    details: {
      total: data.totalTests,
      passed: data.passedTests,
      failed: data.failedTests,
    },
    status: data.status,
    duration: data.duration,
    collectionId: data.collectionId,
    postToChat: data.postToChat,
  });
}

/**
 * Delete an activity log
 */
export async function deleteActivityLog(logId: string, workspaceId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user is admin
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership || membership.role !== "ADMIN") {
      return { success: false, error: "Only admins can delete logs" };
    }

    await db.activityLog.delete({
      where: { id: logId },
    });

    revalidatePath(`/workspace/${workspaceId}/logs`);

    return { success: true };
  } catch (error: any) {
    console.error("Delete log error:", error);
    return { success: false, error: error.message || "Failed to delete log" };
  }
}
