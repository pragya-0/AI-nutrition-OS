"use client";

import Image from "next/image";
import {
  Activity,
  Check,
  ChevronDown,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Target,
  User,
  Utensils,
  Lightbulb,
  X,
} from "lucide-react";

const goals = ["Weight Loss", "Muscle Gain", "Maintain Weight", "Improve Health"];

const activities = [
  ["Sedentary", "Little or no exercise"],
  ["Lightly Active", "1–3 days per week"],
  ["Moderately Active", "3–5 days per week"],
  ["Very Active", "6–7 days per week"],
  ["Extra Active", "Very intense daily activity"],
];

const diets = [
  ["Omnivore", "Includes all foods"],
  ["Vegetarian", "No meat or fish"],
  ["Vegan", "No animal products"],
  ["Eggetarian", "Includes eggs"],
  ["Jain", "No onion, garlic, root veggies"],
];

const preferences = [
  ["Bengali Cuisine", true],
  ["North Indian", false],
  ["South Indian", false],
  ["Home-style Food", true],
  ["Eggetarian Options", true],
  ["No Preference", false],
];

const restrictions = [
  ["Diabetes", false],
  ["Thyroid", false],
  ["PCOS", false],
  ["High Blood Pressure", false],
  ["Lactose Intolerance", true],
  ["Gluten Intolerance", false],
  ["None", true],
];

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-[#9DFF16]/15 bg-[#06110A]/75 shadow-[0_0_28px_rgba(157,255,22,0.055)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs text-white/65">{label}</p>

      <div className="flex h-11 items-center justify-between rounded-xl border border-white/10 bg-[#07120B]/85 px-4 text-sm text-white">
        <span>{value}</span>

        <div className="flex items-center gap-2 text-white/55">
          {unit ? <span>{unit}</span> : null}
          {!unit ? <ChevronDown className="h-4 w-4" /> : null}
        </div>
      </div>
    </div>
  );
}

function SelectCard({
  title,
  sub,
  active = false,
}: {
  title: string;
  sub?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[52px] items-center justify-between rounded-xl border px-3.5 py-2.5 transition ${
        active
          ? "border-[#9DFF16]/60 bg-[#9DFF16] text-black shadow-[0_0_18px_rgba(157,255,22,0.22)]"
          : "border-white/10 bg-[#07120B]/85 text-white"
      }`}
    >
      <div>
        <p className="text-sm font-semibold leading-tight">{title}</p>

        {sub ? (
          <p
            className={`mt-0.5 text-[11px] leading-4 ${
              active ? "text-black/70" : "text-white/45"
            }`}
          >
            {sub}
          </p>
        ) : null}
      </div>

      {active ? (
        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-black/40">
          <Check className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </div>
  );
}

function CheckRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border ${
          checked
            ? "border-[#9DFF16] bg-[#9DFF16] text-black"
            : "border-white/15 bg-transparent"
        }`}
      >
        {checked ? <Check className="h-3 w-3 stroke-[4]" /> : null}
      </span>

      <span className="text-sm leading-none text-white/75">{label}</span>
    </div>
  );
}

function FloatingIcon({
  icon: Icon,
  label,
  className,
}: {
  icon: any;
  label: string;
  className: string;
}) {
  return (
    <div className={`absolute z-20 flex flex-col items-center gap-1.5 ${className}`}>
      <div className="grid h-11 w-11 place-items-center rounded-full border border-[#9DFF16]/40 bg-[#06110A]/70 shadow-[0_0_18px_rgba(157,255,22,0.14)] backdrop-blur-xl">
        <Icon className="h-5 w-5 text-[#9DFF16]" />
      </div>

      <p className="whitespace-nowrap text-[11px] font-medium text-white/72">
        {label}
      </p>
    </div>
  );
}

