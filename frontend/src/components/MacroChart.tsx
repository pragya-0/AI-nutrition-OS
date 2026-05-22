"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MacroChartProps {
  protein: number;
  carbs: number;
  fats: number;
}

export default function MacroChart({
  protein,
  carbs,
  fats,
}: MacroChartProps) {

  const data = [
    {
      name: "Protein",
      value: protein,
      color: "#22c55e",
    },
    {
      name: "Carbs",
      value: carbs,
      color: "#3b82f6",
    },
    {
      name: "Fats",
      value: fats,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      className="
        rounded-[32px]
        border
        border-zinc-800
        bg-zinc-900/60
        backdrop-blur-xl
        p-6
        lg:p-8
      "
    >

      {/* HEADER */}
      <div className="mb-6">

        <h2
          className="
            text-2xl
            lg:text-3xl
            font-bold
            text-white
            mb-2
          "
        >
          Macro Distribution
        </h2>

        <p className="text-zinc-400">
          AI-generated nutrition balance
        </p>
      </div>

      {/* CHART */}
      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={65}
              paddingAngle={4}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">

        {data.map((item) => (

          <div
            key={item.name}
            className="
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950/70
              p-4
            "
          >

            <div className="flex items-center gap-3 mb-2">

              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <h3 className="text-white font-semibold">
                {item.name}
              </h3>
            </div>

            <p className="text-zinc-400">
              {item.value}g
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}