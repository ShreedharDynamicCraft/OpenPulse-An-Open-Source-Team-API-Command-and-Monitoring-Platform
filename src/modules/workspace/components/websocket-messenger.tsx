"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Wifi, WifiOff, Trash2, Copy, Download, Zap, Link2, CheckCircle2, XCircle, Loader2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface WebSocketMessage {
  id: string;
  direction: "sent" | "received";
  content: string;
  timestamp: Date;
  type: "text" | "json" | "binary";
}

interface WebSocketMessengerProps {
  workspaceId?: string;
}

export function WebSocketMessenger({ workspaceId }: WebSocketMessengerProps) {
  const [wsUrl, setWsUrl] = useState("ws://localhost:8080");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectWebSocket = () => {
    if (!wsUrl.trim()) {
      toast.error("Please enter a WebSocket URL");
      return;
    }

    if (isConnected || isConnecting) {
      return;
    }

    setIsConnecting(true);
    setConnectionStatus("connecting");

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionStatus("connected");
        toast.success("Connected to WebSocket server");
        
        // Add connection message
        addMessage({
          id: Date.now().toString(),
          direction: "received",
          content: "✓ Connected to server",
          timestamp: new Date(),
          type: "text",
        });
      };

      ws.onmessage = (event) => {
        addMessage({
          id: Date.now().toString() + Math.random(),
          direction: "received",
          content: event.data,
          timestamp: new Date(),
          type: typeof event.data === "string" && isJsonString(event.data) ? "json" : "text",
        });
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
        toast.error("WebSocket connection error");
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionStatus("disconnected");
        toast.info("Disconnected from WebSocket server");
        
        // Add disconnection message
        addMessage({
          id: Date.now().toString(),
          direction: "received",
          content: "✗ Disconnected from server",
          timestamp: new Date(),
          type: "text",
        });
      };

      wsRef.current = ws;
    } catch (error) {
      setIsConnecting(false);
      setConnectionStatus("error");
      toast.error("Failed to connect to WebSocket");
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }

    if (!isConnected || !wsRef.current) {
      toast.error("Not connected to WebSocket server");
      return;
    }

    try {
      wsRef.current.send(messageInput);
      
      addMessage({
        id: Date.now().toString(),
        direction: "sent",
        content: messageInput,
        timestamp: new Date(),
        type: isJsonString(messageInput) ? "json" : "text",
      });

      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const addMessage = (message: WebSocketMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    toast.success("Messages cleared");
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const exportMessages = () => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `websocket-messages-${Date.now()}.json`;
    a.click();
    toast.success("Messages exported");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isJsonString = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      case "error":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle2 className="h-4 w-4" />;
      case "connecting":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-zinc-900 overflow-hidden">
      {/* Header with Connection Controls */}
      <div className="flex-shrink-0 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/10 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-200">WebSocket Messenger</h2>
              <p className="text-xs text-zinc-500">Real-time bidirectional communication</p>
            </div>
          </div>
          
          <Badge variant="secondary" className={cn("text-xs border", getStatusColor())}>
            {getStatusIcon()}
            <span className="ml-2 capitalize">{connectionStatus}</span>
          </Badge>
        </div>

        {/* Connection Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="ws://localhost:8080 or wss://example.com"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              disabled={isConnected || isConnecting}
              className="pl-10 bg-zinc-800 border-zinc-700 focus:border-indigo-500 text-zinc-100"
            />
          </div>
          
          {isConnected ? (
            <Button
              onClick={disconnectWebSocket}
              variant="destructive"
              className="gap-2"
            >
              <WifiOff className="h-4 w-4" />
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={connectWebSocket}
              disabled={isConnecting}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wifi className="h-4 w-4" />
              )}
              Connect
            </Button>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {messages.length} messages
            </Badge>
            <Badge variant="outline" className="text-xs">
              {messages.filter(m => m.direction === "sent").length} sent
            </Badge>
            <Badge variant="outline" className="text-xs">
              {messages.filter(m => m.direction === "received").length} received
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
              className="gap-2 text-zinc-400 hover:text-zinc-200"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportMessages}
              disabled={messages.length === 0}
              className="gap-2 text-zinc-400 hover:text-zinc-200"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center py-12">
            <div className="bg-zinc-800/50 rounded-full p-6 mb-4 border border-zinc-700">
              <Zap className="h-12 w-12 text-zinc-500" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">No Messages Yet</h3>
            <p className="text-sm text-zinc-500 max-w-md">
              {isConnected 
                ? "Start sending messages to test your WebSocket connection"
                : "Connect to a WebSocket server to begin real-time communication"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onCopy={() => copyMessage(msg.content)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur px-6 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              placeholder={isConnected ? "Type a message..." : "Connect to start messaging..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
              className="min-h-[44px] bg-zinc-800 border-zinc-700 focus:border-indigo-500 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <Button
            onClick={sendMessage}
            disabled={!isConnected || !messageInput.trim()}
            size="icon"
            className="flex-shrink-0 h-11 w-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onCopy }: { message: WebSocketMessage; onCopy: () => void }) {
  const isSent = message.direction === "sent";
  const isJson = message.type === "json";

  let displayContent = message.content;
  if (isJson) {
    try {
      displayContent = JSON.stringify(JSON.parse(message.content), null, 2);
    } catch {
      // Keep original if parsing fails
    }
  }

  return (
    <div className={cn("flex gap-3 group", isSent ? "flex-row-reverse" : "flex-row")}>
      {/* Icon */}
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10 ring-2 ring-zinc-800">
          <AvatarFallback className={cn(
            "text-sm font-semibold",
            isSent 
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
              : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
          )}>
            {isSent ? "TX" : "RX"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-1 max-w-[70%]", isSent && "items-end")}>
        <div className={cn("flex items-baseline gap-2 text-xs px-1", isSent && "flex-row-reverse")}>
          <span className="font-semibold text-zinc-300">
            {isSent ? "Sent" : "Received"}
          </span>
          <span className="text-zinc-500 text-[11px]">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        
        <div className={cn(
          "rounded-2xl px-4 py-2.5 shadow-sm relative group/msg",
          isSent 
            ? "bg-indigo-600 text-white rounded-tr-sm" 
            : "bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-tl-sm"
        )}>
          {isJson ? (
            <pre className="text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto">
              <code>{displayContent}</code>
            </pre>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{displayContent}</p>
          )}

          {/* Copy Button */}
          <button
            onClick={onCopy}
            className={cn(
              "absolute top-2 right-2 opacity-0 group-hover/msg:opacity-100 transition-opacity p-1.5 rounded",
              isSent ? "bg-indigo-700 hover:bg-indigo-800" : "bg-zinc-700 hover:bg-zinc-600"
            )}
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>

        {isJson && (
          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
            JSON
          </Badge>
        )}
      </div>
    </div>
  );
}
