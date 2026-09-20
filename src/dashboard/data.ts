export const user = { name: 'Yash Galande', role: 'CISO', initials: 'YG' };

export const orgs = ['Acme Technologies Pvt. Ltd.', 'Acme Retail Division', 'Acme Cloud Services'];

export const notifications = [
  { id: 1, title: 'New critical vulnerability CVE-2024-3094', detail: 'Web Server 01 · exposure ₹ 28.4 L', time: '10 mins ago', kind: 'Critical' },
  { id: 2, title: 'Asset exposure increased', detail: 'Finance DB likelihood moved to Very High', time: '1 hour ago', kind: 'High' },
  { id: 3, title: 'Security control disabled', detail: 'Endpoint Protection · 62 assets affected', time: '3 hours ago', kind: 'Medium' },
];

export type RangeKey = '7d' | '30d' | '90d' | '12m';
export const ranges: { key: RangeKey; label: string; labels: string[]; org: number[]; target: number[] }[] = [
  { key: '7d', label: 'Last 7 days', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], org: [68, 70, 67, 71, 73, 71, 72], target: [44, 44, 43, 43, 42, 42, 40] },
  { key: '30d', label: 'Last 30 days', labels: ['W1', 'W2', 'W3', 'W4', 'Today'], org: [75, 73, 70, 74, 72], target: [47, 45, 44, 42, 40] },
  { key: '90d', label: 'Last 90 days', labels: ['Oct', 'Nov', 'Dec'], org: [66, 68, 72], target: [46, 43, 40] },
  { key: '12m', label: 'Last 12 months', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], org: [62, 64, 66, 63, 70, 68, 62, 60, 64, 66, 68, 72], target: [55, 52, 50, 48, 46, 45, 44, 43, 42, 41, 40, 40] },
];

export const kpis = [
  { id: 'risk', icon: 'shieldHeart' as const, tone: 'red', label: 'Overall Risk Score', value: '72', suffix: '/ 100', badge: 'High Risk', delta: '12%', dir: 'up' as const, foot: 'vs last month', footTop: '' },
  { id: 'ale', icon: 'rupee' as const, tone: 'blue', label: 'Financial Exposure', value: '₹ 1.25 Cr', badge: '', dir: 'none' as const, delta: '', foot: '', footTop: 'Annualized Loss (ALE)', footBottom: 'Best: ₹ 0.4 Cr   Likely: ₹ 1.25 Cr   Worst: ₹ 3.8 Cr' },
  { id: 'vuln', icon: 'bug' as const, tone: 'red', label: 'Open Vulnerabilities', value: '1,248', badge: '', dir: 'down' as const, delta: '18%', foot: 'vs last month', footTop: '204 Critical   |   412 High', tone2: 'split' },
  { id: 'control', icon: 'shieldCheck' as const, tone: 'green', label: 'Security Control Coverage', value: '72%', badge: '', dir: 'up' as const, delta: '8%', foot: 'vs last month', footTop: '' },
  { id: 'budget', icon: 'database' as const, tone: 'blue', label: 'Security Budget', value: '₹ 25,00,000', badge: '', dir: 'none' as const, delta: '', foot: '', footTop: 'Current Spend', footBottom: '₹ 9,50,000 (38%)', bar: 38 },
  { id: 'reduction', icon: 'target' as const, tone: 'blue', label: 'Risk Reduction Achieved', value: '18%', badge: '', dir: 'up' as const, delta: '6%', foot: 'vs last month', footTop: '' },
];

export const categories = [
  { label: 'Endpoints', value: 28, color: '#3b82f6' },
  { label: 'Applications', value: 24, color: '#8b5cf6' },
  { label: 'Infrastructure', value: 20, color: '#22d3ee' },
  { label: 'Cloud', value: 15, color: '#eab308' },
  { label: 'Network', value: 8, color: '#f97316' },
  { label: 'Other', value: 5, color: '#64748b' },
];

