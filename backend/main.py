import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import os
import shutil
import json
import base64
from datetime import datetime
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

try:
    from services.medical_warning_engine import analyze_medical_risk
except Exception:
    analyze_medical_risk = None

try:
    from services.history_service import save_nutrition_plan
except Exception:
    save_nutrition_plan = None

from routes.nutrition_routes import router as nutrition_router
from routes.scanner_routes import router as scanner_router
from routes.analytics_routes import router as analytics_router

try:
    from routes.history_routes import router as history_router
except Exception:
    history_router = None

try:
    from routes.progress_routes import router as progress_router
except Exception as e:
    print("PROGRESS ROUTER IMPORT ERROR:", e)
    progress_router = None


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
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ai-nutrition-os.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

BACKEND_PUBLIC_URL = os.getenv("BACKEND_PUBLIC_URL", "http://127.0.0.1:8000").rstrip("/")

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

if history_router:
    app.include_router(history_router)

if progress_router:
    app.include_router(progress_router)


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
    "fats": 0,
    "fiber": 0,
    "sugar": 0,
    "sodium": 0,
    "saturated_fat": 0
  },
  "micronutrients": {
    "calcium": 0,
    "iron": 0,
    "vitamin_a": 0,
    "vitamin_c": 0,
    "potassium": 0,
    "magnesium": 0
  },
  "meal_type": "Main Course",
  "best_time_to_eat": "12:00 PM - 2:00 PM",
  "health_score": 0,
  "analysis": "short nutrition analysis",
  "warnings": [],
  "suggestions": []
}

Rules:
- Estimate one normal serving.
- Use numbers only for all nutrition and micronutrient values.
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




SCAN_HISTORY_PATH = BASE_DIR / "database" / "scan_history.json"


