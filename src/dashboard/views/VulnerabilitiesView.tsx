import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Clock3,
  Crosshair,
  Download,
  Ellipsis,
  ExternalLink,
  Globe2,
  ListFilter,
  Plus,
  Search,
  Server,
  ShieldAlert,
  Sparkles,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import '../../styles/vulnerabilities.css';

export type Finding = {
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  cve: string;
  title: string;
  asset: string;
  ip: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  cvss: string;
  exploit: 'Exploited' | 'Known' | 'Likely' | 'Possible' | 'Not Seen';
  exposure: 'Internet' | 'Internal';
  score: number;
  days: number;
  remediation: 'Patch Now' | 'Schedule' | 'Plan' | 'Monitor';
};

const initialFindings: Finding[] = [
  { priority: 'P0', cve: 'CVE-2024-3094', title: 'XZ Utils Backdoor', asset: 'Payment Gateway', ip: '10.0.1.15', criticality: 'Critical', cvss: '7.5', exploit: 'Exploited', exposure: 'Internet', score: 98, days: 3, remediation: 'Patch Now' },
  { priority: 'P0', cve: 'CVE-2024-3400', title: 'Palo Alto PAN-OS RCE', asset: 'Firewall-01', ip: '10.0.2.5', criticality: 'Critical', cvss: '9.8', exploit: 'Exploited', exposure: 'Internet', score: 96, days: 7, remediation: 'Patch Now' },
  { priority: 'P0', cve: 'CVE-2021-44228', title: 'Log4Shell (RCE)', asset: 'App Server 01', ip: '10.0.3.21', criticality: 'High', cvss: '10.0', exploit: 'Known', exposure: 'Internet', score: 93, days: 12, remediation: 'Patch Now' },
  { priority: 'P1', cve: 'CVE-2023-48788', title: 'OpenSSL DoS', asset: 'Web Server 02', ip: '10.0.1.22', criticality: 'High', cvss: '7.8', exploit: 'Known', exposure: 'Internet', score: 78, days: 18, remediation: 'Schedule' },
  { priority: 'P1', cve: 'CVE-2024-27198', title: 'JetBrains TeamCity RCE', asset: 'Build Server', ip: '10.0.4.11', criticality: 'High', cvss: '8.8', exploit: 'Likely', exposure: 'Internal', score: 72, days: 25, remediation: 'Schedule' },
  { priority: 'P2', cve: 'CVE-2023-23397', title: 'Microsoft Outlook RCE', asset: 'Employee Portal', ip: '10.0.5.34', criticality: 'Medium', cvss: '7.5', exploit: 'Possible', exposure: 'Internal', score: 56, days: 40, remediation: 'Plan' },
  { priority: 'P2', cve: 'CVE-2022-22965', title: 'Spring4Shell', asset: 'HR Application', ip: '10.0.6.12', criticality: 'Medium', cvss: '9.1', exploit: 'Not Seen', exposure: 'Internal', score: 52, days: 62, remediation: 'Plan' },
  { priority: 'P3', cve: 'CVE-2023-38545', title: 'Adobe ColdFusion RCE', asset: 'Dev Server', ip: '10.0.8.77', criticality: 'Low', cvss: '9.8', exploit: 'Not Seen', exposure: 'Internal', score: 28, days: 90, remediation: 'Monitor' },
];

const statCards = [
  { label: 'Open Vulnerabilities', value: '1,248', change: '↑ 18%', detail: 'vs last month', tone: 'red', trend: 'negative', icon: Bug },
  { label: 'Critical', value: '204', change: '↑ 12%', detail: 'vs last month', tone: 'red', trend: 'negative', icon: AlertTriangle },
  { label: 'Exploited in the Wild', value: '89', change: '↑ 41%', detail: 'vs last month', tone: 'red', trend: 'negative', icon: Crosshair },
  { label: 'High-Risk Assets Affected', value: '86', change: '↑ 6%', detail: 'vs last month', tone: 'blue', trend: 'negative', icon: Server },
  { label: 'Average Days Open', value: '32', change: '↓ 18%', detail: 'vs last month', tone: 'blue', trend: 'positive', icon: Clock3 },
];

