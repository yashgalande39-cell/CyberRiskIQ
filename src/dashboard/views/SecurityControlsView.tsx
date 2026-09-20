import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../../components/Icons';
import { ControlDetail } from '../../security/ControlDetail';
import { ControlEditor, AssetMapper } from '../../security/ControlForms';
import { CoverageChart, EffectivenessChart, HorizontalBars } from '../../security/ControlCharts';
import { Badge, Checkbox, Dialog, Pagination, Panel, Popover, Select } from '../../security/UI';
import { EnterpriseInquiry, Workspace, workspaceTitles } from '../../security/Workspace';
import {
  assetInventory,
  categories,
  categoryCoverage,
  controlGaps,
  downloadFile,
  formatLakh,
  frameworkMapping,
  frameworkOptions,
  initialControls,
  readSaved,
  today,
  type Evidence,
  type SecurityControl
} from '../../security/data';

type ModalState =
  | { kind: 'add' }
  | { kind: 'edit' | 'map'; id: string }
  | { kind: 'workspace'; section: string }
  | { kind: 'enterprise' }
  | null;

type Toast = { id: number; text: string };
type Filters = {
  query: string;
  category: string;
  framework: string;
  status: string;
  effectiveness: string;
  minimumCoverage: number;
  maximumCost: number;
  owner: string;
};

const emptyFilters: Filters = {
  query: '',
  category: '',
  framework: '',
  status: '',
  effectiveness: '',
  minimumCoverage: 0,
  maximumCost: 10000,
  owner: ''
};

const controlsKey = 'cyberriskiq-security-controls-v1';

function loadControls(): SecurityControl[] {
  const saved = readSaved<unknown>(controlsKey, null);
  if (
    !Array.isArray(saved) ||
    saved.length === 0 ||
    !saved.every(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.coverage === 'number' &&
        Array.isArray(item.activities) &&
        Array.isArray(item.assetIds) &&
        Array.isArray(item.evidence) &&
        Array.isArray(item.mappings)
    )
  ) {
    return initialControls;
  }
  return saved as SecurityControl[];
}

export interface SecurityControlsViewProps {
  onNav?: (section: string) => void;
  selectedControlId?: string | null;
  onSelectControlId?: (id: string | null) => void;
  theme?: string;
  setTheme?: (theme: string) => void;
  externalNotify?: (text: string) => void;
}