FOOD_INTELLIGENCE_DB = [
    {
        "keys": ["samosa", "singara"],
        "category": "fried_snack",
        "meal_type": "Snack",
        "best_time": "4:00 PM - 6:00 PM",
        "min": {"calories": 300, "carbs": 32, "fats": 14, "sodium": 520, "saturated_fat": 3},
        "max": {"health_score": 48, "potassium": 35, "vitamin_c": 8},
        "micros": {"calcium": 8, "iron": 18, "vitamin_a": 5, "vitamin_c": 3, "potassium": 22, "magnesium": 14},
        "suggestions": ["Bake instead of frying for a healthier option.", "Pair with mint chutney and avoid extra fried sides.", "Keep portion size controlled."],
        "warnings": ["High refined carbs", "Fried food", "Moderate sodium"],
    },
    {
        "keys": ["vada pav", "vada pao", "vada-pav"],
        "category": "street_food",
        "meal_type": "Street Food",
        "best_time": "4:00 PM - 6:00 PM",
        "min": {"calories": 350, "carbs": 40, "fats": 15, "sodium": 650, "saturated_fat": 3},
        "max": {"health_score": 60, "potassium": 40, "vitamin_c": 10},
        "micros": {"calcium": 12, "iron": 20, "vitamin_a": 8, "vitamin_c": 6, "potassium": 30, "magnesium": 18},
        "suggestions": ["Consider adding vegetables for extra fiber and nutrients.", "Choose grilled or baked snacks when possible.", "Avoid pairing with sugary drinks."],
        "warnings": ["High sodium content", "Fried potato filling"],
    },
    {
        "keys": ["pani puri", "panipuri", "golgappa", "phuchka", "puchka", "pani puri", "chaat"],
        "category": "chaat_snack",
        "meal_type": "Snack",
        "best_time": "4:00 PM - 6:00 PM",
        "min": {
            "calories": 180,
            "carbs": 28,
            "fats": 6,
            "sodium": 550,
        },
        "max": {
            "protein": 3,
            "health_score": 58,
            "potassium": 30,
            "vitamin_c": 15,
        },
        "micros": {
            "calcium": 10,
            "iron": 14,
            "vitamin_a": 6,
            "vitamin_c": 10,
            "potassium": 24,
            "magnesium": 12,
        },
        "suggestions": [
            "Limit portions because chaat water and fillings can be high in sodium.",
            "Choose homemade pani with less salt when possible.",
            "Avoid pairing with extra fried snacks or sugary drinks.",
        ],
        "warnings": [
            "High sodium",
            "Refined carbs",
            "Street food hygiene risk",
        ],
    },
    {
        "keys": ["tea", "cookie", "cookies", "biscuit", "biscuits"],
        "category": "sweet_snack",
        "meal_type": "Snack",
        "best_time": "10:00 AM - 11:00 AM / 4:00 PM - 6:00 PM",
        "min": {"calories": 130, "carbs": 24, "sugar": 12, "sodium": 80},
        "max": {"protein": 5, "health_score": 45, "potassium": 15, "vitamin_c": 5},
        "micros": {"calcium": 12, "iron": 8, "vitamin_a": 3, "vitamin_c": 1, "potassium": 8, "magnesium": 7},
        "suggestions": ["Balance it with nuts, fruit, or a protein-rich snack.", "Avoid making this a frequent standalone meal.", "Choose low-sugar biscuits when possible."],
        "warnings": ["High sugar content", "Low protein", "Low fiber"],
    },
    {
        "keys": ["lasagna", "lasagne"],
        "category": "cheese_pasta",
        "meal_type": "Main Course",
        "best_time": "12:00 PM - 2:00 PM / 7:00 PM - 8:30 PM",
        "min": {"calories": 520, "carbs": 45, "fats": 22, "sodium": 750, "saturated_fat": 9},
        "max": {"health_score": 65, "potassium": 45, "vitamin_c": 12},
        "micros": {"calcium": 28, "iron": 20, "vitamin_a": 18, "vitamin_c": 8, "potassium": 32, "magnesium": 18},
        "suggestions": ["Pair with a side salad for added fiber and freshness.", "Keep cheese-heavy portions moderate.", "Avoid extra creamy sauces."],
        "warnings": ["High saturated fat", "High sodium", "Calorie dense"],
    },
    {
        "keys": ["dal", "daal", "lentil", "lentils", "dal tadka", "yellow dal", "moong dal", "masoor dal", "lentil soup"],
        "category": "lentil_main",
        "meal_type": "Light Meal",
        "best_time": "12:00 PM - 2:00 PM / 7:00 PM - 8:30 PM",
        "min": {"calories": 170, "protein": 9, "carbs": 24, "fiber": 4, "sodium": 250},
        "max": {"calories": 320, "protein": 16, "fats": 8, "sodium": 500, "health_score": 88},
        "micros": {"calcium": 22, "iron": 32, "vitamin_a": 18, "vitamin_c": 12, "potassium": 35, "magnesium": 32},
        "suggestions": ["Pair with vegetables or salad for better fiber balance.", "Keep portion size aligned with your daily goal.", "Use less oil in tadka when possible."],
        "warnings": [],
    },
    {
        "keys": ["plain rice", "steamed rice", "boiled rice", "white rice", "rice"],
        "category": "plain_rice",
        "meal_type": "Light Meal",
        "best_time": "12:00 PM - 2:00 PM",
        "min": {"calories": 220, "carbs": 45},
        "max": {"protein": 6, "fats": 3, "sodium": 60, "health_score": 76},
        "micros": {"calcium": 6, "iron": 10, "vitamin_a": 2, "vitamin_c": 1, "potassium": 14, "magnesium": 18},
        "suggestions": ["Pair rice with dal, beans, curd, or vegetables to improve protein and fiber.", "Keep portion size balanced with your goal."],
        "warnings": ["High carb base if eaten alone"],
    },
    {
        "keys": ["indian thali", "thali"],
        "category": "balanced_indian_meal",
        "meal_type": "Main Course",
        "best_time": "12:00 PM - 2:00 PM / 7:00 PM - 8:30 PM",
        "min": {"calories": 650, "protein": 18, "carbs": 70, "sodium": 650},
        "max": {"potassium": 55},
        "micros": {"calcium": 35, "iron": 30, "vitamin_a": 40, "vitamin_c": 35, "potassium": 55, "magnesium": 40},
        "suggestions": ["Keep rice/roti portions balanced.", "Add more dal or curd for protein.", "Choose less oily sabzi when possible."],
        "warnings": ["High carb content"],
    },
    {
        "keys": ["egg", "quinoa", "mushroom", "cucumber", "tomato"],
        "category": "high_protein_bowl",
        "meal_type": "Light Meal",
        "best_time": "8:00 AM - 11:00 AM / Post-workout",
        "min": {"calories": 320, "protein": 20, "fiber": 5},
        "max": {"calories": 450, "sodium": 450},
        "micros": {"calcium": 25, "iron": 30, "vitamin_a": 28, "vitamin_c": 35, "potassium": 38, "magnesium": 32},
        "suggestions": ["Consider adding more herbs for extra antioxidants.", "Keep portion size aligned with your daily goal."],
        "warnings": [],
    },
    {
        "keys": ["salad", "fruit salad", "chickpea salad"],
        "category": "vegetable_heavy",
        "meal_type": "Light Meal",
        "best_time": "10:00 AM - 12:00 PM / 4:00 PM - 6:00 PM",
        "min": {"fiber": 7},
        "max": {"calories": 350, "fats": 14, "sodium": 350},
        "micros": {"calcium": 28, "iron": 22, "vitamin_a": 45, "vitamin_c": 55, "potassium": 45, "magnesium": 30},
        "suggestions": ["Add a protein source to improve satiety.", "Use light dressing to control fats."],
        "warnings": [],
    },
    {
        "keys": ["pizza", "burger"],
        "category": "fast_food",
        "meal_type": "Main Course",
        "best_time": "12:00 PM - 2:00 PM",
        "min": {"calories": 480, "fats": 22, "sodium": 850, "saturated_fat": 8},
        "max": {"health_score": 58, "potassium": 40},
        "micros": {"calcium": 25, "iron": 18, "vitamin_a": 12, "vitamin_c": 6, "potassium": 30, "magnesium": 18},
        "suggestions": ["Choose grilled or whole-grain alternatives.", "Add salad and avoid sugary drinks."],
        "warnings": ["High sodium", "High saturated fat", "Calorie dense"],
    },
    {
        "keys": ["biryani"],
        "category": "rice_main",
        "meal_type": "Main Course",
        "best_time": "12:00 PM - 2:00 PM",
        "min": {"calories": 520, "carbs": 60, "sodium": 700},
        "max": {"health_score": 68},
        "micros": {"calcium": 18, "iron": 26, "vitamin_a": 18, "vitamin_c": 10, "potassium": 34, "magnesium": 22},
        "suggestions": ["Pair with raita or salad.", "Keep rice portion controlled."],
        "warnings": ["High carb content", "Moderate sodium"],
    },
    {
        "keys": ["paneer butter", "paneer curry", "paneer"],
        "category": "creamy_curry",
        "meal_type": "Main Course",
        "best_time": "12:00 PM - 2:00 PM / 7:00 PM - 8:30 PM",
        "min": {"calories": 360, "protein": 18, "fats": 22, "sodium": 550, "saturated_fat": 10},
        "max": {"health_score": 76},
        "micros": {"calcium": 45, "iron": 16, "vitamin_a": 20, "vitamin_c": 10, "potassium": 28, "magnesium": 18},
        "suggestions": ["Balance with roti and salad instead of extra rice.", "Use less cream or butter when possible."],
        "warnings": ["High saturated fat"],
    },
]


