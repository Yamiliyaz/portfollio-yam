import type { Lang } from "@/lib/i18n";
import { localizeRich, plainText } from "@/lib/bilingual";
import type { NBlock } from "@/lib/notion";

const WORDS_PER_MIN = 220;

const words = (s: string) => (s.match(/\S+/g) ?? []).length;

/** Palabras del cuerpo de Notion en el idioma activo (solo texto de los bloques, sin pies de imagen duplicados). */
export function blockWords(blocks: NBlock[], lang: Lang): number {
  let n = 0;
  for (const b of blocks) {
    const rich = b?.[b.type]?.rich_text;
    if (Array.isArray(rich)) n += words(plainText(localizeRich(rich, lang, true)));
  }
  return n;
}

/** Minutos de lectura: ~220 palabras/min, mínimo 1. */
export function readingMinutes(texts: string[], blocks: NBlock[], lang: Lang): number {
  const total = texts.reduce((n, t) => n + words(t), 0) + blockWords(blocks, lang);
  return Math.max(1, Math.round(total / WORDS_PER_MIN));
}
