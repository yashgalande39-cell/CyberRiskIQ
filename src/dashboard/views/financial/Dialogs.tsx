import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, Check, CheckCircle2, FileText, Mail, ShieldCheck, TrendingDown, X } from 'lucide-react';
import { assetsCsv, compactMoney, downloadFile, money, rupee, type Asset } from './data';
import { RiskBadge } from './AssetTable';

export interface DialogState {
  kind: 'edit' | 'scenario' | 'asset' | 'report' | 'enterprise' | 'metric' | 'profile';
  asset?: Asset;
  title?: string;
  description?: string;
}

export interface Report {
  id: number;
  name: string;
  date: string;
  format: string;
  assets: Asset[];
}

interface DialogProps {
  dialog: DialogState;
  assets: Asset[];
  onClose: () => void;
  onSaveAsset: (asset: Asset) => void;
  onSaveReport: (report: Report) => void;
  onSaveScenario: (asset: Asset, reduction: number, investment: number) => void;
  notify: (message: string) => void;
}

export function ScenarioForm({ asset, onSave, inline = false }: { asset: Asset; onSave: (asset: Asset, reduction: number, investment: number) => void; inline?: boolean }) {
  const [reduction, setReduction] = useState(35);
  const [investment, setInvestment] = useState(0.35);
  const [control, setControl] = useState('Enhanced access controls');
  const [saved, setSaved] = useState(false);
  const revised = asset.ale * (1 - reduction / 100);
  const savings = asset.ale - revised;
  return (
    <form className={`scenario-form ${inline ? 'inline-scenario' : ''}`} onSubmit={(event) => { event.preventDefault(); onSave(asset, reduction, investment); setSaved(true); }}>
      <div className="scenario-asset"><ShieldCheck size={22} /><div><strong>{asset.name}</strong><span>{asset.unit} / Production</span></div><RiskBadge level={asset.level} /></div>
      <label className="form-field">Proposed security investment
        <select value={control} onChange={(event) => { setControl(event.target.value); setSaved(false); }}>
          <option>Enhanced access controls</option>
          <option>Web application firewall upgrade</option>
          <option>Immutable backup and recovery</option>
          <option>Endpoint detection and response</option>
          <option>Security awareness program</option>
        </select>
      </label>
      <label className="form-field range-form-label">
        <span>Estimated risk reduction<strong>{reduction}%</strong></span>
        <input type="range" min="5" max="90" step="5" value={reduction} onChange={(event) => { setReduction(Number(event.target.value)); setSaved(false); }} />
        <span className="range-extents"><small>5% conservative</small><small>90% optimistic</small></span>
      </label>
      <label className="form-field">Annual investment ({rupee} Cr)
        <input type="number" min="0.01" max="100" step="0.01" required value={investment} onChange={(event) => { setInvestment(Number(event.target.value)); setSaved(false); }} />
      </label>
      <div className="scenario-comparison">
        <div><span>Current annual loss</span><strong>{compactMoney(asset.ale)}</strong></div>
        <ArrowRight size={20} />
        <div><span>Projected annual loss</span><strong className="text-teal">{compactMoney(revised)}</strong></div>
      </div>
      <div className="scenario-result">
        <TrendingDown size={22} />
        <p>
          <strong>{compactMoney(savings)} potential annual savings</strong>
          <span>{investment > 0 ? `${Math.round((savings - investment) / investment * 100)}% estimated return on security investment` : 'Set an investment to calculate return'}</span>
        </p>
      </div>
      <p className="form-note">Estimates are based on current financial inputs and the assumed control effectiveness. Actual outcomes may vary.</p>
      <button type="submit" className="primary-button modal-submit">{saved ? <Check size={16} /> : <ShieldCheck size={16} />}{saved ? 'Scenario Saved to Plan' : 'Save Scenario to Optimization Plan'}</button>
    </form>
  );
}

