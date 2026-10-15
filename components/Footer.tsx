import Link from "next/link";
import type { Dict, Lang } from "@/lib/i18n";
import HalftoneWordmark from "./HalftoneWordmark";

const LINKEDIN = "https://www.linkedin.com/in/yamilarroyo";
const ADPLIST = "https://adplist.org/mentors/yamil-arroyo";

function Item({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const inner = (
    <>
      <span className="t-p1">{children}</span>
      <img className="icon20" src="/icons/arrow-outward-link.svg" alt="" />
    </>
  );
  return external ? (
    <a className="footer-link" href={href} target="_blank" rel="noreferrer">{inner}</a>
  ) : (
    <Link className="footer-link" href={href}>{inner}</Link>
  );
}

export default function Footer({
  lang, t, nav, compact,
}: { lang: Lang; t: Dict["footer"]; nav: Dict["nav"]; compact?: boolean }) {
  const content = (
    <>
      <div className="footer-ping">
        <p className="t-h3-serif">{t.ping}</p>
        <a className="t-h1" href="mailto:iarroyozuniga@gmail.com">iarroyozuniga@gmail.com</a>
      </div>
      <div className="footer-cols">
        <div className="footer-based">
          <span className="logo logo-40"><img src="/icons/logo-40.svg" alt="" /></span>
          <p className="t-p1">{t.based[0]}<br />{t.based[1]}</p>
        </div>
        <div className="footer-col">
          <p className="t-h6">{t.site}</p>
          <Item href={`/${lang}`}>{nav.home}</Item>
          <Item href={`/${lang}/work`}>{nav.work}</Item>
          <Item href={`/${lang}/about`}>{nav.about}</Item>
        </div>
        <div className="footer-col">
          <p className="t-h6">{t.social}</p>
          <Item href={LINKEDIN} external>LinkedIn</Item>
        </div>
        <div className="footer-col">
          <p className="t-h6">{t.mentoring}</p>
          <Item href={ADPLIST} external>ADP List</Item>
        </div>
      </div>
      <div className="footer-legal">
        <span>{t.designedBy}</span>
        <span>{t.copyright}</span>
      </div>
    </>
  );
  // Compacto (detalle de proyecto): footer corto de siempre. Resto de páginas: footer que se descubre por detrás + wordmark de puntos.
  if (compact) {
    return <footer className="page footer" data-compact>{content}</footer>;
  }
  return (
    <footer className="fr">
      <div className="fr-fixed">
        <div className="page footer">{content}</div>
        <HalftoneWordmark word="Yamil" />
      </div>
    </footer>
  );
}
