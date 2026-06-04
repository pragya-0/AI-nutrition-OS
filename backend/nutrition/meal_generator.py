import os
import json
import re
from typing import Any

import requests
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


# ==========================================
# AI CLIENTS
# ==========================================

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MEAL_MODEL",
    os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_client = (
    Groq(api_key=GROQ_API_KEY)
    if GROQ_API_KEY
    else None
)

MEAL_GENERATOR_DEBUG = os.getenv("MEAL_GENERATOR_DEBUG", "true").lower() in [
    "1",
    "true",
    "yes",
    "on",
]


# ==========================================
# DEBUG
# ==========================================

def mask_secret(value: str | None) -> str:
    if not value:
        return "missing"

    value = str(value)

    if len(value) <= 8:
        return "present"

    return f"{value[:4]}...{value[-4:]}"


def debug_log(message: str):
    if MEAL_GENERATOR_DEBUG:
        print(message)


def print_ai_client_status():
    debug_log("\n========== MEAL GENERATOR ENV STATUS ==========")
    debug_log(f"OPENROUTER_API_KEY: {mask_secret(OPENROUTER_API_KEY)}")
    debug_log(f"OPENROUTER_MODEL: {OPENROUTER_MODEL or 'missing'}")
    debug_log(f"GROQ_API_KEY: {mask_secret(GROQ_API_KEY)}")
    debug_log(f"GROQ_CLIENT_READY: {bool(groq_client)}")
    debug_log("===============================================\n")


print_ai_client_status()


# ==========================================
# CONSTANTS
# ==========================================

MAX_DAYS = 30

# Strict for public demo fat-loss output. These are blocked from AI outputs
# and replaced with safe fallback meals.
BAD_FAT_LOSS_WORDS = [
    "cake",
    "pastry",
    "dessert",
    "pudding",
    "souffle",
    "fried",
    "deep fried",
    "ice cream",
    "burger",
    "pizza",
    "cola",
    "soda",
    "chips",
    "white bread",
    "sweet",
    "sweets",
    "sugar",
    "sugary",
    "cream",
    "malai",
    "butter",
    "ghee",
    "biryani",
    "poori",
    "puri",
    "halwa",
    "flan",
    "tart",
    "ginger bread",
    "gingerbread",
    "naan",
    "dal makhani",
    "lassi",
    "boondi",
    "kheer",
    "custard",
    "rabri",
    "jalebi",
    "gulab jamun",
    "rasgulla",
    "laddu",
    "ladoo",
    "paratha",
]

LOW_QUALITY_WORDS = [
    "fruit puree tart",
    "fruit flan",
    "ginger bread man",
    "gingerbread man",
    "pumpkin halwa",
    "besan poori",
    "saffron milk",
    "boondi raita",
    "biryani",
    "naan",
    "dal makhani",
    "with controlled rice portion with",
    "with fresh vegetables with",
    "with steamed vegetables with",
    "with seasonal fruit with",
    "with curd on the side with",
]

VEGETARIAN_BLOCKED_WORDS = [
    "chicken",
    "fish",
    "egg",
    "eggs",
    "omelette",
    "omelet",
    "omlet",
    "meat",
    "mutton",
    "beef",
    "pork",
    "prawn",
    "shrimp",
    "crab",
]

VEGAN_BLOCKED_WORDS = VEGETARIAN_BLOCKED_WORDS + [
    "paneer",
    "milk",
    "curd",
    "cheese",
    "butter",
    "ghee",
    "cream",
    "yogurt",
    "yoghurt",
    "lassi",
    "custard",
    "kheer",
    "rabri",
    "malai",
    "khoya",
]

SAFE_DEFAULT_ALTERNATIVES = {
    "fat_loss": [
        "Sprouts salad",
        "Vegetable soup",
        "Dal rice bowl",
    ],
    "muscle_gain": [
        "Tofu bowl",
        "Chickpea salad",
        "Paneer wrap",
    ],
    "maintenance": [
        "Dal rice bowl",
        "Vegetable wrap",
        "Chana salad",
    ],
}


