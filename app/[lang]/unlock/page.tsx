import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const COPY = {
  en: {
    title: "Private project",
    lead: "This case is about an internal tool, so it's protected. Enter the password I shared with you to read it.",
    label: "Password",
    cta: "View case",
    wrong: "That password isn't right. Try again.",
    off: "Access isn't configured yet.",
    back: "Back to work",
  },
  es: {
    title: "Proyecto privado",
    lead: "Este caso es de una herramienta interna, por eso está protegido. Escribe la contraseña que te compartí para leerlo.",
    label: "Contraseña",
    cta: "Ver caso",
    wrong: "La contraseña no es correcta. Inténtalo de nuevo.",
    off: "El acceso todavía no está configurado.",
    back: "Volver a Work",
  },
} as const;

export default async function Unlock({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ next?: string; error?: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { next = "", error } = await searchParams;
  const c = COPY[lang];
  return (
    <div className="page">
      <section className="unlock">
        <h1 className="unlock-title">{c.title}</h1>
        <p className="unlock-lead">{c.lead}</p>
        <form method="post" action="/api/unlock" className="unlock-form">
          <input type="hidden" name="next" value={next} />
          <label className="unlock-label" htmlFor="pw">{c.label}</label>
          <input id="pw" name="password" type="password" autoComplete="current-password" required autoFocus className="unlock-input" aria-invalid={error ? true : undefined} aria-describedby={error ? "pw-err" : undefined} />
          {error && <p id="pw-err" className="unlock-error" role="alert">{error === "2" ? c.off : c.wrong}</p>}
          <button type="submit" className="btn btn-dark">{c.cta}</button>
        </form>
        <a className="unlock-back" href={`/${lang}/work`}>{c.back}</a>
      </section>
    </div>
  );
}
