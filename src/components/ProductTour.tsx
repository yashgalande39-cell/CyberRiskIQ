import { useEffect, useState } from 'react';
import { Icon, type IconName } from './Icons';

const scenes: { title: string; description: string; icon: IconName; label: string }[] = [
  { title: 'See the risk. In real time.', description: 'Bring assets, vulnerabilities, threats, and controls into one clear picture.', icon: 'activity', label: 'Continuous Risk Monitoring' },
  { title: 'Know what is at stake.', description: 'Translate technical exposure into financial impact your entire business understands.', icon: 'database', label: 'Financial Impact Modeling' },
  { title: 'Invest where it matters.', description: 'Prioritize the actions that reduce the most risk and make every security investment count.', icon: 'bulb', label: 'AI-Powered Optimization' },
  { title: 'One platform. Shared confidence.', description: 'Give security teams and business leaders a common language for better decisions.', icon: 'building', label: 'Explainable Insights' },
];

export function ProductTour({ initialScene = 0 }: { initialScene?: number }) {
  const [time, setTime] = useState(initialScene * 8);
  const [playing, setPlaying] = useState(true);
  const scene = Math.min(3, Math.floor(time / 8));
  const current = scenes[scene];
  const finished = time >= 32;
  useEffect(() => {
    if (!playing || finished) return;
    const interval = window.setInterval(() => setTime((previous) => Math.min(32, previous + 0.25)), 250);
    return () => clearInterval(interval);
  }, [playing, finished]);
  const isPlaying = playing && !finished;
  function togglePlaying() { if (time >= 32) { setTime(0); setPlaying(true); } else setPlaying(!playing); }

  return <div className="product-tour"><div className="tour-visual"><img src="/images/hero-laptop.jpg" alt="CyberRiskIQ executive dashboard on a laptop in a mountain landscape" /><div className="tour-brand"><Icon name="shield" /><span>CyberRisk<span>IQ</span></span></div><div className="tour-scene" key={scene}><span className="tour-chapter">0{scene + 1} / THE BIGGER PICTURE</span><h3>{current.title}</h3><p>{current.description}</p></div></div>
    <div className="tour-tabs" role="group" aria-label="Product tour chapters">{scenes.map((item, index) => <button key={item.title} aria-pressed={index === scene} className={index === scene ? 'active' : ''} onClick={() => { setTime(index * 8); setPlaying(true); }}><Icon name={item.icon} /><span>{item.label}</span></button>)}</div>
    <div className="tour-controls"><button className="icon-button" onClick={togglePlaying} aria-label={isPlaying ? 'Pause product tour' : time >= 32 ? 'Replay product tour' : 'Play product tour'}><Icon name={isPlaying ? 'pause' : 'play'} /></button><input type="range" aria-label="Product tour progress" min={0} max={32} step={0.25} value={time} onChange={(event) => setTime(Number(event.target.value))} /><span>0:{String(Math.floor(time)).padStart(2, '0')} / 0:32</span></div>
  </div>;
}