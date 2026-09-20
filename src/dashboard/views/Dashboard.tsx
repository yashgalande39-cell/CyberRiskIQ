import { useState, useId } from 'react';
import { Icon } from '../../components/Icons';
import { Dropdown } from '../components/ui';
import { ranges, type RangeKey } from '../data';

interface RiskItem {
  id: number;
  title: string;
  sub: string;
  asset: string;
  score: number;
  exposure: string;
  status: 'Critical' | 'High' | 'Medium';
  criticality: string;
  activity: string;
  maturity: string;
  effectiveness: string;
  aleBest: string;
  aleLikely: string;
  aleWorst: string;
  affectedAssets: number;
  factors: { label: string; pct: number; color: string }[];
}

const detailedRisks: RiskItem[] = [
  {
    id: 1,
    title: 'Unpatched CVE-2024-3094',
    sub: 'Remote code execution vulnerability',
    asset: 'Web Server 01',
    score: 85,
    exposure: '₹ 48 L',
    status: 'Critical',
    criticality: 'High',
    activity: 'High',
    maturity: 'High',
    effectiveness: 'Low',
    aleBest: '₹ 12 L',
    aleLikely: '₹ 48 L',
    aleWorst: '₹ 1.20 Cr',
    affectedAssets: 24,
    factors: [
      { label: 'Vulnerability (CVSS)', pct: 35, color: '#ff3557' },
      { label: 'Asset Criticality', pct: 25, color: '#ff623d' },
      { label: 'Threat Intelligence', pct: 20, color: '#ff9c3d' },
      { label: 'Exposure', pct: 15, color: '#ffd245' },
      { label: 'Control Gaps', pct: 5, color: '#00e0b4' },
    ],
  },
  {
    id: 2,
    title: 'Ransomware Exposure',
    sub: 'Exposed endpoints with lateral path to core DB',
    asset: 'Finance DB',
    score: 78,
    exposure: '₹ 32 L',
    status: 'High',
    criticality: 'High',
    activity: 'High',
    maturity: 'Medium',
    effectiveness: 'Medium',
    aleBest: '₹ 8 L',
    aleLikely: '₹ 32 L',
    aleWorst: '₹ 95 L',
    affectedAssets: 16,
    factors: [
      { label: 'Vulnerability (CVSS)', pct: 30, color: '#ff3557' },
      { label: 'Asset Criticality', pct: 30, color: '#ff623d' },
      { label: 'Threat Intelligence', pct: 20, color: '#ff9c3d' },
      { label: 'Exposure', pct: 12, color: '#ffd245' },
      { label: 'Control Gaps', pct: 8, color: '#00e0b4' },
    ],
  },
  {
    id: 3,
    title: 'Excessive Admin Privileges',
    sub: 'Orphaned domain admin roles without MFA',
    asset: 'Active Directory',
    score: 72,
    exposure: '₹ 28 L',
    status: 'High',
    criticality: 'Critical',
    activity: 'Medium',
    maturity: 'High',
    effectiveness: 'Low',
    aleBest: '₹ 5 L',
    aleLikely: '₹ 28 L',
    aleWorst: '₹ 75 L',
    affectedAssets: 8,
    factors: [
      { label: 'Vulnerability (CVSS)', pct: 22, color: '#ff3557' },
      { label: 'Asset Criticality', pct: 35, color: '#ff623d' },
      { label: 'Threat Intelligence', pct: 18, color: '#ff9c3d' },
      { label: 'Exposure', pct: 15, color: '#ffd245' },
      { label: 'Control Gaps', pct: 10, color: '#00e0b4' },
    ],
  },
  {
    id: 4,
    title: 'Public S3 Bucket',
    sub: 'Misconfigured ACL allowing read access',
    asset: 'S3 - marketing',
    score: 68,
    exposure: '₹ 18 L',
    status: 'Medium',
    criticality: 'Medium',
    activity: 'Medium',
    maturity: 'Low',
    effectiveness: 'Medium',
    aleBest: '₹ 3 L',
    aleLikely: '₹ 18 L',
    aleWorst: '₹ 45 L',
    affectedAssets: 5,
    factors: [
      { label: 'Vulnerability (CVSS)', pct: 20, color: '#ff3557' },
      { label: 'Asset Criticality', pct: 25, color: '#ff623d' },
      { label: 'Threat Intelligence', pct: 25, color: '#ff9c3d' },
      { label: 'Exposure', pct: 20, color: '#ffd245' },
      { label: 'Control Gaps', pct: 10, color: '#00e0b4' },
    ],
  },
  {
    id: 5,
    title: 'Outdated SSL/TLS',
    sub: 'Legacy ciphers enabled on customer portal',
    asset: 'External Portal',
    score: 62,
    exposure: '₹ 12 L',
    status: 'Medium',
    criticality: 'High',
    activity: 'Low',
    maturity: 'Low',
    effectiveness: 'High',
    aleBest: '₹ 2 L',
    aleLikely: '₹ 12 L',
    aleWorst: '₹ 30 L',
    affectedAssets: 3,
    factors: [
      { label: 'Vulnerability (CVSS)', pct: 15, color: '#ff3557' },
      { label: 'Asset Criticality', pct: 30, color: '#ff623d' },
      { label: 'Threat Intelligence', pct: 15, color: '#ff9c3d' },
      { label: 'Exposure', pct: 25, color: '#ffd245' },
      { label: 'Control Gaps', pct: 15, color: '#00e0b4' },
    ],
  },
];

