import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Droplets,
  Dumbbell,
  Flame,
  Info,
  Moon,
  Percent,
  Scale,
 
  TrendingDown,
  Zap,
} from "lucide-react";

type TrendPoint = {
  label: string;
  value: number;
  lastValue: number;
  goal: number;
};

type TrendMetric = {
  id: string;
  label: string;
  value: string;
  unit: string;
  change: string;
  icon: LucideIcon;
  trend: TrendPoint[];
};

type PredictionCard = {
  id: string;
  title: string;
  description: string;
  value: string;
  date: string;
  confidence: number;
  icon: LucideIcon;
  theme: "lime" | "purple" | "cyan" | "amber";
  forecast: number[];
};

type ProgressData = {
  section: {
    number: string;
    title: string;
    subtitle: string;
  };
  rangeOptions: {
    id: string;
    label: string;
  }[];
  overallProgress: {
    percentage: number;
    label: string;
    cta: string;
    stats: {
      id: string;
      label: string;
      value: string;
      subtext: string;
      icon: LucideIcon;
    }[];
  };
  trendMetrics: TrendMetric[];
  predictions: PredictionCard[];
  aiInsight: {
    title: string;
    message: string;
    recommendations: {
      id: string;
      icon: LucideIcon;
      label: string;
      highlight: string;
    }[];
    cta: string;
  };
  panels: {
    detailedProgress: { title: string; points: string[] };
    allMetrics: { title: string; points: string[] };
    predictionsInfo: { title: string; points: string[] };
    recommendations: { title: string; points: string[] };
    exportReport: { title: string; points: string[] };
  };
};

