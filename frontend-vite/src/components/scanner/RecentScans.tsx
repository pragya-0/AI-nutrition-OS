"use client";

import { useMemo, useState } from "react";
import Image from "@/compat/NextImage";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Clock,
  Droplets,
  Flame,
  Gauge,
  Leaf,
  MoreVertical,
  Moon,
  Sparkles,
  Star,
  Sun,
  Target,
  Utensils,
} from "lucide-react";

const recentScans = [
  {
    id: 1,
    tag: "Today",
    time: "12:30 PM",
    title: "Paneer Butter Masala",
    amount: "450 g • 1 Serving",
    image: "/assets/scanner/scanner-result-paneer.png",
    score: 92,
    kcal: 520,
    protein: "22g",
    carbs: "48g",
    fats: "24g",
    meal: "Lunch",
    mealIcon: Utensils,
    mealColor: "#A6FF4D",
  },
  {
    id: 2,
    tag: "Today",
    time: "9:15 AM",
    title: "Oats Bowl",
    amount: "1 Serving",
    image: "/assets/scanner/oatsmeal.png",
    score: 88,
    kcal: 380,
    protein: "22g",
    carbs: "54g",
    fats: "10g",
    meal: "Breakfast",
    mealIcon: Sun,
    mealColor: "#FFE234",
  },
  {
    id: 3,
    tag: "Yesterday",
    time: "7:45 PM",
    title: "Grilled Chicken",
    amount: "420 g • 1 Serving",
    image: "/assets/scanner/grilled-chicken-brown-rice.png",
    score: 80,
    kcal: 380,
    protein: "16g",
    carbs: "54g",
    fats: "10g",
    meal: "Dinner",
    mealIcon: Moon,
    mealColor: "#A96BFF",
  },
  {
    id: 4,
    tag: "Yesterday",
    time: "4:20 PM",
    title: "Fruit Salad",
    amount: "1 Bowl",
    image: "/assets/scanner/healthy-salad-bowl-glow.png",
    score: 85,
    kcal: 340,
    protein: "2g",
    carbs: "52g",
    fats: "1g",
    meal: "Snack",
    mealIcon: Moon,
    mealColor: "#A96BFF",
  },
  {
    id: 5,
    tag: "2 days ago",
    time: "1:10 PM",
    title: "Chickpea Salad",
    amount: "1 Bowl",
    image: "/assets/scanner/chickpea-veg-power-bowl.png",
    score: 87,
    kcal: 290,
    protein: "14g",
    carbs: "38g",
    fats: "8g",
    meal: "Lunch",
    mealIcon: Utensils,
    mealColor: "#A6FF4D",
  },
];

const summaryStats = [
  {
    icon: Gauge,
    value: "27",
    label: "Total Scans",
    sub: "This Week",
    trend: "↗ 18%",
    color: "#8CFF2F",
  },
  {
    icon: Target,
    value: "4.2",
    unit: "/ Day",
    label: "Average Scans",
    sub: "This Week",
    trend: "↗ 12%",
    color: "#A6FF4D",
  },
  {
    icon: Star,
    value: "89",
    label: "Average Score",
    sub: "This Week",
    trend: "↗ 8%",
    color: "#FFE234",
  },
  {
    icon: Flame,
    value: "2,120",
    unit: "kcal",
    label: "Average Intake",
    sub: "This Week",
    trend: "↘ 5%",
    color: "#FF9D28",
    danger: true,
  },
  {
    icon: Target,
    value: "High",
    label: "Consistency",
    sub: "Awesome!",
    color: "#8CFF2F",
  },
];

