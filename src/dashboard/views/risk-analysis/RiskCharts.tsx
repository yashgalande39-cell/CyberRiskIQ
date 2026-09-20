import { useId, useState } from 'react';
import { categories } from './risk-data';

function arcPath(cx: number, cy: number, radius: number, start: number, end: number) {
  const point = (angle: number) => [cx + radius * Math.cos(angle * Math.PI / 180), cy + radius * Math.sin(angle * Math.PI / 180)];
  const a = point(start);
  const b = point(end);
  return `M ${a[0]} ${a[1]} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${b[0]} ${b[1]}`;
}

export function RiskGauge({ value = 72, small = false }: { value?: number; small?: boolean }) {
  const id = useId().replace(/:/g, '');
  if (small) {
    return (
      <div className="model-score-ring">
        <svg viewBox="0 0 90 90" role="img" aria-label={`Risk score: ${value} out of 100`}>
          <defs><linearGradient id={id}><stop stopColor="#722139" /><stop offset="1" stopColor="#ff4c5e" /></linearGradient></defs>
          <circle cx="45" cy="45" r="36" fill="none" stroke="#562437" strokeWidth="7" />
          <circle className="ring-reveal" cx="45" cy="45" r="36" fill="none" stroke={`url(#${id})`} strokeWidth="7" pathLength="100" strokeDasharray={`${value} 100`} transform="rotate(-90 45 45)" />
          <text x="45" y="48" textAnchor="middle" dominantBaseline="middle" className="model-ring-value">{value}</text>
        </svg>
        <span>Risk Score</span><span>(out of 100)</span>
      </div>
    );
  }
  return (
    <div className="organization-gauge">
      <svg viewBox="0 0 158 150" role="img" aria-label={`Organization risk score: ${value} out of 100, high risk`}>
        <defs>
          <linearGradient id={id} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ff445b" /><stop offset=".55" stopColor="#ff4e61" /><stop offset="1" stopColor="#fc303f" /></linearGradient>
          <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.3" /></filter>
        </defs>
        <path d={arcPath(79, 76, 64, 138, 402)} fill="none" stroke="#602338" strokeWidth="12" />
        <path d={arcPath(79, 76, 64, 138, 138 + 264 * value / 100)} fill="none" stroke="#ff354b" strokeWidth="12" opacity=".25" filter={`url(#${id}-glow)`} />
        <path className="gauge-reveal" d={arcPath(79, 76, 64, 138, 138 + 264 * value / 100)} fill="none" stroke={`url(#${id})`} strokeWidth="12" strokeLinecap="butt" pathLength="100" />
        <text x="75" y="77" textAnchor="end" className="gauge-value">{value}</text>
        <text x="81" y="77" className="gauge-out-of">/ 100</text>
      </svg>
      <span className="high-risk-label">High Risk</span>
    </div>
  );
}

export function ConfidenceRing() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="confidence-ring" viewBox="0 0 112 112" role="img" aria-label="81 percent data confidence">
      <defs><linearGradient id={id} x1="1" y1="0" x2="0" y2="1"><stop stopColor="#00aef7" /><stop offset=".5" stopColor="#00bad9" /><stop offset="1" stopColor="#00d5b8" /></linearGradient></defs>
      <circle cx="56" cy="56" r="45" stroke="#223d53" strokeWidth="10" fill="none" />
      <circle className="ring-reveal" cx="56" cy="56" r="45" stroke={`url(#${id})`} strokeWidth="10" fill="none" pathLength="100" strokeDasharray="81 100" transform="rotate(-90 56 56)" />
      <path d="M56 6V16 M7 45L17 47" stroke="#001320" strokeWidth="1" />
      <text x="56" y="59" textAnchor="middle" className="confidence-value">81%</text>
      <text x="56" y="76" textAnchor="middle" className="confidence-caption">Confidence</text>
    </svg>
  );
}

