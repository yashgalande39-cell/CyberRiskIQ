import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from './Icons';

type ModalProps = { title: string; onClose: () => void; children: ReactNode; wide?: boolean };

export function Modal({ title, onClose, children, wide = false }: ModalProps) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panel.current) return;
      const elements = Array.from(panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]'));
      const first = elements[0];
      const last = elements[elements.length - 1];
      const focusOutside = !panel.current.contains(document.activeElement);
      if (event.shiftKey && (focusOutside || document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (focusOutside || document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', handleKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); previousFocus?.focus(); };
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className={`modal-panel ${wide ? 'modal-wide' : ''}`} ref={panel} role="dialog" aria-modal="true" aria-labelledby={id} tabIndex={-1}><h2 id={id} className="sr-only">{title}</h2><button className="modal-close icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button>{children}</div></div>;
}