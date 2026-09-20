import { useState, type Dispatch, type SetStateAction } from 'react';
import { ArrowDownUp, ArrowRight, Check, Download, FileText, Info, Plus, Search, ShieldCheck } from 'lucide-react';
import Dialog from './Dialog';
import {
  assets,
  categories,
  completeness,
  downloadFile,
  exportRiskCsv,
  factors,
  loadStringList,
  recommendations,
  type Asset,
  type RiskEvent,
} from './risk-data';

export type DialogState =
  | { kind: 'asset'; asset: Asset }
  | { kind: 'assets'; category?: string }
  | { kind: 'factor'; index: number }
  | { kind: 'financial' | 'recommendations' | 'report' | 'activity' | 'model' | 'confidence' | 'enterprise' }
  | { kind: 'workspace'; name: string };

type Props = {
  state: DialogState;
  onClose: () => void;
  open: (state: DialogState) => void;
  notify: (message: string) => void;
  events: RiskEvent[];
  planned: string[];
  setPlanned: Dispatch<SetStateAction<string[]>>;
  lightTheme: boolean;
  setLightTheme: Dispatch<SetStateAction<boolean>>;
  onNav?: (tabId: string) => void;
};

function AssetExplorer({ category: initialCategory, open }: { category?: string; open: Props['open'] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory || 'All categories');
  const [descending, setDescending] = useState(true);
  const filtered = assets
    .filter(
      (asset) =>
        (category === 'All categories' || asset.category === category) &&
        `${asset.name} ${asset.businessUnit} ${asset.type}`.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => (descending ? b.score - a.score : a.score - b.score));

  return (
    <>
      <div className="dialog-filters">
        <label className="dialog-search">
          <Search size={16} />
          <input
            placeholder="Search assets or business units"
            aria-label="Filter assets"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Asset category"
        >
          <option>All categories</option>
          {categories.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <button
          className="outline-button"
          onClick={() => {
            exportRiskCsv();
          }}
        >
          <Download size={15} />Export
        </button>
      </div>
      <div className="dialog-table-wrap">
        <table className="dialog-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Business unit</th>
              <th>
                <button onClick={() => setDescending(!descending)}>
                  Risk score <ArrowDownUp size={12} />
                </button>
              </th>
              <th>Key issues</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr key={asset.id}>
                <td>
                  <strong>{asset.name}</strong>
                  <small>{asset.type}</small>
                </td>
                <td>{asset.businessUnit}</td>
                <td>
                  <span className={`severity severity-${asset.level.toLowerCase()}`}>
                    {asset.score} / {asset.level}
                  </span>
                </td>
                <td>{asset.issues}</td>
                <td>
                  <button className="text-action" onClick={() => open({ kind: 'asset', asset })}>
                    View details <ArrowRight size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <div className="dialog-empty">
          <Search size={26} />
          <h3>No matching assets in this snapshot</h3>
          <p>
            Category metrics represent the wider organization. The available asset snapshot contains
            the five highest-priority records.
          </p>
          <button
            className="outline-button"
            onClick={() => {
              setQuery('');
              setCategory('All categories');
            }}
          >
            Show all available assets
          </button>
        </div>
      )}
      <p className="dialog-footnote">
        {filtered.length} of {assets.length} available assets. Select an asset to review its risk and remediation actions.
      </p>
    </>
  );
}

