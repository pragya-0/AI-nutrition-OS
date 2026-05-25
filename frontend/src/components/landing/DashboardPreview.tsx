"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DashboardPreview() {
  return (
    <motion.div
      id="dashboard"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      <div className="absolute -inset-6 rounded-[44px] bg-[#A6FF4D]/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[34px] border border-[#A6FF4D]/25 bg-[#07110A]/80 p-2 shadow-[0_40px_140px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        <Image
          src="/assets/dashboard-preview.png"
          alt="NutriAI dashboard preview"
          width={1200}
          height={700}
          priority
          className="h-auto w-full rounded-[28px] object-cover"
        />
      </div>
    </motion.div>
  );
}