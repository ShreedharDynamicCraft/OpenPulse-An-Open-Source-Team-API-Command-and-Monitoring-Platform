"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDesignProject(data: {
  name: string;
  description?: string;
  workspaceId: string;
  parentId?: string;
}) {
  try {
    const { userId } = await auth();
    
    console.log("=== CREATE DESIGN PROJECT DEBUG ===");
    console.log("User ID:", userId);
    console.log("Data:", data);
    
    if (!userId) {
      console.error("No user ID found");
      return { success: false, error: "Unauthorized - please sign in" };
    }

    // Verify user has access to workspace
    const member = await db.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId: data.workspaceId,
      },
    });

    console.log("Workspace member:", member);

    if (!member) {
      console.error("User is not a member of workspace");
      return { success: false, error: "Not a member of this workspace" };
    }

    console.log("Creating design project...");
    const project = await db.designProject.create({
      data: {
        name: data.name,
        description: data.description,
        workspaceId: data.workspaceId,
        parentId: data.parentId,
        createdById: userId,
      },
    });

    console.log("Project created:", project);
    revalidatePath("/design");
    return { success: true, project };
  } catch (error) {
    console.error("Error creating design project:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create project";
    return { success: false, error: errorMessage };
  }
}

export async function getDesignProjects(workspaceId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const projects = await db.designProject.findMany({
      where: {
        workspaceId,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, projects };
  } catch (error) {
    console.error("Error fetching design projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function updateDesignProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const project = await db.designProject.update({
      where: { id: projectId },
      data,
    });

    revalidatePath("/design");
    return { success: true, project };
  } catch (error) {
    console.error("Error updating design project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteDesignProject(projectId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.designProject.update({
      where: { id: projectId },
      data: { isDeleted: true },
    });

    revalidatePath("/design");
    return { success: true };
  } catch (error) {
    console.error("Error deleting design project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
