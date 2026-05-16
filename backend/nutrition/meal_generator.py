import ollama
import json
import re


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

            return json.loads(
                match.group(0)
            )

        return None

    except Exception as e:

        print("JSON ERROR:", e)

        return None


# ==========================================
# FALLBACK
# ==========================================

def fallback_plan(days):

    fallback_days = []

    for day in range(1, days + 1):

        fallback_days.append({

            "day": day,

            "breakfast":
            "Oats + Banana + Almonds",

            "lunch":
            "Rice + Dal + Paneer Curry",

            "snack":
            "Roasted Chana + Green Tea",

            "dinner":
            "Roti + Mixed Veg Curry",

            "alternatives": [
                "Paneer Wrap",
                "Sprouts Salad"
            ],

            "water_target":
            "3 Liters Daily",

            "workout_tip":
            "30 mins cardio + strength training"
        })

    return {
        "days": fallback_days
    }


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

    try:

        foods = suggested_foods[:25]

        prompt = f"""
You are an elite Indian AI nutritionist.

Generate a {user.days}-day meal plan.

IMPORTANT:

RETURN ONLY VALID JSON.

NO markdown.
NO explanation.

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

TARGETS:

Calories: {calories}
Protein: {protein}
Carbs: {carbs}
Fats: {fats}

AVAILABLE FOODS:
{foods}
"""

        response = ollama.chat(

            model="llama3",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = response["message"]["content"]

        print("\n========== OLLAMA RESPONSE ==========")
        print(content)
        print("=====================================\n")

        parsed = extract_json(content)

        if parsed:
            return parsed

        return fallback_plan(user.days)

    except Exception as e:

        print("MEAL GENERATOR ERROR:", e)

        return fallback_plan(user.days)