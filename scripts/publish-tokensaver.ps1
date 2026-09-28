<#
.SYNOPSIS
Automates version bumping, tagging, and triggering Open VSX + GitHub Releases deployment for Token Saver (RTK).
#>

param (
    [string]$BumpType = "patch",
    [string]$CustomVersion = ""
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$packageJsonPath = Join-Path $projectRoot "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Error "package.json not found at $packageJsonPath"
}

# Read package.json
$jsonContent = Get-Content -Path $packageJsonPath -Raw
$packageData = $jsonContent | ConvertFrom-Json
$currentVersion = $packageData.version

Write-Host "Current version in package.json: v$currentVersion" -ForegroundColor Cyan

# Calculate new version
$newVersion = ""
if ($CustomVersion -ne "") {
    $newVersion = $CustomVersion.TrimStart("v")
} else {
    $parts = $currentVersion.Split(".")
    if ($parts.Length -lt 3) {
        $parts = @($parts[0], $parts[1], "0")
    }
    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]

    switch ($BumpType.ToLower()) {
        "major" { $major += 1; $minor = 0; $patch = 0 }
        "minor" { $minor += 1; $patch = 0 }
        default { $patch += 1 }
    }
    $newVersion = "$major.$minor.$patch"
}

Write-Host "Target new version: v$newVersion" -ForegroundColor Green

# Update version in package.json
$updatedJson = $jsonContent -replace '("version":\s*")[^"]+(")', ('$1' + $newVersion + '$2')
[System.IO.File]::WriteAllText($packageJsonPath, $updatedJson, [System.Text.Encoding]::UTF8)
Write-Host " [OK] Updated package.json version to $newVersion" -ForegroundColor Green

# Git commit, tag, and push
Set-Location $projectRoot

Write-Host "Staging and committing release v$newVersion..." -ForegroundColor Yellow
git add package.json README.md CHANGELOG.md .github/workflows/publish-openvsx.yml scripts/publish-tokensaver.ps1
git commit -m "chore(release): v$newVersion" --allow-empty
git tag -a "v$newVersion" -m "Release v$newVersion" -f

Write-Host "Pushing commit and tag v$newVersion to origin main..." -ForegroundColor Yellow
git push origin main
git push origin "v$newVersion" -f

Write-Host "`n Successfully published release tag v$newVersion!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " GitHub Actions Workflow Triggered:" -ForegroundColor Cyan
Write-Host "    https://github.com/terenceooi99/token-saver-rtk-ide/actions" -ForegroundColor White
Write-Host " Open VSX Extension Listing:" -ForegroundColor Cyan
Write-Host "    https://open-vsx.org/extension/terenceooi/token-saver-rtk-ide" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
