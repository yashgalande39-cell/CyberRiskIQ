import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  KeyRound,
  Network,
  Play,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import '../../styles/integrations.css';

export interface IntegrationsViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

export type IntegrationItem = {
  id: string;
  name: string;
  subtitle: string;
  category: 'Threat Intelligence' | 'Cloud' | 'Asset Data' | 'General';
  badge: 'REAL DATA' | 'DEMO DATA' | '';
  state: 'Connected' | 'Demo Data (File Import)' | 'Demo Data (MVP)' | 'Ready to Configure';
  fieldA: string;
  valueA: string;
  fieldB: string;
  valueB: string;
  fieldC: string;
  valueC: string;
  tone: string;
  mark: string;
  primary: string;
  secondary: string;
};

const defaultIntegrations: IntegrationItem[] = [
  {
    id: 'nvd',
    name: 'NVD',
    subtitle: 'National Vulnerability Database',
    category: 'Threat Intelligence',
    badge: 'REAL DATA',
    state: 'Connected',
    fieldA: 'Last Sync',
    valueA: 'Jun 15, 2024, 02:30 AM',
    fieldB: 'Records',
    valueB: '1,24,532 CVEs',
    fieldC: 'Next Sync',
    valueC: 'In 10 hours',
    tone: 'indigo',
    mark: 'NVD',
    primary: 'Sync Now',
    secondary: 'View Logs',
  },
  {
    id: 'cisa',
    name: 'CISA KEV',
    subtitle: 'Known Exploited Vulnerabilities',
    category: 'Threat Intelligence',
    badge: 'REAL DATA',
    state: 'Connected',
    fieldA: 'Last Sync',
    valueA: 'Jun 14, 2024, 11:20 PM',
    fieldB: 'Records',
    valueB: '1,156 records',
    fieldC: 'Next Sync',
    valueC: 'In 6 days (weekly)',
    tone: 'steel',
    mark: '◎',
    primary: 'Sync Now',
    secondary: 'View Logs',
  },
  {
    id: 'scanner',
    name: 'Vulnerability Scanner',
    subtitle: 'Nessus / Qualys / OpenVAS',
    category: 'Threat Intelligence',
    badge: '',
    state: 'Connected',
    fieldA: 'Last Sync',
    valueA: 'Jun 15, 2024, 09:15 AM',
    fieldB: 'Records',
    valueB: '12,842 findings',
    fieldC: 'Next Sync',
    valueC: 'In 1 day',
    tone: 'red',
    mark: '◉',
    primary: 'Sync Now',
    secondary: 'Configure',
  },
  {
    id: 'assets',
    name: 'Asset Inventory',
    subtitle: 'CSV / API Import',
    category: 'Asset Data',
    badge: '',
    state: 'Connected',
    fieldA: 'Last Sync',
    valueA: 'Jun 15, 2024, 08:40 AM',
    fieldB: 'Records',
    valueB: '2,415 assets',
    fieldC: 'Next Sync',
    valueC: 'In 1 day',
    tone: 'green',
    mark: '▤',
    primary: 'Import File',
    secondary: 'Configure',
  },
  {
    id: 'siem',
    name: 'SIEM / EDR',
    subtitle: 'SentinelOne / CrowdStrike / Splunk',
    category: 'Cloud',
    badge: 'DEMO DATA',
    state: 'Demo Data (File Import)',
    fieldA: 'Last Import',
    valueA: 'Jun 14, 2024, 06:10 PM',
    fieldB: 'Records',
    valueB: '5,284 events',
    fieldC: 'Next Import',
    valueC: 'Manual / Scheduled',
    tone: 'violet',
    mark: '|||',
    primary: 'Import File',
    secondary: 'Configure',
  },
  {
    id: 'cloud',
    name: 'Cloud Security Posture',
    subtitle: 'AWS / Azure / GCP',
    category: 'Cloud',
    badge: 'DEMO DATA',
    state: 'Demo Data (MVP)',
    fieldA: 'Last Sync',
    valueA: 'Jun 14, 2024, 04:22 PM',
    fieldB: 'Records',
    valueB: '3,612 resources',
    fieldC: 'Next Sync',
    valueC: 'In 2 days',
    tone: 'cloud',
    mark: '☁',
    primary: 'Sync Now',
    secondary: 'Configure',
  },
  {
    id: 'manual',
    name: 'Manual Data Upload',
    subtitle: 'CSV / Excel',
    category: 'General',
    badge: '',
    state: 'Ready to Configure',
    fieldA: '',
    valueA: 'Upload and map your data files',
    fieldB: '',
    valueB: '',
    fieldC: '',
    valueC: '',
    tone: 'blue',
    mark: '↥',
    primary: 'Upload File',
    secondary: '',
  },
];

