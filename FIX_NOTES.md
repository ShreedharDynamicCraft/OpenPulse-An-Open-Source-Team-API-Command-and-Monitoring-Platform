# Fix: HTTP Methods and URL Not Persisting

## Problem
When changing the HTTP method or URL in the Request Bar, requests were still being sent to the old hardcoded URL (`https://echo.hoppscotch.io`) with the GET method, regardless of what was selected in the UI.

## Root Cause
The UI changes (URL/method) were only updating the Zustand store (local state), but **not saving to the database**. When the `run()` function executed, it fetched the request from the database, which still had the old hardcoded values.

### Code Flow Before Fix:
```
User changes URL → Updates Zustand tab state → Clicks Send 
→ run(requestId) → Fetches from DB (old values) → Sends request to old URL
```

## Solution
Added a `useUpdateRequest` hook that saves URL and method changes to the database **before** executing the request.

### Files Modified:

1. **`src/modules/request/actions/index.ts`**
   - Added `updateRequestQuick()` function to quickly update URL/method in database

2. **`src/modules/request/hooks/request.ts`**
   - Added `useUpdateRequest()` hook that calls `updateRequestQuick()`

3. **`src/modules/request/components/request-bar.tsx`**
   - Modified `onSendRequest()` to save changes before executing request:
   ```typescript
   const onSendRequest = async () => {
     // Save URL and method to database before sending
     if (tab.requestId) {
       await updateRequest.mutateAsync({
         url: tab.url,
         method: tab.method,
       });
     }
     
     const res = await mutateAsync(); // Now uses updated values
   }
   ```

### Code Flow After Fix:
```
User changes URL → Updates Zustand tab state → Clicks Send 
→ updateRequest (saves to DB) → run(requestId) → Fetches from DB (new values) 
→ Sends request to correct URL with correct method ✅
```

## Testing the Fix

### 1. Start Both Servers
```bash
# Terminal 1: Backend Testing API
cd /Users/shreedhar/Sem7/Project/postman-clone/backend-testing-api
npm start

# Terminal 2: Postman Clone (Next.js)
cd /Users/shreedhar/Sem7/Project/postman-clone
npm run dev
```

### 2. Test Steps
1. Open `http://localhost:3001` (or whatever port Next.js is using)
2. Sign in with Clerk
3. Create or open a collection
4. Create a new request or open an existing one
5. **Change the URL** to `http://localhost:4000/api/users`
6. **Change the method** to `GET` or `POST`
7. Click **Send**

### 3. Expected Results
✅ Request should go to `http://localhost:4000/api/users` (not echo.hoppscotch.io)
✅ Method should be what you selected (not always GET)
✅ Response should show data from your local backend API
✅ Response headers should show `"host": "localhost:4000"`

### 4. Test Different Methods
Try these endpoints with different methods:

**GET** `http://localhost:4000/api/users`
- Should return array of users

**POST** `http://localhost:4000/api/users`
- Body: `{ "name": "Test User", "email": "test@example.com" }`
- Should create a new user

**PUT** `http://localhost:4000/api/users/1`
- Body: `{ "name": "Updated User" }`
- Should update user

**DELETE** `http://localhost:4000/api/users/1`
- Should delete user

## Additional Notes
- The fix saves changes **on Send click**, not on every keystroke (to avoid excessive DB writes)
- If you want auto-save on URL/method change, add a debounced update handler
- The `updateRequestQuick()` function only updates changed fields (partial update)

## Files Changed
- `src/modules/request/actions/index.ts` (added updateRequestQuick)
- `src/modules/request/hooks/request.ts` (added useUpdateRequest hook)
- `src/modules/request/components/request-bar.tsx` (added save before send)