function FinancialForm({ asset, onSave }: { asset: Asset; onSave: (asset: Asset) => void }) {
  const [value, setValue] = useState(asset.value);
  const [exposure, setExposure] = useState(asset.exposure);
  const [aro, setAro] = useState(asset.aro);
  const sle = value * exposure / 100;
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSave({ ...asset, value, exposure, aro, ale: Number((sle * aro).toFixed(3)) }); }} className="dialog-form">
      <p className="dialog-intro">Update the assumptions for <strong>{asset.name}</strong>. Financial exposure will be recalculated automatically.</p>
      <label className="form-field">Asset value ({rupee} Cr)<input autoFocus type="number" min="0.01" max="100000" step="0.01" value={value} onChange={(event) => setValue(Number(event.target.value))} required /><small>Total business value of the asset.</small></label>
      <div className="form-columns">
        <label className="form-field">Exposure factor (%)<input type="number" min="0" max="100" step="1" value={exposure} onChange={(event) => setExposure(Number(event.target.value))} required /></label>
        <label className="form-field">Annual rate of occurrence<input type="number" min="0" max="100" step="0.01" value={aro} onChange={(event) => setAro(Number(event.target.value))} required /></label>
      </div>
      <div className="calculated-values">
        <div><span>Single Loss Expectancy</span><strong>{money(sle)}</strong></div>
        <div><span>Annualized Loss Expectancy</span><strong className="text-teal">{compactMoney(sle * aro)} / year</strong></div>
      </div>
      <button type="submit" className="primary-button modal-submit"><Check size={16} />Save Financial Inputs</button>
    </form>
  );
}

function ReportForm({ asset, assets, onSave }: { asset?: Asset; assets: Asset[]; onSave: (report: Report) => void }) {
  const [name, setName] = useState(asset ? `${asset.name} - Financial Exposure` : 'Financial Exposure Report');
  const [format, setFormat] = useState('CSV');
  const [scope, setScope] = useState(asset ? 'Selected asset' : 'All assets');
  const [includeInputs, setIncludeInputs] = useState(true);
  const [includeRisk, setIncludeRisk] = useState(true);
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const selectedAssets = scope === 'Selected asset' && asset ? [asset] : assets;
    const safeName = name.trim().replace(/[^a-z0-9 -]/gi, '').replace(/\s+/g, '-').toLowerCase();
    if (format === 'JSON') {
      const payload = { report: name, generatedAt: new Date().toISOString(), currency: 'INR', units: 'crores', assets: selectedAssets.map((item) => ({ name: item.name, businessUnit: item.unit, annualizedLossExpectancy: item.ale, ...(includeInputs ? { assetValue: item.value, exposureFactor: item.exposure / 100, annualRateOfOccurrence: item.aro } : {}), ...(includeRisk ? { riskScore: item.risk, riskLevel: item.level } : {}) })) };
      downloadFile(`${safeName}.json`, JSON.stringify(payload, null, 2), 'application/json');
    } else {
      const header = ['Asset', 'Business Unit', 'ALE (Cr/year)', ...(includeInputs ? ['Asset Value (Cr)', 'Exposure Factor (%)', 'ARO'] : []), ...(includeRisk ? ['Risk Score', 'Risk Level'] : [])];
      const rows = selectedAssets.map((item) => [item.name, item.unit, item.ale, ...(includeInputs ? [item.value, item.exposure, item.aro] : []), ...(includeRisk ? [item.risk, item.level] : [])].join(','));
      downloadFile(`${safeName}.csv`, [header.join(','), ...rows].join('\n'));
    }
    onSave({ id: Date.now(), name, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), format, assets: selectedAssets });
  }
  return (
    <form onSubmit={submit} className="dialog-form">
      <p className="dialog-intro">Export a decision-ready financial exposure report using the latest asset data.</p>
      <label className="form-field">Report name<input autoFocus required value={name} onChange={(event) => setName(event.target.value)} maxLength={100} /></label>
      <div className="form-columns">
        <label className="form-field">Export format<select value={format} onChange={(event) => setFormat(event.target.value)}><option>CSV</option><option>JSON</option></select></label>
        <label className="form-field">Report scope<select value={scope} onChange={(event) => setScope(event.target.value)}><option>All assets</option>{asset && <option>Selected asset</option>}</select></label>
      </div>
      <div className="report-options">
        <span>Include in report</span>
        <label><input type="checkbox" checked={includeInputs} onChange={(event) => setIncludeInputs(event.target.checked)} />Financial inputs and assumptions</label>
        <label><input type="checkbox" checked={includeRisk} onChange={(event) => setIncludeRisk(event.target.checked)} />Risk scores and classifications</label>
      </div>
      <div className="export-summary">
        <FileText size={21} />
        <p><strong>{scope === 'Selected asset' ? 1 : assets.length} assets included</strong><span>{format === 'CSV' ? 'Compatible with Excel, Google Sheets, and BI tools.' : 'Structured data for your analytics and integrations.'}</span></p>
      </div>
      <button className="primary-button modal-submit" type="submit"><ArrowDownToLine size={16} />Generate & Download Report</button>
    </form>
  );
}