const ingestionRows = [
  { id: '1', time: 'Jun 15, 2024 10:24:11', source: 'NVD', event: 'Sync completed', records: '12,542', enrichment: 'CVSS + Threat Intel', status: 'Success' },
  { id: '2', time: 'Jun 15, 2024 09:15:03', source: 'Nessus', event: 'Import completed', records: '2,184', enrichment: 'Asset mapping', status: 'Success' },
  { id: '3', time: 'Jun 14, 2024 06:10:45', source: 'CrowdStrike (Demo)', event: 'File import', records: '5,284', enrichment: 'Event parsing', status: 'Success' },
  { id: '4', time: 'Jun 14, 2024 04:22:31', source: 'AWS (Demo)', event: 'Sync completed', records: '3,612', enrichment: 'Resource mapping', status: 'Warning' },
  { id: '5', time: 'Jun 14, 2024 11:20:18', source: 'CISA KEV', event: 'Sync completed', records: '156', enrichment: 'Enriched with NVD', status: 'Success' },
];

const supported = [
  ['NVD', 'Real Data', 'nvd'],
  ['CISA KEV', 'Real Data', 'cisa'],
  ['Nessus', 'Demo / API', 'nessus'],
  ['Qualys', 'Demo / API', 'qualys'],
  ['CrowdStrike', 'Demo (File)', 'crowd'],
  ['AWS', 'Demo / API', 'aws'],
  ['Azure', 'Demo / API', 'azure'],
  ['Google Cloud', 'Demo / API', 'gcp'],
  ['ServiceNow', 'Planned', 'service'],
  ['Jira', 'Planned', 'jira'],
];

const tabs = ['Overview', 'Connected Sources', 'Data Mapping', 'API Keys', 'Import History', 'Webhooks', 'Settings'];

