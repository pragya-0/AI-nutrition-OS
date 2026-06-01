import { useMemo, useState } from "react";
import {
  Activity,
  CircleHelp,
  Clock3,
  Droplets,
  Dumbbell,
  Edit3,
  HeartPulse,
  Leaf,
  MapPin,
  Moon,
  Save,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Utensils,
  Venus,
  Weight,
  X,
} from "lucide-react";

type CardKey = "body" | "lifestyle" | "nutrition" | "health";

type ProfileData = {
  user: { name: string; isNewUser: boolean };
  body: {
    height: string;
    weight: string;
    age: string;
    gender: string;
    updatedAt: string;
  };
  lifestyle: {
    sleepTime: string;
    wakeTime: string;
    waterIntake: string;
    fitnessLevel: string;
    updatedAt: string;
  };
  nutrition: {
    primaryGoal: string;
    dietPreference: string;
    preferredCuisine: string;
    activityLevel: string;
    updatedAt: string;
  };
  health: {
    medicalConditions: string;
    bloodGroup: string;
    pregnancyStatus: string;
    smokerAlcohol: string;
    updatedAt: string;
  };
  missing: { city: string; medical: string; bloodGroup: string };
};

const today = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const initialProfileData: ProfileData = {
  user: { name: "Isha", isNewUser: false },
  body: {
    height: "170 cm",
    weight: "70 kg",
    age: "25 years",
    gender: "Female",
    updatedAt: today(),
  },
  lifestyle: {
    sleepTime: "11:00 PM",
    wakeTime: "07:00 AM",
    waterIntake: "2.5 L / day",
    fitnessLevel: "Beginner",
    updatedAt: today(),
  },
  nutrition: {
    primaryGoal: "Fat Loss",
    dietPreference: "Vegetarian",
    preferredCuisine: "Indian",
    activityLevel: "Moderate",
    updatedAt: today(),
  },
  health: {
    medicalConditions: "None",
    bloodGroup: "B+",
    pregnancyStatus: "Not Applicable",
    smokerAlcohol: "No / Rarely",
    updatedAt: today(),
  },
  missing: { city: "", medical: "", bloodGroup: "" },
};

