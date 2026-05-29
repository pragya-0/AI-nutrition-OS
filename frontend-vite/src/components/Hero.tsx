"use client";


import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  Droplets,
  Dumbbell,
  Goal,
  HeartPulse,
  Loader2,
  MapPin,
  Moon,
  Phone,
  Ruler,
  Scale,
  Sparkles,
  Sun,
  User,
  Utensils,
} from "lucide-react";

type HeroProps = {
  onGenerate: (formData: any) => void;
  loading?: boolean;
};

export default function Hero({ onGenerate, loading = false }: HeroProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    blood_group: "B+",

    weight: "",
    height: "",
    age: "",
    gender: "male",

    goal: "fat_loss",
    activity: "moderate",
    diet: "vegetarian",
    days: "1",

    sleep_time: "23:00",
    wake_time: "07:00",
    water_intake: "2.5",

    medical_conditions: "",
    pregnancy_status: "",
    preferred_cuisine: "indian",
    fitness_level: "beginner",

    city: "",
    email: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = () => {
    if (loading) return;

    if (!formData.weight || !formData.height || !formData.age) {
      alert("Please enter weight, height, and age.");
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.phone_number.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    const weight = Number(formData.weight);
    const height = Number(formData.height);
    const age = Number(formData.age);
    const heightInMeters = height / 100;
    const bmi =
      heightInMeters > 0 ? weight / (heightInMeters * heightInMeters) : 0;

    if (!weight || weight < 20 || weight > 250) {
      alert("Please enter a realistic weight between 20 kg and 250 kg.");
      return;
    }

    if (!height || height < 100 || height > 230) {
      alert("Please enter a realistic height between 100 cm and 230 cm.");
      return;
    }

    if (!age || age < 18 || age > 59) {
      alert(
        "AI Nutrition OS currently supports only users aged 18 to 59. Please consult a nearby doctor or qualified healthcare professional."
      );
      return;
    }

    if (bmi < 18.5 && formData.goal === "fat_loss") {
      alert(
        "Fat loss is not recommended for an underweight BMI. Please select Maintenance or Muscle Gain."
      );
      return;
    }

    const payload = {
      ...formData,
      weight,
      height,
      age,
      days: Number(formData.days),
      water_intake: Number(formData.water_intake),
      medical_conditions: formData.medical_conditions,
      pregnancy_status: formData.pregnancy_status,
    };

    console.log("FORM DATA SENT TO BACKEND:", payload);

    onGenerate(payload);
  };

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-green-500/10 bg-zinc-950/80 p-6 shadow-[0_0_80px_rgba(34,197,94,0.08)] backdrop-blur-2xl lg:p-10">
      <div className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-green-500/10 blur-3xl" />
      <div className="absolute bottom-[-140px] left-[-120px] h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400/10 text-green-300">
            <Sparkles size={28} />
          </div>

          <div>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white lg:text-7xl">
              AI Nutrition OS
            </h1>

            <p className="mt-1 text-green-300">
              adaptive health intelligence.
            </p>
          </div>
        </div>

        <p className="mb-8 max-w-3xl text-base leading-8 text-zinc-400 lg:text-lg">
          Personalized Indian AI meal planning, analytics, smart nutrition
          coaching, lifestyle scoring, and scanner intelligence in one premium
          health dashboard.
        </p>

        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Basic Information
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Name" icon={<User size={18} />}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Phone Number" icon={<Phone size={18} />}>
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone number"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Blood Group" icon={<HeartPulse size={18} />}>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </Field>

          <Field label="City" icon={<MapPin size={18} />}>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>
        </div>

        <div className="mb-5 mt-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Body Profile
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Weight" icon={<Scale size={18} />}>
            <input
              type="number"
              name="weight"
              placeholder="kg"
              value={formData.weight}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Height" icon={<Ruler size={18} />}>
            <input
              type="number"
              name="height"
              placeholder="cm"
              value={formData.height}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Age" icon={<User size={18} />}>
            <input
              type="number"
              name="age"
              placeholder="years"
              value={formData.age}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Gender" icon={<HeartPulse size={18} />}>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
        </div>

        <div className="mb-5 mt-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Lifestyle & Routine
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Sleep Time" icon={<Moon size={18} />}>
            <input
              type="time"
              name="sleep_time"
              value={formData.sleep_time}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Wake Up Time" icon={<Sun size={18} />}>
            <input
              type="time"
              name="wake_time"
              value={formData.wake_time}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Water Intake" icon={<Droplets size={18} />}>
            <input
              type="number"
              step="0.1"
              name="water_intake"
              placeholder="Liters"
              value={formData.water_intake}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Fitness Level" icon={<Dumbbell size={18} />}>
            <select
              name="fitness_level"
              value={formData.fitness_level}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
        </div>

        <div className="mb-5 mt-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Nutrition Goal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Goal" icon={<Goal size={18} />}>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="fat_loss">Fat Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </Field>

          <Field label="Activity" icon={<Activity size={18} />}>
            <select
              name="activity"
              value={formData.activity}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="low">Low Activity</option>
              <option value="moderate">Moderate Activity</option>
              <option value="high">High Activity</option>
            </select>
          </Field>

          <Field label="Diet" icon={<Utensils size={18} />}>
            <select
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </Field>

          <Field label="Preferred Cuisine" icon={<Utensils size={18} />}>
            <select
              name="preferred_cuisine"
              value={formData.preferred_cuisine}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="indian">Indian</option>
              <option value="bengali">Bengali</option>
              <option value="south_indian">South Indian</option>
              <option value="north_indian">North Indian</option>
              <option value="continental">Continental</option>
              <option value="mediterranean">Mediterranean</option>
            </select>
          </Field>

          <Field label="Duration" icon={<CalendarDays size={18} />}>
            <select
              name="days"
              value={formData.days}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
            </select>
          </Field>

          <Field label="Medical Conditions" icon={<HeartPulse size={18} />}>
            <input
              type="text"
              name="medical_conditions"
              placeholder="Diabetes, thyroid, BP..."
              value={formData.medical_conditions}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            />
          </Field>

          <Field label="Pregnancy Status" icon={<HeartPulse size={18} />}>
            <select
              name="pregnancy_status"
              value={formData.pregnancy_status}
              onChange={handleChange}
              disabled={loading}
              className="field-input"
            >
              <option value="">Not applicable / Prefer not to say</option>
              <option value="pregnant">Pregnant</option>
              <option value="planning_pregnancy">Planning pregnancy</option>
              <option value="postpartum">Postpartum</option>
            </select>
          </Field>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-green-400 px-8 py-4 text-base font-black text-black shadow-xl shadow-green-500/20 transition hover:scale-[1.02] hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? "Generating AI Plan..." : "Generate AI Nutrition Plan"}
          </button>

          <span className="text-sm text-zinc-500">Or</span>

          <a
            href="/scanner"
            className={`rounded-2xl border-2 border-green-400 px-8 py-4 text-center text-base font-bold text-white transition hover:bg-green-400/10 hover:text-green-300 ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Open Food Scanner 📸
          </a>
        </div>

        <p className="mt-5 text-sm text-zinc-500">
          Already have a meal? Scan it for instant calorie, macro, and health
          insight.
        </p>
      </motion.div>

      <style>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(63, 63, 70, 1);
          background: rgba(24, 24, 27, 0.78);
          padding: 0.95rem 1rem;
          color: white;
          outline: none;
          transition: 0.25s ease;
        }

        .field-input:focus {
          border-color: rgba(74, 222, 128, 0.7);
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
        }

        .field-input:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .field-input::placeholder {
          color: rgb(113, 113, 122);
        }

        .field-input option {
          background: #18181b;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-300">
        <span className="text-green-300">{icon}</span>
        {label}
      </div>

      {children}
    </label>
  );
}
