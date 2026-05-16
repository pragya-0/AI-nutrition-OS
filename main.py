from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd

# =========================================
# IMPORT USER MODEL
# =========================================

from models.user_model import UserData

# =========================================
# IMPORT NUTRITION ENGINES
# =========================================

from nutrition.bmi import calculate_bmi

from nutrition.calories import (
    calculate_calories
)

from nutrition.macros import (
    calculate_macros
)

# =========================================
# IMPORT ANALYTICS ENGINE
# =========================================

from nutrition.analytics import (

    calculate_bmr,

    calculate_tdee,

    calculate_body_fat,

    calculate_metabolic_age,

    calculate_hydration_score,

    calculate_macro_ratio
)

# =========================================
# IMPORT AVOIDANCE ENGINE
# =========================================

from nutrition.avoidance_engine import (
    generate_avoid_foods
)

# =========================================
# IMPORT AI ENGINE
# =========================================

from nutrition.ai_engine import (
    generate_ai_tip
)

# =========================================
# IMPORT SERVICES
# =========================================

from services.nutrition_service import (
    generate_nutrition_plan
)

# =========================================
# IMPORT ROUTES
# =========================================

from routes.nutrition_routes import (
    router as nutrition_router
)

from routes.scanner_routes import (
    router as scanner_router
)

from routes.analytics_routes import (
    router as analytics_router
)

# =========================================
# LOAD DATASET
# =========================================

df = pd.read_csv(
    "Indian_Food_Nutrition_Processed.csv"
)

# =========================================
# CLEAN DATASET COLUMNS
# =========================================

df.columns = df.columns.str.strip()

print("\nDATASET COLUMNS:")
print(df.columns)

# =========================================
# AUTO DETECT COLUMNS
# =========================================

food_col = None
calorie_col = None
protein_col = None
type_col = None

for col in df.columns:

    lower_col = col.lower()

    # FOOD COLUMN

    if (
        "food" in lower_col
        or "dish" in lower_col
        or "name" in lower_col
    ):

        food_col = col

    # CALORIE COLUMN

    if (
        "calorie" in lower_col
        or "energy" in lower_col
        or "kcal" in lower_col
    ):

        # Prevent Calcium confusion

        if "calcium" not in lower_col:
            calorie_col = col

    # PROTEIN COLUMN

    if "protein" in lower_col:
        protein_col = col

    # TYPE COLUMN

    if (
        "type" in lower_col
        or "category" in lower_col
    ):

        type_col = col

print("\nDETECTED COLUMNS:")
print("Food:", food_col)
print("Calories:", calorie_col)
print("Protein:", protein_col)
print("Type:", type_col)

# =========================================
# FASTAPI APP
# =========================================

app = FastAPI(
    title="AI Nutrition OS"
)

# =========================================
# CORS
# =========================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# =========================================
# INCLUDE ROUTES
# =========================================

app.include_router(
    nutrition_router
)

app.include_router(
    scanner_router
)

app.include_router(
    analytics_router
)

# =========================================
# ROOT ROUTE
# =========================================

@app.get("/")
def home():

    return {
        "message":
        "AI Nutrition OS Running 🚀"
    }

# =========================================
# GENERATE PLAN ROUTE
# =========================================

@app.post("/generate-plan")
def generate_plan(user: UserData):

    # =====================================
    # BASIC BODY ANALYTICS
    # =====================================

    bmi = calculate_bmi(
        user.weight,
        user.height
    )

    calories = calculate_calories(
        user.weight,
        user.height,
        user.age,
        user.goal,
        user.activity
    )

    macros = calculate_macros(
        calories,
        user.weight,
        user.goal
    )

    protein = macros["protein"]

    carbs = macros["carbs"]

    fats = macros["fats"]

    # =====================================
    # ADVANCED ANALYTICS
    # =====================================

    bmr = calculate_bmr(
        user.weight,
        user.height,
        user.age,
        user.gender
    )

    tdee = calculate_tdee(
        bmr,
        user.activity
    )

    body_fat = calculate_body_fat(
        bmi,
        user.age,
        user.gender
    )

    metabolic_age = calculate_metabolic_age(
        bmr,
        user.age
    )

    hydration_score = calculate_hydration_score(
        user.water_intake
    )

    macro_ratio = calculate_macro_ratio(
        protein,
        carbs,
        fats
    )

    # =====================================
    # GENERATE AI MEAL PLAN
    # =====================================

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

        fats=fats
    )

    # =====================================
    # FOOD AVOIDANCE ENGINE
    # =====================================

    avoid_foods = generate_avoid_foods(

        bmi=bmi,

        goal=user.goal,

        medical_conditions=user.medical_conditions
    )

    # =====================================
    # AI COACH MESSAGE
    # =====================================

    ai_tip = generate_ai_tip(
        bmi,
        user.goal,
        user.diet
    )

    # =====================================
    # HEALTH SCORE SYSTEM
    # =====================================

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

    # LIMIT SCORE

    health_score = max(
        1,
        min(100, health_score)
    )

    # =====================================
    # FINAL API RESPONSE
    # =====================================

    return {

        # =================================
        # USER PROFILE
        # =================================

        "user_profile": {

            "weight": user.weight,

            "height": user.height,

            "age": user.age,

            "gender": user.gender,

            "goal": user.goal,

            "diet": user.diet,

            "activity": user.activity,

            "days": user.days
        },

        # =================================
        # ANALYTICS
        # =================================

        "analytics": {

            "bmi": bmi,

            "bmr": bmr,

            "tdee": tdee,

            "body_fat": body_fat,

            "metabolic_age": metabolic_age,

            "hydration_score": hydration_score,

            "health_score": health_score,

            "macro_ratio": macro_ratio
        },

        # =================================
        # DAILY TARGETS
        # =================================

        "targets": {

            "calories": calories,

            "protein": protein,

            "carbs": carbs,

            "fats": fats
        },

        # =================================
        # AVOID FOODS
        # =================================

        "avoid_foods": avoid_foods,

        # =================================
        # AI COACH
        # =================================

        "ai_tip": ai_tip,

        # =================================
        # MULTI DAY PLAN
        # =================================

        "meal_plan": meal_plan
    }