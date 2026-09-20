export type StatusTone = "compliant" | "attention" | "progress" | "open" | "low" | "high" | "medium";

/* ---------- KPI: overall compliance gauge ---------- */
export const overallCompliance = 78;
export const overallDelta = 8; // vs last quarter (%)

/* ---------- Framework score bars ---------- */
export interface FrameworkScore {
  name: string;
  value: number;
  fill: string;
}

export const frameworkScores: FrameworkScore[] = [
  { name: "ISO 27001", value: 92, fill: "url(#gradIso)" },
  { name: "NIST CSF", value: 85, fill: "url(#gradNist)" },
  { name: "PCI DSS", value: 78, fill: "url(#gradPci)" },
  { name: "SOC 2", value: 71, fill: "url(#gradSoc)" },
  { name: "CIS Controls", value: 68, fill: "url(#gradCis)" },
];

/* ---------- Control implementation donut ---------- */
export interface ImplementationSlice {
  name: string;
  value: number;
  pct: number;
  color: string;
}

export const implementationStatus: ImplementationSlice[] = [
  { name: "Compliant", value: 342, pct: 78, color: "#10b981" },
  { name: "Partially Compliant", value: 64, pct: 15, color: "#f59e0b" },
  { name: "Non-Compliant", value: 32, pct: 7, color: "#ef4444" },
];

export const totalControls = 438;

/* ---------- Compliance trend ---------- */
export const trendData = [
  { m: "Jan", overall: 45, target: 45 },
  { m: "Feb", overall: 54, target: 50 },
  { m: "Mar", overall: 59, target: 55 },
  { m: "Apr", overall: 63, target: 58 },
  { m: "May", overall: 69, target: 63 },
  { m: "Jun", overall: 74, target: 68 },
];

/* ---------- Compliance health bars ---------- */
export interface HealthRow {
  label: string;
  value: number;
  color: string;
}

export const healthRows: HealthRow[] = [
  { label: "Identity & Access", value: 92, color: "#2dd4bf" },
  { label: "Data Protection", value: 78, color: "#3b82f6" },
  { label: "Infrastructure", value: 71, color: "#f59e0b" },
  { label: "Application Security", value: 76, color: "#3b82f6" },
  { label: "Policies & Procedures", value: 85, color: "#2dd4bf" },
];

/* ---------- Framework compliance details table ---------- */
export type FrameworkStatus = "Compliant" | "Needs Attention" | "In Progress";

export interface FrameworkDetail {
  icon: "globe" | "shield" | "card" | "plus" | "network";
  name: string;
  compliance: number;
  total: number;
  compliant: number;
  partially: number;
  nonCompliant: number;
  status: FrameworkStatus;
}

export const frameworkDetails: FrameworkDetail[] = [
  {
    icon: "globe",
    name: "ISO 27001",
    compliance: 92,
    total: 114,
    compliant: 105,
    partially: 6,
    nonCompliant: 3,
    status: "Compliant",
  },
  {
    icon: "shield",
    name: "NIST CSF",
    compliance: 85,
    total: 98,
    compliant: 83,
    partially: 10,
    nonCompliant: 5,
    status: "Compliant",
  },
  {
    icon: "card",
    name: "PCI DSS",
    compliance: 78,
    total: 89,
    compliant: 69,
    partially: 14,
    nonCompliant: 6,
    status: "Needs Attention",
  },
  {
    icon: "plus",
    name: "SOC 2",
    compliance: 71,
    total: 72,
    compliant: 51,
    partially: 16,
    nonCompliant: 5,
    status: "In Progress",
  },
  {
    icon: "network",
    name: "CIS Controls",
    compliance: 68,
    total: 65,
    compliant: 44,
    partially: 18,
    nonCompliant: 3,
    status: "In Progress",
  },
];

/* ---------- Top compliance gaps ---------- */
export type GapRisk = "High" | "Medium" | "Low";
export type GapStatus = "Open" | "In Progress";

export interface ComplianceGap {
  num: number;
  control: string;
  framework: string;
  risk: GapRisk;
  status: GapStatus;
}

export const complianceGaps: ComplianceGap[] = [
  { num: 1, control: "MFA for all users", framework: "NIST CSF", risk: "High", status: "Open" },
  { num: 2, control: "Encrypt data at rest", framework: "PCI DSS", risk: "High", status: "Open" },
  {
    num: 3,
    control: "Regular vulnerability scanning",
    framework: "ISO 27001",
    risk: "Medium",
    status: "In Progress",
  },
  { num: 4, control: "Incident response plan", framework: "SOC 2", risk: "Medium", status: "In Progress" },
  {
    num: 5,
    control: "Vendor risk assessment",
    framework: "CIS Controls",
    risk: "Low",
    status: "Open",
  },
];

/* ---------- Recent activities ---------- */
export type ActivityTone = "green" | "blue" | "blue2" | "red" | "yellow";

export interface Activity {
  tone: ActivityTone;
  time: string;
  text: string;
  framework: string;
}

export const recentActivities: Activity[] = [
  { tone: "green", time: "2 hours ago", text: "Control C-1.1 marked as compliant", framework: "ISO 27001" },
  {
    tone: "blue",
    time: "5 hours ago",
    text: "Evidence uploaded: Access policy document",
    framework: "NIST CSF",
  },
  { tone: "blue2", time: "1 day ago", text: "Compliance assessment completed", framework: "PCI DSS" },
  { tone: "red", time: "2 days ago", text: "New gap identified: Encryption at rest", framework: "SOC 2" },
  {
    tone: "yellow",
    time: "3 days ago",
    text: "Policy updated: Incident Response Plan",
    framework: "CIS Controls",
  },
];

/* ---------- Audit readiness checklist ---------- */
export const auditChecklist = [
  { label: "Access control policies documented", done: true },
  { label: "Asset inventory up to date", done: true },
  { label: "Vulnerability scanning reports available", done: true },
  { label: "Incident response plan tested", done: true },
  { label: "Third-party risk assessments completed", done: false },
];
