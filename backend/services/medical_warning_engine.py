# backend/services/medical_warning_engine.py
from __future__ import annotations

"""
Production safety policy for AI Nutrition OS.

AI Nutrition OS is a general wellness product, not a medical device.
This engine classifies users into:
- hard_block: no nutrition/workout/calorie/macro/AI-coach generation
- limited_mode: general wellness education only, no calorie/macro/workout prescription
- full_mode: normal wellness plan allowed

Policy:
- Show disclaimers.
- Limit medical claims.
- Avoid diagnosis/treatment advice.
- Recommend qualified professionals when risk is present.
"""

from typing import Any


MEDICAL_DISCLAIMER = (
    "AI Nutrition OS provides general wellness information only and is not a substitute for medical advice, "
    "diagnosis, treatment, emergency care, or professional dietary counselling."
)

PROFESSIONAL_CONSULT_MESSAGE = (
    "Please consult a qualified doctor, registered dietitian, or healthcare professional before making "
    "nutrition, exercise, medication, or lifestyle changes related to this condition."
)

GENERAL_MEDICAL_BLOCK_MESSAGE = (
    "A higher-risk medical or safety concern was detected. AI Nutrition OS cannot generate nutrition, "
    "workout, calorie, macro, or AI-coach recommendations for this profile. "
    f"{PROFESSIONAL_CONSULT_MESSAGE}"
)

LIMITED_MODE_MESSAGE = (
    "A health-related condition or lifestyle risk was detected. AI Nutrition OS will provide only general "
    "wellness education, not a personalized calorie, macro, workout, or disease-specific meal plan. "
    f"{PROFESSIONAL_CONSULT_MESSAGE}"
)

AGE_BLOCK_MESSAGE = (
    "AI Nutrition OS currently supports only users aged 18 to 59. "
    "Please consult a qualified healthcare professional."
)

PREGNANCY_BLOCK_MESSAGE = (
    "Pregnancy-related wellness guidance is currently unavailable. "
    "Please consult a qualified healthcare professional."
)

INVALID_PROFILE_BLOCK_MESSAGE = (
    "Invalid medical profile detected. Please review the entered details or consult a qualified healthcare professional."
)

EMERGENCY_BLOCK_MESSAGE = (
    "Potential urgent medical concern detected. AI Nutrition OS cannot provide guidance for this. "
    "Please contact emergency services or seek immediate medical attention."
)

SUBSTANCE_BLOCK_MESSAGE = (
    "Heavy smoking, heavy alcohol use, or dependency concern was detected. AI Nutrition OS cannot safely "
    "generate recommendations for this profile. Please consult a qualified healthcare professional or "
    "addiction-support specialist."
)

SAFE_EMPTY_VALUES = {
    "",
    "none",
    "no",
    "nil",
    "na",
    "n/a",
    "not applicable",
    "not_applicable",
    "not provided",
    "not_provided",
    "nothing",
    "no medical conditions",
    "no condition",
    "healthy",
    "fit",
    "normal",
}

# These should never get automated calorie/macro/workout planning.
HARD_BLOCK_MEDICAL_KEYWORDS = {
    "cancer",
    "tumor",
    "tumour",
    "oncology",
    "chemotherapy",
    "radiation therapy",
    "kidney disease",
    "ckd",
    "chronic kidney",
    "renal failure",
    "renal disease",
    "dialysis",
    "liver failure",
    "cirrhosis",
    "hepatitis",
    "heart failure",
    "heart attack",
    "cardiac failure",
    "stroke",
    "eating disorder",
    "anorexia",
    "bulimia",
    "binge eating disorder",
    "recent surgery",
    "post surgery",
    "post-surgery",
    "insulin dependent",
    "insulin-dependent",
    "type 1 diabetes",
    "severe hypertension",
    "uncontrolled hypertension",
    "severe anemia",
    "severe anaemia",
}

