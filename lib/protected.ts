/**
 * Proyectos privados: se listan en Work, pero su contenido solo se ve con la contraseña.
 * La contraseña vive en la variable de entorno PROJECT_PASSWORD (Vercel); nunca en el repo.
 * Sin esa variable, los proyectos privados quedan cerrados para todos.
 */
export const PROTECTED_SLUGS = ["verification-module-request-tracking-and-kyc-verification"];
export const isProtectedSlug = (slug: string) => PROTECTED_SLUGS.includes(slug);

export const UNLOCK_COOKIE = "pa_unlock";
export const UNLOCK_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

/** Firma HMAC-SHA256 de una contraseña: es lo que se guarda en la cookie (nunca la contraseña). */
export async function tokenFor(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode("project-unlock:v1")));
}

/** Token válido según la contraseña configurada; null si no hay contraseña (todo cerrado). */
export async function expectedToken(): Promise<string | null> {
  const pw = process.env.PROJECT_PASSWORD;
  return pw ? tokenFor(pw) : null;
}

/** Comparación en tiempo constante. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
