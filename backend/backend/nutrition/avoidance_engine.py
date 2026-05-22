def generate_avoid_foods(
    bmi,
    goal,
    medical_conditions
):

    avoid_foods = []

    if bmi > 25:

        avoid_foods.extend([
            "Sugary Drinks",
            "Deep Fried Foods",
        
            "Processed Snacks",
            "White Bread"
        ])

    if goal == "fat_loss":

        avoid_foods.extend([
            "Ice Cream",
            "Soft Drinks",
            "Fast Food"
        ])

    if "diabetes" in medical_conditions:

        avoid_foods.extend([
            "Sugar",
            "Sweet Desserts",
            "Candy"
        ])

    return list(set(avoid_foods))