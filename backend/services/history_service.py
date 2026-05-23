import json
from database.database import SessionLocal
from database.models import UserNutritionPlan


def save_nutrition_plan(user_data, result):
    db = SessionLocal()

    try:
        plan = UserNutritionPlan(
            name=getattr(user_data, "name", ""),
            age=getattr(user_data, "age", None),
            gender=getattr(user_data, "gender", ""),
            weight=getattr(user_data, "weight", None),
            height=getattr(user_data, "height", None),
            goal=getattr(user_data, "goal", ""),
            diet=getattr(user_data, "diet", ""),
            activity=getattr(user_data, "activity", ""),
            calories=result.get("targets", {}).get("calories"),
            protein=result.get("targets", {}).get("protein"),
            carbs=result.get("targets", {}).get("carbs"),
            fats=result.get("targets", {}).get("fats"),
            analytics_json=json.dumps(result.get("analytics", {})),
            meal_plan_json=json.dumps(result.get("meal_plan", {})),
        )

        db.add(plan)
        db.commit()
        db.refresh(plan)

        return plan.id

    except Exception as error:
        db.rollback()
        print("DB SAVE ERROR:", error)
        return None

    finally:
        db.close()