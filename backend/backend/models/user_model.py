from pydantic import BaseModel
from typing import List, Optional


class UserData(BaseModel):

    # ==========================================
    # BASIC USER INFO
    # ==========================================

    name: Optional[str] = ""
    phone_number: Optional[str] = ""
    email: Optional[str] = ""
    city: Optional[str] = ""
    blood_group: Optional[str] = ""

    # ==========================================
    # BODY PROFILE
    # ==========================================

    weight: float
    height: float
    age: int
    gender: str

    target_weight: Optional[float] = None
    body_type: Optional[str] = ""

    # ==========================================
    # HEALTH & FITNESS
    # ==========================================

    goal: str
    activity: str
    diet: str
    days: int = 1

    fitness_level: Optional[str] = "beginner"

    # User can provide these, or backend can infer them
    budget: Optional[str] = None
    workout_type: Optional[str] = None

    # ==========================================
    # LIFESTYLE DATA
    # ==========================================

    sleep_time: Optional[str] = "23:00"
    wake_time: Optional[str] = "07:00"
    sleep_hours: Optional[float] = None

    water_intake: float = 2.5
    stress_level: Optional[str] = "moderate"
    screen_time_hours: Optional[float] = 4.0

    # ==========================================
    # FOOD PREFERENCES
    # ==========================================

    preferred_cuisine: Optional[str] = "indian"
    meal_frequency: Optional[int] = 4

    allergies: List[str] = []
    disliked_foods: List[str] = []
    medical_conditions: List[str] = []