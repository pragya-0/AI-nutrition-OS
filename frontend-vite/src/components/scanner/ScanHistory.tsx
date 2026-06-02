"use client";

import { useMemo, useState } from "react";
import Image from "@/compat/NextImage";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Flame,
  Filter,
  MoreHorizontal,
  Moon,
  Search,
  Sun,
  Target,
} from "lucide-react";

const scanRows = [
  {
    id: 1,
    meal: "Paneer Butter Masala",
    serving: "1 Serving • 450 g",
    image: "/assets/scanner/scanner-result-paneer.png",
    date: "May 21, 2025",
    time: "12:30 PM",
    calories: 520,
    score: 92,
    mealType: "Lunch",
    mealIcon: Sun,
    mealColor: "#FFE234",
    goal: 85,
  },
  {
    id: 2,
    meal: "Oats Bowl",
    serving: "1 Serving",
    image: "/assets/scanner/oatsmeal.png",
    date: "May 21, 2025",
    time: "9:15 AM",
    calories: 380,
    score: 88,
    mealType: "Breakfast",
    mealIcon: Sun,
    mealColor: "#FFE234",
    goal: 78,
  },
  {
    id: 3,
    meal: "Grilled Chicken",
    serving: "1 Serving • 420 g",
    image: "/assets/scanner/grilled-chicken-brown-rice.png",
    date: "May 20, 2025",
    time: "7:45 PM",
    calories: 380,
    score: 80,
    mealType: "Dinner",
    mealIcon: Moon,
    mealColor: "#A96BFF",
    goal: 72,
  },
  {
    id: 4,
    meal: "Fruit Salad",
    serving: "1 Bowl",
    image: "/assets/scanner/healthy-salad-bowl-glow.png",
    date: "May 20, 2025",
    time: "4:20 PM",
    calories: 340,
    score: 85,
    mealType: "Snack",
    mealIcon: Moon,
    mealColor: "#A96BFF",
    goal: 82,
  },
  {
    id: 5,
    meal: "Chickpea Salad",
    serving: "1 Bowl",
    image: "/assets/scanner/chickpea-veg-power-bowl.png",
    date: "May 19, 2025",
    time: "1:10 PM",
    calories: 290,
    score: 87,
    mealType: "Lunch",
    mealIcon: Sun,
    mealColor: "#FFE234",
    goal: 79,
  },
];

const statCards = [
  {
    label: "Total Scans",
    value: "126",
    sub: "All Time",
    icon: Target,
    color: "#8CFF2F",
  },
  {
    label: "This Week",
    value: "18",
    sub: "↗ 20% vs last week",
    icon: Calendar,
    color: "#A96BFF",
  },
  {
    label: "Avg. Daily Intake",
    value: "2,450",
    unit: "kcal",
    sub: "This Week",
    icon: Flame,
    color: "#FF9D28",
  },
  {
    label: "Avg. Score",
    value: "87",
    sub: "↗ 8%",
    icon: Target,
    color: "#18D3D0",
  },
  {
    label: "Goal Consistency",
    value: "High",
    sub: "This Week",
    icon: Target,
    color: "#8CFF2F",
  },
];

const ranges = [
  "All",
  "Today",
  "This Week",
  "This Month",
  "Last 3 Months",
  "Custom Range",
];

function ScoreCircle({ score }: { score: number }) {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-[#8CFF2F] bg-[#8CFF2F]/10 shadow-[0_0_20px_rgba(166,255,77,0.18)]">
      <span className="text-sm font-black">{score}</span>
    </div>
  );
}

