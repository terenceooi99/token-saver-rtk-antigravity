# RTK (Rust Token Killer) Automation Rule for Antigravity IDE

Prefix every shell command with `rtk`: `rtk git status`, `rtk cargo test`, `rtk npm run build`, `rtk ls src/`. Keep the prefix inside chains: `rtk git add . && rtk git commit -m "msg"`. Commands RTK has no filter for run as-is, so the prefix is always safe.

## Command output
Command output here is condensed to save tokens, keeping every signal and dropping costly noise. Treat it as the complete result: run commands normally, and batch related commands into one call to avoid extra turns. Truncated results state their recovery path in their own output. Re-run a command as `rtk proxy <cmd>` only when its result is unusable: empty when output was clearly expected, contradicting its exit code, or garbled.

## About RTK
RTK (Rust Token Killer) is a high-performance CLI proxy that filters command output to save tokens; behavior and exit code are unchanged.

- `rtk gain` / `rtk gain --history` - token savings, overall and per command.
- `rtk proxy <cmd>` - run a command unfiltered, still tracked.
- `RTK_DISABLED=1 <cmd>` - skip RTK for one command.
- `rtk discover` - find past commands RTK could have condensed.

<!-- RTK_TOKEN_SAVER_START -->
# RTK (Rust Token Killer) Optimization Rule

Prefix every shell/terminal execution command with \tk\:
- \tk git status\, \tk git diff\, \tk git log -n 5\
- \tk npm test\, \tk npm run build\, \tk pnpm test\, \tk yarn test\
- \tk cargo check\, \tk cargo test\, \tk cargo build\
- \tk pytest\, \tk vitest\
- \tk ls src/\, \tk tree -L 2\, \tk rg "pattern"\

Keep the prefix inside chains: \tk git add . && rtk git commit -m "msg"\.
Commands RTK has no filter for run as-is, so the prefix is always safe.

### Output & Token Optimization
Command output is condensed to save 60-90% LLM context window tokens while preserving every critical signal, error, and exit code.
- \tk gain\ / \tk gain --history\ - View token savings scoreboard.
- \tk proxy <cmd>\ - Run a command unfiltered if raw output is strictly needed.
- \RTK_DISABLED=1 <cmd>\ - Skip RTK for one command.
<!-- RTK_TOKEN_SAVER_END -->