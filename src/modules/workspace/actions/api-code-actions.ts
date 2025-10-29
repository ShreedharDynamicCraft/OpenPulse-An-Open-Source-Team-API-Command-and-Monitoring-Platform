'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function generateAPICode(
  prompt: string,
  framework: 'express' | 'fastify' | 'nextjs'
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are an expert backend developer. Generate production-ready API route code based on the user's requirements.

Framework: ${framework}

Requirements:
- Generate clean, well-structured code
- Include proper error handling
- Add input validation
- Use modern JavaScript/TypeScript best practices
- Include comments explaining key parts
- Follow ${framework} conventions
- Include necessary imports

Return ONLY a JSON object with this structure:
{
  "code": "the complete code as a string",
  "description": "brief description of what the code does",
  "endpoints": ["array of endpoint paths"],
  "dependencies": ["array of required npm packages"]
}`;

    const result = await model.generateContent([
      systemPrompt,
      `User request: ${prompt}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error generating API code:', error);
    return { success: false, error: error.message };
  }
}

export async function improveCode(
  code: string,
  framework: 'express' | 'fastify' | 'nextjs'
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a senior code reviewer. Analyze and improve the provided API code.

Framework: ${framework}

Focus on:
- Security vulnerabilities
- Performance optimizations
- Error handling
- Code structure and readability
- Best practices
- Type safety (if TypeScript)
- Input validation
- Response formatting

Return ONLY a JSON object with this structure:
{
  "improvedCode": "the improved code as a string",
  "improvements": ["list of improvements made"],
  "securityIssues": ["security issues fixed"],
  "performanceGains": ["performance improvements"]
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to improve:\n\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error improving code:', error);
    return { success: false, error: error.message };
  }
}

export async function testAPICode(
  code: string,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  requestBody?: string
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are an API testing expert. Analyze the provided code and simulate a test request.

Endpoint: ${method} ${endpoint}
${requestBody ? `Request Body: ${requestBody}` : ''}

Analyze:
1. Code correctness
2. Error handling
3. Input validation
4. Response structure
5. Status codes
6. Edge cases

Return ONLY a JSON object with this structure:
{
  "passed": boolean,
  "status": "expected HTTP status code",
  "response": "expected response object",
  "issues": ["list of issues found"],
  "suggestions": ["list of improvement suggestions"],
  "testScenarios": [
    {
      "scenario": "description",
      "input": "test input",
      "expectedOutput": "expected result",
      "passed": boolean
    }
  ]
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to test:\n\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error testing code:', error);
    return { success: false, error: error.message };
  }
}

export async function generateTestData(code: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a test data generation expert. Analyze the provided API code and generate realistic test data.

Generate:
- Valid test data that matches the expected input schema
- Include edge cases
- Use realistic values
- Cover different scenarios (valid, invalid, edge cases)

Return ONLY a JSON object with this structure:
{
  "testData": {
    "valid": "valid test data object",
    "invalid": "invalid test data for error testing",
    "edgeCases": ["array of edge case test data"]
  },
  "schema": "description of the expected input schema"
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code:\n\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error generating test data:', error);
    return { success: false, error: error.message };
  }
}

export async function generateAPITests(code: string, framework: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are an expert in API testing. Generate comprehensive test cases for the provided API code.

Framework: ${framework}
Testing frameworks: Jest/Mocha for Node.js, or appropriate testing framework

Generate:
- Unit tests for individual functions
- Integration tests for API endpoints
- Test for success scenarios
- Test for error scenarios
- Test for edge cases
- Include setup and teardown
- Mock external dependencies

Return ONLY a JSON object with this structure:
{
  "testCode": "complete test file code as a string",
  "testCases": [
    {
      "name": "test name",
      "description": "what it tests",
      "type": "unit|integration|e2e"
    }
  ],
  "coverage": "description of test coverage",
  "dependencies": ["required testing packages"]
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to generate tests for:\n\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error generating tests:', error);
    return { success: false, error: error.message };
  }
}

