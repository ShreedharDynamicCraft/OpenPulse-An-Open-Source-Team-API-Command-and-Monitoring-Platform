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
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let prompt = "";

    switch (request.type) {
      case "review":
        prompt = `You are an expert code reviewer. Review this ${request.language || "code"} snippet and provide:
1. **Potential Issues**: bugs, errors, or problems
2. **Security Concerns**: vulnerabilities or unsafe practices
3. **Performance**: optimization opportunities
4. **Best Practices**: code quality improvements
5. **Suggestions**: specific, actionable recommendations

${request.context ? `Context: ${request.context}\n\n` : ""}
Code to review:
\`\`\`${request.language || ""}
${request.code}
\`\`\`

Provide your review in well-formatted markdown with clear sections and code examples where helpful.`;
        break;

      case "explain":
        prompt = `You are an expert software engineer. Explain this ${request.language || "code"} in detail:

\`\`\`${request.language || ""}
${request.code}
\`\`\`

${request.context ? `Context: ${request.context}\n\n` : ""}
Provide:
1. **Overview**: what this code does
2. **Line-by-line explanation**: key logic and patterns
3. **Use cases**: when to use this approach
4. **Related concepts**: relevant patterns or techniques

Format your response in markdown with clear sections.`;
        break;

      case "optimize":
        prompt = `You are a performance optimization expert. Analyze this ${request.language || "code"} and suggest optimizations:

\`\`\`${request.language || ""}
${request.code}
\`\`\`

${request.context ? `Context: ${request.context}\n\n` : ""}
Provide:
1. **Performance Analysis**: current bottlenecks
2. **Optimizations**: specific improvements with code examples
3. **Trade-offs**: explain any compromises
4. **Benchmarks**: estimated impact if known

Format with markdown and include optimized code examples.`;
        break;

      case "test":
        prompt = `You are a testing expert. Generate comprehensive tests for this ${request.language || "code"}:

\`\`\`${request.language || ""}
${request.code}
\`\`\`

${request.context ? `Context: ${request.context}\n\n` : ""}
Provide:
1. **Unit Tests**: test cases with examples
2. **Edge Cases**: scenarios to test
3. **Test Strategy**: testing approach
4. **Code Coverage**: what to test and why

Format in markdown with test code examples using popular testing frameworks.`;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-1.5-pro",
    };
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate AI response",
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
          "User-Agent": "Postman-Clone-App",
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
          "User-Agent": "Postman-Clone-App",
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
          "User-Agent": "Postman-Clone-App",
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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
      model: "gemini-1.5-pro",
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are a helpful AI assistant for a Postman-like API testing tool. 
    
User question: ${message}

${context ? `Context: ${context}` : ""}

Provide a helpful, concise, and accurate response. Format your response in markdown for better readability.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
      model: "gemini-1.5-pro",
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
