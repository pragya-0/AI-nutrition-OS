from pathlib import Path

macros_code = '''def calculate_macros(
    calories: int,
    weight: int,
    goal: str,
    medical_conditions: str = "",
    pregnancy_status: str = "",
):
    medical_text = str(medical_conditions or "").lower()
    pregnancy_text = str(pregnancy_status or "").lower()

    try:
        calories = int(calories)
    except Exception:
        calories = 1500

    try:
        weight = float(weight)
    except Exception:
        weight = 60

    goal = str(goal or "maintenance").lower()

    # =====================================
    # PREGNANCY-SAFE CALORIE INCREASE
    # =====================================

    if pregnancy_text == "pregnant":
        calories += 250

    # =====================================
    # PROTEIN LOGIC
    # =====================================

    if goal == "muscle_gain":
        protein = weight * 2.2

    elif goal == "fat_loss":
        protein = weight * 2.0

    else:
        protein = weight * 1.8

    # =====================================
    # KIDNEY DISEASE PROTEIN CAP
    # =====================================

    if "kidney" in medical_text or "renal" in medical_text:
        protein = min(
            protein,
            round(weight * 0.8)
        )

    # =====================================
    # CARB AND FAT SPLIT
    # =====================================

    protein_calories = protein * 4

    fats = calories * 0.25 / 9

    fat_calories = fats * 9

    carbs = (
        calories
        - protein_calories
        - fat_calories
    ) / 4

    # =====================================
    # DIABETES CARB CONTROL
    # =====================================

    if "diabetes" in medical_text or "diabetic" in medical_text:
        carbs = round(carbs * 0.75)

    # =====================================
    # SAFETY CLAMPS
    # =====================================

    protein = max(45, protein)
    carbs = max(80, carbs)
    fats = max(30, fats)

    # =====================================
    # REBALANCE CALORIES AFTER MACRO CHANGES
    # =====================================

    calories = (
        protein * 4
        + carbs * 4
        + fats * 9
    )

    return {
        "calories": round(calories),
        "protein": round(protein),
        "carbs": round(carbs),
        "fats": round(fats)
    }
'''

output_path = Path("/mnt/data/macros_medical_safety_updated.py")
output_path.write_text(macros_code, encoding="utf-8")

compile(macros_code, str(output_path), "exec")

print(f"Updated macros.py saved to: {output_path}")
