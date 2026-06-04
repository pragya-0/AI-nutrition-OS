import { useEffect, useMemo, useState, type ElementType } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Flame,
  HeartPulse,
  Info,
  AlertTriangle,
  Mic,
  Moon,
  Sparkles,
  Trash2,
  Utensils,
  X,
  Zap,
} from "lucide-react";

const AI_GIRL_IMAGE = "/assets/ai-coach2.png";
const BULB_IMAGE = "/assets/Bulb.png";

type Insight = {
  id: string;
  title: string;
  value: string;
  status: string;
  change: string;
  color: string;
  icon: ElementType;
  trend: number[];
};

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

const insights: Insight[] = [
  {
    id: "recovery",
    title: "Recovery",
    value: "96%",
    status: "Excellent",
    change: "↑ 8%",
    color: "#A6FF4D",
    icon: HeartPulse,
    trend: [20, 26, 34, 25, 19, 21, 22, 30, 28, 24, 20, 26, 35, 37],
  },
  {
    id: "sleep",
    title: "Sleep",
    value: "8h 12m",
    status: "Optimal",
    change: "↑ 11%",
    color: "#A875FF",
    icon: Moon,
    trend: [18, 23, 24, 25, 27, 22, 20, 18, 26, 21, 27, 20, 28],
  },
  {
    id: "nutrition",
    title: "Nutrition",
    value: "82%",
    status: "Good",
    change: "↑ 6%",
    color: "#FFB347",
    icon: Utensils,
    trend: [20, 28, 22, 24, 16, 14, 15, 22, 28, 20, 27, 21, 16, 23],
  },
  {
    id: "activity",
    title: "Activity",
    value: "8,420",
    status: "Steps",
    change: "↑ 12%",
    color: "#18D3D0",
    icon: Zap,
    trend: [15, 18, 24, 28, 22, 18, 17, 25, 20, 15, 21, 17, 27, 20],
  },
];

const recommendations: Recommendation[] = [
  {
    id: "protein",
    title: "Increase Protein",
    description: "Hit your current protein target today.",
    priority: "High Priority",
    color: "#A6FF4D",
    icon: Trash2,
  },
  {
    id: "sleep",
    title: "Optimize Sleep",
    description: "Keep your sleep routine consistent to maintain recovery.",
    priority: "Medium Priority",
    color: "#A875FF",
    icon: Moon,
  },
  {
    id: "hydration",
    title: "Hydration Boost",
    description: "Work toward your hydration target.",
    priority: "Medium Priority",
    color: "#18D3D0",
    icon: Droplets,
  },
  {
    id: "move",
    title: "Move More",
    description: "A 20 min post-meal walk can support your goal.",
    priority: "Low Priority",
    color: "#FFB347",
    icon: Dumbbell,
  },
];

const defaultHabits: Habit[] = [
  { id: "water", label: "Drink 3L Water", completed: true, icon: Droplets },
  { id: "steps", label: "10k Steps", completed: true, icon: Zap },
  { id: "protein", label: "Protein Goal", completed: true, icon: Dumbbell },
  { id: "sugar", label: "No Sugar", completed: false, icon: Sparkles },
  { id: "sleep", label: "Early Sleep", completed: false, icon: Moon },
];

const chatSuggestions = [
  "What should I eat after gym?",
  "Why is my weight plateauing?",
  "Can I replace paneer with tofu?",
  "How can I improve my sleep?",
];

type StoredCoachPlan = {
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
    sleep_hours?: number;
    water_intake?: number;
  };
  analytics?: {
    health_score?: number;
    sleep_score?: number;
    hydration_score?: number;
  };
  targets?: {
    calories?: number;
    protein?: number;
    water_target?: string;
  };
  coach_message?: string;
  ai_tip?: string;
  health_insight?: string;
};

function getStoredCoachPlan(): StoredCoachPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    if (!raw) return null;
    return JSON.parse(raw) as StoredCoachPlan;
  } catch {
    return null;
  }
}

function getStoredBlockedCoachResponse(): StoredCoachPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_blocked_response");
    if (!raw) return null;
    return JSON.parse(raw) as StoredCoachPlan;
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

