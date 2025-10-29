/**
 * Server-Sent Events (SSE) for Real-Time Updates
 * Simpler alternative to WebSocket that works out of the box
 * Used for: Chat, Notifications, Presence
 */

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const workspaceId = req.nextUrl.searchParams.get('workspaceId');
  
  if (!workspaceId) {
    return new Response('Missing workspaceId', { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: 'connected', workspaceId })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
