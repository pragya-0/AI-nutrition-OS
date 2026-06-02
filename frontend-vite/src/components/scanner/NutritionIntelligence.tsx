"use client";

import { useState } from "react";
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

const insights = [
  { icon: Zap, title: "High in Protein", text: "Great source of protein that supports muscle growth and recovery.", tag: "Good", tone: "lime" },
  { icon: Droplets, title: "Moderate Calories", text: "Calorie content is moderate. Fits well into your daily goal.", tag: "Okay", tone: "cyan" },
  { icon: Leaf, title: "Good Fiber", text: "Contains good fiber that supports digestion and gut health.", tag: "Good", tone: "yellow" },
  { icon: AlertTriangle, title: "Moderate Saturated Fat", text: "Higher saturated fat due to butter and cream. Enjoy in moderation.", tag: "Watch", tone: "orange" },
  { icon: Home, title: "Sodium is Slightly High", text: "Salt content is on the higher side. Monitor intake if you have high BP.", tag: "Watch", tone: "purple" },
];

const healthBars = [
  { icon: Zap, label: "Muscle Growth", value: 92, tag: "High", color: "#8CFF2F" },
  { icon: Flame, label: "Fat Loss", value: 68, tag: "Good", color: "#A6FF4D" },
  { icon: RefreshCcw, label: "Recovery", value: 86, tag: "High", color: "#18D3D0" },
  { icon: Zap, label: "Energy", value: 74, tag: "Good", color: "#FFE234" },
  { icon: HeartPulse, label: "Heart Health", value: 58, tag: "Moderate", color: "#FF7A1A" },
  { icon: Brain, label: "Digestive Health", value: 72, tag: "Good", color: "#A96BFF" },
];

const nutrients = [
  { icon: ShieldCheck, label: "Protein", value: "22 g", tag: "High", color: "#8CFF2F" },
  { icon: Leaf, label: "Fiber", value: "6 g", tag: "Good", color: "#18D3D0" },
  { icon: Flame, label: "Saturated Fat", value: "8 g", tag: "Moderate", color: "#FF9D28" },
  { icon: Home, label: "Sugar", value: "12 g", tag: "Moderate", color: "#A96BFF" },
  { icon: Droplets, label: "Sodium", value: "680 mg", tag: "High", color: "#18D3D0" },
];

function ImpactRing() {
  const data = [{ name: "impact", value: 85, fill: "#8CFF2F" }];

  return (
    <div className="relative mx-auto h-[160px] w-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="78%" outerRadius="88%" data={data} startAngle={220} endAngle={-40}>
          <RadialBar dataKey="value" cornerRadius={18} background />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[42px] font-black leading-none tracking-[-0.06em]">
          85<span className="text-lg">%</span>
        </p>
        <p className="mt-2 text-xs text-[#DDEBD8]">Positive 🙂</p>
      </div>
    </div>
  );
}

