# backend/nutrition/ai_engine.py

"""
Rule-based AI tip helper.

Important:
- This function does not receive medical_conditions, age, or pregnancy_status.
- Medical blocking must happen before this function is called.
- Output must stay general wellness-only and avoid medical claims.
"""


def generate_ai_tip(bmi, goal, diet):
    goal = str(goal or "maintenance").lower()
    diet = str(diet or "balanced").lower()

    goal_text = goal.replace("_", " ").title()
    diet_text = diet.replace("_", " ").title()

    if goal in ["muscle_gain", "gain_muscle"]:
        if bmi >= 30:
            return (
                f"Your general wellness plan uses a {diet_text} style with strength-focused habits. "
                "Focus on consistent training, quality protein, hydration, sleep, and gradual progress."
            )

        return (
            f"Your general wellness plan supports muscle gain using a {diet_text} style. "
            "Focus on progressive training, protein-rich meals, hydration, and recovery."
        )

    if goal in ["fat_loss", "weight_loss", "lose_weight"]:
        if bmi >= 25:
            return (
                f"Your general wellness plan uses a {diet_text} style with portion awareness, "
                "protein-rich meals, daily movement, hydration, and consistent sleep."
            )

        return (
            f"Your general wellness plan supports fat loss using a {diet_text} style. "
            "Focus on balanced meals, moderate portions, daily movement, and hydration."
        )

    if goal in ["maintenance", "maintain"]:
        return (
            f"Your general wellness plan supports maintenance using a {diet_text} style. "
            "Focus on balanced meals, stable habits, regular movement, hydration, and sleep."
        )

    return (
        f"Your general wellness plan supports {goal_text} using a {diet_text} style. "
        "Stay consistent with meals, hydration, movement, and sleep."
    )
