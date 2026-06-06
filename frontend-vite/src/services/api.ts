const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const DEFAULT_TIMEOUT_MS = 30000;
const GENERATE_PLAN_TIMEOUT_MS = 180000;

/* ===========================
   SHARED TYPES
=========================== */

type ApiErrorPayload = {
  message?: string;
  detail?: Array<{ msg?: string }> | string;
  error?: string;
};

type RequestOptions = RequestInit & {
  timeoutMs?: number;
  timeoutLabel?: string;
};

export type PlanDuration = 1 | 7 | 15 | 30;

export type GeneratePlanPayload = {
  weight: number;
  height: number;
  age: number;
  gender: string;
  goal: string;
  activity: string;
  diet: string;
  days: number;

  name?: string;
  phone_number?: string;
  email?: string;
  city?: string;
  blood_group?: string;

  pregnancy_status?: "not_applicable" | "pregnant" | string;
  preferred_cuisine?: string;
  fitness_level?: string;
  allergies?: string[];
  disliked_foods?: string[];
  medical_conditions?: string | string[];
  budget?: string;
  workout_type?: string;
  sleep_time?: string;
  wake_time?: string;
  sleep_hours?: number | null;
  water_intake?: number;
  smoker_alcohol?: string;
};

export type MealQuality = {
  meal_variety?: number;
  meal_variety_score?: number;
  family_variety_score?: number;
  protein_rotation_score?: number;
  slot_realism_score?: number;
  dairy_balance_score?: number;
  alternative_variety_score?: number;
  human_realism_score?: number;
  nutritionist_quality_score?: number;

  max_repeat?: number;
  consecutive_repeats?: number;
  max_family_repeat?: number;
  family_recent_violations?: number;
  wrong_slot_count?: number;
  alternative_max_repeat?: number;

  unique_meals?: number;
  unique_families?: number;
  total_meal_slots?: number;
  requested_days?: number;
  generated_days?: number;

  diet_validation_passed?: boolean;
  diet_violations?: Array<Record<string, unknown>>;
  production_ready_meal_quality?: boolean;
  quality_gate?: string;
  meal_quality_source?: string;

  grocery_list?: string[];
  repeated_items?: string[];
  passed?: boolean;
  warnings?: string[];

  [key: string]: unknown;
};

export type GeneratePlanResponse = {
  success?: boolean;
  blocked?: boolean;
  message?: string;
  warning_title?: string;
  warning_message?: string;
  medical_disclaimer?: string;
  medical_warnings?: string[];
  medical_risk?: {
    risk_level?: string;
    warnings?: string[];
    detected_conditions?: string[];
    hard_block?: boolean;
    block_reason?: string;
    risk_type?: string;
    medical_disclaimer?: string;
  };
  user_profile?: Record<string, unknown>;
  targets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    water_target?: string;
  };
  analytics?: {
    wellness_adherence?: number;
    nutrition_consistency?: number;
    goal_alignment?: number;
    program_completion?: number;
    health_score?: number;
    meal_quality?: MealQuality;
    [key: string]: unknown;
  };
  meal_plan?: {
    days?: Array<Record<string, unknown>>;
    [key: string]: unknown;
  };
  quality_scores?: MealQuality;
  meal_quality?: MealQuality;
  grocery_list?: string[];
  coach_message?: string;
  ai_tip?: string;
  health_insight?: string;
  daily_routine?: Record<string, string>;
  saved_plan_id?: number | string | null;
  [key: string]: unknown;
};

export type ScanFoodResponse = {
  success?: boolean;
  saved_at?: string;
  created_at?: string;
  id?: number | string;
  detected_food?: string;
  food_name?: string;
  image_url?: string;
  image?: string;
  scanner_mode?: string;
  estimated_nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    saturated_fat?: number;
  };
  wellness_score?: number;
  nutrition_score?: number;
  score?: number;
  health_score?: number;
  warnings?: string[];
  suggestions?: string[];
  recommendations?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ProgressLogPayload = {
  user_id?: number | null;
  weight?: number | null;
  water_intake?: number | null;
  workout_done?: boolean;
  meal_followed?: boolean;
  sleep_hours?: number | null;
  steps?: number | null;
  calories_consumed?: number | null;
  protein_consumed?: number | null;
};

export type ExpectedVsActualResponse = {
  expected_weight?: number;
  actual_weight?: number;

  expected_calories?: number;
  actual_calories?: number;

  expected_protein?: number;
  actual_protein?: number;

  expected_water?: number;
  actual_water?: number;

  expected_sleep?: number;
  actual_sleep?: number;

  adherence_score?: number;
  nutrition_consistency?: number;
  goal_alignment?: number;
  program_completion?: number;

  recommendation?: string;
};

