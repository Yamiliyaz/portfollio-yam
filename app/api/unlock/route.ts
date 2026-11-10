import { NextResponse, type NextRequest } from "next/server";
import { expectedToken, safeEqual, tokenFor, UNLOCK_COOKIE, UNLOCK_MAX_AGE } from "@/lib/protected";

const NEXT_OK = /^\/(en|es)\/work\/[a-z0-9-]+$/;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "");
  const lang = next.startsWith("/es") ? "es" : "en";
  const target = NEXT_OK.test(next) ? next : `/${lang}/work`;

  const expected = await expectedToken();
  if (expected && password && safeEqual(await tokenFor(password), expected)) {
    const res = NextResponse.redirect(new URL(target, req.url), 303);
    res.cookies.set(UNLOCK_COOKIE, expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: UNLOCK_MAX_AGE,
    });
    return res;
  }

  await new Promise((r) => setTimeout(r, 600)); // frena la fuerza bruta
  const back = new URL(`/${lang}/unlock`, req.url);
  back.searchParams.set("error", expected ? "1" : "2");
  if (NEXT_OK.test(next)) back.searchParams.set("next", next);
  return NextResponse.redirect(back, 303);
}
