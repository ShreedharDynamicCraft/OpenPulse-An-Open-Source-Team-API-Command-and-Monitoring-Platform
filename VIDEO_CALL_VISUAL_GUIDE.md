# 📺 Video Call Visual Guide

## Window States

### 1️⃣ Normal Windowed Mode (Default)
```
┌──────────────────────────────────────────────────┐
│ Sidebar │         Chat Area                      │
│         │                                         │
│         │                                         │
│         │                         ┌──────────┐   │
│         │                         │ Video    │   │
│         │                         │ Call     │   │
│         │                         │ Window   │   │
│         │                         │          │   │
│         │                         │ [Remote] │   │
│         │                         │          │   │
│         │                         │    [You] │   │
│         │                         │ Controls │   │
│         │                         └──────────┘   │
│         │                          ↖ Resize      │
└──────────────────────────────────────────────────┘

Features:
✓ Default size: 400x300px
✓ Position: Bottom-right corner
✓ Resizable: Drag corner handle
✓ Min size: 320x240px
✓ Max size: Screen - 320px (leaves space for sidebar)
✓ Buttons: Minimize, Fullscreen, Controls
```

### 2️⃣ Fullscreen Mode
```
┌──────────────────────────────────────────────────┐
│ 👤 John Doe ⚪                         [Exit] [X]│
│                                                  │
│                                                  │
│                                                  │
│           [Remote Video - Full Screen]           │
│                                                  │
│                                                  │
│                                     ┌────────┐  │
│                                     │ [You]  │  │
│                                     │ Local  │  │
│                                     └────────┘  │
│                                                  │
│          [🎤] [📹] [🖥️] [☎️]                    │
└──────────────────────────────────────────────────┘

Features:
✓ Covers entire viewport (inset-0)
✓ Larger local video (264x192px)
✓ Participant name at top
✓ Bigger control buttons
✓ Exit button to return
✓ Immersive experience
```

### 3️⃣ Minimized Mode
```
┌──────────────────────────────────────────────────┐
│ Sidebar │         Chat Area                      │
│         │                                         │
│         │                                         │
│         │                                         │
│         │                                         │
│         │                                         │
│         │                                         │
│         │                                         │
│         │                                         │
│         │                                         │
│         │                 ┌──────────────────┐   │
│         │                 │ 📹 Video Call    │   │
│         │                 │ with John ⚪     │   │
│         │                 └──────────────────┘   │
└──────────────────────────────────────────────────┘

Features:
✓ Compact button bar
✓ Shows participant name
✓ Live indicator (pulsing dot)
✓ Call continues in background
✓ Click to restore window
✓ Minimal UI footprint
```

---

## UI Components Breakdown

### Video Window Structure
```
┌─────────────────────────────────────┐
│ Header (Gradient Overlay)           │ ← Status, Name, Badges
│  👤 John Doe ⚪ [Screen Sharing]    │
├─────────────────────────────────────┤
│                                     │
│                                     │
│      Remote Video (Main)            │ ← Full window
│      [Waiting for video...]         │   object-contain
│                                     │
│                                     │
│                    ┌──────────┐    │
│                    │  [You]   │    │ ← Local video (PiP)
│                    │  Local   │    │   Mirrored
│                    └──────────┘    │   object-cover
├─────────────────────────────────────┤
│ Controls (Gradient Overlay)         │ ← Buttons
│  [🎤] [📹] [🖥️] [☎️]                │
└─────────────────────────────────────┘
         ↖ Resize handle
```

### Control Buttons

#### Normal Mode (Small)
```
┌─────────────────────────────────────────┐
│ [🎤]  [📹]  [🖥️]  [☎️]                  │
│ Mute  Cam  Share  End                   │
│ (40px circular buttons)                 │
└─────────────────────────────────────────┘
```

#### Fullscreen Mode (Large)
```
┌─────────────────────────────────────────┐
│  [🎤]   [📹]   [🖥️]   [☎️]              │
│  Mute   Cam   Share   End               │
│  (48px circular buttons)                │
└─────────────────────────────────────────┘
```

---

## Resize Behavior

### Drag Resize (Windowed Mode Only)
```
┌────────────────────────┐
│ Video Window           │
│                        │
│                        │
│                     ◢  │ ← Drag this corner
└────────────────────────┘

Constraints:
• Min Width: 320px
• Min Height: 240px
• Max Width: window.innerWidth - 320px
• Max Height: window.innerHeight - 100px

Real-time Updates:
1. Mouse down on handle
2. Track mouse movement
3. Calculate delta
4. Apply size constraints
5. Update state
6. Smooth render
```

---

## State Transitions

### From Normal → Fullscreen
```
Normal (400x300)
    ↓
[Click Maximize Button]
    ↓
Transition (300ms)
    ↓
Fullscreen (100vw × 100vh)

Animation: All properties smoothly transition
z-index: 40 → 50
```

