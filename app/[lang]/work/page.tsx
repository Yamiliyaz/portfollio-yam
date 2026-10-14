import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { dict, isLang } from "@/lib/i18n";
import WorkGallery, { type GalleryItem } from "@/components/WorkGallery";
import { formatPeriod, getGallery, hasDetail, impactIsTarget, keyFacts, pick, projectName } from "@/lib/notion";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 1800;
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return pageMetadata({ lang, path: "/work", ...dict[lang].seo.work });
}

const firstLine = (s: string) => s.split(/\s\|\s|\n/)[0]?.trim() ?? "";

export default async function Work({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict[lang];
  const projects = await getGallery();
  const items: GalleryItem[] = projects.map((p) => ({
    id: p.id,
    href: `/${lang}/work/${p.slug}`,
    title: projectName(p, lang),
    company: p.company,
    level: p.level,
    status: p.status,
    role: p.role,
    period: formatPeriod(p, lang, t.project.present),
    short: pick(p.short, lang),
    impact: keyFacts(p, lang, 1)?.items[0] ?? (impactIsTarget(pick(p.impact, lang)) ? "" : firstLine(pick(p.impact, lang))),
    tools: p.tools,
    cover: p.cover,
    pinned: p.pinned,
    enabled: hasDetail(p),
  }));

  return (
    <div className="page">
      <section className="section wg-section">
        <div className="section-inner">
          <div className="work-head">
            <h1 className="t-h2-serif" style={{ color: "var(--gray-900)" }}>{t.work.title}</h1>
            <p className="t-p1">{t.work.lead}</p>
          </div>
          <WorkGallery items={items} t={{ ...t.work.gallery, readMore: t.work.readMore }} />
        </div>
      </section>
      <Footer lang={lang} t={t.footer} nav={t.nav} />
    </div>
  );
}
