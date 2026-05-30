import AIHealthCommandCenter from "@/components/dashboard/AIHealthCommandCenter";
import AIProfileIntelligence from "@/components/dashboard/AIProfileIntelligence";
import AINutritionPlan from "@/components/dashboard/AINutritionPlan";
import ProgressPredictions from "../components/dashboard/ProgressPredictions";
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-white">
     <AIHealthCommandCenter />
<AIProfileIntelligence />
<AINutritionPlan />
<ProgressPredictions />
    </main>
  );
}