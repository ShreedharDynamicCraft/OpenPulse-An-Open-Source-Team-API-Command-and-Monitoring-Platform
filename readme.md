# 🚀 OpenPulse

<div align="center">

![OpenPulse Banner](https://img.shields.io/badge/OpenPulse-API%20Platform-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgMTJMMTIgM0wyMSAxMiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+)

**The Open-Source API Platform for Modern Teams**

*Test APIs • Design Endpoints • Review Code • Collaborate in Real-time*

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-core-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Documentation](#-detailed-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Why OpenPulse?](#-why-openpulse)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Detailed Documentation](#-detailed-documentation)
  - [REST API Client](#1-rest-api-client)
  - [WebSocket Client](#2-websocket-client)
  - [Team Collaboration](#3-team-collaboration)
  - [AI Code Review](#4-ai-code-review)
  - [Design System](#5-design-system)
  - [Real-time Features](#6-real-time-features)
- [Page Structure](#-page-structure)
- [File Structure Explained](#-file-structure-explained)
- [Environment Setup](#-environment-setup)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🎯 Overview

**OpenPulse** is a comprehensive, open-source API development and collaboration platform that combines the power of API testing (like Postman), real-time team communication (like Slack), code review (like GitHub), and design tools (like Figma) into a single unified workspace.

Built with **Next.js 15**, **TypeScript**, **Prisma**, and powered by **Google Gemini AI**, OpenPulse provides developers with everything they need to design, test, monitor, and collaborate on APIs - all in one place.

### 🌟 **What Makes OpenPulse Special?**

- **🔄 All-in-One Platform**: No need to switch between multiple tools
- **🤖 AI-Powered**: Gemini 2.0 for code review, generation, and optimization
- **💬 Built-in Communication**: Real-time chat, voice, and video calls
- **🎨 Design Integration**: Create API designs and prototypes visually
- **📊 Activity Tracking**: Comprehensive logs and analytics
- **🔓 Open Source**: Fully transparent and customizable

---

## 💡 Why OpenPulse?

### **The Problem**

Modern API development requires juggling multiple tools:
- ❌ **Postman** for API testing
- ❌ **Slack** for team communication
- ❌ **GitHub** for code reviews
- ❌ **Figma** for API design
- ❌ **Datadog** for monitoring
- ❌ **Notion** for documentation

**Result**: Context switching, lost productivity, disconnected workflows

### **The Solution: OpenPulse** ✅

One platform that integrates:
- ✅ **API Testing** (REST + WebSocket)
- ✅ **Team Chat** (Messages + Voice/Video)
- ✅ **Code Review** (AI-powered)
- ✅ **Design System** (Visual API design)
- ✅ **Activity Logs** (Complete audit trail)
- ✅ **Analytics** (Performance insights)

**Result**: Seamless workflow, better collaboration, faster development

---

## ✨ Core Features

### 🔌 **1. REST API Client**
Professional HTTP client with advanced capabilities

- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Request Builder**:
  - URL parameters with auto-encoding
  - Headers management (custom + presets)
  - Body editor (JSON, XML, Form Data, Raw)
  - Authentication (Bearer, Basic, API Key, OAuth 2.0)
- **Response Viewer**:
  - Syntax-highlighted JSON/XML
  - Response time tracking
  - Response size calculation
  - Status code indicators
  - Headers inspection
- **Collections**:
  - Organize requests into folders
  - Share with team members
  - Import/Export collections
  - Request history
- **Code Generation**:
  - Generate code in 10+ languages
  - cURL, JavaScript, Python, Java, etc.
- **Testing**:
  - Pre-request scripts
  - Post-response assertions
  - Test suites with pass/fail tracking

### 🔗 **2. WebSocket Client**
Real-time WebSocket testing and monitoring

- **Connection Management**:
  - Connect to ws:// and wss:// endpoints
  - Protocol selection
  - Auto-reconnection
  - Connection state tracking
- **Message Handling**:
  - Send JSON/Text/Binary messages
  - Real-time message history
  - Message filtering
  - Timestamp tracking
  - Message size tracking
- **Advanced Features**:
  - Ping/Pong frames
  - Compression support
  - Custom headers
  - SSL/TLS configuration

### 👥 **3. Workspace & Team Collaboration**

#### **3.1 Workspace Management**
- **Create Multiple Workspaces**: Separate projects/teams
- **Role-Based Access**:
  - Owner: Full control
  - Admin: Manage members and settings
  - Member: Access and collaborate
  - Viewer: Read-only access
- **Invite System**:
  - Generate unique invite links
  - Email invitations
  - Expiring tokens
  - Workspace switching

#### **3.2 Real-time Team Chat** 💬
Enterprise-grade communication built into the platform

**Text Messaging**:
- ⚡ Lightning-fast with Server-Sent Events (SSE)
- 📝 Rich text formatting (Markdown support)
- 🔍 Search message history
- 📌 Pin important messages
- 🗑️ Delete for everyone
- ✏️ Edit sent messages

**@Mentions**:
- Type `@` to mention team members
- Autocomplete dropdown with filtering
- Bold highlighting for mentions
- Notification triggers

**File Sharing**:
- 📎 Upload files up to 50MB
- 🖼️ Image previews with fullscreen view
- 📄 PDF, Documents, Videos support
- ⬇️ Download attachments
- 📊 Upload progress tracking

**Voice & Video Calls** 📹:
- 📞 **Audio Calls**: Crystal-clear voice communication
- 🎥 **Video Calls**: HD quality (1280x720) video
- 🖥️ **Screen Sharing**: Share your screen during calls
- 🎚️ **Call Controls**:
  - Mute/Unmute microphone
  - Camera on/off toggle
  - Minimize/Maximize video window
  - Resizable video player
  - Picture-in-picture mode
- 🔔 **Incoming Call UI**: Beautiful animated call screens
- 🌐 **WebRTC**: Peer-to-peer connections (STUN servers)

**Presence & Status**:
- 🟢 Online/Offline indicators
- 👤 User avatars and profiles
- ⌨️ Typing indicators (infrastructure ready)
- 🕐 Last seen timestamps

### 🤖 **4. AI Code Review** (Powered by Gemini 2.0 Flash)

#### **4.1 Empathetic Code Review**
Paste code and get comprehensive AI-powered analysis

**Review Categories**:
- 🎯 **Code Quality**: Best practices, patterns, maintainability
- 🔒 **Security Analysis**: Vulnerabilities, exploits, secure coding
- ⚡ **Performance**: Optimization opportunities, bottlenecks
- 📖 **Readability**: Code clarity, documentation, naming
- 🧪 **Testing**: Coverage suggestions, test cases
- 🐛 **Bug Detection**: Potential issues, edge cases

**Supported Languages**:
- JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby, etc.

**Output Features**:
- Severity levels (Critical, High, Medium, Low)
- Line-by-line feedback
- Code snippets with improvements
- Best practice recommendations
- Markdown formatted results with syntax highlighting

#### **4.2 GitHub Repository Review**
Analyze entire GitHub repositories with AI

**Features**:
- 📦 Clone and analyze public repositories
- 🔍 Deep scan of all source files
- 📊 Comprehensive project assessment
- 🏗️ Architecture review
- 📈 Quality score (0-100)
- 📝 Detailed report generation

**Analysis Includes**:
- Project structure evaluation
- Dependency analysis
- Code quality metrics
- Security vulnerabilities
- Performance bottlenecks
- Documentation completeness
- Testing coverage

#### **4.3 Code Review Projects**
Organize and track code reviews

- 📁 Create review projects
- 🏷️ Tag and categorize reviews
- 📅 Track review history
- 👥 Assign to team members
- 💬 Comment and discuss
- ✅ Mark as resolved

#### **4.4 Review Logs**
Complete audit trail of all AI interactions

- 📜 All review history
- 🕐 Timestamps and duration
- 👤 User attribution
- 🔍 Filter by type, status, user
- 📊 Export logs
- 📈 Analytics on review patterns

### 🎨 **5. Design System** (Powered by tldraw)

Visual API design and collaborative whiteboard

**Canvas Tools**:
- ✏️ **Drawing Tools**: Pen, shapes, arrows, text
- 📐 **Precision**: Grid snapping, alignment
- 🎨 **Styling**: Colors, strokes, fills
- 🖼️ **Assets**: Upload images, icons
- 📋 **Templates**: Pre-built API diagrams

**API Design Features**:
- 🔷 **Endpoint Mapping**: Visual API structure
- 🔄 **Flow Diagrams**: Request/response flows
- 📊 **Data Models**: Entity relationships
- 🗂️ **Documentation**: Inline annotations

**Collaboration**:
- 👥 Real-time multi-user editing
- 🎯 Cursor tracking
- 💬 Comments and feedback
- 📸 Export designs (PNG, SVG, JSON)
- 🔄 Version history

### 📊 **6. Activity Logs & Analytics**

#### **6.1 Activity Logs**
Comprehensive tracking of all workspace actions

**Event Types**:
- 🔌 **API Calls**: All HTTP/WebSocket requests
- 🧪 **Test Runs**: Test execution results
- 📦 **Collection Runs**: Batch test results
- ⚠️ **Errors**: Failed requests, exceptions
- 👥 **User Actions**: Login, logout, access
- 🤖 **AI Interactions**: Code reviews, generations
- 💬 **Chat Activity**: Message posts, edits, deletes
- 📞 **Call Events**: Voice/video call logs

**Log Details**:
- ⏱️ Timestamp (precise to millisecond)
- 👤 User attribution
- 📍 Action type and description
- 📊 Metadata (status codes, duration, size)
- 🎨 Visual timeline view
- 🔍 Advanced filtering
- 📥 Export to CSV/JSON
- 🔔 Real-time updates

**Benefits**:
- 🔍 Debug issues with complete history
- 📈 Track team productivity
- 🔒 Security audit trail
- 📊 Usage analytics
- 🤝 Compliance and reporting

#### **6.2 Analytics Dashboard**
Visual insights into API usage and performance

**Metrics Tracked**:
- 📈 Request volume (by hour/day/week)
- ⏱️ Average response times
- ✅ Success rate vs. error rate
- 🔝 Most used endpoints
- 👥 User activity patterns
- 📊 HTTP method distribution
- 🌍 Geographic distribution
- 💾 Data transfer volume

**Visualizations**:
- 📊 Bar charts, line graphs, pie charts
- 🗺️ Heatmaps for activity patterns
- 📉 Trend analysis
- 🎯 Goal tracking
- 📅 Time-based comparisons

### 🛠️ **7. API Code Editor**

Standalone code editor with AI-powered analysis

**Editor Features**:
- 🎨 **Monaco Editor**: VS Code-like experience
- 🌈 **Syntax Highlighting**: 50+ languages
- 🔍 **Auto-completion**: IntelliSense support
- 📦 **File Operations**: Upload, download, save
- 🎯 **Language Selection**: Auto-detection

**AI Assistant**:
- 💡 Code generation from prompts
- ✨ Code improvement suggestions
- 🔧 Refactoring recommendations
- 📚 Documentation generation
- 🐛 Bug detection

**Analysis Tabs**:
1. **API Route Detection**: Auto-detect endpoints
2. **Operations Dashboard**: Method counts, visualization
3. **Test Generation**: AI-generated test cases
4. **Security Audit**: Vulnerability scanning
5. **Performance Analysis**: Optimization tips
6. **Documentation**: Auto-generated docs

### 📱 **8. User Interface**

**Design Philosophy**:
- 🌙 **Dark Mode Optimized**: Easy on the eyes
- 📱 **Responsive**: Works on all screen sizes
- ⚡ **Fast**: Optimized performance
- 🎨 **Modern**: Clean, professional design
- ♿ **Accessible**: WCAG compliant

**UI Components** (shadcn/ui):
- Buttons, Inputs, Dropdowns
- Modals, Dialogs, Tooltips
- Cards, Badges, Alerts
- Tables, Lists, Grids
- Progress bars, Loaders
- 50+ reusable components

**Animations**:
- Smooth transitions (300ms)
- Loading states
- Hover effects
- Scroll animations
- Micro-interactions

---

## 🛠️ Tech Stack

### **Frontend Framework**
```
Next.js 15.5.3 (App Router + Turbopack)
├── React 18 (Server & Client Components)
├── TypeScript (Type-safe development)
└── Turbopack (Ultra-fast bundler)
```

### **Styling & UI**
```
TailwindCSS 4.0
├── shadcn/ui (50+ components)
├── Radix UI (Headless primitives)
├── Lucide Icons (Beautiful icons)
└── Custom animations
```

### **State Management**
```
Zustand (Lightweight state)
├── useRequestPlaygroundStore
├── useWorkspaceStore
└── useCollectionStore
```

### **Data Fetching & Caching**
```
TanStack Query (React Query)
├── Server state management
├── Automatic caching
├── Optimistic updates
└── Background refetching
```

### **Database & ORM**
```
PostgreSQL (Neon)
└── Prisma 6.16
    ├── Type-safe queries
    ├── Migrations
    └── Schema modeling
```

### **Authentication**
```
Clerk
├── User management
├── Social logins (Google, GitHub)
├── JWT tokens
└── Webhooks
```

### **AI & Machine Learning**
```
Google Gemini AI
├── gemini-2.0-flash-exp
├── Code review & generation
├── Test case generation
└── Documentation generation
```

### **Real-time Communication**
```
WebRTC (Voice/Video)
├── STUN servers
└── Peer-to-peer connections

Server-Sent Events (SSE)
├── Real-time chat
└── Activity logs
```

### **Code Editor**
```
Monaco Editor
├── VS Code engine
├── IntelliSense
└── 50+ language support
```

### **Design Tools**
```
tldraw
├── Collaborative whiteboard
└── API design canvas
```

### **Additional Libraries**
- **react-markdown**: Markdown rendering
- **react-syntax-highlighter**: Code highlighting
- **react-hotkeys-hook**: Keyboard shortcuts
- **sonner**: Toast notifications
- **zod**: Schema validation
- **axios**: HTTP client

---

## 🏗️ Architecture

OpenPulse follows a modern, scalable architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Next.js App (Server & Client Components)          │  │
│  │   ├── React 18 (RSC + Hydration)                    │  │
│  │   ├── TypeScript (Type Safety)                      │  │
│  │   └── TailwindCSS (Styling)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      STATE LAYER                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  Zustand Stores  │  │  React Query     │               │
│  │  (Client State)  │  │  (Server State)  │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Next.js API Routes & Server Actions                │  │
│  │   ├── /api/* (REST endpoints)                        │  │
│  │   ├── Server Actions (form handling)                 │  │
│  │   └── SSE (Real-time events)                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Auth     │  │   AI     │  │  WebRTC  │  │   File   │ │
│  │  (Clerk)  │  │ (Gemini) │  │  (Voice) │  │ Storage  │ │
│  └───────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Prisma ORM                                         │  │
│  │   └── PostgreSQL (Neon)                             │  │
│  │       ├── Users, Workspaces                          │  │
│  │       ├── Collections, Requests                      │  │
│  │       ├── Messages, Files                            │  │
│  │       └── Logs, Analytics                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Key Architectural Decisions**

#### **1. App Router (Next.js 15)**
**Why?**
- ✅ React Server Components for better performance
- ✅ Streaming and Suspense support
- ✅ Built-in SEO optimization
- ✅ Simplified data fetching
- ✅ Nested layouts and loading states

#### **2. Modular Structure**
**Why?**
- ✅ Feature-based organization
- ✅ Easy to maintain and scale
- ✅ Clear separation of concerns
- ✅ Reusable components
- ✅ Independent testing

#### **3. TypeScript**
**Why?**
- ✅ Type safety catches bugs early
- ✅ Better IntelliSense
- ✅ Self-documenting code
- ✅ Easier refactoring
- ✅ Enhanced collaboration

#### **4. Prisma ORM**
**Why?**
- ✅ Type-safe database queries
- ✅ Auto-generated TypeScript types
- ✅ Migration management
- ✅ Easy schema changes
- ✅ Query optimization

#### **5. Real-time with SSE (not WebSockets)**
**Why?**
- ✅ Simpler implementation
- ✅ HTTP-based (easier deployment)
- ✅ Automatic reconnection
- ✅ Better for server → client
- ✅ No need for separate WebSocket server

---

## 📁 Project Structure

```
postman-clone/
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma          # Prisma schema definition
│   └── migrations/            # Database migration history
│
├── public/                    # Static assets
│   └── favicon.ico           # App icon
│
├── src/                       # Source code
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication pages
│   │   │   ├── sign-in/     # Login page
│   │   │   └── sign-up/     # Registration page
│   │   │
│   │   ├── (workspace)/     # Main workspace (protected)
│   │   │   ├── layout.tsx   # Workspace layout with sidebar
│   │   │   ├── page.tsx     # Dashboard/Home page
│   │   │   ├── rest/        # REST API testing page
│   │   │   ├── chat/        # Team chat page
│   │   │   ├── code-editor/ # Standalone code editor
│   │   │   ├── code-review/ # AI code review page
│   │   │   ├── design/      # Visual design system
│   │   │   └── realtime/    # Real-time WebSocket page
│   │   │
│   │   ├── api/             # API routes
│   │   │   ├── ai/          # AI endpoints (Gemini)
│   │   │   ├── webhooks/    # Clerk webhooks
│   │   │   └── ws/          # WebSocket/SSE endpoints
│   │   │
│   │   ├── invite/          # Invite acceptance page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   │
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components (50+)
│   │   ├── query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   ├── notification-bell.tsx
│   │   └── hot-key-provider.tsx
│   │
│   ├── modules/             # Feature modules
│   │   ├── authentication/  # Auth logic
│   │   ├── workspace/       # Workspace management
│   │   │   ├── components/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── workspace-chat.tsx
│   │   │   │   ├── activity-logs-viewer.tsx
│   │   │   │   ├── analytics-dashboard.tsx
│   │   │   │   └── api-code-editor.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-voice-call.ts
│   │   │   │   ├── use-workspace-chat.ts
│   │   │   │   └── use-file-upload.ts
│   │   │   └── actions/
│   │   │       └── chat-actions.ts
│   │   │
│   │   ├── collections/     # API collections
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── actions/
│   │   │
│   │   ├── request/         # REST API client
│   │   │   ├── components/
│   │   │   │   ├── request-playground.tsx
│   │   │   │   ├── request-editor.tsx
│   │   │   │   └── tab-bar.tsx
│   │   │   ├── hooks/
│   │   │   └── store/
│   │   │
│   │   ├── realtime/        # WebSocket client
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── actions/
│   │   │
│   │   ├── ai/              # AI features
│   │   │   ├── components/
│   │   │   │   ├── code-review-enhanced.tsx
│   │   │   │   ├── empathetic-code-review-enhanced.tsx
│   │   │   │   ├── github-repo-review-enhanced.tsx
│   │   │   │   ├── code-review-projects.tsx
│   │   │   │   └── code-review-logs.tsx
│   │   │   └── actions/
│   │   │
│   │   ├── design/          # Design system
│   │   │   └── components/
│   │   │
│   │   ├── invites/         # Invite system
│   │   │   ├── components/
│   │   │   └── actions/
│   │   │
│   │   └── Layout/          # Layout components
│   │       ├── components/
│   │       └── store/
│   │
│   ├── hooks/               # Global custom hooks
│   │   └── use-mobile.ts
│   │
│   ├── lib/                 # Utilities and configs
│   │   ├── db.ts           # Prisma client instance
│   │   ├── auth.ts         # Clerk auth utilities
│   │   ├── gemini-ai.ts    # Gemini AI configuration
│   │   ├── utils.ts        # Helper functions
│   │   └── env.ts          # Environment validation
│   │
│   ├── types/              # TypeScript type definitions
│   │   └── css.d.ts        # CSS module declarations
│   │
│   └── middleware.ts        # Next.js middleware (auth)
│
├── .env                     # Environment variables
├── .env.example            # Example environment file
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # TailwindCSS configuration
├── components.json         # shadcn/ui configuration
├── package.json            # Dependencies
└── README.md              # This file
```

### **Why This Structure?**

#### **1. Feature-Based Modules**
```
src/modules/[feature]/
├── components/  # UI components for this feature
├── hooks/       # Custom hooks
├── actions/     # Server actions
├── store/       # Zustand stores (if needed)
└── types/       # TypeScript types
```

**Benefits**:
- ✅ Clear feature boundaries
- ✅ Easy to find related code
- ✅ Can be extracted as packages
- ✅ Team can work on different features independently
- ✅ Promotes reusability

#### **2. Colocation**
Components, hooks, and actions for a feature live together

**Benefits**:
- ✅ Faster navigation
- ✅ Easier to understand relationships
- ✅ Simpler imports
- ✅ Better discoverability

#### **3. App Router Organization**
```
app/
├── (auth)/        # Route group (no URL segment)
├── (workspace)/   # Protected route group
└── api/          # API endpoints
```

**Benefits**:
- ✅ Logical grouping without affecting URLs
- ✅ Shared layouts per group
- ✅ Easy to apply middleware
- ✅ Clear public vs protected routes

---

## 🚀 Getting Started

### **Prerequisites**

Ensure you have the following installed:

- **Node.js**: 18.17 or later
- **npm/yarn/pnpm**: Latest version
- **PostgreSQL**: 14 or later (or Neon account)
- **Git**: Latest version

### **1. Clone the Repository**

```bash
git clone https://github.com/ShreedharDynamicCraft/OpenPulse.git
cd OpenPulse
```

### **2. Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### **3. Set Up Environment Variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/openpulse"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# AI (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
```

### **4. Set Up Database**

Run Prisma migrations to set up your database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Optional: Seed database
npx prisma db seed
```

### **5. Run Development Server**

```bash
npm run dev
# or with Docker
npm run dev:docker
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **6. Build for Production**

```bash
npm run build
npm start
```

---

## 📚 Detailed Documentation

### **1. REST API Client**

#### **How It Works**

The REST API client allows you to send HTTP requests and inspect responses.

**Location**: `/rest` page or Sidebar → Collections

**Components**:
- `request-playground.tsx`: Main container
- `request-editor.tsx`: Request configuration
- `tab-bar.tsx`: Multiple request tabs

**Features**:

1. **Request Configuration**:
   ```typescript
   {
     method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS",
     url: "https://api.example.com/endpoint",
     headers: [{ key: "Authorization", value: "Bearer token" }],
     parameters: [{ key: "page", value: "1" }],
     body: { /* JSON payload */ }
   }
   ```

2. **Response Handling**:
   - Status code with color coding
   - Response time in milliseconds
   - Response size in bytes/KB/MB
   - Formatted JSON/XML viewer
   - Headers inspection
   - Copy response data

3. **Keyboard Shortcuts**:
   - `Ctrl/Cmd + S`: Save request
   - `Ctrl/Cmd + Enter`: Send request
   - `Ctrl/Cmd + G`: New request tab

**State Management**:
```typescript
// useRequestPlaygroundStore (Zustand)
{
  tabs: Tab[],
  activeTabId: string,
  addTab: () => void,
  removeTab: (id: string) => void,
  updateTab: (id: string, data: Partial<Tab>) => void
}
```

**Persistence**:
- Tabs saved to localStorage
- Request history in database
- Collections in PostgreSQL

---

### **2. WebSocket Client**

#### **How It Works**

Real-time WebSocket connection testing and monitoring.

**Location**: `/realtime` page

**Features**:

1. **Connection**:
   ```typescript
   const ws = new WebSocket("wss://api.example.com/ws");
   
   ws.onopen = () => console.log("Connected");
   ws.onmessage = (event) => console.log(event.data);
   ws.onerror = (error) => console.error(error);
   ws.onclose = () => console.log("Disconnected");
   ```

2. **Message Types**:
   - Text: Plain text messages
   - JSON: Structured data
   - Binary: Files, images

3. **Features**:
   - Connection state tracking
   - Message history with timestamps
   - Ping/Pong monitoring
   - Auto-reconnection
   - Custom protocols

**Database Schema**:
```prisma
model WebSocketMessage {
  id        String   @id @default(cuid())
  direction String   // "SENT" | "RECEIVED"
  payload   String
  type      String
  size      Int
  timestamp DateTime @default(now())
}
```

---

### **3. Team Collaboration**

#### **3.1 Workspace Management**

**How It Works**:

1. **Create Workspace**:
   ```typescript
   await createWorkspace({
     name: "My API Project",
     description: "Testing production APIs"
   });
   ```

2. **Invite Members**:
   ```typescript
   const invite = await createInvite({
     workspaceId: "workspace_id",
     role: "MEMBER",
     expiresIn: 7 // days
   });
   // Share: /invite/[token]
   ```

3. **Role Permissions**:
   ```typescript
   enum Role {
     OWNER,    // Full control
     ADMIN,    // Manage members
     MEMBER,   // Read/write
     VIEWER    // Read-only
   }
   ```

**Database Schema**:
```prisma
model Workspace {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  createdAt   DateTime @default(now())
  
  members     WorkspaceMember[]
  collections Collection[]
  messages    ChatMessage[]
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  workspaceId String
  userId      String
  role        Role
  joinedAt    DateTime @default(now())
}
```

#### **3.2 Real-time Chat**

**Architecture**:

```
Client                      Server
  │                            │
  │── POST /api/chat/send ───→ │
  │                            │
  │                         ┌──┴──┐
  │                         │ SSE │ Broadcast to all
  │                         │Event│ workspace members
  │                         └──┬──┘
  │                            │
  │←─── EventSource data ──────│
  │                            │
  │─── Update UI ──────────────│
```

**Implementation**:

```typescript
// Server (SSE Endpoint)
export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      // Send events
      controller.enqueue(`data: ${JSON.stringify(message)}\n\n`);
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// Client (React Hook)
useEffect(() => {
  const eventSource = new EventSource('/api/chat/stream');
  
  eventSource.onmessage = (event) => {
    const message = JSON.parse(event.data);
    setMessages(prev => [...prev, message]);
  };
  
  return () => eventSource.close();
}, []);
```

**Voice/Video Calls**:

WebRTC implementation with STUN servers:

```typescript
// Initialize peer connection
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
  ]
});

// Get user media
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: { width: 1280, height: 720, facingMode: "user" }
});

// Add tracks
stream.getTracks().forEach(track => pc.addTrack(track, stream));

// Create offer
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

// Send offer via SSE
broadcastSignal("call_signal", { type: "offer", offer });
```

---

### **4. AI Code Review**

#### **How It Works**

Powered by Google Gemini 2.0 Flash for fast, intelligent code analysis.

**Flow**:

```
User Input (Code)
      ↓
Gemini AI API
      ↓
Structured Analysis
      ↓
Markdown + Syntax Highlighting
      ↓
Display Results
```

**Prompt Engineering**:

```typescript
const prompt = `
You are an expert code reviewer. Analyze this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide comprehensive feedback on:
1. Code Quality (best practices, patterns)
2. Security (vulnerabilities, exploits)
3. Performance (bottlenecks, optimizations)
4. Readability (clarity, documentation)
5. Testing (coverage, edge cases)
6. Bugs (potential issues)

Format response in Markdown with:
- Severity levels (🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low)
- Line numbers when applicable
- Code snippets with improvements
- Actionable recommendations
`;
```

**Implementation**:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function reviewCode(code: string, language: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Parse and format
  return {
    analysis: response,
    timestamp: new Date(),
    language,
    linesOfCode: code.split('\n').length
  };
}
```

**Database Logging**:

```prisma
model CodeReviewLog {
  id          String   @id @default(cuid())
  workspaceId String
  userId      String
  language    String
  linesOfCode Int
  analysis    String   @db.Text
  createdAt   DateTime @default(now())
}
```

---

### **5. Design System**

#### **How It Works**

Built on **tldraw** - an infinite canvas for visual collaboration.

**Features**:

1. **Canvas Tools**:
   - Drawing (pen, shapes, arrows)
   - Text annotations
   - Image uploads
   - Grid snapping

2. **API Design**:
   - Create endpoint boxes
   - Draw request/response flows
   - Add data models
   - Annotate with notes

3. **Real-time Collaboration**:
   ```typescript
   // Multiplayer awareness
   const { useEditor } = useTldraw();
   const editor = useEditor();
   
   // Sync cursor positions
   editor.on('change', () => {
     broadcastCursorPosition({
       x: editor.pointer.x,
       y: editor.pointer.y,
       userId: currentUser.id
     });
   });
   ```

4. **Export**:
   - PNG images
   - SVG vectors
   - JSON data
   - PDF documents

**Integration**:

```typescript
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export function DesignCanvas() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        onMount={(editor) => {
          // Load saved design
          editor.loadSnapshot(savedDesign);
        }}
        onChange={(editor) => {
          // Auto-save
          saveDesign(editor.getSnapshot());
        }}
      />
    </div>
  );
}
```

---

### **6. Real-time Features**

#### **6.1 Activity Logs**

**How It Works**:

Every action in the workspace is logged for audit and analytics.

**Event Capture**:

```typescript
// Middleware/wrapper function
async function logActivity(action: ActivityAction) {
  await db.activityLog.create({
    data: {
      workspaceId: action.workspaceId,
      userId: action.userId,
      type: action.type,
      description: action.description,
      metadata: action.metadata,
      timestamp: new Date()
    }
  });
}

// Usage
await logActivity({
  type: "API_CALL",
  description: "GET /users - 200 OK",
  metadata: {
    method: "GET",
    url: "/users",
    status: 200,
    duration: 145,
    size: 2048
  }
});
```

**Database Schema**:

```prisma
model ActivityLog {
  id          String   @id @default(cuid())
  workspaceId String
  userId      String
  type        ActivityType
  description String
  metadata    Json?
  timestamp   DateTime @default(now())
  
  workspace   Workspace @relation(fields: [workspaceId])
  user        User      @relation(fields: [userId])
}

enum ActivityType {
  API_CALL
  TEST_RUN
  COLLECTION_RUN
  ERROR
  USER_ACTION
  AI_INTERACTION
  CHAT_MESSAGE
  CALL_EVENT
}
```

**Viewer Component**:

```typescript
export function ActivityLogsViewer({ workspaceId }: Props) {
  const [filter, setFilter] = useState<ActivityType | "ALL">("ALL");
  const { data: logs } = useQuery({
    queryKey: ['activity-logs', workspaceId, filter],
    queryFn: () => getActivityLogs(workspaceId, filter)
  });
  
  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-4">
        <Select value={filter} onValueChange={setFilter}>
          <option value="ALL">All Activities</option>
          <option value="API_CALL">API Calls</option>
          <option value="TEST_RUN">Test Runs</option>
          {/* More filters */}
        </Select>
      </div>
      
      {/* Timeline */}
      <ScrollArea className="flex-1">
        {logs?.map(log => (
          <LogItem key={log.id} log={log} />
        ))}
      </ScrollArea>
    </div>
  );
}
```

#### **6.2 Analytics Dashboard**

**Metrics Collection**:

```typescript
// Real-time aggregation
const analytics = await db.$queryRaw`
  SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    type,
    COUNT(*) as count,
    AVG(CAST(metadata->>'duration' AS INTEGER)) as avg_duration
  FROM "ActivityLog"
  WHERE workspace_id = ${workspaceId}
    AND timestamp >= NOW() - INTERVAL '7 days'
  GROUP BY hour, type
  ORDER BY hour DESC
`;
```

**Visualization**:

```typescript
import { BarChart, LineChart, PieChart } from "recharts";

export function AnalyticsDashboard({ workspaceId }: Props) {
  const { data: metrics } = useQuery({
    queryKey: ['analytics', workspaceId],
    queryFn: () => getAnalytics(workspaceId)
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Request Volume */}
      <Card>
        <CardHeader>
          <CardTitle>Request Volume (7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart data={metrics.requestVolume} />
        </CardContent>
      </Card>
      
      {/* Success Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={metrics.successRate} />
        </CardContent>
      </Card>
      
      {/* More charts... */}
    </div>
  );
}
```

---

## 📄 Page Structure

### **Public Pages**

| Page | Route | Description |
|------|-------|-------------|
| Sign In | `/sign-in` | User authentication |
| Sign Up | `/sign-up` | User registration |
| Invite | `/invite/[token]` | Accept workspace invite |

### **Protected Pages** (Requires Authentication)

| Page | Route | Description | Key Features |
|------|-------|-------------|--------------|
| **Dashboard** | `/` | Home page with overview | Workspace selector, quick actions |
| **REST Client** | `/rest` | REST API testing | Request builder, collections, response viewer |
| **WebSocket** | `/realtime` | WebSocket testing | Connect, send/receive messages, history |
| **Team Chat** | `/chat` | Standalone chat page | Messages, calls, file sharing |
| **Code Editor** | `/code-editor` | AI-powered code editor | Monaco editor, AI assistant, analysis |
| **Code Review** | `/code-review` | AI code review | Paste code, GitHub repos, projects, logs |
| **Design** | `/design` | Visual API design | tldraw canvas, collaboration |

### **Sidebar Tabs** (Accessible from `/rest`)

| Tab | Icon | Description |
|-----|------|-------------|
| Collections | 📁 | Browse and manage API collections |
| Code | 💻 | API code editor with AI analysis |
| Chat | 💬 | Team communication hub |
| Logs | 📜 | Activity logs viewer |
| Analytics | 📊 | Usage analytics and metrics |

---

## 🗂️ File Structure Explained

### **Key Files & Their Purpose**

#### **1. Database & Schema**

```
prisma/schema.prisma
```
**Purpose**: Single source of truth for database structure

**Why**:
- ✅ Type-safe database queries
- ✅ Auto-generated TypeScript types
- ✅ Version-controlled schema changes
- ✅ Easy migrations

**Key Models**:
- `User`: User accounts (synced with Clerk)
- `Workspace`: Team workspaces
- `Collection`: API request collections
- `Request`: Saved API requests
- `ChatMessage`: Team chat messages
- `ActivityLog`: Audit trail
- `CodeReviewLog`: AI review history

#### **2. Configuration Files**

**`next.config.ts`**: Next.js configuration
```typescript
export default {
  turbopack: true,     // Ultra-fast bundler
  experimental: {
    serverActions: true // Enable server actions
  }
}
```

**`tailwind.config.ts`**: TailwindCSS customization
```typescript
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette
      }
    }
  }
}
```

**`tsconfig.json`**: TypeScript settings
```json
{
  "compilerOptions": {
    "strict": true,           // Strict type checking
    "paths": {
      "@/*": ["./src/*"]     // Path aliases
    }
  }
}
```

#### **3. Core Application Files**

**`src/app/layout.tsx`**: Root layout
- Sets up providers (Clerk, React Query, Theme)
- Global styles and fonts
- Layout persistence

**`src/middleware.ts`**: Request middleware
- Authentication checks
- Route protection
- Redirects

**`src/lib/db.ts`**: Prisma client
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

**`src/lib/gemini-ai.ts`**: AI configuration
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY!
);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp"
});
```

#### **4. Module Structure**

Each feature module follows this pattern:

```
modules/[feature]/
├── components/       # UI components
│   ├── [feature]-main.tsx
│   ├── [feature]-item.tsx
│   └── [feature]-modal.tsx
├── hooks/           # Custom hooks
│   └── use-[feature].ts
├── actions/         # Server actions
│   └── [feature]-actions.ts
├── store/          # Zustand stores
│   └── use-[feature]-store.ts
└── types/          # TypeScript types
    └── [feature].types.ts