export async function detectEndpoints(code: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are an expert API analyzer. Analyze the provided code and detect all API endpoints.

Extract:
- All HTTP endpoints (routes)
- HTTP methods (GET, POST, PUT, DELETE, PATCH, etc.)
- Route parameters
- Query parameters
- Request body schema
- Response structure
- Middleware used
- Authentication requirements

Return ONLY a JSON object with this structure:
{
  "endpoints": [
    {
      "path": "/api/users",
      "method": "GET|POST|PUT|DELETE|PATCH",
      "description": "what the endpoint does",
      "params": ["route parameters"],
      "query": ["query parameters"],
      "bodySchema": "expected request body structure",
      "responseSchema": "expected response structure",
      "authRequired": true/false,
      "middleware": ["middleware names"]
    }
  ],
  "baseUrl": "detected base URL or path prefix",
  "framework": "detected framework"
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to analyze:\n\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error detecting endpoints:', error);
    return { success: false, error: error.message };
  }
}

export async function generateEndpointTests(endpoint: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are an API testing expert. Generate comprehensive test scenarios for the specific endpoint.

Endpoint Details:
Path: ${endpoint.path}
Method: ${endpoint.method}
Description: ${endpoint.description}
Auth Required: ${endpoint.authRequired}

Generate realistic test cases including:
- Valid request tests
- Invalid request tests
- Edge cases
- Error scenarios
- Authentication tests (if required)

Return ONLY a JSON object with this structure:
{
  "testCases": [
    {
      "name": "test case name",
      "description": "what it tests",
      "method": "HTTP method",
      "path": "endpoint path",
      "headers": {"header": "value"},
      "body": "request body if applicable",
      "expectedStatus": 200,
      "expectedResponse": "expected response structure or message",
      "testType": "success|error|edge-case|auth"
    }
  ],
  "mockData": {
    "valid": "valid test data",
    "invalid": "invalid test data for error testing"
  }
}`;

    const result = await model.generateContent([systemPrompt]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error generating endpoint tests:', error);
    return { success: false, error: error.message };
  }
}

export async function recommendEndpoints(description: string, existingEndpoints?: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are an API design expert. Based on the project description and existing endpoints, recommend additional endpoints that would be useful.

${existingEndpoints && existingEndpoints.length > 0 ? `Existing Endpoints:\n${JSON.stringify(existingEndpoints, null, 2)}` : ''}

Analyze and recommend:
- Missing CRUD operations
- Related endpoints
- Common API patterns
- Best practices

Return ONLY a JSON object with this structure:
{
  "recommendations": [
    {
      "path": "/api/resource",
      "method": "GET|POST|PUT|DELETE",
      "description": "why this endpoint is recommended",
      "priority": "high|medium|low",
      "reason": "detailed explanation",
      "relatedTo": ["existing endpoint paths it relates to"]
    }
  ],
  "patterns": ["detected or recommended patterns"],
  "suggestions": ["general improvement suggestions"]
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Project description: ${description}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error recommending endpoints:', error);
    return { success: false, error: error.message };
  }
}

// Advanced Code Editor Features

export async function debugCode(code: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are an expert debugging assistant. Analyze the code for bugs, issues, and potential problems.

Analyze for:
- Syntax errors
- Logic errors
- Runtime errors
- Memory leaks
- Performance issues
- Common mistakes
- Edge cases not handled

Return ONLY a JSON object with this structure:
{
  "issues": [
    {
      "severity": "critical|high|medium|low",
      "line": "line number or range if known",
      "type": "error type",
      "description": "detailed description",
      "fix": "suggested fix"
    }
  ],
  "suggestions": ["general improvement suggestions"],
  "status": "clean|has_issues"
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to debug:\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error debugging code:', error);
    return { success: false, error: error.message };
  }
}

export async function performSecurityAudit(code: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a cybersecurity expert. Perform a comprehensive security audit of the code.

Check for:
- SQL Injection vulnerabilities
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Authentication flaws
- Authorization issues
- Insecure data storage
- Exposed secrets/credentials
- Insecure dependencies
- Input validation issues
- Error handling that leaks info
- OWASP Top 10 vulnerabilities

Return ONLY a JSON object with this structure:
{
  "vulnerabilities": [
    {
      "severity": "critical|high|medium|low",
      "type": "vulnerability type",
      "location": "where in code",
      "description": "detailed description",
      "fix": "how to fix it",
      "cwe": "CWE ID if applicable"
    }
  ],
  "score": "security score 0-100",
  "status": "secure|needs_attention|vulnerable"
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to audit:\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error performing security audit:', error);
    return { success: false, error: error.message };
  }
}

export async function optimizePerformance(code: string, framework: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a performance optimization expert. Analyze and optimize the code for better performance.

Framework: ${framework}

Analyze for:
- Time complexity issues
- Memory usage
- Database query optimization
- Caching opportunities
- Async/await patterns
- Bundle size reduction
- Network optimization
- Algorithm efficiency

Return ONLY a JSON object with this structure:
{
  "optimizedCode": "the optimized version of the code",
  "improvements": [
    {
      "category": "performance|memory|network|database",
      "before": "what was done before",
      "after": "what changed",
      "impact": "expected performance gain",
      "reasoning": "why this optimization helps"
    }
  ],
  "metrics": {
    "estimatedSpeedGain": "percentage improvement",
    "memoryImpact": "reduced|neutral|increased"
  }
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to optimize:\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error optimizing performance:', error);
    return { success: false, error: error.message };
  }
}

export async function generateDocumentation(code: string, framework: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a technical documentation expert. Generate comprehensive documentation for the code.

Framework: ${framework}

Include:
- Overview/Introduction
- API endpoints documentation
- Request/Response examples
- Authentication details
- Error codes and meanings
- Usage examples
- Installation/Setup instructions
- Environment variables needed
- Dependencies list

Return ONLY a JSON object with this structure:
{
  "markdown": "complete documentation in markdown format",
  "sections": {
    "overview": "overview text",
    "endpoints": ["array of endpoint docs"],
    "setup": "setup instructions",
    "examples": ["code examples"]
  }
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to document:\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error generating documentation:', error);
    return { success: false, error: error.message };
  }
}

export async function explainCode(code: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a code explanation expert. Explain the code in a clear, understandable way.

Provide:
- High-level overview
- Step-by-step explanation
- What each section does
- Why certain patterns are used
- Key concepts involved
- Potential use cases

Return ONLY a JSON object with this structure:
{
  "summary": "brief summary of what the code does",
  "explanation": "detailed explanation",
  "keyPoints": ["array of key points"],
  "concepts": ["programming concepts used"],
  "flowchart": "text description of logic flow"
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to explain:\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error explaining code:', error);
    return { success: false, error: error.message };
  }
}

export async function refactorCode(code: string, style: 'clean' | 'functional' | 'oop' | 'modern') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a code refactoring expert. Refactor the code according to the specified style.

Style: ${style}

Guidelines:
- ${style === 'clean' ? 'Clean Code principles, SOLID, DRY, KISS' : ''}
- ${style === 'functional' ? 'Functional programming paradigm, pure functions, immutability' : ''}
- ${style === 'oop' ? 'Object-oriented design, encapsulation, inheritance, polymorphism' : ''}
- ${style === 'modern' ? 'Latest ECMAScript features, modern patterns, best practices' : ''}

Return ONLY a JSON object with this structure:
{
  "refactoredCode": "the refactored code",
  "changes": [
    {
      "category": "category of change",
      "description": "what was changed and why",
      "benefit": "benefit of this change"
    }
  ],
  "principles": ["design principles applied"]
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to refactor:\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error refactoring code:', error);
    return { success: false, error: error.message };
  }
}

export async function convertCodeLanguage(code: string, fromLang: string, toLang: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const systemPrompt = `You are a code translation expert. Convert the code from ${fromLang} to ${toLang}.

Ensure:
- Equivalent functionality
- Idiomatic ${toLang} code
- Proper error handling in target language
- Comments explaining non-obvious conversions
- Maintain code structure where possible

Return ONLY a JSON object with this structure:
{
  "convertedCode": "the converted code",
  "notes": ["important notes about the conversion"],
  "dependencies": ["required packages in target language"],
  "differences": ["key differences between the two versions"]
}`;

    const result = await model.generateContent([
      systemPrompt,
      `Code to convert:\n${code}`,
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanedText);

    return { success: true, data };
  } catch (error: any) {
    console.error('Error converting code:', error);
    return { success: false, error: error.message };
  }
}
