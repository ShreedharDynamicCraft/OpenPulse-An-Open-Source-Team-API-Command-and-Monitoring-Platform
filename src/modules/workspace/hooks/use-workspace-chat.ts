"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface ChatMessage {
  type: string;
  userId?: string;
  data?: any;
  timestamp: string;
}

export function useWorkspaceChat(workspaceId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const eventSourceRef = useRef<EventSource | null>(null);

  // Connect to SSE endpoint
  useEffect(() => {
    if (!workspaceId) return;

    const connectSSE = () => {
      const eventSource = new EventSource(
        `/api/workspace-chat?workspaceId=${workspaceId}`
      );

      eventSource.onopen = () => {
        setIsConnected(true);
        console.log("✅ Connected to workspace chat");
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error("Failed to parse SSE message:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error for workspace:", workspaceId);
        console.error("EventSource readyState:", eventSource.readyState);
        
        // Only log and reconnect if actually disconnected
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("SSE connection closed, will attempt to reconnect...");
          setIsConnected(false);
          eventSource.close();
          
          // Reconnect after 3 seconds
          setTimeout(connectSSE, 3000);
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          console.log("SSE connecting...");
        }
      };

      eventSourceRef.current = eventSource;
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsConnected(false);
      }
    };
  }, [workspaceId]);

  const handleMessage = useCallback((message: ChatMessage) => {
    switch (message.type) {
      case "connected":
        setIsConnected(true);
        break;

      case "user_joined":
        setOnlineUsers((prev) => new Set(prev).add(message.userId!));
        break;

      case "user_left":
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(message.userId!);
          return updated;
        });
        break;

      case "new_message":
        setMessages((prev) => [...prev, message]);
        break;

      case "message_deleted":
        setMessages((prev) =>
          prev.filter((m) => m.data?.messageId !== message.data?.messageId)
        );
        break;

      case "message_updated":
        setMessages((prev) =>
          prev.map((m) =>
            m.data?.messageId === message.data?.messageId ? message : m
          )
        );
        break;

      case "typing":
        // Handle typing indicator
        break;

      case "call_signal":
        // Store call signal for voice call hook to process
        setMessages((prev) => [...prev, message]);
        break;

      default:
        console.log("Unknown message type:", message.type);
    }
  }, []);

  const broadcastMessage = useCallback(
    async (type: string, data: any) => {
      try {
        const response = await fetch("/api/workspace-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workspaceId,
            type,
            data,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          console.error("Broadcast failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
            type,
            workspaceId
          });
          // Don't throw for non-critical broadcasts (like typing indicators)
          if (type !== "typing" && type !== "call_signal") {
            throw new Error(`Failed to broadcast: ${response.status}`);
          }
        }
      } catch (error) {
        console.error("Broadcast error:", error);
        // Only show toast for critical message types
        if (type === "message" || type === "file") {
          toast.error("Failed to send message");
        }
      }
    },
    [workspaceId]
  );

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      broadcastMessage("typing", { isTyping });
    },
    [broadcastMessage]
  );

  return {
    isConnected,
    messages,
    onlineUsers,
    broadcastMessage,
    sendTypingIndicator,
  };
}
