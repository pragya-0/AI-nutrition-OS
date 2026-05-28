"use client";

import Image from "next/image";
import {
  ArrowRight,
  Brain,
  ChevronDown,
  Globe,
  Leaf,
  Lock,
  Mail,
  PlayCircle,
  Send,
  ShieldCheck,
} from "lucide-react";

const footerColumns = [
  {
    title: "Product",
    links: ["AI Dashboard", "Meal Plans", "Smart Food Scanner", "Progress Tracking", "AI Coach"],
  },
  {
    title: "Solutions",
    links: ["Weight Loss", "Muscle Gain", "Diabetes Friendly", "PCOS Support", "Vegetarian & Vegan"],
  },
  {
    title: "Resources",
    links: ["Blog", "Nutrition Guides", "Recipes", "Research & Studies", "Help Center"],
  },
  {
    title: "Company",
    links: ["About Us", "Our Mission", "Careers", "Partner With Us", "Press & Media"],
  },
  {
    title: "Support",
    links: ["Contact Us", "FAQs", "Terms of Service", "Privacy Policy", "Refund Policy"],
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "AI-Powered & Science Backed",
    text: "Advanced AI with proven nutrition science",
  },
  {
    icon: Leaf,
    title: "Made for Indian Lifestyles",
    text: "Cultural foods, real preferences, real results",
  },
  {
    icon: Lock,
    title: "100% Safe & Private",
    text: "Your data is secure and never shared",
  },
];

