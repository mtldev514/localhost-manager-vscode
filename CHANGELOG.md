# Change Log

All notable changes to the "Localhost Manager (Retro)" extension will be documented in this file.

## [0.0.1] - 2024-02-12

### Added
- 🎨 **Retro Windows 95 UI** - Classic early 2000s aesthetic
- 🔍 **Smart Port Filtering** - Search by port, type, process, or custom tags
- 🏷️ **Custom Port Tagging** - Name your servers for easy identification
- 📊 **Rich Metadata Display** - View uptime, memory usage, and CPU stats
- 🔌 **Auto-Detection** - Recognizes React, Flask, Python, WebSocket, databases, and more
- 🌐 **Quick Actions** - Open in browser or kill processes with one click
- 📱 **Dual Interface** - Compact sidebar panel + full retro panel
- 🔄 **Auto-Refresh** - Live updates every 2-3 seconds
- ⚡ **Type Filters** - Click chips to filter by server type
- 💾 **Persistent Tags** - Tags saved per workspace across sessions

### Features in Detail

#### Port Management
- View all active localhost ports at a glance
- Automatically detects common frameworks and servers
- Shows process details (PID, user, command)
- One-click process termination

#### Smart Filtering
- Text search across ports, types, processes, and tags
- Click-to-filter type chips (🐍 Python, ⚛️ React, etc.)
- Combined filters for precise results
- Real-time filter status display

#### Custom Tagging
- Add memorable names to your ports
- Tags persist across VS Code sessions
- Searchable through filter system
- Easy to update or remove

#### Rich Metadata
- **Uptime** - How long the server has been running
- **Memory** - RAM usage in MB/GB
- **CPU** - Current CPU percentage
- **Type** - Auto-detected server/framework type
- **Custom Name** - Your personal tag (if set)

#### Supported Auto-Detections
- ⚛️ React/Next.js (ports 3000, 3001)
- 🐍 Python/Flask/Django (ports 5000, 5001, 8000)
- 🔌 WebSocket servers (ports 18000-18999)
- 🐘 PostgreSQL (port 5432)
- 🍃 MongoDB (port 27017)
- 📦 Redis (port 6379)
- 🗄️ MySQL (port 3306)
- 🟢 Node.js
- 🅰️ Angular (port 4200)
- ☕ Java/Tomcat
- 💎 Ruby
- And more!

### Commands
- `Localhost Manager: Open Panel` - Full retro UI
- `Localhost Manager: Refresh Ports` - Manual refresh
- `Localhost Manager: Kill Port` - Quick-pick to kill a port
- `Localhost Manager: Tag/Rename Port` - Add custom names

### Platform Support
- ✅ macOS (primary support)
- ✅ Linux (via lsof)
- ⏳ Windows (coming soon)

---

## Future Plans

### Planned Features
- 🌐 Network traffic statistics
- 📊 Request count monitoring
- 🔔 Port change notifications
- 🎨 Custom color coding
- 📝 Port notes/descriptions
- 🔗 Quick port linking
- 🪟 Windows support (via netstat)
- 🐳 Docker container detection
- 🌍 Environment detection (dev/prod)
- 📈 Historical stats graphs

### Community Feedback Welcome!
Found a bug? Have a feature request? Open an issue on GitHub!

---

**Enjoy managing your localhost servers with style! 🖥️✨**

Made with 💖 by Alex Catus
Part of the Retro Portfolio ecosystem
