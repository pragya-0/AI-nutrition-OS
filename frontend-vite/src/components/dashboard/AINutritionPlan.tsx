import { useEffect, useMemo, useState, type ElementType } from "react";
import {
  Activity,
  Apple,
  CalendarDays,
  Droplets,
  Flame,
  Info,
  AlertTriangle,
  RotateCcw,
  Settings,
  Sparkles,
  Utensils,
} from "lucide-react";
type MealQuality = {
  meal_variety?: number;
  max_repeat?: number;
  consecutive_repeats?: number;
  grocery_list?: string[];
  production_ready_meal_quality?: boolean;
  nutritionist_quality_score?: number;
  family_variety_score?: number;
  alternative_variety_score?: number;
  requested_days?: number;
  generated_days?: number;
  diet_validation_passed?: boolean;
};

type PlanDay = {
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
};

type StoredGeneratedPlan = {
  success?: boolean;
  blocked?: boolean;
  message?: string;
  medical_disclaimer?: string;
  medical_risk?: {
    block_reason?: string;
    warnings?: string[];
    detected_conditions?: string[];
    hard_block?: boolean;
  };
  user_profile?: {
    name?: string;
    goal?: string;
    diet?: string;
    activity?: string;
    water_intake?: number;
  };
  analytics?: {
    wellness_adherence?: number;
    nutrition_consistency?: number;
    goal_alignment?: number;
    health_score?: number;
    health_status?: string;
    metabolic_strategy?: string;
    strategy_details?: {
      reason?: string;
      recommended_focus?: string[];
      coaching_focus?: string[];
    };
    meal_quality?: MealQuality;
    meal_variety?: number;
    max_repeat?: number;
    consecutive_repeats?: number;
  };
  meal_quality?: MealQuality;
  quality_scores?: MealQuality;
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    water_target?: string;
  };
  meal_plan?: {
    days?: PlanDay[];
  };
  coach_message?: string;
  ai_tip?: string;
  health_insight?: string;
  daily_routine?: Record<string, string>;
};

type MealCardData = {
  label: string;
  title: string;
  time: string;
  text: string;
  calories: number;
  protein: number;
  color: string;
  icon: ElementType;
};

const PRIMARY = "#93C572";

const TEAL = "#18D3D0";
const WARNING = "#F5B942";
const PURPLE = "#A875FF";

function getStoredGeneratedPlan(): StoredGeneratedPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    if (!raw) return null;
    return JSON.parse(raw) as StoredGeneratedPlan;
  } catch {
    return null;
  }
}

function getStoredBlockedResponse(): StoredGeneratedPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_blocked_response");
    if (!raw) return null;
    return JSON.parse(raw) as StoredGeneratedPlan;
  } catch {
    return null;
  }
}

