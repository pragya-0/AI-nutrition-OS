"use client";

import Image from "@/compat/NextImage";

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
    <section className="relative overflow-hidden bg-[#030805] px-5 pb-6 pt-2 text-[#F5F8F2] sm:px-8 lg:px-14 lg:pt-3 xl:px-16 2xl:px-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_40%,rgba(166,255,77,0.18),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(24,211,208,0.045),transparent_28%)]" />

      <div className="pointer-events-none absolute left-[30%] top-[8%] h-[690px] w-[690px] rounded-full border border-[#A6FF4D]/[0.04]" />
      <div className="pointer-events-none absolute left-[35%] top-[20%] h-[520px] w-[520px] rounded-full border border-[#A6FF4D]/[0.045]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[180px] w-[680px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(166,255,77,0.12),transparent_60%)]" />

      {/* Decorations */}
      <Image
        src="/assets/leaves2.png"
        alt=""
        width={360}
        height={360}
        className="pointer-events-none absolute right-[20px] top-[10px] z-0 hidden w-[230px] rotate-[-8deg] opacity-75 lg:block"
      />

      <Image
        src="/assets/leaves2.png"
        alt=""
        width={320}
        height={320}
        className="pointer-events-none absolute right-[12px] top-[300px] z-0 hidden w-[200px] rotate-[18deg] opacity-70 lg:block"
      />

      <Image
        src="/assets/salad-bowl.png"
        alt=""
        width={420}
        height={420}
        className="pointer-events-none absolute bottom-[-150px] right-[-80px] z-0 hidden w-[235px] opacity-95 drop-shadow-[0_30px_70px_rgba(0,0,0,0.7)] lg:block xl:w-[275px]"
      />

      <Image
        src="/assets/fish-meal.png"
        alt=""
        width={180}
        height={180}
        className="pointer-events-none absolute right-[-45px] top-[92px] z-0 hidden h-[120px] w-[120px] rounded-full object-cover opacity-65 blur-[0.2px] lg:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1540px]">
        <div className="grid items-center gap-5 lg:grid-cols-[1.05fr_0.95fr_1fr] xl:gap-6">
          {/* LEFT CONTENT */}
          <div className="relative z-20 min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-[#A6FF4D]/20 bg-[#07140B]/80 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#A6FF4D] shadow-[0_0_40px_rgba(166,255,77,0.08)] backdrop-blur-xl">
              <span className="text-base">⌘</span>
              SMART FOOD SCANNER
            </div>

            <h2 className="max-w-[650px] text-[42px] font-black leading-[0.93] tracking-[-0.055em] text-white sm:text-[50px] lg:text-[58px] xl:text-[66px]">
              Scan. Detect.
              <br />
              Understand. <span className="text-[#A6FF4D]">Eat Smart.</span>
            </h2>

            <p className="mt-4 max-w-[600px] text-[16px] leading-[1.65] text-white/70 xl:text-[17px]">
              Just click a photo of your food and our AI instantly identifies
              the dish, calculates calories, macros, and provides smarter
              choices for your goals.
            </p>

            <div className="mt-5 space-y-2.5">
              {scannerFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-5">
                  <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-3xl border border-[#A6FF4D]/15 bg-[#07140B]/80 text-[23px] font-black text-[#A6FF4D] shadow-[0_0_38px_rgba(166,255,77,0.08)] backdrop-blur-xl">
                    {feature.icon}
                  </div>

                  <div className="pt-0.5">
                    <h3 className="text-[17px] font-black leading-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 max-w-[420px] text-[13px] leading-5 text-white/62 xl:text-[14px]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-7">
              <a
                href="#scanner"
                className="group inline-flex items-center gap-5 rounded-2xl bg-[#B6FF3B] px-8 py-4 text-[16px] font-black text-[#071008] shadow-[0_18px_60px_rgba(166,255,77,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(166,255,77,0.28)]"
              >
                Try Scanner Now
                <span className="text-2xl leading-none transition group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#dashboard"
                className="inline-flex items-center gap-4 text-[16px] font-semibold text-white/88 transition hover:text-white"
              >
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#B6FF3B]/50 bg-[#07140B]/85 text-[#B6FF3B] shadow-[0_0_36px_rgba(166,255,77,0.12)]">
                  ▶
                </span>
                See How It Works
              </a>
            </div>
          </div>

          {/* CENTER PHONE */}
          <div className="relative z-20 flex min-h-[545px] items-center justify-center lg:-mt-20 lg:-translate-x-4 lg:-translate-y-8">
            <div className="pointer-events-none absolute h-[710px] w-[710px] rounded-full bg-[#A6FF4D]/[0.075] blur-[185px]" />
            <div className="pointer-events-none absolute h-[640px] w-[640px] rounded-full border border-[#A6FF4D]/[0.04]" />
            <div className="pointer-events-none absolute h-[490px] w-[490px] rounded-full border border-[#A6FF4D]/[0.045]" />
            <div className="pointer-events-none absolute h-[340px] w-[340px] rounded-full border border-[#A6FF4D]/[0.05]" />

            <Image
              src="/assets/Phonenew.png"
              alt="Food scanner phone"
              width={700}
              height={1200}
              className="relative z-10 h-auto w-full max-w-[430px] object-contain drop-shadow-[0_0_90px_rgba(166,255,77,0.34)] xl:max-w-[540px]"
              priority
            />

            <div className="absolute bottom-8 z-20 hidden w-[390px] rounded-2xl border border-[#A6FF4D]/15 bg-[#06120B]/88 px-6 py-4 shadow-[0_0_80px_rgba(166,255,77,0.08)] backdrop-blur-xl md:block">
              <p className="font-black text-[#A6FF4D]">💡 Scanning Tips</p>
              <p className="mt-1 text-sm text-white/68">
                Good lighting&nbsp; • &nbsp;Clear view&nbsp; • &nbsp;Single
                dish in frame
              </p>
            </div>
          </div>

          {/* RIGHT ANALYTICS */}
          <div className="relative z-30 min-w-0 max-w-[548px] justify-self-start space-y-3 lg:-ml-9 xl:-ml-12">
            <div className="min-w-0 rounded-[24px] border border-[#A6FF4D]/15 bg-[#06120B]/76 p-3.5 shadow-[0_0_70px_rgba(166,255,77,0.04)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[16px] font-bold text-white">
                    Detected Food
                  </p>

                  <div className="mt-1.5 flex items-center gap-3">
                    <h3 className="text-[23px] font-black leading-tight text-[#A6FF4D] xl:text-[26px]">
                      Bengali Style Fish Curry
                    </h3>
                    <span className="text-[#A6FF4D]">✹</span>
                  </div>

                  <p className="mt-1.5 text-[14px] text-white/64">
                    Hilsa fish, Rice, Potato curry, Salad
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-[#A6FF4D]/20 bg-[#09170C]/80 px-4 py-3 text-center">
                  <p className="text-[23px] font-black leading-none text-[#A6FF4D]">
                    90%
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#A6FF4D]">
                    Accuracy
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-[1.05fr_1fr_1fr_1fr] items-center gap-3 rounded-[20px] border border-[#A6FF4D]/10 bg-white/[0.025] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white/78">
                    Calories
                  </p>
                  <p className="mt-2 text-[26px] font-black leading-none text-white">
                    650{" "}
                    <span className="text-base font-bold text-white/70">
                      kcal
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    1 serving (350g)
                  </p>
                </div>

                {macroStats.map((macro) => (
                  <div
                    key={macro.label}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <p className="text-sm font-semibold text-white/80">
                      {macro.label}
                    </p>
                    <div
                      className={`flex h-[66px] w-[66px] items-center justify-center rounded-full border-[5px] bg-[#07120B] ${macro.color}`}
                    >
                      <div className="text-center">
                        <p className="text-[17px] font-black leading-none text-white">
                          {macro.value}
                        </p>
                        <p
                          className={`mt-1 text-[11px] font-black ${
                            macro.color.split(" ")[1]
                          }`}
                        >
                          {macro.percent}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid overflow-hidden rounded-[22px] border border-[#A6FF4D]/10 md:grid-cols-[1.35fr_0.9fr]">
                <div className="p-3.5">
                  <h4 className="text-[16px] font-black text-white">
                    Nutrition Facts
                  </h4>

                  <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-[13px] text-white/65">
                    <p className="flex justify-between gap-5">
                      <span>Fiber</span>
                      <span>5.6g</span>
                    </p>
                    <p className="flex justify-between gap-5">
                      <span>Cholesterol</span>
                      <span>85mg</span>
                    </p>
                    <p className="flex justify-between gap-5">
                      <span>Sugar</span>
                      <span>3.2g</span>
                    </p>
                    <p className="flex justify-between gap-5">
                      <span>Calcium</span>
                      <span>48mg</span>
                    </p>
                    <p className="flex justify-between gap-5">
                      <span>Sodium</span>
                      <span>620mg</span>
                    </p>
                    <p className="flex justify-between gap-5">
                      <span>Iron</span>
                      <span>2.1mg</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-t border-[#A6FF4D]/10 p-3.5 md:border-l md:border-t-0">
                  <h4 className="text-[16px] font-black text-white">
                    Quality Score
                  </h4>

                  <div className="mt-3 flex h-[82px] w-[82px] items-center justify-center rounded-full border-[7px] border-[#A6FF4D] bg-[#08120B] shadow-[0_0_35px_rgba(166,255,77,0.14)]">
                    <div className="text-center">
                      <p className="text-[29px] font-black leading-none text-white">
                        82
                      </p>
                      <p className="mt-1 text-xs text-white/60">/100</p>
                    </div>
                  </div>

                  <p className="mt-2 text-sm font-black text-[#A6FF4D]">
                    Good
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="min-h-[112px] rounded-[22px] border border-[#A6FF4D]/15 bg-[#06120B]/76 p-3.5 backdrop-blur-xl">
                <h4 className="text-[16px] font-black text-[#A6FF4D]">
                  ✨ AI Insights
                </h4>

                <p className="mt-2 text-[13px] leading-5 text-white/65">
                  Great choice! This meal is high in protein and provides
                  balanced macros.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#A6FF4D]/25 px-3 py-1 text-[11px] font-bold text-[#A6FF4D]">
                    High Protein
                  </span>
                  <span className="rounded-full border border-[#18D3D0]/25 px-3 py-1 text-[11px] font-bold text-[#18D3D0]">
                    Good Omega-3
                  </span>
                  <span className="rounded-full border border-[#FFB02E]/25 px-3 py-1 text-[11px] font-bold text-[#FFB02E]">
                    Moderate Carb
                  </span>
                </div>
              </div>

              <div className="min-h-[112px] rounded-[22px] border border-[#A6FF4D]/15 bg-[#06120B]/76 p-3.5 backdrop-blur-xl">
                <h4 className="text-[16px] font-black text-white">
                  ♡ Better Alternatives
                </h4>

                <div className="mt-3 flex items-center gap-3">
                  <Image
                    src="/assets/fish-meal.png"
                    alt="Grilled fish with brown rice"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />

                  <div>
                    <p className="text-[13px] font-bold leading-5 text-white">
                      Grilled Fish
                      <br />
                      with Brown Rice
                    </p>
                    <p className="mt-1.5 text-sm font-black text-[#A6FF4D]">
                      520 kcal
                    </p>
                  </div>

                  <span className="ml-auto text-2xl text-white/70">›</span>
                </div>
              </div>
            </div>

            <div className="relative z-40 flex items-center gap-4 rounded-[22px] border border-[#A6FF4D]/15 bg-[#06120B]/76 p-3.5 backdrop-blur-xl">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#A6FF4D]/10 text-2xl md:flex">
                🤖
              </div>

              <div>
                <h4 className="text-[16px] font-black text-[#A6FF4D]">
                  AI Recommendation
                </h4>

                <p className="mt-1.5 text-[13px] leading-5 text-white/65">
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