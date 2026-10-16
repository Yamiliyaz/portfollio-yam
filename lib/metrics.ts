import type { Lang } from "@/lib/i18n";
import { isTarget, pick, splitFacts, type Project } from "@/lib/notion";

/** Una cifra lista para el bento: valor grande, etiqueta corta y detalle opcional. */
export type Stat = { value: string; label: string; detail: string; trend?: [number, number] };

// Valor = número con unidad opcional ("%", "★", "K", "min", "años"…), con o sin flecha ("3.8★ → 4.7★", "3.3★ → 3.7–3.9★").
const NUM = String.raw`[~≈≥≤<>+−–-]?\s?\d[\d.,]*`;
const UNIT = String.raw`(?:\s?(?:%|★|[kKmM]\b|pp\b|x\b)|\s(?:años|years?|días|days?|min|hrs?|h|meses|months?|semanas|weeks?)\b)?`;
const VALUE_RE = new RegExp(`^\\s*(${NUM}${UNIT}(?:\\s*(?:→|->)\\s*${NUM}(?:\\s?[–-]\\s?\\d[\\d.,]*)?${UNIT})?)\\s*(.*)$`, "u");

const num = (s: string) => parseFloat(s.replace(/,/g, ""));

/** "VALOR etiqueta (detalle)" → Stat. Devuelve null si el texto no empieza con una cifra. */
export function parseStat(raw: string): Stat | null {
  const m = VALUE_RE.exec(raw);
  if (!m) return null;
  const value = m[1].trim();
  const rest = m[2].trim();
  const d = /^(.*?)\s*\((.*)\)\s*$/.exec(rest);
  let label = (d ? d[1] : rest).replace(/^(de|of)\s+/i, "").trim();
  let detail = d ? d[2].trim() : "";
  if (!label && detail) [label, detail] = [detail, ""];
  const t = /(\d[\d.,]*)\s*(?:→|->)\s*(\d[\d.,]*)/.exec(detail);
  const trend: [number, number] | undefined = t && num(t[1]) > 0 && num(t[2]) > 0 && num(t[1]) !== num(t[2]) ? [num(t[1]), num(t[2])] : undefined;
  return { value, label, detail, trend };
}

/**
 * Cifras de "Métricas clave" para la vista bento: hasta 4 observadas (no metas) en el orden de Notion;
 * la primera es la protagonista. Con menos de 3 cifras no hay bento y se queda la lista de siempre.
 * `rest` conserva lo que no cabe o no se pudo leer como cifra.
 */
export function bentoStats(p: Project, lang: Lang): { stats: Stat[]; rest: string[] } | null {
  const items = splitFacts(pick(p.metrics, lang)).filter((x) => !isTarget(x));
  const parsed = items.map((raw) => ({ raw, stat: parseStat(raw) }));
  const ok = parsed.filter((x) => x.stat);
  if (ok.length < 3) return null;
  const used = new Set(ok.slice(0, 4).map((x) => x.raw));
  return { stats: ok.slice(0, 4).map((x) => x.stat as Stat), rest: items.filter((x) => !used.has(x)) };
}
