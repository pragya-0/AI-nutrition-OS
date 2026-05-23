from datetime import datetime
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

try:
    from services.progress_service import create_progress_log, get_progress_history
except Exception as import_error:
    create_progress_log = None
    get_progress_history = None
    PROGRESS_IMPORT_ERROR = str(import_error)
    print("PROGRESS ROUTES IMPORT ERROR:", import_error)
else:
    PROGRESS_IMPORT_ERROR = None


router = APIRouter(prefix="/progress", tags=["Progress"])


class ProgressLogRequest(BaseModel):
    user_id: Optional[int] = None
    weight: Optional[float] = None
    water_intake: Optional[float] = None
    workout_done: bool = False
    meal_followed: bool = False
    sleep_hours: Optional[float] = None


def serialize_datetime(value):
    if isinstance(value, datetime):
        return value.isoformat()
    return value


@router.post("/log")
def save_progress_log(data: ProgressLogRequest):
    if create_progress_log is None:
        return {
            "success": False,
            "message": "Progress service is not available.",
            "error": PROGRESS_IMPORT_ERROR,
        }

    progress = create_progress_log(data)

    if not progress:
        return {
            "success": False,
            "message": "Failed to save progress log.",
        }

    return {
        "success": True,
        "message": "Progress log saved successfully.",
        "progress_id": progress.id,
    }


@router.get("/history")
def get_saved_progress_history():
    if get_progress_history is None:
        return {
            "success": False,
            "message": "Progress service is not available.",
            "error": PROGRESS_IMPORT_ERROR,
            "progress": [],
        }

    logs = get_progress_history()

    return {
        "success": True,
        "count": len(logs),
        "progress": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "weight": log.weight,
                "water_intake": log.water_intake,
                "workout_done": log.workout_done,
                "meal_followed": log.meal_followed,
                "sleep_hours": log.sleep_hours,
                "created_at": serialize_datetime(log.created_at),
            }
            for log in logs
        ],
    }