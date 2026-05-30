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
  user: {
    name: "Isha",
    avatar: "/assets/avatar-1.png",
    isNewUser: false,
  },
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
  user: {
    name: "Isha",
    avatar: "/assets/avatar-1.png",
    isNewUser: true,
  },
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
// const data = newUserData;

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

  const greeting = getGreeting();
  const welcomeText = isNewUser ? "Welcome," : "Welcome back,";

  const metrics: DashboardMetric[] = [
    {
      title: "Recovery",
      value: `${health.recovery}%`,
      sub: isNewUser ? "Waiting" : "↑ 8%",
      color: "#A6FF4D",
      icon: <HeartPulse size={30} />,
      chart: isNewUser
        ? emptyBars()
        : [10, 15, 14, 22, 19, 28, 18, 23, 20, 25, 30, 34],
    },
    {
      title: "Sleep",
      value: health.sleep,
      sub: isNewUser ? "No data" : "Optimal",
      color: "#7657FF",
      icon: <Moon size={30} />,
      chart: isNewUser
        ? emptyBars()
        : [8, 12, 22, 13, 18, 26, 15, 14, 24, 30, 18, 34],
    },
    {
      title: "Hydration",
      value: `${health.hydration}L`,
      sub: isNewUser ? "No data" : "↑ 93%",
      color: "#18D3D0",
      icon: <Droplets size={30} />,
      chart: isNewUser
        ? emptyBars()
        : [9, 13, 16, 24, 17, 27, 22, 30, 19, 26, 32, 38],
    },
    {
      title: "Activity",
      value: health.steps.toLocaleString(),
      sub: "Steps",
      color: "#FFB347",
      icon: <Activity size={30} />,
      chart: isNewUser
        ? emptyBars()
        : [12, 18, 20, 14, 24, 32, 22, 36, 28, 34, 30, 40],
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030805] px-0 py-2 text-[#F5F8F2]">
      <div className="relative mx-auto w-[98vw] max-w-none overflow-hidden rounded-[34px] border border-[#173326] bg-[#020604]/95 shadow-[0_0_80px_rgba(166,255,77,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(166,255,77,0.18),transparent_35%),radial-gradient(circle_at_20%_66%,rgba(24,211,208,0.08),transparent_31%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.17] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
        <div className="pointer-events-none absolute right-[70px] top-[90px] h-[560px] w-[1040px] rounded-full border border-[#A6FF4D]/10" />
        <div className="pointer-events-none absolute right-[110px] top-[130px] h-[460px] w-[860px] rounded-full border border-[#18D3D0]/10" />

        <nav className="relative z-10 flex h-[148px] items-center justify-between border-b border-white/10 px-10 xl:px-16 2xl:px-20">
          <div className="flex items-center gap-7">
            <div className="flex h-[92px] w-[92px] items-center justify-center rounded-[28px] bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_36px_rgba(166,255,77,.5)]">
              <Sparkles size={48} />
            </div>

            <p
              className="font-black tracking-[0.18em]"
              style={{ fontSize: "34px" }}
            >
              AI NUTRITION OS
            </p>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            {["Dashboard", "Nutrition Plan", "Progress", "Coach", "Analytics"].map(
              (item, index) => (
                <button
                  key={item}
                  className={`rounded-[24px] px-8 py-5 font-black leading-none tracking-[-0.04em] transition ${
                    index === 0
                      ? "bg-[#A6FF4D]/10 text-[#A6FF4D]"
                      : "text-[#A3B3A3] hover:bg-white/5 hover:text-white"
                  }`}
                  style={{ fontSize: "34px" }}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="relative">
              <Bell size={38} className="text-white/80" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#A6FF4D]" />
            </div>

            <div className="flex items-center gap-5">
              <img
                src={user.avatar || "/assets/avatar-1.png"}
                alt={user.name}
                className="h-[76px] w-[76px] rounded-full border border-white/20 object-cover"
              />

              <span
                className="hidden font-black md:block"
                style={{ fontSize: "30px" }}
              >
                {user.name}
              </span>

              <ChevronDown size={28} className="text-white/70" />
            </div>
          </div>
        </nav>

        <div className="relative z-10 grid min-h-[800px] gap-10 px-10 py-12 xl:grid-cols-[1.08fr_1.12fr] xl:px-16 2xl:px-20">
          <div className="relative">
            <p className="mb-7 text-[24px] font-black uppercase tracking-[0.45em] text-[#18D3D0]">
              {isNewUser ? "START YOUR AI JOURNEY" : greeting}
            </p>

            <h1 className="text-[96px] font-black leading-[0.9] tracking-[-0.06em] text-white md:text-[118px] xl:text-[132px]">
              {welcomeText}
              <br />
              <span className="text-[#A6FF4D] drop-shadow-[0_0_22px_rgba(166,255,77,.45)]">
                {user.name}
              </span>
              <Leaf className="ml-4 inline-block text-[#A6FF4D]" size={52} />
            </h1>

            <div className="mt-12 flex flex-wrap items-center gap-7 text-[26px]">
              <span className="flex items-center gap-4 font-black text-[#18D3D0]">
                <span className="h-6 w-6 rounded-full bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.9)]" />
                {isNewUser
                  ? "AI Monitoring Not Activated"
                  : "AI Monitoring Active"}
              </span>

              <span className="text-[24px] font-semibold text-[#A3B3A3]">
                {isNewUser
                  ? "Waiting for first plan"
                  : `Last sync: ${health.lastSync || "Just now"}`}
              </span>
            </div>

            <div className="relative mt-9 min-h-[210px] max-w-[920px] space-y-5 text-[31px] leading-[1.6]">
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

              <div className="pointer-events-none absolute -right-72 top-[-20px] hidden h-[480px] w-[790px] opacity-80 lg:block">
                <img
                  src="/assets/meshbody.png"
                  alt=""
                  className="absolute bottom-10 left-1/2 h-[640px] -translate-x-1/2 object-contain opacity-90 mix-blend-screen drop-shadow-[0_0_46px_rgba(24,211,208,.85)]"
                />
              </div>
            </div>

            <div className="mt-7 max-w-[1040px] rounded-[36px] border border-[#A6FF4D]/20 bg-[#07110A]/75 p-10 shadow-[inset_0_0_40px_rgba(166,255,77,.04)]">
              <div className="flex gap-9">
                <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-[#A6FF4D]/20 bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_35px_rgba(166,255,77,.25)]">
                  <Target size={88} />
                </div>

                <div className="relative z-10">
                  <p className="mb-5 text-[24px] font-black uppercase tracking-[0.35em] text-[#A6FF4D]">
                    Today&apos;s Recommendation
                  </p>

                  <h3 className="text-[60px] font-black leading-tight tracking-[-0.05em] text-white">
                    {recommendation.title}
                  </h3>

                  <p className="mt-5 text-[28px] font-black text-[#A6FF4D]">
                    Reason:
                  </p>

                  <p className="max-w-3xl text-[30px] leading-[1.55] text-white/85">
                    {recommendation.reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-nowrap gap-5 pb-2">
              <button
                className="group inline-flex min-w-[560px] items-center justify-center gap-6 rounded-[28px] bg-[#A6FF4D] px-14 py-9 font-black leading-none text-black shadow-[0_0_38px_rgba(166,255,77,.35)] transition hover:scale-[1.02]"
                style={{ fontSize: "40px" }}
              >
                <Sparkles size={42} />

                {isNewUser ? "Generate First Plan" : "Generate Today's Plan"}

                <span className="grid h-16 w-16 place-items-center rounded-full bg-black text-[#A6FF4D] transition group-hover:translate-x-1">
                  →
                </span>
              </button>

              <a
                href="/scanner"
                className="inline-flex min-w-[260px] items-center justify-center gap-4 rounded-[24px] border border-white/15 bg-white/[0.03] px-12 py-8 text-[26px] font-black text-white transition hover:border-[#18D3D0]/50 hover:text-[#18D3D0]"
              >
                <ScanLine size={34} />
                Scan Food
              </a>

              <a
                href="/progress"
                className="inline-flex min-w-[300px] items-center justify-center gap-4 rounded-[24px] border border-white/15 bg-white/[0.03] px-12 py-8 text-[26px] font-black text-white transition hover:border-[#A6FF4D]/50 hover:text-[#A6FF4D]"
              >
                <LineChart size={34} />
                View Progress
              </a>
            </div>
          </div>

          <div className="relative pt-6 xl:pt-8">
            <div className="relative mx-auto flex min-h-[550px] max-w-[1040px] items-center justify-center">
              <div className="absolute inset-x-2 top-0 bottom-4 rounded-full border border-[#A6FF4D]/10" />
              <div className="absolute h-[560px] w-[560px] rounded-full bg-[#A6FF4D]/10 blur-3xl" />

              <FloatingPill
                className="left-[0%] top-[74px]"
                icon={<Droplets size={30} />}
                value={isNewUser ? "+0g" : `+${health.proteinDelta}g`}
                label="Protein"
              />

              <FloatingPill
                className="left-[-6%] top-[235px]"
                icon={<Activity size={30} />}
                value={isNewUser ? "0h" : health.sleep}
                label="Sleep"
              />

              <FloatingPill
                className="left-[2%] top-[400px]"
                icon={<Droplets size={30} />}
                value={`${health.hydration}L`}
                label="Water"
              />

              <FloatingPill
                className="right-[0%] top-[74px]"
                icon={<HeartPulse size={30} />}
                value={`${health.recovery}%`}
                label="Recovery"
              />

              <FloatingPill
                className="right-[-5%] top-[235px]"
                icon={<Flame size={30} />}
                value={health.calories.toLocaleString()}
                label="kcal"
                orange
              />

              <FloatingPill
                className="right-[1%] top-[400px]"
                icon={<Footprints size={30} />}
                value={health.steps.toLocaleString()}
                label="Steps"
              />

              <div className="relative grid h-[470px] w-[470px] place-items-center rounded-full border-[20px] border-[#A6FF4D] bg-[#07110A]/70 shadow-[0_0_80px_rgba(166,255,77,.45),inset_0_0_86px_rgba(166,255,77,.08)]">
                <div className="absolute inset-[-36px] rounded-full border border-[#A6FF4D]/40" />

                <div className="text-center">
                  <p className="mb-2 text-base font-black uppercase tracking-[0.35em] text-[#A6FF4D]">
                    Health Score
                  </p>

                  <p className="text-[150px] font-black leading-none tracking-[-0.08em] text-white">
                    {score}
                  </p>

                  <p className="mt-4 text-[40px] font-semibold text-[#A6FF4D]">
                    {scoreStatus}
                  </p>

                  <p className="mt-2 text-xl text-[#A6FF4D]">☆</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-4">
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
      className={`absolute z-20 rounded-2xl border border-white/10 bg-[#07110A]/80 px-6 py-5 shadow-xl backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className={orange ? "text-[#FFB347]" : "text-[#18D3D0]"}>
          {icon}
        </span>

        <div>
          <p className="text-[32px] font-black leading-none text-white">
            {value}
          </p>
          <p className="mt-1 text-[18px] font-semibold text-white/80">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#07110A]/80 p-8 shadow-[inset_0_0_28px_rgba(255,255,255,.02)]">
      <div className="mb-5 flex items-center gap-3">
        <span style={{ color: metric.color }}>{metric.icon}</span>
        <p className="text-[22px] font-black text-white">{metric.title}</p>
      </div>

      <p className="text-[60px] font-black leading-none tracking-[-0.07em] text-white">
        {metric.value}
      </p>

      <p className="mt-3 text-[18px] font-bold" style={{ color: metric.color }}>
        {metric.sub}
      </p>

      <div className="mt-7 flex h-12 items-end gap-1.5">
        {metric.chart.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: h + 6,
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
      paddingX + (index * (width - paddingX * 2)) /
        Math.max(trend.length - 1, 1);
    const normalized = isNewUser ? 0 : (item.score - 70) / 30;
    const y =
      height -
      paddingBottom -
      normalized * (height - paddingTop - paddingBottom);

    return {
      ...item,
      x,
      y,
    };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${path} L ${points[points.length - 1].x} ${
    height - paddingBottom
  } L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <div className="mt-8 rounded-[28px] border border-white/10 bg-[#07110A]/70 p-8">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-black uppercase tracking-[0.35em] text-[#18D3D0]">
          Health Score Trend
        </p>

        <button className="rounded-xl border border-white/10 px-5 py-3 text-base font-semibold text-white">
          This Week <ChevronDown className="ml-2 inline" size={16} />
        </button>
      </div>

      <div className="relative h-[220px] overflow-hidden">
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
                fontSize="17"
                fontWeight="700"
              >
                {point.score}
              </text>

              {!isNewUser && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === points.length - 1 ? 9 : 7}
                  fill="#18D3D0"
                  stroke={index === points.length - 1 ? "#A6FF4D" : "#18D3D0"}
                  strokeWidth={index === points.length - 1 ? 5 : 2}
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
                fontSize="13"
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