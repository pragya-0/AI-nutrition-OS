import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home, ScanLine, User, Utensils } from "lucide-react";

const bottomNav = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Nutrition", to: "/nutrition", icon: Utensils },
  { label: "Scan", to: "/scanner", icon: ScanLine },
  { label: "Progress", to: "/progress", icon: BarChart3 },
  { label: "Profile", to: "/profile", icon: User },
];

function isActivePath(pathname: string, route: string) {
  if (route === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/onboarding";
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}

export default function MobileBottomNav() {
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-[#061009]/96 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-[#F5F8F2] shadow-[0_-18px_55px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden">
      <div className="mx-auto grid max-w-[560px] grid-cols-5 gap-1">
        {bottomNav.map((item) => {
          const active = isActivePath(location.pathname, item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[58px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-[10px] font-black transition ${
                active
                  ? "border border-[#93C572]/20 bg-[#93C572]/14 text-[#93C572] shadow-[0_0_18px_rgba(147,197,114,0.08)]"
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
