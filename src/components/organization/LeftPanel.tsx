import { ShieldCheck, Shield, UserRoundCheck } from "lucide-react";

const points = [
  { icon: UserRoundCheck, text: ["Personalized risk insights", "for your business"] },
  { icon: ShieldCheck, text: ["Aligned with global", "compliance standards"] },
  { icon: Shield, text: ["Start your journey to", "a more resilient future"] },
];

export function LeftPanel() {
  return (
    <aside className="left-panel">
      <div className="left-bg" />
      <div className="left-inner">
        <div className="left-eyebrow">Build a safer tomorrow</div>
        <h1>Set up your organization</h1>
        <p>Provide a few key details about your organization so we can deliver accurate risk insights, tailored recommendations, and measurable business impact.</p>
        <ul>
          {points.map(({ icon: Icon, text }) => (
            <li key={text[0]}>
              <span><Icon size={15} /></span>
              <div>{text[0]}<br />{text[1]}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="left-foot">
        Different data.
        <br />
        One clarity.
        <i />
      </div>
    </aside>
  );
}