```

**Why This Structure?**:
- ✅ All related code in one place
- ✅ Easy to find and navigate
- ✅ Clear dependencies
- ✅ Promotes reusability
- ✅ Simple testing

---

## 🔐 Environment Setup

### **Required Environment Variables**

```env
# ===================================
# DATABASE
# ===================================
DATABASE_URL="postgresql://user:password@localhost:5432/openpulse"
# For local dev: postgres://postgres:postgres@localhost:5432/openpulse
# For Neon: Get from https://neon.tech

# ===================================
# AUTHENTICATION (Clerk)
# ===================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
# Get from: https://dashboard.clerk.com

# ===================================
# URLs
# ===================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# ===================================
# AI (Google Gemini)
# ===================================
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
# Get from: https://makersuite.google.com/app/apikey

# ===================================
# OPTIONAL: File Upload (if using cloud storage)
# ===================================
# AWS_ACCESS_KEY_ID="..."
# AWS_SECRET_ACCESS_KEY="..."
# AWS_REGION="us-east-1"
# AWS_BUCKET_NAME="openpulse-uploads"
```

### **Getting API Keys**

#### **1. PostgreSQL (Neon)**
1. Go to [https://neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Paste as `DATABASE_URL`

#### **2. Clerk Authentication**
1. Go to [https://clerk.com](https://clerk.com)
2. Create account and project
3. Go to API Keys
4. Copy publishable and secret keys
5. Set up webhooks: `https://your-domain.com/api/webhooks/clerk`

