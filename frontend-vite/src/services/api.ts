const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/* ===========================
   HEALTH
=========================== */

export async function healthCheck() {
  const res = await fetch(`${API_BASE_URL}/health`);

  if (!res.ok) {
    throw new Error("Backend health check failed");
  }

  return res.json();
}

/* ===========================
   SCANNER
=========================== */

export async function scanFood(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/scan-food`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await safeReadError(res);
    console.error("Food scan failed:", error);
    throw new Error(error?.message || "Food scan failed");
  }

  return res.json();
}

/* ===========================
   RECENT SCANS
=========================== */

export async function getRecentScans(limit = 10) {
  const res = await fetch(`${API_BASE_URL}/scanner/recent?limit=${limit}`);

  if (!res.ok) {
    const error = await safeReadError(res);
    console.error("Failed to fetch recent scans:", error);
    throw new Error(error?.message || "Failed to fetch recent scans");
  }

  return res.json();
}

/* ===========================
   SCAN HISTORY
=========================== */

export async function getScanHistory(limit = 10) {
  const res = await fetch(`${API_BASE_URL}/scanner/history?limit=${limit}`);

  if (!res.ok) {
    const error = await safeReadError(res);
    console.error("Failed to fetch scan history:", error);
    throw new Error(error?.message || "Failed to fetch scan history");
  }

  return res.json();
}

/* ===========================
   NUTRITION PLAN
   Backend /generate-plan expects UserData:
   Required:
   weight, height, age, gender, goal, activity, diet, days
=========================== */

export type GeneratePlanPayload = {
  // Required by backend
  weight: number;
  height: number;
  age: number;
  gender: string;
  goal: string;
  activity: string;
  diet: string;
  days: number;

  // Optional user profile
  name?: string;
  phone_number?: string;
  email?: string;
  city?: string;
  blood_group?: string;

  // Optional health/lifestyle
  pregnancy_status?: string;
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
};

export async function generatePlan(payload: GeneratePlanPayload) {
  const normalizedPayload: GeneratePlanPayload = {
    ...payload,

    // Safe defaults required/expected by backend
    days: payload.days ?? 30,
    pregnancy_status: payload.pregnancy_status ?? "not_applicable",
    preferred_cuisine: payload.preferred_cuisine ?? "indian",
    fitness_level: payload.fitness_level ?? "beginner",
    allergies: payload.allergies ?? [],
    disliked_foods: payload.disliked_foods ?? [],
    medical_conditions: payload.medical_conditions ?? "",
    budget: payload.budget ?? "medium",
    workout_type: payload.workout_type ?? "gym",
    sleep_time: payload.sleep_time ?? "23:00",
    wake_time: payload.wake_time ?? "07:00",
    water_intake: payload.water_intake ?? 2.5,
  };

  const res = await fetch(`${API_BASE_URL}/generate-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizedPayload),
  });

  if (!res.ok) {
    const error = await safeReadError(res);
    console.error("Nutrition plan generation failed:", error);
    throw new Error(
      error?.message ||
        error?.detail?.[0]?.msg ||
        "Nutrition plan generation failed"
    );
  }

  return res.json();
}

/* ===========================
   SAVED PLANS
=========================== */

export async function getSavedPlans() {
  const res = await fetch(`${API_BASE_URL}/history/plans`);

  if (!res.ok) {
    const error = await safeReadError(res);
    console.error("Failed to fetch saved plans:", error);
    throw new Error(error?.message || "Failed to fetch saved plans");
  }

  return res.json();
}

/* ===========================
   PROGRESS
=========================== */

export type ProgressLogPayload = {
  user_id?: number | null;
  weight?: number | null;
  water_intake?: number | null;
  workout_done?: boolean;
  meal_followed?: boolean;
  sleep_hours?: number | null;
};

export async function getProgressHistory() {
  const res = await fetch(`${API_BASE_URL}/progress/history`);

  if (!res.ok) {
    const error = await safeReadError(res);
    console.error("Failed to fetch progress history:", error);
    throw new Error(error?.message || "Failed to fetch progress history");
  }

  return res.json();
}

export async function saveProgressLog(payload: ProgressLogPayload) {
  const res = await fetch(`${API_BASE_URL}/progress/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: payload.user_id ?? null,
      weight: payload.weight ?? null,
      water_intake: payload.water_intake ?? null,
      workout_done: payload.workout_done ?? false,
      meal_followed: payload.meal_followed ?? false,
      sleep_hours: payload.sleep_hours ?? null,
    }),
  });

  if (!res.ok) {
    const error = await safeReadError(res);
    console.error("Failed to save progress log:", error);
    throw new Error(error?.message || "Failed to save progress log");
  }

  return res.json();
}

/* ===========================
   ERROR HELPER
=========================== */

async function safeReadError(res: Response) {
  try {
    return await res.json();
  } catch {
    return {
      message: `${res.status} ${res.statusText}`,
    };
  }
}