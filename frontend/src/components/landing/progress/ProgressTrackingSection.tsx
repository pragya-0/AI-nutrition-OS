"use client";

import Image from "next/image";
import {
  Activity,
  Bot,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Leaf,
  Moon,
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

export default function ProgressTrackingSection() {
  return (
    <section className="relative overflow-hidden bg-[#030805] py-24 text-white">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/assets/progress/mesh-bg.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="absolute bottom-0 left-0 h-[320px] w-[560px] opacity-45">
        <Image
          src="/assets/progress/neon-wave-left.png"
          alt=""
          fill
          className="object-contain object-left-bottom"
        />
      </div>

      <div className="absolute bottom-0 right-0 h-[320px] w-[560px] opacity-40">
        <Image
          src="/assets/progress/neon-wave-right.png"
          alt=""
          fill
          className="object-contain object-right-bottom"
        />
      </div>

      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9DFF16]/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-[1560px] px-8 sm:px-10 lg:px-14 xl:px-16 2xl:px-20">
        <div className="grid items-start gap-8 xl:grid-cols-[300px_minmax(620px,1fr)_400px]">
          {/* LEFT CONTENT */}
          <div className="space-y-5 xl:col-start-1 xl:row-start-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9DFF16]/20 bg-[#08100B]/80 px-4 py-2 text-sm font-semibold text-[#9DFF16]">
              <Trophy className="h-4 w-4" />
              PROGRESS TRACKING
            </div>

            <div>
              <h2 className="max-w-[300px] text-[36px] font-extrabold leading-[0.92] tracking-[-0.055em] sm:text-[46px] lg:text-[50px] xl:text-[50px]">
                Track Today.
                <br />
                <span className="text-[#9DFF16]">Transform</span> Tomorrow.
              </h2>

              <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/65">
                Monitor your daily habits, workouts, nutrition and more. Our AI
                turns your data into progress and helps you stay consistent
                every day.
              </p>
            </div>

            <div className="space-y-2.5">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-3 rounded-[22px] border border-white/5 bg-[#07100A]/70 p-3 backdrop-blur-xl"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#9DFF16]/20 bg-black/30">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold">{item.title}</h4>
                      <p className="mt-0.5 max-w-[155px] text-xs leading-5 text-white/55">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`shrink-0 text-sm font-bold ${item.color}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER DASHBOARD */}
          <div className="h-fit rounded-[34px] border border-[#9DFF16]/20 bg-[#07100A]/78 p-5 backdrop-blur-xl shadow-[0_0_50px_rgba(157,255,22,0.09)] xl:col-start-2 xl:row-start-1 xl:mt-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black lg:text-3xl">
                Your Progress Overview
              </h3>

              <button className="rounded-xl border border-[#9DFF16]/10 bg-black/30 px-4 py-2 text-sm text-white/70">
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
                {
                  icon: TrendingUp,
                  title: "Health Score",
                  value: "82",
                  unit: "/100",
                  sub: "Great Progress!",
                  color: "text-[#9DFF16]",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-[20px] border border-[#9DFF16]/10 bg-black/25 p-3"
                >
                  <div className="flex items-center gap-2">
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                    <p className="text-xs text-white/70">{card.title}</p>
                  </div>

                  <div className="mt-2 flex items-end gap-2">
                    <div className="text-3xl font-black">{card.value}</div>
                    <div className="pb-1 text-xs text-white/50">
                      {card.unit}
                    </div>
                  </div>

                  <p className={`mt-1 text-xs font-semibold ${card.color}`}>
                    {card.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[26px] border border-[#9DFF16]/10 bg-black/25 p-4">
              <div className="mb-2 flex items-start justify-between gap-4">
                <h4 className="flex items-center gap-2 text-lg font-black">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  Weight Trend
                </h4>

                <div className="text-right">
                  <div className="text-3xl font-black text-[#9DFF16]">
                    68.4 kg
                  </div>
                  <p className="text-xs text-white/50">
                    -1.2 kg from last week
                  </p>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weightData}
                    margin={{ top: 10, right: 14, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="weightFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#9DFF16"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="65%"
                          stopColor="#9DFF16"
                          stopOpacity={0.13}
                        />
                        <stop
                          offset="100%"
                          stopColor="#9DFF16"
                          stopOpacity={0}
                        />
                      </linearGradient>

                      <filter id="lineGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <CartesianGrid
                      stroke="rgba(255,255,255,0.07)"
                      vertical
                      horizontal
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.62)", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      domain={[64, 72]}
                      ticks={[64, 66, 68, 70, 72]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#07100A",
                        border: "1px solid rgba(157,255,22,0.25)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#9DFF16"
                      strokeWidth={4}
                      fill="url(#weightFill)"
                      dot={{
                        r: 4,
                        strokeWidth: 2,
                        stroke: "#9DFF16",
                        fill: "#9DFF16",
                      }}
                      activeDot={{
                        r: 7,
                        stroke: "#D8FF7A",
                        strokeWidth: 3,
                        fill: "#9DFF16",
                      }}
                      style={{ filter: "url(#lineGlow)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] border border-[#9DFF16]/10 bg-black/25 p-4">
                <h4 className="font-black">Macronutrient Balance</h4>

                <div className="mt-3 flex items-center gap-5">
                  <div className="h-[108px] w-[108px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          innerRadius={34}
                          outerRadius={52}
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
                      <div key={item.name} className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/75">{item.name}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#9DFF16]/10 bg-black/25 p-4">
                <h4 className="font-black">Calorie Intake</h4>

                <div className="mt-5 text-4xl font-black text-[#9DFF16]">
                  1,650{" "}
                  <span className="text-base text-white/55">
                    / 2,200 kcal
                  </span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[75%] rounded-full bg-[#9DFF16]" />
                </div>

                <p className="mt-2 font-semibold text-[#9DFF16]">
                  75% of daily goal
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex h-full flex-col gap-4 xl:col-start-3 xl:row-start-1 xl:mt-10">
            <div className="rounded-[30px] border border-[#9DFF16]/15 bg-[#07100A]/75 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-[#9DFF16]" />
                <h4 className="text-xl font-black">AI Coach Insights</h4>
              </div>

              <p className="mt-5 text-lg font-black text-[#9DFF16]">
                Great job staying consistent!
              </p>

              <p className="mt-4 leading-7 text-white/65">
                Your protein intake is on point. Try increasing your water
                intake by 0.5L for even better results.
              </p>
            </div>

            <div className="rounded-[30px] border border-[#9DFF16]/15 bg-[#07100A]/75 p-6 backdrop-blur-xl">
              <h4 className="text-xl font-black">Habits Overview</h4>

              <div className="mt-5 space-y-3">
                {habits.map((habit, index) => (
                  <div
                    key={habit.name}
                    className="rounded-2xl border border-white/5 bg-black/25 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <habit.icon className={`h-5 w-5 ${habit.color}`} />
                        <span className="text-sm font-semibold">
                          {habit.name}
                        </span>
                      </div>

                      <div>
                        <div className="mb-1 grid grid-cols-7 gap-2 text-center text-[10px] text-white/45">
                          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                            <span key={`${d}-${i}`}>{d}</span>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <span
                              key={i}
                              className={`grid h-4 w-4 place-items-center rounded-full text-[9px] font-black ${
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

          {/* DAILY STREAK */}
          <div className="self-end rounded-[32px] border border-[#9DFF16]/15 bg-[#07100A]/75 p-6 backdrop-blur-xl xl:col-start-1 xl:row-start-2 xl:min-h-[190px]">
            <div className="flex items-center gap-4">
              <Flame className="h-12 w-12 text-orange-400" />

              <div>
                <h4 className="font-bold">Daily Streak</h4>
                <div className="text-4xl font-black">
                  12 <span className="text-base text-white/60">days</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-white/60">
              Keep it up! Consistency builds results.
            </p>

            <div className="mt-5 flex gap-3">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={`${d}-${i}`} className="text-center">
                  <div className="mb-1 text-xs text-white/45">{d}</div>
                  <div
                    className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-black ${
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

          {/* ACHIEVEMENTS */}
          <div className="self-end rounded-[32px] border border-[#9DFF16]/15 bg-[#07100A]/75 p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(157,255,22,0.07)] xl:col-span-2 xl:col-start-2 xl:row-start-2 xl:min-h-[190px]">
            <div className="mb-5 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-[#9DFF16]" />
              <h4 className="text-xl font-black">Achievements</h4>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {achievements.map((badge) => (
                <div
                  key={badge.title}
                  className="flex min-h-[96px] items-center gap-5 rounded-2xl border border-white/5 bg-black/25 px-6 py-5"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#9DFF16]/20 bg-[#9DFF16]/10">
                    <badge.icon className={`h-6 w-6 ${badge.color}`} />
                  </div>

                  <div className="min-w-0">
                    <h5 className="whitespace-nowrap text-[15px] font-bold">
                      {badge.title}
                    </h5>
                    <p className="mt-1.5 whitespace-nowrap text-[13px] text-white/50">
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