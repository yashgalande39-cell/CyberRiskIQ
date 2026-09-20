import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import '../../styles/optimization.css';

export interface OptimizationViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/[0.08] bg-[#0b1220] ${className}`}>{children}</div>
  );
}

function CheckGreen() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#16a34a" />
      <path d="M8 12.5l2.4 2.4L16.5 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type RecPriority = 'P0' | 'P1' | 'P2';
export type RecStatus = 'Planned' | 'In Progress' | 'Completed' | 'Deferred';

export interface RecommendationItem {
  n: number;
  id: string;
  title: string;
  desc: string;
  category: string;
  assets: string;
  reduction: number;
  ale: string;
  aleVal: number; // in lakhs
  cost: string;
  costVal: number; // in lakhs
  priority: RecPriority;
  status: RecStatus;
  iconType: 'shield' | 'alert' | 'server' | 'database' | 'network';
}

const initialRecs: RecommendationItem[] = [
  {
    n: 1,
    id: 'rec-1',
    title: 'Deploy MFA across all users',
    desc: 'Prevent account takeover and lateral movement',
    category: 'Identity',
    assets: '1,000+ users',
    reduction: 9,
    ale: '₹ 18 L',
    aleVal: 18,
    cost: '₹ 2.0 L',
    costVal: 2.0,
    priority: 'P0',
    status: 'Planned',
    iconType: 'shield',
  },
  {
    n: 2,
    id: 'rec-2',
    title: 'Patch critical vulnerabilities',
    desc: 'CVE-2024-3094, others — Fix actively exploited vulnerabilities',
    category: 'Vulnerability',
    assets: '12 assets',
    reduction: 8,
    ale: '₹ 15 L',
    aleVal: 15,
    cost: '₹ 4.5 L',
    costVal: 4.5,
    priority: 'P0',
    status: 'Planned',
    iconType: 'alert',
  },
  {
    n: 3,
    id: 'rec-3',
    title: 'Implement EDR on endpoints',
    desc: 'Detect and prevent advanced threats',
    category: 'Endpoint',
    assets: '420 endpoints',
    reduction: 5,
    ale: '₹ 6 L',
    aleVal: 6,
    cost: '₹ 1.5 L',
    costVal: 1.5,
    priority: 'P1',
    status: 'Planned',
    iconType: 'server',
  },
  {
    n: 4,
    id: 'rec-4',
    title: 'Improve backup & recovery',
    desc: 'Reduce impact of ransomware',
    category: 'Resilience',
    assets: '8 critical systems',
    reduction: 4,
    ale: '₹ 4 L',
    aleVal: 4,
    cost: '₹ 1.0 L',
    costVal: 1.0,
    priority: 'P1',
    status: 'Planned',
    iconType: 'database',
  },
  {
    n: 5,
    id: 'rec-5',
    title: 'Network segmentation',
    desc: 'Contain potential breaches',
    category: 'Network',
    assets: '6 network zones',
    reduction: 3,
    ale: '₹ 3 L',
    aleVal: 3,
    cost: '₹ 1.0 L',
    costVal: 1.0,
    priority: 'P2',
    status: 'Planned',
    iconType: 'network',
  },
];

const prioStyle: Record<RecPriority, string> = {
  P0: 'bg-[#7f1d1d] text-[#fecaca]',
  P1: 'bg-[#9a3412] text-[#fdba74]',
  P2: 'bg-[#854d0e] text-[#fde047]',
};

function renderRecIcon(type: RecommendationItem['iconType']) {
  switch (type) {
    case 'shield':
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3z" />
        </svg>
      );
    case 'alert':
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
        </svg>
      );
    case 'server':
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" strokeLinecap="round" />
        </svg>
      );
    case 'database':
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="6" rx="1" />
          <rect x="3" y="14" width="18" height="6" rx="1" />
          <path d="M7 7h.01M7 17h.01" strokeLinecap="round" />
        </svg>
      );
    case 'network':
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7" />
        </svg>
      );
  }
}