const investmentsList = [
  { id: 1, title: 'Patch Management Expansion', cost: '₹ 15,00,000', reduction: '28%', ale: '₹ 35 L', assets: 142, priority: 'P0', status: 'Recommended' },
  { id: 2, title: 'Identity & Access Hardening', cost: '₹ 12,00,000', reduction: '22%', ale: '₹ 28 L', assets: 86, priority: 'P0', status: 'Recommended' },
  { id: 3, title: 'Network Segmentation', cost: '₹ 18,00,000', reduction: '18%', ale: '₹ 22 L', assets: 64, priority: 'P1', status: 'Recommended' },
  { id: 4, title: 'Cloud Security Posture (CSPM)', cost: '₹ 10,00,000', reduction: '16%', ale: '₹ 18 L', assets: 52, priority: 'P1', status: 'Recommended' },
  { id: 5, title: 'Endpoint Detection & Response', cost: '₹ 20,00,000', reduction: '14%', ale: '₹ 16 L', assets: 310, priority: 'P2', status: 'Recommended' },
];

const riskEvents = [
  { title: 'Critical vulnerability detected', sub: 'CVE-2024-3094', time: 'Jun 15, 2024, 09:12 AM', color: '#ff3557' },
  { title: 'Asset risk score increased', sub: 'Finance DB (+18)', time: 'Jun 14, 2024, 08:45 PM', color: '#ff9c3d' },
  { title: 'Security control disabled', sub: 'MFA on 3 systems', time: 'Jun 14, 2024, 11:20 AM', color: '#ffd245' },
  { title: 'Risk model recalculated', sub: 'Incorporated latest threat intel', time: 'Jun 14, 2024, 02:18 AM', color: '#008fff' },
];

