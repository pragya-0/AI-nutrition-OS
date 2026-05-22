"use client";

import { motion } from "framer-motion";

interface AvoidFoodsProps {
  foods: string[];
}

export default function AvoidFoods({
  foods,
}: AvoidFoodsProps) {

  if (!foods || foods.length === 0) {
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
        duration: 0.3,
      }}
      className="
        rounded-[32px]
        border
        border-red-500/20
        bg-red-500/5
        backdrop-blur-xl
        p-6
        lg:p-8
      "
    >

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">

        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-red-500/10
            border
            border-red-500/20
            flex
            items-center
            justify-center
            text-2xl
          "
        >
          🚫
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Foods To Avoid
          </h2>

          <p className="text-zinc-400">
            Personalized nutrition warnings
          </p>
        </div>
      </div>

      {/* FOOD LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {foods.map((food, index) => (

          <motion.div
            key={index}
            whileHover={{
              scale: 1.02,
            }}
            className="
              rounded-3xl
              border
              border-red-500/20
              bg-zinc-900/70
              p-5
              flex
              items-center
              gap-4
            "
          >

            {/* ICON */}
            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-red-500/10
                border
                border-red-500/20
                flex
                items-center
                justify-center
                text-xl
                shrink-0
              "
            >
              ⚠️
            </div>

            {/* TEXT */}
            <div>
              <h3 className="text-white font-semibold">
                {food}
              </h3>

              <p className="text-zinc-500 text-sm mt-1">
                May negatively affect your goal
              </p>
            </div>

          </motion.div>
        ))}
      </div>

      {/* FOOTER */}
      <div
        className="
          mt-6
          rounded-3xl
          border
          border-red-500/20
          bg-red-500/5
          p-5
        "
      >
        <p className="text-zinc-300 leading-relaxed">
          Your AI Nutrition OS generated these
          recommendations based on your
          BMI, goal, activity level, and
          nutrition profile.
        </p>
      </div>
    </motion.div>
  );
}