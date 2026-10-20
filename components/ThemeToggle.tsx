"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// Figma "Theme — Light / Dark (site)": botón de 40px en la nav. Sin preferencia guardada sigue al sistema.
export default function ThemeToggle({ labels }: { labels: { toDark: string; toLight: string } }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    // Sin elección guardada, cambia con el sistema.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      try { if (localStorage.getItem("theme")) return; } catch {}
      root.dataset.theme = mq.matches ? "dark" : "light";
    };
    mq.addEventListener("change", onSystem);
    return () => { mo.disconnect(); mq.removeEventListener("change", onSystem); };
  }, []);

  const toggle = () => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  };

  const dark = theme === "dark";
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={dark ? labels.toLight : labels.toDark} title={dark ? labels.toLight : labels.toDark}>
      <svg className="tt-moon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.5 11.6A6.8 6.8 0 0 1 8.4 3.5a6.8 6.8 0 1 0 8.1 8.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      <svg className="tt-sun" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10 2.5v1.8M10 15.7v1.8M2.5 10h1.8M15.7 10h1.8M4.7 4.7l1.3 1.3M14 14l1.3 1.3M4.7 15.3L6 14M14 6l1.3-1.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    </button>
  );
}
