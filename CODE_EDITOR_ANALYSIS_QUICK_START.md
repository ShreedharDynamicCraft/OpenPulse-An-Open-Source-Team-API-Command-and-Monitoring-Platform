# Code Editor Analysis Tab - Quick Start Guide

## 🎯 What You Can Do

The Analysis tab in the Code Editor now provides **comprehensive API testing** with:
- ✅ Automatic API route detection
- ✅ HTTP method identification  
- ✅ AI-powered test case generation
- ✅ Real-time test execution
- ✅ Detailed test results with recommendations

---

## 🚀 Quick Start (3 Minutes)

### Step 1: Open Code Editor (30 seconds)
1. Click the **FileCode icon** (4th icon) in the sidebar
2. You'll see the standalone Code Editor page

### Step 2: Add Your API Code (30 seconds)
In the **Editor** tab, paste your API code:

```javascript
const express = require('express');
const app = express();

// Get all users
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// Create user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ 
    id: 1, 
    name, 
    email,
    createdAt: new Date()
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ 
    id: userId, 
    name: "John Doe",
    email: "john@example.com"
  });
});
```

### Step 3: Detect Routes (30 seconds)
1. Switch to the **Analysis** tab
2. Click **"Detect API Routes"** button
3. Wait 2-3 seconds for AI analysis

**You'll see:**
- ✅ Framework detected (Express.js)
- ✅ 3 routes found
- ✅ Operation counts (GET: 2, POST: 1)

### Step 4: Generate Test Cases (30 seconds)
1. Find the route: `POST /api/users`
2. Click **"Generate Tests"** button
3. Wait for AI to create test cases

**You'll get:**
- ✅ Multiple test scenarios
- ✅ Request body examples
- ✅ Expected responses
- ✅ Test assertions

### Step 5: Run Tests (30 seconds)
1. Click **"Run Test"** on any test case
2. Wait for execution
3. View detailed results!

**Results show:**
- ✅ Pass/fail status
- ✅ Response data
- ✅ Individual scenarios
- ✅ AI recommendations

---

## 💡 Usage Examples

### Example 1: REST API with CRUD Operations

```javascript
// Your Code
app.get('/api/products', handler);
app.post('/api/products', handler);
app.put('/api/products/:id', handler);
app.delete('/api/products/:id', handler);
```

**What You Get:**
```
Detected API Routes (4):
├─ GET    /api/products
├─ POST   /api/products  
├─ PUT    /api/products/:id
└─ DELETE /api/products/:id

Operations:
GET: 1 | POST: 1 | PUT: 1 | DELETE: 1
```

### Example 2: Authentication API

```javascript
// Your Code
app.post('/api/auth/register', handler);
app.post('/api/auth/login', handler);
app.post('/api/auth/logout', handler);
app.get('/api/auth/me', handler);
```

**Generated Tests for POST /api/auth/login:**
```
Test Case 1: Successful Login
- Request: { email: "user@example.com", password: "pass123" }
- Expected: { token: "jwt-token", user: {...} }
- Status: 200

Test Case 2: Invalid Credentials
- Request: { email: "user@example.com", password: "wrong" }
- Expected: { error: "Invalid credentials" }
- Status: 401

Test Case 3: Missing Fields
- Request: { email: "user@example.com" }
- Expected: { error: "Password required" }
- Status: 400
```

### Example 3: E-commerce API

```javascript
// Your Code
app.get('/api/cart', handler);
app.post('/api/cart/items', handler);
app.delete('/api/cart/items/:id', handler);
app.post('/api/checkout', handler);
```

**Operations Dashboard:**
```
┌────────────────────────────┐
│ GET     [2]  │  POST   [2] │
│ DELETE  [1]  │  PUT    [0] │
└────────────────────────────┘
```

---

## 🎨 Visual Guide

### Before You Click "Detect API Routes":
```
┌─────────────────────────────────┐
│ API Route Detection & Analysis  │
├─────────────────────────────────┤
│                                 │
│  [Detect API Routes]            │
│                                 │
│  (Empty - no routes detected)   │
│                                 │
└─────────────────────────────────┘
```

### After Detection:
```
┌─────────────────────────────────────────┐
│ API Route Detection & Analysis          │
├─────────────────────────────────────────┤
│ 🔮 Detected Framework                   │
│ └─ Express.js                           │
│                                         │
│ 🌿 Detected API Routes (3)              │
│ ┌─────────────────────────────────────┐ │
│ │ [GET] /api/users  [Generate Tests]  │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [POST] /api/users [Generate Tests]  │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [GET] /api/users/:id [Generate...]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 💻 Supported Operations                 │
│ └─ GET: 2  POST: 1  PUT: 0  DELETE: 0  │
└─────────────────────────────────────────┘
```

