#!/usr/bin/env bash
# Start a production-like GTek container.
# Usage: ./docker/up-prod.sh
#        ./docker/up-prod.sh -d

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required (\`docker compose\`, not docker-compose 1.x)." >&2
  if [ -f /etc/os-release ] && grep -qi ubuntu /etc/os-release; then
    echo "On Ubuntu run: ./docker/install-ubuntu.sh" >&2
  fi
  exit 1
fi

# shellcheck source=lib.sh
. "$(dirname "$0")/lib.sh"
require_docker_daemon "$ROOT/docker/up-prod.sh" "$@"

if [ ! -f .env.local ]; then
  echo "Create .env.local first (copy .env.local.example) so NEXT_PUBLIC_* can be baked into the image." >&2
  exit 1
fi

echo "==> Starting GTek (production image) at http://localhost:${PORT:-3000}"
exec docker compose -f docker-compose.prod.yml --env-file .env.local up --build "$@"
