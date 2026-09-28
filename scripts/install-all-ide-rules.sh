#!/usr/bin/env bash
# RTK Universal Multi-IDE & AI Agent Rule Synchronizer (Bash)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

RULE_BLOCK='<!-- RTK_TOKEN_SAVER_START -->
# RTK (Rust Token Killer) Optimization Rule

Prefix every shell/terminal execution command with `rtk`:
- `rtk git status`, `rtk git diff`, `rtk git log -n 5`
- `rtk npm test`, `rtk npm run build`, `rtk pnpm test`, `rtk yarn test`
- `rtk cargo check`, `rtk cargo test`, `rtk cargo build`
- `rtk pytest`, `rtk vitest`
- `rtk ls src/`, `rtk tree -L 2`, `rtk rg "pattern"`

Keep the prefix inside chains: `rtk git add . && rtk git commit -m "msg"`.
Commands RTK has no filter for run as-is, so the prefix is always safe.

### Output & Token Optimization
Command output is condensed to save 60-90% LLM context window tokens while preserving every critical signal, error, and exit code.
- `rtk gain` / `rtk gain --history` - View token savings scoreboard.
- `rtk proxy <cmd>` - Run a command unfiltered if raw output is strictly needed.
- `RTK_DISABLED=1 <cmd>` - Skip RTK for one command.
<!-- RTK_TOKEN_SAVER_END -->'

apply_rule() {
    local target_file="$1"
    local dir_name="$(dirname "$target_file")"
    mkdir -p "$dir_name"

    if [ -f "$target_file" ]; then
        if grep -q "<!-- RTK_TOKEN_SAVER_START -->" "$target_file"; then
            echo " [UPDATE] Updating RTK block in $target_file"
            # Replace between markers or rewrite
            awk -v rule="$RULE_BLOCK" '
                /<!-- RTK_TOKEN_SAVER_START -->/ { print rule; skip=1; next }
                /<!-- RTK_TOKEN_SAVER_END -->/ { skip=0; next }
                !skip { print }
            ' "$target_file" > "${target_file}.tmp" && mv "${target_file}.tmp" "$target_file"
        else
            echo " [APPEND] Appending RTK rule to $target_file"
            printf "\n\n%s\n" "$RULE_BLOCK" >> "$target_file"
        fi
    else
        echo " [CREATE] Creating $target_file"
        printf "%s\n" "$RULE_BLOCK" > "$target_file"
    fi
}

echo "======================================================="
echo "  RTK Universal Multi-IDE & AI Agent Rule Synchronizer "
echo "======================================================="

apply_rule "$PROJECT_ROOT/.github/copilot-instructions.md"
apply_rule "$PROJECT_ROOT/.cursorrules"
apply_rule "$PROJECT_ROOT/.windsurfrules"
apply_rule "$PROJECT_ROOT/.clinerules"
apply_rule "$PROJECT_ROOT/CLAUDE.md"
apply_rule "$PROJECT_ROOT/AGENTS.md"
apply_rule "$PROJECT_ROOT/.agents/rules/antigravity-rtk-rules.md"

if [ -n "$HOME" ]; then
    apply_rule "$HOME/.gemini/config/rules/antigravity-rtk-rules.md"
fi

echo ""
echo "✅ All AI Agent & IDE rules successfully synchronized!"
