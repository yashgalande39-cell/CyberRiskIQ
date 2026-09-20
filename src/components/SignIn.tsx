import React, { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';

type AuthRoute = 'signin' | 'signup' | 'forgot-password';
type ForgotView = 'forgot' | 'sent' | 'reset' | 'done';
type Modal = 'contact' | 'terms' | 'privacy' | 'security' | 'support' | null;

const DEMO_EMAIL = 'you@company.com';
const DEMO_CODE = '482193';

const features = [
  { icon: 'quant', label: ['Identify', 'Risks'] },
  { icon: 'database', label: ['Quantify', 'Impact'] },
  { icon: 'bulb', label: ['Optimize', 'Investments'] },
  { icon: 'shieldCheck', label: ['Build a', 'Safer Tomorrow'] },
];

const p: Record<string, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M10 21v-6h4v6" />,
  user: <><circle cx="12" cy="8.2" r="3.7" /><path d="M4.8 20c.8-3.6 3.7-5.6 7.2-5.6S18.4 16.4 19.2 20" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  eye: <><path d="M2.5 12S6.2 5.5 12 5.5 21.5 12 21.5 12 17.8 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3.2" /></>,
  eyeOff: <><path d="m4 4 16 16M9.9 9.9A3.2 3.2 0 0 0 12 15.2M14.1 14.1A3.2 3.2 0 0 0 12 8.8M6.1 6.4C3.6 8.1 2.5 12 2.5 12S6.2 18.5 12 18.5c1.8 0 3.4-.5 4.8-1.3M17.9 15.7C20.1 14 21.5 12 21.5 12S17.8 5.5 12 5.5c-.7 0-1.4.07-2 .2" /></>,
  building: <><path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4H13v17M13 8h6.5A1.5 1.5 0 0 1 21 9.5V21M2 21h20M7 8h3M7 12h3M7 16h3M16 12h2M16 16h2" /></>,
  arrowRight: <path d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5" />,
  arrowLeft: <path d="M19.5 12h-14m5.5 5.5L5.5 12 11 6.5" />,
  shieldCheck: <><path d="M12 2.5c2.8 2.2 5.4 2.8 8 2.8v5.6c0 5.3-3.3 8.6-8 11.6-4.7-3-8-6.3-8-11.6V5.3c2.6 0 5.2-.6 8-2.8Z" /><path d="m8.6 11.8 2.6 2.6 4.6-4.8" /></>,
  quant: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4m4 4V8m4 8v-6" /></>,
  database: <><ellipse cx="12" cy="5.6" rx="7.4" ry="3.1" /><path d="M4.6 5.6v12.8c0 1.7 3.3 3.1 7.4 3.1s7.4-1.4 7.4-3.1V5.6" /><path d="M4.6 12c0 1.7 3.3 3.1 7.4 3.1s7.4-1.4 7.4-3.1" /></>,
  bulb: <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.4V15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1.6A6 6 0 0 1 12 3Z" /></>,
  close: <path d="m6.5 6.5 11 11m0-11-11 11" />,
  check: <path d="m5 12.5 4.4 4.4L19 7.5" />,
  spark: <><path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.4M12 7.8v.9" /></>,
};

function Icon({ name, className = '', style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {p[name] ?? p.info}
    </svg>
  );
}