const pipelineSteps = [
  { title: '1. Import Data', lineA: 'CSV • API • Scanner', lineB: '2,842 records' },
  { title: '2. Validate & Normalize', lineA: 'Invalid rows: 12', lineB: '(99.6% valid)' },
  { title: '3. Enrich with CVE/CVSS', lineA: 'Mapped: 2,830', lineB: 'Unmapped: 12' },
  { title: '4. Exploit Intelligence', lineA: 'CISA KEV • Threat Feeds', lineB: '89 actively exploited' },
  { title: '5. Link to Assets', lineA: 'Matched: 2,817', lineB: 'Unmatched: 25' },
  { title: '6. Recalculate Priority', lineA: 'Last run: 15 mins ago', lineB: 'Next run: in 45 mins' },
];

function PageIntro({
  onNav,
  notify,
  onAdd,
}: {
  onNav?: (id: string) => void;
  notify: (message: string) => void;
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
          <span>Vulnerabilities</span>
        </nav>
        <h1>Vulnerabilities</h1>
        <p>Identify, prioritize, and remediate vulnerabilities using business context and real-time threat intelligence.</p>
      </div>
      <div className="sc-header-actions">
        <p>
          TURN VULNERABILITIES<br />
          INTO LOWER RISK<br />
          CONTEXT-DRIVEN TRIAGE
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="sc-button" onClick={() => notify('CSV import template prepared')}>
            <Download size={14} /> Import CSV
          </button>
          <button className="sc-button sc-button-primary add-control" onClick={onAdd}>
            <Plus size={16} /> Add Finding
          </button>
          <button className="sc-button" onClick={() => notify('Vulnerabilities report export started')}>
            <Upload size={14} /> Export
          </button>
        </div>
      </div>
    </header>
  );
}

function Stats() {
  return (
    <section className="stats-grid five">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            className="stat-card"
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 * index }}
          >
            <div className={`stat-icon ${stat.tone}`}>
              <Icon size={25} />
            </div>
            <div className="stat-copy">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small className={stat.trend}>{stat.change}</small>
              <em>{stat.detail}</em>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}

function Pipeline() {
  return (
    <motion.section
      className="pipeline"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="pipeline-head">
        <strong>Data Ingestion &amp; Enrichment Pipeline</strong>
        <p>
          From raw data to prioritized<br />
          vulnerabilities
        </p>
      </div>
      {pipelineSteps.map((step) => (
        <div
          className="pipeline-step"
          key={step.title}
          title={`${step.title}\n${step.lineA}\n${step.lineB}`}
        >
          <CheckCircle2 size={14} className="pipeline-step-icon" />
          <div className="pipeline-step-body">
            <b>{step.title}</b>
            <span>{step.lineA}</span>
            <span>{step.lineB}</span>
          </div>
        </div>
      ))}
    </motion.section>
  );
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
  const tabs = [
    'All Findings (1,248)',
    'P0 Critical (204)',
    'P1 High (318)',
    'Exploited (89)',
    'Aging (432)',
    'Remediated (612)',
  ];

  return (
    <section className="finding-controls">
      <div className="finding-tabs">
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
      <div className="filters-row">
        <label>
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search CVE, finding, asset, IP..."
          />
        </label>
        {['Severity', 'CVSS Score', 'Exploit Status', 'Asset Criticality', 'Exposure', 'Business Unit'].map((filter) => (
          <button key={filter} onClick={() => notify(`${filter} filter options toggled`)}>
            {filter} <ChevronDown size={13} />
          </button>
        ))}
        <a
          className="clear-filters"
          onClick={() => {
            setQuery('');
            setActiveTab('All Findings (1,248)');
            notify('Filters reset to default');
          }}
        >
          Clear Filters
        </a>
      </div>
      <div className="filters-row secondary">
        {['Remediation Status', 'Age'].map((filter) => (
          <button key={filter} onClick={() => notify(`${filter} filter options toggled`)}>
            {filter} <ChevronDown size={13} />
          </button>
        ))}
        <button onClick={() => notify('Advanced filter drawer opened')}>
          <ListFilter size={14} /> More Filters
        </button>
      </div>
    </section>
  );
}

function ExploitBadge({ status }: { status: Finding['exploit'] }) {
  const tone =
    status === 'Exploited'
      ? 'exploited'
      : status === 'Known'
      ? 'known'
      : status === 'Likely'
      ? 'likely'
      : status === 'Possible'
      ? 'possible'
      : 'notseen';
  return (
    <span className={`exploit-badge ${tone}`}>
      {status !== 'Not Seen' && <i />}
      {status}
    </span>
  );
}

