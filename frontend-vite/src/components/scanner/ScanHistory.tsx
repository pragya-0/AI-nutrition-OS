"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/compat/NextImage";
import { getScanHistory } from "@/services/api";
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

type BackendScan = {
  id?: string | number;
  filename?: string;
  detected_food?: string;
  food?: string;
  title?: string;
  image?: string;
  image_url?: string;
  uploadedImage?: string;
  created_at?: string;
  saved_at?: string;
  date?: string;
  time?: string;
  meal_type?: string;
  health_score?: number;
  score?: number;
  estimated_nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
  };
};

type HistoryRow = {
  id: string | number;
  meal: string;
  serving: string;
  image: string;
  date: string;
  time: string;
  calories: number;
  score: number;
  mealType: string;
  mealIcon: any;
  mealColor: string;
  goal: number;
};

const fallbackRows: HistoryRow[] = [
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

const ranges = ["All", "Today", "This Week", "This Month", "Last 3 Months", "Custom Range"];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function normalizeBackendImageUrl(value?: string) {
  if (!value) return "";
  if (value.startsWith("blob:")) return value;
  if (value.startsWith("data:")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
  return value;
}

function safeNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getScanArray(payload: any): BackendScan[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.scans)) return payload.scans;
  if (Array.isArray(payload?.history)) return payload.history;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function formatDate(value?: string) {
  if (!value) return new Date().toLocaleDateString();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value?: string) {
  if (!value) return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function mealVisual(mealType?: string) {
  const meal = (mealType || "Meal").toLowerCase();

  if (meal.includes("breakfast")) return { icon: Sun, color: "#FFE234", label: "Breakfast" };
  if (meal.includes("dinner")) return { icon: Moon, color: "#A96BFF", label: "Dinner" };
  if (meal.includes("snack")) return { icon: Moon, color: "#A96BFF", label: "Snack" };
  if (meal.includes("light")) return { icon: Sun, color: "#18D3D0", label: "Light Meal" };
  if (meal.includes("main")) return { icon: Sun, color: "#FFE234", label: "Main Course" };

  return { icon: Sun, color: "#FFE234", label: mealType || "Meal" };
}

function mapBackendScan(scan: BackendScan, index: number): HistoryRow {
  const nutrition = scan.estimated_nutrition || {};
  const createdAt = scan.created_at || scan.saved_at || scan.date;
  const meal = mealVisual(scan.meal_type);
  const title = scan.detected_food || scan.food || scan.title || "Detected Meal";
  const score = safeNumber(scan.health_score ?? scan.score, 75);

  return {
    id: scan.id || `${title}-${index}`,
    meal: title,
    serving: "1 Serving • Backend scan",
    image:
      normalizeBackendImageUrl(
        scan.image_url || scan.image || scan.uploadedImage
      ) || "/assets/scanner/scanner-food-bowl.png",
    date: formatDate(createdAt),
    time: scan.time || formatTime(createdAt),
    calories: safeNumber(nutrition.calories),
    score,
    mealType: meal.label,
    mealIcon: meal.icon,
    mealColor: meal.color,
    goal: Math.max(40, Math.min(95, score - 5)),
  };
}

function rangeMatches(row: HistoryRow, selectedRange: string) {
  if (selectedRange === "All" || selectedRange === "Custom Range") return true;

  const rowDate = new Date(`${row.date} ${row.time}`);
  if (Number.isNaN(rowDate.getTime())) return true;

  const now = new Date();
  const diffMs = now.getTime() - rowDate.getTime();
  const diffDays = diffMs / 86400000;

  if (selectedRange === "Today") return diffDays < 1;
  if (selectedRange === "This Week") return diffDays <= 7;
  if (selectedRange === "This Month") return diffDays <= 31;
  if (selectedRange === "Last 3 Months") return diffDays <= 93;

  return true;
}

function buildStatCards(rows: HistoryRow[]) {
  const totalScans = rows.length;
  const avgCalories =
    totalScans > 0
      ? Math.round(rows.reduce((sum, row) => sum + row.calories, 0) / totalScans)
      : 0;
  const avgScore =
    totalScans > 0
      ? Math.round(rows.reduce((sum, row) => sum + row.score, 0) / totalScans)
      : 0;

  return [
    { label: "Total Scans", value: String(totalScans), sub: "All Time", icon: Target, color: "#8CFF2F" },
    { label: "This Week", value: String(rows.filter((row) => rangeMatches(row, "This Week")).length), sub: "Live from backend", icon: Calendar, color: "#A96BFF" },
    { label: "Avg. Daily Intake", value: avgCalories.toLocaleString(), unit: "kcal", sub: "Based on scans", icon: Flame, color: "#FF9D28" },
    { label: "Avg. Score", value: String(avgScore), sub: avgScore >= 80 ? "Good" : "Needs focus", icon: Target, color: "#18D3D0" },
    { label: "Goal Consistency", value: avgScore >= 80 ? "High" : avgScore >= 65 ? "Medium" : "Low", sub: "Live", icon: Target, color: "#8CFF2F" },
  ];
}

function ScoreCircle({ score }: { score: number }) {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[4px] border-[#8CFF2F] bg-[#8CFF2F]/10 shadow-[0_0_20px_rgba(166,255,77,0.18)] sm:h-12 sm:w-12">
      <span className="text-xs font-black sm:text-sm">{score}</span>
    </div>
  );
}

export default function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRange, setSelectedRange] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [backendRows, setBackendRows] = useState<HistoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHistory(showLoader = true) {
      try {
        if (showLoader) {
          setIsLoading(true);
        }

        setLoadError("");

        const payload = await getScanHistory();
        const mapped = getScanArray(payload).map(mapBackendScan);

        if (mounted) {
          setBackendRows(mapped);
          setPage(1);
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setBackendRows([]);
          setLoadError("Scan history is showing demo data until backend history is available.");
        }
      } finally {
        if (mounted && showLoader) {
          setIsLoading(false);
        }
      }
    }

    loadHistory(true);

    const handleScanHistoryUpdate = (event: Event) => {
      const scanDetail = (event as CustomEvent<BackendScan>).detail;

      if (scanDetail) {
        const optimisticRow = mapBackendScan(
          {
            ...scanDetail,
            saved_at: scanDetail.saved_at || new Date().toISOString(),
          },
          0
        );

        setBackendRows((prev) => {
          const withoutDuplicate = prev.filter(
            (item) => item.id !== optimisticRow.id && item.meal !== optimisticRow.meal
          );

          return [optimisticRow, ...withoutDuplicate].slice(0, 10);
        });
        setPage(1);
      }

      loadHistory(false);
      window.setTimeout(() => loadHistory(false), 350);
      window.setTimeout(() => loadHistory(false), 1200);
    };

    window.addEventListener("scan-history-updated", handleScanHistoryUpdate);

    return () => {
      mounted = false;
      window.removeEventListener("scan-history-updated", handleScanHistoryUpdate);
    };
  }, []);

  const rows = useMemo(
    () => (backendRows.length > 0 ? backendRows : fallbackRows),
    [backendRows]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const text = `${row.meal} ${row.date} ${row.mealType}`.toLowerCase();
      const matchesSearch = text.includes(searchTerm.toLowerCase());
      const matchesRange = rangeMatches(row, selectedRange);

      return matchesSearch && matchesRange;
    });
  }, [rows, searchTerm, selectedRange]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );
  const statCards = useMemo(() => buildStatCards(rows), [rows]);

  return (
    <section id="scan-history" className="bg-[#030805] px-3 py-3 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[1780px] rounded-[24px] border border-[#173326] bg-[#020604]/95 p-3 sm:rounded-[30px] sm:p-5 lg:p-6 xl:p-7">
        <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_80%_18%,rgba(166,255,77,0.10),transparent_30%),radial-gradient(circle_at_12%_35%,rgba(24,211,208,0.08),transparent_32%),#041014] p-3 sm:rounded-[28px] sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <button
                onClick={() =>
                  document.getElementById("recent-scans")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]"
              >
                <ArrowLeft size={17} />
                Back to Scanner
              </button>

              <h2 className="text-[28px] font-black tracking-[-0.04em] sm:text-[36px] xl:text-[42px]">
                Scan History <span className="text-[#A6FF4D]">✣</span>
              </h2>

              <p className="mt-3 max-w-[620px] text-sm text-[#DDEBD8] xl:text-base">
                {backendRows.length > 0
                  ? "View and track your real backend food scans and insights."
                  : "View and track all your food scans and insights."}
              </p>

              {loadError && (
                <p className="mt-2 text-sm font-semibold text-[#FFB347]">
                  {loadError}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap xl:w-auto xl:justify-end">
              <div className="flex h-12 w-full items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 sm:w-[360px]">
                <Search size={19} className="shrink-0 text-[#DDEBD8]" />
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search food, meal or date..."
                  className="w-full bg-transparent text-sm text-[#F5F8F2] outline-none placeholder:text-[#A3B3A3]"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setFilterOpen((prev) => !prev)}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-[#F5F8F2] transition hover:border-[#A6FF4D]/35 sm:w-[110px]"
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
                          setPage(1);
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
                className="flex h-12 w-full items-center justify-center gap-3 rounded-[14px] bg-[#A6FF4D] px-7 text-sm font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.26)] transition hover:scale-[1.02] sm:w-auto"
              >
                <Download size={17} />
                Export Report
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.label} className="min-h-[112px] rounded-[18px] border border-white/10 bg-[#07110A]/70 p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16"
                      style={{ backgroundColor: `${card.color}18`, color: card.color }}
                    >
                      <Icon size={27} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[24px] font-black leading-none sm:text-[28px]">
                        {card.value}{" "}
                        {"unit" in card && card.unit && <span className="text-sm font-medium text-[#DDEBD8] sm:text-base">{card.unit}</span>}
                      </p>
                      <p className="mt-2 text-sm text-[#DDEBD8] sm:mt-3">{card.label}</p>
                      <p className={`mt-1 text-xs ${card.sub.includes("Live") || card.sub.includes("Good") ? "font-black text-[#A6FF4D]" : "text-[#A3B3A3]"}`}>
                        {card.sub}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 overflow-x-auto pb-1">
            <div className="inline-flex min-w-max items-center gap-1 rounded-[14px] border border-white/10 bg-[#07110A]/70 p-2">
              {ranges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedRange(range);
                    setPage(1);
                  }}
                  className={`whitespace-nowrap rounded-[10px] px-4 py-2 text-sm transition sm:px-5 ${
                    selectedRange === range
                      ? "bg-[#A6FF4D]/12 font-black text-[#A6FF4D]"
                      : "text-[#DDEBD8] hover:bg-white/[0.04]"
                  }`}
                >
                  {range}
                </button>
              ))}
              <Calendar size={18} className="ml-2 shrink-0 text-[#DDEBD8]" />
            </div>
          </div>

          {isLoading ? (
            <div className="mt-4 rounded-[18px] border border-white/10 bg-[#07110A]/70 p-5 text-sm text-[#DDEBD8]">
              Loading real scan history...
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3 lg:hidden">
                {visibleRows.map((row) => {
                  const MealIcon = row.mealIcon;

                  return (
                    <article key={row.id} className="rounded-[18px] border border-white/10 bg-[#07110A]/70 p-3">
                      <div className="flex gap-3">
                        <img
                          src={row.image}
                          alt={row.meal}
                          className="h-20 w-20 shrink-0 rounded-[14px] object-cover"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.src = "/assets/scanner/scanner-food-bowl.png";
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="line-clamp-2 font-black leading-tight text-[#F5F8F2]">{row.meal}</p>
                              <p className="mt-1 text-xs text-[#DDEBD8]">{row.serving}</p>
                            </div>
                            <ScoreCircle score={row.score} />
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#DDEBD8]">
                            <div>
                              <p>{row.date}</p>
                              <p className="mt-1">{row.time}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Flame size={16} className="text-[#FF9D28]" />
                              <span>{row.calories} kcal</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MealIcon size={18} style={{ color: row.mealColor }} />
                              <span>{row.mealType}</span>
                            </div>

                            <div>
                              <div className="mb-1 flex items-center gap-2">
                                <span className="font-black">{row.goal}%</span>
                                <span className="font-black text-[#A6FF4D]">Match</span>
                              </div>
                              <div className="h-[5px] w-full rounded-full bg-white/10">
                                <div className="h-full rounded-full bg-[#A6FF4D]" style={{ width: `${row.goal}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.03] text-sm">
                              <Eye size={16} />
                              View
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03]">
                              <MoreHorizontal size={17} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-4 hidden overflow-x-auto rounded-[18px] border border-white/10 bg-[#07110A]/70 lg:block">
                <div className="min-w-[1120px]">
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
                      <div key={row.id} className="grid grid-cols-[2fr_1.15fr_1fr_0.8fr_1.1fr_1.25fr_0.8fr] items-center border-b border-white/10 px-6 py-5 last:border-b-0">
                        <div className="flex items-center gap-4">
                          <img
                            src={row.image}
                            alt={row.meal}
                            className="h-16 w-16 rounded-[12px] object-cover"
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.src = "/assets/scanner/scanner-food-bowl.png";
                            }}
                          />

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#F5F8F2]">{row.meal}</p>
                            <p className="mt-1 truncate text-sm text-[#DDEBD8]">{row.serving}</p>
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
                            <span className="text-sm font-black text-[#A6FF4D]">Match</span>
                          </div>
                          <div className="h-[5px] w-[140px] rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-[#A6FF4D] shadow-[0_0_16px_rgba(166,255,77,0.4)]" style={{ width: `${row.goal}%` }} />
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

                  {visibleRows.length === 0 && (
                    <div className="px-6 py-10 text-center text-sm text-[#DDEBD8]">
                      No scan history found for this search/filter.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="mt-5 flex flex-col gap-4 text-sm text-[#DDEBD8] md:flex-row md:items-center md:justify-between">
            <p>
              Showing {visibleRows.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(safePage * rowsPerPage, filteredRows.length)} of {filteredRows.length} results
            </p>

            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] sm:h-11 sm:w-11">
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, index) => index + 1).map((item) => (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] border sm:h-11 sm:w-11 ${
                    safePage === item ? "border-[#A6FF4D] bg-[#A6FF4D] font-black text-[#07110A]" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {item}
                </button>
              ))}

              {totalPages > 3 && (
                <>
                  <span className="px-1 sm:px-2">...</span>

                  <button
                    onClick={() => setPage(totalPages)}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] sm:h-11 sm:w-11"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] sm:h-11 sm:w-11">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-start">
              <span>Rows per page:</span>

              <button
                onClick={() => {
                  setRowsPerPage((prev) => (prev === 5 ? 10 : 5));
                  setPage(1);
                }}
                className="flex h-10 items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 sm:h-11"
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
