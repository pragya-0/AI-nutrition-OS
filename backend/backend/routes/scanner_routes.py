from fastapi import APIRouter

router = APIRouter()


@router.get("/scanner-test")
def scanner_test():

    return {
        "message":
        "Scanner routes working"
    }