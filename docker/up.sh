#!/usr/bin/env bash
# Start the GTek dev environment in Docker (Ubuntu, macOS, Windows).
# Usage: ./docker/up.sh            # attached, with build
#        ./docker/up.sh -d         # detached

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed." >&2
  if [ -f /etc/os-release ] && grep -qi ubuntu /etc/os-release; then
    echo "On Ubuntu run: ./docker/install-ubuntu.sh" >&2
  else
    echo "Install Docker Desktop or Docker Engine, then re-run." >&2
  fi
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required (\`docker compose\`, not docker-compose 1.x)." >&2
  if [ -f /etc/os-release ] && grep -qi ubuntu /etc/os-release; then
    echo "On Ubuntu run: ./docker/install-ubuntu.sh" >&2
    echo "Or: sudo apt-get install -y docker-compose-v2" >&2
  else
    echo "Install the Compose plugin, then re-run." >&2
  fi
  exit 1
fi

# shellcheck source=lib.sh
. "$(dirname "$0")/lib.sh"
require_docker_daemon "$ROOT/docker/up.sh" "$@"

if [ ! -f .env.local ]; then
  if [ -f .env.local.example ]; then
    cp .env.local.example .env.local
    echo "==> Created .env.local from .env.local.example — fill in Sanity / Resend values."
  else
    echo "Missing .env.local (and no .env.local.example to copy)." >&2
    exit 1
  fi
fi

echo "==> Starting GTek (dev) at http://localhost:${PORT:-3000}"
exec docker compose --env-file .env.local up --build "$@"