def clamp_number(value, minimum, maximum, fallback):
    try:
        value = float(value)
        return round(max(minimum, min(maximum, value)))
    except Exception:
        return round(max(minimum, min(maximum, fallback)))


def normalize_food_text(text: str):
    return str(text or "").lower().replace("_", " ").replace("-", " ").strip()


def get_food_profile(detected_food: str):
    food_text = normalize_food_text(detected_food)

    matched_profile = None
    matched_score = 0

    for profile in FOOD_INTELLIGENCE_DB:
        score = sum(1 for key in profile["keys"] if key in food_text)
        if score > matched_score:
            matched_profile = profile
            matched_score = score

    return matched_profile


def apply_food_intelligence(detected_food, calories, protein, carbs, fats, health_score, extra_nutrition=None, micronutrients=None, meal_type=None, best_time_to_eat=None, warnings=None, suggestions=None):
    profile = get_food_profile(detected_food)
    extra_nutrition = dict(extra_nutrition or {})
    micronutrients = dict(micronutrients or {})
    warnings = list(warnings or [])
    suggestions = list(suggestions or [])

    values = {
        "calories": int(calories or 0),
        "protein": int(protein or 0),
        "carbs": int(carbs or 0),
        "fats": int(fats or 0),
        "health_score": int(health_score or 75),
    }

    if profile:
        for key, minimum in profile.get("min", {}).items():
            if key in values:
                values[key] = max(values[key], int(minimum))
            else:
                extra_nutrition[key] = max(int(extra_nutrition.get(key, 0) or 0), int(minimum))

        for key, maximum in profile.get("max", {}).items():
            if key in values:
                values[key] = min(values[key], int(maximum))
            else:
                existing = extra_nutrition.get(key)
                if existing is not None:
                    extra_nutrition[key] = min(int(existing), int(maximum))

        if not meal_type:
            meal_type = profile.get("meal_type")

        if not best_time_to_eat:
            best_time_to_eat = profile.get("best_time")

        for key, value in profile.get("micros", {}).items():
            micronutrients[key] = clamp_number(micronutrients.get(key), 1, 60, value)

        warnings.extend(profile.get("warnings", []))
        suggestions.extend(profile.get("suggestions", []))

    warnings = list(dict.fromkeys([w for w in warnings if w]))
    suggestions = list(dict.fromkeys([s for s in suggestions if s]))

    return {
        "calories": values["calories"],
        "protein": values["protein"],
        "carbs": values["carbs"],
        "fats": values["fats"],
        "health_score": max(1, min(100, values["health_score"])),
        "extra_nutrition": extra_nutrition,
        "micronutrients": micronutrients,
        "meal_type": meal_type,
        "best_time_to_eat": best_time_to_eat,
        "warnings": warnings,
        "suggestions": suggestions,
        "food_category": profile.get("category") if profile else "general_meal",
    }


def build_extended_nutrition(calories, protein, carbs, fats, extra=None):
    extra = extra or {}

    fiber = clamp_number(
        extra.get("fiber"),
        1,
        30,
        max(3, round((carbs * 0.12) + (protein * 0.02))),
    )
    sugar = clamp_number(
        extra.get("sugar"),
        0,
        50,
        max(2, round(carbs * 0.18)),
    )
    sodium = clamp_number(
        extra.get("sodium"),
        50,
        2000,
        max(180, round(180 + (fats * 12) + (calories * 0.45))),
    )
    saturated_fat = clamp_number(
        extra.get("saturated_fat"),
        0,
        30,
        max(1, round(fats * 0.34)),
    )

    return {
        "calories": int(calories),
        "protein": int(protein),
        "carbs": int(carbs),
        "fats": int(fats),
        "fiber": int(fiber),
        "sugar": int(sugar),
        "sodium": int(sodium),
        "saturated_fat": int(saturated_fat),
    }


