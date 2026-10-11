"use client";

import { useEffect, useRef, useState } from "react";

// Figma: "animate/section/methodology 1" — 8 pasos encadenados con AFTER_TIMEOUT + SMART_ANIMATE 300ms.
// Tiempo de espera de cada paso (ms): 1s ×6, 5s en el paso 7 y 0.8s en el paso 8. Luego vuelve al paso 1.
const DWELL = [1000, 1000, 1000, 1000, 1000, 1000, 5000, 800];
const TRANSITION = 300;

type Labels = { center: string; dataAnalysis: string; approach: string; framework: string; outer: string };

export default function MethodologyPiece({ labels }: { labels: Labels }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    let running = false;
    let s = 1;
    const tick = () => {
      timer = window.setTimeout(() => {
        s = s === 8 ? 1 : s + 1;
        setStep(s);
        tick();
      }, DWELL[s - 1] + TRANSITION);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          tick();
        } else if (!entry.isIntersecting && running) {
          running = false;
          window.clearTimeout(timer);
          s = 1;
          setStep(1);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mm" data-step={step} ref={ref} aria-hidden="true">
      <div className="mm-dash" />
      <div className="mm-da"><span>{labels.dataAnalysis}</span></div>
      <div className="mm-pd"><span>{labels.center}</span></div>
      <div className="mm-chip mm-dt"><span>{labels.approach}</span></div>
      <div className="mm-chip mm-hcd"><span>{labels.framework}</span></div>
      <div className="mm-ovals">
        <i className="mm-c mm-cx" />
        <i className="mm-c mm-ux" />
        <i className="mm-c mm-ui" />
        <b className="mm-l mm-l-sd">{labels.outer}</b>
        <b className="mm-l mm-l-ux">UX</b>
        <b className="mm-l mm-l-ui">UI</b>
      </div>
    </div>
  );
}
