import React, { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

interface MFAVerifyProps {
  email?: string;
  onNavigateSignIn?: () => void;
  onNavigateHome?: () => void;
  onVerified?: () => void;
}

type ModalType = "contact" | "terms" | "privacy" | "security" | "authenticator" | null;

const DEMO_CODE = "482193";

const p: Record<string, ReactNode> = {
  arrowLeft: <path d="M19.5 12h-14m5.5 5.5L5.5 12 11 6.5" />,
  arrowRight: <path d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5" />,
  close: <path d="m6.5 6.5 11 11m0-11-11 11" />,
  check: <path d="m5 12.5 4.4 4.4L19 7.5" />,
  shieldCheck: <><path d="M12 2.5c2.8 2.2 5.4 2.8 8 2.8v5.6c0 5.3-3.3 8.6-8 11.6-4.7-3-8-6.3-8-11.6V5.3c2.6 0 5.2-.6 8-2.8Z" /><path d="m8.6 11.8 2.6 2.6 4.6-4.8" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.2" /><path d="M14 20c0-2.8 1.3-4 3-4s3 1.2 3 4" /></>,
  spark: <><path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z" /></>,
  building: <><path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4H13v17M13 8h6.5A1.5 1.5 0 0 1 21 9.5V21M2 21h20M7 8h3M7 12h3M7 16h3M16 12h2M16 16h2" /></>,
};

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {p[name]}
    </svg>
  );
}

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 44" fill="none" aria-hidden="true">
      <path
        d="M20 2.5c5 3.6 10 4.8 16 4.8v11.3C36 30.9 29 37.4 20 42 11 37.4 4 30.9 4 18.6V7.3c6 0 11-1.2 16-4.8Z"
        fill="url(#mfaBrandGrad)"
      />
      <path
        d="M20 2.5c5 3.6 10 4.8 16 4.8v11.3C36 30.9 29 37.4 20 42 11 37.4 4 30.9 4 18.6V7.3c6 0 11-1.2 16-4.8Z"
        stroke="#5ec8ff"
        strokeWidth="1.6"
      />
      <path d="m13 21 5 5 10-10.5" stroke="#04121f" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13 21 5 5 10-10.5" stroke="#eaf7ff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="mfaBrandGrad" x1="4" y1="2" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1f7fe0" />
          <stop offset="1" stopColor="#0b3f80" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const features = [
  { icon: "lock", label: ["Your Data", "Protected"], desc: "Advanced security for critical information" },
  { icon: "users", label: ["Access with", "Confidence"], desc: "Only authorized users, always" },
  { icon: "shieldCheck", label: ["Built for", "Trust"], desc: "Security at every step" },
];

