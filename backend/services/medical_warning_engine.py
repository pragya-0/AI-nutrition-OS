# backend/services/medical_warning_engine.py

"""
Public-launch medical safety engine for AI Nutrition OS.

Policy:
- AI Nutrition OS is a general wellness app, not a medical service.
- Any disease / medical condition mentioned by the user blocks plan generation.
- Pregnancy-related states, age outside 18-59, emergency language, and addiction/substance-abuse language block plan generation.
- The backend must return a visible warning and generate no calories, macros, workout, meal plan, or AI coach result when blocked.
"""

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
}

GENERAL_MEDICAL_BLOCK_MESSAGE = (
    "A medical condition was detected. AI Nutrition OS provides general wellness information only "
    "and cannot generate nutrition or workout recommendations for medical conditions. "
    "Please consult a qualified doctor, registered dietitian, or healthcare professional."
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
    "Substance use or dependency concern detected. AI Nutrition OS cannot generate nutrition or workout recommendations "
    "for this profile. Please consult a qualified healthcare professional or addiction-support specialist."
)

MEDICAL_DISCLAIMER = (
    "AI Nutrition OS provides general wellness information only and is not a substitute for medical advice, "
    "diagnosis, treatment, emergency care, or professional dietary counselling."
)


CHRONIC_CONDITION_KEYWORDS = {
    # Metabolic / endocrine
    "diabetes",
    "diabetic",
    "prediabetes",
    "insulin resistance",
    "thyroid",
    "hypothyroidism",
    "hyperthyroidism",
    "pcos",
    "pcod",
    "obesity",
    "morbid obesity",
    "metabolic syndrome",

    # Cardiovascular
    "hypertension",
    "high blood pressure",
    "low blood pressure",
    "bp",
    "heart disease",
    "cardiac",
    "arrhythmia",
    "stroke",
    "cholesterol",
    "high cholesterol",
    "cardiovascular disease",
    "heart failure",
    "heart attack",

    # Kidney / liver
    "kidney disease",
    "ckd",
    "renal",
    "renal disease",
    "dialysis",
    "kidney stone",
    "fatty liver",
    "liver disease",
    "hepatitis",
    "cirrhosis",

    # Digestive / gut
    "ibs",
    "irritable bowel syndrome",
    "crohn",
    "crohn's disease",
    "ulcerative colitis",
    "gerd",
    "acid reflux",
    "celiac",
    "celiac disease",
    "gastritis",
    "constipation",

    # Respiratory
    "asthma",
    "copd",
    "breathing problem",
    "respiratory disease",

    # Neurological
    "epilepsy",
    "seizure",
    "seizures",
    "parkinson",
    "neurological disorder",
    "migraine",

    # Blood / deficiency
    "anemia",
    "anaemia",
    "severe anemia",
    "thalassemia",
    "vitamin deficiency",
    "b12 deficiency",
    "iron deficiency",

    # Bone / joints
    "osteoporosis",
    "arthritis",
    "joint pain",
    "back pain",
    "slip disc",

    # Mental health / eating risk
    "depression",
    "anxiety",
    "eating disorder",
    "anorexia",
    "bulimia",
    "binge eating",

    # Cancer / immune
    "cancer",
    "chemotherapy",
    "radiation therapy",
    "tumor",
    "tumour",
    "oncology",
    "autoimmune",
    "lupus",
    "rheumatoid arthritis",
}

PREGNANCY_KEYWORDS = {
    "pregnant",
    "pregnancy",
    "postpartum",
    "post-partum",
    "breastfeeding",
    "lactating",
    "trying to conceive",
    "planning pregnancy",
    "ttc",
    "fertility treatment",
    "ivf",
}

