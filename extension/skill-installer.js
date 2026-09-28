const path = require('path');
const fs = require('fs');
const os = require('os');
const vscode = require('vscode');

const RTK_BLOCK_START = '<!-- RTK_TOKEN_SAVER_START -->';
const RTK_BLOCK_END = '<!-- RTK_TOKEN_SAVER_END -->';

const CORE_RULE_TEXT = `## RTK (Rust Token Killer) Optimization Rule
Prefix every shell/terminal execution command with \`rtk\`:
- \`rtk git status\`, \`rtk git diff\`, \`rtk git log -n 5\`
- \`rtk npm test\`, \`rtk npm run build\`, \`rtk pnpm test\`, \`rtk yarn test\`
- \`rtk cargo check\`, \`rtk cargo test\`, \`rtk cargo build\`
- \`rtk pytest\`, \`rtk vitest\`
- \`rtk ls src/\`, \`rtk tree -L 2\`, \`rtk rg "pattern"\`

Keep the prefix inside chains: \`rtk git add . && rtk git commit -m "msg"\`.
Commands RTK has no filter for run as-is, so the prefix is always safe.

### Output & Token Optimization
Command output is condensed to save 60-90% LLM context window tokens while preserving every critical signal, error, and exit code.
- \`rtk gain\` / \`rtk gain --history\` - View token savings scoreboard.
- \`rtk proxy <cmd>\` - Run a command unfiltered if raw output is strictly needed.
- \`RTK_DISABLED=1 <cmd>\` - Skip RTK for one command.`;

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
  Enable RTK (Rust Token Killer) automatic token saving mode for Antigravity IDE and AI Agents.
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
  Disable RTK (Rust Token Killer) automatic token saving mode for Antigravity IDE and AI Agents.
  Activate when the user types /rtk-savedtokenoff, "rtk off", "disable rtk", or asks to
  turn off automatic RTK command prefixing. When active, revert to normal direct command
  execution without prefixing commands with \`rtk\`.
---

# RTK Automatic Token Saver Mode (Disabled)

Execute standard shell/terminal commands directly without \`rtk\` prefixing.
`,
    'rtk-update': `---
name: rtk-update
description: >
  Manually check and update RTK (Rust Token Killer) CLI binary from upstream GitHub repository (rtk-ai/rtk).
  Activate when the user types /rtk-update, "rtk update", "update rtk", "sync rtk", or asks to
  manually update upstream GitHub RTK sync.
---

# Upstream GitHub RTK Sync & Update (/rtk-update)

Manually update and synchronize the RTK (Rust Token Killer) CLI binary with the latest upstream release from GitHub (\`rtk-ai/rtk\`).

## Execution Steps

1. **Check Local RTK Version:**
   Run \`rtk --version\` to determine the currently installed RTK binary version.

2. **Fetch Upstream Release & Update:**
   Run the platform-appropriate update command:
   - **Windows (PowerShell / Winget):**
     \`\`\`powershell
     winget upgrade --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements
     \`\`\`
     *Fallback if installed via Cargo:*
     \`\`\`powershell
     cargo install --git https://github.com/rtk-ai/rtk --force
     \`\`\`
   - **macOS:**
     \`\`\`bash
     brew upgrade rtk || (curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash)
     \`\`\`
   - **Linux / Generic Unix:**
     \`\`\`bash
     curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash
     \`\`\`

3. **Verify Installation:**
   Run \`rtk --version\` and \`rtk gain\` to confirm the binary is active, functioning, and displays the latest metrics scoreboard.
`
};

