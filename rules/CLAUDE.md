# Claude Code RTK Instructions

## CLI Command Prefixing
Always prefix shell and terminal execution commands with `rtk` (e.g., `rtk git status`, `rtk git diff`, `rtk cargo test`, `rtk npm test`, `rtk pytest`, `rtk vitest`, `rtk ls`, `rtk rg`).
- RTK is a zero-friction proxy that cleans command output to drastically reduce token usage while preserving all crucial errors, stack traces, and exit codes.
- Commands without dedicated RTK filters pass through unmodified.
- Run `rtk gain` to review token savings metrics.
