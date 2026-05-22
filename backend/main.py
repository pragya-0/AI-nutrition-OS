import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import shutil
import json
import base64
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from groq import Groq
from PIL import Image

from models.user_model import UserData

from nutrition.bmi import calculate_bmi
from nutrition.calories import calculate_calories
from nutrition.macros import calculate_macros
from nutrition.metabolic_engine import determine_metabolic_strategy
from nutrition.health_score import calculate_dynamic_health_score

from nutrition.analytics import (
    calculate_bmr,
    calculate_tdee,
    calculate_body_fat,
    calculate_metabolic_age,
    calculate_hydration_score,
    calculate_macro_ratio,
)

from nutrition.avoidance_engine import generate_avoid_foods
from nutrition.medical_ai_filter import apply_medical_safety_filter
from nutrition.elderly_safety_engine import apply_elderly_safety_filter
from services.nutrition_service import generate_nutrition_plan
from services.routine_generator import generate_daily_routine

from services.meal_quality_engine import (
    sanitize_meal_days,
    calculate_plan_quality_scores,
)

try:
    from services.groq_service import generate_groq_coach_tip
except Exception:
    generate_groq_coach_tip = None

try:
    from services.ai_orchestrator import (
        generate_ai_coach,
        generate_ai_workout_tip,
        generate_health_insight,
    )
except Exception:
    generate_ai_coach = None
    generate_ai_workout_tip = None
    generate_health_insight = None

from routes.nutrition_routes import router as nutrition_router
from routes.scanner_routes import router as scanner_router
from routes.analytics_routes import router as analytics_router


env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


