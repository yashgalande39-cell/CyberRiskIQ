import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bird,
  Bug,
  ChevronDown,
  Crosshair,
  FileBarChart,
  FileText,
  Flame,
  Globe,
  Lock,
  Plus,
  Radiation,
  ScanLine,
  Shield,
  ShieldCheck,
  Sigma,
  Skull,
  Sparkles,
  Users,
  Waves,
  X,
} from 'lucide-react';
import '../../styles/threat-intelligence.css';

export interface ThreatIntelligenceViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

const tabs = [
  'Overview',
  'Threat Actors',
  'Campaigns',
  'Vulnerabilities (CVE)',
  'Indicators of Compromise',
  'Dark Web Monitoring',
  'Reports',
];

const stats = [
  { label: 'Active Threats', value: '1,248', change: '12%', vs: 'vs last week', icon: Shield, tone: 'red' },
  { label: 'New CVEs (30 days)', value: '286', change: '36%', vs: 'vs previous 30 days', icon: Bug, tone: 'orange' },
  { label: 'Tracked Threat Actors', value: '52', change: '8%', vs: 'new this month', icon: Users, tone: 'purple' },
  { label: 'Active Campaigns', value: '24', change: '14%', vs: 'vs last month', icon: Globe, tone: 'emerald' },
  { label: 'IoCs Ingested (24h)', value: '48,532', change: '28%', vs: '', icon: FileBarChart, tone: 'blue' },
];

const actors = [
  { n: 1, name: 'Lazarus Group', icon: Skull, color: '#dc2626', activity: 'High', sectors: 'Finance, Crypto' },
  { n: 2, name: 'APT28 (Fancy Bear)', icon: Radiation, color: '#c2410c', activity: 'High', sectors: 'Government, Defense' },
  { n: 3, name: 'APT29 (Cozy Bear)', icon: Bug, color: '#64748b', activity: 'High', sectors: 'Government, IT' },
  { n: 4, name: 'Volt Typhoon', icon: Waves, color: '#2563eb', activity: 'Medium', sectors: 'Critical Infrastructure' },
  { n: 5, name: 'LockBit', icon: Lock, color: '#dc2626', activity: 'Medium', sectors: 'Global (Ransomware)' },
];

const landscape = [
  { label: 'Malware', pct: 32, color: '#ef4444' },
  { label: 'Ransomware', pct: 18, color: '#f97316' },
  { label: 'Phishing', pct: 16, color: '#f59e0b' },
  { label: 'DDoS', pct: 12, color: '#3b82f6' },
  { label: 'Insider Threat', pct: 8, color: '#a855f7' },
  { label: 'Others', pct: 14, color: '#7c6cf0' },
];

const feed = [
  { n: 1, time: '10:24 AM', type: 'CVE', tc: '#f87171', title: 'New critical RCE vulnerability in Apache Struts (CVE-2024-53677)', sev: 'Critical', src: 'CISA' },
  { n: 2, time: '09:52 AM', type: 'Malware', tc: '#f87171', title: 'New variant of SnakeKeylogger targeting enterprises', sev: 'High', src: 'CrowdStrike' },
  { n: 3, time: '08:31 AM', type: 'Campaign', tc: '#fbbf24', title: 'Phishing campaign targeting financial sector', sev: 'Medium', src: 'Microsoft' },
  { n: 4, time: '07:18 AM', type: 'IoC', tc: '#e2e8f0', title: 'Malicious IP range associated with APT29', sev: 'Medium', src: 'Recorded Future' },
  { n: 5, time: '06:44 AM', type: 'Threat Actor', tc: '#f87171', title: 'Lazarus Group linked to new crypto theft campaign', sev: 'High', src: 'Mandiant' },
  { n: 6, time: '05:12 AM', type: 'Vulnerability', tc: '#e2e8f0', title: 'Zero-day in Ivanti Connect Secure (CVE-2024-21887)', sev: 'Critical', src: 'NVD' },
  { n: 7, time: '03:56 AM', type: 'Dark Web', tc: '#e2e8f0', title: 'Corporate credentials for healthcare orgs on sale', sev: 'Medium', src: 'DarkTracer' },
  { n: 8, time: '01:20 AM', type: 'Malware', tc: '#f87171', title: "New ransomware variant 'BlackSuit' detected", sev: 'High', src: 'Palo Alto' },
  { n: 9, time: 'Jun 14', type: 'Malware', tc: '#e2e8f0', title: 'Mobile banking trojan targeting India (BRATA v2)', sev: 'Medium', src: 'Kaspersky' },
  { n: 10, time: 'Jun 14', type: 'Campaign', tc: '#e2e8f0', title: 'State-sponsored campaign targeting energy sector', sev: 'High', src: 'FireEye' },
];

