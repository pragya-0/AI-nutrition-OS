from __future__ import annotations

from typing import Any

from nutrition.meal_generator import generate_multi_day_plan
from nutrition.filters import filter_foods


VEGETARIAN_BLOCKED_WORDS = [
    "chicken", "fish", "egg", "eggs", "omelette", "omelet", "omlet",
    "meat", "mutton", "beef", "pork", "prawn", "shrimp", "crab",
]

VEGAN_BLOCKED_WORDS = VEGETARIAN_BLOCKED_WORDS + [
    "paneer", "milk", "curd", "cheese", "butter", "ghee", "cream",
    "yogurt", "yoghurt", "raita", "mayonnaise", "mayo", "honey",
    "whey", "lassi", "custard", "kheer", "rabri", "malai", "khoya",
    "buttermilk", "dahi",
]

FAT_LOSS_BLOCKED_WORDS = [
    "fried", "deep fried", "samosa", "pakora", "pizza", "burger",
    "cake", "cookie", "cookies", "biscuit", "pastry", "dessert",
    "ice cream", "sugar", "sugary", "cola", "soda", "chips",
    "cream", "malai", "butter", "ghee", "biryani", "poori", "puri",
    "halwa", "naan", "dal makhani", "lassi", "kheer", "rabri",
    "jalebi", "gulab jamun", "rasgulla", "laddu", "ladoo", "paratha",
    "namak para", "namak paras", "paste", "flan", "tart",
]

WEAK_DATASET_WORDS = [
    "pickle", "achar", "achaar", "chutney powder", "masala powder",
    "spice blend", "essence", "paste", "cookie", "cookies",
    "namak para", "namak paras", "cake", "halwa", "flan", "tart",
    "sauce only", "premix",
]

DEFAULT_SUGGESTED_FOODS = [
    "Rice", "Dal", "Sprouts Salad", "Roti", "Upma", "Poha",
    "Chickpea Salad", "Tofu Bowl", "Vegetable Khichdi", "Moong Dal Chilla",
    "Idli Sambar", "Rajma Bowl", "Chana Masala", "Millet Roti",
    "Soy Chunk Curry", "Lobia Curry", "Black Chana Bowl", "Vegetable Dalia",
    "Ragi Dosa", "Quinoa Vegetable Bowl", "Grilled Chicken", "Grilled Fish",
    "Egg Curry",
]


def _normalize(value: Any) -> str:
    return str(value or "").lower().replace("-", "_").replace(" ", "_").strip()


def _normalize_diet(value: Any) -> str:
    diet = _normalize(value)
    if diet == "vegan":
        return "vegan"
    if diet in ["vegetarian", "veg", "lacto_vegetarian"]:
        return "vegetarian"
    if diet in ["non_vegetarian", "nonveg", "non_veg", "omnivore", "mixed", "regular", "eggetarian", "pescatarian"]:
        return "non_vegetarian"
    return "vegetarian"


def _normalize_goal(value: Any) -> str:
    goal = _normalize(value)
    if goal in ["fat_loss", "weight_loss", "lose_weight", "weightloss"]:
        return "fat_loss"
    if goal in ["muscle_gain", "gain_muscle", "lean_muscle", "bulk"]:
        return "muscle_gain"
    return "maintenance"


def _contains_any(text: str, words: list[str]) -> bool:
    lower = str(text or "").lower()
    return any(word in lower for word in words)


def _blocked_words_for_user(user: Any) -> list[str]:
    diet = _normalize_diet(getattr(user, "diet", "vegetarian"))
    goal = _normalize_goal(getattr(user, "goal", "maintenance"))
    blocked: list[str] = []
    blocked.extend(WEAK_DATASET_WORDS)

    if diet == "vegan":
        blocked.extend(VEGAN_BLOCKED_WORDS)
    elif diet == "vegetarian":
        blocked.extend(VEGETARIAN_BLOCKED_WORDS)

    if goal == "fat_loss":
        blocked.extend(FAT_LOSS_BLOCKED_WORDS)

    allergies = getattr(user, "allergies", []) or []
    disliked = getattr(user, "disliked_foods", []) or []
    if isinstance(allergies, list):
        blocked.extend(str(item).lower() for item in allergies if item)
    if isinstance(disliked, list):
        blocked.extend(str(item).lower() for item in disliked if item)

    return list(dict.fromkeys(blocked))


def _clean_suggested_foods(foods: list[Any], user: Any) -> list[str]:
    blocked_words = _blocked_words_for_user(user)
    cleaned: list[str] = []

    for food in foods:
        text = str(food or "").strip()
        if not text or len(text) < 4:
            continue
        if _contains_any(text, blocked_words):
            continue
        cleaned.append(text)

    cleaned = list(dict.fromkeys(cleaned))[:120]

    if len(cleaned) >= 18:
        return cleaned

    fallback = [food for food in DEFAULT_SUGGESTED_FOODS if not _contains_any(food, blocked_words)]
    return list(dict.fromkeys(cleaned + fallback))[:120]


def _extract_foods_from_dataframe(filtered_foods, food_col: str | None) -> list[str]:
    try:
        if food_col and filtered_foods is not None and not filtered_foods.empty:
            sample_size = min(120, len(filtered_foods))
            return (
                filtered_foods[food_col]
                .dropna()
                .sample(sample_size, random_state=None)
                .astype(str)
                .tolist()
            )
    except Exception as error:
        print("Food Extraction Error:", error)

    return DEFAULT_SUGGESTED_FOODS


def generate_nutrition_plan(
    df,
    user,
    food_col,
    calorie_col,
    protein_col,
    type_col,
    bmi,
    calories,
    protein,
    carbs,
    fats,
):
    """
    Generate a diet-safe meal plan for full-mode users only.

    Important:
    - Hard-block and limited-mode checks must happen in main.py BEFORE this function.
    - This function does not generate disease-specific diets or treatment plans.
    """
    filtered_foods = filter_foods(
        df,
        user,
        food_col,
        calorie_col,
        protein_col,
        type_col,
    )

    raw_suggested_foods = _extract_foods_from_dataframe(filtered_foods, food_col)
    suggested_foods = _clean_suggested_foods(raw_suggested_foods, user)

    return generate_multi_day_plan(
        user=user,
        bmi=bmi,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        suggested_foods=suggested_foods,
    )
