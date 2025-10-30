"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { reviewCode, reviewGitHubRepo, generateChatResponse, CodeReviewRequest, GitHubReviewRequest } from "@/lib/gemini-ai";
import { revalidatePath } from "next/cache";

/**
 * Send a chat message to a workspace
 */
export async function sendChatMessage(data: {
  workspaceId: string;
  content: string;
  type?: "TEXT" | "CODE" | "FILE";
  codeLanguage?: string;
  parentId?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: number;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await currentUser();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify user is a member of the workspace
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this workspace" };
    }

    // Create the message
    const message = await db.chatMessage.create({
      data: {
        workspaceId: data.workspaceId,
        userId: userId,
        content: data.content,
        type: data.type || "TEXT",
        codeLanguage: data.codeLanguage,
        parentId: data.parentId,
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        attachmentType: data.attachmentType,
        attachmentSize: data.attachmentSize,
      },
      include: {
        reactions: true,
      },
    });

    revalidatePath(`/workspace/${data.workspaceId}`);

    return {
      success: true,
      message: {
        ...message,
        userName: user.fullName || user.username || "Anonymous",
        userImage: user.imageUrl,
      },
    };
  } catch (error: any) {
    console.error("Send message error:", error);
    return { success: false, error: error.message || "Failed to send message" };
  }
}

/**
 * Get chat messages for a workspace with pagination
 */
export async function getChatMessages(workspaceId: string, cursor?: string, limit: number = 50) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify membership
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this workspace" };
    }

    // Get messages
    const messages = await db.chatMessage.findMany({
      where: {
        workspaceId: workspaceId,
        parentId: null, // Only root messages, not replies
        deletedForEveryone: false, // Don't show messages deleted for everyone
      },
      take: limit + 1, // Take one more to check if there are more pages
      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1, // Skip the cursor
      }),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        reactions: true,
        replies: {
          take: 3, // Preview first 3 replies
          orderBy: {
            createdAt: "asc",
          },
          include: {
            reactions: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    // Filter out messages deleted for this user
    const filteredMessages = messages.filter((msg) => {
      const deletedForUsers = (msg.deletedForUsers as string[]) || [];
      return !deletedForUsers.includes(userId);
    });

    // Check if there are more pages
    const hasMore = filteredMessages.length > limit;
    const messagesToReturn = hasMore ? filteredMessages.slice(0, -1) : filteredMessages;

    // Get user info for each message
    const messagesWithUserInfo = await Promise.all(
      messagesToReturn.map(async (msg) => {
        let userName = "System";
        let userImage = null;

        if (msg.userId) {
          try {
            // In a real app, you'd fetch from Clerk or cache user data
            // For now, we'll use cached data from Workspace members
            const member = await db.workspaceMember.findFirst({
              where: {
                userId: msg.userId,
                workspaceId: workspaceId,
              },
              include: {
                user: true,
              },
            });

            if (member) {
              userName = member.user.name;
              userImage = member.user.image;
            }
          } catch (e) {
            console.error("Error fetching user:", e);
          }
        }

        return {
          ...msg,
          userName,
          userImage,
        };
      })
    );

    return {
      success: true,
      messages: messagesWithUserInfo,
      nextCursor: hasMore ? messagesToReturn[messagesToReturn.length - 1].id : null,
    };
  } catch (error: any) {
    console.error("Get messages error:", error);
    return { success: false, error: error.message || "Failed to fetch messages" };
  }
}

/**
 * Request AI code review
 */
export async function requestAICodeReview(data: {
  workspaceId: string;
  code?: string;
  githubUrl?: string;
  language?: string;
  context?: string;
  type?: "review" | "explain" | "optimize" | "test";
  parentId?: string; // If replying to a message
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await currentUser();
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify membership
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this workspace" };
    }

    let aiResponse;
    let userPrompt = "";

    if (data.code) {
      // Code snippet review
      const request: CodeReviewRequest = {
        code: data.code,
        language: data.language,
        context: data.context,
        type: data.type || "review",
      };

      aiResponse = await reviewCode(request);
      userPrompt = `Code ${data.type || "review"} request:\n\`\`\`${data.language || ""}\n${data.code.slice(0, 200)}${data.code.length > 200 ? "..." : ""}\n\`\`\``;
    } else if (data.githubUrl) {
      // GitHub repo review
      const request: GitHubReviewRequest = {
        repoUrl: data.githubUrl,
        context: data.context,
      };

      aiResponse = await reviewGitHubRepo(request);
      userPrompt = `GitHub repository review request: ${data.githubUrl}`;
    } else {
      return { success: false, error: "Either code or githubUrl must be provided" };
    }

    if (!aiResponse.success) {
      return { success: false, error: aiResponse.error };
    }

    // Create user's request message
    const userMessage = await db.chatMessage.create({
      data: {
        workspaceId: data.workspaceId,
        userId: userId,
        content: userPrompt,
        type: data.code ? "CODE" : "TEXT",
        codeLanguage: data.language,
        githubUrl: data.githubUrl,
        parentId: data.parentId,
      },
    });

    // Create AI response message
    const aiMessage = await db.chatMessage.create({
      data: {
        workspaceId: data.workspaceId,
        userId: null, // System message
        content: aiResponse.content!,
        type: "AI_RESPONSE",
        aiResponse: true,
        aiModel: aiResponse.model,
        aiPrompt: userPrompt,
        parentId: userMessage.id, // Reply to user's question
      },
      include: {
        reactions: true,
      },
    });

    revalidatePath(`/workspace/${data.workspaceId}`);

    return {
      success: true,
      userMessage: {
        ...userMessage,
        userName: user.fullName || user.username || "Anonymous",
        userImage: user.imageUrl,
      },
      aiMessage: {
        ...aiMessage,
        userName: "AI Assistant",
        userImage: null,
      },
    };
  } catch (error: any) {
    console.error("AI review error:", error);
    return { success: false, error: error.message || "Failed to generate AI review" };
  }
}

