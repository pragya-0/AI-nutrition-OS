from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/progress", tags=["Progress"])

BASE_DIR = Path(__file__).resolve().parent.parent
DB_DIR = BASE_DIR / "database"
DB_DIR.mkdir(parents=True, exist_ok=True)
PROGRESS_LOG_PATH = DB_DIR / "progress_logs.json"


class ProgressLogRequest(BaseModel):
    user_id: int | None = None
    weight: float | None = None
    water_intake: float | None = None
    workout_done: bool = False
    meal_followed: bool = False
    sleep_hours: float | None = None
    steps: int | None = None
    calories_consumed: float | None = None
    protein_consumed: float | None = None


def _read_logs() -> list[dict[str, Any]]:
    if not PROGRESS_LOG_PATH.exists():
        return []
    try:
        import json

        raw = json.loads(PROGRESS_LOG_PATH.read_text(encoding="utf-8"))
        return raw if isinstance(raw, list) else []
    except Exception:
        return []


def _write_logs(logs: list[dict[str, Any]]) -> None:
    import json

    PROGRESS_LOG_PATH.write_text(json.dumps(logs, indent=2), encoding="utf-8")


def _date_key(value: str | None) -> str:
    if not value:
        return datetime.utcnow().date().isoformat()
    return str(value)[:10]


def _avg(values: list[float]) -> float:
    valid = [float(v) for v in values if isinstance(v, (int, float)) and float(v) > 0]
    return round(sum(valid) / len(valid), 1) if valid else 0


def _clamp(value: float, low: int = 0, high: int = 100) -> int:
    return max(low, min(high, round(value)))


@router.post("/log")
def save_progress_log(payload: ProgressLogRequest):
    logs = _read_logs()
    now = datetime.utcnow().isoformat()
    item = payload.model_dump()
    item.update({"id": len(logs) + 1, "date": now[:10], "created_at": now})
    logs.insert(0, item)
    _write_logs(logs[:500])
    return {"success": True, "message": "Progress log saved", "log": item}


@router.get("/history")
def get_progress_history(limit: int = 30):
    logs = _read_logs()
    limit = max(1, min(int(limit or 30), 180))
    return {"success": True, "history": logs[:limit], "data": logs[:limit]}


def _latest_number(logs: list[dict[str, Any]], key: str) -> float:
    for row in logs:
        value = row.get(key)
        if isinstance(value, (int, float)) and value > 0:
            return float(value)
    return 0


@router.get("/expected-vs-actual")
def expected_vs_actual():
    logs = _read_logs()
    latest_weight = _latest_number(logs, "weight")
    avg_water = _avg([float(row.get("water_intake") or 0) for row in logs])
    avg_sleep = _avg([float(row.get("sleep_hours") or 0) for row in logs])
    meal_adherence = _clamp((sum(1 for row in logs if row.get("meal_followed")) / len(logs)) * 100) if logs else 0
    workout_adherence = _clamp((sum(1 for row in logs if row.get("workout_done")) / len(logs)) * 100) if logs else 0
    hydration = _clamp((avg_water / 2.5) * 100) if avg_water else 0
    sleep = _clamp((avg_sleep / 8) * 100) if avg_sleep else 0
    adherence = _clamp((meal_adherence + workout_adherence + hydration + sleep) / 4) if logs else 0

    return {
        "expected_weight": latest_weight,
        "actual_weight": latest_weight,
        "expected_calories": 0,
        "actual_calories": _latest_number(logs, "calories_consumed"),
        "expected_protein": 0,
        "actual_protein": _latest_number(logs, "protein_consumed"),
        "expected_water": 2.5,
        "actual_water": avg_water,
        "expected_sleep": 8,
        "actual_sleep": avg_sleep,
        "adherence_score": adherence,
        "nutrition_consistency": _clamp((meal_adherence + hydration) / 2) if logs else 0,
        "goal_alignment": adherence,
        "program_completion": _clamp(len(logs) * 14),
        "recommendation": "Keep logging weight, water, sleep, meals, and workouts daily. The adaptive engine improves as history grows.",
    }


def _trend(key: str, days: int, expected_default: float) -> dict[str, Any]:
    logs = _read_logs()
    days = max(7, min(int(days or 30), 90))
    by_date = {_date_key(row.get("date") or row.get("created_at")): row for row in reversed(logs)}
    today = datetime.utcnow().date()
    data = []
    last_actual = 0.0
    for offset in range(days - 1, -1, -1):
        date = today - timedelta(days=offset)
        row = by_date.get(date.isoformat(), {})
        value = row.get(key)
        if isinstance(value, (int, float)) and value > 0:
            last_actual = float(value)
        data.append({"date": date.isoformat(), "expected": expected_default, "actual": last_actual or None})
    return {"success": True, "data": data, "history": data}


@router.get("/weight-trend")
def weight_trend(days: int = 30):
    latest = _latest_number(_read_logs(), "weight")
    return _trend("weight", days, latest)


@router.get("/protein-trend")
def protein_trend(days: int = 30):
    return _trend("protein_consumed", days, 0)


@router.get("/hydration-trend")
def hydration_trend(days: int = 30):
    return _trend("water_intake", days, 2.5)


@router.get("/adherence")
def adherence():
    logs = _read_logs()
    if not logs:
        return {
            "adherence_score": 0,
            "meal_adherence": 0,
            "workout_adherence": 0,
            "hydration_adherence": 0,
            "sleep_adherence": 0,
            "nutrition_consistency": 0,
            "goal_alignment": 0,
            "program_completion": 0,
        }

    meal = _clamp((sum(1 for row in logs if row.get("meal_followed")) / len(logs)) * 100)
    workout = _clamp((sum(1 for row in logs if row.get("workout_done")) / len(logs)) * 100)
    hydration = _clamp((_avg([float(row.get("water_intake") or 0) for row in logs]) / 2.5) * 100)
    sleep = _clamp((_avg([float(row.get("sleep_hours") or 0) for row in logs]) / 8) * 100)
    overall = _clamp((meal + workout + hydration + sleep) / 4)

    return {
        "adherence_score": overall,
        "meal_adherence": meal,
        "workout_adherence": workout,
        "hydration_adherence": hydration,
        "sleep_adherence": sleep,
        "nutrition_consistency": _clamp((meal + hydration) / 2),
        "goal_alignment": overall,
        "program_completion": _clamp(len(logs) * 14),
    }
