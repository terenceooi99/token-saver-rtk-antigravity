# Ponytail Code Simplification & Minimalism Rule

For every future update, feature addition, refactoring, or bug fix in this repository, the assistant and developers MUST adhere to the **Ponytail** engineering philosophy:

## 1. YAGNI & Extreme Minimalism
- **Simplest Solution First**: Choose the shortest, cleanest, most direct implementation that completely solves the problem. Avoid speculative abstractions, premature generalizations, or multi-layered architectures for simple tasks.
- **Zero Unnecessary Dependencies**: Maintain **0 external runtime dependencies** in `package.json`. Always leverage standard Node.js and VS Code extension APIs.

## 2. Standard Library First
- **Native Platform & JS Standard Features**: Use native standard methods (e.g., `String.prototype.localeCompare` with `{ numeric: true }`, built-in regex, `path`, `fs`, `os`, `child_process`) instead of hand-rolling custom comparison or utility algorithms.
- **No Hand-Rolled Frameworks**: Keep helper functions compact and single-purpose.

## 3. Deduplication & Shared Utilities
- **Centralize Common Logic**: Never duplicate UI messaging, state assembly, or file generation loops between panels (e.g., `dashboard-panel.js` and `sidebar-provider.js` must share `webview-helper.js`).
- **Single Source of Truth**: Data models, skill templates, and configuration constants must be declared once and reused across installation and validation routines.

## 4. Post-Implementation Ponytail Audit
Before finalizing any code changes or submitting updates:
1. **Delete**: Check for dead flags, unused imports, or speculative helper functions.
2. **Shrink**: Look for repetitive branching or verbose boilerplates that can be written in fewer, cleaner lines.
3. **Verify**: Ensure 100% functionality and test coverage while keeping line counts as compact as possible.
