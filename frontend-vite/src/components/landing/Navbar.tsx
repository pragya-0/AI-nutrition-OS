"use client";

import { Link, useLocation } from "react-router-dom";
import Image from "@/compat/NextImage";
import {
  BarChart3,
  FileText,
  Menu,
  ScanLine,
  Settings,
  User,
  Utensils,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ASSESSMENT_LINK = "/dashboard/onboarding";

type NavbarVariant = "landing" | "product";

type NavItem = {
  label: string;
  href: string;
  type: "anchor" | "route";
  icon?: React.ElementType;
};

const landingNavItems: NavItem[] = [
  { label: "Home", href: "/#home", type: "anchor" },
  { label: "Features", href: "/#features", type: "anchor" },
  { label: "Scanner", href: "/scanner", type: "route" },
  { label: "Assessment", href: ASSESSMENT_LINK, type: "route" },
  { label: "Dashboard", href: "/dashboard", type: "route" },
];

const productNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", type: "route", icon: BarChart3 },
  { label: "Nutrition", href: "/nutrition", type: "route", icon: Utensils },
  { label: "Scanner", href: "/scanner", type: "route", icon: ScanLine },
  { label: "Progress", href: "/progress", type: "route", icon: BarChart3 },
  { label: "Reports", href: "/reports", type: "route", icon: FileText },
  { label: "Profile", href: "/profile", type: "route", icon: User },
  { label: "Settings", href: "/settings", type: "route", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/onboarding";
  }

  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  const classes = `inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
    active
      ? "border border-[#93C572]/24 bg-[#93C572]/12 text-[#93C572] shadow-[0_0_18px_rgba(147,197,114,0.08)]"
      : "text-[#A3B3A3] hover:bg-white/[0.06] hover:text-[#F5F8F2]"
  }`;

  if (item.type === "route") {
    return (
      <Link to={item.href} onClick={onClick} className={classes} aria-current={active ? "page" : undefined}>
        {Icon ? <Icon size={16} /> : null}
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} onClick={onClick} className={classes} aria-current={active ? "page" : undefined}>
      {Icon ? <Icon size={16} /> : null}
      {item.label}
    </a>
  );
}

export default function Navbar({ variant = "landing" }: { variant?: NavbarVariant }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isProduct = variant === "product";
  const navItems = isProduct ? productNavItems : landingNavItems;

  return (
    <header className="sticky left-0 top-0 z-50 w-full border-b border-white/10 bg-[#030805]/80 px-4 py-3 text-[#F5F8F2] backdrop-blur-2xl sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <nav className="mx-auto flex w-full max-w-[1780px] items-center justify-between gap-4 rounded-[26px] border border-white/10 bg-[#061009]/82 px-4 py-3 shadow-[0_18px_64px_rgba(0,0,0,0.34)] md:px-5">
        <Link to={isProduct ? "/dashboard" : "/"} className="flex min-w-0 items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="NutriAI logo"
            width={46}
            height={46}
            priority
            className="rounded-full"
          />
          <div className="min-w-0 leading-none">
            <p className="truncate text-xl font-black tracking-tight text-[#F5F8F2]">NutriAI</p>
            <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-[0.25em] text-[#A3B3A3]">
              AI Health OS
            </p>
          </div>
        </Link>

        <div className="hidden min-w-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} active={isActive(location.pathname, item.href)} />
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {isProduct ? (
            <Link
              to={ASSESSMENT_LINK}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-[#F5F8F2] transition hover:border-[#93C572]/35 hover:bg-white/[0.045]"
            >
              Update Profile
            </Link>
          ) : (
            <Link
              to={ASSESSMENT_LINK}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-[#F5F8F2] transition hover:border-[#93C572]/35 hover:bg-white/[0.045]"
            >
              Start Assessment
            </Link>
          )}

          <Link
            to={ASSESSMENT_LINK}
            className="rounded-full bg-[#93C572] px-6 py-2.5 text-sm font-black text-[#07110A] shadow-[0_0_24px_rgba(147,197,114,0.14)] transition-all duration-300 hover:scale-105 hover:bg-[#A4D08A] hover:shadow-[0_0_30px_rgba(147,197,114,0.18)]"
          >
            Get Your Plan
          </Link>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-[#F5F8F2] transition hover:border-[#93C572]/30 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-4 max-w-[1780px] overflow-hidden rounded-[28px] border border-white/10 bg-[#061009]/96 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl lg:hidden"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  item={item}
                  active={isActive(location.pathname, item.href)}
                  onClick={() => setOpen(false)}
                />
              ))}
            </div>

            <Link
              to={ASSESSMENT_LINK}
              onClick={() => setOpen(false)}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#93C572] px-5 py-3 text-center text-sm font-black text-[#07110A] transition hover:bg-[#A4D08A]"
            >
              Get Your Plan
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
