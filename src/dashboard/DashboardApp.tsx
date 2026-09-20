import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './dashboard.css';
import { BrandMark, Icon } from '../components/Icons';
import { Dialog, Popover } from '../security/UI';
import { EnterpriseInquiry } from '../security/Workspace';
import { navigation, initialControls, readSaved } from '../security/data';
import { SecurityControlsView } from './views/SecurityControlsView';
import { Dashboard } from './views/Dashboard';
import { SectionView } from './views/Sections';
import { VulnerabilitiesView } from './views/VulnerabilitiesView';
import { AssetsView } from './views/AssetsView';
import { WhatIfScenarioView } from './views/WhatIfScenarioView';
import { ReportAnalysisView } from './views/ReportAnalysisView';
import AuditLogView from './views/AuditLogView';
import SettingsView from './views/SettingsView';
import IntegrationsView from './views/IntegrationsView';
import ThreatIntelligenceView from './views/ThreatIntelligenceView';
import OptimizationView from './views/OptimizationView';
import RecommendationsView from './views/RecommendationsView';
import { RiskAnalysisView } from './views/RiskAnalysisView';
import { ComplianceView } from './views/ComplianceView';
import { FinancialExposureView } from './views/FinancialExposureView';
import { allRisks, assets, orgs, user, type RangeKey } from './data';

type Toast = { id: number; text: string; kind?: 'ok' | 'info' };

export interface DashboardAppProps {
  onNavigateHome?: () => void;
  onNavigateSetup?: () => void;
  initialTab?: string;
  initialOrg?: string;
}

