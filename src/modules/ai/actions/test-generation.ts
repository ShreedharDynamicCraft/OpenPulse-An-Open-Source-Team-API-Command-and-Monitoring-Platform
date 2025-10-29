"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export interface GeneratedTest {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: any;
  expectedStatus?: number;
  description: string;
  testType: "happy_path" | "edge_case" | "error_case" | "security" | "performance";
}

export interface TestGenerationRequest {
  workspaceId: string;
  collectionId: string;
  apiContext: {
    endpoint?: string;
    method?: string;
    description?: string;
    existingRequests?: Array<{
      name: string;
      method: string;
      url: string;
    }>;
  };
  numberOfTests: number;
  testTypes?: string[];
}

export async function generateTestCases(
  request: TestGenerationRequest
): Promise<GeneratedTest[]> {
  const session = await auth();

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: request.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: { userId: session.userId },
          },
        },
      ],
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are an expert API testing engineer. Generate ${request.numberOfTests} comprehensive test cases for an API.

Context:
- Endpoint: ${request.apiContext.endpoint || "Not specified"}
- Method: ${request.apiContext.method || "Not specified"}
- Description: ${request.apiContext.description || "Not specified"}
- Existing requests: ${JSON.stringify(request.apiContext.existingRequests || [], null, 2)}

Test Types to Include: ${request.testTypes?.join(", ") || "all types (happy path, edge cases, error cases, security, performance)"}

Generate diverse test cases covering:
1. **Happy Path**: Normal successful scenarios
2. **Edge Cases**: Boundary values, empty data, special characters
3. **Error Cases**: Invalid inputs, missing required fields, wrong data types
4. **Security**: SQL injection, XSS, authentication/authorization tests
5. **Performance**: Load testing scenarios, concurrent requests

For each test case, provide:
- name: Descriptive test name
- method: HTTP method (GET, POST, PUT, DELETE, PATCH)
- url: Full URL with path and query parameters
- headers: Required headers (if any)
- body: Request body (if applicable)
- expectedStatus: Expected HTTP status code
- description: What the test validates
- testType: Type of test (happy_path, edge_case, error_case, security, performance)

Return ONLY a valid JSON array of test cases, no markdown formatting.

Example format:
[
  {
    "name": "Get user by valid ID",
    "method": "GET",
    "url": "https://api.example.com/users/123",
    "headers": {"Authorization": "Bearer token"},
    "expectedStatus": 200,
    "description": "Validates successful retrieval of user data",
    "testType": "happy_path"
  }
]`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Parse JSON from response (handle markdown code blocks if present)
  let jsonText = responseText.trim();
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/```\n?/g, "");
  }

  try {
    const tests: GeneratedTest[] = JSON.parse(jsonText);
    return tests.slice(0, request.numberOfTests); // Ensure we don't exceed requested number
  } catch (error) {
    console.error("Failed to parse AI response:", responseText);
    throw new Error("Failed to generate test cases. Please try again.");
  }
}

export async function saveGeneratedTests(
  workspaceId: string,
  collectionId: string,
  tests: GeneratedTest[]
): Promise<{ createdCount: number; requestIds: string[] }> {
  const session = await auth();

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  const requestIds: string[] = [];

  for (const test of tests) {
    const request = await db.request.create({
      data: {
        collectionId,
        name: test.name,
        method: test.method,
        url: test.url,
        headers: test.headers || {},
        body: test.body || null,
        parameters: {
          expectedStatus: test.expectedStatus,
          description: test.description,
          testType: test.testType,
          generatedByAI: true,
        },
      },
    });
    requestIds.push(request.id);
  }

  return {
    createdCount: tests.length,
    requestIds,
  };
}