export const heatmap = {
  cols: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
  rows: [
    { label: 'Very High', values: [0, 2, 8, 12, 6] },
    { label: 'High', values: [1, 6, 18, 24, 10] },
    { label: 'Medium', values: [4, 16, 28, 20, 8] },
    { label: 'Low', values: [8, 14, 12, 6, 2] },
    { label: 'Very Low', values: [6, 4, 2, 1, 0] },
  ],
};

export const completeness = [
  { label: 'Assets', value: 92, color: '#22c55e' },
  { label: 'Vulnerabilities', value: 78, color: '#3b82f6' },
  { label: 'Controls', value: 65, color: '#eab308' },
  { label: 'Threat Intel', value: 85, color: '#22c55e' },
];

export type Status = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export const topRisks: { id: number; title: string; asset: string; score: number; exposure: string; status: Status }[] = [
  { id: 1, title: 'Unpatched CVE-2024-3094', asset: 'Web Server 01', score: 92, exposure: '₹ 28.4 L', status: 'Critical' },
  { id: 2, title: 'Ransomware Exposure', asset: 'Finance DB', score: 88, exposure: '₹ 22.1 L', status: 'High' },
  { id: 3, title: 'Excessive Admin Privileges', asset: 'Active Directory', score: 81, exposure: '₹ 18.7 L', status: 'High' },
  { id: 4, title: 'Public S3 Bucket', asset: 'Cloud Storage', score: 76, exposure: '₹ 12.9 L', status: 'Medium' },
  { id: 5, title: 'Outdated SSL/TLS', asset: 'Internal App', score: 69, exposure: '₹ 9.3 L', status: 'Medium' },
];

export const allRisks: typeof topRisks = [
  ...topRisks,
  { id: 6, title: 'Unrestricted RDP Access', asset: 'Jump Host 04', score: 66, exposure: '₹ 8.1 L', status: 'Medium' },
  { id: 7, title: 'Legacy Unsupported OS', asset: 'Plant Floor PCs', score: 63, exposure: '₹ 7.6 L', status: 'Medium' },
  { id: 8, title: 'Overly Permissive IAM', asset: 'AWS Production', score: 58, exposure: '₹ 6.2 L', status: 'Low' },
  { id: 9, title: 'Missing DLP Policy', asset: 'Sales Laptops', score: 52, exposure: '₹ 4.4 L', status: 'Low' },
  { id: 10, title: 'Stale Service Accounts', asset: 'ERP Integration', score: 47, exposure: '₹ 3.1 L', status: 'Low' },
];

export const riskFactors = [
  { label: 'Likelihood', value: 78, color: '#ef4444' },
  { label: 'Impact', value: 65, color: '#f97316' },
  { label: 'Exposure Modifier', value: 52, color: '#3b82f6' },
  { label: 'Control Modifier', value: 38, color: '#22c55e' },
];

export const investments = [
  { id: 1, title: 'Deploy EDR across all endpoints', priority: 'P0', cost: '₹ 12,00,000', reduction: '28%', ale: '₹ 34.2 L', assets: '420' },
  { id: 2, title: 'Implement MFA for all users', priority: 'P1', cost: '₹ 6,50,000', reduction: '18%', ale: '₹ 21.8 L', assets: '1,000+' },
  { id: 3, title: 'Upgrade Web Application Firewall', priority: 'P1', cost: '₹ 8,75,000', reduction: '16%', ale: '₹ 19.6 L', assets: '12' },
  { id: 4, title: 'Segment the finance network', priority: 'P2', cost: '₹ 15,40,000', reduction: '11%', ale: '₹ 12.4 L', assets: '96' },
  { id: 5, title: 'Automated patch orchestration', priority: 'P2', cost: '₹ 4,90,000', reduction: '9%', ale: '₹ 9.8 L', assets: '1,240' },
];

export const events: { severity: Status; text: string; time: string }[] = [
  { severity: 'Critical', text: 'New critical vulnerability detected (CVE-2024-3094)', time: '10 mins ago' },
  { severity: 'High', text: 'Asset exposure increased - Finance DB', time: '1 hour ago' },
  { severity: 'Medium', text: 'Security control disabled - Endpoint Protection', time: '3 hours ago' },
  { severity: 'Info', text: 'Risk score recalculated for 12 assets', time: '5 hours ago' },
  { severity: 'High', text: 'Threat actor activity mapped to your sector', time: '8 hours ago' },
];

