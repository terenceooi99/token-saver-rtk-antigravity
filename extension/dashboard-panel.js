const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const RtkService = require('./rtk-service');
const RtkUpdater = require('./rtk-updater');
const SkillInstaller = require('./skill-installer');

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

        this.updateWebviewContent();

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'ready':
                    case 'refresh':
                        await this.sendLatestData();
                        break;
                    case 'toggleMode':
                        vscode.commands.executeCommand('tokenSaver.toggle');
                        setTimeout(() => this.sendLatestData(), 300);
                        break;
                    case 'syncAllIdeRules':
                        vscode.commands.executeCommand('tokenSaver.syncAllIdeRules');
                        setTimeout(() => this.sendLatestData(), 400);
                        break;
                    case 'syncSingleTarget':
                        if (message.targetId) {
                            SkillInstaller.syncRules(true, [message.targetId]);
                            vscode.window.showInformationMessage(`⚡ Synced RTK rule for ${message.targetId}`);
                            setTimeout(() => this.sendLatestData(), 300);
                        }
                        break;
                    case 'toggleTarget':
                        if (message.targetId) {
                            SkillInstaller.syncRules(!message.currentlySynced, [message.targetId]);
                            setTimeout(() => this.sendLatestData(), 300);
                        }
                        break;
                    case 'checkUpdates':
                        const updateResult = await RtkUpdater.checkForUpdates(false);
                        this.panel.webview.postMessage({
                            type: 'updateCheckResult',
                            data: updateResult
                        });
                        break;
                    case 'updateRtk':
                        vscode.commands.executeCommand('tokenSaver.updateRtk');
                        break;
                    case 'installCli':
                        vscode.commands.executeCommand('tokenSaver.installCli');
                        break;
                    case 'installSkills':
                        vscode.commands.executeCommand('tokenSaver.installSkills');
                        setTimeout(() => this.sendLatestData(), 500);
                        break;
                    case 'testLatency':
                        const latency = await RtkService.testLatency();
                        this.panel.webview.postMessage({
                            type: 'latencyResult',
                            data: latency
                        });
                        break;
                    case 'openScoreboardTerminal':
                        vscode.commands.executeCommand('tokenSaver.showSavings');
                        break;
                }
            },
            null,
            this.disposables
        );
    }

    async sendLatestData() {
        const config = vscode.workspace.getConfiguration('tokenSaver');
        const isEnabled = this.context.globalState.get('tokenSaver.enabled', config.get('enableOnStartup', true));
        const check = await RtkService.checkInstalled();
        const metrics = await RtkService.getParsedMetrics();
        const skillsInstalled = SkillInstaller.checkSkillsInstalled('all');
        const ideStatus = SkillInstaller.getIdeStatus();

        this.panel.webview.postMessage({
            type: 'stateUpdate',
            data: {
                isEnabled,
                installed: check.installed,
                version: check.version || 'Not installed',
                binaryPath: check.path || 'Not detected',
                metrics,
                skillsInstalled,
                scope: config.get('targetScope', 'all'),
                ideStatus
            }
        });
    }

    updateWebviewContent() {
        const webview = this.panel.webview;
        const webviewDir = vscode.Uri.joinPath(this.extensionUri, 'extension', 'webview');

        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDir, 'dashboard.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDir, 'dashboard.js'));

        const htmlPath = path.join(this.extensionUri.fsPath, 'extension', 'webview', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        html = html.replace(/{{styleUri}}/g, styleUri.toString());
        html = html.replace(/{{scriptUri}}/g, scriptUri.toString());
        html = html.replace(/{{cspSource}}/g, webview.cspSource);

        this.panel.webview.html = html;
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
