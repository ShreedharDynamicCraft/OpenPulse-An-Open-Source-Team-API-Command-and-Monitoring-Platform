# API Code Editor - Testing Guide

## Quick Test Scenarios

### ✅ Test 1: Auto-Detect Endpoints

**Steps:**
1. Open the sidebar API Code Editor (2nd tab - Code icon)
2. Go to "Endpoints" tab
3. Verify the "Auto-detect Endpoints" toggle is visible
4. Toggle should be ON by default
5. Paste the following code in the editor:

```javascript
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

app.get('/api/products', (req, res) => {
  res.json({ products: [] });
});
```

6. Wait 2 seconds
7. **Expected:** Endpoints should appear automatically:
   - GET /api/users (blue badge)
   - POST /api/users (green badge)
   - GET /api/products (blue badge)

**Pass Criteria:** ✅ Endpoints detected without clicking "Detect Now"

---

### ✅ Test 2: Manual Endpoint Detection

**Steps:**
1. Toggle "Auto-detect Endpoints" OFF
2. Paste new code:

```javascript
app.delete('/api/users/:id', (req, res) => {
  res.json({ deleted: true });
});
```

3. Wait 2 seconds
4. **Expected:** No auto-detection (toggle is OFF)
5. Click "Detect Now" button
6. **Expected:** Endpoint appears:
   - DELETE /api/users/:id (red badge)

**Pass Criteria:** ✅ Manual detection works when auto-detect is OFF

---

### ✅ Test 3: Real API Testing - Success Case

**Prerequisites:** Start the backend testing API
```bash
cd backend-testing-api
npm install
npm start
# Server runs on http://localhost:3000
```

**Steps:**
1. Go to "Test API" tab
2. Toggle "Real API Testing" ON
3. Verify "Base URL" input appears
4. Leave base URL as `http://localhost:3000`
5. Configure test:
   - Endpoint: `/api/test`
   - Method: GET
6. Click "Send Real Request"
7. **Expected Response:**
```json
{
  "message": "API is working!",
  "timestamp": "2025-01-29T10:30:45.123Z",
  "version": "1.0.0"
}
```

8. Verify display shows:
   - ✅ Success badge (green)
   - Status: 200 OK
   - Duration: ~10-50ms
   - Response headers
   - Response body (formatted JSON)
   - Timestamp

**Pass Criteria:** ✅ Real HTTP request successful, response displayed correctly

---

### ✅ Test 4: Real API Testing - POST with Body

**Steps:**
1. Real API Testing toggle: ON
2. Base URL: `http://localhost:3000`
3. Configure test:
   - Endpoint: `/api/users`
   - Method: POST
   - Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

4. Click "Send Real Request"
5. **Expected Response:**
```json
{
  "id": "generated-id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-01-29T10:30:45.123Z"
}
```

6. Verify:
   - ✅ Success badge
   - Status: 201 Created
   - Response body matches expected format

**Pass Criteria:** ✅ POST request with body works correctly

---

### ✅ Test 5: Real API Testing - Error Case (404)

**Steps:**
1. Real API Testing: ON
2. Base URL: `http://localhost:3000`
3. Configure test:
   - Endpoint: `/api/nonexistent`
   - Method: GET
4. Click "Send Real Request"
5. **Expected Response:**
```json
{
  "error": "Not Found",
  "message": "Route /api/nonexistent not found",
  "statusCode": 404
}
```

6. Verify:
   - ❌ Failed badge (red)
   - Status: 404 Not Found
   - Error message displayed

**Pass Criteria:** ✅ Error handling works, proper display

---

### ✅ Test 6: Real API Testing - Network Error

**Steps:**
1. Real API Testing: ON
2. Base URL: `http://localhost:9999` (invalid port)
3. Configure test:
   - Endpoint: `/api/test`
   - Method: GET
4. Click "Send Real Request"
5. **Expected:**
   - ⚠️ Network error message
   - "Failed to connect to API server"
   - Toast notification with error

**Pass Criteria:** ✅ Network errors handled gracefully

---

