const SANITY_API_VERSION_FALLBACK = "2024-01-01";
const apiVersionFromEnv = process.env.NEXT_SANITY_API_VERSION?.trim();

export const sanityConfig = {
  projectId: process.env.NEXT_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_SANITY_DATASET ?? "",
  apiVersion: apiVersionFromEnv && apiVersionFromEnv.length > 0 ? apiVersionFromEnv : SANITY_API_VERSION_FALLBACK,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_READ_TOKEN,
} as const;

export function isSanityConfigured() {
  return Boolean(sanityConfig.projectId && sanityConfig.dataset);
}