def build_micronutrients(protein, carbs, fats, fiber, direct=None, food_category="general_meal"):
    direct = direct or {}

    category_caps = {
        "fried_snack": {"calcium": 30, "iron": 35, "vitamin_a": 20, "vitamin_c": 10, "potassium": 35, "magnesium": 25},
        "street_food": {"calcium": 35, "iron": 35, "vitamin_a": 25, "vitamin_c": 15, "potassium": 40, "magnesium": 28},
        "chaat_snack": {"calcium": 25, "iron": 25, "vitamin_a": 15, "vitamin_c": 20, "potassium": 30, "magnesium": 22},
        "sweet_snack": {"calcium": 25, "iron": 20, "vitamin_a": 10, "vitamin_c": 5, "potassium": 15, "magnesium": 18},
        "cheese_pasta": {"calcium": 40, "iron": 35, "vitamin_a": 25, "vitamin_c": 15, "potassium": 45, "magnesium": 25},
        "lentil_main": {
            "vegetarian": ("Moong Dal Chilla with Salad", "/assets/scanner/moong-dal-chilla-salad.png"),
            "vegan": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "non_vegetarian": ("Grilled Fish with Steamed Veg", "/assets/scanner/grilled-fish-steamed-veg.png"),
        },
        "plain_rice": {
            "vegetarian": ("Rajma Rice Bowl with Salad", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "vegan": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "non_vegetarian": ("Grilled Chicken with Brown Rice", "/assets/scanner/grilled-chicken-brown-rice.png"),
        },
        "balanced_indian_meal": {"calcium": 55, "iron": 45, "vitamin_a": 55, "vitamin_c": 45, "potassium": 55, "magnesium": 45},
        "high_protein_bowl": {"calcium": 45, "iron": 45, "vitamin_a": 45, "vitamin_c": 55, "potassium": 50, "magnesium": 45},
        "vegetable_heavy": {"calcium": 45, "iron": 40, "vitamin_a": 60, "vitamin_c": 60, "potassium": 55, "magnesium": 45},
        "fast_food": {"calcium": 35, "iron": 30, "vitamin_a": 20, "vitamin_c": 12, "potassium": 40, "magnesium": 25},
        "lentil_main": {"calcium": 40, "iron": 45, "vitamin_a": 30, "vitamin_c": 25, "potassium": 45, "magnesium": 45},
        "plain_rice": {"calcium": 15, "iron": 20, "vitamin_a": 5, "vitamin_c": 5, "potassium": 25, "magnesium": 30},
        "general_meal": {"calcium": 55, "iron": 50, "vitamin_a": 55, "vitamin_c": 55, "potassium": 55, "magnesium": 50},
    }

    caps = category_caps.get(food_category, category_caps["general_meal"])

    raw = {
        "calcium": 18 + (protein * 0.45) + (fiber * 0.6),
        "iron": 12 + (protein * 0.35) + (fats * 0.1),
        "vitamin_a": 18 + (fiber * 2.1) + (carbs * 0.08),
        "vitamin_c": 10 + (fiber * 1.8),
        "potassium": 16 + (carbs * 0.35) + (protein * 0.15),
        "magnesium": 12 + (protein * 0.28) + (fiber * 1.1),
    }

    result = {}
    for key, fallback in raw.items():
        result[key] = clamp_number(
            direct.get(key),
            1,
            caps.get(key, 55),
            fallback,
        )

    return result


def infer_meal_type(calories, protein, carbs, fats):
    """
    Classify meal size from energy density first, then macro load.
    This prevents healthy protein bowls around 300-420 kcal from being mislabeled as snacks
    or full main courses only because protein is high.
    """
    calories = int(calories or 0)
    protein = int(protein or 0)
    carbs = int(carbs or 0)
    fats = int(fats or 0)

    if calories >= 500:
        return "Main Course"

    if calories >= 300:
        return "Light Meal"

    if calories >= 220 and (protein >= 12 or carbs >= 25):
        return "Light Meal"

    return "Snack"


def infer_best_time_to_eat(meal_type, calories, carbs, fats):
    calories = int(calories or 0)
    carbs = int(carbs or 0)
    fats = int(fats or 0)

    if meal_type == "Main Course":
        if fats >= 25 or calories >= 550:
            return "12:00 PM - 2:00 PM"
        return "12:00 PM - 2:00 PM / 7:00 PM - 8:30 PM"

    if meal_type in ["Light Meal", "Street Food"]:
        if carbs >= 35:
            return "8:00 AM - 10:00 AM / 12:00 PM - 2:00 PM"
        return "10:00 AM - 12:00 PM / Post-workout"

    return "4:00 PM - 6:00 PM"


def impact_status(value):
    value = int(value or 0)
    if value >= 78:
        return "High"
    if value >= 62:
        return "Good"
    if value >= 45:
        return "Moderate"
    return "Low"


def build_health_impact(calories, protein, carbs, fats, health_score, estimated_nutrition, meal_type, best_time_to_eat, food_category="general_meal", suggestions=None, message=""):
    """
    Backend-owned UI intelligence for NutritionIntelligence.tsx.
    The frontend should render these values directly instead of recalculating labels.
    """
    calories = int(calories or 0)
    protein = int(protein or 0)
    carbs = int(carbs or 0)
    fats = int(fats or 0)
    health_score = int(health_score or 75)
    estimated_nutrition = estimated_nutrition or {}

    fiber = int(estimated_nutrition.get("fiber", 0) or 0)
    sugar = int(estimated_nutrition.get("sugar", 0) or 0)
    sodium = int(estimated_nutrition.get("sodium", 0) or 0)
    saturated_fat = int(estimated_nutrition.get("saturated_fat", 0) or 0)

    muscle_growth = clamp_number(35 + protein * 1.8, 20, 95, 55)
    fat_loss = clamp_number(96 - calories * 0.065 - fats * 0.65 + protein * 0.4 + fiber * 0.6, 30, 92, 65)
    recovery = clamp_number(45 + protein * 1.45 + carbs * 0.18, 30, 92, 60)
    energy = clamp_number(40 + carbs * 0.72 + calories * 0.018, 35, 90, 60)
    heart_health = clamp_number(90 - saturated_fat * 2.3 - sodium * 0.022 + fiber * 1.35, 25, 90, 65)
    digestive_health = clamp_number(45 + fiber * 5.2 - sugar * 0.38, 35, 90, 55)

    metrics = [
        {"key": "muscle_growth", "label": "Muscle Growth", "value": muscle_growth, "status": impact_status(muscle_growth), "color": "#8CFF2F"},
        {"key": "fat_loss", "label": "Fat Loss", "value": fat_loss, "status": impact_status(fat_loss), "color": "#A6FF4D"},
        {"key": "recovery", "label": "Recovery", "value": recovery, "status": impact_status(recovery), "color": "#18D3D0"},
        {"key": "energy", "label": "Energy", "value": energy, "status": impact_status(energy), "color": "#FFE234"},
        {"key": "heart_health", "label": "Heart Health", "value": heart_health, "status": impact_status(heart_health), "color": "#FF7A1A"},
        {"key": "digestive_health", "label": "Digestive Health", "value": digestive_health, "status": impact_status(digestive_health), "color": "#A96BFF"},
    ]

    if "post" in str(best_time_to_eat).lower():
        best_time_label = "Breakfast / Post workout"
    elif meal_type == "Main Course":
        best_time_label = "Lunch / Dinner"
    elif meal_type == "Light Meal":
        best_time_label = "Breakfast / Light meal"
    elif meal_type in ["Beverage", "Drink"]:
        best_time_label = "Snack / Beverage"
    else:
        best_time_label = "Snack / Small meal"

    if suggestions:
        pro_tip = suggestions[0]
    elif sodium > 650:
        pro_tip = "Keep sodium balanced and pair this with water and vegetables."
    elif protein < 12:
        pro_tip = "Add a protein source to improve satiety and recovery support."
    elif fiber < 4:
        pro_tip = "Pair with salad or vegetables for better fiber balance."
    else:
        pro_tip = "This meal is reasonably balanced. Keep portion size aligned with your goal."

    return {
        "overall_score": health_score,
        "summary": message or "Backend-calculated health impact based on macros and extended nutrition.",
        "metrics": metrics,
        "meal_type": meal_type,
        "best_time_to_eat": best_time_to_eat,
        "best_time_label": best_time_label,
        "pro_tip": pro_tip,
        "source": "backend_calculated",
        "inputs_used": ["calories", "protein", "carbs", "fats", "fiber", "sugar", "sodium", "saturated_fat", "health_score"],
    }


def build_recommendations(calories, protein, carbs, fats, health_score, food_category="general_meal"):
    """
    Backend-owned scanner recommendations.
    Each option is intentionally healthier than the scanned meal:
    - vegetarian: plant protein + lower fat + higher fiber
    - vegan: fully plant based + balanced carbs + high fiber
    - non_vegetarian: lean protein + controlled fats
    """
    calories = int(calories or 0)
    protein = int(protein or 0)
    carbs = int(carbs or 0)
    fats = int(fats or 0)
    health_score = int(health_score or 75)

    recommendation_sets = {
        "fried_snack": {
            "vegetarian": ("Baked Moong Dal Chilla with Salad", "/assets/scanner/moong-dal-chilla-salad.png"),
            "vegan": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "non_vegetarian": ("Grilled Chicken with Brown Rice", "/assets/scanner/grilled-chicken-brown-rice.png"),
        },
        "street_food": {
            "vegetarian": ("Veggie Stir Fry with Tofu", "/assets/scanner/veggie-stir-fry-tofu.png"),
            "vegan": ("Lemon Herb Tofu with Quinoa", "/assets/scanner/lemon-herb-tofu-quinoa.png"),
            "non_vegetarian": ("Grilled Chicken with Brown Rice", "/assets/scanner/grilled-chicken-brown-rice.png"),
        },
        "chaat_snack": {
            "vegetarian": ("Moong Dal Chilla with Salad", "/assets/scanner/moong-dal-chilla-salad.png"),
            "vegan": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "non_vegetarian": ("Egg White Veggie Bowl", "/assets/scanner/egg-white-veggie-bowl.png"),
        },
        "sweet_snack": {
            "vegetarian": ("Greek Yogurt Fruit Bowl", "/assets/scanner/healthy-salad-bowl-glow.png"),
            "vegan": ("Fruit & Nut Protein Bowl", "/assets/scanner/healthy-salad-bowl-glow.png"),
            "non_vegetarian": ("Egg White Veggie Bowl", "/assets/scanner/egg-white-veggie-bowl.png"),
        },
        "cheese_pasta": {
            "vegetarian": ("Veggie Stir Fry with Tofu", "/assets/scanner/veggie-stir-fry-tofu.png"),
            "vegan": ("Lemon Herb Tofu with Quinoa", "/assets/scanner/lemon-herb-tofu-quinoa.png"),
            "non_vegetarian": ("Grilled Chicken with Brown Rice", "/assets/scanner/grilled-chicken-brown-rice.png"),
        },
        "lentil_main": {
            "vegetarian": ("Moong Dal Chilla with Salad", "/assets/scanner/moong-dal-chilla-salad.png"),
            "vegan": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "non_vegetarian": ("Grilled Fish with Steamed Veg", "/assets/scanner/grilled-fish-steamed-veg.png"),
        },
        "plain_rice": {
            "vegetarian": ("Rajma Rice Bowl with Salad", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "vegan": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "non_vegetarian": ("Grilled Chicken with Brown Rice", "/assets/scanner/grilled-chicken-brown-rice.png"),
        },
        "balanced_indian_meal": {
            "vegetarian": ("Moong Dal Chilla with Salad", "/assets/scanner/moong-dal-chilla-salad.png"),
            "vegan": ("Lemon Herb Tofu with Quinoa", "/assets/scanner/lemon-herb-tofu-quinoa.png"),
            "non_vegetarian": ("Grilled Fish with Steamed Veg", "/assets/scanner/grilled-fish-steamed-veg.png"),
        },
        "high_protein_bowl": {
            "vegetarian": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "vegan": ("Lemon Herb Tofu with Quinoa", "/assets/scanner/lemon-herb-tofu-quinoa.png"),
            "non_vegetarian": ("Grilled Fish with Steamed Veg", "/assets/scanner/grilled-fish-steamed-veg.png"),
        },
        "vegetable_heavy": {
            "vegetarian": ("Lemon Herb Tofu with Quinoa", "/assets/scanner/lemon-herb-tofu-quinoa.png"),
            "vegan": ("Chickpea & Veg Power Bowl", "/assets/scanner/chickpea-veg-power-bowl.png"),
            "non_vegetarian": ("Egg White Veggie Bowl", "/assets/scanner/egg-white-veggie-bowl.png"),
        },
        "general_meal": {
            "vegetarian": ("Veggie Stir Fry with Tofu", "/assets/scanner/veggie-stir-fry-tofu.png"),
            "vegan": ("Lemon Herb Tofu with Quinoa", "/assets/scanner/lemon-herb-tofu-quinoa.png"),
            "non_vegetarian": ("Grilled Chicken with Brown Rice", "/assets/scanner/grilled-chicken-brown-rice.png"),
        },
    }

    selected_set = recommendation_sets.get(food_category, recommendation_sets["general_meal"])

    def score_plus(points):
        return min(96, max(82, int(health_score + points)))

    def better_calories(base_floor):
        if calories >= 650:
            return max(base_floor, calories - 260)
        if calories >= 450:
            return max(base_floor, calories - 160)
        if calories >= 300:
            return max(base_floor, calories - 40)
        return max(base_floor, calories + 120)

    vegetarian_title, vegetarian_image = selected_set["vegetarian"]
    vegan_title, vegan_image = selected_set["vegan"]
    non_veg_title, non_veg_image = selected_set["non_vegetarian"]

    vegetarian = {
        "title": vegetarian_title,
        "image": vegetarian_image,
        "serving": "1 Serving",
        "weight": "400 g",
        "calories": int(better_calories(280)),
        "protein": int(max(18, min(32, protein + 2 if protein < 20 else protein - 2))),
        "carbs": int(max(24, min(55, carbs - 8 if carbs > 35 else carbs + 6))),
        "fats": int(max(7, min(15, fats - 7 if fats > 15 else fats))),
        "fiber": int(max(9, min(16, round(carbs * 0.18) + 2))),
        "score": score_plus(12 if health_score >= 82 else 20),
        "why_better": "Lighter calories, more vegetables, better fiber, and a cleaner plant-protein profile.",
    }

    vegan = {
        "title": vegan_title,
        "image": vegan_image,
        "serving": "1 Serving",
        "weight": "400 g",
        "calories": int(better_calories(290)),
        "protein": int(max(16, min(28, protein if protein < 22 else protein - 4))),
        "carbs": int(max(28, min(60, carbs - 6 if carbs > 35 else carbs + 8))),
        "fats": int(max(8, min(16, fats - 6 if fats > 15 else fats))),
        "fiber": int(max(10, min(18, round(carbs * 0.2) + 2))),
        "score": score_plus(10 if health_score >= 82 else 18),
        "why_better": "Fully plant-based, higher fiber, balanced carbs, and lower saturated-fat load.",
    }

    non_vegetarian = {
        "title": non_veg_title,
        "image": non_veg_image,
        "serving": "1 Serving",
        "weight": "420 g",
        "calories": int(better_calories(300)),
        "protein": int(max(28, min(42, protein + 8))),
        "carbs": int(max(24, min(52, carbs - 10 if carbs > 35 else carbs + 6))),
        "fats": int(max(7, min(14, fats - 8 if fats > 15 else fats))),
        "fiber": int(max(8, min(14, round(carbs * 0.14) + 2))),
        "score": score_plus(14 if health_score >= 82 else 22),
        "why_better": "More lean protein, controlled fats, and stronger recovery and fitness-goal support.",
    }

    return {
        "vegetarian": vegetarian,
        "vegan": vegan,
        "non_vegetarian": non_vegetarian,
    }


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
    extra_nutrition: dict | None = None,
    micronutrients: dict | None = None,
    meal_type: str | None = None,
    best_time_to_eat: str | None = None,
    warnings: list | None = None,
    suggestions: list | None = None,
    image_url: str | None = None,
):
    intelligence = apply_food_intelligence(
        detected_food=detected_food,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        health_score=health_score,
        extra_nutrition=extra_nutrition,
        micronutrients=micronutrients,
        meal_type=meal_type,
        best_time_to_eat=best_time_to_eat,
        warnings=warnings,
        suggestions=suggestions,
    )

    calories = intelligence["calories"]
    protein = intelligence["protein"]
    carbs = intelligence["carbs"]
    fats = intelligence["fats"]
    health_score = intelligence["health_score"]
    extra_nutrition = intelligence["extra_nutrition"]
    micronutrients = intelligence["micronutrients"]
    meal_type = intelligence["meal_type"]
    best_time_to_eat = intelligence["best_time_to_eat"]
    warnings = intelligence["warnings"]
    suggestions = intelligence["suggestions"]
    food_category = intelligence["food_category"]

    estimated_nutrition = build_extended_nutrition(
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        extra=extra_nutrition,
    )

    final_micros = build_micronutrients(
        protein=protein,
        carbs=carbs,
        fats=fats,
        fiber=estimated_nutrition["fiber"],
        direct=micronutrients,
        food_category=food_category,
    )

    final_meal_type = meal_type or infer_meal_type(
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
    )
    final_best_time = best_time_to_eat or infer_best_time_to_eat(
        meal_type=final_meal_type,
        calories=calories,
        carbs=carbs,
        fats=fats,
    )

    health_impact = build_health_impact(
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        health_score=health_score,
        estimated_nutrition=estimated_nutrition,
        meal_type=final_meal_type,
        best_time_to_eat=final_best_time,
        food_category=food_category,
        suggestions=suggestions,
        message=message,
    )

    return {
        "success": True,
        "scanner_mode": scanner_mode,
        "filename": filename,
        "detected_food": detected_food,
        "image_url": image_url,
        "image": image_url,
        "food_category": food_category,
        "confidence": max(0, min(1, float(confidence or 0.75))),
        "estimated_nutrition": estimated_nutrition,
        "micronutrients": final_micros,
        "meal_type": final_meal_type,
        "best_time_to_eat": final_best_time,
        "health_impact": health_impact,
        "recommendations": build_recommendations(
            calories=calories,
            protein=protein,
            carbs=carbs,
            fats=fats,
            health_score=health_score,
            food_category=food_category,
        ),
        "health_score": health_score,
        "analysis": message,
        "warnings": warnings,
        "suggestions": suggestions or [
            "Pair with vegetables or salad for better fiber balance.",
            "Keep portion size aligned with your daily goal.",
        ],
        "message": message,
    }


def save_scan_history_item(scan_result: dict):
    try:
        SCAN_HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)

        if SCAN_HISTORY_PATH.exists():
            existing = json.loads(SCAN_HISTORY_PATH.read_text(encoding="utf-8"))
            if not isinstance(existing, list):
                existing = []
        else:
            existing = []

        item = dict(scan_result)
        now = datetime.now()
        item["saved_at"] = now.isoformat(timespec="seconds")
        item["created_at"] = item.get("created_at") or item["saved_at"]
        item["id"] = item.get("id") or f"scan_{int(now.timestamp() * 1000)}"

        item_key = normalize_food_text(item.get("detected_food") or item.get("food") or item.get("title") or "")
        if item_key:
            existing = [
                old_item for old_item in existing
                if normalize_food_text(old_item.get("detected_food") or old_item.get("food") or old_item.get("title") or "") != item_key
            ]

        image_value = item.get("image_url") or item.get("image")
        if isinstance(image_value, str) and image_value.startswith("/uploads/"):
            item["image_url"] = f"{BACKEND_PUBLIC_URL}{image_value}"
            item["image"] = item["image_url"]
        elif isinstance(image_value, str) and image_value.startswith("uploads/"):
            item["image_url"] = f"{BACKEND_PUBLIC_URL}/{image_value}"
            item["image"] = item["image_url"]

        existing.insert(0, item)
        existing = existing[:10]

        SCAN_HISTORY_PATH.write_text(json.dumps(existing, indent=2), encoding="utf-8")
        return item
    except Exception as e:
        print("SCAN HISTORY SAVE ERROR:", e)
        return scan_result


