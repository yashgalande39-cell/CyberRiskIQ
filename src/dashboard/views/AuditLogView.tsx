import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type CSSProperties, type FormEvent } from 'react';
import { Icon } from '../../components/Icons';
import '../../styles/auditlog.css';

export interface AuditLogViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

type ModalType = 'export' | 'schedule' | 'alerts' | 'enterprise' | null;
type Toast = { id: number; text: string };
type Severity = 'High' | 'Medium' | 'Low';
type EventType = 'Investment' | 'Configuration' | 'Data Access' | 'Authentication' | 'Asset Management' | 'Optimization' | 'System' | 'User Management';

type AuditEvent = {
  id: number;
  timestamp: string;
  user: string;
  initials: string;
  accent: string;
  action: string;
  resource: string;
  eventType: EventType;
  severity: Severity;
  ip: string;
  detail: string;
};

type Filters = {
  search: string;
  eventType: string;
  severity: string;
  user: string;
  resource: string;
  ip: string;
  dateRange: string;
};

const dateRanges = [
  { value: 'week', label: 'Jun 09, 2024 - Jun 15, 2024' },
  { value: 'month', label: 'May 17, 2024 - Jun 15, 2024' },
  { value: 'quarter', label: 'Apr 01, 2024 - Jun 15, 2024' },
];

const timelineLabels = ['Jun 09', 'Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15'];
const stackedTimeline = [
  { label: 'Login/Authentication', color: '#2494ff', values: [26, 38, 32, 44, 28, 34, 37] },
  { label: 'Data Access', color: '#22d3ae', values: [18, 22, 19, 26, 20, 22, 24] },
  { label: 'Configuration Changes', color: '#ffc84c', values: [14, 16, 15, 18, 13, 15, 17] },
  { label: 'Security Events', color: '#ff4b63', values: [31, 36, 30, 42, 29, 32, 27] },
  { label: 'User Management', color: '#8f63ff', values: [12, 16, 14, 18, 13, 14, 11] },
];

const eventDistribution = [
  { label: 'Authentication', value: 32, color: '#2494ff' },
  { label: 'Data Access', value: 24, color: '#22d3ae' },
  { label: 'Configuration', value: 18, color: '#ffc84c' },
  { label: 'Security Events', value: 14, color: '#ff4b63' },
  { label: 'User Management', value: 8, color: '#8f63ff' },
  { label: 'Others', value: 4, color: '#b6c9ff' },
];