const progressData: ProgressData = {
  section: {
    number: "04",
    title: "Progress & Predictions",
    subtitle: "Track your progress and see what AI predicts for you.",
  },

  rangeOptions: [
    { id: "this-week", label: "This Week" },
    { id: "last-week", label: "Last Week" },
    { id: "this-month", label: "This Month" },
  ],

  overallProgress: {
    percentage: 68,
    label: "Overall Progress",
    cta: "View Detailed Progress",
    stats: [
      { id: "weight", label: "Weight", value: "-2.4 kg", subtext: "of 5 kg goal", icon: TrendingDown },
      { id: "body-fat", label: "Body Fat", value: "-2.1%", subtext: "of 5% goal", icon: Percent },
      { id: "muscle", label: "Muscle Mass", value: "+1.8 kg", subtext: "of 3 kg goal", icon: Dumbbell },
      { id: "energy", label: "Energy Level", value: "+18%", subtext: "Improved", icon: Zap },
    ],
  },

  trendMetrics: [
    {
      id: "weight",
      label: "Weight",
      value: "70.0",
      unit: "kg",
      change: "▼ 1.2 kg",
      icon: Scale,
      trend: [
        { label: "Mon", value: 71.6, lastValue: 68.5, goal: 71.2 },
        { label: "Tue", value: 71.1, lastValue: 68.5, goal: 71.6 },
        { label: "Wed", value: 70.8, lastValue: 68.5, goal: 71.9 },
        { label: "Thu", value: 70.4, lastValue: 68.5, goal: 72.1 },
        { label: "Fri", value: 69.8, lastValue: 68.5, goal: 72.2 },
        { label: "Sat", value: 69.3, lastValue: 68.5, goal: 72.2 },
        { label: "Sun", value: 69.2, lastValue: 68.5, goal: 72.2 },
      ],
    },
    {
      id: "body-fat",
      label: "Body Fat %",
      value: "28.3",
      unit: "%",
      change: "▼ 1.1%",
      icon: Percent,
      trend: [
        { label: "Mon", value: 31.0, lastValue: 27.0, goal: 31.4 },
        { label: "Tue", value: 30.2, lastValue: 26.6, goal: 31.7 },
        { label: "Wed", value: 29.6, lastValue: 26.1, goal: 32.0 },
        { label: "Thu", value: 28.9, lastValue: 25.4, goal: 32.1 },
        { label: "Fri", value: 28.2, lastValue: 25.2, goal: 32.2 },
        { label: "Sat", value: 27.2, lastValue: 25.2, goal: 32.2 },
        { label: "Sun", value: 26.0, lastValue: 25.2, goal: 32.2 },
      ],
    },
    {
      id: "muscle",
      label: "Muscle Mass",
      value: "50.2",
      unit: "kg",
      change: "▲ 0.8 kg",
      icon: Dumbbell,
      trend: [
        { label: "Mon", value: 49.5, lastValue: 48.4, goal: 51.8 },
        { label: "Tue", value: 49.4, lastValue: 48.3, goal: 51.9 },
        { label: "Wed", value: 49.6, lastValue: 48.2, goal: 52.0 },
        { label: "Thu", value: 50.7, lastValue: 48.7, goal: 52.1 },
        { label: "Fri", value: 50.4, lastValue: 48.5, goal: 52.2 },
        { label: "Sat", value: 50.3, lastValue: 48.5, goal: 52.2 },
        { label: "Sun", value: 51.8, lastValue: 48.4, goal: 52.2 },
      ],
    },
    {
      id: "calories",
      label: "Calories",
      value: "1,842",
      unit: "kcal",
      change: "▲ 120 kcal",
      icon: Flame,
      trend: [
        { label: "Mon", value: 1790, lastValue: 1650, goal: 1940 },
        { label: "Tue", value: 1760, lastValue: 1650, goal: 1950 },
        { label: "Wed", value: 1860, lastValue: 1665, goal: 1960 },
        { label: "Thu", value: 1785, lastValue: 1650, goal: 1975 },
        { label: "Fri", value: 1980, lastValue: 1650, goal: 1980 },
        { label: "Sat", value: 1850, lastValue: 1650, goal: 1980 },
        { label: "Sun", value: 1885, lastValue: 1650, goal: 1980 },
      ],
    },
  ],

  predictions: [
    {
      id: "weight-prediction",
      title: "Weight Prediction",
      description: "You will reach your goal of",
      value: "65.0 kg",
      date: "by 20 July 2024",
      confidence: 92,
      icon: Scale,
      theme: "lime",
      forecast: [24, 26, 29, 36, 47, 56, 63, 70],
    },
    {
      id: "body-fat-prediction",
      title: "Body Fat Prediction",
      description: "You will reach your goal of",
      value: "24.0%",
      date: "by 15 Aug 2024",
      confidence: 89,
      icon: Percent,
      theme: "purple",
      forecast: [25, 27, 31, 38, 49, 58, 66, 73],
    },
    {
      id: "muscle-prediction",
      title: "Muscle Gain Prediction",
      description: "You will reach your goal of",
      value: "52.0 kg",
      date: "by 10 Aug 2024",
      confidence: 85,
      icon: Dumbbell,
      theme: "cyan",
      forecast: [27, 30, 35, 44, 54, 62, 70, 80],
    },
    {
      id: "energy-prediction",
      title: "Energy Level Prediction",
      description: "Your energy level will improve to",
      value: "85%",
      date: "by 30 Jun 2024",
      confidence: 90,
      icon: Zap,
      theme: "amber",
      forecast: [26, 29, 34, 43, 52, 60, 69, 78],
    },
  ],

  aiInsight: {
    title: "AI Insight",
    message:
      "You're on the right track. Protein consistency and workouts are driving great results. Keep focusing on sleep to improve recovery even more.",
    recommendations: [
      { id: "sleep", icon: Moon, label: "Improve sleep by", highlight: "15–20 min" },
      { id: "water", icon: Droplets, label: "Increase water intake by", highlight: "0.5L" },
      { id: "protein", icon: Dumbbell, label: "Add", highlight: "15g more protein daily" },
    ],
    cta: "View AI Recommendations",
  },

  panels: {
    detailedProgress: {
      title: "Detailed Progress",
      points: [
        "Weight is down by 2.4 kg toward the current 5 kg goal.",
        "Body fat has improved by 2.1% with strong weekly consistency.",
        "Energy level is up by 18%, mostly driven by sleep and hydration.",
      ],
    },
    allMetrics: {
      title: "All Metrics Overview",
      points: [
        "Weight, body fat, muscle mass, calories, hydration, sleep, and recovery are available for full analytics.",
        "Backend connection can later replace this local state with real user metrics.",
      ],
    },
    predictionsInfo: {
      title: "How AI Predictions Work",
      points: [
        "Predictions use recent progress, nutrition consistency, activity pattern, and recovery quality.",
        "Confidence percentage changes when more scan, sleep, hydration, and workout data is available.",
      ],
    },
    recommendations: {
      title: "AI Recommendations",
      points: [
        "Increase water intake by 0.5L today.",
        "Add 15g more protein daily to support muscle retention.",
        "Improve sleep by 15–20 minutes to strengthen recovery score.",
      ],
    },
    exportReport: {
      title: "Export Report",
      points: [
        "Progress report prepared for the selected date range.",
        "Later this button can download a PDF or CSV from the backend API.",
      ],
    },
  },
};

