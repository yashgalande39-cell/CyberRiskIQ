import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Cloud,
  Database,
  Eye,
  EyeOff,
  Globe,
  Info,
  Layers,
  Lock,
  Monitor,
  Network,
  Plus,
  RefreshCw,
  Rocket,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Upload,
  User,
  Users,
} from "lucide-react";
import type { OrgStepOneForm } from "./OrganizationStepOne";
import type { RiskParamsForm } from "./RiskParameters";

// Connector Brand Logos
function AwsLogo({ className = "w-6 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 42 26" fill="none" className={className}>
      <text x="2" y="16" fill="#f59e0b" fontWeight="bold" fontSize="13" fontFamily="sans-serif" letterSpacing="-0.5px">
        aws
      </text>
      <path d="M3 21C14 26 26 25 36 19" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M33 18L37 19L35 23" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AzureLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M13.2 3L6 14.5H11.5L5 21L18.5 9.5H13L13.2 3Z" fill="#0ea5e9" />
    </svg>
  );
}

function QualysLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2.5" />
      <path d="M15.5 15.5L19 19" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4.5" fill="#ef4444" />
    </svg>
  );
}

function SplunkLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 5L16 12L7 19" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrowdStrikeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2.5 14.5C6.5 8 13 6 21.5 4C19.5 9.5 15.5 14.5 10 17.5C6.8 19.2 3.8 19 2.5 14.5Z" fill="#ef4444" />
      <path d="M8 12C11.5 9 15.5 8 19.5 7" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function JiraLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2.5L5.5 9C4.4 10.1 4.4 11.9 5.5 13L12 19.5L18.5 13C19.6 11.9 19.6 10.1 18.5 9L12 2.5Z" fill="#2563eb" />
      <path d="M12 7.5L8 11.5L12 15.5L16 11.5L12 7.5Z" fill="#60a5fa" />
    </svg>
  );
}

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

type ConnectorKey =
  | "AWS"
  | "Azure"
  | "Qualys"
  | "Splunk"
  | "CrowdStrike"
  | "Jira"
  | "Identity"
  | "Financial"
  | "Other";

interface ConnectorDefinition {
  id: ConnectorKey;
  label: string;
  sub: string;
  renderLogo: () => React.ReactNode;
  defaultOn: boolean;
  category: "cloud" | "security" | "onprem" | "other";
  configured: boolean;
}

const connectorCatalog: ConnectorDefinition[] = [
  {
    id: "AWS",
    label: "AWS",
    sub: "Cloud assets, configurations & security findings",
    renderLogo: () => <AwsLogo />,
    defaultOn: true,
    category: "cloud",
    configured: true,
  },
  {
    id: "Azure",
    label: "Azure",
    sub: "Cloud resources & identity management",
    renderLogo: () => <AzureLogo />,
    defaultOn: false,
    category: "cloud",
    configured: false,
  },
  {
    id: "Qualys",
    label: "Qualys",
    sub: "Vulnerability management & host assessment",
    renderLogo: () => <QualysLogo />,
    defaultOn: true,
    category: "security",
    configured: true,
  },
  {
    id: "Splunk",
    label: "Splunk",
    sub: "SIEM, log analytics & threat event streams",
    renderLogo: () => <SplunkLogo />,
    defaultOn: true,
    category: "security",
    configured: true,
  },
  {
    id: "CrowdStrike",
    label: "CrowdStrike",
    sub: "Endpoint detection & response telemetry",
    renderLogo: () => <CrowdStrikeLogo />,
    defaultOn: false,
    category: "security",
    configured: false,
  },
  {
    id: "Jira",
    label: "Jira / ITSM-CMDB",
    sub: "Remediation workflows & issue tracking",
    renderLogo: () => <JiraLogo />,
    defaultOn: false,
    category: "other",
    configured: false,
  },
  {
    id: "Identity",
    label: "Identity Providers",
    sub: "Active Directory, Okta & identity governance",
    renderLogo: () => <Users size={16} className="text-sky-400" />,
    defaultOn: false,
    category: "onprem",
    configured: false,
  },
  {
    id: "Financial",
    label: "Financial Systems",
    sub: "ERP, finance & business data",
    renderLogo: () => <Database size={16} className="text-sky-400" />,
    defaultOn: false,
    category: "other",
    configured: false,
  },
  {
    id: "Other",
    label: "Other Connectors",
    sub: "More integrations coming soon",
    renderLogo: () => <Plus size={16} className="text-sky-400" />,
    defaultOn: false,
    category: "other",
    configured: false,
  },
];

