import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  PanelRightOpen,
  X,
} from 'lucide-react';
import '../../styles/financial.css';
import { initialAssets, isAssetArray, type Asset } from './financial/data';
import AssetPanel, { type AssetAction, type AssetViewRequest } from './financial/AssetPanel';
import DashboardOverview from './financial/DashboardOverview';
import Dialogs, { type DialogState, type Report } from './financial/Dialogs';
import {
  AssetExposureView,
  BusinessUnitsView,
  CategoryAnalysisView,
  ModuleView,
  ReportsView,
  type PlanItem,
} from './financial/WorkspaceViews';
import useStoredState from './financial/useStoredState';

export interface FinancialExposureViewProps {
  onNav?: (viewId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

const dashboardTabs = [
  'Overview',
  'Asset Exposure',
  'Business Units',
  'Category Analysis',
  'Scenario Analysis',
  'Reports',
];

export function FinancialExposureView({ onNav, externalNotify }: FinancialExposureViewProps) {
  const [assets, setAssets] = useStoredState('cyberriskiq-assets-v1', initialAssets, isAssetArray);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedAssetId, setSelectedAssetId] = useState(1);
  const [panelRequest, setPanelRequest] = useState<AssetViewRequest>({ tab: 'Overview', id: 0 });
  const [detailOpen, setDetailOpen] = useState(() => window.innerWidth >= 1180);
  const [period, setPeriod] = useState('Last 12 Months');
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [unitFilter, setUnitFilter] = useState('All business units');
  const [category, setCategory] = useState('Data Breach');
  const [plan, setPlan] = useStoredState<PlanItem[]>(
    'cyberriskiq-plan-v1',
    [],
    (value) =>
      Array.isArray(value) &&
      value.every(
        (item) =>
          item &&
          typeof item.assetId === 'number' &&
          typeof item.reduction === 'number' &&
          typeof item.investment === 'number'
      )
  );
  const [toast, setToast] = useState<string | null>(null);
  const [reports, setReports] = useStoredState<Report[]>(
    'cyberriskiq-reports-v1',
    [
      { id: 1, name: 'Monthly Financial Exposure', date: 'Dec 31, 2025', format: 'CSV', assets: initialAssets },
      { id: 2, name: 'Critical Asset Risk Summary', date: 'Dec 24, 2025', format: 'CSV', assets: initialAssets.filter((asset) => asset.level === 'Critical') },
    ],
    (value) =>
      Array.isArray(value) &&
      value.every(
        (report) =>
          report &&
          typeof report.id === 'number' &&
          typeof report.name === 'string' &&
          typeof report.format === 'string' &&
          isAssetArray(report.assets)
      )
  );

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) || assets[0];

  const notify = useCallback(
    (message: string) => {
      setToast(message);
      if (externalNotify) externalNotify(message, 'ok');
    },
    [externalNotify]
  );

  const closeDialog = useCallback(() => setDialog(null), []);

