from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from database.database import Base


class UserNutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(120), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(30), nullable=True)

    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)

    goal = Column(String(50), nullable=True)
    diet = Column(String(50), nullable=True)
    activity = Column(String(50), nullable=True)

    calories = Column(Float, nullable=True)
    protein = Column(Float, nullable=True)
    carbs = Column(Float, nullable=True)
    fats = Column(Float, nullable=True)

    analytics_json = Column(Text, nullable=True)
    meal_plan_json = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)