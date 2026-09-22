# GTek Engineering — Website

Marketing website for **Gtek Engineering Inc.**, a Winnipeg-based geotechnical consultancy serving the dam safety, mining, foundation, and slope stability sectors across Canada.

The site is a [Next.js 14](https://nextjs.org) App Router application with **Sanity Studio embedded at `/studio`**, so non-technical editors can update every page from a browser without touching code. Content lives in the Sanity Content Lake (hosted by Sanity.io), so there is no database to run locally.

| URL | What |
|---|---|
| http://localhost:3000 | Public site |
| http://localhost:3000/studio | Sanity Studio (CMS) |
| http://localhost:3000/editing | Editing guide for non-technical users |

## Features

- **CMS-driven pages** — home, about, services, projects, and contact content is authored in Sanity and rendered server-side.
- **Embedded Studio** — no separate CMS deployment; optionally gated behind HTTP Basic Auth outside production.
- **On-demand revalidation** — Sanity webhooks hit `/api/webhooks/sanity`, and a Studio document action calls `/api/studio/revalidate`, so published edits appear without a redeploy (see [`docs/studio-revalidate.md`](docs/studio-revalidate.md)).
- **Contact form** — posts to `/api/contact`, delivered via [Resend](https://resend.com), with a honeypot anti-spam field and an optional acknowledgement email.
- **Dark mode**, sitemap, robots.txt, and optional Google Analytics.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| CMS | Sanity v3 via `next-sanity`, Studio mounted at `/studio` |
| Styling | Tailwind CSS 3 + styled-components |
| Email | Resend |
| Runtime | Node.js 18.17+ (20 LTS recommended) |
| Containers | Docker Compose v2 (optional) |

## Prerequisites

- **Node.js 18.17 or newer** (20 LTS recommended) and npm — only if you run the app natively.
- **Docker Engine or Docker Desktop** with Compose v2 — only if you run the app in containers.
- A **Sanity account** with access to the GTek project (https://sanity.io/manage).
- A **Resend API key** — optional, needed only to actually send contact-form emails.

You need either Node.js **or** Docker, not both.

---

## Setup — Option A: run natively with Node.js

### Step 1 — Clone the repository

```bash
git clone git@github.com:PhanNgocTrieu/gtek-sites.git
cd gtek-sites
```

### Step 2 — Install Node.js and dependencies

The scripts in `setups/` check your Node version, install Node 20 LTS if it is missing or too old, create `.env.local`, and run `npm ci`. Run them **from the project root**:

```bash
# macOS / Linux / WSL / Git Bash
bash setups/setup.sh

# Windows cmd (delegates to setup.sh via Git Bash or WSL)
setups\setup.cmd
```

Or do it manually on any platform — install [Node.js 20 LTS](https://nodejs.org/) yourself, then:

```bash
npm ci
```

> `setups/setup.ps1` (the pure-PowerShell fallback, used by `setup.cmd` when neither Git Bash nor WSL is present) currently resolves the project root to its own `setups/` directory and aborts with *"package.json not found"*. Until that is fixed, use Git Bash or the manual `npm ci` above on Windows.

### Step 3 — Create your environment file

```bash
cp .env.local.example .env.local      # Windows PowerShell: Copy-Item .env.local.example .env.local
```

The setup scripts already do this if `.env.local` is absent. **Never commit `.env.local`.**

### Step 4 — Fill in the Sanity credentials

Open https://sanity.io/manage and select the GTek project:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — shown on the project overview page.
- `NEXT_PUBLIC_SANITY_DATASET` — usually `production`.
- `SANITY_API_READ_TOKEN` — **API → Tokens → Add API token**, with *Viewer* permissions. Server-only; required for draft reads.
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` for local development.

Everything else in [`.env.local.example`](.env.local.example) is optional for a first run. See the [environment variables](#environment-variables) table below.

### Step 5 — Verify the Sanity connection

```bash
node scripts/test-sanity.js
```

This reads `.env.local` and fetches a document. If it errors, your project ID, dataset, or token is wrong — fix it before continuing.

### Step 6 — Start the development server

```bash
npm run dev
```

> **Windows note:** the `dev`, `build`, and `start` scripts use Unix-style inline environment variables, which PowerShell and cmd do not understand. Either run `npm run dev` from **Git Bash / WSL**, or set the variables yourself:
>
> ```powershell
> $env:NODE_OPTIONS = '--no-experimental-webstorage'
> $env:WATCHPACK_POLLING = 'true'
> npx next dev
> ```

### Step 7 — Open the site

- Site: http://localhost:3000
- Studio: http://localhost:3000/studio (sign in with your Sanity account)

Edit files under `src/` and the page hot-reloads. If Studio reports *"not configured"*, `NEXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_DATASET` is missing — fill them in and restart, since `NEXT_PUBLIC_*` values are read at startup.

---

## Setup — Option B: run with Docker

A single `web` container runs Next.js and Studio; the Content Lake stays on Sanity.io.

### Step 1 — Install Docker

Ubuntu:

```bash
chmod +x docker/*.sh
./docker/install-ubuntu.sh
newgrp docker          # apply the docker group without logging out
```

macOS / Windows: install [Docker Desktop](https://docs.docker.com/get-docker/) and skip to step 2.

Confirm you have Compose **v2** (`docker compose`, not `docker-compose` 1.x):

```bash
docker --version
docker compose version
```

### Step 2 — Create and fill `.env.local`

Same as steps 3–4 above. `./docker/up.sh` copies the example file for you if it is missing, but the site will not load content until the Sanity values are set.

### Step 3 — Start the stack

```bash
./docker/up.sh            # attached, with build
./docker/up.sh -d         # detached
PORT=3001 ./docker/up.sh  # different host port
```

### Step 4 — Open the site

http://localhost:3000 and http://localhost:3000/studio. The repo is bind-mounted, so host edits hot-reload; `node_modules` and `.next` live in named volumes.

Common commands:

```bash
docker compose logs -f web    # follow logs
docker compose exec web sh    # shell into the container
docker compose down           # stop
docker compose down -v        # stop and drop node_modules/.next volumes
```

Full Docker reference, including the production-like image and troubleshooting: [`docker/README.md`](docker/README.md).

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name, usually `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | API date, defaults to `2024-01-01` |
| `SANITY_API_READ_TOKEN` | Yes | Server-only token for reads and drafts |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public base URL used by Studio preview and revalidate actions |
| `SANITY_PREVIEW_SECRET` | No | Reserved for the draft-preview flow sketched in `DEV_PREVIEW.md`; the route is not implemented yet |
| `SANITY_WEBHOOK_SECRET` | For webhooks | Validates `/api/webhooks/sanity` |
| `STUDIO_BASIC_AUTH_USER` / `_PASS` | No | Adds Basic Auth in front of `/studio`; no-op when unset |
| `RESEND_API_KEY` | For email | Sends contact-form messages |
| `CONTACT_TO_EMAIL` | For email | Inbox that receives submissions |
| `CONTACT_FROM_EMAIL` | For email | Verified sender on your Resend domain, e.g. `GTek Website <noreply@gtekeng.com>` (not `@resend.dev` in production) |
| `CONTACT_ACK_FROM_EMAIL` | No | Sender for the acknowledgement email |
| `CONTACT_SEND_ACK` | No | `true` to auto-acknowledge submitters |

On **Vercel** (or any host), set the same `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` as in `.env.local`, then redeploy. A `502` on `POST /api/contact` means Resend rejected the send — open the request **Response** body in DevTools for the `message` field, or check Vercel function logs for `Resend inquiry send failed`.
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run dev:docker` | Development server bound to `0.0.0.0` (used inside the container) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint via `next lint` |
| `npm run test:resend` | Live Resend integration test — sends a real email, needs `RESEND_API_KEY` |

## Project structure

```
src/
  app/                 App Router pages, layouts, and API routes
    api/contact/       Contact form handler (Resend)
    api/revalidate/    On-demand ISR revalidation
    api/webhooks/      Sanity publish webhook
    studio/            Embedded Sanity Studio route
  components/          Layout, UI, theme, and analytics components
  content/             CMS loaders and static site config
  sanity/              Sanity client, queries, and env helpers
  middleware.ts        Optional Basic Auth gate for /studio
sanity/                Studio schema types, desk structure, and theme
docker/                Docker helper scripts and Docker documentation
setups/                Cross-platform local setup scripts
scripts/               Standalone utilities (Sanity connection check)
entry/                 Requirements, architecture notes, and planning docs
docs/                  Operational guides
```

## Production build

```bash
npm run build
npm run start
```

To test the standalone Docker image locally:

```bash
./docker/up-prod.sh -d
```

`NEXT_PUBLIC_*` variables are baked in at image build time, so rebuild after changing them. Do not run the dev and prod Compose files at once — both bind port 3000.

## Further reading

- [`docker/README.md`](docker/README.md) — Docker setup, production image, troubleshooting
- [`DEV_PREVIEW.md`](DEV_PREVIEW.md) — proposed draft-preview API and latency debugging notes
- [`docs/studio-revalidate.md`](docs/studio-revalidate.md) — Studio revalidate action and webhooks
- [`entry/project-structure/architecture.md`](entry/project-structure/architecture.md) — architecture notes
