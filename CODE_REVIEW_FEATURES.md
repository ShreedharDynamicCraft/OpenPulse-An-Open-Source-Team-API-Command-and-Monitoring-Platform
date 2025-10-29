# AI Code Review Features

Transform harsh code review comments into empathetic, educational feedback and get comprehensive GitHub repository analysis with AI.

## 🎯 Features

### 1. **Empathetic Code Review** 💗
Transform terse or harsh review comments into constructive, educational feedback that helps developers learn and improve.

### 2. **GitHub Repository Review** 🐙
Analyze entire GitHub repositories with comprehensive code quality, security, and architecture insights.

---

## 🌸 Empathetic Code Review Mode

### Overview
The Empathetic Code Review feature uses AI to transform harsh or terse code review comments into kind, constructive, and educational feedback. Perfect for maintaining positive team culture while still providing valuable technical guidance.

### How It Works

#### **Step 1: Choose Your Language**
Select from 8 supported programming languages:
- JavaScript
- TypeScript
- Python
- Java
- C++
- C#
- Go
- Rust

The language selection helps the AI provide more accurate, language-specific suggestions.

#### **Step 2: Paste Your Code**
Add the code snippet you want reviewed in the Monaco code editor. The editor provides:
- Syntax highlighting
- Line numbers
- Auto-formatting
- Language-specific features

#### **Step 3: Add Review Comments**
Enter harsh or terse review comments, one per line. Examples:
- "Function names are unclear"
- "Missing error handling"
- "Performance could be better"
- "Code structure needs improvement"
- "Too much duplication"
- "Security vulnerability"

Press Enter or click the + button to add each comment to the list.

#### **Step 4: Configure Settings**

**Tone Settings:**
- 🌸 **Gentle**: Extra supportive for sensitive contexts or junior developers
- ⚖️ **Balanced**: Professional yet friendly (recommended for most teams)
- ⚡ **Direct**: Straightforward but respectful (for senior teams)

**AI Models:**
- **gemini-2.0-flash**: Fast, efficient (recommended)
- **gemini-1.5-pro**: More detailed analysis

#### **Step 5: Generate Empathetic Review**
Click "Generate Empathetic Review" to transform your comments into:

**✨ Positive Rephrasing**: Starts with what's good, then suggests improvements

**📚 Educational Context**: Explains the "why" behind each suggestion

**💻 Code Examples**: Shows before/after snippets with explanations

**📖 Learning Resources**: Provides links to relevant documentation and guides

**🎯 Severity Classification**: 
- 🔴 High priority (critical issues)
- 🟡 Medium priority (important improvements)
- 🟢 Low priority (nice-to-have enhancements)

### Example Transformation

**Before (Harsh):**
> "Function names are unclear"

**After (Empathetic):**
```markdown
### Function Naming - 🟡 Medium Priority

**What's Good:**
Great job implementing the core logic! The function works correctly.

**Suggestion:**
Let's make the function names more descriptive to improve code readability and maintainability.

**Why This Matters:**
Clear function names act as documentation, making it easier for team members (and future you!) to understand the code without reading the implementation. This reduces cognitive load and speeds up development.

**Example:**
```javascript
// Before
function proc(d) {
  return d.map(x => x * 2);
}

// After - Improved
function doubleAllNumbers(numbers) {
  return numbers.map(number => number * 2);
}
```

**Learn More:**
- [Clean Code: Meaningful Names](https://example.com/clean-code-naming)
- [JavaScript Naming Conventions](https://example.com/js-conventions)
```

---

## 🐙 GitHub Repository Review Mode

### Overview
Analyze entire GitHub repositories to get comprehensive insights into code quality, architecture, security, and performance. Perfect for:
- Onboarding to new codebases
- Technical due diligence
- Code audits
- Learning best practices

### How It Works

#### **Step 1: Enter Repository URL**
Paste a **public** GitHub repository URL. Examples:
- `https://github.com/facebook/react`
- `https://github.com/microsoft/vscode`
- `https://github.com/your-username/your-repo`

**Note**: Only public repositories are supported. Private repos require authentication.

#### **Step 2: Fetch Repository Files**
Click "Fetch Files" to automatically discover all code files in the repository. The system:
- Scans the repository structure
- Identifies code files (filters out docs, configs, etc.)
- Shows up to 50 files for performance
- Detects file languages automatically

