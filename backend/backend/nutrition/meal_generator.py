import json
import re
import random
import os

from dotenv import load_dotenv
from google import genai
from groq import Groq

load_dotenv()

# ==========================================
# API KEYS
# ==========================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ==========================================
# CLIENTS
# ==========================================

gemini_client = (
    genai.Client(api_key=GEMINI_API_KEY)
    if GEMINI_API_KEY
    else None
)

groq_client = (
    Groq(api_key=GROQ_API_KEY)
    if GROQ_API_KEY
    else None
)

# ==========================================
# CLEAN JSON
# ==========================================

def extract_json(text):

    try:

        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        match = re.search(
            r"\{.*\}",
            text,
            re.DOTALL
        )

        if match:
            return json.loads(match.group(0))

        return None

    except Exception as e:

        print("JSON ERROR:", e)

        return None

# ==========================================
# FALLBACK PLAN
# ==========================================

def fallback_plan(days, foods):

    fallback_days = []

    if len(foods) < 8:

        foods.extend([
            "Oats Bowl",
            "Dal Rice",
            "Paneer Wrap",
            "Sprouts Salad",
            "Chicken Rice Bowl",
            "Tofu Curry",
            "Rajma Rice",
            "Fruit Smoothie"
        ])

    for day in range(1, days + 1):

        shuffled = random.sample(
            foods,
            min(len(foods), 8)
        )

        fallback_days.append({

            "day": day,

            "breakfast": shuffled[0],

            "lunch": shuffled[1],

            "snack": shuffled[2],

            "dinner": shuffled[3],

            "alternatives": shuffled[4:6],

            "water_target":
            f"{round(random.uniform(2.0, 3.5), 1)} Liters Daily",

            "workout_tip":
            random.choice([
                "Focus on progressive overload and hydration.",
                "Combine cardio with strength training.",
                "Prioritize sleep and recovery.",
                "Train consistently and track protein intake.",
            ])
        })

    return {
        "days": fallback_days
    }

# ==========================================
# PROMPT BUILDER
# ==========================================

def build_prompt(
    user,
    bmi,
    calories,
    protein,
    carbs,
    fats,
    foods
):

    return f"""
You are an elite Indian AI nutritionist.

Generate a UNIQUE {user.days}-day Indian meal plan.

RETURN JSON ONLY.

NO markdown.
NO explanations.

Rules:
- Meals MUST vary.
- Use foods from AVAILABLE FOODS.
- Respect user's goal and diet.
- Include realistic Indian meals.
- Avoid duplicates.
- Keep meals practical.

FORMAT:

{{
  "days": [
    {{
      "day": 1,
      "breakfast": "",
      "lunch": "",
      "snack": "",
      "dinner": "",
      "alternatives": [],
      "water_target": "",
      "workout_tip": ""
    }}
  ]
}}

USER:
Weight: {user.weight}
Height: {user.height}
Age: {user.age}
Goal: {user.goal}
Diet: {user.diet}
Activity: {user.activity}
BMI: {bmi}

TARGETS:
Calories: {calories}
Protein: {protein}
Carbs: {carbs}
Fats: {fats}

AVAILABLE FOODS:
{foods}
"""

# ==========================================
# GEMINI GENERATOR
# ==========================================

def generate_with_gemini(prompt):

    if not gemini_client:
        return None

    try:

        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        content = response.text

        print("\n========== GEMINI RESPONSE ==========")
        print(content)
        print("=====================================\n")

        return extract_json(content)

    except Exception as e:

        print("GEMINI ERROR:", e)

        return None

# ==========================================
# GROQ GENERATOR
# ==========================================

def generate_with_groq(prompt):

    if not groq_client:
        return None

    try:

        response = groq_client.chat.completions.create(

            model="llama3-70b-8192",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.8
        )

        content = response.choices[0].message.content

        print("\n========== GROQ RESPONSE ==========")
        print(content)
        print("==================================\n")

        return extract_json(content)

    except Exception as e:

        print("GROQ ERROR:", e)

        return None

# ==========================================
# MAIN GENERATOR
# ==========================================

def generate_multi_day_plan(
    user,
    bmi,
    calories,
    protein,
    carbs,
    fats,
    suggested_foods
):

    foods = suggested_foods[:40]

    prompt = build_prompt(
        user=user,
        bmi=bmi,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        foods=foods
    )

    # ======================================
    # TRY GEMINI FIRST
    # ======================================

    gemini_result = generate_with_gemini(prompt)

    if gemini_result:
        print("✅ USING GEMINI MEAL PLAN")
        return gemini_result

    # ======================================
    # TRY GROQ SECOND
    # ======================================

    groq_result = generate_with_groq(prompt)

    if groq_result:
        print("✅ USING GROQ MEAL PLAN")
        return groq_result

    # ======================================
    # FINAL FALLBACK
    # ======================================

    print("⚠️ USING FALLBACK PLAN")

    return fallback_plan(
        user.days,
        foods
    )