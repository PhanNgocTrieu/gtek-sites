import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSanityClient } from "@/sanity/client";
import { SANITY_CACHE_TAG } from "@/sanity/fetch";

type SanityWebhookBody = Record<string, unknown>;

function idFromDocEntry(d: unknown): string | undefined {
  if (!d || typeof d !== "object") return undefined;
  const o = d as { _id?: unknown; id?: unknown };
  if (typeof o._id === "string") return o._id;
  if (typeof o.id === "string") return o.id;
  return undefined;
}

function idFromMaybeDoc(v: unknown): string | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as { _id?: unknown; id?: unknown };
  if (typeof o._id === "string") return o._id;
  if (typeof o.id === "string") return o.id;
  return undefined;
}

function collectIdsFromBody(body: SanityWebhookBody): string[] {
  const out: string[] = [];
  if (Array.isArray(body.ids)) {
    for (const x of body.ids) {
      if (typeof x === "string") out.push(x);
    }
  }
  if (Array.isArray(body.documentIds)) {
    for (const x of body.documentIds) {
      if (typeof x === "string") out.push(x);
    }
  }
  if (typeof body.documentId === "string") out.push(body.documentId);
  if (Array.isArray(body.documents)) {
    for (const d of body.documents) {
      const id = idFromDocEntry(d);
      if (id) out.push(id);
    }
  }
  if (Array.isArray(body.documentsIds)) {
    for (const x of body.documentsIds) {
      if (typeof x === "string") out.push(x);
    }
  }
  const rid = idFromMaybeDoc(body.result);
  if (rid) out.push(rid);
  const aid = idFromMaybeDoc(body.after);
  if (aid) out.push(aid);
  const bid = idFromMaybeDoc(body.before);
  if (bid) out.push(bid);
  if (typeof body._id === "string") out.push(body._id);
  if (typeof body.id === "string") out.push(body.id);
  return Array.from(new Set(out.filter(Boolean)));
}

function mapDocToPaths(type?: string, slug?: string | null) {
  // Map Sanity document types to public paths that should be revalidated.
  // Extend this mapping to match your site's routing.
  switch (type) {
    case "homePage":
    case "siteSettings":
      return ["/", "/about", "/contact", "/projects", "/services"];
    case "project":
    case "projects":
      return ["/projects", slug ? `/projects/${slug}` : "/projects"];
    case "service":
    case "services":
      return ["/services", slug ? `/services/${slug}` : "/services"];
    case "aboutPage":
      return ["/about"];
    default:
      return ["/"];
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");
    const headerSecret = req.headers.get("x-sanity-webhook-secret");
    const secret = querySecret ?? headerSecret;

    if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: "invalid_secret" }, { status: 401 });
    }

    const body = (await req.json()) as SanityWebhookBody;

    // Invalidate all Sanity-tagged data cache entries first (covers every page using tagged fetch).
    revalidateTag(SANITY_CACHE_TAG);

    const ids = collectIdsFromBody(body);

    const client = getSanityClient({ useCdn: false });
    if (!client) return NextResponse.json({ ok: false, error: "sanity_not_configured" }, { status: 500 });

    const paths = new Set<string>();

    // Always include home page
    paths.add("/");

    for (const id of ids) {
      try {
        // fetch the document's type and slug (prefers draft or published)
        const query = `*[_id in [$id, "drafts." + $id]][0]{_id, _type, slug}`;
        const doc = await client.fetch<{ _id?: string; _type?: string; slug?: { current?: string } }>(
          query,
          { id },
          {},
        );
        const type = doc?._type;
        const slug = doc?.slug?.current ?? null;
        const mapped = mapDocToPaths(type, slug);
        mapped.forEach((p) => paths.add(p));
      } catch {
        // best-effort: if we can't fetch the document, revalidate root
        paths.add("/");
      }
    }

    const revalidated: string[] = [];
    Array.from(paths).forEach((p) => {
      try {
        revalidatePath(p);
        revalidated.push(p);
      } catch {
        // ignore revalidation errors per-path
      }
    });

    return NextResponse.json({ ok: true, revalidated });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
