"use client";

import Image from "next/image";

const scannerFeatures = [
  {
    title: "AI Food Recognition",
    desc: "Advanced computer vision identifies food with high accuracy.",
    icon: "▣",
  },
  {
    title: "Instant Nutrition Breakdown",
    desc: "Get calories, macros, vitamins & minerals in seconds.",
    icon: "◔",
  },
  {
    title: "AI-Powered Insights",
    desc: "Understand meal quality and how it fits your daily goals.",
    icon: "✺",
  },
  {
    title: "Smarter Suggestions",
    desc: "Get healthier swaps and portion recommendations.",
    icon: "♧",
  },
];

const macroStats = [
  {
    label: "Protein",
    value: "38g",
    percent: "29%",
    color: "border-[#A6FF4D] text-[#A6FF4D]",
  },
  {
    label: "Carbs",
    value: "72g",
    percent: "45%",
    color: "border-[#18D3D0] text-[#18D3D0]",
  },
  {
    label: "Fats",
    value: "18g",
    percent: "26%",
    color: "border-[#FF9F2E] text-[#FF9F2E]",
  },
];

export default function FoodScannerSection() {
  return (
<section className="relative overflow-hidden bg-[#030805] pb-52 pt-24 text-[#F5F8F2] lg:pb-60 lg:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_43%_50%,rgba(166,255,77,0.08),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(24,211,208,0.045),transparent_28%)]" />
      <div className="absolute left-[31%] top-[24%] h-[560px] w-[560px] rounded-full border border-[#A6FF4D]/[0.03]" />
      <div className="absolute left-[35%] top-[31%] h-[430px] w-[430px] rounded-full border border-[#A6FF4D]/[0.035]" />
      <div className="absolute bottom-0 left-0 h-[220px] w-[680px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(166,255,77,0.12),transparent_60%)]" />

      <Image
        src="/assets/leaves2.png"
        alt="Leaves"
        width={360}
        height={360}
        className="pointer-events-none absolute -right-5 top-0 z-0 hidden opacity-70 lg:block"
      />

   

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-8 sm:px-10 lg:px-12 xl:px-16">
       <div className="grid items-center gap-14 pt-24 lg:grid-cols-[36px_380px_320px_minmax(460px,520px)] xl:grid-cols-[48px_395px_335px_minmax(500px,560px)] xl:gap-12">
          <div className="hidden lg:block" />
          {/* LEFT CONTENT */}
       <div className="relative z-20 min-w-0">
            <div className="mb-7 inline-flex items-center gap-2 rounded-xl border border-[#A6FF4D]/20 bg-[#07140B]/80 px-4 py-2 text-xs font-black tracking-wide text-[#A6FF4D] shadow-[0_0_40px_rgba(166,255,77,0.08)] backdrop-blur-xl">
              <span className="text-base">⌘</span>
              SMART FOOD SCANNER
            </div>

            <h2 className="max-w-[450px] text-[40px] font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-[46px] lg:text-[48px] xl:text-[45px]">
              Scan. Detect.
              <br />
              Understand. <span className="text-[#A6FF4D]">Eat Smart.</span>
            </h2>

            <p className="mt-6 max-w-[430px] text-[17px] leading-[1.75] text-white/70">
              Just click a photo of your food and our AI instantly identifies
              the dish, calculates calories, macros, and provides smarter
              choices for your goals.
            </p>

            <div className="mt-8 space-y-5">
              {scannerFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-5">
                  <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-3xl border border-[#A6FF4D]/15 bg-[#07140B]/80 text-3xl font-black text-[#A6FF4D] shadow-[0_0_38px_rgba(166,255,77,0.08)] backdrop-blur-xl">
                    {feature.icon}
                  </div>

                  <div className="pt-1">
                    <h3 className="text-[19px] font-black leading-tight text-white xl:text-[20px]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 max-w-[360px] text-[14px] leading-6 text-white/62 xl:text-[15px]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-11 flex flex-wrap items-center gap-7">
              <button className="group inline-flex items-center gap-5 rounded-2xl bg-[#B6FF3B] px-8 py-5 text-[17px] font-black text-[#071008] shadow-[0_18px_60px_rgba(166,255,77,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(166,255,77,0.28)]">
                Try Scanner Now
                <span className="text-2xl leading-none transition group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button className="inline-flex items-center gap-4 text-[17px] font-semibold text-white/88 transition hover:text-white">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#B6FF3B]/50 bg-[#07140B]/85 text-[#B6FF3B] shadow-[0_0_36px_rgba(166,255,77,0.12)]">
                  ▶
                </span>
                See How It Works
              </button>
            </div>
          </div>

          {/* CENTER PHONE */}
          <div className="relative flex min-h-[200px] items-center justify-center">
            <div className="absolute h-[560px] w-[560px] rounded-full bg-[#A6FF4D]/[0.035] blur-[130px]" />
            <div className="absolute h-[560px] w-[560px] rounded-full border border-[#A6FF4D]/[0.03]" />
            <div className="absolute h-[430px] w-[430px] rounded-full border border-[#A6FF4D]/[0.035]" />
            <div className="absolute h-[320px] w-[320px] rounded-full border border-[#A6FF4D]/[0.04]" />

            <Image
              src="/assets/scanner-phone2.png"
              alt="Scanner Phone"
              width={500}
              height={940}
              className="relative z-10 h-auto w-full max-w-[270px] object-contain drop-shadow-[0_0_55px_rgba(166,255,77,0.24)] xl:max-w-[290px]"
              priority
            />

            <div className="absolute bottom-6 z-20 hidden w-[360px] rounded-2xl border border-[#A6FF4D]/15 bg-[#06120B]/82 px-6 py-4 shadow-[0_0_80px_rgba(166,255,77,0.08)] backdrop-blur-xl md:block">
              <p className="font-black text-[#A6FF4D]">💡 Scanning Tips</p>
              <p className="mt-1 text-sm text-white/68">
                Good lighting&nbsp; • &nbsp;Clear view&nbsp; • &nbsp;Single dish in frame
              </p>
            </div>
          </div>

          {/* RIGHT ANALYTICS */}
          <div className="relative z-30 min-w-0 max-w-[560px] justify-self-start space-y-4 pt-2">
            <div className="min-w-0 rounded-[24px] border border-[#A6FF4D]/15 bg-[#06120B]/72 p-5 shadow-[0_0_70px_rgba(166,255,77,0.04)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[18px] font-bold text-white">Detected Food</p>
                  <div className="mt-3 flex items-center gap-3">
                    <h3 className="text-[25px] font-black leading-tight text-[#A6FF4D] xl:text-[28px]">
                      Bengali Style Fish Curry
                    </h3>
                    <span className="text-[#A6FF4D]">✹</span>
                  </div>
                  <p className="mt-2 text-[15px] text-white/64">
                    Hilsa fish, Rice, Potato curry, Salad
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-[#A6FF4D]/20 bg-[#09170C]/80 px-5 py-4 text-center">
                  <p className="text-2xl font-black leading-none text-[#A6FF4D]">
                    90%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#A6FF4D]">
                    Accuracy
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1.1fr_1fr_1fr_1fr] items-center gap-4 rounded-[20px] border border-[#A6FF4D]/10 bg-white/[0.025] px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-white/78">Calories</p>
                  <p className="mt-3 text-[28px] font-black leading-none text-white">
                    650 <span className="text-base font-bold text-white/70">kcal</span>
                  </p>
                  <p className="mt-3 text-sm text-white/55">1 serving (350g)</p>
                </div>

                {macroStats.map((macro) => (
                  <div key={macro.label} className="flex flex-col items-center gap-2">
                    <p className="text-sm font-semibold text-white/80">{macro.label}</p>
                    <div
                      className={`flex h-[74px] w-[74px] items-center justify-center rounded-full border-[5px] bg-[#07120B] ${macro.color}`}
                    >
                      <div className="text-center">
                        <p className="text-xl font-black leading-none text-white">
                          {macro.value}
                        </p>
                        <p className={`mt-1 text-xs font-black ${macro.color.split(" ")[1]}`}>
                          {macro.percent}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid overflow-hidden rounded-[22px] border border-[#A6FF4D]/10 md:grid-cols-[1.35fr_0.9fr]">
                <div className="p-5">
                  <h4 className="text-lg font-black text-white">Nutrition Facts</h4>
                  <div className="mt-4 grid grid-cols-2 gap-x-7 gap-y-3 text-[14px] text-white/65">
                    <p className="flex justify-between gap-6">
                      <span>Fiber</span>
                      <span>5.6g</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>Cholesterol</span>
                      <span>85mg</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>Sugar</span>
                      <span>3.2g</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>Calcium</span>
                      <span>48mg</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>Sodium</span>
                      <span>620mg</span>
                    </p>
                    <p className="flex justify-between gap-6">
                      <span>Iron</span>
                      <span>2.1mg</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-t border-[#A6FF4D]/10 p-5 md:border-l md:border-t-0">
                  <h4 className="text-lg font-black text-white">Quality Score</h4>
                  <div className="mt-4 flex h-24 w-24 items-center justify-center rounded-full border-[7px] border-[#A6FF4D] bg-[#08120B] shadow-[0_0_35px_rgba(166,255,77,0.14)]">
                    <div className="text-center">
                      <p className="text-[34px] font-black leading-none text-white">82</p>
                      <p className="mt-1 text-sm text-white/60">/100</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-black text-[#A6FF4D]">Good</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="min-h-[140px] rounded-[22px] border border-[#A6FF4D]/15 bg-[#06120B]/72 p-4 backdrop-blur-xl">
                <h4 className="text-[17px] font-black text-[#A6FF4D]">
                  ✨ AI Insights
                </h4>
                <p className="mt-4 text-[14px] leading-6 text-white/65">
                  Great choice! This meal is high in protein and provides
                  balanced macros.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#A6FF4D]/25 px-3 py-1 text-xs font-bold text-[#A6FF4D]">
                    High Protein
                  </span>
                  <span className="rounded-full border border-[#18D3D0]/25 px-3 py-1 text-xs font-bold text-[#18D3D0]">
                    Good Omega-3
                  </span>
                  <span className="rounded-full border border-[#FFB02E]/25 px-3 py-1 text-xs font-bold text-[#FFB02E]">
                    Moderate Carb
                  </span>
                </div>
              </div>

              <div className="min-h-[140px] rounded-[22px] border border-[#A6FF4D]/15 bg-[#06120B]/72 p-4 backdrop-blur-xl">
                <h4 className="text-[17px] font-black text-white">
                  ♡ Better Alternatives
                </h4>
                <div className="mt-5 flex items-center gap-4">
                  <Image
                    src="/assets/fish-meal.png"
                    alt="Grilled fish with brown rice"
                    width={78}
                    height={78}
                    className="h-[78px] w-[78px] rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold leading-5 text-white">
                      Grilled Fish
                      <br />
                      with Brown Rice
                    </p>
                    <p className="mt-2 text-sm font-black text-[#A6FF4D]">
                      520 kcal
                    </p>
                  </div>
                  <span className="ml-auto text-2xl text-white/70">›</span>
                </div>
              </div>
            </div>

            <div className="relative z-40 flex items-center gap-4 rounded-[22px] border border-[#A6FF4D]/15 bg-[#06120B]/72 p-4 backdrop-blur-xl">
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#A6FF4D]/10 text-3xl md:flex">
                🤖
              </div>
              <div>
                <h4 className="text-[17px] font-black text-[#A6FF4D]">
                  AI Recommendation
                </h4>
                <p className="mt-2 text-[14px] leading-6 text-white/65">
                  Try adding more vegetables to improve fiber intake. A side of
                  salad or steamed veggies would be perfect!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
