# Cleanup notes — `feature/restruct_optimize`

Date: 2026-09-22

Audit of unused / redundant code under `src/` (and closely related assets). No major folder restructure was required; this is a dead-code cleanup only.

## Deleted files

| Path | Reason |
|---|---|
| `src/components/ui/ButtonLink.tsx` | Never imported anywhere |
| `src/app/api/revalidate/route.ts` | Legacy ISR endpoint; replaced by `/api/studio/revalidate` + `/api/webhooks/sanity` |
| `src/app/fonts/GeistMonoVF.woff` | Mono font loaded but never used in CSS (only Geist Sans) |
| `sanity/schemaTypes/author.ts` | Not registered in `schemaTypes/index.ts`; unused schema |
| `public/images/service-1.jpg` | Unreferenced; services fallbacks use `public/images/services/*` |
| `public/images/service-2.jpg` | Same as above |
| `public/images/service-3.jpg` | Same as above |
| `.gitignore copy` | Accidental duplicate of `.gitignore` |

## Code / config changes

| Change | Why |
|---|---|
| `src/app/layout.tsx` — removed `geistMono` / `--font-geist-mono` | Paired with deleting `GeistMonoVF.woff` |
| `src/content/siteConfig.ts` — removed `coalesceBool` | Defined but never called |
| `src/sanity/queries.ts` — dropped `legacyCategory` from projects query; dropped unused `items[].image` from services query | Fetched but never rendered |
| `src/app/projects/ProjectsClient.tsx` — removed `legacyCategory` from `Project` type | No UI usage |
| `src/app/services/page.tsx` — removed unused `image` on service item type | Item images are not rendered |
| `src/app/api/webhooks/sanity/route.ts` — revalidate list pages only; no slug paths | Site has no `/projects/[slug]` or `/services/[slug]` routes |
| `sanity/deskStructure.tsx` — Studio refresh redirects to list pages only | Same routing reality |
| `tailwind.config.ts` — removed `./src/pages/**` glob | Pages Router folder does not exist |
| `package.json` — removed unused `vitest` (lockfile entry also stripped; run `npm install` when able so `node_modules` matches) | Tests use `node --test` (`npm run test:resend`) |
| `README.md` — project structure list | Replaced stale `api/revalidate/` with `api/studio/` |

## Intentionally kept

| Item | Why keep |
|---|---|
| `src/app/editing/page.tsx` | Editor guide; linked from README (`/editing`) |
| `SanityStudioFab` on `/projects` | Used entry to Studio (placement is a product choice, not dead code) |
| `project.legacyCategory` / service item `image` fields in Sanity schemas | Deprecated but may still hold CMS data; only frontend fetch/display was cleaned |
| `entry/` docs folder | Non-runtime planning/theory; useful for onboarding |
| `DEV_PREVIEW.md` | Documents a preview API not yet implemented — docs drift, not dead `src` code |
| `GoogleAnalytics` | Conditional on `NEXT_PUBLIC_GA_ID` |

## Not done (out of scope)

- Moving `entry/` out of the repo
- Implementing draft preview (`/api/preview` from `DEV_PREVIEW.md`)
- Relocating `SanityStudioFab` to more pages
- Full folder restructure of `src/` (structure was already fine)
