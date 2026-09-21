import config from "../../config.js";

export const siteConfig = config;
export type SiteConfig = typeof config;

export function coalesceText(
  value: string | null | undefined,
  fallback: string,
): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

export function coalesceList<T>(value: T[] | null | undefined, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

export function coalesceBool(value: boolean | null | undefined, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/** Prefer a Sanity asset URL; otherwise a local path from config.js. Empty string means no image. */
export function coalesceImage(
  sanityUrl: string | null | undefined,
  fallback: string | null | undefined = "",
): string {
  const fromCms = typeof sanityUrl === "string" ? sanityUrl.trim() : "";
  if (fromCms) return fromCms;
  const fromConfig = typeof fallback === "string" ? fallback.trim() : "";
  return fromConfig;
}

const LOCAL_IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

export function resolveImageSrc(src: string | undefined, fallback = ""): string {
  const raw = coalesceImage(src, fallback);
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  const withoutPublic = raw.replace(/^\/?public\//, "/");
  const path = withoutPublic.startsWith("/") ? withoutPublic : `/${withoutPublic}`;
  if (LOCAL_IMAGE_EXTS.some((ext) => path.toLowerCase().endsWith(ext))) {
    return path;
  }
  return `${path}.jpg`;
}

export function pageSeo(
  sanity: { seoTitle?: string | null; seoDescription?: string | null } | null | undefined,
  fallback: { title: string; description: string },
) {
  return {
    title: coalesceText(sanity?.seoTitle, fallback.title),
    description: coalesceText(sanity?.seoDescription, fallback.description),
  };
}
