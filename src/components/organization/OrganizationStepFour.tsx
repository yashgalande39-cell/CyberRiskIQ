import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  Cloud,
  Cpu,
  Database,
  Edit3,
  HardDrive,
  Headphones,
  Layers,
  LayoutGrid,
  Lock,
  MapPin,
  Monitor,
  Network,
  Rocket,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { OrgStepOneForm } from "./OrganizationStepOne";
import type { RiskParamsForm } from "./RiskParameters";

function BrandShieldLogo({ onClick }: { onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-2.5 select-none ${onClick ? "cursor-pointer" : ""}`}>
      <div className="relative w-7 h-8 flex items-center justify-center">
        <svg width="28" height="32" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 2L29 7.5V17.8C29 26.8 23.5 33.7 16 36.5C8.5 33.7 3 26.8 3 17.8V7.5L16 2Z"
            stroke="#2563eb"
            strokeWidth="2.5"
            fill="rgba(37, 99, 235, 0.15)"
          />
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

interface OrganizationStepFourProps {
  stepOneValues?: OrgStepOneForm;
  stepTwoValues?: RiskParamsForm;
  onEditDetails?: () => void;
  onViewConnectors?: () => void;
  onLaunchDashboard?: () => void;
  onNavigateHome?: () => void;
}

export default function OrganizationStepFour({
  stepOneValues,
  stepTwoValues,
  onEditDetails,
  onViewConnectors,
  onLaunchDashboard,
  onNavigateHome,
}: OrganizationStepFourProps) {
  const [toast, setToast] = useState("");
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const orgName = stepOneValues?.orgName || "Acme Technologies Pvt. Ltd.";
  const industry = stepOneValues?.industry || "Information Technology";
  const companySize = stepOneValues?.companySize || "501 – 1,000 employees";
  const revenueBand = stepOneValues?.revenueBand || "₹ 500 – 1,000 Cr";
  const appetite = stepTwoValues?.appetite || stepOneValues?.riskAppetite || "Medium";

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

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 pl-2 cursor-pointer hover:opacity-90 transition text-left"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(37,99,235,0.5)]">
                C
              </div>
              <div className="text-left">
                <div className="text-[12.5px] font-semibold text-white leading-tight flex items-center gap-1.5">
                  Acme Technologies
                  <ChevronDown size={13} className="text-slate-400" />
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">Super Admin</div>
              </div>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-11 w-48 rounded-xl border border-slate-800 bg-[#071224] p-2 shadow-2xl z-30">
                <div className="px-3 py-2 text-xs font-semibold text-white border-b border-slate-800">
                  {orgName}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onEditDetails?.();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg mt-1 cursor-pointer transition"
                >
                  Organization Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onNavigateHome?.();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded-lg cursor-pointer transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main 3-Column Content Frame */}
      <div className="flex-1 min-h-0 grid grid-cols-[330px_minmax(0,1fr)_290px] gap-4 p-4 max-w-[1920px] w-full mx-auto">
        {/* LEFT BRAND PANEL */}
        <aside className="relative rounded-2xl overflow-hidden border border-blue-500/15 bg-[#040810] flex flex-col justify-between p-7 shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-bottom pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/setup-left.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040810]/75 via-[#040810]/25 to-transparent pointer-events-none z-[1]" />

          <div className="relative z-10">
            <div className="text-[10px] font-bold tracking-[0.22em] text-sky-400 uppercase mb-3">
              SETUP COMPLETE
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Your <br />
              Organization <br />
              <span className="text-sky-400 font-extrabold">is Ready!</span>
            </h1>
            <p className="text-xs text-slate-300/90 leading-relaxed mt-3.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              You&apos;ve completed the initial setup. CyberRiskIQ is now configured for your organization. Let&apos;s turn
              cyber risk data into smarter business decisions.
            </p>

            <ul className="mt-7 space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-blue-500/30 bg-[#040810]/80 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                  <BarChart3 size={15} />
                </div>
                <div className="text-xs text-slate-300 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] pt-1.5">
                  Real-time risk insights
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-blue-500/30 bg-[#040810]/80 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                  <ShieldCheck size={15} />
                </div>
                <div className="text-xs text-slate-300 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] pt-1.5">
                  Data-driven investments
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-blue-500/30 bg-[#040810]/80 flex items-center justify-center text-blue-400 shrink-0 shadow-md">
                  <UserCheck size={15} />
                </div>
                <div className="text-xs text-slate-300 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] pt-1.5">
                  A safer, stronger tomorrow
                </div>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-8">
            <div className="text-[10px] font-bold tracking-[0.2em] text-slate-300 uppercase leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              DIFFERENT DATA. <br />
              ONE CLARITY.
            </div>
          </div>
        </aside>

        {/* CENTER MAIN CONTENT PANEL */}
        <main className="relative rounded-2xl border border-blue-500/20 bg-[#060c18] flex flex-col min-h-0 shadow-2xl overflow-hidden">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4 custom-scroll">
            {/* Top Celebration Hero */}
            <div className="text-center pt-2 pb-1 relative">
              {/* Confetti Sparks around checkmark */}
              <div className="relative inline-flex items-center justify-center mb-3">
                {/* Decorative Spark Dots */}
                <div className="absolute -top-1 -left-3 w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_#ec4899] animate-pulse" />
                <div className="absolute -top-3 right-0 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                <div className="absolute top-2 -right-4 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#f43f5e]" />
                <div className="absolute -bottom-1 -left-4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                <div className="absolute -bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                <div className="absolute top-3 -left-5 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_6px_#38bdf8]" />

                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_24px_rgba(16,185,129,0.5)] border-2 border-emerald-400/80">
                  <Check size={26} strokeWidth={3} />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                Setup Completed Successfully!
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto leading-relaxed">
                Your organization has been configured and your data sources are connected. <br />
                You are now ready to explore CyberRiskIQ.
              </p>
            </div>

            {/* Card 1: Organization Overview */}
            <section className="rounded-xl border border-blue-900/30 bg-[#071224] p-4">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-sky-400" />
                  <h3 className="text-xs font-bold text-white tracking-tight">Organization Overview</h3>
                </div>

                <button
                  type="button"
                  onClick={onEditDetails}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#050c18] hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition cursor-pointer"
                >
                  <Edit3 size={12} className="text-slate-400" /> Edit Details
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 text-xs">
                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium">Organization Name</div>
                  <div className="font-semibold text-white mt-1 leading-snug">{orgName}</div>
                </div>

                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium">Industry</div>
                  <div className="font-semibold text-white mt-1 leading-snug">{industry}</div>
                </div>

                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium">Company Size</div>
                  <div className="font-semibold text-white mt-1 leading-snug">{companySize}</div>
                </div>

                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium">Revenue Band</div>
                  <div className="font-semibold text-white mt-1 leading-snug">{revenueBand}</div>
                </div>

                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium">Headquarters</div>
                  <div className="font-semibold text-white mt-1 leading-snug flex items-center gap-1">
                    <MapPin size={12} className="text-sky-400 shrink-0" /> Mumbai, India
                  </div>
                </div>
              </div>
            </section>

            {/* Card 2: 5-Column Sub-Grid */}
            <div className="grid grid-cols-5 gap-3">
              {/* 1. Business Structure */}
              <div className="rounded-xl border border-blue-900/30 bg-[#071224] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 mb-3">
                    <Network size={14} className="text-sky-400 shrink-0" />
                    <span className="text-[11px] font-bold text-white truncate">Business Structure</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <div className="text-lg font-bold text-white leading-tight">4</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Business Units</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white leading-tight">8</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Departments</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Risk Appetite */}
              <div className="rounded-xl border border-blue-900/30 bg-[#071224] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 mb-2">
                    <Shield size={14} className="text-sky-400 shrink-0" />
                    <span className="text-[11px] font-bold text-white truncate">Risk Appetite</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                    <span className="text-xs font-bold text-white">{appetite}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug mt-1.5">
                    Balanced approach between growth and risk.
                  </p>
                </div>
              </div>

              {/* 3. Security Budget */}
              <div className="rounded-xl border border-blue-900/30 bg-[#071224] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 mb-2">
                    <Database size={14} className="text-sky-400 shrink-0" />
                    <span className="text-[11px] font-bold text-white truncate">Security Budget</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-2 leading-tight">
                    ₹ 1,00,00,000
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">FY 2026–27</div>
                </div>
              </div>

              {/* 4. Key Priorities */}
              <div className="rounded-xl border border-blue-900/30 bg-[#071224] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 mb-2">
                    <Target size={14} className="text-sky-400 shrink-0" />
                    <span className="text-[11px] font-bold text-white truncate">Key Priorities</span>
                  </div>
                  <ul className="space-y-1.5 mt-2">
                    <li className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <Check size={8} strokeWidth={3} />
                      </div>
                      <span className="truncate">Revenue Growth</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <Check size={8} strokeWidth={3} />
                      </div>
                      <span className="truncate">Operational Efficiency</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-[10px] text-slate-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <Check size={8} strokeWidth={3} />
                      </div>
                      <span className="truncate">Regulatory Compliance</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 5. Compliance Frameworks */}
              <div className="rounded-xl border border-blue-900/30 bg-[#071224] p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 mb-2">
                    <ShieldCheck size={14} className="text-sky-400 shrink-0" />
                    <span className="text-[11px] font-bold text-white truncate">Compliance Frameworks</span>
                  </div>
                  <ul className="space-y-1 mt-1.5">
                    {["ISO 27001", "GDPR", "RBI", "SEBI", "Custom (Internal)"].map((fw) => (
                      <li key={fw} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                          <Check size={7} strokeWidth={3} />
                        </div>
                        <span className="truncate">{fw}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 3: Connected Assets */}
            <section className="rounded-xl border border-blue-900/30 bg-[#071224] p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-sky-400/40 flex items-center justify-center text-sky-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white inline-block mr-2">Connected Assets</h3>
                    <span className="text-[11px] text-slate-400">
                      Your data sources have been successfully integrated and asset inventory is ready.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onViewConnectors}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer transition"
                >
                  View All Connectors <ArrowRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {/* Cloud Accounts */}
                <div className="p-3 rounded-xl border border-slate-800 bg-[#050c18] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cloud size={18} className="text-sky-400" />
                    <div>
                      <div className="text-base font-bold text-white leading-tight">2</div>
                      <div className="text-[10.5px] text-slate-400">Cloud Accounts</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Check size={10} strokeWidth={3} />
                  </div>
                </div>

                {/* On-Prem Source */}
                <div className="p-3 rounded-xl border border-slate-800 bg-[#050c18] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server size={18} className="text-sky-400" />
                    <div>
                      <div className="text-base font-bold text-white leading-tight">1</div>
                      <div className="text-[10.5px] text-slate-400">On-Prem Source</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Check size={10} strokeWidth={3} />
                  </div>
                </div>

                {/* Security Tools */}
                <div className="p-3 rounded-xl border border-slate-800 bg-[#050c18] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-blue-400" />
                    <div>
                      <div className="text-base font-bold text-white leading-tight">3</div>
                      <div className="text-[10.5px] text-slate-400">Security Tools</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Check size={10} strokeWidth={3} />
                  </div>
                </div>

                {/* Other Sources */}
                <div className="p-3 rounded-xl border border-slate-800 bg-[#050c18] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database size={18} className="text-slate-400" />
                    <div>
                      <div className="text-base font-bold text-white leading-tight">0</div>
                      <div className="text-[10.5px] text-slate-400">Other Sources</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-slate-700 bg-transparent" />
                </div>
              </div>
            </section>

            {/* Card 4: Asset Inventory */}
            <section className="rounded-xl border border-blue-900/30 bg-[#071224] p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/80">
                <div className="w-4 h-4 rounded bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                  <Layers size={11} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white inline-block mr-2">Asset Inventory</h3>
                  <span className="text-[11px] text-slate-400">
                    Your organization&apos;s assets have been discovered and are ready for analysis.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2.5">
                <div className="p-2.5 rounded-xl border border-slate-800 bg-[#050c18] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
                    <Layers size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">842</div>
                    <div className="text-[10px] text-slate-400">Total Assets</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-800 bg-[#050c18] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    <Server size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">420</div>
                    <div className="text-[10px] text-slate-400">Servers</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-800 bg-[#050c18] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    <Monitor size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">156</div>
                    <div className="text-[10px] text-slate-400">Endpoints</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-800 bg-[#050c18] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    <Cloud size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">128</div>
                    <div className="text-[10px] text-slate-400">Cloud Resources</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-800 bg-[#050c18] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    <LayoutGrid size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">94</div>
                    <div className="text-[10px] text-slate-400">Applications</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-800 bg-[#050c18] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    <Cpu size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">44</div>
                    <div className="text-[10px] text-slate-400">Other</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Card 5: You're All Set! CTA Banner */}
            <div className="rounded-xl border border-blue-500/30 bg-[#071329] p-4 flex items-center justify-between shadow-[0_0_20px_rgba(37,99,235,0.12)]">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">You&apos;re All Set!</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Start exploring your cybersecurity posture, quantify risks, and get AI-powered investment recommendations.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLaunchDashboard}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_16px_rgba(37,99,235,0.5)] transition cursor-pointer shrink-0"
              >
                Go to Dashboard <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT RAIL: WHAT'S NEXT */}
        <aside className="relative rounded-2xl overflow-hidden border border-blue-500/15 bg-[#040810] flex flex-col justify-between p-6 shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-bottom pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/setup-rail.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040810]/70 via-[#040810]/25 to-transparent pointer-events-none z-[1]" />

          <div className="relative z-10">
            <h2 className="text-sm font-bold text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              What&apos;s Next?
            </h2>
            <p className="text-[11px] text-slate-400 leading-tight mt-1 mb-5">
              Here are a few things you can do to get started.
            </p>

            <div className="space-y-2">
              {/* 1. Explore Dashboard */}
              <div
                onClick={onLaunchDashboard}
                className="p-3 rounded-xl border border-blue-500/30 bg-[#061022]/90 hover:bg-blue-950/40 hover:border-blue-500/60 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <LayoutGrid size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition">
                      Explore Dashboard
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Get an overview of your security posture and key insights.
                    </div>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition shrink-0" />
              </div>

              {/* 2. Run a Risk Analysis */}
              <div
                onClick={() => showToast("Starting comprehensive risk analysis engine...")}
                className="p-3 rounded-xl border border-slate-800/90 bg-[#050c18]/90 hover:border-slate-700 hover:bg-[#071224] transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <TrendingUp size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition">
                      Run a Risk Analysis
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Identify and quantify your cyber risks.
                    </div>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition shrink-0" />
              </div>

              {/* 3. Manage Assets */}
              <div
                onClick={onViewConnectors}
                className="p-3 rounded-xl border border-slate-800/90 bg-[#050c18]/90 hover:border-slate-700 hover:bg-[#071224] transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <HardDrive size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition">
                      Manage Assets
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      View and manage your connected IT assets.
                    </div>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition shrink-0" />
              </div>

              {/* 4. Invite Your Team */}
              <div
                onClick={() => showToast("Opening team member invitation dialog...")}
                className="p-3 rounded-xl border border-slate-800/90 bg-[#050c18]/90 hover:border-slate-700 hover:bg-[#071224] transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <Users size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition">
                      Invite Your Team
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Add users and assign roles.
                    </div>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition shrink-0" />
              </div>

              {/* 5. View Documentation */}
              <div
                onClick={() => showToast("Opening CyberRiskIQ Knowledge Base...")}
                className="p-3 rounded-xl border border-slate-800/90 bg-[#050c18]/90 hover:border-slate-700 hover:bg-[#071224] transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <BookOpen size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition">
                      View Documentation
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      Learn how to get the most out of CyberRiskIQ.
                    </div>
                  </div>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            </div>

            {/* Need Help Box */}
            <div className="mt-4 p-3 rounded-xl border border-blue-500/20 bg-[#061022]/80">
              <div className="flex items-start gap-2.5 mb-2.5">
                <Headphones size={15} className="text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Need Help?</div>
                  <div className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                    Our support team is here to help you succeed.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSupportModalOpen(true)}
                className="w-full py-1.5 rounded-lg border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-200 text-xs font-medium cursor-pointer transition text-center"
              >
                Contact Support
              </button>
            </div>
          </div>

          <div className="relative z-10 pt-4">
            <div className="text-xs italic text-slate-300 font-normal leading-snug">
              &ldquo;Better risk decisions
              <br />
              build stronger tomorrows.&rdquo;
            </div>
            <div className="w-6 h-[2px] bg-blue-500 mt-2.5 rounded-full" />
          </div>
        </aside>
      </div>

      {/* Support Contact Modal */}
      <AnimatePresence>
        {supportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020611]/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-md w-full rounded-2xl border border-blue-500/30 bg-[#071224] p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400">
                  <Headphones size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">CyberRiskIQ Support</h3>
                  <p className="text-[11px] text-slate-400">Dedicated Enterprise Support 24/7</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Have questions regarding your connectors, asset discovery, or risk posture? Our team of cybersecurity architects is available to assist you.
              </p>

              <div className="space-y-2 mb-5 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-800 bg-[#050c18]">
                  <span className="text-[10px] text-slate-400 block">Email Support</span>
                  <span className="font-semibold text-white">support@cyberriskiq.com</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-800 bg-[#050c18]">
                  <span className="text-[10px] text-slate-400 block">Emergency Security Hotline</span>
                  <span className="font-semibold text-emerald-400">+1 (800) 555-RISK</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSupportModalOpen(false);
                  showToast("Support ticket created. An engineer will reach out within 15 mins.");
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg transition cursor-pointer"
              >
                Open Priority Ticket
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
