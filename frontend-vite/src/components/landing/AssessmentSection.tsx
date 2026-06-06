"use client";

import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Utensils,
} from "lucide-react";

const ONBOARDING_LINK = "/dashboard/onboarding";

const steps = [
  {
    title: "Profile",
    text: "Age, height, weight, gender, city, and body metrics.",
    icon: User,
  },
  {
    title: "Lifestyle",
    text: "Activity level, sleep routine, hydration, and fitness level.",
    icon: Activity,
  },
  {
    title: "Diet",
    text: "Goal, cuisine, diet preference, and meal duration.",
    icon: Utensils,
  },
  {
    title: "Safety",
    text: "Medical guardrails, pregnancy check, and wellness-only consent.",
    icon: ShieldCheck,
  },
];

const floatingItems = [
  { label: "Your Goals", icon: Target, className: "left-[25px] top-[205px]" },
  { label: "Your Activity", icon: Activity, className: "right-[40px] top-[120px]" },
  { label: "Your Preferences", icon: Utensils, className: "right-[-30px] top-[250px]" },
  { label: "Your Profile", icon: User, className: "left-[-10px] bottom-[120px]" },
  { label: "Your Health", icon: HeartPulse, className: "right-[30px] bottom-[60px]" },
];

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-[#9DFF16]/15 bg-[#06110A]/75 shadow-[0_0_28px_rgba(157,255,22,0.055)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function FloatingIcon({
  icon: Icon,
  label,
  className,
}: {
  icon: React.ElementType;
  label: string;
  className: string;
}) {
  return (
    <div className={`absolute z-20 flex flex-col items-center gap-1.5 ${className}`}>
      <div className="grid h-[58px] w-[58px] place-items-center rounded-full border border-[#9DFF16]/45 bg-[#06110A]/70 shadow-[0_0_20px_rgba(157,255,22,0.18)] backdrop-blur-xl">
        <Icon className="h-6 w-6 text-[#9DFF16]" />
      </div>
      <p className="whitespace-nowrap text-[13px] font-medium text-white/72">
        {label}
      </p>
    </div>
  );
}

