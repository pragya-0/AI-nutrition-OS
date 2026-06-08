import { Link } from "react-router-dom";
import { Info } from "lucide-react";

import AIHealthCommandCenter from "@/components/dashboard/AIHealthCommandCenter";

type StoredGeneratedPlan = {
  success?: boolean;
};

function getStoredPlan(): StoredGeneratedPlan | null {
  try {
    const raw = localStorage.getItem("ai_nutrition_generated_plan");
    if (!raw) return null;
    return JSON.parse(raw) as StoredGeneratedPlan;
  } catch {
    return null;
  }
}

function hasGeneratedPlan() {
  const plan = getStoredPlan();
  return Boolean(plan && plan.success !== false);
}

function CompactDisclaimer() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <details className="mx-auto max-w-[92vw] rounded-[20px] border border-white/10 bg-[#061009]/70 px-5 py-3 2xl:max-w-[1780px]">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#F5B942]">
          <Info size={14} />
          General wellness guidance
        </summary>

        <p className="mt-3 max-w-[1120px] text-[13px] font-semibold leading-6 text-white/62">
          AI Nutrition OS provides general wellness guidance only. It is not a
          medical device and does not provide medical advice, diagnosis,
          treatment, emergency care, disease management, or professional dietary
          counselling.
        </p>
      </details>
    </section>
  );
}

function DashboardActivationGate() {
  return (
    <section className="bg-[#030805] px-4 py-10 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[32px] border border-[#93C572]/18 bg-[#061009]/95 px-6 py-12 text-center shadow-[0_0_70px_rgba(147,197,114,0.08)] 2xl:max-w-[1780px]">
        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#18D3D0]">
          Dashboard Not Activated Yet
        </p>

        <h1 className="mx-auto mt-5 max-w-[900px] text-[42px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[58px] lg:text-[72px]">
          Confirm your profile first.
          <br />
          <span className="text-[#93C572]">Then unlock your AI dashboard.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[760px] text-[17px] leading-8 text-white/68">
          AI Nutrition OS needs a real profile and generated nutrition plan
          before showing personalized calories, macros, meals, adherence, and
          coach recommendations.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/dashboard/onboarding"
            className="inline-flex items-center justify-center rounded-2xl bg-[#93C572] px-7 py-4 text-[16px] font-black text-[#07110A] shadow-[0_0_28px_rgba(147,197,114,0.16)] transition hover:scale-[1.02] hover:bg-[#A4D08A]"
          >
            Start Profile Confirmation
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const dashboardActivated = hasGeneratedPlan();

  return (
    <main className="min-h-screen bg-[#030805] pb-20 text-white md:pb-0">
      <CompactDisclaimer />

      {dashboardActivated ? (
        <AIHealthCommandCenter />
      ) : (
        <DashboardActivationGate />
      )}
    </main>
  );
}
