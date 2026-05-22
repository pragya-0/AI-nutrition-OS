import os
import json
import re

from groq import Groq


# ==========================================
# GROQ CLIENT
# ==========================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = (
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

            return json.loads(
                match.group(0)
            )

        return None

    except Exception as e:

        print("JSON ERROR:", e)

        return None


# ==========================================
# FOOD FILTER ENGINE
# ==========================================

def filter_foods_by_goal(
    foods,
    goal,
    bmi
):

    foods = [str(food).lower() for food in foods]

    blocked_words = []

    # FAT LOSS FILTERS
    if goal == "fat_loss":

        blocked_words.extend([
            "cake",
            "pastry",
            "dessert",
            "pudding",
            "souffle",
            "fried",
            "ice cream",
            "burger",
            "pizza",
            "cola",
            "soda",
            "chips",
            "white bread",
        ])

    # HIGH BMI FILTERS
    if bmi >= 30:

        blocked_words.extend([
            "cream",
            "fried rice",
            "malai",
            "sugar",
            "biryani",
        ])

    filtered = []

    for food in foods:

        blocked = False

        for word in blocked_words:

            if word in food:
                blocked = True
                break

        if not blocked:
            filtered.append(food)

    if len(filtered) < 10:
        return foods[:15]

    return filtered


# ==========================================
# SMART FALLBACK
# ==========================================

def smart_fallback_meals(goal):

    if goal == "fat_loss":

        return {
            "breakfast":
            "Moong dal chilla with mint chutney",

            "lunch":
            "Brown rice with dal and mixed vegetables",

            "snack":
            "Roasted chana with green tea",

            "dinner":
            "Paneer salad with sauteed vegetables",

            "alternatives": [
                "Sprouts salad",
                "Vegetable soup"
            ]
        }

    elif goal == "muscle_gain":

        return {
            "breakfast":
            "Oats with banana and peanut butter",

            "lunch":
            "Rice with paneer curry and dal",

            "snack":
            "Protein smoothie with nuts",

            "dinner":
            "Roti with soy chunk curry",

            "alternatives": [
                "Tofu bowl",
                "Chickpea salad"
            ]
        }

    return {
        "breakfast":
        "Oats with fruits",

        "lunch":
        "Balanced Indian thali",

        "snack":
        "Mixed nuts",

        "dinner":
        "Dal with vegetables",

        "alternatives": [
            "Soup",
            "Salad"
        ]
    }


# ==========================================
# FALLBACK PLAN
# ==========================================

def fallback_plan(days, goal):

    fallback = smart_fallback_meals(goal)

    fallback_days = []

    for day in range(1, days + 1):

        fallback_days.append({

            "day": day,

            "breakfast":
            fallback["breakfast"],

            "lunch":
            fallback["lunch"],

            "snack":
            fallback["snack"],

            "dinner":
            fallback["dinner"],

            "alternatives":
            fallback["alternatives"],

            "water_target":
            "3 Liters Daily",

            "workout_tip":
            "30 mins walking + strength training"
        })

    return {
        "days": fallback_days
    }


# ==========================================
# VALIDATION ENGINE
# ==========================================

def validate_meal_plan(plan, goal):

    bad_words = [
        "cake",
        "dessert",
        "pastry",
        "souffle",
        "ice cream",
        "pudding",
        "cola",
        "soda",
    ]

    try:

        for day in plan.get("days", []):

            meals = [
                day.get("breakfast", ""),
                day.get("lunch", ""),
                day.get("snack", ""),
                day.get("dinner", ""),
            ]

            for meal in meals:

                meal_text = str(meal).lower()

                if goal == "fat_loss":

                    for word in bad_words:

                        if word in meal_text:
                            return False

        return True

    except:
        return False


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

        filtered_foods = filter_foods_by_goal(
            suggested_foods,
            user.goal,
            bmi
        )

        foods = filtered_foods[:25]

        strategy = "balanced nutrition"

        if user.goal == "fat_loss":
            strategy = "fat reduction"

        elif user.goal == "muscle_gain":

            if bmi >= 30:
                strategy = "body recomposition"

            else:
                strategy = "lean muscle gain"

        prompt = f"""
You are an elite Indian AI nutritionist.

Generate a realistic {user.days}-day Indian meal plan.

STRICT RULES:

- Return ONLY valid JSON
- No markdown
- No explanations
- No junk food
- No desserts for fat loss
- Dinner should be lighter
- Prioritize high protein meals
- Meals must feel realistic
- Avoid repeated meals
- Follow Indian eating patterns
- Focus on {strategy}

JSON FORMAT:

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

USER PROFILE:

Weight: {user.weight}
Height: {user.height}
Age: {user.age}
Goal: {user.goal}
Diet: {user.diet}
Activity: {user.activity}
BMI: {round(bmi, 1)}

TARGETS:

Calories: {calories}
Protein: {protein}
Carbs: {carbs}
Fats: {fats}

AVAILABLE FOODS:
{foods}
"""

        # ==========================================
        # GROQ AI CALL
        # ==========================================

        if client is None:

            return fallback_plan(
                user.days,
                user.goal
            )

        response = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            temperature=0.7,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        content = response.choices[0].message.content

        print("\n========== GROQ RESPONSE ==========")
        print(content)
        print("===================================\n")

        parsed = extract_json(content)

        if parsed:

            valid = validate_meal_plan(
                parsed,
                user.goal
            )

            if valid:
                return parsed

        return fallback_plan(
            user.days,
            user.goal
        )

    except Exception as e:

        print("MEAL GENERATOR ERROR:", e)

        return fallback_plan(
            user.days,
            user.goal
        )