export const forecast = {
  labels: ['Now', '30 days', '60 days', '90 days'],
  projected: [72, 68, 62, 58],
  current: [72, 71, 70, 69],
  target: [40, 40, 40, 40],
  score: 58,
  delta: '19%',
  confidence: 'High confidence',
};

export const assets = [
  { name: 'Web Server 01', type: 'Server', criticality: 'Critical', owner: 'Infra Team', score: 92, exposure: '₹ 28.4 L' },
  { name: 'Finance DB', type: 'Database', criticality: 'Critical', owner: 'Finance IT', score: 88, exposure: '₹ 22.1 L' },
  { name: 'Active Directory', type: 'Identity', criticality: 'Critical', owner: 'Infra Team', score: 81, exposure: '₹ 18.7 L' },
  { name: 'Cloud Storage', type: 'Cloud', criticality: 'High', owner: 'Platform Team', score: 76, exposure: '₹ 12.9 L' },
  { name: 'Internal App', type: 'Application', criticality: 'High', owner: 'Apps Team', score: 69, exposure: '₹ 9.3 L' },
  { name: 'Endpoint Fleet', type: 'Endpoints', criticality: 'Medium', owner: 'IT Support', score: 61, exposure: '₹ 7.2 L' },
  { name: 'ERP Integration', type: 'Application', criticality: 'Medium', owner: 'Apps Team', score: 47, exposure: '₹ 3.1 L' },
];

export const vulns = [
  { id: 'CVE-2024-3094', title: 'Malicious package in bootstrapping tool', cvss: 10.0, asset: 'Web Server 01', status: 'Open', age: '2 days' },
  { id: 'CVE-2024-21762', title: 'Out-of-bounds write in VPN appliance', cvss: 9.8, asset: 'Edge Firewall', status: 'Open', age: '6 days' },
  { id: 'CVE-2023-48795', title: 'Terrapin SSH protocol downgrade', cvss: 8.1, asset: 'Jump Host 04', status: 'Mitigating', age: '14 days' },
  { id: 'CVE-2023-38545', title: 'Heap buffer overflow in client library', cvss: 8.8, asset: 'Endpoint Fleet', status: 'Open', age: '21 days' },
  { id: 'CVE-2023-44487', title: 'HTTP/2 rapid reset denial of service', cvss: 7.5, asset: 'Internal App', status: 'Accepted', age: '38 days' },
  { id: 'CVE-2023-34362', title: 'SQL injection in managed file transfer', cvss: 9.8, asset: 'ERP Integration', status: 'Resolved', age: '52 days' },
];

export const controls = [
  { name: 'Endpoint Detection & Response', domain: 'Endpoint', coverage: 64, target: 95, owner: 'SOC' },
  { name: 'Multi-Factor Authentication', domain: 'Identity', coverage: 82, target: 100, owner: 'IAM' },
  { name: 'Web Application Firewall', domain: 'Network', coverage: 58, target: 90, owner: 'Platform' },
  { name: 'Backup Immutability', domain: 'Data', coverage: 91, target: 95, owner: 'Infra' },
  { name: 'Vulnerability Scanning', domain: 'Governance', coverage: 88, target: 95, owner: 'Security' },
  { name: 'Privileged Access Review', domain: 'Identity', coverage: 47, target: 90, owner: 'IAM' },
];

export const intel = [
  { title: 'Ransomware group targeting Indian manufacturing', severity: 'Critical', source: 'Threat Feed', time: '2 hours ago', detail: 'Initial access broker activity observed against exposed VPN appliances in your sector.' },
  { title: 'Supply chain compromise in build tooling', severity: 'Critical', source: 'CERT-In', time: '1 day ago', detail: 'Malicious update distributed through a widely used bootstrapping dependency.' },
  { title: 'Credential dump containing your domain', severity: 'High', source: 'Dark Web Monitor', time: '3 days ago', detail: '4,212 credential pairs matched your primary email domain across three dumps.' },
  { title: 'Exploitation of internet-facing WAF bypass', severity: 'High', source: 'Vendor Advisory', time: '4 days ago', detail: 'Bypass chain published for the WAF version deployed on two of your applications.' },
  { title: 'Elevated phishing campaigns in finance teams', severity: 'Medium', source: 'Mail Defense', time: '6 days ago', detail: 'Invoice-themed lures increased 41% month over month across the region.' },
];

