# API Code Editor - Visual UI Guide

## Before vs After Comparison

### Endpoints Tab - BEFORE
```
┌──────────────────────────────────────────────────────┐
│  Endpoints Tab                                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [Detect Endpoints Button]                          │
│                                                      │
│  (Endpoints appear after manual button click)       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Endpoints Tab - AFTER ✨
```
┌──────────────────────────────────────────────────────┐
│  Endpoints Tab                                       │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐ │
│  │ 🔄 Auto-detect Endpoints         ●────○ ON    │ │
│  │    Automatically detect endpoints when code    │ │
│  │    changes                                     │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [Detect Now Button]  ← Changed from "Detect        │
│                          Endpoints"                  │
│                                                      │
│  (Endpoints auto-detected OR manually triggered)    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Test API Tab - BEFORE
```
┌──────────────────────────────────────────────────────┐
│  Test API Tab                                        │
├──────────────────────────────────────────────────────┤
│  Test Configuration                                  │
│  ┌────────────────────────────────────────────────┐ │
│  │ Endpoint: [/api/users___________________]      │ │
│  │ Method:   [GET ▼]                              │ │
│  │ Body:     [_________________________________]  │ │
│  │                                                │ │
│  │ [Send Test Request]                            │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Test Response (AI Simulation)                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Status: Simulated Success                      │ │
│  │ Response: { ... }                              │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Test API Tab - AFTER ✨
```
┌──────────────────────────────────────────────────────┐
│  Test API Tab                                        │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐ │
│  │ 🌐 Real API Testing              ●────○ ON    │ │ ← NEW
│  │    Test against a real API server             │ │
│  │                                                │ │
│  │    Base URL: [http://localhost:3000_______]   │ │ ← NEW
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Test Configuration                                  │
│  ┌────────────────────────────────────────────────┐ │
│  │ Endpoint: [/api/users___________________]      │ │
│  │ Method:   [GET ▼]                              │ │
│  │ Body:     [_________________________________]  │ │
│  │                                                │ │
│  │ [Send Real Request] ← Text changes based       │ │
│  │                       on toggle state          │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │ ← NEW
│  │ ✏️ Manual Test Cases              [+ Add Test] │ │
│  ├────────────────────────────────────────────────┤ │
│  │                                                │ │
│  │ (When adding new test)                         │ │
│  │ ┌──────────────────────────────────────────┐  │ │
│  │ │ Test Name:  [Get All Users__________]    │  │ │
│  │ │ Description: [Fetch user list________]   │  │ │
│  │ │                                          │  │ │
│  │ │ [Save Test] [Cancel]                     │  │ │
│  │ └──────────────────────────────────────────┘  │ │
│  │                                                │ │
│  │ Saved Tests:                                   │ │
│  │ ┌──────────────────────────────────────────┐  │ │
│  │ │ 📝 Get All Users                         │  │ │
│  │ │    Fetch user list                       │  │ │
│  │ │    GET /api/users                        │  │ │
│  │ │                                          │  │ │
│  │ │    [Use This Test] [🗑️ Delete]          │  │ │
│  │ └──────────────────────────────────────────┘  │ │
│  │                                                │ │
│  │ ┌──────────────────────────────────────────┐  │ │
│  │ │ 📝 Create User                           │  │ │
│  │ │    Create a new user                     │  │ │
│  │ │    POST /api/users                       │  │ │
│  │ │                                          │  │ │
│  │ │    [Use This Test] [🗑️ Delete]          │  │ │
│  │ └──────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Real API Response                   [200 Badge]    │ ← NEW
│  ┌────────────────────────────────────────────────┐ │
│  │ ✅ Success  200 OK  ⏱️ 123ms                   │ │
│  │                                                │ │
│  │ Response Headers                               │ │
│  │ {                                              │ │
│  │   "content-type": "application/json",          │ │
│  │   "content-length": "1234"                     │ │
│  │ }                                              │ │
│  │                                                │ │
│  │ Response Body                                  │ │
│  │ {                                              │ │
│  │   "users": [...],                              │ │
│  │   "total": 50                                  │ │
│  │ }                                              │ │
│  │                                                │ │
│  │ Timestamp: 1/29/2025, 10:30:45 AM              │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Simulated Test Response                            │
│  ┌────────────────────────────────────────────────┐ │
│  │ (AI-generated test results when toggle is OFF) │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## Toggle Switch Visual States

### OFF State (AI Simulation Mode)
```
┌────────────────────────────────────────┐
│ Real API Testing         ○────● OFF   │
│ Test against a real API server        │
└────────────────────────────────────────┘

Button shows: [Simulate Test]
Response shows: Simulated Test Response (AI)
```

### ON State (Real API Mode)
```
┌────────────────────────────────────────┐
│ Real API Testing         ●────○ ON    │
│ Test against a real API server        │
│                                        │
│ Base URL: [http://localhost:3000___]  │ ← Shows when ON
└────────────────────────────────────────┘

Button shows: [Send Real Request]
Response shows: Real API Response (HTTP)
```

---

## Manual Test Case Card States

### Empty State (No Manual Tests)
```
┌────────────────────────────────────────┐
│ Manual Test Cases        [+ Add Test] │
├────────────────────────────────────────┤
│                                        │
│  No manual test cases yet.             │
│  Click "+ Add Test" to create one.     │
│                                        │
└────────────────────────────────────────┘
```

### Adding New Test
```
┌────────────────────────────────────────┐
│ Manual Test Cases        [+ Add Test] │ ← Clicked
├────────────────────────────────────────┤
│ ┌──────────────────────────────────┐  │
│ │ Test Name:                       │  │
│ │ [Get User by ID_____________]    │  │
│ │                                  │  │
│ │ Description:                     │  │
│ │ [Fetch a single user by ID___]   │  │
│ │ [________________________]       │  │
│ │                                  │  │
│ │ [💾 Save Test] [❌ Cancel]       │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### With Saved Tests
```
┌────────────────────────────────────────┐
│ Manual Test Cases        [+ Add Test] │
├────────────────────────────────────────┤
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ 📝 Get User by ID                │  │
│ │    Fetch a single user by ID     │  │
│ │    GET /api/users/:id            │  │
│ │                                  │  │
│ │    [Use This Test] [🗑️ Delete]  │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ 📝 Update User                   │  │
│ │    Update user information       │  │
│ │    PUT /api/users/:id            │  │
│ │                                  │  │
│ │    [Use This Test] [🗑️ Delete]  │  │
│ └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

---

## Response Display Visual Comparison

### AI Simulated Response (Toggle OFF)
```
┌──────────────────────────────────────────┐
│ Simulated Test Response                  │
├──────────────────────────────────────────┤
│ ✅ Test Passed (2/2 scenarios)           │
│                                          │
│ Response:                                │
│ {                                        │
│   "status": "success",                   │
│   "users": [                             │
│     { "id": 1, "name": "John" }          │
│   ]                                      │
│ }                                        │
│                                          │
│ Test Scenarios:                          │
│ • ✅ Valid Request                       │
│ • ✅ Empty Database                      │
│                                          │
└──────────────────────────────────────────┘
```

### Real API Response (Toggle ON) - Success
```
┌──────────────────────────────────────────┐
│ Real API Response           [200]        │
├──────────────────────────────────────────┤
│ ✅ Success  200 OK  ⏱️ 123ms             │
│                                          │
│ Response Headers                         │
│ {                                        │
│   "content-type": "application/json",    │
│   "x-powered-by": "Express"              │
│ }                                        │
│                                          │
│ Response Body                            │
│ {                                        │
│   "users": [                             │
│     { "id": 1, "name": "John Doe" },     │
│     { "id": 2, "name": "Jane Smith" }    │
│   ],                                     │
│   "total": 2                             │
│ }                                        │
│                                          │
│ Timestamp: 1/29/2025, 10:30:45 AM        │
└──────────────────────────────────────────┘
```

### Real API Response (Toggle ON) - Error
```
┌──────────────────────────────────────────┐
│ Real API Response           [404]        │
├──────────────────────────────────────────┤
│ ❌ Failed  404 Not Found  ⏱️ 45ms        │
│                                          │
│ Response Headers                         │
│ {                                        │
│   "content-type": "application/json"     │
│ }                                        │
│                                          │
│ Response Body                            │
│ {                                        │
│   "error": "User not found",             │
│   "code": "USER_NOT_FOUND"               │
│ }                                        │
│                                          │
│ Timestamp: 1/29/2025, 10:31:12 AM        │
└──────────────────────────────────────────┘
```

### Real API Response - Network Error
```
┌──────────────────────────────────────────┐
│ Real API Response                        │
├──────────────────────────────────────────┤
│ ❌ Request Failed                        │
│                                          │
│ ⚠️ Failed to connect to API server      │
│                                          │
│ Error: Failed to fetch                   │
│                                          │
│ Possible causes:                         │
│ • Server not running                     │
│ • Incorrect URL                          │
│ • Network issues                         │
│ • CORS policy blocking request           │
│                                          │
└──────────────────────────────────────────┘
```

---

## Color Coding

### Status Badges
- 🟢 **Green (Success)**: 200-299 status codes
- 🔴 **Red (Error)**: 400-599 status codes
- ⚫ **Gray (Network Error)**: Failed to fetch

### HTTP Method Badges
- 🔵 **Blue**: GET
- 🟢 **Green**: POST
- 🟡 **Yellow**: PUT
- 🔴 **Red**: DELETE

### Toggle Switch Colors
- 🟢 **Green**: When ON (real API mode)
- ⚫ **Gray**: When OFF (simulation mode)

---

## Workflow Diagrams

### Auto-Detect Workflow
```
User types code in editor
         ↓
Wait 1.5 seconds (debounce)
         ↓
Auto-detect enabled? ──NO──> Do nothing
         ↓ YES
Call handleDetectEndpoints()
         ↓
Show detected endpoints
```

### Real API Test Workflow
```
User configures test
         ↓
Real API Testing ON? ──NO──> Call AI simulation
         ↓ YES
Enter base URL
         ↓
Click "Send Real Request"
         ↓
Send HTTP request via fetch()
         ↓
Measure duration
         ↓
Parse response (JSON/text)
         ↓
Display in "Real API Response"
```

### Manual Test Workflow
```
Click "+ Add Test"
         ↓
Enter test details
         ↓
Click "Save Test"
         ↓
Test added to list
         ↓
Click "Use This Test"
         ↓
Test configuration applied
         ↓
Click "Send Real Request"
         ↓
View response
```

---

## Keyboard Shortcuts (Suggested)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Send test request |
| `Ctrl/Cmd + T` | Toggle real API testing |
| `Ctrl/Cmd + D` | Toggle auto-detect |
| `Ctrl/Cmd + N` | New manual test |
| `Esc` | Cancel adding test |

---

## Accessibility Features

### Screen Reader Labels
- Toggle switches have descriptive labels
- Buttons have clear action text
- Status badges include status text
- Forms have proper labels

### Keyboard Navigation
- All interactive elements focusable
- Tab order follows visual layout
- Enter key activates buttons
- Escape key cancels dialogs

### Visual Indicators
- Success/error states clearly marked
- Color not the only indicator (icons + text)
- Loading states visible
- Error messages descriptive

---

## Mobile Responsiveness

### Desktop (1024px+)
- Full 2-column layout
- All features visible
- Larger response displays

### Tablet (768px-1023px)
- Single column layout
- Collapsible sections
- Responsive cards

### Mobile (< 768px)
- Vertical stacking
- Touch-friendly buttons
- Simplified response view
- Swipe gestures for tabs

---

**Created:** January 29, 2025  
**Version:** 1.0  
**Status:** Ready for Review
