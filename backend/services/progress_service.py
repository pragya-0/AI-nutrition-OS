from database.database import SessionLocal
from database.models import ProgressLog


def create_progress_log(data):
    db = SessionLocal()

    try:
        progress = ProgressLog(
            user_id=getattr(data, "user_id", None),
            weight=getattr(data, "weight", None),
            water_intake=getattr(data, "water_intake", None),
            workout_done=getattr(data, "workout_done", False),
            meal_followed=getattr(data, "meal_followed", False),
            sleep_hours=getattr(data, "sleep_hours", None),
        )

        db.add(progress)
        db.commit()
        db.refresh(progress)

        return progress

    except Exception as error:
        db.rollback()
        print("PROGRESS SAVE ERROR:", error)
        return None

    finally:
        db.close()


def get_progress_history(limit=30):
    db = SessionLocal()

    try:
        return (
            db.query(ProgressLog)
            .order_by(ProgressLog.created_at.desc())
            .limit(limit)
            .all()
        )

    except Exception as error:
        print("PROGRESS HISTORY ERROR:", error)
        return []

    finally:
        db.close()