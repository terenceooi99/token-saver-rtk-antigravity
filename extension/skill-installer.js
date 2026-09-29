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
  Manually check and update upstream GitHub repositories (rtk-ai/rtk and headroomlabs-ai/headroom).
  Activate when the user types /rtk-update, /headroom-sync, "update upstream", "sync rtk", or asks to
  synchronize upstream tools.
---

# Upstream GitHub Sync & Update (/rtk-update)

Manually update and synchronize the dual upstream token saver engines:
1. **RTK (Rust Token Killer):** CLI binary from GitHub (\`rtk-ai/rtk\`)
2. **Headroom:** Context compression engine from GitHub (\`headroomlabs-ai/headroom\`)

## Execution Steps

1. **Check Local Engine Versions:**
   - Run \`rtk --version\` to check the installed RTK binary version.
   - Run \`headroom --version\` (or \`python -m headroom --version\`) to check Headroom.

2. **Fetch Upstream Release & Update:**
   - **RTK (CLI):**
     - *Windows:* \`winget upgrade --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements\`
     - *macOS:* \`brew upgrade rtk || (curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash)\`
     - *Linux:* \`curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash\`
   - **Headroom (Context Compression Layer):**
     - \`pip install --upgrade "headroom-ai[all]"\` or \`pipx upgrade headroom-ai\`

3. **Verify Installation:**
   - Run \`rtk --version\` and \`rtk gain\` for CLI compression.
   - Run \`headroom --version\` for context compression.
`,
    'ponytail': `---
name: ponytail
description: >
  Forces the laziest solution that actually works, simplest, shortest, most
  minimal. Channels a senior dev who has seen everything: question whether the
  task needs to exist at all (YAGNI), reach for the standard library before
  custom code, native platform features before dependencies, one line before
  fifty. Supports intensity levels: lite, full (default), ultra. Use on ANY
  coding task: writing, adding, refactoring, fixing, reviewing, or designing
  code, and choosing libraries or dependencies. Also use whenever the user
  says "ponytail", "be lazy", "lazy mode", "simplest solution", "minimal
  solution", "yagni", "do less", or "shortest path", or complains about
  over-engineering, bloat, boilerplate, or unnecessary dependencies. Do NOT
  use for non-coding requests (general knowledge, prose, translation,
  summaries, recipes).
argument-hint: "[lite|full|ultra|off]"
license: MIT
---

# Ponytail

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

## The Ladder
1. **Does this need to exist at all?** Speculative need = skip it (YAGNI).
2. **Already in this codebase?** Reuse existing helpers/types.
3. **Stdlib does it?** Use it.
4. **Native platform covers it?** Native features over packages.
5. **Already-installed dependency solves it?** Never add a new one for what a few lines can do.
6. **Can it be one line?** One line.
7. **Only then:** the minimum code that works. Shortest working diff wins.

## Output
Code first. At most 3 short lines: what was skipped, when to add it. No essays, no feature tours, no design notes.
`,
    'ponytail-audit': `---
name: ponytail-audit
description: >
  Whole-repo audit for over-engineering. Like ponytail-review, but scans the
  entire codebase instead of a diff: a ranked list of what to delete, simplify,
  or replace with stdlib/native equivalents. Use when the user says "audit this
  codebase", "audit for over-engineering", "what can I delete from this repo",
  "find bloat", "ponytail-audit", or "/ponytail-audit". One-shot report, does
  not apply fixes.
---

ponytail-review, repo-wide. Scan the whole tree instead of a diff. Rank
findings biggest cut first.

## Tags
- \`delete:\` dead code, unused flexibility, speculative feature. Replacement: nothing.
- \`stdlib:\` hand-rolled thing the standard library ships. Name the function.
- \`native:\` dependency or code doing what the platform already does. Name the feature.
- \`yagni:\` abstraction with one implementation, config nobody sets, layer with one caller.
- \`shrink:\` same logic, fewer lines. Show the shorter form.

## Output
One line per finding, ranked: \`<tag> <what to cut>. <replacement>. [path]\`.
End with \`net: -<N> lines, -<M> deps possible.\` Nothing to cut: \`Lean already. Ship.\`
`,
    'ponytail-debt': `---
name: ponytail-debt
description: >
  Harvest every \`ponytail:\` comment in the codebase into a debt ledger, so the
  deliberate shortcuts and deferrals ponytail leaves behind get tracked instead
  of rotting into "later means never". Use when the user says "ponytail debt",
  "/ponytail-debt", "what did ponytail defer", "list the shortcuts", "ponytail
  ledger", or "what did we mark to do later". One-shot report, changes nothing.
---

Every deliberate ponytail shortcut is marked with a \`ponytail:\` comment naming
its ceiling and upgrade path. This collects them into one ledger so a deferral
can't quietly become permanent.

## Scan
Grep the repo for comment markers, skipping \`node_modules\`, \`.git\`, and build output:
\`grep -rnE '(#|//) ?ponytail:' .\`

## Output
One row per marker, grouped by file:
\`<file>:<line>, <what was simplified>. ceiling: <the limit named>. upgrade: <the trigger to revisit>.\`
`,
    'ponytail-gain': `---
name: ponytail-gain
description: >
  Show ponytail's measured impact as a compact scoreboard: less code, less
  cost, more speed, from the benchmark medians. One-shot display, not a
  persistent mode, and not a per-repo number. Trigger: /ponytail-gain,
  "ponytail gain", "what does ponytail save", "show ponytail impact",
  "ponytail scoreboard".
---

# Ponytail Gain

Display this scoreboard when invoked. One-shot: do NOT change mode, write flag
files, or persist anything.

## Scoreboard
\`\`\`
  ponytail gain                     benchmark median · 5 tasks · 3 models

  Lines of code   no-skill  ████████████████████  100%
                  ponytail  ██▌·················    6–20%   ▼ 80–94%
  Cost            no-skill  ████████████████████  100%
                  ponytail  █████▌··············   23–53%  ▼ 47–77%
  Speed           ponytail  ▸ 3–6× faster

  This repo:  /ponytail-debt  (shortcuts you deferred)
              /ponytail-audit (what's still cuttable)
\`\`\`
`,
    'ponytail-help': `---
name: ponytail-help
description: >
  Quick-reference card for all ponytail modes, skills, and commands.
  One-shot display, not a persistent mode. Trigger: /ponytail-help,
  "ponytail help", "what ponytail commands", "how do I use ponytail".
---

# Ponytail Help

Display this reference card when invoked. One-shot.

## Levels
| Level | Trigger | What change |
|---|---|---|
| **Lite** | \`/ponytail lite\` | Build what's asked, name the lazier alternative in one line. |
| **Full** | \`/ponytail\` | The ladder enforced: YAGNI → stdlib → native → one line → minimum. Default. |
| **Ultra** | \`/ponytail ultra\` | YAGNI extremist. Deletion before addition. Challenges requirements before building. |

## Skills
- **ponytail** (\`/ponytail\`): Lazy mode itself. Simplest solution that works.
- **ponytail-review** (\`/ponytail-review\`): Over-engineering review.
- **ponytail-audit** (\`/ponytail-audit\`): Whole-repo over-engineering audit.
- **ponytail-debt** (\`/ponytail-debt\`): Tracked shortcut debt ledger.
- **ponytail-gain** (\`/ponytail-gain\`): Benchmark impact scoreboard.
- **ponytail-help** (\`/ponytail-help\`): Reference card.
`,
    'ponytail-review': `---
name: ponytail-review
description: >
  Code review focused exclusively on over-engineering. Finds what to delete:
  reinvented standard library, unneeded dependencies, speculative abstractions,
  dead flexibility. One line per finding: location, what to cut, what replaces
  it. Use when the user says "review for over-engineering", "what can we
  delete", "is this over-engineered", "simplify review", or invokes
  /ponytail-review. Complements correctness-focused review, this one only
  hunts complexity.
---

Review diffs for unnecessary complexity. One line per finding: location, what
to cut, what replaces it. The diff's best outcome is getting shorter.

## Format
\`L<line>: <tag> <what>. <replacement>.\`

Tags:
- \`delete:\` dead code, unused flexibility, speculative feature.
- \`stdlib:\` hand-rolled thing the standard library ships.
- \`native:\` dependency or code doing what the platform already does.
- \`yagni:\` abstraction with one implementation, layer with one caller.
- \`shrink:\` same logic, fewer lines.
`,
    'rtk-outline': `---
name: rtk-outline
description: >
  Generate a concise AST / symbol outline (classes, methods, signatures, exported symbols)
  of a file or directory instead of reading whole files. Saves 80-95% context window tokens
  during codebase exploration. Activate when the user types /rtk-outline, /rtk-map,
  "outline file", "symbol outline", or asks to inspect file structure without full bodies.
argument-hint: "[file_path|directory_path]"
license: MIT
---

# RTK AST / Symbol Outliner (/rtk-outline)

Generates a compact structural outline of code files or directories. By displaying only declarations, classes, function signatures, interfaces, and exported symbols, it provides 100% of architectural context using less than 10% of the token cost.

- Inspect symbol outlines before reading full files.
- Extracts classes, functions, exports, and types with exact line numbers.
`,
    'rtk-diff': `---
name: rtk-diff
description: >
  Inspect git diffs with compact single-line context (-U1) through RTK output compression.
  Saves 50-70% of diff tokens compared to default multi-line diff outputs. Activate when
  the user types /rtk-diff, "compact diff", "minimal diff", or asks to review diffs efficiently.
argument-hint: "[staged|branch|file_path]"
license: MIT
---

# RTK Compact Diff (/rtk-diff)

Inspects git diffs using compact 1-line context (\`-U1\`) filtered through the RTK Rust Token Killer proxy.
- Run \`rtk git diff -U1\` to review unstaged changes with minimal context tokens.
- Run \`rtk git diff --cached -U1\` for staged reviews.
`,
    'publishtokensavernow': `---
name: publishtokensavernow
description: >
  Automates bumping version, tagging, and publishing Token Saver (RTK) extension to Open VSX and GitHub Releases.
  Activate when the user types /publishtokensavernow, "publish tokensaver now", "publish to openvsx", or asks to
  publish a new release of this extension.
---

# Publish Token Saver Now (/publishtokensavernow)

Run publishing workflow for Token Saver (RTK) extension to Open VSX and create a corresponding GitHub Release.
`,
    'publishtokensaverlocal': `---
name: publishtokensaverlocal
description: >
  Compiles and packages the local VS Code / IDE extension into a .vsix file and replaces
  latestvsixfile/token-saver-rtk-ide.vsix for internal testing without publishing to GitHub or Open VSX.
  Activate when the user types /publishtokensaverlocal, "publish tokensaver local", "compile local vsix",
  "build local vsix", or asks to package the latest extension locally.
---

# Package Token Saver Locally (/publishtokensaverlocal)

Compiles the extension locally into \`latestvsixfile/token-saver-rtk-ide.vsix\` and \`token-saver-rtk-ide-<version>.vsix\` without bumping git tags, pushing commits, or triggering GitHub Actions.
`,
    'rtk-doctor': `---
name: rtk-doctor
description: >
  Quick health check and environment diagnostics for RTK and Headroom.
  Activate when the user types /rtk-doctor, /rtk-health, /rtk-status, "rtk doctor",
  "rtk check", or asks to verify if RTK and token saving are properly configured.
---

# RTK Health Check & Environment Diagnostics (/rtk-doctor)

Diagnose and verify that the RTK token optimization pipeline is running at full capacity.

## Verification Checklist

1. **RTK CLI Binary:**
   - Execute \`rtk --version\` in the terminal to verify the binary is installed and accessible on PATH.
   - If missing, guide the user to run \`winget install rtk-ai.rtk\` (Windows) or \`brew install rtk\` (macOS/Linux).

2. **Headroom Context Compression:**
   - Check if Headroom is available via \`headroom --version\` or \`python -m headroom --version\`.

3. **IDE Rules Configuration:**
   - Check that \`AGENTS.md\`, \`.cursorrules\`, \`.windsurfrules\`, \`.clinerules\`, or \`CLAUDE.md\` contains the \`<!-- RTK_TOKEN_SAVER_START -->\` block.

4. **Token Savings Check:**
   - Run \`rtk gain\` to confirm active token recording telemetry.

5. **Diagnostic Summary:**
   - Report active engine status, savings metrics, and any recommended fixes concisely.
`,
    'rtk-sync': `---
name: rtk-sync
description: >
  1-Click synchronization of RTK Token Saver rules across all AI agent and IDE config files.
  Activate when the user types /rtk-sync, /sync-rules, "sync rtk rules", or asks to
  update/propagate token saving rules to VS Code, Cursor, Windsurf, Cline, Roo Code, Claude, and Antigravity.
---

# 1-Click Multi-IDE Rule Sync (/rtk-sync)

Synchronize and inject the latest RTK Token Saver optimization rules and Headroom CCR directives into all target AI configuration files in the workspace.

## Target Config Files
- **Antigravity / Generic:** \`AGENTS.md\` and \`~/.gemini/config/rules/AGENTS.md\`
- **Cursor IDE:** \`.cursorrules\` and \`.cursor/rules/rtk.mdc\`
- **Windsurf IDE:** \`.windsurfrules\`
- **Cline / Roo Code:** \`.clinerules\`
- **Claude Code:** \`CLAUDE.md\`
- **VS Code GitHub Copilot:** \`.github/copilot-instructions.md\`

## Actions
1. Ensure the RTK Token Saver rule block is present and up-to-date with current compression directives.
2. Ensure skills are installed in \`.agents/skills/\` and global config.
3. Confirm sync completion across all detected targets.
`,
    'rtk-compress': `---
name: rtk-compress
description: >
  Compress raw text, massive stack traces, huge JSON payloads, or verbose logs before sending into context.
  Activate when the user types /rtk-compress, /headroom-compress, "compress logs", "compress json",
  or asks to condense a large payload to save prompt tokens.
argument-hint: "[text|json|log_file_path]"
license: MIT
---

# RTK / Headroom Context Compression (/rtk-compress)

Condense heavy textual data, build logs, stack traces, or deep JSON payloads to minimize LLM prompt token consumption while preserving critical semantic context.

## Compression Strategies
1. **JSON Payloads:** Strip null/empty fields, trim large redundant arrays to representative samples, and collapse metadata headers.
2. **Build / Test Logs:** Retain only the failed assertions, error messages, root stack traces, and exit codes; strip repetitive passing progress bars.
3. **Large Files / Dumps:** Use Headroom CCR (Compress-Cache-Retrieve) pattern or extract structural outline instead of full raw content.
`,
    'rtk-run': `---
name: rtk-run
description: >
  Execute arbitrary terminal/shell commands through RTK output compression proxy.
  Activate when the user types /rtk-run <cmd>, /rtk-exec <cmd>, "run compressed",
  or asks to run a shell command with RTK token saving applied.
argument-hint: "<command>"
license: MIT
---

# RTK Compressed Command Runner (/rtk-run)

Executes any shell or CLI command through the \`rtk\` compression filter, minimizing token footprint in the LLM response context.

## Usage
- Prefix the target command with \`rtk\`: \`rtk <command>\`
- For commands without native RTK filters, RTK acts as a safe transparent proxy.
- Example: \`/rtk-run git status\` executes \`rtk git status\`.
- Example: \`/rtk-run npm test\` executes \`rtk npm test\`.
- Example: \`/rtk-run cargo build\` executes \`rtk cargo build\`.
`,
    'rtk-roi': `---
name: rtk-roi
description: >
  Calculate and display token savings, context efficiency, and estimated cost reduction (ROI) across LLM models.
  Activate when the user types /rtk-roi, /rtk-savings, /rtk-cost, "rtk roi", "rtk savings",
  or asks how much money/tokens RTK has saved.
---

# RTK Token & Cost Savings ROI (/rtk-roi)

Calculates the financial and token efficiency impact of RTK command and context compression.

## Metrics Breakdown
1. Run \`rtk gain --history\` (or \`rtk gain\`) to retrieve raw total tokens saved and reduction percentage.
2. Calculate estimated cost savings across popular model price points:
   - **Claude 3.7 Sonnet / Opus:** ~$3.00 - $15.00 per MTok
   - **GPT-4o:** ~$2.50 - $10.00 per MTok
   - **Gemini 2.5 Flash / Pro:** ~$0.10 - $2.50 per MTok
3. Display a concise ROI scorecard with total tokens saved, % compressed, and estimated dollars saved.
`,
    'rtk-tree': `---
name: rtk-tree
description: >
  Generate a token-optimized project structure map and directory skeleton, filtering out vendor and cache bloat.
  Activate when the user types /rtk-tree, /rtk-project-map, "project tree", "token tree",
  or asks for a compact workspace overview.
argument-hint: "[directory_path] [depth]"
license: MIT
---

# RTK Token-Optimized Project Tree (/rtk-tree)

Generates a concise, high-signal project skeleton while filtering out token-wasting noise.

## Noise Filtered Automatically
- \`node_modules\`, \`target\`, \`dist\`, \`build\`, \`out\`, \`.next\`, \`.nuxt\`, \`bin\`, \`obj\`
- \`.git\`, \`.venv\`, \`__pycache__\`, \`.pytest_cache\`, \`.turbo\`, \`.gradle\`
- \`package-lock.json\`, \`pnpm-lock.yaml\`, \`yarn.lock\`, \`Cargo.lock\`
- Coverage reports, minified bundles, and media binaries

## Execution
Run \`rtk tree -L 2\` or \`rtk ls\` on the target directory, annotating key architectural directories and entry points with minimal tokens.
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

    static getCombinedRuleText() {
        let ponytailMode = 'full';
        let terseMode = true;
        let compactDiff = true;
        let astOutline = true;
        let headroomEnabled = true;

        try {
            const config = vscode.workspace.getConfiguration('tokenSaver');
            ponytailMode = config.get('ponytailMode', 'full');
            terseMode = config.get('terseAgentMode', true);
            compactDiff = config.get('compactDiffContext', true);
            astOutline = config.get('astOutlineContext', true);
            headroomEnabled = config.get('headroomEnabled', true);
        } catch (e) {
            // Use defaults if config is inaccessible
        }

        let text = CORE_RULE_TEXT;

        if (headroomEnabled) {
            text += `\n\n## Headroom Context Compression (Upstream: headroomlabs-ai/headroom)\n`;
            text += `- Utilize Headroom context compression and Compress-Cache-Retrieve (CCR) for heavy JSON structures, file reads, and tool payloads to minimize prompt tokens.\n`;
        }

        if (ponytailMode !== 'off') {
            text += `\n\n## Output & Generation Token Saver Rule (Ponytail Mode: ${ponytailMode.toUpperCase()})\n`;
            text += `- **YAGNI & Shortest Diff:** Only write code that must exist. Reach for standard library before custom code or new dependencies. Shortest working diff wins.\n`;
            text += `- **Terse Responses:** Code first. At most 3 short lines of explanation: what was skipped, when to add it. No essays, no unsolicited design tours, no feature walkthroughs.\n`;
            if (ponytailMode === 'ultra') {
                text += `- **Ultra Mode:** Deletion over addition. Question speculative needs immediately and ship minimal one-liners.\n`;
            }
        }

        if (terseMode) {
            text += `\n## Terse Agent Directives\n`;
            text += `- Eliminate pleasantries, greetings, and conversational filler. Provide direct answers and actionable code.\n`;
            text += `- Avoid reprinting unchanged code blocks. Use targeted search/replace blocks or concise snippets.\n`;
        }

        if (compactDiff || astOutline) {
            text += `\n## Context Optimization (Compact Diffs & Outlines)\n`;
            if (compactDiff) {
                text += `- Inspect git changes using compact single-line diffs: \`rtk git diff -U1\` instead of wide multi-line context.\n`;
            }
            if (astOutline) {
                text += `- When exploring codebases, inspect function signatures / AST outlines (/rtk-outline) before reading entire files into context.\n`;
            }
        }

        return text;
    }

    static formatWrappedRule(headerTitle = 'RTK Token Saver Rule') {
        return `${RTK_BLOCK_START}\n# ${headerTitle}\n\n${this.getCombinedRuleText()}\n${RTK_BLOCK_END}\n`;
    }

    static formatCursorMdc() {
        return `---
description: Automatically routes terminal execution commands through RTK and enforces Ponytail terse token-saving rules with Headroom context compression.
globs: *
alwaysApply: true
---

# RTK (Rust Token Killer) & Headroom Token Saver Automation

Always prefix terminal and CLI execution commands with \`rtk\` (e.g. \`rtk git status\`, \`rtk cargo test\`, \`rtk npm test\`, \`rtk pytest\`, \`rtk vitest\`, \`rtk ls\`, \`rtk rg\`).
- Output is compressed to save tokens while preserving critical errors and signal.
- In multi-command chains, prefix each sub-command: \`rtk git add . && rtk git commit -m "update"\`.
- Use \`rtk gain\` to review token savings metrics.
- Utilize Headroom context compression (CCR) for heavy JSON/tool payload reduction.
- Enforce Ponytail YAGNI: shortest working diff, standard library first, max 3 lines explanation, zero fluff.
- Use \`rtk git diff -U1\` for compact single-line context diffs.
- Inspect AST symbol outlines (/rtk-outline) before reading entire files.
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
            fs.writeFileSync(filePath, `# RTK (Rust Token Killer) Automation Rule\n\n${this.getCombinedRuleText()}\n`, 'utf8');
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
        if (targetScope === 'current') {
            selectedTargets = this.detectCurrentIde().targetIds;
        } else if (targetScope === 'all') {
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

    static writeSkillsToDir(baseDir) {
        if (!baseDir) return [];
        const installed = [];
        for (const [skillName, skillContent] of Object.entries(SKILLS_MAP)) {
            const skillFolder = path.join(baseDir, skillName);
            if (!fs.existsSync(skillFolder)) {
                fs.mkdirSync(skillFolder, { recursive: true });
            }
            fs.writeFileSync(path.join(skillFolder, 'SKILL.md'), skillContent, 'utf8');
            installed.push(skillName);
        }
        return installed;
    }

    /**
     * Install skills for Antigravity / Agentic systems
     */
    static installSkills(targetScope = 'all') {
        if (targetScope === 'all') {
            return this.installAllSkills();
        }

        const baseDir = targetScope === 'workspace' 
            ? this.getWorkspaceSkillsPath() 
            : this.getGlobalSkillsPath();

        if (!baseDir) {
            throw new Error('No target directory available for scope: ' + targetScope);
        }

        const installed = this.writeSkillsToDir(baseDir);
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
                const installed = this.writeSkillsToDir(globalDir);
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
                const installed = this.writeSkillsToDir(wsDir);
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
        const checkDir = (baseDir) => {
            if (!baseDir || !fs.existsSync(baseDir)) return [];
            const found = [];
            for (const skill of Object.keys(SKILLS_MAP)) {
                const skillFile = path.join(baseDir, skill, 'SKILL.md');
                if (fs.existsSync(skillFile)) {
                    found.push(skill);
                }
            }
            return found;
        };

        const globalFound = checkDir(this.getGlobalSkillsPath());
        const wsFound = checkDir(this.getWorkspaceSkillsPath());
        const allFound = [...new Set([...globalFound, ...wsFound])];
        const totalExpected = Object.keys(SKILLS_MAP).length;

        if (targetScope === 'global') {
            return {
                installed: globalFound.length > 0,
                count: globalFound.length,
                total: totalExpected,
                skills: globalFound,
                isComplete: globalFound.length >= totalExpected
            };
        }

        if (targetScope === 'workspace') {
            return {
                installed: wsFound.length > 0,
                count: wsFound.length,
                total: totalExpected,
                skills: wsFound,
                isComplete: wsFound.length >= totalExpected
            };
        }

        return {
            installed: allFound.length > 0,
            count: allFound.length,
            total: totalExpected,
            skills: allFound,
            isComplete: allFound.length >= totalExpected,
            hasGlobal: globalFound.length > 0,
            hasWorkspace: wsFound.length > 0
        };
    }

    /**
     * Auto-detect the currently active IDE host environment
     */
    static detectCurrentIde() {
        const appName = (vscode.env.appName || '').toLowerCase();
        const uriScheme = (vscode.env.uriScheme || '').toLowerCase();
        const execPath = (process.execPath || '').toLowerCase();
        const appRoot = (vscode.env.appRoot || '').toLowerCase();

        // 1. Antigravity IDE detection
        if (
            appName.includes('antigravity') ||
            uriScheme.includes('antigravity') ||
            execPath.includes('antigravity') ||
            appRoot.includes('antigravity') ||
            fs.existsSync(path.join(os.homedir(), '.gemini', 'antigravity-ide')) ||
            fs.existsSync(path.join(os.homedir(), '.gemini', 'config'))
        ) {
            return {
                id: 'antigravity',
                displayName: 'Antigravity IDE',
                shortName: 'Antigravity',
                targetIds: ['antigravity_global', 'antigravity_workspace']
            };
        }

        // 2. Cursor IDE detection
        if (
            appName.includes('cursor') ||
            uriScheme.includes('cursor') ||
            execPath.includes('cursor') ||
            appRoot.includes('cursor')
        ) {
            return {
                id: 'cursor',
                displayName: 'Cursor IDE',
                shortName: 'Cursor',
                targetIds: ['cursor']
            };
        }

        // 3. Windsurf IDE detection
        if (
            appName.includes('windsurf') ||
            uriScheme.includes('windsurf') ||
            execPath.includes('windsurf') ||
            appRoot.includes('windsurf')
        ) {
            return {
                id: 'windsurf',
                displayName: 'Windsurf IDE',
                shortName: 'Windsurf',
                targetIds: ['windsurf']
            };
        }

        // 4. Cline / Roo Code detection
        if (appName.includes('cline') || appName.includes('roo')) {
            return {
                id: 'cline',
                displayName: 'Cline & Roo Code',
                shortName: 'Cline',
                targetIds: ['cline']
            };
        }

        // 5. Claude Code detection
        if (appName.includes('claude')) {
            return {
                id: 'claude',
                displayName: 'Claude Code',
                shortName: 'Claude',
                targetIds: ['claude']
            };
        }

        // 6. Default to Visual Studio Code (GitHub Copilot)
        const currentName = vscode.env.appName || 'Visual Studio Code';
        return {
            id: 'vscode',
            displayName: currentName,
            shortName: 'VS Code',
            targetIds: ['copilot']
        };
    }

    /**
     * Get detailed status of all supported IDE targets (filtered to current host by default)
     */
    static getIdeStatus(onlyCurrent = true) {
        const detected = this.detectCurrentIde();
        const targetMap = this.getTargetPaths();
        const root = this.getWorkspaceRoot();

        const targetList = onlyCurrent
            ? IDE_TARGETS.filter(target => detected.targetIds.includes(target.id))
            : IDE_TARGETS;

        const results = targetList.map(target => {
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

        results.detectedIde = detected;
        return results;
    }
}

module.exports = SkillInstaller;
