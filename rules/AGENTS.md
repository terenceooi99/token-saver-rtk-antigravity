# Universal AI Agent Instructions (AGENTS.md)

## RTK (Rust Token Killer) Execution Standard
All autonomous AI coding agents executing shell or terminal commands in this repository MUST prefix commands with `rtk`:
- `rtk git status`, `rtk git diff`, `rtk git log -n 5`
- `rtk cargo check`, `rtk cargo test`, `rtk cargo build`
- `rtk npm test`, `rtk npm run build`, `rtk pnpm test`, `rtk yarn test`
- `rtk pytest`, `rtk vitest`
- `rtk ls src/`, `rtk tree -L 2`, `rtk rg "pattern"`

### Guarantees:
1. **Token Savings**: Output is filtered to save 60%-90% context window tokens without losing errors, warnings, or exit codes.
2. **Transparent Fallback**: Non-filtered commands pass through unaffected.
3. **Scoreboard**: Run `rtk gain` to review accumulated token savings.
