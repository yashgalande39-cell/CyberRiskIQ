import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function Shield({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" fill="none" aria-hidden="true">
      <path d="M20 2 37 8.9v13.2C37 33.2 29.7 41.9 20 45 10.3 41.9 3 33.2 3 22.1V8.9L20 2Z" stroke="#2f8fff" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M20 11.5 29.6 15.4v7.9c0 6.2-4 11.1-9.6 13.1-5.6-2-9.6-6.9-9.6-13.1v-7.9L20 11.5Z" fill="#2f8fff" />
    </svg>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className="logo" onClick={onClick} aria-label="CyberRiskIQ Home">
      <Shield />
      <span className="logo-word">CyberRisk<em>IQ</em></span>
    </button>
  );
}

export function Header({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [night, setNight] = useState(true);
  return (
    <header className="topbar">
      <Logo onClick={onNavigateHome} />
      <div className="topbar-right">
        <button className="round-btn" onClick={() => setNight((n) => !n)} aria-label="Toggle theme">
          {night ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <span className="v-divider" />
        <div className="account">
          <span className="account-badge">C</span>
          <div>
            <b>Create Organization</b>
            <small>Let's get you started</small>
          </div>
        </div>
      </div>
    </header>
  );
}
