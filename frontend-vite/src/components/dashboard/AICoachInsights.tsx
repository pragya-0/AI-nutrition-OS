import { useEffect, useMemo, useState, type ElementType } from "react";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Flame,
  HeartPulse,
  Moon,
  Send,
  ShieldCheck,
  Sparkles,
  Utensils,
  X,
  Zap,
} from "lucide-react";

const AI_GIRL_IMAGE = "/assets/ai-coach2.png";
const BULB_IMAGE = "/assets/Bulb.png";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  priority: string;
  color: string;
  icon: ElementType;
};

type Habit = {
  id: string;
  label: string;
  completed: boolean;
  icon: ElementType;
};

type CoachPlan = {
  success?: boolean;
  blocked?: boolean;
  message?: string;
  medical_risk?: {
    block_reason?: string;
    warnings?: string[];
    hard_block?: boolean;
  };
  user_profile?: {
    name?: string;
    goal?: string;
    diet?: string;
    activity?: string;
    sleep_hours?: number;
    water_intake?: number;
  };
  analytics?: {
    health_score?: number;
    sleep_score?: number;
    hydration_score?: number;
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
  coach_message?: string;
  ai_tip?: string;
  health_insight?: string;
};

type CoachData = {
  blocked: boolean;
  name: string;
  goal: string;
  diet: string;
  activity: string;
  healthScore: number;
  sleepScore: number;
  hydrationScore: number;
  protein: number;
  calories: number;
  waterTarget: string;
  message: string;
  insight: string;
  dailyPriority: string;
  predictedImpact: string;
  learnedPatterns: string[];
  recommendations: Recommendation[];
  habits: Habit[];
};

function getStoredCoachPlan(): CoachPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    return raw ? (JSON.parse(raw) as CoachPlan) : null;
  } catch {
    return null;
  }
}

function getStoredBlockedCoachResponse(): CoachPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_blocked_response");
    return raw ? (JSON.parse(raw) as CoachPlan) : null;
  } catch {
    return null;
  }
}

