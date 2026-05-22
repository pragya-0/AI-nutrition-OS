def generate_ai_tip(bmi, goal, diet):
    if bmi > 25:
        return """
Your BMI indicates slightly higher body fat levels.

Focus on:
- Higher protein
- Walking
- Hydration
- Calorie deficit
"""

    elif bmi < 18:
        return """
Your BMI is low.

Focus on:
- Higher calorie meals
- Strength training
- Protein-rich foods
"""

    return f"""
Your nutrition plan is optimized for {goal} using a {diet} diet style.

Stay consistent for best results.
"""