export type ProgressTrendPoint = {
  date: string;
  expected?: number;
  actual?: number;
};

export type AdherenceResponse = {
  adherence_score: number;
  meal_adherence: number;
  workout_adherence: number;
  hydration_adherence: number;
  sleep_adherence: number;
  nutrition_consistency?: number;
  goal_alignment?: number;
  program_completion?: number;
};

/* ===========================
   SHARED FETCH HELPER
=========================== */

async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const error = await safeReadError(res);
      throw new Error(getErrorMessage(error, res));
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        options.timeoutLabel ||
          "Request timed out. Please check the backend and try again.",
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function getErrorMessage(error: ApiErrorPayload, res: Response) {
  if (typeof error.detail === "string") return error.detail;

  return (
    error?.message ||
    error?.error ||
    error?.detail?.[0]?.msg ||
    `${res.status} ${res.statusText}`
  );
}

/* ===========================
   HEALTH
=========================== */

export async function healthCheck() {
  return apiFetch<Record<string, unknown>>("/health", {
    method: "GET",
    timeoutMs: 12000,
  });
}

/* ===========================
   SCANNER
=========================== */

export async function scanFood(file: File): Promise<ScanFoodResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<ScanFoodResponse>("/scan-food", {
    method: "POST",
    body: formData,
    timeoutMs: 45000,
    timeoutLabel:
      "Food scan is taking longer than expected. Please try a smaller or clearer image.",
  });
}

/* ===========================
   RECENT SCANS
=========================== */

export async function getRecentScans(limit = 10) {
  const safeLimit = clampLimit(limit);

  return apiFetch<Record<string, unknown>>(
    `/scanner/recent?limit=${safeLimit}`,
    {
      method: "GET",
    },
  );
}

/* ===========================
   SCAN HISTORY
=========================== */

export async function getScanHistory(limit = 10) {
  const safeLimit = clampLimit(limit);

  return apiFetch<Record<string, unknown>>(
    `/scanner/history?limit=${safeLimit}`,
    {
      method: "GET",
    },
  );
}

/* ===========================
   NUTRITION PLAN
=========================== */

export async function generatePlan(
  payload: GeneratePlanPayload,
): Promise<GeneratePlanResponse> {
  const normalizedPayload = normalizeGeneratePlanPayload(payload);
  const days = normalizePlanDays(normalizedPayload.days);

  return apiFetch<GeneratePlanResponse>("/generate-plan", {
    method: "POST",
    body: JSON.stringify({
      ...normalizedPayload,
      days,
    }),
    timeoutMs: GENERATE_PLAN_TIMEOUT_MS,
    timeoutLabel:
      days >= 15
        ? `${days}-day plan generation is taking longer than expected. Long-duration plans can take up to 3 minutes. Please keep the backend running and try again, or generate a 7-day plan first.`
        : "Plan generation is taking longer than expected. Please check the backend and try again.",
  });
}

function normalizeGeneratePlanPayload(
  payload: GeneratePlanPayload,
): GeneratePlanPayload {
  return {
    ...payload,
    age: toPositiveNumber(payload.age, 24),
    height: toPositiveNumber(payload.height, 165),
    weight: toPositiveNumber(payload.weight, 58),
    days: normalizePlanDays(payload.days),
    gender: normalizeString(payload.gender, "other").toLowerCase(),
    goal: normalizeString(payload.goal, "weight_loss"),
    activity: normalizeString(payload.activity, "moderate"),
    diet: normalizeString(payload.diet, "omnivore"),

    name: normalizeOptionalString(payload.name),
    phone_number: normalizeOptionalString(payload.phone_number),
    email: normalizeOptionalString(payload.email),
    city: normalizeOptionalString(payload.city),
    blood_group: normalizeOptionalString(payload.blood_group),

    pregnancy_status: normalizePregnancyStatus(
      payload.gender,
      payload.pregnancy_status,
    ),
    preferred_cuisine: normalizeString(payload.preferred_cuisine, "indian"),
    fitness_level: normalizeString(payload.fitness_level, "beginner"),
    allergies: Array.isArray(payload.allergies) ? payload.allergies : [],
    disliked_foods: Array.isArray(payload.disliked_foods)
      ? payload.disliked_foods
      : [],
    medical_conditions: payload.medical_conditions ?? "",
    budget: normalizeString(payload.budget, "medium"),
    workout_type: normalizeString(payload.workout_type, "gym"),
    sleep_time: normalizeString(payload.sleep_time, "23:00"),
    wake_time: normalizeString(payload.wake_time, "07:00"),
    sleep_hours: payload.sleep_hours ?? null,
    water_intake: toPositiveNumber(payload.water_intake, 2.5),
    smoker_alcohol: normalizeString(payload.smoker_alcohol, "none"),
  };
}

