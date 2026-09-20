import { useState, type FormEvent } from 'react';
import { Icon } from './Icons';

export type DemoKind = 'demo' | 'expert' | 'pricing';
type DemoRequest = { name: string; email: string; company: string; role: string; message: string; interest: DemoKind; createdAt: string };

export function DemoForm({ kind }: { kind: DemoKind }) {
  const [request, setRequest] = useState<DemoRequest | null>(null);
  const [draft, setDraft] = useState<DemoRequest | null>(null);
  const [stored, setStored] = useState(true);
  const copy = {
    demo: { eyebrow: 'SEE THE BIGGER PICTURE', title: 'Your next step toward clarity.', description: 'Explore how CyberRiskIQ turns your cyber risk into confident business decisions.', button: 'Request a Demo' },
    expert: { eyebrow: 'LET\'S TALK CYBER RISK', title: 'Better decisions start here.', description: 'Tell us what is on your mind. Shape a conversation around your organization\'s security priorities.', button: 'Prepare My Inquiry' },
    pricing: { eyebrow: 'A PLAN BUILT FOR YOU', title: 'The right fit. The right impact.', description: 'Your business is unique. Share a few details to prepare a tailored CyberRiskIQ pricing inquiry.', button: 'Request Pricing' },
  }[kind];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextRequest: DemoRequest = { name: String(form.get('name')).trim(), email: String(form.get('email')).trim(), company: String(form.get('company')).trim(), role: String(form.get('role')), message: String(form.get('message')).trim(), interest: kind, createdAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem('cyberriskiq-requests') || '[]');
      localStorage.setItem('cyberriskiq-requests', JSON.stringify([...(Array.isArray(existing) ? existing : []), nextRequest]));
      setStored(true);
    } catch { setStored(false); }
    setDraft(nextRequest);
    setRequest(nextRequest);
  }

  function downloadRequest() {
    if (!request) return;
    const text = `CyberRiskIQ | ${kind === 'pricing' ? 'Pricing inquiry' : kind === 'expert' ? 'Expert inquiry' : 'Demo request'}\n\nName: ${request.name}\nWork email: ${request.email}\nCompany: ${request.company}\nRole: ${request.role}\nMessage: ${request.message || 'Not provided'}\nCreated: ${new Date(request.createdAt).toLocaleString()}\n\nThis request was prepared in the CyberRiskIQ website preview. It has not been sent or scheduled.`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CyberRiskIQ-request.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (request) return <div className="request-success" aria-live="polite"><span className="success-icon"><Icon name="check" /></span><p className="eyebrow">A SMARTER NEXT STEP</p><h3>Your request is ready, {request.name.split(' ')[0]}.</h3><p>{stored ? 'Your details have been saved in this browser.' : 'Your details are ready to download.'} Download your request to keep or share with your team.</p><div className="request-summary"><span>{request.company}</span><strong>{request.email}</strong><span>{request.role}</span></div><button className="button button-white" onClick={downloadRequest}>Download Request <Icon name="download" /></button><p className="form-note">This website preview does not send emails or book meetings. Your information has not been sent to a server.</p><button className="text-button" onClick={() => setRequest(null)}>Edit my request <Icon name="arrow" /></button></div>;

  return <div className="demo-content"><p className="eyebrow">{copy.eyebrow}</p><h3>{copy.title}</h3><p className="modal-description">{copy.description}</p><form className="demo-form" onSubmit={submit}>
    <div className="form-row"><label>Full name<input name="name" autoComplete="name" placeholder="Your full name" required minLength={2} maxLength={100} pattern={'.*\\S.*'} defaultValue={draft?.name} /></label><label>Work email<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={150} defaultValue={draft?.email} /></label></div>
    <div className="form-row"><label>Company<input name="company" autoComplete="organization" placeholder="Organization name" required minLength={2} maxLength={150} pattern={'.*\\S.*'} defaultValue={draft?.company} /></label><label>Your role<select name="role" required defaultValue={draft?.role || ''}><option value="" disabled>Select your role</option><option>Security Analyst</option><option>CISO / Security Leader</option><option>Finance Manager</option><option>IT Administrator</option><option>Business Leader</option><option>Other</option></select></label></div>
    <label>What would you like to explore? <span className="optional">(optional)</span><textarea name="message" placeholder="Tell us about your priorities..." rows={3} maxLength={2000} defaultValue={draft?.message} /></label>
    <label className="consent"><input type="checkbox" required defaultChecked={Boolean(draft)} /><span>I agree to save this request on this device.</span></label>
    <button className="button button-white form-submit" type="submit">{copy.button}<Icon name="arrow" /></button><p className="form-note">Preview mode: requests are saved locally and can be downloaded. No information is sent to a server.</p>
  </form></div>;
}