function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 44" fill="none" aria-hidden="true">
      <path
        d="M20 2.5c5 3.6 10 4.8 16 4.8v11.3C36 30.9 29 37.4 20 42 11 37.4 4 30.9 4 18.6V7.3c6 0 11-1.2 16-4.8Z"
        fill="url(#brandGradUnified)"
      />
      <path
        d="M20 2.5c5 3.6 10 4.8 16 4.8v11.3C36 30.9 29 37.4 20 42 11 37.4 4 30.9 4 18.6V7.3c6 0 11-1.2 16-4.8Z"
        stroke="#5ec8ff"
        strokeWidth="1.6"
      />
      <path d="m13 21 5 5 10-10.5" stroke="#04121f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13 21 5 5 10-10.5" stroke="#eaf7ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="brandGradUnified" x1="4" y1="2" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1f7fe0" />
          <stop offset="1" stopColor="#0b3f80" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg className="sso-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.86-.07-1.49-.22-2.14H12.24v3.89h6.46c-.13 1.07-.84 2.68-2.42 3.76l-.02.14 3.51 2.68.24.02c2.23-2.03 3.49-5.02 3.49-8.35Z" />
      <path fill="#34A853" d="M12.24 24c3.2 0 5.89-1.04 7.85-2.84l-3.74-2.84c-1 .71-2.34 1.21-4.11 1.21-3.13 0-5.79-2.07-6.74-4.94l-.14.01-3.66 2.79-.05.13C3.61 21.54 7.61 24 12.24 24Z" />
      <path fill="#FBBC05" d="M5.5 14.59A7.2 7.2 0 0 1 5.12 12c0-.9.16-1.77.37-2.59l-.01-.14-3.7-2.83-.12.06A11.96 11.96 0 0 0 .24 12c0 1.94.47 3.77 1.42 5.5l3.84-2.91Z" />
      <path fill="#EA4335" d="M12.24 4.75c2.22 0 3.72.95 4.57 1.74l3.34-3.22C18.12 1.19 15.44 0 12.24 0 7.61 0 3.61 2.46 1.66 6.09l3.83 2.91c.96-2.87 3.62-4.25 6.75-4.25Z" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg className="sso-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10.5v10.5H1Z" />
      <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5Z" />
      <path fill="#00A4EF" d="M1 12.5H11.5V23H1Z" />
      <path fill="#FFB900" d="M12.5 12.5H23V23H12.5Z" />
    </svg>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const heading = useId();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panel.current) return;
      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]'));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const outside = !panel.current.contains(document.activeElement);
      if (event.shiftKey && (outside || document.activeElement === first)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (outside || document.activeElement === last)) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [onClose]);
  return (
    <div className="dlg-back" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dlg" ref={panel} role="dialog" aria-modal="true" aria-labelledby={heading} tabIndex={-1}>
        <header className="dlg-head">
          <h2 id={heading}>{title}</h2>
          <button className="icon-x" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>
        <div className="dlg-body">{children}</div>
      </div>
    </div>
  );
}

interface AuthPageProps {
  mode?: AuthRoute;
  initialMode?: AuthRoute;
  onNavigateHome?: () => void;
  onContactUs?: () => void;
  onModeChange?: (mode: AuthRoute) => void;
  onForgotPassword?: () => void;
  onRequireMFA?: (email: string) => void;
}