app = FastAPI(
    title="AI Nutrition OS",
    version="2.9.0",
    description="AI-powered nutrition planning, Groq-first food scanning, analytics, lifestyle routine, and metabolic strategy system",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ai-nutrition-os.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATASET_PATH = "Indian_Food_Nutrition_Processed.csv"

try:
    df = pd.read_csv(DATASET_PATH)
    df.columns = df.columns.str.strip()
    dataset_loaded = True
    print("\n✅ Dataset loaded successfully")
except Exception as e:
    print("\n❌ Dataset loading failed:", e)
    df = pd.DataFrame()
    dataset_loaded = False


food_col = None
calorie_col = None
protein_col = None
type_col = None

if not df.empty:
    for col in df.columns:
        lower_col = col.lower()

        if "food" in lower_col or "dish" in lower_col or "name" in lower_col:
            food_col = col

        if "calorie" in lower_col or "energy" in lower_col or "kcal" in lower_col:
            if "calcium" not in lower_col:
                calorie_col = col

        if "protein" in lower_col:
            protein_col = col

        if "type" in lower_col or "category" in lower_col:
            type_col = col


print("\nDETECTED COLUMNS:")
print("Food:", food_col)
print("Calories:", calorie_col)
print("Protein:", protein_col)
print("Type:", type_col)


app.include_router(nutrition_router)
app.include_router(scanner_router)
app.include_router(analytics_router)


def safe_json_parse(text: str):
    try:
        cleaned = text.strip()

        if cleaned.startswith("```json"):
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()
        elif cleaned.startswith("```"):
            cleaned = cleaned.replace("```", "").strip()

        return json.loads(cleaned)
    except Exception:
        return None


def groq_vision_scan(file_path: str):
    if groq_client is None:
        return None

    try:
        with open(file_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode("utf-8")

        completion = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """
You are an AI nutrition vision scanner.

Analyze this food image visually.

Return ONLY valid JSON in this exact format:

{
  "detected_food": "food name",
  "confidence": 0.85,
  "estimated_nutrition": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "health_score": 0,
  "analysis": "short nutrition analysis",
  "warnings": [],
  "suggestions": []
}

Rules:
- Estimate one normal serving.
- Use numbers only for calories, protein, carbs, fats, health_score.
- confidence must be between 0 and 1.
- health_score must be between 1 and 100.
- Return JSON only.
""",
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            temperature=0.2,
        )

        content = completion.choices[0].message.content or ""
        parsed = safe_json_parse(content)

        return parsed

    except Exception as e:
        print("GROQ VISION ERROR:", e)
        return None


def calculate_sleep_duration(sleep_time: str, wake_time: str):
    try:
        sleep_hour, sleep_minute = map(int, sleep_time.split(":"))
        wake_hour, wake_minute = map(int, wake_time.split(":"))

        sleep_total = sleep_hour * 60 + sleep_minute
        wake_total = wake_hour * 60 + wake_minute

        duration_minutes = wake_total - sleep_total

        if duration_minutes <= 0:
            duration_minutes += 24 * 60

        return round(duration_minutes / 60, 1)

    except Exception:
        return 7.0


def calculate_sleep_score(sleep_hours: float):
    if sleep_hours >= 8:
        return 95
    if sleep_hours >= 7:
        return 85
    if sleep_hours >= 6:
        return 72
    if sleep_hours >= 5:
        return 55
    return 40


def build_scan_response(
    filename: str,
    detected_food: str,
    calories: int,
    protein: int,
    carbs: int,
    fats: int,
    health_score: int,
    confidence: float,
    scanner_mode: str,
    message: str,
):
    return {
        "success": True,
        "scanner_mode": scanner_mode,
        "filename": filename,
        "detected_food": detected_food,
        "confidence": confidence,
        "estimated_nutrition": {
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fats": fats,
        },
        "health_score": health_score,
        "analysis": message,
        "warnings": [],
        "suggestions": [],
        "message": message,
    }


def filename_food_scan(filename: str):
    name = filename.lower()

    foods = {
        "dal": {"food": "Dal", "calories": 180, "protein": 10, "carbs": 28, "fats": 4, "health_score": 82},
        "daal": {"food": "Dal", "calories": 180, "protein": 10, "carbs": 28, "fats": 4, "health_score": 82},
        "rice": {"food": "Rice", "calories": 250, "protein": 5, "carbs": 55, "fats": 1, "health_score": 72},
        "roti": {"food": "Roti", "calories": 120, "protein": 4, "carbs": 22, "fats": 3, "health_score": 78},
        "chapati": {"food": "Chapati", "calories": 120, "protein": 4, "carbs": 22, "fats": 3, "health_score": 78},
        "paneer": {"food": "Paneer Curry", "calories": 310, "protein": 18, "carbs": 12, "fats": 20, "health_score": 75},
        "biryani": {"food": "Biryani", "calories": 450, "protein": 18, "carbs": 55, "fats": 18, "health_score": 65},
        "salad": {"food": "Salad", "calories": 120, "protein": 5, "carbs": 10, "fats": 4, "health_score": 90},
        "pizza": {"food": "Pizza", "calories": 420, "protein": 14, "carbs": 48, "fats": 18, "health_score": 62},
        "burger": {"food": "Burger", "calories": 520, "protein": 20, "carbs": 45, "fats": 28, "health_score": 55},
        "chicken": {"food": "Chicken Curry", "calories": 320, "protein": 26, "carbs": 10, "fats": 18, "health_score": 70},
        "fish": {"food": "Fish Curry", "calories": 280, "protein": 24, "carbs": 8, "fats": 16, "health_score": 74},
        "momo": {"food": "Momo", "calories": 300, "protein": 12, "carbs": 42, "fats": 9, "health_score": 68},
        "idli": {"food": "Idli", "calories": 160, "protein": 6, "carbs": 32, "fats": 1, "health_score": 86},
        "dosa": {"food": "Dosa", "calories": 220, "protein": 6, "carbs": 38, "fats": 6, "health_score": 78},
        "poha": {"food": "Poha", "calories": 250, "protein": 6, "carbs": 45, "fats": 7, "health_score": 76},
        "khichdi": {"food": "Khichdi", "calories": 280, "protein": 10, "carbs": 48, "fats": 6, "health_score": 84},
        "rajma": {"food": "Rajma", "calories": 280, "protein": 14, "carbs": 42, "fats": 6, "health_score": 82},
        "chole": {"food": "Chole", "calories": 300, "protein": 13, "carbs": 45, "fats": 8, "health_score": 78},
    }

    for key, item in foods.items():
        if key in name:
            return build_scan_response(
                filename=filename,
                detected_food=item["food"],
                calories=item["calories"],
                protein=item["protein"],
                carbs=item["carbs"],
                fats=item["fats"],
                health_score=item["health_score"],
                confidence=0.95,
                scanner_mode="filename_food_match",
                message="Food detected from filename.",
            )

    return None


def generic_fallback_scan(filename: str, reason: str):
    return build_scan_response(
        filename=filename,
        detected_food="Indian Meal",
        calories=320,
        protein=12,
        carbs=42,
        fats=10,
        health_score=75,
        confidence=0.65,
        scanner_mode="generic_fallback",
        message=f"Basic nutrition estimate used. Reason: {reason}",
    )


def try_groq_vision_scan(file_path: str, filename: str):
    try:
        groq_result = groq_vision_scan(file_path)

        if not groq_result:
            return None

        estimated = groq_result.get("estimated_nutrition", {})

        return build_scan_response(
            filename=filename,
            detected_food=groq_result.get("detected_food", "Detected Meal"),
            calories=int(estimated.get("calories", 320)),
            protein=int(estimated.get("protein", 12)),
            carbs=int(estimated.get("carbs", 42)),
            fats=int(estimated.get("fats", 10)),
            health_score=int(groq_result.get("health_score", 75)),
            confidence=float(groq_result.get("confidence", 0.8)),
            scanner_mode="groq_vision",
            message=groq_result.get("analysis", "Food scanned successfully with Groq Vision."),
        )

    except Exception as e:
        print("GROQ VISION ERROR:", e)
        return None


def try_gemini_vision_scan(file_path: str, filename: str):
    if not GEMINI_API_KEY or client is None:
        return None

    try:
        image = Image.open(file_path)

        prompt = """
You are an AI nutrition vision scanner.

Analyze the uploaded food image visually.
Identify the most likely Indian or general food item shown.

Return ONLY valid JSON in this exact structure:

{
  "detected_food": "food name",
  "confidence": 0.85,
  "estimated_nutrition": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "health_score": 0,
  "analysis": "short nutrition analysis",
  "warnings": [],
  "suggestions": []
}

Rules:
- Do not use the filename.
- Estimate nutrition for one normal serving.
- Use numbers only for calories, protein, carbs, fats, health_score.
- confidence must be between 0 and 1.
- health_score must be between 1 and 100.
- If unsure, still give your best estimate.
- Return JSON only. No markdown. No explanation outside JSON.
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[image, prompt],
        )

        raw_text = response.text or ""
        parsed = safe_json_parse(raw_text)

        if parsed is None:
            return None

        estimated = parsed.get("estimated_nutrition", {})

        return build_scan_response(
            filename=filename,
            detected_food=parsed.get("detected_food", "Detected Meal"),
            calories=int(estimated.get("calories", 320)),
            protein=int(estimated.get("protein", 12)),
            carbs=int(estimated.get("carbs", 42)),
            fats=int(estimated.get("fats", 10)),
            health_score=int(parsed.get("health_score", 75)),
            confidence=float(parsed.get("confidence", 0.8)),
            scanner_mode="gemini_vision",
            message=parsed.get("analysis", "Food scanned successfully with Gemini Vision."),
        )

    except Exception as e:
        print("GEMINI VISION ERROR:", e)
        return None


def create_safe_fallback_coach_message(
    user: UserData,
    bmi: float,
    calories: int,
    protein: int,
    carbs: int,
    fats: int,
    sleep_score: int,
    strategy_data: dict,
):
    diet_text = user.diet.replace("_", " ")
    strategy = strategy_data.get("strategy", "Balanced Maintenance")
    reason = strategy_data.get("reason", "")

    sleep_text = "Your sleep routine looks supportive."
    if sleep_score < 70:
        sleep_text = "Improve sleep consistency to support recovery, hormones, and energy."

    return (
        f"Your AI strategy is {strategy}. {reason} "
        f"Your plan uses a {diet_text} diet style with around {calories} kcal, "
        f"{protein}g protein, {carbs}g carbs, and {fats}g fats. "
        f"Focus on {', '.join(strategy_data.get('recommended_focus', ['consistency']))}. "
        f"{sleep_text}"
    )


@app.get("/")
def home():
    return {
        "message": "AI Nutrition OS Running 🚀",
        "status": "active",
        "version": "2.9.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "AI Nutrition OS backend is running",
        "dataset_loaded": dataset_loaded,
        "dataset_rows": len(df),
        "gemini_connected": GEMINI_API_KEY is not None,
        "groq_connected": GROQ_API_KEY is not None,
        "openrouter_connected": OPENROUTER_API_KEY is not None,
        "groq_service_available": generate_groq_coach_tip is not None,
        "ai_orchestrator_available": generate_ai_coach is not None and generate_ai_workout_tip is not None,
        "groq_vision_available": groq_client is not None,
        "scanner_priority": [
            "filename_food_match",
            "groq_vision",
            "gemini_vision",
            "generic_fallback",
        ],
        "coach_priority": [
            "openrouter_ai",
            "groq_ai",
            "rule_based_fallback",
        ],
        "quality_gate": [
            "metabolic_strategy",
            "dynamic_health_score",
            "diet_filter",
            "goal_filter",
            "duplicate_check",
            "meal_replacement",
            "safe_alternatives",
            "dynamic_workout_tip",
            "quality_scores",
        ],
        "detected_columns": {
            "food": food_col,
            "calories": calorie_col,
            "protein": protein_col,
            "type": type_col,
        },
        "routes": {
            "root": "/",
            "health": "/health",
            "generate_plan": "/generate-plan",
            "scan_food": "/scan-food",
            "docs": "/docs",
        },
    }


@app.post("/scan-food")
def scan_food(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    filename_result = filename_food_scan(file.filename)

    if filename_result:
        return filename_result

    groq_result = try_groq_vision_scan(
        file_path=file_path,
        filename=file.filename,
    )

    if groq_result:
        return groq_result

    gemini_result = try_gemini_vision_scan(
        file_path=file_path,
        filename=file.filename,
    )

    if gemini_result:
        return gemini_result

    return generic_fallback_scan(
        filename=file.filename,
        reason="Filename match, Groq Vision, and Gemini Vision could not detect the meal.",
    )


@app.post("/generate-plan")
def generate_plan(user: UserData):
    bmi = calculate_bmi(user.weight, user.height)

    medical_text = str(getattr(user, "medical_conditions", "") or "").lower()
    pregnancy_status = str(getattr(user, "pregnancy_status", "") or "").lower()
    safety_warnings = []

    # =====================================
    # CONTRADICTION + SAFETY VALIDATION
    # =====================================

    if (
        user.gender.lower() == "male"
        and pregnancy_status in ["pregnant", "pregnancy"]
    ):
        raise HTTPException(
            status_code=400,
            detail="Pregnancy status is incompatible with male gender.",
        )

    if bmi < 18.5 and user.goal == "fat_loss":
        raise HTTPException(
            status_code=400,
            detail="Fat loss is not recommended for underweight users. Please select maintenance or muscle gain.",
        )

    if user.age < 18 and user.goal == "fat_loss":
        raise HTTPException(
            status_code=400,
            detail="Aggressive fat loss is not recommended for child/adolescent profiles.",
        )

    if user.age >= 65 and user.activity == "high":
        user.activity = "low"
        safety_warnings.append(
            "High-intensity activity was adjusted to low-impact movement for elderly safety."
        )

    # =========================
    # Pregnancy Safety Override
    # =========================

    if (
        user.gender.lower() == "female"
        and pregnancy_status in ["pregnant", "pregnancy"]
    ):
        user.goal = "maintenance"
        safety_warnings.append(
            "Pregnancy noted: goal was safely changed to maintenance. Fat loss is not recommended during pregnancy."
        )

    # Hydration safety boost
    if pregnancy_status in ["pregnant", "pregnancy"]:
        user.water_intake = max(user.water_intake, 3.0)

    sleep_hours = getattr(user, "sleep_hours", None)

    if sleep_hours is None:
        sleep_hours = calculate_sleep_duration(
            getattr(user, "sleep_time", "23:00"),
            getattr(user, "wake_time", "07:00"),
        )

    sleep_score = calculate_sleep_score(float(sleep_hours))

    bmr = calculate_bmr(
        user.weight,
        user.height,
        user.age,
        user.gender,
    )

    tdee = calculate_tdee(
        bmr,
        user.activity,
    )

    body_fat = calculate_body_fat(
        bmi,
        user.age,
        user.gender,
    )

    strategy_data = determine_metabolic_strategy(
        bmi=bmi,
        goal=user.goal,
        activity=user.activity,
        body_fat=body_fat,
    )

    strategy = strategy_data["strategy"]

    calories = round(
        tdee + strategy_data["calorie_adjustment"]
    )

    if user.gender == "female":
        calories = max(calories, 1200)
    else:
        calories = max(calories, 1500)

    protein = round(
        user.weight * strategy_data["protein_multiplier"]
    )

    if user.diet == "vegan":
        protein = min(protein, 125)
    elif user.diet == "vegetarian":
        protein = min(protein, 150)
    else:
        protein = min(protein, 170)

    fats = round((calories * 0.25) / 9)

    remaining_calories = calories - ((protein * 4) + (fats * 9))
    carbs = round(remaining_calories / 4)

    carbs = max(carbs, 100)
    fats = max(fats, 35)

    # =====================================
    # MEDICAL MACRO SAFETY OVERRIDES
    # =====================================

    if "kidney" in medical_text or "renal" in medical_text:
        safe_kidney_protein = round(user.weight * 0.8)
        old_protein = protein
        protein = min(protein, safe_kidney_protein)
        calories -= max(0, old_protein - protein) * 4
        safety_warnings.append(
            "Kidney-related condition noted: protein was conservatively capped."
        )

    if "diabetes" in medical_text or "diabetic" in medical_text:
        carbs = round(carbs * 0.75)
        carbs = max(carbs, 80)
        safety_warnings.append(
            "Diabetes noted: carbohydrate target was reduced for better glycemic control."
        )

    metabolic_age = calculate_metabolic_age(
        bmr,
        user.age,
    )

    hydration_score = calculate_hydration_score(
        user.water_intake,
    )

    water_target = round(user.weight * 0.035, 1)

    if user.activity == "high":
        water_target += 0.5
    elif user.activity == "low":
        water_target -= 0.2

    if user.goal == "fat_loss":
        water_target += 0.2

    water_target = max(1.8, min(3.8, water_target))

    if pregnancy_status in ["pregnant", "pregnancy"]:
        water_target = max(water_target, 3.0)
        safety_warnings.append(
            "Pregnancy noted: hydration target was increased to support safer daily intake."
        )

    macro_ratio = calculate_macro_ratio(
        protein,
        carbs,
        fats,
    )

    meal_plan = generate_nutrition_plan(
        df=df,
        user=user,
        food_col=food_col,
        calorie_col=calorie_col,
        protein_col=protein_col,
        type_col=type_col,
        bmi=bmi,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
    )

    avoid_foods = generate_avoid_foods(
        bmi=bmi,
        goal=user.goal,
        medical_conditions=user.medical_conditions,
    )

    fallback_coach_message = create_safe_fallback_coach_message(
        user=user,
        bmi=bmi,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        sleep_score=sleep_score,
        strategy_data=strategy_data,
    )

    user_profile_for_ai = {
        "name": getattr(user, "name", ""),
        "weight": user.weight,
        "height": user.height,
        "age": user.age,
        "gender": user.gender,
        "goal": user.goal,
        "diet": user.diet,
        "activity": user.activity,
        "days": user.days,
        "sleep_time": getattr(user, "sleep_time", "23:00"),
        "wake_time": getattr(user, "wake_time", "07:00"),
        "sleep_hours": sleep_hours,
        "fitness_level": getattr(user, "fitness_level", "beginner"),
        "preferred_cuisine": getattr(user, "preferred_cuisine", "indian"),
        "medical_conditions": getattr(user, "medical_conditions", ""),
        "pregnancy_status": getattr(user, "pregnancy_status", ""),
        "metabolic_strategy": strategy,
        "strategy_reason": strategy_data.get("reason", ""),
    }

    analytics_for_ai = {
        "bmi": bmi,
        "bmr": bmr,
        "tdee": tdee,
        "body_fat": body_fat,
        "hydration_score": hydration_score,
        "sleep_score": sleep_score,
        "metabolic_strategy": strategy,
        "strategy_reason": strategy_data.get("reason", ""),
    }

    targets_for_ai = {
        "calories": calories,
        "protein": protein,
        "carbs": carbs,
        "fats": fats,
    }

    ai_coach_message = None
    groq_message = None

    if generate_ai_coach is not None:
        ai_coach_message = generate_ai_coach(
            user,
            groq_fallback=generate_groq_coach_tip,
        )
    elif generate_groq_coach_tip is not None:
        groq_message = generate_groq_coach_tip(
            user_profile=user_profile_for_ai,
            analytics=analytics_for_ai,
            targets=targets_for_ai,
        )

    coach_message = ai_coach_message or groq_message or fallback_coach_message

    if ai_coach_message:
        coach_mode = "openrouter_ai"
    elif groq_message:
        coach_mode = "groq_ai"
    else:
        coach_mode = "rule_based_fallback"

    health_result = calculate_dynamic_health_score(
        bmi=bmi,
        activity=user.activity,
        hydration_score=hydration_score,
        sleep_score=sleep_score,
        medical_conditions=user.medical_conditions,
        goal=user.goal,
        age=user.age,
    )

    health_score = health_result["score"]
    health_breakdown = health_result["breakdown"]
    health_status = health_result["status"]

    if isinstance(meal_plan, dict):
        meal_days = meal_plan.get("days", [])
    elif isinstance(meal_plan, list):
        meal_days = meal_plan
    else:
        meal_days = []

    clean_meal_days = sanitize_meal_days(
        meal_days=meal_days,
        user=user,
        bmi=bmi,
    )

    medical_safety_result = apply_medical_safety_filter(
        meal_days=clean_meal_days,
        medical_conditions=getattr(user, "medical_conditions", ""),
        bmi=bmi,
    )

    clean_meal_days = medical_safety_result["safe_meal_days"]
    medical_flags = medical_safety_result["medical_flags"]
    foods_replaced = medical_safety_result["foods_replaced"]
    medical_safety_score = medical_safety_result["safety_score"]

    quality_scores = calculate_plan_quality_scores(
        meal_days=clean_meal_days,
        user=user,
        bmi=bmi,
    )

    daily_routine = generate_daily_routine(
        user=user,
        goal=user.goal,
    )

    targets = {
        "calories": calories,
        "protein": protein,
        "carbs": carbs,
        "fats": fats,
    }

    elderly_safety_result = apply_elderly_safety_filter(
        meal_days=clean_meal_days,
        user=user,
        targets=targets,
        daily_routine=daily_routine,
    )

    clean_meal_days = elderly_safety_result["meal_days"]
    targets = elderly_safety_result["targets"]
    daily_routine = elderly_safety_result["daily_routine"]

    if generate_ai_workout_tip is not None:
        workout_tip = generate_ai_workout_tip(
            user,
            groq_fallback=generate_groq_coach_tip,
        )
    else:
        workout_tip = daily_routine.get(
            "workout_time",
            "6:00 PM - Moderate activity: walking, mobility, and light strength training.",
        )

    for day in clean_meal_days:
        day["workout_tip"] = workout_tip

    calories = targets["calories"]
    protein = targets["protein"]
    carbs = targets["carbs"]
    fats = targets["fats"]

    quality_scores = calculate_plan_quality_scores(
        meal_days=clean_meal_days,
        user=user,
        bmi=bmi,
    )

    macro_ratio = calculate_macro_ratio(
        protein,
        carbs,
        fats,
    )

    medical_notes = []

    if safety_warnings:
        medical_notes.extend(safety_warnings)

    if "diabetes" in medical_text or "sugar" in medical_text:
        medical_notes.append(
            "Because you mentioned diabetes, this plan avoids refined sugary foods and focuses on high-fiber, low-glycemic meals."
        )

    if "low bp" in medical_text or "low blood pressure" in medical_text:
        medical_notes.append(
            "Because you mentioned low BP, maintain hydration, avoid long fasting gaps, and choose gentle recovery-focused movement."
        )

    if "thyroid" in medical_text:
        medical_notes.append(
            "If taking thyroid medication, keep soy/tofu and calcium-rich foods away from medication timing."
        )

    if user.age >= 65:
        medical_notes.append(
            "Since this is an elderly profile, workouts are kept low-impact with mobility, balance, and recovery focus."
        )

    if medical_notes:
        coach_message = (
            " ".join(medical_notes)
            + f" Target around {calories} kcal with {protein}g protein, {carbs}g carbs, and {fats}g fats."
        )

    ai_tip = coach_message

    analytics_data = {
        "bmi": bmi,
        "bmr": bmr,
        "tdee": tdee,
        "body_fat": body_fat,
        "metabolic_age": metabolic_age,
        "hydration_score": hydration_score,
        "sleep_score": sleep_score,
        "health_score": health_score,
        "health_status": health_status,
        "health_breakdown": health_breakdown,
        "macro_ratio": macro_ratio,
        "metabolic_strategy": strategy,
        "strategy_details": strategy_data,
    }

    if generate_health_insight is not None:
        health_insight = generate_health_insight(
            user,
            analytics=analytics_data,
            groq_fallback=generate_groq_coach_tip,
        )
    else:
        health_insight = (
            f"Your health score is {health_score}/100 ({health_status}). "
            f"Focus on hydration, sleep consistency, and plan adherence."
        )

    return {
        "success": True,
        "ai_mode": coach_mode,
        "quality_scores": quality_scores,
        "safety_warnings": list(dict.fromkeys(safety_warnings)),
        "medical_safety": {
            "flags": medical_flags,
            "foods_replaced": foods_replaced,
            "safety_score": medical_safety_score,
        },
        "elderly_safety": {
            "warnings": elderly_safety_result["warnings"],
            "changes": elderly_safety_result["changes"],
            "safety_score": elderly_safety_result["safety_score"],
        },
        "user_profile": {
            "name": getattr(user, "name", ""),
            "phone_number": getattr(user, "phone_number", ""),
            "email": getattr(user, "email", ""),
            "city": getattr(user, "city", ""),
            "blood_group": getattr(user, "blood_group", ""),
            "weight": user.weight,
            "height": user.height,
            "age": user.age,
            "gender": user.gender,
            "goal": user.goal,
            "diet": user.diet,
            "activity": user.activity,
            "days": user.days,
            "sleep_time": getattr(user, "sleep_time", "23:00"),
            "wake_time": getattr(user, "wake_time", "07:00"),
            "sleep_hours": sleep_hours,
            "water_intake": user.water_intake,
            "fitness_level": getattr(user, "fitness_level", "beginner"),
            "preferred_cuisine": getattr(user, "preferred_cuisine", "indian"),
            "medical_conditions": user.medical_conditions,
            "pregnancy_status": getattr(user, "pregnancy_status", ""),
        },
        "analytics": analytics_data,
        "health_insight": health_insight,
        "targets": {
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fats": fats,
            "water_target": f"{water_target:.1f} Liters Daily",
        },
        "meal_plan": {
            "days": clean_meal_days,
        },
        "avoid_foods": avoid_foods,
        "coach_message": coach_message,
        "ai_tip": ai_tip,
        "daily_routine": daily_routine,
        "grocery_list": [],
        "scanner": {
            "enabled": True,
            "endpoint": "/scan-food",
        },
    }