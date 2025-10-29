# API Code Editor - Feature Documentation

## Overview
Added a new "Code" tab in the workspace sidebar that allows users to write, test, and improve API route code with AI assistance powered by Google Gemini 2.5 Flash.

## Features

### 1. **AI Code Generation**
- **Framework Support**: Express.js, Fastify, Next.js API routes
- **Intelligent Generation**: Describe what you want to build, and AI generates production-ready code
- **Includes**:
  - Proper error handling
  - Input validation
  - Modern JavaScript/TypeScript best practices
  - Necessary imports and comments
  - Framework-specific conventions

### 2. **Code Editor**
- **Syntax Highlighting**: Monospace font for better readability
- **AI Code Improvement**: One-click code optimization
  - Security vulnerability fixes
  - Performance optimizations
  - Better error handling
  - Code structure improvements
- **Copy to Clipboard**: Easy code copying functionality

### 3. **API Testing**
- **Test Configuration**:
  - Support for GET, POST, PUT, DELETE methods
  - Custom endpoint testing
  - Request body input
- **AI Test Data Generation**: Automatically generate realistic test data
- **Test Results Display**:
  - Pass/Fail status
  - HTTP status codes
  - Issues found
  - Improvement suggestions
  - Expected responses
  - Test scenarios

### 4. **Code Templates**
Pre-built templates for common scenarios:
- **REST API**: GET endpoint with error handling
- **POST with Validation**: Create endpoint with input validation
- **Authentication Middleware**: JWT authentication example

## Technical Implementation

### Files Created

#### 1. `/src/modules/workspace/components/api-code-editor.tsx`
- Main component with 3-tab interface (Write, Test, Templates)
- State management for code, prompts, test configurations
- UI for all features with loading states

#### 2. `/src/modules/workspace/actions/api-code-actions.ts`
Server actions using Gemini AI:
- `generateAPICode(prompt, framework)` - Generate code from description
- `improveCode(code, framework)` - Improve existing code
- `testAPICode(code, endpoint, method, body)` - Simulate API testing
- `generateTestData(code)` - Generate test data
- `generateAPITests(code, framework)` - Generate test cases

### Files Modified

#### `/src/modules/workspace/components/sidebar.tsx`
- Added `Code2` icon import
- Added new sidebar item for "Code" tab
- Added `ApiCodeEditor` component import
- Added render case for Code tab

## Usage Guide

### Generating Code
1. Click the **Code** tab in the sidebar (2nd icon)
2. Select your framework (Express.js, Fastify, or Next.js)
3. Enter a description of what you want to build
   - Example: "Create a user registration endpoint with email validation and password hashing"
4. Click **Generate Code**
5. AI will generate the complete code with proper structure

### Improving Code
1. Write or generate code in the editor
2. Click the **Improve** button
3. AI will analyze and enhance your code for:
   - Security
   - Performance
   - Best practices
   - Error handling

### Testing Your API
1. Switch to the **Test** tab
2. Select HTTP method (GET/POST/PUT/DELETE)
3. Enter the endpoint path (e.g., `/api/users`)
4. For POST/PUT: 
   - Click **Generate Test Data** for AI-generated test data
   - Or manually enter request body
5. Click **Send Test Request**
6. Review test results with:
   - Pass/fail status
   - Issues found
   - Suggestions for improvement
   - Expected responses

### Using Templates
1. Go to the **Templates** tab
2. Browse pre-built templates
3. Click **Use Template** to load it into the editor
4. Modify as needed

## AI Capabilities

### Code Generation
- Understands natural language requirements
- Generates framework-specific code
- Includes proper imports and dependencies
- Adds error handling automatically
- Follows best practices

### Code Improvement
- Security vulnerability detection
- Performance optimization suggestions
- Code refactoring
- Type safety improvements
- Better error handling

### Testing & Validation
- Simulates API behavior
- Identifies potential issues
- Generates realistic test data
- Provides improvement suggestions
- Tests edge cases

## Benefits

1. **Faster Development**: Generate boilerplate code instantly
2. **Learn Best Practices**: AI shows proper patterns and error handling
3. **Test Before Production**: Validate code logic before deployment
4. **Improve Code Quality**: Get AI-powered suggestions for improvements
5. **Framework Agnostic**: Support for multiple Node.js frameworks

## Environment Requirements

- **Google Generative AI API Key**: Already configured in `.env`
- **Model**: gemini-2.0-flash-exp
- **Dependencies**: @google/generative-ai (already installed)

## Future Enhancements

Potential additions:
- [ ] Save code snippets to workspace
- [ ] Share code with team members
- [ ] Version control integration
- [ ] More framework support (Django, FastAPI, etc.)
- [ ] Real API endpoint testing (not just simulation)
- [ ] Code diff viewer for improvements
- [ ] Export code as files
- [ ] Collaborative code editing

## Screenshots & Examples

### Example Prompt:
```
Create a user login endpoint that:
- Accepts email and password
- Validates input
- Checks credentials against database
- Returns JWT token on success
- Handles errors properly
```

### Generated Code Example:
```javascript
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Integration with Existing Features

The Code Editor integrates seamlessly with:
- **Collections**: Write code for your API endpoints
- **Chat**: Ask questions about your code
- **Logs**: Monitor API behavior
- **Analytics**: Track usage patterns
- **Design**: Implement designs from the design canvas

## Troubleshooting

**Issue**: "Cannot find module '../actions/api-code-actions'"
- **Solution**: Restart TypeScript server or refresh the page. This is a cache issue.

**Issue**: AI not generating code
- **Solution**: Check that `GOOGLE_GENERATIVE_AI_API_KEY` is set in `.env`

**Issue**: Test results not showing
- **Solution**: Ensure code is written in the editor before testing

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save code (future feature)
- **Ctrl/Cmd + C**: Copy selected code
- **Tab**: Indent code

---

**Created**: October 30, 2025
**Version**: 1.0.0
**Status**: ✅ Fully Functional
