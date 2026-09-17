# Docker — GTek website

Run the Next.js site and embedded Sanity Studio in Docker on Ubuntu, macOS, or Windows. Sanity Content Lake stays on Sanity.io, so this stack is a **single `web` container**.

| URL | What |
|---|---|
| http://localhost:3000 | Public site |
| http://localhost:3000/studio | Sanity Studio |

All commands below assume the **project root** (the folder that contains `package.json` and `docker-compose.yml`), not this `docker/` directory.

```bash
cd /path/to/gtek-sites
```

## Prerequisites

- Docker Engine **or** Docker Desktop
- Docker Compose **v2** (`docker compose`, not the old `docker-compose` 1.x)

Check:

```bash
docker --version
docker compose version

# create docker user (for ubuntu)
sudo usermod -aG docker "$USER"
newgrp docker
```

## 1. Install Docker (Ubuntu)

If Docker is already installed and `docker compose version` works, skip this step.

```bash
chmod +x docker/*.sh docker/entrypoint-dev.sh
./docker/install-ubuntu.sh
```

The installer:

- installs Docker Engine + Compose v2 if missing
- or only `docker-compose-v2` if Docker exists but `docker compose` does not
- adds your user to the `docker` group

If it added you to the group, apply it before continuing:

```bash
newgrp docker
```

Or log out and back in.

On Ubuntu, clone/run the repo on a **native Linux path** (for example `~/gtek-sites`), not `/mnt/c` or `/mnt/d`. Bind mounts from Windows drives are slower and file watching is less reliable.

### macOS / Windows

Install [Docker Desktop](https://docs.docker.com/get-docker/), then continue from step 2. You do not need `install-ubuntu.sh`.

## 2. Environment file

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set at least:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
- `SANITY_API_READ_TOKEN` (server-side reads / drafts)
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

Optional: Resend (`RESEND_API_KEY`, contact emails), Studio basic auth, preview/webhook secrets, `NEXT_PUBLIC_GA_ID`.

`./docker/up.sh` copies the example file automatically if `.env.local` is missing, but the site will not load CMS content until the Sanity values are filled in.

Never commit `.env.local`.

## 3. Development (hot reload)

```bash
./docker/up.sh
```

Detached (background):

```bash
./docker/up.sh -d
```

Equivalent Compose command:

```bash
docker compose --env-file .env.local up --build
```

The dev stack:

- builds `Dockerfile.dev` (Node 20)
- bind-mounts the repo so code edits reload
- keeps `node_modules` and `.next` in named volumes (Linux packages inside the container, not your host OS)

Change source files on the host; Next.js reloads at http://localhost:3000.

### Useful dev commands

```bash
docker compose logs -f web          # follow app logs
docker compose exec web sh          # shell in the container
docker compose down                 # stop and remove the container
```

Use another host port:

```bash
PORT=3001 ./docker/up.sh
```

## 4. Production-like image

Use this to test the standalone Next.js build locally (not a replacement for Vercel).

```bash
./docker/up-prod.sh -d
```

Equivalent:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.local up --build -d
```

`NEXT_PUBLIC_*` variables are **baked in at image build time**. After you change them in `.env.local`, rebuild:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.local up --build -d
```

Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

Do not run the dev and prod compose files at the same time — both bind host port `3000` by default.

## File layout

| Path | Role |
|---|---|
| `docker/install-ubuntu.sh` | Install Docker + Compose v2 on Ubuntu |
| `docker/up.sh` | Start **dev** stack |
| `docker/up-prod.sh` | Start **production** image |
| `docker/entrypoint-dev.sh` | Ensures `npm ci` if the `node_modules` volume is empty |
| `Dockerfile.dev` | Dev image |
| `Dockerfile` | Multi-stage production image (`output: 'standalone'`) |
| `docker-compose.yml` | Dev Compose file |
| `docker-compose.prod.yml` | Production Compose file |
| `.dockerignore` | Build context exclusions |

## Troubleshooting

**`--no-experimental-webstorage is not allowed in NODE_OPTIONS`**

That flag is only valid on newer Node (22+). Docker images use Node 20, so it must not be set in `Dockerfile*` or `dev:docker` / `build:docker`. Pull the latest files and rebuild:

```bash
./docker/up.sh
```

**`Docker Compose is configured to build using Bake, but buildx isn't installed`**

Harmless warning. To silence it on Ubuntu:

```bash
sudo apt-get install -y docker-buildx
```

**`docker: unknown command: docker compose`**

Compose v2 is missing (Ubuntu `docker.io` often ships with Compose 1.x only):

```bash
sudo apt-get install -y docker-compose-v2
# or
./docker/install-ubuntu.sh
```

**Permission denied on `/var/run/docker.sock`**

Docker is installed, but this shell cannot use the daemon. `usermod` only takes effect after the group is loaded:

```bash
sudo usermod -aG docker "$USER"
newgrp docker
./docker/up.sh
```

One-liner (same terminal, no logout):

```bash
sudo usermod -aG docker "$USER"
sg docker -c './docker/up.sh'
```

Do not use `sudo ./docker/up.sh` — that creates root-owned files in the project.

If `up.sh` reports that you are already in the `docker` group, it will retry automatically via `sg docker`.

**Studio shows “not configured”**

`.env.local` is missing `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`. Fill them in and restart:

```bash
docker compose down
./docker/up.sh
```

**Sanity / contact form changes in `.env.local` not picked up**

- Dev: restart `./docker/up.sh` (`NEXT_PUBLIC_*` are read when Next.js starts).
- Prod: rebuild the image (`NEXT_PUBLIC_*` are compiled in).

**Port 3000 already in use**

```bash
PORT=3001 ./docker/up.sh
```

**Stale dependencies after `package.json` changes**

```bash
docker compose down -v
./docker/up.sh
```

`-v` deletes the `node_modules` and `.next` volumes so they are reinstalled.

**Windows Git Bash: `bash: ./docker/up.sh: Permission denied`**

```bash
bash docker/up.sh
```
