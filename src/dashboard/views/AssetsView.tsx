import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  Boxes,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  Crown,
  Database,
  Download,
  Ellipsis,
  Filter,
  Globe2,
  Menu,
  Network,
  Pencil,
  Plus,
  Search,
  Server,
  ShieldAlert,
  Sparkles,
  Target,
  UserRound,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import '../../styles/assets.css';

export type Asset = {
  name: string;
  host: string;
  type: string;
  unit: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  score: number;
  vulnerabilities: number;
  critical: number;
  hours: string;
  exposure: 'Public' | 'Internal';
  owner: string;
  seen: string;
  icon: 'server' | 'database' | 'cloud' | 'desktop' | 'mail' | 'folder';
};

const initialAssets: Asset[] = [
  { name: 'Payment Gateway', host: 'pay.acme.com • 10.0.1.15', type: 'Web Server', unit: 'Finance', criticality: 'Critical', score: 92, vulnerabilities: 24, critical: 3, hours: '12H', exposure: 'Public', owner: 'R. Sharma', seen: '2 min ago', icon: 'server' },
  { name: 'Finance Database', host: 'db-finance-01 • 10.0.2.8', type: 'Database', unit: 'Finance', criticality: 'Critical', score: 88, vulnerabilities: 18, critical: 5, hours: '8H', exposure: 'Internal', owner: 'P. Mehta', seen: '5 min ago', icon: 'database' },
  { name: 'Employee Portal', host: 'HR Portal • 10.0.3.21', type: 'Web Application', unit: 'HR', criticality: 'High', score: 76, vulnerabilities: 12, critical: 2, hours: '6H', exposure: 'Public', owner: 'A. Verma', seen: '12 min ago', icon: 'server' },
  { name: 'Active Directory', host: 'ad.acme.local • 10.0.0.5', type: 'Identity', unit: 'IT', criticality: 'High', score: 81, vulnerabilities: 15, critical: 4, hours: '7H', exposure: 'Internal', owner: 'S. Iyer', seen: '3 min ago', icon: 'server' },
  { name: 'AWS Production', host: 'aws-acme-prod', type: 'Cloud', unit: 'Operations', criticality: 'High', score: 78, vulnerabilities: 11, critical: 1, hours: '6H', exposure: 'Public', owner: 'K. Nair', seen: '8 min ago', icon: 'cloud' },
  { name: 'Office Workstations', host: 'Workstations (320)', type: 'Endpoint', unit: 'All', criticality: 'Medium', score: 54, vulnerabilities: 45, critical: 0, hours: '12H', exposure: 'Internal', owner: 'IT Team', seen: '1 hour ago', icon: 'desktop' },
  { name: 'Email Server', host: 'mail.acme.com • 10.0.4.11', type: 'Mail Server', unit: 'IT', criticality: 'Medium', score: 52, vulnerabilities: 9, critical: 1, hours: '4H', exposure: 'Public', owner: 'D. Rao', seen: '20 min ago', icon: 'mail' },
  { name: 'File Storage', host: 'fs-01.acme.local', type: 'Storage', unit: 'Operations', criticality: 'Low', score: 32, vulnerabilities: 4, critical: 0, hours: '2H', exposure: 'Internal', owner: 'M. Khan', seen: '2 hours ago', icon: 'folder' },
  { name: 'Dev Environment', host: 'dev.acme.local', type: 'Server', unit: 'Engineering', criticality: 'Medium', score: 61, vulnerabilities: 28, critical: 3, hours: '10H', exposure: 'Internal', owner: 'DevOps', seen: '18 min ago', icon: 'server' },
  { name: 'Backup Server', host: 'backup-01 • 10.0.5.22', type: 'Backup', unit: 'IT', criticality: 'Low', score: 29, vulnerabilities: 3, critical: 0, hours: '1H', exposure: 'Internal', owner: 'S. Patel', seen: '6 hours ago', icon: 'server' },
];

