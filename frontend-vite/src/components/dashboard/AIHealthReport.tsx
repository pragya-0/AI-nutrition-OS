import { useEffect, useMemo, useState, type ElementType, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Info,
  Moon,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

const AI_BRAIN = "/assets/AI-Brain.png";
const HEALTH_SYMBOL = "/assets/Health Care Symbol.png";

type SummaryItem = {
  label: string;
  value: string;
  status: string;
  icon: ElementType;
  color: string;
};

type Achievement = {
  title: string;
  text: string;
  icon: ElementType;
  color: string;
};

type Highlight = {
  text: string;
  icon: ElementType;
  color: string;
};

type Comparison = {
  label: string;
  value: string;
  sub: string;
  icon: ElementType;
  color: string;
};

type Milestone = {
  label: string;
  progress: number;
};

type StoredHealthReportPlan = {
  success?: boolean;
  user_profile?: {
    name?: string;
    age?: number;
    weight?: number;
    height?: number;
    goal?: string;
    activity?: string;
    sleep_hours?: number;
    water_intake?: number;
  };
  analytics?: {
    health_score?: number;
    health_status?: string;
    sleep_score?: number;
    hydration_score?: number;
    bmi?: number;
    body_fat?: number;
    metabolic_age?: number;
  };
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    water_target?: string;
  };
  meal_plan?: {
    days?: unknown[];
  };
  health_insight?: string;
  coach_message?: string;
  ai_tip?: string;
};

type ReportData = {
  name: string;
  range: string;
  healthScore: number;
  status: string;
  sleepScore: number;
  hydrationScore: number;
  recoveryScore: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterTarget: string;
  waterLiters: number;
  weight: number;
  goalWeight: number;
  progressToGoal: number;
  goal: string;
  bmi: number;
  bodyFat: number;
  metabolicAge: number;
  mealPlanDays: number;
  insight: string;
  weeklySummary: SummaryItem[];
  achievements: Achievement[];
  highlights: Highlight[];
  comparisons: Comparison[];
  milestones: Milestone[];
  healthTrend: number[];
  weightTrend: number[];
};

const tabs = [
  "Overview",
  "Achievements",
  "Trends",
  "Comparisons",
  "Recommendations",
];

function getStoredHealthReportPlan(): StoredHealthReportPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    if (!raw) return null;
    return JSON.parse(raw) as StoredHealthReportPlan;
  } catch {
    return null;
  }
}

function getCurrentWeekRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);

  const format = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return `${format(start)} – ${format(end)}`;
}

function formatGoal(value?: string) {
  if (!value) return "your health goal";
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseLiters(value?: string, fallback = 2.5) {
  if (!value) return fallback;
  const match = value.match(/[\d.]+/);
  if (!match) return fallback;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(Math.round(value), min), max);
}

function goalWeightFromGoal(weight: number, goal?: string) {
  const normalized = (goal || "").toLowerCase();

  if (!weight) return 0;
  if (normalized.includes("weight_loss")) return Math.max(weight - 4, 35);
  if (normalized.includes("muscle_gain")) return weight + 3;
  return weight;
}

function scoreTrend(score: number) {
  const safe = score || 0;
  return [safe - 14, safe - 10, safe - 8, safe - 5, safe - 3, safe - 1, safe].map((value) =>
    clamp(value),
  );
}

function weightTrend(weight: number, goalWeight: number) {
  if (!weight) return [0, 0, 0, 0, 0, 0, 0];

  const delta = (weight - goalWeight) / 8;

  return Array.from({ length: 8 }, (_, index) =>
    Number((weight - delta * index).toFixed(1)),
  );
}

