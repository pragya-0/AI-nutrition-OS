import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Droplets,
  FileText,
  Loader2,
  Moon,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Utensils,
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
  score?: number;
  nutrition_score?: number;
  wellness_score?: number;
  health_score?: number;
  detected_food?: string;
  food_name?: string;
};

type StoredPlan = {
  success?: boolean;
  user_profile?: {
    name?: string;
    weight?: number;
    goal?: string;
    water_intake?: number;
  };
  analytics?: {
    wellness_adherence?: number;
    nutrition_consistency?: number;
    goal_alignment?: number;
    program_completion?: number;
    health_score?: number;
    sleep_score?: number;
    hydration_score?: number;
    bmi?: number;
  };
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    water_target?: string;
  };
  meal_quality?: MealQuality;
  quality_scores?: MealQuality;
  meal_plan?: { days?: unknown[] };
  coach_message?: string;
  ai_tip?: string;
  health_insight?: string;
};

type MealQuality = {
  production_ready_meal_quality?: boolean;
  nutritionist_quality_score?: number;
  family_variety_score?: number;
  alternative_variety_score?: number;
  requested_days?: number;
  generated_days?: number;
};

type ReportData = {
  source: "backend-history" | "plan-snapshot" | "empty";
  range: string;
  name: string;
  wellnessAdherence: number;
  nutritionConsistency: number;
  goalAlignment: number;
  programCompletion: number;
  hydrationAdherence: number;
  sleepConsistency: number;
  mealAdherence: number;
  workoutConsistency: number;
  calories: number;
  protein: number;
  waterTarget: string;
  avgWater: number;
  avgSleep: number;
  progressLogs: number;
  scans: number;
  bmi: number;
  mealPlanDays: number;
  mealQualityReady: boolean;
  nutritionistQualityScore: number;
  familyVarietyScore: number;
  alternativeVarietyScore: number;
  requestedDays: number;
  generatedDays: number;
  insight: string;
};

const PRIMARY = "#93C572";

const TEAL = "#18D3D0";
const WARNING = "#F5B942";

function getStoredPlan(): StoredPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    return raw ? (JSON.parse(raw) as StoredPlan) : null;
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
    };
    return obj.data || obj.history || obj.items || obj.scans || obj.logs || obj.progress || [];
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

