import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Brain,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Flame,
  Loader2,
  Moon,
  Scale,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { getProgressHistory } from "@/services/api";

type ProgressLog = {
  date?: string;
  created_at?: string;
  weight?: number | null;
  water_intake?: number | null;
  workout_done?: boolean;
  meal_followed?: boolean;
  sleep_hours?: number | null;
};

type StoredGeneratedPlan = {
  success?: boolean;
  user_profile?: {
    weight?: number;
    goal?: string;
    activity?: string;
    sleep_hours?: number;
    water_intake?: number;
  };
  analytics?: {
    bmi?: number;
    body_fat?: number;
    health_score?: number;
    sleep_score?: number;
    hydration_score?: number;
    strategy_details?: {
      reason?: string;
      recommended_focus?: string[];
      coaching_focus?: string[];
    };
  };
  targets?: {
    calories?: number;
    protein?: number;
    water_target?: string;
  };
  coach_message?: string;
  health_insight?: string;
};

type ProgressSnapshot = {
  source: "backend-history" | "plan-snapshot" | "empty";
  logs: ProgressLog[];
  score: number;
  weight: number;
  targetWeight: number;
  calories: number;
  protein: number;
  waterTarget: number;
  avgWater: number;
  avgSleep: number;
  mealAdherence: number;
  workoutAdherence: number;
  goal: string;
  insight: string;
};

function getStoredGeneratedPlan(): StoredGeneratedPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    return raw ? (JSON.parse(raw) as StoredGeneratedPlan) : null;
  } catch {
    return null;
  }
}

function unwrapArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const obj = value as {
      data?: T[];
      history?: T[];
      items?: T[];
      scans?: T[];
      logs?: T[];
      progress?: T[];
      plans?: T[];
    };

    return (
      obj.data ||
      obj.history ||
      obj.items ||
      obj.scans ||
      obj.logs ||
      obj.progress ||
      obj.plans ||
      []
    );
  }

  return [];
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(Math.round(value), min), max);
}

function avg(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value) && value > 0);
  if (!valid.length) return 0;
  return Math.round((valid.reduce((sum, value) => sum + value, 0) / valid.length) * 10) / 10;
}

