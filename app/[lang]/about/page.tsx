import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { about } from "@/lib/about";
import { CONTACT_EMAIL } from "@/lib/contact";
import { dict, isLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const LINKEDIN = "https://www.linkedin.com/in/yamilarroyo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return pageMetadata({ lang, path: "/about", ...dict[lang].seo.about });
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict[lang];
  const c = about[lang];
  const [lead, ...rest] = c.hero.paragraphs;

  return (
    <div className="page">
      {/* A · Posicionamiento */}
      <section className="section ab-hero" aria-labelledby="ab-title">
        <div className="section-inner ab-hero-grid">
          <div className="ab-hero-copy">
            <h1 id="ab-title" className="t-h2-serif hero-in hero-in-heading">{c.hero.heading}</h1>
            <div className="hero-in hero-in-rise">
              <p className="t-h6 ab-lead">{lead}</p>
              {rest.map((p) => <p className="t-p1" key={p}>{p}</p>)}
            </div>
          </div>
          <div className="ab-photo">
            <img src="/images/about-hero.jpg" alt={c.hero.photoAlt} width={392} height={560} />
          </div>
        </div>
      </section>

      {/* B · Impacto */}
      <Reveal as="section" className="section" id="impact" aria-labelledby="ab-impact-title">
        <div className="section-inner">
          <h2 id="ab-impact-title" className="t-h3-serif ab-h2">{c.impact.title}</h2>
          <div className="ab-impact">
            {c.impact.items.map((m) => (
              <article className="ab-metric" key={m.label + m.context}>
                <p className="ab-metric-value">
                  <span className="ab-num" aria-label={m.valueSr}>{m.value}</span>
                  <span className="ab-chg">{m.change}</span>
                </p>
                <h3 className="t-h5">{m.label}</h3>
                <p className="t-p2 ab-context">{m.context}</p>
                {m.description && <p className="t-p1 ab-desc">{m.description}</p>}
                {m.extra && <p className="t-p1 ab-extra">{m.extra}</p>}
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* C · Enfoque */}
      <Reveal as="section" className="section" id="approach" aria-labelledby="ab-approach-title">
        <div className="section-inner">
          <h2 id="ab-approach-title" className="t-h3-serif ab-h2">{c.approach.title}</h2>
          <div className="ab-approach">
            {c.approach.items.map((it) => (
              <div key={it.title}>
                <h3 className="t-h5">{it.title}</h3>
                <p className="t-p1">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* C2 · Liderazgo */}
      <Reveal as="section" className="section" id="lead" aria-labelledby="ab-lead-title">
        <div className="section-inner">
          <h2 id="ab-lead-title" className="t-h3-serif ab-h2">{c.lead.title}</h2>
          <div className="ab-approach">
            {c.lead.items.map((it) => (
              <div key={it.title}>
                <h3 className="t-h5">{it.title}</h3>
                <p className="t-p1">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* D · Trayectoria */}
      <Reveal as="section" className="section" id="career" aria-labelledby="ab-career-title">
        <div className="section-inner">
          <h2 id="ab-career-title" className="t-h3-serif ab-h2">{c.career.title}</h2>
          <div className="ab-career">
            {c.career.items.map((r) => (
              <div className="ab-role" key={r.company + r.period}>
                <p className="t-p2 ab-period">{r.period}</p>
                <div className="ab-role-main">
                  <h3 className="t-h6 ab-role-title">{r.role}</h3>
                  <p className="t-p1 ab-company">{r.company}</p>
                  {r.progression && <p className="t-p2 ab-progress">{r.progression}</p>}
                </div>
                <p className="t-p1 ab-role-desc">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* E · Más allá del trabajo */}
      <Reveal as="section" className="section" id="beyond" aria-labelledby="ab-beyond-title">
        <div className="section-inner ab-beyond">
          <div className="ab-beyond-copy">
            <h2 id="ab-beyond-title" className="t-h3-serif ab-h2">{c.beyond.title}</h2>
            {c.beyond.paragraphs.map((p) => <p className="t-p1" key={p}>{p}</p>)}
          </div>
          <figure className="ab-gallery">
            <div className="ab-gallery-grid">
              {c.beyond.photos.map((p) => (
                <img key={p.n} src={`/images/about-${p.n}.jpg`} alt={p.alt} width={418} height={560} loading="lazy" />
              ))}
            </div>
            <figcaption className="t-p2">{c.beyond.caption}</figcaption>
          </figure>
        </div>
      </Reveal>

      {/* F · Contacto */}
      <Reveal as="section" className="section ab-closing" id="contact" aria-labelledby="ab-closing-title">
        <div className="section-inner">
          <h2 id="ab-closing-title" className="t-h3-serif">{c.closing.heading}</h2>
          <div className="ab-actions">
            <a className="btn btn-dark" href={`mailto:${CONTACT_EMAIL[lang]}`}>
              {c.closing.email}
              <img className="icon20" src="/icons/arrow-outward-light.svg" alt="" />
            </a>
            <a className="btn btn-outline" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              {c.closing.linkedin}
              <img className="icon20" src="/icons/arrow-outward-dark.svg" alt="" />
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
