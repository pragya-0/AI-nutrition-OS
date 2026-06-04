import os

import requests
from dotenv import load_dotenv
load_dotenv()

try:
    from services.medical_warning_engine import analyze_medical_risk, MEDICAL_DISCLAIMER
except Exception:
    analyze_medical_risk = None
    MEDICAL_DISCLAIMER = (
        "AI Nutrition OS provides general wellness information only and is not a substitute for medical advice, "
        "diagnosis, treatment, emergency care, or professional dietary counselling."
    )


OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

MEDICAL_REFUSAL_MESSAGE = (
    "I cannot provide nutrition, workout, or wellness recommendations for this profile because a medical risk "
    "or restricted condition was detected. Please consult a qualified doctor, registered dietitian, or healthcare professional."
)


def call_openrouter(system_prompt: str, user_prompt: str, max_tokens: int = 180):
    if not OPENROUTER_API_KEY:
        return None

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ai-nutrition-os.vercel.app",
                "X-OpenRouter-Title": "AI Nutrition OS",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.25,
                "max_tokens": max_tokens,
            },
            timeout=20,
        )

        response.raise_for_status()
        data = response.json()

        return data["choices"][0]["message"]["content"].strip()

    except Exception:
        return None


def get_medical_risk(user_data):
    if analyze_medical_risk is None:
        return {
            "hard_block": True,
            "block_reason": (
                "Medical safety engine is unavailable. AI Nutrition OS cannot safely generate recommendations."
            ),
            "warnings": [MEDICAL_DISCLAIMER],
        }

    return analyze_medical_risk(user_data)


def should_block_ai_generation(user_data):
    risk = get_medical_risk(user_data)
    return bool(risk.get("hard_block"))


def get_ai_block_message(user_data):
    risk = get_medical_risk(user_data)
    return risk.get("block_reason") or MEDICAL_REFUSAL_MESSAGE


def rule_based_coach(user_data):
    if should_block_ai_generation(user_data):
        return None

    goal = str(getattr(user_data, "goal", "maintenance")).lower()
    diet = str(getattr(user_data, "diet", "balanced")).lower()

    if goal in ["fat_loss", "weight_loss"]:
        return (
            f"Focus on a controlled calorie deficit with high-protein {diet} meals, "
            "daily walking, beginner strength training, hydration, and consistent sleep. "
            f"{MEDICAL_DISCLAIMER}"
        )

    if goal == "muscle_gain":
        return (
            f"Prioritize progressive strength training, protein-rich {diet} meals, "
            "recovery, hydration, and consistent sleep. "
            f"{MEDICAL_DISCLAIMER}"
        )

    return (
        f"Maintain balanced {diet} meals, regular movement, hydration, sleep, "
        f"and a stable daily routine. {MEDICAL_DISCLAIMER}"
    )


def rule_based_workout_tip(user_data):
    if should_block_ai_generation(user_data):
        return None

    goal = str(getattr(user_data, "goal", "maintenance")).lower()

    if goal in ["fat_loss", "weight_loss"]:
        return "6:00 PM - 30 minutes brisk walking + beginner strength training."

    if goal == "muscle_gain":
        return "6:00 PM - Beginner full-body strength workout with warm-up and recovery."

    return "6:00 PM - Moderate activity: walking, mobility, and light strength training."


