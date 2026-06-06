from pydantic import BaseModel, Field, field_validator
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

    # Frontend should send:
    # - male => "not_applicable"
    # - female not pregnant => "not_applicable"
    # - female pregnant => "pregnant"
    pregnancy_status: str = "not_applicable"

    # =========================
    # NUTRITION PROFILE
    # =========================
    goal: str
    activity: str
    diet: str
    days: int = 30

    preferred_cuisine: str = "indian"
    fitness_level: str = "beginner"

    allergies: List[str] = Field(default_factory=list)
    disliked_foods: List[str] = Field(default_factory=list)
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

    # Public-launch safety text fields. Keep broad compatibility with existing frontend.
    smoker_alcohol: str = ""
    smoking_status: str = ""
    alcohol_use: str = ""
    substance_use: str = ""

    @field_validator("gender", mode="before")
    @classmethod
    def normalize_gender(cls, value):
        text = str(value or "").strip().lower()
        if text in ["m", "male"]:
            return "male"
        if text in ["f", "female"]:
            return "female"
        return text or "other"

    @field_validator("goal", mode="before")
    @classmethod
    def normalize_goal(cls, value):
        text = str(value or "").strip().lower().replace("-", "_").replace(" ", "_")
        if text in ["weight_loss", "fat_loss", "lose_weight", "weightloss"]:
            return "fat_loss"
        if text in ["muscle_gain", "gain_muscle", "lean_muscle", "bulk"]:
            return "muscle_gain"
        return text or "maintenance"

    @field_validator("diet", mode="before")
    @classmethod
    def normalize_diet(cls, value):
        text = str(value or "").strip().lower().replace("-", "_").replace(" ", "_")
        if text == "vegan":
            return "vegan"
        if text in ["vegetarian", "veg", "lacto_vegetarian"]:
            return "vegetarian"
        if text in [
            "non_vegetarian",
            "nonveg",
            "non_veg",
            "omnivore",
            "mixed",
            "regular",
            "eggetarian",
            "pescatarian",
        ]:
            return "non_vegetarian"
        return text or "vegetarian"

    @field_validator("pregnancy_status", mode="before")
    @classmethod
    def normalize_pregnancy_status(cls, value):
        text = str(value or "").strip().lower().replace("-", "_").replace(" ", "_")
        if text == "pregnant":
            return "pregnant"
        return "not_applicable"

    @field_validator("days", mode="before")
    @classmethod
    def normalize_days(cls, value):
        try:
            number = int(value)
        except Exception:
            return 30
        if number in [1, 7, 15, 30]:
            return number
        return max(1, min(30, number))

    @field_validator("smoker_alcohol", "smoking_status", "alcohol_use", "substance_use", mode="before")
    @classmethod
    def normalize_optional_text(cls, value):
        return str(value or "").strip()
