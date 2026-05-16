from nutrition.meal_generator import (
    generate_multi_day_plan
)

from nutrition.filters import (
    filter_foods
)


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
    fats
):

    # =====================================
    # FILTER FOODS
    # =====================================

    filtered_foods = filter_foods(
        df,
        user,
        food_col,
        calorie_col,
        protein_col,
        type_col
    )

    # =====================================
    # FOOD EXTRACTION
    # =====================================

    try:

        if (
            food_col
            and not filtered_foods.empty
        ):

            suggested_foods = (
                filtered_foods[food_col]
                .dropna()
                .sample(
                    min(
                        50,
                        len(filtered_foods)
                    )
                )
                .tolist()
            )

        else:

            suggested_foods = [
                "Rice",
                "Dal",
                "Paneer",
                "Eggs",
                "Fish Curry",
                "Chicken Curry",
                "Sprouts Salad",
                "Roti",
                "Upma",
                "Poha"
            ]

    except Exception as e:

        print(
            "Food Extraction Error:",
            e
        )

        suggested_foods = [
            "Rice",
            "Dal",
            "Eggs",
            "Chicken Curry"
        ]

    # =====================================
    # GENERATE MULTI DAY PLAN
    # =====================================

    meal_plan = generate_multi_day_plan(

        user=user,

        bmi=bmi,

        calories=calories,

        protein=protein,

        carbs=carbs,

        fats=fats,

        suggested_foods=suggested_foods
    )

    return meal_plan