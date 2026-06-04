import { useState } from "react";
import ScannerHeroUpload from "@/components/scanner/ScannerHeroUpload";
import AIAnalysisResult from "@/components/scanner/AIAnalysisResult";
import NutritionIntelligence from "@/components/scanner/NutritionIntelligence";
import AIRecommendations from "@/components/scanner/AIRecommendations";
import RecentScans from "@/components/scanner/RecentScans";
import ScanHistory from "@/components/scanner/ScanHistory";

function ScannerSafetyNotice() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[24px] border border-[#18D3D0]/20 bg-[#041615]/70 px-5 py-4 shadow-[0_0_50px_rgba(24,211,208,0.08)] 2xl:max-w-[1780px]">
        <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
          Estimated Food Analysis
        </p>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-white/70">
          Food scanner results are AI-generated estimates only. Results may vary
          by portion size, ingredients, preparation method, and image quality.
          This is not medical advice and should not be used for disease
          management, allergies, medication decisions, or emergency care.
        </p>
      </div>
    </section>
  );
}

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);

  return (
    <main className="min-h-screen bg-[#030805] text-[#F5F8F2]">
      <ScannerSafetyNotice />
      <ScannerHeroUpload onScanComplete={setScanResult} />

      {scanResult && <AIAnalysisResult result={scanResult} />}

      {scanResult && <NutritionIntelligence result={scanResult} />}

      {scanResult && <AIRecommendations result={scanResult} />}

      <RecentScans />
      <ScanHistory />
    </main>
  );
}
