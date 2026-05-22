import os
import json
import base64
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def extract_json(text: str):
    try:
        text = text.replace("```json", "").replace("```", "").strip()
        start = text.find("{")
        end = text.rfind("}") + 1

        if start == -1 or end == 0:
            return None

        return json.loads(text[start:end])

    except Exception as e:
        print("GROQ JSON PARSE ERROR:", e)
        return None


def groq_vision_scan(image_path):
    if client is None:
        print("GROQ VISION ERROR: GROQ_API_KEY missing")
        return None

    try:
        base64_image = encode_image(image_path)

        prompt = """
You are an AI nutrition vision scanner.

Analyze the uploaded food image.

Return ONLY valid JSON in this exact format:

{
  "detected_food": "food name",
  "confidence": 0.85,
  "estimated_nutrition": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "health_score": 0,
  "analysis": "short nutrition analysis"
}

Rules:
- Return JSON only
- No markdown
- No explanation outside JSON
- Estimate one normal serving
- confidence must be between 0 and 1
- health_score must be between 1 and 100
"""

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            temperature=0.2,
            max_tokens=700,
        )

        content = response.choices[0].message.content
        print("\n========== GROQ VISION RAW ==========")
        print(content)
        print("=====================================\n")

        parsed = extract_json(content)

        if not parsed:
            return None

        return parsed

    except Exception as e:
        print("\n❌ GROQ VISION ERROR")
        print(str(e))
        return None