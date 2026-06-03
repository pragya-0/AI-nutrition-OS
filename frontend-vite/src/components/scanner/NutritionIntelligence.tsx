"use client";

import Image from "@/compat/NextImage";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  ChevronDown,
  Droplets,
  Flame,
  HeartPulse,
  Home,
  Leaf,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Utensils,
  Zap,
} from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";

type HealthMetric = {
  key?: string;
  label: string;
  value: number;
  status?: string;
  tag?: string;
  color?: string;
};

type BackendHealthImpact = {
  overall_score?: number;
  summary?: string;
  metrics?: HealthMetric[];
  meal_type?: string;
  best_time_to_eat?: string;
  best_time_label?: string;
  pro_tip?: string;
  source?: string;
};

type ScanResult = {
  detected_food?: string;
  confidence?: number;
  health_score?: number;
  analysis?: string;
  message?: string;
  warnings?: string[];
  suggestions?: string[];
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
  micronutrients?: {
    calcium?: number;
    iron?: number;
    vitamin_a?: number;
    vitamin_c?: number;
    potassium?: number;
    magnesium?: number;
  };
  meal_type?: string;
  best_time_to_eat?: string;
  health_impact?: BackendHealthImpact;
};

const metricIconMap: Record<string, any> = {
  muscle_growth: Zap,
  fat_loss: Flame,
  recovery: RefreshCcw,
  energy: Zap,
  heart_health: HeartPulse,
  digestive_health: Brain,
};

