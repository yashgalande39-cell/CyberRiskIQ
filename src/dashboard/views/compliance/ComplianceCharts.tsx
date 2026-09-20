import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
  ComposedChart,
  Area,
  Line,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";
import {
  frameworkScores,
  implementationStatus,
  totalControls,
  trendData,
  overallCompliance,
} from "./complianceData";

const tooltipStyle = {
  backgroundColor: "#09172a",
  border: "1px solid #1c3c63",
  borderRadius: 8,
  fontSize: 11.5,
  color: "#dbe7f5",
};

/* ================= Overall compliance circular gauge ================= */
export function ComplianceGauge({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-[86px] w-[86px] shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#122c47" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] font-extrabold leading-none text-white">{value}%</span>
      </div>
    </div>
  );
}

/* ================= Bar: Compliance score by framework ================= */
export function FrameworkScoreBar() {
  return (
    <ResponsiveContainer width="100%" height={236}>
      <BarChart data={frameworkScores} margin={{ top: 26, right: 10, left: -14, bottom: 0 }} barCategoryGap="26%">
        <defs>
          <linearGradient id="gradIso" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="gradNist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradPci" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="gradSoc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="gradCis" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#13273e" strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          dy={8}
          interval={0}
          tick={{ fontSize: 10.5, fill: "#8ea5be" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          ticks={[0, 20, 40, 60, 80, 100]}
          domain={[0, 100]}
          tick={{ fontSize: 10.5, fill: "#64809f" }}
        />
        <Tooltip
          cursor={{ fill: "rgba(56,189,248,0.06)" }}
          contentStyle={tooltipStyle}
          formatter={(v: any) => [`${v}%`, "Compliance"]}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={46}>
          {frameworkScores.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v: any) => `${v} %`}
            style={{ fill: "#dbe7f5", fontSize: 11, fontWeight: 700 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ================= Donut: Control implementation status ================= */
export function ImplementationDonut() {
  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={implementationStatus}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
              stroke="#070e1a"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {implementationStatus.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] font-extrabold leading-none text-white">{totalControls}</span>
          <span className="mt-1 text-[11px] font-medium text-[#7d94b0]">Controls</span>
        </div>
      </div>
      <ul className="space-y-3 text-[11.5px]">
        {implementationStatus.map((d) => (
          <li key={d.name} className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <div className="leading-tight">
              <div className="font-medium text-[#b8cce3]">{d.name}</div>
            </div>
            <div className="ml-3 shrink-0 text-right tabular-nums">
              <span className="font-bold text-white">{d.value}</span>{" "}
              <span className="text-[#6f88a6]">({d.pct}%)</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= Trend: Overall area + dashed target ================= */
function OverallDot(props: any) {
  const { cx, cy, index } = props;
  const last = index === trendData.length - 1;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4.2} fill="#38bdf8" stroke="#07101e" strokeWidth={1.5} />
      {last && (
        <g>
          <rect x={cx - 17} y={cy - 30} width={42} height={19} rx={4} fill="#1d4ed8" />
          <text x={cx + 4} y={cy - 17} textAnchor="middle" style={{ fontSize: 10.5, fontWeight: 700, fill: "#fff" }}>
            78%
          </text>
        </g>
      )}
    </g>
  );
}

function TargetDot(props: any) {
  const { cx, cy } = props;
  return (
    <rect
      x={cx - 3.2}
      y={cy - 3.2}
      width={6.4}
      height={6.4}
      transform={`rotate(45 ${cx} ${cy})`}
      fill="#34d399"
      opacity={0.95}
    />
  );
}

export function ComplianceTrend() {
  return (
    <ResponsiveContainer width="100%" height={236}>
      <ComposedChart data={trendData} margin={{ top: 34, right: 18, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#13273e" strokeDasharray="3 3" />
        <XAxis
          dataKey="m"
          axisLine={false}
          tickLine={false}
          dy={8}
          tick={{ fontSize: 10.5, fill: "#8ea5be" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          ticks={[0, 20, 40, 60, 80, 100]}
          domain={[0, 100]}
          tick={{ fontSize: 10.5, fill: "#64809f" }}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`]} />
        <Area
          type="monotone"
          dataKey="overall"
          stroke="#3b82f6"
          strokeWidth={2.4}
          fill="url(#trendArea)"
          dot={<OverallDot />}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#34d399"
          strokeWidth={1.8}
          strokeDasharray="6 5"
          dot={<TargetDot />}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function TrendLegend() {
  return (
    <div className="flex items-center gap-5 pt-1 text-[11px] font-medium text-[#9db4d0]">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" /> Overall
      </span>
      <span className="flex items-center gap-1.5">
        <svg width="22" height="6" viewBox="0 0 22 6">
          <line x1="0" y1="3" x2="16" y2="3" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
          <path d="M16 0.5 21 3l-5 2.5" fill="none" stroke="#34d399" strokeWidth="1.6" />
        </svg>
        Target
      </span>
    </div>
  );
}

export { overallCompliance };
