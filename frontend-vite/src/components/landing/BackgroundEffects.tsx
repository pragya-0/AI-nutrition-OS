"use client";

import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      {/* BASE */}
      <div className="absolute inset-0 bg-[#030805]" />

      {/* MAIN GREEN GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.35, 0.45, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-120px] top-[-100px] h-[520px] w-[520px] rounded-full bg-[#A6FF4D]/20 blur-[140px]"
      />

      {/* TEAL GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.18, 0.28, 0.18],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-180px] top-[180px] h-[600px] w-[600px] rounded-full bg-[#18D3D0]/10 blur-[160px]"
      />

      {/* BOTTOM GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-240px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#7BE929]/10 blur-[180px]"
      />

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:120px_120px]" />

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
