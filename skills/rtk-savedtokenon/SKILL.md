---
name: rtk-savedtokenon
description: >
  Enable RTK (Rust Token Killer) automatic token saving mode for Antigravity IDE.
  Activate when the user types /rtk-savedtokenon, "rtk on", "enable rtk", or asks to
  automate RTK token saving for all terminal actions. When active, all shell/terminal
  commands executed by the assistant (git, cargo, npm, pnpm, vitest, pytest, ls, rg,
  tree, diff, etc.) MUST be automatically prefixed with `rtk ` until /rtk-savedtokenoff
  is invoked.
---

# RTK Token Saving Mode (ACTIVE)

RTK (Rust Token Killer) token saving mode is **ENABLED**.

## Behavior & Automation Rules

1. **Prefix All Shell Commands with `rtk`**:
   Whenever running terminal / CLI commands via `run_command` (or terminal execution), automatically prefix the command with `rtk `.
   
   Examples:
   - `git status` -> `rtk git status`
   - `git diff` -> `rtk git diff`
   - `cargo test` -> `rtk cargo test`
   - `npm test` / `npm run build` -> `rtk npm test` / `rtk npm run build`
   - `pytest` -> `rtk pytest`
   - `pnpm test` -> `rtk pnpm test`
   - `vitest` -> `rtk vitest`
   - `tsc` -> `rtk tsc`
   - `ruff check` -> `rtk ruff check`
   - `tree` / `ls` -> `rtk tree` / `rtk ls`
   - `rg <pattern>` -> `rtk rg <pattern>`

2. **Command Chains**:
   Keep the `rtk` prefix on chained commands:
   - `rtk git add . && rtk git commit -m "..."`

3. **Pass-through Safety**:
   Commands that RTK has no custom filter for are automatically executed as-is by RTK's runner, so prefixing is always safe.

4. **Raw Unfiltered Fallback**:
   If an RTK condensed output is ever ambiguous or truncated when full output was strictly necessary, run `rtk proxy <cmd>` or `RTK_DISABLED=1 <cmd>`.

5. **Persistence**:
   This mode remains ACTIVE for all subsequent turns in the chat until the user explicitly invokes `/rtk-savedtokenoff`.

6. **Status Check**:
   Use `rtk gain` to view token savings stats.