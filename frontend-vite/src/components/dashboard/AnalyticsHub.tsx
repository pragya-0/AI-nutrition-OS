import { useEffect, useMemo, useState, type ElementType, type ReactNode } from "react";
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

type AnalyticsData = {
  range: string;
  goal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterTarget: number;
  waterIntake: number;
  sleepHours: number;
  activity: string;
  steps: number;
  healthScore: number;
  hydrationScore: number;
  sleepScore: number;
  coachMessage: string;
  healthInsight: string;
  overviewMetrics: OverviewMetric[];
  micros: Micro[];
  keyInsights: Insight[];
  calorieTrend: number[];
  nutritionTrend: number[];
  hydrationTrend: number[];
  sleepTrend: number[];
};

type StoredGeneratedPlan = {
  success?: boolean;
  user_profile?: {
    name?: string;
    goal?: string;
    diet?: string;
    activity?: string;
    weight?: number;
    sleep_hours?: number;
    water_intake?: number;
  };
  analytics?: {
    health_score?: number;
    hydration_score?: number;
    sleep_score?: number;
    health_status?: string;
    metabolic_strategy?: string;
    strategy_details?: {
      reason?: string;
      recommended_focus?: string[];
      coaching_focus?: string[];
    };
  };
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    water_target?: string;
  };
  meal_plan?: {
    days?: Array<{
      day?: number;
      breakfast?: string;
      lunch?: string;
      snack?: string;
      dinner?: string;
      alternatives?: string[];
      water_target?: string;
      workout_tip?: string;
      meals?: {
        breakfast?: string;
        lunch?: string;
        snack?: string;
        dinner?: string;
      };
    }>;
  };
  coach_message?: string;
  ai_tip?: string;
  health_insight?: string;
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

const fallbackAnalytics: AnalyticsData = {
  range: "Latest generated plan",
  goal: "Personalized Plan",
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  waterTarget: 2.5,
  waterIntake: 0,
  sleepHours: 0,
  activity: "Not Set",
  steps: 0,
  healthScore: 0,
  hydrationScore: 0,
  sleepScore: 0,
  coachMessage: "Generate your AI nutrition plan to unlock analytics.",
  healthInsight: "Your analytics will appear after plan generation.",
  overviewMetrics: [
    {
      id: "nutrition",
      label: "Nutrition Score",
      value: "0",
      subValue: "/100",
      change: "Waiting for generated plan",
      color: "#A6FF4D",
      icon: Brain,
      ring: 0,
    },
    {
      id: "calories",
      label: "Target Calories",
      value: "0",
      subValue: "kcal",
      change: "Generate plan first",
      color: "#FFB347",
      icon: Flame,
    },
    {
      id: "protein",
      label: "Protein Target",
      value: "0g",
      change: "Generate plan first",
      color: "#7BE929",
      icon: Salad,
    },
    {
      id: "hydration",
      label: "Hydration Target",
      value: "0 L",
      subValue: "/ 2.5 L",
      change: "Generate plan first",
      color: "#18D3D0",
      icon: Droplets,
    },
    {
      id: "sleep",
      label: "Sleep Score",
      value: "0",
      subValue: "/100",
      change: "Generate plan first",
      color: "#A875FF",
      icon: Moon,
    },
    {
      id: "steps",
      label: "Activity Mode",
      value: "—",
      change: "Generate plan first",
      color: "#7BE929",
      icon: Footprints,
    },
  ],
  micros: [
    { name: "Protein", value: 0 },
    { name: "Carbs", value: 0 },
    { name: "Fats", value: 0 },
    { name: "Hydration", value: 0 },
    { name: "Sleep", value: 0 },
    { name: "Plan Match", value: 0 },
  ],
  keyInsights: [
    {
      id: "start",
      icon: Brain,
      title: "Generate your plan",
      description: "Analytics will update from your AI-generated nutrition profile.",
      color: "#A6FF4D",
    },
    {
      id: "nutrition",
      icon: Salad,
      title: "Nutrition intelligence pending",
      description: "Calories and macros will appear here.",
      color: "#FFB347",
    },
    {
      id: "hydration",
      icon: Droplets,
      title: "Hydration target pending",
      description: "Your water target will come from the generated plan.",
      color: "#18D3D0",
    },
    {
      id: "sleep",
      icon: Moon,
      title: "Sleep analytics pending",
      description: "Sleep quality appears after assessment.",
      color: "#A875FF",
    },
  ],
  calorieTrend: [0, 0, 0, 0, 0, 0, 0],
  nutritionTrend: [0, 0, 0, 0, 0, 0, 0],
  hydrationTrend: [0, 0, 0, 0, 0, 0, 0],
  sleepTrend: [0, 0, 0, 0, 0, 0, 0],
};

const dateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);

  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${formatter.format(start)} – ${formatter.format(end)}`;
};

function getStoredGeneratedPlan(): StoredGeneratedPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    if (!raw) return null;
    return JSON.parse(raw) as StoredGeneratedPlan;
  } catch {
    return null;
  }
}

function formatLabel(value?: string) {
  if (!value) return "Not Set";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseWaterTarget(value?: string, fallback = 2.5) {
  if (!value) return fallback;

  const match = value.match(/[\d.]+/);
  if (!match) return fallback;

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(Math.round(value), min), max);
}

function targetToTrend(target: number, spread = 0.12) {
  if (!target || target <= 0) return [0, 0, 0, 0, 0, 0, 0];

  return [0.82, 0.88, 0.92, 0.9, 0.96, 1.02, 1].map((factor) =>
    Math.round(target * (factor + spread * 0.08)),
  );
}

function scoreTrend(score: number) {
  const base = score || 0;
  return [base - 12, base - 9, base - 6, base - 4, base - 2, base - 1, base].map(
    (value) => clamp(value),
  );
}

function waterTrend(target: number) {
  if (!target || target <= 0) return [0, 0, 0, 0, 0, 0, 0];

  return [0.72, 0.82, 0.78, 0.9, 0.86, 0.96, 1].map((factor) =>
    Number((target * factor).toFixed(1)),
  );
}

function macroPercent(value: number, total: number) {
  if (!total) return 0;
  return clamp((value / total) * 100);
}

function transformGeneratedPlan(plan: StoredGeneratedPlan | null): AnalyticsData {
  if (!plan?.success) {
    return fallbackAnalytics;
  }

  const profile = plan.user_profile || {};
  const analytics = plan.analytics || {};
  const targets = plan.targets || {};

  const calories = targets.calories || 0;
  const protein = targets.protein || 0;
  const carbs = targets.carbs || 0;
  const fats = targets.fats || 0;

  const waterTarget = parseWaterTarget(
    targets.water_target,
    profile.water_intake || 2.5,
  );

  const waterIntake = profile.water_intake || waterTarget;
  const sleepHours = profile.sleep_hours || 8;
  const sleepScore = analytics.sleep_score || (sleepHours >= 8 ? 95 : sleepHours >= 7 ? 85 : 70);
  const hydrationScore =
    analytics.hydration_score || clamp((waterIntake / Math.max(waterTarget, 1)) * 100);
  const healthScore = analytics.health_score || 85;

  const macroTotal = protein + carbs + fats;
  const proteinPercent = macroPercent(protein, macroTotal);
  const carbsPercent = macroPercent(carbs, macroTotal);
  const fatsPercent = macroPercent(fats, macroTotal);

  const activity = formatLabel(profile.activity);
  const steps =
    profile.activity === "sedentary"
      ? 5000
      : profile.activity === "light"
        ? 6500
        : profile.activity === "active" || profile.activity === "very_active"
          ? 10000
          : 8420;

  const generatedMeals = plan.meal_plan?.days?.length || 0;
  const goal = formatLabel(profile.goal);

  const overviewMetrics: OverviewMetric[] = [
    {
      id: "nutrition",
      label: "Nutrition Score",
      value: String(healthScore),
      subValue: "/100",
      change: "Latest generated plan",
      color: "#A6FF4D",
      icon: Brain,
      ring: healthScore,
    },
    {
      id: "calories",
      label: "Target Calories",
      value: calories.toLocaleString(),
      subValue: "kcal",
      change: `Goal: ${goal}`,
      color: "#FFB347",
      icon: Flame,
    },
    {
      id: "protein",
      label: "Protein Target",
      value: `${protein}g`,
      change: `${proteinPercent}% macro share`,
      color: "#7BE929",
      icon: Salad,
    },
    {
      id: "hydration",
      label: "Hydration Target",
      value: `${waterIntake} L`,
      subValue: `/ ${waterTarget} L`,
      change: `${hydrationScore}% of target`,
      color: "#18D3D0",
      icon: Droplets,
    },
    {
      id: "sleep",
      label: "Sleep Score",
      value: String(sleepScore),
      subValue: "/100",
      change: `${sleepHours}h logged`,
      color: "#A875FF",
      icon: Moon,
    },
    {
      id: "steps",
      label: "Activity Focus",
      value: steps.toLocaleString(),
      change: activity,
      color: "#7BE929",
      icon: Footprints,
    },
  ];

  const micros: Micro[] = [
    { name: "Protein", value: proteinPercent },
    { name: "Carbs", value: carbsPercent },
    { name: "Fats", value: fatsPercent },
    { name: "Hydration", value: hydrationScore },
    { name: "Sleep", value: sleepScore },
    {
      name: "Plan Days",
   value: clamp((generatedMeals / Math.max(generatedMeals || 1, 1)) * 100),
      status: generatedMeals ? `${generatedMeals}d` : "New",
    },
  ];

  const keyInsights: Insight[] = [
    {
      id: "calorie",
      icon: Flame,
      title: `${calories.toLocaleString()} kcal target`,
      description: `Your target is tuned for ${goal.toLowerCase()} and ${activity.toLowerCase()} activity.`,
      color: "#FFB347",
    },
    {
      id: "protein",
      icon: Zap,
      title: `${protein}g protein target`,
      description: "Protein consistency supports satiety, recovery, and body-composition goals.",
      color: "#A6FF4D",
    },
    {
      id: "hydration",
      icon: Droplets,
      title: `Hydration target: ${waterTarget} L`,
      description: `Current plan records ${waterIntake} L/day. Keep it consistent across the week.`,
      color: "#18D3D0",
    },
    {
      id: "sleep",
      icon: Moon,
      title: `Sleep score: ${sleepScore}`,
      description: `${sleepHours}h sleep supports recovery, cravings control, and energy stability.`,
      color: "#A875FF",
    },
  ];

  return {
    range: dateRange(),
    goal,
    calories,
    protein,
    carbs,
    fats,
    waterTarget,
    waterIntake,
    sleepHours,
    activity,
    steps,
    healthScore,
    hydrationScore,
    sleepScore,
    coachMessage: plan.coach_message || "Your AI coach insight will appear here.",
    healthInsight:
      plan.health_insight ||
      analytics.strategy_details?.reason ||
      "Your analytics are based on your latest generated plan.",
    overviewMetrics,
    micros,
    keyInsights,
    calorieTrend: targetToTrend(calories),
    nutritionTrend: scoreTrend(healthScore),
    hydrationTrend: waterTrend(waterTarget),
    sleepTrend: scoreTrend(sleepScore),
  };
}

export default function AnalyticsHub() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState<AnalyticsData>(() =>
    transformGeneratedPlan(getStoredGeneratedPlan()),
  );
  const [range, setRange] = useState(data.range);
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    const refreshFromStorage = () => {
      const fresh = transformGeneratedPlan(getStoredGeneratedPlan());
      setData(fresh);
      setRange(fresh.range);
    };

    window.addEventListener("storage", refreshFromStorage);
    window.addEventListener("ai-plan-updated", refreshFromStorage);

    return () => {
      window.removeEventListener("storage", refreshFromStorage);
      window.removeEventListener("ai-plan-updated", refreshFromStorage);
    };
  }, []);

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

          <OverviewStrip
            activeTabLabel={activeTabLabel}
            overviewMetrics={data.overviewMetrics}
          />

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.92fr_0.98fr]">
            <CalorieTrend calories={data.calories} points={data.calorieTrend} />
            <MacroDistribution
              protein={data.protein}
              carbs={data.carbs}
              fats={data.fats}
            />
            <MicronutrientCoverage micros={data.micros} />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_0.86fr_1fr]">
            <NutritionScoreTrend data={data.nutritionTrend} range={data.range} />
            <HydrationTracker
              values={data.hydrationTrend}
              target={data.waterTarget}
            />
            <SleepQualityTrend data={data.sleepTrend} />
          </div>

          <KeyInsights
            keyInsights={data.keyInsights}
            healthInsight={data.healthInsight}
            reportGenerated={reportGenerated}
            onGenerate={() => setReportGenerated(true)}
          />
        </div>
      </div>
    </section>
  );
}

function Header({
  range,
  setRange,
}: {
  range: string;
  setRange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="flex items-center gap-3 text-[28px] font-black uppercase leading-none tracking-[0.02em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
          Analytics Hub
          <Sparkles className="text-[#A6FF4D]" size={24} />
        </h2>

        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
          Deep insights from your latest generated nutrition profile.
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

function OverviewStrip({
  activeTabLabel,
  overviewMetrics,
}: {
  activeTabLabel: string;
  overviewMetrics: OverviewMetric[];
}) {
  return (
    <div className="mt-5 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="mb-5 text-[15px] font-black uppercase tracking-[0.12em] text-[#A6FF4D]">
        Latest Plan Overview · {activeTabLabel}
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
              {typeof metric.ring === "number" ? (
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
                  {metric.value}
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

function CalorieTrend({
  calories,
  points,
}: {
  calories: number;
  points: number[];
}) {
  return (
    <ChartCard title="Calorie Target Trend" action="Latest Plan">
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
            points={buildChartPoints(points, 900, Math.max(calories * 1.2, 2200))}
            fill="none"
            stroke="#A6FF4D"
            strokeWidth="3"
            filter="drop-shadow(0 0 10px rgba(166,255,77,.65))"
          />

          {buildChartPoints(points, 900, Math.max(calories * 1.2, 2200))
            .split(" ")
            .map((pair, index) => {
              const [x, y] = pair.split(",");
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
            {calories.toLocaleString()} kcal
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
          {calories.toLocaleString()} kcal
        </div>
      </div>

      <p className="mt-3 text-[13px] text-white/70">
        ✧ Your current plan is optimized around{" "}
        <span className="font-black text-[#A6FF4D]">
          {calories.toLocaleString()} kcal
        </span>
        .
      </p>
    </ChartCard>
  );
}

function MacroDistribution({
  protein,
  carbs,
  fats,
}: {
  protein: number;
  carbs: number;
  fats: number;
}) {
  const total = protein + carbs + fats;
  const proteinPercent = macroPercent(protein, total);
  const carbsPercent = macroPercent(carbs, total);
  const fatsPercent = macroPercent(fats, total);

  return (
    <ChartCard title="Macro Distribution">
      <div className="grid items-center gap-5 md:grid-cols-[190px_1fr]">
        <div className="relative mx-auto h-[170px] w-[170px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#20E4A5 0deg ${
                proteinPercent * 3.6
              }deg,#18D3D0 ${proteinPercent * 3.6}deg ${
                (proteinPercent + carbsPercent) * 3.6
              }deg,#FFB347 ${
                (proteinPercent + carbsPercent) * 3.6
              }deg 360deg)`,
            }}
          />
          <div className="absolute inset-[22px] grid place-items-center rounded-full bg-[#07110A] text-center">
            <p className="text-[14px] text-white/75">Plan Avg</p>
            <p className="mt-1 text-[12px] font-black text-white">P • C • F</p>
            <p className="mt-1 text-[15px] font-black text-white">
              {proteinPercent} • {carbsPercent} • {fatsPercent}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <MacroLegend
            color="#20E4A5"
            label="Protein"
            value={`${protein}g (${proteinPercent}%)`}
          />
          <MacroLegend
            color="#18D3D0"
            label="Carbs"
            value={`${carbs}g (${carbsPercent}%)`}
          />
          <MacroLegend
            color="#FFB347"
            label="Fats"
            value={`${fats}g (${fatsPercent}%)`}
          />
        </div>
      </div>

      <p className="mt-5 border-t border-white/10 pt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#A6FF4D]">◉</span>
        Your macro split is loaded from the latest generated plan.
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
        Target
      </span>
    </div>
  );
}

