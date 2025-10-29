# AI-Powered Testing Features

This guide covers the advanced AI features available in the API Command Hub for intelligent test analysis, response summarization, endpoint optimization, and automated test generation.

## 🌟 Features Overview

### 1. **AI Test Result Analysis** 🔍
Analyze failed test cases and get AI-powered recommendations for fixes.

**What it does:**
- Identifies root causes of test failures
- Provides specific code fixes and suggestions
- Detects common patterns across multiple failures
- Offers preventive measures to avoid future issues

**Use Case:** When batch tests fail, use this feature to quickly understand why and how to fix them.

### 2. **Response Summarization** 📝
Convert technical API responses into plain English summaries.

**What it does:**
- Translates technical JSON responses into readable explanations
- Extracts key information and highlights important fields
- Makes API responses accessible to non-technical stakeholders
- Provides context about what the response means

**Use Case:** Share API response insights with product managers, designers, or clients who aren't familiar with technical details.

### 3. **Endpoint Optimization** ⚡
Get AI-powered suggestions to improve API endpoint performance, security, and design.

**What it does:**
- Analyzes response times and identifies performance bottlenecks
- Provides security recommendations based on headers and status codes
- Suggests API design improvements
- Offers code examples for implementing optimizations

**Use Case:** Optimize slow endpoints, improve security posture, or enhance API design quality.

### 4. **Schema-Based Test Generation** 🤖
Automatically generate comprehensive test cases from API schemas or response examples.

**What it does:**
- Generates 1-50 test cases based on JSON Schema or sample responses
- Covers happy path, edge cases, error scenarios, and security tests
- Creates both positive and negative test cases
- Includes performance testing scenarios

**Use Case:** Quickly create a complete test suite for new endpoints without manual test writing.

## 🚀 Quick Start

### Using AI Analysis Panel

The `AIAnalysisPanel` component provides a unified interface for test analysis, response summarization, and endpoint optimization.

```tsx
import { AIAnalysisPanel } from "@/modules/ai/components";

function MyComponent() {
  return (
    <AIAnalysisPanel
      workspaceId={workspaceId}
      responseData={{
        method: "GET",
        url: "https://api.example.com/users",
        statusCode: 200,
        responseTime: 250,
        responseBody: { users: [...] },
        requestHeaders: { "Content-Type": "application/json" },
        responseHeaders: { "Cache-Control": "max-age=3600" },
        responseSize: 1024,
      }}
      testResults={[
        {
          name: "Get users endpoint",
          method: "GET",
          url: "https://api.example.com/users",
          status: "failed",
          statusCode: 500,
          responseTime: 5000,
          errorMessage: "Internal Server Error",
        },
      ]}
    />
  );
}
```

### Using Schema Test Generator

The `SchemaTestGenerator` component allows users to generate test cases from JSON schemas or response examples.

```tsx
import { SchemaTestGenerator } from "@/modules/ai/components";

function MyComponent() {
  return (
    <SchemaTestGenerator
      workspaceId={workspaceId}
      collectionId={collectionId}
      onTestsGenerated={(tests) => {
        console.log("Generated tests:", tests);
      }}
    />
  );
}
```

## 🔌 Using Hooks Directly

For more control, you can use the React Query hooks directly:

```tsx
import {
  useAnalyzeTestResults,
  useSummarizeResponse,
  useOptimizeEndpoint,
  useGenerateTestsFromSchema,
} from "@/modules/ai/hooks/use-response-analysis";

function MyComponent() {
  const analyzeTests = useAnalyzeTestResults(workspaceId);
  const summarize = useSummarizeResponse(workspaceId);
  const optimize = useOptimizeEndpoint(workspaceId);
  const generateTests = useGenerateTestsFromSchema(workspaceId);

  // Analyze test results
  const handleAnalyze = () => {
    analyzeTests.mutate({
      testResults: [...],
      context: "Batch test run #5",
    });
  };

  // Summarize response
  const handleSummarize = () => {
    summarize.mutate({
      method: "GET",
      url: "https://api.example.com/users",
      statusCode: 200,
      responseTime: 250,
      responseBody: { users: [...] },
    });
  };

  // Optimize endpoint
  const handleOptimize = () => {
    optimize.mutate({
      method: "GET",
      url: "https://api.example.com/users",
      responseTime: 250,
      statusCode: 200,
      responseSize: 1024,
    });
  };

  // Generate tests from schema
  const handleGenerate = () => {
    generateTests.mutate({
      endpoint: "https://api.example.com/users",
      method: "GET",
      responseSchema: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
      numberOfTests: 10,
    });
  };

  return (
    <div>
      <button onClick={handleAnalyze}>Analyze Tests</button>
      <button onClick={handleSummarize}>Summarize Response</button>
      <button onClick={handleOptimize}>Optimize Endpoint</button>
      <button onClick={handleGenerate}>Generate Tests</button>

      {analyzeTests.data?.success && (
        <div>{analyzeTests.data.content}</div>
      )}
    </div>
  );
}
```

