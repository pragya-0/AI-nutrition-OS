"use client";

import { motion } from "framer-motion";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
}

export default function AnalyticsCard({
  title,
  value,
  unit,
  icon,
}: AnalyticsCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-zinc-800
        bg-zinc-900/60
        backdrop-blur-xl
        p-6
        shadow-[0_0_30px_rgba(34,197,94,0.08)]
      "
    >
      {/* Glow Effect */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-green-500/5
          to-transparent
          pointer-events-none
        "
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Top */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-zinc-400 text-sm font-medium">
            {title}
          </p>

          {icon && (
            <div
              className="
                w-10
                h-10
                rounded-2xl
                bg-green-500/10
                border
                border-green-500/20
                flex
                items-center
                justify-center
                text-lg
              "
            >
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end gap-1">
          <h2
            className="
              text-3xl
              lg:text-4xl
              font-bold
              text-white
            "
          >
            {value}
          </h2>

          {unit && (
            <span className="text-zinc-400 mb-1">
              {unit}
            </span>
          )}
        </div>

        {/* Bottom Accent */}
        <div
          className="
            mt-5
            h-[4px]
            w-full
            rounded-full
            bg-gradient-to-r
            from-green-400
            to-emerald-600
          "
        />
      </div>
    </motion.div>
  );
}