import { useMemo, useState } from "react";
import type { ElementType } from "react";
import {  useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  Droplets,
  Dumbbell,
  Flame,
  Heart,
  Leaf,
  Lock,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Utensils,
  Weight,
} from "lucide-react";

import { generatePlan, type GeneratePlanPayload } from "@/services/api";

type StepKey = "body" | "lifestyle" | "nutrition" | "goals" | "health";

type FormState = {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  city: string;
  activity: string;
  workType: string;
  sleepHours: string;
  stress: string;
  waterIntake: string;
  sleepTime: string;
  wakeTime: string;
  diet: string;
  foodPreference: string;
  allergies: string;
  mealsPerDay: string;
  preferredCuisine: string;
  dislikedFoods: string;
  goal: string;
  targetWeight: string;
  timeline: string;
  focusArea: string;
  fitnessLevel: string;
  workoutType: string;
  bloodGroup: string;
  medicalConditions: string;
  pregnancyStatus: string;
  smokerAlcohol: string;
};

type FieldConfig = {
  key: keyof FormState;
  label: string;
  suffix?: string;
  type?: "text" | "number" | "select";
  options?: string[];
  placeholder?: string;
};

type StepConfig = {
  key: StepKey;
  number: string;
  title: string;
  subtitle: string;
  icon: ElementType;
  color: string;
  fields: FieldConfig[];
};

type PreviewTarget = {
  label: string;
  value: string;
  sub: string;
  icon: ElementType;
  color: string;
};

const PRIMARY = "#93C572";
const TEAL = "#18D3D0";
const WARNING = "#F5B942";
const PURPLE = "#A875FF";
const BLUE = "#4BA3FF";

const defaultForm: FormState = {
  name: "Pragya",
  age: "28",
  gender: "Female",
  height: "165",
  weight: "62",
  city: "Kolkata",
  activity: "Moderate",
  workType: "Desk Job",
  sleepHours: "7",
  stress: "Medium",
  waterIntake: "2.3",
  sleepTime: "23:00",
  wakeTime: "07:00",
  diet: "Vegetarian",
  foodPreference: "Balanced",
  allergies: "None",
  mealsPerDay: "3 Meals",
  preferredCuisine: "Bengali",
  dislikedFoods: "None",
  goal: "Fat Loss",
  targetWeight: "55",
  timeline: "12",
  focusArea: "Overall Health",
  fitnessLevel: "Beginner",
  workoutType: "Gym",
  bloodGroup: "A+",
  medicalConditions: "none",
  pregnancyStatus: "not_applicable",
  smokerAlcohol: "none",
};