function getHealthReportData(): ReportData {
  const plan = getStoredHealthReportPlan();
  const profile = plan?.user_profile || {};
  const analytics = plan?.analytics || {};
  const targets = plan?.targets || {};

  const healthScore = analytics.health_score ?? 0;
  const sleepScore = analytics.sleep_score ?? healthScore;
  const hydrationScore = analytics.hydration_score ?? healthScore;
  const recoveryScore = clamp((sleepScore + hydrationScore) / 2);
  const status =
    analytics.health_status ||
    (healthScore >= 85 ? "Excellent" : healthScore >= 70 ? "Good" : "Needs Focus");

  const weight = profile.weight ?? 0;
  const goalWeight = goalWeightFromGoal(weight, profile.goal);
  const progressToGoal =
    weight && goalWeight && weight !== goalWeight
      ? clamp(((Math.abs(weight - goalWeight) - Math.abs(weight - goalWeight) * 0.4) / Math.abs(weight - goalWeight)) * 100)
      : healthScore;

  const waterLiters = parseLiters(targets.water_target, profile.water_intake ?? 2.5);
  const mealPlanDays = plan?.meal_plan?.days?.length || 0;
  const goal = formatGoal(profile.goal);

  const weeklySummary: SummaryItem[] = [
    {
      label: "Consistency",
      value: `${healthScore || 0}%`,
      status,
      icon: ShieldCheck,
      color: "#A6FF4D",
    },
    {
      label: "Nutrition",
      value: targets.protein ? `${targets.protein}g` : "Pending",
      status: "Protein",
      icon: HeartPulse,
      color: "#18D3D0",
    },
    {
      label: "Activity",
      value: formatGoal(profile.activity),
      status: "Focus",
      icon: Dumbbell,
      color: "#A875FF",
    },
    {
      label: "Recovery",
      value: `${recoveryScore}%`,
      status: recoveryScore >= 85 ? "Excellent" : "Good",
      icon: Flame,
      color: "#FFB347",
    },
    {
      label: "Lifestyle",
      value: targets.water_target || `${profile.water_intake ?? 2.5}L`,
      status: "Hydration",
      icon: Sparkles,
      color: "#A6FF4D",
    },
  ];

  const achievements: Achievement[] = [
    {
      title: mealPlanDays ? `${mealPlanDays} Day Plan Generated` : "Plan Ready",
      text: mealPlanDays
        ? `Your AI generated ${mealPlanDays} day${mealPlanDays === 1 ? "" : "s"} of meals.`
        : "Generate a plan to unlock plan achievements.",
      icon: Trophy,
      color: "#FFB347",
    },
    {
      title: "Protein Target Set",
      text: targets.protein
        ? `Daily target: ${targets.protein}g protein.`
        : "Protein target will appear after generation.",
      icon: Star,
      color: "#FFB347",
    },
    {
      title: "Hydration Target Ready",
      text: `Hydration goal: ${targets.water_target || `${profile.water_intake ?? 2.5}L`}.`,
      icon: HeartPulse,
      color: "#18D3D0",
    },
    {
      title: "Recovery Profile Active",
      text: `Sleep score is ${sleepScore || 0} based on your latest profile.`,
      icon: Moon,
      color: "#7BE929",
    },
  ];

  const highlights: Highlight[] = [
    {
      text: targets.calories
        ? `Calorie target is set at ${targets.calories.toLocaleString()} kcal.`
        : "Generate a plan to set calorie targets.",
      icon: ShieldCheck,
      color: "#7BE929",
    },
    {
      text: targets.protein
        ? `Protein target is ${targets.protein}g for your current goal.`
        : "Protein target pending.",
      icon: ArrowUp,
      color: "#A6FF4D",
    },
    {
      text: `Sleep score is ${sleepScore || 0}, supporting recovery and routine.`,
      icon: Moon,
      color: "#A875FF",
    },
    {
      text: `Activity focus is ${formatGoal(profile.activity)}.`,
      icon: Flame,
      color: "#FFB347",
    },
    {
      text: `Hydration target is ${targets.water_target || `${profile.water_intake ?? 2.5}L`}.`,
      icon: HeartPulse,
      color: "#18D3D0",
    },
  ];

  const comparisons: Comparison[] = [
    {
      label: "Calories",
      value: targets.calories ? targets.calories.toLocaleString() : "0",
      sub: "kcal target",
      icon: Flame,
      color: "#FFB347",
    },
    {
      label: "Protein",
      value: targets.protein ? `${targets.protein}g` : "0g",
      sub: "daily target",
      icon: Dumbbell,
      color: "#A6FF4D",
    },
    {
      label: "Carbs",
      value: targets.carbs ? `${targets.carbs}g` : "0g",
      sub: "daily target",
      icon: Footprints,
      color: "#18D3D0",
    },
    {
      label: "Fats",
      value: targets.fats ? `${targets.fats}g` : "0g",
      sub: "daily target",
      icon: Footprints,
      color: "#7BE929",
    },
    {
      label: "Sleep",
      value: `${profile.sleep_hours ?? 0}h`,
      sub: "logged profile",
      icon: Moon,
      color: "#A875FF",
    },
  ];

  const milestones: Milestone[] = [
    {
      label: goalWeight ? `Reach ${goalWeight} kg` : "Set body goal",
      progress: progressToGoal,
    },
    {
      label: targets.protein ? `Hit ${targets.protein}g protein daily` : "Set protein target",
      progress: targets.protein ? 75 : 0,
    },
    {
      label: `Maintain ${profile.sleep_hours ?? 8}h sleep`,
      progress: sleepScore || 0,
    },
  ];

  return {
    name: profile.name?.trim() || "there",
    range: getCurrentWeekRange(),
    healthScore,
    status,
    sleepScore,
    hydrationScore,
    recoveryScore,
    calories: targets.calories ?? 0,
    protein: targets.protein ?? 0,
    carbs: targets.carbs ?? 0,
    fats: targets.fats ?? 0,
    waterTarget: targets.water_target || `${profile.water_intake ?? 2.5}L`,
    waterLiters,
    weight,
    goalWeight,
    progressToGoal,
    goal,
    bmi: analytics.bmi ?? 0,
    bodyFat: analytics.body_fat ?? 0,
    metabolicAge: analytics.metabolic_age ?? 0,
    mealPlanDays,
    insight:
      plan?.health_insight ||
      plan?.coach_message ||
      "Generate a plan from profile inputs to unlock your personalized health report.",
    weeklySummary,
    achievements,
    highlights,
    comparisons,
    milestones,
    healthTrend: scoreTrend(healthScore),
    weightTrend: weightTrend(weight, goalWeight),
  };
}

