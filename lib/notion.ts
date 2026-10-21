import { Client } from "@notionhq/client";
import fallback from "@/data/fallback.json";
import type { Lang } from "./i18n";

export type Bi = { en: string; es: string };

export type Project = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  company: string;
  level: string; // Proyecto | Iniciativa | Feature
  type: string;
  parent: string;
  role: string;
  status: string;
  start: string;
  end: string;
  tools: string[];
  /** Propiedad "Plataforma" (multi): Web, App, Web App, TPV. */
  platforms: string[];
  tags: string[];
  team: string;
  cover: string | null;
  /** Propiedad "Imagen destacada"; si está vacía, la portada de la página. */
  featuredImage: string | null;
  /** Link del prototipo de Figma (propiedad "Prototipo Figma"). */
  figmaUrl: string;
  featured: boolean;
  order: number;
  short: Bi;
  problem: Bi;
  solution: Bi;
  research: Bi;
  impact: Bi;
  postRelease: Bi;
  /** "Aprendizajes" y "Próximos pasos" (EN/ES). */
  learnings: Bi;
  next: Bi;
  /** "Métricas clave" (EN/ES): cifras verificadas; se muestran en el detalle y en About. */
  metrics: Bi;
};

/** Portadas del Figma guardadas en /public/images; la portada de la página de Notion tiene prioridad. */
const LOCAL_COVERS: Record<string, string> = {
  "konfio-pos": "/images/card-konfio-pos.jpg",
  "konfio-design-system": "/images/card-konfio-design-system.jpg",
  "bancanet-enterprise-web": "/images/card-bancanet-empresarial-web.jpg",
  "bancanet-enterprise-mobile": "/images/card-bancanet-empresarial-movil.jpg",
};

