# ⚡ Token Saver (RTK) for VS Code & Agentic IDEs

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenVSX](https://img.shields.io/badge/Open%20VSX-available-blue.svg)](https://open-vsx.org)
[![VS Code](https://img.shields.io/badge/VS%20Code-Compatible-007ACC.svg)](https://code.visualstudio.com)
[![Cursor](https://img.shields.io/badge/Cursor%20IDE-Compatible-black.svg)](https://cursor.com)
[![Windsurf](https://img.shields.io/badge/Windsurf%20IDE-Compatible-00E5FF.svg)](https://codeium.com/windsurf)
[![Antigravity](https://img.shields.io/badge/Antigravity%20IDE-Compatible-purple.svg)](https://github.com/terenceooi99/token-saver-rtk-antigravity)

**Token Saver (RTK)** is a universal token optimization suite and CLI output compression proxy using [RTK (Rust Token Killer)](https://www.rtk-ai.app). It slashes AI context window token consumption by **60% - 90%** during terminal command execution (`git`, `cargo`, `npm`, `pnpm`, `pytest`, `vitest`, `rg`, `ls`, `tree`, etc.) across **all major Agentic AI IDEs and coding assistants**.

---

## 🌐 Supported IDEs & AI Agent Ecosystem

| IDE / AI Agent | Rule / Configuration Target | How RTK Integrates |
| :--- | :--- | :--- |
| **VS Code (GitHub Copilot)** | `.github/copilot-instructions.md` | Injects RTK command rules for Copilot Chat & agent mode |
| **Cursor IDE** | `.cursorrules` & `.cursor/rules/rtk.mdc` | Automatically instructs Cursor Agent to route CLI tasks via RTK |
| **Windsurf IDE (Cascade)** | `.windsurfrules` | Instructs Cascade agent to prefix shell executions with RTK |
| **Cline & Roo Code** | `.clinerules` | Directs autonomous agents to use RTK for zero token waste |
| **Claude Code (Anthropic)** | `CLAUDE.md` | Configures Claude CLI agent with RTK execution guidelines |
| **Universal Agents** | `AGENTS.md` | Standard cross-agent markdown format for OpenCode, Aider, etc. |
| **Google Antigravity IDE** | `~/.gemini/config/` & `.agents/` | Global & workspace rules plus native slash commands (`/rtk-*`) |

---

## 🎯 Dual-Mode Architecture & Interactive Dashboard

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TOKEN SAVER (RTK) MODES                           │
├───────────────────────────────────┬────────────────────────────────────┤
│ WAY 1: Chat / Slash Commands      │ WAY 2: Extension & Dashboard       │
│ (In-Chat / Manual Skill Control)  │ (GUI Status Bar & Webview Panel)   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Type / in chat for instant menu │ • Multi-IDE & Agent Sync Hub       │
│ • /rtk-savedtokenon (Enable)      │ • Live Status Bar: 48k saved (72%) │
│ • /rtk-savedtokenoff (Disable)    │ • Interactive Webview Dashboard    │
│ • /rtk-gain (View Scoreboard)     │ • Upstream GitHub RTK auto-sync    │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 🚀 Way 1: Chat & Slash Commands (Antigravity & Agent Skills)

Trigger commands directly in your AI assistant chat by typing `/`:

| Slash Command | Action |
| :--- | :--- |
| **`/rtk-savedtokenon`** | **Enables automated RTK compression**. The AI will automatically route all terminal/shell actions through `rtk` (e.g. `rtk git status`, `rtk cargo test`, `rtk npm test`). |
| **`/rtk-savedtokenoff`** | **Disables RTK mode**. Reverts to standard unproxied command execution. |
| **`/rtk-gain`** | **Displays the live token savings scoreboard** and efficiency metrics. |

### Installing Skills into your IDE / Global Profile:
- **Command Palette**: `Token Saver: 1-Click Install Antigravity Skills (/rtk-*)`
- **Windows (PowerShell)**: `.\scripts\install-skills.ps1`
- **Linux / macOS (Bash)**: `./scripts/install-skills.sh`

---

## 🧩 Way 2: Interactive Webview Dashboard & Multi-IDE Hub

The extension provides full graphical and automated control for **VS Code**, **Cursor**, **Windsurf**, **Antigravity**, and all OpenVSX-compatible editors.

### 🌟 Key Features:
1. **Multi-IDE & AI Agent Synchronization Hub**:
   - 1-Click sync to `.github/copilot-instructions.md`, `.cursorrules`, `.windsurfrules`, `.clinerules`, `CLAUDE.md`, `AGENTS.md`, and `~/.gemini/config/`.
   - **Safe Delimiter System**: Preserves existing project instructions using `<!-- RTK_TOKEN_SAVER_START -->` blocks.
2. **Interactive Glassmorphic Dashboard**:
   - Live Token Savings Counter with animated visual meters.
   - Compression Efficiency Gauge (%) and Estimated Dollar Savings ($).
   - Per-tool visual savings charts (`git`, `cargo`, `npm`, `pytest`, `vitest`, `rg`, `ls`, etc.).
   - Action center with 1-click skill sync, GitHub release update check, and proxy latency test.
   - Diagnostics panel displaying local binary path, version, and active target counts.
3. **Upstream GitHub RTK Core Sync & Updater**:
   - Automatic non-intrusive update checks against official GitHub releases (`https://github.com/rtk-ai/rtk`).
   - 1-click update trigger for Windows (`winget`), macOS (`brew`), and Linux (`curl`).
4. **Dynamic Live Status Bar**:
   - Shows real-time savings: `⚡ RTK: 48.2k saved (72%)` or `⚪ RTK: OFF`.
   - Rich hover tooltips with cost savings and quick access to the dashboard.
5. **Commands in Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)**:
   - `Token Saver: Open Interactive Dashboard`
   - `Token Saver: Sync Rules to All AI Agents (VS Code, Cursor, Windsurf, Cline, Claude, Antigravity)`
   - `Token Saver: Configure Target Agentic IDEs / AI Rules`
   - `Token Saver: Toggle RTK Token Saving Mode`
   - `Token Saver: Enable RTK Token Saving`
   - `Token Saver: Disable RTK Token Saving`
   - `Token Saver: Check for RTK Core Updates (GitHub)`
   - `Token Saver: 1-Click Install Antigravity Skills (/rtk-*)`
   - `Token Saver: Sync Global Antigravity Rules (~/.gemini)`
   - `Token Saver: Show Token Savings Scoreboard (rtk gain)`
   - `Token Saver: Install RTK CLI Tool`

---

## 📦 Prerequisites: Installing RTK CLI

Token Saver requires the `rtk` binary installed on your system.

### Windows:
```powershell
winget install --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements
```

### macOS / Linux:
```bash
brew install rtk-ai/tap/rtk
# or
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash
```

### Verify Installation:
```bash
rtk --version
rtk gain
```

---

## 🛠 Multi-IDE Rule Sync via Terminal

You can also synchronize rules directly from terminal:

- **Windows PowerShell**:
  ```powershell
  .\scripts\install-all-ide-rules.ps1
  ```
- **macOS / Linux Bash**:
  ```bash
  ./scripts/install-all-ide-rules.sh
  ```

---

## 📦 Publishing to OpenVSX & VS Code Marketplace

1. **Install packaging tools**:
   ```bash
   npm install -g @vscode/vsce ovsx
   ```

2. **Package the `.vsix` file**:
   ```bash
   npx @vscode/vsce package
   ```

3. **Publish to Open VSX**:
   ```bash
   npx ovsx publish token-saver-rtk-antigravity-1.2.0.vsix -p <YOUR_OPENVSX_ACCESS_TOKEN>
   ```

---

## 👤 Author & Maintainer

- **Terence** — [terenceooi99@gmail.com](mailto:terenceooi99@gmail.com)
- **GitHub**: [terenceooi99/token-saver-rtk-antigravity](https://github.com/terenceooi99/token-saver-rtk-antigravity)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).