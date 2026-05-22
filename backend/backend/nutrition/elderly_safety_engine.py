def apply_elderly_safety_filter(
    meal_days,
    user,
    targets,
    daily_routine,
):
    age = int(getattr(user, "age", 30) or 30)
    medical_text = str(getattr(user, "medical_conditions", "") or "").lower()
    water_intake = float(getattr(user, "water_intake", 2.5) or 2.5)

    warnings = []
    changes = []
    safety_score = 100

    if age < 65:
        # =====================================
        # NON-ELDERLY HYDRATION SAFETY
        # =====================================

        if water_intake < 1.8:
            warnings.append(
                "Hydration is currently low. Increase water and electrolyte intake gradually throughout the day."
            )

            safety_score -= 5

        safety_score = max(70, min(95, safety_score))

        return {
            "meal_days": meal_days,
            "targets": targets,
            "daily_routine": daily_routine,
            "warnings": warnings,
            "changes": changes,
            "safety_score": safety_score,
        }

    weight = float(getattr(user, "weight", 60) or 60)
    goal = getattr(user, "goal", "maintenance")

    max_protein_multiplier = 1.25

    if goal == "muscle_gain":
        max_protein_multiplier = 1.45

    safe_protein_cap = round(weight * max_protein_multiplier)

    # =====================================
    # PROTEIN SAFETY CAP
    # =====================================

    if targets.get("protein", 0) > safe_protein_cap:
        old_protein = targets["protein"]

        targets["protein"] = safe_protein_cap

        changes.append(
            f"Protein adjusted from {old_protein}g to {safe_protein_cap}g for elderly safety."
        )

        safety_score -= 3

    # =====================================
    # CONDITION FLAGS
    # =====================================

    low_bp = (
        "low bp" in medical_text
        or "low blood pressure" in medical_text
        or "hypotension" in medical_text
    )

    diabetes = (
        "diabetes" in medical_text
        or "sugar" in medical_text
    )

    thyroid = "thyroid" in medical_text

    # =====================================
    # GENERAL ELDERLY WARNING
    # =====================================

    warnings.append(
        "For older adults, prioritize low-impact movement, balance training, strength work, and recovery."
    )

    # =====================================
    # LOW BP WARNING
    # =====================================

    if low_bp:
        warnings.append(
            "Low BP noted: avoid fasted intense workouts, hydrate consistently, and consider electrolyte balance."
        )

        safety_score -= 4

    # =====================================
    # DIABETES WARNING
    # =====================================

    if diabetes:
        warnings.append(
            "Diabetes noted: prefer high-fiber, low-glycemic meals and avoid sugary drinks or refined carbs."
        )

        safety_score -= 4

    # =====================================
    # THYROID WARNING
    # =====================================

    if thyroid:
        warnings.append(
            "If taking thyroid medication, keep soy/tofu and calcium-rich foods away from medication timing."
        )

        safety_score -= 2

    # =====================================
    # LOW HYDRATION WARNING
    # =====================================

    if water_intake < 1.8:
        warnings.append(
            "Hydration is currently low. Increase water and electrolyte intake gradually throughout the day."
        )

        safety_score -= 5

    # =====================================
    # ELDERLY-SAFE WORKOUT OVERRIDE
    # =====================================

    daily_routine["workout_time"] = (
        "Low-impact walking + light resistance bands + balance/mobility work"
    )

    daily_routine["elderly_safety_tip"] = (
        "Move slowly between positions, avoid overexertion, and stop exercise if dizziness, chest discomfort, or unusual fatigue occurs."
    )

    changes.append(
        "Workout adjusted to low-impact walking, light resistance bands, and balance/mobility work for elderly safety."
    )

    # =====================================
    # FINAL SAFETY SCORE
    # Prevent fake perfect scores.
    # =====================================

    safety_score = max(70, min(95, safety_score))

    return {
        "meal_days": meal_days,
        "targets": targets,
        "daily_routine": daily_routine,
        "warnings": list(dict.fromkeys(warnings)),
        "changes": list(dict.fromkeys(changes)),
        "safety_score": safety_score,
    }
