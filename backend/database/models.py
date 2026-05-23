from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
)

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


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(120), nullable=True)

    email = Column(String(150), unique=True, nullable=True)

    phone_number = Column(String(30), nullable=True)

    city = Column(String(120), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=True)

    food_name = Column(String(255), nullable=True)

    calories = Column(Float, nullable=True)

    macros_json = Column(Text, nullable=True)

    image_url = Column(Text, nullable=True)

    scanner_mode = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class ProgressLog(Base):
    __tablename__ = "progress_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=True)

    weight = Column(Float, nullable=True)

    water_intake = Column(Float, nullable=True)

    workout_done = Column(Boolean, default=False)

    meal_followed = Column(Boolean, default=False)

    sleep_hours = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)