# ==========================================
# NORMALIZATION HELPERS
# ==========================================

def normalize_goal(goal: str) -> str:
    goal = str(goal or "").lower().strip().replace("-", "_").replace(" ", "_")

    if goal in ["fat_loss", "weight_loss", "lose_weight", "weightloss"]:
        return "fat_loss"

    if goal in ["muscle_gain", "gain_muscle", "lean_muscle", "bulk"]:
        return "muscle_gain"

    return "maintenance"


def normalize_diet(diet: str) -> str:
    diet = str(diet or "").lower().strip().replace("-", "_").replace(" ", "_")

    if diet == "vegan":
        return "vegan"

    if diet in ["vegetarian", "veg", "lacto_vegetarian"]:
        return "vegetarian"

    if diet in [
        "omnivore",
        "non_vegetarian",
        "nonveg",
        "non_veg",
        "mixed",
        "regular",
        "eggetarian",
        "pescatarian",
    ]:
        return "non_vegetarian"

    return "vegetarian"


def clean_text(text: str) -> str:
    text = str(text or "").strip()
    text = re.sub(r"\s+", " ", text)
    text = text.replace(" with controlled rice portion", "")
    text = text.replace(" with fresh vegetables", "")
    text = text.replace(" with steamed vegetables", "")
    text = text.replace(" with seasonal fruit", "")
    text = text.replace(" with curd on the side", "")
    text = text.replace(" with clear soup", "")
    text = text.replace(" with mixed salad", "")
    text = text.replace(" with green tea", "")
    return re.sub(r"\s+", " ", text).strip()


def contains_any(text: str, words: list[str]) -> bool:
    lower = str(text or "").lower()
    return any(word in lower for word in words)


def get_diet_blocked_words(diet: str) -> list[str]:
    diet = normalize_diet(diet)

    if diet == "vegan":
        return VEGAN_BLOCKED_WORDS

    if diet == "vegetarian":
        return VEGETARIAN_BLOCKED_WORDS

    return []


def is_bad_for_goal(meal: str, goal: str) -> bool:
    goal = normalize_goal(goal)
    meal = str(meal or "").lower()

    if goal == "fat_loss" and contains_any(meal, BAD_FAT_LOSS_WORDS):
        return True

    return False


def is_low_quality_meal(meal: str, meal_type: str) -> bool:
    meal = str(meal or "").lower().strip()

    if not meal or len(meal) < 8:
        return True

    if contains_any(meal, LOW_QUALITY_WORDS):
        return True

    # Prevent dessert/snack-like items becoming "unique" but poor quality.
    dessertish = [
        "tart",
        "flan",
        "halwa",
        "kheer",
        "custard",
        "pudding",
        "ginger bread",
        "gingerbread",
        "sweet",
        "saffron milk",
    ]
    if contains_any(meal, dessertish):
        return True

    if meal_type == "snack":
        bad_snack_words = [
            "biryani",
            "curry",
            "gravy",
            "tikka",
            "fish curry",
            "chicken curry",
            "pulao",
            "naan",
            "poori",
            "paratha",
            "halwa",
            "flan",
            "tart",
        ]
        if contains_any(meal, bad_snack_words):
            return True

    if meal_type == "dinner":
        heavy_dinner_words = [
            "biryani",
            "dal makhani",
            "naan",
            "poori",
            "puri",
            "halwa",
            "flan",
            "tart",
            "fried",
        ]
        if contains_any(meal, heavy_dinner_words):
            return True

    return False