export default function MFAVerify({
  email = "yashgalande39@gmail.com",
  onNavigateSignIn,
  onNavigateHome,
  onVerified,
}: MFAVerifyProps) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<ModalType>(null);
  const [contactSent, setContactSent] = useState(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (i: number, v: string) => {
    const val = v.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[i] = val;
    setCode(next);
    setError("");
    if (val && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[i] && i > 0) {
        inputs.current[i - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!data) return;
    const next = [...code];
    for (let i = 0; i < 6; i++) {
      next[i] = data[i] || "";
    }
    setCode(next);
    setError("");
    const targetIdx = Math.min(data.length, 5);
    inputs.current[targetIdx]?.focus();
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setNotice(`A fresh 6-digit code has been sent. Demo code: ${DEMO_CODE}`);
    setError("");
  };

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    const entered = code.join("");
    if (entered.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }
    setBusy(true);
    setError("");

    window.setTimeout(() => {
      setBusy(false);
      setSuccess(true);
      if (onVerified) {
        window.setTimeout(() => onVerified(), 1200);
      }
    }, 700);
  };

  const handleQuickFill = () => {
    const demo = DEMO_CODE.split("");
    setCode(demo);
    setError("");
    inputs.current[5]?.focus();
  };

  return (
    <div className="auth" id="top">
      {/* Left Column: Background image and security intelligence copy */}
      <section className="auth-left" aria-label="CyberRiskIQ">
        <img src="/images/bg2.jpg" alt="" className="auth-bg" />
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
              <span>
                CyberRisk<span>IQ</span>
              </span>
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
            <h1>
              Stronger Security for a<br />
              <em>Safer Tomorrow.</em>
            </h1>
            <p className="lede">
              Multi-factor authentication helps us keep your organization&apos;s data, assets, and investments secure.
            </p>

            <ul className="features">
              {features.map((item) => (
                <li key={item.label[0]}>
                  <span className="feat-ic">
                    <Icon name={item.icon} />
                  </span>
                  <span>
                    {item.label[0]}
                    <br />
                    {item.label[1]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mantra">
            DIFFERENT DATA.
            <br />
            ONE CLARITY.
          </p>
        </div>
      </section>

      {/* Right Column: Dark blue solid panel containing the MFA card */}
      <section className="auth-right">
        <div className="right-top">
          <button
            type="button"
            className="ghost-btn back-btn"
            onClick={onNavigateSignIn || onNavigateHome}
            aria-label="Back to Login"
          >
            <Icon name="arrowLeft" />
            <span>Back to Login</span>
          </button>

          <div className="right-top-action">
            <span style={{ color: "#8fa5bc", fontSize: "13px" }}>Need help?</span>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                setModal("contact");
                setContactSent(false);
              }}
            >
              Contact Support
            </button>
          </div>
        </div>

        <div className="card mfa-card" id="form" style={{ margin: "auto" }}>
          {notice && (
            <p className="banner" role="status">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                <Icon name="close" />
              </button>
            </p>
          )}

          <header className="card-head">
            <div
              className="ok-ic"
              style={{
                background: "#122e4c",
                borderColor: "#23588a",
                color: "#5ec8ff",
              }}
            >
              <Icon name="shieldCheck" />
            </div>
            <h2>Verify It&apos;s You</h2>
            <p>
              We&apos;ve sent a 6-digit verification code to
              <br />
              <strong style={{ color: "#ffffff" }}>{email}</strong>
            </p>
          </header>

          {success ? (
            <div className="dlg-success" style={{ padding: "18px 0 12px" }}>
              <span className="ok-ic" style={{ marginBottom: "12px" }}>
                <Icon name="check" />
              </span>
              <h3>Identity Verified</h3>
              <p>Accessing your CyberRiskIQ workspace…</p>
              <button
                type="button"
                className="primary"
                onClick={onNavigateHome}
                style={{ marginTop: "14px" }}
              >
                Go to Workspace <Icon name="arrowRight" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} noValidate>
              {/* 6-Digit Code Input Slots */}
              <div className="mfa-code-grid">
                {code.map((c, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={c}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    maxLength={1}
                    autoComplete="one-time-code"
                    aria-label={`Digit ${i + 1}`}
                    className={`mfa-code-input ${i === 0 && c === "" ? "active-slot" : ""}`}
                  />
                ))}
              </div>

              {error && (
                <p className="error" style={{ textAlign: "center", marginBottom: "10px" }} role="alert">
                  {error}
                </p>
              )}

              {/* Demo Quick-Fill Pill */}
              <div style={{ textAlign: "center", margin: "10px 0 12px" }}>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="mfa-demo-pill"
                >
                  <span>Demo Code:</span>
                  <strong style={{ color: "#ffffff", fontFamily: "monospace" }}>{DEMO_CODE}</strong>
                  <span style={{ opacity: 0.75, fontSize: "10.5px" }}>(Click to fill)</span>
                </button>
              </div>

              {/* Resend Code Link */}
              <p className="back-row" style={{ marginTop: "6px", fontSize: "12.5px" }}>
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  style={{ color: "#3aa0ff", fontWeight: 500 }}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
                </button>
              </p>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={busy}
                className="primary"
                style={{ marginTop: "14px" }}
              >
                {busy ? "Verifying…" : "Verify & Continue"} <Icon name="arrowRight" />
              </button>

              {/* OR Divider */}
              <div className="or">
                <span>OR</span>
              </div>

              {/* Secondary: Use Authenticator App */}
              <button
                type="button"
                onClick={() => setModal("authenticator")}
                className="mfa-auth-btn"
              >
                <Icon name="lock" />
                <span>Use Authenticator App</span>
              </button>

              {/* Back to Login Link */}
              <p className="back-row" style={{ marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={onNavigateSignIn || onNavigateHome}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Icon name="arrowLeft" />
                  <span>Go back to login</span>
                </button>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer across both columns */}
      <footer className="auth-foot">
        <p>© 2026 CyberRiskIQ. All rights reserved.</p>
        <nav>
          <button type="button" onClick={() => setModal("security")}>
            Security
          </button>
          <span>|</span>
          <button type="button" onClick={() => setModal("privacy")}>
            Privacy
          </button>
          <span>|</span>
          <button type="button" onClick={() => setModal("terms")}>
            Terms
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => {
              setModal("contact");
              setContactSent(false);
            }}
          >
            Support
          </button>
        </nav>
      </footer>

      {/* Modals */}
      {modal && (
        <div
          className="dlg-back"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className="dlg" role="dialog" aria-modal="true">
            <header className="dlg-head">
              <h2>
                {modal === "contact"
                  ? "Contact Support"
                  : modal === "authenticator"
                  ? "Authenticator App"
                  : modal === "terms"
                  ? "Terms of Service"
                  : modal === "privacy"
                  ? "Privacy Policy"
                  : "Security Posture"}
              </h2>
              <button
                type="button"
                className="icon-x"
                onClick={() => setModal(null)}
                aria-label="Close dialog"
              >
                <Icon name="close" />
              </button>
            </header>

            <div className="dlg-body">
              {modal === "authenticator" && (
                <div style={{ textAlign: "center", padding: "6px 0" }}>
                  <div className="mfa-qr-box">
                    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                      <rect width="100" height="100" fill="#fff" />
                      <rect x="10" y="10" width="30" height="30" fill="#000" />
                      <rect x="15" y="15" width="20" height="20" fill="#fff" />
                      <rect x="20" y="20" width="10" height="10" fill="#000" />
                      <rect x="60" y="10" width="30" height="30" fill="#000" />
                      <rect x="65" y="15" width="20" height="20" fill="#fff" />
                      <rect x="70" y="20" width="10" height="10" fill="#000" />
                      <rect x="10" y="60" width="30" height="30" fill="#000" />
                      <rect x="15" y="65" width="20" height="20" fill="#fff" />
                      <rect x="20" y="70" width="10" height="10" fill="#000" />
                      <rect x="45" y="45" width="10" height="10" fill="#000" />
                      <rect x="60" y="60" width="15" height="15" fill="#000" />
                      <rect x="80" y="60" width="10" height="25" fill="#000" />
                    </svg>
                  </div>
                  <p className="dlg-copy" style={{ fontSize: "13px" }}>
                    Scan with Google Authenticator or 1Password, or enter demo code{" "}
                    <strong style={{ color: "#ffffff", fontFamily: "monospace" }}>{DEMO_CODE}</strong>.
                  </p>
                  <button
                    type="button"
                    className="primary"
                    onClick={() => {
                      handleQuickFill();
                      setModal(null);
                    }}
                    style={{ marginTop: "12px" }}
                  >
                    Fill Code &amp; Verify
                  </button>
                </div>
              )}

              {modal === "contact" && !contactSent && (
                <form
                  className="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSent(true);
                  }}
                >
                  <p className="dlg-copy">
                    Need immediate assistance with multi-factor authentication? Submit your inquiry below.
                  </p>
                  <label className="field">
                    Work Email
                    <input type="email" defaultValue={email} required />
                  </label>
                  <label className="field">
                    Issue Description
                    <textarea rows={3} placeholder="I lost access to my authenticator device..." required />
                  </label>
                  <button type="submit" className="primary">
                    Send Support Request <Icon name="arrowRight" />
                  </button>
                </form>
              )}

              {modal === "contact" && contactSent && (
                <div className="dlg-success">
                  <span className="ok-ic">
                    <Icon name="check" />
                  </span>
                  <h3>Request Received</h3>
                  <p>Your inquiry was recorded locally in this browser demo.</p>
                  <button type="button" className="primary" onClick={() => setModal(null)}>
                    Close
                  </button>
                </div>
              )}

              {modal === "terms" && (
                <div className="legal-copy">
                  <p>
                    This interactive preview reproduces the CyberRiskIQ multi-factor verification workflow.
                  </p>
                  <p>
                    Session tokens and verification states are simulated locally for demonstration purposes.
                  </p>
                </div>
              )}

              {modal === "privacy" && (
                <div className="legal-copy">
                  <p>
                    No credentials, biometrics, or personal identifiers are uploaded to remote servers.
                  </p>
                  <p>
                    All multi-factor codes remain exclusively within the active browser session memory.
                  </p>
                </div>
              )}

              {modal === "security" && (
                <div className="legal-copy">
                  <p>
                    CyberRiskIQ Multi-Factor Authentication adheres to FIPS 140-3 and NIST SP 800-63B standards.
                  </p>
                  <p>
                    Hardware security keys (FIDO2 / WebAuthn) and adaptive risk-based challenges are supported in enterprise tier.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
