# ⚡ Token Saver (RTK) for Antigravity IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenVSX](https://img.shields.io/badge/Open%20VSX-available-blue.svg)](https://open-vsx.org)
[![Antigravity](https://img.shields.io/badge/Antigravity%20IDE-Compatible-purple.svg)](https://github.com/terenceooi99/token-saver-rtk-antigravity)

**Token Saver (RTK)** integrates [RTK (Rust Token Killer)](https://www.rtk-ai.app) into **Google Antigravity IDE** to slash AI context window token consumption by **60% - 90%** during terminal command execution (`git`, `cargo`, `npm`, `pnpm`, `pytest`, `vitest`, `rg`, `ls`, `tree`, etc.).

---

## 🎯 Dual-Mode Usage

Token Saver gives you two flexible ways to use RTK in Antigravity IDE:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TOKEN SAVER (RTK) MODES                           │
├───────────────────────────────────┬────────────────────────────────────┤
│ WAY 1: Chat / Slash Commands      │ WAY 2: OpenVSX Extension Plugin    │
│ (In-Chat / Manual Skill Control)  │ (GUI Status Bar & Auto Rules)      │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Type / in chat for instant menu │ • Status bar toggle: $(zap) RTK ON │
│ • /rtk-savedtokenon (Enable)      │ • Command palette actions          │
│ • /rtk-savedtokenoff (Disable)    │ • Automatic workspace rule sync    │
│ • /rtk-gain (View Scoreboard)     │ • One-click RTK CLI installer      │
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

#### Windows (PowerShell):
```powershell
.\scripts\install-skills.ps1
```

#### Linux / macOS (Bash):
```bash
chmod +x scripts/install-skills.sh
./scripts/install-skills.sh
```

---

## 🧩 Way 2: OpenVSX / VS Code Extension Plugin

The extension provides full graphical and automated control for Antigravity IDE, VS Code, Cursor, and OpenVSX-compatible editors.

### Features:
1. **Status Bar Widget**:
   - `⚡ RTK: ON` — Active and saving tokens on terminal outputs.
   - `⚪ RTK: OFF` — Idle.
   - Click the status bar item at any time to toggle modes.
2. **Commands in Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)**:
   - `Token Saver: Toggle RTK Token Saving Mode`
   - `Token Saver: Enable RTK Token Saving`
   - `Token Saver: Disable RTK Token Saving`
   - `Token Saver: Show Token Savings Scoreboard (rtk gain)`
   - `Token Saver: Install RTK CLI Tool`
3. **Automatic Workspace Rule Sync**:
   Automatically writes and updates `.agents/rules/antigravity-rtk-rules.md` in your project when enabled.

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
   npx ovsx publish token-saver-rtk-antigravity-1.0.0.vsix -p <YOUR_OPENVSX_ACCESS_TOKEN>
   ```

---

## 👤 Author & Maintainer

- **Terence** — [terenceooi99@gmail.com](mailto:terenceooi99@gmail.com)
- **GitHub**: [terenceooi99/token-saver-rtk-antigravity](https://github.com/terenceooi99/token-saver-rtk-antigravity)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).