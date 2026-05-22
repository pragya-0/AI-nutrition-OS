"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Brain,
  CalendarClock,
  Camera,
  Dumbbell,
  ScanLine,
  Sparkles,
} from "lucide-react";

import Hero from "@/components/Hero";
import AnalyticsCard from "@/components/AnalyticsCard";
import DayTabs from "@/components/DayTabs";
import AvoidFoods from "@/components/AvoidFoods";
import AIInsight from "@/components/AIInsight";
import MacroChart from "@/components/MacroChart";
import ProgressChart from "@/components/ProgressChart";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ai-nutrition-backend-20tf.onrender.com";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const generatePlan = async (formData: any) => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const weight = Number(formData.weight);
      const height = Number(formData.height);
      const age = Number(formData.age);
      const days = Number(formData.days);
      const waterIntake = Number(formData.water_intake);

      if (!formData.name?.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (!formData.phone_number?.trim()) {
        setError("Please enter your phone number.");
        return;
      }

      if (!weight || weight < 30 || weight > 250) {
        setError("Please enter a realistic weight between 30 kg and 250 kg.");
        return;
      }

      if (!height || height < 140 || height > 220) {
        setError("Please enter a realistic height between 140 cm and 220 cm.");
        return;
      }

      if (!age || age < 12 || age > 100) {
        setError("Please enter a realistic age between 12 and 100 years.");
        return;
      }

      if (!days || days < 1 || days > 30) {
        setError("Please select a plan duration between 1 and 30 days.");
        return;
      }

      if (!waterIntake || waterIntake < 0.5 || waterIntake > 8) {
        setError("Please enter water intake between 0.5 and 8 liters.");
        return;
      }

      const pregnancyStatus = String(
        formData.pregnancy_status ?? ""
      ).toLowerCase();

      if (
        String(formData.gender ?? "").toLowerCase() === "male" &&
        (pregnancyStatus === "pregnant" || pregnancyStatus === "pregnancy")
      ) {
        setError("Pregnancy status conflicts with selected gender.");
        return;
      }

      console.log("PAYLOAD SENT TO BACKEND:", {
        ...formData,
        weight,
        height,
        age,
        days,
        water_intake: waterIntake,
      });

      const response = await fetch(`${API_URL}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          blood_group: formData.blood_group,
          city: formData.city,
          email: formData.email,

          weight,
          height,
          age,

          gender: formData.gender ?? "female",
          goal: formData.goal,
          activity: formData.activity,
          diet: formData.diet,

          days,

          sleep_time: formData.sleep_time,
          wake_time: formData.wake_time,
          water_intake: waterIntake,

          preferred_cuisine: formData.preferred_cuisine,
          fitness_level: formData.fitness_level,

          allergies: [],
          disliked_foods: [],

          medical_conditions:
            typeof formData.medical_conditions === "string"
              ? formData.medical_conditions
              : Array.isArray(formData.medical_conditions)
              ? formData.medical_conditions.join(", ")
              : "",
          pregnancy_status: formData.pregnancy_status ?? "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const backendMessage =
          typeof data?.detail === "string"
            ? data.detail
            : data?.message || "Backend returned an error. Please try again.";

        if (
          backendMessage
            .toLowerCase()
            .includes("pregnancy status is incompatible with male gender")
        ) {
          setError("Pregnancy status conflicts with selected gender.");
          return;
        }

        setError(backendMessage);
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("API ERROR:", error);
      setError(
        "Backend temporarily unavailable. Please try again in a few seconds."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Hero onGenerate={generatePlan} loading={loading} />

        {loading && <GeneratingPanel />}

        {error && (
          <div className="mt-10 rounded-[32px] border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {result && <ProfessionalResultSection result={result} />}

        <FeaturesPanel />
        <ScannerActionSection />
        <TestimonialsPanel />
      </div>
    </main>
  );
}

function GeneratingPanel() {
  return (
    <section className="mt-10 rounded-[36px] border border-green-500/20 bg-zinc-950/90 p-10 text-center shadow-[0_0_60px_rgba(34,197,94,0.12)]">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 text-5xl">
        🧠
      </div>

      <h2 className="text-3xl font-black text-white">
        Generating Your AI Nutrition Plan...
      </h2>

      <p className="mt-3 text-zinc-400">
        Building analytics, macros, meal plan, avoid-food intelligence, and AI
        coaching.
      </p>
    </section>
  );
}

function ProfessionalResultSection({ result }: { result: any }) {
  const goal = result?.user_profile?.goal ?? "";
  const days = Number(result?.user_profile?.days ?? 1);
  const targetCalories = Number(result?.targets?.calories ?? 0);
  const tdee = Number(result?.analytics?.tdee ?? targetCalories);
  const healthScore = Number(result?.analytics?.health_score ?? 75);

  const userWeight = Number(result?.user_profile?.weight ?? 60);
  const activity = result?.user_profile?.activity ?? "moderate";
  const diet = result?.user_profile?.diet ?? "vegetarian";

  const dynamicWaterTarget = calculateWaterTarget(userWeight, activity, goal);

  const safeMealDays = (result?.meal_plan?.days ?? []).map((day: any) => {
    const safeBreakfast = sanitizeMealByDiet(day?.breakfast, diet);
    const safeLunch = sanitizeMealByDiet(day?.lunch, diet);
    const safeSnack = makeSnackUnique(
      sanitizeMealByDiet(day?.snack ?? day?.snacks, diet),
      safeBreakfast,
      diet
    );
    const safeDinner = sanitizeMealByDiet(day?.dinner, diet);

    return {
      ...day,
      breakfast: safeBreakfast,
      lunch: safeLunch,
      snack: safeSnack,
      dinner: safeDinner,
      water_target: dynamicWaterTarget,
      workout_tip:
        day?.workout_tip?.trim() || generateWorkoutTip(goal, activity),
      alternatives: filterDietSafeAlternatives(day?.alternatives ?? [], diet),
    };
  });

  const correctedBodyFat = calculateBodyFatDisplay({
    bmi: Number(result?.analytics?.bmi ?? 0),
    age: Number(result?.user_profile?.age ?? 25),
    gender: result?.user_profile?.gender ?? "female",
  });

  const dailyCalorieGap = tdee - targetCalories;

  const expectedWeightChange = calculateExpectedWeightChange({
    goal,
    dailyCalorieGap,
    days,
  });

  const consistencyScore = calculateConsistencyScore({
    healthScore,
    hydrationScore: Number(result?.analytics?.hydration_score ?? 70),
    protein: Number(result?.targets?.protein ?? 0),
    calories: targetCalories,
  });

  const medicalWarnings = dedupeStrings(
    result?.medical_safety?.medical_warnings ?? []
  );

  const safetyWarnings = dedupeStrings(result?.safety_warnings ?? []);

  const replacementRecords = dedupeReplacementRecords(
    result?.medical_safety?.foods_replaced ?? []
  );

  const planAdjustedForSafety =
    safetyWarnings.length > 0 ||
    medicalWarnings.length > 0 ||
    replacementRecords.length > 0 ||
    Number(result?.medical_safety?.safety_score ?? 100) < 95;

  const medicalText = String(
    result?.user_profile?.medical_conditions ?? ""
  ).toLowerCase();

  const pregnancyText = String(
    result?.user_profile?.pregnancy_status ?? ""
  ).toLowerCase();

  const safetyTags = getSafetyTags({
    medicalText,
    pregnancyText,
    safetyWarnings,
    medicalWarnings,
  });

  const lowHydration =
    Number(result?.user_profile?.water_intake ?? 0) > 0 &&
    Number(result?.user_profile?.water_intake ?? 0) < 1.5;

  return (
    <section className="mt-10 space-y-10">
      <div className="relative overflow-hidden rounded-[44px] border border-green-500/20 bg-gradient-to-br from-zinc-950 via-zinc-950 to-green-950/20 p-8 shadow-[0_0_90px_rgba(34,197,94,0.12)] lg:p-10">
        <div className="absolute right-[-160px] top-[-160px] h-[360px] w-[360px] rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative z-10 mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              AI Nutrition Report
            </p>

            <h2 className="mt-3 text-4xl font-black leading-tight lg:text-6xl">
              Your Personalized
              <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-lime-200 bg-clip-text text-transparent">
                Health Dashboard
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
              Generated using your body profile, goal, activity level, sleep
              routine, hydration, and AI nutrition intelligence.
            </p>
          </div>

          <div className="rounded-[32px] bg-green-400 px-7 py-5 text-black shadow-2xl shadow-green-500/20">
            <p className="text-sm font-black uppercase tracking-wide">
              Health Score
            </p>

            <p className="mt-1 text-5xl font-black">
              {result.analytics?.health_score ?? "N/A"}
              <span className="text-2xl">/100</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <AnalyticsCard title="BMI" value={result.analytics?.bmi ?? "N/A"} icon="📊" />
          <AnalyticsCard title="BMR" value={result.analytics?.bmr ?? "N/A"} unit="kcal" icon="🔥" />
          <AnalyticsCard title="TDEE" value={result.analytics?.tdee ?? "N/A"} unit="kcal" icon="⚡" />
          <AnalyticsCard title="Body Fat" value={correctedBodyFat} unit="%" icon="💪" />
          <AnalyticsCard title="Hydration" value={result.analytics?.hydration_score ?? "N/A"} unit="%" icon="💧" />
          <AnalyticsCard title="Sleep Score" value={result.analytics?.sleep_score ?? "N/A"} unit="%" icon="😴" />
          <AnalyticsCard title="Calories" value={result.targets?.calories ?? "N/A"} unit="kcal" icon="🍽️" />
          <AnalyticsCard title="Protein" value={result.targets?.protein ?? "N/A"} unit="g" icon="🥚" />
          <AnalyticsCard title="Carbs" value={result.targets?.carbs ?? "N/A"} unit="g" icon="🍚" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] border border-green-500/15 bg-zinc-950/90 p-6 shadow-[0_0_50px_rgba(34,197,94,0.08)]">
          <MacroChart
            protein={result.targets?.protein ?? 0}
            carbs={result.targets?.carbs ?? 0}
            fats={result.targets?.fats ?? 0}
          />
        </div>

        <div className="rounded-[36px] border border-green-500/15 bg-zinc-950/90 p-6 shadow-[0_0_50px_rgba(34,197,94,0.08)]">
          <ProgressChart
            goal={goal}
            days={days}
            calories={targetCalories}
            expectedWeightChange={expectedWeightChange}
            consistencyScore={consistencyScore}
          />
        </div>
      </div>

      {lowHydration && (
        <section className="rounded-3xl border border-sky-400/20 bg-sky-950/30 p-6 shadow-xl">
          <h2 className="text-xl font-black text-sky-300">
            💧 Hydration Alert
          </h2>

          <p className="mt-2 text-sm leading-6 text-sky-100">
            Your logged water intake is below 1.5L. Increase water gradually
            throughout the day and consider electrolyte balance, especially if
            you have low BP, diabetes, pregnancy, or elderly-risk factors.
          </p>
        </section>
      )}

      {planAdjustedForSafety && (
        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-950/30 p-6 shadow-xl">
          <h2 className="text-xl font-black text-cyan-300">
            ✅ Plan Adjusted for Safety
          </h2>

          <p className="mt-2 text-sm leading-6 text-cyan-100">
            Your plan was reviewed through medical, diet, age, routine, and meal-quality
            safety checks before being shown.
          </p>

          {safetyTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {safetyTags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {safetyWarnings.length > 0 && (
            <div className="mt-4 text-sm text-cyan-100">
              <p className="font-bold">Goal / Safety Adjustments:</p>

              <ul className="mt-2 list-disc pl-5">
                {safetyWarnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {result?.medical_safety && (
        <section className="rounded-3xl border border-emerald-400/20 bg-emerald-950/30 p-6 shadow-xl">
          <h2 className="text-xl font-black text-emerald-300">
            🛡️ Medical Safety Shield
          </h2>

          <p className="mt-2 text-sm text-emerald-100">
            Safety Score: {result.medical_safety.safety_score}/100
          </p>

          {result.medical_safety.flags?.length > 0 && (
            <p className="mt-2 text-sm text-emerald-100">
              Flags: {dedupeStrings(result.medical_safety.flags).join(", ")}
            </p>
          )}

          {medicalWarnings.length > 0 && (
            <div className="mt-4 text-sm text-emerald-100">
              <p className="font-bold">Medical Safety Warnings:</p>

              <ul className="mt-2 list-disc pl-5">
                {medicalWarnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {replacementRecords.length > 0 && (
            <div className="mt-4 text-sm text-emerald-100">
              <p className="font-bold">Unsafe Foods Replaced:</p>

              <ul className="mt-2 list-disc pl-5">
                {replacementRecords.map((item: any, index: number) => (
                  <li key={index}>
                    {item.original_meal || item.replaced} →{" "}
                    {item.updated_meal || item.with}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {result?.elderly_safety?.warnings?.length > 0 && (
        <section className="rounded-3xl border border-amber-400/20 bg-amber-950/30 p-6 shadow-xl">
          <h2 className="text-xl font-black text-amber-300">
            👵 Elderly Safety Notes
          </h2>

          <ul className="mt-3 list-disc pl-5 text-sm text-amber-100">
            {result.elderly_safety.warnings.map(
              (warning: string, index: number) => (
                <li key={index}>{warning}</li>
              )
            )}
          </ul>
        </section>
      )}

      <section className="rounded-[40px] border border-green-500/15 bg-zinc-950/90 p-8 shadow-[0_0_60px_rgba(34,197,94,0.08)] lg:p-10">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Meal Planning
          </p>

          <h2 className="mt-3 text-4xl font-black lg:text-5xl">
            Multi-Day AI Meal Plan
          </h2>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Personalized meals optimized for your goals, activity level, and
            food preferences.
          </p>
        </div>

        <DayTabs days={safeMealDays} />
      </section>

      {result?.daily_routine && (
        <section className="rounded-[40px] border border-green-500/15 bg-zinc-950/90 p-8 shadow-[0_0_60px_rgba(34,197,94,0.08)] lg:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Daily Routine
          </p>

          <h2 className="mt-3 text-4xl font-black lg:text-5xl">
            AI Lifestyle Routine
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <RoutineCard title="Wake Up" value={result.daily_routine.wake_up} />
            <RoutineCard title="Hydration" value={result.daily_routine.morning_hydration} />
            <RoutineCard title="Breakfast" value={result.daily_routine.breakfast_time} />
            <RoutineCard title="Lunch" value={result.daily_routine.lunch_time} />
            <RoutineCard title="Workout" value={result.daily_routine.workout_time} />
            <RoutineCard title="Sleep Tip" value={result.daily_routine.sleep_tip} />
          </div>
        </section>
      )}

      <div className="rounded-[40px] border border-red-500/10 bg-zinc-950/90 p-8 shadow-[0_0_50px_rgba(239,68,68,0.05)]">
        <AvoidFoods foods={result?.avoid_foods ?? []} />
      </div>

      <section className="flex justify-center">
        <div className="w-full max-w-4xl rounded-[40px] border border-green-500/15 bg-zinc-950/90 p-8 text-center shadow-[0_0_60px_rgba(34,197,94,0.1)]">
          <div className="mb-6 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
              AI Nutrition Coach
            </p>

            <h2 className="mt-3 text-4xl font-black">
              LIVE AI Coaching Intelligence
            </h2>

            <p className="mt-4 text-zinc-400">
              Recommendations dynamically generated using your nutrition
              profile, body analytics, sleep routine, hydration, and meal goals.
            </p>
          </div>

          <AIInsight message={result?.ai_tip ?? result?.coach_message ?? ""} />
        </div>
      </section>
    </section>
  );
}

function RoutineCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-green-500/15 bg-black/40 p-6">
      <p className="text-sm font-bold uppercase tracking-wide text-green-300">
        {title}
      </p>

      <p className="mt-3 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function calculateWaterTarget(weight: number, activity: string, goal?: string) {
  let liters = weight * 0.035;

  if (activity === "high") liters += 0.5;
  if (activity === "low") liters -= 0.2;
  if (goal === "fat_loss") liters += 0.2;

  liters = Math.max(1.8, Math.min(3.8, liters));

  return `${liters.toFixed(1)} Liters Daily`;
}

function filterDietSafeAlternatives(alternatives: string[], diet: string) {
  const blockedForVegan = [
    "chicken",
    "fish",
    "egg",
    "paneer",
    "milk",
    "curd",
    "cheese",
    "butter",
    "ghee",
    "lassi",
    "yogurt",
    "meat",
    "mutton",
    "consomme",
    "vermicelli",
    "spice blend",
    "panch phoran",
  ];

  const safeVeganFallbacks = [
    "Tofu vegetable stir fry",
    "Chickpea salad bowl",
    "Quinoa pulao with vegetables",
    "Sprouts chaat",
    "Lentil soup with millet roti",
    "Hummus veggie wrap",
  ];

  if (diet !== "vegan") return alternatives;

  const filtered = alternatives.filter((item) => {
    const lower = item.toLowerCase();
    return !blockedForVegan.some((blocked) => lower.includes(blocked));
  });

  return filtered.length > 0 ? filtered : safeVeganFallbacks;
}

function sanitizeMealByDiet(meal: string, diet: string) {
  if (!meal) return "AI meal suggestion unavailable";

  const lower = meal.toLowerCase();

  const veganBlocked = [
    "chicken",
    "fish",
    "egg",
    "paneer",
    "milk",
    "curd",
    "cheese",
    "butter",
    "ghee",
    "lassi",
    "yogurt",
    "meat",
    "mutton",
  ];

  const vegetarianBlocked = ["chicken", "fish", "egg", "meat", "mutton"];

  const blocked =
    diet === "vegan"
      ? veganBlocked
      : diet === "vegetarian"
      ? vegetarianBlocked
      : [];

  const containsBlocked = blocked.some((item) => lower.includes(item));

  if (!containsBlocked) return meal;

  if (diet === "vegan") {
    return "Vegan Buddha Bowl with quinoa, chickpeas, greens, and tahini dressing";
  }

  if (diet === "vegetarian") {
    return "Paneer rice bowl with vegetables and lentils";
  }

  return meal;
}

function makeSnackUnique(snack: string, breakfast: string, diet: string) {
  if (!snack) return getFallbackSnack(diet);

  if (snack.trim().toLowerCase() === breakfast.trim().toLowerCase()) {
    return getFallbackSnack(diet);
  }

  return snack;
}

function getFallbackSnack(diet: string) {
  if (diet === "vegan") {
    return "Sprouts chaat with lemon and roasted peanuts";
  }

  if (diet === "vegetarian") {
    return "Greek yogurt with fruits and nuts";
  }

  return "Boiled eggs with fruit";
}

function generateWorkoutTip(goal: string, activity: string) {
  if (goal === "fat_loss") {
    if (activity === "low") {
      return "Start with 20–30 mins walking and light cardio daily";
    }

    return "Combine cardio with strength training for optimal fat loss";
  }

  if (goal === "muscle_gain") {
    if (activity === "high") {
      return "Focus on compound lifts, progressive overload, and proper recovery between sessions";
    }

    return "Focus on progressive overload and compound exercises";
  }

  return "Maintain consistency with moderate workouts and stretching";
}

function calculateBodyFatDisplay({
  bmi,
  age,
  gender,
}: {
  bmi: number;
  age: number;
  gender: string;
}) {
  if (!bmi || !age) return "N/A";

  const sexValue = gender === "male" ? 1 : 0;

  let bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexValue - 5.4;

  if (gender === "male") {
    bodyFat = Math.max(10, bodyFat);
  } else {
    bodyFat = Math.max(18, bodyFat);
  }

  return Number(bodyFat.toFixed(1));
}

function calculateExpectedWeightChange({
  goal,
  dailyCalorieGap,
  days,
}: {
  goal: string;
  dailyCalorieGap: number;
  days: number;
}) {
  if (!days || days <= 0) return "~0.0";

  let kgChange = 0;

  if (goal === "fat_loss") {
    kgChange = Math.abs((dailyCalorieGap * days) / 7700);

    if (kgChange < 0.05) {
      return "Small deficit phase";
    }

    return `-${kgChange.toFixed(1)}`;
  }

  if (goal === "muscle_gain") {
    const surplus = Math.max(150, Math.abs(dailyCalorieGap || 250));
    kgChange = (surplus * days) / 7700;

    if (kgChange < 0.05) {
      return "Small surplus phase";
    }

    return `+${kgChange.toFixed(1)}`;
  }

  kgChange = Math.abs((dailyCalorieGap * days) / 7700);

  if (kgChange < 0.05) {
    return "Maintenance phase";
  }

  return `${dailyCalorieGap > 0 ? "-" : "+"}${kgChange.toFixed(1)}`;
}

function calculateConsistencyScore({
  healthScore,
  hydrationScore,
  protein,
  calories,
}: {
  healthScore: number;
  hydrationScore: number;
  protein: number;
  calories: number;
}) {
  let score = 70;

  score += Math.min(15, Math.max(0, healthScore - 70) * 0.3);
  score += Math.min(10, Math.max(0, hydrationScore - 60) * 0.25);

  if (protein >= 80) score += 7;
  else if (protein >= 50) score += 4;

  if (calories >= 1200) score += 5;

  return Math.max(1, Math.min(99, Math.round(score)));
}

function dedupeStrings(items: any[]) {
  return Array.from(
    new Set(
      (items ?? [])
        .map((item) => String(item ?? "").trim())
        .filter(Boolean)
    )
  );
}

function dedupeReplacementRecords(items: any[]) {
  const seen = new Set<string>();

  return (items ?? []).filter((item) => {
    const original = String(item?.original_meal ?? item?.replaced ?? "").trim();
    const updated = String(item?.updated_meal ?? item?.with ?? "").trim();
    const mealType = String(item?.meal_type ?? "").trim();

    const key = `${mealType}|${original}|${updated}`;

    if (!original && !updated) return false;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function getSafetyTags({
  medicalText,
  pregnancyText,
  safetyWarnings,
  medicalWarnings,
}: {
  medicalText: string;
  pregnancyText: string;
  safetyWarnings: string[];
  medicalWarnings: string[];
}) {
  const combined = `${medicalText} ${pregnancyText} ${safetyWarnings.join(
    " "
  )} ${medicalWarnings.join(" ")}`.toLowerCase();

  const tags: string[] = [];

  if (
    combined.includes("diabetes") ||
    combined.includes("diabetic") ||
    combined.includes("glycemic")
  ) {
    tags.push("Diabetes Safe");
  }

  if (
    combined.includes("low bp") ||
    combined.includes("low blood pressure") ||
    combined.includes("hypotension")
  ) {
    tags.push("Low BP Aware");
  }

  if (combined.includes("kidney") || combined.includes("renal")) {
    tags.push("Kidney Safe");
  }

  if (
    combined.includes("pregnant") ||
    combined.includes("pregnancy") ||
    pregnancyText === "pregnant"
  ) {
    tags.push("Pregnancy Safe");
  }

  return Array.from(new Set(tags));
}

function FeaturesPanel() {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
          Features & Capabilities
        </p>

        <h2 className="mt-2 text-3xl font-black lg:text-5xl">
          Built for Intelligent Nutrition
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<CalendarClock />}
          title="Personalized Indian Meal Plans"
          description="Generate multi-week, flavor-packed Indian meal plans that meet your macros."
        />

        <FeatureCard
          icon={<BarChart3 />}
          title="Detailed Nutritional Analytics"
          description="Track BMI, BMR, TDEE, macros, hydration, sleep, and progress signals."
        />

        <FeatureCard
          icon={<Brain />}
          title="Smart AI Nutrition Coaching"
          description="Receive goal-aware coaching with safe fallback logic."
        />

        <FeatureCard
          icon={<Dumbbell />}
          title="Dynamic Metabolic Adaptation"
          description="Your plan adjusts based on weight, activity, goal, and duration."
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[30px] border border-green-500/15 bg-zinc-950/80 p-6 transition hover:border-green-400/40 hover:shadow-[0_0_45px_rgba(34,197,94,0.12)]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">
        {icon}
      </div>

      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-zinc-300">{description}</p>
    </div>
  );
}

function ScannerActionSection() {
  return (
    <section className="mt-12 grid gap-8 rounded-[36px] border border-green-500/15 bg-zinc-950/80 p-8 lg:grid-cols-2 lg:p-10">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
          THE POWER OF INSTANT ANALYSIS
        </p>

        <h2 className="mt-3 text-4xl font-black lg:text-6xl">
          Snap, and it&apos;s Tracked
        </h2>

        <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300">
          Upload your food image and get a quick estimated calorie, macro, and
          health summary.
        </p>

        <Link
          href="/scanner"
          className="mt-8 inline-flex rounded-2xl border-2 border-green-400 px-7 py-4 font-bold text-white transition hover:bg-green-400/10 hover:text-green-300"
        >
          Launch Scanner App →
        </Link>
      </div>

      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[32px] border border-green-500/15 bg-black/40">
        <div className="absolute h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative grid place-items-center gap-6 text-green-300">
          <div className="flex gap-5">
            <Camera className="h-16 w-16" />
            <ScanLine className="h-16 w-16" />
            <Sparkles className="h-16 w-16" />
          </div>

          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 px-6 py-4 text-center text-sm font-black text-white">
            CARBS 22g | PROTEIN 12g | FATS 8g | FIBER 5g
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsPanel() {
  return (
    <section className="mt-12 rounded-[36px] border border-green-500/15 bg-zinc-950/80 p-8 lg:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
        TESTIMONIALS & PROOF
      </p>

      <h2 className="mt-2 text-3xl font-black lg:text-5xl">
        Trusted by Users Across India
      </h2>

      <div className="mt-8 space-y-8">
        <Testimonial
          name="Rohan S."
          city="Mumbai"
          quote="This actually understands Rajma Chawal and creates practical Indian meal suggestions."
        />

        <div className="border-t border-green-500/15" />

        <Testimonial
          name="Priya K."
          city="Bengaluru"
          quote="The scanner and dashboard make nutrition tracking feel simple and visual."
        />
      </div>
    </section>
  );
}

function Testimonial({
  name,
  city,
  quote,
}: {
  name: string;
  city: string;
  quote: string;
}) {
  return (
    <div>
      <p className="font-bold text-white">
        {name} <span className="text-zinc-500">({city})</span>
      </p>

      <p className="mt-3 text-lg italic leading-8 text-zinc-300">“{quote}”</p>
    </div>
  );
}