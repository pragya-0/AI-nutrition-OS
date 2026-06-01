"use client";

import type React from "react";
import Image from "@/compat/NextImage";
import {
  Activity,
  Flame,
  Heart,
  TrendingUp,
  Dumbbell,
  HeartPulse,
  Droplets,
  Moon,
  Briefcase,
} from "lucide-react";

const leftFeatures = [
  {
    title: "Tracks Your Activity",
    desc: "Steps, workouts, active minutes and more from your devices and apps.",
    icon: Activity,
  },
  {
    title: "Monitors Body Changes",
    desc: "Weight, body fat, measurements and progress over time.",
    icon: TrendingUp,
  },
  {
    title: "AI Analyzes & Adjusts",
    desc: "Calories, macros, workouts and recovery plans updated automatically.",
    icon: HeartPulse,
  },
  {
    title: "You Stay on Track",
    desc: "Smarter adjustments = faster results with sustainable progress.",
    icon: Dumbbell,
  },
];

const topInsightCards = [
  {
    title: "Calories",
    subtitle: "On Track",
    icon: Flame,
    color: "text-[#A6FF4D]",
  },
  {
    title: "Workouts",
    subtitle: "Completed",
    icon: Activity,
    color: "text-[#18D3D0]",
  },
  {
    title: "Recovery",
    subtitle: "Good",
    icon: Heart,
    color: "text-[#FF7A1A]",
  },
  {
    title: "Progress",
    subtitle: "Improving",
    icon: TrendingUp,
    color: "text-[#A6FF4D]",
  },
];

const bottomFeatures = [
  {
    title: "Dynamic Calorie Adjustment",
    desc: "Based on your activity & goals",
    icon: Activity,
  },
  {
    title: "Smart Workout Adaptation",
    desc: "Intensity adjusts to your performance",
    icon: Dumbbell,
  },
  {
    title: "Better Recovery Planning",
    desc: "AI ensures optimal rest & recovery",
    icon: HeartPulse,
  },
  {
    title: "Sustainable Results",
    desc: "Long-term health, not quick fixes",
    icon: TrendingUp,
  },
];

