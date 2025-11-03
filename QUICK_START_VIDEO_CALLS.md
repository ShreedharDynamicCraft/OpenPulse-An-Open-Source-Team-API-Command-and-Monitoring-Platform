# 🎥 Quick Start Guide - Video Calling

## How to Make a Call

### Step 1: Open the Call Menu
```
Click the "Call" button in the chat header
```

### Step 2: Choose Your Call Type
You'll see each team member with two options:
```
👤 John Doe
   📞 Audio Call    ← Voice only
   📹 Video Call    ← Video + voice
```

### Step 3: Wait for Connection
- Toast notification shows: "📹 Calling John Doe..."
- Call banner appears with "Connecting..." status

---

## Receiving a Call

### Incoming Call Screen
```
┌─────────────────────────────────┐
│                                 │
│       [Animated Avatar]         │
│                                 │
│   📹 Incoming Video Call        │
│                                 │
│        John Doe                 │
│   wants to video call you       │
│                                 │
│  [Decline]      [Answer]        │
│                                 │
└─────────────────────────────────┘
```

**What happens:**
- ✅ Screen appears with caller info
- 🔔 Ringtone plays automatically
- 📬 Browser notification sent
- 🌊 Pulsing animation shows active call

---

## During an Audio Call

### Control Panel
```
┌──────────────────────────────────────────────┐
│ 🟢 Call in progress   👤 John Doe           │
│                                              │
│  [🎤 Mute]  [❌ End Call]                    │
└──────────────────────────────────────────────┘
```

**Available Actions:**
- 🎤 **Mute/Unmute** - Toggle your microphone
- ❌ **End Call** - Hang up the call

---

## During a Video Call

### Minimized Mode (Default)
```
Chat Interface:
┌─────────────────────────────────────┐
│ 🟢 Call in progress  👤 John       │
│ [🎤Mute] [📹Video] [🖥️Share] [End] │
└─────────────────────────────────────┘

Video Window (Bottom Right):
┌──────────┐
│  Remote  │  ← Main video (John's camera)
│  Video   │
│  [local] │  ← Your video (small)
└──────────┘
```

### Expanded Mode (Full Screen)
```
Full Screen:
┌─────────────────────────────────────┐
│ 🟢 John Doe                         │  ← Info overlay
│                                     │
│                                     │
│       Remote Video                  │  ← John's video
│       (Full Screen)                 │
│                                     │
│                          ┌────────┐ │
│                          │ Local  │ │  ← Your video (PiP)
│                          │ Video  │ │
│                          └────────┘ │
└─────────────────────────────────────┘

Controls at top in green banner
```

---

## Screen Sharing

### How to Share Your Screen

1. **Click "Share Screen"** button during video call
2. **Browser prompts** you to choose:
   - 🖥️ Entire screen
   - 🪟 Application window
   - 🌐 Browser tab
3. **Click "Share"**
4. **Blue indicator** shows "Sharing Screen"

### What Others See
```
Your screen replaces your camera video
John sees your entire screen/window
```

### To Stop Sharing
- **Option 1**: Click "Stop Sharing" button
- **Option 2**: Click browser's "Stop sharing" notification

---

## Control Buttons Explained

### 🎤 Mute/Unmute
- **Green**: Mic is ON
- **Red**: Mic is MUTED
- Click to toggle

### 📹 Camera On/Off (Video calls only)
- **Green**: Camera is ON
- **Red**: Camera is OFF
- Your video shows/hides

### 🖥️ Share Screen (Video calls only)
- **White**: Not sharing
- **Blue**: Currently sharing
- Click to start/stop

### ⛶ Expand/Minimize (Video calls only)
- **Maximize**: Go full-screen
- **Minimize**: Back to floating window

### ❌ End Call
- **Always Red**
- Ends call immediately
- Cleans up all streams

---

## Status Indicators

