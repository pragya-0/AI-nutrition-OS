import { useEffect, useMemo, useState, type ElementType } from "react";
import { Link } from "react-router-dom";
import {
  Apple,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Flame,
  Heart,
  Info,
  Leaf,
  Moon,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Utensils,
  AlertTriangle,
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

type MealKey = "breakfast" | "lunch" | "snack" | "dinner";

type MealCardData = {
  key: MealKey;
  label: string;
  title: string;
  time: string;
  text: string;
  calories: number;
  protein: number;
  color: string;
  icon: ElementType;
  image: string;
  status: "Completed" | "Planned";
};

const PRIMARY = "#93C572";
const TEAL = "#18D3D0";
const WARNING = "#F5B942";
const PURPLE = "#A875FF";
const BLUE = "#4BA3FF";

const mealImages: Record<MealKey, string> = {
  breakfast: "/assets/scanner/egg-white-veggie-bowl.png",
  lunch: "/assets/scanner/grilled-chicken-brown-rice.png",
  snack: "/assets/scanner/chickpea-veg-power-bowl.png",
  dinner: "/assets/scanner/grilled-fish-steamed-veg.png",
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
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
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
    plan.analytics?.meal_quality || {
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

function mealText(day: PlanDay | undefined, key: MealKey) {
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
      key: "breakfast",
      label: "Breakfast",
      title: "Breakfast",
      time: getMealTime(plan, "breakfast_time", "8:00 AM"),
      text: mealText(day, "breakfast"),
      calories: Math.round(calories * 0.25),
      protein: Math.round(protein * 0.25),
      color: WARNING,
      icon: Flame,
      image: mealImages.breakfast,
      status: selectedDayIndex === 0 ? "Completed" : "Planned",
    },
    {
      key: "lunch",
      label: "Lunch",
      title: "Lunch",
      time: getMealTime(plan, "lunch_time", "1:00 PM"),
      text: mealText(day, "lunch"),
      calories: Math.round(calories * 0.35),
      protein: Math.round(protein * 0.35),
      color: TEAL,
      icon: Utensils,
      image: mealImages.lunch,
      status: selectedDayIndex === 0 ? "Completed" : "Planned",
    },
    {
      key: "snack",
      label: "Snack",
      title: "Snack",
      time: getMealTime(plan, "evening_snack", "4:30 PM"),
      text: mealText(day, "snack"),
      calories: Math.round(calories * 0.12),
      protein: Math.round(protein * 0.12),
      color: PRIMARY,
      icon: Apple,
      image: mealImages.snack,
      status: "Planned",
    },
    {
      key: "dinner",
      label: "Dinner",
      title: "Dinner",
      time: getMealTime(plan, "dinner_time", "8:30 PM"),
      text: mealText(day, "dinner"),
      calories: Math.max(Math.round(calories * 0.28), 0),
      protein: Math.round(protein * 0.28),
      color: PURPLE,
      icon: Moon,
      image: mealImages.dinner,
      status: "Planned",
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

function shortMealName(text: string, fallback: string) {
  if (!text || text === "Meal details not available." || text === "Generate a plan to view this meal.") return fallback;
  const clean = text.split(".")[0].split(",")[0].trim();
  return clean.length > 32 ? `${clean.slice(0, 29)}...` : clean;
}

export default function AINutritionPlan() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [plan, setPlan] = useState<StoredGeneratedPlan | null>(() => getStoredGeneratedPlan());
  const [blockedResponse, setBlockedResponse] = useState<StoredGeneratedPlan | null>(() => getStoredBlockedResponse());
  const [selectedDuration, setSelectedDuration] = useState(30);

  const totalDays = Math.max(plan?.meal_plan?.days?.length || 0, selectedDuration || 7);
  const safeDayIndex = clampDayIndex(selectedDayIndex, totalDays);
  const selectedDay = safeDayIndex + 1;
  const targets = plan?.targets || {};
  const profile = plan?.user_profile || {};
  const quality = getPlanQualityStatus(plan);
  const meals = useMemo(() => buildMeals(plan, safeDayIndex), [plan, safeDayIndex]);

  const waterTarget = parseWaterTarget(targets.water_target, profile.water_intake || 2.5);
  const calorieTarget = Number(targets.calories || 2061);
  const proteinTarget = Number(targets.protein || 93);
  const carbsTarget = Number(targets.carbs || 294);
  const fatsTarget = Number(targets.fats || 57);
  const goal = formatLabel(profile.goal || "fat_loss");
  const diet = formatLabel(profile.diet || "balanced");

  const refreshFromStorage = () => {
    const freshPlan = getStoredGeneratedPlan();
    const freshBlocked = getStoredBlockedResponse();
    const dayCount = freshPlan?.meal_plan?.days?.length || selectedDuration || 7;

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

  const chooseDay = (dayIndex: number) => setSelectedDayIndex(clampDayIndex(dayIndex, totalDays));

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-3 py-4 pb-24 text-[#F5F8F2] sm:px-5 lg:px-6 xl:px-8 md:pb-8">
      <div className="relative mx-auto w-full max-w-[1880px] overflow-hidden rounded-[32px] border border-[#93C572]/18 bg-[#030805] shadow-[0_0_90px_rgba(147,197,114,0.07)]">
        <BackgroundFX />

        <div className="relative z-10 p-5 sm:p-7 lg:p-9 xl:p-10">
          {blockedResponse?.blocked ? <MedicalPlanBlockedNotice response={blockedResponse} /> : null}

          <NutritionHero
            goal={goal}
            calories={calorieTarget}
            protein={proteinTarget}
            water={waterTarget}
            onRefresh={refreshFromStorage}
          />

          <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,1fr)_430px]">
            <div className="min-w-0 space-y-5">
              <TodayMeals meals={meals} selectedDay={selectedDay} totalDays={totalDays} onSelectDay={chooseDay} />
              <MealPlanTimeline
                selectedDay={selectedDay}
                totalDays={totalDays}
                onSelectDay={chooseDay}
                calories={calorieTarget}
                protein={proteinTarget}
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
              />
            </div>

            <div className="grid content-start gap-5">
              <SmartSwaps />
              <DailyNutritionScore calories={calorieTarget} protein={proteinTarget} water={waterTarget} />
            </div>
          </div>

          <AIPlanIntelligence quality={quality} protein={proteinTarget} water={waterTarget} />

          <div className="mt-5 grid items-stretch gap-5 xl:grid-cols-2">
            <WeekOverview
              totalDays={totalDays}
              selectedDay={selectedDay}
              onSelectDay={chooseDay}
              protein={proteinTarget}
              calories={calorieTarget}
              quality={quality}
            />
            <PlanQualityStatus quality={quality} />
          </div>

          <div className="mt-5 grid items-stretch gap-5 xl:grid-cols-2">
            <NutritionCalendar
              totalDays={totalDays}
              selectedDay={selectedDay}
              onSelectDay={chooseDay}
            />

            <div className="grid content-stretch gap-5">
              <SmartSwapCenter />
              <AIInsightRow
                calories={calorieTarget}
                protein={proteinTarget}
                water={waterTarget}
                carbs={carbsTarget}
                fats={fatsTarget}
                goal={goal}
                diet={diet}
                totalDays={totalDays}
                quality={quality}
              />
            </div>
          </div>

          <div className="mt-5 grid items-stretch gap-5 xl:grid-cols-2">
            <ProgramCoverage
              totalDays={totalDays}
              quality={quality}
              protein={proteinTarget}
              water={waterTarget}
            />
            <CoachNotes plan={plan} day={plan?.meal_plan?.days?.[safeDayIndex]} />
          </div>

          <div className="mt-5">
            <GeneratePlanBar selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} />
          </div>
        </div>
      </div>
    </section>
  );
}

function NutritionHero({
  goal,
  calories,
  protein,
  water,
  onRefresh,
}: {
  goal: string;
  calories: number;
  protein: number;
  water: number;
  onRefresh: () => void;
}) {
  const stats = [
    { label: "Calories", value: calories.toLocaleString(), sub: "/day", icon: Flame, color: WARNING },
    { label: "Protein", value: `${protein}g`, sub: "/day", icon: Sparkles, color: TEAL },
    { label: "Hydration", value: `${water}L`, sub: "/day", icon: Droplets, color: BLUE },
    { label: "Goal", value: goal, sub: "-0.4 kg / week", icon: Target, color: PURPLE },
  ];

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-[#18D3D0]/12 bg-[#061009]/70 p-5 sm:p-7 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_18%,rgba(24,211,208,0.13),transparent_28%),radial-gradient(circle_at_78%_55%,rgba(147,197,114,0.11),transparent_30%)]" />
      <div className="relative z-10 grid gap-6 xl:grid-cols-[0.82fr_1fr_0.76fr] xl:items-center">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">Nutrition Workspace</p>
          <h1 className="mt-4 text-[42px] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[58px] xl:text-[66px]">
            Your Nutrition Plan
          </h1>
          <p className="mt-3 text-[24px] font-semibold tracking-[-0.04em] text-white/88 sm:text-[30px]">
            Designed by AI, just for you.
          </p>
          <p className="mt-5 max-w-[560px] text-[17px] font-semibold leading-8 text-white/66">
            Balanced meals, smart swaps, daily targets, and AI guidance built around your generated profile.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {stats.map((stat) => (
              <HeroStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-[#18D3D0]/10 bg-black/10 xl:min-h-[330px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,211,208,0.18),transparent_65%)]" />
          <img
            src="/assets/scanner/healthy-salad-bowl-glow.png"
            alt="AI nutrition bowl"
            className="absolute left-1/2 top-1/2 h-[410px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_80px_rgba(24,211,208,0.26)] xl:h-[520px]"
          />
          <FloatingBubble className="left-[8%] top-[14%]" icon={Leaf} color={PRIMARY} />
          <FloatingBubble className="right-[8%] top-[18%]" icon={Droplets} color={TEAL} />
          <FloatingBubble className="left-[13%] bottom-[22%]" icon={Heart} color={PRIMARY} />
          <FloatingBubble className="right-[12%] bottom-[26%]" icon={Sparkles} color={WARNING} />
        </div>

        <div className="min-h-[320px] rounded-[28px] border border-[#93C572]/18 bg-[#061009]/82 p-5 shadow-[0_0_45px_rgba(147,197,114,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[22px] font-black text-white">
                <Sparkles size={24} className="text-[#93C572]" /> AI Coach
              </p>
              <p className="mt-1 text-[14px] font-semibold text-white/58">Your personal nutrition guide</p>
            </div>
            <img src="/assets/AI-girl.png" alt="AI Coach" className="h-28 w-auto object-contain drop-shadow-[0_0_35px_rgba(147,197,114,0.16)]" />
          </div>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
            <p className="text-[17px] font-black text-white">You’re on the right track! 💚</p>
            <p className="mt-3 text-[15px] font-semibold leading-7 text-white/68">
              Your protein intake is consistent. Let’s focus on hydration today.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/progress" className="inline-flex items-center gap-2 rounded-2xl border border-[#93C572]/35 bg-[#93C572]/10 px-5 py-3 text-[13px] font-black text-[#93C572] transition hover:bg-[#93C572]/16">
              View Coach Insights
              <ChevronDown size={16} className="-rotate-90" />
            </Link>
            <button onClick={onRefresh} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-black text-white/80 transition hover:border-[#93C572]/30">
              <RotateCcw size={16} /> Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: ElementType; color: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center gap-3">
        <Icon size={30} style={{ color }} />
        <div>
          <p className="text-[14px] font-semibold text-white/70">{label}</p>
          <p className="mt-1 text-[30px] font-black leading-none text-white">{value}</p>
          <p className="mt-1 text-[13px] font-semibold text-white/50">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function FloatingBubble({ className, icon: Icon, color }: { className: string; icon: ElementType; color: string }) {
  return (
    <div className={`absolute grid h-12 w-12 place-items-center rounded-full border bg-[#061009]/80 shadow-[0_0_30px_rgba(24,211,208,0.08)] ${className}`} style={{ borderColor: `${color}40`, color }}>
      <Icon size={22} />
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[20px] font-black tracking-[-0.03em] text-white">{title}</h2>
      {subtitle ? <p className="mt-1 text-[13px] font-semibold text-white/55">{subtitle}</p> : null}
    </div>
  );
}

function TodayMeals({ meals, selectedDay, totalDays, onSelectDay }: { meals: MealCardData[]; selectedDay: number; totalDays: number; onSelectDay: (dayIndex: number) => void }) {
  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[26px] font-black tracking-[-0.045em] text-white">Today’s Meals</h2>
            <span className="rounded-full border border-[#93C572]/25 bg-[#93C572]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#93C572]">
              Day {selectedDay} of {totalDays}
            </span>
          </div>
          <p className="mt-1 max-w-[760px] text-[14px] font-semibold text-white/58">
            What you eat today stays simple. The planner below handles 7, 15, and 30-day depth.
          </p>
        </div>
        <button onClick={() => onSelectDay(Math.max(selectedDay - 1, 0))} className="inline-flex w-fit items-center gap-2 text-[14px] font-black text-[#93C572]">
          View Full Plan
          <ChevronDown size={16} className="-rotate-90" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {meals.map((meal) => <MealCard key={meal.label} meal={meal} />)}
        <AddMealCard />
      </div>
    </div>
  );
}

function MealPlanTimeline({
  selectedDay,
  totalDays,
  onSelectDay,
  calories,
  protein,
  selectedDuration,
  setSelectedDuration,
}: {
  selectedDay: number;
  totalDays: number;
  onSelectDay: (dayIndex: number) => void;
  calories: number;
  protein: number;
  selectedDuration: number;
  setSelectedDuration: (duration: number) => void;
}) {
  const visibleDays = Math.max(totalDays, selectedDuration, 1);

  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <SectionHeader title="Meal Plan Timeline Pro" subtitle="Explore your plan day-by-day. Click any day to view meals." />
        <div className="flex items-center gap-3">
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/45">Plan Length</p>
          <select
            value={selectedDuration}
            onChange={(event) => setSelectedDuration(Number(event.target.value))}
            className="rounded-2xl border border-white/10 bg-[#030805] px-4 py-3 text-[13px] font-black text-white outline-none focus:border-[#93C572]/45"
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={15}>15 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(147,197,114,.45)_rgba(255,255,255,.06)]">
        {Array.from({ length: visibleDays }, (_, index) => {
          const active = index + 1 === selectedDay;
          return (
            <button
              key={`timeline-day-${index + 1}`}
              onClick={() => onSelectDay(index)}
              className={`min-w-[116px] rounded-[20px] border px-4 py-4 text-left transition ${
                active
                  ? "border-[#93C572] bg-[#93C572] text-[#07110A] shadow-[0_0_28px_rgba(147,197,114,0.24)]"
                  : "border-white/10 bg-white/[0.03] text-white/74 hover:border-[#93C572]/40 hover:text-[#93C572]"
              }`}
            >
              <p className="text-[15px] font-black">Day {index + 1}</p>
              <p className={`mt-2 text-[12px] font-bold ${active ? "text-[#07110A]/70" : "text-white/50"}`}>{calories.toLocaleString()} kcal</p>
              <p className={`mt-1 text-[12px] font-bold ${active ? "text-[#07110A]/70" : "text-white/50"}`}>{protein}g protein</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AIPlanIntelligence({ quality, protein, water }: { quality: ReturnType<typeof getPlanQualityStatus>; protein: number; water: number }) {
  const variety = quality?.mealVariety || 96;
  const cards = [
    { label: "Variety Score", value: `${variety}%`, sub: "Excellent", icon: Leaf, color: PRIMARY },
    { label: "Protein Coverage", value: protein ? "98%" : "—", sub: "Target Achieved", icon: Sparkles, color: TEAL },
    { label: "Hydration Coverage", value: water ? "100%" : "—", sub: "Complete", icon: Droplets, color: BLUE },
    { label: "Plan Consistency", value: "94%", sub: "Strong", icon: Target, color: PURPLE },
  ];

  return (
    <div className="mt-5 rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <SectionHeader title="AI Plan Intelligence" subtitle="Real-time evaluation of your nutrition plan quality." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-4">
              <card.icon size={42} style={{ color: card.color }} />
              <ChevronDown size={20} className="-rotate-90 text-white/28" />
            </div>
            <p className="mt-4 text-[40px] font-black leading-none" style={{ color: card.color }}>{card.value}</p>
            <p className="mt-2 text-[15px] font-black text-white">{card.label}</p>
            <p className="mt-1 text-[13px] font-semibold" style={{ color: card.color }}>{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekOverview({
  totalDays,
  selectedDay,
  onSelectDay,
  protein,
  calories,
  quality,
}: {
  totalDays: number;
  selectedDay: number;
  onSelectDay: (dayIndex: number) => void;
  protein: number;
  calories: number;
  quality: ReturnType<typeof getPlanQualityStatus>;
}) {
  const weekCount = Math.max(1, Math.ceil(totalDays / 7));
  const displayWeekCount = Math.min(4, Math.max(weekCount, selectedDay > 21 ? 4 : totalDays >= 15 ? 4 : totalDays >= 8 ? 2 : 1));
  const varietyScore = quality?.mealVariety || 96;

  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <SectionHeader title="Week Overview" subtitle="Overview of your weekly nutrition performance." />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: displayWeekCount }, (_, index) => {
          const start = index * 7 + 1;
          const end = Math.min(start + 6, Math.max(totalDays, start));
          const active = selectedDay >= start && selectedDay <= end;
          return (
            <button
              key={`week-${index + 1}`}
              onClick={() => onSelectDay(start - 1)}
              className={`rounded-[22px] border p-5 text-left transition ${active ? "border-[#93C572]/60 bg-[#93C572]/10" : "border-white/10 bg-white/[0.025] hover:border-[#93C572]/30"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[22px] font-black text-[#93C572]">Week {index + 1}</p>
                  <p className="mt-1 text-[13px] font-semibold text-white/50">Days {start}–{end}</p>
                </div>
                <span className="text-[24px]" style={{ color: index % 2 ? TEAL : PRIMARY }}>▥</span>
              </div>
              <div className="mt-5 space-y-3">
                <WeekRow label="Avg Calories" value={`${Math.max(calories - index * 7, 0).toLocaleString()}`} />
                <WeekRow label="Protein (avg)" value={`${protein + (index % 2)}g`} />
                <WeekRow label="Variety Score" value={`${Math.max(varietyScore - index, 90)}%`} />
              </div>
              <p className="mt-5 flex items-center gap-2 text-[13px] font-black text-[#93C572]"><CheckCircle2 size={16} /> Excellent</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 pb-2 text-[14px] font-semibold">
      <span className="text-white/58">{label}</span>
      <span className="font-black text-[#93C572]">{value}</span>
    </div>
  );
}

function NutritionCalendar({ totalDays, selectedDay, onSelectDay }: { totalDays: number; selectedDay: number; onSelectDay: (dayIndex: number) => void }) {
  const days = Array.from({ length: Math.max(totalDays, 30) }, (_, index) => index + 1);
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex h-full min-h-[560px] flex-col rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title="Nutrition Calendar" subtitle="Click any date to view meals for that day." />
        <CalendarDays size={26} className="text-[#93C572]" />
      </div>

      <div className="mt-3 grid flex-1 grid-cols-7 overflow-hidden rounded-[20px] border border-white/10">
        {weekLabels.map((label) => <div key={label} className="border-b border-white/10 bg-white/[0.035] px-2 py-3 text-center text-[12px] font-black text-white/60">{label}</div>)}
        {days.map((day) => {
          const active = day === selectedDay;
          return (
            <button
              key={`calendar-day-${day}`}
              onClick={() => onSelectDay(day - 1)}
              className={`relative min-h-[72px] border-t border-white/8 px-2 py-3 text-center text-[15px] font-black transition ${
                active
                  ? "bg-[#93C572] text-[#07110A] shadow-[0_0_22px_rgba(147,197,114,0.2)]"
                  : "bg-black/16 text-white/78 hover:bg-[#93C572]/10 hover:text-[#93C572]"
              }`}
            >
              {day}
              <span className={`absolute bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${active ? "bg-[#07110A]" : "bg-[#93C572]"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlanQualityStatus({ quality }: { quality: ReturnType<typeof getPlanQualityStatus> }) {
  const warnings = [
    { type: "good", title: "Protein Coverage Excellent", text: "You’re meeting your daily protein targets consistently." },
    { type: "good", title: "Meal Variety Strong", text: "Great variety. Your meals are well balanced." },
    { type: quality?.maxRepeat && quality.maxRepeat > 3 ? "warn" : "good", title: quality?.maxRepeat && quality.maxRepeat > 3 ? `Repeated meal detected` : "No repeated meal issues detected", text: quality?.maxRepeat && quality.maxRepeat > 3 ? `A meal repeats ${quality.maxRepeat} times. Try swapping with tofu or chickpeas.` : "Your plan is not showing risky meal repetition." },
    { type: "warn", title: "Water target missed Day 3", text: "Try drinking 0.5L more tomorrow." },
  ];

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <SectionHeader title="Plan Quality Status" subtitle="AI checks to ensure your plan stays on track." />

      <div className="grid flex-1 gap-3">
        {warnings.map((item) => (
          <div key={item.title} className="flex min-h-[78px] items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-white/[0.025] px-4 py-3">
            <div className="flex gap-3">
              <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#07110A] ${item.type === "good" ? "bg-[#93C572]" : "bg-[#F5B942]"}`}>
                {item.type === "good" ? <CheckCircle2 size={18} /> : <Info size={18} />}
              </span>
              <div>
                <p className="text-[15px] font-black text-white">{item.title}</p>
                <p className="mt-1 text-[13px] font-semibold leading-5 text-white/58">{item.text}</p>
              </div>
            </div>
            {item.type === "warn" ? <button className="hidden rounded-xl border border-[#93C572]/35 px-4 py-2 text-[12px] font-black text-[#93C572] sm:block">Fix</button> : null}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#93C572]/18 bg-[#93C572]/8 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">Readiness</p>
          <p className="mt-1 text-[18px] font-black text-[#93C572]">{quality?.productionReady ? "Ready" : "Review"}</p>
        </div>
        <div className="rounded-2xl border border-[#18D3D0]/18 bg-[#18D3D0]/8 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">Variety</p>
          <p className="mt-1 text-[18px] font-black text-[#18D3D0]">{quality?.mealVariety || 96}%</p>
        </div>
        <div className="rounded-2xl border border-[#F5B942]/18 bg-[#F5B942]/8 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/45">Grocery</p>
          <p className="mt-1 text-[18px] font-black text-[#F5B942]">{quality?.groceryCount || "Auto"}</p>
        </div>
      </div>
    </div>
  );
}

function SmartSwapCenter() {
  const swaps = [
    { before: "White Rice", after: "Quinoa", protein: "+4g Protein", kcal: "-120 kcal", image: "/assets/swap-before.png" },
    { before: "Roti", after: "Moong Chilla", protein: "+3g Protein", kcal: "-80 kcal", image: "/assets/scanner/moong-dal-chilla-salad.png" },
    { before: "Sugary Yogurt", after: "Greek Yogurt", protein: "+6g Protein", kcal: "-60 kcal", image: "/assets/swap-after.png" },
    { before: "Potato Sabzi", after: "Mix Veg", protein: "+3g Fiber", kcal: "-70 kcal", image: "/assets/scanner/chickpea-veg-power-bowl.png" },
  ];

  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5">
      <SectionHeader title="Smart Swaps Center" subtitle="AI suggestions to improve your meals." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        {swaps.map((swap) => (
          <div key={swap.before} className="min-h-[132px] rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <img src={swap.image} alt={swap.after} className="h-14 w-14 rounded-2xl object-cover" />
              <div className="min-w-0">
                <p className="text-[14px] font-black text-white">{swap.before}</p>
                <p className="text-[12px] font-bold text-[#93C572]">↓ {swap.after}</p>
              </div>
            </div>
            <p className="mt-4 text-[15px] font-black text-[#93C572]">{swap.protein}</p>
            <p className="mt-1 text-[15px] font-black text-[#93C572]">{swap.kcal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmartSwaps() {
  const swaps = [
    { before: "White Rice", after: "Quinoa", note: "More protein, more fiber", kcal: "-120", image: "/assets/swap-before.png" },
    { before: "Regular Roti", after: "Moong Dal Chilla", note: "More protein, less carbs", kcal: "-80", image: "/assets/scanner/moong-dal-chilla-salad.png" },
    { before: "Sugary Yogurt", after: "Greek Yogurt", note: "High protein, low sugar", kcal: "-60", image: "/assets/swap-after.png" },
  ];

  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-black tracking-[-0.04em] text-white">Smart Swaps for You</h2>
          <p className="mt-1 text-[14px] font-semibold text-white/55">AI recommended swaps</p>
        </div>
        <button className="text-[14px] font-black text-[#93C572]">See All</button>
      </div>

      <div className="mt-5 grid gap-3">
        {swaps.map((swap) => (
          <div key={swap.before} className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.025] p-3">
            <img src={swap.image} alt={swap.after} className="h-[54px] w-[54px] rounded-2xl object-cover" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[14px] font-black text-white">
                <span>{swap.before}</span>
                <span className="text-[#93C572]">↔</span>
                <span>{swap.after}</span>
              </div>
              <p className="mt-1 text-[12px] font-semibold text-white/55">{swap.note}</p>
            </div>
            <div className="text-right text-[#93C572]">
              <p className="text-[20px] font-black">{swap.kcal}</p>
              <p className="text-[11px] font-semibold">kcal ↓</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyNutritionScore({ calories, protein, water }: { calories: number; protein: number; water: number }) {
  const rows = [
    { label: "Calories", value: calories ? 78 : 0, color: PRIMARY },
    { label: "Protein", value: protein ? 85 : 0, color: PRIMARY },
    { label: "Fiber", value: 82, color: PRIMARY },
    { label: "Hydration", value: water ? 65 : 0, color: WARNING },
    { label: "Micronutrients", value: 80, color: PRIMARY },
  ];

  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5">
      <h2 className="text-[24px] font-black tracking-[-0.04em] text-white">Daily Nutrition Score</h2>
      <p className="mt-1 text-[14px] font-semibold text-white/55">All factors combined</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[150px_1fr]">
        <div className="mx-auto grid h-[150px] w-[150px] place-items-center rounded-full border-[12px] border-[#93C572] bg-[#93C572]/8 shadow-[0_0_38px_rgba(147,197,114,0.14)]">
          <div className="text-center">
            <p className="text-[42px] font-black leading-none text-white">82</p>
            <p className="mt-1 text-[15px] font-semibold text-white/62">/100</p>
          </div>
        </div>

        <div className="grid gap-3">
          {rows.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between text-[14px] font-bold text-white/78">
                <span>{row.label}</span>
                <span>{row.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${row.value}%`, backgroundColor: row.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 text-[14px] font-semibold text-white/60">Great Job! Keep it up.</p>
    </div>
  );
}

function AIInsightRow({
  calories,
  protein,
  water,
  carbs,
  fats,
  goal,
  diet,
  totalDays,
  quality,
}: {
  calories: number;
  protein: number;
  water: number;
  carbs: number;
  fats: number;
  goal: string;
  diet: string;
  totalDays: number;
  quality: ReturnType<typeof getPlanQualityStatus>;
}) {
  const cards = [
    { title: "Protein Intake", text: protein ? `Target ${protein}g/day. Keep protein consistent.` : "Generate plan to unlock protein target.", icon: Sparkles, color: PRIMARY, ok: true },
    { title: "Hydration", text: water ? `You’re ${(water - 0.5).toFixed(1)}L short today. Drink more water in the evening.` : "Hydration target waiting.", icon: Droplets, color: WARNING, ok: false },
    { title: "Meal Timing", text: `Plan built for ${totalDays || 1} day${totalDays === 1 ? "" : "s"}.`, icon: CalendarDays, color: TEAL, ok: true },
    { title: "Goal Alignment", text: `${goal} with ${diet}. ${calories} kcal, ${carbs}g carbs, ${fats}g fats.`, icon: Target, color: PURPLE, ok: Boolean(quality?.productionReady) },
  ];

  return (
    <div className="flex h-full min-h-[260px] flex-col rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <SectionHeader title="AI Coach Insights" subtitle="Personalized insights for your success." />
      <div className="grid flex-1 gap-4 md:grid-cols-3">
        {cards.slice(0, 3).map((card) => (
          <div key={card.title} className="min-h-[190px] rounded-[22px] border border-white/10 bg-white/[0.025] p-5">
            <div className="flex items-start justify-between gap-4">
              <card.icon size={34} style={{ color: card.color }} />
              <span className={`grid h-7 w-7 place-items-center rounded-full text-[#07110A] ${card.ok ? "bg-[#93C572]" : "bg-[#F5B942]"}`}>
                {card.ok ? <CheckCircle2 size={17} /> : <Info size={17} />}
              </span>
            </div>
            <p className="mt-4 text-[17px] font-black text-white">{card.title}</p>
            <p className="mt-2 text-[14px] font-semibold leading-6 text-white/60">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachNotes({ plan, day }: { plan: StoredGeneratedPlan | null; day?: PlanDay }) {
  const notes = [plan?.coach_message, plan?.ai_tip, plan?.health_insight, day?.workout_tip]
    .filter((note): note is string => Boolean(note))
    .slice(0, 3);

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-[28px] border border-[#18D3D0]/18 bg-[#041615]/70 p-5 xl:p-6">
      <SectionHeader title="Coach Notes" subtitle="No scrollbars. Only the three most useful notes." />
      <div className="grid flex-1 gap-3">
        {(notes.length ? notes : ["Your AI notes will appear after generating a plan."]).map((note, index) => (
          <p key={`${index}-${note.slice(0, 20)}`} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4 text-[14px] font-semibold leading-6 text-white/68">
            {note}
          </p>
        ))}
      </div>
    </div>
  );
}

function ProgramCoverage({ totalDays, quality, protein, water }: { totalDays: number; quality: ReturnType<typeof getPlanQualityStatus>; protein: number; water: number }) {
  const variety = quality?.mealVariety || 96;
  const items = [
    { label: "Days Planned", value: totalDays, icon: CalendarDays, color: PRIMARY },
    { label: "Meals Planned", value: totalDays * 4, icon: Utensils, color: WARNING },
    { label: "Variety Score", value: `${variety}%`, icon: Leaf, color: PRIMARY },
    { label: "Protein Target", value: protein ? "100%" : "—", icon: Sparkles, color: TEAL },
    { label: "Hydration Coverage", value: water ? "100%" : "—", icon: Droplets, color: BLUE },
  ];

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <SectionHeader title="Program Coverage" subtitle="Your overall plan summary." />
      <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="flex min-h-[170px] flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03] p-4 text-center">
            <item.icon className="mx-auto" size={36} style={{ color: item.color }} />
            <p className="mt-4 text-[30px] font-black text-white">{item.value}</p>
            <p className="mt-2 text-[12px] font-bold leading-4 text-white/55">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneratePlanBar({ selectedDuration, setSelectedDuration }: { selectedDuration: number; setSelectedDuration: (duration: number) => void }) {
  const options = [1, 7, 15, 30];

  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/76 p-5 xl:p-6">
      <SectionHeader title="Generate / Regenerate Plan" subtitle="Choose plan duration and regenerate anytime." />
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="grid flex-1 grid-cols-4 gap-3">
          {options.map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDuration(days)}
              className={`rounded-2xl border px-4 py-4 text-[14px] font-black transition ${
                selectedDuration === days
                  ? "border-[#93C572] bg-[#93C572]/12 text-[#93C572] shadow-[0_0_18px_rgba(147,197,114,0.14)]"
                  : "border-white/10 bg-white/[0.025] text-white/72 hover:border-[#93C572]/30"
              }`}
            >
              {days} Day{days > 1 ? "s" : ""}
            </button>
          ))}
        </div>
        <Link to="/dashboard/onboarding" className="inline-flex min-h-[72px] min-w-[260px] items-center justify-center rounded-[22px] bg-[#93C572] px-8 text-[22px] font-black text-[#07110A] shadow-[0_0_28px_rgba(147,197,114,0.22)] transition hover:bg-[#A4D08A]">
          ✨ Generate Plan
        </Link>
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: MealCardData }) {
  const Icon = meal.icon;
  const title = shortMealName(meal.text, meal.title);

  return (
    <div className="group relative min-h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20 p-4 transition hover:border-[#93C572]/28">
      <div className="absolute inset-x-0 top-0 h-[170px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/15 to-[#061009]" />
        <img src={meal.image} alt={title} className="h-full w-full object-cover opacity-92 transition duration-300 group-hover:scale-[1.04]" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-black text-white">{meal.label}</p>
          <p className="mt-1 text-[12px] font-semibold text-white/62">{meal.time}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl border bg-[#061009]/80" style={{ color: meal.color, borderColor: `${meal.color}38` }}>
          <Icon size={19} />
        </div>
      </div>

      <div className="relative z-10 mt-[122px]">
        <h3 className="text-[18px] font-black leading-6 text-white">{title}</h3>
        <p className="mt-2 line-clamp-2 min-h-[42px] text-[13px] font-semibold leading-5 text-white/58">{meal.text}</p>

        <div className="mt-4 flex items-center justify-between gap-3 text-[15px] font-semibold text-white/78">
          <span>{meal.calories || "—"} kcal</span>
          <span className="text-[#93C572]">{meal.protein || "—"}g Protein</span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[13px] font-black" style={{ color: meal.status === "Completed" ? PRIMARY : WARNING }}>
          {meal.status === "Completed" ? <CheckCircle2 size={16} /> : <CalendarDays size={16} />}
          {meal.status}
        </div>
      </div>
    </div>
  );
}

function AddMealCard() {
  return (
    <Link to="/scanner" className="grid min-h-[90px] rounded-[24px] border border-dashed border-white/16 bg-white/[0.018] p-4 text-center transition hover:border-[#93C572]/35 hover:bg-[#93C572]/5 xl:col-span-4">
      <div className="flex items-center justify-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-full border border-white/18 bg-white/[0.035] text-white/85">
          <Plus size={28} />
        </div>
        <div className="text-left">
          <p className="text-[18px] font-black text-white">Add Meal / Snack</p>
          <p className="mt-1 text-[13px] font-semibold leading-5 text-white/55">Log your food or scan to add</p>
        </div>
      </div>
    </Link>
  );
}

function MedicalPlanBlockedNotice({ response }: { response: StoredGeneratedPlan }) {
  const message = response.message || response.medical_risk?.block_reason || "Medical guidance is required before using AI nutrition or workout recommendations.";

  return (
    <div className="mb-5 rounded-[24px] border border-[#E96B6B]/35 bg-[#2A070D]/70 p-5 shadow-[0_0_36px_rgba(233,107,107,0.1)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#E96B6B]/35 bg-[#E96B6B]/10 text-[#E96B6B]">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-[15px] font-black uppercase tracking-[0.18em] text-[#E96B6B]">Medical Guidance Required</p>
          <p className="mt-2 max-w-[960px] text-[15px] font-semibold leading-7 text-white/82">{message}</p>
          <p className="mt-3 text-[13px] leading-6 text-white/55">No nutrition plan, workout plan, calorie target, macros, or AI coach recommendation was generated for this profile.</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_43%_5%,rgba(147,197,114,0.08),transparent_26%),radial-gradient(circle_at_78%_24%,rgba(24,211,208,0.08),transparent_28%),radial-gradient(circle_at_12%_76%,rgba(147,197,114,0.05),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(147,197,114,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.12)_1px,transparent_1px)] [background-size:76px_76px]" />
    </>
  );
}
