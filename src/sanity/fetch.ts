import "server-only";

import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/client";

/** Single tag for all Sanity-backed fetch caches — pair with `revalidateTag` from webhooks/studio. */
export const SANITY_CACHE_TAG = "sanity";

type FetchOpts = {
  revalidateSeconds?: number;
  useCdn?: boolean;
};

function nextCacheOpts(revalidateSeconds: number) {
  return {
    revalidate: revalidateSeconds,
    tags: [SANITY_CACHE_TAG],
  };
}

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  opts: FetchOpts = { revalidateSeconds: 60, useCdn: false },
) {
  if (!isSanityConfigured()) return null;

  const client = getSanityClient({ useCdn: Boolean(opts.useCdn) });
  if (!client) return null;

  try {
    const data = await client.fetch<T>(query, params ?? {}, {
      next: nextCacheOpts(opts.revalidateSeconds ?? 60),
    });
    return data;
  } catch {
    return null;
  }
}

/**
 * Published content for the live site.
 * Use API directly (not Sanity CDN): after publish, the CDN can briefly serve stale API responses,
 * which makes “publish → refresh site” feel slow even when Next.js revalidates.
 */
export async function sanityFetchPublished<T>(
  query: string,
  params?: Record<string, unknown>,
  revalidateSeconds = 10,
) {
  return sanityFetch<T>(query, params, { revalidateSeconds, useCdn: false });
}

export async function sanityFetchDraft<T>(
  query: string,
  params?: Record<string, unknown>,
  revalidateSeconds = 10,
) {
  if (!isSanityConfigured()) return null;

  const client = getSanityClient({ useCdn: false });
  if (!client) return null;

  try {
    const data = await client.fetch<T>(query, params ?? {}, {
      next: nextCacheOpts(revalidateSeconds),
    });
    return data;
  } catch {
    return null;
  }
}