function formatLabel(value?: string) {
  if (!value) return "Personalized Goal";
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseWaterTarget(value?: string, fallback = 2.5) {
  const match = value?.match(/[\d.]+/);
  const parsed = match ? Number(match[0]) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function targetWeightFromGoal(weight: number, goal?: string) {
  const normalized = (goal || "").toLowerCase();
  if (!weight) return 0;
  if (normalized.includes("weight") || normalized.includes("fat")) return Math.max(weight - 4, 35);
  if (normalized.includes("muscle")) return weight + 3;
  return weight;
}

function buildSnapshot(plan: StoredGeneratedPlan | null, logs: ProgressLog[]): ProgressSnapshot {
  const profile = plan?.user_profile || {};
  const analytics = plan?.analytics || {};
  const targets = plan?.targets || {};

  const weight = logs.find((log) => Number(log.weight))?.weight || profile.weight || 0;
  const targetWeight = targetWeightFromGoal(Number(weight), profile.goal);
  const waterTarget = parseWaterTarget(targets.water_target, profile.water_intake || 2.5);
  const avgWater = avg(logs.map((log) => Number(log.water_intake || 0)));
  const avgSleep = avg(logs.map((log) => Number(log.sleep_hours || 0)));
  const mealAdherence = logs.length ? clamp((logs.filter((log) => log.meal_followed).length / logs.length) * 100) : 0;
  const workoutAdherence = logs.length ? clamp((logs.filter((log) => log.workout_done).length / logs.length) * 100) : 0;

  const historyScore = logs.length
    ? clamp((mealAdherence + workoutAdherence + (avgWater ? (avgWater / waterTarget) * 100 : 0) + (avgSleep ? (avgSleep / 8) * 100 : 0)) / 4)
    : 0;

  return {
    source: logs.length ? "backend-history" : plan?.success ? "plan-snapshot" : "empty",
    logs,
    score: logs.length ? historyScore : analytics.health_score || 0,
    weight: Number(weight || 0),
    targetWeight,
    calories: targets.calories || 0,
    protein: targets.protein || 0,
    waterTarget,
    avgWater: avgWater || profile.water_intake || 0,
    avgSleep: avgSleep || profile.sleep_hours || 0,
    mealAdherence,
    workoutAdherence,
    goal: formatLabel(profile.goal),
    insight:
      logs.length
        ? "Progress is now calculated from backend logs. Forecast-only cards have been removed for public production readiness."
        : plan?.health_insight ||
          "Add progress logs to unlock real progress tracking. Simulated predictions are hidden for production readiness.",
  };
}

export default function ProgressPredictions() {
  const [data, setData] = useState<ProgressSnapshot>(() => buildSnapshot(getStoredGeneratedPlan(), []));
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const loadProgress = async () => {
    setLoading(true);
    setNotice("");

    try {
      const response = await getProgressHistory();
      const logs = unwrapArray<ProgressLog>(response);
      setData(buildSnapshot(getStoredGeneratedPlan(), logs));

      if (!logs.length) {
        setNotice("No backend progress logs yet. Showing a labelled plan snapshot instead of fake predictions.");
      }
    } catch {
      setData(buildSnapshot(getStoredGeneratedPlan(), []));
      setNotice("Progress history API is unavailable. Showing a labelled plan snapshot instead of fake predictions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();

    const refresh = () => loadProgress();
    window.addEventListener("storage", refresh);
    window.addEventListener("ai-plan-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ai-plan-updated", refresh);
    };
  }, []);

  const progressDegree = useMemo(() => Math.round((data.score / 100) * 360), [data.score]);

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-white/10 bg-[#04100b]/95 p-5 shadow-[0_0_80px_rgba(24,211,208,.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          <Header loading={loading} source={data.source} />

          {notice && <ProductionNotice message={notice} />}

          <div className="mt-5 grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
            <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_50px_rgba(166,255,77,.07)]">
              <h3 className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                Progress Snapshot
              </h3>

              <div className="mt-5 grid items-center gap-5 sm:grid-cols-[150px_minmax(0,1fr)]">
                <div
                  className="relative grid h-[150px] w-[150px] place-items-center rounded-full shadow-[0_0_55px_rgba(166,255,77,.28)]"
                  style={{
                    background: `conic-gradient(from 180deg, #18D3D0 0deg, #A6FF4D ${progressDegree}deg, rgba(255,255,255,.08) ${progressDegree}deg)`,
                  }}
                >
                  <div className="absolute inset-5 rounded-full bg-[#04100b]" />
                  <div className="relative text-center">
                    <div className="text-[42px] font-black leading-none text-white">{data.score}%</div>
                    <p className="mt-2 text-[12px] leading-tight text-[#D9E6D9]">
                      {data.source === "backend-history" ? "Real Progress" : "Plan Snapshot"}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 space-y-3">
                  <StatRow icon={Scale} label="Current Weight" value={data.weight ? `${data.weight} kg` : "Pending"} sub={data.targetWeight ? `Target ${data.targetWeight} kg` : "Log weight"} />
                  <StatRow icon={Dumbbell} label="Protein Target" value={`${data.protein || 0}g`} sub="From latest plan" />
                  <StatRow icon={Droplets} label="Hydration" value={`${data.avgWater || 0}L`} sub={`Target ${data.waterTarget}L`} />
                  <StatRow icon={Moon} label="Sleep" value={data.avgSleep ? `${data.avgSleep}h` : "Pending"} sub="From logs/profile" />
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_0_50px_rgba(24,211,208,.07)]">
              <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <h3 className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                    Production Progress Metrics
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#A3B3A3]">
                    Real history is used when available. Fake forecasts are removed.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/10 px-4 py-2.5 text-[12px] font-black text-[#A6FF4D]">
                  <ShieldCheck size={15} />
                  {data.logs.length} logs
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={Activity} label="Meal Adherence" value={`${data.mealAdherence}%`} sub={data.source === "backend-history" ? "From logs" : "Waiting for logs"} />
                <MetricCard icon={Zap} label="Workout Adherence" value={`${data.workoutAdherence}%`} sub={data.source === "backend-history" ? "From logs" : "Waiting for logs"} />
                <MetricCard icon={Flame} label="Calories" value={data.calories ? data.calories.toLocaleString() : "0"} sub="Target kcal" />
                <MetricCard icon={CalendarDays} label="Goal" value={data.goal} sub="Latest profile" />
              </div>

              <div className="mt-5 rounded-[22px] border border-[#18D3D0]/20 bg-[#18D3D0]/5 p-5">
                <p className="flex items-center gap-3 text-[15px] font-black uppercase tracking-[0.14em] text-[#18D3D0]">
                  <Brain size={20} />
                  AI Insight
                </p>
                <p className="mt-3 text-[13px] font-semibold leading-6 text-white/75">{data.insight}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#FFB347]/20 bg-[#2A1A05]/35 p-5">
            <p className="flex items-center gap-3 text-[13px] font-bold leading-6 text-[#FFB347]">
              <AlertTriangle size={18} />
              The old AI prediction cards were intentionally removed. Public users should not see simulated future weight, body fat, or energy forecasts until real longitudinal history exists.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({ loading, source }: { loading: boolean; source: ProgressSnapshot["source"] }) {
  const sourceText =
    source === "backend-history" ? "Backend history active" : source === "plan-snapshot" ? "Plan snapshot" : "Waiting for data";

  return (
    <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
      <div>
        <h2 className="text-[28px] font-black uppercase leading-none tracking-[0.08em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
          Progress Snapshot
        </h2>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
          Production-safe progress tracking without fake prediction charts.
        </p>
      </div>

      <span className="flex w-fit items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-black text-white">
        {loading ? <Loader2 className="animate-spin text-[#A6FF4D]" size={16} /> : <CheckCircle2 className="text-[#A6FF4D]" size={16} />}
        {sourceText}
      </span>
    </div>
  );
}

function ProductionNotice({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-[22px] border border-[#FFB347]/25 bg-[#2A1A05]/45 p-4">
      <p className="flex items-center gap-3 text-[13px] font-bold leading-6 text-[#FFB347]">
        <AlertTriangle size={18} />
        {message}
      </p>
    </div>
  );
}

function StatRow({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_110px] items-center gap-3 border-b border-white/10 pb-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <Icon size={16} className="shrink-0 text-[#A6FF4D]" />
        <span className="truncate text-[13px] font-black text-white">{label}</span>
      </div>
      <div className="text-right">
        <p className="whitespace-nowrap text-[17px] font-black leading-tight text-white">{value}</p>
        <p className="whitespace-nowrap text-[10px] font-semibold leading-tight text-[#A3B3A3]">{sub}</p>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2.5">
        <Icon size={16} className="text-[#A6FF4D]" />
        <p className="text-[13px] font-black text-white">{label}</p>
      </div>
      <p className="mt-4 text-[28px] font-black leading-none text-white">{value}</p>
      <p className="mt-2 text-[12px] font-black text-[#A6FF4D]">{sub}</p>
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
