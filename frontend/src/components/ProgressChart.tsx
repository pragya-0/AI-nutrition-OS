"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ProgressChartProps = {
  goal: string;
  days: number;
  calories: number;
  expectedWeightChange: string;
  consistencyScore: number;
};

export default function ProgressChart({
  goal,
  days,
  calories,
  expectedWeightChange,
  consistencyScore,
}: ProgressChartProps) {
  const safeDays = Math.max(1, Number(days || 1));
  const safeCalories = Math.max(0, Number(calories || 0));

  const progressData = Array.from(
    {
      length: safeDays,
    },
    (_, index) => {
      const day = index + 1;
      const progressRatio = day / safeDays;

      return {
        day: `Day ${day}`,
        calories: Math.round(safeCalories * progressRatio),
      };
    }
  );

  const forecastLabel =
    goal === "muscle_gain"
      ? "Expected Weight Gain"
      : goal === "fat_loss"
      ? "Expected Weight Loss"
      : "Expected Change";

  const forecastValue =
    expectedWeightChange === "~0.0"
      ? goal === "fat_loss"
        ? "Small deficit phase"
        : goal === "muscle_gain"
        ? "Small surplus phase"
        : "Stable phase"
      : `${expectedWeightChange} kg`;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-white lg:text-3xl">
          Progress Forecast
        </h2>

        <p className="text-zinc-400">
          AI-predicted transformation journey based on your goal and duration
        </p>
      </div>

      <div className="h-[350px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

            <XAxis dataKey="day" stroke="#a1a1aa" />

            <YAxis stroke="#a1a1aa" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "16px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
            />

            <Line
              type="monotone"
              dataKey="calories"
              stroke="#22c55e"
              strokeWidth={4}
              dot={{
                r: 5,
                fill: "#22c55e",
                stroke: "#22c55e",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ForecastCard
          label={forecastLabel}
          value={forecastValue}
          border="border-green-500/20"
          background="bg-green-500/5"
          text="text-green-400"
        />

        <ForecastCard
          label="Avg Calories"
          value={`${safeCalories} kcal`}
          border="border-blue-500/20"
          background="bg-blue-500/5"
          text="text-blue-400"
        />

        <ForecastCard
          label="AI Consistency Score"
          value={`${consistencyScore}%`}
          border="border-orange-500/20"
          background="bg-orange-500/5"
          text="text-orange-400"
        />
      </div>
    </div>
  );
}

function ForecastCard({
  label,
  value,
  border,
  background,
  text,
}: {
  label: string;
  value: string;
  border: string;
  background: string;
  text: string;
}) {
  return (
    <div className={`rounded-2xl border ${border} ${background} p-4`}>
      <h3 className={`${text} mb-2 font-semibold`}>{label}</h3>

      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}