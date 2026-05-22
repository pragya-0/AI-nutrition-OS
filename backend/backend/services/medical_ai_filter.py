import re


# ==========================================
# MEDICAL BLOCKLISTS
# ==========================================

UNSAFE_DIABETIC_FOODS = [
    "sabudana",
    "halwa",
    "vada",
    "sweet poha",
    "sweet biscuit",
    "cookies",
    "rasgulla",
    "jelly",
    "kulfi",
    "sharbat",
    "juice",
]


DIABETES_UNSAFE = [
    "sugar",
    "sweet",
    "dessert",
    "burfi",
    "halwa",
    "gulab jamun",
    "rasgulla",
    "ice cream",
    "cake",
    "pastry",
    "fruit punch",
    "fruit juice",
    "juice",
    "milkshake",
    "soft drink",
    "cola",
    "white bread",
    "maida",
    "chikki",
    "brittle",
    "jaggery",
    "gur",
    "rice flakes",
    "chiwda",
    "aval",
    "murmura",
    "pineapple",
    "sweetened",
    "sweet lassi",
    "jam",
    "honey",
    "meetha",
    "mexican rice",
    "white rice",
    "fried rice",
    "poha",
    "sweet corn soup",
    "jelly",
    "kulfi",
    "mousse",
    "custard",
    "sweet yogurt",
    "syrup",
    "sweet corn",
    "sabudana",
    "vada",
    "sweet poha",
    "sweet biscuit",
    "cookies",
    "sharbat",

]

BP_UNSAFE = [
    "pickle",
    "chips",
    "deep fried",
    "fried",
    "poori",
    "pakora",
    "samosa",
    "instant noodles",
    "processed snacks",
    "salted butter",
    "papad",
    "namkeen",
]

PROCESSED_MEAT_UNSAFE = [
    "salami",
    "sausage",
    "processed meat",
    "processed meats",
    "pepperoni",
    "bacon",
    "ham",
]

THYROID_CAUTION = [
    "tofu",
    "soy",
    "soya",
    "soy milk",
    "soy chunks",
    "paneer",
    "milk",
    "curd",
]

LOW_BP_UNSAFE = [
    "excess fasting",
]

OBESITY_UNSAFE = [
    "deep fried",
    "burger",
    "pizza",
    "soft drink",
    "ice cream",
]


# ==========================================
# SAFE REPLACEMENTS
# ==========================================

SAFE_REPLACEMENTS = {
    "fruit punch": "lemon chia water",
    "fruit juice": "lemon chia water",
    "juice": "lemon chia water",
    "milkshake": "unsweetened protein smoothie",
    "soft drink": "coconut water without added sugar",
    "cola": "lemon water without sugar",
    "burfi": "moong dal chilla with vegetable soup",
    "halwa": "moong dal chilla with vegetable soup",
    "ice cream": "greek yogurt bowl",
    "cake": "sprouts salad",
    "pastry": "roasted chana",
    "poori": "multigrain roti",
    "fried": "roasted",
    "fried snacks": "roasted chana",
    "burger": "grilled tofu wrap",
    "pizza": "millet vegetable bowl",
    "white bread": "multigrain roti",
    "maida": "millet roti",
    "chikki": "sprouts chaat",
    "brittle": "roasted chana",
    "jaggery": "cinnamon oats bowl",
    "gur": "cinnamon oats bowl",
    "rice flakes": "sprouts bowl",
    "chiwda": "sprouts salad",
    "aval": "vegetable millet upma",
    "murmura": "roasted chana",
    "pineapple": "apple slices with nuts",
    "sweetened": "unsweetened",
    "sweet lassi": "unsweetened buttermilk",
    "jam": "peanut butter without sugar",
    "honey": "cinnamon",
    "meetha": "vegetable oats bowl",
    "salami": "grilled chicken salad with vegetables",
    "sausage": "egg white bhurji with vegetables",
    "processed meat": "fish soup with vegetables",
    "processed meats": "fish soup with vegetables",
    "pepperoni": "grilled fish with vegetables",
    "bacon": "boiled eggs with vegetables",
    "ham": "grilled chicken with salad",
    "mexican rice": "millet khichdi with vegetables",
    "white rice": "brown rice with vegetables",
    "fried rice": "vegetable dalia bowl",
    "poha": "vegetable oats upma",
    "sweet corn soup": "mixed vegetable soup",
    "jelly": "sprouts salad",
    "kulfi": "vegetable soup",
    "mousse": "moong dal chilla",
    "custard": "chia seed pudding without sugar",
    "sweet yogurt": "unsweetened curd with nuts",
    "syrup": "cinnamon",
    "sweet corn": "mixed vegetable soup",

}


# ==========================================
# NORMALIZE TEXT
# ==========================================

def clean_text(text):

    if not text:
        return ""

    return str(text).lower().strip()


# ==========================================
# DETECT MEDICAL RISKS
# ==========================================