Supported file types:
- JavaScript/TypeScript (.js, .jsx, .ts, .tsx)
- Python (.py)
- Java (.java)
- C/C++ (.c, .cpp, .h)
- C# (.cs)
- Go (.go)
- Rust (.rs)
- Ruby (.rb)
- PHP (.php)
- Swift (.swift)
- Kotlin (.kt)
- Scala (.scala)

#### **Step 3: Select Files for Review**
Choose which files you want to analyze:
- Select up to **10 files** per review
- Files show:
  - Full path
  - Programming language
  - File size

**Tip**: Focus on core application files rather than tests or configs for better insights.

#### **Step 4: Configure Settings**

**Tone Settings:**
- 🌸 **Gentle**: Extra supportive analysis
- ⚖️ **Balanced**: Professional yet friendly (recommended)
- ⚡ **Direct**: Straightforward insights

**AI Models:**
- **gemini-2.0-flash**: Fast analysis (recommended)
- **gemini-1.5-pro**: More comprehensive review

#### **Step 5: Generate Repository Review**
Click "Generate Repository Review" to get a comprehensive analysis including:

### 📊 **Repository Overview**
- Repository information
- Files analyzed count
- Languages detected
- Technology stack assessment
- Architecture overview

### 🎯 **Code Quality Analysis**
**✅ Strengths**: What the code does well
- Design patterns used effectively
- Clean code practices
- Good documentation
- Test coverage

**🔄 Areas for Improvement**: Constructive suggestions
- Code organization
- Error handling
- Performance optimizations
- Maintainability enhancements

### 📁 **File-by-File Insights**
For each selected file:
- **Purpose**: What the file does
- **Code Quality Rating**: ⭐⭐⭐⭐☆ (out of 5)
- **Highlights**: Good practices observed
- **Suggestions**: Prioritized improvements
  - 🔴 High Priority: Critical issues
  - 🟡 Medium Priority: Important enhancements
  - 🟢 Low Priority: Nice-to-have improvements

Each suggestion includes:
- **What**: Description of the issue
- **Why**: Impact on the codebase
- **How**: Solution with code examples

### 🔒 **Security Considerations**
- Potential vulnerabilities identified
- Security best practices recommendations
- Input validation issues
- Authentication/authorization concerns

### ⚡ **Performance Opportunities**
- Algorithm efficiency improvements
- Resource usage optimization
- Database query optimizations
- Caching strategies

### 🏗️ **Architecture & Design**
- Design patterns analysis
- Code organization assessment
- Modularity evaluation
- Maintainability score

### 📚 **Learning Resources**
Curated links to:
- Official documentation
- Best practice guides
- Tutorial articles
- Framework-specific resources

### 🎯 **Action Items (Prioritized)**
**High Priority (Do First)**: Critical improvements
**Medium Priority (Plan Soon)**: Important enhancements
**Low Priority (Nice to Have)**: Minor improvements

### 💡 **Final Thoughts**
Encouraging summary with:
- Overall assessment
- Key strengths to celebrate
- Top 3 recommendations
- Next steps for improvement

---

## 🎨 Usage Examples

### Basic Usage

```tsx
import { CodeReviewModule } from "@/modules/ai/components";

function CodeReviewPage({ workspaceId }: { workspaceId: string }) {
  return <CodeReviewModule workspaceId={workspaceId} />;
}
```

### Individual Components

```tsx
import {
  EmpatheticCodeReview,
  GitHubRepoReview,
} from "@/modules/ai/components";

// Use empathetic review only
<EmpatheticCodeReview workspaceId={workspaceId} />

// Use GitHub review only
<GitHubRepoReview workspaceId={workspaceId} />
```

### With Hooks

```tsx
import {
  useEmpatheticReview,
  useGitHubRepoReview,
  useFetchGitHubRepo,
} from "@/modules/ai/hooks/use-code-review";

function MyComponent({ workspaceId }: { workspaceId: string }) {
  const empathetic = useEmpatheticReview(workspaceId);
  const githubReview = useGitHubRepoReview(workspaceId);
  const fetchRepo = useFetchGitHubRepo(workspaceId);

  // Generate empathetic review
  empathetic.mutate({
    code: "function add(a, b) { return a + b; }",
    language: "javascript",
    comments: ["No type checking", "Missing error handling"],
    tone: "balanced",
  });

  // Fetch GitHub repo
  fetchRepo.mutate({
    repoUrl: "https://github.com/facebook/react",
  });

  // Review GitHub repo
  githubReview.mutate({
    repoUrl: "https://github.com/facebook/react",
    files: [
      {
        path: "packages/react/src/React.js",
        content: "...",
        language: "javascript",
      },
    ],
    tone: "balanced",
  });
}
```

