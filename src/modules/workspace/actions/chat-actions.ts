"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function sendChatMessage({
  workspaceId,
  content,
  type = "TEXT",
  parentId,
  attachmentUrl,
  attachmentName,
  attachmentType,
  attachmentSize,
}: {
  workspaceId: string;
  content: string;
  type?: "TEXT" | "FILE" | "CODE" | "SYSTEM" | "AI_RESPONSE";
  parentId?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify user has access to workspace (either as owner or member)
  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
      OR: [
        { ownerId: userId },
        { members: { some: { userId: userId } } },
      ],
    },
  });

  if (!workspace) {
    throw new Error("Not a member of this workspace");
  }

  const message = await db.chatMessage.create({
    data: {
      workspaceId,
      userId,
      content,
      type,
      parentId,
      attachmentUrl,
      attachmentName,
      attachmentType,
      attachmentSize,
    },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
      parent: true,
      reactions: true,
    },
  });

  revalidatePath(`/workspace/${workspaceId}/chat`);

  return message;
}

export async function getChatMessages({
  workspaceId,
  limit = 50,
  cursor,
}: {
  workspaceId: string;
  limit?: number;
  cursor?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Verify user has access to workspace (either as owner or member)
  const workspace = await db.workspace.findFirst({
    where: {
      id: workspaceId,
      OR: [
        { ownerId: userId },
        { members: { some: { userId: userId } } },
      ],
    },
  });

  if (!workspace) {
    throw new Error("Not a member of this workspace");
  }

  const messages = await db.chatMessage.findMany({
    where: {
      workspaceId,
      deletedForEveryone: false,
    },
    take: limit,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
    orderBy: {
      createdAt: "desc",
    },
    include: {
      reactions: true,
      replies: {
        take: 3,
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  return messages.reverse();
}

export async function deleteChatMessage({
  messageId,
  deleteForEveryone = false,
}: {
  messageId: string;
  deleteForEveryone?: boolean;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const message = await db.chatMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  if (deleteForEveryone) {
    // Only message owner or workspace owner can delete for everyone
    if (message.userId !== userId) {
      const workspace = await db.workspace.findUnique({
        where: { id: message.workspaceId },
      });

      if (workspace?.ownerId !== userId) {
        throw new Error("Permission denied");
      }
    }

    await db.chatMessage.update({
      where: { id: messageId },
      data: {
        deletedForEveryone: true,
        content: "[Message deleted]",
      },
    });
  } else {
    // Delete for current user only
    const deletedForUsers = (message.deletedForUsers as string[]) || [];
    deletedForUsers.push(userId);

    await db.chatMessage.update({
      where: { id: messageId },
      data: {
        deletedForUsers,
      },
    });
  }

  revalidatePath(`/workspace/${message.workspaceId}/chat`);
}

export async function addMessageReaction({
  messageId,
  emoji,
}: {
  messageId: string;
  emoji: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if reaction already exists
  const existing = await db.messageReaction.findFirst({
    where: {
      messageId,
      userId,
      emoji,
    },
  });

  if (existing) {
    // Remove reaction
    await db.messageReaction.delete({
      where: { id: existing.id },
    });
  } else {
    // Add reaction
    await db.messageReaction.create({
      data: {
        messageId,
        userId,
        emoji,
      },
    });
  }

  const message = await db.chatMessage.findUnique({
    where: { id: messageId },
  });

  revalidatePath(`/workspace/${message?.workspaceId}/chat`);
}

export async function updateChatMessage({
  messageId,
  content,
}: {
  messageId: string;
  content: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const message = await db.chatMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.userId !== userId) {
    throw new Error("Permission denied");
  }

  const updated = await db.chatMessage.update({
    where: { id: messageId },
    data: {
      content,
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/workspace/${message.workspaceId}/chat`);

  return updated;
}

export async function getWorkspaceMembersForCall(workspaceId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get workspace with owner info
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      ownerId: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        where: {
          userId: {
            not: userId, // Exclude current user
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    return [];
  }

  // Combine owner and members, excluding current user and duplicates
  const allUsers = [];
  const seenIds = new Set<string>();
  
  // Add owner first (if not current user)
  if (workspace.ownerId !== userId) {
    allUsers.push(workspace.owner);
    seenIds.add(workspace.owner.id);
  }
  
  // Add members (excluding duplicates and current user)
  workspace.members.forEach((m: any) => {
    if (!seenIds.has(m.user.id)) {
      allUsers.push(m.user);
      seenIds.add(m.user.id);
    }
  });

  return allUsers;
}
