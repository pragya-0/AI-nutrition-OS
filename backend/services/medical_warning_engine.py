# backend/services/medical_warning_engine.py

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
    "autoimmune",
    "lupus",
    "rheumatoid arthritis",

    # Women's health / sensitive states
    "pregnant",
    "pregnancy",
    "planning pregnancy",
    "trying to conceive",
    "ttc",
    "fertility treatment",
    "ivf",
    "postpartum",
    "post-partum",
    "breastfeeding",
    "lactating",
}

PREGNANCY_KEYWORDS = {
    "pregnant",
    "pregnancy",
    "postpartum",
    "breastfeeding",
    "trying to conceive",
}

KIDNEY_KEYWORDS = {
    "kidney disease",
    "renal disease",
    "dialysis",
    "ckd",
}


def analyze_medical_risk(user_data):
    warnings = []
    detected_conditions = []

    risk_level = "low"
    hard_block = False
    block_reason = None

    age = int(getattr(user_data, "age", 0) or 0)

    medical_conditions = str(
        getattr(user_data, "medical_conditions", "")
    ).lower()

    pregnancy_status = str(
        getattr(user_data, "pregnancy_status", "")
    ).lower()

    combined_text = f"{medical_conditions} {pregnancy_status}".lower()
    normalized_text = combined_text.strip()

    # =========================
    # AGE HARD BLOCKS
    # =========================

    if age < 18:
        hard_block = True
        risk_level = "high"
        block_reason = (
            "AI Nutrition OS currently supports only users aged 18 to 59. "
            "Please consult a nearby doctor or qualified healthcare professional."
        )
        warnings.append(block_reason)

    if age >= 60:
        hard_block = True
        risk_level = "high"
        block_reason = (
            "AI Nutrition OS currently supports only users aged 18 to 59. "
            "Please consult a nearby doctor or qualified healthcare professional."
        )
        warnings.append(block_reason)

    # =========================
    # CHRONIC CONDITION DETECTION
    # =========================

    for keyword in CHRONIC_CONDITION_KEYWORDS:
        if keyword in normalized_text:
            detected_conditions.append(keyword)

    detected_conditions = sorted(set(detected_conditions))

    if detected_conditions:
        risk_level = "high"
        warnings.append(
            "A health condition was detected. Please consult a qualified doctor before following nutrition or workout recommendations."
        )

    # =========================
    # PREGNANCY HARD BLOCKS
    # =========================

    for keyword in PREGNANCY_KEYWORDS:
        if keyword in normalized_text:
            hard_block = True
            risk_level = "high"
            block_reason = (
                "Pregnancy-related wellness guidance is currently unavailable. "
                "Please consult a qualified healthcare professional."
            )
            warnings.append(block_reason)
            break

    if "pregnant" in pregnancy_status:
        hard_block = True
        risk_level = "high"
        block_reason = (
            "Pregnancy-related wellness guidance is currently unavailable. "
            "Please consult a qualified healthcare professional."
        )
        warnings.append(block_reason)

    # =========================
    # KIDNEY DISEASE HARD BLOCKS
    # =========================

    for keyword in KIDNEY_KEYWORDS:
        if keyword in normalized_text:
            hard_block = True
            risk_level = "high"
            block_reason = (
                "Kidney-condition nutrition guidance is currently unavailable. "
                "Please consult a nephrologist or qualified healthcare professional."
            )
            warnings.append(block_reason)
            break

    # =========================
    # INVALID PROFILE HARD BLOCK
    # =========================

    gender = str(getattr(user_data, "gender", "")).lower()

    if gender == "male":
        for keyword in PREGNANCY_KEYWORDS:
            if keyword in normalized_text:
                hard_block = True
                risk_level = "high"
                block_reason = (
                    "Invalid medical profile detected. "
                    "Please consult a qualified healthcare professional."
                )
                warnings.append(block_reason)
                break

    return {
        "risk_level": risk_level,
        "warnings": list(dict.fromkeys(warnings)),
        "detected_conditions": detected_conditions,
        "hard_block": hard_block,
        "block_reason": block_reason,
    }
