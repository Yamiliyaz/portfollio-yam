import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Stepper from "@/components/Stepper";
import { pageMetadata } from "@/lib/seo";
import { dict, isLang, LANGS } from "@/lib/i18n";
import { formatPeriod, getVisible, getProject, pick, projectName, yearRange } from "@/lib/notion";

export const revalidate = 1800;

export async function generateStaticParams() {
  const all = await getVisible();
  return LANGS.flatMap((lang) =>
    all.map((p) => ({ lang, slug: p.slug })),
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
    image: project.cover ?? undefined,
  });
}

const paragraphs = (s: string) => s.split(/\n+/).map((x) => x.trim()).filter(Boolean);

/** "960K visits | 576K daily users" → [{value:"960K", label:"visits"}, …] */
function parseStats(s: string) {
  return s
    .split("|")
    .map((x) => x.trim())
    .map((x) => x.match(/^(\+?\s?[\d.,]+\s?[KkMm]?\+?)\s+(.+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ value: m[1].replace(/\s+/g, ""), label: m[2] }))
    .slice(0, 3);
}

const ROT = [5, -20, 16, -17, 15, -10, -8, 16, -30, -8];

function Prose({ text }: { text: string }) {
  return <div className="prose t-p1">{paragraphs(text).map((p, i) => <p key={i}>{p}</p>)}</div>;
}

function TextSection({ id, title, text }: { id: string; title: string; text: string }) {
  return (
    <Reveal as="section" className="proj-section" id={id} rise={40}>
      <div className="cols">
        <div className="col-a"><h2>{title}</h2></div>
        <div className="col-b"><Prose text={text} /></div>
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

  const short = pick(p.short, lang);
  const impact = pick(p.impact, lang);
  const stats = parseStats(impact);
  const problem = pick(p.problem, lang);
  const research = pick(p.research, lang);
  const solution = pick(p.solution, lang);
  const release = pick(p.postRelease, lang);

  const steps = [
    { id: "introduction", label: s.introduction, show: true },
    { id: "highlights", label: s.highlights, show: !!impact },
    { id: "problem", label: s.problem, show: !!problem },
    { id: "research", label: s.research, show: !!research },
    { id: "solution", label: s.solution, show: !!solution },
    { id: "release", label: s.release, show: !!release },
    { id: "related", label: s.related, show: related.length > 0 },
  ].filter((x) => x.show);

  return (
    <div className="page proj-layout">
      <Stepper steps={steps} backHref={`/${lang}/work`} backLabel={t.project.back} contentLabel={t.project.content} />

      <section className="proj-hero">
        <div className="bento-hero">
          <div className="tile intro">
            <div className="wg-foot" style={{ justifyContent: "flex-start", gap: 12 }}>
              <span className="wg-tag">{t.work.gallery.levels[p.level as keyof typeof t.work.gallery.levels] ?? p.level}</span>
              {p.status && (
                <span className="wg-status">
                  <i className={`wg-dot ${p.status === "En progreso" ? "live" : "done"}`} />
                  {t.work.gallery.statuses[p.status as keyof typeof t.work.gallery.statuses] ?? p.status}
                </span>
              )}
            </div>
            <h1 className="t-h5">{projectName(p, lang)}</h1>
            <p className="t-p2" style={{ color: "var(--gray-700)", maxWidth: 380 }}>{short}</p>
            <div style={{ marginTop: "auto" }}>
              <a className="btn btn-dark" href="#introduction">
                {t.project.start}
                <img className="icon20" src="/icons/arrow-down.svg" alt="" style={{ filter: "invert(1)" }} />
              </a>
            </div>
          </div>
          <div className="tile cover">{p.cover && <img src={p.cover} alt="" />}</div>
          <div className="tile stats">
            {stats.length > 0 ? (
              <>
                <p className="t-p1">{short.split(/(?<=\.)\s/)[0]}</p>
                <div className="stat-row">
                  {stats.map((x) => (
                    <div className="stat" key={x.label}>
                      <b>{x.value}</b>
                      <span className="t-p2">{x.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="t-h6">{p.company}</p>
                <p className="t-p2" style={{ color: "var(--gray-500)" }}>{p.role}</p>
              </>
            )}
          </div>
          <div className="tile period">
            <span className="date" />
            <p className="t-h6">{t.project.execution}</p>
            <p className="t-p2" style={{ color: "var(--gray-500)" }}>{formatPeriod(p, lang, t.project.present)}</p>
          </div>
          <div className="tile tools">
            {p.tools.map((tool, i) => (
              <span key={tool} className="chip" style={{ ["--r" as string]: `${ROT[i % ROT.length]}deg` }}>{tool}</span>
            ))}
          </div>
        </div>
      </section>

      <Reveal as="section" className="proj-section" id="introduction">
        <div className="cols">
          <div className="col-a">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <h2>{t.project.role}</h2>
              <p className="t-p1"><b>{p.role}</b>{p.company ? ` – ${p.company}` : ""}</p>
            </div>
            {p.team && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h2>{t.project.team}</h2>
                <ul className="small">
                  {p.team.split(/\s\|\s|\n|,\s(?=[A-ZÁÉÍÓÚ][^,]*\()/).map((m) => <li key={m}>{m.trim()}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="col-b">
            <h2>{t.project.intro}</h2>
            <Prose text={short} />
          </div>
        </div>
      </Reveal>

      {impact && <TextSection id="highlights" title={s.highlights} text={impact.replace(/\s\|\s/g, "\n")} />}
      {problem && <TextSection id="problem" title={s.problem} text={problem} />}
      {research && <TextSection id="research" title={s.research} text={research} />}
      {solution && <TextSection id="solution" title={s.solution} text={solution} />}
      {release && <TextSection id="release" title={s.release} text={release} />}

      {related.length > 0 && (
        <Reveal as="section" className="proj-section" id="related">
          <div className="cols">
            <div className="col-a"><h2>{s.related}</h2></div>
            <div className="col-b">
              <div className="related">
                {related.map((r) => (
                  <Link href={`/${lang}/work/${r.slug}`} className="proj-row" key={r.id} style={{ height: "auto", padding: "24px 16px" }}>
                    <div className="left">
                      <div className="meta">
                        <span className="t-h5">{projectName(r, lang)}</span>
                        <span className="sub">{pick(r.short, lang)}</span>
                      </div>
                    </div>
                    <div className="right t-p1">{yearRange(r)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      <div className="clear" />
      <Footer lang={lang} t={t.footer} nav={t.nav} compact />
    </div>
  );
}
