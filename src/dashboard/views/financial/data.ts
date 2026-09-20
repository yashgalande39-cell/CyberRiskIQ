export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Asset {
  id: number;
  name: string;
  unit: string;
  ale: number;
  risk: number;
  level: RiskLevel;
  value: number;
  exposure: number;
  aro: number;
  type: string;
  ip: string;
  owner: string;
}

export const initialAssets: Asset[] = [
  { id: 1, name: 'Payment Gateway', unit: 'Finance', ale: 3, risk: 92, level: 'Critical', value: 25, exposure: 40, aro: 0.3, type: 'Application', ip: '10.0.1.15', owner: 'R. Sharma (CISO)' },
  { id: 2, name: 'Finance Database', unit: 'Finance', ale: 1.2, risk: 88, level: 'Critical', value: 12, exposure: 40, aro: 0.25, type: 'Database', ip: '10.0.1.18', owner: 'A. Mehta (Finance IT)' },
  { id: 3, name: 'Web Server', unit: 'IT', ale: 0.8, risk: 81, level: 'High', value: 8, exposure: 40, aro: 0.25, type: 'Server', ip: '10.0.2.10', owner: 'S. Rao (IT Operations)' },
  { id: 4, name: 'Customer Portal', unit: 'Operations', ale: 0.6, risk: 76, level: 'High', value: 10, exposure: 30, aro: 0.2, type: 'Application', ip: '10.0.2.24', owner: 'P. Singh (Operations)' },
  { id: 5, name: 'Active Directory', unit: 'IT', ale: 0.4, risk: 72, level: 'Medium', value: 8, exposure: 25, aro: 0.2, type: 'Identity service', ip: '10.0.3.5', owner: 'S. Rao (IT Operations)' },
  { id: 6, name: 'HR System', unit: 'HR', ale: 0.3, risk: 68, level: 'Medium', value: 6, exposure: 25, aro: 0.2, type: 'Application', ip: '10.0.4.12', owner: 'N. Kapoor (HR)' },
  { id: 7, name: 'Email Server', unit: 'IT', ale: 0.2, risk: 64, level: 'Medium', value: 5, exposure: 20, aro: 0.2, type: 'Server', ip: '10.0.3.20', owner: 'S. Rao (IT Operations)' },
  { id: 8, name: 'File Server', unit: 'Operations', ale: 0.2, risk: 62, level: 'Low', value: 5, exposure: 20, aro: 0.2, type: 'Server', ip: '10.0.2.32', owner: 'P. Singh (Operations)' },
  { id: 9, name: 'CRM', unit: 'Sales', ale: 0.1, risk: 58, level: 'Low', value: 5, exposure: 20, aro: 0.1, type: 'Application', ip: '10.0.5.8', owner: 'V. Patel (Sales)' },
  { id: 10, name: 'DevOps Pipeline', unit: 'IT', ale: 0.1, risk: 55, level: 'Low', value: 5, exposure: 20, aro: 0.1, type: 'Platform', ip: '10.0.3.42', owner: 'K. Verma (Engineering)' },
];

export const businessUnits = [
  { name: 'Finance', value: 2.1, color: '#ff4564' },
  { name: 'Operations', value: 1.2, color: '#376aff' },
  { name: 'IT', value: 0.8, color: '#00cfb7' },
  { name: 'HR', value: 0.4, color: '#b93ef5' },
  { name: 'Sales', value: 0.3, color: '#19b9fc' },
  { name: 'Others', value: 0.2, color: '#6dbaf5' },
];

export const categories = [
  { name: 'Data Breach', percent: 35, color: '#ff2c51', amount: 1.68 },
  { name: 'Service Downtime', percent: 25, color: '#159eff', amount: 1.2 },
  { name: 'Ransomware', percent: 15, color: '#ffbb3e', amount: 0.72 },
  { name: 'Regulatory Penalty', percent: 10, color: '#b936e9', amount: 0.48 },
  { name: 'IP Theft', percent: 8, color: '#20a9ed', amount: 0.38 },
  { name: 'Others', percent: 7, color: '#a6b8d5', amount: 0.34 },
];

