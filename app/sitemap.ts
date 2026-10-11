import type { MetadataRoute } from "next";
import { LANGS } from "@/lib/i18n";
import { getProjects } from "@/lib/notion";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const paths = ["", "/work", "/about", ...projects.map((p) => `/work/${p.slug}`)];
  const now = new Date();
  return paths.flatMap((path) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/work" || path === "/about" ? 0.8 : 0.6,
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