function RiskCurve({ currentScore = 72, projectedScore = 50, currentCost = 9 }: { currentScore?: number; projectedScore?: number; currentCost?: number }) {
  const W = 420;
  const H = 210;
  const l = 42,
    t = 18,
    r = 400,
    b = 175;
  const xS = (x: number) => l + (x / 10) * (r - l);
  const yS = (y: number) => b - (y / 100) * (b - t);
  const pts = [
    [0, 92],
    [1, currentScore],
    [2, Math.round(currentScore * 0.85)],
    [4, Math.round(currentScore * 0.75)],
    [6, Math.max(30, projectedScore)],
    [8, Math.max(28, projectedScore - 2)],
    [10, projectedScore],
  ];
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xS(p[0])} ${yS(p[1])}`).join(' ');
  const gridY = [0, 20, 40, 60, 80, 100];
  const gridX = [0, 2, 4, 6, 8, 10];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[210px] w-full">
      {gridY.map((g) => (
        <g key={g}>
          <line x1={l} y1={yS(g)} x2={r} y2={yS(g)} stroke="rgba(255,255,255,0.06)" />
          <text x={l - 8} y={yS(g) + 3} textAnchor="end" fill="#64748b" fontSize="10">
            {g}
          </text>
        </g>
      ))}
      {gridX.map((g) => (
        <text key={g} x={xS(g)} y={b + 16} textAnchor="middle" fill="#64748b" fontSize="10">
          {g}
        </text>
      ))}
      <text x={(l + r) / 2} y={H - 2} textAnchor="middle" fill="#64748b" fontSize="10">
        Investment (₹ Lakh)
      </text>
      <text x={12} y={(t + b) / 2} textAnchor="middle" fill="#64748b" fontSize="10" transform={`rotate(-90 12 ${(t + b) / 2})`}>
        Risk Score
      </text>

      <line x1={xS(10)} y1={yS(projectedScore)} x2={xS(10)} y2={yS(92)} stroke="#22d3ee" strokeDasharray="3 3" strokeWidth="1.2" />
      <path d={d} fill="none" stroke="#3b82f6" strokeWidth="2.2" />
      {pts.map((p, i) => {
        const isCurrent = i === 1;
        const isEnd = i === pts.length - 1;
        return (
          <circle
            key={i}
            cx={xS(p[0])}
            cy={yS(p[1])}
            r={isCurrent || isEnd ? 5 : 3.5}
            fill={isCurrent ? '#ef4444' : isEnd ? '#22d3ee' : '#60a5fa'}
            stroke="#0b1220"
            strokeWidth="2"
          />
        );
      })}

      {/* Current badge */}
      <rect x={xS(1) - 22} y={yS(currentScore) - 38} width="44" height="28" rx="4" fill="#fff" />
      <text x={xS(1)} y={yS(currentScore) - 22} textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
        {currentScore}
      </text>
      <text x={xS(1)} y={yS(currentScore) - 12} textAnchor="middle" fill="#64748b" fontSize="8">
        Current
      </text>

      {/* ₹ Lakh cost badge */}
      <rect x={xS(10) - 28} y={yS(92) - 14} width="44" height="18" rx="4" fill="#2563eb" />
      <text x={xS(10) - 6} y={yS(92) - 1} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
        ₹ {currentCost.toFixed(1)} L
      </text>

      {/* Projected badge */}
      <rect x={xS(10) - 54} y={yS(projectedScore) - 8} width="48" height="28" rx="4" fill="#059669" />
      <text x={xS(10) - 30} y={yS(projectedScore) + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
        {projectedScore}
      </text>
      <text x={xS(10) - 30} y={yS(projectedScore) + 14} textAnchor="middle" fill="#d1fae5" fontSize="8">
        Projected
      </text>
    </svg>
  );
}

function Donut({ totalCost = 9 }: { totalCost?: number }) {
  const items = [
    { name: 'Identity & Access', pct: 22, color: '#3b82f6' },
    { name: 'Vulnerability Mgmt', pct: 39, color: '#a855f7' },
    { name: 'Endpoint Security', pct: 17, color: '#ec4899' },
    { name: 'Backup & Recovery', pct: 11, color: '#f59e0b' },
    { name: 'Network Security', pct: 11, color: '#eab308' },
  ];
  const r = 42;
  const cx = 58;
  const cy = 58;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const displayPct = [22, 50, 17, 11, 11];

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-[116px] w-[116px] flex-shrink-0">
        <svg viewBox="0 0 116 116" className="h-full w-full -rotate-90">
          {items.map((it) => {
            const dash = (it.pct / 100) * circ;
            const gap = circ - dash;
            const el = (
              <circle
                key={it.name}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={it.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[13px] font-bold leading-none text-white">₹ {totalCost.toFixed(1)} L</p>
          <p className="mt-0.5 text-[10px] text-slate-400">Total</p>
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        {items.map((it, i) => (
          <div key={it.name} className="flex items-center gap-2 text-[11px]">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: it.color }} />
            <span className="flex-1 truncate text-slate-300">{it.name}</span>
            <span className="font-semibold text-white">{displayPct[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OptimizationView({ onNav: _onNav, externalNotify }: OptimizationViewProps) {
  const [activeTab, setActiveTab] = useState<'Optimized Plan' | 'Investment Catalog' | 'What-If Analysis' | 'Implementation Tracking'>('Optimized Plan');
  const [recs, setRecs] = useState<RecommendationItem[]>(initialRecs);
  const [selectedIds, setSelectedIds] = useState<string[]>(['rec-1', 'rec-2', 'rec-3', 'rec-4', 'rec-5']);
  const [budgetSlider, setBudgetSlider] = useState(1000000);
  const [optimizationMode, setOptimizationMode] = useState<'Balanced' | 'Aggressive' | 'Budget Constrained' | 'Quick Wins'>('Balanced');
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showCustomPlanModal, setShowCustomPlanModal] = useState(false);
  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<RecommendationItem | null>(null);
  const [isRunningSim, setIsRunningSim] = useState(false);

  // New Custom Recommendation state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Identity');
  const [newAssets, setNewAssets] = useState('100+ assets');
  const [newReduction, setNewReduction] = useState(5);
  const [newAle, setNewAle] = useState('₹ 5 L');
  const [newCost, setNewCost] = useState('₹ 1.5 L');
  const [newCostVal, setNewCostVal] = useState(1.5);
  const [newPriority, setNewPriority] = useState<RecPriority>('P1');

  // New Custom Plan state
  const [planName, setPlanName] = useState('FY26 Resilience & Compliance Plan');
  const [planBudget, setPlanBudget] = useState('₹ 15,00,000');
  const [planTimeframe, setPlanTimeframe] = useState('6 Months');

  // Dynamic calculations based on checked items
  const { totalCostVal, totalReduction, projectedScore, currentCostStr } = useMemo(() => {
    let costSum = 0;
    let redSum = 0;
    recs.forEach((r) => {
      if (selectedIds.includes(r.id)) {
        costSum += r.costVal;
        redSum += r.reduction;
      }
    });
    const proj = Math.max(35, 72 - redSum);
    return {
      totalCostVal: costSum,
      totalReduction: redSum,
      projectedScore: proj,
      currentCostStr: `₹ ${costSum.toFixed(1)} L`,
    };
  }, [recs, selectedIds]);

  const budgetPct = Math.min(100, Math.round((totalCostVal / 10.0) * 100));
  const sliderPct = Math.round((budgetSlider / 5000000) * 100);

  // Slider derived values
  const sliderProjectedRisk = Math.max(36, Math.round(72 - (budgetSlider / 5000000) * 36));
  const sliderProjectedAle = Math.max(45, Math.round(125 - (budgetSlider / 5000000) * 75));
  const sliderRiskReduction = 72 - sliderProjectedRisk;

  function toggleSelectAll() {
    if (selectedIds.length === recs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recs.map((r) => r.id));
    }
  }

  function toggleRec(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleStatusChange(id: string, newStatus: RecStatus) {
    setRecs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (externalNotify) {
      externalNotify(`Updated status to "${newStatus}"`, 'ok');
    }
  }

  function handleSavePlan() {
    if (externalNotify) {
      externalNotify(`Remediation Plan saved (${selectedIds.length} initiatives, ${currentCostStr}).`, 'ok');
    }
  }

  function handleExportPlan() {
    const selectedRecs = recs.filter((r) => selectedIds.includes(r.id));
    const header = 'ID,Title,Description,Category,Assets,Risk Reduction (pts),ALE Reduction,Cost,Priority,Status\n';
    const rows = selectedRecs
      .map(
        (r) =>
          `"${r.id}","${r.title}","${r.desc}","${r.category}","${r.assets}","${r.reduction}","${r.ale}","${r.cost}","${r.priority}","${r.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberRiskIQ_Remediation_Plan_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    if (externalNotify) {
      externalNotify('Exported plan to CSV successfully.', 'ok');
    }
  }

  function handleReRunOptimization() {
    setIsRunningSim(true);
    setTimeout(() => {
      setIsRunningSim(false);
      setSelectedIds(recs.map((r) => r.id));
      if (externalNotify) {
        externalNotify(`Re-ran optimization using "${optimizationMode}" model. Plan calibrated.`, 'ok');
      }
    }, 1200);
  }

  function handleAddCustomRecommendation() {
    if (!newTitle.trim()) return;
    const newId = `rec-${Date.now()}`;
    const item: RecommendationItem = {
      n: recs.length + 1,
      id: newId,
      title: newTitle.trim(),
      desc: newDesc.trim() || 'Custom organizational mitigation initiative',
      category: newCategory,
      assets: newAssets.trim() || 'All affected assets',
      reduction: Number(newReduction) || 5,
      ale: newAle.trim() || '₹ 5 L',
      aleVal: 5,
      cost: newCost.trim() || '₹ 1.5 L',
      costVal: Number(newCostVal) || 1.5,
      priority: newPriority,
      status: 'Planned',
      iconType: 'shield',
    };
    setRecs((prev) => [...prev, item]);
    setSelectedIds((prev) => [...prev, newId]);
    setShowAddRecModal(false);
    setNewTitle('');
    setNewDesc('');
    if (externalNotify) {
      externalNotify(`Added custom recommendation: ${item.title}`, 'ok');
    }
  }

  function handleCreatePlanSubmit() {
    setShowCustomPlanModal(false);
    if (externalNotify) {
      externalNotify(`Created new plan "${planName}" with budget ${planBudget}.`, 'ok');
    }
  }

  return (
    <div className="optimization-page">
      {/* Standard Header matching Security Controls */}
      <header className="sc-page-header">
        <div>
          <p className="sc-breadcrumb">Home &gt; Posture &gt; <span>Investment Optimizer</span></p>
          <h1>Remediation &amp; Investment Optimization</h1>
          <p>AI-powered, risk-aware, and budget-optimized security investment portfolio.</p>
        </div>
        <div className="sc-header-actions">
          <div className="sc-motto">
            <span>INVEST SMARTER</span>
            <span>REDUCE RISK</span>
            <span>MAXIMIZE IMPACT</span>
          </div>
          <button
            onClick={() => setShowSimulateModal(true)}
            className="sc-action-btn sc-btn-secondary"
          >
            Simulate Scenario
          </button>
          <button
            onClick={() => setShowCustomPlanModal(true)}
            className="sc-action-btn"
          >
            + Create Custom Plan
          </button>
        </div>
      </header>

      {/* Standard Tabs matching Security Controls */}
      <nav className="detail-tabs" style={{ marginBottom: '14px', borderBottom: '1px solid var(--sc-border, #06314a)' }}>
        {(['Optimized Plan', 'Investment Catalog', 'What-If Analysis', 'Implementation Tracking'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={activeTab === t ? 'is-active' : ''}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT BASED ON TAB */}
      {activeTab === 'Optimized Plan' && (
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-4">
            {/* KPI row */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              <Card className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="8" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  <span className="text-[11px] text-slate-400">Current Risk Score</span>
                </div>
                <p className="mt-2 text-[22px] font-bold leading-none">
                  72 <span className="text-[12px] font-medium text-slate-500">/ 100</span>
                </p>
                <span className="mt-2 inline-block rounded bg-[#7f1d1d] px-1.5 py-0.5 text-[10px] font-semibold text-red-300">
                  High Risk
                </span>
                <p className="mt-1.5 text-[11px] text-red-400">↑ 12% vs last month</p>
              </Card>

              <Card className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3z" />
                    </svg>
                  </span>
                  <span className="text-[11px] text-slate-400">Projected Risk Score</span>
                </div>
                <p className="mt-2 text-[22px] font-bold leading-none">
                  {projectedScore} <span className="text-[12px] font-medium text-slate-500">/ 100</span>
                </p>
                <span className="mt-2 inline-block rounded bg-[#14532d] px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Medium
                </span>
                <p className="mt-1.5 text-[11px] text-emerald-400">↓ {totalReduction} points</p>
              </Card>

              <Card className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="10" width="7" height="10" rx="1" />
                      <rect x="14" y="4" width="7" height="16" rx="1" />
                    </svg>
                  </span>
                  <span className="text-[11px] text-slate-400">Estimated Annual Loss (ALE)</span>
                </div>
                <p className="mt-2 text-[16px] font-bold leading-tight">
                  ₹ 1.25 Cr <span className="text-slate-500">→</span> ₹ 83 L
                </p>
                <p className="mt-2 text-[11px] text-emerald-400">↓ 67% reduction</p>
              </Card>

              <Card className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </span>
                  <span className="text-[11px] text-slate-400">Total Investment</span>
                </div>
                <p className="mt-2 text-[22px] font-bold leading-none">{currentCostStr}</p>
                <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Within budget (₹ 10 L)
                </p>
              </Card>

              <Card className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 20V10M10 20V4M16 20v-6M20 20H2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="text-[11px] text-slate-400">Expected ROI</span>
                </div>
                <p className="mt-2 text-[22px] font-bold leading-none text-emerald-400">+ 366%</p>
                <p className="mt-2 text-[11px] text-slate-400">₹ 42 L loss avoided</p>
              </Card>
            </div>

            {/* Table card */}
            <Card className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-blue-400">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2z" />
                      <path d="M19 13l.7 2 2.1.8-2.1.8-.7 2-.7-2-2.1-.8 2.1-.8.7-2z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold">Optimized Remediation Plan</h3>
                    <p className="text-[12px] text-slate-400">
                      AI-selected recommendations based on your risk profile, budget and business priorities.
                    </p>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div>
                    <p className="mb-1 text-[11px] text-slate-400">Optimization Mode</p>
                    <div className="relative">
                      <select
                        value={optimizationMode}
                        onChange={(e) => setOptimizationMode(e.target.value as any)}
                        className="flex h-9 appearance-none items-center gap-2 rounded-lg border border-white/10 bg-[#070b14] px-3 pr-8 text-[12px] text-white outline-none"
                      >
                        <option value="Balanced">Balanced (Default)</option>
                        <option value="Aggressive">Aggressive Risk Reduction</option>
                        <option value="Budget Constrained">Budget Constrained</option>
                        <option value="Quick Wins">Quick Wins</option>
                      </select>
                      <svg className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={handleReRunOptimization}
                    disabled={isRunningSim}
                    className="flex h-9 items-center gap-2 rounded-lg bg-[#1d4ed8] px-3 text-[12px] font-semibold text-white transition hover:bg-[#1e40af] disabled:opacity-50"
                  >
                    <svg className={`h-4 w-4 ${isRunningSim ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-3-6.7" strokeLinecap="round" />
                      <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {isRunningSim ? 'Optimizing...' : 'Re-run Optimization'}
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto opt-scroll">
                <table className="w-full min-w-[860px] text-left text-[12px]">
                  <thead>
                    <tr className="border-y border-white/10 bg-white/[0.02] text-[11px] font-medium text-slate-400">
                      <th className="w-8 px-2 py-2">#</th>
                      <th className="w-8 px-1 py-2">
                        <input
                          type="checkbox"
                          className="criq-check"
                          checked={selectedIds.length === recs.length && recs.length > 0}
                          onChange={toggleSelectAll}
                          title="Select all"
                        />
                      </th>
                      <th className="px-2 py-2">Recommendation</th>
                      <th className="px-2 py-2">Category</th>
                      <th className="px-2 py-2">Affected Assets</th>
                      <th className="px-2 py-2">
                        Risk Reduction
                        <br />
                        (points)
                      </th>
                      <th className="px-2 py-2">ALE Reduction</th>
                      <th className="px-2 py-2">Cost</th>
                      <th className="px-2 py-2">Priority</th>
                      <th className="px-2 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recs.map((r) => (
                      <tr
                        key={r.id}
                        className={`border-b border-white/5 transition hover:bg-white/[0.02] ${
                          selectedIds.includes(r.id) ? '' : 'opacity-60'
                        }`}
                      >
                        <td className="px-2 py-3 text-slate-400">{r.n}</td>
                        <td className="px-1 py-3">
                          <input
                            type="checkbox"
                            className="criq-check"
                            checked={selectedIds.includes(r.id)}
                            onChange={() => toggleRec(r.id)}
                          />
                        </td>
                        <td className="px-2 py-3">
                          <div
                            className="flex cursor-pointer items-start gap-2"
                            onClick={() => setShowDetailModal(r)}
                          >
                            <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                              {renderRecIcon(r.iconType)}
                            </span>
                            <div>
                              <p className="font-semibold leading-tight text-white transition hover:text-blue-400">
                                {r.title}
                              </p>
                              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{r.desc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-slate-300">{r.category}</td>
                        <td className="px-2 py-3 text-slate-300">{r.assets}</td>
                        <td className="px-2 py-3 font-semibold text-emerald-400">{r.reduction}</td>
                        <td className="px-2 py-3 font-semibold text-emerald-400">{r.ale}</td>
                        <td className="px-2 py-3 text-slate-200">{r.cost}</td>
                        <td className="px-2 py-3">
                          <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${prioStyle[r.priority]}`}>
                            {r.priority}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusChange(r.id, e.target.value as RecStatus)}
                            className="rounded-md border border-white/10 bg-[#070b14] px-2 py-1 text-[11px] font-medium text-slate-200 outline-none"
                          >
                            <option value="Planned">Planned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Deferred">Deferred</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAddRecModal(true)}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] font-medium transition hover:bg-white/10"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                    Add Custom Recommendation
                  </button>
                  <button
                    onClick={handleSavePlan}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] font-medium transition hover:bg-white/10"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <path d="M17 21v-8H7v8M7 3v5h8" />
                    </svg>
                    Save Plan
                  </button>
                  <button
                    onClick={handleExportPlan}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-[12px] font-medium transition hover:bg-white/10"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                    </svg>
                    Export Plan
                  </button>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] text-slate-300">
                    Total Investment <span className="font-semibold text-white">{currentCostStr}</span>
                    <span className="text-slate-500"> / ₹ 10.0 L budget</span>
                  </span>
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-400">{budgetPct}%</span>
                </div>
              </div>
            </Card>

            {/* Bottom two cards */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-[14px] font-semibold">Risk vs Investment Curve</h3>
                <RiskCurve currentScore={72} projectedScore={projectedScore} currentCost={totalCostVal} />
              </Card>

              <Card className="p-4">
                <h3 className="text-[14px] font-semibold">Business Value</h3>
                <div className="mt-3 space-y-3">
                  {[
                    {
                      t: 'Regulatory Compliance',
                      d: 'Meet ISO 27001, RBI, SEBI requirements',
                      color: 'bg-violet-500/15 text-violet-400',
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3z" />
                        </svg>
                      ),
                    },
                    {
                      t: 'Reduced Downtime',
                      d: 'Lower probability of business disruption',
                      color: 'bg-blue-500/15 text-blue-400',
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 3" strokeLinecap="round" />
                        </svg>
                      ),
                    },
                    {
                      t: 'Improved Trust',
                      d: 'Stronger customer and partner confidence',
                      color: 'bg-sky-500/15 text-sky-400',
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="3" />
                          <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
                        </svg>
                      ),
                    },
                    {
                      t: 'Cost Optimization',
                      d: 'Maximum risk reduction per rupee invested',
                      color: 'bg-cyan-500/15 text-cyan-400',
                      icon: (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 8v8M9.5 10.5c0-1 1-1.8 2.5-1.8s2.5.8 2.5 1.8-1 1.5-2.5 1.5-2.5.7-2.5 1.8 1 1.8 2.5 1.8 2.5-.8 2.5-1.8" strokeLinecap="round" />
                        </svg>
                      ),
                    },
                  ].map((v) => (
                    <div key={v.t} className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${v.color}`}>
                        {v.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold leading-tight">{v.t}</p>
                        <p className="text-[11px] text-slate-400">{v.d}</p>
                      </div>
                      <CheckGreen />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* RIGHT COLUMN (300px) */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20V10M10 20V4M16 20v-6M20 20H2" strokeLinecap="round" />
                </svg>
                <h3 className="text-[14px] font-semibold">Impact Summary</h3>
              </div>

              <p className="mt-4 text-[12px] text-slate-400">Risk Score</p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-[18px] font-bold leading-none">72</p>
                  <div className="mt-1.5 h-1.5 w-20 rounded-full bg-red-500" />
                  <p className="mt-1 text-[11px] text-slate-500">Current</p>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-bold leading-none">{projectedScore}</p>
                  <div className="ml-auto mt-1.5 h-1.5 w-14 rounded-full bg-emerald-500" />
                  <p className="mt-1 text-[11px] text-slate-500">Projected</p>
                </div>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="text-[12px] text-slate-400">Annual Loss Expectancy</p>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-[16px] font-bold leading-none">₹ 1.25 Cr</p>
                    <div className="mt-1.5 h-1.5 w-20 rounded-full bg-red-500" />
                    <p className="mt-1 text-[11px] text-slate-500">Current</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold leading-none">₹ 83 L</p>
                    <div className="ml-auto mt-1.5 h-1.5 w-14 rounded-full bg-emerald-500" />
                    <p className="mt-1 text-[11px] text-slate-500">Projected</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
                <div>
                  <p className="text-[12px] text-slate-400">Risk Reduction</p>
                  <p className="mt-1 text-[16px] font-bold">{totalReduction} points</p>
                  <p className="text-[11px] text-emerald-400">↓ 31%</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-400">Loss Avoided</p>
                  <p className="mt-1 text-[16px] font-bold">₹ 42 L</p>
                  <p className="text-[11px] text-emerald-400">↑</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3a9 9 0 0 1 0 18" />
                </svg>
                <h3 className="text-[14px] font-semibold">Budget Allocation</h3>
              </div>
              <div className="mt-3">
                <Donut totalCost={totalCostVal} />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
                </svg>
                <h3 className="text-[14px] font-semibold">What-If Simulation</h3>
              </div>
              <p className="mt-1 text-[12px] text-slate-400">Adjust budget to see projected outcome.</p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[12px] text-slate-400">Budget</span>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[12px] font-semibold">
                  ₹ {budgetSlider.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5000000}
                step={50000}
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                className="criq-range mt-2"
                style={{ ['--pct' as string]: `${sliderPct}%` }}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>₹ 0</span>
                <span>₹ 50,00,000</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-center">
                  <p className="text-[16px] font-bold leading-none">{sliderProjectedRisk}</p>
                  <p className="mt-1 text-[10px] text-slate-400">Projected Risk</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-center">
                  <p className="text-[16px] font-bold leading-none">₹ {sliderProjectedAle} L</p>
                  <p className="mt-1 text-[10px] text-slate-400">Projected ALE</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-center">
                  <p className="text-[16px] font-bold leading-none">{sliderRiskReduction}</p>
                  <p className="mt-1 text-[10px] text-slate-400">Risk Reduction</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (externalNotify) {
                    externalNotify(`Ran What-If simulation with budget ₹ ${budgetSlider.toLocaleString('en-IN')}: Projected Risk ${sliderProjectedRisk}/100.`, 'ok');
                  }
                }}
                className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] text-[13px] font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                Run Simulation
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: INVESTMENT CATALOG */}
      {activeTab === 'Investment Catalog' && (
        <div className="mt-4 space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-[16px] font-semibold">Security Investment Catalog</h3>
                <p className="text-[12px] text-slate-400">
                  Pre-costed security controls and initiatives ranked by cost-efficiency and compliance alignment.
                </p>
              </div>
              <button
                onClick={() => setShowAddRecModal(true)}
                className="flex h-9 items-center gap-2 rounded-lg bg-[#2563eb] px-3.5 text-[12px] font-semibold text-white hover:bg-[#1d4ed8]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Add Custom Initiative
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recs.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#070b14] p-4 transition hover:border-blue-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                        {renderRecIcon(r.iconType)}
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${prioStyle[r.priority]}`}>
                        {r.priority} Priority
                      </span>
                    </div>
                    <h4 className="mt-3 text-[14px] font-semibold text-white">{r.title}</h4>
                    <p className="mt-1 text-[12px] text-slate-400">{r.desc}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-3 text-[11px]">
                      <div>
                        <span className="text-slate-500">Category:</span>
                        <p className="font-medium text-slate-300">{r.category}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Scope:</span>
                        <p className="font-medium text-slate-300">{r.assets}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Risk Reduction:</span>
                        <p className="font-semibold text-emerald-400">-{r.reduction} points</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Est. Cost:</span>
                        <p className="font-semibold text-white">{r.cost}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[11px] text-slate-400">
                      ALE Reduction: <strong className="text-emerald-400">{r.ale}</strong>
                    </span>
                    <button
                      onClick={() => setShowDetailModal(r)}
                      className="rounded bg-white/5 px-2.5 py-1 text-[11px] font-medium text-blue-400 hover:bg-white/10"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: WHAT-IF ANALYSIS */}
      {activeTab === 'What-If Analysis' && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
          <Card className="p-4">
            <h3 className="text-[16px] font-semibold">Simulated Security Investment Impact</h3>
            <p className="text-[12px] text-slate-400">
              Model hypothetical capital allocations to visualize their projected risk reduction and return on security investment (ROSI).
            </p>
            <div className="mt-6">
              <RiskCurve currentScore={72} projectedScore={sliderProjectedRisk} currentCost={budgetSlider / 100000} />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <h3 className="text-[14px] font-semibold">Budget Sensitivity Parameters</h3>
            <div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-400">Simulated Spend:</span>
                <span className="font-bold text-white">₹ {budgetSlider.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5000000}
                step={50000}
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                className="criq-range mt-2"
                style={{ ['--pct' as string]: `${sliderPct}%` }}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>₹ 0</span>
                <span>₹ 50 Lakh</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-3">
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-400">Projected Risk Score:</span>
                <span className="font-bold text-emerald-400">{sliderProjectedRisk} / 100</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-400">Projected ALE:</span>
                <span className="font-bold text-emerald-400">₹ {sliderProjectedAle} Lakh</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-slate-400">Risk Points Avoided:</span>
                <span className="font-bold text-blue-400">{sliderRiskReduction} points</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (externalNotify) {
                  externalNotify(`Applied simulation budget of ₹ ${budgetSlider.toLocaleString('en-IN')} to current roadmap.`, 'ok');
                }
              }}
              className="w-full rounded-lg bg-[#2563eb] py-2 text-[12px] font-semibold text-white hover:bg-[#1d4ed8]"
            >
              Apply to Working Roadmap
            </button>
          </Card>
        </div>
      )}

      {/* TAB 4: IMPLEMENTATION TRACKING */}
      {activeTab === 'Implementation Tracking' && (
        <div className="mt-4 space-y-4">
          <Card className="p-4">
            <h3 className="text-[16px] font-semibold">Remediation Milestone Execution</h3>
            <p className="text-[12px] text-slate-400">
              Track implementation progress, ownership, and risk reduction delivery against planned initiatives.
            </p>

            <div className="mt-4 divide-y divide-white/5">
              {recs.map((r, i) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-white/5 font-semibold text-slate-400">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{r.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {r.category} · {r.assets} · Est. Cost: {r.cost}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Mitigation Gain</p>
                      <p className="font-semibold text-emerald-400">-{r.reduction} pts ({r.ale})</p>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value as RecStatus)}
                      className="rounded-md border border-white/10 bg-[#070b14] px-2.5 py-1 text-[11px] font-medium text-slate-200 outline-none"
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Deferred">Deferred</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: SIMULATE SCENARIO */}
      <AnimatePresence>
        {showSimulateModal && (
          <div className="optimization-modal-backdrop" onClick={() => setShowSimulateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="optimization-modal"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <h3 className="text-[16px] font-semibold">Simulate Security Scenario</h3>
                </div>
                <button onClick={() => setShowSimulateModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-[13px]">
                <div>
                  <label className="text-[11px] text-slate-400">Threat Scenario Model</label>
                  <select className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none">
                    <option>Ransomware Campaign on Core Banking DB</option>
                    <option>Supply Chain Breach via Third-Party Dependency</option>
                    <option>Zero-Day Exploit on Public Edge Firewalls</option>
                    <option>Credential Stuffing & MFA Bypass Attack</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">Allocated Budget for Response (INR)</label>
                  <input
                    type="text"
                    defaultValue="₹ 25,00,000"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                  />
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-[12px]">
                  <p className="font-semibold text-slate-200">Simulation Projections</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      Baseline ALE: <strong className="text-red-400">₹ 3.4 Cr</strong>
                    </div>
                    <div>
                      Post-Remediation ALE: <strong className="text-emerald-400">₹ 78 L</strong>
                    </div>
                    <div>
                      Risk Score Delta: <strong className="text-emerald-400">-34 points</strong>
                    </div>
                    <div>
                      Loss Avoidance: <strong className="text-white">₹ 2.62 Cr</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => setShowSimulateModal(false)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-[12px] font-medium text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSimulateModal(false);
                    if (externalNotify) {
                      externalNotify('Ran Scenario Simulation: Loss avoided ₹ 2.62 Cr.', 'ok');
                    }
                  }}
                  className="rounded-lg bg-[#2563eb] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  Execute Simulation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CREATE CUSTOM PLAN */}
      <AnimatePresence>
        {showCustomPlanModal && (
          <div className="optimization-modal-backdrop" onClick={() => setShowCustomPlanModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="optimization-modal"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-[16px] font-semibold">Create Custom Remediation Plan</h3>
                <button onClick={() => setShowCustomPlanModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-[13px]">
                <div>
                  <label className="text-[11px] text-slate-400">Plan Title</label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">Target Budget Cap</label>
                    <input
                      type="text"
                      value={planBudget}
                      onChange={(e) => setPlanBudget(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Execution Timeframe</label>
                    <select
                      value={planTimeframe}
                      onChange={(e) => setPlanTimeframe(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                    >
                      <option>3 Months (Fast Track)</option>
                      <option>6 Months</option>
                      <option>12 Months (Annual)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">Plan Focus Area</label>
                  <select className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none">
                    <option>Holistic Risk Minimization</option>
                    <option>Regulatory & Compliance Mandates</option>
                    <option>Cloud Infrastructure Hardening</option>
                    <option>Zero Trust Identity & Access</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => setShowCustomPlanModal(false)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-[12px] font-medium text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlanSubmit}
                  className="rounded-lg bg-[#2563eb] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  Create Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ADD CUSTOM RECOMMENDATION */}
      <AnimatePresence>
        {showAddRecModal && (
          <div className="optimization-modal-backdrop" onClick={() => setShowAddRecModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="optimization-modal"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-[16px] font-semibold">Add Custom Recommendation</h3>
                <button onClick={() => setShowAddRecModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-[13px]">
                <div>
                  <label className="text-[11px] text-slate-400">Initiative Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Implement Hardware Security Keys (FIDO2)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe specific risk mitigations and objectives..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                    >
                      <option value="Identity">Identity</option>
                      <option value="Vulnerability">Vulnerability</option>
                      <option value="Endpoint">Endpoint</option>
                      <option value="Resilience">Resilience</option>
                      <option value="Network">Network</option>
                      <option value="Cloud">Cloud</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as RecPriority)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                    >
                      <option value="P0">P0 (Critical)</option>
                      <option value="P1">P1 (High)</option>
                      <option value="P2">P2 (Medium)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">Cost (e.g. ₹ 2.5 L)</label>
                    <input
                      type="text"
                      value={newCost}
                      onChange={(e) => {
                        setNewCost(e.target.value);
                        const match = e.target.value.match(/[\d.]+/);
                        if (match) setNewCostVal(parseFloat(match[0]));
                      }}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">Risk Reduction (pts)</label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={newReduction}
                      onChange={(e) => setNewReduction(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400">ALE Reduction</label>
                    <input
                      type="text"
                      value={newAle}
                      onChange={(e) => setNewAle(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">Affected Scope / Assets</label>
                  <input
                    type="text"
                    value={newAssets}
                    onChange={(e) => setNewAssets(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070b14] px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => setShowAddRecModal(false)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-[12px] font-medium text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomRecommendation}
                  className="rounded-lg bg-[#2563eb] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  Add Initiative
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: INITIATIVE DETAIL */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="optimization-modal-backdrop" onClick={() => setShowDetailModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="optimization-modal"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15 text-blue-400">
                    {renderRecIcon(showDetailModal.iconType)}
                  </span>
                  <h3 className="text-[16px] font-semibold">{showDetailModal.title}</h3>
                </div>
                <button onClick={() => setShowDetailModal(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-[13px]">
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Rationale & Scope</p>
                  <p className="mt-1 text-slate-200">{showDetailModal.desc}</p>
                  <p className="mt-1 text-[12px] text-slate-400">Affected Scope: {showDetailModal.assets}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <div>
                    <span className="text-[11px] text-slate-400">Financial Investment</span>
                    <p className="text-[16px] font-bold text-white">{showDetailModal.cost}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Annual Loss Reduction (ALE)</span>
                    <p className="text-[16px] font-bold text-emerald-400">{showDetailModal.ale}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Risk Score Impact</span>
                    <p className="text-[16px] font-bold text-emerald-400">-{showDetailModal.reduction} points</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Current Status</span>
                    <p className="text-[14px] font-semibold text-blue-400">{showDetailModal.status}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Implementation Milestones</p>
                  <ul className="mt-2 space-y-2 text-[12px] text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      Stage 1: Architecture review and stakeholder sign-off
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      Stage 2: Pilot rollout across non-critical staging groups
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      Stage 3: Full production deployment and policy enforcement
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex justify-end border-t border-white/10 pt-3">
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="rounded-lg bg-[#2563eb] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
