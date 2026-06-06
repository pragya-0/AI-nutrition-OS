import os
import re
from typing import Any

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


def _safe_text(value: Any) -> str:
    text = str(value or "").strip()
    text = text.replace("â€™", "'").replace("â", "'")
    text = text.replace("â€“", "-").replace("â€”", "-")
    text = text.replace("sautÃ©ed", "sautéed")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


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
        return _safe_text(data["choices"][0]["message"]["content"])

    except Exception as error:
        print("OPENROUTER COACH ERROR:", error)
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


def _extract_plan_summary(plan_context: dict | None):
    plan_context = plan_context or {}

    targets = plan_context.get("targets") or {}
    analytics = plan_context.get("analytics") or {}
    meal_plan = plan_context.get("meal_plan") or {}
    meal_quality = (
        plan_context.get("meal_quality")
        or analytics.get("meal_quality")
        or analytics.get("plan_quality")
        or {}
    )

    days = meal_plan.get("days") or []
    first_day = days[0] if days else {}

    return {
        "calories": targets.get("calories"),
        "protein": targets.get("protein"),
        "carbs": targets.get("carbs"),
        "fats": targets.get("fats"),
        "meal_variety": meal_quality.get("meal_variety"),
        "max_repeat": meal_quality.get("max_repeat"),
        "consecutive_repeats": meal_quality.get("consecutive_repeats"),
        "first_day_breakfast": first_day.get("breakfast"),
        "first_day_lunch": first_day.get("lunch"),
        "first_day_dinner": first_day.get("dinner"),
        "plan_days": len(days),
    }


def rule_based_coach(user_data, plan_context: dict | None = None):
    if should_block_ai_generation(user_data):
        return None

    goal = str(getattr(user_data, "goal", "maintenance")).lower()
    diet = str(getattr(user_data, "diet", "balanced")).replace("_", " ")
    name = str(getattr(user_data, "name", "") or "").strip()
    summary = _extract_plan_summary(plan_context)

    greeting = f"{name}, " if name else ""

    calorie_text = ""
    if summary.get("calories") and summary.get("protein"):
        calorie_text = f"Your current target is about {summary['calories']} kcal with {summary['protein']}g protein. "

    variety_text = ""
    if summary.get("meal_variety") is not None:
        variety_text = f"Your plan variety score is {summary['meal_variety']}/100. "

    if goal in ["fat_loss", "weight_loss"]:
        return _safe_text(
            f"{greeting}{calorie_text}{variety_text}"
            f"Use your {diet} plan as the anchor today: prioritize protein at breakfast, vegetables at lunch, "
            "and a lighter dinner. Track one scan after your largest meal so the dashboard can learn your pattern."
        )

    if goal == "muscle_gain":
        return _safe_text(
            f"{greeting}{calorie_text}{variety_text}"
            f"Use your {diet} plan to spread protein across meals. Pair today’s workout with your highest-protein meal "
            "and log progress so the next plan can adapt."
        )

    return _safe_text(
        f"{greeting}{calorie_text}{variety_text}"
        f"Follow the first planned meals today and log one food scan. Consistency plus scan history will help AI Nutrition OS "
        "find your real eating pattern."
    )


def rule_based_workout_tip(user_data):
    if should_block_ai_generation(user_data):
        return None

    goal = str(getattr(user_data, "goal", "maintenance")).lower()
    activity = str(getattr(user_data, "activity", "moderate")).lower()
    fitness_level = str(getattr(user_data, "fitness_level", "beginner")).lower()

    if goal in ["fat_loss", "weight_loss"]:
        if activity == "low" or fitness_level == "beginner":
            return "Start with 25-30 minutes of brisk walking plus 10 minutes of beginner strength work."
        return "Do 30 minutes of cardio-strength training and keep intensity comfortable enough to stay consistent."

    if goal == "muscle_gain":
        if fitness_level == "advanced":
            return "Focus on progressive strength training, controlled form, and enough recovery between hard sessions."
        return "Do a beginner full-body strength session with warm-up, controlled reps, and recovery time."

    return "Choose a sustainable movement block: walking, mobility, or light strength training for 25-35 minutes."


