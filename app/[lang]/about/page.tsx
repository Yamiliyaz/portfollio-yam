import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { dict, isLang } from "@/lib/i18n";

export const metadata = { title: "About" };

// TODO: construir con el frame "Portfolio / About" (482:14274) del Figma.
export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict[lang];
  return (
    <div className="page">
      <section className="section about-home">
        <div className="section-inner">
          <div className="heading-block"><h1 className="t-h2-serif">{t.about.title}</h1></div>
        </div>
      </section>
      <Footer lang={lang} t={t.footer} nav={t.nav} />
    </div>
  );
}