export default function DashboardApp({
  onNavigateHome,
  onNavigateSetup,
  initialTab = 'dashboard',
  initialOrg,
}: DashboardAppProps) {
  const [active, setActive] = useState(initialTab);

  useEffect(() => {
    if (initialTab) setActive(initialTab);
  }, [initialTab]);
  const [range, setRange] = useState<RangeKey>('12m');
  const [riskScore, setRiskScore] = useState(72);
  const [org, setOrg] = useState(initialOrg || orgs[0]);
  const [unread, setUnread] = useState(3);
  const [globalQuery, setGlobalQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [enterpriseModal, setEnterpriseModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [theme, setTheme] = useState(() => readSaved<string>('cyberriskiq-controls-theme', 'dark'));
  const [selectedControlId, setSelectedControlId] = useState<string | null>('mfa');

  const searchRef = useRef<HTMLDivElement>(null);

  const notify = useCallback((text: string, kind: 'ok' | 'info' = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { id, text, kind }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('cyberriskiq-controls-theme', JSON.stringify(theme));
    } catch {
      /* Theme does not require storage */
    }
  }, [theme]);

  /* Keyboard shortcut Ctrl+K and escape */
  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('global-control-search')?.focus();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    }
    function outside(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('keydown', keyboard);
    document.addEventListener('mousedown', outside);
    return () => {
      document.removeEventListener('keydown', keyboard);
      document.removeEventListener('mousedown', outside);
    };
  }, []);

  /* Live data sync timer */
  useEffect(() => {
    if (!syncEnabled) return;
    const timer = window.setInterval(() => {
      setLastSync(new Date());
      setRiskScore((current) => Math.min(95, Math.max(58, current + (Math.random() > 0.55 ? 1 : -1))));
    }, 25000);
    return () => window.clearInterval(timer);
  }, [syncEnabled]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [active]);

  /* Unified global search across controls, risks, assets, and vulns */
  const searchResults = useMemo(() => {
    const term = globalQuery.trim().toLowerCase();
    if (!term) return [];
    const controlMatches = initialControls
      .filter((c) => `${c.name} ${c.category} ${c.description}`.toLowerCase().includes(term))
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        type: 'control',
        name: c.name,
        sub: `${c.category} · ${c.coverage}% coverage`,
        icon: c.icon || 'shieldPlus'
      }));
    const riskMatches = allRisks
      .filter((r) => `${r.title} ${r.asset}`.toLowerCase().includes(term))
      .slice(0, 3)
      .map((r) => ({
        id: String(r.id),
        type: 'risk',
        name: r.title,
        sub: `${r.asset} · score ${r.score}`,
        icon: 'alert'
      }));
    const assetMatches = assets
      .filter((a) => a.name.toLowerCase().includes(term))
      .slice(0, 2)
      .map((a) => ({
        id: a.name,
        type: 'asset',
        name: a.name,
        sub: `${a.type} · ${a.criticality}`,
        icon: 'server'
      }));
    return [...controlMatches, ...riskMatches, ...assetMatches].slice(0, 7);
  }, [globalQuery]);

  function handleSelectResult(item: { id: string; type: string; name: string }) {
    setSearchOpen(false);
    setGlobalQuery('');
    if (item.type === 'control') {
      setSelectedControlId(item.id);
      setActive('controls');
    } else if (item.type === 'risk') {
      setActive('dashboard');
    } else if (item.type === 'asset') {
      setActive('assets');
    }
  }

  function runAction(kind: string) {
    const copy: Record<string, string> = {
      analysis: 'Risk analysis queued — evaluating 1,248 findings.',
      asset: 'New asset form ready.',
      report: 'Report generation started.',
      download: 'Download started.',
      approve: 'Recommendation approved and added to the plan.',
      defer: 'Recommendation deferred to next quarter.',
      scenario: 'Scenario saved to your workspace.',
      support: 'Support request created — ticket #48219.',
      signout: 'Signed out of the demo workspace.',
      profile: 'Profile preferences opened.',
      org: 'Workspace switched.',
      markRead: 'All notifications marked as read.',
      export: 'Export prepared.',
    };
    notify(copy[kind] ?? 'Action completed.');
  }

  return (
    <div className="security-app" data-theme={theme}>
      <a className="sc-skip-link" href="#main-content">Skip to content</a>

      {/* EXACT COMMAND CENTER RAIL / SIDEBAR */}
      <aside className={`sc-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <a
          className="sc-brand"
          href="#dashboard"
          aria-label="CyberRiskIQ home"
          onClick={(event) => {
            event.preventDefault();
            if (onNavigateHome) onNavigateHome();
            else setActive('dashboard');
          }}
        >
          <BrandMark className="sc-brand-mark" />
          <span>
            CyberRisk<span>IQ</span>
            <small>From Risk to Resilience</small>
          </span>
        </a>

        <nav className="sc-navigation" aria-label="Main navigation">
          {navigation.map((group) => (
            <div key={group.title} className="sc-nav-group">
              <p>{group.title}</p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={active === item.id ? 'is-active' : ''}
                  aria-current={active === item.id ? 'page' : undefined}
                  onClick={() => {
                    setActive(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {'badge' in item && <em>{item.badge}</em>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sc-enterprise">
          <Icon name="headset" />
          <div>
            <h3>Upgrade to Enterprise</h3>
            <p>
              Unlock advanced analytics<br />
              and custom integrations.
            </p>
          </div>
          <button className="sc-button" onClick={() => setEnterpriseModal(true)}>
            Learn More <Icon name="arrowRight" />
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sc-sidebar-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* MAIN VIEW AREA */}
      <div className="sc-main">
        {/* Cinematic mountain backdrop with network grid SVG overlay */}
        <div className="mountain-scenery" aria-hidden="true">
          <img src="/images/exposure-mountains.jpg" alt="" />
          <svg className="scenery-network" viewBox="0 0 650 220">
            <defs>
              <pattern id="security-network-cells" width="58" height="50" patternUnits="userSpaceOnUse">
                <path d="M14 0h29l15 25-15 25H14L0 25Z" fill="none" stroke="#147feb" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="650" height="220" fill="url(#security-network-cells)" />
          </svg>
        </div>

        {/* COMMAND CENTER TOPBAR */}
        <header className="sc-topbar">
          <button
            className="sc-icon-button sc-mobile-menu"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon name="grid" />
          </button>

          <div className="sc-global-search" ref={searchRef}>
            <Icon name="search" />
            <input
              id="global-control-search"
              type="search"
              placeholder="Search assets, vulnerabilities, risks, controls..."
              aria-label="Search the command center"
              autoComplete="off"
              value={globalQuery}
              onChange={(event) => {
                setGlobalQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && searchResults.length) {
                  handleSelectResult(searchResults[0]);
                }
              }}
            />
            <kbd>Ctrl + K</kbd>
            {searchOpen && (
              <div className="sc-global-results">
                <p>{globalQuery ? 'Matching Results' : 'Quick Access'}</p>
                {searchResults.map((item) => (
                  <button key={item.id} onClick={() => handleSelectResult(item)}>
                    <Icon name={item.icon} />
                    <span>
                      {item.name}
                      <small>{item.sub}</small>
                    </span>
                    <Icon name="arrowRight" />
                  </button>
                ))}
                {!searchResults.length && (
                  <span className="sc-search-empty">No results match your search.</span>
                )}
              </div>
            )}
          </div>

          {/* Organization Selector Pill */}
          <Popover
            label="Organization selector"
            className="sc-org-pill"
            width={240}
            trigger={
              <>
                <Icon name="building" />
                <span className="sc-org-title">{org}</span>
                <Icon name="chevron" />
              </>
            }
          >
            {(close) => (
              <div className="sc-popover-menu">
                <span className="sc-menu-heading">Select Organization</span>
                {orgs.map((o) => (
                  <button
                    key={o}
                    className={o === org ? 'is-selected' : ''}
                    onClick={() => {
                      setOrg(o);
                      close();
                      notify(`Switched to ${o}`);
                    }}
                  >
                    <Icon name="building" />
                    <span>{o}</span>
                  </button>
                ))}
              </div>
            )}
          </Popover>

          <div className="sc-topbar-actions">
            <button
              className={`sc-sync ${syncEnabled ? 'is-live' : ''}`}
              aria-pressed={syncEnabled}
              title={`Local demo data last refreshed at ${lastSync.toLocaleTimeString()}`}
              onClick={() => {
                setSyncEnabled(!syncEnabled);
                setLastSync(new Date());
                notify(syncEnabled ? 'Local data sync paused.' : 'Live data sync resumed.');
              }}
            >
              <i />
              <div className="sc-sync-labels">
                <span>{syncEnabled ? 'Live Data Sync' : 'Data Sync Paused'}</span>
                <small>Last updated: Jun 15, 2024, 10:24 AM</small>
              </div>
            </button>

            <Popover
              label="Notifications"
              width={310}
              className="sc-notification-button"
              trigger={<><Icon name="bell" />{unread > 0 && <i>{unread}</i>}</>}
            >
              {(close) => (
                <div className="sc-notifications">
                  <header>
                    <strong>Notifications</strong>
                    <button
                      onClick={() => {
                        setUnread(0);
                        close();
                        notify('All notifications marked as read.');
                      }}
                    >
                      Mark all read
                    </button>
                  </header>
                  {[
                    { title: '4 assets without MFA enabled', text: 'Review asset coverage for Multi-Factor Authentication.', id: 'mfa' },
                    { title: 'Control gap requires attention', text: 'Privileged Access Management has 60% coverage.', id: 'pam' },
                    { title: 'Compliance check passed', text: 'Latest policy checks are ready to review.', id: 'vuln' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        close();
                        setSelectedControlId(item.id);
                        setActive('controls');
                        setUnread((value) => Math.max(0, value - 1));
                      }}
                    >
                      <i />
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </Popover>

            <Popover label="Application switcher" className="sc-app-switcher" width={230} trigger={<Icon name="grid" />}>
              {(close) => (
                <div className="sc-popover-menu">
                  {[
                    ['controls', 'Security Controls', 'shieldPlus'],
                    ['dashboard', 'Executive Dashboard', 'home'],
                    ['assets', 'Asset Inventory', 'server'],
                    ['reports', 'Report Center', 'report'],
                    ['optimization', 'Remediation Plan', 'clipboard']
                  ].map(([id, label, icon]) => (
                    <button
                      key={id}
                      onClick={() => {
                        close();
                        setActive(id);
                      }}
                    >
                      <Icon name={icon} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </Popover>

            <Popover
              label="Yash Galande profile menu"
              className="sc-profile-button"
              width={240}
              trigger={
                <>
                  <span className="sc-avatar">{user.initials}</span>
                  <span className="sc-profile-name">
                    <strong>{user.name}</strong>
                    <small>{user.role}</small>
                  </span>
                  <Icon name="chevron" />
                </>
              }
            >
              {(close) => (
                <div className="sc-popover-menu">
                  <span className="sc-menu-heading">Acme Technologies Pvt. Ltd.</span>
                  <button onClick={() => { close(); setActive('settings'); }}>
                    <Icon name="user" />My Profile
                  </button>
                  <button onClick={() => { close(); setActive('settings'); }}>
                    <Icon name="gear" />Workspace Settings
                  </button>
                  {onNavigateSetup && (
                    <button onClick={() => { close(); onNavigateSetup(); }}>
                      <Icon name="gear" />Setup Organization
                    </button>
                  )}
                  <button onClick={() => { close(); setTheme(theme === 'dark' ? 'light' : 'dark'); }}>
                    <Icon name={theme === 'dark' ? 'sun' : 'moon'} />Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
                  </button>
                  <div style={{ height: '1px', background: 'var(--sc-rule, #082838)', margin: '4px 0' }} />
                  <button onClick={() => { close(); if (onNavigateHome) onNavigateHome(); else notify('Signed out of workspace.'); }}>
                    <Icon name="logout" />Sign Out
                  </button>
                </div>
              )}
            </Popover>
          </div>
        </header>

        {/* ACTIVE PAGE CONTENT */}
        {active === 'controls' ? (
          <SecurityControlsView
            onNav={setActive}
            selectedControlId={selectedControlId}
            onSelectControlId={setSelectedControlId}
            theme={theme}
            setTheme={setTheme}
            externalNotify={notify}
          />
        ) : active === 'dashboard' ? (
          <main className="sc-content dashboard-content-wrap" id="main-content" tabIndex={-1}>
            <Dashboard
              live={syncEnabled}
              riskScore={riskScore}
              range={range}
              setRange={setRange}
              onNav={setActive}
              action={runAction}
            />
          </main>
        ) : active === 'vulnerabilities' ? (
          <VulnerabilitiesView onNav={setActive} externalNotify={notify} />
        ) : active === 'assets' ? (
          <AssetsView onNav={setActive} externalNotify={notify} />
        ) : active === 'whatif' ? (
          <WhatIfScenarioView onNav={setActive} externalNotify={notify} />
        ) : active === 'reports' ? (
          <ReportAnalysisView onNav={setActive} externalNotify={notify} />
        ) : active === 'audit' ? (
          <AuditLogView onNav={setActive} externalNotify={notify} />
        ) : active === 'settings' ? (
          <SettingsView onNav={setActive} externalNotify={notify} />
        ) : active === 'integrations' ? (
          <IntegrationsView onNav={setActive} externalNotify={notify} />
        ) : active === 'intel' ? (
          <ThreatIntelligenceView onNav={setActive} externalNotify={notify} />
        ) : active === 'optimization' ? (
          <OptimizationView onNav={setActive} externalNotify={notify} />
        ) : active === 'recommendations' ? (
          <RecommendationsView onNav={setActive} externalNotify={notify} />
        ) : active === 'analysis' ? (
          <RiskAnalysisView onNav={setActive} externalNotify={notify} theme={theme} />
        ) : active === 'compliance' ? (
          <ComplianceView onNav={setActive} externalNotify={notify} />
        ) : active === 'exposure' ? (
          <FinancialExposureView onNav={setActive} externalNotify={notify} />
        ) : (
          <main className="sc-content section-content-wrap" id="main-content" tabIndex={-1}>
            <SectionView id={active} onNav={setActive} action={runAction} />
          </main>
        )}
      </div>

      {enterpriseModal && (
        <Dialog
          title="Upgrade to Enterprise"
          subtitle="Stronger security, built around your organization."
          onClose={() => setEnterpriseModal(false)}
        >
          <EnterpriseInquiry onClose={() => setEnterpriseModal(false)} />
        </Dialog>
      )}

      <div className="sc-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <Icon name="checkCircle" />
            <span>{toast.text}</span>
            <button
              aria-label="Dismiss notification"
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
