# Quick Start Guide

## 🚀 How to Test the Extension

### Step 1: Open the Project in VS Code

The project is already open! You should see:
- `src/extension.js` - Main extension code
- `package.json` - Extension manifest
- `.vscode/launch.json` - Debug configuration

### Step 2: Press F5

1. **Press F5** on your keyboard
   - OR click the green play button in the Debug panel
   - OR go to Run > Start Debugging

2. **A new VS Code window will open** called "Extension Development Host"
   - This is where your extension is running!

### Step 3: Find the Extension

In the Extension Development Host window, you'll see:

1. **Server Icon in Activity Bar** (left sidebar)
   - Click it to see the sidebar panel with all your ports

2. **Status Bar** (bottom right)
   - Shows "🖥️ X ports"
   - Click it to open the full retro panel

3. **Command Palette** (`Cmd+Shift+P`)
   - Type "Localhost Manager"
   - You'll see 3 commands:
     - `Localhost Manager: Open Panel` ← Opens full retro UI
     - `Localhost Manager: Refresh Ports`
     - `Localhost Manager: Kill Port`

## 🎨 What You'll See

### Sidebar Panel (Click server icon)
- Compact list of all ports
- Shows: Port, Type, Process, Status
- Buttons: Open, Kill
- Auto-refreshes every 3 seconds

### Full Retro Panel (Cmd+Shift+P → "Open Panel")
- Beautiful Windows 95 UI
- Complete table with all metadata:
  - Port number
  - Type/Icon (🐍 🔌 ⚛️)
  - Process details
  - Health status
  - Uptime
  - Memory usage
  - CPU usage
- Auto-refreshes every 2 seconds

## 🔧 Making Changes

If you want to modify the extension:

1. **Edit `src/extension.js`**
2. **Press `Cmd+Shift+F5`** to reload
   - OR click the green reload icon in the debug toolbar
3. **Changes take effect immediately!**

## 📦 Install Permanently

Once you're happy with it:

```bash
# Install packaging tool
npm install -g @vscode/vsce

# Package the extension
vsce package

# Install the .vsix file
# Extensions > ... menu > "Install from VSIX..."
# Select: localhost-manager-retro-0.0.1.vsix
```

## ✨ Features to Try

1. **Open a port in browser**
   - Click "🌐 Open" button
   - Opens http://localhost:PORT in external browser

2. **Kill a process**
   - Click "💀 Kill" button
   - Confirms before killing
   - Refreshes automatically

3. **Auto-refresh**
   - Start a new server while extension is open
   - Watch it appear automatically!

4. **Quick kill via Command Palette**
   - `Cmd+Shift+P` → "Localhost Manager: Kill Port"
   - Select from quick-pick list

## 🐛 Troubleshooting

**Extension not appearing?**
- Make sure you pressed F5 (not just opened VS Code normally)
- Look for "Extension Development Host" in window title

**No ports showing?**
- Start some servers first (e.g., your portfolio: `npm run dev`)
- The extension uses `lsof` (macOS/Linux only)

**Want to see debug output?**
- In the main VS Code window (not Extension Host)
- View > Output
- Select "Extension Host" from dropdown

## 🎯 Next Steps

- Customize the colors in the HTML/CSS
- Add more port detection patterns
- Add keyboard shortcuts
- Publish to VS Code Marketplace!

Press **F5** now and enjoy! 🖥️✨
