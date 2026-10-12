"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const KEY = "scrollmem:";
const WORK = /^\/(en|es)\/work\/?$/;
const DETAIL = /^\/(en|es)\/work\/[^/]+/;

/** Guarda el scroll de cada ruta y lo restaura al volver de un detalle de proyecto a Work (botón Volver o atrás del navegador). */
export default function ScrollMemory() {
  const path = usePathname();
  const prev = useRef<string | null>(null);

  // 1) Guardar: al hacer scroll (con retardo) y justo antes de navegar (clic).
  useEffect(() => {
    let timer: number | undefined;
    const save = () => {
      try { sessionStorage.setItem(KEY + path, String(Math.round(window.scrollY))); } catch {}
    };
    const onScroll = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(save, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", save, true);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", save, true);
    };
  }, [path]);

  // 2) Restaurar: al llegar a Work desde un detalle. Se lee el valor al instante (antes de que otros scrolls lo pisen).
  useEffect(() => {
    const from = prev.current;
    prev.current = path;
    if (!from) return; // primera carga: el navegador decide
    if (!WORK.test(path) || !DETAIL.test(from)) {
      // Cualquier otra navegación empieza arriba (evita abrir un detalle a medio scroll).
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    let y = 0;
    try { y = Number(sessionStorage.getItem(KEY + path)) || 0; } catch {}
    if (y <= 0) return;
    let tries = 0;
    let t: number | undefined;
    const apply = () => {
      window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      // La galería y los filtros se pintan después de montar: reintenta hasta que la página sea lo bastante alta.
      if (Math.abs(window.scrollY - y) > 4 && ++tries < 10) t = window.setTimeout(apply, 100);
    };
    t = window.setTimeout(apply, 50);
    return () => { if (t) window.clearTimeout(t); };
  }, [path]);

  return null;
}