function NutritionItem({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: any;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <Icon size={14} className="mx-auto mb-1" style={{ color }} />
      <p className="text-[13px] font-black leading-none text-[#F5F8F2]">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-[#A3B3A3]">{label}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border-[3px] border-[#8CFF2F] bg-[#8CFF2F]/8 shadow-[0_0_18px_rgba(166,255,77,0.22)]">
      <div className="text-center">
        <p className="text-lg font-black leading-none">{score}</p>
        <p className="text-[9px] leading-none text-[#DDEBD8]">/100</p>
      </div>
    </div>
  );
}

export default function RecentScans() {
  const [range, setRange] = useState("This Week");
  const [showHistory, setShowHistory] = useState(false);

  const scans = useMemo(() => recentScans, []);

  return (
    <section
      id="recent-scans"
      className="bg-[#030805] px-4 py-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <div className="mx-auto max-w-[1780px] rounded-[30px] border border-[#173326] bg-[#020604]/95 p-4 sm:p-5 lg:p-6 xl:p-7">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_82%_18%,rgba(166,255,77,0.12),transparent_30%),radial-gradient(circle_at_12%_35%,rgba(24,211,208,0.08),transparent_32%),#041014] p-4 sm:p-5 lg:p-6">
          <div className="mb-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button
                onClick={() =>
                  document
                    .getElementById("ai-recommendations")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]"
              >
                <ArrowLeft size={17} />
                Back to Recommendations
              </button>

              <h2 className="text-[30px] font-black tracking-[-0.04em] sm:text-[36px] xl:text-[42px]">
                Recent Scans <span className="text-[#A6FF4D]">✣</span>
              </h2>

              <p className="mt-3 text-[14px] text-[#DDEBD8] xl:text-[16px]">
                Your latest food scans and nutrition insights.
              </p>
            </div>

            <button
              onClick={() => {
                setShowHistory(true);
                document
                  .getElementById("scan-history")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-1 flex h-12 items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-6 text-sm font-bold text-[#F5F8F2] transition hover:border-[#A6FF4D]/35"
            >
              <Clock size={18} />
              {showHistory ? "History opened" : "View all history"}
            </button>
          </div>

          <div className="relative mt-5">
            <div className="grid gap-4 xl:grid-cols-[repeat(5,minmax(0,1fr))]">
              {scans.map((scan) => {
                const MealIcon = scan.mealIcon;

                return (
                  <article
                    key={scan.id}
                    className="overflow-hidden rounded-[18px] border border-white/10 bg-[#07110A]/75 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
                  >
                    <div className="mb-2 flex items-center justify-between px-1">
                      <span className="rounded-[8px] bg-[#A6FF4D]/12 px-3 py-1.5 text-xs font-black text-[#A6FF4D]">
                        {scan.tag}
                      </span>

                      <div className="flex items-center gap-2 text-xs text-[#DDEBD8]">
                        <span>{scan.time}</span>
                        <button className="rounded-full p-1 transition hover:bg-white/10">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>

                    <Image
                      src={scan.image}
                      alt={scan.title}
                      width={340}
                      height={190}
                      className="h-[150px] w-full rounded-[12px] object-cover"
                    />

                    <div className="mt-3 flex items-start justify-between gap-2 px-1">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base font-black leading-tight">
                          {scan.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#DDEBD8]">
                          {scan.amount}
                        </p>
                      </div>

                      <ScoreBadge score={scan.score} />
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-1 border-b border-white/10 pb-3">
                      <NutritionItem
                        icon={Flame}
                        value={scan.kcal}
                        label="kcal"
                        color="#FF9D28"
                      />
                      <NutritionItem
                        icon={Leaf}
                        value={scan.protein}
                        label="Protein"
                        color="#8CFF2F"
                      />
                      <NutritionItem
                        icon={Droplets}
                        value={scan.carbs}
                        label="Carbs"
                        color="#18D3D0"
                      />
                      <NutritionItem
                        icon={Flame}
                        value={scan.fats}
                        label="Fats"
                        color="#FF9D28"
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-2 px-1 pb-1">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${scan.mealColor}16`,
                          color: scan.mealColor,
                        }}
                      >
                        <MealIcon size={17} />
                      </span>
                      <span
                        className="text-sm font-black"
                        style={{ color: scan.mealColor }}
                      >
                        {scan.meal}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <button className="absolute right-[-18px] top-[44%] hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#07110A] text-[#DDEBD8] shadow-[0_18px_50px_rgba(0,0,0,0.4)] transition hover:border-[#A6FF4D]/40 xl:flex">
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="mt-7 rounded-[20px] border border-white/10 bg-[#07110A]/70 p-4">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#A6FF4D]/12 text-[#A6FF4D]">
                  <Calendar size={24} />
                </span>

                <div>
                  <h3 className="text-lg font-black">Scan Summary</h3>
                  <p className="mt-1 text-sm text-[#DDEBD8]">
                    Overview of your scanning activity
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setRange(range === "This Week" ? "This Month" : "This Week")
                }
                className="flex h-11 items-center gap-3 rounded-[12px] border border-white/10 bg-white/[0.03] px-5 text-sm font-bold"
              >
                <Calendar size={16} />
                {range}
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {summaryStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-[16px] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${stat.color}18`,
                          color: stat.color,
                        }}
                      >
                        <Icon size={27} />
                      </span>

                      <div>
                        <p className="text-[26px] font-black leading-none">
                          {stat.value}{" "}
                          {stat.unit && (
                            <span className="text-base font-medium text-[#DDEBD8]">
                              {stat.unit}
                            </span>
                          )}
                        </p>

                        <p className="mt-3 text-sm text-[#DDEBD8]">
                          {stat.label}
                        </p>

                        <p
                          className={`mt-1 text-xs font-black ${
                            stat.danger ? "text-[#FF6C7D]" : "text-[#A6FF4D]"
                          }`}
                        >
                          {stat.trend || stat.sub}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[20px] border border-[#A6FF4D]/35 bg-[#07110A]/70">
            <div className="grid items-center gap-4 px-5 py-4 lg:grid-cols-[1.15fr_420px]">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D]">
                  <Sparkles size={34} />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#A6FF4D]">
                    AI Tip for You
                  </h3>
                  <p className="mt-3 text-base leading-7 text-[#F5F8F2]">
                    You’re doing great! Try adding more fiber-rich foods to
                    improve digestion and keep your energy stable.
                  </p>
                </div>
              </div>

          <div className="relative hidden h-[155px] justify-end overflow-visible lg:flex">
  <div className="absolute inset-y-0 right-0 w-full rounded-full bg-[#A6FF4D]/35 blur-[100px]" />

  <Image
    src="/assets/scanner/scanner-pro-tip-salad.png"
    alt="AI nutrition salad tip"
    width={940}
    height={440}
    className="absolute bottom-[-82px] right-[-6px] z-10 h-[300px] w-auto object-contain drop-shadow-[0_0_90px_rgba(166,255,77,0.38)]"
  />
</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}