export const businessUnits = [
  { name: 'Corporate IT', assets: 412, ale: '₹ 42.6 L', trend: 'up' },
  { name: 'Finance', assets: 128, ale: '₹ 36.1 L', trend: 'up' },
  { name: 'Retail Operations', assets: 286, ale: '₹ 21.4 L', trend: 'down' },
  { name: 'Manufacturing', assets: 197, ale: '₹ 15.8 L', trend: 'up' },
  { name: 'Cloud Platform', assets: 221, ale: '₹ 9.1 L', trend: 'down' },
];

export const scenarios = [
  { id: 'edr', label: 'Deploy EDR across endpoints', cost: 1200000, reduction: 12, coverage: 64 },
  { id: 'mfa', label: 'Enforce MFA for every user', cost: 650000, reduction: 8, coverage: 82 },
  { id: 'waf', label: 'Upgrade Web Application Firewall', cost: 875000, reduction: 6, coverage: 58 },
  { id: 'patch', label: 'Automated patch orchestration', cost: 490000, reduction: 5, coverage: 88 },
  { id: 'seg', label: 'Segment the finance network', cost: 1540000, reduction: 7, coverage: 41 },
];

export const reports = [
  { name: 'Board Risk Summary — Q1', format: 'PDF', size: '2.4 MB', time: 'Generated 2 hours ago', status: 'Ready' },
  { name: 'Financial Exposure Detail', format: 'XLSX', size: '864 KB', time: 'Generated yesterday', status: 'Ready' },
  { name: 'Regulatory Compliance Pack', format: 'PDF', size: '5.1 MB', time: 'Generated 3 days ago', status: 'Ready' },
  { name: 'Remediation Progress Tracker', format: 'CSV', size: '112 KB', time: 'Scheduled · weekly', status: 'Scheduled' },
];

export const auditLog = [
  { actor: 'Yash Galande', action: 'Approved investment recommendation P0-01', target: 'Deploy EDR across all endpoints', time: 'Today · 09:42', ip: '10.14.2.87' },
  { actor: 'System', action: 'Recalculated risk scores', target: '12 assets', time: 'Today · 07:15', ip: 'scheduler' },
  { actor: 'Priya Nair', action: 'Updated control status', target: 'Web Application Firewall', time: 'Yesterday · 18:20', ip: '10.14.6.31' },
  { actor: 'Rahul Desai', action: 'Exported financial exposure report', target: 'XLSX', time: 'Yesterday · 16:05', ip: '10.14.9.12' },
  { actor: 'Yash Galande', action: 'Changed risk appetite threshold', target: 'High Risk ≥ 70', time: '2 days ago · 11:31', ip: '10.14.2.87' },
];

export const statusTone: Record<Status, string> = { Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low', Info: 'info' };

export const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'assets', label: 'Assets', icon: 'assets' },
  { id: 'vulnerabilities', label: 'Vulnerabilities', icon: 'bug' },
  { id: 'intel', label: 'Threat Intelligence', icon: 'globe' },
  { id: 'controls', label: 'Security Controls', icon: 'shieldCheck' },
  { id: 'quant', label: 'Risk Quantification', icon: 'quant' },
  { id: 'exposure', label: 'Financial Exposure', icon: 'rupee' },
  { id: 'optimization', label: 'Optimization', icon: 'optim' },
  { id: 'recommendations', label: 'Recommendations', icon: 'rec' },
  { id: 'whatif', label: 'What-If Scenarios', icon: 'flask' },
  { id: 'reports', label: 'Reports', icon: 'report' },
  { id: 'audit', label: 'Audit Log', icon: 'audit' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
] as const;
