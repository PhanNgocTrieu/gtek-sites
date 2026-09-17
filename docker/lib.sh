# Shared checks for docker/up.sh and docker/up-prod.sh.
# shellcheck shell=bash

in_docker_group_file() {
  getent group docker 2>/dev/null | awk -F: '{print $4}' | tr ',' '\n' | grep -qx "${USER:-}"
}

reexec_with_docker_group() {
  local script="$1"
  shift
  local cmd a
  cmd="$(printf 'export GTEK_DOCKER_SG=1; cd %q && exec %q' "$ROOT" "$script")"
  for a in "$@"; do
    cmd+=" $(printf '%q' "$a")"
  done
  exec sg docker -c "$cmd"
}

require_docker_daemon() {
  local script="$1"
  shift

  if docker info >/dev/null 2>&1; then
    return 0
  fi

  local err
  err="$(docker info 2>&1 || true)"

  if echo "$err" | grep -qi 'permission denied'; then
    if [ "${GTEK_DOCKER_SG:-}" != 1 ] && in_docker_group_file && command -v sg >/dev/null 2>&1; then
      echo "==> This shell does not have the docker group yet. Re-running with sg docker..."
      reexec_with_docker_group "$script" "$@"
    fi
    echo "Permission denied on /var/run/docker.sock." >&2
    echo "Add your user to the docker group, then activate it in this terminal:" >&2
    echo "  sudo usermod -aG docker \"\$USER\"" >&2
    echo "  newgrp docker" >&2
    echo "  ./docker/up.sh" >&2
    echo >&2
    echo "One-liner after usermod:" >&2
    echo "  sg docker -c './docker/up.sh'" >&2
    exit 1
  fi

  if echo "$err" | grep -qiE 'cannot connect to the docker daemon|is the docker daemon running'; then
    echo "Docker daemon is not running. Start it with:" >&2
    echo "  sudo service docker start" >&2
    echo "  # or: sudo systemctl start docker" >&2
    exit 1
  fi

  echo "Cannot talk to the Docker daemon:" >&2
  echo "$err" >&2
  exit 1
}
