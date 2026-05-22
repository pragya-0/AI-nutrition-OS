from pathlib import Path

user_model_code = '''from pydantic import BaseModel
from typing import List


class UserData(BaseModel):

    weight: float
    height: float
    age: int

    gender: str

    goal: str
    activity: str
    diet: str

    days: int

    allergies: List[str] = []

    disliked_foods: List[str] = []

    medical_conditions: List[str] = []

    # =====================================
    # SAFETY / FUTURE VALIDATION FIELDS
    # =====================================

    pregnancy_status: str = "Not applicable / Prefer not to say"

    budget: str = "medium"

    workout_type: str = "gym"

    sleep_hours: int = 7

    water_intake: float = 2.5

    # Future stricter validation can be added here:
    #
    # from pydantic import validator
    #
    # @validator("pregnancy_status")
    # def validate_pregnancy_status(cls, value):
    #     allowed = [
    #         "Not applicable / Prefer not to say",
    #         "Pregnant",
    #         "Planning pregnancy",
    #         "Postpartum",
    #     ]
    #
    #     if value not in allowed:
    #         return "Not applicable / Prefer not to say"
    #
    #     return value
'''

output_path = Path("/mnt/data/user_model_pregnancy_status_updated.py")
output_path.write_text(user_model_code, encoding="utf-8")

compile(user_model_code, str(output_path), "exec")

print(f"Updated user_model.py saved to: {output_path}")