/**
 * Add a reaction to a message
 */
export async function addMessageReaction(data: {
  messageId: string;
  emoji: string;
  workspaceId: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify the message exists and user has access
    const message = await db.chatMessage.findFirst({
      where: {
        id: data.messageId,
        workspaceId: data.workspaceId,
      },
    });

    if (!message) {
      return { success: false, error: "Message not found" };
    }

    // Add reaction (upsert to handle duplicates)
    const reaction = await db.messageReaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId: data.messageId,
          userId: userId,
          emoji: data.emoji,
        },
      },
      create: {
        messageId: data.messageId,
        userId: userId,
        emoji: data.emoji,
      },
      update: {},
    });

    revalidatePath(`/workspace/${data.workspaceId}`);

    return { success: true, reaction };
  } catch (error: any) {
    console.error("Add reaction error:", error);
    return { success: false, error: error.message || "Failed to add reaction" };
  }
}

/**
 * Remove a reaction from a message
 */
export async function removeMessageReaction(data: {
  messageId: string;
  emoji: string;
  workspaceId: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await db.messageReaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId: data.messageId,
          userId: userId,
          emoji: data.emoji,
        },
      },
    });

    revalidatePath(`/workspace/${data.workspaceId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Remove reaction error:", error);
    return { success: false, error: error.message || "Failed to remove reaction" };
  }
}

/**
 * Get thread replies for a message
 */
export async function getMessageReplies(messageId: string, workspaceId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify membership
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this workspace" };
    }

    const replies = await db.chatMessage.findMany({
      where: {
        parentId: messageId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        reactions: true,
      },
    });

    // Get user info for each reply
    const repliesWithUserInfo = await Promise.all(
      replies.map(async (reply) => {
        let userName = "System";
        let userImage = null;

        if (reply.userId) {
          const member = await db.workspaceMember.findFirst({
            where: {
              userId: reply.userId,
              workspaceId: workspaceId,
            },
            include: {
              user: true,
            },
          });

          if (member) {
            userName = member.user.name;
            userImage = member.user.image;
          }
        }

        return {
          ...reply,
          userName,
          userImage,
        };
      })
    );

    return { success: true, replies: repliesWithUserInfo };
  } catch (error: any) {
    console.error("Get replies error:", error);
    return { success: false, error: error.message || "Failed to fetch replies" };
  }
}

/**
 * Delete message for myself (only hides it from my view)
 */
export async function deleteMessageForMe(data: { workspaceId: string; messageId: string }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify membership
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this workspace" };
    }

    // Get the message
    const message = await db.chatMessage.findUnique({
      where: { id: data.messageId },
    });

    if (!message) {
      return { success: false, error: "Message not found" };
    }

    // Add user ID to deletedForUsers array
    const deletedForUsers = (message.deletedForUsers as string[]) || [];
    if (!deletedForUsers.includes(userId)) {
      deletedForUsers.push(userId);
    }

    await db.chatMessage.update({
      where: { id: data.messageId },
      data: {
        deletedForUsers: deletedForUsers,
      },
    });

    revalidatePath(`/workspace/${data.workspaceId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete message for me error:", error);
    return { success: false, error: error.message || "Failed to delete message" };
  }
}

/**
 * Delete message for everyone (permanently removes it)
 * Only the message sender can do this
 */
export async function deleteMessageForEveryone(data: { workspaceId: string; messageId: string }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify membership
    const membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: data.workspaceId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this workspace" };
    }

    // Get the message and verify ownership
    const message = await db.chatMessage.findUnique({
      where: { id: data.messageId },
    });

    if (!message) {
      return { success: false, error: "Message not found" };
    }

    if (message.userId !== userId) {
      return { success: false, error: "You can only delete your own messages" };
    }

    // Mark as deleted for everyone
    await db.chatMessage.update({
      where: { id: data.messageId },
      data: {
        deletedForEveryone: true,
        content: "This message was deleted",
      },
    });

    revalidatePath(`/workspace/${data.workspaceId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete message for everyone error:", error);
    return { success: false, error: error.message || "Failed to delete message" };
  }
}