const DATA_SOURCE_ID =
  process.env.NOTION_DATA_SOURCE_ID ?? "321118c0-b172-808f-bc57-000bb050d58a";

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Limpia artefactos de la exportación Markdown de Notion en los campos de texto. */
export function cleanText(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\([|~*_#>\-])/g, "$1")
    .trim();
}

type Props = Record<string, any>;

const text = (p: any): string =>
  (p?.rich_text ?? p?.title ?? []).map((t: any) => t.plain_text).join("");
const sel = (p: any): string => p?.select?.name ?? "";
const multi = (p: any): string[] => (p?.multi_select ?? []).map((o: any) => o.name);
const date = (p: any): string => p?.date?.start ?? "";

function mapPage(page: any): Project {
  const p: Props = page.properties;
  const bi = (base: string): Bi => ({
    en: cleanText(text(p[`${base} EN`])),
    es: cleanText(text(p[`${base} ES`])),
  });
  const name = text(p["Nombre"]);
  const nameEn = text(p["Nombre EN"]);
  // Archivos alojados en Notion: se sirven por /api/img (la URL firmada caduca a la hora).
  const cover =
    page.cover?.type === "external"
      ? page.cover.external.url
      : page.cover?.type === "file"
        ? `/api/img/cover/${page.id}`
        : null;
  const file = p["Imagen destacada"]?.files?.[0];
  const featuredImage: string | null =
    file?.type === "external" ? file.external.url : file?.type === "file" ? `/api/img/featured/${page.id}` : null;
  return {
    id: page.id,
    slug: slugify(nameEn || name),
    name,
    nameEn,
    company: sel(p["Empresa / Producto"]),
    level: sel(p["Nivel"]),
    type: sel(p["Tipo"]),
    parent: sel(p["Proyecto padre"]),
    role: sel(p["Rol"]),
    status: sel(p["Estado"]),
    start: date(p["Fecha inicio"]),
    end: date(p["Fecha fin"]),
    tools: multi(p["Herramientas"]),
    platforms: multi(p["Plataforma"]),
    tags: multi(p["Tags"]),
    team: cleanText(text(p["Equipo"])),
    cover: cover ?? LOCAL_COVERS[slugify(nameEn || name)] ?? null,
    featuredImage: featuredImage ?? cover ?? LOCAL_COVERS[slugify(nameEn || name)] ?? null,
    figmaUrl: p["Prototipo Figma"]?.url ?? "",
    featured: !!p["Destacado"]?.checkbox,
    order: p["Orden"]?.number ?? 999,
    short: bi("Descripción corta"),
    problem: bi("Problema"),
    solution: bi("Solución"),
    research: bi("Research"),
    impact: bi("Impacto"),
    postRelease: bi("Impacto post-release"),
    metrics: bi("Métricas clave"),
    learnings: bi("Aprendizajes"),
    next: bi("Próximos pasos"),
  };
}

async function fetchFromNotion(): Promise<Project[]> {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const out: Project[] = [];
  let cursor: string | undefined;
  do {
    const res: any = await notion.dataSources.query({
      data_source_id: DATA_SOURCE_ID,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const page of res.results) if (page.properties?.["Nombre"]) out.push(mapPage(page));
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return out;
}

/** Con NOTION_TOKEN lee Notion; sin token usa data/fallback.json (solo desarrollo local). */
export async function getAllProjects(): Promise<Project[]> {
  if (!process.env.NOTION_TOKEN) {
    // En producción nunca publicar datos de prueba por error: mejor fallar el build.
    if (process.env.VERCEL_ENV === "production") throw new Error("[Notion] Falta NOTION_TOKEN en el entorno de producción.");
    return (fallback as Project[]).map((p) => ({ ...p, platforms: p.platforms ?? [], cover: LOCAL_COVERS[p.slug] ?? null, featuredImage: LOCAL_COVERS[p.slug] ?? null, figmaUrl: "", metrics: { en: "", es: "" }, learnings: { en: "", es: "" }, next: { en: "", es: "" } }));
  }
  try {
    return await fetchFromNotion();
  } catch (e: any) {
    const hint =
      e?.code === "object_not_found"
        ? "La base no está compartida con la integración (Notion → ··· → Connections) o NOTION_DATA_SOURCE_ID es incorrecto."
        : e?.code === "unauthorized"
          ? "NOTION_TOKEN inválido o incompleto."
          : "";
    throw new Error(`[Notion] ${e?.code ?? "error"}: ${e?.message ?? e}. ${hint}`.trim());
  }
}

const byDateDesc = (a: Project, b: Project) =>
  (b.end || b.start || "9999").localeCompare(a.end || a.start || "9999");
// Orden manual desde Notion ("Orden"); empata por fecha más reciente.
const byOrder = (a: Project, b: Project) => a.order - b.order || byDateDesc(a, b);

const HIDDEN_STATUS = ["Archivado", "Pausado"];
/** Filas de la base que no son proyectos (p. ej. notas del sitio) no tienen Nivel: no se publican. */
const LEVELS = ["Proyecto", "Iniciativa", "Feature"];
const RECENT_MONTHS = 6;

/** Entradas visibles en Work/detalle: cualquier Nivel, salvo Archivado/Pausado. */
export async function getVisible(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => LEVELS.includes(p.level) && !HIDDEN_STATUS.includes(p.status));
}

export function isRecent(p: Project, now = new Date()) {
  if (!p.start) return false;
  const limit = new Date(now);
  limit.setMonth(limit.getMonth() - RECENT_MONTHS);
  return new Date(p.start + "T12:00:00") >= limit;
}

/** Galería de Work: Destacado/Reciente primero → Fecha inicio desc → Orden asc. */
export async function getGallery(): Promise<(Project & { pinned: "featured" | "recent" | null })[]> {
  const visible = await getVisible();
  return visible
    .map((p) => ({ ...p, pinned: p.featured ? ("featured" as const) : isRecent(p) ? ("recent" as const) : null }))
    .sort(
      (a, b) =>
        Number(!!b.pinned) - Number(!!a.pinned) ||
        (b.start || "").localeCompare(a.start || "") ||
        a.order - b.order,
    );
}

export async function getProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.level === "Proyecto" && p.status !== "Archivado").sort(byOrder);
}

/** Tope de destacados (acordeón de Work y lista del Home). */
export const MAX_FEATURED = 7;

/** Destacados = proyectos completados con "Destacado" marcado, por Orden y luego fecha (más reciente primero), hasta MAX_FEATURED. */
export function pickFeatured<T extends Project>(projects: T[]): T[] {
  return projects
    .filter((p) => p.featured && p.status !== "En progreso")
    .sort((a, b) => a.order - b.order || (b.start || "").localeCompare(a.start || ""))
    .slice(0, MAX_FEATURED);
}

/** Destacados del Home: los mismos que en Work; si no hay ninguno marcado, los 3 primeros proyectos. */
export async function getFeatured(): Promise<Project[]> {
  const featured = pickFeatured(await getVisible());
  return featured.length ? featured : (await getProjects()).slice(0, 3);
}

/** Cuerpo de la página de Notion (bloques), con sus hijos. Vacío sin token (desarrollo). */
export type NBlock = any;
async function fetchChildren(notion: Client, id: string): Promise<NBlock[]> {
  const out: NBlock[] = [];
  let cursor: string | undefined;
  do {
    const res: any = await notion.blocks.children.list({ block_id: id, start_cursor: cursor, page_size: 100 });
    out.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  for (const b of out) {
    if (b.has_children && b.type !== "child_page" && b.type !== "child_database") b.children = await fetchChildren(notion, b.id);
  }
  return out;
}
export async function getBlocks(pageId: string): Promise<NBlock[]> {
  if (!process.env.NOTION_TOKEN) return [];
  return fetchChildren(new Client({ auth: process.env.NOTION_TOKEN }), pageId);
}

/** Estados sin página de detalle: se muestran deshabilitados ("Próximamente"). */
export const hasDetail = (p: Pick<Project, "status">) => p.status !== "En progreso";

export async function getProject(slug: string) {
  const all = await getAllProjects();
  const project = all.find((p) => p.slug === slug);
  if (!project || !hasDetail(project)) return null;
  const related = all
    .filter((p) => p.parent === project.name && p.id !== project.id)
    .sort(byDateDesc);
  return { project, related };
}

export const projectName = (p: Project, lang: Lang) => (lang === "en" ? p.nameEn || p.name : p.name);

export const pick = (b: Bi, lang: Lang) => b[lang] || b.en || b.es;

export function formatPeriod(p: Project, lang: Lang, present: string) {
  const fmt = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
      month: "short",
      year: "numeric",
    });
  if (!p.start) return p.end ? fmt(p.end) : "";
  const end = p.end ? fmt(p.end) : p.status === "En progreso" ? present : "";
  return end ? `${fmt(p.start)} – ${end}` : fmt(p.start);
}

