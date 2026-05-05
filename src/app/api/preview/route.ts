import { NextResponse } from "next/server";
import { getSanityClient } from "@/sanity/client";

// Simple preview endpoint for fetching draft or published documents using a server-side token.
// Usage (GET): /api/preview?secret=MY_SECRET&id=<documentId>

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const id = url.searchParams.get("id");

  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return NextResponse.json({ message: "Invalid or missing preview secret" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ message: "Missing document id" }, { status: 400 });
  }

  // Use a server client (no CDN) so we can read drafts when present. This client should include
  // the server read token via `SANITY_API_READ_TOKEN` in env.
  const start = Date.now();
  const client = getSanityClient({ useCdn: false });
  if (!client) {
    return NextResponse.json({ message: "Sanity client not configured" }, { status: 500 });
  }

  try {
    // fetch draft-first (drafts.<id>), fallback to published
    const doc = await client.fetch(`*[_id in [$id, "drafts." + $id]][0]`, { id });
    const elapsed = Date.now() - start;

    // Log server-side timing to help diagnose slow previews
    // These logs appear in the Next server console where the route runs.
    // Example: `Preview fetch id=homePage — 120ms`
    // eslint-disable-next-line no-console
    console.info(`Preview fetch id=${id} — ${elapsed}ms`);

    return NextResponse.json({ id, elapsedMs: elapsed, document: doc }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Preview fetch error:", err);
    return NextResponse.json({ message: "Failed to fetch preview document" }, { status: 500 });
  }
}
