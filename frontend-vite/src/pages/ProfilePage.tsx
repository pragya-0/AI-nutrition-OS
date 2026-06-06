import { Link } from "react-router-dom";
import { ArrowLeft, Activity, HeartPulse, MapPin, ShieldCheck, Sparkles, User, Utensils } from "lucide-react";

type StoredPlan = {
  success?: boolean;
  user_profile?: {
    name?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    city?: string;
    goal?: string;
    diet?: string;
    activity?: string;
    sleep_hours?: number;
    water_intake?: number;
  };
  targets?: {
    calories?: number;
    protein?: number;
    water_target?: string;
  };
  medical_risk?: {
    hard_block?: boolean;
    risk_level?: string;
  };
};

function getStoredPlan(): StoredPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    return raw ? (JSON.parse(raw) as StoredPlan) : null;
  } catch {
    return null;
  }
}

function formatLabel(value?: string | number) {
  if (value === undefined || value === null || value === "") return "Not set";
  return String(value).replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProfilePage() {
  const plan = getStoredPlan();
  const profile = plan?.user_profile || {};
  const targets = plan?.targets || {};
  const isBlocked = plan?.medical_risk?.hard_block === true;

  const cards = [
    { label: "Name", value: profile.name || "User", icon: User, color: "#A6FF4D" },
    { label: "Age / Gender", value: `${profile.age || "—"} · ${formatLabel(profile.gender)}`, icon: User, color: "#18D3D0" },
    { label: "Body", value: `${profile.height || "—"} cm · ${profile.weight || "—"} kg`, icon: Activity, color: "#FFB347" },
    { label: "City", value: profile.city || "Not set", icon: MapPin, color: "#A875FF" },
    { label: "Goal", value: formatLabel(profile.goal), icon: HeartPulse, color: "#A6FF4D" },
    { label: "Diet", value: formatLabel(profile.diet), icon: Utensils, color: "#18D3D0" },
    { label: "Activity", value: formatLabel(profile.activity), icon: Activity, color: "#FFB347" },
    { label: "Targets", value: `${targets.calories || "—"} kcal · ${targets.protein || "—"}g protein`, icon: Sparkles, color: "#A875FF" },
  ];

  return (
    <main className="min-h-screen bg-[#030805] px-4 py-5 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <section className="mx-auto max-w-[92vw] rounded-[32px] border border-[#A6FF4D]/20 bg-[#020604]/95 px-5 py-7 shadow-[0_0_90px_rgba(166,255,77,0.08)] 2xl:max-w-[1780px]">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-[13px] font-black text-[#A6FF4D] transition hover:text-[#C6FF7B]"
        >
          <ArrowLeft size={17} />
          Back to Daily Dashboard
        </Link>

        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#A6FF4D]">
          Profile
        </p>

        <h1 className="mt-4 text-[42px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[58px]">
          Your active profile,
          <br />
          <span className="text-[#A6FF4D]">targets and safety state.</span>
        </h1>

        <p className="mt-5 max-w-[860px] text-[16px] font-semibold leading-7 text-white/65">
          This page shows the currently active local development profile. For public launch, this should become authenticated, database-backed, and editable with consent history.
        </p>

        <div className="mt-6 rounded-[24px] border border-[#FFB347]/25 bg-[#2A1A05]/45 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className={isBlocked ? "text-[#FF6C7D]" : "text-[#FFB347]"} size={22} />
            <div>
              <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[#FFB347]">
                Safety Status
              </p>
              <p className="mt-2 text-[14px] font-semibold leading-6 text-white/70">
                {isBlocked
                  ? "This profile is blocked and needs qualified medical guidance before AI recommendations."
                  : "No hard medical block is active in the saved generated plan. Wellness guidance only."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                <Icon size={22} style={{ color: item.color }} />
                <p className="mt-4 text-[12px] font-black uppercase tracking-[0.18em] text-white/45">
                  {item.label}
                </p>
                <p className="mt-2 text-[18px] font-black leading-6 text-white">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/dashboard/onboarding" className="rounded-2xl bg-[#A6FF4D] px-5 py-3 text-[13px] font-black text-[#07110A]">
            Update Profile
          </Link>
          <Link to="/settings" className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white/85">
            Privacy & Settings
          </Link>
        </div>
      </section>
    </main>
  );
}
