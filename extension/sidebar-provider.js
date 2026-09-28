const vscode = require('vscode');
const WebviewHelper = require('./webview-helper');

class SidebarProvider {
    static viewType = 'tokenSaver.sidebarView';

    constructor(extensionUri, context) {
        this.extensionUri = extensionUri;
        this.context = context;
        this._view = undefined;
    }

    resolveWebviewView(webviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.extensionUri, 'extension', 'webview')
            ]
        };

        webviewView.webview.html = WebviewHelper.getHtml(this.extensionUri, webviewView.webview);

        webviewView.onDidChangeVisibility(() => {
            if (webviewView.visible) {
                this.sendLatestData();
            }
        });

        webviewView.webview.onDidReceiveMessage(async (message) => {
            await WebviewHelper.handleMessage(
                message,
                webviewView.webview,
                this.context,
                true,
                () => this.sendLatestData()
            );
        });
    }

    async sendLatestData() {
        if (!this._view) return;
        const data = await WebviewHelper.getLatestStateData(this.context, true);
        this._view.webview.postMessage({ type: 'stateUpdate', data });
    }
}

module.exports = SidebarProvider;