interface OrganizationStepThreeProps {
  stepOneValues?: OrgStepOneForm;
  stepTwoValues?: RiskParamsForm;
  onBack?: () => void;
  onContinue?: () => void;
  onLaunchDashboard?: () => void;
  onNavigateHome?: () => void;
}

export default function OrganizationStepThree({
  stepOneValues,
  stepTwoValues,
  onBack,
  onContinue,
  onLaunchDashboard,
  onNavigateHome,
}: OrganizationStepThreeProps) {
  // Toggles for the 9 connectors
  const [enabledConnectors, setEnabledConnectors] = useState<Record<ConnectorKey, boolean>>({
    AWS: true,
    Azure: false,
    Qualys: true,
    Splunk: true,
    CrowdStrike: false,
    Jira: false,
    Identity: false,
    Financial: false,
    Other: false,
  });

  // Selected connector for connection details
  const [selectedConnector, setSelectedConnector] = useState<ConnectorKey>("AWS");

  // AWS Credentials form
  const [awsAccessKey, setAwsAccessKey] = useState("AKIAIOSFODNN7EXAMPLE");
  const [awsSecretKey, setAwsSecretKey] = useState("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [awsRegion, setAwsRegion] = useState("ap-south-1 (Mumbai)");
  const [readOnlyAccess, setReadOnlyAccess] = useState(true);
  const [testSuccess, setTestSuccess] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  // Asset Inventory form
  const [assetCount, setAssetCount] = useState("842");
  const [primaryCloudRegion, setPrimaryCloudRegion] = useState("aws-ap-south-1 (Mumbai)");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>("assets_inventory.csv");

  // Confirmation
  const [confirmed, setConfirmed] = useState(true);
  const [toast, setToast] = useState("");
  const [completed, setCompleted] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const toggleConnector = (id: ConnectorKey) => {
    setEnabledConnectors((prev) => {
      const next = !prev[id];
      showToast(`${id} ${next ? "enabled" : "disabled"}`);
      return { ...prev, [id]: next };
    });
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(true);
      showToast("Connection test succeeded! All permissions verified.");
    }, 600);
  };

  const handleCompleteSetup = () => {
    if (!confirmed) {
      showToast("Please confirm the information before completing setup");
      return;
    }
    if (onContinue) {
      onContinue();
      return;
    }
    setCompleted(true);
    showToast("Setup completed! Launching executive dashboard...");
    if (onLaunchDashboard) {
      setTimeout(() => onLaunchDashboard(), 1200);
    }
  };

  // Compute counts for summary
  const cloudCount = (enabledConnectors.AWS ? 1 : 0) + (enabledConnectors.Azure ? 1 : 0);
  const onPremCount = enabledConnectors.Identity ? 1 : 0;
  const secToolsCount = (enabledConnectors.Qualys ? 1 : 0) + (enabledConnectors.Splunk ? 1 : 0) + (enabledConnectors.CrowdStrike ? 1 : 0);
  const otherCount = (enabledConnectors.Jira ? 1 : 0) + (enabledConnectors.Financial ? 1 : 0) + (enabledConnectors.Other ? 1 : 0);

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
          <div
            className="absolute inset-0 bg-cover bg-bottom pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/setup-left.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040810]/75 via-[#040810]/25 to-transparent pointer-events-none z-[1]" />

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
              <h2 className="text-lg font-bold text-white tracking-tight">Connect Your Assets</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrate your data sources to start analyzing cyber risk across your organization.
              </p>
            </div>

            {/* Stepper indicator top right */}
            <div className="text-right shrink-0 ml-4">
              <div className="text-[11px] font-medium text-slate-400 mb-1.5">Step 3 of 3</div>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="h-[3.5px] w-8 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <div className="h-[3.5px] w-8 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <div className="h-[3.5px] w-8 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              </div>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5 custom-scroll">
            {/* 1. Data Connectors */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  1
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Data Connectors</h3>
                  <p className="text-[11px] text-slate-400">
                    Enable integrations to automatically pull asset inventories, vulnerability signals, and security logs.
                  </p>
                </div>
              </div>

              {/* 3x3 Connector Grid */}
              <div className="grid grid-cols-3 gap-2.5 mt-3">
                {connectorCatalog.map((item) => {
                  const isOn = enabledConnectors[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleConnector(item.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isOn
                          ? "border-blue-500/70 bg-blue-950/35 shadow-[0_0_12px_rgba(37,99,235,0.18)]"
                          : "border-slate-800/80 bg-[#050c18] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center shrink-0">
                          {item.renderLogo()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">{item.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">{item.sub}</div>
                        </div>
                      </div>

                      {/* Animated Switch */}
                      <div
                        className={`w-8 h-4 rounded-full p-0.5 transition-colors shrink-0 flex items-center ${
                          isOn ? "bg-blue-600 justify-end" : "bg-slate-700 justify-start"
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 2. Configure Connection Details */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  2
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Configure Connection Details</h3>
                  <p className="text-[11px] text-slate-400">
                    Select a connected source to configure authentication and connection settings.
                  </p>
                </div>
              </div>

              {/* Split layout: left list & right config */}
              <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-3 mt-3">
                {/* Left Connector Selector */}
                <div className="space-y-1.5">
                  {connectorCatalog.slice(0, 6).map((c) => {
                    const isSelected = selectedConnector === c.id;
                    const isConn = enabledConnectors[c.id];
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedConnector(c.id)}
                        className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between border transition cursor-pointer ${
                          isSelected
                            ? "border-blue-500/80 bg-blue-950/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]"
                            : "border-slate-800/80 bg-[#050c18] text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 flex items-center justify-center shrink-0">{c.renderLogo()}</div>
                          <span className="text-xs font-semibold">{c.id}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isConn ? "bg-emerald-400 shadow-[0_0_6px_#10b981]" : "bg-slate-500"
                            }`}
                          />
                          <span className={`text-[10px] ${isConn ? "text-emerald-400" : "text-slate-400"}`}>
                            {isConn ? "Connected" : "Not configured"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right Configuration Form */}
                <div className="rounded-xl border border-slate-800/90 bg-[#050c18] p-4 flex flex-col justify-between">
                  <div>
                    {/* Header with setup guide */}
                    <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#040810] border border-slate-800 flex items-center justify-center shrink-0">
                          {selectedConnector === "AWS" && <AwsLogo />}
                          {selectedConnector === "Azure" && <AzureLogo />}
                          {selectedConnector === "Qualys" && <QualysLogo />}
                          {selectedConnector === "Splunk" && <SplunkLogo />}
                          {selectedConnector === "CrowdStrike" && <CrowdStrikeLogo />}
                          {selectedConnector === "Jira" && <JiraLogo />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {selectedConnector === "AWS"
                              ? "Amazon Web Services"
                              : selectedConnector === "Azure"
                              ? "Microsoft Azure"
                              : selectedConnector === "Qualys"
                              ? "Qualys Cloud Platform"
                              : selectedConnector === "Splunk"
                              ? "Splunk Enterprise / Cloud"
                              : selectedConnector === "CrowdStrike"
                              ? "CrowdStrike Falcon"
                              : "Jira / Atlassian ITSM"}
                          </div>
                          <div className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                            Connect your {selectedConnector} account to import assets, configurations and security findings.
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => showToast(`Opening ${selectedConnector} Setup Guide...`)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition cursor-pointer"
                      >
                        <BookOpen size={12} className="text-slate-400" /> View Setup Guide
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                          Access Key ID <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center h-8.5 rounded-lg border border-slate-800 bg-[#071224] px-2.5 focus-within:border-blue-500 transition">
                          <Lock size={12} className="text-slate-400 mr-2 shrink-0" />
                          <input
                            type="text"
                            value={awsAccessKey}
                            onChange={(e) => setAwsAccessKey(e.target.value)}
                            className="w-full bg-transparent text-white text-xs font-medium outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                          Secret Access Key <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center h-8.5 rounded-lg border border-slate-800 bg-[#071224] px-2.5 focus-within:border-blue-500 transition">
                          <Lock size={12} className="text-slate-400 mr-2 shrink-0" />
                          <input
                            type={showSecretKey ? "text" : "password"}
                            value={awsSecretKey}
                            onChange={(e) => setAwsSecretKey(e.target.value)}
                            className="w-full bg-transparent text-white text-xs font-medium outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                            className="text-slate-400 hover:text-white cursor-pointer ml-1"
                          >
                            {showSecretKey ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                          Region <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center h-8.5 rounded-lg border border-slate-800 bg-[#071224] px-2.5 focus-within:border-blue-500 transition">
                          <Globe size={12} className="text-slate-400 mr-2 shrink-0" />
                          <select
                            value={awsRegion}
                            onChange={(e) => setAwsRegion(e.target.value)}
                            className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                          >
                            <option value="ap-south-1 (Mumbai)" className="bg-[#071224]">
                              ap-south-1 (Mumbai)
                            </option>
                            <option value="us-east-1 (N. Virginia)" className="bg-[#071224]">
                              us-east-1 (N. Virginia)
                            </option>
                            <option value="eu-west-1 (Ireland)" className="bg-[#071224]">
                              eu-west-1 (Ireland)
                            </option>
                            <option value="ap-southeast-1 (Singapore)" className="bg-[#071224]">
                              ap-southeast-1 (Singapore)
                            </option>
                          </select>
                          <ChevronDown size={12} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                          Read-Only Access
                          <Info size={11} className="text-slate-400" />
                        </label>
                        <div className="flex items-center h-8.5 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setReadOnlyAccess(!readOnlyAccess)}
                            className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                              readOnlyAccess ? "bg-blue-600 justify-end" : "bg-slate-700 justify-start"
                            }`}
                          >
                            <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                          </button>
                          <span className="text-[10.5px] text-slate-400">We only require read-only permissions.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Connection Footer */}
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="px-3 py-1.5 rounded-lg border border-blue-500/70 bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                    >
                      {isTesting && <RefreshCw size={12} className="animate-spin" />}
                      Test Connection
                    </button>

                    {testSuccess && (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span>Connection successful</span>
                        <span className="text-[10.5px] text-slate-400 font-normal ml-1">Last tested: Today, 10:24 AM</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Asset Inventory */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  3
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Asset Inventory</h3>
                  <p className="text-[11px] text-slate-400">
                    Import or discover your assets so CyberRiskIQ can build your risk inventory.
                  </p>
                </div>
              </div>

              {/* Asset Count & Cloud Region */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Estimated asset count <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center h-8.5 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Network size={12} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={assetCount}
                      onChange={(e) => setAssetCount(e.target.value)}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 mb-1.5 block">
                    Primary cloud region <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center h-8.5 rounded-lg border border-slate-800 bg-[#050b14] px-2.5 focus-within:border-blue-500 transition">
                    <Cloud size={12} className="text-slate-400 mr-2 shrink-0" />
                    <select
                      value={primaryCloudRegion}
                      onChange={(e) => setPrimaryCloudRegion(e.target.value)}
                      className="w-full bg-transparent text-white text-xs font-medium outline-none appearance-none cursor-pointer pr-5"
                    >
                      <option value="aws-ap-south-1 (Mumbai)" className="bg-[#071224]">
                        aws-ap-south-1 (Mumbai)
                      </option>
                      <option value="aws-us-east-1 (N. Virginia)" className="bg-[#071224]">
                        aws-us-east-1 (N. Virginia)
                      </option>
                      <option value="azure-central-india (Pune)" className="bg-[#071224]">
                        azure-central-india (Pune)
                      </option>
                      <option value="gcp-asia-south1 (Mumbai)" className="bg-[#071224]">
                        gcp-asia-south1 (Mumbai)
                      </option>
                      <option value="On-premises only" className="bg-[#071224]">
                        On-premises only
                      </option>
                    </select>
                    <ChevronDown size={12} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => {
                  setUploadedFileName("assets_inventory.csv");
                  showToast("Inventory CSV loaded (842 assets detected)");
                }}
                className="border border-dashed border-blue-800/60 hover:border-blue-500/70 rounded-xl p-4 bg-[#050c18] flex flex-col items-center justify-center text-center cursor-pointer transition mb-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1.5">
                  <Upload size={16} />
                </div>
                <div className="text-xs font-semibold text-white">Upload your asset inventory</div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Drag &amp; drop a CSV file, or <span className="text-sky-400 underline">browse files</span>
                </p>
              </div>

              {/* Uploaded File Pill Card */}
              {uploadedFileName && (
                <div className="p-2.5 rounded-lg border border-slate-800 bg-[#050c18] flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white leading-tight">{uploadedFileName}</div>
                      <div className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                        Uploaded successfully · <span className="text-emerald-400 font-medium">842 assets detected</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFileName(null);
                      showToast("File reset. Upload new inventory CSV.");
                    }}
                    className="px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition cursor-pointer"
                  >
                    Replace File
                  </button>
                </div>
              )}

              {/* Asset Breakdown */}
              <div>
                <div className="text-[11px] font-medium text-slate-300 mb-2">Asset Breakdown</div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="p-2 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                    <Server size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">420</div>
                      <div className="text-[10px] text-slate-400">Servers</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                    <Monitor size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">156</div>
                      <div className="text-[10px] text-slate-400">Endpoints</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                    <Cloud size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">128</div>
                      <div className="text-[10px] text-slate-400">Cloud Resources</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                    <Layers size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">94</div>
                      <div className="text-[10px] text-slate-400">Applications</div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                    <Clock size={14} className="text-slate-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">44</div>
                      <div className="text-[10px] text-slate-400">Other</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Connected Sources Summary */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  4
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Connected Sources Summary</h3>
                  <p className="text-[11px] text-slate-400">
                    Overview of your connected data sources and discovered assets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3 mt-3">
                {/* Left 4 Metric Boxes */}
                <div className="col-span-8">
                  <div className="text-[11px] font-medium text-slate-300 mb-2">Connected Sources</div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-3 rounded-lg border border-slate-800 bg-[#050c18] text-center">
                      <Cloud size={16} className="text-sky-400 mx-auto mb-1.5" />
                      <div className="text-base font-bold text-white leading-tight">{cloudCount}</div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">Cloud Accounts</div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-800 bg-[#050c18] text-center">
                      <Server size={16} className="text-slate-400 mx-auto mb-1.5" />
                      <div className="text-base font-bold text-white leading-tight">{onPremCount}</div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">On-Prem Sources</div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-800 bg-[#050c18] text-center">
                      <Shield size={16} className="text-blue-400 mx-auto mb-1.5" />
                      <div className="text-base font-bold text-white leading-tight">{secToolsCount}</div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">Security Tools</div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-800 bg-[#050c18] text-center">
                      <Database size={16} className="text-slate-400 mx-auto mb-1.5" />
                      <div className="text-base font-bold text-white leading-tight">{otherCount}</div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">Other Sources</div>
                    </div>
                  </div>
                </div>

                {/* Right Status Checklist */}
                <div className="col-span-4 border-l border-slate-800/80 pl-3">
                  <div className="text-[11px] font-medium text-slate-300 mb-2">Connection Status</div>
                  <div className="space-y-1 text-xs">
                    {connectorCatalog.slice(0, 6).map((c) => {
                      const isConn = enabledConnectors[c.id];
                      return (
                        <div key={c.id} className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-1.5">
                            {isConn ? (
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <Check size={9} strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-700 bg-[#050c18]" />
                            )}
                            <span className={isConn ? "text-slate-200 font-medium" : "text-slate-400 font-normal"}>
                              {c.id}
                            </span>
                          </div>
                          <span className={`text-[10.5px] font-medium ${isConn ? "text-emerald-400" : "text-slate-500"}`}>
                            {isConn ? "Connected" : "Not connected"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Review & Confirmation */}
            <section className="rounded-xl border border-blue-900/25 bg-[#071224] p-4">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  5
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Review &amp; Confirmation</h3>
                  <p className="text-[11px] text-slate-400">
                    Review your setup details and confirm to complete organization setup.
                  </p>
                </div>
              </div>

              {/* 5 Summary Boxes */}
              <div className="grid grid-cols-5 gap-2.5 mb-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#050c18] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                    Organization
                  </span>
                  <span className="font-semibold text-white truncate block mt-0.5">
                    {stepOneValues?.orgName || "Apple"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#050c18] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                    Industry
                  </span>
                  <span className="font-semibold text-white truncate block mt-0.5">
                    {stepOneValues?.industry || "IT Services"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#050c18] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                    Risk Appetite
                  </span>
                  <span className="font-semibold text-sky-400 truncate block mt-0.5">
                    {stepTwoValues?.appetite || stepOneValues?.riskAppetite || "Medium"}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#050c18] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                    Annual Budget
                  </span>
                  <span className="font-semibold text-emerald-400 truncate block mt-0.5">
                    ₹ 50,00,000
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#050c18] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                    Total Assets
                  </span>
                  <span className="font-semibold text-white truncate block mt-0.5">{assetCount}</span>
                </div>
              </div>

              {/* Connected Sources Row */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-medium text-slate-300">Connected Sources</span>
                  <div className="flex-1 h-[1px] bg-slate-800/80" />
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {enabledConnectors.AWS && (
                    <div className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                      <AwsLogo className="w-5 h-4" />
                      <span className="text-xs font-semibold text-white">AWS</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                        <Check size={10} strokeWidth={3} /> Connected
                      </span>
                    </div>
                  )}

                  {enabledConnectors.Splunk && (
                    <div className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                      <SplunkLogo className="w-4 h-4" />
                      <span className="text-xs font-semibold text-white">Splunk</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                        <Check size={10} strokeWidth={3} /> Connected
                      </span>
                    </div>
                  )}

                  {enabledConnectors.Qualys && (
                    <div className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                      <QualysLogo className="w-4 h-4" />
                      <span className="text-xs font-semibold text-white">Qualys</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                        <Check size={10} strokeWidth={3} /> Connected
                      </span>
                    </div>
                  )}

                  {enabledConnectors.Azure && (
                    <div className="px-3 py-1.5 rounded-lg border border-slate-800 bg-[#050c18] flex items-center gap-2">
                      <AzureLogo className="w-4 h-4" />
                      <span className="text-xs font-semibold text-white">Azure</span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                        <Check size={10} strokeWidth={3} /> Connected
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div
                onClick={() => setConfirmed(!confirmed)}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-800/90 bg-[#050c18] cursor-pointer hover:border-slate-700 transition"
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    confirmed ? "bg-blue-600 text-white" : "border border-slate-700 bg-[#040810]"
                  }`}
                >
                  {confirmed && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="text-xs text-slate-200 font-normal">
                  I confirm that the organization details, risk parameters, and asset information provided are accurate.
                </span>
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
              onClick={handleCompleteSetup}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_16px_rgba(37,99,235,0.4)] transition cursor-pointer"
            >
              Complete Setup <ArrowRight size={13} />
            </button>
          </div>
        </main>

        {/* RIGHT PROGRESS RAIL */}
        <aside className="relative rounded-2xl overflow-hidden border border-blue-500/15 bg-[#040810] flex flex-col justify-between p-6 shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-bottom pointer-events-none z-0"
            style={{ backgroundImage: "url('/images/setup-rail.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040810]/70 via-[#040810]/25 to-transparent pointer-events-none z-[1]" />

          <div className="relative z-10">
            <h2 className="text-sm font-bold text-white mb-6 tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Setup Progress
            </h2>

            <div className="space-y-6">
              {/* Step 1: Organization (Done) */}
              <div className="flex items-start gap-3.5 relative">
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-slate-700/70 z-0" />
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 z-10 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white leading-tight">Organization</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">Basic information</div>
                </div>
              </div>

              {/* Step 2: Risk Parameters (Done) */}
              <div className="flex items-start gap-3.5 relative">
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-slate-700/70 z-0" />
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 z-10 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white leading-tight">Risk Parameters</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                    Business context &amp; risk configuration
                  </div>
                </div>
              </div>

              {/* Step 3: Assets (Active) */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 z-10 shadow-[0_0_12px_rgba(37,99,235,0.6)]">
                  3
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-400 leading-tight">Assets</div>
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
                  We use industry-leading encryption to keep your information safe. Read-only access ensures your systems
                  remain protected.
                </div>
              </div>
            </div>
          </div>

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

      {/* Completion Modal */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020611]/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-md w-full rounded-2xl border border-blue-500/30 bg-[#071224] p-7 text-center shadow-[0_0_50px_rgba(37,99,235,0.25)] relative"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(16,185,129,0.4)]">
                <Check size={32} strokeWidth={3} />
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">
                {stepOneValues?.orgName || "Apple"} is Ready!
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Your organizational risk posture model has been generated across{" "}
                <span className="text-sky-400 font-semibold">{assetCount} assets</span> and{" "}
                <span className="text-sky-400 font-semibold">{stepOneValues?.industry || "IT Services"}</span> benchmarks.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-5 mb-5 text-left text-xs">
                <div className="p-2.5 rounded-lg bg-[#050c18] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Active Connectors</span>
                  <span className="font-semibold text-emerald-400 text-sm">3 Live Sources</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#050c18] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Risk Appetite</span>
                  <span className="font-semibold text-sky-400 text-sm">Medium (Balanced)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => (onContinue ? onContinue() : onLaunchDashboard && onLaunchDashboard())}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket size={15} /> Enter Executive Dashboard
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
