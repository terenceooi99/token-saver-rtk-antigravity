# Changelog

All notable changes to the **Token Saver (RTK)** project will be documented in this file.

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