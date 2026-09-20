import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type FormState = {
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
  maxLoss: string;
  criticalThreshold: string;
  controlMaturity: string;
  currency: string;
  growth: string;
  insurance: string;
  reviewCadence: string;
  boardFrequency: string;
  notifyEmail: string;
  connectors: Record<string, boolean>;
  assetCount: string;
  cloudRegion: string;
  confirm: boolean;
};

export const emptyForm: FormState = {
  orgName: "",
  industry: "",
  companySize: "",
  revenueBand: "",
  businessUnits: "",
  departments: "",
  riskAppetite: "Medium",
  budget: "",
  budgetPeriod: "",
  frameworks: [],
  otherFrameworks: "",
  maxLoss: "",
  criticalThreshold: "",
  controlMaturity: "",
  currency: "INR (₹)",
  growth: "",
  insurance: "",
  reviewCadence: "",
  boardFrequency: "",
  notifyEmail: "",
  connectors: { Qualys: true, Splunk: false, "AWS Config": false, "Azure AD": false, CrowdStrike: false, Jira: false },
  assetCount: "",
  cloudRegion: "",
  confirm: false,
};

export function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="card">
      <div className="card-head">
        <span className="num">{n}</span>
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className={`field ${error ? "invalid" : ""}`}>
      <span className="label">
        {label} <i>*</i>
      </span>
      {children}
      {error ? <em className="err">{error}</em> : hint ? <em className="hint">{hint}</em> : null}
    </label>
  );
}

type InputProps = {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  type?: string;
};

export function TextInput({ icon, placeholder, value, onChange, prefix, type = "text" }: InputProps) {
  return (
    <span className="control">
      <span className="ctl-icon">{icon}</span>
      {prefix && <span className="ctl-prefix">{prefix}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </span>
  );
}

type SelectProps = {
  icon: ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
};

export function Select({ icon, placeholder, value, onChange, options }: SelectProps) {
  return (
    <span className="control">
      <span className="ctl-icon">{icon}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={value ? "" : "placeholder"}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="ctl-caret" />
    </span>
  );
}

export function CheckPill({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={`check ${checked ? "on" : ""}`} onClick={onToggle}>
      <span className="box" />
      {label}
    </button>
  );
}
