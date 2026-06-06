"use client";

import Image from "@/compat/NextImage";
import { scanFood } from "@/services/api";
import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  Camera,
  ChevronDown,
  Droplets,
  Heart,
  HelpCircle,
  Home,
  ImagePlus,
  Leaf,
  LineChart,
  ScanLine,
  Sparkles,
  Trophy,
  UploadCloud,
  Utensils,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const scannerExamples = [
  "/assets/scanner/scanner-good-example-1.png",
  "/assets/scanner/scanner-good-example-2.png",
  "/assets/scanner/scanner-good-example-3.png",
  "/assets/scanner/scanner-good-example-4.png",
];

const navItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Nutrition Plan", icon: Utensils, href: "/dashboard" },
  { label: "Progress", icon: LineChart, href: "/dashboard" },
  { label: "Coach", icon: Brain, href: "/dashboard" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard" },
  { label: "Health Report", icon: Trophy, href: "/dashboard" },
  { label: "Scanner", icon: ScanLine, href: "/scanner", active: true },
];

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    text: "Advanced AI detects ingredients and calculates nutrition",
  },
  {
    icon: BarChart3,
    title: "Deep Nutrition Insights",
    text: "Calories, macros, micronutrients and health impact",
  },
  {
    icon: Activity,
    title: "Personalized for You",
    text: "Results tailored to your goals and health profile",
  },
  {
    icon: Leaf,
    title: "Better Food Choices",
    text: "Get smarter recommendations for a healthier you",
  },
];

