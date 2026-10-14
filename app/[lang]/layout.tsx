import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import RouteTransition from "@/components/RouteTransition";
import ScrollMemory from "@/components/ScrollMemory";
import { LANGS, dict, isLang } from "@/lib/i18n";
import { IS_PRODUCTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-manrope", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "swap" });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = isLang(lang) ? dict[lang].seo.home : dict.en.seo.home;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: `%s | ${SITE_NAME}` },
    description: t.description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    icons: { icon: "/favicon.svg" },
    robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={`${manrope.variable} ${dmSerif.variable}`}>
      <body>
        <Nav lang={lang} t={dict[lang].nav} />
        <ScrollMemory />
        <RouteTransition>
          <main>{children}</main>
        </RouteTransition>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
