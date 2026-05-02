import "server-only";

import { isSanityConfigured } from "@/sanity/env";
import { getSanityClient } from "@/sanity/client";

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>, revalidateSeconds = 60) {
  if (!isSanityConfigured()) return null;

  const client = getSanityClient();
  if (!client) return null;

  try {
    const data = await client.fetch<T>(query, params ?? {}, {
      next: { revalidate: revalidateSeconds },
    });
    return data;
  } catch {
    return null;
  }
}