function EnterpriseForm() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  return sent ? (
    <div className="enterprise-success"><CheckCircle2 size={45} /><h3>Your request is ready</h3><p>We've saved your interest for <strong>{email}</strong>. Your workspace administrator can now review the enterprise upgrade request.</p></div>
  ) : (
    <form className="dialog-form" onSubmit={(event) => { event.preventDefault(); localStorage.setItem('cyberriskiq-enterprise-request', JSON.stringify({ email, date: new Date().toISOString() })); setSent(true); }}>
      <p className="dialog-intro">Bring financial clarity to your entire security program.</p>
      <ul className="enterprise-benefits">
        <li><Check size={16} />Advanced Monte Carlo risk modeling</li>
        <li><Check size={16} />Unlimited assets and business units</li>
        <li><Check size={16} />Custom integrations and automated reports</li>
        <li><Check size={16} />Dedicated onboarding and support</li>
      </ul>
      <label className="form-field">Work email<input type="email" placeholder="you@company.com" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      <button type="submit" className="primary-button modal-submit"><Mail size={16} />Request Enterprise Access</button>
    </form>
  );
}

export default function Dialogs({ dialog, assets, onClose, onSaveAsset, onSaveReport, onSaveScenario, notify }: DialogProps) {
  const container = useRef<HTMLDivElement>(null);
  const titles = { edit: 'Edit Financial Inputs', scenario: 'What-If Scenario Analysis', asset: 'Asset Details', report: 'Export Financial Exposure', enterprise: 'Upgrade to Enterprise', metric: dialog.title || 'Financial Metric', profile: 'Your Profile' };

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const element = container.current;
    const focusable = () => element?.querySelectorAll<HTMLElement>('button, input, select, textarea, [tabindex="0"]');
    focusable()?.[0]?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const nodes = focusable();
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={container}>
        <div className="modal-heading">
          <div><span className="dialog-eyebrow">CYBERRISKIQ</span><h2 id="dialog-title">{titles[dialog.kind]}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        <div className="modal-content">
          {dialog.kind === 'edit' && dialog.asset && <FinancialForm asset={dialog.asset} onSave={onSaveAsset} />}
          {dialog.kind === 'scenario' && dialog.asset && <ScenarioForm asset={dialog.asset} onSave={onSaveScenario} />}
          {dialog.kind === 'report' && <ReportForm asset={dialog.asset} assets={assets} onSave={onSaveReport} />}
          {dialog.kind === 'enterprise' && <EnterpriseForm />}
          {dialog.kind === 'metric' && (
            <div className="metric-explainer">
              <p>{dialog.description}</p>
              <div className="formula-block">ALE = Asset Value &times; Exposure Factor &times; Annual Rate of Occurrence</div>
              <p className="form-note">Values are aggregated across your production assets for the selected reporting period. Select an asset to review its underlying financial assumptions.</p>
              <button className="primary-button modal-submit" onClick={onClose}>Back to Dashboard<ArrowRight size={16} /></button>
            </div>
          )}
          {dialog.kind === 'asset' && dialog.asset && (
            <div className="asset-full-details">
              <div className="asset-full-name"><ShieldCheck size={29} /><div><h3>{dialog.asset.name}</h3><p>ASSET-{String(dialog.asset.id).padStart(4, '0')} / {dialog.asset.ip}</p></div><RiskBadge level={dialog.asset.level} /></div>
              <dl>{[['Business unit', dialog.asset.unit], ['Asset type', dialog.asset.type], ['Environment', 'Production'], ['Owner', dialog.asset.owner], ['Risk score', `${dialog.asset.risk} / 100`], ['Asset value', money(dialog.asset.value)], ['Annual expected loss', `${compactMoney(dialog.asset.ale)} / year`], ['Last assessment', 'Today, 09:42 AM'], ['Dependencies', '5 upstream / 3 downstream']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              <button className="primary-button modal-submit" onClick={() => { downloadFile(`${dialog.asset!.name.toLowerCase().replace(/ /g, '-')}-details.csv`, assetsCsv([dialog.asset!])); notify('Asset details downloaded.'); }}><ArrowDownToLine size={16} />Download Asset Details</button>
            </div>
          )}
          {dialog.kind === 'profile' && (
            <div className="profile-details">
              <div className="profile-large-avatar">YG</div>
              <h3>Yash Galande</h3>
              <p>Chief Information Security Officer</p>
              <dl>
                <div><dt>Workspace</dt><dd>CyberRiskIQ Enterprise</dd></div>
                <div><dt>Role</dt><dd>Administrator</dd></div>
                <div><dt>Access</dt><dd>All business units</dd></div>
                <div><dt>Security</dt><dd className="text-teal">Multi-factor authentication enabled</dd></div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
