"use client";

import { useEffect, useRef } from "react";

// Figma "Footer — reveal + halftone": la palabra se imprime con puntos de media tinta (el tamaño de cada punto
// depende de cuánto de la letra cubre su celda). Con el puntero los puntos se apartan con resorte y se tiñen
// hacia el acento; con click corre un anillo de choque por la palabra. Con prefers-reduced-motion queda estática.

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

// Radio del punto para una cobertura [0,1]: proporcional al área, el tono se mantiene parejo.
const dotRadius = (coverage: number, gap: number) => Math.sqrt(Math.min(1, Math.max(0, coverage))) * gap * 0.56;

type Props = { word: string; crop?: number; radius?: number };

export default function HalftoneWordmark({ word, crop = 0.26, radius = 80 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const host = root?.closest("footer");
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(root);
    const family = css.getPropertyValue("--font-body").trim() || "system-ui, sans-serif";
    // colores del tema del footer (--ft-dot-0 en reposo, --ft-dot-4 al ser empujados)
    const ink = hexToRgb(css.getPropertyValue("--ft-dot-0")) || [208, 213, 221];
    const warm = hexToRgb(css.getPropertyValue("--ft-dot-4")) || [25, 65, 133];
    const inkCss = `rgb(${ink.join(",")})`;

    let w = 0, h = 0, dpr = 1, px = -1e5, py = -1e5, raf = 0;
    let awake = true, started = false, alive = true;
    let ring = { x: 0, y: 0, t: -1 };
    let dots = new Float32Array(0); // x, y, vx, vy, hx, hy, r por punto
    let count = 0;

    const layout = () => {
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // La palabra se compone una vez, ajustada al ancho, en una máscara 1x.
      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      m.font = `800 100px ${family}`;
      const fit = (w * 1.02) / Math.max(1, m.measureText(word).width) * 100;
      m.font = `800 ${fit}px ${family}`;
      const box = m.measureText(word);
      const cap = box.actualBoundingBoxAscent || fit * 0.72;
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(word, (w - box.width) / 2, h + cap * Math.max(0, Math.min(0.6, crop)));
      const img = m.getImageData(0, 0, w, h).data;

      const gap = Math.max(4, Math.min(10, Math.round(w / 144)));
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const tmp: number[] = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0; // cobertura: promedio del alfa en una muestra de 3×3 de la celda
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (9 * 255);
          if (cov < 0.06) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          tmp.push(hx, hy, 0, 0, hx, hy, dotRadius(cov, gap));
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;
      awake = true;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const r = reduced ? 0 : radius;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.9;
      let moving = false;
      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j], y = dots[j + 1], vx = dots[j + 2], vy = dots[j + 3];
        const hx = dots[j + 4], hy = dots[j + 5];
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x, dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          // el puntero empuja; el resorte devuelve el punto a su lugar
          const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
          if (r > 0 && d2 < r * r) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / r) * 2.6;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
          vx = (vx + (hx - x) * 0.05) * 0.84;
          vy = (vy + (hy - y) * 0.05) * 0.84;
          x += vx;
          y += vy;
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true;
          else { x = hx; y = hy; vx = 0; vy = 0; }
          dots[j] = x; dots[j + 1] = y; dots[j + 2] = vx; dots[j + 3] = vy;
        }
        const k = Math.min(1, Math.hypot(x - hx, y - hy) / 28);
        ctx.fillStyle = k > 0.02
          ? `rgb(${Math.round(ink[0] + (warm[0] - ink[0]) * k)},${Math.round(ink[1] + (warm[1] - ink[1]) * k)},${Math.round(ink[2] + (warm[2] - ink[2]) * k)})`
          : inkCss;
        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        ctx.fill();
      }
      awake = moving || ringAge < 900 || px > -1e4; // duerme cuando todo está en su lugar
    };

    const loop = (now: number) => {
      raf = 0;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (started && !raf) raf = requestAnimationFrame(loop);
    };

    const local = (e: PointerEvent): [number, number] => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const onMove = (e: PointerEvent) => { [px, py] = local(e); wake(); };
    const onLeave = () => { px = -1e5; py = -1e5; wake(); };
    const onDown = (e: PointerEvent) => {
      if (reduced || (e.target as HTMLElement).closest("a,button")) return;
      const [x, y] = local(e);
      ring = { x, y, t: performance.now() };
      wake();
    };

    // La fuente (800) se carga antes de componer; todo se inicia cuando el footer se acerca al viewport.
    const start = async () => {
      try { await document.fonts.load(`800 100px ${family}`, word); } catch { /* usa la fuente de respaldo */ }
      if (!alive) return;
      started = true;
      layout();
      draw(performance.now());
      wake();
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) { void start(); io.disconnect(); }
    }, { rootMargin: "300px 0px" });
    io.observe(host);

    const ro = new ResizeObserver(() => { if (started) { layout(); wake(); } });
    ro.observe(root);
    // el área de interacción es todo el footer, no solo el canvas
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [word, crop, radius]);

  return (
    <div className="hw" ref={rootRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
