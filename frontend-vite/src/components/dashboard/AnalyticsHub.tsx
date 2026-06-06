import { useEffect, useMemo, useState, type ElementType } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Droplets,
  Flame,
  Footprints,
  Loader2,
  Moon,
  Salad,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Weight,
  Zap,
} from "lucide-react";
import { getProgressHistory, getScanHistory } from "@/services/api";

type ProgressLog = {
  date?: string;
  created_at?: string;
  weight?: number | null;
  water_intake?: number | null;
  workout_done?: boolean;
  meal_followed?: boolean;
  sleep_hours?: number | null;
};

type ScanRow = {
  created_at?: string;
  saved_at?: string;
  calories?: number;
  protein?: number;
  score?: number;
  nutrition_score?: number;
  health_score?: number;
  estimated_nutrition?: {
    calories?: number;
    protein?: number;
  };
};

type StoredGeneratedPlan = {
  success?: boolean;
  user_profile?: {
    weight?: number;
    goal?: string;
    activity?: string;
    water_intake?: number;
    sleep_hours?: number;
  };
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    water_target?: string;
  };
  analytics?: {
    health_score?: number;
    hydration_score?: number;
    sleep_score?: number;
  };
  meal_plan?: { days?: unknown[] };
  coach_message?: string;
  health_insight?: string;
};

type TrendPoint = {
  label: string;
  expected: number;
  actual: number | null;
};

type AnalyticsData = {
  range: string;
  sourceLabel: string;
  plan: StoredGeneratedPlan | null;
  progressRows: ProgressLog[];
  scanRows: ScanRow[];
  expectedWeightTrend: TrendPoint[];
  calorieTrend: TrendPoint[];
  proteinTrend: TrendPoint[];
  waterTrend: TrendPoint[];
  adherence: {
    meal: number;
    workout: number;
    hydration: number;
    sleep: number;
    overall: number;
  };
  targets: {
    calories: number;
    protein: number;
    water: number;
    sleep: number;
    weight: number;
  };
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
    const obj = value as { data?: T[]; history?: T[]; items?: T[]; scans?: T[]; logs?: T[]; progress?: T[] };
    return obj.data || obj.history || obj.items || obj.scans || obj.logs || obj.progress || [];
  }
  return [];
}

function parseWaterTarget(value?: string, fallback = 2.5) {
  const match = value?.match(/[\d.]+/);
  const parsed = match ? Number(match[0]) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clamp(value: number, min = 0, max = 100) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), min), max);
}

function average(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value) && value > 0);
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function getScanCalories(row: ScanRow) {
  return Number(row.calories ?? row.estimated_nutrition?.calories ?? 0);
}

function getScanProtein(row: ScanRow) {
  return Number(row.protein ?? row.estimated_nutrition?.protein ?? 0);
}

function currentRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  const fmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function buildExpectedWeightTrend(startWeight: number, goal?: string): TrendPoint[] {
  const text = String(goal || "").toLowerCase();
  const weeklyChange = text.includes("loss") || text.includes("fat") ? -0.4 : text.includes("gain") ? 0.25 : 0;
  return Array.from({ length: 7 }).map((_, index) => ({
    label: `D${index + 1}`,
    expected: Number((startWeight + (weeklyChange / 6) * index).toFixed(1)),
    actual: null,
  }));
}

function attachActualWeight(expected: TrendPoint[], logs: ProgressLog[]) {
  const weights = logs.map((row) => Number(row.weight || 0)).filter(Boolean).slice(-7);
  return expected.map((point, index) => ({ ...point, actual: weights[index] ?? null }));
}

function buildTargetTrend(target: number, actualValues: number[], unitDivisor = 1): TrendPoint[] {
  return Array.from({ length: 7 }).map((_, index) => ({
    label: `D${index + 1}`,
    expected: Number((target / unitDivisor).toFixed(1)),
    actual: actualValues[index] !== undefined ? Number((actualValues[index] / unitDivisor).toFixed(1)) : null,
  }));
}

