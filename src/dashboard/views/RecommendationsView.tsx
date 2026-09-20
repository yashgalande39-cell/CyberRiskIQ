import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cloud,
  Coins,
  Cpu,
  Database,
  DollarSign,
  Filter,
  Flame,
  Gauge,
  GraduationCap,
  Info,
  Layers,
  Lock,
  MoreHorizontal,
  Network,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import '../../styles/recommendations.css';

export interface RecommendationsViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

export interface RecommendationRow {
  n: number;
  id: string;
  icon: LucideIcon;
  ic: string;
  name: string;
  cat: string;
  risk: string;
  riskTitle: string;
  red: string;
  redNum: number;
  cost: string;
  costNum: number;
  roi: string;
  pr: 'High' | 'Medium' | 'Low';
  st: 'Recommended' | 'In Progress' | 'Not Started' | 'Approved' | 'Implemented' | 'Rejected';
  desc: string;
  implTime: string;
}

const initialRows: RecommendationRow[] = [
  {
    n: 1,
    id: 'rec-1',
    icon: Cpu,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Deploy EDR on all endpoints',
    cat: 'Endpoint Security',
    risk: 'R-001',
    riskTitle: 'R-001 - Malware Infection',
    red: '18%',
    redNum: 18,
    cost: '₹ 60 L',
    costNum: 60,
    roi: '3.8x',
    pr: 'High',
    st: 'Recommended',
    desc: 'Install and configure next-generation EDR solution across all endpoints to detect and respond to threats.',
    implTime: '3 months',
  },
  {
    n: 2,
    id: 'rec-2',
    icon: Lock,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Implement MFA for all users',
    cat: 'Identity & Access',
    risk: 'R-003',
    riskTitle: 'R-003 - Credential Compromise',
    red: '15%',
    redNum: 15,
    cost: '₹ 20 L',
    costNum: 20,
    roi: '4.5x',
    pr: 'High',
    st: 'Recommended',
    desc: 'Enforce hardware-backed or authenticator-based multi-factor authentication for corporate and cloud access.',
    implTime: '1 month',
  },
  {
    n: 3,
    id: 'rec-3',
    icon: Flame,
    ic: 'text-orange-300 bg-orange-500/20',
    name: 'Patch critical vulnerabilities',
    cat: 'Vulnerability Mgmt',
    risk: 'R-005',
    riskTitle: 'R-005 - Known Exploited CVEs',
    red: '12%',
    redNum: 12,
    cost: '₹ 15 L',
    costNum: 15,
    roi: '3.2x',
    pr: 'High',
    st: 'In Progress',
    desc: 'Remediate critical CVEs on internet-facing assets and perimeter firewalls within SLA.',
    implTime: '2 weeks',
  },
  {
    n: 4,
    id: 'rec-4',
    icon: Network,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Network segmentation',
    cat: 'Network Security',
    risk: 'R-008',
    riskTitle: 'R-008 - Lateral Movement',
    red: '12%',
    redNum: 12,
    cost: '₹ 50 L',
    costNum: 50,
    roi: '2.9x',
    pr: 'Medium',
    st: 'Recommended',
    desc: 'Isolate sensitive financial databases, core transaction networks, and guest wireless subnets.',
    implTime: '4 months',
  },
  {
    n: 5,
    id: 'rec-5',
    icon: Activity,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Enable centralized logging',
    cat: 'Monitoring & Detection',
    risk: 'R-011',
    riskTitle: 'R-011 - Undetected Intrusion',
    red: '8%',
    redNum: 8,
    cost: '₹ 40 L',
    costNum: 40,
    roi: '2.1x',
    pr: 'Medium',
    st: 'Recommended',
    desc: 'Aggregate security event logs into unified SIEM with automated threat detection rules and alerts.',
    implTime: '2 months',
  },
  {
    n: 6,
    id: 'rec-6',
    icon: Database,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Data encryption at rest',
    cat: 'Data Protection',
    risk: 'R-013',
    riskTitle: 'R-013 - Data Exfiltration',
    red: '8%',
    redNum: 8,
    cost: '₹ 25 L',
    costNum: 25,
    roi: '2.7x',
    pr: 'Medium',
    st: 'Not Started',
    desc: 'Implement AES-256 transparent data encryption across customer records and backup repositories.',
    implTime: '2 months',
  },
  {
    n: 7,
    id: 'rec-7',
    icon: GraduationCap,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Regular security awareness training',
    cat: 'People & Process',
    risk: 'R-016',
    riskTitle: 'R-016 - Phishing Susceptibility',
    red: '7%',
    redNum: 7,
    cost: '₹ 10 L',
    costNum: 10,
    roi: '2.3x',
    pr: 'Medium',
    st: 'Recommended',
    desc: 'Conduct simulated spear-phishing drills and role-specific compliance education modules.',
    implTime: 'Ongoing',
  },
  {
    n: 8,
    id: 'rec-8',
    icon: Shield,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Implement DLP solution',
    cat: 'Data Protection',
    risk: 'R-018',
    riskTitle: 'R-018 - Insider Data Leak',
    red: '6%',
    redNum: 6,
    cost: '₹ 35 L',
    costNum: 35,
    roi: '2.4x',
    pr: 'Medium',
    st: 'Not Started',
    desc: 'Prevent unauthorized data transfer through USB, email attachments, and unauthorized cloud storage.',
    implTime: '3 months',
  },
  {
    n: 9,
    id: 'rec-9',
    icon: Cloud,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Cloud security posture management',
    cat: 'Cloud Security',
    risk: 'R-020',
    riskTitle: 'R-020 - Cloud Misconfiguration',
    red: '6%',
    redNum: 6,
    cost: '₹ 40 L',
    costNum: 40,
    roi: '2.1x',
    pr: 'Low',
    st: 'Recommended',
    desc: 'Deploy automated CSPM tooling to audit cloud drift, storage bucket permissions, and IAM privileges.',
    implTime: '1.5 months',
  },
  {
    n: 10,
    id: 'rec-10',
    icon: RotateCcw,
    ic: 'text-blue-300 bg-blue-500/20',
    name: 'Disaster recovery & backup improvement',
    cat: 'Business Continuity',
    risk: 'R-022',
    riskTitle: 'R-022 - Extended Service Outage',
    red: '5%',
    redNum: 5,
    cost: '₹ 30 L',
    costNum: 30,
    roi: '1.8x',
    pr: 'Low',
    st: 'Not Started',
    desc: 'Establish immutable air-gapped backups and conduct quarterly disaster recovery tabletop exercises.',
    implTime: '3 months',
  },
];

