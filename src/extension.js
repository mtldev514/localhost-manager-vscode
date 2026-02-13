const vscode = require('vscode');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

let statusBarItem;
let portsViewProvider;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Localhost Manager (Retro) is now active!');

    // Store context globally for tag access
    global.extensionContext = context;

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'localhost-manager.openPanel';
    context.subscriptions.push(statusBarItem);

    // Register webview provider
    portsViewProvider = new PortsViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('localhost-manager.portsView', portsViewProvider)
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('localhost-manager.openPanel', () => {
            PortsPanel.createOrShow(context.extensionUri);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('localhost-manager.refreshPorts', () => {
            if (portsViewProvider) {
                portsViewProvider.refresh();
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('localhost-manager.killPort', async () => {
            const ports = await getPorts();
            if (ports.length === 0) {
                vscode.window.showInformationMessage('No active ports found');
                return;
            }

            const items = ports.map(p => ({
                label: `:${p.port}`,
                description: `${p.command} (PID: ${p.pid})`,
                port: p.port
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select a port to kill'
            });

            if (selected) {
                await killPort(selected.port);
                vscode.window.showInformationMessage(`Killed processes on port ${selected.port}`);
                if (portsViewProvider) {
                    portsViewProvider.refresh();
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('localhost-manager.tagPort', async () => {
            const ports = await getPorts();
            if (ports.length === 0) {
                vscode.window.showInformationMessage('No active ports found');
                return;
            }

            const tags = context.workspaceState.get('portTags', {});
            const items = ports.map(p => ({
                label: `:${p.port}`,
                description: tags[p.port] || p.command,
                detail: tags[p.port] ? `Tagged: "${tags[p.port]}" • ${p.command}` : `${p.command} (no tag)`,
                port: p.port
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select a port to tag/rename'
            });

            if (selected) {
                const currentTag = tags[selected.port] || '';
                const newTag = await vscode.window.showInputBox({
                    prompt: `Enter a custom name/tag for port :${selected.port}`,
                    placeHolder: 'e.g., "My Portfolio", "API Server", "Database"',
                    value: currentTag
                });

                if (newTag !== undefined) {
                    if (newTag.trim() === '') {
                        delete tags[selected.port];
                    } else {
                        tags[selected.port] = newTag.trim();
                    }
                    await context.workspaceState.update('portTags', tags);
                    vscode.window.showInformationMessage(`✓ Tagged port :${selected.port} as "${newTag}"`);
                    if (portsViewProvider) {
                        portsViewProvider.refresh();
                    }
                }
            }
        })
    );

    // Update status bar periodically
    updateStatusBar();
    setInterval(updateStatusBar, 5000);
}

async function updateStatusBar() {
    const ports = await getPorts();
    statusBarItem.text = `$(server) ${ports.length} port${ports.length !== 1 ? 's' : ''}`;
    statusBarItem.tooltip = `${ports.length} active localhost server${ports.length !== 1 ? 's' : ''}\nClick to open Localhost Manager`;
    statusBarItem.show();
}

async function getPorts() {
    try {
        const { stdout } = await execPromise('lsof -iTCP -sTCP:LISTEN -n -P');
        const lines = stdout.trim().split('\n');
        const ports = [];

        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(/\s+/);
            const command = parts[0];
            const pid = parts[1];
            const user = parts[2];
            const name = parts[8] || '';

            const match = name.match(/:(\d+)$/);
            if (match) {
                const port = match[1];
                if (!ports.find(p => p.port === port && p.pid === pid)) {
                    ports.push({ command, pid, user, port });
                }
            }
        }

        ports.sort((a, b) => parseInt(a.port) - parseInt(b.port));

        // Enrich with metadata
        const enrichedPorts = await Promise.all(ports.map(p => enrichPortData(p)));
        return enrichedPorts;
    } catch (error) {
        return [];
    }
}

async function enrichPortData(portData) {
    const enriched = { ...portData };

    // Detect protocol/framework
    enriched.type = detectPortType(portData.port, portData.command);

    // Get process uptime and resource usage
    try {
        const { stdout } = await execPromise(`ps -p ${portData.pid} -o etime=,rss=,pcpu=`);
        const parts = stdout.trim().split(/\s+/);
        enriched.uptime = parts[0] || 'unknown';
        enriched.memory = parts[1] ? formatMemory(parseInt(parts[1])) : 'unknown';
        enriched.cpu = parts[2] ? `${parseFloat(parts[2]).toFixed(1)}%` : '0%';
    } catch (err) {
        enriched.uptime = 'unknown';
        enriched.memory = 'unknown';
        enriched.cpu = '0%';
    }

    // Load custom tags/names from workspace state
    const context = global.extensionContext;
    if (context) {
        const tags = context.workspaceState.get('portTags', {});
        enriched.customName = tags[portData.port] || '';
    }

    return enriched;
}

function detectPortType(port, command) {
    const portInt = parseInt(port);

    const knownPorts = {
        3000: { type: 'React/Next.js', icon: '<i class="codicon codicon-symbol-misc"></i>' },
        3001: { type: 'React (alt)', icon: '<i class="codicon codicon-symbol-misc"></i>' },
        4200: { type: 'Angular', icon: '<i class="codicon codicon-symbol-array"></i>' },
        5000: { type: 'Flask/Rails', icon: '<i class="codicon codicon-symbol-namespace"></i>' },
        5001: { type: 'Flask Admin', icon: '<i class="codicon codicon-symbol-namespace"></i>' },
        8000: { type: 'Django/HTTP', icon: '<i class="codicon codicon-symbol-namespace"></i>' },
        8080: { type: 'Tomcat/HTTP', icon: '<i class="codicon codicon-server"></i>' },
        9000: { type: 'General', icon: '<i class="codicon codicon-globe"></i>' },
        3306: { type: 'MySQL', icon: '<i class="codicon codicon-database"></i>' },
        5432: { type: 'PostgreSQL', icon: '<i class="codicon codicon-database"></i>' },
        6379: { type: 'Redis', icon: '<i class="codicon codicon-package"></i>' },
        27017: { type: 'MongoDB', icon: '<i class="codicon codicon-database"></i>' },
        9876: { type: 'Localhost Manager', icon: '<i class="codicon codicon-server-environment"></i>' },
    };

    if (knownPorts[portInt]) {
        return knownPorts[portInt];
    }

    const cmd = command.toLowerCase();
    if (cmd.includes('node')) return { type: 'Node.js', icon: '<i class="codicon codicon-symbol-method"></i>' };
    if (cmd.includes('python')) return { type: 'Python', icon: '<i class="codicon codicon-symbol-namespace"></i>' };
    if (cmd.includes('ruby')) return { type: 'Ruby', icon: '<i class="codicon codicon-symbol-property"></i>' };
    if (cmd.includes('java')) return { type: 'Java', icon: '<i class="codicon codicon-symbol-class"></i>' };
    if (cmd.includes('nginx')) return { type: 'Nginx', icon: '<i class="codicon codicon-server"></i>' };
    if (cmd.includes('apache')) return { type: 'Apache', icon: '<i class="codicon codicon-server"></i>' };
    if (cmd.includes('postgres')) return { type: 'PostgreSQL', icon: '<i class="codicon codicon-database"></i>' };
    if (cmd.includes('mysql')) return { type: 'MySQL', icon: '<i class="codicon codicon-database"></i>' };
    if (cmd.includes('redis')) return { type: 'Redis', icon: '<i class="codicon codicon-package"></i>' };
    if (cmd.includes('mongo')) return { type: 'MongoDB', icon: '<i class="codicon codicon-database"></i>' };

    if (portInt >= 18000 && portInt < 19000) {
        return { type: 'WebSocket', icon: '<i class="codicon codicon-plug"></i>' };
    }

    return { type: 'Unknown', icon: '<i class="codicon codicon-question"></i>' };
}

function formatMemory(kb) {
    if (kb < 1024) return `${kb} KB`;
    if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${(kb / 1024 / 1024).toFixed(2)} GB`;
}

async function killPort(port) {
    try {
        const { stdout } = await execPromise(`lsof -ti :${port}`);
        const pids = stdout.trim().split('\n').filter(Boolean);
        await execPromise(`kill -9 ${pids.join(' ')}`);
    } catch (error) {
        throw new Error(`Failed to kill port ${port}: ${error.message}`);
    }
}

class PortsViewProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
        this._view = undefined;
    }

    resolveWebviewView(webviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'refresh':
                    this.refresh();
                    break;
                case 'kill':
                    try {
                        await killPort(data.port);
                        vscode.window.showInformationMessage(`Killed processes on port ${data.port}`);
                        this.refresh();
                    } catch (error) {
                        vscode.window.showErrorMessage(error.message);
                    }
                    break;
                case 'open':
                    vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${data.port}`));
                    break;
            }
        });

        // Auto-refresh every 3 seconds
        setInterval(() => this.refresh(), 3000);
        this.refresh();
    }

    async refresh() {
        if (this._view) {
            const ports = await getPorts();
            this._view.webview.postMessage({ type: 'update', ports });
        }
    }

    _getHtmlForWebview(webview) {
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
        );

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Localhost Manager</title>
    <link href="${codiconsUri}" rel="stylesheet" />
    <style>
        body {
            padding: 10px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
        }

        .header {
            margin-bottom: 10px;
            padding: 8px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
        }

        .port-item {
            padding: 8px;
            margin: 4px 0;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .port-item:hover {
            background: var(--vscode-list-hoverBackground);
        }

        .port-number {
            font-weight: bold;
            color: var(--vscode-terminal-ansiGreen);
        }

        .port-info {
            flex: 1;
            margin-left: 10px;
        }

        .port-process {
            color: var(--vscode-terminal-ansiCyan);
        }

        .port-actions {
            display: flex;
            gap: 5px;
        }

        button {
            padding: 2px 6px;
            border: 1px solid var(--vscode-button-border);
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            cursor: pointer;
            font-size: 10px;
            border-radius: 2px;
            min-width: 24px;
            height: 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        button:hover {
            background: var(--vscode-button-hoverBackground);
        }

        button:active {
            opacity: 0.8;
        }

        .btn-kill {
            background: var(--vscode-inputValidation-errorBackground);
            color: var(--vscode-inputValidation-errorForeground);
            border-color: var(--vscode-inputValidation-errorBorder);
        }

        .btn-kill:hover {
            filter: brightness(1.1);
            opacity: 0.9;
        }

        .empty {
            text-align: center;
            padding: 20px;
            color: var(--vscode-descriptionForeground);
        }

        .refresh-btn {
            width: 100%;
            margin-bottom: 10px;
        }

        .filter-container {
            margin-bottom: 10px;
        }

        .filter-input {
            width: 100%;
            padding: 6px;
            border: 1px solid var(--vscode-input-border);
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
        }

        .filter-input:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }

        .filter-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 6px;
        }

        .filter-tag {
            padding: 2px 8px;
            font-size: 10px;
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 3px;
            cursor: pointer;
            border: 1px solid transparent;
        }

        .filter-tag:hover {
            border-color: var(--vscode-focusBorder);
            background: var(--vscode-list-hoverBackground);
        }

        .filter-tag.active {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-color: var(--vscode-button-background);
        }

        .filter-tag.active:hover {
            background: var(--vscode-button-hoverBackground);
            border-color: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <button class="refresh-btn" onclick="refresh()">
        <i class="codicon codicon-refresh"></i> Refresh
    </button>

    <div class="filter-container">
        <input
            type="text"
            class="filter-input"
            id="filter-input"
            placeholder="Filter by port, type, or process..."
            oninput="filterPorts()"
        />
        <div class="filter-tags" id="filter-tags"></div>
    </div>

    <div class="header">
        <strong>Active Ports: <span id="count">0</span></strong>
        <span style="margin-left: 10px; font-size: 10px;" id="filter-status"></span>
    </div>
    <div id="ports"></div>

    <script>
        const vscode = acquireVsCodeApi();
        let allPorts = [];
        let currentFilter = '';
        let activeTypeFilter = '';

        function refresh() {
            vscode.postMessage({ type: 'refresh' });
        }

        function killPort(port) {
            if (confirm(\`Kill all processes on port \${port}?\`)) {
                vscode.postMessage({ type: 'kill', port });
            }
        }

        function openPort(port) {
            vscode.postMessage({ type: 'open', port });
        }

        function copyKillCommand(port, pid) {
            const command = \`kill -9 \${pid}\`;
            navigator.clipboard.writeText(command).then(() => {
                // Visual feedback - could add a toast notification here
                const btn = event.target.closest('button');
                const originalTitle = btn.title;
                btn.title = 'Copied!';
                setTimeout(() => { btn.title = originalTitle; }, 1000);
            });
        }

        function filterPorts() {
            currentFilter = document.getElementById('filter-input').value.toLowerCase();
            renderPorts();
        }

        function setTypeFilter(type) {
            if (activeTypeFilter === type) {
                activeTypeFilter = '';
            } else {
                activeTypeFilter = type;
            }
            renderPorts();
            updateFilterTags();
        }

        function updateFilterTags() {
            const types = [...new Set(allPorts.map(p => p.type.type))];
            const tagsContainer = document.getElementById('filter-tags');

            tagsContainer.innerHTML = types.map(type => {
                const count = allPorts.filter(p => p.type.type === type).length;
                const icon = allPorts.find(p => p.type.type === type)?.type.icon || '';
                const isActive = activeTypeFilter === type ? 'active' : '';
                return \`<span class="filter-tag \${isActive}" onclick="setTypeFilter('\${type}')">\${icon} \${type} (\${count})</span>\`;
            }).join('');
        }

        window.addEventListener('message', event => {
            const message = event.data;
            if (message.type === 'update') {
                allPorts = message.ports;
                updateFilterTags();
                renderPorts();
            }
        });

        function renderPorts() {
            const container = document.getElementById('ports');
            const countEl = document.getElementById('count');
            const statusEl = document.getElementById('filter-status');

            // Filter ports
            let filteredPorts = allPorts;

            // Type filter
            if (activeTypeFilter) {
                filteredPorts = filteredPorts.filter(p => p.type.type === activeTypeFilter);
            }

            // Text filter
            if (currentFilter) {
                filteredPorts = filteredPorts.filter(p =>
                    p.port.includes(currentFilter) ||
                    p.type.type.toLowerCase().includes(currentFilter) ||
                    p.command.toLowerCase().includes(currentFilter) ||
                    p.user.toLowerCase().includes(currentFilter) ||
                    (p.customName && p.customName.toLowerCase().includes(currentFilter))
                );
            }

            countEl.textContent = allPorts.length;

            // Update filter status
            if (currentFilter || activeTypeFilter) {
                statusEl.textContent = \`(showing \${filteredPorts.length} of \${allPorts.length})\`;
            } else {
                statusEl.textContent = '';
            }

            if (filteredPorts.length === 0) {
                if (allPorts.length === 0) {
                    container.innerHTML = '<div class="empty">No active ports</div>';
                } else {
                    container.innerHTML = '<div class="empty">No ports match your filter</div>';
                }
                return;
            }

            container.innerHTML = filteredPorts.map(p => \`
                <div class="port-item">
                    <span class="port-number">:\${p.port}</span>
                    <div class="port-info">
                        <div class="port-process">
                            \${p.customName ? '<i class="codicon codicon-tag"></i> ' + p.customName : p.type.icon + ' ' + p.type.type}
                        </div>
                        <div style="font-size: 10px; color: var(--vscode-descriptionForeground);">
                            \${p.command} • PID: \${p.pid} • \${p.uptime} • \${p.memory} • CPU: \${p.cpu}
                        </div>
                    </div>
                    <div class="port-actions">
                        <button onclick="openPort('\${p.port}')" title="Open http://localhost:\${p.port}">
                            <i class="codicon codicon-link-external"></i>
                        </button>
                        <button class="btn-kill" onclick="copyKillCommand('\${p.port}', '\${p.pid}')" title="Copy kill command">
                            <i class="codicon codicon-clippy"></i>
                        </button>
                    </div>
                </div>
            \`).join('');
        }
    </script>
</body>
</html>`;
    }
}

class PortsPanel {
    static currentPanel = undefined;

    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (PortsPanel.currentPanel) {
            PortsPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'localhostManager',
            'Localhost Manager',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        PortsPanel.currentPanel = new PortsPanel(panel, extensionUri);
    }

    constructor(panel, extensionUri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._disposables = [];

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.type) {
                    case 'kill':
                        try {
                            await killPort(message.port);
                            vscode.window.showInformationMessage(`Killed processes on port ${message.port}`);
                            this._update();
                        } catch (error) {
                            vscode.window.showErrorMessage(error.message);
                        }
                        break;
                    case 'refresh':
                        this._update();
                        break;
                    case 'open':
                        vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${message.port}`));
                        break;
                }
            },
            null,
            this._disposables
        );

        // Auto-refresh
        setInterval(() => this._update(), 2000);
    }

    async _update() {
        const ports = await getPorts();
        this._panel.webview.html = this._getHtmlForWebview(ports);
    }

    _getHtmlForWebview(ports) {
        const webview = this._panel.webview;
        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
        );

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Localhost Manager</title>
    <link href="${codiconsUri}" rel="stylesheet" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', Courier, monospace;
            background: #008080;
            padding: 20px;
            color: #000;
        }

        .window {
            max-width: 1200px;
            margin: 0 auto;
            background: #c0c0c0;
            border: 2px outset #fff;
            box-shadow: 4px 4px 0 rgba(0,0,0,0.5);
        }

        .title-bar {
            background: linear-gradient(90deg, #000080, #1084d0);
            color: white;
            padding: 4px 8px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .content {
            padding: 20px;
            background: #c0c0c0;
        }

        h1 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #000080;
        }

        .status-bar {
            background: #c0c0c0;
            border: 2px inset #fff;
            padding: 8px;
            margin-bottom: 20px;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border: 2px inset #fff;
        }

        th {
            background: #000080;
            color: white;
            padding: 8px;
            text-align: left;
            font-weight: bold;
        }

        td {
            padding: 8px;
            border-bottom: 1px solid #c0c0c0;
        }

        tr:hover {
            background: #ffffcc;
        }

        .port-link {
            color: #0000ff;
            text-decoration: underline;
            cursor: pointer;
        }

        .btn {
            background: #c0c0c0;
            border: 2px outset #fff;
            padding: 2px 8px;
            cursor: pointer;
            font-family: inherit;
            font-size: 11px;
            margin: 2px;
            min-width: 28px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }

        .btn:hover {
            background: #e0e0e0;
        }

        .btn:active {
            border-style: inset;
        }

        .btn-danger {
            background: #d73a49;
            color: white;
            border-color: #cb2431;
        }

        .btn-danger:hover {
            background: #e04856;
            filter: brightness(1.05);
        }

        .btn-refresh {
            background: #28a745;
            color: white;
            border-color: #269f42;
        }

        .btn-refresh:hover {
            background: #269f42;
        }

        .toolbar {
            margin-bottom: 20px;
            padding: 10px;
            background: #c0c0c0;
            border: 2px inset #fff;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #00ff00;
            border-radius: 50%;
            margin-right: 5px;
            animation: blink 1s infinite;
        }

        .filter-box {
            margin-bottom: 15px;
            padding: 10px;
            background: white;
            border: 2px inset #fff;
        }

        .filter-input {
            width: 100%;
            padding: 4px 8px;
            border: 2px inset #fff;
            background: white;
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
        }

        .filter-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
        }

        .filter-chip {
            padding: 3px 10px;
            font-size: 11px;
            background: #c0c0c0;
            border: 2px outset #fff;
            cursor: pointer;
        }

        .filter-chip:hover {
            background: #e0e0e0;
        }

        .filter-chip:active {
            border-style: inset;
        }

        .filter-chip.active {
            background: #0366d6;
            color: white;
            border-style: inset;
            border-color: #0256c7;
        }
    </style>
</head>
<body>
    <div class="window">
        <div class="title-bar">
            <span>🖥️ Localhost Manager - VS Code Extension</span>
        </div>

        <div class="content">
            <h1>Local Servers Monitor</h1>

            <div class="status-bar">
                <span class="status-indicator"></span>
                <span>Active Ports: <strong id="total-count">${ports.length}</strong></span>
                <span id="filter-status-retro" style="margin-left: 10px; font-size: 11px;"></span>
            </div>

            <div class="filter-box">
                <input
                    type="text"
                    class="filter-input"
                    id="filter-input-retro"
                    placeholder="Filter by port, type, or process..."
                />
                <div class="filter-chips" id="filter-chips-retro"></div>
            </div>

            <div class="toolbar">
                <button class="btn btn-refresh" onclick="refresh()">
                    <i class="codicon codicon-refresh"></i> Refresh
                </button>
                <button class="btn" onclick="clearFilters()">
                    <i class="codicon codicon-clear-all"></i> Clear Filters
                </button>
            </div>

            <div id="ports-table-container"></div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const allPortsData = ${JSON.stringify(ports)};
        let currentFilterText = '';
        let activeChipFilter = '';

        function refresh() {
            vscode.postMessage({ type: 'refresh' });
        }

        function killPort(port) {
            if (confirm(\`Kill all processes on port \${port}?\`)) {
                vscode.postMessage({ type: 'kill', port });
            }
        }

        function openPort(port) {
            vscode.postMessage({ type: 'open', port });
        }

        function copyKillCommand(port, pid) {
            const command = \`kill -9 \${pid}\`;
            navigator.clipboard.writeText(command).then(() => {
                // Visual feedback
                const btn = event.target.closest('button');
                const originalTitle = btn.title;
                btn.title = 'Copied!';
                setTimeout(() => { btn.title = originalTitle; }, 1000);
            });
        }

        function clearFilters() {
            currentFilterText = '';
            activeChipFilter = '';
            document.getElementById('filter-input-retro').value = '';
            renderTable();
            updateChips();
        }

        function setChipFilter(type) {
            if (activeChipFilter === type) {
                activeChipFilter = '';
            } else {
                activeChipFilter = type;
            }
            renderTable();
            updateChips();
        }

        function updateChips() {
            const types = [...new Set(allPortsData.map(p => p.type.type))];
            const chipsContainer = document.getElementById('filter-chips-retro');

            chipsContainer.innerHTML = types.map(type => {
                const count = allPortsData.filter(p => p.type.type === type).length;
                const icon = allPortsData.find(p => p.type.type === type)?.type.icon || '';
                const isActive = activeChipFilter === type ? 'active' : '';
                return \`<button class="filter-chip \${isActive}" onclick="setChipFilter('\${type}')">\${icon} \${type} (\${count})</button>\`;
            }).join('');
        }

        function renderTable() {
            const container = document.getElementById('ports-table-container');
            const statusEl = document.getElementById('filter-status-retro');
            const countEl = document.getElementById('total-count');

            countEl.textContent = allPortsData.length;

            // Filter logic
            let filtered = allPortsData;

            if (activeChipFilter) {
                filtered = filtered.filter(p => p.type.type === activeChipFilter);
            }

            if (currentFilterText) {
                const search = currentFilterText.toLowerCase();
                filtered = filtered.filter(p =>
                    p.port.includes(search) ||
                    p.type.type.toLowerCase().includes(search) ||
                    p.command.toLowerCase().includes(search) ||
                    p.user.toLowerCase().includes(search)
                );
            }

            // Update status
            if (currentFilterText || activeChipFilter) {
                statusEl.textContent = \`(showing \${filtered.length} of \${allPortsData.length})\`;
            } else {
                statusEl.textContent = '';
            }

            // Render
            if (filtered.length === 0) {
                if (allPortsData.length === 0) {
                    container.innerHTML = '<div class="empty-state">No active ports found. Start some servers!</div>';
                } else {
                    container.innerHTML = '<div class="empty-state">No ports match your filter</div>';
                }
                return;
            }

            container.innerHTML = \`
                <table>
                    <thead>
                        <tr>
                            <th>Port</th>
                            <th>Type</th>
                            <th>Process</th>
                            <th>Uptime</th>
                            <th>Memory</th>
                            <th>CPU</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${filtered.map(p => \`
                        <tr>
                            <td><strong>:\${p.port}</strong></td>
                            <td>
                                \${p.customName ? '<i class="codicon codicon-tag"></i> <strong>' + p.customName + '</strong>' : p.type.icon + ' ' + p.type.type}
                            </td>
                            <td>
                                \${p.command}
                                <div style="font-size: 9px; color: #666;">PID: \${p.pid} • \${p.user}</div>
                            </td>
                            <td>\${p.uptime}</td>
                            <td>\${p.memory}</td>
                            <td>\${p.cpu}</td>
                            <td>
                                <button class="btn" onclick="openPort('\${p.port}')" title="Open http://localhost:\${p.port}">
                                    <i class="codicon codicon-link-external"></i>
                                </button>
                                <button class="btn btn-danger" onclick="copyKillCommand('\${p.port}', '\${p.pid}')" title="Copy kill command">
                                    <i class="codicon codicon-clippy"></i>
                                </button>
                            </td>
                        </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
        }

        // Setup filter input
        document.getElementById('filter-input-retro').addEventListener('input', (e) => {
            currentFilterText = e.target.value;
            renderTable();
        });

        // Initial render
        updateChips();
        renderTable();
    </script>
</body>
</html>`;
    }

    dispose() {
        PortsPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