export default function IntegrationsView({ onNav: _onNav, externalNotify }: IntegrationsViewProps) {
  const [items, setItems] = useState<IntegrationItem[]>(defaultIntegrations);
  const [activeTab, setActiveTab] = useState('Overview');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [logsModalTarget, setLogsModalTarget] = useState<string | null>(null);
  const [apiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  const notify = (msg: string, kind: 'ok' | 'info' = 'ok') => {
    setToast(msg);
    if (externalNotify) externalNotify(msg, kind);
    window.setTimeout(() => setToast(''), 2500);
  };

  const handleSyncNow = (name: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setItems((prev) =>
      prev.map((item) =>
        item.name === name
          ? { ...item, valueA: `Today, ${timestamp}` }
          : item
      )
    );
    notify(`Synchronized ${name} successfully`);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'Asset_ID,Hostname,IP_Address,OS,Criticality,Owner,Environment,Business_Unit\n' +
      'AST-001,srv-app-prod-01,10.0.4.12,Ubuntu 22.04 LTS,Critical,Infra Team,Production,Payment Services\n' +
      'AST-002,db-primary-main,10.0.5.20,PostgreSQL 15 / RHEL 9,Critical,Database Team,Production,Core Banking\n' +
      'AST-003,gw-api-edge,198.51.100.1,Alpine Linux,High,Security Team,Edge,Customer Portal\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cyberriskiq-integration-mapping-template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    notify('Downloaded CSV mapping template');
  };

  const handleTestAllConnections = () => {
    notify('Testing all 6 active connections...');
    window.setTimeout(() => {
      notify('All 6 integrations verified healthy (92% score)', 'ok');
    }, 1200);
  };

  const filteredIntegrations = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        categoryFilter === 'All Categories' || item.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [items, searchQuery, categoryFilter]);

  const connectedCount = useMemo(() => {
    return items.filter((i) => i.state === 'Connected' || i.state.startsWith('Demo Data')).length;
  }, [items]);

  return (
    <div className="integrations-page">
      {/* Standard Header matching Security Controls */}
      <header className="sc-page-header">
        <div>
          <p className="sc-breadcrumb">Home &gt; Data &gt; <span>Integrations</span></p>
          <h1>Integrations &amp; Data Connectors</h1>
          <p>Connect your telemetry, scanners, and asset repositories to keep cyber risk intelligence continuously up to date.</p>
        </div>
        <div className="sc-header-actions">
          <div className="sc-motto">
            <span>REAL DATA</span>
            <span>STRONGER INSIGHTS</span>
            <span>A SAFER TOMORROW</span>
          </div>
          <button
            type="button"
            className="sc-action-btn"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={16} /> Add Integration
          </button>
        </div>
      </header>

      {/* Standard Tabs matching Security Controls */}
      <nav className="detail-tabs" style={{ marginBottom: '14px', borderBottom: '1px solid var(--sc-border, #06314a)' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'is-active' : ''}
            onClick={() => {
              setActiveTab(tab);
              if (tab !== 'Overview') notify(`${tab} view loaded`);
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="center-column">
          {/* Summary Cards */}
          <section className="summary-cards">
            <motion.div
              className="summary-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <span className="summary-icon blue">
                <Database size={24} />
              </span>
              <div>
                <small>Connected Sources</small>
                <strong>{connectedCount} / 10</strong>
                <em className="green">↑ 2 new this month</em>
              </div>
            </motion.div>

            <motion.div
              className="summary-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="summary-icon green">
                <RefreshCw size={24} />
              </span>
              <div>
                <small>Data Sources Syncing</small>
                <strong>4</strong>
                <em className="muted">2 scheduled, 2 manual</em>
              </div>
            </motion.div>

            <motion.div
              className="summary-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <span className="summary-icon purple">
                <FileSpreadsheet size={24} />
              </span>
              <div>
                <small>Records Ingested</small>
                <strong>2,48,532</strong>
                <em className="green">↑ 28% vs last week</em>
              </div>
            </motion.div>

            <motion.div
              className="summary-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="summary-icon teal">
                <Timer size={24} />
              </span>
              <div>
                <small>Last Successful Sync</small>
                <strong className="date-value">Jun 15, 2024, 10:24 AM</strong>
                <em className="green">
                  <CheckCircle2 size={12} /> All systems operational
                </em>
              </div>
            </motion.div>
          </section>

          {/* Data Pipeline */}
          <section className="panel pipeline">
            <h2>Data Pipeline</h2>
            <p>Your data goes through a secure pipeline to deliver accurate and enriched risk intelligence.</p>

            <div className="pipeline-body">
              <div className="stages">
                {[
                  { icon: Database, title: 'Data Sources', sub: 'Real-time / Scheduled', detail: 'API | CSV | Feeds', tone: 'blue' },
                  { icon: FileText, title: 'Ingestion', sub: 'Validate & Parse', detail: 'Active', tone: 'cyan' },
                  { icon: Settings, title: 'Normalization', sub: 'Standardize & Clean', detail: 'Active', tone: 'teal' },
                  { icon: Network, title: 'Enrichment', sub: 'CVE, Threat Intel, Context', detail: 'Active', tone: 'purple' },
                  { icon: BarChart3, title: 'Risk Engine', sub: 'Calculate Risk & Impact', detail: 'Active', tone: 'blue' },
                ].map((stage, index, arr) => {
                  const Icon = stage.icon;
                  return (
                    <div className="stage-chain" key={stage.title}>
                      <div className="stage">
                        <span className={`stage-icon ${stage.tone}`}>
                          <Icon size={22} />
                        </span>
                        <b>{stage.title}</b>
                        <small>{stage.sub}</small>
                        <em className={index === 0 ? 'source-detail' : 'active-detail'}>
                          {index > 0 && '✓ '}
                          {stage.detail}
                        </em>
                      </div>
                      {index < arr.length - 1 && (
                        <div className="stage-arrow">
                          <i />
                          <ChevronRight size={13} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="latency">
                <Timer size={30} />
                <div>
                  <strong>&lt; 2 minutes</strong>
                  <span>Average ingestion time</span>
                  <small>From data to insights</small>
                </div>
              </div>
            </div>
          </section>

          {/* Active Connections */}
          <section className="panel connections">
            <div className="connections-head">
              <div>
                <h2>
                  Active Connections <span className="info-dot">i</span>
                </h2>
                <p>
                  Manage your data sources and integrations. Real data where available. Demo data <b>clearly labeled.</b>
                </p>
              </div>

              <div className="connection-filters">
                <label>
                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                  >
                    <option>All Categories</option>
                    <option>Threat Intelligence</option>
                    <option>Cloud</option>
                    <option>Asset Data</option>
                  </select>
                  <ChevronDown size={13} />
                </label>

                <label className="connection-search">
                  <Search size={14} />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search integrations..."
                  />
                </label>
              </div>
            </div>

            <div className="integration-grid">
              {filteredIntegrations.map((integration) => {
                const connected = integration.state === 'Connected';
                const ready = integration.state === 'Ready to Configure';

                return (
                  <article
                    className={`integration-card ${ready ? 'ready' : ''}`}
                    key={integration.id || integration.name}
                  >
                    <div>
                      <div className="integration-title">
                        <span className={`integration-mark ${integration.tone}`}>
                          {integration.mark}
                        </span>
                        <div>
                          <h3 title={integration.name}>{integration.name}</h3>
                          <p title={integration.subtitle}>{integration.subtitle}</p>
                        </div>
                        {integration.badge && (
                          <span
                            className={`data-badge ${
                              integration.badge === 'REAL DATA' ? 'real' : 'demo'
                            }`}
                          >
                            {integration.badge}
                          </span>
                        )}
                        {!integration.badge && !ready && (
                          <button
                            type="button"
                            className="mini-settings"
                            onClick={() => notify(`Settings for ${integration.name}`)}
                            title="Configuration"
                          >
                            <Settings size={14} />
                          </button>
                        )}
                      </div>

                      <div
                        className={`connection-state ${
                          connected
                            ? 'connected'
                            : ready
                            ? 'ready-state'
                            : 'demo-state'
                        }`}
                      >
                        <i />
                        {integration.state}
                      </div>

                      {ready ? (
                        <div className="ready-copy">{integration.valueA}</div>
                      ) : (
                        <dl className="integration-meta">
                          <div>
                            <dt>{integration.fieldA}</dt>
                            <dd title={integration.valueA}>{integration.valueA}</dd>
                          </div>
                          <div>
                            <dt>{integration.fieldB}</dt>
                            <dd title={integration.valueB}>{integration.valueB}</dd>
                          </div>
                          <div>
                            <dt>{integration.fieldC}</dt>
                            <dd title={integration.valueC}>{integration.valueC}</dd>
                          </div>
                        </dl>
                      )}
                    </div>

                    <div className="integration-actions">
                      <button
                        type="button"
                        onClick={() => {
                          if (integration.primary === 'Sync Now') {
                            handleSyncNow(integration.name);
                          } else if (integration.primary === 'Import File' || integration.primary === 'Upload File') {
                            setAddModalOpen(true);
                          } else {
                            notify(`${integration.primary}: ${integration.name}`);
                          }
                        }}
                      >
                        {integration.primary}
                      </button>
                      {integration.secondary && (
                        <button
                          type="button"
                          onClick={() => {
                            if (integration.secondary === 'View Logs') {
                              setLogsModalTarget(integration.name);
                            } else {
                              notify(`Configure ${integration.name}`);
                            }
                          }}
                        >
                          {integration.secondary}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}

              {searchQuery === '' && (
                <article className="enterprise-card">
                  <div>
                    <h3>Explore Enterprise Integrations</h3>
                    <p>Connect your tools via REST APIs, webhooks and 3rd party integrations.</p>
                    <ul>
                      <li>
                        <i />
                        <span>SIEM / EDR (Live API)</span>
                        <b>Phase 3</b>
                      </li>
                      <li>
                        <i />
                        <span>Cloud Providers (Live API)</span>
                        <b>Phase 3</b>
                      </li>
                      <li>
                        <i />
                        <span>ITSM / CMDB</span>
                        <b>Planned</b>
                      </li>
                      <li>
                        <i />
                        <span>Email Security / M365</span>
                        <b>Planned</b>
                      </li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => notify('Enterprise integration catalog opened')}
                  >
                    View All Integrations <ArrowRight size={13} />
                  </button>
                </article>
              )}
            </div>
          </section>

          {/* Ingestion Activity */}
          <section className="panel ingestion">
            <h2>Recent Ingestion Activity</h2>
            <div className="ingestion-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '35px' }}>#</th>
                    <th style={{ width: '150px' }}>Timestamp</th>
                    <th style={{ width: '180px' }}>Source</th>
                    <th style={{ width: '140px' }}>Event</th>
                    <th style={{ width: '100px' }}>Records</th>
                    <th style={{ width: '170px' }}>Enrichment</th>
                    <th style={{ width: '100px' }}>Status</th>
                    <th style={{ width: '70px' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {ingestionRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.time}</td>
                      <td className={row.source.includes('Demo') ? 'demo-source' : ''}>
                        {row.source}
                      </td>
                      <td>{row.event}</td>
                      <td>{row.records}</td>
                      <td>{row.enrichment}</td>
                      <td>
                        <span className={`table-status ${row.status.toLowerCase()}`}>
                          <i />
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setLogsModalTarget(row.source)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Grid: Quality & Architecture */}
          <div className="bottom-grid">
            <section className="panel quality">
              <h2>Data Quality & Coverage</h2>
              <div className="quality-row">
                {[
                  { icon: Server, title: 'Assets', value: '78%', detail: '2,415 / 3,100 expected', color: '#20d2b0' },
                  { icon: ShieldCheck, title: 'Vulnerabilities', value: '65%', detail: '12,842 findings', color: '#ff9d32' },
                  { icon: Network, title: 'Threat Intelligence', value: '82%', detail: 'Good coverage', color: '#22e6a4' },
                  { icon: Settings, title: 'Security Controls', value: '54%', detail: 'More data recommended', color: '#ff8a3c' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="quality-item" key={item.title}>
                      <div className="quality-name">
                        <span>
                          <Icon size={14} />
                        </span>
                        <b>{item.title}</b>
                      </div>
                      <div className="quality-progress">
                        <i>
                          <b style={{ width: item.value, background: item.color }} />
                        </i>
                        <strong>{item.value}</strong>
                      </div>
                      <small
                        className={
                          item.title === 'Security Controls'
                            ? 'danger-copy'
                            : item.title === 'Threat Intelligence'
                            ? 'good-copy'
                            : ''
                        }
                      >
                        {item.detail}
                      </small>
                    </div>
                  );
                })}

                <div className="integrity-note">
                  <AlertTriangle size={18} />
                  <p>
                    <b>We never fabricate risk scores.</b>
                    <br />
                    If data is insufficient, the platform will indicate “Insufficient Data” rather than generating an inaccurate risk score.
                  </p>
                </div>
              </div>
            </section>

            <section className="panel architecture">
              <h2>Integration Architecture</h2>
              <div className="architecture-flow">
                {[
                  { icon: Database, top: 'APIs / CSV', bottom: 'Data Sources', tone: 'blue' },
                  { icon: Settings, top: 'Normalization', bottom: 'Parse & Clean', tone: 'cyan' },
                  { icon: Timer, top: 'Entity Linking', bottom: 'CVE Enrichment', tone: 'blue' },
                  { icon: BarChart3, top: 'AI/ML Models', bottom: 'Risk Scoring', tone: 'purple' },
                  { icon: ShieldAlert, top: 'Quantification', bottom: 'Loss Exposure', tone: 'orange' },
                  { icon: FileSpreadsheet, top: 'Financial Impact', bottom: 'Investment ROI', tone: 'green' },
                ].map((item, index, arr) => {
                  const Icon = item.icon;
                  return (
                    <div className="arch-chain" key={item.top}>
                      <div className="arch-item">
                        <span className={item.tone}>
                          <Icon size={16} />
                        </span>
                        <b>{item.top}</b>
                        <small>{item.bottom}</small>
                      </div>
                      {index < arr.length - 1 && <ArrowRight size={12} />}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* Right Rail */}
        <aside className="right-rail">
          {/* Health */}
          <section className="rail-card health">
            <h2>Integration Health</h2>
            <div className="health-top">
              <span>Overall Health</span>
              <div className="health-gauge">
                <div>
                  <b>92%</b>
                  <small>Healthy</small>
                </div>
              </div>
            </div>
            <ul>
              <li>
                <i className="green" />
                <b>6</b>
                <span>Active integrations</span>
              </li>
              <li>
                <i className="orange" />
                <b>1</b>
                <span>Warnings</span>
              </li>
              <li>
                <i className="red" />
                <b>0</b>
                <span>Failed integrations</span>
              </li>
              <li>
                <i className="blue" />
                <b>0</b>
                <span>Stale sources</span>
              </li>
            </ul>
            <button type="button" onClick={() => setHealthModalOpen(true)}>
              View Detailed Health <ArrowRight size={13} />
            </button>
          </section>

          {/* Quick Actions */}
          <section className="rail-card quick-actions">
            <h2>Quick Actions</h2>
            <div>
              <button type="button" onClick={() => setAddModalOpen(true)}>
                <Plus size={15} /> Add Integration
              </button>
              <button type="button" onClick={handleTestAllConnections}>
                <Play size={15} /> Test All Connections
              </button>
              <button type="button" onClick={() => setLogsModalTarget('All Sources')}>
                <FileText size={15} /> View Integration Logs
              </button>
              <button type="button" onClick={() => setApiKeysModalOpen(true)}>
                <KeyRound size={15} /> Manage API Keys
              </button>
              <button type="button" onClick={handleDownloadTemplate}>
                <Download size={15} /> Download Mapping Template
              </button>
            </div>
          </section>

          {/* Supported Integrations */}
          <section className="rail-card supported">
            <h2>Supported Integrations</h2>
            <div className="supported-list">
              {supported.map(([name, state, tone]) => (
                <div key={name}>
                  <span className={`support-mark ${tone}`}>
                    {name === 'Google Cloud' ? 'G' : name.slice(0, 3).toUpperCase()}
                  </span>
                  <b>{name}</b>
                  <em
                    className={
                      state === 'Real Data'
                        ? 'real'
                        : state === 'Planned'
                        ? 'planned'
                        : 'demo'
                    }
                  >
                    {state}
                  </em>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => notify('10+ Integrations supported across APIs, CSV, and feeds')}
            >
              View All <ArrowRight size={13} />
            </button>
          </section>
        </aside>
      </div>

      {/* Add Integration Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <AddModal
            close={() => setAddModalOpen(false)}
            onAdd={(newIntegration) => {
              setItems((prev) => [newIntegration, ...prev]);
              notify(`${newIntegration.name} integration added successfully`);
            }}
          />
        )}
      </AnimatePresence>

      {/* View Logs Modal */}
      <AnimatePresence>
        {logsModalTarget && (
          <LogsModal
            target={logsModalTarget}
            close={() => setLogsModalTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Manage API Keys Modal */}
      <AnimatePresence>
        {apiKeysModalOpen && (
          <ApiKeysModal
            close={() => setApiKeysModalOpen(false)}
            notify={notify}
          />
        )}
      </AnimatePresence>

      {/* Health Diagnostics Modal */}
      <AnimatePresence>
        {healthModalOpen && (
          <HealthModal close={() => setHealthModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* In-page Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Sparkles size={14} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddModal({
  close,
  onAdd,
}: {
  close: () => void;
  onAdd: (item: IntegrationItem) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState('REST API');
  const [category, setCategory] = useState<'Threat Intelligence' | 'Cloud' | 'Asset Data' | 'General'>('Threat Intelligence');
  const [endpoint, setEndpoint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: IntegrationItem = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name || 'Custom Integration',
      subtitle: `${type} · ${category}`,
      category,
      badge: 'REAL DATA',
      state: 'Connected',
      fieldA: 'Last Sync',
      valueA: 'Just now',
      fieldB: 'Endpoint',
      valueB: endpoint || 'https://api.internal/v1',
      fieldC: 'Next Sync',
      valueC: 'In 24 hours',
      tone: 'blue',
      mark: (name || 'CI').slice(0, 3).toUpperCase(),
      primary: 'Sync Now',
      secondary: 'View Logs',
    };
    onAdd(item);
    close();
  };

  return (
    <motion.div
      className="integrations-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        className="integrations-modal"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="modal-head">
          <div>
            <Network size={20} />
            <h2>Add Integration</h2>
          </div>
          <button type="button" onClick={close}>
            <X size={18} />
          </button>
        </div>

        <p>Connect another security data source to CyberRiskIQ.</p>

        <label>
          Integration name
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Microsoft Sentinel, Tenable, Splunk"
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option value="Threat Intelligence">Threat Intelligence</option>
            <option value="Cloud">Cloud Security</option>
            <option value="Asset Data">Asset Management</option>
            <option value="General">General / Other</option>
          </select>
        </label>

        <label>
          Connection type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>REST API</option>
            <option>Webhook</option>
            <option>CSV Upload</option>
            <option>Scheduled Import</option>
          </select>
        </label>

        <label>
          API endpoint or feed URL
          <input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://api.example.com/v1"
          />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary" type="submit">
            <Plus size={15} /> Add Integration
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function LogsModal({ target, close }: { target: string; close: () => void }) {
  const logs = [
    { time: '10:24:11 AM', status: 'Success', message: 'Payload parsed and schema normalized 12,542 records.' },
    { time: '09:15:03 AM', status: 'Success', message: 'Asset mapping correlated 2,184 vulnerabilities.' },
    { time: '06:10:45 AM', status: 'Success', message: 'Ingestion pipeline enriched records with CVE metadata.' },
    { time: '04:22:31 AM', status: 'Notice', message: 'Rate limit backed off 250ms, sync resumed automatically.' },
  ];

  return (
    <motion.div
      className="integrations-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="integrations-modal wide"
        onMouseDown={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="modal-head">
          <div>
            <FileText size={20} />
            <h2>Integration Logs: {target}</h2>
          </div>
          <button type="button" onClick={close}>
            <X size={18} />
          </button>
        </div>
        <p>Live audit trail and synchronization diagnostics for {target}.</p>

        <div className="logs-list">
          {logs.map((log, idx) => (
            <div className="log-entry" key={idx}>
              <div className="log-entry-head">
                <span>{log.time}</span>
                <span className="status">{log.status}</span>
              </div>
              <div className="log-entry-body">{log.message}</div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={close}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ApiKeysModal({ close, notify }: { close: () => void; notify: (m: string) => void }) {
  const keys = [
    { name: 'NVD Ingestion Agent', key: 'criq_live_9f82d14bc4938a1e2049', created: '3 months ago' },
    { name: 'Asset Importer Webhook', key: 'criq_whk_30d91ba8405e3810f22', created: '1 month ago' },
    { name: 'EDR Cloud Connector', key: 'criq_api_77e091bca440182fe811', created: '2 weeks ago' },
  ];

  return (
    <motion.div
      className="integrations-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="integrations-modal wide"
        onMouseDown={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="modal-head">
          <div>
            <KeyRound size={20} />
            <h2>API Key Management</h2>
          </div>
          <button type="button" onClick={close}>
            <X size={18} />
          </button>
        </div>
        <p>Active cryptographic tokens used to transmit data securely into CyberRiskIQ.</p>

        <div className="logs-list">
          {keys.map((k) => (
            <div className="log-entry" key={k.key}>
              <div className="log-entry-head">
                <strong style={{ color: '#fff' }}>{k.name}</strong>
                <span>Created {k.created}</span>
              </div>
              <div className="log-entry-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <code style={{ background: '#02111d', padding: '3px 8px', borderRadius: 4, color: '#38bdf8' }}>
                  {k.key}
                </code>
                <button
                  type="button"
                  style={{ border: '1px solid #1469a4', padding: '3px 8px', borderRadius: 4, background: '#07345b', color: '#fff', fontSize: 10 }}
                  onClick={() => notify(`Copied key for ${k.name}`)}
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={close}>
            Close
          </button>
          <button className="primary" type="button" onClick={() => notify('Generated new API Key token')}>
            <Plus size={14} /> Generate New Key
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HealthModal({ close }: { close: () => void }) {
  const metrics = [
    { label: 'Ingestion Latency', value: '1.2 min', status: 'Optimal' },
    { label: 'Schema Validation Rate', value: '99.98%', status: 'Optimal' },
    { label: 'Threat Intel Sync Health', value: '100%', status: 'Optimal' },
    { label: 'EDR Event Buffer', value: '12% Capacity', status: 'Normal' },
    { label: 'Cloud Audit Logs', value: '0 Disconnects', status: 'Optimal' },
  ];

  return (
    <motion.div
      className="integrations-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="integrations-modal"
        onMouseDown={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="modal-head">
          <div>
            <Activity size={20} />
            <h2>Integration Health Diagnostics</h2>
          </div>
          <button type="button" onClick={close}>
            <X size={18} />
          </button>
        </div>
        <p>System metrics verifying connection uptime and pipeline performance.</p>

        <div className="logs-list">
          {metrics.map((m) => (
            <div className="log-entry" key={m.label}>
              <div className="log-entry-head">
                <span style={{ color: '#d1e3f8' }}>{m.label}</span>
                <span className="status">{m.status}</span>
              </div>
              <strong style={{ fontSize: 13, color: '#fff', marginTop: 2 }}>{m.value}</strong>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="primary" type="button" onClick={close}>
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
