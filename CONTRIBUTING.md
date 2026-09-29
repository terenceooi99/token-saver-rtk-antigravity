# Contributing to Token Saver (RTK & Headroom)

Thank you for your interest in contributing to **Token Saver (RTK & Headroom) for VS Code & Agentic IDEs**! This project brings intelligent terminal token optimization, CLI output compression, Headroom context compression, and Ponytail YAGNI mode across all modern AI coding assistants and IDEs.

We welcome contributions of all kinds: bug fixes, new IDE/agent integrations, performance improvements, documentation enhancements, and UI polish.

---

## 🏗 Project Architecture

Before diving in, here is a quick overview of how the codebase is structured:

```
token-saver-rtk-ide/
├── extension/                 # VS Code & OpenVSX Extension Core
│   ├── extension.js           # Extension entry point & command registrations
│   ├── rtk-service.js         # RTK CLI telemetry, execution proxy & metrics parser
│   ├── rtk-updater.js         # Dual upstream GitHub release checker & updater (RTK + Headroom)
│   ├── statusbar.js           # Real-time status bar metric widget
│   ├── sidebar-provider.js    # Activity Bar Primary Sidebar Webview Provider
│   ├── dashboard-panel.js     # Pop-out Editor Tab Webview Panel coordinator
│   ├── webview-helper.js      # Unified webview message bridge, state & HTML generator
│   └── webview/               # Interactive glassmorphic dashboard (HTML/CSS/JS)
├── skills/                    # Global Antigravity agent skills (/rtk-*, /ponytail, etc.)
├── .agents/                   # Workspace Antigravity skills & rules configuration
├── rules/                     # System prompt & token-saving behavior rules
├── scripts/                   # Cross-platform installation, sync & packaging scripts (.ps1 / .sh)
├── latestvsixfile/            # Pre-compiled local VSIX package for instant IDE testing
├── .github/                   # Workflows (CI/CD, OpenVSX publishing)
├── AGENTS.md                  # Universal agent instructions
├── CHANGELOG.md               # Version history & release notes
├── README.md                  # Project overview & documentation
└── package.json               # Extension manifest and scripts
```

---

## 🛠 Prerequisites & Local Setup

### 1. Requirements
- **Node.js**: v16+ (v18+ recommended)
- **npm** or **pnpm**
- **RTK (Rust Token Killer)** CLI tool:
  - **Windows**: `winget install --id rtk-ai.rtk`
  - **macOS**: `brew install rtk-ai/tap/rtk`
  - **Linux**: `curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash`

### 2. Clone & Install
```bash
git clone https://github.com/terenceooi99/token-saver-rtk-ide.git
cd token-saver-rtk-ide
npm install
```

---

## 🧪 Development & Testing

### Testing the VS Code / OpenVSX Extension
1. Open the project root in VS Code, Cursor, Windsurf, or Antigravity IDE.
2. Press `F5` (or go to **Run and Debug** -> **Launch Extension**) to start an Extension Development Host window.
3. In the new window:
   - Click the **RTK Meter icon** on the Activity Bar to test the Primary Sidebar dashboard.
   - Run `Token Saver: Open Interactive Dashboard` from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
   - Test toggle commands, status bar updates, Ponytail modes, and multi-IDE synchronization.

### Testing Antigravity Skills & Agent Rules
- **Windows (PowerShell)**:
  ```powershell
  .\scripts\install-skills.ps1
  ```
- **macOS / Linux (Bash)**:
  ```bash
  ./scripts/install-skills.sh
  ```
- Verify that slash commands (`/rtk-savedtokenon`, `/rtk-savedtokenoff`, `/rtk-gain`, `/rtk-diff`, `/rtk-outline`, `/rtk-doctor`, `/rtk-tree`, `/rtk-compress`, `/rtk-roi`, `/rtk-update`, `/ponytail`) work inside the chat interface.

### Testing Multi-IDE Rule Synchronization
- **Windows (PowerShell)**:
  ```powershell
  .\scripts\install-all-ide-rules.ps1
  ```
- **macOS / Linux (Bash)**:
  ```bash
  ./scripts/install-all-ide-rules.sh
  ```
- Verify that delimiters (`<!-- RTK_TOKEN_SAVER_START -->` / `<!-- RTK_TOKEN_SAVER_END -->`) correctly preserve existing file content when writing to `.cursorrules`, `.cursor/rules/rtk.mdc`, `.windsurfrules`, `.clinerules`, `CLAUDE.md`, and `AGENTS.md`.

---

## 📦 Packaging & Building

To compile and verify the extension package:

```bash
# Compile local VSIX package (updates latestvsixfile/token-saver-rtk-ide.vsix)
npm run package

# Or package via @vscode/vsce
npx @vscode/vsce package
```

---

## 📋 Pull Request Process

1. **Create a Branch**: Create a feature branch off `main` (e.g. `feature/support-new-agent` or `fix/statusbar-metrics`).
2. **Commit Changes**: Keep commits descriptive and atomic.
3. **Preserve Compatibility**: Ensure rules, delimiters, and scripts remain cross-platform (Windows PowerShell + macOS/Linux Bash).
4. **Update Documentation**: If adding a new IDE target or slash command, update [README.md](README.md) and [CHANGELOG.md](CHANGELOG.md).
5. **Submit PR**: Open a Pull Request against the `main` branch with a clear description of the changes and testing steps performed.

---

## 📬 Contact & Questions

Have questions, ideas, or feedback?
- Open an issue on [GitHub Issues](https://github.com/terenceooi99/token-saver-rtk-ide/issues)
- Email: [terenceooi1688@gmail.com](mailto:terenceooi1688@gmail.com)