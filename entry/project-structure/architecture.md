# GTek Website — Architecture & Operation Diagram

Overview
- Frontend: Next.js 14 (app router) — renders site UI, embeds Sanity Studio at `/studio` via `NextStudio`.
- CMS: Sanity (Studio + Content Lake) — stores documents (project, author, service, pages).
- Hosting: (recommended) Vercel for Next.js; Sanity is hosted by Sanity.io.
- Dev: local `.env.local` with `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN` for server-side reads.

ASCII diagram (high level)

User (browser)
  |
  |-- Requests pages --> Next.js (Server or Edge) ----\
  |                                               |-- fetches published content via GROQ --> Sanity Content Lake
  |                                               |-- serves HTML/JS/CSS
  |-- Editor visits `/studio` --> Next.js embedded Studio -> connects to Sanity Studio API (browser auth)

Developer (git)
  |
  |-- Push code to repo (schemas, app) --> CI/CD (Vercel) --> deploy Next.js app

Operational flows
- Content editing (non-technical user):
  - Editor logs into Sanity Studio (UI) at `/studio` or `studio.sanity.io` if using separate Studio.
  - Editor creates/edits documents (Projects, Authors, Services, Pages) and clicks Publish.
  - Published documents are immediately queryable from the site via GROQ queries used in Next.js.

- Page rendering:
  - Next.js pages (server components) call `getSanityClient()` (from `src/sanity/client.ts`) which reads config from `src/sanity/env.ts`.
  - The client runs GROQ queries (see `src/sanity/queries.ts`) and returns JSON data that components render as static or server-rendered pages.

- Preview/drafts (not yet implemented):
  - Requires a server-side token and preview routes to fetch draft content for logged-in editors.

Key configuration & env variables
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (public) — identifies the Sanity project.
- `NEXT_PUBLIC_SANITY_DATASET` (public) — dataset (e.g., `production`).
- `NEXT_PUBLIC_SANITY_API_VERSION` (public) — date string for API versioning.
- `SANITY_API_READ_TOKEN` (server only) — secret token for server-side reads or drafts.

Notes
- The project embeds Sanity Studio via `NextStudio` (`src/app/studio/Studio.tsx`) rather than running a separate Studio instance; this simplifies editor access.
- The site currently reads published content; preview/draft support is available as an enhancement.
