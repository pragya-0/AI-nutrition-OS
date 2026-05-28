"use client";

import Image from "next/image";
import {
  Activity,
  Brain,
  Heart,
  HeartPulse,
  Leaf,
  Lock,
  Play,
  ShieldCheck,
  Sprout,
  Target,
  Users,
  Utensils,
} from "lucide-react";

const differenceItems = [
  {
    icon: Sprout,
    title: "India-First Approach",
    text: "Built with local foods, Indian meals & cultural understanding.",
  },
  {
    icon: Brain,
    title: "AI That Learns You",
    text: "Our AI adapts to your body, habits, progress & feedback in real time.",
  },
  {
    icon: Utensils,
    title: "Science + Tradition",
    text: "Blending modern nutrition science with age-old Indian wisdom.",
  },
  {
    icon: Target,
    title: "Sustainable Results",
    text: "No crash diets. No unrealistic plans. Just long-term health that fits your life.",
  },
];

const stats = [
  {
    icon: Users,
    value: "50K+",
    title: "Happy Users",
    text: "Trust NutriAI every day",
    color: "text-[#9DFF16]",
    border: "border-[#9DFF16]/30",
  },
  {
    icon: Utensils,
    value: "50K+",
    title: "Indian Foods",
    text: "In our AI Nutrition Database",
    color: "text-cyan-400",
    border: "border-cyan-400/30",
  },
  {
    icon: Brain,
    value: "99.2%",
    title: "Personalization Accuracy",
    text: "Plans that truly fit you",
    color: "text-orange-400",
    border: "border-orange-400/30",
  },
  {
    icon: Users,
    value: "20+",
    title: "Nutrition Experts",
    text: "Behind our AI Engine",
    color: "text-cyan-400",
    border: "border-cyan-400/30",
  },
  {
    icon: Heart,
    value: "100%",
    title: "Privacy Focused",
    text: "Your data is always safe",
    color: "text-rose-400",
    border: "border-rose-400/30",
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Evidence Based Nutrition",
  },
  {
    icon: HeartPulse,
    title: "Designed by Experts",
  },
  {
    icon: Lock,
    title: "100% Secure & Private",
  },
];

