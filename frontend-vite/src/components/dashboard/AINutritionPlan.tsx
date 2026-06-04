import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Apple,
  CalendarDays,
  ChevronRight,
  Droplets,
  Flame,
  Info,
  AlertTriangle,
  Moon,
  RotateCcw,
  Settings,
  Sparkles,
} from "lucide-react";

type Meal = {
  id: number;
  label: string;
  name: string;
  time: string;
  image: string;
  icon: "sun" | "moon";
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  accent: string;
};

type NutritionPlanData = {
  selectedDay: number;
  totalDays: number;
  plan: {
    match: number;
    goal: string;
    aiConfidence: number;
    description: string;
    calorieMode: string;
  };
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    proteinPercent: number;
    carbsPercent: number;
    fatsPercent: number;
  };
  whyThisPlan: string[];
  meals: Meal[];
  hydration: {
    consumed: number;
    target: number;
  };
  aiNotes: string[];
  swap: {
    beforeImage: string;
    afterImage: string;
    title: string;
    description: string;
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
    health_score?: number;
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
  daily_routine?: Record<string, string>;
};

const fallbackData: NutritionPlanData = {
  selectedDay: 1,
  totalDays: 0,
  plan: {
    match: 0,
    goal: "Personalized Plan",
    aiConfidence: 0,
    description:
      "Generate your first AI nutrition plan to unlock personalized meals, calories, macros, hydration, and coach insights.",
    calorieMode: "Waiting for assessment",
  },
  targets: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    proteinPercent: 0,
    carbsPercent: 0,
    fatsPercent: 0,
  },
  whyThisPlan: [
    "Complete assessment to activate your nutrition plan",
    "AI will personalize your meals based on body profile",
    "Targets will adapt to your goal and activity",
    "Dashboard will update after plan generation",
  ],
  meals: [
    {
      id: 1,
      label: "MEAL 1",
      name: "Breakfast",
      time: "8:00 AM",
      image: "/assets/breakfast.png",
      icon: "sun",
      foods: ["Generate a plan to view breakfast"],
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      accent: "#FFB347",
    },
    {
      id: 2,
      label: "MEAL 2",
      name: "Lunch",
      time: "1:00 PM",
      image: "/assets/lunch.png",
      icon: "sun",
      foods: ["Generate a plan to view lunch"],
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      accent: "#18D3D0",
    },
    {
      id: 3,
      label: "MEAL 3",
      name: "Snack",
      time: "5:00 PM",
      image: "/assets/snack.png",
      icon: "sun",
      foods: ["Generate a plan to view snack"],
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      accent: "#A6FF4D",
    },
    {
      id: 4,
      label: "MEAL 4",
      name: "Dinner",
      time: "8:00 PM",
      image: "/assets/dinner.png",
      icon: "moon",
      foods: ["Generate a plan to view dinner"],
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      accent: "#A875FF",
    },
  ],
  hydration: {
    consumed: 0,
    target: 2.5,
  },
  aiNotes: [
    "Your AI notes will appear after generating a plan.",
    "The plan will use your profile, goals, diet, and health inputs.",
  ],
  swap: {
    beforeImage: "/assets/swap-before.png",
    afterImage: "/assets/swap-after.png",
    title: "Swap Suggestions",
    description: "Smart food swaps will appear after your plan is generated.",
  },
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


function getGeneratedPlanDayCount(plan?: StoredGeneratedPlan | null) {
  return plan?.meal_plan?.days?.length || 0;
}

