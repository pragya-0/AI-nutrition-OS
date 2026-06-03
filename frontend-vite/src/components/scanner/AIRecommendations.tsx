"use client";

import { useMemo, useState } from "react";
import Image from "@/compat/NextImage";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Droplets,
  Flame,
  HelpCircle,
  Leaf,
  Plus,
  ShieldCheck,
  Sprout,
  Utensils,
  Wheat,
  Zap,
} from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

type RecommendationMeal = {
  title?: string;
  image?: string;
  serving?: string;
  weight?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  score?: number;
  why_better?: string;
};

type ScanResult = {
  detected_food?: string;
  confidence?: number;
  filename?: string;
  health_score?: number;
  analysis?: string;
  message?: string;
  warnings?: string[];
  suggestions?: string[];
  uploadedImage?: string;
  image?: string;
  image_url?: string;
  estimated_nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    saturated_fat?: number;
  };
  recommendations?: {
    vegetarian?: RecommendationMeal;
    vegan?: RecommendationMeal;
    non_vegetarian?: RecommendationMeal;
  };
};

const preferences = [
  {
    id: "vegetarian",
    backendKey: "vegetarian",
    title: "Vegetarian",
    text: "No meat, seafood or eggs.",
    icon: Leaf,
    color: "#8CFF2F",
  },
  {
    id: "non-vegetarian",
    backendKey: "non_vegetarian",
    title: "Non-Vegetarian",
    text: "Includes high-protein lean meat.",
    icon: Utensils,
    color: "#FF9D28",
  },
  {
    id: "vegan",
    backendKey: "vegan",
    title: "Vegan",
    text: "No animal products at all.",
    icon: Sprout,
    color: "#A96BFF",
  },
];

const fallbackRecommendations: Record<string, Required<RecommendationMeal>> = {
  vegetarian: {
    title: "Veggie Stir Fry with Tofu",
    image: "/assets/scanner/veggie-stir-fry-tofu.png",
    serving: "1 Serving",
    weight: "400 g",
    calories: 280,
    protein: 21,
    carbs: 28,
    fats: 8,
    fiber: 10,
    score: 88,
    why_better: "Higher fiber, lighter calories, and better plant-protein balance.",
  },
  vegan: {
    title: "Lemon Herb Tofu with Quinoa",
    image: "/assets/scanner/lemon-herb-tofu-quinoa.png",
    serving: "1 Serving",
    weight: "400 g",
    calories: 290,
    protein: 18,
    carbs: 32,
    fats: 9,
    fiber: 11,
    score: 87,
    why_better: "Clean vegan protein with better fiber and balanced carbs.",
  },
  non_vegetarian: {
    title: "Grilled Chicken with Brown Rice",
    image: "/assets/scanner/grilled-chicken-brown-rice.png",
    serving: "1 Serving",
    weight: "420 g",
    calories: 320,
    protein: 34,
    carbs: 30,
    fats: 9,
    fiber: 9,
    score: 90,
    why_better: "Higher lean protein, lower fat, and stronger fitness-goal compatibility.",
  },
};

const moreOptionFallbacks = [
  { title: "Moong Dal Chilla with Salad", image: "/assets/scanner/moong-dal-chilla-salad.png" },
  { title: "Chickpea & Veg Power Bowl", image: "/assets/scanner/chickpea-veg-power-bowl.png" },
  { title: "Healthy Salad Bowl", image: "/assets/scanner/healthy-salad-bowl-glow.png" },
];

function safeNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeImageUrl(value?: string) {
  if (!value) return "";
  if (value.startsWith("blob:")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  return value;
}

function normalizeRecommendation(raw: RecommendationMeal | undefined, fallback: Required<RecommendationMeal>): Required<RecommendationMeal> {
  return {
    title: raw?.title || fallback.title,
    image: raw?.image || fallback.image,
    serving: raw?.serving || fallback.serving,
    weight: raw?.weight || fallback.weight,
    calories: safeNumber(raw?.calories, fallback.calories),
    protein: safeNumber(raw?.protein, fallback.protein),
    carbs: safeNumber(raw?.carbs, fallback.carbs),
    fats: safeNumber(raw?.fats, fallback.fats),
    fiber: safeNumber(raw?.fiber, fallback.fiber),
    score: safeNumber(raw?.score, fallback.score),
    why_better: raw?.why_better || fallback.why_better,
  };
}

function MacroItem({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
  return (
    <div className="rounded-[12px] bg-white/[0.035] p-2 text-center">
      <Icon size={15} className="mx-auto mb-1" style={{ color }} />
      <p className="text-sm font-black text-[#F5F8F2]">{value}</p>
      <p className="text-[11px] text-[#A3B3A3]">{label}</p>
    </div>
  );
}

function FoodScoreRing({ scoreGain }: { scoreGain: number }) {
  const data = [{ name: "score", value: Math.min(100, 70 + scoreGain), fill: "#8CFF2F" }];
  return (
    <div className="relative mx-auto h-[142px] w-[142px] sm:h-[160px] sm:w-[160px]">
      <div className="absolute inset-7 rounded-full bg-[#A6FF4D]/10 blur-3xl" />
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="78%" outerRadius="90%" data={data} startAngle={220} endAngle={-40}>
          <RadialBar dataKey="value" cornerRadius={18} background />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[34px] font-black leading-none text-[#8CFF2F] sm:text-[38px]">+{scoreGain}</p>
        <p className="mt-2 text-xs text-[#DDEBD8]">Food Score</p>
      </div>
    </div>
  );
}

function FoodImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const normalized = normalizeImageUrl(src);
  if (normalized.startsWith("blob:") || normalized.startsWith("http")) {
    return <img src={normalized} alt={alt} className={className} />;
  }
  return <Image src={normalized || "/assets/scanner/scanner-food-bowl.png"} alt={alt} width={360} height={360} className={className} />;
}

export default function AIRecommendations({ result }: { result?: ScanResult }) {
  const [selectedPreference, setSelectedPreference] = useState("vegetarian");
  const [saved, setSaved] = useState(false);
  const [showReason, setShowReason] = useState(false);

  const nutrition = result?.estimated_nutrition || {};
  const selectedPreferenceData = preferences.find((item) => item.id === selectedPreference) || preferences[0];
  const foodName = result?.detected_food || "Detected Meal";
  const currentImage = result?.uploadedImage || result?.image_url || result?.image || "/assets/scanner/scanner-food-bowl.png";
  const currentCalories = safeNumber(nutrition.calories);
  const currentProtein = safeNumber(nutrition.protein);
  const currentCarbs = safeNumber(nutrition.carbs);
  const currentFats = safeNumber(nutrition.fats);
  const currentFiber = safeNumber(nutrition.fiber, Math.max(4, Math.round(currentCarbs * 0.12)));
  const healthScore = safeNumber(result?.health_score, 75);
  const backendKey = selectedPreferenceData.backendKey;
  const selectedPreferenceLabel = selectedPreferenceData.title;
  const backendRecommendations = result?.recommendations || {};

  const recommendedMeal = useMemo(() => {
    const fallback = fallbackRecommendations[backendKey] || fallbackRecommendations.vegetarian;
    const raw = backendRecommendations[backendKey as keyof typeof backendRecommendations];
    return normalizeRecommendation(raw, fallback);
  }, [backendKey, backendRecommendations]);

  const caloriesDiff = recommendedMeal.calories - currentCalories;
  const proteinDiff = recommendedMeal.protein - currentProtein;
  const fatsDiff = recommendedMeal.fats - currentFats;
  const fiberDiff = recommendedMeal.fiber - currentFiber;
  const scoreGain = Math.max(0, recommendedMeal.score - healthScore);

  const improvements = [
    { label: "Calories", value: `${caloriesDiff > 0 ? "+" : ""}${caloriesDiff} kcal`, icon: Flame, color: caloriesDiff <= 0 ? "#8CFF2F" : "#FF9D28" },
    { label: "Protein", value: `${proteinDiff >= 0 ? "+" : ""}${proteinDiff} g`, icon: ShieldCheck, color: proteinDiff >= 0 ? "#8CFF2F" : "#FF9D28" },
    { label: "Fats", value: `${fatsDiff > 0 ? "+" : ""}${fatsDiff} g`, icon: Zap, color: fatsDiff <= 0 ? "#8CFF2F" : "#FFE234" },
    { label: "Fiber", value: `${fiberDiff >= 0 ? "+" : ""}${fiberDiff} g`, icon: Wheat, color: "#A96BFF" },
  ];

  const moreOptions = useMemo(() => {
    const all = preferences
      .map((preference) => {
        const fallback = fallbackRecommendations[preference.backendKey] || fallbackRecommendations.vegetarian;
        const raw = backendRecommendations[preference.backendKey as keyof typeof backendRecommendations];
        return normalizeRecommendation(raw, fallback);
      })
      .filter((item) => item.title !== recommendedMeal.title);

    const filled = [...all];
    moreOptionFallbacks.forEach((item, index) => {
      if (filled.length < 3) {
        filled.push({
          title: item.title,
          image: item.image,
          serving: "1 Serving",
          weight: "400 g",
          calories: Math.max(260, recommendedMeal.calories + index * 20),
          protein: Math.max(16, recommendedMeal.protein - index),
          carbs: Math.max(24, recommendedMeal.carbs + index * 4),
          fats: Math.max(7, recommendedMeal.fats + index),
          fiber: Math.max(8, recommendedMeal.fiber - index),
          score: Math.max(82, recommendedMeal.score - index),
          why_better: "Balanced alternative based on your scan result.",
        });
      }
    });
    return filled.slice(0, 3);
  }, [backendRecommendations, recommendedMeal]);

  const whyImprove =
    currentFats >= 25
      ? "This meal is higher in fats. A lighter alternative can improve calorie balance and heart-health alignment."
      : currentCalories >= 500
        ? "This meal is calorie-dense. A lighter option can support better goal alignment."
        : currentProtein < 18
          ? "This meal can be improved by increasing protein and fiber."
          : "This meal is decent, but the recommendation improves balance, fiber, and micronutrient density.";

  const whyBetter = recommendedMeal.why_better || "Better macro balance, improved fiber, and stronger goal compatibility.";

  return (
    <section id="ai-recommendations" className="bg-[#030805] px-3 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[1780px] rounded-[24px] border border-[#173326] bg-[#020604]/95 p-3 sm:rounded-[30px] sm:p-5 lg:p-6">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_80%_18%,rgba(166,255,77,0.10),transparent_30%),radial-gradient(circle_at_12%_35%,rgba(24,211,208,0.08),transparent_32%),#041014] p-4 sm:rounded-[28px] sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button onClick={() => document.getElementById("nutrition-intelligence")?.scrollIntoView({ behavior: "smooth" })} className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]"><ArrowLeft size={17} />Back to Analysis</button>
              <h2 className="text-[30px] font-black tracking-[-0.05em] sm:text-[38px] xl:text-[46px]">AI Recommendations <span className="text-[#A6FF4D]">✣</span></h2>
              <p className="mt-2 text-sm text-[#DDEBD8] sm:text-base">Personalized alternatives for <span className="font-black text-[#A6FF4D]">{foodName}</span>.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button onClick={() => setShowReason((prev) => !prev)} className="flex h-11 items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 text-sm font-bold transition hover:border-[#A6FF4D]/35"><HelpCircle size={17} />Why these recommendations?</button>
              <button onClick={() => setSaved((prev) => !prev)} className="flex h-11 items-center gap-2 rounded-[14px] bg-[#A6FF4D] px-4 text-sm font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.26)] transition hover:scale-[1.02]">{saved ? <Check size={17} /> : <Plus size={17} />}{saved ? "Saved" : "Save to My Meals"}</button>
            </div>
          </div>

          {showReason && (
            <div className="mb-4 rounded-[18px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/8 p-4 text-sm leading-6 text-[#DDEBD8]">
              Recommendations are generated from scanned calories, macros, health score, and selected diet preference. The chosen option is designed to improve balance, protein, fiber, or calorie density.
            </div>
          )}

          <div className="rounded-[20px] border border-white/10 bg-[#07110A]/70 p-4 sm:p-5">
            <h3 className="text-base font-black sm:text-lg">1. Choose Your Preference</h3>
            <p className="mt-1.5 text-sm text-[#DDEBD8]">We’ll tailor recommendations just for you.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {preferences.map((item) => {
                const Icon = item.icon;
                const active = selectedPreference === item.id;
                return (
                  <button key={item.id} onClick={() => setSelectedPreference(item.id)} className={`flex items-center justify-between rounded-[18px] border p-4 text-left transition ${active ? "border-[#8CFF2F] bg-[#A6FF4D]/8 shadow-[0_0_45px_rgba(166,255,77,0.12)]" : "border-white/10 bg-white/[0.03] hover:border-[#A6FF4D]/30"}`}>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-14 sm:w-14" style={{ backgroundColor: `${item.color}18`, color: item.color }}><Icon size={28} /></span>
                      <div className="min-w-0"><p className="font-black text-[#F5F8F2] sm:text-lg">{item.title}</p><p className="mt-1 line-clamp-2 text-xs text-[#DDEBD8] sm:text-sm">{item.text}</p></div>
                    </div>
                    <span className={`ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${active ? "border-[#8CFF2F] bg-[#8CFF2F] text-[#07110A]" : "border-[#A3B3A3]"}`}>{active && <Check size={15} />}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid auto-rows-fr gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(230px,0.52fr)_minmax(0,1.1fr)]">
            <div className="rounded-[20px] border border-white/10 bg-[#07110A]/70 p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2"><h3 className="text-base font-black sm:text-lg">2. Your Current Choice</h3><span className="rounded-[9px] bg-[#FF9D28]/14 px-3 py-1 text-xs font-black text-[#FF9D28]">Backend Scan</span></div>
              <div className="grid gap-4 md:grid-cols-[180px_1fr] 2xl:grid-cols-[210px_1fr]">
                <FoodImage src={currentImage} alt={foodName} className="h-[178px] w-full rounded-[20px] object-cover shadow-[0_24px_60px_rgba(0,0,0,0.45)] md:w-[180px] 2xl:h-[205px] 2xl:w-[210px]" />
                <div className="min-w-0">
                  <h4 className="line-clamp-2 text-xl font-black">{foodName}</h4>
                  <p className="mt-2 text-sm text-[#DDEBD8]">1 Serving • Backend analyzed</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.03] px-3 py-2"><Flame size={17} className="text-[#FF9D28]" /><span className="text-lg font-black">{currentCalories} kcal</span></div>
                  <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
                    <MacroItem icon={ShieldCheck} value={`${currentProtein} g`} label="Protein" color="#8CFF2F" />
                    <MacroItem icon={Droplets} value={`${currentCarbs} g`} label="Carbs" color="#18D3D0" />
                    <MacroItem icon={Flame} value={`${currentFats} g`} label="Fats" color="#FF9D28" />
                    <MacroItem icon={Wheat} value={`${currentFiber} g`} label="Fiber" color="#DDEBD8" />
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-[16px] border border-[#FF9D28]/25 bg-[#FF9D28]/6 p-4"><h4 className="flex items-center gap-2 font-black text-[#FF9D28]"><AlertTriangle size={18} />Why improve?</h4><p className="mt-2 text-sm leading-6 text-[#DDEBD8]">{whyImprove}</p></div>
            </div>

            <div className="relative flex flex-col justify-center rounded-[20px] border border-[#18D3D0]/20 bg-[#07110A]/70 p-4 sm:p-5">
              <h3 className="mb-3 text-center text-base font-black text-[#A6FF4D] sm:text-lg">3. AI Improvement</h3>
              <FoodScoreRing scoreGain={scoreGain} />
              <div className="mt-4 space-y-2.5">
                {improvements.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0">
                      <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: `${item.color}18`, color: item.color }}><Icon size={15} /></span><span className="text-sm text-[#DDEBD8]">{item.label}</span></div>
                      <span className="text-sm font-black" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[20px] border border-[#8CFF2F]/45 bg-[#A6FF4D]/6 p-4 shadow-[0_0_50px_rgba(166,255,77,0.08)] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-base font-black text-[#A6FF4D] sm:text-lg">4. Recommended for You</h3><span className="rounded-[9px] bg-[#A6FF4D]/14 px-3 py-1 text-xs font-black text-[#A6FF4D]">{selectedPreferenceLabel}</span></div>
              <div className="grid gap-4 md:grid-cols-[190px_1fr] 2xl:grid-cols-[220px_1fr]">
                <FoodImage src={recommendedMeal.image} alt={recommendedMeal.title} className="h-[188px] w-full rounded-[20px] object-cover shadow-[0_24px_60px_rgba(0,0,0,0.45)] md:w-[190px] 2xl:h-[210px] 2xl:w-[220px]" />
                <div className="min-w-0">
                  <h4 className="line-clamp-2 text-xl font-black leading-tight">{recommendedMeal.title}</h4>
                  <p className="mt-2 text-sm text-[#DDEBD8]">{recommendedMeal.serving} • {recommendedMeal.weight}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.03] px-3 py-2"><Flame size={17} className="text-[#8CFF2F]" /><span className="text-lg font-black">{recommendedMeal.calories} kcal</span></div>
                  <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
                    <MacroItem icon={ShieldCheck} value={`${recommendedMeal.protein} g`} label="Protein" color="#8CFF2F" />
                    <MacroItem icon={Droplets} value={`${recommendedMeal.carbs} g`} label="Carbs" color="#18D3D0" />
                    <MacroItem icon={Flame} value={`${recommendedMeal.fats} g`} label="Fats" color="#FF9D28" />
                    <MacroItem icon={Wheat} value={`${recommendedMeal.fiber} g`} label="Fiber" color="#DDEBD8" />
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-[16px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/8 p-4"><h4 className="flex items-center gap-2 font-black text-[#A6FF4D]"><ShieldCheck size={18} />Why better?</h4><p className="mt-2 text-sm leading-6 text-[#DDEBD8]">{whyBetter}</p></div>
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/10 bg-[#07110A]/70 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-black">More Options for You</h3><button className="flex items-center gap-2 text-sm font-black text-[#A6FF4D]">View all options <ArrowRight size={16} /></button></div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {moreOptions.map((item) => (
                <button key={item.title} className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-[#A6FF4D]/35">
                  <FoodImage src={item.image} alt={item.title} className="h-14 w-14 shrink-0 rounded-full object-cover sm:h-16 sm:w-16" />
                  <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-semibold leading-tight text-[#DDEBD8]">{item.title}</p><p className="mt-2 flex items-center gap-1 text-xs text-[#DDEBD8]"><Flame size={13} className="text-[#FF9D28]" />{item.calories} kcal</p></div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8CFF2F] text-sm font-black text-[#8CFF2F]">{item.score}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-[#A3B3A3]">Current preference: <span className="font-black text-[#A6FF4D]">{selectedPreferenceLabel}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
