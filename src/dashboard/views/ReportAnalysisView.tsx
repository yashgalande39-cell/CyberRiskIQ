import { useState } from 'react';
import '../../styles/reports.css';

export interface ReportAnalysisViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`report-card ${className}`}>{children}</div>;
}

function CheckDot({ color }: { color: string }) {
  return (
    <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill={color} />
      <path d="M5 8.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiskTrendChart() {
  const W = 460, H = 220;
  const l = 34, t = 12, r = 440, b = 188;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const risk = [65, 55, 52, 45, 42, 40];
  const industry = [75, 72, 70, 68, 65, 62];
  const yS = (v: number) => b - ((v - 0) / 100) * (b - t);
  const xS = (i: number) => l + (i / (months.length - 1)) * (r - l);
  const riskPath = risk.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i)},${yS(v)}`).join(' ');
  const indPath = industry.map((v, i) => `${i === 0 ? 'M' : 'L'}${xS(i)},${yS(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80, 100].map((g) => (
        <g key={g}>
          <line x1={l} y1={yS(g)} x2={r} y2={yS(g)} stroke="rgba(255,255,255,0.06)" />
          <text x={l - 6} y={yS(g) + 3} textAnchor="end" fill="#475569" fontSize="10" fontFamily="Inter">{g}</text>
        </g>
      ))}
      <line x1={l} y1={yS(0)} x2={r} y2={yS(0)} stroke="rgba(255,255,255,0.06)" />
      {months.map((m, i) => (
        <text key={m} x={xS(i)} y={b + 16} textAnchor="middle" fill="#475569" fontSize="10" fontFamily="Inter">{m}</text>
      ))}
      <path d={`${riskPath}L${xS(5)},${yS(0)}L${xS(0)},${yS(0)}Z`} fill="url(#riskFill)" />
      <path d={indPath} fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={riskPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      {risk.map((v, i) => (
        <circle key={i} cx={xS(i)} cy={yS(v)} r="3.5" fill="#0b1220" stroke="#3b82f6" strokeWidth="2" />
      ))}
      <rect x={xS(5) - 44} y={yS(risk[5]) - 32} width="62" height="24" rx="4" fill="#2563eb" />
      <text x={xS(5) - 13} y={yS(risk[5]) - 16} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Inter">72</text>
      <rect x={xS(5) - 44} y={yS(risk[5]) - 10} width="62" height="16" rx="0 0 4 4" fill="#1e40af" />
      <text x={xS(5) - 13} y={yS(risk[5]) + 1} textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="Inter">Jun 30, 2024</text>
    </svg>
  );
}