function buildAnalyticsData(plan: StoredGeneratedPlan | null, progressRows: ProgressLog[], scanRows: ScanRow[]): AnalyticsData {
  const profile = plan?.user_profile || {};
  const targets = plan?.targets || {};
  const weight = Number(profile.weight || progressRows.find((row) => row.weight)?.weight || 0);
  const calories = Number(targets.calories || 0);
  const protein = Number(targets.protein || 0);
  const water = parseWaterTarget(targets.water_target, profile.water_intake || 2.5);
  const sleepTarget = 8;

  const recentProgress = progressRows.slice(-7);
  const recentScans = scanRows.slice(-7);
  const scanCalories = recentScans.map(getScanCalories).filter(Boolean);
  const scanProtein = recentScans.map(getScanProtein).filter(Boolean);
  const waterActual = recentProgress.map((row) => Number(row.water_intake || 0)).filter(Boolean);
  const sleepActual = recentProgress.map((row) => Number(row.sleep_hours || 0)).filter(Boolean);

  const mealAdherence = progressRows.length ? clamp((progressRows.filter((row) => row.meal_followed).length / progressRows.length) * 100) : 0;
  const workoutAdherence = progressRows.length ? clamp((progressRows.filter((row) => row.workout_done).length / progressRows.length) * 100) : 0;
  const hydrationAdherence = waterActual.length ? clamp((average(waterActual) / water) * 100) : 0;
  const sleepAdherence = sleepActual.length ? clamp((average(sleepActual) / sleepTarget) * 100) : 0;
  const overall = clamp(average([mealAdherence, workoutAdherence, hydrationAdherence, sleepAdherence].filter(Boolean)));

  const weightTrend = attachActualWeight(buildExpectedWeightTrend(weight, profile.goal), recentProgress);

  return {
    range: currentRange(),
    sourceLabel: progressRows.length || scanRows.length ? "Backend history active" : "Plan targets only",
    plan,
    progressRows,
    scanRows,
    expectedWeightTrend: weightTrend,
    calorieTrend: buildTargetTrend(calories, scanCalories),
    proteinTrend: buildTargetTrend(protein, scanProtein),
    waterTrend: buildTargetTrend(water, waterActual),
    adherence: {
      meal: mealAdherence,
      workout: workoutAdherence,
      hydration: hydrationAdherence,
      sleep: sleepAdherence,
      overall,
    },
    targets: { calories, protein, water, sleep: sleepTarget, weight },
  };
}

export default function AnalyticsHub() {
  const [data, setData] = useState<AnalyticsData>(() => buildAnalyticsData(getStoredGeneratedPlan(), [], []));
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    setLoading(true);
    setNotice("");
    try {
      const [progressResponse, scansResponse] = await Promise.allSettled([getProgressHistory(), getScanHistory(30)]);
      const progressRows = progressResponse.status === "fulfilled" ? unwrapArray<ProgressLog>(progressResponse.value) : [];
      const scanRows = scansResponse.status === "fulfilled" ? unwrapArray<ScanRow>(scansResponse.value) : [];
      setData(buildAnalyticsData(getStoredGeneratedPlan(), progressRows, scanRows));
      if (progressResponse.status === "rejected" && scansResponse.status === "rejected") setNotice("Backend history is unavailable. Showing generated plan targets only.");
    } catch {
      setData(buildAnalyticsData(getStoredGeneratedPlan(), [], []));
      setNotice("Backend history is unavailable. Showing generated plan targets only.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const refresh = () => loadData();
    window.addEventListener("storage", refresh);
    window.addEventListener("ai-plan-updated", refresh);
    window.addEventListener("ai-scan-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ai-plan-updated", refresh);
      window.removeEventListener("ai-scan-updated", refresh);
    };
  }, []);

  const intelligence = useMemo(() => getIntelligenceMessage(data), [data]);

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 shadow-[0_0_80px_rgba(147,197,114,0.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />
        <div className="relative z-10">
          <Header range={data.range} sourceLabel={data.sourceLabel} loading={loading} />
          {notice && <Notice message={notice} />}

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            <MetricCard label="Wellness Adherence" value={`${data.adherence.overall || "—"}`} suffix="/100" icon={ShieldCheck} color="#93C572" sub="Based on real logs" />
            <MetricCard label="Meal Followed" value={`${data.adherence.meal || "—"}%`} icon={Salad} color="#93C572" sub="Daily check-ins" />
            <MetricCard label="Workout" value={`${data.adherence.workout || "—"}%`} icon={Footprints} color="#FFB347" sub="Workout logs" />
            <MetricCard label="Hydration" value={`${data.adherence.hydration || "—"}%`} icon={Droplets} color="#18D3D0" sub="Water vs target" />
            <MetricCard label="Sleep" value={`${data.adherence.sleep || "—"}%`} icon={Moon} color="#A875FF" sub="Sleep vs 8h" />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <TrendCard title="Weight: Expected vs Actual" icon={Weight} color="#93C572" unit="kg" points={data.expectedWeightTrend} />
            <TrendCard title="Calories: Target vs Actual" icon={Flame} color="#FFB347" unit="kcal" points={data.calorieTrend} />
            <TrendCard title="Protein: Target vs Actual" icon={Salad} color="#93C572" unit="g" points={data.proteinTrend} />
            <TrendCard title="Water: Target vs Actual" icon={Droplets} color="#18D3D0" unit="L" points={data.waterTrend} />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.72fr]">
            <IntelligenceCard message={intelligence} data={data} />
            <HistoryCard data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

function getIntelligenceMessage(data: AnalyticsData) {
  if (!data.progressRows.length && !data.scanRows.length) return "No real history yet. Add daily logs and scan meals so AI can compare expected vs actual progress.";
  if (data.adherence.overall >= 85) return "Strong consistency. Keep the current plan stable before making changes.";
  if (data.adherence.hydration && data.adherence.hydration < 75) return "Hydration is the weakest current signal. Prioritize water before changing calories.";
  if (data.adherence.meal && data.adherence.meal < 75) return "Meal adherence is limiting progress. Use the nutrition page to simplify meals or swap difficult items.";
  return "Progress is being tracked. Continue logging daily so the adaptive engine can personalize future plan changes.";
}

function Header({ range, sourceLabel, loading }: { range: string; sourceLabel: string; loading: boolean }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="flex items-center gap-3 text-[28px] font-black uppercase leading-none tracking-[0.02em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
          Progress Intelligence <Sparkles className="text-[#93C572]" size={24} />
        </h2>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">Expected vs actual analytics using backend progress history when available.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-bold text-white/85"><CalendarDays size={17} />{range}</span>
        <span className="inline-flex items-center gap-3 rounded-2xl border border-[#93C572]/20 bg-[#93C572]/8 px-4 py-3 text-[13px] font-black text-[#93C572]">{loading ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />}{sourceLabel}</span>
      </div>
    </div>
  );
}

