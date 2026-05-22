from fastapi import APIRouter

router = APIRouter()


@router.get("/nutrition-test")
def nutrition_test():

    return {
        "message":
        "Nutrition routes working"
    }