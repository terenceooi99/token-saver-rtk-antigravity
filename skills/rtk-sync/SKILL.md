---
name: rtk-sync
description: >
  1-Click synchronization of RTK Token Saver rules across all AI agent and IDE config files.
  Activate when the user types /rtk-sync, /sync-rules, "sync rtk rules", or asks to
  update/propagate token saving rules to VS Code, Cursor, Windsurf, Cline, Roo Code, Claude, and Antigravity.
---

# 1-Click Multi-IDE Rule Sync (/rtk-sync)

Synchronize and inject the latest RTK Token Saver optimization rules and Headroom CCR directives into all target AI configuration files in the workspace.

## Target Config Files
- **Antigravity / Generic:** `AGENTS.md` and `~/.gemini/config/rules/AGENTS.md`
- **Cursor IDE:** `.cursorrules` and `.cursor/rules/rtk.mdc`
- **Windsurf IDE:** `.windsurfrules`
- **Cline / Roo Code:** `.clinerules`
- **Claude Code:** `CLAUDE.md`
- **VS Code GitHub Copilot:** `.github/copilot-instructions.md`

## Actions
1. Ensure the RTK Token Saver rule block is present and up-to-date with current compression directives.
2. Ensure skills are installed in `.agents/skills/` and global config.
3. Confirm sync completion across all detected targets.