export function SecurityControlsView({
  onNav,
  selectedControlId,
  onSelectControlId,
  theme = 'dark',
  setTheme,
  externalNotify,
}: SecurityControlsViewProps) {
  const [controls, setControls] = useState<SecurityControl[]>(loadControls);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>('mfa');
  const selectedId = selectedControlId !== undefined ? selectedControlId : internalSelectedId;
  const setSelectedId = (id: string | null) => {
    if (onSelectControlId) onSelectControlId(id);
    setInternalSelectedId(id);
  };

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ field: string; descending: boolean } | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [plan, setPlan] = useState<string[]>(() => {
    const saved = readSaved<unknown>('cyberriskiq-control-remediation', []);
    return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRefs = useRef<number[]>([]);
  const storageWarning = useRef(false);

  const notify = useCallback(
    (text: string) => {
      if (externalNotify) externalNotify(text);
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-2), { id, text }]);
      timerRefs.current.push(
        window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4500)
      );
    },
    [externalNotify]
  );

  useEffect(() => () => timerRefs.current.forEach((timer) => window.clearTimeout(timer)), []);

  useEffect(() => {
    try {
      localStorage.setItem(controlsKey, JSON.stringify(controls));
    } catch {
      if (!storageWarning.current) {
        storageWarning.current = true;
        notify('Browser storage is full. Changes will remain available until this tab closes.');
      }
    }
  }, [controls, notify]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberriskiq-control-remediation', JSON.stringify(plan));
    } catch {
      /* In-memory plan remains usable. */
    }
  }, [plan]);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setPage(1);
    setSort(null);
  };

  const filteredControls = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const list = controls.filter((item) => {
      if (query && !`${item.name} ${item.category} ${item.owner}`.toLowerCase().includes(query)) return false;
      if (filters.category && item.category !== filters.category) return false;
      if (filters.framework && !item.frameworks.includes(filters.framework)) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.effectiveness && item.effectiveness !== filters.effectiveness) return false;
      if (item.coverage < filters.minimumCoverage || item.cost > filters.maximumCost) return false;
      if (filters.owner && item.owner !== filters.owner) return false;
      return true;
    });
    if (sort) {
      list.sort((a, b) => {
        let result = 0;
        if (sort.field === 'coverage') result = a.coverage - b.coverage;
        else if (sort.field === 'cost') result = a.cost - b.cost;
        else if (sort.field === 'updated') result = new Date(a.updated).getTime() - new Date(b.updated).getTime();
        else result = a.name.localeCompare(b.name);
        return sort.descending ? -result : result;
      });
    }
    return list;
  }, [controls, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredControls.length / 8));
  const currentPage = Math.min(page, pageCount);
  const visibleControls = filteredControls.slice((currentPage - 1) * 8, currentPage * 8);
  const selectedControl = controls.find((item) => item.id === selectedId);
  const modalControl = modal && 'id' in modal ? controls.find((item) => item.id === modal.id) : undefined;
  const allChecked = visibleControls.length > 0 && visibleControls.every((item) => selectedRows.includes(item.id));
  const partlyChecked = !allChecked && visibleControls.some((item) => selectedRows.includes(item.id));
  const filtered = Object.entries(filters).some(([key, value]) =>
    key === 'maximumCost' ? value !== 10000 : Boolean(value)
  );
  const deployed = controls.filter((item) => item.status === 'Deployed').length;
  const coverage = Math.round(controls.reduce((sum, item) => sum + item.coverage, 0) / Math.max(1, controls.length));

  function selectControl(id: string) {
    setSelectedId(controls.some((item) => item.id === id) ? id : controls[0]?.id || null);
    setModal(null);
    if (window.innerWidth < 961) {
      window.setTimeout(() => document.getElementById('control-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }

  function updateControl(id: string, change: Partial<SecurityControl>, action: string) {
    setControls((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...change,
              updated: today(),
              activities: [{ date: today(), action, actor: 'Y. Galande', color: '#00d3ad' }, ...item.activities].slice(0, 20)
            }
          : item
      )
    );
  }

  function addToPlan(id: string) {
    const name = controls.find((item) => item.id === id)?.name;
    if (!name) return;
    if (plan.includes(id)) {
      setModal({ kind: 'workspace', section: 'optimization' });
      return;
    }
    setPlan((current) => [...current, id]);
    updateControl(id, {}, 'Added to remediation plan');
    notify(`${name} added to your local remediation plan.`);
  }

  function markDeployed(id: string) {
    const item = controls.find((control) => control.id === id);
    if (!item) return;
    updateControl(id, { status: 'Deployed' }, item.status === 'Deployed' ? 'Deployment verified' : 'Marked as deployed');
    notify(item.status === 'Deployed' ? `${item.name}: deployment verified.` : `${item.name} marked as deployed.`);
  }

  function exportControls(all = false) {
    const rows = all
      ? controls
      : selectedRows.length
      ? controls.filter((item) => selectedRows.includes(item.id))
      : filteredControls;
    const cell = (input: string | number) => {
      let value = String(input);
      if (/^[=+@-]/.test(value)) value = `'${value}`;
      return `"${value.replace(/"/g, '""')}"`;
    };
    const fields = [
      'Control Name',
      'Category',
      'Frameworks',
      'Assets Covered',
      'Coverage (%)',
      'Effectiveness',
      'Implementation Cost (INR Lakh)',
      'Operating Cost (INR Lakh)',
      'Status',
      'Last Updated',
      'Owner'
    ];
    const csv = [
      fields,
      ...rows.map((item) => [
        item.name,
        item.category,
        item.frameworks.join('; '),
        item.assets,
        item.coverage,
        item.effectiveness,
        item.cost,
        item.operatingCost,
        item.status,
        item.updated,
        item.owner
      ])
    ]
      .map((row) => row.map(cell).join(','))
      .join('\r\n');
    downloadFile('CyberRiskIQ-Security-Controls.csv', `\uFEFF${csv}`, 'text/csv;charset=utf-8');
    notify(`${rows.length} controls exported to CSV.`);
  }

  function handleSort(field: string) {
    setSort((current) => ({
      field,
      descending: current?.field === field ? !current.descending : false
    }));
  }

  function openWorkspace(section: string) {
    if (section === 'dashboard' && onNav) {
      onNav('dashboard');
      return;
    }
    if (onNav && ['assets', 'vulnerabilities', 'intel', 'analysis', 'exposure', 'optimization', 'recommendations', 'whatif', 'reports', 'compliance', 'audit', 'integrations', 'settings'].includes(section)) {
      onNav(section);
      return;
    }
    setModal({ kind: 'workspace', section });
  }

  function saveControl(control: SecurityControl) {
    const exists = controls.some((item) => item.id === control.id);
    if (controls.some((item) => item.id !== control.id && item.name.toLowerCase() === control.name.toLowerCase())) {
      notify('A control with this name already exists. Please choose a unique name.');
      return;
    }
    setControls((current) => (exists ? current.map((item) => (item.id === control.id ? control : item)) : [control, ...current]));
    setSelectedId(control.id);
    setModal(null);
    clearFilters();
    notify(exists ? 'Control changes saved to this workspace.' : `${control.name} added to the inventory.`);
  }

  const stats = [
    { label: 'Total Controls', value: controls.length, icon: 'shield', color: 'indigo', delta: '18%', note: 'vs last quarter', direction: 'arrowUp', tone: 'good' },
    { label: 'Deployed Controls', value: deployed, icon: 'checkCircle', color: 'green', note: `${Math.round((deployed / controls.length) * 100)}% of total`, tone: 'muted' },
    { label: 'Coverage', value: `${coverage}%`, icon: 'pie', color: 'blue', delta: '12%', note: 'vs last quarter', direction: 'arrowUp', tone: 'good' },
    { label: 'Control Gaps', value: controls.length - deployed, icon: 'alert', color: 'red', delta: '24%', note: 'vs last quarter', direction: 'arrowDown', tone: 'bad' },
    { label: 'Security Spend', value: `\u20b9 ${(controls.reduce((sum, item) => sum + item.cost, 0) / 100).toFixed(1)} Cr`, icon: 'coins', color: 'orange', delta: '15%', note: 'this year', direction: 'arrowUp', tone: 'good' }
  ];

  return (
    <main className="sc-content" id="controls-content" tabIndex={-1}>
      <header className="sc-page-header">
        <div>
          <nav className="sc-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => openWorkspace('dashboard')}>Home</button>
            <Icon name="chevron" />
            <span>Security Controls</span>
          </nav>
          <h1>Security Controls</h1>
          <p>Configure, monitor, and measure control coverage across your organization.</p>
        </div>
        <div className="sc-header-actions">
          <p>
            STRONGER CONTROLS<br />
            LOWER RISKS<br />
            SAFER TOMORROW
          </p>
          <button className="sc-button sc-button-primary add-control" onClick={() => setModal({ kind: 'add' })}>
            <Icon name="plus" />Add Control
          </button>
        </div>
      </header>

      <div className={`sc-content-grid ${selectedControl ? '' : 'detail-is-closed'}`}>
        <div className="sc-main-column">
          <div className="sc-metrics">
            {stats.map((item) => (
              <article key={item.label} className={`sc-metric metric-${item.color}`}>
                <span className="sc-metric-icon">
                  <Icon name={item.icon} />
                </span>
                <div>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                  <span className={`metric-note ${item.tone}`}>
                    {item.direction && <Icon name={item.direction} />}
                    {item.delta && <b>{item.delta}</b>}
                    <small>{item.note}</small>
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="sc-analytics-grid">
            <Panel title="Control Coverage Trend" className="coverage-panel">
              <CoverageChart />
            </Panel>
            <Panel title="Control Effectiveness Distribution" className="effectiveness-panel">
              <EffectivenessChart
                total={controls.length}
                onFilter={(value) => {
                  if (value === 'Gap') setFilter('status', 'Gap');
                  else setFilter('effectiveness', value);
                }}
              />
            </Panel>
            <Panel title="Framework Mapping" className="framework-panel">
              <HorizontalBars data={frameworkMapping} onSelect={(value) => setFilter('framework', value)} />
            </Panel>
          </div>

          <section className="control-inventory" aria-label="Security control inventory">
            <div className="sc-filter-toolbar">
              <div className="sc-search-field control-search">
                <Icon name="search" />
                <input
                  value={filters.query}
                  onChange={(event) => setFilter('query', event.target.value)}
                  placeholder="Search controls by name, category..."
                  aria-label="Search controls by name or category"
                />
                {filters.query && (
                  <button onClick={() => setFilter('query', '')} aria-label="Clear control search">
                    <Icon name="close" />
                  </button>
                )}
              </div>
              <Select
                label="Filter category"
                className="category-filter"
                value={filters.category}
                onChange={(value) => setFilter('category', value)}
                options={[{ value: '', label: 'Category' }, ...categories.map((value) => ({ value, label: value }))]}
              />
              <Select
                label="Filter framework"
                className="framework-filter"
                value={filters.framework}
                onChange={(value) => setFilter('framework', value)}
                options={[{ value: '', label: 'Framework' }, ...frameworkOptions.map((value) => ({ value, label: value }))]}
              />
              <Select
                label="Filter status"
                className="status-filter"
                value={filters.status}
                onChange={(value) => setFilter('status', value)}
                options={[{ value: '', label: 'Status' }, ...['Deployed', 'Partial', 'Gap'].map((value) => ({ value, label: value }))]}
              />
              <Select
                label="Filter effectiveness"
                className="effectiveness-filter"
                value={filters.effectiveness}
                onChange={(value) => setFilter('effectiveness', value)}
                options={[{ value: '', label: 'Effectiveness' }, ...['High', 'Medium', 'Low'].map((value) => ({ value, label: value }))]}
              />
              <Popover
                label="More filters"
                width={275}
                className={`sc-button more-filters ${
                  filters.minimumCoverage || filters.maximumCost !== 10000 || filters.owner ? 'has-filter' : ''
                }`}
                trigger={<><Icon name="sliders" />More Filters</>}
              >
                {(close) => (
                  <div className="sc-more-filters">
                    <h3>Advanced Filters</h3>
                    <label>
                      Minimum Coverage <strong>{filters.minimumCoverage}%</strong>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={filters.minimumCoverage}
                        onChange={(event) => setFilter('minimumCoverage', Number(event.target.value))}
                      />
                    </label>
                    <label>
                      Maximum Cost (&#8377; L)
                      <input
                        type="number"
                        min={0}
                        max={10000}
                        step={0.5}
                        value={filters.maximumCost}
                        onChange={(event) => setFilter('maximumCost', Number(event.target.value))}
                      />
                    </label>
                    <label>
                      Owner
                      <select value={filters.owner} onChange={(event) => setFilter('owner', event.target.value)}>
                        <option value="">All Owners</option>
                        {[...new Set(controls.map((item) => item.owner))].map((owner) => (
                          <option key={owner}>{owner}</option>
                        ))}
                      </select>
                    </label>
                    <div>
                      <button className="sc-text-button" onClick={clearFilters}>Clear All Filters</button>
                      <button className="sc-button sc-button-primary" onClick={close}>Done</button>
                    </div>
                  </div>
                )}
              </Popover>
              <button className="sc-button export-button" onClick={() => exportControls()}>
                <Icon name="download" />Export
              </button>
            </div>

            {(filtered || selectedRows.length > 0) && (
              <div className="sc-filter-summary">
                <span>
                  {filtered ? `${filteredControls.length} controls match your filters` : `${selectedRows.length} controls selected`}
                </span>
                {selectedRows.length > 0 && (
                  <button
                    className="sc-text-button"
                    onClick={() => {
                      selectedRows.forEach(markDeployed);
                      setSelectedRows([]);
                    }}
                  >
                    Mark Selected as Deployed
                  </button>
                )}
                <button
                  className="sc-text-button"
                  onClick={() => {
                    clearFilters();
                    setSelectedRows([]);
                  }}
                >
                  Clear <Icon name="close" />
                </button>
              </div>
            )}

            <div className="sc-table-container">
              <table className="sc-controls-table">
                <colgroup>
                  <col style={{ width: '2.8%' }} />
                  <col style={{ width: '19.2%' }} />
                  <col style={{ width: '11.4%' }} />
                  <col style={{ width: '8.6%' }} />
                  <col style={{ width: '8.7%' }} />
                  <col style={{ width: '7.5%' }} />
                  <col style={{ width: '9.2%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '6.6%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <Checkbox
                        label="Select all controls on this page"
                        checked={allChecked}
                        mixed={partlyChecked}
                        onChange={() =>
                          setSelectedRows((current) =>
                            allChecked
                              ? current.filter((id) => !visibleControls.some((item) => item.id === id))
                              : [...new Set([...current, ...visibleControls.map((item) => item.id)])]
                          )
                        }
                      />
                    </th>
                    <th><button onClick={() => handleSort('name')}>Control Name</button></th>
                    <th>Category</th>
                    <th>Frameworks</th>
                    <th>Assets Covered</th>
                    <th><button onClick={() => handleSort('coverage')}>Coverage</button></th>
                    <th>Effectiveness</th>
                    <th><button onClick={() => handleSort('cost')}>Cost (&#8377;)</button></th>
                    <th>Status</th>
                    <th><button onClick={() => handleSort('updated')}>Last Updated</button></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleControls.map((item) => (
                    <tr
                      key={item.id}
                      className={selectedId === item.id ? 'is-selected' : ''}
                      onClick={() => selectControl(item.id)}
                    >
                      <td>
                        <Checkbox
                          label={`Select ${item.name}`}
                          checked={selectedRows.includes(item.id)}
                          onChange={() =>
                            setSelectedRows((current) =>
                              current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="control-name-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            selectControl(item.id);
                          }}
                          title={item.name}
                        >
                          <Icon name={item.icon} />
                          <span>{item.name}</span>
                        </button>
                      </td>
                      <td title={item.category}>{item.category}</td>
                      <td>{item.frameworks.join(', ')}</td>
                      <td className="table-centered">{item.assets}</td>
                      <td className={`table-coverage ${item.coverage < 70 ? 'coverage-warn' : ''}`}>{item.coverage}%</td>
                      <td><Badge value={item.effectiveness} /></td>
                      <td className="table-centered">{formatLakh(item.cost)} L</td>
                      <td><Badge value={item.status} /></td>
                      <td>{item.updated}</td>
                      <td>
                        <Popover
                          label={`Actions for ${item.name}`}
                          width={225}
                          className="table-more-button"
                          trigger={<Icon name="more" />}
                        >
                          {(close) => (
                            <div className="sc-popover-menu">
                              <span className="sc-menu-heading">{item.name}</span>
                              <button onClick={() => { close(); setModal({ kind: 'edit', id: item.id }); }}>
                                <Icon name="pencil" />Edit Control
                              </button>
                              <button onClick={() => { close(); setModal({ kind: 'map', id: item.id }); }}>
                                <Icon name="mapAssets" />Map Assets
                              </button>
                              <button onClick={() => { close(); markDeployed(item.id); }}>
                                <Icon name="checkCircle" />Mark as Deployed
                              </button>
                              <button onClick={() => { close(); addToPlan(item.id); }}>
                                <Icon name="report" />Add to Remediation Plan
                              </button>
                            </div>
                          )}
                        </Popover>
                      </td>
                    </tr>
                  ))}
                  {!visibleControls.length && (
                    <tr>
                      <td colSpan={11}>
                        <div className="sc-empty">
                          <Icon name="search" />
                          <h3>No controls match these filters.</h3>
                          <p>Try another search or reset your filters.</p>
                          <button className="sc-button" onClick={clearFilters}>Clear Filters</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="sc-inventory-footer">
              <p>
                Showing {filteredControls.length ? (currentPage - 1) * 8 + 1 : 0}&ndash;
                {Math.min(currentPage * 8, filteredControls.length)} of {filteredControls.length} controls
              </p>
              <Pagination page={currentPage} pages={pageCount} onPage={setPage} />
            </footer>
          </section>

          <div className="sc-bottom-grid">
            <Panel title="Asset Coverage by Control Category" className="category-coverage-panel">
              <HorizontalBars data={categoryCoverage} onSelect={(value) => setFilter('category', value)} />
            </Panel>
            <Panel
              title="Control Gaps Requiring Attention"
              className="control-gaps-panel"
              action={
                <button className="sc-text-button" onClick={() => setModal({ kind: 'workspace', section: 'analysis' })}>
                  View All <Icon name="arrowRight" />
                </button>
              }
            >
              <table className="sc-gaps-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Control Area</th>
                    <th>Impact</th>
                    <th>Affected Assets</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {controlGaps.map((item, index) => (
                    <tr key={item.id} onClick={() => selectControl(item.id)}>
                      <td>{index + 1}</td>
                      <td><button onClick={() => selectControl(item.id)}>{item.name}</button></td>
                      <td className={item.impact === 'High' ? 'gap-impact-high' : 'gap-impact-medium'}>{item.impact}</td>
                      <td>{item.assets}</td>
                      <td><Badge value={item.priority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel title="How Controls Reduce Risk" className="reduce-risk-panel">
              <div className="risk-flow">
                {[
                  { icon: 'shield', lines: ['Security', 'Controls'] },
                  { icon: 'optim', lines: ['Lower', 'Vulnerabilities'] },
                  { icon: 'gear', lines: ['Reduced', 'Risk Score'] },
                  { icon: 'arrowUp', lines: ['Lower', 'Financial Loss'] }
                ].map((item, index) => (
                  <div className="risk-flow-step" key={item.icon}>
                    <button onClick={() => openWorkspace(index === 0 ? 'dashboard' : index === 1 ? 'vulnerabilities' : index === 2 ? 'analysis' : 'exposure')}>
                      <Icon name={item.icon} />
                      <span>{item.lines[0]}<br />{item.lines[1]}</span>
                    </button>
                    {index < 3 && <Icon name="arrowRight" className="risk-flow-arrow" />}
                  </div>
                ))}
              </div>
              <p>&ldquo;Invest in controls today, avoid bigger losses tomorrow.&rdquo;</p>
            </Panel>
          </div>
        </div>

        {selectedControl && (
          <ControlDetail
            control={selectedControl}
            onClose={() => setSelectedId(null)}
            onEdit={() => setModal({ kind: 'edit', id: selectedControl.id })}
            onMap={() => setModal({ kind: 'map', id: selectedControl.id })}
            onPlan={() => addToPlan(selectedControl.id)}
            onDeploy={() => markDeployed(selectedControl.id)}
            planned={plan.includes(selectedControl.id)}
            onEvidence={(evidence: Evidence) =>
              updateControl(selectedControl.id, { evidence: [...selectedControl.evidence, evidence] }, 'Evidence attached')
            }
            notify={notify}
          />
        )}
      </div>

      {modal?.kind === 'add' && (
        <Dialog title="Add Security Control" subtitle="Define a new control and map it to your security frameworks." onClose={() => setModal(null)}>
          <ControlEditor onSave={saveControl} onCancel={() => setModal(null)} />
        </Dialog>
      )}
      {modal?.kind === 'edit' && modalControl && (
        <Dialog title="Edit Security Control" subtitle={modalControl.name} onClose={() => setModal(null)}>
          <ControlEditor control={modalControl} onSave={saveControl} onCancel={() => setModal(null)} />
        </Dialog>
      )}
      {modal?.kind === 'map' && modalControl && (
        <Dialog title="Map Assets" subtitle={modalControl.name} onClose={() => setModal(null)} wide>
          <AssetMapper
            control={modalControl}
            onCancel={() => setModal(null)}
            onSave={(ids) => {
              const eligible = assetInventory.slice(0, modalControl.totalAssets);
              updateControl(
                modalControl.id,
                {
                  assetIds: ids,
                  assets: ids.length,
                  coverage: Math.round((ids.length / Math.max(1, eligible.length)) * 100)
                },
                `${ids.length} assets mapped`
              );
              setModal(null);
              setSelectedId(modalControl.id);
              notify(`Asset mapping saved. ${ids.length} assets protected.`);
            }}
          />
        </Dialog>
      )}
      {modal?.kind === 'workspace' && (
        <Dialog title={workspaceTitles[modal.section] || 'Workspace'} onClose={() => setModal(null)} wide>
          <Workspace
            key={modal.section}
            section={modal.section}
            controls={controls}
            plan={plan}
            selectControl={selectControl}
            addToPlan={addToPlan}
            removeFromPlan={(id) => {
              setPlan((current) => current.filter((item) => item !== id));
              notify('Control removed from your remediation plan.');
            }}
            exportControls={() => exportControls(true)}
            notify={notify}
            theme={theme}
            setTheme={setTheme || (() => {})}
          />
        </Dialog>
      )}
      {modal?.kind === 'enterprise' && (
        <Dialog title="Upgrade to Enterprise" subtitle="Stronger security, built around your organization." onClose={() => setModal(null)}>
          <EnterpriseInquiry onClose={() => setModal(null)} />
        </Dialog>
      )}

      <div className="sc-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <Icon name="checkCircle" />
            <span>{toast.text}</span>
            <button aria-label="Dismiss notification" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}>
              <Icon name="close" />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
