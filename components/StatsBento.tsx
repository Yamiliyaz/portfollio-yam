import type { Stat } from "@/lib/metrics";

// Figma "Key metrics — stats bento": una cifra protagonista, una con tendencia y hasta dos de apoyo.
// Con 3 cifras la última ocupa todo el ancho. Colores: tokens --sb-* (Light/Dark).

function Trend({ from, to }: { from: number; to: number }) {
  const max = Math.max(from, to);
  const h = (n: number) => Math.max(8, Math.round((n / max) * 64));
  const fmt = (n: number) => n.toLocaleString("en-US");
  return (
    <div className="sb-trend" aria-hidden="true">
      <span><i style={{ height: h(from) }} />{fmt(from)}</span>
      <span><i style={{ height: h(to) }} />{fmt(to)}</span>
    </div>
  );
}

function Small({ s, icon }: { s: Stat; icon?: boolean }) {
  return (
    <li className={icon ? "sb-c" : "sb-b"}>
      {icon && (
        <span className="sb-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.8 14.2L14.2 5.8M6.7 5.8h7.5v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      )}
      <div>
        <strong>{s.value}</strong>
        <span className="sb-label">{s.label}</span>
        {s.detail && <span className="sb-detail">{s.detail}</span>}
      </div>
    </li>
  );
}

export default function StatsBento({ stats, label }: { stats: Stat[]; label: string }) {
  const [hero, a, b, c] = stats;
  return (
    <div className="sb-wrap">
    <ul className={`sb sb-${c ? 4 : 3}`} aria-label={label}>
      <li className="sb-hero">
        <div>
          <span className="sb-chip">{hero.label}</span>
          <strong>{hero.value}</strong>
        </div>
        {hero.detail && <p>{hero.detail}</p>}
      </li>
      <li className="sb-right">
        <ul>
          <li className="sb-a">
            <div>
              <strong>{a.value}</strong>
              <span className="sb-label">{a.label}</span>
              {a.detail && <span className="sb-detail">{a.detail}</span>}
            </div>
            {a.trend && <Trend from={a.trend[0]} to={a.trend[1]} />}
          </li>
          <Small s={b} />
          {c && <Small s={c} icon />}
        </ul>
      </li>
    </ul>
    </div>
  );
}
