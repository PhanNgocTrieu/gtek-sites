Preview & timing helper — how to use

Purpose

- Provide a lightweight preview API that editors (or Studio actions) can call to fetch draft or published documents using a server-only token.
- Emit basic timing so you can see where delays occur when opening the "Published" or "Preview" view from Studio.

Setup

1. Ensure these environment variables are set in your `.env.local` (or in your deployment):
  - `SANITY_API_READ_TOKEN` — (server-only) token with read access to drafts.
  - `SANITY_PREVIEW_SECRET` — a secret string used to validate preview requests from Studio.

Using the preview route

- Example request (browser or Studio link):
- Quick JSON fetch (returns document + server-side elapsed ms):
   GET /api/preview?secret=YOUR_SECRET&id=homePage
- Redirect-style entry (sets preview cookie then redirects to your site):
   GET /api/preview/enter?secret=YOUR_SECRET&id=homePage&redirect=/
   This will set a short httpOnly `sanityPreview` cookie and redirect to `/` (or any provided `redirect` path). Server pages will detect the cookie and use draft reads.

To clear preview mode:

   GET /api/preview/exit?redirect=/

This will clear the `sanityPreview` cookie and redirect to the provided path.

- The route returns JSON with the fetched document and `elapsedMs` (server-side fetch time).
- If you want to inspect timings end-to-end, open Chrome DevTools → Network and request the endpoint. The network timing shows transport + server time; `elapsedMs` shows only the server fetch time.

Measuring the Studio "Published" / Preview latency

1. Reproduce the slow action in Studio (click "Published" or the preview link).
2. In the Studio browser window open DevTools → Network and Performance.
3. Network tab:
  - Look for requests to your front-end preview URL or API endpoints. Note total time and transfer size.
4. Performance tab:
  - Start recording, click the preview/published link, wait until the page is interactive, stop recording. Look for long scripting or layout tasks.
5. Server-side timing:
  - If you use `/api/preview` to fetch drafts, check the server logs for lines like: `Preview fetch id=homePage — 120ms`.
  - Combine server `elapsedMs` + client network timing to get an end-to-end view.

Notes & next steps

- This preview endpoint is intentionally simple and returns JSON. For a full preview workflow that redirects editors into your site showing drafts, implement a preview route that sets Next.js preview cookies and redirects to a preview-enabled page that reads drafts server-side.
- Use `sanityFetchPublished()` (provided in the project) for fast CDN-backed reads for public pages. Use non-CDN server client for draft-aware preview flows.

If you want, I can implement the full redirect-style preview flow that integrates with Next's preview mode and the Studio preview button.