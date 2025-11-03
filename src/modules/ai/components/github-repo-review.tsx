"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Github, Sparkles, Loader2, Copy, Check, FileCode, AlertCircle } from "lucide-react";
import { useGitHubRepoReview, useFetchGitHubRepo } from "../hooks/use-code-review";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface GitHubRepoReviewProps {
  workspaceId: string;
}

export function GitHubRepoReview({ workspaceId }: GitHubRepoReviewProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [availableFiles, setAvailableFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [tone, setTone] = useState<"gentle" | "balanced" | "direct">("balanced");
  const model = "gemini-2.0-flash-exp";
  const [copied, setCopied] = useState(false);

  const fetchRepo = useFetchGitHubRepo(workspaceId);
  const reviewRepo = useGitHubRepoReview(workspaceId);

  const handleFetchFiles = async () => {
    if (!repoUrl) {
      alert("Please enter a repository URL");
      return;
    }

    try {
      const result = await fetchRepo.mutateAsync({ repoUrl });
      setAvailableFiles(result.files || []);
      setSelectedFiles(new Set());
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  const handleToggleFile = (filePath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filePath)) {
      newSelected.delete(filePath);
    } else {
      if (newSelected.size >= 10) {
        alert("Maximum 10 files allowed per review");
        return;
      }
      newSelected.add(filePath);
    }
    setSelectedFiles(newSelected);
  };

  const handleGenerateReview = async () => {
    if (selectedFiles.size === 0) {
      alert("Please select at least one file");
      return;
    }

    try {
      // Fetch file contents
      const filesWithContent = await Promise.all(
        Array.from(selectedFiles).map(async (filePath) => {
          const file = availableFiles.find((f) => f.path === filePath);
          if (!file) return null;

          try {
            const response = await fetch(file.url);
            const content = await response.text();
            return {
              path: file.path,
              content,
              language: file.language,
            };
          } catch (error) {
            console.error(`Failed to fetch ${filePath}:`, error);
            return null;
          }
        })
      );

      const validFiles = filesWithContent.filter(
        (f): f is { path: string; content: string; language: string } => f !== null
      );

      if (validFiles.length === 0) {
        alert("Failed to fetch file contents");
        return;
      }

      reviewRepo.mutate({
        repoUrl,
        files: validFiles,
        tone,
        model,
      });
    } catch (error) {
      console.error("Failed to generate review:", error);
    }
  };

  const handleCopy = () => {
    if (reviewRepo.data && "content" in reviewRepo.data && reviewRepo.data.content) {
      navigator.clipboard.writeText(reviewRepo.data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toneDescriptions = {
    gentle: "🌸 Gentle - Extra supportive",
    balanced: "⚖️ Balanced - Professional yet friendly",
    direct: "⚡ Direct - Straightforward but respectful",
  };

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-white" />
            <CardTitle className="text-white">GitHub Repository Review</CardTitle>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
        <CardDescription className="text-gray-400">
          Comprehensive AI analysis of your GitHub repository
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Enter Repository URL */}
        <div className="space-y-2">
          <Label className="text-white text-lg font-semibold">
            Step 1: Enter Repository URL
          </Label>
          <div className="flex gap-2">
            <Input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="flex-1 bg-zinc-800 border-zinc-700 text-white"
            />
            <Button
              onClick={handleFetchFiles}
              disabled={fetchRepo.isPending || !repoUrl}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {fetchRepo.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <FileCode className="w-4 h-4 mr-2" />
                  Fetch Files
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            Enter a public GitHub repository URL (e.g., https://github.com/facebook/react)
          </p>
        </div>

        {/* Step 2: Select Files */}
        {availableFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-white text-lg font-semibold">
              Step 2: Select Files for Review (max 10)
            </Label>
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 max-h-96 overflow-y-auto">
              {availableFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-3 p-3 border-b border-zinc-700 last:border-b-0 hover:bg-zinc-700/50"
                >
                  <Checkbox
                    checked={selectedFiles.has(file.path)}
                    onCheckedChange={() => handleToggleFile(file.path)}
                    disabled={!selectedFiles.has(file.path) && selectedFiles.size >= 10}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-mono">{file.path}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {file.language}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              {selectedFiles.size} of 10 files selected
            </p>
          </div>
        )}

        {/* Configuration */}
        {selectedFiles.size > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-700 pt-4">
            <div className="space-y-2">
              <Label className="text-white font-semibold">Tone Settings</Label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm"
              >
                <option value="gentle">{toneDescriptions.gentle}</option>
                <option value="balanced">{toneDescriptions.balanced}</option>
                <option value="direct">{toneDescriptions.direct}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-semibold">AI Model</Label>
              <div className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm">
                🧠 gemini-2.0-flash-exp
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {selectedFiles.size > 0 && (
          <Button
            onClick={handleGenerateReview}
            disabled={reviewRepo.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {reviewRepo.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Repository...
              </>
            ) : (
              <>
                <Github className="w-4 h-4 mr-2" />
                Generate Repository Review
              </>
            )}
          </Button>
        )}

        {/* Results */}
        {reviewRepo.data && reviewRepo.data.success && (
          <div className="space-y-4 border-t border-zinc-700 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Repository Review Complete
              </h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-zinc-800 text-white">
                  {reviewRepo.data.metadata?.filesCount || selectedFiles.size} files analyzed
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {"content" in reviewRepo.data ? reviewRepo.data.content || "" : ""}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {reviewRepo.isError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold">Failed to generate review</p>
              <p className="text-red-400/80 text-sm mt-1">
                Please check the repository URL and ensure the files are accessible.
              </p>
            </div>
          </div>
        )}

        {fetchRepo.isError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold">Failed to fetch repository</p>
              <p className="text-red-400/80 text-sm mt-1">
                Repository may be private or the URL is invalid.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