# These can receive only non-prescriptive general wellness education.
LIMITED_MODE_MEDICAL_KEYWORDS = {
    "diabetes",
    "diabetic",
    "prediabetes",
    "pre diabetes",
    "insulin resistance",
    "thyroid",
    "hypothyroidism",
    "hyperthyroidism",
    "pcos",
    "pcod",
    "high cholesterol",
    "cholesterol",
    "hypertension",
    "high blood pressure",
    "low blood pressure",
    "bp",
    "fatty liver",
    "obesity",
    "metabolic syndrome",
    "ibs",
    "irritable bowel syndrome",
    "gerd",
    "acid reflux",
    "gastritis",
    "celiac",
    "asthma",
    "migraine",
    "anemia",
    "anaemia",
    "vitamin deficiency",
    "b12 deficiency",
    "iron deficiency",
    "arthritis",
    "joint pain",
    "back pain",
    "depression",
    "anxiety",
    "autoimmune",
    "lupus",
    "rheumatoid arthritis",
}

PREGNANCY_KEYWORDS = {
    "pregnant",
    "pregnancy",
    "postpartum",
    "post partum",
    "post-partum",
    "breastfeeding",
    "lactating",
    "trying to conceive",
    "planning pregnancy",
    "ttc",
    "fertility treatment",
    "ivf",
}

EMERGENCY_KEYWORDS = {
    "suicidal",
    "self harm",
    "self-harm",
    "overdose",
    "chest pain",
    "heart attack",
    "stroke symptoms",
    "severe bleeding",
    "emergency",
    "can't breathe",
    "cannot breathe",
    "difficulty breathing",
    "unconscious",
    "seizure now",
    "fainting",
}

HARD_BLOCK_SUBSTANCE_KEYWORDS = {
    "heavy smoker",
    "chain smoker",
    "smoking addiction",
    "tobacco addiction",
    "nicotine addiction",
    "20 cigarettes",
    "pack a day",
    "heavy alcohol",
    "heavy drinking",
    "drinks heavily",
    "daily alcohol",
    "alcohol dependency",
    "alcohol dependence",
    "alcohol addiction",
    "alcoholic",
    "substance abuse",
    "drug abuse",
    "drug addiction",
    "addiction",
    "rehab",
    "withdrawal",
}

LIMITED_SUBSTANCE_KEYWORDS = {
    "former smoker",
    "occasional smoker",
    "social smoker",
    "occasional alcohol",
    "social drinking",
    "drinks occasionally",
    "alcohol occasionally",
}


def normalize_text(value: Any) -> str:
    if isinstance(value, list):
        value = " ".join(str(item or "") for item in value)
    return str(value or "").lower().replace("_", " ").replace("-", " ").strip()


def is_safe_empty_value(value: Any) -> bool:
    return normalize_text(value) in SAFE_EMPTY_VALUES


def matched_keywords(text: str, keywords: set[str]) -> list[str]:
    if not text:
        return []
    return sorted({keyword for keyword in keywords if keyword in text})


def _base_response(
    *,
    risk_level: str,
    hard_block: bool,
    limited_mode: bool,
    reason: str | None,
    risk_type: str,
    detected_conditions: list[str] | None = None,
    warnings: list[str] | None = None,
) -> dict:
    detected_conditions = detected_conditions or []
    warnings = warnings or []

    all_warnings = [
        reason,
        *warnings,
        MEDICAL_DISCLAIMER,
    ]

    return {
        "risk_level": risk_level,
        "warnings": list(dict.fromkeys([warning for warning in all_warnings if warning])),
        "detected_conditions": sorted(set(detected_conditions)),
        "hard_block": hard_block,
        "limited_mode": limited_mode,
        "full_mode": not hard_block and not limited_mode,
        "block_reason": reason if hard_block else None,
        "limited_reason": reason if limited_mode else None,
        "risk_type": risk_type,
        "medical_disclaimer": MEDICAL_DISCLAIMER,
        "professional_consult_recommended": hard_block or limited_mode,
        "medical_claims_allowed": False,
        "diagnosis_allowed": False,
        "treatment_advice_allowed": False,
    }


def block_response(*, reason: str, risk_type: str, detected_conditions: list[str] | None = None) -> dict:
    return _base_response(
        risk_level="high",
        hard_block=True,
        limited_mode=False,
        reason=reason,
        risk_type=risk_type,
        detected_conditions=detected_conditions,
    )


