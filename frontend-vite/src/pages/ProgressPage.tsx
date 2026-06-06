import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Droplets,
  Flame,
  Loader2,
  Moon,
  PlusCircle,
  Save,
  Scale,
  ShieldCheck,
  Utensils,
} from "lucide-react";

import AnalyticsHub from "@/components/dashboard/AnalyticsHub";
import { saveProgressLog } from "@/services/api";

type DailyLogForm = {
  weight: string;
  water_intake: string;
  sleep_hours: string;
  meal_followed: boolean;
  workout_done: boolean;
};

const initialForm: DailyLogForm = {
  weight: "",
  water_intake: "",
  sleep_hours: "",
  meal_followed: false,
  workout_done: false,
};
const PRIMARY = "#93C572";

const TEAL = "#18D3D0";
const WARNING = "#F5B942";

function PageHeader() {
  return (
    <section className="bg-[#030805] px-4 pt-5 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[28px] border border-[#18D3D0]/20 bg-[#061009]/95 px-5 py-6 shadow-[0_0_48px_rgba(24,211,208,0.06)] 2xl:max-w-[1780px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              to="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-[13px] font-black text-[#93C572] transition hover:text-[#A4D08A]"
            >
              <ArrowLeft size={17} />
              Back to Daily Dashboard
            </Link>

            <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.26em] text-[#18D3D0]">
              <BarChart3 size={15} />
              Progress Analytics
            </p>

            <h1 className="mt-3 text-[40px] font-black leading-[0.95] tracking-[-0.06em] text-[#F5F8F2] sm:text-[56px]">
              Expected vs actual,
              <br />
              <span className="text-[#18D3D0]">daily progress intelligence.</span>
            </h1>

            <p className="mt-4 max-w-[860px] text-[16px] font-semibold leading-7 text-[#A3B3A3]">
              Log weight, hydration, sleep, meals, and workouts. AI Nutrition OS compares real progress with the expected plan instead of showing fake-perfect analytics.
            </p>
          </div>

          <a
            href="#daily-log"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-[#18D3D0]/25 bg-[#18D3D0]/10 px-5 py-3 text-[13px] font-black text-[#18D3D0] transition hover:scale-[1.02]"
          >
            <PlusCircle size={17} />
            Add Daily Log
          </a>
        </div>
      </div>
    </section>
  );
}

function DailyLogPanel() {
  const [form, setForm] = useState<DailyLogForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const update = <K extends keyof DailyLogForm>(key: K, value: DailyLogForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSave =
    form.weight.trim() ||
    form.water_intake.trim() ||
    form.sleep_hours.trim() ||
    form.meal_followed ||
    form.workout_done;

  const handleSave = async () => {
    if (!canSave || saving) return;

    setSaving(true);
    setMessage("");

    try {
      await saveProgressLog({
        user_id: null,
        weight: form.weight ? Number(form.weight) : null,
        water_intake: form.water_intake ? Number(form.water_intake) : null,
        sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
        meal_followed: form.meal_followed,
        workout_done: form.workout_done,
      });

      setMessage("Daily log saved. Analytics refreshed with backend history.");
      setForm(initialForm);
      window.dispatchEvent(new Event("ai-plan-updated"));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error(error);
      setMessage("Could not save daily log. Check backend /progress/log and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="daily-log" className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[28px] border border-[#93C572]/18 bg-[#061009]/95 p-5 shadow-[0_0_48px_rgba(147,197,114,0.07)] 2xl:max-w-[1780px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.24em] text-[#93C572]">
              <ShieldCheck size={15} />
              Daily Check-In
            </p>
            <h2 className="mt-3 text-[30px] font-black tracking-[-0.05em] text-[#F5F8F2] sm:text-[40px]">
              Log what actually happened today.
            </h2>
            <p className="mt-3 max-w-[760px] text-[14px] font-semibold leading-6 text-[#A3B3A3]">
              Expected values come from the generated plan; actual values come from these daily logs.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-[#93C572] px-5 py-3 text-[13px] font-black text-[#07110A] shadow-[0_0_22px_rgba(147,197,114,0.12)] transition hover:scale-[1.02] hover:bg-[#A4D08A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
            Save Daily Log
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          <InputCard label="Weight" unit="kg" value={form.weight} onChange={(value) => update("weight", value)} icon={Scale} color={PRIMARY} placeholder="58" />
          <InputCard label="Water" unit="L" value={form.water_intake} onChange={(value) => update("water_intake", value)} icon={Droplets} color={TEAL} placeholder="2.5" />
          <InputCard label="Sleep" unit="hrs" value={form.sleep_hours} onChange={(value) => update("sleep_hours", value)} icon={Moon} color="#A875FF" placeholder="8" />
          <ToggleCard label="Plan Meals" active={form.meal_followed} onClick={() => update("meal_followed", !form.meal_followed)} icon={Utensils} activeText="Followed" inactiveText="Not marked" color={WARNING} />
          <ToggleCard label="Workout" active={form.workout_done} onClick={() => update("workout_done", !form.workout_done)} icon={Activity} activeText="Done" inactiveText="Not marked" color={PRIMARY} />
        </div>

        {message && (
          <p className="mt-5 rounded-[18px] border border-[#18D3D0]/25 bg-[#18D3D0]/8 px-4 py-3 text-[13px] font-bold text-[#18D3D0]">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

function InputCard({
  label,
  unit,
  value,
  onChange,
  icon: Icon,
  color,
  placeholder,
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ElementType;
  color: string;
  placeholder: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="flex items-end gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          min="0"
          step="0.1"
          placeholder={placeholder}
          className="w-full bg-transparent text-[30px] font-black leading-none text-[#F5F8F2] outline-none placeholder:text-white/20"
        />
        <span className="pb-1 text-[13px] font-black" style={{ color }}>{unit}</span>
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  active,
  onClick,
  icon: Icon,
  activeText,
  inactiveText,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  activeText: string;
  inactiveText: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[22px] border p-4 text-left transition ${
        active
          ? "border-[#93C572]/35 bg-[#93C572]/10"
          : "border-white/10 bg-white/[0.035] hover:border-white/20"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12px] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
        {active ? <CheckCircle2 size={20} className="text-[#93C572]" /> : <Icon size={20} style={{ color }} />}
      </div>
      <p className="text-[24px] font-black leading-none text-[#F5F8F2]">{active ? activeText : inactiveText}</p>
    </button>
  );
}

function ExpectedVsActualIntro() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[24px] border border-[#F5B942]/25 bg-[#2A1A05]/50 px-5 py-4 2xl:max-w-[1780px]">
        <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.22em] text-[#F5B942]">
          <Flame size={15} />
          Expected vs Actual Engine
        </p>
        <p className="mt-2 max-w-[1100px] text-[14px] font-semibold leading-6 text-white/68">
          This page now collects actual daily data. Analytics below compares available logs against plan targets.
        </p>
      </div>
    </section>
  );
}

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-[#F5F8F2]">
      <PageHeader />
      <DailyLogPanel />
      <ExpectedVsActualIntro />
      <AnalyticsHub />
    </main>
  );
}
