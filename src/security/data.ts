export type ControlStatus = 'Deployed' | 'Partial' | 'Gap';
export type Effectiveness = 'High' | 'Medium' | 'Low';
export type DetailTab = 'overview' | 'assets' | 'mappings' | 'evidence';

export type ControlActivity = { date: string; action: string; actor: string; color: string };
export type Evidence = { id: string; name: string; date: string; size: string; dataUrl?: string };
export type SecurityControl = {
  id: string;
  name: string;
  category: string;
  description: string;
  frameworks: string[];
  assets: number | 'All';
  totalAssets: number;
  assetIds: string[];
  coverage: number;
  effectiveness: Effectiveness;
  cost: number;
  operatingCost: number;
  status: ControlStatus;
  updated: string;
  icon: string;
  owner: string;
  mappings: { name: string; reference: string }[];
  linkedRisks: string[];
  activities: ControlActivity[];
  evidence: Evidence[];
};

export const navigation = [
  { title: 'COMMAND CENTER', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'home' }] },
  { title: 'UNDERSTAND', items: [
    { id: 'assets', label: 'Assets', icon: 'server' },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: 'shield', badge: '1.2K' },
    { id: 'intel', label: 'Threat Intelligence', icon: 'gear' },
    { id: 'controls', label: 'Security Controls', icon: 'shieldPlus' },
  ] },
  { title: 'QUANTIFY', items: [
    { id: 'analysis', label: 'Risk Analysis', icon: 'optim' },
    { id: 'exposure', label: 'Financial Exposure', icon: 'report' },
  ] },
  { title: 'DECIDE', items: [
    { id: 'optimization', label: 'Optimization', icon: 'chartBox' },
    { id: 'recommendations', label: 'Recommendations', icon: 'users' },
    { id: 'whatif', label: 'What-If Scenarios', icon: 'user' },
  ] },
  { title: 'GOVERN', items: [
    { id: 'reports', label: 'Reports', icon: 'report' },
    { id: 'compliance', label: 'Compliance', icon: 'layers' },
    { id: 'audit', label: 'Audit Log', icon: 'clipboard' },
  ] },
  { title: 'SYSTEM', items: [
    { id: 'integrations', label: 'Integrations', icon: 'network' },
    { id: 'settings', label: 'Settings', icon: 'gear' },
  ] },
];

export const categories = ['Identity & Access', 'Endpoint Security', 'Vulnerability Mgmt', 'Network Security', 'Business Continuity', 'Data Protection', 'People & Process'];
export const frameworkOptions = ['NIST', 'ISO', 'CIS', 'PCI', 'SOC'];

