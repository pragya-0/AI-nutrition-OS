import {
  Activity,
  Check,
  ChevronDown,
  HeartPulse,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Target,
  User,
  Utensils,
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

      <div className="flex h-10 items-center justify-between rounded-xl border border-white/10 bg-[#07120B]/85 px-4 text-sm text-white">
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
      className={`flex min-h-[48px] items-center justify-between rounded-xl border px-3.5 py-2 transition ${
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
  icon: React.ElementType;
  label: string;
  className: string;
}) {
  return (
    <div className={`absolute z-20 flex flex-col items-center gap-1.5 ${className}`}>
      <div className="grid h-[58px] w-[58px] place-items-center rounded-full border border-[#9DFF16]/45 bg-[#06110A]/70 shadow-[0_0_20px_rgba(157,255,22,0.18)] backdrop-blur-xl">
        <Icon className="h-6 w-6 text-[#9DFF16]" />
      </div>

      <p className="whitespace-nowrap text-[13px] font-medium text-white/72">
        {label}
      </p>
    </div>
  );
}

export default function AssessmentSection() {
  return (
    <section
      id="assessment-preview"
      className="relative overflow-hidden bg-[#030805] px-8 py-8 text-white lg:px-10 xl:px-12"
    >
      <div className="absolute left-[18%] top-[54%] h-[520px] w-[520px] rounded-full bg-[#9DFF16]/[0.055] blur-[140px]" />
      <div className="absolute right-[8%] top-[52%] h-[640px] w-[640px] rounded-full bg-[#9DFF16]/[0.045] blur-[160px]" />

      <div className="relative mx-auto grid max-w-[1480px] items-start gap-8 xl:grid-cols-[500px_880px] 2xl:grid-cols-[540px_920px]">
        <div className="relative min-h-[640px] pt-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#9DFF16]/20 bg-[#07120B]/80 px-4 py-2 text-sm font-bold text-[#9DFF16]">
            <User className="h-4 w-4" />
            PERSONAL START
          </div>

          <h2 className="mt-7 max-w-[520px] text-[44px] font-black leading-[0.98] tracking-[-0.06em] text-white lg:text-[52px] 2xl:text-[56px]">
            Let’s Build Your
            <br />
            <span className="text-[#9DFF16]">Perfect Nutrition Plan</span>
          </h2>

          <p className="mt-6 max-w-[500px] text-[17px] leading-8 text-white/68">
            Tell us about yourself, your lifestyle and preferences. Our AI will
            create a plan that’s 100% personalized for you.
          </p>

          <div className="relative mt-0 h-[510px]">
            <img
              src="/assets/assessment/orbit.png"
              alt=""
              className="absolute left-[10px] top-[55px] h-[540px] w-[600px] object-contain opacity-75"
            />

            <img
              src="/assets/assessment/girl.png"
              alt="Fitness woman using phone"
              className="absolute bottom-[-50px] left-[60px] z-10 h-[660px] w-auto object-contain"
            />

            <FloatingIcon
              icon={Target}
              label="Your Goals"
              className="left-[25px] top-[205px]"
            />

            <FloatingIcon
              icon={Activity}
              label="Your Activity"
              className="right-[40px] top-[120px]"
            />

            <FloatingIcon
              icon={Utensils}
              label="Your Preferences"
              className="right-[-30px] top-[250px]"
            />

            <FloatingIcon
              icon={User}
              label="Your Profile"
              className="left-[-10px] bottom-[120px]"
            />

            <FloatingIcon
              icon={HeartPulse}
              label="Your Health"
              className="right-[30px] bottom-[60px]"
            />
          </div>

          <GlassCard className="relative z-30 mt-8 ml-0 flex max-w-[480px] items-center gap-4 px-6 py-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#9DFF16]/10">
              <img
                src="/assets/assessment/ai-brain-icon.png"
                alt=""
                className="h-[54px] w-[54px] object-contain"
              />
            </div>

            <p className="text-[17px] leading-7 text-white/85">
              Our AI analyzes{" "}
              <span className="font-black text-[#9DFF16]">50+ factors</span>
              <br />
              <span className="text-[15px] text-white/65">
                to craft the perfect plan for your body and lifestyle.
              </span>
            </p>
          </GlassCard>
        </div>

        <GlassCard className="mt-0 w-full max-w-[920px] px-7 py-7 xl:px-8 xl:py-7">
          <div className="mb-5 flex justify-end">
            <div className="flex shrink-0 items-center gap-3 text-sm text-white/75">
              <ShieldCheck className="h-5 w-5 text-[#9DFF16]" />
              100% Secure & Private
            </div>
          </div>

          <GlassCard className="grid gap-6 p-5 lg:grid-cols-[1fr_1.08fr]">
            <div>
              <h3 className="mb-4 flex items-center gap-2.5 text-[16px] font-bold">
                <User className="h-5 w-5 text-[#9DFF16]" />
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                <Field label="Age" value="24" />
                <Field label="Gender" value="Female" />
                <Field label="Height" value="165" unit="cm" />
                <Field label="Weight" value="58" unit="kg" />
              </div>
            </div>

            <div className="border-white/10 lg:border-l lg:pl-6">
              <h3 className="mb-4 flex items-center gap-2.5 text-[16px] font-bold">
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

          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            <GlassCard className="p-5">
              <h3 className="mb-4 flex items-center gap-2.5 text-[16px] font-bold">
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
              <h3 className="mb-4 flex items-center gap-2.5 text-[16px] font-bold">
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
              <h3 className="mb-5 flex items-center gap-2.5 text-[16px] font-bold">
                <Utensils className="h-5 w-5 text-[#9DFF16]" />
                Food Preference
              </h3>

              <div className="space-y-3">
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
              <h3 className="mb-5 flex items-center gap-2.5 text-[16px] font-bold">
                <HeartPulse className="h-5 w-5 text-[#9DFF16]" />
                Medical & Restrictions
              </h3>

              <div className="space-y-3">
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

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
            <GlassCard className="p-5">
              <h3 className="mb-3 text-[16px] font-semibold">
                Anything else we should know?
              </h3>

              <div className="rounded-xl border border-white/10 bg-[#07120B]/85 px-4 py-3.5 text-sm text-white/45">
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

            <GlassCard className="flex min-h-[104px] items-center gap-4 p-5">
              <Lightbulb className="h-8 w-8 shrink-0 text-[#9DFF16]" />

              <div>
                <h3 className="text-[16px] font-bold text-[#9DFF16]">
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