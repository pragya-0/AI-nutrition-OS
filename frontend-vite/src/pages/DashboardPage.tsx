import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from "lucide-react";

import AIHealthCommandCenter from "@/components/dashboard/AIHealthCommandCenter";

type MealQuality = {
  production_ready_meal_quality?: boolean;
  nutritionist_quality_score?: number;
  family_variety_score?: number;
  alternative_variety_score?: number;
  requested_days?: number;
  generated_days?: number;
  diet_validation_passed?: boolean;
};

type StoredGeneratedPlan = {
  success?: boolean;
  meal_quality?: MealQuality;
  quality_scores?: MealQuality;
  analytics?: { meal_quality?: MealQuality };
  meal_plan?: { days?: unknown[] };
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

function getMealQuality(plan: StoredGeneratedPlan | null): MealQuality | null {
  if (!plan) return null;
  return plan.meal_quality || plan.quality_scores || plan.analytics?.meal_quality || null;
}

function CompactDisclaimer() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <details className="mx-auto max-w-[92vw] rounded-[22px] border border-white/10 bg-[#061009]/72 px-5 py-4 2xl:max-w-[1780px]">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-[12px] font-black uppercase tracking-[0.22em] text-[#F5B942]">
          <Info size={15} />
          General Wellness Guidance Only
        </summary>
        <p className="mt-3 max-w-[1120px] text-[13px] font-semibold leading-6 text-white/68">
          AI Nutrition OS is not a medical device and does not provide medical
          advice, diagnosis, treatment, emergency care, disease management, or
          professional dietary counselling. If you have any medical condition,
          pregnancy-related state, addiction/dependency concern, or urgent
          symptoms, consult a qualified healthcare professional.
        </p>
      </details>
    </section>
  );
}

function DashboardQualityBanner() {
  const plan = getStoredPlan();
  const quality = getMealQuality(plan);

  if (!plan?.success || !quality) return null;

  const generatedDays = quality.generated_days || plan.meal_plan?.days?.length || 0;
  const requestedDays = quality.requested_days || generatedDays;
  const productionReady = quality.production_ready_meal_quality === true;
  const score = Math.round(Number(quality.nutritionist_quality_score || 0));
  const familyScore = Math.round(Number(quality.family_variety_score || 0));
  const alternativeScore = Math.round(Number(quality.alternative_variety_score || 0));

  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div
        className={`mx-auto max-w-[92vw] rounded-[24px] border px-5 py-4 2xl:max-w-[1780px] ${
          productionReady
            ? "border-[#93C572]/25 bg-[#061009]/78 shadow-[0_0_30px_rgba(147,197,114,0.07)]"
            : "border-[#F5B942]/28 bg-[#2A1A05]/50 shadow-[0_0_30px_rgba(245,185,66,0.07)]"
        }`}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-3">
            <div
              className={`mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${
                productionReady
                  ? "border-[#93C572]/35 bg-[#93C572]/10 text-[#93C572]"
                  : "border-[#F5B942]/35 bg-[#F5B942]/10 text-[#F5B942]"
              }`}
            >
              {productionReady ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
            </div>

            <div>
              <p
                className={`text-[12px] font-black uppercase tracking-[0.22em] ${
                  productionReady ? "text-[#93C572]" : "text-[#F5B942]"
                }`}
              >
                {productionReady ? "Nutrition Quality Passed" : "Nutrition Quality Needs Review"}
              </p>

              <p className="mt-2 max-w-[1060px] text-[14px] font-semibold leading-6 text-white/70">
                {generatedDays} of {requestedDays} days generated. Nutritionist quality score: {score || "N/A"}/100.
                {productionReady
                  ? " This plan passed the public-release quality gate."
                  : ` Long-duration variety should improve before public launch. Family variety ${familyScore || "N/A"}/100, alternatives ${alternativeScore || "N/A"}/100.`}
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/onboarding"
            className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white/85 transition hover:border-[#93C572]/35 hover:bg-white/[0.065]"
          >
            Regenerate / Change Duration
          </Link>
        </div>
      </div>
    </section>
  );
}

function DashboardReleaseReadinessBanner() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[24px] border border-[#18D3D0]/18 bg-[#041615]/62 px-5 py-4 shadow-[0_0_30px_rgba(24,211,208,0.06)] 2xl:max-w-[1780px]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
              <ShieldCheck size={15} />
              Daily Command Center
            </p>
            <p className="mt-2 max-w-[1080px] text-[14px] font-semibold leading-6 text-white/70">
              Dashboard focuses on today: metabolic profile, meals, progress,
              and one coach action. Nutrition, scanner, progress, reports,
              profile, and settings live in dedicated pages.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/nutrition"
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white/85 transition hover:border-[#93C572]/28 hover:bg-white/[0.065]"
            >
              Full Nutrition Plan
            </Link>
            <Link
              to="/dashboard/onboarding"
              className="inline-flex w-fit items-center justify-center rounded-2xl bg-[#93C572] px-5 py-3 text-[13px] font-black text-[#07110A] shadow-[0_0_24px_rgba(147,197,114,0.14)] transition hover:scale-[1.02] hover:bg-[#A4D08A]"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardActivationGate() {
  return (
    <section className="bg-[#030805] px-4 py-10 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[32px] border border-[#93C572]/18 bg-[#020604]/95 px-6 py-10 text-center shadow-[0_0_70px_rgba(147,197,114,0.08)] 2xl:max-w-[1780px]">
        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#18D3D0]">
          Dashboard Not Activated Yet
        </p>

        <h1 className="mx-auto mt-5 max-w-[900px] text-[42px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[58px] lg:text-[72px]">
          Confirm your profile first.
          <br />
          <span className="text-[#93C572]">Then unlock your AI dashboard.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[760px] text-[17px] leading-8 text-white/68">
          To avoid fake or demo dashboard values, AI Nutrition OS needs a real
          profile and generated nutrition plan before showing personalized
          calories, macros, meals, adherence, and coach recommendations.
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
    <main className="min-h-screen bg-[#030805] text-white">
      <CompactDisclaimer />
      <DashboardReleaseReadinessBanner />

      {dashboardActivated ? (
        <>
          <DashboardQualityBanner />
          <AIHealthCommandCenter />
        </>
      ) : (
        <DashboardActivationGate />
      )}
    </main>
  );
}