def detect_medical_risks(meal_text, conditions):

    meal = clean_text(meal_text)

    risks = []

    warnings = []

    # ==========================
    # DIABETES
    # ==========================

    if "diabetes" in conditions:

        for item in DIABETES_UNSAFE + UNSAFE_DIABETIC_FOODS:

            if item in meal:
                risks.append(item)

        if risks:
            warnings.append(
                "Diabetes low-sugar protection enabled."
            )

    # ==========================
    # HIGH BP
    # ==========================

    if "high bp" in conditions or "bp high" in conditions:

        for item in BP_UNSAFE:

            if item in meal:
                risks.append(item)

        warnings.append(
            "High BP low-sodium protection enabled."
        )

    # ==========================
    # PROCESSED MEAT
    # ==========================

    for item in PROCESSED_MEAT_UNSAFE:

        if item in meal:
            risks.append(item)

            warnings.append(
                "Processed meat replaced with lean-protein meal."
            )

    # ==========================
    # THYROID
    # ==========================

    if "thyroid" in conditions:

        if any(
            item in meal
            for item in THYROID_CAUTION
        ):

            warnings.append(
                "If taking thyroid medication, keep soy/tofu and calcium-rich foods away from medication timing."
            )

    # ==========================
    # LOW BP
    # ==========================

    if "low bp" in conditions:

        warnings.append(
            "Maintain hydration and avoid long fasting gaps."
        )

        for item in LOW_BP_UNSAFE:

            if item in meal:
                risks.append(item)

    return {
        "risks": list(set(risks)),
        "warnings": list(set(warnings)),
    }


# ==========================================
# REPLACE UNSAFE FOODS
# ==========================================

def replace_unsafe_foods(meal_text, risks):

    original = str(meal_text or "")

    lower = original.lower()

    # ======================================
    # FULL MEAL REPLACEMENTS
    # ======================================

    full_diabetes_triggers = [
        "sabudana",
        "halwa",
        "vada",
        "sweet poha",
        "sweet biscuit",
        "cookies",
        "rasgulla",
        "jelly",
        "kulfi",
        "sharbat",
        "juice",
        "burfi",
        "chikki",
        "brittle",
        "sweet",
        "dessert",
        "cake",
        "pastry",
        "milkshake",
        "fruit punch",
        "fruit juice",
        "mousse",
        "custard",
        "syrup",
    ]

    if any(trigger in lower for trigger in full_diabetes_triggers):
        replacement = "Moong dal chilla with vegetable soup"

        return replacement, [
            {
                "replaced": original,
                "with": replacement,
            }
        ]

    # ======================================
    # PROCESSED MEAT FULL MEAL REPLACEMENT
    # ======================================

    processed_meat_triggers = [
        "salami",
        "sausage",
        "pepperoni",
        "processed meat",
        "processed meats",
        "bacon",
        "ham",
    ]

    if any(trigger in lower for trigger in processed_meat_triggers):
        replacement = "Grilled chicken salad with vegetables"

        return replacement, [
            {
                "replaced": original,
                "with": replacement,
            }
        ]

    # ======================================
    # DEFAULT WHOLE-MEAL REPLACEMENT
    # Avoid word-level replacement bugs like pancake → pansprouts chaat.
    # ======================================

    if risks:
        replacement = "Balanced high-fiber meal with vegetables"

        return replacement, [
            {
                "replaced": original,
                "with": replacement,
            }
        ]

    return original, []


# ==========================================
# MAIN MEDICAL FILTER ENGINE
# ==========================================

def apply_medical_safety_filter(
    meal_days,
    medical_conditions,
    bmi=0,
    age=0,
    water_intake=2.0,
):

    conditions = clean_text(
        medical_conditions
    )

    all_flags = []

    all_replacements = []

    all_warnings = []

    # =====================================
    # HYDRATION WARNING
    # =====================================

    if water_intake < 1.5:
        all_warnings.append(
            "Hydration is currently low. Increase water and electrolyte intake gradually throughout the day."
        )

    safety_score = 100

    for day in meal_days:

        fields = [
            "breakfast",
            "lunch",
            "snack",
            "dinner",
        ]

        for field in fields:

            original_meal = day.get(field, "")

            result = detect_medical_risks(
                original_meal,
                conditions
            )

            risks = result["risks"]

            warnings = result["warnings"]

            all_warnings.extend(warnings)

            if risks:

                updated_meal, replacements = replace_unsafe_foods(
                    original_meal,
                    risks
                )

                day[field] = updated_meal

                all_flags.extend(risks)

                all_replacements.extend(
                    replacements
                )

                safety_score -= len(risks) * 5

        # ==================================
        # ALTERNATIVES
        # ==================================

        safe_alts = []

        for alt in day.get(
            "alternatives",
            []
        ):

            result = detect_medical_risks(
                alt,
                conditions
            )

            risks = result["risks"]

            warnings = result["warnings"]

            all_warnings.extend(warnings)

            if risks:

                updated_alt, replacements = replace_unsafe_foods(
                    alt,
                    risks
                )

                safe_alts.append(updated_alt)

                all_flags.extend(risks)

                all_replacements.extend(
                    replacements
                )

                safety_score -= len(risks) * 5

            else:
                safe_alts.append(alt)

        day["alternatives"] = safe_alts

    # ======================================
    # OBESITY PENALTY
    # ======================================

    if bmi >= 30:
        safety_score -= 10

    # =====================================
    # REALISTIC SAFETY SCORE PENALTIES
    # =====================================

    if "diabetes" in conditions:
        safety_score -= 3

    if "low bp" in conditions:
        safety_score -= 2

    if "thyroid" in conditions:
        safety_score -= 2

    # Elderly risk
    if age >= 65:
        safety_score -= 3

    # Low hydration risk
    if water_intake < 1.5:
        safety_score -= 5

    # Prevent unrealistic perfect scores
    safety_score = max(40, min(95, safety_score))

    deduped_replacements = []
    seen_replacements = set()

    for item in all_replacements:
        key = (
            item.get("replaced"),
            item.get("with"),
        )

        if key in seen_replacements:
            continue

        seen_replacements.add(key)
        deduped_replacements.append(item)

    return {
        "safe_meal_days": meal_days,
        "medical_flags": list(set(all_flags)),
        "foods_replaced": deduped_replacements,
        "medical_warnings": list(set(all_warnings)),
        "safety_score": safety_score,
    }
