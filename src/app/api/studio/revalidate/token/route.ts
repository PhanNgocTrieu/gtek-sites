import { NextResponse } from "next/server";
import crypto from "crypto";

// Returns a short-lived signed token that the Studio can use to call the
// server-side revalidate endpoint without exposing the server secret.
// The token is HMAC(secret, nonce:ts) with a TTL (default 2 minutes).

const TOKEN_TTL_SECONDS = 120;

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function buildAllowedOrigins(req: Request) {
  const allowed = new Set<string>();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  const requestOrigin = normalizeOrigin(req.url);
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
  const forwardedOrigin = forwardedHost ? normalizeOrigin(`${forwardedProto}://${forwardedHost}`) : "";

  for (const value of [siteUrl, vercelUrl, requestOrigin, forwardedOrigin]) {
    const normalized = normalizeOrigin(value);
    if (normalized) allowed.add(normalized);
  }

  return allowed;
}

function sameOriginAllowed(req: Request) {
  const origin = normalizeOrigin(req.headers.get("origin") || "");
  const referer = req.headers.get("referer") || "";
  const allowedOrigins = buildAllowedOrigins(req);

  if (origin && allowedOrigins.has(origin)) return true;
  if (referer) {
    const refererOrigin = normalizeOrigin(referer);
    if (refererOrigin && allowedOrigins.has(refererOrigin)) return true;
  }
  // In non-production allow localhost as well
  if (process.env.NODE_ENV !== "production") {
    if (origin && origin.startsWith("http://localhost")) return true;
    if (referer && referer.startsWith("http://localhost")) return true;
  }
  return false;
}

export async function GET(req: Request) {
  try {
    if (!sameOriginAllowed(req)) {
      return NextResponse.json({ ok: false, error: "origin_not_allowed" }, { status: 403 });
    }

    const secret = process.env.SANITY_PREVIEW_SECRET || process.env.SANITY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ ok: false, error: "server_secret_missing" }, { status: 500 });
    }

    const nonce = crypto.randomBytes(8).toString("hex");
    const ts = Math.floor(Date.now() / 1000);
    const payload = `${nonce}:${ts}`;
    const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const token = Buffer.from(`${nonce}:${ts}:${hmac}`).toString("base64url");

    return NextResponse.json({ ok: true, token, ttl: TOKEN_TTL_SECONDS });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
