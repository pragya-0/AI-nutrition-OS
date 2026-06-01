import { useMemo, useState, type ElementType } from "react";
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
const SMOOTHIE_IMAGE = "/assets/smoothie.png";

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
};

const scanMeals: ScanMeal[] = [
  {
    id: "breakfast",
    time: "7:30 AM",
    type: "Breakfast",
    name: "Oats Bowl with Berries",
    ingredients: "Oats, Almonds, Berries, Honey, Chia Seeds",
    image: "/assets/oats-bowl.png",
    calories: 350,
    score: 95,
    status: "Excellent",
    macros: [
      { label: "Protein", value: 28, color: "#A6FF4D" },
      { label: "Carbs", value: 38, color: "#18D3D0" },
      { label: "Fats", value: 9, color: "#FFB347" },
    ],
  },
  {
    id: "smoothie",
    time: "10:45 AM",
    type: "Mid Snack",
    name: "Protein Smoothie",
    ingredients: "Banana, Whey Protein, Peanut Butter, Milk",
    image: SMOOTHIE_IMAGE,
    calories: 210,
    score: 88,
    status: "Good",
    macros: [
      { label: "Protein", value: 20, color: "#A6FF4D" },
      { label: "Carbs", value: 22, color: "#18D3D0" },
      { label: "Fats", value: 6, color: "#FFB347" },
    ],
  },
  {
    id: "lunch",
    time: "1:30 PM",
    type: "Lunch",
    name: "Quinoa + Paneer + Salad",
    ingredients: "Quinoa, Paneer, Mixed Veg, Olive Oil",
    image: "/assets/quinoa-paneer-salad.png",
    calories: 420,
    score: 93,
    status: "Excellent",
    macros: [
      { label: "Protein", value: 32, color: "#A6FF4D" },
      { label: "Carbs", value: 40, color: "#18D3D0" },
      { label: "Fats", value: 12, color: "#FFB347" },
    ],
  },
  {
    id: "fruit",
    time: "5:15 PM",
    type: "Evening Snack",
    name: "Fruit Bowl",
    ingredients: "Apple, Banana, Pomegranate, Kiwi",
    image: "/assets/fruit-bowl.png",
    calories: 180,
    score: 85,
    status: "Good",
    macros: [
      { label: "Protein", value: 4, color: "#A6FF4D" },
      { label: "Carbs", value: 28, color: "#18D3D0" },
      { label: "Fats", value: 2, color: "#FFB347" },
    ],
  },
  {
    id: "dinner",
    time: "8:00 PM",
    type: "Dinner",
    name: "Moong Dal + Brown Rice",
    ingredients: "Moong Dal, Brown Rice, Ghee, Veggies",
    image: "/assets/moong-dal-brown-rice.png",
    calories: 360,
    score: 94,
    status: "Excellent",
    macros: [
      { label: "Protein", value: 24, color: "#A6FF4D" },
      { label: "Carbs", value: 50, color: "#18D3D0" },
      { label: "Fats", value: 7, color: "#FFB347" },
    ],
  },
];

const topFoods: TopFood[] = [
  {
    id: "moong",
    name: "Moong Dal + Brown Rice",
    image: "/assets/moong-dal-brown-rice.png",
    score: 96,
    label: "Excellent",
  },
  {
    id: "yogurt",
    name: "Greek Yogurt Bowl",
    image: "/assets/oats-bowl.png",
    score: 94,
    label: "Excellent",
  },
  {
    id: "paneer",
    name: "Paneer Bhurji",
    image: "/assets/quinoa-paneer-salad.png",
    score: 92,
    label: "Excellent",
  },
  {
    id: "veg",
    name: "Veg Stir Fry",
    image: "/assets/quinoa-paneer-salad.png",
    score: 90,
    label: "Very Good",
  },
  {
    id: "smoothie",
    name: "Protein Smoothie",
    image: SMOOTHIE_IMAGE,
    score: 89,
    label: "Very Good",
  },
];