export default function AboutSection() {
  return (
    <section className="relative mx-auto w-full overflow-hidden bg-[#030805] py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(157,255,22,0.02),transparent_32%)]" />

      <div className="relative mx-auto flex w-full max-w-[1600px] justify-center px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="relative mx-auto w-full max-w-[1320px] rounded-[28px] border border-[#9DFF16]/16 bg-[#041007]/72 p-5 shadow-[0_0_36px_rgba(157,255,22,0.035)] backdrop-blur-xl sm:p-6 lg:p-7 xl:p-8">
          <div className="grid items-center gap-6 xl:grid-cols-[0.72fr_1.32fr_0.64fr]">
            {/* LEFT COLUMN */}
            <div className="min-w-0 pl-2 xl:pl-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#9DFF16]/22 bg-black/28 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#9DFF16] shadow-[0_0_12px_rgba(157,255,22,0.07)]">
                <Leaf className="h-3.5 w-3.5" />
                ABOUT NUTRIAI
              </div>

              <h2 className="mt-6 max-w-[290px] text-[34px] font-extrabold leading-[1.03] tracking-[-0.055em] sm:text-[42px] lg:text-[44px] xl:text-[38px] 2xl:text-[42px]">
                AI Nutrition.
                <br />
                Built for <span className="text-[#9DFF16]">India.</span>
              </h2>

              <h3 className="mt-6 max-w-[300px] text-[15px] font-extrabold leading-snug text-white/86">
                Real Science. Real Food. Real Results.
              </h3>

              <p className="mt-5 max-w-[290px] text-[13px] leading-7 text-white/54">
                NutriAI is more than just a calorie tracker. We’re an AI-powered
                nutrition ecosystem designed for Indian lifestyles, traditions,
                and goals.
              </p>

              <p className="mt-8 max-w-[290px] text-[13px] leading-7 text-white/54">
                We understand Indian bodies, our diverse cuisines, busy routines
                and cultural preferences. That’s why our AI creates plans that
                are realistic, sustainable and effective.
              </p>

              <button className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-[#9DFF16] px-5 py-3 text-sm font-black text-black shadow-[0_0_14px_rgba(157,255,22,0.16)] transition hover:scale-[1.02]">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-black/35">
                  <Play className="h-3 w-3 fill-black" />
                </span>
                Our Story in 90 Seconds
              </button>
            </div>

            {/* CENTER IMAGE */}
            <div className="relative min-w-0">
              <div className="absolute -inset-3 rounded-[30px] bg-[#9DFF16]/2 blur-[70px]" />

              <div className="relative overflow-hidden rounded-[24px] border border-[#9DFF16]/22 bg-black/35 shadow-[0_0_32px_rgba(157,255,22,0.055)]">
                <Image
                  src="/assets/about/family-dinner.png"
                  alt="Indian family eating healthy dinner"
                  width={1000}
                  height={620}
                  className="h-[270px] w-full object-cover sm:h-[315px] lg:h-[325px] xl:h-[288px] 2xl:h-[305px]"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#030805]/68 via-transparent to-[#030805]/12" />

                <div className="absolute left-5 top-10 hidden rounded-2xl border border-cyan-400/28 bg-[#061009]/76 px-3.5 py-2 shadow-[0_0_14px_rgba(34,211,238,0.09)] backdrop-blur-xl sm:block">
                  <div className="flex items-center gap-2.5">
                    <Brain className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-[12px] font-black">
                        AI Personalization
                      </p>
                      <p className="text-[10.5px] text-white/56">
                        Adapts to you
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-5 top-12 hidden rounded-2xl border border-[#9DFF16]/32 bg-[#061009]/76 px-3.5 py-2 shadow-[0_0_14px_rgba(157,255,22,0.09)] backdrop-blur-xl sm:block">
                  <div className="flex items-center gap-2.5">
                    <Utensils className="h-5 w-5 text-[#9DFF16]" />
                    <div>
                      <p className="text-[12px] font-black">
                        Indian Food Database
                      </p>
                      <p className="text-[10.5px] text-white/56">
                        50K+ Local Dishes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-5 hidden rounded-2xl border border-[#9DFF16]/32 bg-[#061009]/76 px-3.5 py-2 shadow-[0_0_14px_rgba(157,255,22,0.09)] backdrop-blur-xl sm:block">
                  <div className="flex items-center gap-2.5">
                    <Activity className="h-5 w-5 text-[#9DFF16]" />
                    <div>
                      <p className="text-[12px] font-black text-[#9DFF16]">
                        Real-Time Adaptation
                      </p>
                      <p className="text-[10.5px] text-white/56">
                        Your body, our priority
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-16 left-8 hidden h-12 w-12 place-items-center rounded-full border border-cyan-400/28 bg-black/42 shadow-[0_0_16px_rgba(34,211,238,0.09)] backdrop-blur-xl sm:grid">
                  <Brain className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="min-w-0">
              <h3 className="mb-6 text-[17px] font-black">
                Why NutriAI is Different?
              </h3>

              <div className="space-y-5">
                {differenceItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 border-b border-[#9DFF16]/10 pb-4 last:border-none"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#9DFF16]/20 bg-black/30 shadow-[0_0_12px_rgba(157,255,22,0.055)]">
                      <item.icon className="h-5 w-5 text-[#9DFF16]" />
                    </div>

                    <div>
                      <h4 className="text-[13.5px] font-black leading-snug text-white/94">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-[12px] leading-[1.65] text-white/48">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="mt-6 grid gap-4 rounded-[24px] border border-[#9DFF16]/13 bg-black/18 p-3.5 shadow-[inset_0_0_22px_rgba(157,255,22,0.016)] lg:grid-cols-[1.58fr_0.72fr] xl:p-4">
            <div className="min-w-0">
              <div className="mx-auto flex max-w-[280px] items-center justify-center gap-3 text-[#9DFF16]">
                <div className="h-px flex-1 bg-[#9DFF16]/34" />
                <span className="text-[12.5px] font-black">Our Mission</span>
                <div className="h-px flex-1 bg-[#9DFF16]/34" />
              </div>

              <h3 className="mx-auto mt-2.5 max-w-[600px] text-center text-[16px] font-bold leading-snug sm:text-[18px] xl:text-[18px]">
                To make India healthier through personalized nutrition, powered
                by <span className="text-[#9DFF16]"> AI</span> and rooted in{" "}
                <span className="text-[#9DFF16]">our culture.</span>
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="flex min-w-0 items-center gap-3 xl:block"
                  >
                    <div
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${stat.border} bg-black/28 shadow-[0_0_12px_rgba(157,255,22,0.032)] xl:mb-2`}
                    >
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>

                    <div className="min-w-0">
                      <div
                        className={`text-[23px] font-black leading-none ${stat.color}`}
                      >
                        {stat.value}
                      </div>

                      <h4 className="mt-1 text-[11.5px] font-bold leading-snug text-white/90">
                        {stat.title}
                      </h4>

                      <p className="mt-0.5 text-[10px] leading-4 text-white/45">
                        {stat.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRUST CARD */}
            <div className="rounded-[26px] border border-white/6 bg-black/24 p-7 shadow-[inset_0_0_30px_rgba(34,211,238,0.028)]">
              <h3 className="text-center text-[20px] font-bold tracking-[-0.02em]">
                Backed by Science. Built with Trust.
              </h3>

              <div className="mt-8 grid grid-cols-3 gap-6">
                {trustItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-cyan-400/24 bg-black/35 shadow-[0_0_16px_rgba(34,211,238,0.06)]">
                      <item.icon className="h-7 w-7 text-cyan-400" />
                    </div>

                    <p className="mt-5 max-w-[92px] text-[11px] font-semibold leading-[1.35] text-white/70">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}