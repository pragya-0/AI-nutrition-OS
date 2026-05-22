def calculate_bmi(weight: int, height: int):

    height_m = height / 100

    bmi = weight / (height_m * height_m)

    return round(bmi, 1)