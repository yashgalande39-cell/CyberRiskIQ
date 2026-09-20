import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Biohazard,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  Database,
  Download,
  FileText,
  Fingerprint,
  IndianRupee,
  Lightbulb,
  RefreshCw,
  Share2,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react';
import '../../styles/riskanalysis.css';
import { CategoryDonut, ConfidenceRing, RiskGauge, RiskHeatmap, RiskTrend } from './risk-analysis/RiskCharts';
import RiskDialogs, { type DialogState } from './risk-analysis/RiskDialogs';
import {
  assets,
  categories,
  completeness,
  exportRiskCsv,
  factors,
  initialEvents,
  loadStringList,
  type RiskEvent,
} from './risk-analysis/risk-data';

export interface RiskAnalysisViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
  theme?: string;
}

function Panel({
  title,
  className = '',
  action,
  children,
}: {
  title: string;
  className?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`panel ${className}`} aria-label={title}>
      <div className="panel-heading">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="warning-icon" aria-hidden="true">
      <path d="M10.2 3.7a2.1 2.1 0 0 1 3.6 0l9 15.6a2.1 2.1 0 0 1-1.8 3.1H3a2.1 2.1 0 0 1-1.8-3.1Z" fill="#ffd341" />
      <path d="M12 9v6" stroke="#544112" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="12" cy="18.3" r="1.2" fill="#544112" />
    </svg>
  );
}

const factorIcons = [Biohazard, Fingerprint, Share2, TrendingUp, ShieldCheck];

