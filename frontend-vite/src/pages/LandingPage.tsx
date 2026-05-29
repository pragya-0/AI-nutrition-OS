import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FoodScannerSection from "@/components/landing/FoodScannerSection";
import AdaptiveEngineSection from "@/components/landing/AdaptiveEngineSection";
import ProgressTrackingSection from "@/components/landing/progress/ProgressTrackingSection";
import AssessmentSection from "@/components/landing/AssessmentSection";
import AboutSection from "@/components/landing/AboutSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FooterSection from "@/components/landing/FooterSection";
import BackgroundEffects from "@/components/landing/BackgroundEffects";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030805] text-white">
      <BackgroundEffects />
      <Navbar />
      <HeroSection />
      <FoodScannerSection />
      <AdaptiveEngineSection />
      <ProgressTrackingSection />
      <AssessmentSection />
      <AboutSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}