SUBSTANCE_USE_KEYWORDS = {
    "heavy smoker",
    "chain smoker",
    "smoking addiction",
    "tobacco addiction",
    "nicotine addiction",
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

EMERGENCY_KEYWORDS = {
    "suicidal",
    "self harm",
    "self-harm",
    "overdose",
    "chest pain",
    "heart attack",
    "stroke",
    "severe bleeding",
    "emergency",
    "can't breathe",
    "cannot breathe",
    "difficulty breathing",
    "unconscious",
    "seizure now",
    "fainting",
}


def normalize_text(value: object) -> str:
    return str(value or "").lower().replace("_", " ").replace("-", " ").strip()


def is_safe_empty_value(value: object) -> bool:
    text = normalize_text(value)
    return text in SAFE_EMPTY_VALUES


def contains_keyword(text: str, keywords: set[str]) -> bool:
    if not text:
        return False
    return any(keyword in text for keyword in keywords)


def matched_keywords(text: str, keywords: set[str]) -> list[str]:
    if not text:
        return []
    return sorted({keyword for keyword in keywords if keyword in text})


def block_response(
    *,
    reason: str,
    detected_conditions: list[str] | None = None,
    warnings: list[str] | None = None,
    risk_type: str = "medical_condition",
) -> dict:
    detected_conditions = detected_conditions or []
    warnings = warnings or []

    all_warnings = [
        GENERAL_MEDICAL_BLOCK_MESSAGE if risk_type == "medical_condition" else reason,
        *warnings,
        MEDICAL_DISCLAIMER,
    ]

    return {
        "risk_level": "high",
        "warnings": list(dict.fromkeys([warning for warning in all_warnings if warning])),
        "detected_conditions": sorted(set(detected_conditions)),
        "hard_block": True,
        "block_reason": reason,
        "risk_type": risk_type,
        "medical_disclaimer": MEDICAL_DISCLAIMER,
    }


def analyze_medical_risk(user_data):
    age = int(getattr(user_data, "age", 0) or 0)
    gender = normalize_text(getattr(user_data, "gender", ""))

    raw_medical_conditions = getattr(user_data, "medical_conditions", "")
    raw_pregnancy_status = getattr(user_data, "pregnancy_status", "")
    raw_smoker_alcohol = (
        getattr(user_data, "smoker_alcohol", "")
        or getattr(user_data, "smoker_or_alcohol", "")
        or getattr(user_data, "smoking_alcohol", "")
        or getattr(user_data, "smoker", "")
        or getattr(user_data, "alcohol", "")
    )

    medical_conditions = normalize_text(raw_medical_conditions)
    pregnancy_status = normalize_text(raw_pregnancy_status)
    smoker_alcohol = normalize_text(raw_smoker_alcohol)

    combined_text = f"{medical_conditions} {pregnancy_status} {smoker_alcohol}".strip()

    # =========================
    # AGE HARD BLOCKS
    # =========================
    if age < 18 or age >= 60:
        return block_response(
            reason=AGE_BLOCK_MESSAGE,
            detected_conditions=[],
            risk_type="age_restriction",
        )

    # =========================
    # EMERGENCY HARD BLOCKS
    # =========================
    emergency_matches = matched_keywords(combined_text, EMERGENCY_KEYWORDS)
    if emergency_matches:
        return block_response(
            reason=EMERGENCY_BLOCK_MESSAGE,
            detected_conditions=emergency_matches,
            risk_type="emergency",
        )

    # =========================
    # INVALID PROFILE HARD BLOCK
    # =========================
    pregnancy_matches = matched_keywords(f"{medical_conditions} {pregnancy_status}", PREGNANCY_KEYWORDS)

    if gender == "male" and pregnancy_matches:
        return block_response(
            reason=INVALID_PROFILE_BLOCK_MESSAGE,
            detected_conditions=pregnancy_matches,
            risk_type="invalid_profile",
        )

    # =========================
    # PREGNANCY / TTC / BREASTFEEDING HARD BLOCK
    # =========================
    if pregnancy_matches:
        return block_response(
            reason=PREGNANCY_BLOCK_MESSAGE,
            detected_conditions=pregnancy_matches,
            risk_type="pregnancy",
        )

    # =========================
    # SUBSTANCE / ADDICTION HARD BLOCK
    # =========================
    substance_matches = matched_keywords(combined_text, SUBSTANCE_USE_KEYWORDS)
    if substance_matches:
        return block_response(
            reason=SUBSTANCE_BLOCK_MESSAGE,
            detected_conditions=substance_matches,
            risk_type="substance_use",
        )

    # =========================
    # ANY MEDICAL CONDITION HARD BLOCK
    # =========================
    if not is_safe_empty_value(medical_conditions):
        condition_matches = matched_keywords(medical_conditions, CHRONIC_CONDITION_KEYWORDS)

        # Public-launch rule:
        # If user typed a non-empty medical condition, block even if the keyword list misses it.
        detected = condition_matches or [medical_conditions]

        return block_response(
            reason=GENERAL_MEDICAL_BLOCK_MESSAGE,
            detected_conditions=detected,
            risk_type="medical_condition",
        )

    # =========================
    # LOW RISK
    # =========================
    return {
        "risk_level": "low",
        "warnings": [],
        "detected_conditions": [],
        "hard_block": False,
        "block_reason": None,
        "risk_type": "none",
        "medical_disclaimer": MEDICAL_DISCLAIMER,
    }