function formatLabel(value?: string) {
  if (!value) return "your goal";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildRecommendations(data: {
  goal: string;
  protein: number;
  waterTarget: string;
  sleepScore: number;
  hydrationScore: number;
  calories: number;
}): Recommendation[] {
  return [
    {
      id: "protein",
      title: "Hit Protein Target",
      description: data.protein
        ? `Spread ${data.protein}g protein across meals instead of relying on one heavy meal.`
        : "Generate a plan to unlock your protein target.",
      priority: "High Priority",
      color: "#A6FF4D",
      icon: Utensils,
    },
    {
      id: "hydration",
      title: "Track Hydration",
      description: `Work toward ${data.waterTarget}. Dashboard accuracy improves when water is logged.`,
      priority: data.hydrationScore < 75 ? "High Priority" : "Medium Priority",
      color: "#18D3D0",
      icon: Droplets,
    },
    {
      id: "sleep",
      title: "Protect Recovery",
      description:
        data.sleepScore < 75
          ? "Sleep score is low. Keep a consistent sleep window before changing food targets."
          : "Recovery looks stable. Keep sleep timing consistent.",
      priority: data.sleepScore < 75 ? "High Priority" : "Medium Priority",
      color: "#A875FF",
      icon: Moon,
    },
    {
      id: "movement",
      title: "Post-Meal Movement",
      description: `A 10–20 min walk after meals can support your ${data.goal.toLowerCase()} plan.`,
      priority: "Low Priority",
      color: "#FFB347",
      icon: Dumbbell,
    },
  ];
}

function buildHabits(data: {
  protein: number;
  waterTarget: string;
  goal: string;
}): Habit[] {
  return [
    {
      id: "water",
      label: `Water ${data.waterTarget}`,
      completed: false,
      icon: Droplets,
    },
    {
      id: "protein",
      label: data.protein ? `Protein ${data.protein}g` : "Protein target",
      completed: false,
      icon: Dumbbell,
    },
    {
      id: "meal",
      label: "Follow plan meals",
      completed: false,
      icon: Utensils,
    },
    { id: "walk", label: "Post-meal walk", completed: false, icon: Zap },
    { id: "sleep", label: "Sleep routine", completed: false, icon: Moon },
  ];
}

function buildDailyPriority(data: {
  protein: number;
  waterTarget: string;
  sleepScore: number;
  hydrationScore: number;
  goal: string;
}) {
  if (!data.protein) {
    return "Generate your first plan so the coach can identify today’s strongest nutrition priority.";
  }

  if (data.hydrationScore && data.hydrationScore < 72) {
    return `Hydration is today’s priority: work toward ${data.waterTarget} before adjusting calories or workouts.`;
  }

  if (data.sleepScore && data.sleepScore < 72) {
    return "Recovery is today’s priority: protect sleep timing so the nutrition plan is easier to follow.";
  }

  return `Protein consistency is today’s priority: distribute ${data.protein}g across meals to support ${data.goal.toLowerCase()}.`;
}

function buildPredictedImpact(data: {
  healthScore: number;
  protein: number;
  sleepScore: number;
  hydrationScore: number;
}) {
  if (!data.healthScore) {
    return "Expected impact appears after plan generation and real user logs.";
  }

  const weakAreas = [
    data.protein ? 0 : 1,
    data.sleepScore < 75 ? 1 : 0,
    data.hydrationScore < 75 ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0);

  const potentialGain = weakAreas >= 2 ? 8 : weakAreas === 1 ? 5 : 3;

  return `If today’s priority is completed consistently, the dashboard can reasonably target +${potentialGain} wellness-score points over the next tracking cycle.`;
}

function buildLearnedPatterns(data: {
  goal: string;
  diet: string;
  activity: string;
  protein: number;
  calories: number;
  waterTarget: string;
  sleepScore: number;
  hydrationScore: number;
}) {
  if (!data.calories && !data.protein) {
    return [
      "AI has not learned your nutrition baseline yet.",
      "Complete assessment and generate a plan to activate behavior insights.",
      "Scanner and progress logs will improve coach accuracy over time.",
    ];
  }

  const patterns = [
    `${data.goal} users usually need consistency more than extreme restriction; this plan is built around repeatable daily actions.`,
    `${data.diet} meals should be checked for protein distribution, not just total calories.`,
    `Hydration target is ${data.waterTarget}; missing this can make hunger, fatigue, and adherence feel worse.`,
  ];

  if (data.sleepScore && data.sleepScore < 75) {
    patterns.push(
      "Recovery is a weak signal right now, so sleep timing should be protected before increasing workout intensity.",
    );
  }

  if (data.hydrationScore && data.hydrationScore < 75) {
    patterns.push(
      "Hydration is below ideal range, so water logging is likely the fastest improvement lever today.",
    );
  }

  return patterns.slice(0, 4);
}

function getCoachData(): CoachData {
  const blocked = getStoredBlockedCoachResponse();
  const plan = getStoredCoachPlan();

  if (blocked?.blocked) {
    return {
      blocked: true,
      name: "User",
      goal: "medical guidance required",
      diet: "Not available",
      activity: "Not available",
      healthScore: 0,
      sleepScore: 0,
      hydrationScore: 0,
      protein: 0,
      calories: 0,
      waterTarget: "Not available",
      message:
        blocked.message ||
        blocked.medical_risk?.block_reason ||
        "Medical guidance is required before AI coaching can be used.",
      insight:
        "AI Coach is disabled for this profile because recommendations should come from a qualified medical professional.",
      dailyPriority:
        "Consult a qualified healthcare professional before using nutrition or workout guidance.",
      predictedImpact:
        "AI predictions are disabled for this profile to reduce medical-risk exposure.",
      learnedPatterns: [
        "Safety gate active: AI coaching is blocked for this profile.",
        "No behavior pattern analysis is shown while medical guidance is required.",
        "Edit profile only if the medical or safety input was entered incorrectly.",
      ],
      recommendations: [],
      habits: [],
    };
  }

  const profile = plan?.user_profile || {};
  const analytics = plan?.analytics || {};
  const targets = plan?.targets || {};
  const goal = formatLabel(profile.goal);
  const sleepScore = analytics.sleep_score ?? analytics.health_score ?? 0;
  const hydrationScore =
    analytics.hydration_score ?? analytics.health_score ?? 0;
  const protein = targets.protein ?? 0;
  const calories = targets.calories ?? 0;
  const waterTarget = targets.water_target || `${profile.water_intake ?? 2.5}L`;

  const formattedDiet = formatLabel(profile.diet);
  const formattedActivity = formatLabel(profile.activity);
  const healthScore = analytics.health_score ?? 0;

  return {
    blocked: false,
    name: profile.name?.trim() || "User",
    goal,
    diet: formattedDiet,
    activity: formattedActivity,
    healthScore,
    sleepScore,
    hydrationScore,
    protein,
    calories,
    waterTarget,
    message:
      plan?.coach_message ||
      plan?.ai_tip ||
      "Generate a plan from your profile inputs to unlock personalized coach guidance.",
    insight:
      plan?.health_insight ||
      analytics.strategy_details?.reason ||
      "Your AI coach will become stronger after plan generation, scanner history, and progress logs.",
    dailyPriority: buildDailyPriority({
      protein,
      waterTarget,
      sleepScore,
      hydrationScore,
      goal,
    }),
    predictedImpact: buildPredictedImpact({
      healthScore,
      protein,
      sleepScore,
      hydrationScore,
    }),
    learnedPatterns: buildLearnedPatterns({
      goal,
      diet: formattedDiet,
      activity: formattedActivity,
      protein,
      calories,
      waterTarget,
      sleepScore,
      hydrationScore,
    }),
    recommendations: buildRecommendations({
      goal,
      protein,
      waterTarget,
      sleepScore,
      hydrationScore,
      calories,
    }),
    habits: buildHabits({ protein, waterTarget, goal }),
  };
}

export default function AICoachInsights() {
  const [coachData, setCoachData] = useState<CoachData>(() => getCoachData());
  const [input, setInput] = useState("");
  const [habits, setHabits] = useState<Habit[]>(() => getCoachData().habits);
  const [coachReply, setCoachReply] = useState("");

  useEffect(() => {
    const refresh = () => {
      const fresh = getCoachData();
      setCoachData(fresh);
      setHabits(fresh.habits);
    };

    window.addEventListener("storage", refresh);
    window.addEventListener("ai-plan-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ai-plan-updated", refresh);
    };
  }, []);

  const completedHabits = useMemo(
    () => habits.filter((habit) => habit.completed).length,
    [habits],
  );
  const habitProgress = habits.length
    ? Math.round((completedHabits / habits.length) * 100)
    : 0;

  const handleSend = () => {
    if (!input.trim()) return;

    if (coachData.blocked) {
      setCoachReply(
        "AI Coach is disabled for this profile. Please consult a qualified healthcare professional.",
      );
      setInput("");
      return;
    }

    setCoachReply(
      "Live AI chat is not connected yet. For production safety, this box only records the question until a backend /coach/chat endpoint with medical guardrails is added.",
    );
    setInput("");
  };

  const toggleHabit = (habitId: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? { ...habit, completed: !habit.completed }
          : habit,
      ),
    );
  };

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[1780px] overflow-visible rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:p-6 lg:p-7 xl:p-8">
        <BackgroundFX />

        <div className="relative z-10">
          <Header />

          {coachData.blocked ? (
            <CoachSafetyBlockedNotice message={coachData.message} />
          ) : null}

          <div className="grid items-stretch gap-5 xl:grid-cols-[0.62fr_1fr]">
            <CoachAvatar />
            <CoachMessage data={coachData} />
          </div>

          <CoachLearningPanel data={coachData} />

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <RecommendationPanel data={coachData} />
            <TodayFocus data={coachData} />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.46fr]">
            <CoachInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              coachReply={coachReply}
            />
            <TipCard data={coachData} />
          </div>

          <HabitTracker
            habits={habits}
            completed={completedHabits}
            progress={habitProgress}
            onToggleHabit={toggleHabit}
          />
        </div>
      </div>
    </section>
  );
}

