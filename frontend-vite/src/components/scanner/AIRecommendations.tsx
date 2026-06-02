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

const preferences = [
  {
    id: "vegetarian",
    title: "Vegetarian",
    text: "No meat, seafood or eggs.",
    icon: Leaf,
    color: "#8CFF2F",
  },
  {
    id: "non-vegetarian",
    title: "Non-Vegetarian",
    text: "Includes all types of meat.",
    icon: Utensils,
    color: "#FF9D28",
  },
  {
    id: "vegan",
    title: "Vegan",
    text: "No animal products at all.",
    icon: Sprout,
    color: "#A96BFF",
  },
];

const currentMeal = {
  title: "Paneer Butter Masala",
  image: "/assets/scanner/scanner-result-paneer.png",
  serving: "1 Serving",
  weight: "450 g",
  kcal: 520,
  protein: "22 g",
  carbs: "48 g",
  fats: "24 g",
  fiber: "6 g",
};

const recommendedMeal = {
  title: "Grilled Chicken with Brown Rice",
  image: "/assets/scanner/grilled-chicken-brown-rice.png",
  serving: "1 Serving",
  weight: "420 g",
  kcal: 340,
  protein: "34 g",
  carbs: "36 g",
  fats: "12 g",
  fiber: "10 g",
};

const improvements = [
  { label: "Calories", value: "-180 kcal", icon: Flame, color: "#8CFF2F" },
  { label: "Protein", value: "+12 g", icon: ShieldCheck, color: "#8CFF2F" },
  { label: "Fats", value: "-12 g", icon: Zap, color: "#FFE234" },
  { label: "Fiber", value: "+4 g", icon: Wheat, color: "#A96BFF" },
];

const moreOptions = [
  {
    title: "Veggie Stir Fry with Tofu",
    image: "/assets/scanner/veggie-stir-fry-tofu.png",
    kcal: 310,
    score: 90,
  },
  {
    title: "Lemon Herb Tofu with Quinoa",
    image: "/assets/scanner/lemon-herb-tofu-quinoa.png",
    kcal: 320,
    score: 89,
  },
  {
    title: "Chickpea & Veg Power Bowl",
    image: "/assets/scanner/chickpea-veg-power-bowl.png",
    kcal: 330,
    score: 88,
  },
  {
    title: "Moong Dal Chilla with Salad",
    image: "/assets/scanner/moong-dal-chilla-salad.png",
    kcal: 280,
    score: 87,
  },
  {
    title: "Grilled Fish with Steamed Veg",
    image: "/assets/scanner/grilled-fish-steamed-veg.png",
    kcal: 300,
    score: 91,
  },
  {
    title: "Egg White Veggie Bowl",
    image: "/assets/scanner/egg-white-veggie-bowl.png",
    kcal: 290,
    score: 89,
  },
];

