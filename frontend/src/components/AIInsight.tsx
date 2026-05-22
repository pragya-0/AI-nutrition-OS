"use client";

import { motion } from "framer-motion";

interface AIInsightProps {
  message: string;
}

export default function AIInsight({
  message,
}: AIInsightProps) {

  if (!message) {
    return null;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-green-500/20
        bg-zinc-900/60
        backdrop-blur-xl
        p-6
        lg:p-8
      "
    >

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-green-500/5
          via-transparent
          to-emerald-500/5
          pointer-events-none
        "
      />

      {/* TOP SECTION */}
      <div className="relative z-10 flex items-start gap-5">

        {/* AI ICON */}
        <div
          className="
            w-16
            h-16
            rounded-3xl
            bg-green-500/10
            border
            border-green-500/20
            flex
            items-center
            justify-center
            text-3xl
            shrink-0
            shadow-[0_0_20px_rgba(34,197,94,0.15)]
          "
        >
          🤖
        </div>

        {/* CONTENT */}
        <div className="flex-1">

          <div className="flex items-center gap-3 mb-3">

            <h2
              className="
                text-2xl
                lg:text-3xl
                font-bold
                text-white
              "
            >
              AI Nutrition Coach
            </h2>

            <div
              className="
                px-3
                py-1
                rounded-full
                bg-green-500/10
                border
                border-green-500/20
                text-green-400
                text-sm
                font-medium
              "
            >
              LIVE AI
            </div>
          </div>

          <p
            className="
              text-zinc-300
              text-lg
              leading-relaxed
            "
          >
            {message}
          </p>
        </div>
      </div>

      {/* QUICK INSIGHTS */}
      <div
        className="
          relative
          z-10
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-4
          mt-8
        "
      >

        {/* CARD 1 */}
        <InsightMiniCard
          emoji="💪"
          title="Protein Focus"
          text="Prioritize protein-rich meals for recovery and muscle support."
        />

        {/* CARD 2 */}
        <InsightMiniCard
          emoji="💧"
          title="Hydration"
          text="Consistent hydration improves metabolism and energy."
        />

        {/* CARD 3 */}
        <InsightMiniCard
          emoji="😴"
          title="Sleep Recovery"
         text="Better sleep quality improves recovery, hormones, energy, and body composition."
        />
      </div>

      {/* FOOTER */}
      <div
        className="
          relative
          z-10
          mt-8
          rounded-3xl
          border
          border-zinc-800
          bg-zinc-950/60
          p-5
        "
      >
        <div className="flex items-center gap-3">

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
            "
          >
            🧠
          </div>

          <p className="text-zinc-400">
            Recommendations are dynamically generated
            using your nutrition profile,
            body analytics, and meal goals.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================
   MINI INSIGHT CARD
========================================= */

interface InsightMiniCardProps {
  emoji: string;
  title: string;
  text: string;
}

function InsightMiniCard({
  emoji,
  title,
  text,
}: InsightMiniCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      className="
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950/70
        p-5
      "
    >

      {/* TOP */}
      <div className="flex items-center gap-3 mb-4">

        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-green-500/10
            border
            border-green-500/20
            flex
            items-center
            justify-center
            text-xl
          "
        >
          {emoji}
        </div>

        <h3 className="text-white font-semibold">
          {title}
        </h3>
      </div>

      {/* TEXT */}
      <p className="text-zinc-400 leading-relaxed text-sm">
        {text}
      </p>
    </motion.div>
  );
}