export function RiskTrend() {
  const [shown, setShown] = useState({ current: true, target: true });
  const [hovered, setHovered] = useState<number | null>(null);
  const id = useId().replace(/:/g, '');
  const current = [42, 49, 55, 61, 65, 67];
  const target = [33, 35, 37, 39, 39, 40];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const x = (index: number) => 31 + index * 44;
  const y = (value: number) => 117 - value * 1.06;
  const path = (values: number[]) => values.map((value, index) => `${index ? 'L' : 'M'}${x(index)},${y(value)}`).join(' ');
  return (
    <div className="trend-chart">
      <div className="trend-legend">
        <button className={!shown.current ? 'muted-series' : ''} onClick={() => setShown((previous) => ({ ...previous, current: !previous.current }))} aria-pressed={shown.current}><i style={{ background: '#ff354b' }} />Current Risk</button>
        <button className={!shown.target ? 'muted-series' : ''} onClick={() => setShown((previous) => ({ ...previous, target: !previous.target }))} aria-pressed={shown.target}><i style={{ background: '#00a9f3' }} />Target Risk</button>
      </div>
      <svg viewBox="0 0 286 144" role="img" aria-label="Current and target risk trend from January to June">
        <defs>
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ff334a" stopOpacity=".12" /><stop offset="1" stopColor="#ff334a" stopOpacity="0" /></linearGradient>
          <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2" /></filter>
        </defs>
        {[0, 20, 40, 60, 80, 100].map((value) => <g key={value}><line x1="31" x2="259" y1={y(value)} y2={y(value)} className="chart-grid-line" /><text x="18" y={y(value) + 3.5} textAnchor="end" className="chart-tick">{value}</text></g>)}
        {months.map((month, index) => <g key={month}><line x1={x(index)} x2={x(index)} y1="11" y2="117" className="chart-grid-line" /><text x={x(index)} y="137" textAnchor="middle" className="chart-tick">{month}</text></g>)}
        <path d="M31 11V117H259" className="chart-axis" />
        {shown.current && <g>
          <path d={`${path(current)} L${x(5)},117 L31,117 Z`} fill={`url(#${id}-area)`} />
          <path d={path(current)} fill="none" stroke="#ff3b4b" strokeWidth="1.8" />
          {current.map((value, index) => <g key={index}><circle cx={x(index)} cy={y(value)} r="5" fill="#ff354b" opacity=".27" filter={`url(#${id}-glow)`} /><circle cx={x(index)} cy={y(value)} r="3.3" fill="#ff4e57" stroke="#ff7d7c" strokeWidth=".65" /></g>)}
          <path d="M251 46L260 39" stroke="#ff354b" strokeWidth="1.4" /><rect x="260" y="23" width="25" height="22" rx="3" fill="#ff263e" /><text x="272.5" y="38" textAnchor="middle" className="trend-tag">72</text>
        </g>}
        {shown.target && <g>
          <path d={path(target)} fill="none" stroke="#00aaff" strokeWidth="1.7" />
          {target.map((value, index) => <circle key={index} cx={x(index)} cy={y(value)} r="3.2" fill="#00aafa" stroke="#35c0ff" strokeWidth=".6" />)}
          <path d="M251 75L260 68" stroke="#008dff" strokeWidth="1.4" /><rect x="260" y="53" width="25" height="22" rx="3" fill="#0089ff" /><text x="272.5" y="68" textAnchor="middle" className="trend-tag">45</text>
        </g>}
        {months.map((month, index) => <rect key={month} x={x(index) - 17} y="11" width="34" height="107" fill="transparent" onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}><title>{`${month}: current ${current[index]}, target ${target[index]}`}</title></rect>)}
        {hovered !== null && <g pointerEvents="none"><rect x={Math.min(x(hovered) - 20, 176)} y="12" width="84" height="31" rx="3" fill="#06283a" stroke="#08608b" /><text x={Math.min(x(hovered) - 13, 183)} y="24" className="chart-tick">{months[hovered]} risk: {current[hovered]}</text><text x={Math.min(x(hovered) - 13, 183)} y="37" className="chart-tick">Target: {target[hovered]}</text></g>}
      </svg>
    </div>
  );
}

export function CategoryDonut({ onSelect }: { onSelect: (category: string) => void }) {
  const order = [0, 1, 2, 4, 3, 5, 6];
  let accumulated = 0;
  return (
    <svg className="category-donut" viewBox="0 0 152 152" role="img" aria-label="Average risk 72, broken down by asset category">
      {order.map((index) => {
        const category = categories[index];
        const offset = -accumulated;
        accumulated += category.share;
        return <circle key={category.name} className="donut-segment" cx="76" cy="76" r="57" fill="none" stroke={category.color} strokeWidth="22" pathLength="100" strokeDasharray={`${category.share - .18} 100`} strokeDashoffset={offset} transform="rotate(-90 76 76)" onClick={() => onSelect(category.name)} tabIndex={0} role="button" aria-label={`${category.name}, risk ${category.value}`} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(category.name); }}><title>{category.name}: {category.value}</title></circle>;
      })}
      <text x="76" y="80" textAnchor="middle" className="category-score">72</text>
      <text x="76" y="99" textAnchor="middle" className="category-score-caption">Avg Risk</text>
    </svg>
  );
}

