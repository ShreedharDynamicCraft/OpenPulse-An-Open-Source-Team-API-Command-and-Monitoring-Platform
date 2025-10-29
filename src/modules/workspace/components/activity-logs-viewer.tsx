"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Code,
} from "lucide-react";
import { useActivityLogs } from "../hooks/use-chat";

interface ActivityLogsViewerProps {
  workspaceId: string;
}

export function ActivityLogsViewer({ workspaceId }: ActivityLogsViewerProps) {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useActivityLogs(workspaceId, {
    type: filterType as any,
    status: filterStatus,
  });

  const logs = data?.pages.flatMap((page) => page.logs) || [];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    const variant =
      status === "success"
        ? "default"
        : status === "failed"
        ? "destructive"
        : "secondary";

    return (
      <Badge variant={variant as any} className="ml-2">
        {status || "unknown"}
      </Badge>
    );
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      TEST_RUN: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      COLLECTION_RUN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      ERROR: "bg-red-500/20 text-red-400 border-red-500/30",
      SYSTEM: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
      DEPLOYMENT: "bg-green-500/20 text-green-400 border-green-500/30",
      BUILD: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      API_CALL: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    };
    return colors[type] || colors.SYSTEM;
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 shrink-0">
        <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>

        {/* Filters */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" onClick={() => setFilterType(undefined)}>
              All
            </TabsTrigger>
            <TabsTrigger value="test" onClick={() => setFilterType("TEST_RUN")}>
              Tests
            </TabsTrigger>
            <TabsTrigger value="collection" onClick={() => setFilterType("COLLECTION_RUN")}>
              Collections
            </TabsTrigger>
            <TabsTrigger value="error" onClick={() => setFilterType("ERROR")}>
              Errors
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 mt-3">
          <Button
            variant={filterStatus === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(undefined)}
          >
            All Status
          </Button>
          <Button
            variant={filterStatus === "success" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("success")}
          >
            Success
          </Button>
          <Button
            variant={filterStatus === "failed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("failed")}
          >
            Failed
          </Button>
        </div>
      </div>

      {/* Logs List */}
      <ScrollArea className="flex-1 min-h-0 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <Filter className="w-12 h-12 mb-4 opacity-50" />
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log: any) => (
              <Card
                key={log.id}
                className="p-4 bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getStatusIcon(log.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{log.title}</h3>
                      {getStatusBadge(log.status)}
                      <Badge className={`${getTypeColor(log.type)} border`}>
                        {log.type.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span>{log.userName}</span>
                      <span>•</span>
                      <span>
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                      {log.duration && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.duration}ms
                          </span>
                        </>
                      )}
                      {log.statusCode && (
                        <>
                          <span>•</span>
                          <span>Status: {log.statusCode}</span>
                        </>
                      )}
                    </div>

                    {/* Details */}
                    {log.details && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                          <Code className="w-3 h-3" />
                          View Details
                        </summary>
                        <pre className="mt-2 p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}

                    {/* Links */}
                    <div className="flex gap-2 mt-3">
                      {log.requestId && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Request
                        </Button>
                      )}
                      {log.collectionId && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Collection
                        </Button>
                      )}
                      {log.relatedChatId && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View in Chat
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {hasNextPage && (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
