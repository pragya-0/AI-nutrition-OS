import random

from nutrition.meal_generator import generate_multi_day_plan
from nutrition.filters import filter_foods


VEGETARIAN_BLOCKED = [
    "chicken",
    "fish",
    "egg",
    "eggs",
    "meat",
    "mutton",
    "beef",
    "pork",
    "prawn",
    "shrimp",
    "crab",
]

VEGAN_BLOCKED = VEGETARIAN_BLOCKED + [
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
    "kheer",
    "custard",
]

FAT_LOSS_BLOCKED = [
    "ice cream",
    "kheer",
    "sweet",
    "sugar",
    "fried",
    "pakora",
    "samosa",
    "burger",
    "pizza",
    "soft drink",
    "soda",
    "butter",
    "ghee",
    "cream",
]

GOAL_FOODS = {
    "fat_loss": [
        "Moong dal chilla",
        "Sprouts chaat",
        "Vegetable dal soup",
        "Roti with mixed vegetable curry",
        "Brown rice with dal",
        "Paneer bhurji with salad",
        "Tofu vegetable stir fry",
        "Chickpea salad bowl",
        "Roasted chana",
        "Poha with peanuts",
    ],
    "muscle_gain": [
        "Paneer bhurji with roti",
        "Rajma rice",
        "Chole rice",
        "Sprouts paneer salad",
        "Peanut banana smoothie",
        "Tofu quinoa bowl",
        "Dal khichdi",
        "Soya chunks curry",
        "Curd rice with vegetables",
        "Chickpea rice bowl",
    ],
    "maintenance": [
        "Dal rice",
        "Roti with vegetable curry",
        "Poha",
        "Upma",
        "Khichdi",
        "Paneer vegetable wrap",
        "Chana salad",
        "Vegetable pulao",
        "Curd with fruit",
        "Mixed veg dalia",
    ],
}

DIET_BOOSTS = {
    "vegan": [
        "Tofu curry",
        "Chickpea salad",
        "Rajma rice",
        "Soya chunks curry",
        "Sprouts chaat",
        "Dal soup",
    ],
    "vegetarian": [
        "Paneer bhurji",
        "Curd rice",
        "Dal rice",
        "Moong dal chilla",
        "Vegetable pulao",
        "Sprouts chaat",
    ],
    "non_vegetarian": [
        "Chicken rice bowl",
        "Fish curry",
        "Egg bhurji",
        "Grilled chicken salad",
        "Chicken curry with rice",
    ],
}


def normalize_goal(goal: str) -> str:
    if goal in ["fat_loss", "muscle_gain", "maintenance"]:
        return goal
    return "maintenance"


def normalize_diet(diet: str) -> str:
    if diet in ["vegan", "vegetarian", "non_vegetarian"]:
        return diet
    return "vegetarian"


def is_safe_food(food: str, diet: str, goal: str) -> bool:
    text = str(food or "").lower()

    if not text.strip():
        return False

    if diet == "vegan":
        if any(blocked in text for blocked in VEGAN_BLOCKED):
            return False

    if diet == "vegetarian":
        if any(blocked in text for blocked in VEGETARIAN_BLOCKED):
            return False

    if goal == "fat_loss":
        if any(blocked in text for blocked in FAT_LOSS_BLOCKED):
            return False

    return True


def get_dataset_foods(filtered_foods, food_col, diet, goal):
    if not food_col or filtered_foods.empty:
        return []

    foods = (
        filtered_foods[food_col]
        .dropna()
        .astype(str)
        .drop_duplicates()
        .tolist()
    )

    safe_foods = [
        food for food in foods
        if is_safe_food(food, diet, goal)
    ]

    random.shuffle(safe_foods)

    return safe_foods[:40]


def build_dynamic_food_pool(filtered_foods, food_col, user, bmi):
    goal = normalize_goal(getattr(user, "goal", "maintenance"))
    diet = normalize_diet(getattr(user, "diet", "vegetarian"))
    activity = getattr(user, "activity", "moderate")

    dataset_foods = get_dataset_foods(
        filtered_foods=filtered_foods,
        food_col=food_col,
        diet=diet,
        goal=goal,
    )

    goal_foods = GOAL_FOODS.get(goal, GOAL_FOODS["maintenance"])
    diet_foods = DIET_BOOSTS.get(diet, DIET_BOOSTS["vegetarian"])

    bmi_foods = []

    if bmi >= 25 and goal == "fat_loss":
        bmi_foods = [
            "High protein sprouts chaat",
            "Moong dal soup",
            "Roti with tofu vegetable curry",
            "Brown rice dal bowl",
        ]

    elif bmi < 18 and goal == "muscle_gain":
        bmi_foods = [
            "Paneer rice bowl",
            "Peanut banana smoothie",
            "Rajma rice",
            "Chickpea pulao",
        ]

    activity_foods = []

    if activity == "high":
        activity_foods = [
            "Banana peanut smoothie",
            "Rajma rice bowl",
            "Paneer roti roll",
            "Chole rice",
        ]

    elif activity == "low":
        activity_foods = [
            "Vegetable soup",
            "Moong dal chilla",
            "Sprouts salad",
            "Light dal khichdi",
        ]

    combined = dataset_foods + goal_foods + diet_foods + bmi_foods + activity_foods

    clean_unique = []

    for food in combined:
        food = str(food).strip()

        if food and food.lower() not in [item.lower() for item in clean_unique]:
            if is_safe_food(food, diet, goal):
                clean_unique.append(food)

    random.shuffle(clean_unique)

    fallback = goal_foods + diet_foods

    if len(clean_unique) < 12:
        clean_unique.extend(fallback)

    return clean_unique[:50]


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
    filtered_foods = filter_foods(
        df,
        user,
        food_col,
        calorie_col,
        protein_col,
        type_col,
    )

    suggested_foods = build_dynamic_food_pool(
        filtered_foods=filtered_foods,
        food_col=food_col,
        user=user,
        bmi=bmi,
    )

    meal_plan = generate_multi_day_plan(
        user=user,
        bmi=bmi,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fats=fats,
        suggested_foods=suggested_foods,
    )

    return meal_plan