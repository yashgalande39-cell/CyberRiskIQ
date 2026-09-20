import { useState, type FormEvent } from 'react';
import { Icon } from '../components/Icons';
import { assetInventory, controlGaps, downloadFile, formatLakh, frameworkMapping, readSaved, today, type SecurityControl } from './data';
import { Badge, ProgressBar } from './UI';

type Props = {
  section: string;
  controls: SecurityControl[];
  plan: string[];
  selectControl: (id: string) => void;
  addToPlan: (id: string) => void;
  removeFromPlan: (id: string) => void;
  exportControls: () => void;
  notify: (text: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
};

export const workspaceTitles: Record<string, string> = {
  dashboard: 'Command Center', assets: 'Asset Inventory', vulnerabilities: 'Related Vulnerabilities', intel: 'Threat Intelligence',
  analysis: 'Risk Analysis', exposure: 'Financial Exposure', optimization: 'Remediation Plan', recommendations: 'Recommendations',
  whatif: 'What-If Scenarios', reports: 'Report Center', compliance: 'Compliance Frameworks', audit: 'Audit Log',
  integrations: 'Workspace Integrations', settings: 'Workspace Settings', profile: 'Yash Galande',
};

export function Workspace({ section, controls, plan, selectControl, addToPlan, removeFromPlan, exportControls, notify, theme, setTheme }: Props) {
  const [query, setQuery] = useState('');
  const [improvement, setImprovement] = useState(12);
  const [savedScenario, setSavedScenario] = useState(false);
  const filteredAssets = assetInventory.filter((item) => `${item.name} ${item.type}`.toLowerCase().includes(query.toLowerCase()));

  if (section === 'assets') return <><div className="sc-search-field workspace-search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search asset inventory" placeholder="Search assets by name or type..." /></div><div className="workspace-scroll"><table className="sc-workspace-table"><thead><tr><th>Asset</th><th>Business Unit</th><th>Mapped Controls</th></tr></thead><tbody>{filteredAssets.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.hostname}</small></td><td>{item.unit}</td><td><button className="sc-text-button" onClick={() => { const match = controls.find((control) => control.assetIds.includes(item.id)); if (match) selectControl(match.id); else notify('This asset does not yet have mapped controls.'); }}>{controls.filter((control) => control.assetIds.includes(item.id)).length} controls <Icon name="arrowRight" /></button></td></tr>)}</tbody></table>{!filteredAssets.length && <p className="sc-empty">No matching assets.</p>}</div></>;

  if (section === 'vulnerabilities' || section === 'intel') {
    const items = section === 'intel' ? [
      ['Credential theft campaign', 'Critical', 'Multi-Factor Authentication', 'mfa'],
      ['Ransomware targeting endpoints', 'High', 'Endpoint Detection & Response', 'edr'],
      ['Lateral movement through exposed networks', 'High', 'Network Segmentation', 'segment'],
    ] : [
      ['CVE-2024-3094', 'Critical', 'Vulnerability Scanning', 'vuln'],
      ['CVE-2024-21626', 'High', 'Endpoint Detection & Response', 'edr'],
      ['Unprotected privileged accounts', 'Critical', 'Privileged Access Management', 'pam'],
      ['Missing authentication factor', 'High', 'Multi-Factor Authentication', 'mfa'],
    ];
    return <><p className="sc-dialog-copy">Security findings and the controls that reduce their impact in this demo workspace.</p><div className="workspace-findings">{items.map(([name, severity, control, id]) => <article key={name}><div><Badge value={severity} /><h3>{name}</h3></div><button className="sc-text-button" onClick={() => selectControl(id)}>{control}<Icon name="arrowRight" /></button></article>)}</div></>;
  }

  if (section === 'analysis' || section === 'recommendations') return <><p className="sc-dialog-copy">Prioritize controls with incomplete coverage and high-impact linked risks.</p><div className="workspace-findings">{controlGaps.map((gap) => <article key={gap.id}><div><Badge value={gap.priority} /><h3>{gap.name}</h3><p>{gap.assets} affected assets / {gap.impact} impact</p></div><div className="workspace-inline-actions"><button className="sc-text-button" onClick={() => selectControl(gap.id)}>Inspect <Icon name="arrowRight" /></button><button className="sc-button" onClick={() => addToPlan(gap.id)}><Icon name={plan.includes(gap.id) ? 'check' : 'plus'} />{plan.includes(gap.id) ? 'In Plan' : 'Add to Plan'}</button></div></article>)}</div></>;

  if (section === 'optimization') {
    const items = controls.filter((item) => plan.includes(item.id));
    return <><p className="sc-dialog-copy">Your locally saved remediation plan. No task is sent to an external service.</p>{items.length ? <><div className="workspace-findings">{items.map((item) => <article key={item.id}><div><h3>{item.name}</h3><p>{item.coverage}% coverage / {item.status}</p></div><div className="workspace-inline-actions"><button className="sc-text-button" onClick={() => selectControl(item.id)}>View Control <Icon name="arrowRight" /></button><button className="sc-icon-button" aria-label={`Remove ${item.name} from plan`} onClick={() => removeFromPlan(item.id)}><Icon name="trash" /></button></div></article>)}</div><button className="sc-button sc-button-primary" onClick={() => downloadFile('CyberRiskIQ-Remediation-Plan.json', JSON.stringify({ created: today(), source: 'Local demo workspace', controls: items.map(({ name, status, coverage, owner, linkedRisks }) => ({ name, status, coverage, owner, linkedRisks })) }, null, 2), 'application/json')}><Icon name="download" />Download Plan</button></> : <div className="sc-empty"><Icon name="report" /><h3>Your remediation plan is empty.</h3><p>Inspect a control, then choose Add to Remediation Plan.</p><button className="sc-button" onClick={() => selectControl('pam')}>Review a Control Gap <Icon name="arrowRight" /></button></div>}</>;
  }

  if (section === 'whatif') return <><p className="sc-dialog-copy">Explore how improved control coverage could reduce estimated residual exposure. This is an illustrative model, not a financial forecast.</p><label className="scenario-slider">Coverage improvement <strong>+{improvement}%</strong><input type="range" min={0} max={22} step={1} value={improvement} onChange={(event) => { setImprovement(Number(event.target.value)); setSavedScenario(false); }} /></label><div className="scenario-results"><div><span>Projected coverage</span><strong>{78 + improvement}%</strong><ProgressBar value={78 + improvement} /></div><div><span>Illustrative residual risk</span><strong>{Math.round(72 * (1 - improvement / 50))} / 100</strong><small>Current baseline: 72 / 100</small></div></div><button className="sc-button sc-button-primary" onClick={() => { const snapshot = { date: today(), improvement, projectedCoverage: 78 + improvement, residualRisk: Math.round(72 * (1 - improvement / 50)) }; try { localStorage.setItem('cyberriskiq-control-scenario', JSON.stringify(snapshot)); setSavedScenario(true); } catch { downloadFile('Control-Scenario.json', JSON.stringify(snapshot, null, 2), 'application/json'); } }}>{savedScenario ? <><Icon name="check" />Scenario Saved Locally</> : <><Icon name="plus" />Save Scenario</>}</button></>;

  if (section === 'exposure') return <><div className="scenario-results"><div><span>Total Implementation Cost</span><strong>&#8377; {(controls.reduce((sum, item) => sum + item.cost, 0) / 100).toFixed(1)} Cr</strong><small>Across {controls.length} controls</small></div><div><span>Annual Operating Cost</span><strong>&#8377; {formatLakh(controls.reduce((sum, item) => sum + item.operatingCost, 0))} L</strong></div></div><table className="sc-workspace-table"><thead><tr><th>Control</th><th>Implementation</th><th>Operating / Year</th></tr></thead><tbody>{controls.slice(0, 8).map((item) => <tr key={item.id}><td><button className="sc-text-button" onClick={() => selectControl(item.id)}>{item.name}</button></td><td>&#8377; {item.cost} L</td><td>&#8377; {item.operatingCost} L</td></tr>)}</tbody></table></>;

  if (section === 'compliance') return <div className="workspace-frameworks">{frameworkMapping.map((framework) => <article key={framework.key}><Icon name="shieldCheck" /><div><h3>{framework.label}</h3><p>{controls.filter((item) => item.frameworks.includes(framework.key)).length} controls mapped</p><ProgressBar value={framework.value} color={framework.color} /></div><strong>{framework.value}%</strong></article>)}</div>;

  if (section === 'audit') return <div className="workspace-scroll"><table className="sc-workspace-table"><thead><tr><th>Date</th><th>Control</th><th>Activity</th><th>Actor</th></tr></thead><tbody>{controls.slice(0, 12).flatMap((control) => control.activities.slice(0, 2).map((item, index) => <tr key={`${control.id}-${index}`}><td>{item.date}</td><td>{control.name}</td><td>{item.action}</td><td>{item.actor}</td></tr>))}</tbody></table></div>;

  if (section === 'reports') return <div className="workspace-reports"><article><Icon name="report" /><div><h3>Security Control Inventory</h3><p>All control fields, coverage, costs, and framework mappings.</p></div><button className="sc-button" onClick={exportControls}><Icon name="download" />CSV</button></article><article><Icon name="shieldCheck" /><div><h3>Framework Coverage Report</h3><p>A snapshot of mapped security frameworks.</p></div><button className="sc-button" onClick={() => downloadFile('Framework-Coverage.json', JSON.stringify({ date: today(), frameworks: frameworkMapping }, null, 2), 'application/json')}><Icon name="download" />JSON</button></article></div>;

  if (section === 'settings' || section === 'profile') return <div className="workspace-settings"><div><span>Name</span><strong>Yash Galande</strong></div><div><span>Role</span><strong>CISO</strong></div><div><span>Organization</span><strong>Acme Technologies Pvt. Ltd.</strong></div><label>Display Theme<select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="dark">Command Center Dark</option><option value="light">Light</option></select></label><p className="sc-dialog-copy">Control edits, evidence, and remediation plans remain in this browser. The dashboard uses local demo data.</p></div>;

  if (section === 'integrations') return <div className="workspace-findings"><article><div><h3>Local Workspace Storage</h3><p>Control records and changes stored in your browser.</p></div><Badge value="Active" /></article><article><div><h3>CSV Data Export</h3><p>Export the inventory for your preferred analytics tools.</p></div><button className="sc-button" onClick={exportControls}><Icon name="download" />Export</button></article><p className="sc-form-note">No third-party services are connected in this preview.</p></div>;

  return <><p className="sc-dialog-copy">Your security control posture at a glance.</p><div className="scenario-results"><div><span>Total Controls</span><strong>{controls.length}</strong></div><div><span>Deployed Controls</span><strong>{controls.filter((item) => item.status === 'Deployed').length}</strong></div><div><span>Controls Requiring Attention</span><strong>{controls.filter((item) => item.status !== 'Deployed').length}</strong></div><div><span>Remediation Plan</span><strong>{plan.length}</strong></div></div><button className="sc-button sc-button-primary" onClick={() => selectControl('mfa')}><Icon name="shieldPlus" />Open Security Controls</button></>;
}