function FoodScoreRing() {
  const data = [{ name: "score", value: 78, fill: "#8CFF2F" }];

  return (
    <div className="relative mx-auto h-[170px] w-[170px]">
      <div className="absolute inset-7 rounded-full bg-[#A6FF4D]/10 blur-3xl" />

      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="78%"
          outerRadius="90%"
          data={data}
          startAngle={220}
          endAngle={-40}
        >
          <RadialBar dataKey="value" cornerRadius={18} background />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[38px] font-black leading-none text-[#8CFF2F]">
          +14
        </p>
        <p className="mt-2 text-xs text-[#DDEBD8]">Food Score</p>
      </div>
    </div>
  );
}

function MacroItem({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: any;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <Icon size={16} className="mx-auto mb-1" style={{ color }} />
      <p className="text-sm font-black text-[#F5F8F2]">{value}</p>
      <p className="text-xs text-[#A3B3A3]">{label}</p>
    </div>
  );
}

export default function AIRecommendations() {
  const [selectedPreference, setSelectedPreference] = useState("vegetarian");
  const [saved, setSaved] = useState(false);
  const [showReason, setShowReason] = useState(false);

  const selectedPreferenceLabel = useMemo(
    () => preferences.find((item) => item.id === selectedPreference)?.title,
    [selectedPreference]
  );

  return (
    <section
      id="ai-recommendations"
      className="bg-[#030805] px-4 py-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <div className="mx-auto max-w-[1780px] rounded-[30px] border border-[#173326] bg-[#020604]/95 p-5 sm:p-6 lg:p-7 xl:p-8">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_80%_18%,rgba(166,255,77,0.10),transparent_30%),radial-gradient(circle_at_12%_35%,rgba(24,211,208,0.08),transparent_32%),#041014] p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <button
                onClick={() =>
                  document
                    .getElementById("nutrition-intelligence")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#18D3D0] transition hover:text-[#A6FF4D]"
              >
                <ArrowLeft size={17} />
                Back to Analysis
              </button>

              <h2 className="text-[30px] font-black tracking-[-0.04em] sm:text-[36px] xl:text-[42px]">
                AI Recommendations <span className="text-[#A6FF4D]">✣</span>
              </h2>

              <p className="mt-3 text-[14px] text-[#DDEBD8] xl:text-[16px]">
                Get personalized food recommendations that match your goals and
                preferences.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setShowReason((prev) => !prev)}
                className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-[#F5F8F2] transition hover:border-[#A6FF4D]/35"
              >
                <HelpCircle size={17} />
                Why these recommendations?
              </button>

              <button
                onClick={() => setSaved((prev) => !prev)}
                className="flex items-center gap-3 rounded-[14px] bg-[#A6FF4D] px-5 py-3 text-sm font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.26)] transition hover:scale-[1.02]"
              >
                {saved ? <Check size={17} /> : <Plus size={17} />}
                {saved ? "Saved to My Meals" : "Save to My Meals"}
              </button>
            </div>
          </div>

          {showReason && (
            <div className="mb-4 rounded-[18px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/8 p-4 text-sm leading-6 text-[#DDEBD8]">
              Recommendations are based on your selected preference, lower
              calorie density, higher protein, better fiber balance, and reduced
              saturated fat compared to your current meal.
            </div>
          )}

          <div className="rounded-[20px] border border-white/10 bg-[#07110A]/70 p-5">
            <h3 className="text-lg font-black">1. Choose Your Preference</h3>
            <p className="mt-2 text-sm text-[#DDEBD8]">
              We’ll tailor recommendations just for you.
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {preferences.map((item) => {
                const Icon = item.icon;
                const active = selectedPreference === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPreference(item.id)}
                    className={`flex items-center justify-between rounded-[18px] border p-5 text-left transition ${
                      active
                        ? "border-[#8CFF2F] bg-[#A6FF4D]/8 shadow-[0_0_45px_rgba(166,255,77,0.12)]"
                        : "border-white/10 bg-white/[0.03] hover:border-[#A6FF4D]/30"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className="flex h-16 w-16 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${item.color}18`,
                          color: item.color,
                        }}
                      >
                        <Icon size={34} />
                      </span>

                      <div>
                        <p className="text-lg font-black text-[#F5F8F2]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm text-[#DDEBD8]">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        active
                          ? "border-[#8CFF2F] bg-[#8CFF2F] text-[#07110A]"
                          : "border-[#A3B3A3]"
                      }`}
                    >
                      {active && <Check size={15} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.58fr_1.08fr]">
            <div className="rounded-[20px] border border-white/10 bg-[#07110A]/70 p-5">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="text-lg font-black">2. Your Current Choice</h3>
                <span className="rounded-[9px] bg-[#FF9D28]/14 px-3 py-1 text-xs font-black text-[#FF9D28]">
                  Analyzed
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-[220px_1fr] xl:grid-cols-[230px_1fr]">
                <Image
                  src={currentMeal.image}
                  alt={currentMeal.title}
                  width={280}
                  height={280}
                  className="h-[220px] w-[220px] rounded-[22px] object-cover shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                />

                <div>
                  <h4 className="text-xl font-black">{currentMeal.title}</h4>
                  <p className="mt-3 text-sm text-[#DDEBD8]">
                    {currentMeal.serving} • {currentMeal.weight}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-2">
                    <Flame size={17} className="text-[#FF9D28]" />
                    <span className="text-xl">{currentMeal.kcal} kcal</span>
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-3 border-t border-white/10 pt-4">
                    <MacroItem icon={ShieldCheck} value={currentMeal.protein} label="Protein" color="#8CFF2F" />
                    <MacroItem icon={Droplets} value={currentMeal.carbs} label="Carbs" color="#18D3D0" />
                    <MacroItem icon={Flame} value={currentMeal.fats} label="Fats" color="#FF9D28" />
                    <MacroItem icon={Wheat} value={currentMeal.fiber} label="Fiber" color="#DDEBD8" />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[16px] border border-[#FF9D28]/25 bg-[#FF9D28]/6 p-4">
                <h4 className="flex items-center gap-3 font-black text-[#FF9D28]">
                  <AlertTriangle size={18} />
                  Why improve?
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#DDEBD8]">
                  High in saturated fat and calories. Moderate in fiber.
                </p>
              </div>
            </div>

            <div className="relative flex flex-col justify-center rounded-[20px] border border-[#18D3D0]/20 bg-[#07110A]/70 p-5">
              <h3 className="mb-4 text-center text-lg font-black text-[#A6FF4D]">
                3. AI Improvement Suggestion
              </h3>

              <FoodScoreRing />

              <div className="mt-5 space-y-3">
                {improvements.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: `${item.color}18`,
                            color: item.color,
                          }}
                        >
                          <Icon size={15} />
                        </span>
                        <span className="text-sm text-[#DDEBD8]">
                          {item.label}
                        </span>
                      </div>

                      <span className="text-sm font-black text-[#8CFF2F]">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[20px] border border-[#8CFF2F]/45 bg-[#A6FF4D]/6 p-5 shadow-[0_0_50px_rgba(166,255,77,0.08)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-[#A6FF4D]">
                  4. Recommended for You
                </h3>
                <span className="rounded-[9px] bg-[#A6FF4D]/14 px-3 py-1 text-xs font-black text-[#A6FF4D]">
                  Better Match
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-[250px_1fr]">
                <Image
                  src={recommendedMeal.image}
                  alt={recommendedMeal.title}
                  width={330}
                  height={330}
                  className="h-[230px] w-[250px] rounded-[22px] object-cover shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                />

                <div>
                  <h4 className="text-xl font-black leading-tight">
                    {recommendedMeal.title}
                  </h4>
                  <p className="mt-3 text-sm text-[#DDEBD8]">
                    {recommendedMeal.serving} • {recommendedMeal.weight}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.03] px-4 py-2">
                    <Flame size={17} className="text-[#8CFF2F]" />
                    <span className="text-xl">{recommendedMeal.kcal} kcal</span>
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-3 border-t border-white/10 pt-4">
                    <MacroItem icon={ShieldCheck} value={recommendedMeal.protein} label="Protein" color="#8CFF2F" />
                    <MacroItem icon={Droplets} value={recommendedMeal.carbs} label="Carbs" color="#18D3D0" />
                    <MacroItem icon={Flame} value={recommendedMeal.fats} label="Fats" color="#FF9D28" />
                    <MacroItem icon={Wheat} value={recommendedMeal.fiber} label="Fiber" color="#DDEBD8" />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[16px] border border-[#A6FF4D]/25 bg-[#A6FF4D]/8 p-4">
                <h4 className="flex items-center gap-3 font-black text-[#A6FF4D]">
                  <ShieldCheck size={18} />
                  Why better?
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#DDEBD8]">
                  Higher protein, lower calories and fats. Great for fat loss and
                  muscle retention.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[20px] border border-white/10 bg-[#07110A]/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black">More Options for You</h3>

              <button className="flex items-center gap-2 text-sm font-black text-[#A6FF4D]">
                View all options
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              {moreOptions.map((item) => (
                <button
                  key={item.title}
                  className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-[#A6FF4D]/35"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={90}
                    height={90}
                    className="h-16 w-16 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-tight text-[#DDEBD8]">
                      {item.title}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-[#DDEBD8]">
                      <Flame size={13} className="text-[#FF9D28]" />
                      {item.kcal} kcal
                    </p>
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8CFF2F] text-sm font-black text-[#8CFF2F]">
                    {item.score}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm text-[#A3B3A3]">
              Current preference:{" "}
              <span className="font-black text-[#A6FF4D]">
                {selectedPreferenceLabel}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}