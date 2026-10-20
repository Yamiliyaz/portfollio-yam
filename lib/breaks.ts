import type { NBlock } from "@/lib/notion";

// Figma "Project detail — visual breaks": las imágenes del cuerpo de Notion se reparten ENTRE las secciones de texto.
const SLOT_IDS = ["problem", "research", "solution", "release", "learnings"];

type Section = { id: string; title: string; blocks: NBlock[] };

/** Saca las imágenes (nivel superior) de las secciones del cuerpo; descarta las secciones que se quedan vacías. */
export function takeImages<S extends Section>(sections: S[]): { sections: S[]; images: NBlock[] } {
  const images: NBlock[] = [];
  const rest = sections.map((s) => {
    const blocks = s.blocks.filter((b) => (b.type === "image" ? (images.push(b), false) : true));
    return { ...s, blocks };
  });
  return { sections: rest.filter((s) => s.blocks.length > 0), images };
}

/** Huecos disponibles: después de Problema, Research, Solución, Post-release y Aprendizajes (los que existan). */
export const breakSlots = (ids: string[]) => ids.filter((id) => SLOT_IDS.includes(id));

/** Reparte las imágenes, en orden, parejo entre los huecos (más de un hueco por imagen no hay). */
export function planBreaks(slots: string[], images: NBlock[]): Map<string, NBlock[]> {
  const out = new Map<string, NBlock[]>();
  const n = images.length;
  if (!n || !slots.length) return out;
  const b = Math.min(slots.length, n);
  const chosen = Array.from({ length: b }, (_, i) => slots[Math.min(slots.length - 1, Math.round(((i + 0.5) * slots.length) / b - 0.5))]);
  let at = 0;
  chosen.forEach((id, i) => {
    const size = Math.floor(n / b) + (i < n % b ? 1 : 0);
    out.set(id, images.slice(at, at + size));
    at += size;
  });
  return out;
}
