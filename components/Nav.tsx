"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dict, Lang } from "@/lib/i18n";
import ThemeToggle from "./ThemeToggle";

export const RESUME_URL =
  "https://drive.google.com/file/d/1mM8qlWMb0JJ_8SNZcykObdMzCpc4waKC/view?usp=drive_link";

export default function Nav({ lang, t }: { lang: Lang; t: Dict["nav"] }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.replace(/^\/(en|es)/, "") || "";
  const section = rest.split("/")[1] || "";
  const items = [
    { key: "", label: t.home, href: `/${lang}` },
    { key: "work", label: t.work, href: `/${lang}/work` },
    { key: "about", label: t.about, href: `/${lang}/about` },
  ];
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Link href={`/${lang}`} className="logo logo-64" aria-label="Yamil Arroyo">
            <img src="/icons/logo-64.svg" alt="" />
          </Link>
          <nav className="menu" aria-label="Main">
            {items.map((i) => (
              <Link key={i.key} href={i.href} aria-current={section === i.key ? "page" : undefined}>
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="nav-right">
          <div className="lang" aria-label="Language">
            {(["en", "es"] as const).map((l) => (
              <Link key={l} href={`/${l}${rest}`} aria-current={l === lang ? "true" : undefined}>
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
          <ThemeToggle labels={t.theme} />
          <a className="btn btn-outline" href={RESUME_URL} target="_blank" rel="noreferrer">
            {t.resume}
            <img className="icon20" src="/icons/arrow-outward-dark.svg" alt="" />
          </a>
        </div>
      </div>
    </header>
  );
}