def limited_response(*, reason: str, risk_type: str, detected_conditions: list[str] | None = None) -> dict:
    return _base_response(
        risk_level="medium",
        hard_block=False,
        limited_mode=True,
        reason=reason,
        risk_type=risk_type,
        detected_conditions=detected_conditions,
    )


def low_risk_response() -> dict:
    return _base_response(
        risk_level="low",
        hard_block=False,
        limited_mode=False,
        reason=None,
        risk_type="none",
        detected_conditions=[],
        warnings=[],
    )


def analyze_medical_risk(user_data: Any) -> dict:
    age = int(getattr(user_data, "age", 0) or 0)
    gender = normalize_text(getattr(user_data, "gender", ""))

    medical_conditions = normalize_text(getattr(user_data, "medical_conditions", ""))
    pregnancy_status = normalize_text(getattr(user_data, "pregnancy_status", ""))

    smoker_alcohol = normalize_text(
        getattr(user_data, "smoker_alcohol", "")
        or getattr(user_data, "smoker_or_alcohol", "")
        or getattr(user_data, "smoking_alcohol", "")
        or getattr(user_data, "smoker", "")
        or getattr(user_data, "alcohol", "")
        or getattr(user_data, "substance_use", "")
        or getattr(user_data, "addiction_status", "")
    )

    combined_text = f"{medical_conditions} {pregnancy_status} {smoker_alcohol}".strip()

    # Age is a product-scope / safety hard block.
    if age < 18 or age >= 60:
        return block_response(
            reason=AGE_BLOCK_MESSAGE,
            risk_type="age_restriction",
        )

    emergency_matches = matched_keywords(combined_text, EMERGENCY_KEYWORDS)
    if emergency_matches:
        return block_response(
            reason=EMERGENCY_BLOCK_MESSAGE,
            risk_type="emergency",
            detected_conditions=emergency_matches,
        )

    pregnancy_matches = matched_keywords(f"{medical_conditions} {pregnancy_status}", PREGNANCY_KEYWORDS)

    if gender == "male" and pregnancy_matches:
        return block_response(
            reason=INVALID_PROFILE_BLOCK_MESSAGE,
            risk_type="invalid_profile",
            detected_conditions=pregnancy_matches,
        )

    if pregnancy_matches:
        return block_response(
            reason=PREGNANCY_BLOCK_MESSAGE,
            risk_type="pregnancy",
            detected_conditions=pregnancy_matches,
        )

    hard_substance_matches = matched_keywords(smoker_alcohol, HARD_BLOCK_SUBSTANCE_KEYWORDS)
    if hard_substance_matches:
        return block_response(
            reason=SUBSTANCE_BLOCK_MESSAGE,
            risk_type="substance_use",
            detected_conditions=hard_substance_matches,
        )

    hard_medical_matches = matched_keywords(medical_conditions, HARD_BLOCK_MEDICAL_KEYWORDS)
    if hard_medical_matches:
        return block_response(
            reason=GENERAL_MEDICAL_BLOCK_MESSAGE,
            risk_type="medical_condition",
            detected_conditions=hard_medical_matches,
        )

    limited_medical_matches = matched_keywords(medical_conditions, LIMITED_MODE_MEDICAL_KEYWORDS)
    limited_substance_matches = matched_keywords(smoker_alcohol, LIMITED_SUBSTANCE_KEYWORDS)

    # If user typed a condition that we do not recognize, safest public behavior is limited mode,
    # not full personalized planning and not a blunt hard block.
    unknown_medical_text_present = (
        not is_safe_empty_value(medical_conditions)
        and not hard_medical_matches
        and not limited_medical_matches
    )

    if limited_medical_matches or limited_substance_matches or unknown_medical_text_present:
        detected = limited_medical_matches + limited_substance_matches
        if unknown_medical_text_present:
            detected.append(medical_conditions)

        return limited_response(
            reason=LIMITED_MODE_MESSAGE,
            risk_type="limited_wellness",
            detected_conditions=detected,
        )

    return low_risk_response()
