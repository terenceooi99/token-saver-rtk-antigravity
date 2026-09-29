---
name: publishtokensaverlocal
description: >
  Compiles and packages the local VS Code / IDE extension into a .vsix file and replaces
  latestvsixfile/token-saver-rtk-ide.vsix for internal testing without publishing to GitHub or Open VSX.
  Activate when the user types /publishtokensaverlocal, "publish tokensaver local", "compile local vsix",
  "build local vsix", or asks to package the latest extension locally.
---

# Package Token Saver Locally (/publishtokensaverlocal)

Compiles the extension locally into `latestvsixfile/token-saver-rtk-ide.vsix` and `token-saver-rtk-ide-<version>.vsix` without bumping git tags, pushing commits, or triggering GitHub Actions.

## Execution Steps

1. **Run Local Packaging Script**:
   ```powershell
   rtk powershell -ExecutionPolicy Bypass -File scripts/package-vsix.ps1
   ```

2. **Verify Output**:
   Confirm that [token-saver-rtk-ide.vsix](file:///c:/MSI/Vibe%20Code%20Project/token-saver-rtk-ide/latestvsixfile/token-saver-rtk-ide.vsix) has been generated and updated in `latestvsixfile/`.

3. **Install Locally (Optional)**:
   ```powershell
   code --install-extension "latestvsixfile/token-saver-rtk-ide.vsix"
   ```