def normalize_meal_signature(meal: str) -> str:
    """Used to detect fake uniqueness from prefixes/sides."""
    meal = str(meal or "").lower().strip()

    removable = [
        "bengali-style",
        "south indian-style",
        "north indian-style",
        "high-protein",
        "high-fiber",
        "low-oil",
        "home-style",
        "millet-balanced",
        "vegetable-loaded",
        "portion-aware",
        "light",
        "fresh",
        "simple",
        "wholesome",
        "balanced",
        "lean",
        "curry-light",
        "routine-friendly",
        "protein-forward",
        "fiber-focus",
        "comfort",
        "smart",
        "classic indian",
        "weekday",
        "weekend",
        "lemon-herb",
        "gut-friendly",
        "energy-support",
        "sleep-friendly",
        "recovery-support",
        "with cucumber salad",
        "with mixed salad",
        "with sprouts",
        "with sautéed vegetables",
        "with sauteed vegetables",
        "with lemon salad",
        "with controlled rice portion",
        "with millet roti",
        "with fresh vegetables",
        "with roasted chana",
        "with seasonal fruit",
        "with green tea",
        "with curd on the side",
        "with clear soup",
        "with steamed vegetables",
        "with mint curd",
    ]

    for token in removable:
        meal = meal.replace(token, " ")

    meal = re.sub(r"[^a-z0-9 ]+", " ", meal)
    meal = re.sub(r"\s+", " ", meal).strip()
    return meal


# ==========================================
# CLEAN JSON
# ==========================================

def extract_json(text):
    try:
        text = str(text or "")
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
    goal = normalize_goal(goal)
    foods = [str(food).lower() for food in foods]

    blocked_words = []

    if goal == "fat_loss":
        blocked_words.extend(BAD_FAT_LOSS_WORDS)

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
        return foods[:25]

    return filtered


def filter_foods_by_diet(
    foods,
    diet,
):
    blocked_words = get_diet_blocked_words(diet)
    filtered = []

    for food in foods:
        text = str(food or "").lower()
        if not contains_any(text, blocked_words):
            filtered.append(food)

    return filtered


# ==========================================
# DIVERSE LOCAL FALLBACK POOLS
# ==========================================

