import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Uso: /api/revalidate?secret=XXX  (revalida todo el sitio tras editar Notion)
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, at: Date.now() });
}
