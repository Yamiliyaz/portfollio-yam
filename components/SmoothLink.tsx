"use client";

import type { AnchorHTMLAttributes } from "react";

// Figma: SCROLL_ANIMATE 2084ms (SLOW). Se aproxima con easeInOutCubic.
const DURATION = 2084;
const NAV_OFFSET = 96;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function SmoothLink({ href, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !href.startsWith("#")) return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const from = window.scrollY;
        const to = Math.max(0, target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);
        history.replaceState(null, "", href);
        if (reduce) return window.scrollTo(0, to);
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          window.scrollTo(0, from + (to - from) * ease(t));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }}
    >
      {children}
    </a>
  );
}