### Toast Notifications (Bottom Right)
```
✅ Call connected successfully!
🔇 Microphone muted
🎤 Microphone unmuted
📹 Camera enabled
📷 Camera disabled
🖥️ Screen sharing started
🖥️ Screen sharing stopped
📞 Call ended
❌ Failed to... [error message]
```

### Browser Notifications
```
When chat not visible:
┌─────────────────────────────┐
│ Incoming Call               │
│ John Doe is calling...      │
└─────────────────────────────┘
```

---

## Visual States

### 1. No Call
```
Header: [📞 Call ▼]
```

### 2. Outgoing Call
```
Header: [🔄 Calling...]
Toast: "📹 Calling John..."
```

### 3. Incoming Call
```
Full-screen modal with:
- Animated avatar
- Caller name
- Call type
- Accept/Decline buttons
- Ringtone playing
```

### 4. Active Audio Call
```
Green banner:
┌─────────────────────────────────┐
│ 🟢 Call in progress │ 👤 John │
│ [🎤 Mute] [❌ End Call]         │
└─────────────────────────────────┘
```

### 5. Active Video Call (Minimized)
```
Green banner: Same as audio
+
Floating video: Bottom right corner
```

### 6. Active Video Call (Expanded)
```
Full-screen video overlay
Remote video fills screen
Local video in corner (PiP)
Green controls at top
```

---

## Troubleshooting

### "Failed to start call"
**Solution**: Grant camera/microphone permissions
1. Click 🔒 in address bar
2. Allow Camera & Microphone
3. Refresh page
4. Try again

### "No video showing"
**Solutions**:
- Check camera is not used by another app
- Restart browser
- Check camera privacy settings
- Try toggling video off/on

### "Screen share not working"
**Solutions**:
- Grant screen recording permission (Mac)
- Select correct window/screen
- Close other apps using screen capture
- Try again with different selection

### "Call keeps disconnecting"
**Solutions**:
- Check internet connection
- Try audio-only call
- Restart router
- Move closer to WiFi
- Close bandwidth-heavy apps

---

## Keyboard Shortcuts (Coming Soon)

Planned shortcuts:
- `M` - Mute/Unmute
- `V` - Video On/Off
- `S` - Start/Stop Screen Share
- `F` - Full Screen
- `Esc` - Minimize video
- `Space` - Accept incoming call
- `Backspace` - Decline/End call

---

## Tips for Best Experience

### Before Calling
- ✅ Test your camera/mic in browser settings
- ✅ Close unnecessary apps
- ✅ Ensure good internet connection
- ✅ Use headphones to avoid echo
- ✅ Choose quiet environment

### During Call
- 🎤 Mute when not speaking (group calls)
- 📹 Check your video preview before enabling
- 🖥️ Close sensitive windows before screen sharing
- 💡 Ensure good lighting for video
- 📶 Monitor your connection quality

### Video Quality
- Better internet = better video
- Close other tabs/apps
- Use wired connection if possible
- Reduce video resolution if lagging

---

## Privacy & Security

### Permissions Required
- 🎤 **Microphone**: For audio
- 📹 **Camera**: For video calls
- 🖥️ **Screen Recording**: For screen sharing

### Data Transmission
- ✅ Peer-to-peer connection (WebRTC)
- ✅ End-to-end encryption
- ✅ No server recording
- ✅ Temporary session only

### What Others Can See
- **Audio Call**: Nothing visual
- **Video Call**: Your camera feed
- **Screen Share**: Your selected screen/window
- **Never**: Other tabs/windows (unless shared)

---

## Browser Compatibility

### ✅ Fully Supported
- Chrome 87+
- Edge 87+
- Firefox 85+
- Safari 14.1+
- Opera 73+

### ⚠️ Limited Support
- Mobile browsers (some features may not work)
- Older browser versions

### ❌ Not Supported
- Internet Explorer
- Very old browser versions

---

**Enjoy your video calls! 🎉**
