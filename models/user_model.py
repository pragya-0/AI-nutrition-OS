from pydantic import BaseModel
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

    budget: str = "medium"

    workout_type: str = "gym"

    sleep_hours: int = 7

    water_intake: float = 2.5