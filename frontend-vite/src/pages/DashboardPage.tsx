import Hero from "@/components/Hero";

export default function DashboardPage() {
  const generatePlan = async () => {
    console.log("Dashboard API migration next");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030805] px-6 pb-24 pt-10 text-white md:px-10 xl:px-14">
      <div className="mx-auto max-w-[1440px]">
        <Hero onGenerate={generatePlan} loading={false} />
      </div>
    </main>
  );
}