const cves = [
  { id: 'CVE-2024-53677', cvss: '9.8', cc: '#ef4444', product: 'Apache Struts', trend: '#ef4444' },
  { id: 'CVE-2024-21887', cvss: '9.1', cc: '#ef4444', product: 'Ivanti Connect Secure', trend: '#34d399' },
  { id: 'CVE-2024-3094', cvss: '8.8', cc: '#fb923c', product: 'Microsoft Windows', trend: '#ef4444' },
  { id: 'CVE-2024-32002', cvss: '8.1', cc: '#fb923c', product: 'Linux Kernel', trend: '#ef4444' },
  { id: 'CVE-2024-27198', cvss: '7.8', cc: '#34d399', product: 'VMware ESXi', trend: '#ef4444' },
];

const defaultSources = [
  { name: 'Mandiant', icon: Flame, cls: '#ef4444' },
  { name: 'CrowdStrike', icon: Bird, cls: '#ef4444' },
  { name: 'VirusTotal', icon: Sigma, cls: '#60a5fa' },
  { name: 'CISA', icon: ShieldCheck, cls: '#93c5fd' },
  { name: 'NVD', icon: null, cls: '' },
  { name: 'OTX (AlienVault)', icon: ScanLine, cls: '#34d399' },
];

const alerts = [
  { time: '10:11 AM', text: 'Unusual C2 activity detected', sev: 'High' },
  { time: '08:45 AM', text: 'New IoC matches internal asset', sev: 'Medium' },
  { time: '06:30 AM', text: 'Spike in ransomware campaigns', sev: 'High' },
  { time: '01:22 AM', text: 'Data exfiltration indicator found', sev: 'Critical' },
];

const reports = [
  'Weekly Threat Summary',
  'Region-based Threat Report',
  'Industry Threat Landscape',
  'Custom Report',
];

const dots = [
  { x: '19%', y: '36%', c: '#ef4444', s: 14, d: '2.2s' },
  { x: '24%', y: '42%', c: '#f97316', s: 9, d: '2.6s' },
  { x: '48%', y: '30%', c: '#ef4444', s: 13, d: '2.4s' },
  { x: '53%', y: '36%', c: '#f97316', s: 8, d: '3s' },
  { x: '72%', y: '38%', c: '#ef4444', s: 11, d: '2.8s' },
  { x: '78%', y: '46%', c: '#f97316', s: 8, d: '2.3s' },
  { x: '30%', y: '66%', c: '#f59e0b', s: 7, d: '3.1s' },
  { x: '52%', y: '62%', c: '#f59e0b', s: 6, d: '2.9s' },
  { x: '84%', y: '74%', c: '#22d3ee', s: 5, d: '3.3s' },
  { x: '60%', y: '48%', c: '#22d3ee', s: 4, d: '3.5s' },
];

const legend = [
  ['Critical', '#ef4444'],
  ['High', '#f97316'],
  ['Medium', '#f59e0b'],
  ['Low', '#22d3ee'],
];

