import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, Check, ChevronDown, FileChartColumnIncreasing, FileText, Info, Pencil, ScanSearch, Server, ShieldCheck, X } from 'lucide-react';
import { assetRisks, compactMoney, money, securityControls, vulnerabilities, type Asset } from './data';
import { RiskBadge } from './AssetTable';

export type AssetAction = 'edit' | 'scenario' | 'asset' | 'report';

export interface AssetViewRequest {
  tab: 'Overview' | 'Risks' | 'Vulnerabilities' | 'Controls';
  item?: string;
  id: number;
}

interface AssetPanelProps {
  asset: Asset;
  onClose: () => void;
  onAction: (action: AssetAction, asset: Asset) => void;
  onPlan: (asset: Asset) => void;
  inPlan: boolean;
  notify: (message: string) => void;
  viewRequest?: AssetViewRequest;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="detail-row"><span>{label}</span><span>{children}</span></div>;
}

export default function AssetPanel({ asset, onClose, onAction, onPlan, inPlan, notify, viewRequest }: AssetPanelProps) {
  const [tab, setTab] = useState('Overview');
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);
  const [controls, setControls] = useState(securityControls.map((control) => control.enabled));
  const [vulnerabilityStatus, setVulnerabilityStatus] = useState<Record<string, string>>({});
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTab(viewRequest?.tab || 'Overview');
    const riskIndex = assetRisks.findIndex((risk) => risk.name === viewRequest?.item);
    setExpandedRisk(riskIndex >= 0 ? riskIndex : null);
  }, [asset.id, viewRequest]);

  useEffect(() => {
    if (!viewRequest?.item) return;
    const frame = requestAnimationFrame(() => {
      const target = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[data-item]') || []).find((element) => element.dataset.item === viewRequest.item);
      target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [viewRequest, tab]);

  return (
    <aside className="asset-detail panel animate-panel" aria-label={`${asset.name} details`} ref={panelRef}>
      <div className="asset-panel-title"><h2>{asset.name}</h2><span className={`asset-risk-label ${asset.level.toLowerCase()}`}>{asset.level} Risk</span><button className="icon-button close-panel" onClick={onClose} aria-label="Close asset details"><X size={15} /></button></div>
      <div className="asset-identity"><div className="server-symbol"><Server size={32} strokeWidth={2.4} /></div><div><h3>{asset.name}</h3><p>Production<span />{asset.ip}</p></div></div>
      <div className="asset-tabs" role="tablist" aria-label="Asset information">
        {['Overview', 'Risks', 'Vulnerabilities', 'Controls'].map((name, index) => <button key={name} role="tab" aria-selected={tab === name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}{index > 0 && <span> ({[0, 12, 8, 6][index]})</span>}</button>)}
      </div>
      <div className="asset-panel-content">
        {tab === 'Overview' ? <>
          <section className="detail-section financial-inputs">
            <div className="detail-section-title"><h3>Financial Inputs</h3><button className="small-outline-button" onClick={() => onAction('edit', asset)}><Pencil size={11} />Edit</button></div>
            <div className="detail-table financial-table">
              <DetailRow label="Asset Value">{money(asset.value)}</DetailRow>
              <DetailRow label="Exposure Factor (EF)">{(asset.exposure / 100).toFixed(2)} ({asset.exposure}%)</DetailRow>
              <DetailRow label="Single Loss Expectancy (SLE)">{money(asset.value * asset.exposure / 100)}</DetailRow>
              <DetailRow label="Annual Rate of Occurrence (ARO)">{asset.aro.toFixed(2)}</DetailRow>
              <DetailRow label="Annualized Loss Expectancy (ALE)">{money(asset.ale)}</DetailRow>
            </div>
          </section>
          <section className="detail-section monte-carlo">
            <div className="detail-section-title"><h3>ALE Range (Monte Carlo Simulation)</h3><span className="info-help" tabIndex={0} aria-label="Estimated annual loss range from 10,000 simulated risk outcomes"><Info size={10} /><span>10,000 simulated outcomes. P10 is the best case, P50 the median, and P90 the worst case.</span></span></div>
            <div className="range-box">
              <DetailRow label="Best Case (P10)"><b className="text-teal">{compactMoney(asset.ale * 1.1 / 3)}</b></DetailRow>
              <DetailRow label="Most Likely (P50)"><b>{compactMoney(asset.ale)}</b></DetailRow>
              <DetailRow label="Worst Case (P90)"><b className="text-red">{compactMoney(asset.ale * 2.6)}</b></DetailRow>
              <div className="range-visual" role="img" aria-label={`Expected loss ranges from ${compactMoney(asset.ale * 1.1 / 3)} to ${compactMoney(asset.ale * 2.6)}`}><div className="range-track"><i className="range-dot range-best" /><i className="range-dot range-likely" /><i className="range-median" /><i className="range-dot range-worst" /></div><div className="range-labels"><span>{(asset.ale * 1.1 / 3).toFixed(1)} Cr</span><span>{asset.ale.toFixed(1)} Cr</span><span>{(asset.ale * 2.6).toFixed(1)} Cr</span></div></div>
            </div>
          </section>
          <section className="detail-section business-context">
            <div className="detail-section-title"><h3>Business Context</h3></div>
            <div className="detail-table context-table">
              <DetailRow label="Business Unit">{asset.unit}</DetailRow>
              <DetailRow label="Asset Type">{asset.type}</DetailRow>
              <DetailRow label="Environment">Production</DetailRow>
              <DetailRow label="Owner">{asset.owner}</DetailRow>
              <DetailRow label="Criticality">{asset.level}</DetailRow>
              <DetailRow label="Dependencies">5 upstream / 3 downstream</DetailRow>
              <DetailRow label="Key Risks">Data breach, Service downtime,<br />Regulatory penalty</DetailRow>
            </div>
          </section>
        </> : <div className="detail-tab-body">
          <div className="detail-list-heading"><h3>{tab === 'Risks' ? 'Associated Risks' : tab === 'Vulnerabilities' ? 'Open Vulnerabilities' : 'Security Controls'}</h3><p>{tab === 'Risks' ? 'Prioritized by potential business impact.' : tab === 'Vulnerabilities' ? 'Track and resolve asset weaknesses.' : 'Manage protection for this asset.'}</p></div>
          {tab === 'Risks' && assetRisks.map((risk, index) => <div className={`risk-list-item ${viewRequest?.item === risk.name ? 'search-highlight' : ''}`} data-item={risk.name} key={risk.name}><button onClick={() => setExpandedRisk(expandedRisk === index ? null : index)} aria-expanded={expandedRisk === index}><span><strong>{risk.name}</strong><small>{risk.category}</small></span><RiskBadge level={risk.severity} /><ChevronDown size={13} className={expandedRisk === index ? 'rotate-180' : ''} /></button>{expandedRisk === index && <p className="risk-description">{risk.description}</p>}</div>)}
          {tab === 'Vulnerabilities' && vulnerabilities.map((vulnerability) => <div className={`vulnerability-item ${viewRequest?.item === vulnerability.name ? 'search-highlight' : ''}`} data-item={vulnerability.name} key={vulnerability.id}><div><small>{vulnerability.id}</small><RiskBadge level={vulnerability.severity} /></div><h4>{vulnerability.name}</h4><label>Status<select value={vulnerabilityStatus[vulnerability.id] || vulnerability.status} onChange={(event) => { setVulnerabilityStatus((current) => ({ ...current, [vulnerability.id]: event.target.value })); notify(`${vulnerability.id} updated to ${event.target.value.toLowerCase()}.`); }}><option>Open</option><option>In progress</option><option>Resolved</option></select></label></div>)}
          {tab === 'Controls' && securityControls.map((control, index) => <div className={`control-item ${viewRequest?.item === control.name ? 'search-highlight' : ''}`} data-item={control.name} key={control.name}><ShieldCheck size={18} className={controls[index] ? 'text-teal' : 'muted'} /><div><h4>{control.name}</h4><p>{control.detail}</p><small className={controls[index] ? 'text-teal' : 'text-amber'}>{controls[index] ? 'Implemented' : 'Not implemented'}</small></div><button className={`toggle-switch ${controls[index] ? 'enabled' : ''}`} role="switch" aria-checked={controls[index]} aria-label={control.name} onClick={() => { setControls((current) => current.map((value, position) => position === index ? !value : value)); notify(`${control.name} ${controls[index] ? 'disabled' : 'enabled'}.`); }}><span /></button></div>)}
        </div>}
      </div>
      <section className="detail-section asset-actions">
        <div className="detail-section-title"><h3>Actions</h3></div>
        <div className="asset-action-grid">
          <button className={`primary-button ${inPlan ? 'added-button' : ''}`} onClick={() => onPlan(asset)}>{inPlan ? <Check size={14} /> : <ArrowDownToLine size={14} />}{inPlan ? 'Added to Plan' : 'Add to Optimization Plan'}</button>
          <button className="outline-button" onClick={() => onAction('scenario', asset)}><ScanSearch size={15} />Run What-If Scenario</button>
          <button className="outline-button" onClick={() => onAction('asset', asset)}><FileText size={17} />View Asset Details</button>
          <button className="outline-button" onClick={() => onAction('report', asset)}><FileChartColumnIncreasing size={17} />Create Report</button>
        </div>
      </section>
    </aside>
  );
}