const categories = [
  { name: 'Endpoint Security', pct: 25, color: '#2f7cf6' },
  { name: 'Network Security', pct: 17, color: '#f97316' },
  { name: 'Identity & Access', pct: 13, color: '#eab308' },
  { name: 'Data Protection', pct: 13, color: '#22d3ee' },
  { name: 'Monitoring & Detection', pct: 13, color: '#22c55e' },
  { name: 'Cloud Security', pct: 8, color: '#a855f7' },
  { name: 'Business Continuity', pct: 8, color: '#6366f1' },
  { name: 'People & Process', pct: 4, color: '#ef4444' },
];

const tabLabels = [
  'All Recommendations (24)',
  'Not Started (12)',
  'In Progress (6)',
  'Approved (4)',
  'Implemented (2)',
  'Rejected (0)',
];

const priorityCls = (p: string) =>
  'inline-block w-[66px] text-center py-[3px] rounded text-[11px] font-medium ' +
  (p === 'High'
    ? 'bg-[#8b1a1a] text-red-100'
    : p === 'Medium'
    ? 'bg-[#7a4a0c] text-amber-100'
    : 'bg-[#0f4d3a] text-emerald-100');

const statusCls = (s: string) =>
  'inline-block w-[92px] text-center py-[3px] rounded text-[11px] font-medium ' +
  (s === 'Recommended'
    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
    : s === 'In Progress'
    ? 'bg-[#0f2f7a] text-blue-100 border border-blue-600/60'
    : s === 'Approved'
    ? 'bg-purple-950 text-purple-200 border border-purple-700/60'
    : s === 'Implemented'
    ? 'bg-emerald-900 text-white border border-emerald-500'
    : s === 'Rejected'
    ? 'bg-rose-950 text-rose-300 border border-rose-800'
    : 'bg-[#141e33] text-slate-300 border border-[#24365e]');