const steps: StepConfig[] = [
  {
    key: "body",
    number: "01",
    title: "Body Profile",
    subtitle: "Core body details used for BMI, BMR and calorie estimates.",
    icon: User,
    color: PRIMARY,
    fields: [
      
      { key: "age", label: "Age", type: "number" },
      { key: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other"] },
      { key: "height", label: "Height", type: "number", suffix: "cm" },
      { key: "weight", label: "Weight", type: "number", suffix: "kg" },
      { key: "city", label: "City", type: "text", placeholder: "Kolkata" },
    ],
  },
  {
    key: "lifestyle",
    number: "02",
    title: "Lifestyle",
    subtitle: "Daily routine, movement, sleep and hydration pattern.",
    icon: Activity,
    color: TEAL,
    fields: [
      { key: "activity", label: "Activity Level", type: "select", options: ["Sedentary", "Light", "Moderate", "Active", "Extra Active"] },
      { key: "workType", label: "Work Type", type: "select", options: ["Desk Job", "Mixed", "Field Work", "Student"] },
      { key: "sleepHours", label: "Sleep", type: "number", suffix: "hrs" },
      { key: "stress", label: "Stress Level", type: "select", options: ["Low", "Medium", "High"] },
      { key: "waterIntake", label: "Current Water", type: "number", suffix: "L" },
      { key: "sleepTime", label: "Sleep Time", type: "text", placeholder: "23:00" },
      { key: "wakeTime", label: "Wake Time", type: "text", placeholder: "07:00" },
    ],
  },
  {
    key: "nutrition",
    number: "03",
    title: "Nutrition",
    subtitle: "Diet type, cuisine, allergies and food preferences.",
    icon: Utensils,
    color: WARNING,
    fields: [
      { key: "diet", label: "Diet Type", type: "select", options: ["Omnivore", "Vegetarian", "Vegan", "Eggetarian", "Jain"] },
      { key: "foodPreference", label: "Food Preference", type: "select", options: ["Balanced", "Indian", "Bengali", "High Protein", "Simple Meals"] },
      { key: "preferredCuisine", label: "Preferred Cuisine", type: "select", options: ["Indian", "Bengali", "South Indian", "North Indian", "Mixed"] },
      { key: "allergies", label: "Allergies", type: "select", options: ["None", "Dairy", "Nuts", "Gluten", "Seafood"] },
      { key: "dislikedFoods", label: "Disliked Foods", type: "text", placeholder: "None" },
      { key: "mealsPerDay", label: "Meals / Day", type: "select", options: ["3 Meals", "4 Meals", "5 Meals"] },
    ],
  },
  {
    key: "goals",
    number: "04",
    title: "Goals",
    subtitle: "Target, timeline and fitness style for plan generation.",
    icon: Target,
    color: PURPLE,
    fields: [
      { key: "goal", label: "Primary Goal", type: "select", options: ["Fat Loss", "Muscle Gain", "Maintenance", "Improve Health"] },
      { key: "targetWeight", label: "Target Weight", type: "number", suffix: "kg" },
      { key: "timeline", label: "Target Timeline", type: "number", suffix: "weeks" },
      { key: "focusArea", label: "Focus Area", type: "select", options: ["Overall Health", "Protein", "Hydration", "Sleep", "Strength"] },
      { key: "fitnessLevel", label: "Fitness Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
      { key: "workoutType", label: "Workout Type", type: "select", options: ["Gym", "Home", "Walking", "Yoga", "Mixed"] },
    ],
  },
  {
    key: "health",
    number: "05",
    title: "Health & Safety",
    subtitle: "Used only for safety checks and wellness limitations.",
    icon: ShieldCheck,
    color: WARNING,
    fields: [
      { key: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Not Sure"] },
      { key: "medicalConditions", label: "Medical Conditions", type: "text", placeholder: "none" },
      { key: "pregnancyStatus", label: "Pregnancy Status", type: "select", options: ["not_applicable", "not_pregnant", "pregnant"] },
      { key: "smokerAlcohol", label: "Smoking / Alcohol", type: "select", options: ["none", "smoker", "alcohol", "both"] },
    ],
  },
];

function readStoredProfile(): Partial<FormState> {
  try {
    const raw = localStorage.getItem("ai_nutrition_user_profile");
    if (!raw) return {};
    const saved = JSON.parse(raw) as Partial<GeneratePlanPayload> & Record<string, unknown>;

    return {
      name: typeof saved.name === "string" ? saved.name : undefined,
      age: saved.age ? String(saved.age) : undefined,
      gender: typeof saved.gender === "string" ? toTitle(saved.gender) : undefined,
      height: saved.height ? String(saved.height) : undefined,
      weight: saved.weight ? String(saved.weight) : undefined,
      city: typeof saved.city === "string" ? saved.city : undefined,
      activity: typeof saved.activity === "string" ? toTitle(saved.activity) : undefined,
      diet: typeof saved.diet === "string" ? toTitle(saved.diet) : undefined,
      goal: typeof saved.goal === "string" ? goalLabel(saved.goal) : undefined,
      bloodGroup: typeof saved.blood_group === "string" ? saved.blood_group : undefined,
      medicalConditions:
        typeof saved.medical_conditions === "string"
          ? saved.medical_conditions
          : Array.isArray(saved.medical_conditions)
            ? saved.medical_conditions.join(", ")
            : undefined,
      pregnancyStatus:
        typeof saved.pregnancy_status === "string" ? saved.pregnancy_status : undefined,
      smokerAlcohol:
        typeof saved.smoker_alcohol === "string" ? saved.smoker_alcohol : undefined,
      preferredCuisine:
        typeof saved.preferred_cuisine === "string" ? toTitle(saved.preferred_cuisine) : undefined,
      fitnessLevel:
        typeof saved.fitness_level === "string" ? toTitle(saved.fitness_level) : undefined,
      workoutType:
        typeof saved.workout_type === "string" ? toTitle(saved.workout_type) : undefined,
      sleepHours: saved.sleep_hours ? String(saved.sleep_hours) : undefined,
      waterIntake: saved.water_intake ? String(saved.water_intake) : undefined,
      sleepTime: typeof saved.sleep_time === "string" ? saved.sleep_time : undefined,
      wakeTime: typeof saved.wake_time === "string" ? saved.wake_time : undefined,
    };
  } catch {
    return {};
  }
}

function toTitle(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function goalLabel(value: string) {
  const text = value.toLowerCase();
  if (text.includes("muscle")) return "Muscle Gain";
  if (text.includes("maintenance")) return "Maintenance";
  if (text.includes("health")) return "Improve Health";
  return "Fat Loss";
}

function toNumber(value: string, fallback: number) {
  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toBackendGoal(value: string) {
  const text = value.toLowerCase();
  if (text.includes("muscle")) return "muscle_gain";
  if (text.includes("maintain")) return "maintenance";
  if (text.includes("health")) return "improve_health";
  return "weight_loss";
}

function toBackendActivity(value: string) {
  const text = value.toLowerCase();
  if (text.includes("sedentary")) return "sedentary";
  if (text.includes("light")) return "light";
  if (text.includes("extra")) return "extra_active";
  if (text.includes("active")) return "active";
  return "moderate";
}

function toBackendDiet(value: string) {
  const text = value.toLowerCase();
  if (text.includes("vegan")) return "vegan";
  if (text.includes("vegetarian")) return "vegetarian";
  if (text.includes("egg")) return "eggetarian";
  if (text.includes("jain")) return "jain";
  return "omnivore";
}

function normalizeCuisine(value: string) {
  const text = value.toLowerCase();
  if (text.includes("bengali")) return "bengali";
  if (text.includes("south")) return "south_indian";
  if (text.includes("north")) return "north_indian";
  return "indian";
}

function estimateTargets(form: FormState) {
  const weight = toNumber(form.weight, 62);
  const height = toNumber(form.height, 165);
  const age = toNumber(form.age, 28);
  const gender = form.gender.toLowerCase();
  const bmrBase = 10 * weight + 6.25 * height - 5 * age;
  const bmr = Math.round(gender.includes("male") ? bmrBase + 5 : bmrBase - 161);
  const activityFactor =
    form.activity === "Sedentary"
      ? 1.2
      : form.activity === "Light"
        ? 1.375
        : form.activity === "Active"
          ? 1.725
          : form.activity === "Extra Active"
            ? 1.9
            : 1.55;

  const tdee = Math.round(bmr * activityFactor);
  const calories =
    form.goal === "Fat Loss"
      ? Math.max(Math.round(tdee - 350), 1200)
      : form.goal === "Muscle Gain"
        ? Math.round(tdee + 250)
        : tdee;
  const protein = Math.round(weight * (form.goal === "Muscle Gain" ? 1.8 : 1.5));
  const water = Math.max(2, Math.round(weight * 0.04 * 10) / 10);
  const currentWeight = toNumber(form.weight, 62);
  const targetWeight = toNumber(form.targetWeight, currentWeight);
  const timeline = toNumber(form.timeline, 12);
  const expectedChange = Math.round(((targetWeight - currentWeight) / timeline) * 10) / 10;

  return {
    bmr,
    tdee,
    calories,
    protein,
    water,
    expectedChange,
  };
}

function isComplete(value: string) {
  return String(value || "").trim().length > 0;
}

function stepCompletion(form: FormState, step: StepConfig) {
  const done = step.fields.filter((field) => isComplete(form[field.key])).length;
  return Math.round((done / step.fields.length) * 100);
}

function completionFor(form: FormState) {
  const required = steps.flatMap((step) => step.fields.map((field) => field.key));
  const uniqueRequired = Array.from(new Set(required));
  const done = uniqueRequired.filter((key) => isComplete(form[key])).length;
  return Math.round((done / uniqueRequired.length) * 100);
}

function hasMedicalRisk(form: FormState) {
  const text = `${form.medicalConditions} ${form.pregnancyStatus} ${form.smokerAlcohol}`.toLowerCase();
  const safe = ["none", "no", "nil", "n/a", "not_applicable", "not applicable", ""];

  const medicalSafe = safe.includes(form.medicalConditions.toLowerCase().trim());
  const habitsSafe = safe.includes(form.smokerAlcohol.toLowerCase().trim());
  const pregnancySafe = safe.includes(form.pregnancyStatus.toLowerCase().trim()) || form.pregnancyStatus === "not_pregnant";

  if (medicalSafe && habitsSafe && pregnancySafe) return false;

  return [
    "pregnant",
    "pregnancy",
    "diabetes",
    "kidney",
    "heart",
    "cancer",
    "thyroid",
    "pcos",
    "addiction",
    "alcoholic",
    "renal",
    "liver",
  ].some((term) => text.includes(term));
}

export default function AIProfileIntelligence() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(() => ({
    ...defaultForm,
    ...readStoredProfile(),
  }));
  const [activeStep, setActiveStep] = useState<StepKey>("body");
  const [selectedDays, setSelectedDays] = useState<1 | 7 | 15 | 30>(7);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const targets = useMemo(() => estimateTargets(form), [form]);
  const completion = useMemo(() => completionFor(form), [form]);
  const medicalRisk = useMemo(() => hasMedicalRisk(form), [form]);

  const previewTargets: PreviewTarget[] = [
    {
      label: "Estimated Calories",
      value: `${targets.calories.toLocaleString()} kcal/day`,
      sub: form.goal === "Fat Loss" ? "For gradual fat loss" : "Based on your goal",
      icon: Flame,
      color: PRIMARY,
    },
    {
      label: "Protein Target",
      value: `${targets.protein}g/day`,
      sub: "Based on body weight",
      icon: Dumbbell,
      color: TEAL,
    },
    {
      label: "Hydration Target",
      value: `${targets.water}L/day`,
      sub: "Optimal daily intake",
      icon: Droplets,
      color: BLUE,
    },
    {
      label: "Expected Change",
      value: `${targets.expectedChange > 0 ? "+" : ""}${targets.expectedChange} kg/week`,
      sub: "Healthy & sustainable",
      icon: Weight,
      color: PURPLE,
    },
  ];

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveProfile = () => {
    const payload = buildPayload(form, selectedDays, targets.water);
    localStorage.setItem("ai_nutrition_user_profile", JSON.stringify(payload));
    setMessage("Profile saved locally. You can generate your plan when ready.");
  };

  const generate = async () => {
    if (isGenerating) return;

    if (!consentAccepted) {
      setMessage("Please accept the wellness-only consent before generating your plan.");
      return;
    }

    if (medicalRisk) {
      setMessage(
        "Medical-risk details detected. AI Nutrition OS cannot generate a plan for this profile. Please consult a qualified healthcare professional.",
      );
      return;
    }

    setIsGenerating(true);
    setMessage("");

    try {
      const payload = buildPayload(form, selectedDays, targets.water);
      localStorage.setItem("ai_nutrition_user_profile", JSON.stringify(payload));

      const result = await generatePlan(payload);

      if (result?.blocked || result?.success === false) {
        localStorage.setItem("ai_nutrition_blocked_response", JSON.stringify(result));
        localStorage.removeItem("ai_nutrition_generated_plan");
        setMessage(
          result?.message ||
            result?.medical_risk?.block_reason ||
            "Plan generation was blocked for safety reasons.",
        );
        return;
      }

      localStorage.removeItem("ai_nutrition_blocked_response");
      localStorage.setItem("ai_nutrition_generated_plan", JSON.stringify(result));
      window.dispatchEvent(new Event("ai-plan-updated"));
      setMessage("Plan generated successfully. Opening your dashboard...");

      window.setTimeout(() => navigate("/dashboard"), 700);
    } catch (error) {
      console.error(error);
      setMessage("Unable to generate plan. Please check the backend and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030805] px-3 py-4 pb-24 text-[#F5F8F2] sm:px-5 lg:px-6 xl:px-8 md:pb-6">
      <BackgroundFX />

      <div className="relative z-10 mx-auto w-full max-w-[1780px] overflow-hidden rounded-[30px] border border-[#93C572]/18 bg-[#030805]/96 shadow-[0_0_90px_rgba(147,197,114,0.08)]">
        <StepTimeline
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          completion={completion}
          form={form}
        />

        <div className="grid gap-5 px-4 py-5 sm:px-6 lg:px-8 xl:grid-cols-[0.98fr_0.92fr_0.62fr] xl:px-10">
          <div className="space-y-5 xl:self-start">
            <HeroCopy />
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <ProfileSectionCard
                  key={step.key}
                  step={step}
                  active={activeStep === step.key}
                  form={form}
                  onFocus={() => setActiveStep(step.key)}
                  onNext={() =>
                    setActiveStep(steps[Math.min(index + 1, steps.length - 1)].key)
                  }
                  isLast={index === steps.length - 1}
                  onChange={update}
                />
              ))}
            </div>

            <SupportRow onSave={saveProfile} />
          </div>

          <HumanMeshStage />

          <AIInsightPanel
            completion={completion}
            targets={previewTargets}
            medicalRisk={medicalRisk}
          />

          <NextStepsStrip />
          <GeneratePanel
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            consentAccepted={consentAccepted}
            onConsentChange={setConsentAccepted}
            onGenerate={generate}
            isGenerating={isGenerating}
            message={message}
            medicalRisk={medicalRisk}
          />
        </div>
      </div>
    </section>
  );
}

function buildPayload(
  form: FormState,
  selectedDays: 1 | 7 | 15 | 30,
  estimatedWater: number,
): GeneratePlanPayload {
  return {
    age: toNumber(form.age, 24),
    gender: form.gender.toLowerCase(),
    height: toNumber(form.height, 165),
    weight: toNumber(form.weight, 58),
    goal: toBackendGoal(form.goal),
    activity: toBackendActivity(form.activity),
    diet: toBackendDiet(form.diet),
    days: selectedDays,

    name: form.name,
    city: form.city,
    blood_group: form.bloodGroup,
    preferred_cuisine: normalizeCuisine(form.preferredCuisine || form.foodPreference),
    fitness_level: form.fitnessLevel.toLowerCase(),
    allergies: form.allergies.toLowerCase() === "none" ? [] : [form.allergies],
    disliked_foods:
      form.dislikedFoods.toLowerCase() === "none"
        ? []
        : form.dislikedFoods.split(",").map((item) => item.trim()).filter(Boolean),
    medical_conditions: form.medicalConditions || "none",
    pregnancy_status:
      form.gender.toLowerCase() === "male" ? "not_applicable" : form.pregnancyStatus,
    budget: "medium",
    workout_type: form.workoutType.toLowerCase(),
    sleep_time: form.sleepTime || "23:00",
    wake_time: form.wakeTime || "07:00",
    sleep_hours: toNumber(form.sleepHours, 7),
    water_intake: toNumber(form.waterIntake, estimatedWater),
    smoker_alcohol: form.smokerAlcohol || "none",
  };
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(147,197,114,0.13),transparent_30%),radial-gradient(circle_at_78%_38%,rgba(24,211,208,0.08),transparent_30%),radial-gradient(circle_at_18%_82%,rgba(147,197,114,0.06),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(147,197,114,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,114,.16)_1px,transparent_1px)] [background-size:84px_84px]" />
    </>
  );
}