export default function AssessmentSection() {
  return (
    <section
      id="assessment-preview"
      className="relative scroll-mt-28 overflow-hidden bg-[#030805] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-14 xl:px-10 2xl:px-12"
    >
      <div className="absolute left-[18%] top-[54%] h-[34vw] max-h-[520px] min-h-[300px] w-[34vw] min-w-[300px] max-w-[520px] rounded-full bg-[#9DFF16]/[0.055] blur-[140px]" />
      <div className="absolute right-[8%] top-[52%] h-[40vw] max-h-[640px] min-h-[340px] w-[40vw] min-w-[340px] max-w-[640px] rounded-full bg-[#9DFF16]/[0.045] blur-[160px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[92vw] items-start gap-10 xl:grid-cols-[0.9fr_1.15fr] xl:gap-10 2xl:max-w-[1780px] 2xl:gap-12">
        <div className="relative min-h-[640px] pt-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#9DFF16]/20 bg-[#07120B]/80 px-5 py-2.5 text-[12px] font-bold text-[#9DFF16] sm:text-[13px]">
            <User className="h-4 w-4" />
            PERSONAL START
          </div>

          <h2 className="mt-7 max-w-[720px] text-[44px] font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-[56px] lg:text-[64px] xl:text-[70px] 2xl:text-[80px]">
            Let’s Build Your
            <br />
            <span className="text-[#9DFF16]">Perfect Nutrition Plan</span>
          </h2>

          <p className="mt-6 max-w-[680px] text-[18px] leading-8 text-white/68 lg:text-[20px] xl:text-[21px]">
            Start with your profile, lifestyle, diet, and safety details. Then AI
            Nutrition OS generates your plan and unlocks your dashboard.
          </p>

          <div className="relative mt-0 h-[520px]">
            <img
              src="/assets/assessment/orbit.png"
              alt=""
              className="absolute left-[10px] top-[55px] h-[34vw] max-h-[560px] min-h-[420px] w-[38vw] min-w-[480px] max-w-[650px] object-contain opacity-75"
            />
            <img
              src="/assets/assessment/girl.png"
              alt="Fitness woman using phone"
              className="absolute bottom-[-50px] left-[60px] z-10 h-[42vw] max-h-[680px] min-h-[520px] w-auto object-contain"
            />

            {floatingItems.map((item) => (
              <FloatingIcon
                key={item.label}
                icon={item.icon}
                label={item.label}
                className={item.className}
              />
            ))}
          </div>

          <GlassCard className="relative z-30 ml-0 mt-8 flex max-w-[560px] items-center gap-4 px-6 py-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#9DFF16]/10">
              <img
                src="/assets/assessment/ai-brain-icon.png"
                alt=""
                className="h-[54px] w-[54px] object-contain"
              />
            </div>
            <p className="text-[17px] leading-7 text-white/85 xl:text-[18px]">
              Built for <span className="font-black text-[#9DFF16]">real user input</span>
              <br />
              <span className="text-[15px] text-white/65 xl:text-[16px]">
                No landing-page button generates a plan without profile
                confirmation.
              </span>
            </p>
          </GlassCard>
        </div>

        <GlassCard className="mt-0 w-full max-w-none px-5 py-6 sm:px-6 lg:px-7 xl:px-8 xl:py-7">
          <div className="mb-6 border-b border-white/10 pb-6">
            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#9DFF16]">
              Assessment Preview
            </p>
            <h3 className="mt-3 text-[34px] font-black tracking-[-0.05em] text-white sm:text-[42px] lg:text-[50px]">
              Your plan starts after onboarding.
            </h3>
            <p className="mt-4 max-w-[780px] text-[16px] leading-8 text-white/65">
              For better safety and cleaner SaaS UX, plan generation now happens
              inside the dashboard onboarding flow — not inside the landing page.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-[22px] border border-white/10 bg-[#07120B]/85 p-5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#9DFF16]/20 bg-[#9DFF16]/10 text-[#9DFF16]">
                  <step.icon size={22} />
                </div>

                <h4 className="text-[18px] font-black text-white">
                  {step.title}
                </h4>
                <p className="mt-2 text-[14px] leading-6 text-white/60">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-[#FFB347]/25 bg-[#2A1A05]/45 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#FFB347]" />
                <p className="text-[14px] font-semibold leading-7 text-white/72">
                  AI Nutrition OS provides general wellness guidance only. It is
                  not medical advice, diagnosis, treatment, emergency care, or
                  professional dietary counselling.
                </p>
              </div>

              <Link
                to="/disclaimer"
                className="inline-flex w-fit shrink-0 rounded-2xl border border-[#FFB347]/30 px-5 py-3 text-[13px] font-black text-[#FFB347]"
              >
                Read Disclaimer
              </Link>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to={ONBOARDING_LINK}
              className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-[#9DFF16] px-8 py-4 text-[16px] font-black text-[#07110A] shadow-[0_0_34px_rgba(157,255,22,0.22)] transition hover:scale-[1.01]"
            >
              Start Dashboard Onboarding
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-8 py-4 text-[16px] font-black text-white/85 transition hover:border-[#9DFF16]/35"
            >
              View Dashboard
              <Sparkles size={19} />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#9DFF16]/15 bg-[#9DFF16]/5 px-4 py-4">
              <p className="text-[24px] font-black text-[#9DFF16]">1</p>
              <p className="mt-1 text-[13px] font-semibold text-white/65">
                Confirm profile
              </p>
            </div>

            <div className="rounded-2xl border border-[#18D3D0]/15 bg-[#18D3D0]/5 px-4 py-4">
              <p className="text-[24px] font-black text-[#18D3D0]">2</p>
              <p className="mt-1 text-[13px] font-semibold text-white/65">
                Generate plan
              </p>
            </div>

            <div className="rounded-2xl border border-[#FFB347]/20 bg-[#2A1A05]/45 px-4 py-4">
              <p className="text-[24px] font-black text-[#FFB347]">3</p>
              <p className="mt-1 text-[13px] font-semibold text-white/65">
                Unlock dashboard
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}