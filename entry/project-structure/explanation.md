# GTek Website — Explanation of Files & How the System Works

Summary
- The repository is a Next.js (app router) website integrated with Sanity as a headless CMS. The codebase includes Sanity schemas, an embedded Studio, React components, pages, and utility code that queries Sanity.

Top-level files
- `package.json` — project dependencies and scripts (`dev`, `build`, `start`). Key dependencies: `next`, `react`, `sanity`, `next-sanity`.
- `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts` — Next and styling configuration.
- `.env.local.example` — environment variable template.

Sanity configuration and schemas
- `sanity.config.ts` — Studio configuration. It consumes `NEXT_SANITY_PROJECT_ID` and `NEXT_SANITY_DATASET` (so Studio knows which project/dataset to show).
- `sanity/schemaTypes/*` — Sanity schema files that define content models: `project.ts`, `service.ts`, `author.ts`, `homePage.ts`, `aboutPage.ts`, `siteSettings.ts`, and `index.ts` that aggregates them. These determine the fields and editor UI shown in Studio.
- `sanity/deskStructure.ts` — custom desk structure for the Studio (control editor UI order/collections).

Sanity client & helper code (src/sanity)
- `src/sanity/env.ts` — central typed config object used in the app: projectId, dataset, apiVersion, useCdn, token. Exposes `isSanityConfigured()`.
- `src/sanity/client.ts` — `getSanityClient()` factory that returns a `next-sanity` client (uses values from `env.ts`). This client is used across the app to fetch data.
- `src/sanity/fetch.ts` — (helper; may contain utilities to run GROQ queries and handle URLs). Use this for fetching data consistently.
- `src/sanity/queries.ts` — central GROQ queries for common page data (home, projects, services, etc.).

Frontend app (src/app)
- `src/app/layout.tsx`, `globals.css` — global layout and site-wide styling.
- Pages:
  - `src/app/page.tsx` — homepage.
  - `src/app/about/page.tsx` — about page.
  - `src/app/projects/page.tsx` and `src/app/projects/ProjectsClient.tsx` — projects listing and client component.
  - `src/app/services/page.tsx` — services listing.
  - `src/app/contact/page.tsx` & `ContactForm.tsx` — contact page and API route at `src/app/api/contact/route.ts`.
  - `src/app/studio/Studio.tsx` and `src/app/studio/[[...tool]]/page.tsx` — embedded NextStudio instance.
- `src/components/*` — UI components: `Navbar`, `Footer`, cards, buttons, analytics integration.

Other scripts & docs
- `scripts/test-sanity.js` — helper script to verify Sanity connectivity locally (loads `.env.local`).
- `theory/` and `implement-docs/` — documentation and planning files (design decisions, how Sanity works, etc.).

How a request is served (example: /projects)
1. Browser requests `/projects`.
2. Next.js server component in `src/app/projects/page.tsx` runs server-side code that imports a GROQ query from `src/sanity/queries.ts` and calls `getSanityClient()`.
3. `getSanityClient()` uses the environment variables from `src/sanity/env.ts` to construct a `next-sanity` client.
4. The client executes the GROQ query against Sanity Content Lake and returns JSON.
5. Next.js renders the page with the returned data and sends HTML to the browser.

How editors update content
1. Editor goes to `/studio` and logs in with a Sanity account.
2. Using the Studio UI (generated from `schemaTypes`), they create and publish documents.
3. The Next.js site queries the published data and shows updated content.

Where to look next in the code
- `src/sanity/queries.ts` — to see exact queries used by pages.
- `sanity/schemaTypes/*` — to understand which fields editors will edit and their types.
- `src/app/studio/Studio.tsx` and `sanity.config.ts` — to understand how Studio is embedded and configured.