---

## 🔐 Security & Privacy

### Authentication
- ✅ All requests require workspace authentication
- ✅ Verifies user membership in workspace
- ✅ Uses Clerk authentication system

### Data Handling
- ✅ Code is sent to Google Gemini API for analysis
- ✅ No code is stored permanently
- ✅ Reviews are generated in real-time
- ✅ Results are not cached

### GitHub Access
- ✅ Only works with **public** repositories
- ✅ Uses GitHub's public API
- ✅ No authentication required for public repos
- ✅ Respects GitHub rate limits

### Privacy Considerations
- ⚠️ Don't review proprietary code you're not authorized to share
- ⚠️ Be mindful of sensitive information in code snippets
- ⚠️ Reviews are processed by Google's Gemini AI

---

## ⚙️ Configuration

### Environment Variables

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Optional (for higher GitHub API rate limits)
GITHUB_TOKEN=your_github_personal_access_token
```

### Supported Models
- `gemini-2.0-flash` (default): Fast, cost-effective
- `gemini-1.5-pro`: More detailed, higher quality

---

## 🐛 Troubleshooting

### "Failed to generate empathetic review"
**Possible causes:**
- Invalid Google API key
- API quota exceeded
- No code or comments provided

**Solutions:**
- Verify your `GOOGLE_GENERATIVE_AI_API_KEY`
- Check API usage limits
- Ensure code and comments are not empty

### "Failed to fetch repository files"
**Possible causes:**
- Invalid GitHub URL
- Private repository
- Repository doesn't exist
- GitHub API rate limit exceeded

**Solutions:**
- Verify URL format: `https://github.com/owner/repo`
- Ensure repository is public
- Wait for GitHub rate limit reset
- Add `GITHUB_TOKEN` for higher limits

### "Maximum 10 files allowed"
**Why**: Processing many files can be slow and expensive

**Solution**: Select only the most important core files

### "Repository may be private"
**Cause**: GitHub API denies access to private repos

**Solution**: 
- Make repository public, or
- Use empathetic review mode for individual files

---

## 📊 Best Practices

### Empathetic Code Review
1. **Be Specific**: Provide detailed, specific comments
2. **Focus on Learning**: Use as a teaching opportunity
3. **Choose Appropriate Tone**: 
   - Gentle for juniors/sensitive topics
   - Balanced for most teams
   - Direct for experienced teams
4. **Review AI Output**: Always verify suggestions are accurate
5. **Add Context**: Mention project goals or constraints

### GitHub Repository Review
1. **Select Core Files**: Focus on main application logic
2. **Limit File Count**: 5-8 files give best results
3. **Exclude Tests**: Focus on implementation files
4. **Review Architecture First**: Start with high-level structure
5. **Prioritize Actions**: Implement high-priority items first

---

## 🎯 Use Cases

### Empathetic Code Review
- **Team Culture**: Build positive, supportive code review culture
- **Mentorship**: Help junior developers learn from feedback
- **Conflict Resolution**: Soften harsh feedback diplomatically
- **Communication**: Make technical feedback accessible to non-technical stakeholders
- **Documentation**: Create educational review archives

### GitHub Repository Review
- **Onboarding**: Quickly understand new codebases
- **Due Diligence**: Assess code quality before acquisition
- **Learning**: Study best practices from popular repos
- **Audits**: Comprehensive code quality assessments
- **Refactoring**: Identify improvement opportunities

---

## 📈 Performance Tips

- **Use gemini-2.0-flash** for faster results
- **Limit file selection** to most important files
- **Review in batches** for large repositories
- **Cache results** to avoid re-analyzing
- **Set GitHub token** to avoid rate limits

---

## 🚀 Future Enhancements

Planned features:
- Private repository support
- Batch processing multiple repos
- Custom review templates
- Team review standards
- Integration with GitHub PRs
- Automated review scheduling
- Review history tracking

---

**Last Updated**: January 2025
**Models Used**: `gemini-2.0-flash`, `gemini-1.5-pro`
**Workspace Access**: Required for all features
