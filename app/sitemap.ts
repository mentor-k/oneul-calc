import type { MetadataRoute } from "next";
import { toolSlugs } from "./tool-slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://oneulcalc.kr";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...toolSlugs.map((slug) => ({ url: `${base}/${encodeURIComponent(slug)}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["about", "editorial-policy", "privacy", "terms", "contact"].map((path) => ({ url: `${base}/${path}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
