import ScannerHeroUpload from "@/components/scanner/ScannerHeroUpload";
import AIAnalysisResult from "@/components/scanner/AIAnalysisResult";
import NutritionIntelligence from "@/components/scanner/NutritionIntelligence";

export default function ScannerPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-[#F5F8F2]">
      <ScannerHeroUpload />
      <AIAnalysisResult />
      <NutritionIntelligence />
    </main>
  );
}