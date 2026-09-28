const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const RtkService = require('./rtk-service');
const RtkUpdater = require('./rtk-updater');
const SkillInstaller = require('./skill-installer');
const DashboardPanel = require('./dashboard-panel');

class SidebarProvider {
    static viewType = 'tokenSaver.sidebarView';

    constructor(extensionUri, context) {
        this.extensionUri = extensionUri;
        this.context = context;
        this._view = undefined;
    }

    resolveWebviewView(webviewView, _context, _token) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.extensionUri, 'extension', 'webview')
            ]
        };

        this.updateWebviewContent(webviewView.webview);

        // Visibility listener (when user expands/collapses or switches tabs)
        webviewView.onDidChangeVisibility(() => {
            if (webviewView.visible) {
                this.sendLatestData();
            }
        });

        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'ready':
                case 'refresh':
                    await this.sendLatestData();
                    break;
                case 'popOut':
                    vscode.commands.executeCommand('tokenSaver.openDashboard');
                    break;
                case 'toggleMode':
                    await vscode.commands.executeCommand('tokenSaver.toggle');
                    setTimeout(() => this.sendLatestData(), 300);
                    break;
                case 'syncAllIdeRules':
                    await vscode.commands.executeCommand('tokenSaver.syncAllIdeRules');
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
                    this._view.webview.postMessage({
                        type: 'updateCheckResult',
                        data: updateResult
                    });
                    break;
                case 'toggleWeeklyAutoSync':
                    const isWeekly = message.enabled !== undefined ? message.enabled : true;
                    await this.context.globalState.update('tokenSaver.weeklyAutoSync', isWeekly);
                    try {
                        const cfg = vscode.workspace.getConfiguration('tokenSaver');
                        await cfg.update('weeklyAutoSync', isWeekly, vscode.ConfigurationTarget.Global);
                    } catch (e) {
                        // ignore config update error
                    }
                    vscode.window.showInformationMessage(
                        isWeekly 
                            ? '⚡ Weekly auto-sync for upstream GitHub RTK is now ENABLED.' 
                            : '⚪ Weekly auto-sync for upstream GitHub RTK is now DISABLED.'
                    );
                    this.sendLatestData();
                    break;
                case 'updateRtk':
                    vscode.commands.executeCommand('tokenSaver.updateRtk');
                    break;
                case 'installCli':
                    vscode.commands.executeCommand('tokenSaver.installCli');
                    break;
                case 'installSkills':
                    await vscode.commands.executeCommand('tokenSaver.installSkills');
                    setTimeout(() => this.sendLatestData(), 500);
                    break;
                case 'testLatency':
                    const latency = await RtkService.testLatency();
                    this._view.webview.postMessage({
                        type: 'latencyResult',
                        data: latency
                    });
                    break;
                case 'openScoreboardTerminal':
                    vscode.commands.executeCommand('tokenSaver.showSavings');
                    break;
            }
        });
    }

    async sendLatestData() {
        if (!this._view) {
            return;
        }

        const config = vscode.workspace.getConfiguration('tokenSaver');
        const isEnabled = this.context.globalState.get('tokenSaver.enabled', config.get('enableOnStartup', true));
        const weeklyAutoSync = this.context.globalState.get('tokenSaver.weeklyAutoSync', config.get('weeklyAutoSync', true));
        const check = await RtkService.checkInstalled();
        const metrics = await RtkService.getParsedMetrics();
        const skillsInstalled = SkillInstaller.checkSkillsInstalled('all');
        const ideStatus = SkillInstaller.getIdeStatus();

        this._view.webview.postMessage({
            type: 'stateUpdate',
            data: {
                isEnabled,
                weeklyAutoSync,
                installed: check.installed,
                version: check.version || 'Not installed',
                binaryPath: check.path || 'Not detected',
                metrics,
                skillsInstalled,
                scope: config.get('targetScope', 'all'),
                ideStatus,
                detectedIde: ideStatus.detectedIde,
                isSidebar: true
            }
        });
    }

    updateWebviewContent(webview) {
        const webviewDir = vscode.Uri.joinPath(this.extensionUri, 'extension', 'webview');

        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDir, 'dashboard.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDir, 'dashboard.js'));

        const htmlPath = path.join(this.extensionUri.fsPath, 'extension', 'webview', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        html = html.replace(/{{styleUri}}/g, styleUri.toString());
        html = html.replace(/{{scriptUri}}/g, scriptUri.toString());
        html = html.replace(/{{cspSource}}/g, webview.cspSource);

        webview.html = html;
    }
}

module.exports = SidebarProvider;