const Card = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-xl border border-[#182540] bg-[#0b1426] ${className}`}>{children}</div>
);

function Donut() {
  const size = 150,
    sw = 26,
    r = (size - sw) / 2,
    C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {categories.map((c, i) => {
          const len = (c.pct / 100) * C - 2.5;
          const off = -(acc / 100) * C;
          acc += c.pct;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={c.color}
              strokeWidth={sw}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={off}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[28px] font-bold leading-none">24</div>
        <div className="mt-1 text-[11px] text-slate-300">Total</div>
      </div>
    </div>
  );
}

function ComboChart() {
  const W = 430,
    H = 150,
    pl = 34,
    pr = 34,
    pt = 10,
    pb = 22;
  const iw = W - pl - pr,
    ih = H - pt - pb;
  const bars = [0.5, 0.85, 1.05, 1.6],
    line = [30, 40, 58, 72];
  const q = ['Q1', 'Q2', 'Q3', 'Q4'];
  const bx = (i: number) => pl + (i + 0.5) * (iw / 4);
  const yL = (v: number) => pt + ih - (v / 2) * ih;
  const yR = (v: number) => pt + ih - (v / 80) * ih;
  const bw = 34;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 0.5, 1, 1.5, 2].map((v) => (
        <g key={v}>
          <line x1={pl} y1={yL(v)} x2={W - pr} y2={yL(v)} stroke="#16233c" strokeDasharray="3 3" />
          <text x={pl - 6} y={yL(v) + 3} textAnchor="end" fontSize={9.5} fill="#94a3b8">
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {[0, 20, 40, 60, 80].map((v) => (
        <text key={v} x={W - pr + 6} y={yR(v) + 3} fontSize={9.5} fill="#94a3b8">
          {v}
        </text>
      ))}
      {bars.map((v, i) => (
        <rect key={i} x={bx(i) - bw / 2} y={yL(v)} width={bw} height={yL(0) - yL(v)} fill="#1f7cf6" rx={1} />
      ))}
      <path
        d={line.map((v, i) => `${i ? 'L' : 'M'} ${bx(i)} ${yR(v)}`).join(' ')}
        fill="none"
        stroke="#34d399"
        strokeWidth={2}
      />
      {line.map((v, i) => (
        <circle key={i} cx={bx(i)} cy={yR(v)} r={4} fill="#34d399" stroke="#0b1426" strokeWidth={1.5} />
      ))}
      {q.map((l, i) => (
        <text key={l} x={bx(i)} y={H - 6} textAnchor="middle" fontSize={10} fill="#cbd5e1">
          {l}
        </text>
      ))}
    </svg>
  );
}

export default function RecommendationsView({ onNav: _onNav, externalNotify }: RecommendationsViewProps) {
  const [tab, setTab] = useState(0);
  const [dtab, setDtab] = useState<'Overview' | 'Impact' | 'Implementation' | 'Related'>('Overview');
  const [panelOpen, setPanelOpen] = useState(true);
  const [checked, setChecked] = useState<number[]>([1, 2]);
  const [selectedRow, setSelectedRow] = useState<RecommendationRow>(initialRows[0]);
  const [rows, setRows] = useState<RecommendationRow[]>(initialRows);
  const [sortBy, setSortBy] = useState<'Risk Reduction' | 'Cost' | 'ROI' | 'Priority'>('Risk Reduction');
  const [showAiModal, setShowAiModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [aiFocus, setAiFocus] = useState('Critical Infrastructure');
  const [aiBudget, setAiBudget] = useState('₹ 1.5 Cr');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleCheck = (n: number) => {
    setChecked((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n]));
  };

  const toggleSelectAll = () => {
    if (checked.length === filteredRows.length) {
      setChecked([]);
    } else {
      setChecked(filteredRows.map((r) => r.n));
    }
  };

  const filteredRows = useMemo(() => {
    let list = [...rows];
    if (tab === 1) list = list.filter((r) => r.st === 'Not Started');
    else if (tab === 2) list = list.filter((r) => r.st === 'In Progress');
    else if (tab === 3) list = list.filter((r) => r.st === 'Approved');
    else if (tab === 4) list = list.filter((r) => r.st === 'Implemented');
    else if (tab === 5) list = list.filter((r) => r.st === 'Rejected');

    if (categoryFilter !== 'All') {
      list = list.filter((r) => r.cat === categoryFilter);
    }
    if (priorityFilter !== 'All') {
      list = list.filter((r) => r.pr === priorityFilter);
    }

    if (sortBy === 'Risk Reduction') {
      list.sort((a, b) => b.redNum - a.redNum);
    } else if (sortBy === 'Cost') {
      list.sort((a, b) => b.costNum - a.costNum);
    } else if (sortBy === 'ROI') {
      list.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
    } else if (sortBy === 'Priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      list.sort((a, b) => pMap[b.pr] - pMap[a.pr]);
    }
    return list;
  }, [rows, tab, categoryFilter, priorityFilter, sortBy]);

  function handleRowClick(r: RecommendationRow) {
    setSelectedRow(r);
    setPanelOpen(true);
  }

  function handleAddToPlan(item: RecommendationRow) {
    if (externalNotify) {
      externalNotify(`Added "${item.name}" (${item.cost}) to Remediation Investment Plan.`, 'ok');
    }
  }

  function handleCreateTask(item: RecommendationRow) {
    if (externalNotify) {
      externalNotify(`Created JIRA / ServiceNow implementation ticket for "${item.name}".`, 'ok');
    }
  }

  function handleGenerateAi() {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowAiModal(false);
      const newRec: RecommendationRow = {
        n: rows.length + 1,
        id: `rec-${Date.now()}`,
        icon: Sparkles,
        ic: 'text-violet-300 bg-violet-500/20',
        name: `AI: Zero Trust Micro-Segmentation (${aiFocus})`,
        cat: 'Network Security',
        risk: 'R-025',
        riskTitle: `R-025 - ${aiFocus} Lateral Vulnerability`,
        red: '16%',
        redNum: 16,
        cost: aiBudget,
        costNum: 55,
        roi: '4.2x',
        pr: 'High',
        st: 'Recommended',
        desc: `AI-synthesized security recommendation tailored for ${aiFocus} with budget constraint ${aiBudget}.`,
        implTime: '2 months',
      };
      setRows((prev) => [newRec, ...prev]);
      setSelectedRow(newRec);
      setPanelOpen(true);
      if (externalNotify) {
        externalNotify(`AI generated new recommendation: ${newRec.name}`, 'ok');
      }
    }, 1200);
  }

  return (
    <div className="recommendations-page">
      {/* Standard Header matching Security Controls */}
      <header className="sc-page-header">
        <div>
          <p className="sc-breadcrumb">Home &gt; Optimize &gt; <span>Recommendations</span></p>
          <h1>Actionable Recommendations</h1>
          <p>Prioritized interventions to reduce quantified risk, optimize spend, and strengthen security posture.</p>
        </div>
        <div className="sc-header-actions">
          <div className="sc-motto">
            <span>RIGHT INVESTMENTS</span>
            <span>STRONGER DEFENSE</span>
            <span>A SAFER TOMORROW</span>
          </div>
          <button
            onClick={() => setShowAiModal(true)}
            className="sc-action-btn"
          >
            <Plus size={16} /> Generate with AI
          </button>
        </div>
      </header>

      <main className="mt-2 space-y-3 px-0 pb-4">
        {/* Top 5 KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <Card className="flex items-center gap-3.5 p-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-500">
              <Target size={26} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="whitespace-nowrap text-[12px] text-slate-300">Total Recommendations</div>
              <div className="text-[24px] font-bold leading-tight text-white">24</div>
              <div className="flex items-center gap-1 whitespace-nowrap text-[12px] text-emerald-400">
                <ArrowUp size={11} />
                8% <span className="text-slate-400">vs last month</span>
              </div>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5 p-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 size={26} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="whitespace-nowrap text-[12px] text-slate-300">High Impact</div>
              <div className="text-[24px] font-bold leading-tight text-white">12</div>
              <div className="whitespace-nowrap text-[12px] text-slate-300">50% of total</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5 p-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
              <Clock size={26} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="whitespace-nowrap text-[12px] text-slate-300">Estimated Risk Reduction</div>
              <div className="text-[24px] font-bold leading-tight text-white">68%</div>
              <div className="whitespace-nowrap text-[12px] text-slate-300">(₹ 12.6 Cr)</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5 p-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
              <Coins size={26} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="whitespace-nowrap text-[12px] text-slate-300">Total Estimated Cost</div>
              <div className="text-[24px] font-bold leading-tight text-white">₹ 2.8 Cr</div>
              <div className="whitespace-nowrap text-[12px] text-emerald-400">Budget approved</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5 p-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
              <BarChart2 size={26} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="whitespace-nowrap text-[12px] text-slate-300">Expected ROI</div>
              <div className="text-[24px] font-bold leading-tight text-white">3.1x</div>
              <div className="whitespace-nowrap text-[12px] text-slate-300">(in 12 months)</div>
            </div>
          </Card>
        </div>

        {/* Tabs + Sort + Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 overflow-x-auto rounded-lg border border-[#182540] bg-[#0b1426]">
            {tabLabels.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`h-[38px] whitespace-nowrap px-4 text-[13px] transition ${
                  i > 0 ? 'border-l border-[#182540]' : ''
                } ${
                  tab === i
                    ? 'border-b-2 border-b-blue-500 bg-[#132445] font-medium text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-slate-300">Sort by</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex h-[38px] w-[170px] appearance-none items-center justify-between rounded-lg border border-[#2a3a5c] bg-[#0b1426] px-3 pr-8 text-[13px] text-white outline-none"
            >
              <option value="Risk Reduction">Risk Reduction</option>
              <option value="Cost">Cost</option>
              <option value="ROI">ROI</option>
              <option value="Priority">Priority</option>
            </select>
            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex h-[38px] items-center gap-2 rounded-lg border border-[#2a3a5c] bg-[#0b1426] px-4 text-[13px] text-slate-200 transition hover:bg-white/5"
          >
            <Filter size={14} />
            Filters {categoryFilter !== 'All' || priorityFilter !== 'All' ? '•' : ''}
          </button>
        </div>

        {/* Table + Detail Panel */}
        <div className="flex flex-col gap-3 lg:flex-row">
          <Card className="min-w-0 flex-1 overflow-hidden">
            <div className="overflow-x-auto rec-scroll">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-[#111c33] text-[12px] text-slate-300">
                    <th className="w-9 px-3 py-2.5">
                      <button
                        onClick={toggleSelectAll}
                        className={`block h-3.5 w-3.5 rounded-sm border ${
                          checked.length === filteredRows.length && filteredRows.length > 0
                            ? 'border-blue-500 bg-blue-600'
                            : 'border-slate-500'
                        }`}
                      />
                    </th>
                    <th className="w-8 px-2 py-2.5 text-left font-medium">#</th>
                    <th className="px-2 py-2.5 text-left font-medium">Recommendation</th>
                    <th className="px-2 py-2.5 text-left font-medium">Category</th>
                    <th className="px-2 py-2.5 text-left font-medium">Related Risk</th>
                    <th className="px-2 py-2.5 text-left font-medium">Risk Reduction</th>
                    <th className="px-2 py-2.5 text-left font-medium">Cost (₹)</th>
                    <th className="px-2 py-2.5 text-left font-medium">ROI</th>
                    <th className="px-2 py-2.5 text-center font-medium">Priority</th>
                    <th className="px-2 py-2.5 text-center font-medium">Status</th>
                    <th className="px-2 py-2.5 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => handleRowClick(r)}
                      className={`cursor-pointer border-t border-[#14203a] transition hover:bg-[#0e1a30] ${
                        selectedRow.id === r.id ? 'bg-[#0f1d38]' : ''
                      }`}
                    >
                      <td className="px-3 py-[7px]" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleCheck(r.n)}
                          className={`block h-3.5 w-3.5 rounded-sm border ${
                            checked.includes(r.n) ? 'border-blue-500 bg-blue-600' : 'border-slate-500'
                          }`}
                        />
                      </td>
                      <td className="px-2 py-[7px] text-slate-300">{r.n}</td>
                      <td className="px-2 py-[7px]">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${r.ic}`}>
                            <r.icon size={12} />
                          </span>
                          <span className="max-w-[210px] leading-tight text-slate-100">{r.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-2 py-[7px] text-slate-200">{r.cat}</td>
                      <td className="px-2 py-[7px] text-slate-200">{r.risk}</td>
                      <td className="px-2 py-[7px] font-medium text-emerald-400">{r.red}</td>
                      <td className="whitespace-nowrap px-2 py-[7px] text-slate-200">{r.cost}</td>
                      <td className="px-2 py-[7px] text-emerald-400">{r.roi}</td>
                      <td className="px-2 py-[7px] text-center">
                        <span className={priorityCls(r.pr)}>{r.pr}</span>
                      </td>
                      <td className="px-2 py-[7px] text-center">
                        <span className={statusCls(r.st)}>{r.st}</span>
                      </td>
                      <td className="px-2 py-[7px] text-center text-slate-300" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleAddToPlan(r)}
                          title="Add to Plan"
                          className="mx-auto flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400">
                        No recommendations matching the active filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right Detail Panel */}
          {panelOpen && (
            <Card className="w-full shrink-0 self-start p-3.5 lg:w-[340px]">
              <div className="flex items-start justify-between">
                <h3 className="text-[15px] font-semibold text-white">{selectedRow.name}</h3>
                <button onClick={() => setPanelOpen(false)} className="mt-0.5 text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-1 flex justify-end">
                <span className="rounded bg-[#8b1a1a] px-2 py-[2px] text-[11px] font-medium text-red-100">
                  {selectedRow.pr} Priority
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-slate-200">{selectedRow.desc}</p>

              <div className="mt-3 flex border-b border-[#182540]">
                {(['Overview', 'Impact', 'Implementation', 'Related'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDtab(t)}
                    className={`h-8 px-3 text-[12px] transition ${
                      dtab === t ? 'rounded-t border-b-2 border-blue-500 bg-[#132445] text-white' : 'text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {dtab === 'Overview' && (
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3">
                  {[
                    { icon: Layers, c: 'bg-blue-500/20 text-blue-300', l: 'Category', v: selectedRow.cat },
                    { icon: Shield, c: 'bg-indigo-500/20 text-indigo-300', l: 'Related Risk', v: selectedRow.riskTitle },
                    { icon: Gauge, c: 'bg-red-500/20 text-red-400', l: 'Risk Reduction', v: `${selectedRow.red} (₹ 3.2 Cr)` },
                    { icon: DollarSign, c: 'bg-amber-500/20 text-amber-300', l: 'Estimated Cost', v: selectedRow.cost },
                    { icon: TrendingUp, c: 'bg-emerald-500/20 text-emerald-300', l: 'Expected ROI', v: `${selectedRow.roi} (in 12 months)` },
                    { icon: Timer, c: 'bg-violet-500/20 text-violet-300', l: 'Implementation Time', v: selectedRow.implTime },
                  ].map((f) => (
                    <div key={f.l} className="flex gap-2">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${f.c}`}>
                        <f.icon size={14} />
                      </span>
                      <div className="leading-tight">
                        <div className="text-[11px] text-slate-400">{f.l}</div>
                        <div className="mt-0.5 text-[12px] text-slate-100">{f.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {dtab === 'Impact' && (
                <div className="mt-3 space-y-2 text-[12px] text-slate-300">
                  <p>
                    Reduces organizational exposure to lateral adversary propagation by{' '}
                    <strong className="text-emerald-400">{selectedRow.red}</strong>.
                  </p>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                    <p className="text-[11px] text-slate-400">Projected ROSI (Return on Security Investment):</p>
                    <p className="text-[16px] font-bold text-emerald-400">{selectedRow.roi}</p>
                  </div>
                </div>
              )}

              {dtab === 'Implementation' && (
                <div className="mt-3 space-y-2 text-[12px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span>Duration: {selectedRow.implTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span>Resource requirement: 2 FTE engineers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span>Integration: Active Directory & SIEM</span>
                  </div>
                </div>
              )}

              {dtab === 'Related' && (
                <div className="mt-3 space-y-2 text-[12px] text-slate-300">
                  <p>
                    Linked Risk Finding: <strong className="text-blue-300">{selectedRow.riskTitle}</strong>
                  </p>
                  <p>Framework Mapping: NIST CSF (PR.AC-1, DE.CM-1), CIS Controls v8 (Control 10).</p>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/20 text-blue-300">
                  <Users size={14} />
                </span>
                <span className="text-[12px] text-slate-300">Status</span>
                <span className={statusCls(selectedRow.st)}>{selectedRow.st}</span>
              </div>

              <button
                onClick={() => handleAddToPlan(selectedRow)}
                className="mt-3 h-9 w-full rounded-md bg-[#2563eb] text-[13px] font-medium text-white transition hover:bg-blue-600"
              >
                Add to Investment Plan
              </button>
              <button
                onClick={() => handleCreateTask(selectedRow)}
                className="mt-2 h-9 w-full rounded-md border border-[#2a3a5c] bg-[#0e1a30] text-[13px] text-slate-200 transition hover:bg-[#152545]"
              >
                Create Implementation Task
              </button>
            </Card>
          )}
        </div>

        {/* Bottom Diagnostics Row (3 cards) */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[30fr_32fr_38fr]">
          <Card className="p-3.5">
            <h3 className="mb-3 text-[14px] font-semibold text-white">Recommendations by Category</h3>
            <div className="flex items-center gap-4">
              <Donut />
              <div className="flex-1 space-y-[7px]">
                {categories.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-[11.5px]">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="flex-1 text-slate-200">{c.name}</span>
                    <span className="text-slate-300">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-3.5">
            <h3 className="mb-3 flex items-center gap-1.5 text-[14px] font-semibold text-white">
              Expected Risk Reduction <Info size={13} className="text-slate-400" />
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-[12.5px] text-slate-300">Current Risk Score</div>
                <div className="text-[30px] font-bold leading-tight text-white">
                  72 <span className="text-[13px] font-normal text-slate-400">/ 100</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-[#16233c]">
                  <div className="h-full rounded-full bg-red-500" style={{ width: '72%' }} />
                </div>
                <div className="mt-3 text-[12.5px] text-slate-300">After Implementation</div>
                <div className="text-[30px] font-bold leading-tight text-white">
                  28 <span className="text-[13px] font-normal text-slate-400">/ 100</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-[#16233c]">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: '28%' }} />
                </div>
              </div>
              <div className="flex h-[100px] w-[120px] flex-col items-center justify-center rounded-lg border border-emerald-700/60 bg-[#0b2a24]">
                <div className="flex items-center gap-1 text-[28px] font-bold leading-none text-emerald-400">
                  <ArrowDown size={22} />
                  61%
                </div>
                <div className="mt-1 text-[12px] text-emerald-300">Risk Reduction</div>
              </div>
            </div>
          </Card>

          <Card className="p-3.5">
            <h3 className="mb-1 text-[14px] font-semibold text-white">Investment vs Risk Reduction</h3>
            <div className="mb-1 flex justify-center gap-5 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1f7cf6]" />
                Investment (₹ Cr)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Risk Reduction (%)
              </span>
            </div>
            <div className="flex items-center">
              <span
                className="text-[9.5px] text-slate-400"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Investment (₹ Cr)
              </span>
              <div className="flex-1">
                <ComboChart />
              </div>
              <span className="text-[9.5px] text-slate-400" style={{ writingMode: 'vertical-rl' }}>
                Risk Reduction (%)
              </span>
            </div>
          </Card>
        </div>

        {/* AI Callout Banner */}
        <div className="flex h-[60px] items-center gap-3 rounded-xl border border-violet-700/50 bg-gradient-to-r from-[#141a3a] via-[#0e1530] to-[#1a1440] px-4">
          <Sparkles size={22} className="text-violet-300" />
          <span className="flex-1 text-[13px] text-slate-100">
            Use AI to get personalized recommendations based on your organization's risk profile, budget, and industry.
          </span>
          <button
            onClick={() => setShowAiModal(true)}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#6d3df5] px-4 text-[13px] font-medium text-white transition hover:bg-violet-500"
          >
            Generate AI Recommendations <ArrowRight size={15} />
          </button>
        </div>
      </main>

      {/* MODAL: GENERATE WITH AI */}
      <AnimatePresence>
        {showAiModal && (
          <div className="recommendations-modal-backdrop" onClick={() => setShowAiModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="recommendations-modal"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-violet-400" size={18} />
                  <h3 className="text-[16px] font-semibold">Generate AI Security Recommendations</h3>
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-[13px]">
                <div>
                  <label className="text-[11px] text-slate-400">Target Strategic Focus</label>
                  <select
                    value={aiFocus}
                    onChange={(e) => setAiFocus(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070f21] px-3 py-2 text-white outline-none"
                  >
                    <option value="Critical Infrastructure">Critical Infrastructure & Core Banking</option>
                    <option value="Cloud Security Posture">Cloud Security Posture (AWS/Azure/GCP)</option>
                    <option value="Zero Trust Identity">Zero Trust Identity & Access Architecture</option>
                    <option value="Endpoint Resilience">Endpoint Resilience & EDR Coverage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">Available Capital Budget</label>
                  <input
                    type="text"
                    value={aiBudget}
                    onChange={(e) => setAiBudget(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070f21] px-3 py-2 text-white outline-none"
                  />
                </div>

                <div className="rounded-lg border border-violet-500/20 bg-violet-950/20 p-3 text-[12px] text-violet-200">
                  CyberRiskIQ's neural quantification model will cross-reference 1,248 active CVEs, asset criticality, and regulatory mandates (RBI/SEBI/ISO) to generate prioritized recommendations.
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-[12px] text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateAi}
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-lg bg-[#6d3df5] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RotateCcw className="animate-spin" size={14} /> Generating...
                    </>
                  ) : (
                    'Run AI Recommendation Engine'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: FILTERS */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="recommendations-modal-backdrop" onClick={() => setShowFilterModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="recommendations-modal max-w-[480px]"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-[16px] font-semibold">Filter Recommendations</h3>
                <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-[13px]">
                <div>
                  <label className="text-[11px] text-slate-400">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070f21] px-3 py-2 text-white outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Endpoint Security">Endpoint Security</option>
                    <option value="Identity & Access">Identity & Access</option>
                    <option value="Vulnerability Mgmt">Vulnerability Mgmt</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Monitoring & Detection">Monitoring & Detection</option>
                    <option value="Data Protection">Data Protection</option>
                    <option value="Cloud Security">Cloud Security</option>
                    <option value="Business Continuity">Business Continuity</option>
                    <option value="People & Process">People & Process</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#070f21] px-3 py-2 text-white outline-none"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-between border-t border-white/10 pt-3">
                <button
                  onClick={() => {
                    setCategoryFilter('All');
                    setPriorityFilter('All');
                  }}
                  className="text-[12px] text-slate-400 hover:text-white"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="rounded-lg bg-[#2563eb] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-600"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