export function EnterpriseInquiry({ onClose }: { onClose: () => void }) {
  const [request, setRequest] = useState<Record<string, string> | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = { name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), organization: String(data.get('organization')).trim(), created: today() };
    try {
      const existing = readSaved<unknown>('cyberriskiq-enterprise-requests', []);
      localStorage.setItem('cyberriskiq-enterprise-requests', JSON.stringify([...(Array.isArray(existing) ? existing : []), next]));
    } catch { /* The request can still be downloaded without browser storage. */ }
    setRequest(next);
  }
  if (request) return <div className="sc-request-ready"><span><Icon name="checkCircle" /></span><h3>Your inquiry is ready.</h3><p>Download your inquiry to share with your team. No email has been sent from this local demo.</p><div className="sc-form-actions"><button className="sc-button" onClick={onClose}>Close</button><button className="sc-button sc-button-primary" onClick={() => downloadFile('CyberRiskIQ-Enterprise-Inquiry.txt', Object.entries(request).map(([key, value]) => `${key}: ${value}`).join('\n'))}><Icon name="download" />Download Inquiry</button></div></div>;
  return <form className="sc-form" onSubmit={submit}><p className="sc-dialog-copy">Unlock advanced analytics, custom integrations, and automated remediation workflows.</p><label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={80} /></label><label>Work Email<input name="email" type="email" autoComplete="email" required maxLength={140} /></label><label>Organization<input name="organization" autoComplete="organization" required maxLength={120} /></label><p className="sc-form-note">This preview prepares and saves your inquiry locally. No purchase or email is initiated.</p><div className="sc-form-actions"><button type="button" className="sc-button" onClick={onClose}>Cancel</button><button type="submit" className="sc-button sc-button-primary">Prepare Inquiry <Icon name="arrowRight" /></button></div></form>;
}