### ✅ Test 7: Add Manual Test Case

**Steps:**
1. Go to "Test API" tab
2. Scroll to "Manual Test Cases"
3. Click "+ Add Test"
4. Verify form appears with:
   - Test Name input
   - Test Description textarea
   - Save and Cancel buttons
5. Fill in:
   - Name: `Get User by ID`
   - Description: `Fetch a single user by their ID`
6. Before saving, configure in Test Configuration:
   - Endpoint: `/api/users/123`
   - Method: GET
7. Click "Save Test"
8. **Expected:**
   - Form closes
   - New test appears in "Saved Tests" list
   - Shows: name, description, method, endpoint
   - Has "Use" and "Delete" buttons

**Pass Criteria:** ✅ Manual test created and displayed

---

### ✅ Test 8: Use Manual Test Case

**Steps:**
1. With manual test from Test 7 visible
2. Click "Use This Test" button
3. **Expected:**
   - Test Configuration section updates:
     - Endpoint: `/api/users/123`
     - Method: GET
4. Verify configuration matches saved test

**Pass Criteria:** ✅ Test configuration applied correctly

---

### ✅ Test 9: Delete Manual Test Case

**Steps:**
1. Find any manual test in the list
2. Click "Delete" button (trash icon)
3. **Expected:**
   - Test removed from list immediately
   - No confirmation dialog (optional enhancement)

**Pass Criteria:** ✅ Test deleted successfully

---

### ✅ Test 10: Toggle Between Real and Simulated Testing

**Steps:**
1. Configure test: GET `/api/test`
2. Real API Testing: OFF
3. Click "Simulate Test"
4. **Expected:** AI-generated simulated response with scenarios
5. Toggle Real API Testing: ON
6. Click "Send Real Request"
7. **Expected:** Real HTTP response
8. Verify both responses visible (if both have been run)

**Pass Criteria:** ✅ Can switch between modes, both work

---

### ✅ Test 11: Button Text Changes

**Steps:**
1. Real API Testing: OFF
2. **Expected Button Text:** "Simulate Test"
3. Real API Testing: ON
4. **Expected Button Text:** "Send Real Request"
5. Toggle back OFF
6. **Expected:** Button text reverts

**Pass Criteria:** ✅ Button text updates based on toggle

---

### ✅ Test 12: Base URL Configuration

**Steps:**
1. Real API Testing: ON
2. Change Base URL to: `https://jsonplaceholder.typicode.com`
3. Configure test:
   - Endpoint: `/users/1`
   - Method: GET
4. Click "Send Real Request"
5. **Expected:** Response from JSONPlaceholder API:
```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  ...
}
```

6. Verify external API works

**Pass Criteria:** ✅ Can test external APIs

---

### ✅ Test 13: Response Duration Tracking

**Steps:**
1. Real API Testing: ON
2. Base URL: `http://localhost:3000`
3. Send multiple requests to `/api/test`
4. Check duration badge in each response
5. **Expected:** 
   - Duration displayed in milliseconds
   - Varies slightly between requests
   - Typically 10-100ms for local server

**Pass Criteria:** ✅ Duration tracked and displayed

---

### ✅ Test 14: Response Headers Display

**Steps:**
1. Send real API request (any endpoint)
2. Check "Response Headers" section
3. **Expected headers:**
```json
{
  "content-type": "application/json",
  "content-length": "123",
  "x-powered-by": "Express",
  "date": "...",
  ...
}
```

4. Verify headers are formatted and readable

**Pass Criteria:** ✅ Headers displayed correctly

---

### ✅ Test 15: Multiple Manual Tests

**Steps:**
1. Add 3 manual tests:
   - Test 1: GET `/api/users`
   - Test 2: POST `/api/users`
   - Test 3: DELETE `/api/users/1`
2. Verify all 3 appear in list
3. Use Test 2
4. Verify POST configuration applied
5. Delete Test 1
6. Verify only 2 tests remain

**Pass Criteria:** ✅ Multiple tests managed correctly

---

## Edge Cases to Test

