import type { MetadataRoute } from "next";
import { IS_PRODUCTION, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Los previews de Vercel no deben aparecer en buscadores.
  if (!IS_PRODUCTION) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
