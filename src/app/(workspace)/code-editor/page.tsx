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
  CheckCircle,
  X
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
  const [showTemplates, setShowTemplates] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Code Templates based on language
  const codeTemplates = {
    javascript: {
      'Express REST API': `const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  // TODO: Fetch users from database
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  // TODO: Create new user
  const user = req.body;
  res.status(201).json({ message: 'User created', user });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
      'Async Function': `async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}`,
      'Promise Handler': `function promiseHandler(promise) {
  return promise
    .then(result => {
      console.log('Success:', result);
      return result;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    })
    .finally(() => {
      console.log('Operation completed');
    });
}`,
      'Class Component': `class Component {
  constructor(options) {
    this.options = options;
    this.state = {};
    this.init();
  }

  init() {
    console.log('Component initialized');
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    console.log('Rendering component');
  }

  destroy() {
    console.log('Component destroyed');
  }
}`
    },
    typescript: {
      'Express REST API': `import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req: Request, res: Response<ApiResponse<User[]>>) => {
  // TODO: Fetch users from database
  res.json({ success: true, data: [] });
});

app.post('/api/users', (req: Request, res: Response<ApiResponse<User>>) => {
  const user: User = req.body;
  res.status(201).json({ success: true, data: user });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
      'Interface Definition': `interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
}`,
      'Async Generic Function': `async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}`,
      'Class with Generics': `class DataStore<T> {
  private data: Map<string, T>;

  constructor() {
    this.data = new Map();
  }

  set(key: string, value: T): void {
    this.data.set(key, value);
  }

  get(key: string): T | undefined {
    return this.data.get(key);
  }

  delete(key: string): boolean {
    return this.data.delete(key);
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  clear(): void {
    this.data.clear();
  }
}`
    },
    python: {
      'Flask REST API': `from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

# Configuration
app.config['JSON_SORT_KEYS'] = False

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    # TODO: Fetch users from database
    return jsonify({'users': []})

@app.route('/api/users', methods=['POST'])
def create_user():
    user_data = request.get_json()
    # TODO: Create user in database
    return jsonify({
        'message': 'User created',
        'user': user_data
    }), 201

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)`,
      'Class Definition': `class User:
    def __init__(self, name: str, email: str, age: int = None):
        self.name = name
        self.email = email
        self.age = age
        self.created_at = datetime.now()
    
    def __str__(self) -> str:
        return f"User(name={self.name}, email={self.email})"
    
    def __repr__(self) -> str:
        return f"User('{self.name}', '{self.email}', {self.age})"
    
    def to_dict(self) -> dict:
        return {
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'created_at': self.created_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            name=data['name'],
            email=data['email'],
            age=data.get('age')
        )`,
      'Async Function': `import asyncio
import aiohttp
from typing import Any, Dict

async def fetch_data(url: str) -> Dict[str, Any]:
    """Fetch data from API asynchronously."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                response.raise_for_status()
                data = await response.json()
                return data
    except aiohttp.ClientError as e:
        print(f"Error fetching data: {e}")
        raise

async def main():
    url = "https://api.example.com/data"
    data = await fetch_data(url)
    print(data)

if __name__ == "__main__":
    asyncio.run(main())`,
      'Decorator Function': `from functools import wraps
from time import time

def timer(func):
    """Decorator to measure function execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time()
        result = func(*args, **kwargs)
        end = time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

def validate_input(func):
    """Decorator to validate function inputs."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Add validation logic here
        if not args:
            raise ValueError("Function requires at least one argument")
        return func(*args, **kwargs)
    return wrapper`
    },
    java: {
      'Spring Boot REST API': `package com.example.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.*;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@RestController
@RequestMapping("/api")
class ApiController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        // TODO: Fetch users from database
        return ResponseEntity.ok(new ArrayList<>());
    }
    
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // TODO: Save user to database
        return ResponseEntity.status(201).body(user);
    }
}

class User {
    private String id;
    private String name;
    private String email;
    
    // Constructors, getters, setters
    public User() {}
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}`,
      'Class Definition': `public class User {
    private String id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters
    public String getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    // Setters
    public void setId(String id) {
        this.id = id;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    // toString
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\\'' +
                ", name='" + name + '\\'' +
                ", email='" + email + '\\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}`,
      'Interface Definition': `public interface Repository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
    boolean existsById(ID id);
    long count();
}

public interface UserRepository extends Repository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
}`,
      'Try-Catch Pattern': `public class DataProcessor {
    public void processData(String data) {
        try {
            // Process data
            validateData(data);
            transformData(data);
            saveData(data);
        } catch (ValidationException e) {
            logger.error("Validation failed: " + e.getMessage());
            throw new ProcessingException("Data validation failed", e);
        } catch (TransformException e) {
            logger.error("Transformation failed: " + e.getMessage());
            throw new ProcessingException("Data transformation failed", e);
        } catch (Exception e) {
            logger.error("Unexpected error: " + e.getMessage());
            throw new ProcessingException("Unexpected error during processing", e);
        } finally {
            // Cleanup resources
            cleanup();
        }
    }
    
    private void validateData(String data) throws ValidationException {
        // Validation logic
    }
    
    private void transformData(String data) throws TransformException {
        // Transformation logic
    }
    
    private void saveData(String data) {
        // Save logic
    }
    
    private void cleanup() {
        // Cleanup logic
    }
}`
    }
  };

  // Insert template into code editor
  const insertTemplate = (template: string) => {
    setCode(template);
    setShowTemplates(false);
    toast.success('Template inserted!');
  };

  // Language-specific placeholders with syntax examples
  const placeholders = {
    javascript: `// JavaScript - Start typing your code here...
// Try: Click "Templates" button for ready-to-use code snippets!

// Quick Example:
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
    
    typescript: `// TypeScript - Start typing your code here...
// Try: Click "Templates" button for ready-to-use code snippets!

// Quick Example:
import express, { Request, Response } from 'express';

interface User {
  id: string;
  name: string;
  email: string;
}

const app = express();

app.get('/api/users', (req: Request, res: Response<User[]>) => {
  res.json([]);
});

app.listen(3000);`,
    
    python: `# Python - Start typing your code here...
# Try: Click "Templates" button for ready-to-use code snippets!

# Quick Example:
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({'users': []})

if __name__ == '__main__':
    app.run(debug=True, port=5000)`,
    
    java: `// Java - Start typing your code here...
// Try: Click "Templates" button for ready-to-use code snippets!

// Quick Example:
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return new ArrayList<>();
    }
    
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return user;
    }
}`
  };

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
    <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">AI Code Editor</h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Advanced code editing with Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-48 bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
            placeholder="filename.js"
          />
          <Badge variant="outline" className="text-xs border-zinc-300 dark:border-zinc-700">
            {language}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-hidden flex">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-zinc-100 dark:bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 flex flex-col items-center py-4 space-y-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateCode}
            disabled={isGenerating}
            title="Generate Code"
            className="hover:bg-purple-100 dark:hover:bg-purple-900/50 text-zinc-900 dark:text-zinc-100"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleImproveCode}
            disabled={isImproving}
            title="Improve Code"
            className="hover:bg-blue-100 dark:hover:bg-blue-900/50 text-zinc-900 dark:text-zinc-100"
          >
            {isImproving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAnalyzeCode}
            disabled={isAnalyzing}
            title="Analyze Code"
            className="hover:bg-green-100 dark:hover:bg-green-900/50 text-zinc-900 dark:text-zinc-100"
          >
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSecurityCheck}
            disabled={isSecurityCheck}
            title="Security Check"
            className="hover:bg-red-100 dark:hover:bg-red-900/50 text-zinc-900 dark:text-zinc-100"
          >
            {isSecurityCheck ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDebugCode}
            disabled={isDebugging}
            title="Debug"
            className="hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-zinc-900 dark:text-zinc-100"
          >
            {isDebugging ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bug className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateDocs}
            disabled={isGeneratingDocs}
            title="Generate Docs"
            className="hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-zinc-900 dark:text-zinc-100"
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
            className="text-zinc-900 dark:text-zinc-100"
          >
            <Upload className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            title="Download"
            className="text-zinc-900 dark:text-zinc-100"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyCode}
            title="Copy Code"
            className="text-zinc-900 dark:text-zinc-100"
          >
            {copied ? <Check className="w-5 h-5 text-green-500 dark:text-green-600 dark:text-green-400" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="bg-zinc-100 dark:bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-200 dark:border-zinc-800 rounded-none justify-start">
              <TabsTrigger value="editor" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">Editor</TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">AI Assistant</TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">Analysis</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">Security</TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">Performance</TabsTrigger>
              <TabsTrigger value="docs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">Docs</TabsTrigger>
            </TabsList>

            {/* Editor Tab */}
            <TabsContent value="editor" className="flex-1 m-0 p-0 overflow-hidden flex flex-col">
              <div className="flex-1 flex flex-col min-h-0">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Code Editor</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="text-xs h-8 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    >
                      <FileCode className="w-3 h-3 mr-1.5" />
                      Templates
                    </Button>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                    </select>
                    <select
                      value={framework}
                      onChange={(e) => setFramework(e.target.value as any)}
                      className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      <option value="express">Express.js</option>
                      <option value="fastify">Fastify</option>
                      <option value="nextjs">Next.js</option>
                    </select>
                  </div>
                </div>

                {/* Code Templates Panel */}
                {showTemplates && (
                  <div className="absolute top-14 right-4 z-50 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl">
                    <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Code Templates</h3>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowTemplates(false)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="p-2 max-h-96 overflow-y-auto">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 px-2 py-2">
                        {language.toUpperCase()} Templates
                      </p>
                      <div className="space-y-1">
                        {Object.entries(codeTemplates[language]).map(([templateName, templateCode]) => (
                          <button
                            key={templateName}
                            onClick={() => insertTemplate(templateCode)}
                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <FileCode className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                              <span>{templateName}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Code Editor Area with VS Code Theme */}
                <div className="flex-1 overflow-y-auto overflow-x-auto bg-white dark:bg-[#1e1e1e] relative" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                  {/* Welcome Card for Empty Editor */}
                  {!code && showWelcomeCard && (
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-96 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              Welcome to AI Code Editor!
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowWelcomeCard(false)}
                              className="h-6 w-6 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                            >
                              <X className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                            </Button>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                            Get started with professional code templates and AI assistance
                          </p>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                              <FileCode className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              <span><strong>Templates:</strong> {Object.keys(codeTemplates[language]).length} ready-to-use {language} snippets</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                              <Code2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span><strong>Line Numbers:</strong> Professional code editing</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                              <Sparkles className="w-3 h-3 text-green-600 dark:text-green-400" />
                              <span><strong>AI Features:</strong> Generate, improve & analyze code</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setShowTemplates(true)}
                            className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <FileCode className="w-3 h-3 mr-1.5" />
                            Browse Templates
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative min-h-full">
                    {/* Line Numbers */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-zinc-50 dark:bg-[#1e1e1e] border-r border-zinc-200 dark:border-zinc-800 select-none">
                      <div className="py-3 px-2 space-y-[3px]">
                        {code.split('\n').map((_, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-right text-zinc-400 dark:text-zinc-600 leading-6 font-mono"
                          >
                            {idx + 1}
                          </div>
                        ))}
                        {!code && <div className="text-xs text-right text-zinc-400 dark:text-zinc-600 leading-6 font-mono">1</div>}
                      </div>
                    </div>

                    {/* Code Textarea */}
                    <Textarea
                      ref={textareaRef}
                      placeholder={placeholders[language]}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="code-editor-textarea w-full min-h-[600px] pl-14 pr-4 py-3 font-mono text-sm bg-transparent border-0 text-zinc-900 dark:text-zinc-100 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 leading-6 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 placeholder:text-xs"
                      style={{
                        tabSize: 2,
                        WebkitTextFillColor: 'inherit',
                      }}
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-[#007acc] border-t border-zinc-200 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-600 dark:text-white font-medium">
                      Ln {code.split('\n').length}, Col {code.length}
                    </span>
                    <span className="text-zinc-600 dark:text-white">
                      {language.toUpperCase()}
                    </span>
                    <span className="text-zinc-600 dark:text-white">
                      {framework}
                    </span>
                    <span className="text-zinc-600 dark:text-white">
                      UTF-8
                    </span>
                    <span className="text-zinc-600 dark:text-white flex items-center gap-1" title="Code templates available">
                      <FileCode className="w-3 h-3" />
                      {Object.keys(codeTemplates[language]).length} templates
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 dark:text-white">
                      {code.split('\n').length} lines
                    </span>
                    <span className="text-zinc-600 dark:text-white">
                      {code.length} chars
                    </span>
                    <span className="text-zinc-600 dark:text-white" title="Click Templates button for code snippets">
                      💡 Tip: Use Templates
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai" className="flex-1 m-0 p-4 overflow-auto space-y-4">
              <Card className="bg-white dark:bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-zinc-900 dark:text-zinc-100">
                    <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-600 dark:text-purple-400" />
                    AI Code Generation
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-600 dark:text-zinc-400">
                    Describe what you want to build, and AI will generate the code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="E.g., Create a REST API endpoint for user authentication with JWT..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                  <Button
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
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
                <Card className="bg-white dark:bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-sm text-zinc-900 dark:text-zinc-100">AI Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-700 dark:text-zinc-700 dark:text-zinc-300">{aiResponse}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="flex-1 m-0 p-4 overflow-y-auto overflow-x-hidden space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {/* Code Analysis Card */}
              <Card className="bg-white dark:bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-zinc-900 dark:text-zinc-100">
                    <Search className="w-4 h-4 text-green-500 dark:text-green-600 dark:text-green-400" />
                    API Route Detection & Analysis
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-zinc-600 dark:text-zinc-400">
                    Detect all API routes, supported methods, and generate test cases with Gemini AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleAnalyzeCode}
                    disabled={isAnalyzing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
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
                        <div className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Detected Framework
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {codeAnalysis.framework}
                          </Badge>
                        </div>
                      )}

                      {/* Detected Routes */}
                      <div className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-green-600 dark:text-green-400" />
                          Detected API Routes ({codeAnalysis.endpoints?.length || 0})
                        </h3>
                        <div className="space-y-3">
                          {codeAnalysis.endpoints?.map((endpoint: any, idx: number) => (
                            <div key={idx} className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 space-y-2">
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
                                  <code className="text-sm text-indigo-600 dark:text-indigo-400">{endpoint.path}</code>
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
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{endpoint.description}</p>
                              )}
                              
                              {endpoint.parameters && endpoint.parameters.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-zinc-600 dark:text-zinc-500 mb-1">Parameters:</p>
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
                      <div className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-cyan-400" />
                          Supported Operations
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((method) => {
                            const count = codeAnalysis.endpoints?.filter((e: any) => e.method === method).length || 0;
                            return (
                              <div key={method} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">{method}</span>
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
                <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      AI Generated Test Cases
                    </CardTitle>
                    <CardDescription>
                      Test cases for {selectedRoute.method} {selectedRoute.path}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedTests.map((test: any, idx: number) => (
                      <div key={idx} className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-zinc-100">{test.name || test.scenario}</h4>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{test.description}</p>
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
                            <p className="text-xs text-zinc-600 dark:text-zinc-500">Request Body:</p>
                            <pre className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-[200px]">
                              {JSON.stringify(test.requestBody, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Expected Response */}
                        {test.expectedResponse && (
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-600 dark:text-zinc-500">Expected Response:</p>
                            <pre className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded text-xs overflow-auto max-h-[200px]">
                              {JSON.stringify(test.expectedResponse, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Test Assertions */}
                        {test.assertions && test.assertions.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-600 dark:text-zinc-500">Assertions:</p>
                            <ul className="space-y-1 ml-4">
                              {test.assertions.map((assertion: string, aidx: number) => (
                                <li key={aidx} className="text-xs text-zinc-600 dark:text-zinc-400 list-disc">
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
                <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                          ({testResults.passedScenarios}/{testResults.totalScenarios} scenarios passed)
                        </span>
                      )}
                    </div>

                    {/* Response */}
                    {testResults.response && (
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-600 dark:text-zinc-400">Response:</label>
                        <pre className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3 text-xs overflow-auto max-h-[200px]">
                          {typeof testResults.response === 'string' 
                            ? testResults.response 
                            : JSON.stringify(testResults.response, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Scenarios */}
                    {testResults.scenarios && testResults.scenarios.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm text-zinc-600 dark:text-zinc-400">Test Scenarios:</label>
                        <div className="space-y-2">
                          {testResults.scenarios.map((scenario: any, idx: number) => (
                            <div key={idx} className="bg-zinc-100 dark:bg-zinc-950 p-3 rounded border border-zinc-200 dark:border-zinc-800">
                              <div className="flex items-center gap-2 mb-2">
                                {scenario.passed ? (
                                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                )}
                                <span className="text-sm font-medium">{scenario.name}</span>
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">{scenario.description}</p>
                              {scenario.expectedResponse && (
                                <pre className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded text-xs overflow-auto">
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
                        <label className="text-sm text-zinc-600 dark:text-zinc-400">Recommendations:</label>
                        <ul className="space-y-1">
                          {testResults.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                              <Sparkles className="w-3 h-3 mt-0.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
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
              <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
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
                        <div className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Security Score</h3>
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
                          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 text-red-600 dark:text-red-400">Vulnerabilities Found</h3>
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
                                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{vuln.type}</span>
                                  {vuln.cwe && (
                                    <span className="text-xs text-zinc-600 dark:text-zinc-500">({vuln.cwe})</span>
                                  )}
                                </div>
                                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                                  <strong>Location:</strong> {vuln.location}
                                </p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">
                                  {vuln.description}
                                </p>
                                <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded mt-2">
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Fix:</p>
                                  <p className="text-xs text-green-600 dark:text-green-400">{vuln.fix}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {securityIssues.status === 'secure' && (
                        <div className="bg-green-950/30 border border-green-800 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm text-green-700 dark:text-green-300">No major security issues detected!</span>
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
              <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
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
                      <div className="bg-zinc-100 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 text-yellow-600 dark:text-yellow-400">Performance Metrics</h3>
                        <div className="space-y-2 text-sm">
                          {performanceMetrics.metrics && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-600 dark:text-zinc-400">Estimated Speed Gain:</span>
                                <Badge className="bg-green-600">{performanceMetrics.metrics.estimatedSpeedGain}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-600 dark:text-zinc-400">Memory Impact:</span>
                                <Badge variant="outline">{performanceMetrics.metrics.memoryImpact}</Badge>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {performanceMetrics.improvements && performanceMetrics.improvements.length > 0 && (
                        <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Optimizations Applied</h3>
                          <div className="space-y-3">
                            {performanceMetrics.improvements.map((improvement: any, idx: number) => (
                              <div key={idx} className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded border border-zinc-300 dark:border-zinc-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`
                                    ${improvement.category === 'performance' ? 'bg-yellow-600' : ''}
                                    ${improvement.category === 'memory' ? 'bg-blue-600' : ''}
                                    ${improvement.category === 'network' ? 'bg-green-600' : ''}
                                    ${improvement.category === 'database' ? 'bg-purple-600' : ''}
                                  `}>
                                    {improvement.category}
                                  </Badge>
                                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Impact: {improvement.impact}</span>
                                </div>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
                                  <strong>Before:</strong> {improvement.before}
                                </p>
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
                                  <strong>After:</strong> {improvement.after}
                                </p>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
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
              <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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
                    <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Generated Documentation</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(documentation);
                            toast.success('Documentation copied!');
                          }}
                          className="border-zinc-300 dark:border-zinc-700"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs text-zinc-700 dark:text-zinc-300 overflow-auto max-h-[500px] whitespace-pre-wrap">
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
        <div className="w-64 bg-zinc-50 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-4 space-y-4 overflow-y-auto shrink-0">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImproveCode}
                disabled={isImproving}
                className="w-full justify-start border-zinc-300 dark:border-zinc-700"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Improve Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOptimizePerformance}
                disabled={isOptimizing}
                className="w-full justify-start border-zinc-300 dark:border-zinc-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDebugCode}
                disabled={isDebugging}
                className="w-full justify-start border-zinc-300 dark:border-zinc-700"
              >
                <Bug className="w-4 h-4 mr-2" />
                Debug Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyzeCode}
                disabled={isAnalyzing}
                className="w-full justify-start border-zinc-300 dark:border-zinc-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSecurityCheck}
                disabled={isSecurityCheck}
                className="w-full justify-start border-zinc-300 dark:border-zinc-700"
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
                <span className="text-zinc-600 dark:text-zinc-400">Lines:</span>
                <span>{code.split('\n').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Characters:</span>
                <span>{code.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Language:</span>
                <Badge variant="outline" className="text-xs">{language}</Badge>
              </div>
            </div>
          </div>

          {debugSuggestions && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">Debug Results</h3>
                <Badge variant={debugSuggestions.status === 'clean' ? 'default' : 'destructive'}>
                  {debugSuggestions.status}
                </Badge>
              </div>
              
              {debugSuggestions.issues && debugSuggestions.issues.length > 0 && (
                <div className="space-y-2 mb-3">
                  <h4 className="text-xs font-medium text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400">Issues Found:</h4>
                  {debugSuggestions.issues.map((issue: any, idx: number) => (
                    <div key={idx} className="text-xs bg-zinc-100 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
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
                        <span className="text-zinc-600 dark:text-zinc-400">{issue.type}</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 mb-1">{issue.description}</p>
                      {issue.fix && (
                        <p className="text-green-600 dark:text-green-400 text-[10px] mt-1">Fix: {issue.fix}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {debugSuggestions.suggestions && debugSuggestions.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-zinc-900 dark:text-zinc-100 text-zinc-600 dark:text-zinc-400">Suggestions:</h4>
                  {debugSuggestions.suggestions.map((suggestion: string, idx: number) => (
                    <div key={idx} className="text-xs bg-zinc-100 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800">
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
