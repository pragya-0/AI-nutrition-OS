def calculate_calories(
    weight: int,
    height: int,
    age: int,
    goal: str,
    activity: str
):

    # BMR Formula
    bmr = (
        10 * weight
        + 6.25 * height
        - 5 * age
        + 5
    )

    # Activity multiplier

    activity_map = {
        "low": 1.2,
        "moderate": 1.55,
        "high": 1.75
    }

    calories = bmr * activity_map.get(
        activity,
        1.2
    )

    # Goal adjustment

    if goal == "fat_loss":
        calories -= 400

    elif goal == "muscle_gain":
        calories += 300

    return round(calories)