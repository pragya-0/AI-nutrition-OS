import Image from "@/compat/NextImage";
import { Link } from "react-router-dom";
import {
  Activity,
  Bell,
  ChevronDown,
  Droplets,
  Flame,
  Leaf,
  LineChart,
  Moon,
  Scale,
  ScanLine,
  Sparkles,
  Target,
  Utensils,
  Weight,
} from "lucide-react";

type StoredPlan = {
  success?: boolean;
  user_profile?: {
    name?: string;
    city?: string;
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    goal?: string;
    diet?: string;
    activity?: string;
    sleep_hours?: number;
    water_intake?: number;
  };
  analytics?: {
    wellness_adherence?: number;
    nutrition_consistency?: number;
    goal_alignment?: number;
    program_completion?: number;
    health_score?: number;
    health_status?: string;
    bmi?: number;
    sleep_score?: number;
    hydration_score?: number;
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
      meals?: {
        breakfast?: string;
        lunch?: string;
        snack?: string;
        dinner?: string;
      };
      workout_tip?: string;
    }>;
  };
  health_insight?: string;
  coach_message?: string;
  ai_tip?: string;
};

type MealPreview = {
  label: string;
  time: string;
  name: string;
  icon: React.ElementType;
  color: string;
};

type DashboardData = {
  user: {
    name: string;
    avatar: string;
    isNewUser: boolean;
  };
  metabolic: {
    bmi: number;
    bmiStatus: string;
    bmr: number;
    tdee: number;
    targetCalories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: string;
    expectedChange: string;
  };
  adherence: {
    overall: number;
    nutritionConsistency: number;
    goalAlignment: number;
    programCompletion: number;
    status: string;
  };
  profile: {
    sleepHours: string;
    goal: string;
    diet: string;
    activity: string;
  };
  meals: MealPreview[];
  coach: {
    title: string;
    message: string;
    action: string;
  };
};

const PRIMARY = "#93C572";
const TEAL = "#18D3D0";
const WARNING = "#F5B942";
const PURPLE = "#A875FF";

const fallbackData: DashboardData = {
  user: {
    name: "Guest",
    avatar: "/assets/avatar-1.png",
    isNewUser: true,
  },
  metabolic: {
    bmi: 0,
    bmiStatus: "Waiting for profile",
    bmr: 0,
    tdee: 0,
    targetCalories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    water: "0L",
    expectedChange: "Generate a plan first",
  },
  adherence: {
    overall: 0,
    nutritionConsistency: 0,
    goalAlignment: 0,
    programCompletion: 0,
    status: "Not started",
  },
  profile: {
    sleepHours: "0h",
    goal: "Not set",
    diet: "Not set",
    activity: "Not set",
  },
  meals: [
    {
      label: "Breakfast",
      time: "8:00 AM",
      name: "Generate a plan to view breakfast",
      icon: Flame,
      color: WARNING,
    },
    {
      label: "Lunch",
      time: "1:00 PM",
      name: "Generate a plan to view lunch",
      icon: Utensils,
      color: TEAL,
    },
    {
      label: "Snack",
      time: "5:00 PM",
      name: "Generate a plan to view snack",
      icon: Leaf,
      color: PRIMARY,
    },
    {
      label: "Dinner",
      time: "8:00 PM",
      name: "Generate a plan to view dinner",
      icon: Moon,
      color: PURPLE,
    },
  ],
  coach: {
    title: "Start with your profile",
    message:
      "Generate your first AI nutrition plan to unlock today's meals, targets, and coach actions.",
    action: "Complete onboarding",
  },
};

function getStoredPlan(): StoredPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    if (!raw) return null;
    return JSON.parse(raw) as StoredPlan;
  } catch {
    return null;
  }
}

