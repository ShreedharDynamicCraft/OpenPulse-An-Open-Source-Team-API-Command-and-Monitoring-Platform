"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Loader2, Copy, Check, Plus, X } from "lucide-react";
import { useEmpatheticReview } from "../hooks/use-code-review";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Editor } from "@monaco-editor/react";

interface EmpatheticCodeReviewProps {
  workspaceId: string;
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

export function EmpatheticCodeReview({ workspaceId }: EmpatheticCodeReviewProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [comments, setComments] = useState<string[]>([]);
  const [currentComment, setCurrentComment] = useState("");
  const [tone, setTone] = useState<"gentle" | "balanced" | "direct">("balanced");
  const [model, setModel] = useState<"gemini-2.0-flash" | "gemini-1.5-pro">("gemini-2.0-flash");
  const [copied, setCopied] = useState(false);

  const empatheticReview = useEmpatheticReview(workspaceId);

  const handleAddComment = () => {
    if (currentComment.trim()) {
      setComments([...comments, currentComment.trim()]);
      setCurrentComment("");
    }
  };

  const handleRemoveComment = (index: number) => {
    setComments(comments.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (!code || comments.length === 0) {
      alert("Please add code and at least one comment");
      return;
    }

    empatheticReview.mutate({
      code,
      language,
      comments,
      tone,
      model,
    });
  };

  const handleCopy = () => {
    if (empatheticReview.data && "content" in empatheticReview.data && empatheticReview.data.content) {
      navigator.clipboard.writeText(empatheticReview.data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toneDescriptions = {
    gentle: "🌸 Gentle - Extra supportive for sensitive contexts",
    balanced: "⚖️ Balanced - Professional yet friendly (recommended)",
    direct: "⚡ Direct - Straightforward but respectful",
  };

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-white">Empathetic Code Review</CardTitle>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
        <CardDescription className="text-gray-400">
          Transform harsh code review comments into constructive, educational feedback
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Choose Language */}
        <div className="space-y-2">
          <Label className="text-white text-lg font-semibold">
            Step 1: Choose Your Language
          </Label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Paste Code */}
        <div className="space-y-2">
          <Label className="text-white text-lg font-semibold">
            Step 2: Paste Your Code
          </Label>
          <div className="border border-zinc-700 rounded-md overflow-hidden">
            <Editor
              height="300px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Step 3: Add Review Comments */}
        <div className="space-y-2">
          <Label className="text-white text-lg font-semibold">
            Step 3: Add Review Comments
          </Label>
          <p className="text-sm text-gray-400">
            Enter harsh or terse comments (one per line) like "Function names are unclear" or
            "Missing error handling"
          </p>

          <div className="flex gap-2">
            <Textarea
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              placeholder="e.g., Function names are unclear"
              className="flex-1 bg-zinc-800 border-zinc-700 text-white"
              rows={2}
            />
            <Button
              onClick={handleAddComment}
              disabled={!currentComment.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Comments List */}
          {comments.length > 0 && (
            <div className="space-y-2 mt-3">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-zinc-800 p-3 rounded-md border border-zinc-700"
                >
                  <span className="flex-1 text-white text-sm">{comment}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveComment(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Options */}
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
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm"
            >
              <option value="gemini-2.0-flash">gemini-2.0-flash (Fast, efficient)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (More detailed)</option>
            </select>
          </div>
        </div>

        {/* Step 4: Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={empatheticReview.isPending || !code || comments.length === 0}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          size="lg"
        >
          {empatheticReview.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Empathetic Review...
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-2" />
              Generate Empathetic Review
            </>
          )}
        </Button>

        {/* Results */}
        {empatheticReview.data && empatheticReview.data.success && (
          <div className="space-y-4 border-t border-zinc-700 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Empathetic Review Generated
              </h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-zinc-800 text-white">
                  {empatheticReview.data.metadata?.commentsCount || comments.length} comments reviewed
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
                {"content" in empatheticReview.data ? empatheticReview.data.content || "" : ""}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {empatheticReview.isError && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Failed to generate empathetic review. Please try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
