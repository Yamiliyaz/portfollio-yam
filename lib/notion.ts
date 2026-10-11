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
  tags: string[];
  team: string;
  cover: string | null;
  featured: boolean;
  order: number;
  short: Bi;
  problem: Bi;
  solution: Bi;
  research: Bi;
  impact: Bi;
  postRelease: Bi;
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
  const cover =
    page.cover?.type === "external"
      ? page.cover.external.url
      : page.cover?.type === "file"
        ? page.cover.file.url
        : null;
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
    tags: multi(p["Tags"]),
    team: cleanText(text(p["Equipo"])),
    cover: cover ?? LOCAL_COVERS[slugify(nameEn || name)] ?? null,
    featured: !!p["Destacado"]?.checkbox,
    order: p["Orden"]?.number ?? 999,
    short: bi("Descripción corta"),
    problem: bi("Problema"),
    solution: bi("Solución"),
    research: bi("Research"),
    impact: bi("Impacto"),
    postRelease: bi("Impacto post-release"),
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
  if (!process.env.NOTION_TOKEN) return fallback as Project[];
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

export async function getProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.level === "Proyecto" && p.status !== "Archivado").sort(byOrder);
}

/** Proyectos con "Destacado" marcado, en orden; si no hay ninguno, los 3 primeros. */
export async function getFeatured(): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  return (featured.length ? featured : projects).slice(0, 3);
}

export async function getProject(slug: string) {
  const all = await getAllProjects();
  const project = all.find((p) => p.slug === slug);
  if (!project) return null;
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
  if (!p.start) return "";
  const end = p.end ? fmt(p.end) : p.status === "En progreso" ? present : "";
  return end ? `${fmt(p.start)} – ${end}` : fmt(p.start);
}

export function yearRange(p: Project) {
  const a = p.start?.slice(0, 4);
  const b = p.end?.slice(0, 4);
  if (!a) return b ?? "";
  return b && b !== a ? `${a} - ${b}` : a;
}
