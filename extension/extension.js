const vscode = require('vscode');
const StatusBarManager = require('./statusbar');
const RtkService = require('./rtk-service');
const RtkUpdater = require('./rtk-updater');
const SkillInstaller = require('./skill-installer');
const DashboardPanel = require('./dashboard-panel');
const SidebarProvider = require('./sidebar-provider');

let statusBar;
let outputChannel;
let metricsInterval;
let sidebarProvider;

async function refreshStatus(context) {
    const config = vscode.workspace.getConfiguration('tokenSaver');
    const isEnabled = context.globalState.get('tokenSaver.enabled', config.get('enableOnStartup', true));
    const check = await RtkService.checkInstalled();
    const metrics = isEnabled ? await RtkService.getParsedMetrics() : null;
    statusBar.update(isEnabled, check.version, metrics);
    if (sidebarProvider) {
        sidebarProvider.sendLatestData();
    }
}

async function checkWeeklyAutoSync(context) {
    const config = vscode.workspace.getConfiguration('tokenSaver');
    const weeklyEnabled = context.globalState.get('tokenSaver.weeklyAutoSync', config.get('weeklyAutoSync', true));
    if (!weeklyEnabled) return;

    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const lastSync = context.globalState.get('tokenSaver.lastWeeklySyncTime', 0);
    const now = Date.now();

    if (now - lastSync > ONE_WEEK_MS) {
        await context.globalState.update('tokenSaver.lastWeeklySyncTime', now);
        if (outputChannel) {
            outputChannel.appendLine('[Token Saver] Running scheduled weekly upstream GitHub RTK sync check...');
        }
        await RtkUpdater.checkForUpdates(true);
    }
}

