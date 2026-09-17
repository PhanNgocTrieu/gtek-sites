Practical Guide — Getting an API Key, Applying It, and Real-life Workflow

This document complements `theory/sanity-cms.md` with clear, actionable steps for configuring Sanity with this Next.js project, obtaining API tokens, testing locally, and enabling editors to manage content without code.

Files to check in this repo:
- `sanity.config.ts` — reads `NEXT_SANITY_PROJECT_ID` and `NEXT_SANITY_DATASET` for the embedded Studio.
- `src/sanity/env.ts` — the app's canonical Sanity configuration (projectId, dataset, apiVersion, useCdn, token).
- `src/sanity/client.ts` — creates `next-sanity` client using `env.ts`.

1) Which token should you create?
- Sanity tokens can have `read`, `write`, or `admin` scopes. For this site:
  - Use `NEXT_PUBLIC_*` env variables for non-secret values (project id, dataset, apiVersion).
  - Store tokens as non-public env vars (do not expose tokens through `NEXT_PUBLIC_` prefixes).
  - For typical public websites that only display published content, a `read` token is sufficient for server-side reads.

2) How to create an API token in Sanity (step-by-step)
1. Go to https://manage.sanity.io/ and log in.
2. Select your project.
3. Open `API` in the left menu.
4. In `Tokens` click `Add token`.
5. Name the token (e.g. `Next Server Read Token`) and choose `read` (or `read` + `write` if needed server-side).
6. Copy the token string (it starts with `sk...`) and store it safely.

3) Where to put the token and env values
- Locally create a `.env.local` (DO NOT commit). Example:

```
NEXT_SANITY_PROJECT_ID=your_project_id_here
NEXT_SANITY_DATASET=production
NEXT_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=skYourTokenHere
```

- `sanity.config.ts` consumes the `NEXT_PUBLIC_*` values and supports the embedded Studio (`NextStudio`).
- `src/sanity/env.ts` expects `SANITY_API_READ_TOKEN` (server-side variable used by `getSanityClient()` in `src/sanity/client.ts`).
- In production, add these variables to your hosting provider (Vercel: Project → Settings → Environment Variables). Keep `SANITY_API_READ_TOKEN` secret.

4) Test locally
1. Create `.env.local` using the example above.
2. Run:

```bash
npm install
npm run dev
```

3. Visit `http://localhost:3000/studio` — if the embedded Studio loads and shows schemas (Project, Service, Author), the public env vars are correct.
4. To test server reads, create `scripts/test-sanity.js` (example below) and run it with node (after loading env vars).

Example `scripts/test-sanity.js`:

```js
// scripts/test-sanity.js
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_SANITY_DATASET,
  dataset: process.env.NEXT_SANITY_DATASET,
  apiVersion: process.env.NEXT_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

(async () => {
  try {
    const data = await client.fetch(`*[_type == "project"][0..2]{_id, title}`);
    console.log('OK — fetched:', data.length, 'projects');
  } catch (err) {
    console.error('Sanity fetch error:', err.message || err);
  }
})();
```

5) Real-life workflow (non-technical users)
- Invite editors to the Sanity project from the Sanity management UI (Project → Invite members).
- Editors sign in to the Studio (`/studio`), use the provided forms to create/edit content, upload images, and publish. No code needed.
- If you want draft previews on the website, a preview route and server-side token are required (we can implement that).

6) Security & best practices
- Do not commit secrets to Git. Add `.env.local` to `.gitignore`.
- Use least privilege tokens. Prefer `read` for server-side read-only access.
- In Vercel, add env vars in Project Settings and mark tokens as the correct environment (Preview/Production).

7) Suggested next tasks I can perform for you
- Create `.env.local.example` with placeholders in the repo.
- Add `scripts/test-sanity.js` and a README snippet with exact commands to run tests locally.
- Implement draft preview routes if you need content previewing before publishing.

Tell me which of the next tasks you want me to implement now and I will add them to the repo.
