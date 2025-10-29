# API Code Editor - Quick Start Guide

## 🚀 Getting Started

### Access the Code Editor
1. Navigate to your workspace
2. Click the **Code icon** (2nd icon) in the left sidebar
3. You'll see three tabs: **Write Code**, **Test API**, and **Templates**

---

## ✨ Features at a Glance

### Tab 1: Write Code
```
┌─────────────────────────────────────────────┐
│  AI Code Generator                          │
│  ┌─────────────────────────────────────┐   │
│  │ Framework: [Express.js ▼]           │   │
│  │                                     │   │
│  │ Describe your API requirements...   │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│  [✨ Generate Code]                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Code Editor           [✨ Improve] [📋 Copy]│
│  ┌─────────────────────────────────────┐   │
│  │ // Your generated or written code   │   │
│  │ app.post('/api/users', async (...) │   │
│  │   try {                             │   │
│  │     // Implementation               │   │
│  │   } catch(error) { ... }            │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Tab 2: Test API
```
┌─────────────────────────────────────────────┐
│  Test Your API                              │
│  ┌─────┐ ┌──────────────────────────┐      │
│  │POST▼│ │ /api/users               │      │
│  └─────┘ └──────────────────────────┘      │
│                                             │
│  Request Body    [✨ Generate Test Data]    │
│  ┌─────────────────────────────────────┐   │
│  │ {                                   │   │
│  │   "name": "John Doe",               │   │
│  │   "email": "john@example.com"       │   │
│  │ }                                   │   │
│  └─────────────────────────────────────┘   │
│  [📤 Send Test Request]                     │
│                                             │
│  Test Results:                              │
│  ✅ Passed  Status: 201                     │
│  💡 Suggestions: [...]                      │
└─────────────────────────────────────────────┘
```

### Tab 3: Templates
```
┌─────────────────────────────────────────────┐
│  📦 REST API                                │
│  app.get('/api/users/:id', async ...)      │
│  [Use Template]                             │
├─────────────────────────────────────────────┤
│  📦 POST with Validation                    │
│  app.post('/api/users', async ...)         │
│  [Use Template]                             │
├─────────────────────────────────────────────┤
│  📦 Authentication Middleware               │
│  const authenticate = async (req...)        │
│  [Use Template]                             │
└─────────────────────────────────────────────┘
```

---

## 💡 Example Workflows

### Workflow 1: Generate New API Endpoint
1. Go to **Write Code** tab
2. Select framework (e.g., Express.js)
3. Enter prompt: "Create a user registration endpoint with email validation"
4. Click **Generate Code**
5. Review generated code
6. Click **Improve** for optimization suggestions
7. Copy code to your project

### Workflow 2: Test Existing Code
1. Paste your API code in the editor
2. Go to **Test API** tab
3. Select HTTP method (POST)
4. Enter endpoint path (e.g., /api/register)
5. Click **Generate Test Data** for automatic test data
6. Click **Send Test Request**
7. Review results and suggestions

### Workflow 3: Start from Template
1. Go to **Templates** tab
2. Browse available templates
3. Click **Use Template** on desired template
4. Modify code in the editor
5. Test with the **Test API** tab

---

## 🎯 AI Prompts That Work Well

### ✅ Good Prompts:
- "Create a login endpoint with JWT authentication and bcrypt password hashing"
- "Build a CRUD API for blog posts with validation and error handling"
- "Make a webhook endpoint that processes Stripe payment events"
- "Create middleware for role-based access control"

### ❌ Avoid Vague Prompts:
- "Make an API" (too generic)
- "Code" (no context)
- Use specific requirements instead!

---

## 🔧 Supported Frameworks

| Framework | Status | Use Case |
|-----------|--------|----------|
| Express.js | ✅ | Traditional Node.js APIs |
| Fastify | ✅ | High-performance APIs |
| Next.js API | ✅ | Full-stack Next.js apps |

---

## 🎨 Key Features

### 1. AI Code Generation
- **Input**: Natural language description
- **Output**: Production-ready code
- **Includes**: Error handling, validation, best practices

### 2. Code Improvement
- Security fixes
- Performance optimizations
- Better error handling
- Code refactoring

### 3. Smart Testing
- AI-simulated testing
- Automatic test data generation
- Issue detection
- Improvement suggestions

### 4. Quick Templates
- Common patterns ready to use
- Edit and customize
- Learn best practices

---

## 📚 Learn More

See `API_CODE_EDITOR_DOCS.md` for comprehensive documentation.

---

## 🐛 Troubleshooting

**Code not generating?**
- Check your internet connection
- Verify API key is set in .env

**Import error?**
- Restart the dev server
- Clear browser cache

**Test not working?**
- Ensure code is written in editor
- Check endpoint format (starts with /)

---

## 🎉 Tips & Tricks

1. **Start with templates** if you're new to a framework
2. **Use AI improvement** to learn better patterns
3. **Generate test data** saves time writing test cases
4. **Copy code** quickly with the copy button
5. **Describe details** in prompts for better results

---

**Happy Coding! 🚀**
