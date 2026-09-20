import { useState, type ReactNode } from "react";
import {
  FileDown,
  Plus,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  AlertTriangle,
  Layers,
  FileText,
  Globe,
  CreditCard,
  PlusCircle,
  Network,
  Check,
  CheckCircle2,
  FileUp,
  ClipboardCheck,
  AlertOctagon,
  Award,
  Play,
  FileBarChart,
  Settings,
  BookOpen,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import "../../styles/compliance.css";
import {
  frameworkDetails,
  healthRows,
  complianceGaps,
  recentActivities,
  auditChecklist as initialAuditChecklist,
  type FrameworkDetail,
  type FrameworkStatus,
  type GapRisk,
  type GapStatus,
  type ActivityTone,
} from "./compliance/complianceData";
import {
  ComplianceGauge,
  FrameworkScoreBar,
  ImplementationDonut,
  ComplianceTrend,
  TrendLegend,
  overallCompliance,
} from "./compliance/ComplianceCharts";

const lockImg = "/images/compliance-lock.jpg";

interface ComplianceViewProps {
  onNav?: (id: string) => void;
  externalNotify?: (text: string, kind?: "ok" | "info") => void;
}

const tabs = [
  "Overview",
  "Frameworks",
  "Control Mapping",
  "Policy Management",
  "Audit Readiness",
  "Evidence Collection",
];

/* ============================== Banner ============================== */
function ComplianceBanner({
  externalNotify,
}: {
  onNav?: (id: string) => void;
  externalNotify?: (text: string, kind?: "ok" | "info") => void;
}) {
  return (
    <header className="sc-page-header">
      <div>
        <p className="sc-breadcrumb">Home &gt; Governance &gt; <span>Compliance</span></p>
        <h1>Compliance &amp; Governance</h1>
        <p>Continuous regulatory control mapping, gap remediation, and audit-readiness tracking.</p>
      </div>
      <div className="sc-header-actions">
        <div className="sc-motto">
          <span>COMPLIANCE TODAY</span>
          <span>RESILIENCE TOMORROW</span>
          <span>CONTINUOUS ASSURANCE</span>
        </div>
        <button
          type="button"
          onClick={() => externalNotify?.("Downloading full Compliance & Governance Report (PDF)...", "info")}
          className="sc-action-btn sc-btn-secondary"
        >
          <FileDown className="h-3.5 w-3.5" /> Download Report
        </button>
        <button
          type="button"
          onClick={() => externalNotify?.("Add Framework dialog opened.", "ok")}
          className="sc-action-btn"
        >
          <Plus className="h-3.5 w-3.5" /> Add Framework
        </button>
      </div>
    </header>
  );
}

function TabsBar({
  activeTab,
  onSelectTab,
}: {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}) {
  return (
    <nav className="detail-tabs" style={{ marginBottom: '14px', borderBottom: '1px solid var(--sc-border, #06314a)' }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelectTab(tab)}
          className={tab === activeTab ? "is-active" : ""}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

/* ============================== KPI cards ============================== */

function KpiCard({
  label,
  icon: Icon,
  iconCls,
  value,
  sub,
  delta,
}: {
  label: string;
  icon: LucideIcon;
  iconCls: string;
  value: ReactNode;
  sub?: ReactNode;
  delta?: ReactNode;
}) {
  return (
    <div className="card flex min-h-[112px] flex-col p-3.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11.5px] font-medium text-[#8ea5be]">{label}</span>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconCls}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </div>
      </div>
      <div className="mt-1 text-[22px] font-extrabold leading-tight text-white">{value}</div>
      {delta ? <div className="mt-1 flex items-center gap-1 text-[10.5px]">{delta}</div> : null}
      {sub ? <div className="mt-1 text-[10.5px] leading-tight text-[#64809f]">{sub}</div> : null}
    </div>
  );
}

function KpiTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {/* Overall compliance */}
      <div className="card flex min-h-[112px] flex-col p-3.5">
        <div className="text-[11.5px] font-medium text-[#8ea5be]">Overall Compliance</div>
        <div className="mt-1 flex flex-1 items-center gap-3">
          <ComplianceGauge value={overallCompliance} />
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-emerald-400">+ 8%</div>
            <div className="mt-0.5 text-[10px] leading-tight text-[#64809f]">vs last quarter</div>
          </div>
        </div>
      </div>

      {/* Compliant controls */}
      <KpiCard
        label="Compliant Controls"
        icon={ShieldCheck}
        iconCls="border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
        value={
          <>
            342 <span className="text-[13px] font-semibold text-[#7d94b0]">/ 438</span>
          </>
        }
        delta={
          <>
            <span className="flex items-center font-bold text-emerald-400">
              <ArrowUp className="h-3 w-3" strokeWidth={2.6} />
              12%
            </span>
            <span className="text-[#64809f]">vs last month</span>
          </>
        }
      />

      {/* Open gaps */}
      <KpiCard
        label="Open Gaps"
        icon={AlertTriangle}
        iconCls="border-red-500/30 bg-red-500/15 text-red-400 shadow-[0_0_18px_-6px_rgba(239,68,68,0.8)]"
        value="96"
        delta={
          <>
            <span className="flex items-center font-bold text-emerald-400">
              <ArrowDown className="h-3 w-3" strokeWidth={2.6} />
              18%
            </span>
            <span className="text-[#64809f]">vs last month</span>
          </>
        }
      />

      {/* Frameworks */}
      <KpiCard
        label="Frameworks"
        icon={Layers}
        iconCls="border-sky-500/30 bg-sky-500/15 text-[#38bdf8]"
        value="5"
        sub="Active frameworks"
      />

      {/* Audit readiness */}
      <KpiCard
        label="Audit Readiness"
        icon={FileText}
        iconCls="border-sky-500/30 bg-sky-500/15 text-[#38bdf8]"
        value={<span className="text-emerald-400">Ready</span>}
        sub={
          <>
            Last assessed
            <br />
            Jun 20, 2024
          </>
        }
      />
    </div>
  );
}

