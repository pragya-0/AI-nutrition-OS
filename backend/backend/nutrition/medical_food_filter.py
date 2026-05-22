def get_medical_food_rules(medical_conditions):
    condition_text = str(medical_conditions).lower()

    blocked_keywords = []
    warnings = []
    preferred_keywords = []

    if "bp" in condition_text or "blood pressure" in condition_text or "hypertension" in condition_text:
        blocked_keywords.extend([
            "poori",
            "puri",
            "paratha",
            "pakora",
            "fried",
            "pickle",
            "papad",
            "processed",
            "chips",
            "namkeen",
            "heavy curry",
            "butter",
            "cream",
        ])

        warnings.append(
            "Prefer low-sodium meals and avoid deep-fried or heavily processed foods for blood pressure support."
        )

        preferred_keywords.extend([
            "dal",
            "vegetable",
            "salad",
            "grilled",
            "boiled",
            "soup",
            "curd",
            "brown rice",
            "roti",
        ])

    if "thyroid" in condition_text:
        blocked_keywords.extend([
            "processed",
            "deep fried",
            "excess soy",
        ])

        warnings.append(
            "For thyroid wellness, prefer balanced meals, adequate protein, fiber, and avoid excessive processed foods."
        )

    if "diabetes" in condition_text:
        blocked_keywords.extend([
            "sugar",
            "sweet",
            "halwa",
            "dessert",
            "juice",
            "white bread",
            "soft drink",
        ])

        warnings.append(
            "Prefer low-glycemic, high-fiber meals and avoid sugary foods for blood sugar support."
        )

    return {
        "blocked_keywords": list(set(blocked_keywords)),
        "preferred_keywords": list(set(preferred_keywords)),
        "warnings": warnings,
    }


def is_medically_unsuitable(meal_name, medical_conditions):
    rules = get_medical_food_rules(medical_conditions)
    meal_text = str(meal_name).lower()

    for keyword in rules["blocked_keywords"]:
        if keyword in meal_text:
            return True

    return False