export function yearRange(p: Project) {
  const a = p.start?.slice(0, 4);
  const b = p.end?.slice(0, 4);
  if (!a) return b ?? "";
  return b && b !== a ? `${a} - ${b}` : a;
}

/** Metas, objetivos o cifras pendientes de medir: no son resultados observados y se etiquetan aparte. */
const TARGET_RE = /\b(target|targets|goal|goals|expected|expect|to measure|pending|meta|metas|objetivo|objetivos|esperad[oa]s?|a medir|pendiente)\b/i;
export const isTarget = (s: string) => TARGET_RE.test(s);
/** Un campo de Impacto que empieza como meta/expectativa (no como resultado). */
export const impactIsTarget = (s: string) => /^\s*(goals?|targets?|target metrics|expected|expected reduction|pending|metas?|objetivos?|m[eé]tricas objetivo|reducci[oó]n esperada|pendiente|tracking metrics|m[eé]tricas de seguimiento)\b/i.test(s);

export const splitFacts = (s: string) => s.split(/\s[|·]\s/).map((x) => x.trim()).filter(Boolean);

/** Hasta `max` datos observados (no metas) para encabezados y tarjetas: Métricas clave primero, si no los de "escala" del Impacto. */
export function keyFacts(p: Project, lang: Lang, max = 2): { kind: "outcomes" | "scale"; items: string[] } | null {
  const metrics = splitFacts(pick(p.metrics, lang)).filter((x) => !isTarget(x));
  if (metrics.length) return { kind: "outcomes", items: metrics.slice(0, max) };
  const impact = pick(p.impact, lang);
  const parts = splitFacts(impact);
  if (parts.length > 1 && !impactIsTarget(impact)) return { kind: "scale", items: parts.slice(0, max) };
  return null;
}
