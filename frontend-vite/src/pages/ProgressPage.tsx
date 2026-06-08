import type { ElementType, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Apple,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Droplets,
  Dumbbell,
  Flame,
  Moon,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PRIMARY = "#93C572";
const TEXT = "#F5F8F2";
const TEAL = "#18D3D0";
const WARNING = "#F5B942";
const BLUE = "#4BA3FF";
const PURPLE = "#A875FF";

type TrendPoint = {
  day: string;
  expected: number;
  actual: number;
};

type TrendCardData = {
  title: string;
  unit: string;
  delta: string;
  deltaSub: string;
  icon: ElementType;
  color: string;
  data: TrendPoint[];
  start: string;
  current: string;
  goal: string;
};

const weightData: TrendPoint[] = [
  { day: "May 18", expected: 70, actual: 70 },
  { day: "May 20", expected: 69.6, actual: 69.4 },
  { day: "May 22", expected: 69.2, actual: 68.8 },
  { day: "May 24", expected: 68.8, actual: 68.4 },
  { day: "May 26", expected: 68.4, actual: 67.7 },
  { day: "May 28", expected: 68, actual: 67.2 },
  { day: "May 30", expected: 67.6, actual: 66.6 },
  { day: "Jun 2", expected: 67.2, actual: 65.8 },
];

const proteinData: TrendPoint[] = [
  { day: "May 18", expected: 72, actual: 41 },
  { day: "May 20", expected: 75, actual: 58 },
  { day: "May 22", expected: 78, actual: 54 },
  { day: "May 24", expected: 80, actual: 69 },
  { day: "May 26", expected: 80, actual: 61 },
  { day: "May 28", expected: 80, actual: 68 },
  { day: "May 30", expected: 80, actual: 59 },
  { day: "Jun 2", expected: 80, actual: 77 },
];

const waterData: TrendPoint[] = [
  { day: "May 18", expected: 2.1, actual: 1.3 },
  { day: "May 20", expected: 2.3, actual: 2.1 },
  { day: "May 22", expected: 2.4, actual: 1.8 },
  { day: "May 24", expected: 2.4, actual: 1.9 },
  { day: "May 26", expected: 2.4, actual: 1.8 },
  { day: "May 28", expected: 2.4, actual: 2.0 },
  { day: "May 30", expected: 2.4, actual: 1.8 },
  { day: "Jun 2", expected: 2.5, actual: 2.1 },
];

const sleepData: TrendPoint[] = [
  { day: "May 18", expected: 6.5, actual: 5.8 },
  { day: "May 20", expected: 6.8, actual: 6.0 },
  { day: "May 22", expected: 7.0, actual: 5.7 },
  { day: "May 24", expected: 7.5, actual: 6.8 },
  { day: "May 26", expected: 7.0, actual: 5.4 },
  { day: "May 28", expected: 7.0, actual: 5.7 },
  { day: "May 30", expected: 7.3, actual: 5.1 },
  { day: "Jun 2", expected: 7.5, actual: 5.3 },
];

const trendCards: TrendCardData[] = [
  {
    title: "Weight Trend",
    unit: "kg",
    delta: "-2.4 kg",
    deltaSub: "vs last 2 weeks",
    icon: Target,
    color: PRIMARY,
    data: weightData,
    start: "70.0 kg",
    current: "67.6 kg",
    goal: "64.0 kg",
  },
  {
    title: "Protein Intake",
    unit: "g/day",
    delta: "+16 g",
    deltaSub: "vs last 2 weeks",
    icon: Sparkles,
    color: TEAL,
    data: proteinData,
    start: "93 g",
    current: "93 g",
    goal: "112 g",
  },
  {
    title: "Water Intake",
    unit: "L/day",
    delta: "+0.6 L",
    deltaSub: "vs last 2 weeks",
    icon: Droplets,
    color: BLUE,
    data: waterData,
    start: "2.5 L",
    current: "2.5 L",
    goal: "3.2 L",
  },
  {
    title: "Sleep Quality",
    unit: "hrs",
    delta: "+0.7 hrs",
    deltaSub: "vs last 2 weeks",
    icon: Moon,
    color: PURPLE,
    data: sleepData,
    start: "7.2 hrs",
    current: "7.5 hrs",
    goal: "8.6 hrs",
  },
];

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-[#030805] px-3 py-4 pb-24 text-[#F5F8F2] sm:px-5 lg:px-6 xl:px-8 md:pb-8">
      <section className="mx-auto max-w-[1880px] overflow-hidden rounded-[32px] border border-[#93C572]/18 bg-[#030805] shadow-[0_0_90px_rgba(147,197,114,0.07)]">
        <div className="relative px-5 py-8 sm:px-7 lg:px-9 xl:px-10">
          <BackgroundFX />
          <Header />

          <div className="relative z-10 mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_450px]">
            <div className="min-w-0 space-y-5">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {trendCards.map((card) => (
                  <TrendCard key={card.title} card={card} />
                ))}
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
                <WeeklyReport />
                <Achievements />
              </div>
            </div>

            <RightSummary />
          </div>

          <AIRecommendations />
        </div>
      </section>
    </main>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_9%,rgba(147,197,114,0.08),transparent_28%),radial-gradient(circle_at_82%_28%,rgba(24,211,208,0.07),transparent_25%),radial-gradient(circle_at_14%_75%,rgba(147,197,114,0.05),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(147,197,114,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.12)_1px,transparent_1px)] [background-size:76px_76px]" />
    </>
  );
}

