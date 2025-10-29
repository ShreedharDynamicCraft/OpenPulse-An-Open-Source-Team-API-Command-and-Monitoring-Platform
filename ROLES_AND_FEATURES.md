# 🎭 Roles, Permissions & Collaboration Features

## 📊 Role Hierarchy & Permissions

### **VIEWER** 👁️
The most basic access level for workspace members.

**Can Do:**
- ✅ View all collections and requests
- ✅ View workspace settings
- ✅ View other members
- ✅ Read chat messages
- ✅ Send chat messages
- ✅ View activity logs
- ✅ **Request role upgrade to EDITOR**

**Cannot Do:**
- ❌ Create/Edit/Delete collections
- ❌ Create/Edit/Delete requests
- ❌ Invite new members
- ❌ Change member roles
- ❌ Remove members
- ❌ Modify workspace settings

---

### **EDITOR** ✏️
Full access to workspace content, can invite collaborators.

**Can Do:**
- ✅ Everything a VIEWER can do
- ✅ Create/Edit/Delete collections
- ✅ Create/Edit/Delete requests
- ✅ Modify workspace environments
- ✅ Execute API requests
- ✅ Save request history
- ✅ **Invite new members**

**Cannot Do:**
- ❌ Change member roles
- ❌ Remove members
- ❌ Approve role requests
- ❌ Modify workspace settings
- ❌ Delete workspace

---

### **ADMIN** 👑
Full administrative control over the workspace.

**Can Do:**
- ✅ Everything an EDITOR can do
- ✅ Invite new members
- ✅ Change any member's role (except owner)
- ✅ Remove members
- ✅ **Approve/Reject role upgrade requests**
- ✅ Modify workspace settings
- ✅ View all pending role requests
- ✅ Receive notifications for role requests

**Cannot Do:**
- ❌ Delete workspace (only owner can)
- ❌ Remove workspace owner
- ❌ Change owner's role

---

### **OWNER** 🏆
The workspace creator with ultimate control.

**Can Do:**
- ✅ Everything an ADMIN can do
- ✅ Delete workspace
- ✅ Transfer ownership (if implemented)
- ✅ Cannot be removed from workspace

---

## 🔔 Role Upgrade Request System

### **How it Works:**

1. **Viewer Requests Upgrade:**
   - Viewer clicks "Request Editor Access" button
   - Fills out optional message explaining why they need access
   - Request is sent to all workspace Admins

2. **Admin Reviews Request:**
   - Admins receive **real-time notification** (via WebSocket)
   - Notification appears in notification bell icon
   - Admin can see requester's name, current role, requested role, and message
   - Admin clicks to view pending requests

3. **Admin Approves/Rejects:**
   - Admin can approve → User becomes EDITOR immediately
   - Admin can reject → User stays as VIEWER, receives notification
   - Decision is logged in activity feed

4. **Requester Gets Notified:**
   - Real-time notification when request is approved/rejected
   - Email notification (optional, if implemented)
   - Can see request status in their profile

---

## 💬 Real-Time Chat/Messaging

### **Features:**
- **Workspace Chat:** Each workspace has a dedicated chat channel
- **Real-Time Updates:** Messages appear instantly using WebSocket
- **Member Presence:** See who's online
- **Message History:** All messages are saved
- **Threaded Replies:** Reply to specific messages (optional)
- **@Mentions:** Mention other members (creates notification)
- **Typing Indicators:** See when someone is typing

### **Use Cases:**
- Discuss API issues
- Coordinate on testing
- Quick questions about requests
- Team collaboration

---

## 🔔 Real-Time Notifications

### **WebSocket Usage:**

WebSocket provides **instant updates** without page refresh:

1. **Role Requests:**
   - Admin gets instant notification when Viewer requests upgrade
   - Requester gets instant notification when request approved/rejected

2. **Member Activity:**
   - "John joined the workspace"
   - "Sarah left the workspace"
   - "Mike was promoted to Editor"

3. **Chat Messages:**
   - New messages appear in real-time
   - @Mentions trigger notification

4. **Content Changes:**
   - "Collection 'API Tests' was created"
   - "Request 'Login' was updated by Alice"

### **Notification Types:**
- 🔵 **ROLE_REQUEST** - New role upgrade request (Admins only)
- 🟢 **ROLE_CHANGE** - Your role was changed
- 👥 **MEMBER_JOINED** - New member joined
- 🔴 **MEMBER_REMOVED** - Member was removed
- 💬 **MENTION** - Someone @mentioned you
- ⚙️ **SYSTEM** - System notifications

