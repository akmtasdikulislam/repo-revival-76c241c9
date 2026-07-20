/**
 * Build a route `head().meta` array with consistent OG + Twitter tags.
 * Single source of truth for per-route SEO metadata.
 */
export const SITE_NAME = "BUP CSE Tech Carnival 2.0";

export type MetaTag =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string };

export function buildMeta({
  title,
  description,
  ogImage,
  ogType = "website",
}: {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
}): MetaTag[] {
  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  if (ogImage) {
    meta.push(
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    );
  }
  return meta;
}
