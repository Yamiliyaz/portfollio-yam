import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import RouteTransition from "@/components/RouteTransition";
import { LANGS, dict, isLang } from "@/lib/i18n";
import "../globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-manrope", display: "swap" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Yamil Arroyo — Product Designer", template: "%s | Yamil Arroyo" },
  description: "Digital product designer with over 11 years of experience.",
};

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
        <RouteTransition>
          <main>{children}</main>
        </RouteTransition>
      </body>
    </html>
  );
}
