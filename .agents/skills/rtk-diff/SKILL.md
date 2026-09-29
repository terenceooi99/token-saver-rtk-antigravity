---
name: rtk-diff
description: >
  Inspect git diffs with compact single-line context (-U1) through RTK output compression.
  Saves 50-70% of diff tokens compared to default multi-line diff outputs. Activate when
  the user types /rtk-diff, "compact diff", "minimal diff", or asks to review diffs efficiently.
argument-hint: "[staged|branch|file_path]"
license: MIT
---

# RTK Compact Diff (/rtk-diff)

Inspects git diffs using compact 1-line context (`-U1`) filtered through the RTK Rust Token Killer proxy.

## Why Compact Diffs?

Standard `git diff` includes 3–5 lines of context around every modification chunk. In multi-file reviews, this floods the LLM context with redundant unchanged code. `rtk git diff -U1` retains only the essential neighboring line, cutting context bloat by 50–70%.

## Commands

- **Working Directory Diff:**
  \`\`\`bash
  rtk git diff -U1
  \`\`\`
- **Staged Changes Diff:**
  \`\`\`bash
  rtk git diff --cached -U1
  \`\`\`
- **Single File Compact Diff:**
  \`\`\`bash
  rtk git diff -U1 -- <file_path>
  \`\`\`
- **Diff Stat / Summary Only:**
  \`\`\`bash
  rtk git diff --stat
  \`\`\`
