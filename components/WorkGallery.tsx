"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  platforms: string[];
  cover: string | null;
  pinned: "featured" | "recent" | null;
  /** false = proyecto en progreso: tarjeta deshabilitada, sin detalle. */
  enabled: boolean;
};

export type GalleryLabels = {
  all: string; platform: string; level: string; company: string; status: string;
  featured: string; recent: string; soon: string; inProgress: string; done: string; more: string; impact: string;
  empty: string; clear: string; count: string; readMore: string;
  filters: string; showN: string; close: string; remove: string;
  levels: Record<string, string>;
  statuses: Record<string, string>;
  platforms: Record<string, string>;
};

type Group = "platform" | "level" | "company" | "status";
const GROUPS: Group[] = ["platform", "level", "company", "status"];
const EMPTY: Record<Group, string[]> = { platform: [], level: [], company: [], status: [] };
const MAX_TOOLS = 4;

export default function WorkGallery({ items, t }: { items: GalleryItem[]; t: GalleryLabels }) {
  const [sel, setSel] = useState<Record<Group, string[]>>(EMPTY);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<Group | null>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // Menús de escritorio: se cierran con Esc (devuelve el foco al botón) o al hacer click fuera.
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => { if (!bar.current?.contains(e.target as Node)) setMenu(null); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(null);
      bar.current?.querySelector<HTMLElement>(`[data-dd="${menu}"] .wg-dd-btn`)?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menu]);

  // Hoja de filtros (móvil): <dialog> modal; bloquea el scroll de la página mientras está abierta.
  useEffect(() => {
    const d = sheet.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 801px)");
    const onChange = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Recuerda los filtros al abrir un proyecto y volver (sessionStorage; se lee tras montar para no romper la hidratación).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("wg-filters");
      if (raw) setSel({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem("wg-filters", JSON.stringify(sel)); } catch {}
  }, [sel]);

  const options = useMemo(() => {
    const uniq = (f: (i: GalleryItem) => string) => [...new Set(items.map(f).filter(Boolean))];
    return {
      platform: ["Web", "App", "Web App", "TPV"].filter((v) => items.some((i) => i.platforms.includes(v))),
      level: ["Proyecto", "Iniciativa", "Feature"].filter((l) => items.some((i) => i.level === l)),
      company: uniq((i) => i.company),
      status: ["Completado", "En progreso"].filter((s) => items.some((i) => i.status === s)),
    };
  }, [items]);

  const toggle = (g: Group, v: string) =>
    setSel((s) => ({ ...s, [g]: s[g].includes(v) ? s[g].filter((x) => x !== v) : [...s[g], v] }));
  const activeCount = GROUPS.reduce((n, g) => n + sel[g].length, 0);
  const anyActive = activeCount > 0;
  const clear = () => setSel(EMPTY);

  // Dentro de un grupo: OR. Entre grupos: AND.
  const shown = items.filter(
    (i) =>
      (!sel.platform.length || i.platforms.some((v) => sel.platform.includes(v))) &&
      (!sel.level.length || sel.level.includes(i.level)) &&
      (!sel.company.length || sel.company.includes(i.company)) &&
      (!sel.status.length || sel.status.includes(i.status)),
  );

  const activeChips = GROUPS.flatMap((g) => sel[g].map((v) => ({ g, v })));

  const label = (g: Group, v: string) => (g === "level" ? t.levels[v] : g === "status" ? t.statuses[v] : g === "platform" ? t.platforms[v] : v) ?? v;

  const groups = GROUPS.filter((g) => options[g].length).map((g) => (
    <div className="wg-group" key={g} role="group" aria-label={t[g]}>
      <span className="wg-group-label">{t[g]}</span>
      <div className="wg-group-chips">
        {options[g].map((v) => (
          <button type="button" key={v} className="wg-chip" aria-pressed={sel[g].includes(v)} onClick={() => toggle(g, v)}>
            {label(g, v)}
          </button>
        ))}
      </div>
    </div>
  ));

  const onMenuKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')];
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
  };

  const dropdowns = GROUPS.filter((g) => options[g].length).map((g) => (
    <div className="wg-dd" data-dd={g} key={g}>
      <button
        type="button"
        className="wg-dd-btn"
        aria-haspopup="menu"
        aria-expanded={menu === g}
        data-active={sel[g].length > 0 || undefined}
        onClick={() => setMenu(menu === g ? null : g)}
        onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setMenu(g); requestAnimationFrame(() => bar.current?.querySelector<HTMLElement>(`[data-dd="${g}"] [role="menuitemcheckbox"]`)?.focus()); } }}
      >
        {t[g]}
        {sel[g].length > 0 && <span className="wg-filter-n">{sel[g].length}</span>}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {menu === g && (
        <div className="wg-dd-menu" role="menu" aria-label={t[g]} onKeyDown={onMenuKey}>
          {options[g].map((v) => (
            <button type="button" key={v} role="menuitemcheckbox" aria-checked={sel[g].includes(v)} className="wg-dd-opt" onClick={() => toggle(g, v)}>
              <span className="wg-dd-box" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {label(g, v)}
            </button>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <>
      <div className="wg-bar" role="group" aria-label="Filters" ref={bar}>
        <div className="wg-full">
          <button type="button" className="wg-chip" aria-pressed={!anyActive} onClick={clear}>{t.all}</button>
          {dropdowns}
          <span className="wg-full-meta">
            {anyActive && <button type="button" className="wg-link" onClick={clear}>{t.clear}</button>}
            <span className="wg-count" aria-live="polite">{shown.length} {t.count}</span>
          </span>
        </div>

        <div className="wg-compact">
          <div className="wg-compact-row">
            <button type="button" className="wg-filter-btn" aria-haspopup="dialog" onClick={() => setOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h8M15 6h2M3 14h2M9 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="13" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" /><circle cx="7" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>
              {t.filters}
              {activeCount > 0 && <span className="wg-filter-n">{activeCount}</span>}
            </button>
            <span className="wg-compact-meta">
              <span className="wg-count" aria-live="polite">{shown.length} {t.count}</span>
              {anyActive && <button type="button" className="wg-link" onClick={clear}>{t.clear}</button>}
            </span>
          </div>
          {anyActive && (
            <ul className="wg-active" aria-label={t.filters}>
              {activeChips.map(({ g, v }) => (
                <li key={g + v}>
                  <button type="button" className="wg-chip" aria-pressed="true" aria-label={`${t.remove}: ${label(g, v)}`} onClick={() => toggle(g, v)}>
                    {label(g, v)}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <dialog
        ref={sheet}
        className="wg-sheet"
        aria-label={t.filters}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div className="wg-sheet-in">
          <span className="wg-handle" aria-hidden="true" />
          <div className="wg-sheet-head">
            <h2 className="t-h6">{t.filters}</h2>
            <button type="button" className="wg-x" aria-label={t.close} onClick={() => setOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="wg-sheet-groups">{groups}</div>
          <div className="wg-sheet-foot">
            <button type="button" className="btn btn-dark" onClick={() => setOpen(false)}>{t.showN.replace("{n}", String(shown.length))}</button>
            {anyActive && <button type="button" className="wg-link" onClick={clear}>{t.clear}</button>}
          </div>
        </div>
      </dialog>

      {shown.length === 0 ? (
        <div className="wg-empty">
          <p className="t-h6">{t.empty}</p>
          <button type="button" className="btn btn-outline" onClick={clear}>{t.clear}</button>
        </div>
      ) : (
        <>
          {(() => {
            const card = (p: GalleryItem, idx: number) => {
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
          };
            const done = shown.filter((p) => p.enabled);
            const wip = shown.filter((p) => !p.enabled);
            return (
              <>
                {done.length > 0 && <div className="wg-grid">{done.map((p, i) => card(p, i))}</div>}
                {wip.length > 0 && (
                  <>
                    <div className="wg-divider" role="separator" aria-label={t.inProgress}>
                      <span>{t.inProgress}</span>
                    </div>
                    <div className="wg-grid">{wip.map((p, i) => card(p, done.length + i))}</div>
                  </>
                )}
              </>
            );
          })()}
        </>
      )}
    </>
  );
}
