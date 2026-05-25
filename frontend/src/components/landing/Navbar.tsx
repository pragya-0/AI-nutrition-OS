"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  "Home",
  "Features",
  "Nutrition",
  "Pricing",
  "Contact",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
  <header className="sticky left-0 top-0 z-50 w-full px-4 py-3">
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/10 bg-[#061009]/75 px-5 py-3 shadow-[0_20px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:px-7">
        {/* LOGO */}
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="NutriAI logo"
            width={46}
            height={46}
            priority
            className="rounded-full"
          />

          <div className="leading-none">
            <p className="text-xl font-black tracking-tight text-[#F5F8F2]">
              NutriAI
            </p>

            <p className="mt-1 text-[11px] font-medium tracking-[0.25em] text-[#A3B3A3] uppercase">
              AI Health OS
            </p>
          </div>
        </a>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 md:flex">
          {navItems.map((item, index) => (
            <a
              key={item}
              href={index === 0 ? "#" : `#${item.toLowerCase()}`}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                index === 0
                  ? "bg-[#A6FF4D] text-[#07110A] shadow-[0_0_25px_rgba(166,255,77,0.18)]"
                  : "text-[#A3B3A3] hover:bg-white/10 hover:text-[#F5F8F2]"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#login"
            className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-[#F5F8F2] transition hover:border-[#A6FF4D]/40 hover:bg-white/[0.04]"
          >
            Login
          </a>

          <a
            href="#assessment"
            className="rounded-full bg-[#A6FF4D] px-6 py-2.5 text-sm font-black text-[#07110A] shadow-[0_0_40px_rgba(166,255,77,0.28)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(166,255,77,0.45)]"
          >
            Get Started
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-[#F5F8F2] transition hover:border-[#A6FF4D]/30 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-4 max-w-[1400px] overflow-hidden rounded-[32px] border border-white/10 bg-[#061009]/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href={index === 0 ? "#" : `#${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    index === 0
                      ? "bg-[#A6FF4D] text-[#07110A]"
                      : "text-[#A3B3A3] hover:bg-white/10 hover:text-[#F5F8F2]"
                  }`}
                >
                  {item}
                </a>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <a
                  href="#login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-[#F5F8F2]"
                >
                  Login
                </a>

                <a
                  href="#assessment"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-[#A6FF4D] px-5 py-3 text-center text-sm font-black text-[#07110A]"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}