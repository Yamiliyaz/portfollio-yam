import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SmoothLink from "@/components/SmoothLink";
import { dict, isLang } from "@/lib/i18n";
import { getFeatured, hasDetail, projectName, yearRange } from "@/lib/notion";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return pageMetadata({ lang, path: "", absolute: true, ...dict[lang].seo.home });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict[lang];
  const featured = await getFeatured();

  // Datos estructurados (schema.org) para que buscadores entiendan quién es la persona detrás del sitio.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yamil Arroyo",
    jobTitle: "Product Designer",
    url: `${SITE_URL}/${lang}`,
    image: `${SITE_URL}/images/profile.jpg`,
    description: t.seo.home.description,
    sameAs: ["https://www.linkedin.com/in/yamilarroyo", "https://adplist.org/mentors/yamil-arroyo"],
  };

  return (
    <div className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="hero section" id="hero">
        <div className="hero-inner">
          <div className="hero-hello">
            <div>
              <p className="t-h2-serif name">{t.hero.hello}</p>
              <p className="t-p1 muted">{t.hero.nickname}</p>
            </div>
            <div className="photo">
              <img src="/images/profile.jpg" alt="Yamil Arroyo" width={352} height={352} />
            </div>
            <div className="right">
              <p className="t-h2-serif name">{t.hero.role}</p>
              <p className="t-p1 muted">{t.hero.roleSub}</p>
            </div>
          </div>
          <div className="hero-intro">
            <div className="a"><p className="t-p1">{t.hero.intro1}</p></div>
            <div className="b"><p className="t-p1">{t.hero.intro2}</p></div>
          </div>
          <SmoothLink className="scroll" href="#principles" aria-label="Scroll">
            <img src="/icons/arrow-down.svg" alt="" />
          </SmoothLink>
        </div>
      </section>

      <Reveal as="section" className="section principles" id="principles">
        <div className="section-inner" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="heading-block">
            <h2 className="t-h3-serif">{t.principles.title}</h2>
            <p className="t-h6">{t.principles.lead}</p>
          </div>
          <div className="principles-grid">
            {t.principles.items.map((it, i) => (
              <div className="principle" key={it.title}>
                <p className="num t-h3">{String(i + 1).padStart(2, "0")}</p>
                <div className="body">
                  <h3 className="t-h5">{it.title}</h3>
                  <p className="t-p1">{it.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section projects">
        <div className="section-inner">
          <div className="heading-block">
            <h2 className="t-h3-serif">{t.projects.title}</h2>
          </div>
          <div className="proj-list">
            {featured.map((p, i) => (
              <Link className="proj-row" key={p.id} href={hasDetail(p) ? `/${lang}/work/${p.slug}` : "#"} aria-disabled={!hasDetail(p) || undefined} style={hasDetail(p) ? undefined : { opacity: 0.5, pointerEvents: "none" }}>
                <div className="left">
                  <span className="t-h6">{String(i + 1).padStart(2, "0")}</span>
                  <div className="meta">
                    <span className="t-h5">{projectName(p, lang)}</span>
                    <span className="sub">{p.company}</span>
                  </div>
                </div>
                <div className="right t-p1">{yearRange(p)}</div>
                <img className="row-arrow icon20" src="/icons/arrow-outward-light.svg" alt="" />
                {p.cover && <img className="row-preview" src={p.cover} alt="" aria-hidden="true" />}
              </Link>
            ))}
            <Link className="proj-row more" href={`/${lang}/work`}>
              <span className="t-h5">{t.projects.more}</span>
              <img className="row-arrow icon20" src="/icons/arrow-outward-light.svg" alt="" />
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section about-home">
        <div className="section-inner" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="heading-block">
            <h2 className="t-h3-serif">{t.about.title}</h2>
            <p className="t-h6" style={{ color: "var(--gray-700)", maxWidth: 360 }}>{t.about.lead}</p>
          </div>
          <div className="about-grid">
            <div className="portrait">
              <img src="/images/about-home.jpg" alt="Yamil Arroyo" width={352} height={440} />
            </div>
            <div className="about-copy">
              <div className="t-p1">
                {t.about.body.map((para) => <p key={para}>{para}</p>)}
              </div>
              <div>
                <Link className="btn btn-dark" href={`/${lang}/about`}>
                  {t.about.cta}
                  <img className="icon20" src="/icons/arrow-outward-light.svg" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal><Footer lang={lang} t={t.footer} nav={t.nav} /></Reveal>
    </div>
  );
}
