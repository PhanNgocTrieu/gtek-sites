import "server-only";

export async function isSanityPreview() {
  const { cookies } = await import("next/headers");
  return Boolean(cookies().get("sanityPreview")?.value);
}

export async function loadCms<T>(query: string): Promise<T | null> {
  const preview = await isSanityPreview();
  const fetchModule = await import("@/sanity/fetch");
  return preview
    ? fetchModule.sanityFetchDraft<T>(query, {}, 0)
    : fetchModule.sanityFetchPublished<T>(query, {}, 60);
}
