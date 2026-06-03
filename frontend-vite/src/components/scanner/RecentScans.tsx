"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/compat/NextImage";
import { getRecentScans } from "@/services/api";
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

type BackendScan = {
  id?: string | number;
  filename?: string;
  detected_food?: string;
  food?: string;
  title?: string;
  image?: string;
  uploadedImage?: string;
  image_url?: string;
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

type RecentScanCard = {
  id: string | number;
  tag: string;
  time: string;
  title: string;
  amount: string;
  image: string;
  score: number;
  kcal: number;
  protein: string;
  carbs: string;
  fats: string;
  meal: string;
  mealIcon: any;
  mealColor: string;
};

type SummaryStat = {
  icon: any;
  value: string;
  unit?: string;
  label: string;
  sub: string;
  trend?: string;
  color: string;
  danger?: boolean;
};

const fallbackRecentScans: RecentScanCard[] = [
  {
    id: 1,
    tag: "Demo",
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
    tag: "Demo",
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
    tag: "Demo",
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
    tag: "Demo",
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
    tag: "Demo",
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
  if (Array.isArray(payload?.recent_scans)) return payload.recent_scans;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function formatTime(value?: string) {
  if (!value) {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTag(value?: string) {
  if (!value) return "Today";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Today";

  const today = new Date();
  const startToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startToday.getTime() - startDate.getTime()) / 86400000
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function mealVisual(mealType?: string) {
  const meal = (mealType || "Meal").toLowerCase();

  if (meal.includes("breakfast")) {
    return { icon: Sun, color: "#FFE234", label: "Breakfast" };
  }

  if (meal.includes("dinner")) {
    return { icon: Moon, color: "#A96BFF", label: "Dinner" };
  }

  if (meal.includes("snack")) {
    return { icon: Moon, color: "#A96BFF", label: "Snack" };
  }

  if (meal.includes("light")) {
    return { icon: Leaf, color: "#18D3D0", label: "Light Meal" };
  }

  if (meal.includes("main")) {
    return { icon: Utensils, color: "#A6FF4D", label: "Main Course" };
  }

  return { icon: Utensils, color: "#A6FF4D", label: mealType || "Meal" };
}

function mapBackendScan(scan: BackendScan, index: number): RecentScanCard {
  const nutrition = scan.estimated_nutrition || {};
  const createdAt = scan.created_at || scan.saved_at || scan.date;
  const meal = mealVisual(scan.meal_type);
  const title = scan.detected_food || scan.food || scan.title || "Detected Meal";

  return {
    id: scan.id || `${title}-${index}`,
    tag: formatTag(createdAt),
    time: scan.time || formatTime(createdAt),
    title,
    amount: "1 Serving • Backend scan",
    image:
      normalizeBackendImageUrl(
        scan.image_url || scan.image || scan.uploadedImage
      ) || "/assets/scanner/scanner-food-bowl.png",
    score: safeNumber(scan.health_score ?? scan.score, 75),
    kcal: safeNumber(nutrition.calories),
    protein: `${safeNumber(nutrition.protein)}g`,
    carbs: `${safeNumber(nutrition.carbs)}g`,
    fats: `${safeNumber(nutrition.fats)}g`,
    meal: meal.label,
    mealIcon: meal.icon,
    mealColor: meal.color,
  };
}

function buildSummary(scans: RecentScanCard[], isLive: boolean): SummaryStat[] {
  const totalScans = scans.length;

  const averageScore =
    totalScans > 0
      ? Math.round(scans.reduce((sum, scan) => sum + scan.score, 0) / totalScans)
      : 0;

  const averageIntake =
    totalScans > 0
      ? Math.round(scans.reduce((sum, scan) => sum + scan.kcal, 0) / totalScans)
      : 0;

  return [
    {
      icon: Gauge,
      value: String(totalScans),
      label: "Total Scans",
      sub: isLive ? "Live data" : "Demo data",
      trend: isLive ? "Live" : "Demo",
      color: "#8CFF2F",
    },
    {
      icon: Target,
      value: totalScans > 0 ? (totalScans / 7).toFixed(1) : "0",
      unit: "/ Day",
      label: "Average Scans",
      sub: "This Week",
      trend: isLive ? "Live" : "Demo",
      color: "#A6FF4D",
    },
    {
      icon: Star,
      value: String(averageScore),
      label: "Average Score",
      sub: "This Week",
      trend: averageScore >= 80 ? "Great" : "Improve",
      color: "#FFE234",
    },
    {
      icon: Flame,
      value: averageIntake.toLocaleString(),
      unit: "kcal",
      label: "Average Intake",
      sub: "This Week",
      trend: isLive ? "Live" : "Demo",
      color: "#FF9D28",
      danger: averageIntake > 2200,
    },
    {
      icon: Target,
      value: averageScore >= 80 ? "High" : averageScore >= 65 ? "Medium" : "Low",
      label: "Consistency",
      sub: averageScore >= 80 ? "Awesome!" : "Keep going",
      color: "#8CFF2F",
    },
  ];
}

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
  const [backendScans, setBackendScans] = useState<RecentScanCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadScans(showLoader = true) {
      try {
        if (showLoader) {
          setIsLoading(true);
        }

        setLoadError("");

        const payload = await getRecentScans();
        const mapped = getScanArray(payload).map(mapBackendScan);

        if (mounted) {
          setBackendScans(mapped.slice(0, 5));
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          setLoadError(
            "Recent scans are showing demo data until backend history is available."
          );
          setBackendScans([]);
        }
      } finally {
        if (mounted && showLoader) {
          setIsLoading(false);
        }
      }
    }

    loadScans(true);

    const handleScanHistoryUpdate = (event: Event) => {
      const scanDetail = (event as CustomEvent<BackendScan>).detail;

      if (scanDetail) {
        const optimisticScan = mapBackendScan(
          {
            ...scanDetail,
            saved_at: scanDetail.saved_at || new Date().toISOString(),
          },
          0
        );

        setBackendScans((prev) => {
          const withoutDuplicate = prev.filter(
            (item) => item.id !== optimisticScan.id && item.title !== optimisticScan.title
          );

          return [optimisticScan, ...withoutDuplicate].slice(0, 5);
        });
      }

      loadScans(false);
      window.setTimeout(() => loadScans(false), 350);
      window.setTimeout(() => loadScans(false), 1200);
    };

    window.addEventListener("scan-history-updated", handleScanHistoryUpdate);

    return () => {
      mounted = false;
      window.removeEventListener("scan-history-updated", handleScanHistoryUpdate);
    };
  }, []);

  const scans = useMemo(
    () => (backendScans.length > 0 ? backendScans : fallbackRecentScans),
    [backendScans]
  );

  const hasLiveData = backendScans.length > 0;

  const summaryStats = useMemo(
    () => buildSummary(scans, hasLiveData),
    [scans, hasLiveData]
  );

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
                {hasLiveData
                  ? "Your latest real backend food scans and nutrition insights."
                  : "Your latest food scans and nutrition insights."}
              </p>

              {loadError && (
                <p className="mt-2 text-sm font-semibold text-[#FFB347]">
                  {loadError}
                </p>
              )}
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

          {isLoading ? (
            <div className="mt-5 rounded-[18px] border border-white/10 bg-[#07110A]/70 p-5 text-sm text-[#DDEBD8]">
              Loading real recent scans...
            </div>
          ) : (
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
                        <span
                          className={`rounded-[8px] px-3 py-1.5 text-xs font-black ${
                            hasLiveData
                              ? "bg-[#A6FF4D]/12 text-[#A6FF4D]"
                              : "bg-[#FFB347]/12 text-[#FFB347]"
                          }`}
                        >
                          {scan.tag}
                        </span>

                        <div className="flex items-center gap-2 text-xs text-[#DDEBD8]">
                          <span>{scan.time}</span>
                          <button className="rounded-full p-1 transition hover:bg-white/10">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>

                      <img
                        src={scan.image}
                        alt={scan.title}
                        className="h-[150px] w-full rounded-[12px] object-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = "/assets/scanner/scanner-food-bowl.png";
                        }}
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
          )}

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
                    {hasLiveData
                      ? "Your scan history is now live. Keep scanning consistently so your dashboard learns from real meals."
                      : "You’re doing great! Try adding more fiber-rich foods to improve digestion and keep your energy stable."}
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