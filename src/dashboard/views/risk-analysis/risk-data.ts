export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type Asset = {
  id: number;
  name: string;
  type: string;
  businessUnit: string;
  score: number;
  level: RiskLevel;
  issues: string;
  owner: string;
  exposure: string;
  category: string;
};

export const assets: Asset[] = [
  { id: 1, name: 'Payment Gateway', type: 'Application', businessUnit: 'Finance', score: 92, level: 'Critical', issues: '12 critical vulns', owner: 'Payments Engineering', exposure: '₹ 48 L', category: 'Applications' },
  { id: 2, name: 'Finance Database', type: 'Database', businessUnit: 'Finance', score: 88, level: 'Critical', issues: '8 critical vulns', owner: 'Finance Operations', exposure: '₹ 32 L', category: 'Databases' },
  { id: 3, name: 'Active Directory', type: 'Identity', businessUnit: 'IT', score: 81, level: 'High', issues: '5 critical vulns', owner: 'Identity & Access', exposure: '₹ 28 L', category: 'Applications' },
  { id: 4, name: 'Web Server', type: 'Server', businessUnit: 'IT', score: 76, level: 'High', issues: '6 high vulns', owner: 'Infrastructure', exposure: '₹ 18 L', category: 'Servers' },
  { id: 5, name: 'Employee Portal', type: 'Application', businessUnit: 'HR', score: 64, level: 'Medium', issues: '4 high vulns', owner: 'People Operations', exposure: '₹ 12 L', category: 'Applications' },
];

export const factors = [
  { name: 'Critical Vulnerabilities', value: 21, color: '#ff354b', track: 100, fill: 67, explanation: 'Unpatched, exploitable vulnerabilities have the largest influence on your current risk. Prioritize the Payment Gateway and Finance Database.' },
  { name: 'Asset Criticality', value: 17, color: '#ff4c4e', track: 92, fill: 64, explanation: 'Business-critical payment, finance, and identity services have a higher impact if disrupted. Review ownership and recovery requirements.' },
  { name: 'External Exposure', value: 13, color: '#ff843c', track: 82, fill: 55, explanation: 'Internet-facing services increase your attack surface. Review public endpoints, restrict unnecessary access, and segment exposed services.' },
  { name: 'Threat Likelihood', value: 11, color: '#ffd047', track: 69, fill: 53, explanation: 'Current threat intelligence indicates active exploitation relevant to your technology stack. Keep detection rules and threat feeds current.' },
  { name: 'Control Coverage (Gaps)', value: 7, color: '#00a5ef', track: 61, fill: 40, explanation: 'Missing or incomplete control evidence reduces confidence in your defenses. Validate MFA, endpoint protection, and backup coverage.' },
];

export const completeness = [
  { name: 'Assets', value: 92, color: '#00d6bb' },
  { name: 'Vulnerabilities', value: 78, color: '#ffcf43' },
  { name: 'Controls', value: 65, color: '#ff833f' },
  { name: 'Threat Intelligence', value: 88, color: '#00d8b7' },
];

export const categories = [
  { name: 'Servers', value: 78, share: 17, color: '#ff354b', numberColor: '#ff354b' },
  { name: 'Databases', value: 81, share: 18, color: '#ff823c', numberColor: '#ff823c' },
  { name: 'Network Devices', value: 65, share: 19, color: '#ffce42', numberColor: '#ff823c' },
  { name: 'Endpoints', value: 54, share: 13, color: '#03aaf2', numberColor: '#f2efff' },
  { name: 'Applications', value: 69, share: 13, color: '#8b42f7', numberColor: '#ffce42' },
  { name: 'Cloud Services', value: 62, share: 12, color: '#00cfb9', numberColor: '#f2efff' },
  { name: 'Others', value: 48, share: 8, color: '#b7c5e1', numberColor: '#f2efff' },
];

export type RiskEvent = { date: string; text: string; color: string };

export const initialEvents: RiskEvent[] = [
  { date: 'Jun 15, 2024', text: 'Risk recalculated (score: 72)', color: '#54dfbc' },
  { date: 'Jun 14, 2024', text: '5 new vulnerabilities identified', color: '#ff354b' },
  { date: 'Jun 13, 2024', text: 'Control coverage updated', color: '#a4b9e0' },
  { date: 'Jun 12, 2024', text: 'Asset risk score changed (Web Server)', color: '#ffdc4d' },
  { date: 'Jun 11, 2024', text: 'Threat intelligence feed updated', color: '#00d89f' },
];

export const recommendations = [
  { id: 'REC-001', name: 'Patch critical vulnerabilities', detail: 'Resolve critical vulnerabilities on the Payment Gateway and Finance Database.', reduction: '12%', cost: '₹ 15 L', priority: 'High' },
  { id: 'REC-002', name: 'Implement MFA for all users', detail: 'Protect privileged accounts and enforce MFA across Active Directory.', reduction: '15%', cost: '₹ 20 L', priority: 'High' },
  { id: 'REC-003', name: 'Deploy EDR on all endpoints', detail: 'Install next-generation endpoint detection and response across the organization.', reduction: '18%', cost: '₹ 60 L', priority: 'High' },
  { id: 'REC-004', name: 'Network segmentation', detail: 'Isolate public-facing workloads from business-critical systems.', reduction: '12%', cost: '₹ 50 L', priority: 'Medium' },
];

export function loadStringList(key: string, fallback: string[] = []): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : fallback;
  } catch {
    return fallback;
  }
}

export function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportRiskCsv() {
  const rows = [
    ['CyberRiskIQ Risk Analysis', 'Organization risk score', '72', 'Confidence', '81%'],
    ['Asset Name', 'Type', 'Business Unit', 'Risk Score', 'Risk Level', 'Key Issues'],
    ...assets.map((asset) => [asset.name, asset.type, asset.businessUnit, asset.score, asset.level, asset.issues]),
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  downloadFile('CyberRiskIQ-Risk-Analysis.csv', '\uFEFF' + csv, 'text/csv;charset=utf-8');
}