export default function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRange, setSelectedRange] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    return scanRows.filter((row) => {
      const text = `${row.meal} ${row.date} ${row.mealType}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const visibleRows = filteredRows.slice(0, rowsPerPage);

  return (
    <section
      id="scan-history"
      className="bg-[#030805] px-4 py-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <div className="mx-auto max-w-[1780px] rounded-[30px] border border-[#173326] bg-[#020604]/95 p-4 sm:p-5 lg:p-6 xl:p-7">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_80%_18%,rgba(166,255,77,0.10),transparent_30%),radial-gradient(circle_at_12%_35%,rgba(24,211,208,0.08),transparent_32%),#041014] p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button
                onClick={() =>
                  document.getElementById("ai-recommendations")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]"
              >
                <ArrowLeft size={17} />
                Back to Scanner
              </button>

              <h2 className="text-[30px] font-black tracking-[-0.04em] sm:text-[36px] xl:text-[42px]">
                Scan History <span className="text-[#A6FF4D]">✣</span>
              </h2>

              <p className="mt-3 text-[14px] text-[#DDEBD8] xl:text-[16px]">
                View and track all your food scans and insights.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex h-12 w-[360px] max-w-full items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-4">
                <Search size={19} className="text-[#DDEBD8]" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search food, meal or date..."
                  className="w-full bg-transparent text-sm text-[#F5F8F2] outline-none placeholder:text-[#A3B3A3]"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setFilterOpen((prev) => !prev)}
                  className="flex h-12 w-[110px] items-center justify-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] text-sm font-bold text-[#F5F8F2] transition hover:border-[#A6FF4D]/35"
                >
                  <Filter size={17} />
                  Filter
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-14 z-30 w-48 overflow-hidden rounded-[14px] border border-white/10 bg-[#041014] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    {ranges.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedRange(range);
                          setFilterOpen(false);
                        }}
                        className="block w-full px-4 py-3 text-left text-sm text-[#DDEBD8] hover:bg-[#A6FF4D]/10 hover:text-[#A6FF4D]"
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => alert("Report export started")}
                className="flex h-12 items-center gap-3 rounded-[14px] bg-[#A6FF4D] px-7 text-sm font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.26)] transition hover:scale-[1.02]"
              >
                <Download size={17} />
                Export Report
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="min-h-[118px] rounded-[18px] border border-white/10 bg-[#07110A]/70 p-5"
                >
                  <div className="flex items-center gap-5">
                    <span
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${card.color}18`,
                        color: card.color,
                      }}
                    >
                      <Icon size={29} />
                    </span>

                    <div>
                      <p className="text-[28px] font-black leading-none">
                        {card.value}{" "}
                        {card.unit && (
                          <span className="text-base font-medium text-[#DDEBD8]">
                            {card.unit}
                          </span>
                        )}
                      </p>
                      <p className="mt-3 text-sm text-[#DDEBD8]">{card.label}</p>
                      <p
                        className={`mt-1 text-xs ${
                          card.sub.includes("↗")
                            ? "font-black text-[#A6FF4D]"
                            : "text-[#A3B3A3]"
                        }`}
                      >
                        {card.sub}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 inline-flex max-w-full flex-wrap items-center gap-1 rounded-[14px] border border-white/10 bg-[#07110A]/70 p-2">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-[10px] px-5 py-2 text-sm transition ${
                  selectedRange === range
                    ? "bg-[#A6FF4D]/12 font-black text-[#A6FF4D]"
                    : "text-[#DDEBD8] hover:bg-white/[0.04]"
                }`}
              >
                {range}
              </button>
            ))}

            <Calendar size={18} className="ml-2 text-[#DDEBD8]" />
          </div>

          <div className="mt-4 overflow-hidden rounded-[18px] border border-white/10 bg-[#07110A]/70">
            <div className="grid grid-cols-[2fr_1.15fr_1fr_0.8fr_1.1fr_1.25fr_0.8fr] border-b border-white/10 px-6 py-4 text-sm text-[#DDEBD8]">
              <p>Food / Meal</p>
              <p>Date & Time</p>
              <p>Calories</p>
              <p>Score</p>
              <p>Meal Type</p>
              <p>Goal Match</p>
              <p className="text-center">Actions</p>
            </div>

            {visibleRows.map((row) => {
              const MealIcon = row.mealIcon;

              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[2fr_1.15fr_1fr_0.8fr_1.1fr_1.25fr_0.8fr] items-center border-b border-white/10 px-6 py-5 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={row.image}
                      alt={row.meal}
                      width={72}
                      height={72}
                      className="h-16 w-16 rounded-[12px] object-cover"
                    />

                    <div>
                      <p className="font-semibold text-[#F5F8F2]">{row.meal}</p>
                      <p className="mt-1 text-sm text-[#DDEBD8]">{row.serving}</p>
                    </div>
                  </div>

                  <div className="text-sm text-[#DDEBD8]">
                    <p>{row.date}</p>
                    <p className="mt-1">{row.time}</p>
                  </div>

                  <div className="flex items-center gap-2 text-[#DDEBD8]">
                    <Flame size={18} className="text-[#FF9D28]" />
                    <span>{row.calories} kcal</span>
                  </div>

                  <ScoreCircle score={row.score} />

                  <div className="flex items-center gap-3">
                    <MealIcon size={22} style={{ color: row.mealColor }} />
                    <span>{row.mealType}</span>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg font-black">{row.goal}%</span>
                      <span className="text-sm font-black text-[#A6FF4D]">
                        Good
                      </span>
                    </div>
                    <div className="h-[5px] w-[140px] rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#A6FF4D] shadow-[0_0_16px_rgba(166,255,77,0.4)]"
                        style={{ width: `${row.goal}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] transition hover:border-[#A6FF4D]/35">
                      <Eye size={18} />
                    </button>

                    <button className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] transition hover:border-[#A6FF4D]/35">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-[#DDEBD8] md:flex-row md:items-center md:justify-between">
            <p>
              Showing 1 to {visibleRows.length} of {filteredRows.length || 126}{" "}
              results
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]"
              >
                <ChevronLeft size={18} />
              </button>

              {[1, 2, 3].map((item) => (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`flex h-11 w-11 items-center justify-center rounded-[10px] border ${
                    page === item
                      ? "border-[#A6FF4D] bg-[#A6FF4D] font-black text-[#07110A]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {item}
                </button>
              ))}

              <span className="px-2">...</span>

              <button className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
                25
              </button>

              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span>Rows per page:</span>

              <button
                onClick={() => setRowsPerPage((prev) => (prev === 5 ? 10 : 5))}
                className="flex h-11 items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4"
              >
                {rowsPerPage}
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}