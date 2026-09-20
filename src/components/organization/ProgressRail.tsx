import { Check, ShieldCheck } from "lucide-react";

export const steps = [
  { id: 1, title: "Organization", sub: "Basic information" },
  { id: 2, title: "Risk Parameters", sub: "Budget & compliance" },
  { id: 3, title: "Assets", sub: "Connect your data" },
];

export function ProgressRail({ current, done, goTo }: { current: number; done: number[]; goTo: (s: number) => void }) {
  return (
    <aside className="rail">
      <div className="rail-bg" />
      <div className="rail-inner">
        <h2>Setup Progress</h2>
        <ol>
          {steps.map((step, i) => {
            const complete = done.includes(step.id) && step.id !== current;
            const active = step.id === current;
            return (
              <li key={step.id} className={active ? "active" : complete ? "complete" : ""}>
                {i > 0 && <span className="rail-line" />}
                <button
                  type="button"
                  className="rail-step"
                  onClick={() => (step.id < current || done.includes(step.id)) && goTo(step.id)}
                  disabled={step.id > current && !done.includes(step.id)}
                >
                  <span className="rail-dot">{complete ? <Check size={13} strokeWidth={3} /> : step.id}</span>
                  <span className="rail-copy">
                    <b>{step.title}</b>
                    <small>{step.sub}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="secure-card">
          <span><ShieldCheck size={17} /></span>
          <div>
            <b>Your data is secure</b>
            <p>We use industry-leading encryption to keep your information safe.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
