"use client";

import {
  Activity,
  Bot,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Leaf,
  Moon,
  Sparkles,
  Trophy,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const weightData = [
  { day: "Mon", weight: 67.2 },
  { day: "Tue", weight: 69.7 },
  { day: "Wed", weight: 69.1 },
  { day: "Thu", weight: 69.7 },
  { day: "Fri", weight: 68.8 },
  { day: "Sat", weight: 68.7 },
  { day: "Sun", weight: 67.7 },
];

const macroData = [
  { name: "Protein", value: 38, color: "#9DFF16" },
  { name: "Carbs", value: 45, color: "#13D8E8" },
  { name: "Fats", value: 17, color: "#FF9F1A" },
];

const features = [
  {
    icon: TrendingUp,
    title: "Weight Tracking",
    desc: "Track your weight trend with smart insights.",
    value: "68.4 kg",
    color: "text-[#9DFF16]",
  },
  {
    icon: Footprints,
    title: "Step Counter",
    desc: "Stay active and hit your daily step goals.",
    value: "8,432",
    color: "text-cyan-400",
  },
  {
    icon: Dumbbell,
    title: "Workout Log",
    desc: "Log workouts and track your performance.",
    value: "4/5",
    color: "text-[#9DFF16]",
  },
  {
    icon: Droplets,
    title: "Water Intake",
    desc: "Hydration is key to better results.",
    value: "2.1 L",
    color: "text-cyan-300",
  },
  {
    icon: Moon,
    title: "Sleep Monitor",
    desc: "Good sleep. Better recovery. Stronger you.",
    value: "7h 30m",
    color: "text-purple-400",
  },
];

const habits = [
  { icon: Footprints, name: "Hit 8K Steps", color: "text-cyan-400" },
  { icon: Dumbbell, name: "Workout", color: "text-cyan-400" },
  { icon: Droplets, name: "Drink 2L Water", color: "text-cyan-300" },
  { icon: Leaf, name: "Eat Healthy", color: "text-[#9DFF16]" },
  { icon: Moon, name: "Sleep 7+ Hours", color: "text-purple-400" },
];

const achievements = [
  {
    icon: Flame,
    title: "7 Day Streak",
    sub: "Keep going strong!",
    color: "text-orange-400",
  },
  {
    icon: Droplets,
    title: "Hydration Hero",
    sub: "2L water for 7 days",
    color: "text-cyan-300",
  },
  {
    icon: Dumbbell,
    title: "Workout Warrior",
    sub: "4 workouts this week",
    color: "text-[#9DFF16]",
  },
  {
    icon: Leaf,
    title: "Healthy Eater",
    sub: "5 healthy days",
    color: "text-[#9DFF16]",
  },
];

function HealthScoreRing() {
  const score = 82;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative grid h-[82px] w-[82px] place-items-center">
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="41"
            cy="41"
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="41"
            cy="41"
            r={radius}
            stroke="#9DFF16"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="drop-shadow-[0_0_8px_rgba(157,255,22,0.55)]"
          />
        </svg>

        <div className="text-center">
          <div className="text-[24px] font-black leading-none">82</div>
          <div className="text-[10px] text-white/45">/100</div>
        </div>
      </div>

      <p className="mt-0.5 text-[10px] font-semibold text-[#9DFF16]">
        Great Progress!
      </p>
    </div>
  );
}

