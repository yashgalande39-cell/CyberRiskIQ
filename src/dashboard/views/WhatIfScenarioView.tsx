import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bookmark,
  ChevronDown,
  Download,
  FileText,
  GitBranch,
  HelpCircle,
  ListPlus,
  RefreshCw,
  ShieldHalf,
  Sparkles,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import '../../styles/whatif.css';

export interface WhatIfScenarioViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

const SCENARIO_TYPES = [
  { id: 'threat', icon: Zap, title: 'Threat Scenario', desc: 'Simulate a cyber attack or threat event' },
  { id: 'control', icon: ShieldHalf, title: 'Control Improvement', desc: 'Evaluate the impact of implementing security controls' },
  { id: 'budget', icon: Wallet, title: 'Budget Change', desc: 'Analyze the impact of increased or reduced security budget' },
  { id: 'business', icon: BarChart3, title: 'Business Change', desc: 'Model impact of business growth, acquisition or new initiatives' },
  { id: 'regulatory', icon: FileText, title: 'Regulatory Change', desc: 'Assess impact of new compliance requirements' },
  { id: 'custom', icon: Sparkles, title: 'Custom Scenario', desc: 'Create a custom what-if scenario' },
] as const;

const THREAT_TYPES = [
  'Ransomware Attack',
  'Cloud Data Breach',
  'Distributed Denial of Service (DDoS)',
  'Zero-Day Compromise',
  'Supply Chain Infiltration',
  'Insider Privilege Abuse',
];

const DURATIONS = ['1 week', '2 weeks', '1 month', '3 months', '6 months'];
const SENSITIVITIES = ['Confidential', 'Restricted', 'Internal Only', 'Public', 'Top Secret'];

const RISK_BREAKDOWN = [
  ['Cybersecurity', 72, 92, '+28%'],
  ['Data Privacy', 58, 85, '+47%'],
  ['Operational Risk', 45, 78, '+73%'],
  ['Financial Risk', 38, 76, '+100%'],
  ['Third-Party Risk', 42, 71, '+69%'],
  ['Regulatory Risk', 35, 62, '+77%'],
  ['Reputational Risk', 48, 81, '+69%'],
  ['Physical Security', 22, 28, '+27%'],
] as const;

const RECOMMENDATIONS = [
  { id: 1, title: 'Implement EDR on critical servers', reduction: '↓ 45%', cost: '₹ 35 L' },
  { id: 2, title: 'Network segmentation for payment & DB tiers', reduction: '↓ 32%', cost: '₹ 20 L' },
  { id: 3, title: 'Immutable cloud & air-gapped backups', reduction: '↓ 28%', cost: '₹ 15 L' },
  { id: 4, title: 'Automated incident response playbook', reduction: '↓ 25%', cost: '₹ 10 L' },
  { id: 5, title: 'Targeted security awareness & anti-phishing', reduction: '↓ 18%', cost: '₹ 8 L' },
];

const SAVED_SCENARIOS = [
  {
    id: 'sc-01',
    name: 'Q3 Enterprise Ransomware Surge',
    type: 'Threat Scenario',
    date: 'Jun 12, 2024',
    author: 'Yash Galande',
    ale: '₹ 12.4 Cr',
    downtime: '14 days',
    status: 'High Impact',
  },
  {
    id: 'sc-02',
    name: 'AWS Multi-Region Failover Outage',
    type: 'Business Change',
    date: 'May 28, 2024',
    author: 'S. Iyer',
    ale: '₹ 6.8 Cr',
    downtime: '5 days',
    status: 'Moderate',
  },
  {
    id: 'sc-03',
    name: 'Zero-Trust & MFA Full Rollout',
    type: 'Control Improvement',
    date: 'May 14, 2024',
    author: 'R. Sharma',
    ale: '₹ 1.8 Cr',
    downtime: '1 day',
    status: 'Positive ROI',
  },
];

const TEMPLATES = [
  {
    id: 'tpl-1',
    title: 'Ransomware Extortion Simulation',
    category: 'Threat Scenario',
    desc: 'Simulate high-impact encryption on database & web assets with active business extortion.',
    likelihood: 70,
    impact: 80,
    threat: 'Ransomware Attack',
  },
  {
    id: 'tpl-2',
    title: 'Critical Vendor Supply Chain Breach',
    category: 'Third-Party Risk',
    desc: 'Evaluate cascading API compromise from trusted cloud analytics provider.',
    likelihood: 55,
    impact: 75,
    threat: 'Supply Chain Infiltration',
  },
  {
    id: 'tpl-3',
    title: 'Zero-Day Remote Code Execution',
    category: 'Vulnerability Impact',
    desc: 'Immediate unauthenticated RCE on internet-facing load balancers and gateways.',
    likelihood: 45,
    impact: 90,
    threat: 'Zero-Day Compromise',
  },
  {
    id: 'tpl-4',
    title: 'MFA & Network Micro-Segmentation',
    category: 'Control Improvement',
    desc: 'Model 95% control coverage and estimated reduction in lateral movement loss.',
    likelihood: 25,
    impact: 30,
    threat: 'Cloud Data Breach',
  },
];

