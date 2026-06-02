"use client";

import Image from "@/compat/NextImage";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Beef,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Droplets,
  Edit3,
  Flame,
  Info,
  Leaf,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

const macroData = [
  { name: "Protein", value: 17 },
  { name: "Carbs", value: 37 },
  { name: "Fats", value: 42 },
  { name: "Fiber", value: 4 },
];

const macroColors = ["#82F33A", "#25C8F5", "#FFB323", "#9C6BFF"];

const nutritionCards = [
  { label: "Calories", value: "520", icon: Flame, tone: "text-orange-400" },
  { label: "Protein", value: "22 g", icon: Beef, tone: "text-[#A6FF4D]" },
  { label: "Carbs", value: "48 g", icon: Droplets, tone: "text-[#25C8F5]" },
  { label: "Fats", value: "24 g", icon: Flame, tone: "text-[#FFB323]" },
];

const qualityRows = [
  ["Nutrient Density", "94/100"],
  ["Protein Quality", "91/100"],
  ["Ingredient Quality", "90/100"],
  ["Low Added Sugar", "95/100"],
  ["Low Processed", "88/100"],
  ["Sodium Balance", "89/100"],
];

const compatibility = [
  ["High protein content supports muscle retention", "good"],
  ["Moderate calorie count", "good"],
  ["Good balance of macros", "good"],
  ["Sodium is slightly higher", "warn"],
  ["Contains added fats", "warn"],
];

const micros = [
  ["Calcium", 28, "#A6FF4D"],
  ["Iron", 22, "#25C8F5"],
  ["Vitamin A", 35, "#25C8F5"],
  ["Vitamin C", 18, "#FFB323"],
  ["Potassium", 30, "#FF5E7E"],
  ["Magnesium", 25, "#9C6BFF"],
];

