import json

from fastapi import APIRouter
from database.database import SessionLocal
from database.models import UserNutritionPlan

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/plans")
def get_saved_plans():
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
                    "analytics": json.loads(plan.analytics_json or "{}"),
                    "meal_plan": json.loads(plan.meal_plan_json or "{}"),
                    "created_at": plan.created_at,
                }
                for plan in plans
            ],
        }

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to load saved nutrition plans.",
            "error": str(error),
        }

    finally:
        db.close()