### After Generating Tests:
```
┌─────────────────────────────────────────┐
│ ✨ AI Generated Test Cases              │
│ Test cases for POST /api/users          │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Test: Create Valid User [Run Test] │ │
│ │                                     │ │
│ │ Request Body:                       │ │
│ │ {                                   │ │
│ │   "name": "John Doe",               │ │
│ │   "email": "john@example.com"       │ │
│ │ }                                   │ │
│ │                                     │ │
│ │ Expected Response:                  │ │
│ │ {                                   │ │
│ │   "id": 1,                          │ │
│ │   "name": "John Doe",               │ │
│ │   "email": "john@example.com"       │ │
│ │ }                                   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🔥 Pro Tips

### Tip 1: Write Better Code for Detection
```javascript
// ✅ Good - Clear route definitions
app.get('/api/users', getUsers);
app.post('/api/users', createUser);

// ❌ Less Ideal - Dynamic routes
routes.forEach(r => app[r.method](r.path, r.handler));
```

### Tip 2: Add Comments for Better Tests
```javascript
// Get all users with pagination
// Parameters: page, limit
app.get('/api/users', handler);
```
→ AI will include pagination in test cases!

### Tip 3: Use Standard REST Conventions
```javascript
// ✅ Good - RESTful naming
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

// ❌ Non-standard
GET /api/getAllUsers
POST /api/createNewUser
```

### Tip 4: Include Error Handling
```javascript
app.post('/api/users', async (req, res) => {
  try {
    // Validation
    if (!req.body.email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    // Success
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```
→ AI generates tests for all error scenarios!

---

## 📊 Test Case Quality

### What Makes Good Test Cases?

**Generated test cases include:**

1. **Happy Path Tests** ✅
   - Valid inputs
   - Expected successful responses
   - Correct status codes

2. **Error Scenarios** ❌
   - Missing required fields
   - Invalid data types
   - Authentication failures

3. **Edge Cases** 🔍
   - Empty databases
   - Large datasets
   - Special characters

4. **Assertions** 🎯
   - Status code checks
   - Response structure validation
   - Data type verification

---

## 🎬 Real-World Workflow

### Scenario: Building a Blog API

**1. Write your endpoints:**
```javascript
app.get('/api/posts', getAllPosts);
app.post('/api/posts', createPost);
app.get('/api/posts/:id', getPost);
app.put('/api/posts/:id', updatePost);
app.delete('/api/posts/:id', deletePost);
app.get('/api/posts/:id/comments', getComments);
app.post('/api/posts/:id/comments', addComment);
```

**2. Detect routes → 7 routes found**

**3. Generate tests for POST /api/posts:**
- ✅ Create valid post
- ✅ Create without title
- ✅ Create with too long content
- ✅ Create without authentication

**4. Run all tests → 4/4 passed**

**5. Review recommendations:**
- "Add input validation for title length"
- "Consider adding rate limiting"
- "Add pagination to GET /api/posts"

**6. Improve your code based on feedback!**

---

## ⚡ Keyboard Shortcuts (Coming Soon)

- `Ctrl/Cmd + D` - Detect Routes
- `Ctrl/Cmd + G` - Generate Tests
- `Ctrl/Cmd + R` - Run Selected Test
- `Ctrl/Cmd + A` - Analyze Code

---

## 🐛 Troubleshooting

### Problem: No routes detected
**Solution:**
- Check your code syntax
- Ensure you're using standard frameworks (Express, Fastify, Next.js)
- Use clear route definitions

### Problem: Test generation fails
**Solution:**
- Make sure route is valid
- Check internet connection (AI needs it)
- Try a different route

### Problem: Test execution timeout
**Solution:**
- Simplify your code
- Remove external dependencies
- Tests are simulated, not real API calls

---

## 📚 Learn More

### Related Features:
- **AI Assistant Tab** - Get code suggestions
- **Security Tab** - Security audit
- **Performance Tab** - Optimization tips
- **Docs Tab** - Auto-generate documentation

### Related Docs:
- [CODE_EDITOR_ANALYSIS_ENHANCEMENT.md](./CODE_EDITOR_ANALYSIS_ENHANCEMENT.md) - Complete feature documentation
- [API_CODE_EDITOR_ENHANCEMENTS.md](./API_CODE_EDITOR_ENHANCEMENTS.md) - Sidebar editor features

---

## 🎯 Quick Reference

| Action | Location | Button |
|--------|----------|--------|
| Detect Routes | Analysis Tab | "Detect API Routes" |
| Generate Tests | Route Card | "Generate Tests" |
| Run Test | Test Case | "Run Test" |
| View Results | Auto-displayed | After test runs |

### Color Code:
- 🔵 GET - Blue
- 🟢 POST - Green  
- 🟠 PUT - Orange
- 🔴 DELETE - Red
- 🟡 PATCH - Yellow

---

## 🚀 Next Steps

1. ✅ Try the quick start guide above
2. ✅ Experiment with your own APIs
3. ✅ Generate and run tests
4. ✅ Use AI recommendations to improve code
5. ✅ Explore other tabs (Security, Performance, Docs)

---

**Happy Coding! 🎉**

*This feature is powered by Gemini 2.0 Flash AI*

---

**Version:** 1.0  
**Last Updated:** January 29, 2025  
**Status:** ✅ Ready to Use