function RingScore({
  score,
  label,
  size = "large",
}: {
  score: number;
  label: string;
  size?: "large" | "small";
}) {
  const isLarge = size === "large";
  const data = [{ name: "score", value: score, fill: "#8CFF2F" }];

  return (
    <div
      className={`relative ${
        isLarge ? "h-[230px] w-[230px]" : "h-[215px] w-[215px]"
      }`}
    >
      <div className="pointer-events-none absolute inset-8 rounded-full bg-[#A6FF4D]/10 blur-3xl" />

      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="68%"
          outerRadius="86%"
          data={data}
          startAngle={220}
          endAngle={-40}
        >
          <RadialBar dataKey="value" cornerRadius={18} background />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p
          className={`font-black tracking-[-0.06em] text-[#F5F8F2] ${
            isLarge ? "text-[58px]" : "text-[54px]"
          }`}
        >
          {score}
          {!isLarge && <span className="text-2xl">%</span>}
        </p>
        <p className="text-base text-[#DDEBD8]">{isLarge ? "/100" : label}</p>
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-white/10 bg-[#07110A]/70 shadow-[0_20px_70px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function AIAnalysisResult() {
  return (
    <section className="bg-[#030805] px-4 py-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[1780px] rounded-[30px] border border-[#173326] bg-[#020604]/95 p-4 sm:p-5 lg:p-5 xl:p-5">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_12%_18%,rgba(24,211,208,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(166,255,77,0.10),transparent_32%),#041014] p-4 sm:p-5 lg:p-5 xl:p-5">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]">
                <ArrowLeft size={17} />
                Back to Scanner
              </button>

              <h2 className="text-[28px] font-black tracking-[-0.04em] text-[#F5F8F2] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
                AI Analysis Result <span className="text-[#A6FF4D]">✣</span>
              </h2>

              <p className="mt-3 text-[14px] text-[#A3B3A3] xl:text-[15px]">
                Here&apos;s what AI found in your food
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-[#F5F8F2] transition hover:border-[#A6FF4D]/35">
                <RefreshCcw size={18} />
                Re-scan
              </button>

              <button className="flex items-center gap-3 rounded-[14px] border border-[#A6FF4D]/55 bg-[#A6FF4D]/5 px-5 py-3 text-sm font-bold text-[#A6FF4D] transition hover:bg-[#A6FF4D]/12">
                <Bookmark size={18} />
                Save to My Meals
              </button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1.18fr_0.92fr_1fr]">
            <Card className="p-4">
              <div className="grid gap-4 sm:grid-cols-[250px_1fr]">
                <div className="relative overflow-hidden rounded-[20px]">
                  <Image
                    src="/assets/scanner/scanner-result-paneer.png"
                    alt="Paneer Butter Masala"
                    width={420}
                    height={420}
                    className="h-[230px] w-full object-cover"
                  />
                  <button className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-xl">
                    <Edit3 size={18} />
                  </button>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-[24px] font-black leading-[1.15] tracking-[-0.04em] text-[#F5F8F2] xl:text-[26px]">
                    Paneer Butter Masala
                  </h3>

                  <span className="mt-4 w-fit rounded-[10px] bg-[#A6FF4D]/10 px-3 py-2 text-sm font-bold text-[#A6FF4D]">
                    AI Confidence: 96%
                  </span>

                  <p className="mt-5 text-sm text-[#A3B3A3]">Today, 12:30 PM</p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[#DDEBD8]">
                      <Leaf size={16} className="text-[#A6FF4D]" />
                      Indian Cuisine
                    </span>
                    <span className="flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[#DDEBD8]">
                      <Sun size={16} className="text-[#FFB323]" />
                      Lunch
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-[#A3B3A3]">
                    450 g <span className="mx-2">•</span> 1 Serving
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black">
                  Nutrition Summary <Info size={16} className="text-[#A3B3A3]" />
                </h3>
                <span className="text-xs text-[#A3B3A3]">Per serving</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {nutritionCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[16px] border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.04] ${item.tone}`}
                        >
                          <Icon size={20} />
                        </span>
                        <div>
                          <p className="text-[28px] font-black leading-none xl:text-[30px]">
                            {item.value}
                          </p>
                          <p className="mt-1 text-sm text-[#A3B3A3]">
                            {item.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-[16px] border border-white/10 bg-white/[0.03] p-4 text-center">
                {[
                  ["6 g", "Fiber"],
                  ["12 g", "Sugar"],
                  ["680 mg", "Sodium"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-xl font-black">{value}</p>
                    <p className="mt-1 text-sm text-[#A3B3A3]">{label}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-black">
                Food Score <Info size={16} className="text-[#A3B3A3]" />
              </h3>

              <div className="grid items-center gap-3 sm:grid-cols-[230px_1fr]">
                <div className="flex flex-col items-center">
                  <RingScore score={92} label="Excellent Choice!" />
                  <p className="-mt-4 font-black text-[#A6FF4D]">
                    Excellent Choice! 💚
                  </p>
                </div>

                <div className="space-y-3">
                  {qualityRows.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex items-center gap-2 text-sm text-[#DDEBD8]">
                        <ShieldCheck
                          size={15}
                          className="shrink-0 text-[#A6FF4D]"
                        />
                        {label}
                      </span>
                      <span className="shrink-0 text-sm font-black text-[#A6FF4D]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[1.18fr_0.92fr_1fr]">
            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black">
                  Goal Compatibility <Info size={16} className="text-[#A3B3A3]" />
                </h3>

                <button className="flex items-center gap-2 rounded-[10px] bg-[#A6FF4D]/10 px-3 py-2 text-sm font-bold text-[#A6FF4D]">
                  Fat Loss <ChevronDown size={15} />
                </button>
              </div>

              <div className="grid items-center gap-4 sm:grid-cols-[215px_1fr]">
                <div className="flex flex-col items-center">
                  <RingScore score={85} label="Good Match" size="small" />
                </div>

                <div>
                  <p className="mb-4 text-sm leading-6 text-[#DDEBD8]">
                    This meal aligns well with your fat loss goal.
                  </p>

                  <div className="space-y-3">
                    {compatibility.map(([text, type]) => (
                      <p
                        key={text}
                        className="flex items-center gap-3 text-sm text-[#DDEBD8]"
                      >
                        {type === "good" ? (
                          <CheckCircle2
                            size={18}
                            className="shrink-0 text-[#A6FF4D]"
                          />
                        ) : (
                          <AlertTriangle
                            size={18}
                            className="shrink-0 text-[#FF9D28]"
                          />
                        )}
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black">
                  Macro Distribution <Info size={16} className="text-[#A3B3A3]" />
                </h3>
                <span className="text-xs text-[#A3B3A3]">Per serving</span>
              </div>

              <div className="grid items-center gap-3 sm:grid-cols-[185px_1fr]">
                <div className="relative h-[205px]">
                  <div className="pointer-events-none absolute inset-10 rounded-full bg-[#A6FF4D]/10 blur-3xl" />

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        innerRadius={55}
                        outerRadius={82}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={entry.name} fill={macroColors[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-black">520</p>
                    <p className="text-sm text-[#A3B3A3]">kcal</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    ["Protein", "22g (17%)", "#82F33A", "35%"],
                    ["Carbs", "48g (37%)", "#25C8F5", "45%"],
                    ["Fats", "24g (42%)", "#FFB323", "55%"],
                    ["Fiber", "6g (4%)", "#9C6BFF", "22%"],
                  ].map(([label, value, color, width]) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          {label}
                        </span>
                        <span className="text-[#DDEBD8]">{value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm font-bold text-[#DDEBD8]">
                  Your daily targets
                </span>
                <span className="text-sm font-black text-[#A6FF4D]">
                  1200 / 2000 kcal
                </span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-black">
                  Micronutrients Snapshot{" "}
                  <Info size={16} className="text-[#A3B3A3]" />
                </h3>
                <span className="text-xs text-[#A3B3A3]">% Daily Value</span>
              </div>

              <div className="space-y-4">
                {micros.map(([label, value, color]) => (
                  <div
                    key={label as string}
                    className="grid grid-cols-[90px_1fr_44px] items-center gap-4 text-sm"
                  >
                    <span>{label}</span>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${value}%`,
                          backgroundColor: color as string,
                        }}
                      />
                    </div>
                    <span className="text-right font-bold">{value}%</span>
                  </div>
                ))}
              </div>

              <button className="ml-auto mt-5 flex items-center gap-2 rounded-[10px] bg-[#A6FF4D]/10 px-3 py-2 text-sm font-bold text-[#A6FF4D] transition hover:bg-[#A6FF4D]/15">
                View Full Micronutrients <ArrowRight size={16} />
              </button>
            </Card>
          </div>

          <div className="mt-3 rounded-[24px] border border-[#A6FF4D]/30 bg-[#07110A]/55 p-4">
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.95fr]">
              <div>
                <h3 className="flex items-center gap-3 text-lg font-black">
                  <Sparkles className="text-[#A6FF4D]" size={24} />
                  AI Quick Insight
                </h3>

                <p className="mt-4 max-w-[760px] text-sm leading-6 text-[#DDEBD8]">
                  This is a tasty meal with good protein from paneer. It&apos;s
                  higher in fat and sodium due to butter and cream. Enjoy in
                  moderation and pair with a salad for extra fiber.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-[10px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/10 px-3 py-2 text-sm font-bold text-[#A6FF4D]">
                    Great source of protein
                  </span>
                  <span className="rounded-[10px] border border-[#FF9D28]/25 bg-[#FF9D28]/10 px-3 py-2 text-sm font-bold text-[#FF9D28]">
                    Higher in saturated fat
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_1fr] gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div>
                  <h4 className="flex items-center gap-3 font-black">
                    <Clock3 size={20} className="text-[#DDEBD8]" />
                    Best time to eat
                  </h4>
                  <p className="mt-4 text-sm text-[#DDEBD8]">
                    12:00 PM - 2:00 PM
                  </p>
                  <p className="mt-3 text-sm text-[#A3B3A3]">Ideal for lunch</p>
                </div>

                <div className="border-l border-white/10 pl-6">
                  <h4 className="flex items-center gap-3 font-black">
                    <Users size={20} className="text-[#DDEBD8]" />
                    Who can eat this?
                  </h4>
                  <p className="mt-4 text-sm text-[#DDEBD8]">
                    Good for most people
                  </p>
                  <p className="mt-3 text-sm text-[#A3B3A3]">
                    May not be ideal for low sodium diet
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#A3B3A3]">
            ⓘ These values are AI-estimated and may vary. Please confirm with
            your nutritionist for medical advice.
          </p>
        </div>
      </div>
    </section>
  );
}