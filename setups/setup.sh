#!/usr/bin/env bash
# GTek website local setup — macOS, Linux, and Windows (Git Bash / WSL).
#
# Usage:
#   macOS / Linux:              chmod +x setup.sh && ./setup.sh
#   Windows (Git Bash / WSL):   bash setup.sh
#   Windows (PowerShell):       powershell -ExecutionPolicy Bypass -File .\setup.ps1
#
# Installs Node.js 20 LTS when missing/too old, then project npm packages.
# Requires Node.js >= 18.17 (Next.js 14).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/package.json" ]; then
  ROOT="$SCRIPT_DIR"
elif [ -f "$SCRIPT_DIR/../package.json" ]; then
  ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
else
  ROOT="$SCRIPT_DIR"
fi
cd "$ROOT"

MIN_NODE_MAJOR=18
MIN_NODE_MINOR=17
TARGET_NODE=20
NVM_VERSION="v0.40.3"

if [ -t 1 ]; then
  C_BLUE='\033[1;34m'
  C_GREEN='\033[1;32m'
  C_YELLOW='\033[1;33m'
  C_RED='\033[1;31m'
  C_RESET='\033[0m'
else
  C_BLUE=''
  C_GREEN=''
  C_YELLOW=''
  C_RED=''
  C_RESET=''
fi

info() { printf '%b==>%b %s\n' "$C_BLUE" "$C_RESET" "$*"; }
ok()   { printf '%b==>%b %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn() { printf '%b==>%b %s\n' "$C_YELLOW" "$C_RESET" "$*"; }
fail() { printf '%b==>%b %s\n' "$C_RED" "$C_RESET" "$*" >&2; exit 1; }

have() { command -v "$1" >/dev/null 2>&1; }

detect_os() {
  case "$(uname -s 2>/dev/null)" in
    Darwin*) echo macos ;;
    Linux*) echo linux ;;
    MINGW*|MSYS*|CYGWIN*) echo windows ;;
    *) echo unknown ;;
  esac
}

OS="$(detect_os)"
info "Detected OS: $OS ($(uname -s 2>/dev/null || echo unknown))"

[ -f "$ROOT/package.json" ] || fail "package.json not found. Run this script from the project root."

node_version_ok() {
  have node || return 1
  local raw major minor rest
  raw="$(node -v 2>/dev/null | sed 's/^v//')"
  [ -n "$raw" ] || return 1
  major="${raw%%.*}"
  rest="${raw#*.}"
  minor="${rest%%.*}"
  case "$major" in ''|*[!0-9]*) return 1 ;; esac
  case "$minor" in ''|*[!0-9]*) minor=0 ;; esac
  if [ "$major" -gt "$MIN_NODE_MAJOR" ]; then
    return 0
  fi
  if [ "$major" -eq "$MIN_NODE_MAJOR" ] && [ "$minor" -ge "$MIN_NODE_MINOR" ]; then
    return 0
  fi
  return 1
}

load_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$NVM_DIR/nvm.sh"
    return 0
  fi
  return 1
}

install_nvm() {
  have curl || fail "curl is required to install nvm. Install curl and re-run."
  info "Installing nvm $NVM_VERSION..."
  curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash
  load_nvm || fail "nvm installed but could not be loaded. Open a new terminal and re-run ./setup.sh"
}

install_node_with_nvm() {
  load_nvm || install_nvm
  info "Installing Node.js ${TARGET_NODE} via nvm..."
  nvm install "$TARGET_NODE"
  nvm alias default "$TARGET_NODE"
  nvm use "$TARGET_NODE"
}

refresh_windows_node_path() {
  if [ -d "/c/Program Files/nodejs" ]; then
    export PATH="/c/Program Files/nodejs:$PATH"
  fi
  if [ -n "${LOCALAPPDATA:-}" ] && [ -d "${LOCALAPPDATA}/Programs/nodejs" ]; then
    export PATH="${LOCALAPPDATA}/Programs/nodejs:$PATH"
  fi
  if [ -d "/c/Program Files/nodejs" ]; then
    hash -r 2>/dev/null || true
  fi
}

install_node_macos() {
  if have brew; then
    info "Installing Node.js via Homebrew..."
    if brew list node >/dev/null 2>&1 || brew list node@20 >/dev/null 2>&1; then
      brew upgrade node 2>/dev/null || brew upgrade node@20 2>/dev/null || true
    else
      brew install node
    fi
    return 0
  fi
  warn "Homebrew not found; falling back to nvm."
  install_node_with_nvm
}

