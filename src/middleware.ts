import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Extra protection for the embedded Sanity Studio route.
 *
 * Sanity Studio itself still requires Sanity login; this middleware adds an
 * optional "company-only" gate (Basic Auth) for the /studio path.
 *
 * Configure:
 * - STUDIO_BASIC_AUTH_USER
 * - STUDIO_BASIC_AUTH_PASS
 *
 * If these are not set, the middleware is a no-op.
 */
export function middleware(req: NextRequest) {
  const user = process.env.STUDIO_BASIC_AUTH_USER;
  const pass = process.env.STUDIO_BASIC_AUTH_PASS;
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization") ?? "";
  const [type, value] = auth.split(" ");
  if (type !== "Basic" || !value) return unauthorized();

  let decoded = "";
  try {
    decoded = Buffer.from(value, "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  const idx = decoded.indexOf(":");
  const suppliedUser = idx >= 0 ? decoded.slice(0, idx) : "";
  const suppliedPass = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (suppliedUser !== user || suppliedPass !== pass) return unauthorized();
  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="GTek Studio", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/studio/:path*"],
};

