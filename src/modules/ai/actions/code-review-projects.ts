"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function createCodeReviewProject(
  workspaceId: string,
  data: { name: string; description?: string }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify workspace membership
  const member = await db.workspaceMember.findFirst({
    where: { workspaceId, userId },
  });

  if (!member) throw new Error("Not a workspace member");

  const project = await db.codeReviewProject.create({
    data: {
      workspaceId,
      name: data.name,
      description: data.description,
      createdBy: userId,
    },
  });

  return project;
}

export async function getCodeReviewProjects(workspaceId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const projects = await db.codeReviewProject.findMany({
    where: { workspaceId },
    include: {
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function deleteCodeReviewProject(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const project = await db.codeReviewProject.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");

  // Verify membership
  const member = await db.workspaceMember.findFirst({
    where: { workspaceId: project.workspaceId, userId },
  });

  if (!member) throw new Error("Not authorized");

  await db.codeReviewProject.delete({
    where: { id: projectId },
  });

  return { success: true };
}