function ScenarioModel({ notify }: { notify: Props['notify'] }) {
  const [values, setValues] = useState([90, 100, 100, 20]);
  const labels = ['Threat likelihood', 'Business impact', 'External exposure', 'Control effectiveness'];
  const score = Math.round(
    (values[0] / 100) * (values[1] / 100) * (values[2] / 100) * (1 - values[3] / 100) * 100
  );

  return (
    <>
      <p className="dialog-lead">
        Explore how stronger controls and reduced exposure affect your risk. These scenario inputs are
        normalized to a 0-100 scale and do not change the live assessment.
      </p>
      <div className="scenario-layout">
        <div className="scenario-sliders">
          {labels.map((label, index) => (
            <label key={label}>
              <span>
                {label}
                <strong>{values[index]}%</strong>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={values[index]}
                onChange={(event) =>
                  setValues((previous) =>
                    previous.map((value, position) =>
                      position === index ? Number(event.target.value) : value
                    )
                  )
                }
              />
            </label>
          ))}
        </div>
        <div className="scenario-result">
          <small>PROJECTED RISK SCORE</small>
          <strong className={score >= 70 ? 'score-critical' : 'teal-text'}>
            {score}
            <span>/ 100</span>
          </strong>
          <span
            className={`severity severity-${
              score >= 85 ? 'critical' : score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'
            }`}
          >
            {score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'} Risk
          </span>
          <p>
            {72 - score >= 0
              ? `${72 - score} points lower`
              : `${score - 72} points higher`}{' '}
            than the current score
          </p>
        </div>
      </div>
      <div className="dialog-note">
        <Info size={17} />
        <p>
          Risk = (Likelihood &#215; Impact &#215; Exposure) &#215; (1 - Control Effectiveness). The
          organizational model also uses threat context and evidence quality. Individual contributions
          are not a simple sum.
        </p>
      </div>
      <div className="dialog-actions">
        <button className="outline-button" onClick={() => setValues([90, 100, 100, 20])}>
          Reset scenario
        </button>
        <button
          className="primary-button"
          onClick={() => {
            downloadFile(
              'CyberRiskIQ-What-If-Scenario.json',
              JSON.stringify(
                {
                  inputs: Object.fromEntries(labels.map((label, index) => [label, values[index]])),
                  projectedScore: score,
                  baselineScore: 72,
                },
                null,
                2
              ),
              'application/json'
            );
            notify('What-if scenario exported.');
          }}
        >
          <Download size={16} />Export scenario
        </button>
      </div>
    </>
  );
}

function ConfidenceReview({ notify }: { notify: Props['notify'] }) {
  const [reviewed, setReviewed] = useState<string[]>(() =>
    loadStringList('cyberrisk-control-review', ['Endpoint protection'])
  );

  return (
    <>
      <p className="dialog-lead">
        Confidence is based on the completeness of your asset, vulnerability, control, and threat
        intelligence records. Controls are the largest evidence gap.
      </p>
      <div className="completeness-detail">
        {completeness.map((item) => (
          <div key={item.name}>
            <span>{item.name}</span>
            <div>
              <i style={{ width: `${item.value}%`, background: item.color }} />
            </div>
            <strong style={{ color: item.color }}>{item.value}%</strong>
          </div>
        ))}
      </div>
      <h3 className="dialog-section-title">Control evidence checklist</h3>
      <p className="muted-copy">
        Review these controls and save your checklist locally. Completeness scores require validated source
        evidence to change.
      </p>
      <div className="evidence-list">
        {['Endpoint protection', 'Multi-factor authentication', 'Backup and recovery', 'Centralized security logging'].map(
          (name) => (
            <label key={name}>
              <input
                type="checkbox"
                checked={reviewed.includes(name)}
                onChange={() =>
                  setReviewed((previous) =>
                    previous.includes(name)
                      ? previous.filter((value) => value !== name)
                      : [...previous, name]
                  )
                }
              />
              <span>{name}</span>
              <small>{reviewed.includes(name) ? 'Reviewed' : 'Needs evidence'}</small>
            </label>
          )
        )}
      </div>
      <div className="dialog-actions">
        <button
          className="primary-button"
          onClick={() => {
            try {
              localStorage.setItem('cyberrisk-control-review', JSON.stringify(reviewed));
            } catch {
              /* The selection remains in memory. */
            }
            notify(`${reviewed.length} control reviews saved in this browser.`);
          }}
        >
          <Check size={16} />Save review checklist
        </button>
      </div>
    </>
  );
}

function ReportBuilder({ notify, planned }: { notify: Props['notify']; planned: string[] }) {
  const [format, setFormat] = useState('html');
  const [includeRecommendations, setIncludeRecommendations] = useState(true);

  const generate = () => {
    if (format === 'csv') {
      exportRiskCsv();
    } else if (format === 'json') {
      downloadFile(
        'CyberRiskIQ-Comprehensive-Report.json',
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            riskScore: 72,
            confidence: 81,
            riskLevel: 'High',
            factors,
            completeness,
            assets,
            recommendations: includeRecommendations ? recommendations : [],
            investmentPlan: planned,
          },
          null,
          2
        ),
        'application/json'
      );
    } else {
      const table = assets
        .map(
          (asset) =>
            `<tr><td>${asset.name}</td><td>${asset.businessUnit}</td><td>${asset.score}</td><td>${asset.level}</td><td>${asset.issues}</td></tr>`
        )
        .join('');
      const list = includeRecommendations
        ? `<h2>Recommended actions</h2><ul>${recommendations
            .map(
              (item) =>
                `<li><strong>${item.name}</strong>: ${item.detail} Estimated risk reduction: ${item.reduction}.</li>`
            )
            .join('')}</ul>`
        : '';
      downloadFile(
        'CyberRiskIQ-Comprehensive-Report.html',
        `<!doctype html><html lang="en"><meta charset="utf-8"><title>CyberRiskIQ Risk Assessment</title><style>body{font:15px/1.65 Arial,sans-serif;max-width:1000px;margin:50px auto;padding:0 24px;color:#143047}h1{color:#005cff}h2{margin-top:32px}table{border-collapse:collapse;width:100%}td,th{padding:12px;text-align:left;border-bottom:1px solid #d5e5ed}th{background:#eff7fb}.metrics{display:flex;gap:50px;padding:20px;background:#eff7fb}.metrics strong{font-size:28px}footer{margin-top:40px;color:#526978;font-size:12px}li{margin:12px 0}@media print{body{margin:0}}</style><body><h1>CyberRiskIQ</h1><h2>Comprehensive Risk Assessment</h2><p>Generated ${new Date().toLocaleString(
          'en-US'
        )}</p><div class="metrics"><div>Risk score<br><strong>72 / 100</strong></div><div>Confidence<br><strong>81%</strong></div><div>Risk level<br><strong>High</strong></div></div><h2>Top contributing factors</h2><ul>${factors
          .map((factor) => `<li>${factor.name}: +${factor.value}</li>`)
          .join('')}</ul><h2>Top assets by risk score</h2><table><thead><tr><th>Asset</th><th>Business unit</th><th>Risk score</th><th>Risk level</th><th>Issues</th></tr></thead><tbody>${table}</tbody></table>${list}<h2>Data confidence</h2><p>Control data is incomplete. Add and validate control evidence to improve risk confidence.</p><footer>From Risk to Resilience. This report was generated locally from the dashboard reference dataset. Open this file in your browser and select Print to save as PDF.</footer></body></html>`,
        'text/html;charset=utf-8'
      );
    }
    notify('Your comprehensive risk report has been downloaded.');
  };

  return (
    <>
      <div className="report-intro">
        <FileText size={38} />
        <div>
          <h3>Organization Risk Assessment</h3>
          <p>Risk score, confidence, contributing factors, and asset-level findings in one report.</p>
        </div>
      </div>
      <label className="form-field">
        Report format
        <select value={format} onChange={(event) => setFormat(event.target.value)}>
          <option value="html">Printable report (HTML / save as PDF)</option>
          <option value="csv">Asset analysis (CSV)</option>
          <option value="json">Comprehensive data (JSON)</option>
        </select>
      </label>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={includeRecommendations}
          onChange={(event) => setIncludeRecommendations(event.target.checked)}
          disabled={format === 'csv'}
        />
        Include recommendations and investment plan
      </label>
      <p className="dialog-footnote">
        Reports are generated locally using the visible assessment data. For a PDF, open the HTML report
        and choose Print, then Save as PDF.
      </p>
      <div className="dialog-actions">
        <button className="primary-button" onClick={generate}>
          <Download size={17} />Generate & download report
        </button>
      </div>
    </>
  );
}

