import type { ElementType, ReactNode } from "react";
import Image from "@/compat/NextImage";
import { Link } from "react-router-dom";
import {
  Activity,
  CalendarCheck,
  Camera,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Flame,
  Footprints,
  Leaf,
  LineChart,
  Moon,
  Sparkles,
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
    bmi?: number;
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
  calories: string;
  protein: string;
  image: string;
  icon: ElementType;
  color: string;
  completed: boolean;
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
    waterNumber: number;
    expectedChange: string;
  };
  adherence: {
    overall: number;
    nutritionConsistency: number;
    goalAlignment: number;
    programCompletion: number;
    status: string;
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
const BLUE = "#4BA3FF";

const mealImageMap = {
  breakfast: "/assets/scanner/egg-white-veggie-bowl.png",
  lunch: "/assets/scanner/grilled-chicken-brown-rice.png",
  snack: "/assets/scanner/chickpea-veg-power-bowl.png",
  dinner: "/assets/scanner/grilled-fish-steamed-veg.png",
};

const fallbackData: DashboardData = {
  user: {
    name: "User",
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
    waterNumber: 0,
    expectedChange: "Generate plan first",
  },
  adherence: {
    overall: 0,
    nutritionConsistency: 0,
    goalAlignment: 0,
    programCompletion: 0,
    status: "Needs profile",
  },
  meals: [
    {
      label: "Breakfast",
      time: "8:00 AM",
      name: "Generate a plan to view breakfast",
      calories: "—",
      protein: "—",
      image: mealImageMap.breakfast,
      icon: Flame,
      color: WARNING,
      completed: false,
    },
    {
      label: "Lunch",
      time: "1:00 PM",
      name: "Generate a plan to view lunch",
      calories: "—",
      protein: "—",
      image: mealImageMap.lunch,
      icon: Utensils,
      color: TEAL,
      completed: false,
    },
    {
      label: "Snack",
      time: "4:30 PM",
      name: "Generate a plan to view snack",
      calories: "—",
      protein: "—",
      image: mealImageMap.snack,
      icon: Sparkles,
      color: WARNING,
      completed: false,
    },
    {
      label: "Dinner",
      time: "8:30 PM",
      name: "Generate a plan to view dinner",
      calories: "—",
      protein: "—",
      image: mealImageMap.dinner,
      icon: Moon,
      color: PURPLE,
      completed: false,
    },
  ],
  coach: {
    title: "AI Coach",
    message:
      "Generate your first AI nutrition plan to unlock meals, targets, progress and coach actions.",
    action: "Complete your profile to unlock today's AI recommendation.",
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

function round(value: number, digits = 0) {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clampScore(value: unknown, fallback = 0) {
  const numberValue = Number(value ?? fallback);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(Math.max(Math.round(numberValue), 0), 100);
}

function parseWaterNumber(value?: string, fallback = 2.5) {
  const match = value?.match(/[\d.]+/);
  if (!match) return fallback;
  return Number(match[0]);
}

function parseWaterTarget(value?: string, fallback = 2.5) {
  return `${parseWaterNumber(value, fallback)}L`;
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
    if (dailyDifference <= 0) return "Maintenance target";
    return `~${round(weeklyKg, 1)} kg/week loss`;
  }

  if (normalizedGoal.includes("muscle")) return "Muscle support target";

  return "Maintenance target";
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
      calories: "320 kcal",
      protein: "24g Protein",
      image: mealImageMap.breakfast,
      icon: Flame,
      color: WARNING,
      completed: true,
    },
    {
      label: "Lunch",
      time: "1:00 PM",
      name: mealName(dayOne, "lunch") || fallbackData.meals[1].name,
      calories: "520 kcal",
      protein: "42g Protein",
      image: mealImageMap.lunch,
      icon: Utensils,
      color: TEAL,
      completed: true,
    },
    {
      label: "Snack",
      time: "4:30 PM",
      name: mealName(dayOne, "snack") || fallbackData.meals[2].name,
      calories: "220 kcal",
      protein: "12g Protein",
      image: mealImageMap.snack,
      icon: Sparkles,
      color: WARNING,
      completed: true,
    },
    {
      label: "Dinner",
      time: "8:30 PM",
      name: mealName(dayOne, "dinner") || fallbackData.meals[3].name,
      calories: "480 kcal",
      protein: "35g Protein",
      image: mealImageMap.dinner,
      icon: Moon,
      color: PURPLE,
      completed: false,
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

  const bmi = analytics.bmi
    ? round(Number(analytics.bmi), 1)
    : calculateBmi(weight, height);

  const bmr = calculateBmr({ weight, height, age, gender });
  const tdee = bmr ? Math.round(bmr * getActivityFactor(profile.activity)) : 0;
  const targetCalories = Number(targets.calories || 0);

  const fallbackAdherence = clampScore(analytics.health_score, 82);
  const overall = clampScore(analytics.wellness_adherence, fallbackAdherence || 82);
  const nutritionConsistency = clampScore(
    analytics.nutrition_consistency,
    overall || 82,
  );
  const goalAlignment = clampScore(analytics.goal_alignment, overall || 91);
  const programCompletion = clampScore(
    analytics.program_completion,
    plan.meal_plan?.days?.length ? 56 : 0,
  );

  const waterNumber = parseWaterNumber(
    targets.water_target,
    profile.water_intake || 2.5,
  );

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
      waterNumber,
      expectedChange: getExpectedChange(profile.goal, tdee, targetCalories),
    },
    adherence: {
      overall,
      nutritionConsistency,
      goalAlignment,
      programCompletion,
      status: getAdherenceStatus(overall),
    },
    meals: buildMealPreview(plan),
    coach: {
      title: "AI Coach",
      message:
        plan.ai_tip ||
        plan.coach_message ||
        plan.health_insight ||
        "Your protein intake is improving. Focus on hydration today and keep meals consistent.",
      action:
        targets.water_target
          ? "Drink 500ml more water to hit your hydration goal."
          : "Complete your daily nutrition check-in.",
    },
  };
}

function getAdherenceStatus(score: number) {
  if (!score) return "Needs logs";
  if (score >= 85) return "Excellent";
  if (score >= 70) return "On Track";
  return "Needs Focus";
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function AIHealthCommandCenter() {
  const data = buildDashboardData();

  return (
    <section className="relative overflow-hidden bg-[#030805] px-3 py-4 pb-24 text-[#F5F8F2] sm:px-5 lg:px-6 xl:px-8 2xl:px-10 md:pb-6">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-hidden rounded-[34px] border border-[#93C572]/18 bg-[#030805] shadow-[0_0_82px_rgba(147,197,114,0.075)]">
        <BackgroundFX />
        <div className="relative z-10 px-5 py-5 sm:px-7 lg:px-9 xl:px-12 2xl:px-14">
          <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr_1.02fr] xl:items-stretch">
            <div>
              <WelcomeHeader data={data} />
              <AdherenceSummary data={data} />
              <MetabolicProfileCard data={data} />
            </div>

            <HumanMeshPanel />

            <div className="grid gap-5 xl:grid-rows-[150px_1fr]">
              <AIStatusCard />
              <CoachActionCard data={data} />
            </div>
          </div>

          <TodaysMealsCard meals={data.meals} />

          <div className="mt-4 grid gap-5 xl:grid-cols-[0.96fr_1fr]">
            <TodaysProgressCard data={data} />
            <QuickAccessGrid />
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(147,197,114,0.11),transparent_31%),radial-gradient(circle_at_82%_32%,rgba(24,211,208,0.065),transparent_32%),radial-gradient(circle_at_16%_72%,rgba(147,197,114,0.055),transparent_31%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(147,197,114,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.12)_1px,transparent_1px)] [background-size:86px_86px]" />
    </>
  );
}

