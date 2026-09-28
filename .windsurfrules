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