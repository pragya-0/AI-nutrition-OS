"use client";

import Image from "@/compat/NextImage";
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
    links: [
      "AI Dashboard",
      "Meal Plans",
      "Smart Food Scanner",
      "Progress Tracking",
      "AI Coach",
    ],
  },
  {
    title: "Solutions",
    links: [
      "Weight Loss",
      "Muscle Gain",
      "Diabetes Friendly",
      "PCOS Support",
      "Vegetarian & Vegan",
    ],
  },
  {
    title: "Resources",
    links: [
      "Blog",
      "Nutrition Guides",
      "Recipes",
      "Research & Studies",
      "Help Center",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Our Mission",
      "Careers",
      "Partner With Us",
      "Press & Media",
    ],
  },
  {
    title: "Support",
    links: [
      "Contact Us",
      "FAQs",
      "Terms of Service",
      "Privacy Policy",
      "Refund Policy",
    ],
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
    <footer className="relative overflow-visible bg-[#030805] px-4 pb-16 pt-12 text-white sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_0%,rgba(166,255,0,0.075),transparent_38%),radial-gradient(circle_at_92%_48%,rgba(0,255,200,0.07),transparent_30%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[92vw] 2xl:max-w-[1780px]">
        {/* CTA PANEL */}
        <div className="relative overflow-hidden rounded-[32px] border border-[#9DFF0024] bg-[#07110C]/72 px-5 py-6 shadow-[0_0_70px_rgba(166,255,0,0.07)] backdrop-blur-xl sm:px-6 lg:px-8 lg:py-8 xl:px-10">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,rgba(166,255,0,0.1),transparent_70%)] opacity-40" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-[linear-gradient(110deg,transparent,rgba(166,255,0,0.07),transparent)] opacity-30" />

          <div className="relative grid items-center gap-8 xl:grid-cols-[120px_0.9fr_1.25fr_0.95fr] xl:gap-10 2xl:gap-12">
            <div className="hidden justify-start xl:flex">
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
              <h2 className="max-w-[520px] text-[40px] font-black leading-[1.05] tracking-[-0.05em] text-[#F5F8F2] sm:text-[52px] lg:text-[56px] xl:text-[62px] 2xl:text-[68px]">
                Your health journey starts with{" "}
                <span className="text-[#A6FF00]">one step.</span>
              </h2>

              <p className="mt-4 max-w-[520px] text-[18px] leading-8 text-white/68 xl:text-[19px]">
                Join thousands of Indians who are already transforming their
                lives with NutriAI.
              </p>
            </div>

            <div className="space-y-6 border-y border-[#A6FF001A] py-7 xl:border-x xl:border-y-0 xl:px-8 xl:py-0">
              {features.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#A6FF0010] shadow-[0_0_24px_rgba(166,255,0,0.1)]">
                    <item.icon className="h-5 w-5 text-[#A6FF00]" />
                  </div>

                  <div>
                    <h3 className="text-[16px] font-bold leading-tight text-[#F5F8F2]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-[15px] leading-6 text-white/64">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-[460px] xl:justify-self-end">
              <h3 className="text-[28px] font-black tracking-[-0.04em] text-[#F5F8F2] xl:text-[32px]">
                Ready to transform?
              </h3>

              <p className="mt-3 text-[16px] text-white/74">
                Get your personalized nutrition plan now!
              </p>

              <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-[14px] bg-[#A6FF00] px-5 py-3.5 text-[16px] font-black text-black shadow-[0_0_26px_rgba(166,255,0,0.22)] transition hover:scale-[1.01]">
                Start Your Free Assessment

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[#A6FF00]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              <button className="mt-3 flex w-full items-center justify-center gap-3 rounded-[14px] border border-[#A6FF0030] bg-black/20 px-5 py-3.5 text-[15px] font-bold text-white/85 transition hover:border-[#A6FF0060] hover:bg-[#A6FF0008]">
                <PlayCircle className="h-4 w-4" />
                Watch Demo (90 Seconds)
              </button>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    "/assets/avatar-1.png",
                    "/assets/avatar-2.png",
                    "/assets/avatar-3.png",
                  ].map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt="NutriAI user"
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full border-2 border-[#07110C] object-cover"
                    />
                  ))}
                </div>

                <p className="text-[15px] text-white/68">
                  Loved by 50,000+ users{" "}
                  <span className="ml-1 text-[#A6FF00]">♥</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER GRID */}
        <div className="grid w-full gap-10 border-b border-[#A6FF001A] pb-10 pt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1.6fr]">
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

            <p className="mt-7 max-w-[260px] text-[15px] leading-8 text-white/64">
              AI nutrition built for Indian lifestyles. Personalized plans,
              smart tracking and real results — all in one place.
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

          <div className="max-w-[460px] border-[#A6FF001A] pb-2 xl:border-l xl:pl-10">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-cyan-400/60 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <Mail className="h-7 w-7" />
            </div>

            <h4 className="mt-5 text-[26px] font-black text-[#A6FF00]">
              Stay Updated
            </h4>

            <p className="mt-3 text-[15px] leading-6 text-white/65">
              Get tips, recipes and updates straight to your inbox.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              className="mt-5 w-full rounded-[12px] border border-[#A6FF0024] bg-[#07110C] px-4 py-3.5 text-[14px] text-white outline-none placeholder:text-white/50 focus:border-[#A6FF0070]"
            />

            <button className="mt-3 flex w-full items-center justify-center gap-3 rounded-[12px] bg-[#A6FF00] px-5 py-3.5 text-[15px] font-black text-black shadow-[0_0_26px_rgba(166,255,0,0.22)]">
              Subscribe
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 pb-0 pt-6 text-[14px] text-white/58 lg:flex-row lg:items-center lg:justify-between">
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