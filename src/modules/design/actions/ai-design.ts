"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function generateAPIDesign(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const systemPrompt = `You are an expert API architect and designer. Generate a detailed API design based on the user's requirements.

Return a JSON object with the following structure:
{
  "title": "API Design Title",
  "description": "Brief description",
  "endpoints": [
    {
      "method": "GET|POST|PUT|DELETE|PATCH",
      "path": "/api/endpoint",
      "description": "What this endpoint does",
      "requestBody": "Request body structure (if applicable)",
      "response": "Response structure"
    }
  ],
  "architecture": {
    "pattern": "REST|GraphQL|WebSocket|gRPC",
    "components": ["Component 1", "Component 2"],
    "database": "Database type and schema suggestions"
  },
  "bestPractices": ["Practice 1", "Practice 2"]
}

Only return valid JSON, no markdown or code blocks.`;

    const result = await model.generateContent([
      systemPrompt,
      `User request: ${prompt}`,
    ]);

    const response = result.response.text();
    
    // Clean up the response to get valid JSON
    let jsonText = response.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    
    const parsedResponse = JSON.parse(jsonText.trim());
    
    return {
      success: true,
      data: parsedResponse,
    };
  } catch (error: any) {
    console.error("Error generating API design:", error);
    return {
      success: false,
      error: error.message || "Failed to generate API design",
    };
  }
}

export async function improveAPIDesign(currentDesign: string, improvement: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const systemPrompt = `You are an expert API architect. Analyze the current API design and suggest improvements.

Current Design:
${currentDesign}

Improvement Request:
${improvement}

Return a JSON object with:
{
  "suggestions": [
    {
      "type": "security|performance|scalability|bestPractice",
      "title": "Suggestion title",
      "description": "Detailed explanation",
      "implementation": "How to implement this"
    }
  ],
  "updatedDesign": "Improved design overview"
}

Only return valid JSON, no markdown or code blocks.`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response.text();
    
    // Clean up the response
    let jsonText = response.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    
    const parsedResponse = JSON.parse(jsonText.trim());
    
    return {
      success: true,
      data: parsedResponse,
    };
  } catch (error: any) {
    console.error("Error improving API design:", error);
    return {
      success: false,
      error: error.message || "Failed to improve API design",
    };
  }
}

export async function generateDocumentationFromDesign(design: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate comprehensive API documentation from this design:

${design}

Create detailed documentation in markdown format including:
- Overview
- Authentication
- Endpoints (with examples)
- Error codes
- Rate limiting
- Code examples in multiple languages

Return well-formatted markdown documentation.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    console.error("Error generating documentation:", error);
    return {
      success: false,
      error: error.message || "Failed to generate documentation",
    };
  }
}

export async function validateAPIDesign(design: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Validate this API design and identify potential issues:

${design}

Return a JSON object with:
{
  "isValid": true/false,
  "score": 0-100,
  "issues": [
    {
      "severity": "critical|warning|info",
      "category": "security|performance|design|naming",
      "message": "Issue description",
      "suggestion": "How to fix"
    }
  ],
  "strengths": ["Good point 1", "Good point 2"]
}

Only return valid JSON, no markdown or code blocks.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean up the response
    let jsonText = response.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    
    const parsedResponse = JSON.parse(jsonText.trim());
    
    return {
      success: true,
      data: parsedResponse,
    };
  } catch (error: any) {
    console.error("Error validating API design:", error);
    return {
      success: false,
      error: error.message || "Failed to validate API design",
    };
  }
}

export async function generateTestCases(endpoint: string, method: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate comprehensive test cases for this API endpoint:

Method: ${method}
Endpoint: ${endpoint}

Return a JSON object with:
{
  "testCases": [
    {
      "name": "Test case name",
      "type": "positive|negative|edge",
      "description": "What it tests",
      "request": {
        "method": "${method}",
        "url": "${endpoint}",
        "headers": {},
        "body": {}
      },
      "expectedResponse": {
        "status": 200,
        "body": {}
      }
    }
  ]
}

Only return valid JSON, no markdown or code blocks.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean up the response
    let jsonText = response.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    
    const parsedResponse = JSON.parse(jsonText.trim());
    
    return {
      success: true,
      data: parsedResponse,
    };
  } catch (error: any) {
    console.error("Error generating test cases:", error);
    return {
      success: false,
      error: error.message || "Failed to generate test cases",
    };
  }
}
