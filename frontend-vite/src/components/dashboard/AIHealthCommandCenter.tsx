import type React from "react";
import Image from "@/compat/NextImage";
import {
  Activity,
  Bell,
  ChevronDown,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Leaf,
  LineChart,
  Moon,
  ScanLine,
  Sparkles,
  Target,
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
    health_score?: number;
    health_status?: string;
    sleep_score?: number;
    hydration_score?: number;
    bmi?: number;
    body_fat?: number;
    metabolic_age?: number;
  };
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    water_target?: string;
  };
  health_insight?: string;
  coach_message?: string;
  ai_tip?: string;
};

type MiniChartPoint = number;

type DashboardData = {
  user: {
    name: string;
    avatar?: string;
    isNewUser: boolean;
  };
  health: {
    score: number;
    recovery: number;
    sleep: string;
    hydration: string;
    steps: number;
    calories: number;
    proteinDelta: number;
    lastSync?: string;
  };
  insights: string[];
  recommendation: {
    title: string;
    reason: string;
  };
  trend: { day: string; score: number }[];
};

type DashboardMetric = {
  title: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
  chart: MiniChartPoint[];
};

const fallbackData: DashboardData = {
  user: { name: "Guest", avatar: "/assets/avatar-1.png", isNewUser: true },
  health: {
    score: 0,
    recovery: 0,
    sleep: "0h",
    hydration: "0L",
    steps: 0,
    calories: 0,
    proteinDelta: 0,
    lastSync: "Waiting",
  },
  insights: [
    "Your AI health system is ready to learn from you.",
    "Complete your assessment to unlock your health score.",
    "Generate a nutrition plan to activate dashboard insights.",
    "Your personalized analytics will appear here.",
  ],
  recommendation: {
    title: "Generate your first AI nutrition plan",
    reason: "Your AI dashboard activates after your first assessment.",
  },
  trend: [
    { day: "Mon", score: 0 },
    { day: "Tue", score: 0 },
    { day: "Wed", score: 0 },
    { day: "Thu", score: 0 },
    { day: "Fri", score: 0 },
  ],
};

function getStoredPlan(): StoredPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildDashboardData(): DashboardData {
  const plan = getStoredPlan();

  if (!plan?.success) return fallbackData;

  const profile = plan.user_profile || {};
  const analytics = plan.analytics || {};
  const targets = plan.targets || {};

  const score = analytics.health_score ?? 0;
  const sleepHours = profile.sleep_hours ?? 0;
  const hydrationTarget =
    targets.water_target || `${profile.water_intake ?? 2.5} Liters`;

  return {
    user: {
      name: profile.name || "User",
      avatar: "/assets/avatar-1.png",
      isNewUser: false,
    },
    health: {
      score,
      recovery: analytics.sleep_score ?? score,
      sleep: `${sleepHours}h`,
      hydration: hydrationTarget,
      steps: 8420,
      calories: targets.calories ?? 0,
      proteinDelta: targets.protein ?? 0,
      lastSync: "Just now",
    },
    insights: [
      plan.health_insight || "Your personalized AI health insight is ready.",
      `BMI: ${analytics.bmi ?? "—"} • Body Fat: ${analytics.body_fat ?? "—"}%`,
      `Metabolic Age: ${analytics.metabolic_age ?? "—"} years`,
      `Goal: ${formatLabel(profile.goal || "personalized health")}`,
    ],
    recommendation: {
      title: `Follow your ${targets.calories ?? "AI"} kcal plan today`,
      reason:
        plan.ai_tip ||
        plan.coach_message ||
        "Your plan is built from your profile, goal, diet, activity, sleep, hydration, and health analytics.",
    },
    trend: [
      { day: "Mon", score: Math.max(score - 8, 0) },
      { day: "Tue", score: Math.max(score - 6, 0) },
      { day: "Wed", score: Math.max(score - 4, 0) },
      { day: "Thu", score: Math.max(score - 2, 0) },
      { day: "Fri", score },
    ],
  };
}