---

## 📊 Activity Logging

All workspace actions are logged:

- **Member Actions:** Joins, leaves, role changes
- **Content Changes:** Collections/requests created/edited/deleted
- **Role Requests:** Requested, approved, rejected
- **Messages:** Chat activity

**Activity Feed Shows:**
- Who performed the action
- What they did
- When it happened
- Relevant metadata

---

## 🚀 WebSocket Implementation

### **What is WebSocket?**
WebSocket is a **real-time, bidirectional** communication protocol. Unlike HTTP (request → response), WebSocket keeps a persistent connection open, allowing the server to push updates to clients instantly.

### **Why WebSocket for This App?**

1. **Real-Time Collaboration:**
   - Multiple users working in same workspace
   - See changes as they happen
   - No need to refresh page

2. **Instant Notifications:**
   - Role requests appear immediately
   - Chat messages delivered in real-time
   - Member presence updates

3. **Better UX:**
   - No polling (repeatedly asking server for updates)
   - Lower server load
   - Faster user experience

### **How We Use WebSocket:**

```
Client (Browser)                    Server
     |                                 |
     |--- Connect to WebSocket ------->|
     |<-- Connection Established ------|
     |                                 |
     |<-- New message pushed ----------|
     |<-- Role request notification ---|
     |<-- Member joined event ---------|
     |                                 |
     |--- Send chat message ---------->|
     |--- Request role upgrade ------->|
```

### **WebSocket Events:**

- `workspace:join` - User joins workspace channel
- `workspace:leave` - User leaves workspace
- `message:new` - New chat message
- `role:request` - Role upgrade requested
- `role:updated` - Role was changed
- `member:joined` - New member
- `notification:new` - New notification
- `activity:new` - New activity log entry

---

## 🎯 Complete Feature List

### ✅ **Implemented:**
1. Role-based access control (ADMIN/EDITOR/VIEWER)
2. Member management (invite, remove, change role)
3. Workspace invites with expiration
4. Role badges in UI

### 🚧 **Now Adding:**
1. **Role Upgrade Request System**
   - Viewers can request Editor access
   - Admins approve/reject requests
   - Real-time notifications

2. **Real-Time Chat/Messaging**
   - Workspace chat channel
   - Message history
   - Real-time delivery via WebSocket

3. **Activity Logging**
   - Track all workspace actions
   - View activity feed
   - Filter by type/user

4. **Real-Time Notifications**
   - Notification bell with counter
   - Notification panel
   - Mark as read/unread
   - Real-time delivery via WebSocket

5. **WebSocket Integration**
   - Real-time events
   - Member presence
   - Instant updates

---

## 🔧 Technical Implementation

### **Database Schema:**
- `RoleUpgradeRequest` - Role upgrade requests
- `WorkspaceActivity` - Activity logs
- `WorkspaceMessage` - Chat messages
- `Notification` - User notifications

### **API Routes:**
- `/api/workspace/[id]/role-requests` - Manage role requests
- `/api/workspace/[id]/messages` - Chat messages
- `/api/workspace/[id]/activity` - Activity logs
- `/api/notifications` - User notifications
- `/api/ws` - WebSocket connection

### **Components:**
- `RoleUpgradeButton` - Request role upgrade
- `RoleRequestsDialog` - Admin view pending requests
- `WorkspaceChat` - Chat interface
- `ActivityFeed` - Activity log viewer
- `NotificationBell` - Notification center
- `WebSocketProvider` - WebSocket context

---

## 📝 Usage Examples

### **Viewer Requesting Editor Access:**
1. Click your role badge in header
2. See "Request Editor Access" button
3. Click and fill optional message
4. Wait for admin approval
5. Get notification when approved

### **Admin Approving Request:**
1. See notification badge (red dot)
2. Click notification bell
3. See "John wants Editor access"
4. Click to review request
5. Approve or reject with reason
6. John gets instant notification

### **Using Chat:**
1. Click "Chat" tab in sidebar
2. See all workspace messages
3. Type message and press Enter
4. Message appears for all members instantly
5. Use @username to mention someone

---

## 🎨 UI/UX Features

- **Visual Role Badges:** Color-coded role indicators
- **Permission Tooltips:** Hover to see what you can/can't do
- **Request Counter:** Badge showing pending requests for admins
- **Notification Dots:** Red dot for unread notifications
- **Online Indicators:** Green dot for online members
- **Real-Time Updates:** No page refresh needed
- **Toast Notifications:** Instant feedback for actions

---

This system provides a complete, enterprise-grade collaboration platform! 🚀
