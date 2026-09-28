const vscode = require('vscode');
const WebviewHelper = require('./webview-helper');

class DashboardPanel {
    static currentPanel = undefined;
    static viewType = 'tokenSaverDashboard';

    static createOrShow(extensionUri, context) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (DashboardPanel.currentPanel) {
            DashboardPanel.currentPanel.panel.reveal(column);
            DashboardPanel.currentPanel.sendLatestData();
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            DashboardPanel.viewType,
            '⚡ Token Saver (RTK) Dashboard',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'extension', 'webview')
                ],
                retainContextWhenHidden: true
            }
        );

        DashboardPanel.currentPanel = new DashboardPanel(panel, extensionUri, context);
    }

    constructor(panel, extensionUri, context) {
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.context = context;
        this.disposables = [];

        this.panel.webview.html = WebviewHelper.getHtml(this.extensionUri, this.panel.webview);
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.onDidReceiveMessage(
            async (message) => {
                if (message.command === 'popOut' || message.command === 'minimize') {
                    vscode.commands.executeCommand('tokenSaver.sidebarView.focus');
                    this.dispose();
                    return;
                }
                await WebviewHelper.handleMessage(
                    message,
                    this.panel.webview,
                    this.context,
                    false,
                    () => this.sendLatestData()
                );
            },
            null,
            this.disposables
        );
    }

    async sendLatestData() {
        const data = await WebviewHelper.getLatestStateData(this.context, false);
        this.panel.webview.postMessage({ type: 'stateUpdate', data });
    }

    dispose() {
        DashboardPanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

module.exports = DashboardPanel;

