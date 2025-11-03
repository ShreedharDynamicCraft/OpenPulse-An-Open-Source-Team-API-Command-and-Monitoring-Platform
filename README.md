
# 🚀 API Command Hub

A modern, open-source **Professional API Testing and Monitoring Platform** built with **Next.js 15, TypeScript, Prisma, TailwindCSS, shadcn/ui, TanStack Query, and Zustand**.  
It provides a sleek UI and developer-focused workflow to test, monitor, and manage REST APIs and WebSocket connections efficiently.

**🆕 Now with AI-powered collaborative chat and comprehensive activity logging!**

---

## ✨ Features

### 🔹 REST API Client
- Send HTTP requests with **methods (GET, POST, PUT, DELETE, etc.)**  
- Manage **request parameters, headers, and body (raw JSON / text)**  
- **Request response viewer** with pretty JSON formatting  
- Track **response time, size, and status**  
- Save requests inside **collections** for reusability  
- Request history & response persistence  

### 🔹 WebSocket Client
- Connect to **ws://** and **wss://** endpoints  
- Send and receive messages in real time  
- Support for multiple protocols  
- View messages with metadata (**direction, payload, size, timestamp**)  
- Save messages for later inspection  

### 🔹 Workspace & Collaboration
- Create and manage **multiple workspaces**  
- **Invite team members** via unique invite links  
- Role-based workspace access (Admin, Member)  
- View workspace members with overlapping avatars and hover tooltips  

### 🆕 🔹 Real-time Workspace Chat (Enhanced)
- **Lightning-fast messaging** with Server-Sent Events (SSE)
- **Instant message delivery** with live connection status
- **File attachments** - Share images, PDFs, documents, videos (50MB limit)
- **Image previews** with fullscreen view
- **Voice calling** - WebRTC-based peer-to-peer audio calls
- **Online presence** tracking for team members
- **Mute/unmute** and call controls
- **Modern UI** with dark mode support and smooth animations
- **Message history** with pagination
- **Real-time typing indicators** (infrastructure ready)  

### 🆕 🔹 AI Code Review (Gemini Integration)
- **Ask @Gemini** for instant AI assistance  
- **Code Review**: Get detailed feedback on code quality, security, and performance  
- **Code Explanation**: Understand complex code snippets  
- **Code Optimization**: Receive optimization suggestions  
- **Test Generation**: Auto-generate test cases  
- **GitHub Repository Analysis**: Review entire repositories with AI  
- Supports multiple programming languages  
- AI responses formatted in beautiful markdown with syntax highlighting  

### 🆕 🔹 Activity Logs & Test Tracking
- **Comprehensive activity logging** for all workspace actions  
- Track **test runs** with status, duration, and response codes  
- Monitor **collection runs** with pass/fail statistics  
- View **API calls**, **errors**, and **system events**  
- **Filter logs** by type, status, and user  
- **Timeline view** with detailed metadata  
- Logs automatically posted to chat for team visibility  
- Export and analyze logs programmatically  

### 🔹 Additional Utilities
- Raw request body editor powered by **Monaco Editor**  
- JSON pretty print & validation  
- Copy to clipboard & auto-format options  
- Persistent state management with **Zustand**  
- Smooth and modern UI with **shadcn/ui + TailwindCSS**  

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)  
- **Language:** TypeScript  
- **ORM & Database:** Prisma + PostgreSQL  
- **State Management:** Zustand  
- **API Caching/Fetching:** TanStack Query  
- **UI Components:** shadcn/ui + TailwindCSS  
- **Icons:** Lucide-react  
- **Editor:** Monaco Editor  
- **Auth:** Clerk  
- **AI:** Google Gemini API (gemini-2.0-flash)  
- **Markdown:** react-markdown + react-syntax-highlighter  
- **Deployment:** Vercel  

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/Aestheticsuraj234/api-command-hub
cd api-command-hub
````

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Environment Variables

Create a `.env` file in the root and add:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/apicommandhub"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
```

### 4. Setup Database

```bash
npx prisma migrate dev
npx prisma db seed   # if you have seeds
```

### 5. Run the Development Server

```bash
npm run dev
```

App will be available at: [http://localhost:3000](http://localhost:3000)

---

## � Documentation

- **[Complete Documentation](./DOCUMENTATION.md)** - Comprehensive guide covering all features
- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes

---

## �📦 Project Structure

```
/app
  /api             → API routes (REST & WebSocket server actions)
  /(workspace)     → Workspace-specific routes
    /code-editor   → Standalone AI code editor with analysis
    /design        → Design system with tldraw
    /realtime      → Real-time collaboration features
  /invite          → Invite link pages
/components        → Reusable UI components
/modules           → Features (auth, invites, requests, websockets, AI, etc.)
/lib               → Utilities (db, auth, store)
/prisma            → Database schema and migrations
```

---

## 🤝 Special Thanks

* **Postman** – for inspiring the core idea
* **Next.js & Vercel** – for providing a powerful fullstack framework
* **shadcn/ui** – for beautiful and accessible UI components
* **TanStack Query & Zustand** – for data and state management
* All open-source contributors & libraries used in this project 🙏

---


## 📜 License

This project is **MIT Licensed**.
Feel free to fork, contribute, and build your own features on top of it!



