# Studio Revalidation & Preview — secure token flow

This document explains the two revalidation flows available and how to use the secure server-mediated token flow from Sanity Studio.

Summary
- Webhook (recommended, server-to-server): Sanity calls `/api/webhooks/sanity?secret=...` after publish — no secrets in Studio.
- Studio token flow (secure): Studio requests a short-lived token from `/api/studio/revalidate/token` and then POSTs `{ token, path }` to `/api/studio/revalidate`.

Environment
- `SANITY_PREVIEW_SECRET` or `SANITY_WEBHOOK_SECRET` — required on the server (used to sign/verify tokens and for webhook validation).
- `NEXT_PUBLIC_SITE_URL` — public base URL of the site (e.g. `https://example.com`). Used for Origin/Referer checks in development.

Webhook setup (automatic, recommended)
1. In Sanity Studio project settings, create a webhook with URL:
   - `https://<your-site>/api/webhooks/sanity?secret=<YOUR_SECRET>`
   - OR set header `x-sanity-webhook-secret: <YOUR_SECRET>`
2. Select events: `Publish` (or Create/Update/Delete as desired).
3. Provide the same secret value in your host's environment as `SANITY_WEBHOOK_SECRET`.

Studio token flow (manual refresh button)
1. Studio makes GET `/api/studio/revalidate/token` (same-origin). The server returns `{ token, ttl }`.
2. Studio POSTs `{ token, path }` to `/api/studio/revalidate`.
3. Server verifies token and calls `revalidatePath(path)`.

Local testing
1. Start Next dev server:
```bash
npm run dev
```
2. Test token issuance:
```bash
curl -i -X GET 'http://localhost:3000/api/studio/revalidate/token' -H 'Origin: http://localhost:3000'
```
Expected response: `{ "ok": true, "token": "<base64url>", "ttl": 120 }`

3. Use token to revalidate a path:
```bash
TOKEN="<paste token from previous>"
curl -i -X POST 'http://localhost:3000/api/studio/revalidate' \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:3000' \
  -d '{"token":"'$TOKEN'","path":"/projects/my-slug"}'
```

4. Webhook test (server-to-server):
```bash
curl -i -X POST 'http://localhost:3000/api/webhooks/sanity?secret=YOUR_SECRET' \
  -H 'Content-Type: application/json' \
  -d '{"ids":["<documentId>"]}'
```

Notes & troubleshooting
- Ensure `SANITY_PREVIEW_SECRET` (or `SANITY_WEBHOOK_SECRET`) is present in your deployment environment.
- The token endpoint enforces same-origin checks (Origin/Referer). In development it allows `http://localhost`.
- If revalidation doesn't appear to update the page instantly, check build/runtime logs and your platform's caching (some hosts delay ISR updates slightly).

If you'd like, I can also add a small integration test script to automate the above curl calls.
