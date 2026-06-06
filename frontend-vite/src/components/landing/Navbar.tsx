"use client";

import { Link } from "react-router-dom";
import Image from "@/compat/NextImage";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ASSESSMENT_LINK = "/dashboard/onboarding";

const navItems = [
  { label: "Home", href: "/#home", type: "anchor" },
  { label: "Features", href: "/#features", type: "anchor" },
  { label: "Scanner", href: "/scanner", type: "route" },
  { label: "Assessment", href: ASSESSMENT_LINK, type: "route" },
  { label: "Dashboard", href: "/dashboard", type: "route" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky left-0 top-0 z-50 w-full px-4 py-3">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/10 bg-[#061009]/78 px-5 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.38)] backdrop-blur-2xl md:px-7">
        <Link to="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="NutriAI logo"
            width={46}
            height={46}
            priority
            className="rounded-full"
          />
          <div className="leading-none">
            <p className="text-xl font-black tracking-tight text-[#F5F8F2]">NutriAI</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-[#A3B3A3]">
              AI Health OS
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1.5 md:flex">
          {navItems.map((item) =>
            item.type === "route" ? (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#A3B3A3] transition-all duration-300 hover:bg-white/10 hover:text-[#F5F8F2]"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#A3B3A3] transition-all duration-300 hover:bg-white/10 hover:text-[#F5F8F2]"
              >
                {item.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to={ASSESSMENT_LINK}
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-[#F5F8F2] transition hover:border-[#93C572]/35 hover:bg-white/[0.045]"
          >
            Start Assessment
          </Link>

          <Link
            to={ASSESSMENT_LINK}
            className="rounded-full bg-[#93C572] px-6 py-2.5 text-sm font-black text-[#07110A] shadow-[0_0_24px_rgba(147,197,114,0.14)] transition-all duration-300 hover:scale-105 hover:bg-[#A4D08A] hover:shadow-[0_0_30px_rgba(147,197,114,0.18)]"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-[#F5F8F2] transition hover:border-[#93C572]/30 md:hidden"
          aria-label="Toggle menu"
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
            className="mx-auto mt-4 max-w-[1400px] overflow-hidden rounded-[32px] border border-white/10 bg-[#061009]/95 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) =>
                item.type === "route" ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#A3B3A3] transition hover:bg-white/10 hover:text-[#F5F8F2]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#A3B3A3] transition hover:bg-white/10 hover:text-[#F5F8F2]"
                  >
                    {item.label}
                  </a>
                ),
              )}

              <Link
                to={ASSESSMENT_LINK}
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-[#93C572] px-5 py-3 text-center text-sm font-black text-[#07110A]"
              >
                Get Your Plan
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