function getCoachData() {
  const blocked = getStoredBlockedCoachResponse();
  const plan = getStoredCoachPlan();

  if (blocked?.blocked) {
    return {
      blocked: true,
      name: "User",
      goal: "medical guidance required",
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
        "AI Coach is disabled for this profile because nutrition and workout recommendations should come from a qualified medical professional.",
    };
  }

  const profile = plan?.user_profile || {};
  const analytics = plan?.analytics || {};
  const targets = plan?.targets || {};

  const name = "User";
  const goal = formatLabel(profile.goal);
  const healthScore = analytics.health_score ?? 0;
  const sleepScore = analytics.sleep_score ?? healthScore;
  const hydrationScore = analytics.hydration_score ?? healthScore;
  const protein = targets.protein ?? 0;
  const calories = targets.calories ?? 0;
  const waterTarget = targets.water_target || `${profile.water_intake ?? 2.5}L`;

  return {
    blocked: false,
    name,
    goal,
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
      "Your AI coach will summarize your health and nutrition patterns after plan generation.",
  };
}


export default function AICoachInsights() {
  const [coachData, setCoachData] = useState(() => getCoachData());
  const [input, setInput] = useState("");
  const [habits, setHabits] = useState(defaultHabits);
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [coachReply, setCoachReply] = useState("");

  useEffect(() => {
    const refresh = () => setCoachData(getCoachData());

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

  const habitProgress = Math.round((completedHabits / habits.length) * 100);

  const handleSend = () => {
    if (!input.trim()) return;

    if (coachData.blocked) {
      setCoachReply(
        "AI Coach: I cannot provide nutrition, workout, or wellness recommendations for this profile. Please consult a qualified healthcare professional.",
      );
      setInput("");
      return;
    }

    setCoachReply(
      `AI Coach: "${input}" — I’ll personalize this using your latest nutrition and progress data.`,
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

          {coachData.blocked ? <CoachSafetyBlockedNotice message={coachData.message} /> : null}

          <div className="grid items-stretch gap-5 xl:grid-cols-[1.38fr_0.92fr]">
            <div className="grid items-stretch gap-5 lg:grid-cols-[0.68fr_1fr]">
              <CoachAvatar />
              <CoachMessage data={coachData} />
            </div>

            <InsightPanel
              data={coachData}
              showAllInsights={showAllInsights}
              onToggle={() => setShowAllInsights((value) => !value)}
            />
          </div>

          <RecommendationPanel data={coachData} />

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.42fr]">
            <CoachInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              coachReply={coachReply}
            />
            <TipCard />
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
      <div className="flex items-center gap-4">
       

        <div>
          <h2 className="flex items-center gap-3 text-[30px] font-black uppercase leading-none tracking-[0.02em] sm:text-[36px] lg:text-[42px] xl:text-[48px]">
            AI Coach Insights
            <Sparkles className="text-[#A6FF4D]" size={26} />
          </h2>

          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
            Personalized guidance from your AI Nutrition Coach
          </p>
        </div>
      </div>

      <button className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] font-semibold text-white/80 transition hover:border-[#A6FF4D]/40">
        <span className="h-3 w-3 rounded-full bg-[#A6FF4D] shadow-[0_0_18px_rgba(166,255,77,.75)]" />
        AI Coach Active
        <Info size={15} className="text-white/45" />
      </button>
    </div>
  );
}

function CoachAvatar() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[24px] border border-white/10 bg-[#07110A]/70 p-4 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(24,211,208,.25),transparent_48%)]" />

      <div className="relative mx-auto -mt-3 grid h-[380px] max-w-[430px] place-items-center xl:h-[400px]">
        <div className="absolute inset-3 rounded-full border border-[#18D3D0]/50 shadow-[0_0_55px_rgba(24,211,208,.34)]" />
        <div className="absolute inset-12 rounded-full border border-[#A6FF4D]/35" />
        <div className="absolute bottom-[58px] h-8 w-[270px] rounded-full border border-[#18D3D0]/60 shadow-[0_0_34px_rgba(24,211,208,.58)]" />

        <img
          src={AI_GIRL_IMAGE}
          onError={(event) => { event.currentTarget.style.display = "none"; }}
          alt="AI Coach Nutri"
          className="relative z-10 h-[430px] w-[430px] object-contain drop-shadow-[0_0_48px_rgba(24,211,208,.5)] xl:h-[460px] xl:w-[460px]"
        />
      </div>

      <div className="relative z-10 mt-2 text-center">
        <p className="text-[15px] font-black uppercase tracking-[0.18em] text-[#18D3D0]">
          AI Coach Nutri
        </p>

        <p className="mx-auto mt-2 max-w-[260px] text-[14px] leading-6 text-white/70">
          Your personal nutrition & lifestyle guide
        </p>
      </div>
    </div>
  );
}

function CoachMessage({ data }: { data: ReturnType<typeof getCoachData> }) {
  const notices = [
    {
      color: "#A6FF4D",
      icon: ArrowRight,
      title: "Your recovery score is aligned with your latest plan.",
      text: `Sleep score: ${data.sleepScore}%. Keep your routine steady.`,
    },
    {
      color: "#FFB347",
      icon: Flame,
      title: "Your current protein target is ready.",
      text: `Aim for ${data.protein}g protein across the day.`,
    },
    {
      color: "#18D3D0",
      icon: Droplets,
      title: "Hydration target is personalized.",
      text: `Target: ${data.waterTarget}. Track water consistently.`,
    },
    {
      color: "#A6FF4D",
      icon: CheckCircle2,
      title: "You're on track for your selected goal.",
      text: `Goal: ${data.goal}. Calories: ${data.calories} kcal.`,
    },
  ];

  return (
    <div className="min-h-[420px] rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="text-[25px] font-black tracking-[-0.04em] text-white xl:text-[30px]">
            Good evening, <span className="text-[#A6FF4D]">{data.name}!</span> 👋
          </h3>
          <p className="mt-2 text-[14px] leading-6 text-white/70">
            Here&apos;s what I&apos;ve noticed from your latest AI plan.
          </p>
        </div>

        <span className="text-[12px] font-medium text-white/55">Just now</span>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="space-y-3">
          {notices.map((notice) => {
            const Icon = notice.icon;

            return (
              <div key={notice.title} className="flex gap-3">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-white/[0.03]"
                  style={{
                    borderColor: `${notice.color}55`,
                    color: notice.color,
                  }}
                >
                  <Icon size={17} />
                </div>

                <div>
                  <p
                    className="text-[14px] font-black leading-5"
                    style={{
                      color:
                        notice.color === "#A6FF4D" ? "#FFFFFF" : notice.color,
                    }}
                  >
                    {notice.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-white/65">
                    {notice.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#A6FF4D]/30 bg-[#A6FF4D]/5 px-4 py-3 text-[13px] font-medium leading-6 text-white/80">
        {data.message}
      </div>
    </div>
  );
}
function InsightPanel({
  data,
  showAllInsights,
  onToggle,
}: {
  data: ReturnType<typeof getCoachData>;
  showAllInsights: boolean;
  onToggle: () => void;
}) {
  const personalizedInsights: Insight[] = insights.map((item) => {
    if (item.id === "recovery") {
      return { ...item, value: `${data.healthScore}%`, status: data.healthScore >= 85 ? "Excellent" : "Good" };
    }

    if (item.id === "sleep") {
      return { ...item, value: `${data.sleepScore}%`, status: data.sleepScore >= 85 ? "Optimal" : "Good" };
    }

    if (item.id === "nutrition") {
      return { ...item, value: `${data.protein}g`, status: "Protein" };
    }

    if (item.id === "activity") {
      return { ...item, value: `${data.calories.toLocaleString()}`, status: "kcal" };
    }

    return item;
  });

  const visibleInsights = showAllInsights ? personalizedInsights : personalizedInsights.slice(0, 4);

  return (
   <div className="h-fit rounded-[24px] border border-white/10 bg-[#07110A]/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          Today&apos;s Insights
        </p>

        <button
          onClick={onToggle}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[12px] font-bold text-white/80 transition hover:border-[#A6FF4D]/40 hover:text-[#A6FF4D]"
        >
          {showAllInsights ? "Hide Insights" : "View All Insights"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visibleInsights.map((item) => (
          <InsightCard key={item.id} insight={item} />
        ))}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const Icon = insight.icon;

  return (
    <div className="h-[175px] overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <div
          className="grid h-9 w-9 place-items-center rounded-xl border bg-white/[0.04]"
          style={{ color: insight.color, borderColor: `${insight.color}35` }}
        >
          <Icon size={18} />
        </div>

        <p
          className="text-[12px] font-black uppercase tracking-[0.08em]"
          style={{ color: insight.color }}
        >
          {insight.title}
        </p>
      </div>

      <p className="mt-3 text-[26px] font-black leading-none text-white">
        {insight.value}
      </p>

      <div className="mt-1.5 flex items-center justify-between gap-4">
        <p className="text-[12px] font-bold" style={{ color: insight.color }}>
          {insight.status}
        </p>
        <p className="text-[11px] font-black" style={{ color: insight.color }}>
          {insight.change}
        </p>
      </div>

      <div className="mt-1 overflow-hidden rounded-b-[16px]">
        <MiniLineChart color={insight.color} values={insight.trend} />
      </div>
    </div>
  );
}
function RecommendationPanel({ data }: { data: ReturnType<typeof getCoachData> }) {
  const personalizedRecommendations: Recommendation[] = recommendations.map((item) => {
    if (item.id === "protein") {
      return { ...item, description: `Hit your current protein target of ${data.protein}g today.` };
    }

    if (item.id === "hydration") {
      return { ...item, description: `Work toward your hydration target: ${data.waterTarget}.` };
    }

    if (item.id === "move") {
      return { ...item, description: `A 20 min post-meal walk can support your ${data.goal.toLowerCase()} goal.` };
    }

    return item;
  });

  return (
    <div className="mt-5 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-6">
      <p className="text-[15px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
        AI Recommendations For You
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {personalizedRecommendations.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => alert(item.description)}
              className="flex min-h-[150px] items-center gap-5 rounded-[20px] border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-[#A6FF4D]/30 hover:bg-white/[0.06]"
            >
              <div
                className="grid h-20 w-20 shrink-0 place-items-center rounded-full border bg-white/[0.04] shadow-[0_0_28px_rgba(255,255,255,.04)]"
                style={{ borderColor: `${item.color}55`, color: item.color }}
              >
                <Icon size={34} />
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
            </button>
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
          placeholder="Ask your AI Nutrition Coach anything..."
          className="min-w-0 flex-1 bg-transparent text-[18px] font-medium text-white outline-none placeholder:text-white/40"
        />

        <button
          onClick={() => setInput("")}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:text-[#FF6C7D]"
        >
          <X size={17} />
        </button>

        <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white">
          <Mic size={17} />
        </button>

        <button
          onClick={onSend}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#A6FF4D] text-black shadow-[0_0_30px_rgba(166,255,77,.35)] transition hover:scale-105"
        >
          <ArrowRight size={22} />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {chatSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[12px] font-medium text-white/80 transition hover:border-[#A6FF4D]/35 hover:text-[#A6FF4D]"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {coachReply && (
        <div className="mt-5 rounded-xl border border-[#18D3D0]/25 bg-[#18D3D0]/5 px-4 py-3 text-[13px] font-semibold leading-6 text-white/80">
          {coachReply}
        </div>
      )}
    </div>
  );
}

function TipCard() {
  return (
    <div className="flex min-h-[140px] items-center gap-5 rounded-[24px] border border-white/10 bg-[#07110A]/70 p-6">
      <div className="grid h-28 w-28 shrink-0 place-items-center">
        <img
          src={BULB_IMAGE}
          onError={(event) => { event.currentTarget.style.display = "none"; }}
          alt="Coaching tip"
          className="h-28 w-28 object-contain drop-shadow-[0_0_35px_rgba(166,255,77,.58)]"
        />
      </div>

      <div>
        <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
          Coaching Tip Of The Day
        </p>
        <p className="mt-3 text-[15px] leading-6 text-white/75">
          Focus on protein at every meal. It keeps you full, supports muscle and
          boosts metabolism.
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
            AI Coach Habits Tracker
          </p>
          <span className="text-[12px] text-white/65">
            {completed}/5 Completed
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

function MiniLineChart({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  const points = values
    .map((value, index) => {
      const x = 12 + index * (220 / Math.max(values.length - 1, 1));
      const y = 38 - ((value - min) / (max - min || 1)) * 24;
      return `${x},${y}`;
    })
    .join(" ");

  const area = `12,48 ${points} 236,48`;

  return (
    <svg viewBox="0 0 250 52" className="h-[44px] w-full overflow-hidden">
      <path d={`M ${area} Z`} fill={color} opacity="0.14" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      {points.split(" ").map((pair, index) => {
        const [x, y] = pair.split(",");
        return <circle key={index} cx={x} cy={y} r="2.6" fill={color} />;
      })}
    </svg>
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