def read_scan_history_items(limit=20):
    try:
        if not SCAN_HISTORY_PATH.exists():
            return []

        existing = json.loads(SCAN_HISTORY_PATH.read_text(encoding="utf-8"))
        if not isinstance(existing, list):
            return []

        normalized_items = []
        for item in existing[:limit]:
            if isinstance(item, dict):
                image_value = item.get("image_url") or item.get("image")
                if isinstance(image_value, str) and image_value.startswith("/uploads/"):
                    item["image_url"] = f"{BACKEND_PUBLIC_URL}{image_value}"
                    item["image"] = item["image_url"]
                elif isinstance(image_value, str) and image_value.startswith("uploads/"):
                    item["image_url"] = f"{BACKEND_PUBLIC_URL}/{image_value}"
                    item["image"] = item["image_url"]
            normalized_items.append(item)

        return normalized_items
    except Exception as e:
        print("SCAN HISTORY READ ERROR:", e)
        return []


def filename_food_scan(filename: str):
    name = filename.lower()

    foods = {
        "dal": {"food": "Dal", "calories": 180, "protein": 10, "carbs": 28, "fats": 4, "health_score": 82},
        "daal": {"food": "Dal", "calories": 180, "protein": 10, "carbs": 28, "fats": 4, "health_score": 82},
        "rice": {"food": "Rice", "calories": 250, "protein": 5, "carbs": 55, "fats": 1, "health_score": 72},
        "roti": {"food": "Roti", "calories": 120, "protein": 4, "carbs": 22, "fats": 3, "health_score": 78},
        "chapati": {"food": "Chapati", "calories": 120, "protein": 4, "carbs": 22, "fats": 3, "health_score": 78},
        "paneer": {"food": "Paneer Curry", "calories": 360, "protein": 18, "carbs": 12, "fats": 22, "health_score": 72},
        "biryani": {"food": "Biryani", "calories": 520, "protein": 18, "carbs": 65, "fats": 20, "health_score": 65},
        "salad": {"food": "Salad", "calories": 150, "protein": 7, "carbs": 16, "fats": 5, "health_score": 90},
        "pizza": {"food": "Pizza", "calories": 480, "protein": 16, "carbs": 52, "fats": 22, "health_score": 58},
        "burger": {"food": "Burger", "calories": 520, "protein": 20, "carbs": 45, "fats": 28, "health_score": 55},
        "lasagna": {"food": "Lasagna", "calories": 540, "protein": 22, "carbs": 48, "fats": 26, "health_score": 60},
        "samosa": {"food": "Samosa", "calories": 320, "protein": 6, "carbs": 35, "fats": 18, "health_score": 40},
        "vada pav": {"food": "Vada Pav", "calories": 360, "protein": 8, "carbs": 42, "fats": 17, "health_score": 55},
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
            message=groq_result.get(
                "analysis",
                "Food scanned successfully with Groq Vision.",
            ),
            extra_nutrition=estimated,
            micronutrients=groq_result.get("micronutrients", {}),
            meal_type=groq_result.get("meal_type"),
            best_time_to_eat=groq_result.get("best_time_to_eat"),
            warnings=groq_result.get("warnings", []),
            suggestions=groq_result.get("suggestions", []),
        )

    except Exception as e:
        print("GROQ VISION WRAPPER ERROR:", e)
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
    "fats": 0,
    "fiber": 0,
    "sugar": 0,
    "sodium": 0,
    "saturated_fat": 0
  },
  "micronutrients": {
    "calcium": 0,
    "iron": 0,
    "vitamin_a": 0,
    "vitamin_c": 0,
    "potassium": 0,
    "magnesium": 0
  },
  "meal_type": "Main Course",
  "best_time_to_eat": "12:00 PM - 2:00 PM",
  "health_score": 0,
  "analysis": "short nutrition analysis",
  "warnings": [],
  "suggestions": []
}

