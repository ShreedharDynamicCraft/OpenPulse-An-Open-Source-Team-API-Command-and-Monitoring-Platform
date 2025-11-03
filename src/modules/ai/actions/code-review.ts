"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
  generateEmpatheticReview,
  reviewGitHubRepository,
} from "@/lib/gemini-ai";

/**
 * Generate empathetic code review from harsh comments
 */
export async function generateEmpatheticReviewAction(data: {
  workspaceId: string;
  code: string;
  language: string;
  comments: string[];
  tone?: "gentle" | "balanced" | "direct";
  model?: "gemini-2.0-flash-exp";
}) {
  console.log("generateEmpatheticReviewAction called with:", {
    workspaceId: data.workspaceId,
    language: data.language,
    commentsCount: data.comments?.length,
    codeLength: data.code?.length,
    tone: data.tone,
    model: data.model,
  });

  const session = await auth();

  if (!session?.userId) {
    console.error("No user session found");
    throw new Error("Unauthorized");
  }

  console.log("User authenticated:", session.userId);

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: data.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: {
              userId: session.userId,
            },
          },
        },
      ],
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }

  try {
    const result = await generateEmpatheticReview({
      code: data.code,
      language: data.language,
      comments: data.comments,
      tone: data.tone,
      model: data.model,
    });

    if (!result.success) {
      console.error("Empathetic review error:", result.error);
      throw new Error(result.error || "Failed to generate empathetic review");
    }

    return result;
  } catch (error: any) {
    console.error("generateEmpatheticReviewAction error:", error);
    throw error;
  }
}

/**
 * Review GitHub repository files
 */
export async function reviewGitHubRepositoryAction(data: {
  workspaceId: string;
  repoUrl: string;
  files: Array<{ path: string; content: string; language: string }>;
  tone?: "gentle" | "balanced" | "direct";
  model?: "gemini-2.0-flash-exp";
}) {
  const session = await auth();

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: data.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: {
              userId: session.userId,
            },
          },
        },
      ],
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }

  try {
    const result = await reviewGitHubRepository({
      repoUrl: data.repoUrl,
      files: data.files,
      tone: data.tone,
      model: data.model,
    });

    if (!result.success) {
      console.error("GitHub review error:", result.error);
      throw new Error(result.error || "Failed to review GitHub repository");
    }

    return result;
  } catch (error: any) {
    console.error("reviewGitHubRepositoryAction error:", error);
    throw error;
  }
}

/**
 * Fetch GitHub repository files (client-side accessible)
 * This is a helper action to fetch repository structure
 */
export async function fetchGitHubRepoFiles(data: {
  workspaceId: string;
  repoUrl: string;
}) {
  const session = await auth();

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  // Verify workspace access
  const workspace = await db.workspace.findFirst({
    where: {
      id: data.workspaceId,
      OR: [
        { ownerId: session.userId },
        {
          members: {
            some: {
              userId: session.userId,
            },
          },
        },
      ],
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }

  try {
    // Parse GitHub URL
    const urlMatch: RegExpMatchArray | null = data.repoUrl.match(
      /github\.com\/([^\/]+)\/([^\/]+)/
    );

    if (!urlMatch) {
      return {
        success: false,
        error: "Invalid GitHub URL format",
        files: [],
      };
    }

    const [, owner, repo] = urlMatch;
    const repoName = repo.replace(/\.git$/, "");

    // Fetch repository tree from GitHub API
    const response: Response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add GitHub token if available for higher rate limits
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      // Try 'master' branch if 'main' fails
      const masterResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/git/trees/master?recursive=1`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            ...(process.env.GITHUB_TOKEN && {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            }),
          },
        }
      );

      if (!masterResponse.ok) {
        return {
          success: false,
          error: "Failed to fetch repository files. Repository may be private or not found.",
          files: [],
        };
      }

      const masterData: any = await masterResponse.json();
      return processGitHubTree(masterData, owner, repoName);
    }

    const responseData: any = await response.json();
    return processGitHubTree(responseData, owner, repoName);
  } catch (error: any) {
    console.error("GitHub fetch error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch repository files",
      files: [],
    };
  }
}

/**
 * Helper function to process GitHub tree response
 */
function processGitHubTree(data: any, owner: string, repo: string) {
  const codeExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".cs",
    ".go",
    ".rs",
    ".rb",
    ".php",
    ".swift",
    ".kt",
    ".scala",
    ".r",
    ".m",
    ".h",
  ];

  const files = data.tree
    .filter((item: any) => {
      if (item.type !== "blob") return false;
      const ext = item.path.substring(item.path.lastIndexOf("."));
      return codeExtensions.includes(ext.toLowerCase());
    })
    .map((item: any) => {
      const ext = item.path.substring(item.path.lastIndexOf("."));
      const languageMap: Record<string, string> = {
        ".js": "javascript",
        ".jsx": "javascript",
        ".ts": "typescript",
        ".tsx": "typescript",
        ".py": "python",
        ".java": "java",
        ".cpp": "cpp",
        ".c": "c",
        ".cs": "csharp",
        ".go": "go",
        ".rs": "rust",
        ".rb": "ruby",
        ".php": "php",
        ".swift": "swift",
        ".kt": "kotlin",
        ".scala": "scala",
        ".r": "r",
        ".m": "objectivec",
        ".h": "c",
      };

      return {
        path: item.path,
        url: `https://raw.githubusercontent.com/${owner}/${repo}/main/${item.path}`,
        language: languageMap[ext.toLowerCase()] || "plaintext",
        size: item.size,
      };
    })
    .slice(0, 50); // Limit to 50 files for performance

  return {
    success: true,
    files,
    metadata: {
      owner,
      repo,
      totalFiles: files.length,
    },
  };
}