export default function AIHealthCommandCenter() {
  const data = buildDashboardData();
  const { user, health, trend, insights, recommendation } = data;

  const isNewUser = user.isNewUser;
  const score = isNewUser ? 0 : health.score;

  const scoreStatus =
    score === 0
      ? "Not analyzed yet"
      : score >= 85
        ? "Excellent"
        : score >= 70
          ? "Good"
          : "Needs Focus";

  const metrics: DashboardMetric[] = [
    {
      title: "Recovery",
      value: `${health.recovery}%`,
      sub: isNewUser ? "Waiting" : "Sleep based",
      color: "#A6FF4D",
      icon: <HeartPulse size={18} />,
      chart: isNewUser ? emptyBars() : [10, 15, 14, 22, 19, 28, 18, 23, 20, 25, 30, 34],
    },
    {
      title: "Sleep",
      value: health.sleep,
      sub: isNewUser ? "No data" : "Logged",
      color: "#7657FF",
      icon: <Moon size={18} />,
      chart: isNewUser ? emptyBars() : [8, 12, 22, 13, 18, 26, 15, 14, 24, 30, 18, 34],
    },
    {
      title: "Hydration",
      value: health.hydration,
      sub: isNewUser ? "No data" : "Target",
      color: "#18D3D0",
      icon: <Droplets size={18} />,
      chart: isNewUser ? emptyBars() : [9, 13, 16, 24, 17, 27, 22, 30, 19, 26, 32, 38],
    },
    {
      title: "Activity",
      value: health.steps.toLocaleString(),
      sub: "Steps",
      color: "#FFB347",
      icon: <Activity size={18} />,
      chart: isNewUser ? emptyBars() : [12, 18, 20, 14, 24, 32, 22, 36, 28, 34, 30, 40],
    },
  ];

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[92vw] overflow-visible rounded-[30px] border border-[#173326] bg-[#020604]/95 shadow-[0_0_80px_rgba(166,255,77,0.08)] 2xl:max-w-[1780px]">
        <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_72%_34%,rgba(166,255,77,0.15),transparent_35%),radial-gradient(circle_at_20%_66%,rgba(24,211,208,0.06),transparent_31%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />

        <nav className="relative z-10 flex min-h-[66px] items-center justify-between border-b border-white/10 px-5 py-3 lg:px-8 xl:px-10">
          <Image
            src="/assets/logo.png"
            alt="NutriAI"
            width={180}
            height={64}
            className="h-auto w-[122px] sm:w-[135px] xl:w-[145px]"
            priority
          />

          <div className="hidden items-center gap-2 lg:flex">
            {["Dashboard", "Nutrition Plan", "Progress", "Coach", "Analytics"].map(
              (item, index) => (
                <button
                  key={item}
                  className={`rounded-2xl px-4 py-2 text-[13px] font-bold leading-none transition ${
                    index === 0
                      ? "bg-[#A6FF4D]/12 text-[#A6FF4D]"
                      : "text-[#A3B3A3] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={23} className="text-white/80" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#A6FF4D]" />
            </div>

            <div className="flex items-center gap-3">
              <img
                src={user.avatar || "/assets/avatar-1.png"}
                alt={user.name}
                className="h-10 w-10 rounded-full border border-white/20 object-cover"
              />
              <span className="hidden text-[16px] font-black md:block">
                {user.name}
              </span>
              <ChevronDown size={19} className="text-white/70" />
            </div>
          </div>
        </nav>

        <div className="relative z-10 grid items-start gap-8 px-5 pb-7 pt-4 lg:px-8 xl:grid-cols-[0.86fr_1.14fr] xl:px-10 xl:pb-8 xl:pt-5">
          <div className="relative min-w-0">
            <p className="mb-2 text-[12px] font-black uppercase tracking-[0.34em] text-[#18D3D0] xl:text-[13px]">
              {isNewUser ? "START YOUR AI JOURNEY" : getGreeting()}
            </p>

            <h1 className="-mt-1 text-[40px] font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-[50px] lg:text-[58px] xl:text-[64px] 2xl:text-[70px]">
              {isNewUser ? "Welcome," : "Welcome back,"}
              <br />
              <span className="text-[#A6FF4D] drop-shadow-[0_0_22px_rgba(166,255,77,.45)]">
                {user.name}
              </span>
              <Leaf className="ml-2 inline-block text-[#A6FF4D]" size={30} />
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-[14px]">
              <span className="flex items-center gap-3 font-black text-[#18D3D0]">
                <span className="h-3.5 w-3.5 rounded-full bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.9)]" />
                {isNewUser ? "AI Monitoring Not Activated" : "AI Monitoring Active"}
              </span>

              <span className="font-semibold text-[#A3B3A3]">
                {isNewUser ? "Waiting for first plan" : `Last sync: ${health.lastSync || "Just now"}`}
              </span>
            </div>

            <div className="relative mt-5 max-w-[620px] space-y-2 text-[14px] leading-[1.55] xl:text-[15px]">
              {insights.map((insight, index) => (
                <p
                  key={`${insight}-${index}`}
                  className={index === 0 ? "font-black text-white" : "font-medium text-white/85"}
                >
                  {insight}
                </p>
              ))}

              <div className="pointer-events-none absolute -right-[38%] top-[0px] hidden h-[270px] w-[360px] opacity-75 lg:block">
                <img
                  src="/assets/meshbody.png"
                  alt=""
                  className="absolute bottom-2 left-1/2 h-[310px] -translate-x-1/2 object-contain opacity-90 mix-blend-screen drop-shadow-[0_0_46px_rgba(24,211,208,.85)]"
                />
              </div>
            </div>

            <div className="mt-16 max-w-[640px] rounded-[24px] border border-[#A6FF4D]/20 bg-[#07110A]/75 p-4 shadow-[inset_0_0_40px_rgba(166,255,77,.04)] xl:p-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border border-[#A6FF4D]/20 bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_35px_rgba(166,255,77,.22)]">
                  <Target size={38} />
                </div>

                <div className="relative z-10">
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#A6FF4D]">
                    Today&apos;s Recommendation
                  </p>

                  <h3 className="text-[20px] font-black leading-tight tracking-[-0.04em] text-white xl:text-[22px]">
                    {recommendation.title}
                  </h3>

                  <p className="mt-2 text-[13px] font-black text-[#A6FF4D]">
                    Reason:
                  </p>

                  <p className="max-w-3xl text-[13px] leading-[1.55] text-white/85 xl:text-[14px]">
                    {recommendation.reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 pb-0">
              <a
                href="/#assessment-preview"
                className="group inline-flex items-center justify-center gap-3 rounded-[18px] bg-[#A6FF4D] px-5 py-3 text-[14px] font-black leading-none text-black shadow-[0_0_34px_rgba(166,255,77,.28)] transition hover:scale-[1.02]"
              >
                <Sparkles size={19} />
                {isNewUser ? "Generate First Plan" : "Generate Today's Plan"}
                <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-[#A6FF4D] transition group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="/scanner"
                className="inline-flex items-center justify-center gap-2.5 rounded-[17px] border border-white/15 bg-white/[0.03] px-4 py-3 text-[13px] font-black text-white transition hover:border-[#18D3D0]/50 hover:text-[#18D3D0]"
              >
                <ScanLine size={18} />
                Scan Food
              </a>

              <a
                href="/progress"
                className="inline-flex items-center justify-center gap-2.5 rounded-[17px] border border-white/15 bg-white/[0.03] px-4 py-3 text-[13px] font-black text-white transition hover:border-[#A6FF4D]/50 hover:text-[#A6FF4D]"
              >
                <LineChart size={18} />
                View Progress
              </a>
            </div>
          </div>

          <div className="relative min-w-0 pt-0">
            <div className="relative mx-auto flex min-h-[clamp(300px,30vw,420px)] w-full max-w-[760px] items-center justify-center">
              <div className="absolute inset-x-[7%] bottom-4 top-0 rounded-full border border-[#A6FF4D]/10" />
              <div className="absolute h-[clamp(240px,20vw,340px)] w-[clamp(240px,20vw,340px)] rounded-full bg-[#A6FF4D]/10 blur-3xl" />

              <FloatingPill className="left-[8%] top-[12%]" icon={<Droplets size={18} />} value={`${health.proteinDelta}g`} label="Protein" />
              <FloatingPill className="left-[4%] top-[39%]" icon={<Activity size={18} />} value={health.sleep} label="Sleep" />
              <FloatingPill className="left-[9%] top-[66%]" icon={<Droplets size={18} />} value={health.hydration} label="Water" />

              <FloatingPill className="right-[8%] top-[12%]" icon={<HeartPulse size={18} />} value={`${health.recovery}%`} label="Recovery" />
              <FloatingPill className="right-[4%] top-[39%]" icon={<Flame size={18} />} value={health.calories.toLocaleString()} label="kcal" orange />
              <FloatingPill className="right-[9%] top-[66%]" icon={<Footprints size={18} />} value={health.steps.toLocaleString()} label="Steps" />

              <div className="relative grid h-[clamp(220px,17vw,300px)] w-[clamp(220px,17vw,300px)] place-items-center rounded-full border-[11px] border-[#A6FF4D] bg-[#07110A]/70 shadow-[0_0_65px_rgba(166,255,77,.34),inset_0_0_70px_rgba(166,255,77,.08)]">
                <div className="absolute inset-[-20px] rounded-full border border-[#A6FF4D]/35" />

                <div className="text-center">
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.32em] text-[#A6FF4D]">
                    Health Score
                  </p>

                  <p className="text-[clamp(58px,5vw,82px)] font-black leading-none tracking-[-0.08em] text-white">
                    {score}
                  </p>

                  <p className="mt-2 text-[clamp(16px,1.4vw,22px)] font-semibold text-[#A6FF4D]">
                    {scoreStatus}
                  </p>

                  <p className="mt-1 text-sm text-[#A6FF4D]">☆</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.title} metric={metric} />
              ))}
            </div>

            <TrendChart trend={trend} isNewUser={isNewUser} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingPill({
  icon,
  value,
  label,
  className,
  orange,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  className?: string;
  orange?: boolean;
}) {
  return (
    <div
      className={`absolute z-20 rounded-2xl border border-white/10 bg-[#07110A]/80 px-3 py-2.5 shadow-xl backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className={orange ? "text-[#FFB347]" : "text-[#18D3D0]"}>
          {icon}
        </span>

        <div>
          <p className="text-[14px] font-black leading-none text-white xl:text-[15px]">
            {value}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-white/80">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-[#07110A]/80 p-3 shadow-[inset_0_0_28px_rgba(255,255,255,.02)]">
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: metric.color }}>{metric.icon}</span>
        <p className="text-[12px] font-black text-white">{metric.title}</p>
      </div>

      <p className="text-[22px] font-black leading-none tracking-[-0.06em] text-white">
        {metric.value}
      </p>

      <p className="mt-1.5 text-[11px] font-bold" style={{ color: metric.color }}>
        {metric.sub}
      </p>

      <div className="mt-3 flex h-7 items-end gap-1">
        {metric.chart.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: h + 2,
              backgroundColor: metric.color,
              opacity: h <= 4 ? 0.18 : 0.88,
              boxShadow: h > 4 ? `0 0 10px ${metric.color}55` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TrendChart({
  trend,
  isNewUser,
}: {
  trend: { day: string; score: number }[];
  isNewUser: boolean;
}) {
  const width = 700;
  const height = 170;
  const paddingX = 14;
  const paddingTop = 36;
  const paddingBottom = 44;

  const points = trend.map((item, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / Math.max(trend.length - 1, 1);
    const normalized = isNewUser ? 0 : (item.score - 70) / 30;
    const y = height - paddingBottom - normalized * (height - paddingTop - paddingBottom);
    return { ...item, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${path} L ${points[points.length - 1].x} ${
    height - paddingBottom
  } L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <div className="mt-4 rounded-[18px] border border-white/10 bg-[#07110A]/70 p-3">
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A6FF4D]">
          Health Score Trend
        </p>
        <p className="text-[11px] font-bold text-white/55">This Week</p>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[170px] w-full">
          <defs>
            <linearGradient id="scoreArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#A6FF4D" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#A6FF4D" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={areaPath} fill="url(#scoreArea)" />
          <path
            d={path}
            fill="none"
            stroke={isNewUser ? "rgba(255,255,255,.2)" : "#A6FF4D"}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {points.map((point) => (
            <g key={point.day}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={isNewUser ? "#223025" : "#A6FF4D"}
                stroke="#07110A"
                strokeWidth="3"
              />
              <text
                x={point.x}
                y={height - 15}
                textAnchor="middle"
                fill="rgba(255,255,255,.62)"
                fontSize="14"
                fontWeight="700"
              >
                {point.day}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function emptyBars() {
  return [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}