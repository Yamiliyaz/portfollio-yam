/** Paleta por empresa + ícono por nivel: sirve de tarjeta y de imagen destacada cuando no hay imagen. */
export const PALETTE: [RegExp, { accent: string; from: string; to: string }][] = [
  [/aviva/i, { accent: "#5B4FE8", from: "#efedff", to: "#dcd8fb" }],
  [/konf[ií]o/i, { accent: "#E8561F", from: "#fff0e8", to: "#ffd9c7" }],
  [/citibanamex|banamex|bancanet/i, { accent: "#003DA5", from: "#e8f0ff", to: "#cfdffb" }],
];
const FALLBACK = { accent: "#475467", from: "#f2f4f7", to: "#e4e7ec" };
export const palette = (company: string) => PALETTE.find(([re]) => re.test(company))?.[1] ?? FALLBACK;

const ICONS: Record<string, string[]> = {
  // Layers / Flag / Sparkles (trazos estilo Lucide, 24x24)
  Proyecto: ["M12 3 3 8l9 5 9-5-9-5Z", "m3 13 9 5 9-5", "m3 17.5 9 5 9-5"],
  Iniciativa: ["M5 21V4", "M5 4h12l-2 4 2 4H5"],
  Feature: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "M19 16v4", "M17 18h4"],
};

export function LevelIcon({ level, className = "wg-icon" }: { level: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(ICONS[level] ?? ICONS.Proyecto).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