function WelcomeHeader({ data }: { data: DashboardData }) {
  return (
    <div>
      <h1 className="text-[33px] font-black tracking-[-0.05em] text-white sm:text-[40px] xl:text-[34px] 2xl:text-[42px]">
        {getGreeting()}, {data.user.name}! 👋
      </h1>

      <p className="mt-2 text-[16px] font-semibold leading-6 text-white/70">
        You’re doing great! Keep building healthy habits.
      </p>
    </div>
  );
}

function AdherenceSummary({ data }: { data: DashboardData }) {
  const cards = [
    {
      label: "Wellness Adherence",
      value: data.adherence.overall || 82,
      sub: data.adherence.status,
      delta: "+12% vs last week",
      color: PRIMARY,
    },
    {
      label: "Program Completion",
      value: data.adherence.programCompletion || 56,
      sub: "In Progress",
      delta: "+8% vs last week",
      color: WARNING,
    },
    {
      label: "Goal Alignment",
      value: data.adherence.goalAlignment || 91,
      sub: "Excellent",
      delta: "+15% vs last week",
      color: PRIMARY,
    },
  ];

  return (
    <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <MiniRingCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function MiniRingCard({
  label,
  value,
  sub,
  delta,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  delta: string;
  color: string;
}) {
  return (
    <div className="flex min-h-[226px] min-w-0 flex-col overflow-visible rounded-[22px] border border-white/10 bg-[#061009]/78 px-4 py-5 shadow-[inset_0_0_28px_rgba(147,197,114,0.025)]">
      <p className="min-h-[40px] text-[13px] font-black leading-5 text-white/92">
        {label}
      </p>

      <div className="mt-3 flex flex-1 flex-col items-center justify-center text-center">
        <ProgressRing value={value} size={92} stroke={10} color={color}>
          <p className="text-[18px] font-black leading-none text-white">
            {value}%
          </p>
        </ProgressRing>

        <p className="mt-4 text-[15px] font-black leading-5" style={{ color }}>
          {sub}
        </p>
        <p className="mt-1 max-w-[110px] text-[12px] font-semibold leading-5 text-white/50">
          {delta}
        </p>
      </div>
    </div>
  );
}

function HumanMeshPanel() {
  return (
    <div className="relative hidden h-full min-h-[620px] overflow-visible rounded-[30px] xl:block">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_64%,rgba(147,197,114,0.2),transparent_48%)]" />

      <Image
        src="/assets/howman.png"
        alt="AI body mesh"
        width={820}
        height={960}
        priority
        className="absolute left-1/2 top-[66%] z-10 w-[620px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_78px_rgba(147,197,114,0.32)] 2xl:w-[720px]"
      />
    </div>
  );
}

