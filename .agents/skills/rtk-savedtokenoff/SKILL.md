---
name: rtk-savedtokenoff
description: >
  Disable RTK (Rust Token Killer) automatic token saving mode for Antigravity IDE.
  Activate when the user types /rtk-savedtokenoff, "rtk off", "disable rtk", or asks to
  turn off automatic RTK command prefixing. When active, revert to normal direct
  command execution without prefixing commands with `rtk`.
---

# RTK Token Saving Mode (DISABLED)

RTK (Rust Token Killer) automatic token saving mode is **DISABLED**.

## Behavior Rules

1. **Normal Command Execution**:
   Execute shell and CLI commands directly without automatically prepending `rtk` (e.g., `git status`, `npm test`, `cargo test`).
2. **Re-enabling**:
   The user can re-enable RTK automation at any time by typing `/rtk-savedtokenon`.
3. **Savings Review**:
   The user or assistant can still run `rtk gain` at any time to inspect past token savings.