from fastapi import APIRouter

router = APIRouter()


@router.get("/analytics-test")
def analytics_test():

    return {
        "message":
        "Analytics routes working"
    }