<#
.SYNOPSIS
Installs and synchronizes RTK (Rust Token Killer) automation rules across all supported Agentic IDEs and AI tools:
- VS Code (GitHub Copilot): .github/copilot-instructions.md
- Cursor IDE: .cursorrules and .cursor/rules/rtk.mdc
- Windsurf IDE (Cascade): .windsurfrules
- Cline & Roo Code: .clinerules
- Claude Code: CLAUDE.md
- Universal AI Agents: AGENTS.md
- Antigravity IDE: ~/.gemini/config/rules/antigravity-rtk-rules.md & .agents/rules/
#>

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$ruleText = @"
<!-- RTK_TOKEN_SAVER_START -->
# RTK (Rust Token Killer) Optimization Rule

Prefix every shell/terminal execution command with \`rtk\`:
- \`rtk git status\`, \`rtk git diff\`, \`rtk git log -n 5\`
- \`rtk npm test\`, \`rtk npm run build\`, \`rtk pnpm test\`, \`rtk yarn test\`
- \`rtk cargo check\`, \`rtk cargo test\`, \`rtk cargo build\`
- \`rtk pytest\`, \`rtk vitest\`
- \`rtk ls src/\`, \`rtk tree -L 2\`, \`rtk rg "pattern"\`

Keep the prefix inside chains: \`rtk git add . && rtk git commit -m "msg"\`.
Commands RTK has no filter for run as-is, so the prefix is always safe.

### Output & Token Optimization
Command output is condensed to save 60-90% LLM context window tokens while preserving every critical signal, error, and exit code.
- \`rtk gain\` / \`rtk gain --history\` - View token savings scoreboard.
- \`rtk proxy <cmd>\` - Run a command unfiltered if raw output is strictly needed.
- \`RTK_DISABLED=1 <cmd>\` - Skip RTK for one command.
<!-- RTK_TOKEN_SAVER_END -->
"@

function Apply-RtkRuleToFile($filePath) {
    $parent = Split-Path -Parent $filePath
    if (-not (Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }

    if (Test-Path $filePath) {
        $content = Get-Content -Path $filePath -Raw
        if ($content -match '<!-- RTK_TOKEN_SAVER_START -->[\s\S]*?<!-- RTK_TOKEN_SAVER_END -->') {
            $updated = $content -replace '<!-- RTK_TOKEN_SAVER_START -->[\s\S]*?<!-- RTK_TOKEN_SAVER_END -->', $ruleText
            Set-Content -Path $filePath -Value $updated -NoNewline
            Write-Host " [UPDATE] Synced RTK block in: $filePath" -ForegroundColor Green
        } else {
            $updated = $content.Trim() + "`r`n`r`n" + $ruleText
            Set-Content -Path $filePath -Value $updated -NoNewline
            Write-Host " [APPEND] Injected RTK rule into: $filePath" -ForegroundColor Green
        }
    } else {
        Set-Content -Path $filePath -Value $ruleText -NoNewline
        Write-Host " [CREATE] Created rule file: $filePath" -ForegroundColor Cyan
    }
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  RTK Universal Multi-IDE & AI Agent Rule Synchronizer " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# 1. VS Code (Copilot)
Apply-RtkRuleToFile (Join-Path $projectRoot ".github\copilot-instructions.md")

# 2. Cursor
Apply-RtkRuleToFile (Join-Path $projectRoot ".cursorrules")
$cursorMdc = Join-Path $projectRoot ".cursor\rules\rtk.mdc"
$cursorMdcDir = Split-Path -Parent $cursorMdc
if (-not (Test-Path $cursorMdcDir)) { New-Item -ItemType Directory -Path $cursorMdcDir -Force | Out-Null }
$cursorMdcContent = @"
---
description: Automatically routes terminal execution commands through RTK (Rust Token Killer) to minimize context window consumption.
globs: *
alwaysApply: true
---

# RTK (Rust Token Killer) Automation

Always prefix terminal and CLI execution commands with \`rtk\` (e.g. \`rtk git status\`, \`rtk cargo test\`, \`rtk npm test\`, \`rtk pytest\`, \`rtk vitest\`, \`rtk ls\`, \`rtk rg\`).
- Output is compressed to save tokens while preserving critical errors and signal.
- In multi-command chains, prefix each sub-command: \`rtk git add . && rtk git commit -m "update"\`.
- Use \`rtk gain\` to review token savings metrics.
"@
Set-Content -Path $cursorMdc -Value $cursorMdcContent
Write-Host " [CREATE] Created Cursor MDC rule: $cursorMdc" -ForegroundColor Cyan

# 3. Windsurf
Apply-RtkRuleToFile (Join-Path $projectRoot ".windsurfrules")

# 4. Cline & Roo Code
Apply-RtkRuleToFile (Join-Path $projectRoot ".clinerules")

# 5. Claude Code
Apply-RtkRuleToFile (Join-Path $projectRoot "CLAUDE.md")

# 6. Universal Agent
Apply-RtkRuleToFile (Join-Path $projectRoot "AGENTS.md")

# 7. Antigravity IDE (Workspace & Global)
Apply-RtkRuleToFile (Join-Path $projectRoot ".agents\rules\antigravity-rtk-rules.md")
$globalGeminiRules = Join-Path $env:USERPROFILE ".gemini\config\rules\antigravity-rtk-rules.md"
Apply-RtkRuleToFile $globalGeminiRules

Write-Host "`nAll AI Agent and IDE rules successfully synchronized!" -ForegroundColor Green