const auditEvents: AuditEvent[] = [
  { id: 1, timestamp: 'Jun 15, 2024 10:24:32', user: 'Yash Galande', initials: 'YG', accent: '#1d78ff', action: 'Approved investment plan', resource: 'Investment #INV-2024-018', eventType: 'Investment', severity: 'High', ip: '203.0.113.45', detail: 'Approved the quarterly security investment plan and committed the associated budget.' },
  { id: 2, timestamp: 'Jun 15, 2024 09:18:11', user: 'R. Sharma', initials: 'RS', accent: '#7c4dff', action: 'Modified risk parameters', resource: 'Org Settings', eventType: 'Configuration', severity: 'Medium', ip: '203.0.113.12', detail: 'Adjusted the risk appetite threshold and updated weighting for likelihood modelling.' },
  { id: 3, timestamp: 'Jun 15, 2024 08:45:03', user: 'P. Mehta', initials: 'PM', accent: '#6c52ff', action: 'Exported risk report', resource: 'Report: Executive Summary', eventType: 'Data Access', severity: 'Low', ip: '203.0.113.78', detail: 'Downloaded the executive summary PDF report for board distribution.' },
  { id: 4, timestamp: 'Jun 14, 2024 22:15:44', user: 'A. Verma', initials: 'AK', accent: '#ff9645', action: 'Failed login attempt', resource: '-', eventType: 'Authentication', severity: 'Medium', ip: '198.51.100.23', detail: 'Authentication failed due to an incorrect password and expired MFA session.' },
  { id: 5, timestamp: 'Jun 14, 2024 19:32:17', user: 'S. Patil', initials: 'SP', accent: '#8348ff', action: 'Added new asset', resource: 'Server-DB-01', eventType: 'Asset Management', severity: 'Medium', ip: '203.0.113.90', detail: 'Registered a new database server and linked it to the Finance business unit.' },
  { id: 6, timestamp: 'Jun 14, 2024 16:11:28', user: 'Yash Galande', initials: 'YG', accent: '#1d78ff', action: 'Updated security control', resource: 'Control: MFA', eventType: 'Configuration', severity: 'Low', ip: '203.0.113.45', detail: 'Marked Multi-Factor Authentication as fully deployed across priority assets.' },
  { id: 7, timestamp: 'Jun 14, 2024 13:05:19', user: 'R. Sharma', initials: 'RS', accent: '#7c4dff', action: 'Ran optimization scenario', resource: 'Scenario #SC-2024-07', eventType: 'Optimization', severity: 'Low', ip: '203.0.113.12', detail: 'Executed a what-if scenario comparing MFA and EDR budget allocation.' },
  { id: 8, timestamp: 'Jun 13, 2024 11:47:33', user: 'P. Mehta', initials: 'PM', accent: '#6c52ff', action: 'Viewed vulnerability details', resource: 'CVE-2024-3094', eventType: 'Data Access', severity: 'Low', ip: '203.0.113.78', detail: 'Opened the detailed vulnerability page to review exploitability and ownership.' },
  { id: 9, timestamp: 'Jun 13, 2024 10:22:11', user: 'System', initials: 'S', accent: '#56769a', action: 'Threat intelligence feed updated', resource: 'Threat DB', eventType: 'System', severity: 'Low', ip: '192.0.2.10', detail: 'Imported and normalized new threat indicators relevant to the Banking sector.' },
  { id: 10, timestamp: 'Jun 12, 2024 23:11:02', user: 'A. Verma', initials: 'AK', accent: '#ff9645', action: 'Changed user role', resource: 'User: s.kulkarni', eventType: 'User Management', severity: 'High', ip: '198.51.100.23', detail: 'Elevated s.kulkarni from Analyst to Approver following finance access approval.' },
  { id: 11, timestamp: 'Jun 12, 2024 18:44:20', user: 'Yash Galande', initials: 'YG', accent: '#1d78ff', action: 'Created alert rule', resource: 'Alert Rules', eventType: 'Configuration', severity: 'Medium', ip: '203.0.113.45', detail: 'Added a rule to notify on repeated failed logins from privileged accounts.' },
  { id: 12, timestamp: 'Jun 12, 2024 13:13:09', user: 'System', initials: 'S', accent: '#56769a', action: 'Backup retention verified', resource: 'Retention Policy', eventType: 'System', severity: 'Low', ip: '192.0.2.10', detail: 'Validated that the 180-day audit log retention policy remains active.' },
];

const quickActions = [
  { label: 'Export Audit Logs', icon: 'download' },
  { label: 'Schedule Report', icon: 'calendar' },
  { label: 'Set Alert Rules', icon: 'bell' },
  { label: 'View Activity Summary', icon: 'chartBox' },
] as const;

function useOutside(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function down(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    }
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [onClose]);
  return ref;
}