Rules:
- Do not use the filename.
- Estimate nutrition for one normal serving.
- Use numbers only for all nutrition and micronutrient values.
- confidence must be between 0 and 1.
- health_score must be between 1 and 100.
- If unsure, still give your best estimate.
- Return JSON only. No markdown. No explanation outside JSON.
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[image, prompt],
        )

        parsed = safe_json_parse(response.text or "")

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
            message=parsed.get(
                "analysis",
                "Food scanned successfully with Gemini Vision.",
            ),
            extra_nutrition=estimated,
            micronutrients=parsed.get("micronutrients", {}),
            meal_type=parsed.get("meal_type"),
            best_time_to_eat=parsed.get("best_time_to_eat"),
            warnings=parsed.get("warnings", []),
            suggestions=parsed.get("suggestions", []),
        )

    except Exception as e:
        print("GEMINI VISION WRAPPER ERROR:", e)
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


@app.get("/scanner/recent")
def get_recent_scans(limit: int = 10):
    scans = read_scan_history_items(limit=limit)
    return {
        "success": True,
        "count": len(scans),
        "items": scans,
    }


@app.get("/scanner/history")
def get_scan_history(limit: int = 10):
    scans = read_scan_history_items(limit=limit)

    total_scans = len(scans)
    avg_score = round(
        sum(item.get("health_score", 0) for item in scans) / total_scans
    ) if total_scans else 0
    avg_calories = round(
        sum(item.get("estimated_nutrition", {}).get("calories", 0) for item in scans) / total_scans
    ) if total_scans else 0

    return {
        "success": True,
        "summary": {
            "total_scans": total_scans,
            "average_score": avg_score,
            "average_calories": avg_calories,
        },
        "items": scans,
    }