function clampDayIndex(index: number, totalDays: number) {
  if (!totalDays || totalDays <= 0) return 0;
  return Math.min(Math.max(index, 0), totalDays - 1);
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

function getMacroPercent(value: number, total: number) {
  if (!total || total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function uniqueTextList(values: Array<string | undefined | null>) {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );
}

function splitMealText(text?: string) {
  if (!text) return ["Meal details not available"];

  return text
    .split(/\s+with\s+|\s*,\s*|\s+\+\s+/i)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function buildMeal({
  id,
  label,
  name,
  time,
  text,
  calories,
  protein,
  carbs,
  fats,
  image,
  icon,
  accent,
}: {
  id: number;
  label: string;
  name: string;
  time: string;
  text?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
  icon: "sun" | "moon";
  accent: string;
}): Meal {
  return {
    id,
    label,
    name,
    time,
    image,
    icon,
    foods: splitMealText(text),
    calories,
    protein,
    carbs,
    fats,
    accent,
  };
}

function transformGeneratedPlan(plan: StoredGeneratedPlan, selectedDayIndex = 0): NutritionPlanData {
  const profile = plan.user_profile || {};
  const targets = plan.targets || {};
  const analytics = plan.analytics || {};
  const totalDays = getGeneratedPlanDayCount(plan);
  const safeDayIndex = clampDayIndex(selectedDayIndex, totalDays);
  const dayOne = plan.meal_plan?.days?.[safeDayIndex];
  const dayMeals = dayOne?.meals || {};

  const calories = targets.calories || 0;
  const protein = targets.protein || 0;
  const carbs = targets.carbs || 0;
  const fats = targets.fats || 0;
  const macroTotal = protein + carbs + fats;

  const breakfastCalories = Math.round(calories * 0.25);
  const lunchCalories = Math.round(calories * 0.35);
  const snackCalories = Math.round(calories * 0.12);
  const dinnerCalories = Math.max(
    calories - breakfastCalories - lunchCalories - snackCalories,
    0,
  );

  const waterTarget = parseWaterTarget(
    targets.water_target,
    profile.water_intake || 2.5,
  );

  const goal = formatLabel(profile.goal);
  const healthScore = analytics.health_score || 90;

  const recommendedFocus =
    analytics.strategy_details?.recommended_focus?.map(formatLabel) || [];

  return {
    selectedDay: safeDayIndex + 1,
    totalDays,
    plan: {
      match: Math.min(Math.max(healthScore, 70), 99),
      goal,
      aiConfidence: Math.min(Math.max(healthScore, 75), 99),
      description:
        plan.health_insight ||
        analytics.strategy_details?.reason ||
        "Your plan is personalized using your goal, diet, activity, sleep, hydration, and health analytics.",
      calorieMode: `${calories.toLocaleString()} kcal target`,
    },
    targets: {
      calories,
      protein,
      carbs,
      fats,
      proteinPercent: getMacroPercent(protein, macroTotal),
      carbsPercent: getMacroPercent(carbs, macroTotal),
      fatsPercent: getMacroPercent(fats, macroTotal),
    },
    whyThisPlan: [
      `Built for ${goal}`,
      `Diet type: ${formatLabel(profile.diet)}`,
      `Activity level: ${formatLabel(profile.activity)}`,
      analytics.metabolic_strategy
        ? `Strategy: ${analytics.metabolic_strategy}`
        : "AI optimized based on profile and health inputs",
      ...recommendedFocus.slice(0, 2),
    ].slice(0, 5),
    meals: [
      buildMeal({
        id: 1,
        label: "MEAL 1",
        name: "Breakfast",
        time: plan.daily_routine?.breakfast_time?.split(" - ")?.[0] || "8:00 AM",
        text: dayMeals.breakfast || dayOne?.breakfast,
        calories: breakfastCalories,
        protein: Math.round(protein * 0.25),
        carbs: Math.round(carbs * 0.25),
        fats: Math.round(fats * 0.25),
        image: "/assets/breakfast.png",
        icon: "sun",
        accent: "#FFB347",
      }),
      buildMeal({
        id: 2,
        label: "MEAL 2",
        name: "Lunch",
        time: plan.daily_routine?.lunch_time?.split(" - ")?.[0] || "1:00 PM",
        text: dayMeals.lunch || dayOne?.lunch,
        calories: lunchCalories,
        protein: Math.round(protein * 0.35),
        carbs: Math.round(carbs * 0.35),
        fats: Math.round(fats * 0.35),
        image: "/assets/lunch.png",
        icon: "sun",
        accent: "#18D3D0",
      }),
      buildMeal({
        id: 3,
        label: "MEAL 3",
        name: "Snack",
        time: plan.daily_routine?.evening_snack?.split(" - ")?.[0] || "5:00 PM",
        text: dayMeals.snack || dayOne?.snack,
        calories: snackCalories,
        protein: Math.round(protein * 0.12),
        carbs: Math.round(carbs * 0.12),
        fats: Math.round(fats * 0.12),
        image: "/assets/snack.png",
        icon: "sun",
        accent: "#A6FF4D",
      }),
      buildMeal({
        id: 4,
        label: "MEAL 4",
        name: "Dinner",
        time: plan.daily_routine?.dinner_time?.split(" - ")?.[0] || "8:00 PM",
        text: dayMeals.dinner || dayOne?.dinner,
        calories: dinnerCalories,
        protein: Math.round(protein * 0.28),
        carbs: Math.round(carbs * 0.28),
        fats: Math.round(fats * 0.28),
        image: "/assets/dinner.png",
        icon: "moon",
        accent: "#A875FF",
      }),
    ],
    hydration: {
      consumed: profile.water_intake || 0,
      target: waterTarget,
    },
    aiNotes: uniqueTextList([
      plan.coach_message || "AI coach message will appear here.",
      plan.ai_tip || dayOne?.workout_tip || "Workout and lifestyle tips will appear here.",
    ]),
    swap: {
      beforeImage: "/assets/swap-before.png",
      afterImage: "/assets/swap-after.png",
      title: "Swap Suggestions",
      description:
        dayOne?.alternatives?.length
          ? `Try alternatives like ${dayOne.alternatives.slice(0, 3).join(", ")}.`
          : "Swap ingredients or meals based on preference, diet type, and calorie target.",
    },
  };
}

function loadNutritionPlan(selectedDayIndex = 0): NutritionPlanData {
  const storedPlan = getStoredGeneratedPlan();

  if (!storedPlan?.success) {
    return fallbackData;
  }

  return transformGeneratedPlan(storedPlan, selectedDayIndex);
}

export default function AINutritionPlan() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [data, setData] = useState<NutritionPlanData>(() => loadNutritionPlan(0));
  const [blockedResponse, setBlockedResponse] = useState<StoredGeneratedPlan | null>(() =>
    getStoredBlockedResponse(),
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [coachText, setCoachText] = useState("");
  const [goalDraft, setGoalDraft] = useState(data.plan.goal);

  const hydrationPercent = useMemo(() => {
    if (!data.hydration.target) return 0;

    return Math.min(
      Math.round((data.hydration.consumed / data.hydration.target) * 100),
      100,
    );
  }, [data.hydration]);

  useEffect(() => {
    const refreshFromStorage = () => {
      const freshBlocked = getStoredBlockedResponse();
      setBlockedResponse(freshBlocked);

      const storedPlan = getStoredGeneratedPlan();
      const totalDays = getGeneratedPlanDayCount(storedPlan);
      const safeDayIndex = clampDayIndex(selectedDayIndex, totalDays);
      const freshData = loadNutritionPlan(safeDayIndex);
      setSelectedDayIndex(safeDayIndex);
      setData(freshData);
      setGoalDraft(freshData.plan.goal);
    };

    window.addEventListener("storage", refreshFromStorage);
    window.addEventListener("ai-plan-updated", refreshFromStorage);

    return () => {
      window.removeEventListener("storage", refreshFromStorage);
      window.removeEventListener("ai-plan-updated", refreshFromStorage);
    };
  }, [selectedDayIndex]);

  useEffect(() => {
    setData(loadNutritionPlan(selectedDayIndex));
  }, [selectedDayIndex]);

  const handleRegenerate = () => {
    const freshData = loadNutritionPlan(selectedDayIndex);

    setData({
      ...freshData,
      aiNotes: uniqueTextList([
        "Plan refreshed from your latest generated assessment data.",
        ...freshData.aiNotes.slice(0, 1),
      ]),
    });
  };

  const handleSaveSettings = () => {
    setData((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        goal: goalDraft,
      },
    }));
    setSettingsOpen(false);
  };

  const handleLogWater = () => {
    setData((prev) => ({
      ...prev,
      hydration: {
        ...prev.hydration,
        consumed: Number(Math.min(prev.hydration.consumed + 0.25, 5).toFixed(2)),
      },
    }));
  };

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[92vw] overflow-visible rounded-[30px] border border-[#173326] bg-[#020604]/95 shadow-[0_0_80px_rgba(166,255,77,0.08)] 2xl:max-w-[1780px]">
        <BackgroundFX />

        <div className="relative z-10 p-4 sm:p-5 lg:p-6 xl:p-7">
          <div className="rounded-[28px] border border-white/10 bg-[#020805]/70 p-4 sm:p-5 lg:p-6 xl:p-7">
            <Header
              settingsOpen={settingsOpen}
              onPlanSettings={() => setSettingsOpen((value) => !value)}
              onRegenerate={handleRegenerate}
            />

            {blockedResponse?.blocked ? (
              <MedicalPlanBlockedNotice response={blockedResponse} />
            ) : null}

            {settingsOpen && (
              <div className="mb-5 rounded-[24px] border border-[#18D3D0]/20 bg-[#07110A]/80 p-5">
                <p className="text-[18px] font-black text-[#18D3D0]">
                  Plan Settings
                </p>

                <div className="mt-4 flex flex-wrap items-end gap-4">
                  <label>
                    <span className="mb-2 block text-[13px] font-bold text-white/75">
                      Goal
                    </span>
                    <select
                      value={goalDraft}
                      onChange={(event) => setGoalDraft(event.target.value)}
                      className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[14px] font-bold text-white outline-none"
                    >
                      <option>Weight Loss</option>
                      <option>Muscle Gain</option>
                      <option>Maintenance</option>
                      <option>Improve Health</option>
                    </select>
                  </label>

                  <button
                    onClick={handleSaveSettings}
                    className="rounded-xl bg-[#A6FF4D] px-5 py-3 text-[14px] font-black text-black"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            <TopSummary data={data} />

            <MealTimeline
              meals={data.meals}
              weekOpen={weekOpen}
              selectedDay={data.selectedDay}
              totalDays={data.totalDays}
              onSelectDay={(dayIndex) => setSelectedDayIndex(dayIndex)}
              onToggleWeek={() => setWeekOpen((value) => !value)}
            />

            <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-[0.9fr_0.75fr_0.75fr_1.25fr]">
              <MacroDistribution targets={data.targets} />

              <HydrationGoal
                consumed={data.hydration.consumed}
                target={data.hydration.target}
                percent={hydrationPercent}
                onLogWater={handleLogWater}
              />

              <AISmartNotes
                notes={data.aiNotes}
                coachText={coachText}
                onCoachText={setCoachText}
              />

              <SwapSuggestions
                swap={data.swap}
                swapOpen={swapOpen}
                onToggleSwap={() => setSwapOpen((value) => !value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function MedicalPlanBlockedNotice({ response }: { response: StoredGeneratedPlan }) {
  const message =
    response.message ||
    response.medical_risk?.block_reason ||
    "Medical guidance is required before using AI nutrition or workout recommendations.";

  return (
    <div className="mb-5 rounded-[24px] border border-[#FF6C7D]/35 bg-[#2A070D]/70 p-5 shadow-[0_0_40px_rgba(255,108,125,0.12)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#FF6C7D]/35 bg-[#FF6C7D]/10 text-[#FF6C7D]">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-[15px] font-black uppercase tracking-[0.18em] text-[#FF6C7D]">
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


function Header({
  settingsOpen,
  onPlanSettings,
  onRegenerate,
}: {
  settingsOpen: boolean;
  onPlanSettings: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-[28px] font-black uppercase leading-none tracking-[0.08em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
          AI Nutrition Plan
        </h2>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
          Your personalized plan from the latest generated profile data.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onPlanSettings}
          className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3 text-[13px] font-black text-white"
        >
          <Settings size={17} />
          {settingsOpen ? "Hide Settings" : "Plan Settings"}
        </button>

        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-2.5 rounded-2xl bg-[#A6FF4D] px-4 py-3 text-[13px] font-black text-black shadow-[0_0_30px_rgba(166,255,77,.28)]"
        >
          <RotateCcw size={17} />
          Refresh Plan
        </button>
      </div>
    </div>
  );
}

function TopSummary({ data }: { data: NutritionPlanData }) {
  return (
    <div className="grid overflow-hidden rounded-[26px] border border-white/10 bg-[#07110A]/70 lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1.05fr_0.95fr_0.95fr_0.55fr]">
      <div className="flex items-center gap-5 border-b border-white/10 p-5 lg:border-b-0 lg:border-r xl:p-6">
        <PlanRing value={data.plan.match} />

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="text-[20px] font-black xl:text-[24px]">
              Plan for Today
            </h3>
            <span className="rounded-xl border border-[#A6FF4D]/30 bg-[#A6FF4D]/5 px-3 py-1.5 text-[12px] font-bold text-[#A6FF4D]">
              {data.plan.goal}
            </span>
          </div>

          <p className="max-w-[420px] text-[14px] leading-6 text-white/70 xl:text-[15px]">
            {data.plan.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-black text-[#18D3D0]">
              AI Confidence: {data.plan.aiConfidence}%
            </span>
            <div className="h-2 w-[180px] rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#18D3D0] shadow-[0_0_16px_rgba(24,211,208,.6)]"
                style={{ width: `${data.plan.aiConfidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 p-5 lg:border-b-0 xl:border-r xl:p-6">
        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-[#A6FF4D]">
          Today&apos;s Targets
        </p>

        <div className="mt-5 grid grid-cols-4 gap-3">
          <TargetMetric
            icon={<Flame size={18} />}
            value={data.targets.calories.toLocaleString()}
            label="kcal"
            sub="Calories"
            color="#FFB347"
          />
          <TargetMetric
            icon={<Activity size={18} />}
            value={`${data.targets.protein}g`}
            label="Protein"
            sub={`${data.targets.proteinPercent}%`}
            color="#8DB6FF"
          />
          <TargetMetric
            icon={<Apple size={18} />}
            value={`${data.targets.carbs}g`}
            label="Carbs"
            sub={`${data.targets.carbsPercent}%`}
            color="#18D3D0"
          />
          <TargetMetric
            icon={<Droplets size={18} />}
            value={`${data.targets.fats}g`}
            label="Fats"
            sub={`${data.targets.fatsPercent}%`}
            color="#A6FF4D"
          />
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[12px] text-white/80">
          {data.plan.calorieMode}
          <Info size={14} className="text-white/45" />
        </div>
      </div>

      <div className="border-b border-white/10 p-5 xl:border-b-0 xl:border-r xl:p-6">
        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-[#A6FF4D]">
          Why This Plan?
        </p>

        <div className="mt-5 space-y-3">
          {data.whyThisPlan.map((reason, index) => (
            <p
              key={`${index}-${reason.slice(0, 24)}`}
              className="flex items-center gap-2.5 text-[13px] font-medium leading-5 text-white/78"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#A6FF4D]/40 text-[12px] text-[#A6FF4D]">
                ✓
              </span>
              {reason}
            </p>
          ))}
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-visible xl:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(24,211,208,.18),transparent_66%)]" />

        <img
          src="/assets/iconmesh.png"
          alt="AI nutrition intelligence mesh"
          className="absolute left-1/2 top-1/2 z-10 h-[260px] w-[260px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-100 mix-blend-screen drop-shadow-[0_0_70px_rgba(24,211,208,.75)]"
        />
      </div>
    </div>
  );
}

function PlanRing({ value }: { value: number }) {
  const angle = Math.max(0, Math.min(value, 100)) * 3.6;

  return (
    <div
      className="grid h-[116px] w-[116px] shrink-0 place-items-center rounded-full shadow-[0_0_30px_rgba(166,255,77,.35)]"
      style={{
        background: `conic-gradient(#A6FF4D ${
          angle * 0.72
        }deg, #18D3D0 ${angle}deg, rgba(255,255,255,.13) 0deg)`,
      }}
    >
      <div className="grid h-[88px] w-[88px] place-items-center rounded-full bg-[#07110A]">
        <div className="text-center">
          <p className="text-[28px] font-black leading-none">{value}%</p>
          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.09em] text-white/85">
            Plan Match
          </p>
        </div>
      </div>
    </div>
  );
}

function TargetMetric({
  icon,
  value,
  label,
  sub,
  color,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-2 flex items-center justify-center" style={{ color }}>
        {icon}
      </div>
      <p className="text-[14px] font-black text-white xl:text-[15px]">
        {value}
      </p>
      <p className="text-[10px] text-white/65">{label}</p>
      <p className="mt-1.5 text-[10px] font-black" style={{ color }}>
        {sub}
      </p>
    </div>
  );
}

function MealTimeline({
  meals,
  weekOpen,
  selectedDay,
  totalDays,
  onSelectDay,
  onToggleWeek,
}: {
  meals: Meal[];
  weekOpen: boolean;
  selectedDay: number;
  totalDays: number;
  onSelectDay: (dayIndex: number) => void;
  onToggleWeek: () => void;
}) {
  return (
    <div className="mt-5 rounded-[26px] border border-white/10 bg-[#07110A]/70 p-5 xl:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[16px] font-black uppercase tracking-[0.16em] text-[#A6FF4D] xl:text-[18px]">
            Day {selectedDay || 1} Meal Plan
          </p>

          <button
            onClick={onToggleWeek}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            <CalendarDays size={15} />
            {weekOpen ? "Hide Day Selector" : `View ${totalDays || 1} Day Plan`}
          </button>
        </div>

        <p className="flex items-center gap-2 text-[12px] font-medium text-white/60">
          <Info size={14} />
          Times can be adjusted
        </p>
      </div>

      {weekOpen && totalDays > 1 && (
        <div className="mb-5 rounded-2xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/5 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
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
                      ? "border-[#A6FF4D] bg-[#A6FF4D] text-black shadow-[0_0_22px_rgba(166,255,77,0.35)]"
                      : "border-white/10 bg-white/[0.03] text-white/75 hover:border-[#A6FF4D]/45 hover:text-[#A6FF4D]"
                  }`}
                >
                  Day {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative mb-5 hidden h-6 sm:block">
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/20" />
        <div className="grid grid-cols-4">
          {meals.map((meal) => (
            <div key={meal.id} className="flex justify-center">
              <span className="relative z-10 h-5 w-5 rounded-full border-[3px] border-[#07110A] bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.9)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      <div className="mx-auto mt-5 flex w-fit flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[12px] font-medium text-white/70">
        <Activity size={14} />
        <span className="font-black text-white">Adaptive Routine</span>
        <span>• Plan adjusted for goal, activity, diet, sleep, and hydration</span>
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#020604]/55 p-4 shadow-[inset_0_0_28px_rgba(255,255,255,.025)] xl:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className="rounded-lg border px-3 py-1.5 text-[11px] font-black"
          style={{ borderColor: `${meal.accent}80`, color: meal.accent }}
        >
          {meal.label}
        </span>

        <span className="flex items-center gap-1.5 text-[12px] text-white/78">
          {meal.time}
          {meal.icon === "sun" ? (
            <Sparkles size={13} className="text-[#FFB347]" />
          ) : (
            <Moon size={13} className="text-[#A875FF]" />
          )}
        </span>
      </div>

      <h3 className="text-[20px] font-black tracking-[-0.04em] text-white">
        {meal.name}
      </h3>

      <div className="mt-4 flex gap-4">
        <img
          src={meal.image}
          alt={meal.name}
          className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-contain shadow-[0_0_20px_rgba(255,255,255,.08)]"
        />

        <div className="space-y-2">
          {meal.foods.map((food, index) => (
            <p
              key={`${meal.id}-${index}-${food.slice(0, 24)}`}
              className="flex items-start gap-2 text-[12px] font-medium leading-5 text-white/76"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A6FF4D]" />
              {food}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-black">
        <span className="text-[#A6FF4D]">{meal.calories} kcal</span>
        <span className="text-white/35">•</span>
        <span className="text-[#8DB6FF]">{meal.protein}g P</span>
        <span className="text-white/35">•</span>
        <span className="text-[#A875FF]">{meal.carbs}g C</span>
        <span className="text-white/35">•</span>
        <span className="text-[#FFB347]">{meal.fats}g F</span>
      </div>
    </div>
  );
}

function MacroDistribution({
  targets,
}: {
  targets: NutritionPlanData["targets"];
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        Macro Distribution
      </p>

      <div className="mt-5 flex items-center gap-5">
        <div
          className="h-24 w-24 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(#A6FF4D 0 ${targets.proteinPercent}%, #A875FF ${targets.proteinPercent}% ${
              targets.proteinPercent + targets.carbsPercent
            }%, #FFB347 ${
              targets.proteinPercent + targets.carbsPercent
            }% 100%)`,
          }}
        >
          <div className="m-auto mt-5 h-14 w-14 rounded-full bg-[#07110A]" />
        </div>

        <div className="flex-1 space-y-3 text-[13px]">
          <MacroRow
            color="#A6FF4D"
            label="Protein"
            value={`${targets.protein}g (${targets.proteinPercent}%)`}
          />
          <MacroRow
            color="#A875FF"
            label="Carbs"
            value={`${targets.carbs}g (${targets.carbsPercent}%)`}
          />
          <MacroRow
            color="#FFB347"
            label="Fats"
            value={`${targets.fats}g (${targets.fatsPercent}%)`}
          />
        </div>
      </div>
    </div>
  );
}

function MacroRow({
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
      <span className="flex items-center gap-2 text-white/70">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}

function HydrationGoal({
  consumed,
  target,
  percent,
  onLogWater,
}: {
  consumed: number;
  target: number;
  percent: number;
  onLogWater: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="flex items-center gap-2 text-[15px] font-black uppercase tracking-[0.16em] text-[#18D3D0]">
        <Droplets size={18} />
        Hydration Goal
      </p>

      <p className="mt-5 text-[28px] font-black">
        {consumed} L <span className="font-medium text-white/50">/ {target} L</span>
      </p>

      <div className="mt-4 h-2.5 rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.7)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-[13px] text-white/65">
        {percent}% of your daily goal
      </p>

      <button
        onClick={onLogWater}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] font-bold text-white"
      >
        <Droplets size={15} className="text-[#18D3D0]" />
        Log Water
      </button>
    </div>
  );
}

function AISmartNotes({
  notes,
  coachText,
  onCoachText,
}: {
  notes: string[];
  coachText: string;
  onCoachText: (value: string) => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="flex items-center gap-2 text-[15px] font-black uppercase tracking-[0.16em] text-[#A875FF]">
        <Sparkles size={18} />
        AI Smart Notes
      </p>

      <div className="mt-5 space-y-3 text-[13px] leading-6 text-white/72">
        {notes.map((note, index) => (
          <p key={`${index}-${note.slice(0, 24)}`}>{note}</p>
        ))}
      </div>

      <input
        value={coachText}
        onChange={(event) => onCoachText(event.target.value)}
        placeholder="Ask AI Coach..."
        className="mt-5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-[13px] font-bold text-white outline-none placeholder:text-white/40 focus:border-[#A875FF]/60"
      />
    </div>
  );
}

function SwapSuggestions({
  swap,
  swapOpen,
  onToggleSwap,
}: {
  swap: NutritionPlanData["swap"];
  swapOpen: boolean;
  onToggleSwap: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#A6FF4D]/25 bg-[#07110A]/70 p-5">
      <div className="pointer-events-none absolute right-6 top-6 h-28 w-44 rotate-[-18deg] rounded-full border border-[#A6FF4D]/20" />
      <div className="pointer-events-none absolute right-10 top-10 h-28 w-44 rotate-[24deg] rounded-full border border-[#18D3D0]/20" />

      <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        {swap.title}
      </p>

      <p className="mt-3 text-[13px] leading-6 text-white/65">
        {swap.description}
      </p>

      {swapOpen && (
        <p className="mt-3 rounded-xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/5 px-4 py-3 text-[13px] font-semibold text-[#A6FF4D]">
          Smart swap active: lower calories, better protein balance.
        </p>
      )}

      <div className="relative z-10 mt-5 flex items-center justify-between gap-4">
        <button
          onClick={onToggleSwap}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] font-bold text-white"
        >
          <RotateCcw size={15} />
          {swapOpen ? "Hide Swaps" : "View Swaps"}
        </button>

        <div className="flex items-center gap-3">
          <img
            src={swap.beforeImage}
            alt="Swap before"
            className="h-16 w-16 rounded-full object-contain"
          />

          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#A6FF4D]/20 bg-black/20 text-[#A6FF4D]">
            <ChevronRight size={20} />
          </span>

          <img
            src={swap.afterImage}
            alt="Swap after"
            className="h-16 w-16 rounded-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_25%_45%,rgba(24,211,208,0.08),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}