import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowRight, Check, CheckCircle2, ChevronRight, FileText, Filter, Link2, Plus, Search, Settings2, ShieldCheck, Trash2, TrendingDown } from 'lucide-react';
import { assetRisks, assetsCsv, businessUnits, categories, compactMoney, downloadFile, securityControls, vulnerabilities, type Asset } from './data';
import AssetTable, { RiskBadge } from './AssetTable';
import { BusinessChart, CategoryChart, ScatterChart, TrendChart } from './Charts';
import { ScenarioForm, type Report } from './Dialogs';

export interface PlanItem { assetId: number; reduction: number; investment: number }

function loadPreferences() {
  const defaults = { notifications: true, weeklyReport: true, riskThreshold: '80', currency: 'INR - Indian Rupee' };
  try {
    const saved = localStorage.getItem('cyberriskiq-preferences');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

export function AssetExposureView({ assets, onAsset, unitFilter, onUnitFilter, onExport, factor = 1, period = 'Last 12 Months' }: { assets: Asset[]; onAsset: (asset: Asset) => void; unitFilter: string; onUnitFilter: (unit: string) => void; onExport: () => void; factor?: number; period?: string }) {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All risk levels');
  const filtered = assets.filter((asset) => `${asset.name} ${asset.unit} ${asset.type}`.toLowerCase().includes(query.toLowerCase()) && (level === 'All risk levels' || asset.level === level) && (unitFilter === 'All business units' || asset.unit === unitFilter));
  return (
    <div className="workspace-view asset-exposure-view">
      <section className="panel full-table-panel">
        <div className="view-heading">
          <div>
            <h2>Asset Financial Exposure</h2>
            <p>Understand the business impact of risk across your asset portfolio.</p>
          </div>
          <button className="outline-button" onClick={onExport}><ArrowDownToLine size={14} />Export</button>
        </div>
        <div className="table-toolbar">
          <div className="filter-search">
            <Search size={15} />
            <input placeholder="Search assets..." aria-label="Filter assets" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <select value={unitFilter} onChange={(event) => onUnitFilter(event.target.value)} aria-label="Filter business unit">
            <option>All business units</option>
            {['Finance', 'Operations', 'IT', 'HR', 'Sales', 'Others'].map((unit) => <option key={unit}>{unit}</option>)}
          </select>
          <select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter risk level">
            <option>All risk levels</option>
            {['Critical', 'High', 'Medium', 'Low'].map((risk) => <option key={risk}>{risk}</option>)}
          </select>
          {(query || unitFilter !== 'All business units' || level !== 'All risk levels') && (
            <button className="text-button" onClick={() => { setQuery(''); setLevel('All risk levels'); onUnitFilter('All business units'); }}>Clear</button>
          )}
        </div>
        <AssetTable assets={filtered} onSelect={onAsset} expanded />
        <div className="table-footer">
          Showing {filtered.length} of {assets.length} assets
          <span>Click View to explore financial inputs and risks.</span>
        </div>
      </section>
      <section className="panel asset-view-trend">
        <div className="view-heading">
          <div>
            <h2>Portfolio Exposure Trend</h2>
            <p>Monitor how your financial risk changes over time.</p>
          </div>
        </div>
        <TrendChart factor={factor} period={period} />
      </section>
    </div>
  );
}

export function BusinessUnitsView({ assets, onAsset, factor }: { assets: Asset[]; onAsset: (asset: Asset) => void; factor: number }) {
  const [unit, setUnit] = useState('Finance');
  return (
    <div className="workspace-view">
      <section className="panel large-business-panel">
        <div className="view-heading">
          <div>
            <h2>Exposure by Business Unit</h2>
            <p>Compare expected annual losses and prioritize investment.</p>
          </div>
          <span className="subtle-label">Total ALE / year</span>
        </div>
        <BusinessChart factor={factor} onSelect={setUnit} />
        <div className="business-unit-selector">
          {businessUnits.map((item) => (
            <button key={item.name} className={unit === item.name ? 'active' : ''} onClick={() => setUnit(item.name)}>
              <i style={{ background: item.color }} />
              {item.name}
              <strong>{compactMoney(item.value * factor)}</strong>
            </button>
          ))}
        </div>
      </section>
      <section className="panel full-table-panel">
        <div className="view-heading">
          <div>
            <h2>{unit} Assets</h2>
            <p>Financial exposure for assets assigned to {unit.toLowerCase()}.</p>
          </div>
          <span className="subtle-label">{assets.filter((asset) => asset.unit === unit).length} assets</span>
        </div>
        <AssetTable assets={assets.filter((asset) => asset.unit === unit)} onSelect={onAsset} expanded />
      </section>
    </div>
  );
}

export function CategoryAnalysisView({ initialCategory, factor = 1 }: { initialCategory: string; factor?: number }) {
  const [selected, setSelected] = useState(initialCategory || 'Data Breach');
  const [mode, setMode] = useState<'ALE' | 'SLE'>('ALE');
  useEffect(() => { if (initialCategory) setSelected(initialCategory); }, [initialCategory]);
  const category = categories.find((item) => item.name === selected) || categories[0];
  return (
    <div className="workspace-view">
      <section className="panel category-analysis-panel">
        <div className="view-heading">
          <div>
            <h2>Financial Exposure by Risk Category</h2>
            <p>See which types of risk contribute most to business impact.</p>
          </div>
          <div className="segmented-control">
            <button className={mode === 'ALE' ? 'active' : ''} onClick={() => setMode('ALE')}>ALE</button>
            <button className={mode === 'SLE' ? 'active' : ''} onClick={() => setMode('SLE')}>SLE</button>
          </div>
        </div>
        <CategoryChart mode={mode} factor={factor} large onSelect={setSelected} />
      </section>
      <section className="panel category-risk-panel">
        <div className="view-heading">
          <div>
            <h2><i className="inline-dot" style={{ background: category.color }} />{category.name}</h2>
            <p>{category.percent}% of total exposure, representing {compactMoney(category.amount * factor)} in annual expected loss.</p>
          </div>
        </div>
        <div className="category-risk-list">
          {assetRisks.filter((risk) => risk.category === selected).map((risk) => (
            <div key={risk.name}>
              <ShieldCheck size={20} />
              <div>
                <h3>{risk.name}</h3>
                <p>{risk.description}</p>
              </div>
              <RiskBadge level={risk.severity} />
            </div>
          ))}
          {!assetRisks.some((risk) => risk.category === selected) && (
            <div className="empty-state">No active risk findings in this category.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export function ReportsView({ reports, onCreate, onDelete, notify }: { reports: Report[]; onCreate: () => void; onDelete: (id: number) => void; notify: (message: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = reports.filter((report) => report.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="panel reports-view">
      <div className="view-heading">
        <div>
          <h2>Financial Exposure Reports</h2>
          <p>Export and share decision-ready insights with your stakeholders.</p>
        </div>
        <button className="primary-button" onClick={onCreate}><Plus size={15} />Create Report</button>
      </div>
      <div className="table-toolbar">
        <div className="filter-search">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports..." aria-label="Search reports" />
        </div>
        <span className="muted">{filtered.length} reports</span>
      </div>
      <div className="report-list">
        {filtered.map((report) => (
          <div className="report-list-row" key={report.id}>
            <div className="report-file-icon"><FileText size={23} /></div>
            <div>
              <h3>{report.name}</h3>
              <p>{report.date} <span>/</span> {report.assets.length} assets <span>/</span> {report.format}</p>
            </div>
            <button className="outline-button" onClick={() => { downloadFile(`${report.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${report.format.toLowerCase()}`, report.format === 'JSON' ? JSON.stringify(report.assets, null, 2) : assetsCsv(report.assets), report.format === 'JSON' ? 'application/json' : undefined); notify('Report downloaded.'); }}>
              <ArrowDownToLine size={14} />Download
            </button>
            <button className="icon-button" onClick={() => onDelete(report.id)} aria-label={`Delete ${report.name}`}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <FileText size={30} />
            <h3>{query ? 'No reports found' : 'Your reports will appear here'}</h3>
            <p>{query ? 'Try a different search term.' : 'Create a report to capture and share your financial risk analysis.'}</p>
            {!query && <button className="primary-button" onClick={onCreate}>Create Your First Report</button>}
          </div>
        )}
      </div>
    </section>
  );
}

interface ModuleProps {
  section: string;
  assets: Asset[];
  selectedAsset: Asset;
  onAsset: (asset: Asset) => void;
  plan: PlanItem[];
  onRemovePlan: (id: number) => void;
  onScenario: (asset: Asset) => void;
  onSaveScenario: (asset: Asset, reduction: number, investment: number) => void;
  notify: (message: string) => void;
}

export function ModuleView({ section, assets, selectedAsset, onAsset, plan, onRemovePlan, onScenario, onSaveScenario, notify }: ModuleProps) {
  const [riskFilter, setRiskFilter] = useState('All');
  const [controlValues, setControlValues] = useState(securityControls.map((item) => item.enabled));
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [compliance, setCompliance] = useState([true, true, false, true, false, true]);
  const [integrationOpen, setIntegrationOpen] = useState<string | null>(null);
  const [configured, setConfigured] = useState<string[]>([]);
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [savedPreferences] = useState(loadPreferences);
  const [notifications, setNotifications] = useState<boolean>(savedPreferences.notifications);
  const [weeklyReport, setWeeklyReport] = useState<boolean>(savedPreferences.weeklyReport);
  const [riskThreshold, setRiskThreshold] = useState<string>(savedPreferences.riskThreshold);
  const [currency, setCurrency] = useState<string>(savedPreferences.currency);

  if (section === 'What-If Scenarios') {
    return (
      <section className="panel scenario-workspace">
        <div className="view-heading">
          <div>
            <h2>Model a More Resilient Future</h2>
            <p>Compare the cost of a security investment with its financial impact.</p>
          </div>
        </div>
        <label className="form-field scenario-asset-select">
          Select asset
          <select value={selectedAsset.id} onChange={(event) => onAsset(assets.find((asset) => asset.id === Number(event.target.value))!)}>
            {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
          </select>
        </label>
        <ScenarioForm key={selectedAsset.id} asset={selectedAsset} onSave={onSaveScenario} inline />
      </section>
    );
  }

  if (section === 'Optimization') {
    return (
      <section className="panel optimization-view">
        <div className="view-heading">
          <div>
            <h2>Your Optimization Plan</h2>
            <p>Prioritize security investments by their expected financial return.</p>
          </div>
          <button className="outline-button" onClick={() => onScenario(selectedAsset)}><Plus size={15} />Add Scenario</button>
        </div>
        {plan.length === 0 ? (
          <div className="empty-state tall-empty">
            <TrendingDown size={42} />
            <h3>Turn risk insights into action</h3>
            <p>Add an asset from the details panel, or run a what-if scenario to start your optimization plan.</p>
            <button className="primary-button" onClick={() => onScenario(selectedAsset)}>Explore a Scenario<ArrowRight size={15} /></button>
          </div>
        ) : (
          <>
            <div className="plan-summary">
              <TrendingDown size={27} />
              <div>
                <span>Potential annual loss reduction</span>
                <strong>{compactMoney(plan.reduce((sum, item) => sum + (assets.find((asset) => asset.id === item.assetId)?.ale || 0) * item.reduction / 100, 0))}</strong>
              </div>
              <span>{plan.length} planned investments</span>
            </div>
            {plan.map((item) => {
              const asset = assets.find((entry) => entry.id === item.assetId)!;
              return (
                <div className="optimization-item" key={item.assetId}>
                  <ShieldCheck size={23} />
                  <div>
                    <h3>{asset.name}</h3>
                    <p>{item.reduction}% risk reduction / {compactMoney(item.investment)} investment</p>
                  </div>
                  <div>
                    <strong className="text-teal">{compactMoney(asset.ale * item.reduction / 100)}</strong>
                    <small>annual savings</small>
                  </div>
                  <button className="outline-button" onClick={() => onScenario(asset)}>Refine</button>
                  <button className="icon-button" aria-label={`Remove ${asset.name} from plan`} onClick={() => onRemovePlan(asset.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </section>
    );
  }

  if (section === 'Security Controls') {
    return (
      <section className="panel controls-workspace">
        <div className="view-heading">
          <div>
            <h2>Security Control Coverage</h2>
            <p>Manage the safeguards that reduce your financial exposure.</p>
          </div>
          <span className="subtle-label">{controlValues.filter(Boolean).length} of {securityControls.length} implemented</span>
        </div>
        {securityControls.map((control, index) => (
          <div className="workspace-control-row" key={control.name}>
            <ShieldCheck size={24} className={controlValues[index] ? 'text-teal' : 'muted'} />
            <div>
              <h3>{control.name}</h3>
              <p>{control.detail}</p>
            </div>
            <span className={controlValues[index] ? 'text-teal' : 'text-amber'}>{controlValues[index] ? 'Implemented' : 'Not implemented'}</span>
            <button role="switch" aria-label={control.name} aria-checked={controlValues[index]} className={`toggle-switch ${controlValues[index] ? 'enabled' : ''}`} onClick={() => { setControlValues((values) => values.map((value, position) => position === index ? !value : value)); notify(`${control.name} updated.`); }}>
              <span />
            </button>
          </div>
        ))}
      </section>
    );
  }

  if (section === 'Vulnerabilities') {
    return (
      <section className="panel vulnerabilities-workspace">
        <div className="view-heading">
          <div>
            <h2>Vulnerability Prioritization</h2>
            <p>Resolve weaknesses in order of business impact.</p>
          </div>
          <div className="view-filter">
            <Filter size={14} />
            <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} aria-label="Filter vulnerability severity">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((level) => <option key={level}>{level}</option>)}
            </select>
          </div>
        </div>
        {vulnerabilities.filter((item) => riskFilter === 'All' || item.severity === riskFilter).map((item) => (
          <div className="workspace-vulnerability" key={item.id}>
            <span className="vulnerability-id">{item.id}</span>
            <div>
              <h3>{item.name}</h3>
              <p>Payment Gateway / Production</p>
            </div>
            <RiskBadge level={item.severity} />
            <select aria-label={`Status of ${item.name}`} value={statuses[item.id] || item.status} onChange={(event) => { setStatuses((current) => ({ ...current, [item.id]: event.target.value })); notify(`${item.id} status updated.`); }}>
              <option>Open</option>
              <option>In progress</option>
              <option>Resolved</option>
            </select>
          </div>
        ))}
      </section>
    );
  }

  if (section === 'Threat Intelligence' || section === 'Risk Analysis') {
    return (
      <div className="workspace-view">
        {section === 'Risk Analysis' && (
          <section className="panel risk-analysis-chart">
            <div className="view-heading">
              <div>
                <h2>Risk and Business Impact</h2>
                <p>Focus on assets with the highest financial exposure.</p>
              </div>
            </div>
            <ScatterChart assets={assets} onSelect={onAsset} />
          </section>
        )}
        <section className="panel threat-workspace">
          <div className="view-heading">
            <div>
              <h2>{section === 'Threat Intelligence' ? 'Active Threat Intelligence' : 'Prioritized Risk Register'}</h2>
              <p>Current risk signals affecting your business-critical assets.</p>
            </div>
            <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} aria-label="Filter threat severity">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((level) => <option key={level}>{level}</option>)}
            </select>
          </div>
          {assetRisks.filter((risk) => riskFilter === 'All' || risk.severity === riskFilter).map((risk) => (
            <button className="threat-row" key={risk.name} onClick={() => onScenario(selectedAsset)}>
              <div>
                <h3>{risk.name}</h3>
                <p>{risk.description}</p>
                <small>{risk.category}</small>
              </div>
              <RiskBadge level={risk.severity} />
              <ChevronRight size={16} />
            </button>
          ))}
        </section>
      </div>
    );
  }

  if (section === 'Recommendations') {
    return (
      <section className="panel recommendations-workspace">
        <div className="view-heading">
          <div>
            <h2>Recommended Security Investments</h2>
            <p>Targeted actions to reduce your most significant financial risks.</p>
          </div>
        </div>
        {[
          { title: 'Strengthen payment access controls', detail: 'Implement privileged access management and enforce MFA across payment administration.', asset: assets[0], reduction: 35 },
          { title: 'Protect the finance database', detail: 'Improve encryption, rotate service credentials, and restrict network access.', asset: assets[1], reduction: 40 },
          { title: 'Harden internet-facing infrastructure', detail: 'Upgrade your web application firewall and remediate exposed dependencies.', asset: assets[2], reduction: 30 }
        ].map((item, index) => (
          <div className="recommendation-row" key={item.title}>
            <span className="recommendation-number">0{index + 1}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <span className="text-teal">Up to {compactMoney(item.asset.ale * item.reduction / 100)} annual risk reduction</span>
            </div>
            <button className="outline-button" onClick={() => onScenario(item.asset)}>
              Model Impact<ArrowRight size={14} />
            </button>
          </div>
        ))}
      </section>
    );
  }

  if (section === 'Compliance') {
    return (
      <section className="panel compliance-workspace">
        <div className="view-heading">
          <div>
            <h2>Compliance Readiness</h2>
            <p>Track the security evidence that supports your obligations.</p>
          </div>
          <span className="text-teal">{Math.round(compliance.filter(Boolean).length / compliance.length * 100)}% complete</span>
        </div>
        <div className="compliance-progress">
          <span style={{ width: `${compliance.filter(Boolean).length / compliance.length * 100}%` }} />
        </div>
        {['PCI DSS: Payment data encryption', 'ISO 27001: Access control review', 'PCI DSS: Quarterly vulnerability assessment', 'SOC 2: Security monitoring evidence', 'ISO 27001: Disaster recovery exercise', 'SOC 2: Employee security training'].map((name, index) => (
          <label className="compliance-row" key={name}>
            <input type="checkbox" checked={compliance[index]} onChange={(event) => setCompliance((current) => current.map((item, position) => position === index ? event.target.checked : item))} />
            <div>
              <h3>{name}</h3>
              <p>{compliance[index] ? 'Evidence verified and recorded' : 'Evidence collection required'}</p>
            </div>
            <span className={compliance[index] ? 'text-teal' : 'text-amber'}>{compliance[index] ? 'Complete' : 'Pending'}</span>
          </label>
        ))}
      </section>
    );
  }

  if (section === 'Audit Log') {
    return (
      <section className="panel audit-workspace">
        <div className="view-heading">
          <div>
            <h2>Workspace Audit Log</h2>
            <p>A record of security and financial risk activity.</p>
          </div>
          <button className="outline-button" onClick={() => { downloadFile('cyberriskiq-audit-log.csv', 'Time,User,Activity\n09:42,Yash Galande,Financial exposure assessment completed\n09:30,System,Asset inventory synchronized\n09:15,R. Sharma,Payment Gateway risk reviewed\n08:55,System,Threat intelligence updated\n08:30,Yash Galande,Monthly report generated'); notify('Audit log downloaded.'); }}>
            <ArrowDownToLine size={14} />Export Log
          </button>
        </div>
        {[
          { time: '09:42 AM', name: 'Yash Galande', action: 'Financial exposure assessment completed', detail: '10 assets assessed across 5 business units' },
          { time: '09:30 AM', name: 'System', action: 'Asset inventory synchronized', detail: 'All data sources are up to date' },
          { time: '09:15 AM', name: 'R. Sharma', action: 'Payment Gateway risk reviewed', detail: 'Critical risk classification confirmed' },
          { time: '08:55 AM', name: 'System', action: 'Threat intelligence updated', detail: '12 active risk signals evaluated' },
          { time: '08:30 AM', name: 'Yash Galande', action: 'Monthly report generated', detail: 'Financial Exposure Report / CSV' }
        ].map((item) => (
          <div className="audit-row" key={item.time}>
            <CheckCircle2 size={17} />
            <time>{item.time}<small>Today</small></time>
            <div>
              <h3>{item.action}</h3>
              <p>{item.detail}</p>
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </section>
    );
  }

  if (section === 'Integrations') {
    return (
      <section className="panel integrations-workspace">
        <div className="view-heading">
          <div>
            <h2>Security Data Integrations</h2>
            <p>Configure the data sources for your risk intelligence workspace.</p>
          </div>
        </div>
        {[
          { name: 'AWS Security Hub', detail: 'Cloud security findings and asset inventory' },
          { name: 'Microsoft Defender', detail: 'Endpoint protection and threat intelligence' },
          { name: 'CrowdStrike Falcon', detail: 'Endpoint detection and response findings' },
          { name: 'ServiceNow', detail: 'Asset inventory and remediation workflows' }
        ].map((integration) => (
          <div className="integration-item" key={integration.name}>
            <div className="integration-row">
              <div className="integration-icon"><Link2 size={23} /></div>
              <div>
                <h3>{integration.name}</h3>
                <p>{integration.detail}</p>
              </div>
              <span className={configured.includes(integration.name) ? 'text-teal' : 'muted'}>{configured.includes(integration.name) ? 'Configured' : 'Not configured'}</span>
              <button className="outline-button" onClick={() => { setIntegrationOpen(integrationOpen === integration.name ? null : integration.name); setEndpoint(''); setApiKey(''); }}>
                <Settings2 size={14} />Configure
              </button>
            </div>
            {integrationOpen === integration.name && (
              <form className="integration-form" onSubmit={(event) => { event.preventDefault(); setConfigured((current) => [...new Set([...current, integration.name])]); setIntegrationOpen(null); setApiKey(''); notify(`${integration.name} configuration saved for this session.`); }}>
                <label className="form-field">Service endpoint<input type="url" required placeholder="https://your-instance.example.com" value={endpoint} onChange={(event) => setEndpoint(event.target.value)} /></label>
                <label className="form-field">API token<input type="password" required minLength={8} placeholder="Enter your API token" value={apiKey} onChange={(event) => setApiKey(event.target.value)} /></label>
                <p className="form-note">Configuration is kept in this session only. A server connection is required to enable live data ingestion.</p>
                <button className="primary-button" type="submit">Save Configuration</button>
              </form>
            )}
          </div>
        ))}
      </section>
    );
  }

  if (section === 'Settings') {
    return (
      <section className="panel settings-workspace">
        <div className="view-heading">
          <div>
            <h2>Workspace Preferences</h2>
            <p>Personalize financial reporting and risk notifications.</p>
          </div>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); localStorage.setItem('cyberriskiq-preferences', JSON.stringify({ currency, riskThreshold, notifications, weeklyReport })); notify('Workspace preferences saved.'); }}>
          <div className="settings-section">
            <h3>Financial Reporting</h3>
            <label className="form-field">Display currency<select value={currency} onChange={(event) => setCurrency(event.target.value)}><option>INR - Indian Rupee</option></select><small>Your organization reports financial exposure in Indian rupees.</small></label>
            <label className="form-field">Critical risk alert threshold<input type="number" min="1" max="100" required value={riskThreshold} onChange={(event) => setRiskThreshold(event.target.value)} /><small>Receive an alert when an asset risk score reaches this threshold.</small></label>
          </div>
          <div className="settings-section">
            <h3>Notifications</h3>
            <label className="settings-checkbox"><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} /><span>Critical risk notifications<small>Stay informed about changes to high-impact assets.</small></span></label>
            <label className="settings-checkbox"><input type="checkbox" checked={weeklyReport} onChange={(event) => setWeeklyReport(event.target.checked)} /><span>Weekly exposure summary<small>Include your workspace in the weekly reporting schedule.</small></span></label>
          </div>
          <button className="primary-button" type="submit"><Check size={16} />Save Preferences</button>
        </form>
      </section>
    );
  }

  return null;
}