def generate_ai_coach(user_data, groq_fallback=None, plan_context: dict | None = None):
    """
    Safe plan-aware AI coach.

    Priority:
    1. Medical safety gate
    2. OpenRouter plan-aware output
    3. Groq fallback
    4. Rule-based fallback

    This accepts optional plan_context while remaining backward-compatible with
    older calls that pass only user_data and groq_fallback.
    """

    if should_block_ai_generation(user_data):
        return None

    summary = _extract_plan_summary(plan_context)

    system_prompt = (
        "You are a safe AI wellness coach for a public Indian nutrition platform. "
        "You provide general wellness education only, not medical advice, diagnosis, treatment, prescriptions, "
        "disease management, medication guidance, or emergency care. "
        "Never claim to treat, reverse, cure, diagnose, manage, or prevent disease. "
        "Avoid extreme dieting, fasting, or unsafe workout advice. "
        "Be specific, useful, and based on the provided plan context."
    )

    user_prompt = f"""
Create a personalized general wellness coaching message.

User:
Name: {getattr(user_data, "name", "")}
Age: {getattr(user_data, "age", "")}
Gender: {getattr(user_data, "gender", "")}
Goal: {getattr(user_data, "goal", "")}
Diet: {getattr(user_data, "diet", "")}
Activity: {getattr(user_data, "activity", "")}
Fitness level: {getattr(user_data, "fitness_level", "")}
Pregnancy status: {getattr(user_data, "pregnancy_status", "not_applicable")}

Plan context:
Calories: {summary.get("calories")}
Protein: {summary.get("protein")}
Carbs: {summary.get("carbs")}
Fats: {summary.get("fats")}
Plan days: {summary.get("plan_days")}
Meal variety score: {summary.get("meal_variety")}
Max meal repeat: {summary.get("max_repeat")}
Consecutive repeats: {summary.get("consecutive_repeats")}
First breakfast: {summary.get("first_day_breakfast")}
First lunch: {summary.get("first_day_lunch")}
First dinner: {summary.get("first_day_dinner")}

Rules:
- Under 85 words.
- Indian food and lifestyle context.
- Give one clear action for today.
- Mention plan pattern only if useful.
- General wellness only.
- No diagnosis, treatment, disease support, medication advice, or medical claims.
- Include no disease-specific guidance.
"""

    openrouter_result = call_openrouter(system_prompt, user_prompt, max_tokens=190)
    if openrouter_result:
        return openrouter_result

    if groq_fallback:
        try:
            groq_result = groq_fallback(user_data)
            if groq_result:
                return _safe_text(groq_result)
        except Exception:
            pass

    return rule_based_coach(user_data, plan_context=plan_context)


def generate_ai_workout_tip(user_data, groq_fallback=None):
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
                return _safe_text(groq_result)
        except Exception:
            pass

    return rule_based_workout_tip(user_data)


def generate_health_insight(user_data, analytics=None, groq_fallback=None):
    if should_block_ai_generation(user_data):
        return None

    analytics = analytics or {}

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

Analytics:
{analytics}

Rules:
- Under 70 words.
- Explain one useful pattern or next action.
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
                return _safe_text(groq_result)
        except Exception:
            pass

    variety = analytics.get("meal_variety") or analytics.get("meal_quality", {}).get("meal_variety")
    if variety is not None:
        return (
            f"Your plan variety score is {variety}/100. Use the first week to follow the plan, then scan meals so "
            "AI Nutrition OS can identify your real eating patterns and improve future recommendations."
        )

    return (
        "Your plan combines body profile, activity, sleep, hydration, and nutrition goals. "
        "Log meals and scans consistently so future insights become more personalized."
    )
