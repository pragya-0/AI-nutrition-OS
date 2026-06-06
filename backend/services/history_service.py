import json
from datetime import datetime
from typing import Any

from database.database import SessionLocal
from database.models import ScanHistory, UserNutritionPlan


def safe_json_dumps(value: Any) -> str:
    try:
        return json.dumps(value or {}, ensure_ascii=False)
    except Exception:
        return "{}"


def safe_json_loads(value: str | None, fallback: Any):
    try:
        if not value:
            return fallback
        return json.loads(value)
    except Exception:
        return fallback


def clean_encoding(value: Any):
    if isinstance(value, str):
        return (
            value.replace("sautÃ©ed", "sautéed")
            .replace("â€™", "'")
            .replace("â", "'")
            .replace("â€“", "-")
            .replace("â€”", "-")
            .replace("â", "")
        )

    if isinstance(value, list):
        return [clean_encoding(item) for item in value]

    if isinstance(value, dict):
        return {key: clean_encoding(item) for key, item in value.items()}

    return value


def normalize_food_text(text: str):
    return str(text or "").lower().replace("_", " ").replace("-", " ").strip()


def make_public_image_url(value: str | None, backend_public_url: str | None = None):
    if not value:
        return value

    backend_public_url = (backend_public_url or "").rstrip("/")

    if value.startswith("http://") or value.startswith("https://"):
        return value

    if not backend_public_url:
        return value

    if value.startswith("/uploads/"):
        return f"{backend_public_url}{value}"

    if value.startswith("uploads/"):
        return f"{backend_public_url}/{value}"

    return value


def _get_quality_from_result(result: dict):
    analytics = result.get("analytics") or {}
    quality = (
        result.get("meal_quality")
        or analytics.get("meal_quality")
        or analytics.get("plan_quality")
        or {}
    )
    return quality if isinstance(quality, dict) else {}


def save_nutrition_plan(user_data, result):
    """
    Save only successful, unblocked plans.
    """
    if not result or result.get("blocked") or result.get("success") is False:
        return None

    db = SessionLocal()

    try:
        result = clean_encoding(dict(result or {}))
        analytics = result.get("analytics") or {}
        meal_plan = result.get("meal_plan") or {}
        quality = _get_quality_from_result(result)

        if quality:
            analytics["meal_quality"] = quality
            analytics["meal_variety"] = quality.get("meal_variety", analytics.get("meal_variety"))
            result["analytics"] = analytics

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
            analytics_json=safe_json_dumps(analytics),
            meal_plan_json=safe_json_dumps(meal_plan),
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


def serialize_plan_row(row: UserNutritionPlan):
    analytics = clean_encoding(safe_json_loads(row.analytics_json, {}))
    meal_plan = clean_encoding(safe_json_loads(row.meal_plan_json, {}))

    days = meal_plan.get("days") if isinstance(meal_plan, dict) else []
    days = days if isinstance(days, list) else []

    return {
        "id": row.id,
        "name": row.name,
        "age": row.age,
        "gender": row.gender,
        "weight": row.weight,
        "height": row.height,
        "goal": row.goal,
        "diet": row.diet,
        "activity": row.activity,
        "calories": row.calories,
        "protein": row.protein,
        "carbs": row.carbs,
        "fats": row.fats,
        "analytics": analytics,
        "meal_plan": meal_plan,
        "day_count": len(days),
        "meal_variety": analytics.get("meal_variety") or analytics.get("meal_quality", {}).get("meal_variety"),
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


def read_nutrition_plans(limit=20):
    db = SessionLocal()

    try:
        rows = (
            db.query(UserNutritionPlan)
            .order_by(UserNutritionPlan.created_at.desc())
            .limit(limit)
            .all()
        )

        return [serialize_plan_row(row) for row in rows]

    except Exception as error:
        print("PLAN HISTORY READ ERROR:", error)
        return []

    finally:
        db.close()


def serialize_scan_history_row(row: ScanHistory, backend_public_url: str | None = None):
    payload = clean_encoding(safe_json_loads(row.macros_json, {}))

    estimated_nutrition = payload.get("estimated_nutrition") or {}
    estimated_nutrition.setdefault("calories", row.calories or 0)

    item = {
        **payload,
        "id": payload.get("id") or row.id,
        "created_at": row.created_at.isoformat() if row.created_at else payload.get("created_at"),
        "saved_at": payload.get("saved_at") or (row.created_at.isoformat() if row.created_at else None),
        "detected_food": payload.get("detected_food") or row.food_name,
        "food_name": payload.get("food_name") or payload.get("detected_food") or row.food_name,
        "image_url": make_public_image_url(payload.get("image_url") or row.image_url, backend_public_url),
        "image": make_public_image_url(payload.get("image") or payload.get("image_url") or row.image_url, backend_public_url),
        "scanner_mode": payload.get("scanner_mode") or row.scanner_mode,
        "estimated_nutrition": estimated_nutrition,
        "health_score": payload.get("health_score") or payload.get("score") or payload.get("nutrition_score") or 75,
    }

    return clean_encoding(item)


def save_scan_history_item(scan_result: dict, backend_public_url: str | None = None):
    db = SessionLocal()

    try:
        item = clean_encoding(dict(scan_result or {}))
        now = datetime.utcnow()

        item["saved_at"] = item.get("saved_at") or now.isoformat(timespec="seconds")
        item["created_at"] = item.get("created_at") or item["saved_at"]

        image_value = item.get("image_url") or item.get("image")
        public_image = make_public_image_url(image_value, backend_public_url)
        item["image_url"] = public_image
        item["image"] = public_image

        detected_food = (
            item.get("detected_food")
            or item.get("food_name")
            or item.get("food")
            or item.get("title")
            or "AI Food Scan"
        )

        estimated = item.get("estimated_nutrition") or {}
        calories = estimated.get("calories") or item.get("calories") or 0

        # MVP behavior: one latest scan per food name for cleaner dashboard cards.
        # After auth/user accounts, this should become user_id + timestamp history.
        item_key = normalize_food_text(detected_food)
        if item_key:
            existing_rows = db.query(ScanHistory).all()
            for row in existing_rows:
                row_payload = safe_json_loads(row.macros_json, {})
                row_key = normalize_food_text(
                    row_payload.get("detected_food")
                    or row_payload.get("food_name")
                    or row.food_name
                    or ""
                )
                if row_key == item_key:
                    db.delete(row)

        scan = ScanHistory(
            user_id=item.get("user_id"),
            food_name=str(detected_food)[:255],
            calories=float(calories or 0),
            macros_json=safe_json_dumps(item),
            image_url=public_image,
            scanner_mode=item.get("scanner_mode"),
            created_at=now,
        )

        db.add(scan)
        db.commit()
        db.refresh(scan)

        saved_item = serialize_scan_history_row(scan, backend_public_url)
        saved_item["id"] = scan.id

        return saved_item

    except Exception as error:
        db.rollback()
        print("SQL SCAN HISTORY SAVE ERROR:", error)
        return scan_result

    finally:
        db.close()


def read_scan_history_items(limit=20, backend_public_url: str | None = None):
    db = SessionLocal()

    try:
        rows = (
            db.query(ScanHistory)
            .order_by(ScanHistory.created_at.desc())
            .limit(limit)
            .all()
        )

        return [serialize_scan_history_row(row, backend_public_url) for row in rows]

    except Exception as error:
        print("SQL SCAN HISTORY READ ERROR:", error)
        return []

    finally:
        db.close()
