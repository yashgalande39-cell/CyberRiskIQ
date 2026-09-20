import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  IndianRupee,
  Network,
  Tag,
  Upload,
  UserRound,
  Users,
} from "lucide-react";
import { CheckPill, Field, Section, Select, TextInput, type FormState } from "./Fields";

const appetites = [
  { key: "Low", dot: "#22c55e", label: "Conservative approach" },
  { key: "Medium", dot: "#2f8fff", label: "Balanced approach" },
  { key: "High", dot: "#ef4444", label: "Aggressive approach" },
] as const;

const frameworks = ["ISO 27001", "GDPR", "RBI", "SEBI", "Other (please specify)"];

type Err = Record<string, string>;

type StepProps = {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  err: Err;
};

export function StepOne({ form, set, err }: StepProps) {
  const toggleFramework = (name: string) =>
    set("frameworks", form.frameworks.includes(name) ? form.frameworks.filter((f) => f !== name) : [...form.frameworks, name]);

  return (
    <>
      <Section n={1} title="Organization">
        <div className="grid">
          <Field label="Organization name" error={err.orgName}>
            <TextInput icon={<UserRound size={15} />} placeholder="e.g. Acme Technologies Pvt. Ltd." value={form.orgName} onChange={(v) => set("orgName", v)} />
          </Field>
          <Field label="Industry" error={err.industry}>
            <Select icon={<BriefcaseBusiness size={15} />} placeholder="Select industry" value={form.industry} onChange={(v) => set("industry", v)} options={["Banking & Finance", "IT Services", "Manufacturing", "Healthcare", "Retail", "Energy & Utilities", "Telecom"]} />
          </Field>
          <Field label="Company size" error={err.companySize}>
            <Select icon={<Users size={15} />} placeholder="Select company size" value={form.companySize} onChange={(v) => set("companySize", v)} options={["1-50 employees", "51-200 employees", "201-1000 employees", "1001-5000 employees", "5000+ employees"]} />
          </Field>
          <Field label="Revenue band" error={err.revenueBand}>
            <Select icon={<Tag size={15} />} placeholder="Select revenue band" value={form.revenueBand} onChange={(v) => set("revenueBand", v)} options={["< ₹100 Cr", "₹100 Cr – ₹500 Cr", "₹500 Cr – ₹1,000 Cr", "₹1,000 Cr – ₹5,000 Cr", "> ₹5,000 Cr"]} />
          </Field>
        </div>
      </Section>

      <Section n={2} title="Business Structure">
        <div className="grid">
          <Field label="Business units" hint="Add multiple units (comma separated)" error={err.businessUnits}>
            <TextInput icon={<Network size={15} />} placeholder="e.g. Product, Operations, Finance" value={form.businessUnits} onChange={(v) => set("businessUnits", v)} />
          </Field>
          <Field label="Departments" hint="Add multiple departments (comma separated)" error={err.departments}>
            <TextInput icon={<Building2 size={15} />} placeholder="e.g. IT, HR, Finance, Legal" value={form.departments} onChange={(v) => set("departments", v)} />
          </Field>
        </div>
      </Section>

      <Section n={3} title="Risk Posture">
        <div className="field">
          <span className="label">
            Risk appetite <i>*</i>
          </span>
          <div className="appetite">
            {appetites.map((a) => (
              <button type="button" key={a.key} className={form.riskAppetite === a.key ? "on" : ""} onClick={() => set("riskAppetite", a.key)}>
                <span className="appetite-top">
                  <i style={{ background: a.dot, boxShadow: `0 0 9px ${a.dot}` }} />
                  {a.key}
                </span>
                <small>{a.label}</small>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section n={4} title="Security Budget">
        <div className="grid">
          <Field label="Annual security budget (₹)" error={err.budget}>
            <TextInput icon={<IndianRupee size={15} />} placeholder="e.g. 50,00,000" value={form.budget} onChange={(v) => set("budget", v)} />
          </Field>
          <Field label="Budget period" error={err.budgetPeriod}>
            <Select icon={<CalendarDays size={15} />} placeholder="Select period" value={form.budgetPeriod} onChange={(v) => set("budgetPeriod", v)} options={["Monthly", "Quarterly", "Half-yearly", "Annual", "Multi-year (3 years)"]} />
          </Field>
        </div>
      </Section>

      <Section n={5} title="Compliance">
        <div className="field">
          <span className="label">
            Applicable frameworks <i>*</i>
          </span>
          <div className="checks">
            {frameworks.map((f) => (
              <CheckPill key={f} label={f} checked={form.frameworks.includes(f)} onToggle={() => toggleFramework(f)} />
            ))}
          </div>
          {err.frameworks && <em className="err">{err.frameworks}</em>}
        </div>
        <div className="full">
          <TextInput icon={<FileText size={15} />} placeholder="e.g., HIPAA, SOC 2, NIST, etc." value={form.otherFrameworks} onChange={(v) => set("otherFrameworks", v)} />
        </div>
      </Section>
    </>
  );
}

export function StepTwo({ form, set, err }: StepProps) {
  return (
    <>
      <Section n={1} title="Risk Thresholds">
        <div className="grid">
          <Field label="Maximum acceptable annual loss (₹)" error={err.maxLoss}>
            <TextInput icon={<IndianRupee size={15} />} placeholder="e.g. 2,50,00,000" value={form.maxLoss} onChange={(v) => set("maxLoss", v)} />
          </Field>
          <Field label="Critical asset threshold" error={err.criticalThreshold}>
            <Select icon={<Tag size={15} />} placeholder="Select threshold" value={form.criticalThreshold} onChange={(v) => set("criticalThreshold", v)} options={["Top 1% of assets", "Top 5% of assets", "Top 10% of assets", "Top 25% of assets"]} />
          </Field>
        </div>
        <div className="grid">
          <Field label="Control maturity target" error={err.controlMaturity}>
            <Select icon={<BriefcaseBusiness size={15} />} placeholder="Select target" value={form.controlMaturity} onChange={(v) => set("controlMaturity", v)} options={["Foundational", "Defined", "Managed", "Optimized"]} />
          </Field>
          <Field label="Reporting currency">
            <Select icon={<IndianRupee size={15} />} placeholder="Select currency" value={form.currency} onChange={(v) => set("currency", v)} options={["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)"]} />
          </Field>
        </div>
      </Section>

      <Section n={2} title="Financial Modeling">
        <div className="grid">
          <Field label="Expected revenue growth (%)">
            <TextInput icon={<Tag size={15} />} placeholder="e.g. 12" value={form.growth} onChange={(v) => set("growth", v)} />
          </Field>
          <Field label="Cyber insurance coverage (₹)">
            <TextInput icon={<IndianRupee size={15} />} placeholder="e.g. 1,00,00,000" value={form.insurance} onChange={(v) => set("insurance", v)} />
          </Field>
        </div>
      </Section>

      <Section n={3} title="Governance">
        <div className="grid">
          <Field label="Risk review cadence" error={err.reviewCadence}>
            <Select icon={<CalendarDays size={15} />} placeholder="Select cadence" value={form.reviewCadence} onChange={(v) => set("reviewCadence", v)} options={["Weekly", "Monthly", "Quarterly", "Annually"]} />
          </Field>
          <Field label="Board reporting frequency" error={err.boardFrequency}>
            <Select icon={<FileText size={15} />} placeholder="Select frequency" value={form.boardFrequency} onChange={(v) => set("boardFrequency", v)} options={["Monthly digest", "Quarterly review", "Semi-annual", "Annual report"]} />
          </Field>
        </div>
      </Section>
    </>
  );
}

const connectorMeta: Record<string, string> = {
  Qualys: "Vulnerability management",
  Splunk: "SIEM & threat logs",
  "AWS Config": "Cloud asset inventory",
  "Azure AD": "Identity & endpoints",
  CrowdStrike: "Endpoint detection",
  Jira: "Remediation workflow",
};

export function StepThree({ form, set, err }: StepProps) {
  const connectorKeys = Object.keys(form.connectors);
  const anyOn = connectorKeys.some((k) => form.connectors[k]);

  return (
    <>
      <Section n={1} title="Data Connectors">
        <div className="field">
          <span className="label">
            Connect your data sources <i>*</i>
          </span>
          <div className="connectors">
            {connectorKeys.map((key) => {
              const on = form.connectors[key];
              return (
                <button type="button" key={key} className={`connector ${on ? "on" : ""}`} onClick={() => set("connectors", { ...form.connectors, [key]: !on })}>
                  <span className="connector-copy">
                    <b>{key}</b>
                    <small>{connectorMeta[key]}</small>
                  </span>
                  <span className="switch"><i /></span>
                </button>
              );
            })}
          </div>
          {!anyOn && <em className="err">Enable at least one data source to continue.</em>}
        </div>
      </Section>

      <Section n={2} title="Asset Inventory">
        <div className="grid">
          <Field label="Estimated asset count" error={err.assetCount}>
            <TextInput icon={<Network size={15} />} placeholder="e.g. 842" value={form.assetCount} onChange={(v) => set("assetCount", v)} />
          </Field>
          <Field label="Primary cloud region" error={err.cloudRegion}>
            <Select icon={<Tag size={15} />} placeholder="Select region" value={form.cloudRegion} onChange={(v) => set("cloudRegion", v)} options={["aws-ap-south-1", "aws-us-east-1", "azure-central-india", "gcp-asia-south1", "On-premises only"]} />
          </Field>
        </div>
        <div className="dropzone">
          <span><Upload size={18} /></span>
          <div>
            <b>Upload your asset inventory</b>
            <small>Drag & drop a CSV file, or <u>browse files</u></small>
          </div>
        </div>
      </Section>

      <Section n={3} title="Review & Launch">
        <ul className="review">
          <li><span>Organization</span><b>{form.orgName || "—"}</b></li>
          <li><span>Industry</span><b>{form.industry || "—"}</b></li>
          <li><span>Risk appetite</span><b>{form.riskAppetite}</b></li>
          <li><span>Annual budget</span><b>{form.budget ? `₹ ${form.budget} · ${form.budgetPeriod}` : "—"}</b></li>
          <li><span>Frameworks</span><b>{form.frameworks.length ? form.frameworks.join(", ") : "—"}</b></li>
        </ul>
        <button type="button" className={`check confirm ${form.confirm ? "on" : ""}`} onClick={() => set("confirm", !form.confirm)}>
          <span className="box" />I confirm the information provided is accurate
        </button>
        {err.confirm && <em className="err">{err.confirm}</em>}
      </Section>
    </>
  );
}
