"use client";

import Image from "@/compat/NextImage";
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
} from "lucide-react";

const ASSESSMENT_LINK = "/dashboard/onboarding";

const featureCards = [
  { title: "AI Meal Plans", subtitle: "Meals for your goals", icon: Salad },
  { title: "Smart Scanner", subtitle: "Instant food insights", icon: ScanLine },
  { title: "Adaptive Engine", subtitle: "Real-time adjustments", icon: Activity },
  { title: "Indian Diet Focus", subtitle: "Bengali, Veg, Vegan", icon: Leaf },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#030805] px-4 pb-4 pt-0 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(147,197,114,0.12),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(147,197,114,0.08),transparent_26%),radial-gradient(circle_at_70%_76%,rgba(24,211,208,0.055),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,5,0)_0%,rgba(3,8,5,0.42)_58%,#030805_100%)]" />

      <div className="pointer-events-none absolute bottom-[70px] left-0 h-[220px] w-full opacity-[0.1]">
        <div className="absolute inset-x-[-10%] bottom-0 h-[170px] rounded-[50%] border-t border-[#93C572]/30" />
        <div className="absolute inset-x-[-5%] bottom-8 h-[160px] rounded-[50%] border-t border-[#93C572]/18" />
        <div className="absolute inset-x-[5%] bottom-16 h-[140px] rounded-[50%] border-t border-[#93C572]/10" />
      </div>

      <Image src="/assets/salad-bowl.png" alt="Healthy food bowl" width={420} height={420} priority className="pointer-events-none absolute right-[-220px] top-[250px] z-0 hidden w-[300px] opacity-90 drop-shadow-[0_30px_70px_rgba(0,0,0,0.6)] lg:block xl:w-[340px]" />
      <Image src="/assets/leaves2.png" alt="" width={220} height={220} className="pointer-events-none absolute right-[-42px] top-[100px] z-0 hidden w-[170px] rotate-[-8deg] opacity-70 lg:block" />
      <Image src="/assets/leaves2.png" alt="" width={260} height={260} className="pointer-events-none absolute bottom-[-90px] right-[120px] z-0 hidden w-[210px] rotate-[18deg] opacity-65 lg:block" />
      <Image src="/assets/leaves2.png" alt="" width={160} height={160} className="pointer-events-none absolute left-[47%] top-[410px] z-0 hidden w-[105px] rotate-[22deg] opacity-52 lg:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[92vw] flex-col justify-center py-8 lg:py-10 2xl:max-w-[1780px]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] xl:gap-10 2xl:gap-12">
          <div className="relative z-20 flex w-full max-w-[720px] flex-col">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#93C572]/20 bg-[#93C572]/10 px-5 py-2.5 text-[12px] font-black tracking-[0.09em] text-[#93C572] shadow-[0_0_24px_rgba(147,197,114,0.08)] sm:text-[13px]"
            >
              <Star size={15} fill="currentColor" />
              <span className="truncate">AI POWERED • WELLNESS FOCUSED • PROFILE FIRST</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-[680px] text-[52px] font-black leading-[0.9] tracking-[-0.065em] text-[#F5F8F2] sm:text-[64px] lg:text-[78px] xl:text-[88px] 2xl:text-[94px]"
            >
              <span className="block whitespace-nowrap">Your Personal</span>
              <span className="block whitespace-nowrap bg-gradient-to-r from-[#93C572] via-[#A2D27F] to-[#D7E9C9] bg-clip-text text-transparent">
                AI Nutrition
              </span>
              <span className="block">Engine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-6 max-w-[680px] text-[20px] leading-9 text-[#A7B0AA] lg:text-[22px] lg:leading-10"
            >
              Personalized meal plans, smart food scanning, macro tracking and adaptive health intelligence powered by AI — generated only after profile confirmation.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mt-8 flex flex-wrap items-center gap-4">
              <a href={ASSESSMENT_LINK} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#93C572] px-8 py-4 text-[20px] font-black text-[#07110A] shadow-[0_0_28px_rgba(147,197,114,0.16)] transition duration-300 hover:scale-[1.02] hover:bg-[#A2D27F] lg:text-[22px]">
                Get Your Plan
                <ArrowRight size={22} />
              </a>
              <a href="#features" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-8 py-4 text-[20px] font-bold text-white/90 backdrop-blur-xl transition duration-300 hover:border-[#93C572]/24 hover:bg-white/[0.07] lg:text-[22px]">
                <Play size={21} fill="currentColor" />
                See How It Works
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap items-center gap-5">
              <Image src="/assets/avatars.png" alt="Loved by users" width={180} height={50} className="h-auto w-[172px]" priority />
              <div>
                <div className="flex gap-1 text-[#93C572]">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}
                </div>
                <p className="mt-1 text-[16px] text-[#A7B0AA]">Loved by wellness-first users</p>
              </div>
            </motion.div>

            <div id="features" className="mt-8 grid max-w-[720px] scroll-mt-28 grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {featureCards.map((card) => (
                <div key={card.title} className="flex flex-col items-start">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#93C572]/20 bg-[#93C572]/10 text-[#93C572]">
                    <card.icon size={25} />
                  </div>
                  <h3 className="text-[18px] font-black leading-tight text-white lg:text-[20px]">{card.title}</h3>
                  <p className="mt-1 text-[15px] leading-5 text-[#9FA89F] lg:text-[16px]">{card.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.16 }} className="relative z-20 flex min-w-0 items-center justify-center pt-0 lg:justify-end lg:pt-0 xl:pt-2">
            <div className="pointer-events-none absolute right-8 top-20 h-[420px] w-[420px] rounded-full bg-[#93C572]/10 blur-[135px]" />
            <div className="relative z-20 w-full max-w-[860px] overflow-hidden rounded-[34px] border border-[#93C572]/18 bg-[#061009]/70 shadow-[0_32px_120px_rgba(0,0,0,0.52),0_0_54px_rgba(147,197,114,0.065)] xl:max-w-[1120px] 2xl:max-w-[1160px]">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-[34px] ring-1 ring-inset ring-white/5" />
              <DashboardPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
