"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Clock,
  Heart,
  Github,
  Loader2,
  Eye,
  Copy,
  Check,
  Brain,
  Code,
  Filter,
  TrendingUp,
} from "lucide-react";
import { useRecentCodeReviewLogs } from "../hooks/use-code-review-logs";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CodeReviewLogsProps {
  workspaceId: string;
}

export function CodeReviewLogs({ workspaceId }: CodeReviewLogsProps) {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: logs, isLoading } = useRecentCodeReviewLogs(workspaceId, 50);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMPATHETIC":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "GITHUB_REPO":
        return <Github className="w-4 h-4 text-purple-500" />;
      default:
        return <Code className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      EMPATHETIC: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      GITHUB_REPO: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      GENERAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return colors[type] || "bg-blue-500/20 text-blue-400 border-blue-500/30";
  };

  const handleViewDetails = (log: any) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Calculate stats
  const stats = {
    total: logs?.length || 0,
    empathetic: logs?.filter((l: any) => l.session?.reviewType === "EMPATHETIC").length || 0,
    github: logs?.filter((l: any) => l.session?.reviewType === "GITHUB_REPO").length || 0,
    avgDuration: logs && logs.length > 0 
      ? logs.reduce((acc: number, l: any) => acc + (l.duration || 0), 0) / logs.length 
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-indigo-500" />
          Code Review Activity Logs
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Reviews</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Brain className="w-8 h-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Empathetic</p>
                  <p className="text-2xl font-bold text-white">{stats.empathetic}</p>
                </div>
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">GitHub Repos</p>
                  <p className="text-2xl font-bold text-white">{stats.github}</p>
                </div>
                <Github className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Duration</p>
                  <p className="text-2xl font-bold text-white">{formatDuration(stats.avgDuration)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logs List */}
      <ScrollArea className="h-[600px] pr-4">{isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : logs.length === 0 ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Activity className="w-16 h-16 text-zinc-700 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
              <p className="text-gray-400 text-center">
                Start reviewing code to see your activity logs here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log: any) => (
              <Card
                key={log.id}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getTypeIcon(log.session?.reviewType)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-white text-sm">{log.session?.name || "Review"}</h3>
                        <Badge className={getTypeBadge(log.session?.reviewType)}>
                          {log.session?.reviewType?.replace("_", " ") || "GENERAL"}
                        </Badge>
                        {log.model && (
                          <Badge variant="outline" className="text-xs">
                            {log.model}
                          </Badge>
                        )}
                        {log.status && log.status !== "success" && (
                          <Badge variant="destructive" className="text-xs">
                            {log.status}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                        {log.duration && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {formatDuration(log.duration)}
                          </span>
                        )}
                        {log.session?.project && (
                          <span className="text-indigo-400">{log.session.project.name}</span>
                        )}
                      </div>

                      {log.session?.language && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {log.session.language}
                        </Badge>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(log)}
                          className="text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {selectedLog && getTypeIcon(selectedLog.reviewType)}
              Review Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedLog?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 mt-4">
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getTypeBadge(selectedLog.reviewType)}>
                  {selectedLog.reviewType}
                </Badge>
                {selectedLog.model && (
                  <Badge variant="outline">{selectedLog.model}</Badge>
                )}
                {selectedLog.tone && (
                  <Badge variant="secondary">Tone: {selectedLog.tone}</Badge>
                )}
                {selectedLog.language && (
                  <Badge variant="secondary">{selectedLog.language}</Badge>
                )}
              </div>

              {/* Original Code */}
              {selectedLog.code && (
                <div className="space-y-2">
                  <Label className="text-white font-semibold">Original Code</Label>
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => handleCopy(selectedLog.code)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <SyntaxHighlighter
                      language={selectedLog.language || "javascript"}
                      style={oneDark}
                      customStyle={{
                        borderRadius: "0.5rem",
                        maxHeight: "300px",
                      }}
                    >
                      {selectedLog.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {selectedLog.response && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white font-semibold">AI Review</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(selectedLog.response)}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none bg-zinc-800/50 p-4 rounded-lg">
                    <ReactMarkdown
                      components={{
                        code(props: any) {
                          const { inline, className, children, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark as any}
                              language={match[1]}
                              PreTag="div"
                              {...rest}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...rest}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {selectedLog.response}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