@app.post("/scan-food")
def scan_food(file: UploadFile = File(...)):
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    original_name = Path(file.filename or "food-image.jpg").name
    suffix = Path(original_name).suffix or ".jpg"
    safe_stem = "".join(
        char if char.isalnum() or char in ["-", "_"] else "_"
        for char in Path(original_name).stem
    ).strip("_") or "food_scan"
    upload_name = f"{int(datetime.now().timestamp() * 1000)}_{safe_stem}{suffix}"
    file_path = UPLOADS_DIR / upload_name
    image_url = f"{BACKEND_PUBLIC_URL}/uploads/{upload_name}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    def finalize_scan(result: dict):
        result["image_url"] = image_url
        result["image"] = image_url
        saved_item = save_scan_history_item(result)
        return saved_item or result

    filename_result = filename_food_scan(original_name)

    if filename_result:
        return finalize_scan(filename_result)

    groq_result = try_groq_vision_scan(
        file_path=str(file_path),
        filename=original_name,
    )

    if groq_result:
        return finalize_scan(groq_result)

    gemini_result = try_gemini_vision_scan(
        file_path=str(file_path),
        filename=original_name,
    )

    if gemini_result:
        return finalize_scan(gemini_result)

    fallback_result = generic_fallback_scan(
        filename=original_name,
        reason="Filename match, Groq Vision, and Gemini Vision could not detect the meal.",
    )
    return finalize_scan(fallback_result)


