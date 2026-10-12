"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type GalleryItem = {
  id: string;
  href: string;
  title: string;
  company: string;
  level: string;
  status: string;
  role: string;
  period: string;
  short: string;
  impact: string;
  tools: string[];
  cover: string | null;
  pinned: "featured" | "recent" | null;
};

export type GalleryLabels = {
  all: string; level: string; company: string; status: string;
  featured: string; recent: string; more: string; impact: string;
  empty: string; clear: string; count: string; readMore: string;
  levels: Record<string, string>;
  statuses: Record<string, string>;
};

type Group = "level" | "company" | "status";
const MAX_TOOLS = 4;

/** Paleta por empresa: acento + degradado suave de la tarjeta (sin depender de portadas). */
const PALETTE: [RegExp, { accent: string; from: string; to: string }][] = [
  [/aviva/i, { accent: "#5B4FE8", from: "#efedff", to: "#dcd8fb" }],
  [/konf[ií]o/i, { accent: "#E8561F", from: "#fff0e8", to: "#ffd9c7" }],
  [/citibanamex|banamex|bancanet/i, { accent: "#003DA5", from: "#e8f0ff", to: "#cfdffb" }],
];
const FALLBACK = { accent: "#475467", from: "#f2f4f7", to: "#e4e7ec" };
const palette = (company: string) => PALETTE.find(([re]) => re.test(company))?.[1] ?? FALLBACK;

const ICONS: Record<string, string[]> = {
  // Layers / Flag / Sparkles (trazos estilo Lucide, 24x24)
  Proyecto: ["M12 3 3 8l9 5 9-5-9-5Z", "m3 13 9 5 9-5", "m3 17.5 9 5 9-5"],
  Iniciativa: ["M5 21V4", "M5 4h12l-2 4 2 4H5"],
  Feature: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "M19 16v4", "M17 18h4"],
};
function LevelIcon({ level }: { level: string }) {
  return (
    <svg className="wg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(ICONS[level] ?? ICONS.Proyecto).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

export default function WorkGallery({ items, t }: { items: GalleryItem[]; t: GalleryLabels }) {
  const [sel, setSel] = useState<Record<Group, string[]>>({ level: [], company: [], status: [] });

  const options = useMemo(() => {
    const uniq = (f: (i: GalleryItem) => string) => [...new Set(items.map(f).filter(Boolean))];
    return {
      level: ["Proyecto", "Iniciativa", "Feature"].filter((l) => items.some((i) => i.level === l)),
      company: uniq((i) => i.company),
      status: ["Completado", "En progreso"].filter((s) => items.some((i) => i.status === s)),
    };
  }, [items]);

  const toggle = (g: Group, v: string) =>
    setSel((s) => ({ ...s, [g]: s[g].includes(v) ? s[g].filter((x) => x !== v) : [...s[g], v] }));
  const anyActive = sel.level.length + sel.company.length + sel.status.length > 0;
  const clear = () => setSel({ level: [], company: [], status: [] });

  // Dentro de un grupo: OR. Entre grupos: AND.
  const shown = items.filter(
    (i) =>
      (!sel.level.length || sel.level.includes(i.level)) &&
      (!sel.company.length || sel.company.includes(i.company)) &&
      (!sel.status.length || sel.status.includes(i.status)),
  );

  const label = (g: Group, v: string) => (g === "level" ? t.levels[v] : g === "status" ? t.statuses[v] : v) ?? v;

  return (
    <>
      <div className="wg-bar" role="group" aria-label="Filters">
        <button type="button" className="wg-chip" aria-pressed={!anyActive} onClick={clear}>{t.all}</button>
        {(["level", "company", "status"] as Group[]).map((g) => (
          <div className="wg-group" key={g} role="group" aria-label={t[g]}>
            <span className="wg-group-label">{t[g]}</span>
            {options[g].map((v) => (
              <button
                type="button"
                key={v}
                className="wg-chip"
                aria-pressed={sel[g].includes(v)}
                onClick={() => toggle(g, v)}
              >
                {label(g, v)}
              </button>
            ))}
          </div>
        ))}
        <span className="wg-count" aria-live="polite">{shown.length} {t.count}</span>
      </div>

      {shown.length === 0 ? (
        <div className="wg-empty">
          <p className="t-h6">{t.empty}</p>
          <button type="button" className="btn btn-outline" onClick={clear}>{t.clear}</button>
        </div>
      ) : (
        <div className="wg-grid">
          {shown.map((p, idx) => {
            const c = palette(p.company);
            return (
              <Link
                key={p.id}
                href={p.href}
                className="wg-card"
                style={{ ["--accent" as string]: c.accent, ["--from" as string]: c.from, ["--to" as string]: c.to, ["--i" as string]: idx % 9 }}
              >
                <div className="wg-top">
                  <span className="wg-num">( {String(idx + 1).padStart(3, "0")} )</span>
                  {p.pinned && <span className="wg-badge">{p.pinned === "featured" ? t.featured : t.recent}</span>}
                </div>
                <LevelIcon level={p.level} />
                <div className="wg-body">
                  <span className="wg-company">{p.company}</span>
                  <h2 className="wg-title">{p.title}</h2>
                  <p className="wg-meta">{[p.role, p.period].filter(Boolean).join(" · ")}</p>
                  <p className="wg-short">{p.short}</p>
                  {p.impact && <p className="wg-impact"><b>{t.impact}</b> {p.impact}</p>}
                  <div className="wg-foot">
                    <span className="wg-tag">{label("level", p.level)}</span>
                    <span className="wg-status">
                      <i className={`wg-dot ${p.status === "En progreso" ? "live" : "done"}`} />
                      {label("status", p.status)}
                    </span>
                  </div>
                  {p.tools.length > 0 && (
                    <div className="wg-tools">
                      {p.tools.slice(0, MAX_TOOLS).map((x) => <span key={x} className="wg-tool">{x}</span>)}
                      {p.tools.length > MAX_TOOLS && <span className="wg-tool">+{p.tools.length - MAX_TOOLS} {t.more}</span>}
                    </div>
                  )}
                </div>
                <div className="wg-overlay" />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
