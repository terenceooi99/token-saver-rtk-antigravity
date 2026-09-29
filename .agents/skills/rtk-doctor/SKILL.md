---
name: rtk-doctor
description: >
  Quick health check and environment diagnostics for RTK and Headroom.
  Activate when the user types /rtk-doctor, /rtk-health, /rtk-status, "rtk doctor",
  "rtk check", or asks to verify if RTK and token saving are properly configured.
---

# RTK Health Check & Environment Diagnostics (/rtk-doctor)

Diagnose and verify that the RTK token optimization pipeline is running at full capacity.

## Verification Checklist

1. **RTK CLI Binary:**
   - Execute `rtk --version` in the terminal to verify the binary is installed and accessible on PATH.
   - If missing, guide the user to run `winget install rtk-ai.rtk` (Windows) or `brew install rtk` (macOS/Linux).

2. **Headroom Context Compression:**
   - Check if Headroom is available via `headroom --version` or `python -m headroom --version`.

3. **IDE Rules Configuration:**
   - Check that `AGENTS.md`, `.cursorrules`, `.windsurfrules`, `.clinerules`, or `CLAUDE.md` contains the `<!-- RTK_TOKEN_SAVER_START -->` block.

4. **Token Savings Check:**
   - Run `rtk gain` to confirm active token recording telemetry.

5. **Diagnostic Summary:**
   - Report active engine status, savings metrics, and any recommended fixes concisely.