export const assetRisks = [
  { name: 'Unauthorized payment access', category: 'Data Breach', severity: 'Critical', description: 'Privileged payment endpoints need additional access verification.' },
  { name: 'Payment processing outage', category: 'Service Downtime', severity: 'High', description: 'A single-region dependency may interrupt transaction processing.' },
  { name: 'Sensitive data exposure', category: 'Data Breach', severity: 'Critical', description: 'Strengthen encryption and rotation for stored payment credentials.' },
  { name: 'Ransomware disruption', category: 'Ransomware', severity: 'High', description: 'Validate immutable backups and the recovery runbook.' },
  { name: 'PCI DSS non-compliance', category: 'Regulatory Penalty', severity: 'Medium', description: 'Two evidence collection tasks are due for the next audit.' },
  { name: 'Third-party service failure', category: 'Service Downtime', severity: 'Medium', description: 'Review the resilience of upstream payment providers.' },
  { name: 'API credential leakage', category: 'Data Breach', severity: 'High', description: 'Rotate long-lived integration credentials.' },
  { name: 'Transaction tampering', category: 'Data Breach', severity: 'High', description: 'Add integrity checks to payment event messages.' },
  { name: 'Denial-of-service attack', category: 'Service Downtime', severity: 'Medium', description: 'Expand rate limiting coverage on public endpoints.' },
  { name: 'Insider data misuse', category: 'IP Theft', severity: 'Medium', description: 'Review privileged access logs and separation of duties.' },
  { name: 'Unpatched dependencies', category: 'Data Breach', severity: 'High', description: 'Prioritize updates for internet-facing application libraries.' },
  { name: 'Backup recovery failure', category: 'Service Downtime', severity: 'Low', description: 'Schedule the next quarterly disaster recovery exercise.' },
];

export const vulnerabilities = [
  { name: 'Outdated OpenSSL library', id: 'VUL-1042', severity: 'Critical', status: 'Open' },
  { name: 'Missing API rate limiting', id: 'VUL-1038', severity: 'High', status: 'In progress' },
  { name: 'Excessive service permissions', id: 'VUL-1026', severity: 'High', status: 'Open' },
  { name: 'Weak TLS configuration', id: 'VUL-1019', severity: 'High', status: 'In progress' },
  { name: 'Session timeout not enforced', id: 'VUL-1014', severity: 'Medium', status: 'Open' },
  { name: 'Incomplete audit logging', id: 'VUL-1007', severity: 'Medium', status: 'Open' },
  { name: 'Unrestricted CORS policy', id: 'VUL-0996', severity: 'Medium', status: 'In progress' },
  { name: 'Missing security headers', id: 'VUL-0988', severity: 'Low', status: 'Open' },
];

export const securityControls = [
  { name: 'Multi-factor authentication', detail: 'Identity and access management', enabled: true },
  { name: 'Web application firewall', detail: 'Application and API protection', enabled: true },
  { name: 'Encryption at rest', detail: 'AES-256 data protection', enabled: true },
  { name: 'Endpoint detection & response', detail: 'Continuous threat monitoring', enabled: true },
  { name: 'Immutable backups', detail: 'Business continuity and recovery', enabled: false },
  { name: 'Privileged access management', detail: 'Least-privilege access enforcement', enabled: false },
];

export const rupee = '\u20b9';
export const money = (crores: number) => `${rupee} ${Math.round(crores * 10000000).toLocaleString('en-IN')}`;
export const compactMoney = (crores: number) => `${rupee} ${crores.toFixed(1)} Cr`;

export function isAssetArray(value: unknown): value is Asset[] {
  return Array.isArray(value) && value.length > 0 && value.every((asset) =>
    typeof asset === 'object' && asset !== null &&
    typeof asset.id === 'number' && typeof asset.name === 'string' &&
    typeof asset.unit === 'string' && typeof asset.type === 'string' &&
    typeof asset.level === 'string' && typeof asset.owner === 'string' &&
    ['value', 'exposure', 'aro', 'ale', 'risk'].every((key) => typeof asset[key] === 'number' && Number.isFinite(asset[key])),
  );
}

export function downloadFile(name: string, content: string, type = 'text/csv;charset=utf-8;') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function assetsCsv(assets: Asset[]) {
  const rows = assets.map((asset) => [asset.name, asset.unit, asset.value, asset.exposure, asset.aro, asset.ale, asset.risk, asset.level]);
  return ['Asset,Business Unit,Asset Value (Cr),Exposure Factor (%),ARO,ALE (Cr/year),Risk Score,Risk Level', ...rows.map((row) => row.join(','))].join('\n');
}