const statCards = [
  { label: 'Total Assets', value: '842', change: '↑ 12%', detail: 'vs last month', tone: 'blue', icon: Server },
  { label: 'High Risk Assets', value: '86', change: '↑ 6%', detail: 'vs last month', tone: 'red', icon: ShieldAlert },
  { label: 'Internet Exposed', value: '142', change: '↑ 18%', detail: 'vs last month', tone: 'blue', icon: Globe2 },
  { label: 'Critical Assets', value: '64', change: '', detail: '7.6% of total', tone: 'orange', icon: Crown },
];

const iconForAsset: Record<Asset['icon'], LucideIcon> = {
  server: Server,
  database: Database,
  cloud: Cloud,
  desktop: Boxes,
  mail: Menu,
  folder: BriefcaseBusiness,
};

function PageIntro({
  onNav,
  onAdd,
}: {
  onNav?: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <header className="sc-page-header">
      <div>
        <nav className="sc-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            onClick={() => (onNav ? onNav('dashboard') : null)}
            aria-label="Navigate to Command Center Dashboard"
          >
            Home
          </button>
          <ChevronRight size={11} />
          <span>Assets</span>
        </nav>
        <h1>Assets</h1>
        <p>Discover, manage, and monitor your IT assets. Assets are the foundation of your cyber risk analysis.</p>
      </div>
      <div className="sc-header-actions">
        <p>
          KNOW YOUR ASSETS<br />
          SECURE WHAT MATTERS<br />
          MINIMIZE ATTACK SURFACE
        </p>
        <button className="sc-button sc-button-primary add-control" onClick={onAdd}>
          <Plus size={16} /> Add Asset
        </button>
      </div>
    </header>
  );
}

function Stats() {
  return (
    <section className="stats-grid">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            className="stat-card"
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index }}
          >
            <div className={`stat-icon ${stat.tone}`}>
              <Icon size={27} />
            </div>
            <div className="stat-copy">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small className={stat.tone === 'red' ? 'negative' : 'positive'}>
                {stat.change}
              </small>
              <em>{stat.detail}</em>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

function AssetIcon({ asset }: { asset: Asset }) {
  const Icon = iconForAsset[asset.icon];
  return (
    <span className={`asset-icon ${asset.icon}`}>
      <Icon size={16} />
    </span>
  );
}

function RiskBadge({ level }: { level: Asset['criticality'] }) {
  return <span className={`risk-badge ${level.toLowerCase()}`}>{level}</span>;
}

