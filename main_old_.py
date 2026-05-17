from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import shutil
import json

from dotenv import load_dotenv
from google import genai
from PIL import Image

from models.user_model import UserData

from nutrition.bmi import calculate_bmi
from nutrition.calories import calculate_calories
from nutrition.macros import calculate_macros

from nutrition.analytics import (
    calculate_bmr,
    calculate_tdee,
    calculate_body_fat,
    calculate_metabolic_age,
    calculate_hydration_score,
    calculate_macro_ratio,
)

from nutrition.avoidance_engine import generate_avoid_foods
from nutrition.ai_engine import generate_ai_tip
from services.nutrition_service import generate_nutrition_plan

from routes.nutrition_routes import router as nutrition_router
from routes.scanner_routes import router as scanner_router
from routes.analytics_routes import router as analytics_router

try:
    from nutrition.local_scanner import local_food_scan
except Exception:
    local_food_scan = None


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


app = FastAPI(
    title="AI Nutrition OS",
    version="2.2.0",
    description="AI-powered nutrition planning, analytics, food intelligence, and meal generation system",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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
        "dal": {
            "food": "Dal",
            "calories": 180,
            "protein": 10,
            "carbs": 28,
            "fats": 4,
            "health_score": 82,
        },
        "daal": {
            "food": "Dal",
            "calories": 180,
            "protein": 10,
            "carbs": 28,
            "fats": 4,
            "health_score": 82,
        },
        "rice": {
            "food": "Rice",
            "calories": 250,
            "protein": 5,
            "carbs": 55,
            "fats": 1,
            "health_score": 72,
        },
        "roti": {
            "food": "Roti",
            "calories": 120,
            "protein": 4,
            "carbs": 22,
            "fats": 3,
            "health_score": 78,
        },
        "chapati": {
            "food": "Chapati",
            "calories": 120,
            "protein": 4,
            "carbs": 22,
            "fats": 3,
            "health_score": 78,
        },
        "paneer": {
            "food": "Paneer Curry",
            "calories": 310,
            "protein": 18,
            "carbs": 12,
            "fats": 20,
            "health_score": 75,
        },
        "biryani": {
            "food": "Biryani",
            "calories": 450,
            "protein": 18,
            "carbs": 55,
            "fats": 18,
            "health_score": 65,
        },
        "salad": {
            "food": "Salad",
            "calories": 120,
            "protein": 5,
            "carbs": 10,
            "fats": 4,
            "health_score": 90,
        },
        "pizza": {
            "food": "Pizza",
            "calories": 420,
            "protein": 14,
            "carbs": 48,
            "fats": 18,
            "health_score": 62,
        },
        "burger": {
            "food": "Burger",
            "calories": 520,
            "protein": 20,
            "carbs": 45,
            "fats": 28,
            "health_score": 55,
        },
        "chicken": {
            "food": "Chicken Curry",
            "calories": 320,
            "protein": 26,
            "carbs": 10,
            "fats": 18,
            "health_score": 70,
        },
        "fish": {
            "food": "Fish Curry",
            "calories": 280,
            "protein": 24,
            "carbs": 8,
            "fats": 16,
            "health_score": 74,
        },
        "momo": {
            "food": "Momo",
            "calories": 300,
            "protein": 12,
            "carbs": 42,
            "fats": 9,
            "health_score": 68,
        },
        "idli": {
            "food": "Idli",
            "calories": 160,
            "protein": 6,
            "carbs": 32,
            "fats": 1,
            "health_score": 86,
        },
        "dosa": {
            "food": "Dosa",
            "calories": 220,
            "protein": 6,
            "carbs": 38,
            "fats": 6,
            "health_score": 78,
        },
        "poha": {
            "food": "Poha",
            "calories": 250,
            "protein": 6,
            "carbs": 45,
            "fats": 7,
            "health_score": 76,
        },
        "khichdi": {
            "food": "Khichdi",
            "calories": 280,
            "protein": 10,
            "carbs": 48,
            "fats": 6,
            "health_score": 84,
        },
        "rajma": {
            "food": "Rajma",
            "calories": 280,
            "protein": 14,
            "carbs": 42,
            "fats": 6,
            "health_score": 82,
        },
        "chole": {
            "food": "Chole",
            "calories": 300,
            "protein": 13,
            "carbs": 45,
            "fats": 8,
            "health_score": 78,
        },
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


def run_local_ai_scan(file_path: str, filename: str, reason: str):
    if local_food_scan is None:
        return generic_fallback_scan(
            filename=filename,
            reason=f"Local scanner unavailable. {reason}",
        )

    try:
        local_result = local_food_scan(file_path)

        detected_food = (
            local_result.get("detected_food")
            or local_result.get("food")
            or "Detected Meal"
        )

        confidence = float(local_result.get("confidence", 0.75))

        nutrition = local_result.get("estimated_nutrition", {})

        calories = int(nutrition.get("calories", 320))
        protein = int(nutrition.get("protein", 12))
        carbs = int(nutrition.get("carbs", 42))
        fats = int(nutrition.get("fats", 10))

        health_score = int(local_result.get("health_score", 75))

        return build_scan_response(
            filename=filename,
            detected_food=detected_food,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fats=fats,
            health_score=health_score,
            confidence=confidence,
            scanner_mode="local_ai_vision",
            message="Food scanned successfully.",
        )

    except Exception as local_error:
        return generic_fallback_scan(
            filename=filename,
            reason=f"Local scanner failed. {local_error}",
        )


@app.get("/")
def home():
    return {
        "message": "AI Nutrition OS Running 🚀",
        "status": "active",
        "version": "2.2.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "AI Nutrition OS backend is running",
        "dataset_loaded": dataset_loaded,
        "dataset_rows": len(df),
        "gemini_connected": GEMINI_API_KEY is not None,
        "local_scanner_available": local_food_scan is not None,
        "scanner_priority": [
            "filename_food_match",
            "gemini_vision",
            "local_ai_vision",
            "generic_fallback",
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

    if not GEMINI_API_KEY or client is None:
        return run_local_ai_scan(
            file_path=file_path,
            filename=file.filename,
            reason="Gemini API key missing.",
        )

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
            contents=[
                image,
                prompt,
            ],
        )

        raw_text = response.text or ""
        parsed = safe_json_parse(raw_text)

        if parsed is None:
            return run_local_ai_scan(
                file_path=file_path,
                filename=file.filename,
                reason="Gemini returned non-JSON response.",
            )

        estimated = parsed.get("estimated_nutrition", {})

        return build_scan_response(
            filename=file.filename,
            detected_food=parsed.get("detected_food", "Detected Meal"),
            calories=int(estimated.get("calories", 320)),
            protein=int(estimated.get("protein", 12)),
            carbs=int(estimated.get("carbs", 42)),
            fats=int(estimated.get("fats", 10)),
            health_score=int(parsed.get("health_score", 75)),
            confidence=float(parsed.get("confidence", 0.8)),
            scanner_mode="gemini_vision",
            message="Food scanned successfully.",
        )

    except Exception as e:
        return run_local_ai_scan(
            file_path=file_path,
            filename=file.filename,
            reason=f"Gemini unavailable. {str(e)}",
        )


@app.post("/generate-plan")
def generate_plan(user: UserData):

    bmi = calculate_bmi(user.weight, user.height)

    calories = calculate_calories(
        user.weight,
        user.height,
        user.age,
        user.goal,
        user.activity,
    )

    macros = calculate_macros(
        calories,
        user.weight,
        user.goal,
    )

    protein = macros["protein"]
    carbs = macros["carbs"]
    fats = macros["fats"]

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

    metabolic_age = calculate_metabolic_age(
        bmr,
        user.age,
    )

    hydration_score = calculate_hydration_score(
        user.water_intake,
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

    coach_message = generate_ai_tip(
        bmi,
        user.goal,
        user.diet,
    )

    health_score = 85

    if bmi > 25:
        health_score -= 10
    elif bmi < 18:
        health_score -= 8

    if user.activity == "high":
        health_score += 5

    if user.sleep_hours < 6:
        health_score -= 5

    if user.water_intake < 2:
        health_score -= 5

    health_score = max(1, min(100, health_score))

    if isinstance(meal_plan, dict):
        meal_days = meal_plan.get("days", [])
    elif isinstance(meal_plan, list):
        meal_days = meal_plan
    else:
        meal_days = []

    return {
        "success": True,
        "user_profile": {
            "weight": user.weight,
            "height": user.height,
            "age": user.age,
            "gender": user.gender,
            "goal": user.goal,
            "diet": user.diet,
            "activity": user.activity,
            "days": user.days,
            "sleep_hours": user.sleep_hours,
            "water_intake": user.water_intake,
            "medical_conditions": user.medical_conditions,
        },
        "analytics": {
            "bmi": bmi,
            "bmr": bmr,
            "tdee": tdee,
            "body_fat": body_fat,
            "metabolic_age": metabolic_age,
            "hydration_score": hydration_score,
            "health_score": health_score,
            "macro_ratio": macro_ratio,
        },
        "targets": {
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fats": fats,
        },
        "meal_plan": {
            "days": meal_days,
        },
        "avoid_foods": avoid_foods,
        "coach_message": coach_message,
        "ai_tip": coach_message,
        "grocery_list": [],
        "scanner": {
            "enabled": True,
            "endpoint": "/scan-food",
        },
    }