import re


DIABETES_UNSAFE = [
    "sugar",
    "dessert",
    "burfi",
    "halwa",
    "kheer",
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
    "soda",
    "cola",
    "white bread",
    "maida",
    "syrup",    "jelly",
    "kulfi",
    "mousse",
    "custard",
    "biscuit",
    "cookies",
    "pie",
    "murabba",
    "sharbat",
    "sweet lassi",
    "jaggery",
    "chikki",
    "honey",

]

BP_HIGH_UNSAFE = [
    "pickle",
    "papad",
    "chips",
    "namkeen",
    "processed snacks",
    "instant noodles",
    "deep fried",
    "fried",
    "poori",
    "puri",
    "pakora",
    "samosa",
    "salted",
    "heavy curry",
]

THYROID_CAUTION = [
    "tofu",
    "soy",
    "soya",
    "soy milk",
    "soy chunks",
    "calcium",
    "curd",
    "milk",
    "paneer",
]

OBESITY_UNSAFE = [
    "deep fried",
    "fried",
    "burger",
    "pizza",
    "soft drink",
    "ice cream",
    "dessert",
    "milkshake",
]


VEGAN_UNSAFE = [
    "khoa",
    "khoya",
    "mawa",
    "raita",
    "curd",
    "milk",
    "paneer",
    "ghee",
    "butter",
    "cream",
    "consomme",
    "mayo",
    "mayonnaise",
    "white sauce",
    "yogurt",
    "yoghurt",
    "cheese",
    "lassi",
]

SAFE_REPLACEMENTS = {
    "fruit punch": "lemon chia water",
    "fruit juice": "lemon chia water",
    "juice": "lemon chia water",
    "milkshake": "unsweetened protein smoothie",
    "soft drink": "coconut water without added sugar",
    "soda": "lemon water without sugar",
    "cola": "lemon water without sugar",
    "burfi": "sprouts salad",
    "halwa": "moong dal chilla",
    "kheer": "chia seed pudding without sugar",
    "gulab jamun": "fruit bowl with nuts",
    "rasgulla": "fruit bowl with nuts",
    "ice cream": "unsweetened yogurt bowl",
    "cake": "sprouts chaat",
    "pastry": "roasted chana",
    "white bread": "multigrain roti",
    "maida": "millet roti",
    "sugar": "no added sugar",
    "poori": "multigrain roti",
    "puri": "multigrain roti",
    "pakora": "roasted chana",
    "samosa": "sprouts chaat",
    "chips": "unsalted roasted chana",
    "namkeen": "unsalted nuts",
    "pickle": "cucumber salad",
    "papad": "salad",
    "instant noodles": "vegetable millet upma",
    "deep fried": "grilled",
    "fried": "roasted",
    "burger": "grilled tofu wrap",
    "pizza": "millet vegetable bowl",    "jelly": "sprouts salad",
    "kulfi": "vegetable soup",
    "mousse": "moong dal chilla",
    "custard": "chia seed pudding without sugar",
    "biscuit": "roasted chana",
    "cookies": "roasted chana",
    "pie": "sprouts salad",
    "murabba": "sprouts salad",
    "sharbat": "lemon chia water without sugar",
    "sweet lassi": "unsweetened buttermilk",
    "jaggery": "cinnamon",
    "chikki": "sprouts chaat",
    "honey": "cinnamon",
    "khoa": "moong dal chilla with vegetable soup",
    "khoya": "moong dal chilla with vegetable soup",
    "mawa": "moong dal chilla with vegetable soup",
    "raita": "cucumber salad",
    "curd": "cucumber salad",
    "milk": "unsweetened plant milk",
    "paneer": "tofu vegetable curry",
    "ghee": "minimal oil",
    "butter": "minimal oil",
    "cream": "vegetable soup",
    "consomme": "mixed vegetable soup",
    "mayo": "hummus",
    "mayonnaise": "hummus",
    "white sauce": "vegetable soup",
    "yogurt": "unsweetened plant yogurt",
    "yoghurt": "unsweetened plant yogurt",
    "cheese": "tofu",
    "lassi": "lemon chia water without sugar",

}


def clean_text(text):
    return str(text or "").lower().strip()


def has_condition(condition_text, keywords):
    text = clean_text(condition_text)
    return any(keyword in text for keyword in keywords)


def detect_medical_risks(meal_text, medical_conditions, bmi=0, diet=""):
    meal = clean_text(meal_text)
    conditions = clean_text(medical_conditions)
    diet_text = clean_text(diet)

    risks = []
    warnings = []

    diabetes = has_condition(
        conditions,
        ["diabetes", "diabetic", "sugar", "blood sugar"],
    )

    bp_high = has_condition(
        conditions,
        ["high bp", "bp high", "hypertension", "blood pressure high"],
    )

    low_bp = has_condition(
        conditions,
        ["low bp", "low blood pressure", "hypotension"],
    )

    thyroid = has_condition(
        conditions,
        ["thyroid", "hypothyroid", "hyperthyroid"],
    )

    is_vegan = diet_text == "vegan" or "vegan" in conditions

    if diabetes:
        for item in DIABETES_UNSAFE:
            if item in meal:
                risks.append(item)
                warnings.append(
                    "Diabetes noted: sugary drinks, desserts, refined flour, and sweet foods were blocked."
                )

    if is_vegan:
        for item in VEGAN_UNSAFE:
            if item in meal:
                risks.append(item)
                warnings.append(
                    "Vegan diet noted: dairy, cream-based, and animal-derived foods were blocked."
                )

    if bp_high:
        for item in BP_HIGH_UNSAFE:
            if item in meal:
                risks.append(item)
                warnings.append(
                    "High BP noted: salty, fried, and processed foods were blocked."
                )

    if thyroid:
        for item in THYROID_CAUTION:
            if item in meal:
                warnings.append(
                    "Thyroid note: if taking thyroid medication, keep soy/tofu and calcium-rich foods away from medication timing."
                )

    if low_bp:
        warnings.append(
            "Low BP noted: maintain hydration, avoid long fasting gaps, and watch for dizziness."
        )

    try:
        bmi_value = float(bmi)
    except Exception:
        bmi_value = 0

    if bmi_value >= 30:
        for item in OBESITY_UNSAFE:
            if item in meal:
                risks.append(item)
                warnings.append(
                    "Weight-risk noted: deep-fried foods, sugary drinks, and calorie-dense junk foods were blocked."
                )

    return {
        "risks": list(set(risks)),
        "warnings": list(set(warnings)),
    }


