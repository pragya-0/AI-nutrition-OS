def generate_ai_tip(bmi, goal, diet):
    goal_text = goal.replace("_", " ").title()
    diet_text = diet.replace("_", " ").title()

    # IMPORTANT: goal always comes first. BMI only modifies the advice.

    if goal == "muscle_gain":
        if bmi >= 30:
            return (
                f"Your plan is optimized for lean muscle gain using a {diet_text} diet style. "
                "Because BMI is slightly higher, focus on strength training, high-quality protein, "
                "a controlled calorie surplus, hydration, and recovery while avoiding excess fat gain."
            )

        return (
            f"Your plan is optimized for muscle gain using a {diet_text} diet style. "
            "Focus on progressive overload, calorie surplus, high-quality protein, hydration, "
            "and proper sleep recovery."
        )

    if goal == "fat_loss":
        if bmi >= 25:
            return (
                f"Your BMI indicates higher body fat levels. Your {diet_text} plan is optimized "
                "for fat loss with a calorie deficit, higher protein, walking/cardio, hydration, "
                "and consistent meal timing."
            )

        return (
            f"Your plan is optimized for fat loss using a {diet_text} diet style. "
            "Focus on a moderate calorie deficit, protein-rich meals, daily movement, "
            "and hydration."
        )

    if goal == "maintenance":
        return (
            f"Your plan is optimized for maintenance using a {diet_text} diet style. "
            "Focus on balanced meals, stable calories, strength training, hydration, "
            "and consistent sleep."
        )

    return (
        f"Your nutrition plan is optimized for {goal_text} using a {diet_text} diet style. "
        "Stay consistent with your meals, hydration, movement, and sleep."
    )