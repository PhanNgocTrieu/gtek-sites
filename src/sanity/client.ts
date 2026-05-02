import { createClient } from "next-sanity";
import { sanityConfig } from "@/sanity/env";

let _client: ReturnType<typeof createClient> | null = null;

export function getSanityClient() {
  if (!sanityConfig.projectId || !sanityConfig.dataset) return null;
  if (_client) return _client;

  _client = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn: sanityConfig.useCdn,
    token: sanityConfig.token,
  });

  return _client;
}

