import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Apple,
  CalendarDays,
  ChevronRight,
  Droplets,
  Flame,
  Info,
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

const initialData: NutritionPlanData = {
  plan: {
    match: 92,
    goal: "Fat Loss",
    aiConfidence: 94,
    description:
      "High protein, moderate carbs and healthy fats to keep you full, energized and in calorie deficit.",
    calorieMode: "Calorie Deficit: ~380 kcal",
  },
  targets: {
    calories: 1420,
    protein: 110,
    carbs: 130,
    fats: 55,
    proteinPercent: 30,
    carbsPercent: 35,
    fatsPercent: 35,
  },
  whyThisPlan: [
    "Supports fat loss while preserving muscle",
    "High protein to keep you full longer",
    "Balanced macros for sustained energy",
    "AI optimized based on your activity & goals",
  ],
  meals: [
    {
      id: 1,
      label: "MEAL 1",
      name: "Breakfast",
      time: "7:30 AM",
      image: "/assets/breakfast.png",
      icon: "sun",
      foods: ["Oats with berries", "Greek yogurt (150g)", "Almonds (10g)"],
      calories: 350,
      protein: 28,
      carbs: 38,
      fats: 9,
      accent: "#FFB347",
    },
    {
      id: 2,
      label: "MEAL 2",
      name: "Mid-Morning Snack",
      time: "10:30 AM",
      image: "/assets/smoothie.png",
      icon: "sun",
      foods: ["Protein smoothie", "Banana (1/2)", "Chia seeds (1 tsp)"],
      calories: 210,
      protein: 20,
      carbs: 22,
      fats: 6,
      accent: "#FFB347",
    },
    {
      id: 3,
      label: "MEAL 3",
      name: "Lunch",
      time: "1:30 PM",
      image: "/assets/lunch.png",
      icon: "sun",
      foods: ["Quinoa (1 cup)", "Paneer (100g)", "Mixed Veg Salad"],
      calories: 420,
      protein: 32,
      carbs: 40,
      fats: 12,
      accent: "#FFB347",
    },
    {
      id: 4,
      label: "MEAL 4",
      name: "Pre-Workout Snack",
      time: "5:00 PM",
      image: "/assets/snack.png",
      icon: "sun",
      foods: ["Banana (1)", "Peanut butter (1 tbsp)", "Black coffee"],
      calories: 180,
      protein: 6,
      carbs: 24,
      fats: 7,
      accent: "#FFB347",
    },
    {
      id: 5,
      label: "MEAL 5",
      name: "Dinner",
      time: "8:00 PM",
      image: "/assets/dinner.png",
      icon: "moon",
      foods: ["Moong dal (1 cup)", "Brown rice (1/2 cup)", "Stir-fried veggies"],
      calories: 260,
      protein: 24,
      carbs: 26,
      fats: 9,
      accent: "#A875FF",
    },
  ],
  hydration: {
    consumed: 2.8,
    target: 3.0,
  },
  aiNotes: [
    "Try to consume more protein in your dinner for better overnight recovery.",
    "You’re doing great! 💚",
  ],
  swap: {
    beforeImage: "/assets/swap-before.png",
    afterImage: "/assets/swap-after.png",
    title: "Swap Suggestions",
    description: "Swap ingredients or meals based on your preference.",
  },
};

export default function AINutritionPlan() {
  const [data, setData] = useState(initialData);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [coachText, setCoachText] = useState("");
  const [goalDraft, setGoalDraft] = useState(data.plan.goal);

  const hydrationPercent = useMemo(() => {
    return Math.min(
      Math.round((data.hydration.consumed / data.hydration.target) * 100),
      100,
    );
  }, [data.hydration]);

  const handleRegenerate = () => {
    setData((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        match: Math.min(prev.plan.match + 1, 99),
        aiConfidence: Math.min(prev.plan.aiConfidence + 1, 99),
      },
      aiNotes: [
        "Plan regenerated using your latest profile and activity data.",
        "AI adjusted protein timing for better recovery. 💚",
      ],
    }));
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
                      <option>Fat Loss</option>
                      <option>Muscle Gain</option>
                      <option>Maintenance</option>
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
          Your personalized plan for today, powered by AI.
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
          Regenerate Plan
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
          {data.whyThisPlan.map((reason) => (
            <p
              key={reason}
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
  onToggleWeek,
}: {
  meals: Meal[];
  weekOpen: boolean;
  onToggleWeek: () => void;
}) {
  return (
    <div className="mt-5 rounded-[26px] border border-white/10 bg-[#07110A]/70 p-5 xl:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[16px] font-black uppercase tracking-[0.16em] text-[#A6FF4D] xl:text-[18px]">
            Today&apos;s Meal Plan
          </p>

          <button
            onClick={onToggleWeek}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[12px] font-bold text-white"
          >
            <CalendarDays size={15} />
            {weekOpen ? "Hide Full Week" : "View Full Week"}
          </button>
        </div>

        <p className="flex items-center gap-2 text-[12px] font-medium text-white/60">
          <Info size={14} />
          Times can be adjusted
        </p>
      </div>

      {weekOpen && (
        <div className="mb-5 rounded-2xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/5 p-4 text-[13px] font-semibold text-[#A6FF4D]">
          Weekly plan preview activated. Backend week-plan integration can plug
          into this state.
        </div>
      )}

      <div className="relative mb-5 hidden h-6 sm:block">
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/20" />
        <div className="grid grid-cols-5">
          {meals.map((meal) => (
            <div key={meal.id} className="flex justify-center">
              <span className="relative z-10 h-5 w-5 rounded-full border-[3px] border-[#07110A] bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.9)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      <div className="mx-auto mt-5 flex w-fit flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[12px] font-medium text-white/70">
        <Activity size={14} />
        <span className="font-black text-white">Evening Workout</span>
        <span>• Plan adjusted for your activity window</span>
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
          {meal.foods.map((food) => (
            <p
              key={food}
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
            background:
              "conic-gradient(#A6FF4D 0 30%, #A875FF 30% 65%, #FFB347 65% 100%)",
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
        {notes.map((note) => (
          <p key={note}>{note}</p>
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