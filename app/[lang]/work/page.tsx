import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { dict, isLang } from "@/lib/i18n";
import { getProjects, pick, type Project } from "@/lib/notion";
import type { Lang } from "@/lib/i18n";

export const revalidate = 1800;
export const metadata = { title: "Work" };

function Card({ p, lang, label, tall }: { p: Project; lang: Lang; label: string; tall?: boolean }) {
  return (
    <Link href={`/${lang}/work/${p.slug}`} className={`card${tall ? " tall" : ""}`}>
      {p.cover && <img className="bg" src={p.cover} alt="" />}
      <div className="scrim" />
      <div className="text">
        <p className="t-h6">{p.name}</p>
        <p className="desc">{pick(p.short, lang)}</p>
      </div>
      <span className="cta">
        {label}
        <img className="icon20" src="/icons/arrow-outward-light.svg" alt="" />
      </span>
    </Link>
  );
}

export default async function Work({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict[lang];
  const projects = await getProjects();
  // Bento del Figma: 2 tarjetas anchas a la izquierda; columna derecha alta + corta.
  // Con más de 4 proyectos el patrón se repite.
  const left: Project[] = [];
  const right: { p: Project; tall: boolean }[] = [];
  projects.forEach((p, i) => {
    const slot = i % 4;
    if (slot === 0 || slot === 1) left.push(p);
    else right.push({ p, tall: slot === 2 });
  });

  return (
    <div className="page">
      <section className="section" style={{ minHeight: 1136 }}>
        <div className="section-inner">
          <div className="work-head">
            <h1 className="t-h2-serif" style={{ color: "var(--gray-900)" }}>{t.work.title}</h1>
            <p className="t-p1">{t.work.lead}</p>
          </div>
          <div className="bento">
            <div className="bento-col">
              {left.map((p) => <Card key={p.id} p={p} lang={lang} label={t.work.readMore} />)}
            </div>
            <div className="bento-col">
              {right.map(({ p, tall }) => <Card key={p.id} p={p} lang={lang} label={t.work.readMore} tall={tall} />)}
            </div>
          </div>
        </div>
      </section>
      <Footer lang={lang} t={t.footer} nav={t.nav} />
    </div>
  );
}