export default function AIHealthReport() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [reportData, setReportData] = useState<ReportData>(() => getHealthReportData());
  const [range, setRange] = useState(reportData.range);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const next = getHealthReportData();
      setReportData(next);
      setRange(next.range);
    };

    window.addEventListener("storage", refresh);
    window.addEventListener("ai-plan-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ai-plan-updated", refresh);
    };
  }, []);

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          <Header
            range={range}
            setRange={setRange}
            downloaded={downloaded}
            onDownload={() => setDownloaded(true)}
          />

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1.04fr_0.9fr_0.9fr_0.9fr_1fr]">
            <HealthScoreCard data={reportData} />
            <WeeklySummary data={reportData} />
            <TopAchievements achievements={reportData.achievements} />
            <WeekHighlights highlights={reportData.highlights} />
            <ReportSummary data={reportData} />
          </div>

          <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1.16fr_0.85fr_1.2fr]">
            <HealthScoreTrend data={reportData} />
            <WeightProgress data={reportData} />
            <BodyComposition data={reportData} />
          </div>

          <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[1.35fr_0.62fr_0.95fr]">
            <MonthlyComparison comparisons={reportData.comparisons} />
            <NextMilestones milestones={reportData.milestones} />
            <AIRecommendationSummary data={reportData} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({
  range,
  setRange,
  downloaded,
  onDownload,
}: {
  range: string;
  setRange: (value: string) => void;
  downloaded: boolean;
  onDownload: () => void;
}) {
  const [shared, setShared] = useState(false);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="flex items-center gap-3 text-[28px] font-black uppercase leading-none tracking-[0.02em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
          AI Health Report
          <Sparkles className="text-[#A6FF4D]" size={24} />
        </h2>

        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
          Your personalized health report & achievements
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-bold text-white/85">
          <CalendarDays size={17} />
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="bg-transparent text-white outline-none"
          >
            <option className="bg-[#07110A]">{range}</option>
            <option className="bg-[#07110A]">Latest generated plan</option>
            <option className="bg-[#07110A]">This Month</option>
          </select>
        </label>

        <button
          onClick={() => setShared(true)}
          className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white transition hover:border-[#18D3D0]/40 hover:text-[#18D3D0]"
        >
          <Share2 size={17} />
          {shared ? "Shared" : "Share Report"}
        </button>

        <button
          onClick={onDownload}
          className="inline-flex items-center gap-3 rounded-2xl bg-[#A6FF4D] px-5 py-3 text-[13px] font-black text-black shadow-[0_0_34px_rgba(166,255,77,.28)] transition hover:scale-[1.02]"
        >
          <Download size={17} />
          {downloaded ? "Downloaded" : "Download PDF"}
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
    <div className="mt-5 flex flex-wrap gap-4 border-b border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative flex items-center gap-2 px-3 pb-3 text-[13px] font-bold transition ${
            activeTab === tab
              ? "text-[#A6FF4D]"
              : "text-white/70 hover:text-white"
          }`}
        >
          {tab === "Overview" && <Sparkles size={15} />}
          {tab === "Achievements" && <Star size={15} />}
          {tab === "Trends" && <RefreshCcw size={15} />}
          {tab === "Comparisons" && <BarIcon />}
          {tab === "Recommendations" && <ShieldCheck size={15} />}

          {tab}

          {activeTab === tab && (
            <span className="absolute bottom-[-1px] left-0 h-[2px] w-full rounded-full bg-[#A6FF4D] shadow-[0_0_16px_rgba(166,255,77,.7)]" />
          )}
        </button>
      ))}
    </div>
  );
}

function HealthScoreCard({ data }: { data: ReportData }) {
  const angle = Math.max(0, Math.min(data.healthScore, 100)) * 3.6;

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Health Score" icon={Info} />

      <div className="grid place-items-center">
        <div
          className="grid h-[155px] w-[155px] place-items-center rounded-full shadow-[0_0_55px_rgba(166,255,77,.25)]"
          style={{
            background: `conic-gradient(#18D3D0 0deg ${angle * 0.2}deg,#A6FF4D ${angle * 0.2}deg ${angle}deg,rgba(255,255,255,.08) ${angle}deg)`,
          }}
        >
          <div className="grid h-[116px] w-[116px] place-items-center rounded-full bg-[#07110A] text-center">
            <div>
              <p className="text-[42px] font-black leading-none text-white">
                {data.healthScore}
              </p>
              <p className="mt-1.5 text-[14px] font-bold text-[#A6FF4D]">
                {data.status}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-2 rounded-xl bg-[#A6FF4D]/8 px-3 py-1 text-[11px] text-white/80">
          <span className="text-[#A6FF4D]">Latest</span> generated score
        </p>
      </div>

      <MiniHealthChart data={data.healthTrend} />
    </Card>
  );
}

