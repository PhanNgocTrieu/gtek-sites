import { createClient } from "next-sanity";
import { sanityConfig } from "@/sanity/env";

const _clients: Record<string, ReturnType<typeof createClient>> = {};

function clientCacheKey(useCdn: boolean) {
  return `${sanityConfig.projectId}__${sanityConfig.dataset}__${useCdn ? "cdn" : "nocdn"}`;
}

export function getSanityClient(opts?: { useCdn?: boolean }) {
  const useCdn = typeof opts?.useCdn === "boolean" ? opts!.useCdn : sanityConfig.useCdn;

  if (!sanityConfig.projectId || !sanityConfig.dataset) return null;

  const key = clientCacheKey(useCdn);
  if (_clients[key]) return _clients[key];

  const client = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn,
    token: sanityConfig.token,
  });

  _clients[key] = client;

  return client;
}

