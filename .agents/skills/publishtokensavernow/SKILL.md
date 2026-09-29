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
   - If user explicitly requested `minor`, `major`, or a specific version like `1.3.0` or `1.4.0`, use that instead.

2. **Update CHANGELOG.md First**:
   - Verify that `CHANGELOG.md` contains a dedicated section for the target version (e.g., `## [1.4.0] - YYYY-MM-DD` or `## [1.3.0]`).
   - Document all notable features, fixes, and improvements under `### Added & Improved` or `### Fixed`.
   - Open VSX extracts the changelog strictly from `CHANGELOG.md` inside the `.vsix` archive; without this header matching the new version, Open VSX will show an empty changes page.

3. **Execute Automation Script**:
   Run the project publishing script via terminal:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/publish-tokensaver.ps1
   ```
   *(Or if a specific bump type was given: `powershell -ExecutionPolicy Bypass -File scripts/publish-tokensaver.ps1 -BumpType minor` or `-CustomVersion 1.3.0`)*

4. **Verify Pipeline Status**:
   - Confirm the new git tag `v<version>` was pushed to `origin main`.
   - Provide the user with direct monitoring links:
     - 🚀 **GitHub Actions Pipeline**: `https://github.com/terenceooi99/token-saver-rtk-ide/actions`
     - 📦 **Open VSX Extension Page**: `https://open-vsx.org/extension/terenceooi/token-saver-rtk-ide`

## ⚠️ Critical Release Guardrails
1. **Mandatory CHANGELOG.md Version Header**:
   - Always ensure `CHANGELOG.md` has the `## [X.Y.Z] - YYYY-MM-DD` header matching the target version before tagging. Open VSX parses the changelog statically from the `.vsix` package; missing headers cause empty changelog pages on the marketplace.
2. **Never use `[skip ci]` on Release Commits**:
   - When tagging a commit for CI-based publishing (Open VSX / GitHub Releases), the commit message must NOT contain `[skip ci]` or `[ci skip]`, otherwise GitHub Actions completely ignores the tag push.
3. **Always write JSON without UTF-8 BOM**:
   - In PowerShell scripts, use `New-Object System.Text.UTF8Encoding $false` when writing `package.json` to prevent inserting Byte Order Marks (`0xEF 0xBB 0xBF`) that cause Node.js and `@vscode/vsce` JSON parser errors.
4. **PowerShell Regex Capture Group Isolation (`${1}`)**:
   - In PowerShell `-replace` expressions modifying `package.json`, always use `${1}` (e.g. `'${1}' + $newVersion + '$2'`) rather than `$1` to prevent digits at the start of `$newVersion` (e.g., `1.3.0`) from being parsed as capture group `$11`.
5. **VS Code Root Icon vs View Icon Requirements**:
   - Root `package.json` `"icon"` must always be a PNG (`resources/icon.png`, minimum 128x128 square). SVGs are disallowed at root.
   - `contributes.viewsContainers` and `contributes.views` should use SVG vector icons (`resources/activity-icon.svg`) for theme tinting and scaling.
6. **Full Workspace Staging (`git add -A`)**:
   - Release commits must stage all workspace changes (`git add -A`) before tagging so newly added providers, resources, and webview assets are included in the published package.