# Localhost Manager (Retro) - VS Code Extension

A beautiful retro Windows 95-inspired localhost manager for VS Code! 🖥️✨

## Features

- 🎨 **Retro Windows 95 UI** - Classic early 2000s aesthetic
- 🔍 **Smart Filtering** - Filter by port, type, process, or custom tags
- 🏷️ **Custom Tagging** - Name your servers for easy identification
- 📊 **Rich Metadata** - View uptime, memory usage, and CPU stats
- 🌐 **Quick Open** - One-click to open localhost URLs in browser
- 📋 **Safe Kill** - Copy kill commands to clipboard (you stay in control!)
- 🎯 **Auto-detection** - Recognizes React, Flask, Python, WebSocket, databases
- 🔄 **Auto-refresh** - Live updates every 2-3 seconds
- 📱 **Dual Interface** - Compact sidebar + full retro panel
- 🎨 **VS Code Integration** - Uses Codicons for consistency

## Usage

### Sidebar View
1. Click the server icon in the Activity Bar
2. See all active ports with metadata
3. Click the link icon (↗️) to open in browser
4. Click the clipboard icon (📋) to copy kill command
5. Use filters to find specific ports

### Full Panel
1. Open Command Palette (`Cmd+Shift+P`)
2. Type "Localhost Manager: Open Panel"
3. Enjoy the full retro UI experience!

### Commands

- `Localhost Manager: Open Panel` - Open full retro UI panel
- `Localhost Manager: Refresh Ports` - Manually refresh port list
- `Localhost Manager: Kill Port` - Quick-pick to copy kill command
- `Localhost Manager: Tag/Rename Port` - Add custom names to ports

## Requirements

- macOS or Linux (uses `lsof` command)
- VS Code 1.80.0 or higher

## Extension Settings

This extension doesn't require any configuration! It works out of the box.

## Known Issues

- Currently only works on macOS and Linux (uses `lsof`)
- Windows support coming soon (will use `netstat`)

## Release Notes

### 0.0.1

Initial release! 🎉

- Retro Windows 95 UI
- Sidebar panel
- Full webview panel
- Auto-refresh
- Kill processes
- Open in browser

## Development

Want to contribute? Here's how to get started:

```bash
# Clone the repo
git clone https://github.com/mtldev514/localhost-manager-vscode
cd localhost-manager-vscode

# Install dependencies
npm install

# Open in VS Code
code .

# Press F5 to open Extension Development Host
```

## Credits

Created with 💖 by [Alex Catus](https://github.com/mtldev514)

**Icon**: [UI icons created by Freepik - Flaticon](https://www.flaticon.com/free-icons/ui)

Part of the Retro Portfolio ecosystem!

## License

MIT