const heatPoints = [
  [63, 12, 4.8, 'Critical'], [85, 20, 5.2, 'Critical'], [55, 34, 3.5, 'Critical'], [63, 34, 4.1, 'Critical'], [79, 35, 4.2, 'Critical'], [74, 44, 4.1, 'Critical'],
  [55, 57, 3.3, 'High'], [63, 57, 4, 'High'], [79, 59, 3.2, 'High'], [63, 72, 4.4, 'High'], [59, 79, 3.1, 'High'],
  [41, 16, 3, 'Medium'], [37, 35, 4.4, 'Medium'], [37, 48, 3.8, 'Medium'], [44, 48, 3.8, 'Medium'], [41, 63, 4, 'Medium'], [48, 79, 3.5, 'Medium'],
  [16, 35, 4.9, 'Low'], [20, 56, 3.3, 'Low'], [13, 71, 4.4, 'Low'], [20, 78, 3.3, 'Low'], [27, 72, 4.3, 'Low'], [34, 82, 4.8, 'Low'],
] as const;

const heatLegend = [{ name: 'Critical', count: 12, color: '#ff354b' }, { name: 'High', count: 28, color: '#ff843f' }, { name: 'Medium', count: 34, color: '#ffcf42' }, { name: 'Low', count: 18, color: '#00d9b4' }];

export function RiskHeatmap() {
  const [selected, setSelected] = useState<string | null>(null);
  const id = useId().replace(/:/g, '');
  return (
    <div className="heatmap-layout">
      <svg className="heatmap-chart" viewBox="0 0 421 153" role="img" aria-label="Risk heatmap showing likelihood versus impact">
        <defs>
          <linearGradient id={`${id}-field`}><stop stopColor="#00cbaa" stopOpacity=".035" /><stop offset=".29" stopColor="#00b493" stopOpacity=".1" /><stop offset=".3" stopColor="#ddac36" stopOpacity=".13" /><stop offset=".57" stopColor="#d2832c" stopOpacity=".16" /><stop offset=".58" stopColor="#ff5546" stopOpacity=".13" /><stop offset="1" stopColor="#ff4e56" stopOpacity=".09" /></linearGradient>
          <linearGradient id={`${id}-vertical`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a71939" stopOpacity=".09" /><stop offset="1" stopColor="#00b7a6" stopOpacity=".035" /></linearGradient>
          <radialGradient id={`${id}-warm`}><stop stopColor="#f6a937" stopOpacity=".25" /><stop offset="1" stopColor="#f6a937" stopOpacity="0" /></radialGradient>
          <filter id={`${id}-glow`}><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <rect x="74" y="3" width="323" height="110" fill={`url(#${id}-field)`} />
        <rect x="74" y="3" width="323" height="110" fill={`url(#${id}-vertical)`} />
        <ellipse cx="238" cy="68" rx="111" ry="65" fill={`url(#${id}-warm)`} />
        {[0, 1, 2, 3, 4].map((value) => <g key={value}><line x1={74 + value * 80.75} x2={74 + value * 80.75} y1="3" y2="113" className="heat-grid" /><line x1="74" x2="397" y1={3 + value * 27.5} y2={3 + value * 27.5} className="heat-grid" /></g>)}
        <path d="M74 3V113H397" className="chart-axis" />
        {['Critical', 'High', 'Medium', 'Low'].map((name, index) => <text key={name} x="65" y={22 + index * 27.5} textAnchor="end" className="heat-label">{name}</text>)}
        {['Low', 'Medium', 'High', 'Critical'].map((name, index) => <text key={name} x={120 + index * 76} y="130" textAnchor="middle" className="heat-label">{name}</text>)}
        <text x="236" y="147" textAnchor="middle" className="heat-label">Likelihood</text>
        <text transform="translate(13 65) rotate(-90)" textAnchor="middle" className="heat-label">Impact</text>
        {heatPoints.map(([px, py, radius, severity], index) => {
          const color = heatLegend.find((item) => item.name === severity)!.color;
          const cx = 74 + px * 3.23;
          const cy = 3 + py * 1.1;
          return <g key={index} opacity={selected && selected !== severity ? .13 : 1} className="heat-point"><circle cx={cx} cy={cy} r={radius * 2} fill={color} opacity=".25" filter={`url(#${id}-glow)`} /><circle cx={cx} cy={cy} r={radius} fill={color} stroke={color} strokeWidth=".5"><title>{severity} risk: likelihood {px}%, impact {100 - py}%</title></circle></g>;
        })}
      </svg>
      <div className="heatmap-legend">
        {heatLegend.map((item) => <button key={item.name} className={selected && selected !== item.name ? 'muted-series' : ''} onClick={() => setSelected(selected === item.name ? null : item.name)} aria-pressed={selected === item.name}><i style={{ background: item.color }} />{item.name} ({item.count})</button>)}
      </div>
    </div>
  );
}