function VulnDonut() {
  const data = [
    { label: 'Critical', value: 204, pct: 16, color: '#ef4444' },
    { label: 'High', value: 318, pct: 26, color: '#f97316' },
    { label: 'Medium', value: 432, pct: 35, color: '#eab308' },
    { label: 'Low', value: 294, pct: 24, color: '#22c55e' },
  ];
  const r = 62, cx = 72, cy = 72, circ = 2 * Math.PI * r;
  let off = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[144px] w-[144px] flex-shrink-0">
        <svg viewBox="0 0 144 144" className="h-full w-full -rotate-90">
          {data.map((d) => {
            const dash = (d.pct / 100) * circ;
            const gap = circ - dash;
            const el = (
              <circle
                key={d.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth="18"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-off}
                strokeLinecap="butt"
              />
            );
            off += dash;
            return el;
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[20px] font-bold leading-none text-white">1,248</p>
          <p className="mt-0.5 text-[10px] text-slate-400">Total</p>
        </div>
      </div>
      <div className="space-y-1.5 text-[12px]">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: d.color }} />
            <span className="text-slate-300">{d.label}</span>
            <span className="ml-2 font-semibold text-white">{d.value}</span>
            <span className="text-slate-500">({d.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancialBarChart() {
  const W = 320, H = 220;
  const l = 36, t = 12, r = 304, b = 190;
  const bars = [
    { label: 'Data\nBreach', value: 42, color: '#ef4444' },
    { label: 'Downtime', value: 28, color: '#f97316' },
    { label: 'Regulatory\nFines', value: 18, color: '#eab308' },
    { label: 'Reputation\nDamage', value: 12, color: '#a855f7' },
    { label: 'Others', value: 8, color: '#3b82f6' },
  ];
  const yMax = 50;
  const bw = 36;
  const gap = (r - l - bw * bars.length) / (bars.length + 1);
  const yS = (v: number) => b - (v / yMax) * (b - t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[10, 20, 30, 40, 50].map((g) => (
        <g key={g}>
          <line x1={l} y1={yS(g)} x2={r} y2={yS(g)} stroke="rgba(255,255,255,0.06)" />
          <text x={l - 4} y={yS(g) + 3} textAnchor="end" fill="#475569" fontSize="9" fontFamily="Inter">₹ {g} L</text>
        </g>
      ))}
      <line x1={l} y1={yS(0)} x2={r} y2={yS(0)} stroke="rgba(255,255,255,0.06)" />
      {bars.map((bar, i) => {
        const x = l + gap + i * (bw + gap);
        const h = (bar.value / yMax) * (b - t);
        return (
          <g key={bar.label}>
            <defs>
              <linearGradient id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={bar.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={bar.color} stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <rect x={x} y={b - h} width={bw} height={h} rx="3" fill={`url(#bg${i})`} />
            <rect x={x} y={b - h - 16} width={32} height="14" rx="3" fill={bar.color} />
            <text x={x + 16} y={b - h - 6} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Inter">
              ₹ {bar.value} L
            </text>
            {bar.label.split('\n').map((line, li) => (
              <text key={li} x={x + bw / 2} y={b + 12 + li * 10} textAnchor="middle" fill="#475569" fontSize="8" fontFamily="Inter">
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function ComplianceRing({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 34, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const gap = circ - dash;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[76px] w-[76px]">
        <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
          <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="7" strokeDasharray={`${dash} ${gap}`} strokeDashoffset="0" strokeLinecap="round" />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-[15px] font-bold text-white">{pct}%</p>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-white">{label}</p>
    </div>
  );
}

const recentReports = [
  { name: 'Executive Summary Report', date: 'Jun 30, 2024', type: 'PDF', size: '2.4 MB', color: 'bg-blue-500/15 text-blue-400' },
  { name: 'Q2 Risk Assessment', date: 'Jun 30, 2024', type: 'PDF', size: '3.1 MB', color: 'bg-red-500/15 text-red-400' },
  { name: 'Financial Impact Analysis', date: 'Jun 28, 2024', type: 'PDF', size: '1.8 MB', color: 'bg-emerald-500/15 text-emerald-400' },
  { name: 'Compliance Status Report', date: 'Jun 25, 2024', type: 'PDF', size: '2.1 MB', color: 'bg-amber-500/15 text-amber-400' },
  { name: 'Vulnerability Trend Report', date: 'Jun 20, 2024', type: 'PDF', size: '1.9 MB', color: 'bg-violet-500/15 text-violet-400' },
];

export function ReportAnalysisView({ onNav, externalNotify }: ReportAnalysisViewProps) {
  const [activeTab, setActiveTab] = useState('Executive Summary');
  const [execSummary, setExecSummary] = useState(true);
  const [charts, setCharts] = useState(true);
  const [recom, setRecom] = useState(true);
  const [financial, setFinancial] = useState(true);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const notify = (msg: string, kind: 'ok' | 'info' = 'ok') => {
    if (externalNotify) externalNotify(msg, kind);
  };

  const handleGenerateReport = () => {
    notify('Report generation started. Your customized executive briefing will be ready in moments.', 'ok');
  };

  return (
    <div className="report-analysis-page">
      {/* MAIN ANALYTICS VIEW */}
      <div className="report-main-content">
        {/* Standard Header matching Security Controls */}
        <header className="sc-page-header">
          <div>
            <p className="sc-breadcrumb">Home &gt; Analytics &gt; <span>Reports</span></p>
            <h1>Reports &amp; Executive Analytics</h1>
            <p>Turn data into actionable intelligence. Generate board-grade reports, track progress, and share insights.</p>
          </div>
          <div className="sc-header-actions">
            <div className="sc-motto">
              <span>INSIGHTS TODAY</span>
              <span>SAFER TOMORROW</span>
              <span>MEASURED IMPACT</span>
            </div>
            <button
              type="button"
              className="sc-action-btn sc-btn-secondary"
              onClick={() => setDateModalOpen(true)}
            >
              Jun 1 – Jun 30, 2024
            </button>
            <button
              type="button"
              className="sc-action-btn"
              onClick={handleGenerateReport}
            >
              + Generate Report
            </button>
          </div>
        </header>

        {/* Standard Tabs matching Security Controls */}
        <nav className="detail-tabs" style={{ marginBottom: '14px', borderBottom: '1px solid var(--sc-border, #06314a)' }}>
          {['Executive Summary', 'Technical Report', 'Financial Report', 'Compliance Report', 'Custom Report'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setActiveTab(t);
                notify(`Viewing report module: ${t}`);
              }}
              className={activeTab === t ? 'is-active' : ''}
            >
              {t}
            </button>
          ))}
        </nav>

        {/* 5 KPI Stat Cards */}
        <section className="report-kpi-grid">
          {[
            {
              label: 'Total Assets Analyzed',
              val: '842',
              change: '↑ 12%',
              sub: 'vs last month',
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3z" />
                </svg>
              ),
              iconBg: 'bg-blue-500/15 text-blue-400',
              changeColor: 'text-emerald-400',
            },
            {
              label: 'Open Vulnerabilities',
              val: '1,248',
              change: '↑ 6%',
              sub: 'vs last month',
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              ),
              iconBg: 'bg-red-500/15 text-red-400',
              changeColor: 'text-red-400',
            },
            {
              label: 'Estimated Annual Loss',
              val: '₹ 1.25 Cr',
              change: '↓ 18%',
              sub: 'vs last month',
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
                </svg>
              ),
              iconBg: 'bg-amber-500/15 text-amber-400',
              changeColor: 'text-emerald-400',
            },
            {
              label: 'Recommended Investment',
              val: '₹ 42 L',
              change: '↓ 31%',
              sub: 'vs baseline',
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20V10M10 20V4M16 20v-6M20 20H2" strokeLinecap="round" />
                </svg>
              ),
              iconBg: 'bg-emerald-500/15 text-emerald-400',
              changeColor: 'text-emerald-400',
            },
            {
              label: 'Expected ROI',
              val: '+366%',
              change: '↑ 14%',
              sub: 'vs baseline',
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeLinecap="round" />
                </svg>
              ),
              iconBg: 'bg-cyan-500/15 text-cyan-400',
              changeColor: 'text-emerald-400',
            },
          ].map((k) => (
            <Card key={k.label} className="report-kpi-card">
              <div className="report-kpi-header">
                <span className={`report-kpi-icon-wrap ${k.iconBg}`}>{k.icon}</span>
                <span className="report-kpi-title">{k.label}</span>
              </div>
              <p className="report-kpi-val">{k.val}</p>
              <p className={`report-kpi-sub ${k.changeColor}`}>
                {k.change} <span className="text-slate-500">{k.sub}</span>
              </p>
            </Card>
          ))}
        </section>

        {/* 3 Charts Row */}
        <section className="report-charts-grid">
          <Card className="report-chart-card">
            <h3 className="report-card-heading">Risk Posture Trend</h3>
            <p className="report-card-subheading">Overall risk score trend over time</p>
            <div className="mt-1 flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Risk Score
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-500" /> Industry Average
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <RiskTrendChart />
            </div>
          </Card>

          <Card className="report-chart-card">
            <h3 className="report-card-heading">Vulnerabilities by Severity</h3>
            <p className="report-card-subheading">Distribution across CVSS tiers</p>
            <div className="mt-3 flex justify-center">
              <VulnDonut />
            </div>
          </Card>

          <Card className="report-chart-card">
            <h3 className="report-card-heading">Financial Impact Breakdown</h3>
            <p className="report-card-subheading">Loss categories by estimated exposure</p>
            <div style={{ marginTop: '8px' }}>
              <FinancialBarChart />
            </div>
          </Card>
        </section>

        {/* Table + Compliance Row */}
        <section className="report-two-col-grid">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="report-card-heading">Top Risky Assets</h3>
              <button
                type="button"
                onClick={() => onNav && onNav('assets')}
                className="flex items-center gap-1 text-[12px] font-medium text-blue-400 hover:text-blue-300"
              >
                View All{' '}
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="report-table-scroll">
              <table className="report-data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Asset Name</th>
                    <th>Business Unit</th>
                    <th>Risk Score</th>
                    <th>Trend</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Payment Gateway', unit: 'Finance', score: 98, trend: 'up', status: 'Critical', statusColor: 'bg-red-500/15 text-red-400' },
                    { name: 'Finance Database', unit: 'Finance', score: 96, trend: 'up', status: 'Critical', statusColor: 'bg-red-500/15 text-red-400' },
                    { name: 'Web Server', unit: 'IT', score: 78, trend: 'right', status: 'High', statusColor: 'bg-amber-500/15 text-amber-400' },
                    { name: 'Employee Portal', unit: 'HR', score: 64, trend: 'down', status: 'Medium', statusColor: 'bg-yellow-500/15 text-yellow-400' },
                    { name: 'Cloud Infrastructure', unit: 'IT', score: 52, trend: 'down', status: 'Medium', statusColor: 'bg-yellow-500/15 text-yellow-400' },
                  ].map((a, i) => (
                    <tr key={a.name}>
                      <td style={{ color: '#94a3b8' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{a.name}</td>
                      <td style={{ color: '#cbd5e1' }}>{a.unit}</td>
                      <td style={{ fontWeight: 700, color: '#ffffff' }}>{a.score}</td>
                      <td>
                        {a.trend === 'up' && (
                          <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17l5-5 5 5M7 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {a.trend === 'right' && (
                          <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {a.trend === 'down' && (
                          <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 7l5 5 5-5M7 17l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </td>
                      <td>
                        <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${a.statusColor}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="report-card-heading">Compliance Status</h3>
              <button
                type="button"
                onClick={() => onNav && onNav('compliance')}
                className="flex items-center gap-1 text-[12px] font-medium text-blue-400 hover:text-blue-300"
              >
                View Details{' '}
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="report-card-subheading">Overall compliance across frameworks</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <ComplianceRing pct={78} color="#3b82f6" label="ISO 27001" />
              <ComplianceRing pct={62} color="#f97316" label="NIST CSF" />
              <ComplianceRing pct={85} color="#22c55e" label="PCI DSS" />
              <ComplianceRing pct={71} color="#3b82f6" label="CIS Controls" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                { label: 'On Track', color: 'bg-emerald-500/15 text-emerald-400' },
                { label: 'Needs Attention', color: 'bg-amber-500/15 text-amber-400' },
                { label: 'Compliant', color: 'bg-emerald-500/15 text-emerald-400' },
                { label: 'In Progress', color: 'bg-blue-500/15 text-blue-400' },
              ].map((s) => (
                <span
                  key={s.label}
                  className={`flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ${s.color}`}
                >
                  <CheckDot color={s.label === 'Needs Attention' ? '#f59e0b' : s.label === 'In Progress' ? '#3b82f6' : '#22c55e'} />
                  {s.label}
                </span>
              ))}
            </div>
          </Card>
        </section>

        {/* Insights + Recommendations Row */}
        <section className="report-two-col-grid">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="report-card-heading">Key Insights</h3>
            </div>
            <div className="mt-3 space-y-2.5">
              {[
                { n: 1, t: <>Risk score reduced by <span className="font-semibold text-emerald-400">18%</span> compared to last quarter.</> },
                { n: 2, t: <><span className="font-semibold text-white">42 L</span> potential loss avoided through recommended controls.</> },
                { n: 3, t: <><span className="font-semibold text-white">204</span> critical vulnerabilities require immediate attention.</> },
                { n: 4, t: <>Compliance posture improved by <span className="font-semibold text-emerald-400">12%</span> across all frameworks.</> },
              ].map((ins) => (
                <div key={ins.n} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0b1220] text-[11px] font-bold text-blue-400 ring-1 ring-white/10">
                    {ins.n}
                  </span>
                  <p className="text-[13px] leading-relaxed text-slate-300">{ins.t}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6M8 13h8M8 17h8" />
                  </svg>
                </span>
                <h3 className="report-card-heading">Recommendations Summary</h3>
              </div>
              <button
                type="button"
                onClick={() => onNav && onNav('recommendations')}
                className="flex items-center gap-1 text-[12px] font-medium text-blue-400 hover:text-blue-300"
              >
                View All{' '}
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { period: 'Immediate (0-30 days)', count: '12 actions', countColor: 'text-red-400', items: ['Patch critical vulnerabilities', 'Enable MFA for all users', 'Isolate exposed systems'], bulletColor: 'bg-red-400' },
                { period: 'Short Term (1-3 months)', count: '28 actions', countColor: 'text-amber-400', items: ['Implement EDR on endpoints', 'Improve backup strategy', 'Segment critical networks'], bulletColor: 'bg-amber-400' },
                { period: 'Long Term (3-12 months)', count: '18 actions', countColor: 'text-blue-400', items: ['Modernize legacy systems', 'Enhance monitoring (SIEM)', 'Achieve full compliance'], bulletColor: 'bg-blue-400' },
              ].map((col) => (
                <div key={col.period}>
                  <p className="text-[11px] text-slate-400">{col.period}</p>
                  <p className={`mt-0.5 text-[16px] font-bold ${col.countColor}`}>{col.count}</p>
                  <ul className="mt-2 space-y-1.5">
                    {col.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${col.bulletColor}`} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>

      {/* RIGHT PANEL: GENERATE & RECENT REPORTS */}
      <aside className="report-right-panel">
        {/* Form Card */}
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
            </span>
            <div>
              <h3 className="text-[14px] font-semibold text-white">Generate Report</h3>
              <p className="text-[11px] text-slate-400">Create customized reports for your stakeholders.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-[11px] text-slate-400">Report Type</label>
              <select
                defaultValue="Executive Summary"
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white outline-none"
              >
                <option value="Executive Summary" className="bg-[#0b1220] text-white">Executive Summary</option>
                <option value="Technical Risk Assessment" className="bg-[#0b1220] text-white">Technical Risk Assessment</option>
                <option value="Board Briefing" className="bg-[#0b1220] text-white">Board Briefing</option>
                <option value="Compliance Gap Analysis" className="bg-[#0b1220] text-white">Compliance Gap Analysis</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] text-slate-400">Date Range</label>
              <div
                onClick={() => setDateModalOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-slate-200 cursor-pointer"
              >
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Jun 1, 2024 – Jun 30, 2024
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] text-slate-400">Business Unit</label>
              <select
                defaultValue="All Business Units"
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white outline-none"
              >
                <option value="All Business Units" className="bg-[#0b1220] text-white">All Business Units</option>
                <option value="Finance" className="bg-[#0b1220] text-white">Finance</option>
                <option value="Operations" className="bg-[#0b1220] text-white">Operations</option>
                <option value="IT Infrastructure" className="bg-[#0b1220] text-white">IT Infrastructure</option>
                <option value="Human Resources" className="bg-[#0b1220] text-white">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] text-slate-400">Format</label>
              <select
                defaultValue="PDF"
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white outline-none"
              >
                <option value="PDF" className="bg-[#0b1220] text-white">PDF Document (.pdf)</option>
                <option value="Excel" className="bg-[#0b1220] text-white">Excel Spreadsheet (.xlsx)</option>
                <option value="CSV" className="bg-[#0b1220] text-white">Raw Data (.csv)</option>
              </select>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                { label: 'Include Executive Summary', on: execSummary, set: setExecSummary },
                { label: 'Include Charts & Visualizations', on: charts, set: setCharts },
                { label: 'Include Recommendations', on: recom, set: setRecom },
                { label: 'Include Financial Impact', on: financial, set: setFinancial },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between text-[12px] text-slate-300">
                  <span>{t.label}</span>
                  <button
                    type="button"
                    onClick={() => t.set(!t.on)}
                    className={`report-toggle-switch ${t.on ? 'is-on' : 'is-off'}`}
                    aria-pressed={t.on}
                  >
                    <span className="report-toggle-knob" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerateReport}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] py-2.5 text-[13px] font-semibold text-white hover:bg-[#1d4ed8]"
            >
              Generate Report
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Card>

        {/* Recent Reports Card */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-white">Recent Reports</h3>
            <button
              type="button"
              onClick={() => notify('Showing 5 recent reports.')}
              className="flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300"
            >
              View All{' '}
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="mt-3 space-y-2.5">
            {recentReports.map((r) => (
              <div key={r.name} className="flex items-center gap-3">
                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${r.color}`}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6M8 13h8M8 17h8" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-white">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.date} • {r.type} • {r.size}</p>
                </div>
                <button
                  type="button"
                  onClick={() => notify(`Download started for ${r.name} (${r.type}).`)}
                  className="flex-shrink-0 text-slate-400 hover:text-white"
                  title={`Download ${r.name}`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Schedule Reports Card */}
        <Card className="mt-4 flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-[13px] font-semibold text-white">Schedule Reports</p>
              <p className="text-[11px] text-slate-400">Automate report generation and delivery.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-white/10"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Create Schedule
          </button>
        </Card>
      </aside>

      {/* Date Range Modal */}
      {dateModalOpen && (
        <div className="report-modal-backdrop" onClick={() => setDateModalOpen(false)}>
          <div className="report-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="text-[14px] font-semibold text-white">Select Report Period</h3>
              <button
                type="button"
                onClick={() => setDateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 p-4 text-[13px]">
              {['Jun 1, 2024 – Jun 30, 2024 (Last Month)', 'May 1, 2024 – May 31, 2024', 'Q2 2024 (Apr 1 – Jun 30)', 'Year to Date 2024', 'Custom Date Range...'].map((range, idx) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setDateModalOpen(false);
                    notify(`Selected reporting period: ${range}`);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left hover:bg-white/5 ${idx === 0 ? 'bg-blue-600/20 text-blue-400 font-semibold' : 'text-slate-300'}`}
                >
                  {range}
                  {idx === 0 && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="report-modal-backdrop" onClick={() => setScheduleModalOpen(false)}>
          <div className="report-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="text-[14px] font-semibold text-white">Schedule Automated Delivery</h3>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 p-4 text-[12px]">
              <div>
                <label className="mb-1 block text-slate-400">Frequency</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white outline-none">
                  <option value="weekly" className="bg-[#0b1220]">Weekly (Every Monday, 8:00 AM)</option>
                  <option value="monthly" className="bg-[#0b1220]">Monthly (1st of each month)</option>
                  <option value="quarterly" className="bg-[#0b1220]">Quarterly (End of Quarter)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-slate-400">Recipients (Email)</label>
                <input
                  type="text"
                  defaultValue="yashgalande39@gmail.com, ciso@acme.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-white/10 bg-black/20 p-3">
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="rounded-lg px-3 py-1.5 text-[12px] text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setScheduleModalOpen(false);
                  notify('Automated delivery schedule created for weekly executive summaries.', 'ok');
                }}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-500"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
