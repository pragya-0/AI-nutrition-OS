import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Database,
  Lock,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

const settings = [
  {
    title: "Account",
    description:
      "Login, registration, and authenticated profile storage should be added before public launch.",
    icon: User,
    status: "Coming soon",
  },
  {
    title: "Privacy Controls",
    description:
      "Users should be able to view, export, and delete profile, scan, plan, and progress data.",
    icon: Lock,
    status: "Required",
  },
  {
    title: "Consent",
    description:
      "Medical disclaimer and data-use consent should be versioned and stored server-side.",
    icon: ShieldCheck,
    status: "Required",
  },
  {
    title: "Database Persistence",
    description:
      "Replace localStorage with user-scoped backend records for plans, scans, logs, and settings.",
    icon: Database,
    status: "Required",
  },
  {
    title: "Notifications",
    description:
      "Meal reminders, hydration nudges, and weekly summaries can be added after core data is stable.",
    icon: Bell,
    status: "Later",
  },
  {
    title: "Delete Data",
    description:
      "Production release needs account deletion and data deletion flows.",
    icon: Trash2,
    status: "Required",
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#030805] px-4 py-5 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <section className="mx-auto max-w-[92vw] rounded-[32px] border border-[#18D3D0]/20 bg-[#020604]/95 px-5 py-7 shadow-[0_0_90px_rgba(24,211,208,0.08)] 2xl:max-w-[1780px]">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-[13px] font-black text-[#A6FF4D] transition hover:text-[#C6FF7B]"
        >
          <ArrowLeft size={17} />
          Back to Daily Dashboard
        </Link>

        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[#18D3D0]">
          Settings
        </p>

        <h1 className="mt-4 text-[42px] font-black leading-[0.95] tracking-[-0.06em] sm:text-[58px]">
          Production controls
          <br />
          <span className="text-[#18D3D0]">before public launch.</span>
        </h1>

        <p className="mt-5 max-w-[860px] text-[16px] font-semibold leading-7 text-white/65">
          This page is intentionally structured around launch readiness: auth, privacy, consent, data deletion, notification settings, and backend persistence.
        </p>

        <div className="mt-6 rounded-[24px] border border-[#FFB347]/25 bg-[#2A1A05]/45 p-5">
          <p className="text-[13px] font-black uppercase tracking-[0.18em] text-[#FFB347]">
            Public Launch Reminder
          </p>
          <p className="mt-2 text-[14px] font-semibold leading-6 text-white/70">
            localStorage is acceptable for development testing only. Public users need authenticated accounts, server-side consent records, data export, and deletion workflows.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon size={22} className="text-[#18D3D0]" />
                  <span className="rounded-full border border-[#18D3D0]/25 bg-[#18D3D0]/8 px-3 py-1 text-[11px] font-black text-[#18D3D0]">
                    {item.status}
                  </span>
                </div>

                <h2 className="mt-5 text-[20px] font-black text-white">
                  {item.title}
                </h2>

                <p className="mt-2 text-[14px] font-semibold leading-6 text-white/60">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
