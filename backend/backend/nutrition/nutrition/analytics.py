def calculate_bmr(
    weight,
    height,
    age,
    gender
):

    if gender.lower() == "male":

        return int(
            10 * weight
            + 6.25 * height
            - 5 * age
            + 5
        )

    return int(
        10 * weight
        + 6.25 * height
        - 5 * age
        - 161
    )


def calculate_tdee(
    bmr,
    activity
):

    multipliers = {

        "low": 1.2,
        "moderate": 1.55,
        "high": 1.9
    }

    return int(
        bmr * multipliers.get(
            activity,
            1.2
        )
    )


def calculate_body_fat(
    bmi,
    age,
    gender
):

    gender_value = 1 if gender == "male" else 0

    body_fat = (
        1.20 * bmi
        + 0.23 * age
        - 10.8 * gender_value
        - 5.4
    )

    return round(body_fat, 1)


def calculate_metabolic_age(
    bmr,
    real_age
):

    if bmr > 1800:
        return max(real_age - 3, 18)

    elif bmr < 1400:
        return real_age + 2

    return real_age


def calculate_hydration_score(
    water_intake
):

    if water_intake >= 3:
        return 95

    elif water_intake >= 2:
        return 80

    return 60


def calculate_macro_ratio(
    protein,
    carbs,
    fats
):

    return {

        "protein_ratio": round(
            protein * 4
        ),

        "carbs_ratio": round(
            carbs * 4
        ),

        "fats_ratio": round(
            fats * 9
        )
    }