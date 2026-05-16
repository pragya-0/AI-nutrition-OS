import pandas as pd


def filter_foods(
    df,
    user,
    food_col,
    calorie_col,
    protein_col,
    type_col
):

    filtered_foods = df.copy()

    try:

        # Goal filtering

        if calorie_col and user.goal == "fat_loss":

            filtered_foods = filtered_foods[
                filtered_foods[calorie_col] < 400
            ]

        elif protein_col and user.goal == "muscle_gain":

            filtered_foods = filtered_foods[
                filtered_foods[protein_col] > 15
            ]

        # Diet filtering

        if type_col:

            if user.diet == "vegetarian":

                filtered_foods = filtered_foods[
                    filtered_foods[type_col]
                    .astype(str)
                    .str.lower()
                    .str.contains("vegetarian")
                ]

            elif user.diet == "vegan":

                filtered_foods = filtered_foods[
                    filtered_foods[type_col]
                    .astype(str)
                    .str.lower()
                    .str.contains("vegan")
                ]

        # Bengali diet

        if food_col and user.diet == "bengali":

            bengali_keywords = [
                "fish",
                "rice",
                "dal",
                "ilish",
                "rohu",
                "macher"
            ]

            filtered_foods = filtered_foods[
                filtered_foods[food_col]
                .astype(str)
                .str.lower()
                .str.contains(
                    "|".join(bengali_keywords),
                    na=False
                )
            ]

    except Exception as e:

        print("Filtering Error:", e)

    return filtered_foods