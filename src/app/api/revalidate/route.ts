import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SANITY_CACHE_TAG } from '@/sanity/fetch';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const secret = body?.secret || req.headers.get('x-preview-secret');
    const path = body?.path || '/';

    if (!secret || secret !== process.env.SANITY_PREVIEW_SECRET) {
      return NextResponse.json({ ok: false, error: 'invalid_secret' }, { status: 401 });
    }

    // revalidate the given path (app-router cache revalidation)
    try {
      revalidateTag(SANITY_CACHE_TAG);
      revalidatePath(path);
    } catch (err) {
      // In some deployments revalidatePath may not be available; still attempt
      // to return success so callers can fall back to a client refresh.
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
