import os
import requests


OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")


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
                "temperature": 0.4,
                "max_tokens": max_tokens,
            },
            timeout=20,
        )

        response.raise_for_status()
        data = response.json()

        return data["choices"][0]["message"]["content"].strip()

    except Exception:
        return None


def should_block_ai_generation(user_data):
    medical_conditions = str(
        getattr(user_data, "medical_conditions", "")
    ).lower()

    pregnancy_status = str(
        getattr(user_data, "pregnancy_status", "")
    ).lower()

    age = int(getattr(user_data, "age", 0) or 0)

    if (
        age < 18
        or age >= 60
        or "pregnant" in pregnancy_status
        or "pregnant" in medical_conditions
        or "kidney" in medical_conditions
        or "renal" in medical_conditions
        or "ckd" in medical_conditions
    ):
        return True

    return False


def rule_based_coach(user_data):
    goal = str(getattr(user_data, "goal", "maintenance")).lower()
    diet = str(getattr(user_data, "diet", "balanced")).lower()

    if goal == "fat_loss":
        return (
            f"Focus on a controlled calorie deficit with high-protein {diet} meals, "
            "daily walking, beginner strength training, hydration, and consistent sleep."
        )

    if goal == "muscle_gain":
        return (
            f"Prioritize progressive strength training, protein-rich {diet} meals, "
            "recovery, hydration, and consistent sleep."
        )

    return (
        f"Maintain balanced {diet} meals, regular movement, hydration, sleep, "
        "and a stable daily routine."
    )


def rule_based_workout_tip(user_data):
    goal = str(getattr(user_data, "goal", "maintenance")).lower()

    if goal == "fat_loss":
        return "6:00 PM - 30 minutes brisk walking + beginner strength training."

    if goal == "muscle_gain":
        return "6:00 PM - Beginner full-body strength workout with warm-up and recovery."

    return "6:00 PM - Moderate activity: walking, mobility, and light strength training."


def generate_ai_coach(user_data, groq_fallback=None):
    """
    Priority:
    1. OpenRouter
    2. Groq fallback
    3. Rule-based fallback
    """

    medical_conditions = str(
        getattr(user_data, "medical_conditions", "")
    ).lower()

    pregnancy_status = str(
        getattr(user_data, "pregnancy_status", "")
    ).lower()

    age = int(getattr(user_data, "age", 0) or 0)

    if (
        age < 18
        or age >= 60
        or "pregnant" in pregnancy_status
        or "pregnant" in medical_conditions
        or "kidney" in medical_conditions
        or "renal" in medical_conditions
        or "ckd" in medical_conditions
    ):
        return None

    system_prompt = (
        "You are a safe AI nutrition coach for an Indian nutrition platform. "
        "Give practical, medically cautious, non-diagnostic advice. "
        "Do not make unsafe medical claims. "
        "Do not generate pregnancy-specific meal intelligence. "
        "Keep the response concise and useful."
    )

    user_prompt = f"""
Create a personalized AI nutrition coaching message.

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
- Keep under 80 words.
- Use Indian food and lifestyle context.
- Mention safety if medical conditions exist.
- No pregnancy-specific meal plans.
- No diagnosis or treatment claims.
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
    1. OpenRouter
    2. Groq fallback
    3. Rule-based fallback
    """

    medical_conditions = str(
        getattr(user_data, "medical_conditions", "")
    ).lower()

    pregnancy_status = str(
        getattr(user_data, "pregnancy_status", "")
    ).lower()

    age = int(getattr(user_data, "age", 0) or 0)

    if (
        age < 18
        or age >= 60
        or "pregnant" in pregnancy_status
        or "pregnant" in medical_conditions
        or "kidney" in medical_conditions
        or "renal" in medical_conditions
        or "ckd" in medical_conditions
    ):
        return None

    system_prompt = (
        "You are a safe fitness coach for a nutrition app. "
        "Give one short, practical workout tip. "
        "Avoid extreme training, unsafe claims, medical treatment advice, "
        "and pregnancy-specific workout plans."
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
- Practical for Indian lifestyle.
- If medical risk exists, prefer low-intensity guidance.
- No pregnancy-specific workout plans.
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
    Optional health insight generator.
    Priority:
    1. OpenRouter
    2. Groq fallback
    3. Rule-based fallback
    """

    medical_conditions = str(
        getattr(user_data, "medical_conditions", "")
    ).lower()

    pregnancy_status = str(
        getattr(user_data, "pregnancy_status", "")
    ).lower()

    age = int(getattr(user_data, "age", 0) or 0)

    if (
        age < 18
        or age >= 60
        or "pregnant" in pregnancy_status
        or "pregnant" in medical_conditions
        or "kidney" in medical_conditions
        or "renal" in medical_conditions
        or "ckd" in medical_conditions
    ):
        return None

    system_prompt = (
        "You are a safe health insight assistant for a nutrition dashboard. "
        "Explain body metrics in simple, non-diagnostic language. "
        "Do not provide medical diagnosis or treatment."
    )

    user_prompt = f"""
Create a short health insight.

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
- Mention lifestyle improvement only.
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
        "and nutrition goal. Focus on consistency, safe habits, and gradual progress."
    )
