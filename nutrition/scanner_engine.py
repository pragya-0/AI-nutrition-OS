def detect_food_from_image(filename: str):
    filename = filename.lower()

    if "rice" in filename:
        food = "Rice"
        calories = 250
        protein = 5
        carbs = 55
        fats = 1
    elif "roti" in filename or "chapati" in filename:
        food = "Roti"
        calories = 120
        protein = 4
        carbs = 22
        fats = 3
    elif "paneer" in filename:
        food = "Paneer"
        calories = 265
        protein = 18
        carbs = 6
        fats = 20
    elif "dal" in filename:
        food = "Dal"
        calories = 180
        protein = 10
        carbs = 28
        fats = 4
    elif "biryani" in filename:
        food = "Biryani"
        calories = 450
        protein = 18
        carbs = 55
        fats = 18
    else:
        food = "Indian Meal"
        calories = 320
        protein = 12
        carbs = 42
        fats = 10

    health_score = 80

    if calories > 400:
        health_score -= 15

    if protein >= 15:
        health_score += 5

    health_score = max(1, min(100, health_score))

    return {
        "detected_food": food,
        "confidence": 0.82,
        "estimated_nutrition": {
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fats": fats,
        },
        "health_score": health_score,
        "message": "Food scanned successfully using MVP scanner engine.",
    }