function formatLabel(value?: string) {
  if (!value) return "Not set";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function round(value: number, digits = 0) {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function parseWaterTarget(value?: string, fallback = 2.5) {
  const match = value?.match(/[\d.]+/);
  if (!match) return `${fallback}L`;
  return `${Number(match[0])}L`;
}

function calculateBmi(weight?: number, heightCm?: number) {
  if (!weight || !heightCm) return 0;
  const heightM = heightCm / 100;
  return round(weight / (heightM * heightM), 1);
}

function getBmiStatus(bmi: number) {
  if (!bmi) return "Waiting for profile";
  if (bmi < 18.5) return "Below healthy range";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Above healthy range";
  return "High BMI range";
}

function calculateBmr({
  weight,
  height,
  age,
  gender,
}: {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
}) {
  if (!weight || !height || !age) return 0;

  const normalizedGender = String(gender || "").toLowerCase();
  const base = 10 * weight + 6.25 * height - 5 * age;

  if (normalizedGender.includes("female")) return Math.round(base - 161);
  if (normalizedGender.includes("male")) return Math.round(base + 5);

  return Math.round(base - 78);
}

function getActivityFactor(activity?: string) {
  const text = String(activity || "").toLowerCase();

  if (text.includes("sedentary")) return 1.2;
  if (text.includes("light")) return 1.375;
  if (text.includes("moderate")) return 1.55;
  if (text.includes("extra")) return 1.9;
  if (text.includes("active")) return 1.725;

  return 1.4;
}

function getExpectedChange(goal?: string, tdee?: number, targetCalories?: number) {
  const normalizedGoal = String(goal || "").toLowerCase();

  if (!tdee || !targetCalories) return "Needs more data";

  const dailyDifference = tdee - targetCalories;
  const weeklyKg = Math.abs((dailyDifference * 7) / 7700);

  if (normalizedGoal.includes("weight") || normalizedGoal.includes("fat")) {
    if (dailyDifference <= 0) return "Maintenance-style target";
    return `~${round(weeklyKg, 1)} kg/week loss`;
  }

  if (normalizedGoal.includes("muscle")) {
    return "Muscle support target";
  }

  return "Maintenance target";
}

function clampScore(value: unknown, fallback = 0) {
  const numberValue = Number(value ?? fallback);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(Math.max(Math.round(numberValue), 0), 100);
}

function getAdherenceStatus(score: number) {
  if (!score) return "Needs logs";
  if (score >= 85) return "Strong consistency";
  if (score >= 70) return "Good consistency";
  return "Needs attention";
}

type PlanDay = NonNullable<
  NonNullable<StoredPlan["meal_plan"]>["days"]
>[number];

function mealName(
  day: PlanDay | undefined,
  key: "breakfast" | "lunch" | "snack" | "dinner",
) {
  if (!day) return "";
  return day.meals?.[key] || day[key] || "";
}

function buildMealPreview(plan: StoredPlan | null): MealPreview[] {
  const dayOne = plan?.meal_plan?.days?.[0];

  return [
    {
      label: "Breakfast",
      time: "8:00 AM",
      name: mealName(dayOne, "breakfast") || fallbackData.meals[0].name,
      icon: Flame,
      color: WARNING,
    },
    {
      label: "Lunch",
      time: "1:00 PM",
      name: mealName(dayOne, "lunch") || fallbackData.meals[1].name,
      icon: Utensils,
      color: TEAL,
    },
    {
      label: "Snack",
      time: "5:00 PM",
      name: mealName(dayOne, "snack") || fallbackData.meals[2].name,
      icon: Leaf,
      color: PRIMARY,
    },
    {
      label: "Dinner",
      time: "8:00 PM",
      name: mealName(dayOne, "dinner") || fallbackData.meals[3].name,
      icon: Moon,
      color: PURPLE,
    },
  ];
}

function buildDashboardData(): DashboardData {
  const plan = getStoredPlan();

  if (!plan?.success) return fallbackData;

  const profile = plan.user_profile || {};
  const analytics = plan.analytics || {};
  const targets = plan.targets || {};

  const weight = Number(profile.weight || 0);
  const height = Number(profile.height || 0);
  const age = Number(profile.age || 0);
  const gender = profile.gender || "Not set";

  const bmi = analytics.bmi ? round(Number(analytics.bmi), 1) : calculateBmi(weight, height);
  const bmr = calculateBmr({ weight, height, age, gender });
  const tdee = bmr ? Math.round(bmr * getActivityFactor(profile.activity)) : 0;
  const targetCalories = Number(targets.calories || 0);

  const fallbackAdherence = clampScore(analytics.health_score);
  const overall = clampScore(analytics.wellness_adherence, fallbackAdherence);
  const nutritionConsistency = clampScore(analytics.nutrition_consistency, overall);
  const goalAlignment = clampScore(analytics.goal_alignment, overall);
  const programCompletion = clampScore(analytics.program_completion, plan.meal_plan?.days?.length ? 100 : 0);

  return {
    user: {
      name: profile.name?.trim() || "User",
      avatar: "/assets/avatar-1.png",
      isNewUser: false,
    },
    metabolic: {
      bmi,
      bmiStatus: getBmiStatus(bmi),
      bmr,
      tdee,
      targetCalories,
      protein: Number(targets.protein || 0),
      carbs: Number(targets.carbs || 0),
      fats: Number(targets.fats || 0),
      water: parseWaterTarget(targets.water_target, profile.water_intake || 2.5),
      expectedChange: getExpectedChange(profile.goal, tdee, targetCalories),
    },
    adherence: {
      overall,
      nutritionConsistency,
      goalAlignment,
      programCompletion,
      status: getAdherenceStatus(overall),
    },
    profile: {
      sleepHours: `${profile.sleep_hours || 0}h`,
      goal: formatLabel(profile.goal),
      diet: formatLabel(profile.diet),
      activity: formatLabel(profile.activity),
    },
    meals: buildMealPreview(plan),
    coach: {
      title: targetCalories
        ? `Follow your ${targetCalories.toLocaleString()} kcal target today`
        : "Follow today's nutrition target",
      message:
        plan.ai_tip ||
        plan.coach_message ||
        plan.health_insight ||
        "Follow today's meals, hit protein, and keep hydration consistent before changing calories.",
      action:
        targets.protein && targets.water_target
          ? `Complete ${targets.protein}g protein and ${parseWaterTarget(targets.water_target)} water`
          : "Follow today's plan",
    },
  };
}

export default function AIHealthCommandCenter() {
  const data = buildDashboardData();
  const isNewUser = data.user.isNewUser;

  return (
    <section className="relative overflow-x-hidden bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[92vw] overflow-hidden rounded-[30px] border border-white/10 bg-[#020604]/95 shadow-[0_0_70px_rgba(147,197,114,0.06)] 2xl:max-w-[1780px]">
        <BackgroundFX />

        <DashboardNav userName={data.user.name} avatar={data.user.avatar} />

        <div className="relative z-10 px-5 py-6 lg:px-8 xl:px-10">
          <HeroHeader data={data} />

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <MetabolicProfileCard data={data} />
            <CoachActionCard data={data} />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.72fr]">
            <TodaysMealsCard meals={data.meals} />
            <TodaysProgressCard data={data} />
          </div>

          <QuickAccessGrid isNewUser={isNewUser} />
        </div>
      </div>
    </section>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_72%_34%,rgba(147,197,114,0.1),transparent_35%),radial-gradient(circle_at_20%_66%,rgba(24,211,208,0.05),transparent_31%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.08] [background-image:linear-gradient(rgba(147,197,114,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.1)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}

function DashboardNav({ userName, avatar }: { userName: string; avatar: string }) {
  const navItems = [
    { label: "Dashboard", to: "/dashboard", active: true },
    { label: "Nutrition", to: "/nutrition" },
    { label: "Scanner", to: "/scanner" },
    { label: "Progress", to: "/progress" },
    { label: "Reports", to: "/reports" },
  ];

  return (
    <nav className="relative z-10 flex min-h-[66px] items-center justify-between border-b border-white/10 px-5 py-3 lg:px-8 xl:px-10">
      <Link to="/dashboard" className="flex items-center gap-3">
        <Image
          src="/assets/logo.png"
          alt="NutriAI"
          width={180}
          height={64}
          className="h-auto w-[122px] sm:w-[135px] xl:w-[145px]"
          priority
        />
      </Link>

      <div className="hidden items-center gap-2 lg:flex">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`rounded-2xl px-4 py-2 text-[13px] font-bold leading-none transition ${
              item.active
                ? "bg-[#93C572]/12 text-[#93C572]"
                : "text-[#A3B3A3] hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={23} className="text-white/80" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#93C572]" />
        </div>

        <Link to="/profile" className="flex items-center gap-3">
          <img
            src={avatar}
            alt={userName}
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
          />
          <span className="hidden text-[16px] font-black md:block">
            {userName}
          </span>
          <ChevronDown size={19} className="text-white/70" />
        </Link>
      </div>
    </nav>
  );
}

function HeroHeader({ data }: { data: DashboardData }) {
  const isNewUser = data.user.isNewUser;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.52fr]">
      <div>
        <p className="text-[12px] font-black uppercase tracking-[0.34em] text-[#18D3D0] xl:text-[13px]">
          {isNewUser ? "START YOUR AI JOURNEY" : getGreeting()}
        </p>

        <h1 className="mt-3 text-[38px] font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-[48px] lg:text-[58px] xl:text-[64px]">
          {isNewUser ? "Welcome," : "Welcome back,"}
          <br />
          <span className="text-[#93C572] drop-shadow-[0_0_18px_rgba(147,197,114,.32)]">
            {data.user.name}
          </span>
          <Leaf className="ml-2 inline-block text-[#93C572]" size={30} />
        </h1>

        <p className="mt-4 max-w-[760px] text-[16px] font-semibold leading-7 text-white/68">
          {isNewUser
            ? "Generate your first plan to unlock your daily command center."
            : "Today’s dashboard only shows the essentials: metabolic profile, meals, progress, and one coach action."}
        </p>
      </div>

      <div className="rounded-[24px] border border-[#93C572]/20 bg-[#061009]/76 p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#93C572]">
          Wellness Adherence
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[34px] font-black leading-none text-white">
              {data.adherence.overall ? `${data.adherence.overall}` : "—"}
              {data.adherence.overall ? <span className="text-[15px] text-white/50">/100</span> : null}
            </p>
            <p className="mt-2 text-[13px] font-bold text-white/60">
              {data.adherence.status}
            </p>
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-full border-[8px] border-[#93C572] bg-[#93C572]/10 text-[#93C572]">
            <LineChart size={28} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetabolicProfileCard({ data }: { data: DashboardData }) {
  const metrics = [
    {
      label: "BMI",
      value: data.metabolic.bmi ? String(data.metabolic.bmi) : "—",
      sub: data.metabolic.bmiStatus,
      icon: Scale,
      color: "#93C572",
    },
    {
      label: "BMR",
      value: data.metabolic.bmr ? data.metabolic.bmr.toLocaleString() : "—",
      sub: "kcal at rest",
      icon: Flame,
      color: "#F5B942",
    },
    {
      label: "TDEE",
      value: data.metabolic.tdee ? data.metabolic.tdee.toLocaleString() : "—",
      sub: "estimated daily burn",
      icon: Activity,
      color: "#18D3D0",
    },
    {
      label: "Target",
      value: data.metabolic.targetCalories
        ? data.metabolic.targetCalories.toLocaleString()
        : "—",
      sub: "daily calories",
      icon: Target,
      color: "#A875FF",
    },
  ];

  return (
    <div className="rounded-[28px] border border-[#93C572]/18 bg-[#061009]/75 p-5 shadow-[inset_0_0_36px_rgba(147,197,114,.026)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#93C572]">
            Metabolic Profile
          </p>
          <h2 className="mt-2 text-[30px] font-black tracking-[-0.05em] text-white sm:text-[36px]">
            Why this plan exists
          </h2>
        </div>

        <p className="max-w-[520px] text-[13px] font-semibold leading-6 text-white/58">
          BMI, BMR, TDEE and targets are wellness estimates from your latest
          generated profile. They are not medical diagnosis.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetabolicMetric key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <TargetChip
          label="Protein"
          value={data.metabolic.protein ? `${data.metabolic.protein}g` : "—"}
          icon={Utensils}
          color="#93C572"
        />
        <TargetChip
          label="Water"
          value={data.metabolic.water}
          icon={Droplets}
          color="#18D3D0"
        />
        <TargetChip
          label="Expected Weekly Change"
          value={data.metabolic.expectedChange}
          icon={Weight}
          color="#F5B942"
        />
      </div>
    </div>
  );
}

function MetabolicMetric({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
          {label}
        </p>
        <Icon size={20} style={{ color }} />
      </div>

      <p className="text-[30px] font-black leading-none tracking-[-0.06em] text-white">
        {value}
      </p>
      <p className="mt-2 text-[12px] font-bold leading-5 text-white/58">
        {sub}
      </p>
    </div>
  );
}

function TargetChip({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="rounded-[20px] border bg-black/20 px-4 py-3"
      style={{ borderColor: `${color}33` }}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} style={{ color }} />
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
            {label}
          </p>
          <p className="mt-1 text-[15px] font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CoachActionCard({ data }: { data: DashboardData }) {
  return (
    <div className="rounded-[28px] border border-[#18D3D0]/20 bg-[#041615]/72 p-5">
      <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
        AI Coach
      </p>

      <h2 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.04em] text-white">
        {data.coach.title}
      </h2>

      <p className="mt-4 text-[14px] font-semibold leading-7 text-white/70">
        {data.coach.message}
      </p>

      <div className="mt-5 rounded-[22px] border border-[#93C572]/20 bg-[#93C572]/5 p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#93C572]">
          Next Best Action
        </p>
        <p className="mt-2 text-[16px] font-black leading-6 text-white">
          {data.coach.action}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to="/nutrition"
          className="inline-flex rounded-2xl bg-[#93C572] px-5 py-3 text-[13px] font-black text-[#07110A]"
        >
          View Nutrition Plan
        </Link>
        <Link
          to="/progress#daily-log"
          className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white/85"
        >
          Add Daily Log
        </Link>
      </div>
    </div>
  );
}

function TodaysMealsCard({ meals }: { meals: MealPreview[] }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#061009]/72 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#93C572]">
            Today’s Meals
          </p>
          <h2 className="mt-2 text-[28px] font-black tracking-[-0.05em] text-white">
            Eat this today
          </h2>
        </div>

        <Link to="/nutrition" className="text-[13px] font-black text-[#93C572]">
          Full meal calendar →
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {meals.map((meal) => (
          <MealRow key={meal.label} meal={meal} />
        ))}
      </div>
    </div>
  );
}

function MealRow({ meal }: { meal: MealPreview }) {
  const Icon = meal.icon;

  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-start gap-4">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border"
          style={{
            color: meal.color,
            borderColor: `${meal.color}33`,
            backgroundColor: `${meal.color}10`,
          }}
        >
          <Icon size={22} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-black text-white">{meal.label}</p>
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold text-white/50">
              {meal.time}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-[14px] font-semibold leading-6 text-white/68">
            {meal.name}
          </p>
        </div>
      </div>
    </div>
  );
}

function TodaysProgressCard({ data }: { data: DashboardData }) {
  const progress = [
    {
      label: "Calories",
      value: data.metabolic.targetCalories
        ? data.metabolic.targetCalories.toLocaleString()
        : "—",
      sub: "target",
      icon: Flame,
      color: "#F5B942",
    },
    {
      label: "Protein",
      value: data.metabolic.protein ? `${data.metabolic.protein}g` : "—",
      sub: "target",
      icon: Utensils,
      color: "#93C572",
    },
    {
      label: "Water",
      value: data.metabolic.water,
      sub: "target",
      icon: Droplets,
      color: "#18D3D0",
    },
    {
      label: "Goal Alignment",
      value: data.adherence.goalAlignment ? `${data.adherence.goalAlignment}%` : "—",
      sub: "plan fit",
      icon: Target,
      color: "#A875FF",
    },
  ];

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#061009]/72 p-5">
      <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
        Today’s Progress
      </p>
      <h2 className="mt-2 text-[28px] font-black tracking-[-0.05em] text-white">
        Track only what matters
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {progress.map((item) => (
          <ProgressTile key={item.label} {...item} />
        ))}
      </div>

      <p className="mt-5 rounded-[18px] border border-[#F5B942]/25 bg-[#2A1A05]/45 px-4 py-3 text-[13px] font-semibold leading-6 text-white/65">
        Real consumed calories, protein, steps and adherence come from daily
        progress logs and scanner history. Add today’s log to unlock
        expected-vs-actual intelligence.
      </p>
    </div>
  );
}

function ProgressTile({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-black text-white/55">{label}</p>
        <Icon size={18} style={{ color }} />
      </div>

      <p className="text-[26px] font-black leading-none text-white">{value}</p>
      <p className="mt-2 text-[12px] font-bold" style={{ color }}>
        {sub}
      </p>
    </div>
  );
}

function QuickAccessGrid({ isNewUser }: { isNewUser: boolean }) {
  const items = [
    {
      title: isNewUser ? "Generate Plan" : "Update Plan",
      text: "Change profile or generate a new plan.",
      to: "/dashboard/onboarding",
      icon: Sparkles,
      color: "#93C572",
    },
    {
      title: "Scan Food",
      text: "Analyze food with AI Vision.",
      to: "/scanner",
      icon: ScanLine,
      color: "#18D3D0",
    },
    {
      title: "Progress",
      text: "Add daily log and view trends.",
      to: "/progress#daily-log",
      icon: LineChart,
      color: "#F5B942",
    },
    {
      title: "Reports",
      text: "Open wellness report.",
      to: "/reports",
      icon: Activity,
      color: "#A875FF",
    },
  ];

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.to}
          className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#93C572]/30 hover:bg-white/[0.055]"
        >
          <item.icon size={22} style={{ color: item.color }} />
          <p className="mt-3 text-[15px] font-black text-white">
            {item.title}
          </p>
          <p className="mt-1 text-[12px] font-semibold leading-5 text-white/55">
            {item.text}
          </p>
        </Link>
      ))}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "GOOD MORNING";
  if (hour < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}
