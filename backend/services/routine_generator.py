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


def _medical_text(user):
    return str(getattr(user, "medical_conditions", "") or "").lower()


def generate_daily_routine(user, goal):
    wake_raw = getattr(user, "wake_time", "07:00") or "07:00"
    sleep_raw = getattr(user, "sleep_time", "23:00") or "23:00"

    wake_dt = _parse_time(wake_raw, "07:00")
    sleep_dt = _parse_time(sleep_raw, "23:00")

    activity = getattr(user, "activity", "moderate")
    water_intake = float(getattr(user, "water_intake", 2.5) or 2.5)
    fitness_level = getattr(user, "fitness_level", "beginner")
    age = int(getattr(user, "age", 30) or 30)

    medical = _medical_text(user)

    low_bp = (
        "low bp" in medical
        or "low blood pressure" in medical
        or "hypotension" in medical
    )

    diabetes = "diabetes" in medical or "sugar" in medical
    thyroid = "thyroid" in medical
    bp_high = "high bp" in medical or "bp high" in medical or "hypertension" in medical

    breakfast_dt = wake_dt + timedelta(hours=1)
    mid_morning_dt = wake_dt + timedelta(hours=3)
    lunch_dt = wake_dt + timedelta(hours=6)
    evening_snack_dt = wake_dt + timedelta(hours=10)
    dinner_dt = sleep_dt - timedelta(hours=3)

    if dinner_dt <= lunch_dt:
        dinner_dt = lunch_dt + timedelta(hours=5)

    workout_dt = dinner_dt - timedelta(hours=2)

    if goal == "fat_loss":
        if age >= 65 or low_bp:
            workout = f"{_format_time(workout_dt)} - Low-impact walking + light resistance bands + balance/mobility work"
        elif activity == "low":
            workout = f"{_format_time(workout_dt)} - 30 mins brisk walking + beginner fat loss workout"
        elif activity == "high":
            workout = f"{_format_time(workout_dt)} - Cardio intervals + strength training with recovery focus"
        else:
            workout = f"{_format_time(workout_dt)} - Fat loss cardio + strength training"

    elif goal == "muscle_gain":
        if age >= 65:
            workout = f"{_format_time(workout_dt)} - Joint-safe strength training + resistance bands + mobility"
        elif fitness_level == "advanced":
            workout = f"{_format_time(workout_dt)} - Heavy compound lifting + progressive overload"
        else:
            workout = f"{_format_time(workout_dt)} - Progressive overload strength workout"

    else:
        if age >= 65:
            workout = f"{_format_time(workout_dt)} - Light walking + mobility + balance training"
        else:
            workout = f"{_format_time(workout_dt)} - Light maintenance workout + stretching"

    if water_intake < 2:
        hydration_tip = "Increase water intake gradually to improve recovery, digestion, and energy."
    elif low_bp:
        hydration_tip = "Maintain hydration and consider electrolyte balance; avoid long gaps without food if dizziness occurs."
    elif bp_high:
        hydration_tip = "Stay hydrated while keeping sodium intake controlled for blood pressure support."
    else:
        hydration_tip = "Maintain consistent hydration throughout the day."

    medical_tip = ""

    if diabetes:
        medical_tip += "Prefer low-glycemic, high-fiber meals and avoid sugary drinks. "

    if thyroid:
        medical_tip += "If taking thyroid medication, keep soy/tofu and calcium-rich foods away from medication timing. "

    if low_bp:
        medical_tip += "For low BP, avoid fasted intense workouts and watch for dizziness. "

    if bp_high:
        medical_tip += "For high BP, avoid excess salt, deep-fried foods, and processed snacks. "

    sleep_tip = f"Sleep by {_format_time(sleep_dt)} for recovery, hormones, and energy."

    if age >= 65:
        sleep_tip += " Keep the routine gentle and recovery-focused."

    return {
        "wake_up": f"{_format_time(wake_dt)} - Wake up and hydrate",
        "morning_hydration": "Drink 500ml water after waking up",
        "breakfast_time": f"{_format_time(breakfast_dt)} - High-protein balanced breakfast",
        "mid_morning": f"{_format_time(mid_morning_dt)} - Fruit, sprouts, or light healthy snack",
        "lunch_time": f"{_format_time(lunch_dt)} - Balanced lunch with protein, fiber, and controlled carbs",
        "evening_snack": f"{_format_time(evening_snack_dt)} - Protein-rich snack",
        "workout_time": workout,
        "dinner_time": f"{_format_time(dinner_dt)} - Light balanced dinner",
        "hydration_tip": hydration_tip,
        "medical_tip": medical_tip.strip(),
        "sleep_tip": sleep_tip,
    }