function WeeklySummary({ data }: { data: ReportData }) {
  const [selected, setSelected] = useState("Consistency");

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Weekly Summary" icon={Info} />

      <div className="space-y-2.5">
        {data.weeklySummary.map((item) => {
          const Icon = item.icon;
          const active = selected === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setSelected(item.label)}
              className={`flex w-full items-center gap-3 border-b border-white/8 pb-2.5 text-left transition last:border-0 ${
                active ? "text-white" : "opacity-85 hover:opacity-100"
              }`}
            >
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-white/[0.04]"
                style={{
                  color: item.color,
                  borderColor: active ? item.color : `${item.color}30`,
                }}
              >
                <Icon size={15} />
              </div>

              <p className="min-w-0 flex-1 text-[13px] font-black text-white">
                {item.label}
              </p>

              <p className="text-[14px] font-black text-white">{item.value}</p>

              <p className="text-[11px] text-[#A6FF4D]">{item.status}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[12px] text-white/75">
        <span className="mr-2 text-[#A6FF4D]">✧</span>
        Latest AI health summary loaded from your generated plan 💚
      </p>
    </Card>
  );
}

function TopAchievements({ achievements }: { achievements: Achievement[] }) {
  const [checked, setChecked] = useState<string[]>(
    achievements.map((achievement) => achievement.title),
  );

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Top Achievements" icon={Info} />

      <div className="space-y-2.5">
        {achievements.map((item) => {
          const Icon = item.icon;
          const isChecked = checked.includes(item.title);

          return (
            <button
              key={item.title}
              onClick={() =>
                setChecked((prev) =>
                  prev.includes(item.title)
                    ? prev.filter((title) => title !== item.title)
                    : [...prev, item.title],
                )
              }
              className="flex w-full gap-3 border-b border-white/8 pb-2.5 text-left transition hover:bg-white/[0.02] last:border-0"
            >
              <div
                className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border bg-white/[0.04]"
                style={{
                  color: item.color,
                  borderColor: `${item.color}40`,
                }}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-black text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-white/65">
                  {item.text}
                </p>
              </div>

              <CheckCircle2
                size={16}
                className={`shrink-0 ${
                  isChecked ? "text-[#A6FF4D]" : "text-white/20"
                }`}
              />
            </button>
          );
        })}
      </div>

      <button className="mt-2 flex w-full items-center justify-end gap-2 text-[12px] font-black text-[#A6FF4D]">
        View All Achievements <ArrowRight size={14} />
      </button>
    </Card>
  );
}