#### **3. Google Gemini AI**
1. Go to [https://makersuite.google.com](https://makersuite.google.com)
2. Sign in with Google
3. Go to "Get API Key"
4. Create new key
5. Copy and paste

---

## 🚢 Deployment

### **Deploy to Vercel** (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project:
     - Framework: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables**:
   - Go to Project → Settings → Environment Variables
   - Add all variables from `.env`
   - Important: Update `NEXT_PUBLIC_APP_URL` to your production domain

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

### **Deploy to Other Platforms**

#### **Docker**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t openpulse .
docker run -p 3000:3000 openpulse
```

#### **AWS/Azure/GCP**
Follow Next.js deployment guides:
- [AWS Amplify](https://nextjs.org/docs/deployment#aws-amplify)
- [Azure](https://nextjs.org/docs/deployment#azure)
- [Google Cloud](https://nextjs.org/docs/deployment#google-cloud-run)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Ways to Contribute**

- 🐛 **Report Bugs**: Open an issue with details
- 💡 **Suggest Features**: Share your ideas
- 📝 **Improve Docs**: Fix typos, add examples
- 💻 **Submit Code**: Bug fixes, new features
- 🎨 **Design**: UI/UX improvements
- 🌍 **Translations**: Help us go global

### **Development Workflow**

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/OpenPulse.git
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Commit message format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `test:` Tests
   - `chore:` Maintenance

5. **Push & Create PR**
   ```bash
   git push origin feature/amazing-feature
   ```
   Then open a Pull Request on GitHub

### **Code Standards**

- ✅ Use TypeScript for type safety
- ✅ Follow ESLint rules
- ✅ Write meaningful commit messages
- ✅ Add comments for complex logic
- ✅ Keep components small and focused
- ✅ Use existing UI components
- ✅ Test your changes locally

---

## 🗺️ Roadmap

### **Current Version: v1.0**
- ✅ REST API Client
- ✅ WebSocket Client
- ✅ Team Chat (Text + Voice/Video)
- ✅ AI Code Review
- ✅ Design System
- ✅ Activity Logs
- ✅ Analytics Dashboard

### **v1.1 (Coming Soon)**
- 🔄 GraphQL Support
- 📱 Mobile App (React Native)
- 🔌 API Mocking
- 📊 Advanced Analytics
- 🌍 Internationalization
- 🎨 Custom Themes

### **v1.2 (Planned)**
- 🤖 More AI Features (test generation, documentation)
- 📈 Performance Monitoring
- 🔔 Alert System
- 📅 Scheduled Tests
- 🔄 CI/CD Integration
- 📦 Plugins/Extensions System

### **v2.0 (Future)**
- 🌐 Self-hosted Option
- 🔐 Enterprise Features
- 📊 Custom Dashboards
- 🔄 Multi-workspace Management
- 🤝 External Integrations (Jira, Slack, GitHub)
- 📚 Advanced Documentation Generator

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 OpenPulse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### **Technologies**
- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication
- [Prisma](https://prisma.io/) - Database ORM
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Model
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [tldraw](https://tldraw.com/) - Canvas
- [Vercel](https://vercel.com/) - Hosting

### **Inspiration**
- **Postman** - API testing UX
- **Insomnia** - Clean interface
- **Slack** - Team collaboration
- **GitHub** - Code review
- **Linear** - UI/UX design

### **Special Thanks**
To all contributors and the open-source community! 🙌

---

## 📞 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/ShreedharDynamicCraft/OpenPulse/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ShreedharDynamicCraft/OpenPulse/discussions)
- 📧 **Email**: support@openpulse.dev
- 🐦 **Twitter**: [@OpenPulseAPI](https://twitter.com/OpenPulseAPI)
- 💼 **LinkedIn**: [OpenPulse](https://linkedin.com/company/openpulse)

---

<div align="center">

## ⭐ Star Us on GitHub!

If you find OpenPulse helpful, please consider giving us a star ⭐

**Built with ❤️ by developers, for developers**

[⬆ Back to Top](#-openpulse)

</div>