export default function RiskAnalysisView({ onNav, externalNotify, theme }: RiskAnalysisViewProps) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [toast, setToast] = useState('');
  const [lightTheme, setLightTheme] = useState(() => {
    if (theme === 'light') return true;
    try {
      return localStorage.getItem('cyberrisk-theme') === 'light';
    } catch {
      return false;
    }
  });
  const [recalculating, setRecalculating] = useState(false);
  const [lastCalculated, setLastCalculated] = useState('Jun 15, 2024, 10:24 AM');
  const [nextCalculation, setNextCalculation] = useState('Jun 16, 2024, 10:00 AM');
  const [events, setEvents] = useState<RiskEvent[]>(initialEvents);
  const [planned, setPlanned] = useState<string[]>(() => loadStringList('cyberrisk-planned'));

  const recalculateTimer = useRef<number | undefined>(undefined);
  const closeDialog = useCallback(() => setDialog(null), []);

  const notify = useCallback(
    (message: string) => {
      setToast(message);
      if (externalNotify) {
        externalNotify(message);
      }
    },
    [externalNotify]
  );

  useEffect(() => {
    if (theme) {
      setLightTheme(theme === 'light');
    }
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberrisk-theme', lightTheme ? 'light' : 'dark');
    } catch {
      /* Preferences remain available for this session. */
    }
  }, [lightTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('cyberrisk-planned', JSON.stringify(planned));
    } catch {
      /* The in-memory investment plan still works. */
    }
  }, [planned]);

  useEffect(() => () => window.clearTimeout(recalculateTimer.current), []);

  const exportAnalysis = () => {
    exportRiskCsv();
    notify('Risk analysis exported as CSV.');
  };

  const recalculate = () => {
    if (recalculating) return;
    setRecalculating(true);
    recalculateTimer.current = window.setTimeout(() => {
      const now = new Date();
      const next = new Date(now);
      next.setDate(next.getDate() + 1);
      next.setHours(10, 0, 0, 0);
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setLastCalculated(now.toLocaleString('en-US', options));
      setNextCalculation(next.toLocaleString('en-US', options));
      setEvents((previous) => [
        {
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          text: 'Risk recalculated (score: 72)',
          color: '#54dfbc',
        },
        ...previous,
      ].slice(0, 12));
      setRecalculating(false);
      notify('Analysis refreshed. Risk score: 72. Confidence: 81%.');
    }, 1200);
  };

  return (
    <div className={`risk-analysis-page ${lightTheme ? 'theme-light' : ''}`}>
      {/* Page Header - Unified to Security Controls Master */}
      <header className="sc-page-header">
        <div>
          <nav className="sc-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => (onNav ? onNav('dashboard') : undefined)}>Home</button>
            <ChevronRight size={11} style={{ transform: 'rotate(-90deg)', color: '#7c9db8' }} />
            <span>Risk Analysis</span>
          </nav>
          <h1>Risk Analysis</h1>
          <p>Turn your security data into actionable insights. Understand, quantify and prioritize your cyber risk.</p>
        </div>
        <div className="sc-header-actions">
          <p>
            TURN DATA INTO DECISIONS<br />
            REDUCE CYBER RISK<br />
            BUILD RESILIENCE
          </p>
          <button className="sc-button sc-button-primary add-control" onClick={exportAnalysis}>
            <Download size={16} />
            <span>Export Analysis</span>
          </button>
        </div>
      </header>

      <main className={`dashboard-layout ${recalculating ? 'is-recalculating' : ''}`}>
        <div className="primary-stack">
          <div className="summary-row">
            <Panel title="Organization Risk Score" className="score-panel">
              <div className="organization-score-body">
                <RiskGauge />
                <div className="score-insight">
                  <div className="risk-change">
                    <ArrowUp size={14} />
                    <strong>8%</strong>
                    <span>vs last month</span>
                  </div>
                  <p>Your organization is currently at high risk. Immediate action is recommended to reduce exposure.</p>
                </div>
              </div>
            </Panel>
            <Panel title="Risk Trend" className="trend-panel">
              <RiskTrend />
            </Panel>
            <Panel title="Data Completeness & Confidence" className="completeness-panel">
              <div className="confidence-body">
                <ConfidenceRing />
                <div className="confidence-legend">
                  {completeness.map((item) => (
                    <button key={item.name} onClick={() => setDialog({ kind: 'confidence' })}>
                      <i style={{ background: item.color }} />
                      <span>{item.name}</span>
                      <strong style={{ color: item.color }}>{item.value}%</strong>
                    </button>
                  ))}
                </div>
              </div>
              <button className="confidence-warning" onClick={() => setDialog({ kind: 'confidence' })}>
                <WarningIcon />
                <span>
                  <strong>Control data is incomplete.</strong>
                  <small>Add more controls to improve risk confidence.</small>
                </span>
              </button>
            </Panel>
          </div>

          <div className="drivers-row">
            <Panel title="Why is your risk 72?" className="risk-drivers">
              <p className="panel-description">
                Your risk score is calculated using multiple factors. Here&apos;s how <span>each factor</span> contributes:
              </p>
              <div className="factor-bars">
                {factors.map((factor, index) => (
                  <button
                    className="factor-bar-row"
                    key={factor.name}
                    onClick={() => setDialog({ kind: 'factor', index })}
                  >
                    <span className="factor-name">{factor.name}</span>
                    <span className="factor-track-area">
                      <span
                        className="factor-track"
                        style={{ width: `${factor.track}%`, '--factor-color': factor.color } as CSSProperties}
                      >
                        <span className="factor-fill" style={{ width: `${factor.fill}%` }} />
                      </span>
                    </span>
                    <strong>+{factor.value}</strong>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Risk Calculation Model" className="model-panel">
              <p className="panel-description">CyberRiskIQ uses a combined factor model to calculate your risk.</p>
              <div className="model-equation">
                <div className="model-factor">
                  <button className="model-tile likelihood-tile" onClick={() => setDialog({ kind: 'model' })}>
                    <Biohazard size={31} strokeWidth={2} />
                    <span>Likelihood</span>
                  </button>
                  <small>
                    Threat<br />Probability
                  </small>
                </div>
                <span className="math-symbol">&#215;</span>
                <div className="model-factor">
                  <button className="model-tile impact-tile" onClick={() => setDialog({ kind: 'model' })}>
                    <Database size={28} fill="#ff883a" stroke="#2c211e" strokeWidth={1.6} />
                    <span>Impact</span>
                  </button>
                  <small>
                    Business<br />Impact (SLE)
                  </small>
                </div>
                <span className="math-symbol">&#215;</span>
                <div className="model-factor">
                  <button className="model-tile exposure-tile" onClick={() => setDialog({ kind: 'model' })}>
                    <Share2 size={28} strokeWidth={2.2} />
                    <span>Exposure</span>
                  </button>
                  <small>
                    External<br />Exposure
                  </small>
                </div>
                <span className="math-symbol">&#215;</span>
                <div className="model-factor">
                  <button className="model-tile control-tile" onClick={() => setDialog({ kind: 'model' })}>
                    <ShieldCheck size={30} fill="#08d4ab" stroke="#002927" strokeWidth={1.7} />
                    <span>
                      Control<br />Modifier
                    </span>
                  </button>
                  <small>
                    Existing<br />Controls
                  </small>
                </div>
                <span className="math-symbol equals-sign">=</span>
                <RiskGauge small />
              </div>
              <div className="formula-box">
                <p>Risk Score = (Threat Likelihood &#215; Business Impact &#215; Exposure) &#215; (1 - Control Effectiveness)</p>
                <button onClick={() => setDialog({ kind: 'model' })}>
                  Learn more <span>about our risk model <ArrowRight size={13} /></span>
                </button>
              </div>
            </Panel>
          </div>

          <div className="analytics-row">
            <Panel title="Risk by Asset Category" className="category-panel">
              <div className="category-body">
                <CategoryDonut onSelect={(category) => setDialog({ kind: 'assets', category })} />
                <div className="category-legend">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setDialog({ kind: 'assets', category: category.name })}
                    >
                      <i style={{ background: category.color }} />
                      <span>{category.name}</span>
                      <strong style={{ color: category.numberColor }}>{category.value}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </Panel>
            <Panel title="Risk Heatmap (Likelihood vs Impact)" className="heatmap-panel">
              <RiskHeatmap />
            </Panel>
          </div>

          <div className="assets-row">
            <Panel
              title="Top Assets by Risk Score"
              className="assets-panel"
              action={
                <button className="text-action" onClick={() => setDialog({ kind: 'assets' })}>
                  View All <ArrowRight size={12} />
                </button>
              }
            >
              <div className="assets-table-wrap">
                <table className="assets-table">
                  <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '17%' }} />
                    <col style={{ width: '10%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Asset Name</th>
                      <th>Type</th>
                      <th>Business Unit</th>
                      <th className="centered">Risk Score</th>
                      <th className="centered">Risk Level</th>
                      <th>Key Issues</th>
                      <th className="centered">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td>{asset.id}</td>
                        <td>{asset.name}</td>
                        <td>{asset.type}</td>
                        <td>{asset.businessUnit}</td>
                        <td className={`centered asset-score score-${asset.level.toLowerCase()}`}>{asset.score}</td>
                        <td className="centered">
                          <span className={`severity severity-${asset.level.toLowerCase()}`}>{asset.level}</span>
                        </td>
                        <td>{asset.issues}</td>
                        <td className="centered">
                          <button
                            className="view-asset-button"
                            onClick={() => setDialog({ kind: 'asset', asset })}
                            aria-label={`View ${asset.name}`}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel
              title="Recent Risk Analysis Activity"
              className="activity-panel"
              action={
                <button className="text-action" onClick={() => setDialog({ kind: 'activity' })}>
                  View All <ArrowRight size={12} />
                </button>
              }
            >
              <ol className="activity-list">
                {events.slice(0, 5).map((event, index) => (
                  <li key={`${event.date}-${index}`}>
                    <i style={{ background: event.color }} />
                    <time>{event.date}</time>
                    <button onClick={() => setDialog({ kind: 'activity' })}>{event.text}</button>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </div>

        <aside className="assessment-rail" aria-label="Risk assessment details">
          <section className="panel assessment-panel">
            <div className="assessment-heading">
              <h2>Risk Assessment Summary</h2>
              <span className="risk-outline-badge">High Risk</span>
            </div>
            <dl className="summary-details">
              <div>
                <dt>Risk Score</dt>
                <dd>
                  <strong className="risk-score-red">72</strong> / 100
                </dd>
              </div>
              <div>
                <dt>Confidence</dt>
                <dd className="teal-text">81%</dd>
              </div>
              <div>
                <dt>Risk Level</dt>
                <dd className="risk-level-red">High</dd>
              </div>
              <div>
                <dt>Last Recalculated</dt>
                <dd className="summary-date">{lastCalculated}</dd>
              </div>
              <div>
                <dt>Next Recalculation</dt>
                <dd className="summary-date">{nextCalculation}</dd>
              </div>
            </dl>
            <h3 className="contributing-title">Top Contributing Factors</h3>
            <div className="contributing-list">
              {factors.map((factor, index) => {
                const Icon = factorIcons[index];
                return (
                  <button key={factor.name} onClick={() => setDialog({ kind: 'factor', index })}>
                    <span
                      className="factor-mini-icon"
                      style={{ color: factor.color, background: `${factor.color}1f` }}
                    >
                      <Icon size={12} strokeWidth={2} />
                    </span>
                    <span>{factor.name}</span>
                    <strong style={{ color: index < 2 ? '#ff354b' : '#ff8142' }}>+{factor.value}</strong>
                  </button>
                );
              })}
            </div>
            <div className="assessment-actions">
              <button className="primary-button" onClick={() => setDialog({ kind: 'financial' })}>
                <IndianRupee size={20} />
                <span>View Financial Exposure</span>
                <ArrowRight size={14} />
              </button>
              <button className="outline-button" onClick={() => setDialog({ kind: 'recommendations' })}>
                <Lightbulb size={20} />
                <span>View Recommendations</span>
                <ArrowRight size={14} />
              </button>
              <button className="outline-button" onClick={() => setDialog({ kind: 'report' })}>
                <FileText size={20} />
                <span>Generate Comprehensive Report</span>
              </button>
            </div>
          </section>

          <section className="panel insufficient-panel">
            <h2>
              Insufficient Data State <span>(Example)</span>
            </h2>
            <div className="insufficient-content">
              <div className="insufficient-description">
                <span className="database-icon">
                  <Database size={25} fill="currentColor" strokeWidth={1.6} />
                </span>
                <div>
                  <h3>Risk score cannot be calculated</h3>
                  <p>
                    At least one asset and one linked vulnerability or control record is required to calculate a
                    meaningful risk score.
                  </p>
                </div>
              </div>
              <ul className="data-checklist">
                <li>
                  <span className="check-circle">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  Assets found (0)
                </li>
                <li>
                  <span className="error-circle">
                    <X size={10} strokeWidth={3} />
                  </span>
                  No vulnerabilities linked
                </li>
                <li>
                  <span className="error-circle">
                    <X size={10} strokeWidth={3} />
                  </span>
                  No controls linked
                </li>
              </ul>
              <button
                className="disabled-button"
                disabled
                title="Illustrative empty state. Open Assets in the sidebar to inspect your current data."
              >
                Add Assets or Import Data
              </button>
            </div>
          </section>

          <div className="rail-bottom-actions">
            <button className="primary-button" disabled={recalculating} onClick={recalculate}>
              <RefreshCw size={18} className={recalculating ? 'spinning' : ''} />
              <span>{recalculating ? 'Calculating...' : 'Recalculate Risk'}</span>
            </button>
            <button className="outline-button" onClick={() => setDialog({ kind: 'assets' })}>
              <ChartNoAxesCombined size={17} />
              <span>View Top Risks</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      </main>

      {dialog && (
        <RiskDialogs
          state={dialog}
          onClose={closeDialog}
          open={setDialog}
          notify={notify}
          events={events}
          planned={planned}
          setPlanned={setPlanned}
          lightTheme={lightTheme}
          setLightTheme={setLightTheme}
          onNav={onNav}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          <span className="check-circle">
            <Check size={12} />
          </span>
          {toast}
          <button aria-label="Dismiss notification" onClick={() => setToast('')}>
            <X size={15} />
          </button>
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {recalculating ? 'Risk calculation in progress.' : ''}
      </div>
    </div>
  );
}
export { RiskAnalysisView };
