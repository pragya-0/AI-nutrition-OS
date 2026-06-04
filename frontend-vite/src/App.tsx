import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import DashboardOnboardingPage from "@/pages/DashboardOnboardingPage";
import ScannerPage from "@/pages/ScannerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/onboarding" element={<DashboardOnboardingPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
      </Routes>
    </BrowserRouter>
  );
}