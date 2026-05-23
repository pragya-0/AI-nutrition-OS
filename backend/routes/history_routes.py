import json
from datetime import datetime

from fastapi import APIRouter

IMPORT_ERROR = None

try:
    from database.database import SessionLocal
    from database.models import UserNutritionPlan
except Exception as import_error:
    SessionLocal = None
    UserNutritionPlan = None
    IMPORT_ERROR = str(import_error)
    print("HISTORY ROUTES IMPORT ERROR:", import_error)


router = APIRouter(prefix="/history", tags=["History"])


def safe_json_loads(value, fallback):
    try:
        if not value:
            return fallback
        return json.loads(value)
    except Exception:
        return fallback


def serialize_datetime(value):
    if isinstance(value, datetime):
        return value.isoformat()
    return value


@router.get("/plans")
def get_saved_plans():
    if SessionLocal is None or UserNutritionPlan is None:
        return {
            "success": False,
            "message": "History database dependencies are not available.",
            "error": IMPORT_ERROR,
            "plans": [],
        }

    db = SessionLocal()

    try:
        plans = (
            db.query(UserNutritionPlan)
            .order_by(UserNutritionPlan.created_at.desc())
            .limit(20)
            .all()
        )

        return {
            "success": True,
            "count": len(plans),
            "plans": [
                {
                    "id": plan.id,
                    "name": plan.name,
                    "age": plan.age,
                    "gender": plan.gender,
                    "weight": plan.weight,
                    "height": plan.height,
                    "goal": plan.goal,
                    "diet": plan.diet,
                    "activity": plan.activity,
                    "calories": plan.calories,
                    "protein": plan.protein,
                    "carbs": plan.carbs,
                    "fats": plan.fats,
                    "analytics": safe_json_loads(plan.analytics_json, {}),
                    "meal_plan": safe_json_loads(plan.meal_plan_json, {}),
                    "created_at": serialize_datetime(plan.created_at),
                }
                for plan in plans
            ],
        }

    except Exception as error:
        print("HISTORY ROUTE ERROR:", error)

        return {
            "success": False,
            "message": "Failed to load saved nutrition plans.",
            "error": str(error),
            "plans": [],
        }

    finally:
        db.close()