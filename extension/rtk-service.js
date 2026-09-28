const { exec, spawn } = require('child_process');
const vscode = require('vscode');

class RtkService {
    static checkInstalled() {
        return new Promise((resolve) => {
            exec('rtk --version', (error, stdout) => {
                if (error) {
                    resolve({ installed: false, version: null });
                } else {
                    resolve({ installed: true, version: stdout.trim() });
                }
            });
        });
    }

    static getSavings() {
        return new Promise((resolve, reject) => {
            exec('rtk gain', (error, stdout, stderr) => {
                if (error) {
                    reject(error || stderr);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    static runInTerminal(command = 'rtk gain') {
        const terminalName = 'Token Saver (RTK)';
        let terminal = vscode.window.terminals.find(t => t.name === terminalName);
        if (!terminal) {
            terminal = vscode.window.createTerminal(terminalName);
        }
        terminal.show();
        terminal.sendText(command);
    }
}

module.exports = RtkService;