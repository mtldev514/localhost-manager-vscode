# Installation Guide

## Quick Start - Test the Extension

1. **Open the project in VS Code:**
   ```bash
   cd /Users/alexcat/Developer/localhost-manager-vscode
   code .
   ```

2. **Press F5** to open the Extension Development Host

3. **The extension is now running!** You'll see:
   - A server icon in the Activity Bar (left sidebar)
   - Port count in the status bar (bottom right)

4. **Try it out:**
   - Click the server icon in Activity Bar to see the sidebar panel
   - Or open Command Palette (`Cmd+Shift+P`) and type "Localhost Manager: Open Panel" for the full retro UI

## Install Permanently

### Method 1: Install from VSIX (Recommended)

1. **Package the extension:**
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

2. **Install the .vsix file:**
   - Open VS Code
   - Go to Extensions (`Cmd+Shift+X`)
   - Click the `...` menu → "Install from VSIX..."
   - Select the `localhost-manager-retro-0.0.1.vsix` file

### Method 2: Symlink (Development)

```bash
ln -s /Users/alexcat/Developer/localhost-manager-vscode ~/.vscode/extensions/localhost-manager-retro
```

Then restart VS Code.

## Usage

### Sidebar Panel
- Click the server icon in the Activity Bar
- See all active localhost ports
- Click "Open" to visit in browser
- Click "Kill" to terminate a process

### Full Retro Panel
- `Cmd+Shift+P` → "Localhost Manager: Open Panel"
- Beautiful Windows 95-style interface
- Auto-refreshes every 2 seconds

### Commands

All commands are available via Command Palette (`Cmd+Shift+P`):

- **Localhost Manager: Open Panel** - Full retro UI
- **Localhost Manager: Refresh Ports** - Manual refresh
- **Localhost Manager: Kill Port** - Quick-pick to kill a port

### Status Bar

The status bar shows your active port count. Click it to open the full panel!

## Features

✨ **Auto-discovery** - Finds all localhost servers automatically
🎨 **Retro UI** - Beautiful Windows 95 aesthetics
🔄 **Auto-refresh** - Updates every 2-3 seconds
🌐 **Quick open** - Click to open any localhost URL
💀 **Easy kill** - Terminate processes with one click

## Troubleshooting

**Extension not appearing?**
- Make sure you pressed F5 to launch Extension Development Host
- Check the Debug Console for errors

**No ports showing?**
- Make sure you have some servers running (e.g., `npm run dev`)
- The extension uses `lsof` command (macOS/Linux only for now)

**Want to customize?**
- Edit `src/extension.js` to change behavior
- Edit the HTML/CSS in the webview sections for UI changes
- Press F5 again to reload changes

Enjoy! 🖥️✨
