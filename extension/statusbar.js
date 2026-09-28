const vscode = require('vscode');

class StatusBarManager {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'tokenSaver.openDashboard';
    }

    update(isEnabled, version = null, metrics = null) {
        const config = vscode.workspace.getConfiguration('tokenSaver');
        const displayStyle = config.get('statusMetricDisplay', 'compact');

        if (isEnabled) {
            if (metrics && metrics.totalSavedTokens > 0 && displayStyle !== 'iconOnly') {
                this.statusBarItem.text = `$(zap) RTK: ${metrics.totalSavedFormatted} saved (${metrics.savedPercentage}%)`;
            } else {
                this.statusBarItem.text = `$(zap) RTK: ON`;
            }

            const tooltipLines = [
                `⚡ **Token Saver (RTK) is ENABLED**`,
                `---`,
                `• **Total Saved**: ${metrics ? metrics.totalSavedFormatted : '0'} tokens (${metrics ? metrics.savedPercentage : 0}%)`,
                `• **Estimated Cost Saved**: ${metrics ? metrics.estimatedDollarSavings : '$0.00'}`,
                `• **RTK Version**: ${version || 'Detected'}`,
                `---`,
                `👉 *Click to open Interactive Dashboard*`
            ];

            const mdTooltip = new vscode.MarkdownString(tooltipLines.join('\n\n'));
            mdTooltip.isTrusted = true;
            this.statusBarItem.tooltip = mdTooltip;
            this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.prominentForeground');
        } else {
            this.statusBarItem.text = `$(circle-slash) RTK: OFF`;
            const tooltipLines = [
                `⚪ **Token Saver (RTK) is DISABLED**`,
                `---`,
                `Commands are currently executed directly without compression.`,
                `---`,
                `👉 *Click to open Interactive Dashboard & Enable*`
            ];
            const mdTooltip = new vscode.MarkdownString(tooltipLines.join('\n\n'));
            mdTooltip.isTrusted = true;
            this.statusBarItem.tooltip = mdTooltip;
            this.statusBarItem.color = undefined;
        }

        this.statusBarItem.show();
    }

    dispose() {
        this.statusBarItem.dispose();
    }
}

module.exports = StatusBarManager;