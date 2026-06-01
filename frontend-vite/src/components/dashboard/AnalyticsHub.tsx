import { useMemo, useState, type ElementType } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  ChevronDown,
  Download,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Moon,
  Salad,
  
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

type OverviewMetric = {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  change: string;
  color: string;
  icon: ElementType;
  ring?: number;
};

type Micro = {
  name: string;
  value: number;
  status?: string;
};

type Insight = {
  id: string;
  icon: ElementType;
  title: string;
  description: string;
  color: string;
};

const tabs = [
  { id: "overview", label: "Overview", icon: Brain },
  { id: "nutrition", label: "Nutrition", icon: Salad },
  { id: "macros", label: "Macros", icon: BarChart3 },
  { id: "micros", label: "Micronutrients", icon: ShieldCheck },
  { id: "hydration", label: "Hydration", icon: Droplets },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "metabolic", label: "Metabolic Health", icon: HeartPulse },
];

const overviewMetrics: OverviewMetric[] = [
  {
    id: "nutrition",
    label: "Avg. Nutrition Score",
    value: "86",
    subValue: "/100",
    change: "↑ 7% vs last week",
    color: "#A6FF4D",
    icon: Brain,
    ring: 86,
  },
  {
    id: "calories",
    label: "Avg. Calories",
    value: "1,842",
    subValue: "kcal",
    change: "↓ 120 kcal vs last week",
    color: "#FFB347",
    icon: Flame,
  },
  {
    id: "protein",
    label: "Protein Consistency",
    value: "82%",
    change: "↑ 12% vs last week",
    color: "#7BE929",
    icon: Salad,
  },
  {
    id: "hydration",
    label: "Hydration Avg.",
    value: "2.4 L",
    subValue: "/ 3.0 L",
    change: "80% of goal",
    color: "#18D3D0",
    icon: Droplets,
  },
  {
    id: "sleep",
    label: "Sleep Avg.",
    value: "7h 48m",
    change: "↑ 35m vs last week",
    color: "#A875FF",
    icon: Moon,
  },
  {
    id: "steps",
    label: "Steps Avg.",
    value: "8,240",
    change: "↑ 1,120 vs last week",
    color: "#7BE929",
    icon: Footprints,
  },
];

const micros: Micro[] = [
  { name: "Vitamin D", value: 72 },
  { name: "Iron", value: 88 },
  { name: "Calcium", value: 76 },
  { name: "Vitamin B12", value: 92 },
  { name: "Magnesium", value: 69 },
  { name: "Omega 3", value: 55, status: "Low" },
];

const keyInsights: Insight[] = [
  {
    id: "calorie",
    icon: Flame,
    title: "You had a calorie deficit",
    description: "5 of 7 days this week. Great for fat loss! 🔥",
    color: "#FFB347",
  },
  {
    id: "protein",
    icon: Zap,
    title: "Protein intake is improving.",
    description: "Keep it consistent for better muscle retention.",
    color: "#A6FF4D",
  },
  {
    id: "hydration",
    icon: Droplets,
    title: "Hydration is 80% of goal.",
    description: "Try hitting 3L daily for better energy & skin.",
    color: "#18D3D0",
  },
  {
    id: "sleep",
    icon: Moon,
    title: "Sleep quality improving!",
    description: "Consistent sleep boosts recovery & metabolism.",
    color: "#A875FF",
  },
];

export default function AnalyticsHub() {
  const [activeTab, setActiveTab] = useState("overview");
  const [range, setRange] = useState("12 May – 18 May 2024");
  const [reportGenerated, setReportGenerated] = useState(false);

  const activeTabLabel = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.label ?? "Overview",
    [activeTab],
  );

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          
          <Header range={range} setRange={setRange} />

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <OverviewStrip activeTabLabel={activeTabLabel} />

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.92fr_0.98fr]">
            <CalorieTrend />
            <MacroDistribution />
            <MicronutrientCoverage />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.86fr_1fr]">
            <NutritionScoreTrend />
            <HydrationTracker />
            <SleepQualityTrend />
          </div>

          <KeyInsights
            reportGenerated={reportGenerated}
            onGenerate={() => setReportGenerated(true)}
          />
        </div>
      </div>
    </section>
  );
}


       

      <div className="flex items-center gap-5">
        <div className="relative text-white/85">
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#A6FF4D]" />
          <span className="text-[22px]">♧</span>
        </div>

        <img
          src="/assets/avatar-1.png"
          alt="Isha"
          className="h-10 w-10 rounded-full border border-white/20 object-cover"
        />

        <button className="flex items-center gap-2 text-[15px] font-black text-white">
          Isha <ChevronDown size={16} />
        </button>
      </div>