export function WhatIfScenarioView({ onNav, externalNotify }: WhatIfScenarioViewProps) {
  const [tab, setTab] = useState<'Scenario Builder' | 'Saved Scenarios' | 'Scenario Library' | 'Compare Scenarios'>('Scenario Builder');
  const [scenarioType, setScenarioType] = useState('threat');
  const [threatType, setThreatType] = useState('Ransomware Attack');
  const [duration, setDuration] = useState('2 weeks');
  const [sensitivity, setSensitivity] = useState('Confidential');
  const [likelihood, setLikelihood] = useState(70);
  const [impact, setImpact] = useState(80);
  const [thirdParty, setThirdParty] = useState(true);
  const [businessDisruption, setBusinessDisruption] = useState(true);
  const [impactTab, setImpactTab] = useState<'Financial Impact' | 'Risk Score' | 'Asset Impact' | 'Business Impact'>('Financial Impact');
  const [targets, setTargets] = useState(['Production Servers', 'Critical Databases']);
  const [isSimulating, setIsSimulating] = useState(false);

  // Modals
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [scenarioNameInput, setScenarioNameInput] = useState('Ransomware Defense Simulation 2024');

  const notify = (msg: string, kind: 'ok' | 'info' = 'ok') => {
    if (externalNotify) externalNotify(msg, kind);
  };

  const handleRunScenario = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      notify('What-If simulation completed. 6 risk dimensions and impact projections re-evaluated.', 'ok');
    }, 600);
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setThreatType(tpl.threat);
    setLikelihood(tpl.likelihood);
    setImpact(tpl.impact);
    setTab('Scenario Builder');
    notify(`Loaded template: "${tpl.title}" into Scenario Builder.`, 'info');
  };

  // Dynamic calculations based on slider values
  const multiplier = (likelihood * impact) / 5600; // normalized around 1.0
  const aleValue = (12.4 * multiplier).toFixed(1);
  const finImpactValue = (28.7 * multiplier).toFixed(1);
  const downtimeDays = Math.max(2, Math.round(14 * multiplier));
  const affectedAssetsCount = Math.max(50, Math.round(248 * multiplier));

  return (
    <div className="whatif-page">
      {/* Mountain Banner */}
      {/* Standard Header matching Security Controls */}
      <header className="sc-page-header">
        <div>
          <p className="sc-breadcrumb">Home &gt; Posture &gt; <span>What-If Scenarios</span></p>
          <h1>What-If Scenarios</h1>
          <p>Model cyber risk and budget interventions to simulate financial exposure and test mitigation hypotheses.</p>
        </div>
        <div className="sc-header-actions">
          <div className="sc-motto">
            <span>EXPLORE POSSIBILITIES</span>
            <span>MAKE SMARTER DECISIONS</span>
            <span>BUILD RESILIENCE</span>
          </div>
          <button
            type="button"
            className="sc-action-btn sc-btn-secondary"
            onClick={() => setSaveModalOpen(true)}
          >
            <Bookmark size={14} /> Save Scenario
          </button>
        </div>
      </header>

      {/* Standard Tabs Navigation matching Security Controls */}
      <nav className="detail-tabs" style={{ marginBottom: '14px', borderBottom: '1px solid var(--sc-border, #06314a)' }} aria-label="Scenario Tabs">
        {(['Scenario Builder', 'Saved Scenarios', 'Scenario Library', 'Compare Scenarios'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={tab === t ? 'is-active' : ''}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Tab 1: Scenario Builder */}
      {tab === 'Scenario Builder' && (
        <main className="whatif-body">
          {/* ROW 1: 3 Panels */}
          <div className="whatif-row-1">
            {/* Panel 1: Select Scenario Type */}
            <section className="whatif-panel">
              <div className="whatif-panel-header">
                <div className="whatif-panel-title-wrap">
                  <span className="whatif-step-badge">1</span>
                  <div>
                    <h2 className="whatif-panel-title">Select Scenario Type</h2>
                    <p className="whatif-panel-subtitle">Choose a scenario to model its impact on your organization.</p>
                  </div>
                </div>
              </div>

              <div className="whatif-scenario-types">
                {SCENARIO_TYPES.map((s) => {
                  const Icon = s.icon;
                  const active = scenarioType === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setScenarioType(s.id);
                        notify(`Switched scenario model to: ${s.title}`);
                      }}
                      className={`whatif-scenario-card ${active ? 'is-selected' : ''}`}
                      role="radio"
                      aria-checked={active}
                      tabIndex={0}
                    >
                      <span className="whatif-radio-outer">
                        {active && <span className="whatif-radio-inner" />}
                      </span>
                      <span className="whatif-icon-box">
                        <Icon size={17} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div className="whatif-type-name">{s.title}</div>
                        <div className="whatif-type-desc">{s.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Panel 2: Configure Scenario */}
            <section className="whatif-panel">
              <div className="whatif-panel-header">
                <div className="whatif-panel-title-wrap">
                  <span className="whatif-step-badge">2</span>
                  <div>
                    <h2 className="whatif-panel-title">Configure Scenario</h2>
                    <p className="whatif-panel-subtitle">Adjust the parameters to model your scenario.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHelpModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <HelpCircle size={12} /> Need Help?
                </button>
              </div>

              <div style={{ marginTop: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div className="whatif-input-label">Threat Type</div>
                  <div className="whatif-select-box">
                    <select
                      value={threatType}
                      onChange={(e) => setThreatType(e.target.value)}
                      className="whatif-select-trigger"
                      style={{ appearance: 'none', paddingRight: '26px' }}
                    >
                      {THREAT_TYPES.map((t) => (
                        <option key={t} value={t} style={{ background: '#081226', color: '#fff' }}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} color="#7e8daa" style={{ position: 'absolute', right: '10px', top: '10px', pointerEvents: 'none' }} />
                  </div>
                </div>

                <div>
                  <div className="whatif-input-label">Target Assets</div>
                  <div className="whatif-tag-container">
                    {targets.map((t) => (
                      <span key={t} className="whatif-tag-pill">
                        {t}
                        <button
                          type="button"
                          className="whatif-tag-remove"
                          onClick={() => setTargets(targets.filter((x) => x !== t))}
                          title={`Remove ${t}`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {targets.length < 4 && (
                      <button
                        type="button"
                        onClick={() => {
                          const candidates = ['Web Gateways', 'ERP Database', 'Employee Portal', 'Cloud VPC'];
                          const next = candidates.find((c) => !targets.includes(c));
                          if (next) setTargets([...targets, next]);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#38bdf8',
                          fontSize: '10px',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        title="Add Target Asset"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Likelihood Slider */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="whatif-input-label" style={{ marginBottom: 0 }}>Attack Likelihood</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
                    {likelihood >= 70 ? 'High' : likelihood >= 40 ? 'Medium' : 'Low'} ({likelihood}%)
                  </span>
                </div>
                <div
                  className="whatif-slider-track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const p = Math.max(10, Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                    setLikelihood(p);
                  }}
                >
                  <div className="whatif-slider-fill" style={{ width: `${likelihood}%` }} />
                  <div className="whatif-slider-thumb" style={{ left: `${likelihood}%` }} />
                </div>
                <div className="whatif-slider-scale">
                  <span>Low (10%)</span>
                  <span>Medium (50%)</span>
                  <span>High (90%)</span>
                </div>
              </div>

              {/* Impact Slider */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="whatif-input-label" style={{ marginBottom: 0 }}>Attack Impact</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
                    {impact >= 70 ? 'High' : impact >= 40 ? 'Medium' : 'Low'} ({impact}%)
                  </span>
                </div>
                <div
                  className="whatif-slider-track"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const p = Math.max(10, Math.min(95, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                    setImpact(p);
                  }}
                >
                  <div className="whatif-slider-fill" style={{ width: `${impact}%` }} />
                  <div className="whatif-slider-thumb" style={{ left: `${impact}%` }} />
                </div>
                <div className="whatif-slider-scale">
                  <span>Low (10%)</span>
                  <span>Medium (50%)</span>
                  <span>High (90%)</span>
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div className="whatif-input-label">Duration of Impact</div>
                  <div className="whatif-select-box">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="whatif-select-trigger"
                      style={{ appearance: 'none', paddingRight: '26px' }}
                    >
                      {DURATIONS.map((d) => (
                        <option key={d} value={d} style={{ background: '#081226', color: '#fff' }}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} color="#7e8daa" style={{ position: 'absolute', right: '10px', top: '10px', pointerEvents: 'none' }} />
                  </div>
                </div>

                <div>
                  <div className="whatif-input-label">Data Sensitivity</div>
                  <div className="whatif-select-box">
                    <select
                      value={sensitivity}
                      onChange={(e) => setSensitivity(e.target.value)}
                      className="whatif-select-trigger"
                      style={{ appearance: 'none', paddingRight: '26px' }}
                    >
                      {SENSITIVITIES.map((s) => (
                        <option key={s} value={s} style={{ background: '#081226', color: '#fff' }}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} color="#7e8daa" style={{ position: 'absolute', right: '10px', top: '10px', pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Toggles & Run Button */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="whatif-toggle-wrap">
                    <div className="whatif-input-label" style={{ marginBottom: 0 }}>Include Third-Party Impact</div>
                    <div className="whatif-toggle-row">
                      <button
                        type="button"
                        onClick={() => setThirdParty(!thirdParty)}
                        className={`whatif-toggle-btn ${thirdParty ? 'is-on' : 'is-off'}`}
                        aria-pressed={thirdParty}
                      >
                        <span className="whatif-toggle-dot" />
                      </button>
                      <span style={{ fontSize: '10px', color: '#8fa1c2' }}>
                        {thirdParty ? 'Yes, include third-party and supply chain impact' : 'No, exclude external dependencies'}
                      </span>
                    </div>
                  </div>

                  <div className="whatif-toggle-wrap">
                    <div className="whatif-input-label" style={{ marginBottom: 0 }}>Include Business Disruption</div>
                    <div className="whatif-toggle-row">
                      <button
                        type="button"
                        onClick={() => setBusinessDisruption(!businessDisruption)}
                        className={`whatif-toggle-btn ${businessDisruption ? 'is-on' : 'is-off'}`}
                        aria-pressed={businessDisruption}
                      >
                        <span className="whatif-toggle-dot" />
                      </button>
                      <span style={{ fontSize: '10px', color: '#8fa1c2' }}>
                        {businessDisruption ? 'Yes, include operational and revenue impact' : 'No, focus only on technical containment'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="whatif-btn-primary"
                  onClick={handleRunScenario}
                  disabled={isSimulating}
                  style={{ height: '40px', padding: '0 20px', borderRadius: '8px' }}
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" /> Simulating...
                    </>
                  ) : (
                    <>
                      Run Scenario <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Panel 3: Scenario Results */}
            <section className="whatif-panel">
              <div className="whatif-panel-header">
                <div className="whatif-panel-title-wrap">
                  <span className="whatif-step-badge">3</span>
                  <div>
                    <h2 className="whatif-panel-title">Scenario Results</h2>
                    <p className="whatif-panel-subtitle">Compare the potential impact with your current risk posture.</p>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '26px',
                    padding: '0 8px',
                    backgroundColor: '#081226',
                    border: '1px solid #1a2f52',
                    borderRadius: '6px',
                    fontSize: '10.5px',
                    color: '#c5d0e6',
                    cursor: 'pointer',
                  }}
                >
                  Baseline vs. Scenario <ChevronDown size={12} />
                </div>
              </div>

              <div className="whatif-results-grid">
                <div className="whatif-result-card">
                  <div className="whatif-result-label">Annualized Loss Expectancy (ALE)</div>
                  <div className="whatif-result-val-row">
                    <span className="whatif-result-value">₹ {aleValue} Cr</span>
                    <span className="whatif-result-delta">↑ 320%</span>
                  </div>
                  <div className="whatif-result-sub">vs. current ₹ 2.95 Cr</div>
                </div>

                <div className="whatif-result-card">
                  <div className="whatif-result-label">Total Financial Impact</div>
                  <div className="whatif-result-val-row">
                    <span className="whatif-result-value">₹ {finImpactValue} Cr</span>
                    <span className="whatif-result-delta">↑ 410%</span>
                  </div>
                  <div className="whatif-result-sub">Includes direct, indirect and reputational costs</div>
                </div>

                <div className="whatif-result-card">
                  <div className="whatif-result-label">Business Downtime</div>
                  <div className="whatif-result-val-row">
                    <span className="whatif-result-value">{downtimeDays} days</span>
                    <span className="whatif-result-delta">↑ 367%</span>
                  </div>
                  <div className="whatif-result-sub">vs. current 3 days</div>
                </div>

                <div className="whatif-result-card">
                  <div className="whatif-result-label">Affected Assets</div>
                  <div className="whatif-result-val-row">
                    <span className="whatif-result-value">{affectedAssetsCount}</span>
                    <span className="whatif-result-delta">↑ 275%</span>
                  </div>
                  <div className="whatif-result-sub">Across 4 business units</div>
                </div>
              </div>

              <div className="whatif-alert-box">
                <div className="whatif-alert-icon">
                  <AlertTriangle size={14} />
                </div>
                <div>
                  <div className="whatif-alert-title">High Impact Scenario</div>
                  <div className="whatif-alert-desc">
                    This scenario could significantly impact your business operations and financial stability. Implementing proposed mitigations reduces estimated loss by 65%.
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ROW 2: Impact Analysis / Risk Breakdown / Recommendations */}
          <div className="whatif-row-2">
            {/* Panel 4: Impact Analysis */}
            <section className="whatif-panel">
              <div className="whatif-panel-header">
                <div className="whatif-panel-title-wrap">
                  <span className="whatif-step-badge">4</span>
                  <div>
                    <h2 className="whatif-panel-title">Impact Analysis</h2>
                    <p className="whatif-panel-subtitle">See how this scenario affects key risk and business metrics over time.</p>
                  </div>
                </div>
              </div>

              <div className="whatif-chart-tabs">
                {(['Financial Impact', 'Risk Score', 'Asset Impact', 'Business Impact'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setImpactTab(t)}
                    className={`whatif-chart-tab-btn ${impactTab === t ? 'is-active' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', marginTop: '10px' }}>
                <div className="whatif-chart-badge">
                  <div className="whatif-chart-badge-val">₹ {finImpactValue} Cr</div>
                  <div className="whatif-chart-badge-lbl">Total Impact</div>
                </div>

                {/* Dynamic SVG Area / Line Chart */}
                <svg viewBox="0 0 440 190" className="w-full h-[186px]" style={{ width: '100%', height: '186px' }}>
                  {[0, 10, 20, 30, 40, 50].map((v) => {
                    const y = 160 - (v / 50) * 148;
                    return (
                      <g key={v}>
                        <line x1="42" y1={y} x2="432" y2={y} stroke="#12233f" strokeWidth="0.7" />
                        <text x="38" y={y + 3} textAnchor="end" fontSize="9" fill="#5b6b85">
                          ₹ {v} Cr
                        </text>
                      </g>
                    );
                  })}
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => {
                    const x = 50 + (i / 11) * 378;
                    return (
                      <text key={m} x={x} y={178} textAnchor="middle" fontSize="9" fill="#7e8daa">
                        {m}
                      </text>
                    );
                  })}
                  {(() => {
                    const baseMulti = Math.min(1.3, Math.max(0.7, multiplier));
                    const scen = [2, 5, 9, 14, 19, 24, 28, 31, 32.5, 33, 32, 29].map((v) => Math.min(48, v * baseMulti));
                    const base = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5];
                    const X = (i: number) => 50 + (i / 11) * 378;
                    const Y = (v: number) => 160 - (v / 50) * 148;
                    const sPts = scen.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
                    const bPts = base.map((v, i) => `${X(i)},${Y(v)}`).join(' ');
                    return (
                      <g>
                        <polygon points={`${X(0)},160 ${sPts} ${X(11)},160`} fill="#ef4444" opacity="0.12" />
                        <polyline points={sPts} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
                        {scen.map((v, i) => (
                          <circle key={i} cx={X(i)} cy={Y(v)} r="2.6" fill="#ef4444" />
                        ))}
                        <polyline points={bPts} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
                        {base.map((v, i) => (
                          <circle key={i} cx={X(i)} cy={Y(v)} r="2.6" fill="#3b82f6" />
                        ))}
                      </g>
                    );
                  })()}
                </svg>

                <div className="whatif-chart-legend">
                  <span className="whatif-legend-item">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                    Current (Baseline)
                  </span>
                  <span className="whatif-legend-item">
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    What-If Scenario
                  </span>
                </div>
              </div>
            </section>

            {/* Panel 5: Risk Breakdown */}
            <section className="whatif-panel">
              <div className="whatif-panel-header">
                <div className="whatif-panel-title-wrap">
                  <span className="whatif-step-badge">5</span>
                  <div>
                    <h2 className="whatif-panel-title">Risk Breakdown</h2>
                    <p className="whatif-panel-subtitle">How different risk categories are affected.</p>
                  </div>
                </div>
              </div>

              <table className="whatif-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Risk Category</th>
                    <th style={{ textAlign: 'center' }}>Current Risk</th>
                    <th style={{ textAlign: 'center' }}>Scenario Risk</th>
                    <th style={{ textAlign: 'right' }}>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {RISK_BREAKDOWN.map(([cat, cur, scen]) => {
                    const scaledScen = Math.min(99, Math.round(scen * Math.sqrt(multiplier)));
                    const diffPct = Math.round(((scaledScen - cur) / cur) * 100);
                    return (
                      <tr key={cat}>
                        <td style={{ color: '#e6ecf7' }}>{cat}</td>
                        <td style={{ textAlign: 'center', color: '#9aabc9' }}>{cur}</td>
                        <td style={{ textAlign: 'center', color: '#f87171', fontWeight: 600 }}>{scaledScen}</td>
                        <td style={{ textAlign: 'right', color: '#f87171' }}>↑ {diffPct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {/* Panel 6: Recommendations */}
            <section className="whatif-panel">
              <div className="whatif-panel-header">
                <div className="whatif-panel-title-wrap">
                  <span className="whatif-step-badge">6</span>
                  <div>
                    <h2 className="whatif-panel-title">Recommendations</h2>
                    <p className="whatif-panel-subtitle">Top actions to reduce the scenario impact.</p>
                  </div>
                </div>
              </div>

              <table className="whatif-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '18px' }}>#</th>
                    <th style={{ textAlign: 'left' }}>Recommendation</th>
                    <th style={{ textAlign: 'center' }}>Impact Reduction</th>
                    <th style={{ textAlign: 'right' }}>Estimated Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {RECOMMENDATIONS.map((rec) => (
                    <tr key={rec.id}>
                      <td style={{ color: '#5b6b85' }}>{rec.id}</td>
                      <td style={{ color: '#e6ecf7' }}>{rec.title}</td>
                      <td style={{ textAlign: 'center', color: '#34d399', fontWeight: 500 }}>{rec.reduction}</td>
                      <td style={{ textAlign: 'right', color: '#d3dcee' }}>{rec.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => {
                    notify('Top 5 recommendations appended to your active Remediation Plan.');
                    if (onNav) onNav('optimization');
                  }}
                  className="whatif-btn-secondary"
                  style={{ height: '30px', padding: '0 12px', fontSize: '10.5px' }}
                >
                  <ListPlus size={13} color="#38bdf8" /> Add to Remediation Plan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onNav) onNav('recommendations');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontSize: '10.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  View All Recommendations <ArrowRight size={12} />
                </button>
              </div>
            </section>
          </div>

          {/* Scenario Summary Banner */}
          <div className="whatif-summary-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div className="whatif-summary-icon">
                <GitBranch size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="whatif-summary-title">Scenario Summary</div>
                <div className="whatif-summary-desc">
                  A {threatType.toLowerCase()} on critical assets could result in{' '}
                  <strong style={{ color: '#ffffff' }}>₹ {finImpactValue} Cr</strong> in total impact,{' '}
                  <strong style={{ color: '#ffffff' }}>{downtimeDays} days</strong> of downtime, and affect{' '}
                  <strong style={{ color: '#ffffff' }}>{affectedAssetsCount} assets</strong>. Implementing the top 5 recommendations could reduce the impact by up to <strong style={{ color: '#ffffff' }}>65%</strong>.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                type="button"
                className="whatif-btn-secondary"
                onClick={() => setSaveModalOpen(true)}
              >
                <Bookmark size={14} /> Save Scenario
              </button>
              <button
                type="button"
                className="whatif-btn-primary"
                onClick={() => setExportModalOpen(true)}
              >
                <Download size={14} /> Export Report
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Tab 2: Saved Scenarios */}
      {tab === 'Saved Scenarios' && (
        <main className="whatif-body">
          <section className="whatif-panel">
            <div className="whatif-panel-header">
              <div className="whatif-panel-title-wrap">
                <span className="whatif-step-badge">
                  <Bookmark size={12} />
                </span>
                <div>
                  <h2 className="whatif-panel-title">Saved Scenario Models</h2>
                  <p className="whatif-panel-subtitle">Review previously evaluated scenarios and audit simulation records.</p>
                </div>
              </div>
              <button
                type="button"
                className="whatif-btn-primary"
                onClick={() => setSaveModalOpen(true)}
                style={{ height: '32px', padding: '0 14px', fontSize: '11px' }}
              >
                + Save Current Model
              </button>
            </div>

            <table className="whatif-table" style={{ marginTop: '12px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Scenario Name</th>
                  <th style={{ textAlign: 'left' }}>Type</th>
                  <th style={{ textAlign: 'center' }}>Date Saved</th>
                  <th style={{ textAlign: 'center' }}>Author</th>
                  <th style={{ textAlign: 'center' }}>ALE Projected</th>
                  <th style={{ textAlign: 'center' }}>Est. Downtime</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SAVED_SCENARIOS.map((sc) => (
                  <tr key={sc.id}>
                    <td style={{ color: '#ffffff', fontWeight: 600 }}>{sc.name}</td>
                    <td style={{ color: '#9aabc9' }}>{sc.type}</td>
                    <td style={{ textAlign: 'center', color: '#7e8daa' }}>{sc.date}</td>
                    <td style={{ textAlign: 'center', color: '#d3dcee' }}>{sc.author}</td>
                    <td style={{ textAlign: 'center', color: '#f87171', fontWeight: 600 }}>{sc.ale}</td>
                    <td style={{ textAlign: 'center', color: '#9aabc9' }}>{sc.downtime}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setTab('Scenario Builder');
                          notify(`Loaded "${sc.name}" into Scenario Builder.`);
                        }}
                        className="whatif-btn-secondary"
                        style={{ height: '26px', padding: '0 10px', fontSize: '10.5px' }}
                      >
                        Load in Builder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}

      {/* Tab 3: Scenario Library */}
      {tab === 'Scenario Library' && (
        <main className="whatif-body">
          <section className="whatif-panel">
            <div className="whatif-panel-header">
              <div className="whatif-panel-title-wrap">
                <span className="whatif-step-badge">
                  <Sparkles size={12} />
                </span>
                <div>
                  <h2 className="whatif-panel-title">Pre-Configured Scenario Templates</h2>
                  <p className="whatif-panel-subtitle">Select industry benchmarks or common cyber crisis playbooks to load into the builder.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginTop: '12px' }}>
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  style={{
                    backgroundColor: '#081226',
                    border: '1px solid #152641',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>
                      {tpl.category}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
                      {tpl.title}
                    </div>
                    <p style={{ fontSize: '11px', color: '#8fa1c2', marginTop: '6px', lineHeight: 1.4 }}>
                      {tpl.desc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid #13264a', paddingTop: '10px' }}>
                    <span style={{ fontSize: '10px', color: '#9aabc9' }}>
                      Likelihood {tpl.likelihood}% · Impact {tpl.impact}%
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="whatif-btn-primary"
                      style={{ height: '28px', padding: '0 12px', fontSize: '11px' }}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Tab 4: Compare Scenarios */}
      {tab === 'Compare Scenarios' && (
        <main className="whatif-body">
          <section className="whatif-panel">
            <div className="whatif-panel-header">
              <div className="whatif-panel-title-wrap">
                <span className="whatif-step-badge">
                  <BarChart3 size={12} />
                </span>
                <div>
                  <h2 className="whatif-panel-title">Comparative Scenario Matrix</h2>
                  <p className="whatif-panel-subtitle">Benchmark your current baseline posture against active what-if simulations.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginTop: '14px' }}>
              <div className="whatif-result-card" style={{ border: '1px solid #1e3a5f' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>Current Baseline</div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Annual Loss Expectancy:</span><div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>₹ 2.95 Cr</div></div>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Est. Downtime:</span><div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>3 days</div></div>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Critical Assets Exposed:</span><div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>64 assets</div></div>
                </div>
              </div>

              <div className="whatif-result-card" style={{ border: '1px solid #ef4444', backgroundColor: '#140c16' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>Ransomware Attack (Unmitigated)</div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Annual Loss Expectancy:</span><div style={{ fontSize: '16px', fontWeight: 700, color: '#f87171' }}>₹ 12.4 Cr (+320%)</div></div>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Est. Downtime:</span><div style={{ fontSize: '14px', fontWeight: 600, color: '#f87171' }}>14 days</div></div>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Critical Assets Exposed:</span><div style={{ fontSize: '14px', fontWeight: 600, color: '#f87171' }}>248 assets</div></div>
                </div>
              </div>

              <div className="whatif-result-card" style={{ border: '1px solid #22c55e', backgroundColor: '#091612' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>Ransomware + Top 5 Controls</div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Annual Loss Expectancy:</span><div style={{ fontSize: '16px', fontWeight: 700, color: '#4ade80' }}>₹ 4.3 Cr (-65%)</div></div>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Est. Downtime:</span><div style={{ fontSize: '14px', fontWeight: 600, color: '#4ade80' }}>4 days</div></div>
                  <div><span style={{ color: '#8fa1c2', fontSize: '10px' }}>Remediation Cost:</span><div style={{ fontSize: '14px', fontWeight: 600, color: '#4ade80' }}>₹ 88 L</div></div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Save Scenario Modal */}
      {saveModalOpen && (
        <div className="whatif-modal-backdrop" onClick={() => setSaveModalOpen(false)}>
          <div className="whatif-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whatif-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bookmark size={16} color="#38bdf8" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Save Scenario Model</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8fa1c2', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="whatif-modal-body">
              <div>
                <label className="whatif-input-label">Scenario Name</label>
                <input
                  type="text"
                  value={scenarioNameInput}
                  onChange={(e) => setScenarioNameInput(e.target.value)}
                  className="whatif-select-trigger"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="whatif-input-label">Description & Notes</label>
                <textarea
                  rows={3}
                  defaultValue="Modeling ransomware attack against database tier with EDR and segmentation mitigation."
                  className="whatif-select-trigger"
                  style={{ width: '100%', height: 'auto', padding: '8px' }}
                />
              </div>

              <div style={{ fontSize: '11px', color: '#8fa1c2', backgroundColor: '#071128', padding: '10px', borderRadius: '6px' }}>
                <strong>Snapshot Summary:</strong> Projected ALE ₹ {aleValue} Cr · Likelihood {likelihood}% · Impact {impact}%
              </div>
            </div>

            <div className="whatif-modal-footer">
              <button
                type="button"
                className="whatif-btn-secondary"
                onClick={() => setSaveModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="whatif-btn-primary"
                onClick={() => {
                  setSaveModalOpen(false);
                  notify(`Scenario "${scenarioNameInput}" saved successfully to your workspace.`, 'ok');
                }}
              >
                Save Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {exportModalOpen && (
        <div className="whatif-modal-backdrop" onClick={() => setExportModalOpen(false)}>
          <div className="whatif-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whatif-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} color="#38bdf8" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Export What-If Scenario Report</span>
              </div>
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8fa1c2', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="whatif-modal-body">
              <p style={{ fontSize: '11.5px', color: '#9aabc9', margin: 0 }}>
                Select the format for exporting this simulation and executive risk impact analysis:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { title: 'Executive Board Presentation (PDF)', desc: 'Executive summary, loss curves, and prioritized mitigation table.' },
                  { title: 'Technical Risk Assessment (Excel / CSV)', desc: 'Full asset attribution, granular CVSS scoring, and cost calculations.' },
                  { title: 'JSON Scenario Spec', desc: 'Raw simulation model for CI/CD or risk quantification pipelines.' },
                ].map((f, idx) => (
                  <label
                    key={f.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '6px',
                      backgroundColor: '#071128',
                      border: '1px solid #14264a',
                      cursor: 'pointer',
                    }}
                  >
                    <input type="radio" name="export-fmt" defaultChecked={idx === 0} style={{ marginTop: '3px' }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{f.title}</div>
                      <div style={{ fontSize: '10px', color: '#8fa1c2' }}>{f.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="whatif-modal-footer">
              <button
                type="button"
                className="whatif-btn-secondary"
                onClick={() => setExportModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="whatif-btn-primary"
                onClick={() => {
                  setExportModalOpen(false);
                  notify('Export generated! Download started for What-If Scenario Report.', 'ok');
                }}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parameter Help Modal */}
      {helpModalOpen && (
        <div className="whatif-modal-backdrop" onClick={() => setHelpModalOpen(false)}>
          <div className="whatif-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="whatif-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={16} color="#38bdf8" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>What-If Simulation Guide</span>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#8fa1c2', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="whatif-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11.5px', color: '#cbd5e1' }}>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Attack Likelihood:</strong> The statistical probability of the selected threat event being executed within a 12-month horizon based on active threat intelligence and exploit telemetry.
                </div>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Attack Impact:</strong> Severity multiplier evaluated across revenue loss, forensic triage expenses, regulatory fines, and brand restitution.
                </div>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Third-Party Impact:</strong> Evaluates upstream API integrations, cloud SaaS dependencies, and shared vendor supply chain risks.
                </div>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Remediation Payback:</strong> Prioritizes high-velocity controls with the fastest drop in Annualized Loss Expectancy (ALE).
                </div>
              </div>
            </div>

            <div className="whatif-modal-footer">
              <button
                type="button"
                className="whatif-btn-primary"
                onClick={() => setHelpModalOpen(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
