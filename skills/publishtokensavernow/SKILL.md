---
name: publishtokensavernow
description: >
  Automates bumping version, tagging, and publishing Token Saver (RTK) extension to Open VSX and GitHub Releases.
  Activate when the user types /publishtokensavernow, "publish tokensaver now", "publish to openvsx", or asks to publish a new release of this extension.
---

# Token Saver Automated OpenVSX Publisher

When `/publishtokensavernow` is triggered:

1. **Determine Version Bump**:
   - Check current version in `package.json`.
   - Default bump is **patch** (e.g., `1.2.0` -> `1.2.1`).
   - If user explicitly requested `minor`, `major`, or a specific version like `1.3.0`, use that instead.

2. **Execute Automation Script**:
   Run the project publishing script via terminal:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/publish-tokensaver.ps1
   ```
   *(Or if a specific bump type was given: `powershell -ExecutionPolicy Bypass -File scripts/publish-tokensaver.ps1 -BumpType minor` or `-CustomVersion 1.3.0`)*

3. **Verify Pipeline Status**:
   - Confirm the new git tag `v<version>` was pushed to `origin main`.
   - Provide the user with direct monitoring links:
     - 🚀 **GitHub Actions Pipeline**: `https://github.com/terenceooi99/token-saver-rtk-antigravity/actions`
     - 📦 **Open VSX Extension Page**: `https://open-vsx.org/extension/terenceooi/token-saver-rtk-antigravity`
