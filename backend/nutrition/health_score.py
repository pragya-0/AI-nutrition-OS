def get_score_status(score: int):
    if score >= 90:
        return "Excellent"
    if score >= 75:
        return "Good"
    if score >= 60:
        return "Moderate"
    if score >= 40:
        return "Needs Improvement"
    return "High Risk"


def calculate_dynamic_health_score(
    bmi: float,
    activity: str,
    hydration_score: int,
    sleep_score: int,
    medical_conditions,
    goal: str,
    age: int,
):
    score = 85
    breakdown = {}

    if bmi >= 35:
        score -= 25
        breakdown["bmi"] = -25
    elif bmi >= 30:
        score -= 18
        breakdown["bmi"] = -18
    elif bmi >= 25:
        score -= 8
        breakdown["bmi"] = -8
    elif bmi < 18.5:
        score -= 12
        breakdown["bmi"] = -12
    elif bmi < 21 and goal == "fat_loss":
        score -= 8
        breakdown["bmi"] = -8
    else:
        score += 4
        breakdown["bmi"] = 4

    if activity == "high":
        score += 6
        breakdown["activity"] = 6
    elif activity == "moderate":
        score += 2
        breakdown["activity"] = 2
    else:
        score -= 7
        breakdown["activity"] = -7

    if hydration_score >= 90:
        score += 4
        breakdown["hydration"] = 4
    elif hydration_score >= 75:
        score += 2
        breakdown["hydration"] = 2
    elif hydration_score >= 60:
        score -= 3
        breakdown["hydration"] = -3
    else:
        score -= 7
        breakdown["hydration"] = -7

    if sleep_score >= 90:
        score += 4
        breakdown["sleep"] = 4
    elif sleep_score >= 75:
        score += 2
        breakdown["sleep"] = 2
    elif sleep_score >= 60:
        score -= 4
        breakdown["sleep"] = -4
    else:
        score -= 9
        breakdown["sleep"] = -9

    condition_text = str(medical_conditions).lower()

    medical_penalty = 0

    if condition_text and condition_text not in ["none", "no", ""]:
        medical_penalty -= 5

        if "diabetes" in condition_text:
            medical_penalty -= 5
        if "bp" in condition_text or "blood pressure" in condition_text:
            medical_penalty -= 4
        if "thyroid" in condition_text:
            medical_penalty -= 3

    breakdown["medical_conditions"] = medical_penalty
    score += medical_penalty

    goal_penalty = 0

    if bmi < 21 and goal == "fat_loss":
        goal_penalty -= 8
    elif bmi >= 30 and goal == "muscle_gain":
        goal_penalty -= 6

    breakdown["goal_alignment"] = goal_penalty
    score += goal_penalty

    age_penalty = 0

    if age >= 60:
        age_penalty -= 4
    elif age >= 45:
        age_penalty -= 2

    breakdown["age"] = age_penalty
    score += age_penalty

    score = max(1, min(95, round(score)))

    return {
        "score": score,
        "status": get_score_status(score),
        "breakdown": breakdown,
    }