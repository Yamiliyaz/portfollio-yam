"use client";

import { useEffect, useRef, useState } from "react";
import { figmaEmbedUrl, figmaOpenUrl } from "@/lib/figma";

export type FigmaLabels = { fullscreen: string; exit: string; open: string };
const DEFAULT: FigmaLabels = { fullscreen: "Full screen", exit: "Exit full screen", open: "Open in Figma" };

export default function FigmaEmbed({ url, title, labels = DEFAULT }: { url: string; title: string; labels?: FigmaLabels }) {
  const src = figmaEmbedUrl(url);
  const open = figmaOpenUrl(url);
  const box = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  if (!src) return null;

  const toggle = () => {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el.requestFullscreen) void el.requestFullscreen();
    else if (open) window.open(open, "_blank", "noopener,noreferrer"); // sin API (p. ej. iPhone): abre Figma
  };

  return (
    <div className="figma-wrap">
      <div className="figma-bar">
        <button type="button" className="figma-btn" onClick={toggle} aria-pressed={full}>
          {full ? labels.exit : labels.fullscreen}
        </button>
        {open && (
          <a className="figma-btn" href={open} target="_blank" rel="noopener noreferrer">{labels.open} ↗</a>
        )}
      </div>
      <div className="figma-embed" ref={box}>
        <iframe src={src} title={title} loading="lazy" allow="fullscreen" allowFullScreen />
      </div>
    </div>
  );
}
