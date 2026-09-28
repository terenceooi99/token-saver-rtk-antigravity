---
name: rtk-update
description: >
  Manually check and update RTK (Rust Token Killer) CLI binary from upstream GitHub repository (rtk-ai/rtk).
  Activate when the user types /rtk-update, "rtk update", "update rtk", "sync rtk", or asks to
  manually update upstream GitHub RTK sync.
---

# Upstream GitHub RTK Sync & Update (/rtk-update)

Manually update and synchronize the RTK (Rust Token Killer) CLI binary with the latest upstream release from GitHub (`rtk-ai/rtk`).

## Execution Steps

1. **Check Local RTK Version:**
   Run `rtk --version` to determine the currently installed RTK binary version.

2. **Fetch Upstream Release & Update:**
   Run the platform-appropriate update command:
   - **Windows (PowerShell / Winget):**
     ```powershell
     winget upgrade --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements
     ```
     *Fallback if installed via Cargo:*
     ```powershell
     cargo install --git https://github.com/rtk-ai/rtk --force
     ```
   - **macOS:**
     ```bash
     brew upgrade rtk || (curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash)
     ```
   - **Linux / Generic Unix:**
     ```bash
     curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash
     ```

3. **Verify Installation:**
   Run `rtk --version` and `rtk gain` to confirm the binary is active, functioning, and displays the latest metrics scoreboard.
