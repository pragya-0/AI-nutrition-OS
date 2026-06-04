import AIProfileIntelligence from "@/components/dashboard/AIProfileIntelligence";

export default function DashboardOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-white">
      <section className="relative overflow-hidden bg-[#030805] px-4 pb-2 pt-8 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="relative z-10 mx-auto w-full max-w-[92vw] 2xl:max-w-[1780px]">
          <div className="rounded-[30px] border border-[#173326] bg-[#020604]/95 px-5 py-8 shadow-[0_0_80px_rgba(166,255,77,0.08)] sm:px-6 lg:px-8">
            <p className="text-[12px] font-black uppercase tracking-[0.34em] text-[#18D3D0]">
              AI Nutrition Onboarding
            </p>

            <h1 className="mt-4 max-w-[950px] text-[40px] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[54px] lg:text-[66px] xl:text-[76px]">
              Confirm your profile.
              <br />
              <span className="text-[#A6FF4D]">Generate your plan.</span>
            </h1>

            <p className="mt-5 max-w-[780px] text-[17px] leading-8 text-white/68 lg:text-[19px]">
              Review your body, lifestyle, nutrition, and health inputs first.
              Then choose 1, 7, 15, or 30 days and generate your personalized AI nutrition plan.
            </p>
          </div>
        </div>
      </section>

      <AIProfileIntelligence />
    </main>
  );
}