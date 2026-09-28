# ⚡ Token Saver (RTK) for Antigravity IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenVSX](https://img.shields.io/badge/Open%20VSX-available-blue.svg)](https://open-vsx.org)
[![Antigravity](https://img.shields.io/badge/Antigravity%20IDE-Compatible-purple.svg)](https://github.com/terenceooi99/token-saver-rtk-antigravity)

**Token Saver (RTK)** integrates [RTK (Rust Token Killer)](https://www.rtk-ai.app) into **Google Antigravity IDE** to slash AI context window token consumption by **60% - 90%** during terminal command execution (`git`, `cargo`, `npm`, `pnpm`, `pytest`, `vitest`, `rg`, `ls`, `tree`, etc.).

---

## 🎯 Dual-Mode Architecture & Interactive Dashboard

Token Saver gives you two flexible ways to use RTK in Antigravity IDE:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TOKEN SAVER (RTK) MODES                           │
├───────────────────────────────────┬────────────────────────────────────┤
│ WAY 1: Chat / Slash Commands      │ WAY 2: Extension & Dashboard       │
│ (In-Chat / Manual Skill Control)  │ (GUI Status Bar & Webview Panel)   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Type / in chat for instant menu │ • Live Status Bar: 48k saved (72%) │
│ • /rtk-savedtokenon (Enable)      │ • Interactive Webview Dashboard    │
│ • /rtk-savedtokenoff (Disable)    │ • Upstream GitHub RTK auto-sync    │
│ • /rtk-gain (View Scoreboard)     │ • 1-Click Global Skill Installer   │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 🚀 Way 1: Chat & Slash Commands (Native Skills)

Trigger commands directly in your Antigravity chat by typing `/`:

| Slash Command | Action |
| :--- | :--- |
| **`/rtk-savedtokenon`** | **Enables automated RTK compression**. The AI will automatically route all terminal/shell actions through `rtk` (e.g. `rtk git status`, `rtk cargo test`, `rtk npm test`). |
| **`/rtk-savedtokenoff`** | **Disables RTK mode**. Reverts to standard unproxied command execution. |
| **`/rtk-gain`** | **Displays the live token savings scoreboard** and efficiency metrics. |

### Installing Skills into Antigravity IDE:

#### Option A: 1-Click from Command Palette
Press `Ctrl+Shift+P` / `Cmd+Shift+P` and choose:
> `Token Saver: 1-Click Install Antigravity Skills (/rtk-*)`

#### Option B: Terminal Script
- **Windows (PowerShell)**: `.\scripts\install-skills.ps1`
- **Linux / macOS (Bash)**: `./scripts/install-skills.sh`

---

## 🧩 Way 2: Interactive Webview Dashboard & Extension

The extension provides full graphical and automated control for Antigravity IDE, VS Code, Cursor, and OpenVSX-compatible editors.

### 🌟 Key Features:
1. **Interactive Glassmorphic Dashboard**:
   - Live Token Savings Counter with animated visual meters.
   - Compression Efficiency Gauge (%) and Estimated Dollar Savings ($).
   - Per-tool visual savings charts (`git`, `cargo`, `npm`, `pytest`, `vitest`, `rg`, `ls`, etc.).
   - Action center with 1-click Antigravity skill sync, GitHub release update check, and proxy latency test.
   - Diagnostics panel displaying local binary path, version, and target scopes.
2. **Upstream GitHub RTK Core Sync & Updater**:
   - Automatic non-intrusive update checks against official GitHub releases (`https://github.com/rtk-ai/rtk`).
   - 1-click update trigger for Windows (`winget`), macOS (`brew`), and Linux (`curl`).
3. **Dynamic Live Status Bar**:
   - Shows real-time savings: `⚡ RTK: 48.2k saved (72%)` or `⚪ RTK: OFF`.
   - Rich hover tooltips with cost savings and quick access to the dashboard.
4. **Commands in Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)**:
   - `Token Saver: Open Interactive Dashboard`
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

## 🛠 Publishing to OpenVSX & VS Code Marketplace

To package and publish to OpenVSX:

1. **Install tools**:
   ```bash
   npm install -g @vscode/vsce ovsx
   ```

2. **Package the `.vsix` file**:
   ```bash
   npx @vscode/vsce package
   ```

3. **Publish to Open VSX**:
   ```bash
   npx ovsx publish token-saver-rtk-antigravity-1.1.0.vsix -p <YOUR_OPENVSX_ACCESS_TOKEN>
   ```

---

## 👤 Author & Maintainer

- **Terence** — [terenceooi99@gmail.com](mailto:terenceooi99@gmail.com)
- **GitHub**: [terenceooi99/token-saver-rtk-antigravity](https://github.com/terenceooi99/token-saver-rtk-antigravity)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).