export default function ProgressTrackingSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#030805] pt-6 pb-8 text-white sm:pt-8 sm:pb-10 xl:pt-6 xl:pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(157,255,22,0.07),transparent_24%),radial-gradient(circle_at_82%_72%,rgba(157,255,22,0.07),transparent_30%),radial-gradient(circle_at_20%_82%,rgba(157,255,22,0.055),transparent_28%)]" />
      <div className="absolute bottom-[-240px] left-1/2 h-[620px] w-[1350px] -translate-x-1/2 rounded-full bg-[#9DFF16]/[0.045] blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-[330px] bg-[radial-gradient(ellipse_at_bottom,rgba(157,255,22,0.08),transparent_62%)]" />

      <div className="relative mx-auto w-full max-w-[1560px] px-5 sm:px-7 lg:px-8 xl:px-10">
        <div className="grid items-start gap-5 xl:grid-cols-[350px_700px_320px] xl:gap-x-4 xl:gap-y-5 2xl:grid-cols-[390px_740px_340px]">
          <div className="space-y-4 xl:col-start-1 xl:row-start-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9DFF16]/20 bg-[#08100B]/80 px-4 py-2 text-xs font-semibold text-[#9DFF16] shadow-[0_0_20px_rgba(157,255,22,0.08)]">
              <Trophy className="h-3.5 w-3.5" />
              PROGRESS TRACKING
            </div>

            <div>
              <h2 className="max-w-[350px] text-[42px] font-black leading-[0.9] tracking-[-0.06em] sm:text-[52px] xl:text-[48px] 2xl:text-[54px]">
                Track Today.
                <br />
                <span className="text-[#9DFF16]">Transform</span> Tomorrow.
              </h2>

              <p className="mt-5 max-w-[330px] text-[15px] leading-7 text-white/64 xl:text-[16px]">
                Monitor your daily habits, workouts, nutrition and more. Our AI
                turns your data into progress and helps you stay consistent
                every day.
              </p>
            </div>

            <div className="space-y-2.5">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-3 rounded-[22px] border border-white/6 bg-[#08100B]/72 px-3.5 py-2.5 backdrop-blur-xl"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/6 bg-black/25">
                      <item.icon className={`h-[18px] w-[18px] ${item.color}`} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-[15px] font-bold leading-tight">
                        {item.title}
                      </h4>
                      <p className="mt-1 max-w-[175px] text-[12px] leading-5 text-white/52">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`shrink-0 text-[14px] font-black ${item.color}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit rounded-[32px] border border-[#9DFF16]/18 bg-[#07100A]/80 p-5 shadow-[0_0_40px_rgba(157,255,22,0.07)] backdrop-blur-xl xl:col-start-2 xl:row-start-1">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-[25px] font-black tracking-[-0.035em] xl:text-[26px]">
                Your Progress Overview
              </h3>

              <button className="rounded-xl border border-white/8 bg-[#08100B]/80 px-5 py-2.5 text-sm text-white/68">
                This Week
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Flame,
                  title: "Calories Burned",
                  value: "2,150",
                  unit: "kcal",
                  sub: "+12% vs last week",
                  color: "text-orange-400",
                },
                {
                  icon: Activity,
                  title: "Active Minutes",
                  value: "320",
                  unit: "min",
                  sub: "+8% vs last week",
                  color: "text-cyan-400",
                },
                {
                  icon: Dumbbell,
                  title: "Workouts",
                  value: "4",
                  unit: "sessions",
                  sub: "+1 vs last week",
                  color: "text-[#9DFF16]",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-[20px] border border-white/6 bg-[#08100B]/72 px-4 py-4"
                >
                  <div className="flex items-center gap-2">
                    <card.icon className={`h-[17px] w-[17px] ${card.color}`} />
                    <p className="text-[12px] text-white/65">{card.title}</p>
                  </div>

                  <div className="mt-3 flex items-end gap-1.5">
                    <div className="text-[31px] font-black leading-none xl:text-[32px]">
                      {card.value}
                    </div>
                    <div className="pb-1 text-xs text-white/45">
                      {card.unit}
                    </div>
                  </div>

                  <p className={`mt-2 text-[11px] font-semibold ${card.color}`}>
                    {card.sub}
                  </p>
                </div>
              ))}

              <div className="rounded-[20px] border border-white/6 bg-[#08100B]/72 px-4 py-4">
                <p className="text-center text-[12px] text-white/65">
                  Health Score
                </p>
                <HealthScoreRing />
              </div>
            </div>

            <div className="mt-4 rounded-[26px] border border-white/6 bg-[#08100B]/72 p-4">
              <div className="mb-2 flex items-start justify-between gap-4">
                <h4 className="flex items-center gap-2 text-[19px] font-black tracking-[-0.02em]">
                  <TrendingUp className="h-[18px] w-[18px] text-cyan-400" />
                  Weight Trend
                </h4>

                <div className="text-right">
                  <div className="text-[30px] font-black leading-none text-[#9DFF16]">
                    68.4 kg
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    -1.2 kg from last week
                  </p>
                </div>
              </div>

              <div className="h-[165px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weightData}
                    margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9DFF16" stopOpacity={0.28} />
                        <stop offset="65%" stopColor="#9DFF16" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#9DFF16" stopOpacity={0} />
                      </linearGradient>

                      <filter id="lineGlow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <CartesianGrid stroke="rgba(255,255,255,0.055)" vertical horizontal />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
                      dy={8}
                    />

                    <YAxis
                      domain={[64, 72]}
                      ticks={[64, 66, 68, 70, 72]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.48)", fontSize: 12 }}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#07100A",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#9DFF16"
                      strokeWidth={2.4}
                      fill="url(#weightFill)"
                      dot={{
                        r: 3.2,
                        strokeWidth: 1.5,
                        stroke: "#9DFF16",
                        fill: "#9DFF16",
                      }}
                      activeDot={{
                        r: 5,
                        stroke: "#D8FF7A",
                        strokeWidth: 2,
                        fill: "#9DFF16",
                      }}
                      style={{ filter: "url(#lineGlow)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <div className="rounded-[24px] border border-white/6 bg-[#08100B]/72 p-4">
                <h4 className="text-[17px] font-black">Macronutrient Balance</h4>

                <div className="mt-3 flex items-center gap-4">
                  <div className="h-[96px] w-[96px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          innerRadius={34}
                          outerRadius={43}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {macroData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2 text-sm">
                    {macroData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/68">{item.name}</span>
                        <span className="font-bold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/6 bg-[#08100B]/72 p-4">
                <h4 className="text-[17px] font-black">Calorie Intake</h4>

                <div className="mt-4 text-[36px] font-black leading-none text-[#9DFF16]">
                  1,650{" "}
                  <span className="text-[14px] text-white/50">/ 2,200 kcal</span>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[75%] rounded-full bg-[#9DFF16]" />
                </div>

                <p className="mt-3 text-[14px] font-bold text-[#9DFF16]">
                  75% of daily goal
                </p>
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col gap-3 xl:col-start-3 xl:row-start-1">
            <div className="relative rounded-[30px] border border-[#9DFF16]/16 bg-[#07100A]/78 px-5 py-5 backdrop-blur-xl">
              <Sparkles className="absolute right-5 top-5 h-5 w-5 text-[#9DFF16]" />

              <div className="flex items-center gap-3">
                <Bot className="h-7 w-7 text-[#9DFF16]" />
                <h4 className="text-[23px] font-black leading-none tracking-[-0.035em]">
                  AI Coach Insights
                </h4>
              </div>

              <p className="mt-4 text-[17px] font-black leading-[1.25] text-[#9DFF16]">
                Great job staying consistent!
              </p>

              <p className="mt-3 text-[14px] leading-6 text-white/65">
                Your protein intake is on point. Try increasing your water
                intake by 0.5L for even better results.
              </p>
            </div>

            <div className="rounded-[30px] border border-[#9DFF16]/16 bg-[#07100A]/78 p-5 backdrop-blur-xl">
              <h4 className="text-[23px] font-black tracking-[-0.035em]">
                Habits Overview
              </h4>

              <div className="mt-4 space-y-2">
                {habits.map((habit, index) => (
                  <div
                    key={habit.name}
                    className="rounded-2xl border border-white/6 bg-[#08100B]/72 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-[105px] items-center gap-2.5">
                        <habit.icon className={`h-[18px] w-[18px] ${habit.color}`} />
                        <span className="text-[14px] font-bold tracking-[-0.02em]">
                          {habit.name}
                        </span>
                      </div>

                      <div>
                        <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-[10px] text-white/42">
                          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                            <span key={`${d}-${i}`}>{d}</span>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <span
                              key={i}
                              className={`grid h-[18px] w-[18px] place-items-center rounded-full text-[9px] font-black ${
                                i > 4 && index % 2 === 1
                                  ? "bg-orange-400 text-black"
                                  : "bg-[#9DFF16] text-black"
                              }`}
                            >
                              ✓
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#9DFF16]/16 bg-[#07100A]/78 p-5 backdrop-blur-xl xl:col-start-1 xl:row-start-2 xl:min-h-[150px]">
            <div className="flex items-center gap-4">
              <Flame className="h-10 w-10 text-orange-400" />

              <div>
                <h4 className="text-[16px] font-bold">Daily Streak</h4>
                <div className="text-[34px] font-black leading-none">
                  12 <span className="text-base text-white/55">days</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Keep it up! Consistency builds results.
            </p>

            <div className="mt-3 flex gap-2.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={`${d}-${i}`} className="text-center">
                  <div className="mb-1.5 text-[11px] text-white/40">{d}</div>
                  <div
                    className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-black ${
                      i === 6
                        ? "border border-orange-400 text-orange-400"
                        : "bg-[#9DFF16] text-black"
                    }`}
                  >
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#9DFF16]/16 bg-[#07100A]/78 px-5 py-5 shadow-[0_0_28px_rgba(157,255,22,0.045)] backdrop-blur-xl xl:col-span-2 xl:col-start-2 xl:row-start-2 xl:min-h-[150px]">
            <div className="mb-4 flex items-center gap-2.5">
              <Trophy className="h-5 w-5 text-[#9DFF16]" />
              <h4 className="text-[24px] font-black tracking-[-0.03em]">
                Achievements
              </h4>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
              {achievements.map((badge) => (
                <div
                  key={badge.title}
                  className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-white/6 bg-[#08100B]/72 px-3 py-2.5"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/6 bg-[#9DFF16]/10">
                    <badge.icon className={`h-[18px] w-[18px] ${badge.color}`} />
                  </div>

                  <div className="min-w-0">
                    <h5 className="whitespace-nowrap text-[14px] font-bold">
                      {badge.title}
                    </h5>
                    <p className="mt-0.5 whitespace-nowrap text-[12px] text-white/45">
                      {badge.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}