import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  Cloud,
  Database,
  FileText,
  GitFork,
  Globe2,
  Info,
  Landmark,
  Lock,
  Network,
  Scissors,
  Settings2,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Tag,
  Target,
  User,
  Users,
} from "lucide-react";

type Appetite = "Low" | "Medium" | "High";
type DataSensitivity = "Public" | "Internal" | "Confidential" | "Regulated";

export interface RiskParamsForm {
  appetite: Appetite;
  riskAreas: string[];
  priorities: string[];
  dataSensitivity: DataSensitivity;
  maxAcceptableLoss: string;
  criticalAssetThreshold: string;
  controlMaturityTarget: string;
  reportingCurrency: string;
  expectedRevenueGrowth: string;
  cyberInsuranceCoverage: string;
  hasHistoricalData: boolean;
  riskReviewCadence: string;
  boardReportingFrequency: string;
}

export const initialRiskParamsForm: RiskParamsForm = {
  appetite: "Medium",
  riskAreas: ["Cybersecurity", "Data Privacy", "Financial Risk", "Regulatory Risk"],
  priorities: ["Revenue Growth", "Operational Efficiency", "Regulatory Compliance"],
  dataSensitivity: "Confidential",
  maxAcceptableLoss: "25000000",
  criticalAssetThreshold: "Top 5% of assets",
  controlMaturityTarget: "Managed",
  reportingCurrency: "INR (₹)",
  expectedRevenueGrowth: "15",
  cyberInsuranceCoverage: "10000000",
  hasHistoricalData: true,
  riskReviewCadence: "Weekly",
  boardReportingFrequency: "Semi-annual",
};

const riskAreasList = [
  { id: "Cybersecurity", icon: Shield },
  { id: "Data Privacy", icon: FileText },
  { id: "Operational Risk", icon: GitFork },
  { id: "Financial Risk", icon: Database },
  { id: "Third-Party Risk", icon: Network },
  { id: "Regulatory Risk", icon: Landmark },
  { id: "Reputational Risk", icon: Users },
  { id: "Physical Security", icon: Lock },
];

const businessPrioritiesList = [
  { id: "Revenue Growth", icon: BarChart3 },
  { id: "Operational Efficiency", icon: Settings2 },
  { id: "Regulatory Compliance", icon: FileText },
  { id: "Market Expansion", icon: Globe2 },
  { id: "Digital Transformation", icon: Cloud },
  { id: "Cost Optimization", icon: Scissors },
];

const dataSensitivityList: { id: DataSensitivity; label: string; icon: typeof Globe2 }[] = [
  { id: "Public", label: "Public", icon: Globe2 },
  { id: "Internal", label: "Internal", icon: Database },
  { id: "Confidential", label: "Confidential", icon: Lock },
  { id: "Regulated", label: "Regulated", icon: ShieldCheck },
];

function BrandShieldLogo({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative w-7 h-8 flex items-center justify-center">
        <svg width="28" height="32" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer shield glow & border */}
          <path
            d="M16 2L29 7.5V17.8C29 26.8 23.5 33.7 16 36.5C8.5 33.7 3 26.8 3 17.8V7.5L16 2Z"
            stroke="#2563eb"
            strokeWidth="2.5"
            fill="rgba(37, 99, 235, 0.15)"
          />
          {/* Inner shield */}
          <path
            d="M16 8L23.5 11.2V17.5C23.5 22.8 20.3 27 16 28.8C11.7 27 8.5 22.8 8.5 17.5V11.2L16 8Z"
            fill="#38bdf8"
          />
        </svg>
      </div>
      <span className="text-[17px] font-bold tracking-tight text-white">
        CyberRisk<span className="text-sky-400">IQ</span>
      </span>
    </div>
  );
}

interface RiskParametersProps {
  onBack?: () => void;
  onContinue?: () => void;
  onNavigateHome?: () => void;
  initialValues?: Partial<RiskParamsForm>;
  onValuesChange?: (values: RiskParamsForm) => void;
}

