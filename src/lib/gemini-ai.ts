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
