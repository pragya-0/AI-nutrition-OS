import { Link } from "react-router-dom";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import AIHealthReport from "@/components/dashboard/AIHealthReport";

function PageHeader() {
  return (
    <section className="bg-[#030805] px-4 pt-5 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <div className="mx-auto max-w-[92vw] rounded-[28px] border border-[#93C572]/18 bg-[#061009]/95 px-5 py-6 shadow-[0_0_54px_rgba(147,197,114,0.06)] 2xl:max-w-[1780px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              to="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-[13px] font-black text-[#93C572] transition hover:text-[#A4D08A]"
            >
              <ArrowLeft size={17} />
              Back to Daily Dashboard
            </Link>

            <p className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.26em] text-[#18D3D0]">
              <FileText size={15} />
              Wellness Reports
            </p>

            <h1 className="mt-3 text-[40px] font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-[56px]">
              Weekly review,
              <br />
              <span className="text-[#93C572]">adherence and consistency.</span>
            </h1>

            <p className="mt-4 max-w-[860px] text-[16px] font-semibold leading-7 text-white/65">
              Reports explain nutrition consistency, goal alignment, progress logs, scan history, and plan quality. They avoid medical claims and use wellness-only language for public launch readiness.
            </p>
          </div>

          <Link
            to="/disclaimer"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl border border-[#F5B942]/25 bg-[#2A1A05]/45 px-5 py-3 text-[13px] font-black text-[#F5B942] transition hover:scale-[1.02]"
          >
            <ShieldCheck size={17} />
            Wellness Disclaimer
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-[#030805] text-white">
      <PageHeader />
      <AIHealthReport />
    </main>
  );
}
