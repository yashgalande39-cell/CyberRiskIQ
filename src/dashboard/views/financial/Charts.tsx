import { useId, useState } from 'react';
import { businessUnits, categories, compactMoney, rupee, type Asset } from './data';

interface ChartProps {
  factor?: number;
}

export function BusinessChart({ factor = 1, mode = 'Total ALE', onSelect }: ChartProps & { mode?: string; onSelect?: (unit: string) => void }) {
  const id = useId().replace(/:/g, '');
  const [hovered, setHovered] = useState<string | null>(null);
  const multiplier = mode === 'Asset Value' ? 10 : mode === 'Average SLE' ? 0.4 : 1;
  return (
    <div className="chart-wrap business-chart">
      <svg viewBox="0 0 460 146" role="img" aria-label="Annual financial exposure by business unit">
        <defs>
          {businessUnits.map((unit, index) => (
            <linearGradient id={`${id}-bar-${index}`} key={unit.name} x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor={unit.color} />
              <stop offset="100%" stopColor={unit.color} stopOpacity="0.64" />
            </linearGradient>
          ))}
        </defs>
        {[0, 0.5, 1, 1.5, 2, 2.5].map((tick) => {
          const y = 123 - tick * 44;
          return <g key={tick}><line className="chart-grid" x1="39" x2="451" y1={y} y2={y} /><text className="chart-label" x="30" y={y + 3} textAnchor="end">{tick === 0 ? '0' : `${(tick * multiplier).toFixed(1)} Cr`}</text></g>;
        })}
        <line className="chart-axis" x1="39" x2="39" y1="13" y2="123" />
        <line className="chart-axis" x1="39" x2="451" y1="123" y2="123" />
        {businessUnits.map((unit, index) => {
          const x = 52 + index * 68;
          const height = unit.value * factor * 44;
          return (
            <g key={unit.name} className="bar-group" tabIndex={0} role="button" aria-label={`${unit.name}: ${compactMoney(unit.value * factor * multiplier)}. View assets`} onClick={() => onSelect?.(unit.name)} onKeyDown={(event) => event.key === 'Enter' && onSelect?.(unit.name)} onMouseEnter={() => setHovered(unit.name)} onMouseLeave={() => setHovered(null)}>
              <line className="chart-grid" x1={x + 20} x2={x + 20} y1="13" y2="123" />
              <rect className="chart-bar" x={x} y={123 - height} width="42" height={height} rx="2" fill={`url(#${id}-bar-${index})`} stroke={unit.color} strokeWidth="0.6" style={{ animationDelay: `${index * 70}ms`, filter: hovered === unit.name ? `drop-shadow(0 0 5px ${unit.color})` : undefined }} />
              <text className="bar-value" x={x + 21} y={115 - height} textAnchor="middle">{rupee} {(unit.value * factor * multiplier).toFixed(1)} Cr</text>
              <text className="chart-label unit-label" x={x + 21} y="140" textAnchor="middle">{unit.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const trendData = [
  { name: 'Best Case', color: '#00d8b6', values: [0.55, 0.7, 0.85, 0.96, 1.13, 1.26, 1.36, 1.46, 1.62, 1.78, 1.87, 1.9], label: '1.9 Cr' },
  { name: 'Most Likely', color: '#168dff', values: [2.6, 3.15, 3.5, 3.65, 3.9, 4.18, 4.3, 4.48, 4.63, 4.8, 4.8, 4.8], label: '4.8 Cr' },
  { name: 'Worst Case', color: '#ff415b', values: [6.15, 7.9, 9.0, 9.25, 10.15, 11.15, 11.05, 11.55, 11.75, 12.65, 12.65, 12.6], label: '12.6 Cr' },
];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function TrendChart({ factor = 1, period = 'Last 12 Months' }: ChartProps & { period?: string }) {
  const id = useId().replace(/:/g, '');
  const [hidden, setHidden] = useState<string[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const start = period === 'Last 6 Months' ? 6 : period === 'Last 3 Months' ? 9 : 0;
  const shownMonths = months.slice(start);
  const xFor = (index: number) => 37 + index * (373 / (shownMonths.length - 1));
  const yFor = (value: number) => 127 - value * factor * 5.75;
  return (
    <div className="trend-chart chart-wrap">
      <div className="chart-legend trend-legend">
        {trendData.map((series) => <button key={series.name} className={hidden.includes(series.name) ? 'legend-disabled' : ''} onClick={() => setHidden((current) => current.includes(series.name) ? current.filter((item) => item !== series.name) : [...current, series.name])}><i style={{ background: series.color }} />{series.name}</button>)}
      </div>
      <svg viewBox="0 0 460 151" role="img" aria-label="Twelve-month financial exposure trend for best, most likely, and worst cases" onMouseLeave={() => setHovered(null)}>
        <defs>{trendData.map((series, index) => <linearGradient key={series.name} id={`${id}-area-${index}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={series.color} stopOpacity="0.13" /><stop offset="100%" stopColor={series.color} stopOpacity="0" /></linearGradient>)}</defs>
        {[0, 5, 10, 15, 20].map((tick) => <g key={tick}><line className="chart-grid" x1="37" x2="451" y1={127 - tick * 5.75} y2={127 - tick * 5.75} /><text className="chart-label" x="27" y={131 - tick * 5.75} textAnchor="end">{tick === 0 ? '0' : `${tick} Cr`}</text></g>)}
        {shownMonths.map((month, index) => <g key={month}><line className="chart-grid" x1={xFor(index)} x2={xFor(index)} y1="12" y2="127" /><text className="chart-label" x={xFor(index)} y="146" textAnchor="middle">{month}</text></g>)}
        <line className="chart-axis" x1="37" x2="37" y1="12" y2="127" />
        <line className="chart-axis" x1="37" x2="451" y1="127" y2="127" />
        {trendData.map((series, seriesIndex) => {
          if (hidden.includes(series.name)) return null;
          const values = series.values.slice(start);
          const path = values.map((value, index) => `${index === 0 ? 'M' : 'L'}${xFor(index)},${yFor(value)}`).join(' ');
          const lastY = yFor(values[values.length - 1]);
          return <g key={series.name}>
            <path d={`${path} L410,127 L37,127 Z`} fill={`url(#${id}-area-${seriesIndex})`} />
            <path className="trend-line" d={path} fill="none" stroke={series.color} strokeWidth="1.6" pathLength="1" />
            {values.map((value, index) => <circle key={index} cx={xFor(index)} cy={yFor(value)} r={hovered === index ? 4.6 : 3.5} fill={series.color} stroke="#91dcff" strokeOpacity="0.4" strokeWidth="0.6" />)}
            <rect x="414" y={lastY - 13} width="43" height="20" rx="3" fill={series.color} />
            <text x="435.5" y={lastY + 1} textAnchor="middle" className={`trend-end-label ${seriesIndex === 0 ? 'dark-text' : ''}`}>{(values[values.length - 1] * factor).toFixed(1)} Cr</text>
          </g>;
        })}
        {hovered !== null && <line x1={xFor(hovered)} x2={xFor(hovered)} y1="12" y2="127" stroke="#b4eaff" strokeOpacity="0.4" strokeDasharray="3 3" />}
        {shownMonths.map((month, index) => <rect key={month} x={xFor(index) - 15} y="10" width="30" height="121" fill="transparent" onMouseEnter={() => setHovered(index)} />)}
      </svg>
      {hovered !== null && <div className="chart-tooltip" style={{ left: `${Math.min(73, 8 + hovered / (shownMonths.length - 1) * 68)}%` }}><strong>{shownMonths[hovered]} exposure</strong>{trendData.filter((series) => !hidden.includes(series.name)).map((series) => <span key={series.name}><i style={{ background: series.color }} />{series.name}<b>{compactMoney(series.values[start + hovered] * factor)}</b></span>)}</div>}
    </div>
  );
}

export function CategoryChart({ mode = 'ALE', large = false, factor = 1, onSelect }: { mode?: 'ALE' | 'SLE'; large?: boolean; factor?: number; onSelect?: (name: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  let accumulated = 0;
  const total = mode === 'ALE' ? 4.8 * factor : 18.4;
  const active = categories.find((category) => category.name === hovered);
  return (
    <div className={`category-chart ${large ? 'large' : ''}`}>
      <svg viewBox="0 0 138 173" role="img" aria-label="Financial exposure distribution by risk category">
        <g transform="rotate(-90 69 83)">
          {categories.map((category) => {
            const offset = accumulated;
            accumulated += category.percent;
            return <circle key={category.name} cx="69" cy="83" r="49" fill="none" stroke={category.color} strokeWidth={hovered === category.name ? 22 : 19} strokeDasharray={`${category.percent * 3.078 - 1.2} ${307.88 - category.percent * 3.078 + 1.2}`} strokeDashoffset={-offset * 3.078} className="donut-segment" onMouseEnter={() => setHovered(category.name)} onMouseLeave={() => setHovered(null)} onClick={() => onSelect?.(category.name)} />;
          })}
        </g>
        <text x="69" y="86" textAnchor="middle" className="donut-value">{rupee} {active ? (total * active.percent / 100).toFixed(2) : total.toFixed(1)} {mode === 'ALE' ? 'Cr' : 'L'}</text>
        <text x="69" y="103" textAnchor="middle" className="donut-caption">{active ? `${active.percent}% of total` : `Total ${mode}`}</text>
      </svg>
      <div className="category-legend">
        {categories.map((category, index) => <button key={category.name} className={hovered === category.name ? 'highlighted' : ''} onMouseEnter={() => setHovered(category.name)} onMouseLeave={() => setHovered(null)} onClick={() => onSelect?.(category.name)}><i style={{ background: category.color }} /><span><span className="category-name">{category.name}{(index === 0 || large) && <b>{category.percent}%</b>}</span><span className="category-amount">{index > 0 && !large ? `${category.percent}% ` : ''}({rupee} {(total * category.percent / 100).toFixed(2)} {mode === 'ALE' ? 'Cr' : 'L'})</span></span></button>)}
      </div>
    </div>
  );
}

const scatterPoints = [
  [6, 0.02], [11, 0.035], [12, 0.065], [12, 0.12], [16, 0.073], [17, 0.045], [20, 0.12], [22, 0.18], [25, 0.3], [27, 0.055],
  [29, 0.12], [30, 0.3], [30, 0.21], [30, 0.095], [36, 0.29], [36, 0.17], [38, 0.065], [39, 0.34], [40, 0.16], [41, 0.23], [42, 0.51], [45, 0.19], [46, 0.33], [46, 0.055], [49, 0.2], [51, 0.2],
  [52, 0.61], [53, 0.91], [62, 0.32], [62, 0.58], [62, 0.72], [62, 1.3], [72, 0.7], [72, 1.72], [82, 1.1], [82, 2.42], [92, 2.85],
];

export function ScatterChart({ assets, onSelect }: { assets: Asset[]; onSelect: (asset: Asset) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const xFor = (risk: number) => 45 + risk * 2.08;
  const yFor = (value: number) => 166 - ((Math.log10(value) + 2) / 3) * 140;
  const colors = ['#00cfb1', '#ffd04a', '#ff823e', '#ff3857'];
  return (
    <div className="scatter-chart chart-wrap">
      <svg viewBox="0 0 267 213" role="img" aria-label="Asset risk score compared to annualized financial loss">
        {[0.01, 0.1, 1, 10].map((value, index) => <g key={value}><line className="chart-grid" x1="45" x2="253" y1={yFor(value)} y2={yFor(value)} /><text className="chart-label" x="37" y={yFor(value) + 3} textAnchor="end">{['1 L', '10 L', '1 Cr', '10 Cr'][index]}</text></g>)}
        {[0, 20, 40, 60, 80, 100].map((risk) => <g key={risk}><line className="chart-grid" x1={xFor(risk)} x2={xFor(risk)} y1="26" y2="166" /><text className="chart-label" x={xFor(risk)} y="184" textAnchor="middle">{risk}</text></g>)}
        <line className="chart-axis" x1="45" x2="45" y1="26" y2="166" /><line className="chart-axis" x1="45" x2="253" y1="166" y2="166" />
        <text className="chart-label axis-title" transform="translate(6 98) rotate(-90)" textAnchor="middle">Annualized Loss ({rupee})</text>
        <text className="chart-label axis-title" x="150" y="201" textAnchor="middle">Risk Score</text>
        {scatterPoints.map(([risk, loss], index) => {
          const color = colors[risk < 28 ? 0 : risk < 52 ? 1 : risk < 70 ? 2 : 3];
          return <circle key={index} cx={xFor(risk)} cy={yFor(loss)} r={risk < 52 ? 3.1 : 4.2} fill={color} stroke="#001623" strokeWidth="0.8" className="scatter-dot" style={{ animationDelay: `${index * 12}ms` }} onMouseEnter={() => setSelected(index)} onMouseLeave={() => setSelected(null)} onClick={() => onSelect(assets[Math.min(assets.length - 1, Math.floor((100 - risk) / 7))])}><title>Risk score: {risk}, annual loss: {compactMoney(loss)}</title></circle>;
        })}
        <g className="featured-dot" tabIndex={0} role="button" aria-label="View Payment Gateway" onClick={() => onSelect(assets[0])} onKeyDown={(event) => event.key === 'Enter' && onSelect(assets[0])}>
          <circle cx={xFor(75)} cy={yFor(5.3)} r="8.5" fill="#ff325b" fillOpacity="0.17" stroke="#ff4564" strokeOpacity="0.65" />
          <circle cx={xFor(75)} cy={yFor(5.3)} r="5.2" fill="#ff3c59" stroke="#ffc5cc" strokeWidth="1.2" />
          <circle cx={xFor(75)} cy={yFor(5.3)} r="2.1" fill="#ffdbe1" />
          <rect x="181" y="7" width="85" height="18" rx="3" fill="#351321" stroke="#fb4560" strokeWidth="0.8" />
          <text x="223.5" y="19" textAnchor="middle" className="scatter-feature-label">Payment Gateway</text>
          <path d="M207 25L202 33" stroke="#ff4966" strokeWidth="0.8" />
        </g>
      </svg>
      {selected !== null && <div className="chart-tooltip scatter-tooltip"><strong>Asset risk assessment</strong><span>Risk score<b>{scatterPoints[selected][0]} / 100</b></span><span>Annual loss<b>{compactMoney(scatterPoints[selected][1])}</b></span><small>Click to explore the asset</small></div>}
      <div className="chart-legend scatter-legend">{['Low', 'Medium', 'High', 'Critical'].map((name, index) => <span key={name}><i style={{ background: colors[index] }} />{name}</span>)}</div>
    </div>
  );
}
