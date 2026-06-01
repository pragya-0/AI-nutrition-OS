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

type MiniChartPoint = number;

type DashboardUser = {
  name: string;
  avatar?: string;
  isNewUser: boolean;
};

type DashboardHealth = {
  score: number;
  recovery: number;
  sleep: string;
  hydration: number;
  steps: number;
  calories: number;
  proteinDelta: number;
  lastSync?: string;
};

type DashboardRecommendation = {
  title: string;
  reason: string;
};

type DashboardMetric = {
  title: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
  chart: MiniChartPoint[];
};

type DashboardData = {
  user: DashboardUser;
  health: DashboardHealth;
  insights: string[];
  recommendation: DashboardRecommendation;
  trend: { day: string; score: number }[];
};

const returningUserData: DashboardData = {
  user: { name: "Isha", avatar: "/assets/avatar-1.png", isNewUser: false },
  health: {
    score: 92,
    recovery: 96,
    sleep: "8h 12m",
    hydration: 2.8,
    steps: 8420,
    calories: 850,
    proteinDelta: 12,
    lastSync: "2 min ago",
  },
  insights: [
    "Your body is adapting well today.",
    "Recovery improved 8% this week.",
    "Sleep consistency improved 11%.",
    "Protein target achieved 5 days straight.",
  ],
  recommendation: {
    title: "Increase protein intake by 18g",
    reason: "Breakfast protein has remained below target for the last 3 days.",
  },
  trend: [
    { day: "Mon", score: 84 },
    { day: "Tue", score: 85 },
    { day: "Wed", score: 87 },
    { day: "Thu", score: 89 },
    { day: "Fri", score: 92 },
  ],
};

const _newUserData: DashboardData = {
  user: { name: "Isha", avatar: "/assets/avatar-1.png", isNewUser: true },
  health: {
    score: 0,
    recovery: 0,
    sleep: "0h",
    hydration: 0,
    steps: 0,
    calories: 0,
    proteinDelta: 0,
  },
  insights: [
    "Your AI health system is ready to learn from you.",
    "No previous health history found.",
    "Complete your first assessment to unlock your health score.",
    "Generate a plan to activate AI monitoring.",
  ],
  recommendation: {
    title: "Generate your first AI nutrition plan",
    reason: "Your AI dashboard will activate after your first assessment.",
  },
  trend: [
    { day: "Mon", score: 0 },
    { day: "Tue", score: 0 },
    { day: "Wed", score: 0 },
    { day: "Thu", score: 0 },
    { day: "Fri", score: 0 },
  ],
};

void _newUserData;
const data = returningUserData;

