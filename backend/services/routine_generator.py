from datetime import datetime, timedelta


def _parse_time(value, fallback="07:00"):
    try:
        value = str(value or fallback).strip()

        if "AM" in value.upper() or "PM" in value.upper():
            return datetime.strptime(value, "%I:%M %p")

        return datetime.strptime(value, "%H:%M")

    except Exception:
        return datetime.strptime(fallback, "%H:%M")


def _format_time(dt):
    return dt.strftime("%I:%M %p").lstrip("0")


def _normalize_goal(goal):
    goal = str(goal or "maintenance").lower().strip().replace("-", "_").replace(" ", "_")

    if goal in ["fat_loss", "weight_loss", "lose_weight", "weightloss"]:
        return "fat_loss"

    if goal in ["muscle_gain", "gain_muscle", "lean_muscle", "bulk"]:
        return "muscle_gain"

    return "maintenance"


def _safe_float(value, fallback):
    try:
        return float(value)
    except Exception:
        return fallback


def generate_daily_routine(user, goal):
    """
    Public-safe lifestyle routine generator.

    Medical profiles should already be blocked before this function is called.
    This routine does not provide disease-specific, pregnancy, medication,
    rehabilitation, injury, or clinical guidance.
    """

    goal = _normalize_goal(goal)
    wake_dt = _parse_time(getattr(user, "wake_time", "07:00") or "07:00", "07:00")
    sleep_dt = _parse_time(getattr(user, "sleep_time", "23:00") or "23:00", "23:00")

    activity = str(getattr(user, "activity", "moderate") or "moderate").lower()
    water_intake = _safe_float(getattr(user, "water_intake", 2.5), 2.5)
    fitness_level = str(getattr(user, "fitness_level", "beginner") or "beginner").lower()
    workout_type = str(getattr(user, "workout_type", "gym") or "gym").lower()

    breakfast_dt = wake_dt + timedelta(hours=1)
    mid_morning_dt = wake_dt + timedelta(hours=3)
    lunch_dt = wake_dt + timedelta(hours=6)
    evening_snack_dt = wake_dt + timedelta(hours=10)
    dinner_dt = sleep_dt - timedelta(hours=3)

    if dinner_dt <= lunch_dt:
        dinner_dt = lunch_dt + timedelta(hours=5)

    workout_dt = dinner_dt - timedelta(hours=2)

    if goal == "fat_loss":
        if activity == "low" or fitness_level == "beginner":
            workout = f"{_format_time(workout_dt)} - 25-30 mins brisk walking + beginner strength basics"
        elif activity == "high":
            workout = f"{_format_time(workout_dt)} - Cardio-strength session with a recovery-focused finish"
        else:
            workout = f"{_format_time(workout_dt)} - Cardio + strength training at a sustainable pace"

    elif goal == "muscle_gain":
        if fitness_level == "advanced":
            workout = f"{_format_time(workout_dt)} - Progressive strength workout with controlled form"
        else:
            workout = f"{_format_time(workout_dt)} - Beginner full-body strength workout with warm-up"

    else:
        if workout_type in ["home", "bodyweight"]:
            workout = f"{_format_time(workout_dt)} - Home mobility + bodyweight strength routine"
        else:
            workout = f"{_format_time(workout_dt)} - Light maintenance workout + stretching"

    if water_intake < 2:
        hydration_tip = "Increase hydration gradually and keep water visible during work or study hours."
    elif water_intake >= 3.5:
        hydration_tip = "Keep hydration steady across the day instead of drinking most of it at once."
    else:
        hydration_tip = "Maintain consistent hydration throughout the day."

    if goal == "fat_loss":
        focus_tip = "Keep lunch protein-forward and make dinner lighter but satisfying."
    elif goal == "muscle_gain":
        focus_tip = "Spread protein across meals and pair training with a planned recovery meal."
    else:
        focus_tip = "Keep meal timing stable and use scans to learn your strongest eating patterns."

    sleep_tip = f"Sleep by {_format_time(sleep_dt)} to support recovery, energy, and routine consistency."

    return {
        "wake_up": f"{_format_time(wake_dt)} - Wake up and hydrate",
        "morning_hydration": "Drink 400-500ml water after waking up",
        "breakfast_time": f"{_format_time(breakfast_dt)} - Balanced breakfast with protein and fiber",
        "mid_morning": f"{_format_time(mid_morning_dt)} - Fruit, sprouts, nuts, or a light planned snack",
        "lunch_time": f"{_format_time(lunch_dt)} - Balanced lunch with protein, fiber, and controlled carbs",
        "evening_snack": f"{_format_time(evening_snack_dt)} - Protein or fiber-rich snack",
        "workout_time": workout,
        "dinner_time": f"{_format_time(dinner_dt)} - Light balanced dinner",
        "hydration_tip": hydration_tip,
        "focus_tip": focus_tip,
        "medical_tip": "",
        "sleep_tip": sleep_tip,
        "disclaimer": (
            "General wellness routine only. This is not medical advice, diagnosis, treatment, "
            "rehabilitation, pregnancy guidance, or emergency care."
        ),
    }
