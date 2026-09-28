<#
.SYNOPSIS
Installs Token Saver (RTK) skills into Antigravity IDE global config directory (~/.gemini/config/skills).
#>

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$globalConfigSkills = Join-Path $env:USERPROFILE ".gemini\config\skills"

if (-not (Test-Path $globalConfigSkills)) {
    New-Item -ItemType Directory -Path $globalConfigSkills -Force | Out-Null
}

$skills = @("rtk-savedtokenon", "rtk-savedtokenoff", "rtk-gain", "publishtokensavernow")

foreach ($skill in $skills) {
    $srcDir = Join-Path $projectRoot "skills\$skill"
    $destDir = Join-Path $globalConfigSkills $skill

    if (Test-Path $srcDir) {
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path "$srcDir\*" -Destination $destDir -Recurse -Force
        Write-Host " [OK] Installed skill: /$skill to $destDir" -ForegroundColor Green
    } else {
        Write-Warning "Source directory not found: $srcDir"
    }
}

Write-Host "`nToken Saver (RTK) skills installed successfully!" -ForegroundColor Cyan
Write-Host "You can now type / in any Antigravity IDE chat to use:" -ForegroundColor Yellow
Write-Host "  - /rtk-savedtokenon      (Turn on automated RTK prefixing)"
Write-Host "  - /rtk-savedtokenoff     (Turn off automated RTK prefixing)"
Write-Host "  - /rtk-gain              (Show token savings dashboard)"
Write-Host "  - /publishtokensavernow  (Automate version bump & publish to Open VSX)"