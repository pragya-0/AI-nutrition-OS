import AIHealthCommandCenter from "@/components/dashboard/AIHealthCommandCenter";
import AINutritionPlan from "@/components/dashboard/AINutritionPlan";
import ProgressPredictions from "@/components/dashboard/ProgressPredictions";
import AICoachInsights from "@/components/dashboard/AICoachInsights";
import RecentFoodScans from "@/components/dashboard/RecentFoodScans";
import AnalyticsHub from "@/components/dashboard/AnalyticsHub";
import AIHealthReport from "@/components/dashboard/AIHealthReport";

function WellnessDisclaimerBanner() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-white sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[24px] border border-[#FFB347]/25 bg-[#2A1A05]/55 px-5 py-4 shadow-[0_0_50px_rgba(255,179,71,0.08)] 2xl:max-w-[1780px]">
        <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#FFB347]">
          General Wellness Guidance Only
        </p>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-white/72">
          AI Nutrition OS is not a medical device and does not provide medical
          advice, diagnosis, treatment, emergency care, disease management, or
          professional dietary counselling. If you have any medical condition,
          pregnancy-related state, addiction/dependency concern, or urgent
          symptoms, consult a qualified healthcare professional.
        </p>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-white">
      <WellnessDisclaimerBanner />
      <AIHealthCommandCenter />
      <AINutritionPlan />
      <ProgressPredictions />
      <AICoachInsights />
      <RecentFoodScans />
      <AnalyticsHub />
      <AIHealthReport />
    </main>
  );
}
