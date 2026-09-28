---
name: rtk-savedtokenon
description: >
  Enable RTK (Rust Token Killer) automatic token saving mode for Antigravity IDE and AI Agents.
  Activate when the user types /rtk-savedtokenon, "rtk on", "enable rtk", or asks to
  automate RTK token saving for all terminal actions. When active, all shell/terminal commands
  executed by the assistant (git, cargo, npm, pnpm, vitest, pytest, ls, rg, tree, diff, etc.)
  MUST be automatically prefixed with `rtk ` until /rtk-savedtokenoff is invoked.
---

# RTK Automatic Token Saver Mode (Enabled)

All shell/terminal execution commands must be prefixed with `rtk ` to save LLM tokens.
