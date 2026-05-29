"use client";

import { motion } from "framer-motion";
import {
  Brain,
  HeartPulse,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const items = [
  {
    title: "AI Meal Planning",
    text: "Personalized Indian meal plans built around calories, macros, goals, and cuisine preferences.",
    icon: Brain,
  },
  {
    title: "Smart Scanner",
    text: "Scan meals instantly and detect calories, macros, and nutritional insights using AI vision.",
    icon: ScanLine,
  },
  {
    title: "Health Safety",
    text: "Medical-aware recommendations with intelligent food filtering and safe nutrition guidance.",
    icon: ShieldCheck,
  },
  {
    title: "Progress Tracking",
    text: "Monitor improvements with analytics, scoring systems, and adaptive AI coaching.",
    icon: HeartPulse,
  },
];

export default function FeaturedBar() {
  return (
    <section className="relative overflow-hidden bg-[#030805] px-5 py-10 text-[#F5F8F2] md:py-12">
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-[1320px] bg-gradient-to-r from-transparent via-[#A6FF4D]/35 to-transparent" />

      <div className="absolute right-0 top-0 h-[320px] w-[320px] rounded-full bg-[#18D3D0]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[1320px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-[34px] border border-white/10 bg-[#07110A]/80 p-5 shadow-[0_25px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:p-7"
        >
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#A6FF4D]/25 bg-[#A6FF4D]/10 px-5 py-2 text-sm font-bold text-[#A6FF4D]">
                <Sparkles size={16} />
                Premium Features
              </div>

              <h3 className="text-3xl font-black leading-[1.05] tracking-[-0.04em] md:text-4xl xl:text-5xl">
                Built like a complete
                <span className="block bg-gradient-to-r from-[#A6FF4D] via-[#7BE929] to-[#18D3D0] bg-clip-text text-transparent">
                  nutrition operating system.
                </span>
              </h3>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#A3B3A3] md:text-base">
              Designed for modern health tracking, Indian food intelligence,
              AI-powered meal planning, and futuristic wellness analytics.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#A6FF4D]/30 hover:bg-[#A6FF4D]/[0.05]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_32px_rgba(166,255,77,0.12)]">
                  <item.icon size={24} />
                </div>

                <h4 className="text-lg font-black text-[#F5F8F2]">
                  {item.title}
                </h4>

                <p className="mt-3 text-sm leading-6 text-[#A3B3A3]">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-[28px] border border-[#A6FF4D]/20 bg-[#A6FF4D]/10 p-5 md:grid-cols-3">
            {[
              ["50K+", "users guided"],
              ["1M+", "meals analyzed"],
              ["92%", "avg health score"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="rounded-2xl border border-white/5 bg-black/10 p-5 text-center"
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#A6FF4D]/10 px-3 py-1 text-xs font-bold text-[#A6FF4D]">
                  <TrendingUp size={12} />
                  Growth
                </div>

                <p className="text-3xl font-black text-[#A6FF4D] md:text-4xl">
                  {value}
                </p>

                <p className="mt-2 text-sm text-[#A3B3A3]">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