function normalizePregnancyStatus(gender?: string, status?: string) {
  const normalizedGender = normalizeString(gender, "other").toLowerCase();
  const normalizedStatus = normalizeString(
    status,
    "not_applicable",
  ).toLowerCase();

  if (normalizedGender === "male" || normalizedGender === "m") {
    return "not_applicable";
  }

  if (normalizedStatus === "pregnant") {
    return "pregnant";
  }

  return "not_applicable";
}

function normalizePlanDays(days?: number) {
  if (days === 1 || days === 7 || days === 15 || days === 30) return days;
  return 30;
}

/* ===========================
   SAVED PLANS
=========================== */

export async function getSavedPlans() {
  return apiFetch<Record<string, unknown>>("/history/plans", {
    method: "GET",
  });
}

/* ===========================
   PROGRESS
=========================== */

export async function getProgressHistory() {
  return apiFetch<Record<string, unknown>>("/progress/history", {
    method: "GET",
  });
}

export async function saveProgressLog(payload: ProgressLogPayload) {
  return apiFetch<Record<string, unknown>>("/progress/log", {
    method: "POST",
    body: JSON.stringify({
      user_id: payload.user_id ?? null,
      weight: payload.weight ?? null,
      water_intake: payload.water_intake ?? null,
      workout_done: payload.workout_done ?? false,
      meal_followed: payload.meal_followed ?? false,
      sleep_hours: payload.sleep_hours ?? null,
      steps: payload.steps ?? null,
      calories_consumed: payload.calories_consumed ?? null,
      protein_consumed: payload.protein_consumed ?? null,
    }),
  });
}

/* ===========================
   EXPECTED VS ACTUAL
=========================== */

export async function getExpectedVsActual() {
  return apiFetch<ExpectedVsActualResponse>("/progress/expected-vs-actual", {
    method: "GET",
  });
}

export async function getWeightTrend(days = 30) {
  return apiFetch<{ data?: ProgressTrendPoint[]; history?: ProgressTrendPoint[] }>(
    `/progress/weight-trend?days=${clampTrendDays(days)}`,
    {
      method: "GET",
    },
  );
}

export async function getProteinTrend(days = 30) {
  return apiFetch<{ data?: ProgressTrendPoint[]; history?: ProgressTrendPoint[] }>(
    `/progress/protein-trend?days=${clampTrendDays(days)}`,
    {
      method: "GET",
    },
  );
}

export async function getHydrationTrend(days = 30) {
  return apiFetch<{ data?: ProgressTrendPoint[]; history?: ProgressTrendPoint[] }>(
    `/progress/hydration-trend?days=${clampTrendDays(days)}`,
    {
      method: "GET",
    },
  );
}

export async function getAdherenceAnalytics() {
  return apiFetch<AdherenceResponse>("/progress/adherence", {
    method: "GET",
  });
}

/* ===========================
   DASHBOARD COMBINED DATA
=========================== */

export async function getDashboardHistory() {
  const [plans, scans, progress] = await Promise.allSettled([
    getSavedPlans(),
    getScanHistory(30),
    getProgressHistory(),
  ]);

  return {
    plans: plans.status === "fulfilled" ? plans.value : null,
    scans: scans.status === "fulfilled" ? scans.value : null,
    progress: progress.status === "fulfilled" ? progress.value : null,
    errors: {
      plans: plans.status === "rejected" ? plans.reason?.message : null,
      scans: scans.status === "rejected" ? scans.reason?.message : null,
      progress:
        progress.status === "rejected" ? progress.reason?.message : null,
    },
  };
}

/* ===========================
   UTILS
=========================== */

function clampLimit(limit: number) {
  if (!Number.isFinite(limit)) return 10;
  return Math.min(Math.max(Math.round(limit), 1), 100);
}

function clampTrendDays(days: number) {
  if (!Number.isFinite(days)) return 30;
  return Math.min(Math.max(Math.round(days), 7), 90);
}

function toPositiveNumber(value: unknown, fallback: number) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : fallback;
}

function normalizeString(value: unknown, fallback: string) {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function normalizeOptionalString(value: unknown) {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
}

/* ===========================
   ERROR HELPER
=========================== */

async function safeReadError(res: Response): Promise<ApiErrorPayload> {
  try {
    return (await res.json()) as ApiErrorPayload;
  } catch {
    return {
      message: `${res.status} ${res.statusText}`,
    };
  }
}