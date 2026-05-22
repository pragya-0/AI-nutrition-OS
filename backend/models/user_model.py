from pydantic import BaseModel, Field
from typing import List, Union


class UserData(BaseModel):
    # =========================
    # BASIC USER INFO
    # =========================

    name: str = ""
    phone_number: str = ""
    email: str = ""
    city: str = ""
    blood_group: str = ""

    # =========================
    # BODY PROFILE
    # =========================

    weight: float
    height: float
    age: int
    gender: str

    # Pregnancy status:
    # "not_applicable", "pregnant", or "not_pregnant"
    pregnancy_status: str = "not_applicable"

    # =========================
    # NUTRITION PROFILE
    # =========================

    goal: str
    activity: str
    diet: str
    days: int

    preferred_cuisine: str = "indian"
    fitness_level: str = "beginner"

    allergies: List[str] = Field(default_factory=list)
    disliked_foods: List[str] = Field(default_factory=list)

    # Accepts both:
    # "diabetes, thyroid, low BP"
    # OR ["diabetes", "thyroid", "low BP"]
    medical_conditions: Union[str, List[str]] = ""

    budget: str = "medium"
    workout_type: str = "gym"

    # =========================
    # LIFESTYLE PROFILE
    # =========================

    sleep_time: str = "23:00"
    wake_time: str = "07:00"
    sleep_hours: Union[int, float, None] = None
    water_intake: float = 2.5