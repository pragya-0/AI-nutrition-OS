import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "@/components/landing/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const productRoutes = [
  "/dashboard",
  "/dashboard/onboarding",
  "/nutrition",
  "/scanner",
  "/progress",
  "/reports",
  "/profile",
  "/settings",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/consent",
  "/login",
  "/register",
];

function isProductRoute(pathname: string) {
  return productRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const showProductShell = isProductRoute(location.pathname);

  if (!showProductShell) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#030805] text-[#F5F8F2]">
      <Navbar variant="product" />

      <div className="pb-[88px] md:pb-0">
        {children}
      </div>

      <MobileBottomNav />
    </div>
  );
}
