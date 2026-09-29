# Changelog

All notable changes to the **Token Saver (RTK)** project will be documented in this file.

## [1.7.0] - 2026-09-29
### Added & Improved
- **Full Ponytail & YAGNI Skills Suite**:
  - Expanded Ponytail ecosystem with dedicated AI agent skills: `/ponytail-audit` (repo-wide bloat & over-engineering audit), `/ponytail-review` (complexity & diff review), `/ponytail-debt` (shortcut & debt ledger tracker), `/ponytail-gain` (savings scoreboard), and `/ponytail-help` (command cheat sheet).
- **Comprehensive Agentic Skills System**:
  - Packaged 20 built-in skills for Antigravity, Claude Code, Cursor, Windsurf, Cline, and Roo Code covering RTK token elimination, Headroom context compression, and Ponytail brevity directives.
  - Added `/publishtokensaverlocal` skill for 1-click local `.vsix` packaging and internal distribution.
- **Enhanced Extension Webview & Automation**:
  - Updated webview dashboard actions, command bindings, and automated release scripts.

## [1.6.1] - 2026-09-29
### Added & Improved
- **Webview Dashboard Enhancements & Support**:
  - Integrated support tip link (`☕ Tip me @ Wise`) in the extension webview dashboard footer with custom styling.
  - Added project donation/tip link in `README.md`.
- **Release Automation & Documentation**:
  - Enhanced `publishtokensavernow` skill with automated changelog pre-flight guardrails, UTF-8 No-BOM guarantees, and full workspace staging checks.
  - Updated `CONTRIBUTING.md` architecture guide and development workflows.

## [1.6.0] - 2026-09-29
### Added & Improved
- **Comprehensive Documentation & Ecosystem Overhaul**:
  - Overhauled and updated `README.md` with complete documentation for all 15 Antigravity & AI agent slash commands (`/rtk-*`, `/ponytail`, `/publish*`).
  - Documented dual-engine architecture powered by **RTK Core** and **Headroom Context Compression**.
  - Added complete extension settings reference schema and configuration options.
- **Enhanced Packaging & Distribution Pipeline**:
  - Updated build and packaging automation to generate versioned VSIX distribution artifacts (`token-saver-rtk-ide-1.6.0.vsix`).
  - Synchronized internal distribution bundle in `latestvsixfile/token-saver-rtk-ide.vsix`.

## [1.5.2] - 2026-09-29
### Added & Improved
- **Dual Upstream Engine Integration (RTK + Headroom)**:
  - Added native support for **Headroom** (`headroomlabs-ai/headroom`) upstream alongside **RTK** (`rtk-ai/rtk`).
  - Added user configuration setting `tokenSaver.headroomEnabled` with interactive toggle control in the webview dashboard.
  - Upgraded **"Sync Upstream GitHub"** action to concurrently query releases from both `rtk-ai/rtk` and `headroomlabs-ai/headroom` with unified 1-click update support.
  - Added Headroom status telemetry to System Health diagnostics panel.
  - Updated multi-IDE rules and `/rtk-update` skill to incorporate Headroom context compression and CCR directives.

## [1.5.1] - 2026-09-29
### Added & Improved
- **VSIX Packaging & Verification**:
  - Updated latest internal `.vsix` distribution bundle with Ponytail, AST Outlining, and Compact Diff features.

## [1.5.0] - 2026-09-29
### Added & Improved
- **Full-Spectrum Token Saver Suite (Input + Output + Context)**:
  - Combined **RTK Core** (CLI input compression) with **Ponytail YAGNI philosophy** (output token reduction), **AST Symbol Outlining** (`/rtk-outline`), and **Compact Diffs** (`/rtk-diff`).
- **Ponytail Mode & Terse Agent Directives (`/ponytail`)**:
  - Added new `/ponytail [lite|full|ultra|off]` slash action and skill.
  - Slashes expensive output tokens (3-4x input cost) by banning unsolicited essays and enforcing standard library over bloat, shortest working diffs, and max 3-line explanations.
  - Multi-IDE rule synchronization automatically embeds Ponytail and Terse directives across Cursor, Windsurf, Cline, Claude Code, Copilot, Antigravity, and `AGENTS.md`.
- **AST / Symbol Outliner (`/rtk-outline` & `tokenSaver.generateAstOutline`)**:
  - Generates concise structural class/function signature outlines with line numbers, saving 80–95% context tokens vs reading whole files into context.