export default function AIProfileIntelligence() {
  const [profile, setProfile] = useState(initialProfileData);
  const [editingCard, setEditingCard] = useState<CardKey | null>(null);
  const [draft, setDraft] = useState(initialProfileData);

  const missingCount = useMemo(
    () => Object.values(profile.missing).filter((value) => !value.trim()).length,
    [profile.missing],
  );

  const completed = 17 - missingCount;
  const total = 17;
  const completion = Math.round((completed / total) * 100);

  const handleEdit = (card: CardKey) => {
    setDraft(profile);
    setEditingCard(card);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditingCard(null);
  };

  const handleSave = () => {
    if (!editingCard) return;

    setProfile({
      ...draft,
      [editingCard]: {
        ...draft[editingCard],
        updatedAt: today(),
      },
    });

    setEditingCard(null);
  };

  const updateDraft = (section: CardKey, field: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateMissing = (field: keyof ProfileData["missing"], value: string) => {
    setProfile((prev) => ({
      ...prev,
      missing: {
        ...prev.missing,
        [field]: value,
      },
    }));
  };

  const handleGeneratePlan = () => {
    console.log("Generate plan with profile:", profile);
  };

  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#030805] px-4 py-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="relative mx-auto w-full max-w-[92vw] overflow-visible rounded-[30px] border border-[#173326] bg-[#020604]/95 shadow-[0_0_80px_rgba(166,255,77,0.08)] 2xl:max-w-[1780px]">
        <BackgroundFX />

        <div className="relative z-10 p-4 sm:p-5 lg:p-6 xl:p-7">
          <div className="rounded-[28px] border border-white/10 bg-[#020805]/70 p-4 sm:p-5 lg:p-6 xl:p-7">
            <Header />

            <TopProfilePanel
              completion={completion}
              completed={completed}
              total={total}
              profile={profile}
              missingCount={missingCount}
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ProfileCard
                title="Body Profile"
                color="#A6FF4D"
                icon={<User size={22} />}
                editing={editingCard === "body"}
                onEdit={() => handleEdit("body")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.body.updatedAt}
                rows={[
                  {
                    label: "Height",
                    value: profile.body.height,
                    icon: <Activity size={17} />,
                    field: "height",
                  },
                  {
                    label: "Weight",
                    value: profile.body.weight,
                    icon: <Weight size={17} />,
                    field: "weight",
                  },
                  {
                    label: "Age",
                    value: profile.body.age,
                    icon: <User size={17} />,
                    field: "age",
                  },
                  {
                    label: "Gender",
                    value: profile.body.gender,
                    icon: <Venus size={17} />,
                    field: "gender",
                  },
                ]}
                draftRows={draft.body}
                onChange={(field, value) => updateDraft("body", field, value)}
              />

              <ProfileCard
                title="Lifestyle"
                color="#18D3D0"
                icon={<Sparkles size={22} />}
                editing={editingCard === "lifestyle"}
                onEdit={() => handleEdit("lifestyle")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.lifestyle.updatedAt}
                rows={[
                  {
                    label: "Sleep Time",
                    value: profile.lifestyle.sleepTime,
                    icon: <Moon size={17} />,
                    field: "sleepTime",
                  },
                  {
                    label: "Wake Up Time",
                    value: profile.lifestyle.wakeTime,
                    icon: <Sparkles size={17} />,
                    field: "wakeTime",
                  },
                  {
                    label: "Water Intake",
                    value: profile.lifestyle.waterIntake,
                    icon: <Droplets size={17} />,
                    field: "waterIntake",
                  },
                  {
                    label: "Fitness Level",
                    value: profile.lifestyle.fitnessLevel,
                    icon: <Dumbbell size={17} />,
                    field: "fitnessLevel",
                  },
                ]}
                draftRows={draft.lifestyle}
                onChange={(field, value) =>
                  updateDraft("lifestyle", field, value)
                }
              />

              <ProfileCard
                title="Nutrition"
                color="#A875FF"
                icon={<Utensils size={22} />}
                editing={editingCard === "nutrition"}
                onEdit={() => handleEdit("nutrition")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.nutrition.updatedAt}
                rows={[
                  {
                    label: "Primary Goal",
                    value: profile.nutrition.primaryGoal,
                    icon: <Target size={17} />,
                    field: "primaryGoal",
                  },
                  {
                    label: "Diet Preference",
                    value: profile.nutrition.dietPreference,
                    icon: <Utensils size={17} />,
                    field: "dietPreference",
                  },
                  {
                    label: "Preferred Cuisine",
                    value: profile.nutrition.preferredCuisine,
                    icon: <Leaf size={17} />,
                    field: "preferredCuisine",
                  },
                  {
                    label: "Activity Level",
                    value: profile.nutrition.activityLevel,
                    icon: <Activity size={17} />,
                    field: "activityLevel",
                  },
                ]}
                draftRows={draft.nutrition}
                onChange={(field, value) =>
                  updateDraft("nutrition", field, value)
                }
              />

              <ProfileCard
                title="Health"
                color="#FFB347"
                icon={<ShieldCheck size={22} />}
                editing={editingCard === "health"}
                onEdit={() => handleEdit("health")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.health.updatedAt}
                rows={[
                  {
                    label: "Medical Conditions",
                    value: profile.health.medicalConditions,
                    icon: <ShieldCheck size={17} />,
                    field: "medicalConditions",
                  },
                  {
                    label: "Blood Group",
                    value: profile.health.bloodGroup,
                    icon: <Droplets size={17} />,
                    field: "bloodGroup",
                  },
                  {
                    label: "Pregnancy Status",
                    value: profile.health.pregnancyStatus,
                    icon: <HeartPulse size={17} />,
                    field: "pregnancyStatus",
                  },
                  {
                    label: "Smoker / Alcohol",
                    value: profile.health.smokerAlcohol,
                    icon: <Activity size={17} />,
                    field: "smokerAlcohol",
                  },
                ]}
                draftRows={draft.health}
                onChange={(field, value) => updateDraft("health", field, value)}
              />
            </div>

            <MissingDetails
              missingCount={missingCount}
              missing={profile.missing}
              onChange={updateMissing}
            />

            <FinalCTA
              onGenerate={handleGeneratePlan}
              isNewUser={profile.user.isNewUser}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        
        <div>
          <h2 className="text-[28px] font-black uppercase leading-none tracking-[0.08em] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
            AI Profile Inputs
          </h2>
          <p className="mt-2 text-[14px] font-semibold leading-6 text-[#A3B3A3] xl:text-[15px]">
            Your profile helps AI create a plan that adapts perfectly to you.
          </p>
        </div>
      </div>

      <button className="inline-flex w-fit items-center gap-2.5 rounded-2xl border border-[#18D3D0]/25 bg-[#18D3D0]/5 px-4 py-3 text-[13px] font-black text-[#A6FF4D]">
        <CircleHelp size={17} />
        Profile Guide
      </button>
    </div>
  );
}

