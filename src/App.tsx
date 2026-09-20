import { useCallback, useEffect, useState } from 'react';
import { BrandLogo, type BrandName } from './components/BrandLogo';
import { DemoForm, type DemoKind } from './components/DemoForm';
import { Icon, Logo, type IconName } from './components/Icons';
import { Modal } from './components/Modal';
import { ProductTour } from './components/ProductTour';
import { SignIn } from './components/SignIn';
import MFAVerify from './components/MFAVerify';
import OrganizationSetup from './components/organization/OrganizationSetup';
import RiskParameters from './components/organization/RiskParameters';
import DashboardApp from './dashboard/DashboardApp';

const clients: BrandName[] = ['tata', 'infosys', 'hdfc', 'microsoft', 'amazon', 'digital-india', 'adobe'];
const pillars = ['ASSESS', 'QUANTIFY', 'OPTIMIZE', 'PROTECT', 'GROW'];
const features: { icon: IconName; lines: [string, string] }[] = [
  { icon: 'activity', lines: ['Continuous', 'Risk Monitoring'] },
  { icon: 'database', lines: ['Financial Impact', 'Modeling'] },
  { icon: 'bulb', lines: ['AI-Powered', 'Optimization'] },
  { icon: 'building', lines: ['Explainable', 'Insights'] },
];
const team = [
  { role: 'Security Analyst', text: 'Prioritize and triage vulnerabilities.', image: '/images/security-analyst.jpg', alt: 'Security analyst considering the next priority' },
  { role: 'CISO / Security Leader', text: 'Get a unified view of risk and make data-driven decisions.', image: '/images/security-leader.jpg', alt: 'Confident female security leader in a black blazer' },
  { role: 'Finance Manager', text: 'Understand financial exposure and maximize ROI.', image: '/images/finance-manager.jpg', alt: 'Experienced finance manager wearing glasses' },
  { role: 'IT Administrator', text: 'Track remediation and reduce risk.', image: '/images/it-administrator.jpg', alt: 'IT administrator looking ahead with confidence' },
];
const testimonials: { quote: string; name: string; title: string; brand: BrandName; image: string }[] = [
  { quote: 'CyberRiskIQ gave us the clarity we needed to make data-driven security investments. It bridges the gap between technical risk and business impact perfectly.', name: 'Arvind Menon', title: 'CISO, HDFC Bank', brand: 'hdfc', image: '/images/security-analyst.jpg' },
  { quote: 'The financial impact analysis transformed how we plan our security budget. It\'s a game-changer for CFOs.', name: 'Neha Kapoor', title: 'Head of Security, Infosys', brand: 'infosys', image: '/images/security-leader.jpg' },
  { quote: 'Finally, a platform that speaks both the language of security and finance. CyberRiskIQ helps us prioritize what really matters.', name: 'Rohan Mehta', title: 'CTO, Tata Motors', brand: 'tata', image: '/images/it-administrator.jpg' },
];

type Dialog = { type: 'form'; kind: DemoKind } | { type: 'tour'; scene: number } | { type: 'quote'; index: number } | { type: 'info'; page: 'Privacy' | 'Terms' | 'Security' | 'Company' } | null;
type Page = 'landing' | 'signin' | 'signup' | 'forgot-password' | 'mfa' | 'organization' | 'risk-parameters' | 'assets' | 'complete' | 'dashboard';

function Framework({ className = '' }: { className?: string }) {
  return <div className={`framework ${className}`} aria-label="Assess, quantify, optimize, protect, grow">{pillars.map((pillar) => <span key={pillar}>{pillar}</span>)}</div>;
}

