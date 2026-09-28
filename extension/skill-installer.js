const path = require('path');
const fs = require('fs');
const os = require('os');
const vscode = require('vscode');

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

const SKILLS_MAP = {
    'rtk-gain': `---
name: rtk-gain
description: >
  Display the RTK (Rust Token Killer) token savings scoreboard and metrics dashboard.
  Activate when the user types /rtk-gain, "rtk gain", "rtk stats", or asks to see
  how many tokens RTK has saved.
---

# RTK Token Savings Scoreboard

Run \`rtk gain\` (or \`rtk gain --history\`) via terminal command and display the live token savings metrics, efficiency meter, and breakdown by command to the user.
`,
    'rtk-savedtokenon': `---
name: rtk-savedtokenon
description: >
  Enable RTK (Rust Token Killer) automatic token saving mode for Antigravity IDE.
  Activate when the user types /rtk-savedtokenon, "rtk on", "enable rtk", or asks to
  automate RTK token saving for all terminal actions. When active, all shell/terminal commands
  executed by the assistant (git, cargo, npm, pnpm, vitest, pytest, ls, rg, tree, diff, etc.)
  MUST be automatically prefixed with \`rtk \` until /rtk-savedtokenoff is invoked.
---

# RTK Automatic Token Saver Mode (Enabled)

All shell/terminal execution commands must be prefixed with \`rtk \` to save LLM tokens.
`,
    'rtk-savedtokenoff': `---
name: rtk-savedtokenoff
description: >
  Disable RTK (Rust Token Killer) automatic token saving mode for Antigravity IDE.
  Activate when the user types /rtk-savedtokenoff, "rtk off", "disable rtk", or asks to
  turn off automatic RTK command prefixing. When active, revert to normal direct command
  execution without prefixing commands with \`rtk\`.
---

# RTK Automatic Token Saver Mode (Disabled)

Execute standard shell/terminal commands directly without \`rtk\` prefixing.
`
};

class SkillInstaller {
    static getGlobalConfigPath() {
        const homeDir = os.homedir();
        return path.join(homeDir, '.gemini', 'config');
    }

    static getGlobalRulePath() {
        return path.join(this.getGlobalConfigPath(), 'rules', 'antigravity-rtk-rules.md');
    }

    static getGlobalSkillsPath() {
        return path.join(this.getGlobalConfigPath(), 'skills');
    }

    static getWorkspaceRulePath() {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders || folders.length === 0) return null;
        return path.join(folders[0].uri.fsPath, '.agents', 'rules', 'antigravity-rtk-rules.md');
    }

    static getWorkspaceSkillsPath() {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders || folders.length === 0) return null;
        return path.join(folders[0].uri.fsPath, '.agents', 'skills');
    }

    static installSkills(targetScope = 'global') {
        const installed = [];
        const baseDir = targetScope === 'workspace' 
            ? this.getWorkspaceSkillsPath() 
            : this.getGlobalSkillsPath();

        if (!baseDir) {
            throw new Error('No target workspace available for workspace installation.');
        }

        for (const [skillName, skillContent] of Object.entries(SKILLS_MAP)) {
            const skillFolder = path.join(baseDir, skillName);
            if (!fs.existsSync(skillFolder)) {
                fs.mkdirSync(skillFolder, { recursive: true });
            }
            const skillFilePath = path.join(skillFolder, 'SKILL.md');
            fs.writeFileSync(skillFilePath, skillContent, 'utf8');
            installed.push(skillName);
        }

        return {
            scope: targetScope,
            destination: baseDir,
            installedSkills: installed
        };
    }

    static syncRules(enabled = true, targetScope = 'global') {
        const results = [];

        // Global Rule Sync
        if (targetScope === 'global' || targetScope === 'all') {
            const globalRulePath = this.getGlobalRulePath();
            const globalDir = path.dirname(globalRulePath);
            try {
                if (enabled) {
                    if (!fs.existsSync(globalDir)) {
                        fs.mkdirSync(globalDir, { recursive: true });
                    }
                    fs.writeFileSync(globalRulePath, RULE_CONTENT, 'utf8');
                    results.push({ path: globalRulePath, action: 'written' });
                } else {
                    if (fs.existsSync(globalRulePath)) {
                        fs.unlinkSync(globalRulePath);
                        results.push({ path: globalRulePath, action: 'removed' });
                    }
                }
            } catch (err) {
                console.error('Failed to sync global rule:', err);
            }
        }

        // Workspace Rule Sync
        if (targetScope === 'workspace' || targetScope === 'all') {
            const wsRulePath = this.getWorkspaceRulePath();
            if (wsRulePath) {
                const wsDir = path.dirname(wsRulePath);
                try {
                    if (enabled) {
                        if (!fs.existsSync(wsDir)) {
                            fs.mkdirSync(wsDir, { recursive: true });
                        }
                        fs.writeFileSync(wsRulePath, RULE_CONTENT, 'utf8');
                        results.push({ path: wsRulePath, action: 'written' });
                    } else {
                        if (fs.existsSync(wsRulePath)) {
                            fs.unlinkSync(wsRulePath);
                            results.push({ path: wsRulePath, action: 'removed' });
                        }
                    }
                } catch (err) {
                    console.error('Failed to sync workspace rule:', err);
                }
            }
        }

        return results;
    }

    static checkSkillsInstalled(targetScope = 'global') {
        const baseDir = targetScope === 'workspace' 
            ? this.getWorkspaceSkillsPath() 
            : this.getGlobalSkillsPath();

        if (!baseDir || !fs.existsSync(baseDir)) {
            return false;
        }

        return Object.keys(SKILLS_MAP).every(skill => {
            const skillFile = path.join(baseDir, skill, 'SKILL.md');
            return fs.existsSync(skillFile);
        });
    }
}

module.exports = SkillInstaller;
