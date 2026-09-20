import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Headphones,
  Link2,
  Network,
  Palette,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import '../../styles/settings.css';

export interface SettingsViewProps {
  onNav?: (tabId: string) => void;
  externalNotify?: (msg: string, kind?: 'ok' | 'info') => void;
}

type Member = { initials: string; name: string; role: string; tone: string };

const settingTabs: { label: string; icon: LucideIcon }[] = [
  { label: 'Organization', icon: Building2 },
  { label: 'Users & Access', icon: Users },
  { label: 'Security', icon: ShieldCheck },
  { label: 'Integrations', icon: Network },
  { label: 'Notifications', icon: Bell },
  { label: 'Risk Configuration', icon: SettingsIcon },
  { label: 'Appearance', icon: Palette },
  { label: 'System', icon: SettingsIcon },
];

const quickActions: { label: string; icon: LucideIcon; navTarget?: string }[] = [
  { label: 'Manage Users', icon: Users },
  { label: 'Configure Integrations', icon: Link2, navTarget: 'integrations' },
  { label: 'Set Security Policies', icon: ShieldCheck, navTarget: 'controls' },
  { label: 'Update Risk Parameters', icon: SlidersHorizontal, navTarget: 'analysis' },
  { label: 'Export Settings', icon: Download },
  { label: 'View Audit Log', icon: FileText, navTarget: 'audit' },
];

const frameworks = [
  ['ISO 27001', 'Information Security Management', 'iso', true],
  ['NIST', 'Cybersecurity Framework', 'nist', true],
  ['SOC 2', 'Service Organization Control 2', 'soc', true],
  ['PCI DSS', 'Payment Card Industry', 'pci', false],
  ['GDPR', 'General Data Protection Regulation', 'gdpr', false],
  ['HIPAA', 'Healthcare Information Security', 'hipaa', false],
] as const;

const initialMembers: Member[] = [
  { initials: 'YG', name: 'Yash Galande', role: 'CISO', tone: 'blue' },
  { initials: 'RS', name: 'R. Sharma', role: 'Security Analyst', tone: 'purple' },
  { initials: 'PM', name: 'P. Mehta', role: 'IT Admin', tone: 'pink' },
  { initials: 'AK', name: 'A. Verma', role: 'Finance Lead', tone: 'orange' },
];

function CameraIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7h3l1.5-2h9L18 7h3v12H3V7Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function MessageIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-4-.9L4 20l1.1-3.3A7.1 7.1 0 0 1 4.5 14 7.5 7.5 0 0 1 12 6.5h.5A7.5 7.5 0 0 1 20 11.5Z" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </svg>
  );
}

function FrameworkMark({ tone }: { tone: string }) {
  const mark =
    tone === 'iso'
      ? '◉'
      : tone === 'nist'
      ? 'NIST'
      : tone === 'soc'
      ? '◉'
      : tone === 'pci'
      ? '▣'
      : tone === 'gdpr'
      ? '✺'
      : '✦';
  return <span className={`framework-mark ${tone}`}>{mark}</span>;
}

