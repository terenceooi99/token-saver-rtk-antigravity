const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const StatusBarManager = require('./statusbar');
const RtkService = require('./rtk-service');

const RULE_CONTENT = `# RTK (Rust Token Killer) Automation Rule for Antigravity IDE

Prefix every shell command with \`rtk\`: \`rtk git status\`, \`rtk cargo test\`, \`rtk npm run build\`, \`rtk ls src/\`. Keep the prefix inside chains: \`rtk git add . && rtk git commit -m "msg"\`. Commands RTK has no filter for run as-is, so the prefix is always safe.

## Command output
Command output here is condensed to save tokens, keeping every signal and dropping costly noise. Treat it as the complete result: run commands normally, and batch related commands into one call to avoid extra turns. Truncated results state their recovery path in their own output. Re-run a command as \`rtk proxy <cmd>\` only when its result is unusable: empty when output was clearly expected, contradicting its exit code, or garbled.

## About RTK
RTK (Rust Token Killer) is a high-performance CLI proxy that filters command output to save tokens; behavior and exit code are unchanged.

- \`rtk gain\` / \`rtk gain --history\` - token savings, overall and per command.
- \`rtk proxy <cmd>\` - run a command unfiltered, still tracked.
- \`RTK_DISABLED=1 <cmd>\` - skip RTK for one command.
- \`rtk discover\` - find past commands RTK could have condensed.
`;

let statusBar;
let outputChannel;

function getRulePath() {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) return null;
    return path.join(folders[0].uri.fsPath, '.agents', 'rules', 'antigravity-rtk-rules.md');
}

async function syncRuleFile(enabled) {
    const rulePath = getRulePath();
    if (!rulePath) return;

    const dir = path.dirname(rulePath);
    try {
        if (enabled) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(rulePath, RULE_CONTENT, 'utf8');
        } else {
            if (fs.existsSync(rulePath)) {
                fs.unlinkSync(rulePath);
            }
        }
    } catch (e) {
        console.error('Failed to sync rule file:', e);
    }
}

async function activate(context) {
    outputChannel = vscode.window.createOutputChannel('Token Saver (RTK)');
    statusBar = new StatusBarManager();
    context.subscriptions.push(statusBar);
    context.subscriptions.push(outputChannel);

    const config = vscode.workspace.getConfiguration('tokenSaver');
    let isEnabled = context.globalState.get('tokenSaver.enabled', config.get('enableOnStartup', true));

    const check = await RtkService.checkInstalled();
    if (!check.installed) {
        vscode.window.showWarningMessage(
            'RTK binary is not detected on PATH. Token Saver requires RTK (Rust Token Killer) CLI.',
            'Install RTK via winget/brew',
            'View Guide'
        ).then(choice => {
            if (choice === 'Install RTK via winget/brew') {
                vscode.commands.executeCommand('tokenSaver.installCli');
            } else if (choice === 'View Guide') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/rtk-ai/rtk'));
            }
        });
    }

    statusBar.update(isEnabled, check.version);
    await syncRuleFile(isEnabled);

    const toggleCmd = vscode.commands.registerCommand('tokenSaver.toggle', async () => {
        isEnabled = !isEnabled;
        await context.globalState.update('tokenSaver.enabled', isEnabled);
        statusBar.update(isEnabled, check.version);
        await syncRuleFile(isEnabled);

        if (isEnabled) {
            vscode.window.showInformationMessage('⚡ Token Saver (RTK) is now ENABLED for Antigravity IDE.');
        } else {
            vscode.window.showInformationMessage('⚪ Token Saver (RTK) is now DISABLED.');
        }
    });

    const enableCmd = vscode.commands.registerCommand('tokenSaver.enable', async () => {
        isEnabled = true;
        await context.globalState.update('tokenSaver.enabled', true);
        statusBar.update(true, check.version);
        await syncRuleFile(true);
        vscode.window.showInformationMessage('⚡ Token Saver (RTK) ENABLED.');
    });

    const disableCmd = vscode.commands.registerCommand('tokenSaver.disable', async () => {
        isEnabled = false;
        await context.globalState.update('tokenSaver.enabled', false);
        statusBar.update(false, check.version);
        await syncRuleFile(false);
        vscode.window.showInformationMessage('⚪ Token Saver (RTK) DISABLED.');
    });

    const showSavingsCmd = vscode.commands.registerCommand('tokenSaver.showSavings', async () => {
        try {
            outputChannel.clear();
            outputChannel.show(true);
            outputChannel.appendLine('Fetching RTK token savings dashboard...\n');
            const data = await RtkService.getSavings();
            outputChannel.appendLine(data);
        } catch (err) {
            RtkService.runInTerminal('rtk gain');
        }
    });

    const installCliCmd = vscode.commands.registerCommand('tokenSaver.installCli', () => {
        const isWindows = process.platform === 'win32';
        const installCmd = isWindows 
            ? 'winget install --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements'
            : 'brew install rtk-ai/tap/rtk || curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash';
        
        RtkService.runInTerminal(installCmd);
    });

    context.subscriptions.push(toggleCmd, enableCmd, disableCmd, showSavingsCmd, installCliCmd);
}

function deactivate() {
    if (statusBar) {
        statusBar.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};