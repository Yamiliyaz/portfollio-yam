"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

// Figma "Work — Motion (page transition)": al salir, el contenido hace OPACITY 1→0 y sube -8px en 0.25s (EASE_IN).
const EXIT_MS = 250;

export default function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // El <main> se reutiliza entre rutas: al llegar a la nueva, quitamos la salida para que entre con fundido.
  useEffect(() => {
    document.querySelector("main")?.classList.remove("route-exit");
  }, [pathname]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onClick = (e: MouseEvent) => {
      if (reduce.matches || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // anclas / misma página
      e.preventDefault();
      e.stopPropagation(); // evita que el <Link> de Next navegue al instante
      document.querySelector("main")?.classList.add("route-exit");
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), EXIT_MS);
    };
    // fase de captura: corre antes que el onClick de <Link>
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return <>{children}</>;
}
