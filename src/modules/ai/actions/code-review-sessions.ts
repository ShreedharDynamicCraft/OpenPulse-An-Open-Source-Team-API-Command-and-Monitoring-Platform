"use server";

import db from "@/lib/db";
import { ReviewType, ReviewSessionType } from "@prisma/client";

export async function createCodeReviewSession(data: {
  workspaceId: string;
  userId: string;
  projectId?: string;
  sessionType?: ReviewSessionType;
  reviewType: ReviewType;
  name: string;
  description?: string;
  code?: string;
  language?: string;
  filesPaths?: any;
  tone?: string;
  model: string;
  originalComments?: any;
  tags?: any;
  isFavorite?: boolean;
}) {
  return await db.codeReviewSession.create({
    data: {
      workspaceId: data.workspaceId,
      userId: data.userId,
      projectId: data.projectId,
      sessionType: data.sessionType || (data.projectId ? "PROJECT_BASED" : "STANDALONE"),
      reviewType: data.reviewType,
      name: data.name,
      description: data.description,
      code: data.code,
      language: data.language,
      filesPaths: data.filesPaths,
      tone: data.tone,
      model: data.model,
      originalComments: data.originalComments,
      tags: data.tags,
      isFavorite: data.isFavorite || false,
    },
    include: {
      project: true,
      logs: true,
    },
  });
}

export async function updateCodeReviewSession(
  id: string,
  data: {
    name?: string;
    description?: string;
    code?: string;
    language?: string;
    tone?: string;
    model?: string;
    originalComments?: any;
    tags?: any;
    isFavorite?: boolean;
  }
) {
  return await db.codeReviewSession.update({
    where: { id },
    data,
    include: {
      project: true,
      logs: true,
    },
  });
}

export async function getCodeReviewSessions(workspaceId: string) {
  return await db.codeReviewSession.findMany({
    where: { workspaceId },
    include: {
      project: true,
      _count: {
        select: { logs: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCodeReviewSessionsByProject(projectId: string) {
  return await db.codeReviewSession.findMany({
    where: { projectId },
    include: {
      project: true,
      _count: {
        select: { logs: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCodeReviewSession(id: string) {
  return await db.codeReviewSession.findUnique({
    where: { id },
    include: {
      project: true,
      logs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function deleteCodeReviewSession(id: string) {
  return await db.codeReviewSession.delete({
    where: { id },
  });
}

export async function toggleSessionFavorite(id: string, isFavorite: boolean) {
  return await db.codeReviewSession.update({
    where: { id },
    data: { isFavorite },
  });
}