function AIStatusCard() {
  return (
    <div className="relative h-full min-h-[150px] overflow-hidden rounded-[24px] border border-[#18D3D0]/16 bg-[#061009]/78 p-5">
      <div className="relative z-10 max-w-[280px]">
        <p className="text-[18px] font-black text-white">
          AI Status{" "}
          <span className="ml-2 text-[14px] font-black text-[#93C572]">
            ● Active
          </span>
        </p>

        <p className="mt-4 text-[16px] font-semibold leading-7 text-white/64">
          Your AI is learning and optimizing your plan in real-time.
        </p>
      </div>

      <Image
        src="/assets/dashboard-ai-status-brain.png"
        alt="AI brain status"
        width={240}
        height={240}
        className="absolute bottom-[-38px] right-2 w-[180px] opacity-88"
      />
    </div>
  );
}

function MetabolicProfileCard({ data }: { data: DashboardData }) {
  const rows = [
    {
      label: "BMR",
      value: data.metabolic.bmr ? `${data.metabolic.bmr.toLocaleString()} kcal` : "—",
      icon: Flame,
      color: WARNING,
    },
    {
      label: "TDEE",
      value: data.metabolic.tdee ? `${data.metabolic.tdee.toLocaleString()} kcal` : "—",
      icon: Activity,
      color: PRIMARY,
    },
    {
      label: "Protein Target",
      value: data.metabolic.protein ? `${data.metabolic.protein} g / day` : "—",
      icon: Leaf,
      color: PRIMARY,
    },
    {
      label: "Water Target",
      value: `${data.metabolic.water} / day`,
      icon: Droplets,
      color: TEAL,
    },
    {
      label: "Expected Weekly Change",
      value: data.metabolic.expectedChange,
      icon: Weight,
      color: PURPLE,
    },
  ];

  return (
    <div className="mt-6 rounded-[26px] border border-[#93C572]/16 bg-[#061009]/78 p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#93C572]/12 text-[#93C572]">
          <Flame size={23} />
        </div>

        <div>
          <h2 className="text-[24px] font-black tracking-[-0.04em] text-white">
            Metabolic Profile
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-white/55">
            Your body at a glance
          </p>
        </div>
      </div>

      <div className="space-y-1">
        {rows.map((row) => (
          <MetabolicRow key={row.label} {...row} />
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-[12px] font-black text-[#93C572] transition hover:bg-[#93C572]/10"
        >
          View Full Details
          <ChevronDown className="-rotate-90" size={15} />
        </Link>
      </div>
    </div>
  );
}

function MetabolicRow({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/7 py-3.5 last:border-b-0">
      <div className="flex items-center gap-3">
        <Icon size={19} style={{ color }} />
        <p className="text-[15px] font-semibold text-white/72">{label}</p>
      </div>

      <p className="text-right text-[15px] font-black text-white">{value}</p>
    </div>
  );
}

function CoachActionCard({ data }: { data: DashboardData }) {
  return (
    <div className="relative flex h-full min-h-[374px] overflow-hidden rounded-[28px] border border-[#93C572]/24 bg-[#061009]/82 p-5 shadow-[inset_0_0_42px_rgba(147,197,114,0.035)] sm:p-6">
      <div className="pointer-events-none absolute -right-10 bottom-[-45px] h-[360px] w-[360px] rounded-full bg-[#93C572]/14 blur-[58px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[58%] bg-[radial-gradient(circle_at_68%_58%,rgba(147,197,114,0.2),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,9,0.98)_0%,rgba(6,16,9,0.9)_44%,rgba(6,16,9,0.18)_78%,rgba(6,16,9,0.05)_100%)]" />

      <div className="relative z-20 flex w-full max-w-[54%] flex-col justify-between pr-2 xl:max-w-[56%] 2xl:max-w-[52%]">
        <div>
          <p className="flex items-center gap-2 text-[22px] font-black tracking-[-0.035em] text-white">
            <Sparkles size={23} className="text-[#93C572]" />
            {data.coach.title}
          </p>

          <p className="mt-1 text-[13px] font-semibold text-white/58">
            Your personal wellness guide
          </p>

          <div className="mt-7 rounded-[22px] border border-white/10 bg-black/28 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)]">
            <p className="text-[14px] font-black text-[#93C572]">Today’s Win</p>
            <p className="mt-3 text-[18px] font-semibold leading-7 text-white">
              Protein intake improved for 3 consecutive days. 💚
            </p>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="flex items-center gap-2 text-[14px] font-black text-[#18D3D0]">
                <Droplets size={18} />
                Focus Today
              </p>
              <p className="mt-2 text-[15px] font-semibold leading-7 text-white/74">
                {data.coach.action}
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/nutrition"
          className="mt-5 inline-flex w-fit min-w-[210px] items-center justify-center gap-2 rounded-2xl bg-[#93C572] px-7 py-3.5 text-[14px] font-black text-[#07110A] shadow-[0_0_28px_rgba(147,197,114,0.2)] transition hover:bg-[#A4D08A]"
        >
          View AI Suggestions
          <ChevronDown className="-rotate-90" size={16} />
        </Link>
      </div>

      <div className="pointer-events-none absolute bottom-[-4px] right-[-6px] z-10 hidden h-[345px] w-[305px] sm:block 2xl:h-[390px] 2xl:w-[350px]">
        <div className="absolute bottom-5 right-8 h-[215px] w-[215px] rounded-full border border-[#93C572]/22 bg-[#93C572]/8 shadow-[0_0_58px_rgba(147,197,114,0.18)] 2xl:h-[250px] 2xl:w-[250px]" />
        <Image
          src="/assets/AI-girl.png"
          alt="AI coach"
          width={620}
          height={620}
          className="absolute bottom-0 right-0 h-full w-full object-contain object-bottom drop-shadow-[0_0_58px_rgba(147,197,114,0.22)]"
        />
      </div>
    </div>
  );
}

function TodaysMealsCard({ meals }: { meals: MealPreview[] }) {
  return (
    <div className="mt-4 rounded-[28px] border border-[#93C572]/14 bg-[#061009]/78 p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[25px] font-black tracking-[-0.04em] text-white">
            Today’s Meals
          </h2>
          <p className="text-[14px] font-semibold text-white/58">
            Track, log and improve your daily nutrition
          </p>
        </div>

        <Link to="/nutrition" className="text-[13px] font-black text-[#93C572]">
          View Full Plan →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[repeat(5,minmax(0,1fr))]">
        {meals.map((meal) => (
          <MealCard key={meal.label} meal={meal} />
        ))}

        <Link
          to="/scanner"
          className="flex min-h-[205px] flex-col items-center justify-center rounded-[22px] border border-dashed border-white/18 bg-black/18 p-4 text-center transition hover:border-[#93C572]/35 hover:bg-[#93C572]/5"
        >
          <div className="grid h-16 w-16 place-items-center rounded-full border border-white/25 text-white/75">
            <span className="text-[34px] leading-none">+</span>
          </div>
          <p className="mt-4 text-[18px] font-semibold text-white/80">
            Add Meal / Snack
          </p>
          <p className="mt-1 text-[14px] font-semibold leading-6 text-white/45">
            Log your food
            <br />
            or scan to add
          </p>
        </Link>
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: MealPreview }) {
  const Icon = meal.icon;

  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-[22px] border border-white/10 bg-black/24 p-4">
      <Image
        src={meal.image}
        alt={meal.name}
        width={320}
        height={220}
        className="absolute inset-x-0 top-7 mx-auto h-[116px] w-[90%] object-contain opacity-95 drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icon size={19} style={{ color: meal.color }} />
            <p className="text-[14px] font-black text-white">{meal.label}</p>
          </div>
          <p className="mt-1 text-[12px] font-semibold text-white/55">
            {meal.time}
          </p>
        </div>

        {meal.completed ? (
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#93C572] text-[#07110A]">
            <CheckCircle2 size={18} />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full border border-white/25" />
        )}
      </div>

      <div className="relative z-10 mt-[115px]">
        <p className="line-clamp-1 text-[16px] font-black text-white">
          {meal.name}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[14px] font-semibold text-white/78">
            {meal.calories}
          </p>
          <p className="text-[14px] font-black text-[#93C572]">
            {meal.protein}
          </p>
        </div>
      </div>
    </div>
  );
}

function TodaysProgressCard({ data }: { data: DashboardData }) {
  const calorieActual = data.metabolic.targetCalories
    ? Math.round(data.metabolic.targetCalories * 0.8)
    : 0;

  const proteinActual = data.metabolic.protein
    ? Math.round(data.metabolic.protein * 0.77)
    : 0;

  const waterActual = data.metabolic.waterNumber
    ? round(data.metabolic.waterNumber * 0.76, 1)
    : 0;

  return (
    <div className="rounded-[28px] border border-[#18D3D0]/12 bg-[#061009]/78 p-5">
      <h2 className="text-[25px] font-black tracking-[-0.04em] text-white">
        Today’s Progress
      </h2>
      <p className="mt-1 text-[14px] font-semibold text-white/58">
        You vs Your Daily Goals
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <BigProgressRing
          label="Calories"
          value={calorieActual}
          total={data.metabolic.targetCalories || 2061}
          display={`${calorieActual || "—"}`}
          sub={`/${data.metabolic.targetCalories || "—"} kcal`}
          color={PRIMARY}
          icon={Flame}
        />

        <BigProgressRing
          label="Protein"
          value={proteinActual}
          total={data.metabolic.protein || 93}
          display={`${proteinActual || "—"}g`}
          sub={`/${data.metabolic.protein || "—"}g`}
          color={TEAL}
          icon={Leaf}
        />

        <BigProgressRing
          label="Water"
          value={waterActual}
          total={data.metabolic.waterNumber || 2.5}
          display={`${waterActual || "—"}L`}
          sub={`/${data.metabolic.water || "—"}`}
          color={BLUE}
          icon={Droplets}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SmallProgressTile
          label="Steps"
          value="7,842"
          sub="/10,000 steps"
          icon={Footprints}
          color={PRIMARY}
          percent={78}
        />

        <SmallProgressTile
          label="Active Minutes"
          value="46"
          sub="/60 min"
          icon={Activity}
          color={BLUE}
          percent={76}
        />
      </div>
    </div>
  );
}

function BigProgressRing({
  label,
  value,
  total,
  display,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  total: number;
  display: string;
  sub: string;
  color: string;
  icon: ElementType;
}) {
  const percent = total ? Math.min(Math.round((value / total) * 100), 100) : 0;

  return (
    <div className="flex flex-col items-center text-center">
      <ProgressRing value={percent} size={142} stroke={11} color={color}>
        <div className="text-center">
          <p className="text-[26px] font-black leading-none text-white">
            {display}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-white/55">{sub}</p>
        </div>
      </ProgressRing>

      <div className="mt-3 flex items-center gap-2">
        <Icon size={17} style={{ color }} />
        <p className="text-[14px] font-black text-white/82">{label}</p>
      </div>
    </div>
  );
}

function SmallProgressTile({
  label,
  value,
  sub,
  icon: Icon,
  color,
  percent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: ElementType;
  color: string;
  percent: number;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-black/18 p-4">
      <div className="flex items-center gap-3">
        <Icon size={25} style={{ color }} />

        <div>
          <p className="text-[13px] font-semibold text-white/58">{label}</p>
          <p className="mt-1 text-[25px] font-black leading-none text-white">
            {value}
          </p>
          <p className="mt-1 text-[12px] font-semibold text-white/48">{sub}</p>
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function QuickAccessGrid() {
  const items = [
    {
      title: "Update Plan",
      text: "Adjust your goals and preferences",
      to: "/dashboard/onboarding",
      icon: CalendarCheck,
      color: PRIMARY,
    },
    {
      title: "Scan Food",
      text: "Scan and analyze your food",
      to: "/scanner",
      icon: Camera,
      color: TEAL,
    },
    {
      title: "Log Progress",
      text: "Track your weight, sleep & more",
      to: "/progress#daily-log",
      icon: LineChart,
      color: PURPLE,
    },
    {
      title: "View Reports",
      text: "See detailed insights",
      to: "/reports",
      icon: Activity,
      color: WARNING,
    },
  ];

  return (
    <div className="rounded-[28px] border border-[#93C572]/14 bg-[#061009]/78 p-5">
      <h2 className="text-[25px] font-black tracking-[-0.04em] text-white">
        Quick Actions
      </h2>
      <p className="mt-1 text-[14px] font-semibold text-white/58">
        Shortcuts to the features you use most
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="rounded-[22px] border p-5 text-center transition hover:-translate-y-1"
            style={{
              borderColor: `${item.color}40`,
              background: `linear-gradient(145deg, ${item.color}12, rgba(255,255,255,0.025))`,
            }}
          >
            <item.icon size={38} style={{ color: item.color }} className="mx-auto" />
            <p className="mt-5 text-[20px] font-black" style={{ color: item.color }}>
              {item.title}
            </p>
            <p className="mx-auto mt-2 max-w-[150px] text-[14px] font-semibold leading-6 text-white/55">
              {item.text}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProgressRing({
  value,
  size,
  stroke,
  color,
  children,
}: {
  value: number;
  size: number;
  stroke: number;
  color: string;
  children?: ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        {children || (
          <p className="text-[13px] font-black text-white">{value}%</p>
        )}
      </div>
    </div>
  );
}
