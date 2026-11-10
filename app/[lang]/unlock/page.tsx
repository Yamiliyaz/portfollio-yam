import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PasswordModal, { type PasswordCopy } from "@/components/PasswordModal";
import { isLang } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const COPY: Record<"en" | "es", PasswordCopy> = {
  en: {
    title: "Private project",
    lead: "This case is about an internal tool, so it's protected. Enter the password I shared with you to read it.",
    label: "Password", cta: "View case", busy: "Checking…",
    wrong: "That password isn't right. Try again.",
    off: "Access isn't configured yet.",
    back: "Back to work", show: "Show password", hide: "Hide password", close: "Close",
  },
  es: {
    title: "Proyecto privado",
    lead: "Este caso es de una herramienta interna, por eso está protegido. Escribe la contraseña que te compartí para leerlo.",
    label: "Contraseña", cta: "Ver caso", busy: "Verificando…",
    wrong: "La contraseña no es correcta. Inténtalo de nuevo.",
    off: "El acceso todavía no está configurado.",
    back: "Volver a Work", show: "Mostrar contraseña", hide: "Ocultar contraseña", close: "Cerrar",
  },
};

export default async function Unlock({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ next?: string; error?: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { next = "", error } = await searchParams;
  const safeNext = /^\/(en|es)\/work\/[a-z0-9-]+$/.test(next) ? next : "";
  return (
    <div className="page unlock-bg">
      <PasswordModal copy={COPY[lang]} next={safeNext} backHref={`/${lang}/work`} initialError={error === "2" ? "off" : error ? "wrong" : undefined} />
    </div>
  );
}