const themeStyles = {
  lime: {
    text: "text-[#A6FF4D]",
    border: "border-[#A6FF4D]/25",
    iconBg: "bg-[#A6FF4D]/15",
    stroke: "#A6FF4D",
    fill: "rgba(166,255,77,.22)",
    glow: "shadow-[0_0_70px_rgba(166,255,77,.2)]",
  },
  purple: {
    text: "text-[#C084FC]",
    border: "border-purple-400/25",
    iconBg: "bg-purple-500/15",
    stroke: "#C084FC",
    fill: "rgba(192,132,252,.2)",
    glow: "shadow-[0_0_70px_rgba(192,132,252,.16)]",
  },
  cyan: {
    text: "text-[#18D3D0]",
    border: "border-[#18D3D0]/25",
    iconBg: "bg-[#18D3D0]/15",
    stroke: "#18D3D0",
    fill: "rgba(24,211,208,.2)",
    glow: "shadow-[0_0_70px_rgba(24,211,208,.16)]",
  },
  amber: {
    text: "text-[#FFB347]",
    border: "border-[#FFB347]/25",
    iconBg: "bg-[#FFB347]/15",
    stroke: "#FFB347",
    fill: "rgba(255,179,71,.2)",
    glow: "shadow-[0_0_70px_rgba(255,179,71,.16)]",
  },
};

