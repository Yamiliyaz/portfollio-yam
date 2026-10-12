import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import FigmaEmbed, { figmaEmbedUrl } from "@/components/FigmaEmbed";
import { Blocks, toSections } from "@/components/NotionBlocks";
import { LevelIcon, palette } from "@/components/ProjectVisual";
import Stepper from "@/components/Stepper";
import { pageMetadata } from "@/lib/seo";
import { dict, isLang, LANGS } from "@/lib/i18n";
import { formatPeriod, getBlocks, getProject, getVisible, hasDetail, pick, projectName, yearRange } from "@/lib/notion";

// Las URLs de archivos de Notion caducan a la hora: regenerar seguido.
export const revalidate = 900;

export async function generateStaticParams() {
  const all = await getVisible();
  return LANGS.flatMap((lang) =>
    all.filter(hasDetail).map((p) => ({ lang, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = isLang(lang) ? await getProject(slug) : null;
  if (!data || !isLang(lang)) return {};
  const { project } = data;
  return pageMetadata({
    lang,
    path: `/work/${slug}`,
    title: projectName(project, lang),
    description: pick(project.short, lang),
    image: project.featuredImage ?? undefined,
  });
}

const paragraphs = (s: string) => s.split(/\n+/).map((x) => x.trim()).filter(Boolean);


function Prose({ text }: { text: string }) {
  return <div className="prose t-p1">{paragraphs(text).map((p, i) => <p key={i}>{p}</p>)}</div>;
}

function Section({ id, title, children }: { id: string; title?: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="proj-section" id={id} rise={40}>
      <div className="cols">
        <div className="col-a">{title && <h2>{title}</h2>}</div>
        <div className="col-b">{children}</div>
      </div>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const data = await getProject(slug);
  if (!data) notFound();
  const { project: p, related } = data;
  const t = dict[lang];
  const s = t.project.sections;
  const g = t.work.gallery;

  const short = pick(p.short, lang);
  const sections = toSections(await getBlocks(p.id));
  const mirrored = sections.length > 0;
  const prototype = p.figmaUrl && figmaEmbedUrl(p.figmaUrl) ? p.figmaUrl : "";

  // Sin cuerpo en Notion: se usan las propiedades de texto (Problema, Solución…) como respaldo.
  const fallback = mirrored
    ? []
    : [
        { id: "highlights", title: s.highlights, text: pick(p.impact, lang).replace(/\s\|\s/g, "\n") },
        { id: "problem", title: s.problem, text: pick(p.problem, lang) },
        { id: "research", title: s.research, text: pick(p.research, lang) },
        { id: "solution", title: s.solution, text: pick(p.solution, lang) },
        { id: "release", title: s.release, text: pick(p.postRelease, lang) },
      ].filter((x) => x.text);

  const steps = [
    ...sections.map((x) => ({ id: x.id, label: x.title || s.introduction })),
    ...fallback.map((x) => ({ id: x.id, label: x.title })),
    ...(prototype ? [{ id: "prototype", label: t.project.prototype }] : []),
    ...(related.length ? [{ id: "related", label: s.related }] : []),
  ];

  const c = palette(p.company);
  const status = p.status ? g.statuses[p.status as keyof typeof g.statuses] ?? p.status : "";

  return (
    <div className="page proj-layout">
      <Stepper steps={steps} backHref={`/${lang}/work`} backLabel={t.project.back} contentLabel={t.project.content} />

      <section className="proj-hero2">
        <div className="ph-copy">
          <div className="wg-foot" style={{ justifyContent: "flex-start", gap: 12 }}>
            <span className="wg-tag">{g.levels[p.level as keyof typeof g.levels] ?? p.level}</span>
            {status && (
              <span className="wg-status">
                <i className={`wg-dot ${p.status === "En progreso" ? "live" : "done"}`} />
                {status}
              </span>
            )}
          </div>
          <h1 className="ph-title">{projectName(p, lang)}</h1>
          <p className="ph-short">{short}</p>
          <dl className="ph-facts">
            {p.company && <div><dt>{t.project.facts.company}</dt><dd>{p.company}</dd></div>}
            {p.role && <div><dt>{t.project.role}</dt><dd>{p.role}</dd></div>}
            {formatPeriod(p, lang, t.project.present) && <div><dt>{t.project.facts.period}</dt><dd>{formatPeriod(p, lang, t.project.present)}</dd></div>}
          </dl>
          {steps[0] && (
            <a className="btn btn-dark" href={`#${steps[0].id}`}>
              {t.project.start}
              <img className="icon20" src="/icons/arrow-down.svg" alt="" style={{ filter: "invert(1)" }} />
            </a>
          )}
        </div>
        <div className="ph-media">
          {p.featuredImage ? (
            <img src={p.featuredImage} alt={projectName(p, lang)} />
          ) : (
            <div className="ph-placeholder" style={{ ["--accent" as string]: c.accent, background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
              <LevelIcon level={p.level} className="ph-icon" />
            </div>
          )}
        </div>
      </section>

      {(p.team || p.tools.length > 0) && (
        <section className="ph-meta">
          {p.team && (
            <div>
              <h2>{t.project.team}</h2>
              <ul className="small">
                {p.team.split(/\s\|\s|\n|,\s(?=[A-ZÁÉÍÓÚ][^,]*\()/).map((m) => <li key={m}>{m.trim()}</li>)}
              </ul>
            </div>
          )}
          {p.tools.length > 0 && (
            <div>
              <h2>{t.project.tools}</h2>
              <div className="ph-tools">{p.tools.map((tool) => <span key={tool} className="wg-tool">{tool}</span>)}</div>
            </div>
          )}
        </section>
      )}

      {sections.map((x) => (
        <Section key={x.id} id={x.id} title={x.title || undefined}>
          <div className="nb"><Blocks blocks={x.blocks} /></div>
        </Section>
      ))}
      {fallback.map((x) => (
        <Section key={x.id} id={x.id} title={x.title}><Prose text={x.text} /></Section>
      ))}

      {prototype && (
        <Section id="prototype" title={t.project.prototype}>
          <FigmaEmbed url={prototype} title={`${projectName(p, lang)} — ${t.project.prototype}`} />
        </Section>
      )}

      {related.length > 0 && (
        <Section id="related" title={s.related}>
          <div className="related">
            {related.map((r) => {
              const on = hasDetail(r);
              const Row: React.ElementType = on ? Link : "div";
              return (
                <Row
                  key={r.id}
                  {...(on ? { href: `/${lang}/work/${r.slug}` } : { "aria-disabled": true })}
                  className="proj-row"
                  style={{ height: "auto", padding: "24px 16px", ...(on ? {} : { opacity: 0.5 }) }}
                >
                  <div className="left">
                    <div className="meta">
                      <span className="t-h5">{projectName(r, lang)}</span>
                      <span className="sub">{on ? pick(r.short, lang) : g.soon}</span>
                    </div>
                  </div>
                  <div className="right t-p1">{yearRange(r)}</div>
                </Row>
              );
            })}
          </div>
        </Section>
      )}

      <div className="clear" />
      <Footer lang={lang} t={t.footer} nav={t.nav} compact />
    </div>
  );
}
