import { Delta, Panel, StatusChip } from '../components/ui';
import { DonutChart, FactorBars, ProgressRing } from '../components/Charts';
import { VulnerabilitiesView } from './VulnerabilitiesView';
import { AssetsView } from './AssetsView';
import { WhatIfScenarioView } from './WhatIfScenarioView';
import { ReportAnalysisView } from './ReportAnalysisView';
import AuditLogView from './AuditLogView';
import SettingsView from './SettingsView';
import IntegrationsView from './IntegrationsView';
import ThreatIntelligenceView from './ThreatIntelligenceView';
import OptimizationView from './OptimizationView';
import RecommendationsView from './RecommendationsView';
import RiskAnalysisView from './RiskAnalysisView';
import ComplianceView from './ComplianceView';
import { FinancialExposureView } from './FinancialExposureView';
import { completeness, controls, events, riskFactors, topRisks } from '../data';

function SubHead({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return <header className="page-head"><div><h1>{title}</h1><p className="page-sub">{sub}</p></div>{right}</header>;
}

function MiniKpi({ label, value, note, tone = '' }: { label: string; value: string; note?: string; tone?: string }) {
  return <article className={`kpi mini ${tone}`}><h3>{label}</h3><p className="kpi-value sm">{value}</p>{note && <p className="kpi-line">{note}</p>}</article>;
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="table-scroll">
      <table className="table">
        <thead><tr>{head.map((cell) => <th key={cell} className={/Score|CVSS|Assets|Exposure|Coverage|ALE/.test(cell) ? 'num' : ''}>{cell}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className={/Score|CVSS|Assets|Exposure|Coverage|ALE/.test(head[j] ?? '') ? 'num' : ''}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function SectionView({ id, onNav, action }: { id: string; onNav: (id: string) => void; action: (kind: string) => void }) {
  if (id === 'assets') return (
    <AssetsView onNav={onNav} externalNotify={action} />
  );

  if (id === 'vulnerabilities') return (
    <VulnerabilitiesView onNav={onNav} externalNotify={action} />
  );

  if (id === 'intel') return (
    <ThreatIntelligenceView onNav={onNav} externalNotify={action} />
  );

  if (id === 'controls') return (
    <>
      <SubHead title="Security Controls" sub="Control coverage against target posture." />
      <div className="ring-row wide">
        {completeness.map((item) => <div key={item.label} className="ring-cell static"><ProgressRing value={item.value} color={item.color} size={78} /><span>{item.label}</span></div>)}
      </div>
      <Panel title="Control Coverage">
        <Table head={['Control', 'Domain', 'Coverage', 'Target', 'Owner']} rows={controls.map((control) => [
          <span className="strong">{control.name}</span>, control.domain,
          <span className="bar-cell"><span className="factor-track"><span className="factor-fill" style={{ width: `${control.coverage}%`, background: control.coverage < 60 ? '#ef4444' : control.coverage < 85 ? '#eab308' : '#22c55e' }} /></span>{control.coverage}%</span>,
          `${control.target}%`, control.owner,
        ])} />
      </Panel>
    </>
  );

  if (id === 'quant') return (
    <>
      <SubHead title="Risk Quantification" sub="Probabilistic loss modelling across the organization." />
      <div className="mini-row">
        <MiniKpi label="Annualized Loss Exposure" value="₹ 1.25 Cr" note="Likely scenario" />
        <MiniKpi label="Best Case" value="₹ 0.4 Cr" note="Controls perform at target" />
        <MiniKpi label="Worst Case" value="₹ 3.8 Cr" note="1-in-200 year event" tone="tone-red" />
        <MiniKpi label="Value at Risk (99%)" value="₹ 2.6 Cr" note="12 month horizon" tone="tone-amber" />
      </div>
      <div className="two-col">
        <Panel title="Loss Exceedance Curve"><FactorBars items={riskFactors} /></Panel>
        <Panel title="Top Risk Contributions"><DonutChart data={[{ label: 'Endpoints', value: 28, color: '#3b82f6' }, { label: 'Applications', value: 24, color: '#8b5cf6' }, { label: 'Infrastructure', value: 20, color: '#22d3ee' }, { label: 'Cloud', value: 15, color: '#eab308' }, { label: 'Network', value: 8, color: '#f97316' }, { label: 'Other', value: 5, color: '#64748b' }]} total={1248} centerLabel="Total Risks" /></Panel>
      </div>
    </>
  );

  if (id === 'exposure') return (
    <FinancialExposureView onNav={onNav} externalNotify={action} />
  );

  if (id === 'optimization') return (
    <OptimizationView onNav={onNav} externalNotify={action} />
  );

  if (id === 'recommendations') return (
    <RecommendationsView onNav={onNav} externalNotify={action} />
  );

  if (id === 'analysis') return (
    <RiskAnalysisView onNav={onNav} externalNotify={action} />
  );

  if (id === 'whatif') return (
    <WhatIfScenarioView onNav={onNav} externalNotify={action} />
  );

  if (id === 'reports') return (
    <ReportAnalysisView onNav={onNav} externalNotify={action} />
  );

  if (id === 'audit') return (
    <AuditLogView onNav={onNav} externalNotify={action} />
  );

  if (id === 'settings') return (
    <SettingsView onNav={onNav} externalNotify={action} />
  );

  if (id === 'integrations') return (
    <IntegrationsView onNav={onNav} externalNotify={action} />
  );

  if (id === 'compliance') return (
    <ComplianceView onNav={onNav} externalNotify={action} />
  );

  return (
    <>
      <SubHead title="Settings" sub="Model thresholds and workspace preferences." />
      <div className="two-col">
        <Panel title="Risk Appetite">
          <div className="settings-list">
            {[{ label: 'High Risk threshold', value: 'Score ≥ 70' }, { label: 'Critical SLA', value: '7 days' }, { label: 'Reporting currency', value: 'INR (₹)' }, { label: 'Live risk model', value: 'Enabled' }].map((setting) => (
              <div key={setting.label} className="setting-row"><span>{setting.label}</span><b>{setting.value}</b></div>
            ))}
          </div>
        </Panel>
        <Panel title="Access">
          <div className="settings-list">
            {[{ label: 'Role', value: 'CISO · full access' }, { label: 'SSO', value: 'Enforced' }, { label: 'MFA', value: 'Required' }, { label: 'Data residency', value: 'Mumbai (ap-south-1)' }].map((setting) => (
              <div key={setting.label} className="setting-row"><span>{setting.label}</span><b>{setting.value}</b></div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title="Recent Risk Events"><ul className="event-list">{events.slice(0, 3).map((event, index) => <li key={index}><StatusChip status={event.severity} /><span className="event-text">{event.text}</span><span className="event-time">{event.time}</span></li>)}</ul></Panel>
    </>
  );
}

export { SubHead, MiniKpi, Table, topRisks, Delta };
