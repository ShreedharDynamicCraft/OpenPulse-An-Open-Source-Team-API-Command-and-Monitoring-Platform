import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

export interface CodeReviewRequest {
  code: string;
  language?: string;
  context?: string;
  type: "review" | "explain" | "optimize" | "test";
}

export interface GitHubReviewRequest {
  repoUrl: string;
  context?: string;
}

/**
 * Perform AI code review on a code snippet
 */
export async function reviewCode(request: CodeReviewRequest) {
  if (!request.code || request.code.trim() === "") {
    return {
      success: false,
      error: "Code cannot be empty",
      content: null,
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let promptType = "";
    switch (request.type) {
      case "review":
        promptType = "Perform a thorough code review. Analyze code quality, best practices, potential bugs, security issues, and suggest improvements.";
        break;
      case "explain":
        promptType = "Explain this code in detail. Describe what it does, how it works, and break down complex parts.";
        break;
      case "optimize":
        promptType = "Analyze this code for optimization opportunities. Suggest performance improvements, better algorithms, and cleaner patterns.";
        break;
      case "test":
        promptType = "Generate comprehensive test cases for this code. Include unit tests, edge cases, and error scenarios.";
        break;
    }

    const prompt = `
You are an expert code reviewer and software architect.

${promptType}

**Language**: ${request.language || "Not specified"}
${request.context ? `**Context**: ${request.context}\n` : ""}

**Code**:
\`\`\`${request.language || ""}
${request.code}
\`\`\`

Provide a detailed analysis in well-structured markdown format.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-2.0-flash",
    };
  } catch (error: any) {
    console.error("Code review error:", error);
    return {
      success: false,
      error: error.message || "Failed to review code",
      content: null,
    };
  }
}

/**
 * Review a GitHub repository
 */
export async function reviewGitHubRepo(request: GitHubReviewRequest) {
  try {
    // Parse GitHub URL
    const urlMatch = request.repoUrl.match(
      /github\.com\/([^\/]+)\/([^\/]+)/
    );

    if (!urlMatch) {
      return {
        success: false,
        error: "Invalid GitHub URL format. Expected: https://github.com/owner/repo",
      };
    }

    const [, owner, repo] = urlMatch;

    // Fetch repository information from GitHub API
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "API-Command-Hub",
        },
      }
    );

    if (!repoResponse.ok) {
      return {
        success: false,
        error: "Failed to fetch repository from GitHub. Check if the repo is public.",
      };
    }

    const repoData = await repoResponse.json();

    // Fetch recent commits
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "API-Command-Hub",
        },
      }
    );

    const commits = await commitsResponse.json();

    // Fetch file structure
    const contentsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "API-Command-Hub",
        },
      }
    );

    const contents = await contentsResponse.json();

    // Build context for AI
    const filesInfo = Array.isArray(contents)
      ? contents.map((file: any) => `- ${file.name} (${file.type})`).join("\n")
      : "Could not fetch file structure";

    const commitsInfo = Array.isArray(commits)
      ? commits
          .map(
            (commit: any) =>
              `- ${commit.commit.message} (${new Date(commit.commit.author.date).toLocaleDateString()})`
          )
          .join("\n")
      : "No recent commits";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert software architect and code reviewer. Analyze this GitHub repository:

**Repository**: ${repoData.full_name}
**Description**: ${repoData.description || "No description"}
**Language**: ${repoData.language || "Unknown"}
**Stars**: ${repoData.stargazers_count}
**Forks**: ${repoData.forks_count}

**File Structure**:
${filesInfo}

**Recent Commits**:
${commitsInfo}

${request.context ? `**Additional Context**: ${request.context}\n\n` : ""}

Provide a comprehensive repository review covering:

1. **Project Overview**: purpose and architecture
2. **Technology Stack**: frameworks and tools used
3. **Code Quality**: overall assessment based on visible patterns
4. **Best Practices**: what's done well
5. **Potential Improvements**: suggestions for enhancement
6. **Security Considerations**: any visible security patterns
7. **Recommendations**: actionable next steps

Format your analysis in well-structured markdown.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-2.0-flash",
      repositoryInfo: {
        name: repoData.full_name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        url: repoData.html_url,
      },
    };
  } catch (error: any) {
    console.error("GitHub review error:", error);
    return {
      success: false,
      error: error.message || "Failed to review GitHub repository",
      content: null,
    };
  }
}

/**
 * Generate AI response for general chat questions
 */
export async function generateChatResponse(
  message: string,
  context?: string
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a helpful AI assistant for an API Testing and Monitoring Platform. 
    
User question: ${message}

${context ? `Context: ${context}` : ""}

Provide a helpful, concise, and accurate response. Format your response in markdown for better readability.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-2.0-flash",
    };
  } catch (error: any) {
    console.error("Chat AI error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate response",
      content: null,
    };
  }
}

/**
 * Analyze test results and suggest fixes
 */
export async function analyzeTestResults(data: {
  testResults: Array<{
    name: string;
    method: string;
    url: string;
    status: "success" | "failed" | "error";
    statusCode?: number;
    responseTime?: number;
    errorMessage?: string;
  }>;
  context?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const failedTests = data.testResults.filter(t => t.status !== "success");
    const totalTests = data.testResults.length;
    const successRate = ((totalTests - failedTests.length) / totalTests * 100).toFixed(1);

    const prompt = `You are an expert API testing analyst. Analyze these test results and provide actionable insights.

**Test Summary:**
- Total Tests: ${totalTests}
- Passed: ${totalTests - failedTests.length}
- Failed: ${failedTests.length}
- Success Rate: ${successRate}%

**Failed Tests:**
${failedTests.map((test, i) => `
${i + 1}. **${test.name}**
   - Method: ${test.method}
   - URL: ${test.url}
   - Status Code: ${test.statusCode || "N/A"}
   - Response Time: ${test.responseTime || "N/A"}ms
   - Error: ${test.errorMessage || "No error message"}
`).join('\n')}

${data.context ? `**Additional Context:** ${data.context}\n` : ""}

Provide:
1. **Root Cause Analysis**: What's likely causing these failures?
2. **Specific Fixes**: Step-by-step solutions for each failed test
3. **Common Patterns**: Any patterns in the failures?
4. **Preventive Measures**: How to avoid these issues in the future?
5. **Code Suggestions**: Example fixes or configuration changes

Format your response in clear, actionable markdown.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-2.0-flash",
      metrics: {
        totalTests,
        passedTests: totalTests - failedTests.length,
        failedTests: failedTests.length,
        successRate: parseFloat(successRate),
      },
    };
  } catch (error: any) {
    console.error("Test analysis error:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze test results",
      content: null,
    };
  }
}