DIVERSE_MEAL_POOLS = {
    "fat_loss": {
        "vegan": {
            "breakfast": [
                "Moong dal chilla with cucumber salad",
                "Poha with sprouts and peanuts",
                "Vegetable oats upma",
                "Besan cheela with tomato salad",
                "Tofu bhurji with millet roti",
                "Idli with sambar",
                "Sprouts bowl with lemon and vegetables",
                "Dalia with vegetables",
                "Ragi dosa with sambar",
                "Vegetable quinoa poha",
            ],
            "lunch": [
                "Brown rice with dal, mixed vegetables, and salad",
                "Chickpea curry with millet roti and salad",
                "Rajma with brown rice and cucumber salad",
                "Tofu vegetable bowl with quinoa",
                "Dal khichdi with vegetable salad",
                "Lentil soup with roti and stir-fried vegetables",
                "Sambar rice with extra vegetables",
                "Chana salad bowl with roti",
                "Millet khichdi with vegetables",
                "Soy chunk curry with roti",
            ],
            "snack": [
                "Roasted chana with green tea",
                "Fruit with roasted peanuts",
                "Sprouts chaat",
                "Cucumber carrot sticks with hummus",
                "Apple with peanut butter",
                "Makhana roasted with light spices",
                "Coconut water with roasted chana",
                "Lemon sprouts bowl",
                "Roasted soy nuts",
                "Fresh fruit bowl",
            ],
            "dinner": [
                "Millet roti with tofu vegetable curry and salad",
                "Moong dal soup with stir-fried vegetables",
                "Vegetable dalia with salad",
                "Roti with lauki chana dal",
                "Tofu stir-fry with brown rice",
                "Mixed vegetable stew with millet roti",
                "Clear lentil soup with vegetables",
                "Vegetable millet upma",
                "Chickpea vegetable soup",
                "Dal with sautéed greens",
            ],
        },
        "vegetarian": {
            "breakfast": [
                "Moong dal chilla with curd and cucumber salad",
                "Poha with peanuts and curd",
                "Vegetable oats with curd",
                "Paneer bhurji with one roti",
                "Besan cheela with mint curd",
                "Idli with sambar",
                "Dalia with vegetables and curd",
                "Ragi dosa with curd",
                "Sprouts paneer bowl",
                "Vegetable upma with curd",
            ],
            "lunch": [
                "Rice, dal, mixed vegetable curry, and salad",
                "Paneer salad bowl with roti",
                "Rajma rice with curd and salad",
                "Dal khichdi with curd and cucumber",
                "Roti with chana masala and salad",
                "Brown rice with dal and sabzi",
                "Vegetable pulao with raita",
                "Palak paneer with roti",
                "Millet roti with dal and vegetables",
                "Curd rice with vegetable stir-fry",
            ],
            "snack": [
                "Roasted chana with green tea",
                "Fruit with curd",
                "Sprouts chaat",
                "Makhana roasted with light spices",
                "Paneer cubes with cucumber",
                "Buttermilk with roasted chana",
                "Apple with nuts",
                "Curd bowl with fruit",
                "Peanut chana chaat",
                "Carrot cucumber sticks",
            ],
            "dinner": [
                "Roti with paneer bhurji and salad",
                "Dal soup with vegetable stir-fry",
                "Millet roti with mixed vegetable curry",
                "Palak paneer with roti and salad",
                "Vegetable dalia with curd",
                "Roti with lauki dal and salad",
                "Khichdi with curd and salad",
                "Paneer vegetable soup",
                "Dal with sautéed spinach",
                "Light vegetable pulao with raita",
            ],
        },
        "non_vegetarian": {
            "breakfast": [
                "Oats with boiled eggs and fruit",
                "Egg bhurji with whole wheat toast",
                "Poha with boiled egg and sprouts",
                "Vegetable omelette with toast",
                "Greek-style curd bowl with fruit and nuts",
                "Idli with sambar and boiled egg",
                "Chicken sandwich with cucumber",
                "Dalia with curd and boiled egg",
                "Egg roti roll with salad",
                "Sprouts bowl with boiled egg",
            ],
            "lunch": [
                "Grilled chicken with rice and salad",
                "Fish curry with rice and vegetables",
                "Chicken dal bowl with roti",
                "Egg curry with rice and salad",
                "Chicken khichdi with vegetables",
                "Brown rice with chicken curry and salad",
                "Fish thali with controlled rice and salad",
                "Chicken roti wrap with salad",
                "Egg dal bowl with rice",
                "Grilled fish with millet roti",
            ],
            "snack": [
                "Roasted chana with green tea",
                "Boiled eggs with cucumber",
                "Fruit with nuts",
                "Chicken soup",
                "Makhana roasted with light spices",
                "Egg white bhurji",
                "Coconut water with roasted chana",
                "Curd with fruit",
                "Egg salad bowl",
                "Light chicken broth",
            ],
            "dinner": [
                "Fish curry with roti and vegetables",
                "Chicken soup with salad",
                "Roti with egg curry and vegetables",
                "Grilled fish with sautéed vegetables",
                "Chicken stir-fry with millet roti",
                "Dal with egg bhurji and salad",
                "Light chicken stew with vegetables",
                "Egg vegetable soup with roti",
                "Chicken vegetable bowl",
                "Fish stew with sautéed greens",
            ],
        },
    },
}

DIVERSE_MEAL_POOLS["muscle_gain"] = DIVERSE_MEAL_POOLS["fat_loss"]
DIVERSE_MEAL_POOLS["maintenance"] = DIVERSE_MEAL_POOLS["fat_loss"]


# ==========================================
# FALLBACK ENGINE
# ==========================================

def pick_diverse_fallback(
    goal: str,
    diet: str,
    meal_type: str,
    day_index: int,
    used_signatures: set[str],
) -> str:
    goal = normalize_goal(goal)
    diet = normalize_diet(diet)

    pool = (
        DIVERSE_MEAL_POOLS
        .get(goal, DIVERSE_MEAL_POOLS["maintenance"])
        .get(diet, DIVERSE_MEAL_POOLS["maintenance"]["vegetarian"])
        .get(meal_type, ["Balanced Indian meal"])
    )

    for offset in range(len(pool)):
        candidate = pool[(day_index + offset) % len(pool)].strip()
        signature = normalize_meal_signature(candidate)
        if signature not in used_signatures:
            return candidate

    # If the pool is exhausted after 10+ days, use another safe pool item.
    # Do not add artificial prefixes that create fake uniqueness.
    candidate = pool[day_index % len(pool)].strip()
    return candidate