  const baseline = initialAssets.reduce((sum, asset) => sum + asset.ale, 0);
  const adjustedTotal = 4.8 + assets.reduce((sum, asset) => sum + asset.ale, 0) - baseline;
  const periodFactor =
    period === 'Last 6 Months' ? 0.94 : period === 'Last 3 Months' ? 0.89 : period === 'Year to Date' ? 0.97 : 1;
  const factor = Math.max(0.05, adjustedTotal / 4.8) * periodFactor;

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timeout);
  }, [toast]);

  function selectAsset(asset: Asset) {
    setSelectedAssetId(asset.id);
    setDetailOpen(true);
    setPanelRequest({ tab: 'Overview', id: Date.now() });
  }

  function handleAssetAction(action: AssetAction, asset: Asset) {
    setDialog({ kind: action, asset });
  }

  function togglePlan(asset: Asset) {
    const exists = plan.some((item) => item.assetId === asset.id);
    setPlan((current) =>
      exists
        ? current.filter((item) => item.assetId !== asset.id)
        : [...current, { assetId: asset.id, reduction: 35, investment: 0.35 }]
    );
    notify(
      exists
        ? `${asset.name} removed from the optimization plan.`
        : `${asset.name} added to the optimization plan.`
    );
  }

  function saveScenario(asset: Asset, reduction: number, investment: number) {
    setPlan((current) => [
      ...current.filter((item) => item.assetId !== asset.id),
      { assetId: asset.id, reduction, investment },
    ]);
    notify(`Scenario for ${asset.name} saved to your optimization plan.`);
  }

  const exportReport = () => setDialog({ kind: 'report' });

  function renderContent() {
    switch (activeTab) {
      case 'Asset Exposure':
        return (
          <AssetExposureView
            assets={assets}
            onAsset={selectAsset}
            unitFilter={unitFilter}
            onUnitFilter={setUnitFilter}
            onExport={exportReport}
            factor={factor}
            period={period}
          />
        );
      case 'Business Units':
        return <BusinessUnitsView assets={assets} onAsset={selectAsset} factor={factor} />;
      case 'Category Analysis':
        return <CategoryAnalysisView initialCategory={category} factor={factor} />;
      case 'Scenario Analysis':
        return (
          <ModuleView
            section="What-If Scenarios"
            assets={assets}
            selectedAsset={selectedAsset}
            onAsset={selectAsset}
            plan={plan}
            onRemovePlan={(id) => {
              setPlan((current) => current.filter((item) => item.assetId !== id));
              notify('Investment removed from your plan.');
            }}
            onScenario={(asset) => setDialog({ kind: 'scenario', asset })}
            onSaveScenario={saveScenario}
            notify={notify}
          />
        );
      case 'Reports':
        return (
          <ReportsView
            reports={reports}
            onCreate={exportReport}
            onDelete={(id) => {
              setReports((current) => current.filter((report) => report.id !== id));
              notify('Report removed from your workspace.');
            }}
            notify={notify}
          />
        );
      case 'Overview':
      default:
        return (
          <DashboardOverview
            assets={assets}
            factor={factor}
            period={period}
            onAsset={selectAsset}
            onUnit={(unit) => {
              setUnitFilter(unit);
              setActiveTab('Asset Exposure');
            }}
            onCategory={(name) => {
              setCategory(name);
              setActiveTab('Category Analysis');
            }}
            onMetric={(title, description) => setDialog({ kind: 'metric', title, description })}
          />
        );
    }
  }

  return (
    <div className="financial-exposure-page">
      <div className="masthead-art" aria-hidden="true" />

      {/* Page Header */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <div className="breadcrumbs">
            <button onClick={() => onNav?.('dashboard')}>Home</button>
            <ChevronRight size={12} />
            <span>Financial Exposure</span>
          </div>
          <h1>Financial Exposure</h1>
          <p>Translate cyber risk into business impact. Make data-driven investment decisions.</p>
        </div>
        <div className="page-heading-tools">
          <p className="brand-motto">
            QUANTIFY TODAY<br />
            INVEST WISELY<br />
            A MORE RESILIENT TOMORROW.
          </p>
          <label className="period-select">
            <CalendarDays size={17} />
            <select
              aria-label="Reporting period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>Year to Date</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <button className="primary-button export-button" onClick={exportReport}>
            <ArrowDownToLine size={15} />
            Export
          </button>
          {!detailOpen && (
            <button
              className="outline-button show-details-button"
              aria-label="Open asset details"
              onClick={() => setDetailOpen(true)}
            >
              <PanelRightOpen size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className={`dashboard-layout ${detailOpen ? 'has-detail' : ''}`}>
        <main className="dashboard-main">
          <nav className="dashboard-tabs" role="tablist" aria-label="Financial exposure views">
            {dashboardTabs.map((tab, index) => (
              <button
                id={`exposure-tab-${index}`}
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="financial-view"
                tabIndex={activeTab === tab ? 0 : -1}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                  event.preventDefault();
                  const next =
                    (index + (event.key === 'ArrowRight' ? 1 : -1) + dashboardTabs.length) % dashboardTabs.length;
                  setActiveTab(dashboardTabs[next]);
                  document.getElementById(`exposure-tab-${next}`)?.focus();
                }}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div
            id="financial-view"
            role="tabpanel"
            aria-labelledby={`exposure-tab-${dashboardTabs.indexOf(activeTab)}`}
            className={`main-view ${activeTab === 'Overview' ? 'is-overview' : ''}`}
            key={activeTab}
          >
            {renderContent()}
          </div>
        </main>

        {/* Right Details Panel */}
        {detailOpen && (
          <AssetPanel
            asset={selectedAsset}
            onClose={() => setDetailOpen(false)}
            onAction={handleAssetAction}
            onPlan={togglePlan}
            inPlan={plan.some((item) => item.assetId === selectedAsset.id)}
            notify={notify}
            viewRequest={panelRequest}
          />
        )}
      </div>

      {/* Modal Dialogs */}
      {dialog && (
        <Dialogs
          dialog={dialog}
          assets={assets}
          onClose={closeDialog}
          onSaveAsset={(asset) => {
            setAssets((current) => current.map((item) => (item.id === asset.id ? asset : item)));
            setDialog(null);
            notify(`Financial inputs updated for ${asset.name}.`);
          }}
          onSaveReport={(report) => {
            setReports((current) => [report, ...current]);
            setDialog(null);
            notify('Your report has been generated and downloaded.');
          }}
          onSaveScenario={saveScenario}
          notify={notify}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="financial-toast" role="status">
          <CheckCircle2 size={19} />
          <span>{toast}</span>
          <button className="icon-button" onClick={() => setToast(null)} aria-label="Dismiss notification">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FinancialExposureView;
