# How to Open the VS Code Extension

## 🎯 Super Simple Steps

### 1. Open VS Code with the Project

```bash
cd /Users/alexcat/Developer/localhost-manager-vscode
code .
```

✅ **You should now see the project open in VS Code**

### 2. Press F5

Just press **F5** on your keyboard!

That's it! 🎉

---

## What Happens Next?

A new VS Code window will open called **"Extension Development Host"**

This is where your extension is running!

## Finding Your Extension

### Option 1: Sidebar Panel (Recommended)

1. Look at the **left sidebar** (Activity Bar)
2. Find the **server icon** 🖥️
3. **Click it**
4. You'll see a sidebar with all your ports!

### Option 2: Full Retro Panel

1. Press **Cmd+Shift+P** (or **Ctrl+Shift+P** on Windows/Linux)
2. Type: **Localhost Manager**
3. Select: **"Localhost Manager: Open Panel"**
4. Beautiful Windows 95 UI opens! 🎨

### Option 3: Status Bar

1. Look at the **bottom-right** corner
2. You'll see: **🖥️ X ports**
3. **Click it** to open the full panel

---

## What You'll See

### In the Sidebar:
```
Active Ports: 3

:5001
🐍 Flask Admin
Python • PID: 12345 • 1:23:45 • 89.3 MB • CPU: 0.5%
[🌐 Open] [💀 Kill]

:8000
🐍 Django/HTTP
Python • PID: 12346 • 1:23:50 • 124.7 MB • CPU: 1.2%
[🌐 Open] [💀 Kill]

:18789
🔌 WebSocket
Python • PID: 12347 • 3:12:08 • 67.4 MB • CPU: 0.1%
[🌐 Open] [💀 Kill]
```

### In the Full Panel:
Beautiful retro Windows 95 table with all metadata!

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| **Open Extension** | `F5` |
| **Reload Extension** | `Cmd+Shift+F5` or click 🔄 in debug toolbar |
| **Open Command Palette** | `Cmd+Shift+P` |
| **Stop Debugging** | `Shift+F5` |

---

## Troubleshooting

**❓ I pressed F5 but nothing happened**
- Make sure you're in the **localhost-manager-vscode** project window
- Check the bottom panel - you should see "Debugger attached"

**❓ I don't see the server icon in the sidebar**
- Make sure the **new window** ("Extension Development Host") opened
- Look for that text in the window title

**❓ No ports showing**
- Start some servers first!
- Try: `cd ~/Developer/alex_a_montreal && npm run dev`
- The extension auto-refreshes every 3 seconds

**❓ I want to make changes**
- Edit `src/extension.js`
- Press `Cmd+Shift+F5` to reload
- Changes appear immediately!

---

## 🎨 Enjoy!

You now have a retro Windows 95-styled localhost manager inside VS Code!

Your OpenClaw Gateway will show as:
```
:18789  🔌 WebSocket
```

Press **F5** now and have fun! 🖥️✨