- **Compact Git Diff Context (`/rtk-diff` & `tokenSaver.runCompactDiff`)**:
  - Integrates single-line context (`rtk git diff -U1`), eliminating redundant unchanged code blocks and saving 50–70% of diff tokens.
- **Interactive Dashboard Controls**:
  - Added dedicated **🥋 Output & Context Token Saver** section in the webview dashboard with segmented mode selector (`[Off | Lite | Full | Ultra]`), Terse toggle, and Compact Diff toggle.
  - Added Quick Action buttons: `🌲 AST Symbol Outline` and `⚡ Compact Diff (-U1)`.

## [1.4.1] - 2026-09-29
### Added & Improved
- **Open VSX Marketplace Release Notes Synchronization**:
  - Synchronized full multi-version changelog metadata into package archive for seamless display on Open VSX and VS Code marketplaces.
  - Added release workflow validation to guarantee continuous changelog updates on every future version bump.

## [1.4.0] - 2026-09-29
### Added & Improved
- **Unified Modular Architecture**:
  - Centralized shared webview message handling, state synchronization, and HTML rendering into `extension/webview-helper.js`.
  - Streamlined both `SidebarProvider` (Activity Bar view) and `DashboardPanel` (Editor Tab) to use shared lifecycle logic.
- **Enhanced Glassmorphism UI & Styling**:
  - Polished responsive dashboard stylesheet (`dashboard.css`) with sleek dark mode, micro-animations, and fluid sidebar-to-editor adaptability.
  - Added dedicated Activity Bar vector icon (`resources/activity-icon.svg`) and high-resolution extension marketplace icon (`resources/icon.png`).
- **Interactive Multi-IDE Ecosystem Matrix**:
  - Seamless auto-detection and 1-click rule synchronization across VS Code (GitHub Copilot), Cursor (`.cursorrules` & `.mdc`), Windsurf (`.windsurfrules`), Cline/Roo Code (`.clinerules`), Claude Code (`CLAUDE.md`), Antigravity IDE, and `AGENTS.md`.
- **Flexible Auto-Refresh & Diagnostics**:
  - Custom minute-based auto-refresh timer with instant presets and live status bar telemetry.

## [1.3.2] - 2026-09-28
### Added & Improved
- **Custom Minute-Based Auto-Refresh Input**:
  - Replaced fixed-only timer intervals with a flexible minute input (`min`) allowing users to type custom refresh intervals (e.g. `1`, `2`, `5`, `10` minutes or fractions like `0.5`).
  - Added Enter key / Set button support, unit display, and one-click quick presets in minutes.
  - Corrected dropdown layering with elevated stacking contexts and viewport width clamping.
- **Auto-Detected Host IDE & Focused Sync Hub**:
  - Automatically detects the current IDE host environment (`Antigravity IDE`, `Cursor IDE`, `Windsurf IDE`, `VS Code (GitHub Copilot)`, `Cline / Roo Code`, `Claude Code`).
  - IDE Rules Hub dynamically focuses on the detected IDE host and displays only the active host's target options (e.g. Global & Workspace for Antigravity, `.cursorrules`/`.mdc` for Cursor, `.windsurfrules` for Windsurf).
  - Single-click sync button dynamically adapts to `⚡ Sync Rule` / `⚡ Sync All` for the detected IDE.
- **Sidebar Boundary & Overflow Hardening**:
  - Added flex-shrink constraints (`min-width: 0`) and text ellipsis truncation across IDE cards, badges, and headers for flawless rendering at default sidebar widths.

## [1.3.0] - 2026-09-28
### Added
- **Primary Sidebar Interactive Dashboard**:
  - Integrated a dedicated Activity Bar container with a minimalist meter/gauge icon (`resources/activity-icon.svg`) under the title **"RTK Token Saver"**.
  - Clicking the icon opens the **"Token Optimization"** interactive dashboard directly inside the Primary Sidebar.
  - Implemented `SidebarProvider` (`vscode.WebviewViewProvider`) with on-demand visibility-aware data loading and instant interaction response.
  - Added a **"Pop Out to Editor Tab"** (`⤢`) header toolbar and in-view button allowing seamless switching between compact sidebar view and full-width editor tab.
  - Fully responsive glassmorphic UI adapting effortlessly between narrow sidebar widths and wide editor panels.

