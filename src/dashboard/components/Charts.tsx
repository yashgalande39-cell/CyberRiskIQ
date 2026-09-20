import { useState } from 'react';

type Series = { name: string; color: string; values: number[]; dashed?: boolean; area?: boolean };

/* ---------- Risk trend line chart ---------- */
export function TrendChart({ labels, series, max = 100 }: { labels: string[]; series: Series[]; max?: number }) {
  const w = 700; const h = 240; const l = 40; const r = 46; const t = 16; const b = 30;
  const [hover, setHover] = useState<number | null>(null);
  const x = (i: number) => l + (i * (w - l - r)) / Math.max(1, labels.length - 1);
  const y = (v: number) => t + (1 - v / max) * (h - t - b);
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="chart-svg" role="img" aria-label="Risk score trend">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={l} x2={w - r} y1={y(tick)} y2={y(tick)} className="grid-line" />
            <text x={l - 8} y={y(tick) + 3.5} className="axis-text" textAnchor="end">{tick}</text>
          </g>
        ))}
        {series.map((s) => {
          const line = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
          const area = `${line} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
          return (
            <g key={s.name}>
              {s.area && <path d={area} fill={s.color} opacity="0.09" />}
              <path d={line} fill="none" stroke={s.color} strokeWidth="2.4" strokeDasharray={s.dashed ? '5 5' : undefined} strokeLinecap="round" strokeLinejoin="round" />
              {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 4.6 : 3} fill="#08101d" stroke={s.color} strokeWidth="2" />)}
            </g>
          );
        })}
        {labels.map((label, i) => <text key={label} x={x(i)} y={h - 8} className="axis-text" textAnchor="middle">{label}</text>)}
        {series.map((s) => (
          <g key={`${s.name}-tag`}>
            <rect x={x(s.values.length - 1) + 8} y={y(s.values[s.values.length - 1]) - 10} rx="4" width="32" height="20" fill={s.color} />
            <text x={x(s.values.length - 1) + 24} y={y(s.values[s.values.length - 1]) + 4} textAnchor="middle" className="tag-text">{s.values[s.values.length - 1]}</text>
          </g>
        ))}
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={t} y2={h - b} className="crosshair" />}
        {labels.map((_, i) => <rect key={i} x={x(i) - (w - l - r) / (2 * Math.max(1, labels.length - 1))} y={0} width={(w - l - r) / Math.max(1, labels.length - 1)} height={h} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />)}
      </svg>
      {hover !== null && (
        <div className="chart-tip" style={{ left: `${(x(hover) / w) * 100}%` }}>
          <strong>{labels[hover]}</strong>
          {series.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}: <b>{s.values[hover]}</b></span>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Donut chart ---------- */
export function DonutChart({ data, total, centerLabel }: { data: { label: string; value: number; color: string }[]; total: number; centerLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const radius = 62; const circ = 2 * Math.PI * radius; let offset = 0;
  return (
    <div className="donut-row">
      <div className="donut-holder">
        <svg viewBox="0 0 160 160" className="donut-svg" role="img" aria-label="Risks by asset category">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#0f1728" strokeWidth="19" />
          {data.map((item, i) => {
            const len = (item.value / 100) * circ;
            const dash = `${Math.max(0, len - 2.5)} ${circ - Math.max(0, len - 2.5)}`;
            const rotation = -90 + (offset / circ) * 360;
            offset += len;
            const active = hover === i;
            return (
              <circle key={item.label} cx="80" cy="80" r={radius} fill="none" stroke={item.color} strokeWidth={active ? 23 : 19} strokeDasharray={dash} strokeLinecap="butt"
                transform={`rotate(${rotation} 80 80)`} className="donut-seg" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            );
          })}
          <text x="80" y="76" textAnchor="middle" className="donut-value">{total.toLocaleString('en-IN')}</text>
          <text x="80" y="94" textAnchor="middle" className="donut-label">{centerLabel}</text>
        </svg>
      </div>
      <ul className="legend-list">
        {data.map((item, i) => (
          <li key={item.label} className={hover === i ? 'active' : ''} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <i style={{ background: item.color }} /><span>{item.label}</span><b>{item.value}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Risk heatmap ---------- */
export function heatColor(value: number, max: number) {
  if (value === 0) return '#0b1220';
  const ratio = Math.min(1, value / max);
  const stops = ['#1e6fd9', '#0e9f9f', '#1faa52', '#a3a70f', '#e07b12', '#dc2b2b'];
  return stops[Math.min(stops.length - 1, Math.floor(ratio * stops.length))];
}

export function Heatmap({ rows, cols }: { rows: { label: string; values: number[] }[]; cols: string[] }) {
  const max = Math.max(...rows.flatMap((r) => r.values));
  const [cell, setCell] = useState<{ r: number; c: number } | null>(null);
  return (
    <div className="hm">
      <div className="hm-grid" style={{ gridTemplateColumns: `auto repeat(${cols.length}, 1fr)` }}>
        <span />
        {cols.map((col) => <span key={col} className="hm-col">{col}</span>)}
        {rows.map((row, r) => (
          <div key={row.label} className="hm-row-cells" style={{ display: 'contents' }}>
            <span className="hm-row">{row.label}</span>
            {row.values.map((value, c) => (
              <button key={`${r}-${c}`} className="hm-cell" style={{ background: heatColor(value, max) }}
                onMouseEnter={() => setCell({ r, c })} onMouseLeave={() => setCell(null)}
                aria-label={`${row.label} likelihood, ${cols[c]} impact: ${value} risks`}>{value}</button>
            ))}
          </div>
        ))}
      </div>
      <p className="hm-axis">Impact</p>
      {cell && (
        <div className="hm-tip" role="status">
          <b>{rows[cell.r].values[cell.c]} risks</b>
          <span>Likelihood {rows[cell.r].label} · Impact {cols[cell.c]}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Progress ring ---------- */
export function ProgressRing({ value, color, size = 62 }: { value: number; color: string; size?: number }) {
  const radius = 25; const circ = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} role="img" aria-label={`${value}% complete`}>
      <circle cx="30" cy="30" r={radius} fill="none" stroke="#152036" strokeWidth="5.5" />
      <circle cx="30" cy="30" r={radius} fill="none" stroke={color} strokeWidth="5.5" strokeLinecap="round"
        strokeDasharray={`${(value / 100) * circ} ${circ}`} transform="rotate(-90 30 30)" />
      <text x="30" y="34" textAnchor="middle" className="ring-text" fill={color}>{value}%</text>
    </svg>
  );
}

/* ---------- AI forecast chart ---------- */
export function ForecastChart({ labels, series }: { labels: string[]; series: Series[] }) {
  const w = 250; const h = 130; const l = 24; const r = 8; const t = 10; const b = 20;
  const max = 100;
  const x = (i: number) => l + (i * (w - l - r)) / Math.max(1, labels.length - 1);
  const y = (v: number) => t + (1 - v / max) * (h - t - b);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="forecast-svg" role="img" aria-label="AI risk forecast">
      {[0, 25, 50, 75, 100].map((tick) => <line key={tick} x1={l} x2={w - r} y1={y(tick)} y2={y(tick)} className="grid-line thin" />)}
      {[0, 25, 50, 75, 100].map((tick) => <text key={tick} x={l - 5} y={y(tick) + 3} className="axis-text tiny" textAnchor="end">{tick}</text>)}
      {series.map((s) => {
        const line = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
        return (
          <g key={s.name}>
            {s.area && <path d={`${line} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={s.color} opacity="0.12" />}
            <path d={line} fill="none" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? '4 4' : undefined} strokeLinecap="round" />
            {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.4" fill={s.color} />)}
          </g>
        );
      })}
      {labels.map((label, i) => <text key={label} x={x(i)} y={h - 5} className="axis-text tiny" textAnchor={i === 0 ? 'start' : 'middle'}>{label}</text>)}
    </svg>
  );
}

/* ---------- Generic horizontal bars ---------- */
export function FactorBars({ items }: { items: { label: string; value: number; color: string }[] }) {
  return (
    <ul className="factor-list">
      {items.map((item) => (
        <li key={item.label}>
          <span className="factor-label">{item.label}</span>
          <span className="factor-track"><span className="factor-fill" style={{ width: `${item.value}%`, background: item.color }} /></span>
          <span className="factor-value">{item.value}%</span>
        </li>
      ))}
    </ul>
  );
}
