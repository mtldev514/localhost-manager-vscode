# Localhost Manager VS Code Extension 🖥️

Beautiful retro Windows 95 UI for managing localhost servers inside VS Code!

## ⚡ Quick Start

```bash
cd /Users/alexcat/Developer/localhost-manager-vscode
code .
# Press F5
```

That's it! 🎉

## ✨ Features

- 🎨 **Retro Windows 95 UI** - Classic early 2000s aesthetic
- 📊 **Rich Metadata** - Type, uptime, memory, CPU usage
- 🔍 **Auto-detection** - Recognizes React, Flask, WebSocket, databases
- 🌐 **Quick Open** - Click to open any localhost URL
- 💀 **Easy Kill** - Terminate processes with one click
- 🔄 **Auto-refresh** - Updates every 2-3 seconds

## 🎯 What You Get

Your extension shows:

| Icon | Type | What It Detects |
|------|------|-----------------|
| ⚛️ | React/Next.js | Port 3000, 3001 |
| 🐍 | Python/Flask | Port 5000, 5001, 8000 |
| 🔌 | WebSocket | Port 18000-18999 |
| 🐘 | PostgreSQL | Port 5432 |
| 🍃 | MongoDB | Port 27017 |
| 📦 | Redis | Port 6379 |

Plus: Node.js 🟢, Angular 🅰️, Java ☕, Ruby 💎, and more!

## 📸 Example

```
:5001  🐍 Flask Admin
       Python • PID: 12345 • 1:23:45 • 89.3 MB • 0.5% CPU
       [🌐 Open] [💀 Kill]

:18789 🔌 WebSocket (Your OpenClaw Gateway!)
       Python • PID: 12347 • 3:12:08 • 67.4 MB • 0.1% CPU
       [🌐 Open] [💀 Kill]
```

## 🚀 How to Use

### 1. Press F5 to Launch
Opens "Extension Development Host" window

### 2. Click Server Icon
In the Activity Bar (left sidebar)

### 3. Or Use Command Palette
`Cmd+Shift+P` → "Localhost Manager: Open Panel"

## 📝 Commands

- **Localhost Manager: Open Panel** - Full retro UI
- **Localhost Manager: Refresh Ports** - Manual refresh
- **Localhost Manager: Kill Port** - Quick-pick to kill

## 🎨 Customization

Edit `src/extension.js` and press `Cmd+Shift+F5` to reload!

## 📦 Install Permanently

```bash
npm install -g @vscode/vsce
vsce package
# Then: Extensions > ... > "Install from VSIX..."
```

## 🌟 Made with Love

Part of the Retro Portfolio ecosystem by [@mtldev514](https://github.com/mtldev514)

Early 2000s vibes for multi-passionate creators! 💖

---

**Ready?** Press **F5** and enjoy! 🖥️✨