### From Normal → Minimized
```
Normal (Visible)
    ↓
[Click Minimize Button]
    ↓
Window Hidden
    ↓
Compact Bar Shown (Bottom-right)

Call continues in background
Audio/Video still active
```

### From Minimized → Restored
```
Compact Bar
    ↓
[Click Bar]
    ↓
Window Appears (300ms transition)
    ↓
Back to Normal Mode (Previous size preserved)
```

---

## Color Scheme

### Background Layers
```
Remote Video Area: bg-black/95 + backdrop-blur-sm
Header Gradient: from-black/80 to-transparent
Footer Gradient: from-black/80 to-transparent
Local Video Border: border-white/20
```

### Status Indicators
```
Connected: ⚪ Green (#10B981) - Pulsing
Screen Sharing: 🔵 Blue (#3B82F6)
Muted: 🔴 Red (#EF4444)
Video Off: ⚫ Gray (#6B7280)
```

### Button States
```
Default: bg-white/90 (Secondary)
Active: bg-blue-600 (Primary)
Destructive: bg-red-600 (End call, Mute)
Hover: Brightness +10%
```

---

## Responsive Breakpoints

### Desktop (>1024px) - Full Features
```
Default Size: 400x300
Max Size: Screen - 320px
All features enabled
Resize handle visible
```

### Tablet (768-1024px) - Optimized
```
Default Size: 360x270
Max Size: Screen - 280px
Touch-friendly buttons
Simplified resize
```

### Mobile (<768px) - Simplified
```
Recommended: Fullscreen mode only
Touch controls
Larger buttons (56px)
No manual resize
```

---

## Animation Timeline

### Call Start (0-3s)
```
0.0s: getUserMedia request
0.5s: Camera permission granted
0.8s: Local video appears
1.0s: Video window renders
1.5s: WebRTC connecting
2.5s: Remote video appears
3.0s: "Connected" toast
```

### Window Resize (Real-time)
```
Mouse Down → Track Movement → Update Size
               ↓
         Constrain Values
               ↓
        Update State (React)
               ↓
          Smooth Render
```

### Mode Switch (300ms)
```
0ms: Click button
50ms: State update
100ms: CSS transition starts
300ms: Transition complete
350ms: New state rendered
```

---

## Z-Index Layers

```
Layer 50: Fullscreen Video (Covers everything)
Layer 40: Normal Video Window
Layer 30: Call Banner (Top bar)
Layer 20: Chat UI
Layer 10: Sidebar
Layer 0: Background
```

---

## Video Element IDs

```typescript
#remote-video   → Main video (remote user)
#local-video    → PiP video (your camera)
#remote-audio   → Audio-only element

All have:
- autoPlay
- playsInline
- Error handling
```

---

## Console Log Flow

### Successful Call
```
1. "Local stream obtained: {audio: 1, video: 1}"
2. "Local video element initialized successfully"
3. "WebRTC Connection state: connecting"
4. "ICE Connection state: checking"
5. "Received remote track: video"
6. "Remote video stream set successfully"
7. "WebRTC Connection state: connected"
8. ✅ Call active!
```

### Error States
```
❌ "Local video element not found!"
❌ "Error playing local video: [error]"
❌ "Error adding ICE candidate: [error]"
❌ "Failed to start call: [error]"
```

---

## Performance Optimization

### Video Rendering
```
Remote Video:
- object-fit: contain (maintains aspect ratio)
- Hardware accelerated
- 60fps target

Local Video:
- object-fit: cover (fills container)
- CSS transform: scaleX(-1) (mirror)
- Smaller size = Less GPU load
```

### State Management
```
useCallback: Memoized handlers
useRef: Media streams (no re-renders)
setTimeout: Ensure DOM ready
Debounced Resize: Smooth performance
```

---

## Accessibility

### Keyboard Support
```
Tab: Navigate controls
Enter/Space: Activate buttons
Esc: Exit fullscreen
```

### Screen Reader
```
All buttons have aria-labels
Status indicators announced
Call state changes narrated
```

### Visual
```
High contrast buttons
Clear icon representation
Large touch targets (44px+)
Color + icon indicators
```

---

## Browser Compatibility Matrix

```
Feature            Chrome  Firefox  Safari  Edge
─────────────────────────────────────────────────
getUserMedia       ✅      ✅       ✅      ✅
RTCPeerConnection  ✅      ✅       ✅      ✅
getDisplayMedia    ✅      ✅       ✅      ✅
Resize Observer    ✅      ✅       ✅      ✅
CSS Backdrop Blur  ✅      ✅       ✅      ✅
```

---

**This is a complete visual reference for the video call system!**
