import { useId, type CSSProperties, type ReactNode } from 'react';

export type IconName = string;

const p: Record<string, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M10 21v-6h4v6" />,
  assets: <><rect x="3" y="4" width="8" height="7" rx="1.5" /><rect x="13" y="4" width="8" height="7" rx="1.5" /><rect x="3" y="13" width="8" height="7" rx="1.5" /><rect x="13" y="13" width="8" height="7" rx="1.5" /></>,
  bug: <><circle cx="12" cy="13" r="5" /><path d="M12 8V6m0 14v-2M7.5 9.5 6 8m12 1.5L19.5 8M4 13h3m10 0h3M7.5 16.5 6 18m12-1.5L19.5 18M9 8.5A3 3 0 0 1 15 8.5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" /></>,
  shieldCheck: <><path d="M12 2.5c2.8 2.2 5.4 2.8 8 2.8v5.6c0 5.3-3.3 8.6-8 11.6-4.7-3-8-6.3-8-11.6V5.3c2.6 0 5.2-.6 8-2.8Z" /><path d="m8.6 11.8 2.6 2.6 4.6-4.8" /></>,
  shieldHeart: <><path d="M12 2.5c2.8 2.2 5.4 2.8 8 2.8v5.6c0 5.3-3.3 8.6-8 11.6-4.7-3-8-6.3-8-11.6V5.3c2.6 0 5.2-.6 8-2.8Z" /><path d="M12 16s-3.2-2-3.2-4.1c0-1.1.9-2 2-2 .7 0 1 .3 1.2.7.2-.4.5-.7 1.2-.7 1.1 0 2 .9 2 2C15.2 14 12 16 12 16Z" /></>,
  quant: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-4m4 4V8m4 8v-6" /></>,
  rupee: <><path d="M6.5 4h11M6.5 8.5h11M15.5 4c0 4-3.5 4.5-6 4.5 3 0 7 3.5 8.5 11" /></>,
  optim: <><path d="M4 17l4.5-5 3.5 3L20 6" /><path d="M15.5 6H20v4.5" /></>,
  rec: <><path d="M8 5h11M8 12h11M8 19h11" /><circle cx="4.2" cy="5" r="1.4" /><circle cx="4.2" cy="12" r="1.4" /><circle cx="4.2" cy="19" r="1.4" /></>,
  flask: <><path d="M9 3h6M10.5 3v5.2L5.6 17.4A2.4 2.4 0 0 0 7.8 21h8.4a2.4 2.4 0 0 0 2.2-3.6L13.5 8.2V3" /><path d="M7.4 15h9.2" /></>,
  report: <><path d="M14 3H7a1.8 1.8 0 0 0-1.8 1.8v14.4A1.8 1.8 0 0 0 7 21h10a1.8 1.8 0 0 0 1.8-1.8V7.8Z" /><path d="M13.6 3v5h5M9 13h6M9 17h4" /></>,
  audit: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 1.8" /></>,
  gear: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6m13.8 0h2.6M5.2 5.2l1.9 1.9m9.8 9.8 1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16.2 16.2 4.3 4.3" /></>,
  bell: <><path d="M18 15.5V10a6 6 0 1 0-12 0v5.5L4.4 18h15.2Z" /><path d="M10 21a2.2 2.2 0 0 0 4 0" /></>,
  grid: <><rect x="4" y="4" width="6.4" height="6.4" rx="1.4" /><rect x="13.6" y="4" width="6.4" height="6.4" rx="1.4" /><rect x="4" y="13.6" width="6.4" height="6.4" rx="1.4" /><rect x="13.6" y="13.6" width="6.4" height="6.4" rx="1.4" /></>,
  chevron: <path d="m6 9.5 6 6 6-6" />,
  arrowRight: <path d="M4.5 12h14m-5.5-5.5L18.5 12 13 17.5" />,
  arrowUp: <path d="M12 19.5V5m-6 6 6-6 6 6" />,
  arrowDown: <path d="M12 4.5V19m6-6-6 6-6-6" />,
  target: <><circle cx="12" cy="12" r="8.4" /><circle cx="12" cy="12" r="4.4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
  database: <><ellipse cx="12" cy="5.6" rx="7.4" ry="3.1" /><path d="M4.6 5.6v12.8c0 1.7 3.3 3.1 7.4 3.1s7.4-1.4 7.4-3.1V5.6" /><path d="M4.6 12c0 1.7 3.3 3.1 7.4 3.1s7.4-1.4 7.4-3.1" /></>,
  brain: <><path d="M9.5 4.5A2.5 2.5 0 0 0 7 7a2.4 2.4 0 0 0-1.6 4.2A2.6 2.6 0 0 0 6 16a2.5 2.5 0 0 0 3.5 2.3V4.5Z" /><path d="M14.5 4.5A2.5 2.5 0 0 1 17 7a2.4 2.4 0 0 1 1.6 4.2A2.6 2.6 0 0 1 18 16a2.5 2.5 0 0 1-3.5 2.3V4.5Z" /><path d="M12 4.5v15" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.4M12 7.8v.9" /></>,
  alert: <><path d="M12 3.5 21.2 20H2.8Z" /><path d="M12 9.4v4.4M12 16.6v.9" /></>,
  headset: <><path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" /><path d="M4.5 13.6h1.8A1.7 1.7 0 0 1 8 15.3v2.4a1.7 1.7 0 0 1-1.7 1.7H4.5a1 1 0 0 1-1-1v-3.8a1 1 0 0 1 1-1ZM19.5 13.6h-1.8a1.7 1.7 0 0 0-1.7 1.7v2.4a1.7 1.7 0 0 0 1.7 1.7h1.8a1 1 0 0 0 1-1v-3.8a1 1 0 0 0-1-1Z" /></>,
  close: <path d="m6.5 6.5 11 11m0-11-11 11" />,
  check: <path d="m5 12.5 4.4 4.4L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  play: <path d="M7 4.8 19 12 7 19.2Z" />,
  filter: <path d="M4 5.5h16l-6.2 7.2V20l-3.6-2.2v-5.1Z" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.8h17M8.4 3v3.6M15.6 3v3.6" /></>,
  spark: <><path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9Z" /></>,
  download: <><path d="M12 3.8v11.4m-4.4-4.4L12 15.2l4.4-4.4" /><path d="M4.5 19.5h15" /></>,
  clock: <><circle cx="12" cy="12" r="8.6" /><path d="M12 7.4V12l3.2 2" /></>,
  logout: <><path d="M15 4.5h3.2A1.8 1.8 0 0 1 20 6.3v11.4a1.8 1.8 0 0 1-1.8 1.8H15" /><path d="M10.5 8 6.5 12l4 4M6.5 12H16" /></>,
  user: <><circle cx="12" cy="8.2" r="3.7" /><path d="M4.8 20c.8-3.6 3.7-5.6 7.2-5.6S18.4 16.4 19.2 20" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.6-5.9" /><path d="M20 4v4.6h-4.6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  eye: <><path d="M2.5 12S6.2 5.5 12 5.5 21.5 12 21.5 12 17.8 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3.2" /></>,
  eyeOff: <><path d="m4 4 16 16M9.9 9.9A3.2 3.2 0 0 0 12 15.2M14.1 14.1A3.2 3.2 0 0 0 12 8.8M6.1 6.4C3.6 8.1 2.5 12 2.5 12S6.2 18.5 12 18.5c1.8 0 3.4-.5 4.8-1.3M17.9 15.7C20.1 14 21.5 12 21.5 12S17.8 5.5 12 5.5c-.7 0-1.4.07-2 .2" /></>,
  building: <><path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4H13v17M13 8h6.5A1.5 1.5 0 0 1 21 9.5V21M2 21h20M7 8h3M7 12h3M7 16h3M16 12h2M16 16h2" /></>,
  bulb: <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.4V15a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1.6A6 6 0 0 1 12 3Z" /></>,
  stack: <><path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" /><path d="M3.5 12 12 16.5 20.5 12" /><path d="M3.5 16.5 12 21l8.5-4.5" /></>,
  bars: <><path d="M4 20V10M10 20V4M16 20v-7M22 20V8" /></>,
  coins: <><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5 7v4c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 11v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4" /></>,
  ticket: <><path d="M4 8.5A2.5 2.5 0 0 0 4 13.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5A2.5 2.5 0 0 0 20 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Z" /><path d="M9 6v12" /></>,
  plug: <><path d="M9 7V3M15 7V3M8 7h8v4a4 4 0 0 1-4 4v6" /></>,
  clipboard: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4.2V3h6v1.2" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" /></>,
  moon: <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />,
  kbd: <path d="M4 7h16v10H4Z" />,
  export: <><path d="M12 3v11M8 7l4-4 4 4" /><path d="M5 14v5h14v-5" /></>,
  flask2: <><path d="M9 3h6M10 3v6L5.4 18.2A2.2 2.2 0 0 0 7.4 21h9.2a2.2 2.2 0 0 0 2-2.8L14 9V3" /></>,
  link: <path d="M9.5 14.5 7 17a3.2 3.2 0 0 1-4.5-4.5L5 10m9.5-.5 2.5-2.5A3.2 3.2 0 0 1 21.5 12L19 14.5M8.5 15.5l7-7" />,
  cloud: <><path d="M7 18.5h10a3.5 3.5 0 0 0 .4-6.98 5.5 5.5 0 0 0-10.7-1.3A3.9 3.9 0 0 0 7 18.5Z" /></>,
  star: <path d="m12 3.6 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8Z" />,
  layers: <><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  server: <><rect x="3" y="3" width="18" height="7" rx="2" /><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" /></>,
  pencil: <><path d="m4 20 4.5-1 10.8-10.8a2.1 2.1 0 0 0-3-3L5.5 16Z" /><path d="m14.8 6.7 3 3" /></>,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  pin: <><path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
  tag: <><path d="M20 13 13 20l-9-9V4h7Z" /><circle cx="8" cy="8" r="1" /></>,
  arrowLeft: <path d="M19.5 12h-15m6-6-6 6 6 6" />,
  radar: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="m12 12 5-5" /></>,
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  rotate: <><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v5h-5" /></>,
  shield: <path d="M12 2.5c3 2 5.4 3 8 3v5.3c0 5.1-3.2 8.2-8 11-4.8-2.8-8-5.9-8-11V5.5c2.6 0 5-1 8-3Z" />,
  shieldPlus: <><path d="M12 2.5c3 2 5.4 3 8 3v5.3c0 5.1-3.2 8.2-8 11-4.8-2.8-8-5.9-8-11V5.5c2.6 0 5-1 8-3Z" /><path d="M12 8v8m-4-4h8" /></>,
  shieldGear: <><path d="M12 2.5c3 2 5.4 3 8 3v5.3c0 5.1-3.2 8.2-8 11-4.8-2.8-8-5.9-8-11V5.5c2.6 0 5-1 8-3Z" /><circle cx="12" cy="11" r="2.5" /><path d="M12 7.5v1m0 5v1M8.5 11h1m5 0h1" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m7 12 3.3 3.3L17 8" /></>,
  pie: <><path d="M11 2a10 10 0 1 0 11 11H11Z" fill="currentColor" stroke="none" /><path d="M14 2v8h8A10 10 0 0 0 14 2Z" fill="currentColor" opacity=".5" stroke="none" /></>,
  users: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4ZM16 4a3 3 0 0 1 0 6m2 3a4 4 0 0 1 3 4v4h-4" /></>,
  network: <><rect x="9" y="2" width="6" height="5" rx="1" /><path d="M12 7v4m-7 4v-4h14v4" /><rect x="2" y="15" width="6" height="6" rx="1" /><rect x="9" y="15" width="6" height="6" rx="1" /><rect x="16" y="15" width="6" height="6" rx="1" /></>,
  archive: <><path d="M4 8h16v12H4ZM3 4h18v4H3Z" /><path d="M9 12h6" /></>,
  chartBox: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 16v-3m5 3V8m5 8v-5M3 8H1" /></>,
  fingerprint: <><path d="M5 12a7 7 0 0 1 14 0m-12 1a5 5 0 0 1 10 0c0 4-1 6-2 8M9 13a3 3 0 0 1 6 0c0 4-1 6-2 8M12 13c0 4-1 6-3 8M4 15c0 2-1 3-2 4m5-3c0 2-1 4-2 5M20 15c0 2-.3 3-1 5" /></>,
  userBadge: <><circle cx="12" cy="7" r="3" /><path d="M6 15a6 6 0 0 1 12 0v5H6ZM10 15h4m-4 3h4" /></>,
  sliders: <><path d="M4 5h4m5 0h7M4 12h9m5 0h2M4 19h2m5 0h9" /><circle cx="10.5" cy="5" r="2.5" /><circle cx="15.5" cy="12" r="2.5" /><circle cx="8.5" cy="19" r="2.5" /></>,
  more: <><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" /></>,
  mapAssets: <><rect x="3" y="3" width="6" height="6" rx="1.5" /><rect x="15" y="15" width="6" height="6" rx="1.5" /><path d="M15 3h6v6M3 15v6h6m-2-4 10-10M13 5h4v4M7 13v4h4" /></>,
  activity: <path d="M2 12h4l3-8 5 16 3-8h5" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  pause: <path d="M8 5v14M16 5v14" strokeWidth="3" />,
  'arrow-up-right': <path d="M6 18 18 6M7 6h11v11" />,
  linkedin: <><rect x="2" y="2" width="20" height="20" rx="1" fill="currentColor" stroke="none" /><path d="M7 10v7m4 0v-7m0 3c0-4 6-4 6 0v4" stroke="var(--social-cutout, #071018)" strokeWidth="2.1" /><circle cx="7" cy="6.7" r="1.2" fill="var(--social-cutout, #071018)" stroke="none" /></>,
  'x-social': <path d="m4 3 16 18h-4L2 3h4ZM20 3 4 21" strokeWidth="1.4" />,
  youtube: <><path d="M22 7c-.3-2-1-3-3-3H5C3 4 2 5 2 7v10c0 2 1 3 3 3h14c2 0 3-1 3-3V7Z" fill="currentColor" stroke="none" /><path d="m10 8 6 4-6 4V8Z" fill="var(--social-cutout, #071018)" stroke="none" /></>,
};

