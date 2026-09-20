import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../components/Icons';

export function Panel({ title, children, action, className = '' }: { title: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return <section className={`sc-panel ${className}`}><header className="sc-panel-heading"><h2>{title}</h2>{action}</header>{children}</section>;
}

export function Badge({ value, className = '' }: { value: string; className?: string }) {
  return <span className={`sc-badge badge-${value.toLowerCase().replace(/\s+/g, '-')} ${className}`}>{value}</span>;
}

export function Checkbox({ checked, onChange, label, mixed = false }: { checked: boolean; onChange: () => void; label: string; mixed?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (input.current) input.current.indeterminate = mixed; }, [mixed]);
  return <input ref={input} className="sc-checkbox" type="checkbox" aria-label={label} checked={checked} onChange={onChange} onClick={(event) => event.stopPropagation()} />;
}

export function Select({ label, value, onChange, options, className = '' }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; className?: string }) {
  return <span className={`sc-select ${className}`}><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><Icon name="chevron" /></span>;
}

export function Popover({ trigger, label, children, className = '', width = 250 }: { trigger: ReactNode; label: string; children: (close: () => void) => ReactNode; className?: string; width?: number }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const rect = triggerRef.current!.getBoundingClientRect();
    setPosition({ top: rect.bottom + 7, left: Math.max(10, Math.min(window.innerWidth - width - 10, rect.right - width)) });
    popoverRef.current?.querySelector<HTMLElement>('button, input, select')?.focus({ preventScroll: true });
    function outside(event: MouseEvent) {
      if (!triggerRef.current?.contains(event.target as Node) && !popoverRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function keyboard(event: KeyboardEvent) { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } }
    function resize() { setOpen(false); }
    function scroll(event: Event) { if (event.target instanceof Node && !popoverRef.current?.contains(event.target)) setOpen(false); }
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', keyboard);
    document.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', resize);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', keyboard); document.removeEventListener('scroll', scroll, true); window.removeEventListener('resize', resize); };
  }, [open, width]);

  return <>
    <button ref={triggerRef} className={className} aria-label={label} aria-expanded={open} aria-controls={open ? id : undefined} onClick={(event) => { event.stopPropagation(); setOpen(!open); }}>{trigger}</button>
    {open && createPortal(<div id={id} ref={popoverRef} className="sc-popover" style={{ ...position, width }} onClick={(event) => event.stopPropagation()}>{children(() => setOpen(false))}</div>, document.body)}
  </>;
}

export function Dialog({ title, subtitle, children, onClose, wide = false }: { title: string; subtitle?: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    function keyboard(event: KeyboardEvent) {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab' || !panel.current) return;
      const elements = Array.from(panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea, [tabindex="0"]'));
      const first = elements[0];
      const last = elements[elements.length - 1];
      const outside = !panel.current.contains(document.activeElement) || document.activeElement === panel.current;
      if (event.shiftKey && (outside || document.activeElement === first)) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && (outside || document.activeElement === last)) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keyboard); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, []);

  return createPortal(<div className="sc-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div ref={panel} className={`sc-modal ${wide ? 'sc-modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}><header className="sc-modal-header"><div><h2 id={titleId}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="sc-icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button></header><div className="sc-modal-body">{children}</div></div></div>, document.body);
}

export function ProgressBar({ value, color, label }: { value: number; color?: string; label?: string }) {
  return <div className="sc-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, value)}><i style={{ width: `${Math.min(100, value)}%`, background: color }} /></div>;
}

export function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  const items: (number | string)[] = pages <= 7 ? Array.from({ length: pages }, (_, index) => index + 1) : page <= 5 ? [1, 2, 3, 4, 5, 'end-gap', pages] : page >= pages - 3 ? [1, 'start-gap', pages - 4, pages - 3, pages - 2, pages - 1, pages] : [1, 'start-gap', page - 1, page, page + 1, 'end-gap', pages];
  return <nav className="sc-pagination" aria-label="Control inventory pages"><button disabled={page === 1} onClick={() => onPage(page - 1)} aria-label="Previous page"><Icon name="chevron" className="chevron-left" /></button>{items.map((item) => typeof item === 'string' ? <span key={item}>...</span> : <button key={item} className={item === page ? 'is-current' : ''} onClick={() => onPage(item)} aria-current={item === page ? 'page' : undefined}>{item}</button>)}<button disabled={page === pages} onClick={() => onPage(page + 1)} aria-label="Next page"><Icon name="chevron" className="chevron-right" /></button></nav>;
}