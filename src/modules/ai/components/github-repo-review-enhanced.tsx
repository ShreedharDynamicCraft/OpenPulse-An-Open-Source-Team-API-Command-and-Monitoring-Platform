"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Github, Sparkles, Loader2, Copy, Check, FileCode, AlertCircle, Search, Brain } from "lucide-react";
import { useGitHubRepoReview, useFetchGitHubRepo } from "../hooks/use-code-review";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { createCodeReviewLog } from "../actions/code-review-logs";
import { createCodeReviewSession } from "../actions/code-review-sessions";
import { CodeReviewSessionSelector } from "./code-review-session-selector";
import { useCodeReviewSession } from "../hooks/use-code-review-sessions";
import { toast } from "sonner";

interface GitHubRepoReviewEnhancedProps {
  workspaceId: string;
  userId: string;
  selectedProject?: string | null;
}

export function GitHubRepoReviewEnhanced({ workspaceId, userId, selectedProject }: GitHubRepoReviewEnhancedProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [repoUrl, setRepoUrl] = useState("");
  const [availableFiles, setAvailableFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [tone, setTone] = useState<"gentle" | "balanced" | "direct">("balanced");
  const model = "gemini-2.0-flash-exp";
  const [copied, setCopied] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const fetchRepo = useFetchGitHubRepo(workspaceId);
  const reviewRepo = useGitHubRepoReview(workspaceId);
  const { data: session } = useCodeReviewSession(selectedSessionId);

  // Load session data when selected
  useEffect(() => {
    if (session) {
      if (session.filesPaths && Array.isArray(session.filesPaths)) {
        const paths = session.filesPaths as string[];
        setSelectedFiles(new Set(paths));
      }
      if (session.tone) setTone(session.tone as any);
      // Extract repo URL from description or use a default
      if (session.description && session.description.includes("http")) {
        const urlMatch = session.description.match(/https:\/\/github\.com\/[^\s]+/);
        if (urlMatch) setRepoUrl(urlMatch[0]);
      }
    }
  }, [session]);

  const handleFetchFiles = async () => {
    if (!repoUrl) {
      toast.error("Please enter a repository URL");
      return;
    }

    try {
      const result = await fetchRepo.mutateAsync({ repoUrl });
      setAvailableFiles(result.files || []);
      setSelectedFiles(new Set());
      toast.success(`Found ${result.files?.length || 0} files`);
    } catch (error) {
      toast.error("Failed to fetch repository files");
      console.error("Failed to fetch files:", error);
    }
  };

  const handleToggleFile = (filePath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filePath)) {
      newSelected.delete(filePath);
    } else {
      if (newSelected.size >= 10) {
        toast.error("Maximum 10 files allowed per review");
        return;
      }
      newSelected.add(filePath);
    }
    setSelectedFiles(newSelected);
  };

  const handleGenerateReview = async () => {
    if (selectedFiles.size === 0) {
      toast.error("Please select at least one file to review");
      return;
    }

    try {
      const validFiles = availableFiles.filter(file => selectedFiles.has(file.path));
      if (validFiles.length === 0) {
        toast.error("Failed to fetch file contents");
        return;
      }

      // Create or update session
      let sessionId = selectedSessionId;
      if (!sessionId) {
        // Create a new standalone session
        try {
          const repoName = repoUrl.split("/").pop() || "GitHub Repo";
          const newSession = await createCodeReviewSession({
            workspaceId,
            userId,
            projectId: selectedProject || undefined,
            reviewType: "GITHUB_REPO",
            name: `GitHub Review - ${repoName}`,
            description: `Repository: ${repoUrl}\nFiles: ${selectedFiles.size} selected`,
            language: "multiple",
            filesPaths: Array.from(selectedFiles),
            tone,
            model,
          });
          sessionId = newSession.id;
          setSelectedSessionId(sessionId);
        } catch (error) {
          toast.error("Failed to create session");
          return;
        }
      }

      setStartTime(Date.now());
      reviewRepo.mutate({
        repoUrl,
        files: validFiles,
        tone,
        model,
      });
    } catch (error) {
      toast.error("Failed to generate review");
      console.error("Review generation failed:", error);
    }
  };

  // Save to logs
  useEffect(() => {
    if (reviewRepo.data && "content" in reviewRepo.data && reviewRepo.data.content && startTime && selectedSessionId) {
      const duration = Date.now() - startTime;
      
      createCodeReviewLog({
        sessionId: selectedSessionId,
        response: reviewRepo.data.content,
        model,
        tone,
        duration,
        codeSnapshot: `Repository: ${repoUrl}\nFiles: ${Array.from(selectedFiles).join(", ")}`,
        status: "success",
      }).then(() => {
        toast.success("Review saved to session history");
      }).catch((error) => {
        console.error("Failed to save review log:", error);
      });
      
      setStartTime(null);
    }
  }, [reviewRepo.data, selectedSessionId]);

  const handleCopy = () => {
    if (reviewRepo.data && "content" in reviewRepo.data && reviewRepo.data.content) {
      navigator.clipboard.writeText(reviewRepo.data.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Selector */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-zinc-900 dark:text-white text-lg">Review Session</CardTitle>
              <CardDescription>
                Select an existing session or create a new one to track your reviews
              </CardDescription>
            </div>
            <CodeReviewSessionSelector
              workspaceId={workspaceId}
              userId={userId}
              reviewType="GITHUB_REPO"
              onSessionSelect={setSelectedSessionId}
              selectedSessionId={selectedSessionId}
            />
          </div>
        </CardHeader>
      </Card>

      {/* URL Input */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-zinc-900 dark:text-white text-xl">GitHub Repository Review</CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  Comprehensive analysis of your GitHub repository
                </CardDescription>
              </div>
            </div>
            {selectedProject && (
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                Project Selected
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1 bg-zinc-800 border-zinc-700 text-white h-12 text-base"
            />
            <Button
              onClick={handleFetchFiles}
              disabled={fetchRepo.isPending || !repoUrl}
              className="bg-purple-600 hover:bg-purple-700 h-12 px-6"
            >
              {fetchRepo.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Fetch Files
                </>
              )}
            </Button>
          </div>

          {/* Model Info */}
          <div className="p-3 rounded-lg border-2 bg-blue-500/20 border-blue-500">
            <p className="text-zinc-900 dark:text-white font-medium text-sm">🧠 Using: gemini-2.0-flash-exp</p>
          </div>
        </CardContent>
      </Card>

      {/* File Selection */}
      {availableFiles.length > 0 && (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white text-lg">Select Files to Review</CardTitle>
            <CardDescription>
              Choose up to 10 files ({selectedFiles.size}/10 selected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
              {availableFiles.map((file) => (
                <div
                  key={file.path}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedFiles.has(file.path)
                      ? "bg-purple-500/10 border-purple-500"
                      : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                  }`}
                  onClick={() => handleToggleFile(file.path)}
                >
                  <Checkbox
                    checked={selectedFiles.has(file.path)}
                    onCheckedChange={() => handleToggleFile(file.path)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-900 dark:text-white text-sm font-medium truncate">{file.name}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs truncate">{file.path}</p>
                    {file.language && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {file.language}
                      </Badge>
                    )}
                  </div>
                  <FileCode className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Review Button */}
      {selectedFiles.size > 0 && (
        <Button
          onClick={handleGenerateReview}
          disabled={reviewRepo.isPending}
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30"
          size="lg"
        >
          {reviewRepo.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Repository...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 mr-2" />
              Generate Comprehensive Review
            </>
          )}
        </Button>
      )}

      {/* Results */}
      {reviewRepo.data && reviewRepo.data.success && "content" in reviewRepo.data && (
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                <CardTitle className="text-zinc-900 dark:text-white">✨ Repository Analysis Complete</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="bg-gray-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert prose-sm max-w-none bg-zinc-900/50 p-6 rounded-lg border border-zinc-700">
              <ReactMarkdown
                components={{
                  code(props: any) {
                    const { inline, className, children, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
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
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-5 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">{children}</ol>,
                  strong: ({ children }) => <strong className="text-zinc-900 dark:text-white font-bold">{children}</strong>,
                }}
              >
                {reviewRepo.data.content || ""}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {reviewRepo.isError && (
        <Card className="bg-red-900/20 border-2 border-red-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400">
                Failed to generate repository review. Please check the URL and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
