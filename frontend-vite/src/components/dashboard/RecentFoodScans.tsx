import { useEffect, useMemo, useState, type ElementType } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Plus,
  Scale,
  ScanLine,
  Sparkles,
  Utensils,
} from "lucide-react";

const FOOD_HOLOGRAM = "/assets/food-insight-hologram.png";

type Macro = {
  label: string;
  value: number;
  color: string;
};

type ScanMeal = {
  id: string;
  time: string;
  type: string;
  name: string;
  ingredients: string;
  image: string;
  calories: number;
  score: number;
  status: "Excellent" | "Good";
  macros: Macro[];
};

type TopFood = {
  id: string;
  name: string;
  image: string;
  score: number;
  label: string;
};

type QuickAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: ElementType;
  href?: string;
};

type StoredScan = {
  id?: string;
  food_name?: string;
  name?: string;
  meal_type?: string;
  type?: string;
  image_url?: string;
  image?: string;
  created_at?: string;
  time?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  score?: number;
  nutrition_score?: number;
  ingredients?: string[] | string;
  items?: string[] | string;
};

type StoredPlan = {
  success?: boolean;
  user_profile?: {
    goal?: string;
  };
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  meal_plan?: {
    days?: Array<{
      breakfast?: string;
      lunch?: string;
      snack?: string;
      dinner?: string;
      meals?: {
        breakfast?: string;
        lunch?: string;
        snack?: string;
        dinner?: string;
      };
    }>;
  };
};

const quickActions: QuickAction[] = [
  {
    id: "scan",
    title: "Scan Food",
    subtitle: "Instant AI analysis",
    icon: ScanLine,
    href: "/scanner",
  },
  {
    id: "manual",
    title: "Add Manually",
    subtitle: "Log your meal",
    icon: Plus,
  },
  {
    id: "compare",
    title: "Compare Meals",
    subtitle: "See better options",
    icon: Scale,
  },
  {
    id: "suggest",
    title: "Meal Suggestions",
    subtitle: "AI recommended",
    icon: Utensils,
  },
];

function getStoredJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function formatTime(value?: string) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeIngredients(value?: string[] | string) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "AI scanned meal details";
}