## [1.2.1] - 2026-09-28
### Added
- **Simultaneous Dual-Mode Activation Out-of-the-Box**:
  - Automatically installs and configures both **Way 1 (Chat / Slash Commands: `/rtk-update`, `/rtk-savedtokenon`, `/rtk-savedtokenoff`, `/rtk-gain`)** and **Way 2 (Status Bar, Interactive Dashboard, & Multi-IDE Rule Sync)** simultaneously upon extension installation and startup.
  - Added `tokenSaver.autoInstallSkills` configuration option (default `true`) ensuring zero-friction setup for users in all supported AI agent ecosystems.
  - Multi-target skill installer now deploys to both global (`~/.gemini/config/skills/`) and workspace (`.agents/skills/`) roots.

## [1.2.0] - 2026-09-28
### Added
- **Universal Multi-IDE & AI Agent Support**:
  - **VS Code (GitHub Copilot)**: Automatic synchronization with `.github/copilot-instructions.md`.
  - **Cursor IDE**: Direct support for `.cursorrules` and modern `.cursor/rules/rtk.mdc`.
  - **Windsurf IDE (Codeium Cascade)**: Automatic rule management for `.windsurfrules`.
  - **Cline & Roo Code**: Automatic instructions configuration for `.clinerules`.
  - **Claude Code**: Direct workspace configuration via `CLAUDE.md`.
  - **Universal Agent Standard**: Automatic generation of `AGENTS.md`.
  - **Antigravity IDE**: Global (`~/.gemini/config/`) and workspace (`.agents/`) rules & skills.
- **Safe Block Delimiter Injection**:
  - Automatically merges RTK rules using `<!-- RTK_TOKEN_SAVER_START -->` ... `<!-- RTK_TOKEN_SAVER_END -->` markers so user custom instructions are never overwritten or corrupted.
- **Interactive Multi-IDE Ecosystem Hub**:
  - New interactive matrix in the Dashboard displaying real-time sync status for each agent target.
  - Per-IDE single-click sync/toggle buttons.
  - 1-Click "Sync All Targets" action.
- **Cross-Platform Multi-IDE Automation Scripts**:
  - Added `scripts/install-all-ide-rules.ps1` and `scripts/install-all-ide-rules.sh` for multi-IDE CLI deployment.

## [1.1.0] - 2026-09-28
### Added
- **Interactive Glassmorphic Webview Dashboard**:
  - Live Token Savings Counter with animated meters and breakdown.
  - Compression Efficiency Gauge (%) and Estimated Dollar Savings ($).
  - Per-tool visual savings charts (`git`, `cargo`, `npm`, `pytest`, `vitest`, `rg`, `ls`, etc.).
  - Action center with 1-click Antigravity skill sync, GitHub release update check, and proxy latency test.
  - Real-time diagnostics panel displaying binary path, version, and target scopes.
- **Upstream GitHub RTK Core Sync & Updater**:
  - Automatic non-intrusive update checks against official GitHub releases (`https://github.com/rtk-ai/rtk`).
  - 1-click update trigger for Windows (`winget`), macOS (`brew`), and Linux (`curl`).
- **1-Click Global Antigravity Skills & Rules Sync**:
  - Direct extension command (`Token Saver: 1-Click Install Antigravity Skills (/rtk-*)`) to install skills into `~/.gemini/config/skills/` without manual terminal scripts.
  - Global rule synchronization across all Antigravity IDE projects.
- **Dynamic Status Bar with Live Metrics**:
  - Real-time token counter: `$(zap) RTK: 48.2k saved (72%)` with rich markdown hover tooltips.
  - 30-second background polling cycle.

## [1.0.0] - 2026-09-28
### Added
- **Way 1 (Chat & Slash Commands)**:
  - `/rtk-savedtokenon`: Automatically prefixes AI terminal commands with `rtk` to compress verbose outputs.
  - `/rtk-savedtokenoff`: Reverts back to normal direct command execution.
  - `/rtk-gain`: Displays live RTK token savings metrics and efficiency scoreboard.
  - Installation scripts (`install-skills.ps1` and `install-skills.sh`) for global Antigravity configuration.
- **Way 2 (OpenVSX / VS Code Extension)**:
  - Status bar indicator `$(zap) RTK: ON` / `$(circle-slash) RTK: OFF` with instant toggle on click.
  - Commands registered in Command Palette (`Token Saver: Toggle`, `Enable`, `Disable`, `Show Savings`, `Install CLI`).
  - Automatic workspace `.agents/rules/antigravity-rtk-rules.md` synchronization.
- OpenVSX publishing pipeline (`publish-openvsx.yml`).