"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

export type TestimonialsLabels = { title: string; lead: string; pause: string; play: string; opens: string };

const initials = (name: string) =>
  name.split(/\s+/).filter((w) => /^\p{Lu}/u.test(w)).slice(0, 2).map((w) => w[0]).join("");

function Card({ t, labels, clone }: { t: Testimonial; labels: TestimonialsLabels; clone?: boolean }) {
  return (
    <li>
      <a
        className="tm-card"
        href={t.href}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={clone ? -1 : undefined}
      >
        <span className="tm-author">
          <span className="tm-avatar" aria-hidden="true">{initials(t.name)}</span>
          <span className="tm-who">
            <span className="tm-name">{t.name}</span>
            {t.role && <span className="tm-role">{t.role}</span>}
          </span>
        </span>
        <blockquote className="tm-quote" lang={t.lang}>“{t.quote}”</blockquote>
        <span className="sr-only">{labels.opens}</span>
      </a>
    </li>
  );
}

/** Marquee de recomendaciones de LinkedIn: bucle continuo, pausa con el cursor, el foco o el botón; sin animación si se prefiere menos movimiento. */
export default function TestimonialsMarquee({ items, labels }: { items: Testimonial[]; labels: TestimonialsLabels }) {
  const [paused, setPaused] = useState(false);
  if (!items.length) return null;
  // Cada grupo debe ser más ancho que la pantalla para que el bucle no tenga huecos.
  const reps = Math.max(1, Math.ceil(8 / items.length));
  const group = Array.from({ length: reps }).flatMap(() => items);
  const seconds = Math.max(40, group.length * 9);

  return (
    <section className="section tm" aria-labelledby="tm-title">
      <div className="section-inner tm-head">
        <div className="tm-titles">
          <h2 id="tm-title" className="t-h3-serif">{labels.title}</h2>
          <p className="t-p1">{labels.lead}</p>
        </div>
        <button type="button" className="tm-toggle" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? labels.play : labels.pause}
        </button>
      </div>
      <div className="tm-viewport" data-paused={paused}>
        <div className="tm-track" style={{ ["--dur" as string]: `${seconds}s` }}>
          <ul className="tm-group">
            {group.map((t, i) => <Card key={`a-${i}`} t={t} labels={labels} />)}
          </ul>
          <ul className="tm-group tm-clone" aria-hidden="true">
            {group.map((t, i) => <Card key={`b-${i}`} t={t} labels={labels} clone />)}
          </ul>
        </div>
      </div>
    </section>
  );
}
