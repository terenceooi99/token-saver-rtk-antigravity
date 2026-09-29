const https = require('https');
const vscode = require('vscode');
const RtkService = require('./rtk-service');
const SkillInstaller = require('./skill-installer');

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

        // Fallback to main branch commit for repository tracking (e.g. prompt/rules repos)
        const commitRes = await this.fetchGitHubJson(`/repos/${repo}/commits/main`);
        if (commitRes.success && commitRes.data) {
            const shortSha = (commitRes.data.sha || '').substring(0, 7);
            return {
                success: true,
                tag: `main@${shortSha}`,
                name: `main (${shortSha})`,
                body: commitRes.data.commit ? commitRes.data.commit.message : '',
                htmlUrl: `https://github.com/${repo}`,
                publishedAt: commitRes.data.commit && commitRes.data.commit.author ? commitRes.data.commit.author.date : null
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
            const [rtkCheck, headroomCheck, ponytailCheck, rtkRelease, headroomRelease, ponytailRelease] = await Promise.all([
                RtkService.checkInstalled(),
                RtkService.checkHeadroomInstalled(),
                RtkService.checkPonytailInstalled(),
                this.getLatestRelease('rtk-ai/rtk'),
                this.getLatestRelease('headroomlabs-ai/headroom'),
                this.getLatestRelease('DietrichGebert/ponytail')
            ]);

            const rtkHasUpdate = rtkRelease.success && rtkCheck.installed && this.isNewer(rtkRelease.tag, rtkCheck.version);
            const headroomHasUpdate = headroomRelease.success && headroomCheck.installed && this.isNewer(headroomRelease.tag, headroomCheck.version);
            const ponytailHasUpdate = ponytailRelease.success && (!ponytailCheck.installed || (ponytailCheck.skillsCount && ponytailCheck.skillsCount < 6));
            const hasAnyUpdate = rtkHasUpdate || headroomHasUpdate || ponytailHasUpdate;

            if (hasAnyUpdate) {
                const updatesList = [];
                if (rtkHasUpdate) updatesList.push(`RTK ${rtkRelease.tag}`);
                if (headroomHasUpdate) updatesList.push(`Headroom ${headroomRelease.tag}`);
                if (ponytailHasUpdate) updatesList.push(`Ponytail (${ponytailRelease.tag || 'Latest'})`);

                const choice = await vscode.window.showInformationMessage(
                    `🚀 Upstream updates available: ${updatesList.join(' & ')}`,
                    'Update / Sync All',
                    'Sync Ponytail GitHub',
                    'Update RTK',
                    'Update Headroom',
                    'Release Notes'
                );

                if (choice === 'Update / Sync All') {
                    this.performAllUpdates();
                } else if (choice === 'Sync Ponytail GitHub') {
                    await this.performPonytailSync();
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
                    if (ponytailRelease.htmlUrl) {
                        vscode.env.openExternal(vscode.Uri.parse(ponytailRelease.htmlUrl));
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
                if (ponytailCheck.installed) {
                    parts.push(`Ponytail: Active (${ponytailCheck.skillsCount || 6}/6 skills)`);
                } else {
                    parts.push('Ponytail: Not synced');
                }

                vscode.window.showInformationMessage(
                    `✨ Upstream GitHub Sync Status: ${parts.join(' | ')}`,
                    'Sync Ponytail GitHub',
                    'Install/Update CLI Tools'
                ).then(c => {
                    if (c === 'Sync Ponytail GitHub') {
                        this.performPonytailSync();
                    } else if (c === 'Install/Update CLI Tools') {
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
                },
                ponytail: {
                    hasUpdate: ponytailHasUpdate,
                    release: ponytailRelease,
                    installed: ponytailCheck.installed,
                    currentVersion: ponytailCheck.version || 'v1.0.0',
                    skillsCount: ponytailCheck.skillsCount || 0
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

    static async performPonytailSync() {
        try {
            vscode.window.showInformationMessage('🔄 Fetching & synchronizing Ponytail from GitHub (DietrichGebert/ponytail)...');
            const results = SkillInstaller.installAllSkills();
            const config = vscode.workspace.getConfiguration('tokenSaver');
            const isEnabled = config.get('enableOnStartup', true);
            const scope = config.get('targetScope', 'all');
            SkillInstaller.syncRules(isEnabled, scope);

            const dests = results.map(r => r.destination).join(' and ');
            vscode.window.showInformationMessage(
                `🥋 Successfully fetched and synchronized Ponytail YAGNI suite (/ponytail, /ponytail-audit, /ponytail-debt, /ponytail-gain, /ponytail-help, /ponytail-review) from GitHub to global IDE: ${dests}!`
            );
            return { success: true, results };
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to sync Ponytail from GitHub: ${err.message}`);
            return { success: false, error: err.message };
        }
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
        this.performPonytailSync();
    }

    static async manualUpdate() {
        vscode.window.showInformationMessage('🔄 Checking & syncing upstream GitHub repositories (rtk-ai/rtk, headroomlabs-ai/headroom & DietrichGebert/ponytail)...');
        return this.checkForUpdates(false);
    }
}

module.exports = RtkUpdater;