export default function ScannerHeroUpload({
  onScanComplete,
}: {
  onScanComplete?: (result: any) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFile = (file?: File) => {
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setImagePreview(previewUrl);
    setScanError("");
  };

  const handleScanNow = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setScanError("");

    try {
      const result = await scanFood(selectedFile);

      console.log("AI Scan Result:", result);

      const enrichedResult = {
        ...result,
        uploadedImage: imagePreview,
        saved_at: result?.saved_at || new Date().toISOString(),
      };

      onScanComplete?.(enrichedResult);

      window.dispatchEvent(
        new CustomEvent("ai-scan-updated", {
          detail: enrichedResult,
        })
      );

      // Backward-compatible event for older scanner widgets still listening
      // to the previous event name.
      window.dispatchEvent(
        new CustomEvent("scan-history-updated", {
          detail: enrichedResult,
        })
      );

      setTimeout(() => {
        const resultSection = document.getElementById("ai-analysis-result");

        if (resultSection) {
          window.scrollTo({
            top: resultSection.offsetTop - 40,
            behavior: "smooth",
          });
        }
      }, 350);
    } catch (error) {
      console.error(error);
      setScanError("Food scan failed. Please check if backend is running.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030805] px-4 pb-4 pt-3 text-[#F5F8F2] sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <header className="mx-auto mb-4 flex max-w-[1780px] items-center justify-between rounded-[26px] border border-white/10 bg-[#020604]/95 px-5 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="AI Nutrition OS"
            width={180}
            height={42}
            className="h-[38px] w-auto object-contain"
            priority
          />
        </a>

        <nav className="hidden items-center gap-1.5 xl:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 rounded-[14px] px-3.5 py-2.5 text-sm font-bold transition ${
                  item.active
                    ? "bg-[#A6FF4D]/12 text-[#A6FF4D]"
                    : "text-[#DDEBD8] hover:bg-white/[0.05] hover:text-[#A6FF4D]"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#DDEBD8] transition hover:border-[#A6FF4D]/30 hover:text-[#A6FF4D] sm:flex">
            <Bell size={17} />
          </button>

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3">
            <Image
              src="/assets/scanner/scanner-user-avatar.png"
              alt="Isha"
              width={38}
              height={38}
              className="h-[38px] w-[38px] rounded-full object-cover"
            />
            <span className="hidden text-sm font-bold sm:block">Isha</span>
            <ChevronDown size={15} className="text-[#A3B3A3]" />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1780px] rounded-[30px] border border-[#173326] bg-[#020604]/95 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.5)] sm:p-5 lg:p-6 xl:p-7">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_72%_18%,rgba(166,255,77,0.13),transparent_28%),radial-gradient(circle_at_12%_8%,rgba(24,211,208,0.08),transparent_32%),#020604] p-5 sm:p-6 lg:p-7">
          <div className="relative z-10 mb-4 flex items-center justify-between gap-4">
            <span className="rounded-[12px] border border-[#A6FF4D]/20 bg-[#A6FF4D]/10 px-4 py-2 text-xs font-black uppercase text-[#A6FF4D]">
              STEP 1 OF 6
            </span>

            <button className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-[#F5F8F2] transition hover:border-[#A6FF4D]/30 hover:bg-[#A6FF4D]/10">
              <HelpCircle size={18} />
              Scanner Guide
            </button>
          </div>

          <div className="relative z-10 grid items-start gap-5 lg:grid-cols-[0.98fr_1.02fr]">
            <div>
              <h1 className="text-[38px] font-black leading-[0.98] tracking-[-0.06em] text-[#F5F8F2] sm:text-[48px] lg:text-[56px] xl:text-[62px]">
                Scan Your <span className="text-[#A6FF4D]">Food</span>
                <span className="ml-2 inline-block text-[#A6FF4D]">✦</span>
              </h1>

              <p className="mt-4 max-w-[660px] text-[15px] leading-7 text-[#DDEBD8] sm:text-base">
                Upload or capture your food image and let AI analyze nutrition,
                ingredients & health impact instantly.
              </p>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  handleFile(event.dataTransfer.files?.[0]);
                }}
                className={`mt-8 rounded-[24px] border border-dashed px-6 py-7 transition sm:px-8 sm:py-8 lg:px-10 lg:py-9 ${
                  dragActive
                    ? "border-[#A6FF4D] bg-[#A6FF4D]/12"
                    : "border-[#A6FF4D]/55 bg-[#020604]/40"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />

                <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
                  <button
                    onClick={() => inputRef.current?.click()}
                    className={`group relative flex items-center justify-center overflow-hidden rounded-full border border-[#A6FF4D]/45 bg-[#A6FF4D]/10 text-[#A6FF4D] shadow-[0_0_45px_rgba(166,255,77,0.18)] transition hover:scale-105 ${
                      imagePreview ? "h-[148px] w-[148px]" : "h-[132px] w-[132px]"
                    }`}
                  >
                    <span className="absolute inset-[-15px] rounded-full border border-[#A6FF4D]/20" />
                    <span className="absolute inset-[-28px] rounded-full border border-[#A6FF4D]/10" />

                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Selected food preview"
                        className="relative z-10 h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <Camera size={44} />
                    )}
                  </button>

                  <h3 className="mt-7 max-w-full break-words text-xl font-black text-[#F5F8F2]">
                    {selectedFile ? selectedFile.name : "Tap to Open Camera"}
                  </h3>

                  <p className="mt-2 text-sm text-[#A3B3A3]">
                    {selectedFile
                      ? "Image selected. Ready for AI scan."
                      : "Capture your food in real-time"}
                  </p>

                  <div className="my-6 flex w-full items-center gap-5 text-sm font-bold text-[#A3B3A3]">
                    <span className="h-px flex-1 bg-white/10" />
                    OR
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <button
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full max-w-[420px] items-center justify-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.03] px-6 py-4 text-base font-bold text-[#F5F8F2] transition hover:border-[#A6FF4D]/35 hover:bg-[#A6FF4D]/10"
                  >
                    <UploadCloud size={22} />
                    Upload from Gallery
                  </button>

                  <p className="mt-3 text-sm text-[#A3B3A3]">
                    Drag & drop image here
                  </p>
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-[#DDEBD8]">
                Supported formats: JPG, PNG, HEIC
                <span className="mx-2 text-[#A3B3A3]">•</span>
                Max size: 10MB
              </p>

              {selectedFile && (
                <div className="mt-6 flex flex-col items-center gap-3">
                  <button
                    onClick={handleScanNow}
                    disabled={isScanning}
                    className="flex h-[58px] min-w-[260px] items-center justify-center gap-3 rounded-[16px] bg-[#A6FF4D] px-8 text-base font-black text-[#051004] shadow-[0_0_40px_rgba(166,255,77,0.25)] transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Sparkles size={20} />
                    {isScanning ? "Scanning..." : "Scan Food Now"}
                  </button>

                  {scanError && (
                    <p className="text-center text-sm font-semibold text-[#FF6C7D]">
                      {scanError}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="relative min-h-[570px]">
              <div className="pointer-events-none absolute inset-x-6 top-8 h-[340px] rounded-full bg-[#A6FF4D]/10 blur-3xl" />

              <div className="relative mx-auto flex h-[410px] max-w-[650px] items-center justify-center">
                <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-[18px] border border-[#A6FF4D]/35 bg-[#07110A]/90 px-5 py-3 text-center shadow-[0_0_45px_rgba(166,255,77,0.12)] backdrop-blur-xl">
                  <p className="flex items-center justify-center gap-2 text-sm font-black uppercase text-[#D4FF9C]">
                    <Sparkles size={16} />
                    AI Scanning
                  </p>
                  <p className="mt-1.5 text-sm text-[#F5F8F2]">
                    {isScanning ? "Scanning..." : "Analyzing Nutrition"}
                  </p>
                </div>

                <div className="absolute left-16 top-[188px] z-20 flex h-14 w-14 flex-col items-center justify-center rounded-full border border-[#A6FF4D]/20 bg-[#07110A]/80 text-center text-[#A6FF4D] backdrop-blur-xl">
                  <span className="text-[10px] font-bold leading-none">
                    AI
                  </span>
                  <span className="text-sm font-black leading-none">LIVE</span>
                </div>

                <div className="absolute right-14 top-[142px] z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#A6FF4D]/25 bg-[#07110A]/80 text-[#A6FF4D]">
                  <Brain size={20} />
                </div>
                <div className="absolute right-10 top-[222px] z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#A6FF4D]/25 bg-[#07110A]/80 text-[#A6FF4D]">
                  <Droplets size={20} />
                </div>
                <div className="absolute right-14 top-[302px] z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#A6FF4D]/25 bg-[#07110A]/80 text-[#A6FF4D]">
                  <Heart size={20} />
                </div>
                <div className="absolute left-20 top-[274px] z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#A6FF4D]/25 bg-[#07110A]/80 text-[#A6FF4D]">
                  <Leaf size={20} />
                </div>

                <div className="absolute h-[270px] w-[500px] rounded-[34px] border border-[#A6FF4D]/30 bg-[#A6FF4D]/[0.03]" />
                <div className="absolute bottom-8 h-[88px] w-[390px] rounded-[50%] border border-[#A6FF4D]/30 bg-[#A6FF4D]/10 blur-[1px]" />
                <div className="absolute bottom-3 h-[68px] w-[470px] rounded-[50%] border border-[#18D3D0]/15" />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected food"
                    className="relative z-10 mt-14 h-[300px] w-[74%] max-w-[500px] rounded-[30px] object-cover drop-shadow-[0_40px_65px_rgba(0,0,0,0.75)]"
                  />
                ) : (
                  <Image
                    src="/assets/scanner/scanner-food-bowl.png"
                    alt="Scanner food bowl"
                    width={600}
                    height={450}
                    className="relative z-10 mt-14 w-[74%] max-w-[500px] object-contain drop-shadow-[0_40px_65px_rgba(0,0,0,0.75)]"
                  />
                )}
              </div>

              <div className="mt-3 grid gap-3">
                {benefits.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      className="group flex items-start gap-4 rounded-[20px] border border-transparent bg-transparent p-1.5 text-left transition hover:border-white/10 hover:bg-white/[0.03]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D] transition group-hover:bg-[#A6FF4D]/20">
                        <Icon size={21} />
                      </span>

                      <span>
                        <span className="block text-base font-black text-[#F5F8F2]">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-[#A3B3A3]">
                          {item.text}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 rounded-[24px] border border-white/10 bg-[#07110A]/60 p-4">
            <div className="grid items-center gap-5 lg:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#A6FF4D]/10 text-[#A6FF4D]">
                  <ImagePlus size={23} />
                </div>

                <div>
                  <p className="font-black text-[#F5F8F2]">
                    Tips for best results
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#DDEBD8]">
                    Use natural light
                    <span className="mx-3 text-[#A3B3A3]">•</span>
                    Focus on the food
                    <span className="mx-3 text-[#A3B3A3]">•</span>
                    Avoid filters
                    <span className="mx-3 text-[#A3B3A3]">•</span>
                    Include all items on your plate
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="shrink-0 text-sm font-bold text-[#A6FF4D]">
                  Good examples
                </span>

                {scannerExamples.map((src, index) => (
                  <button
                    key={src}
                    className="h-[58px] w-[76px] shrink-0 overflow-hidden rounded-[12px] border border-white/10 bg-white/[0.03] transition hover:border-[#A6FF4D]/50"
                  >
                    <Image
                      src={src}
                      alt={`Good scanner example ${index + 1}`}
                      width={120}
                      height={90}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}