def replace_unsafe_foods(meal_text, risks):
    original = str(meal_text or "")
    lower = original.lower()

    full_meal_triggers = [
        "jelly",
        "kulfi",
        "mousse",
        "custard",
        "kheer",
        "halwa",
        "biscuit",
        "cookies",
        "pie",
        "murabba",
        "sharbat",
        "sweet lassi",
        "jaggery",
        "chikki",
        "honey",
        "burfi",
        "gulab jamun",
        "rasgulla",
        "ice cream",
        "cake",
        "pastry",
        "fruit punch",
        "fruit juice",
        "juice",
        "milkshake",
        "khoa",
        "khoya",
        "mawa",
    ]

    if any(trigger in lower for trigger in full_meal_triggers):
        replacement = "Moong dal chilla with vegetable soup"
        return replacement, [
            {
                "replaced": original,
                "with": replacement,
            }
        ]

    updated_meal = original
    replacements = []

    for risk in risks:
        if risk in ["sweet", "sweets"]:
            continue

        replacement = SAFE_REPLACEMENTS.get(risk, "balanced high-fiber meal")
        pattern = re.compile(re.escape(risk), re.IGNORECASE)
        updated_meal = pattern.sub(replacement, updated_meal)

        replacements.append({
            "replaced": risk,
            "with": replacement,
        })

    return updated_meal, replacements


def apply_medical_safety_filter(
    meal_days,
    medical_conditions,
    bmi=0,
    diet="",
):
    conditions = clean_text(medical_conditions)

    safe_meal_days = []
    all_flags = []
    all_warnings = []
    all_replacements = []
    safety_score = 100

    for day in meal_days or []:
        clean_day = dict(day)

        for field in ["breakfast", "lunch", "snack", "dinner"]:
            original_meal = clean_day.get(field, "")

            result = detect_medical_risks(
                meal_text=original_meal,
                medical_conditions=medical_conditions,
                bmi=bmi,
                diet=diet,
            )

            risks = result["risks"]
            warnings = result["warnings"]

            all_warnings.extend(warnings)

            if risks:
                updated_meal, replacements = replace_unsafe_foods(
                    original_meal,
                    risks,
                )

                clean_day[field] = updated_meal
                all_flags.extend(risks)
                all_replacements.extend(
                    [
                        {
                            "meal_type": field,
                            "original_meal": original_meal,
                            **replacement,
                            "updated_meal": updated_meal,
                        }
                        for replacement in replacements
                    ]
                )

                safety_score -= len(risks) * 6

        safe_alternatives = []

        for alt in clean_day.get("alternatives", []) or []:
            result = detect_medical_risks(
                meal_text=alt,
                medical_conditions=medical_conditions,
                bmi=bmi,
                diet=diet,
            )

            risks = result["risks"]
            warnings = result["warnings"]

            all_warnings.extend(warnings)

            if risks:
                updated_alt, replacements = replace_unsafe_foods(
                    alt,
                    risks,
                )

                safe_alternatives.append(updated_alt)
                all_flags.extend(risks)
                all_replacements.extend(
                    [
                        {
                            "meal_type": "alternative",
                            "original_meal": alt,
                            **replacement,
                            "updated_meal": updated_alt,
                        }
                        for replacement in replacements
                    ]
                )

                safety_score -= len(risks) * 6
            else:
                safe_alternatives.append(alt)

        clean_day["alternatives"] = safe_alternatives
        clean_day["medical_warnings"] = list(set(all_warnings))

        safe_meal_days.append(clean_day)

    try:
        bmi_value = float(bmi)
    except Exception:
        bmi_value = 0

    if bmi_value >= 30:
        safety_score -= 5

    if conditions.strip():
        safety_score = min(safety_score, 94)

    if any(x in conditions for x in ["pregnancy", "kidney", "fatty liver"]):
        safety_score = min(safety_score, 85)

    safety_score = max(40, min(95, round(safety_score)))

    deduped_replacements = []
    seen_replacements = set()

    for item in all_replacements:
        key = (
            item.get("meal_type"),
            item.get("original_meal"),
            item.get("updated_meal"),
            item.get("replaced"),
            item.get("with"),
        )

        if key in seen_replacements:
            continue

        seen_replacements.add(key)
        deduped_replacements.append(item)

    return {
        "safe_meal_days": safe_meal_days,
        "medical_flags": list(set(all_flags)),
        "medical_warnings": list(set(all_warnings)),
        "foods_replaced": deduped_replacements,
        "safety_score": safety_score,
    }
