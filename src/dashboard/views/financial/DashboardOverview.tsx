import { useState } from 'react';
import { Activity, ArrowDown, ArrowRight, ArrowUp, Calculator, ChartNoAxesCombined, ChevronDown, Database, Info, Percent } from 'lucide-react';
import { initialAssets, rupee, type Asset } from './data';
import AssetTable from './AssetTable';
import { BusinessChart, CategoryChart, ScatterChart, TrendChart } from './Charts';

export function MoneyBag({ size = 32 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 36 40" fill="none" aria-hidden="true"><path d="M12 3c-2-2-6-1-6 1l6 9C6 18 2 23 3 30c1 6 7 9 15 9s14-3 15-9c1-7-3-12-9-17l6-9c0-2-4-3-6-1-2-2-4-2-6 0-2-2-4-2-6 0Z" fill="currentColor" /><path d="M12 13h12M22 21c-1-2-7-3-8 1-1 4 9 3 8 7-1 4-7 3-9 1m5-12v16" stroke="#4c1422" strokeWidth="2.2" strokeLinecap="round" /></svg>;
}

const workflowSteps = [
  { title: <>Asset Value<br />({rupee})</>, description: <>Business value<br />of the asset</>, icon: Database, color: 'blue' },
  { title: <>Exposure<br />Factor (EF)</>, description: <>Portion of asset<br />value at risk</>, icon: Percent, color: 'blue' },
  { title: <>Single Loss<br />Expectancy (SLE)</>, description: <>SLE = Asset Value<br />&times; EF</>, icon: Calculator, color: 'blue' },
  { title: <>Likelihood /<br />Annual Rate (ARO)</>, description: <>Derived from risk<br />score &amp; threat intel</>, icon: ChartNoAxesCombined, color: 'blue' },
  { title: <>Annualized<br />Loss Expectancy (ALE)</>, description: <>ALE = SLE &times; ARO<br />(Shown as range)</>, icon: MoneyBag, color: 'red' },
];

interface OverviewProps {
  assets: Asset[];
  factor: number;
  period: string;
  onAsset: (asset: Asset) => void;
  onUnit: (unit: string) => void;
  onCategory: (category: string) => void;
  onMetric: (title: string, description: string) => void;
}

export default function DashboardOverview({ assets, factor, period, onAsset, onUnit, onCategory, onMetric }: OverviewProps) {
  const [businessMode, setBusinessMode] = useState('Total ALE');
  const [categoryMode, setCategoryMode] = useState<'ALE' | 'SLE'>('ALE');
  const valueDelta = assets.reduce((sum, asset) => sum + asset.value, 0) - initialAssets.reduce((sum, asset) => sum + asset.value, 0);
  const metrics = [
    { title: 'Total Asset Value', value: `${rupee} ${(125.6 + valueDelta).toFixed(1)} Cr`, icon: Database, color: 'blue', change: '12%', good: true, down: false, description: `The combined business value of all assets in your risk portfolio is ${(125.6 + valueDelta).toFixed(1)} crore. Asset value includes replacement costs, business dependency, and revenue impact.` },
    { title: 'Average SLE', value: `${rupee} 18.4 L`, icon: Activity, color: 'purple', change: '6%', good: false, down: false, description: 'Single Loss Expectancy (SLE) estimates the financial loss from one risk event. Your average SLE is 18.4 lakh per asset, calculated as asset value multiplied by the exposure factor.' },
    { title: 'Average ARO', value: '0.32', suffix: '/ year', icon: ChartNoAxesCombined, color: 'teal', change: '18%', good: true, down: true, description: 'Annual Rate of Occurrence (ARO) is the estimated frequency of a risk event in one year. An average ARO of 0.32 implies approximately one event every 3.1 years per assessed asset.' },
    { title: 'Total ALE', value: `${rupee} ${(4.8 * factor).toFixed(1)} Cr`, suffix: '/ year', icon: MoneyBag, color: 'red', change: '22%', good: false, down: false, description: `Your portfolio has an estimated annualized loss expectancy of ${rupee} ${(4.8 * factor).toFixed(1)} crore. ALE combines the financial impact of a risk event with its probability of occurring.` },
  ];
  return (
    <div className="overview-grid">
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <button className="metric-card panel" key={metric.title} onClick={() => onMetric(metric.title, metric.description)}>
            <div className={`metric-icon ${metric.color}`}><metric.icon size={31} /></div>
            <div className="metric-copy">
              <h3>{metric.title}</h3>
              <div className="metric-value">{metric.value}{metric.suffix && <small> {metric.suffix}</small>}</div>
              <p><span className={metric.good ? 'text-teal' : 'text-red'}>{metric.down ? <ArrowDown size={15} /> : <ArrowUp size={15} />}{metric.change}</span><small>vs last quarter</small></p>
            </div>
          </button>
        ))}
      </div>
      <div className="exposure-row">
        <section className="panel loss-expectancy">
          <div className="panel-heading">
            <h2>Annualized Loss Expectancy (ALE)<span className="info-help" tabIndex={0}><Info size={12} /><span>Expected annual financial loss, shown across the best, most likely, and worst modeled outcomes.</span></span></h2>
            <p>Range of potential annual loss based on risk scenarios</p>
          </div>
          <div className="scenario-grid">
            {[
              { label: 'Best Case', amount: 1.9, probability: 'P10 (Low Impact)', change: '-60% vs most likely', color: 'teal' },
              { label: 'Most Likely', amount: 4.8, probability: 'P50 (Expected)', change: '', color: 'blue' },
              { label: 'Worst Case', amount: 12.6, probability: 'P90 (High Impact)', change: '+162% vs most likely', color: 'red' }
            ].map((scenario) => (
              <button key={scenario.label} className={`scenario-summary ${scenario.color}`} onClick={() => onMetric(scenario.label, `${scenario.probability}: ${rupee} ${(scenario.amount * factor).toFixed(1)} crore of annualized financial exposure. These estimates are calculated using a Monte Carlo simulation of possible risk events across your asset portfolio.`)}>
                <h3>{scenario.label}</h3>
                <strong>{rupee} {(scenario.amount * factor).toFixed(1)} Cr<small> / year</small></strong>
                <p>{scenario.probability}</p>
                {scenario.change && <span>{scenario.change}</span>}
              </button>
            ))}
          </div>
        </section>
        <section className="panel impact-workflow">
          <div className="panel-heading">
            <h2>From Risk to Financial Impact</h2>
            <p>How we calculate financial exposure</p>
          </div>
          <div className="workflow">
            {workflowSteps.map((step, index) => (
              <div className="workflow-step" key={index}>
                <span className={`step-number ${step.color}`}>{index + 1}</span>
                <div className={`step-icon ${step.color}`}><step.icon size={26} /></div>
                {index < workflowSteps.length - 1 && <ArrowRight className="step-arrow" size={12} />}
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="charts-row">
        <section className="panel business-chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Financial Exposure by Business Unit</h2>
              <p>{businessMode} by business unit ({rupee} per year)</p>
            </div>
            <label className="chart-select">
              <select aria-label="Business unit chart measure" value={businessMode} onChange={(event) => setBusinessMode(event.target.value)}>
                <option>Total ALE</option>
                <option>Asset Value</option>
                <option>Average SLE</option>
              </select>
              <ChevronDown size={12} />
            </label>
          </div>
          <BusinessChart factor={factor} mode={businessMode} onSelect={onUnit} />
        </section>
        <section className="panel trend-chart-panel">
          <div className="panel-heading">
            <h2>{period === 'Last 6 Months' ? '6' : period === 'Last 3 Months' ? '3' : '12'}-Month Financial Exposure Trend</h2>
          </div>
          <TrendChart factor={factor} period={period} />
        </section>
      </div>
      <div className="bottom-row">
        <section className="panel top-assets-panel">
          <div className="panel-heading">
            <h2>Top 10 Assets by Expected Annual Loss (ALE)</h2>
          </div>
          <AssetTable assets={assets} onSelect={onAsset} />
        </section>
        <section className="panel category-chart-panel">
          <div className="panel-heading">
            <h2>Financial Exposure by Risk Category</h2>
          </div>
          <div className="segmented-control" aria-label="Risk category metric">
            <button className={categoryMode === 'ALE' ? 'active' : ''} onClick={() => setCategoryMode('ALE')}>ALE</button>
            <button className={categoryMode === 'SLE' ? 'active' : ''} onClick={() => setCategoryMode('SLE')}>SLE</button>
          </div>
          <CategoryChart mode={categoryMode} factor={factor} onSelect={onCategory} />
        </section>
        <section className="panel scatter-chart-panel">
          <div className="panel-heading">
            <h2>Risk Score vs Financial Impact</h2>
            <p>Each dot represents an asset</p>
          </div>
          <ScatterChart assets={assets} onSelect={onAsset} />
        </section>
      </div>
    </div>
  );
}
