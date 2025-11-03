"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FormattedMessageProps {
  content: string;
  role: "user" | "assistant";
}

// Component to format and display message content
function FormattedMessage({ content, role }: FormattedMessageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Parse and format the message content
  const formatContent = (text: string) => {
    const parts: React.ReactElement[] = [];
    let lastIndex = 0;
    let keyCounter = 0;

    // Match code blocks with ```language or ```
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index);
        parts.push(
          <span key={`text-${keyCounter++}`}>
            {formatInlineContent(textBefore)}
          </span>
        );
      }

      // Add code block
      const language = match[1] || "text";
      const code = match[2].trim();
      const codeId = `code-${keyCounter}`;

      parts.push(
        <div key={`code-${keyCounter++}`} className="my-3 relative group">
          <div className="flex items-center justify-between bg-zinc-800 dark:bg-zinc-900 px-3 py-1.5 rounded-t-lg border border-zinc-700">
            <span className="text-xs font-medium text-zinc-400">{language}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(code, codeId)}
              className="h-6 px-2 text-xs hover:bg-zinc-700"
            >
              {copiedCode === codeId ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-zinc-900 dark:bg-black p-3 rounded-b-lg overflow-x-auto border border-t-0 border-zinc-700">
            <code className="text-sm text-zinc-100 font-mono">{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {formatInlineContent(remainingText)}
        </span>
      );
    }

    return parts.length > 0 ? parts : formatInlineContent(text);
  };

  // Format inline content (bold, links, inline code)
  const formatInlineContent = (text: string) => {
    // Process line by line to handle newlines
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      const lineParts: (string | React.ReactElement)[] = [];
      let localKey = 0;

      // Match URLs - make them clickable
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let lastUrlIndex = 0;
      let urlMatch;

      while ((urlMatch = urlRegex.exec(line)) !== null) {
        // Add text before URL
        if (urlMatch.index > lastUrlIndex) {
          const textBefore = line.substring(lastUrlIndex, urlMatch.index);
          lineParts.push(...formatInlineStyles(textBefore, `${lineIndex}-${localKey++}`));
        }

        // Add clickable link
        const url = urlMatch[0];
        lineParts.push(
          <a
            key={`url-${lineIndex}-${localKey++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium"
          >
            {url}
            <ExternalLink className="w-3 h-3" />
          </a>
        );

        lastUrlIndex = urlMatch.index + urlMatch[0].length;
      }

      // Add remaining text after last URL
      if (lastUrlIndex < line.length) {
        lineParts.push(...formatInlineStyles(line.substring(lastUrlIndex), `${lineIndex}-${localKey++}`));
      }

      // If no URLs were found, process the whole line
      if (lineParts.length === 0) {
        lineParts.push(...formatInlineStyles(line, `${lineIndex}-${localKey++}`));
      }

      // Add line break except for last line
      return (
        <span key={`line-${lineIndex}`}>
          {lineParts}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  // Format inline styles (bold, inline code)
  const formatInlineStyles = (text: string, baseKey: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let remaining = text;
    let keyCounter = 0;

    // Match inline code `code`
    const inlineCodeRegex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = inlineCodeRegex.exec(remaining)) !== null) {
      // Add text before inline code
      if (match.index > lastIndex) {
        const textBefore = remaining.substring(lastIndex, match.index);
        parts.push(...formatBold(textBefore, `${baseKey}-${keyCounter++}`));
      }

      // Add inline code
      parts.push(
        <code
          key={`inline-code-${baseKey}-${keyCounter++}`}
          className="bg-zinc-800 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-400"
        >
          {match[1]}
        </code>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < remaining.length) {
      parts.push(...formatBold(remaining.substring(lastIndex), `${baseKey}-${keyCounter++}`));
    }

    return parts.length > 0 ? parts : formatBold(text, baseKey);
  };

  // Format bold text **text**
  const formatBold = (text: string, baseKey: string): (string | React.ReactElement)[] => {
    const parts: (string | React.ReactElement)[] = [];
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add bold text
      parts.push(
        <strong key={`bold-${baseKey}-${keyCounter++}`} className="font-bold text-gray-900 dark:text-white">
          {match[1]}
        </strong>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return <div className="text-sm leading-relaxed">{formatContent(content)}</div>;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your OpenPulse AI assistant. I can help you understand our platform features, answer questions about API testing, provide coding guidance, and more. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || "Failed to get response");
      }

      if (!data.message) {
        throw new Error("No response from AI");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      
      // Show user-friendly error toast
      if (error.message?.includes("API key") || error.message?.includes("configuration")) {
        toast.error("AI service not configured. Please contact support.");
      } else if (error.message?.includes("quota")) {
        toast.error("Service temporarily unavailable. Please try again later.");
      } else {
        toast.error(error.message || "Failed to send message. Please try again.");
      }
      
      // Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: `I apologize, but I encountered an error: ${error.message || "Unknown error"}. Please try again or contact support if the issue persists.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 z-50 group"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl border-2 border-indigo-200 dark:border-indigo-800 z-50 flex flex-col bg-white dark:bg-zinc-900 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">OpenPulse AI</h3>
                <p className="text-xs text-indigo-100">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-950">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white ml-auto"
                      : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-700"
                  )}
                >
                  <FormattedMessage content={message.content} role={message.role} />
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user"
                        ? "text-indigo-100"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-zinc-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              Powered by Gemini 2.0 Flash ✨
            </p>
          </div>
        </Card>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