function FilterBar({
  query,
  setQuery,
  activeTab,
  setActiveTab,
  notify,
}: {
  query: string;
  setQuery: (value: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notify: (message: string) => void;
}) {
  const tabs = ['All Assets (842)', 'High Risk (86)', 'Internet Exposed (142)', 'Critical (64)'];

  return (
    <section className="asset-controls">
      <div className="asset-tabs">
        <div className="tabs-left">
          {tabs.map((item) => (
            <button
              key={item}
              className={activeTab === item ? 'active' : ''}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="view-actions">
          <button onClick={() => notify('Grouped by Business Unit')}>
            By Business Unit <ChevronDown size={13} />
          </button>
          <button onClick={() => notify('Grouped by Asset Type')}>
            By Asset Type <ChevronDown size={13} />
          </button>
          <span />
          <button onClick={() => notify('Asset filters drawer opened')}>
            <Filter size={14} /> Filters
          </button>
          <button onClick={() => notify('Asset inventory export started')}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>
      <div className="filters-row">
        <label>
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search assets by name, IP, owner..."
          />
        </label>
        {['Asset Type', 'Business Unit', 'Risk Level', 'More Filters'].map((filter) => (
          <button key={filter} onClick={() => notify(`${filter} options toggled`)}>
            {filter} <ChevronDown size={13} />
          </button>
        ))}
      </div>
    </section>
  );
}

function AssetTable({
  items,
  selected,
  setSelected,
  notify,
}: {
  items: Asset[];
  selected: Asset | null;
  setSelected: (asset: Asset) => void;
  notify: (message: string) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (name: string) =>
    setChecked((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );

  const allChecked = items.length > 0 && checked.length === items.length;
  const toggleAll = () => {
    if (allChecked) setChecked([]);
    else setChecked(items.map((i) => i.name));
  };

  return (
    <div className="table-wrap">
      <table className="asset-table">
        <colgroup>
          <col className="check-col" />
          <col className="name-col" />
          <col className="type-col" />
          <col className="unit-col" />
          <col className="critical-col" />
          <col className="score-col" />
          <col className="vuln-col" />
          <col className="exposure-col" />
          <col className="owner-col" />
          <col className="seen-col" />
          <col className="action-col" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <button
                className={`checkbox ${allChecked ? 'checked' : ''}`}
                onClick={toggleAll}
                aria-label="Select all assets"
              />
            </th>
            <th>Asset Name</th>
            <th>Type</th>
            <th>Business Unit</th>
            <th>Criticality</th>
            <th>Risk Score</th>
            <th>Vulnerabilities</th>
            <th>Exposure</th>
            <th>Owner</th>
            <th>Last Seen</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((asset, index) => (
            <motion.tr
              key={asset.name}
              className={selected?.name === asset.name ? 'selected' : ''}
              onClick={() => setSelected(asset)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(index * 0.025, 0.2) }}
            >
              <td>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(asset.name);
                  }}
                  className={`checkbox ${checked.includes(asset.name) ? 'checked' : ''}`}
                  aria-label={`Select ${asset.name}`}
                />
              </td>
              <td>
                <div className="asset-name">
                  <AssetIcon asset={asset} />
                  <div>
                    <strong>{asset.name}</strong>
                    <small>{asset.host}</small>
                  </div>
                </div>
              </td>
              <td>{asset.type}</td>
              <td>{asset.unit}</td>
              <td>
                <RiskBadge level={asset.criticality} />
              </td>
              <td>
                <b
                  className={`score ${
                    asset.score >= 80 ? 'danger' : asset.score >= 50 ? 'warn' : 'safe'
                  }`}
                >
                  {asset.score}
                </b>
              </td>
              <td>
                <div className="vulns">
                  <b>{asset.vulnerabilities}</b>
                  <span>{asset.critical}C</span>
                  <em>{asset.hours}</em>
                </div>
              </td>
              <td>{asset.exposure}</td>
              <td>{asset.owner}</td>
              <td>{asset.seen}</td>
              <td>
                <button
                  className="more"
                  onClick={(event) => {
                    event.stopPropagation();
                    notify(`Options for ${asset.name}`);
                  }}
                  aria-label={`More options for ${asset.name}`}
                >
                  <Ellipsis size={17} />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="empty-state">
          <Search size={28} />
          <span>No matching assets found</span>
        </div>
      )}
    </div>
  );
}

function Pagination() {
  const [page, setPage] = useState(1);
  const pages: (number | string)[] = [1, 2, 3, 4, 5, '…', 85];
  return (
    <div className="pagination">
      <span>Showing 1–10 of 842 assets</span>
      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((item, index) => (
          <button
            className={page === item ? 'active' : ''}
            onClick={() => typeof item === 'number' && setPage(item)}
            key={`${item}-${index}`}
          >
            {item}
          </button>
        ))}
        <button
          onClick={() => setPage(Math.min(85, page + 1))}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function Donut({ variant, center = '842' }: { variant: 'type' | 'unit' | 'exposure'; center?: string }) {
  return (
    <div className={`donut ${variant}`}>
      <div>
        <strong>{center}</strong>
        <span>Total</span>
      </div>
    </div>
  );
}

const typeLegend = [
  ['Servers', '28%'],
  ['Endpoints', '24%'],
  ['Cloud', '18%'],
  ['Applications', '15%'],
  ['Databases', '10%'],
  ['Network', '5%'],
];

const unitLegend = [
  ['IT', '32%'],
  ['Finance', '20%'],
  ['Operations', '18%'],
  ['HR', '12%'],
  ['Engineering', '10%'],
  ['Sales', '8%'],
  ['Others', '10%'],
];

function Legend({ items }: { items: string[][] }) {
  return (
    <div className="chart-legend">
      {items.map(([label, value], index) => (
        <div key={label}>
          <i className={`dot c${index}`} />
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </div>
  );
}

function Analytics() {
  return (
    <section className="analytics-grid">
      <div className="analytics-panel">
        <h3>Assets by Type</h3>
        <div className="chart-content">
          <Donut variant="type" />
          <Legend items={typeLegend} />
        </div>
      </div>
      <div className="analytics-panel">
        <h3>Assets by Criticality</h3>
        <div className="bar-chart">
          <div className="y-axis">
            <span>500</span>
            <span>400</span>
            <span>300</span>
            <span>200</span>
            <span>100</span>
            <span>0</span>
          </div>
          <div className="bars">
            {[
              { n: 64, h: 18, c: '#ef334b', l: 'Critical' },
              { n: 156, h: 39, c: '#ff722d', l: 'High' },
              { n: 420, h: 84, c: '#ffb52e', l: 'Medium' },
              { n: 202, h: 49, c: '#04ca93', l: 'Low' },
            ].map((bar) => (
              <div className="bar-item" key={bar.l}>
                <b>{bar.n}</b>
                <i style={{ height: `${bar.h}%`, background: bar.c }} />
                <span>{bar.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="analytics-panel">
        <h3>Assets by Business Unit</h3>
        <div className="chart-content">
          <Donut variant="unit" />
          <Legend items={unitLegend} />
        </div>
      </div>
      <div className="analytics-panel exposure-panel">
        <h3>Internet Exposure</h3>
        <div className="chart-content">
          <Donut variant="exposure" center="142" />
          <Legend
            items={[
              ['Public', '17%'],
              ['Internal', '76%'],
              ['DMZ', '7%'],
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="gauge-wrap">
      <div
        className="gauge"
        style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}
      >
        <div>
          <strong>{score}</strong>
          <span>/100</span>
        </div>
      </div>
      <span className="high-risk-label">High Risk</span>
    </div>
  );
}

function DetailPanel({
  asset,
  onClose,
  notify,
  onNav,
}: {
  asset: Asset;
  onClose: () => void;
  notify: (message: string) => void;
  onNav?: (id: string) => void;
}) {
  const [tab, setTab] = useState('Overview');
  const tabs = ['Overview', 'Vulnerabilities (24)', 'Risks', 'Financial Impact'];

  return (
    <motion.aside
      className="detail-panel"
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 28 }}
      transition={{ duration: 0.23 }}
    >
      <div className="detail-head">
        <div className="detail-title">
          <span>
            <Server size={24} />
          </span>
          <div>
            <h2>{asset.name}</h2>
            <p>{asset.name === 'Payment Gateway' ? 'pay.acme.com' : asset.host.split(' • ')[0]}</p>
          </div>
        </div>
        <div className="detail-head-actions">
          <span>High Risk</span>
          <button onClick={onClose} aria-label="Close detail panel">
            <X size={17} />
          </button>
        </div>
      </div>
      <div className="detail-tabs">
        {tabs.map((item) => (
          <button
            className={tab === item ? 'active' : ''}
            onClick={() => setTab(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {tab !== 'Overview' ? (
            <div className="tab-placeholder">
              <ShieldAlert size={31} />
              <h3>{tab.replace(' (24)', '')}</h3>
              <p>Detailed {tab.toLowerCase()} insights for {asset.name}.</p>
              <button onClick={() => setTab('Overview')}>Back to overview</button>
            </div>
          ) : (
            <>
              <section className="info-section">
                <div className="section-title">
                  <h3>Asset Information</h3>
                  <button onClick={() => notify('Asset editor opened')}>
                    <Pencil size={12} /> Edit
                  </button>
                </div>
                <div className="info-grid">
                  <div>
                    <span>Asset Name</span>
                    <b>{asset.name}</b>
                  </div>
                  <div>
                    <span>IP Address</span>
                    <b>10.0.1.15</b>
                  </div>
                  <div>
                    <span>Asset Type</span>
                    <b>{asset.type}</b>
                  </div>
                  <div>
                    <span>Business Unit</span>
                    <b>{asset.unit}</b>
                  </div>
                  <div>
                    <span>Owner</span>
                    <b>
                      <UserRound size={13} /> {asset.owner} (CISO)
                    </b>
                  </div>
                  <div>
                    <span>Location</span>
                    <b>aws-ap-south-1</b>
                  </div>
                  <div>
                    <span>Criticality</span>
                    <RiskBadge level={asset.criticality} />
                  </div>
                  <div>
                    <span>Environment</span>
                    <b>Production</b>
                  </div>
                </div>
                <div className="tags">
                  <span>Tags</span>
                  <p>• Payment, Customer-Facing, API</p>
                </div>
              </section>
              <section className="risk-section">
                <h3>Risk Summary</h3>
                <div className="risk-summary">
                  <ScoreGauge score={asset.score} />
                  <div className="risk-factors">
                    <h4>Top Risk Factors</h4>
                    {[
                      ['Critical Vulnerabilities', '+28', 72, 'red'],
                      ['Internet Exposure', '+22', 55, 'pink'],
                      ['Sensitive Data', '+18', 43, 'orange'],
                      ['Control Gaps', '+14', 32, 'yellow'],
                    ].map(([name, value, width, tone]) => (
                      <div className="factor" key={name as string}>
                        <span>{name}</span>
                        <i>
                          <b className={tone as string} style={{ width: `${width}%` }} />
                        </i>
                        <em>{value}</em>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="quick-title">Quick Actions</h3>
                <div className="quick-actions">
                  <button
                    onClick={() => {
                      if (onNav) onNav('vulnerabilities');
                      else notify('Vulnerabilities opened');
                    }}
                  >
                    <Search /> View Vulnerabilities
                  </button>
                  <button
                    onClick={() => {
                      if (onNav) onNav('analysis');
                      else notify('Risk analysis started');
                    }}
                  >
                    <Activity /> Run Risk Analysis
                  </button>
                  <button
                    onClick={() => {
                      if (onNav) onNav('exposure');
                      else notify('Financial impact opened');
                    }}
                  >
                    <CircleDollarSign /> View Financial Impact
                  </button>
                  <button onClick={() => notify('Asset editor opened')}>
                    <Pencil /> Edit Asset
                  </button>
                  <button
                    onClick={() => {
                      if (onNav) onNav('whatif');
                      else notify('Added to What-If Scenario');
                    }}
                  >
                    <Network /> Add to What-If Scenario
                  </button>
                  <button
                    onClick={() => {
                      if (onNav) onNav('optimization');
                      else notify('Remediation plan created');
                    }}
                  >
                    <Target /> Set Remediation Plan
                  </button>
                </div>
              </section>
              <section className="activity-section">
                <div className="section-title">
                  <h3>Recent Activity</h3>
                  <button onClick={() => notify('Showing all recent activity')}>
                    View All <ChevronRight size={12} />
                  </button>
                </div>
                <div className="timeline">
                  <div className="red">
                    <i />
                    <span>2 min ago</span>
                    <b>New critical vulnerability detected</b>
                    <em>CVE-2024-3094</em>
                  </div>
                  <div className="orange">
                    <i />
                    <span>1 hour ago</span>
                    <b>
                      Asset configuration changed
                      <small>Security group updated</small>
                    </b>
                    <em />
                  </div>
                  <div className="blue">
                    <i />
                    <span>3 hours ago</span>
                    <b>Risk score recalculated</b>
                    <em>
                      85 → <strong>92</strong> (+7)
                    </em>
                  </div>
                </div>
              </section>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}

function AddAssetModal({
  close,
  onAdd,
}: {
  close: () => void;
  onAdd: (asset: Asset) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Web Server');
  const [unit, setUnit] = useState('Finance');
  const [ip, setIp] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const assetName = name.trim() || 'New Monitored Asset';
    const cleanIp = ip.trim() || '10.0.9.50';
    const newAsset: Asset = {
      name: assetName,
      host: `${assetName.toLowerCase().replace(/\s+/g, '-')} • ${cleanIp}`,
      type,
      unit,
      criticality: 'High',
      score: 75,
      vulnerabilities: 8,
      critical: 1,
      hours: '6H',
      exposure: 'Internal',
      owner: 'SecOps Lead',
      seen: 'Just now',
      icon: type === 'Database' ? 'database' : type === 'Cloud' ? 'cloud' : 'server',
    };
    onAdd(newAsset);
    close();
  };

  return (
    <motion.div
      className="asset-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        className="asset-modal"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="asset-modal-title">
          <div>
            <span>
              <Server size={20} />
            </span>
            <h2>Add Asset</h2>
          </div>
          <button type="button" onClick={close} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <p>Add an asset to your monitored inventory.</p>
        <label>
          Asset name
          <input
            autoFocus
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Customer Portal"
          />
        </label>
        <div className="asset-modal-fields">
          <label>
            Asset type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Web Server">Web Server</option>
              <option value="Database">Database</option>
              <option value="Cloud">Cloud</option>
              <option value="Identity">Identity</option>
              <option value="Endpoint">Endpoint</option>
            </select>
          </label>
          <label>
            Business unit
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Operations">Operations</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </select>
          </label>
        </div>
        <label>
          IP address
          <input
            value={ip}
            onChange={(event) => setIp(event.target.value)}
            placeholder="e.g. 10.0.1.50"
          />
        </label>
        <div className="asset-modal-actions">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary" type="submit">
            <Plus size={16} /> Add Asset
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export interface AssetsViewProps {
  onNav?: (id: string) => void;
  externalNotify?: (message: string) => void;
}

export function AssetsView({ onNav, externalNotify }: AssetsViewProps) {
  const [assetList, setAssetList] = useState<Asset[]>(initialAssets);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Assets (842)');
  const [selected, setSelected] = useState<Asset | null>(assetList[0]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    if (externalNotify) externalNotify(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const filtered = useMemo(() => {
    return assetList.filter((asset) => {
      // Tab filtering
      if (activeTab === 'High Risk (86)' && asset.score < 75) return false;
      if (activeTab === 'Internet Exposed (142)' && asset.exposure !== 'Public') return false;
      if (activeTab === 'Critical (64)' && asset.criticality !== 'Critical') return false;

      // Query filtering
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.host.toLowerCase().includes(q) ||
        asset.type.toLowerCase().includes(q) ||
        asset.unit.toLowerCase().includes(q) ||
        asset.owner.toLowerCase().includes(q)
      );
    });
  }, [assetList, query, activeTab]);

  const handleAddAsset = (newAsset: Asset) => {
    setAssetList((current) => [newAsset, ...current]);
    setSelected(newAsset);
    notify(`Asset ${newAsset.name} added to inventory.`);
  };

  return (
    <main
      className={`sc-content asset-page ${selected ? 'with-detail' : ''}`}
      id="assets-content"
      tabIndex={-1}
    >
      <PageIntro onNav={onNav} onAdd={() => setShowModal(true)} />
      <div className="workspace">
        <Stats />
        <FilterBar
          query={query}
          setQuery={setQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notify={notify}
        />
        <AssetTable
          items={filtered}
          selected={selected}
          setSelected={setSelected}
          notify={notify}
        />
        <Pagination />
        <Analytics />
      </div>

      <AnimatePresence>
        {selected && (
          <DetailPanel
            asset={selected}
            onClose={() => setSelected(null)}
            notify={notify}
            onNav={onNav}
          />
        )}
      </AnimatePresence>

      {!selected && (
        <button
          className="reopen-panel"
          onClick={() => setSelected(assetList[0])}
          aria-label="Reopen asset details panel"
        >
          <Server size={16} /> Asset details
        </button>
      )}

      <AnimatePresence>
        {showModal && (
          <AddAssetModal close={() => setShowModal(false)} onAdd={handleAddAsset} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="asset-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            <Sparkles size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default AssetsView;