def generate_ai_coach(user_data, groq_fallback=None):
    """
    Priority:
    1. Medical safety gate
    2. OpenRouter
    3. Groq fallback
    4. Rule-based fallback
    """

    if should_block_ai_generation(user_data):
        return None

    system_prompt = (
        "You are a safe AI wellness coach for a public Indian nutrition platform. "
        "You provide general wellness education only, not medical advice, diagnosis, treatment, prescriptions, "
        "disease management, medication guidance, or emergency care. "
        "Never claim to treat, reverse, cure, diagnose, manage, or prevent disease. "
        "Avoid extreme dieting, fasting, or unsafe workout advice. "
        "Keep the response concise and practical."
    )

    user_prompt = f"""
Create a personalized general wellness coaching message.

Name: {getattr(user_data, "name", "")}
Age: {getattr(user_data, "age", "")}
Gender: {getattr(user_data, "gender", "")}
Goal: {getattr(user_data, "goal", "")}
Diet: {getattr(user_data, "diet", "")}
Activity: {getattr(user_data, "activity", "")}
Fitness level: {getattr(user_data, "fitness_level", "")}
Medical conditions: {getattr(user_data, "medical_conditions", "")}
Pregnancy status: {getattr(user_data, "pregnancy_status", "not_applicable")}

Rules:
- Under 80 words.
- Indian food and lifestyle context.
- General wellness only.
- No diagnosis, treatment, disease support, medication advice, or medical claims.
- Include no disease-specific guidance.
"""

    openrouter_result = call_openrouter(system_prompt, user_prompt, max_tokens=180)
    if openrouter_result:
        return openrouter_result

    if groq_fallback:
        try:
            groq_result = groq_fallback(user_data)
            if groq_result:
                return groq_result
        except Exception:
            pass

    return rule_based_coach(user_data)


def generate_ai_workout_tip(user_data, groq_fallback=None):
    """
    Priority:
    1. Medical safety gate
    2. OpenRouter
    3. Groq fallback
    4. Rule-based fallback
    """

    if should_block_ai_generation(user_data):
        return None

    system_prompt = (
        "You are a safe fitness assistant for a public wellness app. "
        "Give one short, practical, beginner-safe movement tip. "
        "Do not provide medical, rehabilitation, pregnancy, injury, disease, or treatment advice. "
        "Avoid extreme training and unsafe claims."
    )

    user_prompt = f"""
Create one safe workout tip.

Age: {getattr(user_data, "age", "")}
Gender: {getattr(user_data, "gender", "")}
Goal: {getattr(user_data, "goal", "")}
Activity: {getattr(user_data, "activity", "")}
Fitness level: {getattr(user_data, "fitness_level", "")}
Workout type: {getattr(user_data, "workout_type", "gym")}
Medical conditions: {getattr(user_data, "medical_conditions", "")}
Pregnancy status: {getattr(user_data, "pregnancy_status", "not_applicable")}

Rules:
- Under 25 words.
- Beginner-safe.
- General wellness only.
- No medical, disease, injury, pregnancy, or treatment guidance.
"""

    openrouter_result = call_openrouter(system_prompt, user_prompt, max_tokens=80)
    if openrouter_result:
        return openrouter_result

    if groq_fallback:
        try:
            groq_result = groq_fallback(user_data)
            if groq_result:
                return groq_result
        except Exception:
            pass

    return rule_based_workout_tip(user_data)


def generate_health_insight(user_data, analytics=None, groq_fallback=None):
    """
    Optional wellness insight generator.
    Priority:
    1. Medical safety gate
    2. OpenRouter
    3. Groq fallback
    4. Rule-based fallback
    """

    if should_block_ai_generation(user_data):
        return None

    system_prompt = (
        "You are a safe wellness insight assistant for a nutrition dashboard. "
        "Explain lifestyle metrics in simple, non-diagnostic language. "
        "Do not provide medical diagnosis, treatment, disease prediction, or clinical interpretation."
    )

    user_prompt = f"""
Create a short general wellness insight.

User:
Age: {getattr(user_data, "age", "")}
Gender: {getattr(user_data, "gender", "")}
Goal: {getattr(user_data, "goal", "")}
Diet: {getattr(user_data, "diet", "")}
Activity: {getattr(user_data, "activity", "")}
Medical conditions: {getattr(user_data, "medical_conditions", "")}

Analytics:
{analytics or {}}

Rules:
- Under 70 words.
- Explain safely.
- General wellness only.
- No medical diagnosis, treatment, or disease claims.
"""

    openrouter_result = call_openrouter(system_prompt, user_prompt, max_tokens=160)
    if openrouter_result:
        return openrouter_result

    if groq_fallback:
        try:
            groq_result = groq_fallback(user_data)
            if groq_result:
                return groq_result
        except Exception:
            pass

    return (
        "Your plan is personalized using your body profile, activity, hydration, sleep, "
        "and nutrition goal. Focus on consistency, safe habits, and gradual progress. "
        f"{MEDICAL_DISCLAIMER}"
    )