/**
 * Summarize API response in plain English
 */
export async function summarizeApiResponse(data: {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  responseBody: any;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  context?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const bodyPreview = typeof data.responseBody === 'string' 
      ? data.responseBody.substring(0, 1000)
      : JSON.stringify(data.responseBody, null, 2).substring(0, 1000);

    const prompt = `You are an API response analyzer. Explain this API response in simple, plain English.

**Request Details:**
- Method: ${data.method}
- URL: ${data.url}
- Status Code: ${data.statusCode}
- Response Time: ${data.responseTime}ms

**Response Body Preview:**
\`\`\`json
${bodyPreview}${bodyPreview.length >= 1000 ? '...' : ''}
\`\`\`

${data.responseHeaders ? `**Response Headers:**\n${Object.entries(data.responseHeaders).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n` : ""}

${data.context ? `**Context:** ${data.context}\n` : ""}

Provide a clear, non-technical summary:
1. **What happened?** - Explain the response in simple terms
2. **Was it successful?** - Based on status code and data
3. **Key Information** - Important data from the response
4. **Data Structure** - What kind of data was returned?
5. **Recommendations** - Any suggestions for the developer?

Use simple language that anyone can understand.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-2.0-flash",
      metadata: {
        method: data.method,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
      },
    };
  } catch (error: any) {
    console.error("Response summary error:", error);
    return {
      success: false,
      error: error.message || "Failed to summarize response",
      content: null,
    };
  }
}

/**
 * Provide endpoint optimization tips
 */
export async function optimizeEndpoint(data: {
  method: string;
  url: string;
  requestBody?: any;
  responseTime: number;
  statusCode: number;
  responseSize?: number;
  requestHeaders?: Record<string, string>;
  code?: string; // Optional: Backend code for the endpoint
  context?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an API optimization expert. Analyze this endpoint and provide optimization recommendations.

**Endpoint Details:**
- Method: ${data.method}
- URL: ${data.url}
- Response Time: ${data.responseTime}ms
- Status Code: ${data.statusCode}
- Response Size: ${data.responseSize ? `${(data.responseSize / 1024).toFixed(2)}KB` : "N/A"}

${data.requestBody ? `**Request Body:**\n\`\`\`json\n${JSON.stringify(data.requestBody, null, 2).substring(0, 500)}\n\`\`\`\n` : ""}

${data.requestHeaders ? `**Request Headers:**\n${Object.entries(data.requestHeaders).map(([k, v]) => `- ${k}: ${v}`).join('\n')}\n` : ""}

${data.code ? `**Backend Code:**\n\`\`\`\n${data.code.substring(0, 1000)}\n\`\`\`\n` : ""}

${data.context ? `**Context:** ${data.context}\n` : ""}

Provide comprehensive optimization tips:

1. **Performance Optimization**
   - Response time improvements
   - Caching strategies
   - Database query optimization
   - Payload size reduction

2. **Security Best Practices**
   - Authentication/Authorization
   - Input validation
   - CORS configuration
   - Rate limiting

3. **API Design**
   - RESTful best practices
   - HTTP method usage
   - Status code appropriateness
   - URL structure

4. **Error Handling**
   - Better error messages
   - Proper status codes
   - Validation feedback

5. **Code Examples**
   - Show before/after code snippets
   - Configuration improvements

Priority: Focus on the most impactful optimizations first.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-2.0-flash",
      metrics: {
        responseTime: data.responseTime,
        statusCode: data.statusCode,
        responseSize: data.responseSize,
      },
    };
  } catch (error: any) {
    console.error("Endpoint optimization error:", error);
    return {
      success: false,
      error: error.message || "Failed to optimize endpoint",
      content: null,
    };
  }
}

