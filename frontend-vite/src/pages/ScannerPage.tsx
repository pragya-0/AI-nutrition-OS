import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Home,
  ScanLine,
  ShieldCheck,
  Utensils,
} from "lucide-react";

import ScannerHeroUpload from "@/components/scanner/ScannerHeroUpload";
import AIAnalysisResult from "@/components/scanner/AIAnalysisResult";
import NutritionIntelligence from "@/components/scanner/NutritionIntelligence";
import AIRecommendations from "@/components/scanner/AIRecommendations";
import RecentScans from "@/components/scanner/RecentScans";
import ScanHistory from "@/components/scanner/ScanHistory";

type ScanResult = Record<string, unknown> | null;

const scannerNav = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Nutrition", to: "/nutrition", icon: Utensils },
  { label: "Progress", to: "/progress", icon: BarChart3 },
  { label: "Reports", to: "/reports", icon: CalendarDays },
];

function ScannerTopNav() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto flex max-w-[92vw] flex-col gap-3 rounded-[24px] border border-white/10 bg-[#061009]/78 px-5 py-4 shadow-[0_0_40px_rgba(147,197,114,0.05)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between 2xl:max-w-[1780px]">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[13px] font-black text-[#93C572] transition hover:text-[#A4D08A]"
          >
            <ArrowLeft size={16} />
            Back to Daily Dashboard
          </Link>
          <p className="mt-2 text-[13px] font-semibold text-white/55">
            Scanner is a dedicated section so the dashboard stays focused on today.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {scannerNav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-[12px] font-black text-white/75 transition hover:border-[#93C572]/35 hover:text-[#93C572]"
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScannerSafetyNotice() {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <details className="mx-auto max-w-[92vw] rounded-[24px] border border-[#18D3D0]/20 bg-[#041615]/64 px-5 py-4 shadow-[0_0_35px_rgba(24,211,208,0.06)] 2xl:max-w-[1780px]">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-[12px] font-black uppercase tracking-[0.24em] text-[#18D3D0]">
          <ShieldCheck size={15} />
          Estimated Food Analysis
        </summary>
        <p className="mt-3 text-[14px] font-semibold leading-6 text-white/70">
          Food scanner results are AI-generated estimates only. Results may vary
          by portion size, ingredients, preparation method, and image quality.
          This is not medical advice and should not be used for disease
          management, allergies, medication decisions, or emergency care.
        </p>
      </details>
    </section>
  );
}

function ScannerResultNotice({ hasResult }: { hasResult: boolean }) {
  return (
    <section className="bg-[#030805] px-4 pt-4 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div
        className={`mx-auto max-w-[92vw] rounded-[24px] border px-5 py-4 2xl:max-w-[1780px] ${
          hasResult
            ? "border-[#93C572]/20 bg-[#061009]/74"
            : "border-white/10 bg-white/[0.035]"
        }`}
      >
        <p
          className={`flex items-center gap-2 text-[13px] font-black ${
            hasResult ? "text-[#93C572]" : "text-white/72"
          }`}
        >
          <ScanLine size={16} />
          {hasResult
            ? "Scan complete. Review analysis first, then use recommendations as wellness guidance only."
            : "Upload a food image to unlock AI analysis, nutrition intelligence, and recommendations."}
        </p>
      </div>
    </section>
  );
}

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<ScanResult>(null);

  return (
    <main className="min-h-screen bg-[#030805] text-[#F5F8F2]">
      <ScannerTopNav />
      <ScannerSafetyNotice />
      <ScannerHeroUpload onScanComplete={setScanResult} />
      <ScannerResultNotice hasResult={Boolean(scanResult)} />

      {scanResult ? <AIAnalysisResult result={scanResult} /> : null}
      {scanResult ? <NutritionIntelligence result={scanResult} /> : null}
      {scanResult ? <AIRecommendations result={scanResult} /> : null}

      <RecentScans />
      <ScanHistory />
    </main>
  );
}