function MicronutrientCoverage({ micros }: { micros: Micro[] }) {
  return (
    <ChartCard title="Plan Coverage" action="Generated">
      <div className="space-y-4">
        {micros.map((micro) => (
          <div key={micro.name} className="grid grid-cols-[100px_1fr_54px] items-center gap-4">
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
        Based on generated target coverage, not food logging history yet.
      </p>
    </ChartCard>
  );
}

function NutritionScoreTrend({
  data,
  range,
}: {
  data: number[];
  range: string;
}) {
  return (
    <ChartCard title="Nutrition Score Over Time">
      <LineChart
        data={data}
        color="#A6FF4D"
        labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      />
      <p className="mt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#A6FF4D]">✩</span>
        Latest plan range: {range}
      </p>
    </ChartCard>
  );
}

function HydrationTracker({
  values,
  target,
}: {
  values: number[];
  target: number;
}) {
  return (
    <ChartCard title="Hydration Tracker">
      <div className="relative h-[220px]">
        <p className="absolute right-0 top-0 text-[13px] font-black text-[#18D3D0]">
          Goal: {target} L
        </p>

        <div className="flex h-full items-end gap-6 border-b border-white/10 px-5 pt-9">
          {values.map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <p className="text-[12px] font-bold text-white">{value}L</p>
              <div
                className="w-7 rounded-t-lg bg-gradient-to-t from-[#0899A5] to-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.35)]"
                style={{ height: `${Math.max(value, 0.2) * 42}px` }}
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
        Hydration target loaded from your latest AI plan.
      </p>
    </ChartCard>
  );
}

function SleepQualityTrend({ data }: { data: number[] }) {
  return (
    <ChartCard title="Sleep Quality Trend" titleColor="#B47CFF">
      <LineChart
        data={data}
        color="#B47CFF"
        labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      />
      <p className="mt-4 text-[13px] text-white/70">
        <span className="mr-2 text-[#B47CFF]">☾</span>
        Sleep trend is derived from your generated profile score.
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
  keyInsights,
  healthInsight,
  reportGenerated,
  onGenerate,
}: {
  keyInsights: Insight[];
  healthInsight: string;
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
            Based on latest plan
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
              {healthInsight}
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
  children: ReactNode;
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

function buildChartPoints(points: number[], min: number, max: number) {
  return points
    .map((value, index) => {
      const x = 45 + index * (430 / Math.max(points.length - 1, 1));
      const y = 190 - ((value - min) / (max - min || 1)) * 145;
      return `${x},${y}`;
    })
    .join(" ");
}
