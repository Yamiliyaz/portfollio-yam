/** Convierte un link de Figma en URL de embed. Solo acepta figma.com (nada de dominios arbitrarios). */
export function figmaEmbedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" || !["www.figma.com", "figma.com"].includes(u.hostname)) return null;
    if (!/^\/(proto|design|file|board)\//.test(u.pathname)) return null;
    const e = new URL(`https://embed.figma.com${u.pathname}`);
    u.searchParams.forEach((v, k) => e.searchParams.set(k, v));
    e.searchParams.set("embed-host", "portfolio");
    return e.toString();
  } catch {
    return null;
  }
}

export default function FigmaEmbed({ url, title }: { url: string; title: string }) {
  const src = figmaEmbedUrl(url);
  if (!src) return null;
  return (
    <div className="figma-embed">
      <iframe src={src} title={title} loading="lazy" allowFullScreen />
    </div>
  );
}
