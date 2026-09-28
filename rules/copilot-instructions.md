# RTK (Rust Token Killer) Instructions for GitHub Copilot in VS Code

Prefix every shell/terminal execution command with `rtk`:
- `rtk git status`, `rtk git diff`, `rtk git log -n 5`
- `rtk npm test`, `rtk npm run build`, `rtk pnpm test`, `rtk yarn test`
- `rtk cargo build`, `rtk cargo test`
- `rtk pytest`, `rtk vitest`
- `rtk ls src/`, `rtk tree -L 2`, `rtk rg "pattern"`

Keep the `rtk` prefix inside chained commands:
`rtk git add . && rtk git commit -m "msg"`

Commands that RTK has no filter for run as-is, so prefixing with `rtk` is always completely safe and zero-overhead.

## Command Output & Token Optimization
Command output is filtered and condensed to save up to 60-90% LLM context window tokens while retaining all critical signals, errors, and test failures. Treat condensed output as the full result. Truncated outputs state their recovery path.
- `rtk gain` / `rtk gain --history`: View token savings scoreboard.
- `rtk proxy <cmd>`: Run command completely unfiltered if raw output is needed.
- `RTK_DISABLED=1 <cmd>`: Temporarily disable RTK for a single command.