function CoachSafetyBlockedNotice({ message }: { message: string }) {
  return (
    <div className="mb-5 rounded-[24px] border border-[#FF6C7D]/35 bg-[#2A070D]/70 p-5 shadow-[0_0_40px_rgba(255,108,125,0.12)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#FF6C7D]/35 bg-[#FF6C7D]/10 text-[#FF6C7D]">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-[15px] font-black uppercase tracking-[0.18em] text-[#FF6C7D]">
            AI Coach Disabled
          </p>
          <p className="mt-2 max-w-[960px] text-[15px] font-semibold leading-7 text-white/82">
            {message}
          </p>
          <p className="mt-3 text-[13px] leading-6 text-white/55">
            AI Nutrition OS cannot answer medical, disease, medication,
            pregnancy, addiction, emergency, nutrition-plan, or workout-plan
            questions for this profile.
          </p>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="flex items-center gap-3 text-[30px] font-black uppercase leading-none tracking-[0.02em] sm:text-[36px] lg:text-[42px] xl:text-[48px]">
          AI Coach Insights
          <Sparkles className="text-[#A6FF4D]" size={26} />
        </h2>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
          Personalized guidance without fake AI-chat claims.
        </p>
      </div>

      <span className="inline-flex w-fit items-center gap-3 rounded-2xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/8 px-4 py-3 text-[13px] font-black text-[#A6FF4D]">
        <ShieldCheck size={16} />
        Production-safe coach
      </span>
    </div>
  );
}

function CoachAvatar() {
  return (
    <div className="relative min-h-[470px] overflow-hidden rounded-[24px] border border-white/10 bg-[#07110A]/70 p-4 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(24,211,208,.25),transparent_48%)]" />
      <div className="relative mx-auto -mt-3 grid h-[350px] max-w-[420px] place-items-center">
        <div className="absolute inset-3 rounded-full border border-[#18D3D0]/50 shadow-[0_0_55px_rgba(24,211,208,.34)]" />
        <div className="absolute inset-12 rounded-full border border-[#A6FF4D]/35" />
        <img
          src={AI_GIRL_IMAGE}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          alt="AI Coach Nutri"
          className="relative z-10 h-[420px] w-[420px] object-contain drop-shadow-[0_0_48px_rgba(24,211,208,.5)]"
        />
      </div>
      <div className="relative z-10 mt-2 text-center">
        <p className="text-[15px] font-black uppercase tracking-[0.18em] text-[#18D3D0]">
          AI Coach Nutri
        </p>
        <p className="mx-auto mt-2 max-w-[260px] text-[14px] leading-6 text-white/70">
          Goal-aware nutrition and lifestyle guidance
        </p>
      </div>
    </div>
  );
}

function CoachMessage({ data }: { data: CoachData }) {
  const notices = [
    {
      icon: HeartPulse,
      title: "Health score",
      text: `${data.healthScore}/100 from the latest plan or logs.`,
      color: "#A6FF4D",
    },
    {
      icon: Flame,
      title: "Calorie target",
      text: data.calories
        ? `${data.calories.toLocaleString()} kcal for ${data.goal}.`
        : "Generate a plan to set calories.",
      color: "#FFB347",
    },
    {
      icon: Dumbbell,
      title: "Protein target",
      text: data.protein
        ? `${data.protein}g protein across the day.`
        : "Protein target pending.",
      color: "#A6FF4D",
    },
    {
      icon: Droplets,
      title: "Hydration",
      text: `Target: ${data.waterTarget}.`,
      color: "#18D3D0",
    },
  ];

  return (
    <div className="min-h-[470px] rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="text-[25px] font-black tracking-[-0.04em] text-white xl:text-[30px]">
            Hi, <span className="text-[#A6FF4D]">{data.name}</span>
          </h3>
          <p className="mt-2 text-[14px] leading-6 text-white/70">
            Your coach summary is generated from your active profile, latest
            plan, and safety state.
          </p>
        </div>
        <span className="rounded-xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/8 px-3 py-2 text-[11px] font-black text-[#A6FF4D]">
          Latest plan
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-[#A6FF4D]/30 bg-[#A6FF4D]/5 px-4 py-3 text-[13px] font-medium leading-6 text-white/80">
        {data.message}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {notices.map((notice) => {
          const Icon = notice.icon;
          return (
            <div
              key={notice.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <Icon size={20} style={{ color: notice.color }} />
              <p className="mt-3 text-[13px] font-black text-white">
                {notice.title}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-white/65">
                {notice.text}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 rounded-2xl border border-[#18D3D0]/20 bg-[#18D3D0]/5 p-4 text-[13px] font-semibold leading-6 text-white/75">
        {data.insight}
      </p>
    </div>
  );
}

function CoachLearningPanel({ data }: { data: CoachData }) {
  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr_0.8fr]">
      <div className="rounded-[24px] border border-[#A6FF4D]/20 bg-[#07110A]/70 p-5 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]">
        <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          <Zap size={17} />
          Today&apos;s Priority
        </p>
        <p className="mt-4 text-[20px] font-black leading-tight tracking-[-0.04em] text-white">
          {data.dailyPriority}
        </p>
        <p className="mt-4 text-[12px] font-semibold leading-5 text-white/55">
          Priority is generated from the latest plan, goal, targets, hydration,
          and recovery signals. It is wellness guidance only.
        </p>
      </div>

      <div className="rounded-[24px] border border-[#18D3D0]/20 bg-[#07110A]/70 p-5 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]">
        <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.16em] text-[#18D3D0]">
          <Brain size={17} />
          What AI Learned
        </p>
        <div className="mt-4 grid gap-3">
          {data.learnedPatterns.map((pattern, index) => (
            <div
              key={`${index}-${pattern.slice(0, 18)}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <p className="text-[13px] font-semibold leading-6 text-white/75">
                {pattern}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#FFB347]/20 bg-[#07110A]/70 p-5 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]">
        <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.16em] text-[#FFB347]">
          <Flame size={17} />
          Expected Impact
        </p>
        <p className="mt-4 text-[16px] font-black leading-7 text-white">
          {data.predictedImpact}
        </p>
        <p className="mt-4 rounded-2xl border border-[#FFB347]/20 bg-[#2A1A05]/35 px-4 py-3 text-[12px] font-semibold leading-5 text-[#FFB347]">
          This is not a medical prediction. It is a wellness-product estimate
          for motivation and habit tracking.
        </p>
      </div>
    </div>
  );
}

function RecommendationPanel({ data }: { data: CoachData }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-6">
      <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        AI Recommendations For You
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {data.recommendations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex min-h-[140px] items-center gap-5 rounded-[20px] border border-white/10 bg-white/[0.04] p-5"
            >
              <div
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full border bg-white/[0.04]"
                style={{ borderColor: `${item.color}55`, color: item.color }}
              >
                <Icon size={28} />
              </div>
              <div>
                <h3 className="text-[17px] font-black text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-[14px] leading-6 text-white/65">
                  {item.description}
                </p>
                <span
                  className="mt-3 inline-flex rounded-lg border px-3 py-1.5 text-[11px] font-bold"
                  style={{ borderColor: `${item.color}55`, color: item.color }}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TodayFocus({ data }: { data: CoachData }) {
  const rows = [
    { label: "Goal", value: data.goal, icon: Brain },
    { label: "Diet", value: data.diet, icon: Utensils },
    { label: "Activity", value: data.activity, icon: Zap },
    { label: "Hydration", value: data.waterTarget, icon: Droplets },
  ];

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-6">
      <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        Today&apos;s Focus
      </p>
      <div className="mt-5 space-y-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="text-[#A6FF4D]" />
                <p className="text-[13px] font-bold text-white/70">
                  {row.label}
                </p>
              </div>
              <p className="text-right text-[13px] font-black text-white">
                {row.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoachInput({
  input,
  setInput,
  onSend,
  coachReply,
}: {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  coachReply: string;
}) {
  return (
    <div className="min-h-[140px] rounded-[24px] border border-white/10 bg-[#07110A]/70 p-6">
      <div className="flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSend();
          }}
          placeholder="Ask your AI Nutrition Coach..."
          className="min-w-0 flex-1 bg-transparent text-[18px] font-medium text-white outline-none placeholder:text-white/40"
        />
        <button
          onClick={() => setInput("")}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:text-[#FF6C7D]"
        >
          <X size={17} />
        </button>
        <button
          onClick={onSend}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#A6FF4D] text-black shadow-[0_0_30px_rgba(166,255,77,.35)] transition hover:scale-105"
        >
          <Send size={20} />
        </button>
      </div>

      <p className="mt-4 rounded-xl border border-[#FFB347]/20 bg-[#2A1A05]/35 px-4 py-3 text-[12px] font-semibold leading-6 text-[#FFB347]">
        Production note: live chat needs a backend /coach/chat endpoint with
        medical guardrails before public release.
      </p>

      {coachReply && (
        <div className="mt-5 rounded-xl border border-[#18D3D0]/25 bg-[#18D3D0]/5 px-4 py-3 text-[13px] font-semibold leading-6 text-white/80">
          {coachReply}
        </div>
      )}
    </div>
  );
}

function TipCard({ data }: { data: CoachData }) {
  return (
    <div className="flex min-h-[140px] items-center gap-5 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-6">
      <div className="grid h-24 w-24 shrink-0 place-items-center">
        <img
          src={BULB_IMAGE}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          alt="Coaching tip"
          className="h-24 w-24 object-contain drop-shadow-[0_0_35px_rgba(166,255,77,.58)]"
        />
      </div>
      <div>
        <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          Coaching Tip
        </p>
        <p className="mt-3 text-[15px] leading-6 text-white/75">
          {data.protein
            ? `Build each meal around your protein target of ${data.protein}g/day.`
            : "Generate a plan first, then your coach tip becomes personalized."}
        </p>
      </div>
    </div>
  );
}

function HabitTracker({
  habits,
  completed,
  progress,
  onToggleHabit,
}: {
  habits: Habit[];
  completed: number;
  progress: number;
  onToggleHabit: (id: string) => void;
}) {
  return (
    <div className="mt-5 grid min-h-[110px] gap-4 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-6 xl:grid-cols-[0.35fr_1fr] xl:items-center">
      <div>
        <div className="flex items-center gap-3">
          <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
            Habit Tracker
          </p>
          <span className="text-[12px] text-white/65">
            {completed}/{habits.length} Completed
          </span>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#A6FF4D] shadow-[0_0_18px_rgba(166,255,77,.5)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {habits.map((habit) => {
          const Icon = habit.icon;
          return (
            <button
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-[#A6FF4D]/30"
            >
              <div className="flex items-center gap-2">
                <Icon
                  size={18}
                  className={
                    habit.completed ? "text-[#A6FF4D]" : "text-white/65"
                  }
                />
                <span className="text-[12px] font-medium text-white/80">
                  {habit.label}
                </span>
              </div>
              {habit.completed ? (
                <CheckCircle2 size={20} className="text-[#A6FF4D]" />
              ) : (
                <span className="h-5 w-5 rounded-full border border-white/20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_20%_35%,rgba(24,211,208,0.08),transparent_34%),radial-gradient(circle_at_80%_65%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}
