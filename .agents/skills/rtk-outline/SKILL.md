---
name: rtk-outline
description: >
  Generate a concise AST / symbol outline (classes, methods, signatures, exported symbols)
  of a file or directory instead of reading whole files. Saves 80-95% context window tokens
  during codebase exploration. Activate when the user types /rtk-outline, /rtk-map,
  "outline file", "symbol outline", or asks to inspect file structure without full bodies.
argument-hint: "[file_path|directory_path]"
license: MIT
---

# RTK AST / Symbol Outliner (/rtk-outline)

Generates a compact structural outline of code files or directories. By displaying only declarations, classes, function signatures, interfaces, and exported symbols, it provides 100% of architectural context using less than 10% of the token cost.

- Inspect symbol outlines before reading full files.
- Extracts classes, functions, exports, and types with exact line numbers.
