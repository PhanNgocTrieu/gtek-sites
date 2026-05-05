import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";
import { SANITY_CACHE_TAG } from "@/sanity/fetch";

const TOKEN_TTL_SECONDS = 120;

function sameOriginAllowed(req: Request) {
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (origin && origin === site) return true;
  if (referer && referer.startsWith(site)) return true;
  if (process.env.NODE_ENV !== "production") {
    if (origin && origin.startsWith("http://localhost")) return true;
    if (referer && referer.startsWith("http://localhost")) return true;
  }
  return false;
}

function verifyToken(token: string) {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const [nonce, tsStr, sig] = raw.split(":");
    const ts = Number(tsStr || 0);
    if (!nonce || !ts || !sig) return false;
    const now = Math.floor(Date.now() / 1000);
    if (now - ts > TOKEN_TTL_SECONDS) return false;
    const secret = process.env.SANITY_PREVIEW_SECRET || process.env.SANITY_WEBHOOK_SECRET;
    if (!secret) return false;
    const payload = `${nonce}:${ts}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    if (!sameOriginAllowed(req)) {
      return NextResponse.json({ ok: false, error: "origin_not_allowed" }, { status: 403 });
    }

    const body = await req.json();
    const token = body?.token;
    const path = body?.path || "/";

    if (!token || typeof token !== "string") {
      return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
    }

    if (!verifyToken(token)) {
      return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 401 });
    }

    try {
      revalidateTag(SANITY_CACHE_TAG);
      revalidatePath(path);
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }

    return NextResponse.json({ ok: true, path });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
