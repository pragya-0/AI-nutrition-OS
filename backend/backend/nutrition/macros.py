def calculate_macros(
    calories: int,
    weight: int,
    goal: str
):

    # ==========================================
    # SAFER PROTEIN LOGIC
    # ==========================================

    if goal == "muscle_gain":

        # Higher protein for muscle building
        protein_per_kg = 2.0

    elif goal == "fat_loss":

        # Moderate-high protein for fat loss
        protein_per_kg = 1.6

    else:

        # Maintenance
        protein_per_kg = 1.3

    protein = weight * protein_per_kg

    # ==========================================
    # FAT LOGIC
    # ==========================================

    if goal == "muscle_gain":

        fat_ratio = 0.27

    elif goal == "fat_loss":

        fat_ratio = 0.22

    else:

        fat_ratio = 0.25

    fats = (calories * fat_ratio) / 9

    # ==========================================
    # CALORIE DISTRIBUTION
    # ==========================================

    protein_calories = protein * 4
    fat_calories = fats * 9

    remaining_calories = (
        calories
        - protein_calories
        - fat_calories
    )

    carbs = remaining_calories / 4

    # ==========================================
    # SAFETY CLAMPS
    # ==========================================

    protein = max(50, protein)
    carbs = max(80, carbs)
    fats = max(30, fats)

    # ==========================================
    # RETURN
    # ==========================================

    return {
        "protein": round(protein),
        "carbs": round(carbs),
        "fats": round(fats)
    }