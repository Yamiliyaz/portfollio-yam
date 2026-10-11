import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { about } from "@/lib/about";
import { dict, isLang } from "@/lib/i18n";

export const metadata = { title: "About" };

function Story({ title, paras }: { title: string; paras: string[] }) {
  return (
    <div className="story-text">
      <h3 className="t-h5">{title}</h3>
      <div className="t-p1">{paras.map((p) => <p key={p}>{p}</p>)}</div>
    </div>
  );
}

function Photo({ n, alt }: { n: number; alt: string }) {
  return (
    <div className="story-photo">
      <img src={`/images/about-${n}.jpg`} alt={alt} width={418} height={560} loading="lazy" />
    </div>
  );
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict[lang];
  const c = about[lang];
  const m = c.methodology;
  const alt = (n: number) => (lang === "es" ? `Foto del viaje a Costa Rica ${n}` : `Costa Rica trip snapshot ${n}`);

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="section-inner">
          <h1 className="t-h1-serif">{c.hero.heading}</h1>
          <p className="t-h6 about-sub">{c.hero.sub}</p>
          <div className="about-ctas">
            {c.hero.ctas.map((x) => (
              <a key={x.id} href={`#${x.id}`} className="about-cta t-h6">
                <img className="icon20" src={`/icons/${x.icon}.svg`} alt="" />
                {x.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section story" aria-labelledby="story-title">
        <div className="section-inner story-grid">
          <div className="story-col">
            <div className="story-intro">
              <h2 id="story-title" className="t-h2-serif">{c.story.title}</h2>
              <p className="t-p1" style={{ color: "var(--gray-500)" }}>{c.story.sub}</p>
            </div>
            <Photo n={1} alt={alt(1)} />
            <div className="story-block">
              <Story {...c.story.left[0]} />
              <Photo n={2} alt={alt(2)} />
            </div>
            <div className="story-block tight">
              <Story {...c.story.left[1]} />
            </div>
          </div>
          <div className="story-col">
            <div className="story-block">
              <Story {...c.story.right[0]} />
              <Photo n={3} alt={alt(3)} />
            </div>
            <div className="story-block">
              <Story {...c.story.right[1]} />
              <Photo n={4} alt={alt(4)} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-inner" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <h2 className="t-h2-serif">{c.experienceTitle}</h2>
          <div className="exp-list">
            {c.experience.map((e) => (
              <div className="exp-row" key={e.role + e.company}>
                <div className="exp-role">
                  <p className="t-h6" style={{ color: "var(--gray-800)" }}>{e.role}</p>
                  <p className="t-p1" style={{ color: "var(--gray-500)" }}>{e.company}</p>
                </div>
                <p className="t-p3 exp-period">{e.period}</p>
                <img className="icon20" src="/icons/expand.svg" alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section method" id="methodology">
        <div className="section-inner">
          <div className="heading-block" style={{ paddingTop: 0 }}>
            <h2 className="t-h3-serif">{m.title}</h2>
            <p className="t-h6" style={{ color: "var(--gray-700)", maxWidth: 360 }}>{m.sub}</p>
          </div>
          <div className="method-content">
            <div className="method-center">{m.center}</div>
            <div className="method-frame" role="img" aria-label={m.title}>
              <div className="method-lines">
                <img src="/images/methodology-ring-left.png" alt="" width={383} height={351} />
                <img src="/images/methodology-ring-right.png" alt="" width={383} height={351} style={{ transform: "rotate(180deg)" }} />
              </div>
              <div className="method-row" style={{ top: 68 }}>
                <span className="method-pill">{m.top[0]}</span>
                <img className="method-chev" src="/icons/chevron-link.svg" alt="" />
                <span className="method-pill">{m.top[1]}</span>
              </div>
              <img className="method-arrow" style={{ top: 160 }} src="/icons/arrow-down.svg" alt="" />
              <div className="method-steps">
                {m.steps.map((s) => <span key={s} className="method-note">{s}</span>)}
              </div>
              <img className="method-arrow" style={{ top: 316 }} src="/icons/arrow-down.svg" alt="" />
              <div className="method-row" style={{ top: 376 }}>
                <span className="method-pill">{m.bottom[0]}</span>
                <img className="method-chev" src="/icons/chevron-link.svg" alt="" />
                <span className="method-pill">{m.bottom[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="section-inner" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div className="heading-block" style={{ paddingTop: 0 }}>
            <h2 className="t-h3-serif">{c.skillsTitle}</h2>
            <p className="t-h6" style={{ color: "var(--gray-700)", maxWidth: "none" }}>{c.skillsSub}</p>
          </div>
          <div className="skills-grid">
            {c.skills.map((s) => (
              <div className="skill" key={s.title}>
                <div className="skill-head">
                  <img className="icon20" src={`/icons/skills/${s.icon}.svg`} alt="" />
                  <h3 className="t-h6">{s.title}</h3>
                </div>
                <p className="t-p2">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer lang={lang} t={t.footer} nav={t.nav} />
    </div>
  );
}
