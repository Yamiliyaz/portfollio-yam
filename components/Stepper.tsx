"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Step = { id: string; label: string };

// Figma "Project page — Motion": el paso activo pasa de gray-400 a gray-900 cuando su sección entra.
export default function Stepper({ steps, backHref, backLabel, contentLabel }: { steps: Step[]; backHref: string; backLabel: string; contentLabel: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = steps.map((s) => document.getElementById(s.id)).filter((x): x is HTMLElement => !!x);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [steps]);

  return (
    <aside className="stepper" aria-label={contentLabel}>
      <Link className="back" href={backHref}>
        <img src="/icons/arrow-down.svg" alt="" />
        {backLabel}
      </Link>
      <hr />
      <p className="label">{contentLabel}</p>
      {steps.map((x) => (
        <a key={x.id} href={`#${x.id}`} className={active === x.id ? "is-active" : undefined} aria-current={active === x.id ? "true" : undefined}>
          {x.label}
        </a>
      ))}
    </aside>
  );
}
