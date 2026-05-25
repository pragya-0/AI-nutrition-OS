"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";
import {
  ArrowRight,
  Play,
  Star,
  Salad,
  ScanLine,
  Activity,
  Leaf,
  Headphones,
} from "lucide-react";

const featureCards = [
  {
    title: "AI Meal Plans",
    subtitle: "Personalized Indian meals",
    icon: Salad,
  },
  {
    title: "Smart Scanner",
    subtitle: "Instant nutrition insights",
    icon: ScanLine,
  },
  {
    title: "Adaptive Engine",
    subtitle: "Real-time adjustments",
    icon: Activity,
  },
  {
    title: "Indian Diet Focus",
    subtitle: "Bengali, Veg, Vegan",
    icon: Leaf,
  },
];

const stats = [
  ["50K+", "Happy Users"],
  ["1M+", "Meals Generated"],
  ["100+", "Indian Recipes"],
  ["24/7", "AI Support"],
];

export default function HeroSection() {
  return (
<section
  className="relative overflow-hidden bg-[#030805] text-[#F5F8F2]"
  style={{ paddingLeft: "60px", paddingRight: "40px", paddingTop: "50px", paddingBottom: "55px" }}
>
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(166,255,77,0.14),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(24,211,208,0.07),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,5,0)_0%,#030805_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1500px]">
        {/* HERO GRID */}
        <div className="grid items-start gap-14 lg:grid-cols-[560px_minmax(0,1fr)] xl:gap-16">
          {/* LEFT CONTENT */}
          <div className="relative z-20 flex w-full max-w-[620px] flex-col pt-6">
            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#A6FF4D]/15 bg-[#A6FF4D]/10 px-4 py-2 text-[10px] font-bold tracking-[0.08em] text-[#A6FF4D] shadow-[0_0_30px_rgba(166,255,77,0.08)] sm:text-[11px]"
            >
              <Star size={12} fill="currentColor" />
              <span className="truncate">
                AI POWERED • SCIENCE BACKED • MADE FOR YOU
              </span>
            </motion.div>

            {/* HEADING */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
          className="max-w-[560px] text-[48px] font-black leading-[0.9] tracking-[-0.06em] text-[#F5F8F2] sm:text-[64px] lg:text-[76px] xl:text-[82px]"
            >
              <span className="block whitespace-nowrap">Your Personal</span>

              <span className="block whitespace-nowrap bg-gradient-to-r from-[#A6FF4D] via-[#8CF53D] to-[#C6FF7B] bg-clip-text text-transparent">
                AI Nutrition
              </span>

              <span className="block">Engine</span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-6 max-w-[470px] text-[15px] leading-7 text-[#A8B5A3] md:text-[17px] md:leading-8"
            >
              Personalized meal plans, smart food scanning, macro tracking and
              adaptive health intelligence powered by AI.
            </motion.p>

            {/* CTA BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#assessment"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A6FF4D] px-6 py-3 text-[15px] font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.22)] transition duration-300 hover:scale-[1.02]"
              >
                Get Your Plan
                <ArrowRight size={16} />
              </a>

              <a
                href="#dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-[15px] font-semibold text-white/90 backdrop-blur-xl transition duration-300 hover:border-[#A6FF4D]/25"
              >
                <Play size={15} fill="currentColor" />
                See How It Works
              </a>
            </motion.div>

            {/* SOCIAL PROOF */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Image
                src="/assets/avatars.png"
                alt="Loved by users"
                width={180}
                height={50}
                className="h-auto w-[160px]"
                priority
              />

              <div>
                <div className="flex gap-1 text-[#A6FF4D]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-1 text-[15px] text-[#A8B5A3]">
                  Loved by 50K+ users
                </p>
              </div>
            </motion.div>

            {/* FEATURE CARDS */}
            <div className="mt-6 grid w-full max-w-[470px] grid-cols-2 gap-3">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[22px] border border-white/10 bg-white/[0.025] p-3.5 backdrop-blur-xl transition duration-300 hover:border-[#A6FF4D]/20 hover:bg-[#A6FF4D]/5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl border border-[#A6FF4D]/15 bg-[#A6FF4D]/10 text-[#A6FF4D]">
                    <card.icon size={19} />
                  </div>

                  <h3 className="text-[14px] font-bold text-[#F5F8F2]">
                    {card.title}
                  </h3>

                  <p className="mt-1 text-[12px] leading-5 text-[#9AA79A]">
                    {card.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT DASHBOARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="relative z-20 flex min-w-0 items-start justify-center pt-10 lg:justify-end lg:pt-10 xl:pt-8"
          >
            {/* Glow */}
            <div className="pointer-events-none absolute right-4 top-10 h-[360px] w-[360px] rounded-full bg-[#A6FF4D]/10 blur-[120px]" />

            <div className="relative z-20 w-full max-w-[760px] overflow-hidden rounded-[34px] border border-[#A6FF4D]/20 shadow-[0_30px_120px_rgba(0,0,0,0.45)] xl:max-w-[900px] 2xl:max-w-[960px]">
              <DashboardPreview />
            </div>
          </motion.div>
        </div>

        {/* TRUST BAR */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="relative z-30 mt-20 overflow-hidden rounded-[30px] border border-white/10 bg-[#07110A]/80 shadow-[0_25px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
        >
          <div className="grid items-center gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Logos */}
            <div className="flex flex-wrap items-center gap-5 px-5 py-5 text-sm text-[#A3B3A3] lg:px-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]">
                AS FEATURED IN
              </span>

              <span className="font-black text-white/70">healthline</span>

              <span className="font-black text-white/70">
                THE TIMES OF INDIA
              </span>

              <span className="font-black text-white/70">INDIA TODAY</span>

              <span className="font-black text-white/70">YOURSTORY</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4 lg:border-l lg:border-t-0">
              {stats.map(([value, label], index) => (
                <div
                  key={value}
                  className="relative px-4 py-5 text-center lg:border-l lg:border-white/10 first:lg:border-l-0"
                >
                  <p className="text-3xl font-black leading-none text-[#A6FF4D] md:text-4xl">
                    {value}
                  </p>

                  <p className="mt-2 text-[11px] text-[#A3B3A3]">
                    {label}
                  </p>

                  {index === 3 && (
                    <Headphones
                      className="mx-auto mt-2 text-[#A6FF4D]"
                      size={18}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
