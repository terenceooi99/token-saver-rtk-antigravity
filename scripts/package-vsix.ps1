<#
.SYNOPSIS
Packages the VS Code extension into a compliant .vsix file for internal distribution and replaces latestvsixfile/token-saver-rtk-ide.vsix.
#>

param (
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

$packageJsonPath = Join-Path $projectRoot "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Error "package.json not found at $packageJsonPath"
}

# Read package.json
$jsonContent = [System.IO.File]::ReadAllText($packageJsonPath)
$packageData = $jsonContent | ConvertFrom-Json
$version = $packageData.version
$name = $packageData.name
$displayName = [System.Security.SecurityElement]::Escape($packageData.displayName)
$description = [System.Security.SecurityElement]::Escape($packageData.description)
$publisher = $packageData.publisher
$engineVersion = $packageData.engines.vscode

Write-Host "Packaging $name v$version for internal use..." -ForegroundColor Cyan

# Prepare staging folders
$stagingDir = Join-Path $projectRoot "_staging_vsix"
$stagingExtensionDir = Join-Path $stagingDir "extension"

if (Test-Path $stagingDir) {
    Remove-Item -Recurse -Force $stagingDir
}
New-Item -ItemType Directory -Path $stagingExtensionDir -Force | Out-Null

# 1. Generate [Content_Types].xml
$contentTypesXml = @'
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension=".css" ContentType="text/css"/><Default Extension=".html" ContentType="text/html"/><Default Extension=".js" ContentType="application/javascript"/><Default Extension=".json" ContentType="application/json"/><Default Extension=".md" ContentType="text/markdown"/><Default Extension=".mdc" ContentType="application/octet-stream"/><Default Extension=".png" ContentType="image/png"/><Default Extension=".ps1" ContentType="text/plain"/><Default Extension=".sh" ContentType="text/plain"/><Default Extension=".svg" ContentType="image/svg+xml"/><Default Extension=".txt" ContentType="text/plain"/><Default Extension=".vsixmanifest" ContentType="text/xml"/></Types>
'@
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText((Join-Path $stagingDir "[Content_Types].xml"), $contentTypesXml, $utf8NoBom)

# 2. Generate extension.vsixmanifest
$vsixManifestXml = @"
<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
	<Metadata>
		<Identity Language="en-US" Id="$name" Version="$version" Publisher="$publisher" />
		<DisplayName>$displayName</DisplayName>
		<Description xml:space="preserve">$description</Description>
		<Tags>vscode,copilot,cursor,windsurf,cline,roo-code,claude-code,antigravity,rtk,token-saver,token-killer,ai-agents,context-window,llm,compression,rust</Tags>
		<Categories>AI,Other,Programming Languages</Categories>
		<GalleryFlags>Public</GalleryFlags>
		<Properties>
			<Property Id="Microsoft.VisualStudio.Code.Engine" Value="$engineVersion" />
			<Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace" />
			<Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.EnabledApiProposals" Value="" />
			<Property Id="Microsoft.VisualStudio.Code.ExecutesCode" Value="true" />
			<Property Id="Microsoft.VisualStudio.Services.Links.Source" Value="https://github.com/terenceooi99/token-saver-rtk-ide.git" />
			<Property Id="Microsoft.VisualStudio.Services.Links.Getstarted" Value="https://github.com/terenceooi99/token-saver-rtk-ide.git" />
			<Property Id="Microsoft.VisualStudio.Services.Links.GitHub" Value="https://github.com/terenceooi99/token-saver-rtk-ide.git" />
			<Property Id="Microsoft.VisualStudio.Services.Links.Support" Value="https://github.com/terenceooi99/token-saver-rtk-ide/issues" />
			<Property Id="Microsoft.VisualStudio.Services.Links.Learn" Value="https://github.com/terenceooi99/token-saver-rtk-ide#readme" />
			<Property Id="Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown" Value="true" />
			<Property Id="Microsoft.VisualStudio.Services.Content.Pricing" Value="Free"/>
		</Properties>
		<License>extension/LICENSE.txt</License>
		<Icon>extension/resources/icon.png</Icon>
	</Metadata>
	<Installation>
		<InstallationTarget Id="Microsoft.VisualStudio.Code"/>
	</Installation>
	<Dependencies/>
	<Assets>
		<Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
		<Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/readme.md" Addressable="true" />
		<Asset Type="Microsoft.VisualStudio.Services.Content.Changelog" Path="extension/changelog.md" Addressable="true" />
		<Asset Type="Microsoft.VisualStudio.Services.Content.License" Path="extension/LICENSE.txt" Addressable="true" />
		<Asset Type="Microsoft.VisualStudio.Services.Icons.Default" Path="extension/resources/icon.png" Addressable="true" />
	</Assets>
</PackageManifest>
"@
[System.IO.File]::WriteAllText((Join-Path $stagingDir "extension.vsixmanifest"), $vsixManifestXml, $utf8NoBom)

# 3. Copy files to extension/
$itemsToCopy = @(
    "extension",
    "resources",
    "rules",
    "skills",
    ".agents",
    ".cursor",
    ".vscode",
    ".clinerules",
    ".cursorrules",
    ".windsurfrules",
    "AGENTS.md",
    "CLAUDE.md",
    "package.json"
)

foreach ($item in $itemsToCopy) {
    $srcPath = Join-Path $projectRoot $item
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $stagingExtensionDir -Recurse -Force
    }
}

# Copy documentation files
if (Test-Path (Join-Path $projectRoot "README.md")) {
    Copy-Item (Join-Path $projectRoot "README.md") (Join-Path $stagingExtensionDir "readme.md") -Force
}
if (Test-Path (Join-Path $projectRoot "CHANGELOG.md")) {
    Copy-Item (Join-Path $projectRoot "CHANGELOG.md") (Join-Path $stagingExtensionDir "changelog.md") -Force
}
if (Test-Path (Join-Path $projectRoot "LICENSE")) {
    Copy-Item (Join-Path $projectRoot "LICENSE") (Join-Path $stagingExtensionDir "LICENSE.txt") -Force
} elseif (Test-Path (Join-Path $projectRoot "LICENSE.txt")) {
    Copy-Item (Join-Path $projectRoot "LICENSE.txt") (Join-Path $stagingExtensionDir "LICENSE.txt") -Force
}

# 4. Create ZIP archive and rename to .vsix
$tempZip = Join-Path $projectRoot "temp_package.zip"
if (Test-Path $tempZip) {
    Remove-Item -Force $tempZip
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingDir, $tempZip)

# Target outputs
$latestVsixDir = Join-Path $projectRoot "latestvsixfile"
if (-not (Test-Path $latestVsixDir)) {
    New-Item -ItemType Directory -Path $latestVsixDir -Force | Out-Null
}

$latestVsixFile = Join-Path $latestVsixDir "token-saver-rtk-ide.vsix"
$versionedVsixFile = Join-Path $projectRoot "$name-$version.vsix"

Copy-Item $tempZip $latestVsixFile -Force
Move-Item $tempZip $versionedVsixFile -Force

# Cleanup staging
Remove-Item -Recurse -Force $stagingDir

Write-Host " [OK] Compiled VSIX Package Successfully!" -ForegroundColor Green
Write-Host " Latest internal VSIX: $latestVsixFile" -ForegroundColor Cyan
Write-Host " Versioned VSIX:       $versionedVsixFile" -ForegroundColor Cyan