function WeekHighlights({ highlights }: { highlights: Highlight[] }) {
  const [selected, setSelected] = useState(highlights[0]?.text || "");

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="This Week Highlights" />

      <div className="space-y-2.5">
        {highlights.map((item) => {
          const Icon = item.icon;
          const active = selected === item.text;

          return (
            <button
              key={item.text}
              onClick={() => setSelected(item.text)}
              className={`flex w-full gap-3 border-b border-white/8 pb-2.5 text-left transition last:border-0 ${
                active ? "opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-white/[0.04]"
                style={{
                  color: item.color,
                  borderColor: active ? item.color : `${item.color}30`,
                }}
              >
                <Icon size={15} />
              </div>

              <p className="text-[12px] leading-5 text-white/75">
                {item.text}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ReportSummary({ data }: { data: ReportData }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="h-[390px] overflow-hidden">
      <CardTitle title="Health Report Summary" />

      <img
        src={HEALTH_SYMBOL}
        alt="Health report trophy"
        className="mx-auto h-[175px] w-[175px] object-contain drop-shadow-[0_0_40px_rgba(166,255,77,.38)]"
      />

      <p className="mt-3 text-[12px] leading-5 text-white/75">
        {data.insight}
      </p>
      <p className="mt-1.5 text-[12px] leading-5 text-white/75">
        Keep going, {data.name}! You&apos;re doing amazing.
      </p>

      {open && (
        <p className="mt-2 rounded-xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 px-3 py-2 text-[11px] leading-4 text-white/75">
          Detailed report unlocked: your strongest signals are nutrition target,
          hydration, sleep recovery and consistency with your selected goal.
        </p>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-[#A6FF4D]/30 bg-[#A6FF4D]/5 px-4 py-2.5 text-[12px] font-black text-[#A6FF4D]"
      >
        {open ? "Hide Detailed Report" : "View Detailed Report"}
        <ArrowRight size={15} />
      </button>
    </Card>
  );
}

function HealthScoreTrend({ data }: { data: ReportData }) {
  return (
    <Card className="h-[250px] overflow-hidden">
      <CardTitle title="Health Score Trend" icon={Info} right="Latest 8 Signals" />
      <LineChart
        data={data.healthTrend}
        color="#A6FF4D"
        labels={["S1", "S2", "S3", "S4", "S5", "S6", "S7", "Now"]}
      />
      <p className="mt-1 text-[12px] text-white/75">
        <span className="mr-2 text-[#A6FF4D]">✧</span>
        Latest generated health score:{" "}
        <span className="text-[#A6FF4D]">{data.healthScore}</span>
      </p>
    </Card>
  );
}

function WeightProgress({ data }: { data: ReportData }) {
  return (
    <Card className="h-[250px] overflow-hidden">
      <CardTitle title="Weight Direction" icon={Info} right="Plan Based" />

      <p className="text-[24px] font-black leading-none text-white">
        {data.weight || 0}
        <span className="ml-1 text-[14px] font-medium text-white/65">kg</span>
      </p>
      <p className="mt-1 text-[11px] font-bold text-[#A6FF4D]">
        Goal direction: {data.goalWeight || data.weight || 0} kg
      </p>

      <LineChart
        data={data.weightTrend}
        color="#18D3D0"
        labels={["Start", "S2", "S3", "S4", "S5", "S6", "S7", "Goal"]}
        compact
      />

      <div className="mt-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
        <div className="mb-2 flex justify-between text-[11px]">
          <span className="text-white/65">Goal: {data.goalWeight || data.weight || 0} kg</span>
          <span className="font-bold text-white">Progress: {data.progressToGoal}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#18D3D0]"
            style={{ width: `${data.progressToGoal}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

function BodyComposition({ data }: { data: ReportData }) {
  const fatMass = data.weight && data.bodyFat ? Number(((data.weight * data.bodyFat) / 100).toFixed(1)) : 0;
  const waterWeight = data.weight ? Number((data.weight * 0.08).toFixed(1)) : 0;
  const muscleMass = data.weight ? Number(Math.max(data.weight - fatMass - waterWeight, 0).toFixed(1)) : 0;

  const musclePercent = data.weight ? Math.round((muscleMass / data.weight) * 100) : 0;
  const fatPercent = data.bodyFat ? Math.round(data.bodyFat) : 0;
  const waterPercent = data.weight ? Math.round((waterWeight / data.weight) * 100) : 0;

  return (
    <Card className="h-[250px] overflow-hidden">
      <CardTitle
        title="Body Composition Overview"
        icon={Info}
        right="Generated"
      />

      <div className="grid items-center gap-4 md:grid-cols-[150px_1fr]">
        <div className="relative mx-auto h-[135px] w-[135px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#A6FF4D 0deg ${musclePercent * 3.6}deg,#FFB347 ${musclePercent * 3.6}deg ${
                (musclePercent + fatPercent) * 3.6
              }deg,#38BDF8 ${(musclePercent + fatPercent) * 3.6}deg 360deg)`,
            }}
          />
          <div className="absolute inset-[22px] grid place-items-center rounded-full bg-[#07110A] text-center">
            <div>
              <p className="text-[20px] font-black">{data.weight || 0} kg</p>
              <p className="text-[11px] text-white/65">Total Weight</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <BodyLegend
            color="#A6FF4D"
            label="Lean Mass"
            value={`${muscleMass} kg`}
            sub={`(${musclePercent}%)`}
          />
          <BodyLegend
            color="#FFB347"
            label="Fat Mass"
            value={`${fatMass} kg`}
            sub={`(${fatPercent}%)`}
          />
          <BodyLegend
            color="#38BDF8"
            label="Water Weight"
            value={`${waterWeight} kg`}
            sub={`(${waterPercent}%)`}
          />
        </div>
      </div>

      <div className="mt-3 grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-3">
        <CompositionStat label="BMI" value={`${data.bmi || 0}`} color="#A6FF4D" />
        <CompositionStat label="Body Fat" value={`${data.bodyFat || 0}%`} color="#FFB347" />
        <CompositionStat
          label="Metabolic Age"
          value={`${data.metabolicAge || 0}`}
          color="#18D3D0"
        />
      </div>
    </Card>
  );
}

function MonthlyComparison({ comparisons }: { comparisons: Comparison[] }) {
  const [selected, setSelected] = useState("Calories");

  return (
    <Card className="h-full min-h-[185px] overflow-hidden">
      <div className="mb-3 flex items-center gap-3">
        <p className="text-[14px] font-black uppercase tracking-[0.1em] text-[#A6FF4D]">
          Generated Targets
        </p>
        <Info size={14} className="text-white/55" />
        <span className="text-[11px] text-white/55">latest plan</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {comparisons.map((item) => {
          const Icon = item.icon;
          const active = selected === item.label;

          return (
            <button
              key={item.label}
              onClick={() => setSelected(item.label)}
              className={`h-[104px] rounded-2xl border p-3.5 text-left transition ${
                active
                  ? "border-[#A6FF4D]/40 bg-[#A6FF4D]/8"
                  : "border-white/10 bg-white/[0.04] hover:border-[#A6FF4D]/25"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} style={{ color: item.color }} />
                <p className="text-[12px] font-bold text-white/80">
                  {item.label}
                </p>
              </div>

              <p className="mt-3 text-[21px] font-black leading-none text-white">
                {item.value}
              </p>

              <p className="mt-2 text-[11px] text-white/60">
                <span className="text-[#A6FF4D]">↑</span> {item.sub}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function NextMilestones({ milestones }: { milestones: Milestone[] }) {
  const [completed, setCompleted] = useState<string[]>([]);

  return (
    <Card className="h-full min-h-[185px] overflow-hidden">
      <CardTitle title="Next Milestones" icon={Info} />

      <div className="space-y-2.5">
        {milestones.map((item) => {
          const done = completed.includes(item.label);

          return (
            <button
              key={item.label}
              onClick={() =>
                setCompleted((prev) =>
                  prev.includes(item.label)
                    ? prev.filter((label) => label !== item.label)
                    : [...prev, item.label],
                )
              }
              className="w-full text-left"
            >
              <div className="mb-1.5 flex justify-between text-[12px]">
                <p className={done ? "text-[#A6FF4D]" : "text-white/80"}>
                  {item.label}
                </p>
                <p className="font-black text-white">{item.progress}%</p>
              </div>

              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#A6FF4D] transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function AIRecommendationSummary({ data }: { data: ReportData }) {
  const tips = useMemo(
    () => [
      {
        title: `Follow ${data.calories.toLocaleString()} kcal target`,
        sub: "for your selected goal",
        icon: Sparkles,
      },
      {
        title: `Hit ${data.protein}g protein`,
        sub: "for satiety and recovery",
        icon: ShieldCheck,
      },
      {
        title: `Maintain ${data.waterTarget} hydration`,
        sub: "for recovery and energy",
        icon: Moon,
      },
    ],
    [data.calories, data.protein, data.waterTarget],
  );

  const [selectedTip, setSelectedTip] = useState(tips[0].title);

  useEffect(() => {
    setSelectedTip(tips[0].title);
  }, [tips]);

  return (
    <Card className="h-full min-h-[185px] overflow-hidden">
      <div className="grid h-full items-center gap-3 md:grid-cols-[1fr_170px]">
        <div>
          <CardTitle title="AI Recommendation Summary" icon={Info} />

          <p className="mt-0 text-[11px] text-white/60">
            Based on your generated profile, AI suggests:
          </p>

          <div className="mt-2 space-y-1.5">
            {tips.map((tip) => (
              <RecommendationLine
                key={tip.title}
                icon={tip.icon}
                text={tip.title}
                sub={tip.sub}
                active={selectedTip === tip.title}
                onClick={() => setSelectedTip(tip.title)}
              />
            ))}
          </div>
        </div>

        <img
          src={AI_BRAIN}
          alt="AI recommendation brain"
          className="mx-auto h-[160px] w-[160px] object-contain drop-shadow-[0_0_40px_rgba(24,211,208,.4)]"
        />
      </div>
    </Card>
  );
}

function RecommendationLine({
  icon: Icon,
  text,
  sub,
  active,
  onClick,
}: {
  icon: ElementType;
  text: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full gap-2 rounded-xl p-1 text-left transition ${
        active ? "bg-[#A6FF4D]/8" : "hover:bg-white/[0.04]"
      }`}
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D]">
        <Icon size={14} />
      </div>

      <div>
        <p className="text-[11px] font-black leading-4 text-white">{text}</p>
        <p className="text-[10px] leading-4 text-white/60">{sub}</p>
      </div>
    </button>
  );
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[22px] border border-white/10 bg-[#07110A]/70 p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({
  title,
  icon: Icon,
  right,
}: {
  title: string;
  icon?: ElementType;
  right?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <p className="text-[14px] font-black uppercase tracking-[0.1em] text-[#A6FF4D]">
          {title}
        </p>
        {Icon && <Icon size={14} className="text-white/55" />}
      </div>

      {right && (
        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-bold text-white/75">
          {right}
          <ChevronDown size={13} />
        </button>
      )}
    </div>
  );
}

function MiniHealthChart({ data }: { data: number[] }) {
  return (
    <svg viewBox="0 0 300 78" className="mt-3 h-[78px] w-full overflow-visible">
      {[0, 1, 2].map((line) => (
        <line
          key={line}
          x1="20"
          x2="285"
          y1={16 + line * 22}
          y2={16 + line * 22}
          stroke="rgba(255,255,255,.08)"
        />
      ))}

      <path
        d={`M 22,68 ${data
          .map((value, index) => {
            const x = 22 + index * 43;
            const y = 68 - ((value - 40) / 60) * 52;
            return `L ${x},${y}`;
          })
          .join(" ")} L 280,68 Z`}
        fill="rgba(166,255,77,.12)"
      />

      <polyline
        points={data
          .map((value, index) => {
            const x = 22 + index * 43;
            const y = 68 - ((value - 40) / 60) * 52;
            return `${x},${y}`;
          })
          .join(" ")}
        fill="none"
        stroke="#A6FF4D"
        strokeWidth="2.5"
      />

      {data.map((value, index) => {
        const x = 22 + index * 43;
        const y = 68 - ((value - 40) / 60) * 52;
        return <circle key={index} cx={x} cy={y} r="4" fill="#A6FF4D" />;
      })}
    </svg>
  );
}

function LineChart({
  data,
  color,
  labels,
  compact,
}: {
  data: number[];
  color: string;
  labels: string[];
  compact?: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const viewHeight = compact ? 120 : 135;
  const chartBottom = compact ? 104 : 116;
  const chartRange = compact ? 70 : 82;

  return (
    <svg
      viewBox={`0 0 520 ${viewHeight}`}
      className={`${compact ? "h-[115px]" : "h-[130px]"} mt-2 w-full overflow-visible`}
    >
      {[0, 1, 2].map((line) => (
        <line
          key={line}
          x1="30"
          x2="500"
          y1={26 + line * 34}
          y2={26 + line * 34}
          stroke="rgba(255,255,255,.08)"
        />
      ))}

      <path
        d={`M 32,${chartBottom} ${data
          .map((value, index) => {
            const x = 32 + index * (450 / Math.max(data.length - 1, 1));
            const y =
              chartBottom -
              ((value - min) / (max - min || 1)) * chartRange;
            return `L ${x},${y}`;
          })
          .join(" ")} L 482,${chartBottom} Z`}
        fill={color}
        opacity="0.12"
      />

      <polyline
        points={data
          .map((value, index) => {
            const x = 32 + index * (450 / Math.max(data.length - 1, 1));
            const y =
              chartBottom -
              ((value - min) / (max - min || 1)) * chartRange;
            return `${x},${y}`;
          })
          .join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="3"
        filter={`drop-shadow(0 0 10px ${color})`}
      />

      {data.map((value, index) => {
        const x = 32 + index * (450 / Math.max(data.length - 1, 1));
        const y =
          chartBottom - ((value - min) / (max - min || 1)) * chartRange;
        return <circle key={index} cx={x} cy={y} r="5" fill={color} />;
      })}

      {labels.map((label, index) => (
        <text
          key={`${label}-${index}`}
          x={34 + index * (450 / Math.max(labels.length - 1, 1))}
          y={compact ? "118" : "132"}
          fill="rgba(255,255,255,.65)"
          fontSize="11"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

function BodyLegend({
  color,
  label,
  value,
  sub,
}: {
  color: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-3 text-[12px] text-white/80">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        {label}
      </p>
      <p className="text-[12px] font-black text-white">{value}</p>
      <p className="text-[11px] text-white/60">{sub}</p>
    </div>
  );
}

function CompositionStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <p className="text-[12px] text-white/70">
      {label}{" "}
      <span className="font-black" style={{ color }}>
        {value}
      </span>
    </p>
  );
}

function BarIcon() {
  return (
    <span className="grid h-[15px] w-[15px] place-items-center rounded border border-white/25 text-[9px]">
      ↔
    </span>
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