export function SignIn({
  mode: controlledMode,
  initialMode = 'signin',
  onNavigateHome,
  onContactUs: _onContactUs,
  onModeChange,
  onForgotPassword,
  onRequireMFA,
}: AuthPageProps) {
  const [currentRoute, setCurrentRoute] = useState<AuthRoute>(controlledMode || initialMode);
  const [forgotView, setForgotView] = useState<ForgotView>('forgot');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    if (controlledMode && controlledMode !== currentRoute) {
      setCurrentRoute(controlledMode);
      setError('');
      setNotice('');
    }
  }, [controlledMode, currentRoute]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  function switchRoute(target: AuthRoute) {
    setCurrentRoute(target);
    setError('');
    setNotice('');
    setShowPwd(false);
    setShowConfirmPwd(false);
    if (target === 'forgot-password') {
      setForgotView('forgot');
    }
    if (onModeChange) {
      onModeChange(target);
    }
    if (typeof window !== 'undefined') {
      window.location.hash = target === 'forgot-password' ? '#forgot-password' : target === 'signup' ? '#signup' : '#signin';
    }
  }

  function onLogin(event: FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid work email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setBusy(true);
    setError('');
    window.setTimeout(() => {
      setBusy(false);
      if (onRequireMFA) {
        onRequireMFA(email.trim());
      } else if (typeof window !== 'undefined') {
        window.location.hash = '#mfa';
      }
    }, 600);
  }

  function onSignUp(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid work email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!termsAgreed) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }
    setBusy(true);
    setError('');
    window.setTimeout(() => {
      setBusy(false);
      setNotice('Account preview created successfully! Redirecting to multi-factor verification…');
      window.setTimeout(() => {
        if (onRequireMFA) {
          onRequireMFA(email.trim());
        } else if (typeof window !== 'undefined') {
          window.location.hash = '#mfa';
        }
      }, 900);
    }, 700);
  }

  function sendReset(target = email) {
    const value = target.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Enter a valid work email address.');
      return;
    }
    setBusy(true);
    setError('');
    window.setTimeout(() => {
      setEmail(value);
      setBusy(false);
      setCooldown(30);
      setForgotView('sent');
      setNotice('');
    }, 700);
  }

  function onForgotSubmit(event: FormEvent) {
    event.preventDefault();
    sendReset();
  }

  function onResetSubmit(event: FormEvent) {
    event.preventDefault();
    if (resetCode.trim() !== DEMO_CODE) {
      setError('That code does not match. Use the demo code 482193.');
      return;
    }
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    window.setTimeout(() => {
      setBusy(false);
      setPassword('');
      setConfirmPassword('');
      setResetCode('');
      setForgotView('done');
    }, 700);
  }

  function sso(provider: string) {
    setNotice(`${provider} sign-in is not connected in this preview.`);
  }

  function onContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactSent(true);
  }

  const left = (
    <section className="auth-left" aria-label="CyberRiskIQ">
      <img src="/images/auth-bg.jpg" alt="" className="auth-bg" />
      <div className="auth-shade" />
      <div className="auth-left-inner">
        <div className="auth-left-brand-row">
          <a
            className="logo"
            href="#top"
            onClick={(e) => {
              if (onNavigateHome) {
                e.preventDefault();
                onNavigateHome();
              }
            }}
            aria-label="CyberRiskIQ home"
          >
            <BrandMark className="logo-mark" />
            <span>CyberRisk<span>IQ</span></span>
          </a>
          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="ghost-btn back-btn"
              aria-label="Back to Home"
            >
              <Icon name="arrowLeft" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
        <div className="hero-copy">
          <p className="kicker">CONTINUOUS CYBER RISK INTELLIGENCE</p>
          <h1>Cyber Risk<br />Quantification &amp;<br /><em>Investment Optimization</em></h1>
          <p className="lede">Turn cyber risk into business decisions with real-time insights, financial impact modeling, and AI-driven recommendations.</p>
          <ul className="features">
            {features.map((item) => (
              <li key={item.label[0]}>
                <span className="feat-ic"><Icon name={item.icon} /></span>
                <span>{item.label[0]}<br />{item.label[1]}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mantra">DIFFERENT DATA.<br />ONE CLARITY.</p>
      </div>
    </section>
  );

  const legal = (
    <p className="agree">
      By continuing, you agree to our <button type="button" onClick={() => setModal('terms')}>Terms of Service</button> and <button type="button" onClick={() => setModal('privacy')}>Privacy Policy</button>.
    </p>
  );

  const ssoRow = (
    <>
      <div className="or"><span>OR</span></div>
      <div className="sso">
        <button type="button" className="sso-btn" onClick={() => sso('Google')}><GoogleMark />Continue with Google</button>
        <button type="button" className="sso-btn" onClick={() => sso('Microsoft')}><MicrosoftMark />Continue with Microsoft</button>
        <button type="button" className="sso-btn" onClick={() => sso('SSO')}><Icon name="building" />Continue with SSO</button>
      </div>
    </>
  );

  return (
    <div className="auth" id="top">
      {left}

      <section className="auth-right">
        <div className="right-top">
          {currentRoute === 'forgot-password' ? (
            <button
              type="button"
              className="ghost-btn back-btn"
              onClick={() => switchRoute('signin')}
              aria-label="Back to Sign In"
            >
              <Icon name="arrowLeft" />
              <span>Back to Sign In</span>
            </button>
          ) : onNavigateHome ? (
            <button
              type="button"
              className="ghost-btn back-btn"
              onClick={onNavigateHome}
              aria-label="Back to Home"
            >
              <Icon name="arrowLeft" />
              <span>Back to Home</span>
            </button>
          ) : <div />}

          <div className="right-top-action">
            {currentRoute === 'forgot-password' ? (
              <>
                <span>Don&apos;t have an account?</span>
                <button className="ghost-btn" onClick={() => { setModal('contact'); setContactSent(false); }}>Contact Us</button>
              </>
            ) : currentRoute === 'signin' ? (
              <>
                <span>Don&apos;t have an account?</span>
                <button className="ghost-btn" onClick={() => switchRoute('signup')}>Sign Up</button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button className="ghost-btn" onClick={() => switchRoute('signin')}>Sign In</button>
              </>
            )}
          </div>
        </div>

        <div className="card" id="form">
          {/* Mode Switcher Pill shown on Sign In & Sign Up */}
          {currentRoute !== 'forgot-password' && (
            <div className="auth-switch-pill" role="tablist" aria-label="Sign In or Sign Up">
              <div
                className="auth-switch-indicator"
                style={{ left: currentRoute === 'signin' ? '3px' : 'calc(50%)' }}
              />
              <button
                type="button"
                role="tab"
                aria-selected={currentRoute === 'signin'}
                onClick={() => switchRoute('signin')}
                className={`auth-switch-tab ${currentRoute === 'signin' ? 'active' : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={currentRoute === 'signup'}
                onClick={() => switchRoute('signup')}
                className={`auth-switch-tab ${currentRoute === 'signup' ? 'active' : ''}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {notice && (
            <p className="banner" role="status">
              {notice}
              <button onClick={() => setNotice('')} aria-label="Dismiss"><Icon name="close" /></button>
            </p>
          )}

          <div key={currentRoute === 'forgot-password' ? `forgot-${forgotView}` : currentRoute} className="auth-form-fade">
            {currentRoute === 'signin' && (
              /* Sign In View */
              <>
                <header className="card-head">
                  <h2>Welcome Back</h2>
                  <p>Sign in to access CyberRiskIQ</p>
                </header>

                <form className="form" onSubmit={onLogin} noValidate>
                  <label className="field">
                    Email
                    <span className="input">
                      <Icon name="mail" />
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        required
                      />
                    </span>
                  </label>

                  <label className="field">
                    Password
                    <span className="input">
                      <Icon name="lock" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        required
                      />
                      <button
                        type="button"
                        className="eye"
                        onClick={() => setShowPwd(!showPwd)}
                        aria-label={showPwd ? 'Hide password' : 'Show password'}
                      >
                        <Icon name={showPwd ? 'eyeOff' : 'eye'} />
                      </button>
                    </span>
                  </label>

                  <div className="row-between">
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      Remember this device
                    </label>
                    <button
                      type="button"
                      className="forgot"
                      onClick={() => {
                        if (onForgotPassword) {
                          onForgotPassword();
                        } else {
                          switchRoute('forgot-password');
                        }
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && <p className="error" role="alert">{error}</p>}

                  <button className="primary" type="submit" disabled={busy}>
                    {busy ? 'Signing in…' : 'Login'} <Icon name="arrowRight" />
                  </button>
                </form>

                <p className="back-row">
                  Don&apos;t have an account?{' '}
                  <button type="button" onClick={() => switchRoute('signup')}>
                    Create an account
                  </button>
                </p>

                {ssoRow}
                {legal}
              </>
            )}

            {currentRoute === 'signup' && (
              /* Sign Up View */
              <>
                <header className="card-head">
                  <h2>Create Account</h2>
                  <p>Join CyberRiskIQ to quantify your risk</p>
                </header>

                <form className="form" onSubmit={onSignUp} noValidate>
                  <div className="auth-fields-row">
                    <label className="field">
                      Full Name
                      <span className="input">
                        <Icon name="user" />
                        <input
                          type="text"
                          autoComplete="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => { setName(e.target.value); setError(''); }}
                          required
                        />
                      </span>
                    </label>

                    <label className="field">
                      Work Email
                      <span className="input">
                        <Icon name="mail" />
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(''); }}
                          required
                        />
                      </span>
                    </label>
                  </div>

                  <div className="auth-fields-row">
                    <label className="field">
                      Password
                      <span className="input">
                        <Icon name="lock" />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Min 8 chars"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(''); }}
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          className="eye"
                          onClick={() => setShowPwd(!showPwd)}
                          aria-label={showPwd ? 'Hide password' : 'Show password'}
                        >
                          <Icon name={showPwd ? 'eyeOff' : 'eye'} />
                        </button>
                      </span>
                    </label>

                    <label className="field">
                      Confirm Password
                      <span className="input">
                        <Icon name="lock" />
                        <input
                          type={showConfirmPwd ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          className="eye"
                          onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                          aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}
                        >
                          <Icon name={showConfirmPwd ? 'eyeOff' : 'eye'} />
                        </button>
                      </span>
                    </label>
                  </div>

                  <label className="check">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      required
                    />
                    <span>
                      I agree to the{' '}
                      <button
                        type="button"
                        style={{ color: '#3aa0ff', background: 'transparent', border: 0, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => setModal('terms')}
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        style={{ color: '#3aa0ff', background: 'transparent', border: 0, padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => setModal('privacy')}
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>

                  {error && <p className="error" role="alert">{error}</p>}

                  <button className="primary" type="submit" disabled={busy}>
                    {busy ? 'Creating account…' : 'Create Account'} <Icon name="arrowRight" />
                  </button>
                </form>

                <p className="back-row">
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchRoute('signin')}>
                    Sign In
                  </button>
                </p>

                {ssoRow}
                {legal}
              </>
            )}

            {currentRoute === 'forgot-password' && (
              /* Forgot Password Flow */
              <>
                {forgotView === 'forgot' && (
                  <>
                    <header className="card-head">
                      <h2>Forgot Password</h2>
                      <p>Enter the email on your CyberRiskIQ account and we&apos;ll send a reset link.</p>
                    </header>
                    <form className="form" onSubmit={onForgotSubmit} noValidate>
                      <label className="field">
                        Email
                        <span className="input">
                          <Icon name="mail" />
                          <input
                            type="email"
                            autoComplete="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            required
                          />
                        </span>
                      </label>
                      {error && <p className="error" role="alert">{error}</p>}
                      <button className="primary" type="submit" disabled={busy}>
                        {busy ? 'Sending…' : 'Send Reset Link'} <Icon name="arrowRight" />
                      </button>
                    </form>
                    <p className="back-row">
                      Remember your password?{' '}
                      <button type="button" onClick={() => switchRoute('signin')}>
                        Sign in
                      </button>
                    </p>
                    {ssoRow}
                    {legal}
                  </>
                )}

                {forgotView === 'sent' && (
                  <>
                    <header className="card-head">
                      <span className="ok-ic"><Icon name="check" /></span>
                      <h2>Check your inbox</h2>
                      <p>If an account exists for <strong>{email}</strong>, a reset link is on its way. This preview does not send email — use the demo code below.</p>
                    </header>
                    <div className="code-box">
                      <span>Demo reset code</span>
                      <strong>{DEMO_CODE}</strong>
                    </div>
                    <button className="primary" type="button" onClick={() => { setForgotView('reset'); setError(''); }}>
                      Continue to reset <Icon name="arrowRight" />
                    </button>
                    <p className="back-row">
                      Didn&apos;t get it?{' '}
                      <button type="button" disabled={cooldown > 0} onClick={() => sendReset(email)}>
                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
                      </button>
                    </p>
                    <button className="text-link" type="button" onClick={() => { setForgotView('forgot'); setError(''); }}>
                      Use a different email
                    </button>
                    {legal}
                  </>
                )}

                {forgotView === 'reset' && (
                  <>
                    <header className="card-head">
                      <h2>Set a new password</h2>
                      <p>Enter the code sent to <strong>{email || DEMO_EMAIL}</strong> and choose a new password.</p>
                    </header>
                    <form className="form" onSubmit={onResetSubmit}>
                      <label className="field">
                        Reset code
                        <span className="input">
                          <Icon name="spark" />
                          <input
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="6-digit code"
                            value={resetCode}
                            onChange={(e) => { setResetCode(e.target.value); setError(''); }}
                            required
                            maxLength={8}
                          />
                        </span>
                      </label>
                      <label className="field">
                        New password
                        <span className="input">
                          <Icon name="lock" />
                          <input
                            type={showPwd ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            className="eye"
                            onClick={() => setShowPwd(!showPwd)}
                            aria-label={showPwd ? 'Hide password' : 'Show password'}
                          >
                            <Icon name={showPwd ? 'eyeOff' : 'eye'} />
                          </button>
                        </span>
                      </label>
                      <label className="field">
                        Confirm password
                        <span className="input">
                          <Icon name="lock" />
                          <input
                            type={showConfirmPwd ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            className="eye"
                            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                            aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}
                          >
                            <Icon name={showConfirmPwd ? 'eyeOff' : 'eye'} />
                          </button>
                        </span>
                      </label>
                      {error && <p className="error" role="alert">{error}</p>}
                      <button className="primary" type="submit" disabled={busy}>
                        {busy ? 'Updating…' : 'Update Password'} <Icon name="arrowRight" />
                      </button>
                    </form>
                    <p className="back-row">
                      <button type="button" onClick={() => { setForgotView('sent'); setError(''); }}>
                        Back
                      </button>
                    </p>
                    {legal}
                  </>
                )}

                {forgotView === 'done' && (
                  <>
                    <header className="card-head">
                      <span className="ok-ic"><Icon name="check" /></span>
                      <h2>Password updated</h2>
                      <p>Your CyberRiskIQ password for <strong>{email}</strong> is ready. Sign in to continue.</p>
                    </header>
                    <button className="primary" type="button" onClick={() => switchRoute('signin')}>
                      Return to Sign in <Icon name="arrowRight" />
                    </button>
                    {legal}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="auth-foot">
        <p>© 2026 CyberRiskIQ. All rights reserved.</p>
        <nav>
          <button onClick={() => setModal('security')}>Security</button>
          <span>|</span>
          <button onClick={() => setModal('privacy')}>Privacy</button>
          <span>|</span>
          <button onClick={() => setModal('support')}>Support</button>
        </nav>
      </footer>

      {modal && (
        <Dialog
          title={modal === 'contact' ? 'Contact Us' : modal === 'terms' ? 'Terms of Service' : modal === 'privacy' ? 'Privacy Policy' : modal === 'security' ? 'Security' : 'Support'}
          onClose={() => setModal(null)}
        >
          {modal === 'contact' && !contactSent && (
            <form className="form" onSubmit={onContact}>
              <p className="dlg-copy">Tell us how we can help. This preview stores your inquiry on this device only.</p>
              <label className="field">Full name<input name="name" required placeholder="Your name" /></label>
              <label className="field">Work email<input name="email" type="email" required placeholder="you@company.com" defaultValue={email} /></label>
              <label className="field">How can we help?<textarea name="subject" rows={4} required placeholder="I need access to my CyberRiskIQ workspace…" /></label>
              <button className="primary" type="submit">Send message <Icon name="arrowRight" /></button>
            </form>
          )}
          {modal === 'contact' && contactSent && (
            <div className="dlg-success">
              <span className="ok-ic"><Icon name="check" /></span>
              <h3>Request ready</h3>
              <p>Your message was saved locally. No email was sent from this preview.</p>
              <button className="primary" type="button" onClick={() => setModal(null)}>Close</button>
            </div>
          )}
          {modal === 'terms' && <div className="legal-copy"><p>This interactive preview demonstrates the CyberRiskIQ platform. It does not create an account, transmit credentials, or form a service agreement.</p><p>Product names, statistics and sample organizations reproduce the supplied visual reference and are not independently verified.</p></div>}
          {modal === 'privacy' && <div className="legal-copy"><p>Information you enter is stored only in this browser&apos;s local memory for demonstration purposes.</p><p>Nothing is sent to a server. Clear site data at any time to remove saved requests. This preview does not use analytics cookies.</p></div>}
          {modal === 'security' && <div className="legal-copy"><p>Do not enter production credentials. This page never connects to your organization&apos;s identity provider.</p><p>Security assessments and quantification metrics shown are simulated representations.</p></div>}
          {modal === 'support' && <div className="legal-copy"><p>Need help getting into CyberRiskIQ? Reach out through Contact Us or speak with our solutions team.</p><button className="primary" type="button" onClick={() => { setContactSent(false); setModal('contact'); }}>Contact Us <Icon name="arrowRight" /></button></div>}
        </Dialog>
      )}
    </div>
  );
}