### 🔍 Edge Case 1: Empty Code Editor
**Test:** Auto-detect with empty code  
**Expected:** No detection triggered

### 🔍 Edge Case 2: Invalid JSON in Body
**Test:** POST with malformed JSON  
**Expected:** Error message or validation

### 🔍 Edge Case 3: Very Large Response
**Test:** API returning large JSON (>1MB)  
**Expected:** Response displays correctly, may truncate

### 🔍 Edge Case 4: Slow API Response
**Test:** API with 5+ second delay  
**Expected:** Loading indicator, eventually times out or succeeds

### 🔍 Edge Case 5: Special Characters in Endpoint
**Test:** Endpoint with spaces or special chars  
**Expected:** Proper URL encoding

---

## Performance Tests

### ⚡ Performance 1: Debounce Timing
1. Type code rapidly in editor
2. Auto-detect should wait 1.5s before triggering
3. Verify only one detection call made

### ⚡ Performance 2: Multiple Rapid Tests
1. Click "Send Real Request" 10 times rapidly
2. Verify each request completes
3. No UI freezing

---

## Browser Compatibility Tests

Test in:
- ✅ Chrome (primary)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

Verify:
- Toggle switches work
- Fetch API supported
- UI renders correctly
- Icons display properly

---

## Accessibility Tests

### ♿ A11y 1: Keyboard Navigation
1. Tab through all interactive elements
2. Verify logical order
3. Test Enter/Space on buttons
4. Test Escape to cancel forms

### ♿ A11y 2: Screen Reader
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate through component
3. Verify labels are read
4. Verify state changes announced

---

## Test Results Template

```markdown
## Test Session: [Date]
**Tester:** [Your Name]
**Environment:** [Browser, OS, Server Status]

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Auto-Detect Endpoints | ✅ Pass | Worked as expected |
| 2 | Manual Detection | ✅ Pass | |
| 3 | Real API - Success | ✅ Pass | |
| 4 | Real API - POST | ⚠️ Warning | Body not sent |
| 5 | Real API - 404 | ✅ Pass | |
| 6 | Network Error | ❌ Fail | Not handled |
| 7 | Add Manual Test | ✅ Pass | |
| 8 | Use Manual Test | ✅ Pass | |
| 9 | Delete Manual Test | ✅ Pass | |
| 10 | Toggle Modes | ✅ Pass | |
| 11 | Button Text Changes | ✅ Pass | |
| 12 | Base URL Config | ✅ Pass | |
| 13 | Duration Tracking | ✅ Pass | |
| 14 | Response Headers | ✅ Pass | |
| 15 | Multiple Manual Tests | ✅ Pass | |

**Issues Found:**
1. [Issue description]
2. [Issue description]

**Suggestions:**
1. [Suggestion]
2. [Suggestion]
```

---

## Backend Testing API Setup

### Installation
```bash
cd backend-testing-api
npm install
```

### Start Server
```bash
npm start
# Server runs on http://localhost:3000
```

### Available Endpoints
- `GET /api/test` - Simple test endpoint
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/health` - Health check

---

## Troubleshooting

### Issue: Auto-detect not working
**Solution:** 
- Check console for errors
- Verify toggle is ON
- Ensure code contains valid routes
- Wait full 1.5 seconds after typing

### Issue: Real API request fails
**Solution:**
- Verify backend server is running
- Check base URL is correct
- Test endpoint directly in browser/Postman
- Check for CORS issues

### Issue: Manual test not saving
**Solution:**
- Ensure name and description filled
- Check console for errors
- Verify test configuration set before saving

### Issue: Toggle not responding
**Solution:**
- Check React state updates
- Verify event handlers attached
- Inspect browser console

---

## Next Steps After Testing

1. ✅ Document all bugs found
2. ✅ Create GitHub issues for bugs
3. ✅ Test fixes
4. ✅ Update documentation
5. ✅ Create demo video
6. ✅ Write user guide

---

**Testing Version:** 1.0  
**Last Updated:** January 29, 2025  
**Status:** Ready for QA
