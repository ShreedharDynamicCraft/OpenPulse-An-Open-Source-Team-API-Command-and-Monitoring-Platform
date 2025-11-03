'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Sparkles, 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  AlertCircle,
  Loader2,
  Send,
  Save,
  Download,
  Upload,
  Terminal,
  Bug,
  Zap,
  Shield,
  FileText,
  GitBranch,
  Wand2,
  BookOpen,
  Search,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateAPICode, 
  improveCode, 
  testAPICode,
  generateTestData,
  detectEndpoints,
  generateEndpointTests,
  recommendEndpoints,
  debugCode,
  performSecurityAudit,
  optimizePerformance,
  generateDocumentation,
  explainCode,
  refactorCode,
  convertCodeLanguage
} from '@/modules/workspace/actions/api-code-actions';

export default function CodeEditorPage() {
  // Code State
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'typescript' | 'python' | 'java'>('javascript');
  const [fileName, setFileName] = useState('untitled.js');
  const [framework, setFramework] = useState<'express' | 'fastify' | 'nextjs'>('express');
  
  // AI States
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSecurityCheck, setIsSecurityCheck] = useState(false);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  
  // Analysis Results
  const [codeAnalysis, setCodeAnalysis] = useState<any>(null);
  const [securityIssues, setSecurityIssues] = useState<any>(null);
  const [documentation, setDocumentation] = useState('');
  const [debugSuggestions, setDebugSuggestions] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  
  // API Testing States
  const [detectedRoutes, setDetectedRoutes] = useState<any[]>([]);
  const [generatedTests, setGeneratedTests] = useState<any[]>([]);
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  
  // Editor
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate Code
  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateAPICode(prompt, framework);
      if (result.success && result.data) {
        setCode(result.data.code);
        toast.success('Code generated successfully!');
      } else {
        toast.error(result.error || 'Failed to generate code');
      }
    } catch (error) {
      toast.error('An error occurred while generating code');
    } finally {
      setIsGenerating(false);
    }
  };

  // Improve Code
  const handleImproveCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code first');
      return;
    }

    setIsImproving(true);
    try {
      const result = await improveCode(code, framework);
      if (result.success && result.data) {
        setCode(result.data.improvedCode);
        setAiResponse(`Improvements: ${result.data.improvements?.join(', ')}`);
        toast.success('Code improved successfully!');
      } else {
        toast.error(result.error || 'Failed to improve code');
      }
    } catch (error) {
      toast.error('An error occurred while improving code');
    } finally {
      setIsImproving(false);
    }
  };

  // Analyze Code
  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await detectEndpoints(code);
      if (result.success && result.data) {
        setCodeAnalysis(result.data);
        toast.success('Code analyzed successfully!');
      } else {
        toast.error(result.error || 'Failed to analyze code');
      }
    } catch (error) {
      toast.error('An error occurred while analyzing code');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Optimize Performance
  const handleOptimizePerformance = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to optimize');
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await optimizePerformance(code, framework);
      if (result.success && result.data) {
        setCode(result.data.optimizedCode);
        setPerformanceMetrics(result.data);
        toast.success('Code optimized successfully!');
      } else {
        toast.error(result.error || 'Failed to optimize code');
      }
    } catch (error) {
      toast.error('An error occurred while optimizing code');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Security Check
  const handleSecurityCheck = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to check');
      return;
    }

    setIsSecurityCheck(true);
    try {
      const result = await performSecurityAudit(code);
      if (result.success && result.data) {
        setSecurityIssues(result.data);
        toast.success('Security check completed!');
      } else {
        toast.error(result.error || 'Security check failed');
      }
    } catch (error) {
      toast.error('An error occurred during security check');
    } finally {
      setIsSecurityCheck(false);
    }
  };

  // Generate Documentation
  const handleGenerateDocs = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to document');
      return;
    }

    setIsGeneratingDocs(true);
    try {
      const result = await generateDocumentation(code, framework);
      if (result.success && result.data) {
        setDocumentation(result.data.markdown);
        toast.success('Documentation generated!');
      } else {
        toast.error(result.error || 'Failed to generate documentation');
      }
    } catch (error) {
      toast.error('An error occurred while generating docs');
    } finally {
      setIsGeneratingDocs(false);
    }
  };

  // Debug Code
  const handleDebugCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to debug');
      return;
    }

    setIsDebugging(true);
    try {
      const result = await debugCode(code);
      if (result.success && result.data) {
        setDebugSuggestions(result.data);
        toast.success('Debug analysis completed!');
      } else {
        toast.error(result.error || 'Debug analysis failed');
      }
    } catch (error) {
      toast.error('An error occurred during debugging');
    } finally {
      setIsDebugging(false);
    }
  };

  // Generate Test Cases for Route
  const handleGenerateTestCases = async (route: any) => {
    setIsGeneratingTests(true);
    setSelectedRoute(route);
    try {
      // Pass the route object to generateEndpointTests
      const result = await generateEndpointTests(route);
      if (result.success && result.data) {
        const testsForRoute = result.data.testCases || result.data.tests || [];
        setGeneratedTests(testsForRoute);
        toast.success(`Generated ${testsForRoute.length} test cases!`);
      } else {
        toast.error(result.error || 'Failed to generate test cases');
      }
    } catch (error) {
      toast.error('An error occurred while generating test cases');
    } finally {
      setIsGeneratingTests(false);
    }
  };

  // Run Test Case
  const handleRunTest = async (testCase: any) => {
    setIsTesting(true);
    try {
      const endpoint = testCase.path || selectedRoute?.path || '';
      const method = (testCase.method || selectedRoute?.method || 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE';
      const requestBody = testCase.body || testCase.requestBody ? 
        JSON.stringify(testCase.body || testCase.requestBody) : undefined;
      
      const result = await testAPICode(
        code,
        endpoint,
        method,
        requestBody
      );
      
      if (result.success && result.data) {
        setTestResults({
          testCase: testCase.name || testCase.scenario,
          ...result.data,
        });
        toast.success('Test executed successfully!');
      } else {
        toast.error(result.error || 'Test execution failed');
      }
    } catch (error) {
      toast.error('An error occurred during test execution');
    } finally {
      setIsTesting(false);
    }
  };

  // File Operations
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode(event.target?.result as string);
        setFileName(file.name);
        toast.success('File loaded!');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Code Editor</h1>
            <p className="text-xs text-zinc-400">Advanced code editing with Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-48 bg-zinc-900 border-zinc-700 text-sm"
            placeholder="filename.js"
          />
          <Badge variant="outline" className="text-xs">
            {language}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-hidden flex">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 space-y-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateCode}
            disabled={isGenerating}
            title="Generate Code"
            className="hover:bg-purple-900/50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleImproveCode}
            disabled={isImproving}
            title="Improve Code"
            className="hover:bg-blue-900/50"
          >
            {isImproving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAnalyzeCode}
            disabled={isAnalyzing}
            title="Analyze Code"
            className="hover:bg-green-900/50"
          >
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSecurityCheck}
            disabled={isSecurityCheck}
            title="Security Check"
            className="hover:bg-red-900/50"
          >
            {isSecurityCheck ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDebugCode}
            disabled={isDebugging}
            title="Debug"
            className="hover:bg-yellow-900/50"
          >
            {isDebugging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bug className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateDocs}
            disabled={isGeneratingDocs}
            title="Generate Docs"
            className="hover:bg-indigo-900/50"
          >
            {isGeneratingDocs ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
          </Button>
          <div className="flex-1" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".js,.ts,.py,.java,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Upload File"
          >
            <Upload className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyCode}
            title="Copy Code"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="bg-zinc-900 border-b border-zinc-800 rounded-none justify-start">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="docs">Docs</TabsTrigger>
            </TabsList>

            {/* Editor Tab */}
            <TabsContent value="editor" className="flex-1 m-0 p-4 overflow-auto">
              <Card className="bg-zinc-900 border-zinc-800 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Code Editor</CardTitle>
                    <div className="flex gap-2">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                      </select>
                      <select
                        value={framework}
                        onChange={(e) => setFramework(e.target.value as any)}
                        className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                      >
                        <option value="express">Express.js</option>
                        <option value="fastify">Fastify</option>
                        <option value="nextjs">Next.js</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write or paste your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="min-h-[600px] font-mono text-sm bg-zinc-950 border-zinc-700 text-zinc-100 resize-none"
                    spellCheck={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai" className="flex-1 m-0 p-4 overflow-auto space-y-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI Code Generation
                  </CardTitle>
                  <CardDescription>
                    Describe what you want to build, and AI will generate the code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="E.g., Create a REST API endpoint for user authentication with JWT..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                  <Button
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {aiResponse && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-sm">AI Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-300">{aiResponse}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="flex-1 m-0 p-4 overflow-y-auto overflow-x-hidden space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Code Analysis Card */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Search className="w-4 h-4 text-green-400" />
                    API Route Detection & Analysis
                  </CardTitle>
                  <CardDescription>
                    Detect all API routes, supported methods, and generate test cases with Gemini AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleAnalyzeCode}
                    disabled={isAnalyzing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Routes...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Detect API Routes
                      </>
                    )}
                  </Button>

                  {codeAnalysis && (
                    <div className="space-y-4 mt-4">
                      {/* Framework Detection */}
                      {codeAnalysis.framework && (
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-purple-400" />
                            Detected Framework
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {codeAnalysis.framework}
                          </Badge>
                        </div>
                      )}

                      {/* Detected Routes */}
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-green-400" />
                          Detected API Routes ({codeAnalysis.endpoints?.length || 0})
                        </h3>
                        <div className="space-y-3">
                          {codeAnalysis.endpoints?.map((endpoint: any, idx: number) => (
                            <div key={idx} className="bg-zinc-900 p-3 rounded-lg border border-zinc-700 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge className={`
                                    ${endpoint.method === 'GET' ? 'bg-blue-600' : ''}
                                    ${endpoint.method === 'POST' ? 'bg-green-600' : ''}
                                    ${endpoint.method === 'PUT' ? 'bg-orange-600' : ''}
                                    ${endpoint.method === 'DELETE' ? 'bg-red-600' : ''}
                                    ${endpoint.method === 'PATCH' ? 'bg-yellow-600' : ''}
                                  `}>
                                    {endpoint.method}
                                  </Badge>
                                  <code className="text-sm text-indigo-400">{endpoint.path}</code>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleGenerateTestCases(endpoint)}
                                  disabled={isGeneratingTests && selectedRoute?.path === endpoint.path}
                                  className="text-xs h-7"
                                >
                                  {isGeneratingTests && selectedRoute?.path === endpoint.path ? (
                                    <>
                                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      Generate Tests
                                    </>
                                  )}
                                </Button>
                              </div>
                              
                              {endpoint.description && (
                                <p className="text-xs text-zinc-400 mt-1">{endpoint.description}</p>
                              )}
                              
                              {endpoint.parameters && endpoint.parameters.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-zinc-500 mb-1">Parameters:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {endpoint.parameters.map((param: string, pidx: number) => (
                                      <Badge key={pidx} variant="secondary" className="text-xs">
                                        {param}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Operation Summary */}
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-cyan-400" />
                          Supported Operations
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((method) => {
                            const count = codeAnalysis.endpoints?.filter((e: any) => e.method === method).length || 0;
                            return (
                              <div key={method} className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-zinc-800">
                                <span className="text-xs text-zinc-400">{method}</span>
                                <Badge variant={count > 0 ? 'default' : 'secondary'} className="text-xs">
                                  {count}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generated Test Cases */}
              {generatedTests.length > 0 && selectedRoute && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      AI Generated Test Cases
                    </CardTitle>
                    <CardDescription>
                      Test cases for {selectedRoute.method} {selectedRoute.path}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedTests.map((test: any, idx: number) => (
                      <div key={idx} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-zinc-100">{test.name || test.scenario}</h4>
                            <p className="text-xs text-zinc-400 mt-1">{test.description}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleRunTest(test)}
                            disabled={isTesting}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isTesting ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Run Test
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Request Details */}
                        {test.requestBody && (
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-500">Request Body:</p>
                            <pre className="bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-[200px]">
                              {JSON.stringify(test.requestBody, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Expected Response */}
                        {test.expectedResponse && (
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-500">Expected Response:</p>
                            <pre className="bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-[200px]">
                              {JSON.stringify(test.expectedResponse, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Test Assertions */}
                        {test.assertions && test.assertions.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-500">Assertions:</p>
                            <ul className="space-y-1 ml-4">
                              {test.assertions.map((assertion: string, aidx: number) => (
                                <li key={aidx} className="text-xs text-zinc-400 list-disc">
                                  {assertion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Test Results */}
              {testResults && (
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Test Results
                    </CardTitle>
                    <CardDescription>
                      Results for: {testResults.testCase}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Overall Status */}
                    <div className="flex items-center gap-2">
                      {testResults.passed ? (
                        <Badge className="bg-green-600">
                          <Check className="w-3 h-3 mr-1" />
                          Test Passed
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Test Failed
                        </Badge>
                      )}
                      {testResults.scenarios && (
                        <span className="text-xs text-zinc-400">
                          ({testResults.passedScenarios}/{testResults.totalScenarios} scenarios passed)
                        </span>
                      )}
                    </div>

                    {/* Response */}
                    {testResults.response && (
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Response:</label>
                        <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs overflow-auto max-h-[200px]">
                          {typeof testResults.response === 'string' 
                            ? testResults.response 
                            : JSON.stringify(testResults.response, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Scenarios */}
                    {testResults.scenarios && testResults.scenarios.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Test Scenarios:</label>
                        <div className="space-y-2">
                          {testResults.scenarios.map((scenario: any, idx: number) => (
                            <div key={idx} className="bg-zinc-950 p-3 rounded border border-zinc-800">
                              <div className="flex items-center gap-2 mb-2">
                                {scenario.passed ? (
                                  <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-400" />
                                )}
                                <span className="text-sm font-medium">{scenario.name}</span>
                              </div>
                              <p className="text-xs text-zinc-400 mb-2">{scenario.description}</p>
                              {scenario.expectedResponse && (
                                <pre className="bg-zinc-900 p-2 rounded text-xs overflow-auto">
                                  {JSON.stringify(scenario.expectedResponse, null, 2)}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {testResults.recommendations && testResults.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-400">Recommendations:</label>
                        <ul className="space-y-1">
                          {testResults.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                              <Sparkles className="w-3 h-3 mt-0.5 text-yellow-400 shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="flex-1 m-0 p-4 overflow-y-auto overflow-x-hidden space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="w-4 h-4 text-red-400" />
                    Security Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleSecurityCheck}
                    disabled={isSecurityCheck}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isSecurityCheck ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Run Security Check
                      </>
                    )}
                  </Button>

                  {securityIssues && (
                    <div className="space-y-3 mt-4">
                      {securityIssues.score && (
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">Security Score</h3>
                            <Badge className={`
                              ${parseInt(securityIssues.score) >= 80 ? 'bg-green-600' : ''}
                              ${parseInt(securityIssues.score) >= 50 && parseInt(securityIssues.score) < 80 ? 'bg-yellow-600' : ''}
                              ${parseInt(securityIssues.score) < 50 ? 'bg-red-600' : ''}
                            `}>
                              {securityIssues.score}/100
                            </Badge>
                          </div>
                          <div className="w-full bg-zinc-800 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                parseInt(securityIssues.score) >= 80 ? 'bg-green-600' : 
                                parseInt(securityIssues.score) >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${securityIssues.score}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {securityIssues.vulnerabilities && securityIssues.vulnerabilities.length > 0 && (
                        <div className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                          <h3 className="text-sm font-medium mb-3 text-red-400">Vulnerabilities Found</h3>
                          <div className="space-y-3">
                            {securityIssues.vulnerabilities.map((vuln: any, idx: number) => (
                              <div key={idx} className="bg-zinc-950/50 p-3 rounded border border-red-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`
                                    ${vuln.severity === 'critical' ? 'bg-red-700' : ''}
                                    ${vuln.severity === 'high' ? 'bg-red-600' : ''}
                                    ${vuln.severity === 'medium' ? 'bg-orange-600' : ''}
                                    ${vuln.severity === 'low' ? 'bg-yellow-600' : ''}
                                  `}>
                                    {vuln.severity}
                                  </Badge>
                                  <span className="text-xs text-zinc-400">{vuln.type}</span>
                                  {vuln.cwe && (
                                    <span className="text-xs text-zinc-500">({vuln.cwe})</span>
                                  )}
                                </div>
                                <p className="text-sm text-red-300 mb-2">
                                  <strong>Location:</strong> {vuln.location}
                                </p>
                                <p className="text-sm text-zinc-300 mb-2">
                                  {vuln.description}
                                </p>
                                <div className="bg-zinc-900 p-2 rounded mt-2">
                                  <p className="text-xs text-zinc-400 mb-1">Fix:</p>
                                  <p className="text-xs text-green-400">{vuln.fix}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {securityIssues.status === 'secure' && (
                        <div className="bg-green-950/30 border border-green-800 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-green-300">No major security issues detected!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="flex-1 m-0 p-4 overflow-y-auto overflow-x-hidden space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Performance Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleOptimizePerformance}
                    disabled={isOptimizing}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Optimize Performance
                      </>
                    )}
                  </Button>

                  {performanceMetrics && (
                    <div className="space-y-3 mt-4">
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                        <h3 className="text-sm font-medium mb-3 text-yellow-400">Performance Metrics</h3>
                        <div className="space-y-2 text-sm">
                          {performanceMetrics.metrics && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400">Estimated Speed Gain:</span>
                                <Badge className="bg-green-600">{performanceMetrics.metrics.estimatedSpeedGain}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400">Memory Impact:</span>
                                <Badge variant="outline">{performanceMetrics.metrics.memoryImpact}</Badge>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {performanceMetrics.improvements && performanceMetrics.improvements.length > 0 && (
                        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                          <h3 className="text-sm font-medium mb-3">Optimizations Applied</h3>
                          <div className="space-y-3">
                            {performanceMetrics.improvements.map((improvement: any, idx: number) => (
                              <div key={idx} className="bg-zinc-900 p-3 rounded border border-zinc-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`
                                    ${improvement.category === 'performance' ? 'bg-yellow-600' : ''}
                                    ${improvement.category === 'memory' ? 'bg-blue-600' : ''}
                                    ${improvement.category === 'network' ? 'bg-green-600' : ''}
                                    ${improvement.category === 'database' ? 'bg-purple-600' : ''}
                                  `}>
                                    {improvement.category}
                                  </Badge>
                                  <span className="text-xs text-zinc-400">Impact: {improvement.impact}</span>
                                </div>
                                <p className="text-sm text-zinc-300 mb-1">
                                  <strong>Before:</strong> {improvement.before}
                                </p>
                                <p className="text-sm text-zinc-300 mb-1">
                                  <strong>After:</strong> {improvement.after}
                                </p>
                                <p className="text-xs text-zinc-400 mt-2">
                                  {improvement.reasoning}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="docs" className="flex-1 m-0 p-4 overflow-y-auto overflow-x-hidden space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Auto-Generate Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleGenerateDocs}
                    disabled={isGeneratingDocs}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isGeneratingDocs ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Generate Documentation
                      </>
                    )}
                  </Button>

                  {documentation && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium">Generated Documentation</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(documentation);
                            toast.success('Documentation copied!');
                          }}
                          className="border-zinc-700"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs text-zinc-300 overflow-auto max-h-[500px] whitespace-pre-wrap">
                        {documentation}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="w-64 bg-zinc-900 border-l border-zinc-800 p-4 space-y-4 overflow-y-auto shrink-0">
          <div>
            <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImproveCode}
                disabled={isImproving}
                className="w-full justify-start border-zinc-700"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Improve Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOptimizePerformance}
                disabled={isOptimizing}
                className="w-full justify-start border-zinc-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDebugCode}
                disabled={isDebugging}
                className="w-full justify-start border-zinc-700"
              >
                <Bug className="w-4 h-4 mr-2" />
                Debug Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyzeCode}
                disabled={isAnalyzing}
                className="w-full justify-start border-zinc-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSecurityCheck}
                disabled={isSecurityCheck}
                className="w-full justify-start border-zinc-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security Check
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Code Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Lines:</span>
                <span>{code.split('\n').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Characters:</span>
                <span>{code.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Language:</span>
                <Badge variant="outline" className="text-xs">{language}</Badge>
              </div>
            </div>
          </div>

          {debugSuggestions && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-yellow-400">Debug Results</h3>
                <Badge variant={debugSuggestions.status === 'clean' ? 'default' : 'destructive'}>
                  {debugSuggestions.status}
                </Badge>
              </div>
              
              {debugSuggestions.issues && debugSuggestions.issues.length > 0 && (
                <div className="space-y-2 mb-3">
                  <h4 className="text-xs font-medium text-zinc-400">Issues Found:</h4>
                  {debugSuggestions.issues.map((issue: any, idx: number) => (
                    <div key={idx} className="text-xs bg-zinc-950 p-2 rounded border border-zinc-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`
                          text-[10px] px-1 py-0
                          ${issue.severity === 'critical' ? 'bg-red-700' : ''}
                          ${issue.severity === 'high' ? 'bg-red-600' : ''}
                          ${issue.severity === 'medium' ? 'bg-orange-600' : ''}
                          ${issue.severity === 'low' ? 'bg-yellow-600' : ''}
                        `}>
                          {issue.severity}
                        </Badge>
                        <span className="text-zinc-400">{issue.type}</span>
                      </div>
                      <p className="text-zinc-300 mb-1">{issue.description}</p>
                      {issue.fix && (
                        <p className="text-green-400 text-[10px] mt-1">Fix: {issue.fix}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {debugSuggestions.suggestions && debugSuggestions.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-zinc-400">Suggestions:</h4>
                  {debugSuggestions.suggestions.map((suggestion: string, idx: number) => (
                    <div key={idx} className="text-xs bg-zinc-950 p-2 rounded border border-zinc-800">
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
