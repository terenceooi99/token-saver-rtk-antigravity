const vscode = require('vscode');

class StatusBarManager {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'tokenSaver.toggle';
    }

    update(isEnabled, version = null) {
        if (isEnabled) {
            this.statusBarItem.text = `$(zap) RTK: ON`;
            this.statusBarItem.tooltip = `Token Saver (RTK) is ENABLED.\nOutput is compressed to save LLM tokens.\nClick to toggle OFF.${version ? `\nVersion: ${version}` : ''}`;
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.prominentForeground');
        } else {
            this.statusBarItem.text = `$(circle-slash) RTK: OFF`;
            this.statusBarItem.tooltip = `Token Saver (RTK) is DISABLED.\nCommands run directly.\nClick to toggle ON.`;
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.color = undefined;
        }
        this.statusBarItem.show();
    }

    dispose() {
        this.statusBarItem.dispose();
    }
}

module.exports = StatusBarManager;