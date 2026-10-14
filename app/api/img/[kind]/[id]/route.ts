import { Client } from "@notionhq/client";

// Los archivos alojados en Notion tienen URLs firmadas que caducan a la hora. En vez de incrustarlas en el HTML
// (que puede quedar en caché más tiempo), el sitio apunta a esta ruta, que pide la URL vigente y redirige.
const UUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
const KINDS = ["block", "featured", "cover"];
const notFound = () => new Response("Not found", { status: 404 });
const fileUrl = (f: any): string | undefined => (f?.type === "file" ? f.file?.url : f?.external?.url);

export async function GET(_req: Request, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!KINDS.includes(kind) || !UUID.test(id) || !process.env.NOTION_TOKEN) return notFound();
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    let url: string | undefined;
    if (kind === "block") {
      const b: any = await notion.blocks.retrieve({ block_id: id });
      if (b.type !== "image") return notFound(); // solo imágenes
      url = fileUrl(b.image);
    } else {
      const p: any = await notion.pages.retrieve({ page_id: id });
      url = kind === "featured" ? fileUrl(p.properties?.["Imagen destacada"]?.files?.[0]) : fileUrl(p.cover);
    }
    if (!url || !url.startsWith("https://")) return notFound();
    // La URL firmada dura 1 h: se cachea la redirección menos de eso.
    return new Response(null, {
      status: 302,
      headers: { Location: url, "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=300" },
    });
  } catch {
    return notFound();
  }
}
