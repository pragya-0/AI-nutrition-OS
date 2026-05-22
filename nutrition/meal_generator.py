def determine_metabolic_strategy(bmi, goal, activity, body_fat=None):
    strategy = "Balanced Maintenance"
    calorie_adjustment = 0
    protein_multiplier = 1.5
    risk_level = "low"
    reason = ""
    recommended_focus = []

    if bmi < 21:
        if goal == "fat_loss":
            strategy = "Lean Recomposition"
            calorie_adjustment = -100
            protein_multiplier = 1.5
            risk_level = "medium"
            reason = (
                "BMI is already lean, so aggressive fat loss is not recommended. "
                "The safer strategy is body recomposition."
            )
            recommended_focus = [
                "preserve muscle mass",
                "avoid aggressive deficit",
                "strength training",
                "adequate protein",
            ]

        elif goal == "muscle_gain":
            strategy = "Lean Muscle Building"
            calorie_adjustment = 250
            protein_multiplier = 1.8
            reason = "BMI is lean, so a controlled lean muscle gain phase is suitable."
            recommended_focus = [
                "progressive overload",
                "calorie surplus",
                "protein optimization",
                "sleep recovery",
            ]

        else:
            strategy = "Lean Maintenance"
            reason = "BMI is in the lean range, so maintenance and strength support are suitable."
            recommended_focus = [
                "balanced meals",
                "consistent training",
                "hydration",
            ]

    elif 21 <= bmi < 27:
        if goal == "fat_loss":
            strategy = "Controlled Fat Reduction"
            calorie_adjustment = -300
            protein_multiplier = 1.6
            reason = "A controlled calorie deficit can support gradual fat loss."
            recommended_focus = [
                "high satiety meals",
                "moderate deficit",
                "daily movement",
            ]

        elif goal == "muscle_gain":
            strategy = "Lean Muscle Gain"
            calorie_adjustment = 200
            protein_multiplier = 1.8
            reason = "BMI supports a lean muscle gain strategy with controlled surplus."
            recommended_focus = [
                "strength training",
                "lean surplus",
                "protein intake",
            ]

        else:
            strategy = "Metabolic Maintenance"
            reason = "Current body range supports maintenance and lifestyle optimization."
            recommended_focus = [
                "balanced macros",
                "routine consistency",
                "activity balance",
            ]

    else:
        if goal == "muscle_gain":
            strategy = "Body Recomposition"
            calorie_adjustment = -100
            protein_multiplier = 1.6
            risk_level = "medium"
            reason = (
                "BMI is elevated, so aggressive bulking is not recommended. "
                "The safer strategy is fat reduction while preserving or building muscle."
            )
            recommended_focus = [
                "body recomposition",
                "strength training",
                "fat reduction",
                "movement consistency",
            ]

        elif goal == "fat_loss":
            strategy = "Aggressive Fat Reduction"
            calorie_adjustment = -500
            protein_multiplier = 1.7
            risk_level = "medium"
            reason = "BMI is elevated, so a structured fat-loss strategy is appropriate."
            recommended_focus = [
                "controlled calorie deficit",
                "high protein",
                "walking",
                "strength training",
            ]

        else:
            strategy = "Weight Stabilization"
            calorie_adjustment = -150
            protein_multiplier = 1.5
            reason = "A small calorie reduction can support better metabolic stability."
            recommended_focus = [
                "stable routine",
                "balanced meals",
                "gradual activity increase",
            ]

    if activity == "low":
        calorie_adjustment -= 50
        recommended_focus.append("increase daily steps")

    return {
        "strategy": strategy,
        "calorie_adjustment": calorie_adjustment,
        "protein_multiplier": protein_multiplier,
        "risk_level": risk_level,
        "reason": reason,
        "recommended_focus": recommended_focus,
    }