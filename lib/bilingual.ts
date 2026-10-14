import type { Lang } from "./i18n";

/* Textos de Notion escritos "Español / English" en una misma línea: se muestra solo el idioma de la página. */

const ES = new Set("el la los las de del que y en un una con para por se al es su más como lo sin sobre fue muy entre también cómo qué cuando donde".split(" "));
const EN = new Set("the and of to in that with for is was an it on as at by from this are be not or but its their can how what when where".split(" "));

const words = (s: string) => s.toLowerCase().match(/[a-záéíóúñü]+/g) ?? [];
const score = (s: string, set: Set<string>) => words(s).filter((w) => set.has(w)).length;

/** a = español, b = inglés (convención de las páginas: primero ES, luego EN). */
function isPair(a: string, b: string, allBold: boolean, loose = false) {
  if (!a.trim() || !b.trim() || a.trim().toLowerCase() === b.trim().toLowerCase()) return false;
  const esA = score(a, ES), enA = score(a, EN), esB = score(b, ES), enB = score(b, EN);
  if (esA > enA && enB > esB) return true;
  // Textos cortos (encabezados, celdas de tabla, viñetas): sin palabras de apoyo basta la convención ES / EN.
  if (loose && words(a).length <= 12 && words(b).length <= 12 && esA >= enA && enB >= esB) return true;
  // Títulos cortos en negritas ("Resiliencia / Resilience"): sin palabras de apoyo, basta la convención.
  return allBold && words(a).length <= 8 && words(b).length <= 8 && esA >= enA && enB >= esB;
}

type Seg = { plain_text: string; annotations?: any; href?: string | null; [k: string]: any };

function slice(segs: Seg[], from: number, to: number): Seg[] {
  const out: Seg[] = [];
  let pos = 0;
  for (const s of segs) {
    const start = pos, end = pos + s.plain_text.length;
    pos = end;
    const a = Math.max(from, start), b = Math.min(to, end);
    if (a < b) out.push({ ...s, plain_text: s.plain_text.slice(a - start, b - start) });
  }
  // recorta espacios en los extremos
  while (out.length && !out[0].plain_text.trim()) out.shift();
  while (out.length && !out[out.length - 1].plain_text.trim()) out.pop();
  if (out.length) {
    out[0] = { ...out[0], plain_text: out[0].plain_text.replace(/^\s+/, "") };
    const l = out.length - 1;
    out[l] = { ...out[l], plain_text: out[l].plain_text.replace(/\s+$/, "") };
  }
  return out;
}

/** Aplica la regla línea por línea (un párrafo puede traer título + texto separados por salto de línea). */
export function localizeRich(rich: Seg[] = [], lang: Lang, loose = false): Seg[] {
  const lines: Seg[][] = [[]];
  for (const seg of rich) {
    const parts = seg.plain_text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ ...seg, plain_text: part });
    });
  }
  const out: Seg[] = [];
  lines.forEach((line, li) => {
    if (li > 0) out.push({ plain_text: "\n", annotations: {}, href: null });
    const text = line.map((s) => s.plain_text).join("");
    const allBold = line.length > 0 && line.every((s) => !s.plain_text.trim() || s.annotations?.bold);
    // Prueba cada " / ": la primera con mitades ES + EN válidas separa los idiomas.
    for (let i = text.indexOf(" / "); i !== -1; i = text.indexOf(" / ", i + 1)) {
      if (isPair(text.slice(0, i), text.slice(i + 3), allBold, loose)) {
        out.push(...(lang === "es" ? slice(line, 0, i) : slice(line, i + 3, text.length)));
        return;
      }
    }
    out.push(...line);
  });
  return out;
}

export const plainText = (rich: Seg[] = []) => rich.map((s) => s.plain_text).join("");