function App() {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState(1);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [dataCleared, setDataCleared] = useState(false);
  const [authEmail, setAuthEmail] = useState('yashgalande39@gmail.com');
  const [lightTheme, setLightTheme] = useState(() => {
    try { return localStorage.getItem('cyberriskiq-theme') === 'light'; } catch { return false; }
  });
  const [dashboardTab, setDashboardTab] = useState<'controls' | 'dashboard' | 'vulnerabilities' | 'assets' | 'whatif' | 'reports' | 'audit' | 'settings' | 'integrations' | 'intel' | 'optimization' | 'recommendations' | 'analysis' | 'compliance'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#compliance' || window.location.hash === '#compliance-governance') return 'compliance';
      if (window.location.hash === '#analysis' || window.location.hash === '#risk-analysis' || window.location.hash === '#riskanalysis') return 'analysis';
      if (window.location.hash === '#recommendations' || window.location.hash === '#recommendation') return 'recommendations';
      if (window.location.hash === '#optimization' || window.location.hash === '#optimizer') return 'optimization';
      if (window.location.hash === '#intel' || window.location.hash === '#threat-intelligence' || window.location.hash === '#threats') return 'intel';
      if (window.location.hash === '#integrations' || window.location.hash === '#integration') return 'integrations';
      if (window.location.hash === '#dashboard' || window.location.hash === '#app') return 'dashboard';
      if (window.location.hash === '#controls' || window.location.hash === '#security-controls' || window.location.hash === '#controls-content') return 'controls';
      if (window.location.hash === '#vulnerabilities' || window.location.hash === '#vulns') return 'vulnerabilities';
      if (window.location.hash === '#dashboard-assets' || window.location.hash === '#asset-inventory' || window.location.hash === '#assets-dashboard') return 'assets';
      if (window.location.hash === '#whatif' || window.location.hash === '#what-if' || window.location.hash === '#dashboard-whatif' || window.location.hash === '#scenarios') return 'whatif';
      if (window.location.hash === '#reports' || window.location.hash === '#report-analysis' || window.location.hash === '#dashboard-reports' || window.location.hash === '#analytics') return 'reports';
      if (window.location.hash === '#audit' || window.location.hash === '#audit-log' || window.location.hash === '#auditlog' || window.location.hash === '#dashboard-audit') return 'audit';
      if (window.location.hash === '#settings' || window.location.hash === '#workspace-settings' || window.location.hash === '#dashboard-settings') return 'settings';
    }
    return 'controls';
  });
  const [page, setPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#signup') return 'signup';
      if (window.location.hash === '#signin') return 'signin';
      if (window.location.hash === '#forgot-password' || window.location.hash === '#forgotpassword') return 'forgot-password';
      if (window.location.hash === '#mfa' || window.location.hash === '#verify') return 'mfa';
      if (window.location.hash === '#organization' || window.location.hash === '#org') return 'organization';
      if (window.location.hash === '#risk-parameters' || window.location.hash === '#riskparameters') return 'risk-parameters';
      if (window.location.hash === '#assets' || window.location.hash === '#connectors') return 'assets';
      if (window.location.hash === '#complete' || window.location.hash === '#setup-complete' || window.location.hash === '#ready') return 'complete';
      if (window.location.hash === '#compliance' || window.location.hash === '#compliance-governance' || window.location.hash === '#analysis' || window.location.hash === '#risk-analysis' || window.location.hash === '#riskanalysis' || window.location.hash === '#recommendations' || window.location.hash === '#recommendation' || window.location.hash === '#optimization' || window.location.hash === '#optimizer' || window.location.hash === '#intel' || window.location.hash === '#threat-intelligence' || window.location.hash === '#threats' || window.location.hash === '#integrations' || window.location.hash === '#integration' || window.location.hash === '#dashboard' || window.location.hash === '#app' || window.location.hash === '#controls' || window.location.hash === '#security-controls' || window.location.hash === '#controls-content' || window.location.hash === '#vulnerabilities' || window.location.hash === '#vulns' || window.location.hash === '#audit' || window.location.hash === '#audit-log' || window.location.hash === '#auditlog' || window.location.hash === '#dashboard-audit' || window.location.hash === '#settings' || window.location.hash === '#workspace-settings' || window.location.hash === '#dashboard-settings') return 'dashboard';
    }
    return 'landing';
  });
  const closeDialog = useCallback(() => setDialog(null), []);

  useEffect(() => {
    function handleHash() {
      if (window.location.hash === '#signup') {
        setPage('signup');
      } else if (window.location.hash === '#signin') {
        setPage('signin');
      } else if (window.location.hash === '#forgot-password' || window.location.hash === '#forgotpassword') {
        setPage('forgot-password');
      } else if (window.location.hash === '#mfa' || window.location.hash === '#verify') {
        setPage('mfa');
      } else if (window.location.hash === '#organization' || window.location.hash === '#org') {
        setPage('organization');
      } else if (window.location.hash === '#risk-parameters' || window.location.hash === '#riskparameters') {
        setPage('risk-parameters');
      } else if (window.location.hash === '#assets' || window.location.hash === '#connectors') {
        setPage('assets');
      } else if (window.location.hash === '#complete' || window.location.hash === '#setup-complete' || window.location.hash === '#ready') {
        setPage('complete');
      } else if (window.location.hash === '#compliance' || window.location.hash === '#compliance-governance') {
        setDashboardTab('compliance');
        setPage('dashboard');
      } else if (window.location.hash === '#analysis' || window.location.hash === '#risk-analysis' || window.location.hash === '#riskanalysis') {
        setDashboardTab('analysis');
        setPage('dashboard');
      } else if (window.location.hash === '#recommendations' || window.location.hash === '#recommendation') {
        setDashboardTab('recommendations');
        setPage('dashboard');
      } else if (window.location.hash === '#optimization' || window.location.hash === '#optimizer') {
        setDashboardTab('optimization');
        setPage('dashboard');
      } else if (window.location.hash === '#intel' || window.location.hash === '#threat-intelligence' || window.location.hash === '#threats') {
        setDashboardTab('intel');
        setPage('dashboard');
      } else if (window.location.hash === '#integrations' || window.location.hash === '#integration') {
        setDashboardTab('integrations');
        setPage('dashboard');
      } else if (window.location.hash === '#controls' || window.location.hash === '#security-controls' || window.location.hash === '#controls-content') {
        setDashboardTab('controls');
        setPage('dashboard');
      } else if (window.location.hash === '#vulnerabilities' || window.location.hash === '#vulns') {
        setDashboardTab('vulnerabilities');
        setPage('dashboard');
      } else if (window.location.hash === '#dashboard-assets' || window.location.hash === '#asset-inventory' || window.location.hash === '#assets-dashboard') {
        setDashboardTab('assets');
        setPage('dashboard');
      } else if (window.location.hash === '#whatif' || window.location.hash === '#what-if' || window.location.hash === '#dashboard-whatif' || window.location.hash === '#scenarios') {
        setDashboardTab('whatif');
        setPage('dashboard');
      } else if (window.location.hash === '#reports' || window.location.hash === '#report-analysis' || window.location.hash === '#dashboard-reports' || window.location.hash === '#analytics') {
        setDashboardTab('reports');
        setPage('dashboard');
      } else if (window.location.hash === '#audit' || window.location.hash === '#audit-log' || window.location.hash === '#auditlog' || window.location.hash === '#dashboard-audit') {
        setDashboardTab('audit');
        setPage('dashboard');
      } else if (window.location.hash === '#settings' || window.location.hash === '#workspace-settings' || window.location.hash === '#dashboard-settings') {
        setDashboardTab('settings');
        setPage('dashboard');
      } else if (window.location.hash === '#dashboard' || window.location.hash === '#app') {
        setDashboardTab('dashboard');
        setPage('dashboard');
      } else {
        setPage('landing');
      }
    }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = useCallback((target: Page) => {
    setMenuOpen(false);
    const wasAuth = ['signin', 'signup', 'forgot-password', 'mfa', 'organization', 'risk-parameters', 'assets', 'complete', 'dashboard'].includes(page);
    const willBeAuth = ['signin', 'signup', 'forgot-password', 'mfa', 'organization', 'risk-parameters', 'assets', 'complete', 'dashboard'].includes(target);
    setPage(target);
    if (target === 'signin') {
      window.location.hash = '#signin';
    } else if (target === 'signup') {
      window.location.hash = '#signup';
    } else if (target === 'forgot-password') {
      window.location.hash = '#forgot-password';
    } else if (target === 'mfa') {
      window.location.hash = '#mfa';
    } else if (target === 'organization') {
      window.location.hash = '#organization';
    } else if (target === 'risk-parameters') {
      window.location.hash = '#risk-parameters';
    } else if (target === 'assets') {
      window.location.hash = '#assets';
    } else if (target === 'complete') {
      window.location.hash = '#complete';
    } else if (target === 'dashboard') {
      window.location.hash = '#dashboard';
    } else {
      if (['#signin', '#signup', '#forgot-password', '#forgotpassword', '#mfa', '#verify', '#organization', '#org', '#risk-parameters', '#riskparameters', '#assets', '#connectors', '#complete', '#setup-complete', '#ready', '#dashboard', '#app'].includes(window.location.hash)) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
    if (!(wasAuth && willBeAuth)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  useEffect(() => {
    try { localStorage.setItem('cyberriskiq-theme', lightTheme ? 'light' : 'dark'); } catch { /* The theme also works without browser storage. */ }
  }, [lightTheme]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.13 });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  function openForm(kind: DemoKind = 'demo') { setMenuOpen(false); setDataCleared(false); setDialog({ type: 'form', kind }); }
  function clearSavedData() {
    try { localStorage.removeItem('cyberriskiq-requests'); localStorage.removeItem('cyberriskiq-theme'); setDataCleared(true); } catch { setDataCleared(false); }
  }

  const navLinks = <>
    <a href="#solution" onClick={() => setMenuOpen(false)}>Product</a>
    <a href="#challenge" onClick={() => setMenuOpen(false)}>Solutions</a>
    <a href="#teams" onClick={() => setMenuOpen(false)}>Use Cases</a>
    <button onClick={() => openForm('pricing')}>Pricing</button>
    <a href="#voices" onClick={() => setMenuOpen(false)}>Resources</a>
  </>;

  const modalElement = dialog ? (
    <Modal onClose={closeDialog} title={dialog.type === 'form' ? 'Connect with CyberRiskIQ' : dialog.type === 'tour' ? 'CyberRiskIQ product film' : dialog.type === 'quote' ? 'What leaders say' : dialog.page} wide={dialog.type === 'tour'}>
      {dialog.type === 'form' && <DemoForm kind={dialog.kind} />}
      {dialog.type === 'tour' && <ProductTour initialScene={dialog.scene} />}
      {dialog.type === 'quote' && <div className="quote-modal"><p className="eyebrow">TRUSTED VOICES</p><BrandLogo name={testimonials[dialog.index].brand} /><blockquote>&ldquo;{testimonials[dialog.index].quote}&rdquo;</blockquote><div className="quote-author"><img src={testimonials[dialog.index].image} alt="" /><div><strong>{testimonials[dialog.index].name}</strong><p>{testimonials[dialog.index].title}</p></div></div><button className="button button-white" onClick={() => setDialog({ type: 'tour', scene: 0 })}>Explore the Platform <Icon name="arrow" /></button></div>}
      {dialog.type === 'info' && <div className="info-modal"><p className="eyebrow">CYBERRISKIQ</p><h3>{dialog.page === 'Company' ? 'One platform. One clarity.' : dialog.page}</h3>
        {dialog.page === 'Company' && <><p>CyberRiskIQ brings security and business together. Unify assets, vulnerabilities, threats, and controls, and connect your cyber risk to real-world financial impact.</p><p>From security operations to the boardroom, a common platform gives every team a common language for more confident decisions.</p><button className="button button-white" onClick={() => openForm('expert')}>Talk to an Expert <Icon name="arrow" /></button></>}
        {dialog.page === 'Privacy' && <><p>Your privacy matters. This website preview stores your theme preference and any demo requests you create in your browser's local storage.</p><p>Form information is not transmitted to a server. Requests remain on this device until you clear your browser data or use the button below. This preview does not use analytics cookies.</p><button className="button button-outline" onClick={clearSavedData}>{dataCleared ? 'Saved Data Cleared' : 'Clear Saved Data'}<Icon name={dataCleared ? 'check' : 'arrow'} /></button><span className="sr-only" aria-live="polite">{dataCleared ? 'Your local demo requests and theme preference have been removed.' : ''}</span></>}
        {dialog.page === 'Terms' && <><p>This is an interactive demonstration of the CyberRiskIQ website. Product statements, organization names, statistics, and testimonials reproduce the supplied visual reference and are not independently verified.</p><p>Demo and pricing forms prepare local requests only. They do not create a service agreement, transmit an inquiry, or schedule a meeting. The content is not financial or security advice.</p></>}
        {dialog.page === 'Security' && <><p>This website preview does not connect to your organization's systems or ask for credentials, API keys, or other sensitive security information.</p><p>Demo details are stored only on your current device. Do not include confidential vulnerability reports or passwords in the inquiry form. You can remove locally stored information at any time.</p><button className="button button-outline" onClick={clearSavedData}>{dataCleared ? 'Saved Data Cleared' : 'Clear Saved Data'}<Icon name={dataCleared ? 'check' : 'arrow'} /></button></>}
      </div>}
    </Modal>
  ) : null;

  if (page === 'mfa') {
    return (
      <>
        <MFAVerify
          email={authEmail}
          onNavigateSignIn={() => navigateTo('signin')}
          onNavigateHome={() => navigateTo('landing')}
          onVerified={() => navigateTo('organization')}
        />
        {modalElement}
      </>
    );
  }

  if (page === 'risk-parameters') {
    return (
      <>
        <RiskParameters
          onBack={() => navigateTo('organization')}
          onContinue={() => navigateTo('organization')}
          onNavigateHome={() => navigateTo('landing')}
        />
        {modalElement}
      </>
    );
  }

  if (page === 'organization') {
    return (
      <>
        <OrganizationSetup
          onNavigateHome={() => navigateTo('landing')}
          onLaunchDashboard={() => navigateTo('dashboard')}
        />
        {modalElement}
      </>
    );
  }

  if (page === 'assets') {
    return (
      <>
        <OrganizationSetup
          initialStep={3}
          onNavigateHome={() => navigateTo('landing')}
          onLaunchDashboard={() => navigateTo('dashboard')}
        />
        {modalElement}
      </>
    );
  }

  if (page === 'complete') {
    return (
      <>
        <OrganizationSetup
          initialStep={4}
          onNavigateHome={() => navigateTo('landing')}
          onLaunchDashboard={() => navigateTo('dashboard')}
        />
        {modalElement}
      </>
    );
  }

  if (page === 'dashboard') {
    return (
      <DashboardApp
        initialTab={dashboardTab}
        onNavigateHome={() => navigateTo('landing')}
        onNavigateSetup={() => navigateTo('organization')}
      />
    );
  }

  if (page === 'signin' || page === 'signup' || page === 'forgot-password') {
    return (
      <>
        <SignIn
          mode={page}
          onNavigateHome={() => navigateTo('landing')}
          onContactUs={() => openForm('expert')}
          onModeChange={(newMode) => setPage(newMode)}
          onForgotPassword={() => navigateTo('forgot-password')}
          onRequireMFA={(email) => {
            if (email) setAuthEmail(email);
            navigateTo('mfa');
          }}
        />
        {modalElement}
      </>
    );
  }

  return (
    <div className="app landing-page" data-theme={lightTheme ? 'light' : 'dark'}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <main id="main-content" tabIndex={-1}>
      <section className="hero dark-section" id="top" aria-labelledby="hero-heading">
        <img className="hero-background" src="/images/hero-laptop.jpg" alt="CyberRiskIQ executive dashboard displayed on a laptop above a dramatic mountain landscape" fetchPriority="high" />
        <div className="hero-shading" />
        <header className="site-header">
          <div className="container header-inner">
            <Logo />
            <nav className="desktop-nav" aria-label="Main navigation">{navLinks}</nav>
            <div className="header-actions">
              <button className="button button-outline header-signin" onClick={() => navigateTo('signin')}>Sign In</button>
              <button className="button button-white header-cta" onClick={() => openForm()}>Get Started <Icon name="arrow" /></button>
              <button className="theme-toggle icon-button" onClick={() => setLightTheme(!lightTheme)} aria-label={`Switch to ${lightTheme ? 'dark' : 'light'} theme`} title={`Switch to ${lightTheme ? 'dark' : 'light'} theme`}><Icon name={lightTheme ? 'moon' : 'sun'} /></button>
              <button className="mobile-menu-toggle icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
            </div>
          </div>
          {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{navLinks}<button className="button button-outline" onClick={() => navigateTo('signin')}>Sign In</button><button className="button button-white" onClick={() => openForm()}>Get Started <Icon name="arrow" /></button></nav>}
        </header>
        <div className="hero-main"><div className="container"><div className="hero-copy">
          <p className="eyebrow hero-enter enter-1">CYBER RISK INTELLIGENCE</p>
          <h1 id="hero-heading" className="hero-enter enter-2">See the Risk.<br />Know the Cost.<br /><span>Invest Smarter.</span></h1>
          <p className="hero-description hero-enter enter-3">The all-in-one platform that turns cyber risk<br className="desktop-break" /> into business decisions.</p>
          <div className="button-group hero-enter enter-4"><button className="button button-white" onClick={() => openForm()}>Get Started <Icon name="arrow" /></button><button className="button button-outline watch-button" onClick={() => setDialog({ type: 'tour', scene: 0 })}><Icon name="play" />Watch Film <Icon name="arrow-up-right" className="small-arrow" /></button></div>
        </div></div></div>
        <Framework className="hero-framework" />
        <p className="hero-mantra">A SAFER<br />TOMORROW<br />BUILDS A<br />BIGGER TODAY.</p>
        <div className="trust-strip container"><p>TRUSTED BY FORWARD-THINKING ORGANIZATIONS</p><div className="client-logos">{clients.map((client) => <BrandLogo name={client} key={client} />)}</div></div>
      </section>

      <section className="challenge light-section" id="challenge" aria-labelledby="challenge-heading">
        <img className="challenge-image" src="/images/challenge-layers.jpg" alt="Three layered glass panels revealing a mountain landscape, bringing hidden risks into focus" loading="lazy" />
        <div className="container"><div className="challenge-copy" data-reveal>
          <p className="eyebrow">THE CHALLENGE</p>
          <h2 id="challenge-heading">More Threats.<br />Higher Stakes.</h2>
          <p className="section-description">Vulnerabilities are increasing, attacks are more sophisticated, and the business impact has never been higher. Traditional tools show you problems, but not the bigger picture.</p>
          <div className="challenge-stats">
            <div><strong><Icon name="arrow-up" />85%</strong><p>Increase in cyberattacks<br />(Last 3 years)</p></div>
            <div><strong><span className="currency">&#8377;</span> 4.45 Cr</strong><p>Average cost of<br />a data breach (India)</p></div>
            <div><strong>60%</strong><p>Organizations lack<br />risk-to-finance visibility</p></div>
          </div>
          <p className="source">Source: IBM Cost of a Data Breach 2024, CERT-In, Industry Reports</p>
        </div></div>
        <div className="layer-labels" aria-hidden="true"><span>VULNERABILITIES</span><span>THREATS</span><span>ASSETS</span><span>BUSINESS IMPACT</span></div>
      </section>

      <section className="solution dark-section" id="solution" aria-labelledby="solution-heading">
        <img className="globe-image" src="/images/connected-earth.jpg" alt="Earth at night connected by glowing blue networks" loading="lazy" />
        <div className="solution-shading" /><p className="globe-caption">DIFFERENT DATA.<br />ONE CLARITY.</p>
        <div className="container solution-inner"><div className="solution-copy" data-reveal>
          <p className="eyebrow">THE SOLUTION</p><h2 id="solution-heading">CyberRiskIQ<br />Brings It All Together.</h2>
          <p className="section-description">Unify assets, vulnerabilities, threats, and controls. Quantify real-world financial impact. Get AI-driven investment recommendations &ndash; all in one platform.</p>
          <div className="solution-features">{features.map((feature, index) => <button className="feature" key={feature.icon} onClick={() => setDialog({ type: 'tour', scene: index })} aria-label={`Explore ${feature.lines.join(' ')}`}><span className={`feature-icon feature-icon-${index}`}><Icon name={feature.icon} /></span><span>{feature.lines[0]}<br />{feature.lines[1]}</span></button>)}</div>
        </div></div>
      </section>

      <section className="teams light-section" id="teams" aria-labelledby="teams-heading">
        <div className="container"><div className="teams-copy" data-reveal><p className="eyebrow">BUILT FOR EVERY TEAM</p><h2 id="teams-heading">From Security Ops<br />to the Boardroom.</h2><p className="section-description">A common platform. A common language.<br />A stronger, more resilient business.</p></div></div>
        <div className="team-carousel" role="region" aria-label="Explore CyberRiskIQ for your team" aria-roledescription="carousel" onKeyDown={(event) => { if (event.key === 'ArrowRight') { event.preventDefault(); setActiveTeam((activeTeam + 1) % 4); } if (event.key === 'ArrowLeft') { event.preventDefault(); setActiveTeam((activeTeam + 3) % 4); } }}>
          <div className="team-stage">{team.map((member, index) => {
            const position = (index - activeTeam + 4) % 4;
            const slot = ['active', 'next', 'far', 'previous'][position];
            return <button className={`team-card team-${slot}`} key={member.role} onClick={() => setActiveTeam(index)} aria-pressed={activeTeam === index} aria-label={`${member.role}: ${member.text}`}><img src={member.image} alt={member.alt} loading="lazy" /><span className="team-card-shade" /><span className="team-card-copy"><strong>{member.role}</strong><span>{member.text}</span></span></button>;
          })}</div>
          <div className="team-dots" role="group" aria-label="Select a team">{[1, 2, 3, 0].map((index) => <button key={team[index].role} className={activeTeam === index ? 'active' : ''} aria-label={`Show ${team[index].role}`} aria-pressed={activeTeam === index} onClick={() => setActiveTeam(index)} />)}</div>
          <p className="sr-only" aria-live="polite">Selected: {team[activeTeam].role}. {team[activeTeam].text}</p>
        </div>
      </section>

      <section className="impact dark-section" id="impact" aria-labelledby="impact-heading">
        <div className="impact-background" /><div className="container impact-inner">
          <div className="impact-copy" data-reveal><p className="eyebrow">REAL IMPACT</p><h2 id="impact-heading">Lower Risk.<br />Higher Confidence.<br />Stronger Business.</h2></div>
          <div className="impact-stats" data-reveal><div><strong>50+</strong><span>Organizations trust us</span></div><div><strong>1M+</strong><span>Assets analyzed</span></div><div><strong>40%</strong><span>Better security ROI</span></div><div><strong>60%</strong><span>Faster risk prioritization</span></div></div>
        </div>
      </section>

      <section className="voices light-section" id="voices" aria-labelledby="voices-heading"><div className="container">
        <div className="voices-header" data-reveal><div><p className="eyebrow">TRUSTED VOICES</p><h2 id="voices-heading">What Leaders Say</h2></div><div className="carousel-controls"><button className="icon-button" aria-label="Previous testimonial" onClick={() => setActiveTestimonial((activeTestimonial + 2) % 3)}><Icon name="arrow-left" /></button><button className="icon-button" aria-label="Next testimonial" onClick={() => setActiveTestimonial((activeTestimonial + 1) % 3)}><Icon name="arrow" /></button></div></div>
        <div className="testimonials" role="region" aria-roledescription="carousel" aria-label="What leaders say">{[0, 1, 2].map((offset) => {
          const index = (activeTestimonial + offset) % 3;
          const testimonial = testimonials[index];
          return <button className="testimonial-card" key={`${activeTestimonial}-${index}`} onClick={() => setDialog({ type: 'quote', index })} aria-label={`Read testimonial from ${testimonial.name}`}><blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote><span className="testimonial-person"><img src={testimonial.image} alt="" loading="lazy" /><span className="person-details"><strong>{testimonial.name}</strong><span>{testimonial.title}</span></span><BrandLogo name={testimonial.brand} colored /></span></button>;
        })}</div><p className="sr-only" aria-live="polite">Showing testimonial from {testimonials[activeTestimonial].name} first.</p>
      </div></section>

      <section className="closing dark-section" id="get-started" aria-labelledby="closing-heading">
        <img className="closing-background" src="/images/open-door.jpg" alt="A business leader walking through a bright open doorway toward a new mountain horizon" loading="lazy" /><div className="closing-shading" />
        <div className="container"><div className="closing-copy" data-reveal><p className="eyebrow">READY TO TURN RISK INTO OPPORTUNITY?</p><h2 id="closing-heading">A Safer, Stronger Tomorrow<br />Starts Today.</h2><p className="section-description">Join leading organizations in building cyber resilience with CyberRiskIQ.</p><div className="button-group"><button className="button button-white" onClick={() => openForm()}>Get Started <Icon name="arrow" /></button><button className="button button-outline" onClick={() => openForm('expert')}>Talk to an Expert</button></div></div></div>
        <Framework className="closing-framework" />
      </section>
      </main>

      <footer className="site-footer dark-section" id="company"><div className="container">
        <div className="footer-main"><div className="footer-brand"><Logo footer /><p>Know the Risk. Invest Smarter.</p></div><nav className="footer-nav" aria-label="Footer navigation"><a href="#solution">Product</a><a href="#challenge">Solutions</a><a href="#voices">Resources</a><button onClick={() => navigateTo('signin')}>Sign In</button><button onClick={() => setDialog({ type: 'info', page: 'Company' })}>Company</button></nav><div className="social-links"><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href.split('#')[0])}`} target="_blank" rel="noopener noreferrer" aria-label="Share CyberRiskIQ on LinkedIn"><Icon name="linkedin" /></a><span /><a href={`https://x.com/intent/post?text=${encodeURIComponent('See the Risk. Know the Cost. Invest Smarter. CyberRiskIQ')}&url=${encodeURIComponent(window.location.href.split('#')[0])}`} target="_blank" rel="noopener noreferrer" aria-label="Share CyberRiskIQ on X"><Icon name="x-social" /></a><span /><button onClick={() => setDialog({ type: 'tour', scene: 0 })} aria-label="Watch the CyberRiskIQ product film"><Icon name="youtube" /></button></div></div>
        <div className="footer-bottom"><p>&copy; 2026 CyberRiskIQ. All rights reserved.</p><nav aria-label="Legal navigation"><button onClick={() => setDialog({ type: 'info', page: 'Privacy' })}>Privacy</button><button onClick={() => setDialog({ type: 'info', page: 'Terms' })}>Terms</button><button onClick={() => setDialog({ type: 'info', page: 'Security' })}>Security</button><button onClick={() => openForm('expert')}>Contact</button></nav></div>
      </div></footer>

      {modalElement}
    </div>
  );
}

export default App;