export default function RiskParameters({
  onBack,
  onContinue,
  onNavigateHome,
  initialValues,
  onValuesChange,
}: RiskParametersProps) {
  const [form, setForm] = useState<RiskParamsForm>({ ...initialRiskParamsForm, ...initialValues });
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const updateForm = (updater: (prev: RiskParamsForm) => RiskParamsForm) => {
    setForm((prev) => {
      const next = updater(prev);
      if (onValuesChange) onValuesChange(next);
      return next;
    });
  };

  const toggleRiskArea = (id: string) => {
    updateForm((prev) => ({
      ...prev,
      riskAreas: prev.riskAreas.includes(id)
        ? prev.riskAreas.filter((item) => item !== id)
        : [...prev.riskAreas, id],
    }));
  };

  const togglePriority = (id: string) => {
    updateForm((prev) => {
      if (prev.priorities.includes(id)) {
        return { ...prev, priorities: prev.priorities.filter((item) => item !== id) };
      }
      if (prev.priorities.length >= 3) {
        showToast("Maximum of 3 business priorities allowed");
        return prev;
      }
      return { ...prev, priorities: [...prev.priorities, id] };
    });
  };

  const handleContinue = () => {
    showToast("Risk parameters saved! Proceeding to Step 3 (Assets)...");
    if (onContinue) {
      setTimeout(() => onContinue(), 400);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050b14] text-slate-100 overflow-hidden font-sans select-none antialiased">
      {/* Top Navbar */}
      <header className="h-14 shrink-0 px-8 flex items-center justify-between border-b border-slate-800/40 bg-[#050b14]/90 z-20">
        <BrandShieldLogo onClick={onNavigateHome} />

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="w-8 h-8 rounded-full border border-slate-700/60 bg-slate-800/40 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Toggle Theme"
            onClick={() => showToast("Theme switcher: Dark mode default")}
          >
            <Sun size={15} />
          </button>

          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(37,99,235,0.5)]">
              C
            </div>
            <div className="text-left">
              <div className="text-[12.5px] font-semibold text-white leading-tight">Create Organization</div>
              <div className="text-[11px] text-slate-400 leading-tight">Let&apos;s get you started</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main 3-Column Content Frame */}
      <div className="flex-1 min-h-0 grid grid-cols-[330px_minmax(0,1fr)_290px] gap-4 p-4 max-w-[1920px] w-full mx-auto">
        {/* LEFT BRAND PANEL */}
        <aside className="relative rounded-2xl overflow-hidden border border-blue-500/15 bg-[#040810] flex flex-col justify-between p-7 shadow-xl">
          {/* Background image & gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-bottom pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/setup-left.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040810]/75 via-[#040810]/25 to-transparent pointer-events-none z-[1]" />

          {/* Top content */}
          <div className="relative z-10">
            <div className="text-[10px] font-bold tracking-[0.22em] text-sky-400 uppercase mb-3">
              BUILD A SAFER TOMORROW
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Set up your <br />
              <span className="text-sky-400 font-extrabold">organization</span>
            </h1>
            <p className="text-xs text-slate-300/90 leading-relaxed mt-3.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Provide a few key details about your organization so we can deliver accurate risk insights, tailored
              recommendations, and measurable business impact.
            </p>

            <ul className="mt-7 space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-blue-500/30 bg-[#040810]/80 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                  <User size={15} />
                </div>
                <div className="text-xs text-slate-300 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  Personalized risk insights <br />
                  <span className="text-slate-400">for your business</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-blue-500/30 bg-[#040810]/80 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                  <Target size={15} />
                </div>
                <div className="text-xs text-slate-300 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  Aligned with global <br />
                  <span className="text-slate-400">compliance standards</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-blue-500/30 bg-[#040810]/80 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                  <Sparkles size={15} />
                </div>
                <div className="text-xs text-slate-300 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  Set your journey to <br />
                  <span className="text-slate-400">a more resilient future</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 pt-8">
            <div className="text-[10px] font-bold tracking-[0.2em] text-slate-300 uppercase leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              DIFFERENT DATA. <br />
              ONE CLARITY.
            </div>
          </div>
        </aside>

        {/* CENTER MAIN FORM PANEL */}
        <main className="relative rounded-2xl border border-blue-500/20 bg-[#060c18] flex flex-col min-h-0 shadow-2xl overflow-hidden">
          {/* Main Panel Header */}
          <div className="px-6 py-4 border-b border-slate-800/60 flex items-start justify-between shrink-0 bg-[#07101f]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Risk Parameters &amp; Business Context</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define your organization&apos;s priorities and how CyberRiskIQ should measure and govern risk.
              </p>
            </div>

            {/* Stepper indicator top right */}
            <div className="text-right shrink-0 ml-4">
              <div className="text-[11px] font-medium text-slate-400 mb-1.5">Step 2 of 3</div>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="h-[3.5px] w-8 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <div className="h-[3.5px] w-8 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <div className="h-[3.5px] w-8 rounded-full bg-slate-700/80" />
              </div>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5 custom-scroll">
            {/* 1. Risk Appetite */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  1
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Risk Appetite</h3>
                  <p className="text-[11px] text-slate-400">Select your organization&apos;s overall risk appetite level.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Low */}
                <button
                  type="button"
                  onClick={() => updateForm((f) => ({ ...f, appetite: "Low" }))}
                  className={`p-3.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    form.appetite === "Low"
                      ? "border-blue-500 bg-blue-950/40 shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                      : "border-slate-800/80 bg-[#050c18] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {form.appetite === "Low" ? (
                      <div className="w-3.5 h-3.5 rounded-full border border-blue-400 bg-blue-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                    )}
                    <span className="text-xs font-semibold text-white">Low</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mt-2">
                    Minimal risk tolerance.
                    <br />
                    Prioritize security and compliance over speed.
                  </div>
                </button>                {/* Medium (Selected) */}
                <button
                  type="button"
                  onClick={() => updateForm((f) => ({ ...f, appetite: "Medium" }))}
                  className={`p-3.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    form.appetite === "Medium"
                      ? "border-blue-500 bg-blue-950/40 shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                      : "border-slate-800/80 bg-[#050c18] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {form.appetite === "Medium" ? (
                      <div className="w-3.5 h-3.5 rounded-full border border-blue-400 bg-blue-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#38bdf8]" />
                    )}
                    <span className="text-xs font-semibold text-white">Medium</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed mt-2">
                    Balanced approach
                    <br />
                    between growth and risk.
                  </div>
                </button>

                {/* High */}
                <button
                  type="button"
                  onClick={() => updateForm((f) => ({ ...f, appetite: "High" }))}
                  className={`p-3.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    form.appetite === "High"
                      ? "border-blue-500 bg-blue-950/40 shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                      : "border-slate-800/80 bg-[#050c18] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {form.appetite === "High" ? (
                      <div className="w-3.5 h-3.5 rounded-full border border-blue-400 bg-blue-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                    )}
                    <span className="text-xs font-semibold text-white">High</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mt-2">
                    Higher risk tolerance.
                    <br />
                    Focus on innovation and speed.
                  </div>
                </button>
              </div>
            </section>

            {/* 2. Key Risk Areas */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  2
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Key Risk Areas</h3>
                  <p className="text-[11px] text-slate-400">
                    Select the areas most relevant to your organization. (Multiple selections allowed)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {riskAreasList.map(({ id, icon: Icon }) => {
                  const isSelected = form.riskAreas.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleRiskArea(id)}
                      className={`h-10 px-3 rounded-lg flex items-center gap-2.5 border transition cursor-pointer select-none ${
                        isSelected
                          ? "border-blue-500 bg-blue-950/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.2)]"
                          : "border-slate-800/80 bg-[#050c18] text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-blue-600 text-white" : "border border-slate-700 bg-[#040810]"
                        }`}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                      <Icon size={14} className={isSelected ? "text-blue-400 shrink-0" : "text-slate-400 shrink-0"} />
                      <span className="text-[11.5px] font-medium truncate">{id}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3. Business Priorities */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  3
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Business Priorities</h3>
                  <p className="text-[11px] text-slate-400">Select your top business priorities. (Choose up to 3)</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {businessPrioritiesList.map(({ id, icon: Icon }) => {
                  const isSelected = form.priorities.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => togglePriority(id)}
                      className={`h-10 px-3 rounded-lg flex items-center gap-2.5 border transition cursor-pointer select-none ${
                        isSelected
                          ? "border-blue-500 bg-blue-950/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.2)]"
                          : "border-slate-800/80 bg-[#050c18] text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-blue-600 text-white" : "border border-slate-700 bg-[#040810]"
                        }`}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                      <Icon size={14} className={isSelected ? "text-blue-400 shrink-0" : "text-slate-400 shrink-0"} />
                      <span className="text-[11.5px] font-medium truncate">{id}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 4. Data Sensitivity */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  4
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Data Sensitivity</h3>
                  <p className="text-[11px] text-slate-400">What type of data does your organization primarily handle?</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {dataSensitivityList.map(({ id, label, icon: Icon }) => {
                  const isSelected = form.dataSensitivity === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => updateForm((f) => ({ ...f, dataSensitivity: id }))}
                      className={`h-10 px-3 rounded-lg flex items-center gap-2.5 border transition cursor-pointer select-none ${
                        isSelected
                          ? "border-blue-500 bg-blue-950/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]"
                          : "border-slate-800/80 bg-[#050c18] text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border border-blue-400 bg-blue-600"
                            : "border border-slate-700 bg-[#040810]"
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <Icon size={14} className={isSelected ? "text-blue-400 shrink-0" : "text-slate-400 shrink-0"} />
                      <span className="text-[11.5px] font-medium truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Subsection Divider: Advanced Risk Configuration */}
            <div className="flex items-center gap-2.5 pt-2 pb-1">
              <Settings2 size={14} className="text-blue-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200 shrink-0">Advanced Risk Configuration</span>
              <div className="flex-1 h-[1px] bg-slate-800/80" />
              <span className="text-[11px] text-slate-400 shrink-0">
                Configure financial thresholds and governance settings
              </span>
            </div>

            {/* 5. Risk Thresholds */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  5
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xs font-bold text-white">Risk Thresholds</h3>
                  <span className="text-[11px] text-slate-400">Set quantitative thresholds for risk management.</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {/* Maximum acceptable annual loss */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Maximum acceptable annual loss (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <span className="text-slate-400 font-medium text-xs mr-2 select-none">₹</span>
                    <input
                      type="text"
                      value={form.maxAcceptableLoss}
                      onChange={(e) => updateForm((f) => ({ ...f, maxAcceptableLoss: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Critical asset threshold */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Critical asset threshold <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Tag size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.criticalAssetThreshold}
                      onChange={(e) => updateForm((f) => ({ ...f, criticalAssetThreshold: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      <option value="Top 5% of assets" className="bg-[#071224]">Top 5% of assets</option>
                      <option value="Top 10% of assets" className="bg-[#071224]">Top 10% of assets</option>
                      <option value="Top 20% of assets" className="bg-[#071224]">Top 20% of assets</option>
                      <option value="All critical assets" className="bg-[#071224]">All critical assets</option>
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Control maturity target */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Control maturity target <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Briefcase size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.controlMaturityTarget}
                      onChange={(e) => updateForm((f) => ({ ...f, controlMaturityTarget: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      <option value="Managed" className="bg-[#071224]">Managed</option>
                      <option value="Initial" className="bg-[#071224]">Initial</option>
                      <option value="Defined" className="bg-[#071224]">Defined</option>
                      <option value="Quantitatively Managed" className="bg-[#071224]">Quantitatively Managed</option>
                      <option value="Optimizing" className="bg-[#071224]">Optimizing</option>
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Reporting currency */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Reporting currency <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <span className="text-slate-400 font-medium text-xs mr-2 select-none">₹</span>
                    <select
                      value={form.reportingCurrency}
                      onChange={(e) => updateForm((f) => ({ ...f, reportingCurrency: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      <option value="INR (₹)" className="bg-[#071224]">INR (₹)</option>
                      <option value="USD ($)" className="bg-[#071224]">USD ($)</option>
                      <option value="EUR (€)" className="bg-[#071224]">EUR (€)</option>
                      <option value="GBP (£)" className="bg-[#071224]">GBP (£)</option>
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Financial Modeling */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  6
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xs font-bold text-white">Financial Modeling</h3>
                  <span className="text-[11px] text-slate-400">
                    Provide financial context for better risk quantification.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3">
                {/* Expected revenue growth */}
                <div className="col-span-3">
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Expected revenue growth (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <span className="text-slate-400 font-medium text-xs mr-2 select-none">%</span>
                    <input
                      type="text"
                      value={form.expectedRevenueGrowth}
                      onChange={(e) => updateForm((f) => ({ ...f, expectedRevenueGrowth: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Cyber insurance coverage */}
                <div className="col-span-4">
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Cyber insurance coverage (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <span className="text-slate-400 font-medium text-xs mr-2 select-none">₹</span>
                    <input
                      type="text"
                      value={form.cyberInsuranceCoverage}
                      onChange={(e) => updateForm((f) => ({ ...f, cyberInsuranceCoverage: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Historical loss/incident data toggle */}
                <div className="col-span-5">
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                    Historical loss/incident data available
                    <Info size={12} className="text-slate-400 cursor-pointer" />
                  </label>
                  <div className="flex items-center h-9 px-1 gap-2.5">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.hasHistoricalData}
                      onClick={() => updateForm((f) => ({ ...f, hasHistoricalData: !f.hasHistoricalData }))}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                        form.hasHistoricalData ? "bg-blue-600 justify-end" : "bg-slate-700 justify-start"
                      }`}
                    >
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        className="w-4 h-4 rounded-full bg-white shadow-md"
                      />
                    </button>
                    <span
                      onClick={() => updateForm((f) => ({ ...f, hasHistoricalData: !f.hasHistoricalData }))}
                      className="text-[11.5px] text-slate-200 cursor-pointer select-none font-normal"
                    >
                      Yes, I have historical data
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Governance */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  7
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xs font-bold text-white">Governance</h3>
                  <span className="text-[11px] text-slate-400">Define how risk is reviewed and reported.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Risk review cadence */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Risk review cadence <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Calendar size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.riskReviewCadence}
                      onChange={(e) => updateForm((f) => ({ ...f, riskReviewCadence: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      <option value="Weekly" className="bg-[#071224]">Weekly</option>
                      <option value="Bi-weekly" className="bg-[#071224]">Bi-weekly</option>
                      <option value="Monthly" className="bg-[#071224]">Monthly</option>
                      <option value="Quarterly" className="bg-[#071224]">Quarterly</option>
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Board reporting frequency */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Board reporting frequency <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <FileText size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.boardReportingFrequency}
                      onChange={(e) => updateForm((f) => ({ ...f, boardReportingFrequency: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      <option value="Semi-annual" className="bg-[#071224]">Semi-annual</option>
                      <option value="Quarterly" className="bg-[#071224]">Quarterly</option>
                      <option value="Annual" className="bg-[#071224]">Annual</option>
                      <option value="Monthly" className="bg-[#071224]">Monthly</option>
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Main Panel Footer Actions */}
          <div className="px-6 py-3.5 border-t border-slate-800/60 flex items-center justify-between shrink-0 bg-[#07101f]">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-600 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              <ArrowLeft size={13} /> Back
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_16px_rgba(37,99,235,0.4)] transition cursor-pointer"
            >
              Continue <ArrowRight size={13} />
            </button>
          </div>
        </main>

        {/* RIGHT PROGRESS RAIL */}
        <aside className="relative rounded-2xl overflow-hidden border border-blue-500/15 bg-[#040810] flex flex-col justify-between p-6 shadow-xl">
          {/* Background image & gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-bottom pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/setup-rail.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040810]/70 via-[#040810]/25 to-transparent pointer-events-none z-[1]" />

          {/* Top content */}
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-white mb-6 tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">Setup Progress</h2>

            <div className="space-y-6">
              {/* Step 1: Organization */}
              <div className="flex items-start gap-3.5 relative">
                {/* Connecting line */}
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-slate-700/70 z-0" />

                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 z-10 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white leading-tight">Organization</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">Basic information</div>
                </div>
              </div>

              {/* Step 2: Risk Parameters (Active) */}
              <div className="flex items-start gap-3.5 relative">
                {/* Connecting line */}
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-slate-700/70 z-0" />

                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 z-10 shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                  2
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-400 leading-tight">Risk Parameters</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">Budget &amp; compliance</div>
                </div>
              </div>

              {/* Step 3: Assets */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800/80 flex items-center justify-center text-slate-400 text-[11px] font-bold shrink-0 z-10">
                  3
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300 leading-tight">Assets</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">Connect your data</div>
                </div>
              </div>
            </div>

            {/* Security Box */}
            <div className="mt-9 p-3.5 rounded-xl border border-blue-500/20 bg-[#061022] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Your data is secure</div>
                <div className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  We use industry-leading encryption to keep your information safe.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom quote with blue line */}
          <div className="relative z-10 pt-6">
            <div className="text-xs italic text-slate-300 font-normal leading-snug">
              &ldquo;Better risk decisions
              <br />
              build stronger tomorrows.&rdquo;
            </div>
            <div className="w-6 h-[2px] bg-blue-500 mt-2.5 rounded-full" />
          </div>
        </aside>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed right-6 bottom-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/30 bg-[#081222]/95 text-slate-200 text-xs font-medium shadow-2xl backdrop-blur-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Sparkles size={14} className="text-blue-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
