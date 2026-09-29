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

## Why Use Symbol Outlining?

- **Full File Read:** Reading a 1,000-line file costs ~4,000 tokens.
- **AST Outline:** Inspecting the file's signatures and classes costs ~150–250 tokens (95% token savings).
- **Rule of Thumb:** Always outline unfamiliar files first to locate the exact target function before reading full line ranges.

## How to Execute

### 1. Outline Current / Specific File
Extract declarations, function signatures, and exported objects:
- **Node.js / JS / TS:** Scan class, method, function, export, and interface definitions.
- **Python:** \`rtk rg "^(class|def)\s+" <file>\`
- **Rust:** \`rtk rg "^(pub\s+)?(fn|struct|enum|trait|impl)\s+" <file>\`
- **Go:** \`rtk rg "^func\s+" <file>\`

### 2. Output Format
Present signatures with line numbers:
\`\`\`text
[Lines 1-45]   class UserService
  - Line 12:   constructor(db: DatabaseClient)
  - Line 24:   async getUserById(id: string): Promise<User>
  - Line 38:   async updateUserProfile(id: string, data: UpdateDTO): Promise<void>
\`\`\`