function Header({
  range,
  setRange,
}: {
  range: string;
  setRange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        

        <div>
          <h2 className="flex items-center gap-3 text-[28px] font-black uppercase leading-none tracking-[0.02em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
            Analytics Hub
            <Sparkles className="text-[#A6FF4D]" size={24} />
          </h2>

          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
            Deep insights into your nutrition, health & lifestyle patterns.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-bold text-white/85">
          <CalendarDays size={17} />
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="bg-transparent text-white outline-none"
          >
            <option className="bg-[#07110A]">12 May – 18 May 2024</option>
            <option className="bg-[#07110A]">19 May – 25 May 2024</option>
            <option className="bg-[#07110A]">This Month</option>
          </select>
          <ChevronDown size={15} />
        </label>

        <button className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white transition hover:border-[#A6FF4D]/40 hover:text-[#A6FF4D]">
          <Download size={17} />
          Export Report
        </button>
      </div>
    </div>
  );
}

function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-bold transition ${
              isActive
                ? "border-[#A6FF4D]/25 bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_22px_rgba(166,255,77,.12)]"
                : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function OverviewStrip({ activeTabLabel }: { activeTabLabel: string }) {
  return (
    <div className="mt-5 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="mb-5 text-[15px] font-black uppercase tracking-[0.12em] text-[#A6FF4D]">
        This Week Overview · {activeTabLabel}
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {overviewMetrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.id}
              className={`flex items-center gap-4 ${
                index !== overviewMetrics.length - 1
                  ? "xl:border-r xl:border-white/10"
                  : ""
              }`}
            >
              {metric.ring ? (
                <div
                  className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(${metric.color} ${
                      metric.ring * 3.6
                    }deg, rgba(255,255,255,.1) 0deg)`,
                  }}
                >
                  <div className="grid h-[44px] w-[44px] place-items-center rounded-full bg-[#07110A]">
                    <span className="text-[16px] font-black text-[#A6FF4D]">
                      {metric.value}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border bg-white/[0.04]"
                  style={{
                    borderColor: `${metric.color}35`,
                    color: metric.color,
                    boxShadow: `0 0 24px ${metric.color}22`,
                  }}
                >
                  <Icon size={22} />
                </div>
              )}

              <div>
                <p className="text-[12px] text-white/70">{metric.label}</p>
                <p className="mt-1 text-[24px] font-black leading-none text-white">
                  {metric.ring ? metric.value : metric.value}
                  {metric.subValue && (
                    <span className="ml-1 text-[16px] font-medium text-white/65">
                      {metric.subValue}
                    </span>
                  )}
                </p>
                <p
                  className="mt-2 text-[11px] font-semibold"
                  style={{ color: metric.color }}
                >
                  {metric.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalorieTrend() {
  const points = [1200, 1500, 1700, 1650, 1600, 1980, 1780, 1350, 1842];

  return (
    <ChartCard title="Calorie Intake Trend" action="This Week">
      <div className="relative h-[230px]">
        <svg viewBox="0 0 520 230" className="h-full w-full overflow-visible">
          {[0, 1, 2, 3].map((line) => (
            <line
              key={line}
              x1="38"
              x2="500"
              y1={40 + line * 45}
              y2={40 + line * 45}
              stroke="rgba(255,255,255,.08)"
              strokeDasharray="4 6"
            />
          ))}

          <polyline
            points={points
              .map((value, index) => {
                const x = 45 + index * 54;
                const y = 190 - ((value - 900) / 1300) * 145;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#A6FF4D"
            strokeWidth="3"
            filter="drop-shadow(0 0 10px rgba(166,255,77,.65))"
          />

          <path
            d={`M 45,190 ${points
              .map((value, index) => {
                const x = 45 + index * 54;
                const y = 190 - ((value - 900) / 1300) * 145;
                return `L ${x},${y}`;
              })
              .join(" ")} L 477,190 Z`}
            fill="rgba(166,255,77,.12)"
          />

          {points.map((value, index) => {
            const x = 45 + index * 54;
            const y = 190 - ((value - 900) / 1300) * 145;
            return <circle key={index} cx={x} cy={y} r="5" fill="#A6FF4D" />;
          })}

          <line
            x1="38"
            x2="500"
            y1="108"
            y2="108"
            stroke="#18D3D0"
            strokeDasharray="5 6"
          />
          <text x="220" y="102" fill="#18D3D0" fontSize="13">
            2100 kcal
          </text>

          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (label, index) => (
              <text
                key={label}
                x={55 + index * 64}
                y="220"
                fill="rgba(255,255,255,.7)"
                fontSize="13"
              >
                {label}
              </text>
            ),
          )}
        </svg>

        <div className="absolute right-2 top-10 rounded-xl bg-[#A6FF4D]/15 px-3 py-2 text-[13px] font-black text-white">
          1,842 kcal
        </div>
      </div>

      <p className="mt-3 text-[13px] text-white/70">
        ✧ You stayed within your calorie goal{" "}
        <span className="font-black text-[#A6FF4D]">5 of 7</span> days.
      </p>
    </ChartCard>
  );
}

function MacroDistribution() {
  return (
    <ChartCard title="Macro Distribution">
      <div className="grid items-center gap-5 md:grid-cols-[190px_1fr]">
        <div className="relative mx-auto h-[170px] w-[170px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(#20E4A5 0deg 100deg,#18D3D0 100deg 252deg,#FFB347 252deg 360deg)",
            }}
          />
          <div className="absolute inset-[22px] grid place-items-center rounded-full bg-[#07110A] text-center">
            <p className="text-[14px] text-white/75">Daily Avg</p>
            <p className="mt-1 text-[12px] font-black text-white">P • C • F</p>
            <p className="mt-1 text-[15px] font-black text-white">
              28 • 42 • 30
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <MacroLegend color="#20E4A5" label="Protein" value="118g (28%)" />
          <MacroLegend color="#18D3D0" label="Carbs" value="178g (42%)" />
          <MacroLegend color="#FFB347" label="Fats" value="58g (30%)" />
        </div>
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#A6FF4D]">◉</span>
        Your macros are well balanced
      </p>
    </ChartCard>
  );
}

function MacroLegend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-3 text-[13px] text-white/80">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        {label}
      </p>

      <p className="text-[13px] font-bold text-white">{value}</p>

      <span className="rounded-lg bg-[#A6FF4D]/10 px-3 py-1 text-[11px] font-black text-[#A6FF4D]">
        Good
      </span>
    </div>
  );
}

function MicronutrientCoverage() {
  return (
    <ChartCard title="Micronutrient Coverage" action="View All">
      <div className="space-y-4">
        {micros.map((micro) => (
          <div key={micro.name} className="grid grid-cols-[100px_1fr_44px] items-center gap-4">
            <p className="text-[13px] font-medium text-white/85">
              {micro.name}
            </p>

            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7BE929] to-[#A6FF4D] shadow-[0_0_18px_rgba(166,255,77,.25)]"
                style={{ width: `${micro.value}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <p className="text-[12px] text-white/75">{micro.value}%</p>
              {micro.status && (
                <span className="rounded-md bg-[#FFB347]/10 px-2 py-1 text-[10px] font-black text-[#FFB347]">
                  {micro.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#A6FF4D]">ⓘ</span>
        Based on your intake this week
      </p>
    </ChartCard>
  );
}

function NutritionScoreTrend() {
  const data = [72, 75, 81, 85, 88, 83, 92];

  return (
    <ChartCard title="Nutrition Score Over Time">
      <LineChart
        data={data}
        color="#A6FF4D"
        labels={["12 May", "13 May", "14 May", "15 May", "16 May", "17 May", "18 May"]}
        suffix=""
      />
      <p className="mt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#A6FF4D]">✩</span>
        Great progress! Your nutrition score is improving consistently.
      </p>
    </ChartCard>
  );
}

function HydrationTracker() {
  const values = [2.1, 2.6, 2.2, 2.8, 2.5, 2.9, 2.4];

  return (
    <ChartCard title="Hydration Tracker">
      <div className="relative h-[220px]">
        <p className="absolute right-0 top-0 text-[13px] font-black text-[#18D3D0]">
          Goal: 3.0 L
        </p>

        <div className="flex h-full items-end gap-6 border-b border-white/10 px-5 pt-9">
          {values.map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <p className="text-[12px] font-bold text-white">{value}L</p>
              <div
                className="w-7 rounded-t-lg bg-gradient-to-t from-[#0899A5] to-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.35)]"
                style={{ height: `${value * 42}px` }}
              />
              <span className="text-[11px] text-white/60">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#18D3D0]">♢</span>
        Best day: Saturday (2.9 L)
      </p>
    </ChartCard>
  );
}

function SleepQualityTrend() {
  const data = [72, 75, 78, 82, 85, 80, 87];

  return (
    <ChartCard title="Sleep Quality Trend" titleColor="#B47CFF">
      <LineChart
        data={data}
        color="#B47CFF"
        labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      />
      <p className="mt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#B47CFF]">☾</span>
        Your sleep quality is excellent!
      </p>
    </ChartCard>
  );
}

function LineChart({
  data,
  color,
  labels,
}: {
  data: number[];
  color: string;
  labels: string[];
  suffix?: string;
}) {
  const points = data
    .map((value, index) => {
      const x = 32 + index * (450 / Math.max(data.length - 1, 1));
      const y = 180 - ((value - 40) / 60) * 130;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 520 220" className="h-[220px] w-full overflow-visible">
      {[0, 1, 2].map((line) => (
        <line
          key={line}
          x1="30"
          x2="500"
          y1={60 + line * 55}
          y2={60 + line * 55}
          stroke="rgba(255,255,255,.08)"
        />
      ))}

      <path d={`M 32,195 ${points} L 482,195 Z`} fill={color} opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        filter={`drop-shadow(0 0 10px ${color})`}
      />

      {points.split(" ").map((point, index) => {
        const [x, y] = point.split(",");
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="5" fill={color} />
            <text
              x={Number(x) - 9}
              y={Number(y) - 12}
              fill="white"
              fontSize="12"
              fontWeight="800"
            >
              {data[index]}
            </text>
          </g>
        );
      })}

      {labels.map((label, index) => (
        <text
          key={label}
          x={34 + index * (450 / Math.max(labels.length - 1, 1))}
          y="214"
          fill="rgba(255,255,255,.65)"
          fontSize="12"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

function KeyInsights({
  reportGenerated,
  onGenerate,
}: {
  reportGenerated: boolean;
  onGenerate: () => void;
}) {
  return (
    <div className="mt-5 grid gap-4 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 xl:grid-cols-[0.8fr_1fr_1fr_1fr_1fr_0.95fr] xl:items-center">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-[#A6FF4D]/30 bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_28px_rgba(166,255,77,.25)]">
          <Brain size={34} />
        </div>

        <div>
          <p className="text-[15px] font-black uppercase tracking-[0.14em] text-[#A6FF4D]">
            AI Key Insights
          </p>
          <p className="mt-1 text-[13px] text-white/65">
            Based on your analytics
          </p>
        </div>
      </div>

      {keyInsights.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          >
            <Icon size={24} style={{ color: item.color }} />
            <div>
              <p className="text-[13px] font-black text-white">{item.title}</p>
              <p className="mt-1 text-[12px] leading-5 text-white/65">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}

      <div className="rounded-2xl border border-[#A6FF4D]/45 bg-[#A6FF4D]/7 p-4 shadow-[0_0_32px_rgba(166,255,77,.16)]">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D]">
            <BarChart3 size={30} />
          </div>
          <div>
            <p className="text-[13px] font-black text-white">
              Want Deeper Insights?
            </p>
            <p className="mt-1 text-[12px] leading-5 text-white/65">
              AI can generate a detailed weekly report for you.
            </p>
          </div>
        </div>

        <button
          onClick={onGenerate}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-[#A6FF4D]/30 bg-[#A6FF4D]/5 px-4 py-2.5 text-[12px] font-black text-[#A6FF4D]"
        >
          {reportGenerated ? "Report Generated" : "Generate AI Report"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  action,
  children,
  titleColor = "#A6FF4D",
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
  titleColor?: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p
          className="text-[15px] font-black uppercase tracking-[0.1em]"
          style={{ color: titleColor }}
        >
          {title}
        </p>

        {action && (
          <button className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] font-bold text-white/75">
            {action}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_22%_42%,rgba(24,211,208,0.08),transparent_34%),radial-gradient(circle_at_78%_58%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}