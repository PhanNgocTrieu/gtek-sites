# GTek website local setup - native Windows PowerShell.
# Prefer this on Windows if Git Bash / WSL is not installed.
#
#   powershell -ExecutionPolicy Bypass -File .\setup.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

$MinMajor = 18
$MinMinor = 17
$TargetMajor = 20

function Write-Info($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "==> $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "==> $msg" -ForegroundColor Yellow }

if (-not (Test-Path (Join-Path $Root "package.json"))) {
  throw "package.json not found. Run this script from the project root."
}

function Refresh-Path {
  $machine = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
  $user = [System.Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = "$machine;$user"
}

function Get-NodeVersion {
  Refresh-Path
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if (-not $cmd) { return $null }
  $raw = (& node -v 2>$null)
  if (-not $raw) { return $null }
  return $raw.TrimStart("v")
}

function Test-NodeVersionOk {
  $ver = Get-NodeVersion
  if (-not $ver) { return $false }
  $parts = $ver.Split(".")
  $major = [int]$parts[0]
  $minor = 0
  if ($parts.Length -gt 1) { $minor = [int]$parts[1] }
  if ($major -gt $MinMajor) { return $true }
  if ($major -eq $MinMajor -and $minor -ge $MinMinor) { return $true }
  return $false
}

function Install-Node {
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Info "Installing Node.js LTS via winget..."
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    Refresh-Path
    return
  }
  if (Get-Command choco -ErrorAction SilentlyContinue) {
    Write-Info "Installing Node.js LTS via Chocolatey..."
    choco install nodejs-lts -y
    Refresh-Path
    return
  }
  if (Get-Command scoop -ErrorAction SilentlyContinue) {
    Write-Info "Installing Node.js LTS via Scoop..."
    scoop install nodejs-lts
    Refresh-Path
    return
  }
  throw "Could not install Node.js automatically. Install LTS from https://nodejs.org/ then re-run setup.ps1"
}

Write-Info "Detected OS: Windows (PowerShell)"

if (Test-NodeVersionOk) {
  Write-Ok "Node.js v$(Get-NodeVersion) and npm $(npm -v) already meet the minimum (v$MinMajor.$MinMinor+)"
} else {
  $current = Get-NodeVersion
  if ($current) {
    Write-Warn "Node.js v$current is too old. Next.js 14 needs v$MinMajor.$MinMinor+. Installing Node.js $TargetMajor..."
  } else {
    Write-Info "Node.js not found. Installing Node.js $TargetMajor LTS..."
  }
  Install-Node
  if (-not (Test-NodeVersionOk)) {
    throw "Node.js is still missing or too old after install. Close this window, open a new PowerShell, and re-run setup.ps1"
  }
  Write-Ok "Using Node.js v$(Get-NodeVersion) / npm $(npm -v)"
}

$envLocal = Join-Path $Root ".env.local"
$envExample = Join-Path $Root ".env.local.example"
if (Test-Path $envLocal) {
  Write-Ok ".env.local already exists (left unchanged)"
} elseif (Test-Path $envExample) {
  Copy-Item $envExample $envLocal
  Write-Warn "Created .env.local from .env.local.example - fill in Sanity and Resend values before running the app."
} else {
  Write-Warn "No .env.local.example found; skipped env file creation."
}

Write-Info "Installing npm packages from package-lock.json..."
if (Test-Path (Join-Path $Root "package-lock.json")) {
  npm ci
} else {
  npm install
}
Write-Ok "Project packages installed"

Write-Host ""
Write-Ok "Setup complete."
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Edit .env.local with your Sanity project id, dataset, and tokens."
Write-Host "  2. package.json scripts use Unix env syntax. From PowerShell run:"
Write-Host ("       " + '$env:NODE_OPTIONS' + " = '--no-experimental-webstorage'")
Write-Host ("       " + '$env:WATCHPACK_POLLING' + " = 'true'")
Write-Host "       npx next dev"
Write-Host "     Or run npm run dev from Git Bash."
Write-Host "  3. Open http://localhost:3000  (Studio: http://localhost:3000/studio)"