export default function AdaptiveEngineSection() {
  return (
    <section className="relative overflow-hidden bg-[#030805] px-4 pb-12 pt-12 text-[#F5F8F2] sm:px-6 lg:px-8 lg:pt-14 xl:px-10 2xl:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(166,255,77,0.12),transparent_44%)]" />

      {/* Athlete */}
      <Image
        src="/assets/man.png"
        alt="Fitness Athlete"
        width={620}
        height={980}
        className="pointer-events-none absolute right-[-120px] top-[18px] z-[12] hidden w-[24vw] max-w-[450px] min-w-[360px] opacity-95 xl:block 2xl:right-[-90px]"
        priority
      />

      <div className="relative z-10 mx-auto w-full max-w-[92vw] 2xl:max-w-[1780px]">
        <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.96fr_1.02fr] xl:gap-10 2xl:gap-12">
          {/* LEFT CONTENT */}
          <div className="relative z-20 max-w-[720px]">
            <div className="mb-5 inline-flex rounded-full border border-[#A6FF4D]/25 bg-[#A6FF4D]/10 px-5 py-2.5 text-[12px] font-bold tracking-wide text-[#A6FF4D] sm:text-[13px]">
              ADAPTIVE HEALTH ENGINE
            </div>

            <h2 className="max-w-[720px] text-[44px] font-black leading-[0.94] tracking-[-0.06em] sm:text-[56px] lg:text-[64px] xl:text-[76px] 2xl:text-[84px]">
              Your Plan Adapts.
              <br />
              <span className="bg-gradient-to-r from-[#A6FF4D] to-[#7BFF57] bg-clip-text text-transparent">
                You Get Results.
              </span>
            </h2>

            <p className="mt-5 max-w-[680px] text-[18px] leading-8 text-[#A3B3A3] lg:text-[20px] xl:text-[21px]">
              Our AI continuously learns from your daily activities, body
              changes, and habits to adjust calories, workouts, and recovery —
              in real time.
            </p>

            <div className="relative mt-8 space-y-6">
              <div className="absolute left-7 top-5 hidden h-[83%] w-px bg-[#A6FF4D]/20 lg:block" />

              {leftFeatures.map((feature) => (
                <div key={feature.title} className="relative flex gap-5">
                  <div className="relative z-10 flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border border-[#A6FF4D]/25 bg-[#07110A] text-[#A6FF4D] shadow-[0_0_30px_rgba(166,255,77,0.12)]">
                    <feature.icon size={26} />
                  </div>

                  <div>
                    <h3 className="text-[19px] font-bold xl:text-[20px]">
                      {feature.title}
                    </h3>
                    <p className="mt-1 max-w-[520px] text-[15px] leading-6 text-[#A3B3A3] xl:text-[16px]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER PHONE + ORBIT */}
          <div className="relative z-10 flex min-h-[560px] items-start justify-center pt-12 lg:min-h-[650px]">
            <Image
              src="/assets/Orbitalmesh.png"
              alt="Orbit Ring"
              width={1100}
              height={1100}
              className="absolute left-1/2 top-[64px] z-0 w-[56vw] max-w-[960px] min-w-[680px] -translate-x-1/2 opacity-[0.72]"
            />

            <Metric
              className="left-[18px] top-[150px]"
              value="8,432"
              label="Steps"
              icon={<Activity />}
            />
            <Metric
              className="left-[-4px] top-[302px]"
              value="2.1L"
              label="Water"
              color="text-[#18D3D0]"
              icon={<Droplets />}
            />
            <Metric
              className="left-[58px] top-[458px]"
              value="7h 30m"
              label="Sleep"
              icon={<Moon />}
            />

            <Metric
              className="right-[10px] top-[160px]"
              value="578"
              label="Active kcal"
              color="text-[#FFB84D]"
              icon={<Flame />}
            />
            <Metric
              className="right-[-4px] top-[312px]"
              value="-1.2 kg"
              label="This Week"
              icon={<Briefcase />}
            />
            <Metric
              className="right-[58px] top-[462px]"
              value="68"
              label="Resting HR"
              color="text-[#FF5B4D]"
              icon={<Heart />}
            />

            <div className="absolute top-[190px] h-[360px] w-[360px] rounded-full bg-[#A6FF4D]/10 blur-[105px]" />

            <div className="relative z-20 mt-12 w-[220px] sm:w-[245px] xl:w-[295px] 2xl:w-[320px]">
              <Image
                src="/assets/adapativephone.png"
                alt="Adaptive Phone"
                width={900}
                height={1800}
                className="h-auto w-full object-contain drop-shadow-[0_0_70px_rgba(166,255,77,0.2)]"
                priority
              />
            </div>
          </div>

          {/* RIGHT ANALYTICS */}
          <div className="relative z-20 max-w-[620px] space-y-4 justify-self-start lg:-ml-5 xl:-ml-8">
            <div className="rounded-[26px] border border-[#A6FF4D]/15 bg-[#07110A]/78 p-4 shadow-[0_0_50px_rgba(166,255,77,0.06)] backdrop-blur-md xl:p-5">
              <h3 className="mb-4 text-[22px] font-bold xl:text-[24px]">
                Real-Time Insights
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {topInsightCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-white/10 bg-[#07110A]/82 p-3 text-center"
                  >
                    <card.icon
                      size={28}
                      className={`mx-auto mb-2 ${card.color}`}
                    />
                    <p className="text-[14px] font-bold">{card.title}</p>
                    <p className="mt-1 text-xs text-[#A3B3A3]">
                      {card.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-[#A6FF4D]/15 bg-[#07110A]/78 p-4 backdrop-blur-md xl:p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[22px] font-bold xl:text-[24px]">
                  Progress Over Time
                </h3>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[#A3B3A3]">
                  This Week
                </div>
              </div>

              <div className="relative mt-4 h-[180px] overflow-hidden rounded-2xl border border-white/5 bg-[linear-gradient(180deg,rgba(166,255,77,0.13),rgba(166,255,77,0.02))] xl:h-[200px]">
                <svg viewBox="0 0 520 230" className="h-full w-full">
                  <defs>
                    <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#A6FF4D"
                        stopOpacity="0.35"
                      />
                      <stop
                        offset="100%"
                        stopColor="#A6FF4D"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {[40, 80, 120, 160, 200].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={y}
                      x2="500"
                      y2={y}
                      stroke="rgba(255,255,255,0.06)"
                    />
                  ))}

                  <path
                    d="M45 150 C85 140, 90 108, 130 110 C170 112, 175 108, 210 105 C245 78, 270 75, 300 95 C330 120, 360 134, 400 130 C440 126, 455 96, 490 88 L490 220 L45 220 Z"
                    fill="url(#area)"
                  />

                  <path
                    d="M45 150 C85 140, 90 108, 130 110 C170 112, 175 108, 210 105 C245 78, 270 75, 300 95 C330 120, 360 134, 400 130 C440 126, 455 96, 490 88"
                    fill="none"
                    stroke="#A6FF4D"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {[45, 95, 140, 210, 260, 315, 365, 415, 465, 490].map(
                    (x, i) => {
                      const y = [
                        150, 120, 110, 105, 78, 105, 130, 128, 100, 88,
                      ][i];

                      return (
                        <circle key={x} cx={x} cy={y} r="5" fill="#A6FF4D" />
                      );
                    },
                  )}

                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, i) => (
                      <text
                        key={day}
                        x={65 + i * 68}
                        y="210"
                        fill="#A3B3A3"
                        fontSize="12"
                      >
                        {day}
                      </text>
                    ),
                  )}
                </svg>

                <div className="absolute right-4 top-5 rounded-2xl border border-[#A6FF4D]/30 bg-[#07110A]/85 px-4 py-3">
                  <p className="text-sm font-bold">Great Progress!</p>
                  <p className="mt-1 text-xs text-[#A3B3A3]">Keep it up.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[#A6FF4D]/15 bg-[#07110A]/78 p-4 backdrop-blur-md xl:p-5">
              <div className="flex items-center gap-4">
                <Image
                  src="/assets/ai-coach.png"
                  alt="AI Coach"
                  width={140}
                  height={140}
                  className="h-auto w-[86px] shrink-0 xl:w-[96px]"
                />

                <div>
                  <h3 className="text-[22px] font-bold xl:text-[24px]">
                    AI Coach Tip
                  </h3>
                  <p className="mt-1.5 text-[15px] font-bold text-[#A6FF4D] xl:text-[16px]">
                    You've been consistent for 5 days!
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#A3B3A3] xl:text-[15px]">
                    Add 10g more protein to dinner to hit your daily goal.
                  </p>

                  <button className="mt-3 rounded-2xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/10 px-4 py-2 text-sm font-bold text-[#A6FF4D] transition hover:bg-[#A6FF4D]/20">
                    View Meal Suggestions →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FEATURE BAR */}
        <div className="mt-10 grid gap-5 rounded-[30px] border border-[#A6FF4D]/15 bg-[#07110A]/70 p-5 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4 xl:p-6">
          {bottomFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 border-white/10 xl:border-r xl:last:border-r-0 xl:pr-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#A6FF4D]/20 bg-[#07110A] text-[#A6FF4D]">
                <feature.icon size={24} />
              </div>

              <div>
                <h3 className="text-base font-bold xl:text-[17px]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-[#A3B3A3] xl:text-[15px]">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
  icon,
  color = "text-[#F5F8F2]",
  className,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  className: string;
}) {
  return (
    <div className={`absolute hidden text-center lg:block ${className}`}>
      <div className="mx-auto mb-2 flex h-13 w-13 items-center justify-center rounded-full border border-[#A6FF4D]/25 bg-[#07110A]/90 text-[#A6FF4D] shadow-[0_0_28px_rgba(166,255,77,0.12)]">
        <div className="[&>svg]:h-7 [&>svg]:w-7">{icon}</div>
      </div>
      <p className={`text-[24px] font-black leading-none ${color}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-[#A3B3A3]">{label}</p>
    </div>
  );
}