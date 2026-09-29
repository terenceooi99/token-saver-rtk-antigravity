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
- Run `rtk git diff -U1` to review unstaged changes with minimal context tokens.
- Run `rtk git diff --cached -U1` for staged reviews.
