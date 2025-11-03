"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Loader2, Copy, Check, Plus, X, Save, Clock, Brain, AlertCircle } from "lucide-react";
import { useEmpatheticReview } from "../hooks/use-code-review";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Editor } from "@monaco-editor/react";
import { createCodeReviewLog } from "../actions/code-review-logs";
import { createCodeReviewSession } from "../actions/code-review-sessions";
import { CodeReviewSessionSelector } from "./code-review-session-selector";
import { useCodeReviewSession } from "../hooks/use-code-review-sessions";
import { toast } from "sonner";

interface EmpatheticCodeReviewEnhancedProps {
  workspaceId: string;
  userId: string;
  selectedProject?: string | null;
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

export function EmpatheticCodeReviewEnhanced({ 
  workspaceId,
  userId,
  selectedProject 
}: EmpatheticCodeReviewEnhancedProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [comments, setComments] = useState<string[]>([]);
  const [currentComment, setCurrentComment] = useState("");
  const [tone, setTone] = useState<"gentle" | "balanced" | "direct">("balanced");
  const model = "gemini-2.0-flash-exp";
  const [copied, setCopied] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const empatheticReview = useEmpatheticReview(workspaceId);
  const { data: session } = useCodeReviewSession(selectedSessionId);

  // Load session data when selected
  useEffect(() => {
    if (session) {
      if (session.code) setCode(session.code);
      if (session.language) setLanguage(session.language);
      if (session.tone) setTone(session.tone as any);
      if (session.originalComments) {
        setComments(session.originalComments as string[]);
      }
    }
  }, [session]);

  const handleAddComment = () => {
    if (currentComment.trim()) {
      setComments([...comments, currentComment.trim()]);
      setCurrentComment("");
    }
  };

  const handleRemoveComment = (index: number) => {
    setComments(comments.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!code || comments.length === 0) {
      toast.error("Please add code and at least one comment");
      return;
    }

    // Create or update session
    let sessionId = selectedSessionId;
    if (!sessionId) {
      // Create a new standalone session
      try {
        const newSession = await createCodeReviewSession({
          workspaceId,
          userId,
          projectId: selectedProject || undefined,
          reviewType: "EMPATHETIC",
          name: `Empathetic Review - ${new Date().toLocaleString()}`,
          description: `${language} code review with ${tone} tone`,
          code,
          language,
          tone,
          model,
          originalComments: comments,
        });
        sessionId = newSession.id;
        setSelectedSessionId(sessionId);
      } catch (error) {
        toast.error("Failed to create session");
        return;
      }
    }

    setStartTime(Date.now());
    empatheticReview.mutate({
      code,
      language,
      comments,
      tone,
      model,
    });
  };

  // Save to logs when review is generated
  useEffect(() => {
    if (empatheticReview.data && "content" in empatheticReview.data && empatheticReview.data.content && startTime && selectedSessionId) {
      const duration = Date.now() - startTime;
      
      createCodeReviewLog({
        sessionId: selectedSessionId,
        response: empatheticReview.data.content,
        model,
        tone,
        duration,
        codeSnapshot: code,
        commentsSnapshot: comments,
        status: "success",
      }).then(() => {
        toast.success("Review saved to session history");
      }).catch((error) => {
        console.error("Failed to save review log:", error);
      });
      
      setStartTime(null);
    }
  }, [empatheticReview.data, selectedSessionId]);

  const handleCopy = () => {
    if (empatheticReview.data && "content" in empatheticReview.data && empatheticReview.data.content) {
      navigator.clipboard.writeText(empatheticReview.data.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toneDescriptions = {
    gentle: "🌸 Gentle - Extra supportive for sensitive contexts",
    balanced: "⚖️ Balanced - Professional yet friendly (recommended)",
    direct: "⚡ Direct - Straightforward but respectful",
  };



  return (
    <div className="space-y-6">
      {/* Session Selector */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-lg">Review Session</CardTitle>
              <CardDescription>
                Select an existing session or create a new one to track your reviews
              </CardDescription>
            </div>
            <CodeReviewSessionSelector
              workspaceId={workspaceId}
              userId={userId}
              reviewType="EMPATHETIC"
              onSessionSelect={setSelectedSessionId}
              selectedSessionId={selectedSessionId}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Panel */}
      <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-2 border-pink-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Empathetic Code Review</CardTitle>
                <CardDescription className="text-gray-300">
                  Transform harsh comments into constructive, educational feedback
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

        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">Programming Language</Label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800/80 backdrop-blur border-2 border-zinc-700 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm font-semibold">Review Tone</Label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-zinc-800/80 backdrop-blur border-2 border-zinc-700 rounded-lg text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
              >
                <option value="gentle">{toneDescriptions.gentle}</option>
                <option value="balanced">{toneDescriptions.balanced}</option>
                <option value="direct">{toneDescriptions.direct}</option>
              </select>
            </div>
          </div>

          {/* AI Model Info */}
          <div className="space-y-2">
            <Label className="text-white text-sm font-semibold">AI Model</Label>
            <div className="p-4 rounded-lg border-2 bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20">
              <p className="text-white font-medium mb-1">🧠 gemini-2.0-flash-exp</p>
              <p className="text-xs text-gray-400">Detailed & Thorough - Comprehensive analysis with deeper insights</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Input */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Code to Review</CardTitle>
          <CardDescription>Paste the code that needs review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border-2 border-zinc-700 focus-within:border-pink-500 transition-all">
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
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comments Management */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Review Comments</CardTitle>
          <CardDescription>
            Add harsh or critical comments to transform into constructive feedback
            <span className="block mt-1 text-xs text-yellow-400">
              💡 Tip: Press Ctrl+Enter to quickly add a comment
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Example: This code is terrible and makes no sense! Why would anyone write it this way?"
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleAddComment();
                }
              }}
              className="flex-1 bg-zinc-800 border-zinc-700 text-white min-h-[80px] placeholder:text-gray-500"
            />
            <Button
              onClick={handleAddComment}
              disabled={!currentComment.trim()}
              className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
              title="Add comment"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {comments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">{comments.length} comment(s) added</p>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-zinc-800 rounded-lg border border-zinc-700"
                >
                  <p className="flex-1 text-sm text-white">{comment}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveComment(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="space-y-2">
        {(!code || comments.length === 0) && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-300">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">To generate a review, you need:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {!code && <li>Add code in the editor above</li>}
                  {comments.length === 0 && <li>Add at least one comment to review</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <Button
          onClick={handleGenerate}
          disabled={empatheticReview.isPending || !code || comments.length === 0}
          className="w-full h-14 text-lg bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {empatheticReview.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Empathetic Review...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Empathetic Review
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {empatheticReview.data && empatheticReview.data.success && "content" in empatheticReview.data && (
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                <CardTitle className="text-white">✨ Empathetic Review Generated</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-zinc-800">
                  {comments.length} comments reviewed
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-zinc-800 border-zinc-700"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-sm max-w-none bg-zinc-900/50 p-6 rounded-lg border border-zinc-700">
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
                  p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-300">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-400 my-4">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                  em: ({ children }) => <em className="text-pink-400">{children}</em>,
                }}
              >
                {empatheticReview.data.content || ""}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {empatheticReview.isError && (
        <Card className="bg-red-900/20 border-2 border-red-800">
          <CardContent className="p-6">
            <p className="text-red-400">
              Failed to generate empathetic review. Please try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
