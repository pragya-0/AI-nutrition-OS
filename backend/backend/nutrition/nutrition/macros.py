def calculate_macros(
    calories: int,
    weight: int,
    goal: str
):

    # Protein logic

    if goal == "muscle_gain":
        protein = weight * 2.2

    elif goal == "fat_loss":
        protein = weight * 2.0

    else:
        protein = weight * 1.8

    # Carb and fat split

    protein_calories = protein * 4

    fats = calories * 0.25 / 9

    fat_calories = fats * 9

    carbs = (
        calories
        - protein_calories
        - fat_calories
    ) / 4

    return {
        "protein": round(protein),
        "carbs": round(carbs),
        "fats": round(fats)
    }