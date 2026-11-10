"use client";

import { useEffect, useRef, useState } from "react";

export type PasswordCopy = {
  title: string; lead: string; label: string; cta: string; wrong: string; off: string; back: string; show: string; hide: string; close: string; busy: string;
};

/** Modal de contraseña para proyectos privados (Figma "Private project — password modal"). */
export default function PasswordModal({ copy, next, backHref, initialError }: { copy: PasswordCopy; next: string; backHref: string; initialError?: "wrong" | "off" }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<"wrong" | "off" | null>(initialError ?? null);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const d = dlg.current;
    if (d && !d.open) d.showModal();
    document.documentElement.style.overflow = "hidden";
    input.current?.focus();
    return () => { document.documentElement.style.overflow = ""; };
  }, []);

  const leave = () => { window.location.assign(backHref); };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/unlock", { method: "POST", body: new FormData(e.currentTarget), headers: { Accept: "application/json" } });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { window.location.assign(data.next || next || backHref); return; }
      setError(data.error === "off" ? "off" : "wrong");
      if (input.current) { input.current.value = ""; input.current.focus(); }
    } catch {
      setError("wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog ref={dlg} className="pm" aria-labelledby="pm-title" onCancel={(e) => { e.preventDefault(); leave(); }}>
      <form method="post" action="/api/unlock" className="pm-in" onSubmit={submit}>
        <div className="pm-head">
          <span className="pm-badge" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </span>
          <button type="button" className="pm-close" aria-label={copy.close} onClick={leave}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <h1 id="pm-title" className="pm-title">{copy.title}</h1>
        <p className="pm-lead">{copy.lead}</p>
        <input type="hidden" name="next" value={next} />
        <div className="pm-field">
          <label className="pm-label" htmlFor="pm-pw">{copy.label}</label>
          <div className={`pm-input${error ? " is-error" : ""}`}>
            <input ref={input} id="pm-pw" name="password" type={show ? "text" : "password"} autoComplete="current-password" required aria-invalid={error ? true : undefined} aria-describedby={error ? "pm-err" : undefined} />
            <button type="button" className="pm-eye" aria-label={show ? copy.hide : copy.show} aria-pressed={show} onClick={() => setShow((s) => !s)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.7 10S4.6 4.6 10 4.6 18.3 10 18.3 10 15.4 15.4 10 15.4 1.7 10 1.7 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />{show && <path d="M3 17L17 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}</svg>
            </button>
          </div>
          {error && <p id="pm-err" className="pm-error" role="alert">{error === "off" ? copy.off : copy.wrong}</p>}
        </div>
        <button type="submit" className="btn btn-dark pm-cta" disabled={busy}>
          {busy ? copy.busy : copy.cta}
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.8 14.2L14.2 5.8M6.7 5.8h7.5v7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <a className="pm-back" href={backHref}>{copy.back}</a>
      </form>
    </dialog>
  );
}
