def calculate_weekly_consistency(meals_completed, workouts_completed, water_days, sleep_days):
    total_score = 0

    total_score += min(meals_completed, 7) * 20 / 7
    total_score += min(workouts_completed, 7) * 30 / 7
    total_score += min(water_days, 7) * 25 / 7
    total_score += min(sleep_days, 7) * 25 / 7

    return round(total_score)


def generate_progress_feedback(score):
    if score >= 85:
        return "Excellent consistency this week. Keep the routine stable."

    if score >= 65:
        return "Good progress. Improve one weak habit next week."

    if score >= 40:
        return "You are building momentum. Focus on small daily wins."

    return "Start simple: complete meals, hydration, and light movement consistently."