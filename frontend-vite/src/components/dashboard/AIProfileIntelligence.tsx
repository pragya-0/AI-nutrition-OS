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
  user: {
    name: string;
    isNewUser: boolean;
  };
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
  missing: {
    city: string;
    medical: string;
    bloodGroup: string;
  };
};

const today = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const initialProfileData: ProfileData = {
  user: {
    name: "Isha",
    isNewUser: false,
  },
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
  missing: {
    city: "",
    medical: "",
    bloodGroup: "",
  },
};

export default function AIProfileIntelligence() {
  const [profile, setProfile] = useState(initialProfileData);
  const [editingCard, setEditingCard] = useState<CardKey | null>(null);
  const [draft, setDraft] = useState(initialProfileData);

  const missingCount = useMemo(() => {
    return Object.values(profile.missing).filter((value) => !value.trim())
      .length;
  }, [profile.missing]);

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
    <section className="relative overflow-hidden bg-[#030805] px-0 py-3 text-[#F5F8F2]">
      <div className="relative mx-auto w-[98vw] overflow-hidden rounded-[34px] border border-[#173326] bg-[#020604]/95 shadow-[0_0_80px_rgba(166,255,77,0.08)]">
        <BackgroundFX />

        <div className="relative z-10 px-6 py-10 xl:px-8 2xl:px-10">
          <div className="rounded-[34px] border border-white/10 bg-[#020805]/70 p-10">
            <Header />

            <TopProfilePanel
              completion={completion}
              completed={completed}
              total={total}
              profile={profile}
              missingCount={missingCount}
            />

            <div className="mt-8 grid gap-7 xl:grid-cols-4">
              <ProfileCard
                title="Body Profile"
                color="#A6FF4D"
                icon={<User size={46} />}
                editing={editingCard === "body"}
                onEdit={() => handleEdit("body")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.body.updatedAt}
                rows={[
                  {
                    label: "Height",
                    value: profile.body.height,
                    icon: <Activity size={30} />,
                    field: "height",
                  },
                  {
                    label: "Weight",
                    value: profile.body.weight,
                    icon: <Weight size={30} />,
                    field: "weight",
                  },
                  {
                    label: "Age",
                    value: profile.body.age,
                    icon: <User size={30} />,
                    field: "age",
                  },
                  {
                    label: "Gender",
                    value: profile.body.gender,
                    icon: <Venus size={30} />,
                    field: "gender",
                  },
                ]}
                draftRows={draft.body}
                onChange={(field, value) => updateDraft("body", field, value)}
              />

              <ProfileCard
                title="Lifestyle"
                color="#18D3D0"
                icon={<Sparkles size={46} />}
                editing={editingCard === "lifestyle"}
                onEdit={() => handleEdit("lifestyle")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.lifestyle.updatedAt}
                rows={[
                  {
                    label: "Sleep Time",
                    value: profile.lifestyle.sleepTime,
                    icon: <Moon size={30} />,
                    field: "sleepTime",
                  },
                  {
                    label: "Wake Up Time",
                    value: profile.lifestyle.wakeTime,
                    icon: <Sparkles size={30} />,
                    field: "wakeTime",
                  },
                  {
                    label: "Water Intake",
                    value: profile.lifestyle.waterIntake,
                    icon: <Droplets size={30} />,
                    field: "waterIntake",
                  },
                  {
                    label: "Fitness Level",
                    value: profile.lifestyle.fitnessLevel,
                    icon: <Dumbbell size={30} />,
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
                icon={<Utensils size={46} />}
                editing={editingCard === "nutrition"}
                onEdit={() => handleEdit("nutrition")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.nutrition.updatedAt}
                rows={[
                  {
                    label: "Primary Goal",
                    value: profile.nutrition.primaryGoal,
                    icon: <Target size={30} />,
                    field: "primaryGoal",
                  },
                  {
                    label: "Diet Preference",
                    value: profile.nutrition.dietPreference,
                    icon: <Utensils size={30} />,
                    field: "dietPreference",
                  },
                  {
                    label: "Preferred Cuisine",
                    value: profile.nutrition.preferredCuisine,
                    icon: <Leaf size={30} />,
                    field: "preferredCuisine",
                  },
                  {
                    label: "Activity Level",
                    value: profile.nutrition.activityLevel,
                    icon: <Activity size={30} />,
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
                icon={<ShieldCheck size={46} />}
                editing={editingCard === "health"}
                onEdit={() => handleEdit("health")}
                onSave={handleSave}
                onCancel={handleCancel}
                updatedAt={profile.health.updatedAt}
                rows={[
                  {
                    label: "Medical Conditions",
                    value: profile.health.medicalConditions,
                    icon: <ShieldCheck size={30} />,
                    field: "medicalConditions",
                  },
                  {
                    label: "Blood Group",
                    value: profile.health.bloodGroup,
                    icon: <Droplets size={30} />,
                    field: "bloodGroup",
                  },
                  {
                    label: "Pregnancy Status",
                    value: profile.health.pregnancyStatus,
                    icon: <HeartPulse size={30} />,
                    field: "pregnancyStatus",
                  },
                  {
                    label: "Smoker / Alcohol",
                    value: profile.health.smokerAlcohol,
                    icon: <Activity size={30} />,
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
    <div className="mb-9 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="grid h-16 w-16 place-items-center rounded-xl border border-[#A6FF4D]/25 bg-[#A6FF4D]/5 text-[32px] font-black text-[#A6FF4D]">
          02
        </div>

        <div>
          <h2 className="text-[64px] font-black uppercase leading-none tracking-[0.12em]">
            AI Profile Inputs
          </h2>
          <p className="mt-4 text-[34px] font-semibold text-[#A3B3A3]">
            Your profile helps AI create a plan that adapts perfectly to you.
          </p>
        </div>
      </div>

      <button className="inline-flex items-center gap-4 rounded-2xl border border-[#18D3D0]/25 bg-[#18D3D0]/5 px-9 py-6 text-[34px] font-black text-[#A6FF4D]">
        <CircleHelp size={36} />
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
    <div className="grid min-h-[330px] overflow-hidden rounded-[34px] border border-white/10 bg-[#07110A]/70 xl:grid-cols-[1fr_1.35fr_0.5fr]">
      <div className="flex items-center gap-14 border-r border-white/10 p-11">
        <CircleProgress value={completion} />

        <div>
          <h3 className="text-[46px] font-black">Profile Completion</h3>

          <p className="mt-6 max-w-[520px] text-[32px] leading-[1.45] text-white/75">
            {missingCount > 0
              ? "Great job! Just a few more details to unlock 100% personalized insights."
              : "Your profile is complete. AI has enough context to personalize your plan."}
          </p>

          <div className="mt-8 h-5 w-[520px] rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#A6FF4D] shadow-[0_0_24px_rgba(166,255,77,.6)]"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="mt-6 text-[28px] font-semibold text-white/70">
            {total - completed} of {total} items pending
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-16 p-11">
        <Sparkles
          size={92}
          className="shrink-0 text-[#A6FF4D] drop-shadow-[0_0_30px_rgba(166,255,77,.65)]"
        />

        <div className="relative z-10">
          <p className="text-[32px] font-black uppercase tracking-[0.3em] text-[#A6FF4D]">
            AI Profile Summary
          </p>

          <p className="mt-6 text-[30px] font-medium text-white/70">
            AI has analyzed your data and created this summary.
          </p>

          <div className="mt-8 flex flex-wrap gap-5">
            <SummaryChip label={`Goal: ${profile.nutrition.primaryGoal}`} />
            <SummaryChip label={`Diet: ${profile.nutrition.dietPreference}`} />
            <SummaryChip label="Workout: Evening" />
            <SummaryChip
              label={`Activity: ${profile.nutrition.activityLevel}`}
            />
          </div>

          <div className="mt-8 flex items-center gap-6">
            <span className="text-[32px] font-black text-[#18D3D0]">
              AI Confidence: {completion + 12 > 100 ? 100 : completion + 12}%
            </span>

            <div className="h-3 w-[330px] rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#18D3D0] shadow-[0_0_18px_rgba(24,211,208,.6)]"
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
          className="relative z-10 h-[430px] object-contain opacity-90 mix-blend-screen drop-shadow-[0_0_36px_rgba(24,211,208,.9)]"
        />

        <div className="absolute bottom-10 h-12 w-64 rounded-full border border-[#18D3D0]/50 shadow-[0_0_24px_rgba(24,211,208,.4)]" />
      </div>
    </div>
  );
}

function CircleProgress({ value }: { value: number }) {
  const angle = Math.max(0, Math.min(value, 100)) * 3.6;

  return (
    <div
      className="grid h-[250px] w-[250px] shrink-0 place-items-center rounded-full shadow-[0_0_40px_rgba(166,255,77,.45)]"
      style={{
        background: `conic-gradient(#A6FF4D ${angle}deg, rgba(255,255,255,.13) 0deg)`,
      }}
    >
      <div className="grid h-[190px] w-[190px] place-items-center rounded-full bg-[#07110A]">
        <div className="text-center">
          <p className="text-[68px] font-black leading-none">{value}%</p>
          <p className="mt-2 text-[18px] font-black uppercase tracking-[0.18em] text-[#A6FF4D]">
            Complete
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5 text-[28px] font-bold text-white/90">
      <Sparkles size={24} className="text-[#18D3D0]" />
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
      className="rounded-[34px] border bg-[#07110A]/65 p-9 shadow-[inset_0_0_35px_rgba(255,255,255,.025)]"
      style={{ borderColor: `${color}60` }}
    >
      <div className="mb-9 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span style={{ color }}>{icon}</span>
          <h3
            className="text-[38px] font-black uppercase tracking-[0.14em]"
            style={{ color }}
          >
            {title}
          </h3>
        </div>

        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="rounded-xl border border-[#A6FF4D]/50 p-4 text-[#A6FF4D]"
            >
              <Save size={30} />
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/15 p-4 text-white/70"
            >
              <X size={30} />
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-3 rounded-xl border px-6 py-5 text-[32px] font-black"
            style={{ borderColor: `${color}70`, color }}
          >
            <Edit3 size={32} />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-7">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-5"
          >
            <div className="flex items-center gap-4 text-[30px] font-medium text-white/75">
              <span style={{ color }}>{row.icon}</span>
              {row.label}
            </div>

            {editing ? (
              <input
                value={draftRows[row.field] || ""}
                onChange={(e) => onChange(row.field, e.target.value)}
                className="w-[250px] rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-right text-[28px] font-black text-white outline-none focus:border-[#A6FF4D]/60"
              />
            ) : (
              <p className="text-right text-[30px] font-black text-white">
                {row.value}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-9 border-t border-white/10 pt-6">
        <p className="flex items-center gap-3 text-[23px] font-medium text-white/45">
          <Clock3 size={24} />
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
    <div className="mt-8 grid min-h-[290px] items-center gap-4 rounded-[34px] border border-white/10 bg-[#07110A]/70 p-10 xl:grid-cols-[0.7fr_1.25fr_0.35fr]">
      <div>
        <p className="text-[36px] font-black uppercase tracking-[0.22em] text-[#A6FF4D]">
          {missingCount > 0
            ? `AI Needs ${missingCount} More Details`
            : "Profile Complete"}
        </p>

        <p className="mt-6 text-[30px] leading-[1.45] text-white/70">
          These details will help AI fine tune your nutrition & lifestyle plan.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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

      <div className="relative hidden h-36 xl:block">
        <div className="absolute inset-0 rotate-[-18deg] rounded-full border border-[#18D3D0]/25" />
        <div className="absolute inset-4 rotate-[28deg] rounded-full border border-[#A6FF4D]/20" />
        <span className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#18D3D0] shadow-[0_0_25px_rgba(24,211,208,.9)]" />
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
    <label className="rounded-2xl border border-white/10 bg-black/15 p-6">
      <div className="mb-5 flex items-center gap-4 text-[30px] font-black text-white">
        <MapPin size={32} style={{ color }} />
        {label}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#020604]/65 px-5 py-5 text-[28px] font-bold text-white outline-none placeholder:text-white/45 focus:border-[#18D3D0]/60"
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
    <div className="mt-7 grid min-h-[180px] items-center gap-5 rounded-[34px] border border-[#A6FF4D]/30 bg-[#07110A]/80 p-9 xl:grid-cols-[0.16fr_0.92fr_1.2fr]">
      <div className="grid h-32 w-32 place-items-center rounded-full border border-[#A6FF4D]/25 bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_32px_rgba(166,255,77,.28)]">
        <Target size={76} />
      </div>

      <div>
        <h3 className="text-[48px] font-black tracking-[-0.04em]">
          Ready to generate your AI Nutrition Plan?
        </h3>

        <p className="mt-4 text-[32px] font-medium text-white/65">
          AI has enough information to build a personalized, science-backed plan
          for you.
        </p>
      </div>

      <div className="flex gap-5">
        <button
          onClick={onGenerate}
          className="inline-flex flex-[1.12] items-center justify-center gap-4 rounded-2xl bg-[#A6FF4D] px-9 py-6 text-black shadow-[0_0_40px_rgba(166,255,77,.35)]"
        >
          <span className="text-[36px] font-black tracking-[-0.02em]">
            {isNewUser ? "Generate First Plan" : "Generate AI Nutrition Plan"}
          </span>

          <Sparkles size={30} />

          <span className="grid h-14 w-14 place-items-center rounded-full bg-black text-[26px] text-[#A6FF4D]">
            →
          </span>
        </button>

        <a
          href="/scanner"
          className="inline-flex flex-1 items-center justify-center gap-5 rounded-2xl border border-white/15 bg-white/[0.03] px-9 py-7 text-[42px] font-black text-white"
        >
          <ScanLine size={44} />
          Open Food Scanner
        </a>
      </div>
    </div>
  );
}

function BackgroundFX() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_45%,rgba(24,211,208,0.08),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(166,255,77,0.1),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(166,255,77,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(166,255,77,.11)_1px,transparent_1px)] [background-size:78px_78px]" />
    </>
  );
}