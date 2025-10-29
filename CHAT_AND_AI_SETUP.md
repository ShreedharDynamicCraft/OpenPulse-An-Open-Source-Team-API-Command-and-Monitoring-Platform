# 🚀 Collaborative Chat & AI Integration - Setup Guide

This guide will help you set up and use the new collaborative chat system with AI code review powered by Google Gemini.

---

## 📋 Prerequisites

1. **Google AI API Key**: Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Database**: PostgreSQL database (we're using Neon)
3. **Clerk Account**: For authentication

---

## ⚙️ Environment Setup

Add the following to your `.env` file:

```env
# Existing variables
DATABASE_URL="your_postgresql_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
CLERK_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 🆕 Add this for AI features
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

---

## 🗄️ Database Migration

The new chat and activity log features require database migrations:

```bash
# Apply migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### New Database Models:

- **ChatMessage**: Stores all chat messages with AI support
- **MessageReaction**: Emoji reactions on messages
- **ActivityLog**: Comprehensive activity and test run logs

---

## 🎨 Features Overview

### 1. **Workspace Chat**

Access from the sidebar's **Chat** tab:

- **Real-time messaging** with 3-second polling
- **Markdown support** for formatted messages
- **Code snippets** with syntax highlighting
- **Message threading** (coming soon)
- **Emoji reactions** - Click the smile icon on any message
- **Infinite scroll** - Load older messages automatically

### 2. **AI Code Review**

Click the **"AI Assistant"** button in chat to open the AI panel:

#### **Code Snippet Review:**
- Select review type: Review, Explain, Optimize, or Generate Tests
- Specify programming language
- Paste your code
- Get detailed AI analysis with suggestions

#### **GitHub Repository Review:**
- Enter any public GitHub repo URL
- AI fetches and analyzes the repository structure
- Get comprehensive architecture and code quality feedback

### 3. **Activity Logs**

Access from the sidebar's **Logs** tab:

- **Filter by type**: Tests, Collections, Errors, etc.
- **Filter by status**: Success, Failed, All
- **View details**: Expand logs to see full JSON data
- **Timeline view**: See all workspace activity in chronological order

---

## 📚 Usage Examples

### Sending a Chat Message

```typescript
// The UI handles this automatically, but here's the underlying action:
import { sendChatMessage } from '@/modules/workspace/actions/chat';

await sendChatMessage({
  workspaceId: "workspace-id",
  content: "Hey team, the new API endpoint is ready!",
  type: "TEXT"
});
```

### Requesting AI Code Review

```typescript
import { requestAICodeReview } from '@/modules/workspace/actions/chat';

await requestAICodeReview({
  workspaceId: "workspace-id",
  code: `
    function calculateTotal(items) {
      let total = 0;
      for(let i = 0; i < items.length; i++) {
        total += items[i].price;
      }
      return total;
    }
  `,
  language: "javascript",
  type: "review"
});
```

### Logging a Test Run

```typescript
import { logTestRun } from '@/modules/workspace/actions/activity-logs';

await logTestRun({
  workspaceId: "workspace-id",
  requestId: "request-id",
  status: "success",
  statusCode: 200,
  duration: 145,
  response: { data: "success" },
  postToChat: true // This will post a system message to chat
});
```

---

## 🔧 Integrating with Your Request Runner

To automatically log test runs, update your request execution code:

```typescript
// In your API request handler
import { logTestRun } from '@/modules/workspace/actions/activity-logs';

async function executeRequest(requestId: string, workspaceId: string) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    // Log the test run
    await logTestRun({
      workspaceId,
      requestId,
      status: response.ok ? "success" : "failed",
      statusCode: response.status,
      duration,
      response: await response.json(),
      postToChat: true // Notify team in chat
    });
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    await logTestRun({
      workspaceId,
      requestId,
      status: "failed",
      statusCode: 0,
      duration,
      response: { error: error.message },
      postToChat: true
    });
    
    throw error;
  }
}
```

---

## 🎯 Advanced Features

### Custom AI Prompts

You can extend the Gemini AI service for custom prompts:

```typescript
// src/lib/gemini-ai.ts
import { generateChatResponse } from '@/lib/gemini-ai';

const response = await generateChatResponse(
  "How can I optimize this API endpoint for better performance?",
  "The endpoint currently takes 500ms to respond"
);
```

### Filtering Activity Logs

```typescript
import { getActivityLogs } from '@/modules/workspace/actions/activity-logs';

const logs = await getActivityLogs(workspaceId, {
  type: "TEST_RUN",
  status: "failed",
  limit: 20
});
```

---

## 🔐 Security Considerations

1. **Rate Limiting**: Consider adding rate limits to AI requests to prevent abuse
2. **API Key**: Never expose your `GOOGLE_GENERATIVE_AI_API_KEY` in client-side code
3. **Content Sanitization**: Markdown content is sanitized before rendering
4. **Workspace Permissions**: Only workspace members can access chat and logs

---

## 🐛 Troubleshooting

### Chat messages not appearing
- Check if polling is working (should refetch every 3 seconds)
- Verify workspace membership
- Check browser console for errors

### AI not responding
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set correctly
- Check API quota limits in Google AI Studio
- Look for errors in server logs

### Logs not showing
- Ensure you're calling `logActivity` or helper functions
- Verify database migration was successful
- Check `ActivityLog` table in database

---

## 📊 Performance Tips

1. **Chat Polling**: Adjust refetch interval in `use-chat.ts` if needed:
   ```typescript
   refetchInterval: 5000, // Change from 3000 to 5000ms
   ```

2. **Infinite Scroll**: Messages load 50 at a time by default. Adjust in:
   ```typescript
   const result = await getChatMessages(workspaceId, pageParam, 100); // Change 50 to 100
   ```

3. **Log Retention**: Consider implementing log cleanup for old entries:
   ```sql
   DELETE FROM "ActivityLog" WHERE "createdAt" < NOW() - INTERVAL '30 days';
   ```

---

## 🎉 Next Steps

Now that your collaborative chat system is set up:

1. **Try AI Code Review** - Paste some code and see Gemini's suggestions
2. **Run Some Tests** - Watch logs appear automatically in the Logs tab
3. **Chat with Your Team** - Use emoji reactions and markdown formatting
4. **Analyze GitHub Repos** - Review any public repository with AI

For questions or issues, check the main README or open an issue on GitHub!

---

## 📝 API Reference

### Chat Actions
- `sendChatMessage(data)` - Send a chat message
- `getChatMessages(workspaceId, cursor?, limit?)` - Fetch messages with pagination
- `requestAICodeReview(data)` - Get AI code review
- `addMessageReaction(data)` - Add emoji reaction
- `removeMessageReaction(data)` - Remove emoji reaction
- `getMessageReplies(messageId, workspaceId)` - Get thread replies

### Activity Log Actions
- `logActivity(data)` - Create an activity log
- `getActivityLogs(workspaceId, options?)` - Fetch logs with filters
- `logTestRun(data)` - Helper for test run logs
- `logCollectionRun(data)` - Helper for collection run logs
- `deleteActivityLog(logId, workspaceId)` - Delete a log (admin only)

### React Query Hooks
- `useWorkspaceChat(workspaceId)` - Infinite query for chat messages
- `useSendMessage(workspaceId)` - Mutation for sending messages
- `useAICodeReview(workspaceId)` - Mutation for AI review
- `useAddReaction(workspaceId)` - Mutation for adding reactions
- `useActivityLogs(workspaceId, options?)` - Infinite query for logs
- `useOnlineUsers(workspaceId)` - Query for online workspace members