function parseLiters(value?: string, fallback = 2.5) {
  const match = value?.match(/[\d.]+/);
  const parsed = match ? Number(match[0]) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getCurrentWeekRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  const format = (date: Date) =>
    date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${format(start)} – ${format(end)}`;
}

function getScanScore(row: ScanRow) {
  return Number(row.nutrition_score ?? row.wellness_score ?? row.score ?? row.health_score ?? 0);
}

function getReportData(plan: StoredPlan | null, progressRows: ProgressLog[], scanRows: ScanRow[]): ReportData {
  const profile = plan?.user_profile || {};
  const analytics = plan?.analytics || {};
  const targets = plan?.targets || {};
  const quality = plan?.meal_quality || plan?.quality_scores || {};
  const waterTargetLiters = parseLiters(targets.water_target, profile.water_intake || 2.5);

  const avgWater = avg(progressRows.map((row) => Number(row.water_intake || 0)));
  const avgSleep = avg(progressRows.map((row) => Number(row.sleep_hours || 0)));
  const mealAdherence = progressRows.length
    ? clamp((progressRows.filter((row) => row.meal_followed).length / progressRows.length) * 100)
    : 0;
  const workoutConsistency = progressRows.length
    ? clamp((progressRows.filter((row) => row.workout_done).length / progressRows.length) * 100)
    : 0;
  const hydrationAdherence = avgWater ? clamp((avgWater / waterTargetLiters) * 100) : Number(analytics.hydration_score || 0);
  const sleepConsistency = avgSleep ? clamp((avgSleep / 8) * 100) : Number(analytics.sleep_score || 0);
  const scanConsistency = avg(scanRows.map(getScanScore).filter(Boolean));

  const wellnessAdherence = progressRows.length
    ? clamp((mealAdherence + workoutConsistency + hydrationAdherence + sleepConsistency) / 4)
    : clamp(Number(analytics.wellness_adherence || analytics.health_score || scanConsistency || 0));

  const nutritionConsistency = progressRows.length
    ? clamp((mealAdherence + hydrationAdherence + (scanConsistency || wellnessAdherence)) / 3)
    : clamp(Number(analytics.nutrition_consistency || wellnessAdherence || 0));

  const goalAlignment = clamp(Number(analytics.goal_alignment || (wellnessAdherence ? (wellnessAdherence + nutritionConsistency) / 2 : 0)));
  const programCompletion = clamp(Number(analytics.program_completion || (progressRows.length ? Math.min(progressRows.length * 14, 100) : 0)));

  return {
    source: progressRows.length || scanRows.length ? "backend-history" : plan?.success ? "plan-snapshot" : "empty",
    range: getCurrentWeekRange(),
    name: profile.name?.trim() || "there",
    wellnessAdherence,
    nutritionConsistency,
    goalAlignment,
    programCompletion,
    hydrationAdherence,
    sleepConsistency,
    mealAdherence,
    workoutConsistency,
    calories: Number(targets.calories || 0),
    protein: Number(targets.protein || 0),
    waterTarget: targets.water_target || `${waterTargetLiters}L`,
    avgWater,
    avgSleep,
    progressLogs: progressRows.length,
    scans: scanRows.length,
    bmi: Number(analytics.bmi || 0),
    mealPlanDays: plan?.meal_plan?.days?.length || 0,
    mealQualityReady: quality.production_ready_meal_quality === true,
    nutritionistQualityScore: Math.round(Number(quality.nutritionist_quality_score || 0)),
    familyVarietyScore: Math.round(Number(quality.family_variety_score || 0)),
    alternativeVarietyScore: Math.round(Number(quality.alternative_variety_score || 0)),
    requestedDays: Number(quality.requested_days || plan?.meal_plan?.days?.length || 0),
    generatedDays: Number(quality.generated_days || plan?.meal_plan?.days?.length || 0),
    insight:
      progressRows.length || scanRows.length
        ? "This report uses backend logs and scan history where available. It explains wellness patterns, not diagnosis or treatment."
        : plan?.coach_message ||
          plan?.ai_tip ||
          plan?.health_insight ||
          "Generate a plan and add progress logs to unlock a production-grade wellness report.",
  };
}

export default function AIHealthReport() {
  const [data, setData] = useState<ReportData>(() => getReportData(getStoredPlan(), [], []));
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setNotice("");

    try {
      const [progressResponse, scanResponse] = await Promise.allSettled([
        getProgressHistory(),
        getScanHistory(30),
      ]);

      const progressRows =
        progressResponse.status === "fulfilled" ? unwrapArray<ProgressLog>(progressResponse.value) : [];
      const scanRows =
        scanResponse.status === "fulfilled" ? unwrapArray<ScanRow>(scanResponse.value) : [];

      setData(getReportData(getStoredPlan(), progressRows, scanRows));

      if (!progressRows.length && !scanRows.length) {
        setNotice("No backend history yet. This report is labelled as a latest-plan snapshot.");
      }
    } catch {
      setData(getReportData(getStoredPlan(), [], []));
      setNotice("Backend history is unavailable. Showing a labelled latest-plan snapshot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    const refresh = () => loadReport();
    window.addEventListener("storage", refresh);
    window.addEventListener("ai-plan-updated", refresh);
    window.addEventListener("ai-scan-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ai-plan-updated", refresh);
      window.removeEventListener("ai-scan-updated", refresh);
    };
  }, []);

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-white/10 bg-[#061009]/95 p-5 shadow-[0_0_54px_rgba(147,197,114,0.06)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          <Header data={data} loading={loading} onRefresh={loadReport} />
          {notice ? <Notice message={notice} /> : null}
          <QualityNotice data={data} />
          <ExecutiveSummary data={data} />

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Wellness Adherence" value={`${data.wellnessAdherence || 0}%`} icon={ShieldCheck} color={PRIMARY} text="Overall consistency from meals, hydration, sleep, and workouts." />
            <MetricCard title="Nutrition Consistency" value={`${data.nutritionConsistency || 0}%`} icon={Utensils} color={TEAL} text="How consistently nutrition behavior matches the generated plan." />
            <MetricCard title="Goal Alignment" value={`${data.goalAlignment || 0}%`} icon={Target} color={WARNING} text="Whether logged behavior supports the selected goal direction." />
            <MetricCard title="Program Completion" value={`${data.programCompletion || 0}%`} icon={CheckCircle2} color={PRIMARY} text="Progress logging and program follow-through signal." />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
            <AdherencePanel data={data} />
            <HistoryPanel data={data} />
            <RecommendationPanel data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_78%_20%,rgba(147,197,114,0.10),transparent_34%),radial-gradient(circle_at_18%_80%,rgba(24,211,208,0.055),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.08] [background-image:linear-gradient(rgba(147,197,114,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.10)_1px,transparent_1px)] [background-size:76px_76px]" />
    </>
  );
}

function Header({ data, loading, onRefresh }: { data: ReportData; loading: boolean; onRefresh: () => void }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
          <FileText size={16} />
          Wellness Report · {data.range}
        </p>
        <h2 className="mt-3 text-[34px] font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-[48px]">
          {data.name}, your weekly
          <br />
          <span className="text-[#93C572]">consistency review.</span>
        </h2>
        <p className="mt-4 max-w-[860px] text-[15px] font-semibold leading-7 text-white/64">
          This report uses wellness-only language. It does not diagnose health, predict recovery, or guarantee outcomes.
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white/85 transition hover:border-[#93C572]/30 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCcw size={17} />}
        Refresh Report
      </button>
    </div>
  );
}

function Notice({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-[22px] border border-[#F5B942]/25 bg-[#2A1A05]/45 px-5 py-4 text-[14px] font-semibold leading-6 text-white/72">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 shrink-0 text-[#F5B942]" size={20} />
        {message}
      </div>
    </div>
  );
}

function QualityNotice({ data }: { data: ReportData }) {
  if (!data.mealPlanDays) return null;

  return (
    <div
      className={`mt-5 rounded-[24px] border p-5 ${
        data.mealQualityReady
          ? "border-[#93C572]/25 bg-[#0D1611]/70"
          : "border-[#F5B942]/30 bg-[#2A1A05]/55"
      }`}
    >
      <p className={`text-[12px] font-black uppercase tracking-[0.22em] ${data.mealQualityReady ? "text-[#93C572]" : "text-[#F5B942]"}`}>
        {data.mealQualityReady ? "Meal Plan Quality Passed" : "Meal Plan Quality Needs Review"}
      </p>
      <p className="mt-2 max-w-[980px] text-[14px] font-semibold leading-6 text-white/72">
        {data.generatedDays || data.mealPlanDays} of {data.requestedDays || data.mealPlanDays} days generated. Nutritionist quality score {data.nutritionistQualityScore || "N/A"}/100.
        {data.mealQualityReady
          ? " This plan passed the public-release meal quality gate."
          : ` Usable plan generated, but long-duration variety should improve before public launch. Family variety ${data.familyVarietyScore || "N/A"}/100, alternatives ${data.alternativeVarietyScore || "N/A"}/100.`}
      </p>
    </div>
  );
}

function ExecutiveSummary({ data }: { data: ReportData }) {
  const weakest =
    data.mealAdherence && data.mealAdherence < 70
      ? "Meal adherence"
      : data.hydrationAdherence < 75
        ? "Hydration consistency"
        : data.sleepConsistency < 75
          ? "Sleep routine"
          : "History depth";

  const action =
    data.source === "empty"
      ? "Generate a plan and add your first progress log."
      : weakest === "Meal adherence"
        ? "Follow today’s meals and log completion."
        : weakest === "Hydration consistency"
          ? `Work toward ${data.waterTarget} water today.`
          : weakest === "Sleep routine"
            ? "Protect sleep timing before changing calories."
            : "Keep logging weight, meals, water, sleep, and scans.";

  return (
    <div className="mt-5 rounded-[26px] border border-[#93C572]/18 bg-[#0D1611]/72 p-5 shadow-[inset_0_0_34px_rgba(147,197,114,.025)]">
      <p className="text-[12px] font-black uppercase tracking-[0.22em] text-[#93C572]">Executive Summary</p>
      <h3 className="mt-2 text-[28px] font-black leading-tight tracking-[-0.04em] text-white sm:text-[34px]">
        What matters this week
      </h3>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <SummaryTile label="Data Source" value={data.source === "backend-history" ? "Backend History" : data.source === "plan-snapshot" ? "Plan Snapshot" : "No Data Yet"} color={TEAL} />
        <SummaryTile label="Focus Area" value={weakest} color={WARNING} />
        <SummaryTile label="Next Action" value={action} color={PRIMARY} />
      </div>
    </div>
  );
}

function SummaryTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color }}>{label}</p>
      <p className="mt-3 text-[18px] font-black leading-6 text-white">{value}</p>
    </div>
  );
}

function MetricCard({ title, value, text, color, icon: Icon }: { title: string; value: string; text: string; color: string; icon: React.ElementType }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/48">{title}</p>
        <Icon size={22} style={{ color }} />
      </div>
      <p className="mt-4 text-[38px] font-black leading-none tracking-[-0.06em] text-white">{value}</p>
      <p className="mt-3 text-[13px] font-semibold leading-6 text-white/58">{text}</p>
    </div>
  );
}

function AdherencePanel({ data }: { data: ReportData }) {
  const rows = [
    { label: "Meal Adherence", value: data.mealAdherence, color: PRIMARY },
    { label: "Hydration", value: data.hydrationAdherence, color: TEAL },
    { label: "Sleep", value: data.sleepConsistency, color: WARNING },
    { label: "Workout", value: data.workoutConsistency, color: PRIMARY },
  ];

  return (
    <Panel title="Adherence Signals" icon={BarChart3}>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex items-center justify-between text-[13px] font-bold">
              <span className="text-white/70">{row.label}</span>
              <span style={{ color: row.color }}>{row.value || 0}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: `${row.value || 0}%`, backgroundColor: row.color }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function HistoryPanel({ data }: { data: ReportData }) {
  return (
    <Panel title="History Depth" icon={CalendarIconFallback}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <MiniStat icon={BarChart3} label="Progress Logs" value={String(data.progressLogs)} color={TEAL} />
        <MiniStat icon={Sparkles} label="Food Scans" value={String(data.scans)} color={PRIMARY} />
        <MiniStat icon={Droplets} label="Avg Water" value={data.avgWater ? `${data.avgWater}L` : "—"} color={TEAL} />
        <MiniStat icon={Moon} label="Avg Sleep" value={data.avgSleep ? `${data.avgSleep}h` : "—"} color={WARNING} />
      </div>
    </Panel>
  );
}

function CalendarIconFallback(props: React.ComponentProps<typeof FileText>) {
  return <FileText {...props} />;
}

function RecommendationPanel({ data }: { data: ReportData }) {
  return (
    <Panel title="AI Wellness Recommendation" icon={Sparkles}>
      <p className="text-[15px] font-semibold leading-7 text-white/72">{data.insight}</p>
      <div className="mt-5 rounded-[20px] border border-[#F5B942]/25 bg-[#2A1A05]/45 p-4">
        <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#F5B942]">
          <AlertTriangle size={16} /> Wellness-only
        </p>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-white/62">
          Reports are educational wellness summaries, not medical advice, diagnosis, treatment, emergency care, or disease management.
        </p>
      </div>
    </Panel>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
      <p className="mb-5 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-[#18D3D0]">
        <Icon size={16} />
        {title}
      </p>
      {children}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
      <Icon size={18} style={{ color }} />
      <p className="mt-3 text-[12px] font-bold text-white/50">{label}</p>
      <p className="mt-1 text-[22px] font-black text-white">{value}</p>
    </div>
  );
}
