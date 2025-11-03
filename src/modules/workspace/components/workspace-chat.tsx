"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Paperclip,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  File,
  Loader2,
  Download,
  MoreVertical,
  Trash,
  Trash2,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Maximize2,
  Minimize2,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useWorkspaceChat } from "@/modules/workspace/hooks/use-workspace-chat";
import { useFileUpload } from "@/modules/workspace/hooks/use-file-upload";
import { useVoiceCall } from "@/modules/workspace/hooks/use-voice-call";
import {
  sendChatMessage,
  getChatMessages,
  getWorkspaceMembersForCall,
  deleteChatMessage,
} from "@/modules/workspace/actions/chat-actions";

interface WorkspaceChatProps {
  workspaceId: string;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface ChatMessage {
  id: string;
  userId: string | null;
  content: string;
  type: "TEXT" | "FILE" | "CODE" | "SYSTEM" | "AI_RESPONSE";
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentType?: string | null;
  attachmentSize?: number | null;
  deletedForEveryone?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export function WorkspaceChat({ workspaceId, currentUser }: WorkspaceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCaller, setIncomingCaller] = useState<{
    id: string;
    name: string;
    image?: string;
    offer?: RTCSessionDescriptionInit;
    callType?: "audio" | "video";
  } | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isVideoCallExpanded, setIsVideoCallExpanded] = useState(false);
  const [isVideoCallMinimized, setIsVideoCallMinimized] = useState(false);
  const [videoCallSize, setVideoCallSize] = useState({ width: 400, height: 300 });
  