function Header() {
  return (
    <div className="relative z-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_760px] xl:items-stretch">
      <div>
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#18D3D0]/20 bg-[#18D3D0]/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#18D3D0]">
          <BarChart3 size={14} />
          Expected vs Actual Progress Engine
        </p>
        <h1 className="max-w-[760px] text-[38px] font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-[54px] xl:text-[62px]">
          Your Progress, Powered by AI
        </h1>
        <p className="mt-4 max-w-[760px] text-[18px] font-semibold leading-8 text-white/70">
          Track your journey, compare expected vs actual results, and stay on top of your goals.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.82fr_0.9fr_0.78fr]">
        <div className="grid gap-4">
          <button className="inline-flex min-h-[76px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-[15px] font-bold text-white/85 transition hover:border-[#93C572]/30">
            <CalendarDays size={18} />
            <span>May 18 – Jun 2, 2025</span>
            <ChevronDown size={17} />
          </button>
          <button className="inline-flex min-h-[76px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-[15px] font-bold text-white/85 transition hover:border-[#93C572]/30">
            <TrendingUp size={18} />
            Export Report
          </button>
        </div>
        <ScoreCard />
        <HumanMiniPanel />
      </div>
    </div>
  );
}

function ScoreCard() {
  return (
    <div className="min-h-[166px] rounded-[24px] border border-[#93C572]/18 bg-[#061009]/78 p-5">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[14px] font-black leading-5 text-white/85">Overall Progress Score</p>
          <p className="mt-3 text-[48px] font-black leading-none text-white">
            84<span className="text-[18px] font-semibold text-white/65">/100</span>
          </p>
          <p className="mt-3 text-[13px] font-semibold leading-5 text-white/60">Great progress! Keep it up.</p>
        </div>
        <ProgressRing value={84} size={88} stroke={10} color={PRIMARY} />
      </div>
    </div>
  );
}

function HumanMiniPanel() {
  return (
    <div className="relative hidden min-h-[166px] overflow-hidden rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/65 sm:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,211,208,0.15),transparent_72%)]" />
      <img
        src="/assets/dashboard-human-mesh.png"
        alt="Body progress"
        className="absolute left-1/2 top-1/2 z-10 h-[228px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain opacity-95 drop-shadow-[0_0_42px_rgba(24,211,208,0.3)]"
      />
      <div className="absolute left-5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#93C572]/24 bg-[#93C572]/8 text-[#93C572]">
        <ShieldCheck size={18} />
      </div>
      <div className="absolute right-5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#18D3D0]/24 bg-[#18D3D0]/8 text-[#18D3D0]">
        <Droplets size={18} />
      </div>
    </div>
  );
}

