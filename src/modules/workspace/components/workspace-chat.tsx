"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Code,
  Github,
  Loader2,
  Brain,
  MessageSquare,
  Smile,
  X,
} from "lucide-react";
import { useWorkspaceChat, useSendMessage, useAICodeReview, useAddReaction } from "../hooks/use-chat";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface WorkspaceChatProps {
  workspaceId: string;
}

interface Message {
  id: string;
  content: string;
  type: "TEXT" | "CODE" | "AI_RESPONSE" | "SYSTEM";
  codeLanguage?: string;
  userName?: string;
  userImage?: string;
  createdAt: string;
  aiResponse?: boolean;
  reactions?: Array<{ emoji: string; userId: string }>;
  _count?: {
    replies: number;
  };
}

type AIReviewType = "review" | "explain" | "optimize" | "test";

export function WorkspaceChat({ workspaceId }: WorkspaceChatProps) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiCode, setAiCode] = useState("");
  const [aiLanguage, setAiLanguage] = useState("typescript");
  const [aiGithubUrl, setAiGithubUrl] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [aiType, setAiType] = useState<AIReviewType>("review");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    error: chatError 
  } = useWorkspaceChat(workspaceId);
  
  const sendMessageMutation = useSendMessage(workspaceId);
  const aiReviewMutation = useAICodeReview(workspaceId);
  const addReactionMutation = useAddReaction(workspaceId);

  // Flatten all messages from pages
  const messages: Message[] = data?.pages.flatMap((page) => page.messages).reverse() || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    try {
      await sendMessageMutation.mutateAsync({
        content: message,
        type: "TEXT",
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleAIReview = async () => {
    if ((!aiCode && !aiGithubUrl) || aiReviewMutation.isPending) return;

    try {
      await aiReviewMutation.mutateAsync({
        code: aiCode || undefined,
        githubUrl: aiGithubUrl || undefined,
        language: aiLanguage,
        context: aiContext,
        type: aiType,
      });

      // Reset form
      setAiCode("");
      setAiGithubUrl("");
      setAiContext("");
      setShowAIPanel(false);
    } catch (error) {
      console.error("AI review failed:", error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await addReactionMutation.mutateAsync({ messageId, emoji });
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
        <div>
          <h2 className="text-lg font-semibold">Workspace Chat</h2>
          <p className="text-sm text-zinc-400">Collaborate with your team</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="flex-shrink-0"
        >
          <Brain className="w-4 h-4 mr-2" />
          AI Assistant
        </Button>
      </div>

      {/* AI Panel */}
      {showAIPanel && (
        <div className="flex-shrink-0 border-b border-zinc-800 bg-zinc-900 max-h-[400px] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIPanel(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3">
                <TabsTrigger value="code" onClick={() => setAiGithubUrl("")}>
                  <Code className="w-4 h-4 mr-2" />
                  Code Review
                </TabsTrigger>
                <TabsTrigger value="github" onClick={() => setAiCode("")}>
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="space-y-3 mt-0">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Review Type</label>
                  <select
                    value={aiType}
                    onChange={(e) => setAiType(e.target.value as AIReviewType)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="review">Code Review</option>
                    <option value="explain">Explain Code</option>
                    <option value="optimize">Optimize Code</option>
                    <option value="test">Generate Tests</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Language</label>
                  <Input
                    value={aiLanguage}
                    onChange={(e) => setAiLanguage(e.target.value)}
                    placeholder="typescript"
                    className="bg-zinc-800 border-zinc-700 text-sm h-9"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Code</label>
                  <Textarea
                    value={aiCode}
                    onChange={(e) => setAiCode(e.target.value)}
                    placeholder="Paste your code here..."
                    rows={6}
                    className="bg-zinc-800 border-zinc-700 font-mono text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Context (optional)</label>
                  <Input
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    placeholder="Additional context for AI..."
                    className="bg-zinc-800 border-zinc-700 text-sm h-9"
                  />
                </div>

                <Button
                  onClick={handleAIReview}
                  disabled={!aiCode || aiReviewMutation.isPending}
                  className="w-full"
                  size="sm"
                >
                  {aiReviewMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Get AI Review
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="github" className="space-y-3 mt-0">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">GitHub Repository URL</label>
                  <Input
                    value={aiGithubUrl}
                    onChange={(e) => setAiGithubUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="bg-zinc-800 border-zinc-700 text-sm h-9"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Context (optional)</label>
                  <Textarea
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    placeholder="What aspects should AI focus on?"
                    rows={4}
                    className="bg-zinc-800 border-zinc-700 text-xs resize-none"
                  />
                </div>

                <Button
                  onClick={handleAIReview}
                  disabled={!aiGithubUrl || aiReviewMutation.isPending}
                  className="w-full"
                  size="sm"
                >
                  {aiReviewMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Repository...
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4 mr-2" />
                      Review Repository
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : chatError ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-semibold">Error loading messages</p>
            <p className="text-sm">Please try again later</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-semibold">No messages yet</p>
            <p className="text-sm">Start a conversation with your team!</p>
          </div>
        ) : (
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {hasNextPage && (
                <Button
                  variant="ghost"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full text-sm"
                  size="sm"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load previous messages"
                  )}
                </Button>
              )}

              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  currentUserId={user?.id}
                  onReaction={handleReaction}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-zinc-800 bg-zinc-950">
        <div className="flex items-end gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            rows={2}
            className="flex-1 bg-zinc-900 border-zinc-700 resize-none text-sm"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            size="icon"
            className="h-[72px] w-12 flex-shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px]">Enter</kbd> to send,{" "}
          <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px]">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  currentUserId?: string;
  onReaction: (messageId: string, emoji: string) => void;
}

function MessageBubble({ message, currentUserId, onReaction }: MessageBubbleProps) {
  const isAI = message.aiResponse || message.type === "AI_RESPONSE";
  const isSystem = message.type === "SYSTEM";
  const [showReactions, setShowReactions] = useState(false);

  const reactions = ["👍", "❤️", "🧠", "🎉", "🔥"];

  // Group reactions by emoji
  const groupedReactions = message.reactions?.reduce((acc: Record<string, number>, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {}) || {};

  const handleReactionClick = (emoji: string) => {
    onReaction(message.id, emoji);
    setShowReactions(false);
  };

  return (
    <Card 
      className={`p-3 ${
        isAI 
          ? "bg-indigo-950/30 border-indigo-900" 
          : isSystem 
          ? "bg-amber-950/20 border-amber-900/30"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.userImage || undefined} />
          <AvatarFallback className={
            isAI ? "bg-indigo-600 text-white" : 
            isSystem ? "bg-amber-600 text-white" : 
            "bg-zinc-700 text-zinc-300"
          }>
            {isAI ? "🤖" : isSystem ? "⚙️" : (message.userName?.[0]?.toUpperCase() || "?")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm">
              {isAI ? "AI Assistant" : isSystem ? "System" : message.userName || "Unknown User"}
            </span>
            {isAI && (
              <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full font-medium">
                Gemini
              </span>
            )}
            {isSystem && (
              <span className="text-[10px] bg-amber-600 px-2 py-0.5 rounded-full font-medium">
                Auto
              </span>
            )}
            <span className="text-xs text-zinc-500">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Message Content */}
          {message.type === "CODE" && message.codeLanguage ? (
            <div className="mt-2">
              <SyntaxHighlighter 
                language={message.codeLanguage || "typescript"} 
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  background: "#1a1a1a",
                }}
                showLineNumbers
              >
                {message.content}
              </SyntaxHighlighter>
            </div>
          ) : (isAI || message.type === "AI_RESPONSE") ? (
            <div className="prose prose-invert prose-sm max-w-none mt-2">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter 
                        language={match[1]} 
                        style={vscDarkPlus} 
                        PreTag="div"
                        customStyle={{
                          margin: "0.5rem 0",
                          borderRadius: "0.5rem",
                          fontSize: "0.75rem",
                          background: "#1a1a1a",
                        }}
                        showLineNumbers
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-zinc-800 px-1 py-0.5 rounded text-xs" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-sm space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-sm space-y-1">{children}</ol>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-zinc-600 pl-4 my-2 text-zinc-400">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          )}

          {/* Reactions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {Object.entries(groupedReactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs transition-colors"
              >
                <span>{emoji}</span>
                <span className="text-zinc-400">{count as number}</span>
              </button>
            ))}

            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1 hover:bg-zinc-800 rounded-full transition-colors"
              title="Add reaction"
            >
              <Smile className="w-4 h-4 text-zinc-400" />
            </button>

            {showReactions && (
              <div className="flex gap-1 ml-2">
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReactionClick(emoji)}
                    className="text-lg hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reply count */}
          {message._count?.replies && message._count.replies > 0 && (
            <button className="text-xs text-indigo-400 hover:underline mt-2 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {message._count.replies} {message._count.replies === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}