## 📊 Response Formats

### Test Analysis Response

```typescript
{
  success: true,
  content: "## Root Cause Analysis\n\n...",
  model: "gemini-2.0-flash",
  metrics: {
    totalTests: 10,
    passedTests: 7,
    failedTests: 3,
    successRate: 70
  }
}
```

### Response Summary

```typescript
{
  success: true,
  content: "## API Response Summary\n\n...",
  model: "gemini-2.0-flash",
  metadata: {
    method: "GET",
    statusCode: 200,
    responseTime: 250
  }
}
```

### Endpoint Optimization

```typescript
{
  success: true,
  content: "## Optimization Recommendations\n\n...",
  model: "gemini-2.0-flash",
  metrics: {
    responseTime: 250,
    statusCode: 200,
    responseSize: 1024
  }
}
```

### Test Generation

```typescript
{
  success: true,
  content: "## Generated Test Cases\n\n...",
  testCases: [...],
  model: "gemini-2.0-flash"
}
```

## 🎯 Best Practices

### 1. Test Analysis
- **Provide context**: Include test run ID or batch number for better context
- **Batch similar failures**: Group related test failures for more accurate analysis
- **Review suggestions**: AI suggestions are recommendations—review before implementing

### 2. Response Summarization
- **Include headers**: Provide request/response headers for better context
- **Use for communication**: Great for explaining API behavior to non-technical team members
- **Check accuracy**: Verify AI summaries match actual response data

### 3. Endpoint Optimization
- **Provide complete metrics**: Include response time, size, and headers
- **Prioritize recommendations**: Focus on high-impact suggestions first
- **Test changes**: Validate performance improvements after implementing suggestions

### 4. Schema-Based Test Generation
- **Use detailed schemas**: More detailed schemas = better test coverage
- **Adjust test count**: Start with 10-15 tests, increase for complex endpoints
- **Review generated tests**: AI-generated tests may need refinement
- **Combine with manual tests**: Use as a starting point, add domain-specific tests

## 🔐 Security & Privacy

All AI features:
- ✅ Verify workspace membership before processing
- ✅ Use authenticated API calls
- ✅ Process data through secure Google Gemini API
- ✅ Don't store sensitive data in AI prompts
- ✅ Use `gemini-2.0-flash` (stable, production-ready model)

## ⚙️ Configuration

The AI features use the following environment variable:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

All features use the **Gemini 2.0 Flash** model for fast, cost-effective analysis.

## 🐛 Troubleshooting

### "Failed to analyze test results"
- Check your Google API key is valid
- Ensure you have workspace access
- Verify test results data is properly formatted

### "Invalid JSON format"
- Check your schema/response JSON syntax
- Use JSON validator before submitting
- Ensure all quotes and braces are balanced

### Response taking too long
- Reduce number of tests being analyzed
- Lower test generation count
- Check your API quota limits

## 📈 Performance Tips

- **Batch operations**: Analyze multiple tests at once rather than individually
- **Cache results**: Store AI analysis results to avoid re-processing
- **Set reasonable limits**: Don't generate more than 30 tests at once
- **Monitor quota**: Track Google AI API usage to avoid rate limits

## 🎨 UI Integration Examples

### Add to Response Viewer

```tsx
import { AIAnalysisPanel } from "@/modules/ai/components";

<AIAnalysisPanel
  workspaceId={workspaceId}
  responseData={currentResponse}
/>
```

### Add to Batch Test Results

```tsx
import { AIAnalysisPanel } from "@/modules/ai/components";

<AIAnalysisPanel
  workspaceId={workspaceId}
  testResults={batchResults.filter(r => r.status !== "success")}
/>
```

### Add to Test Generator Dialog

```tsx
import { SchemaTestGenerator } from "@/modules/ai/components";

<Dialog>
  <DialogContent>
    <SchemaTestGenerator
      workspaceId={workspaceId}
      onTestsGenerated={handleTestsCreated}
    />
  </DialogContent>
</Dialog>
```

## 🚀 Next Steps

1. **Integrate UI components** into existing views
2. **Add markdown rendering** for rich AI responses
3. **Implement caching** for frequently analyzed endpoints
4. **Add export functionality** for AI recommendations
5. **Create saved analysis templates** for common scenarios

## 📚 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

**Model Used**: `gemini-2.0-flash` (stable, production-ready)
**Last Updated**: January 2025