const assetNames = ['Payment Gateway', 'Finance Database', 'Web Server 01', 'Employee Portal', 'Cloud Infrastructure', 'Customer API', 'Identity Service', 'Backup Server', 'Sales CRM', 'Operations Console', 'Analytics Platform', 'Corporate Directory'];
export const assetInventory = Array.from({ length: 160 }, (_, index) => {
  const gapNames = ['Remote Admin Portal', 'Legacy VPN Gateway', 'Finance Jump Host', 'Vendor Access Portal'];
  const name = index >= 48 && index < 52 ? gapNames[index - 48] : index < assetNames.length ? assetNames[index] : `${['Application Server', 'Database Cluster', 'Endpoint Group', 'Cloud Workload'][index % 4]} ${String(index + 1).padStart(2, '0')}`;
  return { id: `asset-${index + 1}`, name, hostname: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.acme.com`, type: ['Web Server', 'Database', 'Endpoint', 'Cloud'][index % 4], unit: ['Finance', 'IT', 'Operations', 'Corporate'][index % 4] };
});

export const defaultActivities: ControlActivity[] = [
  { date: 'Jun 15, 2024', action: 'Policy updated', actor: 'Y. Galande', color: '#31c5b3' },
  { date: 'Jun 12, 2024', action: '3 assets mapped', actor: 'P. Mehta', color: '#ffd14d' },
  { date: 'Jun 10, 2024', action: 'Compliance check passed', actor: 'System', color: '#00dfb0' },
  { date: 'Jun 02, 2024', action: 'New exception request', actor: 'A. Verma', color: '#ffab52' },
];

type Seed = [string, string, string, string[], number | 'All', number, Effectiveness, number, ControlStatus, string, string];
const seeds: Seed[] = [
  ['mfa', 'Multi-Factor Authentication', 'Identity & Access', ['NIST', 'ISO', 'CIS'], 48, 92, 'High', 12.5, 'Deployed', 'Jun 15, 2024', 'lock'],
  ['edr', 'Endpoint Detection & Response', 'Endpoint Security', ['NIST', 'CIS'], 76, 85, 'High', 28, 'Deployed', 'Jun 14, 2024', 'shieldGear'],
  ['vuln', 'Vulnerability Scanning', 'Vulnerability Mgmt', ['ISO', 'NIST'], 120, 78, 'Medium', 8.4, 'Deployed', 'Jun 14, 2024', 'shieldCheck'],
  ['segment', 'Network Segmentation', 'Network Security', ['ISO', 'CIS'], 32, 65, 'Medium', 18, 'Partial', 'Jun 12, 2024', 'shieldGear'],
  ['backup', 'Backup & Recovery', 'Business Continuity', ['ISO', 'NIST'], 68, 88, 'High', 22, 'Deployed', 'Jun 13, 2024', 'archive'],
  ['encryption', 'Encryption at Rest', 'Data Protection', ['PCI', 'ISO'], 54, 72, 'Medium', 16, 'Partial', 'Jun 11, 2024', 'shieldGear'],
  ['pam', 'Privileged Access Management', 'Identity & Access', ['NIST', 'CIS'], 28, 60, 'Low', 14, 'Gap', 'Jun 10, 2024', 'fingerprint'],
  ['awareness', 'Security Awareness Training', 'People & Process', ['ISO', 'NIST'], 'All', 95, 'High', 6, 'Deployed', 'Jun 09, 2024', 'userBadge'],
];

function mappingsFor(frameworks: string[]) {
  const references: Record<string, { name: string; reference: string }> = {
    NIST: { name: 'NIST CSF', reference: 'PR.AC-7' },
    ISO: { name: 'ISO 27001', reference: 'A.9.4.2' },
    CIS: { name: 'CIS Controls', reference: '6' },
    PCI: { name: 'PCI DSS', reference: '8.4.2' },
    SOC: { name: 'SOC 2', reference: 'CC6.1' },
  };
  return frameworks.map((key) => references[key]);
}

function controlFromSeed(seed: Seed): SecurityControl {
  const [id, name, category, frameworks, assets, coverage, effectiveness, cost, status, updated, icon] = seed;
  const count = assets === 'All' ? 152 : assets;
  const totalAssets = id === 'mfa' ? 52 : Math.min(160, Math.round(count / (coverage / 100)));
  return {
    id, name, category, frameworks, assets, coverage, effectiveness, cost, status, updated, icon, totalAssets,
    description: id === 'mfa' ? 'Requires users to verify their identity using two or more authentication factors (e.g., password + OTP).' : `${name} provides continuous protection across ${category.toLowerCase()} assets. Monitor its coverage, assess effectiveness, and track framework requirements in one place.`,
    assetIds: assetInventory.slice(0, count).map((item) => item.id),
    operatingCost: id === 'mfa' ? 2.2 : Math.round(cost * 1.8) / 10,
    owner: 'R. Sharma (CISO)',
    mappings: mappingsFor(frameworks),
    linkedRisks: id === 'mfa' ? ['Unauthorized Access', 'Data Breach', 'Privilege Escalation'] : ['Data Breach', 'Service Disruption', 'Regulatory Exposure'],
    activities: defaultActivities.map((item) => ({ ...item })),
    evidence: [
      { id: `${id}-policy`, name: `${name} Policy v3.2`, date: 'Jun 15, 2024', size: 'Policy document' },
      { id: `${id}-check`, name: 'Latest Compliance Check', date: 'Jun 10, 2024', size: 'Assessment record' },
      { id: `${id}-coverage`, name: 'Asset Coverage Report', date: 'Jun 12, 2024', size: 'Coverage snapshot' },
    ],
  };
}

const controlFamilies = [
  ['Access Reviews', 'Identity & Access', 'userBadge'], ['Session Timeout', 'Identity & Access', 'clock'],
  ['Password Policy', 'Identity & Access', 'lock'], ['Account Lockout', 'Identity & Access', 'shieldPlus'],
  ['Application Allowlisting', 'Endpoint Security', 'shieldGear'], ['Device Hardening', 'Endpoint Security', 'server'],
  ['Automated Patch Management', 'Vulnerability Mgmt', 'rotate'], ['Attack Surface Monitoring', 'Vulnerability Mgmt', 'radar'],
  ['Firewall Policy', 'Network Security', 'shield'], ['Network Traffic Analysis', 'Network Security', 'network'],
  ['Disaster Recovery Testing', 'Business Continuity', 'archive'], ['Backup Integrity', 'Business Continuity', 'database'],
  ['Data Loss Prevention', 'Data Protection', 'shieldPlus'], ['Key Rotation', 'Data Protection', 'lock'],
  ['Phishing Simulation', 'People & Process', 'mail'], ['Incident Response Training', 'People & Process', 'users'],
  ['Log Monitoring', 'Network Security', 'chartBox'], ['Secure Configuration', 'Endpoint Security', 'gear'],
  ['Privileged Session Recording', 'Identity & Access', 'fingerprint'], ['Retention Policy', 'Data Protection', 'archive'],
];

function makeControls() {
  const list = seeds.map(controlFromSeed);
  const scopes = ['Corporate', 'Production', 'Cloud', 'Finance', 'Remote Workforce', 'Development', 'Shared Services'];
  for (let index = 0; index < 134; index += 1) {
    const family = controlFamilies[index % controlFamilies.length];
    const scope = scopes[Math.floor(index / controlFamilies.length)];
    const status: ControlStatus = index < 92 ? 'Deployed' : index < 120 ? 'Partial' : 'Gap';
    const coverage = status === 'Deployed' ? 80 + index % 17 : status === 'Partial' ? 56 + index % 20 : 28 + index % 27;
    const effectiveness: Effectiveness = coverage >= 80 ? 'High' : coverage >= 55 ? 'Medium' : 'Low';
    list.push(controlFromSeed([
      `control-${index + 9}`, `${family[0]} - ${scope}`, family[1], index % 3 === 0 ? ['NIST', 'ISO'] : index % 3 === 1 ? ['ISO', 'CIS'] : ['PCI', 'SOC'],
      20 + index % 104, coverage, effectiveness, 0.6 + (index % 14) * 0.2, status,
      `Jun ${String(1 + index % 15).padStart(2, '0')}, 2024`, family[2],
    ]));
  }
  // Keep the demo aggregate aligned with the supplied 78% reference snapshot.
  let remaining = 142 * 78 - list.reduce((sum, item) => sum + item.coverage, 0);
  let pass = 0;
  while (remaining > 0 && pass < 20) {
    for (let index = 8; index < list.length && remaining > 0; index += 1) {
      if (list[index].coverage < 98) { list[index].coverage += 1; remaining -= 1; }
    }
    pass += 1;
  }
  const remainingCost = 380 - list.slice(0, 8).reduce((sum, item) => sum + item.cost, 0);
  const generatedCost = list.slice(8).reduce((sum, item) => sum + item.cost, 0);
  list.slice(8).forEach((item) => {
    item.cost = Math.round(item.cost * remainingCost / generatedCost * 10) / 10;
    item.assets = Math.round(item.totalAssets * item.coverage / 100);
    item.assetIds = assetInventory.slice(0, item.assets).map((asset) => asset.id);
  });
  return list;
}

export const initialControls = makeControls();

export const effectivenessDistribution = [
  { label: 'Highly Effective', value: 38, color: '#00d3ad', filter: 'High' },
  { label: 'Effective', value: 32, color: '#008eff', filter: 'High' },
  { label: 'Partially Effective', value: 18, color: '#ffce48', filter: 'Medium' },
  { label: 'Not Effective', value: 8, color: '#ff754e', filter: 'Low' },
  { label: 'Not Implemented', value: 4, color: '#fa3c64', filter: 'Gap' },
];

export const frameworkMapping = [
  { label: 'ISO 27001', value: 82, color: '#2898f5', key: 'ISO' },
  { label: 'NIST CSF', value: 76, color: '#a068f6', key: 'NIST' },
  { label: 'CIS Controls', value: 69, color: '#41cdbb', key: 'CIS' },
  { label: 'PCI DSS', value: 58, color: '#ffa83d', key: 'PCI' },
  { label: 'SOC 2', value: 71, color: '#ee91ca', key: 'SOC' },
];

export const categoryCoverage = [
  { label: 'Identity & Access', value: 88, color: '#3197f8' },
  { label: 'Endpoint Security', value: 76, color: '#38a4fa' },
  { label: 'Network Security', value: 62, color: '#ffd355' },
  { label: 'Data Protection', value: 70, color: '#ffaa51' },
  { label: 'Vulnerability Mgmt', value: 78, color: '#a68bfc' },
  { label: 'Business Continuity', value: 85, color: '#63acf6' },
  { label: 'People & Process', value: 90, color: '#9390f9' },
];

export const controlGaps = [
  { id: 'pam', name: 'Privileged Access Management', impact: 'High', assets: '28', priority: 'Critical' },
  { id: 'segment', name: 'Network Segmentation', impact: 'High', assets: '18', priority: 'High' },
  { id: 'control-25', name: 'Log Monitoring', impact: 'Medium', assets: '34', priority: 'High' },
  { id: 'control-21', name: 'Data Loss Prevention', impact: 'Medium', assets: '22', priority: 'Medium' },
  { id: 'awareness', name: 'Security Awareness Training', impact: 'Medium', assets: 'All', priority: 'Medium' },
];

export function today() { return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }); }
export function formatLakh(value: number) { return Number(value.toFixed(1)).toLocaleString('en-IN'); }
export function readSaved<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}

export function downloadFile(name: string, contents: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}