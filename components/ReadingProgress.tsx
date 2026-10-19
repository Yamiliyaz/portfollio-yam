"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Figma "Project detail — reading progress": barra fija de 4px sobre la nav; el relleno avanza con el scroll
// desde el inicio del hero hasta que el final del contenido llega al borde inferior de la pantalla.
export default function ReadingProgress({ startId, endId }: { startId: string; endId: string }) {
  const fill = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => setHost(document.body), []);

  useEffect(() => {
    if (!host) return;
    const start = document.getElementById(startId);
    const end = document.getElementById(endId);
    const el = fill.current;
    if (!start || !end || !el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = start.getBoundingClientRect().top + window.scrollY;
      const bottom = end.getBoundingClientRect().top + window.scrollY - window.innerHeight;
      const span = Math.max(1, bottom - top);
      const p = Math.min(1, Math.max(0, (window.scrollY - top) / span));
      el.style.transform = `scaleX(${p})`;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      ro.disconnect();
    };
  }, [host, startId, endId]);

  if (!host) return null;
  return createPortal(
    <div className="rp" aria-hidden="true">
      <div className="rp-fill" ref={fill} />
    </div>,
    host,
  );
}
