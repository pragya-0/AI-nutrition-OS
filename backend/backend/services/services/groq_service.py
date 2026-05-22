import os
import json
from groq import Groq


def get_groq_api_key():
    return os.getenv("GROQ_API_KEY")


def get_groq_client():
    api_key = get_groq_api_key()

    if not api_key:
        return None

    return Groq(api_key=api_key)


def generate_groq_coach_tip(user_profile, analytics, targets):
    client = get_groq_client()

    if client is None:
        return None

    try:
        prompt = f"""
You are an expert Indian nutrition coach.

Create a short, goal-aware nutrition coaching message.

User profile:
{json.dumps(user_profile, indent=2)}

Analytics:
{json.dumps(analytics, indent=2)}

Targets:
{json.dumps(targets, indent=2)}

Rules:
- If goal is muscle_gain, do NOT mention calorie deficit.
- If goal is muscle_gain, mention strength training, calorie surplus, protein, recovery.
- If goal is fat_loss, mention controlled calorie deficit.
- If goal is maintenance, mention balance and consistency.
- Respect diet preference.
- Keep it under 80 words.
- Be practical, friendly, and specific.
"""

        chat = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise nutrition assistant for Indian users.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.4,
            max_tokens=180,
        )

        return chat.choices[0].message.content.strip()

    except Exception as e:
        print("Groq coach failed, using fallback:", e)
        return None