function WorkspaceView({
  name,
  open,
  lightTheme,
  setLightTheme,
  notify,
}: { name: string } & Pick<Props, 'open' | 'lightTheme' | 'setLightTheme' | 'notify'>) {
  const [connections, setConnections] = useState(['CISA', 'NVD', 'CrowdStrike']);
  const [threshold, setThreshold] = useState(() => {
    try {
      return localStorage.getItem('cyberrisk-alert-threshold') || '70';
    } catch {
      return '70';
    }
  });

  if (name === 'Integrations') {
    return (
      <>
        <p className="dialog-lead">Manage the intelligence sources associated with this local workspace.</p>
        <div className="integration-list">
          {['CISA', 'NVD', 'CrowdStrike', 'Mandiant', 'Microsoft Defender'].map((source) => (
            <div key={source}>
              <ShieldCheck size={23} />
              <span>
                <strong>{source}</strong>
                <small>{connections.includes(source) ? 'Connected to demo workspace' : 'Not connected'}</small>
              </span>
              <button
                className={connections.includes(source) ? 'outline-button' : 'primary-button'}
                onClick={() => {
                  setConnections((previous) =>
                    previous.includes(source)
                      ? previous.filter((value) => value !== source)
                      : [...previous, source]
                  );
                  notify(
                    `${source} ${
                      connections.includes(source) ? 'disconnected' : 'connected'
                    } in the demo workspace.`
                  );
                }}
              >
                {connections.includes(source) ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
        <p className="dialog-footnote">Demo connections are local. No credentials are sent and no external services are contacted.</p>
      </>
    );
  }

  if (name === 'Settings') {
    return (
      <>
        <h3 className="dialog-section-title">Workspace preferences</h3>
        <label className="setting-row">
          <span>
            Light appearance<small>Switch the dashboard color theme.</small>
          </span>
          <input type="checkbox" checked={lightTheme} onChange={() => setLightTheme(!lightTheme)} />
        </label>
        <label className="form-field">
          High-risk alert threshold
          <select value={threshold} onChange={(event) => setThreshold(event.target.value)}>
            <option value="60">60 / 100</option>
            <option value="70">70 / 100 (recommended)</option>
            <option value="80">80 / 100</option>
          </select>
        </label>
        <div className="dialog-actions">
          <button
            className="primary-button"
            onClick={() => {
              localStorage.setItem('cyberrisk-alert-threshold', threshold);
              notify('Workspace preferences saved.');
            }}
          >
            <Check size={16} />Save preferences
          </button>
        </div>
      </>
    );
  }

  if (name === 'Vulnerabilities') {
    return (
      <>
        <p className="dialog-lead">Prioritized findings linked to your highest-risk assets.</p>
        <div className="finding-list">
          {assets.map((asset) => (
            <button key={asset.id} onClick={() => open({ kind: 'asset', asset })}>
              <span className={`severity severity-${asset.level.toLowerCase()}`}>{asset.level}</span>
              <span>
                <strong>{asset.name}</strong>
                <small>{asset.issues}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </>
    );
  }

  if (name === 'Threat Intelligence') {
    return (
      <>
        <p className="dialog-lead">Threat context currently contributing to your assessment.</p>
        <div className="finding-list">
          {[
            {
              name: 'Active exploitation of critical vulnerabilities',
              text: 'Prioritize publicly exposed payment and finance systems.',
              index: 0,
            },
            {
              name: 'Elevated threat likelihood',
              text: 'Current threat activity contributes +11 to the risk profile.',
              index: 3,
            },
            {
              name: 'Internet-facing attack surface',
              text: 'Review external exposure and restrict unnecessary services.',
              index: 2,
            },
          ].map((item) => (
            <button key={item.name} onClick={() => open({ kind: 'factor', index: item.index })}>
              <ShieldCheck size={23} />
              <span>
                <strong>{item.name}</strong>
                <small>{item.text}</small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="overview-metrics">
        <div>
          <span>Organization risk</span>
          <strong className="score-critical">
            72<small>/ 100</small>
          </strong>
        </div>
        <div>
          <span>Data confidence</span>
          <strong className="teal-text">81%</strong>
        </div>
        <div>
          <span>Priority assets</span>
          <strong>5</strong>
        </div>
      </div>
      <h3 className="dialog-section-title">Your security workspace</h3>
      <div className="workspace-shortcuts">
        {[
          { name: 'Review top assets', kind: 'assets' },
          { name: 'View financial exposure', kind: 'financial' },
          { name: 'Explore recommendations', kind: 'recommendations' },
          { name: 'Generate risk report', kind: 'report' },
        ].map((item) => (
          <button
            className="outline-button"
            key={item.kind}
            onClick={() => open({ kind: item.kind } as DialogState)}
          >
            {item.name}
            <ArrowRight size={15} />
          </button>
        ))}
      </div>
    </>
  );
}

export default function RiskDialogs(props: Props) {
  const { state, onClose, open, notify, events, planned, setPlanned } = props;

  if (state.kind === 'assets') {
    return (
      <Dialog
        title="Assets by Risk Score"
        subtitle="Review, filter, and prioritize your highest-risk assets."
        wide
        onClose={onClose}
      >
        <AssetExplorer category={state.category} open={open} />
      </Dialog>
    );
  }

  if (state.kind === 'asset') {
    const asset = state.asset;
    return (
      <Dialog title={asset.name} subtitle={`${asset.type} / ${asset.businessUnit}`} onClose={onClose}>
        <div className="asset-detail-top">
          <div>
            <small>RISK SCORE</small>
            <strong className={`score-${asset.level.toLowerCase()}`}>
              {asset.score}
              <span>/ 100</span>
            </strong>
          </div>
          <span className={`severity severity-${asset.level.toLowerCase()}`}>{asset.level} Risk</span>
        </div>
        <dl className="asset-details">
          <div>
            <dt>Asset owner</dt>
            <dd>{asset.owner}</dd>
          </div>
          <div>
            <dt>Key issues</dt>
            <dd>{asset.issues}</dd>
          </div>
          <div>
            <dt>Financial exposure</dt>
            <dd>{asset.exposure}</dd>
          </div>
          <div>
            <dt>Business unit</dt>
            <dd>{asset.businessUnit}</dd>
          </div>
          <div>
            <dt>Last assessed</dt>
            <dd>Jun 15, 2024, 10:24 AM</dd>
          </div>
        </dl>
        <div className="dialog-note">
          <ShieldCheck size={20} />
          <p>
            Patch critical findings, validate security controls, and review access privileges before the
            next assessment.
          </p>
        </div>
        <div className="dialog-actions">
          <button className="outline-button" onClick={() => open({ kind: 'assets' })}>
            All assets
          </button>
          <button className="primary-button" onClick={() => open({ kind: 'recommendations' })}>
            View remediation actions <ArrowRight size={15} />
          </button>
        </div>
      </Dialog>
    );
  }

  if (state.kind === 'factor') {
    const factor = factors[state.index];
    return (
      <Dialog title={factor.name} subtitle="Risk contribution breakdown" onClose={onClose}>
        <div className="factor-detail-score" style={{ color: factor.color }}>
          +{factor.value}
          <span>risk contribution</span>
        </div>
        <p className="dialog-lead">{factor.explanation}</p>
        <div className="dialog-actions">
          <button className="outline-button" onClick={() => open({ kind: 'model' })}>
            Explore calculation model
          </button>
          <button className="primary-button" onClick={() => open({ kind: 'recommendations' })}>
            View recommendations <ArrowRight size={15} />
          </button>
        </div>
      </Dialog>
    );
  }

  if (state.kind === 'financial') {
    return (
      <Dialog
        title="Financial Exposure"
        subtitle="Translate your organization's cyber risk into business impact."
        wide
        onClose={onClose}
      >
        <div className="financial-headline">
          <span>Annualized Loss Expectancy</span>
          <strong>₹ 1.25 Cr</strong>
          <small>Estimated annual financial exposure</small>
        </div>
        <div className="financial-scenarios">
          {[
            ['Best', '₹ 0.35 Cr'],
            ['Likely', '₹ 1.25 Cr'],
            ['Worst', '₹ 3.40 Cr'],
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <table className="dialog-table">
          <thead>
            <tr>
              <th>Priority asset</th>
              <th>Risk score</th>
              <th>Financial exposure</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.score}</td>
                <td>{asset.exposure}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="dialog-actions">
          <button className="primary-button" onClick={() => open({ kind: 'recommendations' })}>
            Explore risk-reducing investments <ArrowRight size={15} />
          </button>
        </div>
      </Dialog>
    );
  }

  if (state.kind === 'recommendations') {
    return (
      <Dialog
        title="Risk Reduction Recommendations"
        subtitle="Prioritized actions for your organization's current risk profile."
        wide
        onClose={onClose}
      >
        <div className="recommendation-list">
          {recommendations.map((item) => (
            <article key={item.id}>
              <div className="recommendation-heading">
                <h3>{item.name}</h3>
                <span className={`severity severity-${item.priority.toLowerCase()}`}>
                  {item.priority}
                </span>
              </div>
              <p>{item.detail}</p>
              <div className="recommendation-bottom">
                <span>
                  Risk reduction <strong className="teal-text">{item.reduction}</strong>
                </span>
                <span>
                  Estimated cost <strong>{item.cost}</strong>
                </span>
                <button
                  className={planned.includes(item.id) ? 'outline-button' : 'primary-button'}
                  onClick={() => {
                    setPlanned((previous) =>
                      previous.includes(item.id)
                        ? previous.filter((value) => value !== item.id)
                        : [...previous, item.id]
                    );
                    notify(
                      planned.includes(item.id)
                        ? 'Recommendation removed from investment plan.'
                        : 'Recommendation added to your investment plan.'
                    );
                  }}
                >
                  {planned.includes(item.id) ? <Check size={14} /> : <Plus size={14} />}
                  {planned.includes(item.id) ? 'In investment plan' : 'Add to plan'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </Dialog>
    );
  }

  if (state.kind === 'model') {
    return (
      <Dialog
        title="Risk Calculation Model"
        subtitle="Understand the model and test a what-if scenario."
        wide
        onClose={onClose}
      >
        <ScenarioModel notify={notify} />
      </Dialog>
    );
  }

  if (state.kind === 'confidence') {
    return (
      <Dialog
        title="Data Completeness & Confidence"
        subtitle="Improve the evidence behind your risk assessment."
        onClose={onClose}
      >
        <ConfidenceReview notify={notify} />
      </Dialog>
    );
  }

  if (state.kind === 'report') {
    return (
      <Dialog
        title="Generate Comprehensive Report"
        subtitle="A decision-ready assessment for your team and stakeholders."
        onClose={onClose}
      >
        <ReportBuilder notify={notify} planned={planned} />
      </Dialog>
    );
  }

  if (state.kind === 'activity') {
    return (
      <Dialog
        title="Risk Analysis Activity"
        subtitle="Recent changes to your organization's risk profile."
        onClose={onClose}
      >
        <div className="full-activity-list">
          {events.map((event, index) => (
            <div key={index}>
              <i style={{ background: event.color }} />
              <span>
                <strong>{event.text}</strong>
                <time>{event.date}</time>
              </span>
              <span className="activity-verified">
                <Check size={13} />Recorded
              </span>
            </div>
          ))}
        </div>
        <div className="dialog-actions">
          <button
            className="outline-button"
            onClick={() => {
              downloadFile('CyberRiskIQ-Activity-Log.json', JSON.stringify(events, null, 2), 'application/json');
              notify('Activity log exported.');
            }}
          >
            <Download size={15} />Export activity log
          </button>
        </div>
      </Dialog>
    );
  }

  if (state.kind === 'enterprise') {
    return (
      <Dialog
        title="CyberRiskIQ Enterprise"
        subtitle="Advanced analytics. Custom integrations. A more resilient organization."
        onClose={onClose}
      >
        <ul className="enterprise-features">
          <li>
            <Check size={17} />Custom threat intelligence and asset integrations
          </li>
          <li>
            <Check size={17} />Advanced financial exposure and scenario modeling
          </li>
          <li>
            <Check size={17} />Executive-ready reports and dedicated onboarding
          </li>
        </ul>
        <form
          className="enterprise-form"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            downloadFile(
              'CyberRiskIQ-Enterprise-Inquiry.txt',
              `CyberRiskIQ Enterprise inquiry\nName: ${form.get('name')}\nWork email: ${form.get(
                'email'
              )}\nOrganization: ${form.get(
                'company'
              )}\nInterested in advanced analytics and custom integrations.`,
              'text/plain'
            );
            notify('Enterprise inquiry downloaded and ready to share with your account team.');
          }}
        >
          <label className="form-field">
            Name
            <input name="name" placeholder="Your name" required />
          </label>
          <label className="form-field">
            Work email
            <input name="email" type="email" placeholder="you@company.com" required />
          </label>
          <label className="form-field">
            Organization
            <input name="company" placeholder="Company name" required />
          </label>
          <button className="primary-button" type="submit">
            Prepare enterprise inquiry <ArrowRight size={15} />
          </button>
          <p className="dialog-footnote">Your inquiry is downloaded locally. No contact details are transmitted.</p>
        </form>
      </Dialog>
    );
  }

  if (state.kind === 'workspace') {
    return (
      <Dialog
        title={state.name === 'Dashboard' ? 'Executive Dashboard' : state.name}
        subtitle="CyberRiskIQ / Acme Technologies Pvt. Ltd."
        onClose={onClose}
        wide={state.name === 'Vulnerabilities'}
      >
        <WorkspaceView
          name={state.name}
          open={open}
          lightTheme={props.lightTheme}
          setLightTheme={props.setLightTheme}
          notify={notify}
        />
      </Dialog>
    );
  }

  return null;
}
