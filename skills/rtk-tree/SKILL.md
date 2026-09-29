---
name: rtk-tree
description: >
  Generate a token-optimized project structure map and directory skeleton, filtering out vendor and cache bloat.
  Activate when the user types /rtk-tree, /rtk-project-map, "project tree", "token tree",
  or asks for a compact workspace overview.
argument-hint: "[directory_path] [depth]"
license: MIT
---

# RTK Token-Optimized Project Tree (/rtk-tree)

Generates a concise, high-signal project skeleton while filtering out token-wasting noise.

## Noise Filtered Automatically
- `node_modules`, `target`, `dist`, `build`, `out`, `.next`, `.nuxt`, `bin`, `obj`
- `.git`, `.venv`, `__pycache__`, `.pytest_cache`, `.turbo`, `.gradle`
- `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `Cargo.lock`
- Coverage reports, minified bundles, and media binaries

## Execution
Run `rtk tree -L 2` or `rtk ls` on the target directory, annotating key architectural directories and entry points with minimal tokens.
