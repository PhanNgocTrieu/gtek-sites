import { createClient, type SanityClient } from "next-sanity";
import { sanityConfig } from "@/sanity/env";

const _clients: Record<string, SanityClient> = {};

function clientCacheKey(useCdn: boolean, withToken: boolean) {
  return `${sanityConfig.projectId}__${sanityConfig.dataset}__${useCdn ? "cdn" : "nocdn"}__${withToken ? "authed" : "public"}`;
}

/**
 * @param opts.withToken — pass true only when reading drafts / private datasets.
 *   Published site content must NOT send a bad token (invalid tokens cause every query to 401).
 */
export function getSanityClient(opts?: { useCdn?: boolean; withToken?: boolean }) {
  const useCdn = typeof opts?.useCdn === "boolean" ? opts.useCdn : sanityConfig.useCdn;
  const withToken = Boolean(opts?.withToken && sanityConfig.token);

  if (!sanityConfig.projectId || !sanityConfig.dataset) return null;

  const key = clientCacheKey(useCdn, withToken);
  if (_clients[key]) return _clients[key];

  const client = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn,
    ...(withToken ? { token: sanityConfig.token, perspective: "previewDrafts" as const } : {}),
  });

  _clients[key] = client;
  return client;
}