function Notice({ message }: { message: string }) {
  return <p className="mt-5 rounded-[22px] border border-[#FFB347]/35 bg-[#2A1A05]/55 p-4 text-[13px] font-bold leading-6 text-[#FFB347]"><AlertTriangle className="mr-2 inline" size={18} />{message}</p>;
}

function MetricCard({ label, value, suffix, icon: Icon, color, sub }: { label: string; value: string; suffix?: string; icon: ElementType; color: string; sub: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#061009]/70 p-4">
      <div className="mb-4 flex items-center justify-between"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">{label}</p><Icon size={20} style={{ color }} /></div>
      <p className="text-[30px] font-black leading-none text-white">{value}{suffix && <span className="ml-1 text-[14px] text-white/55">{suffix}</span>}</p>
      <p className="mt-2 text-[12px] font-bold" style={{ color }}>{sub}</p>
    </div>
  );
}

function TrendCard({ title, icon: Icon, color, unit, points }: { title: string; icon: ElementType; color: string; unit: string; points: TrendPoint[] }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#061009]/72 p-5">
      <div className="mb-5 flex items-center justify-between gap-4"><h3 className="flex items-center gap-2 text-[18px] font-black text-white"><Icon size={20} style={{ color }} />{title}</h3><span className="text-[12px] font-bold text-white/45">{unit}</span></div>
      <div className="space-y-3">
        {points.map((point) => (
          <div key={point.label} className="grid grid-cols-[38px_1fr] items-center gap-3">
            <p className="text-[12px] font-black text-white/45">{point.label}</p>
            <div>
              <Bar label="Expected" value={point.expected} max={getMax(points)} color="rgba(255,255,255,.32)" />
              <Bar label="Actual" value={point.actual ?? 0} max={getMax(points)} color={point.actual ? color : "rgba(255,255,255,.08)"} missing={!point.actual} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMax(points: TrendPoint[]) {
  return Math.max(...points.flatMap((point) => [point.expected, point.actual || 0]), 1);
}

function Bar({ label, value, max, color, missing }: { label: string; value: number; max: number; color: string; missing?: boolean }) {
  const width = missing ? 4 : Math.max((value / max) * 100, 4);
  return (
    <div className="mb-1 grid grid-cols-[70px_1fr_70px] items-center gap-2">
      <p className="text-[10px] font-bold text-white/40">{label}</p>
      <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${width}%`, background: color }} /></div>
      <p className="text-right text-[11px] font-black text-white/65">{missing ? "—" : value}</p>
    </div>
  );
}

function IntelligenceCard({ message, data }: { message: string; data: AnalyticsData }) {
  const better = data.adherence.overall >= 75;
  return (
    <div className="rounded-[26px] border border-[#93C572]/20 bg-[#061009]/72 p-5">
      <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-[#93C572]"><Zap size={16} />Adaptive Insight</p>
      <h3 className="mt-4 flex items-center gap-2 text-[26px] font-black tracking-[-0.04em] text-white">{better ? <TrendingUp className="text-[#93C572]" /> : <TrendingDown className="text-[#FFB347]" />}What should change next?</h3>
      <p className="mt-4 text-[15px] font-semibold leading-7 text-white/70">{message}</p>
      <p className="mt-5 rounded-[18px] border border-[#FFB347]/25 bg-[#2A1A05]/45 px-4 py-3 text-[13px] font-semibold leading-6 text-white/60">Wellness-only insight. This is not medical advice, diagnosis, treatment, or disease management.</p>
    </div>
  );
}

function HistoryCard({ data }: { data: AnalyticsData }) {
  const rows = [
    { label: "Progress logs", value: data.progressRows.length, icon: Activity },
    { label: "Food scans", value: data.scanRows.length, icon: BarChart3 },
    { label: "Target calories", value: data.targets.calories || "—", icon: Target },
  ];
  return (
    <div className="rounded-[26px] border border-white/10 bg-[#061009]/72 p-5">
      <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#18D3D0]">Data Quality</p>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => <div key={row.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-center gap-3"><row.icon size={18} className="text-[#18D3D0]" /><p className="text-[13px] font-bold text-white/70">{row.label}</p></div><p className="text-[18px] font-black text-white">{row.value}</p></div>)}
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_18%_25%,rgba(24,211,208,0.08),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(147,197,114,0.09),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.12] [background-image:linear-gradient(rgba(147,197,114,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}
