import { NextResponse, type NextRequest } from "next/server";
import { expectedToken, isProtectedSlug, safeEqual, UNLOCK_COOKIE } from "@/lib/protected";

/** Los proyectos privados piden contraseña antes de servir cualquier contenido. */
export async function proxy(req: NextRequest) {
  const m = req.nextUrl.pathname.match(/^\/(en|es)\/work\/([^/]+)\/?$/);
  if (!m || !isProtectedSlug(m[2])) return NextResponse.next();

  const token = await expectedToken();
  const have = req.cookies.get(UNLOCK_COOKIE)?.value;
  if (token && have && safeEqual(have, token)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${m[1]}/unlock`;
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/:lang(en|es)/work/:slug"] };
