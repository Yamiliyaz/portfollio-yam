/** Convierte un link de Figma en URL de embed. Solo acepta figma.com (nada de dominios arbitrarios). */
export function figmaEmbedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" || !["www.figma.com", "figma.com"].includes(u.hostname)) return null;
    if (!/^\/(proto|design|file|board)\//.test(u.pathname)) return null;
    const e = new URL(`https://embed.figma.com${u.pathname}`);
    u.searchParams.forEach((v, k) => e.searchParams.set(k, v));
    // Figma solo acepta hosts de embed registrados ("share" es el genérico); otro nombre devuelve 404.
    e.searchParams.set("embed-host", "share");
    return e.toString();
  } catch {
    return null;
  }
}

/** El link original (sin embed) para "Abrir en Figma". */
export function figmaOpenUrl(raw: string): string | null {
  return figmaEmbedUrl(raw) ? raw : null;
}