function StepTimeline({
  activeStep,
  setActiveStep,
  completion,
  form,
}: {
  activeStep: StepKey;
  setActiveStep: (step: StepKey) => void;
  completion: number;
  form: FormState;
}) {
  const timeline = [
    { key: "body" as const, label: "Body Profile", icon: User },
    { key: "lifestyle" as const, label: "Lifestyle", icon: Activity },
    { key: "nutrition" as const, label: "Nutrition", icon: Utensils },
    { key: "goals" as const, label: "Goals", icon: Target },
    { key: "health" as const, label: "Health", icon: ShieldCheck },
    { key: "ready" as const, label: "AI Ready", icon: Check },
  ];

  return (
    <div className="border-b border-white/10 bg-black/12 px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start lg:gap-3">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            const ready = item.key === "ready";
            const step = ready ? null : steps.find((entry) => entry.key === item.key);
            const complete = ready ? completion >= 95 : step ? stepCompletion(form, step) === 100 : false;
            const active = item.key === activeStep || (ready && completion >= 95);

            return (
              <div key={item.key} className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={ready}
                  onClick={() => !ready && setActiveStep(item.key)}
                  className={`grid h-10 w-10 place-items-center rounded-full border text-[14px] font-black transition ${
                    active
                      ? "border-[#93C572] bg-[#93C572] text-[#07110A] shadow-[0_0_26px_rgba(147,197,114,0.32)]"
                      : complete
                        ? "border-[#93C572]/45 bg-[#93C572]/12 text-[#93C572]"
                        : "border-white/20 bg-white/[0.03] text-white/55 hover:border-[#93C572]/40"
                  }`}
                >
                  {complete || ready ? <Icon size={19} /> : index + 1}
                </button>

                <button
                  type="button"
                  disabled={ready}
                  onClick={() => !ready && setActiveStep(item.key)}
                  className={`hidden text-left text-[13px] font-black md:block ${
                    active ? "text-white" : "text-white/58 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>

                {index < timeline.length - 1 ? (
                  <span className="hidden h-px w-6 border-t border-dashed border-white/22 2xl:block" />
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-2.5 sm:min-w-[190px]">
          <div className="flex items-center gap-3">
            <ProgressRing value={completion} size={50} stroke={6} color={PRIMARY} />
            <div>
              <p className="text-[15px] font-black text-white">{completion}% Profile Completion</p>
              <p className="text-[12px] font-semibold text-white/58">
                {completion >= 95 ? "Ready for AI generation." : "Complete each section to improve your preview."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroCopy() {
  return (
    <div>
      <p className="inline-flex rounded-full border border-[#18D3D0]/20 bg-[#18D3D0]/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#18D3D0]">
        AI Nutrition Onboarding
      </p>

      <h1 className="mt-5 max-w-[760px] text-[38px] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[52px] xl:text-[42px] 2xl:text-[54px]">
        Let’s build your AI-powered health profile
      </h1>

      <p className="mt-4 max-w-[700px] text-[16px] font-semibold leading-7 text-white/66">
        Your information helps our AI generate a personalized nutrition plan
        that actually works for your body, goals, routine and safety needs.
      </p>
    </div>
  );
}

function ProfileSectionCard({
  step,
  active,
  form,
  onFocus,
  onNext,
  isLast,
  onChange,
}: {
  step: StepConfig;
  active: boolean;
  form: FormState;
  onFocus: () => void;
  onNext: () => void;
  isLast: boolean;
  onChange: (key: keyof FormState, value: string) => void;
}) {
  const Icon = step.icon;
  const completion = stepCompletion(form, step);
  const complete = completion === 100;
  const previewValues = step.fields
    .slice(0, active ? 0 : 3)
    .map((field) => `${field.label}: ${form[field.key] || "—"}`);

  return (
    <div
      id={`onboarding-${step.key}`}
      className={`rounded-[24px] border bg-[#061009]/78 transition ${
        active
          ? "border-[#93C572]/72 p-5 shadow-[0_0_34px_rgba(147,197,114,0.12)]"
          : "border-white/10 p-4 hover:border-[#93C572]/35"
      }`}
    >
      <button
        type="button"
        onClick={onFocus}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={`grid shrink-0 place-items-center rounded-full border transition ${
              active ? "h-14 w-14" : "h-12 w-12"
            }`}
            style={{
              color: step.color,
              borderColor: `${step.color}80`,
              background: `${step.color}14`,
            }}
          >
            <Icon size={active ? 27 : 23} />
          </div>

          <div>
            <p className="text-[18px] font-black text-white sm:text-[20px]">
              <span style={{ color: step.color }}>{step.number}</span>{" "}
              {step.title}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-white/56">
              {step.subtitle}
            </p>

            {!active && previewValues.length ? (
              <p className="mt-2 line-clamp-1 text-[12px] font-semibold text-white/38">
                {previewValues.join("  •  ")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-black sm:inline-flex ${
              complete
                ? "border-[#93C572]/20 bg-[#93C572]/8 text-[#93C572]"
                : "border-white/10 bg-white/[0.035] text-white/55"
            }`}
          >
            <CheckCircle2 size={15} />
            {complete ? "Complete" : `${completion}%`}
          </span>

          <ChevronDown
            size={20}
            className={`text-white/72 transition ${active ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {active ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {step.fields.map((field) => (
              <ProfileField
                key={field.key}
                field={field}
                value={form[field.key]}
                onChange={(value) => onChange(field.key, value)}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-semibold leading-5 text-white/48">
              Fill this section, then continue. You can return to any step from
              the progress bar above.
            </p>

            {!isLast ? (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex h-11 min-w-[132px] items-center justify-center gap-2 rounded-xl bg-[#93C572] px-5 text-[13px] font-black text-[#07110A] transition hover:bg-[#A4D08A]"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <a
                href="#generate-plan"
                className="inline-flex h-11 min-w-[132px] items-center justify-center gap-2 rounded-xl bg-[#93C572] px-5 text-[13px] font-black text-[#07110A] transition hover:bg-[#A4D08A]"
              >
                Generate Plan
                <Sparkles size={16} />
              </a>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ProfileField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  const isSelect = field.type === "select";

  return (
    <label className="group relative min-h-[74px] rounded-[18px] border border-white/10 bg-black/18 px-4 py-3 transition focus-within:border-[#93C572]/45 focus-within:bg-[#93C572]/5">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/42">
        {field.label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {isSelect ? (
          <>
            <select
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="h-8 w-full appearance-none bg-transparent pr-8 text-[15px] font-black text-white outline-none"
            >
              {(field.options || []).map((option) => (
                <option key={option} value={option} className="bg-[#061009] text-white">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={17}
              className="pointer-events-none absolute bottom-4 right-4 text-white/65"
            />
          </>
        ) : (
          <input
            type={field.type || "text"}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="h-8 w-full bg-transparent text-[15px] font-black text-white outline-none placeholder:text-white/25"
          />
        )}

        {field.suffix ? (
          <span className="pb-1 text-[12px] font-bold text-white/44">{field.suffix}</span>
        ) : null}
      </div>
    </label>
  );
}

function SupportRow({ onSave }: { onSave: () => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_0.55fr]">
      <div className="rounded-[20px] border border-[#18D3D0]/18 bg-[#18D3D0]/6 px-4 py-3">
        <p className="flex items-center gap-2 text-[15px] font-black text-white">
          <ShieldCheck size={24} className="text-[#18D3D0]" />
          Why we ask these questions?
        </p>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-white/58">
          Your inputs help our AI analyze metabolism, lifestyle, preferences
          and safety before generating a plan.
        </p>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="inline-flex h-14 items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.035] px-4 text-[15px] font-black text-white/82 transition hover:border-[#93C572]/35"
      >
        <Save size={20} />
        Save Profile
      </button>
    </div>
  );
}

function HumanMeshStage() {
  const floating = [
    {
      label: "Hydration",
      text: "Analyzing...",
      icon: Droplets,
      color: BLUE,
      className: "left-6 top-16",
    },
    {
      label: "Calories",
      text: "Calculating...",
      icon: Flame,
      color: WARNING,
      className: "right-6 top-20",
    },
    {
      label: "Metabolism",
      text: "Analyzing...",
      icon: Leaf,
      color: PRIMARY,
      className: "left-8 bottom-20",
    },
    {
      label: "Muscle Mass",
      text: "Analyzing...",
      icon: Dumbbell,
      color: PURPLE,
      className: "right-8 bottom-20",
    },
  ];

  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-[30px] border border-[#93C572]/14 bg-[#061009]/52 shadow-[inset_0_0_80px_rgba(147,197,114,0.045)] lg:min-h-[690px] xl:min-h-[760px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(147,197,114,0.24),transparent_45%),radial-gradient(circle_at_50%_78%,rgba(24,211,208,0.12),transparent_32%)]" />

      <img
        src="/assets/radial-glow.png"
        alt=""
        className="absolute left-1/2 top-[43%] w-[760px] -translate-x-1/2 -translate-y-1/2 opacity-26 mix-blend-screen"
      />

   
<img
  src="/assets/scanner-health-human.png"
  alt="AI metabolic body scan"
  className="absolute left-1/2 top-[43%] z-10 h-[1250px] w-auto -translate-x-1/2 -translate-y-1/2 scale-[2.5] object-contain opacity-100 drop-shadow-[0_0_85px_rgba(147,197,114,0.42)]"
/>
      <div className="absolute bottom-10 left-1/2 h-9 w-[270px] -translate-x-1/2 rounded-[50%] border border-[#18D3D0]/44 shadow-[0_0_34px_rgba(24,211,208,0.28)]" />

      {floating.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={`absolute z-20 hidden rounded-[20px] border bg-[#061009]/82 p-4 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-xl xl:block ${item.className}`}
            style={{ borderColor: `${item.color}45` }}
          >
            <Icon size={34} style={{ color: item.color }} />
            <p className="mt-3 text-[14px] font-black text-white">{item.label}</p>
            <p className="mt-1 text-[12px] font-semibold text-white/62">{item.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function AIInsightPanel({
  completion,
  targets,
  medicalRisk,
}: {
  completion: number;
  targets: PreviewTarget[];
  medicalRisk: boolean;
}) {
  return (
    <aside className="flex flex-col gap-3 xl:self-start">
      <div className="rounded-[24px] border border-white/10 bg-[#061009]/78 p-4 shadow-[0_0_32px_rgba(147,197,114,0.055)]">
        <p className="flex items-center gap-3 text-[19px] font-black text-white">
          <Brain size={24} className="text-[#93C572]" />
          AI Preview
        </p>
        <p className="mt-1 text-[13px] font-semibold text-white/58">
          Based on your current inputs
        </p>

        <div className="mt-3 grid gap-2">
          {targets.map((target) => (
            <PreviewMetric key={target.label} target={target} />
          ))}
        </div>
      </div>

      <ProfileIntelligenceMiniCard />

      <div className="rounded-[22px] border border-[#93C572]/24 bg-[#93C572]/7 px-4 py-3">
        <p className="text-[15px] font-black text-white">
          AI is analyzing your profile...
        </p>

        <p className="mt-2 text-[13px] font-semibold leading-6 text-white/60">
          Our AI engine is processing your data to create a personalized nutrition plan.
        </p>

        <div className="mt-3 h-2.5 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#93C572] shadow-[0_0_22px_rgba(147,197,114,0.32)]"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="mt-2 text-right text-[13px] font-black text-[#93C572]">
          {completion}%
        </p>

        {medicalRisk ? (
          <p className="mt-3 rounded-2xl border border-[#F5B942]/25 bg-[#2A1A05]/45 px-4 py-3 text-[12px] font-semibold leading-5 text-[#F5B942]">
            Safety review required before plan generation.
          </p>
        ) : null}
      </div>

      <div className="rounded-[20px] border border-white/10 bg-white/[0.035] px-4 py-3">
        <p className="flex items-center gap-2 text-[14px] font-black text-white">
          <Lock size={17} className="text-[#F5B942]" />
          Your data is private and secure
        </p>
        <p className="mt-2 text-[12px] font-semibold leading-5 text-white/54">
          We never share your personal information.
        </p>
      </div>

      <AIRecommendationsMiniCard medicalRisk={medicalRisk} />
    </aside>
  );
}

function ProfileIntelligenceMiniCard() {
  const rows = [
    ["Metabolism", "Analyzing"],
    ["Meal Pattern", "3 meals/day"],
    ["Safety Status", "Clear"],
    ["Plan Duration", "7 days"],
  ];

  return (
    <div className="rounded-[20px] border border-[#18D3D0]/18 bg-[#18D3D0]/6 px-4 py-3">
      <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.14em] text-[#18D3D0]">
        <Brain size={16} />
        Profile Intelligence
      </p>

      <div className="mt-3 grid gap-2 text-[12px] font-semibold text-white/64">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className="text-right font-black text-[#93C572]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIRecommendationsMiniCard({ medicalRisk }: { medicalRisk: boolean }) {
  const recommendations = medicalRisk
    ? ["Safety review needed", "Use wellness guidance only", "Consult a professional"]
    : ["High-protein plan focus", "Hydration target active", "Sleep goal: 7+ hours", "Fat-loss pacing optimized"];

  return (
    <div className="rounded-[20px] border border-[#93C572]/18 bg-[#93C572]/6 px-4 py-3">
      <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.14em] text-[#93C572]">
        <Sparkles size={16} />
        AI Recommendations
      </p>

      <div className="mt-3 grid gap-2">
        {recommendations.map((item) => (
          <div key={item} className="flex items-center gap-2 text-[12px] font-semibold text-white/62">
            <CheckCircle2 size={14} className="shrink-0 text-[#93C572]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewMetric({ target }: { target: PreviewTarget }) {
  const Icon = target.icon;

  return (
    <div className="flex min-h-[78px] items-center gap-3 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
      <Icon size={30} style={{ color: target.color }} />
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-white/68">{target.label}</p>
        <p className="mt-1 text-[19px] font-black leading-none text-white 2xl:text-[22px]">
          {target.value}
        </p>
        <p className="mt-1 text-[12px] font-semibold text-white/45">
          {target.sub}
        </p>
      </div>
    </div>
  );
}

function NextStepsStrip() {
  const items = [
    { title: "AI Analysis", text: "We analyze your data using advanced AI algorithms.", icon: Brain },
    { title: "Personalized Plan", text: "Get your custom nutrition and lifestyle plan.", icon: ShieldCheck },
    { title: "Daily Guidance", text: "Receive daily tips, meal suggestions and AI coaching.", icon: Heart },
    { title: "Track & Improve", text: "Track progress and optimize results over time.", icon: Activity },
  ];

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#061009]/70 px-5 py-6 xl:col-span-3">
      <div className="grid items-center gap-5 lg:grid-cols-[0.35fr_1fr_1fr_1fr_1fr_0.78fr]">
        <p className="text-[20px] font-black leading-tight text-[#93C572]">
          What
          <br />
          happens
          <br />
          next?
        </p>

        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#93C572]/18 bg-[#93C572]/8 text-[#93C572]">
                <Icon size={23} />
              </div>

              <div>
                <p className="text-[15px] font-black text-white">{item.title}</p>
                <p className="mt-1 text-[12px] font-semibold leading-5 text-white/55">
                  {item.text}
                </p>
              </div>

              {index < items.length - 1 ? (
                <ArrowRight size={22} className="hidden text-[#93C572] xl:block" />
              ) : null}
            </div>
          );
        })}

        <div className="hidden items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] p-4 xl:flex">
          <img
            src="/assets/food-insight-hologram.png"
            alt=""
            className="h-24 w-24 object-contain"
          />
          <p className="text-[12px] font-semibold leading-5 text-white/65">
            Your future self will thank you today!
          </p>
        </div>
      </div>
    </div>
  );
}

function GeneratePanel({
  selectedDays,
  onDaysChange,
  consentAccepted,
  onConsentChange,
  onGenerate,
  isGenerating,
  message,
  medicalRisk,
}: {
  selectedDays: 1 | 7 | 15 | 30;
  onDaysChange: (days: 1 | 7 | 15 | 30) => void;
  consentAccepted: boolean;
  onConsentChange: (value: boolean) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  message: string;
  medicalRisk: boolean;
}) {
  return (
    <div id="generate-plan" className="rounded-[24px] border border-white/12 bg-black/22 px-5 py-5 xl:col-span-3">
      <div className="grid gap-4 lg:grid-cols-[0.78fr_0.64fr_0.7fr] lg:items-center">
        <div>
          <p className="text-[30px] font-black tracking-[-0.05em] text-white">
            Your profile is ready.
          </p>
          <p className="mt-2 text-[17px] font-semibold text-white/62">
            Generate your personalized AI nutrition plan.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 7, 15, 30].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => onDaysChange(days as 1 | 7 | 15 | 30)}
              className={`rounded-2xl border px-3 py-3 text-[13px] font-black transition ${
                selectedDays === days
                  ? "border-[#93C572] bg-[#93C572] text-[#07110A]"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-[#93C572]/40"
              }`}
            >
              {days}D
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || medicalRisk}
          className="inline-flex h-16 w-full max-w-[380px] items-center justify-center gap-3 justify-self-end rounded-2xl bg-[#93C572] px-6 text-[18px] font-black text-[#07110A] shadow-[0_0_40px_rgba(147,197,114,0.28)] transition hover:bg-[#A4D08A] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isGenerating ? "Generating..." : "Generate My Plan"}
          <Sparkles size={20} />
        </button>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[12px] font-semibold leading-5 text-white/64">
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(event) => onConsentChange(event.target.checked)}
          className="mt-1 accent-[#93C572]"
        />
        <span>
          I understand AI Nutrition OS provides general wellness guidance only
          and does not provide medical advice, diagnosis, treatment, emergency
          care, or disease management.
        </span>
      </label>

      {message ? (
        <p
          className={`mt-4 rounded-2xl border px-4 py-3 text-[13px] font-bold ${
            message.toLowerCase().includes("success") || message.toLowerCase().includes("saved")
              ? "border-[#93C572]/25 bg-[#93C572]/8 text-[#93C572]"
              : "border-[#F5B942]/25 bg-[#2A1A05]/50 text-[#F5B942]"
          }`}
        >
          {message}
        </p>
      ) : null}

      <p className="mt-3 flex items-center justify-center gap-2 text-[12px] font-semibold text-white/50">
        <Lock size={14} />
        100% Secure • Private • Only for you
      </p>
    </div>
  );
}

function ProgressRing({
  value,
  size,
  stroke,
  color,
}: {
  value: number;
  size: number;
  stroke: number;
  color: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <span className="absolute text-[14px] font-black text-white">{safeValue}%</span>
    </div>
  );
}