export default function FooterSection() {
  return (
    <footer className="relative overflow-visible bg-[#030805] pb-28 pt-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_0%,rgba(166,255,0,0.075),transparent_38%),radial-gradient(circle_at_92%_48%,rgba(0,255,200,0.07),transparent_30%)]" />

      <div className="relative ml-auto mr-0 w-full max-w-[1380px] translate-x-[70px] px-6 sm:px-8 lg:px-10 xl:translate-x-[90px] 2xl:translate-x-[110px]">
        {/* CTA PANEL */}
        <div className="relative overflow-hidden rounded-[28px] border border-[#9DFF0024] bg-[#07110C]/72 px-7 py-8 shadow-[0_0_70px_rgba(166,255,0,0.07)] backdrop-blur-xl lg:px-12 lg:py-8">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,rgba(166,255,0,0.1),transparent_70%)] opacity-40" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-[linear-gradient(110deg,transparent,rgba(166,255,0,0.07),transparent)] opacity-30" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[80px_275px_1fr_400px] lg:gap-8">
            <div className="hidden justify-start lg:flex">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#A6FF0030] bg-[#A6FF0008] shadow-[0_0_30px_rgba(166,255,0,0.12)]">
                <div className="absolute inset-6 rounded-full border border-[#A6FF0060]" />
                <div className="absolute h-[2px] w-40 rotate-[-8deg] rounded-full bg-[#A6FF0040]" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(166,255,0,0.1),transparent_62%)]" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#A6FF0012] shadow-[0_0_26px_rgba(166,255,0,0.2)]">
                  <Leaf className="h-8 w-8 text-[#A6FF00]" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="max-w-[275px] text-[31px] font-black leading-[1.08] tracking-[-0.05em] text-[#F5F8F2] sm:text-[35px] xl:text-[39px]">
                Your health journey starts with{" "}
                <span className="text-[#A6FF00]">one step.</span>
              </h2>
              <p className="mt-4 max-w-[275px] text-[15px] leading-7 text-white/68">
                Join thousands of Indians who are already transforming their lives with NutriAI.
              </p>
            </div>

            <div className="space-y-7 border-y border-[#A6FF001A] py-7 lg:border-x lg:border-y-0 lg:px-10 lg:py-0">
              {features.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A6FF0010] shadow-[0_0_24px_rgba(166,255,0,0.1)]">
                    <item.icon className="h-5 w-5 text-[#A6FF00]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold leading-none text-[#F5F8F2]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-5 text-white/64">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-[400px] justify-self-end">
              <h3 className="text-[24px] font-black tracking-[-0.04em] text-[#F5F8F2]">
                Ready to transform?
              </h3>
              <p className="mt-3 text-[15px] text-white/74">
                Get your personalized nutrition plan now!
              </p>

              <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-[13px] bg-[#A6FF00] px-5 py-3 text-[15px] font-black text-black shadow-[0_0_26px_rgba(166,255,0,0.22)] transition hover:scale-[1.01]">
                Start Your Free Assessment
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[#A6FF00]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              <button className="mt-3 flex w-full items-center justify-center gap-3 rounded-[13px] border border-[#A6FF0030] bg-black/20 px-5 py-3 text-[14px] font-bold text-white/85 transition hover:border-[#A6FF0060] hover:bg-[#A6FF0008]">
                <PlayCircle className="h-4 w-4" />
                Watch Demo (90 Seconds)
              </button>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {["/assets/avatar-1.png", "/assets/avatar-2.png", "/assets/avatar-3.png"].map(
                    (src) => (
                      <Image
                        key={src}
                        src={src}
                        alt="NutriAI user"
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border-2 border-[#07110C] object-cover"
                      />
                    ),
                  )}
                </div>
                <p className="text-[14px] text-white/68">
                  Loved by 50,000+ users <span className="ml-1 text-[#A6FF00]">♥</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER GRID */}
        <div className="ml-auto grid w-full max-w-[1220px] gap-10 border-b border-[#A6FF001A] pb-14 pt-20 lg:grid-cols-[0.82fr_0.82fr_0.92fr_0.88fr_0.88fr_0.88fr_1.55fr]">
          <div className="pb-2">
            <div className="flex items-center gap-3">
              <Brain className="h-9 w-9 text-[#A6FF00]" />
              <h3 className="text-[30px] font-black tracking-[-0.04em]">
                Nutri<span className="text-[#A6FF00]">AI</span>
              </h3>
            </div>

            <p className="mt-2 text-[15px] font-medium text-[#C7FF7A]">
              AI-Powered Nutrition Engine
            </p>

            <p className="mt-7 max-w-[210px] text-[15px] leading-8 text-white/64">
              AI nutrition built for Indian lifestyles. Personalized plans, smart tracking and real
              results — all in one place.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="pb-2">
              <h4 className="text-[13px] font-black uppercase tracking-[0.13em] text-[#A6FF00]">
                {column.title}
              </h4>
              <div className="mt-4 h-[2px] w-6 bg-[#A6FF00]" />

              <ul className="mt-7 space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[15px] leading-6 text-white/70 transition hover:text-[#A6FF00]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="max-w-[340px] border-l border-[#A6FF001A] pb-2 pl-10">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-cyan-400/60 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <Mail className="h-7 w-7" />
            </div>

            <h4 className="mt-5 text-[24px] font-black text-[#A6FF00]">Stay Updated</h4>
            <p className="mt-3 text-[14px] leading-6 text-white/65">
              Get tips, recipes and updates straight to your inbox.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              className="mt-5 w-full rounded-[11px] border border-[#A6FF0024] bg-[#07110C] px-4 py-3.5 text-[14px] text-white outline-none placeholder:text-white/50 focus:border-[#A6FF0070]"
            />

            <button className="mt-3 flex w-full items-center justify-center gap-3 rounded-[11px] bg-[#A6FF00] px-5 py-3.5 text-[15px] font-black text-black shadow-[0_0_26px_rgba(166,255,0,0.22)]">
              Subscribe
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="ml-auto flex w-full max-w-[1220px] flex-col gap-6 pb-2 pt-9 text-[14px] text-white/58 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2025 NutriAI. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-7">
            <span className="flex items-center gap-3">
              <Lock className="h-5 w-5" />
              Secure & Encrypted
            </span>
            <span className="hidden h-5 w-px bg-white/14 md:block" />
            <span className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              HIPAA Compliant
            </span>
            <span className="hidden h-5 w-px bg-white/14 md:block" />
            <span className="flex items-center gap-3">Made in India 🇮🇳</span>
          </div>

          <button className="flex w-full items-center justify-between rounded-[12px] border border-white/20 px-5 py-3 text-white/70 lg:w-[190px]">
            <span className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              English
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}