function RiskBadge({ level }: { level: Finding['criticality'] }) {
  return <span className={`risk-badge ${level.toLowerCase()}`}>{level}</span>;
}

function FindingTable({
  items,
  selected,
  setSelected,
  notify,
}: {
  items: Finding[];
  selected: Finding | null;
  setSelected: (finding: Finding) => void;
  notify: (message: string) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (cve: string) =>
    setChecked((current) =>
      current.includes(cve) ? current.filter((item) => item !== cve) : [...current, cve]
    );

  const allChecked = items.length > 0 && checked.length === items.length;
  const toggleAll = () => {
    if (allChecked) setChecked([]);
    else setChecked(items.map((i) => i.cve));
  };

  return (
    <div className="table-wrap">
      <table className="finding-table">
        <colgroup>
          <col className="check-col" />
          <col className="priority-col" />
          <col className="cve-col" />
          <col className="asset-col" />
          <col className="critical-col" />
          <col className="cvss-col" />
          <col className="exploit-col" />
          <col className="exposure-col" />
          <col className="score-col" />
          <col className="days-col" />
          <col className="remediation-col" />
          <col className="action-col" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <button
                className={`checkbox ${allChecked ? 'checked' : ''}`}
                onClick={toggleAll}
                aria-label="Select all findings"
              />
            </th>
            <th>Priority</th>
            <th>CVE / Finding</th>
            <th>Asset</th>
            <th>Criticality</th>
            <th>CVSS</th>
            <th>Exploit Status</th>
            <th>Exposure</th>
            <th>Priority Score</th>
            <th>Days Open</th>
            <th>Remediation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((finding, index) => (
            <motion.tr
              key={finding.cve}
              className={selected?.cve === finding.cve ? 'selected' : ''}
              onClick={() => setSelected(finding)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(index * 0.025, 0.2) }}
            >
              <td>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(finding.cve);
                  }}
                  className={`checkbox ${checked.includes(finding.cve) ? 'checked' : ''}`}
                  aria-label={`Select ${finding.cve}`}
                />
              </td>
              <td>
                <span className={`priority-badge ${finding.priority.toLowerCase()}`}>
                  {finding.priority}
                </span>
              </td>
              <td>
                <div className="cve-cell">
                  <strong>{finding.cve}</strong>
                  <small>{finding.title}</small>
                </div>
              </td>
              <td>
                <div className="cve-cell">
                  <b>{finding.asset}</b>
                  <small>{finding.ip}</small>
                </div>
              </td>
              <td>
                <RiskBadge level={finding.criticality} />
              </td>
              <td>
                <b className="cvss">{finding.cvss}</b>
              </td>
              <td>
                <ExploitBadge status={finding.exploit} />
              </td>
              <td className={finding.exposure === 'Internet' ? 'exposure-net' : ''}>
                {finding.exposure}
              </td>
              <td>
                <b
                  className={`score ${
                    finding.score >= 80 ? 'danger' : finding.score >= 50 ? 'warn' : 'safe'
                  }`}
                >
                  {finding.score}
                </b>
              </td>
              <td>{finding.days}</td>
              <td>
                <button
                  className={`remediation-btn ${finding.remediation.replace(' ', '').toLowerCase()}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    notify(`${finding.remediation} initiated for ${finding.cve}`);
                  }}
                >
                  {finding.remediation}
                </button>
              </td>
              <td>
                <button
                  className="more"
                  onClick={(event) => {
                    event.stopPropagation();
                    notify(`Quick actions for ${finding.cve}`);
                  }}
                  aria-label={`More options for ${finding.cve}`}
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
          <span>No matching findings found for current filters.</span>
        </div>
      )}
    </div>
  );
}

function Pagination() {
  const [page, setPage] = useState(1);
  const pages: (number | string)[] = [1, 2, 3, 4, 5, '…', 156];
  return (
    <div className="pagination">
      <span>Showing 1–8 of 1,248 findings</span>
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
          onClick={() => setPage(Math.min(156, page + 1))}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function Insights({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="insights-grid">
      <div className="analytics-panel">
        <h3>Vulnerabilitiey Insights</h3>
        <h4 className="sub-heading">Vulnerabilities by Severity</h4>
        <div className="bar-chart">
          <div className="bars">
            {[
              { n: 204, h: 40, c: '#ef334b', l: 'Critical' },
              { n: 318, h: 62, c: '#ff722d', l: 'High' },
              { n: 426, h: 84, c: '#ffb52e', l: 'Medium' },
              { n: 300, h: 58, c: '#04ca93', l: 'Low' },
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
        <h3>Exploit Status Distribution</h3>
        <div className="chart-content">
          <div className="donut exploit">
            <div>
              <strong>1,248</strong>
              <span>Total</span>
            </div>
          </div>
          <div className="chart-legend exploit-legend">
            {[
              ['Exploited', '89', '(7%)'],
              ['Known', '312', '(25%)'],
              ['Possible', '428', '(34%)'],
              ['Not Seen', '419', '(34%)'],
            ].map(([label, count, pct], index) => (
              <div key={label}>
                <i className={`dot e${index}`} />
                <span>{label}</span>
                <b>{count}</b>
                <em>{pct}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="analytics-panel">
        <div className="section-title">
          <h3>Recent Ingestion Activity</h3>
          <button onClick={() => notify('Showing complete ingestion activity feed')}>
            View All <ChevronRight size={12} />
          </button>
        </div>
        <div className="timeline ingestion">
          <div className="red">
            <i />
            <span>15 mins ago</span>
            <b>
              Vulnerability scan completed
              <small>2,842 findings (12 new)</small>
            </b>
          </div>
          <div className="orange">
            <i />
            <span>1 hour ago</span>
            <b>
              CISA KEV feed updated
              <small>+3 exploited vulnerabilities</small>
            </b>
          </div>
          <div className="blue">
            <i />
            <span>3 hours ago</span>
            <b>
              Qualys connector synced
              <small>1,156 findings processed</small>
            </b>
          </div>
        </div>
      </div>
      <div className="analytics-panel freshness">
        <h3>Data Freshness</h3>
        <div className="freshness-list">
          <div>
            <CheckCircle2 size={15} />
            <div>
              <b>Vulnerability Scanners</b>
              <span>12 mins ago</span>
            </div>
          </div>
          <div>
            <CheckCircle2 size={15} />
            <div>
              <b>Threat Intelligence</b>
              <span>25 mins ago</span>
            </div>
          </div>
          <div>
            <CheckCircle2 size={15} />
            <div>
              <b>CISA KEV Feed</b>
              <span>Active</span>
            </div>
          </div>
          <div>
            <CheckCircle2 size={15} />
            <div>
              <b>Asset Inventory</b>
              <span>12 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskModelBar({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="risk-model-bar">
      <span>
        <i /> Risk model updated 15 minutes ago
      </span>
      <a onClick={() => notify('Risk model recalculation triggered')}>Run Now</a>
    </div>
  );
}

function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="gauge-wrap breakdown">
      <div
        className="gauge"
        style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}
      >
        <div>
          <strong>{score}</strong>
          <span>/100</span>
        </div>
      </div>
      <span className="priority-label">
        P0 - Critical<small>Top 1% of findings</small>
      </span>
    </div>
  );
}

function DetailPanel({
  finding,
  onClose,
  notify,
  onNav,
}: {
  finding: Finding;
  onClose: () => void;
  notify: (message: string) => void;
  onNav?: (id: string) => void;
}) {
  const [tab, setTab] = useState('Overview');
  const tabs = ['Overview', 'Technical Details', 'Affected Assets (1)', 'Timeline'];

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
          <span className="bug">
            <Bug size={24} />
          </span>
          <div>
            <h2>{finding.cve}</h2>
            <p>
              {finding.title} {finding.cve === 'CVE-2024-3094' ? '(Supply Chain)' : ''}
            </p>
          </div>
        </div>
        <div className="detail-head-badges">
          <span className={`priority-badge ${finding.priority.toLowerCase()}`}>
            {finding.priority}
          </span>
          <span className="exploited-pill">
            {finding.exploit === 'Exploited' ? 'Exploited' : finding.exploit}
          </span>
        </div>
        <button className="panel-close" onClick={onClose} aria-label="Close details panel">
          <X size={17} />
        </button>
      </div>
      <div className="detail-tabs cve-tabs">
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
              <h3>{tab.replace(' (1)', '')}</h3>
              <p>Detailed {tab.toLowerCase()} for {finding.cve}.</p>
              <button onClick={() => setTab('Overview')}>Back to overview</button>
            </div>
          ) : (
            <>
              <section className="summary-section">
                <h3>Finding Summary</h3>
                <p>
                  A critical security vulnerability allows remote execution of arbitrary code or denial of
                  service. Actively tracked by intelligence feeds and correlated across infrastructure.
                </p>
                <div className="summary-grid">
                  <div>
                    <span>CVE ID</span>
                    <a onClick={() => notify(`Opening advisory for ${finding.cve}`)}>
                      {finding.cve} <ExternalLink size={11} />
                    </a>
                  </div>
                  <div>
                    <span>CVSS v3.1</span>
                    <b className="cvss-value">
                      {finding.cvss} <em>{finding.cvss} ({finding.criticality})</em>
                    </b>
                  </div>
                  <div>
                    <span>Exploit Status</span>
                    <b className="exploit-inline">
                      <Crosshair size={13} /> {finding.exploit === 'Exploited' ? 'Actively Exploited' : finding.exploit}
                    </b>
                  </div>
                  <div>
                    <span>CISA KEV</span>
                    <b className="kev-inline">
                      <CheckCircle2 size={13} /> Yes
                    </b>
                  </div>
                </div>
              </section>
              <section className="affected-section">
                <h3>Affected Asset</h3>
                <div className="affected-card">
                  <span className="affected-icon">
                    <Server size={20} />
                  </span>
                  <div>
                    <div className="affected-top">
                      <b>{finding.asset}</b>
                      <RiskBadge level={finding.criticality} />
                    </div>
                    <small>
                      {finding.ip} • Web Server <i>|</i> Finance
                    </small>
                    <em>
                      <Globe2 size={12} /> {finding.exposure === 'Internet' ? 'Internet Facing' : 'Internal Network'}
                    </em>
                  </div>
                </div>
              </section>
              <section className="breakdown-section">
                <h3>Priority Score Breakdown</h3>
                <div className="risk-summary">
                  <ScoreGauge score={finding.score} />
                  <div className="risk-factors">
                    {[
                      ['CVSS (7.5)', 88, 'red', '30'],
                      ['Exploitability', 74, 'red', '25'],
                      ['Asset Criticality', 58, 'orange', '20'],
                      ['Exposure (Internet)', 45, 'blue', '15'],
                      ['Threat Intel (KEV)', 26, 'blue', '8'],
                      ['Control Gap', 16, 'blue', '5'],
                    ].map(([name, width, tone, value]) => (
                      <div className="factor" key={name as string}>
                        <span>{name}</span>
                        <i>
                          <b className={tone as string} style={{ width: `${width}%` }} />
                        </i>
                        <em className="neutral">{value}</em>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <section className="recommend-section">
                <div className="recommend-card">
                  <AlertTriangle size={20} />
                  <div>
                    <span>Recommended Action</span>
                    <strong>Patch immediately</strong>
                    <p>Actively exploited. High business impact.</p>
                  </div>
                </div>
                <div className="detail-actions">
                  <button className="primary-mini" onClick={() => notify(`Remediation workflow initiated for ${finding.cve}`)}>
                    Remediate
                  </button>
                  <button onClick={() => notify(`Assigned ${finding.cve} to SecOps lead`)}>
                    <UserRound size={13} /> Assign
                  </button>
                  <button onClick={() => notify(`${finding.cve} marked as remediated`)}>
                    <CheckCircle2 size={13} /> Mark Remediated
                  </button>
                </div>
                <button
                  className="view-asset"
                  onClick={() => {
                    if (onNav) onNav('assets');
                    else notify(`Viewing asset ${finding.asset}`);
                  }}
                >
                  View Asset <ChevronsRight size={15} />
                </button>
              </section>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.aside>
  );
}

function AddFindingModal({
  close,
  onAdd,
}: {
  close: () => void;
  onAdd: (finding: Finding) => void;
}) {
  const [cve, setCve] = useState('');
  const [criticality, setCriticality] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Critical');
  const [asset, setAsset] = useState('Payment Gateway');
  const [desc, setDesc] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanCve = cve.trim() || 'CVE-2024-9999';
    const newFinding: Finding = {
      priority: criticality === 'Critical' ? 'P0' : criticality === 'High' ? 'P1' : 'P2',
      cve: cleanCve,
      title: desc.trim() || `${cleanCve} Remote Vulnerability`,
      asset,
      ip: '10.0.9.45',
      criticality,
      cvss: criticality === 'Critical' ? '9.8' : criticality === 'High' ? '7.9' : '5.4',
      exploit: 'Exploited',
      exposure: 'Internet',
      score: criticality === 'Critical' ? 95 : criticality === 'High' ? 76 : 52,
      days: 1,
      remediation: 'Patch Now',
    };
    onAdd(newFinding);
    close();
  };

  return (
    <motion.div
      className="vuln-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        className="vuln-modal"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="vuln-modal-title">
          <div>
            <span>
              <Bug size={20} />
            </span>
            <h2>Add Finding</h2>
          </div>
          <button type="button" onClick={close} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        <p>Register a new vulnerability finding into the management queue.</p>
        <label>
          CVE ID
          <input
            autoFocus
            required
            value={cve}
            onChange={(event) => setCve(event.target.value)}
            placeholder="e.g. CVE-2024-3094"
          />
        </label>
        <div className="vuln-modal-fields">
          <label>
            Severity
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value as 'Critical' | 'High' | 'Medium' | 'Low')}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label>
            Affected asset
            <select value={asset} onChange={(e) => setAsset(e.target.value)}>
              <option value="Payment Gateway">Payment Gateway</option>
              <option value="Firewall-01">Firewall-01</option>
              <option value="App Server 01">App Server 01</option>
              <option value="Build Server">Build Server</option>
              <option value="Web Server 02">Web Server 02</option>
            </select>
          </label>
        </div>
        <label>
          Description
          <input
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            placeholder="Short description of the finding"
          />
        </label>
        <div className="vuln-modal-actions">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary" type="submit">
            <Plus size={16} /> Add Finding
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export interface VulnerabilitiesViewProps {
  onNav?: (id: string) => void;
  externalNotify?: (message: string) => void;
}

export function VulnerabilitiesView({ onNav, externalNotify }: VulnerabilitiesViewProps) {
  const [findingsList, setFindingsList] = useState<Finding[]>(initialFindings);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Findings (1,248)');
  const [selected, setSelected] = useState<Finding | null>(findingsList[0]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    if (externalNotify) externalNotify(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const filtered = useMemo(() => {
    return findingsList.filter((finding) => {
      // Tab filter
      if (activeTab === 'P0 Critical (204)' && finding.priority !== 'P0') return false;
      if (activeTab === 'P1 High (318)' && finding.priority !== 'P1') return false;
      if (activeTab === 'Exploited (89)' && finding.exploit !== 'Exploited') return false;
      if (activeTab === 'Aging (432)' && finding.days < 25) return false;

      // Text query
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        finding.cve.toLowerCase().includes(q) ||
        finding.title.toLowerCase().includes(q) ||
        finding.asset.toLowerCase().includes(q) ||
        finding.ip.toLowerCase().includes(q)
      );
    });
  }, [findingsList, query, activeTab]);

  const handleAddFinding = (newFinding: Finding) => {
    setFindingsList((current) => [newFinding, ...current]);
    setSelected(newFinding);
    notify(`New finding ${newFinding.cve} registered successfully.`);
  };

  return (
    <main
      className={`sc-content vuln-page ${selected ? 'with-detail' : ''}`}
      id="vulnerabilities-content"
      tabIndex={-1}
    >
      <PageIntro onNav={onNav} notify={notify} onAdd={() => setShowModal(true)} />
      <div className="workspace">
        <Stats />
        <Pipeline />
        <FilterBar
          query={query}
          setQuery={setQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notify={notify}
        />
        <FindingTable
          items={filtered}
          selected={selected}
          setSelected={setSelected}
          notify={notify}
        />
        <Pagination />
        <Insights notify={notify} />
      </div>

      <AnimatePresence>
        {selected && (
          <DetailPanel
            finding={selected}
            onClose={() => setSelected(null)}
            notify={notify}
            onNav={onNav}
          />
        )}
      </AnimatePresence>

      {selected && (
        <div className="risk-model-slot">
          <RiskModelBar notify={notify} />
        </div>
      )}

      {!selected && (
        <button
          className="reopen-panel"
          onClick={() => setSelected(findingsList[0])}
          aria-label="Reopen finding details panel"
        >
          <Bug size={16} /> Finding details
        </button>
      )}

      <AnimatePresence>
        {showModal && (
          <AddFindingModal close={() => setShowModal(false)} onAdd={handleAddFinding} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="vuln-toast"
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

export default VulnerabilitiesView;