const metricColorFallback: Record<string, string> = {
  muscle_growth: "#8CFF2F",
  fat_loss: "#A6FF4D",
  recovery: "#18D3D0",
  energy: "#FFE234",
  heart_health: "#FF7A1A",
  digestive_health: "#A96BFF",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function numberValue(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function statusTone(status?: string) {
  const text = String(status || "").toLowerCase();

  if (text.includes("watch") || text.includes("low")) return "text-[#FF9D28]";
  if (text.includes("moderate")) return "text-[#FFE234]";
  if (text.includes("high") || text.includes("good")) return "text-[#A6FF4D]";
  return "text-[#DDEBD8]";
}

function nutrientTag(label: string, value: number) {
  const key = label.toLowerCase();
  if (key.includes("protein")) return value >= 20 ? "High" : value >= 12 ? "Good" : "Low";
  if (key.includes("fiber")) return value >= 6 ? "Good" : value >= 3 ? "Moderate" : "Low";
  if (key.includes("saturated")) return value > 8 ? "High" : value > 5 ? "Moderate" : "Okay";
  if (key.includes("sugar")) return value > 12 ? "High" : value > 6 ? "Moderate" : "Low";
  if (key.includes("sodium")) return value > 650 ? "High" : value > 450 ? "Moderate" : "Good";
  return "Good";
}

function ImpactRing({ score }: { score: number }) {
  const safeScore = clamp(score, 0, 100);
  const data = [{ name: "impact", value: safeScore, fill: "#8CFF2F" }];

  return (
    <div className="relative mx-auto h-[132px] w-[132px] sm:h-[144px] sm:w-[144px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="78%" outerRadius="88%" data={data} startAngle={220} endAngle={-40}>
          <RadialBar dataKey="value" cornerRadius={18} background />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[34px] font-black leading-none tracking-[-0.06em] sm:text-[38px]">
          {safeScore}<span className="text-base">%</span>
        </p>
        <p className="mt-1 text-[11px] text-[#DDEBD8]">
          {safeScore >= 85 ? "Positive" : safeScore >= 70 ? "Balanced" : "Watch"}
        </p>
      </div>
    </div>
  );
}

export default function NutritionIntelligence({ result }: { result?: ScanResult }) {
  const [goalOpen, setGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("Impact on your goals");

  const nutrition = result?.estimated_nutrition || {};
  const foodName = result?.detected_food || "Detected Meal";
  const calories = numberValue(nutrition.calories);
  const protein = numberValue(nutrition.protein);
  const carbs = numberValue(nutrition.carbs);
  const fats = numberValue(nutrition.fats);
  const fiber = numberValue(nutrition.fiber, Math.max(1, Math.round(carbs * 0.12)));
  const sugar = numberValue(nutrition.sugar, Math.max(1, Math.round(carbs * 0.18)));
  const sodium = numberValue(nutrition.sodium, Math.max(50, Math.round(180 + fats * 8 + calories * 0.3)));
  const saturatedFat = numberValue(nutrition.saturated_fat, Math.max(1, Math.round(fats * 0.28)));
  const healthScore = numberValue(result?.health_score, 75);
  const confidence = Math.round(numberValue(result?.confidence, 0.75) * 100);
  const backendImpact = result?.health_impact;

  const fallbackMetrics: HealthMetric[] = [
    { key: "muscle_growth", label: "Muscle Growth", value: clamp(35 + protein * 1.8, 20, 95), status: protein >= 25 ? "High" : protein >= 18 ? "Good" : "Low", color: "#8CFF2F" },
    { key: "fat_loss", label: "Fat Loss", value: clamp(96 - calories * 0.065 - fats * 0.65 + protein * 0.4 + fiber * 0.6, 30, 92), status: calories <= 450 && fats <= 20 ? "Good" : calories <= 650 ? "Moderate" : "Watch", color: "#A6FF4D" },
    { key: "recovery", label: "Recovery", value: clamp(45 + protein * 1.45 + carbs * 0.18, 30, 92), status: protein >= 22 ? "High" : protein >= 14 ? "Good" : "Low", color: "#18D3D0" },
    { key: "energy", label: "Energy", value: clamp(40 + carbs * 0.72 + calories * 0.018, 35, 90), status: carbs >= 35 ? "Good" : carbs >= 18 ? "Moderate" : "Light", color: "#FFE234" },
    { key: "heart_health", label: "Heart Health", value: clamp(90 - saturatedFat * 2.3 - sodium * 0.022 + fiber * 1.35, 25, 90), status: saturatedFat > 8 || sodium > 650 ? "Watch" : saturatedFat > 5 || sodium > 450 ? "Moderate" : "Good", color: "#FF7A1A" },
    { key: "digestive_health", label: "Digestive Health", value: clamp(45 + fiber * 5.2 - sugar * 0.38, 35, 90), status: fiber >= 7 ? "Good" : fiber >= 4 ? "Moderate" : "Low", color: "#A96BFF" },
  ];

  const healthMetrics = useMemo(() => {
    const metrics = backendImpact?.metrics?.length ? backendImpact.metrics : fallbackMetrics;

    return metrics.map((metric) => {
      const key = metric.key || metric.label.toLowerCase().replaceAll(" ", "_");
      return {
        ...metric,
        key,
        value: clamp(numberValue(metric.value, 50), 0, 100),
        status: metric.status || metric.tag || "Good",
        color: metric.color || metricColorFallback[key] || "#A6FF4D",
        icon: metricIconMap[key] || Zap,
      };
    });
  }, [backendImpact?.metrics, protein, calories, fats, carbs, fiber, sugar, sodium, saturatedFat]);

  const mealType = backendImpact?.meal_type || result?.meal_type || "Meal";
  const bestTime = backendImpact?.best_time_to_eat || result?.best_time_to_eat || "12:00 PM - 2:00 PM";
  const bestTimeLabel = backendImpact?.best_time_label || (mealType === "Main Course" ? "Lunch / Dinner" : mealType === "Light Meal" ? "Breakfast / Light meal" : "Snack / Small meal");
  const conclusion = backendImpact?.summary || result?.analysis || result?.message || `${foodName} was analyzed by the backend scanner.`;
  const proTip = backendImpact?.pro_tip || result?.suggestions?.[0] || "Keep portion size aligned with your nutrition goal.";
  const impactSource = backendImpact?.source || "frontend_fallback_until_backend_update";



  const insights = [
    { icon: Zap, title: protein >= 25 ? "High Protein" : protein >= 15 ? "Moderate Protein" : "Low Protein", text: `Backend estimate: ${protein}g protein. Confidence: ${confidence}%.`, tag: protein >= 15 ? "Good" : "Watch", color: "#8CFF2F" },
    { icon: Droplets, title: calories >= 600 ? "High Calories" : calories >= 300 ? "Moderate Calories" : "Light Calories", text: `Backend estimate: ${calories} kcal.`, tag: calories >= 600 ? "Watch" : "Okay", color: "#18D3D0" },
    { icon: Leaf, title: fiber >= 6 ? "Good Fiber" : "Moderate Fiber", text: `Backend estimate: ${fiber}g fiber.`, tag: fiber >= 6 ? "Good" : "Okay", color: "#FFDD33" },
    { icon: AlertTriangle, title: saturatedFat > 8 ? "Saturated Fat Watch" : "Balanced Fat", text: `Fat: ${fats}g. Saturated fat: ${saturatedFat}g.`, tag: saturatedFat > 8 ? "Watch" : "Good", color: "#FF9D28" },
    { icon: Home, title: sodium > 650 ? "Sodium Watch" : "Sodium Moderate", text: `Backend estimate: ${sodium}mg sodium.`, tag: sodium > 650 ? "Watch" : "Okay", color: "#A96BFF" },
  ];

  const nutrients = [
    { icon: ShieldCheck, label: "Protein", value: `${protein} g`, raw: protein, color: "#8CFF2F" },
    { icon: Leaf, label: "Fiber", value: `${fiber} g`, raw: fiber, color: "#18D3D0" },
    { icon: Flame, label: "Saturated Fat", value: `${saturatedFat} g`, raw: saturatedFat, color: "#FF9D28" },
    { icon: Home, label: "Sugar", value: `${sugar} g`, raw: sugar, color: "#A96BFF" },
    { icon: Droplets, label: "Sodium", value: `${sodium} mg`, raw: sodium, color: "#18D3D0" },
  ];

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="nutrition-intelligence" className="bg-[#030805] px-3 py-3 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[1780px] rounded-[26px] border border-[#173326] bg-[#020604]/95 p-3 sm:rounded-[30px] sm:p-5 lg:p-6">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(166,255,77,0.12),transparent_30%),radial-gradient(circle_at_12%_20%,rgba(24,211,208,0.10),transparent_32%),#041014] p-4 sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button onClick={() => scrollToSection("ai-analysis-result")} className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]">
                <ArrowLeft size={17} /> Back to Results
              </button>

              <h2 className="text-[28px] font-black tracking-[-0.04em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
                AI Nutrition Intelligence <span className="text-[#A6FF4D]">✣</span>
              </h2>
              <p className="mt-2 text-sm text-[#A3B3A3] xl:text-[15px]">Backend-calculated dynamic insights for {foodName}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button onClick={() => scrollToSection("ai-analysis-result")} className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-bold transition hover:border-[#A6FF4D]/35">
                <ArrowLeft size={17} /> Previous
              </button>
              <button onClick={() => scrollToSection("ai-recommendations")} className="flex items-center gap-2 rounded-[14px] bg-[#A6FF4D] px-4 py-2.5 text-sm font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.26)] transition hover:scale-[1.02]">
                Next: Recommendations <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="grid items-start gap-4 xl:grid-cols-[0.72fr_1.28fr]">
            <div className="self-start rounded-[22px] border border-white/10 bg-[#07110A]/70 p-4">
              <h3 className="mb-2 flex items-center gap-3 border-b border-white/10 pb-3 text-lg font-black sm:text-xl">
                <Brain className="text-[#A6FF4D]" size={23} /> AI Insights
              </h3>

              <div className="divide-y divide-white/10">
                {insights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="grid grid-cols-[38px_1fr_auto] items-center gap-2.5 py-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black leading-tight">{item.title}</p>
                        <p className="mt-1 text-sm leading-[1.35] text-[#A3B3A3]">{item.text}</p>
                      </div>
                      <span className={`rounded-[10px] px-2.5 py-1 text-xs font-black ${item.tag === "Watch" ? "bg-[#FF9D28]/12 text-[#FF9D28]" : item.tag === "Okay" ? "bg-[#18D3D0]/12 text-[#18D3D0]" : "bg-[#A6FF4D]/12 text-[#A6FF4D]"}`}>{item.tag}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 rounded-[18px] border border-[#A6FF4D]/40 bg-[#A6FF4D]/8 p-4">
                <h4 className="flex items-center gap-3 font-black text-[#A6FF4D]"><Brain size={20} /> AI Conclusion</h4>
                <p className="mt-2 text-sm leading-6 text-[#DDEBD8]">{conclusion}</p>
                <p className="mt-3 text-xs font-semibold text-[#A3B3A3]">Source: {impactSource}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[22px] border border-white/10 bg-[#07110A]/70 p-4">
                <h3 className="mb-3 flex items-center gap-3 text-lg font-black sm:text-xl">
                  <HeartPulse className="text-[#A6FF4D]" size={23} /> Health Impact <ChevronDown size={16} className="text-[#A3B3A3]" />
                </h3>

                <div className="grid items-start gap-4 xl:grid-cols-[minmax(300px,0.95fr)_minmax(270px,0.9fr)_220px] 2xl:grid-cols-[minmax(340px,1fr)_minmax(290px,0.9fr)_230px]">
                  <div className="relative hidden min-h-[390px] items-end justify-center overflow-hidden rounded-[20px] border border-white/5 bg-[#020604]/25 lg:flex xl:min-h-[430px] 2xl:min-h-[460px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(166,255,77,0.18),transparent_62%)]" />
      <Image
  src="/assets/scanner/scanner-health-human.png"
  alt="AI health human body"
  width={720}
  height={980}
  className="
absolute
bottom-[-60px]
left-1
-transform-x-1/2
z-10
h-[450px]
max-w-none
object-cover
scale-[1]
origin-bottom
drop-shadow-[0_0_110px_rgba(166,255,77,0.45)]

  "
/>
                  </div>

                  <div className="flex min-h-[390px] flex-col justify-center gap-4 self-stretch rounded-[20px] border border-white/5 bg-[#020604]/25 p-3 xl:min-h-[430px] 2xl:min-h-[460px]">
                    {healthMetrics.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="grid grid-cols-[38px_1fr_68px] items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${item.color}22`, color: item.color }}><Icon size={18} /></div>
                          <div className="min-w-0">
                            <p className="mb-1 text-sm font-black leading-tight sm:text-base">{item.label}</p>
                            <div className="h-[6px] rounded-full bg-white/10"><div className="h-full rounded-full shadow-[0_0_18px_currentColor]" style={{ width: `${item.value}%`, backgroundColor: item.color, color: item.color }} /></div>
                          </div>
                          <p className={`text-right text-sm font-black ${statusTone(item.status)}`}>{item.status}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <button onClick={() => setGoalOpen(!goalOpen)} className="relative flex w-full items-center justify-between rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#DDEBD8]">
                      <span className="truncate">{selectedGoal}</span><ChevronDown size={16} />
                    </button>
                    {goalOpen && (
                      <div className="absolute z-30 mt-1 w-[220px] overflow-hidden rounded-[14px] border border-white/10 bg-[#041014] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        {["Impact on your goals", "Muscle gain", "Fat loss", "Recovery"].map((goal) => (
                          <button key={goal} onClick={() => { setSelectedGoal(goal); setGoalOpen(false); }} className="block w-full px-4 py-3 text-left text-sm text-[#DDEBD8] hover:bg-[#A6FF4D]/10 hover:text-[#A6FF4D]">{goal}</button>
                        ))}
                      </div>
                    )}

                    <div className="rounded-[18px] border border-white/10 bg-[#020604]/50 p-3 text-center">
                      <p className="font-black">Overall Impact</p>
                      <ImpactRing score={numberValue(backendImpact?.overall_score, healthScore)} />
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-[#020604]/50 p-4">
                      <h4 className="flex items-center gap-3 font-black"><Sun size={20} className="text-[#FFE234]" /> Best Time to Eat</h4>
                      <p className="mt-2 text-sm text-[#DDEBD8]">{bestTime}</p>
                      <p className="mt-1 text-sm text-[#A3B3A3]">({bestTimeLabel})</p>
                    </div>
                    <div className="rounded-[18px] border border-white/10 bg-[#020604]/50 p-4">
                      <h4 className="flex items-center gap-3 font-black"><Utensils size={20} className="text-[#A6FF4D]" /> Meal Type</h4>
                      <span className="mt-3 inline-flex rounded-[10px] bg-[#A6FF4D]/12 px-3 py-1.5 text-sm font-black text-[#A6FF4D]">{mealType}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-3 rounded-[22px] border border-white/10 bg-[#07110A]/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-black">Key Nutrients Detected</h3>
              <span className="hidden rounded-full border border-[#A6FF4D]/20 bg-[#A6FF4D]/8 px-3 py-1 text-xs font-black text-[#A6FF4D] sm:inline-flex">Backend macros</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {nutrients.map((item) => {
                    const Icon = item.icon;
                    const tag = nutrientTag(item.label, item.raw);
                    return (
                      <div key={item.label} className="min-h-[106px] rounded-[16px] border border-white/10 bg-white/[0.03] p-3.5 sm:min-h-[116px]">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${item.color}20`, color: item.color }}><Icon size={20} /></span>
                          <div className="min-w-0 flex-1"><p className="text-[15px] leading-tight text-[#DDEBD8]">{item.label}</p><span className="mt-2 inline-flex w-fit rounded-[8px] px-2 py-1 text-[10px] font-black" style={{ backgroundColor: `${item.color}18`, color: item.color }}>{tag}</span></div>
                        </div>
                        <p className="mt-4 whitespace-nowrap text-[24px] font-black leading-none 2xl:text-[28px]">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

          <div className="mt-3 overflow-hidden rounded-[22px] border border-[#A6FF4D]/35 bg-[#07110A]/70">
            <div className="grid items-center gap-4 p-4 lg:grid-cols-[1.15fr_360px]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D]"><Sparkles size={26} /></div>
                <div className="w-full"><h3 className="text-xl font-black text-[#A6FF4D] sm:text-2xl">AI Pro Tip</h3><p className="mt-2 text-sm leading-6 text-[#F5F8F2] sm:text-base">{proTip}</p></div>
              </div>
              <div className="relative hidden h-[118px] justify-end lg:flex"><div className="absolute inset-y-0 right-0 w-full rounded-full bg-[#A6FF4D]/35 blur-[90px]" /><Image src="/assets/scanner/scanner-pro-tip-salad.png" alt="Healthy salad recommendation" width={720} height={320} className="relative z-10 h-[250px] -translate-y-14 w-auto object-contain drop-shadow-[0_0_80px_rgba(166,255,77,0.38)]" /></div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#A3B3A3] sm:text-sm">ⓘ Health-impact labels are now backend-calculated. The frontend only renders the backend payload.</p>
        </div>
      </div>
    </section>
  );
}
