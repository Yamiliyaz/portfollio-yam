import { Client } from "@notionhq/client";
import fallback from "@/data/fallback-testimonials.json";

export type Testimonial = {
  id: string;
  name: string;
  /** Cargo corto de quien recomienda. */
  role: string;
  /** Extracto literal de la tarjeta (si no hay, la cita completa). */
  quote: string;
  /** Sección de recomendaciones del perfil de LinkedIn. */
  href: string;
  /** Idioma original de la cita. */
  lang: string;
};

const DATA_SOURCE_ID = process.env.TESTIMONIALS_DATA_SOURCE_ID ?? "6a9cff39-2543-481c-914b-0153e0ba281c";

const text = (p: any): string => (p?.rich_text ?? p?.title ?? []).map((t: any) => t.plain_text).join("").trim();
// Solo se enlaza a LinkedIn; cualquier otra URL se descarta.
const safeLink = (u: string) => (/^https:\/\/(www\.)?linkedin\.com\//.test(u) ? u : "https://www.linkedin.com/in/yamilarroyo/");

/**
 * Recomendaciones visibles de la base "Testimonios" de Notion, por Orden.
 * Si la base no está compartida con la integración o falla Notion, la sección se oculta (devuelve []):
 * los testimonios nunca deben tumbar el build del sitio.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!process.env.NOTION_TOKEN) return process.env.VERCEL_ENV === "production" ? [] : (fallback as Testimonial[]);
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const out: Testimonial[] = [];
    let cursor: string | undefined;
    do {
      const res: any = await notion.dataSources.query({
        data_source_id: DATA_SOURCE_ID,
        filter: { property: "Visible", checkbox: { equals: true } },
        sorts: [{ property: "Orden", direction: "ascending" }],
        start_cursor: cursor,
        page_size: 100,
      });
      for (const page of res.results) {
        const p = page.properties;
        const quote = text(p["Extracto"]) || text(p["Cita"]);
        const name = text(p["Nombre"]);
        if (!name || !quote) continue;
        out.push({
          id: page.id,
          name,
          role: text(p["Cargo"]),
          quote,
          href: safeLink(p["Enlace"]?.url ?? ""),
          lang: p["Idioma"]?.select?.name ?? "es",
        });
      }
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
    return out;
  } catch (e: any) {
    console.warn(`[Notion] Testimonios no disponibles (${e?.code ?? "error"}): ¿la base está compartida con la integración?`);
    return [];
  }
}
