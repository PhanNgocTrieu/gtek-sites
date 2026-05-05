import { NextResponse } from "next/server";

// Clear preview cookie and redirect back.
// Usage: GET /api/preview/exit?redirect=/

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirectTo = url.searchParams.get("redirect") ?? "/";

  const res = NextResponse.redirect(redirectTo);
  res.cookies.set("sanityPreview", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