function SectionHeader({ title, subtitle, onEdit }: { title: string; subtitle: string; onEdit?: () => void }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {onEdit && (
        <button type="button" className="edit-button" onClick={onEdit}>
          <Pencil size={13} /> Edit
        </button>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  select = false,
  options = [],
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  select?: boolean;
  options?: string[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {select ? (
        <span className="select-wrap">
          <select value={value} onChange={(event) => onChange(event.target.value)}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={14} />
        </span>
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function OrganizationProfile({ notify }: { notify: (message: string) => void }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: 'Galande Technologies Pvt. Ltd.',
    industry: 'Information Technology',
    size: '501 - 1,000 employees',
    revenue: '₹ 100 - 500 Cr',
    headquarters: 'Pune, Maharashtra, India',
    website: 'https://galandetech.com',
  });

  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    setEdit(false);
    notify('Organization profile saved');
  };

  return (
    <section className="settings-card profile-card">
      <SectionHeader
        title="Organization Profile"
        subtitle="Manage your organization details and basic information."
        onEdit={() => (edit ? save() : setEdit(true))}
      />
      <div className="profile-content">
        <div className="logo-upload" onClick={() => notify('Upload logo modal opened')}>
          <span>
            <CameraIcon />
          </span>
          <strong>Upload Logo</strong>
          <small>
            Supports PNG, JPG
            <br />
            (Max 2MB)
          </small>
        </div>
        <div className="fields-grid">
          <TextField label="Organization Name" value={form.name} onChange={set('name')} />
          <TextField
            label="Industry"
            value={form.industry}
            onChange={set('industry')}
            select
            options={['Information Technology', 'Financial Services', 'Healthcare', 'Manufacturing']}
          />
          <TextField
            label="Company Size"
            value={form.size}
            onChange={set('size')}
            select
            options={['1 - 50 employees', '51 - 500 employees', '501 - 1,000 employees', '1,001 - 5,000 employees']}
          />
          <TextField
            label="Annual Revenue"
            value={form.revenue}
            onChange={set('revenue')}
            select
            options={['₹ 10 - 100 Cr', '₹ 100 - 500 Cr', '₹ 500 - 1,000 Cr']}
          />
          <TextField label="Headquarters" value={form.headquarters} onChange={set('headquarters')} />
          <TextField label="Website" value={form.website} onChange={set('website')} />
        </div>
      </div>
      {edit && <div className="edit-notice">Editing profile details. Click Edit again to save changes.</div>}
    </section>
  );
}

function Subscription({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="settings-card subscription-card">
      <SectionHeader title="Subscription & Plan" subtitle="Manage your plan, usage and billing details." />
      <div className="plan-card">
        <span className="plan-crown">♛</span>
        <div>
          <strong>Enterprise Plan</strong>
          <small>Full access to all features</small>
        </div>
        <em>Active</em>
      </div>
      <div className="plan-stats">
        <div>
          <span>Next Billing Date</span>
          <b>Jul 15, 2024</b>
        </div>
        <div>
          <span>Users</span>
          <b>24 / 50</b>
        </div>
        <div>
          <span>Data Retention</span>
          <b>180 days</b>
        </div>
        <div>
          <span>Storage Used</span>
          <b>42 GB / 500 GB</b>
        </div>
      </div>
      <div className="plan-actions">
        <button type="button" className="billing" onClick={() => notify('Billing portal opened')}>
          Manage Billing <ArrowRight size={14} />
        </button>
        <button type="button" onClick={() => notify('Usage details opened')}>
          View Usage
        </button>
      </div>
    </section>
  );
}

function QuickActions({
  notify,
  onNav,
}: {
  notify: (message: string) => void;
  onNav?: (tabId: string) => void;
}) {
  return (
    <section className="settings-card quick-card">
      <SectionHeader title="Quick Actions" subtitle="" />
      <div className="quick-list">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              type="button"
              key={action.label}
              onClick={() => {
                if (action.navTarget && onNav) {
                  onNav(action.navTarget);
                } else {
                  notify(`${action.label} opened`);
                }
              }}
            >
              <span>
                <Icon size={16} />
              </span>
              {action.label}
              <ChevronRight size={15} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BusinessDetails({ notify }: { notify: (message: string) => void }) {
  const [units, setUnits] = useState(['IT', 'Finance', 'Operations', 'HR']);
  const [form, setForm] = useState({
    contact: 'Yash Galande',
    email: 'yash.galande@galandetech.com',
    phone: '+91 82650 63624',
    address: 'Baner, Pune,\nMaharashtra - 411045, India',
  });
  const [editing, setEditing] = useState(false);
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <section className="settings-card business-card">
      <SectionHeader
        title="Business Details"
        subtitle="Additional information about your organization."
        onEdit={() => {
          setEditing((current) => !current);
          if (editing) notify('Business details saved');
        }}
      />
      <div className="business-row">
        <span>Business Units</span>
        <div className="chips">
          {units.map((unit) => (
            <button
              type="button"
              key={unit}
              onClick={() => setUnits((current) => current.filter((item) => item !== unit))}
            >
              {unit}
            </button>
          ))}
          <button
            type="button"
            className="add-chip"
            onClick={() => setUnits((current) => [...current, `Unit ${current.length + 1}`])}
          >
            + Add
          </button>
        </div>
      </div>
      <TextField label="Primary Contact" value={form.contact} onChange={set('contact')} />
      <TextField label="Contact Email" value={form.email} onChange={set('email')} />
      <TextField label="Contact Phone" value={form.phone} onChange={set('phone')} />
      <label className="field">
        <span>Address</span>
        <textarea value={form.address} onChange={(event) => set('address')(event.target.value)} />
      </label>
      {editing && <div className="edit-notice">Editing business details. Click Edit again to save.</div>}
    </section>
  );
}

function ComplianceFrameworks({ notify }: { notify: (message: string) => void }) {
  const [enabled, setEnabled] = useState(frameworks.map((item) => item[3]));

  return (
    <section className="settings-card frameworks-card">
      <SectionHeader
        title="Compliance Frameworks"
        subtitle="Select applicable compliance frameworks."
        onEdit={() => notify('Compliance frameworks are editable')}
      />
      <div className="framework-list">
        {frameworks.map(([name, desc, tone], index) => (
          <button
            type="button"
            key={name}
            className="framework-row"
            onClick={() =>
              setEnabled((current) => current.map((value, i) => (i === index ? !value : value)))
            }
          >
            <span className={`check-box ${enabled[index] ? 'checked' : ''}`}>
              {enabled[index] && <Check size={12} />}
            </span>
            <FrameworkMark tone={tone} />
            <b>{name}</b>
            <small>{desc}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function DataRetention({ notify }: { notify: (message: string) => void }) {
  const [anonymize, setAnonymize] = useState(true);

  return (
    <section className="settings-card retention-card">
      <SectionHeader
        title="Data & Retention"
        subtitle="Configure data retention and privacy settings."
        onEdit={() => notify('Data retention settings unlocked')}
      />
      <div className="retention-grid">
        <TextField
          label="Log Retention Period"
          value="180 days"
          onChange={() => undefined}
          select
          options={['90 days', '180 days', '1 year']}
        />
        <TextField
          label="Vulnerability Data Retention"
          value="2 years"
          onChange={() => undefined}
          select
          options={['1 year', '2 years', '5 years']}
        />
        <TextField
          label="Audit Log Retention"
          value="1 year"
          onChange={() => undefined}
          select
          options={['6 months', '1 year', '2 years']}
        />
        <TextField
          label="Data Residency"
          value="India (ap-south-1)"
          onChange={() => undefined}
          select
          options={['India (ap-south-1)', 'US (us-east-1)', 'EU (eu-west-1)']}
        />
      </div>
      <div className="anonymize">
        <span>Anonymize Data</span>
        <button
          type="button"
          className={`toggle ${anonymize ? 'on' : ''}`}
          onClick={() => {
            setAnonymize((current) => !current);
            notify(`Anonymize data ${anonymize ? 'disabled' : 'enabled'}`);
          }}
        >
          <i />
        </button>
        <b>{anonymize ? 'Enabled' : 'Disabled'}</b>
        <span className="info-circle" title="Data anonymization masks PII before export or storage">
          i
        </span>
      </div>
    </section>
  );
}

function DangerZone({ onDelete }: { onDelete: () => void }) {
  return (
    <section className="settings-card danger-card">
      <h2>Danger Zone</h2>
      <p>Irreversible and sensitive actions.</p>
      <div className="danger-action">
        <AlertTriangle size={24} />
        <div>
          <strong>Delete Organization</strong>
          <span>Permanently delete your organization and all associated data. This action cannot be undone.</span>
        </div>
        <button type="button" onClick={onDelete}>
          Delete Organization
        </button>
      </div>
    </section>
  );
}

function Members({ notify }: { notify: (message: string) => void }) {
  const [memberList, setMemberList] = useState(initialMembers);

  return (
    <section className="settings-card members-card">
      <div className="members-head">
        <div>
          <h2>Organization Members</h2>
          <p>Manage key members in your organization.</p>
        </div>
        <button type="button" onClick={() => notify('User management opened')}>
          Manage Users <ArrowRight size={13} />
        </button>
      </div>
      <div className="members-grid">
        {memberList.map((member) => (
          <button
            type="button"
            className="member"
            key={member.initials}
            onClick={() => notify(`${member.name} profile opened`)}
          >
            <span className={`member-avatar ${member.tone}`}>{member.initials}</span>
            <strong>{member.name}</strong>
            <small>{member.role}</small>
            <em>
              <i />
              Active
            </em>
          </button>
        ))}
        <button
          type="button"
          className="member invite"
          onClick={() => {
            setMemberList((current) => [
              ...current,
              { initials: 'NM', name: 'New Member', role: 'Pending invite', tone: 'blue' },
            ]);
            notify('Member invitation created');
          }}
        >
          <span className="invite-circle">
            <Plus size={23} />
          </span>
          <strong>Invite Member</strong>
        </button>
      </div>
    </section>
  );
}

function HelpCard({ notify }: { notify: (message: string) => void }) {
  const actions = [
    [FileText, 'View Documentation'],
    [Headphones, 'Contact Support'],
    [MessageIcon, 'Submit Feedback'],
  ] as const;

  return (
    <section className="settings-card help-card">
      <h2>Need Help?</h2>
      <p>Get support or access documentation.</p>
      <div>
        {actions.map(([Icon, label]) => (
          <button type="button" key={label} onClick={() => notify(`${label} opened`)}>
            <Icon size={16} />
            {label}
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
    </section>
  );
}

function ConfirmModal({ close, confirm }: { close: () => void; confirm: () => void }) {
  return (
    <motion.div
      className="settings-modal-backdrop"
      onMouseDown={close}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="confirm-modal"
        onMouseDown={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
      >
        <button type="button" className="close-modal" onClick={close} aria-label="Close modal">
          <X size={18} />
        </button>
        <span className="modal-danger">
          <AlertTriangle size={27} />
        </span>
        <h2>Delete Organization?</h2>
        <p>
          This is an irreversible action. All organization data, connected sources, reports, and settings will be
          permanently deleted.
        </p>
        <div>
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button type="button" className="confirm-delete" onClick={confirm}>
            Delete Organization
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SettingsView({ onNav, externalNotify }: SettingsViewProps) {
  const [toast, setToast] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [activeTab, setActiveTab] = useState('Organization');

  const notify = (message: string, kind: 'ok' | 'info' = 'ok') => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
    if (externalNotify) externalNotify(message, kind);
  };

  return (
    <div className="settings-page">
      {/* Standard Header matching Security Controls */}
      <header className="sc-page-header">
        <div>
          <p className="sc-breadcrumb">Home &gt; Admin &gt; <span>Settings</span></p>
          <h1>Platform Settings &amp; Governance</h1>
          <p>Manage your organization profile, users, authentication controls, risk calculation parameters, and system configuration.</p>
        </div>
        <div className="sc-header-actions">
          <div className="sc-motto">
            <span>CONFIGURE TODAY</span>
            <span>FOR A SAFER</span>
            <span>TOMORROW</span>
          </div>
        </div>
      </header>

      {/* Standard Tabs matching Security Controls */}
      <nav className="detail-tabs" style={{ marginBottom: '14px', borderBottom: '1px solid var(--sc-border, #06314a)' }}>
        {settingTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              type="button"
              className={activeTab === tab.label ? 'is-active' : ''}
              onClick={() => {
                setActiveTab(tab.label);
                if (tab.label !== 'Organization') notify(`${tab.label} settings selected`);
              }}
              key={tab.label}
            >
              <Icon size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Settings Grid Layout */}
      <div className="settings-layout">
        {/* Top Grid: Organization Profile, Subscription & Plan, Quick Actions */}
        <div className="top-settings-grid">
          <OrganizationProfile notify={notify} />
          <Subscription notify={notify} />
          <QuickActions notify={notify} onNav={onNav} />
        </div>

        {/* Middle Grid: Business Details, Compliance Frameworks, Data & Retention */}
        <div className="middle-settings-grid">
          <BusinessDetails notify={notify} />
          <ComplianceFrameworks notify={notify} />
          <DataRetention notify={notify} />
        </div>

        {/* Bottom Grid: Danger Zone, Organization Members, Need Help */}
        <div className="bottom-settings-grid">
          <DangerZone onDelete={() => setDeleteOpen(true)} />
          <Members notify={notify} />
          <HelpCard notify={notify} />
        </div>
      </div>

      {/* Confirm Deletion Modal */}
      <AnimatePresence>
        {deleteOpen && (
          <ConfirmModal
            close={() => setDeleteOpen(false)}
            confirm={() => {
              setDeleteOpen(false);
              setDeleted(true);
              notify('Organization deletion scheduled');
            }}
          />
        )}
      </AnimatePresence>

      {/* Deletion Banner */}
      <AnimatePresence>
        {deleted && (
          <motion.div
            className="deleted-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertTriangle size={16} /> Deletion is scheduled. Contact support to cancel.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Sparkles size={14} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
