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
  // Cada 4 proyectos forman un bloque, para que los bloques se apilen sin desbalancear columnas.
  const blocks: Project[][] = [];
  for (let i = 0; i < projects.length; i += 4) blocks.push(projects.slice(i, i + 4));

  return (
    <div className="page">
      <section className="section" style={{ minHeight: 1136 }}>
        <div className="section-inner">
          <div className="work-head">
            <h1 className="t-h2-serif" style={{ color: "var(--gray-900)" }}>{t.work.title}</h1>
            <p className="t-p1">{t.work.lead}</p>
          </div>
          {blocks.map((block, bi) => (
            <div className="bento" key={bi}>
              <div className="bento-col">
                {block.slice(0, 2).map((p) => <Card key={p.id} p={p} lang={lang} label={t.work.readMore} />)}
              </div>
              <div className="bento-col">
                {block[2] && <Card p={block[2]} lang={lang} label={t.work.readMore} tall />}
                {block[3] && <Card p={block[3]} lang={lang} label={t.work.readMore} />}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer lang={lang} t={t.footer} nav={t.nav} />
    </div>
  );
}
