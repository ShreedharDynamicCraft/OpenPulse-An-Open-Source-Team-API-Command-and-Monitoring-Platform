'use client';

import React, { useState } from 'react';
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
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  generateAPICode, 
  testAPICode, 
  improveCode, 
  generateTestData,
  detectEndpoints,
  generateEndpointTests,
  recommendEndpoints
} from '../actions/api-code-actions';

interface ApiCodeEditorProps {
  workspaceId: string;
}

export const ApiCodeEditor = ({ workspaceId }: ApiCodeEditorProps) => {
  const [code, setCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState<'express' | 'fastify' | 'nextjs'>('express');
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testMethod, setTestMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [testBody, setTestBody] = useState('');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isGeneratingTestData, setIsGeneratingTestData] = useState(false);
  const [isDetectingEndpoints, setIsDetectingEndpoints] = useState(false);
  const [isGeneratingEndpointTests, setIsGeneratingEndpointTests] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [detectedEndpoints, setDetectedEndpoints] = useState<any[]>([]);
  const [endpointTests, setEndpointTests] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [currentTestCase, setCurrentTestCase] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [manualTests, setManualTests] = useState<any[]>([]);
  const [isAddingManualTest, setIsAddingManualTest] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestDescription, setNewTestDescription] = useState('');
  const [realApiUrl, setRealApiUrl] = useState('http://localhost:3000');
  const [isRealApiTest, setIsRealApiTest] = useState(false);
  const [realApiResponse, setRealApiResponse] = useState<any>(null);

  // Auto-detect endpoints when code changes (if enabled)
  React.useEffect(() => {
    if (autoDetect && code.trim() && !isDetectingEndpoints) {
      const debounceTimer = setTimeout(() => {
        handleDetectEndpoints();
      }, 1500); // Debounce for 1.5 seconds
      
      return () => clearTimeout(debounceTimer);
    }
  }, [code, autoDetect]);

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

  const handleTestCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to test');
      return;
    }

    if (!testEndpoint.trim()) {
      toast.error('Please enter an endpoint to test');
      return;
    }

    setIsTesting(true);
    try {
      const result = await testAPICode(code, testEndpoint, testMethod, testBody);
      if (result.success && result.data) {
        setTestResponse(result.data);
        toast.success('Test completed!');
      } else {
        toast.error(result.error || 'Test failed');
      }
    } catch (error) {
      toast.error('An error occurred while testing');
    } finally {
      setIsTesting(false);
    }
  };

  const handleGenerateTestData = async () => {
    if (!code.trim()) {
      toast.error('Please enter code first');
      return;
    }

    setIsGeneratingTestData(true);
    try {
      const result = await generateTestData(code);
      if (result.success && result.data) {
        setTestBody(JSON.stringify(result.data.testData, null, 2));
        toast.success('Test data generated!');
      } else {
        toast.error(result.error || 'Failed to generate test data');
      }
    } catch (error) {
      toast.error('An error occurred while generating test data');
    } finally {
      setIsGeneratingTestData(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDetectEndpoints = async () => {
    if (!code.trim()) {
      toast.error('Please enter code first');
      return;
    }

    setIsDetectingEndpoints(true);
    try {
      const result = await detectEndpoints(code);
      if (result.success && result.data) {
        setDetectedEndpoints(result.data.endpoints || []);
        toast.success(`Detected ${result.data.endpoints?.length || 0} endpoints!`);
      } else {
        toast.error(result.error || 'Failed to detect endpoints');
      }
    } catch (error) {
      toast.error('An error occurred while detecting endpoints');
    } finally {
      setIsDetectingEndpoints(false);
    }
  };

  const handleGenerateEndpointTests = async (endpoint: any) => {
    setIsGeneratingEndpointTests(true);
    setSelectedEndpoint(endpoint);
    try {
      const result = await generateEndpointTests(endpoint);
      if (result.success && result.data) {
        setEndpointTests(result.data);
        toast.success('Test cases generated!');
      } else {
        toast.error(result.error || 'Failed to generate tests');
      }
    } catch (error) {
      toast.error('An error occurred while generating tests');
    } finally {
      setIsGeneratingEndpointTests(false);
    }
  };

  const handleRecommendEndpoints = async () => {
    setIsRecommending(true);
    try {
      const description = prompt || 'API project';
      const result = await recommendEndpoints(description, detectedEndpoints);
      if (result.success && result.data) {
        setRecommendations(result.data);
        toast.success('Recommendations generated!');
      } else {
        toast.error(result.error || 'Failed to generate recommendations');
      }
    } catch (error) {
      toast.error('An error occurred while generating recommendations');
    } finally {
      setIsRecommending(false);
    }
  };

  const handleUseTestCase = (testCase: any) => {
    setTestMethod(testCase.method);
    setTestEndpoint(testCase.path);
    if (testCase.body) {
      setTestBody(JSON.stringify(testCase.body, null, 2));
    }
    // Store current test case for display
    setCurrentTestCase(testCase);
    // Clear previous test results
    setTestResponse(null);
    setRealApiResponse(null);
    
    toast.success(`Test case loaded: ${testCase.name}`, {
      description: `${testCase.method} ${testCase.path} - Expected: ${testCase.expectedStatus}`
    });
  };

  const handleRealApiTest = async () => {
    if (!testEndpoint.trim()) {
      toast.error('Please enter an endpoint to test');
      return;
    }

    const fullUrl = `${realApiUrl}${testEndpoint}`;
    setIsTesting(true);
    setIsRealApiTest(true);
    
    try {
      const options: RequestInit = {
        method: testMethod,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if ((testMethod === 'POST' || testMethod === 'PUT') && testBody) {
        try {
          options.body = JSON.stringify(JSON.parse(testBody));
        } catch (e) {
          toast.error('Invalid JSON in request body');
          setIsTesting(false);
          return;
        }
      }

      const startTime = performance.now();
      const response = await fetch(fullUrl, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      setRealApiResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        duration,
        timestamp: new Date().toISOString(),
        passed: response.ok,
      });

      if (response.ok) {
        toast.success(`Request successful (${duration}ms)`, {
          description: `${testMethod} ${fullUrl} - Status: ${response.status}`
        });
      } else {
        toast.error(`Request failed (${duration}ms)`, {
          description: `Status: ${response.status} ${response.statusText}`
        });
      }
    } catch (error: any) {
      setRealApiResponse({
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString(),
      });
      toast.error('Request failed', {
        description: error.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleAddManualTest = () => {
    if (!newTestName.trim()) {
      toast.error('Please enter a test name');
      return;
    }

    const newTest = {
      id: `manual-${Date.now()}`,
      name: newTestName,
      description: newTestDescription || 'Manual test case',
      method: testMethod,
      path: testEndpoint,
      body: testBody ? JSON.parse(testBody) : undefined,
      testType: 'manual',
      expectedStatus: 200,
      isManual: true,
    };

    setManualTests([...manualTests, newTest]);
    setNewTestName('');
    setNewTestDescription('');
    setIsAddingManualTest(false);
    toast.success('Manual test case added!');
  };

  const handleDeleteManualTest = (testId: string) => {
    setManualTests(manualTests.filter(t => t.id !== testId));
    toast.success('Test case deleted');
  };

  const templates = [
    {
      name: 'REST API',
      code: `// Express REST API Route
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`
    },
    {
      name: 'POST with Validation',
      code: `// Express POST with validation
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`
    },
    {
      name: 'Authentication Middleware',
      code: `// JWT Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};`
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium">API Code Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900">
            <TabsTrigger value="write">Write Code</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="test">Test API</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Write Code Tab */}
          <TabsContent value="write" className="space-y-4 mt-4">
            {/* AI Code Generation */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AI Code Generator
                </CardTitle>
                <CardDescription>
                  Describe what you want to build, and AI will generate the code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as any)}
                    className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="express">Express.js</option>
                    <option value="fastify">Fastify</option>
                    <option value="nextjs">Next.js API</option>
                  </select>
                </div>
                <Textarea
                  placeholder="E.g., Create a user registration endpoint with email validation and password hashing..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] bg-zinc-800 border-zinc-700 text-zinc-100"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
                </div>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    Code Editor
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImproveCode}
                      disabled={isImproving || !code}
                      className="border-zinc-700"
                    >
                      {isImproving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Improve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      disabled={!code}
                      className="border-zinc-700"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your API route code here or generate it with AI..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[400px] font-mono text-sm bg-zinc-950 border-zinc-700 text-zinc-100"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab - NEW */}
          <TabsContent value="endpoints" className="space-y-4 mt-4">
            {/* Auto-detect Toggle */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Auto-detect Endpoints</p>
                    <p className="text-xs text-zinc-500">Automatically detect endpoints when code changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoDetect}
                      onChange={(e) => setAutoDetect(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Endpoint Detection */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Endpoint Detection & Testing
                </CardTitle>
                <CardDescription>
                  Detect API endpoints and generate test cases automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={handleDetectEndpoints}
                    disabled={isDetectingEndpoints || !code}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isDetectingEndpoints ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Detect Now
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleRecommendEndpoints}
                    disabled={isRecommending}
                    variant="outline"
                    className="border-zinc-700"
                  >
                    {isRecommending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Get Recommendations
                  </Button>
                </div>

                {/* Detected Endpoints */}
                {detectedEndpoints.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-zinc-300">
                        Detected Endpoints ({detectedEndpoints.length})
                      </h3>
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {detectedEndpoints.map((endpoint, idx) => (
                        <Card key={idx} className="bg-zinc-950 border-zinc-800">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={`
                                    ${endpoint.method === 'GET' ? 'bg-blue-600' : ''}
                                    ${endpoint.method === 'POST' ? 'bg-green-600' : ''}
                                    ${endpoint.method === 'PUT' ? 'bg-orange-600' : ''}
                                    ${endpoint.method === 'DELETE' ? 'bg-red-600' : ''}
                                    ${endpoint.method === 'PATCH' ? 'bg-yellow-600' : ''}
                                  `}
                                >
                                  {endpoint.method}
                                </Badge>
                                <code className="text-sm text-indigo-400">{endpoint.path}</code>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGenerateEndpointTests(endpoint)}
                                className="border-zinc-700 text-xs"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Generate Tests
                              </Button>
                            </div>
                            <p className="text-xs text-zinc-400">{endpoint.description}</p>
                            {endpoint.authRequired && (
                              <Badge variant="outline" className="text-xs">
                                🔒 Auth Required
                              </Badge>
                            )}
                            {endpoint.params && endpoint.params.length > 0 && (
                              <div className="text-xs text-zinc-500">
                                Params: {endpoint.params.join(', ')}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Endpoint Test Cases */}
                {endpointTests && selectedEndpoint && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-zinc-300">
                        Test Cases for {selectedEndpoint.method} {selectedEndpoint.path}
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEndpointTests(null)}
                      >
                        Close
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {endpointTests.testCases?.map((testCase: any, idx: number) => (
                        <Card key={idx} className="bg-zinc-950 border-zinc-800">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-zinc-200">{testCase.name}</p>
                                <p className="text-xs text-zinc-400">{testCase.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {testCase.testType}
                              </Badge>
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="text-zinc-500">
                                Expected Status: <span className="text-green-400">{testCase.expectedStatus}</span>
                              </div>
                              {testCase.body && (
                                <div>
                                  <p className="text-zinc-500 mb-1">Request Body:</p>
                                  <pre className="bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-[100px]">
                                    {JSON.stringify(testCase.body, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {testCase.expectedResponse && (
                                <div>
                                  <p className="text-zinc-500 mb-1">Expected Response:</p>
                                  <pre className="bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-[100px]">
                                    {typeof testCase.expectedResponse === 'string' 
                                      ? testCase.expectedResponse 
                                      : JSON.stringify(testCase.expectedResponse, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUseTestCase(testCase)}
                              className="w-full border-zinc-700 text-xs"
                            >
                              Use This Test
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {recommendations && (
                  <div className="space-y-3 mt-4">
                    <h3 className="text-sm font-medium text-zinc-300">
                      Recommended Endpoints
                    </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {recommendations.recommendations?.map((rec: any, idx: number) => (
                        <Card key={idx} className="bg-zinc-950 border-zinc-800">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={`
                                    ${rec.method === 'GET' ? 'bg-blue-600' : ''}
                                    ${rec.method === 'POST' ? 'bg-green-600' : ''}
                                    ${rec.method === 'PUT' ? 'bg-orange-600' : ''}
                                    ${rec.method === 'DELETE' ? 'bg-red-600' : ''}
                                  `}
                                >
                                  {rec.method}
                                </Badge>
                                <code className="text-sm text-indigo-400">{rec.path}</code>
                              </div>
                              <Badge 
                                variant="outline"
                                className={`text-xs ${
                                  rec.priority === 'high' ? 'border-red-500 text-red-400' :
                                  rec.priority === 'medium' ? 'border-yellow-500 text-yellow-400' :
                                  'border-green-500 text-green-400'
                                }`}
                              >
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-zinc-400">{rec.description}</p>
                            <p className="text-xs text-zinc-500">💡 {rec.reason}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {recommendations.suggestions && recommendations.suggestions.length > 0 && (
                      <div className="mt-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                        <p className="text-xs font-medium text-zinc-300 mb-2">General Suggestions:</p>
                        <ul className="space-y-1">
                          {recommendations.suggestions.map((suggestion: string, idx: number) => (
                            <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2">
                              <Sparkles className="w-3 h-3 mt-0.5 shrink-0 text-purple-400" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test API Tab */}
          <TabsContent value="test" className="space-y-4 mt-4">
            {/* Test Mode Selection */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Real API Testing</p>
                    <p className="text-xs text-zinc-500">Test against a real API server instead of simulation</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRealApiTest}
                      onChange={(e) => setIsRealApiTest(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                {isRealApiTest && (
                  <div className="mt-3">
                    <label className="text-xs text-zinc-400">Base URL</label>
                    <Input
                      value={realApiUrl}
                      onChange={(e) => setRealApiUrl(e.target.value)}
                      placeholder="http://localhost:3000"
                      className="mt-1 bg-zinc-800 border-zinc-700 text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Test Cases */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Manual Test Cases</CardTitle>
                    <CardDescription>Add and manage your own test cases</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingManualTest(!isAddingManualTest)}
                    className="border-zinc-700"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Test
                  </Button>
                </div>
              </CardHeader>
              {isAddingManualTest && (
                <CardContent className="space-y-3 border-t border-zinc-800 pt-4">
                  <Input
                    placeholder="Test name"
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={newTestDescription}
                    onChange={(e) => setNewTestDescription(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddManualTest}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAddingManualTest(false);
                        setNewTestName('');
                        setNewTestDescription('');
                      }}
                      className="border-zinc-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              )}
              {manualTests.length > 0 && (
                <CardContent className="space-y-2">
                  {manualTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between bg-zinc-950 p-3 rounded border border-zinc-800">
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{test.name}</p>
                        <p className="text-xs text-zinc-500">
                          {test.method} {test.path}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUseTestCase(test)}
                        >
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteManualTest(test.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Play className="w-4 h-4 text-green-400" />
                  Test Configuration
                </CardTitle>
                <CardDescription>
                  {isRealApiTest ? 'Send requests to real API' : 'Simulate API with AI-generated responses'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Test Case Info */}
                {currentTestCase && (
                  <div className="bg-indigo-950/30 border border-indigo-800 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-600">Active Test</Badge>
                        <span className="text-sm font-medium text-zinc-200">{currentTestCase.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCurrentTestCase(null)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-400">{currentTestCase.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-zinc-500">
                        Expected Status: <span className="text-green-400 font-mono">{currentTestCase.expectedStatus}</span>
                      </span>
                      <Badge variant="outline" className="text-xs">{currentTestCase.testType}</Badge>
                    </div>
                  </div>
                )}

                {/* Test Configuration */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={testMethod}
                      onChange={(e) => setTestMethod(e.target.value as any)}
                      className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <Input
                      placeholder="/api/users"
                      value={testEndpoint}
                      onChange={(e) => setTestEndpoint(e.target.value)}
                      className="flex-1 bg-zinc-800 border-zinc-700"
                    />
                  </div>

                  {/* Request Body */}
                  {(testMethod === 'POST' || testMethod === 'PUT') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-zinc-400">Request Body</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleGenerateTestData}
                          disabled={isGeneratingTestData || !code}
                          className="text-xs"
                        >
                          {isGeneratingTestData ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1" />
                          )}
                          Generate Test Data
                        </Button>
                      </div>
                      <Textarea
                        placeholder='{"name": "John Doe", "email": "john@example.com"}'
                        value={testBody}
                        onChange={(e) => setTestBody(e.target.value)}
                        className="min-h-[120px] font-mono text-sm bg-zinc-950 border-zinc-700"
                      />
                    </div>
                  )}

                  <Button
                    onClick={isRealApiTest ? handleRealApiTest : handleTestCode}
                    disabled={isTesting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isRealApiTest ? 'Sending...' : 'Testing...'}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {isRealApiTest ? 'Send Real Request' : 'Simulate Test'}
                      </>
                    )}
                  </Button>
                </div>

                {/* Real API Response */}
                {realApiResponse && isRealApiTest && (
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400 flex items-center gap-2">
                      Real API Response
                      <Badge className={realApiResponse.passed ? 'bg-green-600' : 'bg-red-600'}>
                        {realApiResponse.status || 'Error'}
                      </Badge>
                    </label>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3">
                      {realApiResponse.error ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Request Failed</span>
                          </div>
                          <p className="text-sm text-red-300">{realApiResponse.error}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {realApiResponse.passed ? (
                                <Badge className="bg-green-600">
                                  <Check className="w-3 h-3 mr-1" />
                                  Success
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Failed
                                </Badge>
                              )}
                              <span className="text-sm text-zinc-400">
                                {realApiResponse.status} {realApiResponse.statusText}
                              </span>
                              {realApiResponse.duration && (
                                <Badge variant="outline" className="text-xs">
                                  {realApiResponse.duration}ms
                                </Badge>
                              )}
                            </div>
                          </div>

                          {realApiResponse.headers && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-zinc-300">Response Headers</p>
                              <pre className="bg-zinc-900 p-3 rounded text-xs overflow-auto max-h-[150px]">
                                {JSON.stringify(realApiResponse.headers, null, 2)}
                              </pre>
                            </div>
                          )}

                          {realApiResponse.data && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-zinc-300">Response Body</p>
                              <pre className="bg-zinc-900 p-3 rounded text-xs overflow-auto max-h-[300px]">
                                {typeof realApiResponse.data === 'string' 
                                  ? realApiResponse.data 
                                  : JSON.stringify(realApiResponse.data, null, 2)}
                              </pre>
                            </div>
                          )}

                          <div className="text-xs text-zinc-500">
                            Timestamp: {new Date(realApiResponse.timestamp).toLocaleString()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Simulated Test Response */}
                {testResponse && (
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Test Results</label>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {testResponse.passed ? (
                            <Badge className="bg-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              Passed
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                          <span className="text-sm text-zinc-400">
                            Status: {testResponse.status}
                          </span>
                        </div>
                        {currentTestCase && (
                          <Badge variant="outline" className="text-xs">
                            Expected: {currentTestCase.expectedStatus}
                          </Badge>
                        )}
                      </div>
                      
                      {testResponse.issues && testResponse.issues.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-zinc-300">Issues Found:</p>
                          <ul className="space-y-1">
                            {testResponse.issues.map((issue: string, idx: number) => (
                              <li key={idx} className="text-sm text-red-400 flex items-start gap-2">
                                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {testResponse.suggestions && testResponse.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-zinc-300">Suggestions:</p>
                          <ul className="space-y-1">
                            {testResponse.suggestions.map((suggestion: string, idx: number) => (
                              <li key={idx} className="text-sm text-blue-400 flex items-start gap-2">
                                <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {testResponse.response && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-zinc-300">Expected Response:</p>
                          <pre className="bg-zinc-900 p-3 rounded text-xs overflow-auto max-h-[300px]">
                            {JSON.stringify(testResponse.response, null, 2)}
                          </pre>
                        </div>
                      )}

                      {testResponse.testScenarios && testResponse.testScenarios.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-zinc-300">Test Scenarios:</p>
                          <div className="space-y-2">
                            {testResponse.testScenarios.map((scenario: any, idx: number) => (
                              <div key={idx} className="bg-zinc-900 p-3 rounded border border-zinc-800">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-medium text-zinc-200">{scenario.scenario}</p>
                                  {scenario.passed ? (
                                    <Badge className="bg-green-600 text-xs">
                                      <Check className="w-3 h-3 mr-1" />
                                      Pass
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Fail
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-1 text-xs">
                                  {scenario.input && (
                                    <div>
                                      <span className="text-zinc-500">Input: </span>
                                      <code className="text-indigo-400">{JSON.stringify(scenario.input)}</code>
                                    </div>
                                  )}
                                  {scenario.expectedOutput && (
                                    <div>
                                      <span className="text-zinc-500">Expected: </span>
                                      <code className="text-green-400">{JSON.stringify(scenario.expectedOutput)}</code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4 mt-4">
            <div className="space-y-3">
              {templates.map((template, idx) => (
                <Card key={idx} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-zinc-950 p-3 rounded overflow-auto text-zinc-300">
                      {template.code}
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCode(template.code)}
                      className="mt-3 border-zinc-700"
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
