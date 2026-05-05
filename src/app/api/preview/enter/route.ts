import { NextResponse } from "next/server";

// Preview entry route: validates secret and sets a short preview cookie, then redirects.
// Usage: /api/preview/enter?secret=MY_SECRET&id=homePage&redirect=/

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const id = url.searchParams.get("id");
  const redirectTo = url.searchParams.get("redirect") ?? "/";

  if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return NextResponse.json({ message: "Invalid or missing preview secret" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ message: "Missing document id" }, { status: 400 });
  }

  // Set a short-lived httpOnly cookie that indicates preview mode and the target id.
  const res = NextResponse.redirect(redirectTo);
  // cookie name: sanityPreview (httpOnly)
  res.cookies.set("sanityPreview", id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
