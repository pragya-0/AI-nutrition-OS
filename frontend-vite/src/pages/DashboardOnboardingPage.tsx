import { Link } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AIProfileIntelligence from "@/components/dashboard/AIProfileIntelligence";

export default function DashboardOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-white">
      <section className="relative overflow-hidden bg-[#030805] px-4 pb-2 pt-8 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(166,255,77,0.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(24,211,208,0.08),transparent_28%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[92vw] 2xl:max-w-[1780px]">
          <div className="rounded-[30px] border border-[#173326] bg-[#020604]/95 px-5 py-8 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:px-6 lg:px-8">
            <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <Link
                to="/"
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[13px] font-black text-white/78 transition hover:border-[#A6FF4D]/35 hover:text-[#A6FF4D]"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#18D3D0]/25 bg-[#18D3D0]/5 px-4 py-3 text-[13px] font-black text-[#18D3D0] transition hover:scale-[1.02]"
              >
                <LayoutDashboard size={16} />
                View Dashboard
              </Link>
            </div>

            <p className="inline-flex items-center gap-2 rounded-full border border-[#18D3D0]/20 bg-[#18D3D0]/5 px-4 py-2 text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
              <Sparkles size={15} />
              AI Nutrition Onboarding
            </p>

            <h1 className="mt-5 max-w-[950px] text-[40px] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[54px] lg:text-[66px] xl:text-[76px]">
              Confirm your profile.
              <br />
              <span className="text-[#A6FF4D]">Generate your plan.</span>
            </h1>

            <p className="mt-5 max-w-[780px] text-[17px] leading-8 text-white/68 lg:text-[19px]">
              Review your body, lifestyle, nutrition, and health inputs first.
              Then choose 1, 7, 15, or 30 days and generate your personalized AI
              nutrition plan.
            </p>

            <div className="mt-7 grid gap-3 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#A6FF4D]/15 bg-[#A6FF4D]/5 px-4 py-4">
                <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#A6FF4D]">
                  Step 01
                </p>
                <p className="mt-2 text-[15px] font-semibold text-white/72">
                  Confirm profile, lifestyle, diet, and safety information.
                </p>
              </div>

              <div className="rounded-2xl border border-[#18D3D0]/15 bg-[#18D3D0]/5 px-4 py-4">
                <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#18D3D0]">
                  Step 02
                </p>
                <p className="mt-2 text-[15px] font-semibold text-white/72">
                  Accept wellness-only consent before AI generation.
                </p>
              </div>

              <div className="rounded-2xl border border-[#FFB347]/20 bg-[#2A1A05]/45 px-4 py-4">
                <p className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.16em] text-[#FFB347]">
                  <ShieldCheck size={15} />
                  Safety First
                </p>
                <p className="mt-2 text-[15px] font-semibold text-white/72">
                  Medical-risk profiles are blocked before dashboard activation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIProfileIntelligence />
    </main>
  );
}