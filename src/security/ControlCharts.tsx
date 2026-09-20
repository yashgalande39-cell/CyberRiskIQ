import { useId, useState } from 'react';
import { effectivenessDistribution } from './data';
import { ProgressBar } from './UI';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const series = [
  { name: 'Overall', color: '#2f93ff', values: [40, 47, 53, 59, 64, 70, 76, 74, 73, 78, 80, 78] },
  { name: 'Deployed', color: '#00d6ae', values: [20, 26, 30, 36, 40, 44, 48, 51, 56, 58, 61, 64] },
  { name: 'Target', color: '#a4dcf5', values: [27, 35, 42, 45, 49, 54, 57, 58, 60, 64, 68, 72] },
];

export function CoverageChart() {
  const id = useId();
  const [hover, setHover] = useState(11);
  const [hidden, setHidden] = useState<string[]>([]);
  const left = 42; const right = 476; const top = 20; const bottom = 170;
  const x = (index: number) => left + index * (right - left) / 11;
  const y = (value: number) => bottom - (bottom - top) * value / 100;
  return <div className="coverage-chart">
    <div className="chart-legend"><span className="coverage-caption">Coverage %</span>{series.map((item) => <button key={item.name} className={hidden.includes(item.name) ? 'is-muted' : ''} aria-pressed={!hidden.includes(item.name)} onClick={() => setHidden((current) => current.includes(item.name) ? current.filter((name) => name !== item.name) : [...current, item.name])}><i className={item.name === 'Target' ? 'legend-dash' : ''} style={{ background: item.color }} />{item.name}</button>)}</div>
    <svg viewBox="0 0 500 197" preserveAspectRatio="none" aria-label="Control coverage grew from 40 percent in January to 78 percent in December 2024" role="img">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#038eff" stopOpacity=".08" /><stop offset="1" stopColor="#038eff" stopOpacity="0" /></linearGradient></defs>
      {[0, 20, 40, 60, 80, 100].map((tick) => <g key={tick}><line x1={left} x2={right + 12} y1={y(tick)} y2={y(tick)} className="sc-chart-grid" /><text x={left - 8} y={y(tick) + 4} textAnchor="end" className="sc-chart-label">{tick}%</text></g>)}
      {months.map((month, index) => <g key={month}><line x1={x(index)} x2={x(index)} y1={top} y2={bottom} className="sc-chart-grid" /><text x={x(index)} y={191} textAnchor="middle" className="sc-chart-label">{month}</text></g>)}
      {!hidden.includes('Overall') && <path d={`${series[0].values.map((value, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(value)}`).join(' ')} L ${right} ${bottom} L ${left} ${bottom} Z`} fill={`url(#${id})`} />}
      {[...series].reverse().filter((item) => !hidden.includes(item.name)).map((item) => <g key={item.name}><path d={item.values.map((value, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(value)}`).join(' ')} fill="none" stroke={item.color} strokeWidth={item.name === 'Target' ? 1.2 : 1.8} strokeDasharray={item.name === 'Target' ? '4 3' : undefined} className="coverage-line" />{item.values.map((value, index) => <circle key={index} cx={x(index)} cy={y(value)} r={item.name === 'Target' ? 3 : 3.8} fill={item.color} stroke="#002335" strokeWidth=".7" />)}</g>)}
      <line x1={left} x2={right + 14} y1={bottom} y2={bottom} className="sc-chart-axis" />
      {months.map((month, index) => <rect key={month} x={x(index) - 14} y={top} width={28} height={bottom - top} fill="transparent" tabIndex={0} role="button" aria-label={`${month} 2024: ${series[0].values[index]} percent coverage`} onMouseEnter={() => setHover(index)} onFocus={() => setHover(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setHover(index); }} />)}
    </svg>
    <div className="coverage-tooltip" style={{ left: `${Math.min(87, 5 + hover * 7.4)}%` }}><span>{months[hover]} 2024</span><strong>{series[0].values[hover]}%</strong></div>
  </div>;
}

export function EffectivenessChart({ total, onFilter }: { total: number; onFilter: (value: string) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return <div className="effectiveness-chart"><svg viewBox="0 0 130 130" aria-label="Control effectiveness distribution" role="img">
    <circle cx="65" cy="65" r={radius} fill="none" stroke="#07364b" strokeWidth="22" />
    {effectivenessDistribution.map((item, index) => {
      const start = offset;
      offset += item.value;
      return <circle key={item.label} cx="65" cy="65" r={radius} fill="none" stroke={item.color} strokeWidth={hover === index ? 25 : 22} strokeDasharray={`${item.value / 100 * circumference - .8} ${circumference}`} transform={`rotate(${-90 + start * 3.6} 65 65)`} role="button" tabIndex={0} aria-label={`Filter ${item.label}: ${item.value}%`} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(index)} onBlur={() => setHover(null)} onClick={() => onFilter(item.filter)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onFilter(item.filter); }} />;
    })}
    <text x="65" y="65" className="effectiveness-total" textAnchor="middle">{total}</text><text x="65" y="83" className="effectiveness-label" textAnchor="middle">Controls</text>
  </svg><ul className="effectiveness-legend">{effectivenessDistribution.map((item, index) => <li key={item.label}><button onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} onClick={() => onFilter(item.filter)} className={hover === index ? 'is-active' : ''}><i style={{ background: item.color }} /><span>{item.label}</span><b>{item.value}%</b></button></li>)}</ul></div>;
}

export function HorizontalBars({ data, onSelect, className = '' }: { data: { label: string; value: number; color: string; key?: string }[]; onSelect: (value: string) => void; className?: string }) {
  return <div className={`sc-horizontal-bars ${className}`}>{data.map((item) => <button key={item.label} onClick={() => onSelect(item.key || item.label)} aria-label={`Filter ${item.label}, ${item.value}% coverage`}><span>{item.label}</span><ProgressBar value={item.value} color={`linear-gradient(90deg, ${item.color}, ${item.color}e0)`} label={item.label} /><b>{item.value}%</b></button>)}</div>;
}