export default function NutritionIntelligence() {
  const [goalOpen, setGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("Impact on your goals");
  const [conclusion, setConclusion] = useState(
    "A delicious and protein-rich meal. Best enjoyed in moderation and balanced with more salad or greens."
  );
  const [proTip, setProTip] = useState(
    "Pair this meal with a side salad, cucumber or leafy greens to increase fiber and reduce overall calorie density."
  );

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#030805] px-4 py-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[1780px] rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 sm:p-6 lg:p-7 xl:p-8">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(166,255,77,0.12),transparent_30%),radial-gradient(circle_at_12%_20%,rgba(24,211,208,0.10),transparent_32%),#041014] p-4 sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button
                onClick={() => window.history.back()}
                className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]"
              >
                <ArrowLeft size={17} />
                Back to Results
              </button>

              <h2 className="text-[28px] font-black tracking-[-0.04em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
                AI Nutrition Intelligence <span className="text-[#A6FF4D]">✣</span>
              </h2>

              <p className="mt-3 text-[14px] text-[#A3B3A3] xl:text-[15px]">
                Deep insights about your food and its impact on your health
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => scrollToSection("ai-analysis-result")}
                className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-bold transition hover:border-[#A6FF4D]/35"
              >
                <ArrowLeft size={17} />
                Previous
              </button>

              <button
                onClick={() => scrollToSection("ai-recommendations")}
                className="flex items-center gap-3 rounded-[14px] bg-[#A6FF4D] px-5 py-2.5 text-sm font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.26)] transition hover:scale-[1.02]"
              >
                Next: Recommendations
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-4">
              <h3 className="mb-3 flex items-center gap-3 border-b border-white/10 pb-3 text-xl font-black">
                <Brain className="text-[#A6FF4D]" size={24} />
                AI Insights
              </h3>

              {insights.map((item) => {
                const Icon = item.icon;
                const iconBg =
                  item.tone === "lime"
                    ? "bg-[#A6FF4D]/16 text-[#A6FF4D]"
                    : item.tone === "cyan"
                      ? "bg-[#18D3D0]/16 text-[#18D3D0]"
                      : item.tone === "yellow"
                        ? "bg-[#FFDD33]/16 text-[#FFDD33]"
                        : item.tone === "orange"
                          ? "bg-[#FF9D28]/16 text-[#FF9D28]"
                          : "bg-[#A96BFF]/16 text-[#A96BFF]";

                return (
                  <div
                    key={item.title}
                    className="grid grid-cols-[52px_1fr_auto] items-center gap-3 border-b border-white/10 py-3 last:border-b-0"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
                      <Icon size={21} />
                    </div>

                    <div>
                      <p className="font-black leading-tight">{item.title}</p>
                      <p className="mt-1 text-sm leading-[1.35] text-[#A3B3A3]">{item.text}</p>
                    </div>

                    <span
                      className={`rounded-[10px] px-3 py-1.5 text-sm font-black ${
                        item.tag === "Watch"
                          ? "bg-[#FF9D28]/12 text-[#FF9D28]"
                          : item.tag === "Okay"
                            ? "bg-[#18D3D0]/12 text-[#18D3D0]"
                            : "bg-[#A6FF4D]/12 text-[#A6FF4D]"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                );
              })}

              <div className="mt-6 rounded-[18px] border border-[#A6FF4D]/40 bg-[#A6FF4D]/8 p-4 shadow-[0_0_50px_rgba(166,255,77,0.08)]">
                <h4 className="flex items-center gap-3 font-black text-[#A6FF4D]">
                  <Brain size={20} />
                  AI Conclusion
                </h4>

                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="mt-2 min-h-[72px] w-full resize-none bg-transparent text-sm leading-6 text-[#DDEBD8] outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-4">
                <h3 className="mb-4 flex items-center gap-3 text-xl font-black">
                  <HeartPulse className="text-[#A6FF4D]" size={24} />
                  Health Impact
                  <ChevronDown size={16} className="text-[#A3B3A3]" />
                </h3>

                <div className="grid items-start gap-4 xl:grid-cols-[minmax(340px,1fr)_minmax(260px,300px)_230px]">
                  <div className="relative flex h-[500px] items-center justify-center overflow-visible rounded-[20px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(166,255,77,0.18),transparent_62%)]" />
<div className="relative z-20 pointer-events-none -translate-x-4">
  <Image
    src="/assets/scanner/scanner-health-human.png"
    alt="AI health human body"
    width={900}
    height={1200}
    className="
      object-contain
      scale-[2.33]
      origin-center
      drop-shadow-[0_0_120px_rgba(166,255,77,0.45)]
    "
  />
</div>

                    {healthBars.map((item, index) => (
                      <div
                        key={item.label}
                        className="pointer-events-none absolute right-0 h-px border-t border-dashed opacity-70"
                        style={{
                          top: `${88 + index * 68}px`,
                          width: "42%",
                          borderColor: item.color,
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex h-[500px] flex-col justify-center gap-4">
                    {healthBars.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="grid grid-cols-[42px_1fr_64px] items-center gap-3"
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `${item.color}22`,
                              color: item.color,
                            }}
                          >
                            <Icon size={20} />
                          </div>

                          <div className="min-w-0">
                            <p className="mb-1.5 font-black leading-tight">{item.label}</p>
                            <div className="h-[6px] rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full shadow-[0_0_18px_currentColor]"
                                style={{
                                  width: `${item.value}%`,
                                  backgroundColor: item.color,
                                  color: item.color,
                                }}
                              />
                            </div>
                          </div>

                          <p className="text-right text-sm font-black" style={{ color: item.color }}>
                            {item.tag}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative space-y-3">
                    <button
                      onClick={() => setGoalOpen(!goalOpen)}
                      className="flex w-full items-center justify-between rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#DDEBD8]"
                    >
                      <span className="truncate">{selectedGoal}</span>
                      <ChevronDown size={16} />
                    </button>

                    {goalOpen && (
                      <div className="absolute left-0 right-0 top-[58px] z-30 overflow-hidden rounded-[14px] border border-white/10 bg-[#041014] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        {["Impact on your goals", "Muscle gain", "Fat loss", "Recovery"].map((goal) => (
                          <button
                            key={goal}
                            onClick={() => {
                              setSelectedGoal(goal);
                              setGoalOpen(false);
                            }}
                            className="block w-full px-4 py-3 text-left text-sm text-[#DDEBD8] hover:bg-[#A6FF4D]/10 hover:text-[#A6FF4D]"
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="rounded-[20px] border border-white/10 bg-[#020604]/50 p-4 text-center">
                      <p className="font-black">Overall Impact</p>
                      <ImpactRing />
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-[#020604]/50 p-4">
                      <h4 className="flex items-center gap-3 font-black">
                        <Sun size={21} className="text-[#FFE234]" />
                        Best Time to Eat
                      </h4>
                      <p className="mt-3 text-sm text-[#DDEBD8]">12:00 PM - 2:00 PM</p>
                      <p className="mt-1 text-sm text-[#A3B3A3]">(Lunch)</p>
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-[#020604]/50 p-4">
                      <h4 className="flex items-center gap-3 font-black">
                        <Utensils size={21} className="text-[#A6FF4D]" />
                        Meal Type
                      </h4>
                      <span className="mt-3 inline-flex rounded-[10px] bg-[#A6FF4D]/12 px-3 py-1.5 text-sm font-black text-[#A6FF4D]">
                        Main Course
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#07110A]/70 p-4">
                <h3 className="mb-3 text-lg font-black">Key Nutrients Detected</h3>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {nutrients.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="relative min-h-[132px] min-w-0 rounded-[16px] border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-start gap-3 pr-3">
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `${item.color}20`,
                              color: item.color,
                            }}
                          >
                            <Icon size={20} />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[15px] leading-tight text-[#DDEBD8]">{item.label}</p>

                            <span
                              className="mt-2 inline-flex w-fit rounded-[8px] px-2 py-1 text-[10px] font-black"
                              style={{
                                backgroundColor: `${item.color}18`,
                                color: item.color,
                              }}
                            >
                              {item.tag}
                            </span>
                          </div>
                        </div>

                        <p className="absolute bottom-4 left-[68px] whitespace-nowrap text-[26px] font-black leading-none">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 overflow-hidden rounded-[24px] border border-[#A6FF4D]/35 bg-[#07110A]/70">
            <div className="grid items-center gap-4 p-4 lg:grid-cols-[1.15fr_420px]">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D]">
                  <Sparkles size={30} />
                </div>

                <div className="w-full">
                  <h3 className="text-2xl font-black text-[#A6FF4D]">AI Pro Tip</h3>
                  <textarea
                    value={proTip}
                    onChange={(e) => setProTip(e.target.value)}
                    className="mt-3 min-h-[58px] w-full resize-none bg-transparent text-base leading-7 text-[#F5F8F2] outline-none"
                  />
                </div>
              </div>

              <div className="relative hidden h-[150px] justify-end lg:flex">
                <div className="absolute inset-y-0 right-0 w-full rounded-full bg-[#A6FF4D]/35 blur-[100px]" />
                <Image
                  src="/assets/scanner/scanner-pro-tip-salad.png"
                  alt="Healthy salad recommendation"
                  width={820}
                  height={360}
                  className="relative z-10 h-[330px] -translate-y-16 w-auto object-contain drop-shadow-[0_0_90px_rgba(166,255,77,0.38)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}