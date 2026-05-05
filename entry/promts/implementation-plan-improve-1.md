# Implementation plan — improve-1

Goal
- Make home page attributes (background, theme colors, and other visible attributes) editable via Sanity Studio.
- Investigate and resolve observed Studio performance/reliability issues (404 on /structure/* and publish latency).
- Add a Sanity-managed contact settings area so non-technical managers can change email and other contact metadata.

Assumptions
- Sanity project credentials (projectId, dataset, token) are configured in `src/sanity/env.ts` or `sanity.config.ts`.
- Home page data is sourced from `sanity/schemaTypes/homePage.ts` or a `siteSettings` document; if not, we'll create/extend them.
- The site uses the Next.js App Router (`src/app`) with server components and fetches Sanity data via `src/sanity/client.ts`, `src/sanity/fetch.ts`, and `src/sanity/queries.ts`.

High-level plan (phases)
1. Audit (1–2 hours)
   - Read `entry/promts/improve-1.md` (done).
   - Inspect current home page implementation: `src/app/page.tsx` and components used by the home page (`src/components/*`).
   - Inspect current Sanity schemas: `sanity/schemaTypes/homePage.ts`, `sanity/schemaTypes/siteSettings.ts`, and `sanity/deskStructure.ts`.
   - Inspect Sanity client, queries, and contact API: `src/sanity/client.ts`, `src/sanity/queries.ts`, `src/app/api/contact/route.ts`.

2. Design schema and data model (1–2 hours)
   - Add/update fields to allow editing:
     - `homePage` or `siteSettings` fields: `backgroundType` (color | image), `backgroundColor`, `backgroundImage` (asset reference), `themeColors` (object: primary, secondary), and any page-specific toggles (e.g., showHero, heroTitle, heroSubtitle).
   - Add `contactSettings` schema (or extend `siteSettings`) with `contactEmail`, `replyTo`, and optional `displayName`.
   - Document example documents (JSON) for the new fields.

3. Implement schema changes in Studio (2–3 hours)
   - Edit `sanity/schemaTypes/homePage.ts` or `siteSettings.ts` to add new fields and validations.
   - Update `sanity/deskStructure.ts` if needed so editors can find and edit the settings easily.
   - Deploy Studio schema (local dev test and deploy if applicable).

4. Frontend integration (2–3 hours)
   - Update `src/sanity/queries.ts` to include new fields in queries (home page and site settings queries).
   - Update `src/sanity/fetch.ts` (if used) and server components (`src/app/page.tsx` and child components) to read and apply the new values (background color/image, theme colors).
   - Add safe defaults if Sanity fields are missing.
   - For the contact page: update the contact API route `src/app/api/contact/route.ts` to read the `contactEmail` from Sanity or the environment; implement fallback to environment variable.

5. Studio performance & reliability investigation + fixes (3–6 hours)
   - Reproduce the 404 on `/structure/*`:
     - Check `sanity.config.ts` and `deskStructure.ts` for custom routes or base paths.
     - Confirm local Studio dev server logs for stack traces when 404 occurs.
     - Check browser devtools network for failing requests (which endpoints are returning 404).
   - Check CORS and project config in `src/sanity/env.ts` and on sanity.io (allowed origins) — misconfigured CORS can cause Studio resource failures.
   - Investigate publish latency / hold:
     - Confirm whether latency is in Studio UI after clicking `Publish` or the site side revalidation delay.
     - Check dataset indexing, validations, and any custom document hooks or webhooks that might block or delay `publish` actions.
     - If site uses ISR/revalidate, ensure webhook or Next.js revalidation is configured; consider using Sanity CDN-backed documents to improve delivery.
   - Quick mitigation ideas:
     - Enable Sanity's CDN for public queries (faster reads).
     - Use the `listen()` API for preview sessions to get near-real-time updates in preview mode.
     - Add status/error UI for editors (showing publish progress) if Studio plugin/hook is causing delays.
   - If root cause requires deeper Sanity support (platform outage, large indexing jobs), document findings and recommended escalations.

6. Tests, QA and rollout (1–2 hours)
   - Manual verification: edit home page fields in Studio and confirm changes appear on the live site (or preview) within acceptable time.
   - Verify contact email change is used by `src/app/api/contact/route.ts` when sending emails (test dev email flow).
   - Add unit/integration tests for the contact API and for any helper that reads site settings from Sanity (if test infra exists).

7. Documentation & handoff (0.5–1 hour)
   - Update `README.md` or `entry/` docs with instructions on how editors change home page background, theme colors, and contact email.
   - Document how to troubleshoot the Studio publish flow and whom to contact if platform issues persist.

Files to inspect/change (starter list)
- Sanity schema & studio
  - `sanity/schemaTypes/homePage.ts`
  - `sanity/schemaTypes/siteSettings.ts`
  - `sanity/deskStructure.ts`
  - `sanity.config.ts`
  - `scripts/test-sanity.js` (for troubleshooting scripts)
- Frontend
  - `src/app/page.tsx`
  - Any home-specific components: `src/app/(home)/**`, `src/components/layout/*`, `src/components/ui/*` (e.g., `Container.tsx`, `Section.tsx`)
  - `src/sanity/client.ts`
  - `src/sanity/queries.ts`
  - `src/sanity/fetch.ts`
- Contact
  - `src/app/contact/page.tsx` (or `src/app/contact/*`)
  - `src/app/api/contact/route.ts`

Acceptance criteria
- Editors can change background (color or image) and theme colors for the home page via Studio, and those changes are reflected on the site UI.
- Managers can update contact email from Studio and the site uses the new email for outgoing contact submissions.
- The 404 on `/structure/*` is either resolved or a clear root cause + remediation is documented.
- Publish latency is reduced or documented with concrete mitigation steps; editors receive clear guidance for expected propagation delay.

Estimated total effort
- Audit + design: 2–4 hours
- Schema + Studio changes: 2–3 hours
- Frontend integration: 2–3 hours
- Studio performance investigation: 3–6 hours (high variance)
- Tests + docs: 1–2 hours
- Total: ~10–18 hours (depending on Studio investigation complexity)

Next steps (recommended)
1. I will inspect the listed files to produce a precise change list and field names (I can do this next if you want).
2. After you confirm the field names and preferred UX (e.g., allow gradient backgrounds, image focal points), I'll produce a task-level implementation checklist and PR-ready patches.

If you'd like, I can now:
- Create the schema changes as a branch and open a PR draft, or
- Start with the Studio investigation for the 404/publish latency issues.

---
Plan created from `entry/promts/improve-1.md` on request.