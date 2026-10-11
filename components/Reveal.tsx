"use client";

import { createElement, useEffect, useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";

// Figma "— Motion": las secciones aparecen con OPACITY 0→1 + TRANSLATION_Y (EASE_OUT) al entrar al viewport.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Props = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "footer";
  rise?: number;
  delay?: number;
  children: ReactNode;
};

export default function Reveal({ as = "div", rise = 40, delay = 0, className = "", style, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // ya visible al cargar: sin animar
    el.classList.add("rv-hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("rv-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const vars = { "--rise": `${rise}px`, "--delay": `${delay}s`, ...style } as CSSProperties;
  return createElement(as, { ref, className, style: vars, ...rest }, children);
}
