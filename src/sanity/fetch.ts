import "server-only";

import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/client";

/** Single tag for all Sanity-backed fetch caches — pair with `revalidateTag` from webhooks/studio. */
export const SANITY_CACHE_TAG = "sanity";

type FetchOpts = {
  revalidateSeconds?: number;
  useCdn?: boolean;
  /** Use API token + draft perspective (for Studio preview cookie flows). */
  drafts?: boolean;
};

function nextCacheOpts(revalidateSeconds: number) {
  // revalidate: 0 / false = no Data Cache (needed in local/dev so CMS edits show immediately)
  if (revalidateSeconds <= 0) {
    return {
      revalidate: 0 as const,
      tags: [SANITY_CACHE_TAG],
    };
  }
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

  const client = getSanityClient({
    useCdn: Boolean(opts.useCdn),
    withToken: Boolean(opts.drafts),
  });
  if (!client) return null;

  try {
    const data = await client.fetch<T>(query, params ?? {}, {
      next: nextCacheOpts(opts.revalidateSeconds ?? 60),
    });
    return data;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[sanityFetch] query failed:", err);
    }
    return null;
  }
}

/**
 * Published content for the live site.
 * Uses the public API (no token) so a bad/mismatched SANITY_API_READ_TOKEN cannot break the site.
 */
export async function sanityFetchPublished<T>(
  query: string,
  params?: Record<string, unknown>,
  revalidateSeconds = 10,
) {
  // In development, always bypass Next data cache so Studio edits appear after refresh.
  const seconds = process.env.NODE_ENV === "development" ? 0 : revalidateSeconds;
  return sanityFetch<T>(query, params, { revalidateSeconds: seconds, useCdn: false, drafts: false });
}

export async function sanityFetchDraft<T>(
  query: string,
  params?: Record<string, unknown>,
  revalidateSeconds = 0,
) {
  return sanityFetch<T>(query, params, {
    revalidateSeconds,
    useCdn: false,
    drafts: true,
  });
}
