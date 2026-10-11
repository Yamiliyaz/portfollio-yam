import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Compara hashes para igualar longitudes y evitar filtrar información por tiempos de respuesta.
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Refresca el sitio tras editar Notion. El secreto viaja en un header (no en la URL, que queda en logs):
 *   curl -X POST https://TU-DOMINIO/api/revalidate -H "x-revalidate-secret: TU_SECRETO"
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-revalidate-secret") ?? "";
  if (!secret || !safeEqual(given, secret)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, at: Date.now() }, { headers: { "Cache-Control": "no-store" } });
}

// El método GET quedó deshabilitado a propósito: el secreto ya no debe ir en la URL.
export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST" }, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
}
