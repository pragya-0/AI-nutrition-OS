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
      100
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
    <section className="relative overflow-hidden bg-[#030805] px-0 py-3 text-[#F5F8F2]">
      <div className="relative mx-auto w-[98vw] overflow-hidden rounded-[34px] border border-[#173326] bg-[#020604]/95 shadow-[0_0_80px_rgba(166,255,77,0.08)]">
        <BackgroundFX />

        <div className="relative z-10 px-6 py-10 xl:px-8 2xl:px-10">
          <div className="rounded-[34px] border border-white/10 bg-[#020805]/70 p-10">
            <Header
              settingsOpen={settingsOpen}
              onPlanSettings={() => setSettingsOpen((value) => !value)}
              onRegenerate={handleRegenerate}
            />

            {settingsOpen && (
              <div className="mb-8 rounded-[30px] border border-[#18D3D0]/20 bg-[#07110A]/80 p-8">
                <p className="text-[32px] font-black text-[#18D3D0]">
                  Plan Settings
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-6">
                  <label>
                    <span className="mb-3 block text-[26px] font-bold text-white/75">
                      Goal
                    </span>
                    <select
                      value={goalDraft}
                      onChange={(event) => setGoalDraft(event.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/30 px-6 py-5 text-[28px] font-bold text-white outline-none"
                    >
                      <option>Fat Loss</option>
                      <option>Muscle Gain</option>
                      <option>Maintenance</option>
                    </select>
                  </label>

                  <button
                    onClick={handleSaveSettings}
                    className="rounded-2xl bg-[#A6FF4D] px-9 py-5 text-[28px] font-black text-black"
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

            <div className="mt-8 grid gap-7 xl:grid-cols-[0.9fr_0.7fr_0.7fr_1.35fr]">
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
    <div className="mb-9 flex items-center justify-between">
      <div className="flex items-center gap-8">
     
        <div>
          <h2 className="text-[64px] font-black uppercase leading-none tracking-[0.12em]">
            AI Nutrition Plan
          </h2>
          <p className="mt-4 text-[34px] font-semibold text-[#A3B3A3]">
            Your personalized plan for today, powered by AI.
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={onPlanSettings}
          className="inline-flex items-center gap-5 rounded-2xl border border-white/15 bg-white/[0.03] px-10 py-7 text-[42px] font-black text-white"
        >
          <Settings size={42} />
          {settingsOpen ? "Hide Settings" : "Plan Settings"}
        </button>

        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-5 rounded-2xl bg-[#A6FF4D] px-10 py-7 text-[42px] font-black text-black shadow-[0_0_34px_rgba(166,255,77,.35)]"
        >
          <RotateCcw size={42} />
          Regenerate Plan
        </button>
      </div>
    </div>
  );
}

function TopSummary({ data }: { data: NutritionPlanData }) {
  return (
    <div className="grid min-h-[360px] overflow-hidden rounded-[34px] border border-white/10 bg-[#07110A]/70 xl:grid-cols-[1.05fr_1fr_1.05fr_1fr]">
      <div className="flex items-center gap-12 border-r border-white/10 p-10">
        <PlanRing value={data.plan.match} />

        <div>
          <div className="mb-5 flex items-center gap-5">
            <h3 className="text-[38px] font-black">Plan for Today</h3>
            <span className="rounded-xl border border-[#A6FF4D]/30 bg-[#A6FF4D]/5 px-5 py-3 text-[24px] font-bold text-[#A6FF4D]">
              {data.plan.goal}
            </span>
          </div>

          <p className="max-w-[500px] text-[30px] leading-[1.45] text-white/75">
            {data.plan.description}
          </p>

          <div className="mt-8 flex items-center gap-5">
            <span className="text-[28px] font-black text-[#18D3D0]">
              AI Confidence: {data.plan.aiConfidence}%
            </span>
            <div className="h-3 w-[330px] rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.6)]"
                style={{ width: `${data.plan.aiConfidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-r border-white/10 p-10">
        <p className="text-[28px] font-black uppercase tracking-[0.3em] text-[#A6FF4D]">
          Today&apos;s Targets
        </p>

        <div className="mt-8 grid grid-cols-4 gap-6">
          <TargetMetric
            icon={<Flame size={34} />}
            value={data.targets.calories.toLocaleString()}
            label="kcal"
            sub="Calories"
            color="#FFB347"
          />
          <TargetMetric
            icon={<Activity size={34} />}
            value={`${data.targets.protein}g`}
            label="Protein"
            sub={`${data.targets.proteinPercent}%`}
            color="#8DB6FF"
          />
          <TargetMetric
            icon={<Apple size={34} />}
            value={`${data.targets.carbs}g`}
            label="Carbs"
            sub={`${data.targets.carbsPercent}%`}
            color="#18D3D0"
          />
          <TargetMetric
            icon={<Droplets size={34} />}
            value={`${data.targets.fats}g`}
            label="Fats"
            sub={`${data.targets.fatsPercent}%`}
            color="#A6FF4D"
          />
        </div>

        <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-5 text-[26px] text-white/85">
          {data.plan.calorieMode}
          <Info size={26} className="text-white/45" />
        </div>
      </div>

      <div className="border-r border-white/10 p-10">
        <p className="text-[28px] font-black uppercase tracking-[0.3em] text-[#A6FF4D]">
          Why This Plan?
        </p>

        <div className="mt-8 space-y-6">
          {data.whyThisPlan.map((reason) => (
            <p
              key={reason}
              className="flex items-center gap-4 text-[28px] font-medium text-white/80"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full border border-[#A6FF4D]/40 text-[18px] text-[#A6FF4D]">
                ✓
              </span>
              {reason}
            </p>
          ))}
        </div>
      </div>

      <div className="relative hidden min-h-[360px] items-center justify-center overflow-visible xl:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(24,211,208,.18),transparent_66%)]" />

        <img
          src="/assets/iconmesh.png"
          alt="AI nutrition intelligence mesh"
          className="absolute left-1/2 top-1/2 z-10 h-[620px] w-[620px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-100 mix-blend-screen drop-shadow-[0_0_90px_rgba(24,211,208,.8)]"
        />
      </div>
    </div>
  );
}

function PlanRing({ value }: { value: number }) {
  const angle = Math.max(0, Math.min(value, 100)) * 3.6;

  return (
    <div
      className="grid h-[250px] w-[250px] shrink-0 place-items-center rounded-full shadow-[0_0_40px_rgba(166,255,77,.45)]"
      style={{
        background: `conic-gradient(#A6FF4D ${
          angle * 0.72
        }deg, #18D3D0 ${angle}deg, rgba(255,255,255,.13) 0deg)`,
      }}
    >
      <div className="grid h-[190px] w-[190px] place-items-center rounded-full bg-[#07110A]">
        <div className="text-center">
          <p className="text-[68px] font-black leading-none">{value}%</p>
          <p className="mt-2 text-[24px] font-semibold text-white/85">
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
      <div className="mb-3 flex items-center justify-center" style={{ color }}>
        {icon}
      </div>
      <p className="text-[30px] font-black text-white">{value}</p>
      <p className="text-[22px] text-white/70">{label}</p>
      <p className="mt-4 text-[22px] font-black" style={{ color }}>
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
    <div className="mt-8 rounded-[34px] border border-white/10 bg-[#07110A]/70 p-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-7">
          <p className="text-[32px] font-black uppercase tracking-[0.22em] text-[#A6FF4D]">
            Today&apos;s Meal Plan
          </p>

          <button
            onClick={onToggleWeek}
            className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-[24px] font-bold text-white"
          >
            <CalendarDays size={28} />
            {weekOpen ? "Hide Full Week" : "View Full Week"}
          </button>
        </div>

        <p className="flex items-center gap-3 text-[24px] font-medium text-white/60">
          <Info size={24} />
          Times can be adjusted
        </p>
      </div>

      {weekOpen && (
        <div className="mb-8 rounded-2xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/5 p-6 text-[26px] font-semibold text-[#A6FF4D]">
          Weekly plan preview activated. Backend week-plan integration can plug
          into this state.
        </div>
      )}

      <div className="relative mb-8 h-10">
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-white/20" />
        <div className="grid grid-cols-5">
          {meals.map((meal) => (
            <div key={meal.id} className="flex justify-center">
              <span className="relative z-10 h-8 w-8 rounded-full border-4 border-[#07110A] bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.9)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-7 xl:grid-cols-5">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      <div className="mx-auto mt-8 flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-[24px] font-medium text-white/75">
        <Activity size={24} />
        <span className="font-black text-white">Evening Workout</span>
        <span>• Plan adjusted for your activity window</span>
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#020604]/55 p-7 shadow-[inset_0_0_28px_rgba(255,255,255,.025)]">
      <div className="mb-5 flex items-center justify-between">
        <span
          className="rounded-lg border px-4 py-2 text-[20px] font-black"
          style={{ borderColor: `${meal.accent}80`, color: meal.accent }}
        >
          {meal.label}
        </span>

        <span className="flex items-center gap-2 text-[24px] text-white/80">
          {meal.time}
          {meal.icon === "sun" ? (
            <Sparkles size={24} className="text-[#FFB347]" />
          ) : (
            <Moon size={24} className="text-[#A875FF]" />
          )}
        </span>
      </div>

      <h3 className="text-[34px] font-black tracking-[-0.04em] text-white">
        {meal.name}
      </h3>

      <div className="mt-6 flex gap-6">
        <img
          src={meal.image}
          alt={meal.name}
          className="h-28 w-28 shrink-0 rounded-full border border-white/10 object-contain shadow-[0_0_24px_rgba(255,255,255,.08)]"
        />

        <div className="space-y-4">
          {meal.foods.map((food) => (
            <p
              key={food}
              className="flex items-center gap-3 text-[23px] font-medium text-white/80"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#A6FF4D]" />
              {food}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-[22px] font-black">
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
    <div className="rounded-[30px] border border-white/10 bg-[#07110A]/70 p-9">
      <p className="text-[30px] font-black uppercase tracking-[0.22em] text-[#A6FF4D]">
        Macro Distribution
      </p>

      <div className="mt-8 flex items-center gap-9">
        <div
          className="h-40 w-40 shrink-0 rounded-full"
          style={{
            background:
              "conic-gradient(#A6FF4D 0 30%, #A875FF 30% 65%, #FFB347 65% 100%)",
          }}
        >
          <div className="m-auto mt-7 h-28 w-28 rounded-full bg-[#07110A]" />
        </div>

        <div className="space-y-5 text-[26px]">
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
    <div className="flex items-center justify-between gap-8">
      <span className="flex items-center gap-3 text-white/75">
        <span className="h-4 w-4 rounded-full" style={{ background: color }} />
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
    <div className="rounded-[30px] border border-white/10 bg-[#07110A]/70 p-9">
      <p className="flex items-center gap-4 text-[30px] font-black uppercase tracking-[0.22em] text-[#18D3D0]">
        <Droplets size={38} />
        Hydration Goal
      </p>

      <p className="mt-10 text-[46px] font-black">
        {consumed} L{" "}
        <span className="font-medium text-white/50">/ {target} L</span>
      </p>

      <div className="mt-7 h-4 rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.7)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-5 text-[24px] text-white/65">
        {percent}% of your daily goal
      </p>

      <button
        onClick={onLogWater}
        className="mt-7 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 text-[24px] font-bold text-white"
      >
        <Droplets size={28} className="text-[#18D3D0]" />
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
    <div className="rounded-[30px] border border-white/10 bg-[#07110A]/70 p-9">
      <p className="flex items-center gap-4 text-[30px] font-black uppercase tracking-[0.22em] text-[#A875FF]">
        <Sparkles size={38} />
        AI Smart Notes
      </p>

      <div className="mt-8 space-y-5 text-[26px] leading-[1.45] text-white/75">
        {notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>

      <input
        value={coachText}
        onChange={(event) => onCoachText(event.target.value)}
        placeholder="Ask AI Coach..."
        className="mt-8 w-full rounded-xl border border-white/15 bg-white/[0.03] px-6 py-5 text-[24px] font-bold text-white outline-none placeholder:text-white/40 focus:border-[#A875FF]/60"
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
    <div className="relative overflow-hidden rounded-[30px] border border-[#A6FF4D]/25 bg-[#07110A]/70 p-9">
      <div className="pointer-events-none absolute right-10 top-10 h-52 w-80 rotate-[-18deg] rounded-full border border-[#A6FF4D]/20" />
      <div className="pointer-events-none absolute right-20 top-20 h-52 w-80 rotate-[24deg] rounded-full border border-[#18D3D0]/20" />

      <p className="text-[30px] font-black uppercase tracking-[0.22em] text-[#A6FF4D]">
        {swap.title}
      </p>

      <p className="mt-5 text-[24px] text-white/65">{swap.description}</p>

      {swapOpen && (
        <p className="mt-5 rounded-xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/5 px-5 py-4 text-[24px] font-semibold text-[#A6FF4D]">
          Smart swap active: lower calories, better protein balance.
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-8">
        <button
          onClick={onToggleSwap}
          className="inline-flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-8 py-5 text-[26px] font-bold text-white"
        >
          <RotateCcw size={30} />
          {swapOpen ? "Hide Swaps" : "View Swaps"}
        </button>

        <div className="flex items-center gap-8">
          <img
            src={swap.beforeImage}
            alt="Swap before"
            className="h-36 w-36 rounded-full object-contain"
          />

          <span className="grid h-16 w-16 place-items-center rounded-full border border-[#A6FF4D]/20 bg-black/20 text-[#A6FF4D]">
            <ChevronRight size={38} />
          </span>

          <img
            src={swap.afterImage}
            alt="Swap after"
            className="h-36 w-36 rounded-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_45%,rgba(24,211,208,0.08),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}