# 🎯 Features Guide

## ✨ New Features

### 🔍 Port Filtering

**Search by anything:**
- Port number (e.g., "8000")
- Server type (e.g., "Flask", "React")
- Process name (e.g., "python", "node")
- Custom tags (e.g., "My Portfolio")

**Type Chips:**
Click on type chips to filter by server type:
- `🐍 Python (3)` - Show only Python servers
- `⚛️ React/Next.js (2)` - Show only React apps
- Click again to clear filter

**Combined Filters:**
- Type text in search box
- Click a type chip
- Both work together!

### 🏷️ Custom Tags/Names

**Tag your ports for easy identification!**

**How to add a tag:**
1. Open Command Palette (`Cmd+Shift+P`)
2. Type "Localhost Manager: Tag/Rename Port"
3. Select a port
4. Enter your custom name (e.g., "My Portfolio", "API Server")

**Examples:**
```
:5001  🏷️ My Portfolio Admin
:8000  🏷️ Main Website
:18789 🏷️ WebSocket Gateway
:3000  🏷️ React Dev Server
```

**Tags persist across sessions!**
- Tags are saved per workspace
- Survive server restarts
- Easy to update or remove

**Remove a tag:**
- Run "Tag/Rename Port" again
- Leave the input empty
- Press Enter

### 📊 Rich Metadata

Every port shows:
- **Type** - Auto-detected framework/server
- **Uptime** - How long it's been running
- **Memory** - RAM usage
- **CPU** - CPU percentage
- **Custom Name** - Your personal tag (if set)

### 🎨 Two Beautiful UIs

**1. Sidebar Panel (Compact)**
- Quick access from Activity Bar
- Shows all essential info
- Perfect for quick checks
- Auto-refreshes every 3 seconds

**2. Full Retro Panel (Detailed)**
- Windows 95 aesthetic 🖥️
- Complete table with all metadata
- Filter controls
- Tag management
- Auto-refreshes every 2 seconds

## 🚀 Quick Actions

### Via Command Palette (`Cmd+Shift+P`)

```
Localhost Manager: Open Panel          → Full retro UI
Localhost Manager: Refresh Ports       → Manual refresh
Localhost Manager: Kill Port           → Kill with quick-pick
Localhost Manager: Tag/Rename Port     → Add custom names
```

### Via UI Buttons

```
🌐 Open     → Opens http://localhost:PORT in browser
💀 Kill     → Terminates process on that port
🔄 Refresh  → Manual refresh
🗑️ Clear    → Clear all filters (retro panel only)
```

## 💡 Pro Tips

### Filter Like a Pro
```
Search: "python"       → All Python servers
Search: "5"            → Ports with 5 (5000, 5001, 5432)
Search: "portfolio"    → Finds your tagged "My Portfolio"
Chip: 🐍 Python       → Only Python servers
Chip + Search         → Combined filtering!
```

### Organize Your Workspace
```
Tag development servers:
:3000  → "Frontend Dev"
:8000  → "Backend API"
:5432  → "Dev Database"

Tag production monitors:
:9000  → "Prod Monitor"
:3306  → "Prod DB (Read-Only)"
```

### Quick Workflow
1. Press `Cmd+Shift+P`
2. Type "tag"
3. Select port
4. Name it
5. Done! ✨

Now when you search, your custom names appear!

## 🎯 Use Cases

### Multi-Project Developer
```
🏷️ Client A - Frontend    :3000
🏷️ Client A - Backend     :8000
🏷️ Client B - API         :5000
🏷️ Personal Blog          :4000
```

### Full-Stack Team
```
🏷️ React App              :3000
🏷️ Express API            :5001
🏷️ WebSocket Server       :8080
🏷️ PostgreSQL             :5432
🏷️ Redis Cache            :6379
```

### Microservices
```
🏷️ Auth Service           :3001
🏷️ User Service           :3002
🏷️ Payment Service        :3003
🏷️ Notification Service   :3004
🏷️ Gateway                :8000
```

## 🔧 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Extension | `fn + F5` |
| Command Palette | `Cmd+Shift+P` |
| Reload Extension | `Cmd+Shift+F5` |

## 📈 Coming Soon

- 🌐 Network traffic stats
- 📊 Request count per port
- 🔔 Port change notifications
- 🎨 Custom color coding
- 📝 Port notes/descriptions
- 🔗 Quick port linking

Enjoy! 🎉