function TopProfilePanel({
  completion,
  completed,
  total,
  profile,
  missingCount,
}: {
  completion: number;
  completed: number;
  total: number;
  profile: ProfileData;
  missingCount: number;
}) {
  return (
    <div className="grid overflow-hidden rounded-[26px] border border-white/10 bg-[#07110A]/70 lg:grid-cols-[0.9fr_1.15fr] xl:grid-cols-[0.9fr_1.2fr_0.45fr]">
      <div className="flex items-center gap-5 border-b border-white/10 p-5 lg:border-b-0 lg:border-r xl:p-6">
        <CircleProgress value={completion} />

        <div className="min-w-0">
          <h3 className="text-[22px] font-black xl:text-[26px]">
            Profile Completion
          </h3>

          <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-white/70 xl:text-[15px]">
            {missingCount > 0
              ? "Great job! Just a few more details to unlock 100% personalized insights."
              : "Your profile is complete. AI has enough context to personalize your plan."}
          </p>

          <div className="mt-4 h-2.5 w-full max-w-[360px] rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#A6FF4D] shadow-[0_0_18px_rgba(166,255,77,.6)]"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="mt-3 text-[13px] font-semibold text-white/60">
            {total - completed} of {total} items pending
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-5 p-5 xl:p-6">
        <Sparkles
          size={44}
          className="shrink-0 text-[#A6FF4D] drop-shadow-[0_0_24px_rgba(166,255,77,.55)]"
        />

        <div className="relative z-10 min-w-0">
          <p className="text-[14px] font-black uppercase tracking-[0.22em] text-[#A6FF4D] xl:text-[15px]">
            AI Profile Summary
          </p>

          <p className="mt-2 text-[14px] font-medium leading-6 text-white/65">
            AI has analyzed your data and created this summary.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <SummaryChip label={`Goal: ${profile.nutrition.primaryGoal}`} />
            <SummaryChip label={`Diet: ${profile.nutrition.dietPreference}`} />
            <SummaryChip label="Workout: Evening" />
            <SummaryChip
              label={`Activity: ${profile.nutrition.activityLevel}`}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-[14px] font-black text-[#18D3D0]">
              AI Confidence: {completion + 12 > 100 ? 100 : completion + 12}%
            </span>

            <div className="h-2 w-[180px] rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#18D3D0] shadow-[0_0_16px_rgba(24,211,208,.6)]"
                style={{
                  width: `${completion + 12 > 100 ? 100 : completion + 12}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden items-center justify-center xl:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(24,211,208,.16),transparent_62%)]" />

        <img
          src="/assets/meshbody.png"
          alt=""
          className="relative z-10 h-[210px] object-contain opacity-90 mix-blend-screen drop-shadow-[0_0_36px_rgba(24,211,208,.9)]"
        />

        <div className="absolute bottom-7 h-5 w-32 rounded-full border border-[#18D3D0]/50 shadow-[0_0_24px_rgba(24,211,208,.4)]" />
      </div>
    </div>
  );
}

function CircleProgress({ value }: { value: number }) {
  const angle = Math.max(0, Math.min(value, 100)) * 3.6;

  return (
    <div
      className="grid h-[116px] w-[116px] shrink-0 place-items-center rounded-full shadow-[0_0_30px_rgba(166,255,77,.35)]"
      style={{
        background: `conic-gradient(#A6FF4D ${angle}deg, rgba(255,255,255,.13) 0deg)`,
      }}
    >
      <div className="grid h-[88px] w-[88px] place-items-center rounded-full bg-[#07110A]">
        <div className="text-center">
          <p className="text-[28px] font-black leading-none">{value}%</p>
          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.13em] text-[#A6FF4D]">
            Complete
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] font-bold text-white/85">
      <Sparkles size={12} className="text-[#18D3D0]" />
      {label}
    </span>
  );
}

type RowData = {
  label: string;
  value: string;
  icon: React.ReactNode;
  field: string;
};

function ProfileCard({
  title,
  icon,
  rows,
  draftRows,
  updatedAt,
  color,
  editing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  rows: RowData[];
  draftRows: Record<string, string>;
  updatedAt: string;
  color: string;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div
      className="rounded-[24px] border bg-[#07110A]/65 p-4 shadow-[inset_0_0_35px_rgba(255,255,255,.025)] xl:p-5"
      style={{ borderColor: `${color}55` }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span style={{ color }}>{icon}</span>
          <h3
            className="truncate text-[15px] font-black uppercase tracking-[0.08em] xl:text-[16px]"
            style={{ color }}
          >
            {title}
          </h3>
        </div>

        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="rounded-xl border border-[#A6FF4D]/50 p-2 text-[#A6FF4D]"
            >
              <Save size={16} />
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/15 p-2 text-white/70"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-black"
            style={{ borderColor: `${color}70`, color }}
          >
            <Edit3 size={13} />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 text-[13px] font-medium text-white/68">
              <span style={{ color }}>{row.icon}</span>
              {row.label}
            </div>

            {editing ? (
              <input
                value={draftRows[row.field] || ""}
                onChange={(e) => onChange(row.field, e.target.value)}
                className="w-[110px] rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-right text-[12px] font-black text-white outline-none focus:border-[#A6FF4D]/60"
              />
            ) : (
              <p className="text-right text-[13px] font-black text-white">
                {row.value}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-3">
        <p className="flex items-center gap-2 text-[11px] font-medium text-white/45">
          <Clock3 size={12} />
          Last updated: {updatedAt}
        </p>
      </div>
    </div>
  );
}

function MissingDetails({
  missingCount,
  missing,
  onChange,
}: {
  missingCount: number;
  missing: ProfileData["missing"];
  onChange: (field: keyof ProfileData["missing"], value: string) => void;
}) {
  return (
    <div className="mt-5 grid items-center gap-4 rounded-[26px] border border-white/10 bg-[#07110A]/70 p-5 xl:grid-cols-[0.7fr_1.25fr_0.3fr]">
      <div>
        <p className="text-[18px] font-black uppercase tracking-[0.14em] text-[#A6FF4D] xl:text-[20px]">
          {missingCount > 0
            ? `AI Needs ${missingCount} More Details`
            : "Profile Complete"}
        </p>

        <p className="mt-3 text-[14px] leading-6 text-white/65">
          These details will help AI fine tune your nutrition & lifestyle plan.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MissingInput
          label="What’s your city?"
          value={missing.city}
          placeholder="Select your city"
          color="#18D3D0"
          onChange={(value) => onChange("city", value)}
        />

        <MissingInput
          label="Any medical conditions?"
          value={missing.medical}
          placeholder="Type or select"
          color="#A875FF"
          onChange={(value) => onChange("medical", value)}
        />

        <MissingInput
          label="What’s your blood group?"
          value={missing.bloodGroup}
          placeholder="Select blood group"
          color="#6C7BFF"
          onChange={(value) => onChange("bloodGroup", value)}
        />
      </div>

      <div className="relative hidden h-24 xl:block">
        <div className="absolute inset-0 rotate-[-18deg] rounded-full border border-[#18D3D0]/25" />
        <div className="absolute inset-3 rotate-[28deg] rounded-full border border-[#A6FF4D]/20" />
        <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#18D3D0] shadow-[0_0_25px_rgba(24,211,208,.9)]" />
      </div>
    </div>
  );
}

function MissingInput({
  label,
  value,
  placeholder,
  color,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  color: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-black text-white">
        <MapPin size={15} style={{ color }} />
        {label}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#020604]/65 px-3 py-2.5 text-[12px] font-bold text-white outline-none placeholder:text-white/45 focus:border-[#18D3D0]/60"
      />
    </label>
  );
}

function FinalCTA({
  onGenerate,
  isNewUser,
}: {
  onGenerate: () => void;
  isNewUser: boolean;
}) {
  return (
    <div className="mt-5 grid items-center gap-4 rounded-[26px] border border-[#A6FF4D]/30 bg-[#07110A]/80 p-5 xl:grid-cols-[0.14fr_0.9fr_1.1fr]">
      <div className="grid h-20 w-20 place-items-center rounded-full border border-[#A6FF4D]/25 bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_32px_rgba(166,255,77,.24)]">
        <Target size={42} />
      </div>

      <div>
        <h3 className="text-[24px] font-black tracking-[-0.04em] xl:text-[28px]">
          Ready to generate your AI Nutrition Plan?
        </h3>

        <p className="mt-2 text-[14px] font-medium leading-6 text-white/65">
          AI has enough information to build a personalized, science-backed plan
          for you.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
        <button
          onClick={onGenerate}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#A6FF4D] px-5 py-3.5 text-black shadow-[0_0_34px_rgba(166,255,77,.3)]"
        >
          <span className="text-[14px] font-black">
            {isNewUser ? "Generate First Plan" : "Generate AI Nutrition Plan"}
          </span>

          <Sparkles size={17} />

          <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-[16px] text-[#A6FF4D]">
            →
          </span>
        </button>

        <a
          href="/scanner"
          className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3.5 text-[14px] font-black text-white"
        >
          <ScanLine size={18} />
          Open Food Scanner
        </a>
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_25%_45%,rgba(24,211,208,0.08),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}