async function activate(context) {
    outputChannel = vscode.window.createOutputChannel('Token Saver (RTK)');
    statusBar = new StatusBarManager();
    sidebarProvider = new SidebarProvider(context.extensionUri, context);

    context.subscriptions.push(statusBar);
    context.subscriptions.push(outputChannel);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            SidebarProvider.viewType,
            sidebarProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );

    const config = vscode.workspace.getConfiguration('tokenSaver');
    let isEnabled = context.globalState.get('tokenSaver.enabled', config.get('enableOnStartup', true));
    const targetScope = config.get('targetScope', 'all');
    const autoInstallSkills = config.get('autoInstallSkills', true);

    // Initial check of RTK binary
    const check = await RtkService.checkInstalled();
    if (!check.installed) {
        vscode.window.showWarningMessage(
            'RTK binary is not detected on PATH. Token Saver requires RTK (Rust Token Killer) CLI.',
            'Install RTK via winget/brew',
            'Open Dashboard',
            'View Guide'
        ).then(choice => {
            if (choice === 'Install RTK via winget/brew') {
                vscode.commands.executeCommand('tokenSaver.installCli');
            } else if (choice === 'Open Dashboard') {
                vscode.commands.executeCommand('tokenSaver.openDashboard');
            } else if (choice === 'View Guide') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/rtk-ai/rtk'));
            }
        });
    }

    // Auto-install skills (Way 1: Chat / Slash Commands) & sync Multi-IDE rules (Way 2: Dashboard & Status Bar)
    // Ensures Way 1 & Way 2 are both available simultaneously out-of-the-box upon plugin installation
    if (autoInstallSkills) {
        try {
            SkillInstaller.installAllSkills();
        } catch (err) {
            outputChannel.appendLine(`Notice: Skill auto-installer: ${err.message}`);
        }
    }

    SkillInstaller.syncRules(isEnabled, targetScope);
    await refreshStatus(context);

    // Automatic update check on startup if enabled
    if (config.get('checkForUpdatesOnStartup', true)) {
        setTimeout(() => {
            RtkUpdater.checkForUpdates(true);
        }, 4000);
    }

    // Check weekly auto sync
    setTimeout(() => {
        checkWeeklyAutoSync(context);
    }, 6000);

    // Periodic metrics refresher & weekly auto sync check
    metricsInterval = setInterval(() => {
        refreshStatus(context);
        checkWeeklyAutoSync(context);
    }, 30000);

    // Commands
    const openDashboardCmd = vscode.commands.registerCommand('tokenSaver.openDashboard', () => {
        DashboardPanel.createOrShow(context.extensionUri, context);
    });

    const toggleCmd = vscode.commands.registerCommand('tokenSaver.toggle', async () => {
        isEnabled = !isEnabled;
        await context.globalState.update('tokenSaver.enabled', isEnabled);
        const scope = vscode.workspace.getConfiguration('tokenSaver').get('targetScope', 'all');
        const results = SkillInstaller.syncRules(isEnabled, scope);
        await refreshStatus(context);

        if (isEnabled) {
            vscode.window.showInformationMessage(`⚡ Token Saver (RTK) is now ENABLED across ${results.length} AI agent target(s).`);
        } else {
            vscode.window.showInformationMessage('⚪ Token Saver (RTK) is now DISABLED.');
        }
    });

    const enableCmd = vscode.commands.registerCommand('tokenSaver.enable', async () => {
        isEnabled = true;
        await context.globalState.update('tokenSaver.enabled', true);
        const scope = vscode.workspace.getConfiguration('tokenSaver').get('targetScope', 'all');
        SkillInstaller.syncRules(true, scope);
        await refreshStatus(context);
        vscode.window.showInformationMessage('⚡ Token Saver (RTK) ENABLED across all configured AI Agent targets.');
    });

    const disableCmd = vscode.commands.registerCommand('tokenSaver.disable', async () => {
        isEnabled = false;
        await context.globalState.update('tokenSaver.enabled', false);
        const scope = vscode.workspace.getConfiguration('tokenSaver').get('targetScope', 'all');
        SkillInstaller.syncRules(false, scope);
        await refreshStatus(context);
        vscode.window.showInformationMessage('⚪ Token Saver (RTK) DISABLED.');
    });

    const syncAllIdeRulesCmd = vscode.commands.registerCommand('tokenSaver.syncAllIdeRules', async () => {
        try {
            const detected = SkillInstaller.detectCurrentIde();
            const results = SkillInstaller.syncRules(isEnabled, 'current');
            vscode.window.showInformationMessage(
                `🚀 Synced RTK automation rules for ${detected.displayName} (${results.length} target${results.length > 1 ? 's' : ''})!`
            );
            await refreshStatus(context);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to sync IDE rules: ${err.message}`);
        }
    });

    const selectIdeTargetsCmd = vscode.commands.registerCommand('tokenSaver.selectIdeTargets', async () => {
        const ideStatus = SkillInstaller.getIdeStatus();
        const items = ideStatus.map(target => ({
            label: `${target.synced ? '$(check)' : '$(circle-outline)'} ${target.name}`,
            description: target.path,
            targetId: target.id,
            picked: target.synced
        }));

        const selected = await vscode.window.showQuickPick(items, {
            canPickMany: true,
            placeHolder: 'Select AI Agent / IDE targets to synchronize RTK rules with'
        });

        if (selected) {
            const chosenIds = selected.map(s => s.targetId);
            SkillInstaller.syncRules(true, chosenIds);
            vscode.window.showInformationMessage(`⚡ Synced RTK rules for: ${selected.map(s => s.label).join(', ')}`);
            await refreshStatus(context);
        }
    });

    const checkUpdatesCmd = vscode.commands.registerCommand('tokenSaver.checkUpdates', async () => {
        await RtkUpdater.checkForUpdates(false);
    });

    const updateRtkCmd = vscode.commands.registerCommand('tokenSaver.updateRtk', async () => {
        await RtkUpdater.manualUpdate();
    });

    const installSkillsCmd = vscode.commands.registerCommand('tokenSaver.installSkills', async () => {
        try {
            const results = SkillInstaller.installAllSkills();
            const dests = results.map(r => r.destination).join(' and ');
            vscode.window.showInformationMessage(
                `🧠 Successfully installed Antigravity & AI Agent skills (/rtk-savedtokenon, /rtk-savedtokenoff, /rtk-gain, /rtk-update) to: ${dests}!`
            );
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to install skills: ${err.message}`);
        }
    });

    const syncGlobalRulesCmd = vscode.commands.registerCommand('tokenSaver.syncGlobalRules', async () => {
        try {
            SkillInstaller.syncRules(isEnabled, 'global');
            vscode.window.showInformationMessage('⚡ Global Antigravity rules synced to ~/.gemini/config/rules/');
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to sync rules: ${err.message}`);
        }
    });

    const showSavingsCmd = vscode.commands.registerCommand('tokenSaver.showSavings', async () => {
        try {
            outputChannel.clear();
            outputChannel.show(true);
            outputChannel.appendLine('Fetching RTK token savings dashboard...\n');
            const data = await RtkService.getSavingsRaw();
            outputChannel.appendLine(data);
        } catch (err) {
            RtkService.runInTerminal('rtk gain');
        }
    });

    const installCliCmd = vscode.commands.registerCommand('tokenSaver.installCli', () => {
        const isWindows = process.platform === 'win32';
        const isMac = process.platform === 'darwin';

        let installCmd;
        if (isWindows) {
            installCmd = 'winget install --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements';
        } else if (isMac) {
            installCmd = 'brew install rtk-ai/tap/rtk || curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash';
        } else {
            installCmd = 'curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash';
        }
        
        RtkService.runInTerminal(installCmd);
    });

    context.subscriptions.push(
        openDashboardCmd,
        toggleCmd,
        enableCmd,
        disableCmd,
        syncAllIdeRulesCmd,
        selectIdeTargetsCmd,
        checkUpdatesCmd,
        updateRtkCmd,
        installSkillsCmd,
        syncGlobalRulesCmd,
        showSavingsCmd,
        installCliCmd
    );
}

function deactivate() {
    if (statusBar) {
        statusBar.dispose();
    }
    if (metricsInterval) {
        clearInterval(metricsInterval);
    }
}

module.exports = {
    activate,
    deactivate
};