export function Dashboard({
  live: _live = true,
  riskScore = 72,
  range = '12m',
  setRange,
  onNav,
  action,
}: {
  live?: boolean;
  riskScore: number;
  range: RangeKey;
  setRange: (key: RangeKey) => void;
  onNav: (id: string) => void;
  action: (kind: string) => void;
}) {
  const [selectedRiskIndex, setSelectedRiskIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const selectedRisk = detailedRisks[selectedRiskIndex] || detailedRisks[0];
  const arcGradId = useId();
  const trendGradId = useId();

  return (
    <div className="dash-root">
      {/* PAGE HEADER - UNIFIED TO SECURITY CONTROLS MASTER */}
      <header className="sc-page-header">
        <div>
          <nav className="sc-breadcrumb" aria-label="Breadcrumb">
            <button onClick={() => onNav?.('dashboard')}>Home</button>
            <Icon name="chevron" />
            <span>Executive Dashboard</span>
          </nav>
          <h1>Executive Dashboard</h1>
          <p>Real-time cyber risk posture across your organization.</p>
        </div>

        <div className="sc-header-actions">
          <p className="dash-motto-text">
            DATA. CONTEXT. INSIGHT.<br />
            A SAFER TOMORROW.
          </p>
          <div className="dash-model-box">
            <div className="dash-model-box-top">
              <span className="dash-model-box-title">Live Risk Model</span>
              <span className="dash-model-active-pill">
                <span className="dash-model-dot" /> Active
              </span>
            </div>
            <div className="dash-model-box-sub">
              <Icon name="shieldCheck" />
              <span>Incorporating latest threats, assets &amp; business context.</span>
            </div>
          </div>

          <Dropdown
            width={220}
            button={() => (
              <span className="dash-date-btn">
                <Icon name="calendar" />
                <span>Jun 1, 2024 - Jun 15, 2024</span>
                <Icon name="chevron" />
              </span>
            )}
          >
            {(close) => (
              <ul className="dd-list">
                {ranges.map((item) => (
                  <li key={item.key}>
                    <button
                      className={item.key === range ? 'active' : ''}
                      onClick={() => {
                        setRange(item.key);
                        close();
                      }}
                    >
                      <span>{item.label}</span>
                      {item.key === range && <Icon name="check" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Dropdown>
        </div>
      </header>

      {/* TOP 6 KPI METRICS ROW */}
      <section className="dash-kpi-row" aria-label="Executive KPIs">
        {/* KPI 1: Overall Risk Score with Donut Ring */}
        <article className="dash-kpi-card kpi-risk-score">
          <div className="kpi-head">
            <Icon name="shield" />
            <h3>Overall Risk Score</h3>
          </div>
          <div className="kpi-score-content">
            <div className="kpi-score-donut">
              <svg viewBox="0 0 60 60" className="donut-svg">
                <defs>
                  <linearGradient id={arcGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00e0b4" />
                    <stop offset="45%" stopColor="#ffd245" />
                    <stop offset="75%" stopColor="#ff7d38" />
                    <stop offset="100%" stopColor="#ff3557" />
                  </linearGradient>
                </defs>
                <circle cx="30" cy="30" r="23" fill="none" stroke="#05273d" strokeWidth="6" />
                <circle
                  cx="30"
                  cy="30"
                  r="23"
                  fill="none"
                  stroke={`url(#${arcGradId})`}
                  strokeWidth="6"
                  strokeDasharray="144"
                  strokeDashoffset="40"
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
              </svg>
            </div>
            <div className="kpi-score-val-wrap">
              <div className="kpi-score-nums">
                <strong className="kpi-score-big">{riskScore}</strong>
                <span className="kpi-score-max">/ 100</span>
              </div>
              <span className="badge-high-risk">High Risk</span>
            </div>
          </div>
          <div className="kpi-foot">
            <span className="delta-green"><Icon name="arrowUp" /> 8% vs last month</span>
            <small>Driven by critical vulnerabilities and high business criticality</small>
          </div>
        </article>

        {/* KPI 2: Financial Exposure */}
        <article className="dash-kpi-card kpi-fin-exposure">
          <div className="kpi-head">
            <Icon name="database" />
            <h3>Financial Exposure</h3>
          </div>
          <div className="kpi-body">
            <strong className="kpi-big-val">₹ 1.25 Cr</strong>
            <span className="kpi-sub-line">Annualized Loss Expectancy <Icon name="info" /></span>
          </div>
          <div className="kpi-three-cols">
            <div><span>Best</span><b>₹ 0.35 Cr</b></div>
            <div><span>Likely</span><b>₹ 1.25 Cr</b></div>
            <div><span>Worst</span><b>₹ 3.40 Cr</b></div>
          </div>
        </article>

        {/* KPI 3: Open Vulnerabilities */}
        <article className="dash-kpi-card kpi-vulns">
          <div className="kpi-head">
            <Icon name="shieldCheck" />
            <h3>Open Vulnerabilities</h3>
          </div>
          <div className="kpi-body">
            <strong className="kpi-big-val">1,248</strong>
            <span className="delta-red"><Icon name="arrowDown" /> 12% vs last month</span>
          </div>
          <div className="kpi-three-cols">
            <div><b className="c-red">214</b><span>Critical</span></div>
            <div><b className="c-orange">582</b><span>High</span></div>
            <div><b className="c-yellow">452</b><span>Medium</span></div>
          </div>
        </article>

        {/* KPI 4: Security Control Coverage */}
        <article className="dash-kpi-card kpi-control-cov">
          <div className="kpi-head">
            <Icon name="pie" />
            <h3>Security Control Coverage</h3>
          </div>
          <div className="kpi-body">
            <strong className="kpi-big-val">72%</strong>
            <span className="delta-green"><Icon name="arrowUp" /> 6% vs last month</span>
          </div>
          <div className="kpi-foot-note">
            <small>Across 142 controls</small>
          </div>
        </article>

        {/* KPI 5: Security Budget */}
        <article className="dash-kpi-card kpi-budget">
          <div className="kpi-head">
            <Icon name="coins" />
            <h3>Security Budget</h3>
          </div>
          <div className="kpi-body">
            <strong className="kpi-big-val">₹ 25,00,000</strong>
            <span className="kpi-sub-spend">Current Spend: ₹ 9,50,000</span>
          </div>
          <div className="budget-bar-wrap">
            <div className="budget-track">
              <div className="budget-fill" style={{ width: '38%' }} />
            </div>
            <span className="budget-pct">38%</span>
          </div>
          <small className="budget-note">FY 2024 utilization</small>
        </article>

        {/* KPI 6: Risk Reduction Achieved */}
        <article className="dash-kpi-card kpi-risk-reduction">
          <div className="kpi-head">
            <Icon name="optim" />
            <h3>Risk Reduction Achieved</h3>
          </div>
          <div className="kpi-body">
            <strong className="kpi-big-val">18%</strong>
            <span className="delta-green"><Icon name="arrowUp" /> 6% vs last month</span>
          </div>
          <div className="kpi-foot-note">
            <small>Through implemented security measures</small>
          </div>
        </article>
      </section>

      {/* MAIN TWO-COLUMN CONTAINER (Left Content Grid + Right Risk Intelligence Drawer) */}
      <div className={`dash-layout-grid ${drawerOpen ? 'with-drawer' : 'no-drawer'}`}>
        {/* LEFT COLUMN: THE ANALYTICS ROWS */}
        <div className="dash-main-column">
          {/* ROW 2: 4 PANELS (Risk Trend, Risk by Asset Category, Risk Heatmap, Data Completeness) */}
          <div className="dash-grid-row-4">
            {/* 1. Risk Trend — Last 12 Months */}
            <section className="dash-panel panel-trend">
              <header className="panel-header">
                <h2>Risk Trend &mdash; Last 12 Months</h2>
                <div className="chart-legend-top">
                  <span><i className="dot-blue" /> Organization Risk Score</span>
                  <span><i className="dot-cyan" /> Target Risk Score</span>
                </div>
              </header>
              <div className="trend-body">
                <div className="trend-chart-area">
                  <svg viewBox="0 0 380 145" preserveAspectRatio="none" className="trend-svg">
                    <defs>
                      <linearGradient id={trendGradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#008fff" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#008fff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0, 20, 40, 60, 80, 100].map((val) => {
                      const y = 125 - val * 1.1;
                      return (
                        <g key={val}>
                          <line x1="28" y1={y} x2="375" y2={y} stroke="#072d42" strokeDasharray="2 3" strokeWidth="0.8" />
                          <text x="22" y={y + 3} fill="#7096b0" fontSize="9" textAnchor="end">{val}</text>
                        </g>
                      );
                    })}
                    {/* X Months */}
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => {
                      const x = 36 + i * 29;
                      return (
                        <text key={m} x={x} y="138" fill="#7096b0" fontSize="8.5" textAnchor="middle">{m}</text>
                      );
                    })}
                    {/* Area fill for Org score */}
                    <path
                      d="M 36,86 L 65,80 L 94,74 L 123,68 L 152,65 L 181,61 L 210,58 L 239,59 L 268,60 L 297,55 L 326,51 L 355,46 L 355,125 L 36,125 Z"
                      fill={`url(#${trendGradId})`}
                    />
                    {/* Org Score line (blue) */}
                    <path
                      d="M 36,86 L 65,80 L 94,74 L 123,68 L 152,65 L 181,61 L 210,58 L 239,59 L 268,60 L 297,55 L 326,51 L 355,46"
                      fill="none"
                      stroke="#008fff"
                      strokeWidth="2"
                    />
                    {[
                      [36, 86], [65, 80], [94, 74], [123, 68], [152, 65], [181, 61],
                      [210, 58], [239, 59], [268, 60], [297, 55], [326, 51], [355, 46],
                    ].map(([cx, cy], idx) => (
                      <circle key={idx} cx={cx} cy={cy} r="2.8" fill="#008fff" stroke="#001424" strokeWidth="1" />
                    ))}
                    {/* Target Score line (cyan dashed) */}
                    <path
                      d="M 36,104 L 65,98 L 94,92 L 123,90 L 152,87 L 181,84 L 210,82 L 239,81 L 268,80 L 297,76 L 326,73 L 355,70"
                      fill="none"
                      stroke="#00e0b4"
                      strokeWidth="1.6"
                      strokeDasharray="3 3"
                    />
                  </svg>
                </div>
                <div className="trend-callouts">
                  <div className="callout-current">
                    <strong>72</strong>
                    <span>Current</span>
                  </div>
                  <div className="callout-target">
                    <strong>40</strong>
                    <span>Target</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Risk by Asset Category */}
            <section className="dash-panel panel-categories">
              <header className="panel-header">
                <h2>Risk by Asset Category</h2>
              </header>
              <div className="cat-body">
                <div className="cat-donut-wrap">
                  <svg viewBox="0 0 120 120" className="cat-donut-svg">
                    {/* Circumference = 2 * PI * 42 = ~264 */}
                    <circle cx="60" cy="60" r="42" fill="none" stroke="#062539" strokeWidth="15" />
                    {/* Endpoints 28% = ~74 */}
                    <circle cx="60" cy="60" r="42" fill="none" stroke="#008fff" strokeWidth="15" strokeDasharray="74 264" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                    {/* Applications 22% = ~58 */}
                    <circle cx="60" cy="60" r="42" fill="none" stroke="#00d3ad" strokeWidth="15" strokeDasharray="58 264" strokeDashoffset="-74" transform="rotate(-90 60 60)" />
                    {/* Infrastructure 18% = ~47 */}
                    <circle cx="60" cy="60" r="42" fill="none" stroke="#00cbff" strokeWidth="15" strokeDasharray="47 264" strokeDashoffset="-132" transform="rotate(-90 60 60)" />
                    {/* Cloud 16% = ~42 */}
                    <circle cx="60" cy="60" r="42" fill="none" stroke="#ff7a45" strokeWidth="15" strokeDasharray="42 264" strokeDashoffset="-179" transform="rotate(-90 60 60)" />
                    {/* Network 10% = ~26 */}
                    <circle cx="60" cy="60" r="42" fill="none" stroke="#7c6fff" strokeWidth="15" strokeDasharray="26 264" strokeDashoffset="-221" transform="rotate(-90 60 60)" />
                    {/* Other 6% = ~16 */}
                    <circle cx="60" cy="60" r="42" fill="none" stroke="#6b8ba4" strokeWidth="15" strokeDasharray="16 264" strokeDashoffset="-247" transform="rotate(-90 60 60)" />
                    <text x="60" y="56" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="600">1,248</text>
                    <text x="60" y="72" textAnchor="middle" fill="#84a5c0" fontSize="8.5">Total Risks</text>
                  </svg>
                </div>
                <ul className="cat-legend">
                  <li><i style={{ background: '#008fff' }} /><span>Endpoints</span><b>28%</b><em>349</em></li>
                  <li><i style={{ background: '#00d3ad' }} /><span>Applications</span><b>22%</b><em>274</em></li>
                  <li><i style={{ background: '#00cbff' }} /><span>Infrastructure</span><b>18%</b><em>224</em></li>
                  <li><i style={{ background: '#ff7a45' }} /><span>Cloud</span><b>16%</b><em>199</em></li>
                  <li><i style={{ background: '#7c6fff' }} /><span>Network</span><b>10%</b><em>125</em></li>
                  <li><i style={{ background: '#6b8ba4' }} /><span>Other</span><b>6%</b><em>77</em></li>
                </ul>
              </div>
            </section>

            {/* 3. Risk Heatmap */}
            <section className="dash-panel panel-heatmap">
              <header className="panel-header">
                <h2>Risk Heatmap</h2>
              </header>
              <div className="heat-container">
                <div className="heat-axis-y">
                  <span>Likelihood</span>
                </div>
                <div className="heat-matrix-wrap">
                  <div className="heat-y-labels">
                    <span>Very High</span>
                    <span>High</span>
                    <span>Medium</span>
                    <span>Low</span>
                    <span>Very Low</span>
                  </div>
                  <div className="heat-grid">
                    {/* Row 0: Very High */}
                    <span className="hcell h-yellow">5</span>
                    <span className="hcell h-orange">12</span>
                    <span className="hcell h-red">28</span>
                    <span className="hcell h-red">16</span>
                    <span className="hcell h-darkred">8</span>
                    {/* Row 1: High */}
                    <span className="hcell h-yellow">12</span>
                    <span className="hcell h-orange">34</span>
                    <span className="hcell h-red">76</span>
                    <span className="hcell h-red">45</span>
                    <span className="hcell h-darkred">18</span>
                    {/* Row 2: Medium */}
                    <span className="hcell h-green">8</span>
                    <span className="hcell h-yellow">28</span>
                    <span className="hcell h-orange">102</span>
                    <span className="hcell h-red">64</span>
                    <span className="hcell h-darkred">24</span>
                    {/* Row 3: Low */}
                    <span className="hcell h-green">4</span>
                    <span className="hcell h-green">16</span>
                    <span className="hcell h-yellow">38</span>
                    <span className="hcell h-orange">22</span>
                    <span className="hcell h-red">8</span>
                    {/* Row 4: Very Low */}
                    <span className="hcell h-green">1</span>
                    <span className="hcell h-green">6</span>
                    <span className="hcell h-green">14</span>
                    <span className="hcell h-yellow">8</span>
                    <span className="hcell h-green">4</span>
                  </div>
                </div>
              </div>
              <div className="heat-axis-x">
                <div className="heat-x-labels">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>
                <span className="heat-x-title">Impact</span>
              </div>
            </section>

            {/* 4. Data Completeness */}
            <section className="dash-panel panel-completeness">
              <header className="panel-header">
                <h2>Data Completeness <Icon name="info" /></h2>
              </header>
              <div className="complete-body">
                <div className="complete-rings-grid">
                  <div className="ring-item">
                    <svg viewBox="0 0 54 54" className="ring-svg">
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#05273d" strokeWidth="5" />
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#00cbff" strokeWidth="5" strokeDasharray="132" strokeDashoffset="11" strokeLinecap="round" transform="rotate(-90 27 27)" />
                      <text x="27" y="31" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">92%</text>
                    </svg>
                    <span>Assets</span>
                  </div>
                  <div className="ring-item">
                    <svg viewBox="0 0 54 54" className="ring-svg">
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#05273d" strokeWidth="5" />
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#008fff" strokeWidth="5" strokeDasharray="132" strokeDashoffset="16" strokeLinecap="round" transform="rotate(-90 27 27)" />
                      <text x="27" y="31" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">88%</text>
                    </svg>
                    <span>Vulnerabilities</span>
                  </div>
                  <div className="ring-item">
                    <svg viewBox="0 0 54 54" className="ring-svg">
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#05273d" strokeWidth="5" />
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#ffd245" strokeWidth="5" strokeDasharray="132" strokeDashoffset="32" strokeLinecap="round" transform="rotate(-90 27 27)" />
                      <text x="27" y="31" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">76%</text>
                    </svg>
                    <span>Controls</span>
                  </div>
                  <div className="ring-item">
                    <svg viewBox="0 0 54 54" className="ring-svg">
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#05273d" strokeWidth="5" />
                      <circle cx="27" cy="27" r="21" fill="none" stroke="#00e0b4" strokeWidth="5" strokeDasharray="132" strokeDashoffset="7" strokeLinecap="round" transform="rotate(-90 27 27)" />
                      <text x="27" y="31" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">95%</text>
                    </svg>
                    <span>Threat Intel</span>
                  </div>
                </div>

                <div className="warn-callout">
                  <div className="warn-icon-col">
                    <Icon name="alert" />
                  </div>
                  <div className="warn-copy">
                    <strong>Control data is incomplete</strong>
                    <p>Some control evidence is missing, which may impact risk accuracy.</p>
                    <button className="link-cyan" onClick={() => onNav('controls')}>
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* BOTTOM SECTION: 3 COLUMNS (Tables Column, Factors & Forecast Column, Events & Actions Column) */}
          <div className="dash-bottom-columns">
            {/* COLUMN 1: TOP RISKS & RECOMMENDATIONS TABLES */}
            <div className="dash-col-tables">
              {/* Top 5 Risks */}
              <section className="dash-panel panel-top-risks">
                <header className="panel-header">
                  <h2>Top 5 Risks</h2>
                  <button className="link-cyan" onClick={() => onNav('vulnerabilities')}>
                    View All Risks &rarr;
                  </button>
                </header>
                <div className="panel-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th style={{ width: '4%' }}>#</th>
                        <th style={{ width: '34%' }}>Risk Title</th>
                        <th style={{ width: '22%' }}>Affected Asset</th>
                        <th style={{ width: '14%' }}>Risk Score</th>
                        <th style={{ width: '15%' }}>Financial Exposure</th>
                        <th style={{ width: '11%' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedRisks.map((risk, index) => (
                        <tr
                          key={risk.id}
                          className={selectedRiskIndex === index ? 'is-active-row' : ''}
                          onClick={() => {
                            setSelectedRiskIndex(index);
                            setDrawerOpen(true);
                          }}
                        >
                          <td className="c-muted">{risk.id}</td>
                          <td className="c-strong">{risk.title}</td>
                          <td>{risk.asset}</td>
                          <td>
                            <span className={`score-badge ${risk.score >= 80 ? 'sc-red' : risk.score >= 70 ? 'sc-orange' : 'sc-yellow'}`}>
                              {risk.score}
                            </span>
                          </td>
                          <td>{risk.exposure}</td>
                          <td>
                            <span className={`status-pill ${risk.status.toLowerCase()}`}>
                              {risk.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Top Recommended Investments */}
              <section className="dash-panel panel-investments">
                <header className="panel-header">
                  <h2>Top Recommended Investments</h2>
                  <button className="link-cyan" onClick={() => onNav('recommendations')}>
                    View All Recommendations &rarr;
                  </button>
                </header>
                <div className="panel-table-wrap">
                  <table className="dash-table table-investments">
                    <thead>
                      <tr>
                        <th style={{ width: '4%' }}>#</th>
                        <th style={{ width: '32%' }}>Investment</th>
                        <th style={{ width: '16%' }}>Estimated Cost</th>
                        <th style={{ width: '14%' }}>Risk Reduction</th>
                        <th style={{ width: '13%' }}>ALE Reduction</th>
                        <th style={{ width: '7%' }}>Assets</th>
                        <th style={{ width: '6%' }}>Priority</th>
                        <th style={{ width: '8%' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investmentsList.map((item) => (
                        <tr key={item.id}>
                          <td className="c-muted">{item.id}</td>
                          <td className="c-strong">{item.title}</td>
                          <td>{item.cost}</td>
                          <td className="c-green">{item.reduction}</td>
                          <td>{item.ale}</td>
                          <td>{item.assets}</td>
                          <td>
                            <span className={`prio-pill ${item.priority.toLowerCase()}`}>{item.priority}</span>
                          </td>
                          <td>
                            <span className="recom-pill">{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* COLUMN 2: RISK FACTORS & AI FORECAST */}
            <div className="dash-col-factors">
              {/* Risk Factor Breakdown */}
              <section className="dash-panel panel-factors">
                <header className="panel-header">
                  <h2>Risk Factor Breakdown <Icon name="info" /></h2>
                </header>
                <div className="factors-body">
                  <div className="factor-row">
                    <span className="factor-label">Likelihood</span>
                    <div className="factor-track">
                      <div className="factor-fill f-red" style={{ width: '78%' }} />
                    </div>
                    <span className="factor-val">78%</span>
                  </div>
                  <div className="factor-row">
                    <span className="factor-label">Impact</span>
                    <div className="factor-track">
                      <div className="factor-fill f-orange" style={{ width: '72%' }} />
                    </div>
                    <span className="factor-val">72%</span>
                  </div>
                  <div className="factor-row">
                    <span className="factor-label">Exposure Modifier</span>
                    <div className="factor-track">
                      <div className="factor-fill f-yellow" style={{ width: '56%' }} />
                    </div>
                    <span className="factor-val">56%</span>
                  </div>
                  <div className="factor-row">
                    <span className="factor-label">Control Modifier</span>
                    <div className="factor-track">
                      <div className="factor-fill f-cyan" style={{ width: '28%' }} />
                    </div>
                    <span className="factor-val">28%</span>
                  </div>
                  <p className="factors-note">
                    Risk is calculated using a combination of technical signals and business context, not CVSS alone.
                  </p>
                </div>
              </section>

              {/* AI Risk Forecast */}
              <section className="dash-panel panel-forecast">
                <header className="panel-header">
                  <h2>AI Risk Forecast <Icon name="info" /></h2>
                </header>
                <div className="forecast-inner">
                  <div className="forecast-chart-wrap">
                    <div className="forecast-legend-top">
                      <span><i className="dot-blue" /> Projected Risk</span>
                      <span><i className="dash-cyan" /> Current Trend</span>
                      <span><i className="dot-green" /> Target Risk</span>
                    </div>
                    <div className="forecast-svg-row">
                      <svg viewBox="0 0 200 85" preserveAspectRatio="none" className="forecast-svg">
                        {[100, 80, 60, 40, 20, 0].map((v) => (
                          <line key={v} x1="18" y1={75 - v * 0.65} x2="195" y2={75 - v * 0.65} stroke="#072d42" strokeDasharray="2 3" strokeWidth="0.7" />
                        ))}
                        {/* Trend line */}
                        <path d="M 22,28 L 76,26 L 130,24 L 184,22" fill="none" stroke="#008fff" strokeDasharray="3 3" strokeWidth="1.4" />
                        {/* Projected curve */}
                        <path d="M 22,28 L 76,36 L 130,45 L 184,52" fill="none" stroke="#00cbff" strokeWidth="1.8" />
                        {/* Target curve */}
                        <path d="M 22,28 L 76,44 L 130,58 L 184,66" fill="none" stroke="#00e0b4" strokeWidth="1.5" />
                        {/* X labels */}
                        <text x="22" y="82" fill="#7096b0" fontSize="7.5" textAnchor="middle">Now</text>
                        <text x="76" y="82" fill="#7096b0" fontSize="7.5" textAnchor="middle">30 days</text>
                        <text x="130" y="82" fill="#7096b0" fontSize="7.5" textAnchor="middle">60 days</text>
                        <text x="184" y="82" fill="#7096b0" fontSize="7.5" textAnchor="middle">90 days</text>
                      </svg>
                      <div className="forecast-targets">
                        <div><strong className="c-blue">78</strong><span>Projected</span></div>
                        <div><strong className="c-cyan">56</strong><span>Trend</span></div>
                        <div><strong className="c-green">40</strong><span>Target</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="forecast-footer">
                    <span className="confidence-pill">85% Confidence</span>
                    <p>Risk is expected to decrease by 22% in 90 days with planned and recommended measures.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* COLUMN 3: RECENT RISK EVENTS & QUICK ACTIONS */}
            <div className="dash-col-events">
              {/* Recent Risk Events */}
              <section className="dash-panel panel-events">
                <header className="panel-header">
                  <h2>Recent Risk Events <Icon name="info" /></h2>
                </header>
                <div className="events-timeline">
                  {riskEvents.map((ev, i) => (
                    <div key={i} className="ev-item">
                      <span className="ev-dot" style={{ background: ev.color }} />
                      <div className="ev-copy">
                        <strong>{ev.title}</strong>
                        <p>{ev.sub}</p>
                        <time>{ev.time}</time>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="dash-panel panel-actions">
                <header className="panel-header">
                  <h2>Quick Actions</h2>
                  <button className="link-cyan" onClick={() => onNav('whatif')}>View All &rarr;</button>
                </header>
                <div className="actions-grid">
                  <button className="qaction-btn" onClick={() => action('analysis')}>
                    <span className="qact-icon c-red"><Icon name="alert" /></span>
                    <span>Run New Risk Analysis</span>
                  </button>
                  <button className="qaction-btn" onClick={() => action('asset')}>
                    <span className="qact-icon c-blue"><Icon name="plus" /></span>
                    <span>Add New Asset</span>
                  </button>
                  <button className="qaction-btn" onClick={() => action('report')}>
                    <span className="qact-icon c-cyan"><Icon name="report" /></span>
                    <span>Generate Report</span>
                  </button>
                  <button className="qaction-btn" onClick={() => onNav('whatif')}>
                    <span className="qact-icon c-purple"><Icon name="link" /></span>
                    <span>Explore What-If Scenarios</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RISK INTELLIGENCE DRAWER */}
        {drawerOpen && (
          <aside className="risk-intel-panel" aria-label="Risk Intelligence Detail">
            <header className="intel-header">
              <h3>Risk Intelligence</h3>
              <button className="intel-close-btn" onClick={() => setDrawerOpen(false)} aria-label="Close intelligence panel">
                <Icon name="close" />
              </button>
            </header>

            <div className="intel-body">
              <span className="intel-critical-pill">Critical Risk</span>
              <h2 className="intel-title">{selectedRisk.title}</h2>
              <p className="intel-sub">{selectedRisk.sub}</p>

              {/* Big Circular Score Gauge */}
              <div className="intel-gauge-area">
                <div className="intel-gauge">
                  <svg viewBox="0 0 100 65" className="gauge-svg">
                    <path d="M 12 58 A 38 38 0 1 1 88 58" fill="none" stroke="#072b40" strokeWidth="8" strokeLinecap="round" />
                    <path
                      d="M 12 58 A 38 38 0 1 1 88 58"
                      fill="none"
                      stroke="#ff3557"
                      strokeWidth="8"
                      strokeDasharray="180"
                      strokeDashoffset="35"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="intel-gauge-val">
                    <strong>{selectedRisk.score}</strong>
                    <span>Risk Score</span>
                  </div>
                </div>
              </div>

              {/* 4-Item Attributes Grid */}
              <div className="intel-attr-grid">
                <div><span>Business Criticality</span><strong className="c-red">{selectedRisk.criticality}</strong></div>
                <div><span>Threat Activity</span><strong className="c-red">{selectedRisk.activity}</strong></div>
                <div><span>Exploit Maturity</span><strong className="c-red">{selectedRisk.maturity}</strong></div>
                <div><span>Control Effectiveness</span><strong className="c-red">{selectedRisk.effectiveness}</strong></div>
              </div>

              {/* Financial Exposure (ALE) */}
              <div className="intel-block">
                <h4>Financial Exposure (ALE) <Icon name="info" /></h4>
                <div className="intel-ale-row">
                  <div><span>Best</span><strong>{selectedRisk.aleBest}</strong></div>
                  <div><span>Likely</span><strong>{selectedRisk.aleLikely}</strong></div>
                  <div><span>Worst</span><strong>{selectedRisk.aleWorst}</strong></div>
                </div>
              </div>

              {/* Affected Assets */}
              <div className="intel-block">
                <h4>Affected Assets</h4>
                <div className="intel-assets-row">
                  <span className="asset-icon-val"><Icon name="server" /> <b>{selectedRisk.affectedAssets}</b></span>
                  <button className="link-cyan" onClick={() => onNav('assets')}>View Assets &rarr;</button>
                </div>
              </div>

              {/* Risk Factors Contribution */}
              <div className="intel-block">
                <h4>Risk Factors Contribution</h4>
                <div className="intel-factors-list">
                  {selectedRisk.factors.map((f) => (
                    <div key={f.label} className="intel-f-row">
                      <span className="if-label">{f.label}</span>
                      <div className="if-track">
                        <div className="if-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                      </div>
                      <span className="if-val">{f.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Action Buttons Stack */}
              <div className="intel-actions-stack">
                <button className="intel-btn" onClick={() => action('vulnerability')}>
                  <Icon name="plus" /> New Vulnerability
                </button>
                <button className="intel-btn" onClick={() => onNav('assets')}>
                  <Icon name="plus" /> View Asset
                </button>
                <button className="intel-btn" onClick={() => onNav('whatif')}>
                  <Icon name="flask" /> Run What-If Scenario
                </button>
                <button className="intel-btn" onClick={() => onNav('controls')}>
                  <Icon name="report" /> Add to Remediation Plan
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
