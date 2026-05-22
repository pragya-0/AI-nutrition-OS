def calculate_calories(
    weight: int,
    height: int,
    age: int,
    goal: str,
    activity: str,
    gender: str = "male",
):

    # -----------------------------
    # BMR CALCULATION
    # -----------------------------

    if gender == "female":
        bmr = (
            10 * weight
            + 6.25 * height
            - 5 * age
            - 161
        )
    else:
        bmr = (
            10 * weight
            + 6.25 * height
            - 5 * age
            + 5
        )

    # -----------------------------
    # ACTIVITY MULTIPLIER
    # -----------------------------

    activity_map = {
        "low": 1.2,
        "moderate": 1.45,
        "high": 1.7,
    }

    activity_multiplier = activity_map.get(
        activity,
        1.2
    )

    tdee = bmr * activity_multiplier

    # -----------------------------
    # BMI CALCULATION
    # -----------------------------

    bmi = weight / ((height / 100) ** 2)

    # -----------------------------
    # SMART GOAL LOGIC
    # -----------------------------

    # FAT LOSS
    if goal == "fat_loss":

        if bmi >= 30:
            calories = tdee - 500

        elif bmi >= 25:
            calories = tdee - 350

        else:
            calories = tdee - 250

    # MUSCLE GAIN
    elif goal == "muscle_gain":

        # Obesity-safe recomposition
        if bmi >= 30:

            calories = tdee - 150

        # Lean recomposition
        elif bmi >= 25:

            calories = tdee + 50

        # Proper lean bulk
        else:

            calories = tdee + 250

    # MAINTENANCE
    else:

        calories = tdee

    # -----------------------------
    # SAFETY FLOOR
    # -----------------------------

    if gender == "female":
        calories = max(calories, 1200)

    else:
        calories = max(calories, 1500)

    return round(calories)