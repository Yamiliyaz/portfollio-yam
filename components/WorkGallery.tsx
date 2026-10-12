"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LevelIcon, palette } from "./ProjectVisual";

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
  /** false = proyecto en progreso: tarjeta deshabilitada, sin detalle. */
  enabled: boolean;
};

export type GalleryLabels = {
  all: string; level: string; company: string; status: string;
  featured: string; recent: string; soon: string; more: string; impact: string;
  empty: string; clear: string; count: string; readMore: string;
  levels: Record<string, string>;
  statuses: Record<string, string>;
};

type Group = "level" | "company" | "status";
const MAX_TOOLS = 4;

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
            const Card: React.ElementType = p.enabled ? Link : "div";
            return (
              <Card
                key={p.id}
                {...(p.enabled ? { href: p.href } : { "aria-disabled": true })}
                className={`wg-card${p.enabled ? "" : " is-disabled"}`}
                style={{ ["--accent" as string]: c.accent, ["--from" as string]: c.from, ["--to" as string]: c.to, ["--i" as string]: idx % 9 }}
              >
                <div className="wg-top">
                  <span className="wg-num">( {String(idx + 1).padStart(3, "0")} )</span>
                  {!p.enabled ? <span className="wg-badge soon">{t.soon}</span> : p.pinned && <span className="wg-badge">{p.pinned === "featured" ? t.featured : t.recent}</span>}
                </div>
                <LevelIcon level={p.level} />
                <div className="wg-body">
                  <span className="wg-company">{p.company}</span>
                  <h2 className="wg-title">{p.title}</h2>
                  <p className="wg-meta">{[p.role, p.period].filter(Boolean).join(" · ")}</p>
                  <p className="wg-short">{p.short}</p>
                  {p.enabled && p.impact && <p className="wg-impact"><b>{t.impact}</b> {p.impact}</p>}
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
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