def smart_fallback_meals(goal, diet, day_index=0, used_signatures=None):
    used_signatures = used_signatures if used_signatures is not None else set()

    breakfast = pick_diverse_fallback(goal, diet, "breakfast", day_index, used_signatures)
    used_signatures.add(normalize_meal_signature(breakfast))

    lunch = pick_diverse_fallback(goal, diet, "lunch", day_index, used_signatures)
    used_signatures.add(normalize_meal_signature(lunch))

    snack = pick_diverse_fallback(goal, diet, "snack", day_index, used_signatures)
    used_signatures.add(normalize_meal_signature(snack))

    dinner = pick_diverse_fallback(goal, diet, "dinner", day_index, used_signatures)
    used_signatures.add(normalize_meal_signature(dinner))

    alternatives = SAFE_DEFAULT_ALTERNATIVES.get(
        normalize_goal(goal),
        SAFE_DEFAULT_ALTERNATIVES["maintenance"],
    )

    return {
        "breakfast": breakfast,
        "lunch": lunch,
        "snack": snack,
        "dinner": dinner,
        "alternatives": alternatives[:3],
    }


def fallback_plan(days, goal, diet="vegetarian"):
    days = max(1, min(int(days or 1), MAX_DAYS))
    used_signatures: set[str] = set()
    fallback_days = []

    for index in range(days):
        fallback = smart_fallback_meals(
            goal=goal,
            diet=diet,
            day_index=index,
            used_signatures=used_signatures,
        )

        fallback_days.append({
            "day": index + 1,
            "breakfast": fallback["breakfast"],
            "lunch": fallback["lunch"],
            "snack": fallback["snack"],
            "dinner": fallback["dinner"],
            "alternatives": fallback["alternatives"],
            "water_target": "2.5 Liters Daily",
            "workout_tip": "30 minutes walking plus light strength training",
            "meals": {
                "breakfast": fallback["breakfast"],
                "lunch": fallback["lunch"],
                "snack": fallback["snack"],
                "dinner": fallback["dinner"],
            },
        })

    return {
        "days": fallback_days,
        "source": "generic_fallback",
    }


# ==========================================
# VALIDATION / NORMALIZATION ENGINE
# ==========================================

def meal_is_unsafe(meal: str, meal_type: str, goal: str, diet: str) -> bool:
    meal = clean_text(meal)

    if not meal:
        return True

    if is_bad_for_goal(meal, goal):
        return True

    if is_low_quality_meal(meal, meal_type):
        return True

    if contains_any(meal, get_diet_blocked_words(diet)):
        return True

    return False


def validate_meal_plan(plan, goal, diet, required_days=None):
    goal = normalize_goal(goal)
    diet = normalize_diet(diet)

    try:
        days = plan.get("days", [])

        if not isinstance(days, list) or not days:
            return False

        if required_days is not None and len(days) < int(required_days):
            return False

        seen_signatures = set()
        duplicate_count = 0

        for day in days[:required_days or len(days)]:
            for meal_type in ["breakfast", "lunch", "snack", "dinner"]:
                meal = clean_text(day.get(meal_type, ""))
                signature = normalize_meal_signature(meal)

                if meal_is_unsafe(meal, meal_type, goal, diet):
                    return False

                if signature in seen_signatures:
                    duplicate_count += 1

                seen_signatures.add(signature)

        total_meals = max(1, (required_days or len(days)) * 4)
        duplicate_ratio = duplicate_count / total_meals

        # This catches fake uniqueness generated by prefixes/sides.
        if required_days and int(required_days) >= 15 and duplicate_ratio > 0.35:
            return False

        return True

    except Exception:
        return False


