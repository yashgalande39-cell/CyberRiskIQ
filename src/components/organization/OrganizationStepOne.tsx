import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  FileText,
  Network,
  ShieldCheck,
  Sparkles,
  Sun,
  Tag,
  Target,
  User,
  Users,
} from "lucide-react";

export interface OrgStepOneForm {
  orgName: string;
  industry: string;
  companySize: string;
  revenueBand: string;
  businessUnits: string;
  departments: string;
  riskAppetite: "Low" | "Medium" | "High";
  budget: string;
  budgetPeriod: string;
  frameworks: string[];
  otherFrameworks: string;
}

export const initialOrgStepOneForm: OrgStepOneForm = {
  orgName: "Apple",
  industry: "IT Services",
  companySize: "51-200 employees",
  revenueBand: "₹100 Cr – ₹500 Cr",
  businessUnits: "Product",
  departments: "IT",
  riskAppetite: "Medium",
  budget: "5000000",
  budgetPeriod: "Annual",
  frameworks: ["ISO 27001", "GDPR"],
  otherFrameworks: "",
};

const industryList = [
  "IT Services",
  "Banking & Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Energy & Utilities",
  "Telecom",
  "Government",
  "Other",
];

const companySizeList = [
  "1-50 employees",
  "51-200 employees",
  "201-1000 employees",
  "1001-5000 employees",
  "5000+ employees",
];

const revenueBandList = [
  "< ₹100 Cr",
  "₹100 Cr – ₹500 Cr",
  "₹500 Cr – ₹1,000 Cr",
  "₹1,000 Cr – ₹5,000 Cr",
  "> ₹5,000 Cr",
];

const budgetPeriodList = [
  "Annual",
  "Monthly",
  "Quarterly",
  "Half-yearly",
  "Multi-year (3 years)",
];

const complianceFrameworksList = [
  "ISO 27001",
  "GDPR",
  "RBI",
  "SEBI",
  "Other (please specify)",
];

