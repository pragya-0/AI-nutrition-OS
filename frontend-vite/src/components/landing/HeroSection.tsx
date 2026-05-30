"use client";

import Image from "@/compat/NextImage";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";
import {
  ArrowRight,
  Play,
  Star,
  Salad,
  ScanLine,
  Activity,
  Leaf,
} from "lucide-react";

const featureCards = [
  {
    title: "AI Meal Plans",
    subtitle: "Meals for your goals",
    icon: Salad,
  },
  {
    title: "Smart Scanner",
    subtitle: "Instant food insights",
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

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030805] px-5 pb-8 pt-0 text-[#F5F8F2] sm:px-8 lg:px-14 xl:px-16 2xl:px-20">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(166,255,77,0.16),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(166,255,77,0.11),transparent_26%),radial-gradient(circle_at_70%_76%,rgba(24,211,208,0.06),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,5,0)_0%,rgba(3,8,5,0.38)_58%,#030805_100%)]" />

      {/* Decorative wave */}
      <div className="pointer-events-none absolute bottom-[70px] left-0 h-[220px] w-full opacity-[0.14]">
        <div className="absolute inset-x-[-10%] bottom-0 h-[170px] rounded-[50%] border-t border-[#A6FF4D]/35" />
        <div className="absolute inset-x-[-5%] bottom-8 h-[160px] rounded-[50%] border-t border-[#A6FF4D]/20" />
        <div className="absolute inset-x-[5%] bottom-16 h-[140px] rounded-[50%] border-t border-[#A6FF4D]/12" />
      </div>

      {/* Food Bowl */}
      <Image
        src="/assets/salad-bowl.png"
        alt="Healthy food bowl"
        width={420}
        height={420}
        priority
        className="pointer-events-none absolute right-[-220px] top-[250px] z-0 hidden w-[300px] opacity-95 drop-shadow-[0_30px_70px_rgba(0,0,0,0.6)] lg:block xl:w-[340px]"
      />

      {/* Leaves */}
      <Image
        src="/assets/leaves2.png"
        alt=""
        width={220}
        height={220}
        className="pointer-events-none absolute right-[-42px] top-[100px] z-0 hidden w-[170px] rotate-[-8deg] opacity-80 lg:block"
      />

      <Image
        src="/assets/leaves2.png"
        alt=""
        width={260}
        height={260}
        className="pointer-events-none absolute bottom-[-90px] right-[120px] z-0 hidden w-[210px] rotate-[18deg] opacity-70 lg:block"
      />

      <Image
        src="/assets/leaves2.png"
        alt=""
        width={160}
        height={160}
        className="pointer-events-none absolute left-[47%] top-[410px] z-0 hidden w-[105px] rotate-[22deg] opacity-60 lg:block"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-145px)] w-full max-w-[1560px] flex-col justify-center">
        {/* HERO GRID */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] xl:gap-12 2xl:gap-14">
          {/* LEFT CONTENT */}
          <div className="relative z-20 flex w-full max-w-[560px] flex-col">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#A6FF4D]/20 bg-[#A6FF4D]/10 px-4 py-2 text-[10px] font-black tracking-[0.09em] text-[#A6FF4D] shadow-[0_0_30px_rgba(166,255,77,0.08)] sm:text-[11px]"
            >
              <Star size={12} fill="currentColor" />
              <span className="truncate">
                AI POWERED • SCIENCE BACKED • MADE FOR YOU
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-[510px] text-[46px] font-black leading-[0.9] tracking-[-0.065em] text-[#F5F8F2] sm:text-[60px] lg:text-[70px] xl:text-[74px] 2xl:text-[78px]"
            >
              <span className="block whitespace-nowrap">Your Personal</span>

              <span className="block whitespace-nowrap bg-gradient-to-r from-[#A6FF4D] via-[#8CF53D] to-[#C6FF7B] bg-clip-text text-transparent">
                AI Nutrition
              </span>

              <span className="block">Engine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-5 max-w-[455px] text-[15px] leading-7 text-[#A8B5A3] md:text-[16px] md:leading-8"
            >
              Personalized meal plans, smart food scanning, macro tracking and
              adaptive health intelligence powered by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
 <Link
  to="/dashboard"
  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A6FF4D] px-7 py-3.5 text-[15px] font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.22)] transition duration-300 hover:scale-[1.02] hover:bg-[#B8FF6C]"
>
  Get Your Plan
  <ArrowRight size={17} />
</Link>

              <a
                href="#dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-7 py-3.5 text-[15px] font-bold text-white/90 backdrop-blur-xl transition duration-300 hover:border-[#A6FF4D]/30 hover:bg-white/[0.07]"
              >
                <Play size={15} fill="currentColor" />
                See How It Works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-7 flex flex-wrap items-center gap-4"
            >
              <Image
                src="/assets/avatars.png"
                alt="Loved by users"
                width={180}
                height={50}
                className="h-auto w-[152px]"
                priority
              />

              <div>
                <div className="flex gap-1 text-[#A6FF4D]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-1 text-[14px] text-[#A8B5A3]">
                  Loved by 50K+ users
                </p>
              </div>
            </motion.div>

            {/* Feature Icons */}
            <div className="mt-7 grid max-w-[620px] grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">
              {featureCards.map((card) => (
                <div key={card.title} className="flex flex-col items-start">
                  <div className="mb-3 flex h-13 w-13 items-center justify-center rounded-2xl border border-[#A6FF4D]/20 bg-[#A6FF4D]/10 text-[#A6FF4D]">
                    <card.icon size={22} />
                  </div>

                  <h3 className="text-[12px] font-black text-white">
                    {card.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-[#9AA79A]">
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
            className="relative z-20 flex min-w-0 items-center justify-center pt-0 lg:justify-end lg:pt-0 xl:pt-2"
          >
            <div className="pointer-events-none absolute right-8 top-20 h-[420px] w-[420px] rounded-full bg-[#A6FF4D]/12 blur-[135px]" />

            <div className="relative z-20 w-full max-w-[860px] overflow-hidden rounded-[34px] border border-[#A6FF4D]/20 bg-[#061009]/70 shadow-[0_32px_130px_rgba(0,0,0,0.55),0_0_70px_rgba(166,255,77,0.08)] xl:max-w-[1120px] 2xl:max-w-[1160px]">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-[34px] ring-1 ring-inset ring-white/5" />
              <DashboardPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}