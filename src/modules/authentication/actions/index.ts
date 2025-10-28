"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";

export const currentUser = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    // Try to find user in our database
    let user = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // If user doesn't exist in our DB, we might need to sync from Clerk
    // This is a safety check - ideally users should be synced via webhooks
    if (!user) {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const clerkUser = await (await clerkClient()).users.getUser(userId);
      
      // Create user in our database
      user = await db.user.create({
        data: {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "User",
          image: clerkUser.imageUrl,
          emailVerified: clerkUser.emailAddresses[0]?.verification?.status === "verified",
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    }

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};


