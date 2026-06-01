import AIHealthCommandCenter from "@/components/dashboard/AIHealthCommandCenter";
import AIProfileIntelligence from "@/components/dashboard/AIProfileIntelligence";
import AINutritionPlan from "@/components/dashboard/AINutritionPlan";
import ProgressPredictions from "@/components/dashboard/ProgressPredictions";
import AICoachInsights from "@/components/dashboard/AICoachInsights";
import RecentFoodScans from "@/components/dashboard/RecentFoodScans";
import AnalyticsHub from "@/components/dashboard/AnalyticsHub";
import AIHealthReport from "@/components/dashboard/AIHealthReport";
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-white">
 <AIHealthCommandCenter />
<AIProfileIntelligence />
<AINutritionPlan />
<ProgressPredictions />
<AICoachInsights />
<RecentFoodScans />
<AnalyticsHub />
<AIHealthReport />
    </main>
  );
}