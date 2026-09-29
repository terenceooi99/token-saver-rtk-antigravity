---
name: rtk-run
description: >
  Execute arbitrary terminal/shell commands through RTK output compression proxy.
  Activate when the user types /rtk-run <cmd>, /rtk-exec <cmd>, "run compressed",
  or asks to run a shell command with RTK token saving applied.
argument-hint: "<command>"
license: MIT
---

# RTK Compressed Command Runner (/rtk-run)

Executes any shell or CLI command through the `rtk` compression filter, minimizing token footprint in the LLM response context.

## Usage
- Prefix the target command with `rtk`: `rtk <command>`
- For commands without native RTK filters, RTK acts as a safe transparent proxy.
- Example: `/rtk-run git status` executes `rtk git status`.
- Example: `/rtk-run npm test` executes `rtk npm test`.
- Example: `/rtk-run cargo build` executes `rtk cargo build`.
