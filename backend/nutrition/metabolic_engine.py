def determine_metabolic_strategy(bmi, goal, activity, body_fat=None):
    """
    Determines the safest and most useful metabolic strategy for the user.

    Keeps the newer metabolic intelligence logic:
    - metabolic adaptation
    - calorie adjustment
    - body recomposition logic
    - consistency score logic
    - dynamic deficit/surplus logic
    """

    strategy = "Balanced Maintenance"
    calorie_adjustment = 0
    protein_multiplier = 1.6
    risk_level = "low"
    reason = ""
    recommended_focus = []
    coaching_focus = []

    goal = str(goal or "maintenance").lower()
    activity = str(activity or "moderate").lower()

    consistency_score = 70

    if activity in ["low", "sedentary"]:
        consistency_score = 45
    elif activity in ["moderate", "medium"]:
        consistency_score = 70
    elif activity in ["high", "very_active", "active"]:
        consistency_score = 88

    if bmi < 21:
        if goal == "fat_loss":
            strategy = "Lean Recomposition"
            calorie_adjustment = -100
            protein_multiplier = 1.8
            risk_level = "medium"
            reason = (
                "BMI is already lean, so aggressive fat loss is not recommended. "
                "The safer strategy is body recomposition with a very small deficit."
            )
            recommended_focus = [
                "preserve muscle mass",
                "avoid aggressive deficit",
                "strength training",
                "adequate protein",
            ]
            coaching_focus = [
                "Preserve muscle mass",
                "Avoid aggressive calorie deficits",
                "Improve body composition",
            ]

        elif goal == "muscle_gain":
            strategy = "Lean Muscle Building"
            calorie_adjustment = 250
            protein_multiplier = 2.0
            reason = "BMI is lean, so a controlled lean muscle gain phase is suitable."
            recommended_focus = [
                "progressive overload",
                "calorie surplus",
                "protein optimization",
                "sleep recovery",
            ]
            coaching_focus = [
                "Progressive overload",
                "High protein intake",
                "Recovery optimization",
            ]

        else:
            strategy = "Lean Maintenance"
            calorie_adjustment = 0
            protein_multiplier = 1.6
            reason = "BMI is in the lean range, so maintenance and strength support are suitable."
            recommended_focus = [
                "balanced meals",
                "consistent training",
                "hydration",
            ]
            coaching_focus = [
                "Maintain energy levels",
                "Support strength",
                "Build routine consistency",
            ]

    elif 21 <= bmi < 27:
        if goal == "fat_loss":
            strategy = "Controlled Fat Reduction"
            calorie_adjustment = -300
            protein_multiplier = 1.8
            reason = "A controlled calorie deficit can support gradual fat loss without harming energy or muscle mass."
            recommended_focus = [
                "high satiety meals",
                "moderate deficit",
                "daily movement",
                "strength training",
            ]
            coaching_focus = [
                "Controlled calorie deficit",
                "High satiety meals",
                "Muscle preservation",
            ]

        elif goal == "muscle_gain":
            strategy = "Lean Muscle Gain"
            calorie_adjustment = 200
            protein_multiplier = 2.0
            reason = "BMI supports a lean muscle gain strategy with a controlled surplus."
            recommended_focus = [
                "strength training",
                "lean surplus",
                "protein intake",
                "progressive overload",
            ]
            coaching_focus = [
                "Lean surplus",
                "Progressive overload",
                "Recovery optimization",
            ]

        else:
            strategy = "Metabolic Maintenance"
            calorie_adjustment = 0
            protein_multiplier = 1.6
            reason = "Current body range supports maintenance and lifestyle optimization."
            recommended_focus = [
                "balanced macros",
                "routine consistency",
                "activity balance",
            ]
            coaching_focus = [
                "Balanced macros",
                "Routine consistency",
                "Stable energy",
            ]

    else:
        if goal == "muscle_gain":
            strategy = "Body Recomposition"
            calorie_adjustment = -100
            protein_multiplier = 2.0
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
            coaching_focus = [
                "Reduce body fat gradually",
                "Preserve lean muscle",
                "Increase movement consistency",
            ]

        elif goal == "fat_loss":
            strategy = "Aggressive Fat Reduction"
            calorie_adjustment = -500
            protein_multiplier = 2.0
            risk_level = "medium"
            reason = "BMI is elevated, so a structured fat-loss strategy is appropriate."
            recommended_focus = [
                "controlled calorie deficit",
                "high protein",
                "walking",
                "strength training",
            ]
            coaching_focus = [
                "High satiety meals",
                "Controlled calorie deficit",
                "Cardio plus resistance training",
            ]

        else:
            strategy = "Weight Stabilization"
            calorie_adjustment = -150
            protein_multiplier = 1.8
            reason = "A small calorie reduction can support better metabolic stability."
            recommended_focus = [
                "stable routine",
                "balanced meals",
                "gradual activity increase",
            ]
            coaching_focus = [
                "Stable eating routine",
                "Gradual activity improvement",
                "Metabolic stability",
            ]

    if body_fat is not None:
        try:
            body_fat_value = float(body_fat)

            if body_fat_value >= 32 and goal == "fat_loss":
                calorie_adjustment -= 100
                risk_level = "medium"
                recommended_focus.append("body fat reduction")
                coaching_focus.append("Improve body composition gradually")
                reason += " Body fat is elevated, so the deficit has been slightly increased."

            elif body_fat_value < 15 and goal == "fat_loss":
                calorie_adjustment = max(calorie_adjustment, -100)
                risk_level = "medium"
                recommended_focus.append("avoid excessive leanness")
                coaching_focus.append("Avoid aggressive fat loss")
                reason += " Body fat appears low, so aggressive fat loss is avoided."

            elif body_fat_value >= 25 and goal == "muscle_gain" and bmi >= 27:
                strategy = "Body Recomposition"
                calorie_adjustment = min(calorie_adjustment, -100)
                recommended_focus.append("recomposition before bulking")
                coaching_focus.append("Prioritize recomposition before surplus")
                reason += " Body fat is elevated, so recomposition is safer than a direct bulk."

        except Exception:
            pass

    if activity in ["low", "sedentary"]:
        calorie_adjustment -= 50
        recommended_focus.append("increase daily steps")
        coaching_focus.append("Improve daily movement consistency")
        reason += " Low activity detected, so calories are adjusted slightly downward."

    elif activity in ["high", "very_active", "active"]:
        if goal == "muscle_gain":
            calorie_adjustment += 100
            reason += " High activity detected, so the surplus is slightly increased for recovery."
        elif goal == "fat_loss":
            calorie_adjustment += 50
            reason += " High activity detected, so the deficit is slightly softened to protect recovery."

        recommended_focus.append("support recovery")
        coaching_focus.append("Support recovery and hydration")

    if goal == "fat_loss":
        calorie_adjustment = max(calorie_adjustment, -650)

        if bmi < 21:
            calorie_adjustment = max(calorie_adjustment, -100)
            risk_level = "medium"

    elif goal == "muscle_gain":
        calorie_adjustment = min(calorie_adjustment, 350)

        if bmi >= 27:
            calorie_adjustment = min(calorie_adjustment, -100)
            strategy = "Body Recomposition"
            risk_level = "medium"

    recommended_focus = list(dict.fromkeys(recommended_focus))
    coaching_focus = list(dict.fromkeys(coaching_focus))

    return {
        "strategy": strategy,
        "calorie_adjustment": calorie_adjustment,
        "protein_multiplier": protein_multiplier,
        "risk_level": risk_level,
        "reason": reason.strip(),
        "recommended_focus": recommended_focus,
        "coaching_focus": coaching_focus,
        "consistency_score": consistency_score,
    }