function Dropdown({
  trigger,
  children,
  className = '',
  width = 250,
}: {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  className?: string;
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutside(() => setOpen(false));
  return (
    <div className={`al-dd ${className}`} ref={ref}>
      <button className="al-dd-trigger" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {trigger}
      </button>
      {open && (
        <div className="al-dd-menu" style={{ width }}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function key(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', key);
    };
  }, [onClose]);
  return (
    <div
      className="al-modal-back"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="al-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} className="al-icon-btn" aria-label="Close dialog">
            <Icon name="close" />
          </button>
        </header>
        <div className="al-modal-body">{children}</div>
      </div>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return <span className={`al-badge badge-${value.toLowerCase().replace(/\s+/g, '-')}`}>{value}</span>;
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <label className="al-select">
      <select value={value} aria-label={label} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevron" />
    </label>
  );
}

function StackedTimeline() {
  const [hover, setHover] = useState(6);
  const width = 720;
  const height = 220;
  const left = 44;
  const right = 688;
  const top = 42;
  const bottom = 182;
  const barWidth = 28;
  const x = (index: number) => left + (index * (right - left)) / 6;
  const y = (value: number) => bottom - ((bottom - top) * value) / 200;
  const totals = timelineLabels.map((_, index) =>
    stackedTimeline.reduce((sum, item) => sum + item.values[index], 0)
  );

  return (
    <div className="al-stack-chart">
      <div className="al-chart-legend">
        {stackedTimeline.map((item) => (
          <span key={item.label}>
            <i style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Activity timeline showing stacked event counts from Jun 09 through Jun 15">
        <g>
          {[0, 50, 100, 150, 200].map((tick) => (
            <g key={tick}>
              <line x1={left} x2={right} y1={y(tick)} y2={y(tick)} className="al-grid" />
              <text x={left - 8} y={y(tick) + 4} textAnchor="end" className="al-chart-label">
                {tick}
              </text>
            </g>
          ))}
          {timelineLabels.map((label, index) => (
            <text key={label} x={x(index) + barWidth / 2} y={205} textAnchor="middle" className="al-chart-label">
              {label}
            </text>
          ))}
        </g>
        {timelineLabels.map((_, index) => {
          let offset = 0;
          return (
            <g key={index}>
              {stackedTimeline.map((series) => {
                const value = series.values[index];
                const topY = y(offset + value);
                const bottomY = y(offset);
                offset += value;
                return (
                  <rect
                    key={series.label}
                    x={x(index)}
                    y={topY}
                    width={barWidth}
                    height={bottomY - topY}
                    fill={series.color}
                    opacity={hover === index ? 1 : 0.88}
                    rx={hover === index ? 2 : 0}
                  />
                );
              })}
            </g>
          );
        })}
        {timelineLabels.map((_, index) => (
          <rect
            key={`hit-${index}`}
            x={x(index) - 10}
            y={30}
            width={48}
            height={160}
            fill="transparent"
            onMouseEnter={() => setHover(index)}
          />
        ))}
      </svg>
      <div className="al-stack-tip" style={{ left: `${10 + hover * 13.5}%` }}>
        <span>{timelineLabels[hover]}</span>
        <strong>{totals[hover]}</strong>
      </div>
    </div>
  );
}

function EventDonut() {
  const [hover, setHover] = useState<number | null>(null);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="al-donut">
      <svg viewBox="0 0 170 170" role="img" aria-label="Event distribution">
        <circle cx="85" cy="85" r={radius} fill="none" stroke="#0b3552" strokeWidth="20" />
        {eventDistribution.map((item, index) => {
          const dash = (item.value / 100) * circumference;
          const start = offset;
          offset += item.value;
          return (
            <circle
              key={item.label}
              cx="85"
              cy="85"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={hover === index ? 24 : 20}
              strokeDasharray={`${Math.max(0, dash - 1)} ${circumference}`}
              transform={`rotate(${-90 + start * 3.6} 85 85)`}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
        <text x="85" y="82" textAnchor="middle" className="al-donut-total">
          12,482
        </text>
        <text x="85" y="104" textAnchor="middle" className="al-donut-sub">
          Events
        </text>
      </svg>
      <div className="al-donut-legend">
        {eventDistribution.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={hover === index ? 'is-active' : ''}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
          >
            <i style={{ background: item.color }} />
            <span>{item.label}</span>
            <b>{item.value}%</b>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AuditLogView({ onNav: _onNav, externalNotify }: AuditLogViewProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    eventType: '',
    severity: '',
    user: '',
    resource: '',
    ip: '',
    dateRange: 'week',
  });
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<number[]>([]);

  const notify = useCallback(
    (text: string, kind: 'ok' | 'info' = 'ok') => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-2), { id, text }]);
      timers.current.push(
        window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200)
      );
      if (externalNotify) externalNotify(text, kind);
    },
    [externalNotify]
  );

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const users = useMemo(
    () => ['All Users', ...Array.from(new Set(auditEvents.map((event) => event.user)))],
    []
  );
  const eventTypes = useMemo(
    () => ['All Event Types', ...Array.from(new Set(auditEvents.map((event) => event.eventType)))],
    []
  );
  const resources = useMemo(
    () => ['All Resources', ...Array.from(new Set(auditEvents.map((event) => event.resource).filter((value) => value !== '-')))],
    []
  );

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return auditEvents.filter((event) => {
      if (query && !`${event.user} ${event.action} ${event.resource} ${event.ip}`.toLowerCase().includes(query))
        return false;
      if (filters.eventType && event.eventType !== filters.eventType) return false;
      if (filters.severity && event.severity !== filters.severity) return false;
      if (filters.user && event.user !== filters.user) return false;
      if (filters.resource && event.resource !== filters.resource) return false;
      if (filters.ip && !event.ip.includes(filters.ip)) return false;
      return true;
    });
  }, [filters]);

  const paged = filtered.slice((page - 1) * 10, page * 10);

  function clearFilters() {
    setFilters({ search: '', eventType: '', severity: '', user: '', resource: '', ip: '', dateRange: 'week' });
    setPage(1);
    notify('Filters reset.', 'info');
  }

  function exportLogs() {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Event Type', 'Severity', 'IP Address', 'Details'],
      ...filtered.map((event) => [
        event.timestamp,
        event.user,
        event.action,
        event.resource,
        event.eventType,
        event.severity,
        event.ip,
        event.detail,
      ]),
    ]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'CyberRiskIQ-Audit-Logs.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 500);
    notify(`${filtered.length} audit events exported.`, 'ok');
  }

  return (
    <div className="audit-log-page sc-content">
      {/* Standard Header matching Security Controls */}
      <header className="sc-page-header">
        <div>
          <p className="sc-breadcrumb">Home &gt; Governance &gt; <span>Audit Log</span></p>
          <h1>Audit Log &amp; System Activity</h1>
          <p>Immutable, tamper-evident audit trail capturing all system events, policy modifications, and access history.</p>
        </div>
        <div className="sc-header-actions">
          <div className="sc-motto">
            <span>ACCOUNTABILITY</span>
            <span>VISIBILITY</span>
            <span>CONTINUOUS TRUST</span>
          </div>
          <button type="button" className="sc-action-btn" onClick={exportLogs}>
            <Icon name="download" /> Export Logs
          </button>
        </div>
      </header>

      <main className="al-content" id="audit-content" tabIndex={-1} style={{ padding: 0 }}>

        <div className="al-layout">
          <div className="al-main-column">
            {/* 4 Metric Cards */}
            <div className="al-metrics">
              {[
                { label: 'Total Events', value: '12,482', icon: 'report', tone: 'blue', delta: '18%', note: 'vs last month', trend: 'up' },
                { label: 'Unique Users', value: '48', icon: 'userBadge', tone: 'blue', delta: '6%', note: 'vs last month', trend: 'up' },
                { label: 'Critical Events', value: '32', icon: 'shield', tone: 'red', delta: '12%', note: 'vs last month', trend: 'up-red' },
                { label: 'Policy Changes', value: '18', icon: 'rotate', tone: 'green', delta: '38%', note: 'vs last month', trend: 'up' },
              ].map((item) => (
                <article key={item.label} className={`al-metric metric-${item.tone}`}>
                  <span className="al-metric-icon">
                    <Icon name={item.icon} />
                  </span>
                  <div>
                    <p>{item.label}</p>
                    <strong>{item.value}</strong>
                    <span className={`trend ${item.trend}`}>
                      {item.delta && (
                        <>
                          <Icon name="arrowUp" />
                          <b>{item.delta}</b>
                        </>
                      )}
                      <small>{item.note}</small>
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Chart Grid: Activity Timeline and Event Distribution */}
            <div className="al-chart-grid">
              <section className="al-panel timeline-panel">
                <header>
                  <h2>Activity Timeline</h2>
                </header>
                <StackedTimeline />
              </section>

              <section className="al-panel donut-panel">
                <header>
                  <h2>Event Distribution</h2>
                </header>
                <EventDonut />
              </section>
            </div>

            {/* Table Section with Filters and Pagination */}
            <section className="al-table-section">
              <div className="al-table-filters">
                <div className="al-search-field">
                  <Icon name="search" />
                  <input
                    value={filters.search}
                    onChange={(event) => {
                      setFilters((current) => ({ ...current, search: event.target.value }));
                      setPage(1);
                    }}
                    placeholder="Search by user, action, resource, or IP address..."
                    aria-label="Search audit events"
                  />
                </div>

                <Select
                  label="Event type"
                  value={filters.eventType}
                  onChange={(value) => {
                    setFilters((current) => ({ ...current, eventType: value }));
                    setPage(1);
                  }}
                  options={[{ value: '', label: 'All Event Types' }, ...eventTypes.slice(1).map((value) => ({ value, label: value }))]}
                />

                <Select
                  label="Severity"
                  value={filters.severity}
                  onChange={(value) => {
                    setFilters((current) => ({ ...current, severity: value }));
                    setPage(1);
                  }}
                  options={[
                    { value: '', label: 'All Severity' },
                    { value: 'High', label: 'High' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Low', label: 'Low' },
                  ]}
                />

                <Select
                  label="Users"
                  value={filters.user}
                  onChange={(value) => {
                    setFilters((current) => ({ ...current, user: value }));
                    setPage(1);
                  }}
                  options={users.map((value) => ({ value: value === 'All Users' ? '' : value, label: value }))}
                />

                <label className="al-date-filter">
                  <Icon name="calendar" />
                  <select
                    value={filters.dateRange}
                    onChange={(event) => setFilters((current) => ({ ...current, dateRange: event.target.value }))}
                    aria-label="Date range"
                  >
                    {dateRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron" />
                </label>
              </div>

              <div className="al-table-wrap">
                <table className="al-table">
                  <colgroup>
                    <col style={{ width: '4%' }} />
                    <col style={{ width: '15.5%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '8.5%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '4%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Resource</th>
                      <th>Event Type</th>
                      <th>Severity</th>
                      <th>IP Address</th>
                      <th>Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((event) => (
                      <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>{event.timestamp}</td>
                        <td>
                          <span className="al-user-cell">
                            <i style={{ '--dot': event.accent } as CSSProperties}>{event.initials}</i>
                            {event.user}
                          </span>
                        </td>
                        <td>{event.action}</td>
                        <td>{event.resource}</td>
                        <td>{event.eventType}</td>
                        <td>
                          <Badge value={event.severity} />
                        </td>
                        <td>{event.ip}</td>
                        <td>
                          <button type="button" className="al-view" onClick={() => setSelectedEvent(event)}>
                            View
                          </button>
                        </td>
                        <td>
                          <Dropdown
                            className="al-row-menu"
                            width={180}
                            trigger={<Icon name="more" />}
                          >
                            {(close) => (
                              <div className="al-pop-card menu">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    close();
                                  }}
                                >
                                  <Icon name="report" />
                                  View Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    notify(`Alert rule created for ${event.action}.`, 'ok');
                                    close();
                                  }}
                                >
                                  <Icon name="bell" />
                                  Create Alert
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    notify(`Downloaded event #${event.id}.`, 'info');
                                    close();
                                  }}
                                >
                                  <Icon name="download" />
                                  Download Event
                                </button>
                              </div>
                            )}
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <footer className="al-table-footer">
                <p>Showing 1–10 of 12,482 events</p>
                <nav aria-label="Audit log pages">
                  <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))}>
                    <Icon name="chevron" className="left" />
                  </button>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={page === value ? 'is-current' : ''}
                      onClick={() => setPage(value)}
                    >
                      {value}
                    </button>
                  ))}
                  <span>...</span>
                  <button
                    type="button"
                    onClick={() => setPage(1249)}
                    className={page === 1249 ? 'is-current' : ''}
                  >
                    1249
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.min(1249, value + 1))}
                  >
                    <Icon name="chevron" className="right" />
                  </button>
                </nav>
              </footer>
            </section>
          </div>

          {/* Right Rail: Filters, Quick Actions, and Compliance & Retention */}
          <aside className="al-right-rail">
            <section className="al-panel filters-panel">
              <header>
                <h2>Filters</h2>
                <button type="button" className="al-text-btn" onClick={clearFilters}>
                  Reset
                </button>
              </header>
              <div className="filter-stack">
                <label>
                  Date Range
                  <Select
                    label="Sidebar date range"
                    value={filters.dateRange}
                    onChange={(value) => setFilters((current) => ({ ...current, dateRange: value }))}
                    options={dateRanges.map((range) => ({ value: range.value, label: range.label }))}
                  />
                </label>
                <label>
                  Event Type
                  <Select
                    label="Sidebar event type"
                    value={filters.eventType}
                    onChange={(value) => {
                      setFilters((current) => ({ ...current, eventType: value }));
                      setPage(1);
                    }}
                    options={[{ value: '', label: 'All Event Types' }, ...eventTypes.slice(1).map((value) => ({ value, label: value }))]}
                  />
                </label>
                <label>
                  Severity
                  <Select
                    label="Sidebar severity"
                    value={filters.severity}
                    onChange={(value) => {
                      setFilters((current) => ({ ...current, severity: value }));
                      setPage(1);
                    }}
                    options={[
                      { value: '', label: 'All Severities' },
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' },
                    ]}
                  />
                </label>
                <label>
                  User
                  <Select
                    label="Sidebar users"
                    value={filters.user}
                    onChange={(value) => {
                      setFilters((current) => ({ ...current, user: value }));
                      setPage(1);
                    }}
                    options={users.map((value) => ({ value: value === 'All Users' ? '' : value, label: value }))}
                  />
                </label>
                <label>
                  Resource
                  <Select
                    label="Sidebar resources"
                    value={filters.resource}
                    onChange={(value) => {
                      setFilters((current) => ({ ...current, resource: value }));
                      setPage(1);
                    }}
                    options={resources.map((value) => ({ value: value === 'All Resources' ? '' : value, label: value }))}
                  />
                </label>
                <label>
                  IP Address
                  <input
                    value={filters.ip}
                    onChange={(event) => {
                      setFilters((current) => ({ ...current, ip: event.target.value }));
                      setPage(1);
                    }}
                    placeholder="Enter IP address"
                  />
                </label>
                <button
                  type="button"
                  className="al-button al-button-primary full-width"
                  onClick={() => notify(`${filtered.length} audit events match the applied filters.`, 'ok')}
                >
                  Apply Filters
                </button>
              </div>
            </section>

            <section className="al-panel quick-panel">
              <header>
                <h2>Quick Actions</h2>
              </header>
              <div className="al-quick-actions">
                {quickActions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.label === 'Export Audit Logs') exportLogs();
                      else if (item.label === 'Schedule Report') setModal('schedule');
                      else if (item.label === 'Set Alert Rules') setModal('alerts');
                      else notify('Activity summary opened.', 'info');
                    }}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="al-panel retention-panel">
              <header>
                <h2>Compliance & Retention</h2>
              </header>
              <div className="al-retention-row">
                <div>
                  <h3>Log Retention Period</h3>
                  <strong>180 days</strong>
                </div>
                <button type="button" className="al-text-btn" onClick={() => notify('Retention settings opened.', 'info')}>
                  Configure <Icon name="arrowRight" />
                </button>
              </div>
              <div className="al-frameworks">
                <h3>Compliance Frameworks</h3>
                <div>
                  {['ISO 27001', 'NIST', 'SOC 2'].map((item) => (
                    <span key={item}>
                      <Icon name="checkCircle" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="al-backup">
                <h3>Last Backup</h3>
                <p>Jun 15, 2024, 10:30 AM</p>
                <span>
                  <Icon name="checkCircle" />
                  Success
                </span>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Selected Event Details Dialog */}
      {selectedEvent && (
        <Dialog title={`Audit Event #${selectedEvent.id}`} onClose={() => setSelectedEvent(null)}>
          <div className="al-detail-grid">
            <div>
              <h3>Event Summary</h3>
              <dl>
                <div>
                  <dt>User</dt>
                  <dd>{selectedEvent.user}</dd>
                </div>
                <div>
                  <dt>Action</dt>
                  <dd>{selectedEvent.action}</dd>
                </div>
                <div>
                  <dt>Resource</dt>
                  <dd>{selectedEvent.resource}</dd>
                </div>
                <div>
                  <dt>Event Type</dt>
                  <dd>{selectedEvent.eventType}</dd>
                </div>
                <div>
                  <dt>Severity</dt>
                  <dd>
                    <Badge value={selectedEvent.severity} />
                  </dd>
                </div>
                <div>
                  <dt>IP Address</dt>
                  <dd>{selectedEvent.ip}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3>Details</h3>
              <p>{selectedEvent.detail}</p>
              <h3 style={{ marginTop: '16px' }}>Timestamp</h3>
              <p>{selectedEvent.timestamp}</p>
            </div>
          </div>
          <div className="al-modal-actions">
            <button
              type="button"
              className="al-button"
              onClick={() => {
                notify(`Audit event #${selectedEvent.id} exported.`, 'ok');
                setSelectedEvent(null);
              }}
            >
              Export Event
            </button>
            <button
              type="button"
              className="al-button al-button-primary"
              onClick={() => {
                notify(`Alert created for event #${selectedEvent.id}.`, 'ok');
                setSelectedEvent(null);
              }}
            >
              Create Alert
            </button>
          </div>
        </Dialog>
      )}

      {/* Export Audit Logs Modal */}
      {modal === 'export' && (
        <Dialog title="Export Audit Logs" onClose={() => setModal(null)}>
          <form
            className="al-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              exportLogs();
              setModal(null);
            }}
          >
            <label>
              Format
              <select defaultValue="CSV">
                <option>CSV</option>
                <option>JSON</option>
                <option>PDF Summary</option>
              </select>
            </label>
            <label>
              Date Range
              <select defaultValue="Jun 09, 2024 - Jun 15, 2024">
                {dateRanges.map((range) => (
                  <option key={range.value}>{range.label}</option>
                ))}
              </select>
            </label>
            <label>
              Include Details
              <select defaultValue="Full Event Details">
                <option>Full Event Details</option>
                <option>Summary Only</option>
              </select>
            </label>
            <div className="al-modal-actions">
              <button type="button" className="al-button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button type="submit" className="al-button al-button-primary">
                Export
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Schedule Audit Report Modal */}
      {modal === 'schedule' && (
        <Dialog title="Schedule Audit Report" onClose={() => setModal(null)}>
          <form
            className="al-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setModal(null);
              notify('Weekly audit report scheduled locally.', 'ok');
            }}
          >
            <label>
              Report Name
              <input defaultValue="Weekly Audit Summary" required />
            </label>
            <label>
              Frequency
              <select defaultValue="Weekly">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </label>
            <label>
              Recipients
              <input defaultValue="security@acme.com" required />
            </label>
            <div className="al-modal-actions">
              <button type="button" className="al-button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button type="submit" className="al-button al-button-primary">
                Schedule
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Set Alert Rules Modal */}
      {modal === 'alerts' && (
        <Dialog title="Set Alert Rules" onClose={() => setModal(null)}>
          <form
            className="al-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setModal(null);
              notify('Alert rule saved in this demo workspace.', 'ok');
            }}
          >
            <label>
              Rule Name
              <input defaultValue="Repeated Authentication Failures" required />
            </label>
            <label>
              Severity
              <select defaultValue="High">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
            <label>
              Trigger Threshold
              <input type="number" min={1} defaultValue={5} required />
            </label>
            <div className="al-modal-actions">
              <button type="button" className="al-button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button type="submit" className="al-button al-button-primary">
                Save Rule
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Upgrade to Enterprise Modal */}
      {modal === 'enterprise' && (
        <Dialog title="Upgrade to Enterprise" onClose={() => setModal(null)}>
          <div className="al-dialog-copy">
            <p>Enterprise adds long-term retention policies, custom exports, scheduled reports, and real-time alert integrations.</p>
            <button
              type="button"
              className="al-button al-button-primary full-width"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setModal(null);
                notify('Enterprise inquiry saved on this device.', 'ok');
              }}
            >
              Request a Conversation
            </button>
          </div>
        </Dialog>
      )}

      {/* Toast notifications */}
      <div className="al-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <Icon name="checkCircle" />
            <span>{toast.text}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
            >
              <Icon name="close" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
