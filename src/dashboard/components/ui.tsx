import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icons';
import { statusTone, type Status } from '../data';

export function Panel({ title, action, children, className = '', info }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; info?: string }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <header className="panel-head">
          <h2>{title}{info && <button className="info-btn" title={info} aria-label={`${title} details`}><Icon name="info" /></button>}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatusChip({ status }: { status: Status }) {
  return <span className={`chip chip-${statusTone[status]}`}>{status}</span>;
}

export function Delta({ dir, value }: { dir: 'up' | 'down'; value: string }) {
  return <span className={`delta ${dir}`}><Icon name={dir === 'up' ? 'arrowUp' : 'arrowDown'} className="delta-icon" />{value}</span>;
}

export function useOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handle(event: MouseEvent) { if (ref.current && !ref.current.contains(event.target as Node)) onClose(); }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') onClose(); }
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('keydown', escape); };
  }, [onClose]);
  return ref;
}

export function Dropdown({ button, children, align = 'right', width = 260 }: { button: (open: boolean) => ReactNode; children: (close: () => void) => ReactNode; align?: 'left' | 'right'; width?: number }) {
  const [open, setOpen] = useState(false);
  const ref = useOutside<HTMLDivElement>(() => setOpen(false));
  const close = () => setOpen(false);
  return (
    <div className={`dd ${align === 'left' ? 'dd-left' : ''}`} ref={ref}>
      <button className="dd-trigger" onClick={() => setOpen(!open)} aria-expanded={open}>{button(open)}</button>
      {open && <div className="dd-menu" style={{ width }} role="menu">{children(close)}</div>}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') onClose(); }
    document.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', escape); previous?.focus(); };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" /></button></header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function Toasts({ items, onDismiss }: { items: { id: number; text: string; kind: 'ok' | 'info' }[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toasts" aria-live="polite">
      {items.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.kind}`}>
          <Icon name={toast.kind === 'ok' ? 'check' : 'info'} />
          <span>{toast.text}</span>
          <button onClick={() => onDismiss(toast.id)} aria-label="Dismiss"><Icon name="close" /></button>
        </div>
      ))}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export function EmptyHint({ text }: { text: string }) {
  return <p className="empty-hint"><Icon name="info" />{text}</p>;
}
