# Changelog

All notable changes to the **Token Saver (RTK) for Antigravity IDE** project will be documented in this file.

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