/**
 * Auto-generate API test cases based on schema/response
 */
export async function generateTestCasesFromSchema(data: {
  endpoint: string;
  method: string;
  responseSchema?: any;
  sampleResponse?: any;
  requestSchema?: any;
  description?: string;
  numberOfTests?: number;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const numTests = data.numberOfTests || 10;

    const prompt = `You are an expert API testing engineer. Generate ${numTests} comprehensive test cases for this API endpoint.

**Endpoint:** ${data.method} ${data.endpoint}
${data.description ? `**Description:** ${data.description}\n` : ""}

${data.responseSchema ? `**Response Schema:**\n\`\`\`json\n${JSON.stringify(data.responseSchema, null, 2)}\n\`\`\`\n` : ""}

${data.sampleResponse ? `**Sample Response:**\n\`\`\`json\n${JSON.stringify(data.sampleResponse, null, 2).substring(0, 500)}\n\`\`\`\n` : ""}

${data.requestSchema ? `**Request Schema:**\n\`\`\`json\n${JSON.stringify(data.requestSchema, null, 2)}\n\`\`\`\n` : ""}

Generate diverse test cases in JSON format covering:
1. **Happy Path** - Normal successful scenarios
2. **Edge Cases** - Boundary values, empty data, special characters
3. **Error Cases** - Invalid inputs, missing fields, wrong types
4. **Security** - Auth failures, injection attempts, XSS
5. **Performance** - Large payloads, rate limiting

Return ONLY a valid JSON array with this structure:
\`\`\`json
[
  {
    "name": "Test case name",
    "type": "happy_path|edge_case|error_case|security|performance",
    "method": "${data.method}",
    "url": "${data.endpoint}",
    "headers": {},
    "body": {},
    "expectedStatus": 200,
    "description": "What this test validates"
  }
]
\`\`\`

Generate exactly ${numTests} test cases.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Try to parse JSON from response
    let testCases = [];
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        testCases = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse test cases:", parseError);
    }

    return {
      success: true,
      content: text,
      testCases,
      model: "gemini-2.0-flash",
    };
  } catch (error: any) {
    console.error("Schema-based test generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate test cases from schema",
      content: null,
      testCases: [],
    };
  }
}

/**
 * Generate empathetic code review from harsh comments
 * Transforms terse review comments into constructive, educational feedback
 */
export async function generateEmpatheticReview(data: {
  code: string;
  language: string;
  comments: string[];
  tone?: "gentle" | "balanced" | "direct";
  model?: "gemini-2.0-flash" | "gemini-1.5-pro";
}) {
  const { code, language, comments, tone = "balanced", model = "gemini-2.0-flash" } = data;

  if (!code || !comments || comments.length === 0) {
    return {
      success: false,
      error: "Code and comments are required",
      content: null,
    };
  }

  try {
    const genModel = genAI.getGenerativeModel({ model });

    const toneGuide = {
      gentle: "extremely supportive, encouraging, and kind. Use phrases like 'great start', 'wonderful effort', 'let's explore together'",
      balanced: "professional yet friendly. Be constructive and supportive while maintaining professionalism",
      direct: "straightforward and honest, but always respectful. Focus on facts and clear improvements",
    };

    const prompt = `You are an expert code reviewer with excellent communication skills. Transform the following harsh/terse code review comments into ${toneGuide[tone]} feedback.

**Code to Review (${language}):**
\`\`\`${language}
${code}
\`\`\`

**Original Harsh Comments:**
${comments.map((c, i) => `${i + 1}. ${c}`).join("\n")}

**Your Task:**
Transform each comment into empathetic, educational feedback with:

1. **Positive Rephrasing**: Start with what's good, then suggest improvements
2. **Educational Context**: Explain WHY the change matters
3. **Code Examples**: Show specific improvements with before/after snippets
4. **Learning Resources**: Suggest relevant documentation or articles
5. **Severity Level**: Mark as 🔴 High, 🟡 Medium, or 🟢 Low priority

**Format your response as:**

# Empathetic Code Review

## Overview
Brief positive summary of the code's strengths and purpose.

---

## Review Comments

### 1. [Original Topic] - [Severity Icon]

**What's Good:**
[Acknowledge what's working]

**Suggestion:**
[Kind, constructive feedback]

**Why This Matters:**
[Educational explanation]

**Example:**
\`\`\`${language}
// Before
[original problematic code]

// After - Improved
[suggested improvement]
\`\`\`

**Learn More:**
- [Relevant resource links]

---

[Repeat for each comment]

## Summary & Next Steps

[Encouraging conclusion with prioritized action items]

**Remember:** Be ${tone} in tone, educational, and always constructive.`;

    const result = await genModel.generateContent(prompt);
    const text = result.response.text();

    return {
      success: true,
      content: text,
      model,
      metadata: {
        language,
        tone,
        commentsCount: comments.length,
      },
    };
  } catch (error: any) {
    console.error("Empathetic review generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate empathetic review",
      content: null,
    };
  }
}

