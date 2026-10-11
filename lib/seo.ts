import type { Metadata } from "next";
import { LANGS, type Lang } from "./i18n";

/** URL pública del sitio. Con dominio propio basta definir NEXT_PUBLIC_SITE_URL en Vercel. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const SITE_NAME = "Yamil Arroyo";
/** Solo producción se indexa; los previews de Vercel quedan fuera de buscadores. */
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

const LOCALE: Record<Lang, string> = { en: "en_US", es: "es_MX" };

type Args = {
  lang: Lang;
  /** Ruta sin idioma: "", "/work", "/about", "/work/slug". */
  path: string;
  title: string;
  description: string;
  /** true = el título ya es completo (Home) y no lleva el sufijo "| Yamil Arroyo". */
  absolute?: boolean;
  image?: string;
};

export function pageMetadata({ lang, path, title, description, absolute, image }: Args): Metadata {
  const url = `/${lang}${path}`;
  const languages: Record<string, string> = Object.fromEntries(LANGS.map((l) => [l, `/${l}${path}`]));
  languages["x-default"] = `/en${path}`;
  // Imágenes estáticas 1200×630 (public/og-en.png, public/og-es.png): sin dependencias de runtime.
  const ogImage = image ?? `/og-${lang}.png`;
  const fullTitle = absolute ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: LOCALE[lang],
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LOCALE[l]),
      images: [{ url: ogImage }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage] },
  };
}