function TrendChart({ metric }: { metric: TrendMetric }) {
  const allValues = metric.trend.flatMap((item) => [
    item.value,
    item.lastValue,
    item.goal,
  ]);

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const lineFrom = (key: "value" | "lastValue" | "goal") => {
    return metric.trend
      .map((item, index) => {
        const x = 26 + index * 44;
        const y = 154 - ((item[key] - min) / (max - min || 1)) * 100;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const currentLine = lineFrom("value");
  const lastLine = lineFrom("lastValue");
  const goalLine = lineFrom("goal");

  return (
    <svg viewBox="0 0 320 208" className="mt-7 h-[208px] w-full overflow-visible">
      <polyline points={goalLine} fill="none" stroke="rgba(255,255,255,.45)" strokeDasharray="7 7" strokeWidth="1.8" />
      <polyline points={lastLine} fill="none" stroke="#18D3D0" strokeDasharray="4 6" strokeWidth="1.8" opacity="0.95" />
      <polyline points={currentLine} fill="none" stroke="#A6FF4D" strokeWidth="4.3" filter="drop-shadow(0 0 10px rgba(166,255,77,.85))" />

      {currentLine.split(" ").map((pair, index) => {
        const [x, y] = pair.split(",");
        return <circle key={`${metric.id}-${index}`} cx={x} cy={y} r="5.4" fill="#A6FF4D" />;
      })}

      {metric.trend.map((item, index) => (
        <text key={item.label} x={14 + index * 44} y="196" fill="#A3B3A3" fontSize="14" fontWeight="900">
          {item.label}
        </text>
      ))}
    </svg>
  );
}

function buildSvgPoints(values: number[], width: number, height: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const xGap = width / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = 24 + index * xGap;
      const y = height - 22 - ((value - min) / (max - min || 1)) * (height - 70);
      return `${x},${y}`;
    })
    .join(" ");
}

function PredictionChart({ prediction }: { prediction: PredictionCard }) {
  const theme = themeStyles[prediction.theme];
  const points = buildSvgPoints(prediction.forecast, 430, 230);
  const area = `24,230 ${points} 454,230`;

  return (
    <svg viewBox="0 0 478 258" className="mt-8 h-[258px] w-full overflow-visible">
      <path d={`M ${area} Z`} fill={theme.fill} />
      <polyline points={points} fill="none" stroke={theme.stroke} strokeWidth="4.6" filter={`drop-shadow(0 0 11px ${theme.stroke})`} />

      {points.split(" ").map((pair, index) => {
        const [x, y] = pair.split(",");
        return <circle key={`${prediction.id}-${index}`} cx={x} cy={y} r="5.6" fill={theme.stroke} />;
      })}

      <line x1="454" y1="78" x2="454" y2="230" stroke={theme.stroke} strokeWidth="2.4" opacity="0.85" />
      <rect x="352" y="18" width="102" height="48" rx="12" fill={theme.stroke} opacity="0.28" />

      <text x="403" y="49" textAnchor="middle" fill="#F5F8F2" fontSize="18" fontWeight="900">
        {prediction.value}
      </text>
    </svg>
  );
}

export default function ProgressPredictions() {
  const [data] = useState<ProgressData>(progressData);
  const [selectedRange, setSelectedRange] = useState(data.rangeOptions[0]);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<keyof ProgressData["panels"] | null>(null);

  const progressDegree = useMemo(() => {
    return Math.round((data.overallProgress.percentage / 100) * 360);
  }, [data.overallProgress.percentage]);

  const activePanelData = activePanel ? data.panels[activePanel] : null;

  return (
    <section className="relative overflow-hidden bg-[#030805] px-4 py-8 text-[#F5F8F2]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-[#18D3D0]/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[600px] w-[860px] rounded-full bg-[#A6FF4D]/[0.07] blur-[125px]" />

      <div className="relative mx-auto w-[98vw] overflow-hidden rounded-[34px] border border-white/10 bg-[#04100b]/95 p-10 shadow-[0_0_100px_rgba(24,211,208,.1)]">
        <div className="mb-10 flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
          <div className="flex items-center gap-0">
           

            <div>
              <h2 className="text-[60px] font-black uppercase leading-[0.95] tracking-[0.14em] text-white 2xl:text-[64px]">
                {data.section.title}
              </h2>
              <p className="mt-4 text-[30px] font-semibold text-[#A3B3A3]">
                {data.section.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setRangeOpen((prev) => !prev)}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-5 text-[22px] font-black text-white transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
              >
                <CalendarDays size={26} />
                {selectedRange.label}
                <ChevronDown size={26} className={`transition ${rangeOpen ? "rotate-180" : ""}`} />
              </button>

              {rangeOpen && (
                <div className="absolute right-0 z-40 mt-3 w-[260px] rounded-2xl border border-white/10 bg-[#07110A] p-2 shadow-[0_20px_60px_rgba(0,0,0,.45)]">
                  {data.rangeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedRange(option);
                        setRangeOpen(false);
                        setActivePanel(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-5 py-4 text-left text-[20px] font-black transition ${
                        selectedRange.id === option.id
                          ? "bg-[#A6FF4D]/15 text-[#A6FF4D]"
                          : "text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {option.label}
                      {selectedRange.id === option.id && <CheckCircle2 size={22} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActivePanel("exportReport")}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-5 text-[22px] font-black text-white transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
            >
              <Download size={26} />
              Export Report
            </button>
          </div>
        </div>

        {activePanelData && (
          <div className="mb-6 rounded-[24px] border border-[#18D3D0]/20 bg-[#061611] p-7 shadow-[0_0_45px_rgba(24,211,208,.1)]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h3 className="text-[28px] font-black uppercase tracking-[0.16em] text-[#18D3D0]">
                  {activePanelData.title}
                </h3>

                <ul className="mt-5 grid gap-4">
                  {activePanelData.points.map((point) => (
                    <li key={point} className="flex gap-4 text-[22px] font-semibold leading-relaxed text-[#D9E5D9]">
                      <span className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full bg-[#A6FF4D]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 text-[20px] font-black text-white hover:border-[#A6FF4D]/30"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-10 2xl:grid-cols-[820px_minmax(0,1fr)]">
          <div className="min-h-[520px] overflow-hidden rounded-[30px] border border-white/10 bg-[#07110A]/70 p-9 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_65px_rgba(166,255,77,.1)]">
            <h3 className="text-[32px] font-black uppercase tracking-[0.2em] text-[#A6FF4D]">
              Overall Progress
            </h3>

            <div className="mt-10 grid items-center gap-10 xl:grid-cols-[275px_minmax(420px,1fr)]">
              <div
                className="relative grid h-[275px] w-[275px] place-items-center rounded-full shadow-[0_0_90px_rgba(166,255,77,.38)]"
                style={{
                  background: `conic-gradient(from 180deg, #18D3D0 0deg, #A6FF4D ${progressDegree}deg, rgba(255,255,255,.08) ${progressDegree}deg)`,
                }}
              >
                <div className="absolute inset-8 rounded-full bg-[#04100b]" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(166,255,77,.28),transparent_58%)] blur-sm" />

                <div className="relative text-center">
                  <div className="text-[80px] font-black leading-none text-white">
                    {data.overallProgress.percentage}%
                  </div>
                  <p className="mt-4 text-[22px] leading-tight text-[#D9E6D9]">
                    {data.overallProgress.label}
                  </p>
                </div>
              </div>

              <div className="min-w-0 space-y-6">
                {data.overallProgress.stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[minmax(250px,1fr)_170px] items-center gap-7 border-b border-white/10 pb-5 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <Icon size={28} className="shrink-0 text-[#A6FF4D]" />
                        <span className="whitespace-nowrap text-[25px] font-black text-white">
                          {item.label}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="whitespace-nowrap text-[34px] font-black leading-tight text-white">
                          {item.value}
                        </p>
                        <p className="whitespace-nowrap text-[19px] font-semibold leading-tight text-[#A3B3A3]">
                          {item.subtext}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivePanel("detailedProgress")}
              className="mt-10 flex items-center justify-center gap-4 rounded-2xl border border-white/15 bg-white/[0.04] px-9 py-5 text-[24px] font-black transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
            >
              {data.overallProgress.cta}
              <ArrowRight size={28} />
            </button>
          </div>

          <div className="min-h-[520px] rounded-[30px] border border-white/10 bg-[#07110A]/70 p-9 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_65px_rgba(24,211,208,.1)]">
            <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
              <h3 className="text-[32px] font-black uppercase tracking-[0.2em] text-[#A6FF4D]">
                Key Metrics Trend
              </h3>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-6 text-[20px] font-bold text-[#D9E6D9]">
                  <span className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full bg-[#A6FF4D]" />
                    This Week
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full bg-[#18D3D0]" />
                    Last Week
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="h-[1px] w-10 border-t border-dashed border-white/60" />
                    Goal
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePanel("allMetrics")}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-[22px] font-black transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
                >
                  View All Metrics
                </button>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-4">
              {data.trendMetrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.id}
                    className="min-h-[405px] rounded-[24px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_0_35px_rgba(24,211,208,.045)]"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={28} className="text-[#A6FF4D]" />
                      <p className="text-[24px] font-black text-white">
                        {metric.label}
                      </p>
                    </div>

                    <p className="mt-6 text-[52px] font-black leading-none text-white">
                      {metric.value}
                      <span className="ml-2 text-[22px] font-bold text-[#A3B3A3]">
                        {metric.unit}
                      </span>
                    </p>

                    <p className="mt-4 text-[21px] font-black text-[#A6FF4D]">
                      {metric.change}
                    </p>

                    <TrendChart metric={metric} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-[30px] border border-white/10 bg-[#07110A]/70 p-9 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_65px_rgba(24,211,208,.1)]">
          <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
            <div>
              <h3 className="text-[32px] font-black uppercase tracking-[0.2em] text-[#A6FF4D]">
                AI Predictions
              </h3>
              <p className="mt-3 text-[24px] leading-[1.45] text-[#A3B3A3]">
                AI analyzed your current data and predicted your future progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePanel("predictionsInfo")}
              className="flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-[22px] font-black transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
            >
              <Info size={26} />
              How Predictions Work
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-4">
            {data.predictions.map((prediction) => {
              const Icon = prediction.icon;
              const theme = themeStyles[prediction.theme];

              return (
                <div
                  key={prediction.id}
                  className={`min-h-[560px] rounded-[24px] border ${theme.border} bg-white/[0.04] p-8 ${theme.glow}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`grid h-16 w-16 place-items-center rounded-2xl ${theme.iconBg} ${theme.text}`}>
                      <Icon size={32} />
                    </div>

                    <h4 className="text-[24px] font-black uppercase tracking-[0.08em] text-white">
                      {prediction.title}
                    </h4>
                  </div>

                  <p className="mt-6 text-[21px] leading-[1.45] text-[#D8E5D8]">
                    {prediction.description}
                  </p>

                  <p className={`mt-5 text-[52px] font-black ${theme.text}`}>
                    {prediction.value}
                  </p>

                  <p className="mt-5 text-[22px] font-bold text-[#D8E5D8]">
                    {prediction.date}
                  </p>

                  <p className="mt-5 text-[22px] font-black text-[#18D3D0]">
                    Confidence: {prediction.confidence}%
                  </p>

                  <PredictionChart prediction={prediction} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-7 grid gap-6 rounded-[30px] border border-[#A6FF4D]/15 bg-[radial-gradient(circle_at_7%_50%,rgba(166,255,77,.2),transparent_20%),linear-gradient(90deg,#071d11,#04120d,#071d11)] p-8 shadow-[0_0_70px_rgba(166,255,77,.16)] xl:grid-cols-[1.45fr_1fr_1fr_1fr_420px] xl:items-center">
          <div className="flex items-center gap-6">
            <div className="grid h-[100px] w-[100px] shrink-0 place-items-center rounded-[26px] bg-[#A6FF4D]/12 text-[#A6FF4D] shadow-[0_0_50px_rgba(166,255,77,.42)]">
              <Brain size={52} />
            </div>

            <div>
              <h3 className="text-[30px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                {data.aiInsight.title}
              </h3>
              <p className="mt-3 text-[21px] leading-relaxed text-[#D9E5D9]">
                {data.aiInsight.message}
              </p>
            </div>
          </div>

          {data.aiInsight.recommendations.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="flex min-h-[96px] items-center gap-5 border-white/10 xl:border-l xl:pl-7"
              >
                <Icon size={42} className="shrink-0 text-[#18D3D0]" />
                <p className="text-[30px] leading-snug text-[#DDE8DD]">
                  {item.label}{" "}
                  <span className="font-black text-[#A6FF4D]">
                    {item.highlight}
                  </span>
                </p>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setActivePanel("recommendations")}
            className="flex h-[104px] items-center justify-center gap-6 rounded-2xl bg-[#A6FF4D] px-14 text-[40px] font-black text-[#061006] shadow-[0_0_55px_rgba(166,255,77,.45)] transition hover:scale-[1.01] hover:bg-[#B9FF68]"
          >
            {data.aiInsight.cta}
            <ArrowRight size={44} />
          </button>
        </div>

       
      </div>
    </section>
  );
}