# Localhost Manager

A dashboard to easily find & kill processes running on your localhost ports.

## What it does

Shows a list of ports currently listening on your machine. Click to open them in your browser or copy the kill command.

**That's it.** No fancy features, just a simple port viewer.

## How to use

Click the server icon in the sidebar. You'll see:
- Port number
- What's running on it
- How long it's been up
- Memory/CPU usage

Click a port to open it in your browser. Click the clipboard icon to copy the kill command.

There's also a table view if you prefer that (`Cmd+Shift+P` → "Localhost Manager: Open Panel").

## Requirements

macOS or Linux only (uses `lsof`). Windows not supported yet.

## License

MIT