  // Mention feature states
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionPosition, setMentionPosition] = useState(0);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  const { isConnected, onlineUsers, broadcastMessage, messages: broadcastMessages } =
    useWorkspaceChat(workspaceId);

  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  const {
    isInCall,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    isConnecting,
    callType,
    callParticipants,
    startCall,
    answerCall,
    endCall,
    cancelCall,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    handleCallSignal,
  } = useVoiceCall({
    workspaceId,
    currentUserId: currentUser?.id || "",
    currentUserName: currentUser?.name || "Unknown User",
    onIncomingCall: (caller) => {
      setIncomingCaller(caller);
      setShowIncomingCall(true);
      playRingtone();
      
      // Show browser notification for incoming call
      showNotification(
        "Incoming Call",
        `${caller.name} is calling...`
      );
    },
    broadcastSignal: broadcastMessage,
  });

  // Track visibility for notification purposes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsChatVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Safety check: if currentUser is not provided, show error message
  if (!currentUser || !currentUser.id) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-zinc-950">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Unable to load chat</h3>
          <p className="text-sm text-muted-foreground">
            Please sign in to access the workspace chat.
          </p>
        </div>
      </div>
    );
  }

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Load messages and team members on mount
  useEffect(() => {
    loadMessages();
    loadTeamMembers();
  }, [workspaceId]);

  const loadMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const fetchedMessages = await getChatMessages({ workspaceId });
      setMessages(fetchedMessages as any);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const members = await getWorkspaceMembersForCall(workspaceId);
      setTeamMembers(members as any);
    } catch (error) {
      console.error("Failed to load team members:", error);
    }
  };

  // Store handleCallSignal in a ref to avoid re-render loops
  const handleCallSignalRef = useRef(handleCallSignal);
  
  useEffect(() => {
    handleCallSignalRef.current = handleCallSignal;
  }, [handleCallSignal]);

  // Listen for new messages from broadcast and show notifications + sync messages
  useEffect(() => {
    if (broadcastMessages.length === 0) return;

    const latestMessage = broadcastMessages[broadcastMessages.length - 1];
    
    // Handle new messages
    if (latestMessage.type === "new_message") {
      const messageData = latestMessage.data;
      
      // Add message to local state if not already present and not from self
      if (messageData && messageData.id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === messageData.id);
          if (!exists && messageData.userId !== currentUser?.id) {
            return [...prev, messageData as ChatMessage];
          }
          return prev;
        });
      }
      
      // Show notification if message is from another user and chat is not visible
      if (
        latestMessage.userId !== currentUser?.id &&
        (!isChatVisible || document.hidden)
      ) {
        const messageContent = messageData?.content || "New message";
        const senderName = messageData?.senderName || "Someone";
        
        showNotification(
          `${senderName} sent a message`,
          messageContent
        );
        setUnreadCount((prev) => prev + 1);
      }
    }
    
    // Handle message deletion
    if (latestMessage.type === "message_deleted" && latestMessage.data) {
      const { messageId, deletedForEveryone } = latestMessage.data;
      if (deletedForEveryone) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, content: "[Message deleted]", deletedForEveryone: true } : m
          )
        );
      }
    }
    
    // Handle call signals using ref to avoid infinite loop
    if (latestMessage.type === "call_signal" && latestMessage.data) {
      // Handle call cancellation specifically
      if (latestMessage.data.type === "call-cancelled" && showIncomingCall) {
        stopRingtone();
        setShowIncomingCall(false);
        setIncomingCaller(null);
      }
      handleCallSignalRef.current(latestMessage.data);
    }
  }, [broadcastMessages, currentUser?.id, isChatVisible, showIncomingCall]);

  // Reset unread count when chat becomes visible
  useEffect(() => {
    if (isChatVisible) {
      setUnreadCount(0);
    }
  }, [isChatVisible]);

  // Auto-scroll to bottom when new messages arrive (with debounce to prevent loop)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages.length]); // Only depend on length, not the entire messages array

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Show browser notification
  const showNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body.substring(0, 100), // Limit to 100 chars
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "workspace-chat",
        requireInteraction: false,
      });
    }
  };

  // Play ringtone for incoming call
  const playRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch((err) => {
        console.error("Failed to play ringtone:", err);
      });
    }
  };

  // Stop ringtone
  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSendingMessage) return;

    const messageContent = inputMessage.trim();
    setInputMessage("");
    setIsSendingMessage(true);

    try {
      const message = await sendChatMessage({
        workspaceId,
        content: messageContent,
        type: "TEXT",
      });

      // Broadcast to other users via SSE with sender info
      await broadcastMessage("new_message", {
        ...message,
        senderName: currentUser.name,
        senderId: currentUser.id,
      });

      // Add to local state
      setMessages((prev) => [...prev, message as any]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      setInputMessage(messageContent); // Restore message
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId: string, deleteForEveryone: boolean = false) => {
    try {
      await deleteChatMessage({ messageId, deleteForEveryone });
      
      if (deleteForEveryone) {
        // Update message in local state to show as deleted
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, content: "[Message deleted]", deletedForEveryone: true } : m
          )
        );
        toast.success("Message deleted for everyone");
        
        // Broadcast deletion to other users
        await broadcastMessage("message_deleted", {
          messageId,
          deletedForEveryone: true,
        });
      } else {
        // Remove from local state only
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        toast.success("Message deleted for you");
      }
    } catch (error: any) {
      console.error("Failed to delete message:", error);
      toast.error(error.message || "Failed to delete message");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadResult = await uploadFile(file, workspaceId);
      if (!uploadResult) return;

      // Send message with attachment (use FILE type for all attachments)
      const message = await sendChatMessage({
        workspaceId,
        content: `Shared a file: ${file.name}`,
        type: "FILE",
        attachmentUrl: uploadResult.url,
        attachmentName: uploadResult.fileName,
        attachmentType: uploadResult.fileType,
        attachmentSize: uploadResult.fileSize,
      });

      // Broadcast with sender info
      await broadcastMessage("new_message", {
        ...message,
        senderName: currentUser.name,
        senderId: currentUser.id,
      });
      setMessages((prev) => [...prev, message as any]);
    } catch (error) {
      console.error("Failed to send file:", error);
      toast.error("Failed to send file");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle input change and detect @ mentions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    // Detect @ mention
    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);
      // Check if there's no space after @ (still typing the mention)
      if (!textAfterAt.includes(" ")) {
        setMentionSearch(textAfterAt.toLowerCase());
        setMentionPosition(lastAtSymbol);
        setShowMentionDropdown(true);
        
        // Filter members based on search
        const filtered = teamMembers.filter((member) =>
          member.name.toLowerCase().includes(textAfterAt.toLowerCase()) &&
          member.id !== currentUser?.id
        );
        setFilteredMembers(filtered);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Insert mention into message
  const insertMention = (member: TeamMember) => {
    const beforeMention = inputMessage.substring(0, mentionPosition);
    const afterMention = inputMessage.substring(mentionPosition + mentionSearch.length + 1);
    const newMessage = `${beforeMention}@${member.name} ${afterMention}`;
    setInputMessage(newMessage);
    setShowMentionDropdown(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Handle mention dropdown navigation
    if (showMentionDropdown) {
      if (e.key === "Escape") {
        setShowMentionDropdown(false);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        return; // Could add keyboard navigation through mentions
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!showMentionDropdown) {
        handleSendMessage();
      }
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Format message content with bold @mentions
  const formatMessageWithMentions = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="font-bold text-indigo-400">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.userId === currentUser.id;
    const isDeleted = message.deletedForEveryone;

    return (
      <div
        key={message.id}
        className={cn(
          "flex gap-3 mb-4 animate-fade-in group",
          isOwnMessage ? "justify-end" : "justify-start"
        )}
      >
        {!isOwnMessage && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={""} />
            <AvatarFallback className="text-xs">U</AvatarFallback>
          </Avatar>
        )}

        <div className="flex items-start gap-2 max-w-[70%]">
          <div
            className={cn(
              "rounded-2xl px-4 py-2 flex-1",
              isOwnMessage
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-700",
              isDeleted && "opacity-60 italic"
            )}
          >
          {/* Image Attachment */}
          {!isDeleted && message.type === "FILE" && message.attachmentUrl && message.attachmentType?.startsWith("image/") && (
            <div className="mb-2">
              <img
                src={message.attachmentUrl}
                alt={message.attachmentName || "Image"}
                className="rounded-lg max-w-full max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.attachmentUrl!, "_blank")}
              />
            </div>
          )}

          {/* File Attachment */}
          {!isDeleted && message.type === "FILE" && message.attachmentUrl && !message.attachmentType?.startsWith("image/") && (
              <a
                href={message.attachmentUrl}
                download={message.attachmentName}
                className={cn(
                  "flex items-center gap-3 mb-2 p-3 rounded-lg transition-colors",
                  isOwnMessage
                    ? "bg-indigo-700 hover:bg-indigo-800"
                    : "bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600"
                )}
              >
                <div className="w-10 h-10 rounded bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.attachmentName}
                  </p>
                  {message.attachmentSize && (
                    <p className="text-xs opacity-70">
                      {formatFileSize(message.attachmentSize)}
                    </p>
                  )}
                </div>
                <Download className="w-4 h-4 flex-shrink-0" />
              </a>
            )}

          {/* Message Content */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {formatMessageWithMentions(message.content)}
          </p>

          {/* Timestamp */}
          <span
            className={cn(
              "text-xs mt-1 block",
              isOwnMessage ? "text-indigo-100" : "text-gray-400 dark:text-gray-500"
            )}
          >
            {formatTimestamp(message.createdAt)}
          </span>
          </div>

          {/* Delete Menu - Only show if not deleted */}
          {!isDeleted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                    isOwnMessage
                      ? "text-white hover:bg-white/20"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700"
                  )}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
                <DropdownMenuItem
                  onClick={() => handleDeleteMessage(message.id, false)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete for me
                </DropdownMenuItem>
                {isOwnMessage && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteMessage(message.id, true)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete for everyone
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isOwnMessage && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={currentUser.image} />
            <AvatarFallback className="text-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <h2 className="text-xl font-semibold">Team Chat</h2>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-8 h-5 px-1.5 min-w-[20px] flex items-center justify-center text-xs font-bold animate-pulse"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className="gap-1.5"
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                )}
              />
              {isConnected ? "Connected" : "Connecting..."}
            </Badge>
            {onlineUsers.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {onlineUsers.size} online
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isInCall && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isConnecting}>
                    {isConnecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <div key={member.id} className="space-y-1">
                        <div className="flex items-center px-2 py-1.5 text-sm font-medium text-muted-foreground">
                          <Avatar className="w-6 h-6 mr-2">
                            <AvatarImage src={member.image} />
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                        <DropdownMenuItem
                          onClick={() =>
                            startCall({
                              id: member.id,
                              name: member.name,
                              image: member.image,
                            }, "audio")
                          }
                          className="pl-10"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Audio Call
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            startCall({
                              id: member.id,
                              name: member.name,
                              image: member.image,
                            }, "video")
                          }
                          className="pl-10"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Video Call
                        </DropdownMenuItem>
                      </div>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No members available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Active Call Banner - Microsoft Teams Style */}
      {isInCall && (
        <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 flex items-center justify-between border-b border-green-400 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-white font-semibold">Call in progress</span>
            </div>
            {callParticipants.length > 0 && (
              <div className="flex items-center gap-2">
                {callParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={participant.image} />
                      <AvatarFallback className="text-xs bg-white text-green-600">
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm font-medium">{participant.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mute Button */}
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleMute}
              className={cn(
                "gap-2",
                isMuted ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white/90 hover:bg-white text-green-600"
              )}
            >
              {isMuted ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Unmute
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Mute
                </>
              )}
            </Button>

            {/* Video Toggle Button - Only for video calls */}
            {callType === "video" && (
              <Button
                variant={isVideoEnabled ? "secondary" : "destructive"}
                size="sm"
                onClick={toggleVideo}
                className={cn(
                  "gap-2",
                  isVideoEnabled ? "bg-white/90 hover:bg-white text-green-600" : "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                {isVideoEnabled ? (
                  <>
                    <Video className="w-4 h-4" />
                    Camera On
                  </>
                ) : (
                  <>
                    <VideoOff className="w-4 h-4" />
                    Camera Off
                  </>
                )}
              </Button>
            )}

            {/* Screen Share Button - Only for video calls */}
            {callType === "video" && (
              <Button
                variant={isScreenSharing ? "destructive" : "secondary"}
                size="sm"
                onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                className={cn(
                  "gap-2",
                  isScreenSharing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white/90 hover:bg-white text-green-600"
                )}
              >
                {isScreenSharing ? (
                  <>
                    <MonitorOff className="w-4 h-4" />
                    Stop Sharing
                  </>
                ) : (
                  <>
                    <Monitor className="w-4 h-4" />
                    Share Screen
                  </>
                )}
              </Button>
            )}

            {/* Expand/Collapse Video - Only for video calls */}
            {callType === "video" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsVideoCallExpanded(!isVideoCallExpanded)}
                className="gap-2 bg-white/90 hover:bg-white text-green-600"
              >
                {isVideoCallExpanded ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    Minimize
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    Expand
                  </>
                )}
              </Button>
            )}

            {/* End Call Button */}
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={endCall}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-4 h-4" />
              End Call
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6 py-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <Send className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start a conversation with your team. Share ideas, files, and
                collaborate in real-time!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex-shrink-0 px-6 py-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Uploading file...</p>
                <span className="text-xs text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              <Progress value={uploadProgress} className="h-1.5" />
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-900">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.mp4,.mov"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message... (@mention someone)"
              className="pr-10 bg-gray-50 dark:bg-zinc-800"
              disabled={isSendingMessage || !isConnected}
            />
            
            {/* Mention Dropdown */}
            {showMentionDropdown && filteredMembers.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-full max-w-xs bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => insertMention(member)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-left"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.image} />
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {member.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={
              !inputMessage.trim() || isSendingMessage || !isConnected
            }
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isSendingMessage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      {/* Video Call UI - Only shown for video calls */}
      {(isInCall || isConnecting) && callType === "video" && !isVideoCallMinimized && (
        <div 
          className={cn(
            "fixed transition-all duration-300 bg-black/95 backdrop-blur-sm",
            isVideoCallExpanded 
              ? "inset-0 z-50" 
              : "bottom-4 right-4 rounded-xl overflow-hidden shadow-2xl border border-gray-700 z-40"
          )}
          style={!isVideoCallExpanded ? { 
            width: `${videoCallSize.width}px`, 
            height: `${videoCallSize.height}px`,
            minWidth: '320px',
            minHeight: '240px',
            maxWidth: 'calc(100vw - 320px)', // Leave space for sidebar
            maxHeight: 'calc(100vh - 100px)'
          } : undefined}
        >
          {/* Video Call Header */}
          <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">
                    {callParticipants[0]?.name || "Unknown"}
                  </span>
                </div>
                {isScreenSharing && (
                  <div className="flex items-center gap-1.5 bg-blue-600/90 px-2 py-1 rounded-md">
                    <Monitor className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-medium">Screen Sharing</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!isVideoCallExpanded && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:bg-white/20 text-white"
                    onClick={() => setIsVideoCallMinimized(true)}
                    title="Minimize"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 hover:bg-white/20 text-white"
                  onClick={() => setIsVideoCallExpanded(!isVideoCallExpanded)}
                  title={isVideoCallExpanded ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isVideoCallExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Remote Video (main video) */}
          <div className="relative w-full h-full bg-gray-900">
            <video 
              id="remote-video"
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
            
            {/* No video indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">
                  {isConnecting ? "Connecting..." : "Waiting for video..."}
                </p>
                {isConnecting && (
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mt-2" />
                )}
              </div>
            </div>
          </div>
          
          {/* Local Video (picture-in-picture) */}
          <div className={cn(
            "absolute bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-white/20 transition-all",
            isVideoCallExpanded
              ? "bottom-20 right-6 w-64 h-48"
              : "bottom-16 right-3 w-32 h-24"
          )}>
            <video 
              id="local-video"
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <VideoOff className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="absolute bottom-1 left-1 right-1 text-center">
              <span className="text-[10px] text-white/80 font-medium bg-black/50 px-1.5 py-0.5 rounded">
                You
              </span>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-3">
              <Button
                size={isVideoCallExpanded ? "default" : "sm"}
                variant={isMuted ? "destructive" : "secondary"}
                className={cn(
                  "rounded-full transition-all",
                  isVideoCallExpanded ? "h-12 w-12" : "h-10 w-10"
                )}
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <MicOff className={isVideoCallExpanded ? "w-5 h-5" : "w-4 h-4"} />
                ) : (
                  <Mic className={isVideoCallExpanded ? "w-5 h-5" : "w-4 h-4"} />
                )}
              </Button>

              <Button
                size={isVideoCallExpanded ? "default" : "sm"}
                variant={isVideoEnabled ? "secondary" : "destructive"}
                className={cn(
                  "rounded-full transition-all",
                  isVideoCallExpanded ? "h-12 w-12" : "h-10 w-10"
                )}
                onClick={toggleVideo}
                title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
              >
                {isVideoEnabled ? (
                  <Video className={isVideoCallExpanded ? "w-5 h-5" : "w-4 h-4"} />
                ) : (
                  <VideoOff className={isVideoCallExpanded ? "w-5 h-5" : "w-4 h-4"} />
                )}
              </Button>

              <Button
                size={isVideoCallExpanded ? "default" : "sm"}
                variant={isScreenSharing ? "default" : "secondary"}
                className={cn(
                  "rounded-full transition-all",
                  isVideoCallExpanded ? "h-12 w-12" : "h-10 w-10"
                )}
                onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
              >
                <Monitor className={isVideoCallExpanded ? "w-5 h-5" : "w-4 h-4"} />
              </Button>

              <Button
                size={isVideoCallExpanded ? "default" : "sm"}
                variant="destructive"
                className={cn(
                  "rounded-full transition-all",
                  isVideoCallExpanded ? "h-12 w-12" : "h-10 w-10"
                )}
                onClick={() => {
                  endCall();
                  setIsVideoCallExpanded(false);
                  setIsVideoCallMinimized(false);
                }}
                title="End Call"
              >
                <PhoneOff className={isVideoCallExpanded ? "w-5 h-5" : "w-4 h-4"} />
              </Button>
            </div>
          </div>

          {/* Resize Handle (only in windowed mode) */}
          {!isVideoCallExpanded && (
            <div
              className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize group"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = videoCallSize.width;
                const startHeight = videoCallSize.height;

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX;
                  const deltaY = e.clientY - startY;
                  setVideoCallSize({
                    width: Math.max(320, Math.min(startWidth + deltaX, window.innerWidth - 320)),
                    height: Math.max(240, Math.min(startHeight + deltaY, window.innerHeight - 100))
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-gray-400 group-hover:border-white transition-colors" />
            </div>
          )}
        </div>
      )}

      {/* Minimized Video Call Bar */}
      {(isInCall || isConnecting) && callType === "video" && isVideoCallMinimized && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            size="lg"
            className="rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 text-white px-6 gap-3"
            onClick={() => setIsVideoCallMinimized(false)}
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">
              {isConnecting ? "Calling" : "Video Call with"} {callParticipants[0]?.name}
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </Button>
        </div>
      )}

      {/* Hidden audio element for remote audio (for audio-only calls) */}
      <audio id="remote-audio" autoPlay />

      {/* Ringtone audio element */}
      <audio 
        ref={ringtoneRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyBzvLZiTYIGmi77eeeTRAMUKfj8LZjHAY4ktfyy3ksBSR3yPDekEALFF+06euoVRQLRp/g8r5sIQUsgs/y2Ik2CBlou+3mnk0QDFCn4/C2YxwGOJLX8st5LAUkd8jw3pBACxRftOnrp1UUC0af4PK+bCEFLILP8tmJNggZaLvt5p5NEAxQp+PwtmMcBjiS1/LLeSsFI3fI8N6QQAsUX7Tp66dVFQtHn+DyvmwhBSyBzvLYiTYIGWi77OaeThAMUKfj8LZjHAY4ktfyy3ksBSR3x/DekEALFF+06eunVRULR5/g8r5sIQUsgs/y2Ik2CBlou+zmnk4QDFCo4/C2YhwGOJHX8st5KwUkd8fw3pBACxRftOnrp1UVC0ef4PK+bCEFLILP8tiJNggZaLvs555OEAxQp+PwtmIcBjiS1/LLeSsFJHfH8N6QQAsUX7Tp66dVFQtHn+DyvmwhBSyCz/LYiTYIGWi77OaeTRAMUKfj8LZiHAY4ktfyy3ksBSR3yPDekEALFF+06OunVRULR5/g8r5sIQUsgs/y2Ik2CBlou+zmnk4QDFCn4/C1YhwGOJLX8st5LAUkd8jw3pBACxRftOjrp1UVC0ef4PK+ayEFLILP8tiJNggZZ7vs5p5OEAxQp+PwtWIcBjiS1/LLeSsFJHfI8N6QQAsUX7To66dVFQtHn+DyvisFLILP8tiJNggZaLvs5p5OEAxQp+PwtWIcBjiS1/LLeSsFJHfI8N6QQAsUXrTo66dVFQtHn+DyvmwhBSyCz/LYiTYIGWi77OaeTRAMUKfj8LZiHAY4ktfyy3ksBSR3yPDekEALFF+06OunVRULR5/g8r5sIQUsgs/y2Ik2CBlou+zmnk4QDFCn4/C2YhwGOJLX8st5LAUkd8jw3pBACxRftOjrp1UVC0ef4PK+bCEFLILP8tiJNggZaLvs5p5OEAxQp+PwtmIcBjiS1/LLeSsFI3fI8N6RQAsUX7To66dVFQtHn+DyvmwhBSyCz/LYiTYIGWi77OaeThAMUKfj8LZiHAY4ktfyy3ksBSN3yPDekEALFF+06OunVRULR5/g8r5sIQUsgs/y2Ik2CBlou+zmnk4QDFCn4/C2YhwGOJLX8st5LAUjd8jw3pFACxRftOjrp1UVC0ef4PK+bCEFLILP8tiJNggZaLvs5p5OEAxQp+PwtmIcBjiS1/LLeSsFI3fI8N6RQAsUX7To66dVFQtHn+DyvmwhBSyBz/LYiTYIGWi77OaeTRAMUKfj8LZiHAY4ktfyy3ksBSN3yPDekUALFF+06OunVRULR5/g8r5sIQUsgs/y2Ik2CBlou+zmnk4QDFCn4/C2YhwGOJLX8st5LAUjd8jw3pFACxRftOjrp1UVC0ef4PK+bCEFLILP8tiJNggZaLvs5p5OEAxQp+PwtmIcBjiS1/LLeSsFI3fI8N6RQAsUXrTo66dVFQtHn+DyvmwhBSyCz/LYiTYIGWi77OaeTRAMUKfj8LZiHAY4ktfyy3ksBSN3yPDekUALFF+06OunVRULR5/g8r5sIQUsgs/y2Ik2CBlou+zmnk4QDFCn4/C2YhwGOJLX8st5LAUjd8jw3pFACxRftOjrp1UVC0ef4PK+bCEFLILP8tiJNggZaLvs5p5OEAxQp+PwtmIcBjiS1/LLeSsFI3fI8N6RQAsUX7To66dVFQtHn+Dyvm"
        preload="auto"
      />

      {/* Outgoing Call Dialog - Calling... */}
      {isConnecting && !isInCall && !showIncomingCall && callParticipants.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              {/* Target User Avatar */}
              {callParticipants[0].image ? (
                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-500 ring-offset-2">
                  <AvatarImage src={callParticipants[0].image} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {callParticipants[0].name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg relative">
                  {/* Pulsing rings animation */}
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50 animation-delay-150"></div>
                  {callType === "video" ? (
                    <Video className="w-12 h-12 text-white animate-pulse relative z-10" />
                  ) : (
                    <Phone className="w-12 h-12 text-white animate-pulse relative z-10" />
                  )}
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">
                {callType === "video" ? "📹 Video Calling..." : "📞 Calling..."}
              </h3>
              <p className="text-muted-foreground mb-2 text-lg font-medium">
                {callParticipants[0].name}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Waiting for {callParticipants[0].name} to answer...
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm text-muted-foreground">Connecting...</span>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  cancelCall();
                }}
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                Cancel Call
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Incoming Call Dialog */}
      {showIncomingCall && incomingCaller && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="p-6 max-w-sm w-full mx-4 shadow-2xl animate-bounce-slow">
            <div className="text-center">
              {/* Caller Avatar */}
              {incomingCaller.image ? (
                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-green-500 ring-offset-2">
                  <AvatarImage src={incomingCaller.image} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    {incomingCaller.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg relative">
                  {/* Pulsing rings animation */}
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50 animation-delay-150"></div>
                  {incomingCaller.callType === "video" ? (
                    <Video className="w-12 h-12 text-white animate-pulse relative z-10" />
                  ) : (
                    <Phone className="w-12 h-12 text-white animate-pulse relative z-10" />
                  )}
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">
                {incomingCaller.callType === "video" ? "📹 Incoming Video Call" : "📞 Incoming Call"}
              </h3>
              <p className="text-muted-foreground mb-2 text-lg font-medium">
                {incomingCaller.name}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {incomingCaller.callType === "video" ? "wants to video call you" : "is calling you"}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    stopRingtone();
                    setShowIncomingCall(false);
                    setIncomingCaller(null);
                    toast.error(`❌ Call from ${incomingCaller.name} declined`);
                  }}
                >
                  Decline
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    stopRingtone();
                    if (incomingCaller.offer) {
                      answerCall(incomingCaller.offer as RTCSessionDescriptionInit, incomingCaller);
                    }
                    setShowIncomingCall(false);
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Answer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