def normalize_generated_plan(plan: dict, required_days: int, goal: str, diet: str) -> dict:
    required_days = max(1, min(int(required_days or 1), MAX_DAYS))
    source_days = plan.get("days", []) if isinstance(plan, dict) else []

    clean_days = []
    used_signatures: set[str] = set()

    for index in range(required_days):
        if index < len(source_days) and isinstance(source_days[index], dict):
            day = dict(source_days[index])
        else:
            day = {}

        fallback = smart_fallback_meals(
            goal=goal,
            diet=diet,
            day_index=index,
            used_signatures=used_signatures,
        )

        normalized_day = {"day": index + 1}

        for meal_type in ["breakfast", "lunch", "snack", "dinner"]:
            candidate = clean_text(day.get(meal_type) or "")
            signature = normalize_meal_signature(candidate)

            if (
                meal_is_unsafe(candidate, meal_type, goal, diet)
                or signature in used_signatures
            ):
                candidate = fallback[meal_type]
                signature = normalize_meal_signature(candidate)

            used_signatures.add(signature)
            normalized_day[meal_type] = candidate

        alternatives = day.get("alternatives", [])
        if not isinstance(alternatives, list) or len(alternatives) < 2:
            alternatives = fallback["alternatives"]

        safe_alternatives = []
        for item in alternatives:
            text = clean_text(item)
            if text and not meal_is_unsafe(text, "snack", goal, diet):
                safe_alternatives.append(text)

        if len(safe_alternatives) < 3:
            for item in fallback["alternatives"]:
                text = clean_text(item)
                if text not in safe_alternatives:
                    safe_alternatives.append(text)

        normalized_day["alternatives"] = safe_alternatives[:3]
        normalized_day["water_target"] = day.get("water_target") or "2.5 Liters Daily"
        normalized_day["workout_tip"] = day.get("workout_tip") or "30 minutes walking plus light strength training"
        normalized_day["meals"] = {
            "breakfast": normalized_day["breakfast"],
            "lunch": normalized_day["lunch"],
            "snack": normalized_day["snack"],
            "dinner": normalized_day["dinner"],
        }

        clean_days.append(normalized_day)

    return {"days": clean_days}


# ==========================================
# PROMPT
# ==========================================