function BrandShieldLogo({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${onClick ? "cursor-pointer" : ""}`}
    >
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

interface OrganizationStepOneProps {
  onBack?: () => void;
  onContinue?: () => void;
  onNavigateHome?: () => void;
  initialValues?: Partial<OrgStepOneForm>;
  onValuesChange?: (values: OrgStepOneForm) => void;
}

export default function OrganizationStepOne({
  onBack,
  onContinue,
  onNavigateHome,
  initialValues,
  onValuesChange,
}: OrganizationStepOneProps) {
  const [form, setForm] = useState<OrgStepOneForm>({ ...initialOrgStepOneForm, ...initialValues });
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const updateForm = (updater: (prev: OrgStepOneForm) => OrgStepOneForm) => {
    setForm((prev) => {
      const next = updater(prev);
      if (onValuesChange) onValuesChange(next);
      return next;
    });
  };

  const toggleFramework = (framework: string) => {
    updateForm((prev) => ({
      ...prev,
      frameworks: prev.frameworks.includes(framework)
        ? prev.frameworks.filter((f) => f !== framework)
        : [...prev.frameworks, framework],
    }));
  };

  const handleContinue = () => {
    const errs: Record<string, string> = {};
    if (!form.orgName.trim()) errs.orgName = "Organization name is required";
    if (!form.industry) errs.industry = "Please select an industry";
    if (!form.companySize) errs.companySize = "Please select company size";
    if (!form.revenueBand) errs.revenueBand = "Please select a revenue band";
    if (!form.businessUnits.trim()) errs.businessUnits = "Business units are required";
    if (!form.departments.trim()) errs.departments = "Departments are required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Please fill in the required fields");
      return;
    }

    setErrors({});
    showToast("Organization details saved! Proceeding to Step 2 (Risk Parameters)...");
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
                  Start your journey to <br />
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
              <h2 className="text-lg font-bold text-white tracking-tight">Organization Setup</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tell us about your organization</p>
            </div>

            {/* Stepper indicator top right */}
            <div className="text-right shrink-0 ml-4">
              <div className="text-[11px] font-medium text-slate-400 mb-1.5">Step 1 of 3</div>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="h-[3.5px] w-8 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <div className="h-[3.5px] w-8 rounded-full bg-slate-700/80" />
                <div className="h-[3.5px] w-8 rounded-full bg-slate-700/80" />
              </div>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5 custom-scroll">
            {/* 1. Organization */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  1
                </div>
                <h3 className="text-xs font-bold text-white">Organization</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Organization name */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Organization name <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex items-center h-9 rounded-lg border bg-[#050b14] px-2.5 transition ${
                      errors.orgName ? "border-red-500/80" : "border-slate-800 focus-within:border-blue-500"
                    }`}
                  >
                    <User size={13} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Apple"
                      value={form.orgName}
                      onChange={(e) => {
                        updateForm((f) => ({ ...f, orgName: e.target.value }));
                        if (errors.orgName) setErrors((prev) => ({ ...prev, orgName: "" }));
                      }}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                  {errors.orgName && <p className="text-[10.5px] text-red-400 mt-1">{errors.orgName}</p>}
                </div>

                {/* Industry */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Briefcase size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.industry}
                      onChange={(e) => updateForm((f) => ({ ...f, industry: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      {industryList.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#071224]">
                          {ind}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Company size */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Company size <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Users size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.companySize}
                      onChange={(e) => updateForm((f) => ({ ...f, companySize: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      {companySizeList.map((size) => (
                        <option key={size} value={size} className="bg-[#071224]">
                          {size}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>

                {/* Revenue band */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Revenue band <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Tag size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.revenueBand}
                      onChange={(e) => updateForm((f) => ({ ...f, revenueBand: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      {revenueBandList.map((band) => (
                        <option key={band} value={band} className="bg-[#071224]">
                          {band}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Business Structure */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  2
                </div>
                <h3 className="text-xs font-bold text-white">Business Structure</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Business units */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Business units <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex items-center h-9 rounded-lg border bg-[#050b14] px-2.5 transition ${
                      errors.businessUnits ? "border-red-500/80" : "border-slate-800 focus-within:border-blue-500"
                    }`}
                  >
                    <Network size={13} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Product"
                      value={form.businessUnits}
                      onChange={(e) => {
                        updateForm((f) => ({ ...f, businessUnits: e.target.value }));
                        if (errors.businessUnits) setErrors((prev) => ({ ...prev, businessUnits: "" }));
                      }}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Add multiple units (comma separated)</p>
                  {errors.businessUnits && <p className="text-[10.5px] text-red-400 mt-0.5">{errors.businessUnits}</p>}
                </div>

                {/* Departments */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Departments <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex items-center h-9 rounded-lg border bg-[#050b14] px-2.5 transition ${
                      errors.departments ? "border-red-500/80" : "border-slate-800 focus-within:border-blue-500"
                    }`}
                  >
                    <Building2 size={13} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. IT"
                      value={form.departments}
                      onChange={(e) => {
                        updateForm((f) => ({ ...f, departments: e.target.value }));
                        if (errors.departments) setErrors((prev) => ({ ...prev, departments: "" }));
                      }}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Add multiple departments (comma separated)</p>
                  {errors.departments && <p className="text-[10.5px] text-red-400 mt-0.5">{errors.departments}</p>}
                </div>
              </div>
            </section>

            {/* 3. Risk Posture */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  3
                </div>
                <h3 className="text-xs font-bold text-white">Risk Posture</h3>
              </div>

              <div className="mb-2">
                <label className="text-[11px] font-medium text-slate-300 block mb-2">
                  Risk appetite <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Low */}
                <button
                  type="button"
                  onClick={() => updateForm((f) => ({ ...f, riskAppetite: "Low" }))}
                  className={`p-3.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    form.riskAppetite === "Low"
                      ? "border-blue-500 bg-blue-950/40 shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                      : "border-slate-800/80 bg-[#050c18] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {form.riskAppetite === "Low" ? (
                      <div className="w-3.5 h-3.5 rounded-full border border-blue-400 bg-blue-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                    )}
                    <span className="text-xs font-semibold text-white">Low</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mt-2">
                    Conservative approach
                  </div>
                </button>

                {/* Medium (Selected) */}
                <button
                  type="button"
                  onClick={() => updateForm((f) => ({ ...f, riskAppetite: "Medium" }))}
                  className={`p-3.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    form.riskAppetite === "Medium"
                      ? "border-blue-500 bg-blue-950/40 shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                      : "border-slate-800/80 bg-[#050c18] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {form.riskAppetite === "Medium" ? (
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
                  </div>
                </button>

                {/* High */}
                <button
                  type="button"
                  onClick={() => updateForm((f) => ({ ...f, riskAppetite: "High" }))}
                  className={`p-3.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    form.riskAppetite === "High"
                      ? "border-blue-500 bg-blue-950/40 shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                      : "border-slate-800/80 bg-[#050c18] hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {form.riskAppetite === "High" ? (
                      <div className="w-3.5 h-3.5 rounded-full border border-blue-400 bg-blue-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                    )}
                    <span className="text-xs font-semibold text-white">High</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed mt-2">
                    Aggressive approach
                  </div>
                </button>
              </div>
            </section>

            {/* 4. Security Budget */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  4
                </div>
                <h3 className="text-xs font-bold text-white">Security Budget</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Annual security budget */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Annual security budget (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <span className="text-slate-400 font-medium text-xs mr-2 select-none">₹</span>
                    <input
                      type="text"
                      placeholder="e.g. 50,00,000"
                      value={form.budget}
                      onChange={(e) => updateForm((f) => ({ ...f, budget: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Budget period */}
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Budget period <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Calendar size={13} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={form.budgetPeriod}
                      onChange={(e) => updateForm((f) => ({ ...f, budgetPeriod: e.target.value }))}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      {budgetPeriodList.map((period) => (
                        <option key={period} value={period} className="bg-[#071224]">
                          {period}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Compliance */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  5
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Compliance</h3>
                  <p className="text-[11px] text-slate-400">Select applicable regulatory frameworks.</p>
                </div>
              </div>

              <div className="mb-2">
                <label className="text-[11px] font-medium text-slate-300 block mb-2">
                  Applicable frameworks <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="grid grid-cols-5 gap-2.5 mb-3">
                {complianceFrameworksList.map((framework) => {
                  const isSelected = form.frameworks.includes(framework);
                  return (
                    <button
                      key={framework}
                      type="button"
                      onClick={() => toggleFramework(framework)}
                      className={`h-10 px-3 rounded-lg flex items-center gap-2 border transition cursor-pointer select-none ${
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
                      <span className="text-[11.5px] font-medium truncate">{framework}</span>
                    </button>
                  );
                })}
              </div>

              {/* Other frameworks text input */}
              <div className="flex items-center h-9 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                <FileText size={13} className="text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g., HIPAA, SOC 2, NIST, etc."
                  value={form.otherFrameworks}
                  onChange={(e) => updateForm((f) => ({ ...f, otherFrameworks: e.target.value }))}
                  className="w-full bg-transparent text-white text-xs font-medium outline-none"
                />
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
            <h2 className="text-sm font-bold text-white mb-6 tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Setup Progress
            </h2>

            <div className="space-y-6">
              {/* Step 1: Organization (Active) */}
              <div className="flex items-start gap-3.5 relative">
                {/* Connecting line */}
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-slate-700/70 z-0" />

                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 z-10 shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                  1
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-400 leading-tight">Organization</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">Basic information</div>
                </div>
              </div>

              {/* Step 2: Risk Parameters */}
              <div className="flex items-start gap-3.5 relative">
                {/* Connecting line */}
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-slate-700/70 z-0" />

                <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800/80 flex items-center justify-center text-slate-400 text-[11px] font-bold shrink-0 z-10">
                  2
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-300 leading-tight">Risk Parameters</div>
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
