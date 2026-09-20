import { useState, type FormEvent } from 'react';
import { Icon } from '../components/Icons';
import { assetInventory, categories, frameworkOptions, today, type SecurityControl, type ControlStatus, type Effectiveness } from './data';
import { Checkbox } from './UI';

export function ControlEditor({ control, onSave, onCancel }: { control?: SecurityControl; onSave: (control: SecurityControl) => void; onCancel: () => void }) {
  const [frameworks, setFrameworks] = useState(control?.frameworks || ['NIST', 'ISO']);
  const [error, setError] = useState('');
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name')).trim();
    if (name.length < 3) { setError('Please enter a control name with at least 3 characters.'); return; }
    if (!frameworks.length) { setError('Select at least one security framework.'); return; }
    const nameMap: Record<string, string> = { NIST: 'NIST CSF', ISO: 'ISO 27001', CIS: 'CIS Controls', PCI: 'PCI DSS', SOC: 'SOC 2' };
    onSave({
      id: control?.id || `custom-${Date.now()}`, name,
      description: String(data.get('description')).trim(),
      category: String(data.get('category')),
      status: String(data.get('status')) as ControlStatus,
      effectiveness: String(data.get('effectiveness')) as Effectiveness,
      cost: Number(data.get('cost')),
      operatingCost: Number(data.get('operatingCost')),
      owner: String(data.get('owner')).trim() || 'R. Sharma (CISO)',
      updated: today(), frameworks,
      mappings: frameworks.map((key) => control?.mappings.find((item) => item.name === nameMap[key]) || { name: nameMap[key], reference: key === 'NIST' ? 'PR.AC-7' : key === 'ISO' ? 'A.9.4.2' : '6' }),
      assets: control?.assets ?? 0, totalAssets: control?.totalAssets || 52, assetIds: control?.assetIds || [], coverage: control?.coverage ?? 0,
      icon: control?.icon || 'shieldPlus',
      linkedRisks: control?.linkedRisks || ['Unauthorized Access', 'Data Breach'],
      activities: [{ date: today(), action: control ? 'Control updated' : 'Control created', actor: 'Y. Galande', color: '#27bbf1' }, ...(control?.activities || [])],
      evidence: control?.evidence || [],
    });
  }
  return <form className="sc-form" onSubmit={save}>
    <label>Control Name<input name="name" autoFocus defaultValue={control?.name || ''} placeholder="e.g. Multi-Factor Authentication" required maxLength={90} /></label>
    <label>Description<textarea name="description" defaultValue={control?.description || ''} placeholder="Describe the purpose and scope of this control." rows={3} required maxLength={700} /></label>
    <div className="sc-form-row"><label>Category<select name="category" defaultValue={control?.category || 'Identity & Access'}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Owner<input name="owner" defaultValue={control?.owner || 'R. Sharma (CISO)'} maxLength={80} /></label></div>
    <div className="sc-form-row"><label>Status<select name="status" defaultValue={control?.status || 'Gap'}><option>Deployed</option><option>Partial</option><option>Gap</option></select></label><label>Effectiveness<select name="effectiveness" defaultValue={control?.effectiveness || 'Medium'}><option>High</option><option>Medium</option><option>Low</option></select></label></div>
    <div className="sc-form-row"><label>Implementation Cost (&#8377; L)<input name="cost" type="number" min={0} max={10000} step={0.1} defaultValue={control?.cost || 0} required /></label><label>Annual Operating Cost (&#8377; L)<input name="operatingCost" type="number" min={0} max={10000} step={0.1} defaultValue={control?.operatingCost || 0} required /></label></div>
    <fieldset><legend>Mapped Frameworks</legend><div className="sc-check-options">{frameworkOptions.map((framework) => <label key={framework}><Checkbox checked={frameworks.includes(framework)} onChange={() => setFrameworks((current) => current.includes(framework) ? current.filter((item) => item !== framework) : [...current, framework])} label={framework} />{framework}</label>)}</div></fieldset>
    {error && <p className="sc-form-error" role="alert">{error}</p>}
    <p className="sc-form-note">Changes are saved locally in this demo workspace. No external systems are modified.</p>
    <div className="sc-form-actions"><button type="button" className="sc-button" onClick={onCancel}>Cancel</button><button type="submit" className="sc-button sc-button-primary"><Icon name="check" />{control ? 'Save Changes' : 'Add Control'}</button></div>
  </form>;
}

export function AssetMapper({ control, onSave, onCancel }: { control: SecurityControl; onSave: (ids: string[]) => void; onCancel: () => void }) {
  const [mapped, setMapped] = useState(control.assetIds);
  const [query, setQuery] = useState('');
  const [onlyGaps, setOnlyGaps] = useState(false);
  const eligible = assetInventory.slice(0, control.totalAssets);
  const visible = eligible.filter((item) => (!onlyGaps || !mapped.includes(item.id)) && `${item.name} ${item.hostname}`.toLowerCase().includes(query.toLowerCase()));
  const allVisible = visible.length > 0 && visible.every((item) => mapped.includes(item.id));
  return <div className="sc-mapper"><p className="sc-dialog-copy">Map this control to the assets it protects. Coverage updates automatically when you save.</p><div className="sc-mapper-toolbar"><div className="sc-search-field"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search assets..." aria-label="Search assets to map" /></div><label className="sc-inline-check"><Checkbox label="Only show unmapped assets" checked={onlyGaps} onChange={() => setOnlyGaps(!onlyGaps)} />Unmapped only</label></div>
    <div className="sc-map-summary"><label className="sc-inline-check"><Checkbox label="Select all visible assets" checked={allVisible} onChange={() => setMapped((current) => allVisible ? current.filter((id) => !visible.some((item) => item.id === id)) : [...new Set([...current, ...visible.map((item) => item.id)])])} />Select visible assets</label><strong>{mapped.length} / {eligible.length} mapped</strong></div>
    <div className="sc-asset-options">{visible.map((item) => <label key={item.id}><Checkbox label={`Map ${item.name}`} checked={mapped.includes(item.id)} onChange={() => setMapped((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} /><Icon name="server" /><span><strong>{item.name}</strong><small>{item.hostname}</small></span><em>{item.unit}</em></label>)}{!visible.length && <p className="sc-empty">No assets match this filter.</p>}</div>
    <div className="sc-form-actions"><button className="sc-button" onClick={onCancel}>Cancel</button><button className="sc-button sc-button-primary" onClick={() => onSave(mapped)}><Icon name="mapAssets" />Save Asset Mapping</button></div>
  </div>;
}