const https = require('https');
const vscode = require('vscode');
const RtkService = require('./rtk-service');

class RtkUpdater {
    static getLatestRelease() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.github.com',
                path: '/repos/rtk-ai/rtk/releases/latest',
                method: 'GET',
                headers: {
                    'User-Agent': 'TokenSaver-Antigravity-IDE-Extension'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const release = JSON.parse(data);
                            resolve({
                                success: true,
                                tag: release.tag_name,
                                name: release.name || release.tag_name,
                                body: release.body || '',
                                htmlUrl: release.html_url,
                                publishedAt: release.published_at
                            });
                        } catch (e) {
                            reject(new Error('Failed to parse GitHub release data'));
                        }
                    } else if (res.statusCode === 403) {
                        resolve({
                            success: false,
                            error: 'GitHub API rate limit exceeded. Please try again later.'
                        });
                    } else {
                        resolve({
                            success: false,
                            error: `GitHub API returned status ${res.statusCode}`
                        });
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.setTimeout(8000, () => {
                req.destroy();
                resolve({ success: false, error: 'GitHub update check timed out' });
            });

            req.end();
        });
    }

    static isNewer(latestStr, currentStr) {
        const clean = s => (s || '').replace(/^[^\d]*/, '').trim();
        const latest = clean(latestStr);
        const current = clean(currentStr);
        if (!latest || !current) return false;
        return latest.localeCompare(current, undefined, { numeric: true, sensitivity: 'base' }) > 0;
    }


    static async checkForUpdates(silent = false) {
        try {
            const check = await RtkService.checkInstalled();
            const release = await this.getLatestRelease();

            if (!release.success) {
                if (!silent) {
                    vscode.window.showWarningMessage(`RTK Update Check: ${release.error}`);
                }
                return { hasUpdate: false, release: null, currentVersion: check.version };
            }

            const hasUpdate = check.installed && this.isNewer(release.tag, check.version);

            if (hasUpdate) {
                const choice = await vscode.window.showInformationMessage(
                    `🚀 A new RTK release is available: ${release.tag} (Installed: ${check.version || 'unknown'})`,
                    'Update Now',
                    'Release Notes'
                );

                if (choice === 'Update Now') {
                    this.performUpdate();
                } else if (choice === 'Release Notes') {
                    vscode.env.openExternal(vscode.Uri.parse(release.htmlUrl));
                }
            } else if (!silent) {
                if (!check.installed) {
                    vscode.window.showWarningMessage(
                        'RTK is not currently installed on this system.',
                        'Install RTK'
                    ).then(c => {
                        if (c === 'Install RTK') {
                            vscode.commands.executeCommand('tokenSaver.installCli');
                        }
                    });
                } else {
                    vscode.window.showInformationMessage(
                        `✨ RTK is already up to date! (Current version: ${check.version})`
                    );
                }
            }

            return {
                hasUpdate,
                release,
                currentVersion: check.version,
                installed: check.installed
            };
        } catch (e) {
            if (!silent) {
                vscode.window.showErrorMessage(`RTK update check failed: ${e.message}`);
            }
            return { hasUpdate: false, error: e.message };
        }
    }

    static performUpdate() {
        const isWindows = process.platform === 'win32';
        const isMac = process.platform === 'darwin';

        let updateCmd;
        if (isWindows) {
            updateCmd = 'winget upgrade --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements';
        } else if (isMac) {
            updateCmd = 'brew upgrade rtk || (curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash)';
        } else {
            updateCmd = 'curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash';
        }

        RtkService.runInTerminal(updateCmd);
    }

    static async manualUpdate() {
        vscode.window.showInformationMessage('🔄 Checking and syncing RTK with upstream GitHub (rtk-ai/rtk)...');
        return this.checkForUpdates(false);
    }
}

module.exports = RtkUpdater;
