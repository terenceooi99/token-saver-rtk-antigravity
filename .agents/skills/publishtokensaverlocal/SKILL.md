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