install_node_linux() {
  if load_nvm; then
    install_node_with_nvm
    return 0
  fi

  if have apt-get; then
    if have sudo; then
      info "Installing Node.js ${TARGET_NODE} via NodeSource + apt..."
      have curl || { sudo apt-get update -y && sudo apt-get install -y curl ca-certificates; }
      curl -fsSL "https://deb.nodesource.com/setup_${TARGET_NODE}.x" | sudo -E bash -
      sudo apt-get install -y nodejs
      return 0
    fi
    warn "sudo/apt not available; falling back to nvm (no root required)."
    install_node_with_nvm
    return 0
  fi

  if have dnf && have sudo; then
    info "Installing Node.js via dnf..."
    sudo dnf install -y nodejs npm
    return 0
  fi

  if have pacman && have sudo; then
    info "Installing Node.js via pacman..."
    sudo pacman -Sy --noconfirm nodejs npm
    return 0
  fi

  warn "No distro package manager detected; installing via nvm."
  install_node_with_nvm
}

install_node_windows() {
  refresh_windows_node_path
  if node_version_ok; then
    return 0
  fi

  if have winget; then
    info "Installing Node.js LTS via winget..."
    winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements || true
    refresh_windows_node_path
    return 0
  fi

  if have choco; then
    info "Installing Node.js LTS via Chocolatey..."
    choco install nodejs-lts -y
    refresh_windows_node_path
    return 0
  fi

  if have scoop; then
    info "Installing Node.js LTS via Scoop..."
    scoop install nodejs-lts
    refresh_windows_node_path
    return 0
  fi

  fail "Could not install Node.js automatically on Windows. Install LTS from https://nodejs.org/ then re-run: bash setup.sh"
}

ensure_node() {
  if [ "$OS" = "windows" ]; then
    refresh_windows_node_path
  fi

  if node_version_ok; then
    ok "Node.js $(node -v) and npm $(npm -v) already meet the minimum (v${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}+)"
    return 0
  fi

  if have node; then
    warn "Node.js $(node -v) is too old. Next.js 14 needs v${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}+. Installing Node.js ${TARGET_NODE}..."
  else
    info "Node.js not found. Installing Node.js ${TARGET_NODE} LTS..."
  fi

  case "$OS" in
    macos) install_node_macos ;;
    linux) install_node_linux ;;
    windows) install_node_windows ;;
    *) fail "Unsupported OS. Install Node.js ${TARGET_NODE} LTS from https://nodejs.org/ and re-run." ;;
  esac

  if [ "$OS" = "windows" ]; then
    refresh_windows_node_path
  fi
  hash -r 2>/dev/null || true

  if ! have node; then
    load_nvm || true
  fi

  node_version_ok || fail "Node.js is still missing or too old after install. Open a new terminal and re-run this script (PATH may need a refresh)."
  ok "Using Node.js $(node -v) / npm $(npm -v)"
}

ensure_env_file() {
  if [ -f "$ROOT/.env.local" ]; then
    ok ".env.local already exists (left unchanged)"
    return 0
  fi
  if [ -f "$ROOT/.env.local.example" ]; then
    cp "$ROOT/.env.local.example" "$ROOT/.env.local"
    warn "Created .env.local from .env.local.example — fill in Sanity and Resend values before running the app."
    return 0
  fi
  warn "No .env.local.example found; skipped env file creation."
}

install_npm_packages() {
  info "Installing npm packages from package-lock.json..."
  if [ -f "$ROOT/package-lock.json" ]; then
    npm ci
  else
    npm install
  fi
  ok "Project packages installed"
}

print_next_steps() {
  printf '\n'
  ok "Setup complete."
  printf '\nNext steps:\n'
  printf '  1. Edit .env.local with your Sanity project id, dataset, and tokens.\n'
  printf '  2. Start the app:  npm run dev\n'
  printf '     Or with Docker:  ./docker/up.sh\n'
  printf '     Ubuntu (install Docker first):  ./docker/install-ubuntu.sh\n'
  printf '  3. Open http://localhost:3000  (Studio: http://localhost:3000/studio)\n'
  if [ "$OS" = "windows" ]; then
    printf '\nWindows: npm scripts use Unix env syntax. Prefer Git Bash, or run:\n'
    printf '  set NODE_OPTIONS=--no-experimental-webstorage\n'
    printf '  set WATCHPACK_POLLING=true\n'
    printf '  npx next dev\n'
  fi
}

ensure_node
ensure_env_file
install_npm_packages
print_next_steps