def build_meal_prompt(
    user,
    bmi,
    calories,
    protein,
    carbs,
    fats,
    foods,
    goal,
    diet,
    days,
):
    strategy = "balanced nutrition"

    if goal == "fat_loss":
        strategy = "safe fat reduction with portion awareness"

    elif goal == "muscle_gain":
        if bmi >= 30:
            strategy = "body recomposition with lean protein focus"
        else:
            strategy = "lean muscle gain"

    if diet == "vegetarian":
        diet_rules = "- Vegetarian only. No chicken, fish, egg, meat, seafood, or animal flesh."

    elif diet == "vegan":
        diet_rules = "- Vegan only. No chicken, fish, egg, paneer, milk, curd, cheese, ghee, butter, yogurt, or dairy."

    else:
        diet_rules = "- Omnivore/non-vegetarian allowed. Use chicken, fish, eggs, dal, curd, and Indian staples where appropriate."

    return f"""
You are an elite Indian AI nutrition planner for a public wellness app.

Generate a realistic {days}-day Indian meal plan.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- Generate exactly {days} days
- Every day must include breakfast, lunch, snack, dinner
- Avoid exact repeated meals across all {days} days
- Do not repeat the same 7-day cycle
- Each meal name should be specific and realistic
- No junk food
- No desserts or sweets for fat loss
- No biryani, poori, naan, halwa, flan, tart, gingerbread, lassi, boondi, or dal makhani for fat loss
- Dinner should be lighter
- Snacks must be simple: roasted chana, fruit, sprouts, curd, eggs, makhana, soup, or nuts
- Prioritize protein and fiber
- Follow Indian eating patterns
- Focus on {strategy}
{diet_rules}

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
Weight: {getattr(user, "weight", "")}
Height: {getattr(user, "height", "")}
Age: {getattr(user, "age", "")}
Goal: {goal}
Diet: {diet}
Activity: {getattr(user, "activity", "")}
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
# AI CALLS
# ==========================================

def call_openrouter_meal_plan(prompt: str):
    if not OPENROUTER_API_KEY:
        debug_log("OPENROUTER SKIPPED: OPENROUTER_API_KEY is missing")
        return None

    debug_log(f"USING OPENROUTER FOR MEAL GENERATION: {OPENROUTER_MODEL}")

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ai-nutrition-os.vercel.app",
                "X-OpenRouter-Title": "AI Nutrition OS Meal Planner",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You generate safe, realistic Indian meal-plan JSON only. "
                            "Do not include medical advice. Do not include markdown. "
                            "For fat loss, never include desserts, sweets, fried foods, biryani, poori, naan, halwa, flan, tart, gingerbread, lassi, boondi, or dal makhani."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                "temperature": 0.55,
                "max_tokens": 6500,
            },
            timeout=45,
        )

        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

    except Exception as e:
        debug_log(f"OPENROUTER MEAL ERROR: {e}")
        return None


def call_groq_meal_plan(prompt: str):
    if groq_client is None:
        debug_log("GROQ SKIPPED: GROQ_API_KEY is missing or client is unavailable")
        return None

    debug_log("USING GROQ FALLBACK FOR MEAL GENERATION")

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            temperature=0.65,
            max_tokens=6000,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response.choices[0].message.content

    except Exception as e:
        debug_log(f"GROQ MEAL ERROR: {e}")
        return None


def parse_and_validate_ai_result(content, days, goal, diet, source_name):
    if not content:
        return None

    debug_log(f"\n========== {source_name.upper()} MEAL RESPONSE ==========")
    debug_log(str(content))
    debug_log("===================================\n")

    parsed = extract_json(content)

    if not parsed:
        return None

    normalized = normalize_generated_plan(
        parsed,
        days,
        goal,
        diet,
    )

    valid = validate_meal_plan(
        normalized,
        goal,
        diet,
        required_days=days,
    )

    if not valid:
        debug_log(f"{source_name.upper()} MEAL PLAN VALIDATION FAILED")
        return None

    normalized["source"] = source_name
    return normalized


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
        goal = normalize_goal(getattr(user, "goal", "maintenance"))
        diet = normalize_diet(getattr(user, "diet", "vegetarian"))
        days = max(1, min(int(getattr(user, "days", 1) or 1), MAX_DAYS))

        filtered_foods = filter_foods_by_goal(
            suggested_foods,
            goal,
            bmi,
        )

        filtered_foods = filter_foods_by_diet(
            filtered_foods,
            diet,
        )

        foods = filtered_foods[:40]

        prompt = build_meal_prompt(
            user=user,
            bmi=bmi,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fats=fats,
            foods=foods,
            goal=goal,
            diet=diet,
            days=days,
        )

        openrouter_content = call_openrouter_meal_plan(prompt)
        openrouter_plan = parse_and_validate_ai_result(
            openrouter_content,
            days,
            goal,
            diet,
            "openrouter_ai",
        )

        if openrouter_plan:
            debug_log("MEAL GENERATION SOURCE SELECTED: openrouter_ai")
            return openrouter_plan

        groq_content = call_groq_meal_plan(prompt)
        groq_plan = parse_and_validate_ai_result(
            groq_content,
            days,
            goal,
            diet,
            "groq_ai",
        )

        if groq_plan:
            debug_log("MEAL GENERATION SOURCE SELECTED: groq_ai")
            return groq_plan

        debug_log("MEAL GENERATION SOURCE SELECTED: generic_fallback")
        return fallback_plan(
            days,
            goal,
            diet,
        )

    except Exception as e:
        debug_log(f"MEAL GENERATOR ERROR: {e}")

        return fallback_plan(
            getattr(user, "days", 1),
            getattr(user, "goal", "maintenance"),
            getattr(user, "diet", "vegetarian"),
        )
