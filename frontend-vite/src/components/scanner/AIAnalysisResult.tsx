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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const macroColors = ["#82F33A", "#25C8F5", "#FFB323", "#9C6BFF"];

type ExtendedNutrition = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  saturated_fat?: number;
};

type MicroNutrition = {
  calcium?: number;
  iron?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  potassium?: number;
  magnesium?: number;
};

type ScanResult = {
  success?: boolean;
  scanner_mode?: string;
  filename?: string;
  uploadedImage?: string;
  image?: string;
  image_url?: string;
  detected_food?: string;
  confidence?: number;
  estimated_nutrition?: ExtendedNutrition;
  micronutrients?: MicroNutrition;
  health_score?: number;
  meal_type?: string;
  best_time_to_eat?: string;
  analysis?: string;
  warnings?: string[];
  suggestions?: string[];
  message?: string;
};

function safeNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeImageUrl(value?: string) {
  if (!value) return "";
  if (value.startsWith("blob:")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  return value;
}

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent Choice! 💚";
  if (score >= 70) return "Good Choice 💚";
  if (score >= 55) return "Eat Mindfully ⚠️";
  return "Limit Portion ⚠️";
}



function RingScore({ score, label, size = "large" }: { score: number; label: string; size?: "large" | "small" }) {
  const isLarge = size === "large";
  const data = [{ name: "score", value: clamp(score, 1, 100), fill: "#8CFF2F" }];

  return (
    <div className={`relative mx-auto ${isLarge ? "h-[176px] w-[176px] sm:h-[198px] sm:w-[198px]" : "h-[154px] w-[154px] sm:h-[172px] sm:w-[172px]"}`}>
      <div className="pointer-events-none absolute inset-7 rounded-full bg-[#A6FF4D]/10 blur-3xl" />
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="68%" outerRadius="86%" data={data} startAngle={220} endAngle={-40}>
          <RadialBar dataKey="value" cornerRadius={18} background />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className={`font-black tracking-[-0.06em] text-[#F5F8F2] ${isLarge ? "text-[44px] sm:text-[52px]" : "text-[38px] sm:text-[46px]"}`}>
          {score}
          {!isLarge && <span className="text-xl">%</span>}
        </p>
        <p className="text-xs text-[#DDEBD8] sm:text-sm">{isLarge ? "/100" : label}</p>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-full rounded-[22px] border border-white/10 bg-[#07110A]/70 shadow-[0_20px_70px_rgba(0,0,0,0.28)] ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="flex items-center gap-2 text-base font-black sm:text-lg">{children}</h3>;
}

function MetricTile({ icon: Icon, value, label, tone }: { icon: any; value: string; label: string; tone: string }) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-white/[0.035] p-3 sm:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.04] ${tone}`}>
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap text-[22px] font-black leading-none tracking-[-0.03em] text-[#F5F8F2] sm:text-[26px] xl:text-[24px] 2xl:text-[28px]">
            {value}
          </p>
          <p className="mt-1 text-xs text-[#A3B3A3] sm:text-sm">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function AIAnalysisResult({ result }: { result: ScanResult }) {
  const nutrition = result?.estimated_nutrition || {};
  const foodName = result?.detected_food || "Detected Meal";
  const confidence = Math.round(clamp(safeNumber(result?.confidence, 0.75), 0, 1) * 100);

  const calories = safeNumber(nutrition.calories);
  const protein = safeNumber(nutrition.protein);
  const carbs = safeNumber(nutrition.carbs);
  const fats = safeNumber(nutrition.fats);
  const fiber = safeNumber(nutrition.fiber, Math.max(2, Math.round(carbs * 0.12)));
  const sugar = safeNumber(nutrition.sugar, Math.max(1, Math.round(carbs * 0.16)));
  const sodium = safeNumber(nutrition.sodium, Math.max(80, Math.round(140 + fats * 12 + calories * 0.28)));
  const healthScore = safeNumber(result?.health_score, 75);
  const mealType = result?.meal_type || (calories >= 500 ? "Main Course" : calories >= 250 ? "Light Meal" : "Snack");
  const bestTime = result?.best_time_to_eat || (mealType === "Main Course" ? "12:00 PM - 2:00 PM" : "4:00 PM - 6:00 PM");
  const imageUrl = normalizeImageUrl(result?.uploadedImage || result?.image_url || result?.image);

  const analysis = result?.analysis || result?.message || "AI has analyzed this food and estimated its nutrition profile.";
  const totalMacros = Math.max(protein + carbs + fats + fiber, 1);
  const macroData = [
    { name: "Protein", value: Math.max(1, Math.round((protein / totalMacros) * 100)), grams: protein },
    { name: "Carbs", value: Math.max(1, Math.round((carbs / totalMacros) * 100)), grams: carbs },
    { name: "Fats", value: Math.max(1, Math.round((fats / totalMacros) * 100)), grams: fats },
    { name: "Fiber", value: Math.max(1, Math.round((fiber / totalMacros) * 100)), grams: fiber },
  ];

  const micros = [
    ["Calcium", safeNumber(result?.micronutrients?.calcium, 18), "#A6FF4D"],
    ["Iron", safeNumber(result?.micronutrients?.iron, 18), "#25C8F5"],
    ["Vitamin A", safeNumber(result?.micronutrients?.vitamin_a, 18), "#25C8F5"],
    ["Vitamin C", safeNumber(result?.micronutrients?.vitamin_c, 18), "#FFB323"],
    ["Potassium", safeNumber(result?.micronutrients?.potassium, 24), "#FF5E7E"],
    ["Magnesium", safeNumber(result?.micronutrients?.magnesium, 18), "#9C6BFF"],
  ] as const;

  const nutritionCards = [
    { label: "Calories", value: String(calories), icon: Flame, tone: "text-orange-400" },
    { label: "Protein", value: `${protein} g`, icon: Beef, tone: "text-[#A6FF4D]" },
    { label: "Carbs", value: `${carbs} g`, icon: Droplets, tone: "text-[#25C8F5]" },
    { label: "Fats", value: `${fats} g`, icon: Flame, tone: "text-[#FFB323]" },
  ];

  const qualityRows = [
    ["Nutrient Density", clamp(healthScore + Math.round(fiber / 2), 35, 100)],
    ["Protein Quality", clamp(55 + protein * 2, 35, 100)],
    ["Ingredient Quality", clamp(healthScore, 35, 100)],
    ["Low Added Sugar", clamp(100 - sugar * 2, 35, 100)],
    ["Low Processed", clamp(healthScore - (sodium > 650 ? 10 : 0), 35, 100)],
    ["Sodium Balance", clamp(100 - Math.round(sodium / 20), 35, 100)],
  ];

  const compatibilityScore = clamp(healthScore + (protein >= 15 ? 4 : -5) + (fiber >= 5 ? 4 : -4) - (sodium > 650 ? 8 : 0), 45, 95);
  const compatibility = [
    ["Estimated by AI Vision Analysis", "good"],
    [`AI confidence is ${confidence}%`, confidence >= 75 ? "good" : "warn"],
    [`Contains around ${protein}g protein`, protein >= 12 ? "good" : "warn"],
    [`Contains around ${carbs}g carbs`, carbs <= 65 ? "good" : "warn"],
    [`Contains around ${fats}g fats`, fats <= 24 ? "good" : "warn"],
    [`Sodium estimate ${sodium}mg`, sodium <= 650 ? "good" : "warn"],
  ];

  const suggestions = result?.suggestions?.length ? result.suggestions : ["Pair with vegetables or salad for better fiber balance", "Keep portion size aligned with your goal"];
  const warnings = result?.warnings?.length ? result.warnings : sodium > 650 ? ["High sodium estimate"] : fats > 25 ? ["Higher fat estimate"] : [];

  return (
    <section id="ai-analysis-result" className="bg-[#030805] px-3 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[1780px] rounded-[24px] border border-[#173326] bg-[#020604]/95 p-3 sm:rounded-[30px] sm:p-5">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_12%_18%,rgba(24,211,208,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(166,255,77,0.10),transparent_32%),#041014] p-4 sm:rounded-[28px] sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]">
                <ArrowLeft size={17} /> Back to Scanner
              </button>
              <h2 className="text-[30px] font-black tracking-[-0.05em] sm:text-[38px] xl:text-[46px]">
                AI Analysis Result <span className="text-[#A6FF4D]">✣</span>
              </h2>
              <p className="mt-2 text-sm text-[#A3B3A3] sm:text-base">Here&apos;s what AI found in your food</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex h-11 items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 text-sm font-bold transition hover:border-[#A6FF4D]/35">
                <RefreshCcw size={17} /> Re-scan
              </button>
              <button className="flex h-11 items-center gap-2 rounded-[14px] border border-[#A6FF4D]/55 bg-[#A6FF4D]/5 px-4 text-sm font-bold text-[#A6FF4D] transition hover:bg-[#A6FF4D]/12">
                <Bookmark size={17} /> Save to My Meals
              </button>
            </div>
          </div>

          <div className="grid auto-rows-fr gap-3 xl:grid-cols-12">
            <Card className="p-4 xl:col-span-5">
              <div className="grid h-full gap-4 sm:grid-cols-[minmax(180px,230px)_1fr]">
                <div className="relative min-h-[210px] overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03]">
                  {imageUrl ? (
                    <img src={imageUrl} alt={foodName} className="h-full min-h-[210px] w-full object-cover" />
                  ) : (
                    <Image src="/assets/scanner/scanner-food-bowl.png" alt={foodName} width={420} height={420} className="h-full min-h-[210px] w-full object-contain p-4" />
                  )}
                  <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-xl">
                    <Edit3 size={17} />
                  </button>
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <h3 className="line-clamp-3 text-[24px] font-black leading-[1.12] tracking-[-0.04em] sm:text-[28px]">{foodName}</h3>
                  <span className="mt-3 w-fit rounded-[10px] bg-[#A6FF4D]/10 px-3 py-2 text-sm font-bold text-[#A6FF4D]">AI Confidence: {confidence}%</span>
                  <p className="mt-4 text-sm text-[#A3B3A3]">{new Date().toLocaleString()}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[#DDEBD8]"><Leaf size={16} className="text-[#A6FF4D]" />AI Vision</span>
                    <span className="flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[#DDEBD8]"><Sun size={16} className="text-[#FFB323]" />1 Serving</span>
                    <span className="flex items-center gap-2 rounded-[12px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-[#DDEBD8]"><Flame size={16} className="text-[#FFB323]" />{mealType}</span>
                  </div>
                  <p className="mt-4 line-clamp-1 text-sm text-[#A3B3A3]">File: {result?.filename || "uploaded image"}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 xl:col-span-3">
              <div className="mb-4 flex items-center justify-between gap-3"><SectionTitle>Nutrition Summary <Info size={16} className="text-[#A3B3A3]" /></SectionTitle><span className="text-xs text-[#A3B3A3]">Per serving</span></div>
              <div className="grid grid-cols-2 gap-2.5">
                {nutritionCards.map((item) => <MetricTile key={item.label} {...item} />)}
              </div>
              <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-[16px] border border-white/10 bg-white/[0.03] p-3 text-center">
                {[[`${fiber} g`, "Fiber"], [`${sugar} g`, "Sugar"], [`${sodium} mg`, "Sodium"]].map(([value, label]) => (
                  <div key={label} className="px-1"><p className="text-lg font-black sm:text-xl">{value}</p><p className="mt-1 text-xs text-[#A3B3A3] sm:text-sm">{label}</p></div>
                ))}
              </div>
            </Card>

            <Card className="p-4 xl:col-span-4">
              <SectionTitle>Food Score <Info size={16} className="text-[#A3B3A3]" /></SectionTitle>
              <div className="mt-3 grid items-center gap-4 md:grid-cols-[190px_1fr] xl:grid-cols-[178px_1fr] 2xl:grid-cols-[200px_1fr]">
                <div className="flex flex-col items-center"><RingScore score={healthScore} label="AI Score" /><p className="-mt-2 text-center text-sm font-black text-[#A6FF4D] sm:text-base">{scoreLabel(healthScore)}</p></div>
                <div className="space-y-2.5">
                  {qualityRows.map(([label, value]) => (
                    <div key={String(label)} className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-[#DDEBD8]"><ShieldCheck size={15} className="shrink-0 text-[#A6FF4D]" /><span className="truncate">{label}</span></span>
                      <span className="font-black text-[#A6FF4D]">{value}/100</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-3 grid auto-rows-fr gap-3 xl:grid-cols-12">
            <Card className="p-4 xl:col-span-5">
              <div className="mb-3 flex items-center justify-between gap-3"><SectionTitle>Goal Compatibility <Info size={16} className="text-[#A3B3A3]" /></SectionTitle><button className="flex items-center gap-2 rounded-[10px] bg-[#A6FF4D]/10 px-3 py-2 text-sm font-bold text-[#A6FF4D]">Fat Loss <ChevronDown size={15} /></button></div>
              <div className="grid items-center gap-4 lg:grid-cols-[170px_1fr]">
                <RingScore score={compatibilityScore} label="Good Match" size="small" />
                <div>
                  <p className="mb-3 text-sm leading-6 text-[#DDEBD8]">This meal is estimated against a balanced goal using the AI scan output.</p>
                  <div className="grid gap-2">
                    {compatibility.map(([text, type]) => (
                      <p key={text} className="flex items-start gap-2 text-sm text-[#DDEBD8]">
                        {type === "good" ? <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#A6FF4D]" /> : <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#FF9D28]" />}
                        <span>{text}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 xl:col-span-3">
              <div className="mb-3 flex items-center justify-between"><SectionTitle>Macro Distribution <Info size={16} className="text-[#A3B3A3]" /></SectionTitle><span className="text-xs text-[#A3B3A3]">Per serving</span></div>
              <div className="grid items-center gap-3 md:grid-cols-[150px_1fr] xl:grid-cols-1 2xl:grid-cols-[160px_1fr]">
                <div className="relative mx-auto h-[162px] w-[162px] min-w-[162px]">
                  <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={macroData} innerRadius={47} outerRadius={68} dataKey="value">{macroData.map((entry, index) => <Cell key={entry.name} fill={macroColors[index]} />)}</Pie></PieChart></ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><p className="text-3xl font-black">{calories}</p><p className="text-sm text-[#A3B3A3]">kcal</p></div>
                </div>
                <div className="space-y-3">
                  {macroData.map((item, index) => (
                    <div key={item.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: macroColors[index] }} />{item.name}</span><span className="text-[#DDEBD8]">{item.grams}g ({item.value}%)</span></div>
                      <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: macroColors[index] }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-4 xl:col-span-4">
              <div className="mb-4 flex items-center justify-between gap-3"><SectionTitle>Micronutrients Snapshot <Info size={16} className="text-[#A3B3A3]" /></SectionTitle><span className="text-xs text-[#A3B3A3]">% Daily Value</span></div>
              <div className="space-y-3.5">
                {micros.map(([label, value, color]) => (
                  <div key={label as string} className="grid grid-cols-[86px_1fr_38px] items-center gap-3 text-sm">
                    <span className="truncate">{label}</span><div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${clamp(Number(value), 1, 100)}%`, backgroundColor: color as string }} /></div><span className="text-right font-bold">{value}%</span>
                  </div>
                ))}
              </div>
              <button className="ml-auto mt-4 flex items-center gap-2 rounded-[10px] bg-[#A6FF4D]/10 px-3 py-2 text-sm font-bold text-[#A6FF4D] transition hover:bg-[#A6FF4D]/15">Estimated Micronutrients <ArrowRight size={16} /></button>
            </Card>
          </div>

          <div className="mt-3 rounded-[22px] border border-[#A6FF4D]/30 bg-[#07110A]/55 p-4">
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h3 className="flex items-center gap-3 text-lg font-black"><Sparkles className="text-[#A6FF4D]" size={23} />AI Quick Insight</h3>
                <p className="mt-3 max-w-[960px] text-sm leading-6 text-[#DDEBD8]">{analysis}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.slice(0, 4).map((item) => <span key={item} className="rounded-[10px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/10 px-3 py-2 text-xs font-bold text-[#A6FF4D] sm:text-sm">{item}</span>)}
                  {warnings.slice(0, 4).map((item) => <span key={item} className="rounded-[10px] border border-[#FF9D28]/25 bg-[#FF9D28]/10 px-3 py-2 text-xs font-bold text-[#FF9D28] sm:text-sm">{item}</span>)}
                </div>
              </div>
              <div className="grid gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
                <div><h4 className="flex items-center gap-2 font-black"><Clock3 size={19} className="text-[#DDEBD8]" />Best time to eat</h4><p className="mt-3 text-sm text-[#DDEBD8]">{bestTime}</p><p className="mt-2 text-sm text-[#A3B3A3]">Ideal for {mealType.toLowerCase()}</p></div>
                <div className="border-white/10 sm:border-l sm:pl-5"><h4 className="flex items-center gap-2 font-black"><Users size={19} className="text-[#DDEBD8]" />Who can eat this?</h4><p className="mt-3 text-sm text-[#DDEBD8]">Good for most people</p><p className="mt-2 text-sm text-[#A3B3A3]">Based on nutrition estimate</p></div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[#A3B3A3] sm:text-sm">ⓘ These values are AI-estimated and may vary. Please confirm with your nutritionist for medical advice.</p>
        </div>
      </div>
    </section>
  );
}