function normalizeScore(value?: number) {
  if (!value || !Number.isFinite(value)) return 88;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

function getScanStatus(score: number): "Excellent" | "Good" {
  return score >= 90 ? "Excellent" : "Good";
}

function getMacroValue(value?: number) {
  return Number.isFinite(value || 0) ? Math.round(value || 0) : 0;
}

function mapScan(scan: StoredScan, index: number): ScanMeal {
  const score = normalizeScore(scan.nutrition_score ?? scan.score);

  return {
    id: scan.id || `scan-${index}`,
    time: formatTime(scan.created_at || scan.time),
    type: scan.meal_type || scan.type || "Scanned Meal",
    name: scan.food_name || scan.name || "AI Food Scan",
    ingredients: normalizeIngredients(scan.ingredients || scan.items),
    image: scan.image_url || scan.image || "/assets/healthy-salad-bowl-glow.png",
    calories: Math.round(scan.calories || 0),
    score,
    status: getScanStatus(score),
    macros: [
      { label: "Protein", value: getMacroValue(scan.protein), color: "#A6FF4D" },
      { label: "Carbs", value: getMacroValue(scan.carbs), color: "#18D3D0" },
      { label: "Fats", value: getMacroValue(scan.fats), color: "#FFB347" },
    ],
  };
}

function getScanHistory(): ScanMeal[] {
  const keys = [
    "ai_nutrition_scan_history",
    "ai_nutrition_recent_scans",
    "scanner_history",
    "recent_food_scans",
  ];

  for (const key of keys) {
    const value = getStoredJson<StoredScan[] | { scans?: StoredScan[]; data?: StoredScan[] }>(key);

    if (Array.isArray(value)) {
      return value.map(mapScan);
    }

    if (value?.scans && Array.isArray(value.scans)) {
      return value.scans.map(mapScan);
    }

    if (value?.data && Array.isArray(value.data)) {
      return value.data.map(mapScan);
    }
  }

  return [];
}

function getStoredGeneratedPlan(): StoredPlan | null {
  return getStoredJson<StoredPlan>("ai_nutrition_generated_plan");
}

function getPlanBasedMeals(): ScanMeal[] {
  const plan = getStoredGeneratedPlan();
  const dayOne = plan?.meal_plan?.days?.[0];
  const meals = dayOne?.meals || {};
  const targets = plan?.targets || {};
  const calories = targets.calories || 0;
  const protein = targets.protein || 0;
  const carbs = targets.carbs || 0;
  const fats = targets.fats || 0;

  const source = [
    {
      id: "plan-breakfast",
      time: "8:00 AM",
      type: "Breakfast",
      name: meals.breakfast || dayOne?.breakfast,
      image: "/assets/breakfast.png",
      ratio: 0.25,
    },
    {
      id: "plan-lunch",
      time: "1:00 PM",
      type: "Lunch",
      name: meals.lunch || dayOne?.lunch,
      image: "/assets/lunch.png",
      ratio: 0.35,
    },
    {
      id: "plan-snack",
      time: "5:00 PM",
      type: "Snack",
      name: meals.snack || dayOne?.snack,
      image: "/assets/snack.png",
      ratio: 0.12,
    },
    {
      id: "plan-dinner",
      time: "8:00 PM",
      type: "Dinner",
      name: meals.dinner || dayOne?.dinner,
      image: "/assets/dinner.png",
      ratio: 0.28,
    },
  ].filter((meal) => meal.name);

  return source.map((meal) => ({
    id: meal.id,
    time: meal.time,
    type: meal.type,
    name: meal.name || "Generated Meal",
    ingredients: "Generated from your latest AI nutrition plan",
    image: meal.image,
    calories: Math.round(calories * meal.ratio),
    score: 92,
    status: "Excellent",
    macros: [
      { label: "Protein", value: Math.round(protein * meal.ratio), color: "#A6FF4D" },
      { label: "Carbs", value: Math.round(carbs * meal.ratio), color: "#18D3D0" },
      { label: "Fats", value: Math.round(fats * meal.ratio), color: "#FFB347" },
    ],
  }));
}

function loadScanMeals() {
  const realScans = getScanHistory();

  if (realScans.length) {
    return {
      meals: realScans,
      source: "scan-history" as const,
    };
  }

  return {
    meals: getPlanBasedMeals(),
    source: "plan-preview" as const,
  };
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function buildTopFoods(meals: ScanMeal[]): TopFood[] {
  return meals
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((meal) => ({
      id: meal.id,
      name: meal.name,
      image: meal.image,
      score: meal.score,
      label: meal.status === "Excellent" ? "Excellent" : "Good",
    }));
}

export default function RecentFoodScans() {
  const [filter, setFilter] = useState("All Meals");
  const [showInsight, setShowInsight] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<ScanMeal | null>(null);
  const [scanState, setScanState] = useState(() => loadScanMeals());

  useEffect(() => {
    const refresh = () => setScanState(loadScanMeals());

    window.addEventListener("storage", refresh);
    window.addEventListener("ai-plan-updated", refresh);
    window.addEventListener("ai-scan-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ai-plan-updated", refresh);
      window.removeEventListener("ai-scan-updated", refresh);
    };
  }, []);

  const hasRealScans = scanState.source === "scan-history";
  const meals = scanState.meals;

  const nutritionScore = useMemo(
    () => average(meals.map((meal) => meal.score)),
    [meals],
  );

  const filteredMeals =
    filter === "All Meals"
      ? meals
      : meals.filter((meal) => meal.type === filter);

  const filters = ["All Meals", ...Array.from(new Set(meals.map((meal) => meal.type)))];

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          <Header />

          {!hasRealScans && (
            <div className="mt-4 rounded-[22px] border border-[#18D3D0]/25 bg-[#18D3D0]/5 p-4">
              <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#18D3D0]">
                Scanner History Not Started Yet
              </p>
              <p className="mt-2 text-[13px] leading-6 text-white/70">
                This section is showing your latest AI meal-plan preview until you scan real food.
                Once the scanner saves history, real scan rows will appear here automatically.
              </p>
            </div>
          )}

          {selectedMeal && (
            <div className="mt-4 rounded-[22px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 p-4">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                    Selected {hasRealScans ? "Scan" : "Plan Meal"}
                  </p>
                  <h3 className="mt-2 text-[20px] font-black text-white">
                    {selectedMeal.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-white/65">
                    {selectedMeal.ingredients}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedMeal(null)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-black text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 grid items-start gap-5 xl:grid-cols-[0.74fr_1.45fr_0.58fr]">
            <div className="grid content-start gap-5">
              <ScanSummary
                score={nutritionScore}
                meals={meals}
                hasRealScans={hasRealScans}
              />
              <TopFoods foods={buildTopFoods(meals)} hasRealScans={hasRealScans} />
            </div>

            <div className="mt-8 xl:mt-12">
              <RecentScans
                filter={filter}
                onFilter={setFilter}
                filters={filters}
                meals={filteredMeals}
                hasRealScans={hasRealScans}
                onSelectMeal={setSelectedMeal}
              />
            </div>

            <div className="grid content-start gap-5">
              <FoodInsights
                showInsight={showInsight}
                hasRealScans={hasRealScans}
                onToggle={() => setShowInsight((value) => !value)}
              />
              <ScanTrends meals={meals} hasRealScans={hasRealScans} />
            </div>
          </div>

          <QuickActions />
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="flex items-center gap-3 text-[28px] font-black uppercase leading-none tracking-[0.02em] sm:text-[34px] lg:text-[38px] xl:text-[40px]">
          Recent Food Scans
          <ScanLine className="text-[#A6FF4D]" size={26} />
        </h2>

        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
          Your food history, scanned by AI. Track, analyze and improve.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="/scanner"
          className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[14px] font-black text-white transition hover:border-[#18D3D0]/40 hover:text-[#18D3D0]"
        >
          <ScanLine size={18} />
          Scan Food
        </a>

        <button
          onClick={() => alert("Manual meal logging panel coming next.")}
          className="inline-flex items-center gap-3 rounded-2xl bg-[#A6FF4D] px-5 py-3 text-[14px] font-black text-black shadow-[0_0_34px_rgba(166,255,77,.28)] transition hover:scale-[1.02]"
        >
          <Plus size={20} />
          Add Manually
        </button>
      </div>
    </div>
  );
}

function ScanSummary({
  score,
  meals,
  hasRealScans,
}: {
  score: number;
  meals: ScanMeal[];
  hasRealScans: boolean;
}) {
  const totalCalories = sum(meals.map((meal) => meal.calories));
  const totalProtein = sum(
    meals.map((meal) => meal.macros.find((macro) => macro.label === "Protein")?.value || 0),
  );
  const totalCarbs = sum(
    meals.map((meal) => meal.macros.find((macro) => macro.label === "Carbs")?.value || 0),
  );
  const totalFats = sum(
    meals.map((meal) => meal.macros.find((macro) => macro.label === "Fats")?.value || 0),
  );

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="mb-4 flex items-center gap-2 text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        <BarChart3 size={17} />
        {hasRealScans ? "Scan Summary" : "Plan Preview Summary"}
      </p>

      <div className="grid items-center gap-4 xl:grid-cols-[145px_1fr]">
        <div
          className="grid h-[145px] w-[145px] place-items-center rounded-full shadow-[0_0_50px_rgba(166,255,77,.22)]"
          style={{
            background: `conic-gradient(#A6FF4D ${
              score * 3.6
            }deg, rgba(255,255,255,.08) 0deg)`,
          }}
        >
          <div className="grid h-[110px] w-[110px] place-items-center rounded-full bg-[#07110A]">
            <div className="text-center">
              <p className="text-[32px] font-black leading-none">{score}%</p>
              <p className="mt-1 text-[12px] text-white/75">
                Nutrition Score
              </p>
              <p className="mt-1 text-[12px] font-bold text-[#A6FF4D]">
                {score >= 90 ? "Excellent" : "Good"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <SummaryStat
            label={hasRealScans ? "Total Scans" : "Plan Meals"}
            value={String(meals.length)}
            sub={hasRealScans ? "Saved history" : "Generated plan"}
          />
          <SummaryStat
            label="Total Calories"
            value={`${totalCalories.toLocaleString()} kcal`}
            sub={hasRealScans ? "From scans" : "From plan target"}
            green
          />
          <SummaryStat
            label="Goal Match"
            value={`${score}%`}
            sub={hasRealScans ? "Avg scan score" : "Plan-aligned"}
            green
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 grid grid-cols-3 gap-4">
          <MacroSummary color="#A6FF4D" label="Protein" value={`${totalProtein}g`} sub="total" />
          <MacroSummary color="#18D3D0" label="Carbs" value={`${totalCarbs}g`} sub="total" />
          <MacroSummary color="#FFB347" label="Fats" value={`${totalFats}g`} sub="total" />
        </div>

        <div className="flex h-2.5 overflow-hidden rounded-full bg-white/10">
          <span className="w-[33%] bg-[#A6FF4D]" />
          <span className="w-[45%] bg-[#18D3D0]" />
          <span className="w-[22%] bg-[#FFB347]" />
        </div>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  sub,
  green,
}: {
  label: string;
  value: string;
  sub: string;
  green?: boolean;
}) {
  return (
    <div>
      <p className="text-[12px] text-white/60">{label}</p>
      <p className="mt-1 text-[20px] font-black leading-none text-white">
        {value}
      </p>
      <p
        className={`mt-1 text-[11px] font-semibold ${
          green ? "text-[#A6FF4D]" : "text-white/55"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

function MacroSummary({
  color,
  label,
  value,
  sub,
}: {
  color: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[12px] text-white/75">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        {label}
      </p>
      <p className="mt-2 text-[13px] font-black text-white">{value}</p>
      <p className="text-[10px] text-white/45">{sub}</p>
    </div>
  );
}

function TopFoods({
  foods,
  hasRealScans,
}: {
  foods: TopFood[];
  hasRealScans: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          {hasRealScans ? "Top Foods This Week" : "Top Plan Meals"}
        </p>

        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] text-white/80">
          By Nutrition Score
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="space-y-3.5">
        {foods.length ? (
          foods.map((food) => (
            <div key={food.id} className="flex items-center gap-3">
              <img
                src={food.image}
                alt={food.name}
                className="h-9 w-9 rounded-full border border-white/10 object-cover"
              />

              <p className="min-w-0 flex-1 truncate text-[13px] font-black text-white">
                {food.name}
              </p>

              <div className="text-right">
                <p className="text-[15px] font-black leading-none text-white">
                  {food.score}
                </p>
                <p className="text-[10px] text-[#A6FF4D]">{food.label}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[13px] leading-6 text-white/65">
            No scanned foods yet. Open the scanner to create your first food history.
          </p>
        )}
      </div>

      <a
        href="/scanner"
        className="mt-5 flex w-full items-center justify-end gap-2 text-[13px] font-black text-[#A6FF4D]"
      >
        Open Scanner
        <ArrowRight size={15} />
      </a>
    </div>
  );
}

function RecentScans({
  meals,
  filter,
  onFilter,
  filters,
  hasRealScans,
  onSelectMeal,
}: {
  meals: ScanMeal[];
  filter: string;
  onFilter: (value: string) => void;
  filters: string[];
  hasRealScans: boolean;
  onSelectMeal: (meal: ScanMeal) => void;
}) {
  return (
    <div className="h-fit rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          {hasRealScans ? "Recent Scans" : "Generated Plan Meals"}
        </p>

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(event) => onFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#07110A] px-4 py-2.5 text-[12px] font-bold text-white outline-none"
          >
            {filters.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/80">
            <CalendarDays size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {meals.length ? (
          meals.map((meal) => (
            <ScanRow
              key={meal.id}
              meal={meal}
              onSelectMeal={() => onSelectMeal(meal)}
            />
          ))
        ) : (
          <div className="rounded-[22px] border border-[#18D3D0]/25 bg-[#18D3D0]/5 p-6 text-center">
            <ScanLine className="mx-auto text-[#18D3D0]" size={34} />
            <h3 className="mt-3 text-[20px] font-black text-white">
              No food scans yet
            </h3>
            <p className="mx-auto mt-2 max-w-[520px] text-[13px] leading-6 text-white/65">
              Scan your first meal to unlock food score, macros, calories, and recent history.
            </p>
            <a
              href="/scanner"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#A6FF4D] px-5 py-3 text-[13px] font-black text-black"
            >
              <ScanLine size={16} />
              Scan Food Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanRow({
  meal,
  onSelectMeal,
}: {
  meal: ScanMeal;
  onSelectMeal: () => void;
}) {
  return (
    <button
      onClick={onSelectMeal}
      className="grid w-full items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.035] p-2.5 text-left transition hover:border-[#A6FF4D]/30 hover:bg-white/[0.055] lg:grid-cols-[0.18fr_0.18fr_1fr_0.16fr_0.11fr_0.04fr]"
    >
      <div>
        <p className="text-[12px] text-white/70">{meal.time}</p>
        <p className="mt-1.5 text-[13px] font-black text-white">{meal.type}</p>
      </div>

      <img
        src={meal.image}
        alt={meal.name}
        className="h-[58px] w-[58px] rounded-2xl border border-white/10 object-cover"
      />

      <div className="min-w-0">
        <p className="truncate text-[15px] font-black text-white">
          {meal.name}
        </p>
        <p className="mt-1 truncate text-[12px] text-white/60">
          {meal.ingredients}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {meal.macros.map((macro) => (
            <span
              key={macro.label}
              className="rounded-lg border px-2.5 py-1.5 text-[10px] font-bold"
              style={{
                borderColor: `${macro.color}40`,
                color: macro.color,
                backgroundColor: `${macro.color}10`,
              }}
            >
              {macro.value}g
              <span className="ml-1 text-white/50">{macro.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="text-right">
        <p className="text-[16px] font-black text-white">
          {meal.calories}
          <span className="ml-1 text-[11px] font-medium text-white/70">
            kcal
          </span>
        </p>
        <p className="mt-1.5 text-[11px] font-bold text-[#A6FF4D]">
          {meal.status}
        </p>
      </div>

      <div
        className="grid h-12 w-12 place-items-center rounded-full border-[3px] bg-[#07110A]"
        style={{
          borderColor: meal.status === "Excellent" ? "#A6FF4D" : "#9FFF42",
        }}
      >
        <span className="text-[16px] font-black text-white">{meal.score}</span>
      </div>

      <ChevronRight size={20} className="text-white/80" />
    </button>
  );
}

function FoodInsights({
  showInsight,
  hasRealScans,
  onToggle,
}: {
  showInsight: boolean;
  hasRealScans: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="mb-4 flex items-center gap-2 text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        <Crosshair size={17} />
        AI Food Insights
      </p>

      <div className="grid items-center gap-4 xl:grid-cols-[135px_1fr]">
        <img
          src={FOOD_HOLOGRAM}
          alt="AI food insights"
          className="h-[135px] w-[135px] object-contain drop-shadow-[0_0_38px_rgba(166,255,77,.25)]"
        />

        <div className="space-y-3">
          <FoodInsightDot
            title={hasRealScans ? "Scan-Based Insights" : "Plan-Based Preview"}
            sub={hasRealScans ? "Real scan history active" : "Scanner history pending"}
          />
          <FoodInsightDot title="Macro Tracking" sub="Protein, carbs and fats ready" />
          <FoodInsightDot title="Goal Alignment" sub="Compared with latest plan" />
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-6 text-white/75">
        {hasRealScans
          ? "Your scanned foods are being compared with your current nutrition goal."
          : "Scan real meals to replace this plan preview with live food history."}
      </p>

      {showInsight && (
        <p className="mt-3 rounded-xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 px-4 py-3 text-[12px] font-semibold leading-6 text-white/80">
          {hasRealScans
            ? "AI will identify meal timing, macro quality, and repeated food patterns from your saved scans."
            : "Your latest meal plan is being used as a temporary preview until scanner history is saved."}
        </p>
      )}

      <button
        onClick={onToggle}
        className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 px-4 py-3 text-[13px] font-black text-[#A6FF4D] transition hover:bg-[#A6FF4D]/10"
      >
        {showInsight ? "Hide Detailed Insights" : "View Detailed Insights"}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

function FoodInsightDot({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#A6FF4D] shadow-[0_0_14px_rgba(166,255,77,.9)]" />
      <div>
        <p className="text-[13px] font-black text-white">{title}</p>
        <p className="mt-1 text-[11px] text-white/60">{sub}</p>
      </div>
    </div>
  );
}

function ScanTrends({
  meals,
  hasRealScans,
}: {
  meals: ScanMeal[];
  hasRealScans: boolean;
}) {
  const values = meals.length
    ? meals.slice(0, 7).map((meal) => meal.score)
    : [0, 0, 0, 0, 0, 0, 0];

  const normalized =
    values.length >= 7 ? values.slice(0, 7) : [...values, ...Array(7 - values.length).fill(values.at(-1) || 0)];

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          {hasRealScans ? "Scan Trends" : "Plan Meal Trends"}
        </p>

        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] text-white/80">
          This Week
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex h-[130px] items-end justify-between gap-4 border-l border-b border-white/10 px-5 pt-4">
        {normalized.map((bar, index) => (
          <div
            key={index}
            className="flex h-full flex-col items-center justify-end gap-2"
          >
            <div
              className="w-5 rounded-t-lg bg-gradient-to-t from-[#7BE929] to-[#A6FF4D] shadow-[0_0_20px_rgba(166,255,77,.35)]"
              style={{ height: `${Math.max(bar, 8)}%` }}
            />
            <span className="text-[10px] text-white/60">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-[#A6FF4D]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#A6FF4D]" />
        Nutrition Score
      </p>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="mt-3 grid gap-4 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 xl:grid-cols-[0.55fr_1fr_1fr_1fr_1fr] xl:items-center">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#A6FF4D]/10 text-[#A6FF4D]">
          <Sparkles size={30} />
        </div>

        <div>
          <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
            Quick Actions
          </p>
          <p className="mt-1 text-[13px] text-white/65">
            Make smarter choices in real time.
          </p>
        </div>
      </div>

      {quickActions.map((action) => {
        const Icon = action.icon;

        const content = (
          <>
            <div className="flex items-center gap-4">
              <Icon size={28} className="text-[#A6FF4D]" />
              <div>
                <p className="text-[14px] font-black text-white">
                  {action.title}
                </p>
                <p className="mt-1 text-[12px] text-white/60">
                  {action.subtitle}
                </p>
              </div>
            </div>

            <ChevronRight size={20} className="text-white/80" />
          </>
        );

        if (action.href) {
          return (
            <a
              key={action.id}
              href={action.href}
              className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-[#A6FF4D]/30 hover:bg-white/[0.06]"
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={action.id}
            onClick={() => alert(action.title)}
            className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-[#A6FF4D]/30 hover:bg-white/[0.06]"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_22%_42%,rgba(24,211,208,0.08),transparent_34%),radial-gradient(circle_at_78%_58%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px)] [background-size:78px_78px]" />
    </>
  );
}
