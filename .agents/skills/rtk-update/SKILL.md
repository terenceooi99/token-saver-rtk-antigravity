---
name: rtk-update
description: >
  Manually check and update upstream GitHub repositories (rtk-ai/rtk, headroomlabs-ai/headroom, and DietrichGebert/ponytail).
  Activate when the user types /rtk-update, /headroom-sync, /ponytail-sync, "update upstream", "sync rtk", or asks to
  synchronize upstream tools.
---

# Upstream GitHub Sync & Update (/rtk-update)

Manually update and synchronize the upstream token saver engines:
1. **RTK (Rust Token Killer):** CLI binary from GitHub (`rtk-ai/rtk`)
2. **Headroom:** Context compression engine from GitHub (`headroomlabs-ai/headroom`)
3. **Ponytail:** YAGNI token saver suite from GitHub (`DietrichGebert/ponytail`)

## Execution Steps

1. **Check Local Engine Versions:**
   - Run `rtk --version` to check the installed RTK binary version.
   - Run `headroom --version` (or `python -m headroom --version`) to check Headroom.
   - Verify Ponytail skills in global config (`~/.gemini/config/skills/ponytail/SKILL.md`).

2. **Fetch Upstream Release & Update:**
   - **RTK (CLI):**
     - *Windows:* `winget upgrade --id rtk-ai.rtk --accept-source-agreements --accept-package-agreements`
     - *macOS:* `brew upgrade rtk || (curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash)`
     - *Linux:* `curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/main/install.sh | bash`
   - **Headroom (Context Compression Layer):**
     - `pip install --upgrade "headroom-ai[all]"` or `pipx upgrade headroom-ai`
   - **Ponytail (YAGNI Suite):**
     - Fetch/sync latest skills from `https://github.com/DietrichGebert/ponytail` to `~/.gemini/config/skills/` and `.agents/skills/`.

3. **Verify Installation:**
   - Run `rtk --version` and `rtk gain` for CLI compression.
   - Run `headroom --version` for context compression.
   - Run `/ponytail` or `/ponytail-help` for YAGNI mode.