@app.post("/generate-plan")
def generate_plan(user: UserData):
    # =====================================
    # MEDICAL HARD-BLOCK GATE
    # Must run BEFORE BMI, calories, macros, meals, AI coach,
    # dashboard analytics, routines, and workout generation.
    # =====================================

    medical_text = str(getattr(user, "medical_conditions", "") or "").lower()
    pregnancy_status = str(getattr(user, "pregnancy_status", "") or "").lower()
    safety_warnings = []

    medical_safety_warnings = []
    medical_risk = {
        "risk_level": "low",
        "warnings": [],
        "detected_conditions": [],
        "restrict_aggressive_fat_loss": False,
        "restrict_intense_workouts": False,
        "hard_block": False,
        "block_reason": "",
    }

    if analyze_medical_risk:
        medical_risk = analyze_medical_risk(user)

        if medical_risk.get("hard_block"):
            return {
                "success": False,
                "blocked": True,
                "message": medical_risk.get("block_reason"),
                "medical_warnings": medical_risk.get("warnings", []),
                "medical_risk": medical_risk,
            }
    else:
        # Fail-safe fallback if the medical warning engine import fails.
        blocked_reasons = []

        if int(getattr(user, "age", 0) or 0) < 18:
            blocked_reasons.append("users below 18")

        if int(getattr(user, "age", 0) or 0) >= 60:
            blocked_reasons.append("senior users")

        if pregnancy_status in ["pregnant", "pregnancy"]:
            blocked_reasons.append("pregnancy")

        if "kidney" in medical_text or "renal" in medical_text or "ckd" in medical_text:
            blocked_reasons.append("kidney-related conditions")

        if blocked_reasons:
            medical_risk = {
                "risk_level": "high",
                "warnings": [
                    "A medical safety restriction was detected. Please consult a qualified healthcare professional."
                ],
                "detected_conditions": blocked_reasons,
                "restrict_aggressive_fat_loss": True,
                "restrict_intense_workouts": True,
                "hard_block": True,
                "block_reason": (
                    "AI Nutrition OS cannot safely generate recommendations for this profile. "
                    "Please consult a nearby doctor or qualified healthcare professional."
                ),
            }

            if medical_risk.get("hard_block"):
                return {
                    "success": False,
                    "blocked": True,
                    "message": medical_risk.get("block_reason"),
                    "medical_warnings": medical_risk.get("warnings", []),
                    "medical_risk": medical_risk,
                }

    medical_safety_warnings = medical_risk.get("warnings", [])

    if medical_risk.get("hard_block"):
        return {
            "success": False,
            "blocked": True,
            "message": medical_risk.get("block_reason"),
            "medical_warnings": medical_risk.get("warnings", []),
        }

    # After the medical hard-block gate passes, normal plan generation can begin.
    bmi = calculate_bmi(user.weight, user.height)

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

    final_response = {
        "success": True,
        "ai_mode": coach_mode,
        "quality_scores": quality_scores,
        "safety_warnings": list(dict.fromkeys(safety_warnings)),
        "medical_risk": medical_risk,
        "medical_safety_warnings": medical_safety_warnings,
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

    saved_plan_id = None

    if save_nutrition_plan:
        try:
            saved_plan_id = save_nutrition_plan(user, final_response)
        except Exception as e:
            print("PLAN HISTORY SAVE ERROR:", e)
            saved_plan_id = None

    final_response["saved_plan_id"] = saved_plan_id

    return final_response