function TrendCard({ card }: { card: TrendCardData }) {
  const Icon = card.icon;

  return (
    <div className="flex min-h-[500px] flex-col rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 shadow-[0_0_42px_rgba(24,211,208,0.035)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border bg-black/24"
            style={{ borderColor: `${card.color}3D`, color: card.color }}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[18px] font-black leading-6 text-white">{card.title}</p>
            <p className="mt-1 text-[14px] font-semibold text-white/60">{card.unit}</p>
          </div>
        </div>
        <div className="min-w-[78px] text-right">
          <p className="text-[23px] font-black leading-tight" style={{ color: card.color }}>
            {card.delta}
          </p>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-white/45">{card.deltaSub}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px] font-semibold text-white/70">
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-7 border-t border-dashed" style={{ borderColor: card.color }} /> Expected
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-[3px] w-7 rounded-full" style={{ backgroundColor: card.color }} /> Actual
        </span>
      </div>

      <div className="mt-4 h-[245px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={card.data} margin={{ top: 14, right: 10, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "rgba(245,248,242,0.55)", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={14} />
            <YAxis tick={{ fill: "rgba(245,248,242,0.55)", fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
            <Tooltip
              contentStyle={{
                background: "#061009",
                border: "1px solid rgba(147,197,114,0.22)",
                borderRadius: 16,
                color: TEXT,
              }}
            />
            <Line type="monotone" dataKey="expected" stroke={card.color} strokeWidth={2} strokeDasharray="5 5" dot={false} opacity={0.85} />
            <Line type="monotone" dataKey="actual" stroke={card.color} strokeWidth={3} dot={{ r: 3, fill: card.color, strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto border-t border-white/8 pt-4">
        <div className="grid grid-cols-3 gap-2">
          <Metric label="Start" value={card.start} />
          <Metric label="Current" value={card.current} />
          <Metric label="Goal" value={card.goal} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/8 bg-black/14 px-2.5 py-3 text-center">
      <p className="text-[11px] font-black uppercase tracking-[0.08em] text-white/42">{label}</p>
      <p className="mt-1 whitespace-nowrap text-[14px] font-black text-white 2xl:text-[15px]">{value}</p>
    </div>
  );
}

function RightSummary() {
  return (
    <aside className="grid content-start gap-5">
      <SummaryCard />
      <AIInsight />
      <GoalProgress />
      <ProgressHologram />
    </aside>
  );
}

function SummaryCard() {
  const items = [
    { label: "Calories", value: "14,421 / 15,000 kcal", percent: 96, icon: Flame, color: WARNING },
    { label: "Protein", value: "651 / 651 g", percent: 100, icon: Sparkles, color: TEAL },
    { label: "Water", value: "17.5 / 17.5 L", percent: 100, icon: Droplets, color: BLUE },
    { label: "Workouts", value: "5 / 6 sessions", percent: 83, icon: Dumbbell, color: PURPLE },
  ];

  return (
    <div className="rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/78 p-5">
      <h2 className="text-[22px] font-black tracking-[-0.04em] text-white">This Week Summary</h2>
      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.04]" style={{ color: item.color }}>
                <item.icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[15px] font-black text-white">{item.label}</p>
                  <p className="text-[14px] font-black text-white/85">{item.percent}%</p>
                </div>
                <p className="mt-1 text-[13px] font-semibold text-white/58">{item.value}</p>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIInsight() {
  return (
    <div className="rounded-[24px] border border-[#18D3D0]/15 bg-[#061009]/78 p-5">
      <div className="flex gap-4">
        <img src="/assets/AI-Brain.png" alt="AI insight" className="h-14 w-14 shrink-0 object-contain drop-shadow-[0_0_22px_rgba(24,211,208,0.2)]" />
        <div>
          <h3 className="text-[19px] font-black text-white">AI Insight</h3>
          <p className="mt-3 text-[14px] font-semibold leading-7 text-white/62">
            Your protein consistency and hydration have improved. Focus on maintaining your calorie target and getting 30 more minutes of sleep.
          </p>
        </div>
      </div>
    </div>
  );
}

function WeeklyReport() {
  const reportItems = [
    { label: "Weight Change", value: "-0.4 kg", status: "On Track", icon: Target, color: PRIMARY },
    { label: "Body Fat", value: "-0.6%", status: "Improved", icon: Flame, color: WARNING },
    { label: "Muscle Mass", value: "+0.3 kg", status: "Improved", icon: TrendingUp, color: TEAL },
    { label: "Metabolic Age", value: "29 yrs", status: "Excellent", icon: ShieldCheck, color: PURPLE },
  ];

  return (
    <div className="rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/76 p-6">
      <div className="mb-6">
        <p className="flex items-center gap-3 text-[25px] font-black tracking-[-0.04em] text-white">
          <ShieldCheck size={25} className="text-[#93C572]" /> Weekly Wellness Report
        </p>
        <p className="mt-2 text-[15px] font-semibold text-white/58">May 26 – Jun 2, 2025</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1fr]">
        <div className="grid min-h-[430px] place-items-center rounded-[24px] border border-white/10 bg-black/16 p-5">
          <ProgressRing value={84} size={230} stroke={17} color={PRIMARY}>
            <div className="text-center">
              <p className="text-[50px] font-black leading-none text-white">84%</p>
              <p className="mt-2 text-[15px] font-semibold text-white/60">Wellness Score</p>
            </div>
          </ProgressRing>
        </div>

        <div className="grid gap-4">
          {reportItems.map((item) => (
            <ReportMetricCard key={item.label} {...item} />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.96fr_1fr]">
        <div className="grid min-h-[260px] place-items-center overflow-hidden rounded-[24px] border border-[#18D3D0]/12 bg-[#041615]/60">
          <img src="/assets/progress-report-hologram.png" alt="Progress report" className="h-[260px] w-auto object-contain drop-shadow-[0_0_45px_rgba(24,211,208,0.2)]" />
        </div>

        <div className="flex min-h-[260px] flex-col justify-center rounded-[24px] border border-[#93C572]/18 bg-[#93C572]/7 p-6">
          <p className="text-[13px] font-black uppercase tracking-[0.24em] text-[#93C572]">Progress Report</p>
          <p className="mt-5 text-[16px] font-semibold leading-8 text-white/66">
            Weekly progress is improving with better hydration, protein consistency and steady goal alignment.
          </p>
          <Link to="/reports" className="mt-6 inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-[#93C572]/35 bg-[#93C572]/8 px-8 text-[15px] font-black text-white transition hover:bg-[#93C572]/14">
            View Full Report
          </Link>
        </div>
      </div>
    </div>
  );
}

function ReportMetricCard({ label, value, status, icon: Icon, color }: { label: string; value: string; status: string; icon: ElementType; color: string }) {
  return (
    <div className="grid min-h-[96px] grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.025] px-5 py-4">
      <div className="grid h-11 w-11 place-items-center rounded-2xl border bg-black/20" style={{ borderColor: `${color}40`, color }}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-5 text-white/55">{label}</p>
        <p className="mt-1 text-[24px] font-black leading-none text-white">{value}</p>
      </div>
      <p className="whitespace-nowrap text-[13px] font-black text-[#93C572]">↓ {status}</p>
    </div>
  );
}

function Achievements() {
  const badges = [
    {
      title: "Protein Streak",
      sub: "3 Days",
      date: "May 31, 2025",
      image: "/assets/achievement-badge-protein.png",
    },
    {
      title: "Hydration Hero",
      sub: "7 Days",
      date: "May 30, 2025",
      image: "/assets/achievement-badge-water.png",
    },
    {
      title: "Consistency Champion",
      sub: "2 Weeks",
      date: "May 29, 2025",
      image: "/assets/achievement-badge-consistency.png",
    },
    {
      title: "Early Bird",
      sub: "5 Days",
      date: "May 28, 2025",
      image: "/assets/achievement-badge-earlybird.png",
    },
  ];

  return (
    <div className="h-full rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/76 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[25px] font-black tracking-[-0.04em] text-white">
            Recent Achievements
          </h2>
          <p className="mt-2 text-[14px] font-semibold text-white/55">
            Your latest progress badges
          </p>
        </div>

        <button className="shrink-0 text-[14px] font-black text-[#93C572]">
          View All
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="grid min-h-[122px] grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.025] px-4 py-4"
          >
            <div className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-[20px] border border-[#93C572]/12 bg-[#93C572]/5">
              <img
                src={badge.image}
                alt={badge.title}
                className="h-[86px] w-[86px] object-contain drop-shadow-[0_0_28px_rgba(147,197,114,0.18)]"
              />
            </div>

            <div className="min-w-0">
              <p className="break-words text-[18px] font-black leading-6 text-white">
                {badge.title}
              </p>
              <p className="mt-2 text-[13px] font-semibold text-white/45">
                {badge.date}
              </p>
            </div>

            <p className="shrink-0 whitespace-nowrap text-right text-[22px] font-black text-[#93C572]">
              {badge.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalProgress() {
  return (
    <div className="rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/76 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-black text-white">Goal Progress</h2>
        <button className="text-[14px] font-black text-[#93C572]">Edit Goals</button>
      </div>
      <div className="mt-6 flex items-center gap-5">
        <ProgressRing value={72} size={132} stroke={12} color={PRIMARY}>
          <div className="text-center">
            <p className="text-[35px] font-black leading-none text-white">72%</p>
            <p className="mt-1 text-[10px] font-semibold text-white/55">Goal Achievement</p>
          </div>
        </ProgressRing>
        <div>
          <p className="text-[13px] font-semibold text-white/50">Current Goal</p>
          <p className="mt-1 text-[19px] font-black text-white">Fat Loss</p>
          <p className="mt-4 text-[13px] font-semibold text-white/50">Target Weight</p>
          <p className="mt-1 text-[18px] font-black text-white">64.0 kg</p>
          <p className="mt-4 text-[13px] font-semibold text-white/50">Target Date</p>
          <p className="mt-1 text-[18px] font-black text-white">Aug 15, 2025</p>
        </div>
      </div>
      <p className="mt-5 rounded-2xl bg-[#93C572]/10 px-4 py-3 text-[13px] font-black text-[#93C572]">✓ On track to achieve your goal!</p>
    </div>
  );
}

function AIRecommendations() {
  const recs = [
    { title: "Increase Strength Training", text: "Try adding 1 more strength session per week to preserve muscle mass.", action: "Learn More", icon: Dumbbell, color: PRIMARY },
    { title: "Hydration Reminder", text: "You're doing great! Try drinking a glass of water within 30 mins of waking up.", action: "View Tips", icon: Droplets, color: BLUE },
    { title: "Improve Sleep Duration", text: "Aim for 30 more minutes of sleep for better recovery and fat loss results.", action: "Sleep Tips", icon: Moon, color: PURPLE },
    { title: "Calorie Consistency", text: "Try to stay within 90-100% of your calorie target for optimal progress.", action: "View Plan", icon: Apple, color: WARNING },
  ];

  return (
    <div className="relative z-10 mt-5 rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/76 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[28px] font-black tracking-[-0.04em] text-white">AI Recommendations</h2>
          <p className="mt-2 text-[15px] font-semibold text-white/55">Personalized suggestions to help you improve</p>
        </div>
        <Link to="/reports" className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-[#93C572]/30 bg-[#93C572]/8 px-8 text-[14px] font-black text-white transition hover:bg-[#93C572]/14">
          View Detailed Report
        </Link>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {recs.map((rec) => (
          <div key={rec.title} className="min-h-[230px] rounded-[22px] border border-white/10 bg-white/[0.025] p-6">
            <rec.icon size={42} style={{ color: rec.color }} />
            <p className="mt-6 text-[18px] font-black leading-6 text-white">{rec.title}</p>
            <p className="mt-4 min-h-[72px] text-[14px] font-semibold leading-7 text-white/58">{rec.text}</p>
            <button className="mt-5 rounded-xl border px-5 py-2.5 text-[13px] font-black" style={{ borderColor: `${rec.color}45`, color: rec.color }}>
              {rec.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressHologram() {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#18D3D0]/12 bg-[#061009]/76">
      <div className="relative min-h-[340px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,197,114,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,211,208,0.12),transparent_68%)]" />
        <img
          src="/assets/goal-progress-hologram.png"
          alt="Goal progress hologram"
          className="absolute left-1/2 top-[40%] h-[300px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_56px_rgba(24,211,208,0.28)]"
        />
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-[#18D3D0]/18 bg-black/28 px-4 py-4 backdrop-blur-xl">
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#18D3D0]">Projected Progress</p>
          <p className="mt-2 text-[13px] font-semibold leading-6 text-white/62">Expected trend is improving with consistent protein and hydration.</p>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({
  value,
  size,
  stroke,
  color,
  children,
}: {
  value: number;
  size: number;
  stroke: number;
  color: string;
  children?: ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {children || <p className="text-[13px] font-black text-white">{value}%</p>}
      </div>
    </div>
  );
}
