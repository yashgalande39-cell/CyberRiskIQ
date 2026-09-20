import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { type Asset } from './data';

export function RiskBadge({ level }: { level: string }) {
  return <span className={`risk-badge ${level.toLowerCase()}`}>{level}</span>;
}

export default function AssetTable({ assets, onSelect, expanded = false }: { assets: Asset[]; onSelect: (asset: Asset) => void; expanded?: boolean }) {
  const [sort, setSort] = useState<{ key: 'ale' | 'risk'; ascending: boolean }>({ key: 'ale', ascending: false });
  const sorted = useMemo(() => [...assets].sort((a, b) => (a[sort.key] - b[sort.key]) * (sort.ascending ? 1 : -1)), [assets, sort]);
  function changeSort(key: 'ale' | 'risk') {
    setSort((current) => ({ key, ascending: current.key === key ? !current.ascending : false }));
  }
  return (
    <div className={`asset-table-wrap ${expanded ? 'expanded' : ''}`}>
      <table className="asset-table">
        <thead><tr><th>#</th><th>Asset Name</th><th>Business Unit</th><th><button onClick={() => changeSort('ale')}>ALE ({'\u20b9'}/year){expanded && (sort.key === 'ale' ? sort.ascending ? <ArrowUp /> : <ArrowDown /> : <ArrowUpDown />)}</button></th><th><button onClick={() => changeSort('risk')}>Risk Score{expanded && (sort.key === 'risk' ? sort.ascending ? <ArrowUp /> : <ArrowDown /> : <ArrowUpDown />)}</button></th><th>Risk Level</th><th>Actions</th></tr></thead>
        <tbody>{sorted.map((asset, index) => <tr key={asset.id} onDoubleClick={() => onSelect(asset)}><td>{index + 1}</td><td title={asset.name}>{asset.name}</td><td>{asset.unit}</td><td>{asset.ale.toFixed(1)} Cr</td><td className={`risk-score ${asset.risk >= 80 ? 'critical' : asset.risk >= 75 ? 'high' : 'medium'}`}>{asset.risk}</td><td><RiskBadge level={asset.level} /></td><td><button className="table-view-button" onClick={() => onSelect(asset)} aria-label={`View ${asset.name}`}>View</button></td></tr>)}</tbody>
      </table>
      {assets.length === 0 && <div className="empty-state">No assets match your filters. Try a different search.</div>}
    </div>
  );
}
