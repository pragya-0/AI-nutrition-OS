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
    throw new Error("Food scan failed");
  }

  return res.json();
}

/* ===========================
   RECENT SCANS
=========================== */

export async function getRecentScans() {
  const res = await fetch(`${API_BASE_URL}/scanner/recent`);

  if (!res.ok) {
    throw new Error("Failed to fetch recent scans");
  }

  return res.json();
}

/* ===========================
   SCAN HISTORY
=========================== */

export async function getScanHistory() {
  const res = await fetch(`${API_BASE_URL}/scanner/history`);

  if (!res.ok) {
    throw new Error("Failed to fetch scan history");
  }

  return res.json();
}

/* ===========================
   NUTRITION PLAN
=========================== */

export type GeneratePlanPayload = {
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  activity_level: string;
  diet_preference?: string;
  allergies?: string[];
  medical_conditions?: string[];
};

export async function generatePlan(payload: GeneratePlanPayload) {
  const res = await fetch(`${API_BASE_URL}/generate-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Nutrition plan generation failed");
  }

  return res.json();
}

/* ===========================
   SAVED PLANS
=========================== */

export async function getSavedPlans() {
  const res = await fetch(`${API_BASE_URL}/history/plans`);

  if (!res.ok) {
    throw new Error("Failed to fetch saved plans");
  }

  return res.json();
}

/* ===========================
   PROGRESS
=========================== */

export async function getProgressHistory() {
  const res = await fetch(`${API_BASE_URL}/progress/history`);

  if (!res.ok) {
    throw new Error("Failed to fetch progress history");
  }

  return res.json();
}

export async function saveProgressLog(payload: unknown) {
  const res = await fetch(`${API_BASE_URL}/progress/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save progress log");
  }

  return res.json();
}