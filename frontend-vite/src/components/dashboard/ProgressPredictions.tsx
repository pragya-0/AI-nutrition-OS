import { useEffect, useMemo, useState } from "react";
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

type StoredGeneratedPlan = {
  success?: boolean;
  user_profile?: {
    name?: string;
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    goal?: string;
    diet?: string;
    activity?: string;
    water_intake?: number;
    sleep_hours?: number;
  };
  analytics?: {
    bmi?: number;
    body_fat?: number;
    metabolic_age?: number;
    health_score?: number;
    sleep_score?: number;
    hydration_score?: number;
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
  coach_message?: string;
  ai_tip?: string;
  health_insight?: string;
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
  if (!value) return "Personalized Goal";

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

function formatFutureDate(daysFromNow: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);

  return `by ${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}

function buildWeightTrend(currentWeight: number, goalWeight: number): TrendPoint[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startWeight =
    goalWeight < currentWeight ? currentWeight + 0.6 : currentWeight - 0.4;

  return labels.map((label, index) => {
    const progressRatio = index / Math.max(labels.length - 1, 1);
    const projected =
      startWeight + (currentWeight - startWeight) * progressRatio;

    return {
      label,
      value: Number(projected.toFixed(1)),
      lastValue: Number((startWeight + 0.4).toFixed(1)),
      goal: Number(goalWeight.toFixed(1)),
    };
  });
}

function buildSimpleTrend(
  base: number,
  target: number,
  direction: "up" | "down",
): TrendPoint[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return labels.map((label, index) => {
    const ratio = index / Math.max(labels.length - 1, 1);
    const value =
      direction === "down"
        ? base - Math.abs(base - target) * 0.38 * ratio
        : base + Math.abs(target - base) * 0.38 * ratio;

    return {
      label,
      value: Number(value.toFixed(1)),
      lastValue: Number((base * 0.97).toFixed(1)),
      goal: Number(target.toFixed(1)),
    };
  });
}

function buildCalorieTrend(calories: number): TrendPoint[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const multipliers = [0.92, 0.95, 0.98, 0.94, 1.02, 0.97, 1];

  return labels.map((label, index) => ({
    label,
    value: Math.round(calories * multipliers[index]),
    lastValue: Math.round(calories * 0.88),
    goal: calories,
  }));
}

function buildForecast(seed: number) {
  return Array.from({ length: 8 }, (_, index) =>
    Math.min(92, Math.round(seed + index * 7 + index * index * 0.45)),
  );
}

const fallbackProgressData: ProgressData = {
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
    percentage: 0,
    label: "Overall Progress",
    cta: "View Detailed Progress",
    stats: [
      {
        id: "weight",
        label: "Weight",
        value: "Not ready",
        subtext: "generate plan first",
        icon: TrendingDown,
      },
      {
        id: "body-fat",
        label: "Body Fat",
        value: "Waiting",
        subtext: "analytics pending",
        icon: Percent,
      },
      {
        id: "muscle",
        label: "Protein",
        value: "0g",
        subtext: "target pending",
        icon: Dumbbell,
      },
      {
        id: "energy",
        label: "Energy",
        value: "Waiting",
        subtext: "sleep + hydration",
        icon: Zap,
      },
    ],
  },
  trendMetrics: [
    {
      id: "weight",
      label: "Weight",
      value: "0",
      unit: "kg",
      change: "Generate plan",
      icon: Scale,
      trend: buildWeightTrend(70, 65),
    },
    {
      id: "body-fat",
      label: "Body Fat %",
      value: "0",
      unit: "%",
      change: "Generate plan",
      icon: Percent,
      trend: buildSimpleTrend(28, 24, "down"),
    },
    {
      id: "protein",
      label: "Protein",
      value: "0",
      unit: "g",
      change: "Generate plan",
      icon: Dumbbell,
      trend: buildSimpleTrend(70, 100, "up"),
    },
    {
      id: "calories",
      label: "Calories",
      value: "0",
      unit: "kcal",
      change: "Generate plan",
      icon: Flame,
      trend: buildCalorieTrend(1800),
    },
  ],
  predictions: [
    {
      id: "weight-prediction",
      title: "Weight Prediction",
      description: "Generate a plan to estimate your target of",
      value: "-- kg",
      date: formatFutureDate(45),
      confidence: 0,
      icon: Scale,
      theme: "lime",
      forecast: buildForecast(20),
    },
    {
      id: "body-fat-prediction",
      title: "Body Fat Prediction",
      description: "Generate a plan to estimate your target of",
      value: "--%",
      date: formatFutureDate(60),
      confidence: 0,
      icon: Percent,
      theme: "purple",
      forecast: buildForecast(22),
    },
    {
      id: "protein-prediction",
      title: "Protein Consistency",
      description: "Generate a plan to estimate your target of",
      value: "--g",
      date: formatFutureDate(21),
      confidence: 0,
      icon: Dumbbell,
      theme: "cyan",
      forecast: buildForecast(24),
    },
    {
      id: "energy-prediction",
      title: "Energy Level Prediction",
      description: "Generate a plan to estimate your target of",
      value: "--%",
      date: formatFutureDate(30),
      confidence: 0,
      icon: Zap,
      theme: "amber",
      forecast: buildForecast(26),
    },
  ],
  aiInsight: {
    title: "AI Insight",
    message:
      "Generate a nutrition plan first. Progress predictions will then use your profile, calorie target, protein target, hydration, sleep, and health score.",
    recommendations: [
      {
        id: "sleep",
        icon: Moon,
        label: "Set sleep target",
        highlight: "during onboarding",
      },
      {
        id: "water",
        icon: Droplets,
        label: "Add hydration target",
        highlight: "in profile",
      },
      {
        id: "protein",
        icon: Dumbbell,
        label: "Generate plan for",
        highlight: "protein goal",
      },
    ],
    cta: "View AI Recommendations",
  },
  panels: {
    detailedProgress: {
      title: "Detailed Progress",
      points: [
        "Generate a plan to activate personalized progress tracking.",
        "Progress history will become more accurate after scan, hydration, sleep, and workout logs are connected.",
      ],
    },
    allMetrics: {
      title: "All Metrics Overview",
      points: [
        "Weight, body fat, protein, calories, hydration, sleep, and recovery are prepared for generated-plan data.",
        "Database-backed history can later replace these generated estimates.",
      ],
    },
    predictionsInfo: {
      title: "How AI Predictions Work",
      points: [
        "Predictions use your generated profile, target calories, protein, health score, hydration, and sleep values.",
        "Confidence improves when real historical progress logs are available.",
      ],
    },
    recommendations: {
      title: "AI Recommendations",
      points: [
        "Complete onboarding and generate a plan.",
        "Connect scanner and progress logs for stronger predictions.",
      ],
    },
    exportReport: {
      title: "Export Report",
      points: [
        "Progress report will be prepared from your latest generated plan.",
        "Later this button can download a PDF or CSV from the backend API.",
      ],
    },
  },
};

function buildProgressDataFromPlan(plan: StoredGeneratedPlan): ProgressData {
  if (!plan?.success) return fallbackProgressData;

  const profile = plan.user_profile || {};
  const analytics = plan.analytics || {};
  const targets = plan.targets || {};

  const currentWeight = profile.weight || 70;
  const goal = profile.goal || "weight_loss";
  const formattedGoal = formatLabel(goal);
  const calories = targets.calories || 0;
  const protein = targets.protein || 0;
  const waterTarget = parseWaterTarget(targets.water_target, profile.water_intake || 2.5);
  const healthScore = analytics.health_score || 80;
  const sleepScore = analytics.sleep_score || 75;
  const hydrationScore = analytics.hydration_score || 80;
  const bodyFat = analytics.body_fat || 25;
  const bmi = analytics.bmi || 0;

  const isWeightLoss = goal.includes("weight") || goal.includes("fat");
  const isMuscleGain = goal.includes("muscle");

  const targetWeight = isWeightLoss
    ? Math.max(currentWeight - 4, 45)
    : isMuscleGain
      ? currentWeight + 3
      : currentWeight;

  const targetBodyFat = isWeightLoss
    ? Math.max(bodyFat - 3, 12)
    : Math.max(bodyFat - 1, 10);

  const targetProtein = protein || Math.round(currentWeight * 1.6);
  const energyTarget = Math.min(Math.round((sleepScore + hydrationScore + healthScore) / 3), 100);

  const progressPercentage = Math.min(Math.max(healthScore, 35), 96);

  const weightChange = isWeightLoss
    ? `▼ ${(currentWeight - targetWeight).toFixed(1)} kg goal`
    : isMuscleGain
      ? `▲ ${(targetWeight - currentWeight).toFixed(1)} kg goal`
      : "Maintain current range";

  const proteinChange = protein
    ? `${protein}g target`
    : "Target pending";

  const generatedInsight =
    plan.health_insight ||
    analytics.strategy_details?.reason ||
    `Your generated ${formattedGoal} plan is active. Progress predictions are now based on your current profile, ${calories.toLocaleString()} kcal target, ${protein}g protein target, hydration, sleep, and health score.`;

  const focus =
    analytics.strategy_details?.recommended_focus ||
    analytics.strategy_details?.coaching_focus ||
    [];

  return {
    section: fallbackProgressData.section,
    rangeOptions: fallbackProgressData.rangeOptions,
    overallProgress: {
      percentage: progressPercentage,
      label: "Plan-Based Progress",
      cta: "View Detailed Progress",
      stats: [
        {
          id: "weight",
          label: "Weight Target",
          value: `${targetWeight.toFixed(1)} kg`,
          subtext: weightChange,
          icon: TrendingDown,
        },
        {
          id: "body-fat",
          label: "Body Fat",
          value: `${bodyFat.toFixed(1)}%`,
          subtext: `target ${targetBodyFat.toFixed(1)}%`,
          icon: Percent,
        },
        {
          id: "protein",
          label: "Protein",
          value: `${protein || targetProtein}g`,
          subtext: proteinChange,
          icon: Dumbbell,
        },
        {
          id: "energy",
          label: "Energy",
          value: `${energyTarget}%`,
          subtext: "sleep + hydration",
          icon: Zap,
        },
      ],
    },
    trendMetrics: [
      {
        id: "weight",
        label: "Weight",
        value: currentWeight.toFixed(1),
        unit: "kg",
        change: isWeightLoss
          ? `▼ target ${targetWeight.toFixed(1)} kg`
          : isMuscleGain
            ? `▲ target ${targetWeight.toFixed(1)} kg`
            : "Maintain",
        icon: Scale,
        trend: buildWeightTrend(currentWeight, targetWeight),
      },
      {
        id: "body-fat",
        label: "Body Fat %",
        value: bodyFat.toFixed(1),
        unit: "%",
        change: `target ${targetBodyFat.toFixed(1)}%`,
        icon: Percent,
        trend: buildSimpleTrend(bodyFat, targetBodyFat, "down"),
      },
      {
        id: "protein",
        label: "Protein",
        value: `${protein || targetProtein}`,
        unit: "g",
        change: `${protein || targetProtein}g daily target`,
        icon: Dumbbell,
        trend: buildSimpleTrend(
          Math.max((protein || targetProtein) * 0.75, 1),
          protein || targetProtein,
          "up",
        ),
      },
      {
        id: "calories",
        label: "Calories",
        value: calories ? calories.toLocaleString() : "0",
        unit: "kcal",
        change: calories ? `${calories.toLocaleString()} kcal target` : "target pending",
        icon: Flame,
        trend: buildCalorieTrend(calories || 1800),
      },
    ],
    predictions: [
      {
        id: "weight-prediction",
        title: "Weight Prediction",
        description: isWeightLoss
          ? "With consistency, you can move toward"
          : isMuscleGain
            ? "With protein consistency, you can move toward"
            : "Your plan aims to maintain",
        value: `${targetWeight.toFixed(1)} kg`,
        date: formatFutureDate(isWeightLoss ? 60 : 75),
        confidence: Math.min(progressPercentage + 2, 96),
        icon: Scale,
        theme: "lime",
        forecast: buildForecast(28),
      },
      {
        id: "body-fat-prediction",
        title: "Body Fat Prediction",
        description: "Your target body-fat direction is",
        value: `${targetBodyFat.toFixed(1)}%`,
        date: formatFutureDate(70),
        confidence: Math.min(progressPercentage, 94),
        icon: Percent,
        theme: "purple",
        forecast: buildForecast(25),
      },
      {
        id: "protein-prediction",
        title: "Protein Consistency",
        description: "Your current protein target is",
        value: `${protein || targetProtein}g`,
        date: formatFutureDate(14),
        confidence: Math.min(progressPercentage + 4, 97),
        icon: Dumbbell,
        theme: "cyan",
        forecast: buildForecast(32),
      },
      {
        id: "energy-prediction",
        title: "Energy Level Prediction",
        description: "Sleep and hydration can support",
        value: `${energyTarget}%`,
        date: formatFutureDate(30),
        confidence: Math.min(progressPercentage + 1, 95),
        icon: Zap,
        theme: "amber",
        forecast: buildForecast(30),
      },
    ],
    aiInsight: {
      title: "AI Insight",
      message: generatedInsight,
      recommendations: [
        {
          id: "sleep",
          icon: Moon,
          label: "Maintain sleep around",
          highlight: `${profile.sleep_hours || 8}h`,
        },
        {
          id: "water",
          icon: Droplets,
          label: "Hydration target",
          highlight: `${waterTarget}L daily`,
        },
        {
          id: "protein",
          icon: Dumbbell,
          label: "Protein target",
          highlight: `${protein || targetProtein}g daily`,
        },
      ],
      cta: "View AI Recommendations",
    },
    panels: {
      detailedProgress: {
        title: "Detailed Progress",
        points: [
          `Current plan goal: ${formattedGoal}.`,
          `Current weight: ${currentWeight.toFixed(1)} kg. Plan target: ${targetWeight.toFixed(1)} kg.`,
          `Health score is ${healthScore}/100. BMI ${bmi ? bmi.toFixed(1) : "will appear after analytics"} is used for progress interpretation.`,
        ],
      },
      allMetrics: {
        title: "All Metrics Overview",
        points: [
          `Calories: ${calories ? calories.toLocaleString() : "pending"} kcal.`,
          `Protein: ${protein || targetProtein}g.`,
          `Hydration target: ${waterTarget}L.`,
          `Sleep score: ${sleepScore}/100. Hydration score: ${hydrationScore}/100.`,
        ],
      },
      predictionsInfo: {
        title: "How AI Predictions Work",
        points: [
          "These are generated-plan estimates, not medical predictions.",
          "They use current weight, target calories, protein, sleep, hydration, and health score.",
          "Accuracy will improve after database-backed progress logs are connected.",
        ],
      },
      recommendations: {
        title: "AI Recommendations",
        points: [
          plan.coach_message || "Follow your latest AI coach message.",
          ...focus.map(formatLabel).slice(0, 3),
        ].filter(Boolean),
      },
      exportReport: {
        title: "Export Report",
        points: [
          "Generated-plan progress report prepared for the current dashboard data.",
          "PDF/CSV export can be connected when backend report generation is added.",
        ],
      },
    },
  };
}

function loadProgressData(): ProgressData {
  const storedPlan = getStoredGeneratedPlan();
  return storedPlan?.success ? buildProgressDataFromPlan(storedPlan) : fallbackProgressData;
}


const themeStyles = {
  lime: {
    text: "text-[#A6FF4D]",
    border: "border-[#A6FF4D]/25",
    iconBg: "bg-[#A6FF4D]/15",
    stroke: "#A6FF4D",
    fill: "rgba(166,255,77,.22)",
    glow: "shadow-[0_0_45px_rgba(166,255,77,.12)]",
  },
  purple: {
    text: "text-[#C084FC]",
    border: "border-purple-400/25",
    iconBg: "bg-purple-500/15",
    stroke: "#C084FC",
    fill: "rgba(192,132,252,.2)",
    glow: "shadow-[0_0_45px_rgba(192,132,252,.1)]",
  },
  cyan: {
    text: "text-[#18D3D0]",
    border: "border-[#18D3D0]/25",
    iconBg: "bg-[#18D3D0]/15",
    stroke: "#18D3D0",
    fill: "rgba(24,211,208,.2)",
    glow: "shadow-[0_0_45px_rgba(24,211,208,.1)]",
  },
  amber: {
    text: "text-[#FFB347]",
    border: "border-[#FFB347]/25",
    iconBg: "bg-[#FFB347]/15",
    stroke: "#FFB347",
    fill: "rgba(255,179,71,.2)",
    glow: "shadow-[0_0_45px_rgba(255,179,71,.1)]",
  },
};

export default function ProgressPredictions() {
  const [data, setData] = useState<ProgressData>(() => loadProgressData());
  const [selectedRange, setSelectedRange] = useState(data.rangeOptions[0]);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<keyof ProgressData["panels"] | null>(null);

  const progressDegree = useMemo(() => {
    return Math.round((data.overallProgress.percentage / 100) * 360);
  }, [data.overallProgress.percentage]);

  const activePanelData = activePanel ? data.panels[activePanel] : null;

  useEffect(() => {
    const refreshFromStorage = () => {
      setData(loadProgressData());
    };

    window.addEventListener("storage", refreshFromStorage);
    window.addEventListener("ai-plan-updated", refreshFromStorage);

    return () => {
      window.removeEventListener("storage", refreshFromStorage);
      window.removeEventListener("ai-plan-updated", refreshFromStorage);
    };
  }, []);

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[70vw] -translate-x-1/2 rounded-full bg-[#18D3D0]/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[50vw] rounded-full bg-[#A6FF4D]/[0.07] blur-[125px]" />

      <div className="relative mx-auto w-full max-w-[92vw] overflow-visible rounded-[30px] border border-white/10 bg-[#04100b]/95 p-4 shadow-[0_0_80px_rgba(24,211,208,.08)] sm:p-5 lg:p-6 xl:p-7 2xl:max-w-[1780px]">
        <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h2 className="text-[28px] font-black uppercase leading-none tracking-[0.08em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
              {data.section.title}
            </h2>
            <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
              {data.section.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setRangeOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-black text-white transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
              >
                <CalendarDays size={16} />
                {selectedRange.label}
                <ChevronDown size={16} className={`transition ${rangeOpen ? "rotate-180" : ""}`} />
              </button>

              {rangeOpen && (
                <div className="absolute right-0 z-40 mt-2 w-[170px] rounded-2xl border border-white/10 bg-[#07110A] p-2 shadow-[0_20px_60px_rgba(0,0,0,.45)]">
                  {data.rangeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedRange(option);
                        setRangeOpen(false);
                        setActivePanel(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] font-black transition ${
                        selectedRange.id === option.id
                          ? "bg-[#A6FF4D]/15 text-[#A6FF4D]"
                          : "text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {option.label}
                      {selectedRange.id === option.id && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActivePanel("exportReport")}
              className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-black text-white transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {activePanelData && (
          <div className="mb-5 rounded-[22px] border border-[#18D3D0]/20 bg-[#061611] p-5 shadow-[0_0_35px_rgba(24,211,208,.08)]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h3 className="text-[15px] font-black uppercase tracking-[0.14em] text-[#18D3D0]">
                  {activePanelData.title}
                </h3>

                <ul className="mt-4 grid gap-3">
                  {activePanelData.points.map((point, index) => (
                    <li key={`${activePanelData.title}-${index}`} className="flex gap-3 text-[13px] font-semibold leading-6 text-[#D9E5D9]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A6FF4D]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[12px] font-black text-white hover:border-[#A6FF4D]/30"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_50px_rgba(166,255,77,.07)]">
            <h3 className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
              Overall Progress
            </h3>

            <div className="mt-5 grid items-center gap-5 sm:grid-cols-[150px_minmax(0,1fr)]">
              <div
                className="relative grid h-[150px] w-[150px] place-items-center rounded-full shadow-[0_0_55px_rgba(166,255,77,.28)]"
                style={{
                  background: `conic-gradient(from 180deg, #18D3D0 0deg, #A6FF4D ${progressDegree}deg, rgba(255,255,255,.08) ${progressDegree}deg)`,
                }}
              >
                <div className="absolute inset-5 rounded-full bg-[#04100b]" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(166,255,77,.22),transparent_58%)] blur-sm" />

                <div className="relative text-center">
                  <div className="text-[42px] font-black leading-none text-white">
                    {data.overallProgress.percentage}%
                  </div>
                  <p className="mt-2 text-[12px] leading-tight text-[#D9E6D9]">
                    {data.overallProgress.label}
                  </p>
                </div>
              </div>

              <div className="min-w-0 space-y-3">
                {data.overallProgress.stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[minmax(0,1fr)_100px] items-center gap-3 border-b border-white/10 pb-3 last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Icon size={16} className="shrink-0 text-[#A6FF4D]" />
                        <span className="truncate text-[13px] font-black text-white">
                          {item.label}
                        </span>
                      </div>

                      <div className="text-right">
                        <p className="whitespace-nowrap text-[17px] font-black leading-tight text-white">
                          {item.value}
                        </p>
                        <p className="whitespace-nowrap text-[10px] font-semibold leading-tight text-[#A3B3A3]">
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
              className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[13px] font-black transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
            >
              {data.overallProgress.cta}
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_50px_rgba(24,211,208,.07)]">
            <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <h3 className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                Key Metrics Trend
              </h3>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-[#D9E6D9]">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#A6FF4D]" />
                    This Week
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#18D3D0]" />
                    Last Week
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-[1px] w-6 border-t border-dashed border-white/60" />
                    Goal
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePanel("allMetrics")}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[12px] font-black transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
                >
                  View All Metrics
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.trendMetrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.id}
                    className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_30px_rgba(24,211,208,.035)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className="text-[#A6FF4D]" />
                      <p className="text-[13px] font-black text-white">
                        {metric.label}
                      </p>
                    </div>

                    <p className="mt-4 text-[28px] font-black leading-none text-white">
                      {metric.value}
                      <span className="ml-1.5 text-[11px] font-bold text-[#A3B3A3]">
                        {metric.unit}
                      </span>
                    </p>

                    <p className="mt-2 text-[12px] font-black text-[#A6FF4D]">
                      {metric.change}
                    </p>

                    <TrendChart metric={metric} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_50px_rgba(24,211,208,.07)]">
          <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h3 className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                AI Predictions
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-[#A3B3A3]">
                AI analyzed your current data and predicted your future progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePanel("predictionsInfo")}
              className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[12px] font-black transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
            >
              <Info size={15} />
              How Predictions Work
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.predictions.map((prediction) => {
              const Icon = prediction.icon;
              const theme = themeStyles[prediction.theme];

              return (
                <div
                  key={prediction.id}
                  className={`rounded-[20px] border ${theme.border} bg-white/[0.04] p-4 ${theme.glow}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-2xl ${theme.iconBg} ${theme.text}`}>
                      <Icon size={19} />
                    </div>

                    <h4 className="text-[13px] font-black uppercase tracking-[0.06em] text-white">
                      {prediction.title}
                    </h4>
                  </div>

                  <p className="mt-4 text-[12px] leading-5 text-[#D8E5D8]">
                    {prediction.description}
                  </p>

                  <p className={`mt-3 text-[30px] font-black ${theme.text}`}>
                    {prediction.value}
                  </p>

                  <p className="mt-2 text-[12px] font-bold text-[#D8E5D8]">
                    {prediction.date}
                  </p>

                  <p className="mt-2 text-[12px] font-black text-[#18D3D0]">
                    Confidence: {prediction.confidence}%
                  </p>

                  <PredictionChart prediction={prediction} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-4 rounded-[24px] border border-[#A6FF4D]/15 bg-[radial-gradient(circle_at_7%_50%,rgba(166,255,77,.16),transparent_20%),linear-gradient(90deg,#071d11,#04120d,#071d11)] p-5 shadow-[0_0_50px_rgba(166,255,77,.1)] xl:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_auto] xl:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] bg-[#A6FF4D]/12 text-[#A6FF4D] shadow-[0_0_35px_rgba(166,255,77,.28)]">
              <Brain size={32} />
            </div>

            <div>
              <h3 className="text-[16px] font-black uppercase tracking-[0.12em] text-[#A6FF4D]">
                {data.aiInsight.title}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-[#D9E5D9]">
                {data.aiInsight.message}
              </p>
            </div>
          </div>

          {data.aiInsight.recommendations.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 border-white/10 xl:border-l xl:pl-4"
              >
                <Icon size={22} className="shrink-0 text-[#18D3D0]" />
                <p className="text-[13px] leading-5 text-[#DDE8DD]">
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
            className="flex items-center justify-center gap-3 rounded-2xl bg-[#A6FF4D] px-5 py-3.5 text-[14px] font-black text-[#061006] shadow-[0_0_38px_rgba(166,255,77,.32)] transition hover:scale-[1.01] hover:bg-[#B9FF68]"
          >
            {data.aiInsight.cta}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

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
    <svg viewBox="0 0 320 208" className="mt-4 h-[120px] w-full overflow-visible">
      <polyline points={goalLine} fill="none" stroke="rgba(255,255,255,.45)" strokeDasharray="7 7" strokeWidth="1.8" />
      <polyline points={lastLine} fill="none" stroke="#18D3D0" strokeDasharray="4 6" strokeWidth="1.8" opacity="0.95" />
      <polyline points={currentLine} fill="none" stroke="#A6FF4D" strokeWidth="4" filter="drop-shadow(0 0 10px rgba(166,255,77,.85))" />

      {currentLine.split(" ").map((pair, index) => {
        const [x, y] = pair.split(",");
        return <circle key={`${metric.id}-${index}`} cx={x} cy={y} r="5" fill="#A6FF4D" />;
      })}

      {metric.trend.map((item, index) => (
        <text key={item.label} x={14 + index * 44} y="196" fill="#A3B3A3" fontSize="12" fontWeight="900">
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
    <svg viewBox="0 0 478 258" className="mt-4 h-[130px] w-full overflow-visible">
      <path d={`M ${area} Z`} fill={theme.fill} />
      <polyline points={points} fill="none" stroke={theme.stroke} strokeWidth="4" filter={`drop-shadow(0 0 11px ${theme.stroke})`} />

      {points.split(" ").map((pair, index) => {
        const [x, y] = pair.split(",");
        return <circle key={`${prediction.id}-${index}`} cx={x} cy={y} r="5" fill={theme.stroke} />;
      })}

      <line x1="454" y1="78" x2="454" y2="230" stroke={theme.stroke} strokeWidth="2.4" opacity="0.85" />
      <rect x="352" y="18" width="102" height="48" rx="12" fill={theme.stroke} opacity="0.28" />

      <text x="403" y="49" textAnchor="middle" fill="#F5F8F2" fontSize="16" fontWeight="900">
        {prediction.value}
      </text>
    </svg>
  );
}