/**
 * Analyze a GitHub repository and provide comprehensive code review
 * Fetches repository structure and analyzes selected files
 */
export async function reviewGitHubRepository(data: {
  repoUrl: string;
  files: Array<{ path: string; content: string; language: string }>;
  tone?: "gentle" | "balanced" | "direct";
  model?: "gemini-2.0-flash" | "gemini-1.5-pro";
}) {
  const { repoUrl, files, tone = "balanced", model = "gemini-2.0-flash" } = data;

  if (!repoUrl || !files || files.length === 0) {
    return {
      success: false,
      error: "Repository URL and files are required",
      content: null,
    };
  }

  if (files.length > 10) {
    return {
      success: false,
      error: "Maximum 10 files allowed per review",
      content: null,
    };
  }

  try {
    const genModel = genAI.getGenerativeModel({ model });

    const toneGuide = {
      gentle: "extremely supportive and encouraging",
      balanced: "professional yet friendly",
      direct: "straightforward but respectful",
    };

    const filesContent = files
      .map(
        (file, i) => `
### File ${i + 1}: \`${file.path}\` (${file.language})

\`\`\`${file.language}
${file.content}
\`\`\`
`
      )
      .join("\n");

    const prompt = `You are an expert software architect performing a comprehensive code review for a GitHub repository.

**Repository:** ${repoUrl}
**Files to Review:** ${files.length}
**Tone:** ${toneGuide[tone]}

${filesContent}

**Your Task:**
Provide a comprehensive, ${tone} repository analysis with:

# 🐙 GitHub Repository Review

## 📊 Repository Overview

**Repository:** ${repoUrl}
**Files Analyzed:** ${files.length}
**Languages Detected:** [list unique languages]

### Technology Stack
[Identify frameworks, libraries, tools used]

### Architecture Assessment
[High-level architecture description]

---

## 🎯 Code Quality Analysis

### ✅ Strengths
[What's done well - be specific and generous with praise]

### 🔄 Areas for Improvement
[Constructive suggestions organized by priority]

---

## 📁 File-by-File Analysis

[For each file, provide:]

### \`[filename]\`

**Purpose:** [What this file does]

**Code Quality:** ⭐⭐⭐⭐☆ (4/5)

**Highlights:**
- [Good practices observed]

**Suggestions:**
1. 🔴 **[High Priority Issue]**
   - What: [Description]
   - Why: [Impact]
   - How: [Solution with code example]

2. 🟡 **[Medium Priority Issue]**
   - What: [Description]
   - Why: [Impact]
   - How: [Solution]

3. 🟢 **[Low Priority/Nice to Have]**
   - What: [Description]
   - How: [Quick fix]

---

## 🔒 Security Considerations

[Security issues found or verification that code is secure]

### Potential Vulnerabilities
[List any security concerns with severity]

### Security Best Practices
[Recommendations for security improvements]

---

## ⚡ Performance Opportunities

[Performance optimization suggestions]

### Algorithm Efficiency
[Algorithmic improvements]

### Resource Usage
[Memory, network, database optimizations]

---

## 🏗️ Architecture & Design

### Design Patterns
[Patterns used well or opportunities to use patterns]

### Code Organization
[Structure, modularity, separation of concerns]

### Maintainability
[How easy is it to maintain and extend]

---

## 📚 Learning Resources

[Relevant documentation, articles, best practices for improvement areas]

---

## 🎯 Action Items (Prioritized)

### High Priority (Do First)
1. [Critical improvements]

### Medium Priority (Plan Soon)
1. [Important enhancements]

### Low Priority (Nice to Have)
1. [Minor improvements]

---

## 💡 Final Thoughts

[Encouraging summary and next steps]

**Remember:** This review is ${tone} and meant to help improve the codebase. Every suggestion is an opportunity to learn and grow! 🚀`;

    const result = await genModel.generateContent(prompt);
    const text = result.response.text();

    return {
      success: true,
      content: text,
      model,
      metadata: {
        repoUrl,
        filesCount: files.length,
        tone,
        languages: [...new Set(files.map((f) => f.language))],
      },
    };
  } catch (error: any) {
    console.error("GitHub repository review error:", error);
    return {
      success: false,
      error: error.message || "Failed to review GitHub repository",
      content: null,
    };
  }
}
