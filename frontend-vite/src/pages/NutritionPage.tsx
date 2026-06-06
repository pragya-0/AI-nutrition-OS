import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, ShieldCheck, Sparkles } from "lucide-react";
import AINutritionPlan from "@/components/dashboard/AINutritionPlan";

function PageHeader() {
  return (
    <section className="bg-[#030805] px-4 pt-5 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[28px] border border-[#93C572]/18 bg-[#020604]/95 px-5 py-6 shadow-[0_0_60px_rgba(147,197,114,0.07)] 2xl:max-w-[1780px]">
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
              <CalendarDays size={15} />
              Nutrition Workspace
            </p>

            <h1 className="mt-3 text-[40px] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[56px]">
              Full meal plan,
              <br />
              <span className="text-[#93C572]">swaps and targets.</span>
            </h1>

            <p className="mt-4 max-w-[860px] text-[16px] font-semibold leading-7 text-white/65">
              This page holds detailed nutrition planning so the dashboard stays
              focused on today. Use it for 1/7/15/30-day plans, meal calendar,
              swaps, macros, hydration, grocery list, and quality warnings.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              to="/dashboard/onboarding"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-[#93C572] px-5 py-3 text-[13px] font-black text-[#07110A] shadow-[0_0_24px_rgba(147,197,114,0.14)] transition hover:scale-[1.02] hover:bg-[#A4D08A]"
            >
              <Sparkles size={17} />
              Regenerate Plan
            </Link>

            <Link
              to="/reports"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-[13px] font-black text-white/85 transition hover:border-[#93C572]/35"
            >
              <ShieldCheck size={17} />
              View Quality Report
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NutritionPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-white">
      <PageHeader />
      <AINutritionPlan />
    </main>
  );
}