/* ============================== Framework table ============================== */

const frameworkIcons: Record<FrameworkDetail["icon"], LucideIcon> = {
  globe: Globe,
  shield: ShieldCheck,
  card: CreditCard,
  plus: PlusCircle,
  network: Network,
};

function complianceTone(v: number) {
  if (v >= 85) return "text-emerald-400";
  if (v >= 78) return "text-amber-400";
  if (v >= 70) return "text-orange-400";
  return "text-red-400";
}

const frameworkStatusStyles: Record<FrameworkStatus, string> = {
  Compliant: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
  "Needs Attention": "border-amber-400/40 bg-amber-400/15 text-amber-300",
  "In Progress": "border-blue-500/40 bg-blue-500/15 text-blue-300",
};

function FrameworkDetailsTable({
  onViewFramework,
}: {
  onViewFramework?: (name: string) => void;
}) {
  return (
    <div className="card p-4">
      <h2 className="text-[14px] font-bold text-white">Framework Compliance Details</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-[#153152] text-[10.5px] font-semibold text-[#6f88a6]">
              <th className="py-2 pr-2 font-semibold">Framework</th>
              <th className="py-2 pr-2 font-semibold">Compliance</th>
              <th className="py-2 pr-2 font-semibold">Total Controls</th>
              <th className="py-2 pr-2 font-semibold">Compliant</th>
              <th className="py-2 pr-2 font-semibold">Partially</th>
              <th className="py-2 pr-2 font-semibold">Non-Compliant</th>
              <th className="py-2 pr-2 font-semibold">Status</th>
              <th className="py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {frameworkDetails.map((f) => {
              const Icon = frameworkIcons[f.icon];
              return (
                <tr
                  key={f.name}
                  className="border-b border-[#0f243d] last:border-0 hover:bg-[#0c1f38]/50"
                >
                  <td className="py-2.5 pr-2">
                    <span className="flex items-center gap-2 font-medium text-white">
                      <Icon className="h-4 w-4 text-[#38bdf8]" strokeWidth={1.9} />
                      {f.name}
                    </span>
                  </td>
                  <td className={`py-2.5 pr-2 font-bold tabular-nums ${complianceTone(f.compliance)}`}>
                    {f.compliance}%
                  </td>
                  <td className="py-2.5 pr-2 tabular-nums text-[#c6daf2]">{f.total}</td>
                  <td className="py-2.5 pr-2 font-semibold tabular-nums text-emerald-400">
                    {f.compliant}
                  </td>
                  <td className="py-2.5 pr-2 font-semibold tabular-nums text-amber-400">
                    {f.partially}
                  </td>
                  <td className="py-2.5 pr-2 font-semibold tabular-nums text-red-400">
                    {f.nonCompliant}
                  </td>
                  <td className="py-2.5 pr-2">
                    <span
                      className={`inline-block whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-bold ${frameworkStatusStyles[f.status]}`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      onClick={() => onViewFramework?.(f.name)}
                      className="flex items-center gap-1 whitespace-nowrap rounded-md bg-[#1d4ed8]/80 px-2.5 py-0.5 text-[10.5px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
                    >
                      View <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== Activities ============================== */

const activityIcon: Record<ActivityTone, { icon: LucideIcon; cls: string }> = {
  green: { icon: CheckCircle2, cls: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400" },
  blue: { icon: FileUp, cls: "border-sky-500/30 bg-sky-500/15 text-sky-400" },
  blue2: { icon: ClipboardCheck, cls: "border-blue-500/30 bg-blue-500/15 text-blue-400" },
  red: { icon: AlertOctagon, cls: "border-red-500/30 bg-red-500/15 text-red-400" },
  yellow: { icon: Award, cls: "border-amber-400/30 bg-amber-400/15 text-amber-400" },
};

function RecentActivities({
  onViewAll,
}: {
  onViewAll?: () => void;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-white">Recent Compliance Activities</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-[11.5px] font-semibold text-[#38bdf8] transition-colors hover:text-[#7dd3fc]"
        >
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-3">
        {recentActivities.map((a, i) => {
          const cfg = activityIcon[a.tone];
          const Icon = cfg.icon;
          const last = i === recentActivities.length - 1;
          return (
            <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
              {!last && (
                <span className="absolute left-[15px] top-9 h-[calc(100%-28px)] w-px bg-[#153152]" />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${cfg.cls}`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="flex min-w-0 flex-1 items-baseline gap-3 pt-1">
                <span className="w-[62px] shrink-0 text-[10.5px] font-medium text-[#7d94b0]">
                  {a.time}
                </span>
                <span className="min-w-0 flex-1 text-[11.5px] leading-snug text-[#dbe7f5]">
                  {a.text}
                </span>
                <span className="shrink-0 text-[10.5px] font-medium text-[#7d94b0]">
                  {a.framework}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== Audit checklist ============================== */

function AuditChecklist({
  checklist,
  onToggleItem,
}: {
  checklist: typeof initialAuditChecklist;
  onToggleItem: (index: number) => void;
}) {
  const done = checklist.filter((c) => c.done).length;
  const pct = Math.round((done / checklist.length) * 100);
  return (
    <div className="card p-4">
      <h2 className="text-[14px] font-bold text-white">Audit Readiness Checklist</h2>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[11.5px] font-medium text-[#9db4d0]">
          {done}/{checklist.length} completed
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#122c47]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#34d399] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[11.5px] font-bold text-white">{pct}%</span>
      </div>

      <ul className="mt-4 space-y-3">
        {checklist.map((item, idx) => (
          <li
            key={item.label}
            onClick={() => onToggleItem(idx)}
            className="flex cursor-pointer items-center gap-2.5 text-[11.5px] select-none hover:opacity-90"
          >
            {item.done ? (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-emerald-500">
                <Check className="h-3 w-3 text-[#04241b]" strokeWidth={3.2} />
              </span>
            ) : (
              <span className="h-4 w-4 shrink-0 rounded-[4px] border border-[#3b5575] bg-transparent" />
            )}
            <span className={item.done ? "text-[#dbe7f5]" : "text-[#9db4d0]"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================== Compliance Health ============================== */

function ComplianceHealth() {
  return (
    <div className="card flex h-full flex-col p-4">
      <h2 className="text-[14px] font-bold text-white">Compliance Health</h2>
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-3.5">
        {healthRows.map((h) => (
          <li key={h.label} className="flex items-center gap-2.5">
            <span className="w-[118px] shrink-0 whitespace-nowrap text-[11px] font-medium text-[#b8cce3]">
              {h.label}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#122c47]">
              <span
                className="block h-full rounded-full"
                style={{ width: `${h.value}%`, backgroundColor: h.color }}
              />
            </span>
            <span className="w-8 shrink-0 text-right text-[11.5px] font-bold tabular-nums text-white">
              {h.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const gapRiskStyles: Record<GapRisk, string> = {
  High: "border-red-500/40 bg-red-500/15 text-red-400",
  Medium: "border-amber-400/40 bg-amber-400/15 text-amber-300",
  Low: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
};

const gapStatusStyles: Record<GapStatus, string> = {
  Open: "border-red-500/40 bg-red-500/15 text-red-400",
  "In Progress": "border-blue-500/40 bg-blue-500/15 text-blue-300",
};

function TopGaps({
  onViewAll,
}: {
  onViewAll?: () => void;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-white">Top Compliance Gaps</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-[11.5px] font-semibold text-[#38bdf8] transition-colors hover:text-[#7dd3fc]"
        >
          View All <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-[#153152] text-[10px] font-semibold text-[#6f88a6]">
              <th className="py-2 pr-1 font-semibold">#</th>
              <th className="py-2 pr-2 font-semibold">Control</th>
              <th className="py-2 pr-2 font-semibold">Framework</th>
              <th className="py-2 pr-2 font-semibold">Risk Level</th>
              <th className="py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {complianceGaps.map((g) => (
              <tr key={g.num} className="border-b border-[#0f243d] last:border-0 hover:bg-[#0c1f38]/50">
                <td className="py-2.5 pr-1 text-[#6f88a6]">{g.num}</td>
                <td className="py-2.5 pr-2 font-medium text-white">{g.control}</td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-[#9db4d0]">{g.framework}</td>
                <td className="py-2.5 pr-2">
                  <span
                    className={`inline-block whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-bold ${gapRiskStyles[g.risk]}`}
                  >
                    {g.risk}
                  </span>
                </td>
                <td className="py-2.5">
                  <span
                    className={`inline-block whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-bold ${gapStatusStyles[g.status]}`}
                  >
                    {g.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionsCard({
  externalNotify,
  onNav,
}: {
  externalNotify?: (text: string, kind?: "ok" | "info") => void;
  onNav?: (id: string) => void;
}) {
  const outline =
    "flex w-full items-center justify-center gap-2 rounded-lg border border-[#1f4572] bg-[#0c1f38]/70 py-2.5 text-[11.5px] font-semibold text-[#c6daf2] transition-colors hover:bg-[#122e54]";
  return (
    <div className="card flex h-full flex-col p-4">
      <h2 className="text-[14px] font-bold text-white">Actions</h2>
      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={() => externalNotify?.("Compliance assessment started. Analyzing 438 controls across 5 frameworks...", "ok")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d4ed8] py-2.5 text-[11.5px] font-semibold text-white shadow-[0_0_14px_rgba(29,78,216,0.55)] transition-colors hover:bg-[#2563eb]"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Run Compliance Assessment
        </button>
        <button
          type="button"
          onClick={() => externalNotify?.("Audit report generated successfully.", "ok")}
          className={outline}
        >
          <FileBarChart className="h-3.5 w-3.5 text-[#8ea5be]" />
          Generate Audit Report
        </button>
        <button
          type="button"
          onClick={() => {
            externalNotify?.("Navigating to Policy Management...", "info");
            onNav?.("settings");
          }}
          className={outline}
        >
          <Settings className="h-3.5 w-3.5 text-[#8ea5be]" />
          Manage Policies
        </button>
        <button
          type="button"
          onClick={() => {
            externalNotify?.("Navigating to Security Controls Library...", "info");
            onNav?.("controls");
          }}
          className={outline}
        >
          <BookOpen className="h-3.5 w-3.5 text-[#8ea5be]" />
          View Control Library
        </button>
      </div>
    </div>
  );
}

function QuoteCard() {
  return (
    <div className="card relative h-full overflow-hidden p-4">
      <img
        src={lockImg}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070e1a]/40 via-[#070e1a]/30 to-[#070e1a]/92" />
      <div className="relative flex min-h-[252px] flex-col">
        <div className="mt-6 text-center text-[10px] font-bold tracking-[0.24em] text-[#9cc8ff]">
          COMPLIANCE
          <br />
          BUILDS CONFIDENCE
        </div>
        <div className="mt-auto">
          <p className="text-[11.5px] italic leading-relaxed text-[#c6daf2]">
            “Security is not a product,
            <br />
            but a process.”
          </p>
          <p className="mt-1 text-right text-[10.5px] font-semibold text-[#7d94b0]">
            — Bruce Schneier
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================== Main View Export ============================== */

export function ComplianceView({ onNav, externalNotify }: ComplianceViewProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [checklist, setChecklist] = useState(initialAuditChecklist);

  const handleToggleChecklist = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
    const item = checklist[index];
    externalNotify?.(
      `${item.label}: marked as ${item.done ? "Incomplete" : "Completed"}.`,
      "ok"
    );
  };

  return (
    <div className="compliance-page">
      <ComplianceBanner onNav={onNav} externalNotify={externalNotify} />

      <div className="space-y-4 px-0 py-2">
        {/* Row 1: Tabs + KPI cards (left)  |  Compliance Health (right) */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="flex flex-col gap-3 xl:col-span-9">
            <TabsBar activeTab={activeTab} onSelectTab={setActiveTab} />
            <KpiTiles />
          </div>
          <div className="xl:col-span-3">
            <ComplianceHealth />
          </div>
        </div>

        {/* Row 2: Three charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card p-4">
            <h2 className="text-[14px] font-bold text-white">Compliance Score by Framework</h2>
            <FrameworkScoreBar />
          </div>
          <div className="card p-4">
            <h2 className="text-[14px] font-bold text-white">Control Implementation Status</h2>
            <ImplementationDonut />
          </div>
          <div className="card p-4">
            <div className="flex items-start justify-between">
              <h2 className="text-[14px] font-bold text-white">Compliance Trend</h2>
              <TrendLegend />
            </div>
            <ComplianceTrend />
          </div>
        </div>

        {/* Row 3: Framework details + Top gaps */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <FrameworkDetailsTable
              onViewFramework={(name) =>
                externalNotify?.(`Viewing detailed compliance controls for ${name}...`, "info")
              }
            />
          </div>
          <div className="xl:col-span-5">
            <TopGaps
              onViewAll={() =>
                externalNotify?.("Displaying all 96 open compliance gaps across frameworks.", "info")
              }
            />
          </div>
        </div>

        {/* Row 4: Recent activities + Checklist + Actions + Quote */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <RecentActivities
              onViewAll={() =>
                externalNotify?.("Opening complete Compliance Activity Log...", "info")
              }
            />
          </div>
          <div className="xl:col-span-4">
            <AuditChecklist
              checklist={checklist}
              onToggleItem={handleToggleChecklist}
            />
          </div>
          <div className="xl:col-span-2">
            <ActionsCard externalNotify={externalNotify} onNav={onNav} />
          </div>
          <div className="xl:col-span-2">
            <QuoteCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplianceView;