const IDE_TARGETS = [
    { id: 'antigravity_global', name: 'Antigravity IDE (Global)', type: 'global' },
    { id: 'antigravity_workspace', name: 'Antigravity IDE (Workspace)', type: 'workspace' },
    { id: 'copilot', name: 'VS Code (GitHub Copilot)', type: 'workspace' },
    { id: 'cursor', name: 'Cursor IDE (.cursorrules & .mdc)', type: 'workspace' },
    { id: 'windsurf', name: 'Windsurf IDE (.windsurfrules)', type: 'workspace' },
    { id: 'cline', name: 'Cline & Roo Code (.clinerules)', type: 'workspace' },
    { id: 'claude', name: 'Claude Code (CLAUDE.md)', type: 'workspace' },
    { id: 'agents', name: 'Universal Agent (AGENTS.md)', type: 'workspace' }
];

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

    static getWorkspaceRoot() {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders || folders.length === 0) return null;
        return folders[0].uri.fsPath;
    }

    static getWorkspaceRulePath() {
        const root = this.getWorkspaceRoot();
        if (!root) return null;
        return path.join(root, '.agents', 'rules', 'antigravity-rtk-rules.md');
    }

    static getWorkspaceSkillsPath() {
        const root = this.getWorkspaceRoot();
        if (!root) return null;
        return path.join(root, '.agents', 'skills');
    }

    /**
     * Map of target rules paths in workspace
     */
    static getTargetPaths() {
        const root = this.getWorkspaceRoot();
        const globalRule = this.getGlobalRulePath();

        return {
            antigravity_global: [globalRule],
            antigravity_workspace: root ? [path.join(root, '.agents', 'rules', 'antigravity-rtk-rules.md')] : [],
            copilot: root ? [path.join(root, '.github', 'copilot-instructions.md')] : [],
            cursor: root ? [
                path.join(root, '.cursorrules'),
                path.join(root, '.cursor', 'rules', 'rtk.mdc')
            ] : [],
            windsurf: root ? [path.join(root, '.windsurfrules')] : [],
            cline: root ? [path.join(root, '.clinerules')] : [],
            claude: root ? [path.join(root, 'CLAUDE.md')] : [],
            agents: root ? [path.join(root, 'AGENTS.md')] : []
        };
    }

    static formatWrappedRule(headerTitle = 'RTK Token Saver Rule') {
        return `${RTK_BLOCK_START}\n# ${headerTitle}\n\n${CORE_RULE_TEXT}\n${RTK_BLOCK_END}\n`;
    }

    static formatCursorMdc() {
        return `---
description: Automatically routes terminal execution commands through RTK (Rust Token Killer) to minimize context window consumption.
globs: *
alwaysApply: true
---

# RTK (Rust Token Killer) Automation

Always prefix terminal and CLI execution commands with \`rtk\` (e.g. \`rtk git status\`, \`rtk cargo test\`, \`rtk npm test\`, \`rtk pytest\`, \`rtk vitest\`, \`rtk ls\`, \`rtk rg\`).
- Output is compressed to save tokens while preserving critical errors and signal.
- In multi-command chains, prefix each sub-command: \`rtk git add . && rtk git commit -m "update"\`.
- Use \`rtk gain\` to review token savings metrics.
`;
    }

    /**
     * Safely insert, update, or remove the RTK block inside a rule file.
     */
    static safeApplyBlockToFile(filePath, contentToApply, enable = true) {
        const dir = path.dirname(filePath);
        const exists = fs.existsSync(filePath);

        if (!enable) {
            if (!exists) return { path: filePath, action: 'none' };
            let existingContent = fs.readFileSync(filePath, 'utf8');

            if (filePath.endsWith('rtk.mdc') || filePath.endsWith('antigravity-rtk-rules.md')) {
                // Standalone RTK-only files can simply be removed
                fs.unlinkSync(filePath);
                return { path: filePath, action: 'removed' };
            }

            if (existingContent.includes(RTK_BLOCK_START)) {
                const regex = new RegExp(`${RTK_BLOCK_START}[\\s\\S]*?${RTK_BLOCK_END}\\n?`, 'g');
                existingContent = existingContent.replace(regex, '').trim();

                if (existingContent.length === 0) {
                    fs.unlinkSync(filePath);
                    return { path: filePath, action: 'removed' };
                } else {
                    fs.writeFileSync(filePath, existingContent + '\n', 'utf8');
                    return { path: filePath, action: 'updated_stripped' };
                }
            }
            return { path: filePath, action: 'none' };
        }

        // Enable / Update mode
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (filePath.endsWith('rtk.mdc')) {
            fs.writeFileSync(filePath, this.formatCursorMdc(), 'utf8');
            return { path: filePath, action: 'written' };
        }

        if (filePath.endsWith('antigravity-rtk-rules.md')) {
            fs.writeFileSync(filePath, `# RTK (Rust Token Killer) Automation Rule\n\n${CORE_RULE_TEXT}\n`, 'utf8');
            return { path: filePath, action: 'written' };
        }

        if (!exists) {
            fs.writeFileSync(filePath, contentToApply, 'utf8');
            return { path: filePath, action: 'created' };
        }

        let existingContent = fs.readFileSync(filePath, 'utf8');
        if (existingContent.includes(RTK_BLOCK_START)) {
            const regex = new RegExp(`${RTK_BLOCK_START}[\\s\\S]*?${RTK_BLOCK_END}\\n?`, 'g');
            existingContent = existingContent.replace(regex, contentToApply);
        } else {
            existingContent = existingContent.trim() + '\n\n' + contentToApply;
        }

        fs.writeFileSync(filePath, existingContent, 'utf8');
        return { path: filePath, action: 'updated' };
    }

    /**
     * Synchronize rules across specified targets (e.g. 'all', 'global', 'workspace', or specific array of targets).
     */
    static syncRules(enabled = true, targetScope = 'all') {
        const results = [];
        const targetMap = this.getTargetPaths();

        let selectedTargets = [];
        if (targetScope === 'all') {
            selectedTargets = Object.keys(targetMap);
        } else if (targetScope === 'global') {
            selectedTargets = ['antigravity_global'];
        } else if (targetScope === 'workspace') {
            selectedTargets = ['antigravity_workspace', 'copilot', 'cursor', 'windsurf', 'cline', 'claude', 'agents'];
        } else if (Array.isArray(targetScope)) {
            selectedTargets = targetScope;
        } else if (typeof targetScope === 'string' && targetMap[targetScope]) {
            selectedTargets = [targetScope];
        } else {
            selectedTargets = Object.keys(targetMap);
        }

        for (const targetId of selectedTargets) {
            const filePaths = targetMap[targetId] || [];
            for (const filePath of filePaths) {
                try {
                    const blockContent = this.formatWrappedRule(`RTK Token Saver Rule (${targetId})`);
                    const result = this.safeApplyBlockToFile(filePath, blockContent, enabled);
                    results.push({ target: targetId, ...result });
                } catch (err) {
                    console.error(`Failed to sync rule for ${targetId} at ${filePath}:`, err);
                }
            }
        }

        return results;
    }

    /**
     * Install skills for Antigravity / Agentic systems
     */
    static installSkills(targetScope = 'all') {
        if (targetScope === 'all') {
            return this.installAllSkills();
        }

        const installed = [];
        const baseDir = targetScope === 'workspace' 
            ? this.getWorkspaceSkillsPath() 
            : this.getGlobalSkillsPath();

        if (!baseDir) {
            throw new Error('No target directory available for scope: ' + targetScope);
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

        return [{
            scope: targetScope,
            destination: baseDir,
            installedSkills: installed
        }];
    }

    /**
     * Install skills across all available scopes (both global ~/.gemini/config/skills and workspace .agents/skills)
     */
    static installAllSkills() {
        const results = [];
        
        // 1. Global Antigravity Config
        try {
            const globalDir = this.getGlobalSkillsPath();
            if (globalDir) {
                const installed = [];
                for (const [skillName, skillContent] of Object.entries(SKILLS_MAP)) {
                    const skillFolder = path.join(globalDir, skillName);
                    if (!fs.existsSync(skillFolder)) {
                        fs.mkdirSync(skillFolder, { recursive: true });
                    }
                    const skillFilePath = path.join(skillFolder, 'SKILL.md');
                    fs.writeFileSync(skillFilePath, skillContent, 'utf8');
                    installed.push(skillName);
                }
                results.push({
                    scope: 'global',
                    destination: globalDir,
                    installedSkills: installed
                });
            }
        } catch (err) {
            console.warn('Failed to install global skills:', err);
        }

        // 2. Workspace Config (.agents/skills)
        const wsDir = this.getWorkspaceSkillsPath();
        if (wsDir) {
            try {
                const installed = [];
                for (const [skillName, skillContent] of Object.entries(SKILLS_MAP)) {
                    const skillFolder = path.join(wsDir, skillName);
                    if (!fs.existsSync(skillFolder)) {
                        fs.mkdirSync(skillFolder, { recursive: true });
                    }
                    const skillFilePath = path.join(skillFolder, 'SKILL.md');
                    fs.writeFileSync(skillFilePath, skillContent, 'utf8');
                    installed.push(skillName);
                }
                results.push({
                    scope: 'workspace',
                    destination: wsDir,
                    installedSkills: installed
                });
            } catch (err) {
                console.warn('Failed to install workspace skills:', err);
            }
        }

        return results;
    }

    static checkSkillsInstalled(targetScope = 'all') {
        if (targetScope === 'all') {
            const globalOk = this.checkSkillsInstalled('global');
            const wsRoot = this.getWorkspaceRoot();
            if (wsRoot) {
                const wsOk = this.checkSkillsInstalled('workspace');
                return globalOk || wsOk;
            }
            return globalOk;
        }

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

    /**
     * Get detailed status of all supported IDE targets
     */
    static getIdeStatus() {
        const targetMap = this.getTargetPaths();
        const root = this.getWorkspaceRoot();

        return IDE_TARGETS.map(target => {
            const filePaths = targetMap[target.id] || [];
            let isSynced = false;
            let fileFound = null;

            for (const fp of filePaths) {
                if (fs.existsSync(fp)) {
                    const content = fs.readFileSync(fp, 'utf8');
                    if (content.includes('rtk') || content.includes(RTK_BLOCK_START)) {
                        isSynced = true;
                        fileFound = fp;
                        break;
                    }
                }
            }

            return {
                id: target.id,
                name: target.name,
                type: target.type,
                synced: isSynced,
                path: fileFound || (filePaths[0] || 'N/A'),
                available: target.type === 'global' || Boolean(root)
            };
        });
    }
}

module.exports = SkillInstaller;
