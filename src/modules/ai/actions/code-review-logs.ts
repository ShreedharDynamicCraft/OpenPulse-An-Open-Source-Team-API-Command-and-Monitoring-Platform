"use server";

import db from "@/lib/db";

export async function createCodeReviewLog(data: {
  sessionId: string;
  response: string;
  model: string;
  tone?: string;
  duration: number;
  codeSnapshot?: string;
  commentsSnapshot?: any;
  status?: string;
  error?: string;
}) {
  return await db.codeReviewLog.create({
    data: {
      sessionId: data.sessionId,
      response: data.response,
      model: data.model,
      tone: data.tone,
      duration: data.duration,
      codeSnapshot: data.codeSnapshot,
      commentsSnapshot: data.commentsSnapshot,
      status: data.status || "success",
      error: data.error,
    },
    include: {
      session: {
        include: {
          project: true,
        },
      },
    },
  });
}

export async function getCodeReviewLogsBySession(sessionId: string) {
  return await db.codeReviewLog.findMany({
    where: { sessionId },
    include: {
      session: {
        include: {
          project: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecentCodeReviewLogs(workspaceId: string, limit = 20) {
  return await db.codeReviewLog.findMany({
    where: {
      session: {
        workspaceId,
      },
    },
    include: {
      session: {
        include: {
          project: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function deleteCodeReviewLog(id: string) {
  return await db.codeReviewLog.delete({
    where: { id },
  });
}
