# Changelog

All notable changes to the "Localhost Manager" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2024-02-12

### Added
- Initial release
- Native VS Code UI design following standard design tokens
- Sidebar panel with compact port view
- Full table panel view for detailed port information
- Auto-refresh with pause/play control (3s sidebar, 2s panel)
- Port filtering by port number, type, process, or user
- Custom port tagging/naming via Command Palette
- Copy kill commands to clipboard (safe, non-destructive)
- One-click open ports in browser
- Rich metadata display: uptime, memory usage, CPU percentage
- Auto-detection of common port types (React, Flask, databases, etc.)
- VS Code Codicons integration for consistent UI

### Platform Support
- ✅ macOS (via lsof)
- ✅ Linux (via lsof)
- ⏳ Windows support coming soon (will use netstat)

### Commands
- `Localhost Manager: Open Panel` - Open full panel view
- `Localhost Manager: Refresh Ports` - Manually refresh port list
- `Localhost Manager: Kill Port` - Quick-pick to copy kill command
- `Localhost Manager: Tag/Rename Port` - Add custom names to ports

[Unreleased]: https://github.com/mtldev514/localhost-manager-vscode/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/mtldev514/localhost-manager-vscode/releases/tag/v0.0.1
