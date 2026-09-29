const https = require('https');
const vscode = require('vscode');
const RtkService = require('./rtk-service');

class RtkUpdater {
    static fetchGitHubJson(repoPath) {
        return new Promise((resolve) => {
            const options = {
                hostname: 'api.github.com',
                path: repoPath,
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
                            const parsed = JSON.parse(data);
                            resolve({ success: true, data: parsed });
                        } catch (e) {
                            resolve({ success: false, error: 'Failed to parse JSON response' });
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
                resolve({ success: false, error: err.message });
            });

            req.setTimeout(8000, () => {
                req.destroy();
                resolve({ success: false, error: 'GitHub request timed out' });
            });

            req.end();
        });
    }

    static async getLatestRelease(repo = 'rtk-ai/rtk') {
        const res = await this.fetchGitHubJson(`/repos/${repo}/releases/latest`);
        if (res.success && res.data) {
            const release = res.data;
            return {
                success: true,
                tag: release.tag_name,
                name: release.name || release.tag_name,
                body: release.body || '',
                htmlUrl: release.html_url,
                publishedAt: release.published_at
            };
        }

        // Fallback to tags if latest release is not published as formal release
        const tagsRes = await this.fetchGitHubJson(`/repos/${repo}/tags`);
        if (tagsRes.success && Array.isArray(tagsRes.data) && tagsRes.data.length > 0) {
            const tag = tagsRes.data[0];
            return {
                success: true,
                tag: tag.name,
                name: tag.name,
                body: '',
                htmlUrl: `https://github.com/${repo}/releases/tag/${tag.name}`,
                publishedAt: null
            };
        }

        return {
            success: false,
            error: res.error || 'No release tags found'
        };
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
            const [rtkCheck, headroomCheck, rtkRelease, headroomRelease] = await Promise.all([
                RtkService.checkInstalled(),
                RtkService.checkHeadroomInstalled(),
                this.getLatestRelease('rtk-ai/rtk'),
                this.getLatestRelease('headroomlabs-ai/headroom')
            ]);

            const rtkHasUpdate = rtkRelease.success && rtkCheck.installed && this.isNewer(rtkRelease.tag, rtkCheck.version);
            const headroomHasUpdate = headroomRelease.success && headroomCheck.installed && this.isNewer(headroomRelease.tag, headroomCheck.version);
            const hasAnyUpdate = rtkHasUpdate || headroomHasUpdate;

            if (hasAnyUpdate) {
                const updatesList = [];
                if (rtkHasUpdate) updatesList.push(`RTK ${rtkRelease.tag}`);
                if (headroomHasUpdate) updatesList.push(`Headroom ${headroomRelease.tag}`);

                const choice = await vscode.window.showInformationMessage(
                    `🚀 Upstream updates available: ${updatesList.join(' & ')}`,
                    'Update All Now',
                    'Update RTK',
                    'Update Headroom',
                    'Release Notes'
                );

                if (choice === 'Update All Now') {
                    this.performAllUpdates();
                } else if (choice === 'Update RTK') {
                    this.performUpdate();
                } else if (choice === 'Update Headroom') {
                    this.performHeadroomUpdate();
                } else if (choice === 'Release Notes') {
                    if (rtkHasUpdate && rtkRelease.htmlUrl) {
                        vscode.env.openExternal(vscode.Uri.parse(rtkRelease.htmlUrl));
                    }
                    if (headroomHasUpdate && headroomRelease.htmlUrl) {
                        vscode.env.openExternal(vscode.Uri.parse(headroomRelease.htmlUrl));
                    }
                }
            } else if (!silent) {
                const parts = [];
                if (rtkCheck.installed) {
                    parts.push(`RTK: ${rtkCheck.version} (Latest: ${rtkRelease.tag || 'up-to-date'})`);
                } else {
                    parts.push('RTK: Not installed');
                }
                if (headroomCheck.installed) {
                    parts.push(`Headroom: ${headroomCheck.version} (Latest: ${headroomRelease.tag || 'up-to-date'})`);
                } else {
                    parts.push('Headroom: Not installed');
                }

                vscode.window.showInformationMessage(
                    `✨ Upstream GitHub Sync Status: ${parts.join(' | ')}`,
                    'Install/Update CLI Tools'
                ).then(c => {
                    if (c === 'Install/Update CLI Tools') {
                        this.performAllUpdates();
                    }
                });
            }

            return {
                hasUpdate: hasAnyUpdate,
                rtk: {
                    hasUpdate: rtkHasUpdate,
                    release: rtkRelease,
                    installed: rtkCheck.installed,
                    currentVersion: rtkCheck.version
                },
                headroom: {
                    hasUpdate: headroomHasUpdate,
                    release: headroomRelease,
                    installed: headroomCheck.installed,
                    currentVersion: headroomCheck.version
                }
            };
        } catch (e) {
            if (!silent) {
                vscode.window.showErrorMessage(`Upstream GitHub update check failed: ${e.message}`);
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

    static performHeadroomUpdate() {
        const cmd = 'pip install --upgrade "headroom-ai[all]" || pipx upgrade headroom-ai || pip install --upgrade headroom-ai';
        RtkService.runInTerminal(cmd);
    }

    static performAllUpdates() {
        const isWindows = process.platform === 'win32';
        const isMac = process.platform === 'darwin';

        let rtkCmd;
        if (isWindows) {
            rtkCmd = 'winget upgrade --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements';
        } else if (isMac) {
            rtkCmd = 'brew upgrade rtk || (curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash)';
        } else {
            rtkCmd = 'curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash';
        }

        const fullCmd = `${rtkCmd} ; pip install --upgrade "headroom-ai[all]"`;
        RtkService.runInTerminal(fullCmd);
    }

    static async manualUpdate() {
        vscode.window.showInformationMessage('🔄 Checking & syncing upstream GitHub repositories (rtk-ai/rtk & headroomlabs-ai/headroom)...');
        return this.checkForUpdates(false);
    }
}

module.exports = RtkUpdater;

