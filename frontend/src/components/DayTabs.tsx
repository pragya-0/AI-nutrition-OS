"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import MealCard from "@/components/MealCard";

interface DayData {
  day?: number;
  breakfast?: string;
  lunch?: string;
  snack?: string;
  snacks?: string;
  dinner?: string;
  alternatives?: string[];
  water_target?: string;
  workout_tip?: string;

  meals?: {
    breakfast?: string | string[];
    lunch?: string | string[];
    dinner?: string | string[];
    snack?: string | string[];
    snacks?: string | string[];
  };
}

interface DayTabsProps {
  days?: DayData[];
}

function normalizeMeal(value: string | string[] | undefined) {
  if (!value) return "Not available yet";

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
}

export default function DayTabs({ days = [] }: DayTabsProps) {
  const safeDays = Array.isArray(days) ? days : [];

  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    if (activeDay >= safeDays.length) {
      setActiveDay(0);
    }
  }, [safeDays.length, activeDay]);

  if (safeDays.length === 0) {
    return (
      <div className="rounded-[32px] border border-zinc-800 bg-zinc-900/60 p-8 text-zinc-400">
        No meal plan available yet.
      </div>
    );
  }

  const currentDay = safeDays[activeDay] ?? safeDays[0];

  const breakfast = normalizeMeal(
    currentDay.breakfast ?? currentDay.meals?.breakfast
  );

  const lunch = normalizeMeal(currentDay.lunch ?? currentDay.meals?.lunch);

  const snack = normalizeMeal(
    currentDay.snack ?? currentDay.snacks ?? currentDay.meals?.snack ?? currentDay.meals?.snacks
  );

  const dinner = normalizeMeal(currentDay.dinner ?? currentDay.meals?.dinner);

  const alternatives = Array.isArray(currentDay.alternatives)
    ? currentDay.alternatives
    : [];

  return (
    <div className="w-full">
      {/* DAY TABS */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {safeDays.map((day, index) => (
          <button
            key={day.day ?? index}
            onClick={() => setActiveDay(index)}
            className={`
              whitespace-nowrap
              rounded-2xl
              border
              px-5
              py-3
              transition-all
              duration-300
              ${
                activeDay === index
                  ? `
                    border-green-400
                    bg-green-500
                    text-black
                    shadow-[0_0_20px_rgba(34,197,94,0.4)]
                  `
                  : `
                    border-zinc-800
                    bg-zinc-900/60
                    text-zinc-300
                    hover:border-green-500/40
                  `
              }
            `}
          >
            Day {day.day ?? index + 1}
          </button>
        ))}
      </div>

      {/* ACTIVE DAY CONTENT */}
      <motion.div
        key={currentDay.day ?? activeDay}
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
          mt-6
          rounded-[32px]
          border
          border-zinc-800
          bg-zinc-900/60
          p-6
          backdrop-blur-xl
          lg:p-8
        "
      >
        {/* HEADER */}
        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <h2
              className="
                text-3xl
                font-bold
                text-white
                lg:text-4xl
              "
            >
              AI Nutrition Plan
            </h2>

            <p className="mt-2 text-zinc-400">
              Personalized meals optimized for your goals
            </p>
          </div>

          <div
            className="
              w-fit
              rounded-2xl
              border
              border-green-500/20
              bg-green-500/10
              px-5
              py-3
              font-semibold
              text-green-400
            "
          >
            Day {currentDay.day ?? activeDay + 1}
          </div>
        </div>

        {/* MEALS GRID */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-2
          "
        >
          <MealCard title="Breakfast" meal={breakfast} icon="🍳" />

          <MealCard title="Lunch" meal={lunch} icon="🍛" />

          <MealCard title="Snack" meal={snack} icon="🥜" />

          <MealCard title="Dinner" meal={dinner} icon="🍽️" />
        </div>

        {/* ALTERNATIVES */}
        <div className="mt-10">
          <h3
            className="
              mb-5
              text-2xl
              font-semibold
              text-white
            "
          >
            Alternatives
          </h3>

          {alternatives.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {alternatives.map((alternative, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="
                    rounded-2xl
                    border
                    border-zinc-700
                    bg-zinc-800/80
                    px-5
                    py-3
                    text-zinc-300
                  "
                >
                  {alternative}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">No alternatives available.</p>
          )}
        </div>

        {/* WATER + WORKOUT */}
        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-2
          "
        >
          {/* WATER TARGET */}
          <motion.div
            whileHover={{
              scale: 1.02,
            }}
            className="
              rounded-3xl
              border
              border-cyan-500/20
              bg-cyan-500/5
              p-6
            "
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-500/10
                  text-2xl
                "
              >
                💧
              </div>

              <div>
                <h4
                  className="
                    text-lg
                    font-semibold
                    text-cyan-400
                  "
                >
                  Water Target
                </h4>

                <p className="text-sm text-zinc-400">
                  Daily hydration goal
                </p>
              </div>
            </div>

            <p className="text-3xl font-bold text-white">
              {currentDay.water_target ?? "2.5L"}
            </p>
          </motion.div>

          {/* WORKOUT TIP */}
          <motion.div
            whileHover={{
              scale: 1.02,
            }}
            className="
              rounded-3xl
              border
              border-orange-500/20
              bg-orange-500/5
              p-6
            "
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-orange-500/10
                  text-2xl
                "
              >
                🏋️
              </div>

              <div>
                <h4
                  className="
                    text-lg
                    font-semibold
                    text-orange-400
                  "
                >
                  Workout Tip
                </h4>

                <p className="text-sm text-zinc-400">
                  AI fitness recommendation
                </p>
              </div>
            </div>

            <p
              className="
                leading-relaxed
                text-white
              "
            >
              {currentDay.workout_tip ??
                "Stay consistent with light activity and hydration today."}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}