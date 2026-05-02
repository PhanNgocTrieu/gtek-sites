# GTek Website — Improvement Opportunities & Roadmap

This document lists practical improvements, grouped by priority, with short descriptions and suggested effort estimates.

High Priority (should be done soon)
- 1) Secure environment & token management
  - Move secret tokens to hosting environment variables (Vercel). Ensure `SANITY_API_READ_TOKEN` is never exposed to client builds. (Effort: 0.5–1 day)
- 2) Preview / draft workflow for editors
  - Implement Next.js preview routes and server-side endpoints that use a server-only token to fetch drafts so editors can preview unpublished content. (Effort: 1–2 days)
- 3) Content templates and validation
  - Add document-level validation and content templates for common page types (project, blog). Reduces editor errors. (Effort: 0.5–1 day)

Medium Priority (nice to have)
- 4) Editor UX improvements in Studio
  - Customize `deskStructure.ts` to hide technical collections, surface frequently used document types, add helpful descriptions for fields, and provide guided templates for non-technical editors. (Effort: 1 day)
- 5) Image optimization & CDN
  - Ensure images use Sanity Image URLs with appropriate transforms. Consider integrating a CDN or rely on Sanity's built-in delivery for performance. (Effort: 0.5–1 day)
- 6) SEO and structured data
  - Add meta tags, open graph, and JSON-LD generation for pages. Include `siteSettings` schema for default SEO values. (Effort: 1 day)

Low Priority / Long-term
- 7) Access control and roles
  - Define editor roles in Sanity (author, editor, admin) and restrict what each role can publish. (Effort: 1–2 days)
- 8) Scheduled publishing
  - Add a scheduling tool or plugin so editors can set publish times for content. (Effort: 1–2 days)
- 9) Backups & export strategy
  - Implement periodic export of content (Sanity export or nightly backup) to guard against data loss. (Effort: 0.5–1 day)

Developer quality-of-life
- 10) CI checks & tests
  - Add lightweight tests for sanity-client queries (contract tests) and linting/format steps in CI. (Effort: 1–2 days)
- 11) Local Studio vs embedded Studio strategy
  - Evaluate whether to keep embedding Studio in production builds or run a separate Studio deployment (safer separation of concerns). (Effort: 0.5 day)
- 12) Docs & onboarding
  - Create a short non-technical editor guide (how to create projects, images, publish). Add screenshots to `theory/` or `README`. (Effort: 0.5–1 day)

Suggested immediate roadmap (next 4 tasks)
1. Add `.env.local.example` (already present) and update README with exact env steps. (0.5 day)
2. Implement server-side preview route for drafts and a `Preview` button in Studio. (1–2 days)
3. Customize desk structure and create editor templates for `project` and `blog`. (1 day)
4. Add CI step to run `node scripts/test-sanity.js` (sanity connectivity smoke test) in PRs. (0.5 day)

If you want, I can start implementing the highest-priority items: add a preview route + server endpoint, or create editor templates and desk changes. Which should I start first?
