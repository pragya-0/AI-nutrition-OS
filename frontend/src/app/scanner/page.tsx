"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  Loader2,
  ScanLine,
  Sparkles,
  Utensils,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ai-nutrition-backend-20tf.onrender.com";

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PNG, JPG, JPEG, or WEBP food image.");
      return;
    }

    const maxSize = 8 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setError("Image is too large. Please upload an image under 8MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const scanFood = async () => {
    if (!file) {
      setError("Please upload a meal image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);

      const response = await fetch(`${API_URL}/scan-food`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        throw new Error("Scanner returned an invalid response.");
      }

      if (!response.ok || data.success === false) {
        setError(
          data?.message ||
            data?.detail ||
            "Could not scan this image. Please try another clear food photo."
        );
        return;
      }

      setResult(data);
    } catch (err: any) {
      console.error("SCANNER ERROR:", err);

      if (err.name === "AbortError") {
        setError("Scanner is taking too long. Please try again in a few seconds.");
        return;
      }

      setError("Scanner backend is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-180px] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-400 transition hover:text-green-300"
        >
          <ArrowLeft size={18} />
          Back to AI Nutrition OS
        </Link>

        <section className="overflow-hidden rounded-[44px] border border-green-500/15 bg-zinc-950/90 p-6 shadow-[0_0_90px_rgba(34,197,94,0.10)] lg:p-10">
          <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-300">
                <Sparkles size={16} />
                Smart AI Meal Analysis
              </div>

              <h1 className="text-5xl font-black leading-tight lg:text-7xl">
                Smart Food
                <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-lime-200 bg-clip-text text-transparent">
                  Scanner
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400 lg:text-lg">
                Upload a clear meal photo and get AI food detection, estimated
                calories, macros, confidence, and nutrition insight.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat icon={<Camera />} label="Upload" />
              <MiniStat icon={<ScanLine />} label="AI Scan" />
              <MiniStat icon={<Utensils />} label="Summary" />
            </div>
          </div>

          <div className="space-y-6">
            <label className="block cursor-pointer">
              <div className="rounded-[34px] border-2 border-dashed border-green-500/25 bg-black/40 p-8 text-center transition hover:border-green-400/60 hover:bg-green-500/5">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 text-green-300">
                  <ImagePlus size={38} />
                </div>

                <h2 className="text-2xl font-black">Upload your meal</h2>

                <p className="mt-3 text-sm text-zinc-400">
                  Use a clear food plate image for best AI detection.
                </p>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <span className="mt-6 inline-flex rounded-2xl bg-green-400 px-7 py-4 font-black text-black transition hover:bg-green-300">
                  Choose Image
                </span>
              </div>
            </label>

            {file && (
              <div className="rounded-3xl border border-green-500/15 bg-green-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-green-300">
                  Selected Image
                </p>

                <p className="mt-1 truncate font-semibold text-white">
                  {file.name}
                </p>
              </div>
            )}

            {preview && (
              <div className="rounded-[34px] border border-green-500/15 bg-black/40 p-5">
                <img
                  src={preview}
                  alt="Food preview"
                  className="h-[430px] w-full rounded-[28px] object-cover"
                />
              </div>
            )}

            {error && (
              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={scanFood}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-400 px-8 py-5 text-base font-black text-black shadow-xl shadow-green-500/20 transition hover:scale-[1.01] hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Scanning with AI...
                </>
              ) : (
                <>
                  <ScanLine size={20} />
                  Scan Food
                </>
              )}
            </button>
          </div>
        </section>

        {result && (
          <section className="mt-10 rounded-[44px] border border-green-500/15 bg-zinc-950/90 p-8 shadow-[0_0_70px_rgba(34,197,94,0.08)] lg:p-10">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
                  Meal Scan Complete
                </p>

                <h2 className="mt-2 text-4xl font-black">Nutrition Summary</h2>

                <p className="mt-3 text-zinc-400">
                  Here is your AI-estimated nutrition snapshot.
                </p>
              </div>

              <div className="rounded-3xl bg-green-400 px-6 py-4 text-black">
                <p className="text-sm font-black">Health Score</p>

                <p className="text-4xl font-black">
                  {result.health_score ?? "N/A"}/100
                </p>
              </div>
            </div>

            <div className="rounded-[36px] border border-green-500/15 bg-black/40 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
                    Detected Meal
                  </p>

                  <h3 className="mt-2 text-4xl font-black text-white">
                    {formatFoodName(result.detected_food ?? "Detected Meal")}
                  </h3>

                  <p className="mt-2 text-zinc-400">
                    Confidence: {Math.round((result.confidence ?? 0) * 100)}%
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/15 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-300">
                  Mode: {formatFoodName(result.scanner_mode ?? "ai_scan")}
                </div>
              </div>

              {result.analysis && (
                <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-zinc-300">
                  {result.analysis}
                </p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
              <NutritionCard
                label="Calories"
                value={result.estimated_nutrition?.calories ?? "N/A"}
                unit="kcal"
              />

              <NutritionCard
                label="Protein"
                value={result.estimated_nutrition?.protein ?? "N/A"}
                unit="g"
              />

              <NutritionCard
                label="Carbs"
                value={result.estimated_nutrition?.carbs ?? "N/A"}
                unit="g"
              />

              <NutritionCard
                label="Fats"
                value={result.estimated_nutrition?.fats ?? "N/A"}
                unit="g"
              />
            </div>

            {Array.isArray(result.warnings) && result.warnings.length > 0 && (
              <div className="mt-6 rounded-[30px] border border-yellow-500/20 bg-yellow-500/10 p-6">
                <p className="font-black text-yellow-300">Warnings</p>

                <ul className="mt-3 space-y-2 text-sm text-yellow-100">
                  {result.warnings.map((item: string, index: number) => (
                    <li key={index}>⚠️ {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(result.suggestions) &&
              result.suggestions.length > 0 && (
                <div className="mt-6 rounded-[30px] border border-green-500/15 bg-green-500/10 p-6">
                  <p className="font-black text-green-300">Suggestions</p>

                  <ul className="mt-3 space-y-2 text-sm text-green-100">
                    {result.suggestions.map((item: string, index: number) => (
                      <li key={index}>✅ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="text-lg font-bold text-white">
                Want a full meal plan around this?
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                Go back to AI Nutrition OS and generate a complete plan based on
                your goal.
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex rounded-2xl border-2 border-green-400 px-6 py-3 font-bold text-white transition hover:bg-green-400/10 hover:text-green-300"
              >
                Create Nutrition Plan
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function MiniStat({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-green-500/15 bg-black/40 p-5 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">
        {icon}
      </div>

      <p className="text-sm font-bold text-zinc-300">{label}</p>
    </div>
  );
}

function NutritionCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
      <p className="text-sm text-zinc-400">{label}</p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>

      <p className="text-sm text-zinc-500">{unit}</p>
    </div>
  );
}

function formatFoodName(food: string) {
  return food
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}