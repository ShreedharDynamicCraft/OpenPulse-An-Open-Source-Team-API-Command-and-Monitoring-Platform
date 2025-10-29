"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, TrendingUp, Lightbulb, Loader2 } from "lucide-react";
import { useAnalyzeTestResults, useSummarizeResponse, useOptimizeEndpoint } from "../hooks/use-response-analysis";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface AIAnalysisPanelProps {
  workspaceId: string;
  responseData?: {
    method: string;
    url: string;
    statusCode: number;
    responseTime: number;
    responseBody: any;
    requestHeaders?: Record<string, string>;
    responseHeaders?: Record<string, string>;
    responseSize?: number;
  };
  testResults?: Array<{
    name: string;
    method: string;
    url: string;
    status: "success" | "failed" | "error";
    statusCode?: number;
    responseTime?: number;
    errorMessage?: string;
  }>;
}

export function AIAnalysisPanel({ workspaceId, responseData, testResults }: AIAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const analyzeTests = useAnalyzeTestResults(workspaceId);
  const summarizeResponse = useSummarizeResponse(workspaceId);
  const optimizeEndpoint = useOptimizeEndpoint(workspaceId);

  const handleAnalyzeTests = () => {
    if (!testResults || testResults.length === 0) return;
    
    analyzeTests.mutate({
      testResults,
      context: `Analyzing ${testResults.length} test results`,
    });
  };

  const handleSummarizeResponse = () => {
    if (!responseData) return;

    summarizeResponse.mutate({
      method: responseData.method,
      url: responseData.url,
      statusCode: responseData.statusCode,
      responseTime: responseData.responseTime,
      responseBody: responseData.responseBody,
      requestHeaders: responseData.requestHeaders,
      responseHeaders: responseData.responseHeaders,
    });
  };

  const handleOptimizeEndpoint = () => {
    if (!responseData) return;

    optimizeEndpoint.mutate({
      method: responseData.method,
      url: responseData.url,
      responseTime: responseData.responseTime,
      statusCode: responseData.statusCode,
      responseSize: responseData.responseSize,
      requestHeaders: responseData.requestHeaders,
    });
  };

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-white">AI-Powered Analysis</CardTitle>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </div>
        <CardDescription className="text-gray-400">
          Get intelligent insights, summaries, and optimization tips
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
            <TabsTrigger
              value="summary"
              disabled={!responseData}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Response Summary
            </TabsTrigger>
            <TabsTrigger
              value="optimize"
              disabled={!responseData}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Optimize
            </TabsTrigger>
            <TabsTrigger
              value="test-analysis"
              disabled={!testResults || testResults.length === 0}
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Test Analysis
            </TabsTrigger>
          </TabsList>

          {/* Response Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">
                Get a plain English explanation of this API response
              </p>

              <Button
                onClick={handleSummarizeResponse}
                disabled={summarizeResponse.isPending || !responseData}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {summarizeResponse.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Response...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Summarize Response
                  </>
                )}
              </Button>

              {summarizeResponse.data && summarizeResponse.data.success && (
                <div className="bg-zinc-800 rounded-lg p-4 prose prose-invert max-w-none">
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
                    {"content" in summarizeResponse.data ? summarizeResponse.data.content : ""}
                  </ReactMarkdown>
                </div>
              )}

              {summarizeResponse.isError && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <p className="text-red-400 text-sm">
                    Failed to generate summary. Please try again.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimize" className="space-y-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">
                Get AI-powered suggestions to improve this endpoint's performance, security, and design
              </p>

              <Button
                onClick={handleOptimizeEndpoint}
                disabled={optimizeEndpoint.isPending || !responseData}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {optimizeEndpoint.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Endpoint...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Get Optimization Tips
                  </>
                )}
              </Button>

              {optimizeEndpoint.data && optimizeEndpoint.data.success && (
                <div className="bg-zinc-800 rounded-lg p-4 prose prose-invert max-w-none">
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
                    {"content" in optimizeEndpoint.data ? optimizeEndpoint.data.content : ""}
                  </ReactMarkdown>
                </div>
              )}

              {optimizeEndpoint.isError && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <p className="text-red-400 text-sm">
                    Failed to generate optimization tips. Please try again.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Test Analysis Tab */}
          <TabsContent value="test-analysis" className="space-y-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400">
                Analyze failed tests and get actionable fix suggestions
              </p>

              {testResults && (
                <div className="bg-zinc-800 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Tests:</span>
                    <span className="text-white font-semibold">{testResults.length}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400">Failed:</span>
                    <span className="text-red-400 font-semibold">
                      {testResults.filter(t => t.status !== "success").length}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleAnalyzeTests}
                disabled={analyzeTests.isPending || !testResults || testResults.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {analyzeTests.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Test Results...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Analyze Test Results
                  </>
                )}
              </Button>

              {analyzeTests.data && analyzeTests.data.success && (
                <div className="bg-zinc-800 rounded-lg p-4 prose prose-invert max-w-none">
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
                    {"content" in analyzeTests.data ? analyzeTests.data.content : ""}
                  </ReactMarkdown>
                </div>
              )}

              {analyzeTests.isError && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <p className="text-red-400 text-sm">
                    Failed to analyze test results. Please try again.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