// Aliases for compatibility between hyphenated and camelCase usages
p['arrow'] = p.arrowRight;
p['arrow-left'] = p.arrowLeft;
p['arrow-up'] = p.arrowUp;
p['arrow-down'] = p.arrowDown;

export function Icon({ name, className = '', style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return (
    <svg className={`icon ${className}`} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p[name] ?? p.info}
    </svg>
  );
}

export function BrandMark({ className = '' }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 40 44" fill="none" aria-hidden="true">
      <path d="M20 2.5c5 3.6 10 4.8 16 4.8v11.3C36 30.9 29 37.4 20 42 11 37.4 4 30.9 4 18.6V7.3c6 0 11-1.2 16-4.8Z" stroke={`url(#${id})`} strokeWidth="4" />
      <path d="M20 12c3 2.2 5 3 8 3v5c0 4-3 7-8 10-5-3-8-6-8-10v-5c3 0 5-.8 8-3Z" fill={`url(#${id})`} />
      <path d="M20 12v18c-5-3-8-6-8-10v-5c3 0 5-.8 8-3Z" fill="#78c9ff" opacity=".45" />
      <defs>
        <linearGradient id={id} x1="4" y1="2" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00baff" /><stop offset="1" stopColor="#0767f4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#top" aria-label="CyberRiskIQ home">
      <Icon name="shield" className="brand-shield" />
      <span>CyberRisk<span className="brand-iq">IQ</span></span>
    </a>
  );
}