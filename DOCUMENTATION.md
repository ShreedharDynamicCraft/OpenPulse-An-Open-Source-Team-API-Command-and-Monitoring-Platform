# Postman Clone - Complete Documentation

## 📚 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [API Code Editor](#api-code-editor)
5. [Code Editor with Analysis](#code-editor-with-analysis)
6. [AI Features](#ai-features)
7. [Getting Started](#getting-started)
8. [Usage Guide](#usage-guide)

---

## Overview

A powerful API development platform built with Next.js, featuring AI-powered code generation, testing, and analysis using Google Gemini AI.

**Tech Stack:**
- Next.js 15.5.3 with Turbopack
- React 18
- PostgreSQL (Neon) with Prisma ORM
- Clerk Authentication
- Google Gemini 2.0 Flash AI
- Shadcn/ui Components
- TailwindCSS

---

## Features

### 🚀 Core Features
- ✅ Workspace management with collaboration
- ✅ API collections and requests
- ✅ Real-time collaboration
- ✅ Design system with tldraw
- ✅ AI-powered code generation
- ✅ API testing and validation
- ✅ Code review system

### 🤖 AI Features (Powered by Gemini 2.0)
1. **Code Generation** - Generate API code from descriptions
2. **Code Improvement** - Enhance existing code
3. **Endpoint Detection** - Auto-detect API routes
4. **Test Generation** - Create comprehensive test cases
5. **Security Audit** - Identify vulnerabilities
6. **Performance Optimization** - Suggest improvements
7. **Documentation Generation** - Auto-generate docs
8. **Debug Assistant** - Find and fix issues
9. **Code Explanation** - Understand complex code
10. **Code Refactoring** - Improve code structure

---

## Architecture

### Project Structure
```
postman-clone/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (workspace)/         # Main workspace
│   │   │   ├── code-editor/     # Standalone code editor
│   │   │   ├── design/          # Design system
│   │   │   └── realtime/        # Real-time features
│   │   └── api/                 # API routes
│   ├── components/              # Reusable UI components
│   ├── modules/                 # Feature modules
│   │   ├── ai/                  # AI features
│   │   ├── authentication/      # Auth system
│   │   ├── collections/         # API collections
│   │   ├── workspace/           # Workspace features
│   │   └── realtime/            # Real-time collaboration
│   └── lib/                     # Utilities and configs
├── prisma/                      # Database schema
└── public/                      # Static assets
```

---

## API Code Editor

### Location
Sidebar → 2nd Tab (Code icon)

### Features

#### 1. **Write Tab** ✍️
- Code editor with syntax highlighting
- Framework selection (Express, Fastify, Next.js)
- AI code generation from descriptions
- Code improvement suggestions

#### 2. **Endpoints Tab** 🔍
- **Auto-detect endpoints** (toggle on/off)
  - 1.5-second debounce
  - Detects when code changes
- Manual detection with "Detect Now" button
- Color-coded HTTP methods
- Parameter extraction
- Test case generation per endpoint

#### 3. **Test API Tab** 🧪
- **Real API Testing**
  - Toggle between simulation and real API
  - Configure base URL
  - Full HTTP support (GET, POST, PUT, DELETE)
  - Real response with headers, status, duration
- **Manual Test Cases**
  - Create custom test cases
  - Save and reuse tests
  - Add name, description, configuration
- **Test Response Display**
  - AI simulation results
  - Real API responses
  - Status codes and timing
  - Scenario breakdown

#### 4. **Templates Tab** 📋
- Pre-built API templates
- Common patterns
- Quick start examples

### Usage Example

```javascript
// 1. Write your API code
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ user: req.body });
});

// 2. Auto-detect finds:
// - GET /api/users
// - POST /api/users

// 3. Generate test cases for POST /api/users
// 4. Run tests and see results
```

---

## Code Editor with Analysis

### Location
Sidebar → 4th Tab (FileCode icon) → Standalone Page

### Tabs Overview

#### 1. **Editor Tab** 📝
- Full-featured code editor
- File operations (upload, download)
- Syntax highlighting
- Language selection
- Copy/paste support

#### 2. **AI Assistant Tab** 🤖
- Code generation from prompts
- Code improvement suggestions
- Framework-aware generation
- Context-based help

#### 3. **Analysis Tab** 🔍

##### API Route Detection
- Automatic route discovery
- HTTP method identification
- Parameter extraction
- Framework detection

##### Operations Dashboard
- Visual method counts (GET, POST, PUT, DELETE, PATCH)
- Operation distribution
- Active/inactive indicators

##### AI Test Generation
- Click "Generate Tests" on any route
- Creates comprehensive scenarios:
  - Valid requests
  - Invalid requests
  - Edge cases
  - Error scenarios
  - Authentication tests
- Includes:
  - Request body examples
  - Expected responses
  - Test assertions

##### Test Execution
- One-click test running
- Real-time execution
- Simulated responses
- Loading states

##### Test Results
- Pass/fail status
- Response data (formatted JSON)
- Scenario breakdown
- **AI-powered recommendations**

**Example Flow:**
```
1. Paste API code → Analysis Tab
2. Click "Detect API Routes"
3. See: 4 routes, GET:2 POST:1 DELETE:1
4. Click "Generate Tests" on POST route
5. AI creates 3 test scenarios
6. Click "Run Test" on each
7. View results + get recommendations
```

#### 4. **Security Tab** 🔒
- Security vulnerability scan
- Security score (0-100)
- Issue severity levels
- Fix recommendations
- Best practices

#### 5. **Performance Tab** ⚡
- Performance analysis
- Optimization suggestions
- Code metrics
- Bottleneck detection
- Improved code generation

#### 6. **Docs Tab** 📖
- Auto-generate documentation
- Markdown format
- API endpoint documentation
- Code examples
- Usage instructions

---

## AI Features

### 15 AI-Powered Functions

#### Code Generation & Improvement
1. **generateAPICode** - Generate API code from description
2. **improveCode** - Enhance and optimize code
3. **refactorCode** - Restructure code

#### Testing
4. **testAPICode** - Simulate API testing
5. **generateTestData** - Create test data
6. **generateEndpointTests** - Generate test cases for endpoints
7. **recommendEndpoints** - Suggest endpoint improvements

#### Analysis
8. **detectEndpoints** - Find API routes automatically
9. **explainCode** - Explain complex code
10. **debugCode** - Debug assistant with fixes

#### Security & Performance
11. **performSecurityAudit** - Security vulnerability scan
12. **optimizePerformance** - Performance optimization

#### Documentation
13. **generateDocumentation** - Auto-generate docs
14. **convertCodeLanguage** - Convert between languages

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key
- Clerk account

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd postman-clone

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env-sample.txt .env

# Configure .env with:
# - DATABASE_URL
# - GOOGLE_GENERATIVE_AI_API_KEY
# - Clerk keys
# - Other credentials

# 4. Set up database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# AI
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."

# URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## Usage Guide

### Quick Start Tutorial

#### 1. Create Workspace (1 minute)
1. Sign up/Login
2. Create new workspace
3. Name your workspace

#### 2. API Code Editor (3 minutes)

**Write API Code:**
```javascript
const express = require('express');
const app = express();

app.get('/api/products', (req, res) => {
  res.json({ products: [] });
});
```

**Auto-Detect Routes:**
- Go to Endpoints tab
- Toggle "Auto-detect" ON
- Wait 2 seconds
- See detected routes

**Test Your API:**
- Go to Test API tab
- Toggle "Real API Testing" ON
- Set base URL: `http://localhost:3000`
- Configure endpoint: `/api/products`
- Method: GET
- Click "Send Real Request"

#### 3. Code Editor Analysis (3 minutes)

**Detect & Test:**
1. Navigate to Code Editor page (FileCode icon)
2. Paste API code in Editor tab
3. Go to Analysis tab
4. Click "Detect API Routes"
5. Click "Generate Tests" on any route
6. Click "Run Test" on test cases
7. Review results and recommendations

**Security Check:**
1. Go to Security tab
2. Click "Run Security Check"
3. View security score
4. Review vulnerabilities
5. Apply recommendations

**Optimize Performance:**
1. Go to Performance tab
2. Click "Optimize Performance"
3. View optimized code
4. See performance metrics
5. Apply improvements

---

## Key Workflows

### Workflow 1: API Development
```
1. Write API code in sidebar editor
   ↓
2. Auto-detect endpoints
   ↓
3. Generate test cases
   ↓
4. Run tests
   ↓
5. Fix issues based on results
   ↓
6. Security audit
   ↓
7. Performance optimization
   ↓
8. Generate documentation
```

### Workflow 2: Code Review
```
1. Upload/paste code in Code Editor
   ↓
2. Analysis tab → Detect routes
   ↓
3. Generate comprehensive tests
   ↓
4. Security tab → Run audit
   ↓
5. Performance tab → Optimize
   ↓
6. Review all recommendations
   ↓
7. Apply fixes
   ↓
8. Export improved code
```

### Workflow 3: Testing
```
1. Write API code
   ↓
2. Toggle Real API Testing ON
   ↓
3. Configure base URL
   ↓
4. Create manual test cases
   ↓
5. Run tests against real server
   ↓
6. View responses with timing
   ↓
7. Save successful tests
   ↓
8. Reuse for regression testing
```

---

## Best Practices

### Code Writing
- ✅ Use clear route definitions
- ✅ Add comments for better AI understanding
- ✅ Follow REST conventions
- ✅ Include error handling
- ✅ Use standard frameworks

### Testing
- ✅ Test both success and error cases
- ✅ Include edge cases
- ✅ Validate response structure
- ✅ Check status codes
- ✅ Test authentication

### Security
- ✅ Run security audits regularly
- ✅ Fix high severity issues first
- ✅ Follow security recommendations
- ✅ Validate all inputs
- ✅ Use authentication

### Performance
- ✅ Optimize database queries
- ✅ Add caching where appropriate
- ✅ Use pagination
- ✅ Minimize API calls
- ✅ Follow performance suggestions

---

## Keyboard Shortcuts (Planned)

- `Ctrl/Cmd + Enter` - Run test
- `Ctrl/Cmd + D` - Detect endpoints
- `Ctrl/Cmd + G` - Generate tests
- `Ctrl/Cmd + S` - Save code
- `Ctrl/Cmd + /` - Toggle comments

---

## Troubleshooting

### Common Issues

**Auto-detect not working:**
- Ensure toggle is ON
- Wait 1.5 seconds after typing
- Check code syntax
- Use supported frameworks

**Test generation fails:**
- Verify internet connection
- Check API key
- Ensure valid route format
- Try different route

**Real API testing fails:**
- Verify server is running
- Check base URL is correct
- Test endpoint in browser/Postman
- Check for CORS issues

**Security audit slow:**
- Large files take longer
- Complex code needs more time
- Check internet connection
- Try smaller code sections

---

## API Reference

### Server Actions

All AI functions are in: `src/modules/workspace/actions/api-code-actions.ts`

#### Basic Usage
```typescript
import { detectEndpoints, generateEndpointTests, testAPICode } from '@/modules/workspace/actions/api-code-actions';

// Detect endpoints
const result = await detectEndpoints(code);
if (result.success) {
  console.log(result.data.endpoints);
}

// Generate tests
const tests = await generateEndpointTests(route);
if (tests.success) {
  console.log(tests.data.testCases);
}

// Run test
const testResult = await testAPICode(code, endpoint, method, body);
if (testResult.success) {
  console.log(testResult.data.response);
}
```

---

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Consistent naming conventions

---

## License

[Your License Here]

---

## Support

- 📧 Email: [support email]
- 🐛 Issues: [GitHub Issues]
- 💬 Discussions: [GitHub Discussions]
- 📖 Docs: This file

---

## Changelog

### Version 1.0 (Current)
- ✅ API Code Editor with auto-detect
- ✅ Real API testing
- ✅ Manual test cases
- ✅ Code Editor with Analysis tab
- ✅ AI-powered test generation
- ✅ Security audit
- ✅ Performance optimization
- ✅ 15 AI features
- ✅ Comprehensive documentation

---

**Built with ❤️ using Next.js and Gemini AI**

*Last Updated: January 29, 2025*
