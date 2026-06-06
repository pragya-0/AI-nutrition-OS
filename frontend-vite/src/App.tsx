import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { BarChart3, Home, ScanLine, User, Utensils } from "lucide-react";

import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import DashboardOnboardingPage from "@/pages/DashboardOnboardingPage";
import NutritionPage from "@/pages/NutritionPage";
import ScannerPage from "@/pages/ScannerPage";
import ProgressPage from "@/pages/ProgressPage";
import ReportsPage from "@/pages/ReportsPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

function PlaceholderPage({
  title,
  subtitle,
  backTo = "/dashboard",
}: {
  title: string;
  subtitle: string;
  backTo?: string;
}) {
  return (
    <main className="min-h-screen bg-[#030805] px-4 py-16 text-[#F5F8F2] sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[980px] rounded-[32px] border border-[#93C572]/18 bg-[#061009]/95 px-6 py-10 shadow-[0_0_54px_rgba(147,197,114,0.06)]">
        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#18D3D0]">
          AI Nutrition OS
        </p>

        <h1 className="mt-5 text-[42px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[58px]">
          {title}
        </h1>

        <p className="mt-5 max-w-[720px] text-[17px] leading-8 text-white/68">
          {subtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={backTo}
            className="inline-flex rounded-2xl bg-[#93C572] px-6 py-3 text-[14px] font-black text-[#07110A] transition hover:bg-[#A4D08A]"
          >
            Back
          </Link>

          <Link
            to="/dashboard/onboarding"
            className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-[14px] font-black text-white/85 transition hover:border-[#93C572]/30"
          >
            Update Profile
          </Link>
        </div>
      </section>
    </main>
  );
}

const bottomNav = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Nutrition", to: "/nutrition", icon: Utensils },
  { label: "Scan", to: "/scanner", icon: ScanLine },
  { label: "Progress", to: "/progress", icon: BarChart3 },
  { label: "Profile", to: "/profile", icon: User },
];

function MobileBottomNav() {
  const location = useLocation();
  const show = location.pathname !== "/";

  if (!show) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#061009]/96 px-2 py-2 text-[#F5F8F2] shadow-[0_-18px_55px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden">
      <div className="mx-auto grid max-w-[560px] grid-cols-5 gap-1">
        {bottomNav.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[10px] font-black transition ${
                active
                  ? "bg-[#93C572]/14 text-[#93C572]"
                  : "text-[#A3B3A3] hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="mt-1 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/onboarding" element={<DashboardOnboardingPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/login"
          element={
            <PlaceholderPage
              title="Login Coming Soon"
              subtitle="Authentication will be added before public launch. For now, local profile and plan storage is used only for development testing."
              backTo="/"
            />
          }
        />
        <Route
          path="/register"
          element={
            <PlaceholderPage
              title="Create Account Coming Soon"
              subtitle="Production account creation should include secure authentication, consent capture, user profile storage, and protected dashboards."
              backTo="/"
            />
          }
        />
        <Route
          path="/privacy"
          element={
            <PlaceholderPage
              title="Privacy Policy"
              subtitle="This page should explain what personal, health, nutrition, scan, progress, and usage data AI Nutrition OS collects, stores, processes, exports, and deletes."
              backTo="/"
            />
          }
        />
        <Route
          path="/terms"
          element={
            <PlaceholderPage
              title="Terms of Use"
              subtitle="This page should define acceptable use, user responsibility, wellness-only limitations, account rules, subscription terms, and liability boundaries."
              backTo="/"
            />
          }
        />
        <Route
          path="/disclaimer"
          element={
            <PlaceholderPage
              title="Medical Disclaimer"
              subtitle="AI Nutrition OS provides general wellness guidance only. It does not provide medical advice, diagnosis, treatment, emergency care, or disease management."
              backTo="/"
            />
          }
        />
        <Route
          path="/consent"
          element={
            <PlaceholderPage
              title="Consent"
              subtitle="This page should collect informed consent before using profile, lifestyle, nutrition, scanner, and wellness inputs to generate AI recommendations."
              backTo="/"
            />
          }
        />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page Not Found"
              subtitle="The page you are looking for does not exist or has not been added yet."
              backTo="/"
            />
          }
        />
      </Routes>
      <MobileBottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
