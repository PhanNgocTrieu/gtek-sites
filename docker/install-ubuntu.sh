#!/usr/bin/env bash
# Install Docker Engine + Compose v2 on Ubuntu, then you can run ./docker/up.sh
#
#   ./docker/install-ubuntu.sh
#
# If this script adds you to the docker group, log out and back in (or run
# `newgrp docker`) before using docker without sudo.

set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
  echo "Run this script as a normal user. It will call sudo when needed." >&2
  exit 1
fi

if [ ! -f /etc/os-release ] || ! grep -Eqi 'ubuntu|debian' /etc/os-release; then
  echo "This installer is for Ubuntu/Debian (apt)." >&2
  echo "Install Docker from https://docs.docker.com/get-docker/ then run ./docker/up.sh" >&2
  exit 1
fi

. /etc/os-release
echo "==> Setting up Docker on ${PRETTY_NAME:-Linux}"

has_compose() {
  docker compose version >/dev/null 2>&1
}

install_compose_from_ubuntu() {
  sudo apt-get update -y
  sudo apt-get install -y docker-compose-v2
}

install_docker_ce() {
  sudo apt-get update -y
  sudo apt-get install -y ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME:-$VERSION_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo systemctl enable --now docker
}

if command -v docker >/dev/null 2>&1 && has_compose; then
  echo "==> Docker and Compose v2 are already installed: $(docker --version)"
elif command -v docker >/dev/null 2>&1; then
  echo "==> Docker found without Compose v2. Installing docker-compose-v2..."
  if apt-cache show docker-compose-v2 >/dev/null 2>&1; then
    install_compose_from_ubuntu
  else
    echo "==> Ubuntu compose package not available; installing Docker CE Compose plugin..."
    install_docker_ce
  fi
else
  echo "==> Installing Docker Engine + Compose from Docker's Ubuntu repository..."
  install_docker_ce
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker install failed." >&2
  exit 1
fi

if ! has_compose; then
  echo "Compose v2 is still missing. Install with: sudo apt-get install -y docker-compose-v2" >&2
  exit 1
fi

echo "==> $(docker --version)"
docker compose version

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl enable --now docker 2>/dev/null || true
fi

if ! id -nG "$USER" | grep -qw docker; then
  sudo usermod -aG docker "$USER"
  echo "==> Added $USER to the docker group. Log out and back in, or run: newgrp docker"
else
  echo "==> $USER is already in the docker group"
fi

echo
echo "Next:"
echo "  1. cp .env.local.example .env.local   # then fill Sanity / Resend values"
echo "  2. ./docker/up.sh"
echo "  3. Open http://localhost:3000"