export default function ThreatIntelligenceView({
  onNav,
  externalNotify,
}: ThreatIntelligenceViewProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Last 24 Hours');
  const [sourcesList, setSourcesList] = useState(defaultSources);
  const [toast, setToast] = useState('');

  // Modals
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [viewAllModal, setViewAllModal] = useState<'actors' | 'feed' | 'cves' | 'alerts' | null>(null);

  const notify = (msg: string, kind: 'ok' | 'info' = 'ok') => {
    setToast(msg);
    if (externalNotify) externalNotify(msg, kind);
    window.setTimeout(() => setToast(''), 2500);
  };

  const handleReportClick = (reportName: string) => {
    notify(`Preparing ${reportName}...`);
    window.setTimeout(() => {
      notify(`${reportName} ready for download`, 'ok');
    }, 1200);
  };

  return (
    <div className="threat-intel-page">
      {/* Header - Unified to Security Controls */}
      <header className="sc-page-header">
        <div>
          <nav className="sc-breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => onNav?.('dashboard')}>
              Home
            </button>
            <ChevronDown size={11} style={{ transform: 'rotate(-90deg)', color: '#7c9db8' }} />
            <span>Threat Intelligence</span>
          </nav>
          <h1>Threat Intelligence</h1>
          <p>Real-time threat insights to help you stay ahead of emerging risks.</p>
        </div>

        <div className="sc-header-actions">
          <p>
            ANTICIPATE<br />
            UNDERSTAND<br />
            STAY AHEAD
          </p>
          <button
            type="button"
            className="sc-button sc-button-primary add-control"
            onClick={() => setAddSourceOpen(true)}
          >
            <Plus size={16} /> Add Intelligence Source
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="content-body">
        {/* Navigation Tabs */}
        <div className="tabs-bar">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              className={activeTab === t ? 'active' : ''}
              onClick={() => {
                setActiveTab(t);
                if (t !== 'Overview') notify(`${t} view selected`);
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 5 Stats Cards */}
        <section className="stats-row">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                className="card stat-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className={`stat-icon ${s.tone}`}>
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                <div className="stat-meta">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-trend">
                    <ArrowUp size={12} />
                    {s.change} <span>{s.vs}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Row 2: Global Threat Activity + Top Threat Actors + Threat Landscape */}
        <div className="row-2">
          {/* Global Threat Activity */}
          <div className="card">
            <div className="card-header">
              <h3>Global Threat Activity</h3>
              <button
                type="button"
                className="time-filter-btn"
                onClick={() => {
                  const next =
                    timeRange === 'Last 24 Hours'
                      ? 'Last 7 Days'
                      : timeRange === 'Last 7 Days'
                      ? 'Last 30 Days'
                      : 'Last 24 Hours';
                  setTimeRange(next);
                  notify(`Filtered by ${next}`);
                }}
              >
                {timeRange} <ChevronDown size={13} />
              </button>
            </div>

            <div className="threat-map-container">
              <div className="threat-map-viewport">
                <img src="/images/threat-map.png" alt="Global Threat Activity Map" />
                {dots.map((d, i) => (
                  <span
                    key={i}
                    className="map-dot"
                    style={{
                      left: d.x,
                      top: d.y,
                      width: d.s * 2,
                      height: d.s * 2,
                      backgroundColor: d.c,
                      boxShadow: `0 0 ${d.s * 2.5}px ${d.c}`,
                      animationDuration: d.d,
                    }}
                  />
                ))}
              </div>

              <div className="threat-map-legend">
                {legend.map(([l, c]) => (
                  <div key={l} className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: c }} />
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Threat Actors */}
          <div className="card">
            <div className="card-header">
              <h3>Top Threat Actors</h3>
              <button
                type="button"
                className="view-all-btn"
                onClick={() => setViewAllModal('actors')}
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '28px' }}>#</th>
                  <th>Actor Group</th>
                  <th>Activity</th>
                  <th>Target Sectors</th>
                </tr>
              </thead>
              <tbody>
                {actors.map((a) => {
                  const Icon = a.icon;
                  return (
                    <tr key={a.n}>
                      <td style={{ color: '#94a3b8' }}>{a.n}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: a.color,
                              color: '#fff',
                            }}
                          >
                            <Icon size={12} />
                          </span>
                          <span style={{ fontWeight: 500 }}>{a.name}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`sev-badge ${
                            a.activity === 'High' ? 'high' : 'medium'
                          }`}
                        >
                          {a.activity}
                        </span>
                      </td>
                      <td style={{ color: '#cbd5e1', whiteSpace: 'nowrap' }}>{a.sectors}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Threat Landscape Donut */}
          <div className="card">
            <div className="card-header">
              <h3>Threat Landscape</h3>
            </div>

            <div className="donut-wrap">
              <DonutChart />
              <div className="donut-legend">
                {landscape.map((l) => (
                  <div key={l.label} className="donut-legend-row">
                    <span
                      className="donut-legend-dot"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="donut-legend-name">{l.label}</span>
                    <span className="donut-legend-pct">{l.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Latest Threat Feed + Trending CVEs */}
        <div className="row-3">
          {/* Latest Threat Feed */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3>Latest Threat Intelligence Feed</h3>
                <span className="live-pill">
                  <span className="live-dot" /> Live
                </span>
              </div>
              <button
                type="button"
                className="view-all-btn"
                onClick={() => setViewAllModal('feed')}
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '36px' }}>#</th>
                  <th style={{ width: '80px' }}>Time</th>
                  <th style={{ width: '90px' }}>Type</th>
                  <th>Title / Description</th>
                  <th style={{ width: '85px' }}>Severity</th>
                  <th style={{ width: '100px' }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {feed.map((f) => (
                  <tr key={f.n}>
                    <td style={{ color: '#94a3b8' }}>{f.n}</td>
                    <td style={{ color: '#cbd5e1', whiteSpace: 'nowrap' }}>{f.time}</td>
                    <td style={{ color: f.tc, whiteSpace: 'nowrap', fontWeight: 500 }}>
                      {f.type}
                    </td>
                    <td
                      style={{
                        maxWidth: 0,
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#f1f5f9',
                      }}
                      title={f.title}
                    >
                      {f.title}
                    </td>
                    <td>
                      <span
                        className={`sev-badge ${
                          f.sev === 'Critical'
                            ? 'critical'
                            : f.sev === 'High'
                            ? 'high'
                            : 'medium'
                        }`}
                      >
                        {f.sev}
                      </span>
                    </td>
                    <td style={{ color: '#cbd5e1', whiteSpace: 'nowrap' }}>{f.src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trending CVEs */}
          <div className="card">
            <div className="card-header">
              <h3>Trending CVEs</h3>
              <button
                type="button"
                className="view-all-btn"
                onClick={() => setViewAllModal('cves')}
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>CVE ID</th>
                  <th>CVSS</th>
                  <th>Affected Products</th>
                  <th style={{ textAlign: 'right' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {cves.map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: '#f8fafc', whiteSpace: 'nowrap', fontWeight: 500 }}>
                      {c.id}
                    </td>
                    <td style={{ color: c.cc, fontWeight: 700 }}>{c.cvss}</td>
                    <td style={{ color: '#cbd5e1', whiteSpace: 'nowrap' }}>{c.product}</td>
                    <td style={{ textAlign: 'right', color: c.trend }}>
                      <ArrowUp size={15} style={{ display: 'inline-block' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 4: Intelligence Sources + Recent Alerts + Reports */}
        <div className="row-4">
          {/* Intelligence Sources */}
          <div className="card">
            <div className="card-header">
              <h3>Intelligence Sources</h3>
            </div>

            <div className="sources-grid">
              {sourcesList.map((s) => {
                const Icon = s.icon;
                return (
                  <div className="source-tile" key={s.name}>
                    <div className="source-tile-icon">
                      {Icon ? (
                        <Icon size={26} color={s.cls} strokeWidth={1.8} />
                      ) : (
                        <span
                          style={{
                            background: '#1e3a8a',
                            color: '#fff',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 11,
                          }}
                        >
                          NVD
                        </span>
                      )}
                    </div>
                    <div className="source-tile-name">{s.name}</div>
                    <div className="source-tile-status">
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: '#34d399',
                        }}
                      />
                      Connected
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="source-tile add-tile"
                onClick={() => setAddSourceOpen(true)}
              >
                <Plus size={24} strokeWidth={1.5} />
                <div style={{ fontSize: 11 }}>Add Source</div>
              </button>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Alerts</h3>
              <button
                type="button"
                className="view-all-btn"
                onClick={() => setViewAllModal('alerts')}
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '85px' }}>Time</th>
                  <th>Alert</th>
                  <th style={{ width: '85px' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => (
                  <tr key={i}>
                    <td style={{ color: '#cbd5e1', whiteSpace: 'nowrap' }}>{a.time}</td>
                    <td style={{ color: '#f8fafc', fontWeight: 500 }}>{a.text}</td>
                    <td>
                      <span
                        className={`sev-badge ${
                          a.sev === 'Critical'
                            ? 'critical'
                            : a.sev === 'High'
                            ? 'high'
                            : 'medium'
                        }`}
                      >
                        {a.sev}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Threat Intelligence Reports */}
          <div className="card">
            <div className="card-header">
              <h3>Threat Intelligence Reports</h3>
            </div>

            <div className="reports-list">
              {reports.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="report-item"
                  onClick={() => handleReportClick(r)}
                >
                  <FileText size={15} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                  <span>{r}</span>
                  <ArrowRight size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Intelligence Source Modal */}
      <AnimatePresence>
        {addSourceOpen && (
          <AddSourceModal
            close={() => setAddSourceOpen(false)}
            onAdd={(newSource) => {
              setSourcesList((prev) => [...prev, newSource]);
              notify(`Added intelligence feed: ${newSource.name}`);
            }}
          />
        )}
      </AnimatePresence>

      {/* View All Modal */}
      <AnimatePresence>
        {viewAllModal && (
          <ViewAllModal
            type={viewAllModal}
            close={() => setViewAllModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
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

function DonutChart() {
  const size = 150;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="donut-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 + 3}
          fill="none"
          stroke="#1e3a8a"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {landscape.map((s, i) => {
          const length = (s.pct / 100) * circumference - 3;
          const offset = -(accumulated / 100) * circumference;
          accumulated += s.pct;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <div className="donut-center">
        <strong>1,248</strong>
        <span>Active Threats</span>
      </div>
    </div>
  );
}

function AddSourceModal({
  close,
  onAdd,
}: {
  close: () => void;
  onAdd: (source: { name: string; icon: any; cls: string }) => void;
}) {
  const [sourceName, setSourceName] = useState('');
  const [feedType, setFeedType] = useState('STIX/TAXII 2.1');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: sourceName || 'Custom Threat Feed',
      icon: Shield,
      cls: '#38bdf8',
    });
    close();
  };

  return (
    <motion.div
      className="threat-intel-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        className="threat-intel-modal"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="modal-head">
          <div>
            <Crosshair size={20} />
            <h2>Add Threat Intelligence Source</h2>
          </div>
          <button type="button" onClick={close}>
            <X size={18} />
          </button>
        </div>
        <p>Connect real-time commercial, open-source, or government threat data.</p>

        <label>
          Feed Name
          <input
            autoFocus
            required
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="e.g. Recorded Future, Shodan, DarkOwl"
          />
        </label>

        <label>
          Integration Format
          <select value={feedType} onChange={(e) => setFeedType(e.target.value)}>
            <option>STIX/TAXII 2.1</option>
            <option>MISP API</option>
            <option>REST JSON Endpoint</option>
            <option>OpenCTI Connector</option>
          </select>
        </label>

        <label>
          Feed URL / Endpoint
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.intel.vendor.com/v2/taxii"
          />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary" type="submit">
            <Plus size={15} /> Add Source
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function ViewAllModal({
  type,
  close,
}: {
  type: 'actors' | 'feed' | 'cves' | 'alerts';
  close: () => void;
}) {
  const titles = {
    actors: 'All Tracked Threat Actors (52)',
    feed: 'Full Threat Intelligence Stream',
    cves: 'Trending Critical Vulnerabilities (CVEs)',
    alerts: 'All Security Intelligence Alerts',
  };

  return (
    <motion.div
      className="threat-intel-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="threat-intel-modal wide"
        onMouseDown={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <div className="modal-head">
          <div>
            <BarChart3 size={20} />
            <h2>{titles[type]}</h2>
          </div>
          <button type="button" onClick={close}>
            <X size={18} />
          </button>
        </div>
        <p>Comprehensive catalog correlated against your organization's digital footprint.</p>

        <div style={{ maxHeight: 360, overflowY: 'auto', margin: '14px 0' }}>
          {type === 'actors' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Actor Group</th>
                  <th>Origin / Attribution</th>
                  <th>Activity</th>
                  <th>Target Sectors</th>
                </tr>
              </thead>
              <tbody>
                {actors.map((a) => (
                  <tr key={a.name}>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td style={{ color: '#94a3b8' }}>State-sponsored / Organized</td>
                    <td>
                      <span className={`sev-badge ${a.activity === 'High' ? 'high' : 'medium'}`}>
                        {a.activity}
                      </span>
                    </td>
                    <td>{a.sectors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {type === 'feed' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Severity</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {feed.map((f) => (
                  <tr key={f.n}>
                    <td style={{ color: '#94a3b8' }}>{f.time}</td>
                    <td style={{ color: f.tc, fontWeight: 500 }}>{f.type}</td>
                    <td style={{ color: '#f8fafc' }}>{f.title}</td>
                    <td>
                      <span
                        className={`sev-badge ${
                          f.sev === 'Critical'
                            ? 'critical'
                            : f.sev === 'High'
                            ? 'high'
                            : 'medium'
                        }`}
                      >
                        {f.sev}
                      </span>
                    </td>
                    <td>{f.src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {type === 'cves' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>CVE ID</th>
                  <th>CVSS</th>
                  <th>Affected Products</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cves.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.id}</td>
                    <td style={{ color: c.cc, fontWeight: 700 }}>{c.cvss}</td>
                    <td>{c.product}</td>
                    <td style={{ color: '#ef4444' }}>Actively Exploited</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {type === 'alerts' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Security Event Alert</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, idx) => (
                  <tr key={idx}>
                    <td style={{ color: '#94a3b8' }}>{a.time}</td>
                    <td>{a.text}</td>
                    <td>
                      <span className={`sev-badge ${a.sev === 'Critical' ? 'critical' : 'high'}`}>
                        {a.sev}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-actions">
          <button className="primary" type="button" onClick={close}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
