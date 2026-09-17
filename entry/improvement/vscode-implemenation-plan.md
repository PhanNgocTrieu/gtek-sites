# GTek Website — Detailed Implementation Plan

Purpose
- This document contains an actionable, step-by-step implementation plan for the improvements listed in `entry/project-structure/improvements.md`. Tasks that are already implemented are noted and skipped. Each task includes clear steps, files to change, time estimates, acceptance criteria, and testing instructions.

Summary of priorities
- P0 (Immediate): Preview / draft workflow, Secure env & token handling, Audit missing images
- P1 (Short term): Content templates & validation, Editor UX (desk structure), Image optimization
- P2 (Medium term): SEO, CI checks, Access control & scheduled publishing
- P3 (Long term): Backups, Studio strategy decision, docs expansion

Status snapshot (as of file creation)
- Done: `Docs & editor onboarding`, `.env.local.example` + `scripts/test-sanity.js` (see repo). These will not be reworked unless requested.
- In-progress/Next: `Implement preview / draft workflow` (P0) — this plan will start by implementing preview routes.

Detailed tasks

1) Implement Preview / Draft Workflow (P0) — 1–2 days
  - Goal: Editors can preview unpublished drafts on the site using a server-only token.
  - Files to add/modify:
    - `src/app/api/preview/route.ts` (Next.js route) or `src/pages/api/preview.js` depending on routing style
    - `src/lib/sanity/preview.ts` (helper to fetch draft content)
    - `sanity/deskStructure.ts` (add a `Preview` link/action) or add Studio tool that links to preview URL
    - Update `src/sanity/env.ts` to ensure server-only token usage in server routes.
  - Steps:
    1. Add API route `/api/preview` that accepts `draftId` or `slug` and sets Next's preview mode cookie after verifying an HMAC or secret query param.
    2. Route uses server-side `SANITY_API_READ_TOKEN` to fetch draft document (e.g., `*[_id ==\"drafts.<id>\"] | order(_updatedAt desc)[0]`).
    3. If draft found, set Preview session and redirect to the preview URL (e.g., `/preview/<slug>` or the page route). If not, return 404.
    4. Add Studio button or simple copy-link pattern: create a URL that editors can click (from Studio) to open `/api/preview?draftId=<id>&secret=<secret>`.
  - Security: require `secret` (from env, e.g., `SANITY_PREVIEW_SECRET`) and validate. Do not expose server token.
  - Acceptance criteria: Editor clicks `Preview` and sees draft content rendered on site at preview route; draft fetch uses server token (not exposed to browser).
  - Tests: Create a draft in Studio, call `/api/preview?draftId=...&secret=...`, confirm page shows draft values (e.g., edited title/image).

2) Secure environment & token management (P0) — 0.5–1 day
  - Goal: Ensure secrets are only in server envs and repo does not leak tokens.
  - Files to change:
    - `README.md` — add exact env setup steps for local and Vercel.
    - `src/sanity/env.ts` — assert missing required env and throw early in server context.
  - Steps:
    1. Add validation in `src/sanity/env.ts` to throw if `NEXT_SANITY_PROJECT_ID` or `NEXT_SANITY_DATASET` missing during startup and to log warnings if server-only token absent for dev preview.
    2. Add README section showing how to add Vercel env vars and which variables must be `NEXT_PUBLIC_` vs server-only.
  - Acceptance: local dev fails fast if public vars missing; production envs set via host and token not present in client bundles.

3) Audit content for missing or broken images (P0) — 0.5 day
  - Goal: Produce a CSV/JSON report listing projects missing images or with asset->url null.
  - Files to add:
    - `scripts/audit-images.js` — loads `.env.local`, runs GROQ queries, writes `reports/missing-images.json` or CSV.
  - Steps:
    1. Implement GROQ queries:
       - projects without image asset: `*[_type == 'project' && !defined(mainImage.asset)]{_id, title, _updatedAt}`
       - projects with asset but null url: `*[_type == 'project' && defined(mainImage.asset)]{_id, title, 'imageUrl': mainImage.asset->url}`
    2. Run script, produce a file, and open it for editors.
  - Acceptance: `reports/missing-images.json` created with actionable list.

4) Content templates & validation (P1) — 0.5–1 day
  - Goal: Reduce editor errors by adding document templates and field validation for `project` and `blog`.
  - Files to change:
    - `sanity/schemaTypes/project.ts` and `sanity/schemaTypes/blog.ts` (if blog schema exists or will be added)
    - `sanity/deskStructure.ts` — register templates.
  - Steps:
    1. Add `initialValueTemplates` or `templates` in schema to prefill common fields.
    2. Add `validation: Rule => Rule.required()` for fields that must exist (title, slug, mainImage).
  - Acceptance: Studio shows templates when creating new doc and prevents publish if required fields missing.

5) Editor UX — Desk structure & guided templates (P1) — 1 day
  - Goal: Simplify Studio view for non-technical editors.
  - Files to change:
    - `sanity/deskStructure.ts` — add top-level curated list of document types, help text, and templates.
  - Steps:
    1. Edit `deskStructure.ts` to show `Site Settings`, `Projects`, `Services`, `Authors`, and hide technical indices.
    2. Add `Sider` or `Help` document with onboarding steps and link to the theory docs.
  - Acceptance: Editors see a simplified tree and quick-create templates.

6) Image optimization & `next/image` config (P1) — 0.5 day
  - Goal: Ensure `next/image` works with Sanity CDN and images are optimized.
  - Files to change:
    - `next.config.mjs` — add `images.remotePatterns` for `cdn.sanity.io`.
    - Update image helper functions if using `urlFor` from Sanity image builder.
  - Acceptance: Images render via `next/image` without domain errors.

7) SEO & structured data (P2) — 1 day
  - Goal: Add `siteSettings` schema and render correct meta tags per page.
  - Files: `sanity/schemaTypes/siteSettings.ts`, `src/app/layout.tsx` (or head component)

8) CI checks & sanity-client smoke tests (P2) — 1 day
  - Goal: Run lint and `scripts/test-sanity.js` in CI. Use repo secrets for test env.
  - Files: `.github/workflows/ci.yml` (or existing CI config)

9) Access control, scheduled publishing, backups (P2–P3)
  - Outline steps for each; choose plugins or managed features from Sanity. Implementation dependent on policy.

PR & rollout checklist (for each implement task)
- Open feature branch: `feature/<task>` (e.g., `feature/preview-drafts`).
- Implement code and tests; run `npm run dev` and validate locally.
- Add README docs for new env vars (e.g., `SANITY_PREVIEW_SECRET`).
- Create PR with screenshots and manual test steps.
- After merge, deploy to Preview environment and test with real editor account.

Owners & timeline suggestion (2-week window)
- Week 1: P0 tasks — Preview/draft workflow, Secure env, Audit images. (2–3 dev days)
- Week 2: P1 tasks — Templates, Desk UI, Image config, SEO basics. (3–4 dev days)
- Week 3: P2 tasks — CI, roles, scheduling, backups. (2–4 dev days)

Notes & assumptions
- Assumes you (or editors) have admin access to the Sanity project and can create tokens and invite accounts.
- Assumes Next.js app is deployed on Vercel or similar where env vars can be set.

Where I saved this plan
- This file: `entry/project-structure/improvement-plan.md` in the repository. If you prefer a different folder (e.g., `project-structure/` root), I can move it.

Ready to start
- I can start implementing `Preview / draft workflow` now. Reply `start preview` and I will create a feature branch and begin changes (I will add the route, helper, and Studio link, then test locally).