export default function AIHealthCommandCenter() {
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
      sub: isNewUser ? "Waiting" : "↑ 8%",
      color: "#A6FF4D",
      icon: <HeartPulse size={18} />,
      chart: isNewUser
        ? emptyBars()
        : [10, 15, 14, 22, 19, 28, 18, 23, 20, 25, 30, 34],
    },
    {
      title: "Sleep",
      value: health.sleep,
      sub: isNewUser ? "No data" : "Optimal",
      color: "#7657FF",
      icon: <Moon size={18} />,
      chart: isNewUser
        ? emptyBars()
        : [8, 12, 22, 13, 18, 26, 15, 14, 24, 30, 18, 34],
    },
    {
      title: "Hydration",
      value: `${health.hydration}L`,
      sub: isNewUser ? "No data" : "↑ 93%",
      color: "#18D3D0",
      icon: <Droplets size={18} />,
      chart: isNewUser
        ? emptyBars()
        : [9, 13, 16, 24, 17, 27, 22, 30, 19, 26, 32, 38],
    },
    {
      title: "Activity",
      value: health.steps.toLocaleString(),
      sub: "Steps",
      color: "#FFB347",
      icon: <Activity size={18} />,
      chart: isNewUser
        ? emptyBars()
        : [12, 18, 20, 14, 24, 32, 22, 36, 28, 34, 30, 40],
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
                {isNewUser
                  ? "AI Monitoring Not Activated"
                  : "AI Monitoring Active"}
              </span>

              <span className="font-semibold text-[#A3B3A3]">
                {isNewUser
                  ? "Waiting for first plan"
                  : `Last sync: ${health.lastSync || "Just now"}`}
              </span>
            </div>

            <div className="relative mt-5 max-w-[620px] space-y-2 text-[14px] leading-[1.55] xl:text-[15px]">
              {insights.map((insight, index) => (
                <p
                  key={insight}
                  className={
                    index === 0
                      ? "font-black text-white"
                      : "font-medium text-white/85"
                  }
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
              <button className="group inline-flex items-center justify-center gap-3 rounded-[18px] bg-[#A6FF4D] px-5 py-3 text-[14px] font-black leading-none text-black shadow-[0_0_34px_rgba(166,255,77,.28)] transition hover:scale-[1.02]">
                <Sparkles size={19} />
                {isNewUser ? "Generate First Plan" : "Generate Today's Plan"}
                <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-[#A6FF4D] transition group-hover:translate-x-1">
                  →
                </span>
              </button>

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

              <FloatingPill
                className="left-[8%] top-[12%]"
                icon={<Droplets size={18} />}
                value={`+${health.proteinDelta}g`}
                label="Protein"
              />
              <FloatingPill
                className="left-[4%] top-[39%]"
                icon={<Activity size={18} />}
                value={health.sleep}
                label="Sleep"
              />
              <FloatingPill
                className="left-[9%] top-[66%]"
                icon={<Droplets size={18} />}
                value={`${health.hydration}L`}
                label="Water"
              />

              <FloatingPill
                className="right-[8%] top-[12%]"
                icon={<HeartPulse size={18} />}
                value={`${health.recovery}%`}
                label="Recovery"
              />
              <FloatingPill
                className="right-[4%] top-[39%]"
                icon={<Flame size={18} />}
                value={health.calories.toLocaleString()}
                label="kcal"
                orange
              />
              <FloatingPill
                className="right-[9%] top-[66%]"
                icon={<Footprints size={18} />}
                value={health.steps.toLocaleString()}
                label="Steps"
              />

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

      <p
        className="mt-1.5 text-[11px] font-bold"
        style={{ color: metric.color }}
      >
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
    const x =
      paddingX +
      (index * (width - paddingX * 2)) / Math.max(trend.length - 1, 1);
    const normalized = isNewUser ? 0 : (item.score - 70) / 30;
    const y =
      height -
      paddingBottom -
      normalized * (height - paddingTop - paddingBottom);

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
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
          Health Score Trend
        </p>

        <button className="rounded-xl border border-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
          This Week <ChevronDown className="ml-1.5 inline" size={12} />
        </button>
      </div>

      <div className="relative h-[120px] overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
          <defs>
            <linearGradient id="trendArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#18D3D0" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#18D3D0" stopOpacity="0" />
            </linearGradient>

            <filter id="trendGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0, 1, 2].map((line) => (
            <line
              key={line}
              x1="14"
              x2={width - 14}
              y1={48 + line * 34}
              y2={48 + line * 34}
              stroke="rgba(255,255,255,0.06)"
            />
          ))}

          {!isNewUser && <path d={areaPath} fill="url(#trendArea)" />}

          {!isNewUser && (
            <path
              d={path}
              fill="none"
              stroke="#18D3D0"
              strokeWidth="4"
              filter="url(#trendGlow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((point, index) => (
            <g key={point.day}>
              <text
                x={point.x}
                y={isNewUser ? 45 : point.y - 18}
                textAnchor="middle"
                fill="#F5F8F2"
                fontSize="12"
                fontWeight="700"
              >
                {point.score}
              </text>

              {!isNewUser && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === points.length - 1 ? 7 : 5}
                  fill="#18D3D0"
                  stroke={index === points.length - 1 ? "#A6FF4D" : "#18D3D0"}
                  strokeWidth={index === points.length - 1 ? 4 : 2}
                  filter="url(#trendGlow)"
                />
              )}

              {isNewUser && (
                <circle
                  cx={point.x}
                  cy={height - paddingBottom}
                  r="5"
                  fill="rgba(24,211,208,0.35)"
                />
              )}

              <text
                x={point.x}
                y={height - 6}
                textAnchor="middle"
                fill={index === points.length - 1 ? "#A6FF4D" : "#A3B3A3"}
                fontSize="10"
                fontWeight={index === points.length - 1 ? 700 : 500}
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

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "GOOD MORNING";
  if (hour < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

function emptyBars() {
  return [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
}