const quickActions: QuickAction[] = [
  {
    id: "scan",
    title: "Scan Food",
    subtitle: "Instant AI analysis",
    icon: ScanLine,
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

export default function RecentFoodScans() {
  const [filter, setFilter] = useState("All Meals");
  const [showInsight, setShowInsight] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<ScanMeal | null>(null);

  const nutritionScore = useMemo(() => {
    const total = scanMeals.reduce((sum, meal) => sum + meal.score, 0);
    return Math.round(total / scanMeals.length);
  }, []);

  const filteredMeals =
    filter === "All Meals"
      ? scanMeals
      : scanMeals.filter((meal) => meal.type === filter);

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          <Header />

          {selectedMeal && (
            <div className="mt-4 rounded-[22px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 p-4">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                    Selected Scan
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
    <ScanSummary score={nutritionScore} />
    <TopFoods />
  </div>

  <div className="mt-8 xl:mt-12">
    <RecentScans
      filter={filter}
      onFilter={setFilter}
      meals={filteredMeals}
      onSelectMeal={setSelectedMeal}
    />
  </div>

  <div className="grid content-start gap-5">
    <FoodInsights
      showInsight={showInsight}
      onToggle={() => setShowInsight((value) => !value)}
    />
    <ScanTrends />
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
      <div className="flex items-center gap-4">
       

        <div>
          <h2 className="flex items-center gap-3 text-[28px] font-black uppercase leading-none tracking-[0.02em] sm:text-[34px] lg:text-[38px] xl:text-[40px]">
            Recent Food Scans
            <ScanLine className="text-[#A6FF4D]" size={26} />
          </h2>

          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
            Your food history, scanned by AI. Track, analyze and improve.
          </p>
        </div>
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

function ScanSummary({ score }: { score: number }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <p className="mb-4 flex items-center gap-2 text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        <BarChart3 size={17} />
        Scan Summary
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
                Excellent
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <SummaryStat label="Total Scans" value="23" sub="This Week" />
          <SummaryStat
            label="Avg. Calories"
            value="1,842 kcal"
            sub="▼ 5% vs last week"
            green
          />
          <SummaryStat
            label="Goal Match"
            value="92%"
            sub="↑ 8% vs last week"
            green
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 grid grid-cols-3 gap-4">
          <MacroSummary color="#A6FF4D" label="Protein" value="118g" sub="92%" />
          <MacroSummary color="#18D3D0" label="Carbs" value="142g" sub="88%" />
          <MacroSummary color="#FFB347" label="Fats" value="58g" sub="85%" />
        </div>

        <div className="flex h-2.5 overflow-hidden rounded-full bg-white/10">
          <span className="w-[55%] bg-[#A6FF4D]" />
          <span className="w-[30%] bg-[#18D3D0]" />
          <span className="w-[15%] bg-[#FFB347]" />
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

function TopFoods() {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          Top Foods This Week
        </p>

        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] text-white/80">
          By Nutrition Score
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="space-y-3.5">
        {topFoods.map((food) => (
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
        ))}
      </div>

      <button
        onClick={() => alert("All foods list coming next.")}
        className="mt-5 flex w-full items-center justify-end gap-2 text-[13px] font-black text-[#A6FF4D]"
      >
        View All Foods
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function RecentScans({
  meals,
  filter,
  onFilter,
  onSelectMeal,
}: {
  meals: ScanMeal[];
  filter: string;
  onFilter: (value: string) => void;
  onSelectMeal: (meal: ScanMeal) => void;
}) {
  return (
    <div className="h-fit rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          Recent Scans
        </p>

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(event) => onFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#07110A] px-4 py-2.5 text-[12px] font-bold text-white outline-none"
          >
            <option>All Meals</option>
            <option>Breakfast</option>
            <option>Mid Snack</option>
            <option>Lunch</option>
            <option>Evening Snack</option>
            <option>Dinner</option>
          </select>

          <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/80">
            <CalendarDays size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {meals.map((meal) => (
          <ScanRow
            key={meal.id}
            meal={meal}
            onSelectMeal={() => onSelectMeal(meal)}
          />
        ))}
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
  onToggle,
}: {
  showInsight: boolean;
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
          <FoodInsightDot title="High Protein" sub="Great choice!" />
          <FoodInsightDot title="Low Sugar" sub="Perfect!" />
          <FoodInsightDot title="Good Fats" sub="Keep it up!" />
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-6 text-white/75">
        Your food choices are aligned with your fat loss goal. Keep focusing on
        protein consistency.
      </p>

      {showInsight && (
        <p className="mt-3 rounded-xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 px-4 py-3 text-[12px] font-semibold leading-6 text-white/80">
          AI noticed better meal timing today. Breakfast and lunch protein were
          strong, but dinner can still be improved.
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

function ScanTrends() {
  const bars = [74, 68, 73, 84, 70, 55];

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          Scan Trends
        </p>

        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] text-white/80">
          This Week
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex h-[130px] items-end justify-between gap-4 border-l border-b border-white/10 px-5 pt-4">
        {bars.map((bar, index) => (
          <div
            key={index}
            className="flex h-full flex-col items-center justify-end gap-2"
          >
            <div
              className="w-5 rounded-t-lg bg-gradient-to-t from-[#7BE929] to-[#A6FF4D] shadow-[0_0_20px_rgba(166,255,77,.35)]"
              style={{ height: `${bar}%` }}
            />
            <span className="text-[10px] text-white/60">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"][index]}
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

        return (
          <button
            key={action.id}
            onClick={() => alert(action.title)}
            className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-[#A6FF4D]/30 hover:bg-white/[0.06]"
          >
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
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}