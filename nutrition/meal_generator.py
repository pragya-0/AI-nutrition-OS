import ollama
import json
import random


def generate_multi_day_plan(
    user,
    bmi,
    calories,
    protein,
    carbs,
    fats,
    suggested_foods
):

    days_data = []

    for day in range(1, user.days + 1):

        random_foods = random.sample(
            suggested_foods,
            min(15, len(suggested_foods))
        )

        prompt = f"""
You are an elite Indian AI nutritionist.

Generate Day {day} meal plan.

USER DETAILS:

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
{random_foods}

IMPORTANT:

Return ONLY valid JSON.

FORMAT:

{{
    "breakfast": "",
    "lunch": "",
    "snack": "",
    "dinner": "",

    "alternatives": [],

    "water_target": "",

    "workout_tip": ""
}}
"""

        try:

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

            content = content.strip()

            if content.startswith("```json"):
                content = content.replace(
                    "```json",
                    ""
                )

            if content.endswith("```"):
                content = content.replace(
                    "```",
                    ""
                )

            content = content.strip()

            meal_data = json.loads(content)

            meal_data["day"] = day

            days_data.append(meal_data)

        except Exception as e:

            print("Meal Generator Error:", e)

            days_data.append({

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
                "3 Liters",

                "workout_tip":
                "30 min walk + strength training"
            })

    return {
        "days": days_data
    }