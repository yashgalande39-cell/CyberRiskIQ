import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Icon } from '../components/Icons';
import { assetInventory, downloadFile, formatLakh, today, type DetailTab, type SecurityControl, type Evidence } from './data';
import { Badge, ProgressBar } from './UI';

type Props = {
  control: SecurityControl;
  onClose: () => void;
  onEdit: () => void;
  onMap: () => void;
  onPlan: () => void;
  onDeploy: () => void;
  planned: boolean;
  onEvidence: (evidence: Evidence) => void;
  notify: (text: string) => void;
};

export function ControlDetail({ control, onClose, onEdit, onMap, onPlan, onDeploy, planned, onEvidence, notify }: Props) {
  const [tab, setTab] = useState<DetailTab>('overview');
  const [assetQuery, setAssetQuery] = useState('');
  const [gapsOnly, setGapsOnly] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTab('overview'); setAssetQuery(''); setGapsOnly(false); }, [control.id]);
  const gapCount = Math.max(0, control.totalAssets - control.assetIds.length);
  const assetList = assetInventory.slice(0, control.totalAssets).filter((item) => `${item.name} ${item.hostname}`.toLowerCase().includes(assetQuery.toLowerCase()) && (!gapsOnly || !control.assetIds.includes(item.id)));

  function addEvidence(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) { notify('Please choose a file smaller than 512 KB for local storage.'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => {
      onEvidence({ id: `evidence-${Date.now()}`, name: file.name, date: today(), size: `${Math.max(1, Math.ceil(file.size / 1024))} KB`, dataUrl: String(reader.result) });
      notify('Evidence attached to this control on your device.');
    };
    reader.onerror = () => notify('This file could not be read. Please try another file.');
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function downloadEvidence(item: Evidence) {
    if (item.dataUrl) {
      const anchor = document.createElement('a');
      anchor.href = item.dataUrl;
      anchor.download = item.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } else {
      downloadFile(`${item.name.replace(/[^a-z0-9]+/gi, '-')}.json`, JSON.stringify({ control: control.name, evidence: item.name, recorded: item.date, status: control.status, coverage: control.coverage, frameworks: control.mappings, source: 'CyberRiskIQ demo workspace' }, null, 2), 'application/json');
    }
  }

  return <aside className="control-detail" id="control-detail" aria-label={`${control.name} details`}>
    <header className="detail-heading"><span className="detail-control-icon"><Icon name={control.icon} /></span><div><h2>{control.name}</h2><div className="detail-badges"><Badge value={control.status} /><span className="detail-effectiveness">{control.effectiveness} Effectiveness</span></div></div><button className="detail-close" onClick={onClose} aria-label="Close control details"><Icon name="close" /></button></header>
    <nav className="detail-tabs" aria-label="Control detail tabs">{(['overview', 'assets', 'mappings', 'evidence'] as DetailTab[]).map((item) => <button key={item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)} aria-current={tab === item ? 'page' : undefined}>{item === 'assets' ? <>Assets <span>({control.assets})</span></> : item[0].toUpperCase() + item.slice(1)}</button>)}</nav>
    <div className="detail-body" key={`${control.id}-${tab}`}>
      {tab === 'overview' && <>
        <section className="detail-block description-block"><h3>Description</h3><p>{control.description}</p><div className="detail-owner-row"><div><h3>Category</h3><p>{control.category === 'Identity & Access' ? 'Identity & Access Management' : control.category}</p></div><div><h3>Owner</h3><span className="control-owner"><i>RS</i>{control.owner}</span></div></div></section>
        <div className="detail-two-column detail-costs"><div><h3>Implementation Cost</h3><strong>&#8377; {formatLakh(control.cost)} L</strong></div><div><h3>Annual Operating Cost</h3><strong>&#8377; {formatLakh(control.operatingCost)} L</strong></div></div>
        <div className="detail-two-column detail-measures"><div><h3>Coverage</h3><strong>{control.coverage}%</strong><p>({control.assets} / {control.totalAssets} assets)</p><ProgressBar value={control.coverage} label="Selected control coverage" /></div><div><h3>Effectiveness</h3><strong>{control.effectiveness}</strong><ProgressBar value={control.effectiveness === 'High' ? 82 : control.effectiveness === 'Medium' ? 58 : 27} color={control.effectiveness === 'Low' ? '#fa425f' : undefined} label="Control effectiveness" /></div></div>
        <section className="detail-block"><h3>Mapped Frameworks</h3><div className="framework-tags">{control.mappings.map((item) => <button key={item.name} onClick={() => setTab('mappings')}>{item.name} ({item.reference})</button>)}</div></section>
        <section className="detail-block"><h3>Linked Risks</h3><div className="linked-risk-tags">{control.linkedRisks.map((risk) => <span key={risk}>{risk}</span>)}</div></section>
        <section className="detail-block detail-gap"><h3>Control Gaps</h3><div><span><Icon name={gapCount ? 'alert' : 'checkCircle'} />{gapCount ? `${gapCount} assets without ${control.id === 'mfa' ? 'MFA' : 'control'} enabled` : 'All assets are protected'}</span><button className="sc-text-button" onClick={() => { setGapsOnly(true); setTab('assets'); }}>View Assets <Icon name="arrowRight" /></button></div></section>
        <section className="detail-block detail-activity"><h3>Recent Activity</h3><ol>{control.activities.slice(0, 4).map((item, index) => <li key={`${item.date}-${item.action}-${index}`}><i style={{ background: item.color }} /><time>{item.date}</time><span>{item.action}</span><small>{item.actor}</small></li>)}</ol></section>
      </>}

      {tab === 'assets' && <div className="detail-tab-section"><h3>Assets Protected by This Control</h3><p>{control.assetIds.length} mapped assets. {gapCount} still require coverage.</p><div className="sc-search-field"><Icon name="search" /><input placeholder="Search assets..." aria-label="Search control assets" value={assetQuery} onChange={(event) => setAssetQuery(event.target.value)} /></div><label className="sc-inline-check"><input type="checkbox" checked={gapsOnly} onChange={(event) => setGapsOnly(event.target.checked)} />Show control gaps only</label><div className="detail-asset-list">{assetList.map((item) => <button key={item.id} onClick={onMap}><Icon name="server" /><span><strong>{item.name}</strong><small>{item.unit} / {item.type}</small></span><Badge value={control.assetIds.includes(item.id) ? 'Mapped' : 'Gap'} /></button>)}{!assetList.length && <p className="sc-empty">No matching assets.</p>}</div><button className="sc-button sc-button-primary full-width" onClick={onMap}><Icon name="mapAssets" />Manage Asset Mapping</button></div>}

      {tab === 'mappings' && <div className="detail-tab-section"><h3>Framework Mappings</h3><p>Policy requirements associated with {control.name}.</p><div className="detail-mapping-list">{control.mappings.map((item) => <article key={item.name}><Icon name="shieldCheck" /><div><h4>{item.name}</h4><p>Reference: {item.reference}</p><span>Mapped and monitored</span></div><Icon name="checkCircle" /></article>)}</div><button className="sc-button full-width" onClick={onEdit}><Icon name="pencil" />Edit Framework Mappings</button></div>}

      {tab === 'evidence' && <div className="detail-tab-section"><h3>Control Evidence</h3><p>Policies, audit results, and proof of deployment. Evidence is saved on this device.</p><div className="detail-evidence-list">{control.evidence.map((item) => <article key={item.id}><Icon name="report" /><div><h4>{item.name}</h4><p>{item.date} / {item.size}</p></div><button className="sc-icon-button" aria-label={`Download ${item.name}`} onClick={() => downloadEvidence(item)}><Icon name="download" /></button></article>)}</div><input type="file" className="sr-only" ref={fileRef} onChange={addEvidence} accept=".pdf,.txt,.csv,.json,.md,.png,.jpg" /><button className="sc-button sc-button-primary full-width" onClick={() => fileRef.current?.click()}><Icon name="plus" />Attach Evidence</button><small className="sc-form-note">Maximum file size: 512 KB.</small></div>}

      <section className="detail-quick-actions"><h3>Quick Actions</h3><div><button className="sc-button" onClick={onEdit}><Icon name="pencil" />Edit Control</button><button className="sc-button" onClick={onMap}><Icon name="mapAssets" />Map Assets</button><button className={`sc-button ${planned ? 'is-planned' : ''}`} onClick={onPlan}><Icon name={planned ? 'check' : 'report'} />{planned ? 'In Remediation Plan' : 'Add to Remediation Plan'}</button><button className="sc-button" onClick={onDeploy}><Icon name="checkCircle" />Mark as Deployed</button></div></section>
    </div>
  </aside>;
}