function formatLabel(value?: string) {
  if (!value) return "Personalized Plan";

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

function getMealQuality(plan?: StoredGeneratedPlan | null): MealQuality | null {
  if (!plan?.success) return null;

  return (
    plan.meal_quality ||
    plan.quality_scores ||
    plan.analytics?.meal_quality ||
    {
      meal_variety: plan.analytics?.meal_variety,
      max_repeat: plan.analytics?.max_repeat,
      consecutive_repeats: plan.analytics?.consecutive_repeats,
      grocery_list: [],
    }
  );
}

function clampDayIndex(index: number, totalDays: number) {
  if (!totalDays || totalDays <= 0) return 0;
  return Math.min(Math.max(index, 0), totalDays - 1);
}

function mealText(day: PlanDay | undefined, key: "breakfast" | "lunch" | "snack" | "dinner") {
  if (!day) return "Generate a plan to view this meal.";
  return day.meals?.[key] || day[key] || "Meal details not available.";
}

function getMealTime(plan: StoredGeneratedPlan | null, key: string, fallback: string) {
  const value = plan?.daily_routine?.[key];
  return value?.split(" - ")?.[0] || fallback;
}

function buildMeals(plan: StoredGeneratedPlan | null, selectedDayIndex: number): MealCardData[] {
  const targets = plan?.targets || {};
  const calories = Number(targets.calories || 0);
  const protein = Number(targets.protein || 0);
  const day = plan?.meal_plan?.days?.[selectedDayIndex];

  return [
    {
      label: "Breakfast",
      title: "Breakfast",
      time: getMealTime(plan, "breakfast_time", "8:00 AM"),
      text: mealText(day, "breakfast"),
      calories: Math.round(calories * 0.25),
      protein: Math.round(protein * 0.25),
      color: WARNING,
      icon: Flame,
    },
    {
      label: "Lunch",
      title: "Lunch",
      time: getMealTime(plan, "lunch_time", "1:00 PM"),
      text: mealText(day, "lunch"),
      calories: Math.round(calories * 0.35),
      protein: Math.round(protein * 0.35),
      color: TEAL,
      icon: Utensils,
    },
    {
      label: "Snack",
      title: "Snack",
      time: getMealTime(plan, "evening_snack", "5:00 PM"),
      text: mealText(day, "snack"),
      calories: Math.round(calories * 0.12),
      protein: Math.round(protein * 0.12),
      color: PRIMARY,
      icon: Apple,
    },
    {
      label: "Dinner",
      title: "Dinner",
      time: getMealTime(plan, "dinner_time", "8:00 PM"),
      text: mealText(day, "dinner"),
      calories: Math.max(Math.round(calories * 0.28), 0),
      protein: Math.round(protein * 0.28),
      color: PURPLE,
      icon: Activity,
    },
  ];
}

function getPlanQualityStatus(plan: StoredGeneratedPlan | null) {
  const quality = getMealQuality(plan);

  if (!plan?.success || !quality) return null;

  const generatedDays = quality.generated_days || plan.meal_plan?.days?.length || 0;
  const requestedDays = quality.requested_days || generatedDays;
  const productionReady = quality.production_ready_meal_quality === true;
  const nutritionistScore = Math.round(Number(quality.nutritionist_quality_score || 0));
  const familyScore = Math.round(Number(quality.family_variety_score || 0));
  const alternativeScore = Math.round(Number(quality.alternative_variety_score || 0));

  return {
    generatedDays,
    requestedDays,
    productionReady,
    nutritionistScore,
    familyScore,
    alternativeScore,
    mealVariety: Math.round(Number(quality.meal_variety || 0)),
    maxRepeat: Number(quality.max_repeat || 0),
    groceryCount: quality.grocery_list?.length || 0,
  };
}

export default function AINutritionPlan() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [plan, setPlan] = useState<StoredGeneratedPlan | null>(() => getStoredGeneratedPlan());
  const [blockedResponse, setBlockedResponse] = useState<StoredGeneratedPlan | null>(() => getStoredBlockedResponse());
  const [daySelectorOpen, setDaySelectorOpen] = useState(false);

  const totalDays = plan?.meal_plan?.days?.length || 0;
  const safeDayIndex = clampDayIndex(selectedDayIndex, totalDays);
  const selectedDay = safeDayIndex + 1;
  const targets = plan?.targets || {};
  const profile = plan?.user_profile || {};
  const quality = getPlanQualityStatus(plan);
  const meals = useMemo(() => buildMeals(plan, safeDayIndex), [plan, safeDayIndex]);

  const waterTarget = parseWaterTarget(targets.water_target, profile.water_intake || 2.5);
  const calorieTarget = Number(targets.calories || 0);
  const proteinTarget = Number(targets.protein || 0);
  const carbsTarget = Number(targets.carbs || 0);
  const fatsTarget = Number(targets.fats || 0);

  const refreshFromStorage = () => {
    const freshPlan = getStoredGeneratedPlan();
    const freshBlocked = getStoredBlockedResponse();
    const dayCount = freshPlan?.meal_plan?.days?.length || 0;

    setPlan(freshPlan);
    setBlockedResponse(freshBlocked);
    setSelectedDayIndex((current) => clampDayIndex(current, dayCount));
  };

  useEffect(() => {
    window.addEventListener("storage", refreshFromStorage);
    window.addEventListener("ai-plan-updated", refreshFromStorage);

    return () => {
      window.removeEventListener("storage", refreshFromStorage);
      window.removeEventListener("ai-plan-updated", refreshFromStorage);
    };
  }, []);

  const insightCards = [
    {
      title: "Nutrition Consistency",
      value: quality?.mealVariety ? `${quality.mealVariety}/100` : "Needs logs",
      text: quality?.mealVariety
        ? "Plan variety signal from backend meal quality metadata."
        : "Generate and follow a plan to unlock consistency tracking.",
      color: PRIMARY,
    },
    {
      title: "Goal Alignment",
      value: calorieTarget ? `${calorieTarget.toLocaleString()} kcal` : "Waiting",
      text: `Built for ${formatLabel(profile.goal)} with ${formatLabel(profile.diet)} preference.`,
      color: TEAL,
    },
    {
      title: "Program Coverage",
      value: totalDays ? `${totalDays} days` : "No plan",
      text: totalDays
        ? "Use the day selector for the full plan without overloading the dashboard."
        : "Generate a plan to unlock meal calendar.",
      color: WARNING,
    },
    {
      title: "Swap Readiness",
      value: quality?.groceryCount ? `${quality.groceryCount} items` : "Basic",
      text: "Meal swaps and grocery list depend on backend quality metadata.",
      color: PURPLE,
    },
  ];

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[92vw] overflow-hidden rounded-[30px] border border-white/10 bg-[#020604]/95 shadow-[0_0_70px_rgba(147,197,114,0.06)] 2xl:max-w-[1780px]">
        <BackgroundFX />

        <div className="relative z-10 p-4 sm:p-5 lg:p-6 xl:p-7">
          <div className="rounded-[28px] border border-white/10 bg-[#061009]/70 p-4 sm:p-5 lg:p-6 xl:p-7">
            <Header onRefresh={refreshFromStorage} />

            {blockedResponse?.blocked ? (
              <MedicalPlanBlockedNotice response={blockedResponse} />
            ) : null}

            <PlanQualityNotice quality={quality} />

            <TopSummary
              goal={formatLabel(profile.goal)}
              diet={formatLabel(profile.diet)}
              activity={formatLabel(profile.activity)}
              calories={calorieTarget}
              protein={proteinTarget}
              carbs={carbsTarget}
              fats={fatsTarget}
              water={waterTarget}
              totalDays={totalDays}
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {insightCards.map((card) => (
                <InsightCard key={card.title} {...card} />
              ))}
            </div>

            <MealCalendar
              meals={meals}
              selectedDay={selectedDay}
              totalDays={totalDays}
              open={daySelectorOpen}
              onToggle={() => setDaySelectorOpen((value) => !value)}
              onSelectDay={setSelectedDayIndex}
            />

            <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <MacroPanel
                calories={calorieTarget}
                protein={proteinTarget}
                carbs={carbsTarget}
                fats={fatsTarget}
                water={waterTarget}
              />
              <CoachNotes plan={plan} day={plan?.meal_plan?.days?.[safeDayIndex]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-[28px] font-black uppercase leading-none tracking-[0.08em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
          Nutrition Plan
        </h2>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
          Full plan details from your latest generated profile data.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3 text-[13px] font-black text-white"
        >
          <RotateCcw size={17} />
          Refresh From Plan
        </button>

        <a
          href="/dashboard/onboarding"
          className="inline-flex items-center gap-2.5 rounded-2xl bg-[#93C572] px-4 py-3 text-[13px] font-black text-[#07110A] shadow-[0_0_22px_rgba(147,197,114,.16)] transition hover:bg-[#A4D08A]"
        >
          <Settings size={17} />
          Regenerate
        </a>
      </div>
    </div>
  );
}

function PlanQualityNotice({
  quality,
}: {
  quality: ReturnType<typeof getPlanQualityStatus>;
}) {
  if (!quality) return null;

  return (
    <div
      className={`mb-5 rounded-[24px] border p-5 ${
        quality.productionReady
          ? "border-[#93C572]/25 bg-[#061009]/76"
          : "border-[#F5B942]/30 bg-[#2A1A05]/55"
      }`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p
            className={`text-[12px] font-black uppercase tracking-[0.22em] ${
              quality.productionReady ? "text-[#93C572]" : "text-[#F5B942]"
            }`}
          >
            {quality.productionReady ? "Meal Quality Passed" : "Meal Quality Needs Review"}
          </p>
          <p className="mt-2 max-w-[920px] text-[14px] font-semibold leading-6 text-white/72">
            {quality.generatedDays} of {quality.requestedDays} days generated.
            Nutritionist quality score {quality.nutritionistScore || "N/A"}/100.
            {quality.productionReady
              ? " This plan passed the public quality gate."
              : ` Long-duration plans are usable, but backend variety should improve. Family variety ${quality.familyScore || "N/A"}/100, alternatives ${quality.alternativeScore || "N/A"}/100.`}
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-2xl border px-4 py-2 text-[12px] font-black ${
            quality.productionReady
              ? "border-[#93C572]/30 text-[#93C572]"
              : "border-[#F5B942]/35 text-[#F5B942]"
          }`}
        >
          {quality.productionReady ? "Production Ready" : "Quality Warning"}
        </span>
      </div>
    </div>
  );
}

function TopSummary({
  goal,
  diet,
  activity,
  calories,
  protein,
  carbs,
  fats,
  water,
  totalDays,
}: {
  goal: string;
  diet: string;
  activity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
  totalDays: number;
}) {
  return (
    <div className="grid overflow-hidden rounded-[26px] border border-white/10 bg-[#061009]/70 lg:grid-cols-[1.05fr_0.95fr_0.95fr]">
      <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r xl:p-6">
        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-[#93C572]">
          Today’s Nutrition
        </p>
        <h3 className="mt-3 text-[28px] font-black tracking-[-0.05em] text-white">
          {goal}
        </h3>
        <p className="mt-3 text-[14px] font-semibold leading-6 text-white/65">
          Diet: {diet}. Activity: {activity}. Full calendar: {totalDays || 0} days.
        </p>
      </div>

      <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r xl:p-6">
        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-[#18D3D0]">
          Daily Targets
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <TargetMetric label="Calories" value={calories ? calories.toLocaleString() : "—"} sub="kcal" color={WARNING} icon={Flame} />
          <TargetMetric label="Protein" value={protein ? `${protein}g` : "—"} sub="target" color={PRIMARY} icon={Utensils} />
          <TargetMetric label="Carbs" value={carbs ? `${carbs}g` : "—"} sub="target" color={TEAL} icon={Apple} />
          <TargetMetric label="Fats" value={fats ? `${fats}g` : "—"} sub="target" color={PURPLE} icon={Droplets} />
        </div>
      </div>

      <div className="p-5 xl:p-6">
        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-[#F5B942]">
          Hydration
        </p>
        <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
          <p className="text-[36px] font-black leading-none text-white">{water}L</p>
          <p className="mt-2 text-[13px] font-bold text-white/58">Daily water target</p>
          <p className="mt-4 text-[13px] font-semibold leading-6 text-white/62">
            Actual hydration should be logged on the Progress page for expected-vs-actual tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

function TargetMetric({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <Icon size={17} style={{ color }} />
      <p className="mt-2 text-[16px] font-black text-white">{value}</p>
      <p className="text-[11px] font-bold text-white/55">{label}</p>
      <p className="mt-1 text-[10px] font-black" style={{ color }}>{sub}</p>
    </div>
  );
}

function InsightCard({
  title,
  value,
  text,
  color,
}: {
  title: string;
  value: string;
  text: string;
  color: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color }}>
        {title}
      </p>
      <p className="mt-3 text-[22px] font-black leading-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-[12px] font-semibold leading-5 text-white/66">
        {text}
      </p>
    </div>
  );
}

function MealCalendar({
  meals,
  selectedDay,
  totalDays,
  open,
  onToggle,
  onSelectDay,
}: {
  meals: MealCardData[];
  selectedDay: number;
  totalDays: number;
  open: boolean;
  onToggle: () => void;
  onSelectDay: (dayIndex: number) => void;
}) {
  return (
    <div className="mt-5 rounded-[26px] border border-white/10 bg-[#061009]/70 p-5 xl:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[16px] font-black uppercase tracking-[0.16em] text-[#93C572] xl:text-[18px]">
            Day {selectedDay || 1} Meal Plan
          </p>

          <button
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            <CalendarDays size={15} />
            {open ? "Hide Day Selector" : `View ${totalDays || 1} Day Plan`}
          </button>
        </div>

        <p className="flex items-center gap-2 text-[12px] font-medium text-white/60">
          <Info size={14} />
          Times can be adjusted later in Settings.
        </p>
      </div>

      {open && totalDays > 1 && (
        <div className="mb-5 rounded-2xl border border-[#93C572]/20 bg-[#93C572]/5 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#93C572]">
              Full {totalDays}-day plan selector
            </p>
            <p className="text-[12px] font-semibold text-white/60">
              Showing Day {selectedDay} of {totalDays}
            </p>
          </div>

          <div className="flex max-h-[138px] flex-wrap gap-2 overflow-y-auto pr-1">
            {Array.from({ length: totalDays }, (_, index) => {
              const active = index + 1 === selectedDay;

              return (
                <button
                  key={`plan-day-${index + 1}`}
                  onClick={() => onSelectDay(index)}
                  className={`rounded-xl border px-3 py-2 text-[12px] font-black transition ${
                    active
                      ? "border-[#93C572] bg-[#93C572] text-[#07110A]"
                      : "border-white/10 bg-white/[0.03] text-white/75 hover:border-[#93C572]/45 hover:text-[#93C572]"
                  }`}
                >
                  Day {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {meals.map((meal) => (
          <MealCard key={meal.label} meal={meal} />
        ))}
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: MealCardData }) {
  const Icon = meal.icon;

  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: meal.color }}>
            {meal.label}
          </p>
          <h3 className="mt-2 text-[20px] font-black text-white">{meal.title}</h3>
        </div>
        <div
          className="grid h-11 w-11 place-items-center rounded-2xl border"
          style={{
            color: meal.color,
            borderColor: `${meal.color}33`,
            backgroundColor: `${meal.color}12`,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-2 text-[12px] font-bold text-white/45">{meal.time}</p>
      <p className="mt-4 min-h-[72px] text-[14px] font-semibold leading-6 text-white/70">
        {meal.text}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="rounded-xl bg-white/[0.04] px-3 py-2 text-[12px] font-bold text-white/70">
          {meal.calories || "—"} kcal
        </span>
        <span className="rounded-xl bg-white/[0.04] px-3 py-2 text-[12px] font-bold text-white/70">
          {meal.protein || "—"}g protein
        </span>
      </div>
    </div>
  );
}

function MacroPanel({
  calories,
  protein,
  carbs,
  fats,
  water,
}: {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  water: number;
}) {
  const rows = [
    { label: "Calories", value: calories ? calories.toLocaleString() : "—", color: WARNING },
    { label: "Protein", value: protein ? `${protein}g` : "—", color: PRIMARY },
    { label: "Carbs", value: carbs ? `${carbs}g` : "—", color: TEAL },
    { label: "Fats", value: fats ? `${fats}g` : "—", color: PURPLE },
    { label: "Water", value: `${water}L`, color: TEAL },
  ];

  return (
    <div className="rounded-[26px] border border-white/10 bg-[#061009]/70 p-5">
      <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#93C572]">
        Macro Targets
      </p>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
            <p className="text-[13px] font-bold text-white/65">{row.label}</p>
            <p className="text-[15px] font-black" style={{ color: row.color }}>{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachNotes({ plan, day }: { plan: StoredGeneratedPlan | null; day?: PlanDay }) {
  const notes = [
    plan?.coach_message,
    plan?.ai_tip,
    plan?.health_insight,
    day?.workout_tip,
  ].filter((note): note is string => Boolean(note));

  return (
    <div className="rounded-[26px] border border-[#18D3D0]/18 bg-[#041615]/70 p-5">
      <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-[#18D3D0]">
        <Sparkles size={15} />
        Coach Notes
      </p>

      <div className="mt-5 space-y-3">
        {(notes.length ? notes.slice(0, 3) : ["Your AI notes will appear after generating a plan."]).map((note, index) => (
          <p
            key={`${index}-${note.slice(0, 20)}`}
            className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[14px] font-semibold leading-6 text-white/68"
          >
            {note}
          </p>
        ))}
      </div>

      <p className="mt-5 rounded-[18px] border border-[#F5B942]/25 bg-[#2A1A05]/45 px-4 py-3 text-[13px] font-semibold leading-6 text-white/60">
        Wellness guidance only. Use Progress logs to compare this plan with actual adherence.
      </p>
    </div>
  );
}

function MedicalPlanBlockedNotice({ response }: { response: StoredGeneratedPlan }) {
  const message =
    response.message ||
    response.medical_risk?.block_reason ||
    "Medical guidance is required before using AI nutrition or workout recommendations.";

  return (
    <div className="mb-5 rounded-[24px] border border-[#E96B6B]/35 bg-[#2A070D]/70 p-5 shadow-[0_0_36px_rgba(233,107,107,0.1)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#E96B6B]/35 bg-[#E96B6B]/10 text-[#E96B6B]">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-[15px] font-black uppercase tracking-[0.18em] text-[#E96B6B]">
            Medical Guidance Required
          </p>
          <p className="mt-2 max-w-[960px] text-[15px] font-semibold leading-7 text-white/82">
            {message}
          </p>
          <p className="mt-3 text-[13px] leading-6 text-white/55">
            No nutrition plan, workout plan, calorie target, macros, or AI coach
            recommendation was generated for this profile.
          </p>
        </div>
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_76%_24%,rgba(147,197,114,0.09),transparent_34%),radial-gradient(circle_at_18%_68%,rgba(24,211,208,0.06),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.08] [background-image:linear-gradient(rgba(147,197,114,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.1)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}
