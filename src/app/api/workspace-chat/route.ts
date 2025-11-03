/**
 * Enhanced WebSocket/SSE route for real-time workspace chat
 * Supports: Message delivery, typing indicators, presence, voice call signaling
 */

import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// In-memory store for active connections (in production, use Redis)
const connections = new Map<
  string,
  Map<string, ReadableStreamDefaultController>
>();

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!workspaceId) {
    return new Response("Missing workspaceId", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Add connection to workspace
      if (!connections.has(workspaceId)) {
        connections.set(workspaceId, new Map());
      }
      connections.get(workspaceId)!.set(userId, controller);

      // Send initial connection message
      const data = `data: ${JSON.stringify({
        type: "connected",
        workspaceId,
        userId,
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Broadcast user joined
      broadcastToWorkspace(
        workspaceId,
        {
          type: "user_joined",
          userId,
          timestamp: new Date().toISOString(),
        },
        userId
      );

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Clean up on close
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        connections.get(workspaceId)?.delete(userId);

        // Broadcast user left
        broadcastToWorkspace(workspaceId, {
          type: "user_left",
          userId,
          timestamp: new Date().toISOString(),
        });

        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}

// POST endpoint for broadcasting messages
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { workspaceId, type, data } = body;

    if (!workspaceId) {
      return new Response("Missing workspaceId", { status: 400 });
    }

    // Broadcast message to all workspace members
    broadcastToWorkspace(workspaceId, {
      type,
      userId,
      data,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Broadcast error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

// Helper function to broadcast messages to all workspace members
function broadcastToWorkspace(
  workspaceId: string,
  message: any,
  excludeUserId?: string
) {
  const workspaceConnections = connections.get(workspaceId);
  if (!workspaceConnections) return;

  const encoder = new TextEncoder();
  const data = `data: ${JSON.stringify(message)}\n\n`;

  workspaceConnections.forEach((controller, connUserId) => {
    if (excludeUserId && connUserId === excludeUserId) return;

    try {
      controller.enqueue(encoder.encode(data));
    } catch (error) {
      // Connection closed, remove it
      workspaceConnections.delete(connUserId);
    }
  });
}
