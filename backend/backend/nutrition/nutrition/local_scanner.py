from transformers import pipeline

classifier = pipeline(
    "image-classification",
    model="nateraw/food"
)


def local_food_scan(image_path: str):
    results = classifier(image_path)
    top = results[0]

    label = top["label"]
    confidence = round(top["score"], 2)

    return {
        "detected_food": label,
        "confidence": confidence,
        "estimated_nutrition": {
            "calories": 320,
            "protein": 12,
            "carbs": 42,
            "fats": 10,
        },
        "health_score": 75,
        "analysis": "Local AI vision model detected the food when Gemini was unavailable.",
        "warnings": ["Gemini unavailable, local scanner used"],
        "suggestions": ["Nutrition is estimated. Gemini gives better precision."],
    }