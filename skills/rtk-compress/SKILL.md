---
name: rtk-compress
description: >
  Compress raw text, massive stack traces, huge JSON payloads, or verbose logs before sending into context.
  Activate when the user types /rtk-compress, /headroom-compress, "compress logs", "compress json",
  or asks to condense a large payload to save prompt tokens.
argument-hint: "[text|json|log_file_path]"
license: MIT
---

# RTK / Headroom Context Compression (/rtk-compress)

Condense heavy textual data, build logs, stack traces, or deep JSON payloads to minimize LLM prompt token consumption while preserving critical semantic context.

## Compression Strategies
1. **JSON Payloads:** Strip null/empty fields, trim large redundant arrays to representative samples, and collapse metadata headers.
2. **Build / Test Logs:** Retain only the failed assertions, error messages, root stack traces, and exit codes; strip repetitive passing progress bars.
3. **Large Files / Dumps:** Use Headroom CCR (Compress-Cache-Retrieve) pattern or extract structural outline instead of full raw content.
