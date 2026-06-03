import { useState } from "react";
import ScannerHeroUpload from "@/components/scanner/ScannerHeroUpload";
import AIAnalysisResult from "@/components/scanner/AIAnalysisResult";
import NutritionIntelligence from "@/components/scanner/NutritionIntelligence";
import AIRecommendations from "@/components/scanner/AIRecommendations";
import RecentScans from "@/components/scanner/RecentScans";
import ScanHistory from "@/components/scanner/ScanHistory";

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);

  return (
    <main className="min-h-screen bg-[#030805] text-[#F5F8F2]">
      <ScannerHeroUpload onScanComplete={setScanResult} />

      {scanResult && <AIAnalysisResult result={scanResult} />}

      {scanResult && <NutritionIntelligence result={scanResult} />}

      {scanResult && <AIRecommendations result={scanResult} />}

      <RecentScans />
      <ScanHistory />
    </main>
  );
}