export default function AssessmentSection() {
  return (
    <section
      id="assessment-preview"
      className="relative overflow-hidden bg-[#030805] px-8 py-24 text-white lg:px-12 xl:px-20"
    >
      <div className="absolute left-[30%] top-[54%] h-[430px] w-[430px] rounded-full bg-[#9DFF16]/[0.05] blur-[130px]" />
      <div className="absolute right-[12%] top-[52%] h-[620px] w-[620px] rounded-full bg-[#9DFF16]/[0.045] blur-[160px]" />

      <div className="relative mx-auto grid max-w-[1360px] translate-x-24 items-start gap-12 xl:grid-cols-[280px_1020px] 2xl:translate-x-28">
        <div className="relative min-h-[650px] pt-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#9DFF16]/20 bg-[#07120B]/80 px-4 py-2 text-sm font-bold text-[#9DFF16]">
            <User className="h-4 w-4" />
            PERSONAL START
          </div>

          <h2 className="mt-6 max-w-[280px] text-[32px] font-black leading-[0.96] tracking-[-0.06em] text-white lg:text-[34px]">
            Let’s Build Your
            <br />
            <span className="text-[#9DFF16]">Perfect Nutrition Plan</span>
          </h2>

          <p className="mt-5 max-w-[250px] text-[15px] leading-7 text-white/68">
            Tell us about yourself, your lifestyle and preferences. Our AI will
            create a plan that’s 100% personalized for you.
          </p>

          <div className="relative mt-7 h-[355px]">
            <Image
              src="/assets/assessment/orbit.png"
              alt=""
              width={520}
              height={520}
              className="absolute left-[-34px] top-[22px] h-[360px] w-[420px] object-contain opacity-70"
            />

            <Image
              src="/assets/assessment/girl.png"
              alt="Fitness woman using phone"
              width={220}
              height={320}
              priority
              className="absolute bottom-[4px] left-[-15px] z-10 h-[175px] w-auto object-contain"
            />

            <FloatingIcon
              icon={Target}
              label="Your Goals"
              className="left-[-34px] top-[120px]"
            />

            <FloatingIcon
              icon={Activity}
              label="Your Activity"
              className="right-[8px] top-[58px]"
            />

            <FloatingIcon
              icon={Utensils}
              label="Your Preferences"
              className="right-[-26px] top-[186px]"
            />

            <FloatingIcon
              icon={User}
              label="Your Profile"
              className="left-[-34px] bottom-[74px]"
            />

          
          </div>

          <GlassCard className="mt-5 flex max-w-[280px] items-center gap-3 px-4 py-3.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#9DFF16]/10">
              <Image
                src="/assets/assessment/ai-brain-icon.png"
                alt=""
                width={42}
                height={42}
                className="object-contain"
              />
            </div>

            <p className="text-[14px] leading-6 text-white/85">
              Our AI analyzes{" "}
              <span className="font-black text-[#9DFF16]">50+ factors</span>
              <br />
              <span className="text-xs text-white/65">
                to craft the perfect plan.
              </span>
            </p>
          </GlassCard>
        </div>

        <GlassCard className="mt-12 px-10 py-9 xl:px-10 xl:py-9">
          <div className="mb-6 flex justify-end">
            <div className="flex items-center gap-3 text-sm text-white/75">
              <ShieldCheck className="h-5 w-5 text-[#9DFF16]" />
              100% Secure & Private
            </div>
          </div>

          <GlassCard className="grid gap-8 p-6 lg:grid-cols-[1fr_1.08fr]">
            <div>
              <h3 className="mb-5 flex items-center gap-2.5 text-[15px] font-bold">
                <User className="h-5 w-5 text-[#9DFF16]" />
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <Field label="Age" value="24" />
                <Field label="Gender" value="Female" />
                <Field label="Height" value="165" unit="cm" />
                <Field label="Weight" value="58" unit="kg" />
              </div>
            </div>

            <div className="border-white/10 lg:border-l lg:pl-7">
              <h3 className="mb-5 flex items-center gap-2.5 text-[15px] font-bold">
                <Target className="h-5 w-5 text-[#9DFF16]" />
                Your Goal
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {goals.map((goal, i) => (
                  <SelectCard key={goal} title={goal} active={i === 0} />
                ))}
              </div>
            </div>
          </GlassCard>

          <div className="mt-6 grid gap-6 lg:grid-cols-4">
            <GlassCard className="p-5">
              <h3 className="mb-4 flex items-center gap-2.5 text-[15px] font-bold">
                <Activity className="h-5 w-5 text-[#9DFF16]" />
                Activity Level
              </h3>

              <div className="space-y-2.5">
                {activities.map(([title, sub], i) => (
                  <SelectCard
                    key={title}
                    title={title}
                    sub={sub}
                    active={i === 2}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="mb-4 flex items-center gap-2.5 text-[15px] font-bold">
                <Leaf className="h-5 w-5 text-[#9DFF16]" />
                Diet Type
              </h3>

              <div className="space-y-2.5">
                {diets.map(([title, sub], i) => (
                  <SelectCard
                    key={title}
                    title={title}
                    sub={sub}
                    active={i === 0}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="mb-5 flex items-center gap-2.5 text-[15px] font-bold">
                <Utensils className="h-5 w-5 text-[#9DFF16]" />
                Food Preference
              </h3>

              <div className="space-y-4.5">
                {preferences.map(([label, checked]) => (
                  <CheckRow
                    key={label as string}
                    label={label as string}
                    checked={checked as boolean}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="mb-5 flex items-center gap-2.5 text-[15px] font-bold">
                <HeartPulse className="h-5 w-5 text-[#9DFF16]" />
                Medical & Restrictions
              </h3>

              <div className="space-y-4.5">
                {restrictions.map(([label, checked]) => (
                  <CheckRow
                    key={label as string}
                    label={label as string}
                    checked={checked as boolean}
                  />
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
            <GlassCard className="p-5">
              <h3 className="mb-3 text-[15px] font-semibold">
                Anything else we should know?
              </h3>

              <div className="rounded-xl border border-white/10 bg-[#07120B]/85 px-4 py-4 text-sm text-white/45">
                e.g. Allergies, medications, specific conditions...
              </div>

              <div className="mt-3 flex gap-2">
                {["Peanut Allergy", "No Red Meat"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65"
                  >
                    {tag}
                    <X className="h-3.5 w-3.5" />
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="flex min-h-[112px] items-center gap-4 p-5">
              <Lightbulb className="h-8 w-8 shrink-0 text-[#9DFF16]" />

              <div>
                <h3 className="text-[15px] font-bold text-[#9DFF16]">
                  Why we ask this?
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/65">
                  These details help our AI engine create a safe, effective and
                  sustainable plan for your unique body.
                </p>
              </div>
            </GlassCard>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}